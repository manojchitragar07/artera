import { api } from './api';
import { ApiResponse, Exhibition } from '../types';

export const exhibitionService = {
  async getExhibitions(params: any = {}): Promise<ApiResponse<Exhibition[]>> {
    const res = await api.get('/exhibitions', { params });
    return res.data;
  },

  async getExhibitionById(idOrSlug: string): Promise<ApiResponse<Exhibition>> {
    const res = await api.get(`/exhibitions/${idOrSlug}`);
    return res.data;
  },

  async createExhibition(data: any): Promise<ApiResponse<Exhibition>> {
    const res = await api.post('/exhibitions', data);
    return res.data;
  },

  async updateExhibition(id: string, data: any): Promise<ApiResponse<Exhibition>> {
    const res = await api.put(`/exhibitions/${id}`, data);
    return res.data;
  },

  async deleteExhibition(id: string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/exhibitions/${id}`);
    return res.data;
  },
};

