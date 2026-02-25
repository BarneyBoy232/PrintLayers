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
    <div className="w-full h-full space-y-6 animate-in zoom-in-95 duration-500">
      <div className="w-full h-[60vh] min-h-[400px] bg-gray-900 rounded-[3rem] overflow-hidden relative border border-gray-800 shadow-2xl">
        {!showConfig ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-black italic tracking-tighter uppercase mb-2">{file.name}</h2>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">File successfully loaded. Ready for configuration.</p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setShowConfig(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">Configure Print</button>
              <button onClick={onClear} className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/10">Clear File</button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-8 flex flex-col md:flex-row gap-8 bg-gray-900/95 backdrop-blur-md">
            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-emerald-500 font-black italic">3D PREVIEW ENGINE</div>
            <div className="w-full md:w-80 space-y-6 overflow-y-auto pr-2">
              <div className="space-y-4">
                <h3 className="text-white font-black uppercase text-sm tracking-widest border-b border-white/10 pb-2">Print Config</h3>
                
                <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Search Material</label>
                    <input 
                      type="text" 
                      disabled 
                      placeholder="Awaiting Partners..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Available Colors</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-500 text-xs italic opacity-50 cursor-not-allowed">
                      Requires Material Selection
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Estimated Weight (g)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                </div>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Quote Status</p>
                <p className="text-xl font-black text-white italic">PENDING REVIEW</p>
              </div>
              <button onClick={handleAdd} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95">Add to Cart</button>
              <button onClick={() => setShowConfig(false)} className="w-full text-gray-500 font-bold text-[10px] uppercase hover:text-white transition-colors">Back</button>
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

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

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
    <div className="h-screen w-full bg-gray-50 font-sans text-gray-900 antialiased flex flex-col overflow-hidden relative selection:bg-emerald-200">
      
      {/* Dynamic App Header */}
      <header className="flex-shrink-0 px-6 py-5 bg-gray-50/80 backdrop-blur-md z-40 sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== 'home' && (
              <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 transition-colors text-gray-400 hover:text-gray-900">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className={`text-2xl font-black italic tracking-tighter uppercase ${currentView === 'home' ? 'text-emerald-600' : 'text-gray-900'}`}>
              {getHeaderTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.email === ADMIN_EMAIL && (
              <button onClick={() => setCurrentView('admin')} className="p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors">
                <Settings size={20} />
              </button>
            )}
            {user && (
              <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors px-2">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-32">
        <div className="max-w-4xl mx-auto px-4 w-full h-full">
          
          {currentView === 'signin' && (
            <div className="h-full flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
              <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <User size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
                {authError && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">{String(authError)}</div>}
                <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                  <input type="email" placeholder="Email Address" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm font-medium transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm font-medium transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                  {isSignUpMode && <input type="password" placeholder="Confirm Password" required className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm font-medium transition-all" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
                  <button type="submit" disabled={authSubmitting} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95">{authSubmitting ? '...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}</button>
                </form>
                <button onClick={handleOAuthSignIn} disabled={authSubmitting} className="mt-4 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 text-sm">Continue with Google</button>
                <div className="mt-8 pt-6 border-t border-gray-50"><button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-emerald-600 uppercase tracking-wider transition-colors hover:text-emerald-700">{isSignUpMode ? 'Back to Sign In' : "Join Network"}</button></div>
              </div>
            </div>
          )}

          {currentView === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-500 pb-12">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 text-center md:text-left">
                  <h3 className="font-black text-3xl mb-3 tracking-tight">Turn pixels into plastic.</h3>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">Upload your 3D files and get them printed by our decentralized network of premium partners.</p>
                </div>
                <button onClick={() => navigateTo('adjust')} className="relative z-10 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-900/50 active:scale-95 transition-all">Start Printing</button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer group" onClick={() => navigateTo('search')}>
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform"><Search size={24} /></div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Find Files</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Search repositories like MakerWorld & Thingiverse directly from the app.</p>
                </div>
                
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer group" onClick={() => navigateTo('store')}>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><Store size={24} /></div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Parts Store</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Browse curated, ready-to-print utility parts and popular models.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-black text-lg text-gray-900 mb-1">Own a 3D printer?</h3>
                  <p className="text-sm text-gray-500">Add your machine to the pool and earn money fulfilling jobs.</p>
                </div>
                <button onClick={() => navigateTo('partner')} className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors w-full sm:w-auto">Register Partner</button>
              </div>
            </div>
          )}

          {currentView === 'store' && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-1 bg-white rounded-[3rem] p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 text-gray-300">
                  <Store size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">Store is Empty</h3>
                <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">Popular and highly purchased prints will automatically appear here as the network grows.</p>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="font-black text-xl uppercase tracking-tight">Search Repositories</h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
                      <Search size={20} />
                    </div>
                    <input type="text" placeholder="e.g. GoPro Mount..." className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-gray-900 focus:border-emerald-500 transition-colors shadow-inner" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-4 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-100 transition-all active:scale-95">MakerWorld</button>
                    <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className="flex-1 py-4 bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-100 transition-all active:scale-95">Thingiverse</button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-8 md:p-12 rounded-[3rem] shadow-xl text-white text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <h3 className="font-black text-xl uppercase tracking-tight text-emerald-400">Import via URL</h3>
                  <p className="text-gray-400 text-sm">Found exactly what you need? Paste the link directly.</p>
                  <form onSubmit={handleImport} className="space-y-4">
                    <input type="url" required placeholder="https://..." className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 outline-none font-bold text-sm text-center placeholder:text-white/40 focus:border-emerald-500 transition-colors" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 active:scale-95 transition-all">Add to Cart</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {currentView === 'adjust' && (
            <div className="h-full min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
              {!uploadedFile ? (
                <div onClick={() => fileInputRef.current?.click()} className="flex-1 group w-full border-4 border-dashed border-gray-200 rounded-[3rem] bg-white flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all duration-300">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
                  <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-emerald-100 transition-all shadow-sm">
                    <Plus size={40} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tighter italic">Drop 3D File Here</h3>
                  <p className="text-gray-400 font-medium text-sm">Supports .STL, .3MF, .STEP</p>
                </div>
              ) : ( 
                <div className="flex-1"><ThreeDViewer file={uploadedFile} onClear={() => setUploadedFile(null)} onAddToCart={handleAddToCartFromConfig} /></div>
              )}
            </div>
          )}

          {currentView === 'cart' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {cart.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                    <ShoppingCart size={32} />
                  </div>
                  <p className="text-gray-900 font-black text-xl uppercase mb-6 tracking-tight">Your cart is empty</p>
                  <button onClick={() => navigateTo('search')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Start Discovering</button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="w-full lg:flex-1 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-4 shadow-sm hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100/50 flex-shrink-0">
                            <Store size={24} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-black text-gray-900 truncate uppercase text-sm tracking-tight">{item.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.source}</p>
                          </div>
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-2 rounded-xl hover:bg-red-100 uppercase tracking-widest transition-colors flex-shrink-0">Remove</button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Search Material</label>
                            <input 
                              type="text" 
                              disabled
                              placeholder="Awaiting Partners..."
                              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none opacity-50 cursor-not-allowed shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Available Colors</label>
                            <div className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-400 italic opacity-50 cursor-not-allowed shadow-inner flex items-center">
                              Requires Material Selection
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full lg:w-80 bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl lg:sticky lg:top-24 flex-shrink-0">
                    <h3 className="font-black uppercase text-xs tracking-[0.2em] border-b border-white/10 pb-4">Quote Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-black uppercase text-sm tracking-widest text-gray-300">Total</span>
                        <span className="text-xl font-black text-emerald-400 italic tracking-tighter">PENDING</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">Price is calculated dynamically after a partner reviews your specific material and scale requirements.</p>
                    </div>
                    <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 active:scale-95 transition-all">Request Quote</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Floating App Dock (Bottom Navigation) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <nav className="bg-gray-900/95 backdrop-blur-xl border border-white/10 p-2.5 rounded-[2rem] shadow-2xl flex items-center justify-between px-4 relative">
          
          <button 
            onClick={() => navigateTo('home')} 
            className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-emerald-400 bg-white/10 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={22} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          </button>
          
          <button 
            onClick={() => navigateTo('search')} 
            className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'search' ? 'text-emerald-400 bg-white/10 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Search size={22} strokeWidth={currentView === 'search' ? 2.5 : 2} />
          </button>

          {/* Floating Action Button for main action (Upload/Adjust) */}
          <div className="relative -top-8 px-2">
            <button 
              onClick={() => navigateTo('adjust')} 
              className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-lg shadow-emerald-900/50 border-[6px] border-gray-50 transition-transform active:scale-90"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
          
          <button 
            onClick={() => navigateTo('cart')} 
            className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 relative ${currentView === 'cart' ? 'text-emerald-400 bg-white/10 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ShoppingCart size={22} strokeWidth={currentView === 'cart' ? 2.5 : 2} />
            {cart.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-gray-900 rounded-full"></span>
            )}
          </button>

          <button 
            onClick={() => navigateTo('signin')} 
            className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${['signin', 'partner', 'admin'].includes(currentView) ? 'text-emerald-400 bg-white/10 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <User size={22} strokeWidth={['signin', 'partner', 'admin'].includes(currentView) ? 2.5 : 2} />
          </button>

        </nav>
      </div>
    </div>
  );
}