const runPowerShell = require('../utils/runPowerShell');
const { getCached } = require('../utils/cache');

async function fetchNetworkInfo() {
  const command = `
    $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' | Sort-Object -Property RouteMetric | Select-Object -First 1
    $adapter = Get-NetAdapter -InterfaceIndex $route.InterfaceIndex
    $ipConfig = Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 | Select-Object -First 1
    $hostname = $env:COMPUTERNAME

    $stat1 = Get-NetAdapterStatistics -Name $adapter.Name
    Start-Sleep -Milliseconds 1000
    $stat2 = Get-NetAdapterStatistics -Name $adapter.Name

    $bytesReceivedPerSec = $stat2.ReceivedBytes - $stat1.ReceivedBytes
    $bytesSentPerSec = $stat2.SentBytes - $stat1.SentBytes

    $downloadKBps = [Math]::Round($bytesReceivedPerSec / 1KB, 2)
    $uploadKBps = [Math]::Round($bytesSentPerSec / 1KB, 2)

    $result = [PSCustomObject]@{
      hostname = $hostname
      ipAddress = $ipConfig.IPAddress
      adapterName = $adapter.Name
      downloadKBps = $downloadKBps
      uploadKBps = $uploadKBps
    }
    $result | ConvertTo-Json
  `;

  const data = await runPowerShell(command);
  return data;
}

async function getNetworkInfo() {
  return getCached('network', fetchNetworkInfo, 3000);
}

module.exports = { getNetworkInfo };