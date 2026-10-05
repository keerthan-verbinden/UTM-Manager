/**
 * UTM Normalization utility
 *
 * Rules:
 * - Convert to lowercase.
 * - Replace spaces with underscores.
 * - Remove unnecessary special characters (keep alphanumeric and underscores).
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

export interface NormalizedUtmOutput {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  generatedUrl: string;
}

export function generateTrackingUrl(input: UtmInput): NormalizedUtmOutput {
  const rawUrl = input.landingPageUrl ? input.landingPageUrl.trim() : '';
  if (!rawUrl) {
    throw new Error('Landing page URL is required');
  }

  // Parse and validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch (err) {
    // If user entered without protocol (e.g. example.com/offer), prepend https://
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      try {
        parsedUrl = new URL(`https://${rawUrl}`);
      } catch {
        throw new Error('Please enter a valid landing page URL (e.g. https://example.com/product)');
      }
    } else {
      throw new Error('Please enter a valid landing page URL (e.g. https://example.com/product)');
    }
  }

  const normSource = normalizeUtmParam(input.source);
  const normMedium = normalizeUtmParam(input.medium);
  const normCampaign = normalizeUtmParam(input.campaign);
  const normContent = normalizeUtmParam(input.content);
  const normTerm = normalizeUtmParam(input.term);

  if (!normSource) {
    throw new Error('Campaign source is required');
  }
  if (!normMedium) {
    throw new Error('Campaign medium is required');
  }
  if (!normCampaign) {
    throw new Error('Campaign name is required');
  }

  // Use URLSearchParams on the parsed URL to safely set or update query parameters
  parsedUrl.searchParams.set('utm_source', normSource);
  parsedUrl.searchParams.set('utm_medium', normMedium);
  parsedUrl.searchParams.set('utm_campaign', normCampaign);

  if (normContent) {
    parsedUrl.searchParams.set('utm_content', normContent);
  } else {
    parsedUrl.searchParams.delete('utm_content');
  }

  if (normTerm) {
    parsedUrl.searchParams.set('utm_term', normTerm);
  } else {
    parsedUrl.searchParams.delete('utm_term');
  }

  return {
    source: normSource,
    medium: normMedium,
    campaign: normCampaign,
    content: normContent || undefined,
    term: normTerm || undefined,
    generatedUrl: parsedUrl.toString(),
  };
}
