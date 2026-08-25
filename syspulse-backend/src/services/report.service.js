const PDFDocument = require('pdfkit');
const { getSystemInfo } = require('./systemInfo.service');
const { getCpuInfo } = require('./cpu.service');
const { getMemoryInfo } = require('./memory.service');
const { getDiskInfo } = require('./disk.service');
const { getNetworkInfo } = require('./network.service');
const { getBatteryInfo } = require('./battery.service');
const { getTopProcesses } = require('./process.service');

const ACCENT = '#2DD4BF';
const DARK = '#14161D';
const MUTED = '#666B7A';
const TEXT = '#1A1B20';

async function generateReport(res) {
  // Gather all data in parallel — but network/processes are slower, so allow extra time
  const [systemInfo, cpu, memory, disk, network, battery, processes] = await Promise.all([
    getSystemInfo(),
    getCpuInfo(),
    getMemoryInfo(),
    getDiskInfo(),
    getNetworkInfo().catch(() => null), // don't let network failure block the whole report
    getBatteryInfo().catch(() => null),
    getTopProcesses(10),
  ]);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  // Collect the PDF into a buffer before sending so the response is delivered
  // whole instead of being streamed mid-generation. Streaming can be cut off
  // (ERR_INCOMPLETE_CHUNKED_ENCODING) when the heavy PowerShell calls take time.
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  const finished = new Promise((resolve) => doc.on('end', resolve));

  // ---------- Header ----------
  doc
    .fillColor(ACCENT)
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('SysPulse', 50, 50);

  doc
    .fillColor(TEXT)
    .fontSize(14)
    .font('Helvetica')
    .text('Enterprise System Health Report', 50, 78);

  const generatedAt = new Date().toLocaleString();
  doc
    .fillColor(MUTED)
    .fontSize(9)
    .text(`Generated: ${generatedAt}`, 50, 98);

  doc.moveTo(50, 118).lineTo(545, 118).strokeColor('#E2E4E8').stroke();
  doc.moveDown(2);

  let y = 135;

  const sectionTitle = (title) => {
    doc.fillColor(TEXT).fontSize(13).font('Helvetica-Bold').text(title, 50, y);
    y += 20;
  };

  const row = (label, value) => {
    doc.fillColor(MUTED).fontSize(9).font('Helvetica').text(label, 55, y, { continued: false, width: 200 });
    doc.fillColor(TEXT).fontSize(9).font('Helvetica-Bold').text(String(value ?? 'N/A'), 260, y, { width: 285 });
    y += 16;
  };

  const spacer = (h = 14) => {
    y += h;
  };

  const checkPageBreak = (neededSpace = 100) => {
    if (y + neededSpace > 780) {
      doc.addPage();
      y = 50;
    }
  };

  // ---------- System Information ----------
  sectionTitle('System Information');
  row('Computer Name', systemInfo?.system?.computerName);
  row('Manufacturer / Model', `${systemInfo?.system?.manufacturer ?? ''} ${systemInfo?.system?.model ?? ''}`);
  row('BIOS Version', systemInfo?.system?.biosVersion);
  row('Windows Version', systemInfo?.os?.windowsVersion);
  row('Build Number', systemInfo?.os?.buildNumber);
  row('Architecture', systemInfo?.os?.architecture);
  row('System Uptime', systemInfo?.os?.uptime);
  spacer();

  checkPageBreak();

  // ---------- CPU Summary ----------
  sectionTitle('CPU Summary');
  row('Processor', cpu?.processorName);
  row('Physical Cores', cpu?.physicalCores);
  row('Logical Processors', cpu?.logicalProcessors);
  row('Current Usage', `${cpu?.usagePercent}%`);
  spacer();

  checkPageBreak();

  // ---------- Memory Summary ----------
  sectionTitle('Memory Summary');
  row('Total RAM', `${memory?.totalGB} GB`);
  row('Used RAM', `${memory?.usedGB} GB`);
  row('Free RAM', `${memory?.freeGB} GB`);
  row('Usage', `${memory?.usagePercent}%`);
  spacer();

  checkPageBreak();

  // ---------- Disk Summary ----------
  sectionTitle('Disk Summary');
  (disk || []).forEach((d) => {
    row(`Drive ${d.drive}`, `${d.usedGB} GB / ${d.totalGB} GB (${d.usagePercent}% used)`);
  });
  spacer();

  checkPageBreak();

  // ---------- Network Summary ----------
  sectionTitle('Network Summary');
  if (network) {
    row('Hostname', network.hostname);
    row('IP Address', network.ipAddress);
    row('Adapter', network.adapterName);
    row('Download / Upload', `${network.downloadKBps} KB/s / ${network.uploadKBps} KB/s`);
  } else {
    row('Status', 'Network data unavailable at time of report');
  }
  spacer();

  checkPageBreak();

  // ---------- Battery Summary ----------
  sectionTitle('Battery Summary');
  if (battery?.hasBattery) {
    row('Charge Level', `${battery.percentage}%`);
    row('Status', battery.chargingStatus);
  } else {
    row('Status', 'No battery detected (desktop system)');
  }
  spacer();

  checkPageBreak(150);

  // ---------- Top Running Processes ----------
  sectionTitle('Top Running Processes');

  const topTen = (processes || []).slice(0, 10);
  const colX = { name: 55, pid: 220, cpu: 290, mem: 380 };

  doc.fillColor(MUTED).fontSize(8.5).font('Helvetica-Bold');
  doc.text('Process', colX.name, y);
  doc.text('PID', colX.pid, y);
  doc.text('CPU Time (s)', colX.cpu, y);
  doc.text('Memory', colX.mem, y);
  y += 14;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#E2E4E8').stroke();
  y += 6;

  doc.font('Helvetica').fontSize(8.5).fillColor(TEXT);
  topTen.forEach((p) => {
    checkPageBreak(20);
    doc.text(p.name, colX.name, y, { width: 150 });
    doc.text(String(p.pid), colX.pid, y);
    doc.text(String(p.cpuTime), colX.cpu, y);
    doc.text(`${p.memoryMB} MB`, colX.mem, y);
    y += 14;
});

  // ---------- Footer ----------
  doc
    .fontSize(8)
    .fillColor(MUTED)
    .text('Generated by SysPulse — Enterprise System Health Monitoring', 50, 780, {
      width: 495,
      align: 'center',
    });

  doc.end();
  await finished;

  const pdfBuffer = Buffer.concat(chunks);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="SysPulse-Health-Report.pdf"');
  res.setHeader('Content-Length', pdfBuffer.length);
  res.send(pdfBuffer);
}

module.exports = { generateReport };
