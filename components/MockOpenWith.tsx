
import React from 'react';
import { X, Share2, MoreHorizontal, Download, Copy, Printer, FileText } from 'lucide-react';

interface MockOpenWithProps {
  fileName: string;
  onClose: () => void;
}

const APPS = [
  { name: 'Bambu Handy', icon: 'https://picsum.photos/seed/bambu/100/100', color: 'bg-[#1a1a1a]' },
  { name: 'Creality', icon: 'https://picsum.photos/seed/creality/100/100', color: 'bg-white' },
  { name: 'Files', icon: 'https://picsum.photos/seed/files_app/100/100', color: 'bg-blue-500' },
  { name: 'Drive', icon: 'https://picsum.photos/seed/gdrive/100/100', color: 'bg-white' },
  { name: 'Mail', icon: 'https://picsum.photos/seed/mail_app/100/100', color: 'bg-blue-400' },
  { name: 'Slack', icon: 'https://picsum.photos/seed/slack_app/100/100', color: 'bg-purple-600' },
];

const MockOpenWith: React.FC<MockOpenWithProps> = ({ fileName, onClose }) => {
  return (
    <div className="absolute inset-0 z-[600] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full bg-[#1c1c1e] rounded-t-[32px] p-5 pb-14 animate-slide-up flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto" />
        
        <div className="flex items-center gap-4 px-1">
          <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-[#D0F870]">
            <FileText size={24} />
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{fileName}</h4>
            <p className="text-[10px] text-neutral-500 font-medium">3D Model • 4.2 MB</p>
          </div>
          <button onClick={onClose} className="p-2 bg-neutral-800 rounded-full text-neutral-400">
            <X size={16} />
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-5 px-1 py-2">
          {APPS.map((app, i) => (
            <button key={i} onClick={onClose} className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform">
              <div className={`w-16 h-16 ${app.color} rounded-[18px] overflow-hidden shadow-lg flex items-center justify-center p-3`}>
                <img src={app.icon} className="w-full h-full object-cover rounded-lg" alt="" />
              </div>
              <span className="text-[10px] font-medium text-neutral-400 w-16 text-center truncate">{app.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#2c2c2e] rounded-2xl overflow-hidden">
          {[
            { icon: Copy, label: 'Copy' },
            { icon: Download, label: 'Save to Files' },
            { icon: Printer, label: 'Print' },
            { icon: Share2, label: 'Share via Airdrop' },
            { icon: MoreHorizontal, label: 'More...' },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={onClose}
              className={`w-full flex items-center justify-between px-5 py-4 active:bg-neutral-700 transition-colors ${i !== 0 ? 'border-t border-white/5' : ''}`}
            >
              <span className="text-sm text-white font-medium">{action.label}</span>
              <action.icon size={18} className="text-neutral-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockOpenWith;
