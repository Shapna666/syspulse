const { getCpuInfo } = require('./cpu.service');
const { getMemoryInfo } = require('./memory.service');
const { getDiskInfo } = require('./disk.service');
const { getNetworkInfo } = require('./network.service');
const { getBatteryInfo } = require('./battery.service');

function startBroadcaster(io) {
  const broadcastMetric = async (eventName, getMetric) => {
    try {
      const data = await getMetric();
      io.emit(eventName, data);
    } catch (error) {
      console.error(`Broadcaster failed for ${eventName}:`, error.message);
    }
  };

  setInterval(() => {
    broadcastMetric('cpu:update', getCpuInfo);
    broadcastMetric('memory:update', getMemoryInfo);
    broadcastMetric('disk:update', getDiskInfo);
    broadcastMetric('network:update', getNetworkInfo);
    broadcastMetric('battery:update', getBatteryInfo);
  }, 3000);

  console.log('SysPulse metric broadcaster started (3-second interval)');
}

module.exports = { startBroadcaster };
