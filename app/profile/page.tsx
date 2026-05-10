'use client';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="w-full max-w-4xl bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-black/10 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
          <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-4xl flex items-center justify-center text-orange-500 border border-black/5 dark:border-white/5 shadow-inner shrink-0">
            <User size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Your Account</h2>
            <p className="text-gray-500 font-medium">user@example.com</p>
          </div>
        </div>
        
        <div className="space-y-8 text-left">
          <div className="p-6 md:p-8 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-inner">
            <h4 className="font-black text-xl mb-3">Network Status</h4>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-2xl">You are currently using PrintLayers as a customer. Got hardware? Become a partner to receive printing jobs and earn money.</p>
            <Link href="/partner" className="inline-block bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95 transition-all">Register a Printer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}