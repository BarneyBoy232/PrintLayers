'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Home, Search, Plus, ShoppingCart, User, Settings, Store, ArrowLeft } from 'lucide-react';

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

type View = 'home' | 'search' | 'adjust' | 'store' | 'partner' | 'signin' | 'cart' | 'admin';

// Shared Constants for consistency between Viewer and Cart
// Colors are now directly linked to specific materials. 
// e.g. { 'PLA': ['Black', 'White'], 'Carbon Fiber': ['Grey'] }
const PARTNER_FILAMENTS: Record<string, string[]> = {}; 

// --- Integrated 3D Viewer / Configurator ---
function ThreeDViewer({ file, onClear, onAddToCart }: { file: File, onClear: () => void, onAddToCart: (config: { price: string, material: string, color: string, weight: number }) => void }) {
  const [weight, setWeight] = useState<number>(0);
  const [material, setMaterial] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  const handleAdd = () => {
    onAddToCart({
      price: "Pending",
      material,
      color,
      weight
    });
  };

  return (
    <div className="w-full h-full space-y-6 animate-in zoom-in-95 duration-500 flex flex-col">
      <div className="w-full flex-1 min-h-[500px] bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] overflow-hidden relative border border-white/10 shadow-2xl flex flex-col">
        {!showConfig ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h2 className="text-white text-3xl font-black italic tracking-tighter uppercase mb-3">{file.name}</h2>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm">File successfully loaded into the viewer. Ready for parameter configuration.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button onClick={() => setShowConfig(true)} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-950 py-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">Configure Print</button>
              <button onClick={onClear} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all border border-white/10">Clear File</button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 bg-black/40 backdrop-blur-xl">
            <div className="flex-1 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-center text-emerald-500/50 font-black italic text-2xl tracking-widest shadow-inner">
              3D PREVIEW ENGINE
            </div>
            <div className="w-full md:w-96 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                <h3 className="text-white font-black uppercase text-xs tracking-[0.2em] border-b border-white/10 pb-3 flex items-center gap-2">
                  <Settings size={14} className="text-emerald-500" /> Print Config
                </h3>
                
                <div className="space-y-4 p-5 bg-white/5 rounded-[1.5rem] border border-white/5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Search Material</label>
                    <input 
                      type="text" 
                      disabled 
                      placeholder="Awaiting Partners..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-white text-xs outline-none opacity-50 cursor-not-allowed focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Available Colors</label>
                    <div className="w-full bg-black/30 border border-white/5 rounded-xl p-3.5 text-gray-500 text-xs italic opacity-50 cursor-not-allowed">
                      Requires Material Selection
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 pl-1">Estimated Weight (g)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-4 text-white font-bold outline-none focus:border-emerald-500 transition-colors shadow-inner" />
                </div>
              </div>
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 blur-2xl"></div>
                <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 relative z-10">Quote Status</p>
                <p className="text-2xl font-black text-white italic relative z-10">PENDING</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button onClick={handleAdd} className="w-full bg-emerald-500 text-gray-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95">Add to Cart</button>
                <button onClick={() => setShowConfig(false)} className="w-full bg-white/5 text-gray-300 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95">Back to Viewer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Application ---
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const isInitialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authListenerRef = useRef<any>(null);

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

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCart(cart.map(item => item.id === id ? { ...item, ...updates } : item));
  };

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) { setAuthError(err.message || "Google OAuth failed."); setAuthSubmitting(false); }
  };

  const navigateTo = (view: View) => {
    if (view === 'admin' && user?.email !== ADMIN_EMAIL) { setAuthError("Access Denied: Admins Only."); return; }
    if (!user && view !== 'home' && view !== 'search' && view !== 'store') { setCurrentView('signin'); return; }
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
    setCart([...cart, { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      source: importUrl.includes('makerworld') ? 'MakerWorld' : 'Thingiverse', 
      url: importUrl,
      price: 'Pending',
      material: '',
      color: '',
      weight: 0
    }]);
    setImportUrl('');
    setCurrentView('cart');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleAddToCartFromConfig = (config: { price: string, material: string, color: string, weight: number }) => {
    if (!uploadedFile) return;
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: uploadedFile.name,
      source: 'Direct Upload',
      price: config.price,
      material: config.material,
      color: config.color,
      weight: config.weight
    };
    setCart([...cart, newItem]);
    setUploadedFile(null);
    setCurrentView('cart');
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  // View Titles mapping for the App Header
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
      default: return 'PrintLayers';
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] font-sans text-gray-100 antialiased flex flex-col overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Ambient Background Effects (Mesh Gradient) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-800/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-900/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Dynamic App Header */}
      <header className="flex-shrink-0 px-6 py-5 bg-black/20 backdrop-blur-2xl z-40 sticky top-0 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'home' && (
              <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className={`text-2xl font-black italic tracking-tighter uppercase ${currentView === 'home' ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500' : 'text-white'}`}>
              {getHeaderTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.email === ADMIN_EMAIL && (
              <button onClick={() => setCurrentView('admin')} className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-full transition-colors">
                <Settings size={20} />
              </button>
            )}
            {user && (
              <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors px-2">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-32 custom-scrollbar relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full h-full pt-8">
          
          {currentView === 'signin' && (
            <div className="h-full flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
              <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/10 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-white/10 shadow-inner">
                    <User size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
                  {authError && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">{String(authError)}</div>}
                  <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                    <input type="email" placeholder="Email Address" required className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-500 text-white placeholder-gray-600 text-sm font-medium transition-all shadow-inner" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-500 text-white placeholder-gray-600 text-sm font-medium transition-all shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
                    {isSignUpMode && <input type="password" placeholder="Confirm Password" required className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-emerald-500 text-white placeholder-gray-600 text-sm font-medium transition-all shadow-inner" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
                    <button type="submit" disabled={authSubmitting} className="w-full bg-emerald-500 text-gray-950 py-4.5 rounded-2xl font-black shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95 mt-2">{authSubmitting ? '...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}</button>
                  </form>
                  <button onClick={handleOAuthSignIn} disabled={authSubmitting} className="mt-4 w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95 text-sm">Continue with Google</button>
                  <div className="mt-8 pt-6 border-t border-white/10"><button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-emerald-400 uppercase tracking-wider transition-colors hover:text-emerald-300">{isSignUpMode ? 'Back to Sign In' : "Join Network"}</button></div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'home' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
              <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors duration-700 pointer-events-none"></div>
                <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="max-w-xl">
                    <h3 className="font-black text-4xl md:text-5xl mb-4 tracking-tight text-white leading-tight">Turn pixels into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">plastic.</span></h3>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed">Upload your 3D files and get them printed by our decentralized network of premium partners.</p>
                  </div>
                  <button onClick={() => navigateTo('adjust')} className="relative z-10 whitespace-nowrap bg-emerald-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] active:scale-95 transition-all w-full md:w-auto">Start Printing</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-lg border border-white/10 hover:border-emerald-500/30 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group flex flex-col justify-between" onClick={() => navigateTo('search')}>
                  <div>
                    <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-emerald-400 mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-inner"><Search size={26} /></div>
                    <h3 className="font-black text-2xl text-white mb-3 tracking-tight">Find Files</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">Search repositories like MakerWorld & Thingiverse directly from the app.</p>
                  </div>
                </div>
                
                <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-lg border border-white/10 hover:border-blue-500/30 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group flex flex-col justify-between" onClick={() => navigateTo('store')}>
                  <div>
                    <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-blue-400 mb-8 border border-white/10 group-hover:scale-110 transition-transform shadow-inner"><Store size={26} /></div>
                    <h3 className="font-black text-2xl text-white mb-3 tracking-tight">Parts Store</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">Browse curated, ready-to-print utility parts and popular models.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="font-black text-xl text-white mb-2 tracking-tight">Own a 3D printer?</h3>
                  <p className="text-sm text-gray-400 font-medium">Add your machine to the pool and earn money fulfilling jobs.</p>
                </div>
                <button onClick={() => navigateTo('partner')} className="bg-white/10 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 hover:shadow-lg transition-all w-full sm:w-auto border border-white/5">Register Partner</button>
              </div>
            </div>
          )}

          {currentView === 'store' && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 text-center border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
                <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 text-gray-500 shadow-inner relative z-10">
                  <Store size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight relative z-10">Store is Empty</h3>
                <p className="text-gray-400 font-medium text-base max-w-md mx-auto leading-relaxed relative z-10">Popular and highly purchased prints will automatically appear here as the network grows.</p>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl space-y-10 text-center relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-8 relative z-10">
                  <h3 className="font-black text-2xl text-white uppercase tracking-tight flex items-center justify-center gap-3">
                    <Search className="text-emerald-400" /> Search Repositories
                  </h3>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                      <Search size={22} />
                    </div>
                    <input type="text" placeholder="e.g. GoPro Mount..." className="w-full pl-16 pr-6 py-6 rounded-2xl bg-black/50 border border-white/10 outline-none font-bold text-white text-lg placeholder-gray-600 focus:border-emerald-500 focus:bg-black/80 transition-all shadow-inner" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-500/20 transition-all active:scale-95">MakerWorld</button>
                    <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-5 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500/20 transition-all active:scale-95">Thingiverse</button>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 text-center relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-8 relative z-10">
                  <h3 className="font-black text-2xl uppercase tracking-tight text-emerald-400">Import via URL</h3>
                  <p className="text-gray-400 text-base font-medium">Found exactly what you need? Paste the link directly.</p>
                  <form onSubmit={handleImport} className="space-y-4">
                    <input type="url" required placeholder="https://..." className="w-full px-8 py-6 rounded-2xl bg-white/5 border border-white/10 outline-none font-bold text-base text-center placeholder-gray-600 text-white focus:border-emerald-500 focus:bg-white/10 transition-all shadow-inner" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                    <button type="submit" className="w-full bg-emerald-500 text-gray-950 py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 active:scale-95 transition-all">Add to Cart</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {currentView === 'adjust' && (
            <div className="h-full min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
              {!uploadedFile ? (
                <div onClick={() => fileInputRef.current?.click()} className="flex-1 group w-full border-[3px] border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/[0.05] transition-all duration-500">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
                  <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-500 shadow-inner">
                    <Plus size={48} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic group-hover:text-emerald-400 transition-colors">Drop 3D File Here</h3>
                  <p className="text-gray-500 font-medium text-sm tracking-wide">Supports .STL, .3MF, .STEP</p>
                </div>
              ) : ( 
                <div className="flex-1"><ThreeDViewer file={uploadedFile} onClear={() => setUploadedFile(null)} onAddToCart={handleAddToCartFromConfig} /></div>
              )}
            </div>
          )}

          {currentView === 'cart' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {cart.length === 0 ? (
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-20 text-center border border-white/10 shadow-2xl flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-gray-500 border border-white/10 shadow-inner">
                    <ShoppingCart size={40} />
                  </div>
                  <p className="text-white font-black text-2xl uppercase mb-8 tracking-tight">Your cart is empty</p>
                  <button onClick={() => navigateTo('search')} className="bg-emerald-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">Start Discovering</button>
                </div>
              ) : (
                <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start">
                  <div className="w-full xl:flex-1 space-y-4 md:space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white/[0.03] backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 shadow-xl hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 flex-shrink-0 shadow-inner group-hover:bg-emerald-500/10 transition-colors">
                            <Store size={28} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-black text-white text-lg truncate uppercase tracking-tight">{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{item.source}</p>
                          </div>
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-[10px] font-black bg-red-500/10 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/20 uppercase tracking-widest transition-colors flex-shrink-0 border border-red-500/20">Remove</button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-black/40 rounded-[1.5rem] border border-white/5 shadow-inner">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Search Material</label>
                            <input 
                              type="text" 
                              disabled
                              placeholder="Awaiting Partners..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none opacity-50 cursor-not-allowed focus:border-emerald-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Available Colors</label>
                            <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-gray-500 italic opacity-50 cursor-not-allowed flex items-center">
                              Requires Material Selection
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full xl:w-96 bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 text-white space-y-8 shadow-2xl border border-white/10 xl:sticky xl:top-28 flex-shrink-0 relative overflow-hidden">
                    <h3 className="font-black uppercase text-xs tracking-[0.2em] border-b border-white/10 pb-4 relative z-10">Quote Summary</h3>
                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 p-6 rounded-[1.5rem] border border-white/5">
                        <span className="font-black uppercase text-sm tracking-widest text-gray-300">Total</span>
                        <span className="text-2xl font-black text-emerald-400 italic tracking-tighter">PENDING</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed bg-black/50 p-5 rounded-[1.5rem] border border-white/5 shadow-inner">Price is calculated dynamically after a partner reviews your specific material and scale requirements.</p>
                    </div>
                    <button className="w-full bg-emerald-500 text-gray-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:bg-emerald-400 active:scale-95 transition-all relative z-10">Request Quote</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Floating App Dock (Bottom Navigation) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-[420px]">
        <nav className="bg-gray-900/80 backdrop-blur-2xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-between px-5 relative">
          
          <button 
            onClick={() => navigateTo('home')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-emerald-400 bg-white/10 scale-110 shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          </button>
          
          <button 
            onClick={() => navigateTo('search')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'search' ? 'text-emerald-400 bg-white/10 scale-110 shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Search size={24} strokeWidth={currentView === 'search' ? 2.5 : 2} />
          </button>

          {/* Floating Action Button for main action (Upload/Adjust) */}
          <div className="relative -top-10 px-2">
            <button 
              onClick={() => navigateTo('adjust')} 
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 p-5 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.4)] border-[6px] border-[#0a0a0a] transition-transform active:scale-90"
            >
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>
          
          <button 
            onClick={() => navigateTo('cart')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 relative ${currentView === 'cart' ? 'text-emerald-400 bg-white/10 scale-110 shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <ShoppingCart size={24} strokeWidth={currentView === 'cart' ? 2.5 : 2} />
            {cart.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 border-2 border-gray-900 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            )}
          </button>

          <button 
            onClick={() => navigateTo('signin')} 
            className={`p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${['signin', 'partner', 'admin'].includes(currentView) ? 'text-emerald-400 bg-white/10 scale-110 shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <User size={24} strokeWidth={['signin', 'partner', 'admin'].includes(currentView) ? 2.5 : 2} />
          </button>

        </nav>
      </div>
    </div>
  );
}