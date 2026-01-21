
import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Apple, Chrome, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  language: 'en' | 'zh';
}

type LoginStep = 'initial' | 'email_entry' | 'code_entry';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, language }) => {
  const [step, setStep] = useState<LoginStep>('initial');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const t = {
    en: {
      welcome: 'Welcome to Meshy',
      promo: 'Sign up to get 100 credits for free!',
      google: 'Sign in with Google',
      apple: 'Sign in with Apple',
      email: 'Sign in with Email',
      or: 'or',
      enterEmail: 'Enter your email',
      getCode: 'Get Code',
      verifyCode: 'Verify Code',
      codeSent: 'Code sent to',
      resend: 'Resend Code',
      placeholder: 'neural@meshy.ai'
    },
    zh: {
      welcome: '欢迎来到 Meshy',
      promo: '注册即可免费领取 100 积分！',
      google: '使用 Google 登录',
      apple: '使用 Apple 登录',
      email: '使用邮箱登录',
      or: '或',
      enterEmail: '输入您的邮箱',
      getCode: '获取验证码',
      verifyCode: '验证码',
      codeSent: '验证码已发送至',
      resend: '重新发送',
      placeholder: 'neural@meshy.ai'
    }
  }[language];

  const handleGetCode = () => {
    if (!email) return;
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      setStep('code_entry');
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newCode.every(char => char !== '') && value !== '') {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (fullCode: string) => {
    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  useEffect(() => {
    if (step === 'code_entry') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="absolute inset-0 z-[500] bg-black/80 backdrop-blur-xl flex items-end animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full bg-[#0a0a0a] rounded-t-[48px] p-8 pb-12 animate-slide-up flex flex-col gap-8 border-t border-white/10 relative" onClick={e => e.stopPropagation()}>
        
        {/* Navigation/Close button */}
        <div className="flex justify-between items-center relative z-10">
          {step !== 'initial' ? (
            <button 
              onClick={() => setStep(step === 'code_entry' ? 'email_entry' : 'initial')}
              className="p-2.5 bg-neutral-900 border border-white/10 rounded-full text-neutral-400 active:scale-90 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          ) : <div className="w-10" />}
          
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full" />
          
          <button 
            onClick={onClose}
            className="p-2.5 bg-neutral-900 border border-white/10 rounded-full text-white active:scale-90 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'initial' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.welcome}</h2>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">{t.promo}</p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={onLoginSuccess}
                className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                <Chrome size={18} /> {t.google}
              </button>
              
              <button 
                onClick={onLoginSuccess}
                className="w-full bg-neutral-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                <Apple size={18} /> {t.apple}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{t.or}</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <button 
                onClick={() => setStep('email_entry')}
                className="w-full bg-neutral-900 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                <Mail size={18} /> {t.email}
              </button>
            </div>
          </>
        )}

        {step === 'email_entry' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.enterEmail}</h2>
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">A verification code will be sent</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-16 bg-neutral-900 border border-white/10 rounded-2xl pl-14 pr-6 text-white text-sm font-bold focus:border-[#D0F870]/40 outline-none transition-all"
                />
              </div>

              <button 
                onClick={handleGetCode}
                disabled={!email || isLoading}
                className={`w-full h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                  !email || isLoading ? 'bg-neutral-800 text-neutral-600' : 'bg-[#D0F870] text-black shadow-lg shadow-[#D0F870]/20 active:scale-95'
                }`}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <><ArrowRight size={18} /> {t.getCode}</>}
              </button>
            </div>
          </div>
        )}

        {step === 'code_entry' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.verifyCode}</h2>
              <p className="text-neutral-500 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                {t.codeSent} <span className="text-white lowercase">{email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2.5">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="number"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-16 bg-neutral-900 border border-white/10 rounded-2xl text-center text-xl font-black text-white focus:border-[#D0F870] outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
               {isLoading && (
                 <div className="flex items-center gap-2 text-[#D0F870] animate-pulse">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verifying Protocol</span>
                 </div>
               )}
               <button className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors">
                 {t.resend}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
