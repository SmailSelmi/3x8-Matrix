// components/DatePickerAr.tsx
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay
} from 'date-fns';
import { arDZ } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, X, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export default function DatePickerAr({ selectedDate, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const weekDayLabels = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

  const triggerHaptic = (vibrate = 10) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(vibrate);
    }
  };

  const { calendarDays, monthStart } = useMemo(() => {
    const ms = startOfMonth(viewDate);
    const me = endOfMonth(ms);
    const start = startOfWeek(ms, { weekStartsOn: 6 });
    const end = endOfWeek(me, { weekStartsOn: 6 });
    return {
      calendarDays: eachDayOfInterval({ start, end }),
      monthStart: ms,
    };
  }, [viewDate]);

  const handleSelect = (day: Date) => {
    triggerHaptic(15);
    onChange(day);
    setOpen(false);
  };

  const displayValue = format(selectedDate, 'EEEE، d MMMM yyyy', { locale: arDZ });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (!open) setViewDate(selectedDate);
          setOpen(!open);
          triggerHaptic(5);
        }}
        className={`w-full glass-card text-foreground border rounded-2xl p-4 text-right transition-all flex items-center justify-between gap-3 shadow-sm ${
          open
            ? 'border-blue-500 ring-4 ring-blue-500/10'
            : 'border-slate-200 dark:border-white/10'
        }`}
      >
        <CalendarIcon size={20} className="text-blue-500" />
        <span className="flex-1 text-right text-sm font-black" suppressHydrationWarning>
          {displayValue}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 right-0 z-[110] bg-card/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/5">
              <button
                type="button"
                onClick={() => { setViewDate(subMonths(viewDate, 1)); triggerHaptic(5); }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-all active:scale-80"
              >
                <ChevronRight size={22} />
              </button>

              <div className="text-center group px-4 py-1">
                <p className="text-xs font-black text-foreground">
                  {format(viewDate, 'MMMM yyyy', { locale: arDZ })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setViewDate(addMonths(viewDate, 1)); triggerHaptic(5); }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-all active:scale-80"
              >
                <ChevronLeft size={22} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 px-4 pt-4">
              {weekDayLabels.map((d, i) => (
                <div key={i} className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 px-5 pb-5 pt-2">
              {calendarDays.map((day) => {
                const inMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);

                return (
                  <motion.button
                    key={day.toISOString()}
                    type="button"
                    whileTap={inMonth ? { scale: 0.9 } : {}}
                    disabled={!inMonth}
                    onClick={() => inMonth && handleSelect(day)}
                    className={`
                      aspect-square flex items-center justify-center rounded-xl text-xs font-black
                      transition-all duration-200 relative
                      ${!inMonth
                        ? 'opacity-0 pointer-events-none'
                        : isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 z-10 ring-2 ring-blue-400/20'
                          : isToday
                            ? 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20'
                            : 'text-foreground hover:bg-slate-100 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    {format(day, 'd')}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer: Today Button */}
            <div className="px-6 pb-6 pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  handleSelect(new Date());
                }}
                className="flex-1 text-[11px] py-4 bg-blue-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <Check size={14} /> اذهب لليوم
              </button>
              <button
                type="button"
                onClick={() => { triggerHaptic(5); setOpen(false); }}
                className="flex-1 text-[11px] py-4 bg-slate-100 dark:bg-white/5 text-foreground font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <X size={14} /> إغلاق
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
