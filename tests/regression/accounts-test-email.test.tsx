// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.test/accounts"}
/**
 * Report B preview authorisation, items 5 and 6: the preview's test-email
 * workflow. No test mailer is installed here: the real mode resolution and the
 * real outbox are used. Verification goes through the REAL emailed link and
 * the real endpoint, never a database shortcut. TEST data only.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NextRequest } from 'next/server';
import { PGlite } from '@electric-sql/pglite';
import { fromPglite, setAccountsDbForTests, type AccountsDb } from '@/lib/accounts/db';
import { setMailerForTests } from '@/lib/accounts/mailer';
import { isTestAddress, mailMode, resolveMailer, testDomains } from '@/lib/accounts/testMail';
import { lib, TEST_PASSWORD, TEST_SECRET } from '../helpers/accountsTestDb';

// Real scrypt: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });

const sent: Array<Record<string, unknown>> = [];
vi.mock('nodemailer', () => ({ createTransport: () => ({ sendMail: async (o: Record<string, unknown>) => { sent.push(o); return {}; } }) }));

const ORIGIN = 'https://preview.test';
let pg: PGlite; let db: AccountsDb;
let route: typeof import('@/app/api/accounts/[...path]/route');
let session = '';

beforeAll(async () => {
  pg = new PGlite();
  await lib.applyMigrations(pg);
  db = fromPglite(pg);
  setAccountsDbForTests(db);
  setMailerForTests(null); // the real resolver decides
  route = await import('@/app/api/accounts/[...path]/route');
  vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => call((init.method ?? 'GET').toUpperCase(), String(url).replace(/^\/api\/accounts\//, ''), init.body ? JSON.parse(String(init.body)) : undefined));
});
afterAll(() => { setAccountsDbForTests(null); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
beforeEach(() => {
  cleanup();
  vi.stubEnv('ACCOUNTS_ENABLED', 'true');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
  vi.stubEnv('ACCOUNTS_PUBLIC_ORIGIN', ORIGIN);
  vi.stubEnv('ACCOUNTS_MAIL_MODE', 'outbox');
  vi.stubEnv('ACCOUNTS_TEST_EMAIL_DOMAINS', 'test.example, qa.test.example');
});

async function call(method: string, path: string, body?: unknown): Promise<Response> {
  const h = new Headers({ origin: ORIGIN });
  if (body !== undefined) h.set('content-type', 'application/json');
  if (session) h.set('cookie', `__Host-eims_session=${session}`);
  const u = new URL(`${ORIGIN}/api/accounts/${path}`);
  const req = new NextRequest(u.toString(), { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  const fn = (route as unknown as Record<string, (r: NextRequest, c: { params: Promise<{ path: string[] }> }) => Promise<Response>>)[method];
  return fn(req, { params: Promise.resolve({ path: u.pathname.replace(/^\/api\/accounts\//, '').split('/') }) });
}
const outbox = async (email: string) => (await (await call('GET', `test-outbox?email=${encodeURIComponent(email)}`)).json()) as { success: boolean; messages: { kind: string; text: string }[]; error?: string };
const outboxRows = async () => (await pg.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_test_outbox')).rows[0].n;

describe('settings', () => {
  it('modes are exact; domains are parsed; addresses match whole domains only', () => {
    expect(mailMode({ ACCOUNTS_MAIL_MODE: 'outbox' })).toBe('outbox');
    expect(mailMode({ ACCOUNTS_MAIL_MODE: 'OUTBOX' })).toBe('none');
    expect(mailMode({})).toBe('none');
    // 'bad' (no dot) and 'x.y' (one-letter top-level domain) are not domains and are dropped.
    expect(testDomains({ ACCOUNTS_TEST_EMAIL_DOMAINS: ' Test.Example ,bad, x.y, qa.example ' })).toEqual(['test.example', 'qa.example']);
    const env = { ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example' };
    expect(isTestAddress('a@test.example', env)).toBe(true);
    expect(isTestAddress('a@nottest.example', env)).toBe(false);
    expect(isTestAddress('a@test.example.com', env)).toBe(false);
  });
});

describe('outbox mode: the real verification workflow, through the emailed link', () => {
  it('sign up → message in the outbox → open its link → address verified → sign in', async () => {
    const email = 'flow@test.example';
    expect((await call('POST', 'signup', { email, password: TEST_PASSWORD, displayName: 'TEST' })).status).toBe(200);
    // Not verified yet: sign-in refused.
    expect((await call('POST', 'login', { email, password: TEST_PASSWORD })).status).toBe(401);
    const box = await outbox(email);
    expect(box.messages).toHaveLength(1);
    expect(box.messages[0].kind).toBe('verify_email');
    const link = box.messages[0].text.match(/https:\/\/preview\.test\/accounts\?view=verify&token=([A-Za-z0-9_-]+)/);
    expect(link).not.toBeNull();
    // Exactly what the page does when the link is opened.
    expect((await call('POST', 'verify-email', { token: link![1] })).status).toBe(200);
    expect((await call('POST', 'login', { email, password: TEST_PASSWORD })).status).toBe(200);
    // The same link works once.
    expect((await call('POST', 'verify-email', { token: link![1] })).status).toBe(400);
  });

  it('password reset goes through the outbox link too', async () => {
    const email = 'reset@test.example';
    await call('POST', 'signup', { email, password: TEST_PASSWORD });
    const v = (await outbox(email)).messages[0].text.match(/token=([A-Za-z0-9_-]+)/)![1];
    await call('POST', 'verify-email', { token: v });
    await call('POST', 'password/reset-request', { email });
    const r = (await outbox(email)).messages.find((m) => m.kind === 'reset_password')!;
    const t = r.text.match(/view=reset&token=([A-Za-z0-9_-]+)/)![1];
    expect((await call('POST', 'password/reset', { token: t, password: 'a brand new TEST password' })).status).toBe(200);
    expect((await call('POST', 'login', { email, password: 'a brand new TEST password' })).status).toBe(200);
  });

  it('a real-looking address cannot sign up; nothing is stored or sent', async () => {
    const before = await outboxRows();
    const r = await call('POST', 'signup', { email: 'customer@gmail.com', password: TEST_PASSWORD });
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/only test addresses/);
    expect(await outboxRows()).toBe(before);
    expect((await pg.query("SELECT 1 FROM acct_users WHERE email = 'customer@gmail.com'")).rows.length).toBe(0);
  });

  it('second line of defence: the outbox mailer itself refuses a non-test recipient', async () => {
    const before = await outboxRows();
    await resolveMailer({ ACCOUNTS_MAIL_MODE: 'outbox', ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example' }, db).send({ to: 'someone@realcompany.co.ke', kind: 'invite', subject: 'x', text: 'x' });
    expect(await outboxRows()).toBe(before);
  });

  it('the outbox only answers for test addresses, and only in outbox mode', async () => {
    expect((await call('GET', 'test-outbox?email=someone%40gmail.com')).status).toBe(400);
    vi.stubEnv('ACCOUNTS_MAIL_MODE', 'none');
    expect((await call('GET', 'test-outbox?email=flow%40test.example')).status).toBe(404);
    const info = await (await call('GET', 'mail-mode')).json();
    expect(info).toMatchObject({ mode: 'none', testDomains: [] });
  });

  it('outbox mode without a domain list refuses sign-ups (fails closed)', async () => {
    vi.stubEnv('ACCOUNTS_TEST_EMAIL_DOMAINS', '');
    expect((await call('POST', 'signup', { email: 'x@test.example', password: TEST_PASSWORD })).status).toBe(503);
  });
});

describe('smtp mode: a dedicated test sender, test addresses only', () => {
  it('sends to test addresses marked [TEST]; refuses everyone else; unconfigured → withheld', async () => {
    sent.length = 0;
    const env = { ACCOUNTS_MAIL_MODE: 'smtp', ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example', ACCOUNTS_SMTP_URL: 'smtps://user:pass@smtp.test.example:465', ACCOUNTS_MAIL_FROM: 'preview@test.example' };
    const m = resolveMailer(env, db);
    await m.send({ to: 'a@test.example', kind: 'verify_email', subject: 'Verify', text: 'link' });
    await m.send({ to: 'b@customer.co.ke', kind: 'verify_email', subject: 'Verify', text: 'link' });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ to: 'a@test.example', from: 'preview@test.example', subject: '[TEST] Verify' });
    sent.length = 0;
    await resolveMailer({ ...env, ACCOUNTS_SMTP_URL: '' }, db).send({ to: 'a@test.example', kind: 'verify_email', subject: 'x', text: 'x' });
    expect(sent).toHaveLength(0);
  });
});

describe('the test outbox screen', () => {
  it('shows the message for a test address with its real link', async () => {
    session = '';
    await call('POST', 'signup', { email: 'screen@test.example', password: TEST_PASSWORD });
    const { default: AccountsApp } = await import('@/components/accounts/AccountsApp');
    window.history.replaceState(null, '', '/accounts');
    render(<AccountsApp />);
    await screen.findByRole('heading', { name: 'Test email outbox (preview)' });
    fireEvent.change(screen.getByLabelText('Test address'), { target: { value: 'screen@test.example' } });
    fireEvent.click(screen.getByRole('button', { name: 'Show messages' }));
    const link = await screen.findByRole('link', { name: 'Open the link in this message' });
    expect(link.getAttribute('href')).toMatch(/^https:\/\/preview\.test\/accounts\?view=verify&token=[A-Za-z0-9_-]{43}$/);
  });
});
