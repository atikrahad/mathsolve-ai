import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/errors/ApiError';
import { ValidationError } from '../utils/errors/ValidationError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
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
    user: req.user?.id || 'anonymous'
  });

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(message, 404);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      const message = 'Duplicate field value entered';
      error = new ApiError(message, 400);
    } else if (error.code === 'P2025') {
      // Record not found
      const message = 'Resource not found';
      error = new ApiError(message, 404);
    }
  }

  // Validation errors
  if (error instanceof ValidationError) {
    const message = Object.values(error.errors).join(', ');
    error = new ApiError(message, 400);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(message, 401);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(message, 401);
  }

  // Multer errors
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      const message = 'File too large';
      error = new ApiError(message, 400);
    }
  }

  // Default to 500 server error
  if (!(error instanceof ApiError)) {
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message;
    error = new ApiError(message, 500);
  }

  res.status((error as ApiError).statusCode || 500).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      details: error 
    })
  });
};