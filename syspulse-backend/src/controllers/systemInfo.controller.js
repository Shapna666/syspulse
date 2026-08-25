const { getSystemInfo } = require('../services/systemInfo.service');

async function getSystemInfoHandler(req, res, next) {
  try {
    const info = await getSystemInfo();
    res.json(info);
  } catch (err) {
    next(err); // passes to errorHandler middleware
  }
}

module.exports = { getSystemInfoHandler };