import React, { useState, useMemo } from 'react';
import { Copy, Check, Save, ArrowLeft, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { buildTrackingUrl, normalizeUtmParam } from '../utils/utm.ts';
import { api } from '../services/api.ts';
import { CampaignLink } from '../types.ts';

interface CreateLinkFormProps {
  onSuccess: (savedLink: CampaignLink) => void;
  onCancel: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const COMMON_SOURCES = [
  'Facebook',
  'Instagram',
  'Google',
  'LinkedIn',
  'Email',
  'Twitter',
  'TikTok',
  'YouTube',
  'Other',
];

const COMMON_MEDIUMS = [
  'Paid Social',
  'Organic Social',
  'CPC',
  'Email',
  'Affiliate',
  'Display',
  'Referral',
  'Other',
];

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({
  onSuccess,
  onCancel,
  showToast,
}) => {
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [campaign, setCampaign] = useState('');
  const [sourceSelect, setSourceSelect] = useState('Facebook');
  const [customSource, setCustomSource] = useState('');
  const [mediumSelect, setMediumSelect] = useState('Paid Social');
  const [customMedium, setCustomMedium] = useState('');
  const [content, setContent] = useState('');
  const [term, setTerm] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Compute effective source & medium
  const effectiveSource = sourceSelect === 'Other' ? customSource : sourceSelect;
  const effectiveMedium = mediumSelect === 'Other' ? customMedium : mediumSelect;

  // Real-time tracking URL computation
  const previewResult = useMemo(() => {
    return buildTrackingUrl({
      landingPageUrl,
      source: effectiveSource,
      medium: effectiveMedium,
      campaign,
      content: content || undefined,
      term: term || undefined,
    });
  }, [landingPageUrl, effectiveSource, effectiveMedium, campaign, content, term]);

  // Validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!landingPageUrl.trim()) {
      errors.landingPageUrl = 'Landing page URL is required';
    } else {
      try {
        const u = landingPageUrl.trim();
        if (!u.startsWith('http://') && !u.startsWith('https://')) {
          new URL(`https://${u}`);
        } else {
          new URL(u);
        }
      } catch {
        errors.landingPageUrl = 'Please enter a valid URL (e.g. https://abc.com/offer)';
      }
    }

    if (!campaign.trim()) {
      errors.campaign = 'Campaign name is required';
    }

    if (!effectiveSource.trim()) {
      errors.source = 'Campaign source is required';
    }

    if (!effectiveMedium.trim()) {
      errors.medium = 'Campaign medium is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCopyUrl = async () => {
    if (!previewResult.isValid || !previewResult.url) {
      validateForm();
      showToast('Please fix validation errors before copying URL', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(previewResult.url);
      setHasCopied(true);
      showToast('URL copied!', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = previewResult.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setHasCopied(true);
      showToast('URL copied!', 'success');
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please complete all required fields correctly', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.createLink({
        landingPageUrl: landingPageUrl.trim(),
        campaign: campaign.trim(),
        source: effectiveSource.trim(),
        medium: effectiveMedium.trim(),
        content: content.trim() || undefined,
        term: term.trim() || undefined,
      });

      showToast('Campaign link saved successfully', 'success');
      onSuccess(response.link);
    } catch (err: any) {
      showToast(err.message || 'Failed to save campaign link', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (preset: {
    landingPageUrl: string;
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term?: string;
  }) => {
    setLandingPageUrl(preset.landingPageUrl);
    setCampaign(preset.campaign);
    if (COMMON_SOURCES.includes(preset.source)) {
      setSourceSelect(preset.source);
      setCustomSource('');
    } else {
      setSourceSelect('Other');
      setCustomSource(preset.source);
    }

    if (COMMON_MEDIUMS.includes(preset.medium)) {
      setMediumSelect(preset.medium);
      setCustomMedium('');
    } else {
      setMediumSelect('Other');
      setCustomMedium(preset.medium);
    }

    setContent(preset.content);
    setTerm(preset.term || '');
    setFormErrors({});
    showToast('Example preset loaded', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create UTM Link</h1>
            <p className="text-sm text-slate-500">
              Generate normalized tracking URLs for marketing campaigns.
            </p>
          </div>
        </div>

        {/* Quick Example presets */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-400">Quick Test:</span>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                landingPageUrl: 'https://abc.com/offer',
                source: 'Facebook',
                medium: 'Paid Social',
                campaign: 'Diwali Sale 2026',
                content: 'Video 01',
              })
            }
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
          >
            Example 1 (Facebook)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                landingPageUrl: 'https://abc.com/offer',
                source: 'Google',
                medium: 'CPC',
                campaign: 'Diwali Sale 2026',
                content: 'Search Ad 01',
              })
            }
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
          >
            Example 2 (Google)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4">
            {/* Landing Page URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Landing Page URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={landingPageUrl}
                onChange={(e) => {
                  setLandingPageUrl(e.target.value);
                  if (formErrors.landingPageUrl) {
                    setFormErrors((prev) => ({ ...prev, landingPageUrl: '' }));
                  }
                }}
                placeholder="https://example.com/product"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition ${
                  formErrors.landingPageUrl ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.landingPageUrl && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.landingPageUrl}</p>
              )}
            </div>

            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campaign Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => {
                  setCampaign(e.target.value);
                  if (formErrors.campaign) {
                    setFormErrors((prev) => ({ ...prev, campaign: '' }));
                  }
                }}
                placeholder="e.g. Diwali Sale 2026"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition ${
                  formErrors.campaign ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {formErrors.campaign && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.campaign}</p>
              )}
            </div>

            {/* Source & Medium row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Source */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Source <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sourceSelect}
                  onChange={(e) => setSourceSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
                >
                  {COMMON_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {sourceSelect === 'Other' && (
                  <input
                    type="text"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    placeholder="Enter custom source..."
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
                {formErrors.source && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.source}</p>
                )}
              </div>

              {/* Medium */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Medium <span className="text-rose-500">*</span>
                </label>
                <select
                  value={mediumSelect}
                  onChange={(e) => setMediumSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
                >
                  {COMMON_MEDIUMS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {mediumSelect === 'Other' && (
                  <input
                    type="text"
                    value={customMedium}
                    onChange={(e) => setCustomMedium(e.target.value)}
                    placeholder="Enter custom medium..."
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
                {formErrors.medium && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.medium}</p>
                )}
              </div>
            </div>

            {/* Content & Term row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Content <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Video 01, Image 01"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
                />
              </div>

              {/* Term */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Term <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g. paid search keyword"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Form actions (bottom mobile) */}
            <div className="pt-2 flex items-center justify-end space-x-3 lg:hidden">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Link'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Real-time Preview & Output Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Output Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Generated Tracking URL
                </span>
                <span className="text-[11px] text-slate-400">Live Normalization</span>
              </div>

              {/* URL Preview Box */}
              <div className="my-4">
                {previewResult.isValid && previewResult.url ? (
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono break-all leading-relaxed select-all border border-slate-800">
                    {previewResult.url}
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                    Fill in the required fields to preview your generated campaign URL
                  </div>
                )}
              </div>

              {/* Normalized UTM Values Breakdown */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Normalized Parameters
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">utm_source</span>
                    <span className="font-mono font-medium text-slate-800">
                      {previewResult.normalizedParams.source || '—'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">utm_medium</span>
                    <span className="font-mono font-medium text-slate-800">
                      {previewResult.normalizedParams.medium || '—'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">utm_campaign</span>
                    <span className="font-mono font-medium text-slate-800">
                      {previewResult.normalizedParams.campaign || '—'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">utm_content</span>
                    <span className="font-mono font-medium text-slate-800">
                      {previewResult.normalizedParams.content || '—'}
                    </span>
                  </div>
                </div>

                {previewResult.normalizedParams.term && (
                  <div className="p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                    <span className="text-slate-400 block text-[10px]">utm_term</span>
                    <span className="font-mono font-medium text-slate-800">
                      {previewResult.normalizedParams.term}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons as specified in prompt: Copy URL and Save Link */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  disabled={!previewResult.isValid}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                    hasCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
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

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !previewResult.isValid}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Link'}</span>
                </button>
              </div>

              {previewResult.isValid && previewResult.url && (
                <a
                  href={previewResult.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 transition"
                >
                  <span>Test URL in new tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
