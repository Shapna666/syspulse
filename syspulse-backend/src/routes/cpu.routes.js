const express = require('express');
const router = express.Router();
const { getCpuInfoHandler } = require('../controllers/cpu.controller');

router.get('/cpu', getCpuInfoHandler);

module.exports = router;