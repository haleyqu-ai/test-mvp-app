
import React, { useState, useEffect } from 'react';
import { NavTab, Model } from './types';
import Layout from './components/Layout';
import Explore from './components/Explore';
import Create from './components/Create';
import Assets from './components/Assets';
import Subscription from './components/Subscription';
import Me from './components/Me';
import ModelViewer from './components/ModelViewer';
import ImageViewer from './components/ImageViewer';
import PrintPage from './components/PrintPage';
import LoginModal from './components/LoginModal';
import SplashScreen from './components/SplashScreen';
import { CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.EXPLORE);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [credits, setCredits] = useState(150);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempSubscribeClose, setTempSubscribeClose] = useState(false);
  const [showPrintPage, setShowPrintPage] = useState(false);
  const [previousTab, setPreviousTab] = useState<NavTab>(NavTab.EXPLORE);
  const [isViewerLoading, setIsViewerLoading] = useState(false);
  
  // Persistent hint state
  const [hasSeenViewerHint, setHasSeenViewerHint] = useState<boolean>(() => {
    return localStorage.getItem('meshy_has_seen_viewer_hint') === 'true';
  });

  const [createInitialMode, setCreateInitialMode] = useState<'image3d' | 'genImage'>('image3d');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const handleTabChange = (tab: NavTab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
    setTempSubscribeClose(false);
  };

  const handleOpenModel = (model: Model, workspace: boolean = false) => {
    setSelectedModel(model);
    setIsWorkspaceMode(workspace);
  };

  const handleRemix = (model: Model) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedModel(null);
    setCreateInitialMode('genImage');
    setReferenceImage(model.thumbnail);
    setActiveTab(NavTab.CREATE);
  };

  const handleGenerate3D = (url: string) => {
    setSelectedImage(null);
    setCreateInitialMode('image3d');
    setReferenceImage(url);
    setActiveTab(NavTab.CREATE);
  };

  const handleEditImage = (url: string) => {
    setSelectedImage(null);
    setCreateInitialMode('genImage');
    setReferenceImage(url);
    setActiveTab(NavTab.CREATE);
  };

  const handleLoginTrigger = () => {
    setShowLoginModal(true);
  };

  const handleUpgradeTrigger = () => {
    // Save current state and switch to subscription mode
    setPreviousTab(activeTab);
    setActiveTab(NavTab.SUBSCRIBE);
    setTempSubscribeClose(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setCredits(150);
    setActiveTab(NavTab.EXPLORE);
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    // Return to the previous tab/page after subscription
    if (tempSubscribeClose) {
      setActiveTab(previousTab);
      setTempSubscribeClose(false);
    }
  };

  const handleHintShown = () => {
    setHasSeenViewerHint(true);
    localStorage.setItem('meshy_has_seen_viewer_hint', 'true');
  };

  const renderContent = () => {
    // If it's a triggered subscription, we render it as a top-level overlay instead of inside the Layout
    if (activeTab === NavTab.SUBSCRIBE && tempSubscribeClose) {
      return null;
    }

    switch (activeTab) {
      case NavTab.EXPLORE:
        return <Explore onModelClick={(m) => handleOpenModel(m, false)} language={language} />;
      case NavTab.ASSETS:
        return (
          <Assets 
            onModelClick={(m) => handleOpenModel(m, true)} 
            isSubscribed={isSubscribed}
            onGenerate3D={handleGenerate3D}
            onEditImage={handleEditImage}
            onImageClick={(url, title) => setSelectedImage({ url, title })}
            onNavigateToCreate={(mode) => {
              if (mode) setCreateInitialMode(mode);
              setReferenceImage(null);
              handleTabChange(NavTab.CREATE);
            }}
            language={language}
          />
        );
      case NavTab.CREATE:
        return (
          <Create 
            isLoggedIn={isLoggedIn}
            credits={credits} 
            setCredits={setCredits} 
            onLoginTrigger={handleLoginTrigger}
            onTaskModelClick={(m) => handleOpenModel(m, true)}
            onTaskImageClick={(url, title) => setSelectedImage({ url, title })}
            onUpgradeTrigger={handleUpgradeTrigger}
            initialMode={createInitialMode} 
            initialRefImage={referenceImage}
            language={language}
          />
        );
      case NavTab.SUBSCRIBE:
        return (
          <Subscription 
            isLoggedIn={isLoggedIn}
            isSubscribed={isSubscribed} 
            onSubscribeSuccess={() => {
              setIsSubscribed(true);
              setCredits(prev => prev + 1000);
              setShowSuccessModal(true);
            }} 
            credits={credits}
            setCredits={setCredits}
            showCloseButton={false}
            onLoginTrigger={handleLoginTrigger}
            language={language}
          />
        );
      case NavTab.ME:
        return (
          <Me 
            isLoggedIn={isLoggedIn} 
            isSubscribed={isSubscribed} 
            credits={credits} 
            onLoginClick={handleLoginTrigger}
            onLogout={handleLogout}
            onUpgradeTrigger={handleUpgradeTrigger}
            language={language}
            onLanguageChange={setLanguage}
          />
        );
      default:
        return null;
    }
  };

  const t = {
    en: {
      successTitle: 'Transmission Sync',
      successText: 'Payment completed. +1000 credits has been added and unlock features.',
      confirm: 'Confirm Protocol'
    },
    zh: {
      successTitle: '传输同步完成',
      successText: '支付成功。+1000 积分已到账，所有高级功能已解锁。',
      confirm: '确认协议'
    }
  }[language];

  return (
    <div className="flex items-center justify-center bg-[#E6E8E3] min-h-screen">
      <div className="w-[387px] h-[839px] bg-meshy-dark border-[8px] border-neutral-900 rounded-[58px] relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col">
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-3xl z-[60] flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full ml-auto mr-3" />
        </div>

        <div className="h-12 w-full flex items-end justify-between px-10 pb-2 text-white font-black text-[10px] z-[55] pointer-events-none tracking-tight">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-3.5 h-2 bg-white/40 rounded-sm" />
            <div className="w-3.5 h-2 bg-white/40 rounded-sm" />
            <div className="w-5 h-2.5 border border-white/40 rounded-[3px] p-0.5 relative">
               <div className="bg-white h-full w-[80%] rounded-[1px]" />
            </div>
          </div>
        </div>

        <Layout activeTab={activeTab} onTabChange={handleTabChange} language={language} hideNav={isViewerLoading}>
          {renderContent()}
        </Layout>

        {selectedModel && (
          <ModelViewer 
            model={selectedModel} 
            isLoggedIn={isLoggedIn}
            isSubscribed={isSubscribed}
            isWorkspaceMode={isWorkspaceMode}
            onClose={() => {
              setSelectedModel(null);
              setIsViewerLoading(false);
            }}
            onRemix={handleRemix}
            onLoginTrigger={handleLoginTrigger}
            onUpgradeTrigger={handleUpgradeTrigger}
            onPrint={() => {
              if (!isLoggedIn) { handleLoginTrigger(); return; }
              setShowPrintPage(true);
            }}
            hasSeenHint={hasSeenViewerHint}
            onHintShown={handleHintShown}
            onLoadingChange={setIsViewerLoading}
            language={language}
          />
        )}

        {/* Triggered Subscription Modal Overlay (Ensures it appears ABOVE the model viewer) */}
        {activeTab === NavTab.SUBSCRIBE && tempSubscribeClose && (
          <div className="absolute inset-0 z-[350] bg-black animate-in slide-in-from-bottom duration-500">
            <Subscription 
              isLoggedIn={isLoggedIn}
              isSubscribed={isSubscribed} 
              onSubscribeSuccess={() => {
                setIsSubscribed(true);
                setCredits(prev => prev + 1000);
                setShowSuccessModal(true);
              }} 
              credits={credits}
              setCredits={setCredits}
              showCloseButton={true}
              onClose={() => {
                setActiveTab(previousTab);
                setTempSubscribeClose(false);
              }}
              onLoginTrigger={handleLoginTrigger}
              language={language}
            />
          </div>
        )}

        {selectedImage && (
          <ImageViewer 
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onGenerate3D={handleGenerate3D}
            onEditImage={handleEditImage}
            language={language}
          />
        )}

        {showPrintPage && <PrintPage onClose={() => setShowPrintPage(false)} language={language} />}
        
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={handleLoginSuccess} 
            language={language}
          />
        )}

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-700/60 rounded-full z-[100]"></div>

        {showSuccessModal && (
          <div className="absolute inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="bg-neutral-900 border border-[#D0F870]/30 rounded-[40px] p-8 w-full flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-[#D0F870] rounded-[30px] flex items-center justify-center shadow-[0_0_30px_rgba(208,248,112,0.4)]">
                   <CheckCircle2 size={40} className="text-black" />
                </div>
                <div className="text-center space-y-3">
                   <h2 className="text-xl font-black text-white uppercase tracking-tighter">{t.successTitle}</h2>
                   <p className="text-neutral-300 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                     {t.successText}
                   </p>
                </div>
                <button onClick={handleConfirmSuccess} className="w-full bg-[#D0F870] py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-black active:scale-95 transition-all shadow-lg shadow-[#D0F870]/20">
                  {t.confirm}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
