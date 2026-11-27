/**
 * Shape check for POST /api/solar/proposal (P1, 2026-11-20). Only the types
 * and presence of fields are checked here; the engineering and finance rules
 * stay in buildProposal (which throws with its own message).
 */
import type { ProposalInput } from './proposal';
import { CLIENT_APPROVAL_REJECTED } from './proposalApproval';
import { moduleDataErrors, inverterDataErrors, batteryDataErrors, provenanceErrors } from './datasheet';

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
  // Review of 39fa8535, R2: a non-string generator statement gave "…trim is not a function".
  { const inv = i.inverter; const g = isObj(inv) && isObj(inv.data) ? inv.data.generatorCompatibility : undefined;
    if (g !== undefined && g !== null && !isStr(g)) e.push('inverter.data.generatorCompatibility must be text (the manufacturer statement) or null'); }
  if (i.battery !== undefined) {
    const b = i.battery;
    if (!isObj(b) || !isObj(b.entry) || !isObj((b.entry as Record<string, unknown>).data) || !isNum(b.units) || !isNum(b.requiredUsableAcKwh) || (b.seriesPerString !== undefined && !isNum(b.seriesPerString))) e.push('battery must be { entry, units, requiredUsableAcKwh, seriesPerString? }');
  }
  // Re-review Q6: the datasheet rules the import applies are applied to the
  // entries an API request sends directly (it never runs the import).
  // Final review: provenance as the import requires it (source fields, https link, ISO dates).
  if (isObj(i.module) && isObj(i.module.provenance)) e.push(...provenanceErrors(i.module.provenance, 'module.provenance.'));
  if (isObj(i.inverter) && isObj(i.inverter.provenance)) e.push(...provenanceErrors(i.inverter.provenance, 'inverter.provenance.'));
  if (isObj(i.battery) && isObj(i.battery.entry) && isObj((i.battery.entry as Record<string, unknown>).provenance)) e.push(...provenanceErrors((i.battery.entry as Record<string, unknown>).provenance as Record<string, unknown>, 'battery.provenance.'));
  if (isObj(i.module) && isObj(i.module.data)) e.push(...moduleDataErrors(i.module.data));
  if (isObj(i.inverter) && isObj(i.inverter.data)) e.push(...inverterDataErrors(i.inverter.data));
  if (isObj(i.battery) && isObj(i.battery.entry) && isObj((i.battery.entry as Record<string, unknown>).data)) e.push(...batteryDataErrors((i.battery.entry as Record<string, unknown>).data as Record<string, unknown>));
  if (i.site !== undefined) {
    const st = i.site;
    if (!isObj(st) || !isStr(st.source) || (st.elevationM !== undefined && !isNum(st.elevationM)) || (st.usableAreaM2 !== undefined && !isNum(st.usableAreaM2)) || (st.mounting !== undefined && st.mounting !== 'roof' && st.mounting !== 'ground')) e.push('site must be { elevationM?, mounting?: roof | ground, usableAreaM2?, source }');
    // Review M2: per-field provenance (a) automatic with retrieval date, (b) customer, (c) verified.
    if (isObj(st) && st.provenance !== undefined) {
      const pv = st.provenance;
      if (!isObj(pv)) e.push('site.provenance must be { elevationM?, mounting?, usableAreaM2? }');
      else for (const [k, v] of Object.entries(pv)) {
        if (!['elevationM', 'mounting', 'usableAreaM2'].includes(k)) { e.push(`site.provenance.${k} is not a site field`); continue; }
        if (st[k] === undefined) e.push(`site.provenance.${k} is given but ${k} is not entered`);
        if (!isObj(v) || !['automatic', 'customer', 'verified'].includes(v.category as string) || !isStr(v.source) || !(v.source as string).trim()) e.push(`site.provenance.${k} must be { category: automatic | customer | verified, source, retrievedOn? }`);
        else if ((v.category === 'automatic' && !(isStr(v.retrievedOn) && /^\d{4}-\d{2}-\d{2}/.test(v.retrievedOn as string))) || (v.retrievedOn !== undefined && !(isStr(v.retrievedOn) && !Number.isNaN(Date.parse(v.retrievedOn as string))))) e.push(`site.provenance.${k}: an automatically obtained value needs retrievedOn (YYYY-MM-DD)`);
      }
    }
  }
  if (i.load !== undefined) {
    const l = i.load;
    if (!isObj(l) || !isStr(l.source) || (l.monthlyKwh !== undefined && !(Array.isArray(l.monthlyKwh) && (l.monthlyKwh as unknown[]).every(isNum)))
      || ['peakKw', 'motorStartingKva', 'criticalLoadKw', 'outageHoursPerDay'].some((k) => l[k] !== undefined && !isNum(l[k]))
      || (l.dieselKesPerLitre !== undefined && !(isObj(l.dieselKesPerLitre) && isNum(l.dieselKesPerLitre.value) && isStr(l.dieselKesPerLitre.source)))) e.push('load must be { monthlyKwh?[12], peakKw?, motorStartingKva?, criticalLoadKw?, outageHoursPerDay?, dieselKesPerLitre?: { value, source }, source }');
  }
  const d = i.design;
  if (!isObj(d) || !isNum(d.modulesPerString) || !Array.isArray(d.stringsPerMppt) || !(d.stringsPerMppt as unknown[]).every(isNum)) e.push('design { modulesPerString, stringsPerMppt[] } is required');
  if (!isNum(i.inverterCount)) e.push('inverterCount must be a number');
  const t = i.temps;
  if (!isObj(t) || !isNum(t.recordLowC) || !isNum(t.maxAmbientC) || !isStr(t.source)) e.push('temps { recordLowC, maxAmbientC, source } is required');
  if (!Array.isArray(i.cables) || !(i.cables as unknown[]).every(isObj)) e.push('cables must be an array (may be empty)');
  else if (!(i.cables as Record<string, unknown>[]).every((k) => (k.kind === undefined || k.kind === 'dc-pv' || k.kind === 'dc-string' || k.kind === 'dc-battery' || k.kind === 'ac') && (k.mppt === undefined || (isNum(k.mppt) && Number.isInteger(k.mppt) && (k.mppt as number) >= 1)) && (k.stringFuseA === undefined || isNum(k.stringFuseA)))) e.push('cable kind must be dc-pv, dc-string, dc-battery or ac, and mppt a whole number ≥ 1');
  else e.push(...cableRunErrors(i.cables as Record<string, unknown>[], isNum(i.inverterCount) ? (i.inverterCount as number) : undefined));
  // REQ-05: AC protection devices, as strictly as the form (acProtectionFromForm).
  if (i.acProtection !== undefined) e.push(...acProtectionErrors(i.acProtection, Array.isArray(i.cables) ? (i.cables as unknown[]).filter(isObj) : []));
  const p = i.production;
  if (!isObj(p) || !isNum(p.annualKwh) || !isNum(p.clippedKwh) || !isNum(p.specificYieldKwhPerKwp) || !isNum(p.performanceRatio) || !Array.isArray(p.assumptions) || !isStr(p.engineVersion)) e.push('production (hourly simulation result) is required');
  if (isObj(p) && p.shading !== undefined) {
    const sh = p.shading;
    if (!isObj(sh) || !isObj(sh.horizon) || !Array.isArray(sh.monthly) || !isObj(sh.annual) || !isNum(sh.annual.shadedAnnualKwh) || !isStr(sh.engineVersion)) e.push('production.shading must be a horizon-shading result');
  }
  if (i.connections !== undefined) {
    const c = i.connections;
    const tri = (x: unknown) => x === true || x === false || x === null;
    if (!isObj(c) || !tri(c.grid) || !tri(c.generator) || (c.generatorRatedKw !== undefined && !isNum(c.generatorRatedKw))
      || (c.generatorMinSiteLoadKw !== undefined && !isNum(c.generatorMinSiteLoadKw)) || (c.generatorOemMinLoadPct !== undefined && !isNum(c.generatorOemMinLoadPct))
      || (c.pvCanBackfeedGenerator !== undefined && !tri(c.pvCanBackfeedGenerator))) e.push('connections must be { grid, generator } with true, false or null');
  }
  if (i.hybrid !== undefined &&(!isObj(i.hybrid) || !isObj(i.hybrid.totals) || !isStr(i.hybrid.engineVersion))) e.push('hybrid must be a hybrid simulation result');
  if (!Array.isArray(i.bom) || !(i.bom as unknown[]).every((l) => isObj(l) && isStr(l.item) && isStr(l.model) && isNum(l.quantity) && isStr(l.unit) && (l.rate === null || isObj(l.rate)))) e.push('bom must be an array of { item, model, quantity, unit, rate | null }');
  const f = i.finance;
  if (!isObj(f) || !isNum(f.lifetimeYears)) e.push('finance { …, lifetimeYears } is required');
  else if (f.replacements !== undefined && (!Array.isArray(f.replacements) || !(f.replacements as unknown[]).every((r) => isObj(r) && isStr(r.item) && isNum(r.year) && isNum(r.costKes) && isStr(r.source) && isStr(r.date)))) e.push('finance.replacements must be a list of { item, year, costKes, source, date }');
  if (isObj(f)) for (const k of ['tariffKesPerKwh', 'tariffEscalationPct', 'discountRatePct', 'degradationPctPerYear', 'omKesPerYear', 'exportTariffKesPerKwh', 'selfConsumedFraction']) {
    const s = f[k];
    if (s === undefined && (k === 'exportTariffKesPerKwh' || k === 'selfConsumedFraction')) continue;
    if (!isObj(s) || !isNum(s.value) || !isStr(s.source)) e.push(`finance.${k} must be { value, source }`);
  }
  // A client can never supply an approval (typed or "verified"): rejected outright.
  if ('approval' in i || 'verifiedApproval' in i) return { error: CLIENT_APPROVAL_REJECTED };
  if (e.length) return { error: `Invalid proposal input: ${e.join('; ')}` };
  return { input: i as unknown as ProposalInput, format };
}

/**
 * REQ-05 cable-run fields. Each run needs a name, unique in the request
 * (every check is named after its run). The route, installation method and
 * conductor are optional for API callers (older requests have none), but
 * when given they must be what the form allows; when absent, the engine never
 * passes the check they feed (capacity, voltage drop).
 */
export function cableRunErrors(runs: Record<string, unknown>[], inverterCount?: number): string[] {
  const e: string[] = [];
  const names: string[] = [];
  runs.forEach((k, n) => {
    const label = isStr(k.name) && (k.name as string).trim() ? `cable "${(k.name as string).trim()}"` : `cable ${n + 1}`;
    if (!isStr(k.name) || !(k.name as string).trim()) e.push(`${label}: name is required`);
    else if (names.includes((k.name as string).trim())) e.push(`${label}: cable run names must be unique`);
    else names.push((k.name as string).trim());
    for (const t of ['from', 'to', 'method'] as const) if (k[t] !== undefined && !(isStr(k[t]) && (k[t] as string).trim())) e.push(`${label}: ${t} must be text when given`);
    if (k.conductor !== undefined && k.conductor !== 'copper' && k.conductor !== 'aluminium') e.push(`${label}: conductor must be copper or aluminium when given`);
    // Review M1: inverters carried, a whole number from 1 to the inverter count (as the form).
    if (k.invertersCarried !== undefined && !(isNum(k.invertersCarried) && Number.isInteger(k.invertersCarried) && (k.invertersCarried as number) >= 1 && (inverterCount === undefined || (k.invertersCarried as number) <= inverterCount))) e.push(`${label}: invertersCarried must be a whole number from 1 to inverterCount when given`);
  });
  return e;
}

/** REQ-05: the AC protection object, with the same rules as the form. */
export function acProtectionErrors(ap: unknown, runs: Record<string, unknown>[]): string[] {
  if (!isObj(ap)) return ['acProtection must be { breakerA?, device?, cable?, rcdType? }'];
  const e: string[] = [];
  if (ap.breakerA !== undefined && !(isNum(ap.breakerA) && (ap.breakerA as number) > 0)) e.push('acProtection.breakerA must be a positive number of A when given');
  if (ap.device !== undefined && !isStr(ap.device)) e.push('acProtection.device must be text when given');
  if (ap.deviceType !== undefined && ap.deviceType !== 'circuit-breaker' && ap.deviceType !== 'fuse') e.push('acProtection.deviceType must be circuit-breaker or fuse when given');
  if (ap.cable !== undefined) {
    const run = isStr(ap.cable) ? runs.find((k) => isStr(k.name) && (k.name as string).trim() === (ap.cable as string).trim()) : undefined;
    if (!isStr(ap.cable) || !(ap.cable as string).trim()) e.push('acProtection.cable must name one of the cable runs');
    else if (!run) e.push(`acProtection.cable "${ap.cable as string}" is not one of the cable runs`);
    else if (run.kind !== 'ac') e.push(`acProtection.cable "${ap.cable as string}" is not an AC cable (kind must be ac)`);
  }
  if (ap.rcdType !== undefined && !['none', 'AC', 'A', 'F', 'B'].includes(ap.rcdType as string)) e.push('acProtection.rcdType must be none, AC, A, F or B when given');
  for (const k of Object.keys(ap)) if (!['breakerA', 'device', 'deviceType', 'cable', 'rcdType'].includes(k)) e.push(`acProtection.${k} is not a field (breakerA, device, deviceType, cable, rcdType)`);
  return e;
}

/** Safe file name from the proposal reference. */
export function proposalFileName(reference: string, ext: 'xlsx' | 'pdf'): string {
  const safe = reference.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'proposal';
  return `solar-proposal-${safe}.${ext}`;
}
