"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    }),
    exit: {
      opacity: 0,
      y: -50,
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div
            className="flex overflow-hidden text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 md:text-4xl"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
