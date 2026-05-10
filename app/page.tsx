'use client';
import Link from 'next/link';
import { Search, Store, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h3 className="font-black text-4xl md:text-5xl mb-4 tracking-tight leading-tight">
              Turn pixels into <span className="text-orange-500">plastic.</span>
            </h3>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              Upload your 3D files and get them printed by our decentralized network.
            </p>
          </div>
          <Link href="/adjust" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black shadow-lg hover:shadow-xl active:scale-95 transition-all">
            Start Printing
          </Link>
        </div>
      </div>

      <div className="w-full grid md:grid-cols-3 gap-4 md:gap-6">
        <Link href="/search" className="w-full bg-black/3 dark:bg-white/3 p-8 md:p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 hover:border-orange-500/30 transition-all group">
          <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform"><Search size={26} /></div>
          <h3 className="font-black text-2xl mb-3">Find Files</h3>
          <p className="text-sm text-gray-500">Search MakerWorld & Thingiverse directly.</p>
        </Link>
        
        <Link href="/store" className="w-full bg-black/3 dark:bg-white/3 p-8 md:p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 hover:border-blue-500/30 transition-all group">
          <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform"><Store size={26} /></div>
          <h3 className="font-black text-2xl mb-3">Parts Store</h3>
          <p className="text-sm text-gray-500">Browse curated, ready-to-print utility parts.</p>
        </Link>

        <Link href="/catalogue" className="w-full bg-black/3 dark:bg-white/3 p-8 md:p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 hover:border-rose-500/30 transition-all group">
          <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center text-rose-500 mb-8 group-hover:scale-110 transition-transform"><Layers size={26} /></div>
          <h3 className="font-black text-2xl mb-3">Materials</h3>
          <p className="text-sm text-gray-500">Explore our filament catalogue.</p>
        </Link>
      </div>
      
      <div className={`w-full bg-black/3 dark:bg-white/3 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-black/10 dark:border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8`}>
        <div>
          <h3 className={`font-black text-xl mb-2 tracking-tight`}>Own a 3D printer?</h3>
          <p className={`text-sm text-gray-500 font-medium`}>Add your machine to the pool and earn money fulfilling jobs.</p>
        </div>
        <Link href="/partner" className={`bg-black/5 dark:bg-white/5 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 shadow-lg transition-all w-full sm:w-auto border border-black/5 dark:border-white/5`}>Register Partner</Link>
      </div>
    </div>
  );
}