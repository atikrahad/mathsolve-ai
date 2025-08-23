import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';
import prisma from '../config/database';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
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
    const authHeader = req.header('Authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader);
    
    if (!token) {
      throw new ApiError(401, 'Access denied. No token provided');
    }
    
    // Verify token
    const decoded = JWTUtils.verifyAccessToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        lastActiveAt: true
      }
    });
    
    if (!user) {
      throw new ApiError(401, 'Invalid token - user not found');
    }
    
    // Update last active time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    });
    
    // Add user to request object
    req.user = {
      userId: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
    
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    if (error instanceof ApiError) {
      return next(error);
    }
    
    next(new ApiError(401, 'Authentication failed'));
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader);
    
    if (!token) {
      return next();
    }
    
    const decoded = JWTUtils.verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });
    
    if (user) {
      req.user = {
        userId: user.id,
        username: user.username,
        email: user.email
      };
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
      return next(new ApiError(401, 'Access denied. Authentication required'));
    }
    
    // If no roles specified, just check authentication
    if (roles.length === 0) {
      return next();
    }
    
    // Check if user has required role
    // TODO: Implement role system in future phases
    // if (!req.user.role || !roles.includes(req.user.role)) {
    //   return next(new ApiError(403, 'Access denied. Insufficient permissions'));
    // }
    
    next();
  };
};