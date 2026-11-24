/**
 * Report B database setup approval: safeguards 2, 3, 4, 5 and 8.
 *  - Accounts run only on the owner-marked 'preview' database, never on the
 *    production DATABASE_URL / POSTGRES_URL (guard and Solar lookup).
 *  - The recovery drill checks BOTH database identities before restoring.
 *  - The recovery database URL is read in exactly one place (drill.ts).
 *  - The bootstrapped test administrator needs a second-factor session, and
 *    can relinquish the role (audited).
 * PGlite only; TEST data only.
 */
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';
import { fromPglite, setAccountsDbForTests } from '@/lib/accounts/db';
import { databaseRole, previewDatabaseConfirmed } from '@/lib/accounts/identity';
import { handle } from '@/lib/accounts/http';
import { disasterRecoveryDrill, isolationReport, relinquishRegistryAdmin, setDrillClientsForTests } from '@/lib/accounts/drill';
import { createOrg } from '@/lib/accounts/orgs';
import { createProject } from '@/lib/accounts/projects';
import { login, sessionActor, signup, verifyEmail } from '@/lib/accounts/auth';
import { verifyAuditLog } from '@/lib/accounts/audit';
import { solarApprovalFor } from '@/lib/accounts/solarApproval';
import { newTestEnv, makeUser, freshCode, lib, TEST_PASSWORD, TEST_SECRET } from '../helpers/accountsTestDb';

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

async function migrated(role: 'preview' | 'dr-test' | null) {
  const pg = new PGlite();
  await lib.applyMigrations(pg);
  if (role) await pg.query('INSERT INTO acct_database_identity (role) VALUES ($1)', [role]);
  return pg;
}

const ENV = { ACCOUNTS_ENABLED: 'true', VERCEL_ENV: 'preview', ACCOUNTS_SECRET_KEY: TEST_SECRET, ACCOUNTS_DATABASE_URL: 'postgres://accounts-preview.test/db', ACCOUNTS_PUBLIC_ORIGIN: 'https://preview.test' };
const ping = () => new NextRequest('https://preview.test/api/accounts/me', { method: 'GET' });
const spec = { session: false, run: async () => ({ reached: true }) };

describe('the guard runs accounts only on the owner-marked preview database', () => {
  afterAll(() => setAccountsDbForTests(null));
  beforeEach(() => setAccountsDbForTests(null));

  it('marked preview → served; unmarked, dr-test, or no migration 005 → 503 before any route runs', async () => {
    const cases: Array<[PGlite, number]> = [
      [await migrated('preview'), 200],
      [await migrated(null), 503],
      [await migrated('dr-test'), 503],
    ];
    const bare = new PGlite(); // a database without the accounts schema at all (as production would be)
    cases.push([bare, 503]);
    for (const [pg, status] of cases) {
      setAccountsDbForTests(fromPglite(pg));
      const res = await handle(ping(), spec, {}, ENV);
      expect(res.status).toBe(status);
      const body = await res.json();
      if (status === 503) expect(body.error).toMatch(/not marked as the preview database/);
      else expect(body.reached).toBe(true);
    }
  });

  it('refuses when ACCOUNTS_DATABASE_URL equals the production DATABASE_URL or POSTGRES_URL, even on a marked database', async () => {
    setAccountsDbForTests(fromPglite(await migrated('preview')));
    for (const extra of [{ DATABASE_URL: ENV.ACCOUNTS_DATABASE_URL }, { POSTGRES_URL: ENV.ACCOUNTS_DATABASE_URL }]) {
      const res = await handle(ping(), spec, {}, { ...ENV, ...extra });
      expect(res.status).toBe(503);
      expect((await res.json()).error).toMatch(/is the production database/);
    }
  });

  it('a marker the owner has just set takes effect at once (refusals are not cached)', async () => {
    const pg = await migrated(null);
    const db = fromPglite(pg);
    expect((await previewDatabaseConfirmed(db, ENV)).ok).toBe(false);
    await pg.query("INSERT INTO acct_database_identity (role) VALUES ('preview')");
    expect((await previewDatabaseConfirmed(db, ENV)).ok).toBe(true);
    // Only one row, and only the two roles, can ever exist.
    await expect(pg.query("INSERT INTO acct_database_identity (role) VALUES ('dr-test')")).rejects.toThrow();
    await expect(pg.query("UPDATE acct_database_identity SET role = 'production'")).rejects.toThrow();
    expect(await databaseRole(pg)).toBe('preview');
  });

  it('the Solar approval lookup stays DRAFT on an unmarked database', async () => {
    setAccountsDbForTests(fromPglite(await migrated(null)));
    const req = new NextRequest('https://preview.test/api/solar/proposal', { method: 'POST', headers: { cookie: '__Host-eims_session=x' } });
    expect(await solarApprovalFor(req, { pvKwp: 5 }, ENV)).toEqual({ verifier: null, verifiedApproval: null });
  });
});

describe('the recovery drill verifies both database identities before restoring anything', () => {
  const asClient = async (pg: PGlite) => ({ query: (t: string, p?: unknown[]) => pg.query<Record<string, unknown>>(t, p), connect: async () => {}, end: async () => {} });

  it('refuses a target that is unmarked or marked preview, and a source not marked preview; restores nothing', async () => {
    const w = await newTestEnv();
    const owner = await makeUser(w, 'id-owner@test.example', { totp: true });
    const admin = await makeUser(w, 'id-admin@test.example', { totp: true, registryAdmin: true });
    const org = (await createOrg(w.ctx, owner.actor, 'TEST identity org')).id;
    await createProject(w.ctx, owner.actor, org, { tool: 'solar', name: 'TEST identity', content: { pvKwp: 5 } });
    const attempts: Array<[PGlite, PGlite, RegExp]> = [
      [w.pg, await migrated(null), /source preview, target unmarked/],
      [w.pg, await migrated('preview'), /source preview, target preview/],
    ];
    const drSource = await migrated('dr-test');
    attempts.push([drSource, await migrated('dr-test'), /source dr-test, target dr-test/]);
    for (const [src, dst, msg] of attempts) {
      setDrillClientsForTests(async (which) => asClient(which === 'primary' ? src : dst));
      try {
        await rejects(disasterRecoveryDrill(w.ctx, admin.actor, { orgId: org, totp: freshCode(w, admin) }), 400, msg);
      } finally { setDrillClientsForTests(null); }
      expect((await dst.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_orgs')).rows[0].n).toBe(0);
      expect((await dst.query<{ n: number }>('SELECT count(*)::int AS n FROM acct_users')).rows[0].n).toBe(0);
    }
  });

  it('the recovery database URL is read in exactly one file of the deployed code (lib/accounts/drill.ts)', () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
        if (!/\.(ts|tsx|js|cjs|mjs)$/.test(e.name)) continue;
        if (fs.readFileSync(p, 'utf8').includes('ACCOUNTS_DR_DATABASE_URL')) hits.push(path.relative(process.cwd(), p).split(path.sep).join('/'));
      }
    };
    for (const d of ['app', 'lib', 'components', 'middleware.ts'].map((x) => path.join(process.cwd(), x))) {
      if (!fs.existsSync(d)) continue;
      if (fs.statSync(d).isDirectory()) walk(d);
      else if (fs.readFileSync(d, 'utf8').includes('ACCOUNTS_DR_DATABASE_URL')) hits.push(path.basename(d));
    }
    expect(hits).toEqual(['lib/accounts/drill.ts']);
  });
});

describe('bootstrap administrator: second factor required; relinquished after testing', () => {
  it('a freshly bootstrapped administrator without a second-factor session is refused every registry action', async () => {
    const env = await newTestEnv();
    env.ctx.env = { ...env.ctx.env, ACCOUNTS_MAIL_MODE: 'outbox', ACCOUNTS_TEST_EMAIL_DOMAINS: 'test.example', ACCOUNTS_BOOTSTRAP_REGISTRY_ADMIN: 'boot-id@test.example' };
    await signup(env.ctx, { email: 'boot-id@test.example', password: TEST_PASSWORD }, 'ip-bi');
    await verifyEmail(env.ctx, env.mailer.lastToken('boot-id@test.example', 'verify_email'));
    const s = await login(env.ctx, { email: 'boot-id@test.example', password: TEST_PASSWORD }, 'ip-bi');
    const actor = (await sessionActor(env.ctx, 'token' in s ? s.token : ''))!;
    expect(actor).toMatchObject({ isRegistryAdmin: true, mfa: false });
    for (const action of [isolationReport, relinquishRegistryAdmin]) {
      const err = await rejects(action(env.ctx, actor, { totp: '123456' }), 403, /second factor/);
      expect((err as { extra?: { needMfa?: boolean } }).extra?.needMfa).toBe(true);
    }
    await rejects(disasterRecoveryDrill(env.ctx, actor, { orgId: '00000000-0000-4000-8000-000000000000', totp: '123456' }), 403, /second factor/);
  });

  it('relinquish: non-admin 404, wrong code 403; with a fresh code the role is removed, audited, and registry actions are then 404', async () => {
    const env = await newTestEnv();
    const plain = await makeUser(env, 'rq-user@test.example', { totp: true });
    const admin = await makeUser(env, 'rq-admin@test.example', { totp: true, registryAdmin: true });
    await rejects(relinquishRegistryAdmin(env.ctx, plain.actor, { totp: freshCode(env, plain) }), 404);
    await rejects(relinquishRegistryAdmin(env.ctx, admin.actor, { totp: '000000' }), 403);
    expect(await relinquishRegistryAdmin(env.ctx, admin.actor, { totp: freshCode(env, admin) })).toEqual({ registryAdmin: false });
    expect((await env.pg.query<{ is_registry_admin: boolean }>('SELECT is_registry_admin FROM acct_users WHERE id = $1', [admin.userId])).rows[0].is_registry_admin).toBe(false);
    expect((await env.pg.query("SELECT 1 FROM acct_audit WHERE action = 'registry_admin.relinquished' AND actor_user_id = $1", [admin.userId])).rows.length).toBe(1);
    expect(await verifyAuditLog(env.db, env.ctx.secret)).toMatchObject({ ok: true });
    const again = (await sessionActor(env.ctx, admin.token))!;
    expect(again.isRegistryAdmin).toBe(false);
    await rejects(isolationReport(env.ctx, again, { totp: freshCode(env, admin) }), 404);
  });

  it('the relinquish route is registered, needs a session, and is a POST', async () => {
    const { ROUTES } = await import('@/lib/accounts/routes');
    const r = (ROUTES as Array<[string, string, { session: boolean }]>).find(([, p]) => p === 'registry/self/relinquish');
    expect(r?.[0]).toBe('POST');
    expect(r?.[2].session).toBe(true);
  });
});
