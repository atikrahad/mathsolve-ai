import { io, Socket } from 'socket.io-client';

const resolveSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return apiBase.replace(/\/api$/, '');
};

let socketInstance: Socket | null = null;

export const getRealtimeSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(resolveSocketUrl(), {
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  return socketInstance;
};
