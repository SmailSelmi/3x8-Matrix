// hooks/usePushSubscription.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const LOCAL_FLAG = "push_subscribed";

// Converts a base64 VAPID public key string to an ArrayBuffer
// required by pushManager.subscribe()
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    arr[i] = rawData.charCodeAt(i);
  }
  return arr.buffer as ArrayBuffer;
}

export type PermissionState =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "error";

export interface UsePushSubscriptionReturn {
  isSubscribed: boolean;
  permissionState: PermissionState;
  error: string | null;
  subscribe: () => Promise<void>;
}

export function usePushSubscription(): UsePushSubscriptionReturn {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("idle");
  const [error, setError] = useState<string | null>(null);

  // On mount: check the localStorage flag — if already subscribed, skip modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = localStorage.getItem(LOCAL_FLAG);
      if (flag === "true") {
        setIsSubscribed(true);
        setPermissionState("granted");
      }
    }
  }, []);

  const subscribe = useCallback(async () => {
    setError(null);
    setPermissionState("loading");

    try {
      // 1. Check browser support
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("المتصفح لا يدعم الإشعارات الفورية.");
      }

      // 2. Request browser permission
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setPermissionState("denied");
        return;
      }
      if (permission !== "granted") {
        // User dismissed without choosing (e.g., pressed Esc)
        setPermissionState("idle");
        return;
      }

      // 3. Get the active service worker registration
      const registration = await navigator.serviceWorker.ready;

      // 4. Check if already subscribed at the SW level to avoid duplicate DB rows
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey)
          throw new Error("VAPID public key is not configured.");

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      // 5. Serialize the subscription
      const subJson = subscription.toJSON();
      const endpoint = subJson.endpoint!;
      const p256dh = subJson.keys?.p256dh!;
      const auth = subJson.keys?.auth!;

      // 6. Upsert into Supabase (on conflict: update keys in case they rotated)
      const { error: dbError } = await supabase
        .from("push_subscriptions")
        .upsert({ endpoint, p256dh, auth }, { onConflict: "endpoint" });

      if (dbError) throw new Error(dbError.message);

      // 7. Persist flag locally so we don't show the modal again
      localStorage.setItem(LOCAL_FLAG, "true");
      setIsSubscribed(true);
      setPermissionState("granted");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      setError(message);
      setPermissionState("error");
    }
  }, []);

  return { isSubscribed, permissionState, error, subscribe };
}
