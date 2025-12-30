/*
  Probes key routes on a running Next.js server and reports:
  - status code
  - whether HTML contains common error-boundary markers
  - response size

  Usage:
    node scripts/probeRoutes.mjs

  Optional env:
    BASE_URL=http://127.0.0.1:3010 node scripts/probeRoutes.mjs
*/

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3010';

const routes = [
  '/',
  '/about-us',
  '/brands',
  '/diagnostics',
  '/services',
  '/service',
  '/solution',
  '/solar',
  '/generators',
  '/diagnostic-suite',
  '/contact',
];

const ERROR_MARKERS = [
  'Something went wrong',
  'Application error',
  'ErrorBoundary',
  '__NEXT_ERROR__',
];

function hasErrorMarkers(text) {
  return ERROR_MARKERS.some((m) => text.includes(m));
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return { ok: true, status: res.status, text };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

for (const route of routes) {
  const url = new URL(route, baseUrl).toString();
  const result = await fetchWithTimeout(url, 20_000);

  if (!result.ok) {
    const msg = result.error?.name === 'AbortError' ? 'TIMEOUT' : String(result.error);
    console.log(`${route} ERROR ${msg}`);
    continue;
  }

  const bytes = Buffer.byteLength(result.text, 'utf8');
  const err = hasErrorMarkers(result.text);
  console.log(`${route} ${result.status} errorMarkup=${err} bytes=${bytes}`);
}
