/**
 * Safety review F10 (2026-11-26): explicit units for every pressure and temperature reading and
 * OEM limit. A psi value typed into a kPa field (20 psi ≈ 138 kPa read as 20 kPa) could hide a
 * low-oil-pressure STOP. The technician must choose the unit; there is no silent default. Values are
 * converted to the unit the rules use (kPa, °C) and the record shows both the value as entered and
 * the converted value. A value without a unit, with an unknown unit or that is not a number is
 * REFUSED: it is not used, so it can never clear or avoid a STOP, and the check stays withheld.
 * Physically implausible converted values are refused by the engine's range check as before.
 */
import { parseDecimal, tolKey } from './engine';
import type { FaultFamily, Question } from './types';

export type UnitKind = 'pressure' | 'temperature';
export const unitKey = (id: string) => `${id}.unit`;
export const PSI_TO_KPA = 6.894757;
export const BAR_TO_KPA = 100;
export const UNIT_OPTIONS: Record<UnitKind, readonly string[]> = { pressure: ['kPa', 'bar', 'psi'], temperature: ['°C', '°F'] };
export const CANONICAL: Record<UnitKind, string> = { pressure: 'kPa', temperature: '°C' };

/** Pressure (rules in kPa) and temperature (rules in °C) questions need an explicit unit. */
export function unitKindOf(q: Question): UnitKind | null {
  if (q.kind !== 'number') return null;
  if (q.unit === 'kPa') return 'pressure';
  if (q.unit === '°C') return 'temperature';
  return null;
}

/** A value in `unit` → the rules' unit. */
export function toCanonical(kind: UnitKind, unit: string, n: number): number | null {
  if (kind === 'pressure') return unit === 'kPa' ? n : unit === 'bar' ? n * BAR_TO_KPA : unit === 'psi' ? n * PSI_TO_KPA : null;
  return unit === '°C' ? n : unit === '°F' ? ((n - 32) * 5) / 9 : null;
}
/** A difference (tolerance) in `unit` → the rules' unit (no offset for °F). */
export function deltaToCanonical(kind: UnitKind, unit: string, n: number): number | null {
  if (kind === 'pressure') return toCanonical(kind, unit, n);
  return unit === '°C' ? n : unit === '°F' ? (n * 5) / 9 : null;
}
const round = (n: number) => Math.round(n * 1e6) / 1e6;
const show = (n: number) => String(Math.round(n * 10) / 10);

export interface UnitEntry { q: string; text: string; entered: string; unit: string; canonical: number; canonicalUnit: string }
export interface UnitConversion {
  /** The answers with every unit-bearing value converted to the rules' unit; refused values removed. */
  raw: Record<string, string>;
  refused: Array<{ q: string; reason: string; cause: 'no-unit' | 'unknown-unit' | 'not-number'; value: string }>;
  entered: UnitEntry[];
}

export function convertUnits(family: FaultFamily, raw: Record<string, string> | undefined): UnitConversion {
  const out: Record<string, string> = { ...(raw ?? {}) };
  const refused: UnitConversion['refused'] = [];
  const entered: UnitEntry[] = [];
  for (const q of family.questions) {
    const kind = unitKindOf(q);
    if (!kind) continue;
    const v = raw?.[q.id];
    const unit = (raw?.[unitKey(q.id)] ?? '').trim();
    const tk = tolKey(q.id);
    if (v === undefined || v.trim() === '') { delete out[tk]; continue; }
    const why = (r: string, cause: 'no-unit' | 'unknown-unit' | 'not-number') => { refused.push({ q: q.id, reason: `${q.text}: ${r} The value is not used, so it cannot clear or avoid a STOP; the check stays open.`, cause, value: v.trim() }); delete out[q.id]; delete out[tk]; };
    const p = parseDecimal(v);
    if (!p.ok) { why(p.why + '.', 'not-number'); continue; }
    if (!unit) { why(`choose the unit (${UNIT_OPTIONS[kind].join(', ')}) for "${v.trim()}" — there is no default unit.`, 'no-unit'); continue; }
    if (!UNIT_OPTIONS[kind].includes(unit)) { why(`unit "${unit}" is not one of ${UNIT_OPTIONS[kind].join(', ')}.`, 'unknown-unit'); continue; }
    const c = toCanonical(kind, unit, p.n)!;
    out[q.id] = String(round(c));
    entered.push({ q: q.id, text: q.text, entered: v.trim(), unit, canonical: round(c), canonicalUnit: CANONICAL[kind] });
    const t = raw?.[tk];
    if (t !== undefined && t.trim() !== '') {
      const pt = parseDecimal(t);
      if (pt.ok) out[tk] = String(round(deltaToCanonical(kind, unit, pt.n)!));
    }
  }
  return { raw: out, refused, entered };
}

/** One record line per unit-bearing value: as entered, and as used. */
export function unitLine(e: UnitEntry): string {
  return e.unit === e.canonicalUnit
    ? `${e.text}: ${e.entered} ${e.unit} (as entered)`
    : `${e.text}: entered ${e.entered} ${e.unit} = ${show(e.canonical)} ${e.canonicalUnit} (converted; ${e.unit === 'psi' ? `1 psi = ${PSI_TO_KPA} kPa` : e.unit === 'bar' ? '1 bar = 100 kPa' : '°C = (°F − 32) × 5/9'})`;
}
