// Run Lighthouse mobile against a list of URLs using a real-browser UA
// so the in-memory bot middleware does not block headless Chrome.
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import fs from 'node:fs';

// Googlebot smartphone UA — middleware ALLOWED_BOTS lets this through.
// Lighthouse still emulates a real mobile device for metrics; UA is only
// for getting past the local bot middleware in the staging-equivalent build.
const UA =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const BASE = process.env.LH_BASE || 'http://127.0.0.1:3020';
const urls = [
  `${BASE}/hub`,
  `${BASE}/hub/simulator`,
];

const chrome = await launch({
  chromeFlags: [
    // No --headless: NO_NAVSTART on this Windows + Chrome 124 + Lighthouse 12
    // combo only happens in headless mode. Visible mode produces a real trace.
    '--no-sandbox',
    '--disable-gpu',
    '--window-position=2400,2400', // off-screen so it doesn't disturb the user
    '--window-size=412,915',
    `--user-agent=${UA}`,
  ],
});

const results = [];
try {
  for (const url of urls) {
    const r = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 740,
          deviceScaleFactor: 2,
          disabled: false,
        },
        emulatedUserAgent: UA,
        throttlingMethod: 'devtools',
        maxWaitForLoad: 60000,
      },
    );
    const c = r.lhr.categories;
    const row = {
      url,
      perf: Math.round(c.performance.score * 100),
      a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
    };
    results.push(row);
    const safe = url.replace(/[^a-z0-9]+/gi, '_');
    fs.writeFileSync(`lh_${safe}.json`, r.report);
    console.log(JSON.stringify(row));
  }
} finally {
  try { await chrome.kill(); } catch { /* ignore Windows EBUSY on temp profile cleanup */ }
}

fs.writeFileSync('lh_summary.json', JSON.stringify(results, null, 2));
console.log('\nLighthouse summary:');
console.table(results);
