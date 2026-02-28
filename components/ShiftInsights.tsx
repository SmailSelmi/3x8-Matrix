import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Plane, RotateCw, Zap, Layers, Sun, Moon, TrendingUp, Briefcase, Coffee } from 'lucide-react';
import { SystemType } from '@/lib/shiftPatterns';
import { getDay, addDays } from 'date-fns';

interface ShiftInsightsProps {
  daysPassed: number;
  totalWorkDays: number;
  startShiftOffset: number;
  systemType?: SystemType;
  startDateStr: string;
}

const AnimatedValue = ({ value, toFixed = 0, className }: { value: number, toFixed?: number, className?: string }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 12 });
  const display = useTransform(spring, (current) => current.toFixed(toFixed));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default function ShiftInsights({ daysPassed, totalWorkDays, startShiftOffset, systemType = '3x8_industrial', startDateStr }: ShiftInsightsProps) {
  
  // 1. Days to Fly (Premium presentation)
  const daysToFly = Math.max(0, totalWorkDays - daysPassed);

  // 2. Cycle Progress (Advanced calculation)
  // For shift system, 1 cycle = 3 days. For admin, it's just one phase.
  const progressDivisor = systemType === '3x8_industrial' ? 3 : 1;
  const cyclesDoneNum = daysPassed > 0 ? daysPassed / progressDivisor : 0;
  const totalCycles = totalWorkDays / progressDivisor;
  const currentCycleProgress = Math.min(100, (cyclesDoneNum / totalCycles) * 100);

  // 3. Productivity Stats & Shift Balance
  let hoursCrushed = 0;
  let afternoonCount = 0;
  let doubleCount = 0;
  let adminWorkDaysRemaining = 0;
  let adminRestDaysRemaining = 0;

  const [y, m, d] = startDateStr.split('-').map(Number);
  const cycleStartDate = new Date(y, m - 1, d);

  // Calculated Passed Hours
  for (let i = 0; i < Math.max(0, daysPassed); i++) {
     const currentDayDate = addDays(cycleStartDate, i);
     if (systemType === '5x2_admin') {
         const dayOfWeek = getDay(currentDayDate);
         if (dayOfWeek !== 5 && dayOfWeek !== 6) {
             hoursCrushed += 7; // 4 + 3
         }
     } else {
         const shiftType = (i + startShiftOffset) % 3;
         if (shiftType === 0) hoursCrushed += 7.5; // Afternoon
         if (shiftType === 1) hoursCrushed += 11.5; // Double
     }
  }

  // Calculated Remaining Balance
  for (let i = Math.max(0, daysPassed); i < totalWorkDays; i++) {
    const currentDayDate = addDays(cycleStartDate, i);
    if (systemType === '5x2_admin') {
        const dayOfWeek = getDay(currentDayDate);
        if (dayOfWeek === 5 || dayOfWeek === 6) adminRestDaysRemaining++;
        else adminWorkDaysRemaining++;
    } else {
        const shiftType = (i + startShiftOffset) % 3;
        if (shiftType === 0) afternoonCount++;
        if (shiftType === 1) doubleCount++;
    }
  }

  const cards = [
    {
      label: "المغادرة",
      value: daysToFly === 0 ? "يوم السفر!" : <AnimatedValue value={daysToFly} />,
      sub: daysToFly === 0 ? "✈️ استمتع" : "يوم متبقي",
      icon: Plane,
      color: "text-emerald-400",
      bg: "from-emerald-500/10 to-transparent",
      delay: 0.1
    },
    {
      label: "الإنجاز",
      value: <div className="flex items-baseline gap-1"><AnimatedValue value={currentCycleProgress} toFixed={1} />%</div>,
      sub: systemType === '3x8_industrial' ? `${cyclesDoneNum.toFixed(1)} دورة` : `${daysPassed} يوم`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "from-blue-500/10 to-transparent",
      delay: 0.2
    },
    {
      label: "الجهد",
      value: <AnimatedValue value={hoursCrushed} />,
      sub: "ساعة عمل مُنجزة",
      icon: Zap,
      color: "text-orange-400",
      bg: "from-orange-500/10 to-transparent",
      delay: 0.3
    },
    {
      label: "المتبقي",
      value: systemType === '3x8_industrial' ? (
        <div className="flex gap-2">
            <div className="flex items-center gap-1.5"><Sun size={14} />{afternoonCount}</div>
            <div className="flex items-center gap-1.5"><Moon size={14} />{doubleCount}</div>
        </div>
      ) : (
        <div className="flex gap-2">
            <div className="flex items-center gap-1.5"><Briefcase size={14} />{adminWorkDaysRemaining}</div>
            <div className="flex items-center gap-1.5"><Coffee size={14} />{adminRestDaysRemaining}</div>
        </div>
      ),
      sub: systemType === '3x8_industrial' ? "توزيع المناوبات" : "عمل / عطلة إسبوع",
      icon: systemType === '3x8_industrial' ? Layers : Briefcase,
      color: "text-indigo-400",
      bg: "from-indigo-500/10 to-transparent",
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.5, ease: "easeOut" }}
          className="relative group overflow-hidden glass-card rounded-[2rem] p-5 flex flex-col justify-between"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-50`} />
            
            <div className="flex justify-between items-start z-10">
                <div className={`p-2 rounded-2xl bg-white/5 border border-white/10 ${card.color}`}>
                    <card.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
                    {card.label}
                </span>
            </div>

            <div className="mt-4 z-10">
                <div className={`text-3xl lg:text-4xl font-black tracking-tighter ${card.color}`}>
                    {card.value}
                </div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                    {card.sub}
                </div>
            </div>
        </motion.div>
      ))}
    </div>
  );
}
