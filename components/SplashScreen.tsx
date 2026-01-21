
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [animate, setAnimate] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Start entry animation
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 50);

    // Start exit sequence
    const exitTimer = setTimeout(() => {
      setExit(true);
    }, 2000);

    // Final cleanup
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`absolute inset-0 z-[1000] bg-[#02050a] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${exit ? 'opacity-0 scale-110 blur-2xl' : 'opacity-100 scale-100'}`}>
      
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
        
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-radial-at-c from-[#D0F87010] via-transparent to-transparent opacity-60" />
      </div>

      {/* Main Release Animation */}
      <div className={`flex flex-col items-center transition-all duration-1000 cubic-spring transform ${animate ? 'scale-100 opacity-100' : 'scale-[0.2] opacity-0'}`}>
        
        {/* Meshy Logo Container */}
        <div className="relative mb-10" style={{ perspective: '1000px' }}>
          {/* Intense Outer Glow */}
          <div className="absolute inset-0 bg-[#D0F870] blur-[60px] opacity-20 animate-pulse scale-150 rounded-full" />
          
          <div className="relative w-48 h-48 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
             {/* Logo is now static (rotation removed) */}
             <div className="w-40 h-40 relative" style={{ transformStyle: 'preserve-3d' }}>
                <img 
                  src="https://cdn.meshy.ai/ti_w:128,q:75,f:webp/webapp-build-assets/production/_next/static/media/mushroom-filled-24@3.197e3724.png" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(208,248,112,0.6)] brightness-[1.1]" 
                  alt="Meshy AI Logo" 
                />
                
                {/* Visual Highlight Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2.5s_infinite] pointer-events-none" />
             </div>
             
             {/* Sparkles around the logo */}
             <div className="absolute -top-2 right-4 text-[#D0F870] text-3xl animate-bounce delay-100">✦</div>
             <div className="absolute bottom-6 -left-6 text-[#D0F870] text-xl opacity-60 animate-pulse">✦</div>
          </div>
          
          {/* Floor Shadow Reflection */}
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-32 h-6 bg-black/60 blur-xl rounded-full scale-y-50" />
        </div>

        {/* Brand Identity */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Meshy <span className="text-[#D0F870]">AI</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D0F87040]" />
             <p className="text-[#D0F870] text-[11px] font-black uppercase tracking-[0.5em] opacity-90 animate-pulse">
                UNLEASH 3D CREATION
             </p>
             <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D0F87040]" />
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
