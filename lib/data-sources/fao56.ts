/**
 * FAO-56 Penman-Monteith reference evapotranspiration, daily (Allen et al.
 * 1998, FAO Irrigation and Drainage Paper 56, eq. 6 with eqs. 7-13, 21-39).
 * Deterministic; the method is public. Inputs are measured or reanalysis
 * daily values (e.g. NASA POWER: T2M_MAX, T2M_MIN, T2MDEW, WS2M,
 * ALLSKY_SFC_SW_DWN in MJ/m²/day with community=AG). Soil heat flux G = 0 for
 * daily steps (FAO-56 eq. 42).
 */
export interface Fao56Input {
  tMaxC: number; tMinC: number;
  /** Actual vapour pressure (kPa); give it directly or as dew point. */
  eaKPa?: number; tDewC?: number;
  /** Wind speed at 2 m (m/s). */
  u2: number;
  /** Incoming shortwave radiation (MJ/m²/day). */
  rsMJ: number;
  elevationM: number; latDeg: number; dayOfYear: number;
}

const satVp = (t: number) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3)); // kPa, eq. 11

export function et0Fao56(i: Fao56Input): { et0: number; parts: Record<string, number> } {
  const errs: string[] = [];
  if (!(i.tMaxC >= i.tMinC)) errs.push('Tmax must be ≥ Tmin');
  if (!(i.u2 >= 0 && i.u2 < 30)) errs.push('u2 must be 0–30 m/s');
  if (!(i.rsMJ >= 0 && i.rsMJ < 45)) errs.push('Rs must be 0–45 MJ/m²/day');
  if (!(Math.abs(i.latDeg) <= 66)) errs.push('latitude must be within ±66°');
  if (!(i.dayOfYear >= 1 && i.dayOfYear <= 366)) errs.push('day of year 1–366');
  if (i.eaKPa === undefined && i.tDewC === undefined) errs.push('actual vapour pressure or dew point required');
  if (errs.length) throw new Error(errs.join('; '));
  const tMean = (i.tMaxC + i.tMinC) / 2;
  const P = 101.3 * Math.pow((293 - 0.0065 * i.elevationM) / 293, 5.26); // eq. 7
  const gamma = 0.000665 * P; // eq. 8
  const delta = (4098 * satVp(tMean)) / Math.pow(tMean + 237.3, 2); // eq. 13
  const es = (satVp(i.tMaxC) + satVp(i.tMinC)) / 2; // eq. 12
  const ea = i.eaKPa ?? satVp(i.tDewC!); // eq. 14
  const phi = (i.latDeg * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * i.dayOfYear) / 365); // eq. 23
  const dec = 0.409 * Math.sin((2 * Math.PI * i.dayOfYear) / 365 - 1.39); // eq. 24
  const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec)))); // eq. 25
  const Ra = ((24 * 60) / Math.PI) * 0.082 * dr * (ws * Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.sin(ws)); // eq. 21
  const Rso = (0.75 + 2e-5 * i.elevationM) * Ra; // eq. 37
  const Rns = (1 - 0.23) * i.rsMJ; // eq. 38
  const sigma = 4.903e-9;
  const ratio = Math.min(1, i.rsMJ / Rso); // Rs/Rso ≤ 1
  const Rnl = sigma * ((Math.pow(i.tMaxC + 273.16, 4) + Math.pow(i.tMinC + 273.16, 4)) / 2) * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * ratio - 0.35); // eq. 39
  const Rn = Rns - Rnl; // eq. 40
  const et0 = (0.408 * delta * Rn + gamma * (900 / (tMean + 273)) * i.u2 * (es - ea)) / (delta + gamma * (1 + 0.34 * i.u2)); // eq. 6
  return { et0: Math.max(0, et0), parts: { P, gamma, delta, es, ea, Ra, Rso, Rns, Rnl, Rn } };
}
