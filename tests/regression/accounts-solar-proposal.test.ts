/**
 * Report B: Solar Genius Pro proposals become FOR ISSUE only through a
 * verified, revision-specific approval found by the SERVER. Drives the real
 * /api/solar/proposal route with a real session cookie, on PGlite. TEST data
 * only: no real names or registration numbers.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { newTestEnv, makeUser, freshCode, TEST_SECRET, TEST_SIGNING_KEY, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { setAccountsDbForTests } from '@/lib/accounts/db';
import { createOrg, invite, acceptInvite } from '@/lib/accounts/orgs';
import { createProject } from '@/lib/accounts/projects';
import { approveRevision, registerReviewer, suspendReviewer, verifyReviewer } from '@/lib/accounts/reviewers';
import { formToProposalInput, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_PRODUCTION } from '@/lib/solar/design/proposalForm';
import type { ProposalInput } from '@/lib/solar/design/proposal';

// Real scrypt for every test user: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });

const input = (): ProposalInput => {
  const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
  if (!r.input) throw new Error(r.errors.join('; '));
  return JSON.parse(JSON.stringify(r.input)); // as stored and as sent: JSON
};

let env: TestEnv; let owner: TestUser; let reviewer: TestUser; let outsider: TestUser; let admin: TestUser;
let orgId: string; let reviewerId: string;
let route: typeof import('@/app/api/solar/proposal/route');

beforeAll(async () => {
  env = await newTestEnv();
  // The route uses the real clock (sessions expire after 2 h idle), so setup runs on real time too.
  env.clock.t = Date.now();
  setAccountsDbForTests(env.db);
  owner = await makeUser(env, 'sp-owner@test.example', { totp: true });
  reviewer = await makeUser(env, 'sp-reviewer@test.example', { totp: true });
  outsider = await makeUser(env, 'sp-outsider@test.example', { totp: true });
  admin = await makeUser(env, 'sp-registry@test.example', { totp: true, registryAdmin: true });
  orgId = (await createOrg(env.ctx, owner.actor, 'TEST Solar Org')).id;
  await createOrg(env.ctx, outsider.actor, 'TEST Other Org');
  await invite(env.ctx, owner.actor, orgId, { email: reviewer.email, role: 'engineer' });
  await acceptInvite(env.ctx, reviewer.actor, env.mailer.lastToken(reviewer.email, 'invite'));
  reviewerId = (await registerReviewer(env.ctx, reviewer.actor, orgId, { legalName: 'TEST Solar Reviewer', professionalBody: 'EBK', registrationNumber: 'TEST-SP-1', scope: [{ tool: 'solar', documentType: 'proposal' }] })).id;
  await verifyReviewer(env.ctx, admin.actor, reviewerId, { identityCheckStatus: 'checked', evidenceRef: 'TEST evidence', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, admin) });
  // The exact proposal input, saved as a project revision and approved.
  const p = await createProject(env.ctx, owner.actor, orgId, { tool: 'solar', name: 'TEST proposal', content: input() });
  await approveRevision(env.ctx, reviewer.actor, orgId, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewer) });
  route = await import('@/app/api/solar/proposal/route');
});
afterAll(() => { setAccountsDbForTests(null); vi.unstubAllEnvs(); });
beforeEach(() => {
  vi.stubEnv('ACCOUNTS_ENABLED', 'true');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
  vi.stubEnv('PROPOSAL_APPROVAL_SIGNING_KEY', TEST_SIGNING_KEY);
});

let ip = 0;
async function propose(body: unknown, session?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json', 'x-forwarded-for': `10.9.0.${++ip}` };
  if (session) headers.cookie = `__Host-eims_session=${session}`;
  const r = await route.POST(new NextRequest('https://preview.test/api/solar/proposal', { method: 'POST', headers, body: JSON.stringify(body) }));
  return { status: r.status, body: r.status === 200 ? await r.json() : await r.text() };
}

describe('Solar proposal status from verified, revision-specific approvals', () => {
  it('a member of the approving organisation gets FOR ISSUE for the exact approved input, naming the reviewer', async () => {
    const r = await propose({ format: 'json', input: input() }, owner.token);
    expect(r.status).toBe(200);
    expect(r.body.status, JSON.stringify(r.body.statusReasons)).toBe('FOR ISSUE');
    expect(r.body.approval).toMatchObject({ reviewerId, reviewerName: 'TEST Solar Reviewer', registration: 'EBK TEST-SP-1' });
  });

  it('any change to the input is a different revision: DRAFT', async () => {
    const changed = input() as unknown as Record<string, unknown>;
    changed.reference = `${String(changed.reference ?? 'TEST')}-changed`;
    const r = await propose({ format: 'json', input: changed }, owner.token);
    expect(r.body.status).toBe('DRAFT');
    expect(r.body.approval).toBeNull();
  });

  it('not signed in, or signed in to another organisation: DRAFT', async () => {
    expect((await propose({ format: 'json', input: input() })).body.status).toBe('DRAFT');
    expect((await propose({ format: 'json', input: input() }, outsider.token)).body.status).toBe('DRAFT');
  });

  it('production (accounts hard-off) and accounts disabled: DRAFT, exactly as today', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    expect((await propose({ format: 'json', input: input() }, owner.token)).body.status).toBe('DRAFT');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('ACCOUNTS_ENABLED', 'false');
    expect((await propose({ format: 'json', input: input() }, owner.token)).body.status).toBe('DRAFT');
  });

  it('a client-sent approval is still refused (400), even a validly signed copy of the real one', async () => {
    const ok = await propose({ format: 'json', input: input() }, owner.token);
    const r = await propose({ format: 'json', input: { ...input(), verifiedApproval: { ...ok.body.approval, signature: 'x' } } }, owner.token);
    expect(r.status).toBe(400);
  });

  it('no signing key on the server: DRAFT', async () => {
    vi.stubEnv('PROPOSAL_APPROVAL_SIGNING_KEY', '');
    expect((await propose({ format: 'json', input: input() }, owner.token)).body.status).toBe('DRAFT');
  });

  it('FOR ISSUE holds on a repeat request; suspending the reviewer returns it to DRAFT', async () => {
    expect((await propose({ format: 'json', input: input() }, owner.token)).body.status).toBe('FOR ISSUE');
    await suspendReviewer(env.ctx, admin.actor, reviewerId, 'TEST suspension');
    expect((await propose({ format: 'json', input: input() }, owner.token)).body.status).toBe('DRAFT');
  });
});
