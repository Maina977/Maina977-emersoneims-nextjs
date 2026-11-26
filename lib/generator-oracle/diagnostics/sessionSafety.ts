/**
 * Session-wide STOPs (independent safety review F3, 2026-11-25).
 *
 * "The most serious applicable condition decides": a STOP raised by any family
 * of the session (its own rules or limits) is carried into every other family's
 * result, on screen and in every job-card record. The shared safety screen is
 * already part of every family, so its STOPs are not repeated here.
 */
import { diagnose } from './engine';
import { answersFromRaw, mergedRaw, type RawAnswers } from './session';
import { SCREEN_BUCKET } from './safetyScreen';
import { convertUnits } from './units';
import { refusedProtectiveStops } from './refusedProtective';
import type { FaultFamily } from './types';

export interface ExternalStop { family: string; message: string; label?: string }

export function externalStopsFor(families: FaultFamily[], session: RawAnswers | undefined, familyId: string): ExternalStop[] {
  if (!session) return [];
  const out: ExternalStop[] = [];
  for (const f of families) {
    if (f.id === familyId || f.id === SCREEN_BUCKET) continue;
    const own = session[f.id];
    if (!own || !Object.keys(own).length) continue;
    const merged = mergedRaw(session, f.id);
    const answers = answersFromRaw(f, merged);
    const r = diagnose(f, answers);
    for (const s of r.stops) if (s.level === 'STOP' && s.origin === 'family') out.push({ family: f.title, message: s.message, ...(s.label ? { label: s.label } : {}) });
    // F10-REMAINING: a refused protective value in another family is a STOP there, so it holds this one too.
    const conv = convertUnits(f, merged);
    for (const s of refusedProtectiveStops(f, answers, conv.refused, [...conv.refused, ...r.invalid])) out.push({ family: f.title, message: s.message, ...(s.label ? { label: s.label } : {}) });
  }
  return out;
}
