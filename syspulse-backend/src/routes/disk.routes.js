const express = require('express');
const router = express.Router();
const { getDiskInfoHandler } = require('../controllers/disk.controller');

router.get('/disk', getDiskInfoHandler);

module.exports = router;