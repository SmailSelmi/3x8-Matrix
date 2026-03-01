// components/Onboarding.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSettings } from "@/hooks/useAppSettings";
import { SystemType } from "@/lib/shiftPatterns";
import GlassCard from "./GlassCard";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import DatePickerAr from "./DatePickerAr";
import { format } from "date-fns";

interface OnboardingProps {
  onComplete: (settings: Partial<AppSettings>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    userName: string;
    cycleStartDate: string;
    initialCycleDay: number;
    systemType: SystemType;
    workDuration: number;
    vacationDuration: number;
    addRouteDays: boolean;
  }>({
    userName: "",
    cycleStartDate: format(new Date(), "yyyy-MM-dd"),
    initialCycleDay: 1,
    systemType: "3x8_industrial",
    workDuration: 28,
    vacationDuration: 4,
    addRouteDays: false,
  });

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = () => {
    if (formData.userName) {
      onComplete(formData);
    }
  };

  const steps = [
    {
      title: "مرحباً بك!",
      description: "أخبرنا ما هو اسمك الكريم؟",
      content: (
        <input
          type="text"
          autoFocus
          placeholder="أدخل اسمك هنا..."
          className="w-full bg-[#0f172a] border border-white/5 rounded-2xl px-6 py-4 text-xl font-black text-center text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-Tajawal"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />
      ),
    },
    {
      title: "بداية الدورة",
      description: "متى بدأت دورتك الحالية؟",
      content: (
        <div className="flex flex-col items-center">
          <DatePickerAr
            selectedDate={new Date(formData.cycleStartDate)}
            onChange={(date) =>
              setFormData({
                ...formData,
                cycleStartDate: format(date, "yyyy-MM-dd"),
              })
            }
          />
        </div>
      ),
    },
    {
      title: "نوع فترة العمل",
      description: "أي فترة عمل كانت لديك في هذا التاريخ؟",
      content: (
        <div className="flex flex-col gap-2">
          {[
            { id: 1, label: "اليوم الأول: مسائي", desc: "13:00 - 20:00" },
            {
              id: 2,
              label: "اليوم الثاني: صباحي + ليلي",
              desc: "07h-13h / 20h-07h",
            },
            { id: 3, label: "اليوم الثالث: راحة", desc: "ابتداءً من 07:00" },
          ].map((shift) => (
            <button
              key={shift.id}
              onClick={() =>
                setFormData({ ...formData, initialCycleDay: shift.id })
              }
              className={`p-4 rounded-2xl border transition-all text-right flex flex-col ${
                formData.initialCycleDay === shift.id
                  ? "bg-blue-600/10 border-blue-500 shadow-lg"
                  : "bg-white/[0.02] border-white/[0.05] text-slate-500"
              }`}
            >
              <div
                className={`font-black text-sm ${formData.initialCycleDay === shift.id ? "text-white" : ""}`}
              >
                {shift.label}
              </div>
              <div className="text-[10px] opacity-60 mt-0.5">{shift.desc}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "نظام العمل",
      description: "اختر نظام الدوام الخاص بك للاستمرار",
      content: (
        <div className="flex flex-col gap-3">
          {[
            {
              id: "3x8_industrial",
              label: "نظام (3×8) الصناعي",
              desc: "دورة من 3 أيام (مسائي، صباحي+ليلي، راحة)",
            },
            {
              id: "5x2_admin",
              label: "نظام (5×2) الإداري",
              desc: "دورة إسبوعية (أحد - خميس)",
            },
          ].map((sys) => (
            <button
              key={sys.id}
              onClick={() =>
                setFormData({ ...formData, systemType: sys.id as SystemType })
              }
              className={`p-5 rounded-2xl border transition-all flex items-center justify-between text-right ${
                formData.systemType === sys.id
                  ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10"
                  : "bg-white/[0.02] border-white/[0.05] hover:border-white/10"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`font-black text-sm ${formData.systemType === sys.id ? "text-blue-400" : "text-slate-200"}`}
                >
                  {sys.label}
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  {sys.desc}
                </div>
              </div>
              {formData.systemType === sys.id && (
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                  <Check size={14} className="text-blue-400" />
                </div>
              )}
            </button>
          ))}
          <div className="p-4 rounded-2xl border border-dashed border-white/5 opacity-40 grayscale flex flex-col gap-1 text-right">
            <span className="text-xs font-black text-slate-500">
              أنظمة أخرى...
            </span>
            <span className="text-[9px] font-bold text-slate-600 italic">
              قريباً في التحديثات القادمة
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "مدة الدورة",
      description: "حدد عدد أيام العمل والإجازة",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2 text-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                أيام العمل
              </label>
              <input
                type="number"
                value={formData.workDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workDuration: parseInt(e.target.value) || 28,
                  })
                }
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-lg font-black text-center text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-Tajawal"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 text-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                أيام الإجازة
              </label>
              <input
                type="number"
                value={formData.vacationDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vacationDuration: parseInt(e.target.value) || 7,
                  })
                }
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-lg font-black text-center text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all font-Tajawal"
              />
            </div>
          </div>

          <button
            onClick={() =>
              setFormData({ ...formData, addRouteDays: !formData.addRouteDays })
            }
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              formData.addRouteDays
                ? "bg-blue-600/10 border-blue-500"
                : "bg-white/[0.02] border-white/[0.05] text-slate-500"
            }`}
          >
            <div className="text-right">
              <div
                className={`font-black text-sm ${formData.addRouteDays ? "text-white" : ""}`}
              >
                أيام الطريق (Route Days)
              </div>
              <div className="text-[10px] opacity-60 mt-0.5">
                إضافة +2 يوم لإجمالي الإجازة
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full relative transition-colors ${formData.addRouteDays ? "bg-blue-600" : "bg-white/10"}`}
            >
              <motion.div
                animate={{ x: formData.addRouteDays ? -18 : -2 }}
                className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"
              />
            </div>
          </button>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-start overflow-y-auto p-6 text-right"
      dir="rtl"
    >
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.1, x: -20 }}
          className="w-full max-w-md my-auto py-8"
        >
          <GlassCard
            className="p-6 md:p-8 flex flex-col gap-6 md:gap-8 relative overflow-visible"
            glow
            glowColor="#3b82f6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                  الخطوة {step} من {steps.length}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 italic">
                {currentStep.title}
              </h1>
              <p className="text-xs md:text-sm font-black text-slate-500">
                {currentStep.description}
              </p>
            </div>

            <div className="min-h-[200px] flex flex-col justify-center">
              {currentStep.content}
            </div>

            <div className="flex gap-3 mt-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="p-4 bg-white/[0.05] rounded-2xl text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={step === steps.length ? handleFinish : nextStep}
                disabled={step === 1 && !formData.userName}
                className={`flex-1 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${
                  step === 1 && !formData.userName
                    ? "bg-white/5 text-slate-600 cursor-not-allowed"
                    : "bg-blue-600 text-white shadow-blue-900/20"
                }`}
              >
                {step === steps.length ? "ابدأ الاستخدام" : "التالي"}
                {step < steps.length && <ChevronLeft size={20} />}
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
