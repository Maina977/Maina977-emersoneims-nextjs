// @vitest-environment jsdom
/**
 * Re-review of cef6e39b (F10-REMAINING: refused protective values). '@' = clean archive (final5/).
 * No unit shim. "REMAINING:" = demonstrated gap.
 *
 * Copied from the reviewer's scratch/integration/mine5u/refused.test.tsx (2026-11-26). Changed only
 * where F10-R2 is now fixed: the two "REMAINING" tests and the "not latched" check of the panel test
 * assert the required behaviour (a committed refused value is kept as a hold); and, for tsc only,
 * one array literal is typed and one `let` is `const`.
 *
 * F10-R3 (2026-11-26): the free-text phrase in the findings no longer satisfies anything; where these
 * tests wrote it, they now record the structured action (store action recordNotTaken).
 *
 * Real-project D6 (2026-11-26): completion fixtures now carry the engine test-run readings
 * (oil pressure, coolant temperature, output voltage, frequency; oil temperature for low-oil cards).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Panel, { GD_STORE } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { sessionRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { REFUSED_UNIT_ALL, REFUSED_UNIT_SOME } from '@/lib/generator-oracle/diagnostics/refusedProtective';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { apply, emptyState, serialise, importState, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, type JobCard } from '@/lib/generator-oracle/service/maintenance';
import type { FaultFamily } from '@/lib/generator-oracle/diagnostics/types';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear(); });
const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
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
  return apply(r1.state, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: '2026-11-26T12:00:00.000Z', update: { tasks: ['x'], engineHoursAtJob: 1, readings: [{ name: 'Oil pressure', value: 300, unit: 'kPa' }, { name: 'TEST coolant temperature', value: 80, unit: '°C' }, { name: 'TEST output voltage', value: 400, unit: 'V' }, { name: 'TEST frequency', value: 50, unit: 'Hz' }] } } as ServiceAction).error;
}
const setSession = (answers: Record<string, Record<string, string>>) => localStorage.setItem(SESSION, JSON.stringify({ version: 1, answers, equipment: {} }));
const lop = (raw: Record<string, string>) => sessionRecord(F('low-oil-pressure'), { 'low-oil-pressure': raw }).result;
const tab = (c: HTMLElement, f: FaultFamily) => fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === f.title)!);
const inp = (c: HTMLElement, id: string) => { const e = c.querySelectorAll(`[id="gd-all-${id}"]`); return e[e.length - 1] as HTMLInputElement; };
const unitSel = (c: HTMLElement, f: FaultFamily, id: string) => { const q = f.questions.find((x) => x.id === id)!; const s = c.querySelectorAll(`select[aria-label="Unit: ${q.text}"]`); return s[s.length - 1] as HTMLSelectElement; };
const stopHold = (c: HTMLElement) => !!c.querySelector('[data-testid="gd-stop-hold"]');
const latched = () => (JSON.parse(localStorage.getItem(GD_STORE) ?? '{"latched":[]}').latched as Array<{ message: string }>);
const L150 = { oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' };

describe('engine: refused protective values', () => {
  it('reading "1" (no unit) vs 150 kPa → ALL, latched type; "10" → SOME (10 bar = 1000 kPa inside; 20 bar = 2000 kPa is out of range so "20" is ALL); "400" → none reach → conservative STOP; all labelled, running checks withheld', () => {
    const a = lop({ oilPressure: '1', ...L150 }), s = lop({ oilPressure: '10', ...L150 }), n = lop({ oilPressure: '400', ...L150 });
    console.log('R1:', a.stops[0]?.message, '|', s.stops[0]?.message, '|', n.stops[0]?.message);
    expect(a.stops[0].message).toBe(REFUSED_UNIT_ALL); expect(s.stops[0].message).toBe(REFUSED_UNIT_SOME);
    expect(n.stopActive).toBe(true); expect(n.stops[0].message).toMatch(/protective value refused/);
    for (const r of [a, s, n]) { expect(r.stops[0].label).toBe(SAFEGUARD_LABEL); expect(r.runningWithheld).toBe(true); }
  });
  it('limit side: limit "150" (no unit) vs 20 psi → STOP; limit "1.5" (no unit: 1.5 kPa out of range 20–800, 150 kPa as bar, 10.3 kPa psi out of range) vs reading 140 kPa', () => {
    const r1 = lop({ oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150' });
    const r2 = lop({ oilPressure: '140', 'oilPressure.unit': 'kPa', oemMinOilPressure: '1.5' });
    const r3 = lop({ oilPressure: '160', 'oilPressure.unit': 'kPa', oemMinOilPressure: '1.5' });
    console.log('R2 limit-side:', r1.stops[0]?.message.slice(0, 70), '|', r2.stops[0]?.message.slice(0, 70), '|', r3.stops[0]?.message.slice(0, 70));
    expect(r1.stopActive && r2.stopActive && r3.stopActive).toBe(true);
  });
  it('not a number, out of range, both sides refused, and the limit missing → conservative STOP', () => {
    for (const raw of [{ oilPressure: 'abc', 'oilPressure.unit': 'kPa', ...L150 }, { oilPressure: '5000', 'oilPressure.unit': 'kPa', ...L150 }, { oilPressure: '20', oemMinOilPressure: '150' }, { oilPressure: '20' }] as Record<string, string>[]) {
      const r = lop(raw);
      console.log('R3', JSON.stringify(raw), '→', r.stopActive, r.stops[0]?.message.slice(0, 60));
      expect(r.stopActive, JSON.stringify(raw)).toBe(true);
    }
  });
  it('tolerance: limit refused (no unit) + reading 152 kPa ±5 → reached within tolerance in the kPa interpretation', () => {
    const r = lop({ oilPressure: '152', 'oilPressure.unit': 'kPa', 'oilPressure.tol': '5', oemMinOilPressure: '150' });
    console.log('R4 tolerance:', r.stops[0]?.message);
    expect(r.stopActive).toBe(true);
  });
  it('coolant °C/°F: reading "100" (no unit) vs 100 °C max → 100 °C reaches, 100 °F (37.8 °C) not → SOME', () => {
    const r = sessionRecord(F('overheating'), { overheating: { coolantTemp: '100', oemAlarmCoolantTemp: '100', 'oemAlarmCoolantTemp.unit': '°C' } }).result;
    expect(r.stops[0].message).toBe(REFUSED_UNIT_SOME);
  });
  it('F11: 24 V system with a 12 V-style band (both refused by the cross-check) and 35 V → STOP (refused protective)', () => {
    const r = sessionRecord(F('charging'), { charging: { systemVoltage: '24', runVoltage: '35', oemChargeMin: '13', oemChargeMax: '14.4' } }).result;
    console.log('R6 F11 band:', r.stopActive, r.stops.find((s) => s.level === 'STOP')?.message.slice(0, 90));
    expect(r.stopActive).toBe(true);
  });
  it('the refused STOP comes first in the record and holds other families (session-wide)', () => {
    const rec = sessionRecord(F('charging'), { 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    console.log('R7 other family:', rec.lines[0].slice(0, 110));
    expect(rec.result.stopActive).toBe(true);
    const own = sessionRecord(F('low-oil-pressure'), { 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    expect(own.lines[0]).toBe(`STOP: ${REFUSED_UNIT_SOME}`);
  });
});

describe('job card: refusedInput and correctedAt', () => {
  it('a card made while the SOME STOP shows blocks completion; a later record for the same family with the corrected value (psi) unblocks? (it latches the real STOP)', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    expect(complete(s)).toMatch(/STOP|Readings not taken/);
    setSession({ 'low-oil-pressure': { oilPressure: '10', 'oilPressure.unit': 'psi', ...L150 } });
    s = record(s, 'low-oil-pressure', '2026-11-26T09:10:00.000Z');
    console.log('C1 corrected to psi → completion:', complete(s)?.slice(0, 100));
    expect(complete(s)).toMatch(/STOP|Readings not taken/); // the real STOP (137.9 kPa) now blocks
  });
  it('F10-R2 fixed: a later record for the same family that merely OMITS the field does NOT mark the refused STOP corrected; the card stays blocked', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    setSession({ 'low-oil-pressure': { ...L150 } }); // reading cleared, not corrected
    s = record(s, 'low-oil-pressure', '2026-11-26T09:10:00.000Z');
    const st = card(s).guidedSafety!.stops.find((x) => x.refusedInput)!;
    const err = complete(s);
    console.log('C2 omitted field: correctedAt =', st.correctedAt, '| completion →', err);
    expect(st.correctedAt).toBeUndefined();
    expect(err).toMatch(/STOP|Readings not taken/);
  });
  it('a record for ANOTHER family never marks it corrected; the phrase releases it', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    let s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    setSession({});
    s = record(s, 'overheating', '2026-11-26T09:10:00.000Z');
    expect(card(s).guidedSafety!.stops.find((x) => x.refusedInput)!.correctedAt).toBeUndefined();
    expect(complete(s)).toMatch(/STOP|Readings not taken/);
    const p = go(s, { type: 'recordNotTaken', cardId: 'JC1', at: '2026-11-26T23:00:00.000Z', by: 'TECH', confirmed: true } as ServiceAction);
    expect(complete(p)).toBeNull();
  });
  it('imported card: a correctedAt in the file does not count; a correction after the import does', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    const s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    const j = JSON.parse(serialise(s)); const jc = (j.jobCards ?? j.state.jobCards)[0];
    jc.guidedSafety.stops.find((x: { refusedInput?: boolean }) => x.refusedInput).correctedAt = '2026-11-26T09:05:00.000Z';
    const r = importState(JSON.stringify(j), '2026-11-26T10:00:00.000Z');
    expect(r.ok).toBe(true);
    const i = (r as { state: ServiceState }).state;
    const err = complete(i);
    console.log('C4 imported forged correctedAt → completion:', err?.slice(0, 120));
    expect(err).not.toBeNull();
  });
  it('the .txt puts the refused STOP first (SAFETY section) with its label', () => {
    setSession({ 'low-oil-pressure': { oilPressure: '10', ...L150 } });
    const s = record(base(), 'low-oil-pressure', '2026-11-26T09:00:00.000Z');
    const txt = jobCardReport(card(s), ASSET);
    const i = txt.indexOf(REFUSED_UNIT_SOME);
    expect(i).toBeGreaterThan(-1); expect(i).toBeLessThan(txt.indexOf('\nASSET\n'));
  });
});

describe('panel: the not-latched SOME path', () => {
  const setup = () => {
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure'));
    fireEvent.change(unitSel(c, F('low-oil-pressure'), 'oemMinOilPressure'), { target: { value: 'kPa' } });
    fireEvent.change(inp(c, 'oemMinOilPressure'), { target: { value: '150' } }); fireEvent.blur(inp(c, 'oemMinOilPressure'));
    fireEvent.change(inp(c, 'oilPressure'), { target: { value: '10' } }); fireEvent.blur(inp(c, 'oilPressure'));
    return c;
  };
  it('shows the SOME STOP, holds every tab, survives leaving and reload; once committed it is kept as a refused-value hold (F10-R2)', () => {
    const c = setup();
    expect(stopHold(c)).toBe(true);
    expect(c.textContent).toContain(REFUSED_UNIT_SOME);
    for (const f of FAMILIES) { tab(c, f); expect(stopHold(c), f.id).toBe(true); }
    expect(latched().map((l) => l.message)).toEqual([expect.stringMatching(/value removed or refused/)]);
    cleanup();
    const again = render(<Panel />);
    expect(stopHold(again.container)).toBe(true);
  });
  it('choosing psi latches the real STOP (which then survives clearing); choosing bar (inside) removes it; going back to "Unit?" restores it', () => {
    let c = setup();
    fireEvent.change(unitSel(c, F('low-oil-pressure'), 'oilPressure'), { target: { value: 'bar' } });
    expect(stopHold(c)).toBe(false);
    fireEvent.change(unitSel(c, F('low-oil-pressure'), 'oilPressure'), { target: { value: '' } });
    expect(stopHold(c)).toBe(true);
    fireEvent.change(unitSel(c, F('low-oil-pressure'), 'oilPressure'), { target: { value: 'psi' } });
    expect(latched().length).toBe(1);
    fireEvent.change(inp(c, 'oilPressure'), { target: { value: '' } }); fireEvent.blur(inp(c, 'oilPressure'));
    expect(stopHold(c)).toBe(true);
    cleanup(); localStorage.clear();
    c = setup();
  });
  it('F10-R2 fixed: clearing the unit-less dangerous value does NOT remove the STOP (the committed hold stays)', () => {
    const c = setup();
    expect(stopHold(c)).toBe(true);
    fireEvent.change(inp(c, 'oilPressure'), { target: { value: '' } }); fireEvent.blur(inp(c, 'oilPressure'));
    console.log('P3 after clearing the unit-less value: STOP hold =', stopHold(c), '| latched =', latched().length);
    expect(stopHold(c)).toBe(true);
  });
  it('the ALL case (unit-less "1") latches on commit and survives clearing', () => {
    const { container: c } = render(<Panel />);
    tab(c, F('low-oil-pressure'));
    fireEvent.change(unitSel(c, F('low-oil-pressure'), 'oemMinOilPressure'), { target: { value: 'kPa' } });
    fireEvent.change(inp(c, 'oemMinOilPressure'), { target: { value: '150' } }); fireEvent.blur(inp(c, 'oemMinOilPressure'));
    fireEvent.change(inp(c, 'oilPressure'), { target: { value: '1' } }); fireEvent.blur(inp(c, 'oilPressure'));
    expect(latched().some((l) => l.message === REFUSED_UNIT_ALL)).toBe(true);
    fireEvent.change(inp(c, 'oilPressure'), { target: { value: '' } }); fireEvent.blur(inp(c, 'oilPressure'));
    expect(stopHold(c)).toBe(true);
  });
});
