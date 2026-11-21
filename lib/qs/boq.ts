/**
 * Building Suite Pro bill of quantities (P1-D, 2026-11-14).
 *
 * Quantities link to measurements; rates come from a dated rate library or an
 * attached supplier quote. An item without a rate shows "rate required" and
 * the bill has no grand total until every item is priced: a partial total is
 * never presented as the total. Each amount is computed once, in one place.
 */
import type { Quantity } from './takeoff';

export const BOQ_ENGINE_VERSION = 'qs-boq 1.0.0 (2026-11-14)';

export type RateKind = 'rate-library' | 'supplier-quote' | 'other';
export const RATE_KIND_LABELS: Record<RateKind, string> = { 'rate-library': 'Rate library', 'supplier-quote': 'Supplier quote', other: 'Other source' };
export interface Rate { value: number; currency: 'KES'; source: string; date: string; location: string; kind: RateKind }

/**
 * A rate as typed in the BOQ table → Rate. Blank value → null ("rate required").
 * The kind is what the user chose; it is never defaulted, and an unchosen kind
 * is refused by buildBoq, so a supplier quote is never labelled a rate library.
 */
export function rateFromInput(i: { value: string; kind: string; source: string; date: string; location: string }): Rate | null {
  if (i.value.trim() === '') return null;
  return { value: Number(i.value), currency: 'KES', source: i.source.trim(), date: i.date.trim(), location: i.location.trim(), kind: i.kind as RateKind };
}
export interface BoqItem {
  code: string; section: string; trade: string; description: string;
  unit: 'm' | 'm²' | 'm³' | 'No' | 'kg' | 't' | 'item';
  /** Linked measurements and a multiplier each (e.g. 2 for both faces). */
  links: Array<{ measurementId: string; factor: number }>;
  /** For reinforcement (kg/t) or items not measured on drawings: a quantity with its source document, never estimated. */
  scheduledQuantity?: { value: number; source: string };
  rate: Rate | null;
}
export interface Adjustments {
  preliminaries: { kind: 'percent'; pct: number } | { kind: 'itemised'; items: Array<{ description: string; amount: number }> };
  contingencyPct: number;
  overheadsProfitPct: number;
  vat: { pct: number; effectiveFrom: string };
  /**
   * Fields the user has not filled in yet (2026-11-21 directive: empty optional
   * fields must not show errors). Each is still needed for a bill total, so the
   * bill stays INCOMPLETE, but it is reported as "not entered yet", not as an error.
   * Keys: 'preliminaries' | 'contingency' | 'overheads and profit' | 'VAT' | 'VAT date'.
   */
  notEntered?: string[];
}
export interface BoqLine {
  code: string; section: string; description: string; unit: string;
  quantity: number; rate: number | null; amount: number | null;
  rateNote: string; quantitySource: string;
}
export interface Boq {
  version: string; revision: string;
  lines: BoqLine[];
  sections: Array<{ section: string; subtotal: number | null; unpriced: number }>;
  measuredWorks: number | null;
  preliminaries: number | null; contingency: number | null; overheadsProfit: number | null;
  subtotalBeforeVat: number | null; vat: number | null; grandTotal: number | null;
  pricedSubtotal: number;
  unpricedItems: string[];
  basis: string[];
  errors: string[];
  /** Adjustments not entered yet (no error; the bill has no total until they are). */
  missing: string[];
}

const UNIT_FOR: Record<Quantity['kind'], BoqItem['unit']> = { linear: 'm', area: 'm²', volume: 'm³', count: 'No' };
const money = (x: number) => Math.round(x * 100) / 100;
const qty = (x: number) => Math.round(x * 1000) / 1000;

export function buildBoq(items: BoqItem[], quantities: Map<string, Quantity>, adj: Adjustments, revision: string, ruleQty?: Map<string, number>): Boq {
  const errors: string[] = [];
  const seen = new Set<string>();
  const lines: BoqLine[] = [];
  for (const it of items) {
    if (seen.has(it.code)) errors.push(`${it.code}: item code repeated`);
    seen.add(it.code);
    let quantity = 0;
    const src: string[] = [];
    if (it.scheduledQuantity) {
      if (it.links.length) errors.push(`${it.code}: either measured links or a scheduled quantity, not both (double counting)`);
      if (!(it.scheduledQuantity.value > 0) || !it.scheduledQuantity.source) errors.push(`${it.code}: a scheduled quantity needs a positive value and its source (bar schedule, design)`);
      quantity = it.scheduledQuantity.value;
      src.push(`schedule: ${it.scheduledQuantity.source}`);
    } else {
      if (!it.links.length) errors.push(`${it.code}: no measurement linked and no scheduled quantity`);
      const usedHere = new Set<string>();
      for (const l of it.links) {
        const q = quantities.get(l.measurementId);
        if (!q) { errors.push(`${it.code}: measurement ${l.measurementId} not found`); continue; }
        if (usedHere.has(l.measurementId)) errors.push(`${it.code}: measurement ${l.measurementId} linked twice (use a factor instead)`);
        usedHere.add(l.measurementId);
        if (UNIT_FOR[q.kind] !== it.unit) { errors.push(`${it.code}: unit ${it.unit} does not match measurement ${l.measurementId} (${UNIT_FOR[q.kind]})`); continue; }
        if (!(l.factor > 0)) { errors.push(`${it.code}: factor must be positive`); continue; }
        const base = ruleQty?.get(l.measurementId) ?? q.net;
        quantity += base * l.factor;
        src.push(`${l.measurementId}${l.factor !== 1 ? ` × ${l.factor}` : ''}`);
      }
    }
    quantity = qty(quantity);
    let rate: number | null = null, rateNote = 'rate required';
    if (it.rate) {
      if (!(it.rate.value >= 0) || !it.rate.source || Number.isNaN(Date.parse(it.rate.date))) errors.push(`${it.code}: a rate needs a value, a source and a date`);
      else if (!Object.prototype.hasOwnProperty.call(RATE_KIND_LABELS, it.rate.kind)) errors.push(`${it.code}: choose where the rate comes from (rate library, supplier quote or other source)`);
      else { rate = it.rate.value; rateNote = `${RATE_KIND_LABELS[it.rate.kind]}: ${it.rate.source}, ${it.rate.date}, ${it.rate.location}`; }
    }
    lines.push({ code: it.code, section: it.section, description: it.description, unit: it.unit, quantity, rate, amount: rate === null ? null : money(quantity * rate), rateNote, quantitySource: src.join(' + ') });
  }

  const sectionNames = [...new Set(lines.map((l) => l.section))];
  const sections = sectionNames.map((s) => {
    const ls = lines.filter((l) => l.section === s);
    const unpriced = ls.filter((l) => l.amount === null).length;
    return { section: s, subtotal: unpriced ? null : money(ls.reduce((a, l) => a + (l.amount ?? 0), 0)), unpriced };
  });
  const pricedSubtotal = money(lines.reduce((a, l) => a + (l.amount ?? 0), 0));
  const unpricedItems = lines.filter((l) => l.amount === null).map((l) => l.code);
  const blank = new Set(adj.notEntered ?? []);
  const missing: string[] = [];
  const LABEL: Record<string, string> = { preliminaries: 'Preliminaries %', contingency: 'Contingency %', 'overheads and profit': 'Overheads & profit %', VAT: 'VAT %', 'VAT date': 'VAT rate effective date' };
  const pctCheck = (key: string, v: number) => {
    if (blank.has(key)) missing.push(LABEL[key]);
    else if (!(v >= 0 && v <= 100)) errors.push(`${LABEL[key]} must be a number between 0 and 100`);
  };
  if (adj.preliminaries.kind === 'percent') pctCheck('preliminaries', adj.preliminaries.pct);
  pctCheck('contingency', adj.contingencyPct);
  pctCheck('overheads and profit', adj.overheadsProfitPct);
  pctCheck('VAT', adj.vat.pct);
  if (blank.has('VAT date')) missing.push(LABEL['VAT date']);
  else if (Number.isNaN(Date.parse(adj.vat.effectiveFrom))) errors.push('The VAT rate needs the date it applies from (YYYY-MM-DD)');

  const basis = [
    'Measured works = sum of section subtotals',
    adj.preliminaries.kind === 'percent' ? `Preliminaries = ${adj.preliminaries.pct} % × measured works` : 'Preliminaries = itemised preliminaries',
    `Contingency = ${adj.contingencyPct} % × (measured works + preliminaries)`,
    `Overheads & profit = ${adj.overheadsProfitPct} % × (measured works + preliminaries + contingency)`,
    `VAT = ${adj.vat.pct} % (from ${adj.vat.effectiveFrom}) × subtotal before VAT`,
  ];
  const complete = !unpricedItems.length && !errors.length && !missing.length;
  if (!complete) {
    return { version: BOQ_ENGINE_VERSION, revision, lines, sections, measuredWorks: null, preliminaries: null, contingency: null, overheadsProfit: null, subtotalBeforeVat: null, vat: null, grandTotal: null, pricedSubtotal, unpricedItems, basis, errors, missing };
  }
  const measuredWorks = money(sections.reduce((a, s) => a + (s.subtotal ?? 0), 0));
  const preliminaries = money(adj.preliminaries.kind === 'percent' ? measuredWorks * adj.preliminaries.pct / 100 : adj.preliminaries.items.reduce((a, i) => a + i.amount, 0));
  const contingency = money((measuredWorks + preliminaries) * adj.contingencyPct / 100);
  const overheadsProfit = money((measuredWorks + preliminaries + contingency) * adj.overheadsProfitPct / 100);
  const subtotalBeforeVat = money(measuredWorks + preliminaries + contingency + overheadsProfit);
  const vat = money(subtotalBeforeVat * adj.vat.pct / 100);
  return { version: BOQ_ENGINE_VERSION, revision, lines, sections, measuredWorks, preliminaries, contingency, overheadsProfit, subtotalBeforeVat, vat, grandTotal: money(subtotalBeforeVat + vat), pricedSubtotal, unpricedItems, basis, errors, missing };
}

/** Printed on every export: no reviewer is authenticated, so nothing produced here is approved, certified or issued. */
export const DRAFT_NOTICE = 'DRAFT — not certified. Not checked or approved by a registered quantity surveyor.';

/** One line saying why the bill has no total, or null when it is complete. */
export function incompleteNotice(boq: Boq): string | null {
  if (boq.grandTotal !== null) return null;
  const why = [
    boq.unpricedItems.length ? `${boq.unpricedItems.length} item(s) need a rate (${boq.unpricedItems.join(', ')})` : '',
    boq.missing?.length ? `not entered yet: ${boq.missing.join(', ')}` : '',
    boq.errors.length ? `${boq.errors.length} error(s) to resolve` : '',
  ].filter(Boolean).join('; ');
  return `INCOMPLETE — ${why || 'the bill is not complete'}. No bill total: the priced items shown are not a bill total.`;
}

/** Variation between two revisions: per item quantity, rate and amount changes. */
export function compareRevisions(a: Boq, b: Boq) {
  const byCode = (x: Boq) => new Map(x.lines.map((l) => [l.code, l]));
  const A = byCode(a), B = byCode(b);
  const codes = [...new Set([...A.keys(), ...B.keys()])].sort();
  const rows = codes.map((code) => {
    const x = A.get(code), y = B.get(code);
    const status = !x ? 'added' : !y ? 'omitted' : x.quantity !== y.quantity || x.rate !== y.rate ? 'changed' : 'unchanged';
    const delta = x?.amount != null || y?.amount != null ? money((y?.amount ?? 0) - (x?.amount ?? 0)) : null;
    return { code, status, quantityFrom: x?.quantity ?? null, quantityTo: y?.quantity ?? null, rateFrom: x?.rate ?? null, rateTo: y?.rate ?? null, amountChange: delta };
  });
  return { from: a.revision, to: b.revision, rows, grandTotalChange: a.grandTotal !== null && b.grandTotal !== null ? money(b.grandTotal - a.grandTotal) : null };
}
