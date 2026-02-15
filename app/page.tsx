// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useShiftLogic } from '@/hooks/useShiftLogic';
import SettingsForm from '@/components/SettingsForm';
import CalendarView from '@/components/CalendarView';
import ShiftInsights from '@/components/ShiftInsights';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Settings, Share2, Check, BarChart2, X } from 'lucide-react';
import EnergyChart from "@/components/EnergyChart";
import YearlyHeatmap from "@/components/YearlyHeatmap";


function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => { spring.set(value); }, [value, spring]);
  
  return <motion.span>{display}</motion.span>;
}

export default function Home() {
  const { settings, loading, saveSettings, clearSettings } = useAppSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Helper for manual copy
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure it's not visible but part of DOM
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if(successful) {
         setShowShareToast(true);
         setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };
  
  // State for the currently selected date in the calendar
  // We initialize with start of today to match default behavior
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check if selected date is today
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // If it's today, we pass null to useShiftLogic so it uses "Live Now" (with countdowns)
  // If it's another day, we pass that date to get static stats
  const targetDateForLogic = isToday ? null : selectedDate;

  // منطق الحساب
  const shift = useShiftLogic(
    settings?.startDate || '',
    settings?.workDays || 45,
    settings?.leaveDays || 17,
    settings?.calculationMode || 'START_WORK',
    settings?.startShiftOffset || 0,
    targetDateForLogic
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
          onReset={() => {
            if (clearSettings) {
                clearSettings();
                setIsEditing(false);
            }
          }}
          onCancel={() => setIsEditing(false)}
          initialData={settings || undefined}
        />
      </main>
    );
  }

  if (!shift) return null;

  const isRest = shift.type === 'REST' || shift.type === 'LEAVE';

  return (
    <main className="h-[100dvh] w-full bg-background text-foreground grid grid-cols-1 lg:grid-cols-12 font-tajawal relative overflow-x-hidden overflow-y-auto snap-y snap-mandatory lg:overflow-hidden lg:snap-none">
      
      {/* القسم الأيسر: الحالة والأنيميشن */}
      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 relative"
            >
               <button 
                 onClick={() => setShowStats(false)}
                 className="absolute top-4 left-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               >
                 <X size={20} />
               </button>
               
               <h2 className="text-2xl font-black mb-6 text-center">الإحصائيات المتقدمة 📊</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Energy Chart Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                      <EnergyChart currentShiftOffset={(shift.daysPassed + (settings?.startShiftOffset || 0)) % 3} />
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col justify-center items-center text-center">
                      <h3 className="text-lg font-bold mb-2">ملخص السنة</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed">
                        نظرة شاملة على توزيع مناوباتك لعام {new Date().getFullYear()}. 
                        يمكنك استخدام المخطط الحراري أدناه لتحديد أنماط العمل والتخطيط لعطلك طويلة المدى.
                      </p>
                  </div>
               </div>

               {/* Yearly Heatmap */}
               <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                   <YearlyHeatmap 
                      year={new Date().getFullYear()} 
                      startDateStr={settings?.startDate || ''} 
                      startShiftOffset={settings?.startShiftOffset || 0}
                   />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="lg:col-span-4 min-h-[100dvh] lg:h-full snap-start flex flex-col justify-between items-center border-b lg:border-r lg:border-b-0 border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-3xl p-6 relative z-10 overflow-hidden"
      >
        {/* Background Glows (Lifestyle-aligned) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial ${isRest ? 'from-blue-600/20' : 'from-orange-600/20'} to-transparent blur-[120px] pointer-events-none opacity-50 z-0`} />
        
        {/* Top Controls */}
        <div className="w-full flex justify-between items-start z-50">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition shadow-lg backdrop-blur-md"
            >
              <Settings size={20} />
            </motion.button>

             <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    // Haptic Feedback
                    if (typeof window !== 'undefined' && window.navigator.vibrate) {
                      window.navigator.vibrate(50);
                    }

                    const shareData = {
                      title: 'تطبيق مناوباتي',
                      text: `📅 حالتي اليوم: ${shift.label}\n⏳ ${isToday ? 'باقي' : 'المدة'}: ${shift.daysRemaining} يوم\n\nشوف جدولك وخطط إجازتك من هنا:`,
                      url: window.location.href,
                    };

                    try {
                      if (navigator.share) {
                        await navigator.share(shareData);
                      } else {
                        throw new Error('Web Share API not supported');
                      }
                    } catch (err) {
                      // Fallback to Clipboard
                      const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                      
                      if (navigator.clipboard) {
                         navigator.clipboard.writeText(textToCopy)
                           .then(() => {
                              setShowShareToast(true);
                              setTimeout(() => setShowShareToast(false), 2000);
                           })
                           .catch(() => {
                              // Fallback if writeText fails
                              fallbackCopyTextToClipboard(textToCopy);
                           });
                      } else {
                         // Fallback for older browsers / non-secure contexts
                         fallbackCopyTextToClipboard(textToCopy);
                      }
                    }
                  }}
                  className="relative p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition shadow-lg backdrop-blur-md overflow-hidden group"
                >
                  <AnimatePresence mode="wait">
                     {showShareToast ? (
                       <motion.div 
                        key="check" 
                        initial={{ scale: 0, rotate: -45 }} 
                        animate={{ scale: 1, rotate: 0 }} 
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-1.5"
                       >
                         <Check size={20} className="text-green-500" />
                         <span className="text-[10px] font-bold text-green-500 hidden sm:inline-block">تم النسخ</span>
                       </motion.div>
                     ) : (
                       <motion.div 
                        key="share" 
                        initial={{ scale: 0, rotate: 45 }} 
                        animate={{ scale: 1, rotate: 0 }} 
                        exit={{ scale: 0, opacity: 0 }}
                       >
                         <Share2 size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                       </motion.div>
                     )}
                  </AnimatePresence>
                </motion.button>
                <ThemeToggle />
             </div>
        </div>

        {/* Middle Content: Animation & Status inside a flex container to center vertically available space */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">


            {/* Shift Insights Grid */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full max-w-[350px] aspect-square flex items-center justify-center mb-6 relative"
            >
                 <ShiftInsights 
                    daysPassed={shift.daysPassed}
                    totalWorkDays={settings.workDays}
                    startShiftOffset={settings.startShiftOffset || 0}
                 />
            </motion.div>
            
            {/* النصوص والعداد */}
            <div className="text-center space-y-3 relative">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${isRest ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'} mb-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isRest ? 'bg-blue-500' : 'bg-orange-500'} ${isToday ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      {isToday 
                        ? (shift.type === 'LEAVE' ? 'إجازة سعيدة' : shift.type === 'REST' ? 'يوم راحة' : 'راك خدام')
                        : `مناوبة ${selectedDate.toLocaleDateString('ar-DZ')}`}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-1">
                    {shift.label}
                  </h1>
                </motion.div>


            </div>
        </div>

        {/* Footer in Left Panel */}
        <div className="w-full relative z-20 pt-4">
             <Footer className="w-full" />
        </div>
      </motion.section>

      {/* القسم الأيمن: التقويم */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-8 min-h-[100dvh] lg:h-full snap-start flex flex-col p-2 md:p-3 lg:p-4 relative bg-slate-100/30 dark:bg-slate-950/50 overflow-hidden"
      >
        <div className="flex-1 min-h-0 h-full w-full"> 
            <CalendarView 
              startDateStr={settings.startDate}
              workDays={settings.workDays}
              leaveDays={settings.leaveDays}
              mode={settings.calculationMode}
              startShiftOffset={settings.startShiftOffset || 0}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
        </div>
      </motion.section>
    </main>
  );
}
