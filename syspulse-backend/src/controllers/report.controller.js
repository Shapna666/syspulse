const { generateReport } = require('../services/report.service');

async function exportReportHandler(req, res, next) {
  try {
    await generateReport(res);
  } catch (err) {
    next(err);
  }
}

module.exports = { exportReportHandler };