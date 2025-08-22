// Environment variables with defaults
const config = {
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
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3002',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3002/auth/google/callback',
};

// Authentication constants
const AUTH_CONSTANTS = {
  JWT_EXPIRE: config.JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRE: config.JWT_REFRESH_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};

// Cookie constants
const COOKIE_CONSTANTS = {
  REFRESH_TOKEN_NAME: 'refreshToken',
  ACCESS_TOKEN_NAME: 'accessToken',
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000, // 15 minutes
  SAME_SITE: 'strict',
  HTTP_ONLY: true,
  SECURE: config.NODE_ENV === 'production',
  PATH: '/',
};

// Server constants
const SERVER_CONSTANTS = {
  DEFAULT_PORT: 3001,
  BODY_LIMIT: '10mb',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  GRACEFUL_SHUTDOWN_TIMEOUT: 30000, // 30 seconds
  COMPRESSION_THRESHOLD: 1024, // 1KB
};

// Rate limiting constants
const RATE_LIMIT_CONSTANTS = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  SKIP_SUCCESSFUL_REQUESTS: false,
  SKIP_FAILED_REQUESTS: false,
};

module.exports = {
  config,
  AUTH_CONSTANTS,
  COOKIE_CONSTANTS,
  SERVER_CONSTANTS,
  RATE_LIMIT_CONSTANTS,
};