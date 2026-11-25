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
import { solarPosition } from './sunPosition';
import { horizonErrors, hourBlockedFraction, ShadingAccumulator, type HorizonProfile, type ShadingSummary } from './shading';

export const HOURLY_ENGINE_VERSION = 'solar-hourly 1.0.0 (2026-11-14)';
const D = Math.PI / 180;

/** Solar zenith and azimuth: moved to sunPosition.ts (unchanged), re-exported here. */
export { solarPosition };

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
  /** Optional horizon / obstruction profile (shading.ts). Only the beam is blocked; see that file. */
  horizon?: HorizonProfile;
}
export interface HourlyResult {
  annualKwh: number; monthlyKwh: number[]; clippedKwh: number; hours: number;
  /** AC energy per hour (kWh), same length and order as the input series (for hybrid dispatch). */
  hourlyAcKwh: number[];
  specificYieldKwhPerKwp: number; performanceRatio: number; poaKwhM2: number;
  assumptions: string[]; engineVersion: string;
  /** Present only when a horizon was given: annualKwh and monthlyKwh are then the SHADED results. */
  shading?: ShadingSummary;
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
  if (i.horizon !== undefined) e.push(...horizonErrors(i.horizon));
  if (e.length) throw new Error(e.join('; '));
  const sysLoss = 1 - Object.values(i.losses).reduce((p, l) => p * (1 - l), 1);
  const pdc0Inv = i.inverter.acKw / i.inverter.nominalEfficiency;
  const t0 = Date.parse(i.start);
  const tilt = i.site.tiltDeg * D, sAz = i.site.azimuthDeg * D, albedo = i.site.albedo ?? 0.2;
  const horizon = i.horizon;
  const shade = horizon ? new ShadingAccumulator() : null;
  const monthly = Array(12).fill(0);
  const hourlyAc: number[] = new Array(n).fill(0);
  let clipped = 0, poaSum = 0;
  const acOf = (poa: number, tAmb: number) => {
    const tc = tAmb + ((i.array.noctC - 20) / 800) * poa;
    const pdc = i.array.dcKw * (poa / 1000) * (1 + (i.array.gammaPmaxPct / 100) * (tc - 25)) * (1 - sysLoss);
    return pvwattsInverterDetail(pdc, pdc0Inv, i.inverter.nominalEfficiency);
  };
  for (let h = 0; h < n; h++) {
    const t = t0 + h * 3600000;
    const ghi = i.ghiWm2[h];
    if (ghi <= 0) continue;
    const sp = solarPosition(t, i.site.latDeg, i.site.lonDeg);
    const { dni, dhi } = erbs(ghi, sp.zenith, extraterrestrial(sp.doy));
    const z = sp.zenith * D, aAz = sp.azimuth * D;
    const cosAoi = Math.cos(z) * Math.cos(tilt) + Math.sin(z) * Math.sin(tilt) * Math.cos(aAz - sAz);
    const beam = Math.max(dni * cosAoi, 0), skyDiffuse = dhi * (1 + Math.cos(tilt)) / 2;
    const poa = beam + skyDiffuse + ghi * albedo * (1 - Math.cos(tilt)) / 2;
    poaSum += poa;
    const month = new Date(t).getUTCMonth();
    // Horizon: only the beam is blocked (shading.ts); poaSum stays the unshaded plane-of-array irradiation.
    const f = horizon && beam > 0 ? hourBlockedFraction(horizon, t, i.site.latDeg, i.site.lonDeg) : 0;
    const inv = acOf(poa - beam * f, i.tempC[h]);
    if (shade) shade.add(month, { beamPoaWm2: beam, blockedFraction: f, skyDiffusePoaWm2: skyDiffuse, poaUnshadedWm2: poa, acUnshadedKwh: f > 0 ? acOf(poa, i.tempC[h]).ac : inv.ac, acShadedKwh: inv.ac });
    monthly[month] += inv.ac;
    hourlyAc[h] = inv.ac;
    clipped += inv.clipped;
  }
  const annual = monthly.reduce((a, b) => a + b, 0);
  const r1 = (x: number) => Math.round(x * 10) / 10;
  const shading = shade && horizon ? shade.summary(horizon) : null;
  return {
    annualKwh: Math.round(annual), monthlyKwh: monthly.map(r1), clippedKwh: r1(clipped), hours: n,
    hourlyAcKwh: hourlyAc,
    specificYieldKwhPerKwp: Math.round(annual / i.array.dcKw),
    performanceRatio: Math.round((annual / (i.array.dcKw * (poaSum / 1000))) * 1000) / 1000,
    poaKwhM2: Math.round(poaSum / 10) / 100,
    assumptions: [
      `Weather: ${i.weatherSource} (${n} hours). Losses: ${i.lossesSource}.`,
      'Hourly simulation: clear-sky peaks and inverter clipping are represented (unlike the monthly mean-day method).',
      'Cell temperature: NOCT model (open rack); roof-mounted arrays run hotter.',
      'Simulation only: agreement with pvlib does not show agreement with a real installation\'s output.',
      ...(shading ? [
        `Horizon shading (${shading.engineVersion}): computed from the horizon profile (source: ${shading.horizon.source}); annual AC energy loss ${shading.annual.energyLossPct ?? 0} % (beam loss ${shading.annual.beamLossPct ?? 0} %). Energy and specific yield are after this loss; the plane-of-array irradiation and the performance ratio's reference are unshaded, so the PR includes it.`,
        shading.diffuseTreatment,
        ...(i.losses.shading > 0 ? [`The losses also contain a general shading allowance of ${Math.round(i.losses.shading * 1000) / 10} %: check that it does not count the same obstructions twice.`] : []),
      ] : []),
    ],
    engineVersion: HOURLY_ENGINE_VERSION,
    ...(shading ? { shading } : {}),
  };
}
