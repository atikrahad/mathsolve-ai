import { Router } from 'express';
// import { authController } from '../controllers/auth.controller';
// import { authRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Placeholder routes - controllers will be implemented in Phase 2
router.get('/', (req, res) => {
  res.json({
    message: 'Auth endpoints',
    availableEndpoints: [
      'POST /register - User registration',
      'POST /login - User login', 
      'POST /logout - User logout',
      'POST /refresh - Refresh token',
      'POST /forgot-password - Request password reset',
      'POST /reset-password - Reset password'
    ]
  });
});

// TODO: Implement in Phase 2
// router.post('/register', authRateLimit, authController.register);
// router.post('/login', authRateLimit, authController.login);
// router.post('/logout', authController.logout);
// router.post('/refresh', authController.refresh);
// router.post('/forgot-password', authRateLimit, authController.forgotPassword);
// router.post('/reset-password', authRateLimit, authController.resetPassword);

export default router;