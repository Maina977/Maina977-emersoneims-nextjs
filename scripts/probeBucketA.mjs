// Live deployment marker probe for commit 6d0139d.
// Hits production routes, looks for content unique to Bucket A.
const BASE = process.env.BASE_URL || 'https://emersoneims.com';

const PROBES = [
  {
    route: '/',
    markers: [
      'EmersonEIMS serves',
      'commercial, industrial, healthcare, telecom',
      'solar-ups-hub-teaser',
      'Solar / UPS Hub',
      '/resources/solar-ups-hub',
    ],
  },
  {
    route: '/resources',
    markers: [
      'EmersonEIMS serves',
      'Solar / UPS Hub',
      '/resources/solar-ups-hub',
      'Solar + UPS resource hub',
    ],
  },
  {
    route: '/resources/solar-ups-hub',
    markers: ['EmersonEIMS serves', 'Solar', 'UPS', 'hub'],
  },
  {
    route: '/services/hospital-incinerators',
    markers: ['EmersonEIMS serves', 'Hospital', 'Incinerator'],
  },
  {
    route: '/generator-oracle',
    markers: ['EmersonEIMS serves', 'Generator Oracle'],
  },
];

(async () => {
  for (const p of PROBES) {
    const url = BASE + p.route;
    try {
      const r = await fetch(url, { redirect: 'manual' });
      const headers = r.headers;
      const status = r.status;
      const loc = headers.get('location') || '';
      const age = headers.get('age') || '';
      const xv = headers.get('x-vercel-id') || '';
      const xc = headers.get('x-vercel-cache') || '';
      const cc = headers.get('cache-control') || '';
      let body = '';
      try { body = await r.text(); } catch {}
      console.log(`=== ${p.route} ===`);
      console.log(`  status=${status} loc=${loc} age=${age} cache=${xc} vid=${xv}`);
      console.log(`  cc=${cc}`);
      console.log(`  bytes=${body.length}`);
      for (const m of p.markers) {
        console.log(`  ${body.includes(m) ? 'FOUND ' : 'MISS  '} ${m}`);
      }
    } catch (e) {
      console.log(`=== ${p.route} === ERR ${e.message}`);
    }
  }
})();
