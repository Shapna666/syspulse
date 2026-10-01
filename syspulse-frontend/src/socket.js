import { io } from 'socket.io-client';

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? undefined : 'http://localhost:5000');

export const socket = io(socketUrl);
