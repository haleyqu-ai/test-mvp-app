
import React, { useState, useEffect } from 'react';
import { NavTab, Model, UserTier, GenerationTask } from './types';
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
import MockOpenWith from './components/MockOpenWith';
import { CheckCircle2, Star, Crown, Zap } from 'lucide-react';
import { MESH_CREDIT_ICON } from './constants';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.EXPLORE);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);
  const [selectedImageContext, setSelectedImageContext] = useState<{ images: {url: string; title: string}[]; index: number } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [credits, setCredits] = useState(150);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempSubscribeClose, setTempSubscribeClose] = useState(false);
  const [showPrintPage, setShowPrintPage] = useState(false);
  const [previousTab, setPreviousTab] = useState<NavTab>(NavTab.EXPLORE);
  const [isViewerLoading, setIsViewerLoading] = useState(false);
  const [shouldScrollToTasks, setShouldScrollToTasks] = useState(false);
  const [openWithFile, setOpenWithFile] = useState<string | null>(null);

  // Payment Management State
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing'>('confirm');
  const [paymentMeta, setPaymentMeta] = useState({ amount: 0, price: '', tier: 'pro' as UserTier | 'credits' });

  // Lifted Tasks State
  const [tasks, setTasks] = useState<GenerationTask[]>([
    { id: 't-completed-model', type: 'Model', status: 'completed', progress: 100, thumbnail: 'https://picsum.photos/seed/panda1/200/200', title: 'Ancient Panda', createdAt: 'Mar 24, 10:45 AM' },
    { id: 't-completed-image', type: 'Image', status: 'completed', progress: 100, thumbnail: 'https://picsum.photos/seed/fantasy_i-done/200/200', title: 'Mythic Citadel', createdAt: 'Mar 24, 09:30 AM' },
  ]);
  
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
    setSelectedModel(null);
    setCreateInitialMode('image3d');
    setReferenceImage(model.thumbnail);
    setActiveTab(NavTab.CREATE);
  };

  const handleGenerate3D = (url: string) => {
    setSelectedImageContext(null);
    setCreateInitialMode('image3d');
    setReferenceImage(url);
    setActiveTab(NavTab.CREATE);
  };

  const handleEditImage = (url: string) => {
    setSelectedImageContext(null);
    setCreateInitialMode('genImage');
    setReferenceImage(url);
    setActiveTab(NavTab.CREATE);
  };

  const handleLoginTrigger = () => {
    setShowLoginModal(true);
  };

  const handleUpgradeTrigger = () => {
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
    setUserTier('free');
    setCredits(150);
    setActiveTab(NavTab.EXPLORE);
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    if (tempSubscribeClose) {
      setActiveTab(previousTab);
      setTempSubscribeClose(false);
    }
  };

  const handleHintShown = () => {
    setHasSeenViewerHint(true);
    localStorage.setItem('meshy_has_seen_viewer_hint', 'true');
  };

  const handleRetryModel = (model: Model) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newTask: GenerationTask = {
      id: Date.now().toString(),
      type: 'Model',
      status: 'processing',
      progress: 0,
      thumbnail: model.thumbnail,
      title: `${model.title} (Retry)`,
      createdAt: `${dateStr}, ${timeStr}`
    };
    
    setTasks(prev => [newTask, ...prev]);
    setSelectedModel(null);
    setActiveTab(NavTab.CREATE);
    setShouldScrollToTasks(true);
  };

  const handleStartPayment = (meta: { amount: number; price: string; tier: UserTier | 'credits' }) => {
    setPaymentMeta(meta);
    setPaymentStep('confirm');
    setIsPaying(true);
    
    setTimeout(() => {
      setPaymentStep('processing');
      setTimeout(() => {
        if (meta.tier === 'credits') {
          setCredits(prev => prev + meta.amount);
        } else {
          setUserTier(meta.tier);
          setCredits(prev => prev + (meta.tier === 'pro' ? 1000 : 4000));
        }
        setIsPaying(false);
        setShowSuccessModal(true);
      }, 2500);
    }, 1500);
  };

  const t = {
    en: {
      successTitle: 'Payment completed',
      successText: 'Credits added and advanced features unlocked.',
      confirm: 'Okay',
      creditTopup: 'Meshy AI Credit Top-up',
      confirmPay: 'DOUBLE CLICK TO PAY',
      syncing: 'SYNCING TRANSACTION'
    },
    zh: {
      successTitle: '支付完成',
      successText: '积分已入账，高级功能已解锁。',
      confirm: '好的',
      creditTopup: 'Meshy AI 积分充值',
      confirmPay: '双击侧边按钮支付',
      syncing: '交易同步中'
    }
  }[language];

  // Hide Nav when either Model or Image viewer is open
  const isAnyViewerOpen = selectedModel !== null || selectedImageContext !== null || isViewerLoading;

  const renderPaymentOverlay = () => {
    if (!isPaying) return null;
    const isTopup = paymentMeta.tier === 'credits';
    const displayTitle = isTopup ? t.creditTopup : `Meshy AI ${paymentMeta.tier.toUpperCase()}`;
    
    return (
      <div className="fixed inset-0 z-[600] bg-black/85 backdrop-blur-2xl flex items-end px-4 pb-40 pointer-events-auto animate-in fade-in duration-300">
         <div className="w-full max-w-[400px] mx-auto bg-[#0F0F0F] rounded-[32px] overflow-hidden animate-slide-up flex flex-col items-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 outline-none select-none">
            <div className="pt-4 pb-6 w-full flex justify-center">
              <div className="w-10 h-1.5 bg-neutral-800 rounded-full" />
            </div>
            
            <div className="flex flex-col items-center gap-6 px-8 pb-8 w-full">
              <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center shadow-2xl relative ${
                paymentMeta.tier === 'studio' ? 'bg-[#C084FC]' : 
                paymentMeta.tier === 'pro' ? 'bg-[#D0F870]' :
                'bg-orange-400'
              }`}>
                {/* Restore logic to use Tier Icons for subscriptions and MESH_CREDIT_ICON for topups */}
                {isTopup ? (
                   <img 
                    src={MESH_CREDIT_ICON} 
                    className="w-12 h-12 object-contain filter drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]"
                    alt=""
                  />
                ) : (
                  paymentMeta.tier === 'studio' ? <Star size={40} className="text-black" /> : <Crown size={40} className="text-black" />
                )}
                <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] pointer-events-none" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight leading-none">{displayTitle}</h3>
                <p className="text-neutral-500 text-[14px] font-bold mt-1">
                  {paymentMeta.price}
                </p>
              </div>
            </div>

            <div className="w-full px-8">
               <div className="w-full h-[0.5px] bg-white/5" />
            </div>

            <div className="w-full p-8 min-h-[140px] flex flex-col justify-center items-center border-none outline-none">
               {paymentStep === 'confirm' ? (
                 <div className="w-full flex justify-between items-center bg-neutral-900/30 rounded-2xl px-6 py-5 animate-in fade-in zoom-in-95 duration-300 border border-white/5">
                    <span className="text-[11px] font-black uppercase tracking-[0.05em] text-neutral-500">
                      {t.confirmPay}
                    </span>
                    <div className="w-9 h-9 flex items-center justify-center relative">
                      <div className="w-7 h-7 border-[2.5px] border-[#007AFF] rounded-lg shadow-[0_0_10px_rgba(0,122,255,0.2)]" />
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 border-none outline-none">
                    <div className="relative w-12 h-12 flex items-center justify-center border-none outline-none">
                      <div 
                        className="w-full h-full border-[4px] border-transparent border-t-[#007AFF] border-r-[#007AFF] rounded-full animate-spin" 
                        style={{ animationDuration: '0.8s' }}
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 animate-pulse">
                      {t.syncing}
                    </p>
                 </div>
               )}
            </div>
         </div>
      </div>
    );
  };

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

        <Layout activeTab={activeTab} onTabChange={handleTabChange} language={language} hideNav={isAnyViewerOpen}>
          {/* Main content container with persistent tabs */}
          <div className="relative h-full w-full overflow-hidden">
            {/* Explore Tab */}
            <div className={`absolute inset-0 ${activeTab === NavTab.EXPLORE ? 'z-10' : 'invisible pointer-events-none z-0'}`}>
              <Explore 
                onModelClick={(m) => handleOpenModel(m, false)} 
                onNavigateToCreate={(mode) => {
                  setCreateInitialMode(mode);
                  setReferenceImage(null);
                  handleTabChange(NavTab.CREATE);
                }}
                language={language} 
              />
            </div>

            {/* Assets Tab */}
            <div className={`absolute inset-0 ${activeTab === NavTab.ASSETS ? 'z-10' : 'invisible pointer-events-none z-0'}`}>
              <Assets 
                isLoggedIn={isLoggedIn}
                onLoginTrigger={handleLoginTrigger}
                onModelClick={(m) => handleOpenModel(m, true)} 
                userTier={userTier}
                onGenerate3D={handleGenerate3D}
                onEditImage={handleEditImage}
                onImageClick={(url, title, collection) => {
                  const idx = collection.findIndex(item => item.url === url);
                  setSelectedImageContext({ images: collection, index: idx });
                }}
                onNavigateToCreate={(mode) => {
                  if (mode) setCreateInitialMode(mode);
                  setReferenceImage(null);
                  handleTabChange(NavTab.CREATE);
                }}
                onOpenFile={setOpenWithFile}
                language={language}
              />
            </div>

            {/* Create Tab */}
            <div className={`absolute inset-0 ${activeTab === NavTab.CREATE ? 'z-10' : 'invisible pointer-events-none z-0'}`}>
              <Create 
                isLoggedIn={isLoggedIn}
                userTier={userTier}
                credits={credits} 
                setCredits={setCredits} 
                onLoginTrigger={handleLoginTrigger}
                onTaskModelClick={(m) => handleOpenModel(m, true)}
                onTaskImageClick={(url, title) => {
                  const imgTasks = tasks
                    .filter(t => t.type === 'Image' && t.status === 'completed')
                    .map(t => ({ url: t.thumbnail, title: t.title }));
                  const idx = imgTasks.findIndex(item => item.url === url);
                  setSelectedImageContext({ images: imgTasks, index: idx });
                }}
                onUpgradeTrigger={handleUpgradeTrigger}
                initialMode={createInitialMode} 
                initialRefImage={referenceImage}
                language={language}
                tasks={tasks}
                setTasks={setTasks}
                shouldScrollToTasks={shouldScrollToTasks}
                onScrollComplete={() => setShouldScrollToTasks(false)}
              />
            </div>

            {/* Subscribe Tab - Explicitly z-10 so Layout's nav (z-50) stays on top */}
            <div className={`absolute inset-0 ${activeTab === NavTab.SUBSCRIBE && !tempSubscribeClose ? 'z-10' : 'invisible pointer-events-none z-0'}`}>
              <Subscription 
                isLoggedIn={isLoggedIn}
                userTier={userTier} 
                onSubscribeSuccess={(tier) => {
                  setUserTier(tier);
                  setCredits(prev => prev + (tier === 'pro' ? 1000 : 4000));
                  setShowSuccessModal(true);
                }} 
                credits={credits}
                setCredits={setCredits}
                showCloseButton={false}
                onLoginTrigger={handleLoginTrigger}
                language={language}
                onStartPayment={handleStartPayment}
              />
            </div>

            {/* Me Tab */}
            <div className={`absolute inset-0 ${activeTab === NavTab.ME ? 'z-10' : 'invisible pointer-events-none z-0'}`}>
              <Me 
                isLoggedIn={isLoggedIn} 
                userTier={userTier} 
                credits={credits} 
                onLoginClick={handleLoginTrigger}
                onLogout={handleLogout}
                onUpgradeTrigger={handleUpgradeTrigger}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </Layout>

        {selectedModel && (
          <ModelViewer 
            model={selectedModel} 
            isLoggedIn={isLoggedIn}
            userTier={userTier}
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
            onOpenFile={setOpenWithFile}
            language={language}
            onRetryTask={handleRetryModel}
          />
        )}

        {/* Temporary Subscription Overlay (from other tabs) */}
        {activeTab === NavTab.SUBSCRIBE && tempSubscribeClose && (
          <div className="absolute inset-0 z-[350] bg-black animate-in slide-in-from-bottom duration-500">
            <Subscription 
              isLoggedIn={isLoggedIn}
              userTier={userTier} 
              onSubscribeSuccess={(tier) => {
                setUserTier(tier);
                setCredits(prev => prev + (tier === 'pro' ? 1000 : 4000));
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
              onStartPayment={handleStartPayment}
            />
          </div>
        )}

        {selectedImageContext && (
          <ImageViewer 
            images={selectedImageContext.images}
            initialIndex={selectedImageContext.index}
            onClose={() => setSelectedImageContext(null)}
            onGenerate3D={handleGenerate3D}
            onEditImage={handleEditImage}
            language={language}
          />
        )}

        {showPrintPage && (
          <PrintPage 
            onClose={() => setShowPrintPage(false)} 
            onOpenFile={(file) => {
              setOpenWithFile(file);
            }}
            language={language} 
          />
        )}
        
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onLoginSuccess={handleLoginSuccess} 
            language={language}
          />
        )}

        {openWithFile && (
          <MockOpenWith 
            fileName={openWithFile} 
            onClose={() => setOpenWithFile(null)} 
          />
        )}

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-700/60 rounded-full z-[100]"></div>

        {renderPaymentOverlay()}

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
