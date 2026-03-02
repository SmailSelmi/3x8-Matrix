"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const SplashScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Smail Selmi";

  useEffect(() => {
    // Typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Speed of typing

    return () => clearInterval(typingInterval);
  }, [fullText]);

  useEffect(() => {
    // Total duration: 2.5 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-10 overflow-hidden ${jetbrainsMono.className} animate-fade-in`}
      dir="ltr"
    >
      {/* Dynamic Background Circle */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none animate-[spin_20s_linear_infinite]" />

      <div className="flex-1 flex items-center justify-center relative z-10 animate-zoom-in">
        <Image
          src="/icons/icon-512x512.png"
          alt="Logo"
          width={120} // Reduced size
          height={120}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-4 mb-20 relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center">
          {/* Terminal Comment Style */}
          <span
            className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-1 animate-fade-in opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            // Created by:
          </span>

          {/* Terminal String Style + Blinking Cursor */}
          <div className="flex items-center text-base md:text-lg font-mono">
            {" "}
            <span className="text-blue-600 dark:text-blue-400 mr-2">const</span>
            <span className="text-emerald-600 dark:text-emerald-400 mr-2">
              dev
            </span>
            <span className="text-slate-400 dark:text-slate-500 mr-2">=</span>
            <span className="text-amber-600 dark:text-amber-400">"</span>
            <span className="text-amber-600 dark:text-amber-400 min-h-[1.5em]">
              {displayedText}
            </span>
            <span className="text-amber-600 dark:text-amber-400">"</span>
            <span className="text-slate-400 dark:text-slate-500">;</span>
            {/* Blinking Block Cursor */}
            <div className="w-2 h-4 bg-slate-400 dark:bg-slate-500 ml-1 animate-pulse" />
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-40 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-blue-500 dark:bg-blue-400"
            style={{
              animation: "progress-fill 2.5s linear forwards",
            }}
          />
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes progress-fill {
            from { width: 0%; }
            to { width: 100%; }
          }
        `,
          }}
        />
      </div>
    </div>
  );
};
