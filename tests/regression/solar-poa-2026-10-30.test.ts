// Plane-of-array transposition (lib/solar/poa.ts): checks against known
// behaviour of tilted and vertical surfaces near the equator and at mid-latitude.
import { describe, it, expect } from 'vitest';
import { poaMonthly } from '@/lib/solar/poa';

// Nairobi-like monthly GHI (kWh/m²/day).
const NBO = [6.3, 6.7, 6.4, 5.5, 4.9, 4.6, 4.2, 4.6, 5.6, 5.8, 5.4, 5.9];

describe('poaMonthly', () => {
  it('a horizontal panel receives the horizontal irradiation', () => {
    const r = poaMonthly(-1.29, 0, 180, NBO);
    expect(r.gainVsHorizontal).toBeCloseTo(1, 2);
  });
  it('near the equator a 10° tilt changes the year by only a few percent', () => {
    const r = poaMonthly(-1.29, 10, 0, NBO); // facing north (towards the equator for a southern site)
    expect(r.gainVsHorizontal).toBeGreaterThan(0.96);
    expect(r.gainVsHorizontal).toBeLessThan(1.04);
  });
  it('a vertical east wall gets roughly half of the horizontal', () => {
    const r = poaMonthly(-1.29, 90, 90, NBO);
    expect(r.gainVsHorizontal).toBeGreaterThan(0.4);
    expect(r.gainVsHorizontal).toBeLessThan(0.7);
  });
  it('at 40°N a south-facing 35° tilt gains over horizontal; north-facing loses', () => {
    const ghi = [2.2, 3.0, 4.1, 5.2, 6.1, 6.8, 6.9, 6.0, 4.8, 3.5, 2.4, 1.9];
    expect(poaMonthly(40, 35, 180, ghi).gainVsHorizontal).toBeGreaterThan(1.05);
    expect(poaMonthly(40, 35, 0, ghi).gainVsHorizontal).toBeLessThan(0.85);
  });
  it('refuses impossible inputs', () => {
    expect(() => poaMonthly(-1, 95, 0, NBO)).toThrow();
    expect(() => poaMonthly(-1, 10, 400, NBO)).toThrow();
    expect(() => poaMonthly(-1, 10, 0, [1, 2])).toThrow();
  });
});
