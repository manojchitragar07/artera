import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getCategories();
      return ApiResponse.success(res, categories);
    } catch (error) {
      next(error);
    }
  }

  static async getMediums(req: Request, res: Response, next: NextFunction) {
    try {
      const mediums = await CategoryService.getMediums();
      return ApiResponse.success(res, mediums);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, coverImage } = req.body;
      const category = await CategoryService.createCategory(name, description, coverImage);
      return ApiResponse.created(res, category);
    } catch (error) {
      next(error);
    }
  }

  static async createMedium(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const medium = await CategoryService.createMedium(name, description);
      return ApiResponse.created(res, medium);
    } catch (error) {
      next(error);
    }
  }
}

