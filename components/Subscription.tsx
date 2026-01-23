
import React, { useState } from 'react';
import { Check, Crown, Zap, X, Star, Plus, ChevronDown, ChevronUp, Calendar, Box, Loader2 } from 'lucide-react';
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
  onStartPayment: (meta: { amount: number; price: string; tier: UserTier | 'credits' }) => void;
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
  language,
  onStartPayment
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showRenewalInfo, setShowRenewalInfo] = useState(false);
  
  const isPaidUser = isLoggedIn && userTier !== 'free';

  const t = {
    en: {
      selectPlan: 'Select Plan',
      unlock: 'Unlock full 3D power',
      freeTitle: 'Free',
      freePrice: '$0',
      proTitle: 'Pro',
      studioTitle: 'Studio',
      proSub: 'Advanced Generation Tools',
      studioSub: 'Maximum Output',
      subscribe: 'Subscribe',
      recommended: 'Recommended',
      promoTag: 'SAVE 20% YEARLY',
      promo50: '50% FOR FIRST MONTH',
      currentTier: 'Current Tier',
      activeSub: 'ACTIVE SUBSCRIPTION',
      nextRenewal: 'Next Renewal Date',
      manageSub: 'Manage Subscription',
      currentPlan: 'Current Plan',
      synapseRefuel: 'Buy credits',
      credits: 'CREDITS',
      ultimate: 'The Ultimate Creative Suite',
      packSmall: '200 Credits',
      packMid: '1000 Credits',
      packLarge: '4000 Credits',
      monthly: 'Monthly',
      yearly: 'Yearly'
    },
    zh: {
      selectPlan: '选择方案',
      unlock: '开启最强 3D 动力',
      freeTitle: '免费版',
      freePrice: '¥0',
      proTitle: '专业版',
      studioTitle: '旗舰版',
      proSub: '高级生成工具',
      studioSub: '顶级算力输出',
      subscribe: '订阅',
      recommended: '推荐方案',
      promoTag: '年度订阅立省 20%',
      promo50: '首月 5 折优惠',
      currentTier: '当前方案',
      activeSub: '订阅生效中',
      nextRenewal: '下次续费时间',
      manageSub: '管理订阅',
      currentPlan: '当前方案',
      synapseRefuel: '购买积分',
      credits: '积分余额',
      ultimate: '极致创意套件',
      packSmall: '200 积分',
      packMid: '1000 积分',
      packLarge: '4000 积分',
      monthly: '按月',
      yearly: '按年'
    }
  }[language];

  const handleSubscribeTrigger = (price: string, tier: UserTier) => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    if (userTier === tier) return;
    onStartPayment({ amount: 0, price, tier });
  };

  const handleTopupTrigger = (amount: number, price: string) => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    onStartPayment({ amount, price, tier: 'credits' });
  };

  const proFeatures = [
    'Advanced generation tools',
    '1,000 monthly credits',
    'Unlock all features on web & app',
    '10 tasks in queue',
    '4 free retries for each task',
    'High generation speed'
  ];
  const studioFeatures = [
    '4,000 monthly credits',
    '20 tasks in queue',
    'Higher queue priority',
    '8 free retries for each task',
    'Early access to new models',
    'Highest generation speed'
  ];

  const creditPacks = [
    { id: 'p1', amount: 200, price: '$8.00', label: t.packSmall },
    { id: 'p2', amount: 1000, price: '$32.00', label: t.packMid },
    { id: 'p3', amount: 4000, price: '$96.00', label: t.packLarge, promo: 'BEST VALUE' }
  ];

  const proCurrentPrice = billingCycle === 'monthly' ? 10 : 16;
  const studioCurrentPrice = billingCycle === 'monthly' ? 60 : 48;

  return (
    <div className="flex flex-col h-full bg-meshy-dark overflow-y-auto pb-48 relative scroll-smooth hide-scrollbar">
      {showCloseButton && (
        <button onClick={onClose} className="absolute top-8 right-6 p-2 bg-neutral-900 border border-white/10 rounded-full text-white active:scale-90 z-50 shadow-xl">
          <X size={20} />
        </button>
      )}

      <div className="px-6 py-6 flex flex-col gap-6">
        {isPaidUser && (
          <div className="space-y-6">
            <header className="animate-in fade-in slide-in-from-top-4 duration-500 bg-neutral-800/40 rounded-[28px] p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => setShowRenewalInfo(!showRenewalInfo)}
                  className={`flex-1 h-[60px] px-6 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] border border-white/5 ${userTier === 'studio' ? 'bg-white text-black' : 'bg-[#D0F870] text-black shadow-[0_0_20px_rgba(208,248,112,0.2)]'}`}
                >
                  <div className="flex items-center gap-3">
                    {userTier === 'studio' ? <Star size={20} strokeWidth={2.5} /> : <Crown size={20} strokeWidth={2.5} />}
                    <span className="text-[16px] font-black uppercase tracking-widest">{userTier}</span>
                  </div>
                  {showRenewalInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                <div className="bg-black/50 border border-white/5 h-[60px] px-6 rounded-2xl flex items-center gap-4 shadow-inner min-w-[140px]">
                  <img src={MESH_CREDIT_ICON} className="w-6 h-6 object-contain" alt="" />
                  <div className="flex flex-col items-start">
                    <span className="text-[20px] font-black text-white tabular-nums leading-none">{credits.toLocaleString()}</span>
                    <span className="text-[7px] font-black text-neutral-500 uppercase tracking-widest mt-1">{t.credits}</span>
                  </div>
                </div>
              </div>

              {showRenewalInfo && (
                <div className="mt-5 pt-5 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <Calendar size={14} className="text-neutral-500" />
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t.nextRenewal}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-white">Apr 24, 2024</span>
                      <button className="text-[9px] font-bold text-blue-500 hover:text-blue-400 active:opacity-70 transition-all uppercase tracking-tighter">
                        {t.manageSub}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </header>

            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center gap-2 mb-4 px-2">
                  <Zap size={14} className="text-orange-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">{t.synapseRefuel}</h3>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {creditPacks.map((pack) => (
                    <button 
                      key={pack.id}
                      onClick={() => handleTopupTrigger(pack.amount, pack.price)}
                      className="group bg-neutral-800/40 backdrop-blur-md border border-white/5 p-4 rounded-[24px] flex flex-col items-center gap-2 active:scale-95 active:bg-neutral-800 transition-all text-center relative overflow-hidden"
                    >
                      <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-orange-400/10 transition-colors">
                        <img src={MESH_CREDIT_ICON} className="w-6 h-6 object-contain" alt="" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-white uppercase">{pack.label}</p>
                        <p className="text-[11px] font-black text-[#D0F870]">{pack.price}</p>
                      </div>
                      <div className="mt-1 w-full h-7 bg-neutral-900 border border-white/5 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                         <Plus size={12} />
                      </div>
                    </button>
                  ))}
               </div>
            </section>
          </div>
        )}

        <section className="flex flex-col gap-6">
          {!isPaidUser && (
            <header className="text-center space-y-6 mt-4">
              <div className="space-y-1">
                 <h1 className="text-2xl font-bold uppercase tracking-tight text-white">{t.selectPlan}</h1>
                 <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em]">{t.unlock}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-neutral-900/80 backdrop-blur-md p-1 rounded-[20px] flex items-center gap-1 border border-white/5 shadow-inner">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-7 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-[#D0F870] text-black shadow-lg shadow-[#D0F870]/20' : 'text-neutral-500'}`}
                  >
                    {t.monthly}
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-7 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#D0F870] text-black shadow-lg shadow-[#D0F870]/20' : 'text-neutral-500'}`}
                  >
                    {t.yearly}
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)] whitespace-nowrap animate-pulse">
                      20% Off
                    </span>
                  </button>
                </div>
              </div>
            </header>
          )}

          <div className="flex flex-col gap-6">
            {(!isPaidUser || userTier === 'pro') && (
              <div className={`bg-neutral-800/80 backdrop-blur-md border-2 ${userTier === 'pro' ? 'border-[#D0F870]' : 'border-white/10'} rounded-[32px] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden transition-all duration-500`}>
                {!isPaidUser && (
                  <>
                    <div className="absolute top-0 left-0 bg-[#C084FC]/20 border-r border-b border-[#C084FC]/40 px-3 py-1.5 rounded-br-lg">
                      <span className="text-[7.5px] font-bold text-[#C084FC] uppercase tracking-wider">{billingCycle === 'monthly' ? t.promo50 : t.promoTag}</span>
                    </div>
                    <div className="absolute top-0 right-0 bg-[#D0F870] text-black text-[7.5px] font-bold px-4 py-1.5 rounded-bl-lg uppercase tracking-widest shadow-lg">
                      {t.recommended}
                    </div>
                  </>
                )}
                <div className="flex justify-between items-end mt-4">
                  <div className="space-y-1 text-left">
                    <h2 className={`text-2xl font-bold uppercase tracking-tight flex items-center gap-2 ${userTier === 'pro' ? 'text-[#D0F870]' : 'text-white'}`}>
                      PRO <Crown size={18} />
                    </h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-neutral-500 line-through mr-1">$20</span>
                    <span className="text-4xl font-bold text-white">${proCurrentPrice}</span>
                    <span className="text-[10px] font-bold text-neutral-500">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 py-2 text-left">
                  {proFeatures.map(f => (
                    <li key={f} className="flex items-center gap-3 text-[11px] font-bold text-neutral-300 tracking-wide">
                      <Check size={14} className="text-[#D0F870] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="relative">
                  <button 
                    onClick={() => handleSubscribeTrigger(billingCycle === 'monthly' ? '$10.00' : '$192.00', 'pro')} 
                    disabled={userTier === 'pro'}
                    className={`w-full py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${userTier === 'pro' ? 'bg-neutral-800 text-neutral-500' : 'bg-[#D0F870] text-black active:scale-[0.97] shadow-lg shadow-[#D0F870]/20'}`}
                  >
                    {userTier === 'pro' ? t.currentPlan : t.subscribe}
                  </button>
                </div>
              </div>
            )}

            <div className={`bg-neutral-800/40 border border-white/5 rounded-[32px] p-8 flex flex-col gap-4 relative ${userTier !== 'free' ? 'opacity-80' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Box size={20} className="text-neutral-500" />
                  <h2 className="text-lg font-bold uppercase tracking-tight text-white">{t.freeTitle}</h2>
                </div>
                <span className="text-lg font-bold text-neutral-500">{t.freePrice}</span>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-left">
                <li className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 tracking-wide">
                  <Check size={12} className="text-neutral-700" /> 100 monthly credits
                </li>
                <li className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 tracking-wide">
                  <Check size={12} className="text-neutral-700" /> 1 task in queue
                </li>
              </ul>
              <button disabled className="w-full py-4 rounded-xl bg-neutral-900/50 text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                {userTier === 'free' ? t.currentPlan : 'Free Plan'}
              </button>
            </div>

            {(!isPaidUser || userTier === 'studio') && (
              <div className={`bg-neutral-800/80 backdrop-blur-md border-2 ${userTier === 'studio' ? 'border-[#C084FC]' : 'border-white/10'} rounded-[32px] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden transition-all duration-500`}>
                <div className="flex justify-between items-end">
                  <div className="space-y-1 text-left">
                    <h2 className={`text-2xl font-bold uppercase tracking-tight flex items-center gap-2 ${userTier === 'studio' ? 'text-[#C084FC]' : 'text-white'}`}>
                      STUDIO <Star size={18} />
                    </h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    {billingCycle === 'yearly' && (
                      <span className="text-xl font-bold text-neutral-500 line-through mr-1">$60</span>
                    )}
                    <span className="text-4xl font-bold text-white">${studioCurrentPrice}</span>
                    <span className="text-[10px] font-bold text-neutral-500">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 py-2 text-left">
                  {studioFeatures.map(f => (
                    <li key={f} className="flex items-center gap-3 text-[11px] font-bold text-neutral-300 tracking-wide">
                      <Check size={14} className="text-[#C084FC] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSubscribeTrigger(billingCycle === 'monthly' ? '$60.00' : '$576.00', 'studio')} 
                  disabled={userTier === 'studio'}
                  className={`w-full py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${userTier === 'studio' ? 'bg-neutral-800 text-neutral-500' : 'bg-white text-black active:scale-[0.97] shadow-xl'}`}
                >
                  {userTier === 'studio' ? t.currentPlan : t.subscribe}
                </button>
                {!isPaidUser && <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-neutral-600">{t.ultimate}</p>}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Subscription;
