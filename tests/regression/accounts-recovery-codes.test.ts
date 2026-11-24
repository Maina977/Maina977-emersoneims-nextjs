/**
 * Report B preview authorisation, item 4: recovery for people who lose their
 * authenticator. PGlite only; TEST data only.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newTestEnv, makeUser, freshCode, TEST_PASSWORD, type TestEnv, type TestUser } from '../helpers/accountsTestDb';
import { login, sessionActor, totpEnable, totpSetup } from '@/lib/accounts/auth';
import { totpCode } from '@/lib/accounts/crypto';
import { adminResetSecondFactor, recoveryCodesRemaining, regenerateRecoveryCodes, resetOwnAuthenticator, RECOVERY_CODE_COUNT } from '@/lib/accounts/recovery';
import { createOrg, invite, acceptInvite } from '@/lib/accounts/orgs';
import { createProject } from '@/lib/accounts/projects';
import { approvalStatus, approveRevision, registerReviewer, verifyReviewer } from '@/lib/accounts/reviewers';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { GENERIC_LOGIN_ERROR } from '@/lib/accounts/config';

// Real scrypt for every test user: slow by design; changes no assertion.
vi.setConfig({ testTimeout: 60_000, hookTimeout: 60_000 });

async function rejects(p: Promise<unknown>, status: number, msg?: RegExp) {
  try { await p; } catch (e) {
    const err = e as { status?: number; message: string };
    expect(err.status, err.message).toBe(status);
    if (msg) expect(err.message).toMatch(msg);
    return err;
  }
  throw new Error(`expected a ${status} rejection`);
}

let env: TestEnv;
let user: TestUser;
let codes: string[];
beforeEach(async () => {
  env = await newTestEnv();
  user = await makeUser(env, 'rc-user@test.example', { totp: true });
  codes = (await regenerateRecoveryCodes(env.ctx, user.actor, { totp: freshCode(env, user) })).recoveryCodes;
});
const signInWith = (extra: Record<string, unknown>, email = user.email) => login(env.ctx, { email, password: TEST_PASSWORD, ...extra }, 'ip-rc');

describe('recovery codes', () => {
  it('turning the authenticator on returns 10 distinct codes, shown once; only HMACs are stored', async () => {
    const other = await makeUser(env, 'rc-new@test.example');
    const { secret } = await totpSetup(env.ctx, other.actor);
    const { recoveryCodes } = await totpEnable(env.ctx, other.actor, totpCode(secret, env.clock.t));
    expect(recoveryCodes).toHaveLength(RECOVERY_CODE_COUNT);
    expect(new Set(recoveryCodes).size).toBe(RECOVERY_CODE_COUNT);
    for (const c of recoveryCodes) expect(c).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    const dump = JSON.stringify((await env.pg.query('SELECT * FROM acct_recovery_codes')).rows);
    for (const c of recoveryCodes) {
      expect(dump).not.toContain(c);
      expect(dump).not.toContain(c.replace('-', ''));
    }
  });

  it('a recovery code signs in with the second factor, works once, and the count goes down', async () => {
    const s = await signInWith({ recoveryCode: codes[0].toLowerCase() }); // case and spacing forgiven
    if ('needTotp' in s) throw new Error('unexpected');
    expect(s.mfa).toBe(true);
    const actor = (await sessionActor(env.ctx, s.token))!;
    expect(await recoveryCodesRemaining(env.ctx, actor)).toEqual({ remaining: RECOVERY_CODE_COUNT - 1 });
    await expect(signInWith({ recoveryCode: codes[0] })).rejects.toThrow(GENERIC_LOGIN_ERROR);
  });

  it('without a code or a recovery code the server asks for the second factor', async () => {
    expect(await signInWith({})).toEqual({ needTotp: true });
  });

  it('guessing recovery codes locks the account like wrong passwords do', async () => {
    for (let i = 0; i < 5; i++) await expect(signInWith({ recoveryCode: 'AAAAA-AAAAA' })).rejects.toThrow(GENERIC_LOGIN_ERROR);
    // Locked: even a valid code is refused now.
    await expect(signInWith({ recoveryCode: codes[1] })).rejects.toThrow(GENERIC_LOGIN_ERROR);
    expect((await env.pg.query<{ n: number }>("SELECT count(*)::int AS n FROM acct_audit WHERE action = 'login.locked'")).rows[0].n).toBe(1);
  });

  it('regenerating needs a fresh authenticator code, and the old codes stop working', async () => {
    await rejects(regenerateRecoveryCodes(env.ctx, user.actor, { totp: '000000' }), 403);
    await rejects(regenerateRecoveryCodes(env.ctx, { ...user.actor, mfa: false }, { totp: freshCode(env, user) }), 403);
    const fresh = (await regenerateRecoveryCodes(env.ctx, user.actor, { totp: freshCode(env, user) })).recoveryCodes;
    await expect(signInWith({ recoveryCode: codes[2] })).rejects.toThrow(GENERIC_LOGIN_ERROR);
    const s = await signInWith({ recoveryCode: fresh[0] });
    expect('needTotp' in s).toBe(false);
  });
});

describe('self-service authenticator reset (lost or replaced device)', () => {
  it('needs a second-factor session AND a fresh code or unused recovery code; ends other sessions; can re-enrol', async () => {
    // A lost device: sign in with a recovery code (second-factor session).
    const s = await signInWith({ recoveryCode: codes[0] });
    if ('needTotp' in s) throw new Error('unexpected');
    const actor = (await sessionActor(env.ctx, s.token))!;
    await rejects(resetOwnAuthenticator(env.ctx, actor, {}), 403);
    await rejects(resetOwnAuthenticator(env.ctx, actor, { recoveryCode: codes[0] }), 403); // already used
    await resetOwnAuthenticator(env.ctx, actor, { recoveryCode: codes[1] });
    // The original session (user.token) is ended; the proven one stays.
    expect(await sessionActor(env.ctx, user.token)).toBeNull();
    const again = (await sessionActor(env.ctx, s.token))!;
    expect(again.totpEnabled).toBe(false);
    expect((await env.pg.query('SELECT 1 FROM acct_recovery_codes WHERE user_id = $1', [user.userId])).rows.length).toBe(0);
    // Re-enrol a new device: new codes.
    const { secret } = await totpSetup(env.ctx, again);
    const { recoveryCodes } = await totpEnable(env.ctx, again, totpCode(secret, env.clock.t));
    expect(recoveryCodes).toHaveLength(RECOVERY_CODE_COUNT);
  });
});

describe('registry-administrator reset (device and codes both lost)', () => {
  it('only a registry administrator, with a fresh code, never for themselves, with a reason and identity-check reference', async () => {
    const owner = await makeUser(env, 'rc-owner@test.example', { totp: true });
    const admin = await makeUser(env, 'rc-registry@test.example', { totp: true, registryAdmin: true });
    const body = (a: TestUser, email: string) => ({ email, reason: 'TEST lost phone', identityCheckRef: 'TEST ID check 1', totp: freshCode(env, a) });
    // Privilege escalation: an organisation owner is not a registry administrator (the endpoint does not exist for them).
    await rejects(adminResetSecondFactor(env.ctx, owner.actor, body(owner, user.email)), 404);
    await rejects(adminResetSecondFactor(env.ctx, { ...admin.actor, mfa: false }, body(admin, user.email)), 403);
    await rejects(adminResetSecondFactor(env.ctx, admin.actor, { ...body(admin, user.email), totp: '000000' }), 403);
    await rejects(adminResetSecondFactor(env.ctx, admin.actor, { ...body(admin, user.email), identityCheckRef: '' }), 400);
    await rejects(adminResetSecondFactor(env.ctx, admin.actor, body(admin, admin.email)), 403, /own second factor/);
    await adminResetSecondFactor(env.ctx, admin.actor, body(admin, user.email));
    expect(await sessionActor(env.ctx, user.token)).toBeNull(); // signed out everywhere
    const u = (await env.pg.query<{ totp_enabled_at: unknown }>('SELECT totp_enabled_at FROM acct_users WHERE id = $1', [user.userId])).rows[0];
    expect(u.totp_enabled_at).toBeNull();
    const a = (await env.pg.query<{ detail: unknown }>("SELECT detail FROM acct_audit WHERE action = 'user.totp_reset_by_admin'")).rows[0];
    expect(JSON.stringify(a.detail)).toMatch(/TEST lost phone.*TEST ID check 1|TEST ID check 1.*TEST lost phone/);
    expect(await verifyAuditLog(env.db, env.ctx.secret)).toMatchObject({ ok: true });
  });

  it('a reset suspends the person\'s reviewer profiles, so their approvals stop holding until re-verification', async () => {
    const owner = await makeUser(env, 'rc-owner2@test.example', { totp: true });
    const reviewer = await makeUser(env, 'rc-reviewer@test.example', { totp: true });
    const admin = await makeUser(env, 'rc-registry2@test.example', { totp: true, registryAdmin: true });
    const org = (await createOrg(env.ctx, owner.actor, 'TEST RC Org')).id;
    await invite(env.ctx, owner.actor, org, { email: reviewer.email, role: 'engineer' });
    await acceptInvite(env.ctx, reviewer.actor, env.mailer.lastToken(reviewer.email, 'invite'));
    const rid = (await registerReviewer(env.ctx, reviewer.actor, org, { legalName: 'TEST RC Reviewer', professionalBody: 'EBK', registrationNumber: 'TEST-RC-1', scope: [{ tool: 'solar', documentType: 'proposal' }] })).id;
    await verifyReviewer(env.ctx, admin.actor, rid, { identityCheckStatus: 'checked', evidenceRef: 'TEST', validFrom: '2026-01-01', validUntil: '2027-12-31', totp: freshCode(env, admin) });
    const p = await createProject(env.ctx, owner.actor, org, { tool: 'solar', name: 'TEST', content: { pvKwp: 4 } });
    await approveRevision(env.ctx, reviewer.actor, org, p.id, p.revisionId, { documentType: 'proposal', revisionHash: p.contentSha256, totp: freshCode(env, reviewer) });
    expect((await approvalStatus(env.ctx, owner.actor, org, p.id, p.revisionId, 'proposal')).approved).toBe(true);
    const r = await adminResetSecondFactor(env.ctx, admin.actor, { email: reviewer.email, reason: 'TEST lost phone', identityCheckRef: 'TEST ID check 2', totp: freshCode(env, admin) });
    expect(r.suspendedReviewerProfiles).toBe(1);
    expect((await approvalStatus(env.ctx, owner.actor, org, p.id, p.revisionId, 'proposal')).approved).toBe(false);
  });
});
