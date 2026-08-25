const { execFile } = require('child_process');

/**
 * Runs a PowerShell command that outputs JSON (via ConvertTo-Json)
 * and returns the parsed JavaScript object.
 * Uses execFile with an args array to avoid shell quoting issues.
 */
function runPowerShell(command) {
  return new Promise((resolve, reject) => {
    execFile(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', command],
      { maxBuffer: 1024 * 1024 * 10 },
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`PowerShell error: ${error.message}\nStderr: ${stderr}`));
        }
        if (stderr && stderr.trim().length > 0) {
          return reject(new Error(`PowerShell stderr: ${stderr}`));
        }

        try {
          const trimmed = stdout.trim();
          if (!trimmed) {
            return resolve(null);
          }
          const parsed = JSON.parse(trimmed);
          resolve(parsed);
        } catch (parseErr) {
          reject(new Error(`Failed to parse PowerShell output: ${parseErr.message}\nRaw output: ${stdout}`));
        }
      }
    );
  });
}

module.exports = runPowerShell;