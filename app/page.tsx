'use client';
import Link from 'next/link';
import { Search, Store, Layers } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-colors pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h3 className="font-black text-4xl md:text-5xl mb-4 tracking-tight leading-tight text-gray-900 dark:text-white">
              Turn pixels into <span className="text-orange-500">plastic.</span>
            </h3>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium">
              Upload your 3D files and get them printed by our decentralized network of premium partners.
            </p>
          </div>
          <Link href="/adjust" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 transition-all">
            Start Printing
          </Link>
        </div>
      </div>

      <div className="w-full grid md:grid-cols-3 gap-4 md:gap-6">
        {[
          { href: "/search", icon: <Search size={26} />, title: "Find Files", desc: "Search MakerWorld & Thingiverse directly.", color: "text-orange-500", hover: "hover:border-orange-500/30" },
          { href: "/store", icon: <Store size={26} />, title: "Parts Store", desc: "Browse curated, ready-to-print utility parts.", color: "text-blue-500", hover: "hover:border-blue-500/30" },
          { href: "/catalogue", icon: <Layers size={26} />, title: "Materials", desc: "Explore our filament catalogue and stats.", color: "text-rose-500", hover: "hover:border-rose-500/30" }
        ].map((card) => (
          <Link key={card.href} href={card.href} className={`w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 ${card.hover} hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all group flex flex-col justify-between`}>
            <div>
              <div className={`w-14 h-14 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center ${card.color} mb-8 border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform shadow-inner`}>
                {card.icon}
              </div>
              <h3 className="font-black text-2xl mb-3 text-gray-900 dark:text-white tracking-tight">{card.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className={`w-full bg-black/3 dark:bg-white/3 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-black/10 dark:border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-xl`}>
        <div>
          <h3 className={`font-black text-xl mb-2 tracking-tight text-gray-900 dark:text-white`}>Own a 3D printer?</h3>
          <p className={`text-sm text-gray-500 font-medium`}>Add your machine to the pool and earn money fulfilling jobs.</p>
        </div>
        <Link href="/partner" className="bg-black/5 dark:bg-white/5 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/10 shadow-lg transition-all w-full sm:w-auto border border-black/5 dark:border-white/5 text-gray-900 dark:text-white">Register Partner</Link>
      </div>
    </div>
  );
}