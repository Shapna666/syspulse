const notifier = require('node-notifier');
const { getCpuInfo } = require('./cpu.service');
const { getMemoryInfo } = require('./memory.service');
const { getDiskInfo } = require('./disk.service');
const { getThresholds } = require('./thresholds.service');

const breachState = { cpu: false, memory: false, disk: false };
let activeAlerts = [];
let monitorInterval = null;

async function checkAlerts() {
  try {
    const [cpu, memory, disks] = await Promise.all([
      getCpuInfo(),
      getMemoryInfo(),
      getDiskInfo(),
    ]);
    const thresholds = getThresholds();
    const values = {
      cpu: Number(cpu?.usagePercent),
      memory: Number(memory?.usagePercent),
      disk: Number(disks?.[0]?.usagePercent),
    };

    Object.entries(values).forEach(([metric, value]) => {
      if (!Number.isFinite(value)) return;

      const isBreached = value >= thresholds[metric];
      const existingAlert = activeAlerts.find((alert) => alert.metric === metric);

      if (isBreached && !breachState[metric]) {
        const label = metric.charAt(0).toUpperCase() + metric.slice(1);
        const message = `${label} usage is at ${value}% (threshold: ${thresholds[metric]}%)`;
        const alert = {
          metric,
          message,
          value,
          threshold: thresholds[metric],
          triggeredAt: new Date().toISOString(),
        };

        activeAlerts = [...activeAlerts.filter((item) => item.metric !== metric), alert];
        try {
          notifier.notify({ title: 'SysPulse Alert', message }, () => {});
        } catch {
          // Ignore desktop notification errors on headless servers
        }
      } else if (!isBreached && breachState[metric]) {
        activeAlerts = activeAlerts.filter((alert) => alert.metric !== metric);
      } else if (isBreached && existingAlert && existingAlert.threshold !== thresholds[metric]) {
        activeAlerts = activeAlerts.map((alert) =>
          alert.metric === metric
            ? { ...alert, threshold: thresholds[metric] }
            : alert
        );
      }

      breachState[metric] = isBreached;
    });
  } catch (error) {
    console.error('Alert monitor check failed:', error.message);
  }
}

function startAlertMonitor() {
  if (monitorInterval) return;

  checkAlerts();
  monitorInterval = setInterval(checkAlerts, 10000);
  console.log('SysPulse alert monitor started (10-second interval)');
}

function getActiveAlerts() {
  return activeAlerts.map((alert) => ({ ...alert }));
}

module.exports = { startAlertMonitor, getActiveAlerts };
