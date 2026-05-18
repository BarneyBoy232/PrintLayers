'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, ShoppingCart, User, ArrowLeft, Sun, Moon, Settings } from 'lucide-react';

// --- Type Safety Interfaces ---
export interface SupabaseUser {
  id: string;
  email?: string;
}

export interface CartItem {
  id: string;
  name: string;
  source: string;
  url?: string;
  price: string;
  material: string;
  color: string;
  weight: number;
}

export interface ThemeClasses {
  bg: string;
  text: string;
  heading: string;
  muted: string;
  glassBorder: string;
  glassInnerBorder: string;
  itemHover: string;
  dockBg: string;
  ambientMix: string;
}

// Google Maps Types
interface GooglePlace {
  formatted_address?: string;
}
interface GoogleAutocomplete {
  addListener: (event: string, handler: () => void) => void;
  getPlace: () => GooglePlace;
}
interface GoogleMapsWindow extends Window {
  google?: {
    maps: {
      places: {
        Autocomplete: new (input: HTMLInputElement, opts: unknown) => GoogleAutocomplete;
      };
    };
  };
}

// Supabase Types
interface AuthSession {
  user: SupabaseUser;
}
interface AuthChangeEvent {
  data: { subscription: { unsubscribe: () => void; }; };
}
interface SupabaseInstance {
  auth: {
    getSession: () => Promise<{ data: { session: AuthSession | null } }>;
    onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => AuthChangeEvent;
    signInWithPassword: (credentials: unknown) => Promise<{ error: Error | null }>;
    signUp: (credentials: unknown) => Promise<{ error: Error | null }>;
    signInWithOAuth: (options: unknown) => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
  };
}
interface SupabaseWindow extends Window {
  supabase?: {
    createClient: (url: string, key: string) => SupabaseInstance;
  };
}

interface AppContextType {
  user: SupabaseUser | null;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  supabase: SupabaseInstance | null;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isGoogleLoaded: boolean;
  userAddress: string;
  setUserAddress: React.Dispatch<React.SetStateAction<string>>;
  admins: string[];
  setAdmins: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within a ClientWrapper");
  return context;
};

export function AddressAutocomplete({ 
  t, 
  placeholder, 
  isLoaded, 
  onPlaceSelected, 
}: { 
  t: ThemeClasses; 
  placeholder: string; 
  isLoaded: boolean; 
  onPlaceSelected?: (address: string) => void; 
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const callbackRef = useRef(onPlaceSelected);

  useEffect(() => {
    callbackRef.current = onPlaceSelected;
  }, [onPlaceSelected]);

  useEffect(() => {
    const win = window as unknown as GoogleMapsWindow;
    if (!isLoaded || !inputRef.current || !win.google || autocompleteRef.current) return;
    
    autocompleteRef.current = new win.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address'],
      types: ['address']
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (callbackRef.current && place?.formatted_address) {
        callbackRef.current(place.formatted_address);
        if (inputRef.current) inputRef.current.value = place.formatted_address;
      }
    });
  }, [isLoaded]);

  return (
    <input 
      ref={inputRef} 
      type="text" 
      placeholder={placeholder} 
      // BUG FIX: Removed onChange to stop the app from saving every single keystroke,
      // which caused the app to constantly re-render and steal the typing cursor.
      className={`w-full bg-black/5 dark:bg-white/5 border ${t.glassInnerBorder} rounded-xl p-4 text-sm font-bold ${t.heading} outline-none focus:border-orange-500 transition-colors`} 
    />
  );
}

const INITIAL_ADMINS = ['ethan.barnacoat@gmail.com'];
// Environment Variables securely read from Vercel's Environment tab
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [supabase, setSupabase] = useState<SupabaseInstance | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [admins, setAdmins] = useState<string[]>(INITIAL_ADMINS);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Load Supabase dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      const win = window as unknown as SupabaseWindow;
      if (!win.supabase) return;
      const client = win.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabase(client);
      client.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
      client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    };
    document.head.appendChild(script);

    // Load Google Maps API
    const googleScript = document.createElement('script');
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    googleScript.async = true;
    googleScript.defer = true;
    googleScript.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(googleScript);
  }, []);

  const t: ThemeClasses = {
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
    <AppContext.Provider value={{ user, cart, setCart, supabase, isDarkMode, setIsDarkMode, isGoogleLoaded, userAddress, setUserAddress, admins, setAdmins }}>
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
            <div className="flex items-center gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user && admins.includes(user.email ?? '') && (
                <Link href="/admin" className="p-2 text-purple-500 hover:bg-purple-500/20 rounded-full transition-colors">
                  <Settings size={20} />
                </Link>
              )}
              {user ? (
                <button onClick={() => supabase?.auth.signOut()} className={`text-[10px] font-black uppercase tracking-widest ${t.muted} hover:text-red-500 transition-colors px-2`}>
                  Sign Out
                </button>
              ) : (
                pathname !== '/signin' && (
                  <Link href="/signin" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors px-2">
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative z-10">
          <div className="max-w-400 mx-auto px-4 sm:px-8 lg:px-12 w-full min-h-full flex flex-col pt-6 pb-64">
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
              <Link href="/adjust" className={`flex items-center justify-center bg-orange-500 text-gray-950 p-5 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border-[6px] ${isDarkMode ? 'border-[#0a0a0a]' : 'border-[#f8fafc]'} active:scale-90 transition-transform`}>
                <Plus size={32} strokeWidth={3} />
              </Link>
            </div>
            <Link href="/cart" className={`p-3.5 rounded-2xl flex flex-col items-center w-20 ${pathname === '/cart' ? activeBtnClass : inactiveBtnClass}`}>
              <ShoppingCart size={24} strokeWidth={pathname === '/cart' ? 2.5 : 2} />
              {cart.length > 0 && <span className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>}
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