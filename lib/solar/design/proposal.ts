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
import { validateStrings, checkCable, checkBattery, generatorConnectionChecks, type Module, type Inverter, type Battery, type ArrayDesign, type SiteTemps, type CableRun, type Check } from './validate';
import type { LibraryEntry } from './datasheet';
import type { HourlyResult } from './hourly';
import type { HybridResult } from './hybrid';
import { proposalRevisionHash, verifyApproval, TYPED_APPROVAL_IGNORED_REASON, type ApprovalVerifier, type VerifiedApproval } from './proposalApproval';
import { buildSld, type SldConnections, type SldModel } from './sld';
import { horizonErrors, type ShadingSummary } from './shading';

export const PROPOSAL_ENGINE_VERSION = 'solar-proposal 1.2.0 (2026-11-25, single-line diagram and horizon shading)';

export interface Sourced { value: number; source: string }
export interface PricedLine { item: string; model: string; quantity: number; unit: string; rate: { valueKes: number; source: string; date: string } | null }
export interface ProposalInput {
  reference: string;
  client: { name: string; siteAddress: string; lat: number; lon: number };
  module: LibraryEntry<Module>; inverter: LibraryEntry<Inverter>; battery?: { entry: LibraryEntry<Battery>; units: number; requiredUsableAcKwh: number };
  design: ArrayDesign; inverterCount: number; temps: SiteTemps & { source: string };
  cables: CableRun[];
  /** Grid / generator connection for the single-line diagram; absent = not stated (shown as to be specified by the engineer). */
  connections?: SldConnections;
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
    /**
     * Component replacements over the project life (P1-B §2 Finance, REQ-06):
     * QUOTED costs only, each with its source and date, charged in the year
     * given at the quoted price (not escalated). Nothing is assumed: with no
     * entry, no replacement is costed and the proposal says so.
     */
    replacements?: Array<{ item: string; year: number; costKes: number; source: string; date: string }>;
  };
  /** Server-produced only (see proposalApproval.ts); never taken from a client request. */
  verifiedApproval?: VerifiedApproval;
}

export interface CashflowYear { year: number; energyKwh: number; savingsKes: number; omKes: number; replacementKes: number; netKes: number; cumulativeKes: number }
/** One-at-a-time sensitivity of the financial result (REQ-17). */
export interface SensitivityRow { variable: 'tariff' | 'installed cost' | 'energy yield'; changePct: number; npvKes: number; irrPct: number | null; simplePaybackYears: number | null }
/** The step used for the sensitivity: a chosen ± step, stated on every output; not a forecast. */
export const SENSITIVITY_STEP_PCT = 10;
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
  finance: null | { npvKes: number; irrPct: number | null; simplePaybackYears: number | null; lcoeKesPerKwh: number; cashflows: CashflowYear[]; sensitivity: { stepPct: number; rows: SensitivityRow[]; note: string } };
  /** Single-line diagram model (sld.ts): the screen SVG and the PDF/Excel exports are all drawn from it. */
  sld: SldModel;
  /** Horizon shading from the production simulation (shading.ts), or null when no horizon was entered. */
  shading: ShadingSummary | null;
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
  const c = i.connections;
  if (c !== undefined && (typeof c !== 'object' || c === null || ![true, false, null].includes(c.grid) || ![true, false, null].includes(c.generator)
    || (c.generatorRatedKw !== undefined && !(Number.isFinite(c.generatorRatedKw) && c.generatorRatedKw > 0))
    || (c.generatorMinSiteLoadKw !== undefined && !(Number.isFinite(c.generatorMinSiteLoadKw) && c.generatorMinSiteLoadKw >= 0))
    || (c.generatorOemMinLoadPct !== undefined && !(Number.isFinite(c.generatorOemMinLoadPct) && c.generatorOemMinLoadPct >= 0 && c.generatorOemMinLoadPct <= 100))
    || (c.pvCanBackfeedGenerator !== undefined && ![true, false, null].includes(c.pvCanBackfeedGenerator)))) throw new Error('connections must be { grid: true | false | null, generator: true | false | null, generatorRatedKw?: positive kW, generatorMinSiteLoadKw?: kW ≥ 0, generatorOemMinLoadPct?: 0–100, pvCanBackfeedGenerator?: true | false | null }');
  const shading = i.production.shading ?? null;
  if (shading) {
    const he = horizonErrors(shading.horizon);
    if (he.length) throw new Error(`Horizon shading: ${he.join('; ')}`);
    if (!Array.isArray(shading.monthly) || shading.monthly.length !== 12) throw new Error('Horizon shading: 12 monthly results are required');
    const pcts = [shading.annual?.beamLossPct, shading.annual?.energyLossPct, ...shading.monthly.flatMap((m) => [m.beamLossPct, m.poaLossPct, m.energyLossPct])];
    if (pcts.some((x) => x !== null && !(typeof x === 'number' && x >= 0 && x <= 100))) throw new Error('Horizon shading: loss percentages must be 0–100 %');
    if (Math.abs(shading.annual.shadedAnnualKwh - i.production.annualKwh) > 1) throw new Error('Horizon shading: the shaded annual energy does not match the production result (they must come from the same simulation)');
  }
  const exportTariff = f.exportTariffKesPerKwh ? need('Export tariff (KES/kWh)', f.exportTariffKesPerKwh, 0, 200) : 0;
  const replacements = f.replacements ?? [];
  if (!Array.isArray(replacements)) throw new Error('finance.replacements must be a list');
  for (const r of replacements) {
    if (!r || typeof r !== 'object' || !String(r.item ?? '').trim()) throw new Error('Each replacement needs an item name');
    if (!(Number.isInteger(r.year) && r.year >= 1 && r.year <= f.lifetimeYears)) throw new Error(`Replacement "${r.item}": year must be a whole year 1–${f.lifetimeYears}`);
    if (!(Number.isFinite(r.costKes) && r.costKes >= 0)) throw new Error(`Replacement "${r.item}": cost must be a number of KES ≥ 0`);
    if (!String(r.source ?? '').trim() || Number.isNaN(Date.parse(String(r.date)))) throw new Error(`Replacement "${r.item}": a quoted cost needs its source and date`);
  }
  const replacementInYear = (y: number) => replacements.filter((r) => r.year === y).reduce((a, r) => a + r.costKes, 0);

  // 1. Design checks
  const str = validateStrings(i.module.data, i.inverter.data, i.design, i.temps);
  const checks: Check[] = [...str.checks];
  if (str.errors.length) reasons.push(...str.errors.map((e) => `Design: ${e}`));
  for (const c of i.cables) { const r = checkCable(c); checks.push(...r.checks); reasons.push(...r.errors.map((e) => `Cable ${c.name}: ${e}`)); }
  if (i.battery) { const r = checkBattery(i.battery.entry.data, i.inverter.data, i.battery.requiredUsableAcKwh, i.battery.units); checks.push(...r.checks); reasons.push(...r.errors.map((e) => `Battery: ${e}`)); }
  // Generator (CA-32, 2026-11-26): checkGenerator was never run here, so an
  // inverter without a generator-compatibility statement, or PV able to
  // back-feed the generator, gave a valid design. A generator counts as
  // connected when stated, or when the hybrid balance ran one.
  const hybridUsedGenerator = !!i.hybrid && ((i.hybrid.totals.generatorKwh ?? 0) > 0 || (i.hybrid.totals.generatorHours ?? 0) > 0);
  if (c?.generator === true || hybridUsedGenerator) {
    checks.push(...generatorConnectionChecks(i.inverter.data, { generator: true, ...(c ?? {}) }));
    if (hybridUsedGenerator && c?.generator !== true) reasons.push('The hybrid balance runs a generator but the connection data does not say a generator is connected: state it (connections.generator) with its rating and back-feed status');
  }
  const refused = checks.filter((k) => k.verdict === 'REFUSE');
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
    const usefulKwh = useful;
    // One cash-flow model, run for the base case and for each sensitivity case.
    const run = (capexX: number, tariffX: number, yieldX: number) => {
      const cap = capex * capexX;
      const flows = [-cap];
      const cf: CashflowYear[] = [];
      let cum = -cap;
      for (let y = 1; y <= f.lifetimeYears; y++) {
        const k = (1 - deg / 100) ** (y - 1) * yieldX, t = (1 + esc / 100) ** (y - 1);
        const savings = usefulKwh * k * tariff * tariffX * t + exported * k * exportTariff * tariffX;
        const repl = replacementInYear(y);
        const net = savings - om - repl;
        flows.push(net); cum += net;
        cf.push({ year: y, energyKwh: Math.round(y1 * k), savingsKes: Math.round(savings), omKes: Math.round(om), replacementKes: Math.round(repl), netKes: Math.round(net), cumulativeKes: Math.round(cum) });
      }
      const ir = irr(flows);
      return { cap, flows, cf, npvKes: Math.round(npv(disc, flows)), irrPct: ir === null ? null : Math.round(ir * 100) / 100, simplePaybackYears: simplePayback(flows) };
    };
    const b = run(1, 1, 1);
    const pv = (x: number, year: number) => x / (1 + disc / 100) ** year;
    const pvEnergy = b.cf.reduce((s, c) => s + pv(c.energyKwh, c.year), 0);
    const pvOm = b.cf.reduce((s, c) => s + pv(c.omKes, c.year), 0);
    const pvRepl = b.cf.reduce((s, c) => s + pv(c.replacementKes, c.year), 0);
    const st = SENSITIVITY_STEP_PCT / 100;
    const rows: SensitivityRow[] = [];
    for (const [variable, mk] of [['tariff', (d: number) => run(1, 1 + d, 1)], ['installed cost', (d: number) => run(1 + d, 1, 1)], ['energy yield', (d: number) => run(1, 1, 1 + d)]] as const) {
      for (const d of [-st, st]) { const r = mk(d); rows.push({ variable, changePct: Math.round(d * 100), npvKes: r.npvKes, irrPct: r.irrPct, simplePaybackYears: r.simplePaybackYears }); }
    }
    finance = {
      npvKes: b.npvKes, irrPct: b.irrPct,
      simplePaybackYears: b.simplePaybackYears, lcoeKesPerKwh: Math.round(((capex + pvOm + pvRepl) / pvEnergy) * 100) / 100, cashflows: b.cf,
      sensitivity: { stepPct: SENSITIVITY_STEP_PCT, rows, note: `Each variable moved ±${SENSITIVITY_STEP_PCT} % on its own with everything else held: a chosen step to show how the result depends on it, not a forecast.` },
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

  const sld = buildSld({
    reference: i.reference, module: i.module.data, inverter: i.inverter.data, design: i.design, inverterCount: i.inverterCount, temps: i.temps,
    ...(i.battery ? { battery: { data: i.battery.entry.data, units: i.battery.units, requiredUsableAcKwh: i.battery.requiredUsableAcKwh } } : {}),
    // The diagram shows (and checks) the generator the hybrid balance ran, even
    // when the connection data did not state one (CA-32).
    cables: i.cables, ...(i.connections || hybridUsedGenerator ? { connections: hybridUsedGenerator && i.connections?.generator !== true ? { grid: i.connections?.grid ?? null, ...(i.connections ?? {}), generator: true } : i.connections! } : {}),
  });

  return {
    reference: i.reference, status, statusReasons: reasons, revisionHash, approval, client: i.client,
    system: { dcKwp, acKw, modules, strings, inverterCount: i.inverterCount, batteryKwh: i.battery ? i.battery.entry.data.nominalKwh * i.battery.units : null },
    checks, schedule, costing: { lines, capexKes: capex, unpriced },
    energy: { year1Kwh: y1, usefulYear1Kwh: useful === null ? null : Math.round(useful), exportYear1Kwh: Math.round(exported), clippedKwh: i.production.clippedKwh, specificYield: i.production.specificYieldKwhPerKwp, performanceRatio: i.production.performanceRatio, source: i.production.assumptions[0] },
    finance,
    sld, shading,
    disclosures: [
      `Energy is a simulation (${i.production.engineVersion}) using ${i.production.assumptions[0]} It is not a guarantee. Year-to-year weather alone commonly moves annual yield by several per cent; regional weather data are coarser than the site.`,
      'The simulation agrees with pvlib on identical inputs; it has not yet been compared with measured output of installed EmersonEIMS systems.',
      'Shading, soiling and the roof\'s real temperature are only as good as the losses entered; a site survey confirms them.',
      'Prices are those listed with their dated sources; they change, and the proposal is valid only while they hold.',
      replacements.length
        ? `Component replacements in the cash flow (quoted, not escalated): ${replacements.map((r) => `${r.item} in year ${r.year}, KES ${r.costKes.toLocaleString('en-KE')} (${r.source}, ${r.date})`).join('; ')}.`
        : 'No component replacement costs were entered, so none are in the cash flow. Inverters and batteries are often replaced within the project life: enter quoted costs to include them.',
      'Financial results use the tariff, escalation, discount rate and degradation shown, as given by the customer or datasheet; other assumptions give other results.',
      'Electrical design must be checked and signed by a qualified engineer before installation; this proposal is not a certificate.',
      'The single-line diagram shows only what the design determines; every item marked "to be specified by the engineer" must be completed before construction.',
      ...(shading ? [`Horizon shading: the surveyed horizon (${shading.horizon.source}) blocks direct sunlight and reduces year-1 energy by ${shading.annual.energyLossPct ?? 0} %. Diffuse light is not reduced (the indicative further loss is about ${shading.indicativeDiffuseLossPct ?? 0} %), and near shading close to the modules (row-to-row, parapets, vents) is not modelled.`] : []),
    ],
    versions: [PROPOSAL_ENGINE_VERSION, str.engineVersion, i.production.engineVersion, ...(shading ? [shading.engineVersion] : []), sld.engineVersion, ...(i.hybrid ? [i.hybrid.engineVersion] : [])],
  };
}
