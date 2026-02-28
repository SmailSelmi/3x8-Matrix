"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
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
  }, []);

  useEffect(() => {
    // Total duration: 2.3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Slightly increased to ensure typing finishes comfortably

    return () => clearTimeout(timer);
  }, []);

  const text = "Smail Selmi";
  const letters = Array.from(text);

  const container: Variants = {
    exit: {
      opacity: 0,
      scale: 1.5, // Lift-off effect (zoom out)
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.5, // Lift-off effect
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const cursorVariants: Variants = {
    blinking: {
      opacity: [0, 0, 1, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 0,
        ease: "linear",
        times: [0, 0.5, 0.5, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-10 overflow-hidden ${jetbrainsMono.className}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          dir="ltr"
        >
          {/* Dynamic Background Circle */}
          <motion.div 
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          <div className="flex-1 flex items-center justify-center relative z-10">
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Image
                src="/icons/icon-512x512.png"
                alt="Logo"
                width={120} // Reduced size
                height={120}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-4 mb-20 relative z-10 w-full max-w-md">
            <div className="flex flex-col items-center">
                {/* Terminal Comment Style */}
                <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-1" // Reduced to text-[10px]
                >
                // Created by:
                </motion.span>
                
                {/* Terminal String Style + Blinking Cursor */}
                <div className="flex items-center text-base md:text-lg font-mono"> {/* Reduced to text-base/lg */}
                    <span className="text-blue-600 dark:text-blue-400 mr-2">const</span>
                    <span className="text-emerald-600 dark:text-emerald-400 mr-2">dev</span>
                    <span className="text-slate-400 dark:text-slate-500 mr-2">=</span>
                    <span className="text-amber-600 dark:text-amber-400">"</span>
                    <span className="text-amber-600 dark:text-amber-400 min-h-[1.5em]">
                        {displayedText}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">"</span>
                    <span className="text-slate-400 dark:text-slate-500">;</span>
                    
                    {/* Blinking Block Cursor */}
                    <motion.div
                        variants={cursorVariants}
                        animate="blinking"
                        className="w-2 h-4 bg-slate-400 dark:bg-slate-500 ml-1" // Adjusted cursor size
                    />
                </div>
            </div>

            {/* Loading Progress Bar */}
            <div className="w-40 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-6"> {/* Reduced width */}
                <motion.div 
                    className="h-full bg-blue-500 dark:bg-blue-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }} // Synced with new timer
                />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
