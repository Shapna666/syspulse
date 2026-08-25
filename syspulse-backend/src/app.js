const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://syspulse-f8sb.vercel.app',
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;