// components/Header.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Share2 } from 'lucide-react';
import { formatArabicDate, getHijriDate } from '@/lib/dateUtils';
import { NavTab } from './BottomNav';

interface HeaderProps {
  userName: string;
  profileImage?: string | null;
  currentTime: Date;
  onNavigate: (tab: NavTab) => void;
}

export default function Header({ userName, profileImage, currentTime, onNavigate }: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "صباح الخير";
    if (hour >= 12 && hour < 17) return "طاب يومك";
    if (hour >= 17 && hour < 21) return "مساء الخير";
    return "ليلة سعيدة";
  };

  return (
    <header className="p-6 flex flex-col gap-1 z-50 relative">
      <div className="flex justify-between items-center">
        {/* User Identity */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('PROFILE')}
            className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 overflow-hidden"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </motion.button>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{getGreeting()}</span>
            <span className="text-sm font-black text-slate-100">{userName || "زميل العمل"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Trois Huit - جدول المناوبات',
                  text: 'أنصحك بتجربة تطبيق "Trois Huit" لتنظيم مناوبات العمل الصناعي. تطبيق احترافي وسهل الاستخدام!',
                  url: window.location.origin,
                }).catch(() => {
                   // Fallback for failed share or user cancel
                });
              } else {
                alert('الرابط: ' + window.location.origin);
              }
            }}
            className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-400 transition-all"
          >
            <Share2 size={20} />
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                showNotifications ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
              }`}
            >
              <Bell size={20} />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 text-center"
                  >
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">لا توجد إشعارات حالياً</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Date Bar */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex flex-col items-start">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none" suppressHydrationWarning>
                {formatArabicDate(currentTime)}
             </span>
             <span className="text-[14px] font-black text-blue-500 mt-0.5" suppressHydrationWarning>
                {getHijriDate(currentTime)}
             </span>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-black font-mono text-slate-100">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
      </div>
    </header>
  );
}
