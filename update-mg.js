const fs = require('fs');
const path = require('path');
const p = (str) => path.join(__dirname, str);

// Fix page.tsx animation
const pagePath = p('app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(/animate-in fade-in duration-300/g, "animate-fade-in");
fs.writeFileSync(pagePath, pageContent, 'utf8');

// Update MonthGrid.tsx
const mgPath = p('components/MonthGrid.tsx');
let mgContent = fs.readFileSync(mgPath, 'utf8');

if (!mgContent.includes('getTranslation')) {
  mgContent = mgContent.replace(
    'import { AppSettings } from "@/hooks/useAppSettings";',
    'import { AppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";'
  );
  
  mgContent = mgContent.replace(
    /const SHIFT_LABELS: Record<ShiftType, string> = \{[\s\S]*?\};/,
    `// SHIFT_LABELS is moved inside component to support i18n`
  );
  
  mgContent = mgContent.replace(
    /const weekdays = \[0, 1, 2, 3, 4, 5, 6\]\.map\(\(d\) =>/,
    `const t = getTranslation(settings.language);\n  const shiftLabels: Record<ShiftType, string> = {\n    day: t.settings.day2MorningNight,\n    evening: t.settings.day1Evening,\n    night: t.settings.day2MorningNight,\n    rest: t.settings.day3Rest,\n    leave: t.settings.vacationDays\n  };\n\n  const weekdays = [0, 1, 2, 3, 4, 5, 6].map((d) =>`
  );
  
  mgContent = mgContent.replace(/SHIFT_LABELS\[type\]/g, 'shiftLabels[type]');
  
  fs.writeFileSync(mgPath, mgContent, 'utf8');
}

console.log("MonthGrid fixed!");
