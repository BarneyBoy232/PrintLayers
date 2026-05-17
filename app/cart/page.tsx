'use client';

import { ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../ClientWrapper';

export default function CartPage() {
  const { cart, setCart, isDarkMode } = useApp();

  const t = {
    heading: isDarkMode ? 'text-white' : 'text-gray-900',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    glassBg: isDarkMode ? 'bg-white/3' : 'bg-black/3',
    glassBorder: isDarkMode ? 'border-white/10' : 'border-black/10',
    glassInnerBorder: isDarkMode ? 'border-white/5' : 'border-black/5',
    itemBg: isDarkMode ? 'bg-white/5' : 'bg-black/5',
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cart.length === 0 ? (
        <div className={`flex-1 ${t.glassBg} backdrop-blur-2xl rounded-[3rem] p-20 text-center border ${t.glassBorder} shadow-2xl flex flex-col items-center justify-center`}>
          <div className={`w-24 h-24 ${t.itemBg} rounded-4xl flex items-center justify-center mb-8 border ${t.glassInnerBorder} shadow-inner ${t.muted}`}>
            <ShoppingCart size={40} />
          </div>
          <p className={`font-black text-2xl uppercase mb-8 tracking-tight ${t.heading}`}>Your cart is empty</p>
          <Link href="/search" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">Start Discovering</Link>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4 w-full">
            {cart.map(item => (
              <div key={item.id} className={`p-8 ${t.glassBg} border ${t.glassBorder} rounded-[2.5rem] flex items-center justify-between shadow-sm`}>
                <div className="flex items-center gap-4">
                  <Store className="text-orange-500" />
                  <div>
                    <h4 className={`font-black uppercase tracking-tight ${t.heading}`}>{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.source}</p>
                  </div>
                </div>
                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-500 font-black text-[10px] uppercase hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all">Remove</button>
              </div>
            ))}
          </div>
          <div className={`w-full xl:w-96 p-10 ${t.glassBg} border ${t.glassBorder} rounded-[3rem] shadow-2xl`}>
             <h3 className={`font-black uppercase text-xs border-b ${t.glassInnerBorder} pb-4 mb-6 ${t.heading}`}>Quote Summary</h3>
             <div className={`flex justify-between items-center mb-10 p-6 ${t.itemBg} rounded-2xl border ${t.glassInnerBorder} shadow-inner`}>
               <span className={`font-black uppercase text-xs ${t.muted}`}>Total</span>
               <span className="text-2xl font-black text-orange-500 tracking-tighter">PENDING</span>
             </div>
             <button className="w-full bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-400 shadow-lg active:scale-95">Request Quote</button>
          </div>
        </div>
      )}
    </div>
  );
}