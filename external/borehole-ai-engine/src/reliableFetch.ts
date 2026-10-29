/**
 * Reliable access to AquaScan's public scientific sources (2026-10-29).
 *
 * Open-Meteo (ERA5 / ERA5-Land and the GRACE-FO storage proxy built from it),
 * NASA POWER and ORNL MODIS answered on one run and not the next (HTTP 429
 * rate limits and timeouts), so the same site could give different results.
 * Every GET to those hosts now goes through the site's data relay
 * (app/api/borehole/data-relay), which retries with back-off and caches each
 * answer for a day; if the relay cannot be reached, the source is called
 * directly with retries. Answers are also kept for the browser session, so
 * repeat analyses use identical data. Nothing else is intercepted, and the
 * data is passed through unchanged.
 */

const HOSTS = new Set(['archive-api.open-meteo.com', 'api.open-meteo.com', 'power.larc.nasa.gov', 'modis.ornl.gov', 'rest.isric.org', 'ggis.un-igrac.org']);
const RELAY = '/api/borehole/data-relay?u=';

type Answer = { status: number; type: string; body: string };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let installed = false;

export function installReliableFetch(): void {
  if (installed || typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  installed = true;
  const orig = window.fetch.bind(window);
  const session = new Map<string, Promise<Answer>>();

  const read = async (r: Response): Promise<Answer> => ({ status: r.status, type: r.headers.get('content-type') || 'application/json', body: await r.text() });

  async function load(url: string): Promise<Answer> {
    // 1) The relay (server-side retries and a one-day cache).
    for (let a = 0; a < 2; a++) {
      try {
        const r = await orig(RELAY + encodeURIComponent(url), { signal: AbortSignal.timeout(90_000) });
        if (r.ok) return read(r);
        if (r.status === 400 || r.status === 404) break; // relay missing or refused: go direct
        if (r.status < 500 && r.status !== 429) return read(r); // the source's own answer
      } catch { /* relay unreachable: retry once, then go direct */ }
    }
    // 2) Direct, with retries on rate limits, server errors and timeouts.
    let last: Answer = { status: 503, type: 'application/json', body: '{"error":"source did not answer"}' };
    for (let a = 0; a < 3; a++) {
      try {
        const r = await orig(url, { signal: AbortSignal.timeout(30_000) });
        last = await read(r);
        if (r.ok || (r.status !== 429 && r.status < 500)) return last;
      } catch { /* timeout or network error */ }
      await sleep(1000 * 2 ** a);
    }
    return last;
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
      p = load(key);
      session.set(key, p);
      p.then((v) => { if (v.status !== 200) session.delete(key); }, () => session.delete(key));
    }
    const v = await p;
    return new Response(v.body, { status: v.status, headers: { 'Content-Type': v.type } });
  }) as typeof window.fetch;
}
