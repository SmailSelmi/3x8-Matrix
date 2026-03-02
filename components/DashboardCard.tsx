"use client";

import React from "react";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export default function DashboardCard({
  children,
  className = "",
  delay = 0,
  interactive = false,
  onClick,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden p-5 glass-card rounded-[2.2rem] border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl animate-slide-up-modal ${interactive ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200" : ""} ${className}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent" />

      {children}
    </div>
  );
}
