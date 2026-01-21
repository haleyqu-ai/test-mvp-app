
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EXPLORE_CHANNELS, MOCK_MODELS } from '../constants';
import { Model } from '../types';

interface ExploreProps {
  onModelClick: (model: Model, isWorkspace: boolean) => void;
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
        {/* Loading Placeholder */}
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
        <h3 className="text-[10px] font-black uppercase tracking-tight truncate text-white leading-tight mb-1">{model.title}</h3>
        <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest truncate opacity-60">{model.author.name}</p>
      </div>
    </div>
  );
};

const Explore: React.FC<ExploreProps> = ({ onModelClick }) => {
  const [activeChannel, setActiveChannel] = useState(EXPLORE_CHANNELS[0]);
  const [loading, setLoading] = useState(true);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  
  // Refs for drag functionality
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  
  // Drag state
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

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

  // Handle Mouse Drag for Horizontal Scroll
  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    const slider = horizontalScrollRef.current;
    if (!slider) return;
    isDragging.current = true;
    startPos.current = {
      x: e.pageX - slider.offsetLeft,
      y: 0,
      scrollLeft: slider.scrollLeft,
      scrollTop: 0
    };
    slider.style.cursor = 'grabbing';
    slider.style.userSelect = 'none';
  };

  const handleHorizontalMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !horizontalScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - horizontalScrollRef.current.offsetLeft;
    const walk = (x - startPos.current.x) * 2; // Scroll speed multiplier
    horizontalScrollRef.current.scrollLeft = startPos.current.scrollLeft - walk;
  };

  // Handle Mouse Drag for Vertical Scroll
  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    const container = verticalScrollRef.current;
    if (!container) return;
    isDragging.current = true;
    startPos.current = {
      x: 0,
      y: e.pageY - container.offsetTop,
      scrollLeft: 0,
      scrollTop: container.scrollTop
    };
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleVerticalMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !verticalScrollRef.current) return;
    const y = e.pageY - verticalScrollRef.current.offsetTop;
    const walk = (y - startPos.current.y) * 1.5;
    verticalScrollRef.current.scrollTop = startPos.current.scrollTop - walk;
  };

  const handleGlobalMouseUp = () => {
    isDragging.current = false;
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.style.cursor = 'default';
      horizontalScrollRef.current.style.removeProperty('user-select');
    }
    if (verticalScrollRef.current) {
      verticalScrollRef.current.style.cursor = 'default';
      verticalScrollRef.current.style.removeProperty('user-select');
    }
  };

  // Helper to distinguish tap from drag
  const handleChannelClick = (channel: string, e: React.MouseEvent) => {
    // If mouse moved more than 5px, it's a drag, not a click
    const moveX = Math.abs((e.pageX - (horizontalScrollRef.current?.offsetLeft || 0)) - startPos.current.x);
    if (moveX > 5) return;
    setActiveChannel(channel);
  };

  const handleModelClickThrottled = (model: Model, e: React.MouseEvent) => {
    const moveY = Math.abs((e.pageY - (verticalScrollRef.current?.offsetTop || 0)) - startPos.current.y);
    if (moveY > 5) return;
    onModelClick(model, false);
  };

  return (
    <div 
      className="flex flex-col h-full bg-meshy-dark min-h-0"
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
    >
      {/* Horizontal Nav */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-[60] pt-4 pb-1">
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
              className={`pb-3 pt-1 text-[10px] font-black uppercase tracking-[0.12em] transition-all relative shrink-0 ${
                activeChannel === channel ? 'text-[#D0F870]' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {channel}
              {activeChannel === channel && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0F870] rounded-full shadow-[0_0_12px_rgba(208,248,112,0.8)]" />
              )}
            </button>
          ))}
          <div className="w-8 shrink-0" />
        </div>
      </div>

      {/* Vertical Grid */}
      <div 
        ref={verticalScrollRef}
        onMouseDown={handleVerticalMouseDown}
        onMouseMove={handleVerticalMouseMove}
        className="flex-1 overflow-y-auto hide-scrollbar select-none cursor-default"
      >
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
