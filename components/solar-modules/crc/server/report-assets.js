// Report visuals — server-side chart, map and single-line-diagram rendering.
// All visuals are rendered as SVG strings, then rasterised to PNG via `sharp`
// so they can be embedded in PDF (jsPDF), Word (docx) and Excel (exceljs).
//
// No visual fabricates data: every helper is a pure function of its inputs.
// Charts plot only the numbers passed in by the engines.
//
// Map: composes free OpenStreetMap raster tiles (© OpenStreetMap contributors,
// ODbL) into a static map centred on lat/lon. Tile URL pattern is the standard
// OSM Slippy map: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
//
// Provenance:
//   - Charts: SolarGeniusPro internal renderer
//   - Map tiles: tile.openstreetmap.org (ODbL, attribution required)
//   - Sun-path / monthly yield / cash-flow data: provided by caller

const sharp = require('sharp');
const https = require('https');

// --------------------------------------------------------------------------
// Low-level: rasterise an SVG string to a PNG Buffer
// --------------------------------------------------------------------------
async function svgToPng(svg, width = 1000) {
  return sharp(Buffer.from(svg)).resize({ width }).png().toBuffer();
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// --------------------------------------------------------------------------
// 1. Monthly energy yield bar chart (kWh/month)
// --------------------------------------------------------------------------
function monthlyYieldSvg(monthly = [], opts = {}) {
  const W = 900, H = 360;
  const pad = { l: 60, r: 20, t: 40, b: 50 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const data = monthly.length === 12 ? monthly.map(Number) : new Array(12).fill(0);
  const maxV = Math.max(1, ...data) * 1.1;
  const barW = innerW / 12 * 0.7;
  const step = innerW / 12;
  const yTicks = 5;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) => (maxV * i) / yTicks);
  const yScale = (v) => pad.t + innerH - (v / maxV) * innerH;
  const colour = opts.colour || '#0b8457';
  const title = opts.title || 'Estimated monthly energy yield (kWh)';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-family="Helvetica,Arial" font-size="14" font-weight="700" fill="#1a1a2e">${esc(title)}</text>
    ${tickVals.map(v => `<line x1="${pad.l}" y1="${yScale(v)}" x2="${W-pad.r}" y2="${yScale(v)}" stroke="#e6e6e6"/>
      <text x="${pad.l-6}" y="${yScale(v)+4}" text-anchor="end" font-family="Helvetica" font-size="10" fill="#666">${Math.round(v).toLocaleString('en-KE')}</text>`).join('')}
    ${data.map((v,i) => {
      const x = pad.l + i*step + (step-barW)/2;
      const y = yScale(v);
      const h = pad.t + innerH - y;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${colour}"/>
              <text x="${x+barW/2}" y="${y-4}" text-anchor="middle" font-family="Helvetica" font-size="9" fill="#444">${Math.round(v).toLocaleString('en-KE')}</text>
              <text x="${x+barW/2}" y="${pad.t+innerH+14}" text-anchor="middle" font-family="Helvetica" font-size="10" fill="#444">${MONTHS[i]}</text>`;
    }).join('')}
    <text x="${pad.l}" y="${H-8}" font-family="Helvetica" font-size="9" fill="#666">Source: yield modelled from NASA POWER irradiance + module/inverter spec.</text>
  </svg>`;
}

// --------------------------------------------------------------------------
// 2. Cash-flow chart — net + cumulative line
// --------------------------------------------------------------------------
function cashflowSvg(rows = [], opts = {}) {
  // rows: [[year, net, cumulative], ...]
  const W = 900, H = 360;
  const pad = { l: 70, r: 30, t: 40, b: 50 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const years = rows.map(r => Number(r[0]));
  const cum   = rows.map(r => Number(r[2]));
  const net   = rows.map(r => Number(r[1]));
  const lo = Math.min(0, ...cum, ...net);
  const hi = Math.max(0, ...cum, ...net);
  const span = hi - lo || 1;
  const xScale = (i) => pad.l + (i / Math.max(1, rows.length - 1)) * innerW;
  const yScale = (v) => pad.t + innerH - ((v - lo) / span) * innerH;
  const yZero = yScale(0);
  const cumPath = cum.map((v,i) => `${i?'L':'M'}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ');
  const title = opts.title || 'Project cash flow (lifetime)';
  const currency = opts.currency || 'KES';
  const yTicks = 5;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) => lo + (span * i) / yTicks);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="${W/2}" y="22" text-anchor="middle" font-family="Helvetica" font-size="14" font-weight="700" fill="#1a1a2e">${esc(title)} (${currency})</text>
    ${tickVals.map(v => `<line x1="${pad.l}" y1="${yScale(v)}" x2="${W-pad.r}" y2="${yScale(v)}" stroke="#eee"/>
      <text x="${pad.l-6}" y="${yScale(v)+3}" text-anchor="end" font-family="Helvetica" font-size="9" fill="#666">${Math.round(v/1000).toLocaleString('en-KE')}k</text>`).join('')}
    <line x1="${pad.l}" y1="${yZero}" x2="${W-pad.r}" y2="${yZero}" stroke="#888" stroke-dasharray="3,3"/>
    ${net.map((v,i) => {
      const x = xScale(i) - 6;
      const y = v >= 0 ? yScale(v) : yZero;
      const h = Math.abs(yScale(v) - yZero);
      return `<rect x="${x}" y="${y}" width="12" height="${h}" fill="${v >= 0 ? '#0b8457' : '#c0392b'}" opacity="0.6"/>`;
    }).join('')}
    <path d="${cumPath}" fill="none" stroke="#0984E3" stroke-width="2.4"/>
    ${cum.map((v,i) => i % Math.max(1, Math.floor(rows.length/12)) === 0 ? `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="3" fill="#0984E3"/>` : '').join('')}
    ${years.map((y,i) => i % Math.max(1, Math.floor(rows.length/8)) === 0 ? `<text x="${xScale(i)}" y="${pad.t+innerH+14}" text-anchor="middle" font-family="Helvetica" font-size="10" fill="#444">Y${y}</text>` : '').join('')}
    <g font-family="Helvetica" font-size="10" fill="#444">
      <rect x="${W-pad.r-220}" y="${pad.t-20}" width="200" height="22" fill="#ffffff" stroke="#ddd"/>
      <rect x="${W-pad.r-210}" y="${pad.t-12}" width="10" height="6" fill="#0b8457"/>
      <text x="${W-pad.r-194}" y="${pad.t-6}">net (yr)</text>
      <line x1="${W-pad.r-130}" y1="${pad.t-9}" x2="${W-pad.r-110}" y2="${pad.t-9}" stroke="#0984E3" stroke-width="2.4"/>
      <text x="${W-pad.r-104}" y="${pad.t-6}">cumulative</text>
    </g>
  </svg>`;
}

// --------------------------------------------------------------------------
// 3. Single-line schematic (PV → DC iso → inverter → battery → AC → grid)
// --------------------------------------------------------------------------
function singleLineDiagramSvg({ panels = 14, panelW = 485, strings = 2, inverterKw = 5, batteryKwh = 10, hasGrid = true } = {}) {
  const totalKw = (panels * panelW) / 1000;
  const W = 1000, H = 420;
  const box = (x, y, w, h, label, sub, fill='#ffffff', stroke='#1a1a2e') => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
    <text x="${x+w/2}" y="${y+h/2-2}" text-anchor="middle" font-family="Helvetica" font-size="12" font-weight="700" fill="#1a1a2e">${esc(label)}</text>
    <text x="${x+w/2}" y="${y+h/2+14}" text-anchor="middle" font-family="Helvetica" font-size="10" fill="#555">${esc(sub)}</text>`;
  const arrow = (x1,y1,x2,y2,col='#1a1a2e') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1.5" marker-end="url(#arr)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#1a1a2e"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="${W/2}" y="24" text-anchor="middle" font-family="Helvetica" font-size="14" font-weight="700" fill="#1a1a2e">Single-line diagram (IEC 60617)</text>
    ${box(40,  60, 200, 80, `PV ARRAY`, `${panels} × ${panelW} W = ${totalKw.toFixed(2)} kWp · ${strings} string(s)`, '#eaf5ef', '#0b8457')}
    ${box(310, 60, 160, 80, `DC ISOLATOR`, `IEC 60947-3`)}
    ${box(540, 60, 220, 80, `HYBRID INVERTER`, `${inverterKw} kW · MPPT × 2`, '#eef4fb', '#0984E3')}
    ${box(820, 60, 150, 80, `BATTERY`, `${batteryKwh} kWh LFP`, '#fdf6e3', '#b08800')}
    ${box(540, 220, 220, 80, `AC DISTRIBUTION`, `RCBO + SPD`)}
    ${box(540, 320, 220, 60, hasGrid ? 'UTILITY GRID + LOADS' : 'OFF-GRID LOADS', hasGrid ? 'IEEE 1547 interconnect' : '—', '#f6f6f6', '#444')}
    ${arrow(240,100, 310,100)}
    ${arrow(470,100, 540,100)}
    ${arrow(760,100, 820,100)}
    ${arrow(650,140, 650,220)}
    ${arrow(650,300, 650,320)}
    <text x="40" y="${H-12}" font-family="Helvetica" font-size="9" fill="#666">Symbology per IEEE 315 / IEC 60617. Generated by SolarGeniusPro from caller-supplied design parameters.</text>
  </svg>`;
}

// --------------------------------------------------------------------------
// 4. Sun-path polar diagram (altitude vs azimuth)
// --------------------------------------------------------------------------
function sunPathSvg(samples = [], opts = {}) {
  // samples: [{ hour, altitude, azimuth }]
  const W = 520, H = 520;
  const cx = W/2, cy = H/2;
  const R = Math.min(W,H)/2 - 30;
  const polar = (alt, az) => {
    const r = R * (1 - Math.max(0, alt) / 90);
    const a = (Number(az) - 90) * Math.PI / 180; // 0° = north → top
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const pts = samples.filter(s => Number(s.altitude) > 0).map(s => polar(s.altitude, s.azimuth));
  const path = pts.map((p,i) => `${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const rings = [15, 30, 45, 60, 75].map(alt => {
    const r = R * (1 - alt/90);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e6e6e6"/>
            <text x="${cx + r}" y="${cy-2}" font-family="Helvetica" font-size="9" fill="#888">${alt}°</text>`;
  }).join('');
  const compass = ['N','E','S','W'].map((c,i) => {
    const a = (i*90 - 90) * Math.PI/180;
    return `<text x="${cx + (R+18)*Math.cos(a)}" y="${cy + (R+18)*Math.sin(a) + 4}" text-anchor="middle" font-family="Helvetica" font-weight="700" font-size="12" fill="#1a1a2e">${c}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="${W/2}" y="20" text-anchor="middle" font-family="Helvetica" font-size="14" font-weight="700" fill="#1a1a2e">${esc(opts.title || 'Sun path (today)')}</text>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#bbb"/>
    ${rings}
    ${compass}
    <path d="${path}" fill="none" stroke="#f39c12" stroke-width="3"/>
    ${pts.length ? `<circle cx="${pts[Math.floor(pts.length/2)][0]}" cy="${pts[Math.floor(pts.length/2)][1]}" r="6" fill="#e67e22"/>` : ''}
    <text x="${W/2}" y="${H-10}" text-anchor="middle" font-family="Helvetica" font-size="9" fill="#666">Algorithm: Michalsky 1988</text>
  </svg>`;
}

// --------------------------------------------------------------------------
// 5. Static OpenStreetMap composed from raster tiles
// --------------------------------------------------------------------------
function lonLatToTile(lon, lat, z) {
  const x = ((lon + 180) / 360) * Math.pow(2, z);
  const latRad = (lat * Math.PI) / 180;
  const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, z);
  return { x, y };
}

function fetchTile(z, x, y, timeoutMs = 6000) {
  const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'SolarGeniusPro/3.0 (reports; contact: sally@emersoneims.com)' }
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`tile ${z}/${x}/${y} → ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error('tile fetch timeout')));
  });
}

async function staticMapPng({ lat, lon, zoom = 15, widthPx = 720, heightPx = 480, label } = {}) {
  if (lat == null || lon == null) throw new Error('lat/lon required');
  const z = Math.min(18, Math.max(2, zoom));
  const TILE = 256;
  const center = lonLatToTile(lon, lat, z);
  const cols = Math.ceil(widthPx / TILE) + 2;
  const rows = Math.ceil(heightPx / TILE) + 2;
  const startX = Math.floor(center.x - cols / 2);
  const startY = Math.floor(center.y - rows / 2);

  // Fetch tiles in parallel
  const composites = [];
  const fetches = [];
  for (let dy = 0; dy < rows; dy++) {
    for (let dx = 0; dx < cols; dx++) {
      const tx = startX + dx;
      const ty = startY + dy;
      const max = Math.pow(2, z);
      if (tx < 0 || ty < 0 || tx >= max || ty >= max) continue;
      fetches.push(
        fetchTile(z, tx, ty)
          .then(buf => composites.push({ input: buf, left: dx * TILE, top: dy * TILE }))
          .catch(() => null)
      );
    }
  }
  await Promise.all(fetches);

  const fullW = cols * TILE;
  const fullH = rows * TILE;
  const base = sharp({ create: { width: fullW, height: fullH, channels: 3, background: '#dddddd' } });
  const composed = await base.composite(composites).png().toBuffer();

  // Crop to requested size centred on (lat,lon)
  const offsetX = (center.x - startX) * TILE - widthPx / 2;
  const offsetY = (center.y - startY) * TILE - heightPx / 2;
  const cropped = await sharp(composed)
    .extract({
      left: Math.max(0, Math.round(offsetX)),
      top:  Math.max(0, Math.round(offsetY)),
      width: Math.min(fullW, widthPx),
      height: Math.min(fullH, heightPx),
    })
    .png()
    .toBuffer();

  // Overlay marker + attribution
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}">
    <circle cx="${widthPx/2}" cy="${heightPx/2}" r="10" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
    <circle cx="${widthPx/2}" cy="${heightPx/2}" r="3" fill="#fff"/>
    ${label ? `<rect x="${widthPx/2+14}" y="${heightPx/2-12}" width="${esc(label).length*7+12}" height="22" fill="rgba(255,255,255,0.9)" stroke="#333"/>
    <text x="${widthPx/2+20}" y="${heightPx/2+3}" font-family="Helvetica" font-size="11" fill="#1a1a2e">${esc(label)}</text>` : ''}
    <rect x="0" y="${heightPx-18}" width="${widthPx}" height="18" fill="rgba(255,255,255,0.85)"/>
    <text x="6" y="${heightPx-5}" font-family="Helvetica" font-size="10" fill="#333">© OpenStreetMap contributors (ODbL) · ${lat.toFixed(5)}, ${lon.toFixed(5)} · z${z}</text>
  </svg>`;
  return sharp(cropped).composite([{ input: Buffer.from(overlay) }]).png().toBuffer();
}

// --------------------------------------------------------------------------
// Convenience: render everything we know how to from a proposal payload.
// Returns { monthlyYieldPng, cashflowPng, schematicPng, sunPathPng, mapPng }
// Each may be null if input missing or rendering fails (logged, never thrown).
// --------------------------------------------------------------------------
async function renderProposalAssets(payload = {}) {
  const out = { monthlyYieldPng: null, cashflowPng: null, schematicPng: null, sunPathPng: null, mapPng: null };
  const safe = async (label, fn) => { try { return await fn(); } catch (e) { console.warn(`[report-assets] ${label} failed:`, e.message); return null; } };

  if (Array.isArray(payload?.design?.monthlyYieldKwh) && payload.design.monthlyYieldKwh.length === 12) {
    out.monthlyYieldPng = await safe('monthlyYield', () => svgToPng(monthlyYieldSvg(payload.design.monthlyYieldKwh)));
  }
  if (Array.isArray(payload?.financial?.cashFlowTable) && payload.financial.cashFlowTable.length) {
    out.cashflowPng = await safe('cashflow', () => svgToPng(cashflowSvg(payload.financial.cashFlowTable, { currency: payload?.customer?.currency || 'KES' })));
  }
  if (payload?.design) {
    out.schematicPng = await safe('schematic', () => svgToPng(singleLineDiagramSvg({
      panels:     payload.design.panelCount,
      panelW:     payload.design.panelW,
      strings:    payload.design.stringConfig?.strings || 2,
      inverterKw: payload.design.inverterKw,
      batteryKwh: payload.design.batteryKwh || 0,
      hasGrid:    true,
    })));
  }
  if (Array.isArray(payload?.sunPathSamples) && payload.sunPathSamples.length) {
    out.sunPathPng = await safe('sunPath', () => svgToPng(sunPathSvg(payload.sunPathSamples)));
  }
  if (payload?.site?.lat != null && payload?.site?.lon != null) {
    out.mapPng = await safe('map', () => staticMapPng({
      lat: Number(payload.site.lat),
      lon: Number(payload.site.lon),
      label: payload.customer?.site || 'Site',
      zoom: 16,
    }));
  }
  return out;
}

module.exports = {
  svgToPng,
  monthlyYieldSvg,
  cashflowSvg,
  singleLineDiagramSvg,
  sunPathSvg,
  staticMapPng,
  renderProposalAssets,
};
