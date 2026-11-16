import { Response, NextFunction } from 'express';
import { ArtworkService } from '../services/artwork.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';
import { Role } from '@prisma/client';

export class ArtworkController {
  static async getArtworks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isPrivileged = req.user?.role === Role.ADMIN;
      const result = await ArtworkService.getArtworks({
        ...req.query,
        includePrivate: isPrivileged && req.query.includePrivate === 'true',
      });
      return ApiResponse.success(res, result.artworks, 'Artworks retrieved', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getArtworkById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const visitorProfileId = req.user?.visitorProfileId;
      const ipHash = req.ip || req.socket.remoteAddress;
      const artwork = await ArtworkService.getArtworkById(id, visitorProfileId, ipHash);
      return ApiResponse.success(res, artwork);
    } catch (error) {
      next(error);
    }
  }

  static async createArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.artistProfileId) {
        throw ApiError.forbidden('Artist profile required to create artwork');
      }
      const artwork = await ArtworkService.createArtwork(req.user.artistProfileId, req.body);
      return ApiResponse.created(res, artwork, 'Artwork created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === Role.ADMIN;
      const artistProfileId = req.user?.artistProfileId || null;
      const artwork = await ArtworkService.updateArtwork(id, artistProfileId, isAdmin, req.body);
      return ApiResponse.success(res, artwork, 'Artwork updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === Role.ADMIN;
      const artistProfileId = req.user?.artistProfileId || null;
      const result = await ArtworkService.deleteArtwork(id, artistProfileId, isAdmin);
      return ApiResponse.success(res, result, 'Artwork deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMyArtworks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.artistProfileId) {
        throw ApiError.forbidden('Artist profile required');
      }
      const result = await ArtworkService.getArtworks({
        artistId: req.user.artistProfileId,
        includePrivate: true,
        limit: 100,
      });
      return ApiResponse.success(res, result.artworks, 'My artworks retrieved');
    } catch (error) {
      next(error);
    }
  }
}
