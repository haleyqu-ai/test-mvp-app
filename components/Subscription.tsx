
import React, { useState } from 'react';
import { Check, Crown, Sparkles, Zap, Loader2, X, ListTodo, ShieldCheck, Lock, User } from 'lucide-react';
import { MESH_CREDIT_ICON } from '../constants';

interface SubscriptionProps {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  onSubscribeSuccess: () => void;
  credits: number;
  setCredits: (c: number | ((prev: number) => number)) => void;
  showCloseButton?: boolean;
  onClose?: () => void;
  onLoginTrigger: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ 
  isLoggedIn, 
  isSubscribed, 
  onSubscribeSuccess, 
  credits, 
  setCredits, 
  showCloseButton, 
  onClose,
  onLoginTrigger
}) => {
  const [isPaying, setIsPaying] = useState(false);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState('$20.00');

  const handleSubscribe = (price: string) => {
    setSelectedPlanPrice(price);
    setIsPaying(true);
    setTimeout(() => {
      onSubscribeSuccess();
      setIsPaying(false);
    }, 2000);
  };

  const handleBuyCredits = (amount: number) => {
    setCredits(prev => (typeof prev === 'number' ? prev + amount : prev));
    alert(`Transmission complete. +${amount} Credits synced.`);
  };

  const studioFeatures = [
    '4,000 monthly credits recharge (up to 400 assets)',
    '20 tasks in queue',
    'Higher queue priority',
    '8 free retries for each task',
  ];

  if (!isLoggedIn) {
    return (
      <div className="px-8 py-16 flex flex-col items-center text-center h-full bg-meshy-dark justify-center">
        <div className="w-24 h-24 bg-neutral-900 rounded-[36px] flex items-center justify-center border border-white/5 relative mb-8">
          <Crown size={40} className="text-[#D0F870]" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D0F870] rounded-full flex items-center justify-center border-4 border-black text-black">
            <Lock size={14} />
          </div>
        </div>
        <div className="space-y-3 mb-10">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Premium Access</h1>
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-10">
            Sign in to access your credit buffer and manage neural tier subscriptions
          </p>
        </div>
        <button 
          onClick={onLoginTrigger}
          className="w-full bg-[#D0F870] py-5 rounded-[28px] text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all"
        >
          Login to View Plans
        </button>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="px-6 py-6 flex flex-col gap-8 h-full bg-meshy-dark overflow-y-auto pb-40">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Current Tier</h1>
            <p className="text-[#D0F870] text-[10px] font-black uppercase tracking-widest">Active Subscription</p>
          </div>
          <div className="bg-[#D0F870] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(208,248,112,0.4)]">
             <Crown size={12} className="text-black" />
             <span className="text-xs font-black text-black uppercase">Pro</span>
          </div>
        </header>

        <div className="bg-gradient-to-br from-neutral-900 to-black border border-[#D0F870]/20 p-7 rounded-[40px] flex flex-col gap-6 relative overflow-hidden group">
           <div className="flex justify-between items-start z-10">
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Studio Tier</h3>
               <p className="text-[#D0F870] text-[9px] font-black uppercase tracking-[0.2em]">Enterprise Neural Power</p>
             </div>
             <span className="text-2xl font-black text-white">$60<span className="text-[10px] text-[#D0F870] font-bold">/mo</span></span>
           </div>
           
           <ul className="space-y-3 z-10">
              {studioFeatures.map(f => (
                <li key={f} className="flex items-start gap-3 text-[10px] font-black uppercase text-white/80 leading-tight">
                   <div className="p-1 bg-[#D0F870]/20 rounded-lg shrink-0">
                      <ShieldCheck size={12} className="text-[#D0F870]" />
                   </div>
                   {f}
                </li>
              ))}
           </ul>

           <button className="bg-[#D0F870] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-[#D0F870]/20 active:scale-95 transition-all z-10">
             Upgrade Plan
           </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 mb-6 px-1">Synapse Refuel</h2>
          <div className="flex flex-col gap-4">
            {[
              { amount: 500, price: '$10', label: 'Lite Buffer', icon: Zap },
              { amount: 2500, price: '$40', label: 'Creation Pack', icon: Crown, popular: true },
              { amount: 10000, price: '$120', label: 'Mass Matrix', icon: Sparkles },
            ].map(tier => (
              <button 
                key={tier.amount}
                onClick={() => handleBuyCredits(tier.amount)}
                className={`relative bg-neutral-900/40 border ${tier.popular ? 'border-[#D0F870]' : 'border-white/5'} rounded-[32px] p-5 flex items-center justify-between active:scale-[0.98] transition-all`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.popular ? 'bg-[#D0F870] shadow-[0_0_15px_rgba(208,248,112,0.3)]' : 'bg-neutral-800'}`}>
                      <img src={MESH_CREDIT_ICON} className={`w-6 h-6 object-contain ${tier.popular ? '' : 'grayscale opacity-50'}`} alt="Credits" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-black text-white">{tier.amount.toLocaleString()} <span className="text-[10px] opacity-40 uppercase tracking-widest ml-1">Credits</span></p>
                      <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">{tier.label}</p>
                   </div>
                </div>
                <span className="text-lg font-black text-white">{tier.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 flex flex-col gap-6 h-full bg-meshy-dark overflow-y-auto pb-40 relative">
      {showCloseButton && (
        <button 
          onClick={onClose}
          className="absolute top-8 right-6 p-2 bg-neutral-900 rounded-full text-white active:scale-90"
        >
          <X size={20} />
        </button>
      )}
      
      <header className="text-center">
        <h1 className="text-3xl font-black mb-1 uppercase tracking-tighter text-white">Select Path</h1>
        <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.25em]">Unlock full neural capacity</p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Free Plan */}
        <div className="bg-neutral-900/40 border border-white/5 rounded-[40px] p-7 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black uppercase tracking-tight text-neutral-400">Free</h2>
            <span className="text-xl font-black text-neutral-500">$0</span>
          </div>
          <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Entry level exploration</p>
          <ul className="space-y-2">
            {['5 Monthly Credits', 'Standard Quality'].map(f => (
              <li key={f} className="flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500"><Check size={12} /> {f}</li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-neutral-950/60 backdrop-blur-md border-2 border-[#D0F870] rounded-[40px] p-7 flex flex-col gap-5 relative shadow-[0_0_30px_rgba(208,248,112,0.15)]">
          <div className="absolute top-0 right-10 bg-[#D0F870] text-black text-[8px] font-black px-4 py-1 rounded-b-xl uppercase tracking-widest">Recommended</div>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              Pro <Crown size={18} className="text-[#D0F870]" />
            </h2>
            <span className="text-3xl font-black text-white">$20</span>
          </div>
          <p className="text-[9px] font-black text-[#D0F870] uppercase tracking-widest">For serious 3D artists</p>
          <ul className="space-y-3">
            {['1000 Monthly Credits', 'High Fidelity Output', 'Commercial Use'].map(f => (
              <li key={f} className="flex items-center gap-3 text-[11px] font-black uppercase text-white"><Check size={14} className="text-[#D0F870]" /> {f}</li>
            ))}
          </ul>
          <button 
            onClick={() => handleSubscribe('$20.00')}
            disabled={isPaying}
            className="w-full py-5 rounded-[24px] bg-[#D0F870] text-sm font-black text-black shadow-xl shadow-[#D0F870]/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3"
          >
            {isPaying && selectedPlanPrice === '$20.00' ? <Loader2 size={18} className="animate-spin" /> : <img src={MESH_CREDIT_ICON} className="w-5 h-5 object-contain invert" alt="" />}
            Get Pro Now
          </button>
        </div>

        {/* Studio Plan */}
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-[#D0F870]/30 rounded-[40px] p-7 flex flex-col gap-5 relative overflow-hidden group">
          <div className="absolute top-0 right-10 bg-[#D0F870] text-black text-[8px] font-black px-4 py-1 rounded-b-xl uppercase tracking-widest">Enterprise</div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              Studio <ShieldCheck size={18} className="text-[#D0F870]" />
            </h2>
            <span className="text-3xl font-black text-white">$60</span>
          </div>
          <p className="text-[9px] font-black text-[#D0F870] uppercase tracking-widest relative z-10">Power user workstation</p>
          <ul className="space-y-3 relative z-10">
            {['4000 Monthly Credits', 'Ultra High Fidelity', 'Highest Priority', 'Team Collaboration'].map(f => (
              <li key={f} className="flex items-center gap-3 text-[11px] font-black uppercase text-white/90"><Check size={14} className="text-[#D0F870]" /> {f}</li>
            ))}
          </ul>
          <button 
            onClick={() => handleSubscribe('$60.00')}
            disabled={isPaying}
            className="w-full py-5 rounded-[24px] bg-neutral-800 border border-white/10 text-white text-sm font-black uppercase tracking-widest active:scale-[0.97] transition-all flex items-center justify-center gap-3 relative z-10"
          >
            {isPaying && selectedPlanPrice === '$60.00' ? <Loader2 size={18} className="animate-spin" /> : <img src={MESH_CREDIT_ICON} className="w-5 h-5 object-contain" alt="" />}
            Get Studio
          </button>
        </div>
      </div>
      
      {isPaying && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end px-4 pb-8 pointer-events-auto">
           <div className="w-full max-w-[400px] mx-auto bg-neutral-900 rounded-[48px] p-8 animate-slide-up flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
              <div className="w-12 h-1.5 bg-neutral-800 rounded-full" />
              <div className="w-20 h-20 bg-[#D0F870] rounded-[30px] flex items-center justify-center shadow-[0_0_20px_rgba(208,248,112,0.4)]">
                 <Crown size={40} className="text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-white">Meshy AI Subscription</h3>
                <p className="text-neutral-500 text-sm font-bold uppercase mt-1">Automatic Renewal • {selectedPlanPrice}/mo</p>
              </div>
              <div className="w-full space-y-5 border-t border-white/5 pt-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-500">
                   <span>Apple ID</span>
                   <span className="text-white">chumming.q@icloud.com</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400">
                   <span>Confirm with FaceID</span>
                   <div className="w-6 h-6 border-2 border-[#D0F870] rounded-lg animate-pulse" />
                 </div>
              </div>
              <div className="flex flex-col items-center gap-4 mt-2">
                 <div className="w-10 h-10 border-4 border-white/10 border-t-[#D0F870] rounded-full animate-spin" />
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Syncing with iCloud</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
