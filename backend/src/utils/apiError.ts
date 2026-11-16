export class ApiError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request', errors?: any) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized: Access token missing or invalid') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden: You do not have permission to perform this action') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string = 'Conflict: Resource already exists') {
    return new ApiError(409, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }
}

