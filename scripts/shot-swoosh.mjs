import { chromium } from 'playwright-core';
import { mkdirSync } from 'fs';

const BROWSERS = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = BROWSERS;
const exe = `${BROWSERS}/chromium-1200/chrome-win64/chrome.exe`;
const URL = 'http://localhost:3010/swoosh-x';
const OUT = 'd:/MY WEBSITE RECOVERY FOLDER/my-app/scripts/_shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
await page.goto(URL, { waitUntil: 'domcontentloaded' });

// dismiss cookie / chat overlays so they don't cover the caption
for (const label of [/Reject All/i, /Essential Only/i, /Accept All/i]) {
  const b = page.getByRole('button', { name: label });
  if (await b.count()) { await b.first().click().catch(() => {}); break; }
}
await page.waitForTimeout(300);

const section = page.locator('section[aria-label="Every Project, Nothing But Net."]');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

// Deterministic: ensure we're in HOLD, then wait for a FRESH throw to start,
// then capture immediately at high rate to get the whole arc.
const ball = section.locator('.swoosh-ball').first();
await ball.waitFor({ state: 'detached', timeout: 9000 }).catch(() => {});
await ball.waitFor({ state: 'attached', timeout: 9000 }).catch(() => {});
for (let i = 0; i < 22; i++) {
  await section.screenshot({ path: `${OUT}/throw-${String(i).padStart(2, '0')}.png` }).catch(() => {});
  await page.waitForTimeout(45);
}
console.log('throw captured');
await browser.close();
console.log('done');
