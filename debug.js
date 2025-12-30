// debug.js - Catches all unhandled errors
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

console.log('Starting Next.js with full error tracing...');

// Start Next.js
const { spawn } = require('child_process');
const next = spawn('node', ['--trace-uncaught', '--trace-warnings', 'node_modules/.bin/next', 'dev', '-p', '3001'], {
  stdio: 'inherit',
  shell: true
});

next.on('exit', (code) => {
  console.error(`\n❌ Next.js exited with code ${code}`);
});
