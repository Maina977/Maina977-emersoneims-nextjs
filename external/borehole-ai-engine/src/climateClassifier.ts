// ═══════════════════════════════════════════════════════════════════════════
// CLIMATE CLASSIFIER — Köppen-Geiger climate type + wind profile
// ═══════════════════════════════════════════════════════════════════════════
// Adds the "weather type" and "wind type" a site actually has, from REAL data:
//   • Köppen-Geiger classification computed from monthly temperature + rainfall
//     normals (a standard, deterministic scheme — Peel et al. 2007).
//   • Wind profile (mean speed) from NASA POWER / MERRA-2.
// Both come from NASA POWER (already CSP-allowed, no auth). fetch returns null
// on failure — the classifier never invents a climate.
// ═══════════════════════════════════════════════════════════════════════════

export interface KoppenResult {
  code: string;         // e.g. 'Aw', 'BWh', 'Cfb'
  group: string;        // Tropical / Arid / Temperate / Continental / Polar
  name: string;         // human name
  description: string;
}

export interface ClimateTypeResult {
  koppen: KoppenResult;
  annualTemp_c: number;
  annualPrecip_mm: number;
  meanWind_ms: number | null;
  windDescription: string | null;
  source: string;
  provenance: 'measured_reanalysis';
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const POWER_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';

/**
 * Köppen-Geiger classification from 12 monthly mean temps (°C) and 12 monthly
 * precip totals (mm). `southern` swaps the summer/winter half-years.
 * Implements the standard A/B/C/D/E groups with precip and temperature subtypes.
 */
export function classifyKoppen(monthlyTemp: number[], monthlyPrecip: number[], southern = false): KoppenResult {
  const T = monthlyTemp, P = monthlyPrecip;
  const Tann = T.reduce((s, v) => s + v, 0) / 12;
  const Pann = P.reduce((s, v) => s + v, 0);
  const Tmax = Math.max(...T), Tmin = Math.min(...T);
  const Pdrymin = Math.min(...P);

  // Summer = warm half-year. N hemisphere Apr-Sep (idx 3..8); S hemisphere Oct-Mar.
  const summerIdx = southern ? [9, 10, 11, 0, 1, 2] : [3, 4, 5, 6, 7, 8];
  const winterIdx = southern ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 0, 1, 2];
  const sum = (idx: number[]) => idx.reduce((s, i) => s + P[i], 0);
  const Psummer = sum(summerIdx), Pwinter = sum(winterIdx);
  const PsummerMin = Math.min(...summerIdx.map(i => P[i]));
  const PwinterMin = Math.min(...winterIdx.map(i => P[i]));
  const PsummerMax = Math.max(...summerIdx.map(i => P[i]));
  const PwinterMax = Math.max(...winterIdx.map(i => P[i]));

  // ── B (arid) dryness threshold (Peel et al. 2007), mm/yr ──
  const summerShare = Pann > 0 ? Psummer / Pann : 0.5;
  const k = summerShare >= 0.7 ? 280 : summerShare <= 0.3 ? 0 : 140;
  const Rth = 20 * Tann + k;
  const mk = (group: string, name: string, code: string, description: string): KoppenResult => ({ code, group, name, description });

  if (Pann < Rth) {
    const arid = Pann < Rth / 2 ? 'W' : 'S';
    const heat = Tann >= 18 ? 'h' : 'k';
    return mk('Arid', arid === 'W' ? 'Desert' : 'Steppe', `B${arid}${heat}`,
      `${arid === 'W' ? 'Desert' : 'Semi-arid steppe'} climate — annual rainfall (${Math.round(Pann)} mm) is below the aridity threshold (${Math.round(Rth)} mm). Recharge is limited and episodic; groundwater is often the primary water source.`);
  }

  // ── A (tropical): coldest month ≥ 18°C ──
  if (Tmin >= 18) {
    if (Pdrymin >= 60) return mk('Tropical', 'Rainforest', 'Af', 'Tropical rainforest — no dry season; high, steady rainfall and strong recharge.');
    if (Pdrymin >= 100 - Pann / 25) return mk('Tropical', 'Monsoon', 'Am', 'Tropical monsoon — a short dry season offset by a very wet season; good annual recharge.');
    return mk('Tropical', 'Savanna', 'Aw', 'Tropical savanna — a pronounced dry season; recharge is seasonal and rainfall-dependent.');
  }

  // ── E (polar): warmest month < 10°C ──
  if (Tmax < 10) {
    return Tmax < 0
      ? mk('Polar', 'Ice cap', 'EF', 'Polar ice-cap climate.')
      : mk('Polar', 'Tundra', 'ET', 'Polar tundra climate.');
  }

  // Precip subtype for C/D
  const dryWinter = PwinterMin < 30 && PwinterMin < PsummerMax / 10;
  const drySummer = PsummerMin < 30 && PsummerMin < PwinterMax / 3;
  const pLetter = drySummer ? 's' : dryWinter ? 'w' : 'f';
  // Temperature subtype
  const warmMonths = T.filter(t => t >= 10).length;
  const tLetter = Tmax >= 22 ? 'a' : warmMonths >= 4 ? 'b' : 'c';
  const pName = pLetter === 'f' ? 'no dry season' : pLetter === 's' ? 'dry summer' : 'dry winter';

  // ── D (continental): coldest month ≤ -3°C ──
  if (Tmin <= -3) {
    return mk('Continental', 'Continental', `D${pLetter}${tLetter}`, `Continental climate (${pName}); strong seasonal temperature range.`);
  }
  // ── C (temperate) ──
  return mk('Temperate', 'Temperate', `C${pLetter}${tLetter}`,
    `Temperate climate (${pName})${tLetter === 'b' ? ', warm summer' : tLetter === 'a' ? ', hot summer' : ', mild'}. Typical of many highland/agricultural zones; moderate, seasonal recharge.`);
}

function windDescriptor(ms: number): string {
  if (ms < 1.5) return 'Calm — poor for wind-based pumping';
  if (ms < 3) return 'Light breeze — marginal for wind pumping';
  if (ms < 5) return 'Moderate — viable for mechanical wind pumps';
  if (ms < 8) return 'Fresh — good wind resource';
  return 'Strong — excellent wind resource (secure equipment)';
}

/**
 * Fetch monthly climate normals + wind from NASA POWER and classify the climate.
 * Returns null on failure — never fabricates a climate type.
 */
export async function fetchClimateType(
  lat: number,
  lon: number,
  fetchImpl: typeof fetch = fetch,
): Promise<ClimateTypeResult | null> {
  try {
    const url = `${POWER_URL}?parameters=T2M,PRECTOTCORR,WS2M&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;
    const res = await fetchImpl(url);
    if (!res.ok) return null;
    const json = await res.json();
    return buildClimateType(json, lat < 0);
  } catch {
    return null;
  }
}

/** Pure builder from a NASA POWER climatology payload (T2M °C, PRECTOTCORR mm/day, WS2M m/s). */
export function buildClimateType(json: any, southern: boolean): ClimateTypeResult | null {
  const p = json?.properties?.parameter;
  const t2m = p?.T2M, prec = p?.PRECTOTCORR, ws = p?.WS2M;
  if (!t2m || !prec) return null;
  const monthlyTemp: number[] = [], monthlyPrecip: number[] = [];
  for (let i = 0; i < 12; i++) {
    const tv = t2m[MONTHS[i]], pv = prec[MONTHS[i]];
    if (typeof tv !== 'number' || tv < -90 || typeof pv !== 'number' || pv < -90) return null;
    monthlyTemp.push(tv);
    monthlyPrecip.push(pv * DAYS[i]); // mm/day → mm/month
  }
  const koppen = classifyKoppen(monthlyTemp, monthlyPrecip, southern);
  const annualTemp_c = Math.round((monthlyTemp.reduce((s, v) => s + v, 0) / 12) * 10) / 10;
  const annualPrecip_mm = Math.round(monthlyPrecip.reduce((s, v) => s + v, 0));
  let meanWind_ms: number | null = null;
  if (ws && typeof ws.ANN === 'number' && ws.ANN > -90) meanWind_ms = Math.round(ws.ANN * 100) / 100;
  else if (ws) { const vals = MONTHS.map(m => ws[m]).filter((v: any) => typeof v === 'number' && v > -90); if (vals.length) meanWind_ms = Math.round((vals.reduce((s: number, v: number) => s + v, 0) / vals.length) * 100) / 100; }
  return {
    koppen, annualTemp_c, annualPrecip_mm,
    meanWind_ms,
    windDescription: meanWind_ms == null ? null : windDescriptor(meanWind_ms),
    source: 'NASA POWER / MERRA-2 climatology (T2M, PRECTOTCORR, WS2M)',
    provenance: 'measured_reanalysis',
  };
}
