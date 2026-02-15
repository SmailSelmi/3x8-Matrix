"use client";

import React, { useMemo } from "react";
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay, isSameDay } from "date-fns";
import { arDZ } from "date-fns/locale";
import { motion } from "framer-motion";

interface YearlyHeatmapProps {
  year: number;
  startDateStr: string;
  startShiftOffset: number;
}

export default function YearlyHeatmap({ year, startDateStr, startShiftOffset }: YearlyHeatmapProps) {
  // 1. Generate all days for the year
  const days = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [year]);

  // 2. Calculate Shift for each day
  // Using the logic: (diffDays + startShiftOffset) % 3
  // 0: All Shift (Afternoon/Morning?) -> Wait, logic is 0=Afternoon, 1=Double, 2=Rest based on user's pattern
  // Note: We need to parse startDateStr correctly.
  
  const getShiftType = (date: Date) => {
     if (!startDateStr) return null;
     const [y, m, d] = startDateStr.split('-').map(Number);
     const cycleStart = new Date(y, m - 1, d);
     
     // Calculate difference in days
     // We need to be careful with timezones, so let's use UTC or set hours to 0
     const target = new Date(date);
     target.setHours(0,0,0,0);
     cycleStart.setHours(0,0,0,0);
     
     const diffTime = target.getTime() - cycleStart.getTime();
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
     
     // Modulo logic
     const phase = (diffDays + startShiftOffset) % 3;
     // Handle negative modulo correctly for past dates if needed, but start date is usually recent.
     // JavaScript % can be negative.
     const safePhase = ((phase % 3) + 3) % 3;
     
     return safePhase;
  };

  const getShiftColor = (type: number | null) => {
    if (type === null) return "bg-gray-100 dark:bg-slate-800";
    if (type === 0) return "bg-orange-400"; // Afternoon
    if (type === 1) return "bg-red-500";    // Double
    if (type === 2) return "bg-blue-400";   // Rest
    return "bg-gray-200";
  };

  // Group by months for generic 'Github' style or just a pure Grid?
  // User asked for "Github style heatmap".
  // GitHub uses columns = weeks. Rows = days (Sun-Sat).
  
  // Let's implement the Week-Column view.
  
  // We need to determine the grid position for each day.
  // weekIndex (x), dayIndex (y)
  
  // Helper to group days into columns (weeks)
  const weeks = useMemo(() => {
     const weekMap: Date[][] = [];
     let currentWeek: Date[] = [];
     
     // Pad the first week if the year doesn't start on Saturday (Arabic locale start?)
     // Let's assume Saturday start for Algeria/Arabic
     const firstDay = days[0];
     const firstDayOfWeek = (getDay(firstDay) + 1) % 7; // getDay: 0=Sun, 6=Sat. We want 0=Sat?
     // Actually, standard getDay returns 0 for Sunday.
     // In Arabic locale, week starts on Saturday?
     // arDZ week starts on Saturday? check date-fns logic or just visual preference.
     // Let's stick to standard visual: Sun-Sat or Sat-Fri.
     // date-fns getDay: 0=Sun, 1=Mon, ..., 6=Sat.
     // Let's map 6->0 (Sat), 0->1 (Sun) for vertical alignment if we want Sat on top.
     // Simple approach: Use standard 0-6 (Sun-Sat) for Y axis.
     
     days.forEach((day) => {
        if (getDay(day) === 6 && currentWeek.length > 0) { // New week on Saturday? No, standard is Sunday new week usually.
            // Let's use getDay() === 6 (Saturday) as end of week?
            // If we want Saturday to be the *first* row...
        }
        // Let's just create a flat list and render via grid css
     });
     
     return days; // Simplest is just mapping 365 squares in a flex wrap or grid
  }, [days]);

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <div className="min-w-[700px]">
          <h3 className="text-lg font-black mb-4">نظرة عامة على سنة {year}</h3>
          
          <div className="flex gap-1">
             {/* Legend */}
             <div className="flex items-center gap-2 text-xs mb-2">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-orange-400"/> مساء</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500"/> ليل/مزدوج</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-blue-400"/> راحة</span>
             </div>
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-[2px]">
             {/* We render column by column (weeks) -> grid-flow-col */}
             {/* We need to insert empty cells for the offset of the first week */}
             {Array.from({ length: (getDay(days[0]) + 1) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="w-3 h-3 md:w-4 md:h-4" />
             ))}
             
             {days.map((day) => {
                const shiftType = getShiftType(day);
                return (
                   <motion.div
                      key={day.toISOString()}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      className={`
                         w-3 h-3 md:w-4 md:h-4 rounded-[1px] md:rounded-sm cursor-pointer
                         ${getShiftColor(shiftType)}
                         opacity-80 hover:opacity-100 transition-colors
                      `}
                      title={`${format(day, 'dd MMMM yyyy', { locale: arDZ })} - ${
                          shiftType === 0 ? 'مساء' : shiftType === 1 ? 'ليل' : 'راحة'
                      }`}
                   />
                );
             })}
          </div>
      </div>
    </div>
  );
}
