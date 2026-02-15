'use client';

import React, { useState, useMemo } from 'react';
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
  endOfWeek
} from 'date-fns';
import { arDZ } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sun, RefreshCw, Moon, Home, Plane } from 'lucide-react';
import { ShiftType } from '@/hooks/useShiftLogic';

interface CalendarViewProps {
  startDateStr: string;
  workDays: number;
  leaveDays: number;
  mode?: 'START_WORK' | 'START_LEAVE';
  startShiftOffset?: number;
}

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export default function CalendarView({ startDateStr, workDays, leaveDays, mode = 'START_WORK', startShiftOffset = 0 }: CalendarViewProps) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(startOfToday());
  const [direction, setDirection] = useState(0);

  const monthDate = useMemo(() => addMonths(startOfMonth(new Date()), monthIndex), [monthIndex]);
  
  const calendarDays = useMemo(() => {
    const start = startOfMonth(monthDate);
    const firstDayOfWeek = getDay(start); 
    const paddingDays = (firstDayOfWeek + 1) % 7; 
    const startPadding = paddingDays > 0 ? addDays(start, -paddingDays) : start;
    
    return eachDayOfInterval({
      start: startPadding,
      end: addDays(startPadding, 41)
    });
  }, [monthDate]);

  const cycleStart = useMemo(() => {
    if (!startDateStr) return null;
    let start = parseLocalDate(startDateStr);
    if (mode === 'START_LEAVE') {
      start = subDays(start, workDays);
    }
    return start;
  }, [startDateStr, mode, workDays]);

  const getDayDetails = (date: Date) => {
    if (!cycleStart) return null;
    
    const target = startOfDay(date);
    const diffDays = differenceInDays(target, cycleStart);
    
    const cycleLength = workDays + leaveDays;
    let dayInCycle = diffDays % cycleLength;
    if (dayInCycle < 0) dayInCycle = cycleLength + dayInCycle;

    if (dayInCycle < workDays) {
      const microCycleDay = (dayInCycle + startShiftOffset) % 3;
      if (microCycleDay === 0) return { type: 'AFTERNOON' as ShiftType, label: 'مساء', color: 'bg-orange-500', icon: Sun };
      if (microCycleDay === 1) return { type: 'DOUBLE' as ShiftType, label: 'كبير', color: 'bg-red-600', icon: Moon };
      return { type: 'REST' as ShiftType, label: 'راحة', color: 'bg-blue-500', icon: RefreshCw };
    } else {
      // Leave Logic
      const isLeaveStart = dayInCycle === workDays;
      const isLeaveEnd = dayInCycle === cycleLength - 1;
      return { 
        type: 'LEAVE' as ShiftType, 
        label: 'إجازة', 
        color: 'bg-green-500', 
        icon: Home,
        isLeaveStart,
        isLeaveEnd
      };
    }
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setMonthIndex(prev => prev + newDirection);
  };

  const weekDays = useMemo(() => {
    const now = new Date();
    return eachDayOfInterval({
      start: startOfWeek(now, { weekStartsOn: 6 }), // Saturday start
      end: endOfWeek(now, { weekStartsOn: 6 })
    }).map((day) => ({
      name: format(day, 'EEE', { locale: arDZ }), // Returns "سبت", "أحد" or "Sat", "Sun"
    }));
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    })
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
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-foreground"
            >
              <ChevronRight size={20} />
            </motion.button>
            
            <div className="text-center group px-4 py-1 rounded-2xl transition-all relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={monthIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                    {format(monthDate, 'MMMM', { locale: arDZ })}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] opacity-80">
                    {format(monthDate, 'yyyy')}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
              onClick={() => paginate(1)}
              className="p-2 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-foreground"
            >
              <ChevronLeft size={20} />
            </motion.button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-border/50 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
          {weekDays.map((day) => (
            <div key={day.name} className="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 py-3 uppercase tracking-wider">
              {day.name}
            </div>
          ))}
        </div>
        
        {/* Grid Container */}
        <div className="relative flex-1 overflow-hidden p-1 sm:p-2 lg:p-4">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={monthIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="w-full h-full"
            >
              <div className="grid grid-cols-7 grid-rows-6 gap-1 md:gap-1.5 lg:gap-2 h-full">
                {calendarDays.map((day) => {
                  const details = getDayDetails(day);
                  const today = startOfToday();
                  const isToday = isSameDay(day, today);
                  const isPast = isBefore(day, today);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const isInMonth = isSameMonth(day, monthDate);
                  
                  if (!details) return <div key={day.toISOString()} />;

                  // Extract color theme for dynamic opacity/shadows
                  let themeColor = details.color;
                  if (themeColor === 'bg-orange-500') themeColor = 'orange-500';
                  if (themeColor === 'bg-red-600') themeColor = 'red-600';
                  if (themeColor === 'bg-blue-500') themeColor = 'blue-500';
                  if (themeColor === 'bg-green-500') themeColor = 'green-500';

                  // Logic Correction: Mask the Past
                  const isMasked = isPast && !isSelected;
                  const buttonStyles = isMasked
                    ? `bg-slate-200/40 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500`
                    : isSelected 
                      ? `${details.color} text-white shadow-xl shadow-${themeColor}/30 scale-105 ring-2 ring-white/50 z-20` 
                      : `bg-${themeColor}/5 text-${themeColor} hover:bg-${themeColor}/15 shadow-sm hover:shadow-md`;

                  // Travel Icon Check
                  const isLeaveStart = 'isLeaveStart' in details && details.isLeaveStart;
                  const isLeaveEnd = 'isLeaveEnd' in details && details.isLeaveEnd;

                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileTap={{ scale: 0.95 }}
                      whileHover={isMasked ? {} : { scale: 1.05, y: -2, zIndex: 30 }}
                      layoutId={isSelected ? 'selected-day' : undefined}
                      onClick={() => {
                        setSelectedDay(day);
                        if (typeof window !== 'undefined' && window.navigator.vibrate) {
                          window.navigator.vibrate(10);
                        }
                      }}
                      className={`
                        relative flex flex-col items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300
                        ${!isInMonth ? 'opacity-20 grayscale' : 'opacity-100'}
                        ${buttonStyles}
                        h-full w-full py-1 lg:py-2
                      `}
                    >
                      <span className={`text-xs md:text-sm font-black tabular-nums z-10 ${isToday && !isSelected ? 'text-blue-500' : ''}`}>
                        {isLeaveStart && !isMasked ? (
                            <Plane className="w-4 h-4 -rotate-45" />
                        ) : isLeaveEnd && !isMasked ? (
                            <Plane className="w-4 h-4 rotate-[135deg]" />
                        ) : (
                          format(day, 'd')
                        )}
                      </span>
                      
                      {!isMasked && (
                        <details.icon className={`w-3 h-3 md:w-4 md:h-4 mt-1 opacity-80 z-10 ${isSelected ? 'text-white' : ''}`} />
                      )}
                      
                      {/* Selection Glow Background */}
                       {isSelected && !isMasked && (
                        <motion.div
                          layoutId="selection-glow"
                          className="absolute inset-0 bg-white/20 blur-sm"
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

        {/* Legend Footer */}
        <div className="px-4 py-3 bg-slate-50/10 dark:bg-slate-800/20 border-t border-border transition-colors duration-500 relative z-20 shrink-0">
          <div className="flex justify-between items-center px-2">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase">مساء</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase">كبير</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase">راحة</span>
                </div>
             </div>
             {selectedDetails && (
               <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
               >
                 <span className="text-[10px] font-black text-foreground">{format(selectedDay!, 'EEE d', {locale: arDZ})}</span>
                 <div className={`px-2 py-0.5 rounded text-[8px] font-bold text-white ${selectedDetails.color}`}>
                   {selectedDetails.label}
                 </div>
               </motion.div>
             )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
