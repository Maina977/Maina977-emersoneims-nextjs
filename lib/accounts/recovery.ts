/**
 * AUTHENTICATOR RECOVERY (Report B preview authorisation, item 4).
 *
 * Three paths, each audited:
 *
 * 1. RECOVERY CODES: 10 single-use codes, shown once when the authenticator
 *    is turned on (or regenerated). Stored only as HMAC-SHA256 under
 *    ACCOUNTS_SECRET_KEY. A code can stand in for the authenticator at
 *    sign-in (login(), lib/accounts/auth.ts). A wrong code counts as a failed
 *    sign-in (lockout applies).
 * 2. SELF-SERVICE RESET of the authenticator, for someone still able to prove
 *    the second factor: a second-factor session AND (a fresh authenticator
 *    code OR an unused recovery code). It removes the authenticator and the
 *    codes and signs out every other session; the person then enrols again.
 * 3. REGISTRY-ADMINISTRATOR RESET, the last resort when both the device and
 *    the codes are lost: a registry admin in a second-factor session, with a
 *    fresh code, who is not the person, records a reason and the reference of
 *    the out-of-band identity check. It removes the authenticator and codes,
 *    signs the person out everywhere, and SUSPENDS their reviewer profiles, so
 *    a reset can never carry someone's approval authority to whoever asked for it.
 */
import 'server-only';
import { randomBytes } from 'node:crypto';
import { appendAudit } from './audit';
import { normaliseEmail, useTotp } from './auth';
import { AcctError, badRequest, forbidden, notFound, type Actor, type Ctx, type Queryable } from './context';
import { hmacHex } from './crypto';

export const RECOVERY_CODE_COUNT = 10;
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I/L: easy to read and type
const CODE_RE = /^[A-Z0-9]{5}-?[A-Z0-9]{5}$/;

/** One code: 10 characters from a 31-symbol alphabet (about 49.5 bits), shown as XXXXX-XXXXX. */
function newCode(): string {
  const out: string[] = [];
  while (out.length < 10) {
    const b = randomBytes(16);
    for (const x of b) {
      if (x < 248 && out.length < 10) out.push(ALPHABET[x % 31]); // 248 = 8 × 31: no modulo bias
    }
  }
  return `${out.slice(0, 5).join('')}-${out.slice(5).join('')}`;
}
const normalise = (code: string) => code.trim().toUpperCase().replace(/\s+/g, '');
const codeHmac = (secret: string, userId: string, code: string) => hmacHex(secret, `recovery:${userId}:${normalise(code).replace('-', '')}`);

/** Replaces the user's codes with a fresh set (inside the caller's transaction); returns the plain codes once. */
export async function issueRecoveryCodes(q: Queryable, ctx: Ctx, userId: string): Promise<string[]> {
  const codes = Array.from({ length: RECOVERY_CODE_COUNT }, newCode);
  await q.query('DELETE FROM acct_recovery_codes WHERE user_id = $1', [userId]);
  for (const c of codes) {
    await q.query('INSERT INTO acct_recovery_codes (user_id, code_hmac, created_at) VALUES ($1, $2, $3)', [userId, codeHmac(ctx.secret, userId, c), ctx.now().toISOString()]);
  }
  await appendAudit(q, ctx.secret, { actorUserId: userId, orgId: null, action: 'user.recovery_codes_issued', objectType: 'user', objectId: userId, detail: { count: codes.length } }, ctx.now());
  return codes;
}

/** Spends one unused code (inside the caller's transaction). true only if it existed and was unused. */
export async function useRecoveryCode(q: Queryable, ctx: Ctx, userId: string, code: unknown): Promise<boolean> {
  if (typeof code !== 'string' || !CODE_RE.test(normalise(code))) return false;
  const r = await q.query(
    'UPDATE acct_recovery_codes SET used_at = $3 WHERE user_id = $1 AND code_hmac = $2 AND used_at IS NULL RETURNING user_id',
    [userId, codeHmac(ctx.secret, userId, code), ctx.now().toISOString()],
  );
  if (!r.rows.length) return false;
  const left = (await q.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_recovery_codes WHERE user_id = $1 AND used_at IS NULL', [userId])).rows[0];
  await appendAudit(q, ctx.secret, { actorUserId: userId, orgId: null, action: 'user.recovery_code_used', objectType: 'user', objectId: userId, detail: { remaining: Number(left?.n ?? 0) } }, ctx.now());
  return true;
}

export async function recoveryCodesRemaining(ctx: Ctx, actor: Actor): Promise<{ remaining: number }> {
  const r = (await ctx.db.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_recovery_codes WHERE user_id = $1 AND used_at IS NULL', [actor.userId])).rows[0];
  return { remaining: Number(r?.n ?? 0) };
}

/** A fresh authenticator code or an unused recovery code (inside the caller's transaction). */
async function proveSecondFactor(q: Queryable, ctx: Ctx, userId: string, body: Record<string, unknown>): Promise<boolean> {
  if (typeof body.totp === 'string' && body.totp.trim()) return useTotp(q, ctx, userId, body.totp);
  return useRecoveryCode(q, ctx, userId, body.recoveryCode);
}

/** New codes (the old ones stop working): second-factor session + fresh authenticator code. */
export async function regenerateRecoveryCodes(ctx: Ctx, actor: Actor, body: Record<string, unknown>): Promise<{ recoveryCodes: string[] }> {
  if (!actor.totpEnabled || !actor.mfa) throw new AcctError(403, 'This needs the second factor in this session.', { needMfa: true });
  return ctx.db.tx(async (q) => {
    if (!(await useTotp(q, ctx, actor.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required.');
    return { recoveryCodes: await issueRecoveryCodes(q, ctx, actor.userId) };
  });
}

/** Self-service: remove my authenticator (to enrol a new device). Signs out my other sessions. */
export async function resetOwnAuthenticator(ctx: Ctx, actor: Actor, body: Record<string, unknown>): Promise<void> {
  if (!actor.totpEnabled || !actor.mfa) throw new AcctError(403, 'This needs the second factor in this session.', { needMfa: true });
  await ctx.db.tx(async (q) => {
    if (!(await proveSecondFactor(q, ctx, actor.userId, body))) throw new AcctError(403, 'A fresh authenticator code or an unused recovery code is required.');
    await clearSecondFactor(q, actor.userId, ctx);
    // This session stays (it is proven); every other session ends.
    await q.query('DELETE FROM acct_sessions WHERE user_id = $1 AND token_hash <> $2', [actor.userId, actor.sessionHash]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: null, action: 'user.totp_reset_self', objectType: 'user', objectId: actor.userId }, ctx.now());
  });
}

async function clearSecondFactor(q: Queryable, userId: string, ctx: Ctx) {
  await q.query('UPDATE acct_users SET totp_secret_enc = NULL, totp_enabled_at = NULL, totp_last_step = 0, updated_at = $2 WHERE id = $1', [userId, ctx.now().toISOString()]);
  await q.query('DELETE FROM acct_recovery_codes WHERE user_id = $1', [userId]);
}

const text = (v: unknown, what: string, max: number) => {
  if (typeof v !== 'string' || !v.trim() || v.trim().length > max) throw badRequest(`${what} is required (up to ${max} characters)`);
  return v.trim();
};

/**
 * Last resort, by a registry administrator, after an out-of-band identity
 * check of the person. Removes the authenticator and codes, ends every
 * session, and suspends every reviewer profile of that person.
 */
export async function adminResetSecondFactor(ctx: Ctx, admin: Actor, body: Record<string, unknown>): Promise<{ suspendedReviewerProfiles: number }> {
  if (!admin.isRegistryAdmin) throw notFound();
  if (!admin.mfa) throw new AcctError(403, 'Registry administration needs the second factor in this session.', { needMfa: true });
  const email = normaliseEmail(body.email);
  const reason = text(body.reason, 'A reason', 300);
  const identityCheckRef = text(body.identityCheckRef, 'The reference of the identity check', 300);
  return ctx.db.tx(async (q) => {
    if (!(await useTotp(q, ctx, admin.userId, body.totp))) throw new AcctError(403, 'A fresh authenticator code is required.');
    const u = (await q.query<{ id: string }>('SELECT id FROM acct_users WHERE email = $1 FOR UPDATE', [email])).rows[0];
    if (!u) throw notFound();
    if (u.id === admin.userId) throw forbidden('You cannot reset your own second factor this way; ask another registry administrator.');
    await clearSecondFactor(q, u.id, ctx);
    await q.query('DELETE FROM acct_sessions WHERE user_id = $1', [u.id]);
    const s = await q.query<{ id: string; org_id: string }>(
      "UPDATE acct_reviewers SET state = 'suspended', updated_at = $2 WHERE user_id = $1 AND state <> 'suspended' RETURNING id, org_id",
      [u.id, ctx.now().toISOString()],
    );
    for (const r of s.rows) {
      await appendAudit(q, ctx.secret, { actorUserId: admin.userId, orgId: r.org_id, action: 'reviewer.suspended', objectType: 'reviewer', objectId: r.id, detail: { reason: 'second factor reset by registry administrator; re-verification required' } }, ctx.now());
    }
    await appendAudit(q, ctx.secret, { actorUserId: admin.userId, orgId: null, action: 'user.totp_reset_by_admin', objectType: 'user', objectId: u.id, detail: { reason, identityCheckRef, suspendedReviewerProfiles: s.rows.length } }, ctx.now());
    return { suspendedReviewerProfiles: s.rows.length };
  });
}
