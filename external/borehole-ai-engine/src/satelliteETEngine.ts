// ═══════════════════════════════════════════════════════════════════════════
// SATELLITE ACTUAL-ET ENGINE — measured evapotranspiration for the water balance
// ═══════════════════════════════════════════════════════════════════════════
// Replaces MODELLED evapotranspiration (Budyko estimate) with MEASURED actual
// land evapotranspiration from NASA POWER / MERRA-2 (parameter EVLAND, mm/day),
// which assimilates satellite observations. ET is the largest term in a recharge
// water balance, so measuring it instead of assuming it makes recharge empirical.
//
// HONESTY:
//   • This is a ~50 km grid-scale REGIONAL value (MERRA-2), not a plot reading —
//     labelled 'measured_reanalysis', never presented as a point field survey.
//   • fetch returns null on any failure — recharge NEVER falls back to a faked ET.
//   • The reconciliation is mass-conserving by construction (P = AET+runoff+recharge)
//     and caps AET ≤ P at annual scale for recharge accounting.
// ═══════════════════════════════════════════════════════════════════════════

export interface SatelliteETResult {
  actualET_mm_yr: number;
  actualET_mm_day: number;
  monthly_mm: { month: string; et_mm: number }[];
  source: string;
  provenance: 'measured_reanalysis';
  resolution: string;
  period: string;
  note: string;
}

export interface ReconciledBalance {
  precipitation_mm: number;
  actualET_mm: number;
  runoff_mm: number;
  recharge_mm: number;
  etFraction: number;      // AET / P
  massConserved: boolean;
  regime: 'humid-recharge' | 'moderate' | 'arid-no-recharge';
}

const POWER_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Pure parser for a NASA POWER climatology response carrying EVLAND (mm/day).
 * Returns null if the payload lacks enough valid months (never fabricates).
 */
export function parseSatelliteET(json: any): SatelliteETResult | null {
  const ev = json?.properties?.parameter?.EVLAND;
  if (!ev || typeof ev !== 'object') return null;
  const monthly_mm: { month: string; et_mm: number }[] = [];
  let annual = 0, valid = 0;
  for (let i = 0; i < 12; i++) {
    const v = ev[MONTHS[i]];
    if (typeof v === 'number' && v > -900) {   // POWER fill value is -999
      const mm = v * DAYS[i];
      monthly_mm.push({ month: MONTHS[i], et_mm: Math.round(mm * 10) / 10 });
      annual += mm;
      valid++;
    }
  }
  if (valid < 6) return null;
  return {
    actualET_mm_yr: Math.round(annual),
    actualET_mm_day: Math.round((annual / 365) * 100) / 100,
    monthly_mm,
    source: 'NASA POWER / MERRA-2 (EVLAND, satellite-assimilated reanalysis)',
    provenance: 'measured_reanalysis',
    resolution: '~0.5°×0.625° MERRA-2 grid (~50 km)',
    period: json?.header?.range ?? '2001-2020 climatology',
    note: 'Actual land evapotranspiration from NASA POWER (MERRA-2, which assimilates satellite observations). Grid-scale (~50 km) regional value — not a plot measurement.',
  };
}

/**
 * Fetch measured actual ET for a point. Returns null on any failure — recharge
 * must never fall back to a fabricated ET value.
 */
export async function fetchSatelliteActualET(
  lat: number,
  lon: number,
  fetchImpl: typeof fetch = fetch,
): Promise<SatelliteETResult | null> {
  try {
    const url = `${POWER_URL}?parameters=EVLAND&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;
    const res = await fetchImpl(url);
    if (!res.ok) return null;
    const json = await res.json();
    return parseSatelliteET(json);
  } catch {
    return null;
  }
}

/**
 * Mass-conserving water balance using MEASURED actual ET.
 * P = AET + runoff + recharge, with AET capped at P (supply limit for recharge
 * accounting) and recharge ≥ 0.
 */
export function reconcileRechargeWithMeasuredET(
  precip_mm: number,
  measuredAET_mm: number,
  runoff_mm: number,
): ReconciledBalance {
  const P = Math.max(0, precip_mm);
  const aet = Math.max(0, Math.min(measuredAET_mm, P));
  const ro = Math.max(0, Math.min(runoff_mm, P - aet));
  const recharge = Math.max(0, P - aet - ro);
  const etFraction = P > 0 ? aet / P : 0;
  const regime: ReconciledBalance['regime'] =
    recharge <= 1 ? 'arid-no-recharge' : etFraction < 0.7 ? 'humid-recharge' : 'moderate';
  return {
    precipitation_mm: Math.round(P),
    actualET_mm: Math.round(aet),
    runoff_mm: Math.round(ro),
    recharge_mm: Math.round(recharge),
    etFraction: Math.round(etFraction * 1000) / 1000,
    massConserved: Math.abs(P - (aet + ro + recharge)) < 1e-6,
    regime,
  };
}
