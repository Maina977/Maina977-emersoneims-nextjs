const target = process.argv[2] || 'e5f7bab';
const deadline = Date.now() + 8 * 60 * 1000;
let last = '';
while (Date.now() < deadline) {
  const r = await fetch('https://emersoneims.com/', { cache: 'no-store' });
  const sha = (r.headers.get('x-app-commit') || '').slice(0, 7);
  if (sha !== last) { console.log('sha=' + sha); last = sha; }
  if (sha.startsWith(target)) break;
  await new Promise(r => setTimeout(r, 15000));
}

console.log('\n=== Verification on /resources ===');
const rr = await fetch('https://emersoneims.com/resources', { cache: 'no-store' });
const h = await rr.text();
console.log('sha:', rr.headers.get('x-app-commit')?.slice(0, 7));
const hrefs = ['/resources/solar-ups-hub', '/hub/simulator', '/hub/ups-lab', '/hub/verifier', '/hub/quote-audit', '/hub/diagnostics'];
console.log('Solar / UPS Hub mentions in HTML:', (h.match(/Solar \/ UPS Hub/g) || []).length);
for (const p of hrefs) {
  const re = new RegExp('href="' + p.replace(/\//g, '\\/') + '"', 'g');
  console.log('  href=' + p, '=>', (h.match(re) || []).length);
}

console.log('\n=== Verification on / (homepage navbar) ===');
const r2 = await fetch('https://emersoneims.com/', { cache: 'no-store' });
const h2 = await r2.text();
for (const p of hrefs) {
  const re = new RegExp('href="' + p.replace(/\//g, '\\/') + '"', 'g');
  console.log('  href=' + p, '=>', (h2.match(re) || []).length);
}
