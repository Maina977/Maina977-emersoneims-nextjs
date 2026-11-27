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
  datasheet: string;
}

export interface Battery {
  model: string;
  nominalKwh: number;
  usableDoD: number; // 0–1
  dischargeEfficiency: number; // 0–1
  maxDischargeC: number; maxChargeC: number;
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
  kind?: 'dc-pv' | 'dc-battery' | 'ac';
  /** For a PV cable: the MPPT (1-based) it serves; absent = the most heavily loaded MPPT. */
  mppt?: number;
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
  if (design.stringsPerMppt.length > inverter.mpptCount) e.push(`The design uses ${design.stringsPerMppt.length} MPPTs; the inverter has ${inverter.mpptCount}`);
  if (!module.datasheet || !inverter.datasheet) e.push('Module and inverter datasheet references are required');
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
  const IEC62548 = 'IEC 62548-1 (PV array design); module datasheet temperature coefficients';

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
      formula: `strings × Isc × 1.25 = ${s} × ${module.iscA} × 1.25`, reference: 'IEC 62548-1 (1.25 × Isc for irradiance above STC); inverter datasheet maximum Isc per MPPT' });
    // String fusing (IEC 62548-1): needed when the reverse current from the other strings can exceed the module rating.
    const reverse = (s - 1) * module.iscA * 1.25;
    const needed = s >= 3 || reverse > module.maxSeriesFuseA;
    checks.push({ id: `fusing-mppt${i + 1}`, title: `MPPT ${i + 1} string overcurrent protection`, verdict: needed ? 'WARN' : 'PASS', value: r2(reverse), limit: module.maxSeriesFuseA, unit: 'A', marginPct: margin(reverse, module.maxSeriesFuseA, true),
      formula: `reverse current = (strings − 1) × 1.25 × Isc; fuse rating I_n with 1.5 × Isc < I_n ≤ 2.4 × Isc and ≤ module max series fuse`,
      reference: 'IEC 62548-1 overcurrent protection of PV strings',
      note: needed ? `String fuses required on both poles: rating above ${r2(1.5 * module.iscA)} A and at most ${r2(Math.min(2.4 * module.iscA, module.maxSeriesFuseA))} A` : 'Not required' });
    if (needed && 1.5 * module.iscA >= Math.min(2.4 * module.iscA, module.maxSeriesFuseA)) {
      checks.push({ id: `fuse-window-mppt${i + 1}`, title: `MPPT ${i + 1} no valid string-fuse rating`, verdict: 'REFUSE', value: r2(1.5 * module.iscA), limit: module.maxSeriesFuseA, unit: 'A', marginPct: margin(1.5 * module.iscA, module.maxSeriesFuseA, true),
        formula: '1.5 × Isc must be below the module maximum series fuse rating', reference: 'IEC 62548-1' });
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
  if (errors.length) return { checks: [], errors };
  const iz = c.tabulatedAmpacityA * c.ambientFactor * c.groupingFactor;
  // ρ = 0.0225 Ω·mm²/m: copper at normal service temperature, IEC 60364-5-52 Annex G (1.25 × ρ at 20 °C).
  const RHO = 0.0225;
  const vd = (2 * c.lengthM * c.designCurrentA * RHO) / c.csaMm2;
  const pct = (vd / c.systemV) * 100;
  return {
    errors,
    checks: [
      { id: `ampacity-${c.name}`, title: `${c.name}: current-carrying capacity`, verdict: iz >= c.designCurrentA ? 'PASS' : 'REFUSE', value: r2(c.designCurrentA), limit: r2(iz), unit: 'A', marginPct: margin(c.designCurrentA, iz, true),
        formula: `I_z = I_t × C_a × C_g = ${c.tabulatedAmpacityA} × ${c.ambientFactor} × ${c.groupingFactor}`, reference: 'IEC 60364-5-52 (tabulated value and correction factors for the installation method)' },
      { id: `vdrop-${c.name}`, title: `${c.name}: voltage drop`, verdict: pct <= c.maxDropPct ? 'PASS' : 'WARN', value: r2(pct), limit: c.maxDropPct, unit: '%', marginPct: margin(pct, c.maxDropPct, true),
        formula: `ΔV = 2 × L × I × ρ ÷ A = 2 × ${c.lengthM} × ${c.designCurrentA} × 0.0225 ÷ ${c.csaMm2} = ${r2(vd)} V`, reference: 'IEC 60364-5-52 Annex G (ρ for copper in service = 0.0225 Ω·mm²/m)' },
    ],
  };
}

/**
 * Review G3: a PV cable's design current is tied to the strings it carries.
 * IEC 62548-1 sizes PV string/array cable for 1.25 × Isc per string, so the
 * entered design current must be at least strings × Isc × 1.25 of the MPPT it
 * serves (the most heavily loaded MPPT when not stated). Below that the
 * cable is REFUSED: the ampacity check would otherwise use a figure the
 * array can exceed. AC and battery cables are not tied to the strings.
 */
export function cableStringCurrentCheck(c: CableRun, module: Module, design: ArrayDesign): Check | null {
  if (c.kind === 'ac' || c.kind === 'dc-battery') return null;
  const per = design.stringsPerMppt;
  if (!per.length || !(module.iscA > 0)) return null;
  const mpptStated = c.mppt !== undefined;
  const strings = mpptStated ? per[(c.mppt as number) - 1] : Math.max(...per);
  if (!(Number.isInteger(strings) && strings >= 1)) {
    return { id: `cable-current-${c.name}`, title: `${c.name}: MPPT served`, verdict: 'REFUSE', value: NaN, limit: per.length, unit: '', marginPct: -100, formula: 'mppt must name an MPPT of the design', reference: 'Design input', note: `MPPT ${c.mppt} is not in the design (1–${per.length})` };
  }
  const required = strings * module.iscA * 1.25;
  const ok = c.designCurrentA >= required * (1 - 1e-9);
  return {
    id: `cable-current-${c.name}`, title: `${c.name}: design current covers the strings it carries`, verdict: ok ? 'PASS' : 'REFUSE', value: r2(c.designCurrentA), limit: r2(required), unit: 'A', marginPct: margin(c.designCurrentA, required, false),
    formula: `strings × Isc × 1.25 = ${strings} × ${module.iscA} × 1.25 = ${r2(required)} A (${mpptStated ? `MPPT ${c.mppt}` : 'largest MPPT; state the MPPT or kind to narrow it'})`,
    reference: 'IEC 62548-1 (PV cable current 1.25 × Isc per string)',
    ...(ok ? {} : { note: 'The entered design current is below what the strings can deliver: size the cable for the string current' }),
  };
}

/** Battery sizing and C-rate. usableAcKwh is the energy the loads need from the battery per cycle. */
export function checkBattery(battery: Battery, inverter: Inverter, usableAcKwh: number, units: number): { checks: Check[]; errors: string[]; requiredNominalKwh: number } {
  const errors: string[] = [];
  if (!(usableAcKwh > 0)) errors.push('Energy needed from the battery must be positive');
  if (!(battery.usableDoD > 0 && battery.usableDoD <= 1)) errors.push('Usable depth of discharge must be between 0 and 1 (datasheet)');
  if (!(battery.dischargeEfficiency > 0 && battery.dischargeEfficiency <= 1)) errors.push('Discharge efficiency must be between 0 and 1');
  if (!(battery.nominalKwh > 0) || !Number.isInteger(units) || units < 1) errors.push('Battery capacity and number of units must be positive');
  if (!(battery.maxDischargeC > 0 && battery.maxChargeC > 0)) errors.push('C-rates from the battery datasheet are required');
  if (!battery.datasheet) errors.push('Battery datasheet reference is required');
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
  const minPct = gen.oemMinLoadPct ?? 30;
  const minKw = (gen.ratedKw * minPct) / 100;
  const compat = (inverter.generatorCompatibility ?? '').trim();
  const checks: Check[] = [
    // Review G2: a statement of only spaces counted; it is trimmed first. The
    // text itself ("supported" vs "NOT supported") is the engineer's, checked
    // by the second-person datasheet verification, not by code.
    { id: 'gen-compat', title: 'Inverter listed as generator-compatible', verdict: compat ? 'PASS' : 'REFUSE', value: compat ? 1 : 0, limit: 1, unit: '', marginPct: compat ? 0 : -100,
      formula: 'manufacturer statement required', reference: 'Inverter manufacturer documentation', note: compat ? `${compat} (the statement's wording is confirmed by the second-person datasheet check)` : 'No manufacturer statement: generator connection refused' },
    { id: 'gen-min-load', title: 'Generator minimum loading', verdict: minSiteLoadKw >= minKw ? 'PASS' : 'WARN', value: r2(minSiteLoadKw), limit: r2(minKw), unit: 'kW', marginPct: margin(minSiteLoadKw, minKw, false),
      formula: `minimum load ≥ ${minPct} % × ${gen.ratedKw} kW`, reference: gen.oemMinLoadPct !== undefined ? 'Generator OEM minimum load' : 'Common diesel practice (30 %) until the OEM figure is entered',
      note: minSiteLoadKw < minKw ? 'Light loading: wet stacking risk; schedule load banks or reduce PV while the generator runs' : undefined },
  ];
  if (pvCanBackfeed) {
    checks.push({ id: 'gen-reverse-power', title: 'Reverse power into the generator', verdict: 'REFUSE', value: 1, limit: 0, unit: '', marginPct: -100,
      formula: 'PV must not export into a running generator', reference: 'Generator protection practice (reverse-power relay); inverter generator mode',
      note: 'Add generator-mode export limiting or a reverse-power relay, confirmed by the inverter and controller manufacturers' });
  }
  return checks;
}
