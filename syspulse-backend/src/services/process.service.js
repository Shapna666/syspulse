const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchTopProcesses(limit = null) {
  const command = `
    $totalMemoryKB = (Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize

    $processes = Get-Process | Sort-Object -Property CPU -Descending${limit ? ` | Select-Object -First ${limit}` : ''}

    $result = $processes | ForEach-Object {
      $memoryMB = [Math]::Round($_.WorkingSet64 / 1MB, 1)
      $memoryPercent = [Math]::Round((($_.WorkingSet64 / 1KB) / $totalMemoryKB) * 100, 1)
      $cpuTime = if ($_.CPU) { [Math]::Round($_.CPU, 1) } else { 0 }
      $path = try { $_.Path } catch { $null }
      $startTime = try { $_.StartTime.ToString('yyyy-MM-dd HH:mm:ss') } catch { $null }
      $threadCount = $_.Threads.Count
      $status = if ($_.Responding) { 'Running' } else { 'Not Responding' }

      [PSCustomObject]@{
        name = $_.ProcessName
        pid = $_.Id
        cpuTime = $cpuTime
        memoryMB = $memoryMB
        memoryPercent = $memoryPercent
        status = $status
        path = $path
        startTime = $startTime
        threadCount = $threadCount
      }
    }

    $result | ConvertTo-Json -Compress
  `;

  const data = await runPowerShell(command);
  return Array.isArray(data) ? data : [data];
}

async function getTopProcesses(limit = null) {
  const key = `processes:${limit || 'all'}`;
  return getCached(key, () => fetchTopProcesses(limit), 5000);
}

module.exports = { getTopProcesses };