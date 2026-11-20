import { describe, it, expect, beforeEach } from 'vitest';
import { groundwaterContext, _clearBgsCache, BGS_GW_SERVICE } from '@/lib/aquascan-geology/bgsAfricaGroundwater';

// The response shape below is what the BGS identify endpoint returned for
// Kitale on 2026-11-20 (depth VS, storage LM, productivity M).
const kitale = { results: [
  { layerId: 1, layerName: 'Depth to Groundwater (mbgl)', attributes: { 'Raster.DTWAFRICA_': 'VS' } },
  { layerId: 2, layerName: 'Storage (water depth in mm)', attributes: { 'Raster.GWSTOR_V2': 'LM' } },
  { layerId: 3, layerName: 'Productivity (l/s)', attributes: { 'Raster.GWPROD_V2': 'M' } },
] };
const ok = (body: unknown) => (async () => new Response(JSON.stringify(body))) as unknown as typeof fetch;

beforeEach(() => _clearBgsCache());

describe('BGS regional groundwater context', () => {
  it('decodes the classes with their legend ranges, licence and scale', async () => {
    let url = '';
    const c = await groundwaterContext(1.0157, 35.0062, (async (u: string) => { url = u; return new Response(JSON.stringify(kitale)); }) as unknown as typeof fetch);
    expect(url.startsWith(`${BGS_GW_SERVICE}/identify?`)).toBe(true);
    expect(url).toMatch(/layers=all%3A1%2C2%2C3/);
    expect(c.status).toBe('OK');
    expect(c.depthToGroundwater).toEqual({ code: 'VS', label: 'Very shallow', rangeM: '0–7 m below ground' });
    expect(c.storage).toEqual({ code: 'LM', label: 'Low–moderate', rangeMm: '1000–10000 mm of water' });
    expect(c.productivity).toEqual({ code: 'M', label: 'Moderate', rangeLs: '1–5 L/s' });
    expect(c.acknowledgement).toMatch(/Natural Environment Research Council/);
    expect(c.use).toMatch(/does not give the depth or yield of a borehole at this site/);
  });
  it('outside Africa → NO DATA without a request; empty answer → NO DATA; failure → SERVICE UNAVAILABLE', async () => {
    let called = false;
    expect((await groundwaterContext(51.5, -0.1, (async () => { called = true; return new Response('{}'); }) as unknown as typeof fetch)).status).toBe('NO DATA');
    expect(called).toBe(false);
    expect((await groundwaterContext(-1.0, 33.0, ok({ results: [] }))).status).toBe('NO DATA');
    expect((await groundwaterContext(-1.2, 36.8, (async () => new Response('', { status: 502 })) as unknown as typeof fetch)).status).toBe('SERVICE UNAVAILABLE');
    expect((await groundwaterContext(-1.3, 36.9, ok({ error: { code: 500, message: 'x' } }))).status).toBe('SERVICE UNAVAILABLE');
  });
  it('an unrecognised class code is never guessed', async () => {
    const c = await groundwaterContext(0.5, 35.5, ok({ results: [{ layerId: 3, attributes: { 'Raster.GWPROD_V2': 'ZZ' } }] }));
    expect(c.status).toBe('NO DATA');
    expect(c.reason).toMatch(/Unrecognised class codes: productivity "ZZ"/);
  });
  it('repeat lookups are cached', async () => {
    let n = 0;
    const f = (async () => { n++; return new Response(JSON.stringify(kitale)); }) as unknown as typeof fetch;
    await groundwaterContext(1.0157, 35.0062, f); await groundwaterContext(1.0157, 35.0062, f);
    expect(n).toBe(1);
  });
});
