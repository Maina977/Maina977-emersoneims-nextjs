/**
 * First-party web-analytics store.
 *
 * This module is the data/aggregation layer for a cookieless, first-party
 * analytics system feeding two API routes:
 *   - /api/analytics/collect  -> recordEvent()
 *   - /api/analytics/stats    -> getStats()
 *
 * It writes one row per event into `web_analytics_events` (PostgreSQL) and
 * aggregates entirely in SQL. Visitors are identified by a salted SHA-256
 * hash of (ip, ua) truncated to 16 hex chars — raw IP/UA are NEVER stored.
 *
 * Design rules:
 *  - Never fabricate numbers. If the DB is unavailable, recordEvent drops the
 *    event and getStats returns a fully-zeroed (but valid) shape.
 *  - Never throw. Both entry points always resolve to a valid object so the
 *    HTTP layer can respond deterministically.
 *  - Cookieless and bot-filtered.
 *
 * A Python consumer depends on the exact JSON shape of AnalyticsStats — do not
 * rename keys or change numeric coercion without updating that consumer.
 */

import crypto from 'crypto';
import { getPostgresPool } from '@/lib/db';

type Pool = NonNullable<Awaited<ReturnType<typeof getPostgresPool>>>;

export type AnalyticsEventInput = {
  // 'vitals' (added 2026-07-20) carries a Core Web Vitals sample. It reuses
  // the existing `label` column rather than requiring a migration — the value
  // is encoded as `<METRIC>:<value>`, e.g. "LCP:2340" (ms) or "CLS:0.042".
  // The `type` column is TEXT, so no schema change is needed.
  type: 'pageview' | 'click' | 'ping' | 'vitals';
  path: string;
  host?: string;
  ref?: string; // referrer hostname only
  label?: string; // click label (CTA text/href), vitals sample, '' otherwise
  ip: string;
  ua: string;
  // Geolocation derived from edge headers (Vercel) — NOT from the client. Empty
  // strings when unknown. For Kenya, `region` is the county-level subdivision.
  country?: string; // ISO-3166 alpha-2, e.g. 'KE'
  region?: string; // first-level subdivision (county/province), e.g. 'Nairobi'
  city?: string; // city / town, e.g. 'Mombasa'
};

export type AnalyticsStats = {
  generated_at: string; // ISO 8601 UTC
  window_days: number;
  totals: { views: number; clicks: number; visitors: number };
  today: { views: number; visitors: number };
  live_visitors: number; // distinct visitors with any event in last 300s
  series: Array<{ day: string; site: string; views: number; visitors: number }>;
  top_pages: Array<{ site: string; path: string; views: number; visitors: number }>;
  per_site: Array<{ site: string; views: number; visitors: number }>;
  top_clicks: Array<{ label: string; site: string; clicks: number }>;
  // Geo breakdowns (additive — older consumers ignore unknown keys safely).
  top_countries: Array<{ country: string; views: number; visitors: number }>;
  top_regions: Array<{ country: string; region: string; views: number; visitors: number }>;
  top_cities: Array<{ country: string; region: string; city: string; views: number; visitors: number }>;
  /**
   * Core Web Vitals from REAL visitors (field data), added 2026-07-20.
   * `p75` is the 75th percentile — the same statistic Google uses to grade a
   * page — so these are directly comparable to Search Console. Milliseconds
   * for LCP/INP/FCP/TTFB; CLS is unitless.
   * Empty until WebVitalsReporter has collected samples.
   */
  web_vitals: Array<{ metric: string; p75: number; samples: number }>;
};

const SALT = process.env.ANALYTICS_SALT || 'eims';

const BOT_RE =
  /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|pingdom|uptime|curl|wget|python-requests|facebookexternalhit|embedly/i;

// --- DDL guard (run once per process, but stay safe if it throws) ------------
let tableReady = false;

async function ensureTable(pool: Pool): Promise<void> {
  if (tableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS web_analytics_events (
      id      BIGSERIAL PRIMARY KEY,
      ts      BIGINT  NOT NULL,
      day     DATE    NOT NULL,
      site    TEXT    NOT NULL,
      host    TEXT,
      path    TEXT    NOT NULL,
      type    TEXT    NOT NULL,
      ref     TEXT,
      label   TEXT,
      visitor TEXT    NOT NULL,
      country TEXT,
      region  TEXT,
      city    TEXT
    );
    -- Backfill columns on tables created before geo was added. ADD COLUMN IF NOT
    -- EXISTS is a no-op when they already exist, so this is safe to run every boot.
    ALTER TABLE web_analytics_events ADD COLUMN IF NOT EXISTS country TEXT;
    ALTER TABLE web_analytics_events ADD COLUMN IF NOT EXISTS region  TEXT;
    ALTER TABLE web_analytics_events ADD COLUMN IF NOT EXISTS city    TEXT;
    CREATE INDEX IF NOT EXISTS ix_wae_day      ON web_analytics_events(day);
    CREATE INDEX IF NOT EXISTS ix_wae_site_day ON web_analytics_events(site, day);
    CREATE INDEX IF NOT EXISTS ix_wae_type_day ON web_analytics_events(type, day);
    CREATE INDEX IF NOT EXISTS ix_wae_path     ON web_analytics_events(path);
    CREATE INDEX IF NOT EXISTS ix_wae_ts       ON web_analytics_events(ts);
    CREATE INDEX IF NOT EXISTS ix_wae_country  ON web_analytics_events(country, day);
  `);
  // Only flip the guard after a successful DDL run so a transient failure
  // (e.g. DB briefly down) is retried on the next call.
  tableReady = true;
}

// --- Pure helpers ------------------------------------------------------------

export function isBot(ua: string): boolean {
  if (!ua || !ua.trim()) return true;
  return BOT_RE.test(ua);
}

export function siteOf(host: string | undefined | null): 'www' | 'power' | 'other' {
  const h = (host || '').toLowerCase();
  if (h.startsWith('power.') || h.includes('power.emersoneims')) return 'power';
  if (h.includes('emersoneims')) return 'www';
  return 'other';
}

export function visitorHash(ip: string, ua: string): string {
  return crypto
    .createHash('sha256')
    .update(`${SALT}|${ip}|${ua}`)
    .digest('hex')
    .slice(0, 16);
}

export function dayUTC(tsSeconds: number): string {
  return new Date(tsSeconds * 1000).toISOString().slice(0, 10);
}

/**
 * Normalize a geo header value: trim, cap length, and collapse the various
 * "unknown" sentinels Vercel/edges emit ('', 'XX', 'T1', 'Unknown') to ''.
 * Edge headers are sometimes percent-encoded (e.g. city 'Nairobi%20City'); we
 * decode best-effort so the stored value is human-readable.
 */
export function cleanGeo(value: string | undefined | null): string {
  if (!value) return '';
  let v = String(value).trim();
  if (!v) return '';
  try {
    v = decodeURIComponent(v);
  } catch {
    /* leave as-is if it isn't valid percent-encoding */
  }
  v = v.slice(0, 80);
  const upper = v.toUpperCase();
  if (upper === 'XX' || upper === 'T1' || upper === 'UNKNOWN') return '';
  return v;
}

// --- Google Sheets backend ---------------------------------------------------
//
// When there is NO Postgres pool but SHEET_WEBAPP_URL + SHEET_TOKEN are set, the
// store reads/writes through a Google Apps Script web app fronting a Sheet (see
// integrations/google-sheets/CONTRACT.md). Env is read at call time (not module
// load) so Vercel/runtime values are picked up reliably.

/** The normalized event row shipped to the Sheet (matches CONTRACT §2A). */
type SheetEvent = {
  ts: number;
  day: string;
  site: string;
  host: string;
  path: string;
  type: string;
  ref: string;
  label: string;
  visitor: string;
  country: string;
  region: string;
  city: string;
};

/** True when both Sheet env vars are present and non-empty. */
function sheetConfigured(): boolean {
  return Boolean(
    (process.env.SHEET_WEBAPP_URL || '').trim() &&
      (process.env.SHEET_TOKEN || '').trim(),
  );
}

/**
 * POST one analytics event to the Apps Script web app. Never throws; returns
 * false on any error. Apps Script 302-redirects /exec to googleusercontent, so
 * we rely on fetch's default redirect: 'follow'.
 */
async function postEventToSheet(event: SheetEvent): Promise<boolean> {
  const url = (process.env.SHEET_WEBAPP_URL || '').trim();
  const token = (process.env.SHEET_TOKEN || '').trim();
  if (!url || !token) return false;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'event', token, event }),
      signal: AbortSignal.timeout(6000),
      // default: redirect: 'follow' (must follow Apps Script 302)
    });
    return res.ok;
  } catch (error) {
    console.error('❌ analytics postEventToSheet error:', error);
    return false;
  }
}

/**
 * GET aggregated stats from the Apps Script web app. Coerces every field into a
 * valid AnalyticsStats using the same num()/array-mapping style as the Postgres
 * getStats so the shape is guaranteed. Throws on transport or contract errors
 * (caller falls back to zeroedStats).
 */
async function getStatsFromSheet(days: number): Promise<AnalyticsStats> {
  const url = (process.env.SHEET_WEBAPP_URL || '').trim();
  const token = (process.env.SHEET_TOKEN || '').trim();
  if (!url || !token) throw new Error('sheet not configured');

  const endpoint = `${url}?action=stats&token=${encodeURIComponent(token)}&days=${days}`;
  const res = await fetch(endpoint, {
    method: 'GET',
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`sheet stats HTTP ${res.status}`);

  const data: unknown = await res.json();
  const d = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  if ('error' in d || !('totals' in d)) {
    throw new Error(`sheet stats error: ${String(d.error ?? 'missing totals')}`);
  }

  const totals = (d.totals || {}) as Record<string, unknown>;
  const today = (d.today || {}) as Record<string, unknown>;
  const asArr = (x: unknown): Record<string, unknown>[] =>
    Array.isArray(x) ? (x as Record<string, unknown>[]) : [];

  return {
    generated_at:
      typeof d.generated_at === 'string' ? d.generated_at : new Date().toISOString(),
    window_days: num(d.window_days) || days,
    totals: {
      views: num(totals.views),
      clicks: num(totals.clicks),
      visitors: num(totals.visitors),
    },
    today: {
      views: num(today.views),
      visitors: num(today.visitors),
    },
    live_visitors: num(d.live_visitors),
    series: asArr(d.series).map((r) => ({
      day: String(r.day ?? ''),
      site: String(r.site ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    top_pages: asArr(d.top_pages).map((r) => ({
      site: String(r.site ?? ''),
      path: String(r.path ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    per_site: asArr(d.per_site).map((r) => ({
      site: String(r.site ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    top_clicks: asArr(d.top_clicks).map((r) => ({
      label: String(r.label ?? ''),
      site: String(r.site ?? ''),
      clicks: num(r.clicks),
    })),
    top_countries: asArr(d.top_countries).map((r) => ({
      country: String(r.country ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    top_regions: asArr(d.top_regions).map((r) => ({
      country: String(r.country ?? ''),
      region: String(r.region ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    top_cities: asArr(d.top_cities).map((r) => ({
      country: String(r.country ?? ''),
      region: String(r.region ?? ''),
      city: String(r.city ?? ''),
      views: num(r.views),
      visitors: num(r.visitors),
    })),
    web_vitals: asArr(d.web_vitals).map((r) => ({
      metric: String(r.metric ?? ''),
      p75: num(r.p75),
      samples: num(r.samples),
    })),
  };
}

// --- Write path --------------------------------------------------------------

export async function recordEvent(
  input: AnalyticsEventInput,
): Promise<{ ok: boolean; dropped?: 'bot' | 'invalid' | 'nodb' }> {
  try {
    // Bot filtering + field normalization happen BEFORE choosing a backend so
    // every backend stores identically-shaped, identically-cleaned rows.
    if (isBot(input.ua)) return { ok: false, dropped: 'bot' };

    const type =
      input.type === 'click' ? 'click' : input.type === 'ping' ? 'ping' : 'pageview';

    const ts = Math.floor(Date.now() / 1000);
    const day = dayUTC(ts);

    const host = (input.host || '').slice(0, 120);
    const site = siteOf(host);

    let path = (input.path || '/').trim();
    if (!path) path = '/';
    path = path.slice(0, 300);
    if (path.length > 1) path = path.replace(/\/+$/, '') || '/';

    const ref = (input.ref || '').slice(0, 120);
    const label = (input.label || '').slice(0, 80);
    const visitor = visitorHash(input.ip, input.ua);

    const country = cleanGeo(input.country).toUpperCase().slice(0, 2);
    const region = cleanGeo(input.region);
    const city = cleanGeo(input.city);

    const pool = await getPostgresPool();

    if (pool) {
      await ensureTable(pool);
      await pool.query(
        `INSERT INTO web_analytics_events (ts, day, site, host, path, type, ref, label, visitor, country, region, city)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [ts, day, site, host, path, type, ref, label, visitor, country, region, city],
      );
      return { ok: true };
    }

    if (sheetConfigured()) {
      const event: SheetEvent = {
        ts,
        day,
        site,
        host,
        path,
        type,
        ref,
        label,
        visitor,
        country,
        region,
        city,
      };
      const ok = await postEventToSheet(event);
      return ok ? { ok: true } : { ok: false, dropped: 'invalid' };
    }

    return { ok: false, dropped: 'nodb' };
  } catch (error) {
    console.error('❌ analytics recordEvent error:', error);
    return { ok: false, dropped: 'invalid' };
  }
}

// --- Read path ---------------------------------------------------------------

function num(x: unknown): number {
  return Number(x) || 0;
}

function zeroedStats(days: number): AnalyticsStats {
  return {
    generated_at: new Date().toISOString(),
    window_days: days,
    totals: { views: 0, clicks: 0, visitors: 0 },
    today: { views: 0, visitors: 0 },
    live_visitors: 0,
    series: [],
    top_pages: [],
    per_site: [],
    top_clicks: [],
    top_countries: [],
    top_regions: [],
    top_cities: [],
    web_vitals: [],
  };
}

export async function getStats(days: number): Promise<AnalyticsStats> {
  let window = Math.floor(Number(days));
  if (!Number.isFinite(window) || window <= 0) window = 30;
  window = Math.max(1, Math.min(365, window));

  const pool = await getPostgresPool();
  if (!pool) {
    if (sheetConfigured()) {
      try {
        return await getStatsFromSheet(window);
      } catch (error) {
        console.error('❌ analytics getStatsFromSheet error:', error);
        return zeroedStats(window);
      }
    }
    return zeroedStats(window);
  }

  try {
    await ensureTable(pool);

    const now = Math.floor(Date.now() / 1000);
    const today = dayUTC(now);
    const sinceDay = dayUTC(now - window * 86400);
    const liveSince = now - 300;

    const [
      totalsRes,
      todayRes,
      liveRes,
      seriesRes,
      topPagesRes,
      perSiteRes,
      topClicksRes,
      topCountriesRes,
      topRegionsRes,
      topCitiesRes,
      vitalsRes,
    ] = await Promise.all([
      pool.query(
        `SELECT
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) views,
           SUM(CASE WHEN type='click'    THEN 1 ELSE 0 END) clicks,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events`,
      ),
      pool.query(
        `SELECT
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE day = $1::date`,
        [today],
      ),
      pool.query(
        `SELECT COUNT(DISTINCT visitor) n
         FROM web_analytics_events
         WHERE ts > $1`,
        [liveSince],
      ),
      pool.query(
        // NOTE: alias as "d" not the bare keyword "day" — `... ) day` is a parse
        // error on Postgres, which (via Promise.all) zeroed the ENTIRE stats payload.
        `SELECT to_char(day,'YYYY-MM-DD') AS d, site,
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE day >= $1::date
         GROUP BY day, site
         ORDER BY day ASC`,
        [sinceDay],
      ),
      pool.query(
        `SELECT site, path,
           COUNT(*) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE type='pageview' AND day >= $1::date
         GROUP BY site, path
         ORDER BY views DESC
         LIMIT 25`,
        [sinceDay],
      ),
      pool.query(
        `SELECT site,
           SUM(CASE WHEN type='pageview' THEN 1 ELSE 0 END) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE day >= $1::date
         GROUP BY site
         ORDER BY views DESC`,
        [sinceDay],
      ),
      pool.query(
        `SELECT label, site,
           COUNT(*) clicks
         FROM web_analytics_events
         WHERE type='click' AND day >= $1::date AND label <> ''
         GROUP BY label, site
         ORDER BY clicks DESC
         LIMIT 25`,
        [sinceDay],
      ),
      pool.query(
        `SELECT COALESCE(country,'') country,
           COUNT(*) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE type='pageview' AND day >= $1::date AND COALESCE(country,'') <> ''
         GROUP BY country
         ORDER BY views DESC
         LIMIT 50`,
        [sinceDay],
      ),
      pool.query(
        `SELECT COALESCE(country,'') country, COALESCE(region,'') region,
           COUNT(*) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE type='pageview' AND day >= $1::date AND COALESCE(region,'') <> ''
         GROUP BY country, region
         ORDER BY views DESC
         LIMIT 50`,
        [sinceDay],
      ),
      pool.query(
        `SELECT COALESCE(country,'') country, COALESCE(region,'') region, COALESCE(city,'') city,
           COUNT(*) views,
           COUNT(DISTINCT visitor) visitors
         FROM web_analytics_events
         WHERE type='pageview' AND day >= $1::date AND COALESCE(city,'') <> ''
         GROUP BY country, region, city
         ORDER BY views DESC
         LIMIT 50`,
        [sinceDay],
      ),
      // Core Web Vitals, field data (added 2026-07-20). Samples arrive as
      // type='vitals' with label='<METRIC>:<value>' — see WebVitalsReporter.
      //
      // p75 is deliberate: it is the statistic Google itself uses to assess a
      // page's Core Web Vitals, so this number is directly comparable to
      // Search Console's report rather than being an average we invented.
      //
      // The regex guard keeps a malformed label from aborting the whole stats
      // query with a numeric cast error.
      pool.query(
        `SELECT
           split_part(label, ':', 1) AS metric,
           COUNT(*)                  AS samples,
           PERCENTILE_CONT(0.75) WITHIN GROUP (
             ORDER BY split_part(label, ':', 2)::numeric
           )                         AS p75
         FROM web_analytics_events
         WHERE type='vitals'
           AND day >= $1::date
           AND split_part(label, ':', 2) ~ '^[0-9]+(\\.[0-9]+)?$'
         GROUP BY 1
         ORDER BY 1`,
        [sinceDay],
      ),
    ]);

    const totalsRow = totalsRes.rows[0] || {};
    const todayRow = todayRes.rows[0] || {};
    const liveRow = liveRes.rows[0] || {};

    return {
      generated_at: new Date().toISOString(),
      window_days: window,
      totals: {
        views: num(totalsRow.views),
        clicks: num(totalsRow.clicks),
        visitors: num(totalsRow.visitors),
      },
      today: {
        views: num(todayRow.views),
        visitors: num(todayRow.visitors),
      },
      live_visitors: num(liveRow.n),
      series: seriesRes.rows.map((r) => ({
        day: String(r.d ?? ''),
        site: String(r.site ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      top_pages: topPagesRes.rows.map((r) => ({
        site: String(r.site ?? ''),
        path: String(r.path ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      per_site: perSiteRes.rows.map((r) => ({
        site: String(r.site ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      top_clicks: topClicksRes.rows.map((r) => ({
        label: String(r.label ?? ''),
        site: String(r.site ?? ''),
        clicks: num(r.clicks),
      })),
      top_countries: topCountriesRes.rows.map((r) => ({
        country: String(r.country ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      top_regions: topRegionsRes.rows.map((r) => ({
        country: String(r.country ?? ''),
        region: String(r.region ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      top_cities: topCitiesRes.rows.map((r) => ({
        country: String(r.country ?? ''),
        region: String(r.region ?? ''),
        city: String(r.city ?? ''),
        views: num(r.views),
        visitors: num(r.visitors),
      })),
      web_vitals: vitalsRes.rows.map((r) => ({
        metric: String(r.metric ?? ''),
        p75: num(r.p75),
        samples: num(r.samples),
      })),
    };
  } catch (error) {
    console.error('❌ analytics getStats error:', error);
    return zeroedStats(window);
  }
}
