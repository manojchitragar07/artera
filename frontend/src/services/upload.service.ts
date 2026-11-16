import { api } from './api';
import { ApiResponse } from '../types';

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export const uploadService = {
  async uploadSingle(file: File): Promise<ApiResponse<UploadResult>> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async uploadMultiple(files: File[]): Promise<ApiResponse<UploadResult[]>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

