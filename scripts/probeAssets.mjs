/*
  Probe a route and then probe all referenced JS/CSS assets.

  This catches the classic case where HTML is 200 but the page "fails" because
  one or more /_next/static assets are 404/500 (blank page in browser).

  Usage:
    node scripts/probeAssets.mjs

  Optional env:
    BASE_URL=http://127.0.0.1:3010 ROUTE=/diagnostic-suite node scripts/probeAssets.mjs
*/

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3010';
const route = process.env.ROUTE || '/';

const ERROR_MARKERS = [
  'Something went wrong',
  'Application error',
  'ErrorBoundary',
  '__NEXT_ERROR__',
];

function hasErrorMarkers(text) {
  return ERROR_MARKERS.some((m) => text.includes(m));
}

function uniq(arr) {
  return [...new Set(arr)];
}

function extractAssetUrls(html) {
  const urls = [];

  // scripts
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    urls.push(m[1]);
  }

  // stylesheets
  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi)) {
    urls.push(m[1]);
  }

  // preload as script/style
  for (const m of html.matchAll(/<link[^>]+rel=["']preload["'][^>]*>/gi)) {
    const tag = m[0];
    const href = /href=["']([^"']+)["']/.exec(tag)?.[1];
    const as = /\sas=["']([^"']+)["']/.exec(tag)?.[1];
    if (href && (as === 'script' || as === 'style')) urls.push(href);
  }

  return uniq(urls);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: controller.signal });
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, status: res.status, headers: res.headers, bytes: buf.length };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

function resolveUrl(u) {
  try {
    return new URL(u, baseUrl).toString();
  } catch {
    return null;
  }
}

const pageUrl = new URL(route, baseUrl).toString();
const pageRes = await fetchWithTimeout(pageUrl, 20_000);

if (!pageRes.ok) {
  const msg = pageRes.error?.name === 'AbortError' ? 'TIMEOUT' : String(pageRes.error);
  console.log(`PAGE ${route} ERROR ${msg}`);
  process.exitCode = 1;
} else {
  // Refetch as text to parse assets
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  let html;
  try {
    const res = await fetch(pageUrl, { redirect: 'follow', signal: controller.signal });
    html = await res.text();
    const ct = res.headers.get('content-type') || '';
    console.log(`PAGE ${route} status=${res.status} contentType=${ct} bytes=${Buffer.byteLength(html, 'utf8')} errorMarkup=${hasErrorMarkers(html)}`);
    const hasCspMeta = /http-equiv=["']Content-Security-Policy["']/i.test(html);
    console.log(`PAGE metaCSP=${hasCspMeta} __next_f=${html.includes('__next_f')} __NEXT_DATA__=${html.includes('__NEXT_DATA__')}`);
  } finally {
    clearTimeout(timeout);
  }

  const assetUrls = extractAssetUrls(html);
  const resolved = assetUrls
    .map(resolveUrl)
    .filter(Boolean);

  const nextAssets = resolved.filter((u) => u.includes('/_next/'));
  console.log(`ASSETS total=${resolved.length} next=${nextAssets.length}`);

  let bad = 0;
  for (const u of resolved) {
    const r = await fetchWithTimeout(u, 20_000);
    if (!r.ok) {
      bad++;
      const msg = r.error?.name === 'AbortError' ? 'TIMEOUT' : String(r.error);
      console.log(`ASSET ERROR ${msg} url=${u}`);
      continue;
    }

    const ct = r.headers.get('content-type') || '';
    const ok = r.status >= 200 && r.status < 400;
    if (!ok) bad++;
    console.log(`ASSET ${r.status} bytes=${r.bytes} contentType=${ct} url=${u}`);
  }

  if (bad > 0) {
    console.log(`RESULT FAIL badAssets=${bad}`);
    process.exitCode = 2;
  } else {
    console.log('RESULT OK allAssetsFetched');
  }
}
