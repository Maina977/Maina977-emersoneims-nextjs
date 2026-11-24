#!/usr/bin/env node
/**
 * Logical backup of ONE organisation as JSON (see docs/accounts/backup-and-recovery.md).
 * Contains personal data and customer project records: store it encrypted,
 * with the same access controls as the database, and delete it by the
 * retention schedule.
 *
 *   ACCOUNTS_DATABASE_URL=postgres://... node scripts/db/export-org.cjs --org=<uuid> --out=org.json --yes [--full-fidelity]
 *   --full-fidelity also exports password hashes, encrypted second-factor seeds and recovery-code
 *   HMACs, so a restore into the SAME environment (same ACCOUNTS_SECRET_KEY) preserves sign-in and MFA.
 */
'use strict';
const fs = require('node:fs');
const lib = require('./accounts-lib.cjs');

(async () => {
  const a = lib.args(process.argv.slice(2));
  if (typeof a.org !== 'string' || typeof a.out !== 'string') throw new Error('Usage: --org=<uuid> --out=<file.json> --yes');
  const client = await lib.connectAccountsDb({ yes: a.yes === true });
  try {
    const exp = await lib.exportOrg(client, a.org, { fullFidelity: a['full-fidelity'] === true });
    fs.writeFileSync(a.out, JSON.stringify(exp), { mode: 0o600 });
    console.log(`Exported ${exp.projects.length} projects, ${exp.revisions.length} revisions, ${exp.attachments.length} attachments. exportSha256=${exp.exportSha256}`);
  } finally {
    await client.end();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
