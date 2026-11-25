/**
 * Management 2026-11-25 (3) / review B2: a coarse location (country, county, town) produces a
 * request for a precise site location; only a village, locality or finer (≤ 5 km across) is pinned.
 */
import { describe, it, expect } from 'vitest';
import { placePrecision, SITE_LOCATION_NEEDED, MAX_PLACE_EXTENT_KM } from '@/external/borehole-ai-engine/src/locationPrecision';

const box = (s: number, n: number, w: number, e: number) => [String(s), String(n), String(w), String(e)];
describe('place-search precision', () => {
  it.each([
    ['country', 'Kenya', box(-4.9, 5.0, 33.9, 41.9)],
    ['county', 'Nakuru County', box(-1.2, 0.2, 35.3, 36.6)],
    ['state', 'Rift Valley', box(-3, 4, 34, 37)],
    ['city', 'Nakuru', box(-0.35, -0.25, 36.0, 36.15)],
    ['town', 'Kitale', box(0.98, 1.05, 34.95, 35.05)],
  ])('%s "%s" is refused with a request for a precise location', (kind, name, bb) => {
    const r = placePrecision({ display_name: name, addresstype: kind, boundingbox: bb });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toMatch(/not a site\. Search for the village or locality of the drilling spot, or enter its coordinates\./);
  });
  it('a village about 3 km across is pinned, with its precision stated', () => {
    const r = placePrecision({ display_name: 'Emabungo', addresstype: 'village', boundingbox: box(0.0467, 0.0667, 34.6812, 34.7012) });
    expect(r.ok).toBe(true);
    expect(r.ok && r.note).toMatch(/^Pin set at the centre of Emabungo \(village, about 3 km across\)/);
  });
  it(`a fine-grained type over ${MAX_PLACE_EXTENT_KM} km across, or with no size, is refused`, () => {
    expect(placePrecision({ display_name: 'Big area', addresstype: 'locality', boundingbox: box(0, 0.2, 35, 35.2) }).ok).toBe(false);
    expect(placePrecision({ display_name: 'No size', addresstype: 'village' }).ok).toBe(false);
  });
  it('the refusal is a "Location problem" that asks for coordinates, camera GPS or a searched village/locality', () => {
    expect(SITE_LOCATION_NEEDED).toMatch(/^Location problem: AquaScan needs a site-specific location: type the coordinates, use the place search to pin the village or locality, or add a photo that has its camera GPS position\./);
  });
});
