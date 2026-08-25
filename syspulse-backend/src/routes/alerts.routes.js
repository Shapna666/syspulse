const express = require('express');
const { getActiveAlertsHandler } = require('../controllers/alerts.controller');

const router = express.Router();

router.get('/active', getActiveAlertsHandler);

module.exports = router;
