'use client';

import { useState } from 'react';
import { BarChart3, ListOrdered, Printer, Users } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function AdminPage() {
  const { user, admins, isDarkMode } = useApp();
  const [adminTab, setAdminTab] = useState('overview');

  const t = {
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
  };

  if (!user || !admins.includes(user.email ?? '')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
        <h2 className={`text-3xl font-black tracking-tight uppercase mb-4 text-red-500`}>Access Denied</h2>
        <p className={`${t.muted}`}>Admin credentials required to view this panel.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`w-full ${t.glassBg} backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] shadow-2xl border ${t.glassBorder} text-left min-h-[70vh]`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className={`text-4xl font-black tracking-tight uppercase mb-2 ${t.heading}`}>Admin Dashboard</h2>
            <p className={`${t.muted}`}>Platform control center and network health.</p>
          </div>
          
          <div className={`flex flex-wrap gap-2 p-2 ${t.itemBg} rounded-2xl border ${t.glassInnerBorder} shadow-inner`}>
            {[
              { id: 'overview', icon: <BarChart3 size={16} />, label: 'Overview' },
              { id: 'orders', icon: <ListOrdered size={16} />, label: 'Orders' },
              { id: 'partners', icon: <Printer size={16} />, label: 'Partners' },
              { id: 'accounts', icon: <Users size={16} />, label: 'Accounts' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setAdminTab(tab.id)} 
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${adminTab === tab.id ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {tab.icon} <span className="hidden sm:inline ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {adminTab === 'overview' && (
             <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
               <div className={`p-8 ${t.itemBg} rounded-4xl border ${t.glassInnerBorder} text-center shadow-inner`}>
                 <p className={`text-xs font-black uppercase tracking-widest ${t.muted} mb-2`}>Total Volume (30d)</p>
                 <p className="text-4xl font-black text-emerald-500 tracking-tighter">$0.00</p>
               </div>
               <div className={`p-8 ${t.itemBg} rounded-4xl border ${t.glassInnerBorder} text-center shadow-inner`}>
                 <p className={`text-xs font-black uppercase tracking-widest ${t.muted} mb-2`}>Platform Fees</p>
                 <p className="text-4xl font-black text-purple-500 tracking-tighter">$0.00</p>
               </div>
               <div className={`p-8 ${t.itemBg} rounded-4xl border ${t.glassInnerBorder} text-center shadow-inner`}>
                 <p className={`text-xs font-black uppercase tracking-widest ${t.muted} mb-2`}>Pending Payouts</p>
                 <p className="text-4xl font-black text-orange-500 tracking-tighter">$0.00</p>
               </div>
             </div>
          )}
          {adminTab !== 'overview' && (
            <div className={`h-64 flex flex-col items-center justify-center ${t.muted} italic font-bold`}>
              No active {adminTab} data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}