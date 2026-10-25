/**
 * Rule-based fault lookup used by /api/ai/chat (2026-10-20 audit: "overheating"
 * returned an oil-pressure, then an oil-temperature code first).
 */
import { describe, it, expect } from 'vitest';
import { analyzeSymptoms, getExactCode } from '@/lib/ai/diagnosticAI';

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

describe('J1939 exact lookup (2026-10-20 audit round 3)', () => {
  it('"SPN 110 FMI 0" finds coolant temperature high, not an alarm numbered 110', () => {
    const c = getExactCode('SPN 110 FMI 0');
    expect(c?.title).toMatch(/Coolant Temperature/i);
    expect(c?.title).toMatch(/Above normal/i);
  });
  it('"110-0" and "SPN110-FMI0" find the same code', () => {
    expect(getExactCode('110-0')?.code).toBe(getExactCode('SPN 110 FMI 0')?.code);
    expect(getExactCode('SPN110-FMI0')?.code).toBe(getExactCode('SPN 110 FMI 0')?.code);
  });
});

describe('symptom relevance (2026-10-20 audit round 3)', () => {
  it('"black smoke and low power" does not list fuel-temperature or barometric codes', () => {
    const r = analyzeSymptoms('black smoke and low power');
    const titles = r.matchedCodes.map((m) => m.title).join(' | ');
    expect(titles).not.toMatch(/Fuel Temperature|Barometric/i);
  });
});

describe('J1939 direction text (2026-10-20 audit round 3)', () => {
  it('SPN 110 FMI 1 (coolant LOW) is not critical and does not talk about high temperature', async () => {
    const { J1939_FAULT_CODES } = await import('@/lib/data/j1939FaultCodes');
    const low = J1939_FAULT_CODES.find((c) => c.spn === 110 && c.fmi === 1)!;
    expect(low.severity).not.toBe('critical');
    expect(low.description).not.toMatch(/high coolant temperature/i);
    expect(low.causes.join(' ')).toMatch(/thermostat/i);
    const high = J1939_FAULT_CODES.find((c) => c.spn === 110 && c.fmi === 0)!;
    expect(high.severity).toBe('shutdown');
  });
});
