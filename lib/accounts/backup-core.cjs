/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS by design: shared with the scripts/db command-line tools. */
/**
 * Shared, dependency-free helpers for the accounts database scripts
 * (migrate.cjs, export-org.cjs, import-org.cjs, purge-deleted.cjs) and the
 * PGlite recovery tests. Every statement is parameterised.
 *
 * `client` is anything with query(text, params) -> { rows } (node-postgres
 * Client, or PGlite). Multi-statement migration files use client.exec when
 * present (PGlite), else client.query (node-postgres simple protocol).
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'db', 'migrations');

/** Same output as canonicalJson in lib/solar/design/proposalApproval.ts (tested for equality). */
function canonicalJson(x) {
  if (x === null || typeof x !== 'object') {
    const s = JSON.stringify(x);
    return s === undefined ? 'null' : s;
  }
  if (Array.isArray(x)) return `[${x.map((v) => (v === undefined || typeof v === 'function' ? 'null' : canonicalJson(v))).join(',')}]`;
  const keys = Object.keys(x).filter((k) => x[k] !== undefined && typeof x[k] !== 'function').sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(x[k])}`).join(',')}}`;
}
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const iso = (v) => (v === null || v === undefined ? null : (v instanceof Date ? v : new Date(String(v))).toISOString());
const parseJson = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

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

// ------------------------------------------------------------------ audit (same hashing as lib/accounts/audit.ts)
function auditHash(r) {
  return sha256(canonicalJson({
    purpose: 'accounts-audit/v1', seq: r.seq, at: r.at, actorUserId: r.actorUserId, orgId: r.orgId,
    action: r.action, objectType: r.objectType, objectId: r.objectId, detail: r.detail, prevHash: r.prevHash,
  }));
}
const headHmac = (secret, seq, hash) => crypto.createHmac('sha256', secret).update(`accounts-audit-head/v1|${seq}|${hash ?? ''}`).digest('hex');

async function appendAudit(client, secret, e, now = new Date()) {
  const head = (await client.query('SELECT seq, head_hash FROM acct_audit_head WHERE id = 1 FOR UPDATE')).rows[0];
  const body = { seq: Number(head.seq) + 1, at: now.toISOString(), actorUserId: e.actorUserId ?? null, orgId: e.orgId ?? null, action: e.action, objectType: e.objectType, objectId: e.objectId, detail: e.detail ?? {}, prevHash: head.head_hash ?? null };
  const recordHash = auditHash(body);
  await client.query(
    'INSERT INTO acct_audit (seq, at, actor_user_id, org_id, action, object_type, object_id, detail, prev_hash, record_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [body.seq, body.at, body.actorUserId, body.orgId, body.action, body.objectType, body.objectId, JSON.stringify(body.detail), body.prevHash, recordHash],
  );
  await client.query('UPDATE acct_audit_head SET seq = $1, head_hash = $2, head_hmac = $3 WHERE id = 1', [body.seq, recordHash, headHmac(secret, body.seq, recordHash)]);
}

async function inTx(client, fn) {
  await client.query('BEGIN');
  try {
    const out = await fn();
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw e;
  }
}

// ------------------------------------------------------------------ purge (documented admin job)
/**
 * Hard-deletes projects soft-deleted more than `days` days before `now`
 * (revisions, attachments and approvals go with them, by cascade). The audit
 * log is kept. Runs only when an administrator invokes scripts/db/purge-deleted.cjs.
 */
async function purgeDeletedProjects(client, secret, now = new Date(), days = 30) {
  const cutoff = new Date(now.getTime() - days * 86400e3).toISOString();
  return inTx(client, async () => {
    await client.query("SELECT set_config('acct.purge', 'on', true)");
    const doomed = (await client.query('SELECT id, org_id FROM acct_projects WHERE deleted_at IS NOT NULL AND deleted_at < $1', [cutoff])).rows;
    for (const p of doomed) {
      await client.query('DELETE FROM acct_projects WHERE id = $1 AND org_id = $2', [p.id, p.org_id]);
      await appendAudit(client, secret, { actorUserId: null, orgId: p.org_id, action: 'project.purged', objectType: 'project', objectId: p.id, detail: { cutoff } }, now);
    }
    await client.query("SELECT set_config('acct.purge', 'off', true)");
    return doomed.map((p) => p.id);
  });
}

// ------------------------------------------------------------------ logical export / import (per organisation)
const b64 = (v) => Buffer.from(v).toString('base64');

/**
 * One organisation as JSON: the org, its members (id, email, role; NO password
 * hashes, sessions, tokens or TOTP seeds), projects, revisions, attachments
 * (bytes base64), reviewers, approvals and its audit records. Hashes are
 * included so the import can verify every item.
 */
/**
 * opts.fullFidelity (disaster recovery into the SAME environment, same
 * ACCOUNTS_SECRET_KEY): also exports each member's scrypt password hash,
 * verification time, encrypted second-factor seed and step, and recovery-code
 * HMACs, so a restore preserves sign-in and the second factor. Default (false):
 * a portable copy without credentials; restored users reset their password.
 */
async function exportOrg(client, orgId, opts = {}) {
  const fullFidelity = opts.fullFidelity === true;
  const one = async (sql) => (await client.query(sql, [orgId])).rows;
  const org = (await one('SELECT id, name, created_by, created_at FROM acct_orgs WHERE id = $1'))[0];
  if (!org) throw new Error('No such organisation');
  const members = await one('SELECT m.user_id, u.email, u.display_name, m.role, m.created_at FROM acct_memberships m JOIN acct_users u ON u.id = m.user_id WHERE m.org_id = $1 ORDER BY m.user_id');
  const projects = await one('SELECT * FROM acct_projects WHERE org_id = $1 ORDER BY id');
  const revisions = await one('SELECT * FROM acct_revisions WHERE org_id = $1 ORDER BY project_id, version');
  const attachments = await one("SELECT * FROM acct_attachments WHERE org_id = $1 AND status = 'complete' ORDER BY id");
  const reviewers = await one('SELECT * FROM acct_reviewers WHERE org_id = $1 ORDER BY id');
  const approvals = await one('SELECT * FROM acct_approvals WHERE org_id = $1 ORDER BY id');
  const decisions = await one('SELECT * FROM acct_review_decisions WHERE org_id = $1 ORDER BY created_at, id');
  const credentials = fullFidelity
    ? await one(`SELECT u.id, u.password_hash, u.email_verified_at, u.totp_secret_enc, u.totp_enabled_at, u.totp_last_step
                 FROM acct_users u JOIN acct_memberships m ON m.user_id = u.id WHERE m.org_id = $1 ORDER BY u.id`)
    : [];
  const recovery = fullFidelity
    ? await one(`SELECT r.user_id, r.code_hmac, r.created_at, r.used_at FROM acct_recovery_codes r
                 JOIN acct_memberships m ON m.user_id = r.user_id WHERE m.org_id = $1 ORDER BY r.user_id, r.code_hmac`)
    : [];
  const audit = await one('SELECT * FROM acct_audit WHERE org_id = $1 ORDER BY seq');
  const body = {
    format: 'emersoneims-accounts-org-export', formatVersion: 1,
    org: { id: org.id, name: org.name, createdBy: org.created_by, createdAt: iso(org.created_at) },
    members: members.map((m) => ({ userId: m.user_id, email: m.email, displayName: m.display_name, role: m.role, createdAt: iso(m.created_at) })),
    projects: projects.map((p) => ({ id: p.id, tool: p.tool, name: p.name, source: p.source, currentVersion: Number(p.current_version), currentRevisionId: p.current_revision_id, createdBy: p.created_by, createdAt: iso(p.created_at), updatedAt: iso(p.updated_at), deletedAt: iso(p.deleted_at), deletedBy: p.deleted_by })),
    revisions: revisions.map((r) => ({ id: r.id, projectId: r.project_id, version: Number(r.version), parentRevisionId: r.parent_revision_id, content: parseJson(r.content), contentSha256: r.content_sha256, restoredFrom: r.restored_from, note: r.note, createdBy: r.created_by, createdAt: iso(r.created_at) })),
    attachments: attachments.map((a) => ({ id: a.id, projectId: a.project_id, filename: a.filename, mediaType: a.media_type, sizeBytes: Number(a.size_bytes), sha256: a.sha256, dataBase64: b64(a.data), createdBy: a.created_by, createdAt: iso(a.created_at), deletedAt: iso(a.deleted_at) })),
    reviewers: reviewers.map((r) => ({ id: r.id, userId: r.user_id, legalName: r.legal_name, identityCheckStatus: r.identity_check_status, professionalBody: r.professional_body, registrationNumber: r.registration_number, scope: parseJson(r.scope), validFrom: r.valid_from ? iso(r.valid_from).slice(0, 10) : null, validUntil: r.valid_until ? iso(r.valid_until).slice(0, 10) : null, evidenceRef: r.evidence_ref, state: r.state, verifiedBy: r.verified_by, verifiedAt: iso(r.verified_at), createdAt: iso(r.created_at) })),
    reviewDecisions: decisions.map((d) => ({ id: d.id, projectId: d.project_id, revisionId: d.revision_id, revisionHash: d.revision_hash, tool: d.tool, documentType: d.document_type, reviewerId: d.reviewer_id, decision: d.decision, reason: d.reason, createdAt: iso(d.created_at) })),
    ...(fullFidelity ? {
      fullFidelity: true,
      credentials: credentials.map((c) => ({ userId: c.id, passwordHash: c.password_hash, emailVerifiedAt: iso(c.email_verified_at), totpSecretEnc: c.totp_secret_enc, totpEnabledAt: iso(c.totp_enabled_at), totpLastStep: Number(c.totp_last_step) })),
      recoveryCodes: recovery.map((r) => ({ userId: r.user_id, codeHmac: r.code_hmac, createdAt: iso(r.created_at), usedAt: iso(r.used_at) })),
    } : {}),
    approvals: approvals.map((a) => ({ id: a.id, projectId: a.project_id, revisionId: a.revision_id, revisionHash: a.revision_hash, tool: a.tool, documentType: a.document_type, reviewerId: a.reviewer_id, approval: parseJson(a.approval), createdAt: iso(a.created_at), revokedAt: iso(a.revoked_at) })),
    audit: audit.map((r) => ({ seq: Number(r.seq), at: iso(r.at), actorUserId: r.actor_user_id, orgId: r.org_id, action: r.action, objectType: r.object_type, objectId: r.object_id, detail: parseJson(r.detail), prevHash: r.prev_hash, recordHash: r.record_hash })),
  };
  return { ...body, exportSha256: sha256(canonicalJson(body)) };
}

/** Every hash in an export, checked. Returns the list of problems (empty = all verified). */
function verifyExport(exp) {
  const problems = [];
  const { exportSha256, ...body } = exp;
  if (sha256(canonicalJson(body)) !== exportSha256) problems.push('export file hash does not match (file altered)');
  for (const r of exp.revisions) if (sha256(canonicalJson(r.content)) !== r.contentSha256) problems.push(`revision ${r.id}: content hash mismatch`);
  for (const a of exp.attachments) {
    const bytes = Buffer.from(a.dataBase64, 'base64');
    if (bytes.length !== a.sizeBytes || sha256(bytes) !== a.sha256) problems.push(`attachment ${a.id}: hash or size mismatch`);
  }
  for (const r of exp.audit) if (auditHash(r) !== r.recordHash) problems.push(`audit ${r.seq}: record hash mismatch`);
  return problems;
}

/**
 * Restores an export into a database that has the migrations applied and does
 * not hold this organisation. Users missing from the target are created
 * DISABLED (password '!', email unverified): each must reset their password.
 * Reviewer profiles are restored as 'suspended' so no approval can be made
 * until a registry admin re-verifies them. Audit records go to
 * acct_audit_archive; an 'org.imported' record is appended to the live chain.
 */
async function importOrg(client, secret, exp, now = new Date()) {
  const problems = verifyExport(exp);
  if (problems.length) throw new Error(`Refused: ${problems.join('; ')}`);
  return inTx(client, async () => {
    const exists = (await client.query('SELECT 1 FROM acct_orgs WHERE id = $1', [exp.org.id])).rows[0];
    if (exists) throw new Error('This organisation already exists in the target database');
    // Full fidelity (same environment and secret): sign-in and the second factor are preserved.
    // Otherwise users come back DISABLED and reset their password.
    const cred = new Map((exp.fullFidelity ? exp.credentials : []).map((c) => [c.userId, c]));
    for (const m of exp.members) {
      const c = cred.get(m.userId);
      if (c) {
        await client.query(
          'INSERT INTO acct_users (id, email, password_hash, display_name, email_verified_at, totp_secret_enc, totp_enabled_at, totp_last_step) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
          [m.userId, m.email, c.passwordHash, m.displayName ?? '', c.emailVerifiedAt, c.totpSecretEnc, c.totpEnabledAt, c.totpLastStep],
        );
      } else {
        await client.query("INSERT INTO acct_users (id, email, password_hash, display_name) VALUES ($1, $2, '!', $3) ON CONFLICT DO NOTHING", [m.userId, m.email, m.displayName ?? '']);
      }
    }
    for (const r of (exp.fullFidelity ? exp.recoveryCodes : [])) {
      await client.query('INSERT INTO acct_recovery_codes (user_id, code_hmac, created_at, used_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [r.userId, r.codeHmac, r.createdAt, r.usedAt]);
    }
    await client.query('INSERT INTO acct_orgs (id, name, created_by, created_at) VALUES ($1, $2, $3, $4)', [exp.org.id, exp.org.name, exp.org.createdBy, exp.org.createdAt]);
    for (const m of exp.members) await client.query('INSERT INTO acct_memberships (org_id, user_id, role, created_at) VALUES ($1, $2, $3, $4)', [exp.org.id, m.userId, m.role, m.createdAt]);
    for (const p of exp.projects) {
      await client.query(
        'INSERT INTO acct_projects (id, org_id, tool, name, source, current_version, current_revision_id, created_by, created_at, updated_at, deleted_at, deleted_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [p.id, exp.org.id, p.tool, p.name, p.source, p.currentVersion, p.currentRevisionId, p.createdBy, p.createdAt, p.updatedAt, p.deletedAt, p.deletedBy],
      );
    }
    for (const r of exp.revisions) {
      await client.query(
        'INSERT INTO acct_revisions (id, org_id, project_id, version, parent_revision_id, content, content_sha256, restored_from, note, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)',
        [r.id, exp.org.id, r.projectId, r.version, r.parentRevisionId, JSON.stringify(r.content), r.contentSha256, r.restoredFrom, r.note, r.createdBy, r.createdAt],
      );
    }
    for (const a of exp.attachments) {
      await client.query(
        "INSERT INTO acct_attachments (id, org_id, project_id, filename, media_type, size_bytes, sha256, status, data, created_by, created_at, deleted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 'complete', $8, $9, $10, $11)",
        [a.id, exp.org.id, a.projectId, a.filename, a.mediaType, a.sizeBytes, a.sha256, new Uint8Array(Buffer.from(a.dataBase64, 'base64')), a.createdBy, a.createdAt, a.deletedAt],
      );
    }
    for (const r of exp.reviewers) {
      await client.query(
        "INSERT INTO acct_reviewers (id, org_id, user_id, legal_name, identity_check_status, professional_body, registration_number, scope, valid_from, valid_until, evidence_ref, state, verified_by, verified_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, 'suspended', $12, $13, $14)",
        [r.id, exp.org.id, r.userId, r.legalName, r.identityCheckStatus, r.professionalBody, r.registrationNumber, JSON.stringify(r.scope), r.validFrom, r.validUntil, r.evidenceRef, null, null, r.createdAt],
      );
    }
    for (const a of exp.approvals) {
      await client.query(
        'INSERT INTO acct_approvals (id, org_id, project_id, revision_id, revision_hash, tool, document_type, reviewer_id, approval, created_at, revoked_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11)',
        [a.id, exp.org.id, a.projectId, a.revisionId, a.revisionHash, a.tool, a.documentType, a.reviewerId, JSON.stringify(a.approval), a.createdAt, a.revokedAt],
      );
    }
    for (const d of (exp.reviewDecisions || [])) {
      await client.query(
        'INSERT INTO acct_review_decisions (id, org_id, project_id, revision_id, revision_hash, tool, document_type, reviewer_id, decision, reason, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [d.id, exp.org.id, d.projectId, d.revisionId, d.revisionHash, d.tool, d.documentType, d.reviewerId, d.decision, d.reason, d.createdAt],
      );
    }
    for (const r of exp.audit) await client.query('INSERT INTO acct_audit_archive (org_id, seq, record) VALUES ($1, $2, $3::jsonb)', [exp.org.id, r.seq, JSON.stringify(r)]);
    await appendAudit(client, secret, { actorUserId: null, orgId: exp.org.id, action: 'org.imported', objectType: 'org', objectId: exp.org.id, detail: { exportSha256: exp.exportSha256, fullFidelity: exp.fullFidelity === true } }, now);
    return { projects: exp.projects.length, revisions: exp.revisions.length, attachments: exp.attachments.length };
  });
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
  checkSchema,
  MIGRATIONS_DIR, canonicalJson, sha256, migrationFiles, applyMigrations, auditHash, appendAudit, purgeDeletedProjects,
  exportOrg, verifyExport, importOrg, args, connectAccountsDb,
};
