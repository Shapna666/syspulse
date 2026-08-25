const express = require('express');
const router = express.Router();
const { getHealthScoreHandler } = require('../controllers/healthScore.controller');

router.get('/health-score', getHealthScoreHandler);

module.exports = router;
