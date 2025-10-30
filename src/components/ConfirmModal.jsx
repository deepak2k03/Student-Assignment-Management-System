import React from 'react';

export default function ConfirmModal({ open, title = 'Please confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
        <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-6 flex gap-3 justify-end">
            <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={onCancel}>{cancelText}</button>
            <button className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    );
}


