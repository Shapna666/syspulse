const express = require('express');
const router = express.Router();
const { getBatteryInfoHandler } = require('../controllers/battery.controller');

router.get('/battery', getBatteryInfoHandler);

module.exports = router;