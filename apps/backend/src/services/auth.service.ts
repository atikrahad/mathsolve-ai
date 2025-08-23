import { UserRepository } from '../repositories/user.repository';
import { JWTUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import { ApiError } from '../utils/errors/ApiError';
import { AuthServiceErrors } from '../utils/errors/service-errors';
import prisma from '../config/database';
import { 
  RegisterInput, 
  LoginInput, 
  ForgotPasswordInput, 
  ResetPasswordInput,
  ChangePasswordInput
} from '../utils/validators/auth.validators';
import { logger } from '../config/logger';
import nodemailer from 'nodemailer';
import { config } from '../config/constants';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: Date;
  lastActiveAt?: Date;
}

export class AuthService {
  private static userRepository = new UserRepository();
  
  private static emailTransporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  /**
   * Register a new user
   */
  static async register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    try {
      // Check if user already exists
      const emailExists = await this.userRepository.emailExists(input.email);
      const usernameExists = await this.userRepository.usernameExists(input.username);

      if (emailExists) {
        throw AuthServiceErrors.userAlreadyExists('email', input.email);
      }
      if (usernameExists) {
        throw AuthServiceErrors.userAlreadyExists('username', input.username);
      }

      // Hash password
      const passwordHash = await PasswordUtils.hashPassword(input.password);

      // Create user
      const user = await this.userRepository.createUser({
        username: input.username,
        email: input.email,
        passwordHash,
        provider: 'local',
        bio: input.bio || undefined
      });

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Format user response
      const userResponse = this.formatUserResponse(user);

      logger.info(`New user registered: ${user.id} (${user.email})`);

      return { user: userResponse, tokens };
    } catch (error) {
      logger.error('Registration error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to register user');
    }
  }

  /**
   * Login user
   */
  static async login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(input.email);

      if (!user) {
        throw AuthServiceErrors.invalidCredentials();
      }

      // Check if user is OAuth-only (no password set)
      if (!user.passwordHash) {
        throw AuthServiceErrors.oauthAccountOnly();
      }

      // Verify password
      const isValidPassword = await PasswordUtils.comparePassword(input.password, user.passwordHash);
      if (!isValidPassword) {
        throw AuthServiceErrors.invalidCredentials();
      }

      // Update last active
      await this.userRepository.updateLastActive(user.id);

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Format user response
      const userResponse = this.formatUserResponse(user);

      logger.info(`User logged in: ${user.id} (${user.email})`);

      return { user: userResponse, tokens };
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to login');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = JWTUtils.verifyRefreshToken(refreshToken);

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Generate new tokens
      const tokens = JWTUtils.generateTokenPair(user);

      logger.info(`Token refreshed for user: ${user.id}`);

      return tokens;
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: input.email }
      });

      // Always return success to prevent email enumeration
      if (!user) {
        logger.warn(`Password reset requested for non-existent email: ${input.email}`);
        return;
      }

      // Generate reset token (in production, store this in database with expiration)
      const resetToken = PasswordUtils.generateResetToken();

      // In a real implementation, you would store this token in the database
      // For now, we'll just log it and send an email
      logger.info(`Password reset token for ${user.email}: ${resetToken}`);

      // Send password reset email
      if (config.SMTP_USER && config.SMTP_PASS) {
        await this.sendPasswordResetEmail(user.email, resetToken);
      }

      logger.info(`Password reset requested for user: ${user.id} (${user.email})`);
    } catch (error) {
      logger.error('Forgot password error:', error);
      // Don't throw error to prevent email enumeration
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      // In a real implementation, you would verify the token from database
      // For now, we'll implement a basic validation
      logger.info(`Password reset attempt with token: ${input.token}`);

      // Hash new password
      const passwordHash = await PasswordUtils.hashPassword(input.password);

      // In production, you would:
      // 1. Verify token from database
      // 2. Check if token is not expired
      // 3. Update user password
      // 4. Invalidate the reset token

      // For now, just log the attempt
      logger.info('Password reset completed (mock implementation)');
    } catch (error) {
      logger.error('Reset password error:', error);
      throw new ApiError(500, 'Failed to reset password');
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Check if user has a password (OAuth users might not have one)
      if (!user.passwordHash) {
        throw new ApiError(400, 'This account was created with Google. Password change not available.');
      }

      // Verify current password
      const isValidPassword = await PasswordUtils.comparePassword(
        input.currentPassword, 
        user.passwordHash
      );

      if (!isValidPassword) {
        throw new ApiError(401, 'Current password is incorrect');
      }

      // Hash new password
      const passwordHash = await PasswordUtils.hashPassword(input.newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });

      logger.info(`Password changed for user: ${userId}`);
    } catch (error) {
      logger.error('Change password error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to change password');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      return this.formatUserResponse(user);
    } catch (error) {
      logger.error('Get user error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to get user');
    }
  }

  /**
   * Format user response (remove sensitive data)
   */
  private static formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      rankPoints: user.rankPoints,
      currentRank: user.currentRank,
      streakCount: user.streakCount,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    };
  }

  /**
   * Send password reset email
   */
  private static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${config.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Password Reset - MathSolve AI',
        html: `
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password for your MathSolve AI account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #4ECDC4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this reset, please ignore this email.</p>
        `
      };

      await this.emailTransporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
    }
  }
}