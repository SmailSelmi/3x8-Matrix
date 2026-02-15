// components/ShiftAnimation.tsx
'use client';

import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

type ShiftType = 'AFTERNOON' | 'DOUBLE' | 'REST' | 'LEAVE';

interface Props {
  type: ShiftType;
}

const ShiftAnimation: React.FC<Props> = ({ type }) => {
  const [loaded, setLoaded] = React.useState(false);
  const isSleepingMode = type === 'REST' || type === 'LEAVE';

  const workingUrl = "https://lottie.host/5b6e6f16-7d0e-473d-8280-503673410714/Is1g6b2k3.json";
  const sleepingUrl = "https://lottie.host/80302830-745d-4f0e-b248-c3098317762c/rIQI19wJ8o.json";

  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-40 h-40 rounded-full bg-slate-200/10 dark:bg-slate-700/20 animate-pulse blur-2xl" />
        </div>
      )}
      <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} w-full h-full`}>
        <DotLottiePlayer
            src={isSleepingMode ? sleepingUrl : workingUrl}
            loop
            autoplay
            className="w-full h-full"
            onEvent={(event) => {
                if (event === 'ready' || event === 'play') setLoaded(true);
            }}
        />
      </div>
    </div>
  );
};

export default ShiftAnimation;
