// Functional smoke test: does live AquaScan Pro boot cleanly end-to-end?
import { chromium } from 'playwright-core';
process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
const exe = 'C:/Users/ADMIN/AppData/Local/ms-playwright/chromium-1200/chrome-win64/chrome.exe';

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
page.on('response', (r) => { if (r.status() >= 400 && r.url().includes('/_next/')) errors.push(`HTTP ${r.status()} ${r.url().slice(-70)}`); });

await page.goto('https://www.emersoneims.com/aquascan-pro-v3', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(20000); // let the dynamic import + engine load fully

const body = await page.evaluate(() => document.body.innerText.slice(0, 4000));
const crashed = /couldn.t load|Connection dropped|Oops/i.test(body);
const booted = /AquaScan/i.test(body) && !crashed;
const swControls = await page.evaluate(async () => {
  const reg = await navigator.serviceWorker?.getRegistration();
  return { registered: !!reg, controllingThisPage: !!navigator.serviceWorker?.controller };
});

console.log('Tool booted        :', booted ? 'YES' : 'NO');
console.log('Crash/offline UI   :', crashed ? 'SHOWN (BAD)' : 'not shown');
console.log('SW registered      :', swControls.registered, ' controlling page:', swControls.controllingThisPage);
console.log('Page errors / 4xx  :', errors.length ? errors.join(' | ') : 'none');
await browser.close();
process.exit(booted && !crashed ? 0 : 1);
