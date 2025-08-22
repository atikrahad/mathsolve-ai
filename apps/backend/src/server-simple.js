const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { CookieUtil } = require('./utils/cookie.util');
const { config, SERVER_CONSTANTS } = require('./config/constants');
require('dotenv').config();

const app = express();
const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

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
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: SERVER_CONSTANTS.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SERVER_CONSTANTS.BODY_LIMIT }));

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
    message: 'MathSolve AI Backend API (Simple Mode)',
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
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3002/auth/google/callback'
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

// Mock user database with test credentials
const mockUsers = [
  {
    id: 'user-123456',
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPass123!',
    profileImage: null,
    bio: 'I love solving math problems!',
    rankPoints: 1250,
    currentRank: 'Gold',
    streakCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'user-789012',
    username: 'mathgeek',
    email: 'mathgeek@example.com',
    password: 'MathRocks2024!',
    profileImage: 'https://avatar.example.com/mathgeek.jpg',
    bio: 'Mathematics enthusiast and problem solver',
    rankPoints: 2750,
    currentRank: 'Platinum',
    streakCount: 42,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    lastActiveAt: new Date().toISOString()
  }
];

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password (in production, this would use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const accessToken = 'access-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Set refresh token cookie
    CookieUtil.setRefreshTokenCookie(res, 'refresh-token-' + Date.now());
    
    console.log('User logged in:', { username: user.username, email: user.email, userId: user.id });
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          bio: user.bio,
          rankPoints: user.rankPoints,
          currentRank: user.currentRank,
          streakCount: user.streakCount,
          createdAt: user.createdAt,
          lastActiveAt: user.lastActiveAt
        },
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Username validation
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 characters'
      });
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, hyphens, and underscores'
      });
    }
    
    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }
    
    // Mock duplicate user check
    if (email === 'existing@example.com' || username === 'existinguser') {
      return res.status(409).json({
        success: false,
        message: email === 'existing@example.com' ? 'User with this email already exists' : 'Username is already taken'
      });
    }
    
    // Mock successful registration
    const user = {
      id: 'user-' + Date.now(),
      username,
      email,
      profileImage: null,
      bio: null,
      rankPoints: 0,
      currentRank: 'Bronze',
      streakCount: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    
    const accessToken = 'access-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Set refresh token cookie (mock)
    CookieUtil.setRefreshTokenCookie(res, 'refresh-token-' + Date.now());
    
    console.log('User registered:', { username, email, userId: user.id });
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken
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
      'POST /api/auth/register - Register new user',
      'POST /api/auth/login - User login'
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
  console.log(`🚀 MathSolve AI Backend (Simple Mode) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API info: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth info: http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('Available test credentials:');
  console.log('- Email: test@example.com | Password: TestPass123!');
  console.log('- Email: mathgeek@example.com | Password: MathRocks2024!');
});

module.exports = app;