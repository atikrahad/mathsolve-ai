import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../utils/errors/ApiError';
import { ResponseUtil } from '../utils/response.util';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../utils/validators/auth.validators';
import { logger } from '../config/logger';
import { CookieUtil } from '../utils/cookie.util';

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await AuthService.register(validatedData);

      // Set refresh token as httpOnly cookie
      CookieUtil.setRefreshTokenCookie(res, result.tokens.refreshToken);

      ResponseUtil.created(
        res,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
        'User registered successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await AuthService.login(validatedData);

      // Set refresh token as httpOnly cookie
      CookieUtil.setRefreshTokenCookie(res, result.tokens.refreshToken);

      ResponseUtil.success(
        res,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear refresh token cookie
      CookieUtil.clearRefreshTokenCookie(res);

      ResponseUtil.success(res, undefined, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new ApiError(401, 'Refresh token not provided');
      }

      // Validate input
      const validatedData = refreshTokenSchema.parse({ refreshToken });

      // Refresh tokens
      const tokens = await AuthService.refreshToken(validatedData.refreshToken);

      // Set new refresh token as httpOnly cookie
      CookieUtil.setRefreshTokenCookie(res, tokens.refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validatedData = forgotPasswordSchema.parse(req.body);

      // Request password reset
      await AuthService.forgotPassword(validatedData);

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset email has been sent',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const validatedData = resetPasswordSchema.parse(req.body);

      // Reset password
      await AuthService.resetPassword(validatedData);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password (for authenticated users)
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new ApiError(401, 'Authentication required');
      }

      // Validate input
      const validatedData = changePasswordSchema.parse(req.body);

      // Change password
      await AuthService.changePassword(userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new ApiError(401, 'Authentication required');
      }

      // Get user profile
      const user = await AuthService.getUserById(userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email (placeholder for future implementation)
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;

      if (!token) {
        throw new ApiError(400, 'Verification token required');
      }

      // TODO: Implement email verification logic
      logger.info(`Email verification attempt with token: ${token}`);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
