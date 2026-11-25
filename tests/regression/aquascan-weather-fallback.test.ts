// @vitest-environment jsdom
/**
 * Weather-service failure (2026-11-25, reported by the independent reviewer of f736e0b0).
 *
 * Defect: when the 20-year weather service did not answer, the engine replaced the weather with a
 * stored ERA5 annual baseline that has no drought years or trend. estimateGroundwaterTrend then read
 * `weather.droughtYears.length` and threw a TypeError, so the WHOLE analysis failed with a generic
 * error. Required: the analysis completes; the groundwater trend is "not available" (null) and the
 * report says why. Also: no geo-estimate object (from the unanalysed placeholder photo) in the result.
 * All network mocked to fail; the photo step is stubbed with neutral features.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/external/borehole-ai-engine/src/historicalData', async (orig) => ({
  ...(await orig<any>()),
  fetchHistoricalData: vi.fn(async () => { throw new Error('20-year weather service down (test mock)'); }),
}));
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { estimateGroundwaterTrend, hasRainfallSeries } from '@/external/borehole-ai-engine/src/historicalData';

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [], geoEstimate: { bestEstimate: { latitude: 0, longitude: 37, region: 'Placeholder colour match', country: 'Kenya', confidence: 0.4, reasoning: ['grey'] }, estimates: [{ latitude: 0, longitude: 37, confidence: 0.4 }], method: 'RGB', climateZone: 'x' } };

beforeAll(() => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
});

describe('weather service down: graceful "not available", no crash', () => {
  it('estimateGroundwaterTrend needs the 20-year series; an annual-only baseline is recognised as not a series', () => {
    expect(hasRainfallSeries({ avgAnnualPrecipitation: 900, annualOnly: true })).toBe(false);
    expect(hasRainfallSeries({ avgAnnualPrecip: 900, droughtYears: [2017], trendDirection: 'stable', trendPerDecade: 0 })).toBe(true);
    expect(estimateGroundwaterTrend({ avgAnnualPrecip: 900, annualOnly: true } as any, -1.29, 36.82)).toBeNull();
  });

  it('the full engine run completes at real coordinates with every source down', async () => {
    const an = new BoreholeAnalyzer();
    const det = (an as any).imageDetector;
    det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
    det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
    const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: -1.2921, longitude: 36.8219 });
    expect(r.probability).toBeGreaterThan(0);
    expect(r.historicalData?.groundwater ?? null).toBeNull();
    expect((r.fallbacksUsed ?? []).join(' ')).toMatch(/groundwater trend is not estimated/);
    // management 2026-11-25: no object describing a photo that was not analysed
    expect(r.geoEstimate).toBeUndefined();
  }, 150000);
});
