'use client';
import { Store } from 'lucide-react';

export default function StorePage() {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 bg-black/3 dark:bg-white/3 backdrop-blur-2xl rounded-[3rem] p-12 text-center border border-black/10 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center">
        <div className="w-28 h-28 bg-black/5 dark:bg-white/5 rounded-4xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 text-gray-500 shadow-inner">
          <Store size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Store is Empty</h3>
        <p className="text-gray-500 font-medium text-base max-w-md mx-auto leading-relaxed">
          Popular and highly purchased prints will automatically appear here as the network grows.
        </p>
      </div>
    </div>
  );
}