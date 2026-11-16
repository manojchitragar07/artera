import { api } from './api';
import { ApiResponse, ArtistProfile } from '../types';

export const artistService = {
  async getArtists(params: any = {}): Promise<ApiResponse<ArtistProfile[]>> {
    const res = await api.get('/artists', { params });
    return res.data;
  },

  async getArtistById(idOrSlug: string): Promise<ApiResponse<ArtistProfile & { isFollowing?: boolean }>> {
    const res = await api.get(`/artists/${idOrSlug}`);
    return res.data;
  },

  async updateProfile(data: any): Promise<ApiResponse<ArtistProfile>> {
    const res = await api.put('/artists/profile', data);
    return res.data;
  },

  async getDashboard(): Promise<ApiResponse<any>> {
    const res = await api.get('/artists/dashboard');
    return res.data;
  },

  async toggleFollow(id: string): Promise<ApiResponse<{ following: boolean; message: string }>> {
    const res = await api.post(`/artists/${id}/follow`);
    return res.data;
  },
};

