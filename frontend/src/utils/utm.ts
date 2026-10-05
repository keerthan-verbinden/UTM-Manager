/**
 * UTM Normalization utility
 *
 * Rules:
 * - Convert to lowercase.
 * - Replace spaces with underscores.
 * - Remove unnecessary special characters (keep a-z, 0-9, and underscore).
 * - Avoid duplicate underscores.
 * - Trim leading/trailing spaces and leading/trailing underscores.
 * - Do NOT modify original landing page URL unnecessarily.
 */

export function normalizeUtmParam(value: string | undefined | null): string {
  if (!value) return '';
  let normalized = value.trim().toLowerCase();

  // Replace spaces, hyphens, and whitespace sequences with underscores
  normalized = normalized.replace(/[\s\-]+/g, '_');

  // Remove unnecessary special characters (keep lowercase letters, digits, and underscores)
  normalized = normalized.replace(/[^a-z0-9_]/g, '');

  // Avoid duplicate underscores
  normalized = normalized.replace(/_+/g, '_');

  // Trim leading and trailing underscores
  normalized = normalized.replace(/^_+|_+$/g, '');

  return normalized;
}

export interface UtmInput {
  landingPageUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string | null;
  term?: string | null;
}

export interface GeneratedUrlResult {
  url: string;
  isValid: boolean;
  errorMessage?: string;
  normalizedParams: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
  };
}

export function buildTrackingUrl(input: UtmInput): GeneratedUrlResult {
  const normSource = normalizeUtmParam(input.source);
  const normMedium = normalizeUtmParam(input.medium);
  const normCampaign = normalizeUtmParam(input.campaign);
  const normContent = normalizeUtmParam(input.content);
  const normTerm = normalizeUtmParam(input.term);

  const normalizedParams = {
    source: normSource,
    medium: normMedium,
    campaign: normCampaign,
    content: normContent,
    term: normTerm,
  };

  const rawUrl = (input.landingPageUrl || '').trim();
  if (!rawUrl) {
    return {
      url: '',
      isValid: false,
      errorMessage: 'Landing page URL is required',
      normalizedParams,
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      try {
        parsedUrl = new URL(`https://${rawUrl}`);
      } catch {
        return {
          url: '',
          isValid: false,
          errorMessage: 'Invalid URL format. Please use a full URL like https://example.com/product',
          normalizedParams,
        };
      }
    } else {
      return {
        url: '',
        isValid: false,
        errorMessage: 'Invalid URL format. Please use a full URL like https://example.com/product',
        normalizedParams,
      };
    }
  }

  if (normSource) parsedUrl.searchParams.set('utm_source', normSource);
  else parsedUrl.searchParams.delete('utm_source');

  if (normMedium) parsedUrl.searchParams.set('utm_medium', normMedium);
  else parsedUrl.searchParams.delete('utm_medium');

  if (normCampaign) parsedUrl.searchParams.set('utm_campaign', normCampaign);
  else parsedUrl.searchParams.delete('utm_campaign');

  if (normContent) parsedUrl.searchParams.set('utm_content', normContent);
  else parsedUrl.searchParams.delete('utm_content');

  if (normTerm) parsedUrl.searchParams.set('utm_term', normTerm);
  else parsedUrl.searchParams.delete('utm_term');

  return {
    url: parsedUrl.toString(),
    isValid: true,
    normalizedParams,
  };
}
