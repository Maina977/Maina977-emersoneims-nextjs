// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.test/accounts"}
/**
 * Report B: the account screens, end to end. The rendered AccountsApp's fetch
 * calls go into the REAL accounts API (app/api/accounts/[...path] → guard →
 * services) on PGlite, with real cookies (__Host- session in a jar, the
 * readable CSRF cookie in document.cookie). TEST data only.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextRequest } from 'next/server';
import { PGlite } from '@electric-sql/pglite';
import { fromPglite, setAccountsDbForTests } from '@/lib/accounts/db';
import { MemoryMailer, setMailerForTests } from '@/lib/accounts/mailer';
import { totpCode } from '@/lib/accounts/crypto';
import { lib, TEST_PASSWORD, TEST_SECRET, TEST_SIGNING_KEY } from '../helpers/accountsTestDb';

// notFound() as Next.js throws it, so the page gate can be observed.
vi.mock('next/navigation', () => ({ notFound: () => { throw new Error('NEXT_NOT_FOUND'); } }));

// Real scrypt for every account: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 90_000, hookTimeout: 60_000 });

const ORIGIN = 'https://preview.test';
let mailer: MemoryMailer;
let session = '';
const requests: string[] = [];

beforeAll(async () => {
  const pg = new PGlite();
  await lib.applyMigrations(pg);
  setAccountsDbForTests(fromPglite(pg));
  mailer = new MemoryMailer();
  setMailerForTests(mailer);
  const route = await import('@/app/api/accounts/[...path]/route');
  // fetch → the real route, as a browser on this site would send it.
  vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => {
    const method = (init.method ?? 'GET').toUpperCase();
    requests.push(`${method} ${url}`);
    const h = new Headers(init.headers);
    h.set('origin', ORIGIN);
    if (session) h.set('cookie', `__Host-eims_session=${session}`);
    const u = new URL(url, ORIGIN);
    const path = u.pathname.replace(/^\/api\/accounts\//, '').split('/');
    const req = new NextRequest(u.toString(), { method, headers: h, body: init.body as BodyInit | undefined });
    const fn = (route as unknown as Record<string, (r: NextRequest, c: { params: Promise<{ path: string[] }> }) => Promise<Response>>)[method];
    const res = await fn(req, { params: Promise.resolve({ path }) });
    for (const c of (res.headers as Headers & { getSetCookie(): string[] }).getSetCookie()) {
      const [kv] = c.split(';'); const [k, v] = kv.split('=');
      if (k === '__Host-eims_session') session = v;
      if (k === '__Host-eims_csrf') document.cookie = `__Host-eims_csrf=${v}; Secure; Path=/`;
    }
    return res;
  });
});
afterAll(() => { setAccountsDbForTests(null); setMailerForTests(null); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
beforeEach(() => {
  cleanup();
  vi.stubEnv('ACCOUNTS_ENABLED', 'true');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
  vi.stubEnv('ACCOUNTS_PUBLIC_ORIGIN', ORIGIN);
});

const type = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('account screens', () => {
  it('the page is not found unless accounts are enabled, and never in production', async () => {
    const { default: Page } = await import('@/app/accounts/page');
    vi.stubEnv('ACCOUNTS_ENABLED', 'false');
    expect(() => Page()).toThrow('NEXT_NOT_FOUND');
    vi.stubEnv('ACCOUNTS_ENABLED', 'true'); vi.stubEnv('VERCEL_ENV', 'production');
    expect(() => Page()).toThrow('NEXT_NOT_FOUND');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(() => Page()).not.toThrow();
  });

  it('sign up → verify from the email link → sign in → second factor → organisation, members, projects, audit', async () => {
    const { default: AccountsApp } = await import('@/components/accounts/AccountsApp');
    const email = 'ui-owner@test.example';

    // 1. Create an account.
    window.history.replaceState(null, '', '/accounts');
    const first = render(<AccountsApp />);
    await screen.findByRole('form', { name: 'Sign in' });
    fireEvent.click(screen.getByRole('tab', { name: 'Create account' }));
    type(/^Your name/, 'TEST Owner'); type(/^Email/, email); type(/^Password \(at least 12/, TEST_PASSWORD);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await screen.findByRole('status');
    first.unmount();

    // 2. The link from the email.
    window.history.replaceState(null, '', `/accounts?view=verify&token=${mailer.lastToken(email, 'verify_email')}`);
    const second = render(<AccountsApp />);
    fireEvent.click(await screen.findByRole('button', { name: 'Verify my email' }));
    await screen.findByText(/Your email is verified/);
    second.unmount();

    // 3. Sign in.
    window.history.replaceState(null, '', '/accounts');
    render(<AccountsApp />);
    await screen.findByRole('form', { name: 'Sign in' });
    type(/^Email/, email); type(/^Password$/, TEST_PASSWORD);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await screen.findByText(email);

    // 4. Second factor.
    fireEvent.click(screen.getByRole('button', { name: 'Set up an authenticator app' }));
    const key = (await screen.findByLabelText('Setup key')).textContent!;
    type(/The 6-digit code/, totpCode(key, Date.now()));
    fireEvent.click(screen.getByRole('button', { name: 'Turn on' }));
    await screen.findByText(/Authenticator app enabled and used for this session/);

    // 5. Organisation (the creator is its owner; owners need the second factor, which this session has).
    type(/^New organisation/, 'TEST UI Org');
    fireEvent.click(screen.getAllByRole('button', { name: 'Create' })[0]);
    await screen.findByRole('heading', { name: 'Members' });
    await waitFor(() => expect(screen.getByText('TEST Owner')).toBeTruthy());

    // 6. A project appears in the list.
    type(/^New project name/, 'TEST UI project');
    fireEvent.click(screen.getAllByRole('button', { name: 'Create' })[1]);
    await screen.findByText('TEST UI project');

    // Revisions of it.
    fireEvent.click(screen.getByRole('button', { name: 'Revisions' }));
    await screen.findByText(/Version 1 \(current\)/);
    // No approve form: this user is not a verified reviewer.
    expect(screen.queryByRole('button', { name: 'Approve this revision' })).toBeNull();

    // 7. Audit trail (owner).
    fireEvent.click(screen.getByRole('button', { name: /Show the audit trail/ }));
    await screen.findByText(/org\.created/);

    // Every request went through the API; no request loop.
    const orgsLoads = requests.filter((r) => r === 'GET /api/accounts/orgs').length;
    expect(orgsLoads).toBeLessThan(5);
  });
});

describe('professional approval screens (each step by the right person, in their own session)', () => {
  it('reviewer registers (pending) → registry admin verifies → reviewer approves the exact revision → owner sees FOR ISSUE', async () => {
    vi.stubEnv('PROPOSAL_APPROVAL_SIGNING_KEY', TEST_SIGNING_KEY); // as a configured preview would have; without it approvals are refused (fail closed)
    const { default: AccountsApp } = await import('@/components/accounts/AccountsApp');
    const auth = await import('@/lib/accounts/auth');
    const orgs = await import('@/lib/accounts/orgs');
    const projects = await import('@/lib/accounts/projects');
    const { getAccountsDb } = await import('@/lib/accounts/db');
    const db = (await getAccountsDb())!;
    const ctx = { db, secret: TEST_SECRET, mailer, now: () => new Date(), env: process.env as Record<string, string | undefined>, origin: ORIGIN };

    // Setup through the services (real clock): three people with authenticators, one organisation, one Solar project.
    const people: Record<string, { secret: string; token: string }> = {};
    for (const who of ['owner', 'reviewer', 'registry']) {
      const email = `ap-${who}@test.example`;
      await auth.signup(ctx, { email, password: TEST_PASSWORD, displayName: `TEST ${who}` }, `ip-${who}`);
      await auth.verifyEmail(ctx, mailer.lastToken(email, 'verify_email'));
      if (who === 'registry') await db.query('UPDATE acct_users SET is_registry_admin = TRUE WHERE email = $1', [email]);
      const s = await auth.login(ctx, { email, password: TEST_PASSWORD }, `ip-${who}`);
      if ('needTotp' in s) throw new Error('unexpected');
      const actor = (await auth.sessionActor(ctx, s.token))!;
      const { secret } = await auth.totpSetup(ctx, actor);
      await auth.totpEnable(ctx, actor, totpCode(secret, Date.now() - 30_000)); // the previous step: later codes stay unused
      people[who] = { secret, token: s.token };
    }
    const ownerActor = (await auth.sessionActor(ctx, people.owner.token))!;
    const org = (await orgs.createOrg(ctx, ownerActor, 'TEST Approval Org')).id;
    await orgs.invite(ctx, ownerActor, org, { email: 'ap-reviewer@test.example', role: 'engineer' });
    await orgs.acceptInvite(ctx, (await auth.sessionActor(ctx, people.reviewer.token))!, mailer.lastToken('ap-reviewer@test.example', 'invite'));
    await projects.createProject(ctx, ownerActor, org, { tool: 'solar', name: 'TEST approval proposal', content: { pvKwp: 5, note: 'TEST' } });

    // Signs in through the screen with a code (first time), or returns to that person's
    // existing browser session (later), as a real browser keeps its cookies.
    const jars: Record<string, { session: string; csrf: string }> = {};
    const csrfNow = () => (document.cookie.match(/__Host-eims_csrf=([^;]+)/) ?? [])[1] ?? '';
    const signIn = async (who: string, ahead: number) => {
      cleanup();
      window.history.replaceState(null, '', '/accounts');
      if (jars[who]) {
        session = jars[who].session; document.cookie = `__Host-eims_csrf=${jars[who].csrf}; Secure; Path=/`;
        render(<AccountsApp />);
        await screen.findByText(`ap-${who}@test.example`);
        return;
      }
      session = ''; document.cookie = '__Host-eims_csrf=; Max-Age=0; Path=/; Secure';
      render(<AccountsApp />);
      await screen.findByRole('form', { name: 'Sign in' });
      type(/^Email/, `ap-${who}@test.example`); type(/^Password$/, TEST_PASSWORD);
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
      await screen.findByLabelText(/Authenticator code/);
      type(/Authenticator code/, totpCode(people[who].secret, Date.now() + ahead * 30_000));
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
      await screen.findByText(`ap-${who}@test.example`);
      jars[who] = { session, csrf: csrfNow() };
    };
    const code = (who: string, ahead: number) => totpCode(people[who].secret, Date.now() + ahead * 30_000);

    // 1. The reviewer registers: pending, and no approve form yet.
    await signIn('reviewer', 0);
    await screen.findByRole('heading', { name: 'Professional reviewers' });
    type(/^Legal name/, 'TEST Approving Engineer'); type(/^Registration number/, 'TEST-UI-77');
    fireEvent.click(screen.getByLabelText('Solar proposals'));
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    await screen.findByText(/Profile registered: pending verification/);
    await screen.findByText('pending');

    // 2. The registry administrator verifies (fresh code).
    await signIn('registry', 0);
    await screen.findByRole('heading', { name: /Reviewer registry/ });
    fireEvent.click(await screen.findByLabelText(/I have checked the identity document/));
    type(/^Evidence reference/, 'TEST evidence file 77');
    type(/^Fresh authenticator code/, code('registry', 1));
    type(/^Registration valid from/, '2026-01-01'); type(/^Valid until/, '2027-12-31');
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    await screen.findByText('Reviewer verified.');

    // 3. The reviewer approves this exact revision (fresh code).
    await signIn('reviewer', 1);
    fireEvent.click(await screen.findByRole('button', { name: 'Revisions' }));
    await screen.findByText(/You are approving revision 1 exactly/);
    type(/^Fresh authenticator code/, code('reviewer', 1));
    fireEvent.click(screen.getByRole('button', { name: 'Approve this revision' }));
    await waitFor(() => {
      const alerts = screen.queryAllByRole('alert').map((x) => x.textContent).join(' | ');
      expect(screen.queryByText('Approved: this exact revision only.'), `alerts: ${alerts}`).not.toBeNull();
    });

    // 4. The owner sees FOR ISSUE with the reviewer named.
    await signIn('owner', 0);
    fireEvent.click(await screen.findByRole('button', { name: 'Revisions' }));
    await screen.findByText('FOR ISSUE');
    await screen.findByText(/Approved by TEST Approving Engineer \(EBK TEST-UI-77\)/);
  });
});
