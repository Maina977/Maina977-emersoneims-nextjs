/**
 * Server-side Nominatim (OpenStreetMap geocoding) client, following the
 * public-API usage policy (https://operations.osmfoundation.org/policies/nominatim/):
 *
 * - Identification. The User-Agent names the application and its website.
 *   (Before 2026-11-14 the code used a personal mailbox, and browsers called
 *   the API directly, where no User-Agent can be set.)
 * - At most 1 request per second, application-wide. Every lookup claims a
 *   single database slot row; without a database, one queue per server instance.
 * - Results are cached (database, 30 days, shared; plus an in-memory copy).
 * - Single lookups only. No bulk searches, harvesting or autocomplete. Callers
 *   enforce that with per-visitor limits (see /api/geocode).
 *
 * Outcomes are kept apart:
 * - OK: matches found;
 * - NO MATCH FOUND: Nominatim answered with nothing;
 * - SERVICE UNAVAILABLE: no answer, rate slot busy, or upstream error.
 *
 * Data © OpenStreetMap contributors, ODbL 1.0.
 */
import { getPostgresPool } from '@/lib/db';

export const NOMINATIM_USER_AGENT = 'EmersonEIMS-website/1.0 (+https://www.emersoneims.com)';
export const NOMINATIM_REFERER = 'https://www.emersoneims.com/';
export const OSM_GEOCODE_ATTRIBUTION = 'Geocoding © OpenStreetMap contributors (ODbL), Nominatim';
const BASE = 'https://nominatim.openstreetmap.org';
const CACHE_DAYS = 30;

export type GeocodeStatus = 'OK' | 'NO MATCH FOUND' | 'SERVICE UNAVAILABLE';
export interface GeocodeResult<T> { status: GeocodeStatus; data: T | null; cached: boolean; reason?: string }

// ---------------------------------------------------------------- cache
const memory = new Map<string, { at: number; body: unknown }>();
const MEMORY_MAX = 500;
function memGet(key: string) {
  const hit = memory.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > CACHE_DAYS * 86400e3) { memory.delete(key); return undefined; }
  return hit.body;
}
function memSet(key: string, body: unknown) {
  if (memory.size >= MEMORY_MAX) memory.delete(memory.keys().next().value as string);
  memory.set(key, { at: Date.now(), body });
}

type Pool = NonNullable<Awaited<ReturnType<typeof getPostgresPool>>>;
// Database problems are logged once per instance (message only, never the
// query text, which is what a visitor typed).
const warned = new Set<string>();
function warnOnce(what: string, e: unknown) {
  if (warned.has(what)) return;
  warned.add(what);
  console.warn(`[geocode] database ${what} failed; continuing without it:`, e instanceof Error ? e.message : String(e));
}
let tablesReady: Promise<boolean> | null = null;
async function pool(): Promise<Pool | null> {
  // Database only on Vercel deployments: a local .env can hold the production
  // database, and local runs/tests must not write to it (same rule as lib/env/liveDelivery).
  if (!process.env.VERCEL_ENV) return null;
  const p = await getPostgresPool().catch(() => null);
  if (!p) return null;
  tablesReady ??= p.query(`
    CREATE TABLE IF NOT EXISTS geocode_cache (key TEXT PRIMARY KEY, body JSONB NOT NULL, at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS nominatim_slot (id INT PRIMARY KEY, last_at TIMESTAMPTZ NOT NULL);
    INSERT INTO nominatim_slot (id, last_at) VALUES (1, 'epoch') ON CONFLICT (id) DO NOTHING;
  `).then(() => true, (e) => { warnOnce('setup', e); return false; });
  return (await tablesReady) ? p : null;
}

// ---------------------------------------------------------------- 1 req/s
let localChain: Promise<void> = Promise.resolve();
let localLast = 0;
/** Waits for this instance's turn (no database): 1.1 s spacing. */
function localSlot(maxWaitMs: number): Promise<boolean> {
  const turn = localChain.then(async () => {
    const wait = Math.max(0, localLast + 1100 - Date.now());
    if (wait > maxWaitMs) return false;
    if (wait) await new Promise((r) => setTimeout(r, wait));
    localLast = Date.now();
    return true;
  });
  localChain = turn.then(() => undefined, () => undefined);
  return turn;
}
/** Claims the application-wide slot: at most one Nominatim request per second. */
async function claimSlot(p: Pool | null, maxWaitMs = 3000): Promise<boolean> {
  if (!p) return localSlot(maxWaitMs);
  const until = Date.now() + maxWaitMs;
  for (;;) {
    try {
      const r = await p.query(
        `UPDATE nominatim_slot SET last_at = clock_timestamp()
           WHERE id = 1 AND last_at <= clock_timestamp() - INTERVAL '1100 milliseconds'
         RETURNING 1`,
      );
      if (r.rows.length) return true;
    } catch {
      return localSlot(Math.max(0, until - Date.now()));
    }
    if (Date.now() + 300 > until) return false;
    await new Promise((res) => setTimeout(res, 300));
  }
}

// ---------------------------------------------------------------- request
async function lookup<T>(kind: 'search' | 'reverse', params: Record<string, string>, fetchImpl: typeof fetch): Promise<GeocodeResult<T>> {
  // Classic 'json' format: the same fields the browser callers used before (class, type, boundingbox…).
  const qs = new URLSearchParams({ ...params, format: 'json' });
  const key = `${kind}?${[...qs.entries()].sort().map(([k, v]) => `${k}=${v}`).join('&')}`;

  const mem = memGet(key);
  if (mem !== undefined) return classify<T>(kind, mem, true);
  const p = await pool();
  if (p) {
    try {
      const r = await p.query(`SELECT body FROM geocode_cache WHERE key = $1 AND at > NOW() - INTERVAL '${CACHE_DAYS} days'`, [key]);
      if (r.rows.length) { memSet(key, r.rows[0].body); return classify<T>(kind, r.rows[0].body, true); }
    } catch (e) { warnOnce('cache-read', e); /* cache is best-effort */ }
  }

  if (!(await claimSlot(p))) {
    return { status: 'SERVICE UNAVAILABLE', data: null, cached: false, reason: 'Geocoding is busy (shared 1 request per second limit); try again in a moment.' };
  }
  try {
    const res = await fetchImpl(`${BASE}/${kind}?${qs}`, {
      headers: { 'User-Agent': NOMINATIM_USER_AGENT, Referer: NOMINATIM_REFERER, 'Accept-Language': params['accept-language'] || 'en' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: 'SERVICE UNAVAILABLE', data: null, cached: false, reason: `Nominatim HTTP ${res.status}` };
    const body = await res.json();
    memSet(key, body);
    // Awaited (Release 4.1): on Vercel a function can be frozen as soon as the
    // response is sent, so the fire-and-forget write of Release 4 was lost and
    // other instances never found the shared copy (seen live 2026-11-14).
    if (p) {
      try {
        await p.query(`INSERT INTO geocode_cache (key, body, at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET body = EXCLUDED.body, at = NOW()`, [key, JSON.stringify(body)]);
      } catch (e) { warnOnce('cache-write', e); }
    }
    return classify<T>(kind, body, false);
  } catch (e) {
    return { status: 'SERVICE UNAVAILABLE', data: null, cached: false, reason: e instanceof Error ? e.message : 'Nominatim did not answer' };
  }
}

function classify<T>(kind: 'search' | 'reverse', body: unknown, cached: boolean): GeocodeResult<T> {
  if (kind === 'search') {
    if (!Array.isArray(body)) return { status: 'SERVICE UNAVAILABLE', data: null, cached, reason: 'Unexpected Nominatim answer' };
    return body.length ? { status: 'OK', data: body as T, cached } : { status: 'NO MATCH FOUND', data: body as T, cached };
  }
  const b = body as { error?: string; lat?: string } | null;
  if (!b || typeof b !== 'object') return { status: 'SERVICE UNAVAILABLE', data: null, cached, reason: 'Unexpected Nominatim answer' };
  return b.error || !b.lat ? { status: 'NO MATCH FOUND', data: null, cached, reason: b.error } : { status: 'OK', data: body as T, cached };
}

export interface SearchOptions { limit?: number; countrycodes?: string; acceptLanguage?: string; addressdetails?: boolean; fetchImpl?: typeof fetch }

/** Forward geocoding: one place-name lookup (max 10 results). */
export function geocodeSearch<T = Array<Record<string, unknown>>>(q: string, o: SearchOptions = {}) {
  const params: Record<string, string> = { q: q.trim().slice(0, 200), limit: String(Math.max(1, Math.min(10, o.limit ?? 5))), addressdetails: o.addressdetails === false ? '0' : '1', 'accept-language': o.acceptLanguage || 'en' };
  if (o.countrycodes && /^[a-z]{2}(,[a-z]{2})*$/i.test(o.countrycodes)) params.countrycodes = o.countrycodes.toLowerCase();
  return lookup<T>('search', params, o.fetchImpl ?? fetch);
}

/** Reverse geocoding: coordinates → address (coordinates rounded to ~11 m so nearby lookups share the cache). */
export function geocodeReverse<T = Record<string, unknown>>(lat: number, lon: number, o: { zoom?: number; acceptLanguage?: string; fetchImpl?: typeof fetch } = {}) {
  const params: Record<string, string> = { lat: lat.toFixed(4), lon: lon.toFixed(4), zoom: String(Math.max(3, Math.min(18, Math.round(o.zoom ?? 18)))), addressdetails: '1', 'accept-language': o.acceptLanguage || 'en' };
  return lookup<T>('reverse', params, o.fetchImpl ?? fetch);
}

/** Test hook. */
export function _resetNominatimForTests() { memory.clear(); localLast = 0; localChain = Promise.resolve(); tablesReady = null; warned.clear(); }
