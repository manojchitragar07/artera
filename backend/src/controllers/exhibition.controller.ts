import { Request, Response, NextFunction } from 'express';
import { ExhibitionService } from '../services/exhibition.service';
import { ApiResponse } from '../utils/apiResponse';

export class ExhibitionController {
  static async getExhibitions(req: Request, res: Response, next: NextFunction) {
    try {
      const exhibitions = await ExhibitionService.getExhibitions({
        status: req.query.status as any,
        featured: req.query.featured ? req.query.featured === 'true' : undefined,
      });
      return ApiResponse.success(res, exhibitions);
    } catch (error) {
      next(error);
    }
  }

  static async getExhibitionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const exhibition = await ExhibitionService.getExhibitionByIdOrSlug(id);
      return ApiResponse.success(res, exhibition);
    } catch (error) {
      next(error);
    }
  }

  static async createExhibition(req: Request, res: Response, next: NextFunction) {
    try {
      const exhibition = await ExhibitionService.createExhibition({
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      });
      return ApiResponse.created(res, exhibition, 'Curated exhibition created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateExhibition(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const exhibition = await ExhibitionService.updateExhibition(id, req.body);
      return ApiResponse.success(res, exhibition, 'Curated exhibition updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteExhibition(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await ExhibitionService.deleteExhibition(id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
