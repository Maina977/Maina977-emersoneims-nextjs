/**
 * Guided diagnosis session (2026-11-25): the answers typed on the Guided
 * Diagnosis tab, kept in browser storage so the Service & Job Cards screen can
 * record the same diagnosis on a job card.
 *
 * Answers are stored exactly as typed (strings). Both screens turn them into
 * engine answers with answersFromRaw() and run the same diagnose(), so the job
 * card always carries the result the technician saw. Nothing here is trusted:
 * unknown families, unknown questions and non-string values are dropped on read.
 */
import type { Answers, FaultFamily } from './types';
import { classKey, limitReadings, sourceKey, tolKey } from './engine';
import { convertUnits, unitKey, unitKindOf } from './units';
import { knownModels, type Equipment } from './oemReferences';
import { SCREEN_BUCKET, SCREEN_QUESTIONS, isScreenKey } from './safetyScreen';

export const GUIDED_SESSION_KEY = 'eims-oracle-guided-session-v1';
export type RawAnswers = Record<string, Record<string, string>>;

interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void }

/** Typed strings → engine answers: numbers for number questions, option values otherwise; blanks dropped. */
export function answersFromRaw(family: FaultFamily, raw0: Record<string, string> | undefined): Answers {
  // Safety review F10: pressures and temperatures in the unit chosen, converted; no unit = not used.
  const raw = convertUnits(family, raw0).raw;
  const a: Answers = {};
  for (const k of answerKeys(family)) {
    const v = raw?.[k.key];
    if (v === undefined || v.trim() === '') continue;
    // Numbers stay as typed: the engine parses them (plain decimals only; "," accepted as the decimal mark).
    a[k.key] = k.kind === 'number' ? v.trim() : v;
  }
  return a;
}

/**
 * Every answer key of a family: its questions, plus the companions of each OEM
 * limit (classification, source) and of each limit reading (tolerance).
 */
export function answerKeys(family: FaultFamily): Array<{ key: string; kind: 'number' | 'text' }> {
  const out: Array<{ key: string; kind: 'number' | 'text' }> = [];
  const readings = limitReadings(family);
  for (const q of family.questions) {
    out.push({ key: q.id, kind: q.kind === 'number' ? 'number' : 'text' });
    if (q.kind === 'number' && q.oemLimit) out.push({ key: classKey(q.id), kind: 'text' }, { key: sourceKey(q.id), kind: 'text' });
    if (q.kind === 'number' && readings.has(q.id)) out.push({ key: tolKey(q.id), kind: 'number' });
    if (unitKindOf(q)) out.push({ key: unitKey(q.id), kind: 'text' });
  }
  return out;
}

/**
 * Only known families and questions, string values only. Safety-screen answers
 * live once, in the shared "__screen" bucket, never inside a family's bucket.
 */
export function cleanSession(families: FaultFamily[], data: unknown): RawAnswers {
  const out: RawAnswers = {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) return out;
  const answers = (data as { answers?: unknown }).answers;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return out;
  const pick = (r: unknown, keys: string[]) => {
    const clean: Record<string, string> = {};
    if (!r || typeof r !== 'object' || Array.isArray(r)) return clean;
    for (const key of keys) {
      const v = (r as Record<string, unknown>)[key];
      if (typeof v === 'string' && v.trim() !== '') clean[key] = v.slice(0, 300);
    }
    return clean;
  };
  for (const f of families) {
    const clean = pick((answers as Record<string, unknown>)[f.id], answerKeys(f).map((k) => k.key).filter((k) => !isScreenKey(k)));
    if (Object.keys(clean).length) out[f.id] = clean;
  }
  const screen = pick((answers as Record<string, unknown>)[SCREEN_BUCKET], SCREEN_QUESTIONS.map((q) => q.id));
  if (Object.keys(screen).length) out[SCREEN_BUCKET] = screen;
  return out;
}

/** The answers one family sees: the shared safety screen plus its own. */
export function mergedRaw(session: RawAnswers, familyId: string): Record<string, string> {
  return { ...(session[SCREEN_BUCKET] ?? {}), ...(session[familyId] ?? {}) };
}

export function loadGuidedSession(store: KeyValueStore | null | undefined, families: FaultFamily[]): RawAnswers {
  if (!store) return {};
  try {
    const raw = store.getItem(GUIDED_SESSION_KEY);
    return raw ? cleanSession(families, JSON.parse(raw)) : {};
  } catch { return {}; }
}

/** The selected engine and controller models; only models named in the reference datasets are kept. */
export function cleanEquipment(data: unknown): Equipment {
  const eq = (data && typeof data === 'object' && !Array.isArray(data)) ? (data as { equipment?: unknown }).equipment : undefined;
  if (!eq || typeof eq !== 'object' || Array.isArray(eq)) return {};
  const out: Equipment = {};
  const { engine, controller } = eq as Record<string, unknown>;
  if (typeof engine === 'string' && knownModels('engine').includes(engine)) out.engine = engine;
  if (typeof controller === 'string' && knownModels('controller').includes(controller)) out.controller = controller;
  // Free text typed by the technician (the set in front of them); kept short, never matched to datasets.
  for (const k of ['manufacturer', 'model', 'variant'] as const) {
    const v = (eq as Record<string, unknown>)[k];
    if (typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, 100);
  }
  return out;
}

export function loadGuidedEquipment(store: KeyValueStore | null | undefined): Equipment {
  if (!store) return {};
  try { const raw = store.getItem(GUIDED_SESSION_KEY); return raw ? cleanEquipment(JSON.parse(raw)) : {}; } catch { return {}; }
}

/** Returns an error message, or null when saved. */
export function saveGuidedSession(store: KeyValueStore | null | undefined, answers: RawAnswers, equipment: Equipment = {}): string | null {
  if (!store) return 'Browser storage is not available: the answers are on screen only and cannot be picked up by a job card.';
  try { store.setItem(GUIDED_SESSION_KEY, JSON.stringify({ version: 1, answers, equipment })); return null; } catch { return 'Could not save the answers in browser storage: they are on screen only and cannot be picked up by a job card.'; }
}
