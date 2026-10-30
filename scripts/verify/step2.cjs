/**
 * Step-2 verification against a LOCAL production build (never the live site).
 *   npm run build && npx next start -p 3111   then   node scripts/verify/step2.cjs
 * Checks every tool page at desktop and phone width for page errors, failed
 * requests, horizontal overflow and banned claims; runs functional checks on
 * the fixed tools; probes the APIs. Exit code 1 on any failure.
 */
const { chromium } = require('playwright');

const BASE = process.env.VERIFY_BASE || 'http://localhost:3111';
if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE)) { console.error('Refusing to run against a non-local host'); process.exit(2); }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// Claims removed in audit rounds 3-5; none may reappear on any page.
const BANNED = [
  /ironclad/i, /Real prices\. No hidden fees/i, /Flexible Financing/i, /halving fuel/i,
  /ECP-1/, /This quotation is valid/i, /Performance guarantee/i, /\b0 Years\b/,
  /10% off/i, /Proposal & Quotation Generator/i, /exchangerate\.host/i,
  /Persisted to data\/business\.json/i, /13 of 19 features/i,
  /credited at ~?65 ?% of retail per EPRA/i, /NaN|undefined kWh|Infinity%/,
];

const PAGES = [
  '/', '/solar', '/solar-design-studio', '/solar-genius-pro', '/solar-genius-pro#/calculator',
  '/solar-genius-pro#/report', '/solar-genius-pro#/pro', '/solar-genius-pro#/sun-weather',
  '/solar-genius-pro#/quote-check', '/solar-genius-pro#/advanced', '/generator-oracle', '/faults',
  '/aquascan-pro-v3', '/aquascan-pro-v3/methodology', '/innovations',
  '/eims-building-suite-v20261030.html', '/eims-pro-console.html',
];

const failures = [];
const fail = (where, msg) => { failures.push(`${where}: ${msg}`); console.log(`  FAIL ${where}: ${msg}`); };
const pass = (where, msg) => console.log(`  ok   ${where}: ${msg}`);

async function visit(browser, path, width) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror ' + String(e).slice(0, 160)));
  page.on('response', (r) => {
    const u = r.url();
    if (r.status() >= 500 && u.startsWith(BASE)) errs.push(`HTTP ${r.status()} ${u.slice(BASE.length, BASE.length + 80)}`);
    if (r.status() === 404 && u.startsWith(BASE + '/_next/')) errs.push(`HTTP 404 ${u.slice(BASE.length, BASE.length + 80)}`);
  });
  const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(path.includes('#') || path.includes('aquascan') || path.includes('studio') ? 6000 : 2500);
  const where = `${path} @${width}`;
  if (!res || res.status() >= 400) fail(where, `status ${res && res.status()}`);
  const text = await page.evaluate(() => document.body ? document.body.innerText : '');
  for (const re of BANNED) if (re.test(text)) fail(where, `banned text ${re}: "${(text.match(re) || [''])[0]}"`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) fail(where, `horizontal overflow ${overflow}px`);
  for (const e of errs) fail(where, e);
  if (!errs.length && overflow <= 2) pass(where, `loaded (${text.length} chars)`);
  return { ctx, page, text };
}

async function functional(browser) {
  console.log('\n== Functional checks');
  // /solar package cards and ROI calculator
  {
    const { ctx, page, text } = await visit(browser, '/solar', 1366);
    /3\.3 kWp/.test(text) ? pass('/solar', 'first package shows 3.3 kWp (6 × 550 W)') : fail('/solar', 'package size does not match panels');
    // FAQ answers render only when opened; the ROI tool sits on its own tab.
    await page.getByRole('button', { name: /How long is the payback period/ }).first().click();
    await page.waitForTimeout(500);
    const faq = await page.evaluate(() => document.body.innerText);
    const m = faq.match(/pay back in about (\d+)-(\d+) years/);
    m && Number(m[1]) >= 1 && Number(m[2]) <= 15 && Number(m[1]) < Number(m[2])
      ? pass('/solar', `FAQ payback ${m[1]}-${m[2]} years from the package model`) : fail('/solar', 'FAQ payback text missing or implausible');
    await page.getByRole('button', { name: /Savings Calculator/ }).first().click();
    await page.waitForTimeout(3000);
    const bill = page.locator('#roi-bill');
    if (await bill.count()) {
      await bill.scrollIntoViewIfNeeded();
      await bill.fill('0'); await page.waitForTimeout(400);
      const t0 = await page.evaluate(() => document.body.innerText);
      /Enter your bill/.test(t0) ? pass('/solar ROI', 'bill 0 → coverage asks for a bill') : fail('/solar ROI', 'bill 0 shows a coverage figure');
      /Not within 25 years/.test(t0) ? pass('/solar ROI', 'bill 0 → payback "Not within 25 years"') : fail('/solar ROI', 'bill 0 payback wording');
      await bill.fill('15000'); await page.waitForTimeout(400);
      const read = async () => page.evaluate(() => {
        const m = document.body.innerText.match(/KES ([\d,]+)\s*Monthly Savings/); return m ? Number(m[1].replace(/,/g, '')) : null;
      });
      const range = page.locator('#roi-battery');
      await range.fill('5'); await page.waitForTimeout(300); const s5 = await read();
      await range.fill('30'); await page.waitForTimeout(300); const s30 = await read();
      s5 != null && s30 != null && s30 > s5 ? pass('/solar ROI', `bigger battery saves more (5 kWh ${s5} < 30 kWh ${s30})`) : fail('/solar ROI', `battery size has no effect (${s5} vs ${s30})`);
    } else fail('/solar ROI', '#roi-bill not found');
    await ctx.close();
  }
  // Sun & Weather UTC note
  {
    const { ctx, text } = await visit(browser, '/solar-genius-pro#/sun-weather', 1366);
    /Hours are in UTC/.test(text) ? pass('sun-weather', 'UTC label present') : fail('sun-weather', 'UTC label missing');
    // "Now" card: a real temperature, or a visible weather error — never silent dashes.
    // The label is CSS-uppercased, and innerText reports it that way.
    /Air temperature\s*-?\d+(\.\d+)?°C/i.test(text) ? pass('sun-weather', `current temperature shown (${(text.match(/Air temperature\s*(-?\d+(\.\d+)?°C)/i) || [])[1]})`)
      : /weather:/.test(text) ? pass('sun-weather', 'weather provider down, error shown to the user')
      : fail('sun-weather', 'Now card shows no temperature and no error');
    await ctx.close();
  }
  // Design studio electrical tab: MPPT check and string plan
  {
    const { ctx, page } = await visit(browser, '/solar-design-studio', 1366);
    const tab = page.getByRole('button', { name: /electrical/i }).first();
    if (await tab.count()) {
      await tab.click(); await page.waitForTimeout(600);
      const t = await page.evaluate(() => document.body.innerText);
      /Typical window only/.test(t) ? pass('studio', 'MPPT window check shown') : fail('studio', 'MPPT window check missing');
      /MPPT minimum|Inside the typical/.test(t) ? pass('studio', 'MPPT verdict shown') : fail('studio', 'MPPT verdict missing');
    } else fail('studio', 'Electrical tab not found');
    await ctx.close();
  }
}

async function api() {
  console.log('\n== API probes');
  const post = (p, body) => fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': UA }, body: JSON.stringify(body) });
  const expectStatus = async (label, resP, want) => {
    const r = await resP; const ok = r.status === want;
    ok ? pass(label, `HTTP ${r.status}`) : fail(label, `HTTP ${r.status}, wanted ${want}: ${(await r.text()).slice(0, 120)}`);
    return r;
  };
  await expectStatus('reports/proposal {}', post('/api/reports/proposal', {}), 400);
  const pdf = await expectStatus('reports/proposal sized', post('/api/reports/proposal', { customer: { name: 'Verify' }, design: { systemKw: 5 }, financial: { capexKes: 900000 } }), 200);
  if (pdf.status === 200) {
    const buf = Buffer.from(await pdf.arrayBuffer()).toString('latin1');
    buf.startsWith('%PDF') && buf.includes('not a quotation') && !buf.includes('Valid until')
      ? pass('proposal pdf', 'indicative, no validity date') : fail('proposal pdf', 'content check failed');
  }
  await expectStatus('eng/battery-sizing {}', post('/api/eng/battery-sizing', {}), 400);
  await expectStatus('solar/losses bad key', post('/api/solar/losses', { soilingPct: 'abc' }), 400);
  await expectStatus('solar/losses ok', post('/api/solar/losses', { soiling: 3 }), 200);
  await expectStatus('solar/auto-design {}', post('/api/solar/auto-design', {}), 400);
  await expectStatus('finance/npv []', post('/api/finance/npv', { cashFlows: [] }), 400);
  const chat = await expectStatus('ai/chat SPN 110 FMI 0', post('/api/ai/chat', { message: 'SPN 110 FMI 0' }), 200);
  if (chat.status === 200) {
    const j = await chat.json();
    /110/.test(JSON.stringify(j)) && !/confidence/i.test(JSON.stringify(j)) ? pass('ai/chat', 'code resolved, no confidence figure') : fail('ai/chat', JSON.stringify(j).slice(0, 160));
  }
  await expectStatus('ai/chat empty', post('/api/ai/chat', { message: '' }), 400);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  console.log('== Pages (desktop 1366 and phone 375)');
  for (const p of PAGES) {
    for (const w of [1366, 375]) {
      try { const { ctx } = await visit(browser, p, w); await ctx.close(); }
      catch (e) { fail(`${p} @${w}`, 'navigation error ' + String(e).slice(0, 120)); }
    }
  }
  try { await functional(browser); } catch (e) { fail('functional', String(e).slice(0, 200)); }
  await browser.close();
  try { await api(); } catch (e) { fail('api', String(e).slice(0, 200)); }
  console.log(`\n${failures.length ? 'FAILED: ' + failures.length + ' problem(s)' : 'ALL STEP-2 CHECKS PASSED'}`);
  process.exit(failures.length ? 1 : 0);
})();
