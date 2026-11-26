// @vitest-environment jsdom
/**
 * Real-project testing (2026-11-26) defects D6 (Oracle job-card test run) and D5 (Hub Maintenance
 * Planner demo). TEST values only; no client data.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import MaintenanceClient, { PER_OEM_INTERVAL } from '@/components/hub/MaintenanceClient';
import {
  jobCardReport, missingTestRunReadings, openJobCard, recordNotTaken, requiredTestRunReadings, transition,
  type Asset, type JobCard, type Reading,
} from '@/lib/generator-oracle/service/maintenance';

afterEach(cleanup);
const ASSET: Asset = { id: 'A-1', make: 'TEST', model: 'T', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const card = (findings = 'TEST service done'): JobCard => ({ ...openJobCard({ id: 'JC-1', assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST', technician: 'TECH-A' }), status: 'IN PROGRESS', findings, tasks: ['TEST oil and filter'], engineHoursAtJob: 1200 });
const BASE: Reading[] = [
  { name: 'Oil pressure', value: 350, unit: 'kPa', min: 200, limitSource: 'TEST manual p. 1', checklistId: 'oilPressure' },
  { name: 'Coolant temperature', value: 82, unit: '°C', checklistId: 'coolantTemp' },
  { name: 'Output voltage L1-L2', value: 401, unit: 'V', checklistId: 'voltage' },
  { name: 'Frequency', value: 50.1, unit: 'Hz', checklistId: 'frequency' },
];
const complete = (c: JobCard, readings: Reading[]) => transition(c, 'COMPLETED', 'TECH-A', '2026-11-26T12:00', { readings });

describe('D6: completion needs the test-run readings this job needs, not any reading', () => {
  it('a single reading with no limit does not complete; the blocker lists what is missing', () => {
    expect(() => complete(card(), [{ name: 'TEST', value: 1, unit: 'V' }])).toThrow(/test-run readings for this job: Oil pressure measured \(kPa \/ bar \/ psi\); Coolant temperature \(°C \/ °F\); Output voltage, line to line \(V\); Frequency \(Hz\)/);
  });
  it('the engine test-run set completes; a reading without a limit is printed NOT VERIFIED, not a pass', () => {
    const done = complete(card(), BASE);
    expect(done.status).toBe('COMPLETED');
    const txt = jobCardReport(done, ASSET);
    expect(txt).toContain('Coolant temperature: 82 °C (no limit given — NOT VERIFIED, not a pass)');
    expect(txt).toContain('Oil pressure: 350 kPa (limits min 200 kPa, source: TEST manual p. 1)');
  });
  it('a reading in the wrong kind of unit does not count', () => {
    expect(missingTestRunReadings({ findings: '', readings: [{ ...BASE[0], unit: 'V' }, ...BASE.slice(1)] })).toEqual(['Oil pressure measured (kPa / bar / psi)']);
  });
  it('a card with a Guided Diagnosis record also needs that family\'s protective readings (no limit invented)', () => {
    const c = card('GUIDED DIAGNOSIS: Low oil pressure / oil starvation [low-oil-pressure] — oracle-diagnostics 1.3.0; content status: x.');
    expect(requiredTestRunReadings(c).map((r) => r.id)).toEqual(['oilPressure', 'coolantTemp', 'voltage', 'frequency', 'oilTemp']);
    expect(() => complete(c, BASE)).toThrow(/Oil temperature \(°C \/ °F\)/);
    expect(complete(c, [...BASE, { name: 'Oil temperature', value: 95, unit: '°C', checklistId: 'oilTemp' }]).status).toBe('COMPLETED');
  });
  it('a card with a charging STOP needs the battery voltage while running', () => {
    const c = { ...card(), guidedSafety: { stops: [{ key: 'charging|x', from: 'Charging', since: '2026-11-26T08:00:00.000Z', message: 'x' }], clearances: [], holds: [] } };
    expect(missingTestRunReadings({ ...c, readings: BASE })).toEqual([expect.stringMatching(/^Battery voltage at the terminals/)]);
  });
  it('the structured "readings not taken — STOP in force" action still replaces the readings', () => {
    const c = { ...card(), guidedSafety: recordNotTaken(undefined, { at: '2026-11-26T11:00:00.000Z', by: 'TECH-A', confirmed: true }) };
    expect(complete(c, []).status).toBe('COMPLETED');
  });
});

describe('D5: Hub Maintenance Planner demo — genset service items by engine hours, per OEM manual', () => {
  it('no "250 d"; oil + oil filter, fuel filter, air filter and coolant are listed with "per OEM manual (enter from the manual)"', () => {
    const { container } = render(<MaintenanceClient />);
    const t = container.textContent ?? '';
    expect(t).not.toMatch(/interval: 250 d/);
    for (const task of ['Oil + oil filter change', 'Fuel filter change', 'Air filter check / change', 'Coolant check / change']) expect(t).toContain(task);
    expect(screen.getAllByText(`interval: ${PER_OEM_INTERVAL}`)).toHaveLength(4);
    expect(PER_OEM_INTERVAL).toBe('engine hours — per OEM manual (enter from the manual)');
  });
});
