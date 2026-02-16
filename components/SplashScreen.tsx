"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration: 2.3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  const text = "Smail Selmi";
  const letters = Array.from(text);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.5 }, // Delay text slightly after image
    }),
    exit: {
      opacity: 0,
      y: 50, // Slide down on exit
      transition: { duration: 0.5, ease: "easeInOut" },
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
          transition: { duration: 0.5, ease: "easeOut" }
      },
      exit: {
          opacity: 0,
          scale: 1.1,
          transition: { duration: 0.5, ease: "easeInOut" }
      }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-white dark:bg-slate-950 p-10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          dir="ltr" // Force LTR for this component
        >
          {/* Empty div for top spacing balance if needed, or just use justify-between to push image center and text bottom */}
          <div className="flex-1 flex items-center justify-center">
             <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
             >
                <Image 
                    src="/icons/icon-512x512.png" 
                    alt="Logo" 
                    width={180} 
                    height={180} 
                    className="object-contain"
                    priority
                />
             </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-10">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-slate-500 dark:text-slate-400 font-medium"
              >
                  Created by:
              </motion.span>
              <motion.div
                className="flex overflow-hidden text-2xl font-bold font-mono text-slate-900 dark:text-slate-100"
                variants={container}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {letters.map((letter, index) => (
                  <motion.span key={index} variants={child}>
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
