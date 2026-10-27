/**
 * Gentle post-deploy check of the LIVE site: one request at a time, 2 s apart
 * (gate rule 10). Browser and Googlebot user-agents; status, title, canonical
 * and h1 count; a few API answers.   node scripts/verify/live-smoke.cjs
 */
const LIVE = 'https://www.emersoneims.com';
const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const BOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const PAGES = ['/', '/solar', '/faults/spn-102', '/services/cummins-generators', '/solar-design-studio', '/aquascan-pro-v3', '/case-studies', '/generator-oracle'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (re, h) => (re.exec(h) || [])[1] || '';
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL ' + m); };

(async () => {
  for (const p of PAGES) {
    for (const [who, ua] of [['browser', CHROME], ['googlebot', BOT]]) {
      const r = await fetch(LIVE + p, { headers: { 'user-agent': ua }, redirect: 'manual' });
      const h = r.status === 200 ? await r.text() : '';
      const title = pick(/<title[^>]*>([^<]*)<\/title>/i, h).replace(/&amp;/g, '&');
      const canon = pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i, h);
      const h1 = (h.match(/<h1[\s>]/gi) || []).length;
      const mains = (h.match(/<main[\s>]/gi) || []).length;
      const canonOk = canon && new URL(canon, LIVE).pathname.replace(/\/$/, '') === (p.replace(/\/$/, '') || '');
      if (r.status !== 200) fail(`${p} [${who}] HTTP ${r.status}`);
      else if (!canonOk && p !== '/') fail(`${p} [${who}] canonical ${canon}`);
      else if (h1 !== 1) fail(`${p} [${who}] ${h1} h1`);
      else console.log(`ok   ${p} [${who}] 200, ${title.length} chars "${title}", canonical self, 1 h1, ${mains} <main>`);
      await sleep(2000);
    }
  }
  const post = (path, body) => fetch(LIVE + path, { method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': CHROME }, body: JSON.stringify(body) });
  const checks = [
    ['proposal {} -> 400', () => post('/api/reports/proposal', {}), 400],
    ['battery-sizing {} -> 400', () => post('/api/eng/battery-sizing', {}), 400],
    ['ai/chat SPN 110 FMI 0 -> 200', () => post('/api/ai/chat', { message: 'SPN 110 FMI 0' }), 200],
    ['weather Nairobi -> 200', () => fetch(LIVE + '/api/weather/-1.2865/36.8172', { headers: { 'user-agent': CHROME } }), 200],
  ];
  for (const [label, go, want] of checks) {
    const r = await go();
    const body = (await r.text()).slice(0, 140).replace(/\s+/g, ' ');
    r.status === want ? console.log(`ok   ${label} (${body.slice(0, 80)})`) : fail(`${label}: HTTP ${r.status} ${body}`);
    await sleep(2000);
  }
  console.log(bad ? `LIVE SMOKE FAILED: ${bad}` : 'LIVE SMOKE PASSED');
  process.exit(bad ? 1 : 0);
})();
