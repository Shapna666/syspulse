const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchDiskInfo() {
  const command = `
    $disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"
    $result = $disks | ForEach-Object {
      $totalGB = [Math]::Round($_.Size / 1GB, 2)
      $freeGB = [Math]::Round($_.FreeSpace / 1GB, 2)
      $usedGB = [Math]::Round($totalGB - $freeGB, 2)
      $usagePercent = if ($totalGB -gt 0) { [Math]::Round(($usedGB / $totalGB) * 100, 1) } else { 0 }
      [PSCustomObject]@{
        drive = $_.DeviceID
        totalGB = $totalGB
        usedGB = $usedGB
        freeGB = $freeGB
        usagePercent = $usagePercent
      }
    }
    $result | ConvertTo-Json
  `;

  const data = await runPowerShell(command);
  // If only one disk is found, PowerShell's ConvertTo-Json returns a single object,
  // not an array — normalize it so the frontend always gets an array.
  return Array.isArray(data) ? data : [data];
}

async function getDiskInfo() {
  return getCached('disk', fetchDiskInfo, 5000);
}

module.exports = { getDiskInfo };