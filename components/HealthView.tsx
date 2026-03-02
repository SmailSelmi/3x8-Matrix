"use client";

import React from "react";
import GlassCard from "./GlassCard";
import { useAppSettings } from "@/hooks/useAppSettings";
import { getShiftForDate } from "@/hooks/useShiftLogic";
import { Calendar, Moon, Sun, Coffee, HeartPulse } from "lucide-react";
import { format } from "date-fns";

export default function HealthView() {
  const { settings } = useAppSettings();

  // Calculate today's shift
  const today = new Date();
  const currentShiftType = getShiftForDate(
    today,
    settings.cycleStartDate,
    settings.systemType,
    settings.initialCycleDay,
    settings.workDuration,
    settings.vacationDuration,
    settings.addRouteDays,
    settings.annualLeaveBlocks || [],
  );

  // Derive health tips based on current shift
  const getHealthTips = () => {
    switch (currentShiftType) {
      case "day": // Morning / Matin
        return {
          title: "صحة الدوام الصباحي",
          tips: [
            {
              icon: <Sun className="text-amber-500" />,
              text: "نم مبكراً ليلة أمس. استهدف 7-8 ساعات نوم.",
            },
            {
              icon: <Coffee className="text-amber-700" />,
              text: "اشرب القهوة قبل 10 صباحاً لتجنب اضطراب النوم.",
            },
            {
              icon: <HeartPulse className="text-rose-500" />,
              text: "خذ قيلولة قصيرة (20-30 دقيقة) بعد العمل إذا كنت متعباً.",
            },
          ],
        };
      case "evening": // Evening / Soir
        return {
          title: "صحة الدوام المسائي",
          tips: [
            {
              icon: <Sun className="text-blue-400" />,
              text: "نم متأخراً في الصباح. حافظ على جدول منتظم.",
            },
            {
              icon: <HeartPulse className="text-rose-500" />,
              text: "مارس الرياضة قبل الذهاب للعمل، ليس بعده.",
            },
            {
              icon: <Coffee className="text-amber-700" />,
              text: "تجنب الوجبات الثقيلة قبل النوم مباشرة.",
            },
          ],
        };
      case "night": // Night / Nuit
        return {
          title: "صحة الدوام الليلي",
          tips: [
            {
              icon: <Moon className="text-indigo-400" />,
              text: "تجنب الكافيين بعد 4 صباحاً.",
            },
            {
              icon: <HeartPulse className="text-rose-500" />,
              text: "تناول وجبات خفيفة أثناء الليل لتسهيل الهضم.",
            },
            {
              icon: <Sun className="text-amber-500" />,
              text: "ارتدِ نظارات شمسية في طريق العودة للمنزل صباحاً.",
            },
          ],
        };
      case "rest": // Rest / Repos
        return {
          title: "صحة يوم الراحة",
          tips: [
            {
              icon: <Moon className="text-indigo-400" />,
              text: "تعافَ! خذ قيلولة علاجية (8-13 سا) في أول يوم راحة.",
            },
            {
              icon: <Sun className="text-amber-500" />,
              text: "عد تدريجياً لجدول النهار الطبيعي.",
            },
            {
              icon: <HeartPulse className="text-rose-500" />,
              text: "استمتع بالشمس لإعادة ضبط ساعتك البيولوجية.",
            },
          ],
        };
      default:
        return {
          title: "نصائح صحية عامة",
          tips: [
            {
              icon: <HeartPulse className="text-rose-500" />,
              text: "حافظ على ترطيب مناسب لجسمك.",
            },
            {
              icon: <Sun className="text-amber-500" />,
              text: "اتبع نظاماً غذائياً متوازناً.",
            },
            {
              icon: <Moon className="text-indigo-400" />,
              text: "استهدف 7 إلى 9 ساعات من النوم كل 24 ساعة.",
            },
          ],
        };
    }
  };

  const insights = getHealthTips();

  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      <div className="w-full flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-zoom-in">
            <HeartPulse size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-100">صحتي</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            توصيات مخصصة لنمط عملك
          </p>
        </div>

        {/* Current State Info */}
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl">
                <Calendar className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-400">
                  الفترة الحالية
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {format(new Date(), "dd/MM/yy")}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
            <div className="text-xs font-black text-slate-500">
              فترة العمل الحالية
            </div>
            <div
              className={`text-xl font-black ${
                currentShiftType === "day"
                  ? "text-amber-500"
                  : currentShiftType === "evening"
                    ? "text-orange-500"
                    : currentShiftType === "night"
                      ? "text-indigo-400"
                      : currentShiftType === "rest"
                        ? "text-emerald-500"
                        : "text-slate-400"
              }`}
            >
              {currentShiftType === "day"
                ? "صباحي"
                : currentShiftType === "evening"
                  ? "مسائي"
                  : currentShiftType === "night"
                    ? "ليلي"
                    : currentShiftType === "rest"
                      ? "راحة"
                      : currentShiftType === "leave"
                        ? "إجازة"
                        : "—"}
            </div>
          </div>
        </GlassCard>

        {/* Dynamic Tips based on Shift */}
        <div className="flex flex-col gap-3">
          <div className="text-sm font-black text-slate-400 px-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {insights.title}
          </div>

          <div className="grid gap-3">
            {insights.tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex items-start gap-4 hover:bg-white/[0.04] transition-colors animate-slide-up-modal"
                dir="rtl"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="p-2 bg-[#0f172a] rounded-xl shadow-inner mt-0.5">
                  {React.isValidElement(tip.icon)
                    ? React.cloneElement(
                        tip.icon as React.ReactElement,
                        { size: 18 } as React.SVGProps<SVGSVGElement>,
                      )
                    : tip.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-300 leading-relaxed text-right rtl:text-right ltr:text-left">
                    {tip.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
