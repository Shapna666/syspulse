const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchWindowsServices() {
  const command = `
    $services = Get-Service | Sort-Object -Property Status, DisplayName

    $result = $services | ForEach-Object {
      [PSCustomObject]@{
        name = $_.Name
        displayName = $_.DisplayName
        status = $_.Status.ToString()
        startType = $_.StartType.ToString()
      }
    }

    $result | ConvertTo-Json -Compress
  `;

  const data = await runPowerShell(command);
  return Array.isArray(data) ? data : [data];
}

async function getWindowsServices() {
  return getCached('services', fetchWindowsServices, 10000);
}

module.exports = { getWindowsServices };