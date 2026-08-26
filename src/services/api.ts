import {
  User,
  MSMEProfile,
  TrustScoreAnalysis,
  AdminStats,
  RecommendationItem,
} from '../types';

const API_BASE = '/api';

export const api = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getCurrentUser(token: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getMSMEs(): Promise<MSMEProfile[]> {
    const res = await fetch(`${API_BASE}/msmes`);
    if (!res.ok) throw new Error('Failed to fetch MSMEs');
    return res.json();
  },

  async getMSMEProfile(id: string): Promise<MSMEProfile> {
    const res = await fetch(`${API_BASE}/msmes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch MSME profile');
    return res.json();
  },

  async uploadData(msmeId: string, dataType: string, csvString: string): Promise<{ message: string; recordCount: number; analysis: TrustScoreAnalysis }> {
    const res = await fetch(`${API_BASE}/data/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msmeId, dataType, csvString }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async getLenderPortfolio(): Promise<{
    totalCount: number;
    lowRiskCount: number;
    moderateRiskCount: number;
    mediumHighRiskCount: number;
    highRiskCount: number;
    msmes: MSMEProfile[];
  }> {
    const res = await fetch(`${API_BASE}/lender/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return res.json();
  },

  async compareMSMEs(ids: string[]): Promise<MSMEProfile[]> {
    const res = await fetch(`${API_BASE}/lender/compare?ids=${ids.join(',')}`);
    if (!res.ok) throw new Error('Failed to compare MSMEs');
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/statistics`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  getReportDownloadUrl(msmeId: string): string {
    return `${API_BASE}/reports/${msmeId}/html`;
  },
};
