"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-12 h-12 rounded-2xl bg-white/5 dark:bg-slate-900/50 hover:bg-white/10 dark:hover:bg-slate-800 border border-white/10 dark:border-white/5 flex items-center justify-center transition-all overflow-hidden group shadow-lg active:scale-90"
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {theme === "dark" ? (
          <div className="animate-fade-in duration-200">
            <Moon
              size={20}
              className="text-blue-400 group-hover:text-blue-300 transition-colors"
            />
          </div>
        ) : (
          <div className="animate-fade-in duration-200">
            <Sun
              size={20}
              className="text-orange-500 group-hover:text-orange-400 transition-colors"
            />
          </div>
        )}
      </div>
    </button>
  );
}
