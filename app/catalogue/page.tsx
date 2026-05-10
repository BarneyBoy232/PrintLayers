'use client';
import { Zap } from 'lucide-react';

const FILAMENTS = [
  { id: "pla", name: "PLA", type: "Basic", trait: "Best for Detail" },
  { id: "asa", name: "ASA", type: "Basic", trait: "Best for Outdoors" },
  { id: "petg", name: "PETG", type: "Basic", trait: "Best All-Rounder" },
];

export default function CataloguePage() {
  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-6 md:p-8 rounded-4xl border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="shrink-0 w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-500/30">
          <Zap size={32} />
        </div>
        <div className="relative z-10">
          <h4 className="font-black text-xl mb-2">Quick Recommendation</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            For 90% of everyday prints, <span className="text-orange-500 font-black">PLA</span> is your best choice (excellent detail & lowest price). 
            For functional parts left outdoors or in hot cars, use <span className="text-orange-500 font-black">ASA</span> (UV & high-heat resistant).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FILAMENTS.map((f) => (
          <div key={f.id} className="bg-black/3 dark:bg-white/3 p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 flex flex-col relative overflow-hidden">
            <h4 className="font-black text-2xl tracking-tight">{f.name}</h4>
            <p className="text-xs text-orange-400 font-bold italic mb-6">{f.trait}</p>
          </div>
        ))}
      </div>
    </div>
  );
}