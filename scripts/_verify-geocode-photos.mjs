// Live verification for the 2026-07-09 location+photos release:
// 1. CSP connect-src on production must allow nominatim + bigdatacloud
//    (root cause of "Location: 0.0267, 34.6472" instead of place names).
// 2. Reverse geocoding must actually WORK from inside the live page
//    (CSP-governed fetch in page context) for the Esikangu coordinates.
// 3. Typing coordinates into the live Set Site Location panel must render
//    the "Site identified:" hierarchy (county/sub-county/ward/village).
// 4. The deployed engine bundle must contain the SITE PHOTOGRAPHS section
//    and the DRILL AT THIS POINT marker code.
import { chromium } from 'playwright-core';
process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
const exe = 'C:/Users/ADMIN/AppData/Local/ms-playwright/chromium-1200/chrome-win64/chrome.exe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const URL_ = 'https://www.emersoneims.com/aquascan-pro-v3';
const LAT = '0.0266768', LON = '34.6471737';

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, userAgent: UA });

// Collect every JS chunk the page loads (resource-timing buffer overflows on
// this page, so a network listener is the reliable source of chunk URLs)
const jsChunks = new Set();
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('/_next/static/chunks/') && /\.js(\?|$)/.test(u)) jsChunks.add(u);
});

const resp = await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60000 });
const csp = resp.headers()['content-security-policy'] || '';
const html = await resp.text();
const dpl = (html.match(/dpl_[A-Za-z0-9]+/) || ['?'])[0];
const cspOK = csp.includes('nominatim.openstreetmap.org') && csp.includes('api.bigdatacloud.net');

// Wait for the engine to boot
await page.waitForTimeout(22000);

// 2. In-page fetches (subject to the live CSP)
const geoProbe = await page.evaluate(async ([lat, lon]) => {
  const out = { nominatim: null, bdc: null };
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`);
    const d = await r.json();
    out.nominatim = d?.address ? { county: d.address.county, state: d.address.state, display: (d.display_name || '').slice(0, 90) } : 'no-address';
  } catch (e) { out.nominatim = 'BLOCKED: ' + String(e).slice(0, 80); }
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const d = await r.json();
    const adm = (d?.localityInfo?.administrative || []).map(a => `${a.adminLevel}:${a.name}`).join(' | ');
    out.bdc = adm || 'no-admin';
  } catch (e) { out.bdc = 'BLOCKED: ' + String(e).slice(0, 80); }
  return out;
}, [LAT, LON]);

// 3. Type coordinates into the pinned-location field, expect "Site identified"
let pinnedText = '(field not found)';
try {
  const latInput = page.locator('input[placeholder*="Latitude"]').first();
  await latInput.fill(`${LAT}, ${LON}`, { timeout: 10000 });
  await page.waitForTimeout(8000);
  const body = await page.evaluate(() => document.body.innerText);
  const m = body.match(/Site identified:[^\n]*/);
  pinnedText = m ? m[0].slice(0, 220) : (body.includes('PINNED') ? 'PINNED shown, hierarchy not resolved' : 'PINNED banner missing');
} catch (e) { pinnedText = 'ERROR: ' + String(e).slice(0, 120); }

// 4. Engine bundle markers — fetch the observed chunks from Node
const bundleHit = { photos: false, ribbon: false, wells: false, chunkCount: jsChunks.size };
for (const u of jsChunks) {
  try {
    const t = await (await fetch(u, { headers: { 'User-Agent': UA } })).text();
    if (t.includes('SITE PHOTOGRAPHS')) bundleHit.photos = true;
    if (t.includes('DRILL AT THIS POINT')) bundleHit.ribbon = true;
    if (t.includes('NEAREST LISTED')) bundleHit.wells = true;
    if (bundleHit.photos && bundleHit.ribbon && bundleHit.wells) break;
  } catch { /* skip */ }
}

console.log('Deployment                     :', dpl);
console.log('CSP allows nominatim + BDC     :', cspOK ? 'YES ✓' : 'NO ✗');
console.log('In-page Nominatim reverse      :', JSON.stringify(geoProbe.nominatim));
console.log('In-page BigDataCloud levels    :', String(geoProbe.bdc).slice(0, 200));
console.log('Live "Site identified" banner  :', pinnedText);
console.log('Bundle has SITE PHOTOGRAPHS    :', bundleHit.photos ? 'YES ✓' : 'NO ✗', `(scanned ${bundleHit.chunkCount} chunks)`);
console.log('Bundle has DRILL AT THIS POINT :', bundleHit.ribbon ? 'YES ✓' : 'NO ✗');
console.log('Bundle has 100-wells listing   :', bundleHit.wells ? 'YES ✓' : 'NO ✗');

await browser.close();
const geocodeWorks = typeof geoProbe.nominatim === 'object' || !String(geoProbe.bdc).startsWith('BLOCKED');
process.exit(cspOK && geocodeWorks && bundleHit.photos && bundleHit.ribbon && bundleHit.wells ? 0 : 1);
