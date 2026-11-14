/**
 * SECURITY HOTFIX 2026-11-13: Generator Oracle licence activation.
 *  1. The hard-coded demo licence EIMS-TEST-0001-DEMO (public repository)
 *     activated as a working "pro" licence on every environment, production
 *     included, whenever the key was not in the database.
 *  2. Admin PUT/GET compared with `Bearer ${ADMIN_API_KEY}`: unset, that is
 *     "Bearer undefined", which granted admin access (create licences, list
 *     customer emails).
 *  3. Rate limiting was per device ID only: a new device ID per request gave
 *     unlimited key guesses.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

type License = { status: string; customer_email: string; activated_at?: Date; expires_at?: Date | null };
const db = {
  licenses: new Map<string, License>(),
  created: [] as unknown[],
};
vi.mock('@/lib/generator-oracle/db', () => ({
  initOracleTables: async () => true,
  checkRateLimit: async () => true,
  logActivationAttempt: async () => undefined,
  getLicenseByKey: async (k: string) => db.licenses.get(k) ?? null,
  activateLicense: async (k: string) => {
    const l = db.licenses.get(k)!;
    if (l.status === 'revoked') return { success: false, error: 'This license has been revoked' };
    if (l.status === 'expired' || (l.expires_at && l.expires_at < new Date())) return { success: false, error: 'This license has expired' };
    return { success: true, license: { ...l, activated_at: new Date() } };
  },
  createLicense: async (x: unknown) => { db.created.push(x); return { success: true, licenseKey: 'EIMS-NEW1-NEW1-NEW1' }; },
  getAllLicenses: async () => [{ email: 'customer@example.com' }],
  getLicenseStats: async () => ({ total: 1 }),
}));

let ipN = 0;
async function route() { return import('@/app/api/generator-oracle/activate/route'); }
async function activate(key: string, env = 'production', ip?: string) {
  vi.stubEnv('VERCEL_ENV', env);
  const { NextRequest } = await import('next/server');
  const { POST } = await route();
  return POST(new NextRequest('http://localhost/api/generator-oracle/activate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip ?? `198.51.100.${++ipN % 250}` },
    body: JSON.stringify({ key, deviceId: `device-${ipN}` }),
  }));
}
async function admin(method: 'GET' | 'PUT', auth: string | null, key: string | undefined) {
  // undefined = the variable is not set at all (the real failure case).
  vi.stubEnv('ADMIN_API_KEY', key as string);
  const { NextRequest } = await import('next/server');
  const r = await route();
  const req = new NextRequest('http://localhost/api/generator-oracle/activate', {
    method, headers: { 'content-type': 'application/json', ...(auth ? { authorization: auth } : {}) },
    ...(method === 'PUT' ? { body: JSON.stringify({ email: 'new@example.com' }) } : {}),
  });
  return method === 'PUT' ? r.PUT(req) : r.GET(req);
}

beforeEach(() => {
  db.licenses.clear();
  db.created.length = 0;
  db.licenses.set('EIMS-GOOD-0000-0001', { status: 'active', customer_email: 'paid@example.com', expires_at: null });
  db.licenses.set('EIMS-EXPD-0000-0001', { status: 'active', customer_email: 'x@example.com', expires_at: new Date('2025-01-01') });
  db.licenses.set('EIMS-RVKD-0000-0001', { status: 'revoked', customer_email: 'y@example.com', expires_at: null });
});
afterEach(() => { vi.unstubAllEnvs(); });

describe('activation: only real, valid database licences', () => {
  it.each(['production', 'preview', 'development'])('the old demo key is refused on %s', async (env) => {
    const res = await activate('EIMS-TEST-0001-DEMO', env);
    expect(res.status).toBe(404);
    expect((await res.json()).success).toBe(false);
  });
  it('a forged key that is not in the database is refused', async () => {
    expect((await activate('EIMS-AAAA-BBBB-CCCC')).status).toBe(404);
  });
  it('a malformed key is refused before any lookup', async () => {
    expect((await activate('ANYTHING')).status).toBe(400);
  });
  it('an expired licence is refused', async () => {
    const res = await activate('EIMS-EXPD-0000-0001');
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/expired/);
  });
  it('a revoked licence is refused', async () => {
    const res = await activate('EIMS-RVKD-0000-0001');
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/revoked/);
  });
  it('a valid paid licence still activates (legitimate customers keep access)', async () => {
    const res = await activate('EIMS-GOOD-0000-0001');
    expect(res.status).toBe(200);
    expect((await res.json()).license.email).toBe('paid@example.com');
  });
  it('one IP cannot make unlimited guesses with fresh device IDs', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) statuses.push((await activate('EIMS-AAAA-BBBB-CCCC', 'production', '203.0.113.77')).status);
    expect(statuses.slice(0, 10).every((s) => s === 404)).toBe(true);
    expect(statuses.slice(10)).toEqual([429, 429]);
  });
});

describe('admin endpoints', () => {
  const KEY = 'a-real-admin-key-0123456789';
  it.each([['PUT'], ['GET']] as const)('%s: "Bearer undefined" with no key configured is refused', async (m) => {
    expect((await admin(m, 'Bearer undefined', undefined)).status).toBe(401);
    expect((await admin(m, 'Bearer ', undefined)).status).toBe(401);
  });
  it.each([['PUT'], ['GET']] as const)('%s: a wrong key or no header is refused', async (m) => {
    expect((await admin(m, 'Bearer not-the-key-0123456789x', KEY)).status).toBe(401);
    expect((await admin(m, null, KEY)).status).toBe(401);
  });
  it('a too-short configured key is never accepted', async () => {
    expect((await admin('GET', 'Bearer short', 'short')).status).toBe(401);
  });
  it('the correct key works (PUT creates, GET lists)', async () => {
    expect((await admin('PUT', `Bearer ${KEY}`, KEY)).status).toBe(200);
    expect(db.created.length).toBe(1);
    expect((await admin('GET', `Bearer ${KEY}`, KEY)).status).toBe(200);
  });
});

describe('no built-in licence remains in the code', () => {
  it('the demo key appears nowhere under app/ or lib/', () => {
    const root = join(__dirname, '..', '..');
    const hits: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
        const p = join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(tsx?|jsx?)$/.test(e.name) && readFileSync(p, 'utf8').includes('EIMS-TEST-0001')) hits.push(p);
      }
    };
    for (const d of ['app', 'lib', 'components']) walk(join(root, d));
    expect(hits).toEqual([]);
  }, 30_000);
});
