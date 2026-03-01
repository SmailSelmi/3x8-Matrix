// components/AnnouncementBanner.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, CheckCircle2 } from "lucide-react";
import GlassCard from "./GlassCard";

interface AnnouncementBannerProps {
  onDismiss: () => void;
  title: string;
  description: string;
  actionLabel?: string;
}

export default function AnnouncementBanner({
  onDismiss,
  title,
  description,
  actionLabel = "حسناً، فهمت",
}: AnnouncementBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="px-6 mb-4"
    >
      <GlassCard className="p-4 relative overflow-hidden border-emerald-500/20 bg-emerald-500/5 group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 blur-xl rounded-full -ml-8 -mb-8" />

        <div className="flex gap-4 relative z-10">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Compass size={24} className="animate-spin-slow" />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-emerald-100 italic">
                {title}
              </h4>
              <button
                onClick={onDismiss}
                className="p-1 text-slate-500 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed ml-4">
              {description}
            </p>

            <div className="flex justify-end mt-2">
              <button
                onClick={onDismiss}
                className="flex items-center gap-2 py-2 px-4 rounded-xl bg-emerald-500 text-white text-[11px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all"
              >
                <CheckCircle2 size={12} />
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
