import { User } from '@prisma/client';

// Authentication tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// JWT payload structure
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

// User response (excludes sensitive fields)
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  isEmailVerified: boolean;
  provider?: string;
  createdAt: Date;
  lastActiveAt?: Date;
}

// Authentication result
export interface AuthResult {
  user: UserResponse;
  tokens: AuthTokens;
}

// Google OAuth result
export interface GoogleAuthResult extends AuthResult {
  isNewUser: boolean;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset data
export interface PasswordResetData {
  token: string;
  password: string;
}

// Password change data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Google OAuth data
export interface GoogleOAuthData {
  token: string;
}

// Email verification data
export interface EmailVerificationData {
  token: string;
}

// User profile update data
export interface UserProfileUpdate {
  username?: string;
  bio?: string;
  profileImage?: string;
}

// Authentication provider types
export type AuthProvider = 'local' | 'google' | 'github' | 'facebook';

// User role types
export type UserRole = 'user' | 'moderator' | 'admin';

// User rank types
export type UserRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';

// Session data
export interface SessionData {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Authentication middleware options
export interface AuthMiddlewareOptions {
  required?: boolean;
  roles?: UserRole[];
  skipPaths?: string[];
}