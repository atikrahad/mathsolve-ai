import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

const router = Router();

// Configure multer for avatar upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  },
});

// Rate limiting for user operations
const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many user requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for avatar upload
const avatarUploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 avatar uploads per hour
  message: {
    success: false,
    message: 'Too many avatar upload attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for follow/unfollow operations
const followRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 follow/unfollow operations per 5 minutes
  message: {
    success: false,
    message: 'Too many follow/unfollow requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
router.get('/search', userRateLimit, UserController.searchUsers);
router.get('/:id', UserController.getUserById);
router.get('/:id/stats', UserController.getUserStats);

// Protected routes (require authentication)
router.get('/profile/me', authenticate, UserController.getProfile);
router.put('/profile/me', authenticate, userRateLimit, UserController.updateProfile);
router.post(
  '/profile/avatar',
  authenticate,
  avatarUploadRateLimit,
  upload.single('avatar'),
  UserController.uploadAvatar
);

// Following system routes
router.post('/:id/follow', authenticate, followRateLimit, UserController.followUser);
router.delete('/:id/follow', authenticate, followRateLimit, UserController.unfollowUser);

// Health check / info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'User service is running',
    version: '1.0.0',
    endpoints: {
      public: [
        'GET /users/search - Search for users',
        'GET /users/:id - Get user public profile',
        'GET /users/:id/stats - Get user statistics',
      ],
      protected: [
        'GET /users/profile/me - Get current user profile',
        'PUT /users/profile/me - Update current user profile',
        'POST /users/profile/avatar - Upload user avatar',
        'POST /users/:id/follow - Follow a user',
        'DELETE /users/:id/follow - Unfollow a user',
      ],
    },
    features: {
      userProfiles: 'Full CRUD operations for user profiles',
      avatarUpload: 'Support for avatar image uploads (JPEG, PNG, WebP, GIF)',
      userSearch: 'Search users by username or email with pagination',
      userStatistics: 'Detailed user statistics and activity data',
      followSystem: 'User following and follower relationships',
      rateLimiting: 'Rate limiting on all endpoints for security',
    },
  });
});

export default router;
