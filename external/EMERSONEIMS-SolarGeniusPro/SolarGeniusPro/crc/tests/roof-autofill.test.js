// Tests for roof-autofill.js
// Uses a mock fetch returning a real-shape Overpass JSON so we never hit the
// network in CI. Geometry numbers are checked against independently-computed
// expected values for a 10 m × 10 m rectangle near the equator.

'use strict';

const ra = require('../server/roof-autofill');
const I = ra._internals;

describe('roof-autofill — geometry primitives', () => {
  test('haversine: 1° latitude ≈ 111 195 m', () => {
    const d = I.haversineM(0, 0, 1, 0);
    expect(d).toBeGreaterThan(111000);
    expect(d).toBeLessThan(111400);
  });

  test('forwardAzimuth: due north == 0°', () => {
    expect(I.forwardAzimuthDeg(0, 0, 1, 0)).toBeCloseTo(0, 1);
  });

  test('forwardAzimuth: due east ≈ 90°', () => {
    expect(I.forwardAzimuthDeg(0, 0, 0, 1)).toBeCloseTo(90, 1);
  });

  test('sphericalPolygonAreaM2: 10×10 m square ≈ 100 m²', () => {
    // ~10 m at the equator: 10 / 111195 ≈ 8.9932e-5°
    const d = 10 / 111195;
    const ring = [
      [0, 0], [d, 0], [d, d], [0, d], [0, 0],
    ];
    const a = I.sphericalPolygonAreaM2(ring);
    expect(a).toBeGreaterThan(99);
    expect(a).toBeLessThan(101);
  });

  test('perimeterM: 10×10 m square ≈ 40 m', () => {
    const d = 10 / 111195;
    const ring = [[0,0],[d,0],[d,d],[0,d],[0,0]];
    expect(I.perimeterM(ring)).toBeGreaterThan(39.5);
    expect(I.perimeterM(ring)).toBeLessThan(40.5);
  });

  test('dominantAzimuthDeg: ridge along E-W returns 90° (mod 180)', () => {
    const d = 20 / 111195;     // long edge 20 m E-W
    const s = 5  / 111195;     // short edge 5 m N-S
    const ring = [[0,0],[d,0],[d,s],[0,s],[0,0]];
    expect(I.dominantAzimuthDeg(ring)).toBeCloseTo(90, 0);
  });

  test('bbox: a 50 m radius around Nairobi expands ~9e-4°', () => {
    const b = I.bbox(-1.286, 36.817, 50);
    expect(b.north - b.south).toBeGreaterThan(0.0008);
    expect(b.north - b.south).toBeLessThan(0.0011);
  });

  test('overpassQuery: includes building selector and bbox order S,W,N,E', () => {
    const q = I.overpassQuery(-1.286, 36.817, 40);
    expect(q).toMatch(/way\["building"\]/);
    expect(q).toMatch(/relation\["building"\]/);
    expect(q).toMatch(/out geom;/);
  });
});

describe('roof-autofill — externalGeoJson path (no network)', () => {
  test('Polygon GeoJSON yields area, perimeter, azimuth, centroid', async () => {
    const d = 10 / 111195;
    const gj = { type: 'Polygon', coordinates: [[[0,0],[d,0],[d,d],[0,d],[0,0]]] };
    const r = await ra.autofillRoof({ lat: 0, lon: 0, externalGeoJson: gj });
    expect(r.geometry.areaM2).toBeGreaterThan(99);
    expect(r.geometry.areaM2).toBeLessThan(101);
    expect(r.geometry.perimeterM).toBeGreaterThan(39.5);
    expect(r.provenance.source).toMatch(/external GeoJSON/);
    expect(r.pitchDegrees).toBeNull();
    expect(r.pitchProvenance).toMatch(/NOT MEASURED/);
  });

  test('user-supplied pitch is echoed with honest provenance label', async () => {
    const d = 10 / 111195;
    const gj = { type: 'Polygon', coordinates: [[[0,0],[d,0],[d,d],[0,d],[0,0]]] };
    const r = await ra.autofillRoof({
      lat: 0, lon: 0, externalGeoJson: gj, assumedPitchDegrees: 22,
    });
    expect(r.pitchDegrees).toBe(22);
    expect(r.pitchProvenance).toMatch(/user-provided estimate/);
    expect(r.pitchProvenance).toMatch(/NOT measured/);
  });

  test('Feature wrapper is unwrapped', async () => {
    const d = 10 / 111195;
    const feat = { type: 'Feature', properties: {}, geometry: {
      type: 'Polygon', coordinates: [[[0,0],[d,0],[d,d],[0,d],[0,0]]]
    }};
    const r = await ra.autofillRoof({ lat: 0, lon: 0, externalGeoJson: feat });
    expect(r.geometry.areaM2).toBeGreaterThan(99);
  });

  test('rejects bad GeoJSON', async () => {
    await expect(ra.autofillRoof({ lat: 0, lon: 0,
      externalGeoJson: { type: 'Point', coordinates: [0, 0] }
    })).rejects.toThrow(/no polygon ring/);
  });
});

describe('roof-autofill — Overpass path (mock fetch)', () => {
  test('picks closest building and returns OSM provenance', async () => {
    const d = 10 / 111195;
    const fakeFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        elements: [
          { type: 'way', id: 999, tags: { building: 'house' },
            geometry: [
              { lon: 0,   lat: 0   },
              { lon: d,   lat: 0   },
              { lon: d,   lat: d   },
              { lon: 0,   lat: d   },
              { lon: 0,   lat: 0   },
            ] },
        ],
      }),
    });
    const r = await ra.autofillRoof({
      lat: d/2, lon: d/2, fetchImpl: fakeFetch,
    });
    expect(r.geometry.areaM2).toBeGreaterThan(99);
    expect(r.provenance.source).toMatch(/OpenStreetMap/);
    expect(r.provenance.osmId).toBe(999);
    expect(r.provenance.sourceUrl).toMatch(/openstreetmap\.org\/way\/999/);
    expect(r.provenance.license).toMatch(/ODbL/);
  });

  test('throws helpful message when no building found', async () => {
    const fakeFetch = async () => ({
      ok: true, status: 200, json: async () => ({ elements: [] }),
    });
    await expect(ra.autofillRoof({
      lat: 0, lon: 0, fetchImpl: fakeFetch,
    })).rejects.toThrow(/no OSM building footprint/);
  });

  test('propagates Overpass HTTP errors', async () => {
    const fakeFetch = async () => ({ ok: false, status: 504, json: async () => ({}) });
    await expect(ra.autofillRoof({
      lat: 0, lon: 0, fetchImpl: fakeFetch,
    })).rejects.toThrow(/Overpass HTTP 504/);
  });

  test('rejects missing lat/lon', async () => {
    await expect(ra.autofillRoof({})).rejects.toThrow(/lat and lon/);
  });
});
