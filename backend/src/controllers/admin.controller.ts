import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/apiError';

export class AdminController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboardOverview();
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getArtists(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getArtists({
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 15,
      });
      return ApiResponse.success(res, data.artists, 'Artists retrieved', 200, data.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async approveArtist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const result = await AdminService.approveArtist(id, req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async rejectArtist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const { reason } = req.body;
      const result = await AdminService.rejectArtist(id, reason || 'Application criteria not met', req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async setAccountStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const userId = String(req.params.userId);
      const { status } = req.body;
      const result = await AdminService.setAccountStatus(userId, status, req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getArtworks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getArtworks({
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 15,
      });
      return ApiResponse.success(res, data.artworks, 'Artworks retrieved', 200, data.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async approveArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const result = await AdminService.approveArtwork(id, req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async rejectArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const { reason } = req.body;
      const result = await AdminService.rejectArtwork(id, reason || 'Submission did not meet quality standards', req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async toggleFeatureArtwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = String(req.params.id);
      const { isFeatured } = req.body;
      const result = await AdminService.toggleFeatureArtwork(id, Boolean(isFeatured), req.user.userId);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await AdminService.getAuditLogs(page, limit);
      return ApiResponse.success(res, result.logs, 'Audit logs', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reports = await AdminService.getReports();
      return ApiResponse.success(res, reports);
    } catch (error) {
      next(error);
    }
  }
}
