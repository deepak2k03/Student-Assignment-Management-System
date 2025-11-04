import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for fade out
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 min-w-[300px] max-w-md ${styles[type]}`}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="text-current opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast, index) => (
        <div key={toast.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
}
