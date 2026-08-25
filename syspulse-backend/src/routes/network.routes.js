const express = require('express');
const router = express.Router();
const { getNetworkInfoHandler } = require('../controllers/network.controller');

router.get('/network', getNetworkInfoHandler);

module.exports = router;