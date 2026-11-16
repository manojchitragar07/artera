import { api } from './api';
import { ApiResponse, Collection } from '../types';

export const collectionService = {
  async getCollections(params: any = {}): Promise<ApiResponse<Collection[]>> {
    const res = await api.get('/collections', { params });
    return res.data;
  },

  async getCollectionById(id: string): Promise<ApiResponse<Collection>> {
    const res = await api.get(`/collections/${id}`);
    return res.data;
  },

  async createCollection(data: any): Promise<ApiResponse<Collection>> {
    const res = await api.post('/collections', data);
    return res.data;
  },

  async updateCollection(id: string, data: any): Promise<ApiResponse<Collection>> {
    const res = await api.put(`/collections/${id}`, data);
    return res.data;
  },

  async deleteCollection(id: string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/collections/${id}`);
    return res.data;
  },

  async addArtwork(collectionId: string, artworkId: string): Promise<ApiResponse<any>> {
    const res = await api.post(`/collections/${collectionId}/artworks`, { artworkId });
    return res.data;
  },

  async removeArtwork(collectionId: string, artworkId: string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/collections/${collectionId}/artworks/${artworkId}`);
    return res.data;
  },
};

