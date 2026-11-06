/**
 * Admin sign-in: exchanges ADMIN_API_KEY for the admin_session cookie that
 * middleware (admin pages) and lib/auth/adminRequest (admin APIs) already
 * check. Before 2026-11-06 there was no way to obtain that cookie from a
 * browser.
 *
 * POST {key}  -> sets the cookie (HttpOnly, Secure in production,
 *                SameSite=Strict, 8 hours) when the key matches.
 * DELETE      -> signs out.
 * 5 attempts per IP per 10 minutes. Wrong key and missing configuration both
 * answer the same way, so the endpoint reveals nothing.
 */
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { rateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const attempts = rateLimit({ interval: 600, uniqueTokenPerInterval: 1000 });
const COOKIE = 'admin_session';

function ipOf(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

function equal(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (!attempts.check(5, ipOf(request)).success) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Try again in 10 minutes.' }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { key?: unknown } | null;
  const key = typeof body?.key === 'string' ? body.key.trim() : '';
  const adminKey = process.env.ADMIN_API_KEY || '';
  if (!adminKey || !key || !equal(key, adminKey)) {
    return NextResponse.json({ ok: false, error: 'Sign-in failed' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, adminKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
