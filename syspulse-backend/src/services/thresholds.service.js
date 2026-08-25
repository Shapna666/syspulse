const thresholds = {
  cpu: 85,
  memory: 85,
  disk: 90,
};

function getThresholds() {
  return { ...thresholds };
}

function setThresholds(newThresholds = {}) {
  Object.entries(newThresholds).forEach(([metric, value]) => {
    const numericValue = Number(value);
    if (
      Object.prototype.hasOwnProperty.call(thresholds, metric) &&
      Number.isFinite(numericValue) &&
      numericValue >= 1 &&
      numericValue <= 100
    ) {
      thresholds[metric] = numericValue;
    }
  });

  return getThresholds();
}

module.exports = { getThresholds, setThresholds };
