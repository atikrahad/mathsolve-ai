import * as jwt from 'jsonwebtoken';
import { config } from '../config/constants';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export interface RefreshTokenPayload {
  userId: string;
  email: string;
  tokenVersion: number;
}

export class JWTUtils {
  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    if (!config.JWT_EXPIRES_IN) {
      throw new Error('JWT_EXPIRES_IN is not configured');
    }

    const options = {
      expiresIn: config.JWT_EXPIRES_IN,
      issuer: 'mathsolve-ai',
      audience: 'mathsolve-ai-users',
    };

    return jwt.sign(payload, config.JWT_SECRET, options as any);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: RefreshTokenPayload): string {
    if (!config.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    if (!config.JWT_REFRESH_EXPIRES_IN) {
      throw new Error('JWT_REFRESH_EXPIRES_IN is not configured');
    }

    const options = {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
      issuer: 'mathsolve-ai',
      audience: 'mathsolve-ai-users',
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET, options as any);
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      if (!config.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }

      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users',
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      if (!config.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
      }

      return jwt.verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users',
      }) as RefreshTokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(user: { id: string; email: string; username: string }) {
    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      email: user.email,
      tokenVersion: 1, // For token revocation in future
    });

    return { accessToken, refreshToken };
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
