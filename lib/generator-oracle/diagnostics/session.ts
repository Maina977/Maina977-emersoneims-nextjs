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
import { knownModels, type Equipment } from './oemReferences';

export const GUIDED_SESSION_KEY = 'eims-oracle-guided-session-v1';
export type RawAnswers = Record<string, Record<string, string>>;

interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void }

/** Typed strings → engine answers: numbers for number questions, option values otherwise; blanks dropped. */
export function answersFromRaw(family: FaultFamily, raw: Record<string, string> | undefined): Answers {
  const a: Answers = {};
  for (const q of family.questions) {
    const v = raw?.[q.id];
    if (v === undefined || v.trim() === '') continue;
    // Number('') is 0, so blanks are dropped above; Number('abc') is NaN and is refused by the engine.
    a[q.id] = q.kind === 'number' ? Number(v.trim()) : v;
  }
  return a;
}

/** Only known families and questions, string values only. */
export function cleanSession(families: FaultFamily[], data: unknown): RawAnswers {
  const out: RawAnswers = {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) return out;
  const answers = (data as { answers?: unknown }).answers;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return out;
  for (const f of families) {
    const r = (answers as Record<string, unknown>)[f.id];
    if (!r || typeof r !== 'object' || Array.isArray(r)) continue;
    const clean: Record<string, string> = {};
    for (const q of f.questions) {
      const v = (r as Record<string, unknown>)[q.id];
      if (typeof v === 'string' && v.trim() !== '') clean[q.id] = v;
    }
    if (Object.keys(clean).length) out[f.id] = clean;
  }
  return out;
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
