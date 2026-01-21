
import React, { useState } from 'react';
import { X, Printer, Download, Smartphone, UploadCloud, Zap, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PrintPageProps {
  onClose: () => void;
  onOpenFile: (name: string) => void;
  language: 'en' | 'zh';
}

const PARTNERS = [
  { 
    name: 'CREALITY CLOUD', 
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/72/c1/58/72c158ad-5cf7-0d5d-5151-b898b27dd693/Placeholder.mill/400x400bb-75.webp'
  },
  { 
    name: 'BAMBU HANDY', 
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c6/3d/49/c63d494d-a5b9-19ad-cfd3-7fe3dc9f407b/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/400x400ia-75.webp'
  },
  { 
    name: 'PRUSA CONNECT', 
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/df/ab/30/dfab3035-e988-551a-9635-3e8d64b51c96/Placeholder.mill/400x400bb-75.webp'
  },
  { 
    name: 'ANYCUBIC CLOUD', 
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e5/fb/cf/e5fbcf5c-1b2e-a6cb-c86b-a127f30756a7/AppIcon-0-0-1x_U007emarketing-0-6-0-85-220.png/400x400ia-75.webp'
  },
  { 
    name: 'ELEGOO APP', 
    icon: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/40/0e/39/400e3979-3535-dd1e-7957-56fb029855f6/Placeholder.mill/400x400bb-75.webp'
  },
];

const PrintPage: React.FC<PrintPageProps> = ({ onClose, onOpenFile, language }) => {
  const [tutorialPartner, setTutorialPartner] = useState<string | null>(null);

  const handlePartnerClick = (name: string) => {
    if (name === 'CREALITY CLOUD') {
      onOpenFile('neural_structure_print.glb');
    } else {
      setTutorialPartner(name);
    }
  };

  const t = {
    en: {
      connect: 'Connect Your Hardware',
      direct: 'Direct Manufacturing',
      info: 'Meshy supports direct integration with top industrial slicing engines. Select your ecosystem to transmit neural data.',
      back: 'Back to partners',
      step1: 'Step 1: Export Model',
      step1Desc: 'First, export your model to a supported format like .STL or .GLB.',
      step2: 'Step 2: Open App',
      step2Desc: 'Manually launch the {partner} application on your device.',
      step3: 'Step 3: Upload File',
      step3Desc: 'Navigate to upload and select the model from your mobile files.',
      step4: 'Step 4: Start Printing',
      step4Desc: 'Configure your slicer settings and begin the neural fabrication!',
      gotit: 'Launch Protocol'
    },
    zh: {
      connect: '连接您的硬件设备',
      direct: '智能制造',
      info: 'Meshy 支持与顶级工业切片引擎直接集成。选择您的生态系统以传输神经模型数据。',
      back: '返回列表',
      step1: '步骤 1: 导出模型',
      step1Desc: '首先，将您的模型导出为 .STL 或 .GLB 等支持的格式。',
      step2: '步骤 2: 打开应用',
      step2Desc: '在您的手机上手动启动 {partner} 应用程序。',
      step3: '步骤 3: 上传文件',
      step3Desc: '点击上传按钮并从手机文件中心选择已导出的模型。',
      step4: '步骤 4: 开始打印',
      step4Desc: '配置切片设置，即刻开启神经网络物理制造！',
      gotit: '准备就绪'
    }
  }[language];

  if (tutorialPartner) {
    const steps = [
      { id: 1, icon: Download, title: t.step1, desc: t.step1Desc },
      { id: 2, icon: Smartphone, title: t.step2.replace('{partner}', tutorialPartner), desc: t.step2Desc.replace('{partner}', tutorialPartner) },
      { id: 3, icon: UploadCloud, title: t.step3, desc: t.step3Desc },
      { id: 4, icon: Zap, title: t.step4, desc: t.step4Desc },
    ];

    return (
      <div className="absolute inset-0 z-[250] bg-black flex flex-col animate-in slide-in-from-right duration-400 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pt-24 pb-24 flex flex-col gap-10">
          <button 
            onClick={() => setTutorialPartner(null)}
            className="flex items-center gap-2 text-[#D0F870] text-[10px] font-black uppercase tracking-widest active:opacity-60 transition-all"
          >
            <ChevronLeft size={16} /> {t.back}
          </button>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {tutorialPartner} <span className="text-[#D0F870]">Guide</span>
            </h2>
            <div className="h-1 w-12 bg-[#D0F870] rounded-full" />
          </div>

          <div className="flex flex-col gap-8 relative">
            {/* Connection Line */}
            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-neutral-900 z-0" />
            
            {steps.map((step) => (
              <div key={step.id} className="flex gap-6 relative z-10 group">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-[#D0F870] group-hover:bg-[#D0F870] group-hover:text-black transition-all duration-300 shadow-xl">
                  <step.icon size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-white leading-none">
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setTutorialPartner(null)}
            className="mt-6 w-full py-5 bg-[#D0F870] rounded-[24px] text-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_15px_30px_rgba(208,248,112,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle2 size={18} /> {t.gotit}
          </button>
        </div>

        <div className="absolute top-6 right-8 z-50">
          <button onClick={onClose} className="p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full text-white active:scale-90 transition-all shadow-xl">
            <X size={20} />
          </button>
        </div>
        <div className="h-10 w-full bg-black/50 backdrop-blur-sm pointer-events-none sticky bottom-0 z-50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[250] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-8 pt-20 pb-24 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em]">{t.connect}</p>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{t.direct}</h1>
        </div>

        {/* Partners List */}
        <div className="flex flex-col gap-4">
          {PARTNERS.map((partner) => (
            <button 
              key={partner.name} 
              onClick={() => handlePartnerClick(partner.name)}
              className="flex items-center justify-between bg-neutral-900/60 border border-white/5 p-5 rounded-[32px] active:scale-[0.98] transition-all group shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 shrink-0">
                   <img src={partner.icon} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" alt={partner.name} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">{partner.name}</span>
              </div>
              <div className="p-2.5 rounded-full text-neutral-600 group-hover:text-white group-hover:bg-white/5 transition-all">
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-4 p-7 bg-neutral-900/20 border border-white/5 rounded-[40px]">
          <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em] leading-relaxed text-center italic">
            {t.info}
          </p>
        </div>
      </div>

      {/* Static Navigation Controls */}
      <div className="absolute top-6 left-0 right-0 flex justify-end px-8 z-50">
        <button onClick={onClose} className="p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full text-white active:scale-90 transition-all shadow-xl">
          <X size={20} />
        </button>
      </div>
      
      {/* Home Indicator Bottom Mask */}
      <div className="h-10 w-full bg-black/50 backdrop-blur-sm pointer-events-none sticky bottom-0 z-50" />
    </div>
  );
};

export default PrintPage;
