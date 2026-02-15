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
        bg-slate-900/80 backdrop-blur-xl border border-white/10 
        text-slate-300 py-2 px-6 rounded-full shadow-2xl 
        flex items-center gap-4 text-xs md:text-sm font-medium
        hover:bg-slate-800/80 transition-all duration-300
        z-50
        ${className || ''}
      `}
    >
      <span className="opacity-80">
        Designed and developed by <span className="text-white font-bold">Smail Selmi</span>
      </span>
      
      <div className="h-4 w-px bg-white/10" />
      
      <a 
        href="tel:0550365473" 
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
      >
        <div className="p-1.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
          <Phone className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <span className="font-mono tracking-wider">0550365473</span>
      </a>
    </motion.footer>
  );
}
