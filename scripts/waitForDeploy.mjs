const target = '648d370';
const url = 'https://emersoneims.com/';
const start = Date.now();
const deadline = start + 8 * 60 * 1000;
let last = '';
while (Date.now() < deadline) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    const sha = (r.headers.get('x-app-commit') || '').slice(0, 7);
    const elapsed = Math.round((Date.now() - start) / 1000);
    if (sha !== last) {
      console.log(`[+${elapsed}s] sha=${sha} status=${r.status}`);
      last = sha;
    }
    if (sha.startsWith(target)) {
      console.log(`✓ Live now serves ${sha} (target ${target}) after ${elapsed}s`);
      process.exit(0);
    }
  } catch (e) {
    console.log('fetch error', e.message);
  }
  await new Promise(r => setTimeout(r, 15000));
}
console.log('Timeout: last sha=' + last);
process.exit(1);
