/**
 * F10-REMAINING (2026-11-26): a refused PROTECTIVE value (reading or limit: no unit, unknown unit,
 * not a number, out of range, or out of band) is never safer than a typed one. Used by the record
 * (jobCardRecord) and by the session-wide STOPs (sessionSafety), so it holds every tab.
 */
import { parseDecimal, SAFEGUARD_LABEL, tolKey } from './engine';
import { toCanonical, UNIT_OPTIONS, unitKindOf } from './units';
import type { Answers, DiagnosisResult, FaultFamily, NumberQuestion } from './types';

/** F10-REMAINING (2026-11-26) wording. */
export const REFUSED_UNIT_SOME = 'STOP — protective value entered without its unit: in at least one possible unit it reaches the limit. Choose the unit.';
export const REFUSED_UNIT_ALL = 'STOP — protective value entered without its unit: in every possible unit it reaches the limit. Choose the unit.';
/**
 * F10-R2 (2026-11-26): once a refused-value STOP has been committed on the panel it is kept as a
 * hold for that family and field. Deleting or blanking the value, Clear answers, a reload or another
 * tab never releases it; only a valid value in the same field, a recorded clearance or the phrase does.
 */
export const refusedHoldKey = (familyId: string, field: string) => `${familyId}|refused-value|${field}`;
export const refusedHoldText = (field: string) => `STOP — protective value refused (${field}): value removed or refused — enter a valid value, record a clearance, or record "readings not taken — STOP in force" on the job card.`;
/** The protective fields of a family (readings and limits of its protective limits). */
export function protectiveFields(family: FaultFamily): string[] {
  return [...new Set((family.limits ?? []).filter((l) => l.protective).flatMap((l) => [l.reading, l.limit]))];
}
/** Protective fields that hold a VALID value: entered, unit chosen where needed, a number, in range, not refused. */
export function validProtectiveFields(family: FaultFamily, raw: Record<string, string> | undefined, invalid: DiagnosisResult['invalid']): string[] {
  return protectiveFields(family).filter((id) => {
    const v = raw?.[id];
    return v !== undefined && v.trim() !== '' && !invalid.some((i) => i.q === id);
  });
}
export const refusedProtectiveText = (field: string) => `STOP — protective value refused (${field}): it cannot be checked against its limit, so it is treated as reaching it. Correct the value; no running checks until then.`;

/**
 * F10-REMAINING (2026-11-26): STOPs for refused protective values. For a reading or limit without a
 * (known) unit, every allowed unit is tried against the other side of the limit: reached in some
 * units → STOP that is not latched (choose the unit); reached in all → the ordinary STOP (latched on
 * commit). Any other refused protective field (not a number, out of range, out of band) → the
 * conservative safeguard STOP. Each is labelled as a software safeguard.
 */
export function refusedProtectiveStops(
  family: FaultFamily, answers: Answers,
  unitRefused: Array<{ q: string; cause: string; value: string }>, invalid: DiagnosisResult['invalid'],
): DiagnosisResult['stops'] {
  const out: DiagnosisResult['stops'] = [];
  const q = (id: string) => family.questions.find((x) => x.id === id) as NumberQuestion | undefined;
  const isRefused = (id: string) => invalid.some((i) => i.q === id);
  const known = (id: string): number[] | null => {
    if (!isRefused(id)) { const v = answers[id]; if (v === undefined) return null; const n = Number(v); return Number.isFinite(n) ? [n] : null; }
    const u = unitRefused.find((r) => r.q === id && (r.cause === 'no-unit' || r.cause === 'unknown-unit'));
    const qq = q(id); const kind = qq ? unitKindOf(qq) : null;
    if (!u || !kind) return null;
    const p = parseDecimal(u.value);
    if (!p.ok) return null;
    return UNIT_OPTIONS[kind].map((unit) => toCanonical(kind, unit, p.n)!).filter((n) => n >= qq!.min && n <= qq!.max);
  };
  const done = new Set<string>();
  for (const l of family.limits ?? []) {
    if (!l.protective) continue;
    const refusedIds = [l.reading, l.limit].filter(isRefused);
    if (!refusedIds.length) continue;
    const lq = q(l.limit)!;
    const dir = lq.oemLimit!.direction;
    const rs = known(l.reading); const ls = known(l.limit);
    const tol = answers[tolKey(l.reading)] !== undefined ? Number(answers[tolKey(l.reading)]) : 0;
    let msg: string | null = null;
    let latch = false;
    if (rs && ls && rs.length && ls.length) {
      const hits: boolean[] = [];
      for (const r of rs) for (const L of ls) hits.push(dir === 'min' ? r <= L + tol : r >= L - tol);
      if (hits.every(Boolean)) { msg = REFUSED_UNIT_ALL; latch = true; }
      else if (hits.some(Boolean)) msg = REFUSED_UNIT_SOME;
    }
    if (!msg) msg = refusedProtectiveText(refusedIds.map((id) => q(id)?.text ?? id).join('; '));
    if (done.has(msg)) continue;
    done.add(msg);
    out.push({ level: 'STOP', message: msg, label: SAFEGUARD_LABEL, origin: 'family', refusedFields: refusedIds, ...(latch ? {} : { refusedInput: true as const }) });
  }
  return out;
}

