require('dotenv').config();
const http = require('node:http');
const { Server } = require('socket.io');
const app = require('./src/app');
const { startAlertMonitor } = require('./src/services/alertMonitor.service');
const { startBroadcaster } = require('./src/services/broadcaster.service');

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

httpServer.listen(PORT, () => {
  console.log(`SysPulse backend running on http://localhost:${PORT}`);
  startAlertMonitor();
  console.log('SysPulse alert monitor confirmed active');
  startBroadcaster(io);
});