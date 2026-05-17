'use client';

import { useState, useRef } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useApp } from '../ClientWrapper';

export default function AdjustPage() {
  const { cart, setCart, isDarkMode } = useApp();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weight, setWeight] = useState(0);
  const [showConfig, setShowConfig] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleAddToCart = () => {
    if (!uploadedFile) return;
    setCart([
      ...cart,
      {
        id: Math.random().toString(36).substring(2, 11),
        name: uploadedFile.name,
        source: 'Direct Upload',
        price: 'Pending',
        material: 'Awaiting Quote',
        color: 'Default',
        weight: weight || 15
      }
    ]);
    setUploadedFile(null);
  };

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
      {!uploadedFile ? (
        <div onClick={() => fileInputRef.current?.click()} className={`flex-1 group w-full border-[3px] border-dashed ${t.glassBorder} rounded-[3rem] ${t.glassBg} backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-orange-500/50 transition-all duration-500`}>
          <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
          <div className={`w-28 h-28 ${t.glassBg} rounded-4xl flex items-center justify-center mb-8 border ${t.glassInnerBorder} group-hover:scale-110 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-500 shadow-inner`}>
            <Plus size={48} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
          </div>
          <h3 className={`text-3xl font-black mb-3 uppercase tracking-tighter group-hover:text-orange-500 transition-colors ${t.heading}`}>Drop 3D File Here</h3>
          <p className={`${t.muted} font-medium text-sm tracking-wide`}>Supports .STL, .3MF, .STEP</p>
        </div>
      ) : ( 
        <div className={`w-full flex-1 min-h-125 ${t.glassBg} backdrop-blur-2xl rounded-[3rem] overflow-hidden relative border ${t.glassBorder} shadow-2xl flex flex-col`}>
          {!showConfig ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse border border-orange-500/20">
                <Settings className="w-12 h-12 text-orange-400" />
              </div>
              <h2 className={`text-3xl font-black tracking-tighter uppercase mb-3 ${t.heading}`}>{uploadedFile.name}</h2>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button onClick={() => setShowConfig(true)} className="flex-1 bg-orange-500 hover:bg-orange-400 text-gray-950 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95">Configure Print</button>
                <button onClick={() => setUploadedFile(null)} className={`flex-1 ${t.itemBg} py-4 rounded-2xl font-bold transition-all border ${t.glassBorder} active:scale-95 ${t.heading}`}>Clear File</button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 bg-white/60 dark:bg-black/40 backdrop-blur-xl">
              <div className={`flex-1 rounded-4xl bg-linear-to-br from-orange-500/10 to-transparent border ${t.glassInnerBorder} flex items-center justify-center text-orange-500/50 font-black text-2xl tracking-widest shadow-inner`}>
                3D PREVIEW ENGINE
              </div>
              <div className="w-full md:w-96 flex flex-col space-y-6">
                <h3 className={`font-black uppercase text-xs tracking-[0.2em] border-b ${t.glassInnerBorder} pb-3 flex items-center gap-2 ${t.heading}`}>
                  <Settings size={14} className="text-orange-500" /> Print Config
                </h3>
                <div>
                  <label className={`block text-[10px] font-black ${t.muted} uppercase mb-2`}>Estimated Weight (g)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={`w-full ${t.glassBg} border ${t.glassBorder} rounded-xl p-4 font-bold outline-none focus:border-orange-500 ${t.heading}`} />
                </div>
                <button onClick={handleAddToCart} className="w-full bg-orange-500 text-gray-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 transition-all active:scale-95 shadow-lg">Add to Cart</button>
                <button onClick={() => setShowConfig(false)} className={`text-xs font-black ${t.muted} uppercase tracking-widest text-center mt-2 hover:text-orange-500 transition-colors`}>Back to Viewer</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}