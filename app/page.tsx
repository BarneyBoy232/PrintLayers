'use client';

import React, { useEffect, useState, useRef } from 'react';

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
const MATERIALS: string[] = []; // Intentionally empty: Will be filled by active partners
const COLORS: string[] = []; // Intentionally empty: Will be filled by active partners

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
    <div className="w-full space-y-6 animate-in zoom-in-95 duration-500">
      <div className="w-full h-[500px] bg-gray-900 rounded-[3rem] overflow-hidden relative border border-gray-800 shadow-2xl">
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
            <div className="w-full md:w-80 space-y-6">
              <div className="space-y-4">
                <h3 className="text-white font-black uppercase text-sm tracking-widest border-b border-white/10 pb-2">Print Config</h3>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Material</label>
                  <select disabled value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none opacity-50 cursor-not-allowed">
                    {MATERIALS.length > 0 ? MATERIALS.map(m => <option key={m} value={m} className="bg-gray-900">{m}</option>) : <option>Awaiting Partners...</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Color</label>
                  <select disabled value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none opacity-50 cursor-not-allowed">
                    {COLORS.length > 0 ? COLORS.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>) : <option>Awaiting Partners...</option>}
                  </select>
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
    if (!user && view !== 'home') { setCurrentView('signin'); return; }
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
      material: 'PLA',
      color: 'Black',
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-14 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between relative w-full">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 z-10 group"><span className="font-black text-xl tracking-tighter text-emerald-600 transition-all group-hover:scale-105">PrintLayers</span></button>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-400 whitespace-nowrap hidden sm:block uppercase tracking-[0.2em]">{currentView}</div>
          <div className="flex gap-6 text-sm font-medium text-gray-600 z-10 items-center">
            {user?.email === ADMIN_EMAIL && <button onClick={() => setCurrentView('admin')} className="text-purple-600 font-black text-[10px] uppercase tracking-widest border-2 border-purple-100 px-2 py-1 rounded-lg hover:bg-purple-50 transition-all">Admin</button>}
            <button onClick={() => navigateTo('cart')} className={`relative px-3 py-1 rounded-full text-[10px] font-black transition-all ${cart.length > 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>CART {cart.length > 0 && `(${cart.length})`}</button>
            {user ? <button onClick={() => supabase.auth.signOut()} className="text-gray-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-wider">Sign Out</button> : (currentView !== 'signin' && <button onClick={() => setCurrentView('signin')} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-wider text-xs">Sign In</button>)}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow flex flex-col">
        {currentView === 'signin' && (
          <div className="flex-grow flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
              <h1 className="text-3xl font-black text-gray-900 mb-2">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
              {authError && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">{String(authError)}</div>}
              <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                <input type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm" value={password} onChange={e => setPassword(e.target.value)} />
                {isSignUpMode && <input type="password" placeholder="Confirm Password" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 text-sm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
                <button type="submit" disabled={authSubmitting} className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black shadow-lg hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95">{authSubmitting ? '...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}</button>
              </form>
              <button onClick={handleOAuthSignIn} disabled={authSubmitting} className="mt-4 w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95">Google Login</button>
              <div className="mt-8 pt-6 border-t border-gray-50"><button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-emerald-600 uppercase tracking-wider transition-colors hover:text-emerald-700">{isSignUpMode ? 'Back to Sign In' : "Join Network"}</button></div>
            </div>
          </div>
        )}

        {currentView === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              <div className="flex flex-col bg-emerald-600 p-6 rounded-3xl shadow-lg border border-emerald-700 text-white group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => navigateTo('search')}>
                <h3 className="font-black text-xl mb-2">Find Files</h3>
                <p className="text-sm text-emerald-50 mb-6 opacity-90 leading-relaxed">Search MakerWorld & Thingiverse.</p>
                <button className="mt-auto w-full bg-white text-emerald-700 py-2.5 rounded-xl text-sm font-black transition-colors">Search Library</button>
              </div>
              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => navigateTo('adjust')}>
                <h3 className="font-black text-xl text-gray-900 mb-2">Upload & Print</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Configure materials and scale for pricing.</p>
                <button className="mt-auto w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-black hover:bg-gray-800 transition-colors">Start Quote</button>
              </div>
              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => navigateTo('store')}>
                <h3 className="font-black text-xl text-gray-900 mb-2">Parts Store</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Browse ready-to-print utility parts.</p>
                <button className="mt-auto w-full bg-white border-2 border-gray-100 text-gray-700 py-2 rounded-xl text-sm font-black hover:bg-gray-50 transition-all">Browse Shop</button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden text-center md:text-left">
              <div><h3 className="font-black text-2xl mb-3">Own a printer? Join the network.</h3><p className="text-gray-400 text-sm max-w-lg leading-relaxed">Add your machine to our manufacturing pool. Receive verified jobs and earn money.</p></div>
              <button onClick={() => navigateTo('partner')} className="whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all">Register Printer</button>
            </div>
          </div>
        )}

        {currentView === 'store' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between"><button onClick={() => setCurrentView('home')} className="text-xs font-black text-gray-400 hover:text-emerald-600 transition-colors">&larr; BACK</button><h2 className="text-4xl font-black italic tracking-tighter uppercase">Parts Store</h2></header>
            <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Store is Empty</h3>
              <p className="text-gray-400 font-bold max-w-md mx-auto leading-relaxed">Popular and highly purchased prints will automatically appear here as the network grows.</p>
            </div>
          </div>
        )}

        {currentView === 'search' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center relative"><button onClick={() => setCurrentView('home')} className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 hover:text-emerald-600 transition-colors">&larr; BACK</button><h2 className="text-4xl font-black italic tracking-tighter uppercase">Find Files</h2></header>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 flex flex-col justify-center text-center">
                <h3 className="font-black text-lg">1. Browse Repositories</h3>
                <input type="text" placeholder="e.g. GoPro Mount..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-center" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={() => window.open(`https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`)} className="flex-1 p-4 bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-100 transition-all">MakerWorld</button>
                  <button onClick={() => window.open(`https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`)} className="flex-1 p-4 bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-100 transition-all">Thingiverse</button>
                </div>
              </div>
              <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white space-y-6 text-center">
                <h3 className="font-black text-lg">2. Add to Cart</h3>
                <form onSubmit={handleImport} className="space-y-4">
                  <input type="url" required placeholder="Paste URL..." className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none font-bold text-sm text-center placeholder:text-white/40" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                  <button type="submit" className="w-full bg-white text-emerald-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all">ADD TO CART</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentView === 'adjust' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between"><button onClick={() => { setUploadedFile(null); setCurrentView('home'); }} className="text-xs font-black text-gray-400 hover:text-emerald-600 transition-colors">&larr; BACK</button><h2 className="text-4xl font-black italic tracking-tighter uppercase">Upload & Print</h2></header>
            {!uploadedFile ? (
              <div onClick={() => fileInputRef.current?.click()} className="group w-full min-h-[500px] border-4 border-dashed border-gray-200 rounded-[3rem] bg-white flex flex-col items-center justify-center p-20 text-center cursor-pointer hover:border-emerald-500/50 transition-all duration-500">
                <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100 hover:scale-110 hover:bg-emerald-100 transition-all shadow-sm"><svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Drop 3D File Here</h3>
              </div>
            ) : ( <ThreeDViewer file={uploadedFile} onClear={() => setUploadedFile(null)} onAddToCart={handleAddToCartFromConfig} /> )}
          </div>
        )}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between"><button onClick={() => setCurrentView('home')} className="text-xs font-black text-gray-400 hover:text-emerald-600 transition-colors">&larr; BACK</button><h2 className="text-4xl font-black italic tracking-tighter uppercase text-right">Quote Request</h2></header>
            {cart.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-bold mb-4">Your cart is empty.</p>
                <button onClick={() => setCurrentView('search')} className="text-emerald-600 font-black text-[10px] uppercase tracking-widest border-b-2 border-emerald-500 pb-1">Start Discovering</button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col gap-4 shadow-sm hover:border-emerald-500/40 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-500 border border-gray-100">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-black text-gray-900 truncate uppercase text-sm tracking-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{item.source}</p>
                        </div>
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors">Remove</button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Material</label>
                          <select 
                            disabled
                            value={item.material} 
                            onChange={(e) => updateCartItem(item.id, { material: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-bold outline-none opacity-50 cursor-not-allowed"
                          >
                            {MATERIALS.length > 0 ? MATERIALS.map(m => <option key={m} value={m}>{m}</option>) : <option>Awaiting Partners</option>}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Color</label>
                          <select 
                            disabled
                            value={item.color} 
                            onChange={(e) => updateCartItem(item.id, { color: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-bold outline-none opacity-50 cursor-not-allowed"
                          >
                            {COLORS.length > 0 ? COLORS.map(c => <option key={c} value={c}>{c}</option>) : <option>Awaiting Partners</option>}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl sticky top-24">
                  <h3 className="font-black uppercase text-xs tracking-[0.2em] border-b border-white/10 pb-4">Quote Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black uppercase text-sm tracking-widest">Total</span>
                      <span className="text-xl font-black text-emerald-500 italic">PENDING</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Price is calculated after a partner reviews your material and color requirements.</p>
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-500 transition-all">Request Quote</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}