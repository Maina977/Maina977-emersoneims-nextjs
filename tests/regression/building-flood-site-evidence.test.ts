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

describe('building site analysis', () => {
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
    expect(d.insufficientEvidence).toHaveLength(4);
    const text = JSON.stringify(d);
    expect(text).not.toMatch(/Zone X|Minimal Risk|Loam \(USDA\)|Strip Foundation|Cwb/);
    expect(d.dataSources).not.toContain('ISRIC SoilGrids');
    expect(d.dataSources).not.toContain('Open-Meteo Historical');
  });
});
