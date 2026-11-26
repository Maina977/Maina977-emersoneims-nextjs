// @vitest-environment jsdom
/**
 * Copied from the reviewer's scratch/integration/mine8/d6-reconcile.test.tsx (2026-11-26, review of
 * 477bd525 + ac20f893, MAJOR O-1). '@' = final8/ there, the repo root here.
 * Changed for the O-1 fix (structured checklist items):
 *  - the info log is written to the console instead of the reviewer's folder;
 *  - FULL carries checklistId on each reading (entered against its own checklist item);
 *  - D6-4 and D6-5 enter the wrong readings as free-text notes AND against the checklist item, and assert
 *    both are refused (D6-5 only logged before: it now asserts);
 *  - jobCardReport is called with the asset (the reviewer's own call error, corrected as in the review).
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { apply, emptyState, serialise, importState, deserialise, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, recordsStopInForce, missingTestRunReadings, requiredTestRunReadings, type JobCard } from '@/lib/generator-oracle/service/maintenance';

const say = (s: string) => console.log(s);
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); localStorage.clear(); });
const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const ASSET = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: ASSET } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
const card = (s: ServiceState) => s.jobCards[0] as JobCard;
type R = { name: string; value: number; unit: string; min?: number; max?: number; limitSource?: string; checklistId?: string };
const FULL: R[] = [{ name: 'Oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'Coolant temperature', value: 82, unit: '°C', checklistId: 'coolantTemp' }, { name: 'Output voltage L-L', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'Frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }];
function complete(s: ServiceState, readings: R[]) {
  let st = s;
  if (card(st).status === 'OPEN') { const r = apply(st, { type: 'transition', cardId: 'JC1', to: 'IN PROGRESS', by: 'Tech', at: '2026-11-26T12:00:00.000Z' } as ServiceAction); if (r.error) return { error: r.error, state: st }; st = r.state; }
  const r2 = apply(st, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: '2026-11-26T12:00:00.000Z', update: { findings: card(st).findings || 'TEST findings', tasks: ['x'], engineHoursAtJob: 1, readings } } as ServiceAction);
  return { error: r2.error, state: r2.state };
}
function record(s: ServiceState, famId: string, answers: Record<string, string>, at: string) {
  localStorage.setItem('eims-oracle-guided-session-v1', JSON.stringify({ version: 1, answers: { [famId]: answers }, equipment: {} }));
  const g = guardedSessionRecord(F(famId), loadGuidedSession(localStorage, FAMILIES), loadGuidedEquipment(localStorage), safetyStateOf(readStore()));
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at, safety: g.safety } as ServiceAction);
  return go(s, { type: 'updateCard', cardId: 'JC1', update: guardedCardUpdate(card(s), g) } as ServiceAction);
}
const notTaken = (s: ServiceState, at = '2026-11-26T11:00:00.000Z') => apply(s, { type: 'recordNotTaken', cardId: 'JC1', at, by: 'JK', confirmed: true } as ServiceAction);

describe('D6 job-specific checklist', () => {
  it('a single reading (the old rule) no longer completes; the error names each missing reading', () => {
    const r = complete(base(), [FULL[0]]);
    say(`D6-1 one reading → ${r.error}`);
    expect(r.error).toMatch(/Coolant temperature/); expect(r.error).toMatch(/Output voltage/); expect(r.error).toMatch(/Frequency/);
  });
  it('the four base readings without limits complete, and each is printed NOT VERIFIED (no limit invented)', () => {
    const r = complete(base(), FULL);
    expect(r.error).toBeNull();
    const txt = jobCardReport(card(r.state), r.state.assets[0] as any);
    const nv = (txt.match(/NOT VERIFIED, not a pass/g) ?? []).length;
    say(`D6-2 report: ${nv} readings NOT VERIFIED | limit lines: ${(txt.match(/limits [^\n]*/g) ?? []).join(' || ') || 'none'}`);
    expect(nv).toBe(4);
    expect(txt).not.toMatch(/limits \d/);
  });
  it('wrong unit kind is refused (coolant in kPa); a °F coolant reading is accepted', () => {
    expect(complete(base(), [FULL[0], { name: 'Coolant temperature', value: 82, unit: 'kPa', checklistId: 'coolantTemp' }, FULL[2], FULL[3]]).error).toMatch(/Coolant temperature/);
    expect(complete(base(), [FULL[0], { name: 'Coolant temperature', value: 180, unit: '°F', checklistId: 'coolantTemp' }, FULL[2], FULL[3]]).error).toBeNull();
  });
  it('ATTACK: a battery / charger voltage stands in for the generator output voltage', () => {
    const r = complete(base(), [FULL[0], FULL[1], { name: 'Battery voltage', value: 24, unit: 'V' }, FULL[3]]);
    say(`D6-4 battery voltage instead of output voltage → ${r.error ?? 'COMPLETED'}`);
    expect(r.error, 'battery voltage accepted as the output voltage').not.toBeNull();
    expect(r.error).toMatch(/Output voltage, line to line/);
    // The free-text note is kept; with the output voltage entered against its item, the card completes.
    const ok = complete(base(), [...FULL, { name: 'Battery voltage', value: 24, unit: 'V' }]);
    expect(ok.error).toBeNull();
    expect(card(ok.state).readings.find((x) => x.name === 'Battery voltage')?.checklistId).toBeUndefined();
    // The report names the checklist item each structured reading was entered against.
    const txt = jobCardReport(card(ok.state), ok.state.assets[0] as any);
    expect(txt).toContain('Output voltage L-L: 400 V (no limit given — NOT VERIFIED, not a pass) — checklist item: Output voltage, line to line');
    expect(txt).toMatch(/Battery voltage: 24 V \(no limit given — NOT VERIFIED, not a pass\)\n/);
  });
  it('ATTACK: a "coolant level" or "oil pressure switch" entry with a matching unit stands in for the reading', () => {
    const r = complete(base(), [{ name: 'Oil pressure switch replaced', value: 1, unit: 'bar' }, { name: 'Coolant topped up', value: 2, unit: '°C' }, FULL[2], FULL[3]]);
    say(`D6-5 non-reading entries with matching units → ${r.error ?? 'COMPLETED'}`);
    expect(r.error, 'non-reading entries accepted as the oil-pressure and coolant readings').not.toBeNull();
    expect(r.error).toMatch(/Oil pressure measured/);
    expect(r.error).toMatch(/Coolant temperature/);
    // An unknown checklist id, or one item entered twice, is refused at entry.
    expect(apply(base(), { type: 'updateCard', cardId: 'JC1', update: { readings: [{ name: 'x', value: 1, unit: 'V', checklistId: 'batteryVoltage' }] } } as ServiceAction).error).toMatch(/unknown test-run checklist item/);
    expect(apply(base(), { type: 'updateCard', cardId: 'JC1', update: { readings: [FULL[2], { ...FULL[2], value: 401 }] } } as ServiceAction).error).toMatch(/entered twice/);
  });
  it('a diagnosed family adds its protective readings (low oil pressure: oil temperature; no-voltage: insulation)', () => {
    let s = record(base(), 'low-oil-pressure', { oilPressure: '300', 'oilPressure.unit': 'kPa' }, '2026-11-26T09:00:00.000Z');
    const req = requiredTestRunReadings(card(s)).map((x) => x.id);
    say(`D6-6 low-oil card requires: ${req.join(', ')} | missing with FULL: ${missingTestRunReadings({ ...card(s), readings: FULL as any }).join('; ')}`);
    expect(req).toEqual(expect.arrayContaining(['oilPressure', 'coolantTemp', 'voltage', 'frequency', 'oilTemp']));
    const r = complete(s, FULL);
    expect(r.error).toMatch(/Oil temperature/);
    expect(complete(s, [...FULL, { name: 'Oil temperature', value: 90, unit: '°C' }]).error, 'free-text oil temperature').toMatch(/Oil temperature/);
    expect(complete(s, [...FULL, { name: 'Oil temp', value: 90, unit: '°C', checklistId: 'oilTemp' }]).error).toBeNull();
    s = record(base(), 'no-voltage', {}, '2026-11-26T09:00:00.000Z');
    expect(requiredTestRunReadings(card(s)).map((x) => x.id)).toContain('insulation');
  });
});

describe('F10-R3 MINOR: action and readings cannot contradict, by any order or path', () => {
  const stopCard = () => record(base(), 'knock-seizure', { where: 'engine' }, '2026-11-26T09:00:00.000Z');
  it('readings first, then the action: refused', () => {
    let s = stopCard();
    s = go(s, { type: 'updateCard', cardId: 'JC1', update: { readings: [FULL[0]] } } as ServiceAction);
    expect(notTaken(s).error).toMatch(/test-run reading/);
  });
  it('the action first, then readings by card edit or with the completion: refused; removing readings then completes', () => {
    const s = notTaken(stopCard()).state;
    expect(recordsStopInForce(card(s))).toBe(true);
    expect(apply(s, { type: 'updateCard', cardId: 'JC1', update: { readings: [FULL[0]] } } as ServiceAction).error).toMatch(/Readings refused/);
    expect(complete(s, FULL).error).toMatch(/Readings refused|one consistent record/);
    expect(complete(s, []).error).toBeNull();
  });
  it('a saved file (own device) carrying both: completion refused', () => {
    const s = notTaken(stopCard()).state;
    const j = JSON.parse(serialise(s));
    j.jobCards[0].readings = [FULL[0]];
    const d: any = deserialise(JSON.stringify(j));
    const st: ServiceState | null = d?.state ?? d?.value ?? (d?.jobCards ? d : null);
    say(`R-3 deserialise both: ${st ? 'loaded' : `refused: ${JSON.stringify(d).slice(0, 160)}`}`);
    if (st) {
      const r = complete(st, card(st).readings as R[]);
      say(`R-3 completion of loaded card with both → ${r.error}`);
      expect(r.error).not.toBeNull();
    }
  });
  it('an imported card carrying both: the imported action does not count, and the readings do not complete a STOP card', () => {
    const s = notTaken(stopCard()).state;
    const j = JSON.parse(serialise(s));
    j.jobCards[0].readings = FULL;
    const imp: any = importState(JSON.stringify(j), "2026-11-26T13:00:00.000Z");
    const st: ServiceState | null = imp?.state ?? null;
    say(`R-4 import both: ${st ? `imported; recordsStopInForce=${recordsStopInForce(st.jobCards[0] as JobCard)}` : `refused: ${String(imp?.error ?? JSON.stringify(imp)).slice(0, 160)}`}`);
    if (st) {
      const r = complete(st, FULL);
      say(`R-4 completion of the imported card → ${r.error}`);
      expect(r.error).not.toBeNull();
    }
  });
});
