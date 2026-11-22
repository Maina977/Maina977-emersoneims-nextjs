/**
 * Layout-shift sources against a LOCAL production build (never the live site).
 *
 *   npx next build                 (detached, see memory: never in the foreground)
 *   npx next start -p 3200         (detached)
 *   node scripts/verify/cls-sources.cjs --label before [--runs 3] [--pages home,solar] [--widths 390,1366] [--axe]
 *
 * For every page and width it makes cold loads (a fresh browser context, so an
 * empty HTTP cache, no stored cookie consent), records every `layout-shift`
 * entry with its `sources` (node, previousRect, currentRect; Chrome clips both
 * rects to the viewport), waits past the cookie notice (it opens after 2 s),
 * and computes CLS the way Chrome does: the largest session window (shifts
 * < 1 s apart, window <= 5 s), ignoring shifts within 500 ms of input.
 *
 * With --axe it also runs axe-core with the cookie notice open and checks that
 * headings, buttons, form fields, warnings and report-download controls can be
 * scrolled into view without being covered (elementFromPoint at their centre).
 *
 * Output: scripts/verify/out/cls-<label>.json and cls-<label>.txt (git-ignored);
 * the .txt ends with the line DONE.
 *
 * Safety: refuses non-local hosts; every request to /api/contact is aborted, so
 * no enquiry email can ever be sent from a test run.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : def;
};
const flag = (name) => process.argv.includes(`--${name}`);

const BASE = arg('base', process.env.VERIFY_BASE || 'http://localhost:3200');
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) {
  console.error('Refusing to run against a non-local host');
  process.exit(2);
}
const LABEL = arg('label', 'run');
const RUNS = Number(arg('runs', '3'));
const WIDTHS = arg('widths', '390,1366').split(',').map(Number);
const AXE = flag('axe');
const SETTLE_MS = Number(arg('settle', '7000'));

const PAGES = {
  home: { path: '/' },
  solar: { path: '/solar-genius-pro#/proposal' },
  oracle: { path: '/generator-oracle' },
  aquascan: { path: '/aquascan-pro-v3' },
  aquascanResult: { path: '/aquascan-pro-v3', analyse: { lat: '-0.4532', lon: '39.6461' } },
  building: { path: '/solutions/building' },
  takeoff: { path: '/solutions/building/takeoff' },
};
const pageKeys = arg('pages', Object.keys(PAGES).join(',')).split(',');

const out = path.join(__dirname, 'out');
fs.mkdirSync(out, { recursive: true });
const txt = path.join(out, `cls-${LABEL}.txt`);
fs.writeFileSync(txt, '');
const log = (m) => { fs.appendFileSync(txt, m + '\n'); console.log(m); };

const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';
const contextFor = (w) => (w < 768
  ? { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: MOBILE_UA }
  : { viewport: { width: w, height: 768 }, userAgent: DESKTOP_UA });

/* Runs in the page before any of its scripts. */
function installObserver() {
  const describe = (n) => {
    if (!n || n.nodeType !== 1) return n ? `#${n.nodeName}` : '(removed node)';
    const chain = [];
    let el = n;
    for (let d = 0; el && el.nodeType === 1 && d < 4; d++, el = el.parentElement) {
      let s = el.tagName.toLowerCase();
      if (el.id) s += `#${el.id}`;
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 3) : [];
      if (cls.length) s += '.' + cls.join('.');
      chain.push(s);
    }
    const text = (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    return `${chain.join(' < ')}${text ? ` "${text}"` : ''}`;
  };
  const rect = (r) => (r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null);
  window.__cls = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__cls.push({
          value: e.value,
          t: Math.round(e.startTime),
          input: e.hadRecentInput,
          sources: (e.sources || []).map((s) => ({ node: describe(s.node), prev: rect(s.previousRect), curr: rect(s.currentRect) })),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* observer unsupported */ }
}

/* Chrome's CLS: max over session windows (gap < 1 s, span <= 5 s). */
function sessionCls(entries) {
  let best = 0, cur = 0, start = -1, last = -1;
  for (const e of entries.filter((x) => !x.input).sort((a, b) => a.t - b.t)) {
    if (start < 0 || e.t - last >= 1000 || e.t - start >= 5000) { cur = 0; start = e.t; }
    cur += e.value; last = e.t;
    if (cur > best) best = cur;
  }
  return best;
}

/* Runs in the page: can each key control be scrolled into view and hit? */
function reachCheck() {
  const sel = 'h1, h2, h3, button, input:not([type=hidden]), select, textarea, [role=alert], [role=status], a[download], a[href$=".pdf"]';
  const all = Array.from(document.querySelectorAll(sel));
  const extra = Array.from(document.querySelectorAll('a, button')).filter((el) => /download|pdf|report|export|print/i.test(el.textContent || ''));
  // A page's own full-screen modal (e.g. the Generator Oracle safety disclaimer
  // that must be accepted first) covers the page by design: then only the
  // controls inside it, and the cookie notice, are checked.
  const cookie = document.querySelector('[aria-labelledby="cookie-notice-title"]');
  const modal = Array.from(document.querySelectorAll('[role=dialog]')).find((d) => {
    if (d === cookie) return false;
    const r = d.getBoundingClientRect();
    return d.getAttribute('aria-modal') === 'true' || (r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9);
  }) || null;
  const seen = new Set();
  const items = [...all, ...extra].filter((el) => {
    if (modal && !modal.contains(el) && !(cookie && cookie.contains(el))) return false;
    if (seen.has(el)) return false;
    seen.add(el);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || cs.display === 'none' || r.width < 2 || r.height < 2) return false;
    if (el.closest('[aria-hidden="true"], [hidden], [inert]')) return false;
    // Fixed chrome (the cookie notice itself, floating buttons) is checked as itself.
    return true;
  }).slice(0, 200);
  // Reachable = there is a scroll position where the control's centre is not
  // covered (by the cookie notice, a floating button or the fixed header). The
  // bottom of the page is the hard case, so 'end' is tried first.
  const blocked = [];
  const probe = (el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return { ok: true }; // clipped by its own scroller (carousel)
    const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
    const cy = Math.min(Math.max(r.top + Math.min(r.height, 40) / 2, 1), innerHeight - 1);
    const hit = document.elementFromPoint(cx, cy);
    return { ok: !hit || el === hit || el.contains(hit) || hit.contains(el), hit };
  };
  for (const el of items) {
    let res = null;
    for (const block of ['end', 'center', 'start']) {
      // 'instant': the site sets scroll-behavior:smooth, so a plain call would
      // still be animating when the position is read.
      el.scrollIntoView({ block, inline: 'nearest', behavior: 'instant' });
      res = probe(el);
      if (res.ok) break;
    }
    if (res.ok) continue;
    const hit = res.hit;
    const by = hit.closest('[role=dialog], #accessibility-settings, nav, .fixed, [class*="fixed"]') || hit;
    blocked.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 40)}" covered by ${by.tagName.toLowerCase()}${by.id ? '#' + by.id : ''}${by.getAttribute('role') ? '[role=' + by.getAttribute('role') + ']' : ''}.${String(by.className).split(/\s+/).slice(0, 3).join('.')}`);
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  return { checked: items.length, blocked, modal: modal ? (modal.getAttribute('aria-label') || modal.getAttribute('aria-labelledby') || modal.className.toString().slice(0, 40)) : null };
}

async function oneLoad(browser, key, width, run) {
  const spec = PAGES[key];
  const ctx = await browser.newContext(contextFor(width));
  await ctx.route('**/api/contact**', (r) => r.abort());
  await ctx.addInitScript(installObserver);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  const t0 = Date.now();
  await page.goto(BASE + spec.path, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(SETTLE_MS);
  if (spec.analyse) {
    const lat = page.locator('input[placeholder^="Latitude"]');
    await lat.waitFor({ timeout: 120000 });
    await lat.fill(spec.analyse.lat);
    await page.locator('input[placeholder^="Longitude"]').fill(spec.analyse.lon);
    await page.getByText(/Analyse these coordinates/).first().click();
    await page.waitForFunction(() => /Analysis Complete/.test(document.body.innerText), null, { timeout: 300000 });
    await page.waitForTimeout(10000);
  }
  const entries = await page.evaluate(() => window.__cls || []);
  const consentOpen = await page.evaluate(() => document.documentElement.getAttribute('data-consent-bar') === 'open');
  let axe = null, reach = null;
  if (AXE && run === 0) {
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
    });
    reach = await page.evaluate(reachCheck);
  }
  await ctx.close();
  return { cls: sessionCls(entries), total: entries.filter((e) => !e.input).reduce((s, e) => s + e.value, 0), entries, consentOpen, errors, axe, reach, ms: Date.now() - t0 };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const results = {};
  log(`CLS sources :: ${LABEL} :: ${BASE} :: ${RUNS} cold load(s) per page and width :: ${new Date().toISOString()}`);
  for (const key of pageKeys) {
    for (const width of WIDTHS) {
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        try { runs.push(await oneLoad(browser, key, width, i)); } catch (e) { runs.push({ error: String(e).slice(0, 200), cls: NaN, entries: [] }); }
      }
      const vals = runs.map((r) => r.cls).filter(Number.isFinite).sort((a, b) => a - b);
      const median = vals.length ? vals[Math.floor(vals.length / 2)] : NaN;
      results[`${key}@${width}`] = { median, runs };
      log(`\n== ${key} @ ${width}px :: median CLS ${median.toFixed(4)} :: runs ${runs.map((r) => (Number.isFinite(r.cls) ? r.cls.toFixed(4) : 'ERR ' + r.error)).join(' / ')}`);
      // Biggest sources across the runs.
      const agg = new Map();
      for (const r of runs) for (const e of r.entries || []) {
        if (e.input) continue;
        for (const s of e.sources) {
          const k = s.node;
          const a = agg.get(k) || { value: 0, n: 0, sample: s, t: e.t };
          a.value += e.value / Math.max(1, e.sources.length); a.n++; agg.set(k, a);
        }
      }
      [...agg.entries()].sort((a, b) => b[1].value - a[1].value).slice(0, 8).forEach(([k, a]) => {
        log(`   ${(a.value / RUNS).toFixed(4)}/load  x${a.n}  t=${a.t}ms  ${k}  prev=${JSON.stringify(a.sample.prev)} curr=${JSON.stringify(a.sample.curr)}`);
      });
      const r0 = runs[0] || {};
      if (r0.errors && r0.errors.length) log(`   page errors: ${r0.errors.join(' | ')}`);
      if (r0.axe) log(`   axe (cookie notice ${r0.consentOpen ? 'open' : 'not open'}): ${r0.axe.length ? r0.axe.map((v) => `${v.id}[${v.impact}] x${v.nodes} ${v.targets.join(', ')}`).join(' ; ') : 'no violations'}`);
      if (r0.reach) log(`   reach${r0.reach.modal ? ` (page modal open: ${r0.reach.modal}; its controls only)` : ''}: ${r0.reach.checked} controls checked,${r0.reach.blocked.length} covered${r0.reach.blocked.length ? ': ' + r0.reach.blocked.slice(0, 12).join(' ; ') : ''}`);
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, `cls-${LABEL}.json`), JSON.stringify(results, null, 1));
  log('\nSUMMARY (median CLS)');
  for (const [k, v] of Object.entries(results)) log(`${k.padEnd(22)} ${v.median.toFixed(4)}`);
  log('DONE');
})().catch((e) => { log('FATAL ' + String(e)); log('DONE'); process.exit(1); });
