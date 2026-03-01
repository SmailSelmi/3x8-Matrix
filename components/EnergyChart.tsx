"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Battery,
  BatteryCharging,
  Activity,
  Sun,
  Moon,
  Briefcase,
} from "lucide-react";
import { SystemType, ShiftType } from "@/lib/shiftPatterns";

interface EnergyChartProps {
  currentShiftOffset: number;
  systemType?: SystemType;
  shiftType: ShiftType;
}

export default function EnergyChart({
  currentShiftOffset,
  systemType = "3x8_industrial",
  shiftType,
}: EnergyChartProps) {
  const getLevels = () => {
    if (systemType === "5x2_admin") {
      if (shiftType === "rest")
        return { level: 100, label: "راحة إسبوعية", color: "text-emerald-400" };
      if (shiftType === "leave")
        return { level: 100, label: "إجازة", color: "text-emerald-400" };

      // Split hours logic for Admin (approximate for display)
      const hour = new Date().getHours();
      if (hour >= 8 && hour < 12)
        return { level: 85, label: "فترة الصباح", color: "text-blue-400" };
      if (hour >= 12 && hour < 14)
        return { level: 60, label: "إستراحة غداء", color: "text-yellow-400" };
      if (hour >= 14 && hour < 17)
        return { level: 75, label: "فترة المساء", color: "text-blue-400" };
      return { level: 95, label: "خارج الدوام", color: "text-indigo-400" };
    }

    // 3x8 System
    if (shiftType === "rest" || shiftType === "leave")
      return { level: 100, label: "إسترجاع الطاقة", color: "text-emerald-400" };
    if (shiftType === "evening")
      return { level: 70, label: "نشاط متوسط", color: "text-yellow-400" };
    if (shiftType === "night")
      return { level: 30, label: "مجهود عالٍ", color: "text-red-400" };

    return { level: 50, label: "نشاط", color: "text-slate-400" };
  };

  const status = getLevels();

  return (
    <div className="w-full h-full flex flex-col group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${status.color}`}
          >
            <Activity size={14} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
            البوصلة الحيوية
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Animated Wave Background */}
        <svg viewBox="0 0 200 100" className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>

          <motion.path
            d="M 0 50 Q 50 10, 100 50 T 200 50"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            className={status.color}
            animate={{
              d: [
                "M 0 50 Q 50 10, 100 50 T 200 50",
                "M 0 50 Q 50 90, 100 50 T 200 50",
                "M 0 50 Q 50 10, 100 50 T 200 50",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Current Point Marker */}
          <motion.circle
            cx="100"
            cy="50"
            r="4"
            className={status.color}
            fill="currentColor"
          />
          <motion.circle
            cx="100"
            cy="50"
            r="12"
            className={status.color}
            fill="currentColor"
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>

        {/* Big Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`text-4xl lg:text-5xl font-black tracking-tighter tabular-nums ${status.color}`}
          >
            {status.level}%
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] font-bold opacity-40 uppercase tracking-widest">
        <span>
          {systemType === "5x2_admin" ? "النظام الإداري" : `دورة الصناعة`}
        </span>
        {status.level === 100 ? (
          <BatteryCharging size={14} className="text-emerald-400" />
        ) : (
          <Battery size={14} />
        )}
      </div>
    </div>
  );
}
