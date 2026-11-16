import { api } from './api';
import { ApiResponse, Enquiry } from '../types';

export const enquiryService = {
  async createEnquiry(data: {
    artistId: string;
    artworkId?: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<Enquiry>> {
    const res = await api.post('/enquiries', data);
    return res.data;
  },

  async getEnquiries(params: any = {}): Promise<ApiResponse<Enquiry[]>> {
    const res = await api.get('/enquiries', { params });
    return res.data;
  },

  async getEnquiryById(id: string): Promise<ApiResponse<Enquiry>> {
    const res = await api.get(`/enquiries/${id}`);
    return res.data;
  },

  async updateStatus(id: string, data: { status?: string; artistResponse?: string }): Promise<ApiResponse<Enquiry>> {
    const res = await api.patch(`/enquiries/${id}/status`, data);
    return res.data;
  },
};

