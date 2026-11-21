/**
 * Solar Genius Pro: design-to-proposal (P1, 2026-11-20).
 *
 * Builds a technical and commercial proposal from parts that already exist:
 * - design checks (validate.ts: strings, cables, battery);
 * - datasheet entries (datasheet.ts);
 * - the hourly production simulation (hourly.ts) and, optionally, the hybrid
 *   balance (hybrid.ts);
 * - a priced bill of materials and the customer's own tariff.
 *
 * Rules:
 * - Any REFUSE in the design checks blocks the proposal (status REFUSED).
 * - Every price needs a dated source. With any item unpriced, there is no
 *   total and no financial result (status DRAFT, "rate required").
 * - Unverified datasheets keep the proposal at DRAFT.
 * - A proposal is FOR ISSUE only with a VerifiedApproval that the server's
 *   verifier accepts: valid HMAC signature, reviewer in the authorised-reviewer
 *   registry, and approved revisionHash equal to this input's revisionHash
 *   (proposalApproval.ts). A typed name never counts. Without a verifier (no
 *   accounts or registry yet) every proposal stays DRAFT. The engine never
 *   approves on its own.
 * - Financial inputs (tariff, escalation, discount rate, degradation, O&M) are
 *   the designer's, each with a source. Nothing is assumed.
 * - Uncertainty disclosures are always included.
 */
import { validateStrings, checkCable, checkBattery, type Module, type Inverter, type Battery, type ArrayDesign, type SiteTemps, type CableRun, type Check } from './validate';
import type { LibraryEntry } from './datasheet';
import type { HourlyResult } from './hourly';
import type { HybridResult } from './hybrid';
import { proposalRevisionHash, verifyApproval, TYPED_APPROVAL_IGNORED_REASON, type ApprovalVerifier, type VerifiedApproval } from './proposalApproval';

export const PROPOSAL_ENGINE_VERSION = 'solar-proposal 1.1.0 (2026-11-21, approval lock)';

export interface Sourced { value: number; source: string }
export interface PricedLine { item: string; model: string; quantity: number; unit: string; rate: { valueKes: number; source: string; date: string } | null }
export interface ProposalInput {
  reference: string;
  client: { name: string; siteAddress: string; lat: number; lon: number };
  module: LibraryEntry<Module>; inverter: LibraryEntry<Inverter>; battery?: { entry: LibraryEntry<Battery>; units: number; requiredUsableAcKwh: number };
  design: ArrayDesign; inverterCount: number; temps: SiteTemps & { source: string };
  cables: CableRun[];
  production: HourlyResult;
  hybrid?: HybridResult;
  bom: PricedLine[];
  finance: {
    tariffKesPerKwh: Sourced;            // the customer's current tariff (bill or tariff schedule)
    exportTariffKesPerKwh?: Sourced;     // only if a net-metering/export agreement exists
    selfConsumedFraction?: Sourced;      // when no hybrid balance is supplied: share of PV used on site
    tariffEscalationPct: Sourced;
    discountRatePct: Sourced;
    degradationPctPerYear: Sourced;      // module datasheet warranty
    omKesPerYear: Sourced;
    lifetimeYears: number;
  };
  /** Server-produced only (see proposalApproval.ts); never taken from a client request. */
  verifiedApproval?: VerifiedApproval;
}

export interface CashflowYear { year: number; energyKwh: number; savingsKes: number; omKes: number; netKes: number; cumulativeKes: number }
export interface Proposal {
  reference: string; status: 'REFUSED' | 'DRAFT' | 'FOR ISSUE'; statusReasons: string[];
  /** SHA-256 of the canonical input (approval excluded): the revision an approval is locked to. */
  revisionHash: string;
  /** Set only when status is FOR ISSUE through a verified approval. */
  approval: null | { reviewerId: string; reviewerName: string; registration: string; approvedAt: string };
  client: ProposalInput['client'];
  system: { dcKwp: number; acKw: number; modules: number; strings: number; inverterCount: number; batteryKwh: number | null };
  checks: Check[];
  schedule: Array<{ item: string; model: string; quantity: number; unit: string; datasheet?: string; verified?: boolean }>;
  costing: { lines: Array<PricedLine & { amountKes: number | null }>; capexKes: number | null; unpriced: string[] };
  energy: { year1Kwh: number; usefulYear1Kwh: number | null; exportYear1Kwh: number; clippedKwh: number; specificYield: number; performanceRatio: number; source: string };
  finance: null | { npvKes: number; irrPct: number | null; simplePaybackYears: number | null; lcoeKesPerKwh: number; cashflows: CashflowYear[] };
  disclosures: string[];
  versions: string[];
}

// ---------------------------------------------------------------- finance
export function npv(ratePct: number, flows: number[]): number {
  const r = ratePct / 100;
  return flows.reduce((s, f, t) => s + f / (1 + r) ** t, 0);
}
/** IRR by bisection on [−99 %, 1000 %]; null when NPV does not change sign (no unique IRR). */
export function irr(flows: number[]): number | null {
  let lo = -99, hi = 1000;
  let flo = npv(lo, flows), fhi = npv(hi, flows);
  if (!(Number.isFinite(flo) && Number.isFinite(fhi)) || flo * fhi > 0) return null;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2, fm = npv(mid, flows);
    if (Math.abs(fm) < 1e-6) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}
/** Years until the cumulative cash flow turns non-negative, interpolated within the year; null if never. */
export function simplePayback(flows: number[]): number | null {
  let cum = flows[0];
  for (let t = 1; t < flows.length; t++) {
    const prev = cum; cum += flows[t];
    if (cum >= 0 && flows[t] > 0) return Math.round((t - 1 + -prev / flows[t]) * 100) / 100;
  }
  return null;
}

const need = (name: string, s: Sourced | undefined, min: number, max: number) => {
  if (!s || !Number.isFinite(s.value) || !s.source?.trim()) throw new Error(`${name} with its source is required`);
  if (!(s.value >= min && s.value <= max)) throw new Error(`${name} = ${s.value} is outside ${min}–${max}`);
  return s.value;
};

/**
 * 2026-11-21 audit (M1): a "verified" status sent by the client is not
 * trusted on its own. The provenance must name a second person (different
 * from the person who entered it, case-insensitive) with a valid date. Names
 * are typed, so this is a second-person check, not an authenticated one.
 */
export function secondPersonChecked<T>(e: LibraryEntry<T>): boolean {
  const p = e.provenance;
  const by = (p?.verifiedBy || '').trim().toLowerCase();
  const entered = (p?.enteredBy || '').trim().toLowerCase();
  return e.status === 'verified' && by !== '' && by !== entered && !Number.isNaN(Date.parse(p?.verifiedOn || ''));
}

export function buildProposal(i: ProposalInput, verifier: ApprovalVerifier | null = null): Proposal {
  const reasons: string[] = [];
  const f = i.finance;
  const tariff = need('Tariff (KES/kWh)', f.tariffKesPerKwh, 1, 200);
  const esc = need('Tariff escalation (%/yr)', f.tariffEscalationPct, -10, 30);
  const disc = need('Discount rate (%)', f.discountRatePct, 0, 50);
  const deg = need('Degradation (%/yr)', f.degradationPctPerYear, 0, 3);
  const om = need('O&M (KES/yr)', f.omKesPerYear, 0, 1e9);
  if (!(Number.isInteger(f.lifetimeYears) && f.lifetimeYears >= 5 && f.lifetimeYears <= 30)) throw new Error('Lifetime must be 5–30 whole years');
  if (!i.temps.source?.trim()) throw new Error('Source of the site temperatures is required');
  const exportTariff = f.exportTariffKesPerKwh ? need('Export tariff (KES/kWh)', f.exportTariffKesPerKwh, 0, 200) : 0;

  // 1. Design checks
  const str = validateStrings(i.module.data, i.inverter.data, i.design, i.temps);
  const checks: Check[] = [...str.checks];
  if (str.errors.length) reasons.push(...str.errors.map((e) => `Design: ${e}`));
  for (const c of i.cables) { const r = checkCable(c); checks.push(...r.checks); reasons.push(...r.errors.map((e) => `Cable ${c.name}: ${e}`)); }
  if (i.battery) { const r = checkBattery(i.battery.entry.data, i.inverter.data, i.battery.requiredUsableAcKwh, i.battery.units); checks.push(...r.checks); reasons.push(...r.errors.map((e) => `Battery: ${e}`)); }
  const refused = checks.filter((c) => c.verdict === 'REFUSE');
  refused.forEach((c) => reasons.push(`REFUSE: ${c.title} (${c.value} ${c.unit} vs limit ${c.limit} ${c.unit})`));

  // 2. Schedule and costing
  const strings = i.design.stringsPerMppt.reduce((a, b) => a + b, 0) * i.inverterCount;
  const modules = strings * i.design.modulesPerString;
  const dcKwp = Math.round(modules * i.module.data.pmaxW) / 1000;
  const acKw = i.inverter.data.acKw * i.inverterCount;
  const schedule: Proposal['schedule'] = [
    { item: 'PV module', model: i.module.data.model, quantity: modules, unit: 'No', datasheet: i.module.data.datasheet, verified: secondPersonChecked(i.module) },
    { item: 'Inverter', model: i.inverter.data.model, quantity: i.inverterCount, unit: 'No', datasheet: i.inverter.data.datasheet, verified: secondPersonChecked(i.inverter) },
    ...(i.battery ? [{ item: 'Battery', model: i.battery.entry.data.model, quantity: i.battery.units, unit: 'No', datasheet: i.battery.entry.data.datasheet, verified: secondPersonChecked(i.battery.entry) }] : []),
    ...i.bom.map((b) => ({ item: b.item, model: b.model, quantity: b.quantity, unit: b.unit })),
  ];
  for (const s of schedule) if (s.verified === false) reasons.push(`Datasheet not verified by a second person: ${s.model}`);
  const lines = i.bom.map((b) => {
    if (b.rate && (!b.rate.source?.trim() || Number.isNaN(Date.parse(b.rate.date)) || !(b.rate.valueKes >= 0))) throw new Error(`${b.item}: a price needs a value, source and date`);
    return { ...b, amountKes: b.rate ? Math.round(b.rate.valueKes * b.quantity * 100) / 100 : null };
  });
  const unpriced = lines.filter((l) => l.amountKes === null).map((l) => l.item);
  if (unpriced.length) reasons.push(`Rate required: ${unpriced.join(', ')}`);
  const capex = unpriced.length ? null : Math.round(lines.reduce((s, l) => s + (l.amountKes as number), 0) * 100) / 100;

  // 3. Energy
  const y1 = i.production.annualKwh;
  let useful: number | null = null, exported = 0;
  if (i.hybrid) {
    const t = i.hybrid.totals;
    const pvShareOfBattery = t.pvToBatteryKwh / Math.max(1e-9, t.pvToBatteryKwh + t.generatorToBatteryKwh);
    useful = t.pvToLoadKwh + t.batteryToLoadKwh * pvShareOfBattery;
    exported = t.gridExportKwh;
  } else if (f.selfConsumedFraction) {
    const sc = need('Self-consumed fraction', f.selfConsumedFraction, 0, 1);
    useful = y1 * sc; exported = f.exportTariffKesPerKwh ? y1 - useful : 0;
  } else {
    reasons.push('Self-consumption unknown: give a load profile (hybrid balance) or a sourced self-consumed fraction');
  }

  // 4. Finance (only with a complete price and known self-consumption)
  let finance: Proposal['finance'] = null;
  if (capex !== null && useful !== null) {
    const flows = [-capex];
    const cf: CashflowYear[] = [];
    let cum = -capex;
    for (let y = 1; y <= f.lifetimeYears; y++) {
      const k = (1 - deg / 100) ** (y - 1), t = (1 + esc / 100) ** (y - 1);
      const savings = useful * k * tariff * t + exported * k * exportTariff;
      const net = savings - om;
      flows.push(net); cum += net;
      cf.push({ year: y, energyKwh: Math.round(y1 * k), savingsKes: Math.round(savings), omKes: Math.round(om), netKes: Math.round(net), cumulativeKes: Math.round(cum) });
    }
    const pvEnergy = cf.reduce((s, c) => s + c.energyKwh / (1 + disc / 100) ** c.year, 0);
    const pvOm = cf.reduce((s, c) => s + c.omKes / (1 + disc / 100) ** c.year, 0);
    const ir = irr(flows);
    finance = {
      npvKes: Math.round(npv(disc, flows)), irrPct: ir === null ? null : Math.round(ir * 100) / 100,
      simplePaybackYears: simplePayback(flows), lcoeKesPerKwh: Math.round(((capex + pvOm) / pvEnergy) * 100) / 100, cashflows: cf,
    };
  }

  // 5. Status
  const revisionHash = proposalRevisionHash(i);
  if ((i as { approval?: unknown }).approval !== undefined) reasons.push(TYPED_APPROVAL_IGNORED_REASON);
  const approvalCheck = verifyApproval(i.verifiedApproval, revisionHash, verifier);
  let status: Proposal['status'] = 'FOR ISSUE';
  if (refused.length || str.errors.length) status = 'REFUSED';
  else if (reasons.length || !approvalCheck.ok) status = 'DRAFT';
  if (status !== 'REFUSED' && !approvalCheck.ok) reasons.push(approvalCheck.reason);
  const approval: Proposal['approval'] = status === 'FOR ISSUE' && approvalCheck.ok
    ? { reviewerId: approvalCheck.reviewer.reviewerId, reviewerName: approvalCheck.reviewer.name, registration: approvalCheck.reviewer.registration, approvedAt: approvalCheck.approval.approvedAt }
    : null;

  return {
    reference: i.reference, status, statusReasons: reasons, revisionHash, approval, client: i.client,
    system: { dcKwp, acKw, modules, strings, inverterCount: i.inverterCount, batteryKwh: i.battery ? i.battery.entry.data.nominalKwh * i.battery.units : null },
    checks, schedule, costing: { lines, capexKes: capex, unpriced },
    energy: { year1Kwh: y1, usefulYear1Kwh: useful === null ? null : Math.round(useful), exportYear1Kwh: Math.round(exported), clippedKwh: i.production.clippedKwh, specificYield: i.production.specificYieldKwhPerKwp, performanceRatio: i.production.performanceRatio, source: i.production.assumptions[0] },
    finance,
    disclosures: [
      `Energy is a simulation (${i.production.engineVersion}) using ${i.production.assumptions[0]} It is not a guarantee. Year-to-year weather alone commonly moves annual yield by several per cent; regional weather data are coarser than the site.`,
      'The simulation agrees with pvlib on identical inputs; it has not yet been compared with measured output of installed EmersonEIMS systems.',
      'Shading, soiling and the roof\'s real temperature are only as good as the losses entered; a site survey confirms them.',
      'Prices are those listed with their dated sources; they change, and the proposal is valid only while they hold.',
      'Financial results use the tariff, escalation, discount rate and degradation shown, as given by the customer or datasheet; other assumptions give other results.',
      'Electrical design must be checked and signed by a qualified engineer before installation; this proposal is not a certificate.',
    ],
    versions: [PROPOSAL_ENGINE_VERSION, str.engineVersion, i.production.engineVersion, ...(i.hybrid ? [i.hybrid.engineVersion] : [])],
  };
}
