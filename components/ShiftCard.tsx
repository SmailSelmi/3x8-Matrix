// components/ShiftCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShiftInfo } from "@/hooks/useShiftLogic";
import GlassCard from "./GlassCard";
import { Compass, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arDZ } from "date-fns/locale";

interface ShiftCardProps {
  shiftInfo: ShiftInfo;
  isToday?: boolean;
  onShowCalibration?: () => void;
  onShowExtension?: () => void;
  extensionActive?: boolean;
}

export default function ShiftCard({
  shiftInfo,
  isToday = true,
  onShowCalibration,
  onShowExtension,
  extensionActive = false,
}: ShiftCardProps) {
  return (
    <GlassCard
      glow
      glowColor={shiftInfo.color}
      className="w-full p-6 flex flex-col gap-5 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {isToday ? "الحالة الحالية" : "تفاصيل اليوم"}
          </span>
          <h3 className="text-xl font-black text-slate-100">
            {shiftInfo.isVacation
              ? "أنت الآن في فترة إجازة 🌴"
              : shiftInfo.type === "rest"
                ? "أنت في يوم راحة 🛡️"
                : `فترة ${shiftInfo.label}`}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onShowCalibration && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowCalibration();
              }}
              className="p-2 rounded-xl transition-all flex items-center gap-2 relative bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
              title="معايرة الجدول"
            >
              <Compass size={14} />
            </button>
          )}

          {onShowExtension && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowExtension();
              }}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 relative active:scale-95 ${
                extensionActive
                  ? "bg-blue-500/20 border border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "bg-blue-500/5 border border-blue-500/10 text-blue-500 hover:bg-blue-500/10"
              }`}
              title="تمديد فترة العمل"
            >
              <Plus size={14} />

              {extensionActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-slate-950 rounded-full animate-bounce" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Primary time slot */}
        <div className="flex justify-between items-center text-[11px] font-mono font-bold text-slate-400">
          <span>{shiftInfo.startTime}</span>
          <span className="text-slate-600 text-[9px]">───────</span>
          <span>{shiftInfo.endTime}</span>
        </div>

        {/* Secondary time slot — Day 2 full-day calendar view only */}
        {shiftInfo.startTime2 && shiftInfo.endTime2 && (
          <div className="flex justify-between items-center text-[11px] font-mono font-bold text-slate-400">
            <span>{shiftInfo.startTime2}</span>
            <span className="text-slate-600 text-[9px]">───────</span>
            <span>{shiftInfo.endTime2}</span>
          </div>
        )}

        {isToday && shiftInfo.type !== "rest" && (
          <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${shiftInfo.percentComplete}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: shiftInfo.color }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">
            {shiftInfo.isVacation ? "الاستئناف:" : "التالي:"}
          </span>
          <span className="text-[11px] font-black text-slate-300">
            {shiftInfo.isVacation
              ? `${format(parseISO(shiftInfo.returnToWorkDate), "d MMMM", { locale: arDZ })} (${shiftInfo.returnToWorkShiftLabel})`
              : shiftInfo.nextShiftLabel}
          </span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          {`بعد ${shiftInfo.daysUntilNextShift} يوم`}
        </div>
      </div>
    </GlassCard>
  );
}
