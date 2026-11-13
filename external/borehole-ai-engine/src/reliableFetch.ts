/**
 * Reliable access to AquaScan's public scientific sources (2026-10-29).
 *
 * Open-Meteo (ERA5 / ERA5-Land and the GRACE-FO storage proxy built from it),
 * NASA POWER and ORNL MODIS answered on one run and not the next (HTTP 429
 * rate limits and timeouts), so the same site could give different results.
 * Every GET to those hosts now goes through the site's data relay
 * (app/api/borehole/data-relay), which retries with back-off and caches each
 * answer for a day; if the relay cannot be reached, the source is called
 * directly. Answers are also kept for the browser session, so repeat analyses
 * use identical data. Nothing else is intercepted, and the data is passed
 * through unchanged.
 *
 * 2026-11-13 (measured root cause of 4-minute analyses): when a source was
 * down (ISRIC SoilGrids: relay 502 after 50-72 s, direct calls aborted at
 * 30 s), each request was retried twice through the relay, which had already
 * retried it, and then three more times directly: up to ~4.5 minutes per
 * request, and every SoilGrids request paid it again. Now:
 *   - an answer from the relay is final (the relay has done the retrying);
 *     the source is called directly only when the relay itself is unreachable;
 *   - a source that has failed is skipped for 5 minutes, so one outage costs
 *     one wait, not one per request. Its callers get an error and report the
 *     data as unavailable, as they already do for any failed request.
 */

const HOSTS = new Set(['archive-api.open-meteo.com', 'api.open-meteo.com', 'power.larc.nasa.gov', 'modis.ornl.gov', 'rest.isric.org', 'ggis.un-igrac.org']);
const RELAY = '/api/borehole/data-relay?u=';
const RELAY_TIMEOUT_MS = 65_000; // the relay function stops at 60 s
const DIRECT_TIMEOUT_MS = 30_000;
const HOST_DOWN_MS = 5 * 60_000;

type Answer = { status: number; type: string; body: string };
let installed = false;

/** True when an answer means the source is down or refusing (not a bad request). */
export function isOutage(status: number): boolean {
  return status === 429 || status >= 500;
}

export function installReliableFetch(): void {
  if (installed || typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  installed = true;
  const orig = window.fetch.bind(window);
  const session = new Map<string, Promise<Answer>>();
  const downUntil = new Map<string, number>();

  const read = async (r: Response): Promise<Answer> => ({ status: r.status, type: r.headers.get('content-type') || 'application/json', body: await r.text() });

  async function load(url: string): Promise<Answer> {
    // 1) The relay (server-side retries and a one-day cache). Its answer is final.
    try {
      const r = await orig(RELAY + encodeURIComponent(url), { signal: AbortSignal.timeout(RELAY_TIMEOUT_MS) });
      // 400/404: the relay is missing or refused the URL; anything else is the source's answer.
      if (r.status !== 400 && r.status !== 404) return read(r);
    } catch { /* relay unreachable: go direct */ }
    // 2) Direct, one attempt.
    try {
      return await read(await orig(url, { signal: AbortSignal.timeout(DIRECT_TIMEOUT_MS) }));
    } catch {
      return { status: 503, type: 'application/json', body: '{"error":"source did not answer"}' };
    }
  }

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = (init?.method || (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();
    let u: URL;
    try { u = new URL(url, window.location.href); } catch { return orig(input, init); }
    if (method !== 'GET' || u.protocol !== 'https:' || !HOSTS.has(u.hostname)) return orig(input, init);
    const key = u.href;
    let p = session.get(key);
    if (!p) {
      if ((downUntil.get(u.hostname) ?? 0) > Date.now()) {
        return new Response('{"error":"source unavailable (failed in the last 5 minutes)"}', { status: 503, headers: { 'Content-Type': 'application/json' } });
      }
      p = load(key);
      session.set(key, p);
      p.then((v) => {
        if (v.status !== 200) session.delete(key);
        if (isOutage(v.status)) downUntil.set(u.hostname, Date.now() + HOST_DOWN_MS);
      }, () => session.delete(key));
    }
    const v = await p;
    return new Response(v.body, { status: v.status, headers: { 'Content-Type': v.type } });
  }) as typeof window.fetch;
}
