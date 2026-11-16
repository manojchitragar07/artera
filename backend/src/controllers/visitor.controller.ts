import { Response, NextFunction } from 'express';
import { VisitorService } from '../services/visitor.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';

export class VisitorController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Visitor profile required');
      }
      const data = await VisitorService.getDashboard(req.user.visitorProfileId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getFavourites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Visitor profile required');
      }
      const favourites = await VisitorService.getFavourites(req.user.visitorProfileId);
      return ApiResponse.success(res, favourites);
    } catch (error) {
      next(error);
    }
  }

  static async toggleFavourite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Visitor profile required to save favourites');
      }
      const artworkId = String(req.params.artworkId);
      const result = await VisitorService.toggleFavourite(artworkId, req.user.visitorProfileId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getFollowedArtists(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Visitor profile required');
      }
      const artists = await VisitorService.getFollowedArtists(req.user.visitorProfileId);
      return ApiResponse.success(res, artists);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.visitorProfileId) {
        throw ApiError.forbidden('Visitor profile required');
      }
      const updated = await VisitorService.updateProfile(req.user.visitorProfileId, req.body);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
