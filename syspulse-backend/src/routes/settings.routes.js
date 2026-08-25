const express = require('express');
const { getThresholdsHandler, setThresholdsHandler } = require('../controllers/settings.controller');

const router = express.Router();

router.get('/thresholds', getThresholdsHandler);
router.post('/thresholds', setThresholdsHandler);

module.exports = router;
