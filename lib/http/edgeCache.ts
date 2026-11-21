/**
 * Edge-cache headers for GET API routes (audit M2, 2026-11-21).
 *
 * next.config gives every response `s-maxage=600`, so without these headers a
 * 429 / 503 / 400 for one visitor is served from the CDN to everyone asking
 * for the same URL for 10 minutes (the defect Release 4.2 fixed for geocode).
 * Errors are never cached; successful answers get the stated edge lifetime.
 * Vercel-CDN-Cache-Control is read by Vercel's CDN before Cache-Control.
 */
export const NO_STORE: Record<string, string> = {
  'Vercel-CDN-Cache-Control': 'no-store',
  'CDN-Cache-Control': 'no-store',
  'Cache-Control': 'no-store',
};

export function edgeCacheHeaders(http: number, okEdgeSeconds = 86400): Record<string, string> {
  return http === 200 ? { 'Vercel-CDN-Cache-Control': `public, max-age=${okEdgeSeconds}` } : NO_STORE;
}
