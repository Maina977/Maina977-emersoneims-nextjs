/**
 * Hourly PV production (P1-B, 2026-11-14). Replaces the monthly mean-day
 * method where clipping matters (high DC/AC): every hour of a weather year is
 * simulated, so clear-sky peaks that the inverter clips are kept.
 *
 * Chain (each step as published; benchmarked against pvlib 0.16.1 on the same
 * hourly year, tests/regression/solar-hourly-benchmark.test.ts):
 *   sun position   NOAA / Meeus solar position algorithm (true zenith, no refraction)
 *   decomposition  Erbs et al. (1982), as pvlib.irradiance.erbs (kt ≤ 1, cos z ≥ 0.065, z ≤ 87°)
 *   extraterrestrial Spencer (1971), solar constant 1366.1 W/m²
 *   transposition  isotropic sky + ground reflection (albedo)
 *   cell temp      NOCT (Ross) model
 *   DC             PVWatts: P = Pdc0 · G/1000 · (1 + γ (Tc − 25)), then system losses
 *   AC             PVWatts inverter efficiency curve, clipped at the AC rating
 * Input weather: hourly GHI (W/m², hour-average) and air temperature (°C), with
 * timestamps at the middle of each hour (UTC). Source must be stated
 * (e.g. NASA POWER hourly ALLSKY_SFC_SW_DWN and T2M, or a TMY).
 */
import { pvwattsInverterDetail, type Losses } from './production';

export const HOURLY_ENGINE_VERSION = 'solar-hourly 1.0.0 (2026-11-14)';
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

/** Extraterrestrial normal irradiance, Spencer (1971), W/m². */
export function extraterrestrial(doy: number): number {
  const B = (2 * Math.PI * (doy - 1)) / 365;
  return 1366.1 * (1.00011 + 0.034221 * Math.cos(B) + 0.00128 * Math.sin(B) + 0.000719 * Math.cos(2 * B) + 0.000077 * Math.sin(2 * B));
}

/** Erbs decomposition, as pvlib.irradiance.erbs. */
export function erbs(ghi: number, zenith: number, dniExtra: number): { dni: number; dhi: number } {
  const cosZ = Math.max(Math.cos(zenith * D), 0.065);
  const kt = Math.max(0, Math.min(1, ghi / (dniExtra * cosZ)));
  const df = kt <= 0.22 ? 1 - 0.09 * kt : kt <= 0.8 ? 0.9511 - 0.1604 * kt + 4.388 * kt ** 2 - 16.638 * kt ** 3 + 12.336 * kt ** 4 : 0.165;
  let dhi = df * ghi;
  let dni = (ghi - dhi) / Math.cos(zenith * D);
  if (zenith > 87 || ghi < 0 || dni < 0 || !Number.isFinite(dni)) { dni = 0; dhi = ghi; }
  return { dni, dhi };
}

export interface HourlyInput {
  site: { latDeg: number; lonDeg: number; tiltDeg: number; azimuthDeg: number; albedo?: number };
  /** ISO time of the FIRST value, middle of the hour, UTC (e.g. 2026-01-01T00:30:00Z). */
  start: string;
  ghiWm2: number[]; tempC: number[]; weatherSource: string;
  array: { dcKw: number; gammaPmaxPct: number; noctC: number };
  inverter: { acKw: number; nominalEfficiency: number };
  losses: Losses; lossesSource: string;
}
export interface HourlyResult {
  annualKwh: number; monthlyKwh: number[]; clippedKwh: number; hours: number;
  specificYieldKwhPerKwp: number; performanceRatio: number; poaKwhM2: number;
  assumptions: string[]; engineVersion: string;
}

export function simulateHourly(i: HourlyInput): HourlyResult {
  const e: string[] = [];
  const n = i.ghiWm2?.length ?? 0;
  if (!(n >= 24 * 28) || i.tempC?.length !== n) e.push('An hourly series of at least four weeks with matching GHI and temperature is required');
  if (Number.isNaN(Date.parse(i.start))) e.push('Start time must be an ISO date-time (UTC, middle of the first hour)');
  if (!i.weatherSource || !i.lossesSource) e.push('Sources for the weather data and the losses are required');
  if (i.ghiWm2?.some((g) => !(g >= 0 && g < 1500))) e.push('GHI values must be 0–1500 W/m² (no gaps: drop or report missing hours, do not fill)');
  if (i.tempC?.some((t) => !(t > -50 && t < 60))) e.push('Temperature values must be −50–60 °C');
  if (!(i.array.gammaPmaxPct < 0 && i.array.gammaPmaxPct > -1)) e.push('γ_Pmax must be a negative %/°C');
  if (!(i.inverter.nominalEfficiency > 0.8 && i.inverter.nominalEfficiency <= 1)) e.push('Inverter nominal efficiency must be a fraction');
  if (e.length) throw new Error(e.join('; '));
  const sysLoss = 1 - Object.values(i.losses).reduce((p, l) => p * (1 - l), 1);
  const pdc0Inv = i.inverter.acKw / i.inverter.nominalEfficiency;
  const t0 = Date.parse(i.start);
  const tilt = i.site.tiltDeg * D, sAz = i.site.azimuthDeg * D, albedo = i.site.albedo ?? 0.2;
  const monthly = Array(12).fill(0);
  let clipped = 0, poaSum = 0;
  for (let h = 0; h < n; h++) {
    const t = t0 + h * 3600000;
    const ghi = i.ghiWm2[h];
    if (ghi <= 0) continue;
    const sp = solarPosition(t, i.site.latDeg, i.site.lonDeg);
    const { dni, dhi } = erbs(ghi, sp.zenith, extraterrestrial(sp.doy));
    const z = sp.zenith * D, aAz = sp.azimuth * D;
    const cosAoi = Math.cos(z) * Math.cos(tilt) + Math.sin(z) * Math.sin(tilt) * Math.cos(aAz - sAz);
    const poa = Math.max(dni * cosAoi, 0) + dhi * (1 + Math.cos(tilt)) / 2 + ghi * albedo * (1 - Math.cos(tilt)) / 2;
    poaSum += poa;
    const tc = i.tempC[h] + ((i.array.noctC - 20) / 800) * poa;
    const pdc = i.array.dcKw * (poa / 1000) * (1 + (i.array.gammaPmaxPct / 100) * (tc - 25)) * (1 - sysLoss);
    const inv = pvwattsInverterDetail(pdc, pdc0Inv, i.inverter.nominalEfficiency);
    monthly[new Date(t).getUTCMonth()] += inv.ac;
    clipped += inv.clipped;
  }
  const annual = monthly.reduce((a, b) => a + b, 0);
  const r1 = (x: number) => Math.round(x * 10) / 10;
  return {
    annualKwh: Math.round(annual), monthlyKwh: monthly.map(r1), clippedKwh: r1(clipped), hours: n,
    specificYieldKwhPerKwp: Math.round(annual / i.array.dcKw),
    performanceRatio: Math.round((annual / (i.array.dcKw * (poaSum / 1000))) * 1000) / 1000,
    poaKwhM2: Math.round(poaSum / 10) / 100,
    assumptions: [
      `Weather: ${i.weatherSource} (${n} hours). Losses: ${i.lossesSource}.`,
      'Hourly simulation: clear-sky peaks and inverter clipping are represented (unlike the monthly mean-day method).',
      'Cell temperature: NOCT model (open rack); roof-mounted arrays run hotter.',
      'Simulation only: agreement with pvlib does not show agreement with a real installation\'s output.',
    ],
    engineVersion: HOURLY_ENGINE_VERSION,
  };
}
