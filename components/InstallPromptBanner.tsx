"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useInstallContext } from "@/context/InstallContext";

export default function InstallPromptBanner() {
  const { isInstallable, isInstalled, promptInstall, setHighlightHeaderIcon } =
    useInstallContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      const dismissedAt = localStorage.getItem("install_prompt_dismissed_at");
      if (dismissedAt) {
        const timePassed = Date.now() - parseInt(dismissedAt, 10);
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
        if (timePassed < threeDaysInMs) {
          return; // Skip showing if dismissed within last 3 days
        }
      }
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable]);

  const handleRemindMeLater = () => {
    setIsVisible(false);
    localStorage.setItem("install_prompt_dismissed_at", Date.now().toString());

    // Trigger header highlight animation
    setHighlightHeaderIcon(true);
    setTimeout(() => {
      setHighlightHeaderIcon(false);
    }, 3000);
  };

  const handleInstall = async () => {
    await promptInstall();
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[90] animate-slide-up">
      <div className="bg-slate-800/95 backdrop-blur-md border border-white/10 p-5 rounded-3xl shadow-2xl flex flex-col gap-4 select-none">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <Download className="text-blue-400" size={24} />
          </div>
          <div className="flex flex-col mt-0.5">
            <span className="text-base font-black text-white">
              تثبيت التطبيق
            </span>
            <span className="text-[13px] font-medium text-slate-400 leading-relaxed mt-1">
              أضف Trois Huit إلى شاشتك الرئيسية للحصول على إشعارات ذكية بدون
              إنترنت وتجربة أسرع بكثير!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            onClick={handleRemindMeLater}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-black rounded-xl transition-colors"
          >
            ذكرني لاحقاً
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            تثبيت التطبيق
          </button>
        </div>
      </div>
    </div>
  );
}
