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
  const workingUrl = "/animations/working.json";
  const sleepingUrl = "/animations/sleeping.json";

  // Force show after a short timeout if events fail
  React.useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
             <div className="w-1/2 h-1/2 rounded-full bg-slate-200/10 dark:bg-slate-700/20 animate-pulse blur-3xl" />
        </div>
      )}
      <div className={`transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} w-full h-full relative z-10`}>
        <DotLottiePlayer
            key={type} // Force re-render on type change for clean state
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
