import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { connectionHandler } from './handlers/connectionHandler';
import { initializeServices } from './services/initializeServices';

// Load environment variables
dotenv.config();

const PORT = process.env.MCP_PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Initialize services
    await initializeServices();
    logger.info('Services initialized successfully');

    // Create WebSocket server
    const wss = new WebSocketServer({ 
      port: Number(PORT),
      perMessageDeflate: {
        zlibDeflateOptions: {
          threshold: 1024,
          concurrencyLimit: 10,
        },
        zlibInflateOptions: {
          chunkSize: 1024,
        },
        threshold: 1024,
        concurrencyLimit: 10,
        serverMaxWindowBits: 13,
        clientMaxWindowBits: 13,
      }
    });

    // Handle connections
    wss.on('connection', connectionHandler);

    // Handle server events
    wss.on('error', (error) => {
      logger.error('WebSocket Server Error:', error);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      logger.info('Starting MCP server shutdown...');
      
      wss.close(() => {
        logger.info('WebSocket server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forcing MCP server shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    logger.info(`🚀 MCP Server started on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`📡 WebSocket endpoint: ws://localhost:${PORT}`);

  } catch (error) {
    logger.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();