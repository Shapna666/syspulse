const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://REPLACE-WITH-VERCEL-URL.vercel.app'],
}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;