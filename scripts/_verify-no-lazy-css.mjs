// DECISIVE verification that the lazy-CSS ChunkLoadError class is dead:
// 1. Every stylesheet the browser requests must already be a <link> in the
//    SSR'd initial HTML (no runtime CSS chunk loads AT ALL).
// 2. The engine's styles (e.g. .borehole-spinner) must be present via those
//    initial stylesheets.
// 3. The tool must boot with no crash screen.
import { chromium } from 'playwright-core';
process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
const exe = 'C:/Users/ADMIN/AppData/Local/ms-playwright/chromium-1200/chrome-win64/chrome.exe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const URL_ = 'https://www.emersoneims.com/aquascan-pro-v3';

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, userAgent: UA });

const cssRequests = [];
page.on('request', (r) => {
  if (r.resourceType() === 'stylesheet' || /\.css(\?|$)/.test(r.url())) cssRequests.push(r.url());
});

const resp = await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60000 });
const html = await resp.text();
const initialLinks = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);

// Let the dynamic engine import fully load (this is when the old lazy CSS
// chunk would have been requested)
await page.waitForTimeout(25000);

const body = await page.evaluate(() => document.body.innerText.slice(0, 3000));
const booted = /AquaScan/i.test(body) && !/couldn.t load|Oops/i.test(body);
const engineStylesPresent = await page.evaluate(() => {
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText && rule.cssText.includes('borehole-spinner')) return true;
        }
      } catch { /* cross-origin sheet */ }
    }
  } catch {}
  return false;
});

const norm = (u) => u.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
const initialSet = new Set(initialLinks.map(norm));
// Only same-origin /_next chunk CSS can produce ChunkLoadError — external
// stylesheet @imports (Google Fonts /css2) are plain browser fetches that
// degrade silently and are irrelevant to this defect class.
const runtimeChunkCss = [...new Set(
  cssRequests.filter((u) => u.includes('emersoneims.com') || u.startsWith('/')).map(norm)
)].filter((u) => u.includes('/_next/') && !initialSet.has(u));

console.log('Deployment          :', (html.match(/dpl_[A-Za-z0-9]+/) || ['?'])[0]);
console.log('Initial <link> CSS  :', [...initialSet].join(' | ') || 'none');
console.log('Runtime-loaded chunk CSS (would-be crash class):', runtimeChunkCss.length ? runtimeChunkCss.join(' | ') + ' ✗' : 'NONE ✓');
console.log('Engine styles in initial sheets (.borehole-spinner):', engineStylesPresent ? 'YES ✓' : 'NO ✗');
console.log('Tool booted cleanly :', booted ? 'YES ✓' : 'NO ✗');
console.log('Retired chunk URL 5962c327… anywhere:', cssRequests.some((u) => u.includes('5962c3274b2602e3')) || html.includes('5962c3274b2602e3') ? 'STILL PRESENT ✗' : 'GONE ✓');

await browser.close();
process.exit(runtimeChunkCss.length === 0 && engineStylesPresent && booted ? 0 : 1);
