
import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Edit2, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageItem {
  url: string;
  title: string;
}

interface ImageViewerProps {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
  onGenerate3D: (url: string) => void;
  onEditImage: (url: string) => void;
  language: 'en' | 'zh';
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex, onClose, onGenerate3D, onEditImage, language }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsSliding(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setIsSliding(true);
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Swipe / Drag logic
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchCurrent(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchCurrent(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchCurrent === null) return;
    
    const distance = touchStart - touchCurrent;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) handleNext();
    else if (isRightSwipe) handlePrev();
    
    setTouchStart(null);
    setTouchCurrent(null);
  };

  // Calculate temporary drag offset for visual feedback
  const dragOffset = touchStart !== null && touchCurrent !== null ? touchCurrent - touchStart : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsSliding(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const t = {
    en: {
      matrix: 'Visual Matrix',
      generate3D: 'Generate 3D Model',
      edit: 'Edit Image',
      download: 'Download'
    },
    zh: {
      matrix: '视觉矩阵',
      generate3D: '制作 3D 模型',
      edit: '编辑图片',
      download: '保存到本地'
    }
  }[language];

  return (
    <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 flex justify-between items-center z-50">
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-white truncate max-w-[150px]">{currentImage.title}</h3>
          <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">{t.matrix}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-neutral-900/80 px-4 py-2 rounded-full border border-white/5 text-[10px] font-black text-neutral-400 tabular-nums">
             {currentIndex + 1} / {images.length}
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-neutral-900/80 border border-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all">
            <X size={20}/>
          </button>
        </div>
      </header>

      {/* Main Image Area */}
      <div 
        className="flex-1 flex items-center justify-center relative px-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 bg-[#D0F870]/5 blur-[140px] rounded-full" />
        
        {/* Navigation Arrows & Side Handles */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-[60] pointer-events-none">
          {/* Left Navigation Group */}
          <div className="flex items-center gap-1.5">
             <div className={`w-1 h-16 bg-neutral-800/40 rounded-full transition-all duration-300 ${currentIndex > 0 ? 'opacity-100' : 'opacity-0'}`} />
             <button 
               onClick={handlePrev}
               className={`pointer-events-auto w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-white transition-all bg-black/20 rounded-full backdrop-blur-sm ${currentIndex > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
             >
                <ChevronLeft size={28} strokeWidth={3} />
             </button>
          </div>
          
          {/* Right Navigation Group */}
          <div className="flex items-center gap-1.5">
             <button 
               onClick={handleNext}
               className={`pointer-events-auto w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-white transition-all bg-black/20 rounded-full backdrop-blur-sm ${currentIndex < images.length - 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
             >
                <ChevronRight size={28} strokeWidth={3} />
             </button>
             <div className={`w-1 h-16 bg-neutral-800/40 rounded-full transition-all duration-300 ${currentIndex < images.length - 1 ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>

        {/* Sliding Image Container */}
        <div 
          className="relative w-full max-w-[340px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${dragOffset}px)` }}
        >
          <div 
            className={`w-full h-full transition-all duration-300 ease-out ${isSliding ? 'scale-95 opacity-40 blur-sm' : 'scale-100 opacity-100'}`}
          >
            <img 
              src={currentImage.url} 
              className="w-full h-full object-cover rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,1)] border border-white/5 relative z-10" 
              alt="" 
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-8 pb-16 space-y-4 relative z-10">
        <button 
          onClick={() => onGenerate3D(currentImage.url)}
          className="w-full h-[72px] bg-gradient-to-r from-[#D0F870] via-[#FBBAC1] to-[#F9A8D4] rounded-[30px] font-bold text-lg text-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all"
        >
          <Sparkles size={20} className="text-black" /> {t.generate3D}
        </button>
        
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => onEditImage(currentImage.url)} 
             className="h-[64px] bg-neutral-900 border border-white/5 rounded-[28px] font-bold text-[11px] text-white flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all"
           >
             <Edit2 size={16} className="text-neutral-400" /> {t.edit}
           </button>
           <button className="h-[64px] bg-neutral-900 border border-white/5 rounded-[28px] font-bold text-[11px] text-white flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all">
             <Download size={16} className="text-neutral-400" /> {t.download}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
