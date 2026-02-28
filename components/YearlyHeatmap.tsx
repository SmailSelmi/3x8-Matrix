"use client";

import React, { useMemo } from "react";
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay } from "date-fns";
import { arDZ } from "date-fns/locale";
import { motion } from "framer-motion";

interface YearlyHeatmapProps {
  year: number;
  startDateStr: string;
  startShiftOffset: number;
}

export default function YearlyHeatmap({ year, startDateStr, startShiftOffset }: YearlyHeatmapProps) {
  const days = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [year]);

  const getShiftType = (date: Date) => {
     if (!startDateStr) return null;
     const [y, m, d] = startDateStr.split('-').map(Number);
     const cycleStart = new Date(y, m - 1, d);
     const target = new Date(date);
     target.setHours(0,0,0,0);
     cycleStart.setHours(0,0,0,0);
     
     const diffDays = Math.floor((target.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
     const safePhase = (( (diffDays + startShiftOffset) % 3) + 3) % 3;
     return safePhase;
  };

  const colors = {
    0: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]",
    1: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
    2: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]"
  };

  return (
    <div className="w-full h-full p-2 overflow-x-auto selection:bg-transparent">
      <div className="min-w-[800px]">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">خريطة المسار السنوي - {year}</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400" /> مساء</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> مزدوج</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /> راحة</div>
              </div>
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
             {/* Offset logic */}
             {Array.from({ length: (getDay(days[0]) + 1) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="w-3.5 h-3.5" />
             ))}
             
             {days.map((day, idx) => {
                const type = getShiftType(day);
                const shiftLabel = type === 0 ? 'مساء' : type === 1 ? 'ليل' : 'راحة';
                
                return (
                   <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.001 }}
                      whileHover={{ scale: 1.8, zIndex: 50, borderRadius: "4px" }}
                      className={`
                         w-3.5 h-3.5 rounded-[2px] cursor-pointer relative group
                         ${type !== null ? (colors[type as keyof typeof colors] || "bg-slate-200 dark:bg-slate-800") : "bg-slate-100 dark:bg-slate-900"}
                      `}
                   >
                       {/* Tooltip */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                           {format(day, 'dd MMM', { locale: arDZ })}: {shiftLabel}
                       </div>
                   </motion.div>
                );
             })}
          </div>
      </div>
    </div>
  );
}
