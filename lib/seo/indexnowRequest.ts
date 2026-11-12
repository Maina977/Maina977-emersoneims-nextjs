/**
 * Validation for POST /api/seo/submit-urls (Change Set A, 2026-11-12).
 *
 * The route was public and unthrottled (API routes sit outside middleware.ts),
 * so anyone could make this site push up to 10,000 arbitrary strings to five
 * IndexNow endpoints per call under our key. The route is now admin-only; this
 * module adds the request limits that apply even to an admin call.
 */

/** Largest request body accepted, in bytes. 1,000 URLs of ~120 chars is ~130 KB. */
export const MAX_BODY_BYTES = 256 * 1024;
/** Most URLs accepted in one call. The whole sitemap is 433 today. */
export const MAX_URLS = 1000;
/** Minimum gap between two accepted submissions (per server instance). */
export const COOLDOWN_MS = 60_000;

export type ParsedSubmit =
  | { ok: true; mode: 'sitemap' | 'custom' | 'critical'; urls: string[] }
  | { ok: false; status: 400 | 413; error: string };

/**
 * Parse and validate the raw request body.
 * - malformed JSON is rejected (it used to fall through to a default submission);
 * - custom URLs must be https URLs on this site's own host, deduplicated;
 * - more than MAX_URLS is rejected rather than silently truncated.
 */
export function parseSubmitBody(raw: string, siteUrl: string): ParsedSubmit {
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: `Body larger than ${MAX_BODY_BYTES} bytes` };
  }
  let body: unknown = {};
  if (raw.trim() !== '') {
    try {
      body = JSON.parse(raw);
    } catch {
      return { ok: false, status: 400, error: 'Body is not valid JSON' };
    }
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, status: 400, error: 'Body must be a JSON object' };
  }
  const b = body as { urls?: unknown; submitAll?: unknown; comprehensiveSubmit?: unknown };
  if (b.submitAll === true || b.comprehensiveSubmit === true) return { ok: true, mode: 'sitemap', urls: [] };
  if (b.urls === undefined) return { ok: true, mode: 'critical', urls: [] };
  if (!Array.isArray(b.urls)) return { ok: false, status: 400, error: '"urls" must be an array of strings' };
  if (b.urls.length > MAX_URLS) return { ok: false, status: 400, error: `At most ${MAX_URLS} URLs per call` };

  const host = new URL(siteUrl).host;
  const out = new Set<string>();
  for (const u of b.urls) {
    if (typeof u !== 'string') return { ok: false, status: 400, error: '"urls" must contain only strings' };
    let parsed: URL;
    try {
      parsed = new URL(u);
    } catch {
      return { ok: false, status: 400, error: `Not a URL: ${u.slice(0, 80)}` };
    }
    if (parsed.protocol !== 'https:' || parsed.host !== host) {
      return { ok: false, status: 400, error: `Only https://${host} URLs are accepted` };
    }
    parsed.hash = '';
    out.add(parsed.toString());
  }
  if (out.size === 0) return { ok: false, status: 400, error: '"urls" is empty' };
  return { ok: true, mode: 'custom', urls: [...out] };
}

/** Per-instance cooldown. Returns ms to wait, or 0 if a call may proceed now. */
export function cooldownRemaining(lastAcceptedAt: number, now: number): number {
  const wait = lastAcceptedAt + COOLDOWN_MS - now;
  return wait > 0 ? wait : 0;
}

/**
 * True when the request's Origin (or, failing that, Referer) is this host.
 * A request with neither header is treated as NOT same-origin.
 */
export function isSameOrigin(request: Request): boolean {
  const host = new URL(request.url).host;
  const src = request.headers.get('origin') || request.headers.get('referer');
  if (!src) return false;
  try {
    return new URL(src).host === host;
  } catch {
    return false;
  }
}
