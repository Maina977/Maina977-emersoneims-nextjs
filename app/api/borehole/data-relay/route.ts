/**
 * Data relay for AquaScan's public scientific sources (2026-10-29).
 *
 * Open-Meteo (ERA5 / ERA5-Land, including the GRACE-FO storage proxy), NASA
 * POWER and the ORNL MODIS service rate-limit bursts of large requests (HTTP
 * 429) and sometimes time out. Called straight from the browser, a source
 * answered on one run and not the next, so the same site gave different
 * results. This relay:
 *   - accepts only those four hosts over https (no open proxy),
 *   - retries 429 / 5xx / timeouts with back-off (honouring Retry-After),
 *   - caches each successful answer for a day, in memory and at the CDN,
 *     so the same request gets the same data every time.
 * It changes no data: the body is passed through exactly as the source sent it.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_HOSTS = new Set([
  'archive-api.open-meteo.com',
  'api.open-meteo.com',
  'power.larc.nasa.gov',
  'modis.ornl.gov',
]);
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;
const cache = new Map<string, { at: number; status: number; type: string; body: string }>();
const inflight = new Map<string, Promise<{ status: number; type: string; body: string }>>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string): Promise<{ status: number; type: string; body: string }> {
  let last: { status: number; type: string; body: string } = { status: 502, type: 'application/json', body: '{"error":"source did not answer"}' };
  // All attempts fit inside the function's 60 s limit (ORNL MODIS can take 30-60 s).
  const deadline = Date.now() + 55_000;
  for (let attempt = 0; attempt < 4; attempt++) {
    const left = deadline - Date.now();
    if (left < 3_000) break;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(left), headers: { 'User-Agent': 'EmersonEIMS-AquaScan/1.0 (+https://emersoneims.com)' } });
      const body = await res.text();
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
    if (!p) { p = fetchWithRetry(key); inflight.set(key, p); }
    try { out = { at: Date.now(), ...(await p) }; } finally { inflight.delete(key); }
    if (out.status === 200) {
      if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
      cache.set(key, out);
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
