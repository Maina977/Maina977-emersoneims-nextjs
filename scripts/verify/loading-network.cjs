/**
 * LOADING UNDER BAD NETWORKS (management priority 1, 2026-11-21).
 *
 * For each engineering module and each network state it records whether the
 * module loads or shows the recovery UI ("Still downloading … Reload page" /
 * "Try again"), and whether values typed into the form survive a reload.
 *
 * States (Chrome DevTools Protocol network emulation):
 *   normal   no emulation
 *   slow     Fast-3G-like: 562.5 ms latency, ~1.44 Mbit/s down, ~675 kbit/s up
 *   offline  connection dropped for 4 s while the module downloads, then restored
 *   stalled  one on-demand JS chunk is never answered (route never fulfilled)
 *
 * FOR A PROTECTED PREVIEW OR A LOCAL BUILD ONLY. It refuses production hosts.
 *   VERIFY_BASE=https://<preview>.vercel.app VERCEL_TRUSTED_OIDC_TOKEN=<token> node scripts/verify/loading-network.cjs
 *   VERIFY_BASE=http://localhost:3111 node scripts/verify/loading-network.cjs
 * Optional: ONLY=roi,quote  STATES=normal,stalled  HEADED=1
 * The token (Vercel Trusted Sources, see the preview-access notes) is sent only
 * to the preview's own origin; every third-party host is blocked, so it cannot
 * leak and no analytics are triggered. Runs one page at a time (no bursts).
 * Output: out/loading-network/results.json and a table on stdout.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = (process.env.VERIFY_BASE || '').replace(/\/$/, '');
const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE);
// A deployment URL (<project>-<hash|git-branch>-<team>.vercel.app), not a short production alias.
const preview = /^https:\/\/[a-z0-9]+(-[a-z0-9]+){2,}\.vercel\.app$/.test(BASE);
if (!local && !preview) {
  console.error('Set VERIFY_BASE to a local build (http://localhost:PORT) or a *.vercel.app preview. Production is refused.');
  process.exit(2);
}
const PROD = /emersoneims\.com/i;
if (PROD.test(BASE)) { console.error('Refusing to run against production.'); process.exit(2); }
const TOKEN = process.env.VERCEL_TRUSTED_OIDC_TOKEN || '';
if (preview && !TOKEN) { console.error('A protected preview needs VERCEL_TRUSTED_OIDC_TOKEN.'); process.exit(2); }
const ORIGIN = new URL(BASE).origin;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 EIMS-loading-verify';

// Recovery offered with a "Reload page" button: the loaders' slow note, or the
// error pages' failed-download message (app/error.tsx, app/global-error.tsx).
const SLOW_NOTE = /the connection is slow or a download stalled|The connection dropped while part of this page was downloading/;
const FAILED = /did not download/;
const SLOW_NOTE_AFTER_MS = 12_000;

/**
 * ready: the module is on screen. input: a field to type into and read back
 * (null when the module has no typed input to preserve, or it is not shown).
 */
const TARGETS = [
  { key: 'roi', name: '/solar Savings Calculator (ROI)', path: '/solar#solar-tool-roi', ready: '#roi-bill', input: { selector: '#roi-bill', value: '23456' } },
  { key: 'quote', name: 'Quote Checker', path: '/solar-genius-pro#/quote-check', ready: 'text=Solar quotation check', input: { selector: 'textarea[aria-label="Quotation lines, one item per line"]', value: 'Inverter 5kW x 1 @ 150000', optional: true } },
  // The PDF button sits on the Reports tab (needs a click); the tab itself shows when Pro Tools has loaded.
  { key: 'pro', name: 'Pro Tools reports', path: '/solar-genius-pro#/pro', ready: 'text="Reports"', input: null },
  { key: 'proposal', name: 'Solar proposal (autosaved draft)', path: '/solar-genius-pro#/proposal', ready: 'text=Proposal reference', input: { selector: 'input[aria-label="Proposal reference"], label:has-text("Proposal reference") input', value: 'NETTEST-1', optional: true } },
  { key: 'sgp-calc', name: 'Solar System Calculator', path: '/solar-genius-pro/calculator-advanced', notText: 'Preparing full workspace', input: null },
  { key: 'oracle', name: 'Generator Oracle', path: '/generator-oracle', notText: 'Initializing Diagnostic System', input: null },
  { key: 'aquascan', name: 'AquaScan Pro v3', path: '/aquascan-pro-v3', notText: 'Preparing full workspace', input: null },
  { key: 'takeoff', name: 'Building take-off workbench', path: '/solutions/building/takeoff', notText: 'Loading the take-off workbench', input: null },
  { key: 'building', name: 'Building Suite Pro (iframe)', path: '/solutions/building', ready: 'iframe[title="EMERSON EIMS Building Suite Pro"]', input: null },
];

const FAST_3G = { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 / 8) * 0.9, uploadThroughput: (750 * 1024 / 8) * 0.9 };
const NORMAL = { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 };
const OFFLINE = { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 };
const CHUNK = /\/_next\/static\/chunks\/.+\.js(\?|$)/;

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const states = (process.env.STATES || 'normal,slow,offline,stalled').split(',').filter(Boolean);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newPage(browser) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1366, height: 900 } });
  // Same-origin requests get the token; everything else is blocked.
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (!u.startsWith(ORIGIN)) return route.abort('blockedbyclient');
    if (!TOKEN) return route.continue();
    return route.continue({ headers: { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': TOKEN } });
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  return { ctx, page, cdp };
}

/** 'loaded' | 'slow-note' | 'try-again' | 'timeout', polled until `ms`. */
async function outcome(page, t, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const text = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    if (FAILED.test(text) && /Try again/.test(text)) return 'try-again';
    if (await isReady(page, t)) return 'loaded';
    if (SLOW_NOTE.test(text)) return 'slow-note';
    await sleep(500);
  }
  return 'timeout';
}

async function isReady(page, t) {
  if (t.ready) return (await page.locator(t.ready).first().count().catch(() => 0)) > 0;
  const text = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
  return text.length > 200 && !text.includes(t.notText) && !SLOW_NOTE.test(text) && !FAILED.test(text);
}

async function typeInput(page, t) {
  if (!t.input) return 'n/a';
  const loc = page.locator(t.input.selector).first();
  if (!(await loc.count())) return t.input.optional ? 'n/a (field not shown)' : 'field missing';
  await loc.fill(t.input.value);
  await sleep(800); // past every autosave delay (400-600 ms)
  return 'typed';
}

async function readInput(page, t) {
  const loc = page.locator(t.input.selector).first();
  if (!(await loc.count())) return null;
  return loc.inputValue();
}

/** Loads the module under `state`; returns what the visitor saw. */
async function loadUnder(page, cdp, t, state) {
  let stalled = null;
  if (state === 'slow') await cdp.send('Network.emulateNetworkConditions', FAST_3G);
  if (state === 'stalled') {
    // Stall the first on-demand chunk requested after the HTML arrived.
    let armed = false;
    page.once('domcontentloaded', () => { armed = true; });
    await page.route(CHUNK, (route) => {
      if (armed && !stalled) { stalled = route.request().url(); return; } // never fulfilled
      return route.fallback();
    });
  }
  if (state === 'offline') {
    page.once('domcontentloaded', async () => {
      await cdp.send('Network.emulateNetworkConditions', OFFLINE).catch(() => {});
      await sleep(4000);
      await cdp.send('Network.emulateNetworkConditions', NORMAL).catch(() => {});
    });
  }
  const started = Date.now();
  await page.goto(BASE + t.path, { waitUntil: 'domcontentloaded', timeout: 180000 }).catch(() => {});
  const budget = state === 'slow' ? 120000 : state === 'stalled' ? SLOW_NOTE_AFTER_MS + 8000 : 60000;
  let seen = await outcome(page, t, budget);
  // A stalled chunk may not belong to this module: if it loaded, say so.
  const r = { seen, ms: Date.now() - started, stalled: stalled ? path.basename(new URL(stalled).pathname) : null };
  if (seen === 'try-again') {
    await page.getByRole('button', { name: 'Try again' }).click();
    r.afterTryAgain = await outcome(page, t, 60000);
  }
  return r;
}

async function run(browser, t, state) {
  const { ctx, page, cdp } = await newPage(browser);
  const res = { module: t.key, name: t.name, state };
  try {
    // 1. Type into the module on a normal load, so the reload has something to keep.
    if (t.input) {
      await page.goto(BASE + t.path, { waitUntil: 'domcontentloaded', timeout: 180000 });
      res.firstLoad = await outcome(page, t, 90000);
      res.typed = res.firstLoad === 'loaded' ? await typeInput(page, t) : 'not loaded';
    }
    // 2. Load again under the network state (this is the reload the visitor makes).
    Object.assign(res, await loadUnder(page, cdp, t, state));
    // 3. Recover: lift the fault and press the page's own Reload, if it showed one.
    await page.unroute(CHUNK).catch(() => {});
    await cdp.send('Network.emulateNetworkConditions', NORMAL).catch(() => {});
    if (res.seen === 'slow-note') {
      await page.getByRole('button', { name: 'Reload page' }).click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      res.afterReload = await outcome(page, t, 90000);
    }
    // 4. Did the typed value survive?
    if (res.typed === 'typed') {
      const loaded = [res.seen, res.afterReload, res.afterTryAgain].includes('loaded');
      if (!loaded) { await page.reload({ waitUntil: 'domcontentloaded' }); await outcome(page, t, 90000); }
      const v = await readInput(page, t);
      res.inputSurvived = v === t.input.value;
      res.inputValue = v;
    } else res.inputSurvived = res.typed || 'n/a';
  } catch (e) {
    res.error = String(e).slice(0, 200);
  } finally {
    await ctx.close();
  }
  // Pass: loaded, or showed the recovery UI and then loaded after it; typed input kept.
  const finalSeen = res.afterReload || res.afterTryAgain || res.seen;
  res.recovered = finalSeen === 'loaded';
  res.pass = !res.error && res.recovered && res.inputSurvived !== false
    && (state !== 'stalled' || res.seen !== 'timeout');
  return res;
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: !process.env.HEADED });
  const results = [];
  for (const t of TARGETS) {
    if (only.length && !only.includes(t.key)) continue;
    for (const s of states) {
      const r = await run(browser, t, s);
      results.push(r);
      console.log(`${r.pass ? 'PASS' : 'FAIL'} ${t.key.padEnd(9)} ${s.padEnd(8)} seen=${r.seen}${r.afterReload ? ` afterReload=${r.afterReload}` : ''}${r.afterTryAgain ? ` afterTryAgain=${r.afterTryAgain}` : ''} input=${r.inputSurvived}${r.stalled ? ` stalled=${r.stalled}` : ''}${r.error ? ` error=${r.error}` : ''}`);
      await sleep(2000); // pace requests; never burst a preview
    }
  }
  await browser.close();
  const dir = path.join(process.cwd(), 'out', 'loading-network');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
  const failed = results.filter((r) => !r.pass).length;
  console.log(`${results.length - failed}/${results.length} passed; details in out/loading-network/results.json`);
  process.exit(failed ? 1 : 0);
})();
