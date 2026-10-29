/**
 * Report helpers the AquaScan page needs while it renders (2026-10-29: moved
 * out of reportGenerator.ts so that file, with jsPDF, ExcelJS and docx, loads
 * only when a report is downloaded - much faster page load).
 */
import type { AnalysisResult } from './types';
import { auditReport, type AuditReport } from './reportAuditor';
import type { VerificationReport } from './preReportVerification';
import { drillRatePerM, mobilisationUSD, countyRateBand, costSoilType, KES_PER_USD } from './costModel';

export class AuditBlockError extends Error {
  public audit: AuditReport;
  constructor(audit: AuditReport) {
    super(audit.blockedReason || 'Report blocked: audit failed');
    this.name = 'AuditBlockError';
    this.audit = audit;
  }
}

export class VerificationBlockError extends Error {
  public verification: VerificationReport;
  constructor(verification: VerificationReport) {
    super(verification.summary || 'Report blocked: verification failed');
    this.name = 'VerificationBlockError';
    this.verification = verification;
  }
}

export function runPrePublishAudit(result: AnalysisResult): AuditReport {
  return auditReport(result);
}

let _customerName = '';
let _customerEmail = '';
let _customerOrg = '';

export function setCustomerDetails(name: string, email: string, org: string): void {
  _customerName = name;
  _customerEmail = email;
  _customerOrg = org;
}

/** The customer details set on the page, for the report tracker. */
export function getCustomerDetails(): { name: string; email: string; org: string } {
  return { name: _customerName, email: _customerEmail, org: _customerOrg };
}

const kesRound = (usd: number) => Math.round((usd * KES_PER_USD) / 1000) * 1000;
const fmtKESm = (usd: number) => {
  const kes = usd * KES_PER_USD;
  return kes >= 1_000_000 ? `KSh ${(kes / 1_000_000).toFixed(2)}M` : `KSh ${kesRound(usd).toLocaleString()}`;
};

export function computeCanonicalEconomics(result: AnalysisResult) {
  const depthVal = result.recommendedDepth ?? 50;
  const yieldVal = result.estimatedYield ?? 2;
  // Same basis as the on-screen cost card (costModel.ts, 2026-10-20): measured
  // soil type only, kept inside the county's recorded rate band.
  const soilType = (costSoilType(result) || 'unknown').toLowerCase();
  const cpm = drillRatePerM(soilType, countyRateBand(result), (result as any).rockClassification?.primaryRockType);
  const drillingCost = Math.round(depthVal * cpm);
  const mobilisationCost = mobilisationUSD(result.site?.latitude, result.site?.longitude);
  // Sediments (Garissa's Merti beds, Lodwar alluvium) are drilled mud-rotary
  // whatever the topsoil (2026-10-25 audit: every site was priced air/DTH).
  const _geo = String((result as any).rockClassification?.primaryRockType ?? '').toLowerCase();
  // The aquifer province decides first (2026-10-25 audit round 5: "sandstone"
  // hit the "stone" exclusion, so Garissa's Merti sediments were still DTH).
  const _prov = String((result as any).hydroProvince ?? '');
  const _loose = _prov === 'SEDIMENT_NE' || _prov === 'ALLUVIAL'
    || (!_prov && (['sandy', 'silty', 'clay'].includes(soilType) || /sand|alluv|sediment|gravel|clay/.test(_geo) && !/basalt|granite|gneiss|quartzite/.test(_geo)));
  const drillMethod = _loose ? 'mud rotary (loose formation)' : 'air/DTH (consolidated)';

  const wci = (result as any).waterDesign?.waterChemistryIndices;
  const isCorrosive = wci && (wci.langelierSaturationIndex ?? 0) < -1.5;
  const casingRatePerM = isCorrosive ? 32 : 18; // HDPE/SS316L vs standard steel

  const aqZone = (result as any).subsurfaceModel?.aquiferZones?.[0] ?? (result as any).geophysicsFusion?.aquiferZones?.[0];
  const aquiferThickness = aqZone ? Math.round(aqZone.bottomM - aqZone.topM) : 0;
  const screenLength = aquiferThickness > 0 ? Math.min(aquiferThickness, 20) : Math.min(depthVal * 0.3, 20);
  const screenCost = Math.round(screenLength * 35);
  // AUDIT FIX (2026-07-16, water engineer): screen REPLACES blind casing over
  // its interval — the old model billed full-depth casing PLUS the screen
  // (60 m of string in a 40 m hole, ~$360 double-count). Blind casing = depth
  // minus screen length (min 6 m surface/sump stick-up allowance).
  const blindCasingLen = Math.max(Math.round(depthVal - screenLength), 6);
  const casingCost = Math.round(blindCasingLen * casingRatePerM);
  const casingNote = (isCorrosive
    ? `${blindCasingLen}m blind casing x $${casingRatePerM}/m -- HDPE/SS316L (corrosive water, LSI ${wci.langelierSaturationIndex?.toFixed(2)})`
    : `${blindCasingLen}m blind casing x $${casingRatePerM}/m`)
    + ` (+ ${Math.round(screenLength)}m screen = ${blindCasingLen + Math.round(screenLength)}m string in a ${depthVal}m hole)`;
  // The modelled static water level (for the screen-spans-SWL note below).
  const _swl = (result as any).waterTableDepth ?? (result as any).estimatedWaterTable ?? (result as any).subsurfaceModel?.waterTableDepth_m;
  // AUDIT FIX (2026-07-16 external review): a desktop model must not SPECIFY a
  // screen interval — no lithological log or water strikes exist yet. The
  // interval below is a COSTING ALLOWANCE only.
  const screenNote = (aquiferThickness > 0
    ? `${Math.round(screenLength)}m screen allowance against the ${aquiferThickness}m MODELLED aquifer zone (${Math.round(aqZone.topM)}-${Math.round(aqZone.bottomM)}m)`
    : `${Math.round(screenLength)}m screen allowance (30% of depth, aquifer zone unmodelled)`)
    + '. COSTING ALLOWANCE ONLY — the actual screen interval, gravel pack and sanitary seal are designed from the driller\'s lithological log, water strikes and interpreted ERT, never from this desktop model.'
    + (aqZone && Number.isFinite(_swl) && aqZone.topM <= _swl
      ? ` (The modelled zone spans the modelled static water level ~${Math.round(_swl)}m — normal in an unconfined weathered aquifer.)`
      : '');

  // Prefer the well-design pump SELECTION (real pump curve) so the executive
  // pages and the detailed Pump Selection page describe ONE pump, not three
  // different kW/head figures (re-audit #4). Fall back to the rough estimate
  // only when the well-design engine did not run.
  const _wdPump: any = (result as any).wellDesign?.pump;
  const pumpHead = _wdPump?.totalDynamicHead_m != null
    ? Math.round(_wdPump.totalDynamicHead_m)
    : Math.round(depthVal * 0.5 + 10);
  const pumpKW = _wdPump?.motorRating_kW != null
    ? _wdPump.motorRating_kW
    : Math.max(0.37, Math.round((yieldVal * pumpHead * 9.81 / 3600 / 0.55) * 100) / 100);
  // Submersible pump + motor + controller, scaled with motor size (2026-10-25
  // audit: a 1.9 kW and a 4.3 kW pump were both $3,500).
  const pumpCost = Math.round((900 + 600 * pumpKW) / 50) * 50;
  const pumpNote = _wdPump?.make_model_suggestion
    ? `${_wdPump.make_model_suggestion} — ~${pumpKW.toFixed(2)} kW, ${pumpHead}m TDH. Budgetary placeholder only; final pump model, duty point and motor rating are selected after the constant-rate pump test confirms sustainable yield, dynamic water level and TDH.`
    : `${yieldVal > 5 ? 'Submersible (high capacity)' : 'Submersible (standard)'}, ~${pumpKW.toFixed(2)} kW, ${pumpHead}m head`;
  const installCost = Math.round(pumpCost * 0.6);
  // AUDIT FIX (2026-07-16, water engineer): when the well-design engine selects
  // a HAND PUMP (correct at very low yields), the system needs NO solar array —
  // the old model billed an Afridev hand pump AND a 1 kW solar power system in
  // the same BOQ, and priced water sales on solar pumping hours.
  const isHandPump = /hand\s*pump|afridev|india\s*mk/i.test(String(_wdPump?.make_model_suggestion ?? pumpNote ?? ''));
  const solarKW = isHandPump ? 0
    : _wdPump?.solarPanels_kW != null
      ? _wdPump.solarPanels_kW
      : Math.max(1, Math.round(pumpKW / 0.85 * 1.2 * 10) / 10);
  const solarCost = Math.round(solarKW * 1500);
  const wqTreatments = result.waterQuality?.treatmentRequired || [];
  // AUDIT FIX (2026-07-16): right-size treatment. A single MINOR aesthetic iron
  // exceedance (0.3-1.0 mg/L) on a household/hand-pump system needs simple
  // aeration + sand filtration (~KSh 40-50k), not a $1,500 plant — the oversized
  // line was 13% of capex and unfairly sank the project NPV.
  const _ironOnly = wqTreatments.length <= 1 && (result.waterQuality?.iron ?? 0) > 0.3;
  const _ironMinor = _ironOnly && (result.waterQuality?.iron ?? 0) <= 1.0;
  // Salty water (TDS >= 1,000 mg/L) needs reverse osmosis, not aeration and
  // filtration (2026-10-25 audit: RO recommended for 60 m3/day while $1.5-2.5k
  // was budgeted). Allowance ~$300 per m3/day of plant, min $6,000; a lab test
  // decides whether it is needed at all.
  const _tds = Number(result.waterQuality?.tds ?? 0);
  const needsRO = _tds >= 1000 && !isHandPump;
  const roDailyM3 = Math.round(yieldVal * 6);
  const wqTreatmentCost = needsRO
    ? Math.max(6000, Math.round((300 * roDailyM3) / 100) * 100)
    : !result.waterQuality?.isPotable
      ? (wqTreatments.length > 2 ? 4000 : _ironMinor && isHandPump ? 400 : _ironOnly ? 1500 : 2500)
      : 0;
  const fluorideVal = result.waterQuality?.fluoride ?? 0;
  const defluoridationCost = fluorideVal > 1.5 ? 2500 : 0;
  const annualDefluoridation = fluorideVal > 1.5 ? 450 : 0;
  // Statutory pre-drilling costs people forget (Kenya Water Resources
  // Regulations): hydrogeological survey report — REQUIRED for motorised
  // boreholes — runs ≈ KSh 40,000–110,000 (July 2026 market), plus WRA
  // groundwater abstraction approval and post-completion water use permit.
  // Budgeted at KSh 75,000 survey (midpoint) + KSh 25,000 approvals.
  const surveyCost = Math.round(75000 / KES_PER_USD);
  const permitCost = Math.round(25000 / KES_PER_USD);
  const subtotalCost = surveyCost + permitCost + drillingCost + mobilisationCost + casingCost + screenCost + pumpCost + installCost + solarCost + wqTreatmentCost + defluoridationCost;
  const isHardRock = /gneiss|granite|basalt|quartzite|dolerite/i.test(soilType) || /rocky/i.test(soilType);
  const contingencyRate = isHardRock ? 0.25 : 0.15;
  const contingency = Math.round(subtotalCost * contingencyRate);
  const totalCost = subtotalCost + contingency;
  const annualMaintenance = Math.round(totalCost * 0.045);
  // ONE annual O&M definition used EVERYWHERE (re-audit #6). The recurring
  // defluoridation media ($/yr) is a real operating cost separate from the 4.5%
  // maintenance rate; omitting it from the "steady net return" but including it
  // in the scenario table produced the $450 discrepancy (-$193 vs -$643).
  const annualOM = annualMaintenance + annualDefluoridation;

  // Realistic revenue model: solar pump ~6 h/day (hand pump: ~4 h/day of
  // realistic manual pumping), ~300 operating days/yr, $0.80/m3 rural tariff,
  // utilization ramp 60/75/85%. AUDIT FIX (2026-07-16): pumping hours must
  // describe the machine actually in the BOQ.
  const pumpHoursPerDay = isHandPump ? 4 : 6;
  const operatingDaysPerYear = 300;
  const waterTariffPerM3 = 0.80;
  const dailyWaterM3 = yieldVal * pumpHoursPerDay;
  const maxAnnualRevenue = Math.round(dailyWaterM3 * operatingDaysPerYear * waterTariffPerM3);
  const yr1Utilization = 0.60, yr2Utilization = 0.75, yr3PlusUtilization = 0.85;
  const yr1Revenue = Math.round(maxAnnualRevenue * yr1Utilization);
  const yr3Revenue = Math.round(maxAnnualRevenue * yr3PlusUtilization);
  const baseAnnualRevenue = yr3Revenue;
  const netAnnual = baseAnnualRevenue - annualOM;

  const projectYears = 20;
  const cashFlows: number[] = [-totalCost];
  for (let t = 1; t <= projectYears; t++) {
    const util = t === 1 ? yr1Utilization : t === 2 ? yr2Utilization : yr3PlusUtilization;
    cashFlows.push(Math.round(maxAnnualRevenue * util) - annualOM);
  }
  const npvAt = (rate: number) => {
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) npv += cashFlows[t] / Math.pow(1 + rate, t);
    return npv;
  };
  const npvLowBound = npvAt(-0.5);
  const npvHighBound = npvAt(3.0);
  let irr: number;
  if (npvLowBound <= 0 && npvHighBound <= 0) {
    irr = -999;
  } else if (npvLowBound > 0 && npvHighBound > 0) {
    irr = 999;
  } else {
    let irrLow = -0.5, irrHigh = 3.0;
    for (let iter = 0; iter < 100; iter++) {
      const mid = (irrLow + irrHigh) / 2;
      if (npvAt(mid) > 0) irrLow = mid; else irrHigh = mid;
      if (Math.abs(irrHigh - irrLow) < 0.0001) break;
    }
    irr = Math.round(((irrLow + irrHigh) / 2) * 100);
  }
  let cumCF = -totalCost;
  let paybackMonths = -1;
  for (let t = 1; t <= projectYears; t++) {
    cumCF += cashFlows[t];
    if (cumCF >= 0) {
      const prevCum = cumCF - cashFlows[t];
      const monthsInYear = Math.round(((-prevCum) / cashFlows[t]) * 12);
      paybackMonths = (t - 1) * 12 + monthsInYear;
      break;
    }
  }
  const discountRate = 0.10;
  let npv10 = 0;
  for (let t = 0; t < cashFlows.length; t++) npv10 += cashFlows[t] / Math.pow(1 + discountRate, t);
  const npv10Rounded = Math.round(npv10);

  return {
    depthVal, yieldVal, soilType, cpm, drillingCost, mobilisationCost, casingCost, casingNote, blindCasingLen,
    screenLength, screenCost, screenNote, pumpKW, pumpHead, pumpCost, pumpNote,
    installCost, solarKW, solarCost, isHandPump, wqTreatmentCost, needsRO, roDailyM3, fluorideVal,
    defluoridationCost, annualDefluoridation, subtotalCost, isHardRock,
    contingencyRate, contingency, totalCost, annualMaintenance, annualOM,
    pumpHoursPerDay, operatingDaysPerYear, waterTariffPerM3, dailyWaterM3,
    maxAnnualRevenue, yr1Utilization, yr2Utilization, yr3PlusUtilization,
    yr1Revenue, yr3Revenue, baseAnnualRevenue, netAnnual, cashFlows,
    irr, paybackMonths, npv10Rounded,
    // Kenya market calibration (July 2026)
    drillMethod, surveyCost, permitCost,
    kesPerUsd: KES_PER_USD,
    kes: fmtKESm,
    cpmKES: kesRound(cpm),
  };
}
