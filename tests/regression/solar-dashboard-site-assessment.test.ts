import { describe, it, expect } from 'vitest';
import { mapSiteAssessment, parseGeocodeHits } from '@/components/solar-modules/crc/src/services/siteAssessment';

describe('Solar dashboard address search', () => {
  it('reads the plain array /api/geocode really returns (was always "Geocoding failed")', () => {
    expect(parseGeocodeHits([{ displayName: 'Kitale, Trans-Nzoia County, Kenya', lat: 1.0157, lon: 35.0062 }])).toEqual([{ displayName: 'Kitale, Trans-Nzoia County, Kenya', lat: 1.0157, lon: 35.0062 }]);
  });
  it('no match → []; service unavailable (error object) → null; malformed rows dropped', () => {
    expect(parseGeocodeHits([])).toEqual([]);
    expect(parseGeocodeHits({ status: 'SERVICE UNAVAILABLE', error: 'x' })).toBeNull();
    expect(parseGeocodeHits([{ displayName: 'x', lat: 'n/a', lon: 1 }])).toEqual([]);
    expect(parseGeocodeHits({ success: true, data: [{ displayName: 'y', lat: 1, lon: 2 }] })).toHaveLength(1);
  });
});

// The Solar dashboard showed "—" for irradiance, temperature and roof area on
// every site because it read `.data…` on bodies that have no `.data`
// (found 2026-11-14 while verifying Release 3).
describe('Solar dashboard site assessment mapping', () => {
  it('reads the real response shapes', () => {
    const a = mapSiteAssessment(
      { status: 'OK', summary: { averageDailyGHI: 5.62 }, parameters: {} },
      { current: { temperature: 19.4 }, source: 'Data from MET Norway' },
      { status: 'OK', found: true, roofAreaM2: 142, source: 'osm', attribution: '© OpenStreetMap contributors (ODbL)' },
    );
    expect(a.irradianceKwhPerM2Day).toBe(5.62);
    expect(a.temperatureC).toBe(19.4);
    expect(a.roofAreaM2).toBe(142);
    expect(a.roofProvenance).toMatch(/OpenStreetMap building footprint/);
  });
  it('missing data stays missing: no roof when none found; NASA with no valid days → null', () => {
    const a = mapSiteAssessment(
      { status: 'INSUFFICIENT EVIDENCE', summary: { averageDailyGHI: null }, parameters: { ALLSKY_SFC_SW_DWN: { a: -999 } } },
      { error: 'HTTP 502' },
      { status: 'SERVICE UNAVAILABLE', found: false, roofAreaM2: null, note: 'SERVICE UNAVAILABLE: OpenStreetMap did not answer. Measure or draw the roof.' },
    );
    expect(a.irradianceKwhPerM2Day).toBeNull();
    expect(a.temperatureC).toBeNull();
    expect(a.roofAreaM2).toBeNull();
    expect(a.roofProvenance).toBe('');
    expect(a.roofNote).toMatch(/Measure or draw the roof/);
  });
});
