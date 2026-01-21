
import React from 'react';
import { X, ExternalLink, Printer } from 'lucide-react';

interface PrintPageProps {
  onClose: () => void;
}

const PARTNERS = [
  { name: 'Creality Cloud', icon: 'https://picsum.photos/seed/creality/60/60' },
  { name: 'Bambu Handy', icon: 'https://picsum.photos/seed/bambu/60/60' },
  { name: 'Prusa Connect', icon: 'https://picsum.photos/seed/prusa/60/60' },
  { name: 'Anycubic Cloud', icon: 'https://picsum.photos/seed/anycubic/60/60' },
  { name: 'Elegoo App', icon: 'https://picsum.photos/seed/elegoo/60/60' },
];

const PrintPage: React.FC<PrintPageProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[250] bg-black flex flex-col animate-in slide-in-from-bottom duration-500">
      <header className="h-20 bg-neutral-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Printer size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-white">3D Print Sync</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-neutral-800 rounded-full text-neutral-400">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-20">
        <div className="text-center py-4">
          <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Connect Your Hardware</p>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Direct Manufacturing</h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PARTNERS.map((partner) => (
            <button key={partner.name} className="flex items-center justify-between bg-neutral-900 border border-white/5 p-4 rounded-3xl active:scale-[0.98] transition-all group">
              <div className="flex items-center gap-4">
                <img src={partner.icon} className="w-12 h-12 rounded-2xl bg-neutral-800" alt="" />
                <span className="text-xs font-black uppercase tracking-widest text-neutral-200">{partner.name}</span>
              </div>
              <ExternalLink size={16} className="text-neutral-600 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed text-center italic">
            Meshy supports direct integration with top industrial slicing engines. Select your ecosystem to transmit neural data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
