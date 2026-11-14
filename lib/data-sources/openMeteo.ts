/**
 * Open-Meteo licence gate (compliance, 2026-11-14).
 *
 * Open-Meteo's free hosted API is for NON-COMMERCIAL use only; commercial use
 * requires a paid API subscription (open-meteo.com/en/terms, /en/pricing).
 * EmersonEIMS's site is commercial, so the free endpoints are never called.
 * Open-Meteo is used only when one of these is configured on the server:
 *   - OPEN_METEO_API_KEY: a paid commercial subscription (customer-* hosts), or
 *   - OPEN_METEO_SELF_HOSTED_URL: an EmersonEIMS-run instance of the
 *     open-source Open-Meteo server (data sources such as ERA5 are CC BY 4.0).
 * Otherwise every Open-Meteo request is refused with HTTP 451 and the feature
 * reports the data as unavailable. No replacement values are invented.
 */

export type OpenMeteoMode = 'commercial-key' | 'self-hosted' | 'disabled';

export const OPEN_METEO_HOSTS = new Set([
  'api.open-meteo.com', 'archive-api.open-meteo.com', 'flood-api.open-meteo.com',
  'climate-api.open-meteo.com', 'marine-api.open-meteo.com', 'air-quality-api.open-meteo.com',
]);

export const OPEN_METEO_DISABLED_MESSAGE =
  'Weather/climate data unavailable: Open-Meteo’s free API is licensed for non-commercial use only, and no commercial licence or self-hosted instance is configured for this site.';

export function isOpenMeteoHost(hostname: string): boolean {
  return OPEN_METEO_HOSTS.has(hostname) || /(^|\.)open-meteo\.com$/.test(hostname);
}

export function openMeteoMode(env: Record<string, string | undefined> = process.env): OpenMeteoMode {
  if (env.OPEN_METEO_API_KEY?.trim()) return 'commercial-key';
  if (env.OPEN_METEO_SELF_HOSTED_URL?.trim()) return 'self-hosted';
  return 'disabled';
}

/**
 * The URL to call for an Open-Meteo request under the configured licence, or
 * null when no licensed route exists (the caller must then report the data as
 * unavailable). Non-Open-Meteo URLs are returned unchanged.
 */
export function licensedOpenMeteoUrl(url: string, env: Record<string, string | undefined> = process.env): string | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (!isOpenMeteoHost(u.hostname)) return url;
  const mode = openMeteoMode(env);
  if (mode === 'disabled') return null;
  if (mode === 'commercial-key') {
    if (!u.hostname.startsWith('customer-')) u.hostname = `customer-${u.hostname}`;
    u.searchParams.set('apikey', env.OPEN_METEO_API_KEY!.trim());
    return u.toString();
  }
  // Self-hosted: same path and query on the company's own instance; the
  // service (api / archive / flood) is kept as the first path segment.
  const base = new URL(env.OPEN_METEO_SELF_HOSTED_URL!.trim());
  const service = u.hostname.replace('.open-meteo.com', '');
  const out = new URL(`${base.origin}${base.pathname.replace(/\/$/, '')}/${service}${u.pathname}`);
  out.search = u.search;
  return out.toString();
}
