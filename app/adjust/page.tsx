'use client';
import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

export default function AdjustPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!uploadedFile ? (
        <div onClick={() => fileInputRef.current?.click()} className="flex-1 group w-full border-[3px] border-dashed border-black/10 dark:border-white/10 rounded-[3rem] bg-black/5 dark:bg-white/5 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:border-orange-500/50 transition-all duration-500">
          <input type="file" ref={fileInputRef} className="hidden" accept=".stl,.3mf,.step,.stp" onChange={handleFileUpload} />
          <div className="w-28 h-28 bg-black/3 dark:bg-white/3 rounded-4xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 group-hover:scale-110 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-500 shadow-inner">
            <Plus size={48} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
          </div>
          <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter group-hover:text-orange-500 transition-colors">Drop 3D File Here</h3>
          <p className="text-gray-500 font-medium text-sm tracking-wide">Supports .STL, .3MF, .STEP</p>
        </div>
      ) : ( 
        <div className="flex-1 flex flex-col items-center justify-center bg-black/3 dark:bg-white/3 rounded-[3rem] border border-black/10 dark:border-white/10">
          <h2 className="text-3xl font-black uppercase mb-4">{uploadedFile.name}</h2>
          <button onClick={() => setUploadedFile(null)} className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-xl font-bold">Clear File</button>
        </div>
      )}
    </div>
  );
}