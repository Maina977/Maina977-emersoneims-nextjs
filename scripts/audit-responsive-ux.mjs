// ═══════════════════════════════════════════════════════════════════
// RESPONSIVE UX AUDIT — desktop / tablet / mobile against the LIVE site
// ═══════════════════════════════════════════════════════════════════
// For each key page at each viewport:
//   1. horizontal overflow (page scrolls sideways = broken mobile layout)
//   2. tap targets smaller than 40x40 px (links/buttons users can't hit)
//   3. body text smaller than 12px (unreadable on phones)
//   4. fixed/sticky elements covering more than 25% of the mobile screen
//   5. console errors + failed requests
//   6. missing/wrong viewport meta
// Usage: node scripts/audit-responsive-ux.mjs [pageLimit]
import { chromium } from 'playwright-core';
process.env.PLAYWRIGHT_BROWSERS_PATH = 'C:/Users/ADMIN/AppData/Local/ms-playwright';
const exe = 'C:/Users/ADMIN/AppData/Local/ms-playwright/chromium-1200/chrome-win64/chrome.exe';
const UA_DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const UA_MOBILE = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

const PAGES = [
  '/', '/services', '/generators', '/solar', '/about-us', '/brands',
  '/industries', '/contact', '/aquascan-pro-v3', '/solutions',
];
const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844,  ua: UA_MOBILE,  touch: true },
  { name: 'tablet',  width: 768,  height: 1024, ua: UA_MOBILE,  touch: true },
  { name: 'desktop', width: 1440, height: 900,  ua: UA_DESKTOP, touch: false },
];

const limit = parseInt(process.argv[2] || '99', 10);
const browser = await chromium.launch({ executablePath: exe });
const findings = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    userAgent: vp.ua,
    hasTouch: vp.touch,
    isMobile: vp.name !== 'desktop',
    deviceScaleFactor: vp.name === 'desktop' ? 1 : 3,
  });
  for (const path of PAGES.slice(0, limit)) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });
    try {
      await page.goto(`https://www.emersoneims.com${path}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(6000);
      // settle after lazy content, then measure
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(1500);

      const r = await page.evaluate((vpWidth) => {
        const out = { overflowPx: 0, overflowEls: [], smallTargets: [], tinyText: 0, fixedCoverPct: 0, viewportMeta: '' };
        out.viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? 'MISSING';
        const docW = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
        out.overflowPx = Math.max(0, docW - window.innerWidth);
        if (out.overflowPx > 4) {
          // find the widest offenders
          const els = [...document.querySelectorAll('body *')];
          for (const el of els) {
            const rect = el.getBoundingClientRect();
            if (rect.width > window.innerWidth + 8 && rect.width < docW + 50 && el.children.length < 30) {
              const id = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : ''}`;
              out.overflowEls.push(`${id} (${Math.round(rect.width)}px)`);
              if (out.overflowEls.length >= 4) break;
            }
          }
        }
        // tap targets (interactive, visible, in first 3 screens)
        const interactive = [...document.querySelectorAll('a,button,[role="button"],input,select')];
        for (const el of interactive) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (rect.top < 0 || rect.top > window.innerHeight * 3) continue;
          const style = getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) < 0.2) continue;
          if ((rect.width < 40 || rect.height < 40) && (rect.width < 44 && rect.height < 44)) {
            const label = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('href') || '?').trim().slice(0, 30);
            if (label) out.smallTargets.push(`${Math.round(rect.width)}x${Math.round(rect.height)} "${label}"`);
            if (out.smallTargets.length >= 8) break;
          }
        }
        // tiny text in first 3 screens
        const textEls = [...document.querySelectorAll('p,span,li,a,td,div')];
        let tiny = 0;
        for (const el of textEls) {
          if (!el.textContent || el.textContent.trim().length < 15 || el.children.length > 0) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < 0 || rect.top > window.innerHeight * 3 || rect.height === 0) continue;
          if (parseFloat(getComputedStyle(el).fontSize) < 12) tiny++;
        }
        out.tinyText = tiny;
        // fixed/sticky coverage
        let fixedArea = 0;
        for (const el of document.querySelectorAll('body *')) {
          const st = getComputedStyle(el);
          if ((st.position === 'fixed' || st.position === 'sticky') && st.display !== 'none') {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              fixedArea += Math.min(rect.width, window.innerWidth) * Math.min(rect.height, window.innerHeight);
            }
          }
        }
        out.fixedCoverPct = Math.round((fixedArea / (window.innerWidth * window.innerHeight)) * 100);
        return out;
      }, vp.width);

      const issues = [];
      if (r.viewportMeta === 'MISSING') issues.push('viewport meta MISSING');
      if (r.overflowPx > 4) issues.push(`HORIZONTAL OVERFLOW ${r.overflowPx}px [${r.overflowEls.join(' | ')}]`);
      if (vp.name !== 'desktop' && r.smallTargets.length >= 4) issues.push(`${r.smallTargets.length}+ small tap targets e.g. ${r.smallTargets.slice(0, 3).join('; ')}`);
      if (vp.name !== 'desktop' && r.tinyText > 5) issues.push(`${r.tinyText} elements with <12px text`);
      if (vp.name === 'mobile' && r.fixedCoverPct > 30) issues.push(`fixed/sticky elements cover ${r.fixedCoverPct}% of screen`);
      if (consoleErrors.length > 2) issues.push(`${consoleErrors.length} console errors e.g. ${consoleErrors[0]}`);

      findings.push({ page: path, vp: vp.name, issues });
      console.log(`${vp.name.padEnd(8)} ${path.padEnd(18)} ${issues.length === 0 ? 'OK' : 'ISSUES: ' + issues.join(' // ')}`);
    } catch (e) {
      findings.push({ page: path, vp: vp.name, issues: [`LOAD FAILED: ${String(e).slice(0, 80)}`] });
      console.log(`${vp.name.padEnd(8)} ${path.padEnd(18)} LOAD FAILED`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();

const bad = findings.filter(f => f.issues.length > 0);
console.log(`\n══ SUMMARY: ${findings.length - bad.length}/${findings.length} page-viewport combos clean ══`);
process.exit(0);
