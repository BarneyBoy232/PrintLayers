'use client';
import { useState } from 'react';
import { User } from 'lucide-react';

export default function SignInPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
      <div className="w-full max-w-md bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-black/10 dark:border-white/10 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 border border-black/5 dark:border-white/5 shadow-inner">
          <User size={32} />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8">{isSignUpMode ? 'Join the network' : 'Enter details to continue'}</p>
        
        <form className="space-y-4 text-left">
          <input type="email" placeholder="Email Address" required className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner" />
          <input type="password" placeholder="Password" required className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner" />
          {isSignUpMode && <input type="password" placeholder="Confirm Password" required className="w-full px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none focus:border-orange-500 text-sm font-medium transition-all shadow-inner" />}
          <button type="submit" className="w-full bg-orange-500 text-gray-950 py-4.5 rounded-2xl font-black hover:bg-orange-400 transition-all uppercase tracking-widest text-xs mt-2 shadow-lg active:scale-95">
            {isSignUpMode ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
          <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-xs font-black text-orange-500 uppercase tracking-wider transition-colors hover:text-orange-400">
            {isSignUpMode ? 'Back to Sign In' : "Join Network"}
          </button>
        </div>
      </div>
    </div>
  );
}