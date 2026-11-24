/**
 * Accounts database scripts library (migrate.cjs, check-schema.cjs, export-org.cjs,
 * import-org.cjs, purge-deleted.cjs) and the PGlite tests. Re-exports the
 * file-system-free core (lib/accounts/backup-core.cjs) and adds what needs the disk
 * or a terminal: migration files, the schema check, argument parsing, the connection.
 * Multi-statement migration files use client.exec when present (PGlite), else
 * client.query (node-postgres simple protocol).
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const core = require('../../lib/accounts/backup-core.cjs');
const { sha256 } = core;

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'lib', 'db', 'migrations');

function migrationFiles(dir = MIGRATIONS_DIR) {
  return fs.readdirSync(dir).filter((f) => /^accounts-\d{3}-[a-z0-9-]+\.sql$/.test(f)).sort();
}

/** Applies every accounts-NNN-*.sql not yet recorded. Additive files only (CREATE ... IF NOT EXISTS). */
async function applyMigrations(client, dir = MIGRATIONS_DIR) {
  const run = (sql) => (typeof client.exec === 'function' ? client.exec(sql) : client.query(sql));
  await run('CREATE TABLE IF NOT EXISTS acct_schema_migrations (name TEXT PRIMARY KEY, sha256 TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  const applied = [];
  for (const f of migrationFiles(dir)) {
    // Line endings normalised so a CRLF checkout does not look like a changed migration.
    const sql = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
    const hash = sha256(sql);
    const done = (await client.query('SELECT sha256 FROM acct_schema_migrations WHERE name = $1', [f])).rows[0];
    if (done) {
      if (done.sha256 !== hash) throw new Error(`Migration ${f} changed after it was applied; write a new numbered file instead`);
      continue;
    }
    await run(sql);
    await client.query('INSERT INTO acct_schema_migrations (name, sha256) VALUES ($1, $2)', [f, hash]);
    applied.push(f);
  }
  return applied;
}

/** Parses --name=value arguments. */
function args(argv) {
  const o = {};
  for (const a of argv) {
    const m = /^--([a-z-]+)(?:=(.*))?$/.exec(a);
    if (m) o[m[1]] = m[2] === undefined ? true : m[2];
  }
  return o;
}

/**
 * A node-postgres Client for ACCOUNTS_DATABASE_URL only (never DATABASE_URL),
 * refusing anything that looks like production unless explicitly confirmed.
 */
async function connectAccountsDb(opts = {}) {
  const url = (process.env.ACCOUNTS_DATABASE_URL || '').trim();
  if (!/^postgres(ql)?:\/\//.test(url)) throw new Error('ACCOUNTS_DATABASE_URL is not set. These scripts never use DATABASE_URL.');
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() === url) throw new Error('Refused: ACCOUNTS_DATABASE_URL equals DATABASE_URL (the production database).');
  if (!opts.yes) throw new Error('Refused: pass --yes to confirm the target database.');
  const { Client } = require('pg');
  const client = new Client({ connectionString: url, ssl: /sslmode=disable/.test(url) ? false : { rejectUnauthorized: true } });
  await client.connect();
  return client;
}

const SCHEMA_TABLES = [
  'acct_schema_migrations', 'acct_users', 'acct_sessions', 'acct_rate', 'acct_tokens', 'acct_orgs', 'acct_memberships',
  'acct_projects', 'acct_revisions', 'acct_attachments', 'acct_attachment_chunks', 'acct_reviewers', 'acct_approvals',
  'acct_approval_chain', 'acct_audit', 'acct_audit_head', 'acct_audit_archive', 'acct_recovery_codes', 'acct_test_outbox',
  'acct_review_decisions',
];
const SCHEMA_TRIGGERS = ['acct_revisions_immutable', 'acct_audit_immutable', 'acct_approval_chain_immutable'];

/** Read-only: every expected migration, table and append-only trigger present? Names and counts only. */
async function checkSchema(client) {
  const lines = [];
  let ok = true;
  const line = (good, what) => { if (!good) ok = false; lines.push(`${good ? 'OK     ' : 'MISSING'} ${what}`); };
  const applied = (await client.query('SELECT name FROM acct_schema_migrations ORDER BY name').catch(() => ({ rows: [] }))).rows.map((r) => r.name);
  for (const m of migrationFiles()) line(applied.includes(m), `migration ${m}`);
  const tables = (await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).rows.map((r) => r.table_name);
  for (const t of SCHEMA_TABLES) line(tables.includes(t), `table ${t}`);
  const triggers = (await client.query('SELECT tgname FROM pg_trigger WHERE NOT tgisinternal')).rows.map((r) => r.tgname);
  for (const t of SCHEMA_TRIGGERS) line(triggers.includes(t), `append-only trigger ${t}`);
  const orgs = Number((await client.query('SELECT count(*)::int AS n FROM acct_orgs').catch(() => ({ rows: [{ n: -1 }] }))).rows[0].n);
  lines.push(`INFO    organisations in this database: ${orgs} (the disaster-recovery test database must show 0)`);
  return { ok, organisations: orgs, lines };
}

module.exports = {
  ...core,
  checkSchema, MIGRATIONS_DIR, migrationFiles, applyMigrations, args, connectAccountsDb,
};
