/**
 * Computes a weighted 0-100 health score from resource usage metrics.
 * Higher usage lowers the score. Returns a status label and recommendations.
 */
function calculateHealthScore(cpu, memory, disk, battery, network) {
  const cpuUsage = Number(cpu?.usagePercent);
  const memoryUsage = Number(memory?.usagePercent);
  // Disk is an array of drives — use the first (or the most-used) drive.
  const diskArray = Array.isArray(disk) ? disk : disk ? [disk] : [];
  const diskUsage = diskArray.length
    ? Math.max(...diskArray.map((d) => Number(d?.usagePercent) || 0))
    : NaN;

  // Per-metric sub-score (0-100). Safe below the threshold, then linearly
  // decreasing to 0 at 100% usage.
  const metricScore = (usage, safeThreshold) => {
    if (usage === null || Number.isNaN(usage)) return null;
    if (usage <= safeThreshold) return 100;
    if (usage >= 100) return 0;
    return Math.max(0, Math.round(100 - ((usage - safeThreshold) / (100 - safeThreshold)) * 100));
  };

  const cpuScore = metricScore(cpuUsage, 70);
  const memoryScore = metricScore(memoryUsage, 70);
  const diskScore = metricScore(diskUsage, 80);

  // Weighted average of available metrics.
  const weights = { cpu: 0.4, memory: 0.35, disk: 0.25 };
  let totalWeight = 0;
  let weightedSum = 0;

  if (cpuScore !== null) {
    weightedSum += cpuScore * weights.cpu;
    totalWeight += weights.cpu;
  }
  if (memoryScore !== null) {
    weightedSum += memoryScore * weights.memory;
    totalWeight += weights.memory;
  }
  if (diskScore !== null) {
    weightedSum += diskScore * weights.disk;
    totalWeight += weights.disk;
  }

  const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  // Status mapping.
  let status = 'Critical';
  if (score >= 90) status = 'Excellent';
  else if (score >= 70) status = 'Good';
  else if (score >= 50) status = 'Warning';

  // Recommendations based on the worst metric.
  const recommendations = [];

  const usageLabel = (usage) => {
    if (usage === null || Number.isNaN(usage)) return null;
    if (usage >= 90) return 'very high';
    if (usage >= 70) return 'high';
    if (usage >= 50) return 'moderate';
    return 'normal';
  };

  const cpuLabel = usageLabel(cpuUsage);
  if (cpuLabel) {
    recommendations.push(
      cpuLabel === 'normal'
        ? 'CPU usage is normal.'
        : cpuLabel === 'high'
        ? 'CPU usage is high.'
        : cpuLabel === 'very high'
        ? 'CPU usage is very high.'
        : 'CPU usage is moderate.'
    );
  }

  const memoryLabel = usageLabel(memoryUsage);
  if (memoryLabel) {
    recommendations.push(
      memoryLabel === 'normal'
        ? 'Memory usage is normal.'
        : memoryLabel === 'high'
        ? 'Memory usage is high.'
        : memoryLabel === 'very high'
        ? 'Memory usage is very high.'
        : 'Memory usage is elevated.'
    );
  }

  const diskLabel = usageLabel(diskUsage);
  if (diskLabel) {
    recommendations.push(
      diskLabel === 'normal'
        ? 'Disk space is healthy.'
        : diskLabel === 'high'
        ? 'Disk space is running low.'
        : diskLabel === 'very high'
        ? 'Disk space is critically low.'
        : 'Disk space usage is moderate.'
    );
  }

  if (battery?.hasBattery && battery.percentage !== null && battery.percentage < 20) {
    recommendations.push('Battery is low, consider charging.');
  }

  return {
    score,
    status,
    recommendations,
  };
}

module.exports = { calculateHealthScore };
