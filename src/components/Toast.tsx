import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const dotColor = type === 'error' ? 'bg-[#f85149]' : type === 'info' ? 'bg-[#1e88e5]' : 'bg-[#25D366]';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 bg-[#111B21] text-white px-4 py-2.5 rounded-full text-[13px] flex items-center gap-2.5 shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="font-medium">{message}</span>
    </div>
  );
};
