/**
 * Solar proposal form helpers (P1, 2026-11-20): pure functions used by the
 * Proposal page (components/solar-modules/crc/src/pages/ProposalPage.tsx).
 *
 * They only map what the designer typed into the inputs of the existing
 * engines (datasheet.ts, hourly.ts, hybrid.ts, proposal.ts). Nothing is
 * defaulted: a blank field stays blank and is reported as missing. The only
 * stated choice is the PVWatts v5 default losses for the hourly simulation,
 * labelled as such.
 */
import { importModule, importInverter, importBattery, verify, type LibraryEntry } from './datasheet';
import { CABLE_CONDUCTORS, RCD_TYPES, type Module, type Inverter, type Battery, type CableRun, type AcProtection } from './validate';
import type { HourlyInput, HourlyResult } from './hourly';
import type { HybridInput, HybridResult } from './hybrid';
import type { ProposalInput, PricedLine, Sourced, SiteDetails, LoadDetails, SiteFieldProvenance } from './proposal';
import { prefillEntry } from './siteHandoff';
import { PVWATTS_DEFAULT_LOSSES, type Losses } from './production';
import { parseHorizonText, type HorizonProfile } from './shading';
import { buildSld, type SldConnections, type SldModel } from './sld';

export type ProposalForm = Record<string, string>;
export interface BomRow { item: string; model: string; quantity: string; unit: string; rate: string; rateSource: string; rateDate: string }
export const EMPTY_BOM_ROW: BomRow = { item: '', model: '', quantity: '', unit: '', rate: '', rateSource: '', rateDate: '' };
export const LOSSES_SOURCE = 'PVWatts v5 defaults';
/** With a horizon profile the PVWatts 3 % shading allowance is replaced by the computed horizon loss (no double counting). */
export const LOSSES_SOURCE_WITH_HORIZON = 'PVWatts v5 defaults, with the 3 % shading allowance replaced by the horizon calculation (shading 0 %)';
export const LOSSES_WITH_HORIZON: Losses = { ...PVWATTS_DEFAULT_LOSSES, shading: 0 };

const str = (f: ProposalForm, k: string) => (f[k] ?? '').trim();
const blank = (f: ProposalForm, k: string) => str(f, k) === '';
/** Number or NaN; blank is NaN (never 0). */
export const num = (f: ProposalForm, k: string) => (blank(f, k) ? NaN : Number(str(f, k)));
const anyFilled = (f: ProposalForm, prefix: string) => Object.keys(f).some((k) => k.startsWith(prefix) && !blank(f, k) && f[k] !== 'no');

/** The last complete calendar year (UTC), for the hourly weather request. */
export function lastFullYear(now: Date = new Date()): number { return now.getUTCFullYear() - 1; }

/**
 * Hourly load CSV: one kWh value per hour, one per line. A first line that is
 * not a number is taken as a header. When a line has several columns
 * (e.g. "timestamp,kWh"), the last column is the value. No gaps are filled.
 */
export function parseLoadCsv(text: string, expectedHours?: number): { values: number[]; error: null } | { values: null; error: string } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== '');
  if (!lines.length) return { values: null, error: 'The load file is empty' };
  const cell = (l: string) => { const parts = l.split(/[,;\t]/); return parts[parts.length - 1].trim(); };
  const body = Number.isFinite(Number(cell(lines[0]))) && cell(lines[0]) !== '' ? lines : lines.slice(1);
  const values: number[] = [];
  for (let i = 0; i < body.length; i++) {
    const c = cell(body[i]);
    const v = c === '' ? NaN : Number(c);
    if (!Number.isFinite(v) || v < 0) return { values: null, error: `Row ${i + 1} of the load data is not a kWh value ≥ 0 ("${c}"); gaps are not filled` };
    values.push(v);
  }
  if (expectedHours !== undefined && values.length !== expectedHours) return { values: null, error: `The load has ${values.length} hourly values; the weather year has ${expectedHours}. They must match hour for hour.` };
  return { values, error: null };
}

const PROV = ['manufacturer', 'datasheetUrl', 'datasheetRevision', 'datasheetDate', 'enteredBy', 'enteredOn'];
const MODULE_KEYS = ['model', 'pmaxW', 'vocV', 'iscA', 'vmpV', 'impA', 'betaVocPct', 'betaVmpPct', 'alphaIscPct', 'gammaPmaxPct', 'noctC', 'maxSystemV', 'maxSeriesFuseA', 'lengthMm', 'widthMm'];
const INVERTER_KEYS = ['model', 'acKw', 'maxDcV', 'mpptMinV', 'mpptMaxV', 'mpptCount', 'maxInputA', 'maxIscA', 'batteryMaxDischargeKw', 'batteryMaxChargeKw', 'generatorCompatibility', 'batteryMinV', 'batteryMaxV', 'batteryMaxChargeA', 'batteryMaxDischargeA', 'antiIslanding', 'maxAcOutputA', 'rcdTypeRequired'];
const BATTERY_KEYS = ['model', 'nominalKwh', 'usableDoD', 'dischargeEfficiency', 'maxDischargeC', 'maxChargeC', 'chemistry', 'nominalV', 'chargeV', 'cutoffV', 'cycleLife', 'cycleLifeDoD', 'minTempC', 'maxTempC', 'warrantyYears'];

function record(f: ProposalForm, prefix: string, keys: string[]): Record<string, string> {
  return Object.fromEntries([...PROV, ...keys].map((k) => [k, str(f, `${prefix}.${k}`)]));
}
/** Second-person sign-off from the form, through datasheet.verify (which refuses the same person). */
function signOff<T>(f: ProposalForm, prefix: string, label: string, e: LibraryEntry<T>, errors: string[]): LibraryEntry<T> {
  if (f[`${prefix}.verified`] !== 'yes') return e;
  try { return verify(e, str(f, `${prefix}.verifiedBy`), str(f, `${prefix}.verifiedOn`)); }
  catch (err) { errors.push(`${label} verification: ${(err as Error).message}`); return e; }
}

export function hasBattery(f: ProposalForm): boolean { return anyFilled(f, 'b.'); }

/** Datasheet entries through the library importer (units and consistency checks) and the optional sign-off. */
export function buildEntries(f: ProposalForm): { module: LibraryEntry<Module> | null; inverter: LibraryEntry<Inverter> | null; battery: LibraryEntry<Battery> | null; errors: string[]; warnings: string[] } {
  const errors: string[] = [], warnings: string[] = [];
  const m = importModule(record(f, 'm', MODULE_KEYS));
  m.errors.forEach((e) => errors.push(`Module: ${e}`));
  const inv = importInverter(record(f, 'i', INVERTER_KEYS));
  inv.errors.forEach((e) => errors.push(`Inverter: ${e}`));
  let battery: LibraryEntry<Battery> | null = null;
  if (hasBattery(f)) {
    const b = importBattery(record(f, 'b', BATTERY_KEYS));
    b.errors.forEach((e) => errors.push(`Battery: ${e}`));
    if (b.entry) { battery = signOff(f, 'b', 'Battery', b.entry, errors); b.entry.warnings.forEach((w) => warnings.push(`Battery: ${w}`)); }
  }
  const moduleEntry = m.entry ? signOff(f, 'm', 'Module', m.entry, errors) : null;
  const inverter = inv.entry ? signOff(f, 'i', 'Inverter', inv.entry, errors) : null;
  m.entry?.warnings.forEach((w) => warnings.push(`Module: ${w}`));
  inv.entry?.warnings.forEach((w) => warnings.push(`Inverter: ${w}`));
  return { module: moduleEntry, inverter, battery, errors, warnings };
}

/** Review of 39fa8535, M2: the form only checked that the inverter count was not blank; −1, 0 and 1.5 went through. */
export function inverterCountError(f: ProposalForm, errors: string[]): void {
  if (blank(f, 'd.inverterCount')) return;
  const n = num(f, 'd.inverterCount');
  if (!(Number.isInteger(n) && n >= 1)) errors.push('Inverter count must be a whole number of inverters, 1 or more');
}

export function parseStrings(s: string): number[] { return s.split(',').map((x) => x.trim()).filter((x) => x !== '').map(Number); }

/** DC kWp from the form's array design and module Pmax (NaN when incomplete). */
export function dcKwp(f: ProposalForm): number {
  const strings = parseStrings(str(f, 'd.stringsPerMppt')).reduce((a, b) => a + b, 0) * num(f, 'd.inverterCount');
  return Math.round(strings * num(f, 'd.modulesPerString') * num(f, 'm.pmaxW')) / 1000;
}

export interface WeatherOk { status: 'OK'; start: string; ghiWm2: number[]; tempC: number[]; hours: number; source: string; notes?: string[] }

/** Input for simulateHourly from the form and a fetched weather year; losses are PVWatts v5 defaults, labelled. */
export function buildHourlyInput(f: ProposalForm, w: WeatherOk): { input: HourlyInput | null; errors: string[] } {
  const errors: string[] = [];
  const need: Array<[string, string]> = [['c.lat', 'Latitude'], ['c.lon', 'Longitude'], ['d.tilt', 'Tilt'], ['d.azimuth', 'Azimuth'], ['m.pmaxW', 'Module Pmax'], ['m.gammaPmaxPct', 'Module γ Pmax'], ['m.noctC', 'Module NOCT'], ['i.acKw', 'Inverter AC power'], ['i.nominalEfficiency', 'Inverter nominal efficiency'], ['d.modulesPerString', 'Modules per string'], ['d.stringsPerMppt', 'Strings per MPPT'], ['d.inverterCount', 'Inverter count']];
  for (const [k, l] of need) if (!Number.isFinite(k === 'd.stringsPerMppt' ? dcKwp(f) : num(f, k))) errors.push(`${l} is required for the simulation`);
  const dc = dcKwp(f);
  if (!errors.length && !(dc > 0)) errors.push('The array has no DC capacity (check the array design)');
  const hz = horizonFromForm(f);
  errors.push(...hz.errors);
  if (errors.length) return { input: null, errors };
  return {
    input: {
      site: { latDeg: num(f, 'c.lat'), lonDeg: num(f, 'c.lon'), tiltDeg: num(f, 'd.tilt'), azimuthDeg: num(f, 'd.azimuth'), ...(blank(f, 'd.albedo') ? {} : { albedo: num(f, 'd.albedo') }) },
      start: w.start, ghiWm2: w.ghiWm2, tempC: w.tempC, weatherSource: w.source,
      array: { dcKw: dc, gammaPmaxPct: num(f, 'm.gammaPmaxPct'), noctC: num(f, 'm.noctC') },
      inverter: { acKw: num(f, 'i.acKw') * num(f, 'd.inverterCount'), nominalEfficiency: num(f, 'i.nominalEfficiency') },
      ...(hz.profile ? { losses: LOSSES_WITH_HORIZON, lossesSource: LOSSES_SOURCE_WITH_HORIZON, horizon: hz.profile } : { losses: PVWATTS_DEFAULT_LOSSES, lossesSource: LOSSES_SOURCE }),
    },
    errors,
  };
}

/** The horizon profile from the form (sh.sectors, sh.obstacles, sh.source); null when all three are blank. */
export function horizonFromForm(f: ProposalForm): { profile: HorizonProfile | null; errors: string[] } {
  return parseHorizonText(f['sh.sectors'] ?? '', f['sh.obstacles'] ?? '', f['sh.source'] ?? '');
}

/**
 * Quoted component replacements typed as "item; year; cost KES; source; date",
 * several separated by "|" (REQ-06). Each part is required; a bad entry is
 * reported, never guessed.
 */
export function parseReplacements(text: string, errors: string[]): Array<{ item: string; year: number; costKes: number; source: string; date: string }> {
  const out: Array<{ item: string; year: number; costKes: number; source: string; date: string }> = [];
  if (!text.trim()) return out;
  text.split('|').map((x) => x.trim()).filter(Boolean).forEach((entry, n) => {
    const parts = entry.split(';').map((x) => x.trim());
    const [item, year, cost, source, date] = parts;
    const y = Number(year), c = Number(String(cost ?? '').replace(/,/g, ''));
    if (parts.length !== 5 || !item || !source || !date) { errors.push(`Replacement ${n + 1}: give item; year; cost KES; source; date`); return; }
    if (!Number.isInteger(y) || y < 1) { errors.push(`Replacement ${n + 1} (${item}): year must be a whole number ≥ 1`); return; }
    if (!Number.isFinite(c) || c < 0) { errors.push(`Replacement ${n + 1} (${item}): cost must be a number of KES`); return; }
    if (Number.isNaN(Date.parse(date))) { errors.push(`Replacement ${n + 1} (${item}): the quote date must be a date (YYYY-MM-DD)`); return; }
    out.push({ item, year: y, costKes: c, source, date });
  });
  return out;
}

/** REQ-03 load facts from the form; undefined when none is entered. */
export function loadFromForm(f: ProposalForm, errors: string[]): LoadDetails | undefined {
  const keys = ['l.monthlyKwh', 'l.peakKw', 'l.motorStartingKva', 'l.criticalLoadKw', 'l.outageHoursPerDay', 'l.diesel'];
  if (keys.every((k) => !str(f, k))) return undefined;
  const out: LoadDetails = { source: str(f, 'l.source') };
  if (!out.source) errors.push('Load details need their source (bills, logger, survey)');
  const m = str(f, 'l.monthlyKwh');
  if (m) {
    const v = m.split(/[,;\s]+/).filter(Boolean).map(Number);
    if (v.length === 12 && v.every((x) => Number.isFinite(x) && x >= 0)) out.monthlyKwh = v; else errors.push('Monthly kWh: give 12 numbers, January to December, from the bills');
  }
  for (const [k, field, label] of [['l.peakKw', 'peakKw', 'Peak load'], ['l.motorStartingKva', 'motorStartingKva', 'Motor starting kVA'], ['l.criticalLoadKw', 'criticalLoadKw', 'Critical load'], ['l.outageHoursPerDay', 'outageHoursPerDay', 'Outage hours per day']] as const) {
    if (!str(f, k)) continue;
    const v = num(f, k);
    if (Number.isFinite(v) && v >= 0) out[field] = v; else errors.push(`${label} must be a number ≥ 0`);
  }
  if (str(f, 'l.diesel')) {
    const v = num(f, 'l.diesel');
    if (Number.isFinite(v) && v > 0 && str(f, 'l.dieselSource')) out.dieselKesPerLitre = { value: v, source: str(f, 'l.dieselSource') };
    else errors.push('Diesel price needs a number of KES/L and its source (the customer\'s receipt or pump price)');
  }
  return out;
}

/** REQ-01 site details from the form; undefined when none is entered. Bad entries are reported. */
export function siteFromForm(f: ProposalForm, errors: string[]): SiteDetails | undefined {
  const el = str(f, 's.elevationM'), mount = str(f, 's.mounting').toLowerCase(), area = str(f, 's.usableAreaM2');
  if (!el && !mount && !area) return undefined;
  const out: SiteDetails = { source: str(f, 's.source') };
  const provenance: NonNullable<SiteDetails['provenance']> = {};
  // Review M2 and management (2026-11-27): each value keeps its own provenance:
  // (a) automatically obtained (the Dashboard elevation lookup, unedited), (b)
  // customer-entered, (c) independently verified (only with a stated survey or
  // engineer source and the "independent" box ticked). A source on one field
  // never covers another.
  const own = (source: string, verifiedKey: string): SiteFieldProvenance => ({ category: f[verifiedKey] === 'yes' ? 'verified' : 'customer', source });
  if (el) {
    const v = Number(el);
    if (Number.isFinite(v)) {
      out.elevationM = v;
      const pre = prefillEntry(f, 's.elevationM');
      if (pre && pre.category === 'automatic' && pre.retrievedOn) provenance.elevationM = { category: 'automatic', source: pre.source, retrievedOn: pre.retrievedOn };
      else if (str(f, 's.elevationSource')) provenance.elevationM = own(str(f, 's.elevationSource'), 's.elevationVerified');
      else errors.push('Site elevation needs its own source (survey, drawing, map), or use the elevation looked up on the Dashboard');
    } else errors.push('Site elevation must be a number of metres');
  }
  if (mount) { if (mount === 'roof' || mount === 'ground') out.mounting = mount; else errors.push('Mounting must be "roof" or "ground"'); }
  if (area) { const v = Number(area); if (Number.isFinite(v) && v > 0) out.usableAreaM2 = v; else errors.push('Usable area must be a positive number of m²'); }
  const shared = [area ? 'Usable area' : null, mount ? 'mounting' : null].filter(Boolean) as string[];
  if (shared.length) {
    if (!out.source) errors.push(`${shared.join(' and ')} need${shared.length > 1 ? '' : 's'} their source (survey, drawing, the customer): a source given for another field does not cover ${shared.length > 1 ? 'them' : 'it'}`);
    else {
      if (out.mounting) provenance.mounting = own(out.source, 's.verified');
      if (out.usableAreaM2 !== undefined) provenance.usableAreaM2 = own(out.source, 's.verified');
    }
  }
  if (Object.keys(provenance).length) out.provenance = provenance;
  return out;
}

/** Grid / generator connection for the single-line diagram: yes/no answers; unanswered = null (not stated). */
export function connectionsFromForm(f: ProposalForm): SldConnections | undefined {
  const tri = (k: string) => (str(f, k) === 'yes' ? true : str(f, k) === 'no' ? false : null);
  const grid = tri('sld.grid'), generator = tri('sld.generator');
  const rated = num(f, 'hgen.ratedKw');
  if (grid === null && generator === null) return undefined;
  const minLoad = num(f, 'sld.genMinSiteLoadKw'), oemMin = num(f, 'sld.genOemMinLoadPct');
  return {
    grid, generator,
    ...(generator === true && Number.isFinite(rated) && rated > 0 ? { generatorRatedKw: rated } : {}),
    // Generator checks (CA-32): only with a generator; unanswered back-feed stays null (refused).
    ...(generator === true ? {
      pvCanBackfeedGenerator: tri('sld.pvBackfeed'),
      ...(Number.isFinite(minLoad) && minLoad >= 0 ? { generatorMinSiteLoadKw: minLoad } : {}),
      ...(Number.isFinite(oemMin) && oemMin >= 0 ? { generatorOemMinLoadPct: oemMin } : {}),
    } : {}),
  };
}

/**
 * Single-line diagram preview from the form, as soon as the module, inverter,
 * array design and site temperatures are complete (finance is not needed).
 * Uses the same buildSld as the proposal, so the preview and the built
 * proposal show the same diagram for the same inputs.
 */
export function sldPreviewFromForm(f: ProposalForm): { model: SldModel | null; errors: string[] } {
  const errors: string[] = [];
  for (const [k, l] of [['d.modulesPerString', 'Modules per string'], ['d.stringsPerMppt', 'Strings per MPPT'], ['d.inverterCount', 'Inverter count'], ['t.recordLowC', 'Site record low temperature'], ['t.maxAmbientC', 'Max ambient temperature']] as const) if (blank(f, k)) errors.push(`${l} is required`);
  inverterCountError(f, errors);
  const { module, inverter, battery, errors: eErr } = buildEntries(f);
  errors.push(...eErr);
  if (errors.length || !module || !inverter) return { model: null, errors };
  // Only runs without errors are drawn in the preview; the proposal form lists what is missing.
  const cables = cablesFromForm(f, []).filter((c) => { const e: string[] = []; cablesFromForm(onlyRun(f, c.name), e); return !e.length; });
  const acErrors: string[] = [];
  const acProtection = acProtectionFromForm(f, cables, acErrors);
  const conn = connectionsFromForm(f);
  const units = num(f, 'b.units'), need = num(f, 'b.requiredUsableAcKwh');
  // Re-review S4: a battery with blank units vanished from the preview, which then showed valid.
  if (battery && !Number.isFinite(units)) return { model: null, errors: [...errors, 'Battery units is required'] };
  return {
    model: buildSld({
      reference: str(f, 'ref') || '(no reference yet)', module: module.data, inverter: inverter.data,
      design: { modulesPerString: num(f, 'd.modulesPerString'), stringsPerMppt: parseStrings(str(f, 'd.stringsPerMppt')) },
      inverterCount: num(f, 'd.inverterCount'), temps: { recordLowC: num(f, 't.recordLowC'), maxAmbientC: num(f, 't.maxAmbientC') },
      ...(battery && Number.isFinite(units) ? { battery: { data: battery.data, units, ...(Number.isFinite(need) ? { requiredUsableAcKwh: need } : {}) } } : {}),
      cables, ...(acProtection && !acErrors.length ? { acProtection } : {}), ...(conn ? { connections: conn } : {}),
    }),
    errors,
  };
}

export function hybridRequested(f: ProposalForm): boolean { return anyFilled(f, 'h'); }

/** Input for simulateHybrid; each optional block (battery, grid, generator) is used only when filled, and must then be complete. */
export function buildHybridInput(f: ProposalForm, pvAcKwh: number[], loadKwh: number[] | null): { input: HybridInput | null; errors: string[] } {
  const errors: string[] = [];
  if (!pvAcKwh.length) errors.push('Hybrid needs the simulated hourly production: fetch the hourly weather first');
  if (!loadKwh) errors.push('Upload the hourly load file');
  if (blank(f, 'h.loadSource')) errors.push('Load source is required (meter data, logger or surveyed appliance schedule)');
  const block = (prefix: string, label: string, keys: string[], optional: string[] = []) => {
    if (!anyFilled(f, prefix)) return false;
    for (const k of keys) if (!optional.includes(k) && blank(f, `${prefix}${k}`)) errors.push(`${label}: ${k} is required`);
    return true;
  };
  const useB = block('hb.', 'Hybrid battery', ['usableKwh', 'maxChargeKw', 'maxDischargeKw', 'roundTripEfficiency', 'minSocFrac', 'initialSocFrac', 'source']);
  const useG = block('hg.', 'Grid', ['exportAllowed', 'importLimitKw', 'exportLimitKw', 'source'], ['importLimitKw', 'exportLimitKw']);
  const useGen = block('hgen.', 'Generator', ['ratedKw', 'minLoadFrac', 'fuelA', 'fuelB', 'fuelCurveSource']);
  if (useG && !['yes', 'no'].includes(str(f, 'hg.exportAllowed'))) errors.push('Grid: say whether export is allowed (yes/no)');
  if (errors.length) return { input: null, errors };
  const opt = (k: string) => (blank(f, k) ? undefined : num(f, k));
  return {
    input: {
      pvAcKwh, loadKwh: loadKwh as number[], loadSource: str(f, 'h.loadSource'),
      ...(useB ? { battery: { usableKwh: num(f, 'hb.usableKwh'), maxChargeKw: num(f, 'hb.maxChargeKw'), maxDischargeKw: num(f, 'hb.maxDischargeKw'), roundTripEfficiency: num(f, 'hb.roundTripEfficiency'), minSocFrac: num(f, 'hb.minSocFrac'), initialSocFrac: num(f, 'hb.initialSocFrac'), source: str(f, 'hb.source') } } : {}),
      ...(useG ? { grid: { exportAllowed: str(f, 'hg.exportAllowed') === 'yes', importLimitKw: opt('hg.importLimitKw'), exportLimitKw: opt('hg.exportLimitKw'), source: str(f, 'hg.source') } } : {}),
      ...(useGen ? { generator: { ratedKw: num(f, 'hgen.ratedKw'), minLoadFrac: num(f, 'hgen.minLoadFrac'), fuelA_LperHperKwRated: num(f, 'hgen.fuelA'), fuelB_LperKwh: num(f, 'hgen.fuelB'), fuelCurveSource: str(f, 'hgen.fuelCurveSource') } } : {}),
    },
    errors,
  };
}

/** Review G3: what the cable carries and which MPPT; blank = treated as a PV cable on the largest MPPT. */
export function cableKindFromForm(f: ProposalForm, prefix = 'k.'): Pick<CableRun, 'kind' | 'mppt' | 'stringFuseA'> {
  const k = str(f, `${prefix}kind`).toLowerCase();
  const kind = k === 'ac' || k === 'dc-battery' || k === 'dc-pv' || k === 'dc-string' ? k : undefined;
  const m = num(f, `${prefix}mppt`);
  const fuse = num(f, `${prefix}stringFuseA`);
  return { ...(kind ? { kind } : {}), ...(Number.isInteger(m) && m >= 1 ? { mppt: m } : {}), ...(kind === 'dc-string' && Number.isFinite(fuse) ? { stringFuseA: fuse } : {}) };
}
const CABLE_KEYS = ['name', 'lengthM', 'csaMm2', 'designCurrentA', 'systemV', 'tabulatedAmpacityA', 'ambientFactor', 'groupingFactor', 'maxDropPct'];
/** REQ-05: every run in the form also states its route, installation method and conductor. */
export const CABLE_RUN_REQUIRED = [...CABLE_KEYS, 'from', 'to', 'method', 'conductor'];
/** Every field of one run (form key suffixes). */
export const CABLE_RUN_FIELDS = ['name', 'from', 'to', 'kind', 'mppt', 'stringFuseA', 'invertersCarried', 'lengthM', 'method', 'conductor', 'csaMm2', 'designCurrentA', 'systemV', 'tabulatedAmpacityA', 'ambientFactor', 'groupingFactor', 'maxDropPct'];
/** REQ-05: up to MAX_CABLE_RUNS runs; 'k.' is run 1 (kept so saved drafts still open), then 'k2.', 'k3.', … */
export const MAX_CABLE_RUNS = 8;
export const cableRunPrefix = (n: number) => (n === 1 ? 'k.' : `k${n}.`);
const CABLE_RUN_PREFIXES = Array.from({ length: MAX_CABLE_RUNS }, (_, k) => cableRunPrefix(k + 1));
const runFilled = (f: ProposalForm, prefix: string) => CABLE_RUN_FIELDS.some((k) => !blank(f, `${prefix}${k}`));
/** How many cable runs the form shows: up to the last run with anything in it (at least 1). */
export function cableRunCount(f: ProposalForm): number {
  let n = 1;
  CABLE_RUN_PREFIXES.forEach((p, k) => { if (runFilled(f, p)) n = k + 1; });
  return n;
}
/** The form with only the run of this name (as run 1), to check one run on its own. */
function onlyRun(f: ProposalForm, name: string): ProposalForm {
  const p = CABLE_RUN_PREFIXES.find((x) => str(f, `${x}name`) === name);
  const out: ProposalForm = {};
  if (p) for (const k of CABLE_RUN_FIELDS) if (f[`${p}${k}`] !== undefined) out[`k.${k}`] = f[`${p}${k}`];
  return out;
}
/** Remove run n (1-based) and move the later runs up, so the numbering stays continuous. */
export function removeCableRun(f: ProposalForm, n: number): ProposalForm {
  const out: ProposalForm = { ...f };
  for (let k = n; k <= MAX_CABLE_RUNS; k++) {
    for (const fld of CABLE_RUN_FIELDS) {
      const next = k < MAX_CABLE_RUNS ? f[`${cableRunPrefix(k + 1)}${fld}`] : undefined;
      if (next === undefined || next === '') delete out[`${cableRunPrefix(k)}${fld}`]; else out[`${cableRunPrefix(k)}${fld}`] = next;
    }
  }
  return out;
}

/**
 * REQ-05: all the cable runs in the form. A run with anything in it must be
 * complete (route, installation method, conductor and the IEC 60364-5-52
 * values); a missing or bad field is reported, never guessed. Names must be
 * unique, since each check is named after its run.
 */
export function cablesFromForm(f: ProposalForm, errors: string[]): CableRun[] {
  const out: CableRun[] = [];
  CABLE_RUN_PREFIXES.forEach((p, k) => {
    if (!runFilled(f, p)) return;
    const label = str(f, `${p}name`) || String(k + 1);
    for (const key of CABLE_RUN_REQUIRED) if (blank(f, `${p}${key}`)) errors.push(`Cable run ${label}: ${key} is required (or clear the run)`);
    for (const key of ['lengthM', 'csaMm2', 'designCurrentA', 'systemV', 'tabulatedAmpacityA', 'maxDropPct']) if (!blank(f, `${p}${key}`) && !(num(f, `${p}${key}`) > 0)) errors.push(`Cable run ${label}: ${key} must be a positive number`);
    for (const key of ['ambientFactor', 'groupingFactor']) if (!blank(f, `${p}${key}`) && !(num(f, `${p}${key}`) > 0)) errors.push(`Cable run ${label}: ${key} must be a positive number from the IEC 60364-5-52 tables`);
    const cond = str(f, `${p}conductor`).toLowerCase();
    if (cond && !(CABLE_CONDUCTORS as readonly string[]).includes(cond)) errors.push(`Cable run ${label}: conductor must be copper or aluminium`);
    const kindTxt = str(f, `${p}kind`).toLowerCase();
    if (kindTxt && !['dc-pv', 'dc-string', 'dc-battery', 'ac'].includes(kindTxt)) errors.push(`Cable run ${label}: kind must be dc-pv, dc-string, dc-battery or ac`);
    if (!blank(f, `${p}mppt`) && !(Number.isInteger(num(f, `${p}mppt`)) && num(f, `${p}mppt`) >= 1)) errors.push(`Cable run ${label}: MPPT must be a whole number, 1 or more`);
    if (!blank(f, `${p}stringFuseA`) && !(num(f, `${p}stringFuseA`) > 0)) errors.push(`Cable run ${label}: string fuse rating must be a positive number of A`);
    if (str(f, `${p}name`) && out.some((c) => c.name === str(f, `${p}name`))) errors.push(`Cable run ${label}: another run has the same name (names must be unique)`);
    // Review M1: inverters carried, a whole number from 1 to the inverter count.
    const nInv = num(f, 'd.inverterCount'), carried = num(f, `${p}invertersCarried`);
    if (!blank(f, `${p}invertersCarried`) && !(Number.isInteger(carried) && carried >= 1 && (!Number.isFinite(nInv) || carried <= nInv))) errors.push(`Cable run ${label}: inverters carried must be a whole number from 1 to the inverter count${Number.isFinite(nInv) ? ` (${nInv})` : ''}`);
    out.push({
      name: str(f, `${p}name`), from: str(f, `${p}from`), to: str(f, `${p}to`), method: str(f, `${p}method`),
      ...((CABLE_CONDUCTORS as readonly string[]).includes(cond) ? { conductor: cond as CableRun['conductor'] } : {}),
      lengthM: num(f, `${p}lengthM`), csaMm2: num(f, `${p}csaMm2`), designCurrentA: num(f, `${p}designCurrentA`), systemV: num(f, `${p}systemV`), tabulatedAmpacityA: num(f, `${p}tabulatedAmpacityA`), ambientFactor: num(f, `${p}ambientFactor`), groupingFactor: num(f, `${p}groupingFactor`), maxDropPct: num(f, `${p}maxDropPct`),
      ...cableKindFromForm(f, p),
      ...(blank(f, `${p}invertersCarried`) ? {} : { invertersCarried: carried }),
    });
  });
  return out;
}

/** REQ-05 AC protection from the form (ap.*); undefined when nothing is entered. Bad entries are reported, never guessed. */
export function acProtectionFromForm(f: ProposalForm, cables: CableRun[], errors: string[]): AcProtection | undefined {
  const keys = ['ap.breakerA', 'ap.device', 'ap.deviceType', 'ap.cable', 'ap.rcdType'];
  if (keys.every((k) => blank(f, k))) return undefined;
  const out: AcProtection = {};
  if (!blank(f, 'ap.breakerA')) { const v = num(f, 'ap.breakerA'); if (Number.isFinite(v) && v > 0) out.breakerA = v; else errors.push('AC breaker rating must be a positive number of A'); }
  if (!blank(f, 'ap.device')) out.device = str(f, 'ap.device');
  if (!blank(f, 'ap.deviceType')) { const t = str(f, 'ap.deviceType'); if (t === 'circuit-breaker' || t === 'fuse') out.deviceType = t; else errors.push('AC protective device type must be circuit-breaker or fuse'); }
  if (!blank(f, 'ap.cable')) {
    const name = str(f, 'ap.cable'), run = cables.find((c) => c.name === name);
    if (!run) errors.push(`AC breaker: "${name}" is not one of the cable runs`);
    else if (run.kind !== 'ac') errors.push(`AC breaker: cable run "${name}" is not an AC cable (set its kind to ac)`);
    out.cable = name;
  }
  if (!blank(f, 'ap.rcdType')) {
    const t = str(f, 'ap.rcdType');
    if (t === 'none' || (RCD_TYPES as readonly string[]).includes(t)) out.rcdType = t as AcProtection['rcdType']; else errors.push('RCD fitted must be none, AC, A, F or B');
  }
  return out;
}

/** Bill of materials rows: an empty rate means "rate required" (null); a given rate needs its source and date. */
export function buildBom(rows: BomRow[], errors: string[]): PricedLine[] {
  const out: PricedLine[] = [];
  rows.forEach((r, i) => {
    const t = (s: string) => (s ?? '').trim();
    if (!t(r.item) && !t(r.model) && !t(r.quantity) && !t(r.rate)) return; // empty row
    const label = t(r.item) || `Row ${i + 1}`;
    const q = t(r.quantity) === '' ? NaN : Number(t(r.quantity));
    if (!t(r.item)) errors.push(`Bill of materials row ${i + 1}: item is required`);
    if (!(Number.isFinite(q) && q > 0)) errors.push(`${label}: quantity must be a positive number`);
    if (!t(r.unit)) errors.push(`${label}: unit is required`);
    let rate: PricedLine['rate'] = null;
    if (t(r.rate) !== '') {
      const v = Number(t(r.rate));
      if (!(Number.isFinite(v) && v >= 0)) errors.push(`${label}: rate must be a number in KES (no commas)`);
      if (!t(r.rateSource)) errors.push(`${label}: a rate needs its source (quote, price list)`);
      if (Number.isNaN(Date.parse(t(r.rateDate)))) errors.push(`${label}: a rate needs its date (YYYY-MM-DD)`);
      rate = { valueKes: v, source: t(r.rateSource), date: t(r.rateDate) };
    }
    out.push({ item: t(r.item), model: t(r.model), quantity: q, unit: t(r.unit), rate });
  });
  return out;
}

/** Map the whole form to a ProposalInput. Engine rules (ranges, refusals) stay in buildProposal on the server. */
export function formToProposalInput(f: ProposalForm, bomRows: BomRow[], production: HourlyResult | null, hybrid: HybridResult | null): { input: ProposalInput | null; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  inverterCountError(f, errors);
  for (const [k, l] of [['ref', 'Proposal reference'], ['c.name', 'Client name'], ['c.address', 'Site address'], ['c.lat', 'Latitude'], ['c.lon', 'Longitude'], ['d.modulesPerString', 'Modules per string'], ['d.stringsPerMppt', 'Strings per MPPT'], ['d.inverterCount', 'Inverter count'], ['t.recordLowC', 'Site record low temperature'], ['t.maxAmbientC', 'Max ambient temperature'], ['t.source', 'Source of the site temperatures'], ['f.lifetime', 'Lifetime']] as const) {
    if (blank(f, k)) errors.push(`${l} is required`);
  }
  const { module: moduleEntry, inverter, battery, errors: eErr, warnings } = buildEntries(f);
  errors.push(...eErr);
  if (battery) for (const [k, l] of [['b.units', 'Battery units'], ['b.requiredUsableAcKwh', 'Energy needed from the battery per cycle']] as const) if (blank(f, k)) errors.push(`${l} is required`);
  if (!production) errors.push('Production is required: fetch the hourly weather and run the simulation');

  const sourced = (label: string, vk: string, sk: string, optional = false): Sourced | undefined => {
    if (blank(f, vk) && blank(f, sk) && optional) return undefined;
    if (blank(f, vk)) { errors.push(`${label} is required`); return undefined; }
    if (blank(f, sk)) { errors.push(`${label}: its source is required`); return undefined; }
    return { value: num(f, vk), source: str(f, sk) };
  };
  const tariff = sourced('Tariff (KES/kWh)', 'f.tariff', 'f.tariffSource');
  const exportTariff = sourced('Export tariff (KES/kWh)', 'f.exportTariff', 'f.exportTariffSource', true);
  const selfConsumed = hybrid ? undefined : sourced('Self-consumed fraction', 'f.selfConsumed', 'f.selfConsumedSource', true);
  const esc = sourced('Tariff escalation (%/yr)', 'f.escalation', 'f.escalationSource');
  const disc = sourced('Discount rate (%)', 'f.discount', 'f.discountSource');
  const deg = sourced('Degradation (%/yr)', 'f.degradation', 'f.degradationSource');
  const om = sourced('O&M (KES/yr)', 'f.om', 'f.omSource');
  const replacements = parseReplacements(str(f, 'f.replacements'), errors);
  const site = siteFromForm(f, errors);
  // Review Q4: units in series of 2.5 or 0 was silently replaced by 1.
  if (!blank(f, 'b.seriesPerString') && !(Number.isInteger(num(f, 'b.seriesPerString')) && num(f, 'b.seriesPerString') >= 1)) errors.push('Battery units in series per string must be a whole number, 1 or more (or blank for 1)');
  const load = loadFromForm(f, errors);

  const cables = cablesFromForm(f, errors);
  const acProtection = acProtectionFromForm(f, cables, errors);
  const bom = buildBom(bomRows, errors);

  // No approval is ever built from the form: a typed name cannot approve
  // (proposalApproval.ts). Any old 'a.*' fields are ignored.

  if (errors.length || !moduleEntry || !inverter || !production || !tariff || !esc || !disc || !deg || !om) return { input: null, errors, warnings };
  const input: ProposalInput = {
    reference: str(f, 'ref'),
    client: { name: str(f, 'c.name'), siteAddress: str(f, 'c.address'), lat: num(f, 'c.lat'), lon: num(f, 'c.lon') },
    ...(site ? { site } : {}),
    ...(load ? { load } : {}),
    module: moduleEntry, inverter,
    ...(battery ? { battery: { entry: battery, units: num(f, 'b.units'), requiredUsableAcKwh: num(f, 'b.requiredUsableAcKwh'), ...(Number.isInteger(num(f, 'b.seriesPerString')) && num(f, 'b.seriesPerString') >= 1 ? { seriesPerString: num(f, 'b.seriesPerString') } : {}) } } : {}),
    design: { modulesPerString: num(f, 'd.modulesPerString'), stringsPerMppt: parseStrings(str(f, 'd.stringsPerMppt')) },
    inverterCount: num(f, 'd.inverterCount'),
    temps: { recordLowC: num(f, 't.recordLowC'), maxAmbientC: num(f, 't.maxAmbientC'), source: str(f, 't.source') },
    cables,
    ...(acProtection ? { acProtection } : {}),
    ...(connectionsFromForm(f) ? { connections: connectionsFromForm(f) } : {}),
    // The hourly series is not used by the proposal engine; dropped to keep the request small.
    production: { ...production, hourlyAcKwh: [] },
    ...(hybrid ? { hybrid } : {}),
    bom,
    finance: {
      tariffKesPerKwh: tariff, ...(exportTariff ? { exportTariffKesPerKwh: exportTariff } : {}), ...(selfConsumed ? { selfConsumedFraction: selfConsumed } : {}),
      tariffEscalationPct: esc, discountRatePct: disc, degradationPctPerYear: deg, omKesPerYear: om, lifetimeYears: num(f, 'f.lifetime'),
      ...(replacements.length ? { replacements } : {}),
    },
  };
  return { input, errors, warnings };
}

// ------------------------------------------------------------------ worked example
/**
 * TEST values from tests/regression/solar-proposal.test.ts. They exercise the
 * workflow; they are not a product, a price, a tariff or an approval.
 */
export const WORKED_EXAMPLE_FORM: ProposalForm = {
  ref: 'TEST-001', 'c.name': 'Test client', 'c.address': 'Test site', 'c.lat': '-1.29', 'c.lon': '36.82',
  'm.manufacturer': 'TEST', 'm.datasheetUrl': 'https://example.com/test.pdf', 'm.datasheetRevision': 'A', 'm.datasheetDate': '2026-01-01', 'm.enteredBy': 'test', 'm.enteredOn': '2026-11-20',
  'm.model': 'test-module', 'm.pmaxW': '550', 'm.vocV': '49.5', 'm.iscA': '13.9', 'm.vmpV': '41.5', 'm.impA': '13.1', 'm.betaVocPct': '-0.27', 'm.betaVmpPct': '-0.35', 'm.alphaIscPct': '0.048', 'm.gammaPmaxPct': '-0.35', 'm.noctC': '45', 'm.maxSystemV': '1500', 'm.maxSeriesFuseA': '25',
  'm.verified': 'yes', 'm.verifiedBy': 'test-2', 'm.verifiedOn': '2026-11-20',
  'i.manufacturer': 'TEST', 'i.datasheetUrl': 'https://example.com/test.pdf', 'i.datasheetRevision': 'A', 'i.datasheetDate': '2026-01-01', 'i.enteredBy': 'test', 'i.enteredOn': '2026-11-20',
  'i.model': 'test-inverter', 'i.acKw': '15', 'i.maxDcV': '1000', 'i.mpptMinV': '200', 'i.mpptMaxV': '850', 'i.mpptCount': '2', 'i.maxInputA': '26', 'i.maxIscA': '40',
  'i.verified': 'yes', 'i.verifiedBy': 'test-2', 'i.verifiedOn': '2026-11-20',
  'd.modulesPerString': '16', 'd.stringsPerMppt': '1,1', 'd.inverterCount': '1',
  // TEST values (as solar-proposal-form.test.ts) so "Fetch hourly weather" can simulate the example straight through.
  'd.tilt': '10', 'd.azimuth': '0', 'i.nominalEfficiency': '0.96',
  't.recordLowC': '10', 't.maxAmbientC': '35', 't.source': 'test station record',
  'f.tariff': '25', 'f.tariffSource': 'customer bill (test)', 'f.selfConsumed': '0.8', 'f.selfConsumedSource': 'load logger (test)',
  'f.escalation': '0', 'f.escalationSource': 'test source', 'f.discount': '10', 'f.discountSource': 'test source', 'f.degradation': '0', 'f.degradationSource': 'test source',
  'f.om': '20000', 'f.omSource': 'test source', 'f.lifetime': '20',
};
export const WORKED_EXAMPLE_BOM: BomRow[] = [
  { item: 'PV modules', model: 'test-module', quantity: '32', unit: 'No', rate: '15000', rateSource: 'test supplier quote Q-1', rateDate: '2026-11-01' },
  { item: 'Inverter', model: 'test-inverter', quantity: '1', unit: 'No', rate: '320000', rateSource: 'test supplier quote Q-1', rateDate: '2026-11-01' },
];
/** The test's production figures (not a simulation): replaced as soon as real hourly weather is fetched. */
export const WORKED_EXAMPLE_PRODUCTION: HourlyResult = {
  annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 50, hours: 8760, hourlyAcKwh: [],
  specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900,
  assumptions: ['Weather: TEST production values from the regression test, not a simulation (8760 hours). Losses: test.'],
  engineVersion: 'solar-hourly test values',
};
