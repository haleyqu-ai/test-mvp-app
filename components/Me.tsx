
import React from 'react';
import { LogOut, ChevronRight, Globe, ShieldCheck, User, Lock, FileText, Mail } from 'lucide-react';
import { MESH_CREDIT_ICON } from '../constants';

interface MeProps {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  credits: number;
  onLoginClick: () => void;
  onLogout: () => void;
  onUpgradeTrigger: () => void;
}

const Me: React.FC<MeProps> = ({ isLoggedIn, isSubscribed, credits, onLoginClick, onLogout, onUpgradeTrigger }) => {
  const menuItems = [
    { icon: Globe, label: 'Language', extra: 'EN' },
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      url: 'https://www.meshy.ai/terms-of-use' 
    },
    { 
      icon: ShieldCheck, 
      label: 'Privacy Policy', 
      url: 'https://www.meshy.ai/privacy-policy' 
    },
    { 
      icon: FileText, 
      label: 'Acceptable Use Policy', 
      url: 'https://www.meshy.ai/acceptable-use-policy' 
    },
    { 
      icon: Mail, 
      label: 'Contact us', 
      extra: 'support@meshy.ai',
      isEmail: true
    },
  ];

  const handleMenuClick = (item: any) => {
    if (item.url) {
      window.open(item.url, '_blank');
    } else if (item.isEmail) {
      window.location.href = `mailto:${item.extra}`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-meshy-dark">
      {!isLoggedIn ? (
        <header className="px-8 pt-20 pb-12 text-center flex flex-col items-center gap-7">
          <div className="relative w-24 h-24 flex-shrink-0">
             <div className="absolute -inset-2 bg-[#D0F870]/10 rounded-[40px] blur-xl opacity-30" />
             <div className="relative w-24 h-24 bg-neutral-900 rounded-[32px] flex items-center justify-center border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                <User size={40} className="text-neutral-700" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#D0F870] rounded-full flex items-center justify-center border-[4px] border-black text-black shadow-lg">
                  <Lock size={12} strokeWidth={3} />
                </div>
             </div>
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Guest Protocol</h1>
            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed opacity-70">
              Sign in to start your 3D creation
            </p>
          </div>
          
          <button 
            onClick={onLoginClick}
            className="w-full bg-[#D0F870] py-5 rounded-[28px] text-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_15px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all"
          >
            Sign Up / Sign In
          </button>
        </header>
      ) : (
        <header className="px-8 py-10 bg-gradient-to-b from-neutral-900/40 to-transparent relative">
          <div className="flex items-center gap-5 mb-8">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#D0F870] to-green-300 rounded-[24px] blur-sm opacity-30" />
              <img 
                src="https://picsum.photos/seed/user/200/200" 
                className="w-16 h-16 rounded-[20px] border-3 border-black relative z-10 object-cover shadow-2xl" 
                alt="Avatar" 
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white uppercase tracking-tighter">Chunming Qu</h1>
              <div className="flex flex-col gap-0.5">
                <p className="text-[#D0F870] text-[8px] font-black uppercase tracking-[0.2em]">Status: Verified Agent</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={onUpgradeTrigger}
                className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-0.5 text-left relative overflow-hidden active:bg-neutral-900 transition-colors"
             >
                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Active Plan</p>
                <p className={`text-lg font-black uppercase tracking-tight ${isSubscribed ? 'text-[#D0F870]' : 'text-neutral-400'}`}>
                  {isSubscribed ? 'Pro' : 'Free'}
                </p>
             </button>
             <button 
                onClick={onUpgradeTrigger}
                className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-0.5 text-left relative overflow-hidden active:bg-neutral-900 transition-colors"
             >
                <div className="flex items-center justify-between w-full">
                  <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Credits</p>
                  <img src={MESH_CREDIT_ICON} className="w-3 h-3 opacity-50" alt="" />
                </div>
                <p className="text-lg font-black text-white tracking-tight">{credits.toLocaleString()}</p>
             </button>
          </div>
        </header>
      )}

      <div className="px-6 flex-1 space-y-10 pb-40 overflow-y-auto hide-scrollbar pt-4">
        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-600 ml-5">Neural Configuration</p>
          <div className="bg-neutral-900/30 backdrop-blur-md border border-white/5 rounded-[40px] overflow-hidden">
            {menuItems.map((item, i) => (
              <button 
                key={item.label} 
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between px-6 py-6 active:bg-neutral-800 transition-all ${i !== 0 ? 'border-t border-white/5' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className="p-2.5 bg-neutral-800/40 rounded-2xl text-neutral-400 border border-white/5"><item.icon size={18} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-200">{item.label}</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-600">
                  {item.extra && <span className="text-[9px] font-black uppercase tracking-tighter text-[#D0F870]/80">{item.extra}</span>}
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {isLoggedIn && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-5 text-rose-500 font-black text-[12px] uppercase tracking-[0.25em] bg-rose-500/10 rounded-[30px] border border-rose-500/20 active:scale-[0.97] transition-all"
          >
             <LogOut size={18} />
             Log Out
          </button>
        )}
        
        <div className="text-center pb-6 opacity-30">
           <p className="text-[7px] font-black text-neutral-500 uppercase tracking-[0.5em]">Meshy Neural Interface v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Me;
