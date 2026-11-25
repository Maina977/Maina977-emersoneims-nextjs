/**
 * Versioned equipment datasheet records (data/solar/equipment/*.json, 2026-11-25).
 *
 * Each record holds values copied from a manufacturer datasheet with its
 * title, revision/date, URL and retrieval date. They are MANUFACTURER
 * SPECIFICATIONS (not measured, not modelled) and stay "unverified" until a
 * second person compares them with the PDF. A value that is not printed is
 * null and is never filled in here: the adapters below report it as missing
 * evidence instead.
 */
import type { Module, Inverter } from './validate';

export const EQUIPMENT_SCHEMA = 'emersoneims/solar-equipment-datasheet v1';
export type EquipmentKind = 'module' | 'inverter-hybrid' | 'inverter-string' | 'battery-lfp' | 'charge-controller';
export interface Param { value: number | string | null; unit: string; condition?: string; note?: string }
export interface EquipmentRecord {
  schema: string; kind: EquipmentKind; manufacturer: string; model: string; variant?: string;
  datasheet: { title: string; revision: string | null; date: string | null; url: string; retrieved: string; copySource: string };
  evidenceClass: 'manufacturer specification';
  verification: { status: 'unverified' | 'verified'; enteredBy: string; note?: string; verifiedBy?: string; verifiedOn?: string };
  parameters: Record<string, Param>;
  notes?: string[];
}

/** Problems with a record's shape and provenance (empty = acceptable). */
export function recordErrors(r: unknown): string[] {
  const e: string[] = [];
  const x = r as Partial<EquipmentRecord>;
  if (!x || typeof x !== 'object') return ['not an object'];
  if (x.schema !== EQUIPMENT_SCHEMA) e.push('schema marker missing or wrong');
  if (!['module', 'inverter-hybrid', 'inverter-string', 'battery-lfp', 'charge-controller'].includes(x.kind as string)) e.push('unknown kind');
  if (!x.manufacturer?.trim() || !x.model?.trim()) e.push('manufacturer and model are required');
  const d = x.datasheet;
  if (!d || !d.title?.trim() || !/^https:\/\//.test(d.url ?? '') || Number.isNaN(Date.parse(d.retrieved ?? ''))) e.push('datasheet title, https URL and retrieval date are required');
  if (x.evidenceClass !== 'manufacturer specification') e.push('evidenceClass must be "manufacturer specification"');
  if (!x.verification || !['unverified', 'verified'].includes(x.verification.status)) e.push('verification status is required');
  if (x.verification?.status === 'verified' && (!x.verification.verifiedBy?.trim() || x.verification.verifiedBy === x.verification.enteredBy)) e.push('a verified record needs a second person (verifiedBy different from enteredBy)');
  for (const [k, p] of Object.entries(x.parameters ?? {})) {
    if (!p || typeof p.unit !== 'string' || !p.unit.trim()) e.push(`parameter ${k}: unit is required`);
    if (p && p.value === null && !p.note?.trim()) e.push(`parameter ${k}: a null value needs a note saying why`);
  }
  return e;
}

/** Weaknesses that do not make a record unusable but must be shown with it. */
export function recordWarnings(r: EquipmentRecord): string[] {
  const w: string[] = [];
  if (r.datasheet.revision === null && r.datasheet.date === null) w.push(`Undated datasheet without a revision: identified only by its URL and retrieval date (${r.datasheet.retrieved}); the manufacturer may change it in place.`);
  if (r.datasheet.copySource !== 'manufacturer') w.push(`Copy not from the manufacturer (${r.datasheet.copySource}); confirm against the manufacturer's current datasheet.`);
  if (r.verification.status !== 'verified') w.push('Not yet checked against the PDF by a second person.');
  return w;
}

const n = (r: EquipmentRecord, k: string): number | null => { const v = r.parameters[k]?.value; return typeof v === 'number' && Number.isFinite(v) ? v : null; };
const ref = (r: EquipmentRecord) => `${r.manufacturer} ${r.datasheet.title}, ${r.datasheet.revision ?? r.datasheet.date} (${r.datasheet.url}); manufacturer specification, ${r.verification.status}`;

/** Module for validate.ts from a module record; any value the datasheet does not print is reported, never assumed. */
export function moduleFromRecord(r: EquipmentRecord): { module: Module | null; missing: string[] } {
  const need: Array<[keyof Module, string]> = [['pmaxW', 'pmax'], ['vocV', 'voc'], ['iscA', 'isc'], ['vmpV', 'vmp'], ['impA', 'imp'], ['betaVocPct', 'tempCoeffVoc'], ['betaVmpPct', 'tempCoeffVmp'], ['alphaIscPct', 'tempCoeffIsc'], ['gammaPmaxPct', 'tempCoeffPmax'], ['noctC', 'noct'], ['maxSystemV', 'maxSystemVoltage'], ['maxSeriesFuseA', 'maxSeriesFuseRating']];
  if (r.kind !== 'module') return { module: null, missing: ['record is not a module'] };
  const missing = need.filter(([, k]) => n(r, k) === null).map(([, k]) => `${k} (not printed on ${r.datasheet.revision ?? r.datasheet.date})`);
  if (missing.length) return { module: null, missing };
  const m = Object.fromEntries(need.map(([f, k]) => [f, n(r, k)])) as unknown as Module;
  return { module: { ...m, model: r.model, datasheet: ref(r) }, missing };
}

/** Values available from the record by parameter name (null when not printed). */
export function recordValue(r: EquipmentRecord, key: string): number | null { return n(r, key); }
export const recordReference = ref;

/** Inverter for validate.ts from a string/hybrid record, for one MPPT input's current limits (per-input limits can differ). */
export function inverterFromRecord(r: EquipmentRecord, limits: { maxInputAKey: string; maxIscAKey: string }): { inverter: Inverter | null; missing: string[] } {
  if (r.kind !== 'inverter-string' && r.kind !== 'inverter-hybrid') return { inverter: null, missing: ['record is not an inverter'] };
  const acW = n(r, 'ratedAcOutputPower') ?? n(r, 'ratedAcOutputActivePower');
  const vals = { acW, maxDcV: n(r, 'maxDcInputVoltage'), mpptMinV: n(r, 'mpptVoltageMin'), mpptMaxV: n(r, 'mpptVoltageMax'), mpptCount: n(r, 'numberOfMppts'), maxInputA: n(r, limits.maxInputAKey), maxIscA: n(r, limits.maxIscAKey) };
  const missing = Object.entries(vals).filter(([, v]) => v === null).map(([k]) => `${k} (not printed or not read)`);
  if (missing.length) return { inverter: null, missing };
  return {
    inverter: { model: r.model, acKw: (vals.acW as number) / 1000, maxDcV: vals.maxDcV as number, mpptMinV: vals.mpptMinV as number, mpptMaxV: vals.mpptMaxV as number, mpptCount: vals.mpptCount as number, maxInputA: vals.maxInputA as number, maxIscA: vals.maxIscA as number, generatorCompatibility: null, datasheet: ref(r) },
    missing,
  };
}
