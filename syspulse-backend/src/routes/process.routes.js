const express = require('express');
const router = express.Router();
const { getTopProcessesHandler } = require('../controllers/process.controller');

router.get('/processes', getTopProcessesHandler);

module.exports = router;