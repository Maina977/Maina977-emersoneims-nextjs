// Live verification for the 2026-07-10 ACCURACY pass (commit a8dd37a):
// confirms the deployed engine bundle contains the 8 computation fixes.
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
  '1 evidence weighting (field-measured share)': '% field-measured',
  '2 hydro-climate reconciliation':              'Reconciled to',
  '3 water-balance physics fix (humid verdict)': 'atypical for this climate class',
  '4 monthly recharge flag fix (fallback rows)': 'Climate-based recharge model (computed fallback)',
  // console.log markers are stripped by removeConsole in production --
  // use functional strings / surviving code patterns from the same blocks.
  '5 elevation unification (assignment)':        '.elevation_m=Math.round(',
  '6 fracture scale cross-reference':            'nearest regional lineament intersection',
  '7 DS belief cap':                             'overstated certainty while the 3 physics methods agreed',
  '8 hydro-climate dataSource stamp':            'budget previously used',
};

const found = Object.fromEntries(Object.keys(wanted).map(k => [k, false]));
let scanned = 0;
for (const u of jsChunks) {
  try {
    const t = await (await fetch(u, { headers: { 'User-Agent': UA } })).text();
    scanned++;
    for (const [k, s] of Object.entries(wanted)) if (t.includes(s)) found[k] = true;
  } catch { /* skip */ }
}

console.log('Deployment          :', dpl);
console.log('Chunks scanned      :', scanned);
let ok = true;
for (const [k, v] of Object.entries(found)) {
  console.log(`${v ? 'YES ✓' : 'NO  ✗'}  ${k}`);
  if (!v) ok = false;
}
await browser.close();
process.exit(ok ? 0 : 1);
