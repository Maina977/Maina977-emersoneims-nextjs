// Live audit probe: capture HTTP status, headers, x-vercel-id, cache headers
// for the routes and APIs required by the production sign-off.
//
// Usage: node scripts/probeLiveAudit.mjs

const BASE = 'https://emersoneims.com';

const TARGETS = [
  { method: 'GET',  path: '/' },
  { method: 'GET',  path: '/resources' },
  { method: 'GET',  path: '/resources/solar-ups-hub' },
  { method: 'GET',  path: '/services/hospital-incinerators' },
  { method: 'GET',  path: '/generator-oracle' },
  { method: 'GET',  path: '/api/building/comprehensive-report' },
  { method: 'GET',  path: '/api/building/floor-plan' },
  { method: 'GET',  path: '/api/building/model-3d' },
  { method: 'POST', path: '/api/generator-oracle/integrated-diagnose',
    body: JSON.stringify({}), headers: { 'content-type': 'application/json' } },
];

const HEADERS_OF_INTEREST = [
  'cache-control',
  'x-vercel-id',
  'x-vercel-cache',
  'age',
  'x-app-commit',
  'x-vercel-deployment-url',
  'x-matched-path',
  'content-type',
  'server',
];

function pickHeaders(h) {
  const out = {};
  for (const k of HEADERS_OF_INTEREST) {
    const v = h.get(k);
    if (v !== null) out[k] = v;
  }
  return out;
}

(async () => {
  for (const t of TARGETS) {
    const url = BASE + t.path;
    const t0 = Date.now();
    try {
      const res = await fetch(url, {
        method: t.method,
        body: t.body,
        headers: {
          'user-agent': 'eims-audit-probe/1.0',
          ...(t.headers || {}),
        },
        redirect: 'manual',
      });
      const ms = Date.now() - t0;
      const headers = pickHeaders(res.headers);
      let bodyPreview = '';
      try {
        const text = await res.text();
        bodyPreview = text.length > 240 ? text.slice(0, 240) + '…' : text;
        bodyPreview = bodyPreview.replace(/\s+/g, ' ');
      } catch { /* ignore */ }
      console.log(JSON.stringify({
        method: t.method, url, status: res.status, ms, headers, bodyPreview,
      }));
    } catch (err) {
      console.log(JSON.stringify({ method: t.method, url, error: String(err) }));
    }
  }
})();
