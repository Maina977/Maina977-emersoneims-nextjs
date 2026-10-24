/**
 * Rule-based fault lookup used by /api/ai/chat (2026-10-20 audit: "overheating"
 * returned an oil-pressure, then an oil-temperature code first).
 */
import { describe, it, expect } from 'vitest';
import { analyzeSymptoms } from '@/lib/ai/diagnosticAI';

describe('analyzeSymptoms', () => {
  it('overheating ranks a coolant temperature code first', () => {
    const r = analyzeSymptoms('my generator is overheating');
    expect(r.matchedCodes[0]?.title).toMatch(/coolant/i);
  });
  it('the returned score never exceeds 99', () => {
    const r = analyzeSymptoms('Cummins generator overheating and shutting down, coolant temperature high');
    for (const m of r.matchedCodes) expect(m.confidence).toBeLessThanOrEqual(99);
  });
});

describe('reading direction (2026-10-20 audit round 2)', () => {
  it('"engine overheating" is not answered with a below-normal (FMI 1) code', () => {
    const r = analyzeSymptoms('engine overheating');
    expect(r.matchedCodes[0]?.code).not.toMatch(/FMI ?(1|17|18)\b/);
  });
  it('"low oil pressure" puts a below-normal oil pressure code first', () => {
    const r = analyzeSymptoms('low oil pressure warning');
    const top = r.matchedCodes[0];
    expect(top?.title).toMatch(/oil pressure/i);
    expect(String(top?.code)).not.toMatch(/FMI ?(0|15|16)\b/);
  });
});
