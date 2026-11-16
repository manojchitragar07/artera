import { api } from './api';
import { ApiResponse, Artwork, ArtistProfile } from '../types';

export const visitorService = {
  async getDashboard(): Promise<ApiResponse<any>> {
    const res = await api.get('/visitors/dashboard');
    return res.data;
  },

  async getFavourites(): Promise<ApiResponse<Artwork[]>> {
    const res = await api.get('/visitors/favourites');
    return res.data;
  },

  async toggleFavourite(artworkId: string): Promise<ApiResponse<{ isFavourited: boolean; message: string }>> {
    const res = await api.post(`/visitors/favourites/${artworkId}`);
    return res.data;
  },

  async getFollowedArtists(): Promise<ApiResponse<ArtistProfile[]>> {
    const res = await api.get('/visitors/following');
    return res.data;
  },

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    const res = await api.put('/visitors/profile', data);
    return res.data;
  },
};

