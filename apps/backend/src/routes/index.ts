import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import problemRoutes from './problem.routes';

const router = Router();

// API version info
router.get('/', (req, res) => {
  res.json({
    message: 'MathSolve AI Backend API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      problems: '/api/problems',
      // solutions: '/api/solutions',
      // ai: '/api/ai',
      // rankings: '/api/rankings',
      // resources: '/api/resources'
    },
  });
});

// Route handlers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/problems', problemRoutes);
// router.use('/solutions', solutionRoutes);
// router.use('/ai', aiRoutes);
// router.use('/rankings', rankingRoutes);
// router.use('/resources', resourceRoutes);

export default router;
