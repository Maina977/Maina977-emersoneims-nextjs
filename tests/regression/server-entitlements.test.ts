import { describe, it, expect } from 'vitest';
import { issueEntitlement, verifyEntitlement } from '@/lib/entitlements/token';
import { checkEntitlement, ENTITLEMENT_HEADER } from '@/lib/entitlements/server';
import type { OracleLicense } from '@/lib/generator-oracle/db';

// P1 2026-11-15: paid functions are decided on the server. The browser's
// stored licence (editable between 24-hour heartbeats) is never trusted.

const KEY = 'test-signing-key-0123456789-abcdefghij'; // ≥ 32 chars, test only
const PAID = { NEXT_PUBLIC_AI_TOOLS_PAID: 'true', ENTITLEMENT_SIGNING_KEY: KEY };
const FREE = { ENTITLEMENT_SIGNING_KEY: KEY };
const NOW = Date.parse('2026-11-15T10:00:00Z');
const features = new Set(['oracle.pro']);
const licence = (over: Partial<OracleLicense> = {}): OracleLicense => ({
  id: 7, license_key: 'EIMS-AAAA-BBBB-CCCC', customer_email: 'x', customer_phone: 'x', customer_name: null,
  device_fingerprint: 'dev-1', device_info: null, status: 'active', created_at: new Date(NOW), activated_at: new Date(NOW),
  expires_at: new Date(NOW + 30 * 86400e3), payment_reference: null, last_heartbeat: null, activation_attempts: 0, notes: null, ...over,
});
const tokenFor = (env = PAID, ttlS?: number) => issueEntitlement({ lic: 7, dev: 'dev-1', tier: 'pro', feat: ['oracle.pro'] }, { env, now: NOW, ttlS })!.token;
const hdr = (t?: string) => new Headers(t ? { [ENTITLEMENT_HEADER]: t } : {});
const check = (h: Headers, over: Partial<OracleLicense> | null = {}, env: Record<string, string> = PAID, now = NOW) =>
  checkEntitlement(h, 'oracle.pro', { env, now, paidFeatures: features, getLicense: async () => (over === null ? null : licence(over)) });

describe('entitlement tokens', () => {
  it('round-trip; tampering, wrong key and expiry are refused', () => {
    const t = tokenFor();
    expect(verifyEntitlement(t, { env: PAID, now: NOW }).ok).toBe(true);
    const [body, s] = t.split('.');
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, 'base64url').toString()), feat: ['everything'] })).toString('base64url');
    expect(verifyEntitlement(`${forged}.${s}`, { env: PAID, now: NOW })).toEqual({ ok: false, reason: 'bad-signature' });
    expect(verifyEntitlement(t, { env: { ENTITLEMENT_SIGNING_KEY: 'another-key-another-key-another-key!' }, now: NOW })).toEqual({ ok: false, reason: 'bad-signature' });
    expect(verifyEntitlement(t, { env: PAID, now: NOW + 16 * 60e3 })).toEqual({ ok: false, reason: 'expired' });
    expect(verifyEntitlement('not.a-token', { env: PAID, now: NOW }).ok).toBe(false);
  });
  it('no signing key (or a short one) → no token is issued', () => {
    expect(issueEntitlement({ lic: 1, dev: 'd', tier: 'pro', feat: [] }, { env: {} })).toBeNull();
    expect(issueEntitlement({ lic: 1, dev: 'd', tier: 'pro', feat: [] }, { env: { ENTITLEMENT_SIGNING_KEY: 'short' } })).toBeNull();
  });
});

describe('server entitlement decision', () => {
  it('free mode (today): allowed without any token — no behaviour change', async () => {
    expect(await check(hdr(), {}, FREE)).toEqual({ allowed: true, mode: 'free' });
  });
  it('paid mode: valid token + active, unexpired, same-device licence → allowed', async () => {
    expect(await check(hdr(tokenFor()))).toEqual({ allowed: true, mode: 'paid', licenceId: 7 });
  });
  it('paid mode refuses: no token, revoked, expired licence, other device, DB unavailable, no key', async () => {
    expect(await check(hdr())).toMatchObject({ allowed: false, status: 401 });
    expect(await check(hdr(tokenFor()), { status: 'revoked' })).toMatchObject({ allowed: false, status: 403 });
    expect(await check(hdr(tokenFor()), { expires_at: new Date(NOW - 1000) })).toMatchObject({ allowed: false, status: 403 });
    expect(await check(hdr(tokenFor()), { device_fingerprint: 'dev-2' })).toMatchObject({ allowed: false, status: 403 });
    expect(await check(hdr(tokenFor()), null)).toMatchObject({ allowed: false, status: 503 });
    expect(await check(hdr(tokenFor()), {}, { NEXT_PUBLIC_AI_TOOLS_PAID: 'true' })).toMatchObject({ allowed: false, status: 503 });
  });
  it('a revoked licence loses access at once, even with an unexpired token (database re-check)', async () => {
    const t = tokenFor();
    expect((await check(hdr(t))).allowed).toBe(true);
    expect((await check(hdr(t), { status: 'revoked' })).allowed).toBe(false);
  });
  it('functions not on the paid list are unaffected in paid mode', async () => {
    expect(await checkEntitlement(hdr(), 'oracle.search', { env: PAID, now: NOW, paidFeatures: features })).toEqual({ allowed: true, mode: 'paid' });
  });
});
