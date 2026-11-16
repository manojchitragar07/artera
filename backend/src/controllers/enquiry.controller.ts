import { Response, NextFunction } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';
import { Role } from '@prisma/client';

export class EnquiryController {
  static async createEnquiry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const visitorProfileId = req.user?.visitorProfileId;
      const enquiry = await EnquiryService.createEnquiry(req.body, visitorProfileId);
      return ApiResponse.created(res, enquiry, 'Enquiry submitted to artist successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const enquiries = await EnquiryService.getEnquiries({
        userId: req.user.userId,
        role: req.user.role,
        artistProfileId: req.user.artistProfileId,
        visitorProfileId: req.user.visitorProfileId,
        status: req.query.status as any,
      });
      return ApiResponse.success(res, enquiries);
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const enquiry = await EnquiryService.getEnquiryById(id, req.user.userId, req.user.role);
      return ApiResponse.success(res, enquiry);
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiryStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.artistProfileId && req.user?.role !== Role.ADMIN) {
        throw ApiError.forbidden('Only the artist can reply or update enquiry status');
      }
      const id = String(req.params.id);
      const artistProfileId = req.user.artistProfileId || '';
      const updated = await EnquiryService.updateEnquiryStatus(id, artistProfileId, req.body);
      return ApiResponse.success(res, updated, 'Enquiry updated');
    } catch (error) {
      next(error);
    }
  }
}
