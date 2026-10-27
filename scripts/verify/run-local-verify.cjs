/**
 * Local step-2 verification, run DETACHED from the editor so an extension
 * restart cannot kill the build or the test server halfway (2026-10-27).
 *
 *   PowerShell:  Start-Process node -WindowStyle Hidden -ArgumentList '"<abs path>\scripts\verify\run-local-verify.cjs"'
 *
 * Everything is LOCAL (http://localhost:3111): nothing is pushed or deployed.
 * Results: scripts/verify/out/summary.txt — last line "DONE", with a
 * "RESULT PASSED" or "RESULT FAILED" line before it. The server is always
 * stopped at the end.
 */
const { spawn, spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.resolve(__dirname, '..', '..');
const out = path.join(__dirname, 'out');
fs.mkdirSync(out, { recursive: true });
const summary = path.join(out, 'summary.txt');
fs.writeFileSync(summary, '');
const note = (m) => fs.appendFileSync(summary, `${new Date().toTimeString().slice(0, 8)} ${m}\n`);
const tail = (f) => { try { return fs.readFileSync(f, 'utf8').trim().split('\n').pop(); } catch { return '(no output)'; } };

function stopPort3111() {
  try {
    const lines = execSync('netstat -ano -p tcp', { encoding: 'utf8' }).split('\n')
      .filter((l) => /:3111\s/.test(l) && /LISTENING/.test(l));
    for (const l of lines) {
      const pid = l.trim().split(/\s+/).pop();
      if (/^\d+$/.test(pid) && pid !== '0') spawnSync('taskkill', ['/PID', pid, '/T', '/F'], { stdio: 'ignore' });
    }
  } catch { /* nothing listening */ }
}
function run(cmd, logName, timeoutMs) {
  const fd = fs.openSync(path.join(out, logName), 'w');
  const r = spawnSync(cmd, { cwd: root, shell: true, stdio: ['ignore', fd, fd], timeout: timeoutMs });
  fs.closeSync(fd);
  return r.status == null ? -1 : r.status;
}
const ping = () => new Promise((res) => {
  const req = http.get('http://localhost:3111/', { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (r) => { r.resume(); res(r.statusCode === 200); });
  req.on('error', () => res(false));
  req.on('timeout', () => { req.destroy(); res(false); });
});

(async () => {
  note('START local verification (localhost only)');
  stopPort3111();

  // --no-build reuses the last build (only when nothing changed since);
  // --step2-only skips the AquaScan repeatability stage.
  const noBuild = process.argv.includes('--no-build');
  const step2Only = process.argv.includes('--step2-only');
  if (noBuild) {
    note('BUILD skipped (--no-build: reusing the existing .next build)');
  } else {
    note('BUILD running');
    const buildExit = run('npm run build', 'build.log', 30 * 60 * 1000);
    const passes = (fs.readFileSync(path.join(out, 'build.log'), 'utf8').match(/PASS/g) || []).length;
    note(`BUILD exit=${buildExit} PASS-lines=${passes}`);
    if (buildExit !== 0) { note('RESULT FAILED (build)'); note('DONE'); return; }
  }

  const serverLog = fs.openSync(path.join(out, 'server.log'), 'w');
  const server = spawn('npx next start -p 3111', { cwd: root, shell: true, stdio: ['ignore', serverLog, serverLog], windowsHide: true });
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) { await new Promise((r) => setTimeout(r, 2000)); ready = await ping(); }
  note(`SERVER ready=${ready}`);

  let s2 = -1, aq = -1;
  if (ready) {
    s2 = run('node scripts/verify/step2.cjs', 'step2.log', 20 * 60 * 1000);
    note(`STEP2 exit=${s2} :: ${tail(path.join(out, 'step2.log'))}`);
    if (step2Only) { aq = 0; note('AQUASCAN skipped (--step2-only)'); }
    else {
      aq = run('node scripts/verify/aquascan-repeat.cjs', 'aquascan.log', 30 * 60 * 1000);
      note(`AQUASCAN exit=${aq} :: ${tail(path.join(out, 'aquascan.log'))}`);
    }
  }

  stopPort3111();
  try { spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* already gone */ }
  note(ready && s2 === 0 && aq === 0 ? 'RESULT PASSED' : `RESULT FAILED (${ready ? 'see step2.log / aquascan.log' : 'server did not start'})`);
  note('DONE');
  process.exit(0);
})();
