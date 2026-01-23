
import React, { useState, useEffect, useRef } from 'react';
import { Type, Image as ImageIcon, Sparkles, Zap, Camera, ListChecks, CheckCircle2, X, Plus, Upload, Clock, AlertCircle } from 'lucide-react';
import { GenerationTask, Model, UserTier } from '../types';
import { MOCK_MODELS, MESH_CREDIT_ICON } from '../constants';

interface CreateProps {
  isLoggedIn: boolean;
  userTier: UserTier;
  credits: number;
  setCredits: (c: number) => void;
  onLoginTrigger: () => void;
  onTaskModelClick: (model: Model) => void;
  onTaskImageClick: (url: string, title: string) => void;
  onUpgradeTrigger: () => void;
  initialMode?: 'image3d' | 'genImage';
  initialRefImage?: string | null;
  language: 'en' | 'zh';
  tasks: GenerationTask[];
  setTasks: React.Dispatch<React.SetStateAction<GenerationTask[]>>;
  shouldScrollToTasks?: boolean;
  onScrollComplete?: () => void;
}

const Create: React.FC<CreateProps> = ({ 
  isLoggedIn, 
  userTier,
  credits, 
  setCredits, 
  onLoginTrigger, 
  onTaskModelClick,
  onTaskImageClick,
  onUpgradeTrigger,
  initialMode = 'image3d', 
  initialRefImage,
  language,
  tasks,
  setTasks,
  shouldScrollToTasks,
  onScrollComplete
}) => {
  const [tab, setTab] = useState<'image3d' | 'genImage'>(initialMode as any);
  const [prompt, setPrompt] = useState('');
  const [isPromptError, setIsPromptError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [refImage, setRefImage] = useState<string | null>(initialRefImage || null);
  const [showQueueWarning, setShowQueueWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tasksSectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialMode) setTab(initialMode as any);
    if (initialRefImage) setRefImage(initialRefImage);
  }, [initialMode, initialRefImage]);

  useEffect(() => {
    if (shouldScrollToTasks) {
       setTimeout(() => {
         tasksSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
         onScrollComplete?.();
       }, 500);
    }
  }, [shouldScrollToTasks]);

  useEffect(() => {
    const processingTasks = tasks.filter(t => t.status === 'processing');
    if (processingTasks.length === 0) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'processing') {
          const newProgress = Math.min(task.progress + (100 / 15) * 0.5, 100); 
          if (newProgress >= 100) {
            return { ...task, status: 'completed', progress: 100 };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [tasks, setTasks]);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setRefImage('https://picsum.photos/seed/captured_proto/400/400');
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Camera permission is required to capture images for 3D generation.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRefImage(event.target?.result as string);
        setIsImageError(false);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be selected again
    e.target.value = '';
  };

  const handleGenerate = () => {
    if (!isLoggedIn) {
      onLoginTrigger();
      return;
    }

    if (tab === 'image3d' && !refImage) {
      setIsImageError(true);
      setTimeout(() => setIsImageError(false), 1000);
      return;
    }

    const currentProcessingCount = tasks.filter(t => t.status === 'processing').length;
    if (userTier === 'free' && currentProcessingCount >= 1) {
      setShowQueueWarning(true);
      return;
    }

    if (tab === 'genImage' && !prompt.trim()) {
      setIsPromptError(true);
      setTimeout(() => setIsPromptError(false), 1000);
      return;
    }
    
    const cost = tab === 'image3d' ? 25 : 5;
    
    if (credits < cost) {
      onUpgradeTrigger();
      return;
    }
    setCredits(credits - cost);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimeStr = `${dateStr}, ${timeStr}`;
    
    const newTask: GenerationTask = {
      id: Date.now().toString(),
      type: tab === 'image3d' ? 'Model' : 'Image',
      status: 'processing',
      progress: 0,
      thumbnail: refImage || (tab === 'image3d' ? 'https://picsum.photos/seed/panda_new/200/200' : 'https://picsum.photos/seed/new_fantasy/200/200'),
      title: tab === 'image3d' ? 'New Mesh' : prompt.slice(0, 15) || 'Visual Asset',
      createdAt: fullTimeStr
    };
    
    setTasks([newTask, ...tasks]);

    setTimeout(() => {
      tasksSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTaskClick = (task: GenerationTask) => {
    if (task.status !== 'completed') return;
    
    if (task.type === 'Model') {
      const model = MOCK_MODELS.find(m => m.id === 'm1') || MOCK_MODELS[0];
      onTaskModelClick({ ...model, title: task.title, thumbnail: task.thumbnail });
    } else {
      onTaskImageClick(task.thumbnail, task.title);
    }
  };

  const isImg3D = tab === 'image3d';
  const themeTextColor = isImg3D ? 'text-[#D0F870]' : 'text-[#C084FC]';

  const t = {
    en: {
      queueLimit: 'Free user only allow 1 task in queue, subscribe and unlock more concurrent task and high speed.',
      dismiss: 'Dismiss',
      upgrade: 'Upgrade Now',
      generateModel: 'Generate Model',
      generateImage: 'Generate Image',
      noImage: "No image? Click here to generate one.",
      imgRequired: 'Image Required',
      refImgEdit: 'Add reference image to edit',
      optional: '(Optional)',
      recentTasks: 'Recent Generation Tasks',
      pleaseUpload: 'Please upload an image first'
    },
    zh: {
      queueLimit: '免费用户同时只能进行1个任务，请订阅解锁更多并发任务和极速生成。',
      dismiss: '知道了',
      upgrade: '立即升级',
      generateModel: '制作模型',
      generateImage: '制作图片',
      noImage: "没有图片？点击这里生成一张。",
      imgRequired: '需要参考图',
      refImgEdit: '添加参考图进行编辑',
      optional: '(可选)',
      recentTasks: '最近生成任务',
      pleaseUpload: '请先上传一张图片'
    }
  }[language];

  return (
    <div className="flex flex-col h-full bg-meshy-dark">
      {/* Hidden Global File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      <header className="sticky top-0 bg-black/95 backdrop-blur-xl z-30 px-6 pt-4 pb-4 border-b border-white/5">
        <div className="relative flex justify-center items-center mb-6">
          <h1 className="text-xl font-bold text-white">AI Generation</h1>
          {isLoggedIn && (
            <button 
              onClick={onUpgradeTrigger}
              className="absolute right-0 bg-[#D0F870]/10 border border-[#D0F870]/20 px-3 py-1.5 rounded-full flex items-center gap-2 active:scale-95 transition-all outline-none"
            >
               <img src={MESH_CREDIT_ICON} className="w-3.5 h-3.5 object-contain" alt="Credits" />
               <span className="text-[10px] font-black text-[#D0F870]">{credits}</span>
            </button>
          )}
        </div>
        
        <div className="flex p-1 bg-neutral-900 rounded-2xl border border-white/5">
          <button 
            onClick={() => setTab('image3d')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${
              tab === 'image3d' ? 'bg-[#D0F870] text-black shadow-lg shadow-[#D0F870]/20' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <ImageIcon size={12} />
            Image-to-3D
          </button>
          <button 
            onClick={() => setTab('genImage')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all ${
              tab === 'genImage' ? 'bg-[#C084FC] text-black shadow-lg shadow-[#C084FC]/20' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Type size={12} />
            Text-to-Image
          </button>
        </div>
      </header>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-12 pb-40 scroll-smooth">
        <section className="animate-in fade-in duration-500">
          {tab === 'image3d' ? (
            <div className="space-y-6">
              <div 
                className={`relative aspect-[16/11] border-2 border-dashed rounded-[40px] bg-neutral-950/40 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden active:border-[#D0F870]/40 transition-all duration-300 group ${
                  isImageError ? 'border-rose-500/80 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-shake' : 'border-white/10'
                }`}
              >
                {refImage ? (
                  <div className="relative w-full h-full group flex items-center justify-center bg-black/40">
                    <img src={refImage} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl pointer-events-none" />
                    <img src={refImage} className="relative z-10 max-w-full max-h-full object-contain p-2" />
                    <button onClick={() => setRefImage(null)} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white backdrop-blur-md active:scale-90 z-20"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full px-6">
                    <div className={`p-4 rounded-full transition-all duration-700 ${isImageError ? 'bg-rose-500/10 text-rose-500 scale-110' : 'bg-[#D0F870]/5 text-[#D0F870] group-hover:scale-110'}`}>
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                       <p className={`text-[11px] font-bold transition-colors ${isImageError ? 'text-rose-500' : 'text-white/60'}`}>
                         {isImageError ? t.pleaseUpload : t.imgRequired}
                       </p>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-3 mt-1">
                       <button 
                         onClick={handleCapture}
                         className="h-14 bg-neutral-900 border border-white/5 rounded-2xl text-[11px] font-bold text-white flex items-center justify-center gap-2 active:scale-95 active:bg-neutral-800 transition-all shadow-lg"
                       >
                         <Camera size={18} className="text-[#D0F870]" /> Capture
                       </button>
                       <button 
                         onClick={handleUploadClick}
                         className="h-14 bg-[#D0F870]/10 border border-[#D0F870]/20 rounded-2xl text-[11px] font-bold text-[#D0F870] flex items-center justify-center gap-2 active:scale-95 active:bg-[#D0F870]/20 transition-all shadow-lg"
                       >
                         <Upload size={18} /> Upload
                       </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-4 text-neutral-400 text-[10px] font-bold mb-2 w-full">
                   <span>50s est.</span>
                   <div className="w-[1px] h-3 bg-neutral-800" />
                   <div className="flex items-center gap-1.5">
                      <img src={MESH_CREDIT_ICON} className="w-4 h-4 object-contain shadow-[0_0_8px_rgba(251,146,60,0.4)]" alt="M" />
                      <span className="text-[#D0F870]">25</span>
                   </div>
                </div>
                
                <button 
                  onClick={handleGenerate} 
                  className="w-full h-16 rounded-[32px] bg-gradient-to-r from-[#D0F870] via-[#FBBAC1] to-[#F9A8D4] border-[6px] border-[#1a1a1a] shadow-[0_15px_30px_rgba(0,0,0,0.4)] active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                >
                  <Sparkles size={22} className="text-black" />
                  <span className="font-bold text-lg text-black">{t.generateModel}</span>
                </button>
                
                <button 
                  onClick={() => setTab('genImage')}
                  className="mt-4 text-[11px] font-medium text-neutral-500 hover:text-white transition-colors"
                >
                  {t.noImage}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="relative">
                  <textarea 
                     className={`w-full h-36 bg-neutral-950/40 border rounded-[36px] p-7 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-[#C084FC]/40 transition-all duration-500 ${isPromptError ? 'border-rose-500/80 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-white/5'}`}
                     placeholder="Describe your mythic visual concept..."
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                  />
               </div>
               <div className="flex items-center justify-between bg-neutral-900/30 p-5 rounded-[32px] border border-white/5">
                 <div className="space-y-0.5">
                   <p className="text-[11px] font-bold text-white/70">{t.refImgEdit}</p>
                   <p className="text-[9px] font-medium text-neutral-600 uppercase tracking-widest">{t.optional}</p>
                 </div>
                 <div className="relative group">
                    <button 
                      onClick={handleUploadClick} 
                      className="w-14 h-14 bg-neutral-900 rounded-[20px] flex items-center justify-center border border-white/10 text-neutral-700 overflow-hidden active:scale-90 transition-all shadow-inner relative"
                    >
                      {refImage ? (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          <img src={refImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 scale-125" />
                          <img src={refImage} className="relative z-10 w-full h-full object-contain p-1" />
                          <div className="absolute inset-0 bg-black/10 group-active:bg-black/40 transition-colors" />
                        </div>
                      ) : (
                        <Plus size={24} className="text-[#C084FC]"/>
                      )}
                    </button>
                    {refImage && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setRefImage(null);
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-800 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 z-20 active:scale-75 transition-all shadow-lg"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    )}
                 </div>
               </div>
               <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-4 text-neutral-400 text-[10px] font-bold mb-2">
                    <span>50s est.</span>
                    <div className="w-[1px] h-3 bg-neutral-800" />
                    <div className="flex items-center gap-1.5">
                        <img src={MESH_CREDIT_ICON} className="w-4 h-4 object-contain" alt="M" />
                        <span className="text-[#C084FC]">5</span>
                    </div>
                  </div>
                  <button onClick={handleGenerate} className="w-full h-16 bg-[#C084FC] rounded-[28px] font-bold text-lg text-black active:scale-95 transition-all shadow-[0_20px_40px_rgba(192,132,252,0.15)] flex items-center justify-center gap-3">
                    <Sparkles size={18} className="text-black" /> {t.generateImage}
                  </button>
                  <p className="mt-4 text-[9px] font-medium text-neutral-500">
                    By Nano Banana Pro Model
                  </p>
               </div>
            </div>
          )}
        </section>

        {isLoggedIn && (
          <section ref={tasksSectionRef} className="space-y-5 animate-in slide-in-from-bottom-4 duration-500 pt-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold text-neutral-400 flex items-center gap-2.5">
                <ListChecks size={13} className={themeTextColor} /> {t.recentTasks}
              </h3>
              <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest">{tasks.length} Tasks</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {tasks.map(task => (
                 <div 
                   key={task.id} 
                   onClick={() => handleTaskClick(task)}
                   className={`bg-neutral-900/30 backdrop-blur-md border border-white/5 p-3 rounded-[32px] flex flex-col gap-3 relative group active:scale-[0.96] transition-all cursor-pointer ${task.status === 'completed' ? 'hover:bg-neutral-900/50' : ''}`}
                 >
                    <div className="aspect-square rounded-[24px] overflow-hidden bg-black relative shadow-xl">
                      <img src={task.thumbnail} className={`w-full h-full object-cover transition-all duration-700 ${task.status === 'processing' ? 'opacity-20 blur-sm' : 'opacity-100 group-hover:scale-110'}`} />
                      {task.status === 'processing' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                              <div className={`h-full ${task.type === 'Model' ? 'bg-[#D0F870]' : 'bg-[#C084FC]'} transition-all duration-500`} style={{ width: `${task.progress}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-white tabular-nums">{Math.floor(task.progress)}%</span>
                        </div>
                      )}
                    </div>
                    <div className="px-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                         <span className={`text-[8px] font-bold uppercase tracking-widest ${task.type === 'Model' ? 'text-[#D0F870]' : 'text-[#C084FC]'}`}>{task.type}</span>
                         <span className="text-[9px] font-bold text-white/90 truncate max-w-[65px]">{task.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-medium">
                        {task.status === 'processing' ? (
                          <span className="text-neutral-500 animate-pulse">Processing...</span>
                        ) : (
                          <div className="text-neutral-600 flex items-center gap-1">
                             <Clock size={8} /> {task.createdAt}
                          </div>
                        )}
                        {task.status === 'completed' && <CheckCircle2 size={8} className="text-[#D0F870]" />}
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both 3;
        }
      `}</style>

      {showQueueWarning && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-neutral-900 border border-white/5 p-8 rounded-[40px] flex flex-col items-center gap-6 text-center shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-[320px]">
              <div className="w-16 h-16 bg-rose-500/10 rounded-[24px] flex items-center justify-center text-rose-500">
                 <AlertCircle size={32} />
              </div>
              <div className="space-y-2 px-2">
                 <h3 className="text-lg font-bold text-white">Queue Full</h3>
                 <p className="text-neutral-400 text-[11px] font-medium leading-relaxed">
                   {t.queueLimit}
                 </p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-2">
                <button 
                  onClick={() => {
                    setShowQueueWarning(false);
                    onUpgradeTrigger();
                  }}
                  className="w-full bg-[#D0F870] py-4 rounded-2xl text-[12px] font-bold text-black shadow-lg shadow-[#D0F870]/20 active:scale-95 transition-all"
                >
                  {t.upgrade}
                </button>
                <button 
                  onClick={() => setShowQueueWarning(false)}
                  className="w-full bg-neutral-800 border border-white/5 py-4 rounded-2xl text-[12px] font-bold text-neutral-400 active:scale-95 transition-all"
                >
                  {t.dismiss}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Create;
