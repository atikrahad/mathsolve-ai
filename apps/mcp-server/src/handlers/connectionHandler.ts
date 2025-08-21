import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { messageHandler } from './messageHandler';

interface ConnectedClient {
  id: string;
  ws: WebSocket;
  userId?: string;
  connectedAt: Date;
  lastPing: Date;
}

// Store active connections
const connectedClients = new Map<string, ConnectedClient>();

export const connectionHandler = (ws: WebSocket, request: any) => {
  const clientId = uuidv4();
  const client: ConnectedClient = {
    id: clientId,
    ws,
    connectedAt: new Date(),
    lastPing: new Date()
  };

  // Add client to active connections
  connectedClients.set(clientId, client);
  
  logger.info('New client connected', {
    clientId,
    clientCount: connectedClients.size,
    userAgent: request.headers['user-agent'],
    ip: request.socket.remoteAddress
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    timestamp: new Date().toISOString(),
    message: 'Connected to MathSolve MCP Server'
  }));

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      await messageHandler(client, message);
    } catch (error) {
      logger.error('Error parsing message', {
        clientId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Handle ping/pong for connection health
  ws.on('ping', () => {
    client.lastPing = new Date();
    ws.pong();
  });

  ws.on('pong', () => {
    client.lastPing = new Date();
  });

  // Handle client disconnect
  ws.on('close', (code: number, reason: Buffer) => {
    logger.info('Client disconnected', {
      clientId,
      code,
      reason: reason.toString(),
      clientCount: connectedClients.size - 1,
      connectionDuration: Date.now() - client.connectedAt.getTime()
    });
    
    connectedClients.delete(clientId);
  });

  // Handle connection errors
  ws.on('error', (error: Error) => {
    logger.error('Client connection error', {
      clientId,
      error: error.message,
      stack: error.stack
    });
    
    connectedClients.delete(clientId);
  });
};

// Utility functions for managing connections
export const getConnectedClient = (clientId: string): ConnectedClient | undefined => {
  return connectedClients.get(clientId);
};

export const getAllConnectedClients = (): ConnectedClient[] => {
  return Array.from(connectedClients.values());
};

export const getClientsByUserId = (userId: string): ConnectedClient[] => {
  return Array.from(connectedClients.values()).filter(client => client.userId === userId);
};

export const broadcastToAll = (message: any) => {
  const messageString = JSON.stringify(message);
  connectedClients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageString);
    }
  });
};

export const sendToClient = (clientId: string, message: any): boolean => {
  const client = connectedClients.get(clientId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
    return true;
  }
  return false;
};

// Periodic cleanup of stale connections
setInterval(() => {
  const staleThreshold = 5 * 60 * 1000; // 5 minutes
  const now = Date.now();
  
  connectedClients.forEach((client, clientId) => {
    if (now - client.lastPing.getTime() > staleThreshold) {
      logger.warn('Removing stale connection', { clientId });
      client.ws.terminate();
      connectedClients.delete(clientId);
    }
  });
}, 60000); // Check every minute