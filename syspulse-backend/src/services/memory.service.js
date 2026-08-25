const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchMemoryInfo() {
  const command = `
    $os = Get-CimInstance Win32_OperatingSystem
    $totalKB = $os.TotalVisibleMemorySize
    $freeKB = $os.FreePhysicalMemory
    $usedKB = $totalKB - $freeKB
    $totalGB = [Math]::Round($totalKB / 1MB, 2)
    $usedGB = [Math]::Round($usedKB / 1MB, 2)
    $freeGB = [Math]::Round($freeKB / 1MB, 2)
    $usagePercent = [Math]::Round(($usedKB / $totalKB) * 100, 1)
    $result = [PSCustomObject]@{
      totalGB = $totalGB
      usedGB = $usedGB
      freeGB = $freeGB
      usagePercent = $usagePercent
    }
    $result | ConvertTo-Json
  `;

  const data = await runPowerShell(command);
  return data;
}

async function getMemoryInfo() {
  return getCached('memory', fetchMemoryInfo, 2000);
}

module.exports = { getMemoryInfo };