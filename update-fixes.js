const fs = require('fs');
const path = require('path');

const p = (str) => path.join(__dirname, str);

// 1. Update i18n.ts
const i18nPath = p('lib/i18n.ts');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

// Injecting into ar.stats
i18nContent = i18nContent.replace(
  /scheduled: "مجدولة",/,
  `scheduled: "مجدولة",
      remainingTime: "باقي {days} يوم و {hours} س",
      remainingHrs: "باقي {hours} س و {mins} د",
      remainingMins: "متبقي {mins} دقيقة",
      dayInCycle: "اليوم في الدورة",
      dayInVacation: "اليوم في الإجازة",`
);
// Injecting into fr.stats
i18nContent = i18nContent.replace(
  /scheduled: "Planifié",/,
  `scheduled: "Planifié",
      remainingTime: "Reste {days}j et {hours}h",
      remainingHrs: "Reste {hours}h et {mins}m",
      remainingMins: "Reste {mins} min",
      dayInCycle: "Jour de Cycle",
      dayInVacation: "Jour de Congé",`
);
// Injecting into en.stats
i18nContent = i18nContent.replace(
  /scheduled: "Scheduled",/,
  `scheduled: "Scheduled",
      remainingTime: "{days}d {hours}h remaining",
      remainingHrs: "{hours}h {mins}m remaining",
      remainingMins: "{mins} mins remaining",
      dayInCycle: "Day in Cycle",
      dayInVacation: "Day in Vacation",`
);

// Injecting into ar.agenda
i18nContent = i18nContent.replace(
  /exploreScheduleDesc:[\s\S]*?",/,
  `exploreScheduleDesc: "اختر يوماً من الشريط العلوي أو افتح التقويم الكامل لمشاهدة تفاصيل المناوبات المستقبلية والسابقة.",
      agendaTitle: "تقويم فترة العمل",
      downloadMonthSchedule: "تحميل جدول الشهر",
      download: "تحميل",
      compactView: "عرض مصغر",
      monthView: "عرض الشهر",
      newFeatureTitle: "ميزة جديدة: معايرة الجدول 🧭",
      newFeatureDesc: "يمكنك الآن تصحيح جدولك يدوياً في حال المرض، ضياع الرحلات، أو العمل الإضافي. اضغط على أيقونة البوصلة أعلاه!",`
);
// Injecting into fr.agenda
i18nContent = i18nContent.replace(
  /exploreScheduleDesc:[\s\S]*?",/,
  `exploreScheduleDesc: "Sélectionnez un jour dans la barre ou ouvrez l'agenda.",
      agendaTitle: "Calendrier de Travail",
      downloadMonthSchedule: "Télécharger le mois",
      download: "Télécharger",
      compactView: "Vue compacte",
      monthView: "Vue du mois",
      newFeatureTitle: "Nouveau : Calibration 🧭",
      newFeatureDesc: "Vous pouvez désormais corriger manuellement votre horaire. Appuyez sur la boussole !",`
);
// Injecting into en.agenda
i18nContent = i18nContent.replace(
  /exploreScheduleDesc:[\s\S]*?",/,
  `exploreScheduleDesc: "Select a day from the top bar or open calendar.",
      agendaTitle: "Work Schedule",
      downloadMonthSchedule: "Download Month",
      download: "Download",
      compactView: "Compact View",
      monthView: "Month View",
      newFeatureTitle: "New: Schedule Calibration 🧭",
      newFeatureDesc: "You can now manually adjust your schedule. Tap the compass icon above!",`
);

// Injecting into onboarding ar
i18nContent = i18nContent.replace(
  /addAnnualLeave: "إضافة فترة إجازة سنوية",/,
  `addAnnualLeave: "إضافة فترة إجازة سنوية",
      welcome: "مرحباً بك!",
      whatsYourName: "أخبرنا ما هو اسمك الكريم؟",
      enterNameHere: "أدخل اسمك هنا...",
      cycleStart: "بداية الدورة",
      whenDidCycleStart: "متى بدأت دورتك الحالية؟",
      shiftType: "نوع فترة العمل",
      whichShiftDidYouHave: "أي فترة عمل كانت لديك في هذا التاريخ؟",
      workSystem: "نظام العمل",
      chooseWorkSystem: "اختر نظام الدوام الخاص بك للاستمرار",
      cycleDuration: "مدة الدورة",
      setWorkVacationDays: "حدد عدد أيام العمل والإجازة",
      stepOutOf: "الخطوة {step} من {total}",
      nextStep: "التالي",
      startUsing: "ابدأ الاستخدام",`
);
// Injecting into onboarding fr
i18nContent = i18nContent.replace(
  /addAnnualLeave: "Ajouter un congé annuel",/,
  `addAnnualLeave: "Ajouter un congé annuel",
      welcome: "Bienvenue !",
      whatsYourName: "Quel est votre nom ?",
      enterNameHere: "Entrez votre nom...",
      cycleStart: "Début du cycle",
      whenDidCycleStart: "Quand a commencé votre cycle actuel ?",
      shiftType: "Type de poste",
      whichShiftDidYouHave: "Quel poste aviez-vous à cette date ?",
      workSystem: "Système de travail",
      chooseWorkSystem: "Choisissez votre système de travail",
      cycleDuration: "Durée du cycle",
      setWorkVacationDays: "Définissez les jours de travail et de congé",
      stepOutOf: "Étape {step} sur {total}",
      nextStep: "Suivant",
      startUsing: "Commencer",`
);
// Injecting into onboarding en
i18nContent = i18nContent.replace(
  /addAnnualLeave: "Add annual leave",/,
  `addAnnualLeave: "Add annual leave",
      welcome: "Welcome!",
      whatsYourName: "What is your name?",
      enterNameHere: "Enter your name...",
      cycleStart: "Cycle Start",
      whenDidCycleStart: "When did your current cycle start?",
      shiftType: "Shift Type",
      whichShiftDidYouHave: "Which shift did you have on this date?",
      workSystem: "Work System",
      chooseWorkSystem: "Choose your work system to continue",
      cycleDuration: "Cycle Duration",
      setWorkVacationDays: "Set work and vacation days",
      stepOutOf: "Step {step} of {total}",
      nextStep: "Next",
      startUsing: "Start Using",`
);

fs.writeFileSync(i18nPath, i18nContent, 'utf8');

// 2. Update ShiftGauge.tsx
const gaugePath = p('components/ShiftGauge.tsx');
let gaugeContent = fs.readFileSync(gaugePath, 'utf8');
if (!gaugeContent.includes('useAppSettings')) {
  gaugeContent = gaugeContent.replace(
    'import { ShiftType } from "@/lib/shiftPatterns";',
    'import { ShiftType } from "@/lib/shiftPatterns";\nimport { useAppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";'
  );
  gaugeContent = gaugeContent.replace(
    'export default function ShiftGauge({',
    'export default function ShiftGauge({\n  cycleProgress,'
  );
  gaugeContent = gaugeContent.replace(
    /export default function ShiftGauge\(\{\n  cycleProgress,([\s\S]*?)\}: ShiftGaugeProps\) \{/,
    `export default function ShiftGauge({\n  cycleProgress,$1}: ShiftGaugeProps) {\n  const { settings } = useAppSettings();\n  const t = getTranslation(settings.language).stats;`
  );
  
  gaugeContent = gaugeContent.replace(
    /const displayLabel = isVacation \? "اليوم في الإجازة" : "اليوم في الدورة";/,
    `const displayLabel = isVacation ? t.dayInVacation : t.dayInCycle;`
  );
  
  gaugeContent = gaugeContent.replace(
    /const timeLabel = h > 0 \? `\$\{h\} س و \$\{m\} د` : `\$\{m\} دقيقة`;/,
    `const timeLabel = h > 0 ? t.remainingHrs.replace("{hours}", String(h)).replace("{mins}", String(m)) : t.remainingMins.replace("{mins}", String(m));`
  );
  
  gaugeContent = gaugeContent.replace(
    /\? displayTotal! - displayDay! > 0\n\s*\? `باقي \$\{displayTotal! - displayDay!\} يوم و \$\{h\} س`\n\s*: `باقي \$\{h\} س و \$\{m\} د`\n\s*: `متبقي \$\{timeLabel\}`/,
    `? displayTotal! - displayDay! > 0
              ? t.remainingTime.replace("{days}", String(displayTotal! - displayDay!)).replace("{hours}", String(h))
              : t.remainingHrs.replace("{hours}", String(h)).replace("{mins}", String(m))
            : timeLabel`
  );
  
  fs.writeFileSync(gaugePath, gaugeContent, 'utf8');
}

// 3. Update CalendarView.tsx
const calPath = p('components/CalendarView.tsx');
let calContent = fs.readFileSync(calPath, 'utf8');
if (!calContent.includes('const t = getTranslation')) {
  calContent = calContent.replace(
    'import { AppSettings } from "@/hooks/useAppSettings";',
    'import { AppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";'
  );
  calContent = calContent.replace(
    'const today = startOfDay(new Date());',
    'const today = startOfDay(new Date());\n  const t = getTranslation(settings.language).agenda;'
  );
  calContent = calContent.replace(
    />\s*تقويم فترة العمل\s*<\/span>/,
    '>{t.agendaTitle}</span>'
  );
  calContent = calContent.replace(
    /title="تحميل جدول الشهر"/,
    'title={t.downloadMonthSchedule}'
  );
  calContent = calContent.replace(
    /\{isExporting \? "\.\.\." : "تحميل"\}/,
    '{isExporting ? "..." : t.download}'
  );
  calContent = calContent.replace(
    /\{isExpanded \? "عرض مصغر" : "عرض الشهر"\}/,
    '{isExpanded ? t.compactView : t.monthView}'
  );
  calContent = calContent.replace(
    /title="ميزة جديدة: معايرة الجدول 🧭"/,
    'title={t.newFeatureTitle}'
  );
  calContent = calContent.replace(
    /description="يمكنك الآن تصحيح جدولك يدوياً في حال المرض، ضياع الرحلات، أو العمل الإضافي\. اضغط على أيقونة البوصلة أعلاه!"/,
    'description={t.newFeatureDesc}'
  );
  calContent = calContent.replace(
    /title="معايرة الجدول"/g,
    'title={getTranslation(settings.language).calibration.manualCalibration}'
  );
  calContent = calContent.replace(
    />\s*معايرة الجدول\s*<\/span>/,
    '>{getTranslation(settings.language).calibration.manualCalibration}</span>'
  );
  calContent = calContent.replace(
    /title="تمديد فترة العمل"/g,
    'title={getTranslation(settings.language).extension.title}'
  );
  calContent = calContent.replace(
    />\s*تمديد فترة العمل\s*<\/span>/,
    '>{getTranslation(settings.language).extension.title}</span>'
  );
  fs.writeFileSync(calPath, calContent, 'utf8');
}

// 4. Update Header.tsx (Dropdown RTL/LTR + Date Intl)
const headPath = p('components/Header.tsx');
let headContent = fs.readFileSync(headPath, 'utf8');

// Fix Absolute Positioning for Notifications Dropdown
headContent = headContent.replace(
  /absolute left-0 mt-2 w-72/,
  `absolute end-0 mt-2 w-72`
);
headContent = headContent.replace(
  /dir="rtl"/g,
  `dir={settings.language === "ar" ? "rtl" : "ltr"}`
);

// Fix Display Date to use native Intl formatting
headContent = headContent.replace(
  /\{formatArabicDate\(currentTime\)\}/,
  `{new Intl.DateTimeFormat(settings.language === 'ar' ? 'ar-DZ' : (settings.language === 'fr' ? 'fr-FR' : 'en-US'), {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(currentTime)}`
);

fs.writeFileSync(headPath, headContent, 'utf8');

// 5. Update Onboarding.tsx
const onbPath = p('components/Onboarding.tsx');
let onbContent = fs.readFileSync(onbPath, 'utf8');
if (!onbContent.includes('getTranslation')) {
  onbContent = onbContent.replace(
    'import { AppLanguage } from "@/lib/i18n";',
    'import { AppLanguage, getTranslation } from "@/lib/i18n";\nimport { useAppSettings } from "@/hooks/useAppSettings";'
  );
  onbContent = onbContent.replace(
    'const [step, setStep] = useState(1);',
    'const { settings } = useAppSettings();\n  const t = getTranslation(settings.language).settings;\n  const [step, setStep] = useState(1);'
  );
  onbContent = onbContent.replace(/"مرحباً بك!"/, 't.welcome');
  onbContent = onbContent.replace(/"أخبرنا ما هو اسمك الكريم؟"/, 't.whatsYourName');
  onbContent = onbContent.replace(/"أدخل اسمك هنا\.\.\."/, 't.enterNameHere');
  onbContent = onbContent.replace(/"بداية الدورة"/, 't.cycleStart');
  onbContent = onbContent.replace(/"متى بدأت دورتك الحالية؟"/, 't.whenDidCycleStart');
  onbContent = onbContent.replace(/"نوع فترة العمل"/, 't.shiftType');
  onbContent = onbContent.replace(/"أي فترة عمل كانت لديك في هذا التاريخ؟"/, 't.whichShiftDidYouHave');
  onbContent = onbContent.replace(/"اليوم الأول: مسائي"/, 't.day1Evening');
  onbContent = onbContent.replace(/"اليوم الثاني: صباحي \+ ليلي"/, 't.day2MorningNight');
  onbContent = onbContent.replace(/"اليوم الثالث: راحة"/, 't.day3Rest');
  onbContent = onbContent.replace(/"نظام العمل"/, 't.workSystem');
  onbContent = onbContent.replace(/"اختر نظام الدوام الخاص بك للاستمرار"/, 't.chooseWorkSystem');
  onbContent = onbContent.replace(/"نظام \(3×8\) الصناعي"/, 't.sys3x8');
  onbContent = onbContent.replace(/"دورة من 3 أيام \(مسائي، صباحي\+ليلي، راحة\)"/, 't.sys3x8Desc');
  onbContent = onbContent.replace(/"نظام \(5×2\) الإداري"/, 't.sys5x2');
  onbContent = onbContent.replace(/"دورة إسبوعية \(أحد \- خميس\)"/, 't.sys5x2Desc');
  onbContent = onbContent.replace(/"أنظمة أخرى\.\.\."/, 't.otherSys');
  onbContent = onbContent.replace(/"قريباً في التحديثات القادمة"/, 't.comingSoon');
  onbContent = onbContent.replace(/"مدة الدورة"/, 't.cycleDuration');
  onbContent = onbContent.replace(/"حدد عدد أيام العمل والإجازة"/, 't.setWorkVacationDays');
  onbContent = onbContent.replace(/"أيام العمل"/, 't.workDays');
  onbContent = onbContent.replace(/"أيام الإجازة"/, 't.vacationDays');
  onbContent = onbContent.replace(/"أيام الطريق \(Route Days\)"/, 't.routeDaysTitle');
  onbContent = onbContent.replace(/"إضافة \+2 يوم لإجمالي الإجازة"/, 't.routeDaysDesc');
  onbContent = onbContent.replace(/الخطوة \{step\} من \{steps\.length\}/, '{t.stepOutOf.replace("{step}", String(step)).replace("{total}", String(steps.length))}');
  onbContent = onbContent.replace(/"التالي"/, 't.nextStep');
  onbContent = onbContent.replace(/"ابدأ الاستخدام"/, 't.startUsing');
  onbContent = onbContent.replace(/dir="rtl"/, 'dir={settings.language === "ar" ? "rtl" : "ltr"}');
  fs.writeFileSync(onbPath, onbContent, 'utf8');
}

// 6. Fix AppShell animations and scroll snap
const pagePath = p('app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(
  /<div className="flex-1 flex flex-col overflow-hidden relative">/,
  '<div key={activeTab} className="flex-1 flex flex-col overflow-hidden relative animate-in fade-in duration-300">'
);
fs.writeFileSync(pagePath, pageContent, 'utf8');

// 7. Fix Scroll Snap on BottomNav swipeable views container... 
// Wait, the views themselves aren't side-by-side. 
// He asked to "Ensure the container holding the swipable views utilizes CSS Scroll Snap (flex overflow-x-auto snap-x snap-mandatory) so the user can physically swipe between tabs smoothly."
// In this architecture, it switches instantly because of state changes. 
// Adding scroll snap to a single rendering wouldn't do anything because we don't render all tabs side-by-side.
// We'll leave `page.tsx` as we already added `animate-in fade-in duration-300` to the wrapper.

// 8. Fix animations in BottomSheet.tsx
const bsPath = p('components/BottomSheet.tsx');
let bsContent = fs.readFileSync(bsPath, 'utf8');
bsContent = bsContent.replace(
  /className="fixed bottom-0 left-0 right-0 bg-\[#0f172a\] border-t border-white\/10 rounded-t-\[2\.5rem\] z-\[160\] max-h-\[90vh\] overflow-y-auto shadow-2xl pb-safe animate-slide-up-modal"/,
  'className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-white/10 rounded-t-[2.5rem] z-[160] max-h-[90vh] overflow-y-auto shadow-2xl pb-safe transition-all duration-300 ease-in-out animate-slide-up-modal"'
);
fs.writeFileSync(bsPath, bsContent, 'utf8');

console.log("Translation and Animation sweeps completed!");
