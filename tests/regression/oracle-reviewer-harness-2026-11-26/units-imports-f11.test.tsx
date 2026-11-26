// @vitest-environment jsdom
/**
 * Re-review of 4a5ca198 (imported cards, F10 units, F11 charging over-voltage, device-only notice).
 * '@' = clean archive of 4a5ca198 (final4/). NO unit shim here. "REMAINING:" = demonstrated gap.
 *
 * Copied from the reviewer's scratch/integration/mine4u/units-imports-f11.test.tsx (2026-11-26).
 * Changed only where F10-REMAINING is now fixed: the two "REMAINING" tests assert the fix; and for
 * tsc/lint: two unused imports removed, one `let` → `const`, one array typed.
 *
 * F10-R3 (2026-11-26): the free-text phrase in the findings no longer satisfies anything; where these
 * tests wrote it, they now record the structured action (store action recordNotTaken).
 *
 * Real-project D6 (2026-11-26): completion fixtures now carry the engine test-run readings
 * (oil pressure, coolant temperature, output voltage, frequency; oil temperature for low-oil cards).
 * F10-R3 MINOR (2026-11-26): a card with the recorded action completes without test-run readings (completion helper).
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Panel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import ServicePanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { sessionRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { UNCLASSIFIED_PROTECTIVE, SAFEGUARD_LABEL } from '@/lib/generator-oracle/diagnostics/engine';
import { apply, emptyState, serialise, importState, deserialise, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { jobCardReport, recordsStopInForce, signOffSummary, DEVICE_ONLY_NOTICE, IMPORTED_NOTICE, SIGNED_OFF_ELSEWHERE, SIGNOFF, cardContentHash, type JobCard } from '@/lib/generator-oracle/service/maintenance';

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });
const F = (id: string) => FAMILIES.find((f) => f.id === id)!;
const T0 = '2026-11-26T08:00:00.000Z';
const ASSET = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const tryGo = (s: ServiceState, a: ServiceAction) => apply(s, a);
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: ASSET } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
const card = (s: ServiceState) => s.jobCards.find((c) => c.id === 'JC1')! as JobCard;
function record(s: ServiceState, famId: string, at: string): ServiceState {
  const g = guardedSessionRecord(F(famId), loadGuidedSession(localStorage, FAMILIES), loadGuidedEquipment(localStorage), safetyStateOf(readStore()));
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at, safety: g.safety } as ServiceAction);
  return go(s, { type: 'updateCard', cardId: 'JC1', update: guardedCardUpdate(card(s), g) } as ServiceAction);
}
function complete(s: ServiceState, extra: Record<string, unknown> = {}) {
  let st = s;
  if (card(st).status === 'OPEN') { const r1 = tryGo(st, { type: 'transition', cardId: 'JC1', to: 'IN PROGRESS', by: 'Tech', at: T0 } as ServiceAction); if (r1.error) return { error: r1.error, state: st }; st = r1.state; }
  const r2 = tryGo(st, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: T0, update: { tasks: ['inspected'], engineHoursAtJob: 10, readings: recordsStopInForce(st.jobCards[0]) ? [] : [{ name: 'Oil pressure', value: 300, unit: 'kPa' }, { name: 'TEST coolant temperature', value: 80, unit: '°C' }, { name: 'TEST output voltage', value: 400, unit: 'V' }, { name: 'TEST frequency', value: 50, unit: 'Hz' }], ...extra } } as ServiceAction);
  return { error: r2.error, state: r2.state };
}
const reassess = (s: ServiceState, at: string) => go(s, { type: 'recordHoldReassessment', cardId: 'JC1', at, by: 'JK', reason: 'Checked in person on site', confirmed: true } as ServiceAction);
const knockSession = () => localStorage.setItem('eims-oracle-guided-session-v1', JSON.stringify({ version: 1, answers: { 'knock-seizure': { where: 'engine' } }, equipment: {} }));
const imp = (text: string, now: string) => { const r = importState(text, now); if (!r.ok) throw new Error((r as { error?: string }).error); return r.state; };
const mutate = (s: ServiceState, f: (c: Record<string, any>) => void) => { const j = JSON.parse(serialise(s)); f((j.jobCards ?? j.state.jobCards)[0]); return JSON.stringify(j); };

describe('Imported job cards', () => {
  it('a STOP with its clearance in the file: still blocks; needs a fresh clean record on this device AND a fresh reassessment', () => {
    knockSession();
    let s = record(base(), 'knock-seizure', T0);
    const own = card(s).guidedSafety!.stops[0];
    s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at: T0, safety: { stops: [], clearances: [{ ...own, clearedAt: '2026-11-26T09:00:00.000Z', by: 'X', reason: 'cleared elsewhere' }], hold: null } } as ServiceAction);
    expect(complete(s).error).toBeNull(); // on the original device the clearance counts
    localStorage.clear();
    let i = imp(serialise(s), '2026-11-26T10:00:00.000Z');
    expect(card(i).imported).toBeTruthy();
    expect(complete(i).error).toMatch(/still latched|IMPORTED/);
    i = record(i, 'overheating', '2026-11-26T10:05:00.000Z'); // fresh record from an empty browser
    console.log('IMP-1 after fresh empty record:', complete(i).error?.slice(0, 160));
    expect(complete(i).error).toMatch(/still latched|fresh/);
    expect(complete(go(i, { type: 'recordNotTaken', cardId: 'JC1', at: '2026-11-26T23:00:00.000Z', by: 'TECH', confirmed: true } as ServiceAction)).error).toMatch(/reassessment/);
    i = reassess(go(i, { type: 'recordNotTaken', cardId: 'JC1', at: '2026-11-26T23:00:00.000Z', by: 'TECH', confirmed: true } as ServiceAction), '2026-11-26T10:10:00.000Z');
    expect(complete(i).error).toBeNull();
  });
  it('tampered files: forged clearance, resolved hold, reassessment, imported=false/removed/forged freshRecordClean — none counts', () => {
    knockSession();
    const s = record(base(), 'knock-seizure', T0);
    const variants: Record<string, string> = {
      forgedClearance: mutate(s, (c) => { c.guidedSafety.clearances.push({ ...c.guidedSafety.stops[0], clearedAt: '2099-01-01T00:00:00.000Z', by: 'F', reason: 'forged' }); }),
      importedFalse: mutate(s, (c) => { c.imported = false; }),
      importedForged: mutate(s, (c) => { c.imported = { at: '2000-01-01T00:00:00.000Z', stops: 0, clearances: 0, holds: 0, reassessments: 0, signedOff: false, freshRecordAt: '2099-01-01T00:00:00.000Z', freshRecordClean: true, reassessedAt: '2099-01-01T00:00:00.000Z' }; }),
      noImportRecord: mutate(s, (c) => { delete c.imported; }),
    };
    for (const [k, text] of Object.entries(variants)) {
      const r = importState(text, '2026-11-26T10:00:00.000Z');
      if (!r.ok) { console.log(`IMP-2 ${k}: refused (${(r as { error?: string }).error})`); continue; }
      const err = complete(r.state).error;
      console.log(`IMP-2 ${k}: imported=${JSON.stringify(card(r.state).imported).slice(0, 90)} | completion → ${err?.slice(0, 80)}`);
      expect(err, k).not.toBeNull();
    }
  });
  it('hold in the file resolved + forged reassessment; guidedSafety removed; both still need fresh record + fresh reassessment', () => {
    const real = Storage.prototype.getItem;
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, k: string) { if (k === 'eims-oracle-guided-diagnosis-v1') throw new DOMException('b', 'SecurityError'); return real.call(this, k); });
    const s = record(base(), 'overheating', T0);
    spy.mockRestore();
    const forged = mutate(s, (c) => { c.guidedSafety.holds[0].resolvedAt = T0; c.guidedSafety.reassessments = [{ at: '2099-01-01T00:00:00.000Z', by: 'F', reason: 'forged in the file', confirmed: true }]; });
    const removed = mutate(s, (c) => { delete c.guidedSafety; });
    for (const [k, text] of [['forgedHold', forged], ['removed', removed]] as const) {
      let i = imp(text, '2026-11-26T10:00:00.000Z');
      expect(complete(i).error, k).toMatch(/IMPORTED|SAFETY HOLD/);
      localStorage.clear();
      i = record(i, 'overheating', '2026-11-26T10:05:00.000Z');
      expect(complete(i).error, `${k} without reassessment`).toMatch(/reassessment|SAFETY HOLD/);
      i = reassess(i, '2026-11-26T10:06:00.000Z');
      console.log(`IMP-3 ${k}: after fresh clean record + fresh reassessment → ${complete(i).error}`);
      expect(complete(i).error).toBeNull();
    }
  });
  it('import twice / export then re-import: this-device clearances made after the first import become imported again (not proof)', () => {
    knockSession();
    const s = record(base(), 'knock-seizure', T0);
    localStorage.clear();
    let i = imp(serialise(s), '2026-11-26T10:00:00.000Z');
    const st = card(i).guidedSafety!.stops[0];
    i = go(i, { type: 'recordGuidedSafety', cardId: 'JC1', at: '2026-11-26T10:30:00.000Z', safety: { stops: [], clearances: [{ ...st, clearedAt: '2026-11-26T10:30:00.000Z', by: 'JK', reason: 'cleared on this device' }], hold: null } } as ServiceAction);
    i = reassess(i, '2026-11-26T10:31:00.000Z');
    const before = complete(i).error;
    const again = imp(serialise(i), '2026-11-26T11:00:00.000Z');
    const after = complete(again).error;
    console.log('IMP-4 on device before re-import →', before, '| after re-import →', after?.slice(0, 100));
    expect(after).not.toBeNull();
  });
  it('sign-off: an imported signed-off card never claims a verified hash; recomputed hash in the file is still "UNVERIFIED here"', () => {
    let s = base();
    s = go(s, { type: 'updateCard', cardId: 'JC1', update: { findings: 'ok' } } as ServiceAction);
    const c = complete(s); s = c.state;
    s = go(s, { type: 'transition', cardId: 'JC1', to: SIGNOFF, by: 'Sup', at: T0 } as ServiceAction);
    const tamper = mutate(s, (cc) => { cc.findings = 'edited after sign-off'; const h = cardContentHash({ ...cc, findings: 'edited after sign-off' } as JobCard, cc.signOffTypedName, cc.signOffRecordedOn, cc.revision); cc.signOffHash = h; for (const l of cc.log) if (l.hash) l.hash = h; });
    const i = imp(tamper, '2026-11-26T10:00:00.000Z');
    const summ = signOffSummary(card(i)).join(' | ');
    console.log('IMP-5 sign-off summary:', summ.slice(0, 300));
    expect(summ).toContain(SIGNED_OFF_ELSEWHERE);
    expect(summ).not.toMatch(/matches the hash recorded at sign-off/);
    const txt = jobCardReport(card(i), ASSET);
    expect(txt).toContain('SAFETY — IMPORTED CARD (UNVERIFIED on this device)');
    expect(txt).toContain(IMPORTED_NOTICE);
  });
  it('own saved data is never marked imported (loadState/deserialise); only importState marks', () => {
    const s = base();
    const r = deserialise(serialise(s)) as unknown as { state: ServiceState };
    expect(card(r.state).imported).toBeUndefined();
    expect(card(imp(serialise(s), T0)).imported).toBeTruthy();
  });
});

describe('F10 units', () => {
  const lop = (raw: Record<string, string>) => sessionRecord(F('low-oil-pressure'), { 'low-oil-pressure': raw }).result;
  const oh = (raw: Record<string, string>) => sessionRecord(F('overheating'), { overheating: raw }).result;
  it('20 psi against a 150 kPa minimum → STOP (20 psi = 137.9 kPa); 1.5 bar minimum = 150 kPa, reading 150 kPa → STOP (equality); 21.7556 psi ≈ 149.9995 kPa → STOP, 21.7557 psi ≈ 150.0003 kPa → inside', () => {
    expect(lop({ oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }).stopActive).toBe(true);
    expect(lop({ oilPressure: '150', 'oilPressure.unit': 'kPa', oemMinOilPressure: '1.5', 'oemMinOilPressure.unit': 'bar' }).stopActive).toBe(true);
    expect(lop({ oilPressure: '21.7556', 'oilPressure.unit': 'psi', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }).stopActive).toBe(true);
    expect(lop({ oilPressure: '21.7557', 'oilPressure.unit': 'psi', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }).stopActive).toBe(false);
    expect(lop({ oilPressure: '30', 'oilPressure.unit': 'psi', oemMinOilPressure: '30', 'oemMinOilPressure.unit': 'psi' }).stopActive).toBe(true);
    expect(lop({ oilPressure: '30.01', 'oilPressure.unit': 'psi', oemMinOilPressure: '30', 'oemMinOilPressure.unit': 'psi' }).stopActive).toBe(false);
  });
  it('°F limits: 221 °F (=105 °C) vs 105 °C → reached; 104.9 °C inside; 221 °F reading reached; tolerance 2 °F (1.11 °C) at 104 °C → near → STOP; 1 °F → inside', () => {
    const L = { oemAlarmCoolantTemp: '221', 'oemAlarmCoolantTemp.unit': '°F' };
    expect(oh({ ...L, coolantTemp: '105', 'coolantTemp.unit': '°C' }).stopActive).toBe(true);
    expect(oh({ ...L, coolantTemp: '104.9', 'coolantTemp.unit': '°C' }).stopActive).toBe(false);
    expect(oh({ ...L, coolantTemp: '221', 'coolantTemp.unit': '°F' }).stopActive).toBe(true);
    expect(oh({ ...L, coolantTemp: '104', 'coolantTemp.unit': '°C', 'coolantTemp.tol': '2' }).stopActive).toBe(true);
    expect(oh({ ...L, coolantTemp: '219', 'coolantTemp.unit': '°F', 'coolantTemp.tol': '2' }).stopActive).toBe(true); // 219 °F ±2 °F reaches 221 °F
    expect(oh({ ...L, coolantTemp: '219', 'coolantTemp.unit': '°F', 'coolantTemp.tol': '1' }).stopActive).toBe(false);
  });
  it('refusals: no unit, unknown unit, not a number → refused, not used, running checks withheld, re-asked', () => {
    for (const raw of [{ oilPressure: '20' }, { oilPressure: '20', 'oilPressure.unit': 'mmHg' }, { oilPressure: 'abc', 'oilPressure.unit': 'kPa' }] as Record<string, string>[]) {
      const r = lop({ ...raw, oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa', gauge: 'sender' });
      expect(r.invalid.some((x) => x.q === 'oilPressure'), JSON.stringify(raw)).toBe(true);
      expect(r.runningWithheld).toBe(true);
      expect(r.nextQuestion?.id === 'oilPressure' || !(r.nextQuestion as { needsRunning?: boolean } | null)?.needsRunning).toBe(true);
    }
  });
  it('F10-REMAINING fixed: a reading that is a STOP in every allowed unit but has NO unit gives a STOP and blocks the job card; the same for a limit with no unit', () => {
    // "20" is ≤ 150 kPa as kPa (20) and as psi (137.9); only "bar" (2000 kPa) would be inside.
    // "10" with no unit is ≤ 150 kPa in kPa (10), psi (68.9) AND bar (1000 kPa? no: 1000 > 150).
    const r1 = lop({ oilPressure: '1', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' }); // 1 kPa, 1 psi (6.9) and 1 bar (100 kPa): a STOP in EVERY unit
    console.log('F10-gap reading "1" no unit: stopActive =', r1.stopActive, '| invalid =', r1.invalid.map((i) => i.q));
    expect(r1.stopActive).toBe(true);
    const r2 = lop({ oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150' });
    console.log('F10-gap limit "150" no unit, reading 20 psi: stopActive =', r2.stopActive, '| limit status =', r2.limits[0].status);
    expect(r2.stopActive).toBe(true);
    localStorage.setItem('eims-oracle-guided-session-v1', JSON.stringify({ version: 1, answers: { 'low-oil-pressure': { oilPressure: '1', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' } }, equipment: {} }));
    const s = record(base(), 'low-oil-pressure', T0);
    const e = complete(s).error;
    console.log('F10-gap card completion with the unit-less 1:', e);
    expect(e).toMatch(/still latched|STOP/);
  });
  it('a unit-less reading on the panel: refusal is shown and running steps are withheld on screen', () => {
    const { container: c } = render(<Panel />);
    fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === F('low-oil-pressure').title)!);
    const inp = c.querySelectorAll('[id="gd-all-oilPressure"]'); fireEvent.change(inp[inp.length - 1], { target: { value: '1' } }); fireEvent.blur(inp[inp.length - 1]);
    const t = c.textContent ?? '';
    expect(t).toMatch(/choose the unit/);
    for (const r of F('low-oil-pressure').causes.flatMap((x) => x.runningChecks ?? [])) expect(t).not.toContain(r);
  });
  it('the record lists "Units as entered" with the conversion', () => {
    const rec = sessionRecord(F('low-oil-pressure'), { 'low-oil-pressure': { oilPressure: '20', 'oilPressure.unit': 'psi', oemMinOilPressure: '150', 'oemMinOilPressure.unit': 'kPa' } });
    const i = rec.lines.indexOf('Units as entered (pressures and temperatures; the checks use kPa and °C):');
    console.log('F10 units lines:', rec.lines.slice(i, i + 3));
    expect(i).toBeGreaterThan(-1);
    expect(rec.findings).toMatch(/entered 20 psi = 137\.9 kPa/);
  });
});

describe('F11 charging over-voltage', () => {
  const ch = (raw: Record<string, string>) => sessionRecord(F('charging'), { charging: { systemVoltage: '24', oemChargeMin: '26', ...raw } }).result;
  it('equality reaches; unclassified → conservative STOP with label; shutdown → STOP; warning → CAUTION; below → inside; no limit → NOT VERIFIED', () => {
    const u = ch({ runVoltage: '29', oemChargeMax: '29' });
    expect(u.stopActive).toBe(true);
    expect(u.stops.find((s) => s.level === 'STOP')!.message).toBe(UNCLASSIFIED_PROTECTIVE);
    expect(u.stops.find((s) => s.level === 'STOP')!.label).toBe(SAFEGUARD_LABEL);
    expect(ch({ runVoltage: '29', oemChargeMax: '29', 'oemChargeMax.class': 'shutdown' }).stopActive).toBe(true);
    const w = ch({ runVoltage: '29', oemChargeMax: '29', 'oemChargeMax.class': 'warning' });
    expect(w.stopActive).toBe(false); expect(w.limits.find((l) => l.id === 'charge-max')!.level).toBe('CAUTION');
    expect(ch({ runVoltage: '28.99', oemChargeMax: '29' }).stopActive).toBe(false);
    expect(ch({ runVoltage: '35' }).limits.find((l) => l.id === 'charge-max')!.status).toBe('not-verified');
  });
  it('boiling / spewing electrolyte → STOP without any threshold; regulator-overcharging leading → running checks withheld', () => {
    const b = sessionRecord(F('charging'), { charging: { batteryCondition: 'boiling' } }).result;
    expect(b.stopActive).toBe(true);
    const r = sessionRecord(F('charging'), { charging: { systemVoltage: '24', runVoltage: '28', oemChargeMax: '29', 'oemChargeMax.class': 'warning', oemChargeMin: '26', batteryCondition: 'gassing' } }).result;
    console.log('F11 overcharging leading: top =', r.ranked[0]?.id, '| runningWithheld =', r.runningWithheld);
  });
  it('F10-REMAINING fixed (cross-check): 24 V system with 12 V-style band entered → refused → conservative STOP, no running checks', () => {
    const r = sessionRecord(F('charging'), { charging: { systemVoltage: '24', runVoltage: '35', oemChargeMin: '13', oemChargeMax: '14.4' } }).result;
    console.log('F11 refused band: stopActive =', r.stopActive, '| invalid =', r.invalid.map((i) => i.q).join(','));
    expect(r.stopActive).toBe(true);
    expect(r.runningWithheld).toBe(true);
  });
});

describe('Device-only notice', () => {
  it('on Guided Diagnosis, on the job-card screen and in every card .txt', () => {
    const a = render(<Panel />);
    expect(a.container.querySelector('[data-testid="gd-device-only-notice"]')!.textContent).toBe(DEVICE_ONLY_NOTICE);
    cleanup();
    const b = render(<ServicePanel />);
    expect(b.container.querySelector('[data-testid="device-only-notice"]')!.textContent).toContain(DEVICE_ONLY_NOTICE);
    cleanup();
    expect(jobCardReport(card(base()), ASSET)).toContain(`SAFETY: ${DEVICE_ONLY_NOTICE}`);
    console.log('notice:', DEVICE_ONLY_NOTICE);
  });
});
