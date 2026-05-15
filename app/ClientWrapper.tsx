'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, Plus, ShoppingCart, User, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const t = {
    bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10',
    dockBg: isDarkMode ? 'bg-gray-900/80' : 'bg-white/80',
    ambientMix: isDarkMode ? 'mix-blend-screen' : 'mix-blend-normal',
  };

  const activeBtnClass = `text-orange-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} scale-110 shadow-inner`;
  const inactiveBtnClass = `${t.muted} ${isDarkMode ? 'hover:text-white hover:bg-white/5' : 'hover:text-gray-900 hover:bg-black/5'}`;

  return (
    <body className={`h-screen w-full ${t.bg} font-sans ${t.text} antialiased flex flex-col overflow-hidden relative selection:bg-orange-500/30 transition-colors duration-500`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none ${t.ambientMix}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none ${t.ambientMix}`} />

      {/* Header */}
      <header className={`shrink-0 px-6 py-5 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-2xl z-40 sticky top-0 border-b ${t.glassInnerBorder}`}>
        <div className="max-w-400 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {pathname !== '/' && (
              <Link href="/" className={`p-2 -ml-2 rounded-full ${t.itemHover} transition-colors ${t.muted}`}>
                <ArrowLeft size={20} />
              </Link>
            )}
            <h1 className={`text-2xl font-black tracking-tighter uppercase ${pathname === '/' ? `text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-400` : t.heading}`}>
              PrintLayers
            </h1>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative z-10">
        <div className="max-w-400 mx-auto px-4 sm:px-8 lg:px-12 w-full min-h-full flex flex-col pt-6 pb-64 text-gray-900 dark:text-white">
          {children}
        </div>
      </main>

      {/* Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-105">
        <nav className={`${t.dockBg} backdrop-blur-2xl border ${t.glassBorder} p-3 rounded-[2.5rem] flex items-center justify-between px-5 transition-colors duration-500 shadow-2xl`}>
          <Link href="/" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/' ? activeBtnClass : inactiveBtnClass}`}>
            <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
          </Link>
          <Link href="/search" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/search' ? activeBtnClass : inactiveBtnClass}`}>
            <Search size={24} strokeWidth={pathname === '/search' ? 2.5 : 2} />
          </Link>
          <div className="relative -top-10 px-2">
            <Link href="/adjust" className={`flex items-center justify-center bg-orange-500 text-gray-950 p-5 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border-[6px] ${isDarkMode ? 'border-[#0a0a0a]' : 'border-[#f8fafc]'} active:scale-90`}>
              <Plus size={32} strokeWidth={3} />
            </Link>
          </div>
          <Link href="/cart" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/cart' ? activeBtnClass : inactiveBtnClass}`}>
            <ShoppingCart size={24} strokeWidth={pathname === '/cart' ? 2.5 : 2} />
          </Link>
          <Link href="/profile" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname.includes('/profile') ? activeBtnClass : inactiveBtnClass}`}>
            <User size={24} strokeWidth={pathname.includes('/profile') ? 2.5 : 2} />
          </Link>
        </nav>
      </div>
    </body>
  );
}