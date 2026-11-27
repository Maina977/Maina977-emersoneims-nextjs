/**
 * Solar Genius Pro design validation (P1-B, 2026-11-14).
 *
 * Deterministic checks of a PV / inverter / battery / generator design. Every
 * check returns its formula, inputs, result, limit, margin and reference.
 * A design with any REFUSE result is not valid and must not be quoted.
 *
 * Component values come from datasheets entered into the component library;
 * nothing here supplies a default module, inverter, battery or cable rating.
 * Cable ampacity is the tabulated value and correction factors the designer
 * reads from IEC 60364-5-52 for the installation method; it is not built in.
 */

export const SOLAR_DESIGN_ENGINE_VERSION = 'solar-design 1.0.0 (2026-11-14)';

export interface Module {
  model: string;
  pmaxW: number; vocV: number; iscA: number; vmpV: number; impA: number;
  /** Temperature coefficients, % per °C (negative for voltage and power). */
  betaVocPct: number; betaVmpPct: number; alphaIscPct: number; gammaPmaxPct: number;
  noctC: number;
  maxSystemV: number;
  /** Maximum series fuse rating (module overcurrent protection rating), A. */
  maxSeriesFuseA: number;
  /** Module dimensions from the datasheet, mm (REQ-04; optional). */
  lengthMm?: number; widthMm?: number;
  datasheet: string;
}

export interface Inverter {
  model: string;
  acKw: number;
  maxDcV: number;
  mpptMinV: number; mpptMaxV: number;
  mpptCount: number;
  /** Per MPPT. */
  maxInputA: number; maxIscA: number;
  /** Battery side (hybrid/off-grid), optional. */
  batteryMaxDischargeKw?: number;
  batteryMaxChargeKw?: number;
  /** The manufacturer's written statement that the unit supports a generator input, or null. */
  generatorCompatibility: string | null;
  /** REQ-04 (optional): battery voltage window, battery-port currents, anti-islanding statement (e.g. "IEC 62116 certificate …"). */
  batteryMinV?: number; batteryMaxV?: number;
  batteryMaxChargeA?: number; batteryMaxDischargeA?: number;
  antiIslanding?: string | null;
  /** REQ-05 AC protection (optional): maximum AC output current per inverter, A, from the datasheet. */
  maxAcOutputA?: number;
  /**
   * The RCD type the inverter manufacturer states for the inverter's AC circuit
   * ('A', 'B', …), or 'not-required' when the manufacturer states that no
   * particular RCD type is required by the inverter. Absent = not stated.
   */
  rcdTypeRequired?: RcdType | 'not-required';
  datasheet: string;
}

/** RCD types, weakest first: a type B device also meets the type F, A and AC duties; F meets A and AC; A meets AC. */
export const RCD_TYPES = ['AC', 'A', 'F', 'B'] as const;
export type RcdType = typeof RCD_TYPES[number];

export interface Battery {
  model: string;
  nominalKwh: number;
  usableDoD: number; // 0–1
  dischargeEfficiency: number; // 0–1
  maxDischargeC: number; maxChargeC: number;
  /** REQ-04 (optional): chemistry, nominal voltage per unit, cycle life at a DoD, operating temperature window, warranty. */
  chemistry?: string; nominalV?: number;
  /** Per unit, from the datasheet: full-charge (absorption) voltage and discharge cut-off voltage (review advisory A2). */
  chargeV?: number; cutoffV?: number;
  cycleLife?: number; cycleLifeDoD?: number;
  minTempC?: number; maxTempC?: number;
  warrantyYears?: number;
  datasheet: string;
}

export interface SiteTemps {
  /** Site record low ambient (°C), for cold Voc. */
  recordLowC: number;
  /** Highest ambient while generating (°C), for hot Vmp. */
  maxAmbientC: number;
}

export interface ArrayDesign {
  modulesPerString: number;
  /** Parallel strings on each MPPT, length = MPPTs used. */
  stringsPerMppt: number[];
}

export interface CableRun {
  name: string;
  lengthM: number; // one way
  csaMm2: number;
  designCurrentA: number;
  systemV: number;
  /** Tabulated current-carrying capacity It (IEC 60364-5-52) for this method, A. */
  tabulatedAmpacityA: number;
  /** Correction factors from the same standard. */
  ambientFactor: number; groupingFactor: number;
  maxDropPct: number;
  /**
   * What the cable carries (review G3): 'dc-pv' = PV strings into an MPPT,
   * 'dc-battery', or 'ac'. Not stated is treated as a PV cable, so its
   * design current is never below the string current it may carry.
   */
  kind?: 'dc-pv' | 'dc-string' | 'dc-battery' | 'ac';
  /** For a PV cable: the MPPT (1-based) it serves; absent = the most heavily loaded MPPT. */
  mppt?: number;
  /**
   * For kind 'dc-string' (a cable serving ONE string): the rating In of the
   * string fuse protecting it, A. It must lie in the design's fuse window
   * (1.5 × Isc < In ≤ min(2.4 × Isc, module max series fuse)).
   */
  stringFuseA?: number;
  /** REQ-05: where the run starts and ends (e.g. "Inverter 1 AC terminals" → "Main DB"). */
  from?: string; to?: string;
  /**
   * REQ-05: the IEC 60364-5-52 installation (reference) method the tabulated
   * It was read for (e.g. "C, clipped direct"). Not stated = the capacity
   * check is never a PASS (the It cannot be traced to a method).
   */
  method?: string;
  /** REQ-05: conductor material. Not stated = the voltage drop is never a PASS (the copper ρ is only an assumption). */
  conductor?: CableConductor;
  /**
   * Review M1: for an AC run, how many inverters it carries (1 = one
   * inverter's own run, up to inverterCount = a shared run). Required for the
   * AC checks to pass when the design has more than one inverter.
   */
  invertersCarried?: number;
}

export const CABLE_CONDUCTORS = ['copper', 'aluminium'] as const;
export type CableConductor = typeof CABLE_CONDUCTORS[number];

/**
 * REQ-05: the AC protective devices on each inverter's AC circuit. Every
 * field is optional; a missing one makes the check it feeds a WARN "not
 * checked", never a PASS.
 */
export interface AcProtection {
  /** Rated current In of the inverter's AC circuit-breaker / MCB, A (one per inverter). */
  breakerA?: number;
  /** The device as specified, e.g. "MCB, C curve, 4-pole" (text, shown on the diagram). */
  device?: string;
  /** Review A1: what the device is. Only a stated circuit-breaker lets I_n ≤ I_z PASS (a fuse's I_2 is higher). */
  deviceType?: 'circuit-breaker' | 'fuse';
  /** Name of the AC cable run this breaker protects (one of the design's cable runs, kind 'ac'). */
  cable?: string;
  /** RCD type fitted on the inverter's AC circuit; 'none' = no RCD fitted. */
  rcdType?: RcdType | 'none';
}

export type Verdict = 'PASS' | 'WARN' | 'REFUSE';
export interface Check {
  id: string;
  title: string;
  verdict: Verdict;
  value: number;
  limit: number;
  unit: string;
  /** Positive = inside the limit. */
  marginPct: number;
  formula: string;
  reference: string;
  note?: string;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const margin = (value: number, limit: number, upper: boolean) => r2(((upper ? limit - value : value - limit) / limit) * 100);

/** IEC 61215/61853 practice: NOCT cell model at 1000 W/m² (conservative for hot Vmp). */
export function cellTemperature(ambientC: number, noctC: number, irradiance = 1000): number {
  return ambientC + ((noctC - 20) / 800) * irradiance;
}

function invalid(module: Module, inverter: Inverter, design: ArrayDesign): string[] {
  const e: string[] = [];
  const pos = (n: number, name: string) => { if (!(Number.isFinite(n) && n > 0)) e.push(`${name} must be a positive number`); };
  pos(module.vocV, 'Module Voc'); pos(module.vmpV, 'Module Vmp'); pos(module.iscA, 'Module Isc'); pos(module.impA, 'Module Imp'); pos(module.pmaxW, 'Module Pmax');
  pos(module.maxSystemV, 'Module max system voltage'); pos(module.maxSeriesFuseA, 'Module max series fuse');
  pos(inverter.maxDcV, 'Inverter max DC voltage'); pos(inverter.mpptMaxV, 'MPPT max voltage'); pos(inverter.maxInputA, 'Max input current'); pos(inverter.maxIscA, 'Max short-circuit current'); pos(inverter.acKw, 'Inverter AC power');
  if (!(inverter.mpptMinV > 0 && inverter.mpptMinV < inverter.mpptMaxV)) e.push('MPPT minimum must be positive and below the MPPT maximum');
  if (module.vmpV >= module.vocV) e.push('Module Vmp must be below Voc (check the datasheet entry)');
  if (module.impA >= module.iscA) e.push('Module Imp must be below Isc (check the datasheet entry)');
  if (module.betaVocPct >= 0 || module.betaVmpPct >= 0) e.push('Voltage temperature coefficients are negative on every crystalline module datasheet; check the sign and units (%/°C)');
  if (Math.abs(module.betaVocPct) > 1 || Math.abs(module.betaVmpPct) > 1) e.push('Temperature coefficient over 1 %/°C: probably entered in mV/°C; enter %/°C');
  if (!Number.isInteger(design.modulesPerString) || design.modulesPerString < 1) e.push('Modules per string must be a whole number ≥ 1');
  if (design.stringsPerMppt.length < 1 || design.stringsPerMppt.some((s) => !Number.isInteger(s) || s < 1)) e.push('Each MPPT used needs a whole number of strings ≥ 1');
  // Review of 39fa8535, M1: an undefined or NaN MPPT count made the next
  // comparison false, so any number of MPPTs passed.
  if (!(Number.isInteger(inverter.mpptCount) && inverter.mpptCount >= 1)) e.push('Inverter MPPT count must be a whole number ≥ 1');
  else if (design.stringsPerMppt.length > inverter.mpptCount) e.push(`The design uses ${design.stringsPerMppt.length} MPPTs; the inverter has ${inverter.mpptCount}`);
  // M3: a reference of only spaces is no reference.
  if (!module.datasheet?.trim() || !inverter.datasheet?.trim()) e.push('Module and inverter datasheet references are required');
  return e;
}

export interface StringResult { valid: boolean; errors: string[]; checks: Check[]; kWp: number; engineVersion: string }

export function validateStrings(module: Module, inverter: Inverter, design: ArrayDesign, temps: SiteTemps): StringResult {
  const errors = invalid(module, inverter, design);
  if (!(temps.recordLowC > -60 && temps.recordLowC < 50)) errors.push('Site record low must be a real temperature (°C)');
  if (!(temps.maxAmbientC > temps.recordLowC && temps.maxAmbientC < 60)) errors.push('Maximum ambient must be above the record low and below 60 °C');
  if (errors.length) return { valid: false, errors, checks: [], kWp: 0, engineVersion: SOLAR_DESIGN_ENGINE_VERSION };

  const n = design.modulesPerString;
  const checks: Check[] = [];
  const IEC62548 = 'IEC 62548-1 (PV array design) (rule to be confirmed against the purchased standard); module datasheet temperature coefficients';

  // Cold Voc against the lower of the inverter and module maximum.
  const vocCold = module.vocV * (1 + (module.betaVocPct / 100) * (temps.recordLowC - 25)) * n;
  const vMax = Math.min(inverter.maxDcV, module.maxSystemV);
  checks.push({ id: 'cold-voc', title: 'String Voc at the site record low', verdict: vocCold <= vMax ? 'PASS' : 'REFUSE', value: r2(vocCold), limit: vMax, unit: 'V', marginPct: margin(vocCold, vMax, true),
    formula: `Voc × (1 + β_Voc × (T_min − 25)) × N = ${module.vocV} × (1 + ${module.betaVocPct}/100 × (${temps.recordLowC} − 25)) × ${n}`, reference: IEC62548,
    note: vMax === module.maxSystemV && module.maxSystemV < inverter.maxDcV ? 'Limited by the module maximum system voltage' : undefined });

  // Hot Vmp against MPPT minimum, cold Vmp against MPPT maximum.
  const tCellHot = cellTemperature(temps.maxAmbientC, module.noctC);
  const vmpHot = module.vmpV * (1 + (module.betaVmpPct / 100) * (tCellHot - 25)) * n;
  checks.push({ id: 'hot-vmp', title: 'String Vmp at the hottest cell temperature', verdict: vmpHot >= inverter.mpptMinV ? 'PASS' : 'REFUSE', value: r2(vmpHot), limit: inverter.mpptMinV, unit: 'V', marginPct: margin(vmpHot, inverter.mpptMinV, false),
    formula: `Vmp × (1 + β_Vmp × (T_cell − 25)) × N; T_cell = T_amb + (NOCT − 20)/800 × 1000 = ${r2(tCellHot)} °C`, reference: IEC62548 });
  const vmpCold = module.vmpV * (1 + (module.betaVmpPct / 100) * (temps.recordLowC - 25)) * n;
  checks.push({ id: 'cold-vmp', title: 'String Vmp at the site record low', verdict: vmpCold <= inverter.mpptMaxV ? 'PASS' : 'REFUSE', value: r2(vmpCold), limit: inverter.mpptMaxV, unit: 'V', marginPct: margin(vmpCold, inverter.mpptMaxV, true),
    formula: `Vmp × (1 + β_Vmp × (T_min − 25)) × N`, reference: IEC62548 });

  // Currents per MPPT.
  design.stringsPerMppt.forEach((s, i) => {
    const imp = s * module.impA;
    const over = imp / inverter.maxInputA - 1;
    checks.push({ id: `imp-mppt${i + 1}`, title: `MPPT ${i + 1} operating current (${s} string${s > 1 ? 's' : ''})`,
      verdict: over <= 0 ? 'PASS' : over <= 0.1 ? 'WARN' : 'REFUSE', value: r2(imp), limit: inverter.maxInputA, unit: 'A', marginPct: margin(imp, inverter.maxInputA, true),
      formula: `strings × Imp = ${s} × ${module.impA}`, reference: 'Inverter datasheet maximum input current per MPPT',
      note: over > 0 && over <= 0.1 ? 'The inverter limits the current: some energy is clipped' : over > 0.1 ? 'More than 10 % above the input limit' : undefined });
    const isc = s * module.iscA * 1.25;
    checks.push({ id: `isc-mppt${i + 1}`, title: `MPPT ${i + 1} short-circuit current × 1.25`, verdict: isc <= inverter.maxIscA ? 'PASS' : 'REFUSE', value: r2(isc), limit: inverter.maxIscA, unit: 'A', marginPct: margin(isc, inverter.maxIscA, true),
      formula: `strings × Isc × 1.25 = ${s} × ${module.iscA} × 1.25`, reference: 'IEC 62548-1 (1.25 × Isc for irradiance above STC) (rule to be confirmed against the purchased standard); inverter datasheet maximum Isc per MPPT' });
    // String fusing (IEC 62548-1; rule to be confirmed against the purchased standard): needed when the reverse current from the other strings can exceed the module rating.
    const reverse = (s - 1) * module.iscA * 1.25;
    const needed = s >= 3 || reverse > module.maxSeriesFuseA;
    checks.push({ id: `fusing-mppt${i + 1}`, title: `MPPT ${i + 1} string overcurrent protection`, verdict: needed ? 'WARN' : 'PASS', value: r2(reverse), limit: module.maxSeriesFuseA, unit: 'A', marginPct: margin(reverse, module.maxSeriesFuseA, true),
      formula: `reverse current = (strings − 1) × 1.25 × Isc; fuse rating I_n with 1.5 × Isc < I_n ≤ 2.4 × Isc and ≤ module max series fuse`,
      reference: 'IEC 62548-1 overcurrent protection of PV strings (rule to be confirmed against the purchased standard)',
      note: needed ? `String fuses required on both poles: rating above ${r2(1.5 * module.iscA)} A and at most ${r2(Math.min(2.4 * module.iscA, module.maxSeriesFuseA))} A` : 'Not required' });
    if (needed && 1.5 * module.iscA >= Math.min(2.4 * module.iscA, module.maxSeriesFuseA)) {
      checks.push({ id: `fuse-window-mppt${i + 1}`, title: `MPPT ${i + 1} no valid string-fuse rating`, verdict: 'REFUSE', value: r2(1.5 * module.iscA), limit: module.maxSeriesFuseA, unit: 'A', marginPct: margin(1.5 * module.iscA, module.maxSeriesFuseA, true),
        formula: '1.5 × Isc must be below the module maximum series fuse rating', reference: 'IEC 62548-1 (rule to be confirmed against the purchased standard)' });
    }
  });

  // DC/AC ratio.
  const kWp = (n * design.stringsPerMppt.reduce((a, b) => a + b, 0) * module.pmaxW) / 1000;
  const ratio = kWp / inverter.acKw;
  checks.push({ id: 'dc-ac', title: 'DC/AC ratio', verdict: ratio >= 1.0 && ratio <= 1.35 ? 'PASS' : 'WARN', value: r2(ratio), limit: ratio > 1.35 ? 1.35 : 1.0, unit: '', marginPct: ratio > 1.35 ? margin(ratio, 1.35, true) : margin(ratio, 1.0, false),
    formula: `kWp ÷ AC kW = ${r2(kWp)} ÷ ${inverter.acKw}`, reference: 'Design practice; confirm the inverter datasheet maximum DC/AC ratio',
    note: ratio > 1.35 ? 'High ratio: more clipping' : ratio < 1.0 ? 'Inverter under-used' : undefined });

  return { valid: !checks.some((c) => c.verdict === 'REFUSE'), errors: [], checks, kWp: r2(kWp), engineVersion: SOLAR_DESIGN_ENGINE_VERSION };
}

/** IEC 60364-5-52: ampacity Iz = It × Ca × Cg ≥ design current; DC voltage drop with copper at service temperature. */
export function checkCable(c: CableRun): { checks: Check[]; errors: string[] } {
  const errors: string[] = [];
  for (const [k, v] of Object.entries({ lengthM: c.lengthM, csaMm2: c.csaMm2, designCurrentA: c.designCurrentA, systemV: c.systemV, tabulatedAmpacityA: c.tabulatedAmpacityA, maxDropPct: c.maxDropPct })) {
    if (!(Number.isFinite(v) && v > 0)) errors.push(`${c.name}: ${k} must be a positive number`);
  }
  if (!(c.ambientFactor > 0 && c.ambientFactor <= 1.25) || !(c.groupingFactor > 0 && c.groupingFactor <= 1)) errors.push(`${c.name}: correction factors must come from the IEC 60364-5-52 tables (ambient 0–1.25, grouping 0–1)`);
  if (c.conductor !== undefined && !(CABLE_CONDUCTORS as readonly string[]).includes(c.conductor)) errors.push(`${c.name}: conductor must be copper or aluminium`);
  if (errors.length) return { checks: [], errors };
  const iz = c.tabulatedAmpacityA * c.ambientFactor * c.groupingFactor;
  // ρ = 0.0225 Ω·mm²/m: copper resistivity at operating temperature (value per
  // IEC 60364-5-52 Annex G, to be confirmed against the purchased standard; review A3).
  const RHO = 0.0225;
  const vd = (2 * c.lengthM * c.designCurrentA * RHO) / c.csaMm2;
  const pct = (vd / c.systemV) * 100;
  // REQ-05: missing data is never compliant. Without the installation method
  // the tabulated It cannot be traced, so a capacity that fits is a WARN, not
  // a PASS (a capacity that does not fit is still REFUSED).
  const method = typeof c.method === 'string' ? c.method.trim() : '';
  const fits = iz >= c.designCurrentA;
  const ampacity: Check = { id: `ampacity-${c.name}`, title: `${c.name}: current-carrying capacity`, verdict: fits ? (method ? 'PASS' : 'WARN') : 'REFUSE', value: r2(c.designCurrentA), limit: r2(iz), unit: 'A', marginPct: margin(c.designCurrentA, iz, true),
    formula: `I_z = I_t × C_a × C_g = ${c.tabulatedAmpacityA} × ${c.ambientFactor} × ${c.groupingFactor}${method ? ` (installation method ${method})` : ''}`, reference: 'IEC 60364-5-52 (tabulated value and correction factors for the installation method)',
    ...(fits && !method ? { note: 'Installation method not stated: the tabulated It cannot be traced to a reference method, so the capacity is NOT confirmed' } : {}) };
  // Only the copper resistivity is built in. Aluminium is not checked; an
  // unstated conductor is worked out as copper but never passed.
  let vdrop: Check;
  if (c.conductor === 'aluminium') {
    vdrop = { id: `vdrop-${c.name}`, title: `${c.name}: voltage drop`, verdict: 'WARN', value: NaN, limit: c.maxDropPct, unit: '%', marginPct: NaN, formula: 'not checked', reference: 'IEC 60364-5-52 Annex G (voltage drop)',
      note: 'Aluminium conductor: only the copper resistivity is built in, so the voltage drop is NOT checked; work it out with the aluminium resistivity from the standard and record it' };
  } else {
    const within = pct <= c.maxDropPct;
    // Review A2: the 2 × L form is the two-conductor (DC or single-phase) drop.
    // For a three-phase AC run it overstates the drop by 2/√3 ≈ 1.155 (conservative).
    const notes = [
      ...(c.conductor === undefined ? [`Conductor not stated: worked out as copper${within ? ', so the voltage drop is NOT confirmed' : ''}`] : []),
      ...(c.kind === 'ac' ? ['Worked out single-phase (2 × L); for a three-phase circuit this overstates the drop by 2/√3 ≈ 1.155, so it is conservative'] : []),
    ];
    vdrop = { id: `vdrop-${c.name}`, title: `${c.name}: voltage drop`, verdict: within && c.conductor === 'copper' ? 'PASS' : 'WARN', value: r2(pct), limit: c.maxDropPct, unit: '%', marginPct: margin(pct, c.maxDropPct, true),
      formula: `${c.kind === 'ac' ? 'single-phase ' : ''}ΔV = 2 × L × I × ρ ÷ A = 2 × ${c.lengthM} × ${c.designCurrentA} × 0.0225 ÷ ${c.csaMm2} = ${r2(vd)} V`, reference: COPPER_RHO_BASIS,
      ...(notes.length ? { note: notes.join('. ') } : {}) };
  }
  return { errors, checks: [ampacity, vdrop] };
}

/** Review A3: the copper ρ is cited as a value to be confirmed (the Annex G value has not been read). */
export const COPPER_RHO_BASIS = 'Copper resistivity at operating temperature 0.0225 Ω·mm²/m (value per IEC 60364-5-52 Annex G, to be confirmed against the purchased standard)';

/** REQ-05: stated basis of the AC breaker coordination checks (no clause number until the standard is read). */
export const AC_PROTECTION_BASIS = 'IEC 60364-4-43, protection against overcurrent: coordination of the conductor and its protective device (I_B ≤ I_n ≤ I_z). Clause to be confirmed against the purchased standard.';
/** REQ-05: stated basis of the RCD type check. */
export const RCD_BASIS = 'IEC 60364-7-712 (solar PV power supply systems), RCD on the inverter AC circuit as the inverter manufacturer states it; RCD types AC, A, F, B (IEC 61008-1, IEC 62423), a type B device also meeting the type F, A and AC duties. Clauses to be confirmed against the purchased standards.';

/**
 * REQ-05: AC protective devices on each inverter's AC circuit.
 *  - ac-breaker-current: the breaker rating In covers the inverter's maximum AC output current I_B (I_B ≤ I_n), else REFUSE;
 *  - ac-cable-current-<run>: the protected AC cable's design current is at least I_B, else REFUSE
 *    (otherwise its capacity check would use a figure the inverter can exceed);
 *  - ac-breaker-cable: In ≤ I_z of the AC cable it protects, else REFUSE;
 *  - ac-rcd-type: the RCD fitted is at least the type the inverter manufacturer states, else REFUSE.
 * Missing data: WARN "not checked" (never a PASS). A breaker naming a cable that
 * is not in the design, or is not an AC cable, is REFUSED (inconsistent input).
 */
export function acProtectionChecks(inverter: Inverter, ac: AcProtection | undefined, cables: CableRun[], inverterCount: number): Check[] {
  const notChecked = (id: string, title: string, note: string, reference: string): Check => ({ id, title, verdict: 'WARN', value: NaN, limit: NaN, unit: '', marginPct: NaN, formula: 'not checked', reference, note });
  const refuse = (id: string, title: string, note: string, reference: string): Check => ({ id, title, verdict: 'REFUSE', value: NaN, limit: NaN, unit: '', marginPct: -100, formula: 'design input', reference, note });
  if (!ac) return [notChecked('ac-protection', 'AC protection devices', 'AC protection not entered: the AC breaker rating, the cable it protects and the RCD type are NOT checked', AC_PROTECTION_BASIS)];
  const out: Check[] = [];
  const pos = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x > 0;
  const ib = inverter.maxAcOutputA, inA = ac.breakerA;
  const each = inverterCount > 1 ? ' (each inverter)' : '';
  const T1 = `AC breaker rating covers the inverter maximum AC output current${each}`;
  if (!pos(inA)) out.push(notChecked('ac-breaker-current', T1, 'AC breaker rating In not entered (or not above 0 A): not checked', AC_PROTECTION_BASIS));
  else if (!pos(ib)) out.push(notChecked('ac-breaker-current', T1, 'Inverter maximum AC output current not entered from the datasheet (or not above 0 A): not checked', AC_PROTECTION_BASIS));
  else out.push({ id: 'ac-breaker-current', title: T1, verdict: inA >= ib ? 'PASS' : 'REFUSE', value: inA, limit: ib, unit: 'A', marginPct: margin(inA, ib, false),
    formula: `I_B ≤ I_n: inverter maximum AC output ${ib} A ≤ breaker ${inA} A`, reference: AC_PROTECTION_BASIS,
    note: inA >= ib ? 'Also confirm the breaker rating the inverter manual recommends' : 'The breaker is rated below the current the inverter can deliver: it will trip, or be overloaded, at full output' });

  const T2 = `AC breaker protects its cable (I_n ≤ I_z)${each}`;
  const name = typeof ac.cable === 'string' ? ac.cable.trim() : '';
  const run = name ? cables.find((c) => c.name === name) : undefined;
  if (!name) out.push(notChecked('ac-breaker-cable', T2, 'The AC cable this breaker protects is not named: I_n ≤ I_z is NOT checked', AC_PROTECTION_BASIS));
  else if (!run) out.push(refuse('ac-breaker-cable', T2, `"${name}" is not one of the design's cable runs`, AC_PROTECTION_BASIS));
  else if (run.kind !== 'ac') out.push(refuse('ac-breaker-cable', T2, `"${name}" is not an AC cable (its kind is ${run.kind ?? 'not stated, treated as dc-pv'})`, AC_PROTECTION_BASIS));
  else {
    const r = checkCable(run);
    const iz = run.tabulatedAmpacityA * run.ambientFactor * run.groupingFactor;
    // Review M1 (a20a31b9): how many inverters this run carries. With one
    // inverter it is 1; with several it must be stated (1 = this inverter's
    // own run, up to inverterCount = a shared run). Not stated with several
    // inverters is never a PASS.
    const nStated = run.invertersCarried;
    const nValid = nStated === undefined || (Number.isInteger(nStated) && (nStated as number) >= 1 && (nStated as number) <= inverterCount);
    const n: number | null = !nValid ? null : nStated !== undefined ? (nStated as number) : inverterCount === 1 ? 1 : null;
    const SHARED_NOT_STATED = 'not checked: state whether this run carries one inverter or all of them (inverters carried)';
    const TC = `${name}: design current covers the inverter AC output it carries`;
    if (!nValid) {
      out.push(refuse('ac-breaker-cable', T2, `Inverters carried by "${name}" must be a whole number from 1 to ${inverterCount} (got ${String(nStated)})`, AC_PROTECTION_BASIS));
      out.push(refuse(`ac-cable-current-${name}`, TC, `Inverters carried by "${name}" must be a whole number from 1 to ${inverterCount} (got ${String(nStated)})`, AC_PROTECTION_BASIS));
    } else {
      if (r.errors.length) out.push(notChecked('ac-breaker-cable', T2, `Cable "${name}" has invalid data (${r.errors.join('; ')}): not checked`, AC_PROTECTION_BASIS));
      else if (!pos(inA)) out.push(notChecked('ac-breaker-cable', T2, 'AC breaker rating In not entered (or not above 0 A): not checked', AC_PROTECTION_BASIS));
      else if (n === null) out.push(notChecked('ac-breaker-cable', T2, SHARED_NOT_STATED, AC_PROTECTION_BASIS));
      else if (n > 1) out.push(notChecked('ac-breaker-cable', T2, `not checked: "${name}" carries ${n} inverters, so one inverter's ${inA} A breaker does not protect it; the protective device of the shared run must be rated at least ${pos(ib) ? `${r2(n * ib)} A (${n} × ${ib} A)` : `${n} × the inverter maximum AC output`} and at most its I_z`, AC_PROTECTION_BASIS));
      else {
        const ok = inA <= iz * (1 + 1e-9);
        const traced = typeof run.method === 'string' && run.method.trim() !== '';
        // Review A1: I_n ≤ I_z also covers the overload condition (I_2 ≤ 1.45 × I_z)
        // only for a circuit-breaker (I_2 = 1.45 I_n or less); not for a fuse or an unstated device.
        const cb = ac.deviceType === 'circuit-breaker';
        out.push({ id: 'ac-breaker-cable', title: T2, verdict: ok ? (traced && cb ? 'PASS' : 'WARN') : 'REFUSE', value: inA, limit: r2(iz), unit: 'A', marginPct: margin(inA, iz, true),
          formula: `I_n ≤ I_z: breaker ${inA} A ≤ I_z of "${name}" = ${run.tabulatedAmpacityA} × ${run.ambientFactor} × ${run.groupingFactor} = ${r2(iz)} A`, reference: AC_PROTECTION_BASIS,
          note: !ok ? 'The breaker is rated above what the cable can carry: the cable is not protected against overload'
            : !traced ? `Cable "${name}" has no installation method: its I_z is not traceable, so the coordination is NOT confirmed`
            : !cb ? `not checked: fuse I2 condition. The device is ${ac.deviceType === 'fuse' ? 'a fuse' : 'not stated to be a circuit-breaker'}, so the second condition (I_2 ≤ 1.45 × I_z) is not worked out: work it out from the device's conventional fusing current`
            : 'The second condition (conventional tripping current I_2 ≤ 1.45 × I_z) is not worked out: confirm it from the breaker datasheet' });
      }
      // The run's own design current (and its I_z) must cover the inverter output it carries.
      if (!pos(ib)) out.push(notChecked(`ac-cable-current-${name}`, TC, 'Inverter maximum AC output current not entered: not checked', AC_PROTECTION_BASIS));
      else if (n === null) out.push(notChecked(`ac-cable-current-${name}`, TC, SHARED_NOT_STATED, AC_PROTECTION_BASIS));
      else if (Number.isFinite(run.designCurrentA)) {
        const need = ib * n;
        const okI = run.designCurrentA >= need * (1 - 1e-9), okZ = r.errors.length === 0 && iz >= need * (1 - 1e-9);
        out.push({ id: `ac-cable-current-${name}`, title: TC, verdict: okI && okZ ? 'PASS' : 'REFUSE', value: r2(Math.min(run.designCurrentA, iz)), limit: r2(need), unit: 'A', marginPct: margin(Math.min(run.designCurrentA, iz), need, false),
          formula: `inverters carried × inverter maximum AC output = ${n} × ${ib} A = ${r2(need)} A ≤ design current ${run.designCurrentA} A and ≤ I_z ${r2(iz)} A`, reference: AC_PROTECTION_BASIS,
          ...(okI && okZ ? {} : { note: !okI ? `The entered design current is below the ${r2(need)} A the run carries: size the AC cable for it` : `I_z ${r2(iz)} A is below the ${r2(need)} A the run carries` }) });
      }
    }
  }

  const T3 = `RCD type on the inverter AC circuit${each}`;
  const req = inverter.rcdTypeRequired, fit = ac.rcdType;
  const rank = (t: unknown) => (RCD_TYPES as readonly unknown[]).indexOf(t);
  if (req === undefined) out.push(notChecked('ac-rcd-type', T3, 'The inverter datasheet RCD requirement is not entered: the RCD type is NOT checked', RCD_BASIS));
  else if (req !== 'not-required' && rank(req) < 0) out.push(refuse('ac-rcd-type', T3, `"${String(req)}" is not an RCD type (AC, A, F, B or not-required)`, RCD_BASIS));
  else if (fit !== undefined && fit !== 'none' && rank(fit) < 0) out.push(refuse('ac-rcd-type', T3, `"${String(fit)}" is not an RCD type (AC, A, F, B or none)`, RCD_BASIS));
  else if (req === 'not-required') out.push({ id: 'ac-rcd-type', title: T3, verdict: 'PASS', value: fit === undefined || fit === 'none' ? 0 : 1, limit: 0, unit: '', marginPct: 0, formula: 'inverter manufacturer: no particular RCD type required by the inverter', reference: RCD_BASIS,
    note: `Fitted: ${fit === undefined ? 'not stated' : fit === 'none' ? 'none' : `type ${fit}`}. Whether the wiring rules require an RCD on this circuit (earthing system, location) is the engineer's decision` });
  else if (fit === undefined) out.push(notChecked('ac-rcd-type', T3, `The inverter requires type ${req}; the RCD fitted is not entered: not checked`, RCD_BASIS));
  else {
    const ok = fit !== 'none' && rank(fit) >= rank(req);
    out.push({ id: 'ac-rcd-type', title: T3, verdict: ok ? 'PASS' : 'REFUSE', value: rank(fit), limit: rank(req), unit: '', marginPct: ok ? 0 : -100,
      formula: `fitted ${fit === 'none' ? 'no RCD' : `type ${fit}`} must be at least type ${req} (order AC < A < F < B)`, reference: RCD_BASIS,
      ...(ok ? {} : { note: `The inverter manufacturer requires a type ${req} RCD; ${fit === 'none' ? 'none is fitted' : `type ${fit} does not meet it`}` }) });
  }
  return out;
}

/**
 * Review G3: a PV cable's design current is tied to the strings it carries.
 * IEC 62548-1 (rule to be confirmed against the purchased standard) sizes PV string/array cable for 1.25 × Isc per string, so the
 * entered design current must be at least strings × Isc × 1.25 of the MPPT it
 * serves (the most heavily loaded MPPT when not stated). Below that the
 * cable is REFUSED: the ampacity check would otherwise use a figure the
 * array can exceed. AC and battery cables are not tied to the strings.
 */
/** The stated basis for string cable current (re-review S1; 2026-11-27): the clause number is from the official contents list; the rule itself has not been read. */
export const STRING_CABLE_BASIS = 'IEC 62548-1:2023+AMD1:2025, clause 7.2.2 Current rating of PV circuits (clause number from the official contents list; clause text not reviewed). The rule (protected: Iz ≥ In of the string fuse; unprotected: ≥ (N − 1) × 1.25 × Isc, min 1.25 × Isc) is to be confirmed against the purchased standard.';

export function cableStringCurrentCheck(c: CableRun, module: Module, design: ArrayDesign): Check | null {
  if (c.kind === 'ac' || c.kind === 'dc-battery') return null;
  const per = design.stringsPerMppt;
  if (!per.length || !(module.iscA > 0)) return null;
  const mpptStated = c.mppt !== undefined;
  const strings = mpptStated ? per[(c.mppt as number) - 1] : Math.max(...per);
  if (!(Number.isInteger(strings) && strings >= 1)) {
    return { id: `cable-current-${c.name}`, title: `${c.name}: MPPT served`, verdict: 'REFUSE', value: NaN, limit: per.length, unit: '', marginPct: -100, formula: 'mppt must name an MPPT of the design', reference: 'Design input', note: `MPPT ${c.mppt} is not in the design (1–${per.length})` };
  }
  // Review of 39fa8535, R1: a cable serving ONE string was sized as if it
  // carried every string on the MPPT. Basis (re-review S1; 2026-11-27: clause number from the
  // official contents list, rule text unread): IEC 62548-1:2023+AMD1:2025, clause 7.2.2 Current rating of PV circuits (clause number from the official contents list; clause text not reviewed). The rule (protected: Iz ≥ In of the string fuse; unprotected: ≥ (N − 1) × 1.25 × Isc, min 1.25 × Isc) is to be confirmed against the purchased standard.
  // Unfused, a string cable can carry the reverse current of the other
  // strings, so the larger of the two applies.
  if (c.kind === 'dc-string') {
    const isc125 = module.iscA * 1.25;
    const fuse = c.stringFuseA;
    let required: number, basis: string;
    if (fuse !== undefined) {
      const lo = 1.5 * module.iscA, hi = Math.min(2.4 * module.iscA, module.maxSeriesFuseA);
      if (!(Number.isFinite(fuse) && fuse > lo && fuse <= hi)) {
        return { id: `cable-current-${c.name}`, title: `${c.name}: string fuse rating`, verdict: 'REFUSE', value: Number.isFinite(fuse) ? fuse : NaN, limit: r2(hi), unit: 'A', marginPct: -100,
          formula: `1.5 × Isc < In ≤ min(2.4 × Isc, module max series fuse) = ${r2(lo)} < In ≤ ${r2(hi)} A`, reference: 'IEC 62548-1 string overcurrent protection (rule to be confirmed against the purchased standard)', note: `A ${fuse} A string fuse is outside the design's fuse window` };
      }
      required = Math.max(isc125, fuse);
      basis = `string cable, fused: max(1.25 × Isc = ${r2(isc125)} A, fuse In = ${fuse} A)`;
    } else if (strings >= 3 || (strings - 1) * isc125 > module.maxSeriesFuseA) {
      // Re-review S2: the same rule as the string-fusing check (fusing-mppt):
      // where fuses are required an unfused string cable is not acceptable.
      return { id: `cable-current-${c.name}`, title: `${c.name}: string fuse rating`, verdict: 'REFUSE', value: NaN, limit: r2((strings - 1) * isc125), unit: 'A', marginPct: -100,
        formula: `${strings} strings: fuses required when strings ≥ 3 or (N − 1) × 1.25 × Isc = ${r2((strings - 1) * isc125)} A > module max series fuse ${module.maxSeriesFuseA} A`,
        reference: STRING_CABLE_BASIS, note: 'String fuses are required on this MPPT: give the string fuse rating' };
    } else {
      required = Math.max(isc125, (strings - 1) * isc125);
      basis = `string cable, no string fuse stated: max(1.25 × Isc, (N − 1) × 1.25 × Isc reverse current) with N = ${strings}`;
    }
    const ok = c.designCurrentA >= required * (1 - 1e-9);
    return {
      id: `cable-current-${c.name}`, title: `${c.name}: design current covers the string and its protection`, verdict: ok ? 'PASS' : 'REFUSE', value: r2(c.designCurrentA), limit: r2(required), unit: 'A', marginPct: margin(c.designCurrentA, required, false),
      formula: `${basis} = ${r2(required)} A`, reference: STRING_CABLE_BASIS,
      ...(ok ? {} : { note: 'The entered design current is below the string cable requirement' }),
    };
  }
  const required = strings * module.iscA * 1.25;
  const ok = c.designCurrentA >= required * (1 - 1e-9);
  return {
    id: `cable-current-${c.name}`, title: `${c.name}: design current covers the strings it carries`, verdict: ok ? 'PASS' : 'REFUSE', value: r2(c.designCurrentA), limit: r2(required), unit: 'A', marginPct: margin(c.designCurrentA, required, false),
    formula: `strings × Isc × 1.25 = ${strings} × ${module.iscA} × 1.25 = ${r2(required)} A (${mpptStated ? `MPPT ${c.mppt}` : 'largest MPPT; state the MPPT or kind to narrow it'})`,
    reference: 'IEC 62548-1 (PV cable current 1.25 × Isc per string) (rule to be confirmed against the purchased standard)',
    ...(ok ? {} : { note: 'The entered design current is below what the strings can deliver: size the cable for the string current' }),
  };
}

/**
 * Checks enabled by the REQ-04 datasheet fields (and REQ-01 usable area).
 * A check whose data is missing is a WARN that says "not checked"; nothing
 * is assumed.
 *  - array area: modules × length × width ≤ usable area, else REFUSE (it cannot fit);
 *  - battery voltage: unit nominal V × units in series inside the inverter's
 *    battery window, else REFUSE;
 *  - battery current: inverter battery-port A ≤ battery bank A at its C-rate
 *    (C × Ah per string × parallel strings), else REFUSE;
 *  - battery temperature: site temperatures inside the battery window, else WARN
 *    (the battery may be indoors);
 *  - anti-islanding: a grid connection with no statement is a WARN.
 */
/** Plausible PV module length/width range, mm (smallest residential to largest utility modules); outside it the value is treated as a unit mistake. */
export const MODULE_DIM_MM = { min: 300, max: 3500 };

export function componentChecks(o: {
  module: Module; inverter: Inverter; modules: number; usableAreaM2?: number;
  battery?: { data: Battery; units: number; seriesPerString?: number };
  temps: SiteTemps; grid: boolean | null;
}): Check[] {
  const out: Check[] = [];
  const notChecked = (id: string, title: string, note: string): Check => ({ id, title, verdict: 'WARN', value: NaN, limit: NaN, unit: '', marginPct: NaN, formula: 'not checked', reference: 'Datasheet value required', note });
  const m = o.module;
  if (o.usableAreaM2 !== undefined) {
    const AREA_TITLE = 'Gross module area (before row spacing and access) fits the usable area';
    // Review Q1/Q2: a negative dimension (JSON) or metres typed as mm (2.278)
    // gave a negative or near-zero area that PASSED. Only a finite dimension
    // in the plausible module range is used; otherwise not checked.
    const dimOk = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x >= MODULE_DIM_MM.min && x <= MODULE_DIM_MM.max;
    if (dimOk(m.lengthMm) && dimOk(m.widthMm)) {
      const area = (o.modules * m.lengthMm * m.widthMm) / 1e6;
      out.push({ id: 'array-area', title: AREA_TITLE, verdict: area <= o.usableAreaM2 ? 'PASS' : 'REFUSE', value: r2(area), limit: o.usableAreaM2, unit: 'm²', marginPct: margin(area, o.usableAreaM2, true),
        formula: `gross module area = modules × length × width = ${o.modules} × ${m.lengthMm} mm × ${m.widthMm} mm = ${r2(area)} m² (before row spacing and access paths; a PASS does not mean the layout fits)`, reference: 'Module datasheet dimensions; site survey usable area' });
    } else out.push(notChecked('array-area', AREA_TITLE, m.lengthMm === undefined || m.widthMm === undefined
      ? 'Module dimensions not entered: the array area is not checked against the usable area'
      : `Module dimensions ${m.lengthMm} × ${m.widthMm} mm are outside ${MODULE_DIM_MM.min}–${MODULE_DIM_MM.max} mm (metres typed in a mm field?): not checked`));
  }
  const b = o.battery;
  if (b) {
    const series = b.seriesPerString ?? 1;
    const inv = o.inverter;
    if (!(Number.isInteger(series) && series >= 1 && b.units % series === 0)) {
      out.push({ id: 'battery-arrangement', title: 'Battery series/parallel arrangement', verdict: 'REFUSE', value: b.units, limit: series, unit: 'units', marginPct: -100, formula: 'units must be a whole number of strings of seriesPerString units', reference: 'Design input', note: `${b.units} units cannot be arranged in strings of ${series}` });
    } else {
      const parallel = b.units / series;
      const pos = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x > 0;
      const bankV = pos(b.data.nominalV) ? b.data.nominalV * series : undefined;
      if (bankV !== undefined && pos(inv.batteryMinV) && pos(inv.batteryMaxV)) {
        const ok = bankV >= inv.batteryMinV && bankV <= inv.batteryMaxV;
        out.push({ id: 'battery-voltage', title: 'Nominal bank voltage inside the inverter battery window', verdict: ok ? 'PASS' : 'REFUSE', value: r2(bankV), limit: bankV > inv.batteryMaxV ? inv.batteryMaxV : inv.batteryMinV, unit: 'V', marginPct: bankV > inv.batteryMaxV ? margin(bankV, inv.batteryMaxV, true) : margin(bankV, inv.batteryMinV, false),
          formula: `unit nominal V × units in series = ${b.data.nominalV} × ${series} = ${r2(bankV)} V; window ${inv.batteryMinV}–${inv.batteryMaxV} V`, reference: 'Inverter and battery datasheets' });
      } else out.push(notChecked('battery-voltage', 'Nominal bank voltage inside the inverter battery window', 'Battery nominal voltage or the inverter battery voltage window not entered: not checked'));
      // Review advisory A2: the nominal voltage can sit inside the window while
      // the full-charge or cut-off voltage does not (16S LFP charges at ~57.6 V).
      // Re-review Q6: swapped values sent as JSON (charge 44.8 V, cut-off 57.6 V)
      // passed a 40–56 V window; the import refuses them but the API path does not run it.
      if (pos(b.data.chargeV) && pos(b.data.cutoffV) && !(b.data.cutoffV < b.data.chargeV)) {
        out.push({ id: 'battery-voltage-range', title: 'Charge and cut-off bank voltages inside the inverter battery window', verdict: 'REFUSE', value: b.data.cutoffV, limit: b.data.chargeV, unit: 'V', marginPct: -100,
          formula: `cut-off ${b.data.cutoffV} V must be below full charge ${b.data.chargeV} V`, reference: 'Battery datasheet', note: 'battery cut-off voltage must be below its full-charge voltage' });
      } else if (pos(b.data.chargeV) && pos(b.data.cutoffV) && pos(inv.batteryMinV) && pos(inv.batteryMaxV)) {
        const hi = b.data.chargeV * series, lo = b.data.cutoffV * series;
        const ok = hi <= inv.batteryMaxV && lo >= inv.batteryMinV;
        out.push({ id: 'battery-voltage-range', title: 'Charge and cut-off bank voltages inside the inverter battery window', verdict: ok ? 'PASS' : 'REFUSE', value: r2(hi > inv.batteryMaxV ? hi : lo), limit: hi > inv.batteryMaxV ? inv.batteryMaxV : inv.batteryMinV, unit: 'V', marginPct: hi > inv.batteryMaxV ? margin(hi, inv.batteryMaxV, true) : margin(lo, inv.batteryMinV, false),
          formula: `charge ${b.data.chargeV} × ${series} = ${r2(hi)} V ≤ ${inv.batteryMaxV} V; cut-off ${b.data.cutoffV} × ${series} = ${r2(lo)} V ≥ ${inv.batteryMinV} V`, reference: 'Battery datasheet charge and cut-off voltages; inverter battery window' });
      } else out.push(notChecked('battery-voltage-range', 'Charge and cut-off bank voltages inside the inverter battery window', 'Battery charge / cut-off voltages or the inverter window not entered: only the nominal voltage is checked; confirm the charge and cut-off voltages on the datasheets'));
      // Review Q3: a missing battery voltage or inverter battery current made the
      // current checks disappear; they are now shown as not checked.
      for (const [dir, invA, c] of [['discharge', inv.batteryMaxDischargeA, b.data.maxDischargeC], ['charge', inv.batteryMaxChargeA, b.data.maxChargeC]] as const) {
        const title = `Inverter battery ${dir} current within the battery limit`;
        if (bankV === undefined) { out.push(notChecked(`battery-${dir}-current`, title, 'Battery nominal voltage not entered: the battery current limit cannot be worked out')); continue; }
        if (!pos(invA)) { out.push(notChecked(`battery-${dir}-current`, title, `Inverter battery ${dir} current not entered: not checked`)); continue; }
        {
          // A string of units in series has the Ah of one unit (unit Wh ÷ unit V).
          const unitAh = (b.data.nominalKwh * 1000) / (b.data.nominalV as number);
          const bankA = c * unitAh * parallel;
          out.push({ id: `battery-${dir}-current`, title, verdict: invA <= bankA * (1 + 1e-9) ? 'PASS' : 'REFUSE', value: invA, limit: r2(bankA), unit: 'A', marginPct: margin(invA, bankA, true),
            formula: `battery limit = C × unit Ah × parallel strings = ${c} × ${r2(unitAh)} Ah × ${parallel} = ${r2(bankA)} A`, reference: 'Inverter battery-port current; battery datasheet C-rate' });
        }
      }
      if (b.data.minTempC !== undefined && b.data.maxTempC !== undefined) {
        const ok = o.temps.recordLowC >= b.data.minTempC && o.temps.maxAmbientC <= b.data.maxTempC;
        out.push({ id: 'battery-temperature', title: 'Site temperatures inside the battery operating window', verdict: ok ? 'PASS' : 'WARN', value: o.temps.maxAmbientC, limit: b.data.maxTempC, unit: '°C', marginPct: margin(o.temps.maxAmbientC, b.data.maxTempC, true),
          formula: `site ${o.temps.recordLowC}–${o.temps.maxAmbientC} °C vs battery ${b.data.minTempC}–${b.data.maxTempC} °C`, reference: 'Battery datasheet operating temperature',
          ...(ok ? {} : { note: 'Outside the battery window at the site\'s outdoor temperatures: house the battery in a conditioned room, or choose another battery' }) });
      } else out.push(notChecked('battery-temperature', 'Site temperatures inside the battery operating window', 'Battery operating temperature window not entered: not checked'));
    }
  }
  if (o.grid === true) {
    const ai = (o.inverter.antiIslanding ?? '').trim();
    out.push(ai
      ? { id: 'anti-islanding', title: 'Anti-islanding protection stated', verdict: 'PASS', value: 1, limit: 1, unit: '', marginPct: 0, formula: 'manufacturer statement', reference: 'IEC 62116 (anti-islanding test); utility connection rules', note: ai }
      : notChecked('anti-islanding', 'Anti-islanding protection stated', 'Grid-connected but no anti-islanding statement (e.g. IEC 62116 certificate) entered for the inverter'));
  }
  return out;
}

/** Battery sizing and C-rate. usableAcKwh is the energy the loads need from the battery per cycle. */
export function checkBattery(battery: Battery, inverter: Inverter, usableAcKwh: number, units: number): { checks: Check[]; errors: string[]; requiredNominalKwh: number } {
  const errors: string[] = [];
  if (!(usableAcKwh > 0)) errors.push('Energy needed from the battery must be positive');
  if (!(battery.usableDoD > 0 && battery.usableDoD <= 1)) errors.push('Usable depth of discharge must be between 0 and 1 (datasheet)');
  if (!(battery.dischargeEfficiency > 0 && battery.dischargeEfficiency <= 1)) errors.push('Discharge efficiency must be between 0 and 1');
  if (!(battery.nominalKwh > 0) || !Number.isInteger(units) || units < 1) errors.push('Battery capacity and number of units must be positive');
  if (!(battery.maxDischargeC > 0 && battery.maxChargeC > 0)) errors.push('C-rates from the battery datasheet are required');
  if (!battery.datasheet?.trim()) errors.push('Battery datasheet reference is required');
  if (errors.length) return { checks: [], errors, requiredNominalKwh: 0 };
  const required = usableAcKwh / (battery.usableDoD * battery.dischargeEfficiency);
  const installed = battery.nominalKwh * units;
  const checks: Check[] = [
    // Review G4: 8.55 ÷ (0.9 × 0.95) = 10.000000000000002 refused an exactly-sized
    // 10 kWh bank; a 1e-9 relative tolerance absorbs float rounding only.
    { id: 'battery-energy', title: 'Installed battery energy', verdict: installed >= required * (1 - 1e-9) ? 'PASS' : 'REFUSE', value: r2(installed), limit: r2(required), unit: 'kWh', marginPct: margin(installed, required, false),
      formula: `required nominal = usable AC ÷ (DoD × η_discharge) = ${usableAcKwh} ÷ (${battery.usableDoD} × ${battery.dischargeEfficiency})`, reference: 'Energy balance; battery datasheet DoD and efficiency' },
  ];
  // CA-32 (2026-11-26): without the inverter's battery power the C-rate was
  // simply not checked and the design passed. Missing data is never assumed
  // compliant: the check is refused until the datasheet value is entered.
  // Review G1: 0 kW or a negative power gave 0 C or −0.25 C, a "pass". Anything
  // not > 0 is treated as not given.
  if (!(typeof inverter.batteryMaxDischargeKw === 'number' && inverter.batteryMaxDischargeKw > 0)) {
    checks.push({ id: 'battery-discharge-c', title: 'Discharge C-rate at full inverter battery power', verdict: 'REFUSE', value: NaN, limit: battery.maxDischargeC, unit: 'C', marginPct: -100,
      formula: 'inverter battery discharge kW ÷ installed kWh', reference: 'Battery datasheet maximum continuous discharge rate', note: 'Inverter battery discharge power not entered (or not above 0 kW): the C-rate cannot be checked, so the design is refused until the inverter datasheet value is given' });
  } else {
    const c = (inverter.batteryMaxDischargeKw as number) / installed;
    checks.push({ id: 'battery-discharge-c', title: 'Discharge C-rate at full inverter battery power', verdict: c <= battery.maxDischargeC ? 'PASS' : 'REFUSE', value: r2(c), limit: battery.maxDischargeC, unit: 'C', marginPct: margin(c, battery.maxDischargeC, true),
      formula: `inverter battery kW ÷ installed kWh = ${inverter.batteryMaxDischargeKw} ÷ ${r2(installed)}`, reference: 'Battery datasheet maximum continuous discharge rate' });
  }
  if (!(typeof inverter.batteryMaxChargeKw === 'number' && inverter.batteryMaxChargeKw > 0)) {
    checks.push({ id: 'battery-charge-c', title: 'Charge C-rate at full inverter charge power', verdict: 'REFUSE', value: NaN, limit: battery.maxChargeC, unit: 'C', marginPct: -100,
      formula: 'inverter charge kW ÷ installed kWh', reference: 'Battery datasheet maximum continuous charge rate', note: 'Inverter battery charge power not entered (or not above 0 kW): the C-rate cannot be checked, so the design is refused until the inverter datasheet value is given' });
  } else {
    const c = (inverter.batteryMaxChargeKw as number) / installed;
    checks.push({ id: 'battery-charge-c', title: 'Charge C-rate at full inverter charge power', verdict: c <= battery.maxChargeC ? 'PASS' : 'REFUSE', value: r2(c), limit: battery.maxChargeC, unit: 'C', marginPct: margin(c, battery.maxChargeC, true),
      formula: `inverter charge kW ÷ installed kWh = ${inverter.batteryMaxChargeKw} ÷ ${r2(installed)}`, reference: 'Battery datasheet maximum continuous charge rate' });
  }
  return { checks, errors, requiredNominalKwh: r2(required) };
}

/** What a proposal or diagram states about a generator connection (structurally SldConnections). */
export interface GeneratorConnection {
  generator: boolean | null;
  generatorRatedKw?: number;
  /** Lowest site load while the generator runs, kW. */
  generatorMinSiteLoadKw?: number;
  /** Generator OEM minimum load, % (30 % assumed when absent). */
  generatorOemMinLoadPct?: number;
  /** true = PV can push power back into the running generator (no export limiting / reverse-power relay); null = not stated. */
  pvCanBackfeedGenerator?: boolean | null;
}

/**
 * Generator checks for a design that has a generator (CA-32, 2026-11-26: the
 * proposal and diagram never ran checkGenerator, so an inverter with no
 * generator-compatibility statement, or PV able to back-feed the generator,
 * was marked valid). Missing data is refused, never assumed safe: no rating,
 * or no statement about back-feed, is a REFUSE; an unstated minimum site load
 * is a WARN (not checked).
 */
export function generatorConnectionChecks(inverter: Inverter, conn: GeneratorConnection): Check[] {
  const rated = conn.generatorRatedKw;
  const refuse = (id: string, title: string, note: string): Check => ({ id, title, verdict: 'REFUSE', value: NaN, limit: NaN, unit: '', marginPct: -100, formula: 'required input', reference: 'P1-B §3 hybrid / generator: never assume parallel operation is safe', note });
  const out: Check[] = [];
  if (!(typeof rated === 'number' && Number.isFinite(rated) && rated > 0)) out.push(refuse('gen-rating', 'Generator rating', 'Generator connected but its rated kW is not given'));
  if (conn.pvCanBackfeedGenerator !== true && conn.pvCanBackfeedGenerator !== false) out.push(refuse('gen-backfeed-stated', 'Reverse power into the generator: stated?', 'State whether PV can feed power back into the running generator (export limiting or a reverse-power relay); unknown is refused'));
  const gc = checkGenerator(inverter, { ratedKw: typeof rated === 'number' && rated > 0 ? rated : NaN, oemMinLoadPct: conn.generatorOemMinLoadPct }, conn.generatorMinSiteLoadKw ?? NaN, conn.pvCanBackfeedGenerator === true);
  for (const c of gc) {
    if (c.id === 'gen-min-load' && !(typeof conn.generatorMinSiteLoadKw === 'number' && Number.isFinite(conn.generatorMinSiteLoadKw) && out.every((x) => x.id !== 'gen-rating'))) {
      out.push({ ...c, verdict: 'WARN', value: NaN, marginPct: NaN, note: 'Minimum site load (or the generator rating) not given: minimum loading NOT checked' });
    } else out.push(c);
  }
  return out;
}

/** Hybrid with a generator. Parallel operation is never assumed safe. */
export function checkGenerator(inverter: Inverter, gen: { ratedKw: number; oemMinLoadPct?: number }, minSiteLoadKw: number, pvCanBackfeed: boolean): Check[] {
  // Review of 39fa8535, R3: an OEM minimum of 0 % made every site load a
  // "pass". 0, a negative or a non-number is treated as not given, so the
  // stated 30 % practice applies and is labelled as such.
  const oemGiven = typeof gen.oemMinLoadPct === 'number' && Number.isFinite(gen.oemMinLoadPct) && gen.oemMinLoadPct > 0;
  const minPct = oemGiven ? (gen.oemMinLoadPct as number) : 30;
  const minKw = (gen.ratedKw * minPct) / 100;
  // R2: a non-string statement is no statement (and never a raw JS error).
  const compat = typeof inverter.generatorCompatibility === 'string' ? inverter.generatorCompatibility.trim() : '';
  // Re-review: an OEM minimum below 5 % is almost certainly a fraction typed
  // as a percentage (0.3 meaning 30 %): never a pass on that value.
  const probableFraction = oemGiven && (gen.oemMinLoadPct as number) < 5;
  const checks: Check[] = [
    // Review G2: a statement of only spaces counted; it is trimmed first. The
    // text itself ("supported" vs "NOT supported") is the engineer's, checked
    // by the second-person datasheet verification, not by code.
    { id: 'gen-compat', title: 'Inverter listed as generator-compatible', verdict: compat ? 'PASS' : 'REFUSE', value: compat ? 1 : 0, limit: 1, unit: '', marginPct: compat ? 0 : -100,
      formula: 'manufacturer statement required', reference: 'Inverter manufacturer documentation', note: compat ? `${compat} (the statement's wording is confirmed by the second-person datasheet check)` : 'No manufacturer statement: generator connection refused' },
    { id: 'gen-min-load', title: 'Generator minimum loading', verdict: minSiteLoadKw >= minKw ? 'PASS' : 'WARN', value: r2(minSiteLoadKw), limit: r2(minKw), unit: 'kW', marginPct: margin(minSiteLoadKw, minKw, false),
      formula: `minimum load ≥ ${minPct} % × ${gen.ratedKw} kW`, reference: oemGiven ? 'Generator OEM minimum load' : `Common diesel practice (30 %) until the OEM figure is entered${gen.oemMinLoadPct !== undefined ? ` (the ${gen.oemMinLoadPct} % entered is not a usable OEM figure)` : ''}`,
      note: minSiteLoadKw < minKw ? 'Light loading: wet stacking risk; schedule load banks or reduce PV while the generator runs' : undefined },
  ];
  if (probableFraction) {
    const k = checks.find((x) => x.id === 'gen-min-load')!;
    const pct = gen.oemMinLoadPct as number;
    // Only a value ≤ 1 can be a fraction (0.3 → 30 %); 1–5 % is just unusual (CA-32 third review).
    Object.assign(k, { verdict: 'WARN', note: pct <= 1
      ? `Check units: an OEM minimum of ${pct} % is probably a fraction; did you mean ${Math.round(pct * 100 * 100) / 100} %? Minimum loading is not passed on this value.`
      : `Check the OEM minimum load: ${pct} % is below 5 %, which is unusual for a diesel set. Minimum loading is not passed on this value.` });
  }
  if (pvCanBackfeed) {
    checks.push({ id: 'gen-reverse-power', title: 'Reverse power into the generator', verdict: 'REFUSE', value: 1, limit: 0, unit: '', marginPct: -100,
      formula: 'PV must not export into a running generator', reference: 'Generator protection practice (reverse-power relay); inverter generator mode',
      note: 'Add generator-mode export limiting or a reverse-power relay, confirmed by the inverter and controller manufacturers' });
  }
  return checks;
}
