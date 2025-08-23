import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from '../config/logger';

export interface SanitizationOptions {
  body?: boolean;
  query?: boolean;
  params?: boolean;
  excludeFields?: string[];
  allowHtml?: boolean;
  logSanitization?: boolean;
}

const DEFAULT_OPTIONS: SanitizationOptions = {
  body: true,
  query: true,
  params: true,
  excludeFields: [],
  allowHtml: false,
  logSanitization: process.env.NODE_ENV === 'development',
};

export class SanitizationMiddleware {
  /**
   * Create sanitization middleware with options
   */
  static create(
    options: SanitizationOptions = {}
  ): (req: Request, res: Response, next: NextFunction) => void {
    const config = { ...DEFAULT_OPTIONS, ...options };

    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const sanitized: any = {};

        // Sanitize request body
        if (config.body && req.body) {
          sanitized.body = this.sanitizeObject(req.body, config);
          if (this.hasChanges(req.body, sanitized.body)) {
            req.body = sanitized.body;
          }
        }

        // Sanitize query parameters
        if (config.query && req.query) {
          sanitized.query = this.sanitizeObject(req.query, config);
          if (this.hasChanges(req.query, sanitized.query)) {
            req.query = sanitized.query;
          }
        }

        // Sanitize route parameters
        if (config.params && req.params) {
          sanitized.params = this.sanitizeObject(req.params, config);
          if (this.hasChanges(req.params, sanitized.params)) {
            req.params = sanitized.params;
          }
        }

        // Log sanitization if enabled
        if (config.logSanitization && Object.keys(sanitized).length > 0) {
          logger.debug('Input sanitized', {
            url: req.url,
            method: req.method,
            sanitized: Object.keys(sanitized),
          });
        }

        next();
      } catch (error) {
        logger.error('Sanitization middleware error:', error);
        next(error);
      }
    };
  }

  /**
   * Sanitize object recursively
   */
  private static sanitizeObject(obj: any, config: SanitizationOptions): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item, config));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};

      for (const [key, value] of Object.entries(obj)) {
        // Skip excluded fields
        if (config.excludeFields?.includes(key)) {
          sanitized[key] = value;
          continue;
        }

        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value, config);
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeObject(value, config);
        } else {
          sanitized[key] = value;
        }
      }

      return sanitized;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj, config);
    }

    return obj;
  }

  /**
   * Sanitize string content
   */
  private static sanitizeString(str: string, config: SanitizationOptions): string {
    if (!str || typeof str !== 'string') {
      return str;
    }

    let sanitized = str;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // HTML sanitization
    if (config.allowHtml) {
      // Allow basic HTML but sanitize dangerous elements
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'title'],
      });
    } else {
      // Strip all HTML tags
      sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
    }

    // Remove common XSS patterns
    sanitized = this.removeXSSPatterns(sanitized);

    return sanitized;
  }

  /**
   * Remove common XSS patterns
   */
  private static removeXSSPatterns(str: string): string {
    const xssPatterns = [
      /javascript:/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi,
      /onmouseover=/gi,
      /onfocus=/gi,
      /onblur=/gi,
      /onchange=/gi,
      /onsubmit=/gi,
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
      /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
      /<link[\s\S]*?>/gi,
      /<meta[\s\S]*?>/gi,
    ];

    let sanitized = str;
    xssPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized;
  }

  /**
   * Check if sanitization changed the object
   */
  private static hasChanges(original: any, sanitized: any): boolean {
    return JSON.stringify(original) !== JSON.stringify(sanitized);
  }

  /**
   * Middleware for general sanitization
   */
  static general() {
    return this.create({
      body: true,
      query: true,
      params: true,
      allowHtml: false,
    });
  }

  /**
   * Middleware for forms that allow some HTML
   */
  static allowBasicHtml() {
    return this.create({
      body: true,
      query: true,
      params: true,
      allowHtml: true,
    });
  }

  /**
   * Middleware for API endpoints that need strict sanitization
   */
  static strict() {
    return this.create({
      body: true,
      query: true,
      params: true,
      allowHtml: false,
      logSanitization: true,
    });
  }

  /**
   * Middleware for authentication endpoints
   */
  static auth() {
    return this.create({
      body: true,
      query: false,
      params: false,
      allowHtml: false,
      excludeFields: ['password', 'token', 'refreshToken'],
      logSanitization: false,
    });
  }
}

// Export commonly used middleware instances
export const sanitizeGeneral = SanitizationMiddleware.general();
export const sanitizeWithHtml = SanitizationMiddleware.allowBasicHtml();
export const sanitizeStrict = SanitizationMiddleware.strict();
export const sanitizeAuth = SanitizationMiddleware.auth();
