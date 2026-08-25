const express = require('express');
const router = express.Router();
const { getWindowsServicesHandler } = require('../controllers/windowsService.controller');

router.get('/services', getWindowsServicesHandler);

module.exports = router;