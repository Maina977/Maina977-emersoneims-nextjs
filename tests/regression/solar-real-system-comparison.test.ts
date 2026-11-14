import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { compareRealSystems } from '@/lib/solar/design/comparison';

const HEAD = 'systemId,site_county,commissioned,designFile,toolVersion,kWp,inverterModel,batteryKwh,month,predicted_kWh,measured_kWh,measuredSource,measuredFileRef,dataGap_days,notes';
// SYNTHETIC rows for the importer only.
const r = (id: string, month: string, p: number, m: number | '', src = 'inverter portal export', ref = 'exports/x.csv', gap = 0, notes = '') =>
  `${id},Nairobi,2025-01-10,design.pdf,solar-production 1.0.0,10,TI-15,0,${month},${p},${m},${src},${ref},${gap},${notes}`;

describe('real-system comparison importer', () => {
  it('the committed template has no data and reports INSUFFICIENT', () => {
    const rep = compareRealSystems(fs.readFileSync('docs/solar-validation/real-system-comparison-template.csv', 'utf8'));
    expect(rep.systemsWithData).toBe(0);
    expect(rep.status).toMatch(/INSUFFICIENT: 0 of the 10/);
  });
  it('error per system: (1200 + 1100 − 1250 − 1000) / 2250 = 2.2 %', () => {
    const rep = compareRealSystems([HEAD, r('S1', '2026-01', 1200, 1250), r('S1', '2026-02', 1100, 1000)].join('\n'));
    expect(rep.systems[0].errorPct).toBe(2.2);
    expect(rep.systems[0].monthsOver15).toEqual([]);
  });
  it('months with gaps or without a source file are excluded and listed, never filled', () => {
    const rep = compareRealSystems([HEAD, r('S1', '2026-01', 1200, 1250), r('S1', '2026-02', 1100, 900, 'meter', 'f', 3), r('S1', '2026-03', 1100, 1000, '', ''), r('S1', '2026-04', 1100, '')].join('\n'));
    expect(rep.systems[0].months).toBe(1);
    expect(rep.systems[0].excluded.map((x) => x.why)).toEqual(['3 day(s) of missing data', 'measured value without its source file', 'no measured value']);
  });
  it('a month over 15 % needs a reason', () => {
    const rep = compareRealSystems([HEAD, r('S1', '2026-01', 1200, 900)].join('\n'));
    expect(rep.systems[0].monthsOver15).toEqual([{ month: '2026-01', errorPct: 33.3, reasonGiven: false }]);
    const ok = compareRealSystems([HEAD, r('S1', '2026-01', 1200, 900, 'meter', 'f', 0, 'grid outage 6 days')].join('\n'));
    expect(ok.systems[0].monthsOver15[0].reasonGiven).toBe(true);
  });
  it('bad rows are reported', () => {
    expect(compareRealSystems([HEAD, r('S1', 'Jan 2026', 1200, 900)].join('\n')).rowErrors[0]).toMatch(/YYYY-MM/);
  });
});
