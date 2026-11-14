/**
 * P0-C (2026-11-14): AquaScan soil determinism.
 * The ISRIC SoilGrids REST API is paused by ISRIC and rate-limited (5/min);
 * results changed with whether it answered (Kitale 70 m vs 61 m). Soil is now
 * INSUFFICIENT EVIDENCE every time until a versioned Kenya extract exists, and
 * the site selector no longer invents soil values or a rock type from them.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const fetchSpy = vi.fn(async (u: RequestInfo | URL) => {
  const url = String(u);
  if (url.includes('isric.org')) throw new Error('SoilGrids must not be called');
  return new Response('{}', { status: 503 });
});

// Deterministic terrain for the selector: a gentle slope across the grid.
vi.mock('@/external/borehole-ai-engine/src/elevationService', () => ({
  fetchElevations: async (pts: Array<{ lat: number; lon: number }>) => ({
    elevations: pts.map((p) => Math.round(1800 + (p.lat + 1.3) * 4000 + (p.lon - 36.8) * 1500)),
    source: 'test-fixture',
  }),
}));

beforeEach(() => { fetchSpy.mockClear(); vi.stubGlobal('fetch', fetchSpy); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('soil source', () => {
  it('the SoilGrids REST service is switched off, with the reason recorded', async () => {
    const s = await import('@/external/borehole-ai-engine/src/soilSource');
    expect(s.SOILGRIDS_REST_ENABLED).toBe(false);
    expect(s.SOIL_INSUFFICIENT_EVIDENCE).toMatch(/INSUFFICIENT EVIDENCE[^]*paused by ISRIC/);
  });

  it('global soil analysis and the remote-sensing soil fetch make no SoilGrids call and return no soil', async () => {
    const { fetchGlobalSoilAnalysis } = await import('@/external/borehole-ai-engine/src/globalSoilEngine');
    const { fetchSoilGrids } = await import('@/external/borehole-ai-engine/src/remoteSensing');
    const g = await fetchGlobalSoilAnalysis(1.0, 35.0);
    expect(g.wrbClassification).toBeNull();
    expect(g.hydraulicProperties).toBeNull();
    expect(await fetchSoilGrids(1.0, 35.0)).toBeNull();
    expect(fetchSpy.mock.calls.some(([u]) => String(u).includes('isric.org'))).toBe(false);
  });
});

describe('smart site selector without soil', () => {
  const run = async () => {
    const { selectTopDrillingSites } = await import('@/external/borehole-ai-engine/src/smartSiteSelector');
    return selectTopDrillingSites(1.0, 35.0, 1000, 250, 1100, 20, 60);
  };

  it('invents no rock type, depth or yield, and says why', async () => {
    const r = await run();
    expect(r.topSites.length).toBeGreaterThan(0);
    for (const s of r.topSites) {
      expect(s.expectedDepth_m).toBeNull();
      expect(s.expectedYield_m3h).toBeNull();
      expect(s.weatheringDepth_m).toBeNull();
      expect(s.rockType).toMatch(/not known/);
      expect(s.reasoning.join(' ')).toMatch(/INSUFFICIENT EVIDENCE/);
    }
    expect(r.insufficientEvidence?.join(' ')).toMatch(/INSUFFICIENT EVIDENCE[^]*ranked on terrain, drainage and recharge only/);
    expect(fetchSpy.mock.calls.some(([u]) => String(u).includes('isric.org'))).toBe(false);
  });

  it('identical inputs give identical results (repeatability)', async () => {
    const a = await run();
    const b = await run();
    expect(JSON.stringify(b.topSites)).toBe(JSON.stringify(a.topSites));
    expect(JSON.stringify(b.groundwaterProbabilityMap.cells)).toBe(JSON.stringify(a.groundwaterProbabilityMap.cells));
  });
});
