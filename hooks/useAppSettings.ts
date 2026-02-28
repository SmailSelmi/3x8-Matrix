import { useState, useEffect, useCallback } from "react";
import { SystemType } from "@/lib/shiftPatterns";

export type AccentColor = "blue" | "emerald" | "violet" | "amber";

export interface AppSettings {
  userName: string;
  systemType: SystemType;
  cycleStartDate: string;
  initialCycleDay: number; // 1, 2, or 3 for 3x8
  workDuration: number; // days in work period
  vacationDuration: number; // days in vacation period
  addRouteDays: boolean; // add 2 days (travel) to vacation
  language: "ar" | "en";
  notifications: boolean;
  notificationLeadTime: number; // minutes
  hapticFeedback: boolean;
  theme: "dark" | "midnight";
  accentColor: AccentColor; // primary glow/highlight color
  profileImage?: string | null;
  dismissedAnnouncements: string[]; // Legacy
  announcementDismissals: Record<string, number>;
  annualLeaveTotal: number;
  annualLeaveBlocks: { id: string; start: string; end: string }[];
  workDurationExtension: number; // days added to current cycle
}

const STORAGE_KEY = "trois_huit_settings";

const DEFAULTS: AppSettings = {
  userName: "المستخدم",
  systemType: "3x8_industrial",
  cycleStartDate: "2024-01-01",
  initialCycleDay: 1,
  workDuration: 28,
  vacationDuration: 7,
  addRouteDays: false,
  language: "ar",
  notifications: true,
  notificationLeadTime: 30,
  hapticFeedback: true,
  theme: "dark",
  accentColor: "blue",
  profileImage: null,
  dismissedAnnouncements: [],
  announcementDismissals: {},
  annualLeaveTotal: 30,
  annualLeaveBlocks: [],
  workDurationExtension: 0,
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
        setSettings(DEFAULTS);
      }
    } else {
      setIsFirstLaunch(true);
    }
    setLoading(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULTS);
    setIsFirstLaunch(true);
  }, []);

  return { settings, updateSettings, resetSettings, loading, isFirstLaunch };
};
