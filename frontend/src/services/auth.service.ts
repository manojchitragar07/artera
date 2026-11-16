import { api } from './api';
import { ApiResponse, User } from '../types';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(data: any): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('artera_access_token');
      localStorage.removeItem('artera_refresh_token');
      localStorage.removeItem('artera_user');
    }
  },
};

