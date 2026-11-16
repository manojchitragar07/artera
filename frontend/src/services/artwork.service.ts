import { api } from './api';
import { ApiResponse, Artwork } from '../types';

export const artworkService = {
  async getArtworks(params: any = {}): Promise<ApiResponse<Artwork[]>> {
    const res = await api.get('/artworks', { params });
    return res.data;
  },

  async getArtworkById(idOrSlug: string): Promise<ApiResponse<Artwork>> {
    const res = await api.get(`/artworks/${idOrSlug}`);
    return res.data;
  },

  async getMyArtworks(): Promise<ApiResponse<Artwork[]>> {
    const res = await api.get('/artworks/my');
    return res.data;
  },

  async createArtwork(data: any): Promise<ApiResponse<Artwork>> {
    const res = await api.post('/artworks', data);
    return res.data;
  },

  async updateArtwork(id: string, data: any): Promise<ApiResponse<Artwork>> {
    const res = await api.put(`/artworks/${id}`, data);
    return res.data;
  },

  async deleteArtwork(id: string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/artworks/${id}`);
    return res.data;
  },
};

