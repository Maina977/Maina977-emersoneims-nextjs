/**
 * Accounts Phase 2: authentication, organisations and project storage, on
 * PGlite only (no real database). TEST data only.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { createHash, randomBytes } from 'node:crypto';
import { newTestEnv, makeUser, TEST_PASSWORD, lib, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { hashPassword, verifyPassword, hotp, totpCode, matchTotp, base32Encode, base32Decode, encryptSecret, decryptSecret, SCRYPT_N } from '@/lib/accounts/crypto';
import { login, requestPasswordReset, resetPassword, sessionActor, consumeToken, signup, verifyEmail, SIGNUP_DONE, RESET_DONE } from '@/lib/accounts/auth';
import { acceptInvite, changeRole, createOrg, invite, listMembers, listOrgs } from '@/lib/accounts/orgs';
import {
  autosave, completeAttachment, createProject, deleteAttachment, exportProject, getAttachment, getProject, getRevision, listAttachments, listProjects,
  listRevisions, putAttachmentChunk, readAudit, restoreRevision, softDeleteProject, startAttachment, undeleteProject, CONTENT_APPROVAL_REFUSED,
} from '@/lib/accounts/projects';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { canonicalJson, proposalRevisionHash } from '@/lib/solar/design/proposalApproval';
import { contentSha256 } from '@/lib/accounts/context';
import { GENERIC_LOGIN_ERROR, accountsEnabled, accountsDatabaseUrl } from '@/lib/accounts/config';

const sha = (b: Uint8Array | string) => createHash('sha256').update(b).digest('hex');
async function rejects(p: Promise<unknown>, status: number, msg?: string | RegExp) {
  try { await p; } catch (e) {
    const err = e as { status?: number; message: string };
    expect(err.status, err.message).toBe(status);
    if (msg) expect(err.message).toMatch(msg);
    return err;
  }
  throw new Error(`expected a ${status} rejection`);
}

describe('flag and database isolation', () => {
  it('ACCOUNTS_ENABLED must be exactly "true", and production is hard-off', () => {
    expect(accountsEnabled({})).toBe(false);
    expect(accountsEnabled({ ACCOUNTS_ENABLED: '1' })).toBe(false);
    expect(accountsEnabled({ ACCOUNTS_ENABLED: 'true' })).toBe(true);
    expect(accountsEnabled({ ACCOUNTS_ENABLED: 'true', VERCEL_ENV: 'preview' })).toBe(true);
    expect(accountsEnabled({ ACCOUNTS_ENABLED: 'true', VERCEL_ENV: 'production' })).toBe(false);
  });
  it('uses only ACCOUNTS_DATABASE_URL, never DATABASE_URL', () => {
    expect(accountsDatabaseUrl({ DATABASE_URL: 'postgres://prod/db', POSTGRES_URL: 'postgres://prod/db' })).toBeNull();
    expect(accountsDatabaseUrl({ ACCOUNTS_DATABASE_URL: 'postgres://preview/db' })).toBe('postgres://preview/db');
  });
});

describe('crypto', () => {
  it('scrypt with N >= 2^15 and a per-user salt', async () => {
    expect(SCRYPT_N).toBeGreaterThanOrEqual(2 ** 15);
    const a = await hashPassword('TEST password 1');
    const b = await hashPassword('TEST password 1');
    expect(a).not.toBe(b);
    expect(a.startsWith(`scrypt$${2 ** 15}$8$1$`)).toBe(true);
    expect(await verifyPassword('TEST password 1', a)).toBe(true);
    expect(await verifyPassword('TEST password 2', a)).toBe(false);
    expect(await verifyPassword('x', '!')).toBe(false);
  });
  it('TOTP matches the RFC 6238 test vectors (SHA-1)', () => {
    const secret = Buffer.from('12345678901234567890');
    // RFC 6238 Appendix B, 8 digits
    expect(hotp(secret, Math.floor(59 / 30), 8)).toBe('94287082');
    expect(hotp(secret, Math.floor(1111111109 / 30), 8)).toBe('07081804');
    expect(hotp(secret, Math.floor(20000000000 / 30), 8)).toBe('65353130');
    const b32 = base32Encode(secret);
    expect(base32Decode(b32).equals(secret)).toBe(true);
    expect(totpCode(b32, 59e3, 8)).toBe('94287082');
    expect(matchTotp(b32, totpCode(b32, 1_000_000e3), 1_000_000e3 + 30e3)).not.toBeNull();
    expect(matchTotp(b32, totpCode(b32, 1_000_000e3), 1_000_000e3 + 120e3)).toBeNull();
    expect(matchTotp(b32, 'abcdef', 0)).toBeNull();
  });
  it('AES-GCM secrets at rest fail on the wrong key or tampering', () => {
    const e = encryptSecret('SEED', 'k'.repeat(32));
    expect(decryptSecret(e, 'k'.repeat(32))).toBe('SEED');
    expect(decryptSecret(e, 'j'.repeat(32))).toBeNull();
    expect(decryptSecret(`${e.slice(0, -2)}AA`, 'k'.repeat(32))).toBeNull();
  });
  it('the scripts canonical JSON equals the app canonical JSON (content hashes match)', () => {
    const x = { b: [1, { z: null, a: 'é' }], a: 2.5, u: undefined, n: NaN };
    expect(lib.canonicalJson(x)).toBe(canonicalJson(x));
    expect(contentSha256(x)).toBe(lib.sha256(canonicalJson(x)));
  });
});

describe('authentication', () => {
  let env: TestEnv;
  beforeAll(async () => { env = await newTestEnv(); });

  it('sign-up is generic, verification is single-use, and sign-in needs a verified address', async () => {
    expect((await signup(env.ctx, { email: 'a@test.example', password: TEST_PASSWORD }, 'ip1')).message).toBe(SIGNUP_DONE);
    expect((await signup(env.ctx, { email: 'a@test.example', password: TEST_PASSWORD }, 'ip1')).message).toBe(SIGNUP_DONE);
    expect(env.mailer.sent.filter((m) => m.to === 'a@test.example')).toHaveLength(1);
    await rejects(login(env.ctx, { email: 'a@test.example', password: TEST_PASSWORD }, 'ip1'), 401, GENERIC_LOGIN_ERROR);
    const tok = env.mailer.lastToken('a@test.example', 'verify_email');
    await verifyEmail(env.ctx, tok);
    await rejects(verifyEmail(env.ctx, tok), 400);
    const s = await login(env.ctx, { email: 'A@Test.Example ', password: TEST_PASSWORD }, 'ip1');
    expect('token' in s).toBe(true);
    const row = (await env.pg.query<{ token_hash: string; expires_at: Date; created_at: Date }>('SELECT * FROM acct_sessions')).rows[0];
    if (!('token' in s)) return;
    expect(row.token_hash).toBe(sha(s.token));
    expect(JSON.stringify((await env.pg.query('SELECT * FROM acct_sessions')).rows)).not.toContain(s.token);
    expect(row.expires_at.getTime() - row.created_at.getTime()).toBe(12 * 3600e3);
  });

  it('generic errors: unknown address and wrong password look the same', async () => {
    const e1 = await rejects(login(env.ctx, { email: 'nobody@test.example', password: 'x'.repeat(12) }, 'ip2'), 401);
    const e2 = await rejects(login(env.ctx, { email: 'a@test.example', password: 'wrong password!' }, 'ip2'), 401);
    expect(e1.message).toBe(e2.message);
  });

  it('locks the account after 5 failures (database-backed), even for the right password', async () => {
    await makeUser(env, 'lock@test.example');
    for (let i = 0; i < 5; i++) await rejects(login(env.ctx, { email: 'lock@test.example', password: 'wrong password!' }, 'ip3'), 401);
    await rejects(login(env.ctx, { email: 'lock@test.example', password: TEST_PASSWORD }, 'ip3'), 401, GENERIC_LOGIN_ERROR);
    env.clock.t += 16 * 60e3;
    expect('token' in (await login(env.ctx, { email: 'lock@test.example', password: TEST_PASSWORD }, 'ip3'))).toBe(true);
  });

  it('rate-limits sign-in attempts per address of origin (database-backed)', async () => {
    let limited = 0;
    for (let i = 0; i < 32; i++) {
      try { await login(env.ctx, { email: `r${i}@test.example`, password: 'wrong password!' }, 'ip-burst'); } catch (e) { if ((e as { status: number }).status === 429) limited++; }
    }
    expect(limited).toBeGreaterThan(0);
  });

  it('sessions expire after 2 h idle and 12 h absolute', async () => {
    const u = await makeUser(env, 'idle@test.example');
    expect(await sessionActor(env.ctx, u.token)).not.toBeNull();
    env.clock.t += 2 * 3600e3 + 1000;
    expect(await sessionActor(env.ctx, u.token)).toBeNull();
    const v = await makeUser(env, 'abs@test.example');
    for (let i = 0; i < 7; i++) { env.clock.t += 1.9 * 3600e3; if (i < 6) expect(await sessionActor(env.ctx, v.token)).not.toBeNull(); }
    expect(await sessionActor(env.ctx, v.token)).toBeNull();
  });

  it('TOTP: required at sign-in once enabled, and a code cannot be replayed', async () => {
    const u = await makeUser(env, 'totp@test.example', { totp: true });
    expect(u.actor.mfa).toBe(true);
    expect(await login(env.ctx, { email: u.email, password: TEST_PASSWORD }, 'ip4')).toEqual({ needTotp: true });
    env.clock.t += 30e3;
    const code = totpCode(u.totpSecret!, env.clock.t);
    const s = await login(env.ctx, { email: u.email, password: TEST_PASSWORD, totp: code }, 'ip4');
    expect('token' in s && s.mfa).toBe(true);
    await rejects(login(env.ctx, { email: u.email, password: TEST_PASSWORD, totp: code }, 'ip4'), 401, GENERIC_LOGIN_ERROR);
    await rejects(login(env.ctx, { email: u.email, password: TEST_PASSWORD, totp: '000000' }, 'ip4'), 401);
    const stored = (await env.pg.query<{ totp_secret_enc: string }>('SELECT totp_secret_enc FROM acct_users WHERE email = $1', [u.email])).rows[0];
    expect(stored.totp_secret_enc).not.toContain(u.totpSecret!);
  });

  it('password reset: generic, single-use, expiring, and ends existing sessions', async () => {
    const u = await makeUser(env, 'reset@test.example');
    expect((await requestPasswordReset(env.ctx, 'nobody@test.example', 'ip5')).message).toBe(RESET_DONE);
    expect((await requestPasswordReset(env.ctx, u.email, 'ip5')).message).toBe(RESET_DONE);
    const tok = env.mailer.lastToken(u.email, 'reset_password');
    await resetPassword(env.ctx, tok, 'a brand new TEST password');
    await rejects(resetPassword(env.ctx, tok, 'another TEST password!'), 400);
    expect(await sessionActor(env.ctx, u.token)).toBeNull();
    expect('token' in (await login(env.ctx, { email: u.email, password: 'a brand new TEST password' }, 'ip5'))).toBe(true);
    await requestPasswordReset(env.ctx, u.email, 'ip5');
    const late = env.mailer.lastToken(u.email, 'reset_password');
    env.clock.t += 3600e3 + 1;
    expect(await env.db.tx((q) => consumeToken(q, env.ctx, late, 'reset_password'))).toBeNull();
  });
});

describe('organisations, roles and isolation', () => {
  let env: TestEnv;
  let owner: TestUser, engineer: TestUser, viewer: TestUser, outsider: TestUser, noMfaOwner: TestUser;
  let orgA: string, orgB: string, projectA: string, projectB: string;
  beforeAll(async () => {
    env = await newTestEnv();
    owner = await makeUser(env, 'owner@test.example', { totp: true });
    engineer = await makeUser(env, 'eng@test.example');
    viewer = await makeUser(env, 'viewer@test.example');
    outsider = await makeUser(env, 'outsider@test.example', { totp: true });
    noMfaOwner = await makeUser(env, 'nomfa@test.example');
    orgA = (await createOrg(env.ctx, owner.actor, 'TEST Org A')).id;
    orgB = (await createOrg(env.ctx, outsider.actor, 'TEST Org B')).id;
    for (const [u, role] of [[engineer, 'engineer'], [viewer, 'viewer']] as const) {
      await invite(env.ctx, owner.actor, orgA, { email: u.email, role });
      await acceptInvite(env.ctx, u.actor, env.mailer.lastToken(u.email, 'invite'));
    }
    projectA = (await createProject(env.ctx, engineer.actor, orgA, { tool: 'building', name: 'TEST BOQ', content: { items: [1] } })).id;
    projectB = (await createProject(env.ctx, outsider.actor, orgB, { tool: 'solar', name: 'TEST B', content: { b: 1 } })).id;
  });

  it('invitations are single-use and bound to the invited address', async () => {
    await invite(env.ctx, owner.actor, orgA, { email: 'later@test.example', role: 'viewer' });
    const t = env.mailer.lastToken('later@test.example', 'invite');
    await rejects(acceptInvite(env.ctx, outsider.actor, t), 400);
    const later = await makeUser(env, 'later@test.example');
    await acceptInvite(env.ctx, later.actor, t);
    await rejects(acceptInvite(env.ctx, later.actor, t), 400);
    expect((await listOrgs(env.ctx, later.actor)).map((o) => o.id)).toEqual([orgA]);
  });

  it('roles: viewers read only, engineers cannot invite or delete, admins cannot grant owner', async () => {
    await rejects(createProject(env.ctx, viewer.actor, orgA, { tool: 'solar', name: 'x', content: {} }), 403);
    await rejects(invite(env.ctx, engineer.actor, orgA, { email: 'x@test.example', role: 'viewer' }), 403);
    await rejects(softDeleteProject(env.ctx, engineer.actor, orgA, projectA), 403);
    await changeRole(env.ctx, owner.actor, orgA, viewer.userId, 'engineer');
    await changeRole(env.ctx, owner.actor, orgA, viewer.userId, 'viewer');
    await rejects(changeRole(env.ctx, owner.actor, orgA, owner.userId, 'viewer'), 400, /at least one owner/);
    expect((await listMembers(env.ctx, viewer.actor, orgA)).length).toBeGreaterThanOrEqual(3);
  });

  it('owners and admins must have passed the second factor', async () => {
    const o = await createOrg(env.ctx, noMfaOwner.actor, 'TEST no-MFA org');
    const e = await rejects(listProjects(env.ctx, noMfaOwner.actor, o.id), 403, /second factor/);
    expect((e as unknown as { extra: { needMfa: boolean } }).extra.needMfa).toBe(true);
  });

  it('CROSS-ORGANISATION: every function refuses another organisation (404), by org id or by project id', async () => {
    const a = outsider.actor; // member of org B only
    const attempts: Array<[string, () => Promise<unknown>]> = [
      ['listProjects', () => listProjects(env.ctx, a, orgA)],
      ['listMembers', () => listMembers(env.ctx, a, orgA)],
      ['invite', () => invite(env.ctx, a, orgA, { email: 'x@test.example', role: 'viewer' })],
      ['changeRole', () => changeRole(env.ctx, a, orgA, engineer.userId, 'viewer')],
      ['createProject', () => createProject(env.ctx, a, orgA, { tool: 'solar', name: 'x', content: {} })],
      ['getProject', () => getProject(env.ctx, a, orgA, projectA)],
      ['getProject via own org', () => getProject(env.ctx, a, orgB, projectA)],
      ['autosave', () => autosave(env.ctx, a, orgA, projectA, { baseVersion: 1, content: { hacked: 1 } })],
      ['autosave via own org', () => autosave(env.ctx, a, orgB, projectA, { baseVersion: 1, content: { hacked: 1 } })],
      ['listRevisions', () => listRevisions(env.ctx, a, orgB, projectA)],
      ['getRevision', () => getRevision(env.ctx, a, orgB, projectA, '00000000-0000-4000-8000-000000000000')],
      ['restoreRevision', () => restoreRevision(env.ctx, a, orgB, projectA, '00000000-0000-4000-8000-000000000000', { baseVersion: 1 })],
      ['exportProject', () => exportProject(env.ctx, a, orgB, projectA)],
      ['softDeleteProject', () => softDeleteProject(env.ctx, a, orgB, projectA)],
      ['undeleteProject', () => undeleteProject(env.ctx, a, orgB, projectA)],
      ['startAttachment', () => startAttachment(env.ctx, a, orgB, projectA, { filename: 'a.pdf', mediaType: 'application/pdf', sizeBytes: 5, sha256: 'a'.repeat(64) })],
      ['listAttachments', () => listAttachments(env.ctx, a, orgA, projectA)],
      ['readAudit', () => readAudit(env.ctx, a, orgA)],
    ];
    for (const [name, f] of attempts) {
      try { await f(); throw new Error(`${name} was NOT refused`); } catch (e) { expect((e as { status?: number }).status, name).toBe(404); }
    }
    const rev = (await listRevisions(env.ctx, engineer.actor, orgA, projectA))[0];
    await rejects(getRevision(env.ctx, a, orgB, projectA, rev.id), 404);
    await rejects(getRevision(env.ctx, a, orgB, projectB, rev.id), 404);
    // Nothing of org A appears in org B's listings.
    expect((await listProjects(env.ctx, a, orgB)).map((p) => p.id)).toEqual([projectB]);
    expect((await getProject(env.ctx, engineer.actor, orgA, projectA)).revision?.content).toEqual({ items: [1] });
  });

  it('every project query in the storage module is scoped by org_id in SQL', async () => {
    const fs = await import('node:fs');
    const src = fs.readFileSync('lib/accounts/projects.ts', 'utf8');
    const stmts = src.match(/'(?:SELECT|UPDATE|INSERT|DELETE)[^']*'|`(?:\s*)(?:SELECT|UPDATE|INSERT|DELETE)[^`]*`|"(?:SELECT|UPDATE|INSERT|DELETE)[^"]*"/g) ?? [];
    expect(stmts.length).toBeGreaterThan(20);
    for (const s of stmts) {
      if (/acct_attachment_chunks/.test(s) && !/acct_attachments/.test(s)) continue; // keyed by an attachment already checked by org
      if (/^.UPDATE acct_attachments SET data/.test(s)) continue; // id from a row selected with org_id
      expect(s, s).toMatch(/org_id/);
    }
  });
});

describe('project storage', () => {
  let env: TestEnv;
  let eng: TestUser, admin: TestUser;
  let org: string;
  beforeAll(async () => {
    env = await newTestEnv();
    admin = await makeUser(env, 'admin@test.example', { totp: true });
    eng = await makeUser(env, 'eng2@test.example');
    org = (await createOrg(env.ctx, admin.actor, 'TEST Storage Org')).id;
    await invite(env.ctx, admin.actor, org, { email: eng.email, role: 'engineer' });
    await acceptInvite(env.ctx, eng.actor, env.mailer.lastToken(eng.email, 'invite'));
  });

  it('autosave with optimistic concurrency, immutable hashed revisions with parent links, restore as new revision', async () => {
    const p = await createProject(env.ctx, eng.actor, org, { tool: 'solar', name: 'TEST Solar', content: { reference: 'TEST-1', a: 1 } });
    expect(p.contentSha256).toBe(proposalRevisionHash({ reference: 'TEST-1', a: 1 }));
    const s2 = await autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 1, content: { reference: 'TEST-1', a: 2 } });
    expect(s2.version).toBe(2);
    const same = await autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 2, content: { a: 2, reference: 'TEST-1' } });
    expect(same.unchanged).toBe(true);
    const conflict = await rejects(autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 1, content: { a: 3 } }), 409);
    expect((conflict as unknown as { extra: { currentVersion: number } }).extra.currentVersion).toBe(2);
    // Two concurrent saves from the same base: exactly one wins.
    const results = await Promise.allSettled([
      autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 2, content: { a: 'x' } }),
      autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 2, content: { a: 'y' } }),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const revs = await listRevisions(env.ctx, eng.actor, org, p.id);
    expect(revs.map((r) => r.version)).toEqual([3, 2, 1]);
    expect(revs[0].parentRevisionId).toBe(revs[1].id);
    expect(revs[2].parentRevisionId).toBeNull();
    const restored = await restoreRevision(env.ctx, eng.actor, org, p.id, revs[2].id, { baseVersion: 3 });
    expect(restored.version).toBe(4);
    expect(restored.contentSha256).toBe(revs[2].contentSha256);
    const r4 = await getRevision(env.ctx, eng.actor, org, p.id, restored.revisionId);
    expect(r4.restoredFrom).toBe(revs[2].id);
    expect(r4.content).toEqual({ reference: 'TEST-1', a: 1 });
    // The database refuses to change or delete a revision.
    await expect(env.pg.query('UPDATE acct_revisions SET content = $1 WHERE id = $2', ['{}', revs[2].id])).rejects.toThrow(/append-only/);
    await expect(env.pg.query('DELETE FROM acct_revisions WHERE id = $1', [revs[2].id])).rejects.toThrow(/append-only/);
  });

  it('refuses project content that carries an approval (a typed name is not an approval)', async () => {
    await rejects(createProject(env.ctx, eng.actor, org, { tool: 'solar', name: 'x', content: { approval: { engineer: 'TEST ENGINEER', registration: 'TEST-REG' } } }), 400, CONTENT_APPROVAL_REFUSED);
    await rejects(createProject(env.ctx, eng.actor, org, { tool: 'nonsense', name: 'x', content: {} }), 400);
  });

  it('browser projects arrive only by an explicit upload, marked as such', async () => {
    const p = await createProject(env.ctx, eng.actor, org, { tool: 'building', name: 'TEST uploaded', content: { items: [] }, source: 'browser-upload' });
    expect((await listProjects(env.ctx, eng.actor, org)).find((x) => x.id === p.id)?.source).toBe('browser-upload');
    const audit = await readAudit(env.ctx, admin.actor, org);
    expect(audit.some((a) => a.action === 'project.uploaded_from_browser' && a.objectId === p.id)).toBe(true);
  });

  it('JSON export holds every revision with its hash', async () => {
    const p = await createProject(env.ctx, eng.actor, org, { tool: 'oracle', name: 'TEST oracle', content: { v: 1 } });
    await autosave(env.ctx, eng.actor, org, p.id, { baseVersion: 1, content: { v: 2 } });
    const x = await exportProject(env.ctx, eng.actor, org, p.id);
    expect(x.revisions.map((r) => r.version)).toEqual([1, 2]);
    for (const r of x.revisions) expect(contentSha256(r.content)).toBe(r.contentSha256);
    const { exportSha256, ...body } = x;
    expect(contentSha256(body)).toBe(exportSha256);
  });

  it('attachments: chunked, hashed, size-limited, type allow-listed and content-sniffed', async () => {
    const p = await createProject(env.ctx, eng.actor, org, { tool: 'building', name: 'TEST drawings', content: { d: 1 } });
    const bytes = new Uint8Array(Buffer.concat([Buffer.from('%PDF-1.7\n'), randomBytes(4 * 1024 * 1024)]));
    const att = await startAttachment(env.ctx, eng.actor, org, p.id, { filename: '../../etc/TEST drawing.pdf', mediaType: 'application/pdf', sizeBytes: bytes.length, sha256: sha(bytes) });
    expect(att.chunks).toBe(2);
    await putAttachmentChunk(env.ctx, eng.actor, org, p.id, att.id, 0, bytes.subarray(0, att.chunkBytes));
    await rejects(putAttachmentChunk(env.ctx, eng.actor, org, p.id, att.id, 0, bytes.subarray(0, 10)), 409);
    await rejects(completeAttachment(env.ctx, eng.actor, org, p.id, att.id), 400, /incomplete/);
    await putAttachmentChunk(env.ctx, eng.actor, org, p.id, att.id, 1, bytes.subarray(att.chunkBytes));
    const done = await completeAttachment(env.ctx, eng.actor, org, p.id, att.id);
    expect(done.sha256).toBe(sha(bytes));
    const list = await listAttachments(env.ctx, eng.actor, org, p.id);
    expect(list[0].filename).toBe('TEST drawing.pdf');
    const got = await getAttachment(env.ctx, eng.actor, org, p.id, att.id);
    expect(sha(got.data)).toBe(sha(bytes));

    await rejects(startAttachment(env.ctx, eng.actor, org, p.id, { filename: 'x.exe', mediaType: 'application/x-msdownload', sizeBytes: 5, sha256: 'a'.repeat(64) }), 415);
    await rejects(startAttachment(env.ctx, eng.actor, org, p.id, { filename: 'big.pdf', mediaType: 'application/pdf', sizeBytes: 15 * 1024 * 1024 + 1, sha256: 'a'.repeat(64) }), 413);
    // A file whose bytes do not match the declared hash, or the declared type, is refused.
    const fake = new Uint8Array(Buffer.from('MZ not really a pdf'));
    const a2 = await startAttachment(env.ctx, eng.actor, org, p.id, { filename: 'x.pdf', mediaType: 'application/pdf', sizeBytes: fake.length, sha256: 'b'.repeat(64) });
    await putAttachmentChunk(env.ctx, eng.actor, org, p.id, a2.id, 0, fake);
    await rejects(completeAttachment(env.ctx, eng.actor, org, p.id, a2.id), 400, /SHA-256/);
    const a3 = await startAttachment(env.ctx, eng.actor, org, p.id, { filename: 'x.pdf', mediaType: 'application/pdf', sizeBytes: fake.length, sha256: sha(fake) });
    await putAttachmentChunk(env.ctx, eng.actor, org, p.id, a3.id, 0, fake);
    await rejects(completeAttachment(env.ctx, eng.actor, org, p.id, a3.id), 415);
    await deleteAttachment(env.ctx, eng.actor, org, p.id, att.id);
    expect(await listAttachments(env.ctx, eng.actor, org, p.id)).toHaveLength(0);
  });

  it('soft delete, 30-day restore window, then hard delete ONLY by the documented job', async () => {
    const p = await createProject(env.ctx, eng.actor, org, { tool: 'aquascan', name: 'TEST delete me', content: { z: 1 } });
    const q = await createProject(env.ctx, eng.actor, org, { tool: 'aquascan', name: 'TEST keep', content: { z: 2 } });
    await softDeleteProject(env.ctx, admin.actor, org, p.id);
    await rejects(getProject(env.ctx, eng.actor, org, p.id), 404);
    await undeleteProject(env.ctx, admin.actor, org, p.id);
    expect((await getProject(env.ctx, eng.actor, org, p.id)).project.id).toBe(p.id);
    await softDeleteProject(env.ctx, admin.actor, org, p.id);
    await softDeleteProject(env.ctx, admin.actor, org, q.id);
    env.clock.t += 31 * 86400e3;
    // Nothing is hard-deleted automatically:
    expect((await env.pg.query('SELECT 1 FROM acct_projects WHERE id = $1', [p.id])).rows).toHaveLength(1);
    const purged = await lib.purgeDeletedProjects(env.pg, env.ctx.secret, new Date(env.clock.t));
    expect(purged).toContain(p.id);
    expect((await env.pg.query('SELECT 1 FROM acct_revisions WHERE project_id = $1', [p.id])).rows).toHaveLength(0);
    // After the purge the revision table is append-only again.
    await expect(env.pg.query('DELETE FROM acct_revisions')).rejects.toThrow(/append-only/);
  });

  it('audit log: append-only, hash-chained, and tampering is detected', async () => {
    expect(await verifyAuditLog(env.db, env.ctx.secret)).toMatchObject({ ok: true });
    await expect(env.pg.query("UPDATE acct_audit SET action = 'x' WHERE seq = 1")).rejects.toThrow(/append-only/);
    await expect(env.pg.query('DELETE FROM acct_audit WHERE seq = 1')).rejects.toThrow(/append-only/);
    // An attacker with table access who bypasses the trigger and removes the tail is caught by the signed head.
    await env.pg.exec("SET session_replication_role = replica; DELETE FROM acct_audit WHERE seq = (SELECT MAX(seq) FROM acct_audit); SET session_replication_role = DEFAULT;");
    expect((await verifyAuditLog(env.db, env.ctx.secret)).ok).toBe(false);
  });
});
