const { getActiveAlerts } = require('../services/alertMonitor.service');

function getActiveAlertsHandler(req, res) {
  res.json(getActiveAlerts());
}

module.exports = { getActiveAlertsHandler };
