const { getBatteryInfo } = require('../services/battery.service');

async function getBatteryInfoHandler(req, res, next) {
  try {
    const info = await getBatteryInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBatteryInfoHandler };