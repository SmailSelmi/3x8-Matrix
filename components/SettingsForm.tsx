'use client';

import { useState, useEffect } from 'react';
import { AppSettings } from '@/hooks/useAppSettings';
import { Sun, RefreshCw, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePickerAr from './DatePickerAr';

interface Props {
  onSave: (settings: AppSettings) => void;
  initialData?: AppSettings;
}

type Mode = 'START_WORK' | 'START_LEAVE';

const SHIFT_OPTIONS = [
  { id: 0, label: 'مساء (13-20)', icon: Sun, color: 'orange', description: 'بداية الوردية بالدوام المسائي' },
  { id: 1, label: 'صباح + ليل', icon: RefreshCw, color: 'red', description: 'بداية الوردية بالدوام الكامل' },
  { id: 2, label: 'راحة', icon: Moon, color: 'blue', description: 'بداية الوردية بيوم الراحة' },
];

export default function SettingsForm({ onSave, initialData }: Props) {
  const [mode, setMode] = useState<Mode>(initialData?.calculationMode || 'START_WORK');
  
  const [formData, setFormData] = useState<AppSettings>(
    initialData || {
      startDate: new Date().toISOString().split('T')[0],
      workDays: 28,
      leaveDays: 28,
      calculationMode: 'START_WORK',
      startShiftOffset: 0
    }
  );

  const [summary, setSummary] = useState('');

  useEffect(() => {
    const cycles = Math.floor(formData.workDays / 3);
    const remainder = formData.workDays % 3;
    setSummary(`النظام الحالي: ${cycles} دورات كاملة + ${remainder} أيام متبقية`);
  }, [formData.workDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, calculationMode: mode });
  };

  const selectedShift = SHIFT_OPTIONS.find(s => s.id === (formData.startShiftOffset || 0));

  return (
    <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 mx-auto">
      
      {/* Mode Selection Tabs */}
      {/* Mode Selection Sliding Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/60 rounded-3xl border border-white/5 mx-2">
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

      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Custom Date Picker Trigger */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-1">
              {mode === 'START_WORK' ? 'تاريخ بداية العمل' : 'تاريخ بداية السفر'}
            </label>
            <DatePickerAr 
              selectedDate={new Date(formData.startDate)} 
              onChange={(date) => setFormData({...formData, startDate: date.toISOString().split('T')[0]})}
            />
          </div>

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
                    {SHIFT_OPTIONS.map((option) => (
                        <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData({...formData, startShiftOffset: option.id})}
                        className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all overflow-hidden ${
                            formData.startShiftOffset === option.id
                            ? `border-${option.color}-500 bg-${option.color}-500/10 shadow-[0_0_20px_rgba(var(--${option.color}-rgb),0.2)]`
                            : 'border-white/5 bg-slate-900/30 hover:bg-slate-900/50'
                        }`}
                        >
                        {formData.startShiftOffset === option.id && (
                            <motion.div
                            layoutId="active-shift"
                            className={`absolute inset-0 bg-${option.color}-500/10 pointer-events-none`}
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <option.icon className={`h-6 w-6 relative z-10 ${
                            formData.startShiftOffset === option.id ? `text-${option.color}-500` : 'text-slate-500'
                        }`} />
                        <span className={`text-[9px] font-black relative z-10 truncate w-full text-center ${
                            formData.startShiftOffset === option.id ? 'text-white' : 'text-slate-400'
                        }`}>
                            {option.label}
                        </span>
                        </button>
                    ))}
                    </div>
                    
                    <motion.div 
                        key={formData.startShiftOffset}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900/30 rounded-full border border-white/5"
                    >
                        <div className={`w-2 h-2 rounded-full bg-${selectedShift?.color}-500 animate-pulse`} />
                        <p className="text-[10px] font-bold text-slate-400">
                        سيبدأ الجدول بوردية: <span className={`text-${selectedShift?.color}-400`}>{selectedShift?.label}</span>
                        </p>
                    </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
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
                  value={formData.workDays}
                  onChange={(e) => setFormData({...formData, workDays: Number(e.target.value)})}
                  className="w-full bg-slate-900/50 text-white border-2 border-white/5 rounded-2xl p-4 text-center text-xl font-black focus:border-blue-500 outline-none"
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
                  value={formData.leaveDays}
                  onChange={(e) => setFormData({...formData, leaveDays: Number(e.target.value)})}
                  className="w-full bg-slate-900/50 text-white border-2 border-white/5 rounded-2xl p-4 text-center text-xl font-black focus:border-green-500 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase">يوم</span>
              </div>
            </div>
          </div>

          {/* Info Summary */}
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">نظام الدورة الحالية</p>
            <p className="text-xs text-blue-300 font-bold text-center leading-relaxed">{summary}</p>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full font-black py-5 rounded-[2rem] transition-all shadow-xl ${
              mode === 'START_WORK'
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
            }`}
          >
            حفظ وتطبيق البيانات
          </motion.button>
        </form>
      </div>
    </div>
  );
}

