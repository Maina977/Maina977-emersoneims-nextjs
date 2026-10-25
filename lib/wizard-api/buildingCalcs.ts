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
  const x = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(x) ? x : undefined;
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
  return { error: message };
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

/** Run a calculator, converting BadInput into a CalcError naming the field. */
export function runCalc(fn: (b: Body) => unknown, b: Body): unknown {
  try {
    return fn(b);
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
  if (!(T! > 0 && T! <= 1)) return bad('T_glass is a light transmittance: between 0 and 1 (clear glazing about 0.7–0.8)');
  if (!(theta! > 0 && theta! <= 90)) return bad('sky_angle_deg is the visible sky angle: between 0 and 90 degrees');
  if (!(M! > 0 && M! <= 1)) return bad('maintenance_factor must be between 0 and 1');
  if (!(W! > 0) || W! >= A!) return bad('window_area_m2 must be > 0 and smaller than total_internal_surface_m2');
  const Aw = W! * ff;
  const ADF = (T! * Aw * theta! * M!) / (A! * (1 - R! * R!));
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
  let S = 0, A = 0;
  if (surfaces && surfaces.length) {
    for (const [i, s] of surfaces.entries()) {
      const area = n(s.area_m2), alpha = n(s.alpha);
      if (area === undefined || alpha === undefined) return bad(`surfaces[${i}] needs area_m2 and alpha`);
      if (!(area > 0)) return bad(`surfaces[${i}].area_m2 must be greater than 0`);
      if (!(alpha >= 0 && alpha <= 1)) return bad(`surfaces[${i}].alpha must be between 0 and 1`);
      S += area; A += area * alpha;
    }
  } else if (legacyA !== undefined) {
    A = legacyA;
  } else {
    return { error: 'Missing or invalid input: surfaces (array of {area_m2, alpha})', missing: ['surfaces'] };
  }
  if (!(A > 0)) return bad('Total absorption must be > 0');
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
  return {
    T60_s: r(T),
    total_absorption_m2_sabin: r(A),
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
    R += d / k;
    rows.push({ layer: String(l.description ?? `Layer ${i + 1}`), R_m2K_W: r(d / k, 3) });
  }
  return {
    U_W_m2K: r(1 / R, 3),
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
  const when = raw ? new Date(String(raw)) : null;
  if (!when || Number.isNaN(when.getTime())) return { error: 'Missing or invalid input: datetime_utc (ISO 8601, e.g. 2026-06-21T12:00:00Z)', missing: ['datetime_utc'] };
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
  const cdir = opt(b, 'cdir', 1, pos, 'greater than 0'), cseason = opt(b, 'cseason', 1, pos, 'greater than 0'), cprob = opt(b, 'cprob', 1, pos, 'greater than 0');
  const co = opt(b, 'co', 1, pos, 'greater than 0'), rho = opt(b, 'rho_kg_m3', 1.25, pos, 'greater than 0');
  if (!(vb0! > 0)) return bad('vb_ms must be > 0');
  if (!(z! > 0 && z! <= 200)) return bad('height_m must be between 0 and 200 m: the EN 1991-1-4 profile (§4.3.2) applies up to 200 m');
  const vb = cdir * cseason * cprob * vb0!;
  const zEff = Math.max(z!, t.zmin);
  const kr = 0.19 * Math.pow(t.z0 / 0.05, 0.07);
  const cr = kr * Math.log(zEff / t.z0);
  const vm = cr * co * vb;
  const Iv = 1 / (co * Math.log(zEff / t.z0));
  const qp = (1 + 7 * Iv) * 0.5 * rho * vm * vm;
  return {
    qp_Pa: r(qp, 0),
    qp_kPa: r(qp / 1000, 3),
    vb_ms: r(vb), vm_ms: r(vm), Iv: r(Iv, 3), cr: r(cr, 3), kr: r(kr, 3),
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
  if (!(SDS! > 0 && SDS! <= 3) || !(SD1! > 0 && SD1! <= 3)) return bad('SDS and SD1 are spectral accelerations in g: greater than 0 and at most 3');
  const st = String(b.structure_type ?? 'other');
  if (!(st in PERIOD)) return { error: 'Invalid input: structure_type must be steel_moment_frame, concrete_moment_frame, eccentric_braced or other', missing: ['structure_type'] };
  const p = PERIOD[st];
  // Height in feet (ASCE) or metres (2026-10-20: the suite now offers metres).
  const hnM = pick(b, 'height_m');
  const hn = pick(b, 'height_ft') ?? (hnM !== undefined ? hnM / 0.3048 : undefined);
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
  const Cs0 = SDS! / (R! / Ie!);
  const CsMax = SD1! / (T * (R! / Ie!));
  const CsMin = Math.max(0.044 * SDS! * Ie!, 0.01);
  const Cs = Math.max(Math.min(Cs0, CsMax), CsMin);
  return {
    T_s: r(T, 3),
    Cs: r(Cs, 4),
    V_kN: r(Cs * W!, 1),
    governing: Cs === CsMin ? 'minimum (Eq. 12.8-5)' : Cs === CsMax ? 'period limit (Eq. 12.8-3)' : 'Eq. 12.8-2',
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
    if (!(L > 0)) return bad('L_m must be > 0');
    if (!(w >= 0)) return bad('w_kN_m must be 0 or more (a downward uniform load)');
    return { M_kNm: r((w * L * L) / 8), V_kN: r((w * L) / 2), method: 'Simply supported beam, uniform load: M = wL²/8, V = wL/2' };
  }
  const bw = pick(b, 'b_mm'), d = pick(b, 'd_mm'), As = pick(b, 'As_mm2'), fck = pick(b, 'fck_MPa'), fyk = pick(b, 'fyk_MPa');
  const err = missing({ b_mm: bw, d_mm: d, As_mm2: As, fck_MPa: fck, fyk_MPa: fyk });
  if (err) return err;
  if (!(bw! > 0 && d! > 0 && As! > 0 && fck! > 0 && fyk! > 0)) return bad('Section dimensions, steel area and strengths must be > 0');
  if (fck! > 50) return bad('This check covers fck ≤ 50 MPa only');
  const h = pick(b, 'h_mm');
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
  const Med = pick(b, 'Med_kNm');
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
    assumptions: ['Singly reinforced; compression steel ignored', 'αcc = 0.85 (UK/Kenya practice; recommended value is 1.0)', 'Shear, deflection and crack width not checked'],
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
    const av = pick(b, 'alpha_v') ?? 0.6;
    return { Fv_Rd_kN: r((av * fub! * As!) / gM2 / 1000), method: 'EN 1993-1-8 Table 3.4, one shear plane' };
  }
  const desig = String(b.designation ?? '').toUpperCase();
  const grade = String(b.grade ?? '');
  const As = BOLT_AS[desig], fub = BOLT_FUB[grade];
  if (!As || !fub) return { error: 'Missing or invalid input: designation (M12–M30) and grade (4.6, 5.6, 8.8, 10.9)', missing: [!As ? 'designation' : '', !fub ? 'grade' : ''].filter(Boolean) };
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
  const t = pick(b, 't_ply_mm'), fu = pick(b, 'fu_ply_MPa'), e1 = pick(b, 'e1_mm'), p1 = pick(b, 'p1_mm');
  // Hole: as given, else the EN 1090-2 normal clearance hole for the bolt (2026-10-20:
  // changing to M24 errored because the form kept a 22 mm hole).
  const d0Given = pick(b, 'd_hole_mm');
  const d0 = d0Given ?? (dNom <= 14 ? dNom + 1 : dNom <= 24 ? dNom + 2 : dNom + 3);
  const assumptions: string[] = [];
  if (d0Given === undefined) assumptions.push(`Hole diameter taken as ${d0} mm (EN 1090-2 normal clearance for ${desig})`);
  if ([t, fu, e1, d0, p1].some((v) => v !== undefined && !(v > 0))) return bad('t_ply_mm, fu_ply_MPa, e1_mm, p1_mm and d_hole_mm must be > 0');
  if (d0 !== undefined && d0 < dNom) return bad(`d_hole_mm must be at least the bolt diameter (${dNom} mm)`);
  // EN 1993-1-8 Table 3.3 minimum end distance and spacing.
  if (e1 !== undefined && d0 !== undefined && e1 < 1.2 * d0) return bad(`e1_mm = ${e1} is below the EN 1993-1-8 Table 3.3 minimum end distance 1.2·d0 = ${r(1.2 * d0, 1)} mm`);
  if (p1 !== undefined && d0 !== undefined && p1 < 2.2 * d0) return bad(`p1_mm = ${p1} is below the EN 1993-1-8 Table 3.3 minimum spacing 2.2·d0 = ${r(2.2 * d0, 1)} mm`);
  if (t !== undefined && fu !== undefined && e1 !== undefined && d0 !== undefined) {
    const ad = Math.min(e1 / (3 * d0), p1 !== undefined ? p1 / (3 * d0) - 0.25 : Infinity);
    const ab = Math.min(ad, fub / fu, 1);
    const k1 = 2.5;
    const FbRd = (k1 * ab * fu * dNom * t) / gM2 / 1000;
    out.Fb_Rd_kN = r(FbRd);
    out.alpha_b = r(ab, 3);
    assumptions.push('k1 = 2.5 (edge distance e2 ≥ 1.5·d0 assumed; e2 not given)');
  } else {
    assumptions.push('Bearing not checked: give t_ply_mm, fu_ply_MPa, e1_mm and d_hole_mm');
  }
  const FvEd = pick(b, 'Fv_Ed_kN'), FtEd = pick(b, 'Ft_Ed_kN');
  if ((FvEd !== undefined && FvEd < 0) || (FtEd !== undefined && FtEd < 0)) return bad('Fv_Ed_kN and Ft_Ed_kN are load magnitudes and must be 0 or more');
  if (FvEd !== undefined) {
    const gov = out.Fb_Rd_kN !== undefined ? Math.min(FvRd, out.Fb_Rd_kN as number) : FvRd;
    checks.push({ check: 'Fv,Ed ≤ min(Fv,Rd, Fb,Rd)', value: `${FvEd} ≤ ${r(gov)} kN`, pass: FvEd <= gov });
  }
  if (FtEd !== undefined) checks.push({ check: 'Ft,Ed ≤ Ft,Rd', value: `${FtEd} ≤ ${r(FtRd)} kN`, pass: FtEd <= FtRd });
  if (FvEd !== undefined && FtEd !== undefined) {
    const inter = FvEd / FvRd + FtEd / (1.4 * FtRd);
    checks.push({ check: 'Combined Fv,Ed/Fv,Rd + Ft,Ed/(1.4·Ft,Rd) ≤ 1', value: r(inter, 3).toString(), pass: inter <= 1 });
  }
  return { ...out, checks, assumptions, method: 'EN 1993-1-8 Table 3.4 (γM2 = 1.25)' };
}

// ───────────────────────────── Geotechnics ──────────────────────────────

/** Ultimate bearing capacity in Terzaghi's form with shape factors for strip,
 *  square and circular footings; Nc and Nq from Prandtl–Reissner, Nγ from
 *  Vesić. qa = qu / FS. */
export function bearingCapacity(b: Body) {
  const c = pick(b, 'c_kPa'), phiDeg = pick(b, 'phi_deg'), gamma = pick(b, 'gamma_kN_m3'), B = pick(b, 'B_m'), Df = pick(b, 'Df_m', 'D_m');
  const err = missing({ c_kPa: c, phi_deg: phiDeg, gamma_kN_m3: gamma, B_m: B, Df_m: Df });
  if (err) return err;
  if (!(phiDeg! >= 0 && phiDeg! < 50) || !(B! > 0) || Df! < 0 || c! < 0) return bad('Need 0 ≤ φ < 50°, B > 0, Df ≥ 0 and c ≥ 0');
  if (!(gamma! > 0 && gamma! <= 30)) return bad('gamma_kN_m3 (soil unit weight) must be between 0 and 30 kN/m³');
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
  const FS = opt(b, 'FS', 3, (x) => x >= 1, '1 or more');
  return {
    qu_kPa: r(qu, 1),
    qa_kPa: r(qu / FS, 1),
    factor_of_safety: FS,
    Nc: r(Nc), Nq: r(Nq), Ngamma: r(Ng),
    assumptions: ['Vertical, central load on level ground', 'Water table below the zone of influence', 'Settlement not checked'],
    method: "Terzaghi's bearing equation with shape factors; Nc, Nq (Prandtl–Reissner), Nγ (Vesić)",
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
  const outside = S! < 0.03 || S! > 0.1;
  return {
    Tc_min: r(0.0195 * Math.pow(L!, 0.77) * Math.pow(S!, -0.385)),
    ...(outside ? { warning: `Kirpich was fitted to slopes of 3–10%; ${r(S! * 100, 1)}% is outside that range, so treat the time as indicative.` } : {}),
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
