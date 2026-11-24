#!/usr/bin/env node
/**
 * READ-ONLY schema check of an accounts database (Report B live-database
 * validation, item 3: confirm the schema before accounts are switched on).
 * Prints only migration names, table and trigger presence, and OK / MISSING:
 * no data, no values. Run it on the preview database AND on the separate
 * disaster-recovery test database after scripts/db/migrate.cjs.
 *
 *   ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/check-schema.cjs --yes
 *
 * Exit code 0 = every expected migration, table and trigger is present.
 */
'use strict';
const lib = require('./accounts-lib.cjs');

(async () => {
  const a = lib.args(process.argv.slice(2));
  const client = await lib.connectAccountsDb({ yes: a.yes === true });
  try {
    const r = await lib.checkSchema(client);
    for (const l of r.lines) console.log(l);
    console.log(r.ok ? 'SCHEMA OK' : 'SCHEMA INCOMPLETE: run scripts/db/migrate.cjs --yes on this database');
    process.exitCode = r.ok ? 0 : 1;
  } finally {
    await client.end();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
