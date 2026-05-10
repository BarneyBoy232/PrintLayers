'use client';
import { Zap } from 'lucide-react';

const FILAMENT_DATA = {
  "filaments": [
    { "id": "pla", "name": "PLA", "trait": "Best for Detail", "stats": { "strength": 6, "weather": 2, "flex": 1, "heat": 2, "price": 2 } },
    { "id": "asa", "name": "ASA", "trait": "Best for Outdoors", "stats": { "strength": 7, "weather": 10, "flex": 3, "heat": 8, "price": 4 } },
    { "id": "petg", "name": "PETG", "trait": "Best All-Rounder", "stats": { "strength": 7, "weather": 7, "flex": 4, "heat": 5, "price": 3 } },
    { "id": "tpu", "name": "TPU", "trait": "Best for Flexibility", "stats": { "strength": 4, "weather": 8, "flex": 10, "heat": 4, "price": 6 } },
  ]
};

export default function CataloguePage() {
  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-6 md:p-8 rounded-4xl border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="shrink-0 w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-500/30">
          <Zap size={32} />
        </div>
        <div className="relative z-10">
          <h4 className="font-black text-xl mb-2 uppercase tracking-tight">Quick Recommendation</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            For 90% of everyday prints, <span className="text-orange-500 font-black">PLA</span> is your best choice (excellent detail & lowest price). 
            For functional parts left outdoors or in hot cars, use <span className="text-orange-500 font-black">ASA</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FILAMENT_DATA.filaments.map((f) => (
          <div key={f.id} className="bg-black/3 dark:bg-white/3 p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 flex flex-col shadow-xl hover:border-orange-500/30 transition-all group">
            <h4 className="font-black text-2xl tracking-tighter group-hover:text-orange-500 transition-colors">{f.name}</h4>
            <p className="text-xs text-orange-400 font-bold italic mt-2 mb-6">{f.trait}</p>
            <div className="space-y-3 mt-auto bg-black/5 dark:bg-white/5 p-4 rounded-2xl shadow-inner border border-white/5">
               {Object.entries(f.stats).map(([k, v]) => (
                 <div key={k} className="flex items-center justify-between text-[9px] uppercase font-black">
                   <span className="text-gray-500 w-12">{k}</span>
                   <div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mx-2">
                     <div className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" style={{ width: `${v * 10}%` }}></div>
                   </div>
                   <span className="w-4 text-right">{v}</span>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}