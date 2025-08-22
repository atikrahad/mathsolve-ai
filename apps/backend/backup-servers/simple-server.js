const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'MathSolve AI Backend is running'
  });
});

// API info
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

// Auth service info
app.get('/api/auth', (req, res) => {
  res.json({
    message: 'Authentication service is running',
    version: '1.0.0',
    endpoints: {
      public: [
        'POST /api/auth/register - User registration',
        'POST /api/auth/login - User login',
        'GET /api/auth/google/url - Google OAuth URL',
        'POST /api/auth/google/token - Google token authentication'
      ]
    }
  });
});

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  // Password strength check
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
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
      },
      accessToken: 'access-token-' + Date.now()
    }
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Mock successful login
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: 'user-' + Date.now(),
        username: 'testuser',
        email,
        profileImage: null,
        bio: null,
        rankPoints: 150,
        currentRank: 'Silver',
        streakCount: 7,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastActiveAt: new Date().toISOString()
      },
      accessToken: 'access-token-' + Date.now()
    }
  });
});

// Google OAuth URL endpoint
app.get('/api/auth/google/url', (req, res) => {
  const { state } = req.query;
  
  // Mock Google OAuth URL
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=mock-client-id&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=email%20profile&state=${state || 'default'}`;
  
  res.json({
    success: true,
    message: 'Google OAuth URL generated successfully',
    data: { authUrl }
  });
});

// Google token authentication
app.post('/api/auth/google/token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Google token is required'
    });
  }
  
  // Mock Google authentication
  res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    data: {
      user: {
        id: 'google-user-' + Date.now(),
        username: 'googleuser',
        email: 'user@gmail.com',
        profileImage: 'https://lh3.googleusercontent.com/a/mock-profile-image',
        bio: null,
        rankPoints: 0,
        currentRank: 'Bronze',
        streakCount: 0,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      },
      accessToken: 'google-access-token-' + Date.now(),
      isNewUser: true
    }
  });
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
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/google/url',
      'POST /api/auth/google/token'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
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
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API info: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth info: http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('Available endpoints:');
  console.log('- POST /api/auth/register - User registration');
  console.log('- POST /api/auth/login - User login');
  console.log('- GET /api/auth/google/url - Google OAuth URL');
  console.log('- POST /api/auth/google/token - Google token auth');
});

module.exports = app;