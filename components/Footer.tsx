// components/Footer.tsx
'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function Footer({ className }: { className?: string }) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      dir="ltr"
      className={`
        glass-card
        bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 
        text-slate-500 dark:text-slate-400 py-2 px-5 rounded-2xl shadow-xl 
        flex items-center gap-4 text-[10px] md:text-xs font-bold
        hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-500
        z-50
        ${className || ''}
      `}
    >
      <span className="opacity-80">
        Designed and developed by <span className="text-slate-900 dark:text-white font-bold">Smail Selmi</span>
      </span>
      
      <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
      
      <a 
        href="tel:0550365473" 
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors group"
      >
        <div className="p-1.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
          <Phone className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <span className="font-mono tracking-wider">0550365473</span>
      </a>
    </motion.footer>
  );
}
