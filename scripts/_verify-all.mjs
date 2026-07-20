// Verify B3/B7/B8 code is in the LIVE aquascan bundle:
// load the page in real Chrome, capture every JS response body,
// and grep for the new marker strings.
import { chromium } from 'playwright-core';
const BROWSERS = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = BROWSERS;
const exe = `${BROWSERS}/chromium-1200/chrome-win64/chrome.exe`;

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});

const markers = {
  'B3 wells overlay on maps': 'VERIFIED WELL',
  'B3 registry coords (UNESCO)': 'UNESCO IHP-WINS registry',
  'B7 drilling window page 1': 'BEST DRILLING WINDOW',
  'B8 audit regression guard': 'Integrity Regression Guard',
  'B1 decision brief': 'EXECUTIVE DECISION BRIEF',
  'B1 one-verdict box': 'FINAL VERDICT -- GOVERNS EVERY SECTION',
  'Baseline partial-failure fix': 'Climate API failed',
  'KES survey pricing': 'KSh 40,000-110,000',
  'Drill method labels': 'mud rotary (loose formation)',
  'Market caution': 'quotes below ~KSh 5,000/m',
  'WRA statutory line': 'WRA Approvals',
  'Offline auto-resume screen': 'Connection dropped',
};
const found = {};
let jsCount = 0;

page.on('response', async (r) => {
  const url = r.url();
  if (!/\.js(\?|$)/.test(url) && !url.includes('/_next/')) return;
  try {
    const body = await r.text();
    jsCount++;
    for (const [k, m] of Object.entries(markers)) {
      if (!found[k] && body.includes(m)) found[k] = url.split('/').pop().slice(0, 50);
    }
  } catch {}
});

await page.goto('https://www.emersoneims.com/aquascan-pro-v3', { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
// give lazy engine chunks time to arrive
await page.waitForTimeout(15000);

console.log(`JS responses inspected: ${jsCount}`);
for (const k of Object.keys(markers)) {
  console.log(`${found[k] ? 'FOUND ' : 'MISSING'}  ${k}${found[k] ? '  in ' + found[k] : ''}`);
}
await browser.close();
process.exit(Object.keys(found).length === Object.keys(markers).length ? 0 : 1);

