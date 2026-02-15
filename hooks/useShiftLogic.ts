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
  daysPassed: number;
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
  startShiftOffset: number = 0,
  targetDate?: Date | null
) => {
  const [now, setNow] = useState(new Date());

    const calculateShift = useCallback((currentTime: Date): ShiftState | null => {
    // If a specific target date is requested, use it for shift calculation
    // but keep 'now' for countdowns if needed (though countdowns make less sense for future dates)
    const effectiveDate = targetDate || currentTime;
    
    if (!inputDateStr) return null;

    const today = startOfDay(effectiveDate);
    let startOfWorkCycle: Date;

    // Anchor Date Logic: We anchor everything to the User's Selected Date
    // If Mode is START_LEAVE, we calculate back to find the theoretic Start of Work
    if (mode === 'START_LEAVE') {
      const leaveStart = parseLocalDate(inputDateStr);
      if (isNaN(leaveStart.getTime())) return null;
      startOfWorkCycle = subDays(leaveStart, workDays);
    } else {
      startOfWorkCycle = parseLocalDate(inputDateStr);
      if (isNaN(startOfWorkCycle.getTime())) return null;
    }
    
    // 1. Calculate Absolute Days Passed
    // This allows negative values (past) and positive values (future) to work on the same number line
    const daysPassed = differenceInDays(today, startOfWorkCycle);
    const cycleLength = workDays + leaveDays;
    
    // 2. Normalize to a Positive Cycle Index (0 to cycleLength - 1)
    // The Formula: ((n % m) + m) % m handles negative numbers correctly in JS
    const dayInCycle = ((daysPassed % cycleLength) + cycleLength) % cycleLength;

    // 3. Current Cycle Number (1-based count of full cycles passed)
    // We use floor to count full cycles completed
    const cycleNumber = Math.floor(daysPassed / cycleLength) + 1;

    let type: ShiftType;
    let label: string;
    let color: string;
    let daysRemaining: number;
    let nextPhaseDate: Date;
    let daysCompleted: number;

    if (dayInCycle < workDays) {
      // --- WORK PHASE ---
      
      // Absolute Math for Shift Pattern: (DayIndex + UserOffset) % 3
      // We use dayInCycle (0 to 27) because the pattern restarts every cycle
      const shiftPatternIndex = (dayInCycle + startShiftOffset) % 3;
      
      if (shiftPatternIndex === 0) {
        type = 'AFTERNOON';
        label = 'مساء (13-20) ⛅';
        color = 'bg-orange-500';
      } else if (shiftPatternIndex === 1) {
        type = 'DOUBLE';
        label = 'صباح + ليل';
        color = 'bg-red-500';
      } else {
        type = 'REST';
        label = 'يوم عطلة';
        color = 'bg-blue-500';
      }

      daysRemaining = workDays - dayInCycle;
      nextPhaseDate = addDays(today, daysRemaining);
      daysCompleted = dayInCycle + 1;
      
    } else {
      // --- LEAVE PHASE ---
      type = 'LEAVE';
      label = 'إجازة شهرية 🏠';
      color = 'bg-green-500';
      
      const daysInLeave = dayInCycle - workDays;
      daysRemaining = leaveDays - daysInLeave;
      nextPhaseDate = addDays(today, daysRemaining);
      daysCompleted = daysInLeave + 1;
    }

    // Countdown Logic (Unchanged)
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
      daysPassed, // Expose raw days passed for stats
    };
  }, [inputDateStr, workDays, leaveDays, mode, startShiftOffset]);

  useEffect(() => {
    // Only run the live timer if we are viewing "Now" (no targetDate provided)
    if (targetDate) return;

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
  }, [targetDate]);

  return calculateShift(now);
};

