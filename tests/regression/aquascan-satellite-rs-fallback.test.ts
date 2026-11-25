// @vitest-environment jsdom
/**
 * Satellite remote-sensing consolidation with data sources down (2026-11-25).
 *
 * Defect: "[Pipeline] Satellite Remote Sensing engine failed: TypeError: trend.toFixed is not a
 * function", and the whole 10-method result was missing. Root cause: without the shipped GRACE file
 * the GRACE method fell back to gldasGroundwater.graceAnomaly.trend, which is the trend DIRECTION
 * string ('gaining' | 'stable' | 'losing' | 'critically-depleting'), not the rate (changeRate, cm/yr).
 * Required: numbers only; a missing value is "not available" with the reason; one failing method
 * never removes the other methods.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/external/borehole-ai-engine/src/historicalData', async (orig) => ({
  ...(await orig<any>()),
  fetchHistoricalData: vi.fn(async () => { throw new Error('20-year weather service down (test mock)'); }),
}));
import { analyzeGRACE, runSatelliteRemoteSensing } from '@/external/borehole-ai-engine/src/satelliteRemoteSensingEngine';
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';

beforeAll(() => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
});

const gldas = (a: Record<string, unknown>) => ({ graceAnomaly: { basinStatus: 'Soil-moisture indicator', period: 'x', dataSource: 'test', ...a } });

describe('GRACE method: numbers only', () => {
  it('no GRACE file, soil-moisture indicator with a direction string and a numeric rate: uses the rate, no crash', () => {
    const m = analyzeGRACE(-1.29, 36.82, null, gldas({ twsAnomaly: -2.1, trend: 'stable', changeRate: -0.3 }));
    expect(m.keyFindings.join(' ')).toMatch(/Storage trend: -0\.30 cm\/year — relatively stable/);
    expect(m.metrics.trendCmPerYear).toBe(-0.3);
    expect(m.status).toBe('partial');
  });
  it('only a direction string (no rate): "not available" with the reason and the stated direction', () => {
    const m = analyzeGRACE(-1.29, 36.82, null, gldas({ twsAnomaly: -2.1, trend: 'losing' }));
    expect(m.keyFindings.join(' ')).toMatch(/Storage trend: not available \(no numeric rate from GRACE or the soil-moisture indicator; the indicator reports the direction as "losing"\)/);
    expect(m.metrics.trendCmPerYear).toBe('not available');
  });
  it('no numeric storage anomaly at all: method unavailable, confidence 0 (ignored by the fusion), no invented implication', () => {
    const m = analyzeGRACE(-1.29, 36.82, null, gldas({ trend: 'stable' }));
    expect(m.status).toBe('unavailable');
    expect(m.confidence).toBe(0);
    expect(m.implication).toBe('Not available: no regional water-storage data for this run.');
    expect(m.keyFindings[0]).toMatch(/TWS anomaly: not available/);
  });
});

describe('the 10-method consolidation still runs with every source down', () => {
  it('runSatelliteRemoteSensing resolves with all ten methods (no skip of unrelated output)', async () => {
    const r = await runSatelliteRemoteSensing(-1.29, 36.82, { gldasGroundwater: gldas({ trend: 'losing' }) } as any);
    expect(r.methods.length).toBe(10);
    expect(r.methods.find((m) => m.method.startsWith('3.'))!.status).toBe('unavailable');
  });
  it('the full engine run carries the satellite result (it was missing because the engine threw)', async () => {
    const an = new BoreholeAnalyzer();
    const det = (an as any).imageDetector;
    det.analyzeImage = vi.fn(async () => ({ metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] }));
    det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
    const warn = vi.spyOn(console, 'warn');
    const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: -1.2921, longitude: 36.8219 });
    expect(r.satelliteRemoteSensing?.methods?.length).toBe(10);
    expect(warn.mock.calls.map((c) => String(c[0])).join(' ')).not.toMatch(/Satellite Remote Sensing engine failed/);
    warn.mockRestore();
  }, 150000);
});
