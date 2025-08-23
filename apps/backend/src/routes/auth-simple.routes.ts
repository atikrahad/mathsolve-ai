import { Router } from 'express';

const router = Router();

// Health check for auth routes
router.get('/', (req, res) => {
  res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
    status: 'active'
  });
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working',
    timestamp: new Date().toISOString()
  });
});

export default router;