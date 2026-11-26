/**
 * AquaScan pricing policy (management decision C, 2026-11-26; real-project test D2).
 *
 * The cost model priced every client at ONE rate set, the EmersonEIMS signed
 * tender for Baringo County (16 Oct 2026): survey KSh 85,000 and permits
 * KSh 135,000 (KSh 240,000 with NEMA). EmersonEIMS's own private quotation #83
 * (9 Mar 2026) priced the survey at KSh 50,000 and the NEMA + WRMA + county
 * permits at KSh 80,000 as one bundle, so the tool overstated EmersonEIMS's own
 * private price by 69-200% on those lines.
 *
 * Policy:
 *  1. Two pricing categories: private project (default) and government tender.
 *  2. The tender's survey and permit figures apply ONLY under "government tender",
 *     cited to their documented source (TENDER_RATE_SOURCE). Items the tender
 *     does not price read "Use the applicable tender BOQ".
 *  3. Private project: survey and permits read "Request a quotation" unless
 *     EmersonEIMS has entered a verified project quotation for this project.
 *  4. A verified project quotation (amount, reference, date) is stored with the
 *     project's result (result.projectPricing) and applies to that project only.
 *  5. Quotation #83 is kept as a dated reference record (REFERENCE_QUOTATION_83),
 *     never applied to any project automatically and never shown as a rate.
 *  6. Survey, permits, drilling, casing, development and testing stay separate
 *     items; totals sum only priced items and name the items still to quote.
 *  7. A private project never uses the tender's per-item rates (2026-11-26,
 *     management: "Remove the automatic application of government-tender
 *     rates to private customers"). Each line reads "Request a quotation"
 *     unless EmersonEIMS enters a verified project quotation, the user enters
 *     their own indicative rate ("indicative — not a binding offer"), or the
 *     line has its own cited non-tender source (the IRENA solar benchmark).
 *
 * No price in this file is invented: the only amounts are the reference
 * record's own figures, copied from the quotation.
 */
import { EIMS_RATES_KES } from './costModel';

export type PricingCategory = 'private' | 'government_tender';

export const PRICING_CATEGORY_LABEL: Record<PricingCategory, string> = {
  private: 'Private project',
  government_tender: 'Government tender',
};

/** The separate cost items a quotation can price. */
export const COST_ITEMS = [
  'survey', 'permits', 'drilling', 'mobilisation', 'casing', 'screen',
  'gravelPack', 'development', 'testPumping', 'labTest', 'capFinishing',
  'pump', 'installation', 'solar', 'treatment', 'defluoridation',
] as const;
export type CostItemKey = typeof COST_ITEMS[number];

export const COST_ITEM_LABEL: Record<CostItemKey, string> = {
  survey: 'Hydrogeological survey (required)',
  permits: 'Permits and approvals: WRA drilling permit, abstraction, county, NEMA',
  drilling: 'Drilling',
  mobilisation: 'Mobilisation',
  casing: 'Blind casing',
  screen: 'Well screen',
  gravelPack: 'Gravel pack',
  development: 'Borehole development',
  testPumping: 'Test pumping',
  labTest: 'Laboratory water test',
  capFinishing: 'Cap and site finishing',
  pump: 'Pump and motor',
  installation: 'Installation and rising main',
  solar: 'Solar pump power',
  treatment: 'Water treatment',
  defluoridation: 'Defluoridation',
};

/** The wording of each price state, the same on the screen and in every export. */
export const PRICE_STATE = {
  REQUEST: 'Request a quotation',
  TENDER_BOQ: 'Use the applicable tender BOQ',
  VERIFIED: 'verified project quotation',
  INDICATIVE: 'indicative — not a binding offer',
  TENDER: 'government tender rate',
} as const;

export type PriceState = 'verified' | 'tender' | 'indicative' | 'request';

/** The tender figures and where their source and applicability are documented in this repository. */
export const TENDER_RATE_SOURCE =
  `${EIMS_RATES_KES.source} (owner instruction 2026-11-05; recorded in external/borehole-ai-engine/src/costModel.ts EIMS_RATES_KES, commit 9d5c6c13, docs/audit/CHANGELOG.md). Applies to government tender work; check against the applicable tender BOQ`;

export interface VerifiedQuotation {
  item: CostItemKey;
  amountKES: number;
  reference: string;
  /** ISO date of the quotation, YYYY-MM-DD. */
  date: string;
  /** A verified EmersonEIMS quotation, or the user's own indicative rate. */
  label: 'verified project quotation' | 'indicative rate entered by the user';
}

export const ENTRY_LABEL = { verified: 'verified project quotation', indicative: 'indicative rate entered by the user' } as const;

export interface ProjectPricing {
  category: PricingCategory;
  quotations: VerifiedQuotation[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Checks one quotation entry; returns the clean record or the reason it is refused. */
export function validateQuotation(input: { item?: unknown; amountKES?: unknown; reference?: unknown; date?: unknown; label?: unknown }):
  { ok: true; value: VerifiedQuotation } | { ok: false; error: string } {
  const item = String(input.item ?? '') as CostItemKey;
  if (!(COST_ITEMS as readonly string[]).includes(item)) return { ok: false, error: 'Choose the cost item the quotation prices.' };
  const amount = typeof input.amountKES === 'number' ? input.amountKES : Number(String(input.amountKES ?? '').replace(/[,\s]/g, ''));
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: 'Enter the quoted amount in KSh (a number above 0).' };
  const reference = String(input.reference ?? '').trim();
  if (!reference) return { ok: false, error: 'Enter the quotation reference (for example the estimate number).' };
  const date = String(input.date ?? '').trim();
  if (!ISO_DATE.test(date) || Number.isNaN(Date.parse(date))) return { ok: false, error: 'Enter the quotation date (YYYY-MM-DD).' };
  const label = input.label === ENTRY_LABEL.indicative ? ENTRY_LABEL.indicative : ENTRY_LABEL.verified;
  return { ok: true, value: { item, amountKES: Math.round(amount), reference: reference.slice(0, 120), date, label } };
}

/** The pricing stored with this project's result; default: private project, no quotations. */
export function projectPricingOf(result: unknown): ProjectPricing {
  const p = (result as any)?.projectPricing;
  const category: PricingCategory = p?.category === 'government_tender' ? 'government_tender' : 'private';
  const quotations: VerifiedQuotation[] = [];
  for (const q of Array.isArray(p?.quotations) ? p.quotations : []) {
    const v = validateQuotation(q ?? {});
    if (v.ok) quotations.push(v.value);
  }
  return { category, quotations };
}

/** The latest verified quotation entered for an item of THIS project, if any. */
export function quotationFor(pricing: ProjectPricing, item: CostItemKey): VerifiedQuotation | null {
  const qs = pricing.quotations.filter((q) => q.item === item);
  return qs.length ? qs[qs.length - 1] : null;
}

export const fmtKES = (kes: number) => `KSh ${Math.round(kes).toLocaleString('en-KE')}`;

/** The basis text of a verified quotation line. */
export const quotationBasis = (q: VerifiedQuotation) => q.label === ENTRY_LABEL.indicative
  ? `${PRICE_STATE.INDICATIVE}: rate entered by the user (${q.reference}, dated ${q.date}). Applies to this project only`
  : `${PRICE_STATE.VERIFIED}: ${q.reference}, dated ${q.date}. Applies to this project only`;

/**
 * Quotation #83 (management decision C5): a dated, project-specific reference
 * record from EmersonEIMS's own estimate. Client details are not kept here.
 * It is never applied to a project and never used as a rate.
 */
export const REFERENCE_QUOTATION_83 = {
  reference: 'Project quotation #83 (private client)',
  date: '2026-03-09',
  dateAsPrinted: '3/9/2026',
  lines: [
    { item: 'survey' as CostItemKey, description: 'Hydrogeological survey', amountKES: 50000 },
    { item: 'permits' as CostItemKey, description: 'NEMA, WRMA and county permits (one bundle)', amountKES: 80000 },
  ],
  vatNote: 'before VAT, as quoted',
} as const;

/** The one sentence that shows quotation #83: a historical record, not a market price or statutory fee. */
export const REFERENCE_QUOTATION_TEXT =
  `Reference: one verified 2026 private-project quotation (${REFERENCE_QUOTATION_83.reference}, dated ${REFERENCE_QUOTATION_83.date}): `
  + REFERENCE_QUOTATION_83.lines.map((l) => `${l.description} ${fmtKES(l.amountKES)}`).join('; ')
  + `, ${REFERENCE_QUOTATION_83.vatNote}. A historical quotation for that project only: not a rate, not a market price or statutory fee, and not applied to this project. The KSh 80,000 of quotation #83 is its NEMA + WRMA + county permits bundle, a different charge from the tender's WRA drilling permit fee of the same amount.`;
