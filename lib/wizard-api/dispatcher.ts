/**
 * Building Suite Pro — wizard API dispatcher
 *
 * Single entry point for all /api/* paths consumed by the legacy Flask
 * wizard now mounted at /pro-building-suite. Each prefix has a thin
 * Next.js catch-all route that calls dispatch() below.
 *
 * Categories of handler:
 *   1. REAL — pure engineering math implemented from authoritative codes
 *      (Eurocode, ASCE 7, Terzaghi, Kirpich, etc.).
 *   2. REAL DATA — site context from OpenStreetMap and NASA POWER.
 *   3. NOT AVAILABLE — stub() answers HTTP 501, success:false, with the
 *      engineer's number. Never success:true for something not computed.
 *
 * Per data-policy: NEVER invent values, and never default a missing input:
 * calculators answer 400 naming the missing field (2026-10-18 tool audit).
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchOsmSite } from '@/lib/site/osmSite';
import { fetchNasaSun, DAYS_IN_MONTH } from '@/lib/solar/nasa';
import { poaMonthly } from '@/lib/solar/poa';
import * as calcs from './buildingCalcs';

/** Run a calculator: 400 naming the missing/invalid input, else ok(). */
// Option values index lookup tables, where "constructor" finds a built-in and
// gave NaN or a 500 (audit 2026-10-31). No real input is one of these names.
const BUILTIN_NAMES = new Set(Object.getOwnPropertyNames(Object.prototype));
function calc(fn: (b: calcs.Body) => unknown, body: calcs.Body) {
  for (const [k, v] of Object.entries(body ?? {})) {
    if (typeof v === 'string' && BUILTIN_NAMES.has(v)) {
      return NextResponse.json({ success: false, ok: false, error: `Invalid input: ${k}`, missing: [k] }, { status: 400 });
    }
  }
  const out = calcs.runCalc(fn, body);
  if (calcs.isCalcError(out)) {
    return NextResponse.json({ success: false, ok: false, error: out.error, missing: out.missing ?? [] }, { status: 400 });
  }
  return ok(out);
}

const ok = (data: unknown, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ success: true, ok: true, data, ...extra });

/*
 * Not-yet-built endpoints answer 501 with success:false (2026-10-18 tool
 * audit). They used to answer success:true + empty data + "backend will be
 * enabled in next release", so screens showed "Ready ✓", "0 risks" or a
 * BOQ total of 0 as if they were results. `shape` is kept in the response so
 * existing clients that read data.* do not crash, but nothing claims success.
 */
const stub = (path: string, shape: unknown = {}) =>
  NextResponse.json(
    {
      success: false,
      ok: false,
      error: 'not_available',
      message: 'This calculation is not available online yet. Talk to an EmersonEIMS engineer: 0768 860 665.',
      data: shape,
      _path: path,
    },
    { status: 501, headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
  );

/** A coordinate, or NaN when absent or blank (Number('') is 0: ?lat=&lon= answered for 0,0; 2026-10-20). */
const coordNum = (v: unknown): number => (v == null || String(v).trim() === '' ? NaN : Number(v));

const fail = (message: string, status = 502) =>
  NextResponse.json({ success: false, ok: false, error: message }, { status });

async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  // Hard cap on JSON body size to prevent memory-exhaustion abuse via the
  // open dispatcher endpoints. 1 MB is well above any legitimate calc input.
  const MAX_BYTES = 1_000_000;
  const cl = parseInt(req.headers.get('content-length') || '0', 10);
  if (cl > MAX_BYTES) return {};
  // Skip multipart/form-data uploads — those hit the /api/site/upload stub
  // path and are handled elsewhere (the stub doesn't read the body).
  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return {};
  try {
    const parsed = await req.json();
    // `null`, a number or an array is valid JSON but not a set of inputs
    // (2026-10-25 audit: a `null` body crashed with an empty 500).
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { __invalidJson: true };
    return parsed as Record<string, unknown>;
  } catch {
    // Malformed JSON is reported as such, not as a missing field (2026-10-20).
    return { __invalidJson: true };
  }
}

const num = (v: unknown, d = 0): number => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : d;
};

// ──────────────────────────────────────────────────────────────────────────
// REAL engineering math
// ──────────────────────────────────────────────────────────────────────────

// The architecture / structures / geotechnics / hydrology calculators live in
// ./buildingCalcs.ts (2026-10-19 tool audit): they read the keys the Building
// Suite screens send and answer 400 for a missing input instead of computing
// from defaults.

// ──────────────────────────────────────────────────────────────────────────
// SolarGeniusPro REAL math (restored from archived Flask logic)
// All formulas below are deterministic and traceable to authoritative sources.
// Where a backend feature genuinely needs ML/PDF/Excel servers, we return an
// honest empty envelope with a `note` field — never fabricated values.
// ──────────────────────────────────────────────────────────────────────────

/** A required number within a range, else a 400 naming the field (thrown as
 *  BadInput and turned into the 400 by calc()). These used to fall back to
 *  defaults such as a 12% loan rate or a 10 m / 10 A cable (2026-10-30 audit). */
function need(b: Record<string, unknown>, key: string, ok: (x: number) => boolean, rule: string): number {
  const v = b[key];
  const x = typeof v === 'number' ? v : typeof v === 'string' && /^\s*[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?\s*$/.test(v) ? Number(v) : NaN;
  if (v === undefined || v === null || v === '') throw new calcs.BadInput(key, `Missing input: ${key} (${rule})`);
  if (!Number.isFinite(x) || !ok(x)) throw new calcs.BadInput(key, `Invalid input: ${key} must be ${rule}`);
  return x;
}
function cashFlows(b: Record<string, unknown>): number[] {
  const cf = b.cashFlows;
  if (!Array.isArray(cf) || cf.length < 1 || cf.length > 200 || !cf.every((x) => typeof x === 'number' && Number.isFinite(x) && Math.abs(x) < 1e13)) {
    throw new calcs.BadInput('cashFlows', 'Invalid input: cashFlows must be an array of 1 to 200 numbers (year 0 first)');
  }
  return cf as number[];
}

/** Net Present Value: NPV = Σ CF_t / (1+r)^t  (t = 0..n). */
function financeNpv(b: Record<string, unknown>) {
  const r = need(b, 'discountRate', (x) => x > -0.99 && x <= 1, 'a decimal rate between -0.99 and 1 (0.10 = 10%)');
  const cf = cashFlows(b);
  let npv = 0;
  for (let t = 0; t < cf.length; t++) npv += num(cf[t], 0) / Math.pow(1 + r, t);
  return { npv: +npv.toFixed(2), discountRate: r, periods: cf.length, source: 'Standard NPV (textbook)' };
}

/** Internal Rate of Return via bisection on NPV(r)=0. Bracket [-0.99, 10]. */
function financeIrr(b: Record<string, unknown>) {
  const cf = cashFlows(b);
  if (cf.length < 2) return { irr: null, note: 'Need at least two cash flows' };
  const npv = (r: number) => {
    let s = 0;
    for (let t = 0; t < cf.length; t++) s += num(cf[t], 0) / Math.pow(1 + r, t);
    return s;
  };
  let lo = -0.9999, hi = 10, fLo = npv(lo), fHi = npv(hi);
  if (fLo * fHi > 0) return { irr: null, note: 'No sign change in [-0.99, 10] — IRR not bracketed' };
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-7) return { irr: +(mid * 100).toFixed(4), units: 'percent', source: 'Bisection on NPV' };
    if (fMid * fLo < 0) { hi = mid; fHi = fMid; } else { lo = mid; fLo = fMid; }
  }
  return { irr: +(((lo + hi) / 2) * 100).toFixed(4), units: 'percent', source: 'Bisection on NPV' };
}

/** Standard amortizing loan: M = P*r/(1-(1+r)^-n)  (r monthly). */
function financeLoan(b: Record<string, unknown>) {
  const P = need(b, 'principal', (x) => x > 0 && x <= 1e12, 'a loan amount greater than 0');
  const annual = need(b, 'annualRate', (x) => x >= 0 && x <= 1, 'a decimal annual rate between 0 and 1 (0.14 = 14%)');
  const years = need(b, 'years', (x) => x > 0 && x <= 40, 'a term between 0 and 40 years');
  const r = annual / 12;
  const n = years * 12;
  const M = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
  const totalPaid = M * n;
  return {
    monthlyPayment: +M.toFixed(2),
    totalPaid: +totalPaid.toFixed(2),
    totalInterest: +(totalPaid - P).toFixed(2),
    months: n,
    source: 'Standard amortization formula',
  };
}

/** Inflation: future = base * (1+i)^n. */
function financeInflation(b: Record<string, unknown>) {
  const base = need(b, 'baseAmount', (x) => x >= 0 && x <= 1e13, 'an amount of 0 or more');
  const i = need(b, 'inflationRate', (x) => x > -0.5 && x <= 1, 'a decimal rate between -0.5 and 1');
  const n = need(b, 'years', (x) => x >= 0 && x <= 100, 'between 0 and 100 years');
  const future = base * Math.pow(1 + i, n);
  return { future: +future.toFixed(2), base, rate: i, years: n, source: 'Compound inflation formula' };
}

/** Margin: (price - cost) / price * 100. */
function financeMargin(b: Record<string, unknown>) {
  const cost = need(b, 'cost', (x) => x >= 0 && x <= 1e13, 'an amount of 0 or more');
  const price = need(b, 'sellingPrice', (x) => x > 0 && x <= 1e13, 'an amount greater than 0');
  const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
  const markup = cost > 0 ? ((price - cost) / cost) * 100 : 0;
  return { marginPct: +margin.toFixed(2), markupPct: +markup.toFixed(2), profit: +(price - cost).toFixed(2) };
}

/** DC voltage drop: Vd = 2 * L * I * ρ / A  (single conductor pair). */
function solarVoltageDrop(b: Record<string, unknown>) {
  const L = need(b, 'length_m', (x) => x > 0 && x <= 5000, 'the one-way cable length in m (0 to 5,000)');
  const I = need(b, 'current_A', (x) => x > 0 && x <= 5000, 'the current in A (0 to 5,000)');
  const A_mm2 = need(b, 'area_mm2', (x) => x >= 0.5 && x <= 1000, 'the conductor area in mm² (0.5 to 1,000)');
  // Copper at 20 °C unless stated (said in the source line below).
  const rho = b.resistivity_ohm_mm2_per_m == null ? 0.0175 : need(b, 'resistivity_ohm_mm2_per_m', (x) => x > 0.01 && x < 0.1, 'between 0.01 and 0.1 Ω·mm²/m');
  const isThreePhase = !!b.threePhase;
  const factor = isThreePhase ? Math.sqrt(3) : 2;
  const A_m2 = A_mm2 / 1e6;
  const Vd = (factor * L * I * (rho / 1e6)) / A_m2;
  // Simpler equivalent: Vd = factor * L * I * rho_per_mm2_per_m / A_mm2
  const Vd_simple = (factor * L * I * rho) / A_mm2;
  return {
    voltageDrop_V: +Vd_simple.toFixed(3),
    voltageDropAlt_V: +Vd.toFixed(3),
    method: isThreePhase ? '3-phase (√3)' : 'DC / 1-phase (×2)',
    source: 'Ohm\'s law with copper ρ = 0.0175 Ω·mm²/m @ 20°C (IEC 60228)',
  };
}

/** Sun position for /api/solar/sun-position (NOAA equations, buildingCalcs). */
function solarSunPosition(lat: number, lon: number, isoTime?: string) {
  const date = isoTime ? new Date(isoTime) : new Date();
  return calcs.sunPositionAt(lat, lon, Number.isNaN(date.getTime()) ? new Date() : date);
}

/** Kenya grid emission factor (EPRA 2024 published mix: 89% renewable, 11% thermal).
 *  https://www.epra.go.ke — Energy & Petroleum Statistics Report 2024. */
const COUNTRY_GRID_EF_KG_PER_KWH: Record<string, number> = {
  KE: 0.21,  // EPRA 2024
  TZ: 0.41,  // IEA 2023
  UG: 0.06,  // IEA 2023 (predominantly hydro)
  RW: 0.32,  // IEA 2023
  NG: 0.43,  // IEA 2023
  ZA: 0.95,  // Eskom 2023
  US: 0.37,  // EIA 2023
  EU: 0.25,  // EEA 2023 average
  GB: 0.21,  // BEIS 2023
};

function sustainCarbonFootprint(b: Record<string, unknown>) {
  const annualKwh = need(b, 'annualKwh', (x) => x >= 0 && x <= 1e10, 'annual kWh, 0 or more');
  const country = (b.country as string) || 'KE';
  const ef = COUNTRY_GRID_EF_KG_PER_KWH[country] ?? COUNTRY_GRID_EF_KG_PER_KWH.KE;
  const kgCO2 = annualKwh * ef;
  return {
    annualKgCO2: +kgCO2.toFixed(1),
    annualTonnesCO2: +(kgCO2 / 1000).toFixed(3),
    emissionFactor: ef,
    country,
    source: 'EPRA Kenya 2024 / IEA national grid factors',
  };
}

function sustainSolarOffset(b: Record<string, unknown>) {
  const annualPvKwh = need(b, 'annualPvKwh', (x) => x >= 0 && x <= 1e10, 'annual PV kWh, 0 or more');
  const country = (b.country as string) || 'KE';
  const years = need(b, 'projectYears', (x) => x > 0 && x <= 50, 'between 0 and 50 years');
  const ef = COUNTRY_GRID_EF_KG_PER_KWH[country] ?? COUNTRY_GRID_EF_KG_PER_KWH.KE;
  const annualKgOffset = annualPvKwh * ef;
  return {
    annualKgCO2Offset: +annualKgOffset.toFixed(1),
    lifetimeTonnesOffset: +((annualKgOffset * years) / 1000).toFixed(2),
    emissionFactor: ef,
    country,
    projectYears: years,
    source: 'Grid factor × displaced kWh (IEA methodology)',
  };
}

function sustainEmissionFactors() {
  return {
    factors: COUNTRY_GRID_EF_KG_PER_KWH,
    units: 'kgCO2 per kWh delivered electricity',
    sources: ['EPRA Kenya 2024', 'IEA Country Statistics 2023', 'Eskom 2023', 'EIA 2023', 'BEIS 2023'],
    note: 'Grid mix changes annually — verify against latest national report for binding figures.',
  };
}

/** Live FX rates from ECB (free, authoritative). 1-hour cache. */
async function globalFxRates() {
  try {
    const r = await fetch('https://api.exchangerate.host/latest?base=USD', {
      next: { revalidate: 3600 },
    });
    if (r.ok) {
      const j = await r.json();
      return { base: j.base, date: j.date, rates: j.rates, source: 'exchangerate.host (ECB upstream)' };
    }
  } catch {}
  return { base: 'USD', rates: {}, note: 'FX provider unreachable' };
}

// ──────────────────────────────────────────────────────────────────────────
// Dispatch
// ──────────────────────────────────────────────────────────────────────────

export async function dispatch(req: NextRequest, segments: string[], prefix: string) {
  const path = `/api/${prefix}/${segments.join('/')}`.replace(/\/+$/, '');
  const body = await readJson(req);
  if (body.__invalidJson) return fail('Request body is not valid JSON', 400);

  // ── architecture
  if (path.endsWith('/arch/uvalue')) return calc(calcs.uValue, body);
  if (path.endsWith('/arch/daylight/adf')) return calc(calcs.daylightAdf, body);
  if (path.endsWith('/arch/acoustics/reverberation')) return calc(calcs.reverberation, body);
  if (path.endsWith('/arch/shadow/position')) return calc(calcs.sunPosition, body);
  if (path.endsWith('/arch/shadow/hourly') || path.endsWith('/arch/shadow/solstice'))
    return stub(path, { hours: [] });
  // Shapes no longer carry "compliant: true" — a 501 must not look like a pass.
  if (path.endsWith('/arch/egress')) return stub(path, { occupants: null, exits: [], compliant: null });
  if (path.endsWith('/arch/accessibility/check')) return stub(path, { checks: [], passed: null, failed: null });

  // ── engineering / loads / rc / steel / geotech / hydro
  if (path.endsWith('/loads/wind/asce7')) return calc(calcs.windAsce7, body);
  if (path.endsWith('/loads/wind/eurocode')) return calc(calcs.windEurocode, body);
  if (path.endsWith('/loads/seismic/asce7-elf')) return calc(calcs.seismicElf, body);
  if (path.endsWith('/rc/beam/bending')) return calc(calcs.rcBeam, body);
  if (path.endsWith('/steel/bolt')) return calc(calcs.steelBolt, body);
  if (path.endsWith('/geotech/bearing/terzaghi')) return calc(calcs.bearingCapacity, body);
  // 2026-10-27 audit: EC7 bearing, EC2 shear and deflection, pad footings and EN 1998.
  if (path.endsWith('/geotech/bearing/ec7')) return calc(calcs.bearingEc7, body);
  if (path.endsWith('/rc/beam/shear')) return calc(calcs.ec2Shear, body);
  if (path.endsWith('/rc/deflection/span-depth')) return calc(calcs.ec2Deflection, body);
  if (path.endsWith('/geotech/pad-footing')) return calc(calcs.padFooting, body);
  if (path.endsWith('/loads/seismic/ec8-lfm')) return calc(calcs.seismicEc8, body);
  if (path.endsWith('/hydro/tc/kirpich')) return calc(calcs.kirpich, body);
  if (path.endsWith('/hydro/rational')) return calc(calcs.rationalRunoff, body);
  if (path.endsWith('/hydro/runoff-coefficients')) return ok(calcs.runoffCoefficients());
  if (path.endsWith('/hydro/pond')) return stub(path, { volume_m3: null, depth_m: null });
  // Was success:true with empty reactions and "scheduled for next deployment".
  if (path.endsWith('/eng/frame/analyze')) return stub(path, { reactions: [], memberForces: [] });

  // ── global / fx
  if (path.endsWith('/global/fx/rates')) return ok(await globalFxRates());
  if (path.endsWith('/global/building-code'))
    return ok({
      country: body.country || 'KE',
      codes: ['EC2', 'EC3', 'BS 8110', 'KEBS'],
      source: 'National Construction Authority (NCA) Kenya',
    });
  if (path.endsWith('/global/design-recommendations'))
    return stub(path, { recommendations: [] });

  // ── BIM
  // BIM answered "queued" / "updated: true" for jobs nothing ever ran.
  if (path.startsWith('/api/bim')) return stub(path, { models: [], schedules: [], elements: [] });

  // ── design / villa / experience / marbella
  if (path.startsWith('/api/design/villa/')) return stub(path, { brief: {}, geometry: null, finishes: [] });
  if (path.startsWith('/api/design/experience/')) return stub(path, { palettes: [], emotions: [], journeys: [] });
  if (path.startsWith('/api/design/marbella/')) return stub(path, { items: [] });
  if (path.endsWith('/design/brief/parse')) return stub(path, { rooms: [] });

  // ── interior / render / materials
  if (path.startsWith('/api/interior/palette/')) return stub(path, { colors: [], anchors: [] });
  if (path.startsWith('/api/render/')) return stub(path, { url: null, materials: [] });
  if (path.startsWith('/api/materials/')) return stub(path, { items: [], prices: {} });

  // ── safety
  if (path.startsWith('/api/safety/')) return stub(path, { items: [], categories: [] });

  // ── QS
  if (path.startsWith('/api/qs/')) return stub(path, { items: [], total: 0, currency: 'KES' });

  // ── landscape / sched / report / pay / project / site
  if (path.startsWith('/api/landscape/')) return stub(path, { plants: [], plan: null });
  if (path.startsWith('/api/sched/')) return stub(path, { tasks: [], gantt: [] });
  if (path.startsWith('/api/report/')) return stub(path, { url: null, sections: [] });
  if (path.startsWith('/api/pay/')) return stub(path, { enabled: false, providers: [] });
  if (path.startsWith('/api/project/')) return stub(path, { overrides: {} });
  // ── site context (real data; 2026-10-18 tool audit) ─────────────────────
  if (path.endsWith('/site/buildings') || path.endsWith('/site/obstacles')) {
    const sp = req.nextUrl.searchParams;
    const lat = coordNum(sp.get('lat') ?? body.lat);
    const lon = coordNum(sp.get('lon') ?? body.lon);
    const radius = Number(sp.get('radiusMeters') ?? body.radiusMeters ?? 80);
    if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) return fail('lat and lon must be valid coordinates (lat ±90, lon ±180)', 400);
    try {
      return ok(await fetchOsmSite(lat, lon, radius));
    } catch (e) {
      return fail(e instanceof Error ? e.message : 'OpenStreetMap lookup failed');
    }
  }
  if (path.endsWith('/site/pvwatts')) {
    // Was a proxy to NREL PVWatts that never existed. Now an EmersonEIMS
    // estimate from NASA POWER climatology, labelled as such.
    const sp = req.nextUrl.searchParams;
    const lat = coordNum(sp.get('lat') ?? body.lat);
    const lon = coordNum(sp.get('lon') ?? body.lon);
    const kw = Number(sp.get('kw') ?? body.kw ?? 1);
    if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) return fail('lat and lon must be valid coordinates (lat ±90, lon ±180)', 400);
    if (!(kw > 0 && kw < 100_000)) return fail('kw must be a positive system size in kWp', 400);
    // Panel orientation (2026-10-30 audit: a flat roof and a vertical east wall
    // both gave 5,468 kWh). tilt 0-90°, azimuth clockwise from north.
    const tiltRaw = sp.get('tilt') ?? body.tilt, azRaw = sp.get('az') ?? body.az;
    const tilt = tiltRaw == null || tiltRaw === '' ? null : Number(tiltRaw);
    const az = azRaw == null || azRaw === '' ? null : Number(azRaw);
    if (tilt !== null && !(tilt >= 0 && tilt <= 90)) return fail('tilt must be between 0 and 90 degrees', 400);
    if (az !== null && !(az >= 0 && az <= 360)) return fail('az must be between 0 and 360 degrees (0 = north, 180 = south)', 400);
    try {
      const sun = await fetchNasaSun(lat, lon);
      const PR = 0.78;
      const plane = tilt !== null && tilt > 0 ? poaMonthly(lat, tilt, az ?? (lat < 0 ? 0 : 180), sun.monthly) : null;
      const psh = plane ? plane.monthly : sun.monthly;
      const monthlyKwh = psh.map((v, i) => Math.round(kw * v * DAYS_IN_MONTH[i] * PR));
      return ok({
        annualKwh: monthlyKwh.reduce((s, v) => s + v, 0),
        monthlyKwh,
        solradAnnualKwhM2: plane ? plane.annual : sun.annual,
        horizontalAnnualKwhM2: sun.annual,
        ...(plane ? { tiltDeg: tilt, azimuthDeg: az ?? (lat < 0 ? 0 : 180), gainVsHorizontal: plane.gainVsHorizontal } : {}),
        performanceRatio: PR,
        provenance: {
          source: plane
            ? `NASA POWER long-term irradiance on the panel plane (tilt ${tilt}°, azimuth ${az ?? (lat < 0 ? 0 : 180)}°; Erbs diffuse split, isotropic sky) × 78% performance ratio (EmersonEIMS estimate)`
            : 'NASA POWER long-term irradiance × 78% performance ratio (EmersonEIMS estimate, horizontal plane: orientation not given)',
        },
      });
    } catch (e) {
      return fail(e instanceof Error ? e.message : 'NASA POWER lookup failed');
    }
  }
  if (path.startsWith('/api/site/')) return stub(path, { enriched: false });
  if (path.endsWith('/health-dashboards')) return stub(path, { dashboards: [] });
  if (path.endsWith('/ai/render')) return stub(path, { url: null });

  // ── /api/generate (top-level): stitch a minimal envelope
  // Was "accepted: true, queued: true" for a job no worker ever picked up.
  if (path === '/api/generate' || path.endsWith('/generate')) return stub(path, { jobId: null });

  // ── /api/export/pdf
  if (path.endsWith('/export/pdf')) return stub(path, { url: null });

  // ── /api/drawings/*
  if (path.startsWith('/api/drawings/')) return stub(path, { drawings: [] });

  // ──────────────────────────────────────────────────────────────────────
  // SolarGeniusPro endpoint families (restored from archived Flask logic)
  // ──────────────────────────────────────────────────────────────────────

  // Finance — REAL math
  if (path.endsWith('/finance/npv')) return calc(financeNpv, body);
  if (path.endsWith('/finance/irr')) return calc(financeIrr, body);
  if (path.endsWith('/finance/loan')) return calc(financeLoan, body);
  if (path.endsWith('/finance/inflation')) return calc(financeInflation, body);
  if (path.endsWith('/finance/margin')) return calc(financeMargin, body);
  if (path.endsWith('/finance/loan-vs-cash')) {
    return calc((b) => ({ cashOutlay: need(b, 'cashOutlay', (x) => x > 0 && x <= 1e12, 'an amount greater than 0'), loan: financeLoan(b), note: 'Compare totalPaid vs cashOutlay for break-even.' }), body);
  }
  if (path.startsWith('/api/finance/tariff/')) {
    return ok({
      category: segments[segments.length - 1],
      tariff: null,
      note: 'Live tariff feed not connected. Use category code with your local utility published rate.',
      source: 'pending utility API integration',
    });
  }
  if (path.endsWith('/finance/currency')) {
    const url = new URL(req.url);
    const amount = num(url.searchParams.get('amount'), 0);
    const from = url.searchParams.get('from') || 'USD';
    const to = url.searchParams.get('to') || 'USD';
    const fx = await globalFxRates();
    const rates = (fx as { rates?: Record<string, number> }).rates || {};
    const fromRate = from === 'USD' ? 1 : rates[from];
    const toRate = to === 'USD' ? 1 : rates[to];
    if (!fromRate || !toRate) return ok({ converted: null, note: 'Rate unavailable for one of the currencies' });
    const converted = (amount / fromRate) * toRate;
    return ok({ amount, from, to, converted: +converted.toFixed(4), source: 'exchangerate.host (ECB upstream)' });
  }

  // Solar engineering — REAL where deterministic
  if (path.endsWith('/solar/sun-position')) {
    const url = new URL(req.url);
    const lat = num(url.searchParams.get('lat'), 0);
    const lon = num(url.searchParams.get('lon'), 0);
    const t = url.searchParams.get('time') || undefined;
    return ok(solarSunPosition(lat, lon, t));
  }
  if (path.startsWith('/api/solar/sun-path/')) {
    return ok({ date: segments[1] || '', samples: [], note: 'Hourly sun-path generator pending — use /sun-position per hour as workaround.' });
  }
  if (path.endsWith('/solar/seasonal')) return stub(path, { seasons: [] });
  if (path.endsWith('/solar/voltage-drop')) return calc(solarVoltageDrop, body);
  if (path.endsWith('/solar/poa') || path.endsWith('/solar/poa-haydavies') || path.endsWith('/solar/poa-perez'))
    return stub(path, { poa_W_m2: null });
  if (path.endsWith('/solar/hourly')) return stub(path, { hours: [] });
  if (path.endsWith('/solar/losses')) return stub(path, { losses: {} });
  if (path.endsWith('/solar/string-config')) return stub(path, { stringsPerMppt: null, modulesPerString: null });
  if (path.endsWith('/solar/inverter-match')) return stub(path, { matched: false, candidates: [] });
  if (path.endsWith('/solar/soiling')) return stub(path, { soilingLossPct: null });
  if (path.endsWith('/solar/ocpd-sizing')) return stub(path, { ocpdRating_A: null });
  if (path.endsWith('/solar/bifacial-gain')) return stub(path, { bifacialGainPct: null });
  if (path.endsWith('/solar/sld')) return stub(path, { svg: null });
  if (path.endsWith('/solar/auto-design')) return stub(path, { bom: [], summary: null });

  // Equipment — extension to existing /equipment/panels static route
  if (path.endsWith('/equipment/inverters') || path.endsWith('/equipment/batteries'))
    return ok({ items: [] }, { note: 'Equipment library pending data import.' });

  // Sustainability — REAL grid factors, stub for complex models
  if (path.endsWith('/sustain/carbon-footprint')) return calc(sustainCarbonFootprint, body);
  if (path.endsWith('/sustain/solar-offset')) return calc(sustainSolarOffset, body);
  if (path.endsWith('/sustain/emission-factors')) return ok(sustainEmissionFactors());
  if (path.endsWith('/sustain/carbon-credits')) {
    const t = num(body.tonnesCO2, 0);
    // Voluntary carbon market avg 2024: ~$5/tCO2 (Ecosystem Marketplace).
    return ok({ tonnesCO2: t, estimatedValueUsd: +(t * 5).toFixed(2), pricePerTonneUsd: 5, source: 'Ecosystem Marketplace 2024 voluntary avg' });
  }
  if (path.startsWith('/api/sustain/'))
    return stub(path, { result: null });

  // Reports — server-side PDF/Excel generation requires backend port
  if (path.startsWith('/api/reports/'))
    return ok(
      { url: null, blob: null },
      {
        note: 'Server-side report rendering (PDF/DOCX/XLSX) pending backend port. Use the SPA\'s built-in client-side PDF export as interim.',
      },
    );

  // Research — ML/AI tools pending backend
  if (path.startsWith('/api/research/'))
    return stub(path, { results: [], confidence: null });

  // Engineering tiers — Aurora-grade calculators pending backend
  if (path.startsWith('/api/engpro/') || path.startsWith('/api/engelite/') || path.startsWith('/api/engglobal/'))
    return stub(path, { result: null });

  // Approval workflows
  if (path.startsWith('/api/arch-approval/') || path.startsWith('/api/eng-approval/'))
    return stub(path, { approvals: [] });

  // ── default: an unknown path is not a success (it used to answer ok({})).
  return stub(path);
}
