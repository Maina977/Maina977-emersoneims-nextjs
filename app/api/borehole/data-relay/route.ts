/**
 * Data relay for AquaScan's public scientific sources (2026-10-29).
 *
 * Open-Meteo (ECMWF IFS / ERA5 / ERA5-Land), NASA POWER, the ORNL MODIS
 * service, ISRIC SoilGrids and IGRAC GGIS rate-limit bursts of large requests
 * (HTTP 429) and sometimes time out. Called straight from the browser, a source
 * answered on one run and not the next, so the same site gave different
 * results. This relay:
 *   - accepts only the hosts listed below, over https (no open proxy),
 *   - retries 429 / 5xx / timeouts with back-off (honouring Retry-After),
 *   - caches each successful answer for a day, in memory and at the CDN,
 *     so the same request gets the same data every time.
 * It changes no data: the body is passed through exactly as the source sent it.
 */
import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';

// One analysis makes about 50 relay calls (measured 2026-10-31): room for an office.
const RELAY_UPSTREAM_PER_MIN = 300;

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_HOSTS = new Set([
  'archive-api.open-meteo.com',
  'api.open-meteo.com',
  'power.larc.nasa.gov',
  'modis.ornl.gov',
  'rest.isric.org', // SoilGrids (2026-10-29 audit: aborted on every run, so soil was always Unknown)
  'ggis.un-igrac.org', // IGRAC GGIS groundwater wells (WFS)
]);
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;
// Memory bounds: 40 MB of cached bodies in all, none over 4 MB cached, and
// nothing over 15 MB relayed (the largest real answer, 20 years of daily
// rainfall from two models, is about 0.5 MB).
const MAX_CACHE_BYTES = 40 * 1024 * 1024;
const MAX_CACHED_BODY = 4 * 1024 * 1024;
const MAX_BODY = 15 * 1024 * 1024;
let cacheBytes = 0;
const cache = new Map<string, { at: number; status: number; type: string; body: string }>();
const inflight = new Map<string, Promise<{ status: number; type: string; body: string }>>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Open-Meteo's free API is for non-commercial use only. With a paid plan the
// same requests go to its customer-* hosts with the key, which stays here on
// the server (set OPEN_METEO_API_KEY). Without a key nothing changes.
const OPEN_METEO_KEY = process.env.OPEN_METEO_API_KEY?.trim();
function upstreamUrl(u: URL, useKey: boolean): string {
  if (!useKey || !OPEN_METEO_KEY || !u.hostname.endsWith('open-meteo.com') || u.hostname.startsWith('customer-')) return u.toString();
  const x = new URL(u.toString());
  x.hostname = `customer-${u.hostname}`;
  x.searchParams.set('apikey', OPEN_METEO_KEY);
  return x.toString();
}

async function fetchWithRetry(url: string): Promise<{ status: number; type: string; body: string }> {
  let last: { status: number; type: string; body: string } = { status: 502, type: 'application/json', body: '{"error":"source did not answer"}' };
  // All attempts fit inside the function's 60 s limit (ORNL MODIS can take 30-60 s).
  const deadline = Date.now() + 55_000;
  for (let attempt = 0; attempt < 4; attempt++) {
    const left = deadline - Date.now();
    if (left < 3_000) break;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(left), headers: { 'User-Agent': 'EmersonEIMS-AquaScan/1.0 (+https://emersoneims.com)' } });
      const declared = Number(res.headers.get('content-length'));
      if (Number.isFinite(declared) && declared > MAX_BODY) return { status: 502, type: 'application/json', body: '{"error":"source answer too large to relay"}' };
      const body = await res.text();
      if (body.length > MAX_BODY) return { status: 502, type: 'application/json', body: '{"error":"source answer too large to relay"}' };
      last = { status: res.status, type: res.headers.get('content-type') || 'application/json', body };
      if (res.ok) return last;
      // Client errors other than rate limiting are final (a bad request stays bad).
      if (res.status !== 429 && res.status < 500) return last;
      const ra = Number(res.headers.get('retry-after'));
      await sleep(Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 10_000) : 1000 * 2 ** attempt);
    } catch {
      await sleep(1000 * 2 ** attempt); // timeout or network error
    }
  }
  return last;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('u') || '';
  let target: URL;
  try { target = new URL(raw); } catch { return NextResponse.json({ error: 'u must be a full URL' }, { status: 400 }); }
  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname) || target.username || target.password || target.port) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 400 });
  }
  const key = target.toString();
  const hit = cache.get(key);
  let out = hit && Date.now() - hit.at < DAY_MS ? hit : null;
  if (!out) {
    // Concurrent identical requests share one upstream call.
    let p = inflight.get(key);
    if (!p) {
      // Upstream calls (cache misses) are limited per client, so no one can
      // spend the sources' quotas or the paid key through this relay; one
      // analysis needs a few dozen (2026-10-30 audit).
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
      if (!limiter.check(RELAY_UPSTREAM_PER_MIN, `relay:${ip}`).success) {
        return NextResponse.json({ error: 'Too many requests; try again in a minute' }, { status: 429, headers: { 'Retry-After': '60' } });
      }
      // The paid key is used only for this site's own pages.
      const sameSite = req.headers.get('sec-fetch-site') === 'same-origin' || req.headers.get('sec-fetch-site') === 'same-site';
      p = fetchWithRetry(upstreamUrl(target, sameSite));
      inflight.set(key, p);
    }
    try { out = { at: Date.now(), ...(await p) }; } finally { inflight.delete(key); }
    if (out.status === 200 && out.body.length <= MAX_CACHED_BODY) {
      const old = cache.get(key);
      if (old) { cacheBytes -= old.body.length; cache.delete(key); }
      // Oldest entries go first until the new one fits.
      while (cache.size > 0 && (cache.size >= MAX_ENTRIES || cacheBytes + out.body.length > MAX_CACHE_BYTES)) {
        const oldestKey = cache.keys().next().value as string;
        cacheBytes -= cache.get(oldestKey)!.body.length;
        cache.delete(oldestKey);
      }
      cache.set(key, out);
      cacheBytes += out.body.length;
    }
  }
  return new NextResponse(out.body, {
    status: out.status,
    headers: {
      'Content-Type': out.type,
      'Cache-Control': out.status === 200 ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' : 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
