const runPowerShell = require('../utils/runPowerShell');

async function getSystemInfo() {
  const command = `
    $cs = Get-CimInstance Win32_ComputerSystem
    $os = Get-CimInstance Win32_OperatingSystem
    $bios = Get-CimInstance Win32_BIOS
    $cpu = Get-CimInstance Win32_Processor
    $disks = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"

    $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' | Sort-Object -Property RouteMetric | Select-Object -First 1
    $adapter = Get-NetAdapter -InterfaceIndex $route.InterfaceIndex
    $ipConfig = Get-NetIPAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 | Select-Object -First 1

    $uptimeSpan = (Get-Date) - $os.LastBootUpTime
    $uptimeStr = '{0}d {1}h {2}m' -f $uptimeSpan.Days, $uptimeSpan.Hours, $uptimeSpan.Minutes
    $bootTimeStr = $os.LastBootUpTime.ToString('yyyy-MM-dd HH:mm:ss')

    $totalRAMGB = [Math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
    $freeRAMGB = [Math]::Round($os.FreePhysicalMemory / 1MB, 2)

    $totalStorageGB = [Math]::Round((($disks | Measure-Object -Property Size -Sum).Sum) / 1GB, 2)
    $freeStorageGB = [Math]::Round((($disks | Measure-Object -Property FreeSpace -Sum).Sum) / 1GB, 2)
    $usedStorageGB = [Math]::Round($totalStorageGB - $freeStorageGB, 2)

    $result = [PSCustomObject]@{
      system = [PSCustomObject]@{
        computerName = $cs.Name
        hostname = $env:COMPUTERNAME
        manufacturer = $cs.Manufacturer
        model = $cs.Model
        biosVersion = $bios.SMBIOSBIOSVersion
        serialNumber = $bios.SerialNumber
      }
      os = [PSCustomObject]@{
        windowsVersion = $os.Caption
        buildNumber = $os.BuildNumber
        architecture = $os.OSArchitecture
        bootTime = $bootTimeStr
        uptime = $uptimeStr
      }
      hardware = [PSCustomObject]@{
        processorName = $cpu.Name
        physicalCores = $cpu.NumberOfCores
        logicalProcessors = $cpu.NumberOfLogicalProcessors
        totalRAMGB = $totalRAMGB
        availableRAMGB = $freeRAMGB
      }
      storage = [PSCustomObject]@{
        totalGB = $totalStorageGB
        usedGB = $usedStorageGB
        freeGB = $freeStorageGB
      }
      network = [PSCustomObject]@{
        ipAddress = $ipConfig.IPAddress
        macAddress = $adapter.MacAddress
        adapterName = $adapter.Name
      }
    }

    $result | ConvertTo-Json -Depth 4
  `;

  const data = await runPowerShell(command);
  return data;
}

module.exports = { getSystemInfo };