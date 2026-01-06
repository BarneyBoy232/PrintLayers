'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * TYPES & INTERFACES
 */
interface SupabaseUser {
  id: string;
  email?: string;
}

interface CartItem {
  id: string;
  name: string;
  source: string;
  url: string;
}

type View = 'home' | 'search' | 'adjust' | 'store' | 'partner' | 'signin' | 'cart';

// --- Integrated 3D Viewer Placeholder (Shows after upload) ---
function ThreeDViewer({ file, onClear }: { file: File, onClear: () => void }) {
  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-[3rem] overflow-hidden relative border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-black italic tracking-tighter uppercase mb-2">{file.name}</h2>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          File successfully loaded. Ready to scale, rotate, and estimate print costs.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
            Configure Print
          </button>
          <button 
            onClick={onClear}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/10"
          >
            Clear File
          </button>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
    </div>
  );
}

// --- Main Application Component ---
export default function App() {
  const [supabase, setSupabase] = useState<any>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // App Logic State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const isInitialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    
    script.onload = () => {
      const supabaseUrl = 'https://xijtyfewiimfcwoodxlq.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanR5ZmV3aWltZmN3b29keGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NzA4ODQsImV4cCI6MjA4MjA0Njg4NH0.tc4usglFmTnLKJSEfw_KAdHCiltpykUtaBo9bhppdjw';

      const client = (window as any).supabase.createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);

      client.auth.getSession().then(({ data: { session } }: any) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = client.auth.onAuthStateChange((event: string, session: any) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (event === 'SIGNED_IN' && currentUser) {
          setAuthSubmitting(false);
          setAuthError(null);
          setCurrentView('home');
        }
        if (event === 'SIGNED_OUT') {
          setCurrentView('home');
        }
      });

      return () => subscription.unsubscribe();
    };
    document.head.appendChild(script);
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (isSignUpMode && password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

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
    } catch (err: any) {
      setAuthError(err.message);
      setAuthSubmitting(false);
    }
  };

  const handleOAuthSignIn = async () => {
    if (!supabase) return;
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Sign in error:", err);
      setAuthError(err.message || "OAuth failed.");
      setAuthSubmitting(false);
    }
  };

  const handleExternalSearch = (platform: 'maker' | 'thing') => {
    if (!searchQuery) return;
    const url = platform === 'maker' 
      ? `https://makerworld.com/en/search/models?keyword=${encodeURIComponent(searchQuery)}`
      : `https://www.thingiverse.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;
    let name = "Imported Model";
    try {
      const urlObj = new URL(importUrl);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      if (pathParts.length > 0) {
        name = pathParts[pathParts.length - 1].replace(/-/g, ' ');
      }
    } catch (e) {}
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      source: importUrl.includes('makerworld') ? 'MakerWorld' : 'Thingiverse',
      url: importUrl
    };
    setCart([...cart, newItem]);
    setImportUrl('');
    setCurrentView('cart');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const navigateTo = (view: View) => {
    if (!user && view !== 'home') {
      setCurrentView('signin');
      return;
    }
    setCurrentView(view);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased flex flex-col">
      {/* NAVIGATION */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-14 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between relative w-full">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 z-10 group">
            <span className="font-black text-xl tracking-tighter text-emerald-600">PrintLayers</span>
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-400 whitespace-nowrap hidden sm:block uppercase tracking-widest">
            {currentView === 'home' ? '3D Printing Service' : currentView}
          </div>

          <div className="flex gap-6 text-sm font-medium text-gray-600 z-10 items-center">
            {cart.length > 0 && (
              <button onClick={() => setCurrentView('cart')} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">
                CART: {cart.length}
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs hidden md:inline tracking-tight font-bold">{user.email}</span>
                <button onClick={() => supabase.auth.signOut()} className="text-gray-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-wider">Sign Out</button>
              </div>
            ) : (
              currentView !== 'signin' && (
                <button onClick={() => setCurrentView('signin')} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-wider text-xs">Sign In</button>
              )
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow flex flex-col">
        {/* SIGN IN VIEW */}
        {currentView === 'signin' && (
          <div className="flex-grow flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
               <div className="text-center">
                  <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                    {isSignUpMode ? 'Create Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">
                    {isSignUpMode ? 'Join the PrintLayers network' : 'Enter your details to continue'}
                  </p>

                  {authError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 font-medium text-sm transition-all" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 font-medium text-sm transition-all" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    
                    {isSignUpMode && (
                      <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 font-medium text-sm transition-all animate-in fade-in slide-in-from-top-2" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                      />
                    )}

                    <button 
                      type="submit" 
                      disabled={authSubmitting} 
                      className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black shadow-lg hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-[0.98]"
                    >
                      {authSubmitting ? 'Processing...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}
                    </button>
                  </form>

                  <div className="my-8 flex items-center gap-4 text-gray-300">
                    <div className="h-px bg-gray-100 flex-grow"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Or continue with</span>
                    <div className="h-px bg-gray-100 flex-grow"></div>
                  </div>

                  <button 
                    onClick={handleOAuthSignIn}
                    disabled={authSubmitting}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 px-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Google
                  </button>

                  <div className="mt-8 pt-6 border-t border-gray-50">
                    <button 
                      onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(null); }} 
                      className="text-xs font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors"
                    >
                      {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                  
                  <button onClick={() => setCurrentView('home')} className="block mx-auto text-gray-400 font-bold text-xs uppercase tracking-widest pt-4 hover:text-emerald-600 transition-colors">Return Home</button>
               </div>
            </div>
          </div>
        )}

        {/* HOME VIEW - EXACTLY AS PROVIDED */}
        {currentView === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              <div className="flex flex-col bg-emerald-600 p-6 rounded-3xl shadow-lg border border-emerald-700 relative overflow-hidden text-white group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => navigateTo('search')}>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <h3 className="font-black text-xl mb-2 text-white">Find Files</h3>
                  <p className="text-sm text-emerald-50 mb-6 leading-relaxed opacity-90">Search MakerWorld & Thingiverse.</p>
                  <div className="mt-auto">
                    <button className="w-full bg-white text-emerald-700 py-2.5 rounded-xl text-sm font-black transition-colors">{user ? 'Search Library' : 'Sign in to Search'}</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group cursor-pointer hover:-translate-y-1" onClick={() => navigateTo('adjust')}>
                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-4"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></div>
                <h3 className="font-black text-xl text-gray-900 mb-2">Upload & Print</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Configure materials and scale for pricing.</p>
                <div className="mt-auto">
                  <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-black hover:bg-gray-800 transition-colors">{user ? 'Start Quote' : 'Sign in to Quote'}</button>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group cursor-pointer hover:-translate-y-1" onClick={() => navigateTo('store')}>
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></div>
                <h3 className="font-black text-xl text-gray-900 mb-2">Parts Store</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Browse ready-to-print utility parts.</p>
                <div className="mt-auto">
                  <button className="w-full bg-white border-2 border-gray-100 text-gray-700 py-2 rounded-xl text-sm font-black hover:bg-gray-50 transition-all">{user ? 'Browse Shop' : 'Sign in to Browse'}</button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden text-center md:text-left">
              <div>
                <h3 className="font-black text-2xl mb-3">Own a printer? Join the network.</h3>
                <p className="text-gray-400 text-sm max-w-lg leading-relaxed">Add your machine to our manufacturing pool. Receive verified jobs and earn money.</p>
              </div>
              <button onClick={() => navigateTo('partner')} className="whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all">{user ? 'Register Printer' : 'Sign in to Register'}</button>
            </div>
          </div>
        )}

        {/* SEARCH VIEW - CENTERED FIND FILES HEADER */}
        {currentView === 'search' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center relative">
              <button onClick={() => setCurrentView('home')} className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-2">&larr; BACK</button>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Find Files</h2>
            </header>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 flex flex-col justify-center text-center">
                <div className="space-y-2">
                  <h3 className="font-black text-lg">1. Browse Repositories</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Search thousands of free STL files</p>
                </div>
                <input type="text" placeholder="e.g. GoPro Mount..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-center" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={() => handleExternalSearch('maker')} className="flex-1 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-700 text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-100">MakerWorld</button>
                  <button onClick={() => handleExternalSearch('thing')} className="flex-1 p-4 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-700 text-[10px] uppercase tracking-widest transition-all hover:bg-blue-100">Thingiverse</button>
                </div>
              </div>

              <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white space-y-6 text-center">
                <div className="space-y-2">
                  <h3 className="font-black text-lg">2. Add to Cart</h3>
                  <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Paste the URL from the search</p>
                </div>
                <form onSubmit={handleImport} className="space-y-4">
                  <input type="url" required placeholder="https://..." className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none font-bold text-sm text-white placeholder:text-white/40 text-center" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                  <button type="submit" className="w-full bg-white text-emerald-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all">ADD TO CART</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ADJUST VIEW - UPDATED UPLOAD AREA */}
        {currentView === 'adjust' && (
          <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
              <button onClick={() => { setUploadedFile(null); setCurrentView('home'); }} className="text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-2">&larr; BACK</button>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Upload & Print</h2>
            </header>

            {!uploadedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group w-full min-h-[500px] border-4 border-dashed border-gray-200 rounded-[3rem] bg-white flex flex-col items-center justify-center p-20 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-all duration-500"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-emerald-100 transition-all shadow-sm">
                  <svg className="w-10 h-10 text-gray-300 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Drop 3D File Here</h3>
                <p className="text-gray-400 font-bold mb-8">Select a model from your machine to begin instant configuration.</p>
                <div className="flex gap-4">
                  {['STL', '3MF', 'STEP'].map(ext => (
                    <span key={ext} className="px-5 py-2 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg tracking-widest">{ext}</span>
                  ))}
                </div>
              </div>
            ) : (
              <ThreeDViewer file={uploadedFile} onClear={() => setUploadedFile(null)} />
            )}
          </div>
        )}

        {/* CART VIEW */}
        {currentView === 'cart' && (
          <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
              <button onClick={() => setCurrentView('home')} className="text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-2">&larr; DASHBOARD</button>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-right">Cart</h2>
            </header>
            
            {cart.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-bold">Your cart is empty.</p>
                <button onClick={() => setCurrentView('search')} className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest border-b-2 border-emerald-500">Find Models</button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition-colors">
                    <div>
                      <h4 className="font-black text-gray-900">{item.name}</h4>
                      <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">{item.source}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setCurrentView('adjust')} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest">Adjust</button>
                       <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto py-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
          <p>&copy; 2025 PrintLayers Core</p>
        </div>
      </footer>
    </div>
  );
}