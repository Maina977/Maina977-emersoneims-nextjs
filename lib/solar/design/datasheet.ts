/**
 * Solar component library: datasheet import and verification (P1-B, 2026-11-14).
 *
 * A component enters the library from its manufacturer datasheet (CSV row or
 * JSON), is checked for units and internal consistency, and stays
 * "unverified" until a second person compares it with the datasheet and signs
 * it off. Only verified entries may be used for a design that is quoted.
 */
import { RCD_TYPES, type Battery, type Inverter, type Module } from './validate';
import { MODULE_DIM_MM } from './validate';

export type Kind = 'module' | 'inverter' | 'battery';
export interface Provenance {
  manufacturer: string;
  datasheetUrl: string;
  datasheetRevision: string;
  datasheetDate: string; // ISO
  enteredBy: string; enteredOn: string;
  verifiedBy?: string; verifiedOn?: string;
}
export interface LibraryEntry<T> {
  kind: Kind;
  id: string; // manufacturer + model + datasheet revision
  data: T;
  provenance: Provenance;
  status: 'unverified' | 'verified';
  warnings: string[];
}
export interface ImportResult<T> { entry: LibraryEntry<T> | null; errors: string[] }

const MODULE_FIELDS = ['model', 'pmaxW', 'vocV', 'iscA', 'vmpV', 'impA', 'betaVocPct', 'betaVmpPct', 'alphaIscPct', 'gammaPmaxPct', 'noctC', 'maxSystemV', 'maxSeriesFuseA'] as const;
const INVERTER_FIELDS = ['model', 'acKw', 'maxDcV', 'mpptMinV', 'mpptMaxV', 'mpptCount', 'maxInputA', 'maxIscA'] as const;
const BATTERY_FIELDS = ['model', 'nominalKwh', 'usableDoD', 'dischargeEfficiency', 'maxDischargeC', 'maxChargeC'] as const;
const PROV_FIELDS = ['manufacturer', 'datasheetUrl', 'datasheetRevision', 'datasheetDate', 'enteredBy', 'enteredOn'] as const;

/** Parse one CSV line (RFC 4180 quoting). */
export function parseCsvLine(line: string): string[] {
  const out: string[] = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
export function parseCsv(text: string): Array<Record<string, string>> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  if (lines.length < 2) return [];
  const head = parseCsvLine(lines[0]);
  return lines.slice(1).map((l) => { const v = parseCsvLine(l); return Object.fromEntries(head.map((h, i) => [h, v[i] ?? ''])); });
}

/**
 * The import's provenance rules, shared with POST /api/solar/proposal (final
 * review: the API accepted a URL "not-a-link" and a date "someday"). Required
 * text fields, an https datasheet link, ISO dates (YYYY-MM-DD) for the
 * datasheet and entry dates, and for a verification date when one is given.
 * `prefix` names the entry in the messages ("module.", "inverter."…).
 */
export function provenanceErrors(p: Record<string, unknown>, prefix = ''): string[] {
  const e: string[] = [];
  const txt = (k: string) => (typeof p[k] === 'string' ? (p[k] as string).trim() : '');
  for (const f of PROV_FIELDS) if (!txt(f)) e.push(`${prefix}${f} is required`);
  if (txt('datasheetUrl') && !/^https:\/\/[^\s/]+\.[^\s]+/.test(txt('datasheetUrl'))) e.push(`${prefix}datasheetUrl must be an https link to the manufacturer document`);
  const iso = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
  for (const f of ['datasheetDate', 'enteredOn'] as const) if (txt(f) && !iso(txt(f))) e.push(`${prefix}${f} must be a date (YYYY-MM-DD)`);
  if (p.verifiedOn !== undefined && !(typeof p.verifiedOn === 'string' && iso(p.verifiedOn.trim()))) e.push(`${prefix}verifiedOn must be a date (YYYY-MM-DD)`);
  if (p.verifiedBy !== undefined && typeof p.verifiedBy !== 'string') e.push(`${prefix}verifiedBy must be text`);
  return e;
}
function provenance(r: Record<string, string>, errors: string[]): Provenance {
  errors.push(...provenanceErrors(r));
  return { manufacturer: r.manufacturer, datasheetUrl: r.datasheetUrl, datasheetRevision: r.datasheetRevision, datasheetDate: r.datasheetDate, enteredBy: r.enteredBy, enteredOn: r.enteredOn };
}
function numbers<F extends readonly string[]>(r: Record<string, string>, fields: F, errors: string[]): Record<string, number | string> {
  const o: Record<string, number | string> = {};
  for (const f of fields) {
    const v = r[f];
    if (v === undefined || v === '') { errors.push(`${f} is required`); continue; }
    if (f === 'model') { o[f] = v; continue; }
    if (/[a-z%°]/i.test(v)) { errors.push(`${f}: enter the number only, in the column's unit (got "${v}")`); continue; }
    const n = Number(v);
    if (!Number.isFinite(n)) { errors.push(`${f}: not a number`); continue; }
    o[f] = n;
  }
  return o;
}
/** Optional numeric datasheet fields (REQ-04): blank = not given; given = a number (positive unless signed). */
function optionalNumbers(r: Record<string, string>, fields: string[], errors: string[], signed = false): Record<string, number> {
  const o: Record<string, number> = {};
  for (const f of fields) {
    const v = (r[f] ?? '').trim();
    if (v === '') continue;
    const n = Number(v);
    if (!Number.isFinite(n) || (!signed && !(n > 0))) { errors.push(`${f}: enter a ${signed ? '' : 'positive '}number in the column's unit (got "${v}")`); continue; }
    o[f] = n;
  }
  return o;
}
const id = (p: Provenance, model: string) => `${p.manufacturer}|${model}|${p.datasheetRevision}`.toLowerCase();

export function importModule(r: Record<string, string>): ImportResult<Module> {
  const errors: string[] = []; const warnings: string[] = [];
  const p = provenance(r, errors);
  const n = numbers(r, MODULE_FIELDS, errors) as unknown as Module;
  Object.assign(n, optionalNumbers(r, ['lengthMm', 'widthMm'], errors));
  // Review Q2: 2.278 typed into a mm field (metres) made the array ~0 m².
  for (const k of ['lengthMm', 'widthMm'] as const) {
    const v = (n as Module)[k];
    if (v !== undefined && !(v >= MODULE_DIM_MM.min && v <= MODULE_DIM_MM.max)) errors.push(`${k} ${v} mm is outside ${MODULE_DIM_MM.min}–${MODULE_DIM_MM.max} mm: enter the module size in millimetres (2,278, not 2.278)`);
  }
  if (!errors.length) {
    if (!(n.vmpV < n.vocV)) errors.push('Vmp must be below Voc');
    if (!(n.impA < n.iscA)) errors.push('Imp must be below Isc');
    if (n.betaVocPct >= 0 || n.betaVmpPct >= 0 || n.gammaPmaxPct >= 0) errors.push('Voltage and power temperature coefficients must be negative (%/°C)');
    if (Math.abs(n.betaVocPct) > 1 || Math.abs(n.betaVmpPct) > 1 || Math.abs(n.gammaPmaxPct) > 1) errors.push('A temperature coefficient above 1 %/°C: the value is probably in mV/°C or mA/°C; convert to %/°C');
    if (n.alphaIscPct <= 0 || n.alphaIscPct > 0.2) errors.push('α_Isc is normally a small positive %/°C (about 0.03–0.07)');
    // Pmax ≈ Vmp × Imp on every datasheet (STC); a large gap means a mistyped value.
    const vi = n.vmpV * n.impA;
    if (Math.abs(vi - n.pmaxW) / n.pmaxW > 0.03) errors.push(`Vmp × Imp = ${vi.toFixed(1)} W does not match Pmax ${n.pmaxW} W within 3 %`);
    if (![1000, 1500].includes(n.maxSystemV)) warnings.push(`Max system voltage ${n.maxSystemV} V is unusual (1000 or 1500 V expected)`);
    if (n.noctC < 38 || n.noctC > 50) warnings.push(`NOCT/NMOT ${n.noctC} °C outside the usual 40–48 °C`);
    if (n.maxSeriesFuseA < n.iscA * 1.5) warnings.push('Max series fuse below 1.5 × Isc: string fusing will be impossible if fuses are needed');
  }
  if (errors.length) return { entry: null, errors };
  return { entry: { kind: 'module', id: id(p, n.model), data: { ...n, datasheet: `${p.manufacturer} ${n.model} datasheet rev ${p.datasheetRevision} (${p.datasheetDate}) ${p.datasheetUrl}` }, provenance: p, status: 'unverified', warnings }, errors };
}

export function importInverter(r: Record<string, string>): ImportResult<Inverter> {
  const errors: string[] = []; const warnings: string[] = [];
  const p = provenance(r, errors);
  const n = numbers(r, INVERTER_FIELDS, errors) as unknown as Inverter;
  if (!errors.length) {
    if (!(n.mpptMinV < n.mpptMaxV && n.mpptMaxV <= n.maxDcV)) errors.push('Expected MPPT min < MPPT max ≤ max DC voltage');
    if (!Number.isInteger(n.mpptCount) || n.mpptCount < 1) errors.push('MPPT count must be a whole number ≥ 1');
    if (!(n.maxIscA >= n.maxInputA)) errors.push('Max short-circuit current per MPPT is normally ≥ max input current');
    if (n.acKw > 500) warnings.push('AC rating above 500 kW: check kW vs W');
  }
  const opt = (k: string) => (r[k] ? Number(r[k]) : undefined);
  const extra = { batteryMaxDischargeKw: opt('batteryMaxDischargeKw'), batteryMaxChargeKw: opt('batteryMaxChargeKw'), generatorCompatibility: (r.generatorCompatibility ?? '').trim() || null }; // review G2: spaces are not a statement
  const ext: { batteryMinV?: number; batteryMaxV?: number; batteryMaxChargeA?: number; batteryMaxDischargeA?: number; antiIslanding?: string } = { ...optionalNumbers(r, ['batteryMinV', 'batteryMaxV', 'batteryMaxChargeA', 'batteryMaxDischargeA'], errors), ...((r.antiIslanding ?? '').trim() ? { antiIslanding: r.antiIslanding.trim() } : {}) };
  if (ext.batteryMinV !== undefined && ext.batteryMaxV !== undefined && !(ext.batteryMinV < ext.batteryMaxV)) errors.push('batteryMinV must be below batteryMaxV');
  // REQ-05 AC protection: maximum AC output current and the RCD type the manufacturer states.
  const acx: { maxAcOutputA?: number; rcdTypeRequired?: Inverter['rcdTypeRequired'] } = optionalNumbers(r, ['maxAcOutputA'], errors);
  { const t = (r.rcdTypeRequired ?? '').trim();
    if (t) { const m = RCD_TYPE_TEXT[t.toLowerCase().replace(/^type\s*/, '')]; if (m) acx.rcdTypeRequired = m; else errors.push(`rcdTypeRequired: enter AC, A, F, B or not-required as the datasheet states it (got "${t}")`); } }

  for (const [k, v] of Object.entries(extra)) if (typeof v === 'number' && !(v > 0)) errors.push(`${k} must be positive when given`);
  if (errors.length) return { entry: null, errors };
  if (!extra.generatorCompatibility) warnings.push('No generator compatibility statement: hybrid designs with a generator will be refused');
  return { entry: { kind: 'inverter', id: id(p, n.model), data: { ...n, ...extra, ...ext, ...acx, datasheet: `${p.manufacturer} ${n.model} datasheet rev ${p.datasheetRevision} (${p.datasheetDate}) ${p.datasheetUrl}` }, provenance: p, status: 'unverified', warnings }, errors };
}

/** Accepted spellings of the RCD type a datasheet states (REQ-05). */
const RCD_TYPE_TEXT: Record<string, Inverter['rcdTypeRequired']> = { ac: 'AC', a: 'A', f: 'F', b: 'B', 'not-required': 'not-required', 'not required': 'not-required' };

export function importBattery(r: Record<string, string>): ImportResult<Battery> {
  const errors: string[] = []; const warnings: string[] = [];
  const p = provenance(r, errors);
  const n = numbers(r, BATTERY_FIELDS, errors) as unknown as Battery;
  Object.assign(n, optionalNumbers(r, ['nominalV', 'chargeV', 'cutoffV', 'cycleLife', 'cycleLifeDoD', 'warrantyYears'], errors), optionalNumbers(r, ['minTempC', 'maxTempC'], errors, true), (r.chemistry ?? '').trim() ? { chemistry: r.chemistry.trim() } : {});
  if (n.cycleLifeDoD !== undefined && !(n.cycleLifeDoD > 0 && n.cycleLifeDoD <= 1)) errors.push('cycleLifeDoD is a fraction 0–1');
  if (n.minTempC !== undefined && n.maxTempC !== undefined && !(n.minTempC < n.maxTempC)) errors.push('minTempC must be below maxTempC');
  if (n.chargeV !== undefined && n.cutoffV !== undefined && !(n.cutoffV < n.chargeV)) errors.push('cutoffV must be below chargeV');
  if (!errors.length) {
    if (!(n.usableDoD > 0 && n.usableDoD <= 1)) errors.push('usableDoD is a fraction 0–1 (90 % → 0.9)');
    if (!(n.dischargeEfficiency > 0 && n.dischargeEfficiency <= 1)) errors.push('dischargeEfficiency is a fraction 0–1');
    if (!(n.maxDischargeC > 0 && n.maxChargeC > 0)) errors.push('C-rates must be positive');
    if (n.maxDischargeC > 3) warnings.push('Discharge rate above 3 C: check that the value is a C-rate, not a current in A');
  }
  if (errors.length) return { entry: null, errors };
  return { entry: { kind: 'battery', id: id(p, n.model), data: { ...n, datasheet: `${p.manufacturer} ${n.model} datasheet rev ${p.datasheetRevision} (${p.datasheetDate}) ${p.datasheetUrl}` }, provenance: p, status: 'unverified', warnings }, errors };
}

/**
 * The import's datasheet rules applied to an already-parsed data object, for
 * the POST /api/solar/proposal path, which never runs the CSV/form import
 * (re-review Q6). Same rules, same limits; messages name the field.
 */
const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
function optPositive(d: Record<string, unknown>, keys: string[], e: string[], prefix: string, signed = false): void {
  for (const k of keys) if (d[k] !== undefined && !(fin(d[k]) && (signed || (d[k] as number) > 0))) e.push(`${prefix}.${k} must be a ${signed ? '' : 'positive '}number when given`);
}
export function moduleDataErrors(m: Record<string, unknown>): string[] {
  const e: string[] = [];
  if (typeof m.model !== 'string' || !m.model.trim()) e.push('module.model is required');
  for (const k of MODULE_FIELDS) if (k !== 'model' && !fin(m[k])) e.push(`module.${k} must be a number`);
  if (e.length) return e;
  const n = m as unknown as Module;
  if (!(n.vmpV < n.vocV)) e.push('module: Vmp must be below Voc');
  if (!(n.impA < n.iscA)) e.push('module: Imp must be below Isc');
  if (n.betaVocPct >= 0 || n.betaVmpPct >= 0 || n.gammaPmaxPct >= 0) e.push('module: voltage and power temperature coefficients must be negative (%/°C)');
  if (Math.abs(n.betaVocPct) > 1 || Math.abs(n.betaVmpPct) > 1 || Math.abs(n.gammaPmaxPct) > 1) e.push('module: a temperature coefficient above 1 %/°C (probably mV/°C or mA/°C)');
  if (n.alphaIscPct <= 0 || n.alphaIscPct > 0.2) e.push('module: α_Isc must be a small positive %/°C');
  if (!(n.pmaxW > 0) || Math.abs(n.vmpV * n.impA - n.pmaxW) / n.pmaxW > 0.03) e.push('module: Vmp × Imp does not match Pmax within 3 %');
  for (const k of ['lengthMm', 'widthMm'] as const) {
    const v = m[k];
    if (v !== undefined && !(fin(v) && v >= MODULE_DIM_MM.min && v <= MODULE_DIM_MM.max)) e.push(`module.${k} must be ${MODULE_DIM_MM.min}–${MODULE_DIM_MM.max} mm when given`);
  }
  return e;
}
export function inverterDataErrors(v: Record<string, unknown>): string[] {
  const e: string[] = [];
  if (typeof v.model !== 'string' || !v.model.trim()) e.push('inverter.model is required');
  for (const k of INVERTER_FIELDS) if (k !== 'model' && !fin(v[k])) e.push(`inverter.${k} must be a number`);
  if (e.length) return e;
  const n = v as unknown as Inverter;
  if (!(n.mpptMinV < n.mpptMaxV && n.mpptMaxV <= n.maxDcV)) e.push('inverter: expected MPPT min < MPPT max ≤ max DC voltage');
  if (!Number.isInteger(n.mpptCount) || n.mpptCount < 1) e.push('inverter: MPPT count must be a whole number ≥ 1');
  if (!(n.maxIscA >= n.maxInputA)) e.push('inverter: max short-circuit current per MPPT must be ≥ max input current');
  optPositive(v, ['batteryMaxDischargeKw', 'batteryMaxChargeKw', 'batteryMinV', 'batteryMaxV', 'batteryMaxChargeA', 'batteryMaxDischargeA'], e, 'inverter');
  if (fin(v.batteryMinV) && fin(v.batteryMaxV) && !(v.batteryMinV < v.batteryMaxV)) e.push('inverter: batteryMinV must be below batteryMaxV');
  if (v.antiIslanding !== undefined && v.antiIslanding !== null && typeof v.antiIslanding !== 'string') e.push('inverter.antiIslanding must be text when given');
  optPositive(v, ['maxAcOutputA'], e, 'inverter');
  if (v.rcdTypeRequired !== undefined && v.rcdTypeRequired !== 'not-required' && !(RCD_TYPES as readonly unknown[]).includes(v.rcdTypeRequired)) e.push('inverter.rcdTypeRequired must be AC, A, F, B or not-required when given');
  return e;
}
export function batteryDataErrors(b: Record<string, unknown>): string[] {
  const e: string[] = [];
  if (typeof b.model !== 'string' || !b.model.trim()) e.push('battery.model is required');
  for (const k of BATTERY_FIELDS) if (k !== 'model' && !fin(b[k])) e.push(`battery.${k} must be a number`);
  if (e.length) return e;
  const n = b as unknown as Battery;
  if (!(n.usableDoD > 0 && n.usableDoD <= 1)) e.push('battery: usableDoD is a fraction 0–1');
  if (!(n.dischargeEfficiency > 0 && n.dischargeEfficiency <= 1)) e.push('battery: dischargeEfficiency is a fraction 0–1');
  if (!(n.maxDischargeC > 0 && n.maxChargeC > 0)) e.push('battery: C-rates must be positive');
  optPositive(b, ['nominalKwh'], e, 'battery');
  optPositive(b, ['nominalV', 'chargeV', 'cutoffV', 'cycleLife', 'cycleLifeDoD', 'warrantyYears'], e, 'battery');
  optPositive(b, ['minTempC', 'maxTempC'], e, 'battery', true);
  if (fin(b.cycleLifeDoD) && !(b.cycleLifeDoD > 0 && b.cycleLifeDoD <= 1)) e.push('battery: cycleLifeDoD is a fraction 0–1');
  if (fin(b.minTempC) && fin(b.maxTempC) && !(b.minTempC < b.maxTempC)) e.push('battery: minTempC must be below maxTempC');
  if (fin(b.chargeV) && fin(b.cutoffV) && !(b.cutoffV < b.chargeV)) e.push('battery cut-off voltage must be below its full-charge voltage');
  if (b.chemistry !== undefined && typeof b.chemistry !== 'string') e.push('battery.chemistry must be text when given');
  return e;
}

/** Second-person sign-off: the verifier must differ from the person who entered it. */
export function verify<T>(e: LibraryEntry<T>, verifiedBy: string, verifiedOn: string): LibraryEntry<T> {
  if (!verifiedBy.trim()) throw new Error('Verifier name required');
  if (verifiedBy.trim().toLowerCase() === e.provenance.enteredBy.trim().toLowerCase()) throw new Error('The verifier must be a different person from the one who entered the datasheet');
  if (Number.isNaN(Date.parse(verifiedOn))) throw new Error('Verification date required');
  return { ...e, status: 'verified', provenance: { ...e.provenance, verifiedBy, verifiedOn } };
}

/** Only verified entries may be used in a design that is quoted. */
export function usableForQuotation(...entries: Array<LibraryEntry<unknown>>): { ok: boolean; reasons: string[] } {
  const reasons = entries.filter((e) => e.status !== 'verified').map((e) => `${e.id}: datasheet entry not yet verified by a second person`);
  return { ok: reasons.length === 0, reasons };
}

export const DATASHEET_CSV_HEADERS = {
  module: [...PROV_FIELDS, ...MODULE_FIELDS, 'lengthMm', 'widthMm'],
  inverter: [...PROV_FIELDS, ...INVERTER_FIELDS, 'batteryMaxDischargeKw', 'batteryMaxChargeKw', 'generatorCompatibility', 'batteryMinV', 'batteryMaxV', 'batteryMaxChargeA', 'batteryMaxDischargeA', 'antiIslanding', 'maxAcOutputA', 'rcdTypeRequired'],
  battery: [...PROV_FIELDS, ...BATTERY_FIELDS, 'chemistry', 'nominalV', 'chargeV', 'cutoffV', 'cycleLife', 'cycleLifeDoD', 'minTempC', 'maxTempC', 'warrantyYears'],
};
