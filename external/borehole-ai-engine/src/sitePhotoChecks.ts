/**
 * Site-photo checks (AquaScan site-photo workflow, 2026-11-25, branch ws/aquascan-site-photos).
 *
 * Only what a computer can genuinely measure in a photo file: type, size, resolution,
 * sharpness (variance of the Laplacian), exposure, near-duplicates (difference hash),
 * camera metadata (EXIF GPS and capture time), the spread of the photos' GPS positions
 * and their distance from the location the customer entered, and the photo's age.
 *
 * Nothing here looks at what the photo shows (no land cover, geology or "water" from
 * colours). Every check reports its measured value and its threshold. The thresholds are
 * AquaScan engineering choices, stated as such in SITE_PHOTO_THRESHOLDS: they are not
 * taken from a standard.
 *
 * Pure functions: no DOM. The browser decodes the image into RGBA pixels
 * (sitePhotoBrowser.ts); tests pass synthetic pixels.
 */

export interface RgbaImage { width: number; height: number; data: Uint8ClampedArray | Uint8Array }

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Engineering thresholds (not standards). Each is reported beside the measured value. */
export const SITE_PHOTO_THRESHOLDS = {
  maxFileBytes: 25 * 1024 * 1024,
  minFileBytes: 20 * 1024,
  minShortSidePx: 600,
  minLongSidePx: 800,
  /** Variance of the 4-neighbour Laplacian on a grey image scaled to ≤ 512 px. Below = blurred. */
  minLaplacianVariance: 60,
  /** Mean luma (0-255) limits. */
  minMeanLuma: 40,
  maxMeanLuma: 220,
  /** Fraction of pixels near black (< 16) or near white (> 240) above which the photo is clipped. */
  maxClippedFraction: 0.6,
  /** Hamming distance (of 64 bits) at or below which two photos are near-duplicates. */
  maxDuplicateHamming: 6,
  /** Spread of the photos' EXIF GPS positions for ONE location. */
  maxGpsSpreadM: 150,
  /** Distance of a photo's EXIF GPS from the location entered: warn above, refuse above. */
  warnDistanceM: 250,
  failDistanceM: 1000,
  /** Photo older than this (days) is flagged: conditions may have changed. */
  maxAgeDays: 365,
  /** Usable photos needed for a location (shows the spot and its surroundings). */
  minUsablePhotos: 2,
  maxPhotosPerLocation: 4,
} as const;

export type CheckStatus = 'ok' | 'warn' | 'fail' | 'info';
export interface PhotoCheck { id: string; label: string; measured: string; threshold: string; status: CheckStatus; note?: string }

// ───────────────────────────── pixel metrics ─────────────────────────────

/** Grey (Rec. 601 luma) image, box-downscaled so the longer side is ≤ maxSide. */
export function toGrey(img: RgbaImage, maxSide = 512): { w: number; h: number; g: Float64Array } {
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const g = new Float64Array(w * h);
  const cnt = new Float64Array(w * h);
  for (let y = 0; y < img.height; y++) {
    const ty = Math.min(h - 1, Math.floor((y * h) / img.height));
    for (let x = 0; x < img.width; x++) {
      const tx = Math.min(w - 1, Math.floor((x * w) / img.width));
      const i = (y * img.width + x) * 4;
      g[ty * w + tx] += 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
      cnt[ty * w + tx] += 1;
    }
  }
  for (let k = 0; k < g.length; k++) g[k] /= cnt[k] || 1;
  return { w, h, g };
}

export interface PixelMetrics { meanLuma: number; darkFraction: number; brightFraction: number; laplacianVariance: number; dHash: string; analysedWidth: number; analysedHeight: number }

export function measurePixels(img: RgbaImage): PixelMetrics {
  const { w, h, g } = toGrey(img, 512);
  let sum = 0, dark = 0, bright = 0;
  for (const v of g) { sum += v; if (v < 16) dark++; if (v > 240) bright++; }
  // Laplacian (4-neighbour) variance over interior pixels.
  let n = 0, ls = 0, ls2 = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const c = g[y * w + x];
    const l = g[(y - 1) * w + x] + g[(y + 1) * w + x] + g[y * w + x - 1] + g[y * w + x + 1] - 4 * c;
    ls += l; ls2 += l * l; n++;
  }
  const lapVar = n ? ls2 / n - (ls / n) ** 2 : 0;
  return { meanLuma: sum / g.length, darkFraction: dark / g.length, brightFraction: bright / g.length, laplacianVariance: lapVar, dHash: dHash(img), analysedWidth: w, analysedHeight: h };
}

/** 64-bit difference hash (9×8 grey, adjacent comparison), as 16 hex digits. */
export function dHash(img: RgbaImage): string {
  const W = 9, H = 8;
  const acc = new Float64Array(W * H), cnt = new Float64Array(W * H);
  for (let y = 0; y < img.height; y++) {
    const ty = Math.min(H - 1, Math.floor((y * H) / img.height));
    for (let x = 0; x < img.width; x++) {
      const tx = Math.min(W - 1, Math.floor((x * W) / img.width));
      const i = (y * img.width + x) * 4;
      acc[ty * W + tx] += 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
      cnt[ty * W + tx]++;
    }
  }
  let bits = '';
  for (let y = 0; y < H; y++) for (let x = 0; x < W - 1; x++) {
    const a = acc[y * W + x] / (cnt[y * W + x] || 1), b = acc[y * W + x + 1] / (cnt[y * W + x + 1] || 1);
    bits += a > b ? '1' : '0';
  }
  let hex = '';
  for (let i = 0; i < 64; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}

export function hamming(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { d += x & 1; x >>= 1; }
  }
  return d + 4 * Math.abs(a.length - b.length);
}

// ─────────────────────────────── EXIF ───────────────────────────────

export interface ExifInfo { gps: { latitude: number; longitude: number } | null; capturedAt: string | null; make: string | null; model: string | null }

/**
 * Minimal JPEG EXIF reader: GPS (tags 1-4 of the GPS IFD), DateTimeOriginal (0x9003, Exif IFD)
 * or DateTime (0x0132), Make (0x010F), Model (0x0110). Returns all-null for PNG/WebP or a
 * JPEG without EXIF. Bounds-checked; never throws.
 */
export function readExif(bytes: Uint8Array): ExifInfo {
  const none: ExifInfo = { gps: null, capturedAt: null, make: null, model: null };
  try {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return none;
    let p = 2;
    while (p + 4 <= bytes.length) {
      if (bytes[p] !== 0xff) return none;
      const marker = bytes[p + 1];
      const len = (bytes[p + 2] << 8) | bytes[p + 3];
      if (marker === 0xda || marker === 0xd9) return none;
      if (marker === 0xe1 && bytes[p + 4] === 0x45 && bytes[p + 5] === 0x78 && bytes[p + 6] === 0x69 && bytes[p + 7] === 0x66) {
        return parseTiff(bytes.subarray(p + 10, p + 2 + len));
      }
      p += 2 + len;
    }
  } catch { /* fall through */ }
  return none;
}

function parseTiff(t: Uint8Array): ExifInfo {
  const out: ExifInfo = { gps: null, capturedAt: null, make: null, model: null };
  if (t.length < 8) return out;
  const le = t[0] === 0x49 && t[1] === 0x49;
  if (!le && !(t[0] === 0x4d && t[1] === 0x4d)) return out;
  const u16 = (o: number) => (o + 2 <= t.length ? (le ? t[o] | (t[o + 1] << 8) : (t[o] << 8) | t[o + 1]) : 0);
  const u32 = (o: number) => (o + 4 <= t.length ? (le ? (t[o] | (t[o + 1] << 8) | (t[o + 2] << 16)) + t[o + 3] * 2 ** 24 : t[o] * 2 ** 24 + ((t[o + 1] << 16) | (t[o + 2] << 8) | t[o + 3])) : 0);
  type Entry = { tag: number; type: number; count: number; valueOffset: number; raw: number };
  const readIfd = (off: number): Entry[] => {
    const n = u16(off);
    const es: Entry[] = [];
    for (let i = 0; i < n && i < 500; i++) {
      const e = off + 2 + i * 12;
      if (e + 12 > t.length) break;
      es.push({ tag: u16(e), type: u16(e + 2), count: u32(e + 4), valueOffset: u32(e + 8), raw: e + 8 });
    }
    return es;
  };
  const ascii = (e: Entry) => {
    const start = e.count <= 4 ? e.raw : e.valueOffset;
    let s = '';
    for (let i = 0; i < e.count && start + i < t.length; i++) { const c = t[start + i]; if (c === 0) break; s += String.fromCharCode(c); }
    return s.trim() || null;
  };
  const rationals = (e: Entry) => {
    const vals: number[] = [];
    for (let i = 0; i < e.count; i++) { const o = e.valueOffset + i * 8; const d = u32(o + 4); vals.push(d ? u32(o) / d : NaN); }
    return vals;
  };
  const ifd0 = readIfd(u32(4));
  let exifOff = 0, gpsOff = 0;
  for (const e of ifd0) {
    if (e.tag === 0x010f) out.make = ascii(e);
    else if (e.tag === 0x0110) out.model = ascii(e);
    else if (e.tag === 0x0132 && !out.capturedAt) out.capturedAt = ascii(e);
    else if (e.tag === 0x8769) exifOff = e.valueOffset;
    else if (e.tag === 0x8825) gpsOff = e.valueOffset;
  }
  if (exifOff) for (const e of readIfd(exifOff)) if (e.tag === 0x9003) out.capturedAt = ascii(e) ?? out.capturedAt;
  if (gpsOff) {
    let latRef = '', lonRef = '', lat: number[] = [], lon: number[] = [];
    for (const e of readIfd(gpsOff)) {
      if (e.tag === 1) latRef = String.fromCharCode(t[e.raw]);
      else if (e.tag === 2 && e.type === 5 && e.count === 3) lat = rationals(e);
      else if (e.tag === 3) lonRef = String.fromCharCode(t[e.raw]);
      else if (e.tag === 4 && e.type === 5 && e.count === 3) lon = rationals(e);
    }
    const dms = (v: number[]) => v[0] + v[1] / 60 + v[2] / 3600;
    if (lat.length === 3 && lon.length === 3 && [...lat, ...lon].every(Number.isFinite)) {
      const la = dms(lat) * (latRef === 'S' ? -1 : 1), lo = dms(lon) * (lonRef === 'W' ? -1 : 1);
      if (Math.abs(la) <= 90 && Math.abs(lo) <= 180 && !(la === 0 && lo === 0)) out.gps = { latitude: la, longitude: lo };
    }
  }
  return out;
}

/** EXIF "YYYY:MM:DD HH:MM:SS" → ISO, or null. */
export function exifDateToIso(s: string | null): string | null {
  const m = s && /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(s);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

export function distanceM(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371000, toR = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * toR, dLon = (b.longitude - a.longitude) * toR;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * toR) * Math.cos(b.latitude * toR) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

// ─────────────────────────── per-photo and per-set checks ───────────────────────────

export interface PhotoFacts {
  fileName: string; type: string; bytes: number; width: number; height: number;
  metrics: PixelMetrics; exif: ExifInfo;
}

const fmt = (x: number, dp = 0) => (Number.isFinite(x) ? x.toFixed(dp) : '—');
const T = SITE_PHOTO_THRESHOLDS;

/** Checks on one photo. `fail` = the photo is not usable as evidence. */
export function checkPhoto(p: PhotoFacts, now: Date): PhotoCheck[] {
  const c: PhotoCheck[] = [];
  const typeOk = (ACCEPTED_TYPES as readonly string[]).includes(p.type);
  c.push({ id: 'type', label: 'File type', measured: p.type || 'unknown', threshold: ACCEPTED_TYPES.join(', '), status: typeOk ? 'ok' : 'fail' });
  c.push({ id: 'size', label: 'File size', measured: `${fmt(p.bytes / 1024)} KB`, threshold: `${T.minFileBytes / 1024}-${T.maxFileBytes / 1024 / 1024 * 1024} KB`, status: p.bytes > T.maxFileBytes ? 'fail' : p.bytes < T.minFileBytes ? 'warn' : 'ok', note: p.bytes < T.minFileBytes ? 'Very small file: a thumbnail or a heavily compressed copy.' : undefined });
  const short = Math.min(p.width, p.height), long = Math.max(p.width, p.height);
  c.push({ id: 'resolution', label: 'Resolution', measured: `${p.width} × ${p.height} px`, threshold: `at least ${T.minLongSidePx} × ${T.minShortSidePx} px`, status: short >= T.minShortSidePx && long >= T.minLongSidePx ? 'ok' : 'fail' });
  c.push({ id: 'blur', label: 'Sharpness (variance of the Laplacian)', measured: fmt(p.metrics.laplacianVariance, 1), threshold: `at least ${T.minLaplacianVariance}`, status: p.metrics.laplacianVariance >= T.minLaplacianVariance ? 'ok' : 'fail', note: p.metrics.laplacianVariance < T.minLaplacianVariance ? 'Photo too blurred to assess: details such as wires, pits or tracks cannot be seen.' : undefined });
  const clipped = Math.max(p.metrics.darkFraction, p.metrics.brightFraction);
  const expOk = p.metrics.meanLuma >= T.minMeanLuma && p.metrics.meanLuma <= T.maxMeanLuma && clipped <= T.maxClippedFraction;
  c.push({ id: 'exposure', label: 'Exposure (mean brightness 0-255; clipped share)', measured: `${fmt(p.metrics.meanLuma)}; ${fmt(clipped * 100)} % clipped`, threshold: `${T.minMeanLuma}-${T.maxMeanLuma}; at most ${T.maxClippedFraction * 100} % clipped`, status: expOk ? 'ok' : 'fail', note: expOk ? undefined : p.metrics.meanLuma < T.minMeanLuma || p.metrics.darkFraction > T.maxClippedFraction ? 'Too dark.' : 'Too bright (over-exposed).' });
  c.push({ id: 'exif-gps', label: 'Camera GPS position (EXIF)', measured: p.exif.gps ? `${p.exif.gps.latitude.toFixed(5)}, ${p.exif.gps.longitude.toFixed(5)}` : 'absent', threshold: 'present', status: p.exif.gps ? 'ok' : 'warn', note: p.exif.gps ? undefined : 'No GPS in the file (location services off, or the photo was sent through a messaging app or edited).' });
  const iso = exifDateToIso(p.exif.capturedAt);
  c.push({ id: 'exif-time', label: 'Capture time (EXIF)', measured: iso ?? 'absent', threshold: 'present', status: iso ? 'ok' : 'warn', note: iso ? undefined : 'No capture time: a screenshot, an edited copy or a messaging-app copy.' });
  if (iso) {
    const ageDays = (now.getTime() - Date.parse(iso)) / 86400000;
    c.push({ id: 'age', label: 'Photo age', measured: ageDays < 0 ? 'in the future' : `${fmt(ageDays)} days`, threshold: `0-${T.maxAgeDays} days`, status: ageDays < -1 ? 'fail' : ageDays > T.maxAgeDays ? 'warn' : 'ok', note: ageDays > T.maxAgeDays ? 'Older than a year: the site may have changed.' : ageDays < -1 ? 'Capture time is after today: the camera clock or the file is wrong.' : undefined });
  }
  return c;
}

export interface SetPhoto { facts: PhotoFacts; checks: PhotoCheck[] }
export interface SetResult {
  perPhoto: { fileName: string; usable: boolean; duplicateOf: number | null; distanceFromEnteredM: number | null; extra: PhotoCheck[] }[];
  setChecks: PhotoCheck[];
  usableCount: number;
  sufficient: boolean;
  reasons: string[];
}

/** Checks across the photos of ONE candidate location. */
export function checkPhotoSet(photos: SetPhoto[], entered: { latitude: number; longitude: number } | null): SetResult {
  const reasons: string[] = [];
  const perPhoto: SetResult['perPhoto'] = photos.map((p, i) => {
    let dup: number | null = null;
    for (let j = 0; j < i; j++) if (hamming(p.facts.metrics.dHash, photos[j].facts.metrics.dHash) <= T.maxDuplicateHamming) { dup = j + 1; break; }
    const extra: PhotoCheck[] = [];
    extra.push({ id: 'duplicate', label: 'Near-duplicate of an earlier photo (difference hash)', measured: dup ? `same as photo ${dup}` : 'no', threshold: `Hamming distance ≤ ${T.maxDuplicateHamming} of 64 bits = duplicate`, status: dup ? 'fail' : 'ok' });
    let d: number | null = null;
    if (entered && p.facts.exif.gps) {
      d = distanceM(entered, p.facts.exif.gps);
      extra.push({ id: 'distance', label: 'Photo GPS distance from the location entered', measured: `${fmt(d)} m`, threshold: `warn above ${T.warnDistanceM} m; refuse above ${T.failDistanceM} m`, status: d > T.failDistanceM ? 'fail' : d > T.warnDistanceM ? 'warn' : 'ok', note: d > T.failDistanceM ? 'The photo was taken somewhere else: it cannot show this location.' : undefined });
    }
    const usable = ![...p.checks, ...extra].some((c) => c.status === 'fail');
    return { fileName: p.facts.fileName, usable, duplicateOf: dup, distanceFromEnteredM: d, extra };
  });
  const setChecks: PhotoCheck[] = [];
  const gps = photos.map((p) => p.facts.exif.gps).filter((g): g is { latitude: number; longitude: number } => !!g);
  let spread = 0;
  for (let i = 0; i < gps.length; i++) for (let j = i + 1; j < gps.length; j++) spread = Math.max(spread, distanceM(gps[i], gps[j]));
  if (gps.length >= 2) setChecks.push({ id: 'spread', label: 'Spread of the photos\' GPS positions', measured: `${fmt(spread)} m`, threshold: `at most ${T.maxGpsSpreadM} m for one location`, status: spread > T.maxGpsSpreadM ? 'warn' : 'ok', note: spread > T.maxGpsSpreadM ? 'The photos may show more than one place: take all four at the proposed spot.' : undefined });
  const withMeta = photos.filter((p) => p.facts.exif.gps || exifDateToIso(p.facts.exif.capturedAt)).length;
  setChecks.push({ id: 'metadata', label: 'Photos with camera metadata (GPS or capture time)', measured: `${withMeta} of ${photos.length}`, threshold: 'at least 1', status: withMeta ? 'ok' : 'fail', note: withMeta ? undefined : 'No photo has camera metadata: they cannot be confirmed as taken at this site (screenshots or messaging-app copies).' });
  const usableCount = perPhoto.filter((p) => p.usable).length;
  setChecks.push({ id: 'usable', label: 'Usable photos', measured: `${usableCount} of ${photos.length}`, threshold: `at least ${T.minUsablePhotos}`, status: usableCount >= T.minUsablePhotos ? 'ok' : 'fail' });

  if (!photos.length) reasons.push('No photos.');
  if (usableCount < T.minUsablePhotos) reasons.push(`Only ${usableCount} usable photo(s); at least ${T.minUsablePhotos} sharp, well-exposed, different photos of the spot and its surroundings are needed.`);
  if (perPhoto.some((p) => p.duplicateOf)) reasons.push('Duplicate photos: each photo must show a different view.');
  if (perPhoto.some((p) => p.distanceFromEnteredM != null && p.distanceFromEnteredM > T.failDistanceM)) reasons.push(`A photo was taken more than ${T.failDistanceM} m from the location entered: misleading for this location.`);
  if (!withMeta && photos.length) reasons.push('No photo has camera metadata, so none can be confirmed as taken at this site.');
  const sufficient = photos.length > 0 && usableCount >= T.minUsablePhotos && withMeta > 0 && !perPhoto.some((p) => p.distanceFromEnteredM != null && p.distanceFromEnteredM > T.failDistanceM);
  return { perPhoto, setChecks, usableCount, sufficient, reasons };
}
