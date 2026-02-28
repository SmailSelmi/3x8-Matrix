// lib/shiftPatterns.ts

export type ShiftType = 'day' | 'evening' | 'night' | 'rest' | 'leave';
export type SystemType = '3x8_industrial' | '5x2_admin';

export interface ShiftPattern {
  day: number;
  type: ShiftType;
  label: string;
  emoji: string;
  color: string;
  startTime?: string;
  endTime?: string;
}

// 3x8 Industrial Pattern (The "Absolute" 3-Day Law)
// Day 1: Evening (13h-20h)
// Day 2: Morning (07h-13h) AND Night (20h-07h)
// Day 3: Rest (Starts at 07h)
export const INDUSTRIAL_3X8_PATTERN: ShiftType[] = [
  'evening', // Day 1
  'day',     // Day 2 (Morning part is first)
  'rest'     // Day 3
];

// 5x2 Admin Pattern: Standard Algerian week (Sun-Thu work, Fri-Sat rest)
export const ADMIN_5X2_PATTERN: ShiftType[] = [
  'day', 'day', 'day', 'day', 'day', 'rest', 'rest'
];

export const SHIFT_WINDOWS = {
  INDUSTRIAL: {
    DAY1: { type: 'evening', start: '13:00', end: '20:00' },
    DAY2_A: { type: 'day', start: '07:00', end: '13:00' },
    DAY2_B: { type: 'night', start: '20:00', end: '07:00' },
    DAY3: { type: 'rest', start: '07:00', end: '07:00' } // Rest starts after night shift
  }
};
