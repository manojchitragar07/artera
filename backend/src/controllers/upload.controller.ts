import { Response, NextFunction } from 'express';
import { uploadMedia } from '../config/cloudinary';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';

export class UploadController {
  static async uploadSingle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No image file provided');
      }

      const result = await uploadMedia(req.file);
      return ApiResponse.created(res, result, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadMultiple(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw ApiError.badRequest('No image files provided');
      }

      const uploadPromises = files.map((file) => uploadMedia(file));
      const results = await Promise.all(uploadPromises);

      return ApiResponse.created(res, results, 'Images uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

