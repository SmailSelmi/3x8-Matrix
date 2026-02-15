"use client";

import React from "react";
import { motion } from "framer-motion";
import { Battery, BatteryCharging, BatteryWarning } from "lucide-react";

interface EnergyChartProps {
  currentShiftOffset: number; // 0, 1, or 2 (Afternoon, Double, Rest)
}

export default function EnergyChart({ currentShiftOffset }: EnergyChartProps) {
  // Define the 3-day cycle pattern
  // 0: Afternoon (Start of cycle) -> Medium Energy (70%)
  // 1: Double (Heavy work) -> Low Energy (30%)
  // 2: Rest (Recovery) -> High Energy (100%)
  
  const energyLevels = [
    { label: "مساْء", level: 70, color: "bg-yellow-400", text: "text-yellow-400", icon: Battery },
    { label: "ليل", level: 30, color: "bg-red-500", text: "text-red-500", icon: BatteryWarning },
    { label: "راحة", level: 100, color: "bg-green-500", text: "text-green-500", icon: BatteryCharging },
  ];

  // We want to show a sequence: Previous -> Current -> Next
  // But for a simple "Bio-Rhythm", maybe just showing the generic 3-step cycle 
  // and highlighting the *current* step is clearer.
  
  // Let's create a visual curve.
  
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">مؤشر الطاقة (Bio-Rhythm)</h3>
        <div className="text-xs font-mono opacity-50">3-Day Cycle</div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 relative px-2">
        {/* Connection Line (Background) */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
             <svg className="w-full h-full overflow-visible">
                {/* Curve connecting tops of bars.
                    Afternoon (idx 0): Level 70% -> 30% from top. Center ~16% width.
                    Double (idx 1): Level 30% -> 70% from top. Center ~50% width.
                    Rest (idx 2): Level 100% -> 0% from top. Center ~84% width.
                */}
                <path 
                    d="M 16% 30% C 30% 30%, 36% 70%, 50% 70% C 64% 70%, 70% 0%, 84% 0%" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    className="text-slate-300 dark:text-white/20 opacity-50"
                />
             </svg>
        </div>

        {energyLevels.map((item, index) => {
            const isCurrent = index === currentShiftOffset % 3;
            
            return (
                <div key={index} className="flex flex-col items-center gap-2 z-10 w-1/3">
                    {/* Bar / Point */}
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.level}%` }}
                        transition={{ duration: 1, type: "spring" }}
                        className={`
                            w-full max-w-[40px] rounded-t-xl relative group
                            ${isCurrent ? item.color : "bg-slate-200 dark:bg-white/5"}
                        `}
                    >
                         {/* Icon on top */}
                         <div className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-all ${isCurrent ? "scale-110 opacity-100" : "scale-75 opacity-50"}`}>
                             <item.icon size={20} className={isCurrent ? item.text : "text-slate-400"} />
                         </div>
                    </motion.div>
                    
                    {/* Label */}
                    <span className={`text-xs font-bold ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.label}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">{item.level}%</span>
                </div>
            );
        })}
      </div>
    </div>
  );
}
