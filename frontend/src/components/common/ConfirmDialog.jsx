import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to perform this action? This operation cannot be undone.',
  confirmText = 'Delete Order',
  confirmLoading = false,
  danger = true,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${danger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-ups-text-muted leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-ups-gray-border">
        <button
          type="button"
          onClick={onClose}
          disabled={confirmLoading}
          className="px-4 py-2 rounded-lg border border-ups-gray-border text-sm font-medium text-ups-text-dark hover:bg-ups-gray-bg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmLoading}
          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 ${
            danger
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-ups-brown hover:bg-ups-brown-light'
          }`}
        >
          {confirmLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
