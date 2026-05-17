'use client';

import { User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useApp, AddressAutocomplete } from '../ClientWrapper';

export default function ProfilePage() {
  const { user, isDarkMode, isGoogleLoaded, setUserAddress, userAddress } = useApp();

  const t = {
    bg: isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
    itemHover: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10',
    dockBg: isDarkMode ? 'bg-gray-900/80' : 'bg-white/80',
    ambientMix: isDarkMode ? 'mix-blend-screen' : 'mix-blend-normal',
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className={`w-full max-w-4xl ${t.glassBg} backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border ${t.glassBorder} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
          <div className={`w-24 h-24 ${t.itemBg} rounded-4xl flex items-center justify-center text-orange-500 border ${t.glassInnerBorder} shadow-inner shrink-0`}>
            <User size={48} />
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tight mb-2 ${t.heading}`}>Your Account</h2>
            <p className={`${t.muted} font-medium`}>{user?.email || 'Logged Out'}</p>
          </div>
        </div>
        
        <div className="space-y-8 text-left">
          <div className={`p-6 md:p-8 ${t.itemBg} rounded-[2.5rem] border ${t.glassInnerBorder} shadow-inner`}>
            <h4 className={`font-black text-xl mb-4 flex items-center gap-2 ${t.heading}`}>
              <MapPin className="text-emerald-500" size={20} /> Delivery Address
            </h4>
            <AddressAutocomplete 
              t={t} 
              placeholder={userAddress || "Start typing your address..."} 
              isLoaded={isGoogleLoaded} 
              onPlaceSelected={setUserAddress} 
            />
          </div>

          <div className={`p-6 md:p-8 ${t.itemBg} rounded-[2.5rem] border ${t.glassInnerBorder} shadow-inner`}>
            <h4 className={`font-black text-xl mb-3 ${t.heading}`}>Network Status</h4>
            <p className={`text-sm ${t.muted} mb-8 leading-relaxed max-w-2xl`}>You are currently using PrintLayers as a customer. Become a partner to receive jobs and earn.</p>
            <Link href="/partner" className="inline-block bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 active:scale-95 transition-all shadow-lg">Register a Printer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}