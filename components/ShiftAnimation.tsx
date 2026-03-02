"use client";

import React from "react";
import { ShiftType } from "@/lib/shiftPatterns";

interface Props {
  type: ShiftType;
}

const ShiftAnimation: React.FC<Props> = ({ type }) => {
  const isLeave = type === "leave";
  const isRest = type === "rest";
  const isWork = !isLeave && !isRest;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Scene Container */}
      <div key={type} className="relative w-64 h-64 animate-zoom-in">
        {isLeave ? (
          <VacationScene />
        ) : (
          <WorkCycleScene
            isAfternoon={type === "evening"}
            isDouble={type === "night"}
          />
        )}
      </div>
    </div>
  );
};

// --- Vacation Scene: Palm Tree & Sun ---
const VacationScene = () => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="#e0f2fe"
        className="dark:fill-slate-800"
      />

      {/* Sun */}
      <circle
        cx="150"
        cy="50"
        r="15"
        fill="#fbbf24"
        className="animate-pulse"
        style={{ animationDuration: "3s" }}
      />

      {/* Ocean */}
      <path
        d="M10,150 Q50,140 100,150 T190,150 V190 H10 Z"
        fill="#3b82f6"
        fillOpacity="0.6"
      />

      {/* Island */}
      <path d="M40,160 Q100,130 160,160 Z" fill="#d97706" />

      {/* Palm Tree Trunk */}
      <path
        d="M95,145 Q90,100 95,80"
        stroke="#78350f"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Palm Leaves */}
      <g style={{ transformOrigin: "95px 80px" }}>
        <path
          d="M95,80 Q70,60 50,80"
          stroke="#16a34a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M95,80 Q120,60 140,80"
          stroke="#16a34a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M95,80 Q80,50 95,40"
          stroke="#16a34a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M95,80 Q110,50 95,40"
          stroke="#16a34a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Birds */}
      <path
        d="M20,60 Q30,50 40,60"
        stroke="black"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
};

// --- Work Scene: Gear & Clock/Sun/Moon ---
const WorkCycleScene = ({
  isAfternoon,
  isDouble,
}: {
  isAfternoon: boolean;
  isDouble: boolean;
}) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Background Circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="#f8fafc"
        className="dark:fill-slate-800"
      />

      {/* Rotating Gear (Symbolizing Work) - Outer */}
      <g
        className="animate-spin"
        style={{ transformOrigin: "100px 100px", animationDuration: "20s" }}
      >
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="10 5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M100,30 L100,50 M170,100 L150,100 M100,170 L100,150 M30,100 L50,100"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* Inner Elements based on Shift Type */}
      {isDouble ? (
        // Moon & Sun for Double Shift
        <g
          className="animate-spin"
          style={{ transformOrigin: "100px 100px", animationDuration: "10s" }}
        >
          <circle cx="100" cy="40" r="12" fill="#ef4444" />
          <circle cx="100" cy="160" r="12" fill="#3b82f6" />
        </g>
      ) : isAfternoon ? (
        // Sun setting/Afternoon
        <g>
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="#f97316"
            className="animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          {/* Rays */}
          <g
            className="animate-spin"
            style={{ transformOrigin: "100px 100px", animationDuration: "12s" }}
          >
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="60"
                x2="100"
                y2="50"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 100 100)`}
              />
            ))}
          </g>
        </g>
      ) : (
        // Rest Day - Sleeping Zzzs
        <g>
          <circle cx="100" cy="100" r="40" fill="#3b82f6" opacity="0.2" />
          <text
            x="90"
            y="110"
            fontSize="40"
            fill="#3b82f6"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            Z
          </text>
          <text
            x="120"
            y="90"
            fontSize="20"
            fill="#3b82f6"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: "0.5s", animationDuration: "2s" }}
          >
            z
          </text>
          <text
            x="140"
            y="70"
            fontSize="15"
            fill="#3b82f6"
            opacity="0.4"
            className="animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "2s" }}
          >
            z
          </text>
        </g>
      )}
    </svg>
  );
};

export default ShiftAnimation;
