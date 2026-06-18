/**
 * _local-mock-server.mjs — LOCAL stand-in for the Google Apps Script web app.
 * ==========================================================================
 * Dev/proof tool ONLY. Implements integrations/google-sheets/CONTRACT.md exactly
 * (token-gated doPost event/lead + doGet stats/leads with honest aggregation) so
 * the full pipeline can be demonstrated end-to-end on this machine WITHOUT any
 * Google account. It stores rows in memory. Never deploy this; the real backend
 * is Code.gs running on Apps Script.
 *
 *   SHEET_TOKEN=test123 PORT=8799 node integrations/google-sheets/_local-mock-server.mjs
 */
import http from 'node:http';

const TOKEN = process.env.SHEET_TOKEN || 'test123';
const PORT = Number(process.env.PORT || 8799);
const events = [];
const leads = [];

const json = (res, obj) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};
const num = (x) => Number(x) || 0;
const today = () => new Date().toISOString().slice(0, 10);

function buildStats(days) {
  const lo = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
  const rows = events.filter((e) => String(e.day) >= lo);
  const nowSec = Math.floor(Date.now() / 1000);
  const distinct = (arr) => new Set(arr).size;
  const views = rows.filter((r) => r.type === 'pageview');
  const clicks = rows.filter((r) => r.type === 'click');
  const group = (arr, keyFn) => {
    const m = new Map();
    for (const r of arr) {
      const k = keyFn(r);
      if (k === null) continue;
      if (!m.has(k)) m.set(k, { rows: [], vis: new Set() });
      m.get(k).rows.push(r);
      m.get(k).vis.add(r.visitor);
    }
    return m;
  };
  const top = (m, build) =>
    [...m.entries()]
      .map(([k, v]) => build(k, v))
      .sort((a, b) => b.views - a.views)
      .slice(0, 50);
  const pageM = group(views, (r) => `${r.site}${r.path}`);
  const siteM = group(rows, (r) => r.site);
  const ctryM = group(views, (r) => (r.country ? r.country : null));
  const regM = group(views, (r) => (r.region ? `${r.country}${r.region}` : null));
  const cityM = group(views, (r) => (r.city ? `${r.country}${r.region}${r.city}` : null));
  const clickM = new Map();
  for (const c of clicks) {
    if (!c.label) continue;
    const k = `${c.label}${c.site}`;
    clickM.set(k, (clickM.get(k) || 0) + 1);
  }
  return {
    generated_at: new Date().toISOString(),
    window_days: days,
    totals: { views: views.length, clicks: clicks.length, visitors: distinct(rows.map((r) => r.visitor)) },
    today: {
      views: views.filter((r) => r.day === today()).length,
      visitors: distinct(rows.filter((r) => r.day === today()).map((r) => r.visitor)),
    },
    live_visitors: distinct(rows.filter((r) => num(r.ts) > nowSec - 300).map((r) => r.visitor)),
    series: [...group(rows, (r) => `${r.day}${r.site}`).entries()].map(([k, v]) => {
      const [day, site] = k.split('');
      return { day, site, views: v.rows.filter((r) => r.type === 'pageview').length, visitors: v.vis.size };
    }),
    top_pages: top(pageM, (k, v) => {
      const [site, path] = k.split('');
      return { site, path, views: v.rows.length, visitors: v.vis.size };
    }),
    per_site: top(siteM, (k, v) => ({ site: k, views: v.rows.filter((r) => r.type === 'pageview').length, visitors: v.vis.size })),
    top_clicks: [...clickM.entries()].map(([k, c]) => { const [label, site] = k.split(''); return { label, site, clicks: c }; }).sort((a, b) => b.clicks - a.clicks).slice(0, 50),
    top_countries: top(ctryM, (k, v) => ({ country: k, views: v.rows.length, visitors: v.vis.size })),
    top_regions: top(regM, (k, v) => { const [country, region] = k.split(''); return { country, region, views: v.rows.length, visitors: v.vis.size }; }),
    top_cities: top(cityM, (k, v) => { const [country, region, city] = k.split(''); return { country, region, city, views: v.rows.length, visitors: v.vis.size }; }),
  };
}

http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      let d = {};
      try { d = JSON.parse(body || '{}'); } catch { return json(res, { ok: false, error: 'bad_json' }); }
      if (d.token !== TOKEN) return json(res, { ok: false, error: 'unauthorized' });
      if (d.kind === 'event') { events.push(d.event || {}); return json(res, { ok: true }); }
      if (d.kind === 'lead') { leads.push(d.lead || {}); return json(res, { ok: true }); }
      return json(res, { ok: false, error: 'unknown_kind' });
    });
    return;
  }
  // GET
  if (u.searchParams.get('token') !== TOKEN) return json(res, { error: 'unauthorized' });
  const action = u.searchParams.get('action');
  if (action === 'stats') {
    let days = parseInt(u.searchParams.get('days'), 10);
    if (!Number.isFinite(days) || days < 1) days = 30;
    if (days > 365) days = 365;
    return json(res, buildStats(days));
  }
  if (action === 'leads') return json(res, { leads: leads.slice(-50).reverse() });
  return json(res, { error: 'unknown_action' });
}).listen(PORT, () => console.log(`mock Apps Script listening on http://localhost:${PORT} (token=${TOKEN})`));
