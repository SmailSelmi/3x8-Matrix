// hooks/useShiftLogic.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { differenceInDays, addDays, subDays, startOfDay, differenceInMilliseconds } from 'date-fns';

// أنواع الدوام الممكنة
export type ShiftType = 
  | 'AFTERNOON'    // 13:00 -> 20:00
  | 'DOUBLE'       // 07:00 -> 13:00 + 20:00 -> 07:00
  | 'REST'         // راحة الـ 24 ساعة
  | 'LEAVE';       // الإجازة الشهرية الطويلة

export interface ShiftState {
  type: ShiftType;
  label: string;      // النص الذي سيظهر للمستخدم
  color: string;      // لون الحالة
  daysCompleted: number;
  daysRemaining: number;
  progress: number;
  nextPhaseDate: Date;
  cycleNumber: number;
  //Countdown to midnight
  hoursToMidnight: number;
  minutesToMidnight: number;
  secondsToMidnight: number;
}

// Helper to parse "YYYY-MM-DD" safely as local date
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const useShiftLogic = (
  inputDateStr: string,
  workDays: number = 28,
  leaveDays: number = 28,
  mode: 'START_WORK' | 'START_LEAVE' = 'START_WORK',
  startShiftOffset: number = 0
) => {
  const [now, setNow] = useState(new Date());

  const calculateShift = useCallback((currentTime: Date): ShiftState | null => {
    if (!inputDateStr) return null;

    const today = startOfDay(currentTime);
    let startOfWorkCycle: Date;

    // توحيد نقطة البداية باستخدام التحليل المحلي
    if (mode === 'START_LEAVE') {
      const leaveStart = parseLocalDate(inputDateStr);
      if (isNaN(leaveStart.getTime())) return null;
      startOfWorkCycle = subDays(leaveStart, workDays);
    } else {
      startOfWorkCycle = parseLocalDate(inputDateStr);
      if (isNaN(startOfWorkCycle.getTime())) return null;
    }
    
    const cycleLength = workDays + leaveDays;
    const totalDaysPassed = differenceInDays(today, startOfWorkCycle);
    
    // تصحيح الأيام السالبة
    let dayInCycle = totalDaysPassed % cycleLength;
    if (dayInCycle < 0) dayInCycle = cycleLength + dayInCycle;

    // حساب رقم الدورة
    const cycleNumber = Math.max(Math.floor(totalDaysPassed / cycleLength) + 1, 1);

    let type: ShiftType;
    let label: string;
    let color: string;
    let daysRemaining: number;
    let nextPhaseDate: Date;
    let daysCompleted: number;

    if (dayInCycle < workDays) {
      // --- نحن داخل فترة العمل (الـ 28 يوم) ---
      const microCycleDay = (dayInCycle + startShiftOffset) % 3;
      
      if (microCycleDay === 0) {
        type = 'AFTERNOON';
        label = 'مساء (13-20) ⛅';
        color = 'bg-orange-500';
      } else if (microCycleDay === 1) {
        type = 'DOUBLE';
        label = 'صباح + ليل';
        color = 'bg-red-600';
      } else {
        type = 'REST';
        label = 'راحة قصيرة';
        color = 'bg-blue-500';
      }

      daysRemaining = workDays - dayInCycle;
      nextPhaseDate = addDays(today, daysRemaining);
      daysCompleted = dayInCycle + 1;
      
    } else {
      // --- فترة الإجازة الطويلة ---
      type = 'LEAVE';
      label = 'إجازة شهرية 🏠';
      color = 'bg-green-500';
      
      const daysInLeave = dayInCycle - workDays;
      daysRemaining = leaveDays - daysInLeave;
      nextPhaseDate = addDays(today, daysRemaining);
      daysCompleted = daysInLeave + 1;
    }

    // حساب العد التنازلي لمنتصف الليل
    const midnight = new Date(currentTime);
    midnight.setHours(24, 0, 0, 0);
    const msToMidnight = differenceInMilliseconds(midnight, currentTime);
    const totalSecondsToMidnight = Math.floor(msToMidnight / 1000);
    const hoursToMidnight = Math.floor(totalSecondsToMidnight / 3600);
    const minutesToMidnight = Math.floor((totalSecondsToMidnight % 3600) / 60);
    const secondsToMidnight = totalSecondsToMidnight % 60;

    const currentPhaseLength = type === 'LEAVE' ? leaveDays : workDays;

    return {
      type,
      label,
      color,
      daysCompleted,
      daysRemaining,
      progress: (daysCompleted / currentPhaseLength) * 100,
      nextPhaseDate,
      cycleNumber,
      hoursToMidnight,
      minutesToMidnight,
      secondsToMidnight,
    };
  }, [inputDateStr, workDays, leaveDays, mode, startShiftOffset]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return calculateShift(now);
};

