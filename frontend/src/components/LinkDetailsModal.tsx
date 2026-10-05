import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Calendar, Link, Tag, Layers, FileText } from 'lucide-react';
import { CampaignLink } from '../types.ts';

interface LinkDetailsModalProps {
  link: CampaignLink | null;
  onClose: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const LinkDetailsModal: React.FC<LinkDetailsModalProps> = ({
  link,
  onClose,
  showToast,
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (!link) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.generatedUrl);
      setHasCopied(true);
      showToast('URL copied!', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const formattedDate = new Date(link.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Campaign Link Details
            </span>
            <h3 className="text-lg font-bold text-slate-900">{link.campaign}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Full Tracking URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Tracking URL
            </label>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono break-all leading-relaxed border border-slate-800">
              {link.generatedUrl}
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-medium transition"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>URL copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={link.generatedUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium transition"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Landing Page */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Base Landing Page
            </label>
            <div className="text-sm text-slate-800 break-all font-mono bg-slate-50 p-2.5 rounded border border-slate-100">
              {link.landingPageUrl}
            </div>
          </div>

          {/* UTM Parameters Table */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              UTM Parameters Breakdown
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">
                <span>Parameter</span>
                <span className="col-span-2">Value</span>
              </div>

              <div className="grid grid-cols-3 px-3 py-2 border-b border-slate-100">
                <span className="font-mono text-slate-500">utm_source</span>
                <span className="col-span-2 font-mono font-medium text-slate-900">
                  {link.source}
                </span>
              </div>

              <div className="grid grid-cols-3 px-3 py-2 border-b border-slate-100">
                <span className="font-mono text-slate-500">utm_medium</span>
                <span className="col-span-2 font-mono font-medium text-slate-900">
                  {link.medium}
                </span>
              </div>

              <div className="grid grid-cols-3 px-3 py-2 border-b border-slate-100">
                <span className="font-mono text-slate-500">utm_campaign</span>
                <span className="col-span-2 font-mono font-medium text-slate-900">
                  {link.campaign}
                </span>
              </div>

              <div className="grid grid-cols-3 px-3 py-2 border-b border-slate-100">
                <span className="font-mono text-slate-500">utm_content</span>
                <span className="col-span-2 font-mono text-slate-800">
                  {link.content || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>

              <div className="grid grid-cols-3 px-3 py-2">
                <span className="font-mono text-slate-500">utm_term</span>
                <span className="col-span-2 font-mono text-slate-800">
                  {link.term || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created on {formattedDate}</span>
            </span>
            <span className="font-mono text-[10px]">ID: {link.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
