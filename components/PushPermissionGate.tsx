// components/PushPermissionGate.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { usePushSubscription } from "@/hooks/usePushSubscription";

interface PushPermissionGateProps {
  children: React.ReactNode;
}

export default function PushPermissionGate({
  children,
}: PushPermissionGateProps) {
  const { isSubscribed, permissionState, error, subscribe } =
    usePushSubscription();
  // Track whether the gate has been resolved this session
  const [resolved, setResolved] = useState(false);

  // Once subscription is confirmed, hide the gate with a small delay
  useEffect(() => {
    if (isSubscribed) {
      // Small delay so the success state is visible briefly
      const t = setTimeout(() => setResolved(true), 800);
      return () => clearTimeout(t);
    }
  }, [isSubscribed]);

  // const showGate = !resolved && !isSubscribed;
  const showGate = false; // Temporarily disabled for local development

  return (
    <>
      <>
        {showGate && (
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden animate-fade-in"
            style={{ backgroundColor: "#020617" }}
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[100px]" />
            </div>

            {/* Card */}
            <div
              className="relative z-10 flex flex-col items-center text-center max-w-sm w-full mx-6 px-8 py-10 rounded-3xl animate-slide-up-modal"
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {/* Icon cluster */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  {permissionState === "loading" && (
                    <div className="animate-zoom-in">
                      <Loader2
                        size={40}
                        className="text-blue-400 animate-spin"
                      />
                    </div>
                  )}
                  {permissionState === "granted" && (
                    <div className="animate-zoom-in">
                      <ShieldCheck size={40} className="text-emerald-400" />
                    </div>
                  )}
                  {permissionState === "denied" && (
                    <div className="animate-zoom-in">
                      <BellOff size={40} className="text-red-400" />
                    </div>
                  )}
                  {(permissionState === "idle" ||
                    permissionState === "error") && (
                    <div className="animate-zoom-in">
                      <Bell size={40} className="text-blue-400" />
                    </div>
                  )}
                </div>
                {/* Pulsing ring */}
                {(permissionState === "idle" ||
                  permissionState === "error") && (
                  <span className="absolute inset-0 rounded-3xl bg-blue-500/20 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Content — switches based on permission state */}
              <>
                {/* ── DENIED ── */}
                {permissionState === "denied" && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <h2 className="text-xl font-black text-slate-100 leading-tight">
                      الإشعارات مرفوضة
                    </h2>
                    <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-right">
                      <AlertTriangle
                        size={16}
                        className="text-red-400 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-xs font-bold text-red-300 leading-relaxed">
                        لقد رفضت الإذن. يرجى تفعيله يدوياً من إعدادات المتصفح:
                        <br />
                        <span className="text-slate-400 font-medium">
                          إعدادات المتصفح ← الخصوصية والأمان ← إعدادات الموقع ←
                          الإشعارات ← السماح لهذا الموقع
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={subscribe}
                      className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-black text-sm transition-all active:scale-95"
                    >
                      حاول مجدداً
                    </button>
                  </div>
                )}

                {/* ── GRANTED (brief success) ── */}
                {permissionState === "granted" && (
                  <div className="flex flex-col items-center gap-3 animate-fade-in">
                    <h2 className="text-xl font-black text-emerald-400">
                      تم التفعيل!
                    </h2>
                    <p className="text-sm font-bold text-slate-400">
                      جارٍ فتح التطبيق…
                    </p>
                  </div>
                )}

                {/* ── ERROR ── */}
                {permissionState === "error" && (
                  <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <h2 className="text-xl font-black text-slate-100">
                      حدث خطأ
                    </h2>
                    <p className="text-xs font-bold text-red-400 leading-relaxed px-2">
                      {error}
                    </p>
                    <button
                      onClick={subscribe}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-black text-sm transition-all active:scale-95"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                )}

                {/* ── DEFAULT: idle or loading ── */}
                {(permissionState === "idle" ||
                  permissionState === "loading") && (
                  <div className="flex flex-col items-center gap-5 w-full animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-black text-slate-100 leading-tight mb-2">
                        تنبيهات المناوبة
                      </h2>
                      <p className="text-sm font-bold text-slate-500 leading-relaxed">
                        فعّل الإشعارات لتلقي تحديثات فورية حول جدول عملك
                        ومناوباتك مباشرةً على هاتفك.
                      </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-col gap-2 w-full text-right">
                      {[
                        { icon: "🔔", text: "إشعارات فورية عند تغيير الجدول" },
                        { icon: "📅", text: "تذكير بمواعيد المناوبات القادمة" },
                        { icon: "🔒", text: "لا حاجة لحساب — مجاني تماماً" },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-xs font-bold text-slate-400">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA button */}
                    <button
                      onClick={subscribe}
                      disabled={permissionState === "loading"}
                      className="relative w-full py-5 rounded-2xl font-black text-base text-white overflow-hidden transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
                      style={{
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                        boxShadow: "0 0 40px rgba(99,102,241,0.35)",
                      }}
                    >
                      {/* Shimmer */}
                      <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
                      {permissionState === "loading" ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          جارٍ التفعيل…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Bell size={18} />
                          تفعيل تنبيهات المناوبة
                        </span>
                      )}
                    </button>

                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                      هذه الإشعارات ضرورية لاستخدام التطبيق. لن يتم إرسال بريد
                      عشوائي أبداً.
                    </p>
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </>

      {/* App is rendered in the DOM always but visually hidden by the gate overlay */}
      {children}
    </>
  );
}
