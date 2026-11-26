/**
 * Which project-cost lines carry a price, and on what basis (2026-11-22,
 * management priority 6; pricing policy 2026-11-26, management decision C).
 *
 * computeCanonicalEconomics prices every line of a borehole for the planning
 * model. What a customer sees is decided here, one line per separate item:
 *  - "verified project quotation": EmersonEIMS entered a quotation for this
 *    project (amount, reference, date). It applies to this project only.
 *  - "government tender rate": the documented tender rates (TENDER_RATE_SOURCE),
 *    only when the project is priced as a government tender.
 *  - "indicative — not a binding offer": a sourced rate used as a preliminary
 *    figure for a private project (the tender's per-item rates for drilling,
 *    casing, development, testing; the IRENA solar benchmark).
 *  - "Request a quotation" (private) / "Use the applicable tender BOQ" (tender):
 *    no verified or sourced figure. For a private project the survey and the
 *    permits are always here until a verified project quotation is entered:
 *    the tender's survey and permit figures are not a private price.
 * Totals sum only the priced lines (in KSh, to the shilling) and name the rest.
 */
import { EIMS_RATES_KES, KES_PER_USD, drillingCostKES } from './costModel';
import {
  PRICE_STATE, TENDER_RATE_SOURCE, PRICING_CATEGORY_LABEL, COST_ITEM_LABEL, REFERENCE_QUOTATION_TEXT,
  quotationFor, quotationBasis, fmtKES, type CostItemKey, type PriceState, type PricingCategory, type ProjectPricing,
} from './projectPricing';

/** The cost-model figures costSourcing reads (computeCanonicalEconomics supplies them). */
export interface CostInputs {
  surveyCost: number; permitCost: number; permitNote: string; permitKES: number; needsNema?: boolean;
  depthVal: number; drillMethod: string; drillingCost: number; rockType?: string; isHardRock: boolean; rockTypeUnknown?: boolean;
  mobilisationCost: number; casingCost: number; blindCasingLen: number; screenCost: number; gravelTons: number;
  pumpCost: number; installCost: number; solarCost: number; solarKW: number;
  wqTreatmentCost: number; needsRO: boolean; defluoridationCost: number;
  contingencyRate: number; pricing: ProjectPricing;
}
type Eco = CostInputs;

export interface CostLine {
  key: CostItemKey;
  item: string;
  /** USD of a priced line (KSh / KES_PER_USD, rounded); the model allowance when unpriced (not shown). */
  usd: number;
  /** KSh of a priced line, to the shilling; null when not priced. */
  kes: number | null;
  state: PriceState;
  /** What the price column shows when the line is not priced. */
  priceText: string;
  /** Basis of a priced line (null when not priced). */
  source: string | null;
}

export interface CostSourcing {
  category: PricingCategory;
  lines: CostLine[];
  /** Items with no verified or sourced figure: "Request a quotation" / "Use the applicable tender BOQ". */
  quotationItems: string[];
  sourcedSubtotal: number;
  sourcedContingency: number;
  sourcedTotal: number;
  sourcedSubtotalKES: number;
  sourcedContingencyKES: number;
  sourcedTotalKES: number;
  /** True when any priced line is indicative: the total is then indicative too. */
  indicative: boolean;
  totalLabel: string;
  contingencyLabel: string;
  /** Notes that go with the cost table everywhere it is shown. */
  notes: string[];
}

/** Kept for callers that name the unpriced state; the policy wording since 2026-11-26. */
export const QUOTATION_TEXT = PRICE_STATE.REQUEST;

const TENDER = EIMS_RATES_KES.source;
const INDICATIVE_TENDER = `${PRICE_STATE.INDICATIVE}: ${TENDER} rate used as a preliminary figure, not a private-project quotation`;

export function costSourcing(eco: Eco): CostSourcing {
  const pricing = eco.pricing;
  const gov = pricing.category === 'government_tender';
  const R = EIMS_RATES_KES;
  const mobFloorUSD = Math.round(R.mobilisation / KES_PER_USD);
  const hard = eco.isHardRock;

  // The tender's own figure for each item it prices (KSh), with its detail.
  const tenderKES: Partial<Record<CostItemKey, { kes: number; detail: string }>> = {
    survey: { kes: R.hydrogeologicalSurvey, detail: `survey ${fmtKES(R.hydrogeologicalSurvey)}` },
    permits: { kes: eco.permitKES, detail: eco.permitNote.replace(/\s*\([^)]*\)\s*$/, '') },
    drilling: {
      kes: drillingCostKES(eco.depthVal, eco.rockType),
      detail: hard ? `${eco.depthVal} m x ${fmtKES(R.drillHardRockPerM)}/m (hard-rock rate; geological finding: rock classification "${eco.rockType}")` : `${eco.depthVal} m at the banded rates ${R.drillSoftBandsPerM.map(([to, r]) => `${fmtKES(r)}/m${Number.isFinite(to) ? ` to ${to} m` : ' beyond'}`).join(', ')}${eco.rockTypeUnknown ? ' (pricing assumption: no rock type classified)' : ` (geological finding: rock classification "${eco.rockType}")`}`,
    },
    ...(eco.mobilisationCost > 0 && eco.mobilisationCost === mobFloorUSD ? { mobilisation: { kes: R.mobilisation, detail: `mobilisation ${fmtKES(R.mobilisation)} (beyond 100 km)` } } : {}),
    casing: { kes: eco.blindCasingLen * R.steelCasing6inPerM, detail: `${eco.blindCasingLen} m x ${fmtKES(R.steelCasing6inPerM)}/m (6-inch steel)` },
    gravelPack: { kes: eco.gravelTons * R.gravelPackPerTon, detail: `${eco.gravelTons} t x ${fmtKES(R.gravelPackPerTon)}/t` },
    development: { kes: R.developmentHours * R.developmentPerHour, detail: `${R.developmentHours} h x ${fmtKES(R.developmentPerHour)}/h` },
    testPumping: { kes: R.testPumpingHours * R.testPumpingPerHour, detail: `${R.testPumpingHours} h x ${fmtKES(R.testPumpingPerHour)}/h` },
    labTest: { kes: R.waterQualityLab, detail: `laboratory water test ${fmtKES(R.waterQualityLab)}` },
    capFinishing: { kes: R.capAndSiteFinishing, detail: `cap and site finishing ${fmtKES(R.capAndSiteFinishing)}` },
  };

  const items: { key: CostItemKey; item: string; usd: number; show: boolean }[] = [
    { key: 'survey', item: COST_ITEM_LABEL.survey, usd: eco.surveyCost, show: true },
    { key: 'permits', item: COST_ITEM_LABEL.permits, usd: eco.permitCost, show: true },
    { key: 'drilling', item: `Drilling (${eco.depthVal} m, ${eco.drillMethod})`, usd: eco.drillingCost, show: true },
    { key: 'mobilisation', item: COST_ITEM_LABEL.mobilisation, usd: eco.mobilisationCost, show: eco.mobilisationCost > 0 },
    { key: 'casing', item: COST_ITEM_LABEL.casing, usd: eco.casingCost, show: true },
    { key: 'screen', item: COST_ITEM_LABEL.screen, usd: eco.screenCost, show: true },
    { key: 'gravelPack', item: COST_ITEM_LABEL.gravelPack, usd: 0, show: true },
    { key: 'development', item: COST_ITEM_LABEL.development, usd: 0, show: true },
    { key: 'testPumping', item: `${COST_ITEM_LABEL.testPumping} (24 h constant-rate)`, usd: 0, show: true },
    { key: 'labTest', item: COST_ITEM_LABEL.labTest, usd: 0, show: true },
    { key: 'capFinishing', item: COST_ITEM_LABEL.capFinishing, usd: 0, show: true },
    { key: 'pump', item: COST_ITEM_LABEL.pump, usd: eco.pumpCost, show: true },
    { key: 'installation', item: COST_ITEM_LABEL.installation, usd: eco.installCost, show: true },
    { key: 'solar', item: `${COST_ITEM_LABEL.solar} (${eco.solarKW} kW)`, usd: eco.solarCost, show: eco.solarCost > 0 },
    { key: 'treatment', item: eco.needsRO ? 'Desalination (reverse osmosis)' : COST_ITEM_LABEL.treatment, usd: eco.wqTreatmentCost, show: eco.wqTreatmentCost > 0 },
    { key: 'defluoridation', item: 'Defluoridation (on measured fluoride)', usd: eco.defluoridationCost, show: eco.defluoridationCost > 0 },
  ];

  const lines: CostLine[] = [];
  for (const it of items) {
    const q = quotationFor(pricing, it.key);
    if (!it.show && !q) continue;
    const unpriced = (): CostLine => ({ key: it.key, item: it.item, usd: it.usd, kes: null, state: 'request', priceText: gov ? PRICE_STATE.TENDER_BOQ : PRICE_STATE.REQUEST, source: null });
    const priced = (kes: number, state: PriceState, source: string): CostLine => ({ key: it.key, item: it.item, usd: Math.round(kes / KES_PER_USD), kes, state, priceText: '', source });
    if (q) { lines.push(priced(q.amountKES, 'verified', quotationBasis(q))); continue; }
    const t = tenderKES[it.key];
    if (t) {
      if (gov) lines.push(priced(t.kes, 'tender', `${PRICE_STATE.TENDER}: ${TENDER}: ${t.detail}`));
      else if (it.key === 'survey' || it.key === 'permits') lines.push(unpriced());
      else lines.push(priced(t.kes, 'indicative', `${INDICATIVE_TENDER}: ${t.detail}`));
      continue;
    }
    if (it.key === 'solar') {
      lines.push(priced(Math.round(eco.solarCost * KES_PER_USD), 'indicative', `${PRICE_STATE.INDICATIVE}: IRENA 2023 benchmark, about $1,500/kW installed`));
      continue;
    }
    lines.push(unpriced());
  }

  const priced = lines.filter((l) => l.kes != null);
  const sourcedSubtotalKES = priced.reduce((s, l) => s + (l.kes as number), 0);
  const sourcedContingencyKES = Math.round(sourcedSubtotalKES * eco.contingencyRate);
  const sourcedSubtotal = priced.reduce((s, l) => s + l.usd, 0);
  const sourcedContingency = Math.round(sourcedSubtotal * eco.contingencyRate);
  const quotationItems = lines.filter((l) => l.state === 'request').map((l) => l.item);
  const indicative = priced.some((l) => l.state === 'indicative');
  const rate = Math.round(eco.contingencyRate * 100);
  // 2026-11-26 (management): unknown geology stays unknown. A geological finding
  // names its source; the conservative rate for unknown ground is a pricing
  // assumption and is never presented as hard rock.
  const rockNote = eco.isHardRock ? 'hard rock: geological finding' : eco.rockTypeUnknown ? 'pricing assumption: ground conditions unknown' : 'soft ground: geological finding';
  const groundNote = eco.rockTypeUnknown
    ? groundConditionsUnknownText(rate)
    : `Ground conditions: ${eco.isHardRock ? 'hard rock' : 'soft ground'} (geological finding: rock classification "${eco.rockType}"). Contingency ${rate}% for ${eco.isHardRock ? 'hard rock' : 'soft ground'}, the same classification as the drilling rate.`;
  const notes = [
    `Pricing category: ${PRICING_CATEGORY_LABEL[pricing.category]}.`,
    ...(gov ? [`Government tender rates: ${TENDER_RATE_SOURCE}.`] : [`Survey and permits: ${PRICE_STATE.REQUEST.toLowerCase()} unless a ${PRICE_STATE.VERIFIED} has been entered for this project. Other figures are ${PRICE_STATE.INDICATIVE}.`, REFERENCE_QUOTATION_TEXT]),
    groundNote,
  ];
  return {
    category: pricing.category,
    lines,
    quotationItems,
    sourcedSubtotal,
    sourcedContingency,
    sourcedTotal: sourcedSubtotal + sourcedContingency,
    sourcedSubtotalKES,
    sourcedContingencyKES,
    sourcedTotalKES: sourcedSubtotalKES + sourcedContingencyKES,
    indicative,
    totalLabel: `${quotationItems.length ? 'TOTAL of the priced items' : 'TOTAL'}${indicative ? ` (${PRICE_STATE.INDICATIVE})` : ''}`,
    contingencyLabel: `Contingency (${rate}% of the priced items, ${rockNote})`,
    notes,
  };
}

/** The exact wording when no rock type is classified (management, 2026-11-26). */
export function groundConditionsUnknownText(ratePct: number): string {
  return `Ground conditions: unknown (no geological evidence). Costing uses the conservative hard-rock contingency (${ratePct}%) as a pricing assumption, not a finding.`;
}

/** The display value of a line: the price, or the unpriced state wording. */
export function costLineText(l: CostLine): { usd: string; kes: string; basis: string } {
  if (l.kes == null) {
    return { usd: l.priceText, kes: '—', basis: l.priceText === PRICE_STATE.TENDER_BOQ ? 'The tender rates on file do not price this item: use the applicable tender BOQ' : 'No verified or sourced figure for this project: EmersonEIMS quotes this item' };
  }
  return { usd: `$${l.usd.toLocaleString('en-KE')}`, kes: fmtKES(l.kes), basis: l.source ?? '' };
}
