/**
 * Report B live-database authorisation: rejection and the full review
 * lifecycle; full-fidelity disaster recovery into a SEPARATE database
 * (account access and second factor preserved); the isolation report; the
 * one-time registry-administrator bootstrap. PGlite only; TEST data only.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { newTestEnv, makeUser, freshCode, lib, TEST_PASSWORD, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { login, sessionActor, signup, verifyEmail } from '@/lib/accounts/auth';
import { createOrg, invite, acceptInvite } from '@/lib/accounts/orgs';
import { autosave, completeAttachment, createProject, putAttachmentChunk, startAttachment } from '@/lib/accounts/projects';
import { approvalStatus, approveRevision, registerReviewer, rejectRevision, revokeApproval, verifyApprovalChain, verifyReviewer } from '@/lib/accounts/reviewers';
import { regenerateRecoveryCodes } from '@/lib/accounts/recovery';
import { disasterRecoveryDrill, isolationReport, setDrillClientsForTests } from '@/lib/accounts/drill';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { totpCode } from '@/lib/accounts/crypto';
import { createHash } from 'node:crypto';

// Real scrypt for every test user; two databases in places: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 120_000, hookTimeout: 120_000 });

async function rejects(p: Promise<unknown>, status: number, msg?: RegExp) {
  try { await p; } catch (e) {
    const err = e as { status?: number; message: string };
    expect(err.status, err.message).toBe(status);
    if (msg) expect(err.message).toMatch(msg);
    return err;
  }
  throw new Error(`expected a ${status} rejection`);
}

interface W { env: TestEnv; owner: TestUser; reviewer: TestUser; admin: TestUser; org: string; reviewerId: string }
async function world(): Promise<W> {
  const env = await newTestEnv();
  const owner = await makeUser(env, 'lr-owner@test.example', { totp: true });
  const reviewer = await makeUser(env, 'lr-reviewer@test.example', { totp: true });
  const admin = await makeUser(env, 'lr-registry@test.example', { totp: true, registryAdmin: true });
  const org = (await createOrg(env.ctx, owner.actor, 'TEST LR Org')).id;
  await invite(env.ctx, owner.actor, org, { email: reviewer.email, role: 'engineer' });
  await acceptInvite(env.ctx, reviewer.actor, env.mailer.lastToken(reviewer.email, 'invite'));
  const reviewerId = (await registerReviewer(env.ctx, reviewer.actor, org, { legalName: 'TEST REVIEWER (PREVIEW ONLY)', professionalBody: 'EBK', registrationNumber: 'TEST-PREVIEW-0001', scope: [{ tool: 'solar', documentType: 'proposal' }] })).id;
  await verifyReviewer(env.ctx, admin.actor, reviewerId, { identityCheckStatus: 'checked', evidenceRef: 'TEST fictitious reviewer, preview validation only', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, admin) });
  return { env, owner, reviewer, admin, org, reviewerId };
}

describe('rejection and the full review lifecycle', () => {
  let w: W;
  beforeEach(async () => { w = await world(); });
  const decide = (kind: 'approve' | 'reject', p: { id: string }, rev: { revisionId: string; contentSha256: string }, extra: Record<string, unknown> = {}) =>
    (kind === 'approve' ? approveRevision : rejectRevision)(w.env.ctx, w.reviewer.actor, w.org, p.id, rev.revisionId, { documentType: 'proposal', revisionHash: rev.contentSha256, totp: freshCode(w.env, w.reviewer), ...extra });
  const status = (p: { id: string }, revisionId: string) => approvalStatus(w.env.ctx, w.owner.actor, w.org, p.id, revisionId, 'proposal');

  it('revision 1 rejected → revision 2 approved → revoked → revision 3 re-approved (FOR ISSUE); chain and audit verify', async () => {
    const p = await createProject(w.env.ctx, w.owner.actor, w.org, { tool: 'solar', name: 'TEST lifecycle', content: { pvKwp: 5, v: 1 } });
    // 1. Rejected with a reason: stays DRAFT and says who, when and why.
    await decide('reject', p, p, { reason: 'TEST: string voltage exceeds the inverter limit' });
    const s1 = await status(p, p.revisionId);
    expect(s1).toMatchObject({ approved: false, label: 'DRAFT' });
    expect(s1.rejection).toMatchObject({ name: 'TEST REVIEWER (PREVIEW ONLY)', registration: 'EBK TEST-PREVIEW-0001', reason: 'TEST: string voltage exceeds the inverter limit' });
    expect(s1.reason).toMatch(/^Rejected by TEST REVIEWER/);
    // 2. The engineer corrects it: revision 2, approved.
    const r2 = await autosave(w.env.ctx, w.owner.actor, w.org, p.id, { baseVersion: 1, content: { pvKwp: 5, v: 2 } });
    const a2 = await decide('approve', p, r2);
    expect(await status(p, r2.revisionId)).toMatchObject({ approved: true, label: 'FOR ISSUE' });
    // 3. Revoked: back to DRAFT.
    await revokeApproval(w.env.ctx, w.reviewer.actor, w.org, a2.id, { totp: freshCode(w.env, w.reviewer) });
    expect((await status(p, r2.revisionId)).approved).toBe(false);
    // 4. Corrected again: revision 3, re-approved.
    const r3 = await autosave(w.env.ctx, w.owner.actor, w.org, p.id, { baseVersion: 2, content: { pvKwp: 5, v: 3 } });
    await decide('approve', p, r3);
    expect(await status(p, r3.revisionId)).toMatchObject({ approved: true, label: 'FOR ISSUE' });
    // The rejection of revision 1 is still on record; revision 2 is still not approved.
    expect((await status(p, p.revisionId)).rejection).toBeTruthy();
    expect((await status(p, r2.revisionId)).approved).toBe(false);
    expect((await verifyApprovalChain(w.env.db)).ok).toBe(true);
    const chain = (await w.env.pg.query<{ record: { action: string } }>('SELECT record FROM acct_approval_chain ORDER BY sequence')).rows.map((r) => r.record.action);
    expect(chain).toEqual(['REJECTED', 'APPROVED', 'REVOKED', 'APPROVED']);
    expect(await verifyAuditLog(w.env.db, w.env.ctx.secret)).toMatchObject({ ok: true });
  });

  it('a rejection needs a reason, the reviewer\'s full authority, and cannot sit on top of the same reviewer\'s approval', async () => {
    const p = await createProject(w.env.ctx, w.owner.actor, w.org, { tool: 'solar', name: 'TEST reject rules', content: { pvKwp: 6 } });
    await rejects(decide('reject', p, p, { reason: '' }), 400);
    await rejects(rejectRevision(w.env.ctx, w.owner.actor, w.org, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, reason: 'x', totp: freshCode(w.env, w.owner) }), 403, /not a registered reviewer/);
    await rejects(decide('reject', p, p, { reason: 'x', totp: '000000' }), 403);
    await rejects(decide('reject', p, { revisionId: p.revisionId, contentSha256: 'f'.repeat(64) }, { reason: 'x' }), 409);
    const a = await decide('approve', p, p);
    await rejects(decide('reject', p, p, { reason: 'changed my mind' }), 409, /revoke that approval/);
    await revokeApproval(w.env.ctx, w.reviewer.actor, w.org, a.id, { totp: freshCode(w.env, w.reviewer) });
    await decide('reject', p, p, { reason: 'TEST: after revocation' });
    expect((await status(p, p.revisionId)).rejection?.reason).toBe('TEST: after revocation');
  });
});

describe('full-fidelity disaster recovery into a separate, empty database', () => {
  async function asClient(pg: PGlite) {
    return { query: (t: string, p?: unknown[]) => pg.query<Record<string, unknown>>(t, p), connect: async () => {}, end: async () => {} };
  }

  it('the drill restores projects, revisions, attachments and audit, and PRESERVES sign-in and the second factor', async () => {
    const w = await world();
    // Data: two revisions, an attachment, an approval, a rejection, recovery codes.
    const p = await createProject(w.env.ctx, w.owner.actor, w.org, { tool: 'solar', name: 'TEST DR', content: { pvKwp: 5 } });
    await rejectRevision(w.env.ctx, w.reviewer.actor, w.org, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, reason: 'TEST', totp: freshCode(w.env, w.reviewer) });
    const r2 = await autosave(w.env.ctx, w.owner.actor, w.org, p.id, { baseVersion: 1, content: { pvKwp: 6 } });
    await approveRevision(w.env.ctx, w.reviewer.actor, w.org, p.id, r2.revisionId, { documentType: 'proposal', revisionHash: r2.contentSha256, totp: freshCode(w.env, w.reviewer) });
    const bytes = new Uint8Array([...new TextEncoder().encode('%PDF-1.4 TEST DR')]);
    const att = await startAttachment(w.env.ctx, w.owner.actor, w.org, p.id, { filename: 'T.pdf', mediaType: 'application/pdf', sizeBytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
    await putAttachmentChunk(w.env.ctx, w.owner.actor, w.org, p.id, att.id, 0, bytes);
    await completeAttachment(w.env.ctx, w.owner.actor, w.org, p.id, att.id);
    const codes = (await regenerateRecoveryCodes(w.env.ctx, w.owner.actor, { totp: freshCode(w.env, w.owner) })).recoveryCodes;

    const dr = await newTestEnv(); // a separate, empty, migrated database (same environment secret)
    dr.clock.t = w.env.clock.t;
    setDrillClientsForTests(async (which) => asClient(which === 'primary' ? w.env.pg : dr.pg));
    try {
      const probeCode = totpCode(w.owner.totpSecret!, w.env.clock.t + 30e3);
      w.env.clock.t += 30e3; // admin's fresh code below uses the next step
      const result = await disasterRecoveryDrill(w.env.ctx, w.admin.actor, { orgId: w.org, totp: freshCode(w.env, w.admin), probe: { email: w.owner.email, password: TEST_PASSWORD, totp: probeCode } });
      expect(result).toMatchObject({
        exportVerified: true, projectsRestored: true, revisionsIntact: true, attachmentsIntact: true,
        auditRecordsArchived: true, restoredAuditChainVerifies: true,
        credentialsPreserved: true, recoveryCodesPreserved: true, reviewersSuspendedPendingReverification: true,
        probe: { found: true, passwordAccepted: true, emailStillVerified: true, secondFactorStillEnabled: true, authenticatorCodeAccepted: true },
      });
      expect(result.restored).toEqual({ projects: 1, revisions: 2, attachments: 1 });

      // And for real: sign in on the RESTORED database with the original password and authenticator, then a recovery code.
      dr.clock.t = w.env.clock.t + 60e3;
      const s = await login(dr.ctx, { email: w.owner.email, password: TEST_PASSWORD, totp: totpCode(w.owner.totpSecret!, dr.clock.t) }, 'ip-dr');
      expect('token' in s && s.mfa).toBe(true);
      const s2 = await login(dr.ctx, { email: w.owner.email, password: TEST_PASSWORD, recoveryCode: codes[0] }, 'ip-dr');
      expect('token' in s2).toBe(true);
    } finally { setDrillClientsForTests(null); }
  });

  it('only a registry administrator with a fresh code; never into a database that is not empty', async () => {
    const w = await world();
    const dr = await newTestEnv();
    setDrillClientsForTests(async (which) => asClient(which === 'primary' ? w.env.pg : dr.pg));
    try {
      await rejects(disasterRecoveryDrill(w.env.ctx, w.owner.actor, { orgId: w.org, totp: freshCode(w.env, w.owner) }), 404);
      await rejects(disasterRecoveryDrill(w.env.ctx, w.admin.actor, { orgId: w.org, totp: '000000' }), 403);
      await disasterRecoveryDrill(w.env.ctx, w.admin.actor, { orgId: w.org, totp: freshCode(w.env, w.admin) });
      await rejects(disasterRecoveryDrill(w.env.ctx, w.admin.actor, { orgId: w.org, totp: freshCode(w.env, w.admin) }), 400, /not empty/);
    } finally { setDrillClientsForTests(null); }
  });

  it('portable mode (default) still restores users without credentials', async () => {
    const w = await world();
    const exp = JSON.parse(JSON.stringify(await lib.exportOrg(w.env.pg, w.org)));
    expect(exp.fullFidelity).toBeUndefined();
    expect(JSON.stringify(exp)).not.toMatch(/scrypt\$/);
    const full = JSON.parse(JSON.stringify(await lib.exportOrg(w.env.pg, w.org, { fullFidelity: true })));
    expect(full.fullFidelity).toBe(true);
    // A changed credential in a full-fidelity file is caught by the file hash.
    full.credentials[0].passwordHash = 'scrypt$tampered';
    expect(lib.verifyExport(full).join(' ')).toMatch(/file altered/);
  });
});

describe('isolation report (booleans only)', () => {
  it('a registry administrator with a fresh code sees, without any value, what this environment can reach', async () => {
    const w = await world();
    w.env.ctx.env = { ...w.env.ctx.env, VERCEL_ENV: 'preview', ACCOUNTS_DATABASE_URL: 'postgres://accounts.test/db', ACCOUNTS_DR_DATABASE_URL: 'postgres://dr.test/db', ACCOUNTS_MAIL_MODE: 'outbox', ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example' };
    await rejects(isolationReport(w.env.ctx, w.owner.actor, { totp: freshCode(w.env, w.owner) }), 404);
    const r = await isolationReport(w.env.ctx, w.admin.actor, { totp: freshCode(w.env, w.admin) });
    expect(r).toEqual({
      vercelEnv: 'preview', accountsDatabaseConfigured: true, productionDatabaseUrlPresentHere: false, accountsDatabaseIsNotProduction: true,
      drDatabaseConfigured: true, drDatabaseIsSeparate: true, accountsMailMode: 'outbox',
      productionMailSettingsPresentHere: false, paymentSettingsPresentHere: false, paidModeOn: false,
    });
    expect(JSON.stringify(r)).not.toMatch(/postgres:/);
  });
});

describe('one-time registry-administrator bootstrap (preview)', () => {
  it('grants only the named TEST address, only in test-email mode, only when no registry administrator exists', async () => {
    const env = await newTestEnv();
    env.ctx.env = { ...env.ctx.env, ACCOUNTS_MAIL_MODE: 'outbox', ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example', ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN: 'boot@test.example' };
    const isAdmin = async (email: string) => (await env.pg.query<{ is_registry_admin: boolean }>('SELECT is_registry_admin FROM acct_users WHERE email = $1', [email])).rows[0]?.is_registry_admin;
    // Another test address: not granted.
    await signup(env.ctx, { email: 'other@test.example', password: TEST_PASSWORD }, 'ip-b1');
    await verifyEmail(env.ctx, env.mailer.lastToken('other@test.example', 'verify_email'));
    expect(await isAdmin('other@test.example')).toBe(false);
    // The named address: granted on verifying through the emailed link, and audited.
    await signup(env.ctx, { email: 'boot@test.example', password: TEST_PASSWORD }, 'ip-b2');
    await verifyEmail(env.ctx, env.mailer.lastToken('boot@test.example', 'verify_email'));
    expect(await isAdmin('boot@test.example')).toBe(true);
    expect((await env.pg.query("SELECT 1 FROM acct_audit WHERE action = 'registry_admin.bootstrapped'")).rows.length).toBe(1);
    const s = await login(env.ctx, { email: 'boot@test.example', password: TEST_PASSWORD }, 'ip-b3');
    expect((await sessionActor(env.ctx, 'token' in s ? s.token : ''))?.isRegistryAdmin).toBe(true);

    // One time only: with an administrator present, nobody else is granted, even if the setting names them.
    env.ctx.env = { ...env.ctx.env, ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN: 'second@test.example' };
    await signup(env.ctx, { email: 'second@test.example', password: TEST_PASSWORD }, 'ip-b4');
    await verifyEmail(env.ctx, env.mailer.lastToken('second@test.example', 'verify_email'));
    expect(await isAdmin('second@test.example')).toBe(false);

    // Not in test-email mode, or not a test address: never.
    const env2 = await newTestEnv();
    env2.ctx.env = { ...env2.ctx.env, ACCOUNTS_MAIL_MODE: 'none', ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN: 'boot@test.example' };
    await signup(env2.ctx, { email: 'boot@test.example', password: TEST_PASSWORD }, 'ip-b5');
    await verifyEmail(env2.ctx, env2.mailer.lastToken('boot@test.example', 'verify_email'));
    expect((await env2.pg.query<{ is_registry_admin: boolean }>("SELECT is_registry_admin FROM acct_users WHERE email = 'boot@test.example'")).rows[0].is_registry_admin).toBe(false);
  });
});
