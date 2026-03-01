// components/StatusBanner.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Info } from "lucide-react";

interface StatusBannerProps {
  message: string;
  subMessage?: string;
  type?: "info" | "urgent";
}

export default function StatusBanner({
  message,
  subMessage,
  type = "info",
}: StatusBannerProps) {
  const isUrgent = type === "urgent";

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/[0.05] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${isUrgent ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-400"}`}
        >
          {isUrgent ? <Info size={16} /> : <Clock size={16} />}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-100">{message}</span>
          {subMessage && (
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {subMessage}
            </span>
          )}
        </div>
      </div>

      {isUrgent && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
        />
      )}
    </div>
  );
}
