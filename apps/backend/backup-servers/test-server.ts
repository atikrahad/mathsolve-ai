import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'MathSolve AI Backend is running'
  });
});

// Basic API route
app.get('/api', (req, res) => {
  res.json({
    message: 'MathSolve AI Backend API',
    version: '1.0.0',
    status: 'active'
  });
});

// Test auth route without controllers
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }
  
  // Mock response
  return res.status(201).json({
    success: true,
    message: 'User registration test successful',
    data: {
      user: {
        id: 'test-user-id',
        username,
        email,
        profileImage: null,
        bio: null,
        rankPoints: 0,
        currentRank: 'Bronze',
        streakCount: 0,
        createdAt: new Date().toISOString()
      },
      accessToken: 'test-access-token'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MathSolve AI Backend running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔧 Test registration at POST http://localhost:${PORT}/api/auth/register`);
});

export { app };