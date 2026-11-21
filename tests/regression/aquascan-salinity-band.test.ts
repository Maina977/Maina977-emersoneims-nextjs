import { describe, it, expect } from 'vitest';
import { finalVerdict, salinityEvidence } from '@/external/borehole-ai-engine/src/verdict';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';

// 2026-11-21 management directive: a modelled salinity must not read as a
// measured or quantitatively verified concentration. The verdict shows a
// screening class only (no mg/L figure, no threshold attached to it); the
// internal number still sets the verdict level.
const r = (tds: number, extra: Record<string, unknown> = {}) =>
  ({ probability: 0.7, risk: { overallRisk: 0.3 }, waterQuality: { tds, ...extra } }) as unknown as AnalysisResult;
const nearby = (tds: number) => r(tds, { measuredNearby: { radius_km: 25, ec: { n: 6, median: 9000, over1500: 6, over3000: 5 } } });

describe('AquaScan verdict: modelled salinity is a screening class, never a figure', () => {
  it('8,495 mg/L modelled: HIGH class, unfavourable, no figure or threshold', () => {
    const v = finalVerdict(r(8495));
    expect(v.level).toBe('unfavourable');
    expect(v.next).toMatch(/Salinity risk: HIGH \(regional screening, not measured at this site\)/);
    expect(v.next).toMatch(/Regional data indicate a high risk of saline groundwater here/);
    expect(v.next).toMatch(/laboratory test of the first water/);
    expect(v.next).not.toMatch(/mg\/L/);
    expect(v.next).not.toMatch(/8495|8,495|3,000|3000|1,000|1000/);
    expect(v.next).not.toMatch(/\babout\b|\babove\b/i);
  });
  it('1,800 mg/L modelled: ELEVATED class, favourable downgraded to mixed, no figure', () => {
    const v = finalVerdict(r(1800));
    expect(v.level).toBe('mixed');
    expect(v.next).toMatch(/Salinity risk: ELEVATED \(regional screening, not measured at this site\)/);
    expect(v.next).not.toMatch(/mg\/L/);
    expect(v.next).not.toMatch(/1800|1,800|1,000|1000/);
    expect(v.next).not.toMatch(/reverse osmosis/i);
  });
  it('below 1,000 mg/L: no salinity note, level unchanged', () => {
    const v = finalVerdict(r(600));
    expect(v.next).not.toMatch(/salinity/i);
    expect(v.level).toBe('favourable');
  });
  it('the levels follow the internal value exactly as before', () => {
    expect(finalVerdict(r(2999)).level).toBe('mixed');
    expect(finalVerdict(r(3000)).level).toBe('unfavourable');
    expect(finalVerdict(r(999)).level).toBe('favourable');
  });
});

describe('AquaScan verdict: measured salinity keeps its figure and source', () => {
  it('median of 6 boreholes within 25 km is stated as measured, with the figure', () => {
    const v = finalVerdict(nearby(5850));
    expect(v.level).toBe('unfavourable');
    expect(v.next).toMatch(/measured salinity is high \(TDS 5,850 mg\/L, median of 6 boreholes within 25 km/);
    expect(v.next).not.toMatch(/regional screening/);
  });
  it('fewer than 3 boreholes nearby is not a measurement', () => {
    const few = r(5850, { measuredNearby: { radius_km: 25, ec: { n: 2 } } });
    expect(salinityEvidence(few).basis).toBe('modelled');
    expect(finalVerdict(few).next).not.toMatch(/5,850|5850/);
  });
  it('a laboratory result is reported on its own figure', () => {
    const lab = { ...r(8495), calibrationResult: { calibratedWaterQuality: { tds: 2400, labName: 'KEBS', sampleDate: '2026-11-01' } } } as unknown as AnalysisResult;
    const e = salinityEvidence(lab);
    expect(e.basis).toBe('lab');
    expect(e.value).toBe('2,400 mg/L');
    expect(e.source).toBe('Measured: laboratory test (KEBS, sampled 2026-11-01)');
    const v = finalVerdict(lab);
    expect(v.next).toMatch(/TDS 2,400 mg\/L, laboratory test/);
    expect(v.next).not.toMatch(/8,495|8495/);
  });
});

describe('AquaScan verdict: the best salinity evidence sets the level (2026-11-21)', () => {
  it('a laboratory 500 mg/L overrides a modelled 8,495: not unfavourable, no salinity note', () => {
    const lab = { ...r(8495), calibrationResult: { calibratedWaterQuality: { tds: 500, labName: 'KEBS', sampleDate: '2026-11-01' } } } as unknown as AnalysisResult;
    const v = finalVerdict(lab);
    expect(v.level).toBe('favourable');
    expect(v.next).not.toMatch(/salin/i);
  });
  it('a laboratory 3,400 mg/L with a modelled 600: unfavourable, measured figure stated', () => {
    const lab = { ...r(600), calibrationResult: { calibratedWaterQuality: { tds: 3400, labName: 'KEBS', sampleDate: '2026-11-01' } } } as unknown as AnalysisResult;
    const v = finalVerdict(lab);
    expect(v.level).toBe('unfavourable');
    expect(v.next).toMatch(/TDS 3,400 mg\/L, laboratory test/);
  });
});
