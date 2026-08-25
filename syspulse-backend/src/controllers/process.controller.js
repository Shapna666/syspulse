const { getTopProcesses } = require('../services/process.service');

async function getTopProcessesHandler(req, res, next) {
  try {
    const processes = await getTopProcesses();
    res.json(processes);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTopProcessesHandler };