const { getWindowsServices } = require('../services/windowsService.service');

async function getWindowsServicesHandler(req, res, next) {
  try {
    const services = await getWindowsServices();
    res.json(services);
  } catch (err) {
    next(err);
  }
}

module.exports = { getWindowsServicesHandler };