const express = require('express');
const router = express.Router();
const systemInfoRoutes = require('./systemInfo.routes');
const cpuRoutes = require('./cpu.routes');
const memoryRoutes = require('./memory.routes');
const diskRoutes = require('./disk.routes');
const networkRoutes = require('./network.routes');
const batteryRoutes = require('./battery.routes');
const processRoutes = require('./process.routes');
const windowsServiceRoutes = require('./windowsService.routes');
const reportRoutes = require('./report.routes');
const healthScoreRoutes = require('./healthScore.routes');
const settingsRoutes = require('./settings.routes');
const alertsRoutes = require('./alerts.routes');

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/system', systemInfoRoutes);
router.use('/system', cpuRoutes);
router.use('/system', memoryRoutes);
router.use('/system', diskRoutes);
router.use('/system', networkRoutes);
router.use('/system', batteryRoutes);
router.use('/system', processRoutes);
router.use('/system', windowsServiceRoutes);
router.use('/system', healthScoreRoutes);
router.use('/report', reportRoutes);
router.use('/settings', settingsRoutes);
router.use('/alerts', alertsRoutes);


module.exports = router;