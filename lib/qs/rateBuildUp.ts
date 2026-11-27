/**
 * Building Suite Pro: unit-rate build-ups and price status (2026-11-25).
 *
 * A unit rate for one BOQ unit (per m, per No, per m², ...) built from:
 *
 *   material line = quantity per BOQ unit × price × (1 + waste % / 100)
 *   labour line   = hours per BOQ unit × rate per hour
 *   plant line    = hours per BOQ unit × rate per hour
 *   transport     = transport units per BOQ unit (t, trip, t·km …) × price per unit
 *                   (R-24, 2026-11-27: delivery to site priced on its own line, never as a default)
 *   net rate      = Σ material + Σ labour + Σ plant + Σ transport
 *   O&P           = net rate × overheads & profit % / 100
 *   unit rate     = net rate + O&P
 *
 * Each line is rounded to 0.01 KES, then the sums (the same ROUND() as the
 * Excel build-up sheet, so the workbook reproduces these figures exactly).
 *
 * PRICE STATUS (management rule, 2026-11-25). Every price carries one of:
 *  - verified:   an approved EmersonEIMS rate or a current supplier quotation
 *                (declared by the user; this tool cannot check the approval);
 *  - indicative: a dated, identifiable public source (e.g. the PPRA Market
 *                Price Reference Guide): preliminary budgets only;
 *  - unverified: no defensible source: no price is used, "quotation required".
 * A build-up is only as good as its weakest priced input: one indicative input
 * makes the whole rate indicative. Indicative is never shown as a selling
 * price or a quotation.
 *
 * No price is built into this module. Prices are typed by the user or taken
 * from a rates dataset (data/building/rates/*.json) that cites each value.
 */
export const BUILDUP_ENGINE_VERSION = 'qs-buildup 1.2.0 (2026-11-27: transport component)';

export type ResourceKind = 'material' | 'labour' | 'plant' | 'transport';
export const RESOURCE_LABELS: Record<ResourceKind, string> = { material: 'Material', labour: 'Labour', plant: 'Plant', transport: 'Transport' };

/** Status of a price used to price work. 'unverified' is never priced. */
export type PriceTier = 'verified' | 'indicative';
export const TIER_LABELS: Record<PriceTier, string> = {
  verified: 'Verified EmersonEIMS rate (company rate list or current supplier quotation, as declared by the user)',
  indicative: 'Indicative market rate (dated public source; preliminary budget only)',
};
export const TIER_SHORT: Record<PriceTier | 'unpriced', string> = { verified: 'Verified', indicative: 'Indicative', unpriced: 'Unpriced — quotation required' };

export interface Resource {
  kind: ResourceKind;
  description: string;
  /** Unit of the resource (bag, m, No for materials; h for labour and plant; t, trip or t·km for transport). */
  unit: string;
  /** Quantity of the resource per one BOQ unit (hours for labour and plant). */
  quantity: number;
  /** KES per resource unit; null = not priced ("quotation required"). */
  price: number | null;
  /** Status of the price; required whenever a price is given. */
  tier: PriceTier | null;
  /** Materials only; 0 for labour, plant and transport. */
  wastePct: number;
  source: string;
  date: string;
}
export interface BuildUp { resources: Resource[]; ohpPct: number; ohpSource: string; location: string }
export interface BuildUpLineResult extends Resource { amount: number | null; formula: string }
export interface BuildUpResult {
  lines: BuildUpLineResult[];
  materials: number; labour: number; plant: number; transport: number;
  net: number | null; ohp: number | null; rate: number | null;
  ohpPct: number; ohpSource: string;
  /** Weakest status of the priced inputs (indicative if any input is), null while incomplete. */
  tier: PriceTier | null;
  /** The oldest price date: the build-up is only as current as its oldest price. */
  priceDate: string | null;
  missing: string[];
  errors: string[];
  basis: string;
}

/**
 * Round to 0.01, half away from zero, on the DECIMAL value, as Excel's ROUND
 * does. Math.round(x * 100) / 100 rounds 18.435 to 18.43, because
 * 18.435 × 100 = 1843.4999… in binary; Excel gives 18.44. Shifting the
 * exponent in the decimal string representation avoids the multiplication error.
 */
export function roundMoney(x: number): number {
  if (!Number.isFinite(x)) return x;
  const v = Math.abs(x);
  const s = String(v);
  const r = /e/i.test(s) ? Math.round(v * 100) / 100 : Number(`${Math.round(Number(`${s}e2`))}e-2`);
  return x < 0 ? -r : r;
}
const money = roundMoney;
export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const isTier = (t: unknown): t is PriceTier => t === 'verified' || t === 'indicative';

export function computeBuildUp(b: BuildUp, boqUnit: string): BuildUpResult {
  const errors: string[] = [];
  const missing: string[] = [];
  if (!b.resources.length) errors.push('a build-up needs at least one material, labour, plant or transport line');
  const lines: BuildUpLineResult[] = b.resources.map((r, i) => {
    const n = `build-up line ${i + 1}${r.description.trim() ? ` (${r.description.trim()})` : ''}`;
    if (!Object.prototype.hasOwnProperty.call(RESOURCE_LABELS, r.kind)) errors.push(`${n}: choose material, labour, plant or transport`);
    if (!r.description.trim()) errors.push(`${n}: description is required`);
    if (!r.unit.trim()) errors.push(`${n}: unit is required`);
    if (!(Number.isFinite(r.quantity) && r.quantity > 0)) errors.push(`${n}: quantity per ${boqUnit} must be a number greater than 0`);
    if (r.kind === 'material') { if (!(Number.isFinite(r.wastePct) && r.wastePct >= 0 && r.wastePct <= 50)) errors.push(`${n}: waste must be 0–50 %`); }
    else if (r.wastePct !== 0) errors.push(`${n}: waste applies to materials only (enter 0 or leave blank)`);
    const formula = r.kind === 'material' ? `${r.quantity} ${r.unit} × ${r.price ?? '?'} × (1 + ${r.wastePct} %)` : r.kind === 'transport' ? `${r.quantity} ${r.unit} × ${r.price ?? '?'} /${r.unit}` : `${r.quantity} h × ${r.price ?? '?'} /h`;
    if (r.price === null) { missing.push(`${n}: price required (quotation required)`); return { ...r, amount: null, formula }; }
    if (!(Number.isFinite(r.price) && r.price >= 0)) { errors.push(`${n}: price must be a number ≥ 0 (KES)`); return { ...r, amount: null, formula }; }
    if (!isTier(r.tier)) errors.push(`${n}: choose the price status (verified EmersonEIMS rate/supplier quotation, or indicative market rate)`);
    if (!r.source.trim()) errors.push(`${n}: a price needs its source (rates dataset, supplier quote, wage order, hire quote)`);
    if (!isIsoDate(r.date)) errors.push(`${n}: a price needs its date (YYYY-MM-DD)`);
    return { ...r, amount: money(r.quantity * r.price * (1 + r.wastePct / 100)), formula };
  });
  if (!(Number.isFinite(b.ohpPct) && b.ohpPct >= 0 && b.ohpPct <= 100)) errors.push('build-up overheads & profit must be 0–100 %');
  else if (!b.ohpSource.trim()) errors.push('build-up overheads & profit: state its basis (e.g. company policy, tender instruction)');
  const sum = (k: ResourceKind) => money(lines.filter((l) => l.kind === k).reduce((a, l) => a + (l.amount ?? 0), 0));
  const materials = sum('material'), labour = sum('labour'), plant = sum('plant'), transport = sum('transport');
  const dates = lines.filter((l) => l.price !== null && isIsoDate(l.date)).map((l) => l.date).sort();
  const priceDate = dates[0] ?? null;
  const common = { lines, materials, labour, plant, transport, ohpPct: b.ohpPct, ohpSource: b.ohpSource.trim(), priceDate, missing, errors };
  if (errors.length || missing.length) {
    return { ...common, net: null, ohp: null, rate: null, tier: null, basis: `Build-up incomplete: ${[...errors, ...missing].join('; ')}` };
  }
  const net = money(materials + labour + plant + transport);
  const ohp = money(net * b.ohpPct / 100);
  const rate = money(net + ohp);
  const tier: PriceTier = lines.some((l) => l.tier === 'indicative') ? 'indicative' : 'verified';
  return {
    ...common, net, ohp, rate, tier,
    basis: `Rate build-up per ${boqUnit}: materials ${materials} + labour ${labour} + plant ${plant} + transport ${transport} = net ${net}; O&P ${b.ohpPct} % (${b.ohpSource.trim()}) = ${ohp}; unit rate ${rate} KES. ${TIER_SHORT[tier]} (weakest input). Prices dated from ${priceDate}${b.location.trim() ? `, ${b.location.trim()}` : ''}.`,
  };
}

// ---------------------------------------------------------------- drafts (strings, as typed)
export interface ResourceDraft { kind: ResourceKind | ''; description: string; unit: string; quantity: string; price: string; tier: PriceTier | ''; waste: string; source: string; date: string }
export interface BuildUpDraft { resources: ResourceDraft[]; ohp: string; ohpSource: string; location: string }
export const emptyResource = (kind: ResourceKind | '' = ''): ResourceDraft => ({ kind, description: '', unit: kind === 'labour' || kind === 'plant' ? 'h' : '', quantity: '', price: '', tier: '', waste: '', source: '', date: '' });
export const emptyBuildUp = (): BuildUpDraft => ({ resources: [], ohp: '', ohpSource: '', location: '' });

/** Typed strings → BuildUp. Blank price → null (quotation required); blank waste → 0; anything else that is not a number → NaN, which computeBuildUp refuses. */
export function buildUpFromDraft(d: BuildUpDraft): BuildUp {
  const n = (s: string) => (s.trim() === '' ? NaN : Number(s.trim()));
  return {
    resources: d.resources.map((r) => ({
      kind: r.kind as ResourceKind, description: r.description, unit: r.unit, quantity: n(r.quantity),
      price: r.price.trim() === '' ? null : n(r.price), tier: isTier(r.tier) ? r.tier : null,
      wastePct: r.waste.trim() === '' ? 0 : n(r.waste), source: r.source, date: r.date.trim(),
    })),
    ohpPct: n(d.ohp), ohpSource: d.ohpSource, location: d.location,
  };
}

// ---------------------------------------------------------------- rates dataset (versioned file of cited, dated records)
export const RATES_FILE_FORMAT = 'building-suite-pro/rates';
export const RATES_FILE_VERSION = 2;
export type RecordStatus = PriceTier | 'unverified';
export interface RateRecord {
  code: string; kind: ResourceKind;
  description: string; specification: string; unit: string;
  currency: 'KES';
  /** null for an unverified record (no defensible value). */
  value: number | null;
  source: { title: string; url: string };
  publicationDate: string; retrievalDate: string;
  geography: string;
  vat: 'inclusive' | 'exclusive' | 'not stated';
  delivery: string;
  basis: 'materials-only' | 'installed' | 'labour' | 'plant' | 'transport';
  confidence: 'high' | 'medium' | 'low';
  status: RecordStatus;
  note?: string;
}
export interface RatesFile { format: typeof RATES_FILE_FORMAT; version: 2; dataset: string; licence: string; records: RateRecord[] }
export class RatesFileError extends Error {}

const ONE_OF = {
  kind: ['material', 'labour', 'plant', 'transport'], vat: ['inclusive', 'exclusive', 'not stated'], basis: ['materials-only', 'installed', 'labour', 'plant', 'transport'],
  confidence: ['high', 'medium', 'low'], status: ['verified', 'indicative', 'unverified'],
} as const;

/**
 * Parses a rates dataset. Every record must carry its source (title + URL),
 * publication and retrieval dates, geography, VAT treatment, delivery
 * assumption, basis, confidence and status. An unverified record has no value;
 * a verified or indicative record must have one.
 */
export function parseRatesFile(text: string): RatesFile {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new RatesFileError('The rates file is not valid JSON'); }
  const o = raw as Record<string, unknown>;
  if (!o || typeof o !== 'object' || Array.isArray(o) || o.format !== RATES_FILE_FORMAT) throw new RatesFileError(`Not a rates file: "format" must be "${RATES_FILE_FORMAT}"`);
  if (o.version !== RATES_FILE_VERSION) throw new RatesFileError(`Unsupported rates file version (expected ${RATES_FILE_VERSION})`);
  const s = (v: unknown, what: string) => { if (typeof v !== 'string' || !v.trim()) throw new RatesFileError(`The rates file needs ${what}`); return v.trim(); };
  const dataset = s(o.dataset, 'a dataset name');
  const licence = s(o.licence, 'a licence / permitted-use statement');
  if (!Array.isArray(o.records) || !o.records.length) throw new RatesFileError('The rates file has no records');
  const seen = new Set<string>();
  const records = o.records.map((e, i): RateRecord => {
    const x = (e ?? {}) as Record<string, unknown>;
    const at = `record ${i + 1}`;
    const code = s(x.code, `${at}: a code`);
    const w = `${at} (${code})`;
    if (seen.has(code)) throw new RatesFileError(`${w}: code is repeated`);
    seen.add(code);
    const pick = <K extends keyof typeof ONE_OF>(k: K): (typeof ONE_OF)[K][number] => {
      if (typeof x[k] !== 'string' || !(ONE_OF[k] as readonly string[]).includes(x[k] as string)) throw new RatesFileError(`${w}: ${k} must be one of ${ONE_OF[k].join(', ')}`);
      return x[k] as (typeof ONE_OF)[K][number];
    };
    if (x.currency !== 'KES') throw new RatesFileError(`${w}: currency must be KES`);
    const status = pick('status');
    let value: number | null = null;
    if (status === 'unverified') { if (x.value !== null) throw new RatesFileError(`${w}: an unverified record has no value (null): quotation required`); }
    else if (typeof x.value !== 'number' || !Number.isFinite(x.value) || x.value < 0) throw new RatesFileError(`${w}: value must be a number ≥ 0`);
    else value = x.value;
    const src = (x.source ?? {}) as Record<string, unknown>;
    const url = s(src.url, `${w}: a source URL`);
    if (!/^https:\/\//.test(url)) throw new RatesFileError(`${w}: the source URL must start with https://`);
    const pub = s(x.publicationDate, `${w}: a publication date (YYYY-MM-DD, or "not stated")`);
    if (pub !== 'not stated' && !isIsoDate(pub)) throw new RatesFileError(`${w}: publicationDate must be YYYY-MM-DD or "not stated"`);
    const ret = s(x.retrievalDate, `${w}: a retrieval date`);
    if (!isIsoDate(ret)) throw new RatesFileError(`${w}: retrievalDate must be YYYY-MM-DD`);
    return {
      code, kind: pick('kind'), description: s(x.description, `${w}: a description`), specification: s(x.specification, `${w}: a specification`), unit: s(x.unit, `${w}: a unit`),
      currency: 'KES', value, source: { title: s(src.title, `${w}: a source title`), url }, publicationDate: pub, retrievalDate: ret,
      geography: s(x.geography, `${w}: its geographic applicability`), vat: pick('vat'), delivery: s(x.delivery, `${w}: a delivery assumption (or "not stated")`),
      basis: pick('basis'), confidence: pick('confidence'), status, ...(typeof x.note === 'string' && x.note.trim() ? { note: x.note.trim() } : {}),
    };
  });
  return { format: RATES_FILE_FORMAT, version: 2, dataset, licence, records };
}

/**
 * A dataset record as a build-up line draft: price, unit, status, source and
 * date come from the record; the quantity per BOQ unit is the user's. An
 * unverified record gives an unpriced line ("quotation required").
 * The date used is the publication date, or the retrieval date when the
 * source states none (and the source text says so).
 */
export function resourceFromRates(file: RatesFile, code: string, quantity = ''): ResourceDraft {
  const e = file.records.find((x) => x.code === code);
  if (!e) throw new RatesFileError(`Code ${code} is not in the rates file`);
  const dated = e.publicationDate !== 'not stated' ? e.publicationDate : e.retrievalDate;
  const when = e.publicationDate !== 'not stated' ? `published ${e.publicationDate}` : `publication date not stated, retrieved ${e.retrievalDate}`;
  return {
    kind: e.kind, description: `${e.description} (${e.specification})`, unit: e.unit, quantity,
    price: e.value === null ? '' : String(e.value), tier: e.status === 'unverified' ? '' : e.status, waste: '',
    source: `${e.source.title} [${e.code}], ${e.geography}, VAT ${e.vat}, delivery ${e.delivery}, ${when}, ${e.source.url}`, date: dated,
  };
}
