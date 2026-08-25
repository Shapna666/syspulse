function getHealthLevel(percent, warnThreshold = 70, criticalThreshold = 90) {
  if (percent >= criticalThreshold) return 'critical';
  if (percent >= warnThreshold) return 'warning';
  return 'healthy';
}

const levelConfig = {
  healthy: { label: 'Healthy', color: 'bg-green-500', textColor: 'text-green-400' },
  warning: { label: 'Warning', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  critical: { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-400' },
};

export { getHealthLevel, levelConfig };