import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { importBoreholesCsv, BOREHOLE_CSV_COLUMNS } from '@/lib/aquascan-validation/importCsv';

const HEAD = BOREHOLE_CSV_COLUMNS.join(',');
// SYNTHETIC rows for the importer only.
const row = (o: Record<string, string>) => BOREHOLE_CSV_COLUMNS.map((c) => o[c] ?? '').join(',');
const good = { id: 'T-1', lat: '-1.2', lon: '36.9', positionSource: 'gps', drilledOn: '2024-02-01', county: 'Nairobi', setting: 'volcanic', drilledDepthM: '180', staticWaterLevelM: '60', waterStrikesM: '95;140', testedYieldM3h: '4.5', pumpTestRateM3h: '4.5', pumpTestDurationH: '24', pumpTestDrawdownM: '22', outcome: 'productive', productiveThresholdM3h: '1', sourceDocument: 'synthetic', verification: 'verified', licence: 'synthetic' };

describe('borehole CSV import', () => {
  it('the template has exactly the importer columns', () => {
    const t = fs.readFileSync('docs/aquascan-validation/boreholes-template.csv', 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#'));
    expect(t[0]).toBe(HEAD);
  });
  it('a complete row imports and passes the record checks', () => {
    const r = importBoreholesCsv(`${HEAD}\n${row(good)}`);
    expect(r.rowErrors).toEqual([]);
    expect(r.accepted).toHaveLength(1);
    expect(r.accepted[0].waterStrikesM).toEqual([95, 140]);
    expect(r.accepted[0].pumpTest).toEqual({ rateM3h: 4.5, durationH: 24, drawdownM: 22 });
  });
  it('units in numeric cells and unknown categories are refused, not guessed', () => {
    const r = importBoreholesCsv(`${HEAD}\n${row({ ...good, drilledDepthM: '180m', setting: 'granite' })}`);
    expect(r.parsed).toHaveLength(0);
    expect(r.rowErrors[0].errors.join(' ')).toMatch(/drilledDepthM: "180m"/);
    expect(r.rowErrors[0].errors.join(' ')).toMatch(/setting/);
  });
  it('a quoted field with a comma is read correctly', () => {
    const r = importBoreholesCsv(`${HEAD}\n${row({ ...good, sourceDocument: '"Completion report, WRA ref 12"' })}`);
    expect(r.accepted[0].sourceDocument).toBe('Completion report, WRA ref 12');
  });
  it('missing columns are reported', () => {
    expect(importBoreholesCsv('id,lat\nX,1').rowErrors[0].errors[0]).toMatch(/Missing columns/);
  });
  it('record checks still apply after import (dry with a yield is rejected)', () => {
    const r = importBoreholesCsv(`${HEAD}\n${row({ ...good, outcome: 'dry' })}`);
    expect(r.accepted).toHaveLength(0);
    expect(r.issues.map((i) => i.message).join(' ')).toMatch(/dry/);
  });
});
