export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CampaignLink {
  id: string;
  userId: string;
  landingPageUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content: string | null;
  term: string | null;
  generatedUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLinks: number;
  linksThisMonth: number;
  uniqueCampaigns: number;
}

export interface UtmFormState {
  landingPageUrl: string;
  campaign: string;
  source: string;
  customSource: string;
  medium: string;
  customMedium: string;
  content: string;
  term: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
