'use client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  // Temporary empty cart mock until global state is wired up
  const cart: { id: string }[] = []; 

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cart.length === 0 ? (
        <div className="flex-1 bg-black/3 dark:bg-white/3 backdrop-blur-2xl rounded-[3rem] p-20 text-center border border-black/10 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-4xl flex items-center justify-center mb-8 text-gray-500 border border-black/5 dark:border-white/5 shadow-inner">
            <ShoppingCart size={40} />
          </div>
          <p className="font-black text-2xl uppercase mb-8 tracking-tight">Your cart is empty</p>
          <Link href="/search" className="bg-orange-500 text-gray-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all">Start Discovering</Link>
        </div>
      ) : (
        <div className="text-center p-10 font-black">Cart Items Go Here</div>
      )}
    </div>
  );
}