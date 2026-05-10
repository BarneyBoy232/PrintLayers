'use client';
import { Printer } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Partner Registration</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">Connect your hardware to the decentralized manufacturing pool and start earning.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-xl md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-[1.25rem] flex items-center justify-center text-blue-500 border border-black/5 dark:border-white/5 shadow-inner">
                <Printer size={20} />
              </div>
              <h3 className="font-black text-xl tracking-tight">Your First Printer</h3>
            </div>
            <input type="text" placeholder="Make & Model (e.g. Bambu X1C)" className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-500 mb-6 shadow-inner" />
            <button className="w-full bg-blue-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-400 transition-all shadow-lg active:scale-95">Submit Registration</button>
          </div>
        </div>
      </div>
    </div>
  );
}