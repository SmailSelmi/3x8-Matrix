// components/QuickStats.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, Bed, Target as TargetIcon } from "lucide-react";
import GlassCard from "./GlassCard";

interface QuickStatsProps {
  hoursThisMonth: number;
  shiftsCompleted: number;
  restDaysRemaining: number;
  completionPercent: number;
}

export default function QuickStats({
  hoursThisMonth,
  shiftsCompleted,
  restDaysRemaining,
  completionPercent,
}: QuickStatsProps) {
  const stats = [
    {
      label: "ساعات الشهر",
      value: hoursThisMonth,
      unit: "ساعة",
      icon: <Zap size={18} />,
      color: "text-amber-500",
      delay: 0,
    },
    {
      label: "فترة عمل منجزة",
      value: shiftsCompleted,
      unit: "",
      icon: <CheckCircle2 size={18} />,
      color: "text-indigo-500",
      delay: 80,
    },
    {
      label: "راحة قادمة",
      value: restDaysRemaining,
      unit: "أيام",
      icon: <Bed size={18} />,
      color: "text-blue-500",
      delay: 160,
    },
    {
      label: "نسبة الإنجاز",
      value: completionPercent,
      unit: "%",
      icon: <TargetIcon size={18} />,
      color: "text-emerald-500",
      delay: 240,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full px-6 py-4">
      {stats.map((stat, index) => (
        <GlassCard
          key={index}
          className="p-5 flex flex-col gap-3"
          animate={false}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay / 1000 + 0.5 }}
            className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center ${stat.color}`}
          >
            {stat.icon}
          </motion.div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-100 font-mono">
                {stat.value}
              </span>
              <span className="text-[10px] font-black text-slate-500">
                {stat.unit}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter mt-1">
              {stat.label}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
