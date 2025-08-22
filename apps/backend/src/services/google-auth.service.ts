import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/database';
import { config } from '../config/constants';
import { JWTUtils } from '../utils/jwt-simple';
import { ApiError } from '../utils/errors/ApiError';
import { logger } from '../config/logger';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  verified_email: boolean;
}

export interface GoogleAuthResult {
  user: {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
    bio?: string;
    rankPoints: number;
    currentRank: string;
    streakCount: number;
    createdAt: string;
    lastActiveAt?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  isNewUser: boolean;
}

export class GoogleAuthService {
  private static client = new OAuth2Client(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );

  /**
   * Verify Google ID token and extract user information
   */
  static async verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiError(400, 'Invalid Google token payload');
      }

      return {
        id: payload.sub,
        email: payload.email || '',
        name: payload.name || '',
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        verified_email: payload.email_verified || false,
      };
    } catch (error) {
      logger.error('Google token verification failed', { error });
      throw new ApiError(401, 'Invalid Google token');
    }
  }

  /**
   * Exchange Google authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string): Promise<string> {
    try {
      const { tokens } = await this.client.getToken(code);
      
      if (!tokens.id_token) {
        throw new ApiError(400, 'No ID token received from Google');
      }

      return tokens.id_token;
    } catch (error) {
      logger.error('Google code exchange failed', { error });
      throw new ApiError(400, 'Failed to exchange Google authorization code');
    }
  }

  /**
   * Authenticate user with Google OAuth
   */
  static async authenticateWithGoogle(googleIdToken: string): Promise<GoogleAuthResult> {
    try {
      // Verify the Google token and get user info
      const googleUser = await this.verifyGoogleToken(googleIdToken);

      if (!googleUser.verified_email) {
        throw new ApiError(400, 'Google account email is not verified');
      }

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: googleUser.email }
      });

      let isNewUser = false;

      if (!user) {
        // Create new user from Google account
        isNewUser = true;
        
        // Generate unique username from email or name
        let username = this.generateUsername(googleUser.email, googleUser.name);
        
        // Ensure username is unique
        username = await this.ensureUniqueUsername(username);

        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            username,
            profileImage: googleUser.picture,
            emailVerified: true, // Google accounts are pre-verified
            provider: 'google',
            providerId: googleUser.id,
            rankPoints: 0,
            currentRank: 'Beginner',
            streakCount: 0,
            lastActiveAt: new Date(),
          }
        });

        logger.info('New user created via Google OAuth', { 
          userId: user.id, 
          email: user.email 
        });
      } else {
        // Update existing user's last active time and Google info if needed
        const updateData: any = {
          lastActiveAt: new Date(),
        };

        // If user doesn't have Google provider info, add it
        if (!user.provider || user.provider !== 'google') {
          updateData.provider = 'google';
          updateData.providerId = googleUser.id;
        }

        // Update profile image if user doesn't have one
        if (!user.profileImage && googleUser.picture) {
          updateData.profileImage = googleUser.picture;
        }

        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });

        logger.info('Existing user authenticated via Google OAuth', { 
          userId: user.id, 
          email: user.email 
        });
      }

      // Generate JWT tokens
      const tokens = JWTUtils.generateTokenPair({
        id: user.id,
        email: user.email,
        username: user.username
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage || undefined,
          bio: user.bio || undefined,
          rankPoints: user.rankPoints,
          currentRank: user.currentRank,
          streakCount: user.streakCount,
          createdAt: user.createdAt.toISOString(),
          lastActiveAt: user.lastActiveAt?.toISOString(),
        },
        tokens,
        isNewUser
      };

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('Google authentication failed', { error });
      throw new ApiError(500, 'Google authentication failed');
    }
  }

  /**
   * Generate username from email or name
   */
  private static generateUsername(email: string, name?: string): string {
    if (name) {
      // Use name, remove spaces and special characters
      return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20) || email.split('@')[0];
    }
    
    // Use email prefix
    return email.split('@')[0].replace(/[^a-z0-9]/g, '').substring(0, 20);
  }

  /**
   * Ensure username is unique by appending numbers if necessary
   */
  private static async ensureUniqueUsername(baseUsername: string): Promise<string> {
    let username = baseUsername;
    let counter = 1;

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  /**
   * Generate Google OAuth URL for frontend
   */
  static generateAuthUrl(state?: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'select_account',
    });
  }
}