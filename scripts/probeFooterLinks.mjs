const target = process.argv[2] || '697e122';
const deadline = Date.now() + 8 * 60 * 1000;
let last = '';
while (Date.now() < deadline) {
  const r = await fetch('https://emersoneims.com/', { cache: 'no-store' });
  const sha = (r.headers.get('x-app-commit') || '').slice(0, 7);
  if (sha !== last) { console.log('sha=' + sha); last = sha; }
  if (sha.startsWith(target)) break;
  await new Promise(r => setTimeout(r, 15000));
}

const ALL_LINKS = [
  '/about-us', '/services', '/booking', '/gallery', '/case-studies', '/industries', '/careers', '/contact',
  '/services/cummins-generators', '/services/generator-repairs', '/services/ats-changeover',
  '/generators', '/generators/rental', '/generators/installation', '/generators/spare-parts',
  '/solutions/power-interruptions',
  '/services/solar-energy', '/solutions/solar', '/solutions/solar-sizing', '/solar-genius-pro',
  '/services/ups-systems', '/hub/ups-lab', '/resources/solar-ups-hub', '/services/borehole-pumps',
  '/services/distribution-boards', '/services/motor-rewinding', '/solutions/motors',
  '/solutions/high-voltage', '/solutions/diesel-automation', '/solutions/controls',
  '/solutions/fabrication', '/services/ac-installation',
  '/services/hospital-incinerators', '/solutions/incinerators', '/solutions/building',
  '/eims-pro', '/aquascan-pro-v3', '/generator-oracle', '/diagnostics', '/troubleshooting',
  '/maintenance-hub/generators', '/maintenance-hub/solar', '/maintenance-hub/hvac',
  '/maintenance-hub/borehole', '/maintenance-hub/electrical', '/maintenance-hub/motors',
  '/maintenance-hub/incinerators', '/maintenance-hub/fabrication',
  '/resources', '/knowledge-base', '/technical-bible', '/calculators', '/faults',
  '/blog', '/faq', '/guides/emergency-response',
  '/kenya', '/kenya/nairobi', '/kenya/mombasa', '/kenya/kisumu', '/kenya/nakuru', '/kenya/kiambu',
  '/locations',
];

console.log('\n=== Probing ' + ALL_LINKS.length + ' footer links on live ===');
const results = await Promise.all(ALL_LINKS.map(async (p) => {
  try {
    const r = await fetch('https://emersoneims.com' + p, { method: 'HEAD', redirect: 'manual', cache: 'no-store' });
    return { p, status: r.status };
  } catch (e) { return { p, status: 'ERR:' + e.message.slice(0, 40) }; }
}));
const good = results.filter(r => r.status === 200 || r.status === 308 || r.status === 307);
const bad = results.filter(r => !(r.status === 200 || r.status === 308 || r.status === 307));
console.log('  OK (200/307/308): ' + good.length + '/' + ALL_LINKS.length);
if (bad.length) {
  console.log('  FAILED:');
  for (const b of bad) console.log('    ' + b.status + '  ' + b.p);
} else {
  console.log('  \u2713 ALL LINKS RESOLVE');
}

console.log('\n=== Footer link presence on /resources HTML ===');
const rr = await fetch('https://emersoneims.com/resources', { cache: 'no-store' });
const h = await rr.text();
console.log('  sha:', rr.headers.get('x-app-commit')?.slice(0, 7));
const samples = ['/services/cummins-generators', '/maintenance-hub/borehole', '/aquascan-pro-v3', '/solutions/high-voltage'];
for (const s of samples) {
  console.log('  href ' + s + ' in HTML:', (h.match(new RegExp('href="' + s.replace(/\//g, '\\/') + '"', 'g')) || []).length);
}
