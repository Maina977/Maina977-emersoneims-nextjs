/**
 * Report B: the accounts HTTP layer under attack. Drives the real entry point
 * (app/api/accounts/[...path]/route.ts → lib/accounts/http.ts → services) on
 * PGlite, with an in-memory mailer. TEST data only.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PGlite } from '@electric-sql/pglite';
import { fromPglite, setAccountsDbForTests } from '@/lib/accounts/db';
import { MemoryMailer, setMailerForTests } from '@/lib/accounts/mailer';
import { lib, TEST_PASSWORD, TEST_SECRET } from '../helpers/accountsTestDb';
import { totpCode } from '@/lib/accounts/crypto';

// Real scrypt (N = 2^15) for every test user: slow by design. A longer per-test timeout keeps
// these reliable on a busy machine; it changes no assertion.
vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const ORIGIN = 'https://preview.test';
let mailer: MemoryMailer;
let route: typeof import('@/app/api/accounts/[...path]/route');

beforeAll(async () => {
  const pg = new PGlite();
  await lib.applyMigrations(pg);
  await pg.query("INSERT INTO acct_database_identity (role) VALUES ('preview')");
  setAccountsDbForTests(fromPglite(pg));
  mailer = new MemoryMailer();
  setMailerForTests(mailer);
  route = await import('@/app/api/accounts/[...path]/route');
});
afterAll(() => { setAccountsDbForTests(null); setMailerForTests(null); vi.unstubAllEnvs(); });
beforeEach(() => {
  vi.stubEnv('ACCOUNTS_ENABLED', 'true');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
  vi.stubEnv('ACCOUNTS_PUBLIC_ORIGIN', ORIGIN);
});

interface Jar { session?: string; csrf?: string }
function call(method: string, path: string, opts: { body?: unknown; raw?: BodyInit; jar?: Jar; csrf?: string | null; origin?: string | null; headers?: Record<string, string> } = {}) {
  const h: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.origin !== null) h.origin = opts.origin ?? ORIGIN;
  if (opts.body !== undefined) h['content-type'] = 'application/json';
  if (opts.jar?.session) h.cookie = `__Host-eims_session=${opts.jar.session}`;
  const csrf = opts.csrf === undefined ? opts.jar?.csrf : opts.csrf;
  if (csrf) h['x-csrf-token'] = csrf;
  const req = new NextRequest(`${ORIGIN}/api/accounts/${path}`, { method, headers: h, body: opts.raw ?? (opts.body === undefined ? undefined : JSON.stringify(opts.body)) });
  const fn = (route as unknown as Record<string, (r: NextRequest, c: { params: Promise<{ path: string[] }> }) => Promise<Response>>)[method];
  return fn(req, { params: Promise.resolve({ path: path.split('?')[0].split('/') }) });
}
const cookiesOf = (res: Response) => (res.headers as Headers & { getSetCookie(): string[] }).getSetCookie();

async function signedIn(email: string): Promise<Jar> {
  await call('POST', 'signup', { body: { email, password: TEST_PASSWORD, displayName: `TEST ${email}` } });
  await call('POST', 'verify-email', { body: { token: mailer.lastToken(email, 'verify_email') } });
  const res = await call('POST', 'login', { body: { email, password: TEST_PASSWORD } });
  expect(res.status).toBe(200);
  const jar: Jar = {};
  for (const c of cookiesOf(res)) {
    const [kv] = c.split(';');
    const [k, v] = kv.split('=');
    if (k === '__Host-eims_session') jar.session = v;
    if (k === '__Host-eims_csrf') jar.csrf = v;
  }
  return jar;
}

/** Enrols the authenticator through the API; the session becomes a second-factor session. */
async function enrolTotp(jar: Jar): Promise<string> {
  const setup = await (await call('POST', 'totp/setup', { jar, body: {} })).json();
  expect(setup.secret, JSON.stringify(setup)).toBeTruthy();
  const r = await call('POST', 'totp/enable', { jar, body: { code: totpCode(setup.secret, Date.now()) } });
  expect(r.status).toBe(200);
  return setup.secret;
}

describe('the feature is off unless explicitly enabled, and always off in production', () => {
  it('flag missing or not exactly "true" → 404 on every route', async () => {
    vi.stubEnv('ACCOUNTS_ENABLED', '1');
    expect((await call('POST', 'login', { body: {} })).status).toBe(404);
    expect((await call('GET', 'me')).status).toBe(404);
  });
  it('production → 404 even with the flag set', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    expect((await call('POST', 'signup', { body: { email: 'x@test.example', password: TEST_PASSWORD } })).status).toBe(404);
  });
  it('no secret key → 503; unknown route → 404', async () => {
    vi.stubEnv('ACCOUNTS_SECRET_KEY', 'short');
    expect((await call('GET', 'me')).status).toBe(503);
    vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
    expect((await call('GET', 'no/such/route')).status).toBe(404);
  });
});

describe('cross-site requests and CSRF', () => {
  it('state-changing requests without this site as Origin are refused (login CSRF too)', async () => {
    expect((await call('POST', 'login', { body: {}, origin: null })).status).toBe(403);
    expect((await call('POST', 'login', { body: {}, origin: 'https://evil.test' })).status).toBe(403);
    expect((await call('POST', 'login', { body: {}, headers: { 'sec-fetch-site': 'cross-site' } })).status).toBe(403);
  });
  it('session cookies are __Host-, Secure; session HttpOnly + Lax; CSRF Strict', async () => {
    await call('POST', 'signup', { body: { email: 'cookie@test.example', password: TEST_PASSWORD } });
    await call('POST', 'verify-email', { body: { token: mailer.lastToken('cookie@test.example', 'verify_email') } });
    const res = await call('POST', 'login', { body: { email: 'cookie@test.example', password: TEST_PASSWORD } });
    const [s, c] = [cookiesOf(res).find((x) => x.startsWith('__Host-eims_session='))!, cookiesOf(res).find((x) => x.startsWith('__Host-eims_csrf='))!];
    expect(s).toMatch(/HttpOnly/i); expect(s).toMatch(/Secure/i); expect(s).toMatch(/SameSite=lax/i); expect(s).toMatch(/Path=\//); expect(s).not.toMatch(/Domain=/i);
    expect(c).not.toMatch(/HttpOnly/i); expect(c).toMatch(/Secure/i); expect(c).toMatch(/SameSite=strict/i);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('x-robots-tag')).toMatch(/noindex/);
  });
  it('a session request: no cookie → 401; no or wrong CSRF token on a change → 403; right token → 200', async () => {
    const jar = await signedIn('csrf@test.example');
    expect((await call('GET', 'me')).status).toBe(401);
    expect((await call('GET', 'me', { jar })).status).toBe(200); // reads need no token
    expect((await call('POST', 'orgs', { jar, body: { name: 'TEST Org' }, csrf: null })).status).toBe(403);
    expect((await call('POST', 'orgs', { jar, body: { name: 'TEST Org' }, csrf: 'A'.repeat(43) })).status).toBe(403);
    expect((await call('POST', 'orgs', { jar, body: { name: 'TEST Org' } })).status).toBe(200);
  });
  it('logout invalidates the session server-side (the old cookie no longer works)', async () => {
    const jar = await signedIn('logout@test.example');
    const out = await call('POST', 'logout', { jar });
    expect(out.status).toBe(200);
    expect(cookiesOf(out).some((c) => /__Host-eims_session=;/.test(c) && /Max-Age=0/i.test(c))).toBe(true);
    expect((await call('GET', 'me', { jar })).status).toBe(401);
  });
  it('each sign-in issues a new session token (no fixation)', async () => {
    const a = await signedIn('fix@test.example');
    const res = await call('POST', 'login', { body: { email: 'fix@test.example', password: TEST_PASSWORD } });
    const s2 = cookiesOf(res).find((x) => x.startsWith('__Host-eims_session='))!.split(';')[0].split('=')[1];
    expect(s2).not.toBe(a.session);
  });
});

describe('organisation isolation over HTTP', () => {
  it('a member of another organisation cannot list, read or change its projects (404, not 403: nothing is revealed)', async () => {
    const owner = await signedIn('iso-owner@test.example');
    const other = await signedIn('iso-other@test.example');
    const org = (await (await call('POST', 'orgs', { jar: owner, body: { name: 'TEST Iso' } })).json()).id as string;
    // Owners must use the second factor: refused before enrolling, allowed after.
    const before = await call('GET', `orgs/${org}/projects`, { jar: owner });
    expect(before.status).toBe(403);
    expect((await before.json()).needMfa).toBe(true);
    await enrolTotp(owner);
    const proj = (await (await call('POST', `orgs/${org}/projects`, { jar: owner, body: { tool: 'building', name: 'TEST', content: { a: 1 } } })).json()).id as string;
    expect((await call('GET', `orgs/${org}/projects`, { jar: owner })).status).toBe(200);
    for (const [m, path, body] of [
      ['GET', `orgs/${org}/projects`, undefined], ['GET', `orgs/${org}/projects/${proj}`, undefined],
      ['POST', `orgs/${org}/projects/${proj}/autosave`, { baseVersion: 1, content: { a: 2 } }], ['POST', `orgs/${org}/projects/${proj}/delete`, {}],
      ['GET', `orgs/${org}/audit`, undefined], ['GET', `orgs/${org}/members`, undefined],
    ] as const) {
      const r = await call(m, path, { jar: other, body });
      expect(r.status, `${m} ${path}`).toBe(404);
    }
  });
});

describe('request bodies and errors', () => {
  it('non-JSON → 415; arrays → 400; malformed JSON → 400; too large → 413', async () => {
    const jar = await signedIn('body@test.example');
    expect((await call('POST', 'orgs', { jar, raw: 'name=x', headers: { 'content-type': 'application/x-www-form-urlencoded' } })).status).toBe(415);
    expect((await call('POST', 'orgs', { jar, raw: '[1]', headers: { 'content-type': 'application/json' } })).status).toBe(400);
    expect((await call('POST', 'orgs', { jar, raw: '{bad', headers: { 'content-type': 'application/json' } })).status).toBe(400);
    expect((await call('POST', 'orgs', { jar, raw: JSON.stringify({ name: 'x'.repeat(4_100_000) }), headers: { 'content-type': 'application/json' } })).status).toBe(413);
  });
  it('sign-in failures are generic (no hint whether the email exists)', async () => {
    await signedIn('known@test.example');
    const a = await (await call('POST', 'login', { body: { email: 'known@test.example', password: 'wrong password here' } })).json();
    const b = await (await call('POST', 'login', { body: { email: 'nobody@test.example', password: 'wrong password here' } })).json();
    expect(a.error).toBe(b.error);
  });
});

describe('attachments download safely', () => {
  it('uploaded files are served as downloads only, with a sandbox policy, never rendered', async () => {
    const jar = await signedIn('att@test.example');
    const org = (await (await call('POST', 'orgs', { jar, body: { name: 'TEST Att' } })).json()).id as string;
    await enrolTotp(jar);
    const proj = (await (await call('POST', `orgs/${org}/projects`, { jar, body: { tool: 'building', name: 'TEST', content: { a: 1 } } })).json()).id as string;
    const bytes = new TextEncoder().encode('%PDF-1.4 TEST');
    const { createHash } = await import('node:crypto');
    const sha = createHash('sha256').update(bytes).digest('hex');
    const start = await (await call('POST', `orgs/${org}/projects/${proj}/attachments`, { jar, body: { filename: '<script>x</script>.pdf', mediaType: 'application/pdf', sizeBytes: bytes.length, sha256: sha } })).json();
    expect(start.success, JSON.stringify(start)).toBe(true);
    expect((await call('PUT', `orgs/${org}/projects/${proj}/attachments/${start.id}/chunks/0`, { jar, raw: bytes, headers: { 'content-type': 'application/octet-stream' } })).status).toBe(200);
    expect((await call('POST', `orgs/${org}/projects/${proj}/attachments/${start.id}/complete`, { jar, body: {} })).status).toBe(200);
    const dl = await call('GET', `orgs/${org}/projects/${proj}/attachments/${start.id}`, { jar });
    expect(dl.status).toBe(200);
    expect(dl.headers.get('content-type')).toBe('application/octet-stream');
    expect(dl.headers.get('content-disposition')).toMatch(/^attachment; filename="[\w.\- ]+"$/);
    expect(dl.headers.get('content-security-policy')).toMatch(/sandbox/);
    // Byte-for-byte: the download's SHA-256 equals the uploaded file's, and the header says so.
    expect(createHash('sha256').update(Buffer.from(await dl.arrayBuffer())).digest('hex')).toBe(sha);
    expect(dl.headers.get('x-content-sha256')).toBe(sha);
  });
});
