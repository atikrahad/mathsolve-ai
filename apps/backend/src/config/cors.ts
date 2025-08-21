import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:3000', // Next.js frontend development
  'http://localhost:3001', // Alternative frontend port
  'https://mathsolve-ai.com', // Production frontend
  'https://www.mathsolve-ai.com', // Production frontend with www
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, desktop apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow localhost with any port
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'x-access-token'
  ],
  exposedHeaders: [
    'Authorization',
    'x-total-count',
    'x-page-count'
  ],
  maxAge: 86400, // 24 hours
};