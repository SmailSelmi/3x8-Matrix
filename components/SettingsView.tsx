// components/SettingsView.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Moon,
  Zap,
  RotateCcw,
  Calendar,
  Layers,
  Trash2,
  Check,
  PieChart,
  Settings as SettingsIcon,
  Plus,
} from "lucide-react";
import GlassCard from "./GlassCard";
import DatePickerAr from "./DatePickerAr";
import { AppSettings } from "@/hooks/useAppSettings";
import { SystemType } from "@/lib/shiftPatterns";
import { format, addDays, differenceInDays } from "date-fns";
import BottomSheet from "./BottomSheet";

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export default function SettingsView({
  settings,
  updateSettings,
  resetSettings,
}: SettingsViewProps) {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [showAddLeave, setShowAddLeave] = React.useState(false);
  const [newLeaveStart, setNewLeaveStart] = React.useState<Date>(new Date());
  const [newLeaveDuration, setNewLeaveDuration] = React.useState<number>(1);
  const [usageType, setUsageType] = React.useState<"all" | "half" | "custom">(
    "custom",
  );
  const [showEditPool, setShowEditPool] = React.useState(false);
  const [tempPool, setTempPool] = React.useState<number>(
    settings.annualLeaveTotal || 30,
  );

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetSettings();
    setShowResetConfirm(false);
  };

  const annualLeaveConsumed = (settings.annualLeaveBlocks || []).reduce(
    (acc, block) => {
      return (
        acc + (differenceInDays(new Date(block.end), new Date(block.start)) + 1)
      );
    },
    0,
  );

  const remainingDays = Math.max(
    0,
    (settings.annualLeaveTotal || 30) - annualLeaveConsumed,
  );

  const handleAddLeave = () => {
    const startStr = format(newLeaveStart, "yyyy-MM-dd");
    const endDate = addDays(newLeaveStart, newLeaveDuration - 1);
    const endStr = format(endDate, "yyyy-MM-dd");

    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      start: startStr,
      end: endStr,
    };
    updateSettings({
      annualLeaveBlocks: [...(settings.annualLeaveBlocks || []), newBlock],
    });
    setShowAddLeave(false);
    setNewLeaveDuration(1);
    setUsageType("custom");
  };

  const removeLeaveBlock = (id: string) => {
    updateSettings({
      annualLeaveBlocks: settings.annualLeaveBlocks.filter((b) => b.id !== id),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-8" dir="rtl">
      {/* Shift Config Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Layers size={14} className="text-blue-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            إعدادات فترة العمل
          </h3>
        </div>
        <GlassCard className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                تاريخ مرجع الدورة (D1)
              </label>
              <DatePickerAr
                selectedDate={new Date(settings.cycleStartDate)}
                onChange={(date) =>
                  updateSettings({ cycleStartDate: format(date, "yyyy-MM-dd") })
                }
              />
              <p className="text-[9px] font-bold text-slate-600 mr-1">
                هذا التاريخ يمثل اليوم الأول (D1) في دورتك
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                نظام الدوام
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "3x8_industrial",
                    label: "نظام (3×8) الصناعي",
                    desc: "دورة من 3 أيام",
                  },
                  {
                    id: "5x2_admin",
                    label: "نظام (5×2) الإداري",
                    desc: "أحد - خميس",
                  },
                  {
                    id: "coming_soon",
                    label: "أنظمة أخرى",
                    desc: "قريباً...",
                    disabled: true,
                  },
                ].map((sys) => (
                  <button
                    key={sys.id}
                    disabled={sys.disabled}
                    onClick={() =>
                      !sys.disabled &&
                      updateSettings({ systemType: sys.id as SystemType })
                    }
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                      settings.systemType === sys.id
                        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5"
                        : sys.disabled
                          ? "bg-white/[0.01] border-white/5 opacity-50 grayscale cursor-not-allowed"
                          : "bg-white/[0.03] border-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-black ${settings.systemType === sys.id ? "text-blue-400" : "text-slate-200"}`}
                      >
                        {sys.label}
                      </span>
                      {settings.systemType === sys.id && (
                        <Check size={14} className="text-blue-500" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {sys.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
              فترة العمل في تاريخ المرجع
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 1, label: "اليوم الأول: مسائي (13-20)" },
                { id: 2, label: "اليوم الثاني: صباحي+ليلي" },
                { id: 3, label: "اليوم الثالث: راحة" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateSettings({ initialCycleDay: s.id })}
                  className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    settings.initialCycleDay === s.id
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-white/5 border-transparent text-slate-500"
                  }`}
                >
                  <span className="text-[10px] font-black text-center">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Rotation Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <RotateCcw size={14} className="text-purple-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            نظام التناوب (Work/Vacation)
          </h3>
        </div>
        <GlassCard className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                أيام العمل
              </label>
              <input
                type="number"
                value={settings.workDuration || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateSettings({
                    workDuration: val === "" ? 0 : parseInt(val),
                  });
                }}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all text-center"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                أيام الإجازة
              </label>
              <input
                type="number"
                value={settings.vacationDuration || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateSettings({
                    vacationDuration: val === "" ? 0 : parseInt(val),
                  });
                }}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all text-center"
              />
            </div>
          </div>

          <div
            onClick={() =>
              updateSettings({ addRouteDays: !settings.addRouteDays })
            }
            className={`flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 cursor-pointer hover:bg-white/[0.04] transition-all group active:scale-[0.98]`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-200 group-hover:text-white transition-colors">
                أيام الطريق (+2)
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                إضافة يومين للسفر إلى إجازتك
              </span>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all relative p-1 flex items-center ${settings.addRouteDays ? "bg-purple-600/20 border border-purple-500/50" : "bg-white/5 border border-white/10"}`}
            >
              <motion.div
                layout
                initial={false}
                animate={{
                  x: settings.addRouteDays ? -24 : 0,
                  backgroundColor: settings.addRouteDays
                    ? "#A855F7"
                    : "#475569",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full shadow-lg z-10"
              />
              <div
                className={`absolute inset-0 rounded-full transition-opacity duration-300 ${settings.addRouteDays ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Annual Leave Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-400" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              الإجازة السنوية (30+ يوم)
            </h3>
          </div>
          <button
            onClick={() => {
              setTempPool(settings.annualLeaveTotal || 30);
              setShowEditPool(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <SettingsIcon
              size={12}
              className="text-slate-400 group-hover:text-blue-400 transition-colors"
            />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              تعديل الرصيد
            </span>
          </button>
        </div>
        <GlassCard className="p-6 flex flex-col gap-6">
          {/* Progress Summary */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <PieChart size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  الرصيد المتبقي
                </span>
                <span className="text-lg font-black text-slate-100">
                  {remainingDays}{" "}
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    يوم
                  </span>
                </span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-500 uppercase block">
                المستهلك
              </span>
              <span className="text-sm font-black text-slate-300">
                {annualLeaveConsumed} / {settings.annualLeaveTotal || 30}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
              الفترات المضافة
            </label>
            {(settings.annualLeaveBlocks || []).length > 0 ? (
              <div className="flex flex-col gap-2">
                {settings.annualLeaveBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-200">
                        {format(new Date(block.start), "d MMM")} -{" "}
                        {format(new Date(block.end), "d MMM")}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500">
                        فترة محددة
                      </span>
                    </div>
                    <button
                      onClick={() => removeLeaveBlock(block.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl border border-dashed border-white/10">
                <span className="text-[10px] font-bold text-slate-600">
                  لم يتم إضافة أي فترات بعد
                </span>
              </div>
            )}

            <button
              onClick={() => {
                setNewLeaveDuration(1);
                setUsageType("custom");
                setShowAddLeave(true);
              }}
              className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة فترة إجازة سنوية
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Appearance Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Moon size={14} className="text-violet-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            المظهر — لون اللكنة
          </h3>
        </div>
        <GlassCard className="p-6">
          <div className="grid grid-cols-4 gap-3">
            {(
              [
                {
                  id: "blue",
                  label: "أزرق",
                  hex: "#3b82f6",
                  ring: "ring-blue-500",
                  bg: "bg-blue-500",
                },
                {
                  id: "emerald",
                  label: "زمردي",
                  hex: "#10b981",
                  ring: "ring-emerald-500",
                  bg: "bg-emerald-500",
                },
                {
                  id: "violet",
                  label: "بنفسجي",
                  hex: "#8b5cf6",
                  ring: "ring-violet-500",
                  bg: "bg-violet-500",
                },
                {
                  id: "amber",
                  label: "عنبري",
                  hex: "#f59e0b",
                  ring: "ring-amber-500",
                  bg: "bg-amber-500",
                },
              ] as const
            ).map((accent) => {
              const isActive = (settings.accentColor || "blue") === accent.id;
              return (
                <button
                  key={accent.id}
                  onClick={() => {
                    updateSettings({ accentColor: accent.id });
                    document.documentElement.setAttribute(
                      "data-accent",
                      accent.id,
                    );
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-white/[0.06] border-white/20"
                      : "bg-white/[0.02] border-transparent hover:border-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${accent.bg} flex items-center justify-center transition-all ${
                      isActive
                        ? `ring-2 ring-offset-2 ring-offset-[#020617] ${accent.ring} scale-110`
                        : "opacity-70"
                    }`}
                  >
                    {isActive && (
                      <Check size={18} className="text-white drop-shadow" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider transition-colors ${isActive ? "text-slate-200" : "text-slate-600"}`}
                  >
                    {accent.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] font-bold text-slate-600 text-center mt-4 leading-relaxed">
            يغيّر لون التوهج والحدود النشطة وعناصر التمييز في جميع الشاشات
          </p>
        </GlassCard>
      </section>

      {/* Preferences Section */}

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Zap size={14} className="text-orange-400" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            التفضيلات العامة
          </h3>
        </div>
        <GlassCard className="p-6 flex flex-col gap-6">
          <div
            onClick={() =>
              updateSettings({ notifications: !settings.notifications })
            }
            className="flex justify-between items-center group cursor-pointer hover:bg-white/[0.02] p-2 rounded-2xl transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl transition-all ${settings.notifications ? "bg-blue-500/10 text-blue-500" : "bg-white/5 text-slate-600"}`}
              >
                <Bell size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-200 group-hover:text-white transition-colors">
                  الإشعارات
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  تنبيهات فترة العمل والتحولات
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all relative p-1 flex items-center ${settings.notifications ? "bg-blue-600/20 border border-blue-500/50" : "bg-white/5 border border-white/10"}`}
            >
              <motion.div
                layout
                initial={false}
                animate={{
                  x: settings.notifications ? -24 : 0,
                  backgroundColor: settings.notifications
                    ? "#3B82F6"
                    : "#475569",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full shadow-lg z-10"
              />
            </div>
          </div>

          {/* Smart Notification Deep Config */}
          {settings.notifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-white/5 pt-4 flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                  وقت التنبيه (قبل بـ)
                </label>
                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSettings({ notificationLeadTime: mins });
                      }}
                      className={`flex-1 py-3 rounded-xl border text-xs font-black transition-all ${
                        settings.notificationLeadTime === mins
                          ? "bg-blue-600/10 border-blue-500 text-blue-400"
                          : "bg-white/5 border-transparent text-slate-500"
                      }`}
                    >
                      {mins === 60 ? "ساعة" : `${mins} د`}
                    </button>
                  ))}
                </div>
              </div>

              {typeof window !== "undefined" &&
                Notification.permission !== "granted" && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const granted = await Notification.requestPermission();
                      if (granted === "granted") {
                        const registration =
                          await navigator.serviceWorker.ready;
                        registration.showNotification(
                          "تم تفعيل الإشعارات! ✅",
                          {
                            body: "ستصلك تنبيهات قبل بداية كل مناوبة.",
                            icon: "/icons/icon-192.png",
                          } as any,
                        );
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/20 transition-all"
                  >
                    منح إذن الإشعارات للمتصفح
                  </button>
                )}
            </motion.div>
          )}

          <div
            onClick={() =>
              updateSettings({ hapticFeedback: !settings.hapticFeedback })
            }
            className="flex justify-between items-center group cursor-pointer hover:bg-white/[0.02] p-2 rounded-2xl transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl transition-all ${settings.hapticFeedback ? "bg-orange-500/10 text-orange-500" : "bg-white/5 text-slate-600"}`}
              >
                <Zap size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-200 group-hover:text-white transition-colors">
                  الاهتزاز (Haptic)
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  ملاحظات لمسية عند التفاعل
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-all relative p-1 flex items-center ${settings.hapticFeedback ? "bg-orange-600/20 border border-orange-500/50" : "bg-white/5 border border-white/10"}`}
            >
              <motion.div
                layout
                initial={false}
                animate={{
                  x: settings.hapticFeedback ? -24 : 0,
                  backgroundColor: settings.hapticFeedback
                    ? "#EA580C"
                    : "#475569",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full shadow-lg z-10"
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSettings({ language: "ar" })}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                settings.language === "ar"
                  ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400"
                  : "bg-white/5 border-transparent text-slate-500"
              }`}
            >
              <span className="text-xs font-black">العربية</span>
              <span className="text-[9px] font-bold opacity-50">AR</span>
            </button>
            <button
              onClick={() => updateSettings({ language: "en" })}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                settings.language === "en"
                  ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400"
                  : "bg-white/5 border-transparent text-slate-500"
              }`}
            >
              <span className="text-xs font-black">English</span>
              <span className="text-[9px] font-bold opacity-50">EN</span>
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Danger Zone */}
      <div className="mt-4">
        <button
          onClick={handleReset}
          className="w-full p-6 flex items-center justify-between bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
              <RotateCcw size={18} />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-red-400">
                إعادة تعيين كاملة
              </span>
              <span className="text-[10px] font-bold text-red-900/60 uppercase">
                مسح كافة الإعدادات والبيانات
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-red-500 opacity-50 group-hover:opacity-100 transition-opacity">
            تفعيل
          </span>
        </button>
      </div>

      <div className="text-center flex flex-col items-center gap-1 py-4">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
          Trois Huit v2.26
        </div>
        <div className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em]">
          By Smail Selmi
        </div>
      </div>

      {/* Premium Reset Confirmation */}
      <BottomSheet
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="إعادة تعيين البيانات"
      >
        <div className="flex flex-col gap-6 text-center py-4">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <RotateCcw size={40} />
          </div>
          <p className="text-slate-400 font-bold leading-relaxed">
            هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات؟ <br />
            <span className="text-red-500/60 text-xs">
              لا يمكن التراجع عن هذا الإجراء.
            </span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={confirmReset}
              className="py-4 px-6 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-black transition-all shadow-xl shadow-red-500/20"
            >
              حذف الكل
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Add Annual Leave BottomSheet */}
      <BottomSheet
        isOpen={showAddLeave}
        onClose={() => setShowAddLeave(false)}
        title="إضافة فترة إجازة سنوية"
      >
        <div className="flex flex-col gap-6 py-4" dir="rtl">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              تاريخ البداية
            </label>
            <DatePickerAr
              selectedDate={newLeaveStart}
              onChange={setNewLeaveStart}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              نوع الاستهلاك
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "all", label: "الكل", value: remainingDays },
                {
                  id: "half",
                  label: "النصف",
                  value: Math.floor(remainingDays / 2),
                },
                { id: "custom", label: "مخصص", value: newLeaveDuration },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setUsageType(opt.id as any);
                    if (opt.id !== "custom") {
                      setNewLeaveDuration(opt.value);
                    }
                  }}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    usageType === opt.id
                      ? "bg-emerald-600/10 border-emerald-500 text-emerald-400"
                      : "bg-white/5 border-transparent text-slate-500"
                  }`}
                >
                  <span className="text-xs font-black">{opt.label}</span>
                  <span className="text-[9px] font-bold opacity-50">
                    {opt.id === "custom" ? "..." : `${opt.value}ي`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {usageType === "custom" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                عدد الأيام
              </label>
              <input
                type="number"
                value={newLeaveDuration || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setNewLeaveDuration(Math.min(val, remainingDays));
                }}
                max={remainingDays}
                placeholder="مثلاً: 10"
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500 focus:bg-white/[0.04] transition-all"
              />
              <p className="text-[9px] font-bold text-slate-600 mr-1">
                المتبقي متاح: {remainingDays} يوم
              </p>
            </motion.div>
          )}

          <p className="text-[10px] font-bold text-slate-500 text-center px-6">
            سيتم احتساب {newLeaveDuration} يوم كإجازة سنوية وستظهر في التقويم كـ
            "إجازة".
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setShowAddLeave(false)}
              className="py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all"
            >
              إلغاء
            </button>
            <button
              disabled={newLeaveDuration <= 0}
              onClick={handleAddLeave}
              className={`py-4 px-6 rounded-2xl text-white font-black transition-all shadow-xl ${
                newLeaveDuration > 0
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                  : "bg-emerald-900/20 text-emerald-900 cursor-not-allowed shadow-none"
              }`}
            >
              تأكيد الإضافة
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Edit Pool BottomSheet */}
      <BottomSheet
        isOpen={showEditPool}
        onClose={() => setShowEditPool(false)}
        title="تعديل رصيد الإجازة السنوية"
      >
        <div className="flex flex-col gap-6 py-4" dir="rtl">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              عدد الأيام الإجمالي للعام
            </label>
            <input
              type="number"
              value={tempPool || ""}
              onChange={(e) => setTempPool(parseInt(e.target.value) || 0)}
              placeholder="افتراضي: 30"
              className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
            />
            <p className="text-[9px] font-bold text-slate-600 mr-1">
              أدخل إجمالي أيام الإجازة السنوية الممنوحة لك (مثلاً: 30 أو 45)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setShowEditPool(false)}
              className="py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                updateSettings({ annualLeaveTotal: tempPool });
                setShowEditPool(false);
              }}
              className="py-4 px-6 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black transition-all shadow-xl shadow-blue-500/20"
            >
              حفظ التعديل
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
