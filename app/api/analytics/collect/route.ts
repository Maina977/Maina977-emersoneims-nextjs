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

// Per-process cache so we never re-query the same visitor IP repeatedly (a
// visitor browsing many pages, or 60s pings, costs at most one lookup per
// serverless instance lifetime).
const geoCache = new Map<string, { v: { country: string; region: string; city: string }; exp: number }>();
const GEO_TTL_MS = 6 * 60 * 60 * 1000; // 6h

/** Skip private / loopback / unset IPs — they can't be geolocated. */
function isPublicIp(ip: string): boolean {
  if (!ip || ip === '0.0.0.0' || ip === '::1') return false;
  if (/^(10\.|127\.|192\.168\.|169\.254\.|::1)/.test(ip)) return false;
  const m = ip.match(/^172\.(\d+)\./);
  if (m) {
    const o = Number(m[1]);
    if (o >= 16 && o <= 31) return false;
  }
  return true;
}

/**
 * Vercel's edge reliably resolves COUNTRY but often returns no region/city for
 * African IPs (Kenya included). When that happens we enrich from ipwho.is — a
 * free, key-less, HTTPS service that permits commercial use — to fill the
 * county (region) and town (city). Cached per IP, short timeout, never throws;
 * on any failure we simply keep whatever the edge gave us.
 */
async function enrichGeoFromIp(
  ip: string,
): Promise<{ country: string; region: string; city: string } | null> {
  if (!isPublicIp(ip)) return null;
  const now = Date.now();
  const hit = geoCache.get(ip);
  if (hit && hit.exp > now) return hit.v;
  try {
    const res = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code,region,city`,
      { signal: AbortSignal.timeout(2500) },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as {
      success?: boolean;
      country_code?: string;
      region?: string;
      city?: string;
    };
    if (!j || j.success === false) return null;
    const v = {
      country: String(j.country_code || ''),
      region: String(j.region || ''),
      city: String(j.city || ''),
    };
    if (geoCache.size > 5000) geoCache.clear(); // bound memory
    geoCache.set(ip, { v, exp: now + GEO_TTL_MS });
    return v;
  } catch {
    return null;
  }
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
    // 'vitals' added 2026-07-20 (Phase 5 monitoring). Anything unrecognised
    // still falls back to 'pageview', preserving the original contract.
    //
    // Safe against existing metrics: every `views`/`clicks` aggregate in
    // store.ts is explicitly filtered by type, so vitals rows are invisible to
    // them. The `visitors` aggregates count DISTINCT visitor across all types,
    // but a vitals beacon only ever fires on a page that already sent its
    // pageview, so the distinct set is unchanged.
    const type: 'pageview' | 'click' | 'ping' | 'vitals' =
      rawType === 'click'
        ? 'click'
        : rawType === 'ping'
          ? 'ping'
          : rawType === 'vitals'
            ? 'vitals'
            : 'pageview';

    const path = String(raw.p ?? raw.page ?? '/');
    const host = String(raw.h ?? request.headers.get('host') ?? '');
    const ref = String(raw.r ?? referrerHostname(raw.referrer));
    const label = String(raw.label ?? '');

    const ip = clientIp(request);
    const ua = request.headers.get('user-agent') ?? '';
    let { country, region, city } = clientGeo(request);

    // The edge often gives only a country for KE IPs — fill the county/city from
    // a free IP lookup so "region" and "location" actually populate.
    if (!region || !city) {
      const enriched = await enrichGeoFromIp(ip);
      if (enriched) {
        country = country || enriched.country;
        region = region || enriched.region;
        city = city || enriched.city;
      }
    }

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
