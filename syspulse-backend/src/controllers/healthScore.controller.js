const { getCpuInfo } = require('../services/cpu.service');
const { getMemoryInfo } = require('../services/memory.service');
const { getDiskInfo } = require('../services/disk.service');
const { getBatteryInfo } = require('../services/battery.service');
const { calculateHealthScore } = require('../services/healthScore.service');

async function getHealthScoreHandler(req, res, next) {
  try {
    const [cpu, memory, disk, battery] = await Promise.all([
      getCpuInfo(),
      getMemoryInfo(),
      getDiskInfo(),
      getBatteryInfo(),
    ]);

    const result = calculateHealthScore(cpu, memory, disk, battery);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHealthScoreHandler };
