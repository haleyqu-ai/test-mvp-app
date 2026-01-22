
import React from 'react';
import { NavTab } from '../types';
import { Compass, FolderOpen, Plus, CreditCard, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: 'en' | 'zh';
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, language, hideNav }) => {
  const t = {
    en: {
      explore: 'Explore',
      assets: 'Assets',
      create: 'Create',
      subscribe: 'Subscribe',
      me: 'Me'
    },
    zh: {
      explore: '发现',
      assets: '我的资产',
      create: '制作',
      subscribe: '订阅',
      me: '我的'
    }
  }[language];

  const tabs = [
    { id: NavTab.EXPLORE, icon: Compass, label: t.explore },
    { id: NavTab.ASSETS, icon: FolderOpen, label: t.assets },
    { id: NavTab.CREATE, icon: Plus, label: t.create, isSpecial: true },
    { id: NavTab.SUBSCRIBE, icon: CreditCard, label: t.subscribe },
    { id: NavTab.ME, icon: User, label: t.me },
  ];

  return (
    <div className="flex-1 flex flex-col relative h-full w-full overflow-hidden bg-transparent">
      <main className="flex-1 overflow-hidden bg-transparent w-full h-full relative">
        {children}
      </main>

      {/* Fixed Sci-Fi Bottom Nav */}
      <nav className={`absolute bottom-0 w-full bg-black/95 backdrop-blur-3xl border-t border-white/5 flex justify-around items-end pt-4 pb-12 px-2 z-50 h-28 transition-all duration-300 ${hideNav ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-4 flex flex-col items-center group"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                  isActive 
                    ? 'bg-[#D0F870] shadow-[0_0_30px_rgba(208,248,112,0.4)] scale-110' 
                    : 'bg-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:bg-neutral-700'
                }`}>
                  <Icon 
                    size={32} 
                    className={`transition-all duration-300 ${isActive ? 'text-black rotate-90' : 'text-[#D0F870]'}`} 
                    strokeWidth={3} 
                  />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300 ${
                  isActive ? 'text-[#D0F870] opacity-100' : 'text-white/80'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-[#D0F870] rounded-full animate-pulse" />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 pb-2 ${
                isActive ? 'text-[#D0F870] scale-110' : 'text-white/90 hover:text-white'
              }`}
            >
              <div className={`relative ${isActive ? 'drop-shadow-[0_0_8px_rgba(208,248,112,0.4)]' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-90'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
