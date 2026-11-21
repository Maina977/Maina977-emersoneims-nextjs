#!/usr/bin/env node
/**
 * Documented admin job: hard-deletes projects that were soft-deleted more than
 * 30 days ago (their revisions, attachments and approvals go with them). The
 * audit log keeps a 'project.purged' record. Never scheduled automatically:
 * an administrator runs it (docs/accounts/data-handling-procedures.md).
 *
 *   ACCOUNTS_DATABASE_URL=postgres://... ACCOUNTS_SECRET_KEY=... node scripts/db/purge-deleted.cjs --yes [--days=30]
 */
'use strict';
const lib = require('./accounts-lib.cjs');

(async () => {
  const a = lib.args(process.argv.slice(2));
  const days = a.days === undefined ? 30 : Number(a.days);
  if (!Number.isInteger(days) || days < 30) throw new Error('--days must be a whole number of at least 30 (the restore window)');
  const secret = process.env.ACCOUNTS_SECRET_KEY || '';
  if (secret.length < 32) throw new Error('ACCOUNTS_SECRET_KEY (32+ characters) is required to extend the audit chain');
  const client = await lib.connectAccountsDb({ yes: a.yes === true });
  try {
    const ids = await lib.purgeDeletedProjects(client, secret, new Date(), days);
    console.log(`Purged ${ids.length} project(s).`);
  } finally {
    await client.end();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
