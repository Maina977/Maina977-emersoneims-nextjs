/**
 * Solar position (moved unchanged from hourly.ts on 2026-11-25 so that the
 * horizon-shading module can use it without a circular import; hourly.ts
 * re-exports it).
 *
 * Algorithm: the NOAA solar calculator equations, which are the low-accuracy
 * sun-position method of J. Meeus, "Astronomical Algorithms" (2nd ed., 1998),
 * ch. 25 (solar coordinates) and ch. 28 (equation of time, Smart's formula).
 * True (geometric) zenith: no atmospheric refraction is applied.
 * Checked against Meeus Example 25.a / 28.b in
 * tests/regression/solar-sld-shading.test.ts and, in the hourly chain,
 * against pvlib (tests/regression/solar-hourly-benchmark.test.ts).
 */
const D = Math.PI / 180;

/** Solar zenith and azimuth (degrees; azimuth clockwise from north) — NOAA/Meeus. */
export function solarPosition(utcMs: number, latDeg: number, lonDeg: number): { zenith: number; azimuth: number; doy: number } {
  const jd = utcMs / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * D) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * D) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * D) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * D);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * D);
  const decl = Math.asin(Math.sin(eps * D) * Math.sin(lambda * D));
  const y = Math.tan((eps / 2) * D) ** 2;
  const eot = 4 * (y * Math.sin(2 * L0 * D) - 2 * e * Math.sin(M * D) + 4 * e * y * Math.sin(M * D) * Math.cos(2 * L0 * D) - 0.5 * y * y * Math.sin(4 * L0 * D) - 1.25 * e * e * Math.sin(2 * M * D)) / D; // minutes
  const dt = new Date(utcMs);
  const minutes = dt.getUTCHours() * 60 + dt.getUTCMinutes() + dt.getUTCSeconds() / 60;
  const tst = minutes + eot + 4 * lonDeg;
  const ha = (tst / 4 - 180) * D;
  const lat = latDeg * D;
  const cosZ = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha);
  const zenith = Math.acos(Math.max(-1, Math.min(1, cosZ))) / D;
  const az = (Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat)) / D + 180 + 360) % 360;
  const doy = Math.floor((utcMs - Date.UTC(dt.getUTCFullYear(), 0, 1)) / 86400000) + 1;
  return { zenith, azimuth: az, doy };
}
