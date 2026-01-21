
import React from 'react';
import { X, Mail, Apple, Chrome } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  return (
    <div className="absolute inset-0 z-[500] bg-black/80 backdrop-blur-xl flex items-end animate-in fade-in duration-300" onClick={onClose}>
      <div className="w-full bg-[#0a0a0a] rounded-t-[48px] p-8 pb-12 animate-slide-up flex flex-col gap-8 border-t border-white/10 relative" onClick={e => e.stopPropagation()}>
        {/* Close button in top right */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 bg-neutral-800/50 rounded-full text-white active:scale-90 transition-transform border border-white/5"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto" />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Welcome to Meshy</h2>
          <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Sign up to get 100 credits for free!</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onLoginSuccess}
            className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            <Chrome size={18} /> Sign in with Google
          </button>
          
          <button 
            onClick={onLoginSuccess}
            className="w-full bg-neutral-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            <Apple size={18} /> Sign in with Apple
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">or</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button 
            onClick={onLoginSuccess}
            className="w-full bg-neutral-900 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            <Mail size={18} /> Email Magic Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
