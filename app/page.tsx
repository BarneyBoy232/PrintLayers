'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * TYPES & INTERFACES
 */
interface SupabaseUser {
  id: string;
  email?: string;
}

type View = 'home' | 'search' | 'adjust' | 'store' | 'partner' | 'signin';

// --- Consolidated 3D Viewer Component ---
function ThreeDViewer() {
  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-3xl overflow-hidden relative border border-gray-800 shadow-2xl">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">3D STL Adjuster</h2>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          The 3D visualization engine is ready. Upload a file to scale, rotate, and estimate print costs in real-time.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
            Upload STL
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl font-bold transition-all border border-white/10">
            View Library
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
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
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const isInitialized = useRef(false);

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

      // Check initial session
      client.auth.getSession().then(({ data: { session }, error }: any) => {
        if (error) console.error("Session check error:", error);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = client.auth.onAuthStateChange((event: string, session: any) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Handle successful sign-in redirect
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
        setAuthError("Success! Check your email for a confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.");
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
          // redirectTo is critical. If it shows only an icon, 
          // the domain likely needs to be added to Supabase dashboard 'Redirect URLs'
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
      setAuthError(err.message || "OAuth failed. Ensure popups are allowed and redirect URL is whitelisted in Supabase.");
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const navigateTo = (view: View) => {
    if (!user && view !== 'home') {
      setCurrentView('signin');
      return;
    }
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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

          <div className="flex gap-6 text-sm font-medium text-gray-600 z-10">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-xs hidden md:inline tracking-tight font-bold">{user.email}</span>
                <button onClick={handleSignOut} className="text-gray-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-wider">Sign Out</button>
              </div>
            ) : (
              currentView !== 'signin' && (
                <button onClick={() => setCurrentView('signin')} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors uppercase tracking-wider text-xs">Sign In</button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow flex flex-col">
        
        {/* SIGN IN VIEW */}
        {currentView === 'signin' && (
          <div className="flex-grow flex items-center justify-center py-12">
            <div className="w-full max-w-md">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-gray-100">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                    {isSignUpMode ? 'Create an account' : 'Welcome to PrintLayers'}
                  </h1>
                  <p className="text-gray-500 font-medium">
                    {isSignUpMode ? 'Join the community-powered manufacturing network' : 'Enter your details to get started'}
                  </p>
                </div>
                
                {authError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in zoom-in duration-300 text-center">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1" htmlFor="email">Email Address</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1" htmlFor="password">Password</label>
                    <input 
                      id="password"
                      name="password"
                      type="password" 
                      required
                      autoComplete={isSignUpMode ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  {isSignUpMode && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1" htmlFor="confirm-password">Confirm Password</label>
                      <input 
                        id="confirm-password"
                        name="confirm-password"
                        type="password" 
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                  <button 
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                  >
                    {authSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (isSignUpMode ? 'Create Account' : 'Sign In')}
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
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 px-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>

                <div className="mt-8 text-center border-t border-gray-50 pt-6">
                  <button 
                    onClick={() => {
                      setIsSignUpMode(!isSignUpMode);
                      setAuthError(null);
                    }}
                    className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider"
                  >
                    {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView('home')}
                className="w-full mt-6 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors"
              >
                &larr; Back to Home
              </button>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              <div className="flex flex-col bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-900/10 border border-emerald-700 relative overflow-hidden text-white group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => navigateTo('search')}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-bl-full -mr-8 -mt-8 z-0 opacity-40 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-black text-xl mb-2 text-white">Find Files</h3>
                  <p className="text-sm text-emerald-50 mb-6 leading-relaxed opacity-90">Search MakerWorld & Thingiverse. No design skills needed.</p>
                  <div className="mt-auto">
                    <button className="w-full bg-white text-emerald-700 py-2.5 rounded-xl text-sm font-black shadow-sm group-hover:bg-emerald-50 transition-colors">
                      {user ? 'Search Library' : 'Sign in to Search'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group cursor-pointer hover:-translate-y-1" onClick={() => navigateTo('adjust')}>
                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors text-gray-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <h3 className="font-black text-xl text-gray-900 mb-2">Upload & Print</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Have an STL? Configure materials, infill, and scale for pricing.</p>
                <div className="mt-auto">
                  <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-black shadow-sm hover:bg-gray-800 transition-colors">
                    {user ? 'Start Quote' : 'Sign in to Quote'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group cursor-pointer hover:-translate-y-1" onClick={() => navigateTo('store')}>
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors text-purple-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <h3 className="font-black text-xl text-gray-900 mb-2">Parts Store</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Browse ready-to-print utility parts and printer upgrades.</p>
                <div className="mt-auto">
                  <button className="w-full bg-white border-2 border-gray-100 text-gray-700 py-2 rounded-xl text-sm font-black hover:bg-gray-50 transition-all">
                    {user ? 'Browse Shop' : 'Sign in to Browse'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mt-20"></div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="font-black text-2xl mb-3">Own a Printer? Join the Network.</h3>
                <p className="text-gray-400 text-sm max-w-lg leading-relaxed">Add your machine to our manufacturing pool. Receive verified jobs and earn money per print.</p>
              </div>
              <button onClick={() => navigateTo('partner')} className="relative z-10 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                {user ? 'Register Printer' : 'Sign in to Register'}
              </button>
            </div>
          </div>
        )}

        {currentView === 'adjust' && (
          <div className="space-y-6 flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setCurrentView('home')} className="text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-2 transition-colors">
              <span className="text-lg">&larr;</span> Back to Dashboard
            </button>
            <ThreeDViewer />
          </div>
        )}

        {['search', 'store', 'partner'].includes(currentView) && (
          <div className="space-y-6 flex-grow flex flex-col">
            <button onClick={() => setCurrentView('home')} className="text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-2">
              <span className="text-lg">&larr;</span> Back to Dashboard
            </button>
            <div className="bg-white rounded-[2rem] border border-gray-200 p-20 text-center flex-grow flex flex-col items-center justify-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h2 className="text-2xl font-black mb-4 capitalize text-gray-900">{currentView} Engine</h2>
              <p className="text-gray-500 max-w-xs mx-auto font-medium">This module is currently being connected to the PrintLayers API. Functional preview coming soon.</p>
              <button onClick={() => setCurrentView('home')} className="mt-10 text-emerald-600 font-black hover:underline transition-all">Return to Dashboard</button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto py-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400 font-bold">
          <p>&copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}