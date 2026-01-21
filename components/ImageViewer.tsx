
import React from 'react';
import { X, Sparkles, Edit2, Download, Share2 } from 'lucide-react';

interface ImageViewerProps {
  image: { url: string; title: string };
  onClose: () => void;
  onGenerate3D: (url: string) => void;
  onEditImage: (url: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onGenerate3D, onEditImage }) => {
  return (
    <div className="absolute inset-0 z-[400] bg-black/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-300">
      <header className="p-6 flex justify-between items-center z-10">
        <div className="flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">{image.title}</h3>
          <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Neural Visual Matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-neutral-900 border border-white/5 rounded-2xl text-neutral-400 active:scale-90 transition-all">
            <Share2 size={18} />
          </button>
          <button onClick={onClose} className="p-2.5 bg-neutral-900 border border-white/10 rounded-2xl text-white active:scale-90 transition-all">
            <X size={20}/>
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#D0F870]/5 blur-[120px] rounded-full" />
        <img 
          src={image.url} 
          className="w-full aspect-square object-cover rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 relative z-10" 
          alt="" 
        />
      </div>

      <div className="p-10 pb-16 grid grid-cols-1 gap-4 relative z-10">
        <button 
          onClick={() => onGenerate3D(image.url)}
          className="w-full bg-[#D0F870] py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] text-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(208,248,112,0.2)] active:scale-95 transition-all"
        >
          <Sparkles size={18} className="text-black" /> Generate 3D Mesh
        </button>
        <div className="grid grid-cols-2 gap-4">
           <button onClick={() => onEditImage(image.url)} className="bg-neutral-900 border border-white/5 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2 active:scale-95 transition-all">
             <Edit2 size={16} /> Edit Matrix
           </button>
           <button className="bg-neutral-900 border border-white/5 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2 active:scale-95 transition-all">
             <Download size={16} /> Download
           </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
