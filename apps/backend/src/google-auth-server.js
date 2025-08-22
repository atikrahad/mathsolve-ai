const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

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
  return res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
    features: {
      googleAuth: !!process.env.GOOGLE_CLIENT_ID,
      database: 'mock'
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  return res.json({
    message: 'MathSolve AI Backend API (Google Auth Ready)',
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
  return res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
    googleOAuth: {
      configured: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID ? 
        process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 
        'not-configured',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
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
        message: 'Google OAuth not configured - missing GOOGLE_CLIENT_ID',
        setup: {
          required: [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'GOOGLE_REDIRECT_URI'
          ],
          current: {
            GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI: !!process.env.GOOGLE_REDIRECT_URI
          }
        }
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
    
    return res.json({
      success: true,
      message: 'Google OAuth URL generated successfully',
      data: { 
        authUrl,
        config: {
          clientId: clientId.substring(0, 20) + '...',
          redirectUri,
          scopes: ['email', 'profile']
        }
      }
    });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Google OAuth URL',
      error: NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Google OAuth callback endpoint
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }
    
    console.log('Google OAuth callback received:', { 
      code: code.substring(0, 20) + '...', 
      state 
    });
    
    // For now, return mock response since we haven't set up actual Google OAuth exchange
    // In production, this would exchange the code for tokens and create/authenticate user
    return res.status(200).json({
      success: true,
      message: 'Google OAuth callback processed successfully',
      data: {
        user: {
          id: 'google-user-' + Date.now(),
          username: 'googleuser' + Math.floor(Math.random() * 1000),
          email: 'user@gmail.com',
          profileImage: 'https://lh3.googleusercontent.com/a/mock-profile-image',
          provider: 'google',
          rankPoints: 0,
          currentRank: 'Bronze',
          streakCount: 0,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          isNewUser: true
        },
        accessToken: 'google-access-token-' + Date.now(),
        refreshToken: 'google-refresh-token-' + Date.now()
      },
      note: 'Mock implementation - ready for actual Google OAuth integration'
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google OAuth callback failed',
      error: NODE_ENV === 'development' ? error.message : undefined
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
    console.log('Received Google ID token for verification:', token.substring(0, 30) + '...');
    
    // Simulate different user scenarios
    const isNewUser = Math.random() > 0.5;
    
    return res.status(200).json({
      success: true,
      message: 'Google token authentication successful',
      data: {
        user: {
          id: 'google-token-user-' + Date.now(),
          username: 'googleuser' + Math.floor(Math.random() * 1000),
          email: 'tokenuser@gmail.com',
          profileImage: 'https://lh3.googleusercontent.com/a/token-profile-image',
          provider: 'google',
          rankPoints: isNewUser ? 0 : 250,
          currentRank: isNewUser ? 'Bronze' : 'Gold',
          streakCount: isNewUser ? 0 : 12,
          createdAt: isNewUser ? new Date().toISOString() : new Date(Date.now() - 86400000 * 30).toISOString(),
          lastActiveAt: new Date().toISOString()
        },
        accessToken: 'google-token-access-' + Date.now(),
        isNewUser
      },
      implementation: 'Mock - ready for google-auth-library integration'
    });
  } catch (error) {
    console.error('Google token authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google token authentication failed',
      error: NODE_ENV === 'development' ? error.message : undefined
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
    
    // Mock implementation
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: 'local-user-' + Date.now(),
          username,
          email,
          provider: 'local',
          rankPoints: 0,
          currentRank: 'Bronze',
          streakCount: 0,
          createdAt: new Date().toISOString()
        },
        accessToken: 'local-access-token-' + Date.now()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /health - Health check',
      'GET /api - API information',
      'GET /api/auth - Auth service info',
      'GET /api/auth/google/url - Generate Google OAuth URL',
      'POST /api/auth/google/callback - Handle Google OAuth callback',
      'POST /api/auth/google/token - Verify Google ID token',
      'POST /api/auth/register - Register new user'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
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
  console.log(`🚀 MathSolve AI Backend (Google Auth Ready) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API info: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth info: http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('Google OAuth Configuration Status:');
  console.log(`- GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ NOT CONFIGURED'}`);
  console.log(`- GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ NOT CONFIGURED'}`);
  console.log(`- GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI || '⚠️  Using default'}`);
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('');
    console.log('⚠️  To enable real Google OAuth:');
    console.log('1. Get credentials from Google Cloud Console');
    console.log('2. Add to .env file:');
    console.log('   GOOGLE_CLIENT_ID=your-client-id');
    console.log('   GOOGLE_CLIENT_SECRET=your-client-secret');
    console.log('   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback');
  }
  
  console.log('');
  console.log('🔗 Google OAuth Test Endpoints:');
  console.log(`- Generate URL: GET http://localhost:${PORT}/api/auth/google/url`);
  console.log(`- Handle Callback: POST http://localhost:${PORT}/api/auth/google/callback`);
  console.log(`- Verify Token: POST http://localhost:${PORT}/api/auth/google/token`);
});

module.exports = app;