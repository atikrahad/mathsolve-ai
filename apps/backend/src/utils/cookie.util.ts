import { Response } from 'express';
import { COOKIE_CONSTANTS } from '../config/constants';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
}

export class CookieUtil {
  // Default cookie configuration
  private static readonly DEFAULT_OPTIONS: CookieOptions = {
    httpOnly: COOKIE_CONSTANTS.HTTP_ONLY,
    secure: COOKIE_CONSTANTS.SECURE,
    sameSite: COOKIE_CONSTANTS.SAME_SITE,
    path: COOKIE_CONSTANTS.PATH,
  };

  // Refresh token specific configuration
  private static readonly REFRESH_TOKEN_OPTIONS: CookieOptions = {
    ...this.DEFAULT_OPTIONS,
    maxAge: COOKIE_CONSTANTS.REFRESH_TOKEN_MAX_AGE,
  };

  // Access token specific configuration (if ever needed in cookies)
  private static readonly ACCESS_TOKEN_OPTIONS: CookieOptions = {
    ...this.DEFAULT_OPTIONS,
    maxAge: COOKIE_CONSTANTS.ACCESS_TOKEN_MAX_AGE,
  };

  /**
   * Set refresh token cookie
   */
  static setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, token, this.REFRESH_TOKEN_OPTIONS);
  }

  /**
   * Set access token cookie (if needed)
   */
  static setAccessTokenCookie(res: Response, token: string): void {
    res.cookie(COOKIE_CONSTANTS.ACCESS_TOKEN_NAME, token, this.ACCESS_TOKEN_OPTIONS);
  }

  /**
   * Set custom cookie with default options
   */
  static setCookie(
    res: Response,
    name: string,
    value: string,
    options?: Partial<CookieOptions>
  ): void {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    res.cookie(name, value, finalOptions);
  }

  /**
   * Clear refresh token cookie
   */
  static clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, this.DEFAULT_OPTIONS);
  }

  /**
   * Clear access token cookie
   */
  static clearAccessTokenCookie(res: Response): void {
    res.clearCookie(COOKIE_CONSTANTS.ACCESS_TOKEN_NAME, this.DEFAULT_OPTIONS);
  }

  /**
   * Clear all auth cookies
   */
  static clearAllAuthCookies(res: Response): void {
    this.clearRefreshTokenCookie(res);
    this.clearAccessTokenCookie(res);
  }

  /**
   * Get cookie configuration for specific type
   */
  static getRefreshTokenOptions(): CookieOptions {
    return { ...this.REFRESH_TOKEN_OPTIONS };
  }

  static getAccessTokenOptions(): CookieOptions {
    return { ...this.ACCESS_TOKEN_OPTIONS };
  }

  static getDefaultOptions(): CookieOptions {
    return { ...this.DEFAULT_OPTIONS };
  }
}

// For backward compatibility and ease of use
export const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  setCookie,
  clearRefreshTokenCookie,
  clearAccessTokenCookie,
  clearAllAuthCookies,
  getRefreshTokenOptions,
  getAccessTokenOptions,
  getDefaultOptions,
} = CookieUtil;
