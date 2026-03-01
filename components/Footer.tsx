// components/Footer.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Footer({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("fr-DZ", {
        timeZone: "Africa/Algiers",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      dir="ltr"
      className={`
        glass-card
        bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 
        text-slate-500 dark:text-slate-400 py-2 px-5 rounded-2xl shadow-xl 
        flex items-center justify-center gap-3 text-[10px] md:text-xs font-medium
        hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-500
        z-50
        ${className || ""}
      `}
    >
      <span className="opacity-80">© 2026 Trois Huit</span>

      <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />

      <span className="opacity-80 font-mono">v1.0.0</span>

      <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />

      <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[8ch] text-center tabular-nums">
        {time || "--:--:--"}
      </span>
      <span className="opacity-60 text-[9px] uppercase tracking-wider">DZ</span>
    </motion.footer>
  );
}
