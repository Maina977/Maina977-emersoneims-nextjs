#!/usr/bin/env node
/**
 * ERP PULL BRIDGE — runs on the office PC (where ERP PRO lives).
 *
 * Pulls new website leads from the cloud and pushes them into ERP PRO on
 * localhost:8088. NO TUNNEL NEEDED — the PC reaches OUT to the website and to
 * the local ERP, so it works whenever this PC is online.
 *
 * Setup (PowerShell on the office PC):
 *   $env:SITE_URL   = "https://www.emersoneims.com"
 *   $env:LEAD_TOKEN = "<the LEAD_DIAG_TOKEN you set in Vercel>"
 *   node scripts/erp-pull-leads.mjs            # one pass
 *   node scripts/erp-pull-leads.mjs --watch    # loop every 2 min
 *
 * To run automatically: add a Windows Task Scheduler task that runs the one-pass
 * command every few minutes, OR keep a terminal open with --watch.
 *
 * Requires the ERP running on localhost:8088 (it already is when ERP PRO is open).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = (process.env.SITE_URL || 'https://www.emersoneims.com').replace(/\/$/, '');
const LEAD_TOKEN = process.env.LEAD_TOKEN || '';
const ERP_URL = (process.env.ERP_BASE_URL || 'http://localhost:8088').replace(/\/$/, '');
const INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 120000); // 2 min
const WATCH = process.argv.includes('--watch');

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, '.erp-last-lead-id');

async function getLastId() {
  try { return Number((await readFile(STATE_FILE, 'utf8')).trim()) || 0; } catch { return 0; }
}
async function setLastId(id) {
  try { await writeFile(STATE_FILE, String(id), 'utf8'); } catch (e) { console.error('Could not save state:', e.message); }
}

async function pushToErp(lead) {
  const res = await fetch(`${ERP_URL}/api/public/quote-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      service: lead.service || 'general',
      message: lead.message || '',
      source: `website:${lead.source || 'contact'}`,
    }),
  });
  if (!res.ok) throw new Error(`ERP HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

async function runOnce() {
  if (!LEAD_TOKEN) {
    console.error('❌ LEAD_TOKEN not set. In PowerShell: $env:LEAD_TOKEN="<your token>"');
    process.exitCode = 1;
    return;
  }
  const lastId = await getLastId();
  const url = `${SITE_URL}/api/leads/export?token=${encodeURIComponent(LEAD_TOKEN)}&sinceId=${lastId}`;
  let data;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    data = await res.json();
    if (!data.ok) { console.error('❌ Export error:', data.error || res.status); return; }
  } catch (e) {
    console.error('❌ Could not reach the website:', e.message);
    return;
  }

  const leads = data.leads || [];
  if (!leads.length) { console.log(`✓ No new leads (since id ${lastId}).`); return; }

  let pushed = 0, maxId = lastId;
  for (const lead of leads) {
    try {
      const r = await pushToErp(lead);
      pushed++;
      maxId = Math.max(maxId, lead.id);
      console.log(`→ ERP ${r.ref || 'ok'}: #${lead.id} ${lead.name} (${lead.service})`);
    } catch (e) {
      console.error(`✗ Lead #${lead.id} failed to reach ERP: ${e.message} (will retry next run)`);
      break; // stop at first failure so we don't skip it; retry next pass
    }
  }
  if (maxId > lastId) await setLastId(maxId);
  console.log(`✓ Pushed ${pushed}/${leads.length} new lead(s) into ERP PRO.`);
}

console.log(`ERP pull bridge → site: ${SITE_URL} | erp: ${ERP_URL} | ${WATCH ? `watch every ${INTERVAL_MS / 1000}s` : 'single pass'}`);
await runOnce();
if (WATCH) setInterval(runOnce, INTERVAL_MS);
