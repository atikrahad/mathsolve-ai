import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import prisma from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS - Allow frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
    features: {
      googleAuth: !!process.env.GOOGLE_CLIENT_ID,
      database: 'prisma'
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'MathSolve AI Backend API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Auth service info endpoint
app.get('/api/auth', (req, res) => {
  res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
    googleOAuth: {
      configured: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID || 'not-configured',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'not-configured'
    },
    endpoints: {
      public: [
        'POST /auth/register - User registration',
        'POST /auth/login - User login',
        'GET /auth/google/url - Get Google OAuth URL',
        'POST /auth/google/callback - Handle Google OAuth callback',
        'POST /auth/google/token - Authenticate with Google token'
      ]
    }
  });
});

// Google OAuth URL endpoint
app.get('/api/auth/google/url', (req, res) => {
  try {
    const { state } = req.query;
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
    
    if (!clientId) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth not configured - missing GOOGLE_CLIENT_ID'
      });
    }
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('email profile')}&` +
      `state=${state || 'default'}&` +
      `access_type=offline&` +
      `prompt=select_account`;
    
    res.json({
      success: true,
      message: 'Google OAuth URL generated successfully',
      data: { 
        authUrl,
        clientId: clientId.substring(0, 20) + '...' // Show partial for debugging
      }
    });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Google OAuth URL',
      error: NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Google OAuth callback endpoint
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }
    
    // For now, return mock response since we haven't set up actual Google OAuth exchange
    // In production, this would exchange the code for tokens and create/authenticate user
    res.status(200).json({
      success: true,
      message: 'Google OAuth callback processed (mock implementation)',
      data: {
        user: {
          id: 'google-user-' + Date.now(),
          username: 'googleuser',
          email: 'user@gmail.com',
          profileImage: 'https://lh3.googleusercontent.com/a/mock-profile-image',
          provider: 'google',
          isNewUser: true
        },
        accessToken: 'mock-google-access-token-' + Date.now()
      },
      note: 'This is a mock implementation. Actual Google OAuth integration requires proper credentials.'
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Google OAuth callback failed',
      error: NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Google token authentication endpoint (for frontend direct integration)
app.post('/api/auth/google/token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }
    
    // Mock Google token verification
    // In production, this would verify the Google ID token and extract user info
    console.log('Received Google ID token for verification:', token.substring(0, 20) + '...');
    
    res.status(200).json({
      success: true,
      message: 'Google token authentication successful (mock implementation)',
      data: {
        user: {
          id: 'google-user-' + Date.now(),
          username: 'googleuser',
          email: 'user@gmail.com',
          profileImage: 'https://lh3.googleusercontent.com/a/mock-profile-image',
          provider: 'google',
          rankPoints: 0,
          currentRank: 'Bronze',
          streakCount: 0,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString()
        },
        accessToken: 'mock-google-access-token-' + Date.now(),
        isNewUser: true
      },
      note: 'This is a mock implementation. Actual Google token verification requires google-auth-library.'
    });
  } catch (error) {
    console.error('Google token authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Google token authentication failed',
      error: NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// Basic registration endpoint (for comparison)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Mock implementation - would normally use Prisma to create user
    res.status(201).json({
      success: true,
      message: 'User registered successfully (mock)',
      data: {
        user: {
          id: 'user-' + Date.now(),
          username,
          email,
          provider: 'local',
          rankPoints: 0,
          currentRank: 'Bronze',
          streakCount: 0,
          createdAt: new Date().toISOString()
        },
        accessToken: 'mock-access-token-' + Date.now()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /health',
      'GET /api',
      'GET /api/auth',
      'GET /api/auth/google/url',
      'POST /api/auth/google/callback',
      'POST /api/auth/google/token',
      'POST /api/auth/register'
    ]
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ZodError') {
    const messages = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    });
  }
  
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: NODE_ENV === 'development' ? {
      name: err.name,
      stack: err.stack
    } : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MathSolve AI Backend (Google Auth Focus) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API info: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth info: http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('Google OAuth Configuration:');
  console.log(`- Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`- Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`- Redirect URI: ${process.env.GOOGLE_REDIRECT_URI || 'Using default'}`);
  console.log('');
  console.log('Google OAuth Endpoints:');
  console.log('- GET /api/auth/google/url - Generate OAuth URL');
  console.log('- POST /api/auth/google/callback - Handle OAuth callback');
  console.log('- POST /api/auth/google/token - Verify Google ID token');
});

export { app };