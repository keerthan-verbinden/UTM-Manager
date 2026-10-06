import { CampaignLink, DashboardStats, User } from "../types.ts";

const TOKEN_KEY = "utm_manager_token";
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save token to storage", e);
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to clear token from storage", e);
    }
  },
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.error || response.statusText || "An unexpected error occurred";
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ user: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<{ user: User }>("/api/auth/me"),

  // Links
  getLinks: (filters?: {
    search?: string;
    source?: string;
    medium?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.source && filters.source !== "ALL")
      params.append("source", filters.source);
    if (filters?.medium && filters.medium !== "ALL")
      params.append("medium", filters.medium);

    const query = params.toString();
    const endpoint = `/api/links${query ? `?${query}` : ""}`;
    return request<{ links: CampaignLink[] }>(endpoint);
  },

  getStats: () => request<{ stats: DashboardStats }>("/api/links/stats"),

  getLinkById: (id: string) =>
    request<{ link: CampaignLink }>(`/api/links/${id}`),

  createLink: (data: {
    landingPageUrl: string;
    campaign: string;
    source: string;
    medium: string;
    content?: string;
    term?: string;
  }) =>
    request<{ message: string; link: CampaignLink }>("/api/links", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteLink: (id: string) =>
    request<{ message: string }>(`/api/links/${id}`, {
      method: "DELETE",
    }),
};
