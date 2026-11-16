import { Response, NextFunction } from 'express';
import { CollectionService } from '../services/collection.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';
import { Role } from '@prisma/client';

export class CollectionController {
  static async getCollections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const collections = await CollectionService.getCollections({
        visitorProfileId: req.query.myCollections === 'true' ? req.user?.visitorProfileId : undefined,
        artistProfileId: req.query.artistId as string,
        isPublic: req.query.isPublic !== undefined ? req.query.isPublic === 'true' : true,
      });
      return ApiResponse.success(res, collections);
    } catch (error) {
      next(error);
    }
  }

  static async getCollectionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const collection = await CollectionService.getCollectionByIdOrSlug(id);
      return ApiResponse.success(res, collection);
    } catch (error) {
      next(error);
    }
  }

  static async createCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const collection = await CollectionService.createCollection({
        ...req.body,
        visitorProfileId: req.user.visitorProfileId,
        artistProfileId: req.user.artistProfileId,
      });
      return ApiResponse.created(res, collection, 'Collection created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await CollectionService.updateCollection(
        id,
        req.body,
        req.user?.visitorProfileId,
        req.user?.artistProfileId
      );
      return ApiResponse.success(res, updated, 'Collection updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === Role.ADMIN;
      const result = await CollectionService.deleteCollection(
        id,
        req.user?.visitorProfileId,
        req.user?.artistProfileId,
        isAdmin
      );
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async addArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { artworkId } = req.body;
      const result = await CollectionService.addArtwork(id, artworkId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async removeArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const artworkId = String(req.params.artworkId);
      const result = await CollectionService.removeArtwork(id, artworkId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
