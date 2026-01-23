
import React, { useState } from 'react';
import { LogOut, ChevronRight, Globe, ShieldCheck, User, Lock, FileText, Mail, X, Check, Hourglass } from 'lucide-react';
import { MESH_CREDIT_ICON } from '../constants';
import { UserTier } from '../types';

interface MeProps {
  isLoggedIn: boolean;
  userTier: UserTier;
  credits: number;
  onLoginClick: () => void;
  onLogout: () => void;
  onUpgradeTrigger: () => void;
  language: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
}

const Me: React.FC<MeProps> = ({ 
  isLoggedIn, 
  userTier, 
  credits, 
  onLoginClick, 
  onLogout, 
  onUpgradeTrigger, 
  language,
  onLanguageChange 
}) => {
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t = {
    en: {
      joined: 'Joined at Mar 24, 2024',
      guest: 'Guest Mode',
      guestSub: 'Sign in to start your 3D creation',
      signIn: 'Sign Up / Sign In',
      plan: 'Current Plan',
      credits: 'Credits',
      logout: 'Log Out',
      lang: 'Language',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      acceptable: 'Acceptable Use Policy',
      contact: 'Contact Us',
      selectLang: 'Select Language',
      comingSoon: 'Soon',
      version: 'App version: Prod 1'
    },
    zh: {
      joined: '加入于 2024年3月24日',
      guest: '访客模式',
      guestSub: '登录以开始您的 3D 创作之旅',
      signIn: '注册 / 登录',
      plan: '当前方案',
      credits: '积分余额',
      logout: '退出登录',
      lang: '语言',
      terms: '服务条款',
      privacy: '隐私政策',
      acceptable: '合理使用政策',
      contact: '联系我们',
      selectLang: '选择界面语言',
      comingSoon: '敬请期待',
      version: '版本: Prod 1'
    }
  }[language];

  const languages = [
    { id: 'en', label: 'English', sub: 'Standard', active: true },
    { id: 'zh', label: '简体中文', sub: '标准接口', active: true },
    { id: 'es', label: 'Español', sub: 'Interfaz de red', active: false },
    { id: 'fr', label: 'Français', sub: 'Standard', active: false },
    { id: 'de', label: 'Deutsch', sub: 'Standard', active: false },
    { id: 'ja', label: '日本語', sub: '标准接口', active: false },
    { id: 'ko', label: '한국어', sub: '표준 인터페이스', active: false },
    { id: 'pt', label: 'Português', sub: 'Standard', active: false },
    { id: 'ru', label: 'Русский', sub: 'Стандартный', active: false },
    { id: 'it', label: 'Italiano', sub: 'Standard', active: false },
    { id: 'ar', label: 'العربية', sub: 'واجهة عصبية', active: false },
    { id: 'hi', label: 'हिन्दी', sub: 'तंत्रica इंटरफ़ेस', active: false },
    { id: 'tr', label: 'Türkçe', sub: 'Standart Arayüz', active: false },
    { id: 'vi', label: 'Tiếng Việt', sub: 'Giao diện chuẩn', active: false },
  ];

  const menuItems = [
    { id: 'lang', icon: Globe, label: t.lang, extra: language === 'en' ? 'EN' : '中文' },
    { 
      id: 'terms',
      icon: FileText, 
      label: t.terms, 
      url: 'https://www.meshy.ai/terms-of-use' 
    },
    { 
      id: 'privacy',
      icon: ShieldCheck, 
      label: t.privacy, 
      url: 'https://www.meshy.ai/privacy-policy' 
    },
    { 
      id: 'acceptable',
      icon: FileText, 
      label: t.acceptable, 
      url: 'https://www.meshy.ai/acceptable-use-policy' 
    },
    { 
      id: 'contact',
      icon: Mail, 
      label: t.contact, 
      extra: 'support@meshy.ai',
      isEmail: true
    },
  ];

  const handleMenuClick = (item: any) => {
    if (item.id === 'lang') {
      setShowLangPicker(true);
      return;
    }
    if (item.url) {
      window.open(item.url, '_blank');
    } else if (item.isEmail) {
      window.location.href = `mailto:${item.extra}`;
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex flex-col h-full bg-meshy-dark relative">
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40">
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
              <h1 className="text-2xl font-bold text-white">{t.guest}</h1>
              <p className="text-neutral-500 text-[11px] font-medium opacity-70">{t.guestSub}</p>
            </div>
            <button onClick={onLoginClick} className="w-[80%] mx-auto bg-[#D0F870] py-5 rounded-[28px] text-black font-bold text-sm shadow-[0_15px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all">{t.signIn}</button>
          </header>
        ) : (
          <header className="px-8 py-10 bg-gradient-to-b from-neutral-900/40 to-transparent relative">
            <div className="flex items-center gap-5 mb-10">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#D0F870] to-green-300 rounded-[24px] blur-sm opacity-30" />
                <img src="https://picsum.photos/seed/user/200/200" className="w-16 h-16 rounded-[20px] border-3 border-black relative z-10 object-cover shadow-2xl" alt="" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white tracking-tight">Chunming Qu</h1>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[#D0F870] text-[10px] font-medium">{t.joined}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 px-1">
               <button 
                 onClick={onUpgradeTrigger}
                 className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-[32px] p-5 flex flex-col items-start gap-1 transition-all active:scale-[0.96] active:bg-neutral-900 shadow-2xl text-left"
               >
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">{t.plan}</p>
                  <p className="text-2xl font-black tracking-tight text-white">
                    {capitalize(userTier)}
                  </p>
               </button>
               
               <button 
                 onClick={onUpgradeTrigger}
                 className="bg-neutral-950/40 backdrop-blur-md border border-white/5 rounded-[32px] p-5 flex flex-col items-start gap-1 transition-all active:scale-[0.96] active:bg-neutral-900 shadow-2xl text-left relative"
               >
                  <div className="flex items-center justify-between w-full mb-1">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{t.credits}</p>
                    <img src={MESH_CREDIT_ICON} className="w-4 h-4 object-contain drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" alt="" />
                  </div>
                  <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{credits.toLocaleString()}</p>
               </button>
            </div>
          </header>
        )}

        <div className="px-6 space-y-10 pt-4">
          <div className="space-y-4">
            <div className="bg-neutral-900/30 backdrop-blur-md border border-white/5 rounded-[40px] overflow-hidden">
              {menuItems.map((item, i) => (
                <button 
                  key={item.id} 
                  onClick={() => handleMenuClick(item)} 
                  className={`w-full flex items-center justify-between px-6 py-4 active:bg-neutral-800 transition-all ${i !== 0 ? 'border-t border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="p-2 bg-neutral-800/40 rounded-xl text-neutral-400 border border-white/5 flex items-center justify-center w-9 h-9">
                      <item.icon size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-600">
                    {item.extra && <span className="text-[10px] font-bold text-[#D0F870]/80">{item.extra}</span>}
                    <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
          {isLoggedIn && (
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-5 text-rose-500 font-bold text-sm bg-rose-500/10 rounded-[30px] border border-rose-500/20 active:scale-[0.97] transition-all"><LogOut size={18} /> {t.logout}</button>
          )}
          <div className="text-center pb-6 opacity-30">
            <p className="text-[8px] font-bold text-neutral-600 uppercase tracking-[0.4em]">
              {t.version}
            </p>
          </div>
        </div>
      </div>

      {showLangPicker && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300" onClick={() => setShowLangPicker(false)}>
          <div className="w-full h-[85%] bg-[#111] rounded-t-[48px] p-8 pb-12 animate-slide-up border-t border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h3 className="text-xl font-bold text-white">{t.selectLang}</h3>
              <button onClick={() => setShowLangPicker(false)} className="p-2 bg-neutral-900 rounded-full text-neutral-500"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 pb-8">
              {languages.map(lang => (
                <button 
                  key={lang.id} 
                  onClick={() => { 
                    if (lang.active) {
                      onLanguageChange(lang.id as 'en' | 'zh'); 
                      setShowLangPicker(false); 
                    }
                  }} 
                  className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all active:scale-[0.98] ${
                    language === lang.id 
                      ? 'bg-[#D0F870]/10 border-[#D0F870]/40' 
                      : lang.active ? 'bg-neutral-900 border-white/5' : 'bg-neutral-900/40 border-white/5 opacity-50 cursor-default'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-bold ${language === lang.id ? 'text-[#D0F870]' : 'text-white'}`}>
                      {lang.label}
                    </p>
                    <p className="text-[10px] font-medium text-neutral-600 mt-1">{lang.sub}</p>
                  </div>
                  {language === lang.id ? (
                    <div className="w-10 h-10 bg-[#D0F870] rounded-full flex items-center justify-center text-black">
                      <Check size={20} strokeWidth={4} />
                    </div>
                  ) : !lang.active && (
                    <div className="px-3 py-1 bg-neutral-800 rounded-full border border-white/5 flex items-center gap-1.5">
                       <Hourglass size={10} className="text-neutral-500" />
                       <span className="text-[8px] font-bold text-neutral-500">{t.comingSoon}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Me;
