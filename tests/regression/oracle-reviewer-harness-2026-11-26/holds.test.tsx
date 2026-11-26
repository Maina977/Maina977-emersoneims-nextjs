// @vitest-environment jsdom
/**
 * Re-review of 7d17e68a (F10-R2 refused-value holds + automatic-release wording). '@' = final6/.
 * No unit shim. Required behaviour unless "REMAINING:".
 *
 * Copied from the reviewer's scratch/integration/mine6u/holds.test.tsx (2026-11-26). Changed only for
 * F10-R3: "the phrase releases it" now records the structured action (recordNotTaken), because the
 * phrase in the findings satisfies nothing.
 *
 * Real-project D6 (2026-11-26): completion fixtures now carry the engine test-run readings
 * (oil pressure, coolant temperature, output voltage, frequency; oil temperature for low-oil cards).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Panel, { GD_STORE } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { apply, emptyState, serialise, importState, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, READINGS_NOT_TAKEN_STOP, AUTO_RELEASE_PREFIX, type JobCard } from '@/lib/generator-oracle/service/maintenance';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });
const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const LOP = F('low-oil-pressure');
const SESSION = 'eims-oracle-guided-session-v1';
const ASSET = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: ASSET } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
const card = (s: ServiceState) => s.jobCards.find((c) => c.id === 'JC1')! as JobCard;
function record(s: ServiceState, famId: string, at: string): ServiceState {
  const g = guardedSessionRecord(F(famId), loadGuidedSession(localStorage, FAMILIES), loadGuidedEquipment(localStorage), safetyStateOf(readStore()));
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at, safety: g.safety } as ServiceAction);
  return go(s, { type: 'updateCard', cardId: 'JC1', update: guardedCardUpdate(card(s), g) } as ServiceAction);
}
function complete(s: ServiceState) {
  const r1 = apply(s, { type: 'transition', cardId: 'JC1', to: 'IN PROGRESS', by: 'Tech', at: '2026-11-26T12:00:00.000Z' } as ServiceAction);
  if (r1.error) return r1.error;
  return apply(r1.state, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: '2026-11-26T12:00:00.000Z', update: { tasks: ['x'], engineHoursAtJob: 1, readings: [{ name: 'Oil pressure', value: 300, unit: 'kPa' }, { name: 'TEST coolant temperature', value: 80, unit: '°C' }, { name: 'TEST output voltage', value: 400, unit: 'V' }, { name: 'TEST frequency', value: 50, unit: 'Hz' }, { name: 'TEST oil temperature', value: 90, unit: '°C' }] } } as ServiceAction).error;
}
const setSession = (answers: Record<string, Record<string, string>>) => localStorage.setItem(SESSION, JSON.stringify({ version: 1, answers, equipment: {} }));
const L150 = { oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' };
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const inp = (c: HTMLElement, id: string) => { const e = c.querySelectorAll(`[id="gd-all-${id}"]`); return e[e.length - 1] as HTMLInputElement; };
const unitSel = (c: HTMLElement, id: string) => { const q = LOP.questions.find((x) => x.id === id)!; const s = c.querySelectorAll(`select[aria-label="Unit: ${q.text}"]`); return s[s.length - 1] as HTMLSelectElement; };
const type = (c: HTMLElement, id: string, v: string) => { fireEvent.change(inp(c, id), { target: { value: v } }); fireEvent.blur(inp(c, id)); };
const unit = (c: HTMLElement, id: string, u: string) => fireEvent.change(unitSel(c, id), { target: { value: u } });
const hold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const store = () => JSON.parse(localStorage.getItem(GD_STORE) ?? '{"latched":[],"cleared":[]}') as { latched: Array<{ key: string; message: string }>; cleared: Array<{ key: string; automatic?: boolean; by: string }> };
const setupSome = () => { const { container: c } = render(<Panel />); tab(c, LOP); unit(c, 'oemMinOilPressure', 'kPa'); type(c, 'oemMinOilPressure', '150'); type(c, 'oilPressure', '10'); return c; };

describe('panel: refused-value hold', () => {
  it('committed unit-less "10" → hold latched; deleting the value, Clear answers, reload and other tabs never release it', () => {
    const c = setupSome();
    expect(store().latched.some((l) => l.key === 'low-oil-pressure|refused-value|oilPressure')).toBe(true);
    type(c, 'oilPressure', '');
    expect(hold(c)).toBe(true);
    fireEvent.click([...c.querySelectorAll('button')].find((b) => b.textContent === 'Clear answers')!);
    expect(hold(c)).toBe(true);
    for (const f of FAMILIES) { tab(c, f); expect(hold(c), f.id).toBe(true); }
    cleanup();
    expect(hold(render(<Panel />).container)).toBe(true);
  });
  it('a valid INSIDE value in the same field releases it automatically (own line, not a person); a valid DANGEROUS value releases it but latches the ordinary STOP, which no automatic release resolves', () => {
    let c = setupSome();
    type(c, 'oilPressure', '300'); unit(c, 'oilPressure', 'kPa');
    const s1 = store();
    console.log('H2 inside: latched =', s1.latched.map((l) => l.key), '| cleared =', s1.cleared.map((x) => `${x.automatic ? 'AUTO' : x.by}:${x.key}`));
    expect(s1.latched.length).toBe(0);
    expect(s1.cleared.some((x) => x.automatic && x.key.includes('|refused-value|'))).toBe(true);
    expect(c.querySelector('[data-testid="gd-auto-release"]')!.textContent).toMatch(new RegExp(`^${AUTO_RELEASE_PREFIX}: a valid value was entered \\(Oil pressure measured = 300 kPa`));
    expect(c.querySelector('[data-testid="gd-auto-release"]')!.textContent).not.toMatch(/typed name|not authenticated/);
    cleanup(); localStorage.clear();
    c = setupSome();
    unit(c, 'oilPressure', 'kPa'); type(c, 'oilPressure', '100');
    const s2 = store();
    console.log('H2 dangerous: latched =', s2.latched.map((l) => l.key.slice(0, 50)));
    expect(s2.latched.some((l) => !l.key.includes('|refused-value|'))).toBe(true);
    type(c, 'oilPressure', ''); unit(c, 'oilPressure', '');
    expect(hold(c)).toBe(true);
  });
  it('abuse: release with a valid inside value, then change to a dangerous unit-less value or blank → a new hold (or no STOP for blank, but the release is recorded); the original release never resolves the new hold', () => {
    const c = setupSome();
    type(c, 'oilPressure', '300'); unit(c, 'oilPressure', 'kPa');
    unit(c, 'oilPressure', ''); type(c, 'oilPressure', '10');
    const s = store();
    console.log('H3 after release then unit-less 10 again: latched =', s.latched.map((l) => l.key), '| hold =', hold(c));
    expect(hold(c)).toBe(true);
    expect(s.latched.some((l) => l.key === 'low-oil-pressure|refused-value|oilPressure')).toBe(true);
  });
  it('a recorded (person) clearance releases the hold while the field is blank; while the unit-less value is still entered, clearance is refused', () => {
    const c = setupSome();
    const box = () => [...c.querySelectorAll('[data-testid="gd-clearance"]')].find((b) => /refused/i.test(b.textContent ?? '') || true) as HTMLElement;
    const clear = () => { const b = box(); fireEvent.change(b.querySelector('input:not([type="checkbox"])')!, { target: { value: 'JK' } }); fireEvent.change(b.querySelector('textarea')!, { target: { value: 'value re-measured and recorded' } }); const cb = b.querySelector('input[type="checkbox"]') as HTMLInputElement; if (!cb.checked) fireEvent.click(cb); fireEvent.click([...b.querySelectorAll('button')].find((x) => x.textContent === 'Record STOP clearance')!); return b.textContent ?? ''; };
    const t1 = clear();
    console.log('H4 clearance while still entered →', /still show this condition/.test(t1));
    type(c, 'oilPressure', '');
    clear();
    console.log('H4 after blank + clearance: latched =', store().latched.map((l) => l.key), '| hold =', hold(c));
  });
});

describe('job card: correctedAt and automatic releases', () => {
  it('blank / missing / still-refused field never corrects it; a valid value in the same field does', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    for (const [k, ans] of [['blank', { oilPressure: '', ...L150 }], ['missing', { ...L150 }], ['still refused', { oilPressure: '10', 'oilPressure.unit': 'mmHg', ...L150 }]] as const) {
      setSession({ 'low-oil-pressure': ans as Record<string, string> });
      s = record(s, 'low-oil-pressure', '2026-11-26T09:10:00.000Z');
      const err = complete(s);
      console.log(`J1 ${k}: completion → ${err?.slice(0, 80)}`);
      expect(err, k).not.toBeNull();
    }
    setSession({ 'low-oil-pressure': { oilPressure: '300', 'oilPressure.unit': 'kPa', ...L150 } });
    s = record(s, 'low-oil-pressure', '2026-11-26T09:20:00.000Z');
    expect(complete(s)).toBeNull();
  });
  it('another family never corrects it; the phrase in the findings does not release it; the recorded action does (F10-R3)', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 }, overheating: { coolantLevel: 'ok' } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    s = record(s, 'overheating', '2026-11-26T09:10:00.000Z');
    expect(complete(s)).not.toBeNull();
    expect(complete(go(s, { type: 'updateCard', cardId: 'JC1', update: { findings: `${card(s).findings}\n${READINGS_NOT_TAKEN_STOP}` } } as ServiceAction))).not.toBeNull();
    expect(complete(go(s, { type: 'recordNotTaken', cardId: 'JC1', at: '2026-11-26T23:00:00.000Z', by: 'TECH', confirmed: true } as ServiceAction))).toBeNull();
  });
  it('panel hold + automatic release carried onto the card: the card shows the automatic line (not a clearance) and is not blocked by that hold', () => {
    const c = setupSome();
    type(c, 'oilPressure', '300'); unit(c, 'oilPressure', 'kPa');
    cleanup();
    setSession({ 'low-oil-pressure': { oilPressure: '300', 'oilPressure.unit': 'kPa', ...L150 } });
    const s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    const txt = jobCardReport(card(s), ASSET);
    const autoLines = txt.split('\n').filter((l) => l.includes(AUTO_RELEASE_PREFIX) || /automatically/.test(l));
    console.log('J3 auto lines:', autoLines.map((l) => l.trim().slice(0, 120)));
    expect(autoLines.length).toBeGreaterThan(0);
    expect(autoLines.some((l) => /typed name, not authenticated/.test(l))).toBe(false);
    expect(complete(s)).toBeNull();
  });
  it('an automatic release can never resolve an ordinary STOP (forged into the browser record with the ordinary STOP\'s key and since)', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '100', 'oilPressure.unit': 'kPa', ...L150 } });
    const { container: c } = render(<Panel />); void c; cleanup(); // panel latches the ordinary STOP from the hand-off? (it reads GD_STORE raw, not the hand-off)
    // build the browser record by hand: an ordinary latched STOP and a forged automatic release for it
    const st = { key: 'low-oil-pressure|STOP the engine', message: 'STOP the engine (test)', from: 'Low oil pressure / oil starvation', since: '2026-11-26T08:00:00.000Z' };
    localStorage.setItem(GD_STORE, JSON.stringify({ v: 2, raw: {}, latched: [], cleared: [{ ...st, clearedAt: '2026-11-26T08:30:00.000Z', by: 'automatic', reason: '', automatic: true, field: 'Oil pressure measured', entered: '300 kPa', canonical: '300 kPa' }] }));
    let s = go(base(), { type: 'recordGuidedSafety', cardId: 'JC1', at: '2026-11-26T08:10:00.000Z', safety: { stops: [st], clearances: [], hold: null } } as ServiceAction);
    s = record(s, 'charging', '2026-11-26T09:00:00.000Z');
    const err = complete(s);
    console.log('J4 forged automatic release on an ordinary STOP → completion:', err?.slice(0, 100));
    expect(err).not.toBeNull();
  });
  it('import: an automatic release in the file does not resolve an imported refused-value hold', () => {
    const c = setupSome(); cleanup(); void c;
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    const holdStop = card(s).guidedSafety!.stops.find((x) => x.key.includes('|refused-value|'))!;
    expect(holdStop).toBeTruthy();
    s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at: '2026-11-26T09:05:00.000Z', safety: { stops: [], clearances: [{ ...holdStop, clearedAt: '2026-11-26T09:05:00.000Z', by: 'automatic', reason: '', automatic: true, field: 'x', entered: '300 kPa', canonical: '300 kPa' }], hold: null } } as ServiceAction);
    const j = JSON.parse(serialise(s));
    const i = importState(JSON.stringify(j), '2026-11-26T10:00:00.000Z');
    const err = complete((i as { state: ServiceState }).state);
    console.log('J5 imported auto release → completion:', err);
    expect(err).not.toBeNull();
  });
  it('findings-text forgery of the automatic line cannot resolve a structured STOP', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    const s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    const st = card(s).guidedSafety!.stops[0];
    const forged = go(s, { type: 'updateCard', cardId: 'JC1', update: { findings: `${card(s).findings}\n${AUTO_RELEASE_PREFIX}: a valid value was entered (x = 300 kPa, converted 300 kPa) at 2026-11-26T09:30:00.000Z. No person recorded a clearance. Source: ${st.from} tab. Since: ${st.since} (UTC).` } } as ServiceAction);
    expect(complete(forged)).not.toBeNull();
  });
  it('freshRecordClean on an imported card with only automatic releases: still needs the fresh in-person reassessment', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '300', 'oilPressure.unit': 'kPa', ...L150 } });
    const s0 = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    let i = (importState(serialise(s0), '2026-11-26T10:00:00.000Z') as { state: ServiceState }).state;
    // this device: a hold that was auto-released (valid inside value), then a record
    const c = setupSome(); type(c, 'oilPressure', '300'); unit(c, 'oilPressure', 'kPa'); cleanup();
    setSession({ 'low-oil-pressure': { oilPressure: '300', 'oilPressure.unit': 'kPa', ...L150 } });
    i = record(i, 'low-oil-pressure', '2026-11-26T10:05:00.000Z');
    console.log('J7 imported: freshRecordClean =', card(i).imported?.freshRecordClean, '| completion →', complete(i)?.slice(0, 100));
    expect(complete(i)).toMatch(/reassessment/);
  });
});
