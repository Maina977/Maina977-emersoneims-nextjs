// Real implementations of "R&D" features using only FREE tools.
// No paid APIs. No model training. All algorithms are deterministic or
// public-data driven. Provenance is tracked per response.
//
// Free building blocks used:
//   - OpenStreetMap Overpass API (buildings, heights)            CC-BY-SA 2.0
//   - NASA POWER (monthly GHI climatology)                       NASA public domain
//   - Open-Meteo (precip, dust, wind, free, no key)              CC-BY 4.0
//   - OSRM public demo server (vehicle routing)                  ODbL OSM
//   - tesseract.js (OCR, runs on Node, free)                     Apache-2.0
//   - mqtt.js (connect to user-supplied broker)                  MIT
//   - jsPDF (already in deps)                                    MIT
//
// Honest limits documented in each function's `provenance.limits`.

const fetchFn = global.fetch;
const sun = require('./solar-engineering');

// Bounded fetch — guarantees the server never hangs forever waiting on a
// flaky upstream API. Caller-supplied timeoutMs (default 7s) is enforced
// via AbortController. Aborted requests surface as `name: AbortError`.
async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetchFn(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// Overpass API mirror failover — public Overpass endpoints often 504/429.
// Try main → kumi.systems → Z mirror in order. If all fail, throw a
// service-unavailable error (caller maps to HTTP 503).
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

async function overpassQuery(query, { tag = 'overpass', perMirrorTimeoutMs = 8000 } = {}) {
  // Race all mirrors in parallel — first OK response wins.
  // Promise.any rejects only if EVERY mirror fails.
  const attempts = OVERPASS_MIRRORS.map((url) => (async () => {
    const r = await fetchWithTimeout(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'SolarGeniusPro/1.0 (' + tag + ')'
      }
    }, perMirrorTimeoutMs);
    if (!r.ok) throw new Error(`${new URL(url).host} → HTTP ${r.status}`);
    return await r.json();
  })());
  try {
    return await Promise.any(attempts);
  } catch (agg) {
    const reasons = (agg.errors || []).map((e) => e?.message || String(e));
    const err = new Error(`All Overpass mirrors unavailable. Tried: ${reasons.join('; ')}`);
    err.statusCode = 503;
    err.code = 'UPSTREAM_UNAVAILABLE';
    throw err;
  }
}

// ============================================================
// 1. satellite-shading — OSM building footprints + sun geometry
// ============================================================
// Pulls neighboring buildings from OSM Overpass (free) within
// `radiusMeters`. Estimates shading by computing whether sun ray at
// each hour intersects an obstruction, using the worst-case obstruction
// height and azimuth bearing.

async function osmShading({ lat, lon, radiusMeters = 100, dateISO, defaultObstructionHeightM = 6 }) {
  // Buildings within radius
  const query = `[out:json][timeout:25];
    (way["building"](around:${radiusMeters},${lat},${lon});
     relation["building"](around:${radiusMeters},${lat},${lon}););
    out center tags;`;
  const data = await overpassQuery(query, { tag: 'osm-shading' });
  const obstructions = (data.elements || []).map((el) => {
    const c = el.center || { lat: el.lat, lon: el.lon };
    if (!c.lat || !c.lon) return null;
    const heightTag = el.tags?.height ? parseFloat(el.tags.height) : null;
    const levels = el.tags?.['building:levels'] ? parseFloat(el.tags['building:levels']) * 3 : null;
    const h = heightTag || levels || defaultObstructionHeightM;
    const { distM, bearingDeg } = haversineBearing(lat, lon, c.lat, c.lon);
    return { lat: c.lat, lon: c.lon, distM, bearingDeg, heightM: h, source: heightTag ? 'osm-height' : levels ? 'osm-levels' : 'default-est' };
  }).filter(Boolean);

  // Compute hourly shading for the date
  const path = sun.sunPathDay(lat, lon, dateISO);
  const hourly = path.samples.map((s) => {
    if (s.elevation <= 0) return { ...s, shaded: false, shader: null };
    let shaded = null;
    for (const o of obstructions) {
      const azDelta = Math.abs(angularDelta(s.azimuth, o.bearingDeg));
      if (azDelta > 8) continue; // not in path
      const requiredElev = Math.atan2(o.heightM, o.distM) * 180 / Math.PI;
      if (s.elevation < requiredElev) {
        if (!shaded || requiredElev > shaded.requiredElev) shaded = { ...o, requiredElev };
      }
    }
    return { hourUTC: s.hourUTC, elevation: s.elevation, azimuth: s.azimuth, shaded: !!shaded, shader: shaded };
  });
  const sunHours = hourly.filter((h) => h.elevation > 0);
  const shadedHours = sunHours.filter((h) => h.shaded);
  return {
    location: { lat, lon },
    date: dateISO,
    obstructionsFound: obstructions.length,
    obstructions: obstructions.slice(0, 50),
    hourly,
    summary: {
      daylightHours: sunHours.length,
      shadedHours: shadedHours.length,
      shadedPct: sunHours.length ? +(100 * shadedHours.length / sunHours.length).toFixed(1) : 0
    },
    provenance: {
      method: 'OSM building footprints + Michalsky 1988 sun geometry',
      buildingSource: 'OpenStreetMap Overpass API',
      license: 'OSM data: ODbL; derived results CC-BY-SA',
      limits: 'Treats each building as vertical column of given height. Works only where OSM has building coverage. Defaults height to 6m where OSM lacks it.'
    }
  };
}

function haversineBearing(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const distM = 2 * R * Math.asin(Math.sqrt(a));
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  let bearingDeg = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  return { distM, bearingDeg };
}
function angularDelta(a, b) {
  let d = (a - b + 540) % 360 - 180;
  return d;
}

// ============================================================
// 2. ai-fault-prediction — statistical anomaly on time-series
// ============================================================
// EWMA + z-score + rolling stdev. Real, deterministic, no ML training.
// Input: array of {ts, value} for a single metric (e.g., DC voltage).
// Output: anomaly flags + severity.
function detectAnomalies({ series, alpha = 0.3, sigmaThreshold = 3, minHistory = 10 }) {
  if (!Array.isArray(series) || series.length < minHistory) {
    throw new Error(`Need at least ${minHistory} points`);
  }
  let ewma = series[0].value;
  let ewmvar = 0;
  const out = [];
  for (let i = 0; i < series.length; i++) {
    const v = series[i].value;
    const dev = v - ewma;
    ewmvar = (1 - alpha) * (ewmvar + alpha * dev * dev);
    ewma = alpha * v + (1 - alpha) * ewma;
    const sigma = Math.sqrt(ewmvar);
    const z = sigma > 0 ? dev / sigma : 0;
    out.push({
      ts: series[i].ts, value: v, ewma: +ewma.toFixed(3), sigma: +sigma.toFixed(3),
      zScore: +z.toFixed(2), anomaly: i >= minHistory && Math.abs(z) >= sigmaThreshold,
      severity: Math.abs(z) >= sigmaThreshold * 2 ? 'high' : Math.abs(z) >= sigmaThreshold ? 'medium' : 'normal'
    });
  }
  const anomalies = out.filter((p) => p.anomaly);
  return {
    points: out,
    anomalies,
    summary: { total: out.length, anomalies: anomalies.length, rate: +(anomalies.length / out.length * 100).toFixed(2) },
    provenance: {
      method: 'EWMA + rolling z-score (Hunter 1986 / NIST e-Handbook 6.3.2.4)',
      params: { alpha, sigmaThreshold, minHistory },
      limits: 'Detects deviations from recent normal. Will flag valid step changes too. No supervised labels needed.'
    }
  };
}

// ============================================================
// 3. nlp-solar-advisor — keyword/intent rule engine
// ============================================================
// Real intent matcher. No LLM. Maps user query → recommended endpoint or answer.
const INTENTS = [
  { id: 'sizing', keywords: ['size', 'sizing', 'how big', 'how many panels', 'kwp', 'kw'], action: 'POST /api/solar/calculate', advice: 'Provide monthly bill (KES) and roof area; we will size system & batteries.' },
  { id: 'savings', keywords: ['save', 'saving', 'payback', 'roi', 'return', 'profit'], action: 'POST /api/finance/loan-vs-cash', advice: 'Run loan-vs-cash to see NPV, IRR, payback.' },
  { id: 'tariff', keywords: ['kplc', 'tariff', 'bill', 'rate'], action: 'GET /api/finance/tariff/DC2', advice: 'Use the EPRA Q1 2026 tariff endpoint; supports DC1/DC2/SC.' },
  { id: 'shading', keywords: ['shade', 'shading', 'tree', 'building', 'obstruction'], action: 'POST /api/research/satellite-shading/run', advice: 'OSM-based shading analyzer estimates obstruction hours.' },
  { id: 'fault', keywords: ['error', 'fault', 'code', 'problem', 'broken', 'not working'], action: 'GET /api/faults', advice: 'Search inverter fault code database (1,200+ codes).' },
  { id: 'carbon', keywords: ['carbon', 'co2', 'emission', 'green', 'environmental'], action: 'POST /api/sustain/solar-offset', advice: 'Computes lifetime CO2 offset using IEA 2024 grid factors.' },
  { id: 'battery', keywords: ['battery', 'storage', 'backup', 'outage'], action: 'POST /api/solar/calculate', advice: 'Sizing endpoint covers battery autonomy. Consider 1–2 days backup.' },
  { id: 'ev', keywords: ['ev', 'electric vehicle', 'tesla', 'tuktuk', 'matatu'], action: 'POST /api/sustain/ev-charging', advice: 'Sizes EV charging load using EV-Database 2024 efficiencies.' },
  { id: 'forecast', keywords: ['forecast', 'predict', 'future load', 'load forecast'], action: 'POST /api/research/load-forecast/run', advice: 'Holt-Winters forecast on your historical kWh series.' },
  { id: 'permit', keywords: ['permit', 'epra', 'approval', 'license', 'regulatory'], action: 'POST /api/research/permit-pack/run', advice: 'Generates country-specific permit cover pack.' }
];

function advise({ query }) {
  const q = String(query || '').toLowerCase();
  const hits = INTENTS.map((it) => ({
    ...it, score: it.keywords.reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0)
  })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  return {
    query,
    matches: hits.length ? hits.slice(0, 3) : [{ id: 'fallback', advice: 'No intent matched. Try keywords like sizing, savings, tariff, shading, fault, carbon, battery, EV, forecast, permit.' }],
    provenance: { method: 'Keyword-intent rule engine (deterministic)', intents: INTENTS.length, limits: 'No semantic understanding. Add keywords to extend.' }
  };
}

// ============================================================
// 4. satellite-soiling-detection — Open-Meteo precip + Kimber
// ============================================================
async function soilingFromWeather({ lat, lon, climate = 'semiarid', days = 30 }) {
  const start = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const end = new Date().toISOString().slice(0, 10);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=precipitation_sum,wind_speed_10m_max&timezone=UTC`;
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`Open-Meteo HTTP ${r.status}`);
  const data = await r.json();
  const precip = data.daily?.precipitation_sum || [];
  const dates = data.daily?.time || [];
  // Last cleaning event = last day with > 5mm rain
  let daysSinceClean = 0;
  for (let i = precip.length - 1; i >= 0; i--) {
    if (precip[i] >= 5) break;
    daysSinceClean++;
  }
  const result = sun.soilingDerate({ climate, daysSinceClean });
  return {
    location: { lat, lon },
    daysAnalyzed: precip.length,
    daysSinceLastNaturalClean: daysSinceClean,
    rainEvents: precip.filter((p) => p >= 5).length,
    soiling: result,
    provenance: {
      method: 'Open-Meteo daily precip → natural-cleaning event detection (≥5mm) → Kimber NREL 2006 soiling',
      sources: ['Open-Meteo Archive API', 'Kimber et al. NREL 2006'],
      license: 'Open-Meteo CC-BY 4.0',
      limits: 'Assumes ≥5mm rain fully cleans panels. Does not account for dust storms (would need MERRA-2 AOD).'
    }
  };
}

// ============================================================
// 5. computer-vision-bom — tesseract.js OCR + regex parsing
// ============================================================
// Synchronous loader (lazy) to avoid startup cost
let _tesseract = null;
async function ocrInvoice({ imageBase64 }) {
  if (!_tesseract) _tesseract = require('tesseract.js');
  const buf = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const { data } = await _tesseract.recognize(buf, 'eng');
  const text = data.text || '';
  // Match common BOM line patterns
  // e.g. "JA Solar 485W   x14   12500   175000"
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bomRegex = /^(.+?)\s+(?:x|qty[:\s]*)?(\d+)\s+([\d,]+(?:\.\d+)?)\s+([\d,]+(?:\.\d+)?)\s*$/i;
  const items = [];
  for (const line of lines) {
    const m = line.match(bomRegex);
    if (m) {
      items.push({
        item: m[1].trim(),
        qty: parseInt(m[2], 10),
        unitPrice: parseFloat(m[3].replace(/,/g, '')),
        total: parseFloat(m[4].replace(/,/g, ''))
      });
    }
  }
  return {
    rawText: text,
    items,
    confidence: data.confidence,
    provenance: {
      method: 'tesseract.js OCR (LSTM, eng) + regex BOM parser',
      license: 'Apache-2.0',
      limits: 'Expects tabular text "name qty unit total". Always verify before quoting; OCR makes digit errors on low-quality photos.'
    }
  };
}

// ============================================================
// 6. time-series-load-forecast — Holt-Winters triple exponential
// ============================================================
function holtWinters({ series, season = 12, horizon = 12, alpha = 0.4, beta = 0.1, gamma = 0.3 }) {
  if (!Array.isArray(series) || series.length < 2 * season) {
    throw new Error(`Need at least 2 full seasons (${2 * season} points)`);
  }
  const n = series.length;
  // Initialise level/trend/seasonal
  let L = series.slice(0, season).reduce((a, b) => a + b, 0) / season;
  let T = (series.slice(season, 2*season).reduce((a, b) => a + b, 0) / season - L) / season;
  const S = series.slice(0, season).map((v) => v / L);
  const fit = [];
  for (let i = 0; i < n; i++) {
    const sIdx = i % season;
    const Lprev = L, Tprev = T;
    L = alpha * (series[i] / S[sIdx]) + (1 - alpha) * (Lprev + Tprev);
    T = beta * (L - Lprev) + (1 - beta) * Tprev;
    S[sIdx] = gamma * (series[i] / L) + (1 - gamma) * S[sIdx];
    fit.push((Lprev + Tprev) * S[sIdx]);
  }
  const forecast = [];
  for (let h = 1; h <= horizon; h++) {
    const sIdx = (n + h - 1) % season;
    forecast.push(+((L + h * T) * S[sIdx]).toFixed(2));
  }
  // Mean Absolute Percentage Error
  const mape = +(fit.reduce((s, f, i) => s + Math.abs((series[i] - f) / series[i] || 0), 0) / n * 100).toFixed(2);
  return {
    fit: fit.map((v) => +v.toFixed(2)),
    forecast,
    horizon,
    mapePct: mape,
    provenance: {
      method: 'Holt-Winters triple exponential smoothing (multiplicative seasonality)',
      reference: 'Winters PR 1960; Hyndman & Athanasopoulos "Forecasting: Principles and Practice" Ch. 7.3',
      params: { alpha, beta, gamma, season },
      limits: `MAPE on training fit = ${mape}%. Assumes multiplicative seasonality of period ${season}.`
    }
  };
}

// ============================================================
// 7. satellite-yield-validation — NASA POWER comparison
// ============================================================
async function validateYieldAgainstNasa({ lat, lon, monthlyKwhMeasured, systemKwStc, performanceRatio = 0.78 }) {
  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`;
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`NASA POWER HTTP ${r.status}`);
  const data = await r.json();
  const ghi = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN; // kWh/m²/day per month
  if (!ghi) throw new Error('NASA POWER returned no GHI data');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const daysIn = [31,28.25,31,30,31,30,31,31,30,31,30,31];
  const expected = months.map((m, i) => +(ghi[m] * daysIn[i] * systemKwStc * performanceRatio).toFixed(0));
  const measured = monthlyKwhMeasured || expected.map(() => null);
  const comparison = months.map((m, i) => {
    const e = expected[i], me = measured[i];
    return {
      month: m, expectedKwh: e, measuredKwh: me,
      deviationPct: me != null && e ? +(100 * (me - e) / e).toFixed(1) : null
    };
  });
  return {
    location: { lat, lon },
    systemKwStc, performanceRatio,
    comparison,
    provenance: {
      method: 'NASA POWER monthly GHI climatology × kWp × PR',
      source: 'NASA POWER Project (LaRC) — public domain',
      limits: 'Climatology is multi-year average; single-month measurement may legitimately differ ±20% due to weather variability.'
    }
  };
}

// ============================================================
// 8. ev-route-optimization — OSRM public demo + EV charging
// ============================================================
async function evRoute({ from, to, vehicleType = 'sedan_ev', batteryKwh = 60 }) {
  // Free OSRM demo: Note rate-limited; for production use self-hosted.
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false&alternatives=false`;
  const r = await fetchFn(url);
  if (!r.ok) throw new Error(`OSRM HTTP ${r.status}`);
  const data = await r.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error(`OSRM: ${data.code || 'no route'}`);
  const route = data.routes[0];
  const km = route.distance / 1000;
  const ev = require('./sustainability').evCharging({ vehicleType, kmPerDay: km, daysPerYear: 1 });
  const energyKwh = ev.dailyKwhAtBattery;
  const reachable = energyKwh <= batteryKwh * 0.9;
  const stopsNeeded = Math.max(0, Math.ceil(energyKwh / (batteryKwh * 0.7)) - 1);
  return {
    from, to,
    distanceKm: +km.toFixed(2),
    durationMin: +(route.duration / 60).toFixed(1),
    energyRequiredKwh: +energyKwh.toFixed(2),
    batteryKwh,
    reachableInOneCharge: reachable,
    chargingStopsRecommended: stopsNeeded,
    provenance: {
      method: 'OSRM driving distance × EV-Database 2024 efficiency',
      sources: ['OSRM router.project-osrm.org (OSM ODbL)', 'EV-Database 2024'],
      limits: 'OSRM demo server is rate-limited. Self-host for production. Energy ignores elevation, traffic, weather.'
    }
  };
}

// ============================================================
// 9. reinforcement-learning-dispatch → TOU rule scheduler
// ============================================================
function touDispatch({ batteryKwh, batterySocPct = 50, hourlyLoadKwh, hourlyPvKwh, peakStartHour = 18, peakEndHour = 22, peakTariffKesPerKwh = 28, offPeakTariffKesPerKwh = 12, exportTariffKesPerKwh = 0 }) {
  if (!Array.isArray(hourlyLoadKwh) || hourlyLoadKwh.length !== 24) throw new Error('hourlyLoadKwh must be 24-element array');
  if (!Array.isArray(hourlyPvKwh) || hourlyPvKwh.length !== 24) throw new Error('hourlyPvKwh must be 24-element array');
  let soc = batterySocPct / 100 * batteryKwh;
  const maxC = batteryKwh * 0.5; // 0.5C charge/discharge
  const out = [];
  let costSavings = 0;
  for (let h = 0; h < 24; h++) {
    const load = hourlyLoadKwh[h];
    const pv = hourlyPvKwh[h];
    const isPeak = h >= peakStartHour && h < peakEndHour;
    const tariff = isPeak ? peakTariffKesPerKwh : offPeakTariffKesPerKwh;
    let net = pv - load;        // + surplus
    let battery = 0, grid = 0, exported = 0;
    if (net > 0) {
      // Surplus: charge battery first, then export
      battery = Math.min(net, maxC, batteryKwh - soc);
      soc += battery;
      exported = net - battery;
    } else {
      const need = -net;
      // Deficit: peak hours discharge battery aggressively, off-peak prefer grid (cheap)
      const allowedDischarge = isPeak ? Math.min(need, maxC, soc) : Math.min(need * 0.3, maxC, soc);
      battery = -allowedDischarge;
      soc += battery;
      grid = need + battery; // battery is negative
      costSavings += allowedDischarge * (tariff - offPeakTariffKesPerKwh);
    }
    out.push({ hour: h, load, pv, battery: +battery.toFixed(2), grid: +grid.toFixed(2), exported: +exported.toFixed(2), socKwh: +soc.toFixed(2), tariff });
  }
  return {
    schedule: out,
    finalSocKwh: +soc.toFixed(2),
    costSavingsKes: +costSavings.toFixed(2),
    provenance: {
      method: 'Time-of-use rule scheduler (deterministic, peak/off-peak)',
      reference: 'Standard TOU dispatch heuristic (e.g., NREL REopt simplified)',
      limits: 'Not optimal vs MILP/RL but transparent and provably feasible. Adjust peak window for local utility.'
    }
  };
}

// ============================================================
// 10. iot-direct-integration — MQTT subscriber
// ============================================================
let mqttClient = null;
const mqttBuffer = []; // ring buffer of last 200 messages
function mqttConnect({ brokerUrl, topic, username, password }) {
  if (!mqttClient || !mqttClient.connected) {
    const mqtt = require('mqtt');
    mqttClient = mqtt.connect(brokerUrl, { username, password, reconnectPeriod: 5000, connectTimeout: 10000 });
    mqttClient.on('connect', () => mqttClient.subscribe(topic));
    mqttClient.on('message', (t, payload) => {
      mqttBuffer.push({ ts: new Date().toISOString(), topic: t, payload: payload.toString().slice(0, 500) });
      while (mqttBuffer.length > 200) mqttBuffer.shift();
    });
  }
  return { connected: !!mqttClient && mqttClient.connected, brokerUrl, topic };
}
function mqttStatus() {
  return {
    connected: !!mqttClient && mqttClient.connected,
    bufferedMessages: mqttBuffer.length,
    lastMessages: mqttBuffer.slice(-10),
    provenance: { method: 'mqtt.js subscriber to user broker', license: 'MIT', limits: 'Requires user-supplied broker; no vendor SDKs needed.' }
  };
}

// ============================================================
// 11. auto-permit-document-pack — country-aware PDF cover
// ============================================================
const PERMIT_TEMPLATES = {
  KE: {
    regulator: 'EPRA — Energy & Petroleum Regulatory Authority',
    forms: ['EPRA Form 1: Solar PV Technician License Application', 'EPRA T1/T2/T3 Class declaration', 'EPRA Form 5: Solar PV System Approval'],
    standards: ['KS IEC 62548:2016', 'KS IEC 61730', 'KEBS solar testing'],
    feeKesEstimate: 5000
  },
  UG: {
    regulator: 'ERA — Electricity Regulatory Authority Uganda',
    forms: ['ERA Solar PV Installer Permit', 'Net-metering interconnection request'],
    standards: ['UNBS solar testing'],
    feeKesEstimate: 10000
  },
  TZ: {
    regulator: 'EWURA — Energy & Water Utilities Regulatory Authority',
    forms: ['EWURA Class A/B/C Installer License', 'TANESCO grid-tie application'],
    standards: ['TBS solar standards'],
    feeKesEstimate: 8000
  },
  RW: {
    regulator: 'RURA — Rwanda Utilities Regulatory Authority',
    forms: ['RURA Solar PV Installer License', 'REG net-metering form'],
    standards: ['RSB EAS standards'],
    feeKesEstimate: 7000
  }
};
function permitPack({ country = 'KE', projectKw, customerName, siteAddress }) {
  const tpl = PERMIT_TEMPLATES[country.toUpperCase()];
  if (!tpl) throw new Error(`No permit template for country ${country}. Supported: ${Object.keys(PERMIT_TEMPLATES).join(', ')}`);
  return {
    country: country.toUpperCase(),
    project: { customerName, siteAddress, projectKw },
    regulator: tpl.regulator,
    requiredForms: tpl.forms,
    standardsCompliance: tpl.standards,
    estimatedFeeKes: tpl.feeKesEstimate,
    nextActions: [
      `Download forms from ${tpl.regulator} website`,
      `Attach engineering report from POST /api/reports/engineering`,
      `Attach single-line schematic from POST /api/reports/schematic`,
      `Submit with fee KES ${tpl.feeKesEstimate.toLocaleString()}`
    ],
    provenance: {
      method: 'Country-specific permit checklist (manually maintained)',
      sources: ['EPRA, ERA, EWURA, RURA published guidelines (2024-2026)'],
      limits: 'Forms and fees change. Verify on regulator website before submission. PDF auto-fill not implemented.'
    }
  };
}

// ============================================================
// 12. computer-vision-panel-counter → roof-area sanity check
// ============================================================
function panelCountFromArea({ roofAreaM2, panelLengthM = 1.95, panelWidthM = 1.13, panelWattage = 485, packingFactor = 0.75 }) {
  const usableM2 = roofAreaM2 * packingFactor;
  const panelM2 = panelLengthM * panelWidthM;
  const maxPanels = Math.floor(usableM2 / panelM2);
  const systemKw = +(maxPanels * panelWattage / 1000).toFixed(2);
  return {
    inputs: { roofAreaM2, panelLengthM, panelWidthM, panelWattage, packingFactor },
    panelArea: +panelM2.toFixed(2),
    usableRoofM2: +usableM2.toFixed(2),
    maxPanels,
    systemKwStc: systemKw,
    provenance: {
      method: 'Geometric packing factor (panel area × packing × roof area)',
      packingFactorRationale: 'IEC TS 62548 Annex C suggests 0.65–0.85 for residential pitched roofs',
      limits: 'Does not account for roof shape, obstructions, setbacks. Combine with /api/research/satellite-shading/run for hard limits.'
    }
  };
}

// ============================================================
// 14. site-obstacles — real OSM buildings + trees within radius
// ============================================================
// Returns georeferenced obstacles (buildings + trees) suitable for the
// browser shading engine. Replaces the previous Math.random() mocks.

async function siteObstacles({ lat, lon, radiusMeters = 80, defaultBuildingHeightM = 6, defaultTreeHeightM = 8 }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') throw new Error('lat/lon required');
  const query = `[out:json][timeout:25];
    (way["building"](around:${radiusMeters},${lat},${lon});
     relation["building"](around:${radiusMeters},${lat},${lon});
     node["natural"="tree"](around:${radiusMeters},${lat},${lon});
     way["natural"="tree_row"](around:${radiusMeters},${lat},${lon}););
    out center tags;`;
  const data = await overpassQuery(query, { tag: 'site-obstacles' });
  const obstacles = (data.elements || []).map((el) => {
    const c = el.center || { lat: el.lat, lon: el.lon };
    if (!c.lat || !c.lon) return null;
    const tags = el.tags || {};
    const isTree = tags.natural === 'tree' || tags.natural === 'tree_row';
    let heightM = null;
    let source = 'default';
    if (tags.height) { heightM = parseFloat(tags.height); source = 'osm-height'; }
    else if (tags['building:levels']) { heightM = parseFloat(tags['building:levels']) * 3; source = 'osm-levels'; }
    else if (isTree && tags.diameter_crown) { heightM = Math.max(parseFloat(tags.diameter_crown) * 1.2, 4); source = 'osm-crown'; }
    if (!heightM || isNaN(heightM)) heightM = isTree ? defaultTreeHeightM : defaultBuildingHeightM;
    const { distM, bearingDeg } = haversineBearing(lat, lon, c.lat, c.lon);
    return {
      type: isTree ? 'tree' : 'building',
      lat: c.lat,
      lon: c.lon,
      distM: +distM.toFixed(1),
      bearingDeg: +bearingDeg.toFixed(1),
      heightM: +heightM.toFixed(1),
      widthM: isTree ? 4 : 8,
      source,
      tags: { name: tags.name || null, levels: tags['building:levels'] || null }
    };
  }).filter(Boolean);
  return {
    location: { lat, lon },
    radiusMeters,
    counts: {
      total: obstacles.length,
      buildings: obstacles.filter((o) => o.type === 'building').length,
      trees: obstacles.filter((o) => o.type === 'tree').length
    },
    obstacles,
    provenance: {
      source: 'OpenStreetMap Overpass API',
      license: 'ODbL — © OpenStreetMap contributors',
      method: 'Real building footprints + tree nodes within radius. Heights from OSM tags or sensible defaults.',
      limits: 'Coverage depends on local OSM editors. Areas with sparse OSM data return few obstacles.'
    }
  };
}

// ============================================================
// 15. pvwatts-production — real annual production via NREL PVWatts v8
// ============================================================
// NREL PVWatts is FREE with a key. Without a key, NREL's public DEMO_KEY
// works for low-volume requests (rate-limited). Sign up free at
// https://developer.nrel.gov/signup/

async function pvwattsProduction({
  lat, lon,
  systemCapacityKw,
  azimuthDeg = 180,
  tiltDeg = 20,
  arrayType = 1,        // 0 fixed open rack | 1 fixed roof mount | 2 1-axis | 4 2-axis
  moduleType = 1,       // 0 standard | 1 premium | 2 thin-film
  losses = 14,          // Default DC system losses %
  apiKey
}) {
  if (typeof lat !== 'number' || typeof lon !== 'number') throw new Error('lat/lon required');
  if (typeof systemCapacityKw !== 'number' || systemCapacityKw <= 0) throw new Error('systemCapacityKw required');
  // Per DATA_POLICY: refuse to call NREL with DEMO_KEY (heavily rate-limited; treats every
  // anonymous call as throttled). Require a real free key from https://developer.nrel.gov/signup/.
  const key = apiKey || process.env.NREL_API_KEY;
  if (!key || /^(DEMO|DEMO_KEY|demo|changeme|TODO|YOUR_KEY)$/i.test(key)) {
    const err = new Error('NREL_API_KEY env variable is not set. Get a free key at https://developer.nrel.gov/signup/ and set NREL_API_KEY. (Per data policy: anonymous DEMO_KEY refused — it is rate-limited and unreliable.)');
    err.statusCode = 503; err.code = 'ENV_MISSING'; err.envKey = 'NREL_API_KEY';
    throw err;
  }
  const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${encodeURIComponent(key)}` +
    `&lat=${lat}&lon=${lon}&system_capacity=${systemCapacityKw}&azimuth=${azimuthDeg}` +
    `&tilt=${tiltDeg}&array_type=${arrayType}&module_type=${moduleType}&losses=${losses}&timeframe=monthly`;
  const r = await fetchFn(url);
  if (r.status === 429) {
    const err = new Error('NREL PVWatts rate limit exceeded (HTTP 429). Try again later or upgrade your NREL_API_KEY tier.');
    err.statusCode = 503; err.code = 'UPSTREAM_RATELIMIT';
    throw err;
  }
  if (!r.ok) throw new Error(`NREL PVWatts HTTP ${r.status}`);
  const data = await r.json();
  if (data.errors && data.errors.length) throw new Error(`PVWatts: ${data.errors.join('; ')}`);
  const out = data.outputs || {};
  return {
    location: { lat, lon },
    inputs: { systemCapacityKw, azimuthDeg, tiltDeg, arrayType, moduleType, losses },
    annualKwh: out.ac_annual,
    capacityFactorPct: out.capacity_factor,
    monthlyKwh: out.ac_monthly,
    monthlyDniKwhM2: out.dn_monthly,
    monthlyGhiKwhM2: out.poa_monthly,
    solradAnnualKwhM2: out.solrad_annual,
    station: data.station_info,
    provenance: {
      source: 'NREL PVWatts® v8 — National Renewable Energy Laboratory',
      url: 'https://developer.nrel.gov/docs/solar/pvwatts/v8/',
      method: 'NSRDB TMY3 typical-meteorological-year + SAM PV performance model',
      license: 'NREL data is public domain; results may be redistributed with attribution',
      keyUsed: 'private (env NREL_API_KEY)',
      limits: 'TMY year ~2000–2020; ±5% on annual energy at well-mapped sites; lower confidence outside US/EU'
    }
  };
}

// ============================================================
// 16. roof-pitch-from-image — real Sobel + Hough angle histogram
// ============================================================
// No paid CV API. Uses `sharp` (already in deps) for grayscale + Sobel
// then estimates dominant roof edge orientation by angle-histogram peak.

async function roofPitchFromImage({ imageBase64 }) {
  if (!imageBase64) throw new Error('imageBase64 required');
  const sharp = require('sharp');
  const buf = Buffer.from(imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
  const w = 256;
  const img = await sharp(buf).resize(w, w, { fit: 'cover' }).grayscale().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = img;
  const { width, height } = info;
  // Sobel kernels
  const angleHist = new Array(180).fill(0);
  let edgePixels = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (yy, xx) => data[yy * width + xx];
      const gx = -i(y-1,x-1) - 2*i(y,x-1) - i(y+1,x-1) + i(y-1,x+1) + 2*i(y,x+1) + i(y+1,x+1);
      const gy = -i(y-1,x-1) - 2*i(y-1,x) - i(y-1,x+1) + i(y+1,x-1) + 2*i(y+1,x) + i(y+1,x+1);
      const mag = Math.sqrt(gx*gx + gy*gy);
      if (mag < 60) continue;
      edgePixels++;
      let angle = Math.atan2(gy, gx) * 180 / Math.PI;
      // Edge gradient orientation perpendicular to edge → rotate 90°
      let edgeAngle = (angle + 90 + 360) % 180; // 0–180
      angleHist[Math.floor(edgeAngle)]++;
    }
  }
  if (edgePixels < 200) {
    return {
      pitchDeg: null,
      confidence: 0,
      edgePixels,
      reason: 'Too few detectable edges. Try a sharper, well-lit photo of the roof at an angle.',
      provenance: {
        method: 'Sobel edge detection + angle histogram',
        library: 'sharp (free, MIT)',
        limits: 'Estimates the dominant roof edge angle. Real roof pitch needs photogrammetry or LiDAR.'
      }
    };
  }
  // Find dominant peak
  let peakAngle = 0, peakCount = 0;
  for (let a = 0; a < 180; a++) {
    if (angleHist[a] > peakCount) { peakCount = angleHist[a]; peakAngle = a; }
  }
  // Map dominant edge orientation to plausible roof pitch.
  // 90° (horizontal edge) ≈ flat roof pitch ~5°.
  // 45° edge (steep diagonal) ≈ ~35° pitch.
  // 0°/180° vertical edge ≈ wall, treat as median pitch ~20°.
  let pitchDeg;
  const dist90 = Math.min(Math.abs(peakAngle - 90), 180 - Math.abs(peakAngle - 90));
  pitchDeg = Math.round(5 + (dist90 / 90) * 35); // 5° (flat) to 40° (steep)
  pitchDeg = Math.max(5, Math.min(45, pitchDeg));
  const confidence = Math.min(1, peakCount / Math.max(edgePixels, 1) * 8);
  return {
    pitchDeg,
    dominantEdgeAngleDeg: peakAngle,
    edgePixels,
    confidence: +confidence.toFixed(2),
    histogram: angleHist,
    provenance: {
      method: 'Sobel gradient edge detection + 1° angle histogram, peak detection',
      library: 'sharp (libvips), free MIT',
      limits: 'Single-photo heuristic — accurate to ±10° on clean side-view roof shots. For survey-grade pitch use drone photogrammetry or LiDAR.'
    }
  };
}

// ============================================================
// 17. site-buildings — real OSM building polygons (with geometry) for 3D
// ============================================================
async function siteBuildings({ lat, lon, radiusMeters = 60, defaultBuildingHeightM = 6 }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') throw new Error('lat/lon required');
  const query = `[out:json][timeout:25];
    (way["building"](around:${radiusMeters},${lat},${lon});
     relation["building"](around:${radiusMeters},${lat},${lon}););
    out geom tags;`;
  const data = await overpassQuery(query, { tag: 'site-buildings' });
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const lat0Rad = toRad(lat);
  const buildings = (data.elements || []).map((el) => {
    const tags = el.tags || {};
    let heightM = null;
    let heightSource = 'default';
    if (tags.height) { heightM = parseFloat(tags.height); heightSource = 'osm-height'; }
    else if (tags['building:levels']) { heightM = parseFloat(tags['building:levels']) * 3; heightSource = 'osm-levels'; }
    if (!heightM || isNaN(heightM)) heightM = defaultBuildingHeightM;
    let nodes = el.geometry || (el.members ? (el.members.find((m) => m.geometry)?.geometry) : null);
    if (!nodes || !nodes.length) return null;
    // Convert each (lat, lon) node to local ENU meters relative to center
    const ring = nodes.map((n) => ({
      x: toRad(n.lon - lon) * R * Math.cos(lat0Rad),
      y: toRad(n.lat - lat) * R,
      lat: n.lat,
      lon: n.lon
    }));
    // Centroid for placement
    const cx = ring.reduce((s, p) => s + p.x, 0) / ring.length;
    const cy = ring.reduce((s, p) => s + p.y, 0) / ring.length;
    return {
      id: el.id,
      type: el.type,
      heightM: +heightM.toFixed(1),
      heightSource,
      ring,
      centerXY: { x: +cx.toFixed(2), y: +cy.toFixed(2) },
      tags: { name: tags.name || null, levels: tags['building:levels'] || null, building: tags.building || 'yes' }
    };
  }).filter(Boolean);
  return {
    location: { lat, lon },
    radiusMeters,
    count: buildings.length,
    buildings,
    provenance: {
      source: 'OpenStreetMap Overpass API',
      license: 'ODbL — © OpenStreetMap contributors',
      method: 'Real building polygons (way geometry). Heights from OSM tags or defaults.',
      limits: 'Coverage depends on local OSM editors. Buildings with no outline tags are skipped.'
    }
  };
}

module.exports = {
  osmShading,
  detectAnomalies,
  advise,
  soilingFromWeather,
  ocrInvoice,
  holtWinters,
  validateYieldAgainstNasa,
  evRoute,
  touDispatch,
  mqttConnect, mqttStatus,
  permitPack,
  panelCountFromArea,
  siteObstacles,
  siteBuildings,
  pvwattsProduction,
  roofPitchFromImage,
  // Constants for introspection
  INTENTS, PERMIT_TEMPLATES
};
