// components/ScheduleSnapshot.tsx
"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { arDZ } from "date-fns/locale";
import { SystemType, ShiftType } from "@/lib/shiftPatterns";
import { getShiftForDate } from "@/hooks/useShiftLogic";

interface ScheduleSnapshotProps {
  snapshotRef: React.RefObject<HTMLDivElement | null>;
  month: Date;
  userName: string;
  cycleStartDate: string;
  systemType: SystemType;
  initialCycleDay: number;
  workDuration: number;
  vacationDuration: number;
  addRouteDays: boolean;
  annualLeaveBlocks: { id: string; start: string; end: string }[];
  workDurationExtension: number;
}

// ── Shift visual constants ────────────────────────────────────────────────────
const SHIFT_BG: Record<ShiftType, string> = {
  day: "rgba(249,115,22,0.15)",
  evening: "rgba(124,58,237,0.15)",
  night: "rgba(37,99,235,0.15)",
  rest: "rgba(255,255,255,0.04)",
  leave: "rgba(21,128,61,0.15)",
};
const SHIFT_TEXT: Record<ShiftType, string> = {
  day: "#fb923c",
  evening: "#a78bfa",
  night: "#60a5fa",
  rest: "#334155",
  leave: "#4ade80",
};
// Single arabic initial shown inside compact cells
const SHIFT_LABEL: Record<ShiftType, string> = {
  day: "صباحي+ليلي",
  evening: "مسائي",
  night: "ليلي",
  rest: "راحة",
  leave: "إجازة",
};
const SHIFT_DOT: Record<ShiftType, string> = {
  day: "#f97316",
  evening: "#8b5cf6",
  night: "#3b82f6",
  rest: "#1e293b",
  leave: "#22c55e",
};
const SHIFT_FULL: Record<ShiftType, string> = {
  day: "صباحي + ليلي",
  evening: "مسائي",
  night: "ليلي",
  rest: "راحة",
  leave: "إجازة",
};
const WEEKDAYS_SHORT = ["أحد", "اثنين", "ثلاث", "أربع", "خميس", "جمعة", "سبت"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ScheduleSnapshot({
  snapshotRef,
  month,
  userName,
  cycleStartDate,
  systemType,
  initialCycleDay,
  workDuration,
  vacationDuration,
  addRouteDays,
  annualLeaveBlocks,
  workDurationExtension,
}: ScheduleSnapshotProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const monthLabel = format(month, "MMMM yyyy", { locale: arDZ });
  const generatedOn = format(new Date(), "d MMM yyyy", { locale: arDZ });

  return (
    /**
     * Hidden off-screen — 390px portrait (phone-width), captured by html-to-image.
     * All styles are inline to guarantee correct rendering outside the Tailwind context.
     */
    <div
      ref={snapshotRef}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "390px",
        backgroundColor: "#020617",
        fontFamily: "Tajawal, Arial, sans-serif",
        direction: "rtl",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Top rainbow bar ─────────────────────────────────────────────── */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#10b981)",
        }}
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "20px 20px 14px",
          background:
            "linear-gradient(180deg,rgba(59,130,246,0.08) 0%,transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "4px",
              }}
            >
              TROIS HUIT · 3×8
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
              }}
            >
              {monthLabel}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#64748b",
                marginTop: "4px",
              }}
            >
              {userName}
            </div>
          </div>
          <div style={{ fontSize: "36px", lineHeight: 1 }}>📅</div>
        </div>
      </div>

      {/* ── Weekday labels ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "3px",
          padding: "0 12px 4px",
        }}
      >
        {WEEKDAYS_SHORT.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "8px",
              fontWeight: 900,
              color: "#1e293b",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "3px",
          padding: "0 12px 16px",
        }}
      >
        {days.map((date, i) => {
          const inMonth = isSameMonth(date, monthStart);
          const isTodayDay = isToday(date);
          const shift = getShiftForDate(
            date,
            cycleStartDate,
            systemType,
            initialCycleDay,
            workDuration,
            vacationDuration,
            addRouteDays,
            annualLeaveBlocks,
            workDurationExtension,
          );

          return (
            <div
              key={i}
              style={{
                backgroundColor: inMonth
                  ? SHIFT_BG[shift]
                  : "rgba(255,255,255,0.01)",
                borderRadius: "8px",
                padding: "6px 2px",
                textAlign: "center",
                opacity: inMonth ? 1 : 0.12,
                border: isTodayDay
                  ? "1.5px solid #3b82f6"
                  : "1px solid rgba(255,255,255,0.04)",
                position: "relative",
              }}
            >
              {isTodayDay && (
                <div
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "3px",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#3b82f6",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: inMonth ? SHIFT_TEXT[shift] : "#1e293b",
                  lineHeight: 1.1,
                }}
              >
                {format(date, "d")}
              </div>
              {inMonth && (
                <div
                  style={{
                    fontSize: "7px",
                    fontWeight: 800,
                    color: SHIFT_TEXT[shift],
                    marginTop: "2px",
                    opacity: 0.9,
                  }}
                >
                  {SHIFT_LABEL[shift]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div
        style={{
          margin: "0 12px",
          padding: "12px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: "4px",
          }}
        >
          {(Object.keys(SHIFT_FULL) as ShiftType[]).map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: SHIFT_DOT[t],
                }}
              />
              <span
                style={{ fontSize: "8px", fontWeight: 700, color: "#475569" }}
              >
                {SHIFT_FULL[t]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "8px 12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {generatedOn}
        </div>
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          TROIS HUIT
        </div>
      </div>
    </div>
  );
}
