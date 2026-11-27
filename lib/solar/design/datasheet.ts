/**
 * Solar component library: datasheet import and verification (P1-B, 2026-11-14).
 *
 * A component enters the library from its manufacturer datasheet (CSV row or
 * JSON), is checked for units and internal consistency, and stays
 * "unverified" until a second person compares it with the datasheet and signs
 * it off. Only verified entries may be used for a design that is quoted.
 */
import type { Battery, Inverter, Module } from './validate';

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

function provenance(r: Record<string, string>, errors: string[]): Provenance {
  for (const f of PROV_FIELDS) if (!r[f]) errors.push(`${f} is required`);
  if (r.datasheetUrl && !/^https:\/\//.test(r.datasheetUrl)) errors.push('datasheetUrl must be an https link to the manufacturer document');
  for (const f of ['datasheetDate', 'enteredOn'] as const) if (r[f] && Number.isNaN(Date.parse(r[f]))) errors.push(`${f} must be a date (YYYY-MM-DD)`);
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
const id = (p: Provenance, model: string) => `${p.manufacturer}|${model}|${p.datasheetRevision}`.toLowerCase();

export function importModule(r: Record<string, string>): ImportResult<Module> {
  const errors: string[] = []; const warnings: string[] = [];
  const p = provenance(r, errors);
  const n = numbers(r, MODULE_FIELDS, errors) as unknown as Module;
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
  for (const [k, v] of Object.entries(extra)) if (typeof v === 'number' && !(v > 0)) errors.push(`${k} must be positive when given`);
  if (errors.length) return { entry: null, errors };
  if (!extra.generatorCompatibility) warnings.push('No generator compatibility statement: hybrid designs with a generator will be refused');
  return { entry: { kind: 'inverter', id: id(p, n.model), data: { ...n, ...extra, datasheet: `${p.manufacturer} ${n.model} datasheet rev ${p.datasheetRevision} (${p.datasheetDate}) ${p.datasheetUrl}` }, provenance: p, status: 'unverified', warnings }, errors };
}

export function importBattery(r: Record<string, string>): ImportResult<Battery> {
  const errors: string[] = []; const warnings: string[] = [];
  const p = provenance(r, errors);
  const n = numbers(r, BATTERY_FIELDS, errors) as unknown as Battery;
  if (!errors.length) {
    if (!(n.usableDoD > 0 && n.usableDoD <= 1)) errors.push('usableDoD is a fraction 0–1 (90 % → 0.9)');
    if (!(n.dischargeEfficiency > 0 && n.dischargeEfficiency <= 1)) errors.push('dischargeEfficiency is a fraction 0–1');
    if (!(n.maxDischargeC > 0 && n.maxChargeC > 0)) errors.push('C-rates must be positive');
    if (n.maxDischargeC > 3) warnings.push('Discharge rate above 3 C: check that the value is a C-rate, not a current in A');
  }
  if (errors.length) return { entry: null, errors };
  return { entry: { kind: 'battery', id: id(p, n.model), data: { ...n, datasheet: `${p.manufacturer} ${n.model} datasheet rev ${p.datasheetRevision} (${p.datasheetDate}) ${p.datasheetUrl}` }, provenance: p, status: 'unverified', warnings }, errors };
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
  module: [...PROV_FIELDS, ...MODULE_FIELDS],
  inverter: [...PROV_FIELDS, ...INVERTER_FIELDS, 'batteryMaxDischargeKw', 'batteryMaxChargeKw', 'generatorCompatibility'],
  battery: [...PROV_FIELDS, ...BATTERY_FIELDS],
};
