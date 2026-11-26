// @vitest-environment jsdom
/**
 * Re-review of 8cb36c25 (f1d7689e: R-INT-1..5). '@' = clean archive of 8cb36c25 (final2/).
 * Tests assert the REQUIRED behaviour unless named "REMAINING:".
 *
 * Copied from the reviewer's scratch/integration/mine2/fixes.test.tsx (2026-11-26). Changed only
 * where R-INT-6 and R-INT-7 are now fixed: the two tests that asserted those defects
 * ("second exit" and the nav-away "REMAINING") now assert the required behaviour; and (F10,
 * 2026-11-26) setA/typeOnly choose the unit (kPa / °C) before a pressure or temperature is typed.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import Panel, { GD_STORE } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf, SAFETY_HOLD_TEXT } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { SCREEN_BUCKET, SCREEN_QUESTIONS } from '@/lib/generator-oracle/diagnostics/safetyScreen';
import { apply, emptyState, serialise, deserialise, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, READINGS_NOT_TAKEN_STOP, type JobCard } from '@/lib/generator-oracle/service/maintenance';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear(); });
const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const el = (c: HTMLElement, id: string) => { const els = c.querySelectorAll(`[id="gd-${id.startsWith('screen.') ? 'screen' : 'all'}-${id.replace(/\./g, '-')}"]`); if (!els.length) throw new Error('no input ' + id); return els[els.length - 1] as HTMLInputElement; };
/** change + commit (blur) for typed inputs; a select commits by itself */
// Safety review F10 (2026-11-26): every pressure and temperature needs its unit chosen (no default).
const UNIT_OF: Record<string, string> = { oilPressure: 'kPa', oemMinOilPressure: 'kPa', oilTemp: '°C', oemMaxOilTemp: '°C', coolantTemp: '°C', oemAlarmCoolantTemp: '°C' };
const pickUnit = (c: HTMLElement, id: string) => {
  const u = UNIT_OF[id]; if (!u) return;
  const q = FAMILIES.flatMap((f) => f.questions).find((x) => x.id === id)!;
  const sels = c.querySelectorAll(`select[aria-label="Unit: ${q.text}"]`);
  const sel = sels[sels.length - 1] as HTMLSelectElement | undefined;
  if (sel && !sel.value) fireEvent.change(sel, { target: { value: u } });
};
const setA = (c: HTMLElement, id: string, v: string) => { pickUnit(c, id); const e = el(c, id); fireEvent.change(e, { target: { value: v } }); if (e.tagName === 'INPUT') fireEvent.blur(e); };
const typeOnly = (c: HTMLElement, id: string, v: string) => { pickUnit(c, id); fireEvent.change(el(c, id), { target: { value: v } }); };
const stopHold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const latchedCount = () => (JSON.parse(localStorage.getItem(GD_STORE) ?? '{"latched":[]}').latched as unknown[]).length;
const RUNNING = FAMILIES.flatMap((f) => f.causes.flatMap((x) => x.runningChecks ?? []));
const ALL_ACTIONS = FAMILIES.flatMap((f) => f.causes.flatMap((x) => x.actions));
const T = '2026-11-26T08:00:00.000Z';
const ASSET = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };

/** The ServiceManagementPanel GuidedRecord path, through the real store actions. */
function uiCard(famId: string, findings = '', prevState?: ServiceState): { state: ServiceState; card: JobCard } {
  const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
  let s = prevState ?? go(go(emptyState(), { type: 'saveAsset', asset: ASSET } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
  if (findings) s = go(s, { type: 'updateCard', cardId: 'JC1', update: { findings } } as ServiceAction);
  const card0 = s.jobCards.find((c) => c.id === 'JC1')!;
  const g = guardedSessionRecord(F(famId), loadGuidedSession(localStorage, FAMILIES), loadGuidedEquipment(localStorage), safetyStateOf(readStore()));
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at: T, safety: g.safety } as ServiceAction);
  s = go(s, { type: 'updateCard', cardId: 'JC1', update: guardedCardUpdate(card0, g) } as ServiceAction);
  return { state: s, card: s.jobCards.find((c) => c.id === 'JC1')! };
}
function completeVia(s: ServiceState, extra: Record<string, unknown> = {}): { error: string | null } {
  const r1 = apply(s, { type: 'transition', cardId: 'JC1', to: 'IN PROGRESS', by: 'Tech', at: T } as ServiceAction);
  if (r1.error) return { error: r1.error };
  const r2 = apply(r1.state, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: T, update: { tasks: ['inspected'], engineHoursAtJob: 10, readings: [{ name: 'Oil pressure', value: 300, unit: 'kPa' }], ...extra } } as ServiceAction);
  return { error: r2.error };
}
const screenNo = () => Object.fromEntries(SCREEN_QUESTIONS.map((q) => [q.id, 'no']));
const latchKnockCleared = (screen = true) => { const { container: c } = render(<Panel />); if (screen) for (const [k, v] of Object.entries(screenNo())) setA(c, k, v); tab(c, F('knock-seizure')); setA(c, 'where', 'engine'); setA(c, 'where', ''); return c; };

describe('R-INT-1: records made under a latched STOP / the hold carry no running step', () => {
  it('every family card made under a latched (answers-cleared) knock STOP: no running check, no running-only Next check', () => {
    latchKnockCleared(); cleanup();
    const bad: string[] = [];
    for (const f of FAMILIES) {
      const { card } = uiCard(f.id);
      for (const r of RUNNING) if (card.findings.includes(r)) bad.push(`${f.id} running: ${r}`);
      const next = card.findings.split('\n').find((l) => l.startsWith('Next check'))!;
      const q = f.questions.find((x) => next.includes(x.text));
      if (q && (q as { needsRunning?: boolean }).needsRunning) bad.push(`${f.id}: ${next}`);
      expect(card.findings.split('\n')[0]).toMatch(/^STOP/);
    }
    console.log('R-INT-1 bad lines:', JSON.stringify(bad));
    expect(bad).toEqual([]);
  });
  it('the previously failing cases: low oil "Oil pressure measured", no-voltage "Frequency", charging running check; also under the SAFETY HOLD', () => {
    latchKnockCleared(); cleanup();
    localStorage.setItem('eims-oracle-guided-session-v1', JSON.stringify({ version: 1, answers: { [SCREEN_BUCKET]: screenNo(), charging: { chargeAlarm: 'yes', source: 'alternator', belt: 'ok', excitation: 'ok', terminals: 'clean' } }, equipment: {} }));
    for (const st of [safetyStateOf(readStore()), { latched: [], cleared: [], hold: true }]) {
      for (const fid of ['low-oil-pressure', 'no-voltage', 'charging']) {
        const g = guardedSessionRecord(F(fid), loadGuidedSession(localStorage, FAMILIES), {}, st);
        const nx = g.record.findings.split('\n').find((l) => l.startsWith('Next check'))!;
        console.log(`R-INT-1 ${st.hold ? 'HOLD' : 'latched'} ${fid}: ${nx}`);
        expect(nx).not.toMatch(/Oil pressure measured|Frequency \(Hz\)|engine running/);
        for (const r of RUNNING) expect(g.record.findings).not.toContain(r);
      }
    }
  });
});

describe('R-INT-2: completion reads the structured guidedSafety, not the editable text', () => {
  it('deleting the latched line or typing a clearance line no longer lets the card complete; phrase does; guidedSafety cannot be changed through updateCard', () => {
    latchKnockCleared(); cleanup();
    const { state, card } = uiCard('knock-seizure');
    expect(card.guidedSafety?.stops.length).toBeGreaterThan(0);
    expect(completeVia(state).error).toMatch(/Readings not taken: STOP in force/);
    const del = apply(state, { type: 'updateCard', cardId: 'JC1', update: { findings: 'all fine' } } as ServiceAction).state;
    expect(completeVia(del).error).toMatch(/still latched/);
    const forged = apply(state, { type: 'updateCard', cardId: 'JC1', update: { findings: `${card.findings}\nSTOP CLEARANCE RECORDED — UNVERIFIED x: Source: Knocking, bearing noise or seizure tab. Since: ${card.guidedSafety!.stops[0].since} (UTC). Cleared: now by X. Reason: ok.` } } as ServiceAction).state;
    expect(completeVia(forged).error).toMatch(/still latched/);
    const viaEdit = apply(state, { type: 'updateCard', cardId: 'JC1', update: { findings: 'x', guidedSafety: { stops: [], clearances: [], holds: [] } } } as unknown as ServiceAction).state;
    expect(viaEdit.jobCards[0].guidedSafety?.stops.length).toBeGreaterThan(0);
    expect(completeVia(viaEdit).error).toMatch(/still latched/);
    const phrase = apply(state, { type: 'updateCard', cardId: 'JC1', update: { findings: `${card.findings}\n${READINGS_NOT_TAKEN_STOP}` } } as ServiceAction).state;
    expect(completeVia(phrase).error).toBeNull();
  });
  it('a clearance recorded in the panel, then a new record, resolves it; a malformed guidedSafety on import is reported', () => {
    const c = latchKnockCleared();
    let { state } = uiCard('knock-seizure');
    const box = c.querySelector('[data-testid="gd-clearance"]') as HTMLElement;
    fireEvent.change(box.querySelector('input:not([type="checkbox"])')!, { target: { value: 'JK' } });
    fireEvent.change(box.querySelector('textarea')!, { target: { value: 'Bearings inspected and replaced' } });
    fireEvent.click(box.querySelector('input[type="checkbox"]')!);
    fireEvent.click([...box.querySelectorAll('button')].find((b) => b.textContent === 'Record STOP clearance')!);
    cleanup();
    state = uiCard('knock-seizure', '', state).state;
    expect(completeVia(state).error).toBeNull();
    const text = serialise(state).replace('"guidedSafety":{"stops":[', '"guidedSafety":{"stops":[{"key":5},');
    console.log('R-INT-2 malformed import →', JSON.stringify(deserialise(text)).slice(0, 220));
  });
  it('REMAINING (inherent, client-side store): exported JSON with guidedSafety removed', () => {
    latchKnockCleared(); cleanup();
    const { state } = uiCard('knock-seizure');
    const j = JSON.parse(serialise(state));
    const strip = (o: unknown): void => { if (o && typeof o === 'object') { delete (o as Record<string, unknown>).guidedSafety; Object.values(o as object).forEach(strip); } };
    strip(j);
    const r = deserialise(JSON.stringify(j)) as unknown as { state?: ServiceState; ok?: boolean; error?: string; problems?: string[] };
    console.log('R-INT-2 stripped import:', JSON.stringify(r).slice(0, 300));
    if (r.state) console.log('  completion after stripped import →', completeVia(r.state).error);
  });
});

describe('R-INT-3: SAFETY HOLD on the card', () => {
  const blockSafetyRecord = () => { const real = Storage.prototype.getItem; return vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, k: string) { if (k === GD_STORE) throw new DOMException('blocked', 'SecurityError'); return real.call(this, k); }); };
  it('blocked storage: own SAFETY HOLD section, never under the STOP heading; NOTE says SAFETY HOLD; blocks completion; phrase releases', () => {
    localStorage.setItem('eims-oracle-guided-session-v1', JSON.stringify({ version: 1, answers: { overheating: { coolantLevel: 'ok' } }, equipment: {} }));
    const spy = blockSafetyRecord();
    const { state, card } = uiCard('overheating', 'Earlier note.');
    spy.mockRestore();
    const txt = jobCardReport(card, ASSET);
    console.log('\n### R-INT-3 card head\n' + txt.split('\n').slice(0, 24).join('\n'));
    expect(txt).toMatch(/SAFETY HOLD — previous diagnostic safety status could not be verified \(held on this card\)/);
    const at = txt.indexOf('SAFETY — STOP');
    if (at >= 0) expect(txt.slice(at, txt.indexOf('\n\n', at))).not.toContain(SAFETY_HOLD_TEXT);
    expect(card.findings).not.toMatch(/before this STOP/);
    expect(completeVia(state).error).toMatch(/SAFETY HOLD/);
    const phrase = apply(state, { type: 'updateCard', cardId: 'JC1', update: { findings: `${card.findings}\n${READINGS_NOT_TAKEN_STOP}` } } as ServiceAction).state;
    expect(completeVia(phrase).error).toBeNull();
  });
  it('R-INT-7: a later record with a readable but EMPTY safety record does NOT resolve the hold; only the phrase or a reassessment recorded on the card does', () => {
    const spy = blockSafetyRecord();
    let { state } = uiCard('overheating');
    spy.mockRestore();
    localStorage.clear(); // e.g. another browser or cleared site data: no safety history
    state = uiCard('overheating', '', state).state;
    const res = completeVia(state);
    expect(res.error).toMatch(/SAFETY HOLD/);
    const go = (st: ServiceState, a: ServiceAction) => { const r = apply(st, a); if (r.error) throw new Error(r.error); return r.state; };
    expect(apply(state, { type: 'recordHoldReassessment', cardId: 'JC1', at: T, by: 'JK', reason: 'short', confirmed: true } as ServiceAction).error).toMatch(/at least 10 characters/);
    const reassessed = go(state, { type: 'recordHoldReassessment', cardId: 'JC1', at: T, by: 'JK', reason: 'Set inspected in person', confirmed: true } as ServiceAction);
    expect(completeVia(reassessed).error).toBeNull();
    expect(jobCardReport(reassessed.jobCards[0], ASSET)).toMatch(/UNVERIFIED/);
  });
});

describe('R-INT-4: latch on commit', () => {
  it('fast typing 1 → 16 → 160 (no blur, no pause) against a 150 kPa minimum: no latch; STOP and withholding shown while "1"/"16" are on screen', () => {
    vi.useFakeTimers();
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150');
    typeOnly(c, 'oilPressure', '1');
    expect(stopHold(c)).toBe(true);
    for (const a of ALL_ACTIONS) expect(c.textContent).not.toContain(a);
    act(() => { vi.advanceTimersByTime(300); });
    typeOnly(c, 'oilPressure', '16');
    expect(stopHold(c)).toBe(true);
    act(() => { vi.advanceTimersByTime(300); });
    typeOnly(c, 'oilPressure', '160');
    act(() => { vi.advanceTimersByTime(1000); });
    console.log('R-INT-4 fast typing latched =', latchedCount(), '| hold =', stopHold(c));
    expect(latchedCount()).toBe(0);
    expect(stopHold(c)).toBe(false);
  });
  it('equality at the limit latches on blur, Enter, a 0.8 s pause, a tab change and after a reload', () => {
    vi.useFakeTimers();
    const ways: Record<string, number> = {};
    for (const how of ['blur', 'enter', 'pause', 'tab', 'reload']) {
      localStorage.clear();
      const { container: c } = render(<Panel />);
      tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150');
      typeOnly(c, 'oilPressure', '150');
      if (how === 'blur') fireEvent.blur(el(c, 'oilPressure'));
      if (how === 'enter') fireEvent.keyDown(el(c, 'oilPressure'), { key: 'Enter' });
      if (how === 'pause') act(() => { vi.advanceTimersByTime(850); });
      if (how === 'tab') tab(c, F('overheating'));
      if (how === 'reload') { cleanup(); render(<Panel />); }
      act(() => { vi.advanceTimersByTime(10); });
      ways[how] = latchedCount();
      cleanup();
    }
    console.log('R-INT-4 equality latch by commit route:', JSON.stringify(ways));
    for (const [k, v] of Object.entries(ways)) expect(v, k).toBeGreaterThan(0);
  });
  it('a pause at an intermediate value: 0.79 s does not latch, 0.81 s does (fails safe)', () => {
    vi.useFakeTimers();
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure')); setA(c, 'oemMinOilPressure', '150');
    typeOnly(c, 'oilPressure', '16');
    act(() => { vi.advanceTimersByTime(790); });
    const at790 = latchedCount();
    act(() => { vi.advanceTimersByTime(20); });
    const at810 = latchedCount();
    console.log('R-INT-4 pause latch at 0.79 s =', at790, '| at 0.81 s =', at810);
    expect(at790).toBe(0); expect(at810).toBeGreaterThan(0);
  });
  it('R-INT-6: reading below the limit typed, then the panel left (module navigation = unmount) within 0.8 s → latched (flushed); a job card made then blocks completion', () => {
    vi.useFakeTimers();
    const r = render(<Panel />);
    for (const [k, v] of Object.entries(screenNo())) setA(r.container, k, v);
    tab(r.container, F('low-oil-pressure')); setA(r.container, 'oemMinOilPressure', '150');
    typeOnly(r.container, 'oilPressure', '100');
    expect(stopHold(r.container)).toBe(true);
    r.unmount();
    act(() => { vi.advanceTimersByTime(2000); });
    const latchedNow = latchedCount();
    const { state, card } = uiCard('low-oil-pressure');
    const err = completeVia(state).error;
    console.log('R-INT-4 nav-away: latched =', latchedNow, '| first line:', card.findings.split('\n')[0].slice(0, 80), '| guidedSafety stops =', card.guidedSafety?.stops.length, '| completion error =', err);
    const again = render(<Panel />);
    act(() => { vi.advanceTimersByTime(10); });
    console.log('R-INT-4 after reopening Guided Diagnosis: latched =', latchedCount());
    again.unmount();
    expect(latchedNow).toBeGreaterThan(0);
    expect(card.findings.split('\n')[0]).toMatch(/^STOP/);
    expect(card.guidedSafety?.stops.length).toBeGreaterThan(0);
    expect(err).toMatch(/still latched/);
  });
});

describe('R-INT-5: write-back of a missing STOP after another window\'s out-of-date write', () => {
  it('integrated: A writes the STOP back on the storage event; a reload shows it', () => {
    const { container: c } = render(<Panel />);
    tab(c, F('knock-seizure')); setA(c, 'where', 'engine');
    const s = JSON.parse(localStorage.getItem(GD_STORE)!);
    localStorage.setItem(GD_STORE, JSON.stringify({ ...s, latched: [], raw: {} }));
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: GD_STORE })); });
    const stored = JSON.parse(localStorage.getItem(GD_STORE)!).latched.length;
    cleanup();
    const reload = stopHold(render(<Panel />).container);
    console.log('R-INT-5 integrated: stored after event =', stored, '| after reload =', reload);
    expect(stored).toBe(1); expect(reload).toBe(true);
  });
});
