// app/api/telegram-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// ─── VAPID config is applied at request-time, not module-load-time ──────────
// (Vercel build runs without env vars; calling setVapidDetails at module level
//  causes "No key set vapidDetails.publicKey" during build.)

// ─── Supabase server-side client (service role — bypasses RLS) ────────────────
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://iykvicqotfcjzovkwiyz.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
}

interface PushSubscriptionRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Configure VAPID at request-time (env vars are available here at runtime)
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@example.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );

    const body: TelegramUpdate = await req.json();
    const message = body?.message;

    // Telegram sends non-message updates (edited messages, etc.) — always 200
    if (!message) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const adminChatId = process.env.ADMIN_CHAT_ID;

    // ── Security: reject anyone who isn't the admin ────────────────────────────
    if (chatId !== adminChatId) {
      console.warn(`[webhook] Unauthorized chat_id: ${chatId}`);
      return NextResponse.json({ ok: true });
    }

    const text = message.text?.trim() ?? "";

    // ── Only handle /broadcast commands ───────────────────────────────────────
    if (!text.startsWith("/broadcast ")) {
      await sendTelegramMessage(
        chatId,
        "⚠️ الأمر غير معروف. استخدم:\n/broadcast رسالتك هنا",
      );
      return NextResponse.json({ ok: true });
    }

    const broadcastMessage = text.replace("/broadcast ", "").trim();
    if (!broadcastMessage) {
      await sendTelegramMessage(
        chatId,
        "⚠️ الرسالة فارغة. أضف نصاً بعد /broadcast",
      );
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // ── STEP 1: Save broadcast to DB (always, independent of push) ────────────
    const { error: insertError } = await supabase
      .from("broadcasts")
      .insert({ message: broadcastMessage });
    if (insertError) {
      console.error("[webhook] broadcasts insert error:", insertError);
    }

    // ── STEP 2: Clean broadcasts older than 7 days ────────────────────────────
    await supabase.from("broadcasts").delete().lt("created_at", sevenDaysAgo);

    // ── STEP 3: Fetch push subscriptions ─────────────────────────────────────
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth");

    if (fetchError) {
      console.error("[webhook] push_subscriptions fetch error:", fetchError);
      await sendTelegramMessage(
        chatId,
        `❌ خطأ في جلب المشتركين: ${fetchError.message}`,
      );
      return NextResponse.json({ ok: true });
    }

    const rows = (subscriptions as PushSubscriptionRow[]) ?? [];
    if (rows.length === 0) {
      await sendTelegramMessage(chatId, "ℹ️ لا يوجد مشتركون حتى الآن.");
      return NextResponse.json({ ok: true });
    }

    // ── STEP 4: Dispatch web push to all subscribers ──────────────────────────
    const payload = JSON.stringify({
      title: "Trois Huit | 3×8",
      body: broadcastMessage,
    });

    const staleIds: string[] = [];
    let successCount = 0;
    let failCount = 0;

    await Promise.allSettled(
      rows.map(async (row) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: row.endpoint,
              keys: { p256dh: row.p256dh, auth: row.auth },
            },
            payload,
          );
          successCount++;
        } catch (err: unknown) {
          const status = (err as { statusCode?: number })?.statusCode;
          if (status === 410 || status === 404) {
            staleIds.push(row.id);
          } else {
            console.error(`[webhook] Push failed for ${row.endpoint}:`, err);
          }
          failCount++;
        }
      }),
    );

    // ── STEP 5: Clean up stale subscriptions ─────────────────────────────────
    if (staleIds.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", staleIds);
      console.log(`[webhook] Removed ${staleIds.length} stale subscriptions.`);
    }

    // ── STEP 6: Report back to Telegram ──────────────────────────────────────
    const report =
      `✅ تم الإرسال!\n` +
      `👥 المشتركون: ${rows.length}\n` +
      `✔️ ناجح: ${successCount}\n` +
      (failCount > 0 ? `❌ فاشل: ${failCount}\n` : "") +
      (staleIds.length > 0
        ? `🗑 محذوف (منتهي الصلاحية): ${staleIds.length}`
        : "");

    await sendTelegramMessage(chatId, report);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook] Unhandled error:", err);
    return NextResponse.json({ ok: true });
  }
}

// ─── Helper: send a message back to Telegram ─────────────────────────────────
async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
