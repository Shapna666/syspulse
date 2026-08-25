const express = require('express');
const router = express.Router();
const { getSystemInfoHandler } = require('../controllers/systemInfo.controller');

router.get('/info', getSystemInfoHandler);

module.exports = router;