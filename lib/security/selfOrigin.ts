/**
 * Origin for a route that calls this site's own API over HTTP
 * (security hotfix 2026-11-26).
 *
 * The payment facade built its self-call URL from the request's
 * x-forwarded-host / host headers, so a caller who could set those headers
 * could make the server POST payment details to a host of their choosing.
 * The host is now accepted only when it exactly matches this site's own
 * hostnames (the production domains and the deployment URLs Vercel sets);
 * localhost is accepted only off Vercel (local development and verification).
 * Anything else returns null and the route answers 400.
 */
import type { NextRequest } from 'next/server';

const PRODUCTION_HOSTS = ['www.emersoneims.com', 'emersoneims.com'];
const LOCAL_HOST = /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

export function trustedSelfOrigin(req: NextRequest): string | null {
  const host = (req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  if (!host) return null;
  const allowed = new Set(
    [...PRODUCTION_HOSTS, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
      .filter((h): h is string => typeof h === 'string' && h.length > 0)
      .map((h) => h.toLowerCase()),
  );
  if (allowed.has(host)) return `https://${host}`;
  if (!process.env.VERCEL && LOCAL_HOST.test(host)) return `http://${host}`;
  return null;
}
