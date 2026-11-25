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
    expect(r.ok && r.note).toMatch(/^Pinned at the centre of Emabungo \(village, about 3 km across\)\. Move the pin by typing the exact coordinates, or confirm it below\./);
    expect(r.ok && r.needsConfirm).toBe(true);
  });
  it(`a fine-grained type over ${MAX_PLACE_EXTENT_KM} km across, or with no size, is refused`, () => {
    expect(placePrecision({ display_name: 'Big area', addresstype: 'locality', boundingbox: box(0, 0.2, 35, 35.2) }).ok).toBe(false);
    expect(placePrecision({ display_name: 'No size', addresstype: 'village' }).ok).toBe(false);
  });
  it('the refusal is a "Location problem" that asks for coordinates, camera GPS or a searched village/locality', () => {
    expect(SITE_LOCATION_NEEDED).toMatch(/^Location problem: AquaScan needs a site-specific location: type the coordinates, use the place search to pin the village or locality, or add a photo that has its camera GPS position\./);
  });
});

// Review R2: the real Nominatim answer for "Makuyu, Kenya" (fetched by the reviewer 2026-11-25).
const MAKUYU = [
  { lat: '-0.9005840', lon: '37.1865230', class: 'place', type: 'village', place_rank: 19, addresstype: 'village', name: 'Makuyu', display_name: 'Makuyu, Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9205840', '-0.8805840', '37.1665230', '37.2065230'] },
  { lat: '-0.8862242', lon: '37.1766371', class: 'railway', type: 'station', place_rank: 30, addresstype: 'railway', name: 'Makuyu', display_name: 'Makuyu, D424, Kimorori/Wempa ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.8912242', '-0.8812242', '37.1716371', '37.1816371'] },
  { lat: '-0.9074463', lon: '37.2434046', class: 'boundary', type: 'administrative', place_rank: 16, addresstype: 'city', name: 'Makuyu ward', display_name: 'Makuyu ward, Murang`a South, Murang`a, Kenya', boundingbox: ['-0.9701955', '-0.8448274', '37.1759042', '37.3189139'] },
];
describe('review R2: point-mapped villages are pinned and must be confirmed', () => {
  it('Makuyu (village node, synthetic ±0.02° box ≈ 6.3 km) is pinned at its centre, confirmation required', () => {
    const r = placePrecision(MAKUYU[0]);
    expect(r.ok).toBe(true);
    expect(r.ok && r.needsConfirm).toBe(true);
    expect(r.ok && r.note).toBe('Pinned at the centre of Makuyu, Makuyu ward, Murang`a South, Murang`a, Kenya (village). This is the centre of the village, not necessarily your site: move the pin by typing the exact coordinates, or confirm it below.');
  });
  it('the railway station (small box) is pinned; the ward (addresstype city) is refused', () => {
    expect(placePrecision(MAKUYU[1]).ok).toBe(true);
    const ward = placePrecision(MAKUYU[2]);
    expect(ward.ok).toBe(false);
  });
  it('a village with a real (non-synthetic) box larger than 5 km is refused without telling the customer to search for a village', () => {
    const r = placePrecision({ ...MAKUYU[0], boundingbox: ['-0.95', '-0.85', '37.13', '37.25'] });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).not.toMatch(/Search for the village/);
    expect(!r.ok && r.reason).toMatch(/Enter the coordinates of the drilling spot, or search a smaller named place nearby/);
  });
  it('a village with no box at all is refused (precision unknown)', () => {
    expect(placePrecision({ ...MAKUYU[0], boundingbox: undefined }).ok).toBe(false);
  });
});
