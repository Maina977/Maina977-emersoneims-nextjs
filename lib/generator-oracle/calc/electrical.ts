/**
 * Generator Oracle engineering calculators (Engineering Apps directive §3).
 *
 * Deterministic, no AI. Every function:
 *   - validates its inputs and REJECTS unsafe, inconsistent or missing values
 *     instead of guessing (directive §1.8);
 *   - returns the formula, the inputs with units, the assumptions and the
 *     reference it follows (directive §1.7);
 *   - uses no manufacturer figure it was not given: fuel use, derating and
 *     reactances come from the datasheet the user enters (directive §1.5).
 *
 * Engine version recorded with every result (directive §7).
 */

export const CALC_ENGINE_VERSION = 'oracle-calc 1.2.0 (2026-11-14, sync safety review)';

export interface CalcResult<T> {
  ok: true;
  value: T;
  formula: string;
  inputs: Record<string, string>;
  assumptions: string[];
  reference: string;
  warnings: string[];
  engine: string;
}
export interface CalcError { ok: false; errors: string[] }
export type Calc<T> = CalcResult<T> | CalcError;

const SQRT3 = Math.sqrt(3);
const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const r = (x: number, dp = 2) => Math.round(x * 10 ** dp) / 10 ** dp;

function need(errors: string[], name: string, v: unknown, opts: { min?: number; max?: number; gt?: number } = {}): v is number {
  if (!fin(v)) { errors.push(`${name} is missing or not a number.`); return false; }
  if (opts.gt !== undefined && !(v > opts.gt)) { errors.push(`${name} must be greater than ${opts.gt}.`); return false; }
  if (opts.min !== undefined && v < opts.min) { errors.push(`${name} must be at least ${opts.min}.`); return false; }
  if (opts.max !== undefined && v > opts.max) { errors.push(`${name} must be at most ${opts.max}.`); return false; }
  return true;
}
const ok = <T>(value: T, rest: Omit<CalcResult<T>, 'ok' | 'value' | 'engine' | 'warnings'> & { warnings?: string[] }): CalcResult<T> =>
  ({ ok: true, value, warnings: [], engine: CALC_ENGINE_VERSION, ...rest });

export type Phases = 1 | 3;

// ─── 1. Power triangle ─────────────────────────────────────────────────────

/**
 * kW, kVA and kVAr from voltage, current and power factor.
 * Three-phase: S = √3 · V_LL · I; single-phase: S = V · I; P = S · PF; Q = S · sin(acos PF).
 */
export function powerFromVI(i: { phases: Phases; voltageV: number; currentA: number; powerFactor: number }): Calc<{ kVA: number; kW: number; kVAr: number }> {
  const e: string[] = [];
  if (i.phases !== 1 && i.phases !== 3) e.push('Phases must be 1 or 3.');
  need(e, 'Voltage (V)', i.voltageV, { gt: 0, max: 50_000 });
  need(e, 'Current (A)', i.currentA, { min: 0, max: 100_000 });
  need(e, 'Power factor', i.powerFactor, { gt: 0, max: 1 });
  if (e.length) return { ok: false, errors: e };
  const kVA = (i.phases === 3 ? SQRT3 : 1) * i.voltageV * i.currentA / 1000;
  const kW = kVA * i.powerFactor;
  const kVAr = kVA * Math.sin(Math.acos(i.powerFactor));
  return ok({ kVA: r(kVA), kW: r(kW), kVAr: r(kVAr) }, {
    formula: i.phases === 3 ? 'S = √3 × V(line-line) × I / 1000;  P = S × PF;  Q = S × sin(arccos PF)' : 'S = V × I / 1000;  P = S × PF;  Q = S × sin(arccos PF)',
    inputs: { phases: String(i.phases), voltage: `${i.voltageV} V${i.phases === 3 ? ' line-to-line' : ''}`, current: `${i.currentA} A`, powerFactor: String(i.powerFactor) },
    assumptions: ['Balanced load (three-phase).', 'Sinusoidal voltage and current (harmonics not included).'],
    reference: 'IEC 60050-131 (power definitions); standard AC circuit relations.',
  });
}

/** Line current from apparent or real power. */
export function currentFromPower(i: { phases: Phases; voltageV: number; kVA?: number; kW?: number; powerFactor?: number }): Calc<{ currentA: number; kVA: number }> {
  const e: string[] = [];
  if (i.phases !== 1 && i.phases !== 3) e.push('Phases must be 1 or 3.');
  need(e, 'Voltage (V)', i.voltageV, { gt: 0, max: 50_000 });
  let kVA = i.kVA;
  const usedKW = !fin(i.kVA);
  if (usedKW) {
    if (need(e, 'kW (or give kVA)', i.kW, { gt: 0 }) && need(e, 'Power factor (needed with kW)', i.powerFactor, { gt: 0, max: 1 })) kVA = (i.kW as number) / (i.powerFactor as number);
  } else need(e, 'kVA', i.kVA, { gt: 0 });
  if (e.length) return { ok: false, errors: e };
  const I = (kVA as number) * 1000 / ((i.phases === 3 ? SQRT3 : 1) * i.voltageV);
  return ok({ currentA: r(I, 1), kVA: r(kVA as number) }, {
    formula: `${usedKW ? 'S = P / PF;  ' : ''}${i.phases === 3 ? 'I = S × 1000 / (√3 × V(line-line))' : 'I = S × 1000 / V'}`,
    inputs: { phases: String(i.phases), voltage: `${i.voltageV} V`, ...(usedKW ? { kW: `${i.kW} kW`, powerFactor: String(i.powerFactor) } : { kVA: `${i.kVA} kVA` }) },
    assumptions: ['Balanced load (three-phase).'],
    reference: 'Standard AC circuit relations.',
  });
}

// ─── 2. Generator sizing (load schedule) ───────────────────────────────────

export interface LoadLine { name: string; kW: number; powerFactor: number; quantity: number; demandFactor: number }

/**
 * Running load from a load schedule. Demand (diversity) factors and the maximum
 * loading are the engineer's inputs, never defaults.
 * Running kW = Σ(kW × qty × demand factor); kVAr = Σ(kW × qty × df × tan φ);
 * kVA = √(kW² + kVAr²); minimum generator kVA = kVA / maximum loading.
 * Motor starting is NOT included: check it with motorStartDip().
 */
export function sizeFromLoadSchedule(i: { loads: LoadLine[]; maxLoading: number }): Calc<{ runningKW: number; runningKVAr: number; runningKVA: number; overallPF: number; minimumGeneratorKVA: number }> {
  const e: string[] = [];
  if (!Array.isArray(i.loads) || i.loads.length === 0) e.push('Enter at least one load.');
  need(e, 'Maximum loading (fraction of rating, e.g. 0.8)', i.maxLoading, { gt: 0, max: 1 });
  (i.loads || []).forEach((l, n) => {
    const tag = `Load ${n + 1}${l?.name ? ` (${l.name})` : ''}`;
    need(e, `${tag} kW`, l?.kW, { gt: 0 });
    need(e, `${tag} power factor`, l?.powerFactor, { gt: 0, max: 1 });
    need(e, `${tag} quantity`, l?.quantity, { gt: 0 });
    if (fin(l?.quantity) && !Number.isInteger(l.quantity)) e.push(`${tag} quantity must be a whole number.`);
    need(e, `${tag} demand factor`, l?.demandFactor, { gt: 0, max: 1 });
  });
  if (e.length) return { ok: false, errors: e };
  let P = 0, Q = 0;
  for (const l of i.loads) { const p = l.kW * l.quantity * l.demandFactor; P += p; Q += p * Math.tan(Math.acos(l.powerFactor)); }
  const S = Math.hypot(P, Q);
  const warnings: string[] = [];
  if (i.maxLoading > 0.9) warnings.push('A maximum loading above 90% leaves little margin for load growth, ambient derating and transients.');
  return ok({ runningKW: r(P), runningKVAr: r(Q), runningKVA: r(S), overallPF: r(P / S, 3), minimumGeneratorKVA: r(S / i.maxLoading) }, {
    formula: 'P = Σ(kW × qty × DF);  Q = Σ(kW × qty × DF × tan(arccos PF));  S = √(P² + Q²);  minimum rating = S / maximum loading',
    inputs: { loads: `${i.loads.length} line(s)`, maxLoading: `${i.maxLoading * 100}%` },
    assumptions: [
      'Demand factors are the engineer\'s judgement for this site, not standard values.',
      'Running load only: motor starting, non-linear (harmonic) loads, single-phase imbalance, site altitude and temperature derating, and future growth must be checked separately.',
      'The final rating must come from the manufacturer\'s datasheet or sizing software at site conditions.',
    ],
    reference: 'Load-schedule method (ISO 8528-1 defines the generator ratings: PRP, COP, ESP, LTP).',
    warnings,
  });
}

// ─── 3. Voltage drop (IEC 60364-5-52 Annex G) ──────────────────────────────

/** Resistivity at 20 °C, Ω·mm²/m (IEC 60028 copper, IEC 60889 aluminium). */
export const RHO20 = { copper: 0.017241, aluminium: 0.028264 } as const;

/**
 * u = b × (ρ1 × L / S × cos φ + λ × L × sin φ) × Ib
 * b = 1 three-phase, 2 single-phase; ρ1 = 1.25 × ρ20 (conductor at normal
 * service temperature); λ = 0.08 mΩ/m unless the cable datasheet gives another
 * value. ΔU% = 100 × u / U0, with U0 the line-to-neutral voltage.
 */
export function voltageDrop(i: { phases: Phases; material: 'copper' | 'aluminium'; csaMm2: number; lengthM: number; currentA: number; powerFactor: number; nominalVoltageV: number; reactanceMOhmPerM?: number; limitPct?: number }): Calc<{ dropV: number; dropPct: number; withinLimit: boolean | null }> {
  const e: string[] = [];
  if (i.phases !== 1 && i.phases !== 3) e.push('Phases must be 1 or 3.');
  if (i.material !== 'copper' && i.material !== 'aluminium') e.push('Conductor material must be copper or aluminium.');
  need(e, 'Conductor cross-section (mm²)', i.csaMm2, { gt: 0, max: 2000 });
  need(e, 'Route length, one way (m)', i.lengthM, { gt: 0, max: 10_000 });
  need(e, 'Design current (A)', i.currentA, { gt: 0 });
  need(e, 'Power factor', i.powerFactor, { gt: 0, max: 1 });
  need(e, i.phases === 3 ? 'Nominal line-to-line voltage (V)' : 'Nominal voltage (V)', i.nominalVoltageV, { gt: 0 });
  if (i.reactanceMOhmPerM !== undefined) need(e, 'Cable reactance (mΩ/m)', i.reactanceMOhmPerM, { min: 0, max: 1 });
  if (i.limitPct !== undefined) need(e, 'Allowed drop (%)', i.limitPct, { gt: 0, max: 20 });
  if (e.length) return { ok: false, errors: e };
  const b = i.phases === 3 ? 1 : 2;
  const rho1 = 1.25 * RHO20[i.material];
  const lambda = (i.reactanceMOhmPerM ?? 0.08) / 1000; // Ω/m
  const cos = i.powerFactor, sin = Math.sin(Math.acos(cos));
  const u = b * (rho1 * i.lengthM / i.csaMm2 * cos + lambda * i.lengthM * sin) * i.currentA;
  const U0 = i.phases === 3 ? i.nominalVoltageV / SQRT3 : i.nominalVoltageV;
  const pct = 100 * u / U0;
  const assumptions = [
    `Conductor at normal service temperature: ρ1 = 1.25 × ρ20 = ${r(rho1, 5)} Ω·mm²/m (${i.material}).`,
    i.reactanceMOhmPerM === undefined ? 'Reactance λ = 0.08 mΩ/m (the standard\'s value when the cable data does not give one).' : `Reactance λ = ${i.reactanceMOhmPerM} mΩ/m (entered from the cable data).`,
    'Steady-state running current; motor starting drop must be checked separately.',
    'Current-carrying capacity (ampacity), grouping, installation method and protection are NOT checked here.',
  ];
  return ok({ dropV: r(i.phases === 3 ? u * SQRT3 : u), dropPct: r(pct), withinLimit: i.limitPct === undefined ? null : pct <= i.limitPct }, {
    formula: 'u = b × (ρ1 × L / S × cos φ + λ × L × sin φ) × Ib;  ΔU% = 100 × u / U0' + (i.phases === 3 ? ';  line-to-line drop = √3 × u' : ''),
    inputs: { phases: String(i.phases), material: i.material, csa: `${i.csaMm2} mm²`, length: `${i.lengthM} m (one way)`, current: `${i.currentA} A`, powerFactor: String(i.powerFactor), voltage: `${i.nominalVoltageV} V` },
    assumptions,
    reference: 'IEC 60364-5-52:2009 Annex G (voltage drop in consumers\' installations); resistivities IEC 60028 / IEC 60889.',
  });
}

// ─── 4. Phase imbalance (NEMA MG-1 definition) ─────────────────────────────

/** Unbalance % = 100 × maximum deviation from the average / average (voltages or currents). */
export function phaseImbalance(i: { values: [number, number, number]; quantity: 'voltage' | 'current' }): Calc<{ average: number; maxDeviation: number; imbalancePct: number }> {
  const e: string[] = [];
  if (!Array.isArray(i.values) || i.values.length !== 3) e.push('Enter exactly three phase values.');
  else i.values.forEach((v, n) => need(e, `Phase ${n + 1} ${i.quantity}`, v, { min: 0 }));
  if (e.length) return { ok: false, errors: e };
  const avg = (i.values[0] + i.values[1] + i.values[2]) / 3;
  if (!(avg > 0)) return { ok: false, errors: ['The average of the three values must be above zero.'] };
  const dev = Math.max(...i.values.map((v) => Math.abs(v - avg)));
  const pct = 100 * dev / avg;
  const warnings: string[] = [];
  if (i.quantity === 'voltage' && pct > 1) warnings.push('Voltage unbalance above 1% derates three-phase motors (NEMA MG-1 Part 14).');
  return ok({ average: r(avg), maxDeviation: r(dev), imbalancePct: r(pct) }, {
    formula: 'Unbalance % = 100 × max |Vx − Vavg| / Vavg',
    inputs: { values: i.values.join(' / '), quantity: i.quantity },
    assumptions: ['NEMA "line voltage unbalance" definition; the IEC definition (negative/positive sequence) can give a slightly different figure.'],
    reference: 'NEMA MG-1 Part 14.36.',
    warnings,
  });
}

// ─── 5. Motor starting voltage dip (initial estimate) ──────────────────────

/**
 * Initial dip ≈ X × Sm / (Sg + X × Sm), with X the alternator reactance in per
 * unit (sub-transient X"d, or transient X'd as some manufacturers specify) and
 * Sm the motor starting kVA. Ignores AVR and engine response, cable impedance
 * and existing load: the manufacturer's sizing software governs.
 */
export function motorStartDip(i: { generatorKVA: number; reactancePU: number; motorStartingKVA: number; allowedDipPct?: number }): Calc<{ dipPct: number; withinLimit: boolean | null }> {
  const e: string[] = [];
  need(e, 'Generator rating (kVA)', i.generatorKVA, { gt: 0 });
  need(e, 'Alternator reactance from the datasheet (per unit, e.g. 0.12)', i.reactancePU, { gt: 0, max: 1 });
  need(e, 'Motor starting kVA (locked-rotor kVA, or the starter\'s reduced value)', i.motorStartingKVA, { gt: 0 });
  if (i.allowedDipPct !== undefined) need(e, 'Allowed dip (%)', i.allowedDipPct, { gt: 0, max: 60 });
  if (e.length) return { ok: false, errors: e };
  const xs = i.reactancePU * i.motorStartingKVA;
  const dip = 100 * xs / (i.generatorKVA + xs);
  return ok({ dipPct: r(dip, 1), withinLimit: i.allowedDipPct === undefined ? null : dip <= i.allowedDipPct }, {
    formula: 'Dip % = 100 × X × Sm / (Sg + X × Sm)',
    inputs: { generator: `${i.generatorKVA} kVA`, reactance: `${i.reactancePU} pu`, motorStarting: `${i.motorStartingKVA} kVA` },
    assumptions: [
      'Reactance divider at the instant of starting: AVR and governor response, cable impedance and existing load are ignored.',
      'Motor starting kVA from the motor data (locked-rotor code or the soft-starter/VSD setting), not estimated here.',
      'Use the manufacturer\'s transient-performance data or sizing software for the final check.',
    ],
    reference: 'Reactance-divider estimate (see e.g. IEEE 446, generator transient performance); ISO 8528-5:2025 for performance classes (title and edition from the official contents list; limits not reviewed).',
  });
}

// ─── 6. Fuel consumption and runtime (OEM datasheet only) ──────────────────

export interface FuelPoint { loadPct: number; litresPerHour: number }

/** Linear interpolation between the datasheet points the user enters; runtime = usable fuel / consumption. */
export function fuelAndRuntime(i: { datasheet: FuelPoint[]; loadPct: number; usableFuelL?: number }): Calc<{ litresPerHour: number; runtimeHours: number | null }> {
  const e: string[] = [];
  const pts = Array.isArray(i.datasheet) ? [...i.datasheet] : [];
  if (pts.length < 2) e.push('Enter at least two fuel-consumption points from the engine or generator datasheet (for example at 50% and 100% load).');
  pts.forEach((p, n) => { need(e, `Datasheet point ${n + 1} load (%)`, p?.loadPct, { min: 0, max: 110 }); need(e, `Datasheet point ${n + 1} consumption (L/h)`, p?.litresPerHour, { gt: 0 }); });
  need(e, 'Load (%)', i.loadPct, { min: 0, max: 110 });
  if (i.usableFuelL !== undefined) need(e, 'Usable fuel (L)', i.usableFuelL, { gt: 0 });
  if (e.length) return { ok: false, errors: e };
  pts.sort((a, b) => a.loadPct - b.loadPct);
  for (let n = 1; n < pts.length; n++) {
    if (pts[n].loadPct === pts[n - 1].loadPct) return { ok: false, errors: [`Two datasheet points share ${pts[n].loadPct}% load.`] };
    if (pts[n].litresPerHour < pts[n - 1].litresPerHour) return { ok: false, errors: ['Consumption must not fall as load rises: check the datasheet values.'] };
  }
  const lo = pts[0], hi = pts[pts.length - 1];
  if (i.loadPct < lo.loadPct || i.loadPct > hi.loadPct) return { ok: false, errors: [`${i.loadPct}% load is outside the datasheet points (${lo.loadPct}-${hi.loadPct}%); add a datasheet point instead of extrapolating.`] };
  let k = 1; while (pts[k].loadPct < i.loadPct) k++;
  const a = pts[k - 1], b = pts[k];
  const lph = a.litresPerHour + (b.litresPerHour - a.litresPerHour) * (i.loadPct - a.loadPct) / (b.loadPct - a.loadPct);
  return ok({ litresPerHour: r(lph), runtimeHours: i.usableFuelL === undefined ? null : r(i.usableFuelL / lph, 1) }, {
    formula: 'L/h by linear interpolation between datasheet points;  runtime = usable fuel / (L/h)',
    inputs: { datasheet: pts.map((p) => `${p.loadPct}% → ${p.litresPerHour} L/h`).join(', '), load: `${i.loadPct}%`, ...(i.usableFuelL !== undefined ? { usableFuel: `${i.usableFuelL} L` } : {}) },
    assumptions: ['Datasheet figures at the manufacturer\'s reference conditions; real use varies with engine condition, fuel quality and load profile.', 'Usable fuel excludes the unusable volume below the pick-up.'],
    reference: 'Manufacturer datasheet (entered by the user); ISO 3046-1 reference conditions.',
  });
}

// ─── 7. Altitude and temperature derating (OEM factors only) ───────────────

/**
 * Applies the manufacturer's derating rules as entered: x% per step above a
 * threshold, for altitude and for temperature. No default factors: they differ
 * by engine and rating, and the datasheet curve governs.
 */
export function derate(i: {
  ratedKW: number;
  siteAltitudeM: number; altitudeThresholdM: number; altitudePctPerStep: number; altitudeStepM: number;
  siteTempC: number; tempThresholdC: number; tempPctPerStep: number; tempStepC: number;
}): Calc<{ availableKW: number; totalDeratePct: number; altitudeDeratePct: number; temperatureDeratePct: number }> {
  const e: string[] = [];
  need(e, 'Rated output (kW, from the datasheet)', i.ratedKW, { gt: 0 });
  need(e, 'Site altitude (m)', i.siteAltitudeM, { min: -500, max: 6000 });
  need(e, 'Altitude above which derating starts (m, datasheet)', i.altitudeThresholdM, { min: 0, max: 6000 });
  need(e, 'Altitude derate per step (%, datasheet)', i.altitudePctPerStep, { min: 0, max: 50 });
  need(e, 'Altitude step (m, datasheet)', i.altitudeStepM, { gt: 0 });
  need(e, 'Site maximum temperature (°C)', i.siteTempC, { min: -50, max: 70 });
  need(e, 'Temperature above which derating starts (°C, datasheet)', i.tempThresholdC, { min: -50, max: 70 });
  need(e, 'Temperature derate per step (%, datasheet)', i.tempPctPerStep, { min: 0, max: 50 });
  need(e, 'Temperature step (°C, datasheet)', i.tempStepC, { gt: 0 });
  if (e.length) return { ok: false, errors: e };
  const alt = Math.max(0, i.siteAltitudeM - i.altitudeThresholdM) / i.altitudeStepM * i.altitudePctPerStep;
  const tmp = Math.max(0, i.siteTempC - i.tempThresholdC) / i.tempStepC * i.tempPctPerStep;
  const factor = (1 - alt / 100) * (1 - tmp / 100);
  if (!(factor > 0)) return { ok: false, errors: ['The entered derating removes all output: check the datasheet values.'] };
  return ok({ availableKW: r(i.ratedKW * factor), totalDeratePct: r(100 * (1 - factor)), altitudeDeratePct: r(alt), temperatureDeratePct: r(tmp) }, {
    formula: 'available = rated × (1 − altitude derate) × (1 − temperature derate); each derate = max(0, site − threshold) / step × % per step',
    inputs: { rated: `${i.ratedKW} kW`, altitude: `${i.siteAltitudeM} m`, temperature: `${i.siteTempC} °C` },
    assumptions: [
      'Derating rules entered from the manufacturer\'s datasheet; linear between steps.',
      'Altitude and temperature effects multiplied; some manufacturers publish a combined table, which then governs.',
    ],
    reference: 'Manufacturer datasheet; ISO 3046-1 / ISO 8528-1 reference conditions (100 kPa, 25 °C, 30% RH).',
  });
}

// ─── 9. Synchronising check (paralleling a generator) ───────────────────────

/**
 * Safety review 2026-11-14 (management decision §3): IEEE 1547 governs the
 * interconnection of distributed energy resources with a utility system. It is
 * NOT a generic limit set for paralleling diesel generators on an isolated bus.
 * Therefore no built-in limits are ever applied. Synchronising limits must come
 * from the controller / synchroniser / OEM documentation (or the utility's
 * interconnection requirements), verified by a named person for the specific
 * installation. Without that, the result is LIMITS NOT VERIFIED and never a
 * pass. The tool never commands closing: at most it reports that the readings
 * are within the verified limits; the synchronising relay (ANSI 25) or the
 * controller's synchroniser makes the close decision.
 */
export type SyncApplication = 'island-bus' | 'utility-interconnection';
// 2026-11-21 audit (H2): the verifier's name is typed, not an authenticated
// verification, so the best result is "within the entered limits (not verified)"
// until verification is tied to a signed-in, authorised person.
export type SyncVerdict = 'WITHIN ENTERED LIMITS (NOT VERIFIED)' | 'LIMITS NOT VERIFIED' | 'DO NOT CLOSE' | 'DEAD BUS: NOT A SYNCHRONISING CASE';
type YesNoUnknown = 'yes' | 'no' | 'unknown';

/** Reference information only (never applied): published IEEE 1547-2003 DER interconnection bands. */
export const IEEE1547_2003_REFERENCE = [
  { band: 'aggregate 0–500 kVA', maxDfHz: 0.3, maxDvPct: 10, maxDphiDeg: 20 },
  { band: 'aggregate >500–1500 kVA', maxDfHz: 0.2, maxDvPct: 5, maxDphiDeg: 15 },
] as const;
export const IEEE1547_NOTE = 'IEEE 1547-2003 bands are for DER interconnection with a utility system, shown for information only. They are not applied, and they are not limits for paralleling generators on an isolated bus.';

/** Differences beyond these are never acceptable whatever limits are entered (gross error / wrong entry). */
const ABSOLUTE = { maxDfHz: 1, maxDvPct: 20, maxDphiDeg: 30 };

export interface SyncLimits { maxDfHz: number; maxDvPct: number; maxDphiDeg: number; source: string; verifiedFor: string; verifiedBy: string }

export function syncCheck(i: {
  application: SyncApplication;
  incomingV: number; busV: number; incomingHz: number; busHz: number; phaseAngleDeg: number;
  busLive: boolean;
  phaseSequence: 'same' | 'reversed' | 'not-checked';
  syncRelayInService: YesNoUnknown; protectionInService: YesNoUnknown; breakerReady: YesNoUnknown;
  limits: SyncLimits | null;
}): Calc<{ verdict: SyncVerdict; dfHz: number; dvPct: number; dphiDeg: number; withinFrequency: boolean | null; withinVoltage: boolean | null; withinPhase: boolean | null; slipPeriodS: number | null; reasons: string[] }> {
  const e: string[] = [];
  if (i.application !== 'island-bus' && i.application !== 'utility-interconnection') e.push('State the application: generators on an isolated bus, or interconnection with the utility.');
  need(e, 'Incoming (generator) voltage', i.incomingV, { gt: 0 });
  need(e, 'Bus voltage', i.busV, { min: 0 });
  need(e, 'Incoming frequency', i.incomingHz, { min: 40, max: 70 });
  need(e, 'Bus frequency', i.busHz, { min: 0, max: 70 });
  need(e, 'Phase angle difference', i.phaseAngleDeg, { min: -180, max: 180 });
  if (i.limits) {
    need(e, 'Frequency difference limit', i.limits.maxDfHz, { gt: 0, max: ABSOLUTE.maxDfHz });
    need(e, 'Voltage difference limit', i.limits.maxDvPct, { gt: 0, max: ABSOLUTE.maxDvPct });
    need(e, 'Phase angle limit', i.limits.maxDphiDeg, { gt: 0, max: ABSOLUTE.maxDphiDeg });
  }
  if (e.length) return { ok: false, errors: e };

  const reasons: string[] = [];
  const warnings: string[] = [];
  const nil = { dfHz: NaN, dvPct: NaN, dphiDeg: NaN, withinFrequency: null, withinVoltage: null, withinPhase: null, slipPeriodS: null };
  const base = {
    formula: 'Δf = f_incoming − f_bus; ΔV % = 100 × (V_incoming − V_bus) / V_bus; Δφ measured; slip period = 1/|Δf|',
    inputs: { application: i.application, incomingV: String(i.incomingV), busV: String(i.busV), incomingHz: String(i.incomingHz), busHz: String(i.busHz), phaseAngleDeg: String(i.phaseAngleDeg), phaseSequence: i.phaseSequence, syncRelay: i.syncRelayInService, protection: i.protectionInService, breakerReady: i.breakerReady },
    assumptions: [
      'Readings as measured at the breaker by a synchroscope or synchronising relay.',
      'This check never commands a breaker. The synchronising relay (ANSI 25) or the controller synchroniser makes the close decision.',
      IEEE1547_NOTE,
    ],
  };

  // Dead bus: closing onto a dead bus is a different procedure (dead-bus interlock), not synchronising.
  if (!i.busLive || i.busV === 0) {
    return ok({ verdict: 'DEAD BUS: NOT A SYNCHRONISING CASE' as SyncVerdict, ...nil, reasons: ['The bus is dead: use the dead-bus closing procedure and its interlock (only one machine may close onto a dead bus).'] }, { ...base, reference: 'Controller / switchgear dead-bus logic.', warnings: ['Do not use this check for dead-bus closing.'] });
  }

  const df = i.incomingHz - i.busHz;
  const dv = 100 * (i.incomingV - i.busV) / i.busV;
  const dphi = i.phaseAngleDeg;
  const values = { dfHz: r(df, 3), dvPct: r(dv, 2), dphiDeg: r(dphi, 1), slipPeriodS: df !== 0 ? r(1 / Math.abs(df), 1) : null };

  // Always DO NOT CLOSE, whatever the limits.
  const block: string[] = [];
  if (i.phaseSequence === 'reversed') block.push('Phase sequence reversed: closing would be a phase-to-phase fault. Correct the rotation first.');
  if (Math.abs(df) > ABSOLUTE.maxDfHz || Math.abs(dv) > ABSOLUTE.maxDvPct || Math.abs(dphi) > ABSOLUTE.maxDphiDeg) block.push(`A difference is grossly outside any synchronising window (|Δf| ≤ ${ABSOLUTE.maxDfHz} Hz, |ΔV| ≤ ${ABSOLUTE.maxDvPct} %, |Δφ| ≤ ${ABSOLUTE.maxDphiDeg}° at most).`);
  if (i.syncRelayInService === 'no') block.push('Synchronising relay / controller synchroniser out of service.');
  if (i.protectionInService === 'no') block.push('Generator protection (e.g. reverse power, overcurrent) not in service.');
  if (i.breakerReady === 'no') block.push('Breaker not ready (spring not charged, trip latched or interlock active).');

  let wf: boolean | null = null, wv: boolean | null = null, wp: boolean | null = null;
  if (i.limits) {
    wf = Math.abs(df) <= i.limits.maxDfHz; wv = Math.abs(dv) <= i.limits.maxDvPct; wp = Math.abs(dphi) <= i.limits.maxDphiDeg;
    if (!wf) block.push(`|Δf| ${values.dfHz} Hz exceeds the limit ${i.limits.maxDfHz} Hz.`);
    if (!wv) block.push(`|ΔV| ${values.dvPct} % exceeds the limit ${i.limits.maxDvPct} %.`);
    if (!wp) block.push(`|Δφ| ${values.dphiDeg}° exceeds the limit ${i.limits.maxDphiDeg}°.`);
  }
  if (df < 0) warnings.push('Incoming machine slower than the bus: it would take reverse power on closing. Bring it slightly fast.');
  if (dv < 0) warnings.push('Incoming voltage below the bus: the machine would absorb reactive power on closing.');

  let verdict: SyncVerdict;
  if (block.length) { verdict = 'DO NOT CLOSE'; reasons.push(...block); }
  else {
    const unverified: string[] = [];
    if (!i.limits) unverified.push('No synchronising limits entered.');
    else {
      if (!i.limits.source?.trim()) unverified.push('Limits have no source document (controller/synchroniser manual, OEM, utility requirement).');
      if (!i.limits.verifiedFor?.trim()) unverified.push('Limits not tied to this installation (state site, controller model and settings file).');
      if (!i.limits.verifiedBy?.trim()) unverified.push('Limits not verified by a named, competent person.');
    }
    if (i.phaseSequence === 'not-checked') unverified.push('Phase sequence not checked.');
    for (const [k, v] of [['Synchronising relay in service', i.syncRelayInService], ['Protection in service', i.protectionInService], ['Breaker ready', i.breakerReady]] as const) if (v === 'unknown') unverified.push(`${k}: not confirmed.`);
    if (unverified.length) { verdict = 'LIMITS NOT VERIFIED'; reasons.push(...unverified); }
    else { verdict = 'WITHIN ENTERED LIMITS (NOT VERIFIED)'; reasons.push('Readings are within the limits entered. The limits and the verifier\'s name are typed, not an authenticated verification: confirm them against the controller / synchroniser documentation on site. The synchronising relay / controller makes the close decision.'); }
  }
  return ok({ verdict, ...values, withinFrequency: wf, withinVoltage: wv, withinPhase: wp, reasons }, {
    ...base,
    reference: i.limits ? `Limits: ${i.limits.source || '(no source)'}; for ${i.limits.verifiedFor || '(installation not stated)'}; verified by ${i.limits.verifiedBy || '(nobody)'}.` : 'No limits entered.',
    warnings,
  });
}
