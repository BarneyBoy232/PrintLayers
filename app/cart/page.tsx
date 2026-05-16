'use client';
import { ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../ClientWrapper';

export default function CartPage() {
  const { cart, setCart } = useApp();

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cart.length === 0 ? (
        <div className="flex-1 bg-black/3 dark:bg-white/3 backdrop-blur-2xl rounded-[3rem] p-20 text-center border border-black/10 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-4xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 shadow-inner text-gray-900 dark:text-white">
            <ShoppingCart size={40} />
          </div>
          <p className="font-black text-2xl uppercase mb-8 tracking-tight text-gray-900 dark:text-white">Your cart is empty</p>
          <Link href="/search" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">Start Discovering</Link>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4 w-full">
            {cart.map(item => (
              <div key={item.id} className="p-8 bg-black/3 dark:bg-white/3 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-[2.5rem] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                    <Store size={20} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.source} • {item.weight}g</p>
                  </div>
                </div>
                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-500 font-black text-[10px] uppercase hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all">Remove</button>
              </div>
            ))}
          </div>
          <div className="w-full xl:w-96 p-10 bg-black/3 dark:bg-white/3 border border-black/10 dark:border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-2xl text-gray-900 dark:text-white">
             <h3 className="font-black uppercase text-xs border-b border-black/5 dark:border-white/5 pb-4 mb-6">Quote Summary</h3>
             <div className="flex justify-between items-center mb-10 p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
               <span className="font-black text-gray-500 uppercase text-xs">Total</span>
               <span className="text-2xl font-black text-orange-500 tracking-tighter">PENDING</span>
             </div>
             <button className="w-full bg-orange-500 text-gray-950 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-400 shadow-lg active:scale-95">Request Quote</button>
          </div>
        </div>
      )}
    </div>
  );
}