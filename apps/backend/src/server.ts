import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { logger } from './config/logger';
import { corsOptions } from './config/cors';

// Load environment variables
dotenv.config();

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  // Add more socket event handlers here as needed
});

// Graceful shutdown handler
const gracefulShutdown = () => {
  logger.info('Starting graceful shutdown...');

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 MathSolve AI Backend running on port ${PORT} in ${NODE_ENV} mode`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔧 API info: http://localhost:${PORT}/api`);
  logger.info('');
  logger.info('Google OAuth Configuration Status:');
  logger.info(
    `- GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ NOT CONFIGURED'}`
  );
  logger.info(
    `- GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ NOT CONFIGURED'}`
  );
  logger.info(`- GOOGLE_REDIRECT_URI: ${process.env.GOOGLE_REDIRECT_URI || '⚠️  Using default'}`);

  if (!process.env.GOOGLE_CLIENT_ID) {
    logger.info('');
    logger.info('⚠️  To enable real Google OAuth:');
    logger.info('1. Get credentials from Google Cloud Console');
    logger.info('2. Add to .env file:');
    logger.info('   GOOGLE_CLIENT_ID=your-client-id');
    logger.info('   GOOGLE_CLIENT_SECRET=your-client-secret');
    logger.info('   GOOGLE_REDIRECT_URI=http://localhost:3002/auth/google/callback');
  }
});

export { app, io };
