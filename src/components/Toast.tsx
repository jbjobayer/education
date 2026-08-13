import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none transition-all duration-300 animate-fadeIn">
      <div className={`p-4 rounded-2xl neu-card flex items-center gap-3 border ${
        toastMessage.type === 'error'
          ? 'border-red-400 text-red-900'
          : toastMessage.type === 'info'
          ? 'border-blue-400 text-slate-900'
          : 'border-emerald-500/50 text-emerald-950'
      }`}>
        {toastMessage.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
        )}
        <p className="text-xs sm:text-sm font-extrabold leading-snug">
          {toastMessage.text}
        </p>
      </div>
    </div>
  );
};
