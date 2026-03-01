// components/GlassCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
  animate?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  variant = "default",
  glow = false,
  glowColor = "#3b82f6",
  onClick,
  animate = true,
}: GlassCardProps) {
  const variants = {
    default: "bg-white/[0.04] border-white/[0.08]",
    strong: "bg-white/[0.08] border-white/[0.12]",
    subtle: "bg-white/[0.02] border-white/[0.05]",
  };

  const glowStyle = glow
    ? {
        boxShadow: `0 0 30px ${glowColor}40, 0 0 60px ${glowColor}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }
    : {};

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={glowStyle}
      className={`
        backdrop-blur-[20px] rounded-2xl border border-solid
        ${variants[variant]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
