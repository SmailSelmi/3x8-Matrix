import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'shift_app_settings';

export interface AppSettings {
  startDate: string; // YYYY-MM-DD
  workDays: number;
  leaveDays: number;
  calculationMode?: 'START_WORK' | 'START_LEAVE';
  startShiftOffset?: number; // 0: Afternoon, 1: Double, 2: Rest
}

// Helper to get from localStorage safely
const getSnapshot = () => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as AppSettings;
    if (parsed.startDate && parsed.workDays > 0 && parsed.leaveDays > 0) {
      return saved; // Return the string to avoid unnecessary re-renders (parsing happens later)
    }
  } catch {
    // Ignore error
  }
  return null;
};

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('shift_settings_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('shift_settings_changed', callback);
  };
};

export const useAppSettings = () => {
  const settingsRaw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  
  const settings: AppSettings | null = settingsRaw ? JSON.parse(settingsRaw) : null;
  const loading = false; // With useSyncExternalStore, it's immediately synced or null

  const saveSettings = useCallback((newSettings: AppSettings) => {
    const cleaned: AppSettings = {
      startDate: newSettings.startDate,
      workDays: Math.max(1, Math.round(newSettings.workDays)),
      leaveDays: Math.max(1, Math.round(newSettings.leaveDays)),
      calculationMode: newSettings.calculationMode || 'START_WORK',
      startShiftOffset: newSettings.startShiftOffset ?? 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new Event('shift_settings_changed'));
  }, []);

  const clearSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('shift_settings_changed'));
  }, []);

  return { settings, loading, saveSettings, clearSettings };
};

