export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface DashboardStats {
  totalLinks: number;
  linksThisMonth: number;
  uniqueCampaigns: number;
}
