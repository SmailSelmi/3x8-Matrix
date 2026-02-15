'use client';

import React, { useState } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';
import { Loader2, AlertCircle } from 'lucide-react';

interface LottieLoaderProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  fallbackIcon?: React.ReactNode;
}

export default function LottieLoader({ 
  src, 
  className = "w-48 h-48", 
  autoplay = true, 
  loop = true,
  fallbackIcon
}: LottieLoaderProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 opacity-20" />
        </div>
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
          {fallbackIcon || <AlertCircle className="w-12 h-12 opacity-20" />}
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">خطأ في التحميل</span>
        </div>
      ) : (
        <DotLottiePlayer
          src={src}
          autoplay={autoplay}
          loop={loop}
          onEvent={(event) => {
            if (event === 'ready') setLoading(false);
            if (event === 'error') {
              setError(true);
              setLoading(false);
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
