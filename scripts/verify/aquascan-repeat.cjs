/**
 * AquaScan repeatability against a LOCAL production build: the same
 * coordinates analysed twice must give the same result text (timestamps and
 * clock times removed). node scripts/verify/aquascan-repeat.cjs
 */
const { chromium } = require('playwright');

const BASE = process.env.VERIFY_BASE || 'http://localhost:3111';
if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE)) { console.error('Refusing to run against a non-local host'); process.exit(2); }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const SITES = [
  { name: 'Garissa', lat: '-0.4532', lon: '39.6461' },
  { name: 'Nairobi', lat: '-1.2921', lon: '36.8219' },
  // ISRIC SoilGrids answers here but is blank at the two sites above, so this is
  // the one that exercises real soil values (2026-10-30).
  { name: 'Kitale', lat: '1.0000', lon: '35.0000' },
];
const BANNED = [/NaN/, /undefined/, /Infinity/, /\[object Object\]/, /Geo-Estimate:\s*,/];

const normalise = (t) => t.split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !/timestamp|generated|\b\d{1,2}:\d{2}(:\d{2})?\b|ago\b|\d{4}-\d{2}-\d{2}T/i.test(l))
  .join('\n');

async function analyse(browser, site) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  // Upstream relay use per analysis, against its per-client limit (data-relay route).
  let relay = 0, relay429 = 0;
  page.on('response', (r) => { if (r.url().includes('/api/borehole/data-relay')) { relay++; if (r.status() === 429) relay429++; } });
  await page.goto(BASE + '/aquascan-pro-v3', { waitUntil: 'domcontentloaded', timeout: 120000 });
  const lat = page.locator('input[placeholder^="Latitude"]');
  await lat.waitFor({ timeout: 120000 });
  await lat.fill(site.lat);
  await page.locator('input[placeholder^="Longitude"]').fill(site.lon);
  await page.getByText(/Analyse these coordinates/).first().click();
  // Wait until the result tabs appear, then let late sources settle.
  await page.waitForFunction(() => /Analysis Complete/.test(document.body.innerText), null, { timeout: 240000 });
  await page.waitForTimeout(15000);
  const text = await page.evaluate(() => document.body.innerText);
  await ctx.close();
  return { text, errs, relay, relay429 };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let problems = 0;
  for (const site of SITES) {
    const a = await analyse(browser, site);
    const b = await analyse(browser, site);
    console.log(`info ${site.name}: relay calls ${a.relay} and ${b.relay}; refused (429) ${a.relay429 + b.relay429}`);
    if (a.relay429 + b.relay429 > 0) { problems++; console.log(`FAIL ${site.name}: the relay limit refused a normal analysis`); }
    for (const [i, r] of [a, b].entries()) {
      for (const e of r.errs) { problems++; console.log(`FAIL ${site.name} run ${i + 1}: page error ${e}`); }
      for (const re of BANNED) if (re.test(r.text)) { problems++; console.log(`FAIL ${site.name} run ${i + 1}: shows ${re}`); }
    }
    // The headline yield sits inside its stated range; Garissa's range reaches
    // its real tested boreholes (12 and 15 m³/h within 20 km).
    const m = a.text.match(/([\d.]+)\s*m³\/hr\s*Expected Yield\s*Range:\s*([\d.]+)[–-]([\d.]+)/);
    if (!m) { problems++; console.log(`FAIL ${site.name}: Expected Yield card not found`); }
    else {
      const [y, lo, hi] = [Number(m[1]), Number(m[2]), Number(m[3])];
      if (!(lo <= y && y <= hi)) { problems++; console.log(`FAIL ${site.name}: yield ${y} outside its range ${lo}-${hi}`); }
      else if (site.name === 'Garissa' && hi < 11) { problems++; console.log(`FAIL Garissa: range top ${hi} below the 90th percentile of local tested yields`); }
      else console.log(`ok   ${site.name}: yield ${y} m³/h inside ${lo}-${hi}`);
    }
    // Keep both runs for diagnosis (scripts/verify/out is git-ignored).
    try {
      const fs = require('fs'), path = require('path');
      const dir = path.join(__dirname, 'out'); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `aquascan-${site.name}-run1.txt`), a.text);
      fs.writeFileSync(path.join(dir, `aquascan-${site.name}-run2.txt`), b.text);
    } catch { /* diagnosis only */ }
    // Address wording comes live from OpenStreetMap and can differ between
    // calls ("Starehe, Nairobi City" vs the full street address). It is shown,
    // not compared; every computed line must still match (2026-10-27).
    const isAddress = (l) => /^📍 (Area|Site Location|Site identified|Village|Sub-Location|Town|Sub-County)\b|^📍 \w[\w -]*:.*•|^Geocoded to:/.test(l);
    const addrA = normalise(a.text).split('\n').filter(isAddress);
    const addrB = normalise(b.text).split('\n').filter(isAddress);
    if (addrA.join('\n') !== addrB.join('\n')) console.log(`note ${site.name}: geocoder address wording differed between runs (not a computed value)`);
    const na = normalise(a.text).split('\n').filter((l) => !isAddress(l));
    const nb = normalise(b.text).split('\n').filter((l) => !isAddress(l));
    const diffs = [];
    for (let i = 0; i < Math.max(na.length, nb.length); i++) if (na[i] !== nb[i]) diffs.push(`  run1: ${na[i] || '∅'}\n  run2: ${nb[i] || '∅'}`);
    if (diffs.length) { problems++; console.log(`FAIL ${site.name}: ${diffs.length} line(s) differ between runs\n${diffs.slice(0, 8).join('\n')}`); }
    else console.log(`ok   ${site.name}: two runs identical (${na.length} lines)`);
  }
  await browser.close();
  console.log(problems ? `FAILED: ${problems} problem(s)` : 'AQUASCAN REPEATABILITY PASSED');
  process.exit(problems ? 1 : 0);
})();
