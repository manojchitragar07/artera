import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Prisma known errors
  if (err.code === 'P2002') {
    const fields = (err.meta?.target as string[]) || [];
    return ApiResponse.error(
      res,
      `A unique constraint failed on field(s): ${fields.join(', ')}`,
      409
    );
  }

  if (err.code === 'P2025') {
    return ApiResponse.error(res, 'Record not found in database', 404);
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    return ApiResponse.error(res, `File upload error: ${err.message}`, 400);
  }

  // Log unknown/internal errors in development
  console.error('[Unhandled Error]:', err);

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred on the server'
      : err.message || 'Internal Server Error',
    500
  );
}

