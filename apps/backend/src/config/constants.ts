// Environment variables with defaults
export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@mathsolve-ai.com',
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
} as const;

// Authentication constants
export const AUTH_CONSTANTS = {
  JWT_EXPIRE: config.JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRE: config.JWT_REFRESH_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
} as const;

// Rate limiting constants
export const RATE_LIMIT_CONSTANTS = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  SKIP_SUCCESSFUL_REQUESTS: false,
  SKIP_FAILED_REQUESTS: false,
} as const;

// Database constants
export const DB_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_MIN_LENGTH: 3,
} as const;

// Problem constants
export const PROBLEM_CONSTANTS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  SOLUTION_MAX_LENGTH: 10000,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 50,
} as const;

// Gamification constants
export const GAMIFICATION_CONSTANTS = {
  XP_POINTS: {
    LOW_DIFFICULTY: 10,
    MEDIUM_DIFFICULTY: 25,
    HIGH_DIFFICULTY: 50,
    STREAK_BONUS: 5,
    FIRST_SOLVE_BONUS: 10,
    PROBLEM_CREATION: 20,
    QUALITY_BONUS: 15,
  },
  RANK_THRESHOLDS: {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 15000,
    DIAMOND: 30000,
    MASTER: 50000,
  },
  STREAK_REQUIREMENTS: {
    MIN_DAILY_PROBLEMS: 1,
    MAX_HOURS_BETWEEN: 48,
  },
} as const;

// File upload constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
} as const;

// AI Service constants
export const AI_CONSTANTS = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000, // 30 seconds
  MAX_INPUT_LENGTH: 2000,
  MAX_OUTPUT_LENGTH: 5000,
} as const;

// Cache constants
export const CACHE_CONSTANTS = {
  DEFAULT_TTL: 3600, // 1 hour in seconds
  RANKINGS_TTL: 1800, // 30 minutes
  PROBLEMS_TTL: 7200, // 2 hours
  USER_PROFILE_TTL: 3600, // 1 hour
} as const;

// Email constants
export const EMAIL_CONSTANTS = {
  FROM_ADDRESS: process.env.EMAIL_FROM || 'noreply@mathsolve-ai.com',
  SUPPORT_ADDRESS: process.env.SUPPORT_EMAIL || 'support@mathsolve-ai.com',
  VERIFICATION_EXPIRE: 24 * 60 * 60 * 1000, // 24 hours
  RESET_PASSWORD_EXPIRE: 60 * 60 * 1000, // 1 hour
} as const;

// Cookie constants
export const COOKIE_CONSTANTS = {
  REFRESH_TOKEN_NAME: 'refreshToken',
  ACCESS_TOKEN_NAME: 'accessToken',
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000, // 15 minutes
  SAME_SITE: 'strict' as const,
  HTTP_ONLY: true,
  SECURE: config.NODE_ENV === 'production',
  PATH: '/',
} as const;

// Server constants
export const SERVER_CONSTANTS = {
  DEFAULT_PORT: 3001,
  BODY_LIMIT: '10mb',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  GRACEFUL_SHUTDOWN_TIMEOUT: 30000, // 30 seconds
  COMPRESSION_THRESHOLD: 1024, // 1KB
} as const;