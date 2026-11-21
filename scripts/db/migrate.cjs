#!/usr/bin/env node
/**
 * Applies the accounts migrations (lib/db/migrations/accounts-NNN-*.sql) to
 * the database in ACCOUNTS_DATABASE_URL. NEVER run on app start; never uses
 * DATABASE_URL. Additive only (CREATE ... IF NOT EXISTS); safe to re-run.
 *
 *   ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/migrate.cjs --yes
 *   node scripts/db/migrate.cjs --list        (prints the files; no connection)
 */
'use strict';
const lib = require('./accounts-lib.cjs');

(async () => {
  const a = lib.args(process.argv.slice(2));
  if (a.list) { console.log(lib.migrationFiles().join('\n')); return; }
  const client = await lib.connectAccountsDb({ yes: a.yes === true });
  try {
    const applied = await lib.applyMigrations(client);
    console.log(applied.length ? `Applied: ${applied.join(', ')}` : 'Up to date: nothing to apply.');
  } finally {
    await client.end();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
