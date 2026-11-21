#!/usr/bin/env node
/**
 * Restores one organisation from an export-org.cjs file, after verifying every
 * hash (file, revisions, attachments, audit records). Refuses an altered file
 * or an organisation that already exists. Users come back DISABLED (password
 * reset needed); reviewers come back SUSPENDED (re-verification needed).
 *
 *   ACCOUNTS_DATABASE_URL=postgres://... ACCOUNTS_SECRET_KEY=... node scripts/db/import-org.cjs --in=org.json --yes
 */
'use strict';
const fs = require('node:fs');
const lib = require('./accounts-lib.cjs');

(async () => {
  const a = lib.args(process.argv.slice(2));
  if (typeof a.in !== 'string') throw new Error('Usage: --in=<file.json> --yes');
  const secret = process.env.ACCOUNTS_SECRET_KEY || '';
  if (secret.length < 32) throw new Error('ACCOUNTS_SECRET_KEY (32+ characters) is required to extend the audit chain');
  const exp = JSON.parse(fs.readFileSync(a.in, 'utf8'));
  const client = await lib.connectAccountsDb({ yes: a.yes === true });
  try {
    const r = await lib.importOrg(client, secret, exp);
    console.log(`Imported and verified: ${r.projects} projects, ${r.revisions} revisions, ${r.attachments} attachments.`);
  } finally {
    await client.end();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
