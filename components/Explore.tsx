
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EXPLORE_CHANNELS, MOCK_MODELS } from '../constants';
import { Model } from '../types';
import { Box, Image as ImageIcon } from 'lucide-react';

interface ExploreProps {
  onModelClick: (model: Model, isWorkspace: boolean) => void;
  onNavigateToCreate: (mode: 'image3d' | 'genImage') => void;
  language: 'en' | 'zh';
}

const SkeletonCard: React.FC<{ height: number }> = ({ height }) => (
  <div className="bg-neutral-900/40 rounded-[24px] overflow-hidden mb-4 animate-pulse border border-white/5">
    <div className="w-full bg-neutral-800" style={{ height: `${height}px` }} />
    <div className="p-4 space-y-2.5">
      <div className="h-2.5 w-2/3 bg-neutral-800 rounded" />
      <div className="h-2 w-1/3 bg-neutral-800 rounded" />
    </div>
  </div>
);

const ModelCard: React.FC<{ model: Model; onClick: (model: Model) => void; index: number }> = ({ model, onClick, index }) => {
  const aspectClass = index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]';
  const minHeight = 'min-h-[180px]';
  const [loaded, setLoaded] = useState(false);

  return (
    <div 
      className="group relative bg-neutral-900/40 rounded-[24px] overflow-hidden border border-white/5 flex flex-col active:scale-[0.97] transition-all duration-300 mb-4 shadow-[0_15px_30px_rgba(0,0,0,0.4)] cursor-pointer"
      onClick={() => onClick(model)}
    >
      <div className={`relative w-full overflow-hidden bg-neutral-900/50 ${aspectClass} ${minHeight}`}>
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse" />
        )}
        
        <img 
          src={model.thumbnail} 
          alt={model.title} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
        
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10 z-10">
          <span className="text-[10px]">❤️</span>
          <span className="text-[9px] font-black text-white/90">
            {model.stats.likes >= 1000 ? (model.stats.likes/1000).toFixed(1) + 'k' : model.stats.likes}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 bg-neutral-900/95 backdrop-blur-md border-t border-white/5 shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-tight truncate text-white leading-tight">{model.title}</h3>
      </div>
    </div>
  );
};

const Explore: React.FC<ExploreProps> = ({ onModelClick, onNavigateToCreate, language }) => {
  const [activeChannel, setActiveChannel] = useState(EXPLORE_CHANNELS[0]);
  const [loading, setLoading] = useState(true);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  
  // Dragging state
  const isDraggingH = useRef(false);
  const isDraggingV = useRef(false);
  const startPosH = useRef({ x: 0, scrollLeft: 0 });
  const startPosV = useRef({ y: 0, scrollTop: 0 });
  
  // Momentum state
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocityV = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const t = {
    en: {
      ai3d: 'AI 3D',
      aiImage: 'AI Image'
    },
    zh: {
      ai3d: 'AI 3D',
      aiImage: 'AI 图片'
    }
  }[language];

  const channelMap: Record<string, { en: string; zh: string }> = {
    'Featured': { en: 'Featured', zh: '精品' },
    'Trending': { en: 'Trending', zh: '热门' },
    '3D Print': { en: '3D Print', zh: '3D打印' },
    'Fantasy': { en: 'Fantasy', zh: '幻想' },
    'Kids': { en: 'Kids', zh: '儿童' },
    'Character': { en: 'Character', zh: '角色' },
    'Detailed': { en: 'Detailed', zh: '精细' },
    'Most Downloads': { en: 'Most Downloads', zh: '最多下载' }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeChannel]);

  const filteredModels = useMemo(() => {
    const models = MOCK_MODELS.filter(m => 
      activeChannel === 'Featured' ? m.tags.includes('Featured') : m.tags.includes(activeChannel)
    );
    return models.length >= 6 ? models : MOCK_MODELS.slice(0, 12);
  }, [activeChannel]);

  const leftColumnModels = useMemo(() => filteredModels.filter((_, i) => i % 2 === 0), [filteredModels]);
  const rightColumnModels = useMemo(() => filteredModels.filter((_, i) => i % 2 !== 0), [filteredModels]);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeChannel]);

  // Horizontal Dragging Logic (Simpler)
  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    const slider = horizontalScrollRef.current;
    if (!slider) return;
    isDraggingH.current = true;
    startPosH.current = {
      x: e.pageX - slider.offsetLeft,
      scrollLeft: slider.scrollLeft
    };
    slider.style.cursor = 'grabbing';
    slider.style.userSelect = 'none';
    e.stopPropagation();
  };

  const handleHorizontalMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingH.current || !horizontalScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - horizontalScrollRef.current.offsetLeft;
    const walk = (x - startPosH.current.x) * 2;
    horizontalScrollRef.current.scrollLeft = startPosH.current.scrollLeft - walk;
  };

  // Vertical Inertial Dragging Logic
  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    const container = verticalScrollRef.current;
    if (!container) return;
    
    // Stop any existing momentum animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isDraggingV.current = true;
    startPosV.current = {
      y: e.pageY - container.offsetTop,
      scrollTop: container.scrollTop
    };
    
    lastY.current = e.pageY;
    lastTime.current = Date.now();
    velocityV.current = 0;
    
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleVerticalMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingV.current || !verticalScrollRef.current) return;
    
    const container = verticalScrollRef.current;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime.current;
    
    if (timeDelta > 0) {
      const yDelta = e.pageY - lastY.current;
      // Calculate velocity (pixels per millisecond)
      velocityV.current = yDelta / timeDelta;
      
      lastY.current = e.pageY;
      lastTime.current = currentTime;
    }

    const y = e.pageY - container.offsetTop;
    const walk = (y - startPosV.current.y) * 1.0; // 1:1 ratio for direct follow
    container.scrollTop = startPosV.current.scrollTop - walk;
  };

  const applyMomentum = () => {
    if (!verticalScrollRef.current) return;
    
    const friction = 0.96; // Adjust for how slippery it feels
    const stopThreshold = 0.1;
    
    const step = () => {
      if (!verticalScrollRef.current) return;
      
      verticalScrollRef.current.scrollTop -= velocityV.current * 16; // multiplier for frame time
      velocityV.current *= friction;

      if (Math.abs(velocityV.current) > stopThreshold) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        velocityV.current = 0;
        animationFrameRef.current = null;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleGlobalMouseUp = () => {
    if (isDraggingV.current) {
      applyMomentum();
    }
    
    isDraggingH.current = false;
    isDraggingV.current = false;
    
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.style.cursor = 'grab';
      horizontalScrollRef.current.style.removeProperty('user-select');
    }
    if (verticalScrollRef.current) {
      verticalScrollRef.current.style.cursor = 'default';
      verticalScrollRef.current.style.removeProperty('user-select');
    }
  };

  const handleChannelClick = (channel: string, e: React.MouseEvent) => {
    if (!horizontalScrollRef.current) return;
    const x = e.pageX - horizontalScrollRef.current.offsetLeft;
    const moveX = Math.abs(x - startPosH.current.x);
    if (moveX > 5) return;
    setActiveChannel(channel);
  };

  const handleModelClickThrottled = (model: Model, e: React.MouseEvent) => {
    // If we're moving fast, don't trigger click
    if (Math.abs(velocityV.current) > 0.5) return;
    
    if (!verticalScrollRef.current) return;
    const y = e.pageY - verticalScrollRef.current.offsetTop;
    const moveY = Math.abs(y - startPosV.current.y);
    if (moveY > 8) return; // Allow for slight tremor on touch release
    
    onModelClick(model, false);
  };

  return (
    <div 
      className="flex flex-col h-full bg-meshy-dark min-h-0 overflow-hidden"
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
    >
      <div 
        ref={verticalScrollRef}
        onMouseDown={handleVerticalMouseDown}
        onMouseMove={handleVerticalMouseMove}
        className="flex-1 overflow-y-auto hide-scrollbar select-none cursor-default"
      >
        {/* Header content that scrolls away */}
        <div className="pt-4 pb-4 px-4 flex gap-3">
          <button 
            onMouseUp={(e) => {
               const y = e.pageY - (verticalScrollRef.current?.offsetTop || 0);
               if (Math.abs(y - startPosV.current.y) <= 8 && Math.abs(velocityV.current) < 0.2) onNavigateToCreate('image3d');
            }}
            className="flex-1 h-14 bg-neutral-900/60 border border-white/5 rounded-2xl flex items-center justify-center gap-2.5 active:scale-[0.97] active:bg-neutral-800 transition-all group overflow-hidden relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#D0F870]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Box size={18} className="text-[#D0F870]" />
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">{t.ai3d}</span>
          </button>
          <button 
            onMouseUp={(e) => {
              const y = e.pageY - (verticalScrollRef.current?.offsetTop || 0);
              if (Math.abs(y - startPosV.current.y) <= 8 && Math.abs(velocityV.current) < 0.2) onNavigateToCreate('genImage');
            }}
            className="flex-1 h-14 bg-neutral-900/60 border border-white/5 rounded-2xl flex items-center justify-center gap-2.5 active:scale-[0.97] active:bg-neutral-800 transition-all group overflow-hidden relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C084FC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ImageIcon size={18} className="text-[#C084FC]" />
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">{t.aiImage}</span>
          </button>
        </div>

        {/* Sticky Channel Tabs */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 z-[60] pt-2 pb-1.5 shadow-xl">
          <div 
            ref={horizontalScrollRef}
            onMouseDown={handleHorizontalMouseDown}
            onMouseMove={handleHorizontalMouseMove}
            className="overflow-x-auto hide-scrollbar flex whitespace-nowrap px-4 gap-7 scroll-smooth select-none cursor-grab"
          >
            {EXPLORE_CHANNELS.map((channel) => (
              <button
                key={channel}
                ref={activeChannel === channel ? activeTabRef : null}
                onMouseUp={(e) => handleChannelClick(channel, e)}
                className={`pb-3 pt-1 text-[10px] font-black uppercase tracking-[0.12em] transition-all relative shrink-0 outline-none ${
                  activeChannel === channel ? 'text-[#D0F870]' : 'text-white/80 hover:text-white'
                }`}
              >
                {channelMap[channel]?.[language] || channel}
                {activeChannel === channel && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0F870] rounded-full shadow-[0_0_12px_rgba(208,248,112,0.8)]" />
                )}
              </button>
            ))}
            <div className="w-8 shrink-0" />
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="flex gap-4 p-4 pointer-events-none">
             <div className="w-1/2 flex flex-col">
                <SkeletonCard height={220} />
                <SkeletonCard height={180} />
                <SkeletonCard height={260} />
             </div>
             <div className="w-1/2 flex flex-col pt-10">
                <SkeletonCard height={200} />
                <SkeletonCard height={240} />
                <SkeletonCard height={180} />
             </div>
          </div>
        ) : (
          <div className="flex gap-4 p-4 pb-48">
            <div className="w-1/2 flex flex-col">
              {leftColumnModels.map((model, idx) => (
                <div key={model.id} onMouseUp={(e) => handleModelClickThrottled(model, e)}>
                  <ModelCard model={model} onClick={() => {}} index={idx} />
                </div>
              ))}
            </div>
            <div className="w-1/2 flex flex-col pt-10">
              {rightColumnModels.map((model, idx) => (
                <div key={model.id} onMouseUp={(e) => handleModelClickThrottled(model, e)}>
                  <ModelCard model={model} onClick={() => {}} index={idx + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
