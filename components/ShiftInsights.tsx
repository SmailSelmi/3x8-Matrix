import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Plane, RotateCw, Zap, Layers, Sun, Moon } from 'lucide-react';

interface ShiftInsightsProps {
  daysPassed: number;
  totalWorkDays: number;
  startShiftOffset: number;
}

const AnimatedValue = ({ value, toFixed = 0, className }: { value: number, toFixed?: number, className?: string }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 15 });
  const display = useTransform(spring, (current) => current.toFixed(toFixed));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default function ShiftInsights({ daysPassed, totalWorkDays, startShiftOffset }: ShiftInsightsProps) {
  
  // 1. Days to Fly
  const daysToFly = Math.max(0, totalWorkDays - daysPassed);

  // 2. Cycle Count
  const cyclesDoneNum = daysPassed > 0 ? daysPassed / 3 : 0;
  const totalCycles = totalWorkDays / 3;
  const currentCycleProgress = Math.min(100, (cyclesDoneNum / totalCycles) * 100);

  // 3. Hours Worked
  let hoursCrushed = 0;
  const daysToCalculate = Math.max(0, daysPassed);
  
  for (let i = 0; i < daysToCalculate; i++) {
     const shiftType = (i + startShiftOffset) % 3;
     if (shiftType === 0) hoursCrushed += 7;
     if (shiftType === 1) hoursCrushed += 17;
  }

  // 4. Shift Breakdown
  let afternoonCount = 0;
  let doubleCount = 0;
  const startIndex = Math.max(0, daysPassed);
  
  for (let i = startIndex; i < totalWorkDays; i++) {
    const shiftType = (i + startShiftOffset) % 3;
    if (shiftType === 0) afternoonCount++;
    if (shiftType === 1) doubleCount++;
  }

  const totalRemaining = afternoonCount + doubleCount || 1;
  const afternoonPct = (afternoonCount / totalRemaining) * 100;
  const doublePct = (doubleCount / totalRemaining) * 100;

  const cards = [
    {
      label: "الأيام المتبقية",
      value: daysToFly === 0 ? (
        <span className="text-3xl lg:text-4xl text-green-300 animate-pulse">يوم السفر ✈️</span>
      ) : (
        <AnimatedValue value={daysToFly} className="font-mono" />
      ),
      icon: Plane,
      color: "text-green-400",
      bg: daysToFly === 0 ? "bg-green-500/20" : "bg-green-500/10",
      border: "border-green-500/20",
      delay: 0.1
    },
    {
      label: "الدورات المنجزة",
      value: (
        <div className="relative flex items-center justify-center w-16 h-16">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-500/20" />
             <circle 
                cx="32" cy="32" r="28" 
                stroke="currentColor" strokeWidth="6" 
                fill="transparent" 
                className="text-blue-500" 
                strokeDasharray={175.9} 
                strokeDashoffset={175.9 - (175.9 * currentCycleProgress) / 100} 
                strokeLinecap="round"
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-blue-400">
              <AnimatedValue value={cyclesDoneNum} toFixed={1} />
           </div>
        </div>
      ),
      icon: RotateCw,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      delay: 0.2
    },
    {
      label: "ساعات العمل",
      value: <AnimatedValue value={hoursCrushed} className="font-mono" />,
      icon: Zap,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      delay: 0.3
    },
    {
      label: "المناوبات المتبقية",
      value: (
        <div className="flex flex-col gap-2 w-full min-w-[100px] px-2">
          {/* Afternoon Bar */}
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-orange-400 shrink-0" />
            <div className="flex-1 h-2 bg-orange-500/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${afternoonPct}%` }} 
                 className="h-full bg-orange-500" 
               />
            </div>
            <span className="text-xs font-bold text-orange-300 w-4 text-right">{afternoonCount}</span>
          </div>
          {/* Double Bar */}
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-red-400 shrink-0" />
            <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${doublePct}%` }} 
                 className="h-full bg-red-500" 
               />
            </div>
            <span className="text-xs font-bold text-red-300 w-4 text-right">{doubleCount}</span>
          </div>
        </div>
      ),
      icon: Layers,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full h-full">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay, duration: 0.3 }}
          className={`
            relative overflow-hidden
            flex flex-col justify-between
            rounded-2xl backdrop-blur-md transition-all duration-300
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:scale-[1.02]
            group
          `}
        >
            {/* Subtle Gradient Glow */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20 ${card.bg.replace('/10', '')}`} />

            {/* Main Content (Centered) */}
            <div className={`flex-1 flex items-center justify-center p-3 z-10 ${card.color}`}>
                 <div className="text-5xl lg:text-6xl font-black tracking-tighter">
                    {card.value}
                 </div>
            </div>

            {/* Footer (Divider + Label) */}
            <div className="w-full border-t border-white/5 bg-black/10 p-2 flex items-center justify-center gap-2 z-10">
                <card.icon size={12} strokeWidth={2.5} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    {card.label}
                </span>
            </div>
        </motion.div>
      ))}
    </div>
  );
}
