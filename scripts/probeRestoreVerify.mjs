// Verify the 3 user-stated deployment areas on live emersoneims.com.
const probes = [
  {
    name: 'Incinerator: Construction Guide rendered below page',
    url: 'https://emersoneims.com/solutions/incinerators',
    markers: [
      ['Construction', 'Construction marker'],
      ['Commissioning', 'Commissioning marker'],
    ],
  },
  {
    name: 'Solar/UPS Hub at /resources/solar-ups-hub',
    url: 'https://emersoneims.com/resources/solar-ups-hub',
    markers: [
      ['Solar', 'Solar marker'],
      ['UPS', 'UPS marker'],
    ],
  },
  {
    name: 'Resources page Quick Access band',
    url: 'https://emersoneims.com/resources',
    markers: [
      ['/resources/solar-ups-hub', 'Solar/UPS Hub link'],
      ['from-green-900/50 to-emerald-800/30', 'Quick Access green card'],
    ],
  },
  {
    name: 'Generator Oracle page',
    url: 'https://emersoneims.com/generator-oracle',
    markers: [
      ['Generator Oracle', 'Title'],
    ],
  },
];

for (const p of probes) {
  const r = await fetch(p.url);
  const sha = r.headers.get('x-app-commit');
  const h = await r.text();
  console.log('---');
  console.log('PAGE:', p.name);
  console.log('  url:', p.url);
  console.log('  status:', r.status, 'bytes:', h.length, 'sha:', sha?.slice(0, 12));
  for (const [needle, label] of p.markers) {
    const count = (h.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    console.log('  ' + label + ': count=' + count + (count > 0 ? '  OK' : '  MISSING'));
  }
}
