/**
 * Report B: verified-professional registry and document approvals, on PGlite
 * only (no real database). TEST data only: no real names or registration numbers.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { newTestEnv, makeUser, freshCode, TEST_SIGNING_KEY, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { createOrg, invite, acceptInvite } from '@/lib/accounts/orgs';
import { autosave, createProject } from '@/lib/accounts/projects';
import {
  approveRevision, approvalStatus, effectiveState, registerReviewer, revokeApproval, solarProposalApproval,
  suspendReviewer, verifyApprovalChain, verifyReviewer, APPROVALS_UNAVAILABLE,
} from '@/lib/accounts/reviewers';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { documentLabel } from '@/lib/accounts/documentLabels';

async function rejects(p: Promise<unknown>, status: number, msg?: RegExp) {
  try { await p; } catch (e) {
    const err = e as { status?: number; message: string };
    expect(err.status, err.message).toBe(status);
    if (msg) expect(err.message).toMatch(msg);
    return err;
  }
  throw new Error(`expected a ${status} rejection`);
}

const SOLAR_SCOPE = [{ tool: 'solar', documentType: 'proposal' }];
const verifyBody = (env: TestEnv, admin: TestUser) => ({
  identityCheckStatus: 'checked', evidenceRef: 'TEST evidence ref 001', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, admin),
});

interface World { env: TestEnv; owner: TestUser; rev1: TestUser; rev2: TestUser; admin: TestUser; outsider: TestUser; orgA: string; orgB: string; project: { id: string; revisionId: string; contentSha256: string } }

async function world(): Promise<World> {
  const env = await newTestEnv();
  const owner = await makeUser(env, 'owner@test.example', { totp: true });
  const rev1 = await makeUser(env, 'rev1@test.example', { totp: true });
  const rev2 = await makeUser(env, 'rev2@test.example', { totp: true });
  const admin = await makeUser(env, 'registry@test.example', { totp: true, registryAdmin: true });
  const outsider = await makeUser(env, 'outsider@test.example', { totp: true });
  const orgA = (await createOrg(env.ctx, owner.actor, 'TEST Org A')).id;
  const orgB = (await createOrg(env.ctx, outsider.actor, 'TEST Org B')).id;
  for (const u of [rev1, rev2]) {
    await invite(env.ctx, owner.actor, orgA, { email: u.email, role: 'engineer' });
    await acceptInvite(env.ctx, u.actor, env.mailer.lastToken(u.email, 'invite'));
  }
  const project = await createProject(env.ctx, owner.actor, orgA, { tool: 'solar', name: 'TEST proposal', content: { pvKwp: 5, note: 'TEST' } });
  return { env, owner, rev1, rev2, admin, outsider, orgA, orgB, project };
}

async function verifiedReviewer(w: World, u: TestUser, scope = SOLAR_SCOPE): Promise<string> {
  const r = await registerReviewer(w.env.ctx, u.actor, w.orgA, { legalName: `TEST Reviewer ${u.email}`, professionalBody: 'EBK', registrationNumber: `TEST-${u.email}`, scope });
  await verifyReviewer(w.env.ctx, w.admin.actor, r.id, verifyBody(w.env, w.admin));
  return r.id;
}
const approve = (w: World, u: TestUser, over: Record<string, unknown> = {}) =>
  approveRevision(w.env.ctx, u.actor, w.orgA, w.project.id, w.project.revisionId, { documentType: 'proposal', revisionHash: w.project.contentSha256, totp: freshCode(w.env, u), ...over });
const status = (w: World, revisionId = w.project.revisionId) => approvalStatus(w.env.ctx, w.owner.actor, w.orgA, w.project.id, revisionId, 'proposal');

describe('reviewer profiles: never verified automatically', () => {
  let w: World;
  beforeEach(async () => { w = await world(); });

  it('a reviewer must have the second factor to register', async () => {
    const noMfa = await makeUser(w.env, 'nomfa@test.example');
    await invite(w.env.ctx, w.owner.actor, w.orgA, { email: noMfa.email, role: 'engineer' });
    await acceptInvite(w.env.ctx, noMfa.actor, w.env.mailer.lastToken(noMfa.email, 'invite'));
    await rejects(registerReviewer(w.env.ctx, noMfa.actor, w.orgA, { legalName: 'TEST', professionalBody: 'EBK', registrationNumber: 'TEST-1', scope: SOLAR_SCOPE }), 403, /second factor/);
  });

  it('a new profile is pending and cannot approve', async () => {
    const r = await registerReviewer(w.env.ctx, w.rev1.actor, w.orgA, { legalName: 'TEST R1', professionalBody: 'EBK', registrationNumber: 'TEST-1', scope: SOLAR_SCOPE });
    expect(r.state).toBe('pending');
    await rejects(approve(w, w.rev1), 403, /pending, not verified/);
    expect((await status(w)).approved).toBe(false);
  });

  it('rejects unknown professional bodies and scopes that cannot be approved', async () => {
    await rejects(registerReviewer(w.env.ctx, w.rev1.actor, w.orgA, { legalName: 'TEST', professionalBody: 'NOT-A-BODY', registrationNumber: 'TEST-1', scope: SOLAR_SCOPE }), 400);
    await rejects(registerReviewer(w.env.ctx, w.rev1.actor, w.orgA, { legalName: 'TEST', professionalBody: 'EBK', registrationNumber: 'TEST-1', scope: [{ tool: 'aquascan', documentType: 'report' }] }), 400);
  });

  it('only a registry admin, with a fresh code, who is not the applicant, can verify', async () => {
    const r = await registerReviewer(w.env.ctx, w.rev1.actor, w.orgA, { legalName: 'TEST R1', professionalBody: 'EBK', registrationNumber: 'TEST-1', scope: SOLAR_SCOPE });
    // Not a registry admin: the registry does not even exist for them.
    await rejects(verifyReviewer(w.env.ctx, w.owner.actor, r.id, verifyBody(w.env, w.owner)), 404);
    // Registry admin, but a stale/used code.
    const used = freshCode(w.env, w.admin);
    await verifyReviewer(w.env.ctx, w.admin.actor, (await registerReviewer(w.env.ctx, w.rev2.actor, w.orgA, { legalName: 'TEST R2', professionalBody: 'EBK', registrationNumber: 'TEST-2', scope: SOLAR_SCOPE })).id, { ...verifyBody(w.env, w.admin), totp: used });
    await rejects(verifyReviewer(w.env.ctx, w.admin.actor, r.id, { ...verifyBody(w.env, w.admin), totp: used }), 403, /fresh authenticator code/);
    // Identity not checked, or dates wrong.
    await rejects(verifyReviewer(w.env.ctx, w.admin.actor, r.id, { ...verifyBody(w.env, w.admin), identityCheckStatus: 'not_checked' }), 400);
    await rejects(verifyReviewer(w.env.ctx, w.admin.actor, r.id, { ...verifyBody(w.env, w.admin), validUntil: '2025-01-01', validFrom: '2024-01-01' }), 400, /expired/);
    // The registry admin cannot verify their own profile.
    await invite(w.env.ctx, w.owner.actor, w.orgA, { email: w.admin.email, role: 'engineer' });
    await acceptInvite(w.env.ctx, w.admin.actor, w.env.mailer.lastToken(w.admin.email, 'invite'));
    const own = await registerReviewer(w.env.ctx, w.admin.actor, w.orgA, { legalName: 'TEST Admin', professionalBody: 'EBK', registrationNumber: 'TEST-A', scope: SOLAR_SCOPE });
    await rejects(verifyReviewer(w.env.ctx, w.admin.actor, own.id, verifyBody(w.env, w.admin)), 403, /own reviewer profile/);
  });

  it('effective state: verified only while identity-checked and in date', () => {
    const base = { state: 'verified', identity_check_status: 'checked', valid_from: '2026-01-01', valid_until: '2026-12-31' };
    expect(effectiveState(base, '2026-06-01')).toBe('verified');
    expect(effectiveState(base, '2027-01-01')).toBe('expired');
    expect(effectiveState(base, '2025-12-31')).toBe('pending');
    expect(effectiveState({ ...base, identity_check_status: 'not_checked' }, '2026-06-01')).toBe('pending');
    expect(effectiveState({ ...base, state: 'suspended' }, '2026-06-01')).toBe('suspended');
  });
});

describe('approvals: exact revision, verified reviewer, signed, audited', () => {
  let w: World;
  beforeEach(async () => { w = await world(); });

  it('a verified reviewer approves the exact current revision: FOR ISSUE, chain and audit log verify', async () => {
    await verifiedReviewer(w, w.rev1);
    expect((await status(w)).label).toBe('DRAFT');
    const a = await approve(w, w.rev1);
    expect(a.approval.signature).toMatch(/^[0-9a-f]{64}$/);
    const s = await status(w);
    expect(s).toMatchObject({ approved: true, label: 'FOR ISSUE' });
    expect(s.reviewer?.registration).toBe('EBK TEST-rev1@test.example');
    expect((await verifyApprovalChain(w.env.db)).ok).toBe(true);
    expect(await verifyAuditLog(w.env.db, w.env.ctx.secret)).toMatchObject({ ok: true });
    await rejects(approve(w, w.rev1), 409, /already approved/);
  });

  it('needs a second-factor session and a fresh code', async () => {
    await verifiedReviewer(w, w.rev1);
    await rejects(approveRevision(w.env.ctx, { ...w.rev1.actor, mfa: false }, w.orgA, w.project.id, w.project.revisionId, { documentType: 'proposal', revisionHash: w.project.contentSha256, totp: freshCode(w.env, w.rev1) }), 403, /second-factor session/);
    await rejects(approve(w, w.rev1, { totp: '000000' }), 403, /fresh authenticator code/);
  });

  it('refuses a wrong hash, an older revision, and leaves a new revision unapproved', async () => {
    await verifiedReviewer(w, w.rev1);
    await rejects(approve(w, w.rev1, { revisionHash: 'f'.repeat(64) }), 409, /not the hash of this revision/);
    await approve(w, w.rev1);
    const next = await autosave(w.env.ctx, w.owner.actor, w.orgA, w.project.id, { baseVersion: 1, content: { pvKwp: 6, note: 'TEST changed' } });
    // Any change is a new revision with no approval.
    const s = await status(w, next.revisionId);
    expect(s).toMatchObject({ approved: false, label: 'DRAFT' });
    // The old revision can no longer be approved by anyone else.
    await verifiedReviewer(w, w.rev2);
    await rejects(approve(w, w.rev2), 409, /Only the current revision/);
  });

  it('refuses outside the reviewer scope, and across organisations', async () => {
    await verifiedReviewer(w, w.rev1, [{ tool: 'building', documentType: 'boq-certification' }]);
    await rejects(approve(w, w.rev1), 403, /outside your scope/);
    // An outsider (other organisation) cannot reach the project at all.
    await rejects(approveRevision(w.env.ctx, w.outsider.actor, w.orgA, w.project.id, w.project.revisionId, { documentType: 'proposal', revisionHash: w.project.contentSha256, totp: freshCode(w.env, w.outsider) }), 404);
    await rejects(approveRevision(w.env.ctx, w.outsider.actor, w.orgB, w.project.id, w.project.revisionId, { documentType: 'proposal', revisionHash: w.project.contentSha256, totp: freshCode(w.env, w.outsider) }), 403);
  });

  it('a stored document cannot be altered after approval; if a superuser forces it, the approval no longer holds', async () => {
    await verifiedReviewer(w, w.rev1);
    await approve(w, w.rev1);
    // Layer 1: revisions are append-only in the database.
    await expect(w.env.pg.query("UPDATE acct_revisions SET content = '{\"pvKwp\": 50}'::jsonb WHERE id = $1", [w.project.revisionId])).rejects.toThrow(/append-only/);
    // Layer 2: a superuser disables the trigger and alters the document anyway.
    await w.env.pg.query('ALTER TABLE acct_revisions DISABLE TRIGGER acct_revisions_immutable');
    await w.env.pg.query("UPDATE acct_revisions SET content = '{\"pvKwp\": 50}'::jsonb WHERE id = $1", [w.project.revisionId]);
    expect(await status(w)).toMatchObject({ approved: false, reason: expect.stringMatching(/altered/) });
  });

  it('an approval copied onto another revision is refused (replay)', async () => {
    await verifiedReviewer(w, w.rev1);
    const a = await approve(w, w.rev1);
    const other = await createProject(w.env.ctx, w.owner.actor, w.orgA, { tool: 'solar', name: 'TEST other', content: { pvKwp: 5, note: 'TEST' } });
    // Same content hash, different project: copy the approval row across.
    await w.env.pg.query(
      `INSERT INTO acct_approvals (id, org_id, project_id, revision_id, revision_hash, tool, document_type, reviewer_id, approval, created_at)
       SELECT gen_random_uuid(), org_id, $2, $3, revision_hash, tool, document_type, reviewer_id, approval, created_at FROM acct_approvals WHERE id = $1`,
      [a.id, other.id, other.revisionId]);
    const s = await approvalStatus(w.env.ctx, w.owner.actor, w.orgA, other.id, other.revisionId, 'proposal');
    expect(s).toMatchObject({ approved: false, reason: expect.stringMatching(/replay refused/) });
  });

  it('suspension or expiry of the reviewer withdraws the approval; revoking does too', async () => {
    const r1 = await verifiedReviewer(w, w.rev1);
    await approve(w, w.rev1);
    expect((await status(w)).approved).toBe(true);
    await suspendReviewer(w.env.ctx, w.admin.actor, r1, 'TEST suspension');
    expect((await status(w)).approved).toBe(false);

    const w2 = await world();
    await verifiedReviewer(w2, w2.rev1);
    await approve(w2, w2.rev1);
    w2.env.clock.t = Date.parse('2028-01-02T08:00:00Z'); // past validUntil 2027-12-31
    expect((await status(w2)).approved).toBe(false);

    const w3 = await world();
    await verifiedReviewer(w3, w3.rev1);
    const a = await approve(w3, w3.rev1);
    await rejects(revokeApproval(w3.env.ctx, w3.owner.actor, w3.orgA, a.id, { totp: freshCode(w3.env, w3.owner) }), 404); // only the reviewer themself
    await revokeApproval(w3.env.ctx, w3.rev1.actor, w3.orgA, a.id, { totp: freshCode(w3.env, w3.rev1) });
    expect((await status(w3)).approved).toBe(false);
    expect((await verifyApprovalChain(w3.env.db)).ok).toBe(true);
  });

  it('without the server signing key, approvals are unavailable and documents stay DRAFT', async () => {
    await verifiedReviewer(w, w.rev1);
    w.env.ctx.env = {};
    await rejects(approve(w, w.rev1), 503);
    expect(await status(w)).toMatchObject({ approved: false, reason: APPROVALS_UNAVAILABLE });
    w.env.ctx.env = { PROPOSAL_APPROVAL_SIGNING_KEY: TEST_SIGNING_KEY };
  });

  it('Solar FOR ISSUE path returns the approval that verified, not the first row (two reviewers, the first suspended)', async () => {
    const r1 = await verifiedReviewer(w, w.rev1);
    const r2 = await verifiedReviewer(w, w.rev2);
    await approve(w, w.rev1); // first row
    await approve(w, w.rev2);
    await suspendReviewer(w.env.ctx, w.admin.actor, r1, 'TEST suspension');
    const res = await solarProposalApproval(w.env.ctx, w.owner.actor, w.project.contentSha256);
    expect(res?.verifiedApproval?.reviewerId).toBe(r2);
    expect(res!.verifier.registry.map((x) => x.reviewerId)).toEqual([r2]);
  });

  it('Solar path with no verified reviewer anywhere: null (unchanged DRAFT behaviour)', async () => {
    expect(await solarProposalApproval(w.env.ctx, w.owner.actor, w.project.contentSha256)).toBeNull();
  });
});

describe('document labels stay unapproved unless verified', () => {
  it('each tool keeps its existing label until an exact-revision approval verifies', () => {
    expect(documentLabel('solar', 'proposal', false)).toBe('DRAFT');
    expect(documentLabel('oracle', 'service-signoff', false)).toBe('NOT VERIFIED');
    expect(documentLabel('building', 'boq-certification', false)).toMatch(/DRAFT/);
    expect(documentLabel('aquascan', 'report', true)).toBe('NOT VERIFIED'); // nothing in AquaScan can be approved
  });
});
