/**
 * THE ONE HTTP GUARD FOR ACCOUNTS (Report B). Every accounts request passes
 * through handle() below, in this order, and fails closed at each step:
 *
 *  1. Feature flag: ACCOUNTS_ENABLED exactly "true" and not production → else 404
 *     (indistinguishable from a route that does not exist).
 *  2. Configuration: ACCOUNTS_DATABASE_URL (never DATABASE_URL) and
 *     ACCOUNTS_SECRET_KEY (32+) → else 503.
 *  3. Cross-site requests: every state-changing method (POST/PUT/PATCH/DELETE)
 *     must carry an Origin equal to this site's origin, and must not be
 *     Sec-Fetch-Site: cross-site → else 403.
 *  4. Session: the HttpOnly __Host- session cookie, validated by
 *     sessionActor (hashed token, idle 2 h, absolute 12 h) → else 401.
 *  5. CSRF: state-changing requests in a session must send the session's CSRF
 *     token in x-csrf-token; its SHA-256 must equal the stored hash
 *     (constant-time) → else 403.
 *  6. Body: JSON only, at most MAX_JSON_BODY bytes (binary chunks: MAX_CHUNK_BYTES).
 *  7. Errors: AcctError → its status and message; anything else → 500 with a
 *     generic message (details only in the server log, never tokens or bodies).
 *
 * Every response: Cache-Control no-store, X-Robots-Tag noindex, nosniff.
 */
import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import {
  accountsEnabled, accountsSecret, CSRF_COOKIE, CSRF_HEADER, MAX_CHUNK_BYTES, MAX_JSON_BODY, NO_ACCOUNTS_DATABASE, SESSION_ABSOLUTE_MS, SESSION_COOKIE,
} from './config';
import { AcctError, type Actor, type Ctx } from './context';
import { getAccountsDb } from './db';
import { resolveMailer } from './testMail';
import { previewDatabaseConfirmed } from './identity';
import { sessionActor } from './auth';
import { safeEqualStr, sha256HexNode } from './crypto';

const STATE_CHANGING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const BASE_HEADERS = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };

export function json(body: unknown, status = 200, extra: Record<string, string> = {}): NextResponse {
  return NextResponse.json(body, { status, headers: { ...BASE_HEADERS, ...extra } });
}
const fail = (status: number, error: string, extra?: Record<string, unknown>) => json({ success: false, error, ...(extra ?? {}) }, status);

/** The origin this site is served from: ACCOUNTS_PUBLIC_ORIGIN if set, else the request's own. */
export function siteOrigin(request: NextRequest, env: Record<string, string | undefined> = process.env): string {
  const configured = (env.ACCOUNTS_PUBLIC_ORIGIN ?? '').trim().replace(/\/$/, '');
  return configured || new URL(request.url).origin;
}

/** Step 3: a state-changing request from another site is refused. */
export function crossSiteRefused(request: NextRequest, env: Record<string, string | undefined> = process.env): boolean {
  if (!STATE_CHANGING.has(request.method)) return false;
  if (request.headers.get('sec-fetch-site') === 'cross-site') return true;
  const origin = request.headers.get('origin');
  return !origin || origin !== siteOrigin(request, env);
}

export function clientIp(request: NextRequest): string {
  return (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
}

export interface Call {
  request: NextRequest;
  ctx: Ctx;
  /** Present when the route needs a session (step 4 passed). */
  actor: Actor | null;
  /** Parsed JSON body (step 6), {} for GET. */
  body: Record<string, unknown>;
  /** Raw bytes for binary uploads (attachment chunks). */
  bytes: Uint8Array | null;
  params: Record<string, string>;
  query: URLSearchParams;
}
export interface RouteSpec {
  session: boolean;
  binary?: boolean;
  run: (c: Call) => Promise<NextResponse | unknown>;
}

async function readBody(request: NextRequest, binary: boolean): Promise<{ body: Record<string, unknown>; bytes: Uint8Array | null }> {
  if (request.method === 'GET' || request.method === 'HEAD') return { body: {}, bytes: null };
  const limit = binary ? MAX_CHUNK_BYTES : MAX_JSON_BODY;
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > limit) throw new AcctError(413, 'The request is too large');
  if (binary) {
    const buf = new Uint8Array(await request.arrayBuffer());
    if (buf.byteLength > limit) throw new AcctError(413, 'The request is too large');
    return { body: {}, bytes: buf };
  }
  const text = await request.text();
  if (text.length > limit) throw new AcctError(413, 'The request is too large');
  if (!text) return { body: {}, bytes: null };
  if (!/^application\/json\b/i.test(request.headers.get('content-type') ?? '')) throw new AcctError(415, 'Send JSON (Content-Type: application/json)');
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new AcctError(400, 'The request body is not valid JSON'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new AcctError(400, 'The request body must be a JSON object');
  return { body: parsed as Record<string, unknown>, bytes: null };
}

export async function handle(request: NextRequest, spec: RouteSpec | null, params: Record<string, string>, env: Record<string, string | undefined> = process.env): Promise<NextResponse> {
  // 1. Flag (and unknown routes): 404, identical either way.
  if (!accountsEnabled(env) || !spec) return fail(404, 'Not found');
  // 2. Configuration.
  const db = await getAccountsDb(env);
  if (!db) return fail(503, NO_ACCOUNTS_DATABASE);
  const secret = accountsSecret(env);
  if (!secret) return fail(503, 'Accounts are not available: ACCOUNTS_SECRET_KEY is not configured.');
  // 2b. Identity: only the owner-marked preview database, never the production URL.
  const identity = await previewDatabaseConfirmed(db, env);
  if (!identity.ok) return fail(503, identity.reason);
  // 3. Cross-site.
  if (crossSiteRefused(request, env)) return fail(403, 'Request refused: it did not come from this site.');
  const ctx: Ctx = { db, secret, mailer: resolveMailer(env, db), now: () => new Date(), env, origin: siteOrigin(request, env) };
  try {
    // 4. Session.
    let actor: Actor | null = null;
    if (spec.session) {
      const a = await sessionActor(ctx, request.cookies.get(SESSION_COOKIE)?.value);
      if (!a) return fail(401, 'Please sign in.');
      // 5. CSRF.
      if (STATE_CHANGING.has(request.method)) {
        const sent = request.headers.get(CSRF_HEADER) ?? '';
        if (!sent || !safeEqualStr(sha256HexNode(sent), a.csrfHash)) return fail(403, 'Request refused: missing or wrong security token. Reload the page and try again.');
      }
      const { csrfHash: _csrf, ...rest } = a;
      void _csrf;
      actor = rest;
    }
    // 6. Body.
    const { body, bytes } = await readBody(request, Boolean(spec.binary));
    const out = await spec.run({ request, ctx, actor, body, bytes, params, query: request.nextUrl.searchParams });
    if (out instanceof NextResponse) {
      for (const [k, v] of Object.entries(BASE_HEADERS)) out.headers.set(k, v);
      return out;
    }
    return json({ success: true, ...(out && typeof out === 'object' && !Array.isArray(out) ? out : { data: out }) });
  } catch (e) {
    // 7. Errors.
    if (e instanceof AcctError) return fail(e.status, e.message, e.extra);
    console.error('[accounts] internal error', e instanceof Error ? e.name : 'unknown');
    return fail(500, 'Something went wrong. Try again later.');
  }
}

// ------------------------------------------------------------------ cookies
/** __Host- cookies: Secure, Path=/, no Domain. Session HttpOnly + Lax; CSRF readable by the page (double submit), Strict. */
export function setSessionCookies(res: NextResponse, s: { token: string; csrf: string; expiresAt: Date }): NextResponse {
  const maxAge = Math.max(0, Math.floor(Math.min(SESSION_ABSOLUTE_MS, s.expiresAt.getTime() - Date.now()) / 1000));
  res.cookies.set(SESSION_COOKIE, s.token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge });
  res.cookies.set(CSRF_COOKIE, s.csrf, { httpOnly: false, secure: true, sameSite: 'strict', path: '/', maxAge });
  return res;
}
export function clearSessionCookies(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  res.cookies.set(CSRF_COOKIE, '', { httpOnly: false, secure: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
