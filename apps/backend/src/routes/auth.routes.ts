import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { GoogleAuthController } from '../controllers/google-auth.controller';
import { authenticate } from '../middleware/auth.middleware';
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

// Public routes
router.post('/register',  AuthController.register);
router.post('/login', authRateLimit, AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', generalRateLimit, AuthController.refresh);
router.post('/forgot-password', authRateLimit, AuthController.forgotPassword);
router.post('/reset-password', authRateLimit, AuthController.resetPassword);
router.get('/verify-email', AuthController.verifyEmail);

// Google OAuth routes
router.get('/google/url', GoogleAuthController.getAuthUrl);
router.post('/google/callback', authRateLimit, GoogleAuthController.handleCallback);
router.post('/google/token', authRateLimit, GoogleAuthController.authenticateWithToken);

// Protected routes (require authentication)
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/change-password', authenticate, AuthController.changePassword);
router.post('/google/link', authenticate, GoogleAuthController.linkAccount);

// Health check / info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
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

export default router;