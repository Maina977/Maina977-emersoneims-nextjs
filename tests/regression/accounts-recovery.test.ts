/**
 * Report B: disaster-recovery drill. An organisation with projects, revisions,
 * an attachment, a verified reviewer and an approval is exported, then
 * restored into a FRESH database (a new server). Everything must match by
 * hash, the safety rules must hold after restore, and people must be able to
 * get back in. PGlite only; TEST data only.
 */
import { describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
// Under the jsdom test environment PGlite accepts only the global Uint8Array (not Node Buffers);
// the deployed pg driver accepts both. Test bytes are therefore a plain Uint8Array.
import { newTestEnv, makeUser, freshCode, lib, TEST_PASSWORD, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { createOrg, invite, acceptInvite } from '@/lib/accounts/orgs';
import { autosave, completeAttachment, createProject, getAttachment, getProject, listRevisions, putAttachmentChunk, startAttachment } from '@/lib/accounts/projects';
import { approveRevision, approvalStatus, registerReviewer, verifyReviewer } from '@/lib/accounts/reviewers';
import { login, requestPasswordReset, resetPassword, sessionActor, totpEnable, totpSetup } from '@/lib/accounts/auth';
import { totpCode } from '@/lib/accounts/crypto';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { GENERIC_LOGIN_ERROR } from '@/lib/accounts/config';

// Real scrypt for every user and two databases per test: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });

const sha = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');

interface Source { env: TestEnv; owner: TestUser; reviewer: TestUser; orgId: string; projectId: string; rev2: { revisionId: string; contentSha256: string }; attId: string; fileBytes: Uint8Array; reviewerId: string }

async function buildSource(): Promise<Source> {
  const env = await newTestEnv();
  const owner = await makeUser(env, 'dr-owner@test.example', { totp: true });
  const reviewer = await makeUser(env, 'dr-reviewer@test.example', { totp: true });
  const admin = await makeUser(env, 'dr-registry@test.example', { totp: true, registryAdmin: true });
  const orgId = (await createOrg(env.ctx, owner.actor, 'TEST DR Org')).id;
  await invite(env.ctx, owner.actor, orgId, { email: reviewer.email, role: 'engineer' });
  await acceptInvite(env.ctx, reviewer.actor, env.mailer.lastToken(reviewer.email, 'invite'));
  const p = await createProject(env.ctx, owner.actor, orgId, { tool: 'solar', name: 'TEST DR proposal', content: { pvKwp: 5, note: 'TEST v1' } });
  const rev2 = await autosave(env.ctx, owner.actor, orgId, p.id, { baseVersion: 1, content: { pvKwp: 6, note: 'TEST v2' } });
  const fileBytes = new Uint8Array([...new TextEncoder().encode('%PDF-1.4 TEST drawing')]);
  const att = await startAttachment(env.ctx, owner.actor, orgId, p.id, { filename: 'TEST.pdf', mediaType: 'application/pdf', sizeBytes: fileBytes.length, sha256: sha(fileBytes) });
  await putAttachmentChunk(env.ctx, owner.actor, orgId, p.id, att.id, '0', fileBytes);
  await completeAttachment(env.ctx, owner.actor, orgId, p.id, att.id);
  const reviewerId = (await registerReviewer(env.ctx, reviewer.actor, orgId, { legalName: 'TEST DR Reviewer', professionalBody: 'EBK', registrationNumber: 'TEST-DR-1', scope: [{ tool: 'solar', documentType: 'proposal' }] })).id;
  await verifyReviewer(env.ctx, admin.actor, reviewerId, { identityCheckStatus: 'checked', evidenceRef: 'TEST DR evidence', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, admin) });
  await approveRevision(env.ctx, reviewer.actor, orgId, p.id, rev2.revisionId, { documentType: 'proposal', revisionHash: rev2.contentSha256, totp: freshCode(env, reviewer) });
  expect((await approvalStatus(env.ctx, owner.actor, orgId, p.id, rev2.revisionId, 'proposal')).approved).toBe(true);
  return { env, owner, reviewer, orgId, projectId: p.id, rev2, attId: att.id, fileBytes, reviewerId };
}

/** Export → file (JSON text, as written to disk) → parsed back. */
async function backup(src: Source) {
  const exp = await lib.exportOrg(src.env.pg, src.orgId);
  return JSON.parse(JSON.stringify(exp));
}

/** A restored user regains access: reset link → new password (verifies the address) → sign in → enrol the authenticator. */
async function regainAccess(t: TestEnv, email: string): Promise<{ actor: TestUser['actor']; totpSecret: string }> {
  await requestPasswordReset(t.ctx, email, `ip-${email}`);
  await resetPassword(t.ctx, t.mailer.lastToken(email, 'reset_password'), TEST_PASSWORD);
  const s = await login(t.ctx, { email, password: TEST_PASSWORD }, `ip-${email}`);
  if ('needTotp' in s) throw new Error('unexpected: restored users have no authenticator');
  let actor = (await sessionActor(t.ctx, s.token))!;
  const totpSecret = (await totpSetup(t.ctx, actor)).secret;
  await totpEnable(t.ctx, actor, totpCode(totpSecret, t.clock.t));
  t.clock.t += 30e3;
  actor = (await sessionActor(t.ctx, s.token))!;
  return { actor, totpSecret };
}

describe('disaster-recovery drill: export, restore into a fresh database', () => {
  it('restores projects, every revision and attachments byte-for-byte; the audit log verifies', async () => {
    const src = await buildSource();
    const file = await backup(src);
    expect(lib.verifyExport(file)).toEqual([]);

    const target = await newTestEnv();
    const r = await lib.importOrg(target.pg, target.ctx.secret, file, new Date(target.clock.t));
    expect(r).toEqual({ projects: 1, revisions: 2, attachments: 1 });

    const owner = await regainAccess(target, src.owner.email);
    const got = await getProject(target.ctx, owner.actor, src.orgId, src.projectId);
    expect(got.revision?.contentSha256).toBe(src.rev2.contentSha256);
    expect((await listRevisions(target.ctx, owner.actor, src.orgId, src.projectId)).map((x: { version: number }) => x.version).sort()).toEqual([1, 2]);
    const a = await getAttachment(target.ctx, owner.actor, src.orgId, src.projectId, src.attId);
    expect(a.sha256).toBe(sha(src.fileBytes));
    expect(Buffer.from(a.data).equals(Buffer.from(src.fileBytes))).toBe(true);
    expect(await verifyAuditLog(target.db, target.ctx.secret)).toMatchObject({ ok: true });
    const archived = (await target.pg.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_audit_archive WHERE org_id = $1', [src.orgId])).rows[0].n;
    expect(archived).toBe(file.audit.length);
  });

  it('restored people cannot sign in with old credentials; they regain access only through the emailed reset link', async () => {
    const src = await buildSource();
    const target = await newTestEnv();
    await lib.importOrg(target.pg, target.ctx.secret, await backup(src), new Date(target.clock.t));
    await expect(login(target.ctx, { email: src.owner.email, password: TEST_PASSWORD }, 'ip-x')).rejects.toThrow(GENERIC_LOGIN_ERROR);
    const back = await regainAccess(target, src.owner.email);
    expect(back.actor.mfa).toBe(true);
  });

  it('approvals do not survive a restore by themselves: the reviewer is suspended until a registry admin re-verifies', async () => {
    const src = await buildSource();
    const target = await newTestEnv();
    await lib.importOrg(target.pg, target.ctx.secret, await backup(src), new Date(target.clock.t));
    const owner = await regainAccess(target, src.owner.email);
    const status = () => approvalStatus(target.ctx, owner.actor, src.orgId, src.projectId, src.rev2.revisionId, 'proposal');
    expect((await status()).approved).toBe(false); // suspended after restore

    // The reviewer regains access; a registry admin of the new server re-verifies them.
    await regainAccess(target, src.reviewer.email);
    const admin = await makeUser(target, 'dr-new-registry@test.example', { totp: true, registryAdmin: true });
    await verifyReviewer(target.ctx, admin.actor, src.reviewerId, { identityCheckStatus: 'checked', evidenceRef: 'TEST DR re-verification', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(target, admin) });
    // The original signed approval of that exact revision verifies again (same signing key on the new server).
    expect(await status()).toMatchObject({ approved: true, label: 'FOR ISSUE' });
  });

  it('refuses an altered backup, a re-import, and leaves other organisations untouched', async () => {
    const src = await buildSource();
    const file = await backup(src);
    const target = await newTestEnv();
    const other = await makeUser(target, 'dr-other@test.example', { totp: true });
    const otherOrg = (await createOrg(target.ctx, other.actor, 'TEST Other Org')).id;
    const otherProj = await createProject(target.ctx, other.actor, otherOrg, { tool: 'building', name: 'TEST other', content: { q: 1 } });

    // One changed figure in a stored revision: refused before anything is written.
    const tampered = JSON.parse(JSON.stringify(file));
    tampered.revisions[0].content.pvKwp = 50;
    await expect(lib.importOrg(target.pg, target.ctx.secret, tampered, new Date(target.clock.t))).rejects.toThrow(/Refused: .*(file altered|content hash mismatch)/);
    expect((await target.pg.query('SELECT 1 FROM acct_orgs WHERE id = $1', [src.orgId])).rows.length).toBe(0);

    await lib.importOrg(target.pg, target.ctx.secret, file, new Date(target.clock.t));
    await expect(lib.importOrg(target.pg, target.ctx.secret, file, new Date(target.clock.t))).rejects.toThrow(/already exists/);

    const still = await getProject(target.ctx, other.actor, otherOrg, otherProj.id);
    expect(still.revision?.contentSha256).toBe(otherProj.contentSha256);
    // The restored organisation is not visible to the other organisation's member.
    await expect(getProject(target.ctx, other.actor, src.orgId, src.projectId)).rejects.toMatchObject({ status: 404 });
  });
});
