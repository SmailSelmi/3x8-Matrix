const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Add import if missing
if (!content.includes('import { getTranslation }')) {
  content = content.replace(
    'import ScheduleSnapshot from "@/components/ScheduleSnapshot";',
    'import ScheduleSnapshot from "@/components/ScheduleSnapshot";\nimport { getTranslation } from "@/lib/i18n";'
  );
}

// Add 'const t = getTranslation(settings.language || "ar");' inside the component
if (!content.includes('const t = getTranslation(settings.language')) {
  content = content.replace(
    /const clock = useClock\(\);/,
    'const clock = useClock();\n  const t = getTranslation(settings.language || "ar");'
  );
}

// Basic replacements
content = content.replace(
  /title="تحديث: تنظيم الإجازة السنوية 🌴"/g,
  'title={t.announcements.vacationUpdateTitle}'
);
content = content.replace(
  /description="قمنا بتحسين واجهة إضافة الإجازات السنوية. يمكنك الآن اختيار \(الكل، النصف، أو مخصص\) مع حساب تلقائي للأيام المتبقية في رصيدك."/g,
  'description={t.announcements.vacationUpdateDesc}'
);

content = content.replace(
  /تفاصيل اليوم المختار/g,
  '{t.agenda.selectedDayDetails}'
);

content = content.replace(
  /استكشف جدولك/g,
  '{t.agenda.exploreSchedule}'
);

content = content.replace(
  /اختر يوماً من الشريط العلوي أو افتح التقويم الكامل لمشاهدة\s*تفاصيل المناوبات المستقبلية والسابقة\./g,
  '{t.agenda.exploreScheduleDesc}'
);

content = content.replace(
  /settings\.language === "ar"\s*\?\s*"معايرة الجدول \(يدوي\)"\s*:\s*settings.language === "en"\s*\?\s*"Manual Calibration"\s*:\s*"Calibration \(Manuelle\)"/g,
  't.calibration.manualCalibration'
);

content = content.replace(
  /\{settings\.language === "ar"\s*\?\s*"بدأت العمل اليوم"\s*:\s*settings.language === "en"\s*\?\s*"Started work today"\s*:\s*"J'ai commencé le travail aujourd'hui"\}/g,
  '{t.calibration.startedWork}'
);

content = content.replace(
  /\{settings\.language === "ar"\s*\?\s*"بدأت الإجازة اليوم"\s*:\s*settings.language === "en"\s*\?\s*"Started vacation today"\s*:\s*"J'ai commencé le congé aujourd'hui"\}/g,
  '{t.calibration.startedVacation}'
);

content = content.replace(
  /ضبط اليوم كبداية دورة العمل بعد العودة من الإجازة أو المرض/g,
  '{t.calibration.startedWorkDesc}'
);

content = content.replace(
  /ضبط اليوم كبداية فترة الإجازة \(15 يوم\) في حال بدأت مبكراً/g,
  '{t.calibration.startedVacationDesc}'
);

content = content.replace(
  /إزاحة التناوب \(Rotation Offset\)/g,
  '{t.calibration.rotationOffset}'
);

content = content.replace(
  /تأخير يوم واحد/g,
  '{t.calibration.delayOneDay}'
);

content = content.replace(
  /تقديم يوم واحد/g,
  '{t.calibration.advanceOneDay}'
);

content = content.replace(
  /title="تأكيد معايرة الجدول"/g,
  'title={t.calibration.confirmCalibration}'
);

content = content.replace(
  /"سيتم ضبط تاريخ بداية دورتك ليكون اليوم. هذا سيعيد ضبط كافة حسابات العمل القادمة والمستقبلية لتبدأ من الآن."/g,
  't.calibration.confirmSyncWork'
);

content = content.replace(
  /"سيتم ضبط جدولك لتبدأ فترة الإجازة من اليوم. سيتم احتساب أيام الإجازة الكاملة بدءاً من هذا التاريخ."/g,
  't.calibration.confirmSyncVacation'
);

content = content.replace(
  /"سيتم تقديم الجدول بالكامل بمقدار يوم واحد. سيتحرك كل شيء في التقويم للامام."/g,
  't.calibration.confirmShiftPlus'
);

content = content.replace(
  /"سيتم تأخير الجدول بالكامل بمقدار يوم واحد. سيتحرك كل شيء في التقويم للخلف."/g,
  't.calibration.confirmShiftMinus'
);

content = content.replace(
  />\s*تراجع\s*<\/button>/g,
  '>{t.calibration.cancel}</button>'
);

content = content.replace(
  />\s*تأكيد\s*<\/button>/g,
  '>{t.calibration.confirm}</button>'
);

content = content.replace(
  /title="تمديد فترة العمل الحالية"/g,
  'title={t.extension.title}'
);

content = content.replace(
  /إذا كنت ترغب في العمل لأيام إضافية بعد انتهاء الـ\{" "\}\s*\{settings.workDuration\} يوماً المقررة، يمكنك إضافة تلك الأيام هنا\.\s*سيتم دفع موعد إجازتك القادمة وتحديث الإحصائيات تلقائياً\./g,
  '{t.extension.desc.replace("{days}", settings.workDuration.toString())}'
);

content = content.replace(
  /أيام إضافية/g,
  '{t.extension.extraDays}'
);

content = content.replace(
  /تم تمديد العمل إلى\{" "\}/g,
  '{t.extension.extendedTo}{" "}'
);

content = content.replace(
  /يوماً\./g,
  '{t.extension.daysText}'
);

content = content.replace(
  />\s*إعادة الضبط\s*<\/button>/g,
  '>{t.extension.reset}</button>'
);

content = content.replace(
  />\s*إغلاق\s*<\/button>/g,
  '>{t.extension.close}</button>'
);

content = content.replace(
  /userName=\{settings.userName\}/g,
  'userName={settings.userName || t.header.coworker}'
);

fs.writeFileSync(pageFile, content, 'utf8');
console.log("Updated page.tsx successfully.");
