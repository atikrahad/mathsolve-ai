import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';
import prisma from '../config/database';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    let token = req.header('Authorization');
    
    if (!token) {
      throw new ApiError('Access denied. No token provided', 401);
    }
    
    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        // role: true // Add this when roles are implemented
      }
    });
    
    if (!user) {
      throw new ApiError('Invalid token', 401);
    }
    
    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', {
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return next(new ApiError('Invalid token', 401));
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired JWT token', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return next(new ApiError('Token expired', 401));
    }
    
    next(error);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return next();
    }
    
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignore auth errors in optional auth
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Access denied. Authentication required', 401));
    }
    
    // If no roles specified, just check authentication
    if (roles.length === 0) {
      return next();
    }
    
    // Check if user has required role
    // TODO: Implement role system
    // if (!req.user.role || !roles.includes(req.user.role)) {
    //   return next(new ApiError('Access denied. Insufficient permissions', 403));
    // }
    
    next();
  };
};