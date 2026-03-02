// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppSettings } from "@/hooks/useAppSettings";
import useShiftLogic from "@/hooks/useShiftLogic";
import useClock from "@/hooks/useClock";
import useSwipeNavigation from "@/hooks/useSwipeNavigation";
import { useStats } from "@/hooks/useStats";
import { useNotifications } from "@/hooks/useNotifications";
import { useScheduleExport } from "@/hooks/useScheduleExport";
import { getShiftForDate } from "@/hooks/useShiftLogic";
import { isSameDay, format, addDays, subDays, startOfMonth } from "date-fns";
import { arDZ } from "date-fns/locale";
import { Compass, Plus, Minus } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";
import ScheduleSnapshot from "@/components/ScheduleSnapshot";

// Components
import Header from "@/components/Header";
import BottomNav, { NavTab } from "@/components/BottomNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import ShiftGauge from "@/components/ShiftGauge";
import ShiftCard from "@/components/ShiftCard";
import CalendarView from "@/components/CalendarView";
import StatsView from "@/components/StatsView";
import SettingsView from "@/components/SettingsView";
import PersonalInfoView from "@/components/PersonalInfoView";
import Onboarding from "@/components/Onboarding";
import AnnouncementBanner from "@/components/AnnouncementBanner";

import HealthView from "@/components/HealthView";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<NavTab>("HOME");
  const [selectedAgendaDate, setSelectedAgendaDate] = useState(new Date());

  // Lifted Calibration & Extension States
  const [calibrationStep, setCalibrationStep] = useState<
    "none" | "sync_work" | "sync_vacation"
  >("none");
  const [showCalibrationMenu, setShowCalibrationMenu] = useState(false);
  const [showExtensionMenu, setShowExtensionMenu] = useState(false);
  const { settings, loading, isFirstLaunch, updateSettings, resetSettings } =
    useAppSettings();
  const clock = useClock();

  const shiftInfo = useShiftLogic(
    settings?.cycleStartDate || "2024-01-01",
    settings?.systemType || "3x8_industrial",
    settings?.initialCycleDay || 1,
    settings?.workDuration || 28,
    settings?.vacationDuration || 7,
    settings?.addRouteDays || false,
    settings?.annualLeaveBlocks || [],
    settings?.workDurationExtension || 0,
    clock.now,
  );

  const agendaShiftInfo = useShiftLogic(
    settings?.cycleStartDate || "2024-01-01",
    settings?.systemType || "3x8_industrial",
    settings?.initialCycleDay || 1,
    settings?.workDuration || 28,
    settings?.vacationDuration || 7,
    settings?.addRouteDays || false,
    settings?.annualLeaveBlocks || [],
    settings?.workDurationExtension || 0,
    selectedAgendaDate,
  );

  const stats = useStats(
    settings?.cycleStartDate || "2024-01-01",
    settings?.systemType || "3x8_industrial",
    settings?.initialCycleDay || 1,
    settings?.workDuration || 28,
    settings?.vacationDuration || 7,
    settings?.addRouteDays || false,
    settings?.annualLeaveBlocks || [],
    settings?.annualLeaveTotal || 30,
    settings?.workDurationExtension || 0,
    clock.now,
  );

  // Initialize Smart Notifications
  useNotifications(settings, shiftInfo);

  // Schedule Export
  const { snapshotRef, exportImage, isExporting } = useScheduleExport();
  const [exportMonth, setExportMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  // Apply accent color and global direction whenever settings change
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.setAttribute(
        "data-accent",
        settings.accentColor,
      );
    }
    document.documentElement.dir = "rtl";
  }, [settings.accentColor]);

  const handleExportSchedule = (month: Date) => {
    setExportMonth(month);
    // Small delay to let snapshot re-render with the right month
    requestAnimationFrame(() => exportImage(month));
  };

  // Swipe Navigation
  useSwipeNavigation({
    enabled: true,
    onSwipeLeft: () => {
      const navTabs: NavTab[] = ["HOME", "AGENDA", "STATS", "HEALTH"];
      const currentIndex = navTabs.indexOf(activeTab);
      if (currentIndex === -1) return;
      if (currentIndex > 0) {
        setActiveTab(navTabs[currentIndex - 1]);
      }
    },
    onSwipeRight: () => {
      const navTabs: NavTab[] = ["HOME", "AGENDA", "STATS", "HEALTH"];
      const currentIndex = navTabs.indexOf(activeTab);
      if (currentIndex === -1) return;
      if (currentIndex < navTabs.length - 1) {
        setActiveTab(navTabs[currentIndex + 1]);
      }
    },
  });
  // Announcement Dismissal
  const handleDismissVacationAnnouncement = () => {
    const currentDismissals =
      settings.announcementDismissals?.["vacation_ux_feature"] || 0;
    updateSettings({
      announcementDismissals: {
        ...settings.announcementDismissals,
        ["vacation_ux_feature"]: currentDismissals + 1,
      },
    });
  };

  const showVacationAnnouncement =
    (settings.announcementDismissals?.["vacation_ux_feature"] || 0) < 3;

  // Lifted Calibration & Extension Logic
  const handleCalibration = (type: typeof calibrationStep) => {
    setCalibrationStep(type);
    setShowCalibrationMenu(false);
  };

  const executeCalibration = () => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const currentDate = new Date(settings.cycleStartDate);

    switch (calibrationStep) {
      case "sync_work":
        updateSettings({ cycleStartDate: todayStr });
        break;
      case "sync_vacation":
        updateSettings({
          cycleStartDate: format(
            subDays(new Date(), settings.workDuration),
            "yyyy-MM-dd",
          ),
        });
        break;
    }

    setCalibrationStep("none");
  };
  // Onboarding logic
  if (isFirstLaunch) {
    return (
      <Onboarding
        onComplete={(s) => {
          updateSettings(s);
          // Wait for settings to save and refresh or use local state to hide
          setTimeout(() => window.location.reload(), 500);
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "HOME":
        return (
          <div
            key="home"
            className="flex-1 flex flex-col items-center gap-4 pb-28 pt-2 overflow-y-auto no-scrollbar animate-fade-in"
          >
            {showVacationAnnouncement && (
              <div className="w-full max-w-md mt-2">
                <AnnouncementBanner
                  title="تحديث للإجازات"
                  description="تمت إضافة ميزة الإجازات الممتدة"
                  onDismiss={handleDismissVacationAnnouncement}
                />
              </div>
            )}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-md">
              <ShiftGauge
                cycleProgress={
                  shiftInfo.isVacation
                    ? shiftInfo.superCycleProgress
                    : shiftInfo.cycleProgress
                }
                shiftProgress={shiftInfo.percentComplete / 100}
                shiftType={shiftInfo.type}
                cycleDay={shiftInfo.cycleDay}
                totalCycleDays={
                  settings.systemType === "3x8_industrial" ? 3 : 7
                }
                hoursRemaining={shiftInfo.hoursRemaining}
                color={shiftInfo.color}
                isVacation={shiftInfo.isVacation}
                vacationDay={shiftInfo.vacationDay}
                totalVacationDays={shiftInfo.totalVacationDays}
              />
              <div className="w-full px-6">
                <ShiftCard
                  shiftInfo={shiftInfo}
                  onShowCalibration={() => setShowCalibrationMenu(true)}
                  onShowExtension={() => setShowExtensionMenu(true)}
                  extensionActive={settings.workDurationExtension > 0}
                />
              </div>
            </div>
          </div>
        );
      case "AGENDA":
        const isSelectedToday = isSameDay(selectedAgendaDate, clock.now);
        return (
          <div
            key="agenda"
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-28 pt-2 animate-fade-in"
          >
            {/* Calendar strip / expanded grid — not overflow-hidden so it grows naturally */}
            <CalendarView
              settings={settings}
              updateSettings={updateSettings}
              cycleStartDate={settings.cycleStartDate}
              systemType={settings.systemType}
              initialCycleDay={settings.initialCycleDay}
              workDuration={settings.workDuration}
              vacationDuration={settings.vacationDuration}
              addRouteDays={settings.addRouteDays}
              workDurationExtension={settings.workDurationExtension || 0}
              selectedDate={selectedAgendaDate}
              onDateSelect={setSelectedAgendaDate}
              onShowCalibration={() => setShowCalibrationMenu(true)}
              onShowExtension={() => setShowExtensionMenu(true)}
              onExportSchedule={handleExportSchedule}
              isExporting={isExporting}
            />

            {/* Detail card — sits below calendar, scrolls with it */}
            <div className="px-6 mt-2">
              {!isSelectedToday ? (
                <div key="detail" className="mt-2 animate-fade-in">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black text-slate-100 italic">
                        {format(selectedAgendaDate, "dd/MM/yy")}
                      </h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        تفاصيل اليوم المحدد
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 rounded-3xl border border-blue-500/10 p-1">
                    <ShiftCard shiftInfo={agendaShiftInfo} isToday={false} />
                  </div>
                </div>
              ) : (
                <div
                  key="empty"
                  className="flex flex-col items-center justify-center pt-8 text-center animate-fade-in"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-3xl relative z-10">📅</span>
                  </div>
                  <h4 className="text-slate-200 font-black text-lg mb-2">
                    اكتشف جدولك
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 max-w-[240px] leading-relaxed">
                    نظرة تفصيلية على مناوباتك وأيام راحتك
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "STATS":
        return (
          <div
            key="stats"
            className="flex-1 px-6 pb-28 pt-2 overflow-y-auto no-scrollbar animate-fade-in"
          >
            <StatsView settings={settings} />
          </div>
        );
      case "PROFILE":
        return (
          <div
            key="profile"
            className="flex-1 px-6 pb-28 pt-2 overflow-y-auto no-scrollbar animate-fade-in"
          >
            <PersonalInfoView
              settings={settings}
              updateSettings={updateSettings}
            />
          </div>
        );
      case "HEALTH":
        return (
          <div
            key="health"
            className="flex-1 px-6 pb-28 pt-2 overflow-y-auto no-scrollbar animate-fade-in"
          >
            <HealthView />
          </div>
        );
      case "SETTINGS":
        return (
          <div
            key="settings"
            className="flex-1 px-6 pb-28 pt-2 overflow-y-auto no-scrollbar animate-fade-in"
          >
            <SettingsView
              settings={settings}
              updateSettings={updateSettings}
              resetSettings={resetSettings}
              onClose={() => setActiveTab("HOME")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="h-[100dvh] w-full flex flex-col relative overflow-hidden bg-[#020617]">
      <AnimatedBackground shiftType={shiftInfo.type} />

      <Header
        userName={settings.userName || "زميل"}
        profileImage={settings.profileImage}
        currentTime={clock.now}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      <div
        key={activeTab}
        className="flex-1 flex flex-col overflow-hidden relative animate-fade-in"
      >
        {renderContent()}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Lifted Global Menus */}
      <BottomSheet
        isOpen={showCalibrationMenu}
        onClose={() => setShowCalibrationMenu(false)}
        title="معايرة يدوية"
      >
        <div className="flex flex-col gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
            <button
              onClick={() => handleCalibration("sync_work")}
              className={`p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all group text-right`}
            >
              <span className="block text-xs font-black text-emerald-400 mb-1">
                بدأت العمل
              </span>
              <span className="block text-[9px] font-bold text-slate-500 leading-tight">
                مزامنة الدورة للبدء اليوم
              </span>
            </button>
            <button
              onClick={() => handleCalibration("sync_vacation")}
              className={`p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all group text-right`}
            >
              <span className="block text-xs font-black text-blue-400 mb-1">
                بدأت الإجازة
              </span>
              <span className="block text-[9px] font-bold text-slate-500 leading-tight">
                مزامنة للدخول في إجازة اليوم
              </span>
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={calibrationStep !== "none"}
        onClose={() => setCalibrationStep("none")}
        title="تأكيد المعايرة"
      >
        <div className="flex flex-col gap-6 text-center py-4">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <Compass size={40} className="animate-pulse" />
          </div>
          <p className="text-slate-400 font-bold leading-relaxed text-sm px-6">
            {calibrationStep === "sync_work" &&
              "تأكيد مزامنة بداية العمل اليوم"}
            {calibrationStep === "sync_vacation" &&
              "تأكيد مزامنة بداية الإجازة اليوم"}
          </p>
          <div className="grid grid-cols-2 gap-4 px-6">
            <button
              onClick={() => setCalibrationStep("none")}
              className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={executeCalibration}
              className="py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black transition-all"
            >
              تأكيد
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showExtensionMenu}
        onClose={() => setShowExtensionMenu(false)}
        title="تمديد فترة العمل"
      >
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed text-center px-4">
              {`تجاوز دورة العمل الـ ${settings.workDuration} يوم`}
            </p>

            <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-3xl p-3 mx-1">
              <button
                onClick={() =>
                  updateSettings({
                    workDurationExtension: Math.max(
                      0,
                      (settings.workDurationExtension || 0) - 1,
                    ),
                  })
                }
                className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400"
              >
                <Minus size={24} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-slate-100 italic">
                  {settings.workDurationExtension || 0}
                </span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                  أيام إضافية
                </span>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    workDurationExtension:
                      (settings.workDurationExtension || 0) + 1,
                  })
                }
                className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400"
              >
                <Plus size={24} />
              </button>
            </div>

            {settings.workDurationExtension > 0 && (
              <div className="flex flex-col gap-3 mx-1">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <Plus size={18} className="text-blue-400" />
                  <p className="text-[11px] font-bold text-blue-300 leading-tight">
                    تم التمديد إلى{" "}
                    <span className="text-white font-black">
                      {settings.workDuration + settings.workDurationExtension}
                    </span>{" "}
                    أيام
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ workDurationExtension: 0 })}
                  className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest"
                >
                  إعادة تعيين
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowExtensionMenu(false)}
            className="py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black transition-all mx-1"
          >
            إغلاق
          </button>
        </div>
      </BottomSheet>

      {/* Hidden export snapshot */}
      <ScheduleSnapshot
        snapshotRef={snapshotRef}
        month={exportMonth}
        userName={settings.userName || "زميل"}
        cycleStartDate={settings.cycleStartDate}
        systemType={settings.systemType}
        initialCycleDay={settings.initialCycleDay}
        workDuration={settings.workDuration}
        vacationDuration={settings.vacationDuration}
        addRouteDays={settings.addRouteDays}
        annualLeaveBlocks={settings.annualLeaveBlocks || []}
        workDurationExtension={settings.workDurationExtension || 0}
      />
    </main>
  );
}
