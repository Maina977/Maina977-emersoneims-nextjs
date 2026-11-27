/**
 * Solar proposal saved-project workflow (P1, 2026-11-21): pure helpers used by
 * the Proposal page (components/solar-modules/crc/src/pages/ProposalPage.tsx).
 *
 * - Autosave of the form draft in this browser's localStorage, under a
 *   versioned key, in an envelope with a format marker and a schema version.
 * - A project file (.json) with the same envelope, plus the revision hash of
 *   the inputs at the time of saving (for comparison only, never trusted).
 * - Strict validation on reading either: foreign, corrupt, oversized and
 *   newer-version data are rejected with a message.
 *
 * Saved data never carries an approval or a verified status:
 * - any approval / verifiedApproval / status member is dropped;
 * - datasheet sign-offs (m./i./b. verified, verifiedBy, verifiedOn) and any
 *   old typed approval fields (a.*) are dropped from the form, both when
 *   saving and when reading;
 * - nothing computed is stored: production, hybrid balance, the proposal and
 *   its revision hash are recomputed from the form after a restore or import,
 *   and the proposal can only ever come back from the server as DRAFT
 *   (proposalApproval.ts).
 *
 * Every storage access is wrapped: blocked storage (private window, privacy
 * setting, no window) and full storage each give their own message and never
 * throw. There are no accounts and no shared storage yet.
 */
import type { BomRow, ProposalForm } from './proposalForm';

export const PROJECT_FORMAT = 'solar-genius-pro/proposal-project';
export const PROJECT_SCHEMA_VERSION = 1;
export const DRAFT_STORAGE_KEY = `sgp.solar.proposal.draft.v${PROJECT_SCHEMA_VERSION}`;
export const MAX_PROJECT_BYTES = 1_000_000;
const MAX_FORM_KEYS = 400;
const MAX_VALUE_LENGTH = 4000;
const MAX_BOM_ROWS = 500;
const HEX64 = /^[0-9a-f]{64}$/;
/**
 * Form keys look like "ref", "m.pmaxW", "k.csaMm2" or (REQ-05 cable runs 2–8)
 * "k2.name"; nothing else is accepted. Before 2026-11-27 a digit after the dot
 * was refused, so any draft or project file with a cable cross-section
 * ("k.csaMm2") was reported as damaged and not opened.
 */
const FORM_KEY = /^[a-z]{1,6}[2-9]?(\.[A-Za-z][A-Za-z0-9]{0,39})?$/;
const BOM_KEYS: ReadonlyArray<keyof BomRow> = ['item', 'model', 'quantity', 'unit', 'rate', 'rateSource', 'rateDate'];
const ENVELOPE_KEYS = ['format', 'schemaVersion', 'savedAt', 'form', 'bom', 'production', 'revisionHash'];

export const SAVED_HERE_ONLY_NOTE = 'Saved in this browser only — accounts and shared storage are not available yet.';
export const STORAGE_BLOCKED_MESSAGE = 'Autosave is off: this browser is blocking site storage (for example a private window or a privacy setting), so your work is not kept here. Use "Save project file (.json)" to keep it.';
export const STORAGE_FULL_MESSAGE = 'Autosave failed: this browser\'s storage for the site is full, so your latest changes are not kept here. Use "Save project file (.json)" to keep them, or free some browser storage.';
export const SIGN_OFFS_NOT_RESTORED = 'Datasheet sign-offs and approvals are never restored from saved data: the second person must verify each datasheet again, and the proposal is DRAFT.';

export type ProductionKind = 'weather' | 'test-example' | 'none';
export interface SavedProduction { kind: ProductionKind; label: string }
export interface SavedProject { form: ProposalForm; bom: BomRow[]; production: SavedProduction }
export interface ProjectEnvelope extends SavedProject {
  format: typeof PROJECT_FORMAT;
  schemaVersion: number;
  savedAt: string;
  /** proposalRevisionHash of the inputs when saved, or null if they were incomplete. Informational only. */
  revisionHash: string | null;
}

export type ReadResult =
  | { ok: true; project: SavedProject; savedAt: string; fileRevisionHash: string | null; stripped: string[] }
  | { ok: false; reason: 'corrupt' | 'foreign' | 'newer' | 'too-large'; message: string };

/** A form key that carries a sign-off or an approval claim, and is therefore never saved or restored. */
export function isClaimKey(k: string): boolean {
  return /^[mib]\.verified(By|On)?$/.test(k) || k.startsWith('a.') || /approv|status/i.test(k);
}

/** The form without any sign-off or approval claim; the dropped keys are listed. */
export function stripClaims(form: ProposalForm): { form: ProposalForm; stripped: string[] } {
  const out: ProposalForm = {};
  const stripped: string[] = [];
  for (const [k, v] of Object.entries(form)) {
    if (isClaimKey(k)) { if (v !== '') stripped.push(`form field ${k}`); continue; }
    out[k] = v;
  }
  return { form: out, stripped };
}

/** True when there is nothing worth keeping (an empty form and only empty BOM rows). */
export function isEmptyProject(p: SavedProject): boolean {
  return Object.values(p.form).every((v) => v.trim() === '') && p.bom.every((r) => BOM_KEYS.every((k) => r[k].trim() === ''));
}

export function makeEnvelope(p: SavedProject, revisionHash: string | null, now: Date = new Date()): ProjectEnvelope {
  return {
    format: PROJECT_FORMAT,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    savedAt: now.toISOString(),
    form: stripClaims(p.form).form,
    bom: p.bom.map((r) => Object.fromEntries(BOM_KEYS.map((k) => [k, r[k] ?? ''])) as unknown as BomRow),
    production: { kind: p.production.kind, label: p.production.label },
    revisionHash: revisionHash && HEX64.test(revisionHash) ? revisionHash : null,
  };
}

export function serializeProject(p: SavedProject, revisionHash: string | null, now: Date = new Date()): string {
  return JSON.stringify(makeEnvelope(p, revisionHash, now), null, 2);
}

export function projectFileName(reference: string): string {
  const safe = (reference ?? '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'proposal';
  return `solar-proposal-${safe}.json`;
}

const isPlainObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
/**
 * Read a project file or a stored draft. Strict: the format marker and schema
 * version must match, and every field must have the expected shape. Claims
 * (approval, verified status) are dropped and listed in `stripped`.
 */
export function readProject(text: string, subject: 'file' | 'draft' = 'file'): ReadResult {
  const lead = subject === 'file' ? 'Project file not opened' : 'The draft saved in this browser was not restored';
  const corrupt = (why: string): ReadResult => ({ ok: false, reason: 'corrupt', message: `${lead}: it is damaged or incomplete (${why}).` });
  if (typeof text !== 'string') return corrupt('not text');
  if (text.length > MAX_PROJECT_BYTES) return { ok: false, reason: 'too-large', message: `${lead}: it is larger than ${MAX_PROJECT_BYTES.toLocaleString('en-KE')} bytes, far more than a proposal project.` };
  let data: unknown;
  try { data = JSON.parse(text); } catch { return corrupt('not valid JSON'); }
  if (!isPlainObject(data) || data.format !== PROJECT_FORMAT) {
    return { ok: false, reason: 'foreign', message: `${lead}: it is not a Solar Genius Pro proposal project.` };
  }
  const v = data.schemaVersion;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) return corrupt('schema version missing or invalid');
  if (v > PROJECT_SCHEMA_VERSION) {
    return { ok: false, reason: 'newer', message: `${lead}: it was saved by a newer version of the proposal page (schema ${v}; this page reads schema ${PROJECT_SCHEMA_VERSION}). Nothing in it was changed; reload the page to get the latest version.` };
  }
  const stripped: string[] = Object.keys(data).filter((k) => !ENVELOPE_KEYS.includes(k)).map((k) => `file member ${k}`);

  if (typeof data.savedAt !== 'string' || Number.isNaN(Date.parse(data.savedAt))) return corrupt('saved time missing or invalid');
  if (data.revisionHash !== null && (typeof data.revisionHash !== 'string' || !HEX64.test(data.revisionHash))) return corrupt('revision hash invalid');

  if (!isPlainObject(data.form)) return corrupt('form missing');
  const formEntries = Object.entries(data.form);
  if (formEntries.length > MAX_FORM_KEYS) return corrupt('too many form fields');
  const form: ProposalForm = {};
  for (const [k, val] of formEntries) {
    if (!FORM_KEY.test(k)) return corrupt(`unexpected form field "${k.slice(0, 40)}"`);
    if (typeof val !== 'string' || val.length > MAX_VALUE_LENGTH) return corrupt(`form field ${k} is not text`);
    form[k] = val;
  }
  const clean = stripClaims(form);
  stripped.push(...clean.stripped);

  if (!Array.isArray(data.bom) || data.bom.length > MAX_BOM_ROWS) return corrupt('bill of materials missing or too long');
  const bom: BomRow[] = [];
  for (let i = 0; i < data.bom.length; i++) {
    const r: unknown = data.bom[i];
    if (!isPlainObject(r)) return corrupt(`bill of materials row ${i + 1} is not a row`);
    const row = {} as BomRow;
    for (const k of BOM_KEYS) {
      const val = r[k];
      if (typeof val !== 'string' || val.length > MAX_VALUE_LENGTH) return corrupt(`bill of materials row ${i + 1}: ${k} is not text`);
      row[k] = val;
    }
    for (const k of Object.keys(r)) if (!(BOM_KEYS as readonly string[]).includes(k)) stripped.push(`bill of materials row ${i + 1} member ${k}`);
    bom.push(row);
  }

  const pr = data.production;
  if (!isPlainObject(pr) || !['weather', 'test-example', 'none'].includes(pr.kind as string) || typeof pr.label !== 'string' || pr.label.length > MAX_VALUE_LENGTH) {
    return corrupt('production source missing or invalid');
  }
  for (const k of Object.keys(pr)) if (k !== 'kind' && k !== 'label') stripped.push(`production member ${k}`);

  return {
    ok: true,
    project: { form: clean.form, bom, production: { kind: pr.kind as ProductionKind, label: pr.label } },
    savedAt: data.savedAt,
    fileRevisionHash: (data.revisionHash as string | null) ?? null,
    stripped,
  };
}

// ------------------------------------------------------------------ browser storage
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
/** Returns the storage, or throws when the browser blocks it (as window.localStorage itself does). */
export type StorageResolver = () => StorageLike | null | undefined;
export const browserStorage: StorageResolver = () => (typeof window === 'undefined' ? null : window.localStorage);

export type StorageProblem = 'blocked' | 'full';
export function isQuotaError(e: unknown): boolean {
  const x = e as { name?: unknown; code?: unknown } | null;
  return !!x && (x.name === 'QuotaExceededError' || x.name === 'NS_ERROR_DOM_QUOTA_REACHED' || x.code === 22 || x.code === 1014);
}
export const storageMessage = (p: StorageProblem) => (p === 'full' ? STORAGE_FULL_MESSAGE : STORAGE_BLOCKED_MESSAGE);

function resolve(r: StorageResolver): StorageLike | null {
  try { return r() ?? null; } catch { return null; }
}

export type SaveResult = { ok: true; savedAt: string; removed: boolean } | { ok: false; problem: StorageProblem; message: string };

/** Autosave the draft. An empty project removes the stored draft instead. Never throws. */
export function saveDraft(p: SavedProject, revisionHash: string | null, r: StorageResolver = browserStorage, now: Date = new Date()): SaveResult {
  const s = resolve(r);
  if (!s) return { ok: false, problem: 'blocked', message: STORAGE_BLOCKED_MESSAGE };
  try {
    if (isEmptyProject(p)) { s.removeItem(DRAFT_STORAGE_KEY); return { ok: true, savedAt: now.toISOString(), removed: true }; }
    s.setItem(DRAFT_STORAGE_KEY, JSON.stringify(makeEnvelope(p, revisionHash, now)));
    return { ok: true, savedAt: now.toISOString(), removed: false };
  } catch (e) {
    const problem: StorageProblem = isQuotaError(e) ? 'full' : 'blocked';
    return { ok: false, problem, message: storageMessage(problem) };
  }
}

export type LoadResult =
  | { status: 'none' }
  | { status: 'restored'; project: SavedProject; savedAt: string; stripped: string[] }
  | { status: 'rejected'; reason: 'corrupt' | 'foreign' | 'newer' | 'too-large'; message: string }
  | { status: 'blocked'; message: string };

/** Read the stored draft. Never throws. */
export function loadDraft(r: StorageResolver = browserStorage): LoadResult {
  const s = resolve(r);
  if (!s) return { status: 'blocked', message: STORAGE_BLOCKED_MESSAGE };
  let text: string | null;
  try { text = s.getItem(DRAFT_STORAGE_KEY); } catch { return { status: 'blocked', message: STORAGE_BLOCKED_MESSAGE }; }
  if (text === null) return { status: 'none' };
  const res = readProject(text, 'draft');
  if (!res.ok) return { status: 'rejected', reason: res.reason, message: res.message };
  return { status: 'restored', project: res.project, savedAt: res.savedAt, stripped: res.stripped };
}

/** Remove the stored draft. Never throws. */
export function clearDraft(r: StorageResolver = browserStorage): { ok: true } | { ok: false; message: string } {
  const s = resolve(r);
  if (!s) return { ok: false, message: STORAGE_BLOCKED_MESSAGE };
  try { s.removeItem(DRAFT_STORAGE_KEY); return { ok: true }; } catch { return { ok: false, message: STORAGE_BLOCKED_MESSAGE }; }
}
