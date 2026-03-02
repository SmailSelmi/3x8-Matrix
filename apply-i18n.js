const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'lib', 'i18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

const newTranslations = {
  ar: `
    settings: {
      shiftConfig: "إعدادات فترة العمل",
      d1Date: "تاريخ مرجع الدورة (D1)",
      d1Desc: "هذا التاريخ يمثل اليوم الأول (D1) في دورتك",
      shiftSystem: "نظام الدوام",
      sys3x8: "نظام (3×8) الصناعي",
      sys3x8Desc: "دورة من 3 أيام",
      sys5x2: "نظام (5×2) الإداري",
      sys5x2Desc: "أحد - خميس",
      otherSys: "أنظمة أخرى",
      comingSoon: "قريباً...",
      shiftAtRefDate: "فترة العمل في تاريخ المرجع",
      day1Evening: "اليوم الأول: مسائي (13-20)",
      day2MorningNight: "اليوم الثاني: صباحي+ليلي",
      day3Rest: "اليوم الثالث: راحة",
      rotationSystem: "نظام التناوب (Work/Vacation)",
      workDays: "أيام العمل",
      vacationDays: "أيام الإجازة",
      routeDaysTitle: "أيام الطريق (+2)",
      routeDaysDesc: "إضافة يومين للسفر إلى إجازتك",
      annualLeaveTitle: "الإجازة السنوية (30+ يوم)",
      editPool: "تعديل الرصيد",
      remainingPool: "الرصيد المتبقي",
      consumed: "المستهلك",
      addedPeriods: "الفترات المضافة",
      fixedPeriod: "فترة محددة",
      noPeriodsAdded: "لم يتم إضافة أي فترات بعد",
      addAnnualLeave: "إضافة فترة إجازة سنوية",
      appearanceTitle: "المظهر — لون اللكنة",
      colorBlue: "أزرق",
      colorEmerald: "زمردي",
      colorViolet: "بنفسجي",
      colorAmber: "عنبري",
      colorDesc: "يغيّر لون التوهج والحدود النشطة وعناصر التمييز في جميع الشاشات",
      generalPrefs: "التفضيلات العامة",
      notificationsTitle: "الإشعارات",
      notificationsDesc: "تنبيهات فترة العمل والتحولات",
      alertTime: "وقت التنبيه (قبل بـ)",
      hour: "ساعة",
      minute: "د",
      grantPermission: "منح إذن الإشعارات للمتصفح",
      hapticTitle: "الاهتزاز (Haptic)",
      hapticDesc: "ملاحظات لمسية عند التفاعل",
      appLanguage: "لغة التطبيق (Language)",
      dangerZone: "إعادة تعيين كاملة",
      dangerZoneDesc: "مسح كافة الإعدادات والبيانات",
      activate: "تفعيل",
      resetConfirmTitle: "إعادة تعيين البيانات",
      resetConfirmDesc: "هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات؟",
      cannotUndo: "لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      deleteAll: "حذف الكل",
      addLeaveTitle: "إضافة فترة إجازة سنوية",
      startDate: "تاريخ البداية",
      usageType: "نوع الاستهلاك",
      all: "الكل",
      half: "النصف",
      custom: "مخصص",
      daysCount: "عدد الأيام",
      example10: "مثلاً: 10",
      add: "إضافة",
      editBalanceTitle: "تعديل رصيد الإجازة السنوية",
      totalDays: "إجمالي الأيام في السنة",
      save: "حفظ",
      by: "بواسطة"
    },
    profile: {
      workHours: "ساعات العمل 🔥",
      goalProgress: "تحقيق الهدف 🚀",
      done: "أنجزت",
      remaining: "تبقي",
      daysPassed: "أيام العمل المنقضية",
      daysRemaining: "أيام العمل المتبقية",
    },
    stats: {
      performanceSummary: "ملخص الأداء الشهري",
      work: "العمل",
      rest: "الراحة",
      vacation: "الإجازة",
      daysDistribution: "توزيع الأيام"
    },`,
  fr: `
    settings: {
      shiftConfig: "Configuration des Postes",
      d1Date: "Date de référence (D1)",
      d1Desc: "Cette date représente le premier jour (D1) de votre cycle",
      shiftSystem: "Système de travail",
      sys3x8: "Système (3x8) Industriel",
      sys3x8Desc: "Cycle de 3 jours",
      sys5x2: "Système (5x2) Administratif",
      sys5x2Desc: "Dimanche - Jeudi",
      otherSys: "Autres systèmes",
      comingSoon: "Bientôt...",
      shiftAtRefDate: "Poste à la date de référence",
      day1Evening: "Jour 1: Soir (13h-20h)",
      day2MorningNight: "Jour 2: Matin+Nuit",
      day3Rest: "Jour 3: Repos",
      rotationSystem: "Système de Rotation (Travail/Congé)",
      workDays: "Jours de travail",
      vacationDays: "Jours de congé",
      routeDaysTitle: "Jours de route (+2)",
      routeDaysDesc: "Ajouter vos deux jours de voyage au congé",
      annualLeaveTitle: "Congé Annuel (30+ jours)",
      editPool: "Modifier Solde",
      remainingPool: "Solde",
      consumed: "Consommé",
      addedPeriods: "Périodes ajoutées",
      fixedPeriod: "Période fixée",
      noPeriodsAdded: "Aucune période ajoutée",
      addAnnualLeave: "Ajouter un congé annuel",
      appearanceTitle: "Apparence - Couleur d'accentuation",
      colorBlue: "Bleu",
      colorEmerald: "Émeraude",
      colorViolet: "Violet",
      colorAmber: "Ambre",
      colorDesc: "Change la couleur des accents sur tous les écrans",
      generalPrefs: "Préférences générales",
      notificationsTitle: "Notifications",
      notificationsDesc: "Alertes pour les postes et transitions",
      alertTime: "Heure d'alerte (avant)",
      hour: "heure",
      minute: "min",
      grantPermission: "Accorder la permission",
      hapticTitle: "Retour Haptique",
      hapticDesc: "Retours tactiles lors de l'interaction",
      appLanguage: "Langue (Language)",
      dangerZone: "Réinitialisation complète",
      dangerZoneDesc: "Effacer tous les paramètres et données",
      activate: "Activer",
      resetConfirmTitle: "Réinitialiser les données",
      resetConfirmDesc: "Êtes-vous sûr de vouloir réinitialiser toutes les données?",
      cannotUndo: "Cette action est irréversible.",
      cancel: "Annuler",
      deleteAll: "Tout supprimer",
      addLeaveTitle: "Ajouter un congé",
      startDate: "Date de début",
      usageType: "Type de consommation",
      all: "Tout",
      half: "Moitié",
      custom: "Personnalisé",
      daysCount: "Nombre de jours",
      example10: "Ex: 10",
      add: "Ajouter",
      editBalanceTitle: "Modifier le solde",
      totalDays: "Total des jours par an",
      save: "Enregistrer",
      by: "Par"
    },
    profile: {
      workHours: "Heures Travaillées 🔥",
      goalProgress: "Objectif Atteint 🚀",
      done: "Accompli",
      remaining: "Restant",
      daysPassed: "Jours passés",
      daysRemaining: "Jours restants",
    },
    stats: {
      performanceSummary: "Résumé Mensuel",
      work: "Travail",
      rest: "Repos",
      vacation: "Congé",
      daysDistribution: "Distribution des Jours"
    },`,
  en: `
    settings: {
      shiftConfig: "Shift Configuration",
      d1Date: "Reference Date (D1)",
      d1Desc: "This date represents the first day (D1) in your cycle",
      shiftSystem: "Shift System",
      sys3x8: "Industrial (3x8) System",
      sys3x8Desc: "3-day cycle",
      sys5x2: "Administrative (5x2) System",
      sys5x2Desc: "Sun - Thu",
      otherSys: "Other systems",
      comingSoon: "Coming soon...",
      shiftAtRefDate: "Shift at Reference Date",
      day1Evening: "Day 1: Evening (13h-20h)",
      day2MorningNight: "Day 2: Morn+Night",
      day3Rest: "Day 3: Rest",
      rotationSystem: "Rotation System (Work/Vacation)",
      workDays: "Work Days",
      vacationDays: "Vacation Days",
      routeDaysTitle: "Route Days (+2)",
      routeDaysDesc: "Add two travel days to your vacation",
      annualLeaveTitle: "Annual Leave (30+ days)",
      editPool: "Edit Balance",
      remainingPool: "Remaining",
      consumed: "Consumed",
      addedPeriods: "Added Periods",
      fixedPeriod: "Fixed Period",
      noPeriodsAdded: "No periods added yet",
      addAnnualLeave: "Add annual leave",
      appearanceTitle: "Appearance - Accent Color",
      colorBlue: "Blue",
      colorEmerald: "Emerald",
      colorViolet: "Violet",
      colorAmber: "Amber",
      colorDesc: "Changes the accent color across all screens",
      generalPrefs: "General Preferences",
      notificationsTitle: "Notifications",
      notificationsDesc: "Alerts for shifts and transitions",
      alertTime: "Alert Time (Before)",
      hour: "hour",
      minute: "min",
      grantPermission: "Grant Permission",
      hapticTitle: "Haptic Feedback",
      hapticDesc: "Tactile feedback on interaction",
      appLanguage: "App Language",
      dangerZone: "Full Reset",
      dangerZoneDesc: "Clear all settings and data",
      activate: "Activate",
      resetConfirmTitle: "Reset Data",
      resetConfirmDesc: "Are you sure you want to reset all data?",
      cannotUndo: "This action cannot be undone.",
      cancel: "Cancel",
      deleteAll: "Delete All",
      addLeaveTitle: "Add Annual Leave",
      startDate: "Start Date",
      usageType: "Usage Type",
      all: "All",
      half: "Half",
      custom: "Custom",
      daysCount: "Days Count",
      example10: "E.g. 10",
      add: "Add",
      editBalanceTitle: "Edit Leave Balance",
      totalDays: "Total Days per Year",
      save: "Save",
      by: "By"
    },
    profile: {
      workHours: "Hours Worked 🔥",
      goalProgress: "Goal Progress 🚀",
      done: "Done",
      remaining: "Remaining",
      daysPassed: "Days Passed",
      daysRemaining: "Days Remaining",
    },
    stats: {
      performanceSummary: "Monthly Summary",
      work: "Work",
      rest: "Rest",
      vacation: "Vacation",
      daysDistribution: "Days Distribution"
    },`
};

// Insert translations just after the respective language definitions 
// search for `ar: {`, `fr: {`, `en: {` and append the new blocks
content = content.replace(/ar:\s*{/, 'ar: {' + newTranslations.ar);
content = content.replace(/fr:\s*{/, 'fr: {' + newTranslations.fr);
content = content.replace(/en:\s*{/, 'en: {' + newTranslations.en);

fs.writeFileSync(i18nPath, content, 'utf8');

const settingsPath = path.join(__dirname, 'components', 'SettingsView.tsx');
let settingsContent = fs.readFileSync(settingsPath, 'utf8');
const settingsReplacements = {
  '"إعدادات فترة العمل"': 't.shiftConfig',
  '"تاريخ مرجع الدورة (D1)"': 't.d1Date',
  '"هذا التاريخ يمثل اليوم الأول (D1) في دورتك"': 't.d1Desc',
  '"نظام الدوام"': 't.shiftSystem',
  '"نظام (3×8) الصناعي"': 't.sys3x8',
  '"دورة من 3 أيام"': 't.sys3x8Desc',
  '"نظام (5×2) الإداري"': 't.sys5x2',
  '"أحد - خميس"': 't.sys5x2Desc',
  '"أنظمة أخرى"': 't.otherSys',
  '"قريباً..."': 't.comingSoon',
  '"فترة العمل في تاريخ المرجع"': 't.shiftAtRefDate',
  '"اليوم الأول: مسائي (13-20)"': 't.day1Evening',
  '"اليوم الثاني: صباحي+ليلي"': 't.day2MorningNight',
  '"اليوم الثالث: راحة"': 't.day3Rest',
  '"نظام التناوب (Work/Vacation)"': 't.rotationSystem',
  '"أيام العمل"': 't.workDays',
  '"أيام الإجازة"': 't.vacationDays',
  '"أيام الطريق (+2)"': 't.routeDaysTitle',
  '"إضافة يومين للسفر إلى إجازتك"': 't.routeDaysDesc',
  '"الإجازة السنوية (30+ يوم)"': 't.annualLeaveTitle',
  '"تعديل الرصيد"': 't.editPool',
  '"الرصيد المتبقي"': 't.remainingPool',
  '"يوم"': 't.monthDay ? t.monthDay : "d"', // wait, there is no day isolated except day translated
  '"المستهلك"': 't.consumed',
  '"الفترات المضافة"': 't.addedPeriods',
  '"فترة محددة"': 't.fixedPeriod',
  '"لم يتم إضافة أي فترات بعد"': 't.noPeriodsAdded',
  '"إضافة فترة إجازة سنوية"': 't.addAnnualLeave',
  '"المظهر — لون اللكنة"': 't.appearanceTitle',
  '"أزرق"': 't.colorBlue',
  '"زمردي"': 't.colorEmerald',
  '"بنفسجي"': 't.colorViolet',
  '"عنبري"': 't.colorAmber',
  '"يغيّر لون التوهج والحدود النشطة وعناصر التمييز في جميع الشاشات"': 't.colorDesc',
  '"التفضيلات العامة"': 't.generalPrefs',
  '"الإشعارات"': 't.notificationsTitle',
  '"تنبيهات فترة العمل والتحولات"': 't.notificationsDesc',
  '"وقت التنبيه (قبل بـ)"': 't.alertTime',
  '"ساعة"': 't.hour',
  '${mins} د': '${mins} ${t.minute}',
  '"منح إذن الإشعارات للمتصفح"': 't.grantPermission',
  '"الاهتزاز (Haptic)"': 't.hapticTitle',
  '"ملاحظات لمسية عند التفاعل"': 't.hapticDesc',
  '"لغة التطبيق (Language)"': 't.appLanguage',
  '"إعادة تعيين كاملة"': 't.dangerZone',
  '"مسح كافة الإعدادات والبيانات"': 't.dangerZoneDesc',
  '"تفعيل"': 't.activate',
  '"إعادة تعيين البيانات"': 't.resetConfirmTitle',
  'هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات؟ <br />': '{t.resetConfirmDesc} <br />',
  '"لا يمكن التراجع عن هذا الإجراء."': 't.cannotUndo',
  '"إلغاء"': 't.cancel',
  '"حذف الكل"': 't.deleteAll',
  '"إضافة فترة إجازة سنوية"': 't.addLeaveTitle',
  '"تاريخ البداية"': 't.startDate',
  '"نوع الاستهلاك"': 't.usageType',
  '"الكل"': 't.all',
  '"النصف"': 't.half',
  '"مخصص"': 't.custom',
  '"عدد الأيام"': 't.daysCount',
  '"مثلاً: 10"': 't.example10',
  '"إضافة"': 't.add',
  '"تعديل رصيد الإجازة السنوية"': 't.editBalanceTitle',
  '"إجمالي الأيام في السنة"': 't.totalDays',
  '"حفظ"': 't.save'
};

// First we inject `const t = getTranslation(settings.language).settings;` inside SettingsView function
if(!settingsContent.includes('const t = getTranslation')) {
    settingsContent = settingsContent.replace(/export default function SettingsView[^{]*{/m, 
      "$&\\n  const t = getTranslation(settings.language).settings;"
    );
}
// Also make sure to update import { getTranslation, AppLanguage } form i18n
// Already exists in SettingsView line 23

Object.keys(settingsReplacements).forEach(key => {
  // We need to replace string literals with t.variable
  settingsContent = settingsContent.split(key).join(settingsReplacements[key].includes('} <br />') || key.includes('${mins}') ? settingsReplacements[key] : '{' + settingsReplacements[key] + '}');
});

// For pure strings replacing
settingsContent = settingsContent.replace(/>يوم</g, '>{t.monthDay || "y"}<');

fs.writeFileSync(settingsPath, settingsContent, 'utf8');
console.log('Settings view translated');

const profilePath = path.join(__dirname, 'components', 'ProfileView.tsx');
let profileContent = fs.readFileSync(profilePath, 'utf8');

if (!profileContent.includes('getTranslation')) {
  profileContent = profileContent.replace('import { AppSettings } from "@/hooks/useAppSettings";', 
    'import { AppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";');
}

if (!profileContent.includes('const t = getTranslation')) {
  profileContent = profileContent.replace('export default function ProfileView({ settings }: { settings: AppSettings }) {', 
    'export default function ProfileView({ settings }: { settings: AppSettings }) {\n  const t = getTranslation(settings.language).profile;\n  const tc = getTranslation(settings.language).card;'
  );
}

const profileReplacements = {
  '"ساعات العمل 🔥"': '{t.workHours}',
  '"تحقيق الهدف 🚀"': '{t.goalProgress}',
  '"الحالة الحالية"': '{tc.currentStatus}',
  '>أنجزت<': '>{t.done}<',
  '>تبقي<': '>{t.remaining}<',
  '"أيام العمل المنقضية"': '{t.daysPassed}',
  '"أيام العمل المتبقية"': '{t.daysRemaining}'
};

Object.keys(profileReplacements).forEach(key => {
  profileContent = profileContent.split(key).join(profileReplacements[key]);
});

fs.writeFileSync(profilePath, profileContent, 'utf8');
console.log('Profile view translated');

const statsPath = path.join(__dirname, 'components', 'StatsView.tsx');
let statsContent = fs.readFileSync(statsPath, 'utf8');
if (!statsContent.includes('getTranslation')) {
  statsContent = statsContent.replace('import { AppSettings } from "@/hooks/useAppSettings";', 
    'import { AppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";');
}
if(!statsContent.includes('const t = getTranslation')) {
    statsContent = statsContent.replace(/export default function StatsView[^{]*{/m, 
      "$&\\n  const t = getTranslation(settings.language).stats;"
    );
}

const statsReplacements = {
  '"ملخص الأداء الشهري"': '{t.performanceSummary}',
  '>العمل<': '>{t.work}<',
  '>الراحة<': '>{t.rest}<',
  '>الإجازة<': '>{t.vacation}<',
  '"توزيع الأيام"': '{t.daysDistribution}'
};

Object.keys(statsReplacements).forEach(key => {
  statsContent = statsContent.split(key).join(statsReplacements[key]);
});
fs.writeFileSync(statsPath, statsContent, 'utf8');
console.log('Stats view translated');

