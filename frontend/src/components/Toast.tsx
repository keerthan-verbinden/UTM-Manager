import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types.ts';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100',
    error: 'bg-rose-900/90 border-rose-700/50 text-rose-100',
    info: 'bg-slate-900/95 border-slate-700/50 text-slate-100',
  }[toast.type];

  const icon = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform ease-out duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium backdrop-blur-sm ${bgStyles}`}
      >
        {icon}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
