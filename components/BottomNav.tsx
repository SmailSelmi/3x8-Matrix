// components/BottomNav.tsx
"use client";

import React from "react";
import { Home, Calendar, BarChart2, PlaneTakeoff } from "lucide-react";

export type NavTab =
  | "HOME"
  | "AGENDA"
  | "STATS"
  | "LINKS"
  | "PROFILE"
  | "SETTINGS";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "HOME" as NavTab, label: "الرئيسية", icon: <Home size={24} /> },
    { id: "AGENDA" as NavTab, label: "تقويم", icon: <Calendar size={24} /> },
    { id: "STATS" as NavTab, label: "إحصائيات", icon: <BarChart2 size={24} /> },
    {
      id: "LINKS" as NavTab,
      label: "روابط مفيدة",
      icon: <PlaneTakeoff size={24} />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#020617]/80 backdrop-blur-2xl border-t border-white/[0.08] px-6 pb-6 pt-2 z-50 flex justify-between items-center"
      dir="rtl"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-300"
          >
            <div
              className={`relative z-10 ${isActive ? "text-white" : "text-slate-500"}`}
            >
              {tab.icon}
            </div>

            {isActive && (
              <span className="text-[10px] font-black tracking-wider text-white z-10 animate-fade-in">
                {tab.label}
              </span>
            )}

            {isActive && (
              <div className="absolute inset-x-2 inset-y-[-4px] bg-white/[0.08] border border-white/[0.1] rounded-2xl z-0 animate-fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
