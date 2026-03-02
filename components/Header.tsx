// components/Header.tsx
"use client";

import React from "react";
import { User, Bell, Share2, Settings, ChevronLeft, X } from "lucide-react";
import { formatArabicDate, getHijriDate } from "@/lib/dateUtils";
import { NavTab } from "./BottomNav";
import { useInAppNotifications } from "@/hooks/useInAppNotifications";

interface HeaderProps {
  userName: string;
  profileImage?: string | null;
  currentTime: Date;
  onNavigate: (tab: NavTab) => void;
}

export default function Header({
  userName,
  profileImage,
  currentTime,
  onNavigate,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const { notifications, dismissNotification, isLoading } =
    useInAppNotifications();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "صباح الخير";
    if (hour >= 12 && hour < 17) return "طاب يومك";
    if (hour >= 17 && hour < 21) return "مساء الخير";
    return "ليلة سعيدة";
  };

  const handleNavigate = (tab: NavTab) => {
    onNavigate(tab);
  };

  return (
    <header className="p-6 flex flex-col gap-1 z-50 relative">
      <div className="flex justify-between items-center">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          {/* Profile Button + Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(false);
                handleNavigate("PROFILE");
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center text-blue-400 overflow-hidden transition-all bg-blue-500/20 border-blue-500/30 hover:border-blue-500/60 hover:ring-2 hover:ring-blue-500/20 active:scale-95"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {getGreeting()}
            </span>
            <span className="text-sm font-black text-slate-100">
              {userName || "زميل العمل"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Trois Huit - جدول المناوبات",
                    text: "ودّع فوضى جداول العمل، واستقبل تنظيماً أكثر كفاءة واحترافية مع تطبيق Trois Huit — المساعد الذكي لإدارة نظام المناوبات.\n\nماذا يقدّم لك التطبيق؟\n\n✅ حساب دقيق وفوري لجداول المناوبات وفق نظام عملك.\n🌴 إدارة تلقائية لرصيد الإجازات الشهرية والسنوية بكل شفافية.\n📅 أجندة متكاملة تتضمن العطل الوطنية والمناسبات الإسلامية لتخطيط أفضل.\n🔔 تنبيهات وإشعارات فورية لضمان عدم تفويت أي موعد أو مناوبة.\n\nتطبيق خفيف وسهل الاستخدام، لا يتطلب إنشاء حساب، ومتاح مجاناً بالكامل.\n\nابدأ الآن بتنظيم وقتك بكفاءة أعلى، وشاركه مع زملائك ليستفيد الجميع.",
                    url: window.location.origin,
                  })
                  .catch(() => {
                    // Fallback for failed share or user cancel
                  });
              } else {
                alert("الرابط: " + window.location.origin);
              }
            }}
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-400 transition-all"
          >
            <Share2 size={20} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => handleNavigate("SETTINGS")}
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center justify-center hover:bg-violet-600/20 hover:border-violet-500 hover:text-violet-400 transition-all active:scale-95"
          >
            <Settings size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                showNotifications
                  ? "bg-blue-600/20 border-blue-500 text-blue-400"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400"
              }`}
            >
              <Bell size={20} />
              {/* Unread badge */}
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm animate-fade-in"
                  onClick={() => setShowNotifications(false)}
                />
                <div
                  className="absolute end-0 mt-2 w-72 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden animate-fade-in"
                  dir="rtl"
                >
                  {/* accent line */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                  <div className="p-3 flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] px-1">
                      الإشعارات
                    </span>

                    {isLoading ? (
                      <p className="text-[10px] font-bold text-slate-500 text-center py-3">
                        ...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center py-3 leading-relaxed">
                        لا توجد إشعارات حالياً
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-200 leading-relaxed break-words">
                              {n.message}
                            </p>
                            <span className="text-[9px] font-bold text-slate-600 mt-0.5 block">
                              {new Date(n.created_at).toLocaleDateString(
                                "ar-DZ",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="flex-shrink-0 p-0.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/10 transition-all mt-0.5"
                            title="إخفاء"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Date Bar */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex flex-col items-start">
          <span
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"
            suppressHydrationWarning
          >
            {new Intl.DateTimeFormat("ar-DZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(currentTime)}
          </span>
          <span
            className="text-[14px] font-black text-blue-500 mt-0.5"
            suppressHydrationWarning
          >
            {getHijriDate(currentTime)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-lg font-medium font-mono text-slate-100">
            {currentTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
