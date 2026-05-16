'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, ShoppingCart, User, ArrowLeft, Sun, Moon, Settings } from 'lucide-react';

// --- Shared Constants ---
const INITIAL_ADMINS = ['ethan.barnacoat@gmail.com'];
const SUPABASE_URL = 'https://xijtyfewiimfcwoodxlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanR5ZmV3aWltZmN3b29keGxxIiwicm9sZSI6ImFub24iLCJpYXQiIDoxNzY2NDcwODg0LCJleHAiIDoyMDgyMDQ2ODg0fQ.tc4usglFmTnLKJSEfw_KAdHCiltpykUtaBo9bhppdjw';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAphDjU-emPqD24ozf1RDG0u8L3DS-aXps';

// --- Types ---
interface CartItem {
  id: string;
  name: string;
  source: string;
  price: string;
  material: string;
  color: string;
  weight: number;
}

interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

interface SupabaseInstance {
  auth: {
    getSession: () => Promise<{ data: { session: { user: SupabaseUser } | null } }>;
    onAuthStateChange: (callback: (event: string, session: { user: SupabaseUser } | null) => void) => { data: { subscription: unknown } };
    signInWithPassword: (credentials: unknown) => Promise<{ error: Error | null }>;
    signUp: (credentials: unknown) => Promise<{ error: Error | null }>;
    signInWithOAuth: (options: unknown) => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
  };
}

const AppContext = createContext<{
  user: SupabaseUser | null;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  supabase: SupabaseInstance | null;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isGoogleLoaded: boolean;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within a ClientWrapper");
  return context;
};

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [supabase, setSupabase] = useState<SupabaseInstance | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      // Cast window to access the supabase global without 'any'
      const globalSupabase = (window as unknown as { supabase: { createClient: (u: string, k: string) => SupabaseInstance } }).supabase;
      const client = globalSupabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabase(client);
      
      client.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
      client.auth.onAuthStateChange((_event: string, session) => setUser(session?.user ?? null));
    };
    document.head.appendChild(script);

    const googleScript = document.createElement('script');
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    googleScript.async = true;
    googleScript.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(googleScript);
  }, []);

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
    <AppContext.Provider value={{ user, cart, setCart, supabase, isDarkMode, setIsDarkMode, isGoogleLoaded }}>
      <body className={`h-screen w-full ${t.bg} font-sans ${t.text} antialiased flex flex-col overflow-hidden relative transition-colors duration-500`}>
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none ${t.ambientMix}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none ${t.ambientMix}`} />

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
            <div className="flex items-center gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user?.email && INITIAL_ADMINS.includes(user.email) && (
                 <Link href="/admin" className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-full transition-colors">
                    <Settings size={20} />
                 </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative z-10">
          <div className="max-w-400 mx-auto px-4 sm:px-8 lg:px-12 w-full min-h-full flex flex-col pt-6 pb-64 text-gray-900 dark:text-white">
            {children}
          </div>
        </main>

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-105">
          <nav className={`${t.dockBg} backdrop-blur-2xl border ${t.glassBorder} p-3 rounded-[2.5rem] flex items-center justify-between px-5 transition-colors duration-500 shadow-2xl`}>
            <Link href="/" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/' ? activeBtnClass : inactiveBtnClass}`}>
              <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
            </Link>
            <Link href="/search" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/search' ? activeBtnClass : inactiveBtnClass}`}>
              <Search size={24} strokeWidth={pathname === '/search' ? 2.5 : 2} />
            </Link>
            <div className="relative -top-10 px-2">
              <Link href="/adjust" className={`flex items-center justify-center bg-orange-500 text-gray-950 p-5 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border-[6px] ${isDarkMode ? 'border-[#0a0a0a]' : 'border-[#f8fafc]'} active:scale-90 transition-transform`}>
                <Plus size={32} strokeWidth={3} />
              </Link>
            </div>
            <Link href="/cart" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/cart' ? activeBtnClass : inactiveBtnClass}`}>
              <ShoppingCart size={24} strokeWidth={pathname === '/cart' ? 2.5 : 2} />
              {cart.length > 0 && <span className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>}
            </Link>
            <Link href="/profile" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname.includes('/profile') ? activeBtnClass : inactiveBtnClass}`}>
              <User size={24} strokeWidth={pathname.includes('/profile') ? 2.5 : 2} />
            </Link>
          </nav>
        </div>
      </body>
    </AppContext.Provider>
  );
}