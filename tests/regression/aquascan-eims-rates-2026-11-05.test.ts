/**
 * AquaScan prices at the EmersonEIMS signed tender rates (Baringo County,
 * 16 Oct 2026), applied on the owner's instruction 2026-11-05. The tender's
 * own lines are the check values.
 */
import { describe, it, expect } from 'vitest';
import { drillingCostKES, mobilisationUSD, EIMS_RATES_KES, KES_PER_USD } from '@/external/borehole-ai-engine/src/costModel';

describe('EmersonEIMS tender rates', () => {
  it('217 m in soft formation costs what the tender says: KSh 1,549,400', () => {
    // 100 m x 6,800 + 100 m x 7,300 + 17 m x 8,200 (tender items I, J, K)
    expect(drillingCostKES(217)).toBe(680000 + 730000 + 139400);
  });
  it('hard rock is KSh 10,500/m; beyond 300 m soft formation is KSh 9,500/m', () => {
    expect(drillingCostKES(100, 'granite gneiss')).toBe(1050000);
    expect(drillingCostKES(310) - drillingCostKES(300)).toBe(95000);
  });
  it('Baringo (Kabarnet) mobilisation is at least the tender KSh 240,000; Nairobi has none', () => {
    expect(mobilisationUSD(0.49, 35.74) * KES_PER_USD).toBeGreaterThanOrEqual(240000 - KES_PER_USD);
    expect(mobilisationUSD(-1.29, 36.82)).toBe(0);
  });
  it('approvals add up to the tender lines', () => {
    const r = EIMS_RATES_KES;
    expect(r.wraDrillingPermit + r.abstractionPermit + r.countyFees + r.nemaReport).toBe(240000);
    expect(r.testPumpingPerHour * r.testPumpingHours).toBe(228000);
    expect(r.developmentPerHour * r.developmentHours).toBe(150000);
  });
});
