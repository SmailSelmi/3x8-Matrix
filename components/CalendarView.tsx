import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfDay, isSameDay, startOfMonth } from "date-fns";
import { arDZ } from "date-fns/locale";
import { SystemType, ShiftType } from "@/lib/shiftPatterns";
import { getShiftForDate } from "@/hooks/useShiftLogic";
import {
  LayoutGrid,
  StretchHorizontal,
  Sun,
  Moon,
  Coffee,
  Download,
  Loader2,
} from "lucide-react";
import MonthGrid from "./MonthGrid";
import { getHolidayForDate } from "@/lib/dateUtils";
import { AppSettings } from "@/hooks/useAppSettings";
import BottomSheet from "./BottomSheet";
import { Compass, Plus, Minus } from "lucide-react";
import AnnouncementBanner from "./AnnouncementBanner";

interface CalendarViewProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  cycleStartDate: string;
  systemType: SystemType;
  initialCycleDay?: number;
  workDuration?: number;
  vacationDuration?: number;
  addRouteDays?: boolean;
  workDurationExtension?: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onShowCalibration: () => void;
  onShowExtension: () => void;
  onExportSchedule?: (month: Date) => void;
  isExporting?: boolean;
}

const SHIFT_ICONS: Record<ShiftType, React.ReactNode> = {
  day: <Sun size={12} className="text-orange-400" />,
  evening: <Sun size={12} className="text-purple-400" />,
  night: <Moon size={12} className="text-blue-400" />,
  rest: <Coffee size={12} className="text-slate-500" />,
  leave: <Coffee size={12} className="text-green-500" />,
};

export default function CalendarView({
  settings,
  updateSettings,
  cycleStartDate,
  systemType,
  initialCycleDay = 1,
  workDuration = 28,
  vacationDuration = 7,
  addRouteDays = false,
  workDurationExtension = 0,
  selectedDate,
  onDateSelect,
  onShowCalibration,
  onShowExtension,
  onExportSchedule,
  isExporting = false,
}: CalendarViewProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [gridMonth, setGridMonth] = React.useState(() =>
    startOfMonth(new Date()),
  );
  // State and operations lifted to page.tsx
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);
  const today = startOfDay(new Date());

  const handleDismissAnnouncement = () => {
    const currentDismissals =
      settings.announcementDismissals?.["calibration_feature"] || 0;
    updateSettings({
      announcementDismissals: {
        ...settings.announcementDismissals,
        ["calibration_feature"]: currentDismissals + 1,
      },
    });
  };

  const showAnnouncement =
    (settings.announcementDismissals?.["calibration_feature"] || 0) < 3;

  const scrollToToday = React.useCallback((instant = false) => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: instant ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  // Auto-scroll to today
  React.useEffect(() => {
    if (!isExpanded) {
      const timer = setTimeout(() => scrollToToday(), 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, scrollToToday]);

  const days = Array.from({ length: 60 }, (_, i) => addDays(today, i - 10));

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between px-6 pt-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          تقويم فترة العمل
        </span>
        <div className="flex items-center gap-2">
          {/* Export button — only visible when month grid is expanded */}
          {isExpanded && onExportSchedule && (
            <button
              onClick={() => onExportSchedule(gridMonth)}
              disabled={isExporting}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-50 transition-all flex items-center gap-2"
              title="تحميل جدول الشهر"
            >
              {isExporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span className="text-[10px] font-black uppercase">
                {isExporting ? "..." : "تحميل"}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2"
          >
            {isExpanded ? (
              <StretchHorizontal size={14} />
            ) : (
              <LayoutGrid size={14} />
            )}
            <span className="text-[10px] font-black uppercase">
              {isExpanded ? "عرض مصغر" : "عرض الشهر"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAnnouncement && (
          <AnnouncementBanner
            title="ميزة جديدة: معايرة الجدول 🧭"
            description="يمكنك الآن تصحيح جدولك يدوياً في حال المرض، ضياع الرحلات، أو العمل الإضافي. اضغط على أيقونة البوصلة أعلاه!"
            onDismiss={handleDismissAnnouncement}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5"
          >
            <div>
              <MonthGrid
                cycleStartDate={cycleStartDate}
                systemType={systemType}
                initialCycleDay={initialCycleDay}
                workDuration={workDuration}
                vacationDuration={vacationDuration}
                addRouteDays={addRouteDays}
                workDurationExtension={workDurationExtension}
                annualLeaveBlocks={settings.annualLeaveBlocks || []}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                onMonthChange={setGridMonth}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="strip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onAnimationComplete={() => scrollToToday()}
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 py-4"
            dir="rtl"
          >
            {days.map((date, idx) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);
              const shiftType = getShiftForDate(
                date,
                cycleStartDate,
                systemType,
                initialCycleDay,
                workDuration,
                vacationDuration,
                addRouteDays,
                settings.annualLeaveBlocks || [],
                workDurationExtension,
              );
              const holiday = getHolidayForDate(date);

              return (
                <button
                  key={idx}
                  ref={isToday ? todayRef : null}
                  onClick={() => onDateSelect(date)}
                  style={
                    isSelected
                      ? {
                          borderColor: "rgba(var(--accent-rgb),0.15)",
                          backgroundColor: "rgba(var(--accent-rgb),0.08)",
                        }
                      : {}
                  }
                  className={`
                    flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center gap-2
                    snap-center transition-all duration-300 relative
                    ${isSelected ? "border scale-105" : "bg-white/[0.02] border border-transparent"}
                  `}
                >
                  <span className="text-[10px] font-black text-slate-500">
                    {format(date, "EEEE", { locale: arDZ }).split(" ")[0]}
                  </span>
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`text-xl font-black font-mono ${isSelected ? "text-white" : "text-slate-400"}`}
                    >
                      {format(date, "d")}
                    </span>
                    {holiday && (
                      <span
                        className="absolute -top-1 -right-4 text-[10px]"
                        title={holiday.name}
                      >
                        {holiday.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center h-4">
                    {SHIFT_ICONS[shiftType]}
                  </div>

                  {isToday && !isSelected && (
                    <div
                      className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer action bar — visible only when month grid is expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-center gap-3 px-6 pb-4 pt-2 border-t border-white/5"
          >
            <button
              onClick={() => onShowCalibration()}
              className={`flex-1 p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                showAnnouncement
                  ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/10"
                  : "bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10"
              }`}
              title="معايرة الجدول"
            >
              <Compass
                size={14}
                className={showAnnouncement ? "animate-pulse" : ""}
              />
              <span className="text-[10px] font-black uppercase">
                معايرة الجدول
              </span>
              {showAnnouncement && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-bounce" />
              )}
            </button>

            <button
              onClick={() => onShowExtension()}
              className={`flex-1 p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 relative ${
                settings.workDurationExtension > 0
                  ? "bg-blue-500/20 border border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "bg-blue-500/5 border border-blue-500/10 text-blue-500 hover:bg-blue-500/10"
              }`}
              title="تمديد فترة العمل"
            >
              <Plus size={14} />
              <span className="text-[10px] font-black uppercase">
                تمديد فترة العمل
              </span>
              {settings.workDurationExtension > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-slate-950 rounded-full animate-bounce" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
