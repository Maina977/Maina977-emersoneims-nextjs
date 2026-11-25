'use client';

/**
 * Guided fault-finding (P1-A). Deterministic: lib/generator-oracle/diagnostics.
 * Stop rules are shown first and cannot be hidden; readings outside the
 * physical range are refused with the reason; machine limits come from the
 * OEM manual entered by the technician, never from defaults. Every OEM limit
 * asks whether it is a warning or a shutdown value and where it comes from;
 * equality with a limit counts as reaching it.
 *
 * Integration 2026-11-26: the oracle-diagnostics 1.3.0 engine, families, shared
 * safety screen, limit checks, published references and job-card record run
 * inside the production safety wrapper (STOP latch with recorded UNVERIFIED
 * clearance, SAFETY HOLD for blocked storage, cross-tab STOP hold, no checks or
 * actions suggested while a STOP or the hold applies).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { FAMILIES, familyFor } from '@/lib/generator-oracle/diagnostics/families';
import { diagnosisRecord, refQuestions } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { knownModels, publishedEntryOf, publishedLimitFor, questionReferenceNote, referencesFor, type Equipment } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { classKey, limitReadings, sourceKey, tolKey } from '@/lib/generator-oracle/diagnostics/engine';
import { mergedRaw, saveGuidedSession, type RawAnswers } from '@/lib/generator-oracle/diagnostics/session';
import { SCREEN_BUCKET, SCREEN_QUESTIONS, isScreenKey } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { LIMIT_CLASS_OPTIONS, type Question } from '@/lib/generator-oracle/diagnostics/types';

import {
  CLEARANCE_NOT_RESTART, GD_STORE, SAFETY_HOLD_ACK_LABEL, SAFETY_HOLD_SESSION_ONLY, SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY,
  UNREADABLE_STOP, guardedSessionRecord, mergeCleared, mergeLatched, readStore, sameStop,
} from '@/lib/generator-oracle/diagnostics/stopLatch';

// The STOP latch record lives in lib/generator-oracle/diagnostics/stopLatch.ts (moved unchanged,
// 2026-11-26) so the job-card screen reads the same record; re-exported here for existing imports.
export { CLEARANCE_NOT_RESTART, GD_STORE, SAFETY_HOLD_ACK_LABEL, SAFETY_HOLD_SESSION_ONLY, SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY, mergeCleared, mergeLatched, readStore };

/** Returns `prev` when `next` has the same items, so a state setter does not re-render for nothing. */
function keepSame<T>(prev: T[], next: T[]): T[] {
  return prev.length === next.length && prev.every((x, i) => x === next[i]) ? prev : next;
}
/** Latched STOPs raised by the shared safety screen are keyed once for all families. */
const SCREEN_FROM = 'Safety screen';

const getStore = (): Storage | null => { try { return window.localStorage; } catch { return null; } };
const field = 'w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white focus:border-amber-500 outline-none';

interface QProps {
  q: Question; values: Record<string, string>; set: (k: string, v: string) => void; scope: string;
  /** R-INT-4: a typed value is committed (and may then latch a STOP) on blur, Enter or a pause; a choice at once. */
  commit: () => void; typing: () => void;
  stopActive: boolean; note?: string; tolerance: boolean; protective: boolean;
  published: { value: number; classification: 'shutdown' | 'warning'; source: string } | null;
}

function QuestionInput({ q, values, set, scope, stopActive, note, tolerance, protective, published, commit, typing }: QProps) {
  const typed = (k: string) => ({
    onChange: (e: { target: { value: string } }) => { set(k, e.target.value); typing(); },
    onBlur: commit,
    onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') commit(); },
  });
  const chosen = (k: string) => (e: { target: { value: string } }) => { set(k, e.target.value); commit(); };
  const id = `gd-${scope}-${q.id.replace(/\./g, '-')}`;
  const value = values[q.id] ?? '';
  const limit = q.kind === 'number' ? q.oemLimit : undefined;
  return (
    <div className="block text-xs text-slate-300">
      <label htmlFor={id} className="block mb-1">
        {q.text}
        {q.kind === 'number' ? <span className="text-slate-500"> ({q.unit})</span> : null}
      </label>
      {q.kind === 'number' ? (
        <input id={id} inputMode="decimal" value={value} {...typed(q.id)} className={field} />
      ) : (
        <select id={id} value={value} onChange={chosen(q.id)} className={field}>
          <option value="">Not answered</option>
          {q.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {q.help ? <span className="block mt-1 text-slate-500">{q.help}</span> : null}
      {note ? <span className="block mt-1 text-cyan-300">{note}</span> : null}
      {q.needsRunning && stopActive ? <span className="block mt-1 text-red-300">Needs the engine running: do not run it to answer this while a STOP is active. Enter only what was seen before the stop.</span> : null}
      {limit ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="block">Is this a warning or a shutdown value?
            <select aria-label={`Classification: ${limit.parameter}`} value={values[classKey(q.id)] ?? ''} onChange={chosen(classKey(q.id))} className={`mt-1 ${field}`}>
              <option value="">Not answered (treated as not stated)</option>
              {LIMIT_CLASS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="block">Source: manual ID, revision, page
            <input aria-label={`Source: ${limit.parameter}`} value={values[sourceKey(q.id)] ?? ''} {...typed(sourceKey(q.id))} className={`mt-1 ${field}`} />
          </label>
          {value && (!values[classKey(q.id)] || values[classKey(q.id)] === 'not-stated') ? (
            <span className="sm:col-span-2 text-amber-300">{protective
              ? 'Classification not stated: this is a protective limit, so reaching it gives a conservative software STOP (not a manufacturer instruction) until a qualified technician confirms the manufacturer limits.'
              : 'Classification not stated: reaching this value is shown as CAUTION, not as a confirmed shutdown, and does not clear any STOP.'}</span>
          ) : null}
          {published ? (
            <button type="button" className="sm:col-span-2 rounded-md border border-cyan-600 px-2 py-1 text-left text-cyan-200"
              onClick={() => { set(q.id, String(published.value)); set(classKey(q.id), published.classification); set(sourceKey(q.id), published.source); commit(); }}>
              Use published value for the selected model: {published.value} {q.kind === 'number' ? q.unit : ''} ({published.classification}) — check the variant matches this set
            </button>
          ) : null}
        </div>
      ) : null}
      {tolerance && q.kind === 'number' ? (
        <label className="block mt-2">Measurement tolerance ± ({q.unit}; from the instrument or sensor data, optional)
          <input aria-label={`Tolerance: ${q.text}`} inputMode="decimal" value={values[tolKey(q.id)] ?? ''} {...typed(tolKey(q.id))} className={`mt-1 ${field}`} />
        </label>
      ) : null}
    </div>
  );
}

const LIMIT_LABEL = { 'not-verified': 'NOT VERIFIED', inside: 'INSIDE LIMIT', near: 'AT OR NEAR THE LIMIT', reached: 'LIMIT REACHED' } as const;

export default function GuidedDiagnosisPanel() {
  const [familyId, setFamilyId] = useState(FAMILIES[0].id);
  const [symptom, setSymptom] = useState('');
  const [raw, setRaw] = useState<RawAnswers>({});
  const [equipment, setEquipment] = useState<Equipment>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  // Set by the first change the technician makes; the job-card hand-off copy is written only after it.
  const dirty = useRef(false);
  const family = FAMILIES.find((f) => f.id === familyId)!;
  // This family's answers with the shared safety screen merged in (the screen is answered once for all families).
  const values = useMemo(() => mergedRaw(raw, familyId), [raw, familyId]);

  // Same function as the job-card record and the .txt download, so all three agree. It carries
  // STOPs raised on OTHER fault-family tabs (2026-11-25 safety hotfix, review R2/F3): they
  // apply to the same machine, are shown here too and hold every tab.
  const record = useMemo(() => diagnosisRecord(family, values, equipment, raw), [family, values, equipment, raw]);
  const result = record.result;
  const otherStops = result.stops.filter((s) => s.level === 'STOP' && s.origin === 'other-family');
  const ownStops = result.stops.filter((s) => !(s.level === 'STOP' && s.origin === 'other-family'));

  // STOP LATCH (2026-11-25 safety hotfix, management directive on STOP persistence): a STOP,
  // once shown, stays active across tab changes, reloads, changed or cleared answers and
  // less severe faults. It is cleared only by an explicit, recorded clearance, accepted only
  // when the entered answers no longer show the condition. Answers, latched STOPs and the
  // clearance record are kept in this browser (localStorage); if storage is unavailable the
  // panel says so.
  // Management acceptance conditions (2026-11-25): a browser-recorded clearance is UNVERIFIED
  // (the technician is not authenticated) and is never authorisation to restart; unreadable or
  // corrupted stored safety state is treated as a STOP, never as "cleared"; several open
  // windows are merged so a STOP is never dropped by another window's write.
  type Latched = { key: string; message: string; from: string; since: string; label?: string };
  type Clearance = Latched & { clearedAt: string; by: string; reason: string };
  const [latched, setLatched] = useState<Latched[]>([]);
  const [cleared, setCleared] = useState<Clearance[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [clearBy, setClearBy] = useState<Record<string, string>>({});
  const [clearWhy, setClearWhy] = useState<Record<string, string>>({});
  const [clearConfirm, setClearConfirm] = useState<Record<string, boolean>>({});
  const [clearErr, setClearErr] = useState<Record<string, string>>({});
  // Safety hold acknowledgement: page-session memory only (never written to storage).
  const [holdAck, setHoldAck] = useState<{ by: string; at: string } | null>(null);
  const [holdBy, setHoldBy] = useState('');
  const [holdConfirm, setHoldConfirm] = useState(false);
  const [holdErr, setHoldErr] = useState('');
  /**
   * Reads the stored record and merges it into the page: answers not yet on the page, the
   * clearance record and every latched STOP. Returns false only when the browser refused the
   * read (blocked storage); nothing is changed then. Setters keep the same value when nothing
   * new was read, so repeated reads (retries, focus, storage events) cause no extra renders.
   * Independent review of 4c2a6ee5 (MAJOR): if the first read failed but storage works later,
   * the stored record was never loaded and a latched STOP lost to the SAFETY HOLD. Every later
   * successful read now merges it, before the hold can be released.
   */
  // R-INT-4: what is committed (blur, Enter, a choice, a tab change, or a pause in typing) may latch a STOP.
  const [committed, setCommitted] = useState<RawAnswers>({});
  const [commitTick, setCommitTick] = useState(0);
  const pause = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commit = () => { if (pause.current) { clearTimeout(pause.current); pause.current = null; } setCommitTick((t) => t + 1); };
  /** While typing: a value left unchanged for 0.8 s is committed too. */
  const typing = () => { if (pause.current) clearTimeout(pause.current); pause.current = setTimeout(commit, 800); };
  useEffect(() => () => { if (pause.current) clearTimeout(pause.current); }, []);
  // The answers as they are when committed (same object as `raw` right after a commit).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setCommitted(raw); }, [commitTick, loaded]);
  // R-INT-5: the latest page state, for writing a STOP back when another window's write dropped it.
  const latest = useRef({ latched, cleared, raw, equipment, loaded });
  latest.current = { latched, cleared, raw, equipment, loaded };
  const readAndMerge = (): boolean => {
    const s = readStore();
    if (s.blocked) return false;
    if (s.unreadable) {
      // Never restore a supposedly cleared diagnosis from a record that cannot be read.
      setLatched((l) => keepSame(l, mergeLatched(l, [UNREADABLE_STOP()], [])));
      return true;
    }
    const raw0 = s.raw;
    if (raw0) setRaw((r) => (Object.keys(raw0).some((k) => !(k in r)) ? { ...raw0, ...r } : r));
    const eq0 = s.equipment;
    if (eq0 && Object.keys(eq0).length) setEquipment((e) => (Object.keys(e).length ? e : eq0));
    // Only when the read brings something new (no state update at all otherwise, so a retry every
    // 2 s never re-renders the panel, also right after a committed change).
    const now = latest.current;
    if (keepSame(now.cleared, mergeCleared(now.cleared, s.cleared)) !== now.cleared) setCleared((c) => keepSame(c, mergeCleared(c, s.cleared)));
    if (keepSame(now.latched, mergeLatched(now.latched, s.latched, s.cleared)) !== now.latched) setLatched((l) => keepSame(l, mergeLatched(l, s.latched, s.cleared)));
    // Answers merged in from the stored record are committed (they may latch); repeated reads that bring nothing new change nothing.
    if (raw0 && Object.keys(raw0).some((k) => !(k in latest.current.raw))) commit();
    // R-INT-5: if the stored record lacks a STOP (or a clearance) this page holds — another window
    // wrote an out-of-date record — write the merged record back now, so a reload cannot lose it.
    const cur = latest.current;
    if (cur.loaded) {
      const lostStop = cur.latched.some((l) => !s.latched.some((x) => x.key === l.key) && !s.cleared.some((c) => sameStop(c, l)));
      const lostClear = cur.cleared.some((c) => !s.cleared.some((x) => sameStop(x, c) && x.clearedAt === c.clearedAt));
      if (lostStop || lostClear) {
        const mergedCleared = mergeCleared(cur.cleared, s.cleared);
        const mergedLatched = mergeLatched(cur.latched, s.latched, mergedCleared);
        try {
          localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw: { ...(s.raw ?? {}), ...cur.raw }, equipment: cur.equipment, latched: mergedLatched, cleared: mergedCleared }));
        } catch { setStorageOk(false); }
      }
    }
    return true;
  };
  useEffect(() => {
    // Listeners are registered in every case, also when the first read is refused, so a record
    // that becomes readable later (or is written by another window) is always merged.
    const onStorage = (e: StorageEvent) => { if (e.key === GD_STORE || e.key === null) readAndMerge(); };
    const onFocus = () => { readAndMerge(); };
    const onVisible = () => { if (document.visibilityState === 'visible') readAndMerge(); };
    addEventListener('storage', onStorage);
    addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    if (!readAndMerge()) setStorageOk(false);
    setLoaded(true);
    return () => {
      removeEventListener('storage', onStorage);
      removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // While storage is not usable, keep retrying the read so a stored STOP is merged as soon as it can be read.
  useEffect(() => {
    if (storageOk) return;
    const t = setInterval(() => { readAndMerge(); }, 2000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageOk]);
  // Every STOP computed on any tab is latched. Safety-screen STOPs are shared by every family,
  // so they are latched once (from "Safety screen"), not once per family.
  const stopsOf = (answers: RawAnswers) => {
    const out: Array<{ key: string; message: string; from: string; label?: string }> = [];
    for (const f of FAMILIES) {
      for (const s of diagnosisRecord(f, mergedRaw(answers, f.id), equipment).result.stops) {
        if (s.level !== 'STOP' || s.origin === 'other-family') continue;
        // The safeguard label is latched with the STOP so the job card carries it (2026-11-26).
        const label = s.label ? { label: s.label } : {};
        const stop = s.origin === 'screen'
          ? { key: `${SCREEN_BUCKET}|${s.message}`, message: s.message, from: SCREEN_FROM, ...label }
          : { key: `${f.id}|${s.message}`, message: s.message, from: f.title, ...label };
        if (!out.some((x) => x.key === stop.key)) out.push(stop);
      }
    }
    return out;
  };
  // STOPs shown by the answers on screen now (also while typing) ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liveNow = useMemo(() => stopsOf(raw), [raw, equipment]);
  // ... and the STOPs that latch: from the committed answers only (R-INT-4), so typing 160 against a
  // 150 kPa minimum does not latch "1" or "16". A committed value at or beyond a limit latches as before.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liveStops = useMemo(() => (committed === raw ? liveNow : stopsOf(committed)), [committed, raw, liveNow, equipment]);
  useEffect(() => {
    if (!loaded) return;
    const add = liveStops.filter((s) => !latched.some((l) => l.key === s.key));
    if (add.length) setLatched((l) => [...l, ...add.map((s) => ({ ...s, since: new Date().toISOString() }))]);
  }, [liveStops, loaded, latched]);
  useEffect(() => {
    if (!loaded) return;
    try {
      // Merge with what another window may have stored: a STOP is never dropped by a write.
      const s = readStore();
      // If the stored record cannot be read, do not write: writing now would overwrite (and so
      // drop) STOPs stored earlier that this page has not been able to read.
      if (s.blocked) { setStorageOk(false); return; }
      const mergedCleared = mergeCleared(cleared, s.unreadable ? [] : s.cleared);
      const mergedLatched = mergeLatched(latched, s.unreadable ? [] : s.latched, mergedCleared);
      // A successful read here also brings stored STOPs onto THIS page (review of 4c2a6ee5):
      // a STOP kept in storage must never be kept there but missing from the screen.
      if (!s.blocked) {
        const incoming = s.unreadable ? [UNREADABLE_STOP()] : s.latched;
        setLatched((l) => keepSame(l, mergeLatched(l, incoming, s.unreadable ? [] : mergedCleared)));
        if (!s.unreadable) setCleared((c) => keepSame(c, mergeCleared(c, s.cleared)));
      }
      localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw, equipment, latched: mergedLatched, cleared: mergedCleared }));
    } catch { setStorageOk(false); }
  }, [raw, equipment, latched, cleared, loaded]);
  // Job-card hand-off (1.3.0): the answers are also kept under the guided-session key, which the
  // Service & Job Cards screen reads to record the same diagnosis on a card.
  useEffect(() => { if (dirty.current) setSaveError(saveGuidedSession(getStore(), raw, equipment)); }, [raw, equipment]);
  const recordClearance = (l: Latched) => {
    if (liveNow.some((s) => s.key === l.key) || liveStops.some((s) => s.key === l.key)) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: the answers entered still show this condition. Complete the required checks and update the answers first.' })); return; }
    const by = (clearBy[l.key] ?? '').trim();
    if (!by) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: enter the name or initials of the qualified technician recording the clearance.' })); return; }
    const reason = (clearWhy[l.key] ?? '').trim();
    if (reason.length < 10) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: state what was found and what was done (at least 10 characters).' })); return; }
    if (!clearConfirm[l.key]) { setClearErr((e) => ({ ...e, [l.key]: 'Not cleared: confirm that the required checks were completed.' })); return; }
    setCleared((c) => [...c, { ...l, clearedAt: new Date().toISOString(), by: by.slice(0, 60), reason: reason.slice(0, 500) }]);
    setLatched((ls) => ls.filter((x) => x.key !== l.key));
    setClearErr((e) => ({ ...e, [l.key]: '' }));
  };

  const set = (q: string, v: string) => {
    dirty.current = true;
    const bucket = isScreenKey(q) ? SCREEN_BUCKET : familyId;
    setRaw((r) => ({ ...r, [bucket]: { ...(r[bucket] ?? {}), [q]: v } }));
  };
  const setEq = (k: keyof Equipment, v: string) => {
    dirty.current = true;
    commit();
    setEquipment((e) => ({ ...e, [k]: v || undefined }));
    // Safety review F7: a published model-specific limit is cleared as soon as the equipment changes.
    setRaw((r) => {
      const next: RawAnswers = {};
      for (const [fid, ans] of Object.entries(r)) {
        const a = { ...ans };
        for (const key of Object.keys(a)) {
          if (!key.endsWith('.source') || !publishedEntryOf(a[key])) continue;
          const lim = key.slice(0, -'.source'.length);
          delete a[key]; delete a[lim]; delete a[`${lim}.class`];
        }
        next[fid] = a;
      }
      return next;
    });
  };
  const oemQs = useMemo(() => refQuestions(family), [family]);
  const readingsWithTol = useMemo(() => limitReadings(family), [family]);
  const familyRefs = referencesFor(equipment, family.id);

  const route = () => { const f = familyFor(symptom); if (f) { commit(); setFamilyId(f.id); } };
  const routed = symptom.trim() ? familyFor(symptom) : null;
  const next = result.nextQuestion;
  // Safety hotfix (2026-11-25, independent review F1): while a STOP applies, no further
  // check or action is suggested. Several suggested checks need the engine running,
  // cranking or live circuits (e.g. a cylinder cut-out test under "STOP THE SET"), which
  // contradicts the STOP. Causes stay listed for information only.
  // Active = any STOP computed now (on any tab) or any latched STOP not yet cleared by record.
  const stopActive = result.stopActive || latched.length > 0;
  // Latched STOPs whose condition is no longer computed are still shown (they are not cleared).
  const latchedOnly = latched.filter((l) => !liveNow.some((s) => s.key === l.key));
  // Blocked storage: SAFETY HOLD until an in-person reassessment is acknowledged for this page session.
  const safetyHold = loaded && !storageOk && !holdAck;
  // Instructions are withheld under a STOP, under a safety hold, and until the stored record has been checked.
  const withheld = stopActive || safetyHold || !loaded;
  const acknowledgeHold = () => {
    const by = holdBy.trim();
    if (!holdConfirm) { setHoldErr('Not released: confirm that a qualified technician has reassessed the machine in person.'); return; }
    if (!by) { setHoldErr('Not released: enter the name or initials of the qualified technician.'); return; }
    // Re-read first: any STOP stored in this browser that can be read now is merged before
    // anything is released, and then shows as a STOP (a real STOP always wins over the hold).
    readAndMerge();
    setHoldAck({ by: by.slice(0, 60), at: new Date().toISOString() });
    setHoldErr('');
  };
  const STOP_HOLD = 'Further checks are withheld while a STOP applies. Make the set safe first: engine stopped, isolated and locked off. A qualified technician decides the next step once the hazard is controlled.';

  const qProps = (q: Question, scope: string): QProps => ({
    q, values, set, scope, stopActive, commit, typing, tolerance: readingsWithTol.has(q.id),
    protective: (family.limits ?? []).some((l) => l.limit === q.id && l.protective),
    note: oemQs.has(q.id) ? questionReferenceNote(equipment, family.id, q.id) : undefined,
    published: oemQs.has(q.id) ? publishedLimitFor(equipment, family.id, q.id) : null,
  });
  // The download carries, first, every latched STOP (also those the answers no longer show) and
  // every recorded clearance, in the same lines as the job card; then the 1.3.0 record.
  // R-INT-1: uncleared latched STOPs and the SAFETY HOLD go to the engine as external STOPs, so the
  // download carries no running check and no running-only Next check under a latch or the hold.
  const downloadText = () => guardedSessionRecord(family, raw, equipment, { latched, cleared, hold: !storageOk }).record.findings;
  const download = () => {
    const url = URL.createObjectURL(new Blob([`${downloadText()}\n`], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = `guided-diagnosis-${family.id}.txt`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
        <h3 className="text-lg font-semibold text-amber-300">Guided Diagnosis</h3>
        <p className="text-xs text-slate-400">Answer what you have measured or seen. The list re-ranks after each answer and suggests the next check. Safety stops always show first.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input aria-label="Describe the symptom" placeholder="Describe the symptom, e.g. cranks but will not start" value={symptom}
            onChange={(e) => setSymptom(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && route()}
            className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm text-white" />
          <button type="button" onClick={route} className="rounded-md bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-sm font-medium text-white">Find fault family</button>
        </div>
        {symptom.trim() && !routed ? <p className="text-xs text-slate-400">No matching fault family; choose one below.</p> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-xs text-slate-300">Engine model (for published references; optional)
            <select value={equipment.engine ?? ''} onChange={(e) => setEq('engine', e.target.value)} className={`mt-1 ${field}`}>
              <option value="">Not listed / not selected</option>
              {knownModels('engine').map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="block text-xs text-slate-300">Controller model (for published references; optional)
            <select value={equipment.controller ?? ''} onChange={(e) => setEq('controller', e.target.value)} className={`mt-1 ${field}`}>
              <option value="">Not listed / not selected</option>
              {knownModels('controller').map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {([['manufacturer', 'Manufacturer (as on the plate)'], ['model', 'Model (as on the plate)'], ['variant', 'Variant / configuration']] as const).map(([k, label]) => (
            <label key={k} className="block text-xs text-slate-300">{label}
              <input value={equipment[k] ?? ''} onChange={(e) => setEq(k, e.target.value)} className={`mt-1 ${field}`} />
            </label>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">Published figures are shown only for the exact model selected. They are never entered for you: type and confirm every limit for the set in front of you, or press “Use published value” for that exact model. Any other model: per OEM manual — NOT VERIFIED. Every limit you enter is recorded as applying only to the manufacturer, model and variant typed here.</p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Fault family">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={f.id === familyId} onClick={() => { commit(); setFamilyId(f.id); }}
              className={`rounded-full px-3 py-1 text-xs border ${f.id === familyId ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}>
              {f.title}
            </button>
          ))}
        </div>
      </div>

      <div data-testid="safety-screen" className="rounded-xl border border-red-700/60 bg-red-950/20 p-4 space-y-2">
        <div className="text-sm font-semibold text-red-200">Safety screen — answered once, applies to every fault family</div>
        <p className="text-xs text-slate-400">Any “Yes” is a STOP on every tab and on every job card made from this session.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SCREEN_QUESTIONS.map((q) => <QuestionInput key={q.id} {...qProps(q, 'screen')} />)}
        </div>
        <button type="button" onClick={() => { dirty.current = true; setRaw((r) => ({ ...r, [SCREEN_BUCKET]: {} })); commit(); }} className="text-xs text-slate-400 underline">Clear safety screen</button>
      </div>

      {!storageOk && !stopActive && holdAck ? (
        <p data-testid="gd-storage-blocked" role="status" className="rounded-lg border border-amber-500/60 bg-amber-950/40 p-3 text-xs text-amber-100">
          This browser does not allow the safety record to be saved: a STOP shown here cannot be kept after a reload. Record any STOP on the job card.
        </p>
      ) : null}
      {(result.stops.length > 0 || latched.length > 0) && (
        <div role="alert" data-testid="safety-messages" className="space-y-2">
          {latchedOnly.map((l) => (
            <div key={`l${l.key}`} data-testid="gd-latched-stop" className="rounded-lg border p-3 text-sm border-red-500 bg-red-950/60 text-red-100">
              <strong>STOP (still active until a clearance is recorded)</strong> · (from the {l.from} tab, since {l.since.slice(0, 16).replace('T', ' ')} UTC) {l.message}
            </div>
          ))}
          {ownStops.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 text-sm ${s.level === 'STOP' ? 'border-red-500 bg-red-950/60 text-red-100' : 'border-amber-500/60 bg-amber-950/40 text-amber-100'}`}>
              <strong>{s.level}</strong> · {s.message}
              {s.label ? <p className="mt-1 text-xs italic opacity-90">{s.label}</p> : null}
            </div>
          ))}
          {otherStops.map((s, i) => (
            <div key={`o${i}`} className="rounded-lg border p-3 text-sm border-red-500 bg-red-950/60 text-red-100">
              <strong>STOP</strong> · (from the {s.from} tab) {s.message}
              {s.label ? <p className="mt-1 text-xs italic opacity-90">{s.label}</p> : null}
              <p className="mt-1 text-xs opacity-80">Raised in the “{s.from}” diagnosis of this session.</p>
            </div>
          ))}
        </div>
      )}

      {result.limits.length > 0 && (
        <div data-testid="limit-status" className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">Limit checks (equality counts as reaching the limit)</div>
          <ul className="space-y-1">
            {result.limits.map((l) => (
              <li key={l.id} className={l.level === 'STOP' ? 'text-red-200' : l.level === 'CAUTION' ? 'text-amber-200' : 'text-slate-300'}>
                <strong>{LIMIT_LABEL[l.status]}{l.status === 'reached' && l.level ? ` (${l.level})` : ''}</strong> · {l.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          {stopActive ? (
            <div data-testid="gd-stop-hold" className="rounded-lg border border-red-500 bg-red-950/60 p-3 text-xs text-red-100 space-y-3">
              <p>{STOP_HOLD}</p>
              {!storageOk ? <p data-testid="gd-storage-warning">This browser cannot keep the STOP after a reload: record it on the job card.</p> : null}
              {latched.map((l) => (
                <div key={`c${l.key}`} className="rounded-md border border-red-400/50 p-2 space-y-1" data-testid="gd-clearance">
                  <p className="font-semibold">Record STOP clearance: {l.from}</p>
                  <p data-testid="gd-not-restart">{CLEARANCE_NOT_RESTART}</p>
                  <label className="block">Name or initials of the qualified technician
                    <input value={clearBy[l.key] ?? ''} onChange={(e) => setClearBy((b) => ({ ...b, [l.key]: e.target.value }))}
                      className="mt-1 w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white" />
                  </label>
                  <label className="block">Clearance reason: what was found and what was done
                    <textarea value={clearWhy[l.key] ?? ''} onChange={(e) => setClearWhy((b) => ({ ...b, [l.key]: e.target.value }))} rows={2}
                      className="mt-1 w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white" />
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={!!clearConfirm[l.key]} onChange={(e) => setClearConfirm((c) => ({ ...c, [l.key]: e.target.checked }))} />
                    <span>The required checks for this STOP were completed. I understand this does not authorise restarting the generator.</span>
                  </label>
                  <button type="button" onClick={() => recordClearance(l)} className="rounded bg-red-700 px-2 py-1 text-white">Record STOP clearance</button>
                  {clearErr[l.key] ? <p role="status" className="text-red-200">{clearErr[l.key]}</p> : null}
                </div>
              ))}
            </div>
          ) : safetyHold ? (
            <div data-testid="gd-safety-hold" role="alert" className="rounded-lg border border-amber-500 bg-amber-950/60 p-3 text-xs text-amber-100 space-y-3">
              <p className="text-sm font-semibold">{SAFETY_HOLD_TEXT}</p>
              <p data-testid="gd-safety-hold-why">{SAFETY_HOLD_WHY}</p>
              <p>No further checks are suggested while this hold applies. Do not take any reading that needs the engine running, cranking or live circuits.</p>
              <div className="rounded-md border border-amber-400/50 p-2 space-y-1" data-testid="gd-safety-hold-ack">
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={holdConfirm} onChange={(e) => setHoldConfirm(e.target.checked)} />
                  <span>{SAFETY_HOLD_ACK_LABEL}</span>
                </label>
                <label className="block">Name or initials of the qualified technician
                  <input value={holdBy} onChange={(e) => setHoldBy(e.target.value)}
                    className="mt-1 w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white" />
                </label>
                <p>{SAFETY_HOLD_SESSION_ONLY}</p>
                <button type="button" onClick={acknowledgeHold} className="rounded bg-amber-700 px-2 py-1 text-white">Record reassessment for this page session</button>
                {holdErr ? <p role="status" className="text-amber-200">{holdErr}</p> : null}
              </div>
            </div>
          ) : !loaded ? (
            <p className="text-xs text-slate-400">Checking this browser's safety record…</p>
          ) : next ? (
            <div data-testid="next-check" className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <div className="text-xs text-amber-300 mb-2">Next check</div>
              <QuestionInput {...qProps(next, 'next')} />
            </div>
          ) : <p data-testid="next-check" className="text-xs text-slate-400">All questions answered.</p>}
          {!withheld && result.runningWithheld ? <p className="text-xs text-red-300">Checks that need the engine running are withheld because a leading cause says do not run.</p> : null}
          {holdAck && !storageOk ? <p data-testid="gd-safety-hold-released" className="text-xs text-amber-200">Safety hold released for this page session only: in-person reassessment recorded by {holdAck.by} (typed name, UNVERIFIED, not stored).</p> : null}
          {result.invalid.map((i) => <p key={i.q} className="text-xs text-red-300">Refused: {i.reason}</p>)}
          <details>
            <summary className="cursor-pointer text-xs text-slate-300">All questions ({result.answered}/{family.questions.length} answered, safety screen included){withheld ? ': only to correct an answer already entered' : ''}</summary>
            {stopActive ? <p data-testid="gd-stop-questions-warning" className="mt-2 text-xs text-red-200">A STOP applies: do not take any reading that needs the engine running, cranking or live circuits.</p> : null}
            {!stopActive && safetyHold ? <p data-testid="gd-hold-questions-warning" className="mt-2 text-xs text-amber-200">A safety hold applies: do not take any reading that needs the engine running, cranking or live circuits.</p> : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {family.questions.filter((q) => !isScreenKey(q.id)).map((q) => <QuestionInput key={q.id} {...qProps(q, 'all')} />)}
            </div>
          </details>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { dirty.current = true; setRaw((r) => ({ ...r, [familyId]: {} })); commit(); }} className="text-xs text-slate-400 underline">Clear answers</button>
            <button type="button" onClick={download} className="text-xs text-amber-300 underline">Download this diagnosis (.txt)</button>
          </div>
          <p className="text-[11px] text-slate-500">To record it on a job card: Service &amp; Job Cards → Job cards → open the card → “Record a guided diagnosis”. The card gets this result, and first every STOP latched here (also one the answers no longer show) and every recorded clearance (UNVERIFIED).</p>
          {saveError ? <p className="text-xs text-amber-300">{saveError}</p> : null}
        </div>

        <div data-testid="ranked-causes" className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
          <div className="text-xs text-slate-400">Likely causes, most supported first{stopActive ? <span> (for information only: no checks are suggested while a STOP applies)</span> : safetyHold ? <span> (for information only: no checks are suggested while the safety hold applies)</span> : null}</div>
          <ol className="space-y-2">
            {result.ranked.map((c, i) => (
              <li key={c.id} className="rounded-lg border border-slate-700 p-3">
                <div className="flex justify-between gap-2 text-sm text-white"><span>{i + 1}. {c.title}</span><span className="text-slate-500 text-xs">evidence {c.score >= 0 ? '+' : ''}{c.score}</span></div>
                {c.for.length > 0 && <ul className="mt-1 text-xs text-emerald-300">{c.for.map((f) => <li key={f}>+ {f}</li>)}</ul>}
                {c.against.length > 0 && <ul className="mt-1 text-xs text-slate-400">{c.against.map((f) => <li key={f}>− {f}</li>)}</ul>}
                {!withheld && i < 3 && c.score > 0 && (
                  <ul className="mt-2 list-disc pl-4 text-xs text-slate-200">{c.actions.map((a) => <li key={a}>{a}</li>)}</ul>
                )}
                {!withheld && i < 3 && c.score > 0 && c.withheld.length > 0 && (
                  <p className="mt-1 text-xs text-red-300">Withheld because a leading cause says do not run: {c.withheld.length} check(s) that need the engine running.</p>
                )}
                <p className="mt-1 text-[11px] text-slate-500">{c.reference}</p>
              </li>
            ))}
          </ol>
          {result.excluded.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs text-slate-400">Ruled out ({result.excluded.length})</summary>
              <ul className="mt-2 text-xs text-slate-400">{result.excluded.map((e) => <li key={e.id}>{e.title}: {e.because}</li>)}</ul>
            </details>
          )}
        </div>
      </div>
      {familyRefs.length > 0 && (
        <div data-testid="published-references" className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-3 text-xs text-cyan-100 space-y-1">
          <div className="font-semibold">Published references for the selected equipment (context only; used as a limit only when you press “Use published value”)</div>
          <ul className="list-disc pl-4 space-y-1">{familyRefs.map((r) => <li key={r.entry.id}>{r.text}</li>)}</ul>
        </div>
      )}
      {family.references?.length ? (
        <ul className="text-[11px] text-slate-500 list-disc pl-4">{family.references.map((r) => <li key={r}>{r}</li>)}</ul>
      ) : null}
      {cleared.length > 0 && (
        <details data-testid="gd-clearance-record" className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
          <summary className="cursor-pointer">STOP clearance record ({cleared.length}), UNVERIFIED, kept in this browser only</summary>
          <p className="mt-2 text-amber-200">{CLEARANCE_NOT_RESTART}</p>
          <ul className="mt-2 space-y-1">{cleared.map((c, i) => <li key={i}>UNVERIFIED · {c.clearedAt.slice(0, 16).replace('T', ' ')} UTC · recorded by {c.by} (not authenticated) · fault: {c.from}: {c.message} · reason: {c.reason || '(not recorded)'}</li>)}</ul>
        </details>
      )}
      <p className="text-[11px] text-slate-500">{result.disclaimer} Content status: {result.review}. {result.engineVersion}.</p>
    </div>
  );
}
