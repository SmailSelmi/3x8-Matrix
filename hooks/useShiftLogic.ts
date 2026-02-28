// hooks/useShiftLogic.ts
"use client";

import { useMemo } from "react";
import {
  ShiftType,
  SystemType,
  INDUSTRIAL_3X8_PATTERN,
} from "@/lib/shiftPatterns";
import {
  differenceInDays,
  startOfDay,
  addDays,
  isSameDay,
  format,
} from "date-fns";

export interface ShiftInfo {
  type: ShiftType;
  label: string;
  emoji: string;
  color: string;
  accentColor: string;
  startTime: string;
  endTime: string;
  cycleDay: number;
  cycleProgress: number;
  daysUntilNextShift: number;
  nextShiftType: ShiftType;
  nextShiftLabel: string;
  returnToWorkDate: string;
  returnToWorkShiftLabel: string;
  hoursRemaining: number;
  percentComplete: number;
  isVacation: boolean;
  vacationDay: number;
  totalVacationDays: number;
  superCycleProgress: number;
  statusMessage: string;
  subStatusMessage: string;
}

const SHIFT_METADATA: Record<
  ShiftType,
  { label: string; emoji: string; color: string; accentColor: string }
> = {
  day: {
    label: "صباحي + ليلي",
    emoji: "☀️",
    color: "#F59E0B",
    accentColor: "rgba(245, 158, 11, 0.1)",
  },
  evening: {
    label: "مسائي",
    emoji: "🌆",
    color: "#F97316",
    accentColor: "rgba(249, 115, 22, 0.1)",
  },
  night: {
    label: "ليلي",
    emoji: "🌙",
    color: "#818CF8",
    accentColor: "rgba(129, 140, 248, 0.1)",
  },
  rest: {
    label: "راحة",
    emoji: "🛡️",
    color: "#10B981",
    accentColor: "rgba(16, 185, 129, 0.1)",
  },
  leave: {
    label: "إجازة",
    emoji: "✈️",
    color: "#64748B",
    accentColor: "rgba(100, 116, 139, 0.1)",
  },
};

/**
 * Returns the primary shift type for a date (for calendar markers)
 */
export function getShiftForDate(
  date: Date,
  cycleStartDate: string,
  systemType: SystemType,
  initialCycleDay: number = 1,
  workDuration: number = 28,
  vacationDuration: number = 7,
  addRouteDays: boolean = false,
  annualLeaveBlocks: { id: string; start: string; end: string }[] = [],
  workDurationExtension: number = 0,
): ShiftType {
  // Check Annual Leave Blocks first (Override)
  const targetTime = date.getTime();
  const isInAnnualLeave = annualLeaveBlocks.some((block) => {
    const start = new Date(block.start).getTime();
    const end = new Date(block.end).getTime();
    return targetTime >= start && targetTime <= end;
  });

  if (isInAnnualLeave) return "leave";

  const start = startOfDay(new Date(cycleStartDate));
  const target = startOfDay(date);
  const diff = differenceInDays(target, start);

  // Super cycle logic
  const effectiveWorkDuration = workDuration + workDurationExtension;
  const totalVacation = vacationDuration + (addRouteDays ? 2 : 0);
  const totalCycle = effectiveWorkDuration + totalVacation;
  const superPosition = ((diff % totalCycle) + totalCycle) % totalCycle;

  if (superPosition >= effectiveWorkDuration) {
    return "leave";
  }

  if (systemType === "5x2_admin") {
    const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
    // Sun-Thu work, Fri-Sat rest
    return dayOfWeek === 5 || dayOfWeek === 6 ? "rest" : "day";
  }

  // 3-Day Industrial Logic
  const cycleLength = 3;
  const position =
    (((diff + (initialCycleDay - 1)) % cycleLength) + cycleLength) %
    cycleLength;
  return INDUSTRIAL_3X8_PATTERN[position];
}

export default function useShiftLogic(
  cycleStartDate: string,
  systemType: SystemType,
  initialCycleDay: number = 1,
  workDuration: number = 21,
  vacationDuration: number = 7,
  addRouteDays: boolean = false,
  annualLeaveBlocks: { id: string; start: string; end: string }[] = [],
  workDurationExtension: number = 0,
  today: Date = new Date(),
) {
  return useMemo((): ShiftInfo => {
    const start = startOfDay(new Date(cycleStartDate));
    const dayStart = startOfDay(today);

    // Annual Leave Check for today
    const isInAnnualLeave = annualLeaveBlocks.some((block) => {
      const bStart = new Date(block.start).getTime();
      const bEnd = new Date(block.end).getTime();
      const t = dayStart.getTime();
      return t >= bStart && t <= bEnd;
    });

    const diff = differenceInDays(dayStart, start);

    // Cycle info
    const cycleLength = systemType === "3x8_industrial" ? 3 : 7;
    const cycleDay =
      systemType === "3x8_industrial"
        ? ((((diff + (initialCycleDay - 1)) % 3) + 3) % 3) + 1
        : dayStart.getDay() + 1;

    // Super cycle info
    const effectiveWorkDuration = workDuration + workDurationExtension;
    const totalVacation = vacationDuration + (addRouteDays ? 2 : 0);
    const totalCycle = effectiveWorkDuration + totalVacation;
    const superPosition = ((diff % totalCycle) + totalCycle) % totalCycle;
    const isVacation =
      superPosition >= effectiveWorkDuration || isInAnnualLeave;
    const vacationDay = isInAnnualLeave
      ? 1
      : superPosition >= effectiveWorkDuration
        ? superPosition - effectiveWorkDuration + 1
        : 0;

    const baseType = getShiftForDate(
      today,
      cycleStartDate,
      systemType,
      initialCycleDay,
      workDuration,
      vacationDuration,
      addRouteDays,
      annualLeaveBlocks,
      workDurationExtension,
    );

    // Time detection for 3x8 Industrial
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentMins = currentHour * 60 + currentMinute;
    const dayProgress = currentMins / (24 * 60);

    let activeType = baseType;
    let startTime = "00:00";
    let endTime = "23:59";

    if (isVacation) {
      activeType = "leave";
      startTime = "00:00";
      endTime = "23:59";
    } else if (systemType === "3x8_industrial") {
      if (cycleDay === 1) {
        // Day 1: 13h - 20h
        activeType = "evening";
        startTime = "13:00";
        endTime = "20:00";
      } else if (cycleDay === 2) {
        // Day 2: Morning (07-13) or Night (20-07)
        if (currentHour < 13) {
          activeType = "day";
          startTime = "07:00";
          endTime = "13:00";
        } else {
          activeType = "night";
          startTime = "20:00";
          endTime = "07:00";
        }
      } else if (cycleDay === 3) {
        // Day 3: Rest from 07h
        if (currentHour < 7) {
          // Still in Day 2 night shift
          activeType = "night";
          startTime = "20:00";
          endTime = "07:00";
        } else {
          activeType = "rest";
          startTime = "07:00";
          endTime = "13:00"; // Next rotation starts at 13:00 tomorrow
        }
      }
    } else {
      // 5x2 Admin
      startTime = "08:00";
      endTime = "16:30";
    }

    // Calculations
    const [sh, sm] = startTime.split(":").map(Number);
    let [eh, em] = endTime.split(":").map(Number);
    let startTotalMins = sh * 60 + sm;
    let endTotalMins = eh * 60 + em;

    if (endTotalMins <= startTotalMins) endTotalMins += 24 * 60;

    let effCurrentMins = currentMins;
    if (activeType === "night" && currentMins < 7 * 60)
      effCurrentMins += 24 * 60;

    let hoursRemaining = 0;
    let percentComplete = 0;

    if (activeType === "rest" || activeType === "leave") {
      percentComplete = dayProgress * 100;
      hoursRemaining = (24 * 60 - currentMins) / 60;
    } else {
      if (effCurrentMins < startTotalMins) {
        hoursRemaining = (startTotalMins - effCurrentMins) / 60;
        percentComplete = 0;
      } else if (effCurrentMins >= endTotalMins) {
        hoursRemaining = 0;
        percentComplete = 100;
      } else {
        const duration = endTotalMins - startTotalMins;
        percentComplete = ((effCurrentMins - startTotalMins) / duration) * 100;
        hoursRemaining = (endTotalMins - effCurrentMins) / 60;
      }
    }

    const meta = SHIFT_METADATA[activeType];
    const tomorrow = addDays(today, 1);
    const nextShiftType = getShiftForDate(
      tomorrow,
      cycleStartDate,
      systemType,
      initialCycleDay,
      workDuration,
      vacationDuration,
      addRouteDays,
      annualLeaveBlocks,
      workDurationExtension,
    );

    let returnToWorkDate = "";
    let returnToWorkShiftLabel = "";

    if (isVacation) {
      let checkDate = addDays(dayStart, 1);
      // Limit to 60 days to avoid long loops
      for (let i = 0; i < 60; i++) {
        const type = getShiftForDate(
          checkDate,
          cycleStartDate,
          systemType,
          initialCycleDay,
          workDuration,
          vacationDuration,
          addRouteDays,
          annualLeaveBlocks,
          workDurationExtension,
        );
        if (type !== "leave") {
          returnToWorkDate = format(checkDate, "yyyy-MM-dd");
          returnToWorkShiftLabel = SHIFT_METADATA[type].label;
          break;
        }
        checkDate = addDays(checkDate, 1);
      }
    }

    let statusMessage = "";
    let subStatusMessage = "";

    if (isVacation) {
      statusMessage = "أنت في فترة إجازة";
      subStatusMessage = `اليوم ${vacationDay} من ${totalVacation}`;
    } else if (activeType === "rest") {
      statusMessage = "أنت في فترة راحة حالياً";
      subStatusMessage = "استمتع بوقتك بعيداً عن العمل";
    } else if (effCurrentMins < startTotalMins) {
      const h = Math.floor(hoursRemaining);
      const m = Math.floor((hoursRemaining % 1) * 60);
      statusMessage = `ستبدأ فترة العمل بعد ${h} ساعة و ${m} دقيقة`;
      subStatusMessage = `فترة العمل القادمة: ${meta.label}`;
    } else {
      const h = Math.floor(hoursRemaining);
      const m = Math.floor((hoursRemaining % 1) * 60);
      const isExtensionDay = !isVacation && superPosition >= workDuration;

      if (isExtensionDay) {
        statusMessage =
          h === 0 && m === 0
            ? "فترة التمديد منتهية"
            : `يتبقى ${h} ساعة و ${m} دقيقة في يوم التمديد`;
        subStatusMessage = `يوم عمل إضافي (${Math.floor(superPosition - workDuration + 1)}) لزيادة الدورة`;
      } else {
        statusMessage =
          h === 0 && m === 0
            ? "فترة العمل منتهية"
            : `يتبقى ${h} ساعة و ${m} دقيقة`;
        subStatusMessage = `حتى نهاية فترة عمل ${meta.label}`;
      }
    }

    return {
      type: activeType,
      ...meta,
      startTime,
      endTime,
      cycleDay,
      cycleProgress: isVacation ? 1 : dayProgress,
      daysUntilNextShift: isVacation ? totalVacation - vacationDay + 1 : 1,
      nextShiftType,
      nextShiftLabel: SHIFT_METADATA[nextShiftType].label,
      returnToWorkDate,
      returnToWorkShiftLabel,
      hoursRemaining: Math.max(0, hoursRemaining),
      percentComplete,
      isVacation,
      vacationDay,
      totalVacationDays: totalVacation,
      superCycleProgress: superPosition / totalCycle,
      statusMessage,
      subStatusMessage,
    };
  }, [
    cycleStartDate,
    systemType,
    initialCycleDay,
    workDuration,
    vacationDuration,
    addRouteDays,
    today,
    annualLeaveBlocks,
    workDurationExtension,
  ]);
}
