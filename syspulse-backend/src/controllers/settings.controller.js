const { getThresholds, setThresholds } = require('../services/thresholds.service');

function getThresholdsHandler(req, res) {
  res.json(getThresholds());
}

function setThresholdsHandler(req, res) {
  res.json(setThresholds(req.body));
}

module.exports = { getThresholdsHandler, setThresholdsHandler };
