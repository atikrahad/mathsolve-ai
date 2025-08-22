import { Response } from 'express';
import { logger } from '../config/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: ResponseMeta;
  timestamp: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export class ResponseUtil {
  /**
   * Send successful response
   */
  static success<T>(
    res: Response, 
    data: T, 
    message: string = 'Operation successful',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send successful response with pagination
   */
  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: PaginationOptions,
    message: string = 'Data retrieved successfully'
  ): Response {
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);

    const meta: ResponseMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send accepted response
   */
  static accepted<T>(
    res: Response,
    data?: T,
    message: string = 'Request accepted'
  ): Response {
    return this.success(res, data, message, 202);
  }

  /**
   * Send no content response
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    // Include details only in development
    if (process.env.NODE_ENV === 'development' && details) {
      response.data = { details };
    }

    // Log error for debugging
    logger.error(`API Error Response: ${statusCode} - ${message}`, {
      statusCode,
      message,
      details
    });

    return res.status(statusCode).json(response);
  }

  /**
   * Send bad request response
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: any
  ): Response {
    return this.error(res, message, 400, details);
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Access forbidden'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send conflict response
   */
  static conflict(
    res: Response,
    message: string = 'Resource conflict'
  ): Response {
    return this.error(res, message, 409);
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    errors: any[],
    message: string = 'Validation failed'
  ): Response {
    return this.badRequest(res, message, { validationErrors: errors });
  }

  /**
   * Send internal server error response
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
    error?: any
  ): Response {
    return this.error(res, message, 500, error);
  }

  /**
   * Send service unavailable response
   */
  static serviceUnavailable(
    res: Response,
    message: string = 'Service temporarily unavailable'
  ): Response {
    return this.error(res, message, 503);
  }

  /**
   * Send too many requests response
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests'
  ): Response {
    return this.error(res, message, 429);
  }
}

// Export commonly used response methods as standalone functions
export const {
  success,
  successWithPagination,
  created,
  accepted,
  noContent,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  validationError,
  internalError,
  serviceUnavailable,
  tooManyRequests
} = ResponseUtil;