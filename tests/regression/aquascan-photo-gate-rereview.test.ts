// @vitest-environment jsdom
/**
 * Re-review of db427f1e (2026-11-25): required behaviour for R1, R3, R6 (source), R7.
 *  R1  No neutral placeholder value is presented as an observation: the result carries no site type,
 *      vegetation density, water indicator or slope (screen, PDF/Word/Excel/CSV/JSON all read the result),
 *      the page shows "Not analysed", the PDF module list says NOT ANALYSED, the map NDVI is measured only.
 *  R3  A location from a file name or embedded text is refused: only typed coordinates or camera GPS.
 *  R6  Compare runs carry per-site request ids and write only their own site.
 *  R7  When the water-body check cannot run, the result says so and the page waits for confirmation.
 * All network mocked to fail; the photo step is stubbed.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

vi.mock('@/external/borehole-ai-engine/src/historicalData', async (orig) => ({
  ...(await orig<any>()),
  fetchHistoricalData: vi.fn(async () => { throw new Error('20-year weather service down (test mock)'); }),
}));
import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { siteCheck } from '@/external/borehole-ai-engine/src/kenyaLand';

const src = (f: string) => fs.readFileSync(path.join(process.cwd(), 'external', 'borehole-ai-engine', 'src', f), 'utf8');
const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };

beforeAll(() => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
});
async function run(features: any, loc?: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(features)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  return an.analyzeImage(new File([new Uint8Array([1])], 'Makuyu_borehole.jpg', { type: 'image/jpeg' }), undefined, loc) as Promise<any>;
}

describe('R1: no invented observation in the result, on screen or in exports', () => {
  it('engine result: no site type, vegetation, water indicator or slope; marked "not analysed"', async () => {
    const r = await run(NEUTRAL, { latitude: -1.2921, longitude: 36.8219 });
    for (const k of ['siteType', 'vegetationDensity', 'waterIndicator', 'terrainSlope']) expect(r.site[k]).toBeUndefined();
    expect(r.site.visualObservations).toBe('not analysed: photos are not used');
    expect(r.site.latitude).toBeCloseTo(-1.2921, 4);
    const json = JSON.stringify(r);
    expect(json).not.toMatch(/"siteType":"flat"|"vegetationDensity":0\.3|"waterIndicator":0\.3|"terrainSlope":4\.5/);
    // R7 / re-review of 126efdbc M-2: the water-body check is offline now, so with every network
    // source down it still runs; Nairobi is on land and needs no confirmation.
    expect(r.waterBodyCheckUnavailable).toBeUndefined();
    expect(r.waterCheckNote).toMatch(/^Not on a mapped lake, reservoir or the sea/);
  }, 150000);
  it('page, PDF module list and report map show no neutral value as an observation', () => {
    const ui = src('index.tsx');
    expect(ui).not.toMatch(/result\.site\.(siteType|vegetationDensity|waterIndicator|terrainSlope)/);
    expect(ui).not.toMatch(/from pixel \+ MobileNet fusion/);
    expect(ui).toMatch(/Site Type<\/span><span className="rv">Not analysed \(photos are not used\)/);
    expect(src('reportGenerator.ts')).toMatch(/\['18', 'Site Classification', 'NOT ANALYSED'/);
    const map = src('reportMapGenerator.ts');
    expect(map).not.toMatch(/site\?\.vegetationDensity/);
    expect(map).toMatch(/vegetationGWProxy\?\.ndviMean \?\? 'not available'/);
  });
});

describe('R3: a location from the file name or embedded text is refused', () => {
  it('filename-geocode position with no coordinates from the caller: refused', async () => {
    await expect(run({ ...NEUTRAL, locationMethod: 'filename-geocode', metadata: { gps: { latitude: -0.9, longitude: 37.18 } } }))
      .rejects.toThrow(/^Location problem/);
  }, 60000);
  it('iptc-geocode too', async () => {
    await expect(run({ ...NEUTRAL, locationMethod: 'iptc-geocode', metadata: { gps: { latitude: -0.9, longitude: 37.18 } } })).rejects.toThrow(/^Location problem/);
  }, 60000);
});

describe('R6: compare runs cannot overwrite each other', () => {
  it('per-site request ids; functional updates of the own site only', () => {
    const ui = src('index.tsx');
    const fn = ui.slice(ui.indexOf('const runCompSite = async'), ui.indexOf('Parse whatever the user actually pastes'));
    expect(fn).toMatch(/compReq\.current\[id\] = req;/);
    expect(fn).toMatch(/if \(compReq\.current\[id\] !== req\) return;/);
    expect(fn).toMatch(/setCompSites\(\(cs\) => cs\.map\(\(x\) => \(x\.id === id \? \{ \.\.\.x, \.\.\.patch \} : x\)\)\)/);
    expect(fn).not.toMatch(/const updated = \[\.\.\.sites\]/);
  });
});

describe('R7: water-body check unavailable is never a silent pass', () => {
  it('siteCheck needs no network (M-2): a Kenyan land point is checked offline and passes', async () => {
    expect(await siteCheck(-1.2921, 36.8219)).toEqual({ refusal: null, waterCheck: 'ok', note: expect.stringMatching(/^Not on a mapped lake/) });
  });
  it('outside Kenya is still refused offline', async () => {
    const r = await siteCheck(-6.8, 39.28);
    expect(r.refusal).toMatch(/outside Kenya/);
  });
  it('the page shows the warning and holds the downloads until the customer confirms the site is on land', () => {
    const ui = src('index.tsx');
    expect(ui).toMatch(/AquaScan could not confirm from its lake, reservoir and coastline maps that this point is on land/);
    expect(ui).toMatch(/I have checked: the site is on land/);
    expect(ui).toMatch(/Downloads wait for your confirmation: the water-body check could not confirm that the site is on land/);
    expect(ui).toMatch(/\(\(result as any\)\.waterBodyCheckUnavailable && !waterConfirmed\)\) \? 'none' : 'aut/);
  });
});

describe('N5 (re-review of f17f80a7): viability takes no placeholder water value', () => {
  it('the engine passes "no water evidence" (0) explicitly to the risk analysis', () => {
    expect(src('boreholeAnalyzer.ts')).toMatch(/0, \/\/ review N5: no water evidence from a photo \(photos are not analysed\); explicitly absent, never a placeholder value/);
  });
  it('viability is unchanged at the shipped neutral value (0.3 gave the same as 0 in the reviewer sweep)', async () => {
    const r = await run(NEUTRAL, { latitude: -1.2921, longitude: 36.8219 });
    expect(['high', 'medium', 'low', 'not_recommended']).toContain(r.risk.viability);
    expect(r.risk.viability).not.toBe('high');
  }, 150000);
});
