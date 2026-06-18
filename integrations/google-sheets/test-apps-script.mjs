// Self-test for a deployed Google Apps Script web app (analytics + leads sink).
// Verify the Apps Script works BEFORE wiring it to the website.
//
// Usage:
//   SHEET_WEBAPP_URL=… SHEET_TOKEN=… node integrations/google-sheets/test-apps-script.mjs
//
// Node built-ins only (global fetch, AbortSignal.timeout). No dependencies.
//
// NOTE: steps 1-2 WRITE 2 test rows to your Sheet — a "/__selftest" pageview
// event row and a "SELFTEST" lead row. You can safely delete both afterward.

const URL = process.env.SHEET_WEBAPP_URL;
const TOKEN = process.env.SHEET_TOKEN;

if (!URL || !TOKEN) {
  console.error('Missing env vars.\n');
  console.error('Usage:');
  console.error('  SHEET_WEBAPP_URL=… SHEET_TOKEN=… node integrations/google-sheets/test-apps-script.mjs');
  process.exit(1);
}

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass });
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function postJson(body) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, json, text };
}

async function getJson(qs) {
  const res = await fetch(`${URL}?${qs}`, { signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, json, text };
}

async function step(name, fn) {
  try {
    await fn();
  } catch (err) {
    record(name, false, `threw: ${err.message}`);
  }
}

const now = Math.floor(Date.now() / 1000);
const today = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD

await step('Step 1: POST test EVENT', async () => {
  const { json } = await postJson({
    kind: 'event', token: TOKEN,
    event: {
      ts: now, day: today, site: 'www', host: 'test', path: '/__selftest',
      type: 'pageview', ref: '', label: '', visitor: 'selftesthash01',
      country: 'KE', region: 'Nairobi', city: 'Nairobi',
    },
  });
  record('Step 1: POST test EVENT', json?.ok === true, json ? JSON.stringify(json) : 'no JSON');
});

await step('Step 2: POST test LEAD', async () => {
  const { json } = await postJson({
    kind: 'lead', token: TOKEN,
    lead: {
      name: 'SELFTEST', email: 'selftest@example.com', phone: '', company: '',
      service: 'general', message: 'apps script self-test', source: 'selftest',
      location: '', country: 'KE', region: 'Nairobi', city: 'Nairobi',
      received_at: new Date().toISOString(),
    },
  });
  record('Step 2: POST test LEAD', json?.ok === true, json ? JSON.stringify(json) : 'no JSON');
});

await step('Step 3: GET stats', async () => {
  const { status, json } = await getJson(`action=stats&token=${encodeURIComponent(TOKEN)}&days=7`);
  const keys = ['totals', 'today', 'live_visitors', 'top_pages', 'top_countries', 'top_regions', 'top_cities'];
  const hasKeys = json && keys.every((k) => k in json);
  const views = json?.totals?.views ?? json?.totals?.pageviews ?? 0;
  record('Step 3: GET stats', status === 200 && hasKeys,
    hasKeys ? `totals=${JSON.stringify(json.totals)}; test event reflected=${views >= 1 ? 'yes' : 'no'}`
            : `status=${status}, missing keys`);
});

await step('Step 4: NEGATIVE auth (read with WRONGTOKEN)', async () => {
  const { json } = await getJson(`action=stats&token=WRONGTOKEN&days=7`);
  const leaked = json && typeof json.totals === 'object' && json.totals !== null;
  const gated = !leaked && (json?.error || json?.ok === false || !json?.totals);
  record('Step 4: NEGATIVE auth (read with WRONGTOKEN)', !!gated && !leaked,
    leaked ? 'LEAKED stats with wrong token!' : `gated (${json ? JSON.stringify(json) : 'non-JSON'})`);
});

await step('Step 5: NEGATIVE auth (write with WRONGTOKEN)', async () => {
  const { json } = await postJson({
    kind: 'event', token: 'WRONGTOKEN',
    event: {
      ts: now, day: today, site: 'www', host: 'test', path: '/__selftest-bad',
      type: 'pageview', ref: '', label: '', visitor: 'selftesthash01',
      country: 'KE', region: 'Nairobi', city: 'Nairobi',
    },
  });
  const accepted = json?.ok === true;
  record('Step 5: NEGATIVE auth (write with WRONGTOKEN)', !accepted,
    accepted ? 'ACCEPTED write with wrong token!' : `rejected (${json ? JSON.stringify(json) : 'non-JSON'})`);
});

const passed = results.filter((r) => r.pass).length;
const failed = results.length - passed;
console.log(`\nSummary: ${passed}/${results.length} passed, ${failed} failed.`);
process.exit(failed === 0 ? 0 : 1);
