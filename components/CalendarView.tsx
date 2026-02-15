"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  getDay,
  addDays,
  subDays,
  startOfToday,
  differenceInDays,
  startOfDay,
  isBefore,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { arDZ } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sun,
  RefreshCw,
  Moon,
  Home,
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Star,
  Flag,
} from "lucide-react";
import { ShiftType } from "@/hooks/useShiftLogic";
import { useHolidays } from "@/hooks/useHolidays";

interface CalendarViewProps {
  startDateStr: string;
  workDays: number;
  leaveDays: number;
  mode?: "START_WORK" | "START_LEAVE";
  startShiftOffset?: number;
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export default function CalendarView({
  startDateStr,
  workDays,
  leaveDays,
  mode = "START_WORK",
  startShiftOffset = 0,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  const [monthIndex, setMonthIndex] = useState(0);
  // Removed internal selectedDay state since we are using props now
  const [direction, setDirection] = useState(0);

  const monthDate = useMemo(
    () => addMonths(startOfMonth(new Date()), monthIndex),
    [monthIndex],
  );

  const calendarDays = useMemo(() => {
    const start = startOfMonth(monthDate);
    const firstDayOfWeek = getDay(start);
    const paddingDays = (firstDayOfWeek + 1) % 7;
    const startPadding = paddingDays > 0 ? addDays(start, -paddingDays) : start;

    return eachDayOfInterval({
      start: startPadding,
      end: addDays(startPadding, 41),
    });
  }, [monthDate]);

  const cycleStart = useMemo(() => {
    if (!startDateStr) return null;
    let start = parseLocalDate(startDateStr);
    if (mode === "START_LEAVE") {
      start = subDays(start, workDays);
    }
    return start;
  }, [startDateStr, mode, workDays]);

  const selectedDay = selectedDate || null; // fallback if undefined, though parent should control

  const getDayDetails = (date: Date) => {
    if (!cycleStart) return null;

    // Absolute Math Logic matching useShiftLogic
    const target = startOfDay(date);
    const diffDays = differenceInDays(target, cycleStart);
    const cycleLength = workDays + leaveDays;

    // Normalize to positive cycle index
    const dayInCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength;

    const { getHoliday } = useHolidays();
    const holiday = getHoliday(date);

    if (dayInCycle < workDays) {
      // microCycleDay logic
      const microCycleDay = (dayInCycle + startShiftOffset) % 3;

      let base = null;
      if (microCycleDay === 0)
        base = {
          type: "AFTERNOON" as ShiftType,
          label: "مساء",
          color: "bg-orange-500",
          icon: Sun,
        };
      else if (microCycleDay === 1)
        base = {
          type: "DOUBLE" as ShiftType,
          label: "نهار وليل",
          color: "bg-red-500",
          icon: Moon,
        };
      else
        base = {
          type: "REST" as ShiftType,
          label: "يوم عطلة",
          color: "bg-blue-500",
          icon: RefreshCw,
        };

      return { ...base, holiday };
    } else {
      // Leave Logic
      const isLeaveStart = dayInCycle === workDays;
      const isLeaveEnd = dayInCycle === cycleLength - 1;
      return {
        type: "LEAVE" as ShiftType,
        label: "إجازة",
        color: "bg-green-500",
        icon: Home,
        isLeaveStart,
        isLeaveEnd,
        holiday,
      };
    }
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setMonthIndex((prev) => prev + newDirection);
  };

  const weekDays = useMemo(() => {
    return [
      { name: "السبت" },
      { name: "الأحد" },
      { name: "الإثنين" },
      { name: "الثلاثاء" },
      { name: "الأربعاء" },
      { name: "الخميس" },
      { name: "الجمعة" },
    ];
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
    }),
  };

  const selectedDetails = selectedDay ? getDayDetails(selectedDay) : null;

  return (
    <div className="w-full h-full flex flex-col">
      <motion.div
        layout
        className="glass-card rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden group/calendar relative bg-card/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex flex-col h-full backdrop-blur-3xl"
      >
        {/* Header */}
        <div className="relative z-20 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex justify-between items-center">
            {/* Logic Fix: Right Arrow now goes Forward (Positive) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
              onClick={() => paginate(1)}
              className="p-3 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-foreground active:bg-slate-200 dark:active:bg-slate-800"
            >
              <ChevronRight size={24} />
            </motion.button>

            <div className="text-center group px-4 py-1 rounded-2xl transition-all relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={monthIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                      {format(monthDate, "MMMM", { locale: arDZ })}
                    </h2>
                    {monthIndex !== 0 && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setDirection(monthIndex > 0 ? -1 : 1);
                          setMonthIndex(0);
                        }}
                        className="p-1 px-2 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-wider"
                      >
                        اليوم
                      </motion.button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] opacity-80">
                    {format(monthDate, "yyyy")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Logic Fix: Left Arrow now goes Backward (Negative) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
              onClick={() => paginate(-1)}
              className="p-3 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-foreground active:bg-slate-200 dark:active:bg-slate-800"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2 shrink-0">
          {weekDays.map((day, idx) => {
            const isSelectedDay =
              selectedDay && (getDay(selectedDay) + 1) % 7 === idx;
            const textColor =
              isSelectedDay && selectedDetails
                ? selectedDetails.color.replace("bg-", "text-")
                : "text-slate-400 dark:text-slate-500";

            return (
              <div
                key={day.name}
                className={`text-center text-[10px] sm:text-xs font-black py-2 uppercase tracking-wider transition-all duration-300 ${textColor} ${isSelectedDay ? "scale-110" : ""}`}
              >
                {day.name}
              </div>
            );
          })}
        </div>

        {/* Grid Container */}
        <div className="relative flex-1 overflow-y-auto p-1 scrollbar-hide">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={monthIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full pb-48"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipeThreshold = 50;
                if (offset.x > swipeThreshold) {
                  paginate(-1); // Swipe Right -> Prev Month
                } else if (offset.x < -swipeThreshold) {
                  paginate(1); // Swipe Left -> Next Month
                }
              }}
            >
              <div className="grid grid-cols-7 gap-y-1 gap-x-1 sm:gap-2">
                {calendarDays.map((day) => {
                  const details = getDayDetails(day);
                  const today = startOfToday();
                  const isToday = isSameDay(day, today);
                  const isPast = isBefore(day, today);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const isInMonth = isSameMonth(day, monthDate);

                  if (!details) return <div key={day.toISOString()} />;

                  // Holiday Name is already in details
                  const holiday = details.holiday;

                  // Extract color theme for dynamic opacity/shadows
                  let themeColor = details.color;
                  if (themeColor === "bg-orange-500") themeColor = "orange-500";
                  if (themeColor === "bg-red-500") themeColor = "red-500";
                  if (themeColor === "bg-blue-500") themeColor = "blue-500";
                  if (themeColor === "bg-green-500") themeColor = "green-500";

                  const isStartDate = startDateStr && isSameDay(day, parseLocalDate(startDateStr));

                  // Logic Correction: Mask the Past
                  const isMasked = isPast && !isSelected && !isStartDate; // Keep Start Date visible even if past
                  
                  let buttonStyles = `bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`;
                  
                  if (isSelected) {
                    buttonStyles = `${details.color} text-white shadow-xl shadow-${themeColor}/40 scale-105 ring-4 ring-white dark:ring-slate-900 z-30`;
                  } else if (isStartDate) {
                    buttonStyles = `bg-slate-900 dark:bg-black text-white shadow-lg ring-2 ring-yellow-500 z-20 font-black overflow-hidden`;
                  } else if (isMasked) {
                     buttonStyles = `bg-transparent text-slate-300 dark:text-slate-700 font-normal`;
                  }

                  // Travel Icon Check
                  const isLeaveStart =
                    "isLeaveStart" in details && details.isLeaveStart;
                  const isLeaveEnd =
                    "isLeaveEnd" in details && details.isLeaveEnd;

                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileTap={{ scale: 0.95 }}
                      whileHover={isMasked ? {} : { scale: 1.1, zIndex: 40 }}
                      // layoutId={isSelected ? 'selected-day' : undefined}
                      onClick={() => {
                        if (onDateSelect) onDateSelect(day);
                        if (
                          typeof window !== "undefined" &&
                          window.navigator.vibrate
                        ) {
                          window.navigator.vibrate(10);
                        }
                      }}
                      className={`
                        relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300
                        ${!isInMonth ? "opacity-0 pointer-events-none" : "opacity-100"} 
                        ${buttonStyles}
                        w-full aspect-square py-0.5 lg:py-2
                      `}
                    >
                      {/* Flag Icon for Start Date */}
                      {isStartDate && !isSelected && (
                        <div className="absolute top-0.5 left-0.5 z-20 opacity-80">
                            <Flag size={10} className="fill-yellow-500 text-yellow-500" />
                        </div>
                      )}

                      <span
                        className={`text-xs md:text-sm font-black tabular-nums z-10 
                          ${isToday && !isSelected && !isStartDate ? "text-blue-500" : ""}
                          ${isStartDate && !isSelected ? "text-yellow-500" : ""}
                        `}
                      >
                        {format(day, "d")}
                      </span>
                      
                      {/* Today Dot Indicator */}
                      {isToday && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500/80"></div>
                      )}

                      {/* Holiday Indicators */}
                      {holiday && !isMasked && (
                        <div className="absolute -top-1 -right-1 z-20">
                          {holiday.type === "ISLAMIC" ? (
                            <div className="bg-purple-600 text-white rounded-full p-[2px] shadow-sm border border-white dark:border-slate-900">
                              <Moon size={8} className="fill-current" />
                            </div>
                          ) : (
                            <div className="bg-indigo-500 text-white rounded-full p-[2px] shadow-sm border border-white dark:border-slate-900">
                              <Star size={8} className="fill-current" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Travel Day Micro-Animations */}
                      {isLeaveStart && !isMasked && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <PlaneTakeoff className="w-8 h-8 text-green-600 rotate-45" />
                        </div>
                      )}
                      {isLeaveEnd && !isMasked && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <PlaneLanding className="w-8 h-8 text-green-600 -rotate-45" />
                        </div>
                      )}

                      {!isMasked && (
                        <details.icon
                          className={`w-3 h-3 md:w-4 md:h-4 mt-1 opacity-80 z-10 ${isSelected ? "text-white" : ""}`}
                        />
                      )}

                      {/* Vacation Track Background */}
                      {details.type === "LEAVE" && !isMasked && (
                        <div
                          className={`absolute inset-y-0 -inset-x-[1px] bg-green-500/10 z-0 
                          ${isLeaveStart ? "rounded-s-2xl ml-px" : ""} 
                          ${isLeaveEnd ? "rounded-e-2xl mr-px" : ""}
                          ${!isLeaveStart && !isLeaveEnd ? "rounded-none" : ""}
                          ${isLeaveStart && isLeaveEnd ? "rounded-2xl" : ""}
                        `}
                        />
                      )}

                      {/* Selection Glow Background */}
                      {isSelected && !isMasked && (
                        <motion.div
                          layoutId="selection-glow"
                          className="absolute inset-0 bg-white/20 blur-sm z-10"
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Today Marker */}
                      {isToday && !isSelected && (
                        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-xl md:rounded-2xl today-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Insight Card (Bottom Sheet) */}
        <AnimatePresence mode="wait">
          {selectedDetails ? (
            <motion.div
              key="insight-card"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-4 left-4 right-4 z-40"
            >
              <div
                className={`p-4 rounded-[2rem] shadow-2xl backdrop-blur-3xl border border-white/20 flex flex-col gap-2 overflow-hidden relative ${
                  isSameDay(selectedDay!, startOfToday())
                    ? "bg-slate-900/95 text-white shadow-blue-900/20"
                    : "bg-white/95 dark:bg-slate-800/95 text-foreground shadow-slate-900/10"
                }`}
              >
                {/* Pull Indicator */}
                <div className="w-8 h-1 rounded-full bg-slate-300 dark:bg-slate-600/50 mx-auto opacity-50 mb-1" />



                {/* Content Area: Status & Holiday */}
                <div className="grid grid-cols-1 gap-2">
                  {/* Shift Status Block - COMPACT */}
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isSameDay(selectedDay!, startOfToday())
                        ? "bg-white/10"
                        : "bg-slate-50 dark:bg-slate-700/30"
                    } border border-white/5`}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        نوع المناوبة
                      </span>
                      <span className="text-sm font-black tracking-tight">
                        {selectedDetails.label}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${selectedDetails.color} text-white shadow-md`}
                    >
                      {selectedDetails.type === "LEAVE" ? "راحة تامة" : "مناوب"}
                    </div>
                  </div>

                  {/* Holiday Banner - COMPACT */}
                  {selectedDetails.holiday && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className={`flex items-center gap-2 p-2 rounded-xl ${
                        selectedDetails.holiday.type === "ISLAMIC"
                          ? "bg-purple-500/10 border-purple-500/20"
                          : "bg-indigo-500/10 border-indigo-500/20"
                      } border`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${selectedDetails.holiday.type === "ISLAMIC" ? "bg-purple-600" : "bg-indigo-500"} text-white shadow-md`}
                      >
                        {selectedDetails.holiday.type === "ISLAMIC" ? (
                          <Moon size={12} className="fill-current" />
                        ) : (
                          <Star size={12} className="fill-current" />
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          مناسبة وطنية/دينية
                        </span>
                        <span
                          className={`text-xs font-black ${selectedDetails.holiday.type === "ISLAMIC" ? "text-purple-600 dark:text-purple-400" : "text-indigo-600 dark:text-indigo-400"}`}
                        >
                          {selectedDetails.holiday.name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute bottom-6 left-0 right-0 text-center z-30 opacity-60 pointer-events-none px-6">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700/50 mb-4 blur-[1px]" />
              <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                اختر يوماً لمعرفة التفاصيل ✨
              </p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
