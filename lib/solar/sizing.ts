/**
 * Solar Genius Pro — sizing core (2026-10-18 tool audit rewrite).
 *
 * Pure, dependency-free and unit-tested (tests/regression/solar-sizing.test.ts).
 * Replaces the old /api/solar/calculate maths, which:
 *   - returned yearly energy in Wh that the screen labelled MWh (1000x too high),
 *   - sized every battery for 1.5 days of the WHOLE load with no DoD/efficiency,
 *     so every payback came out near 14.8 years,
 *   - used one fixed tariff and a hard-coded sun-hours table while the page
 *     claimed "real-time NASA POWER and EPRA tariff".
 *
 * Every assumption is returned in `assumptions` and shown to the customer.
 * Hand-checked against the 2026-10-18 audit cases:
 *   Nairobi home 450 kWh/mo hybrid  -> ~3.9 kWp, ~8.8 kWh battery, ~KES 0.9M, ~7-8 yr
 *   Mombasa hotel 4,500 kWh/mo grid -> ~34 kWp, no battery, ~KES 2.9M, ~3 yr
 *   Machakos farm 600 kWh/mo off-grid -> ~6 kWp, ~23 kWh battery, ~KES 37k/mo diesel saved
 */

export type SystemType = 'grid-tied' | 'hybrid' | 'off-grid';
export type RoofType = 'pitched' | 'flat' | 'ground';

export interface SizingInput {
  monthlyKwh: number;
  /** Yearly-average peak sun hours (kWh/m²/day). */
  pshAnnual: number;
  /** Lowest monthly-average sun hours; used to size off-grid arrays. Defaults to pshAnnual. */
  pshWorstMonth?: number;
  systemType: SystemType;
  roofType?: RoofType;
  /** KES per kWh actually paid (total bill ÷ kWh). */
  tariffKesPerKwh?: number;
  /** Grid-tied: share of consumption that happens while the sun is up (%). */
  daytimeUsePct?: number;
  /** Hybrid: share of daily consumption used after dark, to be stored (%). */
  nightUsePct?: number;
  /** Off-grid: days the battery must carry the load with no sun. */
  autonomyDays?: number;
  /** Largest simultaneous load incl. motor starting, kW. Estimated if absent. */
  peakLoadKw?: number;
  /** Off-grid: diesel price KES/litre for the generator being replaced. */
  dieselKesPerLitre?: number;
}

export interface SizingResult {
  systemType: SystemType;
  pvKwp: number;
  panels: number;
  panelWatt: number;
  inverterKw: number;
  inverterBasis: 'peak-load' | 'estimated-peak' | 'array';
  batteryKwh: number;
  batteryUsableKwh: number;
  annualEnergyKwh: number;
  energyUsedKwh: number;
  annualSavingKes: number;
  monthlySavingKes: number;
  savingBasis: 'grid-tariff' | 'diesel';
  dieselLitresAvoidedPerYear?: number;
  co2AvoidedKgPerYear?: number;
  cost: { lowKes: number; midKes: number; highKes: number };
  paybackYears: number | null;
  assumptions: string[];
}

export const PANEL_WATT = 550;
export const PERFORMANCE_RATIO = 0.78; // wiring, inverter, temperature and soiling losses
export const BATTERY_DOD = 0.9; // LiFePO4 usable depth of discharge
export const BATTERY_EFFICIENCY = 0.95; // round trip
export const DIESEL_L_PER_KWH = 0.35; // small genset at part load
export const DIESEL_CO2_KG_PER_L = 2.68;
const STANDARD_INVERTERS_KW = [1, 1.5, 2, 3, 3.6, 5, 6, 8, 10, 12, 15, 20, 25, 30, 36, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500];

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const nextStandardInverter = (kw: number) => STANDARD_INVERTERS_KW.find((s) => s >= kw) ?? Math.ceil(kw / 50) * 50;

/** Typical Kenyan installed prices (KES), mid-2026, stated as a ±15% range. */
function costKes(pvKwp: number, inverterKw: number, batteryKwh: number, type: SystemType): number {
  const pvRate = pvKwp <= 10 ? 70_000 : pvKwp <= 50 ? 60_000 : 52_000; // panels + mounting + DC
  const invRate = type === 'grid-tied' ? (inverterKw <= 10 ? 20_000 : 15_000) : inverterKw <= 10 ? 35_000 : 28_000;
  const batRate = 48_000; // LiFePO4 per kWh
  const equipment = pvKwp * pvRate + inverterKw * invRate + batteryKwh * batRate;
  return equipment * 1.12; // installation, cabling and protection
}

/** Same price basis as sizeSolar, for tools that size the system themselves (e.g. the design studio). */
export function estimateInstalledCost(pvKwp: number, inverterKw: number, batteryKwh: number, type: SystemType) {
  const mid = costKes(pvKwp, inverterKw, batteryKwh, type);
  return {
    lowKes: Math.round((mid * 0.85) / 1000) * 1000,
    midKes: Math.round(mid / 1000) * 1000,
    highKes: Math.round((mid * 1.15) / 1000) * 1000,
  };
}

export function sizeSolar(input: SizingInput): SizingResult {
  const monthlyKwh = Number(input.monthlyKwh);
  if (!Number.isFinite(monthlyKwh) || monthlyKwh <= 0) throw new Error('monthlyKwh must be a positive number');
  const psh = Number(input.pshAnnual);
  if (!Number.isFinite(psh) || psh <= 0 || psh > 9) throw new Error('pshAnnual must be between 0 and 9 kWh/m²/day');
  const pshWorst = input.pshWorstMonth && input.pshWorstMonth > 0 ? Math.min(input.pshWorstMonth, psh) : psh;

  const type = input.systemType;
  const roof = input.roofType ?? 'pitched';
  const roofFactor = roof === 'flat' ? 0.95 : roof === 'ground' ? 1.03 : 1.0;
  const tariff = clamp(input.tariffKesPerKwh ?? 25, 1, 200);
  const dailyKwh = monthlyKwh / 30;
  const annualConsumption = dailyKwh * 365;
  const assumptions: string[] = [];

  // ── Array ───────────────────────────────────────────────────────────────
  // Off-grid has no grid to fall back on, so it is sized on the cloudiest
  // month and carries the battery's losses on the share it stores.
  const sizingPsh = type === 'off-grid' ? pshWorst : psh;
  const lossFactor = type === 'off-grid' ? 0.9 : 1;
  const rawKwp = dailyKwh / (sizingPsh * PERFORMANCE_RATIO * roofFactor * lossFactor);
  const panels = Math.max(1, Math.ceil((rawKwp * 1000) / PANEL_WATT));
  const pvKwp = round1((panels * PANEL_WATT) / 1000);
  assumptions.push(`${PANEL_WATT} W panels; ${Math.round(PERFORMANCE_RATIO * 100)}% performance ratio (wiring, inverter, heat and dust losses).`);
  if (type === 'off-grid') assumptions.push(`Off-grid array sized on the cloudiest month (${pshWorst.toFixed(2)} sun-hours), not the yearly average.`);

  // ── Battery ─────────────────────────────────────────────────────────────
  let batteryUsableKwh = 0;
  if (type === 'hybrid') {
    const night = clamp(input.nightUsePct ?? 50, 0, 100) / 100;
    batteryUsableKwh = dailyKwh * night;
    assumptions.push(`Battery stores the ${Math.round(night * 100)}% of daily use that happens after dark.`);
  } else if (type === 'off-grid') {
    const days = clamp(input.autonomyDays ?? 1, 0.5, 5);
    batteryUsableKwh = dailyKwh * days;
    assumptions.push(`Battery carries the full load for ${days} day${days === 1 ? '' : 's'} without sun.`);
  }
  const batteryKwh = batteryUsableKwh > 0 ? round1(batteryUsableKwh / (BATTERY_DOD * BATTERY_EFFICIENCY)) : 0;
  if (batteryKwh > 0) assumptions.push(`LiFePO4 battery: ${Math.round(BATTERY_DOD * 100)}% usable depth, ${Math.round(BATTERY_EFFICIENCY * 100)}% round-trip efficiency.`);

  // ── Inverter ────────────────────────────────────────────────────────────
  let inverterKw: number;
  let inverterBasis: SizingResult['inverterBasis'];
  if (type === 'grid-tied') {
    inverterKw = nextStandardInverter(pvKwp * 0.95);
    inverterBasis = 'array';
  } else {
    const avgLoadKw = dailyKwh / 24;
    const peak = input.peakLoadKw && input.peakLoadKw > 0 ? input.peakLoadKw : avgLoadKw * 3;
    inverterBasis = input.peakLoadKw && input.peakLoadKw > 0 ? 'peak-load' : 'estimated-peak';
    inverterKw = nextStandardInverter(Math.max(peak * 1.25, pvKwp * 0.8));
    if (inverterBasis === 'estimated-peak') assumptions.push('Inverter sized on an estimated peak of 3x your average load. Enter your largest load (pumps, welders, AC) for a firmer figure.');
  }

  // ── Energy and saving ───────────────────────────────────────────────────
  const annualEnergyKwh = Math.round(pvKwp * psh * 365 * PERFORMANCE_RATIO * roofFactor);
  let energyUsedKwh: number;
  let annualSavingKes: number;
  let dieselLitres: number | undefined;
  let co2: number | undefined;
  let savingBasis: SizingResult['savingBasis'] = 'grid-tariff';
  if (type === 'grid-tied') {
    const day = clamp(input.daytimeUsePct ?? 50, 0, 100) / 100;
    energyUsedKwh = Math.min(annualEnergyKwh, annualConsumption * day);
    annualSavingKes = energyUsedKwh * tariff;
    assumptions.push(`Without a battery you only save on power used while the sun is up: ${Math.round(day * 100)}% of your use. Surplus is not paid for (no net metering assumed).`);
  } else if (type === 'hybrid') {
    energyUsedKwh = Math.min(annualEnergyKwh, annualConsumption) * 0.9;
    annualSavingKes = energyUsedKwh * tariff;
    assumptions.push('About 90% of the solar energy is used on site; the rest is lost in storage or curtailed.');
  } else {
    savingBasis = 'diesel';
    energyUsedKwh = Math.min(annualEnergyKwh, annualConsumption);
    const dieselPrice = clamp(input.dieselKesPerLitre ?? 175, 50, 500);
    dieselLitres = Math.round(energyUsedKwh * DIESEL_L_PER_KWH);
    annualSavingKes = dieselLitres * dieselPrice;
    co2 = Math.round(dieselLitres * DIESEL_CO2_KG_PER_L);
    assumptions.push(`Saving compared with a diesel generator at ${DIESEL_L_PER_KWH} L/kWh and KES ${dieselPrice}/L; CO₂ at ${DIESEL_CO2_KG_PER_L} kg per litre burned.`);
  }
  if (type !== 'off-grid') assumptions.push(`Your tariff: KES ${tariff}/kWh (your total bill divided by the kWh on it).`);

  // ── Cost and payback ────────────────────────────────────────────────────
  const mid = costKes(pvKwp, inverterKw, batteryKwh, type);
  const cost = { lowKes: Math.round((mid * 0.85) / 1000) * 1000, midKes: Math.round(mid / 1000) * 1000, highKes: Math.round((mid * 1.15) / 1000) * 1000 };
  const paybackYears = annualSavingKes > 0 ? round1(cost.midKes / annualSavingKes) : null;
  assumptions.push('Prices are typical Kenyan installed ranges (mid-2026), not a quotation. A site survey fixes the real price.');
  if (batteryKwh > 0) assumptions.push('LiFePO4 batteries usually need replacing after 10–12 years; that cost is not in the payback.');

  return {
    systemType: type,
    pvKwp,
    panels,
    panelWatt: PANEL_WATT,
    inverterKw,
    inverterBasis,
    batteryKwh,
    batteryUsableKwh: round1(batteryUsableKwh),
    annualEnergyKwh,
    energyUsedKwh: Math.round(energyUsedKwh),
    annualSavingKes: Math.round(annualSavingKes),
    monthlySavingKes: Math.round(annualSavingKes / 12),
    savingBasis,
    ...(dieselLitres !== undefined ? { dieselLitresAvoidedPerYear: dieselLitres } : {}),
    ...(co2 !== undefined ? { co2AvoidedKgPerYear: co2 } : {}),
    cost,
    paybackYears,
    assumptions,
  };
}

/** Kenyan towns for the location picker (WGS84). */
export const KENYA_TOWNS: { key: string; name: string; lat: number; lon: number }[] = [
  { key: 'nairobi', name: 'Nairobi', lat: -1.286, lon: 36.817 },
  { key: 'mombasa', name: 'Mombasa', lat: -4.043, lon: 39.668 },
  { key: 'kisumu', name: 'Kisumu', lat: -0.092, lon: 34.768 },
  { key: 'nakuru', name: 'Nakuru', lat: -0.303, lon: 36.08 },
  { key: 'eldoret', name: 'Eldoret', lat: 0.514, lon: 35.27 },
  { key: 'thika', name: 'Thika', lat: -1.033, lon: 37.069 },
  { key: 'machakos', name: 'Machakos', lat: -1.517, lon: 37.263 },
  { key: 'nyeri', name: 'Nyeri', lat: -0.42, lon: 36.947 },
  { key: 'meru', name: 'Meru', lat: 0.047, lon: 37.649 },
  { key: 'embu', name: 'Embu', lat: -0.531, lon: 37.45 },
  { key: 'kitui', name: 'Kitui', lat: -1.367, lon: 38.011 },
  { key: 'naivasha', name: 'Naivasha', lat: -0.717, lon: 36.433 },
  { key: 'nanyuki', name: 'Nanyuki', lat: 0.017, lon: 37.073 },
  { key: 'kericho', name: 'Kericho', lat: -0.367, lon: 35.283 },
  { key: 'kakamega', name: 'Kakamega', lat: 0.283, lon: 34.752 },
  { key: 'narok', name: 'Narok', lat: -1.083, lon: 35.867 },
  { key: 'kajiado', name: 'Kajiado', lat: -1.852, lon: 36.776 },
  { key: 'malindi', name: 'Malindi', lat: -3.217, lon: 40.117 },
  { key: 'garissa', name: 'Garissa', lat: -0.453, lon: 39.646 },
  { key: 'lodwar', name: 'Lodwar', lat: 3.119, lon: 35.597 },
];
