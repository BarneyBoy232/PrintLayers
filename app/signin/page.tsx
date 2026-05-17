'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function SignInPage() {
  const { supabase, isDarkMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setAuthError(null);

    if (isSignUpMode && password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

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
      const errorMsg = err instanceof Error ? err.message : "Authentication error occurred.";
      setAuthError(errorMsg);
    }
  };

  const t = {
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
  };

  return (
    <div className="flex-1 flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
      <div className={`w-full max-w-md ${t.glassBg} backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-center relative overflow-hidden`}>
        <div className={`w-16 h-16 ${t.itemBg} rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 border ${t.glassInnerBorder} shadow-inner`}>
          <User size={32} />
        </div>
        <h2 className={`text-3xl font-black mb-2 tracking-tight ${t.heading}`}>{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
        <p className={`${t.muted} font-bold text-xs uppercase tracking-widest mb-8`}>{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
        
        {authError && (
          <div className="mb-4 text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {authError}
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleEmailAuth}>
          <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className={`w-full px-5 py-4 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner ${t.heading}`} />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className={`w-full px-5 py-4 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner ${t.heading}`} />
          {isSignUpMode && <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`w-full px-5 py-4 rounded-2xl ${t.itemBg} border ${t.glassInnerBorder} outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner ${t.heading}`} />}
          <button type="submit" className="w-full bg-orange-500 text-gray-950 py-4.5 rounded-2xl font-black hover:bg-orange-400 transition-all uppercase tracking-widest text-xs mt-2 shadow-lg active:scale-95">
            {isSignUpMode ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className={`mt-8 pt-6 border-t ${t.glassInnerBorder}`}>
          <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-orange-500 uppercase tracking-wider transition-colors hover:text-orange-400">
            {isSignUpMode ? 'Back to Sign In' : "Join Network"}
          </button>
        </div>
      </div>
    </div>
  );
}