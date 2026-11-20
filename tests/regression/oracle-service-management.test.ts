import { describe, it, expect } from 'vitest';
import { dueList, openJobCard, transition, toServiceRecord, jobCardReport, readingFlags, type PlanTask, type ServiceRecord, type Asset } from '@/lib/generator-oracle/service/maintenance';

// TEST plan values with TEST manual references — never real OEM intervals.
const ref = { document: 'TEST O&M manual', edition: 'TEST ed. 1', page: '42' };
const plan: PlanTask[] = [
  { id: 'OIL', task: 'Engine oil and filter', intervalHours: 250, intervalMonths: 12, source: ref },
  { id: 'AIR', task: 'Air filter inspection', intervalMonths: 6, source: ref },
  { id: 'COOL', task: 'Coolant test', intervalHours: 1000, source: ref },
];
const history: ServiceRecord[] = [{ date: '2026-01-10', engineHours: 1200, taskIds: ['OIL', 'AIR'], jobCardId: 'JC-1', technician: 'TECH-A' }];
const asset: Asset = { id: 'A1', make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 };

describe('maintenance due list', () => {
  it('hours or months, whichever first; no history is DUE, never OK', () => {
    const d = dueList(plan, history, { date: '2026-06-01', engineHours: 1430 }, { hours: 25, days: 14 });
    const by = Object.fromEntries(d.map((x) => [x.taskId, x]));
    expect(by.OIL.status).toBe('DUE SOON');           // next 1450 h; 1430 ≥ 1450 − 25
    expect(by.OIL.nextDueHours).toBe(1450);
    expect(by.OIL.nextDueDate).toBe('2027-01-10');
    expect(by.AIR.status).toBe('OK');                 // due 2026-07-10; "soon" window starts 2026-06-26
    expect(by.COOL.status).toBe('DUE (NO HISTORY)');
    expect(by.OIL.source).toMatch(/TEST O&M manual, TEST ed\. 1, p\. 42/);
    const later = Object.fromEntries(dueList(plan, history, { date: '2026-08-01', engineHours: 1440 }, { hours: 25, days: 14 }).map((x) => [x.taskId, x]));
    expect(later.AIR.status).toBe('OVERDUE');         // calendar limit passed before the hours limit
    expect(later.OIL.status).toBe('DUE SOON');
  });
  it('rejects a plan task without an OEM reference, and an hour meter that went backwards', () => {
    expect(() => dueList([{ id: 'X', task: 'x', intervalHours: 250, source: { document: '', edition: '', page: '' } }], [], { date: '2026-06-01', engineHours: 10 }, { hours: 1, days: 1 })).toThrow(/cite the OEM manual/);
    expect(() => dueList(plan, history, { date: '2026-06-01', engineHours: 900 }, { hours: 1, days: 1 })).toThrow(/hour meter/);
  });
});

describe('job cards', () => {
  const start = () => transition(openJobCard({ id: 'JC-2', assetId: 'A1', opened: '2026-11-20', reportedFault: 'Shutdown on low oil pressure', faultCodes: ['DSE-LOP'], technician: 'TECH-A' }), 'IN PROGRESS', 'TECH-A', '2026-11-20T08:00:00Z');
  it('cannot skip steps; completion needs findings, work, hours and readings', () => {
    const c = openJobCard({ id: 'JC-3', assetId: 'A1', opened: '2026-11-20', reportedFault: 'x', technician: 'TECH-A' });
    expect(() => transition(c, 'COMPLETED', 'TECH-A', '2026-11-20T09:00:00Z')).toThrow(/cannot go from OPEN to COMPLETED/);
    expect(() => transition(start(), 'COMPLETED', 'TECH-A', '2026-11-20T10:00:00Z')).toThrow(/findings, work done, engine-hour reading, test-run readings/);
  });
  it('sign-off: not by the technician; parts need a parts-book source; out-of-limit readings block', () => {
    const done = transition(start(), 'COMPLETED', 'TECH-A', '2026-11-20T12:00:00Z', {
      findings: 'Oil pressure sender faulty; replaced', tasks: ['Replace oil pressure sender'], engineHoursAtJob: 1500,
      parts: [{ partNo: 'TEST-123', description: 'Oil pressure sender', qty: 1, compatibility: null }],
      readings: [{ name: 'Output voltage L1-L2', value: 405, unit: 'V', min: 380, max: 420, limitSource: 'rating plate (test)' }],
    });
    expect(() => transition(done, 'SIGNED OFF', 'TECH-A', '2026-11-20T13:00:00Z')).toThrow(/supervisor other than the technician/);
    expect(() => transition(done, 'SIGNED OFF', 'SUPERVISOR-B', '2026-11-20T13:00:00Z')).toThrow(/Compatibility unverified for: TEST-123/);
    const fixed = { ...done, parts: [{ ...done.parts[0], compatibility: { document: 'TEST parts book', edition: 'TEST ed.', page: '7' } }] };
    const signed = transition(fixed, 'SIGNED OFF', 'SUPERVISOR-B', '2026-11-20T13:00:00Z');
    expect(signed.signedOffBy).toBe('SUPERVISOR-B');
    expect(toServiceRecord(signed, ['OIL'])).toMatchObject({ engineHours: 1500, jobCardId: 'JC-2', date: '2026-11-20' });
    expect(jobCardReport(signed, asset)).toMatch(/Signed off by SUPERVISOR-B/);
  });
  it('readings: flagged only against limits given with a source', () => {
    expect(readingFlags([{ name: 'Frequency', value: 52.1, unit: 'Hz', min: 49.5, max: 50.5, limitSource: 'controller settings sheet (test)' }])).toEqual(['Frequency 52.1 Hz is above 50.5 Hz (controller settings sheet (test))']);
    expect(readingFlags([{ name: 'Frequency', value: 50, unit: 'Hz' }])).toEqual([]);
    expect(readingFlags([{ name: 'Frequency', value: 50, unit: 'Hz', max: 51 }])).toEqual(['Frequency: limit given without its source']);
  });
});
