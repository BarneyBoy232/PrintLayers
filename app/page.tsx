'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Home, Search, Plus, ShoppingCart, User, Settings, Store, ArrowLeft, Sun, Moon, Layers, Zap } from 'lucide-react';

const ADMIN_EMAIL = 'ethan.barnacoat@gmail.com';
const SUPABASE_URL = 'https://xijtyfewiimfcwoodxlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanR5ZmV3aWltZmN3b29keGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NzA4ODQsImV4cCI6MjA4MjA0Njg4NH0.tc4usglFmTnLKJSEfw_KAdHCiltpykUtaBo9bhppdjw';

interface SupabaseUser {
  id: string;
  email?: string;
}

interface CartItem {
  id: string;
  name: string;
  source: string;
  url?: string;
  price: string;
  material: string;
  color: string;
  weight: number;
}

type View = 'home' | 'search' | 'adjust' | 'store' | 'partner' | 'signin' | 'cart' | 'admin' | 'profile' | 'catalogue';

const PARTNER_FILAMENTS: Record<string, string[]> = {}; 

const FILAMENT_DATA = {
  "filaments": [
    { "id": "pla", "name": "PLA", "type": "Basic", "trait": "Best for Detail", "stats": { "strength": 6, "weather": 2, "flex": 1, "brittleness": 9, "heat_resist": 2, "price": 2 } },
    { "id": "asa", "name": "ASA", "type": "Basic", "trait": "Best for Outdoors", "stats": { "strength": 7, "weather": 10, "flex": 3, "brittleness": 4, "heat_resist": 8, "price": 4 } },
    { "id": "petg", "name": "PETG", "type": "Basic", "trait": "Best All-Rounder", "stats": { "strength": 7, "weather": 7, "flex": 4, "brittleness": 3, "heat_resist": 5, "price": 3 } },
    { "id": "tpu-80a", "name": "TPU-80A", "type": "Basic", "trait": "Best for Flexibility", "stats": { "strength": 4, "weather": 8, "flex": 10, "brittleness": 1, "heat_resist": 4, "price": 6 } },
    { "id": "pc", "name": "PC", "type": "Certified", "trait": "Best for Strength", "stats": { "strength": 10, "weather": 5, "flex": 3, "brittleness": 3, "heat_resist": 9, "price": 8 } },
    { "id": "pp", "name": "PP", "type": "Certified", "trait": "Best for Chemicals", "stats": { "strength": 5, "weather": 9, "flex": 8, "brittleness": 1, "heat_resist": 7, "price": 7 } },
    { "id": "pla-cf", "name": "PLA-CF", "type": "Basic", "trait": "Best Aesthetics", "stats": { "strength": 8, "weather": 2, "flex": 1, "brittleness": 10, "heat_resist": 3, "price": 5 } },
    { "id": "nylon-gf", "name": "Nylon-GF", "type": "Certified", "trait": "Industrial Wear", "stats": { "strength": 9, "weather": 6, "flex": 5, "brittleness": 2, "heat_resist": 9, "price": 9 } },
    { "id": "petg-cf", "name": "PETG-CF", "type": "Basic", "trait": "Mechanical Parts", "stats": { "strength": 8, "weather": 7, "flex": 3, "brittleness": 4, "heat_resist": 6, "price": 5 } },
    { "id": "abs", "name": "ABS", "type": "Basic", "trait": "Impact Resistance", "stats": { "strength": 6, "weather": 4, "flex": 4, "brittleness": 3, "heat_resist": 8, "price": 3 } },
    { "id": "pc-cf", "name": "PC-CF", "type": "Certified", "trait": "Zero-Warp Strength", "stats": { "strength": 10, "weather": 5, "flex": 2, "brittleness": 5, "heat_resist": 9, "price": 10 } },
    { "id": "tpu-99d", "name": "TPU-99D", "type": "Basic", "trait": "Hard Rubber", "stats": { "strength": 7, "weather": 8, "flex": 6, "brittleness": 1, "heat_resist": 6, "price": 7 } },
    { "id": "pp-gf", "name": "PP-GF", "type": "Certified", "trait": "Structural Tools", "stats": { "strength": 8, "weather": 9, "flex": 5, "brittleness": 2, "heat_resist": 8, "price": 9 } }
  ],
  "metadata": {
    "reinforcements": {
      "CF": { "full_name": "Carbon Fiber", "benefits": "Increased rigidity, reduced warping, premium matte finish", "hardware_requirement": "Hardened Steel Nozzle" },
      "GF": { "full_name": "Glass Fiber", "benefits": "Dimensional stability, improved impact resistance (less brittle than CF)", "hardware_requirement": "Hardened Steel Nozzle" }
    },
    "naming_conventions": {
      "TPU_Shore_Hardness": {
        "Scale_A": "Measures flexible/soft rubbers (e.g., 80A is soft like a shoe sole)",
        "Scale_D": "Measures hard rubbers/soft plastics (e.g., 99D is rigid like a shopping cart wheel)",
        "logic": "Higher numbers = harder material; A is softer than D"
      },
      "Price_Scale": { "logic": "1 = Budget/Entry-level; 10 = Premium/Industrial Expense" }
    }
  }
};

const BEST_STATS = {
  strength: Math.max(...FILAMENT_DATA.filaments.map(f => f.stats.strength)),
  weather: Math.max(...FILAMENT_DATA.filaments.map(f => f.stats.weather)),
  flex: Math.max(...FILAMENT_DATA.filaments.map(f => f.stats.flex)),
  brittleness: Math.min(...FILAMENT_DATA.filaments.map(f => f.stats.brittleness)),
  heat_resist: Math.max(...FILAMENT_DATA.filaments.map(f => f.stats.heat_resist)),
  price: Math.min(...FILAMENT_DATA.filaments.map(f => f.stats.price)),
};

// --- Future Partner Certification Logic (Currently Dormant) ---
// These thresholds dictate when a partner upgrades from printing "Basic" to "Certified" filaments.
const CERTIFICATION_REQUIREMENTS = {
  minTotalPrints: 50,      // Minimum successful prints fulfilled
  minTotalHours: 150,      // Minimum total print hours logged
  minAverageRating: 4.7    // Minimum required customer rating (out of 5)
};

// Types for future partner stats integration
interface PartnerStats {
  totalPrints: number;
  totalHours: number;
  averageRating: number;
  isManuallyCertified?: boolean; // Admin override
}

// Helper to evaluate if a partner has unlocked "Certified" filaments. Not yet bound to UI.
export const checkPartnerCertification = (stats?: PartnerStats): boolean => {
  if (!stats) return false;
  if (stats.isManuallyCertified) return true;
  
  return (
    stats.totalPrints >= CERTIFICATION_REQUIREMENTS.minTotalPrints &&
    stats.totalHours >= CERTIFICATION_REQUIREMENTS.minTotalHours &&
    stats.averageRating >= CERTIFICATION_REQUIREMENTS.minAverageRating
  );
};
// --------------------------------------------------------------

const useTheme = (isDark: boolean) => ({
  bg: isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]',
  text: isDark ? 'text-gray-100' : 'text-gray-800',
  heading: isDark ? 'text-white' : 'text-gray-900',
  muted: isDark ? 'text-gray-400' : 'text-gray-500',
  glassBg: isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
  glassBorder: isDark ? 'border-white/10' : 'border-black/10',
  glassPanel: isDark ? 'bg-black/40' : 'bg-white/60',
  glassInnerBorder: isDark ? 'border-white/5' : 'border-black/5',
  itemBg: isDark ? 'bg-white/5' : 'bg-black/5',
  itemHover: isDark ? 'hover:bg-white/10' : 'hover:bg-black/10',
  inputBg: isDark ? 'bg-black/50' : 'bg-white/50',
  dockBg: isDark ? 'bg-gray-900/80' : 'bg-white/80',
  ambientMix: isDark ? 'mix-blend-screen' : 'mix-blend-normal',
  headerGradient: isDark ? 'from-orange-400 to-amber-400' : 'from-orange-500 to-amber-500',
});

function ThreeDViewer({ file, onClear, onAddToCart, t, isDarkMode }: { file: File, onClear: () => void, onAddToCart: (config: any) => void, t: any, isDarkMode: boolean }) {
  const [weight, setWeight] = useState<number>(0);
  const [material, setMaterial] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  const handleAdd = () => {
    onAddToCart({ price: "Pending", material, color, weight });
  };

  return (
    <div className="w-full h-full animate-in zoom-in-95 duration-500 flex flex-col">
      <div className={`w-full flex-1 min-h-[500px] ${t.glassBg} backdrop-blur-2xl rounded-[3rem] overflow-hidden relative border ${t.glassBorder} shadow-2xl flex flex-col`}>
        {!showConfig ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
              <svg className="w-12 h-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h2 className={`${t.heading} text-3xl font-black tracking-tighter uppercase mb-3`}>{file.name}</h2>
            <p className={`${t.muted} max-w-md mx-auto leading-relaxed text-sm`}>File successfully loaded into the viewer. Ready for parameter configuration.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button onClick={() => setShowConfig(true)} className="flex-1 bg-orange-500 hover:bg-orange-400 text-gray-950 py-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">Configure Print</button>
              <button onClick={onClear} className={`flex-1 ${t.itemBg} ${t.itemHover} ${t.heading} py-4 rounded-2xl font-bold transition-all border ${t.glassBorder}`}>Clear File</button>
            </div>
          </div>
        ) : (
          <div className={`absolute inset-0 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 ${t.glassPanel} backdrop-blur-xl`}>
            <div className={`flex-1 rounded-[2rem] bg-gradient-to-br from-orange-500/10 to-transparent border ${t.glassInnerBorder} flex items-center justify-center text-orange-500/50 font-black text-2xl tracking-widest shadow-inner`}>
              3D PREVIEW ENGINE
            </div>
            <div className="w-full md:w-96 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4 flex-1">
                <h3 className={`${t.heading} font-black uppercase text-xs tracking-[0.2em] border-b ${t.glassInnerBorder} pb-3 flex items-center gap-2`}>
                  <Settings size={14} className="text-orange-500" /> Print Config
                </h3>
                
                <div className={`space-y-4 p-5 ${t.itemBg} rounded-[1.5rem] border ${t.glassInnerBorder}`}>
                  <div>
                    <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2`}>Search Material</label>
                    <input type="text" disabled placeholder="Awaiting Partners..." className={`w-full ${t.inputBg} border ${t.glassBorder} rounded-xl p-3.5 ${t.heading} text-xs outline-none opacity-50 cursor-not-allowed focus:border-orange-500 transition-colors`} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2`}>Available Colors</label>
                    <div className={`w-full ${isDarkMode ? 'bg-black/30' : 'bg-black/5'} border ${t.glassInnerBorder} rounded-xl p-3.5 ${t.muted} text-xs italic opacity-50 cursor-not-allowed`}>Requires Material Selection</div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2 pl-1`}>Estimated Weight (g)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={`w-full ${t.itemBg} border ${t.glassBorder} rounded-[1.5rem] p-4 ${t.heading} font-bold outline-none focus:border-orange-500 transition-colors shadow-inner`} />
                </div>
              </div>
              
              <div className={`p-5 bg-orange-500/10 border border-orange-500/20 rounded-[1.5rem] relative overflow-hidden flex-shrink-0`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 blur-2xl"></div>
                <p className="text-[10px] font-black text-orange-500 uppercase mb-1 relative z-10">Quote Status</p>
                <p className={`${t.heading} text-2xl font-black relative z-10`}>PENDING</p>
              </div>
              <div className={`space-y-3 pt-4 border-t ${t.glassInnerBorder} flex-shrink-0`}>
                <button onClick={handleAdd} className="w-full bg-orange-500 text-gray-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95">Add to Cart</button>
                <button onClick={() => setShowConfig(false)} className={`w-full ${t.itemBg} ${t.itemHover} ${t.muted} hover:${t.heading} py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95`}>Back to Viewer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [supabase, setSupabase] = useState<any>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [authError, setAuthError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const isInitialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authListenerRef = useRef<any>(null);

  const t = useTheme(isDarkMode);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      const client = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabase(client);
      client.auth.getSession().then(({ data: { session } }: any) => { setUser(session?.user ?? null); setLoading(false); });
      const { data: { subscription } } = client.auth.onAuthStateChange((event: string, session: any) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (event === 'SIGNED_IN' && currentUser) { setAuthSubmitting(false); setAuthError(null); setCurrentView('home'); }
        if (event === 'SIGNED_OUT') setCurrentView('home');
      });
      authListenerRef.current = subscription;
    };
    document.head.appendChild(script);
    return () => { if (authListenerRef.current) authListenerRef.current.unsubscribe(); };
  }, []);

  const updateCartItem = (id: string, updates: Partial<CartItem>) => setCart(cart.map(item => item.id === id ? { ...item, ...updates } : item));

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (isSignUpMode && password !== confirmPassword) { setAuthError("Passwords do not match."); return; }
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      if (isSignUpMode) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthError("Check your email for confirmation!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) { setAuthError(err.message || "Auth error occurred."); setAuthSubmitting(false); }
  };

  const handleOAuthSignIn = async () => {
    if (!supabase) return;
    setAuthSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }});
      if (error) throw error;
    } catch (err: any) { setAuthError(err.message || "Google OAuth failed."); setAuthSubmitting(false); }
  };

  const navigateTo = (view: View) => {
    if (view === 'admin' && user?.email !== ADMIN_EMAIL) { setAuthError("Access Denied: Admins Only."); return; }
    // Enforce authentication for protected routes
    if (!user && !['home', 'search', 'store', 'signin', 'catalogue'].includes(view)) { 
      setCurrentView('signin'); 
      return; 
    }
    setCurrentView(view);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;
    let name = "Imported Model";
    try {
      const pathParts = new URL(importUrl).pathname.split('/').filter(p => p);
      if (pathParts.length > 0) name = pathParts[pathParts.length - 1].replace(/-/g, ' ');
    } catch (e) {}
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), name, source: importUrl.includes('makerworld') ? 'MakerWorld' : 'Thingiverse', url: importUrl, price: 'Pending', material: '', color: '', weight: 0 }]);
    setImportUrl('');
    setCurrentView('cart');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleAddToCartFromConfig = (config: { price: string, material: string, color: string, weight: number }) => {
    if (!uploadedFile) return;
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), name: uploadedFile.name, source: 'Direct Upload', ...config }]);
    setUploadedFile(null);
    setCurrentView('cart');
  };

  if (loading) return <div className={`h-screen w-screen flex items-center justify-center ${t.bg}`}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'home': return 'PrintLayers';
      case 'search': return 'Discover';
      case 'adjust': return 'Configure';
      case 'store': return 'Parts Store';
      case 'cart': return 'Quote Request';
      case 'partner': return 'Partner Network';
      case 'signin': return 'Authentication';
      case 'admin': return 'Admin Panel';
      case 'profile': return 'Profile';
      case 'catalogue': return 'Materials';
      default: return 'PrintLayers';
    }
  };

  const activeBtnClass = `text-orange-500 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} scale-110 shadow-inner`;
  const inactiveBtnClass = `${t.muted} ${isDarkMode ? 'hover:text-white hover:bg-white/5' : 'hover:text-gray-900 hover:bg-black/5'}`;

  return (
    <div className={`h-screen w-full ${t.bg} font-sans ${t.text} antialiased flex flex-col overflow-hidden relative selection:bg-orange-500/30 transition-colors duration-500`}>
      
      {/* Ambient Background Effects */}
      <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none ${t.ambientMix} transition-all duration-700`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none ${t.ambientMix} transition-all duration-700`} />
      <div className={`absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-amber-600/15 rounded-full blur-[100px] pointer-events-none ${t.ambientMix} transition-all duration-700`} />

      {/* Dynamic App Header */}
      <header className={`flex-shrink-0 px-6 py-5 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-2xl z-40 sticky top-0 border-b ${t.glassInnerBorder}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'home' && (
              <button onClick={() => setCurrentView('home')} className={`p-2 -ml-2 rounded-full ${t.itemHover} transition-colors ${t.muted} hover:${t.heading}`}>
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className={`text-2xl font-black tracking-tighter uppercase ${currentView === 'home' ? `text-transparent bg-clip-text bg-gradient-to-r ${t.headerGradient}` : t.heading}`}>
              {getHeaderTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-orange-400 hover:bg-orange-500/20' : 'text-orange-600 hover:bg-orange-500/20'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user?.email === ADMIN_EMAIL && (
              <button onClick={() => setCurrentView('admin')} className="p-2 text-purple-500 hover:bg-purple-500/20 rounded-full transition-colors">
                <Settings size={20} />
              </button>
            )}
            {user ? (
              <button onClick={() => supabase.auth.signOut()} className={`text-[10px] font-black uppercase tracking-widest ${t.muted} hover:text-red-500 transition-colors px-2`}>
                Sign Out
              </button>
            ) : (
              currentView !== 'signin' && (
                <button onClick={() => navigateTo('signin')} className={`text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors px-2`}>
                  Sign In
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative z-10">
        {/* pb-64 ensures the dock NEVER covers the bottom content and leaves a large visual gap */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 w-full min-h-full flex flex-col pt-6 pb-64">
          
          {currentView === 'signin' && (
            <div className="flex-1 flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
              <div className={`w-full max-w-md ${t.glassBg} backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-center relative overflow-hidden`}>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${t.itemBg} rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-orange-500 border ${t.glassInnerBorder} shadow-inner`}>
                    <User size={32} />
                  </div>
                  <h2 className={`text-3xl font-black ${t.heading} mb-2`}>{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
                  <p className={`${t.muted} font-bold text-xs uppercase tracking-widest mb-8`}>{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
                  {authError && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl">{String(authError)}</div>}
                  <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                    <input type="email" placeholder="Email Address" required className={`w-full px-5 py-4 rounded-2xl ${t.glassPanel} border ${t.glassInnerBorder} outline-none focus:border-orange-500 ${t.heading} placeholder-${isDarkMode ? 'gray-600' : 'gray-400'} text-sm font-medium transition-all shadow-inner`} value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className={`w-full px-5 py-4 rounded-2xl ${t.glassPanel} border ${t.glassInnerBorder} outline-none focus:border-orange-500 ${t.heading} placeholder-${isDarkMode ? 'gray-600' : 'gray-400'} text-sm font-medium transition-all shadow-inner`} value={password} onChange={e => setPassword(e.target.value)} />
                    {isSignUpMode && <input type="password" placeholder="Confirm Password" required className={`w-full px-5 py-4 rounded-2xl ${t.glassPanel} border ${t.glassInnerBorder} outline-none focus:border-orange-500 ${t.heading} placeholder-${isDarkMode ? 'gray-600' : 'gray-400'} text-sm font-medium transition-all shadow-inner`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
                    <button type="submit" disabled={authSubmitting} className="w-full bg-orange-500 text-gray-950 py-4.5 rounded-2xl font-black shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:bg-orange-400 transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95 mt-2">{authSubmitting ? '...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}</button>
                  </form>
                  <button onClick={handleOAuthSignIn} disabled={authSubmitting} className={`mt-4 w-full flex items-center justify-center gap-3 ${t.itemBg} border ${t.glassInnerBorder} py-4 rounded-2xl font-bold ${t.heading} ${t.itemHover} transition-all active:scale-95 text-sm`}>Continue with Google</button>
                  <div className={`mt-8 pt-6 border-t ${t.glassInnerBorder}`}><button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-orange-500 uppercase tracking-wider transition-colors hover:text-orange-400">{isSignUpMode ? 'Back to Sign In' : "Join Network"}</button></div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'profile' && user && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`w-full max-w-2xl ${t.glassBg} backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-center relative overflow-hidden`}>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${t.itemBg} rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-orange-500 border ${t.glassInnerBorder} shadow-inner`}>
                    <User size={40} />
                  </div>
                  <h2 className={`text-3xl font-black ${t.heading} mb-2`}>Your Account</h2>
                  <p className={`${t.muted} mb-10`}>{user.email}</p>
                  
                  <div className="space-y-6 text-left">
                    <div className={`p-6 md:p-8 ${t.glassPanel} rounded-[2rem] border ${t.glassInnerBorder} shadow-inner`}>
                      <h4 className={`font-black ${t.heading} text-lg mb-2`}>Network Status</h4>
                      <p className={`text-sm ${t.muted} mb-6`}>You are currently using PrintLayers as a customer. Become a partner to receive jobs and earn.</p>
                      <button onClick={() => navigateTo('partner')} className="w-full sm:w-auto bg-orange-500 text-gray-950 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">Register a Printer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'home' && (
            <div className="w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
              <div className={`w-full ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-10 md:p-12 border ${t.glassBorder} shadow-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-colors duration-700 pointer-events-none"></div>
                <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="max-w-2xl">
                    <h3 className={`font-black text-4xl md:text-5xl mb-4 tracking-tight ${t.heading} leading-tight`}>Turn pixels into <span className={`text-transparent bg-clip-text bg-gradient-to-r ${t.headerGradient}`}>plastic.</span></h3>
                    <p className={`${t.muted} text-base md:text-lg leading-relaxed`}>Upload your 3D files and get them printed by our decentralized network of premium partners.</p>
                  </div>
                  <button onClick={() => navigateTo('adjust')} className="relative z-10 whitespace-nowrap bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] active:scale-95 transition-all w-full md:w-auto">Start Printing</button>
                </div>
              </div>

              <div className="w-full grid md:grid-cols-3 gap-4 md:gap-6">
                <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-lg border ${t.glassBorder} hover:border-orange-500/30 ${t.itemHover} active:scale-[0.98] transition-all cursor-pointer group flex flex-col justify-between`} onClick={() => navigateTo('search')}>
                  <div>
                    <div className={`w-14 h-14 ${t.itemBg} rounded-[1.5rem] flex items-center justify-center text-orange-500 mb-8 border ${t.glassInnerBorder} group-hover:scale-110 transition-transform shadow-inner`}><Search size={26} /></div>
                    <h3 className={`font-black text-2xl ${t.heading} mb-3 tracking-tight`}>Find Files</h3>
                    <p className={`text-sm ${t.muted} leading-relaxed font-medium`}>Search repositories like MakerWorld & Thingiverse directly from the app.</p>
                  </div>
                </div>
                
                <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-lg border ${t.glassBorder} hover:border-blue-500/30 ${t.itemHover} active:scale-[0.98] transition-all cursor-pointer group flex flex-col justify-between`} onClick={() => navigateTo('store')}>
                  <div>
                    <div className={`w-14 h-14 ${t.itemBg} rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-8 border ${t.glassInnerBorder} group-hover:scale-110 transition-transform shadow-inner`}><Store size={26} /></div>
                    <h3 className={`font-black text-2xl ${t.heading} mb-3 tracking-tight`}>Parts Store</h3>
                    <p className={`text-sm ${t.muted} leading-relaxed font-medium`}>Browse curated, ready-to-print utility parts and popular models.</p>
                  </div>
                </div>

                <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-lg border ${t.glassBorder} hover:border-rose-500/30 ${t.itemHover} active:scale-[0.98] transition-all cursor-pointer group flex flex-col justify-between`} onClick={() => navigateTo('catalogue')}>
                  <div>
                    <div className={`w-14 h-14 ${t.itemBg} rounded-[1.5rem] flex items-center justify-center text-rose-500 mb-8 border ${t.glassInnerBorder} group-hover:scale-110 transition-transform shadow-inner`}><Layers size={26} /></div>
                    <h3 className={`font-black text-2xl ${t.heading} mb-3 tracking-tight`}>Materials</h3>
                    <p className={`text-sm ${t.muted} leading-relaxed font-medium`}>Explore our filament catalogue and compare mechanical properties.</p>
                  </div>
                </div>
              </div>

              <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-xl border ${t.glassBorder} text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8`}>
                <div>
                  <h3 className={`font-black text-xl ${t.heading} mb-2 tracking-tight`}>Own a 3D printer?</h3>
                  <p className={`text-sm ${t.muted} font-medium`}>Add your machine to the pool and earn money fulfilling jobs.</p>
                </div>
                <button onClick={() => navigateTo('partner')} className={`${t.itemBg} ${t.heading} px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest ${t.itemHover} shadow-lg transition-all w-full sm:w-auto border ${t.glassInnerBorder}`}>Register Partner</button>
              </div>
            </div>
          )}

          {currentView === 'catalogue' && (
            <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Quick Recommendation Banner */}
              <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex-shrink-0 w-16 h-16 bg-orange-500/20 rounded-[1.5rem] flex items-center justify-center text-orange-500 border border-orange-500/30">
                  <Zap size={32} />
                </div>
                <div className="relative z-10">
                  <h4 className={`font-black text-xl ${t.heading} mb-2`}>Quick Recommendation</h4>
                  <p className={`${t.muted} text-sm leading-relaxed max-w-3xl`}>
                    For 90% of everyday prints, <span className="text-orange-500 font-black">PLA</span> is your best choice (excellent detail & lowest price). 
                    For functional parts left outdoors or in hot cars, use <span className="text-orange-500 font-black">ASA</span> (UV & high-heat resistant). 
                    For most users, these are the only two filaments you'll ever need.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {FILAMENT_DATA.filaments.map((f) => {
                  const isTopPick = f.id === 'pla' || f.id === 'asa';
                  const isAvailable = ['pla', 'asa', 'petg'].includes(f.id);

                  return (
                    <div key={f.id} className={`${t.glassBg} backdrop-blur-xl p-8 rounded-[2.5rem] border ${isTopPick ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : t.glassBorder} ${isAvailable ? 'hover:shadow-xl transition-shadow' : 'opacity-60'} flex flex-col relative overflow-hidden`}>
                      {isTopPick && (
                        <div className="absolute top-0 right-0 bg-orange-500 text-gray-950 text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-2xl z-10 shadow-md">
                          Top Pick
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <h4 className={`font-black text-2xl ${t.heading} tracking-tight`}>{f.name}</h4>
                        {!isAvailable && (
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${t.itemBg} ${t.muted} border ${t.glassInnerBorder}`}>
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${isTopPick ? 'text-orange-400' : t.muted} font-bold italic mb-6 relative z-10`}>{f.trait}</p>
                      
                      <div className={`space-y-3 mt-auto p-5 rounded-[1.5rem] ${t.glassPanel} border ${t.glassInnerBorder} shadow-inner relative z-10`}>
                        {Object.entries(f.stats).map(([key, val]) => {
                          const isHighlighted = val === BEST_STATS[key as keyof typeof BEST_STATS];
                          return (
                            <div key={key} className="flex items-center justify-between gap-3 text-[10px]">
                              <span className={`${isHighlighted ? 'text-orange-500 font-black' : t.muted + ' font-bold'} w-20 uppercase tracking-wider truncate`}>{key.replace('_', ' ')}</span>
                              <div className={`flex-1 h-1.5 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden`}>
                                <div className={`h-full ${isHighlighted ? 'bg-gradient-to-r from-orange-400 to-rose-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-orange-500/50'} rounded-full`} style={{ width: `${(val as number) * 10}%` }}></div>
                              </div>
                              <span className={`${isHighlighted ? 'text-orange-500' : t.heading} font-black w-4 text-right`}>{val as number}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border ${t.glassBorder} shadow-xl`}>
                <h3 className={`font-black text-2xl ${t.heading} mb-8 tracking-tight flex items-center gap-3`}><Layers className="text-orange-500" /> Material Additives & Guides</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className={`p-6 ${t.glassPanel} rounded-[2rem] border ${t.glassInnerBorder} shadow-inner`}>
                    <h4 className={`font-black text-lg ${t.heading} mb-4`}>Reinforcements</h4>
                    {Object.entries(FILAMENT_DATA.metadata.reinforcements).map(([key, data]) => (
                      <div key={key} className="mb-4 last:mb-0">
                        <p className={`text-sm font-black ${t.heading} mb-1`}>{key} - {data.full_name}</p>
                        <p className={`text-xs ${t.muted} leading-relaxed`}>{data.benefits}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`p-6 ${t.glassPanel} rounded-[2rem] border ${t.glassInnerBorder} shadow-inner`}>
                    <h4 className={`font-black text-lg ${t.heading} mb-4`}>Naming Conventions</h4>
                    <div className="mb-4">
                      <p className={`text-sm font-black ${t.heading} mb-1`}>TPU Hardness</p>
                      <p className={`text-xs ${t.muted} leading-relaxed mb-1`}>{FILAMENT_DATA.metadata.naming_conventions.TPU_Shore_Hardness.Scale_A}</p>
                      <p className={`text-xs ${t.muted} leading-relaxed`}>{FILAMENT_DATA.metadata.naming_conventions.TPU_Shore_Hardness.Scale_D}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'store' && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`flex-1 ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-12 text-center border ${t.glassBorder} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className={`w-28 h-28 ${t.itemBg} rounded-[2rem] flex items-center justify-center mb-8 border ${t.glassInnerBorder} ${t.muted} shadow-inner relative z-10`}>
                  <Store size={48} strokeWidth={1.5} />
                </div>
                <h3 className={`text-3xl font-black ${t.heading} mb-4 uppercase tracking-tight relative z-10`}>Store is Empty</h3>
                <p className={`${t.muted} font-medium text-base max-w-md mx-auto leading-relaxed relative z-10`}>Popular and highly purchased prints will automatically appear here as the network grows.</p>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="flex-1 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`flex-1 flex flex-col justify-center ${t.glassBg} backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border ${t.glassBorder} shadow-2xl space-y-10 text-center relative overflow-hidden`}>
                <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
                  <h3 className={`font-black text-2xl ${t.heading} uppercase tracking-tight flex items-center justify-center gap-3`}>
                    <Search className="text-orange-500" /> Search Repositories
                  </h3>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                      <Search size={22} />
                    </div>
                    <input type="text" placeholder="e.g. GoPro Mount..." className={`w-full pl-16 pr-6 py-6 rounded-2xl ${t.inputBg} border ${t.glassInnerBorder} outline-none font-bold ${t.heading} text-lg placeholder-${isDarkMode ? 'gray-600' : 'gray-400'} focus:border-orange-500 transition-all shadow-inner`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className={`flex-1 py-5 bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-500/20 transition-all active:scale-95`}>MakerWorld</button>
                    <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className={`flex-1 py-5 bg-blue-500/10 text-blue-500 border border-blue-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500/20 transition-all active:scale-95`}>Thingiverse</button>
                  </div>
                </div>
              </div>

              <div className={`flex-shrink-0 ${t.glassBg} backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-center relative overflow-hidden`}>
                <div className="max-w-2xl w-full mx-auto space-y-8 relative z-10">
                  <h3 className={`font-black text-2xl uppercase tracking-tight text-orange-500`}>Import via URL</h3>
                  <p className={`${t.muted} text-base font-medium`}>Found exactly what you need? Paste the link directly.</p>
                  <form onSubmit={handleImport} className="flex flex-col sm:flex-row gap-4">
                    <input type="url" required placeholder="https://..." className={`flex-1 px-8 py-5 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none font-bold text-base placeholder-${isDarkMode ? 'gray-600' : 'gray-400'} ${t.heading} focus:border-orange-500 transition-all shadow-inner`} value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                    <button type="submit" className="sm:w-auto w-full px-10 bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:bg-orange-400 active:scale-95 transition-all">Add to Cart</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {currentView === 'adjust' && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!uploadedFile ? (
                <div onClick={() => fileInputRef.current?.click()} className={`flex-1 group w-full border-[3px] border-dashed ${isDarkMode ? 'border-white/10' : 'border-black/10'} rounded-[3rem] ${t.itemBg} backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-orange-500/50 ${t.itemHover} transition-all duration-500`}>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
                  <div className={`w-28 h-28 ${t.glassBg} rounded-[2rem] flex items-center justify-center mb-8 border ${t.glassInnerBorder} group-hover:scale-110 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-500 shadow-inner`}>
                    <Plus size={48} className={`${t.muted} group-hover:text-orange-500 transition-colors`} />
                  </div>
                  <h3 className={`text-3xl font-black ${t.heading} mb-3 uppercase tracking-tighter group-hover:text-orange-500 transition-colors`}>Drop 3D File Here</h3>
                  <p className={`${t.muted} font-medium text-sm tracking-wide`}>Supports .STL, .3MF, .STEP</p>
                </div>
              ) : ( 
                <div className="flex-1 flex flex-col"><ThreeDViewer file={uploadedFile} onClear={() => setUploadedFile(null)} onAddToCart={handleAddToCartFromConfig} t={t} isDarkMode={isDarkMode} /></div>
              )}
            </div>
          )}

          {currentView === 'cart' && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              {cart.length === 0 ? (
                <div className={`flex-1 ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-20 text-center border ${t.glassBorder} shadow-2xl flex flex-col items-center justify-center`}>
                  <div className={`w-24 h-24 ${t.itemBg} rounded-[2rem] flex items-center justify-center mb-8 ${t.muted} border ${t.glassInnerBorder} shadow-inner`}>
                    <ShoppingCart size={40} />
                  </div>
                  <p className={`${t.heading} font-black text-2xl uppercase mb-8 tracking-tight`}>Your cart is empty</p>
                  <button onClick={() => navigateTo('search')} className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">Start Discovering</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col xl:flex-row gap-6 md:gap-8 items-start">
                  <div className="w-full xl:flex-1 space-y-4 md:space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className={`${t.glassBg} backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border ${t.glassBorder} flex flex-col gap-6 shadow-xl hover:border-orange-500/30 transition-all group`}>
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 ${t.itemBg} rounded-2xl flex items-center justify-center text-orange-500 border ${t.glassInnerBorder} flex-shrink-0 shadow-inner group-hover:bg-orange-500/10 transition-colors`}>
                            <Store size={28} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className={`font-black ${t.heading} text-lg truncate uppercase tracking-tight`}>{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{item.source}</p>
                          </div>
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-[10px] font-black bg-red-500/10 text-red-500 px-4 py-3 rounded-xl hover:bg-red-500/20 uppercase tracking-widest transition-colors flex-shrink-0 border border-red-500/20">Remove</button>
                        </div>
                        
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 ${t.glassPanel} rounded-[1.5rem] border ${t.glassInnerBorder} shadow-inner`}>
                          <div>
                            <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2 ml-1`}>Search Material</label>
                            <input type="text" disabled placeholder="Awaiting Partners..." className={`w-full ${t.itemBg} border ${t.glassInnerBorder} rounded-xl p-4 text-xs font-bold ${t.heading} outline-none opacity-50 cursor-not-allowed focus:border-orange-500 transition-colors`} />
                          </div>
                          <div>
                            <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2 ml-1`}>Available Colors</label>
                            <div className={`w-full ${t.itemBg} border ${t.glassInnerBorder} rounded-xl p-4 text-xs ${t.muted} italic opacity-50 cursor-not-allowed flex items-center`}>Requires Material Selection</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`w-full xl:w-[400px] ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 ${t.heading} space-y-8 shadow-2xl border ${t.glassBorder} xl:sticky xl:top-28 flex-shrink-0 relative overflow-hidden`}>
                    <h3 className={`font-black uppercase text-xs tracking-[0.2em] border-b ${t.glassInnerBorder} pb-4 relative z-10`}>Quote Summary</h3>
                    <div className="space-y-6 relative z-10">
                      <div className={`flex justify-between items-center ${t.itemBg} p-6 rounded-[1.5rem] border ${t.glassInnerBorder}`}>
                        <span className={`font-black uppercase text-sm tracking-widest ${t.muted}`}>Total</span>
                        <span className="text-2xl font-black text-orange-500 tracking-tighter">PENDING</span>
                      </div>
                      <p className={`text-xs ${t.muted} font-medium leading-relaxed ${t.glassPanel} p-5 rounded-[1.5rem] border ${t.glassInnerBorder} shadow-inner`}>Price is calculated dynamically after a partner reviews your specific material and scale requirements.</p>
                    </div>
                    <button className="w-full bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:bg-orange-400 active:scale-95 transition-all relative z-10">Request Quote</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Floating App Dock (Bottom Navigation) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-[420px]">
        <nav className={`${t.dockBg} backdrop-blur-2xl border ${t.glassBorder} p-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-between px-5 relative transition-colors duration-500`}>
          
          <button 
            onClick={() => navigateTo('home')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'home' ? activeBtnClass : inactiveBtnClass}`}
          >
            <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          </button>
          
          <button 
            onClick={() => navigateTo('search')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'search' ? activeBtnClass : inactiveBtnClass}`}
          >
            <Search size={24} strokeWidth={currentView === 'search' ? 2.5 : 2} />
          </button>

          <div className="relative -top-10 px-2">
            <button 
              onClick={() => navigateTo('adjust')} 
              className={`bg-orange-500 hover:bg-orange-400 text-gray-950 p-5 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border-[6px] ${isDarkMode ? 'border-[#0a0a0a]' : 'border-[#f8fafc]'} transition-transform active:scale-90`}
            >
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>
          
          <button 
            onClick={() => navigateTo('cart')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 relative ${currentView === 'cart' ? activeBtnClass : inactiveBtnClass}`}
          >
            <ShoppingCart size={24} strokeWidth={currentView === 'cart' ? 2.5 : 2} />
            {cart.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 border-2 border-gray-900 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            )}
          </button>

          <button 
            onClick={() => navigateTo('profile')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${['profile', 'partner', 'admin'].includes(currentView) ? activeBtnClass : inactiveBtnClass}`}
          >
            <User size={24} strokeWidth={['profile', 'partner', 'admin'].includes(currentView) ? 2.5 : 2} />
          </button>

        </nav>
      </div>
    </div>
  );
}