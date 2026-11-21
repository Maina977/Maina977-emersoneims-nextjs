import { describe, it, expect } from 'vitest';
import { finalVerdict } from '@/external/borehole-ai-engine/src/verdict';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';

// The TDS value comes from a regional model, not a water sample: the verdict
// states its band, never a precise mg/L figure (2026-11-21).
const r = (tds: number) => ({ probability: 0.7, risk: { overallRisk: 0.3 }, waterQuality: { tds } }) as unknown as AnalysisResult;

describe('AquaScan verdict: salinity shown as a band, not a figure', () => {
  it('8,495 mg/L modelled → "above 3,000", unfavourable, no 8495 in the text', () => {
    const v = finalVerdict(r(8495));
    expect(v.level).toBe('unfavourable');
    expect(v.next).toMatch(/TDS above 3,000 mg\/L, not measured here/);
    expect(v.next).not.toMatch(/8495|8,495/);
    expect(v.next).toMatch(/laboratory test of the first water/);
  });
  it('1,800 mg/L modelled → "above the 1,000 mg/L drinking limit", favourable downgraded to mixed', () => {
    const v = finalVerdict(r(1800));
    expect(v.level).toBe('mixed');
    expect(v.next).toMatch(/above the 1,000 mg\/L drinking limit \(not measured here\)/);
    expect(v.next).not.toMatch(/1800|1,800/);
  });
  it('below 1,000 mg/L → no salinity note', () => {
    expect(finalVerdict(r(600)).next).not.toMatch(/salinity/i);
  });
});
