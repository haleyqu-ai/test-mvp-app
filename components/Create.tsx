
import React, { useState, useEffect } from 'react';
import { Type, Image as ImageIcon, Sparkles, Zap, Camera, ListChecks, CheckCircle2, X, Plus, Upload, Clock } from 'lucide-react';
import { GenerationTask, Model } from '../types';
import { MOCK_MODELS, MESH_CREDIT_ICON } from '../constants';

interface CreateProps {
  isLoggedIn: boolean;
  credits: number;
  setCredits: (c: number) => void;
  onLoginTrigger: () => void;
  onTaskModelClick: (model: Model) => void;
  onTaskImageClick: (url: string, title: string) => void;
  onUpgradeTrigger: () => void;
  initialMode?: 'image3d' | 'genImage';
  initialRefImage?: string | null;
}

const Create: React.FC<CreateProps> = ({ 
  isLoggedIn, 
  credits, 
  setCredits, 
  onLoginTrigger, 
  onTaskModelClick,
  onTaskImageClick,
  onUpgradeTrigger,
  initialMode = 'image3d', 
  initialRefImage 
}) => {
  const [tab, setTab] = useState<'image3d' | 'genImage'>(initialMode as any);
  const [prompt, setPrompt] = useState('');
  const [refImage, setRefImage] = useState<string | null>(initialRefImage || null);
  const [tasks, setTasks] = useState<GenerationTask[]>([
    { id: 't-completed-model', type: 'Model', status: 'completed', progress: 100, thumbnail: 'https://picsum.photos/seed/panda1/200/200', title: 'Ancient Panda', createdAt: '10:45 AM' },
    { id: 't-completed-image', type: 'Image', status: 'completed', progress: 100, thumbnail: 'https://picsum.photos/seed/fantasy_i-done/200/200', title: 'Mythic Citadel', createdAt: '09:30 AM' },
    { id: 't-processing', type: 'Model', status: 'processing', progress: 65, thumbnail: 'https://picsum.photos/seed/panda2/200/200', title: 'Panda Alpha', createdAt: '11:05 AM' },
  ]);

  useEffect(() => {
    if (initialMode) setTab(initialMode as any);
    if (initialRefImage) setRefImage(initialRefImage);
  }, [initialMode, initialRefImage]);

  const handleGenerate = () => {
    if (!isLoggedIn) {
      onLoginTrigger();
      return;
    }
    
    const cost = tab === 'image3d' ? 30 : 5;
    
    if (credits < cost) {
      onUpgradeTrigger();
      return;
    }
    setCredits(credits - cost);
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newTask: GenerationTask = {
      id: Date.now().toString(),
      type: tab === 'image3d' ? 'Model' : 'Image',
      status: 'processing',
      progress: 0,
      thumbnail: refImage || (tab === 'image3d' ? 'https://picsum.photos/seed/panda_new/200/200' : 'https://picsum.photos/seed/new_fantasy/200/200'),
      title: tab === 'image3d' ? 'New Panda Model' : prompt.slice(0, 15) || 'Neural Visual',
      createdAt: timeStr
    };
    setTasks([newTask, ...tasks]);
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

  return (
    <div className="flex flex-col h-full bg-meshy-dark">
      <header className="sticky top-0 bg-black/95 backdrop-blur-xl z-30 px-6 pt-4 pb-4 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-black uppercase tracking-tighter text-white">Gen Engine</h1>
          <button 
            onClick={onUpgradeTrigger}
            className="bg-[#D0F870]/10 border border-[#D0F870]/20 px-3 py-1.5 rounded-full flex items-center gap-2 active:bg-[#D0F870]/20 transition-colors"
          >
             <img src={MESH_CREDIT_ICON} className="w-3 h-3 object-contain" alt="Credits" />
             <span className="text-[10px] font-black text-[#D0F870]">{credits}</span>
          </button>
        </div>
        
        <div className="flex p-1 bg-neutral-900 border border-white/5 rounded-2xl">
          {[
            { id: 'image3d', label: 'Image to 3D', icon: ImageIcon },
            { id: 'genImage', label: 'Generate Image', icon: Type },
          ].map(m => (
            <button 
              key={m.id}
              onClick={() => setTab(m.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                tab === m.id ? 'bg-[#D0F870] text-black shadow-lg shadow-[#D0F870]/20' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <m.icon size={12} />
              {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
        <section className="animate-in fade-in duration-500">
          {tab === 'image3d' ? (
            <div className="space-y-6">
              <div className="relative aspect-[16/11] border-2 border-dashed border-white/10 rounded-[40px] bg-neutral-950/40 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden active:border-[#D0F870]/40 transition-colors group">
                {refImage ? (
                  <div className="relative w-full h-full group">
                    <img src={refImage} className="w-full h-full object-cover" />
                    <button onClick={() => setRefImage(null)} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white backdrop-blur-md active:scale-90"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full px-6">
                    <div className="p-4 bg-[#D0F870]/5 rounded-full text-[#D0F870] group-hover:scale-110 transition-all duration-700">
                      <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Source Required</p>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-3 mt-1">
                       <button className="h-14 bg-neutral-900 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 active:scale-95 active:bg-neutral-800 transition-all shadow-lg">
                         <Camera size={18} className="text-[#D0F870]" /> Capture
                       </button>
                       <button className="h-14 bg-[#D0F870]/10 border border-[#D0F870]/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#D0F870] flex items-center justify-center gap-2 active:scale-95 active:bg-[#D0F870]/20 transition-all shadow-lg">
                         <Upload size={18} /> Upload
                       </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2 w-full">
                   <span>1 min</span>
                   <div className="w-[1px] h-3 bg-neutral-800" />
                   <div className="flex items-center gap-1.5">
                      <img src={MESH_CREDIT_ICON} className="w-4 h-4 object-contain shadow-[0_0_8px_rgba(251,146,60,0.4)]" alt="M" />
                      <span>30</span>
                   </div>
                </div>
                <button onClick={handleGenerate} className="w-full bg-[#D0F870] py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.25em] text-black shadow-[0_15px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Sparkles size={20} className="text-black" /> Generate 3D Model
                </button>
                <button 
                  onClick={() => setTab('genImage')}
                  className="mt-6 text-[9px] font-bold text-neutral-500 uppercase tracking-[0.15em] hover:text-[#D0F870] transition-colors"
                >
                  no image? <span className="underline decoration-[#D0F870]/40 underline-offset-4">click here to generate image first.</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="relative">
                  <textarea 
                     className="w-full h-36 bg-neutral-950/40 border border-white/5 rounded-[36px] p-7 text-xs text-white placeholder:text-neutral-800 outline-none focus:border-[#D0F870]/40 transition-all duration-500"
                     placeholder="Describe your mythic visual concept..."
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                  />
               </div>
               <div className="flex items-center justify-between bg-neutral-900/30 p-5 rounded-[32px] border border-white/5">
                 <div className="space-y-0.5">
                   <p className="text-[9px] font-black uppercase tracking-widest text-white">Neural Bias Image</p>
                   <p className="text-[7px] font-bold text-neutral-600 uppercase">Optional guidance</p>
                 </div>
                 <button onClick={() => setRefImage('https://picsum.photos/seed/panda3/200/200')} className="w-14 h-14 bg-neutral-900 rounded-[20px] flex items-center justify-center border border-white/10 text-neutral-700 overflow-hidden active:scale-90 transition-all shadow-inner">
                    {refImage ? <img src={refImage} className="w-full h-full object-cover" /> : <Plus size={24}/>}
                 </button>
               </div>
               <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span>15 sec</span>
                    <div className="w-[1px] h-3 bg-neutral-800" />
                    <div className="flex items-center gap-1.5">
                        <img src={MESH_CREDIT_ICON} className="w-4 h-4 object-contain" alt="M" />
                        <span>5</span>
                    </div>
                  </div>
                  <button onClick={handleGenerate} className="w-full bg-[#D0F870] py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.25em] text-black active:scale-95 transition-all shadow-[0_20px_40px_rgba(208,248,112,0.15)] flex items-center justify-center gap-3">
                    <Sparkles size={18} className="text-black" /> Generate Image
                  </button>
               </div>
            </div>
          )}
        </section>

        {isLoggedIn && (
          <section className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-2.5">
                <ListChecks size={13} className="text-[#D0F870]" /> Recent Tasks/Generation
              </h3>
              <span className="text-[7px] font-black text-neutral-700 uppercase tracking-[0.2em]">{tasks.length} SYNCED</span>
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
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-[#D0F870]/10 border-t-[#D0F870] rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="px-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                         <span className="text-[6px] font-black text-[#D0F870] uppercase tracking-widest">{task.type}</span>
                         <span className="text-[8px] font-black text-white/90 truncate max-w-[65px] uppercase tracking-tighter">{task.title}</span>
                      </div>
                      {task.status === 'processing' ? (
                         <div className="h-1 w-full bg-neutral-800/50 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D0F870] animate-pulse" style={{width: `${task.progress}%`}} />
                         </div>
                      ) : (
                         <div className="flex items-center justify-between text-[7px] font-black uppercase">
                            <div className="flex items-center gap-1 text-green-500">
                               <CheckCircle2 size={9} /> Sync
                            </div>
                            {task.createdAt && (
                              <div className="text-neutral-600 flex items-center gap-1">
                                 <Clock size={8} /> {task.createdAt}
                              </div>
                            )}
                         </div>
                      )}
                    </div>
                 </div>
               ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Create;
