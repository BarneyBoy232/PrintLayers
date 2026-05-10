'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [importUrl, setImportUrl] = useState('');

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 flex flex-col justify-center bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-black/10 dark:border-white/10 shadow-2xl space-y-10 text-center relative overflow-hidden">
        <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
          <h3 className="font-black text-2xl uppercase tracking-tight flex items-center justify-center gap-3">
            <Search className="text-orange-500" /> Search Repositories
          </h3>
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
              <Search size={22} />
            </div>
            <input type="text" placeholder="e.g. GoPro Mount..." className="w-full pl-16 pr-6 py-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-bold text-lg focus:border-orange-500 transition-all shadow-inner" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500/20 transition-all active:scale-95">MakerWorld</button>
            <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500/20 transition-all active:scale-95">Thingiverse</button>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] shadow-2xl border border-black/10 dark:border-white/10 text-center relative overflow-hidden">
        <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
          <h3 className="font-black text-2xl uppercase tracking-tight text-orange-500">Import via URL</h3>
          <p className="text-gray-500 text-base font-medium">Found exactly what you need? Paste the link directly.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input type="url" required placeholder="https://..." className="flex-1 px-8 py-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-bold text-base focus:border-orange-500 transition-all shadow-inner" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
            <button type="submit" className="sm:w-auto w-full px-10 bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:bg-orange-400 active:scale-95 transition-all">Add to Cart</button>
          </form>
        </div>
      </div>
    </div>
  );
}