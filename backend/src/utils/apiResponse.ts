import { Response } from 'express';
import { ApiResponseData } from '../types';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    pagination?: ApiResponseData['pagination']
  ) {
    const payload: ApiResponseData<T> = {
      success: true,
      message,
      data,
      pagination,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message: string = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    errors?: any
  ) {
    const payload: ApiResponseData = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(payload);
  }
}

