const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'components/StatsView.tsx');
let content = fs.readFileSync(file, 'utf8');

// The file already imports getTranslation and AppSettings
// const t = getTranslation(settings.language || "ar").stats;
// It has this around line 77 or so. Wait, let's just replace strings.
content = content.replace(/نظرة عامة/g, '{t.overviewTab}');
content = content.replace(/السجل/g, '{t.historyTab}');
content = content.replace(/القادم/g, '{t.scheduleTab}');
content = content.replace(/وضعية اليوم/g, '{t.todayStatus}');

content = content.replace(/استمتع بيومك ✨/g, 't.enjoyDay');
content = content.replace(/يوم راحة مستحق 🛡️/g, 't.deservedRest');

// Wait, "{shiftLength} ساعات عمل"
// "ساعات عمل"
content = content.replace(/\{shiftLength\}\s*ساعات عمل/g, '{t.workHoursText.replace("{hours}", shiftLength.toString())}');

content = content.replace(/الإجازات السنوية/g, '{t.annualLeaves}');
content = content.replace(/أنت في إجازة 🎉/g, '{t.onVacation}');

content = content.replace(/'مجدولة'/g, 't.scheduled');
content = content.replace(/'الحالية'/g, 't.current');

content = content.replace(/إجمالي السنة/g, '{t.totalYear}');
content = content.replace(/متبقية/g, '{t.remaining}');
content = content.replace(/⏳ حتى الإجازة القادمة/g, 't.untilNextVacation');
content = content.replace(/>\s*يوم\s*<\//g, '>{t.daysText}</');
content = content.replace(/تقدم دورة العمل/g, '{t.workCycleProgress}');
content = content.replace(/منقضي/g, '{t.elapsed}');
content = content.replace(/رصيد الإجازة السنوية/g, '{t.annualLeaveBalance}');
content = content.replace(/مستهلك/g, '{t.consumedText}');
content = content.replace(/توزيع الشهر الحالي/g, '{t.currentMonthDist}');
content = content.replace(/ساعات العمل هذا الشهر/g, '{t.keyMetrics}');
content = content.replace(/>\s*شهر\s*<\//g, '>{t.monthText}</');
content = content.replace(/مناوبات ليلية/g, '{t.nightShifts}');
content = content.replace(/هذا الشهر/g, '{t.thisMonthText}');
content = content.replace(/مناوبات أُكملت/g, '{t.completedShifts}');
content = content.replace(/تم إكمالها/g, '{t.completedText}');
content = content.replace(/أطول سلسلة عمل/g, '{t.longestStreak}');
content = content.replace(/متواصل/g, '{t.continuousText}');
content = content.replace(/آخر 14 يوم/g, '{t.last14Days}');
content = content.replace(/الجدول القادم \(14 يوم\)/g, '{t.next14Days}');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated StatsView.tsx successfully.");
