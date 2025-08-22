import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Basic test routes first
router.get('/', (req, res) => {
  res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      public: [
        'POST /auth/register - User registration',
        'POST /auth/login - User login', 
        'POST /auth/logout - User logout',
        'POST /auth/refresh - Refresh access token',
        'POST /auth/forgot-password - Request password reset',
        'POST /auth/reset-password - Reset password',
        'GET /auth/verify-email - Verify email address',
        'GET /auth/google/url - Get Google OAuth URL',
        'POST /auth/google/callback - Handle Google OAuth callback',
        'POST /auth/google/token - Authenticate with Google token'
      ],
      protected: [
        'GET /auth/profile - Get current user profile',
        'POST /auth/change-password - Change user password',
        'POST /auth/google/link - Link Google account to existing user'
      ]
    }
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working',
    timestamp: new Date().toISOString()
  });
});

export default router;