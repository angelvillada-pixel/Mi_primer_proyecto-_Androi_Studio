import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
  image?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'success', image, duration = 3000 }: Omit<Toast, 'id'>) => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const newToast: Toast = { id, title, message, type, image, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-neutral-700/60 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200 transition-all"
          >
            {toast.image ? (
              <div className="w-10 h-10 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center">
                <img src={toast.image} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-6 h-6 text-indigo-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight truncate">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-neutral-300 leading-snug line-clamp-1 mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
