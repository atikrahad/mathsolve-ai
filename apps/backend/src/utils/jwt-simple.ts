import jwt from 'jsonwebtoken';
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
    return jwt.sign(
      payload,
      config.JWT_SECRET,
      { 
        expiresIn: '15m',
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users'
      }
    );
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users'
      }
    );
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users'
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
      return jwt.verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'mathsolve-ai',
        audience: 'mathsolve-ai-users'
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
      username: user.username
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      email: user.email,
      tokenVersion: 1 // For token revocation in future
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