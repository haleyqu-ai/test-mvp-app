
import React, { useState, useEffect, useRef } from 'react';
import { Model, RenderMode, UserTier } from '../types';
import { 
  ArrowLeft, Share2, Download, Printer, Wand2, Maximize, X, 
  Box, RefreshCw, Lock, ChevronDown, RotateCcw, Sparkles, Info, Cpu, Layers, Activity, Zap, Move, Terminal, Image as ImageIcon,
  Copy, MoreHorizontal, MessageCircle, Mail, Send, Airplay, MoveVertical
} from 'lucide-react';
import { MESHY_BRAND_LOGO } from '../constants';

// Fix: Add intrinsic element definition for model-viewer to resolve TypeScript errors using React.JSX
declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

// Updated Export Formats Order: 3mf, stl, fbx, obj, glb, usdz, Blend
const EXPORT_FORMATS = ['3MF', 'STL', 'FBX', 'OBJ', 'GLB', 'USDZ', 'BLEND'];

interface ModelViewerProps {
  model: Model;
  isLoggedIn: boolean;
  userTier: UserTier;
  isWorkspaceMode: boolean;
  onClose: () => void;
  onRemix: (model: Model) => void;
  onLoginTrigger: () => void;
  onUpgradeTrigger: () => void;
  onPrint: () => void;
  hasSeenHint?: boolean;
  onHintShown?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  onRetryTask?: (model: Model) => void;
  onOpenFile?: (name: string) => void;
  language: 'en' | 'zh';
}

const GestureHint: React.FC<{ language: 'en' | 'zh' }> = ({ language }) => {
  const t = {
    en: 'Pinch to Zoom • Drag to Rotate',
    zh: '双指缩放 • 拖动旋转'
  }[language];

  return (
    <div className="absolute inset-0 z-[140] pointer-events-none flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[40px] px-8 py-8 flex flex-col items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-10">
          <div className="relative w-14 h-14">
            <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-[#D0F870] rounded-full -translate-x-6 -translate-y-2 animate-[pinch-out-1_2s_ease-in-out_infinite]" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-[#D0F870] rounded-full translate-x-2 translate-y-2 animate-[pinch-out-2_2s_ease-in-out_infinite]" />
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="relative w-14 h-14">
            <div className="absolute top-1/2 left-1/2 w-5 h-5 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-[drag-horizontal_2s_ease-in-out_infinite]" />
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white animate-pulse whitespace-nowrap">
          {t}
        </p>
      </div>
      <style>{`
        @keyframes pinch-out-1 {
          0%, 100% { transform: translate(-24px, -12px) scale(1); opacity: 0.2; }
          50% { transform: translate(-34px, -20px) scale(1.1); opacity: 1; }
        }
        @keyframes pinch-out-2 {
          0%, 100% { transform: translate(10px, 12px) scale(1); opacity: 0.2; }
          50% { transform: translate(20px, 20px) scale(1.1); opacity: 1; }
        }
        @keyframes drag-horizontal {
          0%, 100% { transform: translate(-30px, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(10px, -50%) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ShareSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const apps = [
    { icon: Airplay, label: 'AirDrop', color: 'bg-blue-500' },
    { icon: MessageCircle, label: 'Messages', color: 'bg-green-500' },
    { icon: Mail, label: 'Mail', color: 'bg-blue-400' },
    { icon: Send, label: 'Slack', color: 'bg-purple-500' },
    { icon: MoreHorizontal, label: 'More', color: 'bg-neutral-600' },
  ];
  const actions = [
    { icon: Copy, label: 'Copy Link' },
    { icon: Download, label: 'Save to Files' },
    { icon: Printer, label: 'Print' },
    { icon: MoreHorizontal, label: 'Edit Actions...' },
  ];
  return (
    <div className="absolute inset-0 z-[300] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full bg-[#1c1c1e] rounded-t-[32px] p-4 pb-12 animate-slide-up flex flex-col gap-6" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto" />
        <div className="flex overflow-x-auto hide-scrollbar gap-5 px-2">
          {apps.map((app, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <app.icon size={24} />
              </div>
              <span className="text-[10px] font-medium text-neutral-400">{app.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#2c2c2e] rounded-2xl overflow-hidden">
          {actions.map((action, i) => (
            <button key={i} className={`w-full flex items-center justify-between px-5 py-4 active:bg-neutral-700 transition-colors ${i !== 0 ? 'border-t border-white/5' : ''}`}>
              <span className="text-sm text-white font-medium">{action.label}</span>
              <action.icon size={18} className="text-neutral-400" />
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="w-full bg-[#2c2c2e] py-4 rounded-2xl text-white font-semibold text-base active:bg-neutral-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  model, 
  isLoggedIn, 
  userTier, 
  isWorkspaceMode,
  onClose, 
  onRemix, 
  onLoginTrigger, 
  onUpgradeTrigger,
  onPrint,
  hasSeenHint,
  onHintShown,
  onLoadingChange,
  onRetryTask,
  onOpenFile,
  language
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHint, setShowHint] = useState(!hasSeenHint);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportedFormats, setExportedFormats] = useState<Set<string>>(new Set());
  
  const maxRetries = userTier === 'studio' ? 8 : userTier === 'pro' ? 4 : 0;
  const [retriesLeft, setRetriesLeft] = useState(maxRetries);

  const modelViewerRef = useRef<any>(null);
  const MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  // Ensure retriesLeft is updated when userTier or model changes
  useEffect(() => {
    setRetriesLeft(maxRetries);
  }, [userTier, model.id]);

  useEffect(() => {
    onLoadingChange?.(true);
    const viewer = modelViewerRef.current;
    let progressInterval: number;
    const startProgress = () => {
      progressInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
          const jump = Math.random() * 4 + 1;
          return Math.min(prev + jump, 98);
        });
      }, 80);
    };
    startProgress();
    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        onLoadingChange?.(false);
        if (showHint) {
          setTimeout(() => {
            setShowHint(false);
            onHintShown?.();
          }, 4000);
        }
      }, 500); 
      clearInterval(progressInterval);
    };
    if (viewer) {
      viewer.addEventListener('load', handleLoad);
      if (viewer.loaded) handleLoad();
    }
    return () => {
      if (viewer) viewer.removeEventListener('load', handleLoad);
      clearInterval(progressInterval);
    };
  }, [model.id]);

  const handleResetView = () => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = '0deg 75deg 105%';
      viewer.cameraTarget = 'auto auto auto';
      viewer.fieldOfView = 'auto';
    }
  };

  const handleRetry = () => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    if (userTier === 'free') { onUpgradeTrigger(); return; }
    
    if (retriesLeft > 0) {
      setRetriesLeft(prev => prev - 1);
      if (onRetryTask) {
          onRetryTask(model);
      }
    } else {
      // If user is paid but ran out of free retries, show message or trigger up-sell to Studio
      alert(language === 'en' ? "You've used all free retries for this task." : "您已用完该任务的所有免费重试次数。");
    }
  };

  const handleExportClick = () => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    if (userTier === 'free') { onUpgradeTrigger(); return; }
    setShowExport(true);
  };

  const handleFormatSelect = (fmt: string) => {
    if (exportedFormats.has(fmt)) {
      onOpenFile?.(`${model.title.toLowerCase().replace(/\s+/g, '_')}.${fmt.toLowerCase()}`);
      return;
    }
    setIsExporting(fmt);
    setTimeout(() => {
      setExportedFormats(prev => new Set([...prev, fmt]));
      setIsExporting(null);
    }, 1500);
  };

  const handleAction = (btn: any) => {
    if (btn.restricted && !isLoggedIn) {
      onLoginTrigger();
      return;
    }
    btn.action();
  };

  const actionButtons = [
    { 
      icon: isWorkspaceMode ? RotateCcw : Wand2, 
      label: isWorkspaceMode 
        ? (userTier === 'free' ? 'Free Retry' : `Free Retry (${retriesLeft}/${maxRetries})`) 
        : 'Remix', 
      primary: true, 
      restricted: isWorkspaceMode,
      action: isWorkspaceMode ? handleRetry : () => onRemix(model),
      disabled: isWorkspaceMode && userTier !== 'free' && retriesLeft <= 0
    },
    { 
      icon: Download, 
      label: 'Export', 
      proOnly: true,
      restricted: true,
      action: handleExportClick 
    },
    { 
      icon: Printer, 
      label: '3D Print', 
      restricted: true,
      action: onPrint 
    },
    { 
      icon: Info, 
      label: 'Info', 
      action: () => setShowInfo(true) 
    },
  ];

  return (
    <div className={`absolute inset-0 z-[100] bg-black flex flex-col overflow-hidden transition-all duration-400 ${isFullscreen ? 'fixed' : 'animate-in slide-in-from-right'}`}>
      {!isFullscreen && (
        <div className="h-20 bg-black/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 pt-6 z-[110]">
           <button onClick={onClose} className="p-2.5 bg-neutral-900 border border-white/10 rounded-full text-white active:scale-90 transition-all flex items-center justify-center">
             <ArrowLeft size={20} />
           </button>
           <div className="text-center flex flex-col items-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white truncate max-w-[200px]">
                {isWorkspaceMode ? 'Workspace' : model.title}
              </h2>
           </div>
           <button onClick={() => setShowShare(true)} className="p-2.5 bg-neutral-900 border border-white/10 rounded-full text-white active:scale-90 transition-all flex items-center justify-center">
             <Share2 size={20} />
           </button>
        </div>
      )}

      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center bg-black px-12 animate-in fade-in duration-300">
             <div className="relative mb-14" style={{ perspective: '1000px' }}>
                <div className="relative w-40 h-40 flex items-center justify-center animate-[rotate-y-smooth_4s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-32 h-32 bg-neutral-900/50 rounded-xl border border-[#D0F870]/20" style={{ 
                    transform: 'rotateX(80deg) translateZ(-40px)',
                    backgroundImage: 'linear-gradient(#D0F87020 1px, transparent 1px), linear-gradient(90deg, #D0F87020 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }} />
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <img src={MESHY_BRAND_LOGO} className="w-full h-full object-contain filter brightness-[1.1] contrast-[1.1] drop-shadow-[0_0_20px_rgba(208,248,112,0.6)]" alt="" />
                    <div className="absolute inset-x-0 h-[2px] bg-[#D0F870] shadow-[0_0_15px_#D0F870] opacity-80 animate-[scan-y_2.5s_ease-in-out_infinite]" style={{ transform: 'translateZ(20px)' }} />
                  </div>
                </div>
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-48 h-10 bg-[#D0F870]/20 blur-[30px] rounded-full scale-y-50" />
             </div>
             <div className="w-full space-y-4 max-w-[260px]">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-[#D0F870] font-black uppercase tracking-[0.4em] animate-pulse">loading</span>
                  <span className="text-xl font-black text-white tabular-nums">{Math.floor(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5 relative">
                   <div className="h-full bg-[#D0F870] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
             </div>
          </div>
        )}

        <model-viewer
          ref={modelViewerRef}
          src={MODEL_URL}
          alt={model.title}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          environment-image="neutral"
          touch-action="pan-y"
          className="w-full h-full"
        >
          <div slot="progress-bar" className="hidden"></div>
        </model-viewer>

        {!loading && showHint && <GestureHint language={language} />}

        {!loading && (
          <div className={`absolute right-6 flex flex-col gap-3 z-[120] transition-all duration-300 ${isFullscreen ? 'top-12' : 'top-6'}`}>
            <button onClick={handleResetView} className="p-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl text-white active:scale-90 flex items-center justify-center">
              <RotateCcw size={18} />
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl text-white active:scale-90">
              {isFullscreen ? <X size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        )}
      </div>

      {!isFullscreen && !loading && (
        <div className="bg-neutral-950 border-t border-white/10 px-6 pt-5 pb-12 grid grid-cols-4 gap-4 z-[110] animate-in slide-in-from-bottom duration-500">
          {actionButtons.map((btn, i) => (
            <button 
              key={i} 
              onClick={() => handleAction(btn)} 
              disabled={btn.disabled}
              className={`flex flex-col items-center gap-2 group relative transition-all ${btn.disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
            >
              <div className={`w-full aspect-square flex items-center justify-center rounded-2xl border border-white/5 transition-all ${btn.primary ? 'bg-[#D0F870] text-black shadow-lg active:scale-95' : 'bg-neutral-900 text-neutral-400 active:scale-95'}`}>
                <btn.icon size={22} />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-tight ${btn.primary ? 'text-[#D0F870]' : 'text-neutral-500'} text-center leading-[1.2] px-1`}>
                {btn.label}
              </span>
              {(btn.proOnly || (isWorkspaceMode && btn.primary)) && userTier === 'free' && (
                <div className="absolute top-1 right-1">
                  <Lock size={10} className={btn.primary ? 'text-black/60' : 'text-[#D0F870]/60'} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {showInfo && (
        <div className="absolute inset-0 z-[260] bg-black/60 backdrop-blur-sm flex items-end" onClick={() => setShowInfo(false)}>
          <div className="w-full h-[85%] bg-[#111] rounded-t-[48px] p-8 pb-12 animate-slide-up border-t border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex items-center justify-between mb-6 shrink-0">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Asset Info</h3>
               <button onClick={() => setShowInfo(false)} className="p-2 bg-neutral-900 rounded-full text-neutral-500"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-8 hide-scrollbar">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                    <Sparkles size={14} className="text-[#D0F870]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">DATA</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-neutral-900/40 rounded-3xl border border-white/5 p-5 flex items-center gap-5">
                       <img src={model.thumbnail} className="w-20 h-20 rounded-2xl object-cover border border-white/10" alt="Ref" />
                       <div className="flex flex-col gap-1">
                          <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Reference</p>
                          <p className="text-[10px] font-bold text-white uppercase tracking-tight">Source</p>
                       </div>
                    </div>
                    <div className="bg-neutral-900/40 rounded-3xl border border-white/5 p-5 space-y-2">
                       <div className="flex items-center gap-2">
                          <Terminal size={12} className="text-[#D0F870]" />
                          <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Prompt</p>
                       </div>
                       <p className="text-[11px] font-medium text-neutral-300 leading-relaxed italic px-1">"{model.prompt}"</p>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Activity size={14} className="text-[#D0F870]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Specs</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Topology', value: model.specs.topology, icon: Layers },
                    { label: 'Geometry', value: `${model.specs.faces.toLocaleString()} Faces`, icon: Activity },
                    { label: 'Size', value: model.size, icon: Download },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-neutral-900/60 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-4">
                          <item.icon size={16} className="text-[#D0F870]" />
                          <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-white uppercase">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExport && (
        <div className="absolute inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-end" onClick={() => setShowExport(false)}>
           <div className="w-full bg-[#111] rounded-t-[48px] p-8 pb-12 animate-slide-up border-t border-white/10" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 text-center">Export Matrix</h3>
              <div className="grid grid-cols-4 gap-3">
                {EXPORT_FORMATS.map(fmt => (
                  <button 
                    key={fmt} 
                    onClick={() => handleFormatSelect(fmt)} 
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all ${exportedFormats.has(fmt) ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-neutral-900 border-white/5 text-white active:scale-95'}`}
                  >
                    {isExporting === fmt ? <RefreshCw className="animate-spin" size={18}/> : <Box size={18}/>}
                    <span className="text-[8px] font-black uppercase">{fmt}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}
      {showShare && <ShareSheet onClose={() => setShowShare(false)} />}
      <style>{`
        @keyframes rotate-y-smooth {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes scan-y {
          0%, 100% { top: 10%; opacity: 0; }
          20%, 80% { opacity: 0.8; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
};

export default ModelViewer;
