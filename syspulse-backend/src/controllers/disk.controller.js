const { getDiskInfo } = require('../services/disk.service');

async function getDiskInfoHandler(req, res, next) {
  try {
    const info = await getDiskInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}

module.exports = { getDiskInfoHandler };