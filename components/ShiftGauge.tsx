// components/ShiftGauge.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShiftType } from '@/lib/shiftPatterns';

interface ShiftGaugeProps {
  cycleProgress: number;       // 0–1 overall cycle position
  shiftProgress: number;       // 0–1 current shift progress
  shiftType: ShiftType;
  cycleDay: number;
  totalCycleDays: number;
  hoursRemaining: number;
  color: string;
  isVacation?: boolean;
  vacationDay?: number;
  totalVacationDays?: number;
}

export default function ShiftGauge({
  cycleProgress,
  shiftProgress,
  shiftType,
  cycleDay,
  totalCycleDays,
  hoursRemaining,
  color,
  isVacation,
  vacationDay,
  totalVacationDays
}: ShiftGaugeProps) {
  
  const size = 280;
  const center = size / 2;
  const outerRadius = 110;
  const innerRadius = 85;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const displayDay = isVacation ? vacationDay : cycleDay;
  const displayTotal = isVacation ? totalVacationDays : totalCycleDays;
  const displayLabel = isVacation ? "اليوم في الإجازة" : "اليوم في الدورة";

  // Calculate more precise time remaining for the label
  const h = Math.floor(hoursRemaining);
  const m = Math.floor((hoursRemaining % 1) * 60);
  const timeLabel = h > 0 ? `${h} س و ${m} د` : `${m} دقيقة`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background Rings */}
        <circle
          cx={center} cy={center} r={outerRadius}
          fill="none" stroke="currentColor" strokeWidth="6"
          className="text-white/[0.03]"
        />
        <circle
          cx={center} cy={center} r={innerRadius}
          fill="none" stroke="currentColor" strokeWidth="4"
          className="text-white/[0.03]"
        />

        {/* Outer Ring: Cycle/Vacation Progress */}
        <motion.circle
          cx={center} cy={center} r={outerRadius}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={outerCircumference}
          initial={{ strokeDashoffset: outerCircumference }}
          animate={{ strokeDashoffset: outerCircumference * (1 - (isVacation ? (cycleProgress || 0) : cycleProgress)) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          className="opacity-40"
        />

        {/* Inner Ring: Shift/Day Progress */}
        <motion.circle
          cx={center} cy={center} r={innerRadius}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={innerCircumference}
          initial={{ strokeDashoffset: innerCircumference }}
          animate={{ strokeDashoffset: innerCircumference * (1 - shiftProgress) }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${color}60)` }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1"
        >
          {displayLabel}
        </motion.span>
        <div className="flex items-baseline gap-1">
          <motion.span 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-black text-slate-100 font-mono tracking-tighter"
          >
            {displayDay}
          </motion.span>
          <span className="text-xl font-black text-slate-600 font-mono">/</span>
          <span className="text-xl font-black text-slate-600 font-mono">{displayTotal}</span>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-[11px] font-bold text-slate-400"
        >
          {isVacation 
            ? ((displayTotal! - displayDay!) > 0 
                ? `باقي ${(displayTotal! - displayDay!)} يوم و ${h} س` 
                : `باقي ${h} س و ${m} د`)
            : `متبقي ${timeLabel}`}
        </motion.div>
      </div>
    </div>
  );
}
