import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/errors/ApiError';
import { ValidationError } from '../utils/errors/ValidationError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: (req as any).user?.userId || 'anonymous',
  });

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      const message = 'Duplicate field value entered';
      error = new ApiError(400, message);
    } else if (error.code === 'P2025') {
      // Record not found
      const message = 'Resource not found';
      error = new ApiError(404, message);
    }
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    const zodError = error as any;
    const messages = zodError.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
    const message = messages.join(', ');
    error = new ApiError(400, message);
  }

  // Validation errors
  if (error instanceof ValidationError) {
    const message = Object.values(error.errors).join(', ');
    error = new ApiError(400, message);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(401, message);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(401, message);
  }

  // Multer errors
  if (error.name === 'MulterError') {
    if ((error as any).code === 'LIMIT_FILE_SIZE') {
      const message = 'File too large';
      error = new ApiError(400, message);
    }
  }

  // Default to 500 server error
  if (!(error instanceof ApiError)) {
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;
    error = new ApiError(500, message);
  }

  // Ensure we always send JSON response
  res.status((error as ApiError).statusCode || 500).json({
    success: false,
    message: error.message,
    error:
      process.env.NODE_ENV === 'development'
        ? {
            name: error.name,
            stack: error.stack,
          }
        : undefined,
  });
};
