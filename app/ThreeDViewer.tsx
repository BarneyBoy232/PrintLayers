'use client';

import React from 'react';

export default function ThreeDViewer() {
  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-3xl overflow-hidden relative border border-gray-800 shadow-2xl">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">3D STL Adjuster</h2>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          The 3D visualization engine is ready. Upload a file to scale, rotate, and estimate print costs in real-time.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold transition-all">
            Upload STL
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl font-bold transition-all border border-white/10">
            View Library
          </button>
        </div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>
    </div>
  );
}