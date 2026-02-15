// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useShiftLogic } from '@/hooks/useShiftLogic';
import SettingsForm from '@/components/SettingsForm';
import CalendarView from '@/components/CalendarView';
import ShiftAnimation from '@/components/ShiftAnimation';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Settings, Share2, Check } from 'lucide-react';


function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => { spring.set(value); }, [value, spring]);
  
  return <motion.span>{display}</motion.span>;
}

export default function Home() {
  const { settings, loading, saveSettings } = useAppSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // منطق الحساب
  const shift = useShiftLogic(
    settings?.startDate || '',
    settings?.workDays || 28,
    settings?.leaveDays || 28,
    settings?.calculationMode || 'START_WORK',
    settings?.startShiftOffset || 0
  );

  if (loading) return (
    <div className="h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  // شاشة الإعدادات
  if (!settings || isEditing) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <SettingsForm 
          onSave={(data) => {
            saveSettings(data);
            setIsEditing(false);
          }} 
          initialData={settings || undefined}
        />
        {isEditing && (
          <button onClick={() => setIsEditing(false)} className="mt-8 text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors">إلغاء والعودة</button>
        )}
      </main>
    );
  }

  if (!shift) return null;

  const isRest = shift.type === 'REST' || shift.type === 'LEAVE';

  return (
    <main className="h-screen w-full bg-background text-foreground grid grid-cols-1 lg:grid-cols-12 font-tajawal relative overflow-x-hidden overflow-y-auto snap-y snap-mandatory lg:overflow-hidden lg:snap-none scroll-smooth">
      
      {/* القسم الأيسر: الحالة والأنيميشن */}
      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="lg:col-span-4 min-h-[100dvh] lg:h-screen lg:max-h-screen snap-start flex flex-col justify-center items-center border-b lg:border-r lg:border-b-0 border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-3xl p-6 relative z-10 overflow-hidden"
      >
        {/* Background Glows (Lifestyle-aligned) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial ${isRest ? 'from-blue-600/20' : 'from-orange-600/20'} to-transparent blur-[120px] pointer-events-none opacity-50 z-0`} />
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 bg-radial ${isRest ? 'from-blue-400/10' : 'from-orange-400/10'} to-transparent blur-[100px] pointer-events-none z-0`} />

        {/* زر الإعدادات */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className="absolute top-6 left-6 p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition z-50 shadow-lg backdrop-blur-md"
        >
          <Settings size={20} />
        </motion.button>

         {/* زر الثيم والمشاركة */}
         <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={async () => {
                const shareData = {
                  title: 'جدول مناوباتي',
                  text: `مناوبتي اليوم هي: ${shift.label}`,
                  url: window.location.href,
                };
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.error(err);
                  }
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 2000);
                }
              }}
              className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition shadow-lg backdrop-blur-md"
            >
              <AnimatePresence mode="wait">
                 {showShareToast ? (
                   <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                     <Check size={20} className="text-green-500" />
                   </motion.div>
                 ) : (
                   <motion.div key="share" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                     <Share2 size={20} />
                   </motion.div>
                 )}
              </AnimatePresence>
            </motion.button>
            <ThemeToggle />
         </div>

        {/* الأنيميشن */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-72 h-72 max-h-[35vh] flex items-center justify-center mb-8 relative z-10"
        >
             <ShiftAnimation type={shift.type} />
        </motion.div>
        
        {/* النصوص والعداد */}
        <div className="text-center space-y-4 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${isRest ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'} mb-4`}>
                <span className={`w-2 h-2 rounded-full ${isRest ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse`} />
                <span className="text-[10px] font-black uppercase tracking-wider">الحالة الحالية</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">
                {shift.label}
              </h1>
            </motion.div>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-400 font-medium"
            >
               باقي <span className={`font-black text-3xl mx-1 ${isRest ? 'text-blue-500' : 'text-orange-500'}`}><AnimatedNumber value={shift.daysRemaining} /></span> يوم
            </motion.p>
        </div>

        {/* Mobile-only Footer Spacer (optional, removed fixed footer here) */}
        <div className="lg:hidden h-2" />
      </motion.section>

      {/* القسم الأيمن: التقويم */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-8 min-h-[100dvh] lg:h-screen lg:max-h-screen snap-start flex flex-col p-2 md:p-3 lg:p-4 relative bg-slate-100/30 dark:bg-slate-950/50 overflow-hidden"
      >
        <div className="flex-1 min-h-0 h-full"> 
            <CalendarView 
              startDateStr={settings.startDate}
              workDays={settings.workDays}
              leaveDays={settings.leaveDays}
              mode={settings.calculationMode}
              startShiftOffset={settings.startShiftOffset || 0}
            />
        </div>
      </motion.section>
      
      {/* Footer: Positioned relatively for mobile scroll, sidebar for desktop */}
      <div className="lg:absolute lg:bottom-6 lg:left-6 lg:z-50 lg:w-[calc(33.333%-3rem)] flex justify-center p-6 lg:p-0">
        <Footer className="glass-card w-full max-w-sm lg:max-w-none" />
      </div>

    </main>
  );
}
