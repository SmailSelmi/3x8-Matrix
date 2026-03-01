import { useMemo } from "react";

export interface Holiday {
  name: string;
  type: "ISLAMIC" | "NATIONAL";
}

export function useHolidays() {
  const getHijriDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getHoliday = (date: Date): Holiday | null => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 1. Fixed National Holidays
    if (month === 1 && day === 1)
      return { name: "رأس السنة الميلادية", type: "NATIONAL" };
    if (month === 1 && day === 12)
      return { name: "رأس السنة الأمازيغية", type: "NATIONAL" };
    if (month === 5 && day === 1)
      return { name: "عيد العمال", type: "NATIONAL" };
    if (month === 7 && day === 5)
      return { name: "عيد الاستقلال", type: "NATIONAL" };
    if (month === 11 && day === 1)
      return { name: "عيد الثورة", type: "NATIONAL" };

    // 2. Islamic Holidays (Approximate using Intl)
    const hijriString = getHijriDate(date); // e.g., "1/10/1445 AH" -> "M/D/YYYY AH"
    // Remove " AH" and split
    const [hMonth, hDay] = hijriString.split(" ")[0].split("/").map(Number);

    // Islamic Dates (Month/Day)
    // 1: Muharram, 9: Ramadan, 10: Shawwal, 12: Dhu al-Hijjah
    if (hMonth === 1 && hDay === 1)
      return { name: "رأس السنة الهجرية", type: "ISLAMIC" };
    if (hMonth === 1 && hDay === 10)
      return { name: "عاشوراء", type: "ISLAMIC" };
    if (hMonth === 3 && hDay === 12)
      return { name: "المولد النبوي", type: "ISLAMIC" };
    if (hMonth === 9 && hDay === 1)
      return { name: "أول رمضان", type: "ISLAMIC" };
    if (hMonth === 10 && hDay === 1)
      return { name: "عيد الفطر", type: "ISLAMIC" };
    if (hMonth === 10 && hDay === 2)
      return { name: "ثاني أيام عيد الفطر", type: "ISLAMIC" };
    if (hMonth === 12 && hDay === 10)
      return { name: "عيد الأضحى", type: "ISLAMIC" };
    if (hMonth === 12 && hDay === 11)
      return { name: "ثاني أيام عيد الأضحى", type: "ISLAMIC" };

    return null;
  };

  return { getHoliday };
}
