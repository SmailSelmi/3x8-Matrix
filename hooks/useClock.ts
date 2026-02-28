// hooks/useClock.ts
'use client';

import { useState, useEffect } from 'react';
import { formatArabicDate, getHijriDate } from '@/lib/dateUtils';

export default function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return {
    now,
    timeString,
    dateStringArabic: formatArabicDate(now),
    dateStringHijri: getHijriDate(now)
  };
}
