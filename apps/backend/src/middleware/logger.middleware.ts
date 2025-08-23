import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log request
  logger.info('Incoming request', {
    method,
    url: originalUrl,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // Determine log level based on status code
    let logLevel: 'info' | 'warn' | 'error' = 'info';
    if (statusCode >= 400 && statusCode < 500) {
      logLevel = 'warn';
    } else if (statusCode >= 500) {
      logLevel = 'error';
    }

    logger[logLevel]('Request completed', {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent,
      contentLength: res.get('Content-Length') || '0',
    });

    // Call original end method with proper typing
    return (originalEnd as any).apply(this, args);
  };

  next();
};
