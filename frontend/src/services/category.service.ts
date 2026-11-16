import { api } from './api';
import { ApiResponse, Category, Medium } from '../types';

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const res = await api.get('/categories');
    return res.data;
  },

  async getMediums(): Promise<ApiResponse<Medium[]>> {
    const res = await api.get('/categories/mediums');
    return res.data;
  },

  async createCategory(data: { name: string; description?: string; coverImage?: string }): Promise<ApiResponse<Category>> {
    const res = await api.post('/categories', data);
    return res.data;
  },

  async createMedium(data: { name: string; description?: string }): Promise<ApiResponse<Medium>> {
    const res = await api.post('/categories/mediums', data);
    return res.data;
  },
};

