import { Request, Response, NextFunction } from 'express';
import { ArtistService } from '../services/artist.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';

export class ArtistController {
  static async getArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ArtistService.getArtists(req.query);
      return ApiResponse.success(res, result.artists, 'Artists retrieved', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getArtistById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const visitorProfileId = req.user?.visitorProfileId;
      const artist = await ArtistService.getArtistByIdOrSlug(id, visitorProfileId);
      return ApiResponse.success(res, artist);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.artistProfileId) {
        throw ApiError.forbidden('Artist profile required');
      }
      const updated = await ArtistService.updateProfile(req.user.artistProfileId, req.body);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.artistProfileId) {
        throw ApiError.forbidden('Artist profile required');
      }
      const dashboard = await ArtistService.getDashboardOverview(req.user.artistProfileId);
      return ApiResponse.success(res, dashboard);
    } catch (error) {
      next(error);
    }
  }

  static async toggleFollow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Must be signed in as a collector/visitor to follow artists');
      }
      const id = String(req.params.id);
      const result = await ArtistService.toggleFollow(id, req.user.visitorProfileId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
