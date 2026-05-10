'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [adminTab, setAdminTab] = useState('overview');

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full bg-black/3 dark:bg-white/3 backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] shadow-2xl border border-black/10 dark:border-white/10 text-left min-h-[70vh]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase mb-2">Admin Dashboard</h2>
            <p className="text-gray-500">Platform control center and network health.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
            {['overview', 'orders', 'partners', 'accounts'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setAdminTab(tab)} 
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminTab === tab ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {adminTab === 'overview' && (
             <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
               <div className="p-8 bg-black/5 dark:bg-white/5 rounded-4xl border border-black/5 dark:border-white/5 text-center">
                 <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Total Volume (30d)</p>
                 <p className="text-4xl font-black text-emerald-500">$0.00</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}