import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONSTANTS } from '../config/constants';
import { logger } from '../config/logger';

// Create rate limiter
export const rateLimitConfig = rateLimit({
  windowMs: RATE_LIMIT_CONSTANTS.WINDOW_MS,
  max: RATE_LIMIT_CONSTANTS.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    retryAfter: Math.ceil(RATE_LIMIT_CONSTANTS.WINDOW_MS / 1000 / 60), // minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
    });

    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later',
      retryAfter: Math.ceil(RATE_LIMIT_CONSTANTS.WINDOW_MS / 1000 / 60),
    });
  },
});

// Stricter rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    retryAfter: 15,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
    });

    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later',
      retryAfter: 15,
    });
  },
});

// Stricter rate limiting for AI endpoints
export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 AI requests per minute
  message: {
    success: false,
    message: 'Too many AI requests, please try again later',
    retryAfter: 1,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to create custom rate limiters
export function createRateLimiter(options: { windowMs: number; max: number; message: string }) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000 / 60), // minutes
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
        limit: options.max,
        window: options.windowMs,
      });

      res.status(429).json({
        success: false,
        message: options.message,
        retryAfter: Math.ceil(options.windowMs / 1000 / 60),
      });
    },
  });
}
