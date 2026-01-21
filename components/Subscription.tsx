
import React, { useState, useEffect, useRef } from 'react';
import { Check, Crown, Sparkles, Zap, Loader2, X, ShieldCheck, Percent, ChevronDown, ChevronUp, Calendar, Box, Star } from 'lucide-react';
import { MESH_CREDIT_ICON } from '../constants';
import { UserTier } from '../types';

interface SubscriptionProps {
  isLoggedIn: boolean;
  userTier: UserTier;
  onSubscribeSuccess: (tier: UserTier) => void;
  credits: number;
  setCredits: (c: number | ((prev: number) => number)) => void;
  showCloseButton?: boolean;
  onClose?: () => void;
  onLoginTrigger: () => void;
  language: 'en' | 'zh';
}

const Subscription: React.FC<SubscriptionProps> = ({ 
  isLoggedIn, 
  userTier, 
  onSubscribeSuccess, 
  credits, 
  setCredits, 
  showCloseButton, 
  onClose,
  onLoginTrigger,
  language
}) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMeta, setPaymentMeta] = useState({ amount: 0, price: '', tier: 'pro' as UserTier });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const isPaidUser = isLoggedIn && userTier !== 'free';

  const t = {
    en: {
      selectPlan: 'Select Plan',
      unlock: 'Unlock full neural capacity',
      freeTitle: 'Free',
      freePrice: '$0',
      proTitle: 'Pro',
      studioTitle: 'Studio',
      proSub: 'Advanced Generation Tools',
      studioSub: 'Maximum Neural Output',
      subscribe: 'Subscribe',
      recommended: 'Recommended',
      promoTag: 'SAVE 20% YEARLY',
      promo50: '50% FOR FIRST MONTH',
      currentTier: 'Current Tier',
      activeSub: 'ACTIVE SUBSCRIPTION',
      benefits: 'Current Benefits',
      monthly: 'Monthly',
      yearly: 'Yearly',
      nextRenewal: 'Next Renewal Date',
      currentPlan: 'Current Plan',
      synapseRefuel: 'Synapse Refuel',
      creditTopup: 'Meshy AI Credit Top-up',
      confirmFaceId: 'Double Click to Pay',
      syncing: 'Syncing Transaction',
      credits: 'CREDITS',
      ultimate: 'The Ultimate Creative Suite'
    },
    zh: {
      selectPlan: '选择方案',
      unlock: '开启全部神经算力',
      freeTitle: '免费版',
      freePrice: '¥0',
      proTitle: '专业版',
      studioTitle: '旗舰版',
      proSub: '高级生成工具',
      studioSub: '顶级神经算力输出',
      subscribe: '订阅',
      recommended: '推荐方案',
      promoTag: '年度订阅立省 20%',
      promo50: '首月 5 折优惠',
      currentTier: '当前方案',
      activeSub: '订阅生效中',
      benefits: '当前权益',
      monthly: '按月',
      yearly: '按年',
      nextRenewal: '下次续费时间',
      currentPlan: '当前方案',
      synapseRefuel: '增购积分',
      creditTopup: 'Meshy AI 积分充值',
      confirmFaceId: '双击侧边按钮支付',
      syncing: '交易同步中',
      credits: '积分余额',
      ultimate: '极致创意套件'
    }
  }[language];

  const handleSubscribeTrigger = (price: string, tier: UserTier) => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    if (userTier === tier) return;
    setPaymentMeta({ amount: 0, price, tier });
    setIsPaying(true);
    
    setTimeout(() => {
      onSubscribeSuccess(tier);
      setIsPaying(false);
    }, 3000);
  };

  const freeFeatures = ['100 monthly credits', '1 task in queue'];
  const proFeatures = [
    'Advanced generation tools',
    '1,000 monthly credits',
    'Unlock all features on web & app',
    '10 tasks in queue',
    'High queue priority',
    '4 free retries for each task'
  ];
  const studioFeatures = [
    '4,000 monthly credits',
    '20 tasks in queue',
    'Higher queue priority',
    '8 free retries for each task',
    'Early access to new models'
  ];

  const renderPaymentOverlay = () => {
    if (!isPaying) return null;
    return (
      <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-xl flex items-end px-4 pb-12 pointer-events-auto animate-in fade-in duration-300">
         <div className="w-full max-w-[400px] mx-auto bg-[#0F0F0F] rounded-[32px] p-8 animate-slide-up flex flex-col items-center gap-7 shadow-2xl border border-white/5">
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full" />
            
            <div className={`w-20 h-20 rounded-[20px] flex items-center justify-center shadow-lg ${paymentMeta.tier === 'studio' ? 'bg-[#C084FC] shadow-[#C084FC]/30' : 'bg-[#D0F870] shadow-[#D0F870]/30'}`}>
              {paymentMeta.tier === 'studio' ? <Star size={40} className="text-black" /> : <Crown size={40} className="text-black" />}
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Meshy AI {paymentMeta.tier.toUpperCase()}</h3>
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                Renewal • {paymentMeta.price}
              </p>
            </div>

            <div className="w-full space-y-5 border-t border-white/5 pt-6">
               <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-500">
                 <span>Account</span><span className="text-white lowercase tracking-normal">chumming.q@icloud.com</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400">
                 <span className="animate-pulse">{t.confirmFaceId}</span>
                 <div className="w-8 h-8 flex items-center justify-center relative">
                    <div className="w-6 h-6 border-2 border-[#007AFF] rounded-lg" />
                 </div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-5 mt-2">
               <div className="relative w-11 h-11">
                 <div className="absolute inset-0 border-[3px] border-transparent border-t-[#007AFF] rounded-full animate-spin" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 animate-pulse">{t.syncing}</p>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-meshy-dark overflow-y-auto pb-48 relative scroll-smooth hide-scrollbar">
      {showCloseButton && (
        <button onClick={onClose} className="absolute top-8 right-6 p-2 bg-neutral-900 border border-white/10 rounded-full text-white active:scale-90 z-50 shadow-xl">
          <X size={20} />
        </button>
      )}

      <div className="px-6 py-6 flex flex-col gap-8">
        {/* Active Subscription Dashboard for Paid Users */}
        {isPaidUser ? (
          <header className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-neutral-900/40 rounded-[24px] p-8 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5 text-left">
                <h1 className="text-2xl font-bold text-white tracking-tight leading-none">{t.currentTier}</h1>
                <p className="text-[#D0F870] text-[9px] font-black uppercase tracking-[0.2em]">{t.activeSub}</p>
              </div>
              <div className={`h-[44px] px-6 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(208,248,112,0.3)] transition-all ${userTier === 'studio' ? 'bg-white text-black' : 'bg-[#D0F870] text-black'}`}>
                 {userTier === 'studio' ? <Star size={16} strokeWidth={2.5} /> : <Crown size={16} strokeWidth={2.5} />}
                 <span className="text-[13px] font-black uppercase tracking-widest">{userTier}</span>
              </div>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5">
                    <img src={MESH_CREDIT_ICON} className="w-8 h-8 object-contain" alt="Credits" />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-1.5">{t.credits}</span>
                    <span className="text-2xl font-bold text-white tracking-tight tabular-nums leading-none">{credits.toLocaleString()}</span>
                 </div>
              </div>
            </div>
          </header>
        ) : (
          /* Billing Toggle and Header for Guests or Free Users */
          <header className="text-center space-y-6 mt-4">
            <div className="space-y-1">
               <h1 className="text-2xl font-bold uppercase tracking-tight text-white">{t.selectPlan}</h1>
               <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em]">{t.unlock}</p>
            </div>
            <div className="flex justify-center">
              <div className="bg-neutral-900/80 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 border border-white/5 shadow-inner">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-[#D0F870] text-black shadow-lg' : 'text-neutral-500'}`}
                >
                  {t.monthly}
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#D0F870] text-black shadow-lg' : 'text-neutral-500'}`}
                >
                  {t.yearly}
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${billingCycle === 'yearly' ? 'bg-black text-[#D0F870]' : 'bg-neutral-800 text-neutral-500'}`}>-20%</span>
                </button>
              </div>
            </div>
          </header>
        )}

        <div className="flex flex-col gap-6">
          {/* PRO PLAN */}
          {(userTier === 'free' || !isLoggedIn || userTier === 'pro') && (
            <div className={`bg-neutral-900/40 backdrop-blur-md border-2 ${userTier === 'pro' ? 'border-[#D0F870]' : 'border-white/5'} rounded-[24px] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden transition-all duration-500`}>
              {/* Horizontal Alignment for Labels */}
              <div className="absolute top-0 left-0 right-0 flex justify-between items-start pointer-events-none">
                <div className="bg-[#C084FC]/20 border-x border-b border-[#C084FC]/40 px-3 py-1.5 rounded-b-lg h-[28px] flex items-center pointer-events-auto">
                  <span className="text-[7.5px] font-bold text-[#C084FC] uppercase tracking-wider">{billingCycle === 'monthly' ? t.promo50 : t.promoTag}</span>
                </div>
                {!isPaidUser && (
                  <div className="bg-[#D0F870] text-black text-[7.5px] font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-widest shadow-lg h-[28px] flex items-center pointer-events-auto">
                    {t.recommended}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mt-4">
                <div className="space-y-1 text-left">
                  <h2 className={`text-2xl font-bold uppercase tracking-tight flex items-center gap-2 ${userTier === 'pro' ? 'text-[#D0F870]' : 'text-white'}`}>
                    PRO <Crown size={18} className={userTier === 'pro' ? 'text-[#D0F870]' : 'text-neutral-600'} />
                  </h2>
                  <p className="text-[10px] font-bold text-[#D0F870] uppercase tracking-wide opacity-80">{t.proSub}</p>
                </div>
                <div className="flex flex-col items-end">
                  {!isPaidUser && <span className="text-xs font-bold text-neutral-600 line-through tracking-tighter">$20</span>}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? 10 : 16}</span>
                    <span className="text-[10px] font-bold text-neutral-500">/mo</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 py-2 text-left">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-neutral-300 tracking-wide">
                    <Check size={14} className="text-[#D0F870] shrink-0" /> {f.toUpperCase()}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribeTrigger(billingCycle === 'monthly' ? '$10.00' : '$192.00', 'pro')} 
                disabled={userTier === 'pro'}
                className={`w-full py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${userTier === 'pro' ? 'bg-neutral-800 text-neutral-500' : 'bg-[#D0F870] text-black active:scale-[0.97] shadow-lg shadow-[#D0F870]/20'}`}
              >
                {userTier === 'pro' ? t.currentPlan : t.subscribe}
              </button>
            </div>
          )}

          {/* STUDIO PLAN */}
          {(userTier !== 'studio') && (
            <div className={`bg-neutral-900/40 backdrop-blur-md border-2 border-white/5 rounded-[24px] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden transition-all duration-500`}>
              <div className="flex justify-between items-end">
                <div className="space-y-1 text-left">
                  <h2 className={`text-2xl font-bold uppercase tracking-tight flex items-center gap-2 text-white`}>
                    STUDIO <Star size={18} className="text-neutral-600" />
                  </h2>
                  <p className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wide opacity-80">{t.studioSub}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? 60 : 48}</span>
                    <span className="text-[10px] font-bold text-neutral-500">/mo</span>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-4 py-2 text-left">
                {studioFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-neutral-300 tracking-wide">
                    <Check size={14} className="text-[#C084FC] shrink-0" /> {f.toUpperCase()}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribeTrigger(billingCycle === 'monthly' ? '$60.00' : '$576.00', 'studio')} 
                className={`w-full py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all bg-white text-black active:scale-[0.97] shadow-xl`}
              >
                {t.subscribe}
              </button>
              
              <p className="text-center text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-600">{t.ultimate}</p>
            </div>
          )}

          {/* User's Actual Studio Plan Card (shown if tier is studio) */}
          {userTier === 'studio' && (
            <div className={`bg-neutral-900/40 backdrop-blur-md border-2 border-[#C084FC] rounded-[24px] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden`}>
              <div className="flex justify-between items-end">
                <div className="space-y-1 text-left">
                  <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2 text-[#C084FC]">
                    STUDIO <Star size={18} className="text-[#C084FC]" />
                  </h2>
                  <p className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wide opacity-80">{t.studioSub}</p>
                </div>
              </div>
              
              <ul className="space-y-4 py-2 text-left">
                {studioFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-neutral-300 tracking-wide">
                    <Check size={14} className="text-[#C084FC] shrink-0" /> {f.toUpperCase()}
                  </li>
                ))}
              </ul>

              <button disabled className="w-full py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] bg-neutral-800 text-neutral-500">
                {t.currentPlan}
              </button>
            </div>
          )}

          {/* FREE PLAN */}
          {!isPaidUser && (
            <div className={`bg-neutral-900/10 border border-white/5 rounded-[20px] p-6 flex flex-col gap-4 relative opacity-50`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Box size={16} className="text-neutral-500" />
                  <h2 className="text-sm font-bold uppercase tracking-tight text-white">{t.freeTitle}</h2>
                </div>
                <span className="text-sm font-bold text-neutral-500">{t.freePrice}</span>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-left">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[8px] font-bold uppercase text-neutral-500 tracking-wide">
                    <Check size={10} className="text-neutral-700 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button disabled className="w-full py-3.5 rounded-xl bg-neutral-900/50 text-neutral-600 text-[9px] font-bold uppercase tracking-widest">
                {userTier === 'free' ? t.currentPlan : 'Unavailable'}
              </button>
            </div>
          )}
        </div>
      </div>

      {renderPaymentOverlay()}
    </div>
  );
};

export default Subscription;
