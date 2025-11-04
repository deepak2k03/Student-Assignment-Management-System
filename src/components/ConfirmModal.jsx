import React, { useEffect } from 'react';

export default function ConfirmModal({ open, title = 'Please confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onCancel} 
        aria-hidden="true" 
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-slide-up">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors shadow-sm" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}


