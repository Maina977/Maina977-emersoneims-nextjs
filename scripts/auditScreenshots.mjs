// Capture full-page screenshots at 360 / 768 / 1024 / 1440 of audit-relevant routes,
// plus collect console errors, page errors, failed requests, and overflow facts.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3020';
const OUT = path.resolve('audit-shots');
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  '/',
  '/hub',
  '/hub/simulator',
  '/hub/quote-audit',
  '/hub/product-intelligence',
  '/hub/diagnostics',
  '/hub/solar-ups',
  '/hub/library',
];
const VIEWPORTS = [
  { w: 360, h: 740, label: 'm360' },
  { w: 768, h: 1024, label: 't768' },
  { w: 1024, h: 768, label: 'l1024' },
  { w: 1440, h: 900, label: 'd1440' },
];

const browser = await chromium.launch();
const summary = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    // Use an ALLOWED_BOTS UA to bypass the in-memory rate limiter and bot detector
    // for our local audit run only. This is a verification harness, not production traffic.
    userAgent:
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });
  const page = await ctx.newPage();

  for (const r of ROUTES) {
    const consoleMsgs = [];
    const pageErrors = [];
    const failedRequests = [];
    page.on('console', (m) => {
      const t = m.type();
      if (t === 'error' || t === 'warning') consoleMsgs.push({ t, text: m.text().slice(0, 240) });
    });
    page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 240)));
    page.on('response', (resp) => {
      const s = resp.status();
      if (s >= 400) failedRequests.push({ s, u: resp.url().slice(0, 200) });
    });

    let gotoErr = null;
    try {
      await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (e) {
      gotoErr = String(e).slice(0, 200);
    }
    await page.waitForTimeout(700);

    const facts = await page.evaluate(() => {
      const txt = document.body.innerText;
      return {
        title: document.title,
        hasHubName: txt.includes('Solar & UPS Intelligence Hub'),
        hasLegacy: /EmersonEIMS Hub|Engineering Hub/.test(txt),
        hasFab12400: txt.includes('12,400'),
        hasBreadcrumb: !!document.querySelector('nav[aria-label="Breadcrumb"], [aria-label="Breadcrumb"]'),
        hasHubLink: !!document.querySelector('a[href="/hub"]'),
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollH: document.documentElement.scrollHeight,
      };
    });

    const safe = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_');
    const file = path.join(OUT, `${vp.label}_${safe}.png`);
    try {
      await page.screenshot({ path: file, fullPage: true, type: 'png' });
    } catch (e) {
      gotoErr = (gotoErr || '') + ' | screenshot:' + String(e).slice(0, 120);
    }

    // remove listeners by recreating page next iteration would be cleaner, but for brevity:
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('response');

    summary.push({
      viewport: vp.label,
      route: r,
      gotoErr,
      facts,
      consoleErrors: consoleMsgs.filter((m) => m.t === 'error').length,
      consoleWarnings: consoleMsgs.filter((m) => m.t === 'warning').length,
      pageErrors: pageErrors.length,
      failedRequests: failedRequests.length,
      sampleErrors: consoleMsgs.filter((m) => m.t === 'error').slice(0, 5).map((m) => m.text),
      samplePageErrors: pageErrors.slice(0, 5),
      sampleFailed: failedRequests.slice(0, 5),
      file,
    });
  }
  await ctx.close();
}
await browser.close();

fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary.map(({ viewport, route, facts, consoleErrors, pageErrors, failedRequests }) => ({
  v: viewport, r: route, ovf: facts.overflow, brc: facts.hasBreadcrumb, hub: facts.hasHubName, leg: facts.hasLegacy, fab: facts.hasFab12400, ce: consoleErrors, pe: pageErrors, fr: failedRequests, sw: facts.scrollW, iw: facts.innerW,
})), null, 2));
console.log('\nFULL summary written to audit-shots/summary.json');
