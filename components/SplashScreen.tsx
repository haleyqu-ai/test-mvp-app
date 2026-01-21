
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [animate, setAnimate] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Start entry animation (scale up)
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 50);

    // Start exit sequence at 1.5s to finish by 2.0s
    const exitTimer = setTimeout(() => {
      setExit(true);
    }, 1500);

    // Notify parent to unmount at exactly 2.0s
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`absolute inset-0 z-[1000] bg-[#02050a] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${exit ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic Grid Floor */}
        <div className="absolute bottom-[-10%] w-full h-[60%] opacity-20" style={{
          backgroundImage: `linear-gradient(to right, #D0F87030 1px, transparent 1px), linear-gradient(to bottom, #D0F87030 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          perspective: '600px',
          transform: 'rotateX(70deg)',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} />
        
        {/* Golden Core Glow */}
        <div className="absolute inset-0 bg-radial-at-c from-[#fbbf2415] via-transparent to-transparent opacity-60" />
      </div>

      {/* Main Release Animation */}
      <div className={`flex flex-col items-center transition-all duration-1000 cubic-spring transform ${animate ? 'scale-100 opacity-100' : 'scale-[0.2] opacity-0'}`}>
        
        {/* Golden Mushroom Container */}
        <div className="relative mb-10">
          {/* Intense Outer Golden Glow */}
          <div className="absolute inset-0 bg-[#fbbf24] blur-[50px] opacity-30 animate-pulse scale-150" />
          
          <div className="relative w-44 h-44 flex items-center justify-center">
             {/* The Golden Mushroom Icon (Styled with CSS Filters) */}
             <img 
               src="https://cdn.meshy.ai/ti_w:128,q:75,f:webp/webapp-build-assets/production/_next/static/media/mushroom-filled-24@3.197e3724.png" 
               className="w-36 h-36 object-contain filter drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] hue-rotate-[15deg] brightness-[1.5] contrast-[1.2] saturate-[1.5]" 
               alt="Golden Mushroom" 
             />
             
             {/* Shimmer / Sparkle Overlays */}
             <div className="absolute -top-4 right-6 text-[#fbbf24] text-3xl animate-bounce">✦</div>
             <div className="absolute top-14 -right-10 text-[#fbbf24] text-xl opacity-60 animate-pulse delay-500">✦</div>
             
             {/* Dynamic Light Sweep */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite] pointer-events-none" />
          </div>
        </div>

        {/* Brand Identity */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Meshy <span className="text-[#fbbf24]">AI</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#fbbf2440]" />
             <p className="text-[#fbbf24] text-[11px] font-black uppercase tracking-[0.5em] opacity-90">
                UNLEASH 3D CREATION
             </p>
             <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#fbbf2440]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .cubic-spring {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .bg-radial-at-c {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
