/**
 * Building Suite calculators (2026-10-19 tool audit).
 *
 * The previous handlers in dispatcher.ts read keys the Building Suite screens
 * never send (V_ms vs the form's V_mph, A_ha vs area_ha, D_m vs Df_m, fub/As
 * vs designation/grade …) and filled every gap with num(x, default). Whatever
 * the user typed, the answer came from the defaults. These versions read the
 * keys the screens send, compute what the cited clause computes, and refuse
 * (HTTP 400, naming the field) when an input is missing — never a silent
 * default. Each result states its method and its assumptions.
 *
 * Every function returns either a result object or a CalcError.
 */

export type Body = Record<string, unknown>;
export interface CalcError { error: string; missing?: string[] }
export const isCalcError = (v: unknown): v is CalcError =>
  !!v && typeof v === 'object' && typeof (v as CalcError).error === 'string';

/** Finite number from a number or numeric string, else undefined. */
function n(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  // Whole numeric strings only: parseFloat accepted "300abc" as 300 (2026-10-25 audit).
  if (typeof v === 'string' && !/^\s*[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?\s*$/.test(v)) return undefined;
  const x = typeof v === 'string' ? Number(v) : (v as number);
  return typeof x === 'number' && Number.isFinite(x) ? x : undefined;
}

/** First key present (aliases), as a number. */
function pick(b: Body, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = n(b[k]);
    if (v !== undefined) return v;
  }
  return undefined;
}

function missing(fields: Record<string, number | undefined>): CalcError | null {
  const m = Object.entries(fields).filter(([, v]) => v === undefined).map(([k]) => k);
  return m.length ? { error: `Missing or invalid input: ${m.join(', ')}`, missing: m } : null;
}

function bad(message: string): CalcError {
  const fields = Array.from(new Set((message.match(/\b[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_]+\b/g) || [])));
  return { error: message, ...(fields.length ? { missing: fields } : {}) } as CalcError;
}

/** Thrown when an optional input is supplied but invalid; runCalc() turns it into a CalcError. */
export class BadInput extends Error {
  constructor(public field: string, message: string) { super(message); }
}

/** Optional number: the default only when the key is absent. Present but
 *  blank or non-numeric is an error — never a silent default. */
function opt(b: Body, key: string, def: number, check?: (x: number) => boolean, rule = 'a valid number'): number {
  // Absent = default. Present but blank/null = an error, not a silent default:
  // the suite's forms send every field, so a cleared box arrives as null (2026-10-20).
  if (!(key in b) || b[key] === undefined) return def;
  if (b[key] === null || b[key] === '') throw new BadInput(key, `Invalid input: ${key} was left blank`);
  const v = n(b[key]);
  if (v === undefined || (check && !check(v))) throw new BadInput(key, `Invalid input: ${key} must be ${rule}`);
  return v;
}

/** Optional number with no default: undefined when absent or left blank, an
 *  error when something was typed that is not a number. With pick() a typo
 *  ("5O", "abc") made the check that used it vanish while the result still
 *  said success (2026-10-27 audit). Aliases: the first key present wins. */
function optN(b: Body, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const raw = b[k];
    if (raw === undefined || raw === null || raw === '') continue;
    const v = n(raw);
    if (v === undefined) throw new BadInput(k, `Invalid input: ${k} must be a number (got "${String(raw).slice(0, 20)}")`);
    return v;
  }
  return undefined;
}

/** Shown with every result: a desk check, not a signed design (2026-10-25 audit:
 *  no calculator result said so; only the host page did, below the frame). */
export const CALC_DISCLAIMER = 'Desk check to the cited code clause only. Not a design: a registered engineer must check loads, detailing and the full set of code requirements before anything is built.';

/** Run a calculator, converting BadInput into a CalcError naming the field.
 *  Results with checks also carry one overall verdict, so a failed check is
 *  not left as a small row (2026-10-27 audit). */
export function runCalc(fn: (b: Body) => unknown, b: Body): unknown {
  try {
    const out = fn(b);
    if (out && typeof out === 'object' && !Array.isArray(out) && !('error' in (out as Record<string, unknown>))) {
      const o = out as Record<string, unknown>;
      const checks = Array.isArray(o.checks) ? (o.checks as Array<{ check?: string; pass?: unknown }>).filter((c) => typeof c?.pass === 'boolean') : [];
      const failed = checks.filter((c) => c.pass === false).map((c) => String(c.check));
      // A blank demand (M_Ed, Fv,Ed ...) leaves its check out: say so beside the
      // verdict (2026-10-29 audit: a blank M_Ed showed a bare "PASS").
      const notChecked = Array.isArray(o.not_checked) && o.not_checked.length ? ` — not checked: ${(o.not_checked as string[]).join('; ')}` : '';
      const overall = checks.length
        ? { overall: (failed.length ? `FAIL: ${failed.length} of ${checks.length} checks fail (${failed.join('; ')})` : notChecked ? `PARTIAL: the ${checks.length} checks made pass, but this is not a full check` : `PASS: all ${checks.length} checks pass`) + notChecked, all_checks_pass: !failed.length }
        : {};
      return { ...overall, ...o, disclaimer: CALC_DISCLAIMER };
    }
    return out;
  } catch (e) {
    if (e instanceof BadInput) return { error: e.message, missing: [e.field] } as CalcError;
    throw e;
  }
}

function parseArray(v: unknown): Body[] | undefined {
  if (Array.isArray(v)) return v as Body[];
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? (p as Body[]) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

const r = (x: number, dp = 2) => +x.toFixed(dp);
const DEG = Math.PI / 180;

// ───────────────────────────── Architecture ─────────────────────────────

/** Average daylight factor, BRE / BS 8206-2 (as used with BS EN 17037):
 *  ADF % = T · Aw · θ · M / (A · (1 − R²)), Aw = window area × frame factor. */
export function daylightAdf(b: Body) {
  const T = pick(b, 'T_glass', 'glassT');
  const W = pick(b, 'window_area_m2', 'glazingArea_m2');
  const theta = pick(b, 'sky_angle_deg', 'skyAngle_deg');
  const A = pick(b, 'total_internal_surface_m2', 'totalSurface_m2');
  const R = pick(b, 'avg_reflectance', 'avgReflectance');
  const M = pick(b, 'maintenance_factor', 'maintenance');
  const err = missing({ T_glass: T, window_area_m2: W, sky_angle_deg: theta, total_internal_surface_m2: A, avg_reflectance: R, maintenance_factor: M });
  if (err) return err;
  const ff = opt(b, 'frame_factor', 1, (x) => x > 0 && x <= 1, 'between 0 and 1');
  if (!(A! > 0) || !(R! >= 0 && R! < 1)) return bad('total_internal_surface_m2 must be > 0 and avg_reflectance between 0 and 1');
  // 2026-10-29 audit: R = 0.99 gave ADF 82%. White-painted rooms average about 0.6-0.7.
  if (R! > 0.85) return bad('avg_reflectance above 0.85 is not a real room (all-white rooms average about 0.6-0.7)');
  if (!(T! > 0 && T! <= 1)) return bad('T_glass is a light transmittance: between 0 and 1 (clear glazing about 0.7–0.8)');
  if (!(theta! > 0 && theta! <= 90)) return bad('sky_angle_deg is the visible sky angle: between 0 and 90 degrees');
  if (!(M! > 0 && M! <= 1)) return bad('maintenance_factor must be between 0 and 1');
  if (!(W! > 0) || W! >= A!) return bad('window_area_m2 must be > 0 and smaller than total_internal_surface_m2');
  // A real room has at least the window wall, its opposite wall, floor and
  // ceiling, so its total internal surface is several times the window
  // (2026-10-29 audit: 5 m² of surface around a 4 m² window gave ADF 43.7%).
  if (A! < 3 * W!) return bad('total_internal_surface_m2 (all walls, floor and ceiling, including windows) must be at least 3 × window_area_m2: check the room surface area');
  const Aw = W! * ff;
  const ADF = (T! * Aw * theta! * M!) / (A! * (1 - R! * R!));
  // Real rooms stay far below this; 40 m² of window in 120 m² of surface with
  // T = 1, R = 0.85 gave "108%, well daylit" (audit 2026-10-31).
  if (ADF > 30) return bad(`These inputs give an average daylight factor of ${r(ADF, 0)}%, which no real room reaches: check the transmittance, reflectance and areas`);
  return {
    ADF_pct: r(ADF),
    glazed_area_m2: r(Aw),
    assessment: ADF >= 5 ? 'Well daylit (≥ 5%)' : ADF >= 2 ? 'Adequately daylit (2–5%)' : 'Under-lit (< 2%) — supplementary electric lighting needed',
    assumptions: !('frame_factor' in b) ? ['No frame factor given: whole window area treated as glass'] : [],
    method: 'Average daylight factor, BRE Digest 309 / BS 8206-2 formula',
  };
}

/** Reverberation time: Sabine T = 0.161 V / ΣSα; Eyring T = 0.161 V / (−S·ln(1 − ᾱ)). */
export function reverberation(b: Body) {
  const V = pick(b, 'volume_m3');
  const method = String(b.method ?? 'sabine').toLowerCase();
  if (method !== 'sabine' && method !== 'eyring') return { error: 'Invalid input: method must be sabine or eyring', missing: ['method'] };
  const surfaces = parseArray(b.surfaces);
  const legacyA = pick(b, 'absorption_m2_sabin');
  if (V === undefined) return missing({ volume_m3: V })!;
  if (!(V > 0)) return bad('volume_m3 must be > 0');
  if (V < 1) return bad('volume_m3 below 1 m³ is not a room; check the units');
  // 2026-10-27 audit: 1e9 m³ returned T60 = 1.6e8 s with only a warning.
  if (V > 1e6) return bad('volume_m3 above 1,000,000 m³ is not a room (the largest concert halls and arenas are about 100,000-600,000 m³); check the units');
  let S = 0, A = 0;
  if (surfaces && surfaces.length) {
    for (const [i, s] of surfaces.entries()) {
      const area = n(s.area_m2), alpha = n(s.alpha);
      if (area === undefined || alpha === undefined) return bad(`surfaces[${i}] needs area_m2 and alpha`);
      if (!(area > 0)) return bad(`surfaces[${i}].area_m2 must be greater than 0`);
      if (!(alpha >= 0 && alpha <= 1)) return bad(`surfaces[${i}].alpha must be between 0 and 1`);
      if (area > 1e5) return bad(`surfaces[${i}].area_m2 above 100,000 m² is not a room surface; check the units`);
      S += area; A += area * alpha;
    }
  } else if (legacyA !== undefined) {
    if (legacyA > 1e5) return bad('absorption_m2_sabin above 100,000 m² Sabine is not a room; check the units');
    A = legacyA;
  } else {
    return { error: 'Missing or invalid input: surfaces (array of {area_m2, alpha})', missing: ['surfaces'] };
  }
  if (!(A > 0)) return bad('Total absorption must be > 0');
  // Geometry check (2026-10-29 audit: V 0.001 m³ with S 90,000 m² gave T60 = 0).
  // No room has less surface than a sphere of its volume; long, thin spaces
  // stay well under 60·V^(2/3).
  if (S > 0) {
    const sMin = Math.cbrt(36 * Math.PI * V * V);
    if (S < sMin * 0.99) return bad(`Total surface ${r(S, 1)} m² is less than any room of ${V} m³ can have (a sphere has ${r(sMin, 1)} m²); check the areas`);
    if (S > 60 * Math.pow(V, 2 / 3)) return bad(`Total surface ${r(S, 0)} m² is far too large for a ${V} m³ room; check the areas and the volume`);
  }
  let T: number;
  let used = 'Sabine';
  if (method === 'eyring' && S > 0) {
    const abar = A / S;
    if (abar >= 1) return bad('Mean absorption coefficient must be below 1 for Eyring');
    T = (0.161 * V) / (-S * Math.log(1 - abar));
    used = 'Eyring';
  } else {
    T = (0.161 * V) / A;
  }
  // 2026-10-29 audit: 0.5 m² Sabine in 200 m³ returned 64 s as a result.
  // No real room reverberates for more than about 15 s: refuse rather than warn.
  if (T > 15) return bad(`T60 = ${r(T, 1)} s is longer than any real room (cathedrals reach about 8-10 s): the absorption is far too low for this volume; check the areas, coefficients and volume`);
  const notes: string[] = [];
  if (method === 'eyring' && used !== 'Eyring') notes.push('Eyring needs the surfaces (area and alpha of each); with a total absorption only, Sabine was used.');
  const warning = T > 10 ? `T60 = ${r(T, 1)} s is longer than any furnished room (cathedrals reach about 8-10 s): check the absorption and volume.` : undefined;
  return {
    T60_s: r(T),
    total_absorption_m2_sabin: r(A),
    ...(notes.length ? { note: notes.join(' ') } : {}),
    ...(warning ? { warning } : {}),
    ...(S > 0 ? { total_surface_m2: r(S), mean_alpha: r(A / S, 3) } : {}),
    method: `${used} reverberation time`,
  };
}

/** U-value, BS EN ISO 6946: U = 1 / (Rsi + Σ d/λ + Rse); surface resistances from Table 7. */
export function uValue(b: Body) {
  const layers = parseArray(b.layers);
  if (!layers || !layers.length) return { error: 'Missing or invalid input: layers (array of {thickness_m, lambda_W_mK})', missing: ['layers'] };
  const flow = String(b.heat_flow ?? 'horizontal').toLowerCase();
  const RSI: Record<string, number> = { horizontal: 0.13, upward: 0.1, downward: 0.17 };
  const rsi = 'rsi' in b ? opt(b, 'rsi', 0, (x) => x >= 0, 'zero or more') : RSI[flow];
  if (rsi === undefined) return bad('heat_flow must be horizontal, upward or downward');
  const rse = opt(b, 'rse', 0.04, (x) => x >= 0, 'zero or more');
  let R = rsi + rse;
  const rows = [];
  for (const [i, l] of layers.entries()) {
    const d = n(l.thickness_m ?? l.thickness);
    const k = n(l.lambda_W_mK ?? l.lambda ?? l.k);
    if (d === undefined || k === undefined) return bad(`layers[${i}] needs thickness_m and lambda_W_mK`);
    if (!(d > 0 && k > 0)) return bad(`layers[${i}] thickness and conductivity must be > 0`);
    if (d > 2) return bad(`layers[${i}] is ${d} m thick: thickness_m is in metres (0.1 = 100 mm), and building layers are under 2 m`);
    if (k > 500) return bad(`layers[${i}] lambda_W_mK = ${k} is above any building material (copper is about 380)`);
    if (k < 0.005) return bad(`layers[${i}] lambda_W_mK = ${k} is below any building material (vacuum panels are about 0.007)`);
    R += d / k;
    rows.push({ layer: String(l.description ?? `Layer ${i + 1}`), R_m2K_W: r(d / k, 3) });
  }
  return {
    U_W_m2K: 1 / R >= 0.001 ? r(1 / R, 3) : Number((1 / R).toPrecision(2)),
    R_total_m2K_W: r(R, 3),
    surface_resistances: { Rsi: rsi, Rse: rse, heat_flow: flow },
    layers: rows,
    method: 'BS EN ISO 6946 (no correction for air gaps, fixings or thermal bridges)',
  };
}

/** NOAA general solar position (fractional-year series), from latitude,
 *  longitude and a UTC instant. Accuracy ≈ ±0.5°, adequate for shading. */
export function sunPositionAt(lat: number, lon: number, when: Date) {
  const start = Date.UTC(when.getUTCFullYear(), 0, 1);
  const doy = Math.floor((when.getTime() - start) / 86_400_000) + 1;
  const hr = when.getUTCHours() + when.getUTCMinutes() / 60 + when.getUTCSeconds() / 3600;
  const g = ((2 * Math.PI) / 365) * (doy - 1 + (hr - 12) / 24);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const tst = hr * 60 + eqtime + 4 * lon; // true solar time, minutes
  const ha = (tst / 4 - 180) * DEG;
  const phi = lat * DEG;
  const cosZ = Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(ha);
  const zenith = Math.acos(Math.max(-1, Math.min(1, cosZ)));
  const az = (Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(phi) - Math.tan(decl) * Math.cos(phi)) / DEG + 180 + 360) % 360;
  return {
    altitude_deg: r(90 - zenith / DEG),
    azimuth_deg: r(az),
    declination_deg: r(decl / DEG),
    equation_of_time_min: r(eqtime),
    method: 'NOAA general solar position equations (±0.5°), azimuth clockwise from north',
  };
}

export function sunPosition(b: Body) {
  const lat = pick(b, 'lat', 'latitude');
  const lon = pick(b, 'lng', 'lon', 'longitude');
  const err = missing({ lat, lng: lon });
  if (err) return err;
  if (Math.abs(lat!) > 90 || Math.abs(lon!) > 180) return bad('lat must be within ±90 and lng within ±180');
  const raw = b.datetime_utc ?? b.time;
  // Strict ISO 8601 (2026-10-29 audit: "2026-02-31" became 3 March and the
  // number 12 became the year 2001).
  const m = typeof raw === 'string' ? raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?(Z|[+-]\d{2}:?\d{2})?$/) : null;
  const when = m ? new Date(String(raw)) : null;
  const bad8601 = { error: 'Missing or invalid input: datetime_utc (ISO 8601, e.g. 2026-06-21T12:00:00Z)', missing: ['datetime_utc'] };
  if (!m || !when || Number.isNaN(when.getTime())) return bad8601;
  const [Y, Mo, D, h = '0', mi = '0', s = '0'] = m.slice(1, 7);
  const dim = new Date(Date.UTC(+Y, +Mo, 0)).getUTCDate();
  if (+Mo < 1 || +Mo > 12 || +D < 1 || +D > dim || +h > 23 || +mi > 59 || +s > 59) return bad8601;
  return { ...sunPositionAt(lat!, lon!, when), datetime_utc: when.toISOString() };
}

// ───────────────────────────── Structures ───────────────────────────────

/** ASCE 7-22 velocity pressure qz = 0.00256·Kz·Kzt·Ke·V² (psf, V mph), Eq. 26.10-1.
 *  Kz from Table 26.10-1 (α, zg per exposure); Kzt = 1 (flat site), Ke = 1 (sea level). */
const EXPOSURE: Record<string, { alpha: number; zg_ft: number }> = {
  B: { alpha: 7.5, zg_ft: 3280 },
  C: { alpha: 9.8, zg_ft: 2460 },
  D: { alpha: 11.5, zg_ft: 1935 },
};
export function windAsce7(b: Body) {
  let V = pick(b, 'V_mph');
  const Vms = pick(b, 'V_ms', 'V');
  if (V === undefined && Vms !== undefined) V = Vms / 0.44704;
  let z = pick(b, 'height_ft');
  const zm = pick(b, 'height_m');
  if (z === undefined && zm !== undefined) z = zm / 0.3048;
  if (V === undefined || z === undefined) {
    const m: string[] = [];
    if (V === undefined) m.push(Vms === undefined && b.V_mph === undefined ? 'V_ms (or V_mph)' : 'V_ms');
    if (z === undefined) m.push(zm === undefined && b.height_ft === undefined ? 'height_m (or height_ft)' : 'height_m');
    return { error: `Missing or invalid input: ${m.join(', ')}`, missing: m };
  }
  const exp = String(b.exposure ?? '').toUpperCase();
  const e = EXPOSURE[exp];
  if (!e) return { error: 'Missing or invalid input: exposure (B, C or D)', missing: ['exposure'] };
  const metric = Vms !== undefined || zm !== undefined;
  if (!(V! > 0 && z! > 0)) return bad(metric ? 'Wind speed (V_ms) and height (height_m) must be > 0' : 'V_mph and height_ft must be > 0');
  if (V! > 300) return bad(metric ? 'A basic wind speed above 134 m/s is outside ASCE 7' : 'V_mph above 300 is outside ASCE 7 basic wind speeds');
  // 2026-10-27 audit: 1e7 ft was accepted (Kz capped). Same limit as the seismic check.
  if (z! > 1000) return bad(metric ? 'height_m above about 300 m (1,000 ft) is outside this velocity-pressure check: tall buildings need a wind-tunnel or dynamic study' : 'height_ft above 1,000 ft is outside this velocity-pressure check: tall buildings need a wind-tunnel or dynamic study');
  // Table 26.10-1: z is taken between 15 ft and the gradient height zg (Kz ≤ 2.41).
  const zEff = Math.min(Math.max(z!, 15), e.zg_ft);
  const Kz = 2.41 * Math.pow(zEff / e.zg_ft, 2 / e.alpha);
  const Kzt = opt(b, 'Kzt', 1, (x) => x >= 1, '1 or more');
  const Ke = opt(b, 'Ke', 1, (x) => x > 0 && x <= 1.1, 'between 0 and 1.1');
  const qz_psf = 0.00256 * Kz * Kzt * Ke * V! * V!;
  const GCPI: Record<string, number> = { enclosed: 0.18, partially_enclosed: 0.55, partially_open: 0.18, open: 0 };
  const enclosure = String(b.enclosure ?? 'enclosed');
  if (!(enclosure in GCPI)) return { error: 'Invalid input: enclosure must be enclosed, partially_enclosed, partially_open or open', missing: ['enclosure'] };
  return {
    qz_psf: r(qz_psf),
    qz_Pa: r(qz_psf * 47.880259, 0),
    Kz: r(Kz, 3),
    Kzt, Ke,
    Kd_for_pressure_equations: 0.85,
    GCpi: GCPI[enclosure] ?? null,
    assumptions: [
      'Kzt = 1 (no hill or escarpment speed-up) and Ke = 1 (sea level) unless given',
      z! < 15 ? 'Height below 15 ft: Kz taken at 15 ft (Table 26.10-1 note)' : null,
      z! > e.zg_ft ? `Height above the gradient height zg = ${e.zg_ft} ft: Kz capped at 2.41` : null,
      'Velocity pressure only: design pressures need GCp for each surface (Ch. 27/28/30)',
    ].filter(Boolean),
    method: 'ASCE 7-22 Eq. 26.10-1 with Kz from Table 26.10-1',
  };
}

/** EN 1991-1-4 peak velocity pressure qp(z) = [1 + 7·Iv(z)]·½·ρ·vm(z)², §4.3–4.5. */
const TERRAIN: Record<string, { z0: number; zmin: number }> = {
  '0': { z0: 0.003, zmin: 1 }, I: { z0: 0.01, zmin: 1 }, II: { z0: 0.05, zmin: 2 }, III: { z0: 0.3, zmin: 5 }, IV: { z0: 1.0, zmin: 10 },
};
export function windEurocode(b: Body) {
  const vb0 = pick(b, 'vb_ms', 'vb0_ms');
  const z = pick(b, 'height_m');
  const err = missing({ vb_ms: vb0, height_m: z });
  if (err) return err;
  const tc = String(b.terrain_category ?? '').toUpperCase();
  const t = TERRAIN[tc];
  if (!t) return { error: 'Missing or invalid input: terrain_category (0, I, II, III or IV)', missing: ['terrain_category'] };
  const pos = (x: number) => x > 0;
  const upTo = (hi: number) => (x: number) => x > 0 && x <= hi;
  const cdir = opt(b, 'cdir', 1, upTo(1), 'greater than 0 and at most 1'), cseason = opt(b, 'cseason', 1, upTo(1), 'greater than 0 and at most 1'), cprob = opt(b, 'cprob', 1, upTo(1.2), 'greater than 0 and at most 1.2');
  const co = opt(b, 'co', 1, upTo(1.5), 'greater than 0 and at most 1.5 (orography factor)');
  const rho = opt(b, 'rho_kg_m3', 1.25, (x) => x >= 0.9 && x <= 1.4, 'between 0.9 and 1.4 kg/m³ (air density; about 1.0 at Nairobi altitude)');
  void pos;
  if (!(vb0! > 0)) return bad('vb_ms must be > 0');
  if (vb0! > 70) return bad('vb_ms above 70 m/s is not a basic wind speed (the strongest national values are about 50 m/s; Kenya is about 20-30 m/s)');
  if (!(z! > 0 && z! <= 200)) return bad('height_m must be between 0 and 200 m: the EN 1991-1-4 profile (§4.3.2) applies up to 200 m');
  const vb = cdir * cseason * cprob * vb0!;
  const zEff = Math.max(z!, t.zmin);
  const kr = 0.19 * Math.pow(t.z0 / 0.05, 0.07);
  const cr = kr * Math.log(zEff / t.z0);
  const vm = cr * co * vb;
  const Iv = 1 / (co * Math.log(zEff / t.z0));
  const qp = (1 + 7 * Iv) * 0.5 * rho * vm * vm;
  // State every value used (2026-10-27 audit: ρ = 1.25 and z raised to zmin
  // were applied without a word; ρ is about 1.0 at Nairobi's altitude, so
  // the default overstates qp there by about 25%).
  const given = (k: string) => k in b && b[k] !== undefined && b[k] !== null && b[k] !== '';
  const assumptions = [
    rho < 1.2
      ? `Air density ρ = ${rho} kg/m³ (given, for a site at altitude)`
      : `Air density ρ = ${rho} kg/m³${given('rho_kg_m3') ? '' : ' (EN 1991-1-4 recommended)'}, the sea-level value. At Nairobi (about 1,700 m) ρ is about 1.0 kg/m³, which gives a qp about 20% lower: enter the site's value.`,
    z! < t.zmin ? `Height ${z} m is below zmin = ${t.zmin} m for terrain category ${tc}: z = zmin used (§4.3.2)` : null,
    `cdir = ${cdir}, cseason = ${cseason}, cprob = ${cprob}${given('cdir') || given('cseason') || given('cprob') ? '' : ' (recommended values)'}`,
    `Orography factor co = ${co}${given('co') ? '' : ' (flat terrain; hills and escarpments need §4.3.3 / Annex A)'}`,
    'Turbulence factor kI = 1; recommended values throughout: the Kenyan or project National Annex may differ',
    'Peak velocity pressure only: pressures on surfaces need cpe/cpi (Section 7)',
  ].filter(Boolean);
  return {
    qp_Pa: r(qp, 0),
    qp_kPa: r(qp / 1000, 3),
    vb_ms: r(vb), vm_ms: r(vm), Iv: r(Iv, 3), cr: r(cr, 3), kr: r(kr, 3),
    rho_kg_m3: rho, co, z_used_m: zEff,
    assumptions,
    method: 'EN 1991-1-4 §4.2–4.5 (recommended values; check the National Annex)',
  };
}

/** ASCE 7-22 §12.8 ELF. Period Ta = Ct·hn^x (Table 12.8-2), then
 *  Cs = SDS/(R/Ie) ≤ SD1/(Ta·R/Ie), ≥ max(0.044·SDS·Ie, 0.01); V = Cs·W. */
const PERIOD: Record<string, { Ct: number; x: number }> = {
  steel_moment_frame: { Ct: 0.028, x: 0.8 },
  concrete_moment_frame: { Ct: 0.016, x: 0.9 },
  eccentric_braced: { Ct: 0.03, x: 0.75 },
  other: { Ct: 0.02, x: 0.75 },
};
export function seismicElf(b: Body) {
  const SDS = pick(b, 'SDS'), SD1 = pick(b, 'SD1'), R = pick(b, 'R'), Ie = pick(b, 'Ie'), W = pick(b, 'W_kN');
  const err = missing({ SDS, SD1, R, Ie, W_kN: W });
  if (err) return err;
  if (!(R! > 0 && Ie! > 0 && W! > 0)) return bad('R, Ie and W_kN must be > 0');
  // ASCE 7-22 Table 12.2-1 tops out at R = 8; Ie is 1.0, 1.25 or 1.5 (Table 1.5-2).
  if (R! > 8) return bad('R above 8 is outside ASCE 7-22 Table 12.2-1 (the largest response modification coefficient is 8)');
  // 2026-10-27 audit: R = 0.001 gave Cs = 1000 and V = 1000·W.
  if (R! < 1) return bad('R below 1 is outside ASCE 7-22 (Tables 12.2-1 and 15.4-2 start at R = 1 to 1.25)');
  if (W! > 1e7) return bad('W_kN above 10,000,000 kN is not a building seismic weight; check the units (kN)');
  if (![1, 1.25, 1.5].includes(Ie!)) return bad('Ie must be 1.0, 1.25 or 1.5 (ASCE 7-22 Table 1.5-2, risk categories I/II, III, IV)');
  if (!(SDS! > 0 && SDS! <= 3) || !(SD1! > 0 && SD1! <= 3)) return bad('SDS and SD1 are spectral accelerations in g: greater than 0 and at most 3');
  const st = String(b.structure_type ?? 'other');
  if (!(st in PERIOD)) return { error: 'Invalid input: structure_type must be steel_moment_frame, concrete_moment_frame, eccentric_braced or other', missing: ['structure_type'] };
  const p = PERIOD[st];
  // Height in feet (ASCE) or metres (2026-10-20: the suite now offers metres).
  // A mistyped height is an error, not "no height given" (2026-10-27 audit).
  const hnM = optN(b, 'height_m');
  const hn = optN(b, 'height_ft') ?? (hnM !== undefined ? hnM / 0.3048 : undefined);
  if (hn !== undefined && !(hn > 0)) return bad('height_m / height_ft must be greater than 0');
  if (hn !== undefined && hn > 1000) return bad('Height above 1,000 ft (about 300 m) is outside an equivalent-lateral-force check: use a dynamic analysis');
  const Ta = hn !== undefined && hn > 0 ? p.Ct * Math.pow(hn, p.x) : undefined;
  let T = pick(b, 'T', 'T_s');
  const tGiven = ('T' in b && b.T !== '' && b.T != null) || ('T_s' in b && b.T_s !== '' && b.T_s != null);
  if (tGiven && (T === undefined || !(T > 0))) return { error: 'Invalid input: T must be a positive period in seconds', missing: ['T'] };
  let periodNote: string;
  if (T === undefined) {
    if (Ta === undefined) return { error: 'Missing or invalid input: height_m or height_ft (or a period T in seconds)', missing: ['height_ft'] };
    T = Ta;
    periodNote = `Approximate period Ta = ${p.Ct}·hn^${p.x} (Table 12.8-2)`;
  } else if (Ta !== undefined) {
    // §12.8.2: T from analysis may not exceed Cu·Ta (Table 12.8-1).
    // Table 12.8-1, linear interpolation between tabulated SD1 values.
    const CU: [number, number][] = [[0.1, 1.7], [0.15, 1.6], [0.2, 1.5], [0.3, 1.4], [0.4, 1.4]];
    const s = SD1!;
    let Cu = s <= 0.1 ? 1.7 : s >= 0.4 ? 1.4 : 1.4;
    for (let i = 0; i < CU.length - 1; i++) {
      const [x0, y0] = CU[i], [x1, y1] = CU[i + 1];
      if (s >= x0 && s <= x1) { Cu = y0 + ((s - x0) / (x1 - x0)) * (y1 - y0); break; }
    }
    if (T > Cu * Ta) { periodNote = `Period given (${T} s) capped at Cu·Ta = ${r(Cu * Ta, 3)} s (§12.8.2)`; T = Cu * Ta; }
    else periodNote = `Period given by the user (within Cu·Ta = ${r(Cu * Ta, 3)} s)`;
  } else {
    periodNote = 'Period given by the user; not checked against Cu·Ta (no height given)';
  }
  // ELF is not permitted for every structure: Table 12.6-1 limits it (e.g. T
  // >= 3.5·Ts in higher seismic design categories). Say so rather than refuse.
  const Ts = SD1! / SDS!;
  const spectrumNote = SD1! > SDS! ? `SD1 (${SD1}) is larger than SDS (${SDS}); in ASCE 7 maps SD1 is normally below SDS. Check the values were not swapped.` : undefined;
  const elfWarning = T > 3.5 * Ts ? `T = ${r(T, 2)} s is at least 3.5·Ts (${r(3.5 * Ts, 2)} s): ASCE 7-22 Table 12.6-1 does not permit ELF for many systems in seismic design categories D-F. Check the permitted procedure; a modal response spectrum analysis may be required.` : undefined;
  const Cs0 = SDS! / (R! / Ie!);
  const CsMax = SD1! / (T * (R! / Ie!));
  const CsMin = Math.max(0.044 * SDS! * Ie!, 0.01);
  const Cs = Math.max(Math.min(Cs0, CsMax), CsMin);
  return {
    T_s: r(T, 3),
    Cs: r(Cs, 4),
    V_kN: r(Cs * W!, 1),
    governing: Cs === CsMin ? 'minimum (Eq. 12.8-5)' : Cs === CsMax ? 'period limit (Eq. 12.8-3)' : 'Eq. 12.8-2',
    ...(elfWarning || spectrumNote ? { warning: [elfWarning, spectrumNote].filter(Boolean).join(' ') } : {}),
    assumptions: [periodNote, 'T ≤ TL assumed (Eq. 12.8-4 not checked)', 'S1 ≥ 0.6g minimum (Eq. 12.8-6) not checked'],
    method: 'ASCE 7-22 §12.8 equivalent lateral force',
  };
}

/** EN 1992-1-1 singly reinforced rectangular section, rectangular stress
 *  block (λ = 0.8, η = 1, fck ≤ 50 MPa), αcc = 0.85, γc = 1.5, γs = 1.15. */
export function rcBeam(b: Body) {
  // Legacy form: simply supported span under UDL.
  const w = pick(b, 'w_kN_m'), L = pick(b, 'L_m');
  if (w !== undefined && L !== undefined && b.b_mm === undefined) {
    if (!(L > 0 && L <= 50)) return bad('L_m must be between 0 and 50 m for a beam span');
    if (w > 10000) return bad('w_kN_m above 10,000 kN/m is not a beam load; check the units (kN per metre)');
    if (!(w >= 0)) return bad('w_kN_m must be 0 or more (a downward uniform load)');
    return { M_kNm: r((w * L * L) / 8), V_kN: r((w * L) / 2), method: 'Simply supported beam, uniform load: M = wL²/8, V = wL/2' };
  }
  const bw = pick(b, 'b_mm'), d = pick(b, 'd_mm'), As = pick(b, 'As_mm2'), fck = pick(b, 'fck_MPa'), fyk = pick(b, 'fyk_MPa');
  const err = missing({ b_mm: bw, d_mm: d, As_mm2: As, fck_MPa: fck, fyk_MPa: fyk });
  if (err) return err;
  if (!(bw! > 0 && d! > 0 && As! > 0 && fck! > 0 && fyk! > 0)) return bad('Section dimensions, steel area and strengths must be > 0');
  if (fck! < 12 || fck! > 50) return bad('fck_MPa must be between 12 and 50 MPa (EN 1992-1-1 Table 3.1 classes this check covers)');
  if (fyk! < 400 || fyk! > 600) return bad('fyk_MPa must be between 400 and 600 MPa (EN 1992-1-1 Annex C reinforcement)');
  if (bw! > 5000 || d! > 5000) return bad('b_mm and d_mm above 5,000 mm are not a beam section');
  if (bw! < 50 || d! < 50) return bad('b_mm and d_mm below 50 mm are not a reinforced concrete section');
  const h = optN(b, 'h_mm');
  if (h !== undefined && !(d! < h)) return bad('d_mm (effective depth) must be smaller than h_mm (overall depth)');
  const fcd = (0.85 * fck!) / 1.5;
  const fyd = fyk! / 1.15;
  const x = (As! * fyd) / (0.8 * bw! * fcd);
  // A compression zone deeper than the steel means the section cannot develop
  // that steel: no meaningful M_Rd (it went negative before 2026-10-20).
  // Steel must yield at failure: x/d ≤ εcu/(εcu + fyd/Es). Above that the
  // fyd-based M_Rd is unsafe (2026-10-20: As = 3000 gave 420 kNm against ~394
  // by strain compatibility).
  const xLim = 0.0035 / (0.0035 + fyd / 200000);
  if (x < d! && x / d! > xLim) return bad(`Over-reinforced: x/d = ${r(x / d!, 3)} exceeds ${r(xLim, 3)}, so the steel would not yield and this check does not apply. Reduce As, deepen the section, or add compression steel.`);
  if (x >= d!) return bad(`As_mm2 = ${As} is too much steel for this section: the compression zone (x = ${r(x, 0)} mm) would reach below the steel (d = ${d} mm). Reduce As or enlarge the section.`);
  const z = d! - 0.4 * x;
  const MRd = (As! * fyd * z) / 1e6;
  const fctm = 0.3 * Math.pow(fck!, 2 / 3);
  const AsMin = Math.max((0.26 * fctm / fyk!) * bw! * d!, 0.0013 * bw! * d!);
  const AsMax = h !== undefined ? 0.04 * bw! * h : undefined;
  const Med = optN(b, 'Med_kNm');
  if (Med !== undefined && Med < 0) return bad('Med_kNm must be 0 or more (sagging moment). Design a hogging section with its top steel as a separate check.');
  // Steel needed for M_Ed (UK-NA form with αcc = 0.85): K = M/(b·d²·fck),
  // z = d·[0.5 + √(0.25 − K/1.134)] ≤ 0.95d, As,req = M/(fyd·z). K > K' = 0.167
  // means compression steel is needed — not covered here.
  let AsReq: number | null = null;
  let K: number | undefined;
  if (Med !== undefined) {
    K = (Med * 1e6) / (bw! * d! * d! * fck!);
    if (K <= 0.167) {
      const zr = Math.min(d! * (0.5 + Math.sqrt(0.25 - K / 1.134)), 0.95 * d!);
      AsReq = Math.max((Med * 1e6) / (fyd * zr), AsMin);
    }
  }
  const checks = [
    { check: 'Neutral axis x/d ≤ 0.45 (ductility)', value: r(x / d!, 3), pass: x / d! <= 0.45 },
    { check: 'As ≥ As,min (§9.2.1.1)', value: `${As} ≥ ${Math.ceil(AsMin)} mm²`, pass: As! >= AsMin },
    ...(AsMax !== undefined ? [{ check: 'As ≤ 0.04·Ac', value: `${As} ≤ ${Math.floor(AsMax)} mm²`, pass: As! <= AsMax }] : []),
    ...(Med !== undefined ? [{ check: 'M_Ed ≤ M_Rd', value: `${Med} ≤ ${r(MRd, 1)} kNm`, pass: Med <= MRd }] : []),
  ];
  return {
    M_Rd_kNm: r(MRd, 1),
    ...(Med !== undefined ? { utilisation: r(Med / MRd, 3), K: r(K!, 4), As_required_mm2: AsReq === null ? null : Math.ceil(AsReq) } : {}),
    ...(K !== undefined && K > 0.167 ? { warning: "K > K' = 0.167: compression reinforcement required (not designed here)" } : {}),
    x_mm: r(x, 1), z_mm: r(z, 1), fcd_MPa: r(fcd), fyd_MPa: r(fyd, 1),
    As_min_mm2: Math.ceil(AsMin),
    checks,
    ...(Med === undefined ? { not_checked: ['M_Ed not given, so the moment demand was not checked'] } : {}),
    assumptions: ['Singly reinforced; compression steel ignored', 'αcc = 0.85 (UK/Kenya practice; recommended value is 1.0)', 'Shear and deflection are separate checks (EC2 shear, span/depth); crack width not checked'],
    method: 'EN 1992-1-1 §3.1.7 rectangular stress block, §6.1',
  };
}

/** EN 1993-1-8 Table 3.4: bolt shear, bearing, tension and combined. γM2 = 1.25. */
const BOLT_AS: Record<string, number> = { M12: 84.3, M16: 157, M20: 245, M24: 353, M27: 459, M30: 561 };
const BOLT_FUB: Record<string, number> = { '4.6': 400, '4.8': 400, '5.6': 500, '5.8': 500, '6.8': 600, '8.8': 800, '10.9': 1000 };
export function steelBolt(b: Body) {
  const gM2 = 1.25;
  // Legacy form: explicit fub and As.
  if (b.designation === undefined && (b.fub_MPa !== undefined || b.As_mm2 !== undefined)) {
    const fub = pick(b, 'fub_MPa'), As = pick(b, 'As_mm2');
    const err = missing({ fub_MPa: fub, As_mm2: As });
    if (err) return err;
    if (!(fub! > 0 && As! > 0)) return bad('fub_MPa and As_mm2 must be > 0');
    // 2026-10-27 audit: fub 99999 and As 1e9 gave Fv,Rd = 4.8e10 kN; alpha_v 0.55 was accepted.
    if (fub! < 300 || fub! > 1200) return bad('fub_MPa must be between 300 and 1200 MPa (bolt grades 4.6 to 12.9: 400 to 1200)');
    if (As! < 50 || As! > 1200) return bad('As_mm2 (tensile stress area) must be between 50 and 1200 mm² (M10 to M42)');
    // Table 3.4 with threads in the shear plane: αv = 0.6 only for 4.6, 5.6 and
    // 8.8. From fub alone, 400 and 500 could be either, so the lower value is
    // used; 10.9 at 0.6 read 20% high (audit 2026-10-31).
    const av = optN(b, 'alpha_v') ?? (fub === 800 ? 0.6 : 0.5);
    if (av !== 0.5 && av !== 0.6) return bad('alpha_v must be 0.5 or 0.6 (EN 1993-1-8 Table 3.4)');
    return { Fv_Rd_kN: r((av * fub! * As!) / gM2 / 1000), alpha_v: av, method: 'EN 1993-1-8 Table 3.4, one shear plane' };
  }
  const desig = String(b.designation ?? '').toUpperCase();
  const grade = String(b.grade ?? '');
  const As = BOLT_AS[desig], fub = BOLT_FUB[grade];
  if (!As || !fub) return { error: 'Missing or invalid input: designation (M12–M30) and grade (4.6, 4.8, 5.6, 5.8, 6.8, 8.8, 10.9)', missing: [!As ? 'designation' : '', !fub ? 'grade' : ''].filter(Boolean) };
  const dNom = parseInt(desig.slice(1), 10);
  const planes = opt(b, 'shear_planes', 1, (x) => Number.isInteger(x) && x >= 1 && x <= 4, 'a whole number from 1 to 4');
  const tis = b.threads_in_shear;
  if (tis !== undefined && !['true', 'false'].includes(String(tis))) return { error: 'Invalid input: threads_in_shear must be true or false', missing: ['threads_in_shear'] };
  const threads = tis === undefined ? true : String(tis) === 'true';
  const A = threads ? As : (Math.PI * dNom * dNom) / 4;
  const av = threads && ['4.8', '5.8', '6.8', '10.9'].includes(grade) ? 0.5 : 0.6;
  const FvRd = (planes * av * fub * A) / gM2 / 1000;
  const FtRd = (0.9 * fub * As) / gM2 / 1000;
  const out: Record<string, unknown> = {
    Fv_Rd_kN: r(FvRd), Ft_Rd_kN: r(FtRd),
    alpha_v: av, shear_area_mm2: r(A, 1), shear_planes: planes,
  };
  const checks: Array<{ check: string; value: string; pass: boolean }> = [];
  // Optional inputs: absent or blank = not checked; anything else typed must be
  // a number (2026-10-27 audit: "abc" silently skipped the bearing check).
  const t = optN(b, 't_ply_mm'), fu = optN(b, 'fu_ply_MPa'), e1 = optN(b, 'e1_mm'), p1 = optN(b, 'p1_mm');
  const e2 = optN(b, 'e2_mm'), p2 = optN(b, 'p2_mm');
  const exposedRaw = b.exposed_to_weather;
  if (exposedRaw !== undefined && exposedRaw !== null && exposedRaw !== '' && !['true', 'false'].includes(String(exposedRaw))) return { error: 'Invalid input: exposed_to_weather must be true or false', missing: ['exposed_to_weather'] };
  const exposed = String(exposedRaw) === 'true';
  // Hole: as given, else the EN 1090-2 normal clearance hole for the bolt (2026-10-20:
  // changing to M24 errored because the form kept a 22 mm hole).
  const d0Given = optN(b, 'd_hole_mm');
  const d0 = d0Given ?? (dNom <= 14 ? dNom + 1 : dNom <= 24 ? dNom + 2 : dNom + 3);
  const assumptions: string[] = [];
  if (d0Given === undefined) assumptions.push(`Hole diameter taken as ${d0} mm (EN 1090-2 normal clearance for ${desig})`);
  if ([t, fu, e1, d0, p1, e2, p2].some((v) => v !== undefined && !(v > 0))) return bad('t_ply_mm, fu_ply_MPa, e1_mm, p1_mm, e2_mm, p2_mm and d_hole_mm must be > 0');
  if (t !== undefined && t > 100) return bad('t_ply_mm above 100 mm is outside bolted-plate practice');
  if (fu !== undefined && (fu < 300 || fu > 1000)) return bad('fu_ply_MPa must be between 300 and 1000 MPa (structural steel ultimate strength, e.g. 430 for S275, 510 for S355)');
  if ([e1, p1, e2, p2].some((v) => v !== undefined && v > 1000)) return bad('e1_mm, p1_mm, e2_mm and p2_mm above 1,000 mm are not bolt spacings');
  if (d0 < dNom) return bad(`d_hole_mm must be at least the bolt diameter (${dNom} mm)`);
  // EN 1993-1-8 Table 3.3 minimum end/edge distances and spacings.
  if (e1 !== undefined && e1 < 1.2 * d0) return bad(`e1_mm = ${e1} is below the EN 1993-1-8 Table 3.3 minimum end distance 1.2·d0 = ${r(1.2 * d0, 1)} mm`);
  if (p1 !== undefined && p1 < 2.2 * d0) return bad(`p1_mm = ${p1} is below the EN 1993-1-8 Table 3.3 minimum spacing 2.2·d0 = ${r(2.2 * d0, 1)} mm`);
  if (e2 !== undefined && e2 < 1.2 * d0) return bad(`e2_mm = ${e2} is below the EN 1993-1-8 Table 3.3 minimum edge distance 1.2·d0 = ${r(1.2 * d0, 1)} mm`);
  if (p2 !== undefined && p2 < 2.4 * d0) return bad(`p2_mm = ${p2} is below the EN 1993-1-8 Table 3.3 minimum spacing 2.4·d0 = ${r(2.4 * d0, 1)} mm`);
  if (t !== undefined && fu !== undefined && e1 !== undefined) {
    // Table 3.4 bearing, end bolts and inner bolts separately (2026-10-27
    // audit: one value with k1 = 2.5 assumed, unconservative by up to 34% when
    // e2 is small). k1 perpendicular to the load from e2 and p2:
    //   edge bolts  k1 = min(2.8·e2/d0 − 1.7, 1.4·p2/d0 − 1.7, 2.5)
    //   inner bolts k1 = min(1.4·p2/d0 − 1.7, 2.5)
    const k1Edge = Math.min(e2 !== undefined ? 2.8 * e2 / d0 - 1.7 : 2.5, p2 !== undefined ? 1.4 * p2 / d0 - 1.7 : 2.5, 2.5);
    const k1Inner = Math.min(p2 !== undefined ? 1.4 * p2 / d0 - 1.7 : 2.5, 2.5);
    if (e2 === undefined) assumptions.push('e2 not given: k1 = 2.5 assumed, valid only when e2 ≥ 1.5·d0 (' + r(1.5 * d0, 1) + ' mm). Enter e2_mm to check it.');
    const fb = (k1: number, ad: number) => (k1 * Math.min(ad, fub / fu, 1) * fu * dNom * t) / gM2 / 1000;
    const adEnd = e1 / (3 * d0);
    const FbEnd = fb(k1Edge, adEnd);
    out.Fb_Rd_end_bolt_kN = r(FbEnd);
    out.alpha_b_end = r(Math.min(adEnd, fub / fu, 1), 3);
    out.k1 = r(k1Edge, 3);
    let FbGov = FbEnd;
    if (p1 !== undefined) {
      const adInner = p1 / (3 * d0) - 0.25;
      const FbInner = fb(k1Inner, adInner);
      out.Fb_Rd_inner_bolt_kN = r(FbInner);
      out.alpha_b_inner = r(Math.min(adInner, fub / fu, 1), 3);
      FbGov = Math.min(FbEnd, FbInner);
      assumptions.push('Bearing governs at the weaker of the end and inner bolts (both shown)');
    }
    // §3.6.1(10): a single-lap joint with one row of bolts is limited to
    // 1.5·fu·d·t/γM2 (audit 2026-10-31: M24 10.9 in 10 mm read 196.8 kN against
    // 118.1). One shear plane with no pitch given is taken as that joint.
    const lapRaw = b.single_lap_one_row;
    if (lapRaw !== undefined && lapRaw !== null && lapRaw !== '' && !['true', 'false'].includes(String(lapRaw))) return { error: 'Invalid input: single_lap_one_row must be true or false', missing: ['single_lap_one_row'] };
    const singleLap = lapRaw === undefined || lapRaw === null || lapRaw === '' ? planes === 1 && p1 === undefined : String(lapRaw) === 'true';
    if (singleLap) {
      const lapLimit = (1.5 * fu * dNom * t) / gM2 / 1000;
      if (lapLimit < FbGov) FbGov = lapLimit;
      out.Fb_Rd_single_lap_limit_kN = r(lapLimit);
      assumptions.push(`Single-lap joint with one bolt row: Fb,Rd limited to 1.5·fu·d·t/γM2 = ${r(lapLimit)} kN (§3.6.1(10)). Set single_lap_one_row = false if this is not one.`);
    }
    out.Fb_Rd_kN = r(FbGov);
  } else {
    assumptions.push('Bearing not checked: give t_ply_mm, fu_ply_MPa and e1_mm (and e2_mm, p1_mm, p2_mm where they apply)');
  }
  const FvEd = optN(b, 'Fv_Ed_kN'), FtEd = optN(b, 'Ft_Ed_kN');
  if ((FvEd !== undefined && FvEd < 0) || (FtEd !== undefined && FtEd < 0)) return bad('Fv_Ed_kN and Ft_Ed_kN are load magnitudes and must be 0 or more');
  if (FvEd !== undefined) {
    const gov = out.Fb_Rd_kN !== undefined ? Math.min(FvRd, out.Fb_Rd_kN as number) : FvRd;
    checks.push({ check: 'Fv,Ed ≤ min(Fv,Rd, Fb,Rd)', value: `${FvEd} ≤ ${r(gov)} kN`, pass: FvEd <= gov });
  }
  if (FtEd !== undefined) checks.push({ check: 'Ft,Ed ≤ Ft,Rd', value: `${FtEd} ≤ ${r(FtRd)} kN`, pass: FtEd <= FtRd });
  // Punching shear of the plate under the head/nut, Table 3.4: Bp,Rd =
  // 0.6·π·dm·tp·fu/γM2, dm ≈ 1.6·d (mean of across-flats and across-corners).
  if (t !== undefined && fu !== undefined) {
    const dm = 1.6 * dNom;
    const BpRd = (0.6 * Math.PI * dm * t * fu) / gM2 / 1000;
    out.Bp_Rd_kN = r(BpRd);
    assumptions.push(`Punching shear with dm ≈ 1.6·d = ${r(dm, 1)} mm (use the nut's real dimensions if they differ)`);
    if (FtEd !== undefined) checks.push({ check: 'Ft,Ed ≤ Bp,Rd (punching shear)', value: `${FtEd} ≤ ${r(BpRd)} kN`, pass: FtEd <= BpRd });
  }
  // Table 3.3 maxima. e1, e2 ≤ 4t + 40 mm applies to steel EXPOSED to the
  // weather; indoor steel has no maximum end or edge distance (2026-10-27
  // audit: it was applied to every case, a false failure). p1, p2 ≤ min(14t,
  // 200 mm) applies to both.
  if (exposed && t !== undefined && e1 !== undefined) checks.push({ check: 'e1 ≤ 4t + 40 mm (Table 3.3, exposed steel)', value: `${e1} ≤ ${4 * t + 40} mm`, pass: e1 <= 4 * t + 40 });
  if (exposed && t !== undefined && e2 !== undefined) checks.push({ check: 'e2 ≤ 4t + 40 mm (Table 3.3, exposed steel)', value: `${e2} ≤ ${4 * t + 40} mm`, pass: e2 <= 4 * t + 40 });
  if (!exposed && t !== undefined && (e1 !== undefined || e2 !== undefined)) assumptions.push('Steel not exposed to the weather: no maximum end or edge distance (Table 3.3). Set exposed_to_weather = true for outdoor steel.');
  if (t !== undefined && p1 !== undefined) checks.push({ check: 'p1 ≤ min(14t, 200 mm) (Table 3.3 maximum)', value: `${p1} ≤ ${Math.min(14 * t, 200)} mm`, pass: p1 <= Math.min(14 * t, 200) });
  if (t !== undefined && p2 !== undefined) checks.push({ check: 'p2 ≤ min(14t, 200 mm) (Table 3.3 maximum)', value: `${p2} ≤ ${Math.min(14 * t, 200)} mm`, pass: p2 <= Math.min(14 * t, 200) });
  if (FvEd !== undefined && FtEd !== undefined) {
    const inter = FvEd / FvRd + FtEd / (1.4 * FtRd);
    checks.push({ check: 'Combined Fv,Ed/Fv,Rd + Ft,Ed/(1.4·Ft,Rd) ≤ 1', value: r(inter, 3).toString(), pass: inter <= 1 });
  }
  const notChecked = [
    FvEd === undefined ? 'Fv,Ed not given, so shear/bearing demand was not checked' : null,
    FvEd !== undefined && out.Fb_Rd_kN === undefined ? 'plate bearing (give t_ply_mm, fu_ply_MPa and e1_mm)' : null,
    FtEd === undefined ? 'Ft,Ed not given, so tension demand was not checked' : null,
  ].filter(Boolean);
  return { ...out, checks, ...(notChecked.length ? { not_checked: notChecked } : {}), assumptions, method: 'EN 1993-1-8 Table 3.4 (γM2 = 1.25)' };
}

// ───────────────────────────── Geotechnics ──────────────────────────────

/** Ultimate bearing capacity, classical equation: Terzaghi's form and shape
 *  factors with Nc and Nq from Prandtl–Reissner and Nγ from Vesić. It is
 *  neither Terzaghi's own factors nor EC7 (2026-10-27 audit); the EC7 Annex D
 *  check is bearingEc7 below. qa = qu / FS. */
export function bearingCapacity(b: Body) {
  const c = pick(b, 'c_kPa'), phiDeg = pick(b, 'phi_deg'), gamma = pick(b, 'gamma_kN_m3'), B = pick(b, 'B_m'), Df = pick(b, 'Df_m', 'D_m');
  const err = missing({ c_kPa: c, phi_deg: phiDeg, gamma_kN_m3: gamma, B_m: B, Df_m: Df });
  if (err) return err;
  if (!(phiDeg! >= 0 && phiDeg! < 50) || !(B! > 0) || Df! < 0 || c! < 0) return bad('Need 0 ≤ φ < 50°, B > 0, Df ≥ 0 and c ≥ 0');
  if (!(gamma! > 0 && gamma! <= 30)) return bad('gamma_kN_m3 (soil unit weight) must be between 0 and 30 kN/m³');
  if (c! > 1000) return bad('c_kPa above 1,000 kPa is rock, not a soil cohesion this method applies to');
  if (B! > 50 || Df! > 50) return bad('B_m and Df_m above 50 m are outside shallow-foundation practice');
  const shape = String(b.shape ?? 'strip');
  const SHAPE: Record<string, { sc: number; sg: number }> = { strip: { sc: 1, sg: 0.5 }, square: { sc: 1.3, sg: 0.4 }, circular: { sc: 1.3, sg: 0.3 } };
  const s = SHAPE[shape];
  if (!s) return bad('shape must be strip, square or circular (rectangular needs the footing length; not supported here)');
  const phi = phiDeg! * DEG;
  const Nq = Math.exp(Math.PI * Math.tan(phi)) * Math.pow(Math.tan(Math.PI / 4 + phi / 2), 2);
  const Nc = phi === 0 ? 5.14 : (Nq - 1) / Math.tan(phi);
  const Ng = 2 * (Nq + 1) * Math.tan(phi);
  const q = gamma! * Df!;
  const qu = s.sc * c! * Nc + q * Nq + s.sg * gamma! * B! * Ng;
  // FS = 1 made the "allowable" pressure the ultimate (audit 2026-10-31).
  const FS = opt(b, 'FS', 3, (x) => x >= 1.5 && x <= 10, 'between 1.5 and 10');
  return {
    qu_kPa: r(qu, 1),
    qa_kPa: r(qu / FS, 1),
    factor_of_safety: FS,
    Nc: r(Nc), Nq: r(Nq), Ngamma: r(Ng),
    ...(phiDeg === 0 && shape !== 'strip' ? { warning: 'Undrained square or circular footing: this classical shape factor (1.3) gives about 8% more than EC7 Annex D (1.2). Use the EC7 bearing check for design.' } : {}),
    assumptions: ['Vertical, central load on level ground', 'Water table below the zone of influence', 'Settlement not checked', 'Classical equation (Terzaghi form; Prandtl–Reissner Nc, Nq; Vesić Nγ); for a Eurocode design use the EC7 Annex D check'],
    method: "Classical bearing equation: Terzaghi's form and shape factors; Nc, Nq (Prandtl–Reissner), Nγ (Vesić)",
  };
}

/**
 * EN 1997-1 Annex D bearing resistance, drained (c′, φ′) or undrained (cu),
 * rectangular B × L, central vertical load with an optional horizontal load
 * along B, groundwater, and Design Approach 1 (combinations 1 and 2, the UK
 * and Kenyan practice). Annex D has no depth factors: the embedment enters
 * only as the overburden q.
 */
export function bearingEc7(b: Body) {
  const cond = String(b.condition ?? '').toLowerCase();
  if (cond !== 'drained' && cond !== 'undrained') return { error: 'Missing or invalid input: condition (drained or undrained)', missing: ['condition'] };
  const B = pick(b, 'B_m'), Df = pick(b, 'Df_m'), gamma = pick(b, 'gamma_kN_m3');
  const err = missing({ B_m: B, Df_m: Df, gamma_kN_m3: gamma });
  if (err) return err;
  // shape "strip" wins over any L_m the form also sent (strip = per metre run).
  const shapeIn = b.shape == null || b.shape === '' ? 'rectangular' : String(b.shape);
  if (!['rectangular', 'square', 'strip'].includes(shapeIn)) return { error: 'Invalid input: shape must be rectangular or strip', missing: ['shape'] };
  const isStrip = shapeIn === 'strip';
  const Lgiven = isStrip ? undefined : optN(b, 'L_m');
  const L = Lgiven ?? (isStrip ? Infinity : B!);
  if (!(B! > 0 && B! <= 50) || !(L >= B!) || !(Df! >= 0 && Df! <= 20)) return bad('Need 0 < B_m ≤ 50, L_m ≥ B_m (B is the shorter side) and 0 ≤ Df_m ≤ 20');
  // Upper bounds (2026-10-29 audit: L_m 1e9 and Gk 1e12 were accepted).
  if (Lgiven !== undefined && Lgiven > 200) return bad('L_m must be at most 200 m (for a long footing use shape: "strip")');
  if (shapeIn === 'square' && Lgiven !== undefined && Lgiven !== B) return bad('shape "square" needs L_m equal to B_m: use shape "rectangular" for a different length');
  if (!(gamma! >= 10 && gamma! <= 25)) return bad('gamma_kN_m3 (bulk unit weight) must be between 10 and 25 kN/m³');
  const dw = optN(b, 'water_depth_m');
  if (dw !== undefined && dw < 0) return bad('water_depth_m (depth of the water table below ground) must be 0 or more');
  const Gk = optN(b, 'Gk_kN'), Qk = optN(b, 'Qk_kN') ?? 0, Hk = optN(b, 'H_kN') ?? 0;
  if ((Gk !== undefined && Gk < 0) || Qk < 0 || Hk < 0) return bad('Gk_kN, Qk_kN and H_kN are load magnitudes: 0 or more');
  if ((Gk ?? 0) > 1e6 || Qk > 1e6 || Hk > 1e6) return bad('Gk_kN, Qk_kN and H_kN must each be at most 1,000,000 kN');
  if (Hk > 0 && Gk === undefined) return bad('A horizontal load H_kN needs the vertical loads Gk_kN (and Qk_kN) for the inclination factors');
  // A variable load with no permanent load was ignored: Qk 50,000 kN gave no
  // check at all (audit 2026-10-31).
  if (Qk > 0 && Gk === undefined) return bad('Enter the permanent load Gk_kN as well as Qk_kN (0 if there is none; include the footing and backfill)');
  const hType = String(b.H_type ?? 'variable');
  if (hType !== 'variable' && hType !== 'permanent') return { error: 'Invalid input: H_type must be variable or permanent', missing: ['H_type'] };
  const strip = !Number.isFinite(L);
  const A = strip ? B! : B! * L;        // per metre run for a strip
  const BL = strip ? 0 : B! / L;
  const gw = 9.81;
  // Effective stresses (§2.4.6.1, Annex D): overburden q′ and γ′ below the base.
  const qTotal = gamma! * Df!; // undrained (Annex D.3) uses the total overburden
  let q = qTotal, gEff = gamma!;
  if (dw !== undefined) {
    if (dw <= Df!) { q = gamma! * dw + (gamma! - gw) * (Df! - dw); gEff = gamma! - gw; }
    else if (dw < Df! + B!) gEff = (gamma! - gw) + ((dw - Df!) / B!) * gw;
  }
  const assumptions: string[] = [
    'Central load, level ground, horizontal base (eccentric loads: use B′ = B − 2e)',
    dw === undefined ? 'Water table assumed deeper than Df + B (give water_depth_m if not)' : `Water table ${dw} m below ground: effective stresses used`,
    'No depth factors (EN 1997-1 Annex D has none); settlement is a separate check',
    'Design Approach 1 (UK/Kenya practice): C1 = A1+M1+R1, C2 = A2+M2+R1; γR,v = 1.0',
    ...(Lgiven === undefined && Number.isFinite(L) ? ['L_m not given: a square footing (L = B) was assumed'] : []),
  ];
  const combos = [
    { name: 'DA1-C1', gG: 1.35, gQ: 1.5, gPhi: 1.0, gC: 1.0, gCu: 1.0 },
    { name: 'DA1-C2', gG: 1.0, gQ: 1.3, gPhi: 1.25, gC: 1.25, gCu: 1.4 },
  ];
  const results: Array<Record<string, any>> = [];
  let cKc = 0, phiK = 0, cuK = 0;
  if (cond === 'drained') {
    const c = pick(b, 'c_kPa'), phi = pick(b, 'phi_deg');
    const e2 = missing({ c_kPa: c, phi_deg: phi });
    if (e2) return e2;
    if (!(c! >= 0 && c! <= 200) || !(phi! > 0 && phi! <= 45)) return bad("Drained: need 0 ≤ c′ (c_kPa) ≤ 200 kPa and 0 < φ′ (phi_deg) ≤ 45°");
    cKc = c!; phiK = phi!;
  } else {
    const cu = pick(b, 'cu_kPa');
    if (cu === undefined) return missing({ cu_kPa: cu })!;
    if (!(cu > 0 && cu <= 500)) return bad('Undrained: cu_kPa must be between 0 and 500 kPa');
    cuK = cu;
  }
  for (const k of combos) {
    const Vd = Gk !== undefined ? k.gG * Gk + k.gQ * Qk : undefined;
    // Wind and other variable horizontal loads take γQ. Treated as permanent
    // without saying so, a wind case read PASS at 0.99 against 1.12 by hand
    // (audit 2026-10-31).
    const Hd = Hk ? (hType === 'permanent' ? k.gG : k.gQ) * Hk : 0;
    // Inclination factors with the MINIMUM vertical load (G only, γ = 1.0):
    // the full factored V made them favourable (2026-10-29 audit).
    const Vmin = Gk !== undefined ? Gk : undefined;
    let qult: number;
    let incFail = false;
    const f: Record<string, number> = {};
    if (cond === 'drained') {
      const phi = Math.atan(Math.tan(phiK * DEG) / k.gPhi);
      const c = cKc / k.gC;
      const Nq = Math.exp(Math.PI * Math.tan(phi)) * Math.pow(Math.tan(Math.PI / 4 + phi / 2), 2);
      const Nc = (Nq - 1) / Math.tan(phi);
      const Ng = 2 * (Nq - 1) * Math.tan(phi);
      const sq = 1 + BL * Math.sin(phi), sg = 1 - 0.3 * BL, sc = (sq * Nq - 1) / (Nq - 1);
      let iq = 1, ig = 1, ic = 1;
      if (Hd > 0 && Vmin !== undefined) {
        const m = strip ? 2 : (2 + BL) / (1 + BL);
        const base = 1 - Hd / (Vmin! + A * c / Math.tan(phi));
        // H beyond the inclined-load limit is a FAIL, not an input error
        // (2026-10-30 re-audit): no bearing resistance at that inclination.
        if (!(base > 0)) { incFail = true; iq = 0; ig = 0; ic = 0; }
        else { iq = Math.pow(base, m); ig = Math.pow(base, m + 1); ic = Math.max(0, iq - (1 - iq) / (Nc * Math.tan(phi))); }
      }
      qult = incFail ? 0 : c * Nc * sc * ic + q * Nq * sq * iq + 0.5 * gEff * B! * Ng * sg * ig;
      Object.assign(f, { phi_d_deg: r(phi / DEG, 2), c_d_kPa: r(c, 1), Nc: r(Nc), Nq: r(Nq), Ngamma: r(Ng), sc: r(sc, 3), sq: r(sq, 3), sgamma: r(sg, 3), ic: r(ic, 3), iq: r(iq, 3), igamma: r(ig, 3) });
    } else {
      const cu = cuK / k.gCu;
      const sc = 1 + 0.2 * BL;
      let ic = 1;
      if (Hd > 0) {
        if (Hd >= A * cu) { incFail = true; ic = 0; }
        else ic = 0.5 * (1 + Math.sqrt(1 - Hd / (A * cu)));
      }
      qult = incFail ? 0 : (Math.PI + 2) * cu * sc * ic + qTotal;
      Object.assign(f, { cu_d_kPa: r(cu, 1), sc: r(sc, 3), ic: r(ic, 3) });
    }
    const Rd = qult * A; // γR,v = 1.0
    // Sliding, EN 1997-1 §6.5.3 (γR,h = 1.0 in DA1): drained R = V′·tan δd with
    // δ = φ′d for cast-in-place concrete (§6.5.3(10)); undrained R = A·cu,d.
    // The vertical load is favourable here, so G only with γ = 1.0.
    let sliding: Record<string, unknown> = {};
    if (Hd > 0 && Vmin !== undefined) {
      // Drained: effective vertical load, less water uplift on the base when
      // the water table is above it. Undrained: A·cu,d, but at most 0.4·V
      // (EN 1997-1 §6.5.3(12), where water or air can reach the interface).
      const uplift = dw !== undefined && dw < Df! ? gw * (Df! - dw) * A : 0;
      const RhD = cond === 'drained'
        ? Math.max(0, Vmin - uplift) * Math.tan(Math.atan(Math.tan(phiK * DEG) / k.gPhi))
        : Math.min(A * (cuK / k.gCu), 0.4 * Vmin);
      sliding = { H_Ed_kN: r(Hd, 1), sliding_R_d_kN: r(RhD, 1), sliding_utilisation: RhD > 0 ? r(Hd / RhD, 3) : 'no sliding resistance' };
    }
    results.push({
      combination: k.name,
      q_Rd_kPa: r(qult, 1),
      R_Rd_kN: r(Rd, 1),
      ...(incFail ? { bearing_not_possible: true } : {}),
      ...(Vd !== undefined ? (incFail ? { V_Ed_kN: r(Vd, 1) } : { V_Ed_kN: r(Vd, 1), utilisation: r(Vd / Rd, 3) }) : {}),
      ...sliding,
      ...f,
    });
  }
  // With loads, the governing combination is the one with the highest
  // utilisation (2026-10-29 audit: the lowest resistance was named governing
  // while the other combination was more highly utilised); without loads,
  // the lowest design resistance.
  const util = (x: Record<string, any>) => (x.bearing_not_possible ? Infinity : (x.utilisation as number));
  const gov = Gk !== undefined
    ? results.reduce((a, x) => (util(x) > util(a) ? x : a))
    : results.reduce((a, x) => (x.q_Rd_kPa < a.q_Rd_kPa ? x : a));
  const checks = Gk !== undefined ? results.map((x) => x.bearing_not_possible
    ? { check: `Bearing (${x.combination})`, value: 'the horizontal load is beyond the limit for an inclined load: no bearing resistance', pass: false }
    : { check: `V_Ed ≤ R_d (${x.combination})`, value: `${x.V_Ed_kN} ≤ ${x.R_Rd_kN} kN${strip ? '/m' : ''}`, pass: (x.V_Ed_kN as number) <= x.R_Rd_kN }) : [];
  for (const x of results) {
    if (x.sliding_R_d_kN !== undefined) checks.push({ check: `Sliding H_Ed ≤ R_h,d (${x.combination}, §6.5.3)`, value: `${x.H_Ed_kN} ≤ ${x.sliding_R_d_kN} kN${strip ? '/m' : ''}`, pass: (x.H_Ed_kN as number) <= (x.sliding_R_d_kN as number) });
  }
  if (Hk > 0) assumptions.push(`Horizontal load treated as ${hType} (γ = ${hType === 'permanent' ? '1.35 / 1.0' : '1.5 / 1.3'} in C1 / C2), acting together with Qk with no ψ reduction`);
  if (Hk > 0) assumptions.push(cond === 'drained'
    ? 'Sliding: R_h,d = (G_k − water uplift)·tan δd with δ = φ′d (cast-in-place base); passive resistance ignored'
    : 'Sliding: R_h,d = A·cu,d, at most 0.4·G_k (§6.5.3(12): water or air may reach the interface); passive resistance ignored');
  if (Gk === undefined) assumptions.push('No loads given: design resistances only. Give Gk_kN and Qk_kN (characteristic, including the footing and backfill) to check the footing.');
  return {
    q_Rd_kPa: gov.q_Rd_kPa,
    governing_combination: gov.combination,
    ...(gov.utilisation !== undefined ? { utilisation: gov.utilisation } : {}),
    footing: strip ? `Strip, B = ${B} m (per metre run)` : `${B} × ${L} m`,
    q_overburden_kPa: r(q, 1),
    combinations: results,
    checks,
    assumptions,
    method: 'EN 1997-1 Annex D bearing resistance, Design Approach 1',
  };
}

// ───────────────────────────── Hydrology ────────────────────────────────

/** Rational method Q = C·i·A / 360 (Q m³/s, i mm/h, A ha). */
export function rationalRunoff(b: Body) {
  const C = pick(b, 'runoff_c', 'C'), i = pick(b, 'rainfall_intensity_mm_hr', 'i_mm_h'), A = pick(b, 'area_ha', 'A_ha');
  const err = missing({ runoff_c: C, rainfall_intensity_mm_hr: i, area_ha: A });
  if (err) return err;
  if (!(C! > 0 && C! <= 1)) return bad('runoff_c must be between 0 and 1');
  if (!(i! > 0 && A! > 0)) return bad('rainfall_intensity_mm_hr and area_ha must be > 0');
  if (i! > 500) return bad('rainfall_intensity_mm_hr above 500 mm/h is beyond any recorded design storm; check the units (mm per hour)');
  // 2026-10-27 audit: 1e300 ha returned 6.9e298 m³/s and 1e308 a null, both as success.
  if (A! > 1000) return bad('area_ha above 1,000 ha (10 km²) is far beyond the rational method (about 80 ha): use a unit-hydrograph or routing method');
  return {
    Q_m3_s: r((C! * i! * A!) / 360, 3),
    Q_L_s: r((C! * i! * A!) / 0.36, 0),
    ...(A! > 80 ? { warning: `${A} ha is above the rational method's usual limit of about 80 ha; use a unit-hydrograph or routing method for a catchment this size.` } : {}),
    assumptions: ['Intensity for a storm lasting the time of concentration', 'Best for catchments under about 80 ha'],
    method: 'Rational method Q = C·i·A/360',
  };
}

/** Kirpich (1940) time of concentration: Tc (min) = 0.0195·L^0.77·S^-0.385 (L m, S m/m). */
export function kirpich(b: Body) {
  const L = pick(b, 'length_m', 'L_m'), S = pick(b, 'slope_m_per_m', 'slope');
  const err = missing({ length_m: L, slope_m_per_m: S });
  if (err) return err;
  if (!(L! > 0 && S! > 0)) return bad('length_m and slope_m_per_m must be > 0');
  if (S! >= 1) return bad('slope_m_per_m is a gradient (rise ÷ run): 0.05 means 5%. Values of 1 or more are not catchment slopes.');
  if (L! > 100000) return bad('length_m above 100 km is not a small catchment; Kirpich applies to small rural catchments');
  if (L! < 10) return bad('length_m below 10 m is not a catchment flow path (Kirpich uses the longest flow path in metres)');
  const outside = S! < 0.03 || S! > 0.1;
  const long = L! > 10000;
  const warn = [outside ? `Kirpich was fitted to slopes of 3–10%; ${r(S! * 100, 1)}% is outside that range.` : '', long ? `A ${r(L! / 1000, 1)} km flow path is longer than the small catchments Kirpich was fitted to.` : ''].filter(Boolean).join(' ');
  return {
    Tc_min: r(0.0195 * Math.pow(L!, 0.77) * Math.pow(S!, -0.385)),
    ...(warn ? { warning: `${warn} Treat the time as indicative.` } : {}),
    method: 'Kirpich (1940), small rural catchments',
  };
}

/** Typical runoff coefficients (ASCE Manual 77 / WEF MOP FD-20 ranges). */
export function runoffCoefficients() {
  return {
    items: [
      { surface: 'Asphalt/concrete', C_min: 0.7, C_max: 0.95 },
      { surface: 'Roof', C_min: 0.75, C_max: 0.95 },
      { surface: 'Gravel/macadam', C_min: 0.4, C_max: 0.6 },
      { surface: 'Lawn (sandy, flat)', C_min: 0.05, C_max: 0.1 },
      { surface: 'Lawn (clay, steep)', C_min: 0.25, C_max: 0.35 },
      { surface: 'Forest', C_min: 0.05, C_max: 0.25 },
      { surface: 'Bare soil', C_min: 0.2, C_max: 0.6 },
    ],
    source: 'ASCE Manual 77, Urban Stormwater Management',
  };
}

// ───────────── Added 2026-10-27 (audit: no shear, deflection, footing or EN 1998) ─────────────

/** EN 1992-1-1 §6.2 shear: VRd,c (§6.2.2) and, with links, VRd,s and VRd,max
 *  by the variable strut inclination method (§6.2.3), 1 ≤ cot θ ≤ 2.5. */
export function ec2Shear(b: Body) {
  const bw = pick(b, 'bw_mm', 'b_mm'), d = pick(b, 'd_mm'), fck = pick(b, 'fck_MPa'), Asl = pick(b, 'Asl_mm2', 'As_mm2');
  const err = missing({ bw_mm: bw, d_mm: d, fck_MPa: fck, Asl_mm2: Asl });
  if (err) return err;
  if (!(bw! >= 50 && bw! <= 5000) || !(d! >= 50 && d! <= 5000)) return bad('bw_mm and d_mm must be between 50 and 5,000 mm');
  if (!(fck! >= 12 && fck! <= 50)) return bad('fck_MPa must be between 12 and 50 MPa');
  if (!(Asl! > 0 && Asl! <= 0.08 * bw! * d!)) return bad('Asl_mm2 (anchored tension steel) must be greater than 0 and a realistic area for the section');
  const VEd = optN(b, 'VEd_kN');
  if (VEd !== undefined && !(VEd >= 0 && VEd <= 1e5)) return bad('VEd_kN must be between 0 and 100,000 kN');
  const Asw = optN(b, 'Asw_mm2'), s = optN(b, 's_mm');
  const fywk = opt(b, 'fywk_MPa', 500, (x) => x >= 250 && x <= 600, 'between 250 and 600 MPa');
  // The form keeps its spacing when "blank = no links" is used, so a spacing
  // alone means no links (audit 2026-10-31). Links without a spacing cannot be checked.
  if (Asw !== undefined && s === undefined) return bad('Give s_mm (link spacing) with Asw_mm2 (area of all link legs)');
  if (Asw !== undefined && !(Asw > 0 && s! > 0 && s! <= 1000)) return bad('Asw_mm2 must be > 0 and s_mm between 0 and 1,000 mm');
  const k = Math.min(1 + Math.sqrt(200 / d!), 2);
  const rhoL = Math.min(Asl! / (bw! * d!), 0.02);
  const vRdc = Math.max(0.12 * k * Math.cbrt(100 * rhoL * fck!), 0.035 * Math.pow(k, 1.5) * Math.sqrt(fck!));
  const VRdc = vRdc * bw! * d! / 1000;
  const z = 0.9 * d!;
  const nu1 = 0.6 * (1 - fck! / 250);
  const fcd = fck! / 1.5; // αcc = 1.0 for shear (UK NA)
  const fywd = fywk / 1.15;
  const VRdmax = (cot: number) => (bw! * z * nu1 * fcd) / (cot + 1 / cot) / 1000;
  let cot = 2.5;
  const checks: Array<{ check: string; value: string; pass: boolean }> = [];
  const out: Record<string, unknown> = { V_Rd_c_kN: r(VRdc, 1), size_factor_k: r(k, 3), rho_l: r(rhoL, 4) };
  if (VEd !== undefined) {
    const X = (bw! * z * nu1 * fcd) / (VEd * 1000);
    if (X < 2) {
      checks.push({ check: 'V_Ed ≤ V_Rd,max at θ = 45° (strut crushing)', value: `${VEd} ≤ ${r(VRdmax(1), 1)} kN`, pass: false });
      return { ...out, V_Rd_max_kN: r(VRdmax(1), 1), checks, warning: 'The concrete struts crush even at θ = 45°: enlarge the section or raise fck.', method: 'EN 1992-1-1 §6.2.2 and §6.2.3' };
    }
    cot = Math.min(2.5, (X + Math.sqrt(X * X - 4)) / 2);
    out.cot_theta = r(cot, 3);
    out.V_Rd_max_kN = r(VRdmax(cot), 1);
    out.Asw_over_s_required_mm2_per_mm = VEd > VRdc ? r((VEd * 1000) / (z * fywd * cot), 3) : 0;
    // Without links V_Rd,c is the check; with links it is information only and
    // the verdict is V_Rd,s (2026-10-29 audit: adequate links showed FAIL).
    if (Asw === undefined) checks.push({ check: 'V_Ed ≤ V_Rd,c (no design links)', value: `${VEd} ≤ ${r(VRdc, 1)} kN`, pass: VEd <= VRdc });
    else out.V_Ed_over_V_Rd_c = VEd <= VRdc ? 'V_Ed ≤ V_Rd,c: minimum links suffice' : 'V_Ed > V_Rd,c: design links required (checked below)';
    checks.push({ check: 'V_Ed ≤ V_Rd,max (strut crushing)', value: `${VEd} ≤ ${r(VRdmax(cot), 1)} kN`, pass: VEd <= VRdmax(cot) });
  } else {
    out.V_Rd_max_kN = r(VRdmax(cot), 1);
  }
  const rhoWmin = (0.08 * Math.sqrt(fck!)) / fywk;
  out.Asw_over_s_min_mm2_per_mm = r(rhoWmin * bw!, 3);
  if (Asw !== undefined) {
    // Eq. 6.12: links beyond Asw,max·fywd/(bw·s) = ½ν1·fcd add nothing (the
    // struts govern); Asw 1e9 mm² gave V_Rd,s = 4.9e9 kN (2026-10-29 audit).
    const AswMax = (0.5 * nu1 * fcd * bw! * s!) / fywd;
    if (Asw > 20 * AswMax) return bad(`Asw_mm2 is not a realistic link area for this section (Eq. 6.12 maximum effective area ${Math.round(AswMax)} mm² at s = ${s} mm)`);
    const AswEff = Math.min(Asw, AswMax);
    if (Asw > AswMax) out.warning = `Asw exceeds the Eq. 6.12 maximum effective area (${Math.round(AswMax)} mm²): only that area is counted.`;
    const VRds = (AswEff / s!) * z * fywd * cot / 1000;
    out.V_Rd_s_kN = r(VRds, 1);
    out.V_Rd_kN = r(Math.min(VRds, VRdmax(cot)), 1);
    checks.push({ check: 'Links ≥ minimum ρw,min = 0.08√fck/fyk (§9.2.2)', value: `${r(Asw / s!, 3)} ≥ ${r(rhoWmin * bw!, 3)} mm²/mm`, pass: Asw / s! >= rhoWmin * bw! });
    checks.push({ check: 'Link spacing s ≤ 0.75·d (§9.2.2)', value: `${s} ≤ ${r(0.75 * d!, 0)} mm`, pass: s! <= 0.75 * d! });
    if (VEd !== undefined) checks.push({ check: 'V_Ed ≤ V_Rd,s (links)', value: `${VEd} ≤ ${r(VRds, 1)} kN`, pass: VEd <= VRds });
  }
  return {
    ...out,
    checks,
    // Only the link detailing is checked without a demand (audit 2026-10-31: a
    // blank V_Ed showed a bare PASS).
    ...(VEd === undefined ? { not_checked: ['V_Ed not given, so the shear demand was not checked'] } : {}),
    assumptions: [
      'No axial force (σcp = 0); vertical links; z = 0.9d',
      'CRd,c = 0.18/γc, vmin = 0.035·k^1.5·√fck, αcc = 1.0 for shear, γs = 1.15 (recommended / UK NA)',
      VEd !== undefined ? `cot θ = ${r(cot, 3)}: the flattest strut (≤ 2.5) for which V_Rd,max ≥ V_Ed` : 'No V_Ed given: cot θ = 2.5',
      'Beams need at least the minimum links even where V_Ed ≤ V_Rd,c (§6.2.1(4), §9.2.2)',
    ],
    method: 'EN 1992-1-1 §6.2.2 (members without shear reinforcement) and §6.2.3 (variable strut inclination)',
  };
}

/** EN 1992-1-1 §7.4.2 span/effective-depth check, Eq. 7.16 with the
 *  §7.4.2(2) modifications (steel stress, long spans, flanged sections). */
const DEFL_K: Record<string, number> = { simply_supported: 1.0, end_span: 1.3, interior_span: 1.5, flat_slab: 1.2, cantilever: 0.4 };
export function ec2Deflection(b: Body) {
  const span = pick(b, 'span_m'), d = pick(b, 'd_mm'), bw = pick(b, 'b_mm'), AsReq = pick(b, 'As_req_mm2'), fck = pick(b, 'fck_MPa');
  const err = missing({ span_m: span, d_mm: d, b_mm: bw, As_req_mm2: AsReq, fck_MPa: fck });
  if (err) return err;
  const system = String(b.system ?? '');
  const K = DEFL_K[system];
  if (K === undefined) return { error: `Missing or invalid input: system (${Object.keys(DEFL_K).join(', ')})`, missing: ['system'] };
  if (!(span! > 0 && span! <= 30)) return bad('span_m must be between 0 and 30 m');
  if (!(d! >= 50 && d! <= 3000) || !(bw! >= 50 && bw! <= 10000)) return bad('d_mm must be between 50 and 3,000 mm and b_mm between 50 and 10,000 mm (1,000 for a slab per metre)');
  if (!(fck! >= 12 && fck! <= 50)) return bad('fck_MPa must be between 12 and 50 MPa');
  if (!(AsReq! > 0)) return bad('As_req_mm2 (tension steel required at mid-span) must be > 0');
  const AsProv = optN(b, 'As_prov_mm2') ?? AsReq!;
  const Asc = optN(b, 'Asc_mm2') ?? 0;
  const fyk = opt(b, 'fyk_MPa', 500, (x) => x >= 400 && x <= 600, 'between 400 and 600 MPa');
  const flange = optN(b, 'beff_over_bw') ?? 1;
  if (AsProv < AsReq!) return bad('As_prov_mm2 must be at least As_req_mm2');
  if (Asc < 0 || flange < 1) return bad('Asc_mm2 must be 0 or more and beff_over_bw at least 1');
  // §9.2.1.1(3): steel outside laps is at most 4% of the section (2026-10-29
  // audit: As,req 1e9 mm² gave ρ = 740,741%).
  if (AsProv / (bw! * d!) > 0.04 || Asc / (bw! * d!) > 0.04) return bad('As_req_mm2, As_prov_mm2 and Asc_mm2 must each be at most 4% of b·d (EN 1992-1-1 §9.2.1.1(3))');
  // Eq. 7.16b divides by (ρ − ρ′): with compression steel at or above the
  // tension steel the limit is undefined (it read "13.3 ≤ Infinity", PASS).
  if (Asc >= AsReq!) return bad('Asc_mm2 (compression steel) must be less than As_req_mm2: Eq. 7.16b is not defined when ρ′ ≥ ρ. Check this member by a calculated deflection (§7.4.3).');
  const rho0 = Math.sqrt(fck!) / 1000;
  // ρ is at least the §9.2.1.1 minimum (2026-10-29 audit: As,req 50 mm² gave
  // an allowed l/d of 1867).
  const rhoMin = Math.max(0.26 * (0.3 * Math.pow(fck!, 2 / 3)) / fyk, 0.0013);
  const rhoRaw = AsReq! / (bw! * d!);
  const rho = Math.max(rhoRaw, rhoMin);
  const rhoC = Asc / (bw! * d!);
  const sf = Math.sqrt(fck!);
  // Eq. 7.16b divides by (ρ − ρ′): as ρ′ approaches ρ the limit grows without
  // bound (2026-10-30 re-audit: Asc 1199 on As,req 1200 gave l/d 7471, PASS).
  // Below ρ − ρ′ = ρ0 the equation is outside its range.
  if (rho > rho0 && rho - rhoC < rho0) return bad(`Compression steel too close to the tension steel for Eq. 7.16b (ρ − ρ′ = ${r((rho - rhoC) * 100, 3)}% is below ρ0 = ${r(rho0 * 100, 3)}%): check this member by a calculated deflection (§7.4.3)`);
  const basic = rho <= rho0
    ? K * (11 + 1.5 * sf * rho0 / rho + 3.2 * sf * Math.pow(rho0 / rho - 1, 1.5))
    : K * (11 + 1.5 * sf * rho0 / (rho - rhoC) + (sf / 12) * Math.sqrt(rhoC / rho0));
  const steel = Math.min(500 / (fyk * AsReq! / AsProv), 1.5);
  const longSpan = system === 'flat_slab' ? (span! > 8.5 ? 8.5 / span! : 1) : system !== 'cantilever' && span! > 7 ? 7 / span! : 1;
  const flanged = flange > 3 ? 0.8 : 1;
  const allowed = basic * steel * longSpan * flanged;
  const actual = (span! * 1000) / d!;
  if (!Number.isFinite(allowed) || allowed <= 0) return bad('The span/depth limit could not be evaluated for these inputs; check this member by a calculated deflection (§7.4.3).');
  return {
    l_over_d_allowed: r(allowed, 1),
    l_over_d_actual: r(actual, 1),
    basic_l_over_d: r(basic, 1),
    factors: { structural_system_K: K, steel_stress: r(steel, 3), long_span: r(longSpan, 3), flanged },
    ...(rhoRaw < rhoMin || rho < 0.003 ? { warning: [
      rhoRaw < rhoMin ? `As,req is below As,min (${Math.ceil(rhoMin * bw! * d!)} mm²): the minimum steel ratio was used.` : '',
      rho < 0.003 ? 'At steel ratios below 0.3% Eq. 7.16 gives very large span/depth limits: for a lightly reinforced member check a calculated deflection (§7.4.3).' : '',
    ].filter(Boolean).join(' ') } : {}),
    rho_pct: r(rho * 100, 3), rho0_pct: r(rho0 * 100, 3),
    // Eq. 7.16a grows without bound at low ρ: a 6.5 m slab with d = 90 passed at
    // l/d 72 (audit 2026-10-31). Common UK practice caps the limit at 40·K.
    checks: [
      { check: 'Span/d ≤ allowed (§7.4.2)', value: `${r(actual, 1)} ≤ ${r(allowed, 1)}`, pass: actual <= allowed },
      { check: 'Span/d ≤ 40·K (practical cap for lightly reinforced members)', value: `${r(actual, 1)} ≤ ${r(40 * K, 1)}`, pass: actual <= 40 * K },
    ],
    assumptions: [
      'Eq. 7.16 with σs from Eq. 7.17 (310/σs = 500/(fyk·As,req/As,prov)), capped at 1.5 (UK NA)',
      'Span over 7 m (8.5 m for flat slabs) × 7/leff; flanged with beff/bw > 3 × 0.8',
      'A span/depth check, not a calculated deflection: brittle finishes or long-term creep may need §7.4.3',
    ],
    method: 'EN 1992-1-1 §7.4.2 limiting span/depth ratio',
  };
}

/** Square pad footing under a square column: plan size from the allowable
 *  bearing pressure (serviceability loads), then EN 1992-1-1 bending at the
 *  column face, one-way shear at d and punching at 2d (§6.4) under ULS. */
export function padFooting(b: Body) {
  const Ns = pick(b, 'N_sls_kN'), q = pick(b, 'q_allow_kPa'), c = pick(b, 'column_mm'), h = pick(b, 'h_mm'), fck = pick(b, 'fck_MPa');
  const err = missing({ N_sls_kN: Ns, q_allow_kPa: q, column_mm: c, h_mm: h, fck_MPa: fck });
  if (err) return err;
  if (!(Ns! > 0 && Ns! <= 50000)) return bad('N_sls_kN must be between 0 and 50,000 kN');
  if (!(q! >= 50 && q! <= 1000)) return bad('q_allow_kPa must be between 50 and 1,000 kPa (allowable gross bearing pressure from the site investigation)');
  if (!(c! >= 150 && c! <= 2000) || !(h! >= 200 && h! <= 3000)) return bad('column_mm must be between 150 and 2,000 mm and h_mm between 200 and 3,000 mm');
  if (!(fck! >= 20 && fck! <= 50)) return bad('fck_MPa must be between 20 and 50 MPa (C20/25 is the usual minimum for foundations)');
  const Nu = optN(b, 'N_uls_kN');
  if (Nu !== undefined && !(Nu >= Ns! && Nu <= 2 * Ns!)) return bad('N_uls_kN is the factored load: between N_sls_kN and 2 × N_sls_kN');
  const cover = opt(b, 'cover_mm', 50, (x) => x >= 40 && x <= 100, 'between 40 and 100 mm');
  const bar = opt(b, 'bar_mm', 16, (x) => [10, 12, 16, 20, 25, 32].includes(x), '10, 12, 16, 20, 25 or 32');
  const fyk = opt(b, 'fyk_MPa', 500, (x) => x >= 400 && x <= 600, 'between 400 and 600 MPa');
  const backfill = opt(b, 'backfill_kPa', 0, (x) => x >= 0 && x <= 200, 'between 0 and 200 kPa');
  const d = h! - cover - bar; // mean of the two layers
  const selfW = 24 * (h! / 1000);
  const net = q! - selfW - backfill;
  if (!(net > 0)) return bad('The footing and backfill weight use all of q_allow_kPa: check the inputs');
  const B = Math.max(Math.ceil(Math.sqrt(Ns! / net) / 0.05) * 0.05, (c! / 1000) + 0.3);
  if (h! / 1000 > B) return bad(`h_mm = ${h} is deeper than the ${r(B, 2)} m footing is wide: check h_mm and the loads`);
  const pSls = Ns! / (B * B) + selfW + backfill;
  // B is sized FROM the bearing pressure, so that comparison cannot fail and is
  // reported as the sizing basis, not as a check (2026-10-29 audit: "PASS: all
  // 1 checks pass" with nothing structural checked).
  const out: Record<string, unknown> = { B_m: r(B, 2), plan_area_m2: r(B * B, 2), bearing_pressure_sls_kPa: r(pSls, 1), sizing_basis: `B chosen so the SLS bearing pressure ${r(pSls, 1)} kPa ≤ q_allow ${q} kPa`, d_mm: d };
  const checks: Array<{ check: string; value: string; pass: boolean }> = [];
  const assumptions = [
    'Square footing, central axial load, no moment; q_allow is the gross allowable pressure from the site investigation',
    `Footing self-weight 24 kN/m³ × h${backfill ? ` and backfill ${backfill} kPa` : ''} included in the SLS bearing check`,
    `d = h − cover − one bar diameter = ${d} mm (mean of the two layers)`,
  ];
  if (Nu !== undefined) {
    const cM = c! / 1000, dM = d / 1000;
    const pu = Nu / (B * B); // net upward pressure (self-weight causes no bending)
    const l = (B - cM) / 2;
    const m = pu * l * l / 2; // kNm per metre width
    const fctm = 0.3 * Math.pow(fck!, 2 / 3);
    const AsMin = Math.max((0.26 * fctm / fyk) * 1000 * d, 0.0013 * 1000 * d);
    const Kf = (m * 1e6) / (1000 * d * d * fck!);
    let AsReq: number | null = null;
    if (Kf <= 0.167) {
      const zz = Math.min(d * (0.5 + Math.sqrt(0.25 - Kf / 1.134)), 0.95 * d);
      AsReq = Math.max((m * 1e6) / ((fyk / 1.15) * zz), AsMin);
    }
    const AsGiven = optN(b, 'As_prov_mm2_per_m');
    // 2026-10-29 audit: −5 mm²/m was accepted and fed ρl into the shear check.
    if (AsGiven !== undefined && !(AsGiven > 0 && AsGiven <= 0.04 * 1000 * d)) return bad(`As_prov_mm2_per_m must be greater than 0 and at most 4% of the section (${Math.round(0.04 * 1000 * d)} mm²/m)`);
    const AsProv = AsGiven ?? AsReq ?? AsMin;
    const rho = Math.min(AsProv / (1000 * d), 0.02);
    const k = Math.min(1 + Math.sqrt(200 / d), 2);
    const vRdc = Math.max(0.12 * k * Math.cbrt(100 * rho * fck!), 0.035 * Math.pow(k, 1.5) * Math.sqrt(fck!));
    // One-way shear at d from the column face, per metre width.
    const vOne = l > dM ? (pu * (l - dM) * 1000) / (1000 * d) : 0; // MPa
    // Punching, EN 1992-1-1 §6.4.4(2) for footings: every perimeter a from the
    // column face out to 2d, with vRd = vRd,c·2d/a and the soil pressure inside
    // the perimeter deducted; perimeters beyond the footing edge are skipped
    // (2026-10-29 audit: only 2d was checked, up to 6% unconservative).
    let worst = { ratio: 0, a: 2 * d, vEd: 0, vRd: vRdc };
    for (let i = 1; i <= 40; i++) {
      const a = (2 * d * i) / 40; // mm
      if (c! + 2 * a > B * 1000) break;
      const aM = a / 1000;
      const u = 4 * c! + 2 * Math.PI * a;
      const area = cM * cM + 4 * cM * aM + Math.PI * aM * aM;
      const vEdA = (Math.max(0, Nu - pu * area) * 1000) / (u * d);
      const vRdA = vRdc * (2 * d) / a;
      if (vEdA / vRdA > worst.ratio) worst = { ratio: vEdA / vRdA, a, vEd: vEdA, vRd: vRdA };
    }
    const punchingChecked = worst.ratio > 0;
    const vPunch = worst.vEd;
    const u0 = 4 * c!;
    const vFace = (Nu * 1000) / (u0 * d);
    // EN 1992-1-1 §6.4.5(3) recommended 0.4·ν·fcd (the UK NA allows 0.5): the
    // conservative recommended value is used.
    const vRdMax = 0.4 * 0.6 * (1 - fck! / 250) * (fck! / 1.5);
    Object.assign(out, {
      M_Ed_kNm_per_m: r(m, 1),
      As_required_mm2_per_m: AsReq === null ? null : Math.ceil(AsReq),
      As_min_mm2_per_m: Math.ceil(AsMin),
      v_Rd_c_MPa: r(vRdc, 3),
      v_Ed_one_way_MPa: r(vOne, 3),
      ...(punchingChecked ? { v_Ed_punching_MPa: r(vPunch, 3), v_Rd_punching_MPa: r(worst.vRd, 3), punching_perimeter_a_mm: Math.round(worst.a) } : {}),
      v_Ed_column_face_MPa: r(vFace, 3),
      v_Rd_max_MPa: r(vRdMax, 3),
    });
    if (Kf > 0.167) checks.push({ check: "K ≤ K' = 0.167 (no compression steel): deepen the footing", value: r(Kf, 3).toString(), pass: false });
    checks.push({ check: 'One-way shear at d: v_Ed ≤ v_Rd,c', value: `${r(vOne, 3)} ≤ ${r(vRdc, 3)} MPa`, pass: vOne <= vRdc });
    if (punchingChecked) checks.push({ check: `Punching, worst perimeter a = ${Math.round(worst.a)} mm: v_Ed ≤ v_Rd,c·2d/a (§6.4.4(2))`, value: `${r(vPunch, 3)} ≤ ${r(worst.vRd, 3)} MPa`, pass: vPunch <= worst.vRd });
    checks.push({ check: 'Column face: v_Ed ≤ v_Rd,max = 0.4·ν·fcd (§6.4.5, recommended value)', value: `${r(vFace, 3)} ≤ ${r(vRdMax, 3)} MPa`, pass: vFace <= vRdMax });
    if (AsGiven !== undefined && AsReq !== null) checks.push({ check: 'As,prov ≥ As,req (bending at the column face)', value: `${AsGiven} ≥ ${Math.ceil(AsReq)} mm²/m`, pass: AsGiven >= AsReq });
    assumptions.push(punchingChecked ? 'ULS: net upward pressure N_uls/B²; punching scanned over perimeters 0 < a ≤ 2d inside the footing (β = 1, central load)' : 'ULS: net upward pressure N_uls/B²; every punching perimeter lies outside this footing, so punching does not govern (column-face check below)');
    assumptions.push(AsGiven === undefined ? 'ρl for shear taken from the required steel (give As_prov_mm2_per_m for the bars you will use)' : 'ρl for shear from the steel provided');
  } else {
    assumptions.push('Give N_uls_kN (factored load) for the bending, shear and punching checks');
    return {
      ...out, checks, assumptions,
      overall: 'SIZED ONLY: plan size from the allowable bearing pressure; bending, shear and punching NOT checked (give N_uls_kN)',
      all_checks_pass: false,
      not_checked: ['bending at the column face', 'one-way shear', 'punching', 'column-face crushing'],
      method: 'Plan size from allowable bearing',
    };
  }
  return { ...out, checks, assumptions, method: 'Plan size from allowable bearing; EN 1992-1-1 §6.1, §6.2.2 and §6.4 (punching)' };
}

/** EN 1998-1 §4.3.3.2 lateral force method with the §3.2.2.5 design spectrum
 *  (recommended Type 1 / Type 2 values). Fb = Sd(T1)·m·λ. */
const EC8_GROUND: Record<string, Record<string, [number, number, number, number]>> = {
  // [S, TB, TC, TD]
  '1': { A: [1.0, 0.15, 0.4, 2.0], B: [1.2, 0.15, 0.5, 2.0], C: [1.15, 0.2, 0.6, 2.0], D: [1.35, 0.2, 0.8, 2.0], E: [1.4, 0.15, 0.5, 2.0] },
  '2': { A: [1.0, 0.05, 0.25, 1.2], B: [1.35, 0.05, 0.25, 1.2], C: [1.5, 0.1, 0.25, 1.2], D: [1.8, 0.1, 0.3, 1.2], E: [1.6, 0.05, 0.25, 1.2] },
};
const EC8_GAMMA_I: Record<string, number> = { I: 0.8, II: 1.0, III: 1.2, IV: 1.4 };
const EC8_CT: Record<string, number> = { steel_moment_frame: 0.085, concrete_moment_frame: 0.075, eccentric_braced_steel: 0.075, other: 0.05 };
export function seismicEc8(b: Body) {
  const agR = pick(b, 'agR_g'), qf = pick(b, 'q'), W = pick(b, 'W_kN');
  const err = missing({ agR_g: agR, q: qf, W_kN: W });
  if (err) return err;
  if (!(agR! > 0 && agR! <= 0.6)) return bad('agR_g (reference peak ground acceleration on rock, in g) must be between 0 and 0.6');
  if (!(qf! >= 1 && qf! <= 8)) return bad('q (behaviour factor) must be between 1 and 8 (1.5 for low-dissipative DCL structures)');
  if (!(W! > 0 && W! <= 1e7)) return bad('W_kN (seismic weight, G + ψE·Q) must be between 0 and 10,000,000 kN');
  const gt = String(b.ground_type ?? '').toUpperCase();
  const st = String(b.spectrum_type ?? '1');
  if (!EC8_GROUND[st]) return { error: 'Invalid input: spectrum_type must be 1 or 2', missing: ['spectrum_type'] };
  const g = EC8_GROUND[st][gt];
  if (!g) return { error: 'Missing or invalid input: ground_type (A, B, C, D or E)', missing: ['ground_type'] };
  const ic = String(b.importance_class ?? 'II').toUpperCase();
  const gI = EC8_GAMMA_I[ic];
  if (gI === undefined) return { error: 'Invalid input: importance_class must be I, II, III or IV', missing: ['importance_class'] };
  const struct = String(b.structure_type ?? 'other');
  const Ct = EC8_CT[struct];
  if (Ct === undefined) return { error: `Invalid input: structure_type (${Object.keys(EC8_CT).join(', ')})`, missing: ['structure_type'] };
  const storeysGiven = optN(b, 'storeys');
  if (storeysGiven !== undefined && !(Number.isInteger(storeysGiven) && storeysGiven >= 1 && storeysGiven <= 100)) return bad('storeys must be a whole number from 1 to 100');
  const H = optN(b, 'height_m');
  const Tgiven = optN(b, 'T1_s');
  if (H !== undefined && !(H > 0 && H <= 300)) return bad('height_m must be between 0 and 300 m');
  if (Tgiven !== undefined && !(Tgiven > 0 && Tgiven <= 10)) return bad('T1_s must be between 0 and 10 s');
  const [S, TB, TC, TD] = g;
  const ag = gI * agR!;
  // Defaults are stated, never silent (2026-10-29 audit).
  const assumptions: string[] = [
    ...(b.spectrum_type == null ? ['spectrum_type not given: Type 1 used (recommended where the surface-wave magnitude Ms > 5.5)'] : []),
    ...(b.importance_class == null ? ['importance_class not given: class II (ordinary buildings) used'] : []),
    ...(b.structure_type == null ? [`structure_type not given: "other" used (Ct = ${Ct})`] : []),
  ];
  let T: number;
  if (Tgiven !== undefined) { T = Tgiven; assumptions.push('T1 given by the user'); }
  else {
    if (H === undefined) return { error: 'Missing or invalid input: height_m (or T1_s)', missing: ['height_m'] };
    if (H > 40) return bad('T1 = Ct·H^0.75 (Eq. 4.6) applies to buildings up to 40 m: give T1_s from an analysis');
    T = Ct * Math.pow(H, 0.75);
    assumptions.push(`T1 = Ct·H^0.75 = ${Ct}·${H}^0.75 (Eq. 4.6)`);
  }
  const beta = 0.2;
  const Sd = T <= TB ? ag * S * (2 / 3 + (T / TB) * (2.5 / qf! - 2 / 3))
    : T <= TC ? ag * S * 2.5 / qf!
    : T <= TD ? Math.max(ag * S * 2.5 / qf! * (TC / T), beta * ag)
    : Math.max(ag * S * 2.5 / qf! * (TC * TD) / (T * T), beta * ag);
  // λ = 0.85 only when T1 ≤ 2·TC and there are more than two storeys; without
  // a storey count the safe value 1.0 is used (2026-10-29 audit).
  const lambda = storeysGiven !== undefined && T <= 2 * TC && storeysGiven > 2 ? 0.85 : 1.0;
  assumptions.push(storeysGiven === undefined
    ? 'λ = 1.0: storeys not given (λ = 0.85 applies only to buildings of more than two storeys with T1 ≤ 2·TC)'
    : `λ = ${lambda} (${storeysGiven} storeys, T1 ${T <= 2 * TC ? '≤' : '>'} 2·TC = ${r(2 * TC, 2)} s; §4.3.3.2.2)`);
  const Fb = Sd * W! * lambda;
  const limit = Math.min(4 * TC, 2.0);
  // §4.3.3.2.1(2): the method applies only with T1 ≤ min(4·TC, 2 s). Beyond
  // that no base shear is given (2026-10-29 audit: F_b was returned with only
  // a warning).
  const permitted = T <= limit;
  return {
    T1_s: r(T, 3),
    Sd_g: r(Sd, 4),
    lambda,
    method_permitted: permitted,
    // A base shear is a design load, not a pass of the building (2026-10-30
    // re-audit: a green "PASS" banner on a load result could be misread).
    ...(permitted ? { F_b_kN: r(Fb, 1), overall: `LOAD RESULT: base shear F_b = ${r(Fb, 1)} kN for design. The lateral force method applies (T1 ≤ ${r(limit, 2)} s); this is not a check that the building passes.`, all_checks_pass: true } : {
      overall: `NOT PERMITTED: T1 = ${r(T, 2)} s exceeds min(4·TC, 2 s) = ${r(limit, 2)} s; the lateral force method does not apply (§4.3.3.2.1). Use modal response spectrum analysis.`,
      all_checks_pass: false,
    }),
    ag_g: r(ag, 3),
    spectrum: { type: Number(st), ground_type: gt, S, TB_s: TB, TC_s: TC, TD_s: TD },
    checks: [{ check: 'Lateral force method applicable: T1 ≤ min(4·TC, 2 s) (§4.3.3.2.1)', value: `${r(T, 3)} ≤ ${r(limit, 2)} s`, pass: permitted }],
    assumptions: [
      ...assumptions,
      `γI = ${gI} (importance class ${ic}); ag = γI·agR = ${r(ag, 3)} g`,
      'Recommended spectrum values (EN 1998-1 Tables 3.2/3.3) and β = 0.2: a National Annex may differ. agR comes from the national seismic hazard map',
      'Regular in elevation assumed; force distribution over the height (§4.3.3.2.3) and torsion (§4.3.3.2.4) not computed',
    ],
    method: 'EN 1998-1 §4.3.3.2 lateral force method, §3.2.2.5 design spectrum',
  };
}
