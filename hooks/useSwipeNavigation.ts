// hooks/useSwipeNavigation.ts
"use client";

import { useEffect, useRef } from "react";

interface SwipeNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  bottomThreshold?: number; // 0-1, fraction of screen from top to start zone
  enabled?: boolean;
}

export default function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  bottomThreshold = 0.7,
  enabled = true,
}: SwipeNavigationProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;

      const windowHeight = window.innerHeight;
      const startY = touchStart.current.y;

      // Only trigger if swipe starts in the bottom zone (e.g., bottom 30%)
      const isFromBottomZone = startY > windowHeight * bottomThreshold;

      if (!isFromBottomZone) {
        touchStart.current = null;
        touchEnd.current = null;
        return;
      }

      const distance = touchStart.current.x - touchEnd.current.x;
      const isLeftSwipe = distance > threshold;
      const isRightSwipe = distance < -threshold;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, bottomThreshold, enabled]);
}
