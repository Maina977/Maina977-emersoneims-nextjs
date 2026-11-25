/**
 * Guided Diagnosis STOP latch: the browser safety record (latched STOPs, recorded clearances,
 * answers, equipment) and the lines that carry it onto a job card.
 *
 * Moved unchanged from components/generator-oracle/panels/GuidedDiagnosisPanel.tsx (which
 * re-exports it) so the Service & Job Cards screen reads the same record (integration
 * 2026-11-26): "Record a guided diagnosis" carries EVERY latched STOP, including those whose
 * answers have since been cleared and safety-screen STOPs, and every recorded clearance.
 */
import { cleanEquipment } from './session';
import { SAFEGUARD_LABEL, UNCLASSIFIED_PROTECTIVE } from './engine';
import { FAMILIES } from './families';
import type { Equipment } from './oemReferences';
import type { DiagnosisRecord } from './jobCardRecord';
import { clearanceLine, LATCHED_STOP_PREFIX, latchedStopLine } from '@/lib/generator-oracle/service/maintenance';

/** Browser storage key for answers, latched STOPs and the clearance record. */
export const GD_STORE = 'eims-oracle-guided-diagnosis-v1';
/** Shown with every clearance and in the record (management acceptance condition). */
export const CLEARANCE_NOT_RESTART = 'Recording a clearance only removes this software STOP. It is NOT authorisation to restart the generator or return it to service: follow the applicable OEM procedure and have a qualified technician verify the set first. Clearances recorded here are UNVERIFIED: the person is not authenticated.';

/** `label`: the safeguard label shown under the STOP, when it has one (kept from 2026-11-26). */
export type StoredLatched = { key: string; message: string; from: string; since: string; label?: string };
export type StoredClearance = StoredLatched & { clearedAt: string; by: string; reason: string };
/**
 * Management decision (2026-11-25): when this browser blocks storage, the panel cannot read an
 * earlier unresolved STOP or keep a new one, so it shows a SAFETY HOLD. It is not a fault or
 * STOP condition of the machine. It withholds every running-engine / live instruction and the
 * Next-check prompt, exactly like a STOP hold, until an in-person reassessment by a qualified
 * technician is acknowledged. The acknowledgement lasts only for this page session: it is
 * kept in memory, never stored, and must be repeated after a reload.
 */
export const SAFETY_HOLD_TEXT = "SAFETY HOLD — Previous diagnostic safety status cannot be verified. Do not continue guided operational checks until the machine's condition has been reassessed by a qualified technician.";
export const SAFETY_HOLD_WHY = 'Why: this browser does not allow the safety record to be read or saved, so an earlier unresolved STOP for this machine cannot be ruled out. This hold is about the missing record, not a fault found on the machine.';
export const SAFETY_HOLD_ACK_LABEL = "A qualified technician has reassessed the machine's condition in person";
export const SAFETY_HOLD_SESSION_ONLY = 'This acknowledgement lasts only for this page session. It cannot be stored in this browser and must be repeated after a reload.';
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const validLatched = (x: unknown): x is StoredLatched => !!x && typeof x === 'object' && isStr((x as StoredLatched).key) && isStr((x as StoredLatched).message) && isStr((x as StoredLatched).from) && isStr((x as StoredLatched).since);
const validClearance = (x: unknown): x is StoredClearance => validLatched(x) && isStr((x as StoredClearance).clearedAt) && isStr((x as StoredClearance).by) && typeof (x as StoredClearance).reason === 'string';
export type StoreRead = { unreadable: boolean; blocked?: true; raw?: Record<string, Record<string, string>>; equipment?: Equipment; latched: StoredLatched[]; cleared: StoredClearance[] };
/** Reads the stored safety state. Any malformed part makes the whole record unreadable (never "cleared"). */
export function readStore(): StoreRead {
  let text: string | null = null;
  // `blocked`: the browser refused the read (storage blocked), as opposed to a record that was read but is malformed.
  try { text = localStorage.getItem(GD_STORE); } catch { return { unreadable: true, blocked: true, latched: [], cleared: [] }; }
  if (text === null) return { unreadable: false, latched: [], cleared: [] };
  try {
    const s = JSON.parse(text);
    // Every part must have the exact shape the panel writes (independent review L3d/L3f: a
    // clearance without clearedAt, or a non-text answer, crashed the panel and hid the STOP).
    const rawOk = s && s.raw && typeof s.raw === 'object' && !Array.isArray(s.raw)
      && Object.values(s.raw).every((fam) => fam && typeof fam === 'object' && !Array.isArray(fam) && Object.values(fam as object).every((v) => typeof v === 'string'));
    const ok = s && typeof s === 'object' && (s.v === 1 || s.v === 2) && rawOk
      && Array.isArray(s.latched) && s.latched.every(validLatched)
      && Array.isArray(s.cleared) && s.cleared.every((c: unknown) => validClearance({ reason: '', ...(c as object) }));
    if (!ok) return { unreadable: true, latched: [], cleared: [] };
    // Equipment (1.3.0) is read in the same read; unknown models and non-text values are dropped.
    return { unreadable: false, raw: s.raw, equipment: cleanEquipment(s), latched: s.latched, cleared: s.cleared.map((c: StoredClearance) => ({ ...c, reason: c.reason ?? '' })) };
  } catch { return { unreadable: true, latched: [], cleared: [] }; }
}
const sameStop = (a: StoredLatched, b: StoredLatched) => a.key === b.key && a.since === b.since;
/** Union of latched STOPs, minus only those with a recorded clearance for that exact STOP. */
export function mergeLatched(a: StoredLatched[], b: StoredLatched[], cleared: StoredClearance[]): StoredLatched[] {
  const out: StoredLatched[] = [];
  for (const l of [...a, ...b]) if (!out.some((x) => x.key === l.key) && !cleared.some((c) => sameStop(c, l))) out.push(l);
  return out;
}
export function mergeCleared(a: StoredClearance[], b: StoredClearance[]): StoredClearance[] {
  const out = [...a];
  for (const c of b) if (!out.some((x) => sameStop(x, c) && x.clearedAt === c.clearedAt)) out.push(c);
  return out;
}
export const UNREADABLE_STOP = (): StoredLatched => ({ key: 'storage|unreadable', from: 'stored safety record', since: new Date().toISOString(), message: 'The stored safety record in this browser could not be read or was altered, so earlier STOPs cannot be confirmed as cleared. Treat the set as stopped until a qualified technician has checked it.' });

/** Safeguard label for a STOP message: the one stored with it, else the one its rule carries. */
export function labelFor(l: StoredLatched): string | undefined {
  if (typeof l.label === 'string' && l.label.trim()) return l.label;
  if (l.message === UNCLASSIFIED_PROTECTIVE) return SAFEGUARD_LABEL;
  for (const f of FAMILIES) for (const r of f.stopRules) if (r.message === l.message && r.label) return r.label;
  return undefined;
}

/**
 * The job-card lines for the stored safety record: every latched STOP (with source tab, since
 * time, its wording and safeguard label), then every recorded clearance (UNVERIFIED). Blocked
 * storage gives the SAFETY HOLD; an unreadable record gives its STOP.
 */
export function latchRecordLines(s: StoreRead = readStore()): string[] {
  if (s.blocked) return [SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY];
  const out: string[] = [];
  for (const l of s.unreadable ? [UNREADABLE_STOP()] : s.latched) {
    out.push(latchedStopLine(l));
    const label = labelFor(l);
    if (label) out.push(label);
  }
  if (!s.unreadable) for (const c of s.cleared) out.push(clearanceLine(c));
  return out;
}

/** The guided record with the stored safety record first. A latched STOP (or the hold) makes it a STOP record. */
export function withLatchedStops(rec: DiagnosisRecord, lines: string[]): DiagnosisRecord {
  if (!lines.length) return rec;
  const active = lines.some((l) => l.startsWith(LATCHED_STOP_PREFIX) || l === SAFETY_HOLD_TEXT);
  return {
    ...rec,
    lines: [...lines, ...rec.lines],
    findings: [...lines, rec.findings].join('\n'),
    result: { ...rec.result, stopActive: rec.result.stopActive || active },
  };
}
