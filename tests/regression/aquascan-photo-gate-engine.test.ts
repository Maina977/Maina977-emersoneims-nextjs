// @vitest-environment jsdom
/**
 * Safety hotfix (review of f736e0b0), ENGINE level (BoreholeAnalyzer.analyzeImage), all network
 * mocked: every fetch rejects, reverse geocoding returns nothing, the photo step is stubbed.
 * Adapted from the reviewer's scratch engine-flow test; asserts the REQUIRED behaviour:
 *  M3  the engine itself ignores image pixels: a real photo with lush-valley pixel features and the
 *      placeholder give IDENTICAL groundwater figures at the same coordinates (was: 0.686 vs 0.55,
 *      clay vs loamy, 120 vs 116 m, 8.3 vs 2 m³/h);
 *  B2  a place name alone (country) is refused; it is never geocoded to its centre and analysed.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/external/borehole-ai-engine/src/historicalData', async (orig) => ({
  ...(await orig<any>()),
  // Pre-existing (outside this hotfix, reported by the reviewer): with the weather service down the
  // stored baseline lacks the annual arrays and estimateGroundwaterTrend throws; guarded here.
  estimateGroundwaterTrend: vi.fn((...a: any[]) => { try { return (globalThis as any).__realTrend(...a); } catch { return undefined; } }),
  fetchHistoricalData: vi.fn(async () => { throw new Error('historical source down (test mock)'); }),
}));
vi.mock('@/external/borehole-ai-engine/src/boreholeDatabase', async (orig) => ({
  ...(await orig<any>()),
  geocodeLocationForm: vi.fn(async () => ({ latitude: 0.5, longitude: 37.9, displayName: 'Kenya', country: 'Kenya', countryCode: 'KE' })),
}));
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
const LUSH = { ...NEUTRAL, terrainType: 'valley', vegetationDensity: 0.95, vegetationScore: 0.95, waterProbability: 0.95, soilColor: 'dark', waterBodies: true, isReliableTerrainImage: true, pixelAnalysis: { isOutdoorScene: true, vegetationIndex: 0.4, waterIndex: 0.2, soilExposureIndex: 0.5, dominantColorClass: 'dark-brown', rockExposureIndex: 0.5, greenRatio: 0.5, blueRatio: 0.2, redRatio: 0.3, brightness: 120 } };

beforeAll(async () => {
  const real = await vi.importActual<any>('@/external/borehole-ai-engine/src/historicalData');
  (globalThis as any).__realTrend = real.estimateGroundwaterTrend;
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
});

async function run(fileName: string, features: any, loc: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(features)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  return an.analyzeImage(new File([new Uint8Array([1, 2, 3])], fileName, { type: 'image/jpeg' }), undefined, loc);
}
const pick = (r: any) => ({ probability: r.probability, soil: r.soil?.type, depth: r.recommendedDepth, yld: r.estimatedYield, wq: r.waterQuality?.score, viability: r.risk?.viability, confidence: r.confidenceMetrics?.overall });

describe('engine ignores image pixels (review M3)', () => {
  const NBO = { latitude: -1.2921, longitude: 36.8219 };
  it('a real photo with lush-valley pixels and the placeholder give identical groundwater figures at the same coordinates', async () => {
    const ph = await run('__aquascan-no-photo__.jpg', NEUTRAL, NBO);
    const real = await run('site.jpg', LUSH, NBO);
    expect(pick(real)).toEqual(pick(ph));
    expect((real as any).pixelAnalysis).toBeUndefined();
  }, 150000);
});

describe('a place name alone is not a site (review B2)', () => {
  it('"Kenya" as the only location: refused with the reason (was: full analysis at the country centre)', async () => {
    await expect(run('__aquascan-no-photo__.jpg', NEUTRAL, { country: 'Kenya', region: '', city: '', county: '', village: '' }))
      .rejects.toThrow(/^Location problem: AquaScan needs a site-specific location/);
  }, 60000);
  it('a town name ("Nakuru") is refused too (was: snapped to the town centre)', async () => {
    await expect(run('__aquascan-no-photo__.jpg', NEUTRAL, { city: 'Nakuru', country: 'Kenya' })).rejects.toThrow(/Location problem/);
  }, 60000);
});
