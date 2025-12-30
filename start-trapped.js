// 🚨 PROCESS EXIT TRAP - Catch what's killing Next.js server

const originalExit = process.exit;
const originalKill = process.kill;

// Trap process.exit()
process.exit = function(code) {
  console.error('\n\n🚨🚨🚨 process.exit() WAS CALLED with code:', code);
  console.error('Stack trace:');
  console.trace();
  console.error('🚨🚨🚨\n\n');
  originalExit.call(this, code);
};

// Trap process.kill()
process.kill = function(pid, signal) {
  console.error('\n\n🚨🚨🚨 process.kill() WAS CALLED');
  console.error('PID:', pid, 'Signal:', signal);
  console.trace();
  console.error('🚨🚨🚨\n\n');
  return originalKill.call(this, pid, signal);
};

// Listen to ALL termination signals
['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP', 'SIGBREAK', 'beforeExit', 'exit'].forEach(signal => {
  process.on(signal, (arg) => {
    console.error(`\n\n🚨🚨🚨 Signal/Event received: ${signal}`, arg);
    console.error('Stack trace:');
    console.trace();
    console.error('🚨🚨🚨\n\n');
  });
});

console.log('✅ Process trap installed. Starting Next.js dev server...\n');

// Start Next.js with require
const { spawn } = require('child_process');

const child = spawn('npx', ['next', 'dev', '-p', '3001'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code, signal) => {
  console.error(`\n\n🚨🚨🚨 CHILD PROCESS EXITED`);
  console.error('Exit code:', code);
  console.error('Signal:', signal);
  console.error('🚨🚨🚨\n\n');
});

child.on('error', (err) => {
  console.error(`\n\n🚨🚨🚨 CHILD PROCESS ERROR`);
  console.error(err);
  console.error('🚨🚨🚨\n\n');
});
