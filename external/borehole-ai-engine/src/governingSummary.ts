/**
 * The governing figures of an analysis, in one place, for the Word, Excel and
 * CSV exports (2026-10-30 audit: those exports printed sub-models hidden from
 * the page as misleading — an InSAR rate with "no coverage", "ROI 500%,
 * payback 1 month", pH 0.00 FAIL from a key typo, "undefined" fields — and
 * had no verdict or costs). Every value here is the one the page and the PDF
 * summary show, with its source.
 */
import type { AnalysisResult } from './types';
import { finalVerdict, salinityFromWaterQuality, chemFromWaterQuality, labSourceLabel, nearbyProvenance } from './verdict';
import { computeCanonicalEconomics } from './reportShared';
import { evidenceGate, provenanceText } from './evidenceGate';
import { costSourcing, QUOTATION_TEXT } from './costSources';
import { locationStatusText, waterCheckStatusText, photoGpsConflictText } from './locationStatus';
import { displayDepth, displayYield } from './displayFigures';
import { waterQualityStatus } from './waterQualityStatus';

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
  const g0 = evidenceGate(result);

  // 1. Verdict
  const depthRange = r.uncertainty?.depthRange;
  const yieldRange = r.uncertainty?.yieldRange;
  sections.push({
    title: 'Verdict',
    rows: [
      ['Site', locationText, `${f(r.site?.latitude, 5)}, ${f(r.site?.longitude, 5)}`],
      // Re-review of f89698e8 (MAJOR): the same location and water-check status as the screen, PDF and JSON.
      ['Location source', locationStatusText(r), 'How the site coordinates were obtained'],
      ['Water-body check', waterCheckStatusText(r), 'Offline lake, reservoir and coastline maps'],
      ...(photoGpsConflictText(r) ? [['Photo GPS', String(photoGpsConflictText(r)), 'The camera position is not used for the site'] as Row] : []),
      ['Verdict', v.verdict, 'Desktop pre-screen: a hydrogeological survey is required before drilling (Kenya Water Resources Regulations)'],
      ['What to do next', v.next, ''],
      ['Chance of a productive borehole', probabilityBand(n(r.probability) ?? 0.5), 'A planning estimate from desktop data; not yet calibrated against drilling outcomes'],
      // Re-review of f89698e8, BLOCKING 2: depth and yield only through the display accessor.
      ['Planned depth', (() => { const d = displayDepth(r); return d.shown ? `${f(d.value)} m${Array.isArray(depthRange) ? ` (likely ${f(depthRange[0])}-${f(depthRange[1])} m)` : ''}` : d.text; })(), g0.citations.depth ? `Field evidence: ${g0.citations.depth}` : 'Field records nearby where they exist, otherwise the regional model'],
      ...(((r.fallbacksUsed ?? r.dataProvenance?.fallbacksUsed ?? []) as string[]).length ? [['Sources that did not answer', ((r.fallbacksUsed ?? r.dataProvenance?.fallbacksUsed) as string[]).join('; '), 'A stored baseline or no value was used for these'] as Row] : []),
      ['Expected yield', (() => { const y = displayYield(r); return y.shown ? `${f(y.value, 1)} m³/h${Array.isArray(yieldRange) ? ` (likely ${f(yieldRange[0], 1)}-${f(yieldRange[1], 1)} m³/h)` : ''}` : y.text; })(), g0.citations.yield ? `Field evidence: ${g0.citations.yield}` : 'Confirmed only by a pump test'],
    ],
  });

  // 1b. The field evidence entered, with its source (2026-11-22).
  const fd = r.fieldData ?? {};
  const evRowsField: Row[] = [];
  if (g0.citations.depth) evRowsField.push(['Drilling depth', 'from field evidence', g0.citations.depth]);
  if (g0.citations.yield) evRowsField.push(['Yield', 'from field evidence', g0.citations.yield]);
  if (fd.labWaterAnalysis) evRowsField.push(['Water quality', 'laboratory', `${labSourceLabel(fd.labWaterAnalysis)} ${provenanceText(fd.labWaterAnalysis.provenance)}`]);
  if (evRowsField.length) sections.push({ title: 'Field evidence entered', rows: evRowsField });
  // 1c. Time-series pumping-test analysis (2026-11-25): the same rows as the Pump Test tab.
  if (r.pumpTestTimeSeries?.rows?.length) sections.push({ title: 'Pumping test analysis (time series)', rows: r.pumpTestTimeSeries.rows as Row[] });

  // 2. Water quality: measured where nearby boreholes were tested, otherwise
  //    a regional estimate; parameters with no basis need a laboratory test.
  const wq = r.waterQuality || {};
  const mq = wq.measuredNearby;
  const wqRows: Row[] = [];
  const tdsLimit = 1000;
  // A laboratory test of this borehole's water governs everything else.
  const lab = r.calibrationResult?.calibratedWaterQuality;
  if (lab) {
    // "Measured: laboratory test (name, sampled date)": never confusable with a modelled class.
    const labBasis = labSourceLabel(lab);
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
  // 2026-11-21: a modelled salinity is shown as a screening class only, never
  // as a concentration; the measured nearby median keeps its figure and source.
  const sal = salinityFromWaterQuality(wq);
  // Re-review of f89698e8, BLOCKING 3: the potability status as on the screen.
  wqRows.push(['Potability', waterQualityStatus(r).potability, 'A potability or treatment conclusion needs a laboratory result']);
  if (sal.basis === 'nearby') wqRows.push(['Salinity (TDS)', sal.value, `${sal.source}. ${mq.ec.over1500} of ${mq.ec.n} above EC 1,500 µS/cm. Drinking limit ${tdsLimit} mg/L`]);
  else if (sal.basis === 'modelled') wqRows.push(['Salinity (TDS)', sal.value, `${sal.source}. ${sal.sentence}`]);
  else wqRows.push(['Salinity (TDS)', 'laboratory test needed', 'No salinity estimate for this site']);
  // 2026-11-21: fluoride and nitrate follow the salinity rule. The median of 3+
  // measured boreholes keeps its figure and source; otherwise the site value is
  // a risk class only (no mg/L figure, no threshold attached to it). One or two
  // nearby tests are measurements at those boreholes, too few for a site value:
  // they are reported as such beside the class (audit 2026-11-05: Kisumu).
  const fl = chemFromWaterQuality('fluoride', wq);
  if (fl.basis === 'nearby') wqRows.push(['Fluoride', fl.value, `${fl.source}. ${mq.fluoride.over1_5} of ${mq.fluoride.n} above 1.5 mg/L; highest ${f(mq.fluoride.max, 1)} mg/L. WHO guideline 1.5 mg/L`]);
  else if (fl.basis === 'modelled') {
    const fas = wq.fluorideAreaSurvey;
    const tests = fas?.values?.length
      ? ` Measured at ${fas.values.length} borehole${fas.values.length > 1 ? 's' : ''} in ${fas.name} (${fas.sampled}): ${fas.values.map((v: number) => f(v, 1)).join(' and ')} mg/L; too few for a site value.`
      : mq?.fluoride?.n > 0
        ? ` Measured at only ${mq.fluoride.n} borehole${mq.fluoride.n > 1 ? 's' : ''} within ${mq.radius_km} km (highest ${f(mq.fluoride.max, 1)} mg/L${mq.fluoride.over1_5 ? `; ${mq.fluoride.over1_5} above 1.5 mg/L` : ''}) ${nearbyProvenance(mq)}: too few for a site value.`
        : '';
    wqRows.push(['Fluoride', fl.value, `${fl.source}. ${fl.sentence}${tests}`]);
  } else wqRows.push(['Fluoride', 'laboratory test needed', 'No fluoride estimate for this site']);
  const ni = chemFromWaterQuality('nitrate', wq);
  if (ni.basis === 'nearby') wqRows.push(['Nitrate', ni.value, `${ni.source}. WHO guideline 50 mg/L`]);
  else wqRows.push(['Nitrate', 'laboratory test needed', 'Depends on nearby latrines and farming; not predictable from desktop data, so no regional value is given. A laboratory test of the first water decides']);
  for (const p of ['pH', 'Iron', 'Hardness', 'Arsenic', 'Bacteria (E. coli)']) wqRows.push([p, 'laboratory test needed', 'No measurement near the site']);
  sections.push({ title: 'Water quality', rows: wqRows, notes: (wq.regionalWarnings ?? []).map(String) });
  }

  // 3. Costs and payback (one model). 2026-11-22: only lines with a sourced
  //    rate carry a price, with the source beside it; the rest are "by
  //    quotation", and the total is the total of the sourced lines.
  const cs = costSourcing(eco);
  const costRows: Row[] = cs.lines.map((l): Row => l.source
    ? [l.item, usd(l.usd), `${eco.kes(l.usd)}. ${l.source}`]
    : [l.item, QUOTATION_TEXT, 'No sourced rate on file: the supplier\'s quotation prices this item']);
  if (eco.salinityUnpriced) costRows.push(['Desalination (reverse osmosis)', 'not priced', 'Salinity has not been measured at this site; a laboratory test of the first water decides whether treatment is needed and its size']);
  if (eco.fluorideUnpriced) costRows.push(['Defluoridation', 'not priced', 'Fluoride has not been measured at this site; a laboratory test of the first water decides whether treatment is needed and its size']);
  costRows.push([`Contingency (${Math.round(eco.contingencyRate * 100)}% of the sourced items)`, usd(cs.sourcedContingency), eco.kes(cs.sourcedContingency)]);
  costRows.push([cs.quotationItems.length ? 'TOTAL of the sourced items' : 'TOTAL', usd(cs.sourcedTotal), `${eco.kes(cs.sourcedTotal)}${cs.quotationItems.length ? `. Not included, by quotation: ${cs.quotationItems.join(', ')}` : ''}`]);
  if (r.pumpHeadAssumption) costRows.push(['Water level behind the pump cost', 'assumed, not measured', String(r.pumpHeadAssumption)]);
  const paybackYears = n(eco.paybackMonths) !== null && eco.paybackMonths > 0 ? eco.paybackMonths / 12 : null;
  costRows.push(['Payback if water is sold', eco.paybackWithheld ? 'not given: the site screens as unfavourable' : cs.quotationItems.length ? 'not given until the quotation prices every item' : paybackYears !== null ? `about ${f(paybackYears, 1)} years` : 'does not pay back from water sales', `$${eco.waterTariffPerM3}/m³, ${eco.pumpHoursPerDay} h/day, ${eco.operatingDaysPerYear} days/yr${eco.needsRO ? `; only ${Math.round(eco.roRecovery * 100)}% is product water after reverse osmosis, which costs about $${eco.roOpexPerM3}/m³` : ''}`]);
  const ge = evidenceGate(result);
  sections.push({ title: 'Costs (typical Kenyan prices, not a quotation)', rows: costRows, notes: [
    'Prices are estimates for planning; the drilling contractor and the hydrogeological survey fix the real cost.',
    ...(ge.cost ? [`Priced on the drilling depth and yield from the field evidence entered: ${[ge.citations.depth, ge.citations.yield].filter(Boolean).join('; ')}.`] : []),
  ] });

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
