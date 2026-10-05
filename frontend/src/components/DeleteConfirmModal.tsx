import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { CampaignLink } from '../types.ts';

interface DeleteConfirmModalProps {
  link: CampaignLink | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  link,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Campaign Link</h3>
            <p className="text-sm text-slate-500 mt-1">
              Are you sure you want to delete the tracking link for{' '}
              <strong className="text-slate-700">{link.campaign}</strong>? This action cannot be
              undone.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 break-all border border-slate-200/60">
          {link.generatedUrl}
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
