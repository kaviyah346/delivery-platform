import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message, title } = toast;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconColor: 'text-emerald-600',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      iconColor: 'text-rose-600',
    },
    info: {
      icon: Info,
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      iconColor: 'text-amber-600',
    },
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${config.bg}`}>
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          {title && <p className="text-xs font-bold uppercase tracking-wider mb-0.5">{title}</p>}
          <p className="text-sm font-medium leading-tight break-words">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-gray-500 hover:text-gray-800 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
