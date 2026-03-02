// components/AnimatedBackground.tsx
"use client";

import React from "react";
import { ShiftType } from "@/lib/shiftPatterns";

interface AnimatedBackgroundProps {
  shiftType: ShiftType;
}

const GRADIENTS: Record<ShiftType, string> = {
  day: "radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 70%)",
  evening:
    "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
  night:
    "radial-gradient(circle at 80% 20%, rgba(30, 64, 175, 0.15) 0%, transparent 70%)",
  rest: "radial-gradient(circle at 20% 20%, rgba(8, 145, 178, 0.15) 0%, transparent 70%)",
  leave:
    "radial-gradient(circle at 50% 50%, rgba(22, 163, 74, 0.15) 0%, transparent 70%)",
};

const BASE_BG = "#020617";

export default function AnimatedBackground({
  shiftType,
}: AnimatedBackgroundProps) {
  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{ backgroundColor: BASE_BG }}
    >
      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        key={shiftType}
        className="absolute inset-0 animate-fade-in"
        style={{ background: GRADIENTS[shiftType], animationDuration: "2s" }}
      />

      {/* Floating Aurora Orb */}
      <div
        className="absolute w-[80vw] h-[80vw] rounded-full blur-[120px] animate-pulse"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
          left: "10%",
          top: "10%",
          animationDuration: "8s",
        }}
      />
    </div>
  );
}
