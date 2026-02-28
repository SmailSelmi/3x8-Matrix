'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShiftType } from '@/lib/shiftPatterns';

interface Props {
  type: ShiftType;
}

const ShiftAnimation: React.FC<Props> = ({ type }) => {
  const isLeave = type === 'leave';
  const isRest = type === 'rest';
  const isWork = !isLeave && !isRest;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Scene Container */}
      <motion.div 
        key={type}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-64 h-64"
      >
        {isLeave ? (
          <VacationScene />
        ) : (
          <WorkCycleScene isAfternoon={type === 'evening'} isDouble={type === 'night'} />
        )}
      </motion.div>
    </div>
  );
};

// --- Vacation Scene: Palm Tree & Sun ---
const VacationScene = () => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Sky Gradient Warning - using simple shapes instead */}
      <circle cx="100" cy="100" r="90" fill="#e0f2fe" className="dark:fill-slate-800" />
      
      {/* Sun */}
      <motion.circle 
        cx="150" cy="50" r="15" 
        fill="#fbbf24"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Ocean */}
      <motion.path 
        d="M10,150 Q50,140 100,150 T190,150 V190 H10 Z" 
        fill="#3b82f6" 
        fillOpacity="0.6"
        animate={{ d: ["M10,150 Q50,140 100,150 T190,150 V190 H10 Z", "M10,145 Q50,155 100,145 T190,145 V190 H10 Z", "M10,150 Q50,140 100,150 T190,150 V190 H10 Z"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Island */}
      <path d="M40,160 Q100,130 160,160 Z" fill="#d97706" />

      {/* Palm Tree Trunk */}
      <path d="M95,145 Q90,100 95,80" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Palm Leaves */}
      <motion.g style={{ originX: "95px", originY: "80px" }} animate={{ rotate: [0, 2, 0, -1, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
         <path d="M95,80 Q70,60 50,80" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
         <path d="M95,80 Q120,60 140,80" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
         <path d="M95,80 Q80,50 95,40" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
         <path d="M95,80 Q110,50 95,40" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      
      {/* Birds */}
      <motion.path 
        d="M20,60 Q30,50 40,60" 
        stroke="black" strokeWidth="1" fill="none" opacity="0.5"
        animate={{ x: [0, 100, 200], y: [0, -20, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

// --- Work Scene: Gear & Clock/Sun/Moon ---
const WorkCycleScene = ({ isAfternoon, isDouble }: { isAfternoon: boolean, isDouble: boolean }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Background Circle */}
      <circle cx="100" cy="100" r="90" fill="#f8fafc" className="dark:fill-slate-800" />
      
      {/* Rotating Gear (Symbolizing Work) - Outer */}
      <motion.g 
        style={{ originX: "100px", originY: "100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 5" fill="none" opacity="0.3" />
        <path d="M100,30 L100,50 M170,100 L150,100 M100,170 L100,150 M30,100 L50,100" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </motion.g>

      {/* Inner Elements based on Shift Type */}
      {isDouble ? (
         // Moon & Sun for Double Shift
         <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
             <circle cx="100" cy="40" r="12" fill="#ef4444" /> {/* Red Sun/Moon hybrid representing intensity */}
             <circle cx="100" cy="160" r="12" fill="#3b82f6" /> {/* Blue Moon */}
         </motion.g>
      ) : isAfternoon ? (
         // Sun setting/Afternoon
         <motion.g>
             <motion.circle 
               cx="100" cy="100" r="30" 
               fill="#f97316"
               animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
             {/* Rays */}
             <motion.g animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
                {[...Array(8)].map((_, i) => (
                    <line key={i} x1="100" y1="60" x2="100" y2="50" stroke="#f97316" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45} 100 100)`} />
                ))}
             </motion.g>
         </motion.g>
      ) : (
         // Rest Day - Sleeping Zzzs
         <g>
            <circle cx="100" cy="100" r="40" fill="#3b82f6" opacity="0.2" />
            <text x="90" y="110" fontSize="40" fill="#3b82f6" fontFamily="sans-serif" fontWeight="bold">Z</text>
            <motion.text 
               x="120" y="90" fontSize="20" fill="#3b82f6" opacity="0.6"
               animate={{ y: [0, -10], opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >z</motion.text>
            <motion.text 
               x="140" y="70" fontSize="15" fill="#3b82f6" opacity="0.4"
               animate={{ y: [0, -10], opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >z</motion.text>
         </g>
      )}

    </svg>
  );
};

export default ShiftAnimation;
