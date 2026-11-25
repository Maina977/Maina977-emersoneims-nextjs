/**
 * Site-photo checks: measured values against stated thresholds. All images and EXIF blocks
 * are SYNTHETIC (tests/regression/aquascan-site-photo-fixtures.ts).
 */
import { describe, it, expect } from 'vitest';
import {
  measurePixels, readExif, checkPhoto, checkPhotoSet, hamming, distanceM, exifDateToIso, SITE_PHOTO_THRESHOLDS as T, type PhotoFacts,
} from '@/external/borehole-ai-engine/src/sitePhotoChecks';
import { sharpImage, blurred, scaled, jpegWithExif } from './aquascan-site-photo-fixtures';

const NOW = new Date('2026-11-25T12:00:00Z');
const SITE = { latitude: 1.0157, longitude: 35.0062 };
const sharp = sharpImage(1200, 900, 1);
const other = sharpImage(1200, 900, 3);
const blur = blurred(sharpImage(600, 450, 1), 10);
const dark = scaled(sharp, 0.12);
const bright = scaled(sharp, 0.2, 225);
const facts = (img = sharp, exif = readExif(jpegWithExif({ lat: SITE.latitude, lon: SITE.longitude })), over: Partial<PhotoFacts> = {}): PhotoFacts =>
  ({ fileName: 'p.jpg', type: 'image/jpeg', bytes: 2_500_000, width: 4000, height: 3000, metrics: measurePixels(img), exif, ...over });
const st = (f: PhotoFacts, id: string) => checkPhoto(f, NOW).find((c) => c.id === id)!;

describe('pixel measurements (synthetic images)', () => {
  it('sharp image passes the sharpness threshold; the blurred copy fails it', () => {
    expect(measurePixels(sharp).laplacianVariance).toBeGreaterThan(T.minLaplacianVariance * 5);
    expect(measurePixels(blur).laplacianVariance).toBeLessThan(T.minLaplacianVariance);
    expect(st(facts(sharp), 'blur').status).toBe('ok');
    expect(st(facts(blur), 'blur').status).toBe('fail');
    expect(st(facts(blur), 'blur').threshold).toBe(`at least ${T.minLaplacianVariance}`);
  });
  it('dark and over-exposed photos fail exposure with the measured mean shown', () => {
    expect(measurePixels(dark).meanLuma).toBeLessThan(T.minMeanLuma);
    expect(st(facts(dark), 'exposure')).toMatchObject({ status: 'fail', note: 'Too dark.' });
    expect(st(facts(bright), 'exposure')).toMatchObject({ status: 'fail', note: 'Too bright (over-exposed).' });
    expect(st(facts(sharp), 'exposure').status).toBe('ok');
  });
  it('difference hash: identical images 0 bits apart, different scenes far apart', () => {
    expect(hamming(measurePixels(sharp).dHash, measurePixels(sharpImage(1200, 900, 1)).dHash)).toBe(0);
    expect(hamming(measurePixels(sharp).dHash, measurePixels(other).dHash)).toBeGreaterThan(T.maxDuplicateHamming);
  });
  it('resolution, type and size limits', () => {
    expect(st(facts(sharp, undefined, { width: 640, height: 480 }), 'resolution').status).toBe('fail');
    expect(st(facts(sharp, undefined, { type: 'image/gif' }), 'type').status).toBe('fail');
    expect(st(facts(sharp, undefined, { bytes: 30 * 1024 * 1024 }), 'size').status).toBe('fail');
    expect(st(facts(sharp, undefined, { bytes: 5000 }), 'size').status).toBe('warn');
  });
});

describe('EXIF (synthetic JPEG headers)', () => {
  it('reads GPS, capture time and make; southern/western hemispheres signed', () => {
    const e = readExif(jpegWithExif({ lat: -1.2921, lon: 36.8219, date: '2026:11:01 09:30:00', make: 'SynthCam' }));
    expect(e.gps!.latitude).toBeCloseTo(-1.2921, 4);
    expect(e.gps!.longitude).toBeCloseTo(36.8219, 4);
    expect(e.capturedAt).toBe('2026:11:01 09:30:00');
    expect(e.make).toBe('SynthCam');
    expect(readExif(jpegWithExif({ lat: 10, lon: -20 })).gps!.longitude).toBeCloseTo(-20, 4);
  });
  it('no EXIF (PNG, bare JPEG, garbage): all null, never throws', () => {
    expect(readExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toEqual({ gps: null, capturedAt: null, make: null, model: null });
    expect(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9])).gps).toBeNull();
    expect(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0, 4, 1, 2])).gps).toBeNull();
    const noGps = readExif(jpegWithExif({}));
    expect(noGps.gps).toBeNull();
    expect(noGps.capturedAt).not.toBeNull();
  });
  it('capture time → ISO, age and future dates', () => {
    expect(exifDateToIso('2026:11:20 10:15:00')).toBe('2026-11-20T10:15:00');
    const old = facts(sharp, readExif(jpegWithExif({ date: '2023:01:01 08:00:00' })));
    expect(st(old, 'age').status).toBe('warn');
    const future = facts(sharp, readExif(jpegWithExif({ date: '2027:06:01 08:00:00' })));
    expect(st(future, 'age').status).toBe('fail');
  });
  it('haversine distance: 0.045° of latitude ≈ 5.0 km', () => {
    expect(distanceM(SITE, { latitude: SITE.latitude + 0.045, longitude: SITE.longitude })).toBeGreaterThan(4990);
    expect(distanceM(SITE, { latitude: SITE.latitude + 0.045, longitude: SITE.longitude })).toBeLessThan(5020);
  });
});

describe('photo sets for one location: insufficient or misleading photos are flagged', () => {
  const set = (fs: PhotoFacts[], entered = SITE) => checkPhotoSet(fs.map((f) => ({ facts: f, checks: checkPhoto(f, NOW) })), entered);
  const near = (dLat: number) => readExif(jpegWithExif({ lat: SITE.latitude + dLat, lon: SITE.longitude }));
  it('four good, different photos at the site: sufficient', () => {
    const r = set([facts(sharpImage(1200, 900, 1), near(0)), facts(sharpImage(1200, 900, 2), near(0.0002)), facts(sharpImage(1200, 900, 3), near(0.0001)), facts(sharpImage(1200, 900, 4), near(0))]);
    expect(r.sufficient).toBe(true);
    expect(r.usableCount).toBe(4);
  });
  it('all four identical: duplicates, INSUFFICIENT', () => {
    const r = set([facts(), facts(), facts(), facts()]);
    expect(r.perPhoto.map((p) => p.duplicateOf)).toEqual([null, 1, 1, 1]);
    expect(r.sufficient).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/Duplicate photos/);
  });
  it('all blurred: INSUFFICIENT', () => {
    const r = set([facts(blurred(sharpImage(600, 450, 1), 10)), facts(blurred(sharpImage(600, 450, 2), 10))]);
    expect(r.sufficient).toBe(false);
    expect(r.usableCount).toBe(0);
  });
  it('screenshots without camera metadata: INSUFFICIENT with the reason', () => {
    const none = { gps: null, capturedAt: null, make: null, model: null };
    const r = set([facts(sharpImage(1200, 900, 1), none, { type: 'image/png' }), facts(sharpImage(1200, 900, 2), none, { type: 'image/png' })]);
    expect(r.sufficient).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/No photo has camera metadata/);
  });
  it('a photo taken 5 km from the stated location: refused as misleading', () => {
    const r = set([facts(sharpImage(1200, 900, 1), near(0)), facts(sharpImage(1200, 900, 2), near(0.045))]);
    expect(r.perPhoto[1].distanceFromEnteredM!).toBeGreaterThan(4900);
    expect(r.perPhoto[1].usable).toBe(false);
    expect(r.sufficient).toBe(false);
    expect(r.reasons.join(' ')).toMatch(/more than 1000 m from the location entered/);
    expect(r.setChecks.find((c) => c.id === 'spread')!.status).toBe('warn');
  });
});
