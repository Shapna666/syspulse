const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchCpuInfo() {
  const command = `
    $cpu = Get-CimInstance Win32_Processor
    $perf = Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor | Where-Object { $_.Name -eq '_Total' }
    $result = [PSCustomObject]@{
      processorName = $cpu.Name
      physicalCores = $cpu.NumberOfCores
      logicalProcessors = $cpu.NumberOfLogicalProcessors
      usagePercent = $perf.PercentProcessorTime
    }
    $result | ConvertTo-Json
  `;

  const data = await runPowerShell(command);
  return data;
}

async function getCpuInfo() {
  return getCached('cpu', fetchCpuInfo, 2000);
}

module.exports = { getCpuInfo };