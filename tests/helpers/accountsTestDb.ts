/**
 * PGlite (WASM Postgres) test database for the accounts tests. Never connects
 * to any real database. TEST data only: no real names or registrations.
 */
import { PGlite } from '@electric-sql/pglite';
import { fromPglite, type AccountsDb } from '@/lib/accounts/db';
import { MemoryMailer } from '@/lib/accounts/mailer';
import type { Actor, Ctx } from '@/lib/accounts/context';
import { login, sessionActor, signup, totpEnable, totpSetup, verifyEmail } from '@/lib/accounts/auth';
import { totpCode } from '@/lib/accounts/crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('../../scripts/db/accounts-lib.cjs');

export const TEST_SECRET = 'TEST-ONLY-accounts-secret-key-0123456789abcdef';
export const TEST_SIGNING_KEY = 'TEST-ONLY-approval-signing-key-0123456789abcdef';
export const TEST_PASSWORD = 'correct horse battery staple';

export interface TestEnv { pg: PGlite; db: AccountsDb; ctx: Ctx; mailer: MemoryMailer; clock: { t: number } }

export async function newTestEnv(): Promise<TestEnv> {
  const pg = new PGlite();
  await lib.applyMigrations(pg);
  const db = fromPglite(pg);
  const mailer = new MemoryMailer();
  const clock = { t: Date.parse('2026-11-22T08:00:00Z') };
  const ctx: Ctx = { db, secret: TEST_SECRET, mailer, now: () => new Date(clock.t), env: { PROPOSAL_APPROVAL_SIGNING_KEY: TEST_SIGNING_KEY }, origin: 'https://preview.test' };
  return { pg, db, ctx, mailer, clock };
}

export interface TestUser { email: string; actor: Actor; token: string; csrf: string; totpSecret: string | null; userId: string }

/** Signs up, verifies the address and signs in (optionally enrolling TOTP). */
export async function makeUser(env: TestEnv, email: string, opts: { totp?: boolean; registryAdmin?: boolean } = {}): Promise<TestUser> {
  await signup(env.ctx, { email, password: TEST_PASSWORD, displayName: `TEST ${email}` }, `ip-${email}`);
  const tok = env.mailer.lastToken(email, 'verify_email');
  await verifyEmail(env.ctx, tok);
  if (opts.registryAdmin) await env.pg.query('UPDATE acct_users SET is_registry_admin = TRUE WHERE email = $1', [email]);
  const s = await login(env.ctx, { email, password: TEST_PASSWORD }, `ip-${email}`);
  if ('needTotp' in s) throw new Error('unexpected');
  let actor = (await sessionActor(env.ctx, s.token))!;
  let totpSecret: string | null = null;
  if (opts.totp) {
    totpSecret = (await totpSetup(env.ctx, actor)).secret;
    await totpEnable(env.ctx, actor, totpCode(totpSecret, env.clock.t));
    env.clock.t += 30e3;
    actor = (await sessionActor(env.ctx, s.token))!;
  }
  return { email, actor, token: s.token, csrf: s.csrf, totpSecret, userId: actor.userId };
}

/** A fresh TOTP code (advances the test clock one step so the code has not been used). */
export function freshCode(env: TestEnv, u: TestUser): string {
  env.clock.t += 30e3;
  return totpCode(u.totpSecret!, env.clock.t);
}

export { lib };
