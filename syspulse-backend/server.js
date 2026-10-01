require('dotenv').config();
const http = require('node:http');
const { Server } = require('socket.io');
const app = require('./src/app');
const { startAlertMonitor } = require('./src/services/alertMonitor.service');
const { startBroadcaster } = require('./src/services/broadcaster.service');

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:5173',
  'https://syspulse-f8sb.vercel.app',
  /\.vercel\.app$/,
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

httpServer.listen(PORT, () => {
  console.log(`SysPulse backend running on http://localhost:${PORT}`);
  startAlertMonitor();
  console.log('SysPulse alert monitor confirmed active');
  startBroadcaster(io);
});