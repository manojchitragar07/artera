import { api } from './api';
import { ApiResponse, Artwork, User } from '../types';

export const adminService = {
  async getDashboard(): Promise<ApiResponse<any>> {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getArtists(params: any = {}): Promise<ApiResponse<User[]>> {
    const res = await api.get('/admin/artists', { params });
    return res.data;
  },

  async approveArtist(id: string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/artists/${id}/approve`);
    return res.data;
  },

  async rejectArtist(id: string, reason: string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/artists/${id}/reject`, { reason });
    return res.data;
  },

  async setAccountStatus(userId: string, status: string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  async getArtworks(params: any = {}): Promise<ApiResponse<Artwork[]>> {
    const res = await api.get('/admin/artworks', { params });
    return res.data;
  },

  async approveArtwork(id: string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/artworks/${id}/approve`);
    return res.data;
  },

  async rejectArtwork(id: string, reason: string): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/artworks/${id}/reject`, { reason });
    return res.data;
  },

  async toggleFeatureArtwork(id: string, isFeatured: boolean): Promise<ApiResponse<any>> {
    const res = await api.patch(`/admin/artworks/${id}/feature`, { isFeatured });
    return res.data;
  },

  async getAuditLogs(params: any = {}): Promise<ApiResponse<any[]>> {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },

  async getReports(): Promise<ApiResponse<any>> {
    const res = await api.get('/admin/reports');
    return res.data;
  },
};

