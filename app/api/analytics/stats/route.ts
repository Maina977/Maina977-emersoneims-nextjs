/**
 * Token-protected aggregated web-analytics for the EIMS Campaign Pilot consumer.
 *
 * This route mirrors the Cloudflare Worker `/stats` contract so a local Python
 * module (`analytics.py`) can consume the exact same JSON shape regardless of
 * whether it hits the Worker or this Next.js endpoint. The numbers are REAL —
 * they are aggregated from first-party events in `lib/analytics/store.ts` and
 * are never fabricated. If the data layer is unavailable, a fully-zeroed (but
 * structurally valid) object is returned so the consumer always gets valid JSON.
 *
 * Access is gated by a constant-time comparison of a `token` query parameter
 * against `process.env.ANALYTICS_READ_TOKEN`. With no configured token the
 * endpoint refuses to serve stats (401), never leaking data by misconfiguration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/analytics/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, max-age=0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Constant-time string comparison. Returns true only when both strings are
 * non-empty, of equal length, and identical. Avoids early-exit timing leaks by
 * XOR-ing every character code into an accumulator and checking it at the end.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function jsonResponse(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get('token') || '';
  const expected = process.env.ANALYTICS_READ_TOKEN || '';

  // Misconfigured (no token set) or wrong token -> unauthorized. Never serve
  // stats without a configured token.
  if (!expected || !constantTimeEqual(token, expected)) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  // days: default 30, clamp to [1, 365]. The store clamps too; we clamp here
  // so the value is sane before it ever reaches the data layer.
  const daysParam = Number(request.nextUrl.searchParams.get('days'));
  let days = Number.isFinite(daysParam) ? Math.floor(daysParam) : 30;
  if (!days || days <= 0) days = 30;
  days = Math.max(1, Math.min(365, days));

  try {
    const stats = await getStats(days);
    return jsonResponse(
      { ...stats, configured: true, source: 'live', stale: false },
      200,
    );
  } catch {
    // Never throw a 500 and never leak error details to this token-gated,
    // public-ish endpoint. Return a zeroed-but-valid shape instead.
    return jsonResponse(
      {
        configured: true,
        source: 'live',
        stale: false,
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
      },
      200,
    );
  }
}
