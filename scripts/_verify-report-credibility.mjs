// Live verification for the 2026-07-10 report-reconciliation release
// (hydrogeologist review: one governing figure per quantity; sub-models
// demoted to labelled diagnostics; no over-claims).
import { chromium } from 'playwright-core';
process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
const exe = 'C:/Users/ADMIN/AppData/Local/ms-playwright/chromium-1200/chrome-win64/chrome.exe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const URL_ = 'https://www.emersoneims.com/aquascan-pro-v3';

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, userAgent: UA });

const jsChunks = new Set();
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('/_next/static/chunks/') && /\.js(\?|$)/.test(u)) jsChunks.add(u);
});

const resp = await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60000 });
const html = await resp.text();
const dpl = (html.match(/dpl_[A-Za-z0-9]+/) || ['?'])[0];
await page.waitForTimeout(22000);

const wanted = {
  'Proposed-position ribbon (no drill order)': 'PROPOSED POSITION -- CONFIRM BY ERT',
  'Softened cover banner':                     'DESKTOP PRE-FEASIBILITY ASSESSMENT -- FIELD VALIDATION PENDING',
  'Sub-model diagnostic banners':              'INTERNAL SUB-MODEL DIAGNOSTIC',
  'Modelled-exceedance WQ wording':            'MODELLED EXCEEDANCE RISK',
  'Hypothetical geophysics label':             'HYPOTHETICAL SENSITIVITY MODEL',
  'Kenya ERT market cost in client brief':     'KSh 40,000-110,000',
  'Relative spatial screening note':           'RELATIVE SPATIAL SCREENING',
  'One-economics pointer':                     'one economics model governs the whole report',
};
const stale = {
  'OLD: DRILL AT THIS POINT':          'DRILL AT THIS POINT',
  'OLD: DRILL AT THE CROSSHAIR':       'DRILL AT THE CROSSHAIR',
  'OLD: No further surveys needed':    'No further surveys needed',
  'OLD: NOT POTABLE UNTIL TREATED':    'NOT POTABLE UNTIL TREATED',
  'OLD: NO FIELD DATA COLLECTED':      'NO FIELD DATA COLLECTED',
  'OLD: TARGET MET banner':            'TARGET MET',
  'OLD: skip-survey client promise':   'WITHOUT a traditional site survey',
};

const found = Object.fromEntries(Object.keys(wanted).map(k => [k, false]));
const staleFound = Object.fromEntries(Object.keys(stale).map(k => [k, false]));
let scanned = 0;
for (const u of jsChunks) {
  try {
    const t = await (await fetch(u, { headers: { 'User-Agent': UA } })).text();
    scanned++;
    for (const [k, s] of Object.entries(wanted)) if (t.includes(s)) found[k] = true;
    for (const [k, s] of Object.entries(stale)) if (t.includes(s)) staleFound[k] = true;
  } catch { /* skip */ }
}

console.log('Deployment          :', dpl);
console.log('Chunks scanned      :', scanned);
let ok = true;
for (const [k, v] of Object.entries(found)) {
  console.log(`${v ? 'YES ✓' : 'NO  ✗'}  ${k}`);
  if (!v) ok = false;
}
for (const [k, v] of Object.entries(staleFound)) {
  console.log(`${v ? 'STILL PRESENT ✗' : 'gone ✓'}  ${k}`);
  if (v) ok = false;
}
await browser.close();
process.exit(ok ? 0 : 1);
