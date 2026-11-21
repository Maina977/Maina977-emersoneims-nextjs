import { describe, it, expect, vi } from 'vitest';
import {
  parseGroundwaterContext, parseNearbyWaterPoints, loadGroundwaterCard, loadNearbyCard,
  groundwaterContextUrl, nearbyWaterPointsUrl,
  DASH, MSG_NO_DATA, MSG_SERVICE_UNAVAILABLE, msgNoMatch, NEARBY_MAX_ROWS,
} from '@/external/borehole-ai-engine/src/evidenceCards';

const SCALE = '5 km grid, continental scale (nominally 1:20 million)';
const USE = 'Regional context only. It does not give the depth or yield of a borehole at this site.';
const ACK = 'Contains data supplied by permission of the Natural Environment Research Council (2026).';

const gwOk = {
  status: 'OK',
  depthToGroundwater: { code: 'M', label: 'Moderate', rangeM: '50–100 m below ground' },
  storage: { code: 'LM', label: 'Low–moderate', rangeMm: '1000–10000 mm of water' },
  productivity: null,
  scale: SCALE, use: USE, acknowledgement: ACK,
};

const pt = (o: Partial<Record<string, unknown>>) => ({
  name: null, kind: 'water well', distance: 1, coordinates: { latitude: 0, longitude: 0 },
  depth: null, yield: null, staticWaterLevel: null, year: null, status: 'unknown', source: 'OSM', ...o,
});
const nearbyOk = (boreholes: unknown[]) => ({
  success: true,
  data: {
    status: 'OK', searchRadius: 5, totalFound: boreholes.length, boreholes,
    statistics: { pointsWithDepth: 1, pointsWithYield: 0, averageDepth: 77.7, averageYield: null, successRate: null, commonDepthRange: null, commonYieldRange: null },
    recommendations: ['Drilling depth and expected yield need WRA completion records.'],
    limitations: ['OpenStreetMap holds only the water points volunteers have mapped.'],
    dataSources: ['OpenStreetMap Kenya extract via Geofabrik, 2026-11-19'],
  },
});

/** Every number in the output strings must appear in the input. */
function numbersIn(x: unknown): Set<string> {
  const s = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'number') s.add(String(v));
    else if (typeof v === 'string') (v.match(/\d+(?:\.\d+)?/g) ?? []).forEach((m) => s.add(m));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(x);
  return s;
}
const strip0 = (n: string) => String(Number(n));

const res = (ok: boolean, body: unknown, badJson = false) =>
  ({ ok, json: async () => { if (badJson) throw new SyntaxError('Unexpected token <'); return body; } });

describe('groundwater context card', () => {
  it('OK: three rows with labels and ranges; null part shows a dash', () => {
    const c = parseGroundwaterContext(true, gwOk);
    expect(c.status).toBe('OK');
    expect(c.rows).toHaveLength(3);
    expect(c.rows[0]).toEqual({ label: 'Depth to groundwater', value: 'Moderate', range: '50–100 m below ground' });
    expect(c.rows[1].value).toBe('Low–moderate');
    expect(c.rows[2]).toEqual({ label: 'Aquifer productivity', value: DASH, range: DASH });
    expect(c.scale).toBe(SCALE);
    expect(c.use).toBe(USE);
    expect(c.acknowledgement).toBe(ACK);
  });

  it('NO DATA maps to the no-mapped-value message and no rows', () => {
    const c = parseGroundwaterContext(true, { ...gwOk, status: 'NO DATA', depthToGroundwater: null, storage: null });
    expect(c.status).toBe('NO DATA');
    expect(c.message).toBe('No mapped value at this point');
    expect(c.message).toBe(MSG_NO_DATA);
    expect(c.rows).toEqual([]);
  });

  it('SERVICE UNAVAILABLE body, HTTP error, unknown status and garbage all map to unavailable', () => {
    expect(parseGroundwaterContext(true, { status: 'SERVICE UNAVAILABLE' }).message).toBe('Not available right now — try again later');
    expect(parseGroundwaterContext(false, gwOk).status).toBe('SERVICE UNAVAILABLE');
    expect(parseGroundwaterContext(true, { status: 'INSUFFICIENT EVIDENCE' }).status).toBe('SERVICE UNAVAILABLE');
    expect(parseGroundwaterContext(true, null).status).toBe('SERVICE UNAVAILABLE');
    expect(parseGroundwaterContext(true, 'oops').message).toBe(MSG_SERVICE_UNAVAILABLE);
    const u = parseGroundwaterContext(false, null);
    expect(u.rows).toEqual([]);
    expect(u.scale).toBeNull();
    expect(u.acknowledgement).toBeNull();
  });

  it('does not fabricate numbers', () => {
    const c = parseGroundwaterContext(true, gwOk);
    const inNums = new Set([...numbersIn(gwOk)].map(strip0));
    for (const n of numbersIn(c)) expect(inNums.has(strip0(n))).toBe(true);
  });

  it('loader: relative URL, HTTP 503, non-JSON and network errors are unavailable', async () => {
    expect(groundwaterContextUrl(-1.29, 36.82)).toBe('/api/aquascan/groundwater-context?lat=-1.29&lon=36.82');
    const f = vi.fn(async () => res(true, gwOk));
    expect((await loadGroundwaterCard(-1.29, 36.82, f)).status).toBe('OK');
    expect(f).toHaveBeenCalledWith('/api/aquascan/groundwater-context?lat=-1.29&lon=36.82', expect.anything());
    expect((await loadGroundwaterCard(0, 36, async () => res(false, { status: 'SERVICE UNAVAILABLE' }))).status).toBe('SERVICE UNAVAILABLE');
    expect((await loadGroundwaterCard(0, 36, async () => res(true, null, true))).status).toBe('SERVICE UNAVAILABLE');
    expect((await loadGroundwaterCard(0, 36, async () => { throw new TypeError('Failed to fetch'); })).status).toBe('SERVICE UNAVAILABLE');
  });

  it('loader rethrows when aborted so the view can drop the result', async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(loadGroundwaterCard(0, 36, async () => { throw new DOMException('aborted', 'AbortError'); }, ac.signal)).rejects.toBeTruthy();
  });
});

describe('nearby water points card', () => {
  it('OK: count, nearest first, max 8 rows, dashes for untagged values, "unnamed"', () => {
    const pts = Array.from({ length: 10 }, (_, i) => pt({ distance: 4.5 - i * 0.4, name: i === 9 ? 'Kambi Well' : null }));
    pts[3] = pt({ distance: 3.3, depth: 45, yield: 3.5, staticWaterLevel: 12, year: 2015, kind: 'borehole', name: 'School BH' });
    const c = parseNearbyWaterPoints(true, nearbyOk(pts));
    expect(c.status).toBe('OK');
    expect(c.count).toBe(10);
    expect(c.message).toBe('10 mapped water points within 5 km');
    expect(c.rows).toHaveLength(NEARBY_MAX_ROWS);
    expect(c.rows[0].name).toBe('Kambi Well');
    expect(c.rows[0].distance).toBe('0.90 km');
    const tagged = c.rows.find((r) => r.name === 'School BH')!;
    expect(tagged).toEqual({ kind: 'borehole', name: 'School BH', distance: '3.30 km', depth: '45 m', yield: '3.5 m³/h', waterLevel: '12 m', year: '2015' });
    const untagged = c.rows.find((r) => r.name === 'unnamed')!;
    expect([untagged.depth, untagged.yield, untagged.waterLevel, untagged.year]).toEqual([DASH, DASH, DASH, DASH]);
    expect(c.limitations).toEqual(['OpenStreetMap holds only the water points volunteers have mapped.']);
    expect(c.dataSources[0]).toContain('2026-11-19');
    expect(c.pointsWithDepth).toBe(1);
  });

  it('does not surface the API average or any recommended depth/yield', () => {
    const c = parseNearbyWaterPoints(true, nearbyOk([pt({ distance: 1.2, depth: 60 })]));
    expect(JSON.stringify(c)).not.toContain('77.7');
    expect(JSON.stringify(c).toLowerCase()).not.toMatch(/recommended|expected yield|average/);
  });

  it('does not fabricate numbers', () => {
    const input = nearbyOk([pt({ distance: 1.25, depth: 60, year: 2001 }), pt({ distance: 2 })]);
    const c = parseNearbyWaterPoints(true, input);
    const inNums = new Set([...numbersIn(input)].map(strip0));
    for (const n of numbersIn(c)) expect(inNums.has(strip0(n)), n).toBe(true);
  });

  it('NO MATCH FOUND says absence on the map is not absence of boreholes', () => {
    const body = nearbyOk([]);
    body.data.status = 'NO MATCH FOUND';
    const c = parseNearbyWaterPoints(true, body);
    expect(c.status).toBe('NO MATCH FOUND');
    expect(c.count).toBe(0);
    expect(c.rows).toEqual([]);
    expect(c.message).toBe('No water points are mapped in OpenStreetMap within 5 km — that does not mean there are none; ask the Water Resources Authority for completion records');
    expect(c.message).toBe(msgNoMatch(5));
    expect(c.limitations.length).toBe(1);
  });

  it('503, success:false, unknown status and missing data map to unavailable with nothing shown', () => {
    for (const [ok, body] of [
      [false, { status: 'SERVICE UNAVAILABLE', error: 'x' }],
      [true, { success: false, error: 'x' }],
      [true, { success: true, data: { status: 'WHATEVER', boreholes: [pt({ depth: 50 })] } }],
      [true, null],
    ] as const) {
      const c = parseNearbyWaterPoints(ok, body);
      expect(c.status).toBe('SERVICE UNAVAILABLE');
      expect(c.message).toBe(MSG_SERVICE_UNAVAILABLE);
      expect(c.count).toBeNull();
      expect(c.rows).toEqual([]);
      expect(c.pointsWithDepth).toBeNull();
    }
  });

  it('bad values in a point become dashes, never defaults', () => {
    const c = parseNearbyWaterPoints(true, nearbyOk([{ distance: 'far', depth: 'deep', yield: NaN, staticWaterLevel: undefined, year: '2010', kind: 7 }]));
    expect(c.rows[0]).toEqual({ kind: DASH, name: 'unnamed', distance: DASH, depth: DASH, yield: DASH, waterLevel: DASH, year: DASH });
  });

  it('loader: relative URL with radius 5, HTTP errors and non-JSON are unavailable', async () => {
    expect(nearbyWaterPointsUrl(-1.29, 36.82)).toBe('/api/borehole/nearby-boreholes?lat=-1.29&lon=36.82&radius=5');
    const f = vi.fn(async () => res(true, nearbyOk([pt({})])));
    expect((await loadNearbyCard(-1.29, 36.82, f)).status).toBe('OK');
    expect(f).toHaveBeenCalledWith('/api/borehole/nearby-boreholes?lat=-1.29&lon=36.82&radius=5', expect.anything());
    expect((await loadNearbyCard(0, 36, async () => res(false, null))).status).toBe('SERVICE UNAVAILABLE');
    expect((await loadNearbyCard(0, 36, async () => res(true, null, true))).status).toBe('SERVICE UNAVAILABLE');
    expect((await loadNearbyCard(0, 36, async () => { throw new TypeError('Failed to fetch'); })).status).toBe('SERVICE UNAVAILABLE');
  });
});
