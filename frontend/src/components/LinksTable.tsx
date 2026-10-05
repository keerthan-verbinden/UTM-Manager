import React, { useState } from 'react';
import {
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  Trash2,
  PlusCircle,
  Link2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { CampaignLink } from '../types.ts';

interface LinksTableProps {
  links: CampaignLink[];
  isLoading: boolean;
  searchQuery: string;
  sourceFilter: string;
  mediumFilter: string;
  onSearchChange: (val: string) => void;
  onSourceFilterChange: (val: string) => void;
  onMediumFilterChange: (val: string) => void;
  onCreateLinkClick: () => void;
  onViewLink: (link: CampaignLink) => void;
  onDeleteLink: (link: CampaignLink) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const COMMON_SOURCE_OPTIONS = [
  { label: 'All Sources', value: 'ALL' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Google', value: 'google' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Email', value: 'email' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Twitter', value: 'twitter' },
];

const COMMON_MEDIUM_OPTIONS = [
  { label: 'All Mediums', value: 'ALL' },
  { label: 'Paid Social', value: 'paid_social' },
  { label: 'CPC', value: 'cpc' },
  { label: 'Organic Social', value: 'organic_social' },
  { label: 'Email', value: 'email' },
  { label: 'Affiliate', value: 'affiliate' },
  { label: 'Display', value: 'display' },
  { label: 'Referral', value: 'referral' },
];

export const LinksTable: React.FC<LinksTableProps> = ({
  links,
  isLoading,
  searchQuery,
  sourceFilter,
  mediumFilter,
  onSearchChange,
  onSourceFilterChange,
  onMediumFilterChange,
  onCreateLinkClick,
  onViewLink,
  onDeleteLink,
  showToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (link: CampaignLink) => {
    try {
      await navigator.clipboard.writeText(link.generatedUrl);
      setCopiedId(link.id);
      showToast('URL copied!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = link.generatedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(link.id);
      showToast('URL copied!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title and stats count */}
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Campaign Links</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </div>

        {/* Search, Filters, and Create Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search campaigns, sources..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
            />
          </div>

          {/* Filter by Source */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium appearance-none cursor-pointer"
            >
              {COMMON_SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter by Medium */}
          <div className="relative">
            <select
              value={mediumFilter}
              onChange={(e) => onMediumFilterChange(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium appearance-none cursor-pointer"
            >
              {COMMON_MEDIUM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* + Create UTM Link button */}
          <button
            type="button"
            onClick={onCreateLinkClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Create UTM Link</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs text-slate-500">Loading campaign links...</p>
        </div>
      ) : links.length === 0 ? (
        // Prompt specific empty state:
        // No campaign links yet.
        // Create your first tracking link to start organizing your campaigns.
        // [ + Create UTM Link ]
        <div className="py-16 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No campaign links yet.</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Create your first tracking link to start organizing your campaigns.
          </p>
          <button
            type="button"
            onClick={onCreateLinkClick}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create UTM Link</span>
          </button>
        </div>
      ) : (
        /* Table Layout: Campaign | Source | Medium | Content | Created | Actions */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Medium</th>
                <th className="py-3 px-4">Content</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/75 transition-colors group">
                  {/* Campaign */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                      <span>{link.campaign}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-sm">
                      {link.landingPageUrl}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-medium text-[11px] bg-slate-100 text-slate-800">
                      {link.source}
                    </span>
                  </td>

                  {/* Medium */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-medium text-[11px] bg-slate-100 text-slate-800">
                      {link.medium}
                    </span>
                  </td>

                  {/* Content */}
                  <td className="py-3 px-4">
                    {link.content ? (
                      <span className="font-mono text-slate-700 text-[11px]">{link.content}</span>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(link.createdAt)}
                  </td>

                  {/* Actions: View | Copy | Delete */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1">
                      {/* View */}
                      <button
                        onClick={() => onViewLink(link)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition inline-flex items-center space-x-1"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(link)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition inline-flex items-center space-x-1 ${
                          copiedId === link.id
                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                        title="Copy tracking URL"
                      >
                        {copiedId === link.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteLink(link)}
                        className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded text-xs transition"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
