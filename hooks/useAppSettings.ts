// hooks/useAppSettings.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'shift_app_settings';

export interface AppSettings {
  startDate: string; // YYYY-MM-DD
  workDays: number;
  leaveDays: number;
  calculationMode?: 'START_WORK' | 'START_LEAVE';
  startShiftOffset?: number; // 0: Afternoon, 1: Double, 2: Rest
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // تحميل الإعدادات عند فتح التطبيق
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppSettings;
        // التحقق من صحة البيانات
        if (parsed.startDate && parsed.workDays > 0 && parsed.leaveDays > 0) {
          setSettings(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("خطأ في قراءة البيانات", e);
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  // دالة الحفظ
  const saveSettings = useCallback((newSettings: AppSettings) => {
    // تنظيف وتصحيح البيانات قبل الحفظ
    const cleaned: AppSettings = {
      startDate: newSettings.startDate,
      workDays: Math.max(1, Math.round(newSettings.workDays)),
      leaveDays: Math.max(1, Math.round(newSettings.leaveDays)),
      calculationMode: newSettings.calculationMode || 'START_WORK',
      startShiftOffset: newSettings.startShiftOffset ?? 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    setSettings(cleaned);
  }, []);

  // دالة المسح (إعادة ضبط المصنع)
  const clearSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(null);
  }, []);

  return { settings, loading, saveSettings, clearSettings };
};
