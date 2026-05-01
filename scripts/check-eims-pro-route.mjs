/**
 * Local audit: GET /eims-pro (must run while `next dev` / `next start` is running).
 * Uses a browser-like User-Agent so middleware bot rules do not fake a failure.
 *
 * Usage: npm run verify:eims
 * Optional: PORT=3010 node scripts/check-eims-pro-route.mjs
 */
const port = process.env.PORT || process.env.EIMS_VERIFY_PORT || '3010';
const base = process.env.EIMS_VERIFY_BASE || `http://127.0.0.1:${port}`;
const url = `${base.replace(/\/$/, '')}/eims-pro`;

const res = await fetch(url, {
  redirect: 'manual',
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    accept: 'text/html,application/xhtml+xml',
  },
});

const body = await res.text();
const looksLikeNextNotFound =
  res.status === 404 ||
  /This page could not be found|404: This page could not be found/i.test(
    body.slice(0, 4000),
  );
const ok = res.status === 200 && !looksLikeNextNotFound;

console.log(`GET ${url} -> ${res.status} ${ok ? 'OK' : 'FAIL'}`);
if (!ok) {
  console.error('Expected HTTP 200 HTML document for /eims-pro. Start Next on this port and rebuild if you moved the route.');
  process.exit(1);
}
