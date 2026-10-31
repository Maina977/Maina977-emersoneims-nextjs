/**
 * The governing figures of an analysis, in one place, for the Word, Excel and
 * CSV exports (2026-10-30 audit: those exports printed sub-models hidden from
 * the page as misleading — an InSAR rate with "no coverage", "ROI 500%,
 * payback 1 month", pH 0.00 FAIL from a key typo, "undefined" fields — and
 * had no verdict or costs). Every value here is the one the page and the PDF
 * summary show, with its source.
 */
import type { AnalysisResult } from './types';
import { finalVerdict } from './verdict';
import { computeCanonicalEconomics } from './reportShared';

export type Row = [string, string, string]; // label, value, basis
export interface SummarySection { title: string; rows: Row[]; notes?: string[] }

const n = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const f = (v: unknown, dp = 0): string => { const x = n(v); return x === null ? '—' : x.toLocaleString('en-KE', { maximumFractionDigits: dp, minimumFractionDigits: dp }); };
const usd = (v: unknown) => { const x = n(v); return x === null ? '—' : `$${Math.round(x).toLocaleString('en-KE')}`; };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthName = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MONTHS[m - 1]} ${y}`; };

/** "Jul 2024 to Jun 2025": the 12 months ending a record period "YYYY-MM to YYYY-MM"; null if it cannot be read. */
export function last12Months(period: unknown): string | null {
  const end = /(\d{4})-(\d{2})\s*$/.exec(String(period ?? ''));
  if (!end) return null;
  const y = Number(end[1]), m = Number(end[2]);
  if (m < 1 || m > 12) return null;
  const start = `${m === 12 ? y : y - 1}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}`;
  return `${monthName(start)} to ${monthName(`${y}-${end[2]}`)}`;
}

/** "about 7 in 10": the success probability is a planning estimate, not a calibrated frequency. */
export function probabilityBand(p: number): string {
  const tenths = Math.max(1, Math.min(9, Math.round(p * 10)));
  return `about ${tenths} in 10`;
}

export function governingSummary(result: AnalysisResult, locationText: string): SummarySection[] {
  const r: any = result;
  const v = finalVerdict(result);
  const eco = computeCanonicalEconomics(result);
  const sections: SummarySection[] = [];

  // 1. Verdict
  const depthRange = r.uncertainty?.depthRange;
  const yieldRange = r.uncertainty?.yieldRange;
  sections.push({
    title: 'Verdict',
    rows: [
      ['Site', locationText, `${f(r.site?.latitude, 5)}, ${f(r.site?.longitude, 5)}`],
      ['Verdict', v.verdict, 'Desktop pre-screen: a hydrogeological survey is required before drilling (Kenya Water Resources Regulations)'],
      ['What to do next', v.next, ''],
      ['Chance of a productive borehole', probabilityBand(n(r.probability) ?? 0.5), 'A planning estimate from desktop data; not yet calibrated against drilling outcomes'],
      ['Planned depth', `${f(r.recommendedDepth)} m${Array.isArray(depthRange) ? ` (likely ${f(depthRange[0])}-${f(depthRange[1])} m)` : ''}`, 'Field records nearby where they exist, otherwise the regional model'],
      ['Expected yield', `${f(r.estimatedYield, 1)} m³/h${Array.isArray(yieldRange) ? ` (likely ${f(yieldRange[0], 1)}-${f(yieldRange[1], 1)} m³/h)` : ''}`, 'Confirmed only by a pump test'],
    ],
  });

  // 2. Water quality: measured where nearby boreholes were tested, otherwise
  //    a regional estimate; parameters with no basis need a laboratory test.
  const wq = r.waterQuality || {};
  const mq = wq.measuredNearby;
  const wqRows: Row[] = [];
  const tdsLimit = 1000;
  // A laboratory test of this borehole's water governs everything else.
  const lab = r.calibrationResult?.calibratedWaterQuality;
  if (lab) {
    const meta = [lab.labName, lab.sampleDate].filter(Boolean).join(', ');
    const labBasis = `Laboratory test${meta ? ` (${meta})` : ''}`;
    const params: [string, string, string, string][] = [
      ['pH', 'pH', '', '6.5-8.5'], ['Salinity (TDS)', 'tds', 'mg/L', 'limit 1,000 mg/L'], ['Fluoride', 'fluoride', 'mg/L', 'WHO limit 1.5 mg/L'],
      ['Nitrate', 'nitrate', 'mg/L', 'WHO limit 50 mg/L'], ['Iron', 'iron', 'mg/L', 'limit 0.3 mg/L'], ['Arsenic', 'arsenic', 'mg/L', 'WHO limit 0.01 mg/L'],
      ['Bacteria (coliform)', 'coliform', 'CFU/100 mL', 'must be 0'], ['Hardness', 'hardness', 'mg/L CaCO3', ''],
    ];
    for (const [label, key, unit, limit] of params) {
      const x = n(lab[key]);
      wqRows.push([label, x === null ? 'not tested' : `${x}${unit ? ' ' + unit : ''}`, x === null ? 'Not in the laboratory report' : `${labBasis}${limit ? '. ' + limit : ''}`]);
    }
    wqRows.push(['Safe to drink', lab.isPotable ? 'Yes, on the parameters tested' : 'Not confirmed', (lab.treatmentRequired ?? []).join('; ') || 'Coliform, fluoride, nitrate, arsenic and TDS must all be tested']);
    sections.push({ title: 'Water quality', rows: wqRows, notes: (wq.regionalWarnings ?? []).map(String) });
  } else {
  if (mq?.ec?.n >= 3) wqRows.push(['Salinity (TDS)', `${f(wq.tds)} mg/L`, `Measured: median of ${mq.ec.n} boreholes within ${mq.radius_km} km (${mq.ec.over1500} of ${mq.ec.n} above EC 1,500 µS/cm). Drinking limit ${tdsLimit} mg/L`]);
  else wqRows.push(['Salinity (TDS)', `about ${f(wq.tds)} mg/L`, `Regional estimate, not measured. Drinking limit ${tdsLimit} mg/L`]);
  if (mq?.fluoride?.n >= 3) wqRows.push(['Fluoride', `${f(wq.fluoride, 1)} mg/L`, `Measured: median of ${mq.fluoride.n} boreholes (${mq.fluoride.over1_5} of ${mq.fluoride.n} above 1.5 mg/L; highest ${f(mq.fluoride.max, 1)})`]);
  else wqRows.push(['Fluoride', `about ${f(wq.fluoride, 1)} mg/L`, 'Regional estimate, not measured. WHO limit 1.5 mg/L']);
  if (mq?.nitrate?.n >= 3) wqRows.push(['Nitrate', `${f(wq.nitrate)} mg/L`, `Measured: median of ${mq.nitrate.n} boreholes. WHO limit 50 mg/L`]);
  else wqRows.push(['Nitrate', 'laboratory test needed', 'Depends on nearby latrines and farming; not predictable from desktop data. WHO limit 50 mg/L']);
  for (const p of ['pH', 'Iron', 'Hardness', 'Arsenic', 'Bacteria (E. coli)']) wqRows.push([p, 'laboratory test needed', 'No measurement near the site']);
  sections.push({ title: 'Water quality', rows: wqRows, notes: (wq.regionalWarnings ?? []).map(String) });
  }

  // 3. Costs and payback (the PDF's cost table, one model)
  const costRows: Row[] = [
    ['Hydrogeological survey and WRA approvals (required)', usd(eco.surveyCost + eco.permitCost), eco.kes(eco.surveyCost + eco.permitCost)],
    [`Drilling (${f(eco.depthVal)} m, ${eco.drillMethod})`, usd(eco.drillingCost), eco.kes(eco.drillingCost)],
    ['Mobilisation', usd(eco.mobilisationCost), eco.kes(eco.mobilisationCost)],
    ['Casing and screen', usd(eco.casingCost + eco.screenCost), eco.kes(eco.casingCost + eco.screenCost)],
    ['Pump and installation', usd(eco.pumpCost + eco.installCost), eco.kes(eco.pumpCost + eco.installCost)],
  ];
  if (eco.solarCost > 0) costRows.push([`Solar pump power (${f(eco.solarKW, 1)} kW)`, usd(eco.solarCost), eco.kes(eco.solarCost)]);
  if (eco.wqTreatmentCost > 0) costRows.push([eco.needsRO ? 'Desalination (reverse osmosis) allowance' : 'Water treatment allowance (a laboratory test decides)', usd(eco.wqTreatmentCost), eco.kes(eco.wqTreatmentCost)]);
  if (eco.defluoridationCost > 0) costRows.push(['Defluoridation', usd(eco.defluoridationCost), eco.kes(eco.defluoridationCost)]);
  costRows.push([`Contingency (${Math.round(eco.contingencyRate * 100)}%)`, usd(eco.contingency), eco.kes(eco.contingency)]);
  costRows.push(['TOTAL', usd(eco.totalCost), eco.kes(eco.totalCost)]);
  if (r.pumpHeadAssumption) costRows.push(['Water level behind the pump cost', 'assumed, not measured', String(r.pumpHeadAssumption)]);
  const paybackYears = n(eco.paybackMonths) !== null && eco.paybackMonths > 0 ? eco.paybackMonths / 12 : null;
  costRows.push(['Payback if water is sold', eco.paybackWithheld ? 'not given: the site screens as unfavourable' : paybackYears !== null ? `about ${f(paybackYears, 1)} years` : 'does not pay back from water sales', `$${eco.waterTariffPerM3}/m³, ${eco.pumpHoursPerDay} h/day, ${eco.operatingDaysPerYear} days/yr${eco.needsRO ? `; only ${Math.round(eco.roRecovery * 100)}% is product water after reverse osmosis, which costs about $${eco.roOpexPerM3}/m³` : ''}`]);
  sections.push({ title: 'Costs (typical Kenyan prices, not a quotation)', rows: costRows, notes: ['Prices are estimates for planning; the drilling contractor and the hydrogeological survey fix the real cost.'] });

  // 4. Rainfall, recharge and groundwater storage
  const w = r.historicalData?.weather;
  const rs = r.rechargeSummary;
  const climRows: Row[] = [];
  if (n(w?.averageAnnualPrecipitation) !== null) climRows.push(['Rainfall', `${f(w.averageAnnualPrecipitation)} mm/yr`, String(w.source ?? 'Reanalysis')]);
  if (rs?.governing_mm != null) climRows.push(['Groundwater recharge (planning figure)', `${f(rs.governing_mm)} mm/yr`, `${Math.round((rs.fraction ?? 0) * 100)}% of rainfall; estimates range ${f(rs.spread_mm?.[0])}-${f(rs.spread_mm?.[1])} mm/yr`]);
  const g = r.graceData;
  if (g?.isSatelliteGravity !== false && g?.groundwater) {
    const gw = g.groundwater;
    const l12 = last12Months(gw.period);
    climRows.push(['Groundwater storage trend (GRACE)', `${gw.trend_cm_per_year > 0 ? '+' : ''}${f(gw.trend_cm_per_year, 2)} cm/yr (± ${f(gw.trendStdErr_cm_per_year, 2)})`, `${gw.period}; regional (~300 km), not the aquifer under the site`]);
    if (l12) climRows.push(['Groundwater, latest 12 months of record', `${gw.anomalyLast12_cm > 0 ? '+' : ''}${f(gw.anomalyLast12_cm, 1)} cm against the record mean`, l12]);
  }
  if (g?.isSatelliteGravity !== false && g?.totalStorage) {
    climRows.push(['Total water storage trend (GRACE-FO, to date)', `${g.totalStorage.trend_cm_per_year > 0 ? '+' : ''}${f(g.totalStorage.trend_cm_per_year, 2)} cm/yr`, String(g.totalStorage.period)]);
  }
  if (climRows.length) sections.push({ title: 'Rainfall, recharge and groundwater storage', rows: climRows, notes: w?.precipitationNote ? [String(w.precipitationNote)] : [] });

  // 5. Evidence near the site
  const nw = r.nearbyWells;
  const evRows: Row[] = [];
  if (nw?.sampleSize) evRows.push(['Water points on record within ' + f(nw.searchRadius_km) + ' km', f(nw.sampleSize), (nw.dataSources ?? []).slice(0, 4).join('; ')]);
  const ds = nw?.densityAnalysis?.depthStats;
  if (ds && (nw.densityAnalysis.wellsWithDepth ?? 0) >= 3) evRows.push(['Drilled depths nearby (median, quartiles)', `${f(ds.median)} m (${f(ds.p25)}-${f(ds.p75)} m)`, `${nw.densityAnalysis.wellsWithDepth} records with a depth`]);
  const od = nw?.openData;
  if (od?.bgsMaps) evRows.push(['Regional groundwater map (BGS)', `depth to water ${od.bgsMaps.depthToGroundwater ?? '—'}; yield ${od.bgsMaps.productivity ?? '—'}`, 'MacDonald et al. 2012, 5 km grid. Contains data supplied by permission of the Natural Environment Research Council [2023]']);
  if (od?.measured?.restWaterLevel) evRows.push(['Rest water level nearby (median)', `${f(od.measured.restWaterLevel.median, 1)} m`, `${od.measured.restWaterLevel.n} boreholes, measured`]);
  if (evRows.length) sections.push({ title: 'Evidence near the site', rows: evRows });

  // Guard: no "undefined" or "NaN" reaches a customer document.
  for (const s of sections) {
    for (const row of s.rows) for (let i = 0; i < row.length; i++) if (/\bundefined\b|\bNaN\b/.test(row[i])) row[i] = '—';
    if (s.notes) s.notes = s.notes.filter((x) => x && !/\bundefined\b|\bNaN\b/.test(x));
  }
  return sections;
}
