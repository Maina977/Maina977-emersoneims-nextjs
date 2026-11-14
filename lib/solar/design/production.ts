/**
 * PV energy production for a validated design (P1-B, 2026-11-14).
 *
 * Method (NREL PVWatts v5 structure, Dobos 2014, evaluated on each month's
 * mean day in 10-minute steps):
 *   POA      from meanDayPoaSteps (Duffie & Beckman; benchmarked against pvlib)
 *   T_cell   = T_amb + (NOCT − 20)/800 × POA            (pvlib.temperature.ross)
 *   P_dc     = P_dc0 × POA/1000 × (1 + γ_Pmax (T_cell − 25))   (pvlib pvwatts_dc)
 *   losses   applied to DC as 1 − Π(1 − loss_i)          (PVWatts system losses)
 *   P_ac     PVWatts inverter efficiency curve, clipped at AC rating (pvlib.inverter.pvwatts)
 * Every loss is an input with its source; nothing is hidden in a single "PR".
 * Monthly irradiation and ambient temperature are site inputs (e.g. NASA POWER
 * ALLSKY_SFC_SW_DWN and T2M) recorded with their source.
 */
import { meanDayPoaSteps, STEP_HOURS } from '../poa';

export const PRODUCTION_ENGINE_VERSION = 'solar-production 1.0.0 (2026-11-14)';
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface Losses {
  /** Fractions 0–1. Defaults are NOT applied silently: pass PVWATTS_DEFAULT_LOSSES explicitly if wanted. */
  soiling: number; shading: number; snow: number; mismatch: number; wiring: number;
  connections: number; lightInducedDegradation: number; nameplate: number; age: number; availability: number;
}
/** NREL PVWatts v5 default system losses (14.08 % total), for use only when chosen and labelled. */
export const PVWATTS_DEFAULT_LOSSES: Losses = { soiling: 0.02, shading: 0.03, snow: 0, mismatch: 0.02, wiring: 0.02, connections: 0.005, lightInducedDegradation: 0.015, nameplate: 0.01, age: 0, availability: 0.03 };

export interface ProductionInput {
  site: { latDeg: number; tiltDeg: number; azimuthDeg: number; albedo?: number };
  /** 12 values, kWh/m²/day, with source. */
  ghiMonthly: number[]; ghiSource: string;
  /** 12 values, °C, daytime mean ambient, with source. */
  ambientMonthlyC: number[]; ambientSource: string;
  array: { dcKw: number; gammaPmaxPct: number; noctC: number };
  inverter: { acKw: number; nominalEfficiency: number };
  losses: Losses; lossesSource: string;
}
export interface ProductionResult {
  monthlyKwh: number[]; annualKwh: number;
  specificYieldKwhPerKwp: number; performanceRatio: number;
  clippedKwh: number; temperatureLossPct: number; systemLossPct: number;
  assumptions: string[]; engineVersion: string;
}

/** PVWatts v5 inverter model (as pvlib.inverter.pvwatts). pdc, pdc0 in the same unit. */
export function pvwattsInverter(pdc: number, pdc0: number, etaNom: number, etaRef = 0.9637): number {
  return pvwattsInverterDetail(pdc, pdc0, etaNom, etaRef).ac;
}
/** AC output and the AC that clipping removed. */
export function pvwattsInverterDetail(pdc: number, pdc0: number, etaNom: number, etaRef = 0.9637): { ac: number; clipped: number } {
  if (pdc <= 0) return { ac: 0, clipped: 0 };
  const zeta = pdc / pdc0;
  const eta = (etaNom / etaRef) * (-0.0162 * zeta - 0.0059 / zeta + 0.9858);
  const raw = Math.max(0, eta * pdc);
  const ac = Math.min(raw, pdc0 * etaNom);
  return { ac, clipped: raw - ac };
}

export function simulateProduction(i: ProductionInput): ProductionResult {
  const e: string[] = [];
  if (i.ghiMonthly?.length !== 12 || i.ghiMonthly.some((v) => !(v > 0 && v < 12))) e.push('12 monthly irradiation values (kWh/m²/day) are required');
  if (i.ambientMonthlyC?.length !== 12 || i.ambientMonthlyC.some((v) => !(v > -40 && v < 55))) e.push('12 monthly ambient temperatures (°C) are required');
  if (!i.ghiSource || !i.ambientSource || !i.lossesSource) e.push('Sources for irradiation, temperature and losses are required');
  if (!(i.array.dcKw > 0) || !(i.inverter.acKw > 0)) e.push('DC and AC ratings must be positive');
  if (!(i.array.gammaPmaxPct < 0 && i.array.gammaPmaxPct > -1)) e.push('γ_Pmax must be a negative %/°C from the module datasheet');
  if (!(i.inverter.nominalEfficiency > 0.8 && i.inverter.nominalEfficiency <= 1)) e.push('Inverter nominal efficiency must be a fraction (e.g. 0.96)');
  for (const [k, v] of Object.entries(i.losses ?? {})) if (!(v >= 0 && v < 0.5)) e.push(`Loss "${k}" must be a fraction 0–0.5`);
  if (e.length) throw new Error(e.join('; '));
  const sysLoss = 1 - Object.values(i.losses).reduce((p, l) => p * (1 - l), 1);
  // pvlib pvwatts: inverter pdc0 = AC rating / nominal efficiency.
  const pdc0Inv = i.inverter.acKw / i.inverter.nominalEfficiency;
  let clipped = 0, dcAt25 = 0, dcActual = 0, poaTotal = 0;
  const monthlyKwh = i.ghiMonthly.map((H, m) => {
    let dayAc = 0;
    for (const s of meanDayPoaSteps(i.site.latDeg, i.site.tiltDeg, i.site.azimuthDeg, H, m, i.site.albedo ?? 0.2)) {
      const tCell = i.ambientMonthlyC[m] + ((i.array.noctC - 20) / 800) * s.poaWm2;
      const pdcStc = (i.array.dcKw * s.poaWm2) / 1000;
      const pdc = pdcStc * (1 + (i.array.gammaPmaxPct / 100) * (tCell - 25)) * (1 - sysLoss);
      const inv = pvwattsInverterDetail(pdc, pdc0Inv, i.inverter.nominalEfficiency);
      clipped += inv.clipped * STEP_HOURS * DAYS[m];
      dayAc += inv.ac * STEP_HOURS;
      dcAt25 += pdcStc * STEP_HOURS * DAYS[m];
      dcActual += pdcStc * (1 + (i.array.gammaPmaxPct / 100) * (tCell - 25)) * STEP_HOURS * DAYS[m];
      poaTotal += (s.poaWm2 / 1000) * STEP_HOURS * DAYS[m];
    }
    return dayAc * DAYS[m];
  });
  const annual = monthlyKwh.reduce((a, b) => a + b, 0);
  const r1 = (x: number) => Math.round(x * 10) / 10;
  return {
    monthlyKwh: monthlyKwh.map(r1), annualKwh: Math.round(annual),
    specificYieldKwhPerKwp: Math.round(annual / i.array.dcKw),
    performanceRatio: Math.round((annual / (i.array.dcKw * poaTotal)) * 1000) / 1000,
    clippedKwh: Math.round(clipped), temperatureLossPct: Math.round((1 - dcActual / dcAt25) * 1000) / 10,
    systemLossPct: Math.round(sysLoss * 1000) / 10,
    assumptions: [
      `Irradiation: ${i.ghiSource}. Ambient temperature: ${i.ambientSource}. Losses: ${i.lossesSource}.`,
      'Mean-day method: each month represented by its mean day (10-minute steps); real years vary around this.',
      'Cell temperature from the NOCT model (open-rack, wind ~1 m/s); roof-mounted arrays run hotter.',
      'Inverter: PVWatts v5 efficiency curve with clipping at the AC rating. The mean-day method averages out clear-sky peaks, so clipping at DC/AC ratios above about 1.2 is UNDERESTIMATED; use hourly (TMY) data for high-ratio designs.',
    ],
    engineVersion: PRODUCTION_ENGINE_VERSION,
  };
}
