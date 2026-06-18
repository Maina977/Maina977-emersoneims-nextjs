/**
 * verify-leads-analytics.mjs
 * ==========================
 * End-to-end proof that lead delivery and analytics are working in production.
 * Node built-ins only (global fetch, Node 18+). No npm install required.
 *
 * USAGE:
 *   LEAD_DIAG_TOKEN=… ANALYTICS_READ_TOKEN=… node scripts/verify-leads-analytics.mjs
 *
 *   Add VERIFY_SEND=1 to also fire ONE real test lead through the live pipeline:
 *   LEAD_DIAG_TOKEN=… ANALYTICS_READ_TOKEN=… VERIFY_SEND=1 node scripts/verify-leads-analytics.mjs
 *
 * ENV:
 *   VERIFY_SITE           site base URL (default https://www.emersoneims.com)
 *   LEAD_DIAG_TOKEN       required for lead-health checks (3 & 4); skipped if unset
 *   ANALYTICS_READ_TOKEN  required for analytics check (2); skipped if unset
 *   VERIFY_SEND=1         fire a real test lead (check 4)
 *
 * EXIT: 0 if every non-skipped check PASSed (WARN allowed); 1 if any FAILed.
 */

const SITE = process.env.VERIFY_SITE || 'https://www.emersoneims.com';
const LEAD_DIAG_TOKEN = process.env.LEAD_DIAG_TOKEN;
const ANALYTICS_READ_TOKEN = process.env.ANALYTICS_READ_TOKEN;
const SEND = process.env.VERIFY_SEND === '1';

let failures = 0;
const line = (icon, title, detail) => console.log(`${icon} ${title}${detail ? ' — ' + detail : ''}`);
const PASS = (t, d) => line('✅', t, d);
const WARN = (t, d) => line('⚠️ ', t, d);
const FAIL = (t, d) => { failures++; line('❌', t, d); };
const SKIP = (t, d) => line('⏭️ ', t, d);

/** Safe fetch: never throws. Returns { ok, status, json, text, err }. */
async function get(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'manual' });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { ok: res.ok, status: res.status, json, text, err: null };
  } catch (e) {
    return { ok: false, status: 0, json: null, text: '', err: e.message || String(e) };
  }
}

const isJson = (r) => r.json && typeof r.json === 'object';

console.log(`\n=== Lead + Analytics verification: ${SITE} ===\n`);

// ---- Check 1: contact route deployed (GET ?id=1 → 401 JSON) ----------------
{
  const r = await get(`${SITE}/api/contact?id=1`);
  if (r.err) FAIL('Contact route', `request failed: ${r.err}`);
  else if (r.status === 401 && isJson(r) && r.json.success === false)
    PASS('Contact route', `HTTP 401 JSON success:false (deployed & admin-gated)`);
  else if (isJson(r))
    FAIL('Contact route', `expected 401 success:false, got HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 120)}`);
  else
    FAIL('Contact route', `expected 401 JSON, got HTTP ${r.status} (non-JSON — likely not deployed)`);
}

// ---- Check 2: analytics stats ----------------------------------------------
if (!ANALYTICS_READ_TOKEN) {
  SKIP('Analytics stats', 'ANALYTICS_READ_TOKEN not set');
} else {
  const r = await get(`${SITE}/api/analytics/stats?token=${encodeURIComponent(ANALYTICS_READ_TOKEN)}&days=7`);
  if (r.err) FAIL('Analytics stats', `request failed: ${r.err}`);
  else if (r.status === 401) FAIL('Analytics stats', 'token mismatch (HTTP 401)');
  else if (!isJson(r)) FAIL('Analytics stats', `not deployed (HTTP ${r.status}, non-JSON/HTML)`);
  else if (r.status === 200) {
    const j = r.json;
    const baseKeys = ['totals', 'today', 'live_visitors', 'top_pages'];
    const geoKeys = ['top_countries', 'top_regions', 'top_cities'];
    const missing = [...baseKeys, ...geoKeys].filter((k) => !(k in j));
    const geoCounts = geoKeys.map((k) => `${k}=${Array.isArray(j[k]) ? j[k].length : 'n/a'}`).join(', ');
    const totals = j.totals ? JSON.stringify(j.totals) : '(none)';
    if (missing.length === 0)
      PASS('Analytics stats', `totals ${totals}; live=${j.live_visitors}; geo[${geoCounts}]`);
    else
      FAIL('Analytics stats', `HTTP 200 but missing keys: ${missing.join(', ')}`);
  } else {
    FAIL('Analytics stats', `unexpected HTTP ${r.status}`);
  }
}

// ---- Check 3: lead-delivery health -----------------------------------------
if (!LEAD_DIAG_TOKEN) {
  SKIP('Lead health', 'LEAD_DIAG_TOKEN not set');
} else {
  const r = await get(`${SITE}/api/contact/health?token=${encodeURIComponent(LEAD_DIAG_TOKEN)}`);
  if (r.err) FAIL('Lead health', `request failed: ${r.err}`);
  else if (r.status === 401) FAIL('Lead health', 'token mismatch (HTTP 401)');
  else if (r.status === 404 || !isJson(r)) FAIL('Lead health', `not deployed (HTTP ${r.status})`);
  else {
    const j = r.json;
    const safe = j.lead_is_safe === true;
    if (safe) PASS('Lead health', `lead_is_safe=true`);
    else WARN('Lead health', `lead_is_safe=false — ${j.summary || 'see actions'}`);
    const channels = j.channels || {};
    for (const [name, c] of Object.entries(channels))
      console.log(`     • ${name}: configured=${c.configured} ok=${c.ok} — ${c.detail}`);
    if (Array.isArray(j.actions) && j.actions.length)
      j.actions.forEach((a) => console.log(`     → action: ${a}`));
  }
}

// ---- Check 4: optional real end-to-end test lead ---------------------------
if (!SEND) {
  SKIP('End-to-end test lead', 'VERIFY_SEND not set to 1');
} else if (!LEAD_DIAG_TOKEN) {
  SKIP('End-to-end test lead', 'LEAD_DIAG_TOKEN not set');
} else {
  const r = await get(`${SITE}/api/contact/health?token=${encodeURIComponent(LEAD_DIAG_TOKEN)}&send=1`);
  if (r.err) FAIL('End-to-end test lead', `request failed: ${r.err}`);
  else if (!isJson(r)) FAIL('End-to-end test lead', `unexpected HTTP ${r.status} (non-JSON)`);
  else {
    const e2e = r.json.end_to_end_test || {};
    if (e2e.skipped) WARN('End-to-end test lead', `skipped: ${e2e.skipped} (retry in ${e2e.retry_after_seconds}s)`);
    else if (e2e.delivered) PASS('End-to-end test lead', `http=${e2e.http} delivered=${e2e.delivered} leadId=${e2e.leadId}`);
    else FAIL('End-to-end test lead', `http=${e2e.http} delivered=${e2e.delivered} ${e2e.error ? '(' + e2e.error + ')' : ''}`);
  }
}

// ---- Summary ----------------------------------------------------------------
console.log('');
if (failures === 0) {
  console.log('✅ SUMMARY: all non-skipped checks PASSED.');
  process.exit(0);
} else {
  console.log(`❌ SUMMARY: ${failures} check(s) FAILED.`);
  process.exit(1);
}
