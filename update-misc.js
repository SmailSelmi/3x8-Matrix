const fs = require('fs');
const path = require('path');

// Update PersonalInfoView
const profileFile = path.join(__dirname, 'components/PersonalInfoView.tsx');
let profileContent = fs.readFileSync(profileFile, 'utf8');

if (!profileContent.includes('import { getTranslation }')) {
  profileContent = profileContent.replace(
    'import { AppSettings } from "@/hooks/useAppSettings";',
    'import { AppSettings } from "@/hooks/useAppSettings";\nimport { getTranslation } from "@/lib/i18n";'
  );
}

if (!profileContent.includes('const t = getTranslation')) {
  profileContent = profileContent.replace(
    /const fileInputRef = React\.useRef<HTMLInputElement>\(null\);/,
    'const t = getTranslation(settings.language || "ar").profile;\n  const fileInputRef = React.useRef<HTMLInputElement>(null);'
  );
}

profileContent = profileContent.replace(/المعلومات الشخصية/g, '{t.personalInfo}');
profileContent = profileContent.replace(/صورة الملف الشخصي/g, '{t.profilePicture}');
profileContent = profileContent.replace(/title="تغيير الصورة"/g, 'title={t.changePicture}');
profileContent = profileContent.replace(/>\s*تغيير الصورة\s*<\/button>/, '>{t.changePicture}</button>');
profileContent = profileContent.replace(/title="حذف الصورة"/g, 'title={t.deletePicture}');
profileContent = profileContent.replace(/\{settings\.profileImage \? "تغيير الصورة" : "رفع صورة"\}/g, '{settings.profileImage ? t.changePicture : t.uploadPicture}');
profileContent = profileContent.replace(/اسم المستخدم/g, '{t.username}');
profileContent = profileContent.replace(/placeholder="أدخل اسمك\.\.\."/g, 'placeholder={t.enterName}');
profileContent = profileContent.replace(/يظهر اسمك في الترحيب وصفحة التقرير الشخصي/g, '{t.usernameDesc}');

fs.writeFileSync(profileFile, profileContent, 'utf8');
console.log("Updated PersonalInfoView.tsx successfully.");

// Update Header
const headerFile = path.join(__dirname, 'components/Header.tsx');
let headerContent = fs.readFileSync(headerFile, 'utf8');

headerContent = headerContent.replace(
  /title:\s*"Trois Huit \- جدول المناوبات",\s*text:\s*`ودّع فوضى جداول العمل، واستقبل تنظيماً أكثر كفاءة واحترافية مع تطبيق Trois Huit — المساعد الذكي لإدارة نظام المناوبات\.\\n\\nماذا يقدّم لك التطبيق؟\\n\\n✅ حساب دقيق وفوري لجداول المناوبات وفق نظام عملك\.\\n🌴 إدارة تلقائية لرصيد الإجازات الشهرية والسنوية بكل شفافية\.\\n📅 أجندة متكاملة تتضمن العطل الوطنية والمناسبات الإسلامية لتخطيط أفضل\.\\n🔔 تنبيهات وإشعارات فورية لضمان عدم تفويت أي موعد أو مناوبة\.\\n\\nتطبيق خفيف وسهل الاستخدام، لا يتطلب إنشاء حساب، ومتاح مجاناً بالكامل\.\\n\\nابدأ الآن بتنظيم وقتك بكفاءة أعلى، وشاركه مع زملائك ليستفيد الجميع\.`/,
  'title: t.shareTitle,\n                    text: t.shareText'
);

headerContent = headerContent.replace(
  /alert\("الرابط: " \+ window\.location\.origin\);/g,
  'alert(t.shareUrlText + window.location.origin);'
);

// Fix the Top-Left Digital Clock Size specifically
headerContent = headerContent.replace(
  /className="text-sm font-black font-mono text-slate-100"/g,
  'className="text-lg font-medium font-mono text-slate-100"'
);

fs.writeFileSync(headerFile, headerContent, 'utf8');
console.log("Updated Header.tsx successfully.");
