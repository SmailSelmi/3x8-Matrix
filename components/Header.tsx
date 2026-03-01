// components/Header.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
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
    setShowProfileMenu(false);
    onNavigate(tab);
  };

  return (
    <header className="p-6 flex flex-col gap-1 z-50 relative">
      <div className="flex justify-between items-center">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          {/* Profile Button + Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setShowNotifications(false);
                setShowProfileMenu((v) => !v);
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center text-blue-400 overflow-hidden transition-all ${
                showProfileMenu
                  ? "border-blue-500/60 ring-2 ring-blue-500/20"
                  : "bg-blue-500/20 border-blue-500/30"
              }`}
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
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />

                  {/* Dropdown Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute right-0 mt-2 w-64 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
                    dir="rtl"
                  >
                    {/* Top accent line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* ── Section 1: Personal Info ── */}
                    <div className="p-4 flex flex-col gap-3">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">
                        المعلومات الشخصية
                      </span>

                      {/* View Profile button */}
                      <button
                        onClick={() => handleNavigate("PROFILE")}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-500/8 border border-blue-500/15 text-blue-400 hover:bg-blue-500/15 transition-all group"
                      >
                        <span className="text-[11px] font-black uppercase tracking-widest">
                          عرض الملف الشخصي
                        </span>
                        <ChevronLeft
                          size={14}
                          className="group-hover:-translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 h-px bg-white/[0.06]" />

                    {/* ── Section 2: Settings ── */}
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">
                        الإعدادات
                      </span>

                      <button
                        onClick={() => handleNavigate("SETTINGS")}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:bg-white/[0.07] hover:text-slate-100 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 rounded-lg bg-violet-500/10 text-violet-400">
                            <Settings size={13} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            إعدادات التطبيق
                          </span>
                        </div>
                        <ChevronLeft
                          size={14}
                          className="text-slate-600 group-hover:text-slate-400 group-hover:-translate-x-0.5 transition-all"
                        />
                      </button>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Trois Huit - جدول المناوبات",
                    text: 'أنصحك بتجربة تطبيق "Trois Huit" لتنظيم مناوبات العمل الصناعي. تطبيق احترافي وسهل الاستخدام!',
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
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfileMenu(false);
                setShowNotifications(!showNotifications);
              }}
              className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
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
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-72 bg-[#0a1628]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
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
                  </motion.div>
                </>
              )}
            </AnimatePresence>
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
            {formatArabicDate(currentTime)}
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
          <span className="text-sm font-black font-mono text-slate-100">
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
