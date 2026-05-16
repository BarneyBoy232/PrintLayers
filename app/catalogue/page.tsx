'use client';
import { Zap } from 'lucide-react';

const FILAMENT_DATA = {
  "filaments": [
    { "id": "pla", "name": "PLA", "trait": "Best for Detail", "stats": { "strength": 6, "weather": 2, "flex": 1, "brittleness": 9, "heat": 2, "price": 2 } },
    { "id": "asa", "name": "ASA", "trait": "Best for Outdoors", "stats": { "strength": 7, "weather": 10, "flex": 3, "brittleness": 4, "heat": 8, "price": 4 } },
    { "id": "petg", "name": "PETG", "trait": "Best All-Rounder", "stats": { "strength": 7, "weather": 7, "flex": 4, "brittleness": 3, "heat": 5, "price": 3 } },
    { "id": "tpu-80a", "name": "TPU-80A", "trait": "Best for Flexibility", "stats": { "strength": 4, "weather": 8, "flex": 10, "brittleness": 1, "heat": 4, "price": 6 } },
    { "id": "pc", "name": "PC", "trait": "Best for Strength", "stats": { "strength": 10, "weather": 5, "flex": 3, "brittleness": 3, "heat": 9, "price": 8 } },
    { "id": "pp", "name": "PP", "trait": "Best for Chemicals", "stats": { "strength": 5, "weather": 9, "flex": 8, "brittleness": 1, "heat": 7, "price": 7 } },
    { "id": "pla-cf", "name": "PLA-CF", "trait": "Best Aesthetics", "stats": { "strength": 8, "weather": 2, "flex": 1, "brittleness": 10, "heat": 3, "price": 5 } },
    { "id": "nylon-gf", "name": "Nylon-GF", "trait": "Industrial Wear", "stats": { "strength": 9, "weather": 6, "flex": 5, "brittleness": 2, "heat": 9, "price": 9 } },
    { "id": "petg-cf", "name": "PETG-CF", "trait": "Mechanical Parts", "stats": { "strength": 8, "weather": 7, "flex": 3, "brittleness": 4, "heat": 6, "price": 5 } },
    { "id": "abs", "name": "ABS", "trait": "Impact Resistance", "stats": { "strength": 6, "weather": 4, "flex": 4, "brittleness": 3, "heat": 8, "price": 3 } },
    { "id": "pc-cf", "name": "PC-CF", "trait": "Zero-Warp Strength", "stats": { "strength": 10, "weather": 5, "flex": 2, "brittleness": 5, "heat": 9, "price": 10 } },
    { "id": "tpu-99d", "name": "TPU-99D", "trait": "Hard Rubber", "stats": { "strength": 7, "weather": 8, "flex": 6, "brittleness": 1, "heat": 6, "price": 7 } },
    { "id": "pp-gf", "name": "PP-GF", "trait": "Structural Tools", "stats": { "strength": 8, "weather": 9, "flex": 5, "brittleness": 2, "heat": 8, "price": 9 } }
  ]
};

export default function CataloguePage() {
  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-6 md:p-8 rounded-4xl border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="shrink-0 w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-500/30">
          <Zap size={32} />
        </div>
        <div className="relative z-10 text-gray-900 dark:text-white">
          <h4 className="font-black text-xl mb-2 uppercase tracking-tight">Quick Recommendation</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl font-medium">
            For 90% of everyday prints, <span className="text-orange-500 font-black">PLA</span> is your best choice (excellent detail). 
            For functional parts left outdoors or in hot cars, use <span className="text-orange-500 font-black">ASA</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {FILAMENT_DATA.filaments.map((f) => (
          <div key={f.id} className="bg-black/3 dark:bg-white/3 backdrop-blur-xl p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 flex flex-col shadow-xl hover:border-orange-500/30 transition-all group">
            <h4 className="font-black text-2xl tracking-tighter group-hover:text-orange-500 transition-colors text-gray-900 dark:text-white">{f.name}</h4>
            <p className="text-xs text-orange-400 font-bold italic mt-2 mb-6">{f.trait}</p>
            <div className="space-y-3 mt-auto bg-black/5 dark:bg-white/5 p-4 rounded-2xl shadow-inner border border-white/5">
               {Object.entries(f.stats).map(([k, v]) => (
                 <div key={k} className="flex items-center justify-between text-[9px] uppercase font-black">
                   <span className="text-gray-500 w-12">{k}</span>
                   <div className="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mx-2">
                     <div className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" style={{ width: `${v * 10}%` }}></div>
                   </div>
                   <span className="w-4 text-right text-gray-900 dark:text-white">{v}</span>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}