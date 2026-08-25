const { getMemoryInfo } = require('../services/memory.service');

async function getMemoryInfoHandler(req, res, next) {
  try {
    const info = await getMemoryInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMemoryInfoHandler };