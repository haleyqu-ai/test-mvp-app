
import React, { useState, useEffect } from 'react';
import { ASSETS_MODELS, EXPORTED_FILES, ASSETS_IMAGES } from '../constants';
import { Model, NavTab } from '../types';
import { Clock, CheckCircle2, Loader2, MoreVertical, FileDown, Box, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';

interface AssetsProps {
  onModelClick: (model: Model) => void;
  isSubscribed: boolean;
  onGenerate3D: (url: string) => void;
  onEditImage: (url: string) => void;
  onImageClick: (url: string, title: string) => void;
  onNavigateToCreate: () => void;
}

const ImageWithPlaceholder: React.FC<{ src: string; alt: string; className?: string; onClick?: () => void }> = ({ src, alt, className, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative bg-neutral-900/60 overflow-hidden ${className}`} onClick={onClick}>
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
          <ImageIcon size={24} className="text-neutral-700" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Assets: React.FC<AssetsProps> = ({ onModelClick, isSubscribed, onGenerate3D, onEditImage, onImageClick, onNavigateToCreate }) => {
  const [subTab, setSubTab] = useState<'models' | 'images' | 'exports'>('models');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsGenerating(false), 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="flex flex-col h-full bg-meshy-dark relative">
      <div className="p-4 bg-neutral-950/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="flex p-1 bg-neutral-900 rounded-2xl">
          {[
            { id: 'models', label: 'Models', icon: Box },
            { id: 'images', label: 'Image', icon: ImageIcon },
            { id: 'exports', label: 'Files', icon: FileDown },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                subTab === t.id ? 'bg-[#D0F870] text-black shadow-lg' : 'text-neutral-500'
              }`}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        {subTab === 'models' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 px-2">Model Workspace</h2>
            <div className="grid grid-cols-2 gap-4">
              {ASSETS_MODELS.map((model) => (
                <div 
                  key={model.id}
                  className={`group relative bg-neutral-900/60 rounded-[32px] overflow-hidden border border-white/5 transition-all active:scale-[0.98] flex flex-col`}
                >
                  <div className="aspect-square relative cursor-pointer" onClick={() => model.status === 'ready' && onModelClick(model)}>
                    <ImageWithPlaceholder 
                      src={model.thumbnail} 
                      alt={model.title} 
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3">
                      {model.status === 'ready' ? (
                        <div className="bg-green-500 p-1 rounded-lg shadow-lg"><CheckCircle2 size={12} className="text-white" /></div>
                      ) : (
                        <div className="bg-[#D0F870] p-1 rounded-lg shadow-lg"><Loader2 size={12} className="text-black animate-spin" /></div>
                      )}
                    </div>
                  </div>
                  <div className="p-3.5 bg-black/40">
                    <h3 className="text-[10px] font-black uppercase mb-1.5 truncate text-white/90">{model.title}</h3>
                    <div className="flex items-center gap-2 text-neutral-500">
                       <Clock size={10} />
                       <span className="text-[8px] font-black uppercase tracking-widest">{model.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-2 pb-4">
              <button 
                onClick={onNavigateToCreate}
                className="w-full py-5 bg-neutral-900 border border-white/10 rounded-[28px] flex items-center justify-center gap-3 active:scale-[0.97] active:bg-neutral-800 transition-all text-[#D0F870] font-black text-[10px] uppercase tracking-[0.25em] shadow-xl"
              >
                <Plus size={16} />
                Create New Neural Asset
              </button>
            </div>
          </div>
        )}

        {subTab === 'images' && (
          <div className="grid grid-cols-2 gap-4">
            {ASSETS_IMAGES.map((img) => (
              <div 
                key={img.id}
                onClick={() => onImageClick(img.url, img.title)}
                className="bg-neutral-900/60 rounded-[32px] overflow-hidden border border-white/5 group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithPlaceholder 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="p-3.5">
                  <h3 className="text-[10px] font-black uppercase text-white/80 truncate">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === 'exports' && (
          <div className="flex flex-col gap-3">
            {EXPORTED_FILES.map(file => (
              <div key={file.id} className="bg-neutral-900/60 p-4 rounded-3xl border border-white/5 flex items-center justify-between group active:bg-neutral-800 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#D0F870]/10 rounded-2xl text-[#D0F870]"><FileDown size={20} /></div>
                    <div>
                       <h4 className="text-xs font-black text-white/90 truncate max-w-[150px]">{file.name}</h4>
                       <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tighter">Open in External App</p>
                    </div>
                 </div>
                 <button className="p-2 text-neutral-500"><MoreVertical size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
           <div className="relative w-48 h-48 mb-12">
              <div className="absolute inset-0 border-[3px] border-[#D0F870]/10 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-transparent border-t-[#D0F870] rounded-full animate-spin" />
              <div className="absolute inset-4 border border-[#D0F870]/5 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 bg-[#D0F870]/20 rounded-full blur-2xl animate-pulse" />
              </div>
           </div>
           <div className="w-full max-w-[280px] space-y-4">
              <div className="flex justify-between items-end mb-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D0F870] animate-pulse">Neural Reconstructing</span>
                 <span className="text-xs font-black text-white">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-[#D0F870] shadow-[0_0_10px_rgba(208,248,112,1)] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
