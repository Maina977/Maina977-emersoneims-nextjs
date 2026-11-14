/**
 * Signed, short-lived entitlement tokens (P1, 2026-11-15).
 *
 * The browser keeps a licence record between 24-hour heartbeats and could edit
 * it. A paid function must therefore be decided on the server. After every
 * successful activation or heartbeat the server issues this token. Paid server
 * routes verify it and re-read the licence from the database.
 *
 * Format: base64url(JSON payload) "." base64url(HMAC-SHA256(payload)).
 * Key: ENTITLEMENT_SIGNING_KEY, at least 32 characters. Without it, no token
 * is issued and paid checks fail closed.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface EntitlementPayload {
  v: 1;
  lic: number;        // oracle_licenses.id (never the key)
  dev: string;        // device fingerprint bound to the licence
  tier: 'pro';
  feat: string[];     // features granted, e.g. ['oracle.pro']
  iat: number;        // issued at (s)
  exp: number;        // expires at (s); short, renewed by heartbeat
}

export const ENTITLEMENT_TTL_S = 15 * 60;

function key(env: Record<string, string | undefined> = process.env): Buffer | null {
  const k = env.ENTITLEMENT_SIGNING_KEY?.trim();
  return k && k.length >= 32 ? Buffer.from(k, 'utf8') : null;
}
const b64 = (b: Buffer) => b.toString('base64url');
const sig = (k: Buffer, data: string) => createHmac('sha256', k).update(data).digest();

export function signingConfigured(env?: Record<string, string | undefined>): boolean {
  return key(env) !== null;
}

export function issueEntitlement(
  p: Omit<EntitlementPayload, 'v' | 'iat' | 'exp'>,
  opts: { now?: number; ttlS?: number; env?: Record<string, string | undefined> } = {},
): { token: string; expiresAt: string } | null {
  const k = key(opts.env);
  if (!k) return null;
  const iat = Math.floor((opts.now ?? Date.now()) / 1000);
  const payload: EntitlementPayload = { v: 1, ...p, iat, exp: iat + (opts.ttlS ?? ENTITLEMENT_TTL_S) };
  const body = b64(Buffer.from(JSON.stringify(payload), 'utf8'));
  return { token: `${body}.${b64(sig(k, body))}`, expiresAt: new Date(payload.exp * 1000).toISOString() };
}

export type VerifyResult = { ok: true; payload: EntitlementPayload } | { ok: false; reason: 'no-key' | 'malformed' | 'bad-signature' | 'expired' };

export function verifyEntitlement(token: string | null | undefined, opts: { now?: number; env?: Record<string, string | undefined> } = {}): VerifyResult {
  const k = key(opts.env);
  if (!k) return { ok: false, reason: 'no-key' };
  if (typeof token !== 'string' || token.length > 2048) return { ok: false, reason: 'malformed' };
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: 'malformed' };
  const expected = sig(k, parts[0]);
  let given: Buffer;
  try { given = Buffer.from(parts[1], 'base64url'); } catch { return { ok: false, reason: 'malformed' }; }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: 'bad-signature' };
  let payload: EntitlementPayload;
  try { payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')); } catch { return { ok: false, reason: 'malformed' }; }
  if (payload?.v !== 1 || !Number.isInteger(payload.lic) || typeof payload.dev !== 'string' || !Array.isArray(payload.feat)) return { ok: false, reason: 'malformed' };
  if (Math.floor((opts.now ?? Date.now()) / 1000) >= payload.exp) return { ok: false, reason: 'expired' };
  return { ok: true, payload };
}
