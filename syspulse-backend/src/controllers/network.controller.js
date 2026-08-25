const { getNetworkInfo } = require('../services/network.service');

async function getNetworkInfoHandler(req, res, next) {
  try {
    const info = await getNetworkInfo();
    res.json(info);
  } catch (err) {
    next(err);
  }
}

module.exports = { getNetworkInfoHandler };