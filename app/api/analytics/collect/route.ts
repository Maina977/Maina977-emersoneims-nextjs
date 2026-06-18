/**
 * First-party analytics collector.
 *
 * Cookieless beacon ingestion endpoint. The browser delivers events here via
 * `navigator.sendBeacon` (a Blob, usually `text/plain` or `application/json`)
 * or `fetch` keepalive. Bot filtering and aggregation happen in the store
 * (`@/lib/analytics/store`). This route mirrors the public /collect beacon
 * contract: it ALWAYS replies 204 and never reveals whether an event was
 * counted (bot/nodb/parse drops are silent by design).
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordEvent } from '@/lib/analytics/store';

// Uses the pg pool — must run on Node and never be statically optimized/cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

function noContent(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Extract just the hostname from a possibly-full referrer URL. */
function referrerHostname(referrer: unknown): string {
  if (!referrer || typeof referrer !== 'string') return '';
  const value = referrer.trim();
  if (!value) return '';
  try {
    return new URL(value).hostname;
  } catch {
    // Not a full URL — return as-is (already a bare hostname or empty).
    return value;
  }
}

/** First value of x-forwarded-for, else x-real-ip, else 0.0.0.0. */
function clientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get('x-real-ip');
  if (real && real.trim()) return real.trim();
  return '0.0.0.0';
}

/**
 * Geolocation derived server-side from edge headers — never trusted from the
 * client. Vercel populates these on every request at no cost. We also accept the
 * generic Cloudflare / common-proxy header names so this keeps working if the
 * site ever moves off Vercel. `region` is the first-level subdivision, which for
 * Kenya is the county.
 */
function clientGeo(request: NextRequest): {
  country: string;
  region: string;
  city: string;
} {
  const h = request.headers;
  const country =
    h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || h.get('x-geo-country') || '';
  const region =
    h.get('x-vercel-ip-country-region') ||
    h.get('x-geo-region') ||
    h.get('cf-region') ||
    '';
  const city = h.get('x-vercel-ip-city') || h.get('cf-ipcity') || h.get('x-geo-city') || '';
  return { country, region, city };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let raw: Record<string, unknown> = {};
    try {
      const text = await request.text();
      const parsed = text ? JSON.parse(text) : null;
      if (parsed && typeof parsed === 'object') {
        raw = parsed as Record<string, unknown>;
      }
    } catch {
      // Malformed beacon body — swallow and still 204 below.
      return noContent();
    }

    const rawType = (raw.t ?? raw.action) as unknown;
    const type: 'pageview' | 'click' | 'ping' =
      rawType === 'click' ? 'click' : rawType === 'ping' ? 'ping' : 'pageview';

    const path = String(raw.p ?? raw.page ?? '/');
    const host = String(raw.h ?? request.headers.get('host') ?? '');
    const ref = String(raw.r ?? referrerHostname(raw.referrer));
    const label = String(raw.label ?? '');

    const ip = clientIp(request);
    const ua = request.headers.get('user-agent') ?? '';
    const { country, region, city } = clientGeo(request);

    // Result is intentionally ignored — drops must stay silent.
    await recordEvent({ type, path, host, ref, label, ip, ua, country, region, city });
  } catch {
    // Never error a beacon, even on unexpected failure.
  }

  return noContent();
}

export async function OPTIONS(): Promise<NextResponse> {
  return noContent();
}

export async function GET(): Promise<NextResponse> {
  // Health / no-op.
  return noContent();
}
