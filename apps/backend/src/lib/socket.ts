import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const setSocketInstance = (instance: SocketIOServer) => {
  ioInstance = instance;
};

export const getSocketInstance = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.io instance has not been initialized yet');
  }
  return ioInstance;
};
