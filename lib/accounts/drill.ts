/**
 * PREVIEW-ONLY VERIFICATION TOOLS (Report B live-database authorisation,
 * items 8, 9 and 12). Database credentials stay in the preview environment:
 * these run INSIDE the preview and return only booleans and counts.
 *
 * DISASTER-RECOVERY DRILL: a full-fidelity export of one organisation from the
 * preview database, restored into the SEPARATE, EMPTY test database
 * (ACCOUNTS_DR_DATABASE_URL, migrated by the owner, disposable), then checked:
 * projects, every revision hash, attachments, audit records (archived count,
 * restored-database audit chain), account access and second-factor settings
 * preserved (stored credentials identical; optionally a fictitious test
 * user's real password and authenticator code checked against the restored
 * copy). The restored copy stays in the test database for inspection.
 *
 * ISOLATION REPORT: whether the accounts database is separate from production,
 * and whether production mail, payment and database settings are present in
 * this environment. Never returns a value, only true or false.
 *
 * Both need a registry administrator in a second-factor session with a fresh
 * code, and the accounts feature on (never in production).
 */
import 'server-only';
import { useTotp } from './auth';
import { appendAudit, verifyAuditLog } from './audit';
import { AcctError, assertUuid, badRequest, contentSha256, notFound, type Actor, type Ctx } from './context';
import { decryptSecret, matchTotp, verifyPassword } from './crypto';
import { accountsDatabaseUrl } from './config';
import type { AccountsDb } from './db';
import { mailMode } from './testMail';
import { databaseRole } from './identity';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('./backup-core.cjs') as {
  exportOrg: (c: unknown, orgId: string, o?: { fullFidelity?: boolean }) => Promise<Record<string, unknown> & { exportSha256: string; projects: unknown[]; revisions: { id: string; contentSha256: string }[]; attachments: { id: string; sha256: string }[]; audit: unknown[] }>;
  verifyExport: (e: unknown) => string[];
  importOrg: (c: unknown, secret: string, e: unknown, now?: Date) => Promise<{ projects: number; revisions: number; attachments: number }>;
};

type PgClient = { query: (t: string, p?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>; connect: () => Promise<void>; end: () => Promise<void> };
async function pgClient(url: string): Promise<PgClient> {
  const pg = (await import('pg')) as unknown as { Client: new (c: Record<string, unknown>) => PgClient };
  const c = new pg.Client({ connectionString: url, ssl: /sslmode=disable/.test(url) ? false : { rejectUnauthorized: true } });
  await c.connect();
  return c;
}

/** Tests only: PGlite-backed clients in place of real connections. */
let clientFactoryForTests: ((which: 'primary' | 'dr') => Promise<PgClient>) | null = null;
export function setDrillClientsForTests(f: typeof clientFactoryForTests) { clientFactoryForTests = f; }

export function drDatabaseUrl(env: Record<string, string | undefined>): string | null {
  const u = (env.ACCOUNTS_DR_DATABASE_URL ?? '').trim();
  return /^postgres(ql)?:\/\//.test(u) ? u : null;
}

async function requireRegistryAdminWithCode(ctx: Ctx, actor: Actor, totp: unknown) {
  if (!actor.isRegistryAdmin) throw notFound();
  if (!actor.mfa) throw new AcctError(403, 'Registry administration needs the second factor in this session.', { needMfa: true });
  const ok = await ctx.db.tx((q) => useTotp(q, ctx, actor.userId, totp));
  if (!ok) throw new AcctError(403, 'A fresh authenticator code is required.');
}

export async function isolationReport(ctx: Ctx, actor: Actor, body: Record<string, unknown>) {
  await requireRegistryAdminWithCode(ctx, actor, body.totp);
  const e = ctx.env;
  const accountsUrl = accountsDatabaseUrl(e);
  const prodUrl = (e.DATABASE_URL ?? e.POSTGRES_URL ?? '').trim();
  const drUrl = drDatabaseUrl(e);
  const has = (...names: string[]) => names.some((n) => !!(e[n] ?? '').trim());
  return {
    vercelEnv: e.VERCEL_ENV ?? '(not set)',
    accountsDatabaseConfigured: !!accountsUrl,
    productionDatabaseUrlPresentHere: !!prodUrl,
    accountsDatabaseIsNotProduction: !!accountsUrl && accountsUrl !== prodUrl,
    drDatabaseConfigured: !!drUrl,
    drDatabaseIsSeparate: !!drUrl && drUrl !== accountsUrl && drUrl !== prodUrl,
    accountsMailMode: mailMode(e),
    productionMailSettingsPresentHere: has('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'RESEND_API_KEY', 'FORMSUBMIT_EMAIL'),
    paymentSettingsPresentHere: has('MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_PASSKEY', 'PAYSTACK_SECRET_KEY', 'FLUTTERWAVE_SECRET_KEY'),
    paidModeOn: e.NEXT_PUBLIC_AI_TOOLS_PAID === 'true',
    accountsDatabaseRole: (await databaseRole(ctx.db)) ?? 'unmarked',
  };
}

/**
 * A registry administrator gives up the role (second-factor session, fresh code;
 * audited). The live-validation run calls it at the end, so the one-time
 * bootstrapped TEST administrator holds no rights after testing.
 */
export async function relinquishRegistryAdmin(ctx: Ctx, actor: Actor, body: Record<string, unknown>) {
  await requireRegistryAdminWithCode(ctx, actor, body.totp);
  await ctx.db.tx(async (q) => {
    await q.query('UPDATE acct_users SET is_registry_admin = FALSE, updated_at = $2 WHERE id = $1', [actor.userId, ctx.now().toISOString()]);
    await appendAudit(q, ctx.secret, { actorUserId: actor.userId, orgId: null, action: 'registry_admin.relinquished', objectType: 'user', objectId: actor.userId }, ctx.now());
  });
  return { registryAdmin: false };
}

export async function disasterRecoveryDrill(ctx: Ctx, actor: Actor, body: Record<string, unknown>) {
  await requireRegistryAdminWithCode(ctx, actor, body.totp);
  const orgId = assertUuid(body.orgId);
  const primaryUrl = accountsDatabaseUrl(ctx.env);
  const drUrl = drDatabaseUrl(ctx.env);
  const prodUrl = (ctx.env.DATABASE_URL ?? ctx.env.POSTGRES_URL ?? '').trim();
  if (!clientFactoryForTests) {
    if (!primaryUrl || !drUrl) throw new AcctError(503, 'The disaster-recovery test database is not configured (ACCOUNTS_DR_DATABASE_URL).');
    if (drUrl === primaryUrl || drUrl === prodUrl) throw new AcctError(400, 'Refused: the disaster-recovery database must be a separate, empty test database.');
  }
  const open = (w: 'primary' | 'dr') => (clientFactoryForTests ? clientFactoryForTests(w) : pgClient(w === 'primary' ? primaryUrl! : drUrl!));
  const src = await open('primary');
  const dst = await open('dr');
  try {
    // Identity BEFORE anything is restored: the source must be the owner-marked preview database and the
    // target the owner-marked disaster-recovery test database. Production has no marker, so it never qualifies.
    const srcRole = await databaseRole(src as unknown as AccountsDb);
    const dstRole = await databaseRole(dst as unknown as AccountsDb);
    if (srcRole !== 'preview' || dstRole !== 'dr-test') throw badRequest(`Refused: database identity check failed (source ${srcRole ?? 'unmarked'}, target ${dstRole ?? 'unmarked'}; expected preview and dr-test).`);
    // The test database must be empty (no organisations) and migrated.
    const orgsInDr = Number((await dst.query('SELECT count(*)::int AS n FROM acct_orgs')).rows[0]?.n ?? -1);
    if (orgsInDr !== 0) throw badRequest('Refused: the disaster-recovery database is not empty (use a fresh, migrated test database).');

    // 1. Export (full fidelity), as a file would carry it (JSON round trip).
    const exp = JSON.parse(JSON.stringify(await lib.exportOrg(src, orgId, { fullFidelity: true }))) as Awaited<ReturnType<typeof lib.exportOrg>>;
    const problems = lib.verifyExport(exp);
    // 2. Restore into the separate test database.
    const restored = await lib.importOrg(dst, ctx.secret, exp, ctx.now());

    // 3. Checks on the restored copy.
    const revs = (await dst.query('SELECT id, content, content_sha256 FROM acct_revisions WHERE org_id = $1', [orgId])).rows;
    const revisionsIntact = revs.length === exp.revisions.length
      && revs.every((r) => contentSha256(typeof r.content === 'string' ? JSON.parse(r.content as string) : r.content) === r.content_sha256)
      && exp.revisions.every((x) => revs.some((r) => r.id === x.id && r.content_sha256 === x.contentSha256));
    const atts = (await dst.query("SELECT id, sha256 FROM acct_attachments WHERE org_id = $1 AND status = 'complete'", [orgId])).rows;
    const attachmentsIntact = atts.length === exp.attachments.length && exp.attachments.every((a) => atts.some((r) => r.id === a.id && r.sha256 === a.sha256));
    const projectsRestored = Number((await dst.query('SELECT count(*)::int AS n FROM acct_projects WHERE org_id = $1', [orgId])).rows[0]?.n) === exp.projects.length;
    const archived = Number((await dst.query('SELECT count(*)::int AS n FROM acct_audit_archive WHERE org_id = $1', [orgId])).rows[0]?.n);
    // verifyAuditLog only reads (query); no transaction is needed on the restored copy.
    const dstDb = { query: (t: string, p?: unknown[]) => dst.query(t, p), tx: async () => { throw new Error('read only'); } } as unknown as AccountsDb;
    const drAudit = await verifyAuditLog(dstDb, ctx.secret);

    // Account access and MFA settings: stored credentials identical, member by member.
    const cols = 'u.id, u.password_hash, u.email_verified_at, u.totp_secret_enc, u.totp_enabled_at';
    const q = `SELECT ${cols} FROM acct_users u JOIN acct_memberships m ON m.user_id = u.id WHERE m.org_id = $1 ORDER BY u.id`;
    const a = (await src.query(q, [orgId])).rows; const b = (await dst.query(q, [orgId])).rows;
    const same = (x: unknown, y: unknown) => String(x ?? '') === String(y ?? '') || (x instanceof Date && y instanceof Date && x.getTime() === y.getTime());
    const credentialsPreserved = a.length === b.length && a.every((r, i) => same(r.id, b[i].id) && same(r.password_hash, b[i].password_hash) && same(r.totp_secret_enc, b[i].totp_secret_enc) && (r.email_verified_at === null) === (b[i].email_verified_at === null) && (r.totp_enabled_at === null) === (b[i].totp_enabled_at === null));
    const rcq = 'SELECT count(*)::int AS n FROM acct_recovery_codes r JOIN acct_memberships m ON m.user_id = r.user_id WHERE m.org_id = $1 AND r.used_at IS NULL';
    const recoveryCodesPreserved = Number((await src.query(rcq, [orgId])).rows[0]?.n) === Number((await dst.query(rcq, [orgId])).rows[0]?.n);

    // Optional: a FICTITIOUS test user's real password and authenticator code against the restored copy.
    let probe: Record<string, boolean> | null = null;
    const pb = body.probe as { email?: unknown; password?: unknown; totp?: unknown } | undefined;
    if (pb && typeof pb.email === 'string' && typeof pb.password === 'string') {
      const u = (await dst.query('SELECT password_hash, email_verified_at, totp_secret_enc, totp_enabled_at FROM acct_users WHERE email = $1', [pb.email.toLowerCase()])).rows[0];
      const seed = u?.totp_secret_enc ? decryptSecret(String(u.totp_secret_enc), ctx.secret) : null;
      probe = {
        found: !!u,
        passwordAccepted: !!u && (await verifyPassword(pb.password, String(u.password_hash))),
        emailStillVerified: !!u?.email_verified_at,
        secondFactorStillEnabled: !!u?.totp_enabled_at,
        authenticatorCodeAccepted: !!seed && typeof pb.totp === 'string' && matchTotp(seed, pb.totp, ctx.now().getTime()) !== null,
      };
    }

    const reviewersSuspended = Number((await dst.query("SELECT count(*)::int AS n FROM acct_reviewers WHERE org_id = $1 AND state <> 'suspended'", [orgId])).rows[0]?.n) === 0;
    const result = {
      exportVerified: problems.length === 0,
      restored,
      projectsRestored, revisionsIntact, attachmentsIntact,
      auditRecordsArchived: archived === exp.audit.length,
      restoredAuditChainVerifies: drAudit.ok,
      credentialsPreserved, recoveryCodesPreserved,
      reviewersSuspendedPendingReverification: reviewersSuspended,
      probe,
    };
    await appendAudit(ctx.db, ctx.secret, { actorUserId: actor.userId, orgId, action: 'dr.drill_run', objectType: 'org', objectId: orgId, detail: { ok: Object.values(result).every((v) => v !== false) } }, ctx.now());
    return result;
  } finally {
    await src.end().catch(() => {});
    await dst.end().catch(() => {});
  }
}
