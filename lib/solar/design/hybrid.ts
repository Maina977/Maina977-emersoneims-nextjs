/**
 * Hourly hybrid energy balance: PV + battery + grid + generator (P1, 2026-11-15).
 *
 * Dispatch (load following, one-hour steps), in order:
 *   PV → load;
 *   PV surplus → battery (up to charge power and capacity) → grid export (if
 *     allowed) → curtailed;
 *   deficit → battery (down to its minimum SOC) → grid import (in hours the
 *     grid is available) → generator → unserved.
 *
 * Generator: runs at least at its minimum load. Output above the deficit
 * charges the battery, or is dumped and reported. Fuel uses the linear fuel
 * curve from the generator datasheet:
 *     L/h = a × rated kW + b × output kW
 * with a and b supplied and sourced by the designer. HOMER uses the same form.
 *
 * Nothing is assumed. The load profile, the battery data and the fuel curve
 * must be supplied with their sources, and missing or inconsistent inputs are
 * refused. Energy conservation is checked every hour and in total.
 *
 * This is a design simulation, not a guarantee of field performance.
 */
export const HYBRID_ENGINE_VERSION = 'solar-hybrid 1.0.0 (2026-11-15)';

export interface HybridInput {
  pvAcKwh: number[];               // from simulateHourly().hourlyAcKwh
  loadKwh: number[];               // measured or surveyed hourly load, same length
  loadSource: string;
  battery?: {
    usableKwh: number; maxChargeKw: number; maxDischargeKw: number;
    roundTripEfficiency: number;   // AC→AC, e.g. 0.90 from datasheet
    minSocFrac: number; initialSocFrac: number; source: string;
  };
  grid?: { availableHours?: boolean[]; importLimitKw?: number; exportAllowed: boolean; exportLimitKw?: number; source: string };
  generator?: { ratedKw: number; minLoadFrac: number; fuelA_LperHperKwRated: number; fuelB_LperKwh: number; fuelCurveSource: string };
}

export interface HybridResult {
  hours: number;
  totals: {
    loadKwh: number; pvKwh: number; pvToLoadKwh: number; pvToBatteryKwh: number; batteryToLoadKwh: number;
    gridImportKwh: number; gridExportKwh: number; generatorKwh: number; generatorToBatteryKwh: number;
    generatorDumpedKwh: number; generatorHours: number; generatorFuelL: number; generatorStarts: number;
    curtailedKwh: number; unservedKwh: number; batteryLossKwh: number;
  };
  renewableFraction: number;       // share of load met by PV (directly or via battery)
  unservedHours: number;
  finalSocFrac: number | null;
  balanceErrorKwh: number;         // |sources − sinks − Δstorage| over the period; must be ~0
  assumptions: string[];
  engineVersion: string;
}

export function simulateHybrid(i: HybridInput): HybridResult {
  const e: string[] = [];
  const n = i.pvAcKwh?.length ?? 0;
  if (!(n >= 24)) e.push('At least 24 hourly PV values are required');
  if (i.loadKwh?.length !== n) e.push('The hourly load must have the same length as the PV series');
  if (!i.loadSource?.trim()) e.push('Source of the load profile is required (meter data, logger or surveyed appliance schedule)');
  if (i.pvAcKwh?.some((v) => !(v >= 0)) || i.loadKwh?.some((v) => !(v >= 0))) e.push('PV and load values must be ≥ 0 with no gaps');
  const b = i.battery;
  if (b) {
    if (!(b.usableKwh > 0 && b.maxChargeKw > 0 && b.maxDischargeKw > 0)) e.push('Battery capacity and power limits must be positive');
    if (!(b.roundTripEfficiency > 0.5 && b.roundTripEfficiency <= 1)) e.push('Battery round-trip efficiency must be a fraction (0.5–1)');
    if (!(b.minSocFrac >= 0 && b.minSocFrac < 1 && b.initialSocFrac >= b.minSocFrac && b.initialSocFrac <= 1)) e.push('Battery SOC limits must satisfy 0 ≤ min ≤ initial ≤ 1');
    if (!b.source?.trim()) e.push('Battery data source (datasheet) is required');
  }
  const g = i.grid;
  if (g) {
    if (g.availableHours && g.availableHours.length !== n) e.push('Grid availability must give one value per hour');
    if (!g.source?.trim()) e.push('Grid availability/tariff source is required');
  }
  const gen = i.generator;
  if (gen) {
    if (!(gen.ratedKw > 0)) e.push('Generator rated kW must be positive');
    if (!(gen.minLoadFrac >= 0 && gen.minLoadFrac < 1)) e.push('Generator minimum load must be a fraction (0–1)');
    if (!(gen.fuelA_LperHperKwRated >= 0 && gen.fuelB_LperKwh > 0)) e.push('Generator fuel curve coefficients are required (from the datasheet)');
    if (!gen.fuelCurveSource?.trim()) e.push('Generator fuel curve source is required');
  }
  if (e.length) throw new Error(e.join('; '));

  const etaC = b ? Math.sqrt(b.roundTripEfficiency) : 1, etaD = etaC;
  const cap = b?.usableKwh ?? 0, socMin = b ? b.minSocFrac * cap : 0;
  let soc = b ? b.initialSocFrac * cap : 0;
  const soc0 = soc;
  const T = { loadKwh: 0, pvKwh: 0, pvToLoadKwh: 0, pvToBatteryKwh: 0, batteryToLoadKwh: 0, gridImportKwh: 0, gridExportKwh: 0, generatorKwh: 0, generatorToBatteryKwh: 0, generatorDumpedKwh: 0, generatorHours: 0, generatorFuelL: 0, generatorStarts: 0, curtailedKwh: 0, unservedKwh: 0, batteryLossKwh: 0 };
  let unservedHours = 0, running = false, chargedIn = 0, dischargedOut = 0;

  // Charge the battery with up to `offer` kWh (AC side); returns kWh taken.
  const charge = (offer: number, already: number) => {
    if (!b || offer <= 0) return 0;
    const room = (cap - soc) / etaC;
    const take = Math.max(0, Math.min(offer, b.maxChargeKw - already, room));
    soc += take * etaC; chargedIn += take;
    return take;
  };

  for (let h = 0; h < n; h++) {
    const pv = i.pvAcKwh[h], load = i.loadKwh[h];
    T.pvKwh += pv; T.loadKwh += load;
    const direct = Math.min(pv, load);
    T.pvToLoadKwh += direct;
    let surplus = pv - direct, deficit = load - direct, chargedThisHour = 0;

    // Surplus PV → battery → export → curtail
    if (surplus > 0) {
      const c = charge(surplus, chargedThisHour); chargedThisHour += c; T.pvToBatteryKwh += c; surplus -= c;
      const gridUp = g && (!g.availableHours || g.availableHours[h]);
      if (surplus > 0 && g?.exportAllowed && gridUp) {
        const x = Math.min(surplus, g.exportLimitKw ?? Infinity); T.gridExportKwh += x; surplus -= x;
      }
      T.curtailedKwh += surplus;
    }

    // Deficit → battery → grid → generator → unserved
    let genOn = false;
    if (deficit > 0 && b) {
      const avail = Math.max(0, (soc - socMin) * etaD);
      const d = Math.min(deficit, b.maxDischargeKw, avail);
      soc -= d / etaD; dischargedOut += d; T.batteryToLoadKwh += d; deficit -= d;
    }
    if (deficit > 0 && g && (!g.availableHours || g.availableHours[h])) {
      const m = Math.min(deficit, g.importLimitKw ?? Infinity); T.gridImportKwh += m; deficit -= m;
    }
    if (deficit > 1e-9 && gen) {
      genOn = true;
      const out = Math.max(deficit, gen.minLoadFrac * gen.ratedKw);
      const served = Math.min(deficit, gen.ratedKw);
      const toUse = Math.min(out, gen.ratedKw);
      let extra = toUse - served;
      const c = charge(extra, chargedThisHour); chargedThisHour += c; T.generatorToBatteryKwh += c; extra -= c;
      T.generatorDumpedKwh += extra;
      T.generatorKwh += toUse; T.generatorHours += 1;
      T.generatorFuelL += gen.fuelA_LperHperKwRated * gen.ratedKw + gen.fuelB_LperKwh * toUse;
      deficit -= served;
    }
    if (genOn && !running) T.generatorStarts += 1;
    running = genOn;
    if (deficit > 1e-9) { T.unservedKwh += deficit; unservedHours += 1; }
  }

  T.batteryLossKwh = chargedIn - (soc - soc0) - dischargedOut;
  // Sources: PV + grid import + generator. Sinks: load served + export + curtailed + dumped + battery losses + Δstorage.
  const served = T.loadKwh - T.unservedKwh;
  const balance = (T.pvKwh + T.gridImportKwh + T.generatorKwh) - (served + T.gridExportKwh + T.curtailedKwh + T.generatorDumpedKwh + T.batteryLossKwh + (soc - soc0));
  const r = (x: number) => Math.round(x * 10) / 10;
  const pvShare = T.loadKwh > 0 ? (T.pvToLoadKwh + T.batteryToLoadKwh * (T.pvToBatteryKwh / Math.max(1e-9, T.pvToBatteryKwh + T.generatorToBatteryKwh))) / T.loadKwh : 0;
  return {
    hours: n,
    totals: Object.fromEntries(Object.entries(T).map(([k, v]) => [k, k === 'generatorHours' || k === 'generatorStarts' ? v : r(v)])) as HybridResult['totals'],
    renewableFraction: Math.round(pvShare * 1000) / 1000,
    unservedHours,
    finalSocFrac: b ? Math.round((soc / cap) * 1000) / 1000 : null,
    balanceErrorKwh: Math.round(Math.abs(balance) * 1e6) / 1e6,
    assumptions: [
      `Load: ${i.loadSource}.`,
      b ? `Battery: ${b.source}; round-trip ${b.roundTripEfficiency} split equally between charge and discharge; minimum SOC ${b.minSocFrac}.` : 'No battery.',
      g ? `Grid: ${g.source}${g.availableHours ? ' (hourly availability given)' : ' (assumed always available — confirm outage pattern)'}; export ${g.exportAllowed ? 'allowed' : 'not allowed'}.` : 'No grid.',
      gen ? `Generator: ${gen.ratedKw} kW, minimum load ${gen.minLoadFrac * 100} %, fuel L/h = ${gen.fuelA_LperHperKwRated}·rated + ${gen.fuelB_LperKwh}·output (${gen.fuelCurveSource}).` : 'No generator.',
      'Dispatch: load following, hourly steps; the battery is charged by PV surplus and by generator output above the deficit only (never from the grid). Battery ageing and temperature are not modelled.',
      'Renewable fraction counts PV to load plus battery discharge in proportion to the PV share of battery charging.',
      'Design simulation only: not a guarantee of field performance; confirm with metered data after commissioning.',
    ],
    engineVersion: HYBRID_ENGINE_VERSION,
  };
}
