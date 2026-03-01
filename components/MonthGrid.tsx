// components/MonthGrid.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { arDZ } from "date-fns/locale";
import { SystemType, ShiftType } from "@/lib/shiftPatterns";
import { getShiftForDate } from "@/hooks/useShiftLogic";
import { Sun, Moon, Coffee } from "lucide-react";
import { getHolidayForDate } from "@/lib/dateUtils";

interface MonthGridProps {
  cycleStartDate: string;
  systemType: SystemType;
  initialCycleDay?: number;
  workDuration?: number;
  vacationDuration?: number;
  addRouteDays?: boolean;
  annualLeaveBlocks?: { id: string; start: string; end: string }[];
  workDurationExtension?: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
}

const SHIFT_ICONS: Record<ShiftType, React.ReactNode> = {
  day: <Moon size={10} className="text-amber-400" />,
  evening: <Sun size={10} className="text-purple-400" />,
  night: <Moon size={10} className="text-blue-400" />,
  rest: <Coffee size={10} className="text-slate-500" />,
  leave: <Coffee size={10} className="text-green-500" />,
};

const SHIFT_LABELS: Record<ShiftType, string> = {
  day: "صباحي + ليلي",
  evening: "مسائي",
  night: "ليلي",
  rest: "راحة",
  leave: "إجازة",
};

const WEEKDAYS = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export default function MonthGrid({
  cycleStartDate,
  systemType,
  initialCycleDay = 1,
  workDuration = 28,
  vacationDuration = 7,
  addRouteDays = false,
  annualLeaveBlocks = [],
  workDurationExtension = 0,
  selectedDate,
  onDateSelect,
  onMonthChange,
}: MonthGridProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    startOfMonth(selectedDate),
  );
  const [direction, setDirection] = React.useState(0);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const today = new Date();

  const handlePrevMonth = () => {
    setDirection(-1);
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
    onMonthChange?.(prev);
  };

  const handleNextMonth = () => {
    setDirection(1);
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full px-6 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-lg font-black text-slate-100 italic tracking-tighter">
          {format(currentMonth, "MMMM yyyy", { locale: arDZ })}
        </h3>
      </div>

      <div className="relative overflow-hidden min-h-[300px] touch-none">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              if (swipe < -50) {
                handlePrevMonth();
              } else if (swipe > 50) {
                handleNextMonth();
              }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-7 gap-1"
          >
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-black text-slate-600 uppercase py-2"
              >
                {day}
              </div>
            ))}

            {days.map((date, idx) => {
              const isCurrentMonth = isSameMonth(date, monthStart);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const shiftType = getShiftForDate(
                date,
                cycleStartDate,
                systemType,
                initialCycleDay,
                workDuration,
                vacationDuration,
                addRouteDays,
                annualLeaveBlocks,
                workDurationExtension,
              );
              const holiday = getHolidayForDate(date);

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDateSelect(date)}
                  style={
                    isSelected
                      ? {
                          backgroundColor: "var(--accent-glow)",
                          borderColor: "var(--accent-border)",
                        }
                      : {}
                  }
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                    relative border
                    ${!isCurrentMonth ? "opacity-10 pointer-events-none" : ""}
                    ${isSelected ? "shadow-lg" : "bg-white/[0.02] border-transparent"}
                  `}
                >
                  <div className="relative flex flex-col items-center">
                    <span
                      style={isSelected ? { color: "var(--accent-text)" } : {}}
                      className={`text-sm font-black font-mono ${isSelected ? "" : isToday ? "text-white" : "text-slate-400"}`}
                    >
                      {format(date, "d")}
                    </span>
                    {holiday && (
                      <span
                        className="absolute -top-1.5 -right-3 text-[8px]"
                        title={holiday.name}
                      >
                        {holiday.icon}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center h-4">
                    {SHIFT_ICONS[shiftType]}
                  </div>

                  {isToday && !isSelected && (
                    <div
                      className="absolute top-1 right-1 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 py-3 border-t border-white/5 mt-2">
        {Object.entries(SHIFT_ICONS).map(([type, icon]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 opacity-80 scale-95"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {icon}
            </div>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">
              {SHIFT_LABELS[type as ShiftType]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
