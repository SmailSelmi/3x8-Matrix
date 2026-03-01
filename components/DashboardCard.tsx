"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      whileHover={
        interactive ? { scale: 1.02, transition: { duration: 0.2 } } : {}
      }
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative overflow-hidden p-5 glass-card rounded-[2.2rem] border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-xl ${interactive ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent" />

      {children}
    </motion.div>
  );
}
