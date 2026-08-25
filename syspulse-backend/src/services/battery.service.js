const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchBatteryInfo() {
  const command = `
    $battery = Get-CimInstance Win32_Battery

    if ($null -eq $battery) {
      $result = [PSCustomObject]@{
        hasBattery = $false
        percentage = $null
        chargingStatus = $null
        estimatedRuntimeMinutes = $null
      }
    } else {
      $statusMap = @{
        1 = 'Discharging'
        2 = 'On AC (Plugged In)'
        3 = 'Fully Charged'
        4 = 'Low'
        5 = 'Critical'
        6 = 'Charging'
        7 = 'Charging and High'
        8 = 'Charging and Low'
        9 = 'Charging and Critical'
        10 = 'Undefined'
        11 = 'Partially Charged'
      }
      $statusText = $statusMap[[int]$battery.BatteryStatus]
      if (-not $statusText) { $statusText = 'Unknown' }

      $runtime = $battery.EstimatedRunTime
      if ($runtime -eq 71582788) { $runtime = $null }

      $result = [PSCustomObject]@{
        hasBattery = $true
        percentage = $battery.EstimatedChargeRemaining
        chargingStatus = $statusText
        estimatedRuntimeMinutes = $runtime
      }
    }

    $result | ConvertTo-Json
  `;

  const data = await runPowerShell(command);
  return data;
}

async function getBatteryInfo() {
  return getCached('battery', fetchBatteryInfo, 5000);
}

module.exports = { getBatteryInfo };