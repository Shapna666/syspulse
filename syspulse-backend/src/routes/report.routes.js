const express = require('express');
const router = express.Router();
const { exportReportHandler } = require('../controllers/report.controller');

router.get('/export', exportReportHandler);

module.exports = router;