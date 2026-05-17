'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function SearchPage() {
  const { cart, setCart, isDarkMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [importUrl, setImportUrl] = useState('');

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;

    let parsedName = "Imported File";
    try {
      const parts = new URL(importUrl).pathname.split('/').filter(p => p);
      if (parts.length > 0) parsedName = parts[parts.length - 1].replace(/-/g, ' ');
    } catch {
      // Ignored
    }

    setCart([
      ...cart,
      {
        id: Math.random().toString(36).substring(2, 11),
        name: parsedName,
        source: importUrl.includes('makerworld') ? 'MakerWorld' : 'Thingiverse',
        price: 'Pending',
        material: 'Awaiting Quote',
        color: 'Default',
        weight: 0,
        url: importUrl
      }
    ]);
    setImportUrl('');
  };

  const t = {
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
  };

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex-1 flex flex-col justify-center ${t.glassBg} backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border ${t.glassBorder} shadow-2xl space-y-10 text-center relative overflow-hidden`}>
        <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
          <h3 className={`font-black text-2xl uppercase tracking-tight flex items-center justify-center gap-3 ${t.heading}`}>
            <Search className="text-orange-500" /> Search Repositories
          </h3>
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
              <Search size={22} />
            </div>
            <input type="text" placeholder="e.g. GoPro Mount..." className={`w-full pl-16 pr-6 py-6 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none font-bold text-lg focus:border-orange-500 transition-all shadow-inner ${t.heading}`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500/20 transition-all active:scale-95 shadow-inner">MakerWorld</button>
            <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500/20 transition-all active:scale-95 shadow-inner">Thingiverse</button>
          </div>
        </div>
      </div>

      <div className={`shrink-0 ${t.glassBg} backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-center relative overflow-hidden`}>
        <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
          <h3 className="font-black text-2xl uppercase tracking-tight text-orange-500">Import via URL</h3>
          <p className={`${t.muted} text-base font-medium`}>Found exactly what you need? Paste the link directly.</p>
          <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-4">
            <input type="url" required placeholder="https://..." className={`flex-1 px-8 py-5 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none font-bold text-base focus:border-orange-500 transition-all shadow-inner ${t.heading}`} value={importUrl} onChange={e => setImportUrl(e.target.value)} />
            <button type="submit" className="sm:w-auto w-full px-10 bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:bg-orange-400 active:scale-95 transition-all">Add to Cart</button>
          </form>
        </div>
      </div>
    </div>
  );
}