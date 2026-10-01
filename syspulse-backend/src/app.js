const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://syspulse-f8sb.vercel.app',
  /\.vercel\.app$/,
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

const corsOptions = {
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// API routes
app.use('/api', routes);

// Serve frontend static build if available
const frontendDistPath = path.join(__dirname, '../../syspulse-frontend/dist');
app.use(express.static(frontendDistPath));

// For SPA routing: return index.html for non-API GET requests
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

app.use(errorHandler);

module.exports = app;