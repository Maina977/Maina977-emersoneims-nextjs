import { chromium } from 'playwright';
const URL = 'https://www.emersoneims.com/aquascan-pro-v3';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const browser = await chromium.launch();
for (let i = 1; i <= 3; i++) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  const bad = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`HTTP ${r.status()} ${r.url().slice(0, 90)}`); });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => console.log('goto:', e.message));
  await page.waitForTimeout(6000);
  const txt = await page.evaluate(() => document.body?.innerText || '');
  console.log(`\n--- RUN ${i} (fresh session) ---`);
  console.log('  HAS Oops:', txt.includes('Oops'));
  console.log('  band present:', txt.includes('Audit-grade borehole'));
  console.log('  engine present:', txt.includes('AquaScan Pro'));
  console.log('  page errors:', errs.length, errs.slice(0, 3));
  console.log('  4xx/5xx responses:', [...new Set(bad)].slice(0, 8));
  await ctx.close();
}
await browser.close();
