// lib/dateUtils.ts
import {
  format,
  differenceInDays,
  startOfDay,
  addDays as dateFnsAddDays,
} from "date-fns";
import { arDZ } from "date-fns/locale";

export const formatArabicDate = (date: Date): string => {
  return format(date, "EEEE، d MMMM yyyy", { locale: arDZ });
};

export const getHijriDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const getDaysBetween = (a: Date, b: Date): number => {
  return Math.abs(differenceInDays(startOfDay(a), startOfDay(b)));
};

export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

export const addDays = (date: Date, days: number): Date => {
  return dateFnsAddDays(date, days);
};
export const getHolidayForDate = (
  date: Date,
): { name: string; icon: string } | null => {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic", {
    day: "numeric",
    month: "numeric",
  }).formatToParts(date);

  const day = parseInt(parts.find((p) => p.type === "day")?.value || "0");
  const month = parseInt(parts.find((p) => p.type === "month")?.value || "0");

  // Ramadan: Month 9
  if (month === 9) return { name: "رمضان", icon: "🌙" };

  // Eid al-Fitr: 1st of Month 10
  if (month === 10 && (day === 1 || day === 2 || day === 3))
    return { name: "عيد الفطر", icon: "✨" };

  // Eid al-Adha: 10th of Month 12
  if (month === 12 && day >= 10 && day <= 13)
    return { name: "عيد الأضحى", icon: "🐑" };

  return null;
};

export const formatShiftLabel = (label: string): string => {
  if (!label) return "";
  if (label.startsWith("فترة")) return label;
  if (label === "راحة" || label === "إجازة") return `فترة ${label}`;
  if (label.startsWith("عمل")) return `فترة ${label}`;
  return `فترة عمل ${label}`;
};
