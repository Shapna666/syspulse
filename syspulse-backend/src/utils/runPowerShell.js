const { execFile } = require('child_process');

function getMockData(command) {
  if (command.includes('Win32_ComputerSystem')) {
    return {
      system: {
        computerName: 'serverless',
        hostname: 'serverless',
        manufacturer: 'Mock environment',
        model: 'Linux serverless host',
        biosVersion: 'N/A',
        serialNumber: 'N/A',
      },
      os: {
        windowsVersion: 'Linux serverless environment',
        buildNumber: 'N/A',
        architecture: process.arch,
        bootTime: null,
        uptime: 'N/A',
      },
      hardware: {
        processorName: 'Server CPU (mock data)',
        physicalCores: 2,
        logicalProcessors: 2,
        totalRAMGB: 4,
        availableRAMGB: 3,
      },
      storage: {
        totalGB: 10,
        usedGB: 2,
        freeGB: 8,
      },
      network: {
        ipAddress: '127.0.0.1',
        macAddress: 'N/A',
        adapterName: 'mock-network',
      },
    };
  }

  if (command.includes('Win32_Processor')) {
    return {
      processorName: 'Server CPU (mock data)',
      physicalCores: 2,
      logicalProcessors: 2,
      usagePercent: 0,
    };
  }

  if (command.includes('Win32_OperatingSystem') && command.includes('TotalVisibleMemorySize')) {
    return {
      totalGB: 4,
      usedGB: 1,
      freeGB: 3,
      usagePercent: 25,
    };
  }

  if (command.includes('Win32_LogicalDisk')) {
    return {
      drive: 'N/A',
      totalGB: 10,
      usedGB: 2,
      freeGB: 8,
      usagePercent: 20,
    };
  }

  if (command.includes('Win32_Battery')) {
    return {
      hasBattery: false,
      percentage: null,
      chargingStatus: null,
      estimatedRuntimeMinutes: null,
    };
  }

  if (command.includes('Get-NetAdapterStatistics')) {
    return {
      hostname: 'serverless',
      ipAddress: '127.0.0.1',
      adapterName: 'mock-network',
      downloadKBps: 0,
      uploadKBps: 0,
    };
  }

  if (command.includes('Get-Process')) {
    return {
      name: 'serverless-process',
      pid: 0,
      cpuTime: 0,
      memoryMB: 0,
      memoryPercent: 0,
      status: 'Running',
      path: null,
      startTime: null,
      threadCount: 0,
    };
  }

  if (command.includes('Get-Service')) {
    return {
      name: 'serverless-service',
      displayName: 'Serverless environment',
      status: 'Running',
      startType: 'Automatic',
    };
  }

  return {};
}

function resolveMock(command, resolve) {
  resolve(getMockData(command));
}

/**
 * Runs a PowerShell command that outputs JSON (via ConvertTo-Json)
 * and returns the parsed JavaScript object.
 * Uses execFile with an args array to avoid shell quoting issues.
 */
function runPowerShell(command) {
  return new Promise((resolve, reject) => {
    if (process.platform === 'linux') {
      return resolveMock(command, resolve);
    }

    execFile(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', command],
      { maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {
        if (error) {
          return resolveMock(command, resolve);
        }
        if (stderr && stderr.trim().length > 0) {
          return resolveMock(command, resolve);
        }

        try {
          const trimmed = stdout.trim();
          if (!trimmed) {
            return resolve(null);
          }
          const parsed = JSON.parse(trimmed);
          resolve(parsed);
        } catch (parseErr) {
          resolveMock(command, resolve);
        }
      }
    );
  });
}

module.exports = runPowerShell;