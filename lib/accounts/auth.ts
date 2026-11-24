/**
 * Authentication: email + password (scrypt), database sessions, lockout and
 * rate limits, TOTP second factor, email verification and password reset.
 *
 * All errors a visitor sees during sign-in are the one GENERIC_LOGIN_ERROR, so
 * nothing reveals whether an address is registered, verified or locked.
 */
import 'server-only';
import { appendAudit } from './audit';
import {
  GENERIC_LOGIN_ERROR, LOCKOUT_MS, LOCKOUT_THRESHOLD, LOGIN_PER_IP_PER_15MIN, SESSION_ABSOLUTE_MS, SESSION_IDLE_MS, TOKEN_TTL_MS,
} from './config';
import { AcctError, badRequest, type Actor, type Ctx, type Queryable } from './context';
import {
  burnPasswordCheck, decryptSecret, encryptSecret, hashPassword, matchTotp, newTotpSecret, otpauthUri, randomToken, sha256HexNode, verifyPassword,
} from './crypto';
import { randomUUID } from 'node:crypto';
import { issueRecoveryCodes, useRecoveryCode } from './recovery';
import { assertTestRecipient, isTestAddress, mailMode } from './testMail';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;
export function normaliseEmail(e: unknown): string {
  if (typeof e !== 'string') throw badRequest('Enter a valid email address');
  const v = e.trim().toLowerCase();
  if (!EMAIL_RE.test(v) || v.length > 254) throw badRequest('Enter a valid email address');
  return v;
}
export function checkPassword(p: unknown): string {
  if (typeof p !== 'string' || p.length < 12 || p.length > 200) throw badRequest('The password must be 12 to 200 characters long');
  return p;
}
const keyHash = (k: string) => sha256HexNode(`emersoneims-accounts-rate|${k}`).slice(0, 40);

/** Database-backed counter: true while within `limit` hits in the current window. */
export async function rateHit(q: Queryable, key: string, windowMs: number, limit: number, now: Date): Promise<boolean> {
  const win = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const r = await q.query<{ n: number }>(
    `INSERT INTO acct_rate (k, win, n) VALUES ($1, $2, 1)
     ON CONFLICT (k, win) DO UPDATE SET n = acct_rate.n + 1 RETURNING n`,
    [keyHash(key), win.toISOString()],
  );
  if (Math.random() < 0.02) await q.query('DELETE FROM acct_rate WHERE win < $1', [new Date(now.getTime() - 86400e3).toISOString()]);
  return Number(r.rows[0]?.n ?? 0) <= limit;
}

// ------------------------------------------------------------------ single-use tokens
export async function issueToken(q: Queryable, ctx: Ctx, t: { purpose: keyof typeof TOKEN_TTL_MS; userId?: string | null; orgId?: string | null; email?: string | null; role?: string | null; createdBy?: string | null }): Promise<string> {
  const token = randomToken();
  await q.query(
    `INSERT INTO acct_tokens (token_hash, purpose, user_id, org_id, email, role, created_by, created_at, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [sha256HexNode(token), t.purpose, t.userId ?? null, t.orgId ?? null, t.email ?? null, t.role ?? null, t.createdBy ?? null,
      ctx.now().toISOString(), new Date(ctx.now().getTime() + TOKEN_TTL_MS[t.purpose]).toISOString()],
  );
  return token;
}
/** Marks the token used and returns it, or null (unknown, wrong purpose, used or expired). Atomic: a token works once. */
export async function consumeToken(q: Queryable, ctx: Ctx, token: unknown, purpose: keyof typeof TOKEN_TTL_MS) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const r = await q.query<{ user_id: string | null; org_id: string | null; email: string | null; role: string | null }>(
    `UPDATE acct_tokens SET used_at = $3 WHERE token_hash = $1 AND purpose = $2 AND used_at IS NULL AND expires_at > $3
     RETURNING user_id, org_id, email, role`,
    [sha256HexNode(token), purpose, ctx.now().toISOString()],
  );
  return r.rows[0] ?? null;
}

// ------------------------------------------------------------------ sign-up and verification
export const SIGNUP_DONE = 'If this address can be registered, a verification email has been sent to it.';

export async function signup(ctx: Ctx, body: { email?: unknown; password?: unknown; displayName?: unknown }, ip: string): Promise<{ message: string }> {
  const email = normaliseEmail(body.email);
  assertTestRecipient(ctx, email); // preview test-email mode: fictitious test addresses only
  const password = checkPassword(body.password);
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 120) : '';
  if (!(await rateHit(ctx.db, `signup-ip:${ip}`, 3600e3, 10, ctx.now()))) throw new AcctError(429, 'Too many requests; try again later.');
  const hash = await hashPassword(password);
  const token = await ctx.db.tx(async (q) => {
    const exists = await q.query('SELECT 1 FROM acct_users WHERE email = $1', [email]);
    if (exists.rows.length) return null;
    const id = randomUUID();
    await q.query('INSERT INTO acct_users (id, email, password_hash, display_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)', [id, email, hash, displayName, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: id, orgId: null, action: 'user.signup', objectType: 'user', objectId: id }, ctx.now());
    return issueToken(q, ctx, { purpose: 'verify_email', userId: id, email });
  });
  if (token) await ctx.mailer.send({ to: email, kind: 'verify_email', subject: 'Verify your EmersonEIMS account', text: `Open ${ctx.origin}/accounts?view=verify&token=${token} to verify your address. The link works once and expires in 24 hours.` });
  return { message: SIGNUP_DONE };
}

export async function verifyEmail(ctx: Ctx, token: unknown): Promise<void> {
  await ctx.db.tx(async (q) => {
    const t = await consumeToken(q, ctx, token, 'verify_email');
    if (!t?.user_id) throw badRequest('This verification link is not valid or has expired.');
    await q.query('UPDATE acct_users SET email_verified_at = $2, updated_at = $2 WHERE id = $1', [t.user_id, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: t.user_id, orgId: null, action: 'user.email_verified', objectType: 'user', objectId: t.user_id }, ctx.now());
    await bootstrapRegistryAdmin(q, ctx, t.user_id);
  });
}

/**
 * PREVIEW BOOTSTRAP of the first registry administrator (Report B live-database
 * validation), instead of a manual SQL grant. Only when ALL hold:
 * ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN names exactly this (just verified) address;
 * test-email mode is on and the address is an allow-listed TEST address; and no
 * registry administrator exists yet (one time only). Audited. Accounts are off
 * in production, so this never runs there. Remove the setting after use.
 */
async function bootstrapRegistryAdmin(q: Queryable, ctx: Ctx, userId: string): Promise<void> {
  const want = (ctx.env.ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN ?? '').trim().toLowerCase();
  if (!want || mailMode(ctx.env) === 'none' || !isTestAddress(want, ctx.env)) return;
  const u = (await q.query<{ email: string }>('SELECT email FROM acct_users WHERE id = $1', [userId])).rows[0];
  if (!u || u.email !== want) return;
  const any = (await q.query('SELECT 1 FROM acct_users WHERE is_registry_admin = TRUE LIMIT 1')).rows;
  if (any.length) return;
  await q.query('UPDATE acct_users SET is_registry_admin = TRUE, updated_at = $2 WHERE id = $1', [userId, ctx.now().toISOString()]);
  await appendAudit(q, ctx.secret, { actorUserId: userId, orgId: null, action: 'registry_admin.bootstrapped', objectType: 'user', objectId: userId, detail: { via: 'ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN' } }, ctx.now());
}

// ------------------------------------------------------------------ sign-in
interface UserRow { id: string; email: string; password_hash: string; email_verified_at: unknown; totp_secret_enc: string | null; totp_enabled_at: unknown; totp_last_step: unknown; failed_logins: number; locked_until: unknown; is_registry_admin: boolean }

export interface NewSession { token: string; csrf: string; expiresAt: Date; mfa: boolean }

async function createSession(q: Queryable, ctx: Ctx, userId: string, mfa: boolean): Promise<NewSession> {
  const token = randomToken();
  const csrf = randomToken();
  const now = ctx.now();
  const expiresAt = new Date(now.getTime() + SESSION_ABSOLUTE_MS);
  await q.query(
    'INSERT INTO acct_sessions (token_hash, user_id, csrf_hash, mfa_verified, created_at, last_seen_at, expires_at) VALUES ($1, $2, $3, $4, $5, $5, $6)',
    [sha256HexNode(token), userId, sha256HexNode(csrf), mfa, now.toISOString(), expiresAt.toISOString()],
  );
  return { token, csrf, expiresAt, mfa };
}

const loginFail = () => new AcctError(401, GENERIC_LOGIN_ERROR);

/**
 * Checks a TOTP code for the user and records its step (a code works once).
 * Must run in the caller's transaction.
 */
export async function useTotp(q: Queryable, ctx: Ctx, userId: string, code: unknown): Promise<boolean> {
  if (typeof code !== 'string') return false;
  const u = (await q.query<{ totp_secret_enc: string | null; totp_enabled_at: unknown; totp_last_step: unknown }>('SELECT totp_secret_enc, totp_enabled_at, totp_last_step FROM acct_users WHERE id = $1 FOR UPDATE', [userId])).rows[0];
  if (!u?.totp_secret_enc || !u.totp_enabled_at) return false;
  const secret = decryptSecret(u.totp_secret_enc, ctx.secret);
  if (!secret) return false;
  const step = matchTotp(secret, code.trim(), ctx.now().getTime());
  if (step === null || step <= Number(u.totp_last_step)) return false;
  await q.query('UPDATE acct_users SET totp_last_step = $2 WHERE id = $1', [userId, step]);
  return true;
}

export async function login(ctx: Ctx, body: { email?: unknown; password?: unknown; totp?: unknown; recoveryCode?: unknown }, ip: string): Promise<NewSession | { needTotp: true }> {
  const now = ctx.now();
  if (!(await rateHit(ctx.db, `login-ip:${ip}`, 15 * 60e3, LOGIN_PER_IP_PER_15MIN, now))) throw new AcctError(429, GENERIC_LOGIN_ERROR);
  let email: string;
  try { email = normaliseEmail(body.email); } catch { throw loginFail(); }
  const password = typeof body.password === 'string' ? body.password : '';
  const u = (await ctx.db.query<UserRow & Record<string, unknown>>('SELECT * FROM acct_users WHERE email = $1', [email])).rows[0];
  if (!u) { await burnPasswordCheck(password); throw loginFail(); }
  const locked = u.locked_until && new Date(String(u.locked_until instanceof Date ? u.locked_until.toISOString() : u.locked_until)).getTime() > now.getTime();
  if (locked) { await burnPasswordCheck(password); throw loginFail(); }
  const ok = await verifyPassword(password, u.password_hash);

  const recordFailure = async (why: string) => {
    await ctx.db.tx(async (q) => {
      const r = await q.query<{ failed_logins: number }>('UPDATE acct_users SET failed_logins = failed_logins + 1 WHERE id = $1 RETURNING failed_logins', [u.id]);
      const n = Number(r.rows[0]?.failed_logins ?? 0);
      if (n >= LOCKOUT_THRESHOLD) {
        await q.query('UPDATE acct_users SET failed_logins = 0, locked_until = $2 WHERE id = $1', [u.id, new Date(now.getTime() + LOCKOUT_MS).toISOString()]);
        await appendAudit(q, ctx.secret, { actorUserId: null, orgId: null, action: 'login.locked', objectType: 'user', objectId: u.id }, now);
      } else {
        await appendAudit(q, ctx.secret, { actorUserId: null, orgId: null, action: 'login.failed', objectType: 'user', objectId: u.id, detail: { why } }, now);
      }
    });
    throw loginFail();
  };
  if (!ok) return recordFailure('password');
  if (!u.email_verified_at) throw loginFail();
  const totpOn = Boolean(u.totp_enabled_at);
  const given = (v: unknown) => v !== undefined && v !== null && v !== '';
  // The second factor: an authenticator code, or (lost device) one unused recovery code.
  if (totpOn && !given(body.totp) && !given(body.recoveryCode)) return { needTotp: true };
  return ctx.db.tx(async (q) => {
    if (totpOn) {
      const proven = given(body.totp) ? await useTotp(q, ctx, u.id, body.totp) : await useRecoveryCode(q, ctx, u.id, body.recoveryCode);
      if (!proven) return null;
    }
    await q.query('UPDATE acct_users SET failed_logins = 0, locked_until = NULL WHERE id = $1', [u.id]);
    const s = await createSession(q, ctx, u.id, totpOn);
    await appendAudit(q, ctx.secret, { actorUserId: u.id, orgId: null, action: 'login.succeeded', objectType: 'user', objectId: u.id, detail: { mfa: totpOn } }, now);
    return s;
  }).then((s) => s ?? recordFailure('totp'));
}

/** The signed-in actor for a session token, or null. Enforces absolute (12 h) and idle (2 h) expiry. */
export async function sessionActor(ctx: Ctx, token: string | null | undefined): Promise<(Actor & { csrfHash: string }) | null> {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const now = ctx.now();
  const h = sha256HexNode(token);
  const r = (await ctx.db.query<Record<string, unknown>>(
    `SELECT s.csrf_hash, s.mfa_verified, s.last_seen_at, u.id, u.email, u.totp_enabled_at, u.is_registry_admin
     FROM acct_sessions s JOIN acct_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > $2 AND s.last_seen_at > $3`,
    [h, now.toISOString(), new Date(now.getTime() - SESSION_IDLE_MS).toISOString()],
  )).rows[0];
  if (!r) return null;
  const last = r.last_seen_at instanceof Date ? r.last_seen_at.getTime() : Date.parse(String(r.last_seen_at));
  if (now.getTime() - last > 60e3) await ctx.db.query('UPDATE acct_sessions SET last_seen_at = $2 WHERE token_hash = $1', [h, now.toISOString()]);
  return {
    userId: String(r.id), email: String(r.email), mfa: Boolean(r.mfa_verified), totpEnabled: Boolean(r.totp_enabled_at),
    isRegistryAdmin: Boolean(r.is_registry_admin), sessionHash: h, csrfHash: String(r.csrf_hash),
  };
}

export async function logout(ctx: Ctx, actor: Actor): Promise<void> {
  await ctx.db.query('DELETE FROM acct_sessions WHERE token_hash = $1', [actor.sessionHash]);
}

// ------------------------------------------------------------------ TOTP enrolment
export async function totpSetup(ctx: Ctx, actor: Actor): Promise<{ secret: string; uri: string }> {
  if (actor.totpEnabled) throw badRequest('The second factor is already enabled');
  const secret = newTotpSecret();
  await ctx.db.query('UPDATE acct_users SET totp_secret_enc = $2, updated_at = $3 WHERE id = $1 AND totp_enabled_at IS NULL', [actor.userId, encryptSecret(secret, ctx.secret), ctx.now().toISOString()]);
  return { secret, uri: otpauthUri(secret, actor.email) };
}

/** Turns the authenticator on; returns the first set of recovery codes, shown once. */
export async function totpEnable(ctx: Ctx, actor: Actor, code: unknown): Promise<{ recoveryCodes: string[] }> {
  if (actor.totpEnabled) throw badRequest('The second factor is already enabled');
  return ctx.db.tx(async (q) => {
    const u = (await q.query<{ totp_secret_enc: string | null }>('SELECT totp_secret_enc FROM acct_users WHERE id = $1 FOR UPDATE', [actor.userId])).rows[0];
    const secret = u?.totp_secret_enc ? decryptSecret(u.totp_secret_enc, ctx.secret) : null;
    const step = secret && typeof code === 'string' ? matchTotp(secret, code.trim(), ctx.now().getTime()) : null;
    if (step === null) throw badRequest('That code is not correct. Check the time on your device and try again.');
    await q.query('UPDATE acct_users SET totp_enabled_at = $2, totp_last_step = $3, updated_at = $2 WHERE id = $1', [actor.userId, ctx.now().toISOString(), step]);
    await q.query('UPDATE acct_sessions SET mfa_verified = TRUE WHERE token_hash = $1', [actor.sessionHash]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: null, action: 'user.totp_enabled', objectType: 'user', objectId: actor.userId }, ctx.now());
    return { recoveryCodes: await issueRecoveryCodes(q, ctx, actor.userId) };
  });
}

// ------------------------------------------------------------------ password reset
export const RESET_DONE = 'If an account uses this address, a reset email has been sent to it.';

export async function requestPasswordReset(ctx: Ctx, emailIn: unknown, ip: string): Promise<{ message: string }> {
  if (!(await rateHit(ctx.db, `reset-ip:${ip}`, 3600e3, 10, ctx.now()))) throw new AcctError(429, 'Too many requests; try again later.');
  let email: string;
  try { email = normaliseEmail(emailIn); } catch { return { message: RESET_DONE }; }
  const u = (await ctx.db.query<{ id: string }>('SELECT id FROM acct_users WHERE email = $1', [email])).rows[0];
  if (u) {
    const token = await ctx.db.tx((q) => issueToken(q, ctx, { purpose: 'reset_password', userId: u.id, email }));
    await ctx.mailer.send({ to: email, kind: 'reset_password', subject: 'Reset your EmersonEIMS password', text: `Open ${ctx.origin}/accounts?view=reset&token=${token} to choose a new password. The link works once and expires in 1 hour.` });
  }
  return { message: RESET_DONE };
}

export async function resetPassword(ctx: Ctx, token: unknown, password: unknown): Promise<void> {
  const pw = checkPassword(password);
  const hash = await hashPassword(pw);
  await ctx.db.tx(async (q) => {
    const t = await consumeToken(q, ctx, token, 'reset_password');
    if (!t?.user_id) throw badRequest('This reset link is not valid or has expired.');
    // A completed reset proves control of the mailbox (the single-use link was sent there), so it
    // also verifies the address. Without this, a user restored from a backup (address unverified,
    // scripts/db/import-org.cjs) could never sign in again (recovery drill, 2026-11-24).
    await q.query('UPDATE acct_users SET password_hash = $2, failed_logins = 0, locked_until = NULL, email_verified_at = COALESCE(email_verified_at, $3), updated_at = $3 WHERE id = $1', [t.user_id, hash, ctx.now().toISOString()]);
    await q.query('DELETE FROM acct_sessions WHERE user_id = $1', [t.user_id]);
    await appendAudit(q, ctx.secret, { actorUserId: t.user_id, orgId: null, action: 'user.password_reset', objectType: 'user', objectId: t.user_id }, ctx.now());
  });
}
