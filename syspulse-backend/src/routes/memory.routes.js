const express = require('express');
const router = express.Router();
const { getMemoryInfoHandler } = require('../controllers/memory.controller');

router.get('/memory', getMemoryInfoHandler);

module.exports = router;