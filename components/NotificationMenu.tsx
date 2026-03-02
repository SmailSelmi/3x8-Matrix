// components/NotificationMenu.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Bell, RefreshCw, X, Info } from "lucide-react";
import { useInAppNotifications } from "@/hooks/useInAppNotifications";
import { usePwaUpdate } from "@/hooks/usePwaUpdate";

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, dismissNotification, isLoading } =
    useInAppNotifications();
  const { isUpdateAvailable, updateApp } = usePwaUpdate();

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine the display array
  const displayNotifications = useMemo(() => {
    // Shape Supabase notifications into a common UI model
    const allNotifs = notifications.map((n) => ({
      id: n.id,
      title: "إشعار جديد",
      message: n.message,
      created_at: n.created_at,
      type: "supabase",
      read: false,
    }));

    if (isUpdateAvailable) {
      allNotifs.unshift({
        id: "local-pwa-update",
        title: "تحديث التطبيق متاح",
        message: "يتوفر إصدار جديد من التطبيق. انقر هنا للتحديث.",
        created_at: new Date().toISOString(),
        type: "pwa-update",
        read: false,
      });
    }

    return allNotifs;
  }, [notifications, isUpdateAvailable]);

  const hasUnread = displayNotifications.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
          isOpen
            ? "bg-blue-600/20 border-blue-500 text-blue-400"
            : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/10"
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
            {displayNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm animate-fade-in md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute end-0 mt-2 w-80 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden animate-fade-in"
            dir="rtl"
          >
            {/* accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="p-3 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] px-1 sticky top-0 bg-[#0a1628]/95 py-2 z-10 backdrop-blur-md">
                الإشعارات
              </span>

              {isLoading ? (
                <p className="text-[10px] font-bold text-slate-500 text-center py-3">
                  ...
                </p>
              ) : displayNotifications.length === 0 ? (
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center py-6 leading-relaxed flex flex-col items-center gap-2">
                  <Bell size={24} className="opacity-20" />
                  لا توجد إشعارات حالياً
                </p>
              ) : (
                displayNotifications.map((n) => {
                  const isPwa = n.type === "pwa-update";

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (isPwa) {
                          updateApp();
                        }
                      }}
                      className={`flex items-start gap-3 border rounded-xl px-3 py-2.5 transition-all text-right
                        ${
                          isPwa
                            ? "bg-blue-600/20 border-blue-500/50 cursor-pointer hover:bg-blue-600/30 group"
                            : "bg-white/[0.03] border-white/[0.06]"
                        }
                      `}
                    >
                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-0.5">
                        <p
                          className={`text-[12px] font-bold leading-relaxed break-words mb-1 ${
                            isPwa ? "text-blue-300" : "text-slate-200"
                          }`}
                        >
                          {n.message}
                        </p>
                        <span className="text-[9px] font-bold text-slate-500 block">
                          {isPwa
                            ? "تحديث النظام"
                            : new Date(n.created_at).toLocaleDateString(
                                "ar-DZ",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5 ml-0">
                        {isPwa ? (
                          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-full group-hover:bg-blue-500/30 transition-colors">
                            <RefreshCw
                              size={14}
                              className="animate-spin-slow"
                            />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-white/5 text-slate-400 rounded-full">
                            <Info size={14} />
                          </div>
                        )}
                      </div>

                      {/* Close / Dismiss Action for standard notifications */}
                      {!isPwa && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.id);
                          }}
                          className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all"
                          title="إخفاء"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </>
      )}
    </div>
  );
}
