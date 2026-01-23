
import React, { useState, useMemo } from 'react';
import { ASSETS_MODELS, EXPORTED_FILES, ASSETS_IMAGES, MOCK_MODELS } from '../constants';
import { Model, NavTab, UserTier, GenerationTask } from '../types';
import { Clock, CheckCircle2, Loader2, MoreVertical, FileDown, Box, Image as ImageIcon, Sparkles, Plus, Check, Lock, User, Trash2 } from 'lucide-react';

interface AssetsProps {
  isLoggedIn: boolean;
  onLoginTrigger: () => void;
  onModelClick: (model: Model) => void;
  userTier: UserTier;
  onGenerate3D: (url: string) => void;
  onEditImage: (url: string) => void;
  onImageClick: (url: string, title: string, collection: {url: string; title: string; createdAt: string}[]) => void;
  onNavigateToCreate: (mode?: 'image3d' | 'genImage') => void;
  onOpenFile: (name: string) => void;
  language: 'en' | 'zh';
  tasks: GenerationTask[];
}

const ImageWithPlaceholder: React.FC<{ src: string; alt: string; className?: string; onClick?: () => void }> = ({ src, alt, className, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative bg-neutral-900/60 overflow-hidden ${className}`} onClick={onClick}>
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
          <ImageIcon size={24} className="text-neutral-700" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Assets: React.FC<AssetsProps> = ({ 
  isLoggedIn,
  onLoginTrigger,
  onModelClick, 
  userTier, 
  onGenerate3D, 
  onEditImage, 
  onImageClick, 
  onNavigateToCreate,
  onOpenFile,
  language,
  tasks
}) => {
  const [subTab, setSubTab] = useState<'models' | 'images' | 'exports'>('models');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [files, setFiles] = useState(EXPORTED_FILES);

  const t = {
    en: {
      models: 'Models',
      images: 'Images',
      files: 'Files',
      createModels: 'Create more models',
      createImages: 'Create more images',
      matrix: 'Visual Matrix',
      external: 'Open in External App',
      notLoggedIn: 'Sign in to view all your creation!',
      notLoggedInSub: 'View, Export and Print your assets',
      signIn: 'Sign In',
      delete: 'Delete'
    },
    zh: {
      models: '模型',
      images: '图片',
      files: '文件',
      createModels: '制作更多模型',
      createImages: '制作更多图片',
      matrix: '视觉矩阵',
      external: '在外部应用中打开',
      notLoggedIn: '登录以查看您的所有创作！',
      notLoggedInSub: '查看、导出并打印您的资产',
      signIn: '登录',
      delete: '删除'
    }
  }[language];

  // Map completed tasks to Model interface
  const completedModelTasks = useMemo(() => {
    return tasks
      .filter(t => t.type === 'Model' && t.status === 'completed')
      .map((task): Model => ({
        id: task.id,
        title: task.title,
        thumbnail: task.thumbnail,
        modelUrl: MOCK_MODELS[0].modelUrl,
        author: { name: 'You', avatar: 'https://picsum.photos/seed/user/200/200' },
        stats: { likes: 0, downloads: 0 },
        tags: ['My Models'],
        createdAt: task.createdAt || 'Just now',
        size: '12.4 MB',
        status: 'ready',
        specs: { topology: 'Quads', faces: 85000, vertices: 43000 },
        prompt: 'Generation from reference'
      }));
  }, [tasks]);

  const completedImageTasks = useMemo(() => {
    return tasks
      .filter(t => t.type === 'Image' && t.status === 'completed')
      .map(task => ({
        id: task.id,
        url: task.thumbnail,
        title: task.title,
        createdAt: task.createdAt || 'Just now'
      }));
  }, [tasks]);

  const allModels = useMemo(() => [...completedModelTasks, ...ASSETS_MODELS], [completedModelTasks]);
  const allImages = useMemo(() => [...completedImageTasks, ...ASSETS_IMAGES], [completedImageTasks]);

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(prev => prev.filter(f => f.id !== id));
    setActiveMenuId(null);
  };

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-meshy-dark items-center justify-center px-10 text-center animate-in fade-in duration-500">
        <div className="relative mb-10">
          <div className="absolute -inset-4 bg-[#D0F870]/10 rounded-full blur-2xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 bg-neutral-900/60 rounded-[36px] flex items-center justify-center border border-white/5 shadow-2xl">
             <Box size={42} className="text-neutral-700" />
             <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#D0F870] rounded-full flex items-center justify-center border-[4px] border-black text-black">
                <Lock size={12} strokeWidth={4} />
             </div>
          </div>
        </div>
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">
            {t.notLoggedIn}
          </h2>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
            {t.notLoggedInSub}
          </p>
        </div>
        <button 
          onClick={onLoginTrigger}
          className="w-full bg-[#D0F870] py-5 rounded-[28px] text-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_15px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all"
        >
          {t.signIn}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-meshy-dark relative" onClick={() => setActiveMenuId(null)}>
      <div className="p-4 bg-neutral-950/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="flex p-1 bg-neutral-900 rounded-2xl">
          {[
            { id: 'models', label: t.models, icon: Box },
            { id: 'images', label: t.images, icon: ImageIcon },
            { id: 'exports', label: t.files, icon: FileDown },
          ].map(t_btn => (
            <button 
              key={t_btn.id}
              onClick={() => setSubTab(t_btn.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                subTab === t_btn.id ? 'bg-[#D0F870] text-black shadow-lg' : 'text-neutral-500'
              }`}
            >
              <t_btn.icon size={12} />
              {t_btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        {subTab === 'models' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {allModels.map((model) => (
                <div 
                  key={model.id}
                  className={`group relative bg-neutral-950 rounded-[32px] overflow-hidden border border-white/5 transition-all active:scale-[0.98] flex flex-col shadow-2xl`}
                >
                  <div className="aspect-square relative cursor-pointer" onClick={() => onModelClick(model)}>
                    <ImageWithPlaceholder 
                      src={model.thumbnail} 
                      alt={model.title} 
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(34,197,94,0.4)] border-2 border-black">
                       <Check size={14} strokeWidth={4} className="text-black" />
                    </div>
                  </div>
                  <div className="p-4 bg-black/40">
                    <h3 className="text-[10px] font-black uppercase mb-2 truncate text-white tracking-tight">{model.title}</h3>
                    <div className="flex items-center gap-2 text-neutral-500">
                       <Clock size={11} className="shrink-0" />
                       <span className="text-[9px] font-black uppercase tracking-widest">{model.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-2 pb-4">
              <button 
                onClick={() => onNavigateToCreate('image3d')}
                className="w-full py-5 bg-neutral-900 border border-white/10 rounded-[28px] flex items-center justify-center gap-3 active:scale-[0.97] active:bg-neutral-800 transition-all text-[#D0F870] font-black text-[10px] uppercase tracking-[0.25em] shadow-xl"
              >
                <Plus size={16} />
                {t.createModels}
              </button>
            </div>
          </div>
        )}

        {subTab === 'images' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {allImages.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => onImageClick(img.url, img.title, allImages)}
                  className="bg-neutral-900/60 rounded-[32px] overflow-hidden border border-white/5 group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithPlaceholder 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[10px] font-black uppercase text-white/80 truncate mb-1">{img.title}</h3>
                    <div className="flex items-center gap-2 text-neutral-500 mt-1.5">
                       <Clock size={11} className="shrink-0" />
                       <span className="text-[9px] font-black uppercase tracking-widest">{img.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-2 pb-4">
              <button 
                onClick={() => onNavigateToCreate('genImage')}
                className="w-full py-5 bg-neutral-900 border border-white/10 rounded-[28px] flex items-center justify-center gap-3 active:scale-[0.97] active:bg-neutral-800 transition-all text-[#C084FC] font-black text-[10px] uppercase tracking-[0.25em] shadow-xl"
              >
                <Plus size={16} />
                {t.createImages}
              </button>
            </div>
          </div>
        )}

        {subTab === 'exports' && (
          <div className="flex flex-col gap-3">
            {files.map(file => (
              <div 
                key={file.id} 
                onClick={() => onOpenFile(file.name)}
                className="bg-neutral-900/60 p-4 rounded-3xl border border-white/5 flex items-center justify-between group active:bg-neutral-800 transition-colors relative cursor-pointer"
              >
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#D0F870]/10 rounded-2xl text-[#D0F870]"><FileDown size={20} /></div>
                    <div>
                       <h4 className="text-xs font-black text-white/90 truncate max-w-[150px]">{file.name}</h4>
                       <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tighter">{t.external}</p>
                    </div>
                 </div>
                 <div className="relative">
                    <button 
                      onClick={(e) => handleMenuToggle(file.id, e)}
                      className="p-2 text-neutral-500 hover:text-white transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenuId === file.id && (
                      <div className="absolute right-0 top-10 bg-neutral-800 border border-white/10 rounded-xl py-2 px-1 z-30 shadow-2xl min-w-[100px] animate-in fade-in zoom-in-95 duration-200">
                         <button 
                           onClick={(e) => handleDeleteFile(file.id, e)}
                           className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                         >
                           <Trash2 size={14} /> {t.delete}
                         </button>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
