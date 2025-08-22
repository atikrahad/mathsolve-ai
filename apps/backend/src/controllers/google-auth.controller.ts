import { Request, Response, NextFunction } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';
import { z } from 'zod';

// Validation schemas
const googleTokenSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
});

const googleCodeSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
});

export class GoogleAuthController {
  /**
   * Get Google OAuth URL for authentication
   */
  static async getAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { state } = req.query;
      
      const authUrl = GoogleAuthService.generateAuthUrl(state as string);
      
      res.status(200).json({
        success: true,
        message: 'Google OAuth URL generated successfully',
        data: {
          authUrl
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Google OAuth callback (authorization code)
   */
  static async handleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = googleCodeSchema.parse(req.body);
      
      // Exchange authorization code for ID token
      const idToken = await GoogleAuthService.exchangeCodeForTokens(validatedData.code);
      
      // Authenticate user with the ID token
      const result = await GoogleAuthService.authenticateWithGoogle(idToken);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: result.isNewUser ? 'Account created successfully' : 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          isNewUser: result.isNewUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticate with Google ID token directly (for frontend)
   */
  static async authenticateWithToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = googleTokenSchema.parse(req.body);
      
      // Authenticate user with Google ID token
      const result = await GoogleAuthService.authenticateWithGoogle(validatedData.token);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: result.isNewUser ? 'Account created successfully' : 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          isNewUser: result.isNewUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Link Google account to existing user (when authenticated)
   */
  static async linkAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new ApiError(401, 'Authentication required');
      }

      const validatedData = googleTokenSchema.parse(req.body);
      
      // Verify Google token
      const googleUser = await GoogleAuthService.verifyGoogleToken(validatedData.token);
      
      if (!googleUser.verified_email) {
        throw new ApiError(400, 'Google account email is not verified');
      }

      // TODO: Implement account linking logic
      // This would involve updating the existing user with Google provider info
      // and handling potential conflicts (email already exists, etc.)
      
      logger.info('Google account link attempt', { 
        userId, 
        googleEmail: googleUser.email 
      });

      res.status(200).json({
        success: true,
        message: 'Google account linking not yet implemented',
        data: {
          googleUser: {
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}