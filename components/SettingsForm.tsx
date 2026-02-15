'use client';

import { useState, useMemo } from 'react';
import { AppSettings } from '@/hooks/useAppSettings';
import { Sun, RefreshCw, Moon, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePickerAr from './DatePickerAr';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  onSave: (settings: AppSettings) => void;
  onReset?: () => void;
  onCancel?: () => void; // Added onCancel prop
  initialData?: AppSettings;
}

type Mode = 'START_WORK' | 'START_LEAVE';

const SHIFT_OPTIONS = [
  { id: 0, label: 'مساء (13-20)', icon: Sun, colorClass: 'text-orange-500', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500', shadowClass: 'shadow-orange-500/20', description: 'بداية الوردية بالدوام المسائي' },
  { id: 1, label: 'صباح + ليل', icon: Moon, colorClass: 'text-red-500', bgClass: 'bg-red-500/10', borderClass: 'border-red-500', shadowClass: 'shadow-red-500/20', description: 'بداية الوردية بالدوام الكامل' },
  { id: 2, label: 'راحة', icon: RefreshCw, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500', shadowClass: 'shadow-blue-500/20', description: 'بداية الوردية بيوم الراحة' },
];

export default function SettingsForm({ onSave, onReset, onCancel, initialData }: Props) {
  const [mode, setMode] = useState<Mode>(initialData?.calculationMode || 'START_WORK');
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  // Default state generator
  const getDefaults = (): AppSettings => {
     const d = new Date();
     const y = d.getFullYear();
     const m = String(d.getMonth() + 1).padStart(2, '0');
     const day = String(d.getDate()).padStart(2, '0');
     return {
        startDate: `${y}-${m}-${day}`,
        workDays: 45,
        leaveDays: 17,
        calculationMode: 'START_WORK',
        startShiftOffset: -1 // -1 Indicates no selection
     };
  };
  
  const [formData, setFormData] = useState<AppSettings>(initialData || getDefaults());

  // ... existing summary ...
  const summary = useMemo(() => {
    const cycles = Math.floor(formData.workDays / 3);
    const remainder = formData.workDays % 3;
    return `النظام الحالي: ${cycles} سيكل كاملة + ${remainder} أيام متبقية`;
  }, [formData.workDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Enforce Shift Selection for START_WORK mode
    if (mode === 'START_WORK' && (formData.startShiftOffset === undefined || formData.startShiftOffset === -1)) {
        // Shake or highlight logic can go here. For now, we rely on the button being disabled or a toast.
        // But the user requested "Disable the Save button".
        return;
    }

    onSave({ ...formData, calculationMode: mode });
  };

  const handleReset = () => {
     if (isResetConfirming) {
         // Perform Reset
         if (onReset) onReset();
         // Reset Local State
         const defaults = getDefaults();
         setFormData(defaults);
         setMode('START_WORK');
         setIsResetConfirming(false);
     } else {
         // Show Confirmation
         setIsResetConfirming(true);
         // Auto-hide confirmation after 3 seconds
         setTimeout(() => setIsResetConfirming(false), 3000);
     }
  };

  const selectedShift = SHIFT_OPTIONS.find(s => s.id === (formData.startShiftOffset || 0));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-md bg-card dark:bg-slate-900/80 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mx-auto flex flex-col max-h-[95dvh]"
    >
      
      {/* Header with Title and Close Button */}
      <div className="p-6 pb-2 space-y-4 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20 relative">
        <div className="flex justify-between items-center mb-2">
          {onCancel ? (
             <button 
               onClick={onCancel}
               className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
             >
               <X size={24} />
             </button>
          ) : <div className="w-10 h-10" />} 
          
          <h2 className="text-xl font-black text-foreground dark:text-white">إعدادات المناوبة 🛠️</h2>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-white/5">
          {(['START_WORK', 'START_LEAVE'] as const).map((m) => (
               <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`relative py-3.5 text-xs font-black rounded-2xl transition-colors duration-300 ${mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                  {mode === m && (
                      <motion.div
                          layoutId="active-mode-pill"
                          className={`absolute inset-0 rounded-2xl shadow-lg ${m === 'START_WORK' ? 'bg-blue-600' : 'bg-green-600'}`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                  )}
                  <span className="relative z-10">{m === 'START_WORK' ? 'بداية العمل 🛠️' : 'بداية الإجازة 🏠'}</span>
               </button>
          ))}
        </div>
      </div>

      <motion.div 
        className="p-6 pt-2 space-y-8 overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Custom Date Picker Trigger */}
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1">
              {mode === 'START_WORK' ? 'أدخل تاريخ إستئناف العمل' : 'أدخل تاريخ أول يوم إجازة'}
            </label>
            <DatePickerAr 
              selectedDate={new Date(formData.startDate)} 
              onChange={(date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                setFormData({...formData, startDate: `${year}-${month}-${day}`});
              }}
            />
          </motion.div>

          {/* Shift Type Selector - Hidden in 'START_LEAVE' mode */}
          <AnimatePresence>
            {mode === 'START_WORK' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pb-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1">
                    نوع الوردية عند البدء
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                    {SHIFT_OPTIONS.map((option) => {
                        const isSelected = formData.startShiftOffset === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({...formData, startShiftOffset: option.id})}
                            className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all overflow-hidden ${
                                isSelected
                                ? `${option.borderClass} ${option.bgClass} shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)]`
                                : 'border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/50'
                            }`}
                          >
                          {isSelected && (
                              <motion.div
                              layoutId="active-shift"
                              className={`absolute inset-0 ${option.bgClass} pointer-events-none`}
                              initial={false}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                          )}
                          <option.icon className={`h-6 w-6 relative z-10 ${
                              isSelected ? option.colorClass : 'text-slate-500'
                          }`} />
                          <span className={`text-[9px] font-black relative z-10 truncate w-full text-center ${
                              isSelected ? 'text-white' : 'text-slate-400'
                          }`}>
                              {option.label}
                          </span>
                          </button>
                        );
                    })}
                    </div>
                    
                    <motion.div 
                        key={formData.startShiftOffset}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-950/30 rounded-full border border-slate-200 dark:border-white/5"
                    >
                        <div className={`w-2 h-2 rounded-full ${selectedShift?.colorClass.replace('text-', 'bg-')} animate-pulse`} />
                        <p className="text-[10px] font-bold text-slate-400">
                        سيبدأ الجدول بمناوبة: <span className={`${selectedShift?.colorClass}`}>{selectedShift?.label}</span>
                        </p>
                    </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1">
                مدة العمل
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  dir="ltr" // Fix for cursor movement with numbers
                  inputMode="numeric" // Mobile: Show numeric keypad
                  pattern="[0-9]*" // Mobile: iOS numeric keypad hint
                  value={formData.workDays}
                  onFocus={(e) => e.target.select()} // Auto-select on focus to clear easy
                  onChange={(e) => setFormData({...formData, workDays: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-100 dark:bg-slate-950/50 text-foreground dark:text-white border-2 border-slate-200 dark:border-white/5 rounded-2xl p-4 text-center text-xl font-black focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase">يوم</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1">
                مدة الإجازة
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  dir="ltr" // Fix for cursor movement with numbers
                  inputMode="numeric" // Mobile: Show numeric keypad
                  pattern="[0-9]*" // Mobile: iOS numeric keypad hint
                  value={formData.leaveDays}
                  onFocus={(e) => e.target.select()} // Auto-select on focus to clear easy
                  onChange={(e) => setFormData({...formData, leaveDays: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-100 dark:bg-slate-950/50 text-foreground dark:text-white border-2 border-slate-200 dark:border-white/5 rounded-2xl p-4 text-center text-xl font-black focus:border-green-500 outline-none transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase">يوم</span>
              </div>
            </div>
          </motion.div>

          {/* Info Summary */}
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="p-4 bg-slate-100 dark:bg-slate-950/40 rounded-2x border border-slate-200 dark:border-white/5 space-y-1 backdrop-blur-md">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">نظام الدورة الحالية</p>
            <p className="text-xs text-blue-600 dark:text-blue-300 font-bold text-center leading-relaxed">{summary}</p>
          </motion.div>

          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-3 pt-2">
            
            {/* Validation Message */}
            {mode === 'START_WORK' && formData.startShiftOffset === -1 && (
                <p className="text-xs text-red-500 font-bold text-center animate-pulse">
                    ⚠️ يرجى اختيار نوع الوردية للمتابعة
                </p>
            )}

            <motion.button
              type="submit"
              disabled={mode === 'START_WORK' && formData.startShiftOffset === -1}
              whileHover={mode === 'START_WORK' && formData.startShiftOffset === -1 ? {} : { scale: 1.02, translateY: -2 }}
              whileTap={mode === 'START_WORK' && formData.startShiftOffset === -1 ? {} : { scale: 0.98 }}
              className={`w-full font-black py-5 rounded-[2rem] transition-all shadow-xl flex items-center justify-center gap-2 ${
                mode === 'START_WORK' && formData.startShiftOffset === -1
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                    : mode === 'START_WORK'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                        : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
              }`}
            >
              {mode === 'START_WORK' && formData.startShiftOffset === -1 ? 'إختر الوردية أولاً' : 'حفظ وتطبيق البيانات'}
            </motion.button>
            
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <ChevronLeft size={16} />
                    إلغاء والعودة
                </button>
            )}

            {/* Danger Zone */}
            {onReset && (
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 mx-2">
                 <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                      if (typeof window !== 'undefined' && window.navigator.vibrate) {
                          window.navigator.vibrate(50);
                      }
                      handleReset();
                  }}
                  className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 py-3 ${
                      isResetConfirming 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-red-100 dark:border-red-900/30 text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10'
                  }`}
                 >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isResetConfirming ? (
                             <>
                               <span className="font-black text-xs">⚠️ تأكيد الحذف النهائي؟</span>
                             </>
                        ) : (
                             <>
                               <RefreshCw size={14} className={`transition-transform duration-500 ${isResetConfirming ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                               <span className="font-bold text-xs">حذف جميع البيانات</span>
                             </>
                        )}
                    </div>
                    
                    {/* Progress Bar Animation for Confirmation Timeout */}
                    {isResetConfirming && (
                        <motion.div 
                           initial={{ width: "100%" }}
                           animate={{ width: "0%" }}
                           transition={{ duration: 3, ease: "linear" }}
                           className="absolute bottom-0 left-0 h-1 bg-white/30 backdrop-blur-sm z-0"
                        />
                    )}
                 </motion.button>
                 <p className="text-[9px] text-slate-400 text-center mt-2 px-4">
                    سيتم حذف جميع الإعدادات المحفوظة والعودة إلى الشاشة الرئيسية
                 </p>
              </div>
            )}
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}

