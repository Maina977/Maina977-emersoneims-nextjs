// @vitest-environment jsdom
/**
 * F10-R3 (2026-11-26): "readings not taken — STOP in force" is a STRUCTURED technician action on the
 * job card. The old free-text phrase satisfies nothing, and no generated text contains it (a generated
 * line containing it used to self-certify "STOP in force"). TEST values only.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { SCREEN_RULES } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { SAFEGUARD_LABEL, UNCLASSIFIED_PROTECTIVE } from '@/lib/generator-oracle/diagnostics/engine';
import { REFUSED_UNIT_ALL, REFUSED_UNIT_SOME, refusedHoldKey, refusedHoldText, refusedProtectiveText } from '@/lib/generator-oracle/diagnostics/refusedProtective';
import { CLEARANCE_NOT_RESTART, SAFETY_HOLD_ACK_LABEL, SAFETY_HOLD_SESSION_ONLY, SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY, latchRecordLines } from '@/lib/generator-oracle/diagnostics/stopLatch';
import {
  DEVICE_ONLY_NOTICE, HOLD_REASSESSMENT_LABEL, HOLD_REASSESSMENT_NOTICE, IMPORTED_NOTICE, NOT_TAKEN_PROMPT, READINGS_NOT_TAKEN_STOP,
  SIGNED_OFF_ELSEWHERE, STOP_NOT_CARRIED_NOTICE, TYPED_NAMES_NOTICE, TYPED_SIGNOFF_NOTICE, jobCardReport, latchedStopLine,
  recordsStopInForce, signOffSummary, transition, type Asset, type GuidedSafetyAdd, type JobCard,
} from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import { apply, emptyState, importState, serialise, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

const PHRASE = READINGS_NOT_TAKEN_STOP;
const hasPhrase = (t: string) => t.toLowerCase().includes(PHRASE.toLowerCase());
type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (card: JobCard, asset: Asset) => {
  const doc = await pdfjs.getDocument({ data: jobCardToPdf(card, asset).slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + ' ';
  return t.replace(/\s+/g, ' ');
};

const T0 = '2026-11-26T08:00:00.000Z';
const T1 = '2026-11-26T09:00:00.000Z';
const T2 = '2026-11-26T10:00:00.000Z';
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: { make: 'TEST', model: 'T', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 } } as ServiceAction),
  { type: 'openCard', card: { id: 'JC-1', assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST', technician: 'TECH-A' } } as ServiceAction);
const completeErr = (s: ServiceState, findings: string, readings = true) => {
  const a = apply(s, { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: T2 } as ServiceAction);
  if (a.error) return a.error;
  return apply(a.state, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: T2, update: { findings, tasks: ['TEST'], engineHoursAtJob: 1, readings: readings && !recordsStopInForce(a.state.jobCards[0]) ? [{ name: 'TEST', value: 1, unit: 'V' }, { name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }] : [] } } as ServiceAction).error;
};
const STOP = { key: 'knock-seizure|STOP THE SET: TEST', from: 'Knocking, bearing noise or seizure', since: T0, message: 'STOP THE SET: TEST' };
const HOLDKEY = refusedHoldKey('low-oil-pressure', 'oilPressure');
const RHOLD = { key: HOLDKEY, from: 'Low oil pressure / oil starvation', since: T0, message: refusedHoldText('Oil pressure measured'), label: SAFEGUARD_LABEL };
const rec = (s: ServiceState, add: GuidedSafetyAdd, at = T0) => go(s, { type: 'recordGuidedSafety', cardId: 'JC-1', at, safety: add } as ServiceAction);
const PHRASES = [PHRASE, PHRASE.toLowerCase(), `Done. ${PHRASE}.`, `TEST pasted:\n${PHRASE}\n`];

/** Cards with every kind of STOP or hold the job card can carry. */
const cards = (): Array<[string, ServiceState]> => {
  const latched = rec(base(), { stops: [STOP], clearances: [], hold: null });
  const refused = rec(base(), { stops: [RHOLD], clearances: [], hold: null });
  const refusedInput = rec(base(), { stops: [{ key: `low-oil-pressure|${REFUSED_UNIT_SOME}`, from: 'Low oil pressure / oil starvation', since: T0, message: REFUSED_UNIT_SOME, label: SAFEGUARD_LABEL, fromRecord: true, refusedInput: true, fields: ['oilPressure'] }], clearances: [], hold: null, family: 'low-oil-pressure', validFields: [] });
  const hold = rec(base(), { stops: [], clearances: [], hold: { text: SAFETY_HOLD_TEXT, why: SAFETY_HOLD_WHY } });
  const cleared = rec(latched, { stops: [], clearances: [{ ...STOP, clearedAt: T1, by: 'JK', reason: 'TEST cleared' }], hold: null }, T1);
  const auto = rec(refused, { stops: [], clearances: [{ ...RHOLD, clearedAt: T1, by: 'automatic', reason: '', automatic: true, field: 'Oil pressure measured', entered: '300 kPa', canonical: '300 kPa' }], hold: null }, T1);
  const r = importState(serialise(latched), T1); if (!r.ok) throw new Error(r.error);
  const notTaken = go(latched, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: true } as ServiceAction);
  const reassessed = go(hold, { type: 'recordHoldReassessment', cardId: 'JC-1', at: T1, by: 'JK', reason: 'Checked in person on site', confirmed: true } as ServiceAction);
  return [['latched', latched], ['refused-value hold', refused], ['refused input', refusedInput], ['SAFETY HOLD', hold], ['cleared', cleared], ['automatic release', auto], ['imported', r.state], ['action recorded', notTaken], ['reassessed', reassessed]];
};

describe('F10-R3: no generated text contains the old phrase', () => {
  it('STOP, hold, notice, refused-value and blocker strings', () => {
    const strings = [
      ...FAMILIES.flatMap((f) => [...f.stopRules.map((r) => r.message), ...(f.mandatorySafety ?? []), ...(f.limits ?? []).flatMap((l) => [l.shutdown, l.warning])]),
      ...SCREEN_RULES.map((r) => r.message), UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL,
      REFUSED_UNIT_ALL, REFUSED_UNIT_SOME, refusedProtectiveText('X'), refusedHoldText('X'),
      SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY, SAFETY_HOLD_ACK_LABEL, SAFETY_HOLD_SESSION_ONLY, CLEARANCE_NOT_RESTART,
      DEVICE_ONLY_NOTICE, IMPORTED_NOTICE, STOP_NOT_CARRIED_NOTICE, TYPED_NAMES_NOTICE, TYPED_SIGNOFF_NOTICE, HOLD_REASSESSMENT_LABEL, HOLD_REASSESSMENT_NOTICE, SIGNED_OFF_ELSEWHERE, NOT_TAKEN_PROMPT,
      latchedStopLine(RHOLD), ...latchRecordLines({ unreadable: false, latched: [RHOLD], cleared: [] }), ...latchRecordLines({ unreadable: true, blocked: true, latched: [], cleared: [] }),
    ];
    for (const t of strings) expect(hasPhrase(String(t)), String(t)).toBe(false);
    // Blocker messages of every kind.
    for (const [name, s] of cards()) {
      const e = completeErr(s, 'TEST', false) ?? '';
      expect(hasPhrase(e), `${name}: ${e}`).toBe(false);
    }
  });
  it('the .txt, sign-off summary and PDF of cards with every kind of STOP or hold', async () => {
    for (const [name, s] of cards()) {
      const c = s.jobCards[0];
      expect(hasPhrase(jobCardReport(c, s.assets[0])), name).toBe(false);
      expect(hasPhrase(signOffSummary(c).join('\n')), name).toBe(false);
      expect(hasPhrase(await pdfText(c, s.assets[0])), name).toBe(false);
      expect(hasPhrase(c.findings), name).toBe(false);
    }
  }, 120_000);
  it('product source: only the constant itself spells the phrase', () => {
    const files = ['lib/generator-oracle/service/maintenance.ts', 'lib/generator-oracle/service/store.ts', 'lib/generator-oracle/service/jobCardPdf.ts', 'lib/generator-oracle/diagnostics/stopLatch.ts', 'lib/generator-oracle/diagnostics/refusedProtective.ts', 'lib/generator-oracle/diagnostics/jobCardRecord.ts', 'components/generator-oracle/panels/GuidedDiagnosisPanel.tsx', 'components/generator-oracle/panels/ServiceManagementPanel.tsx'];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      const hits = src.split('\n').filter((l) => hasPhrase(l));
      expect(hits.filter((l) => !/export const READINGS_NOT_TAKEN_STOP = /.test(l)), f).toEqual([]);
      expect(src.split('\n').filter((l) => /READINGS_NOT_TAKEN_STOP/.test(l) && !/export const READINGS_NOT_TAKEN_STOP = /.test(l)), f).toEqual([]);
    }
  });
});

describe('F10-R3: the phrase in the findings (typed or pasted) unblocks nothing; the structured action does', () => {
  it('latched STOP, refused-value hold, refused input, SAFETY HOLD: still blocked with the phrase; completes with the recorded action', () => {
    for (const [name, s] of cards().filter(([n]) => ['latched', 'refused-value hold', 'refused input', 'SAFETY HOLD'].includes(n))) {
      for (const p of PHRASES) {
        expect(completeErr(s, `TEST ${p}`), `${name} / ${p}`).not.toBeNull();
        expect(recordsStopInForce({ findings: p }), p).toBe(false);
      }
      const done = go(s, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: true } as ServiceAction);
      expect(completeErr(done, 'TEST'), name).toBeNull();
      expect(completeErr(done, 'TEST', false), `${name}: no readings`).toBeNull();
    }
  });
  it('no readings: the phrase does not replace test-run readings', () => {
    for (const p of PHRASES) expect(completeErr(base(), `TEST ${p}`, false)).toMatch(/test-run readings/);
  });
  it('the action needs a typed name and confirmation; it is append-only, in the hash, and printed', () => {
    const s = base();
    expect(apply(s, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: '', confirmed: true } as ServiceAction).error).toMatch(/name or initials/);
    expect(apply(s, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: false } as ServiceAction).error).toMatch(/confirm/);
    const a = go(s, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: true } as ServiceAction);
    const b = go(a, { type: 'recordNotTaken', cardId: 'JC-1', at: T2, by: 'TECH-B', confirmed: true } as ServiceAction);
    expect(b.jobCards[0].guidedSafety!.notTaken!.map((e) => e.by)).toEqual(['TECH-A', 'TECH-B']);
    // A card edit cannot remove it.
    const edited = go(b, { type: 'updateCard', cardId: 'JC-1', update: { findings: 'x', guidedSafety: { stops: [], clearances: [], holds: [] } } as never } as ServiceAction);
    expect(edited.jobCards[0].guidedSafety!.notTaken).toHaveLength(2);
    const txt = jobCardReport(b.jobCards[0], b.assets[0]);
    expect(txt).toMatch(/Recorded: readings not taken — STOP in force — by TECH-A \(typed name, UNVERIFIED\)/);
  });
  it('imported card: an action in the file does not count; the fresh-record rule is not waived by the phrase', () => {
    const latched = go(rec(base(), { stops: [STOP], clearances: [], hold: null }), { type: 'recordNotTaken', cardId: 'JC-1', at: T0, by: 'OTHER', confirmed: true } as ServiceAction);
    const r = importState(serialise(latched), T1); if (!r.ok) throw new Error(r.error);
    let s = go(r.state, { type: 'recordHoldReassessment', cardId: 'JC-1', at: T2, by: 'JK', reason: 'Checked in person on site', confirmed: true } as ServiceAction);
    expect(completeErr(s, `TEST ${PHRASE}`)).toMatch(/still latched|fresh Guided Diagnosis record/);
    s = go(s, { type: 'recordNotTaken', cardId: 'JC-1', at: T2, by: 'TECH-B', confirmed: true } as ServiceAction);
    expect(completeErr(s, 'TEST')).toBeNull();
    expect(jobCardReport(s.jobCards[0], s.assets[0])).toMatch(/by OTHER \(typed name, UNVERIFIED\) at \S+ \(UTC\)\. No test-run readings were taken\. IMPORTED — not counted on this device\./);
  });
});

describe('F10-R3 MINOR: the action and test-run readings cannot both be on one card', () => {
  const READ = [{ name: 'TEST oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }];
  it('recording the action on a card that has readings is refused, with what to do', () => {
    const withReadings = go(base(), { type: 'updateCard', cardId: 'JC-1', update: { readings: READ } } as ServiceAction);
    const r = apply(withReadings, { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: true } as ServiceAction);
    expect(r.error).toMatch(/Not recorded: this card has 1 test-run reading\(s\)\. Remove them first if no test run was done, or do not record "readings not taken — STOP in force"/);
  });
  it('adding readings after the action is refused (card edit and completion update alike)', () => {
    const marked = go(base(), { type: 'recordNotTaken', cardId: 'JC-1', at: T1, by: 'TECH-A', confirmed: true } as ServiceAction);
    expect(apply(marked, { type: 'updateCard', cardId: 'JC-1', update: { readings: READ } } as ServiceAction).error).toMatch(/Readings refused: "readings not taken — STOP in force" is recorded on this card/);
    const inProgress = go(marked, { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: T2 } as ServiceAction);
    expect(apply(inProgress, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: T2, update: { findings: 'TEST', tasks: ['TEST'], engineHoursAtJob: 1, readings: READ } } as ServiceAction).error).toMatch(/Readings refused/);
    // Without readings it completes.
    expect(apply(inProgress, { type: 'transition', cardId: 'JC-1', to: 'COMPLETED', by: 'TECH-A', at: T2, update: { findings: 'TEST', tasks: ['TEST'], engineHoursAtJob: 1 } } as ServiceAction).error).toBeNull();
  });
  it('a card object carrying both (e.g. built outside the store) does not complete', () => {
    const c: JobCard = { ...base().jobCards[0], status: 'IN PROGRESS', readings: READ, findings: 'TEST', tasks: ['TEST'], engineHoursAtJob: 1, guidedSafety: { stops: [], clearances: [], holds: [], notTaken: [{ at: T1, by: 'TECH-A', confirmed: true }] } };
    expect(() => transition(c, 'COMPLETED', 'TECH-A', T2)).toThrow(/one consistent record: "readings not taken — STOP in force" is recorded but the card also carries 1 test-run reading/);
  });
});
