"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  Award,
  TrendingUp,
  Clock,
  PieChart,
  Activity,
} from "lucide-react";
import { AppSettings } from "@/hooks/useAppSettings";

interface ProfileViewProps {
  settings: AppSettings;
  shiftData: {
    label: string;
    daysPassed: number;
    daysRemaining: number;
    type: string;
  };
}

export default function ProfileView({ settings, shiftData }: ProfileViewProps) {
  // Stats Calculation Helpers
  const totalWorkDays = settings.systemType === "3x8_industrial" ? 30 : 22;
  const progress = Math.min(100, (shiftData.daysPassed / totalWorkDays) * 100);

  // Hours Crushed (7h/day average for admin, similar for shift)
  const hoursCrushed = shiftData.daysPassed * 7;
  const totalTargetHours = totalWorkDays * 7;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-32">
      {/* Header / Identity */}
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User size={48} />
          </div>
        </motion.div>

        <div>
          <h2 className="text-3xl font-black italic">
            {settings.userName || "زميل العمل"}
          </h2>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 glass-card rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-2">
            <Clock size={20} />
          </div>
          <div className="text-2xl font-black">{hoursCrushed}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            ساعات العمل 🔥
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 glass-card rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl mb-2">
            <TrendingUp size={20} />
          </div>
          <div className="text-2xl font-black">{Math.round(progress)}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            تحقيق الهدف 🚀
          </div>
        </motion.div>
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-2 p-6 glass-card rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Activity size={18} />
            </div>
            <h3 className="font-bold">الحالة الحالية</h3>
          </div>
          <span className="text-xs font-black text-indigo-500">
            {shiftData.label}
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 px-1">
              <span>أنجزت</span>
              <span>تبقي</span>
            </div>
            <div className="h-5 w-full bg-slate-100 dark:bg-slate-950/50 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center pt-2">
            <div>
              <div className="text-xl font-black">{shiftData.daysPassed}</div>
              <div className="text-[9px] font-bold text-slate-400">
                أيام العمل المنقضية
              </div>
            </div>
            <div>
              <div className="text-xl font-black">
                {shiftData.daysRemaining}
              </div>
              <div className="text-[9px] font-bold text-slate-400">
                أيام العمل المتبقية
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="text-center">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-full inline-flex border border-slate-200 dark:border-white/5">
          <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em]">
            Trois Huit Dashboard Premium
          </p>
        </div>
      </div>
    </div>
  );
}
