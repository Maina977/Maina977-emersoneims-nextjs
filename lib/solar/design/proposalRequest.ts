/**
 * Shape check for POST /api/solar/proposal (P1, 2026-11-20). Only the types
 * and presence of fields are checked here; the engineering and finance rules
 * stay in buildProposal (which throws with its own message).
 */
import type { ProposalInput } from './proposal';

export type ProposalFormat = 'json' | 'xlsx' | 'pdf';

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const isNum = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
const isStr = (x: unknown) => typeof x === 'string';

export function checkProposalRequest(body: unknown): { input: ProposalInput; format: ProposalFormat } | { error: string } {
  if (!isObj(body)) return { error: 'Body must be a JSON object { input, format }' };
  const format = body.format ?? 'json';
  if (format !== 'json' && format !== 'xlsx' && format !== 'pdf') return { error: 'format must be json, xlsx or pdf' };
  const i = body.input;
  if (!isObj(i)) return { error: 'input (ProposalInput) is required' };
  const e: string[] = [];
  if (!isStr(i.reference) || !(i.reference as string).trim()) e.push('reference is required');
  const c = i.client;
  if (!isObj(c) || !isStr(c.name) || !isStr(c.siteAddress) || !isNum(c.lat) || !isNum(c.lon)) e.push('client { name, siteAddress, lat, lon } is required');
  for (const k of ['module', 'inverter'] as const) {
    const en = i[k];
    if (!isObj(en) || !isObj(en.data) || !isObj(en.provenance) || (en.status !== 'verified' && en.status !== 'unverified')) e.push(`${k} must be a datasheet library entry { data, provenance, status }`);
  }
  if (i.battery !== undefined) {
    const b = i.battery;
    if (!isObj(b) || !isObj(b.entry) || !isObj((b.entry as Record<string, unknown>).data) || !isNum(b.units) || !isNum(b.requiredUsableAcKwh)) e.push('battery must be { entry, units, requiredUsableAcKwh }');
  }
  const d = i.design;
  if (!isObj(d) || !isNum(d.modulesPerString) || !Array.isArray(d.stringsPerMppt) || !(d.stringsPerMppt as unknown[]).every(isNum)) e.push('design { modulesPerString, stringsPerMppt[] } is required');
  if (!isNum(i.inverterCount)) e.push('inverterCount must be a number');
  const t = i.temps;
  if (!isObj(t) || !isNum(t.recordLowC) || !isNum(t.maxAmbientC) || !isStr(t.source)) e.push('temps { recordLowC, maxAmbientC, source } is required');
  if (!Array.isArray(i.cables) || !(i.cables as unknown[]).every(isObj)) e.push('cables must be an array (may be empty)');
  const p = i.production;
  if (!isObj(p) || !isNum(p.annualKwh) || !isNum(p.clippedKwh) || !isNum(p.specificYieldKwhPerKwp) || !isNum(p.performanceRatio) || !Array.isArray(p.assumptions) || !isStr(p.engineVersion)) e.push('production (hourly simulation result) is required');
  if (i.hybrid !== undefined && (!isObj(i.hybrid) || !isObj(i.hybrid.totals) || !isStr(i.hybrid.engineVersion))) e.push('hybrid must be a hybrid simulation result');
  if (!Array.isArray(i.bom) || !(i.bom as unknown[]).every((l) => isObj(l) && isStr(l.item) && isStr(l.model) && isNum(l.quantity) && isStr(l.unit) && (l.rate === null || isObj(l.rate)))) e.push('bom must be an array of { item, model, quantity, unit, rate | null }');
  const f = i.finance;
  if (!isObj(f) || !isNum(f.lifetimeYears)) e.push('finance { …, lifetimeYears } is required');
  else for (const k of ['tariffKesPerKwh', 'tariffEscalationPct', 'discountRatePct', 'degradationPctPerYear', 'omKesPerYear', 'exportTariffKesPerKwh', 'selfConsumedFraction']) {
    const s = f[k];
    if (s === undefined && (k === 'exportTariffKesPerKwh' || k === 'selfConsumedFraction')) continue;
    if (!isObj(s) || !isNum(s.value) || !isStr(s.source)) e.push(`finance.${k} must be { value, source }`);
  }
  if (i.approval !== undefined && (!isObj(i.approval) || !isStr(i.approval.engineer) || !isStr(i.approval.registration) || !isStr(i.approval.date))) e.push('approval must be { engineer, registration, date }');
  if (e.length) return { error: `Invalid proposal input: ${e.join('; ')}` };
  return { input: i as unknown as ProposalInput, format };
}

/** Safe file name from the proposal reference. */
export function proposalFileName(reference: string, ext: 'xlsx' | 'pdf'): string {
  const safe = reference.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'proposal';
  return `solar-proposal-${safe}.${ext}`;
}
