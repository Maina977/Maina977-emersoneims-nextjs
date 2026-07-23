import { chromium } from 'playwright-core';
const BROWSERS = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = BROWSERS;
const exe = `${BROWSERS}/chromium-1200/chrome-win64/chrome.exe`;
const OUT = 'd:/MY WEBSITE RECOVERY FOLDER/my-app/scripts/_shots';

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const errors = [];
const failed = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 140)));
page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 90)}`));
page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().slice(0, 90)}`); });

await page.goto('http://localhost:3010/swoosh-x', { waitUntil: 'domcontentloaded' });
for (const label of [/Reject All/i, /Essential Only/i, /Accept All/i]) {
  const b = page.getByRole('button', { name: label });
  if (await b.count()) { await b.first().click().catch(() => {}); break; }
}
const section = page.locator('section[aria-label="Every Project, Nothing But Net."]');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await section.screenshot({ path: `${OUT}/verify-initial.png` });

// is there a real <img> with natural pixels inside the stage?
const imgInfo = await section.evaluate((el) => {
  const imgs = [...el.querySelectorAll('img')];
  return imgs.map((i) => ({ w: i.naturalWidth, h: i.naturalHeight, src: i.currentSrc.slice(-40) })).filter((i) => i.w > 0);
});

console.log('HYDRATION/CONSOLE ERRORS:', errors.length);
errors.slice(0, 8).forEach((e) => console.log('  -', e));
console.log('FAILED REQUESTS:', failed.length);
failed.slice(0, 12).forEach((e) => console.log('  -', e));
console.log('LOADED IMAGES IN STAGE:', imgInfo.length);
imgInfo.slice(0, 3).forEach((i) => console.log('  -', i.w + 'x' + i.h, i.src));
await browser.close();
