/**
 * In-app request limits (security sweep 2026-11-26).
 *
 * Used for the public routes that spend a paid or quota-limited API key
 * (weather, NASA GLDAS via Open-Meteo, OpenWeatherMap, Google Elevation,
 * building climate/flood/site-analysis) and for the M-Pesa STK route
 * (per IP and per phone). Free and in-process: counters live in this
 * serverless instance's memory (lib/rate-limiter LRU; the get+set is
 * synchronous, so concurrent requests on one instance cannot overshoot).
 *
 * LIMITATION: Vercel may run several instances in several regions and a cold
 * start begins at zero, so a sender spread across instances can exceed these
 * numbers. A Vercel Firewall rate-limit rule is the recommended extra layer
 * (pending management approval). Every refusal is one generic 429.
 */
import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';

const windows = new Map<string, ReturnType<typeof rateLimit>>();
function windowFor(name: string, seconds: number) {
  const k = `${name}:${seconds}`;
  let w = windows.get(k);
  if (!w) { w = rateLimit({ interval: seconds, uniqueTokenPerInterval: 5000 }); windows.set(k, w); }
  return w;
}

export function clientIp(req: Request): string {
  const first = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return first || req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Headers to carry the caller's IP onto an internal re-dispatch (GET -> POST). */
export function ipHeaders(req: Request): Record<string, string> {
  const h: Record<string, string> = {};
  const fwd = req.headers.get('x-forwarded-for');
  const real = req.headers.get('x-real-ip');
  if (fwd) h['x-forwarded-for'] = fwd;
  if (real) h['x-real-ip'] = real;
  return h;
}

/** Count one request under `key`; false when over `limit` in `seconds`. */
export function allow(name: string, key: string, limit: number, seconds: number): boolean {
  return windowFor(name, seconds).check(limit, key).success;
}

export function hashKey(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export function tooMany(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please wait a little and try again.' },
    { status: 429, headers: { 'Cache-Control': 'no-store' } },
  );
}

/** Per-IP limit for a route that spends a paid key; returns a 429 response or null. */
export function limitPaidKeyRoute(req: Request, name: string, perMinute: number): NextResponse | null {
  return allow(`paid:${name}`, clientIp(req), perMinute, 60) ? null : tooMany();
}
