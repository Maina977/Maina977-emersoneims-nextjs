// Production-server content assertions for the Solar & UPS Intelligence Hub.
// Probes a list of routes and validates required/forbidden substrings.
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3020';

const checks = [
  {
    path: '/',
    must: ['Solar &amp; UPS Intelligence Hub', 'href="/hub"', 'href="/hub/simulator"'],
    mustNot: ['EmersonEIMS Hub', 'Engineering Hub'],
  },
  {
    path: '/hub',
    must: [
      'Solar &amp; UPS Intelligence Hub',
      'Breadcrumb',
      'Resources',
      'Smart Sizing Simulator',
      'Quotation Audit',
      'Product Intelligence',
      'Safety &amp; Diagnostics',
      'Library',
    ],
    mustNot: ['EmersonEIMS Hub', '12,400'],
  },
  {
    path: '/hub/simulator',
    must: [
      'Smart Sizing Simulator',
      'Support margin',
      'Battery charging draw',
      'Priority loads',
      'Critical (0 ms transfer)',
      'Solar &amp; UPS Intelligence Hub',
      'Breadcrumb',
    ],
    mustNot: [],
  },
  {
    path: '/hub/quote-audit',
    must: [
      'Quotation Audit',
      'Scope coverage',
      'Premium',
      'Balanced',
      'Budget-safe',
      'Vague line item',
      'Potentially misleading',
      'Solar &amp; UPS Intelligence Hub',
    ],
    mustNot: [],
  },
  {
    path: '/hub/product-intelligence',
    must: [
      'Product Intelligence',
      'authenticity workflow',
      'Manufacturer seal',
      'Tamper labels',
      'Authorised dealer',
      'premium',
      'balanced',
      'budget',
      'Solar &amp; UPS Intelligence Hub',
    ],
    mustNot: [],
  },
  {
    path: '/hub/diagnostics',
    must: ['Safety &amp; Diagnostics', 'Next service', 'Solar &amp; UPS Intelligence Hub'],
    mustNot: [],
  },
  {
    path: '/hub/solar-ups',
    must: ['Solar PV', 'UPS systems', 'Solar &amp; UPS Intelligence Hub', 'Breadcrumb'],
    mustNot: [],
  },
  {
    path: '/hub/library',
    must: ['Documentation, Training', 'Solar &amp; UPS Intelligence Hub', 'Breadcrumb'],
    mustNot: [],
  },
  {
    path: '/resources',
    must: [],
    mustNot: [],
  },
];

let failures = 0;
for (const c of checks) {
  const url = BASE + c.path;
  let body = '';
  let status = 0;
  try {
    const r = await fetch(url);
    status = r.status;
    body = await r.text();
  } catch (e) {
    console.log(`ERR  ${c.path}  ${e.message}`);
    failures++;
    continue;
  }
  const missing = c.must.filter((s) => !body.includes(s));
  const forbidden = c.mustNot.filter((s) => body.includes(s));
  const ok = status === 200 && missing.length === 0 && forbidden.length === 0;
  if (!ok) failures++;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'}  ${status}  ${c.path}  bytes=${body.length}` +
      (missing.length ? `  MISS=${JSON.stringify(missing)}` : '') +
      (forbidden.length ? `  BAD=${JSON.stringify(forbidden)}` : ''),
  );
}
console.log(`\nTotal failures: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
