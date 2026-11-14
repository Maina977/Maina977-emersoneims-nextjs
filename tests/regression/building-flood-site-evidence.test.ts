import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPointElevation } from '@/lib/data-sources/elevation';

// 2026-11-14: Building flood used a latitude-box elevation guess and printed
// score-derived "10/50/100-yr depths", FEMA zone names and insurance bands.
// Site analysis filled every missing source with stand-ins (1500 m, loam,
// 100 kPa bearing, low flood risk). Missing evidence must now stay missing.

const rain: Record<string, number> = {};
for (let d = 0; d < 3653; d++) rain[`d${d}`] = d % 50 === 0 ? 60 : 2.5; // ~10 years

type Mode = { elevation: 'ok' | 'fail' | 'void'; water: 'found' | 'none' | 'fail'; rain: 'ok' | 'fail' };
function stubFetch(m: Mode, elevationM = 12) {
  const spy = vi.fn(async (u: string | URL | Request) => {
    const url = String(u);
    if (url.includes('power.larc.nasa.gov')) {
      return m.rain === 'ok' ? new Response(JSON.stringify({ properties: { parameter: { PRECTOTCORR: rain } } })) : new Response('', { status: 503 });
    }
    if (url.includes('open-elevation') || url.includes('opentopodata')) {
      if (m.elevation === 'fail') return new Response('', { status: 502 });
      return new Response(JSON.stringify({ results: [{ elevation: m.elevation === 'void' ? -32768 : elevationM }] }));
    }
    if (url.includes('overpass')) {
      if (m.water === 'fail') return new Response('', { status: 504 });
      const elements = m.water === 'found' ? [{ center: { lat: -4.0405, lon: 39.6682 }, tags: { name: 'Tudor Creek', natural: 'water' } }] : [];
      return new Response(JSON.stringify({ elements }));
    }
    return new Response('', { status: 451 });
  });
  vi.stubGlobal('fetch', spy);
  return spy;
}

async function flood(lat = -4.04, lng = 39.67) {
  vi.resetModules();
  const { POST } = await import('@/app/api/building/flood/route');
  const { NextRequest } = await import('next/server');
  const r = await POST(new NextRequest('http://x/api/building/flood', { method: 'POST', body: JSON.stringify({ latitude: lat, longitude: lng }) }));
  return { status: r.status, j: await r.json() };
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('point elevation (SRTM)', () => {
  it('uses Open-Elevation, then Open Topo Data; voids and failures give null', async () => {
    const ok = vi.fn(async () => new Response(JSON.stringify({ results: [{ elevation: 1661 }] })));
    expect(await fetchPointElevation(-1.29, 36.82, ok as unknown as typeof fetch)).toEqual({ elevationM: 1661, source: 'SRTM via Open-Elevation' });
    let n = 0;
    const second = vi.fn(async () => (n++ === 0 ? new Response('', { status: 500 }) : new Response(JSON.stringify({ results: [{ elevation: 20 }] }))));
    expect((await fetchPointElevation(-4, 39.6, second as unknown as typeof fetch))?.source).toMatch(/Open Topo Data/);
    const voids = vi.fn(async () => new Response(JSON.stringify({ results: [{ elevation: -32768 }] })));
    expect(await fetchPointElevation(0, 0, voids as unknown as typeof fetch)).toBeNull();
    const down = vi.fn(async () => { throw new Error('offline'); });
    expect(await fetchPointElevation(0, 0, down as unknown as typeof fetch)).toBeNull();
  });
});

describe('building flood screening', () => {
  it('uses the measured elevation, not a regional guess, and invents no depths or insurance band', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    stubFetch({ elevation: 'ok', water: 'found', rain: 'ok' }, 12);
    const { status, j } = await flood();
    expect(status).toBe(200);
    expect(j.data.factors.elevation).toBe(12); // the old box guess gave 50 for the coast
    expect(j.data.factors.elevationSource).toMatch(/SRTM/);
    expect(j.data.projectedDepth).toBeNull();
    expect(j.data.insuranceCategory).toBeNull();
    expect(j.data.factors.drainageCapacity).toBeNull();
    expect(j.data.factors.urbanization).toBeNull();
    expect(j.data.floodZone).not.toMatch(/Zone (AE|A|B|C|X)/);
    expect(j.data.floodZone).toMatch(/not a mapped flood zone/);
    expect(j.data.source).toMatch(/NASA POWER/);
    expect(j.data.source).toMatch(/SRTM/);
    expect(j.data.limitations.length).toBeGreaterThan(0);
  });
  it('same rainfall and water, different measured elevation → different score (elevation is really used)', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    stubFetch({ elevation: 'ok', water: 'found', rain: 'ok' }, 5);
    const low = (await flood()).j.data.riskScore;
    stubFetch({ elevation: 'ok', water: 'found', rain: 'ok' }, 400);
    const high = (await flood()).j.data.riskScore;
    expect(low - high).toBe(35); // <10 m = 40 points, ≥200 m = 5
  });
  it('no elevation (service down or SRTM void) → INSUFFICIENT EVIDENCE, no rating', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    for (const e of ['fail', 'void'] as const) {
      stubFetch({ elevation: e, water: 'found', rain: 'ok' });
      const { status, j } = await flood();
      expect(status).toBe(503);
      expect(j.error).toMatch(/INSUFFICIENT EVIDENCE: ground elevation/);
      expect(j.data).toBeUndefined();
    }
  });
  it('water-body lookup failure → INSUFFICIENT EVIDENCE (it used to score like a dry site)', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    stubFetch({ elevation: 'ok', water: 'fail', rain: 'ok' });
    const { status, j } = await flood();
    expect(status).toBe(503);
    expect(j.error).toMatch(/water-body lookup/);
  });
  it('no water mapped within 2 km scores like the farthest band, never lower', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    stubFetch({ elevation: 'ok', water: 'none', rain: 'ok' }, 400);
    const { status, j } = await flood();
    expect(status).toBe(200);
    expect(j.data.factors.nearestWaterBody).toBeNull();
    // elevation ≥ 200 m: 5; no water within 2 km: 5; annual ≈ 1,333 mm (> 1,000): 10; wettest day 60 mm (> 50): 5
    expect(j.data.riskScore).toBe(5 + 5 + 10 + 5);
  });
});

describe('building soil', () => {
  const layer = (name: string, mean: number | null) => ({ name, depths: [{ label: '30-60cm', values: { mean } }] });
  async function soil(layers: unknown[] | null) {
    vi.stubGlobal('fetch', vi.fn(async () => (layers ? new Response(JSON.stringify({ properties: { layers } })) : new Response('', { status: 503 }))));
    vi.resetModules();
    const { POST } = await import('@/app/api/building/soil/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/building/soil', { method: 'POST', body: JSON.stringify({ latitude: 9.0, longitude: 7.5 }) }));
    return { status: r.status, j: await r.json() };
  }
  it('SoilGrids down → INSUFFICIENT EVIDENCE, not the old "Regional Model (Kenya)" black-cotton stand-in', async () => {
    const { status, j } = await soil(null);
    expect(status).toBe(503);
    expect(j.error).toMatch(/INSUFFICIENT EVIDENCE/);
    expect(JSON.stringify(j)).not.toMatch(/Regional Model/);
  });
  it('a missing texture layer is not read as 0 % clay', async () => {
    const { status } = await soil([layer('clay', null), layer('sand', 200), layer('silt', 250)]);
    expect(status).toBe(503);
  });
  it('real SoilGrids values: texture passes through; no bearing capacity, water table or foundation type from the map', async () => {
    const { status, j } = await soil([layer('clay', 550), layer('sand', 200), layer('silt', 250), layer('phh2o', 65)]);
    expect(status).toBe(200);
    expect(j.data.properties.clay).toBe(55);
    expect(j.data.properties.ph).toBe(6.5);
    expect(j.data.properties.bulkDensity).toBeNull(); // not reported → null, not 1.4
    expect(j.data.bearingCapacity).toBeNull();
    expect(j.data.waterTable).toBeNull();
    expect(j.data.expansive).toBe(true);
    expect(j.data.foundationRecommendation).toMatch(/geotechnical site investigation/);
    expect(j.data.foundationRecommendation).not.toMatch(/^(Strip|Raft|Pile|Pad)/);
    expect(j.data.excavationDifficulty).toBeNull(); // needs coarse fragments
    expect(j.data.source).toMatch(/CC BY 4\.0/);
  });
});

describe('building elevation and climate', () => {
  async function post(route: 'elevation' | 'climate') {
    vi.resetModules();
    const { POST } = await import(`@/app/api/building/${route}/route`);
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest(`http://x/api/building/${route}`, { method: 'POST', body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }));
    return { status: r.status as number, j: await r.json() };
  }
  it('no elevation service → INSUFFICIENT EVIDENCE (was 1200 + |lat| × 100 m)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const { status, j } = await post('elevation');
    expect(status).toBe(503);
    expect(j.error).toMatch(/INSUFFICIENT EVIDENCE/);
  });
  it('no NASA POWER → INSUFFICIENT EVIDENCE (was one fixed "Regional Model (Kenya)" table)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const { status, j } = await post('climate');
    expect(status).toBe(503);
    expect(JSON.stringify(j)).not.toMatch(/Regional Model/);
  });
  it('with NASA POWER: measured values pass through; rule-of-thumb figures are null', async () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const series = (v: number) => Object.fromEntries([...months.map((m) => [m, v]), ['ANN', v]]);
    const parameter = { T2M: series(19), T2M_MAX: series(26), T2M_MIN: series(12), RH2M: series(60), PRECTOTCORR: series(80), WS10M: series(3), WS10M_MAX: series(9), ALLSKY_SFC_SW_DWN: series(5.6), ALLSKY_SFC_UV_INDEX: series(9) };
    vi.stubGlobal('fetch', vi.fn(async (u: string | URL | Request) => (String(u).includes('power.larc') ? new Response(JSON.stringify({ properties: { parameter } })) : new Response('', { status: 503 }))));
    const { status, j } = await post('climate');
    expect(status).toBe(200);
    expect(j.data.rainfall.annual).toBe(960);
    expect(j.data.solar.irradiance).toBe(5.6);
    expect(j.data.rainfall.rainyDays).toBeNull();
    expect(j.data.rainfall.wetSeason).toBeNull();
    expect(j.data.wind.designPressure).toBeNull();
    expect(j.data.wind.prevailingDirection).toBeNull();
    expect(j.data.solar.sunHours).toBeNull();
    expect(j.data.extremes).toEqual({ frostDays: null, hotDays: null, stormDays: null, hailRisk: null });
  });
});

describe('building site analysis', () => {
  it('a null bearing capacity or slope is not treated as "low" (JS null < 75 is true)', async () => {
    const soilOk = { soilType: 'Clay', bearingCapacity: null, expansive: false, source: 'ISRIC SoilGrids 2.0 (250 m, CC BY 4.0)' };
    const terrain = { elevation: 1650, slope: null, source: 'SRTM' };
    const floodOk = { riskLevel: 'low', riskScore: 20, floodZone: 'Screening: low', mitigations: [], source: 'NASA POWER' };
    vi.stubGlobal('fetch', vi.fn(async (u: string | URL | Request) => {
      const url = String(u);
      const data = url.includes('/api/building/soil') ? soilOk : url.includes('/api/building/elevation') ? terrain : url.includes('/api/building/flood') ? floodOk : null;
      return data ? new Response(JSON.stringify({ success: true, data })) : new Response('', { status: 503 });
    }));
    vi.resetModules();
    const { POST } = await import('@/app/api/building/site-analysis/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/building/site-analysis', { method: 'POST', body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }));
    const d = (await r.json()).data;
    expect(d.risks.map((x: { description: string }) => x.description).join(' ')).not.toMatch(/Low bearing capacity/);
    expect(d.terrain.accessibility).toBeNull();
    expect(d.overallScore).toBe(50 + 10); // base 50 + low flood 10; no slope or bearing points from nulls
  });
  it('infrastructure and amenities: real nearest distances; a shop is only a shop', async () => {
    // ~111 m per 0.001° of latitude at the equator
    const elements = [
      { type: 'way', center: { lat: 0.002, lon: 0 }, tags: { highway: 'residential' } },
      { type: 'node', lat: 0.003, lon: 0, tags: { amenity: 'school' } },
      { type: 'node', lat: 0.010, lon: 0, tags: { shop: 'supermarket' } },
    ];
    vi.stubGlobal('fetch', vi.fn(async (u: string | URL | Request) => (String(u).includes('overpass') ? new Response(JSON.stringify({ elements })) : new Response('', { status: 503 }))));
    vi.resetModules();
    const { POST } = await import('@/app/api/building/site-analysis/route');
    const { NextRequest } = await import('next/server');
    const d = (await (await POST(new NextRequest('http://x/api/building/site-analysis', { method: 'POST', body: JSON.stringify({ latitude: 0, longitude: 0 }) }))).json()).data;
    expect(d.infrastructure.roadAccess.available).toBe(true);
    expect(d.infrastructure.roadAccess.distance).toBeGreaterThan(215);
    expect(d.infrastructure.roadAccess.distance).toBeLessThan(230);
    expect(d.infrastructure.electricity.available).toBe(false);
    expect(d.infrastructure.electricity.distance).toBeNull();
    expect(d.infrastructure.telecom).toBeNull();
    expect(d.amenities.school).toBeGreaterThan(325);
    expect(d.amenities.school).toBeLessThan(340);
    expect(d.amenities.shopping).toBeGreaterThan(1100); // the supermarket, not the nearer school
    expect(d.amenities.hospital).toBeNull();
  });
  it('missing sources stay missing: no 1500 m, loam, 100 kPa or "low flood" stand-ins, no overall score', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    vi.resetModules();
    const { POST } = await import('@/app/api/building/site-analysis/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/building/site-analysis', { method: 'POST', body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }));
    const j = await r.json();
    expect(j.success).toBe(true);
    const d = j.data;
    expect(d.terrain).toBeNull();
    expect(d.soil).toBeNull();
    expect(d.climate).toBeNull();
    expect(d.flood).toBeNull();
    expect(d.overallScore).toBeNull();
    expect(d.buildingSuitability).toBe('INSUFFICIENT EVIDENCE');
    expect(d.insufficientEvidence).toHaveLength(7); // + address (geocoding unavailable)
    expect(d.infrastructure).toBeNull(); // was: tarmac road at 100 m, power at 200 m
    expect(d.amenities).toBeNull();      // was: hospital 5000 m, school 2000 m …
    expect(d.recommendations.join(' ')).not.toMatch(/borehole|septic|power connection/i);
    const text = JSON.stringify(d);
    expect(text).not.toMatch(/Zone X|Minimal Risk|Loam \(USDA\)|Strip Foundation|Cwb/);
    expect(d.dataSources).not.toContain('ISRIC SoilGrids');
    expect(d.dataSources).not.toContain('Open-Meteo Historical');
  });
});
