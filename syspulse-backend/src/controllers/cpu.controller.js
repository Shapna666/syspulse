const { getCpuInfo } = require('../services/cpu.service');

async function getCpuInfoHandler(req, res, next) {
  try {
    const info = await getCpuInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCpuInfoHandler };