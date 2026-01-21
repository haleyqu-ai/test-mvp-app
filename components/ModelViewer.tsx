
import React, { useState, useEffect, useRef } from 'react';
import { Model, RenderMode } from '../types';
import { 
  ArrowLeft, Share2, Download, Printer, Wand2, Maximize, X, 
  Box, RefreshCw, Lock, ChevronDown, RotateCcw, Sparkles, Info, Cpu, Layers, Activity, Zap, Move, Terminal, Image as ImageIcon,
  Copy, MoreHorizontal, MessageCircle, Mail, Send, Airplay
} from 'lucide-react';

interface ModelViewerProps {
  model: Model;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  isWorkspaceMode: boolean;
  onClose: () => void;
  onRemix: (model: Model) => void;
  onLoginTrigger: () => void;
  onUpgradeTrigger: () => void;
  onPrint: () => void;
  hasSeenHint?: boolean;
  onHintShown?: () => void;
}

const EXPORT_FORMATS = ['3mf', 'stl', 'fbx', 'obj', 'glb', 'usdz', 'Blend', 'Step'];

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
        
        {/* Apps Row */}
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

        {/* Actions List */}
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
  isSubscribed, 
  isWorkspaceMode,
  onClose, 
  onRemix, 
  onLoginTrigger, 
  onUpgradeTrigger,
  onPrint,
  hasSeenHint,
  onHintShown
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
  const modelViewerRef = useRef<any>(null);

  const MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  useEffect(() => {
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
  }, []);

  const handleResetView = () => {
    const viewer = modelViewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = '0deg 75deg 105%';
      viewer.cameraTarget = 'auto auto auto';
      viewer.fieldOfView = 'auto';
    }
  };

  const handleExportClick = () => {
    if (!isLoggedIn) { onLoginTrigger(); return; }
    if (!isSubscribed) { onUpgradeTrigger(); return; }
    setShowExport(true);
  };

  const handleFormatSelect = (fmt: string) => {
    if (exportedFormats.has(fmt)) return;
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
    if (btn.proOnly && (!isLoggedIn || !isSubscribed)) {
      if (!isLoggedIn) onLoginTrigger();
      else onUpgradeTrigger();
      return;
    }
    btn.action();
  };

  const actionButtons = [
    { 
      icon: isWorkspaceMode ? RotateCcw : Wand2, 
      label: isWorkspaceMode ? 'Retry' : 'Remix', 
      primary: true, 
      proOnly: isWorkspaceMode,
      restricted: true,
      action: isWorkspaceMode ? () => {} : () => onRemix(model) 
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
             <div className="w-full space-y-4 max-w-[260px]">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-[#D0F870] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Neural Mesh</span>
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

        {!loading && (
          <div className={`absolute right-6 flex flex-col gap-3 z-[120] transition-all duration-300 ${isFullscreen ? 'top-12' : 'top-6'}`}>
            <button 
              onClick={handleResetView} 
              title="Reset View"
              className="p-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl text-[#D0F870] active:scale-90 flex items-center justify-center"
            >
              <RotateCcw size={18} />
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl text-white active:scale-90">
              {isFullscreen ? <X size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <div className="bg-neutral-950 border-t border-white/10 px-6 pt-5 pb-12 grid grid-cols-4 gap-4 z-[110]">
          {actionButtons.map((btn, i) => (
            <button key={i} onClick={() => handleAction(btn)} className="flex flex-col items-center gap-2 group relative">
              <div className={`w-full aspect-square flex items-center justify-center rounded-2xl border border-white/5 transition-all ${btn.primary ? 'bg-[#D0F870] text-black shadow-lg active:scale-95' : 'bg-neutral-900 text-neutral-400 active:scale-95'}`}>
                <btn.icon size={22} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${btn.primary ? 'text-[#D0F870]' : 'text-neutral-500'} truncate`}>{btn.label}</span>
              {btn.proOnly && !isSubscribed && (
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
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Asset Intelligence</h3>
               <button onClick={() => setShowInfo(false)} className="p-2 bg-neutral-900 rounded-full text-neutral-500"><X size={16}/></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 hide-scrollbar">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                    <Sparkles size={14} className="text-[#D0F870]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Generation DNA</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-neutral-900/40 rounded-3xl border border-white/5 p-5 flex items-center gap-5">
                       <img src={model.thumbnail} className="w-20 h-20 rounded-2xl object-cover border border-white/10" alt="Ref" />
                       <div className="flex flex-col gap-1">
                          <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Reference Image</p>
                          <p className="text-[10px] font-bold text-white uppercase leading-tight">Neural Input Source</p>
                       </div>
                    </div>
                    <div className="bg-neutral-900/40 rounded-3xl border border-white/5 p-5 space-y-2">
                       <div className="flex items-center gap-2">
                          <Terminal size={12} className="text-[#D0F870]" />
                          <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Prompt</p>
                       </div>
                       <p className="text-[11px] font-medium text-neutral-300 leading-relaxed italic px-1">
                         "{model.prompt}"
                       </p>
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
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6">Select Format</h3>
              <div className="grid grid-cols-4 gap-3">
                {EXPORT_FORMATS.map(fmt => (
                  <button key={fmt} onClick={() => handleFormatSelect(fmt)} className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all ${exportedFormats.has(fmt) ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-neutral-900 border-white/5 text-white active:scale-95'}`}>
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
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default ModelViewer;
