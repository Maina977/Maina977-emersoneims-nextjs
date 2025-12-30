/*
  Probes a single route on a running Next.js server and prints:
  - status
  - content-type
  - response size
  - whether it looks like App Router (__next_f) or Pages Router (__NEXT_DATA__)
  - whether HTML contains common error markers

  Usage:
    node scripts/probeJson.mjs

  Optional env:
    BASE_URL=http://127.0.0.1:3010 ROUTE=/about-us node scripts/probeJson.mjs
*/

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3010';
const route = process.env.ROUTE || '/about-us';

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
    return {
      ok: true,
      status: res.status,
      headers: res.headers,
      text,
    };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

const url = new URL(route, baseUrl).toString();
const result = await fetchWithTimeout(url, 20_000);

if (!result.ok) {
  const msg = result.error?.name === 'AbortError' ? 'TIMEOUT' : String(result.error);
  console.log(`${route} ERROR ${msg}`);
  process.exitCode = 1;
} else {
  const bytes = Buffer.byteLength(result.text, 'utf8');
  const contentType = result.headers.get('content-type') || '';
  const hasNextData = result.text.includes('__NEXT_DATA__');
  const hasNextF = result.text.includes('__next_f');
  const err = hasErrorMarkers(result.text);

  console.log(`${route} ${result.status} contentType=${contentType} bytes=${bytes} __NEXT_DATA__=${hasNextData} __next_f=${hasNextF} errorMarkup=${err}`);
}
