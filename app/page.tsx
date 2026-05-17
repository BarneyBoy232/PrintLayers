'use client';

import Link from 'next/link';
import { Search, Store, Layers } from 'lucide-react';
import { useApp } from './ClientWrapper';

export default function HomePage() {
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
    <div className="w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
      <div className={`w-full ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 border ${t.glassBorder} shadow-2xl relative overflow-hidden group`}>
        <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h3 className={`font-black text-4xl md:text-5xl mb-4 tracking-tight ${t.heading} leading-tight`}>
              Turn pixels into <span className="text-orange-500">plastic.</span>
            </h3>
            <p className={`${t.muted} text-base md:text-lg leading-relaxed`}>
              Upload your 3D files and get them printed by our decentralized network.
            </p>
          </div>
          <Link href="/adjust" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black shadow-lg hover:shadow-xl active:scale-95 transition-all">
            Start Printing
          </Link>
        </div>
      </div>

      <div className="w-full grid md:grid-cols-3 gap-4 md:gap-6">
        <Link href="/search" className={`w-full ${t.glassBg} p-8 md:p-10 rounded-[2.5rem] border ${t.glassBorder} hover:border-orange-500/30 transition-all group shadow-md`}>
          <div className={`w-14 h-14 ${t.itemBg} rounded-3xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform`}><Search size={26} /></div>
          <h3 className={`font-black text-2xl mb-3 ${t.heading}`}>Find Files</h3>
          <p className={`text-sm ${t.muted}`}>Search MakerWorld & Thingiverse directly.</p>
        </Link>

        <Link href="/store" className={`w-full ${t.glassBg} p-8 md:p-10 rounded-[2.5rem] border ${t.glassBorder} hover:border-blue-500/30 transition-all group shadow-md`}>
          <div className={`w-14 h-14 ${t.itemBg} rounded-3xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform`}><Store size={26} /></div>
          <h3 className={`font-black text-2xl mb-3 ${t.heading}`}>Parts Store</h3>
          <p className={`text-sm ${t.muted}`}>Browse curated, ready-to-print utility parts.</p>
        </Link>

        <Link href="/catalogue" className={`w-full ${t.glassBg} p-8 md:p-10 rounded-[2.5rem] border ${t.glassBorder} hover:border-rose-500/30 transition-all group shadow-md`}>
          <div className={`w-14 h-14 ${t.itemBg} rounded-3xl flex items-center justify-center text-rose-500 mb-8 group-hover:scale-110 transition-transform`}><Layers size={26} /></div>
          <h3 className={`font-black text-2xl mb-3 ${t.heading}`}>Materials</h3>
          <p className={`text-sm ${t.muted}`}>Explore our filament catalogue.</p>
        </Link>
      </div>
      
      <div className={`w-full ${t.glassBg} p-8 md:p-10 rounded-[2.5rem] shadow-xl border ${t.glassBorder} text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8`}>
        <div>
          <h3 className={`font-black text-xl mb-2 tracking-tight ${t.heading}`}>Own a 3D printer?</h3>
          <p className={`text-sm ${t.muted} font-medium`}>Add your machine to the pool and earn money fulfilling jobs.</p>
        </div>
        <Link href="/partner" className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 shadow-lg transition-all w-full sm:w-auto border ${t.glassInnerBorder} ${t.heading} ${t.itemBg}`}>Register Partner</Link>
      </div>
    </div>
  );
}