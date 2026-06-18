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
  type: 'pageview' | 'click' | 'ping';
  path: string;
  host?: string;
  ref?: string; // referrer hostname only
  label?: string; // click label (CTA text/href), '' otherwise
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

// --- Write path --------------------------------------------------------------

export async function recordEvent(
  input: AnalyticsEventInput,
): Promise<{ ok: boolean; dropped?: 'bot' | 'invalid' | 'nodb' }> {
  const pool = await getPostgresPool();
  if (!pool) return { ok: false, dropped: 'nodb' };

  try {
    await ensureTable(pool);

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

    await pool.query(
      `INSERT INTO web_analytics_events (ts, day, site, host, path, type, ref, label, visitor, country, region, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [ts, day, site, host, path, type, ref, label, visitor, country, region, city],
    );

    return { ok: true };
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
  };
}

export async function getStats(days: number): Promise<AnalyticsStats> {
  let window = Math.floor(Number(days));
  if (!Number.isFinite(window) || window <= 0) window = 30;
  window = Math.max(1, Math.min(365, window));

  const pool = await getPostgresPool();
  if (!pool) return zeroedStats(window);

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
        `SELECT to_char(day,'YYYY-MM-DD') day, site,
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
        day: String(r.day ?? ''),
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
    };
  } catch (error) {
    console.error('❌ analytics getStats error:', error);
    return zeroedStats(window);
  }
}
