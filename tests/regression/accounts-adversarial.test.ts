/**
 * Report B preview authorisation, item 8: adversarial tests. Each attack is
 * attempted the way an attacker would and must fail: impersonation, privilege
 * escalation, cross-organisation access, replay, revoked approvals.
 * HTTP-level attacks drive the real route on PGlite; the rest call the
 * services directly. TEST data only.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { newTestEnv, makeUser, freshCode, TEST_PASSWORD, TEST_SECRET, TEST_SIGNING_KEY, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { setAccountsDbForTests } from '@/lib/accounts/db';
import { setMailerForTests } from '@/lib/accounts/mailer';
import { login, requestPasswordReset, resetPassword, sessionActor, verifyEmail, signup } from '@/lib/accounts/auth';
import { acceptInvite, changeRole, createOrg, invite, listMembers } from '@/lib/accounts/orgs';
import { autosave, completeAttachment, createProject, getAttachment, getProject, putAttachmentChunk, readAudit, startAttachment } from '@/lib/accounts/projects';
import { approvalStatus, approveRevision, registerReviewer, revokeApproval, verifyReviewer, listRegistry, suspendReviewer } from '@/lib/accounts/reviewers';
import { regenerateRecoveryCodes } from '@/lib/accounts/recovery';
import { totpCode } from '@/lib/accounts/crypto';
import { createHash } from 'node:crypto';

// Real scrypt for every test user: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 90_000, hookTimeout: 90_000 });

async function rejects(p: Promise<unknown>, status: number | number[], msg?: RegExp) {
  try { await p; } catch (e) {
    const err = e as { status?: number; message: string };
    expect(Array.isArray(status) ? status : [status], err.message).toContain(err.status);
    if (msg) expect(err.message).toMatch(msg);
    return err;
  }
  throw new Error(`expected a ${String(status)} rejection`);
}

let env: TestEnv;
let ownerA: TestUser, adminA: TestUser, viewerA: TestUser, reviewerA: TestUser, ownerB: TestUser, registry: TestUser;
let orgA: string, orgB: string;
let projA: { id: string; revisionId: string; contentSha256: string };
let projB: { id: string; revisionId: string; contentSha256: string };
let reviewerId: string;

beforeAll(async () => {
  env = await newTestEnv();
  env.clock.t = Date.now(); // HTTP attacks use the real clock
  setAccountsDbForTests(env.db);
  setMailerForTests(env.mailer);
  ownerA = await makeUser(env, 'adv-owner-a@test.example', { totp: true });
  adminA = await makeUser(env, 'adv-admin-a@test.example', { totp: true });
  viewerA = await makeUser(env, 'adv-viewer-a@test.example', { totp: true });
  reviewerA = await makeUser(env, 'adv-reviewer-a@test.example', { totp: true });
  ownerB = await makeUser(env, 'adv-owner-b@test.example', { totp: true });
  registry = await makeUser(env, 'adv-registry@test.example', { totp: true, registryAdmin: true });
  orgA = (await createOrg(env.ctx, ownerA.actor, 'TEST Adv A')).id;
  orgB = (await createOrg(env.ctx, ownerB.actor, 'TEST Adv B')).id;
  for (const [u, role] of [[adminA, 'admin'], [viewerA, 'viewer'], [reviewerA, 'engineer']] as const) {
    await invite(env.ctx, ownerA.actor, orgA, { email: u.email, role });
    await acceptInvite(env.ctx, u.actor, env.mailer.lastToken(u.email, 'invite'));
  }
  projA = await createProject(env.ctx, ownerA.actor, orgA, { tool: 'solar', name: 'TEST A', content: { pvKwp: 5 } });
  projB = await createProject(env.ctx, ownerB.actor, orgB, { tool: 'solar', name: 'TEST B', content: { pvKwp: 7 } });
  reviewerId = (await registerReviewer(env.ctx, reviewerA.actor, orgA, { legalName: 'TEST Adv Reviewer', professionalBody: 'EBK', registrationNumber: 'TEST-ADV-1', scope: [{ tool: 'solar', documentType: 'proposal' }] })).id;
  await verifyReviewer(env.ctx, registry.actor, reviewerId, { identityCheckStatus: 'checked', evidenceRef: 'TEST', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, registry) });
});
beforeEach(() => {
  vi.stubEnv('ACCOUNTS_ENABLED', 'true');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('ACCOUNTS_SECRET_KEY', TEST_SECRET);
  vi.stubEnv('ACCOUNTS_PUBLIC_ORIGIN', 'https://preview.test');
  vi.stubEnv('PROPOSAL_APPROVAL_SIGNING_KEY', TEST_SIGNING_KEY);
});

async function http(method: string, path: string, opts: { session?: string; csrf?: string; body?: unknown } = {}) {
  const route = await import('@/app/api/accounts/[...path]/route');
  const h: Record<string, string> = { origin: 'https://preview.test', 'content-type': 'application/json' };
  if (opts.session) h.cookie = `__Host-eims_session=${opts.session}`;
  if (opts.csrf) h['x-csrf-token'] = opts.csrf;
  const req = new NextRequest(`https://preview.test/api/accounts/${path}`, { method, headers: h, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  const fn = (route as unknown as Record<string, (r: NextRequest, c: { params: Promise<{ path: string[] }> }) => Promise<Response>>)[method];
  return fn(req, { params: Promise.resolve({ path: path.split('?')[0].split('/') }) });
}

describe('impersonation', () => {
  it('a forged or guessed session token is not a session', async () => {
    expect((await http('GET', 'me', { session: 'A'.repeat(43) })).status).toBe(401);
    expect((await http('GET', 'me', { session: ownerA.token.slice(0, -1) + (ownerA.token.endsWith('A') ? 'B' : 'A') })).status).toBe(401);
  });
  it("another person's CSRF token cannot be used with my session (tokens are bound to their session)", async () => {
    expect((await http('POST', 'orgs', { session: viewerA.token, csrf: ownerA.csrf, body: { name: 'x' } })).status).toBe(403);
  });
  it('a password reset ends every session of that account (stolen session dies)', async () => {
    const victim = await makeUser(env, 'adv-victim@test.example');
    await requestPasswordReset(env.ctx, victim.email, 'ip-adv');
    await resetPassword(env.ctx, env.mailer.lastToken(victim.email, 'reset_password'), 'TEST new password 123');
    expect(await sessionActor(env.ctx, victim.token)).toBeNull();
  });
  it('a request cannot act for someone else by naming them: the server uses the session, not the body', async () => {
    // Register a reviewer profile "for" the owner while signed in as the viewer: it is the viewer's own profile.
    const r = await registerReviewer(env.ctx, viewerA.actor, orgA, { userId: ownerA.userId, legalName: 'TEST Fake', professionalBody: 'EBK', registrationNumber: 'TEST-FAKE', scope: [{ tool: 'solar', documentType: 'proposal' }] });
    const row = (await env.pg.query<{ user_id: string }>('SELECT user_id FROM acct_reviewers WHERE id = $1', [r.id])).rows[0];
    expect(row.user_id).toBe(viewerA.userId);
  });
  it('an unverified address cannot sign in, even with the right password', async () => {
    await signup(env.ctx, { email: 'adv-unverified@test.example', password: TEST_PASSWORD }, 'ip-adv2');
    await expect(login(env.ctx, { email: 'adv-unverified@test.example', password: TEST_PASSWORD }, 'ip-adv2')).rejects.toMatchObject({ status: 401 });
  });
});

describe('privilege escalation', () => {
  it('a viewer cannot invite, change roles or read the audit trail', async () => {
    await rejects(invite(env.ctx, viewerA.actor, orgA, { email: 'x@test.example', role: 'viewer' }), 403);
    await rejects(changeRole(env.ctx, viewerA.actor, orgA, viewerA.userId, 'owner'), 403);
    await rejects(readAudit(env.ctx, viewerA.actor, orgA), 403);
  });
  it('an admin cannot create owners or admins, nor change an owner', async () => {
    await rejects(invite(env.ctx, adminA.actor, orgA, { email: 'y@test.example', role: 'owner' }), 403);
    await rejects(changeRole(env.ctx, adminA.actor, orgA, viewerA.userId, 'admin'), 403);
    await rejects(changeRole(env.ctx, adminA.actor, orgA, ownerA.userId, 'viewer'), 403);
    await rejects(changeRole(env.ctx, adminA.actor, orgA, adminA.userId, 'owner'), 403);
  });
  it('the last owner cannot be demoted', async () => {
    await rejects(changeRole(env.ctx, ownerA.actor, orgA, ownerA.userId, 'viewer'), 400, /at least one owner/);
  });
  it('an owner or admin role needs the second factor in the session', async () => {
    await rejects(listMembers(env.ctx, { ...ownerA.actor, mfa: false }, orgA), 403);
  });
  it('nobody verifies themselves; registry endpoints do not exist for non-administrators', async () => {
    const p = await registerReviewer(env.ctx, ownerB.actor, orgB, { legalName: 'TEST B', professionalBody: 'EBK', registrationNumber: 'TEST-B', scope: [{ tool: 'solar', documentType: 'proposal' }] });
    await rejects(verifyReviewer(env.ctx, ownerB.actor, p.id, { identityCheckStatus: 'checked', evidenceRef: 'x', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, ownerB) }), 404);
    await rejects(listRegistry(env.ctx, ownerA.actor), 404);
    await rejects(suspendReviewer(env.ctx, ownerA.actor, reviewerId, 'x'), 404);
    expect((await http('GET', 'registry/reviewers', { session: ownerA.token })).status).toBe(404);
  });
  it('an unverified reviewer cannot approve; a verified one cannot approve outside their organisation', async () => {
    const p = await registerReviewer(env.ctx, adminA.actor, orgA, { legalName: 'TEST pending', professionalBody: 'EBK', registrationNumber: 'TEST-P', scope: [{ tool: 'solar', documentType: 'proposal' }] });
    void p;
    await rejects(approveRevision(env.ctx, adminA.actor, orgA, projA.id, projA.revisionId, { documentType: 'proposal', revisionHash: projA.contentSha256, totp: freshCode(env, adminA) }), 403, /pending/);
    await rejects(approveRevision(env.ctx, reviewerA.actor, orgB, projB.id, projB.revisionId, { documentType: 'proposal', revisionHash: projB.contentSha256, totp: freshCode(env, reviewerA) }), 404);
  });
});

describe('cross-organisation access', () => {
  it("A's members cannot read or change B's project, even by pairing A's organisation with B's project id", async () => {
    await rejects(getProject(env.ctx, ownerA.actor, orgB, projB.id), 404);
    await rejects(getProject(env.ctx, ownerA.actor, orgA, projB.id), 404);
    await rejects(autosave(env.ctx, ownerA.actor, orgA, projB.id, { baseVersion: 1, content: { pvKwp: 99 } }), 404);
    await rejects(readAudit(env.ctx, ownerA.actor, orgB), 404);
  });
  it("B's attachment cannot be fetched through A's path", async () => {
    const bytes = new Uint8Array([...new TextEncoder().encode('%PDF-1.4 TEST B')]);
    const sha = createHash('sha256').update(bytes).digest('hex');
    const a = await startAttachment(env.ctx, ownerB.actor, orgB, projB.id, { filename: 'B.pdf', mediaType: 'application/pdf', sizeBytes: bytes.length, sha256: sha });
    await putAttachmentChunk(env.ctx, ownerB.actor, orgB, projB.id, a.id, 0, bytes);
    await completeAttachment(env.ctx, ownerB.actor, orgB, projB.id, a.id);
    await rejects(getAttachment(env.ctx, ownerA.actor, orgA, projB.id, a.id), 404);
    await rejects(getAttachment(env.ctx, ownerA.actor, orgA, projA.id, a.id), 404);
  });
  it("B cannot revoke A's approval", async () => {
    const appr = await approveRevision(env.ctx, reviewerA.actor, orgA, projA.id, projA.revisionId, { documentType: 'proposal', revisionHash: projA.contentSha256, totp: freshCode(env, reviewerA) });
    await rejects(revokeApproval(env.ctx, ownerB.actor, orgB, appr.id, { totp: freshCode(env, ownerB) }), 404);
    await rejects(revokeApproval(env.ctx, ownerB.actor, orgA, appr.id, { totp: freshCode(env, ownerB) }), 404);
    expect((await approvalStatus(env.ctx, ownerA.actor, orgA, projA.id, projA.revisionId, 'proposal')).approved).toBe(true);
  });
});

describe('replay', () => {
  it('an authenticator code works once', async () => {
    const code = freshCode(env, ownerB);
    await regenerateRecoveryCodes(env.ctx, ownerB.actor, { totp: code });
    await rejects(regenerateRecoveryCodes(env.ctx, ownerB.actor, { totp: code }), 403);
  });
  it('an email link works once', async () => {
    await signup(env.ctx, { email: 'adv-replay@test.example', password: TEST_PASSWORD }, 'ip-adv3');
    const t = env.mailer.lastToken('adv-replay@test.example', 'verify_email');
    await verifyEmail(env.ctx, t);
    await rejects(verifyEmail(env.ctx, t), 400);
  });
  it('an approval does not carry over to a changed revision; re-approving the same revision is refused', async () => {
    const p = await createProject(env.ctx, ownerA.actor, orgA, { tool: 'solar', name: 'TEST replay', content: { pvKwp: 3 } });
    await approveRevision(env.ctx, reviewerA.actor, orgA, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewerA) });
    await rejects(approveRevision(env.ctx, reviewerA.actor, orgA, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewerA) }), 409);
    const next = await autosave(env.ctx, ownerA.actor, orgA, p.id, { baseVersion: 1, content: { pvKwp: 30 } });
    expect((await approvalStatus(env.ctx, ownerA.actor, orgA, p.id, next.revisionId, 'proposal')).approved).toBe(false);
    // The old revision's hash presented against the new revision is refused.
    await rejects(approveRevision(env.ctx, reviewerA.actor, orgA, p.id, next.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewerA) }), 409);
  });
  it('a stale code from a different, earlier time window is refused', async () => {
    await rejects(regenerateRecoveryCodes(env.ctx, ownerB.actor, { totp: totpCode(ownerB.totpSecret!, env.clock.t - 10 * 60e3) }), 403);
  });
});

describe('revoked approvals', () => {
  it('a revoked approval never counts again: status, re-approval and the Solar route', async () => {
    const input = { pvKwp: 4, note: 'TEST revoke' };
    const p = await createProject(env.ctx, ownerA.actor, orgA, { tool: 'solar', name: 'TEST revoke', content: input });
    const appr = await approveRevision(env.ctx, reviewerA.actor, orgA, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewerA) });
    await revokeApproval(env.ctx, reviewerA.actor, orgA, appr.id, { totp: freshCode(env, reviewerA) });
    expect((await approvalStatus(env.ctx, ownerA.actor, orgA, p.id, p.revisionId, 'proposal')).approved).toBe(false);
    // Revocation is final for that revision: the same reviewer cannot quietly re-approve it.
    await rejects(approveRevision(env.ctx, reviewerA.actor, orgA, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewerA) }), 409);
    // Replaying the revoked, validly signed approval through the Solar route is refused (client approvals → 400).
    const { POST } = await import('@/app/api/solar/proposal/route');
    const r = await POST(new NextRequest('https://preview.test/api/solar/proposal', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.7.7.7' }, body: JSON.stringify({ format: 'json', input: { ...input, verifiedApproval: appr.approval } }) }));
    expect(r.status).toBe(400);
  });
});
