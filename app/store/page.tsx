'use client';

import { Store } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function StorePage() {
  const { isDarkMode } = useApp();

  const t = {
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex-1 ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-12 text-center border ${t.glassBorder} shadow-2xl flex flex-col items-center justify-center`}>
        <div className={`w-28 h-28 ${t.itemBg} rounded-4xl flex items-center justify-center mb-8 border ${t.glassInnerBorder} ${t.muted} shadow-inner`}>
          <Store size={48} strokeWidth={1.5} />
        </div>
        <h3 className={`text-3xl font-black mb-4 uppercase tracking-tight ${t.heading}`}>Store is Empty</h3>
        <p className={`${t.muted} font-medium text-base max-w-md mx-auto leading-relaxed`}>
          Popular and highly purchased prints will automatically appear here as the network grows.
        </p>
      </div>
    </div>
  );
}