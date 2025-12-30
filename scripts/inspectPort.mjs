/*
  Inspect which process is LISTENING on a TCP port (Windows).

  Usage:
    node scripts/inspectPort.mjs

  Optional env:
    PORT=3010 node scripts/inspectPort.mjs
*/

import { execFileSync } from 'node:child_process';

const port = Number(process.env.PORT || '3010');

function getListeningPid(p) {
  const out = execFileSync('netstat', ['-ano'], { encoding: 'utf8' });
  const lines = out.split(/\r?\n/);
  for (const line of lines) {
    if (!line.includes(`:${p}`)) continue;
    if (!line.includes('LISTENING')) continue;
    const parts = line.trim().split(/\s+/);
    const pidStr = parts[parts.length - 1];
    const pid = Number(pidStr);
    if (Number.isFinite(pid)) return { pid, line: line.trim() };
  }
  return null;
}

const hit = getListeningPid(port);
if (!hit) {
  console.log(`No process is LISTENING on :${port}`);
  process.exitCode = 1;
} else {
  console.log(`LISTENING_LINE=${hit.line}`);
  console.log(`PID=${hit.pid}`);

  const ps = `Get-Process -Id ${hit.pid} | Select-Object Id,ProcessName,Path,StartTime | Format-List`;
  const details = execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { encoding: 'utf8' });
  process.stdout.write(details);
}
