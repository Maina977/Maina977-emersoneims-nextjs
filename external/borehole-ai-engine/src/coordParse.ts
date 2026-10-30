/**
 * Strict parsing of typed or pasted coordinates (2026-10-30 audit: parseFloat
 * accepted "34.6abc", read "1.2921 S" as north, and dropped "0,0266" to 0).
 *
 * Accepts, per value: decimal degrees with a point or a comma ("-1.2921",
 * "-1,2921"), a hemisphere letter before or after ("1.2921 S", "S1.2921"),
 * and degrees-minutes-seconds ("1°17'31.6\"S", "36°49'19\" E"). Anything else
 * in the field is refused rather than ignored.
 */
export type CoordAxis = 'lat' | 'lon';
export interface CoordValue { value: number; axis?: CoordAxis }

const NUM = String.raw`\d+(?:[.,]\d+)?`;
const TOKEN = new RegExp(
  String.raw`^([NSEW])?\s*([-+])?\s*(${NUM})\s*(?:[°º]\s*)?(?:(${NUM})\s*['′’]\s*)?(?:(${NUM})\s*(?:["″”]|'')\s*)?([NSEW])?$`,
  'i',
);

const num = (s: string) => Number(s.replace(',', '.'));

/** One coordinate value, or null when the text is not exactly one. */
export function parseCoordValue(raw: string): CoordValue | null {
  const s = raw.trim();
  const m = TOKEN.exec(s);
  if (!m) return null;
  const [, pre, sign, d, mi, se, post] = m;
  if (pre && post) return null;
  const hemi = (pre ?? post ?? '').toUpperCase();
  if (hemi && sign) return null; // "-1.29 S" is contradictory
  const deg = num(d), min = mi ? num(mi) : 0, sec = se ? num(se) : 0;
  if ((mi && min >= 60) || (se && sec >= 60)) return null;
  if ((mi || se) && !Number.isInteger(deg)) return null;
  let v = deg + min / 60 + sec / 3600;
  if (sign === '-' || hemi === 'S' || hemi === 'W') v = -v;
  if (!Number.isFinite(v)) return null;
  const axis: CoordAxis | undefined = hemi === 'N' || hemi === 'S' ? 'lat' : hemi === 'E' || hemi === 'W' ? 'lon' : undefined;
  return { value: v, axis };
}

/**
 * Split one field holding both values. Separators: ";", "/", a comma followed
 * by a space, a comma between two point-decimals ("-1.29,36.82"), or
 * whitespace (a lone hemisphere letter stays with its number).
 */
export function splitPair(raw: string): [string, string] | null {
  const s = raw.trim();
  for (const sep of [/\s*;\s*/, /\s*\/\s*/, /,\s+/]) {
    const p = s.split(sep).filter(Boolean);
    if (p.length === 2) return [p[0], p[1]];
  }
  const c = /^([^,]*\.[^,]*),([^,]*\.[^,]*)$/.exec(s);
  if (c) return [c[1], c[2]];
  const words = s.split(/\s+/).filter(Boolean);
  const merged: string[] = [];
  for (const w of words) {
    if (/^[NSEW]$/i.test(w) && merged.length && !/[NSEW]$/i.test(merged[merged.length - 1])) merged[merged.length - 1] += ' ' + w;
    else merged.push(w);
  }
  return merged.length === 2 ? [merged[0], merged[1]] : null;
}

/** Latitude and longitude from the two fields (or one field holding both). */
export function parseCoordPair(rawLat: string, rawLon: string): { lat: number; lon: number } | { error: string } {
  let a = rawLat.trim(), b = rawLon.trim();
  if (!b) {
    const p = splitPair(a);
    if (!p) return { error: 'Enter latitude and longitude as two numbers, e.g. -1.2921, 36.8219 (or 1.2921 S, 36.8219 E).' };
    [a, b] = p;
  }
  const va = parseCoordValue(a), vb = parseCoordValue(b);
  if (!va || !vb) {
    const bad = !va ? a : b;
    return { error: `"${bad}" is not a coordinate. Use decimal degrees such as -1.2921 or 36.8219 (a comma decimal, a hemisphere letter N/S/E/W, or degrees-minutes-seconds also work).` };
  }
  // Hemisphere letters fix the order: "36.82 E, 1.29 S" is read correctly.
  if (va.axis === 'lon' || vb.axis === 'lat') {
    if (va.axis === 'lon' && vb.axis === 'lon') return { error: 'Both values are marked E/W; one must be a latitude (N/S).' };
    if (va.axis === 'lat' && vb.axis === 'lat') return { error: 'Both values are marked N/S; one must be a longitude (E/W).' };
    return { lat: vb.value, lon: va.value };
  }
  return { lat: va.value, lon: vb.value };
}
