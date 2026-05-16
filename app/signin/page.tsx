'use client';
import { useState } from 'react';
import { User } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function SignInPage() {
  const { supabase } = useApp();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
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
    } catch (err: unknown) {
      if (err instanceof Error) setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
      <div className="w-full max-w-md bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-black/10 dark:border-white/10 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 border border-black/5 dark:border-white/5 shadow-inner">
          <User size={32} />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight text-gray-900 dark:text-white">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8">{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
        
        {authError && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl">{authError}</div>}

        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner text-gray-900 dark:text-white" />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner text-gray-900 dark:text-white" />
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-gray-950 py-4.5 rounded-2xl font-black hover:bg-orange-400 transition-all uppercase tracking-widest text-xs mt-2 shadow-lg active:scale-95 disabled:opacity-50">
            {loading ? '...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <button onClick={signInWithGoogle} className="mt-4 w-full flex items-center justify-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 py-4 rounded-2xl font-bold text-gray-900 dark:text-white hover:bg-black/10 transition-all active:scale-95 text-sm">
          Continue with Google
        </button>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
          <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-orange-500 uppercase tracking-wider transition-colors hover:text-orange-400">
            {isSignUpMode ? 'Back to Sign In' : "Join Network"}
          </button>
        </div>
      </div>
    </div>
  );
}