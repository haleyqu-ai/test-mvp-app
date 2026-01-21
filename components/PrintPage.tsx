
import React from 'react';
import { X, ExternalLink, Printer } from 'lucide-react';

interface PrintPageProps {
  onClose: () => void;
}

const PARTNERS = [
  { 
    name: 'CREALITY CLOUD', 
    icon: 'https://picsum.photos/seed/creality_sky/200/200' // Night sky forest aesthetic
  },
  { 
    name: 'BAMBU HANDY', 
    icon: 'https://picsum.photos/seed/bambu_winter/200/200' // Snowy forest aesthetic
  },
  { 
    name: 'PRUSA CONNECT', 
    icon: 'https://picsum.photos/seed/prusa_sun/200/200' // Sunny golden hour aesthetic
  },
  { 
    name: 'ANYCUBIC CLOUD', 
    icon: 'https://picsum.photos/seed/anycubic_night/200/200' // Starry night water aesthetic
  },
  { 
    name: 'ELEGOO APP', 
    icon: 'https://picsum.photos/seed/elegoo_mist/200/200' // Foggy pine forest aesthetic
  },
];

const PrintPage: React.FC<PrintPageProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[250] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-8 pt-20 pb-24 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">Connect Your Hardware</p>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Direct Manufacturing</h1>
        </div>

        {/* Partners List */}
        <div className="flex flex-col gap-4">
          {PARTNERS.map((partner) => (
            <button 
              key={partner.name} 
              className="flex items-center justify-between bg-neutral-900/60 border border-white/5 p-5 rounded-[32px] active:scale-[0.98] transition-all group shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 shrink-0">
                   <img src={partner.icon} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt={partner.name} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">{partner.name}</span>
              </div>
              <div className="p-2.5 rounded-full text-neutral-600 group-hover:text-white group-hover:bg-white/5 transition-all">
                <ExternalLink size={18} />
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-4 p-7 bg-neutral-900/20 border border-white/5 rounded-[40px]">
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em] leading-relaxed text-center italic">
            Meshy supports direct integration with top industrial slicing engines. Select your ecosystem to transmit neural data.
          </p>
        </div>
      </div>

      {/* Static Navigation Controls */}
      <div className="absolute top-6 left-0 right-0 flex justify-end px-8 z-50">
        <button onClick={onClose} className="p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full text-white active:scale-90 transition-all shadow-xl">
          <X size={20} />
        </button>
      </div>
      
      {/* Home Indicator Bottom Mask */}
      <div className="h-10 w-full bg-black/50 backdrop-blur-sm pointer-events-none sticky bottom-0 z-50" />
    </div>
  );
};

export default PrintPage;
