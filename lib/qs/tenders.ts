/**
 * Tender comparison side by side (register R-27, P1-D §5 / RS20, 2026-11-27).
 *
 * The bill's own items (code, description, unit, quantity) are priced by each
 * tenderer: a CSV per tenderer with `code,rate[,amount]`. For every item and
 * tenderer: amount = ROUND(quantity × rate, 2) (the bill's quantity, never the
 * tenderer's); a tendered amount that differs from it by more than 0.01 is an
 * arithmetic error and is reported, not silently used (the corrected figure
 * is shown beside it). An item a tenderer did not price is "not priced": that
 * tender is incomplete and is not ranked. Totals are of the measured items
 * compared, before preliminaries, contingency, O&P and VAT, and are labelled so.
 * Nothing here is a price of EmersonEIMS: the rates are the tenderers'.
 */
import { roundMoney } from './rateBuildUp';

export const TENDERS_ENGINE_VERSION = 'qs-tenders 1.0.0 (2026-11-27)';

export interface BillLine { code: string; description: string; unit: string; quantity: number }
export interface TenderRate { rate: number; amount?: number }
export interface Tender { name: string; rates: Map<string, TenderRate> }
export class TenderError extends Error {}

export interface TenderCell { rate: number | null; amount: number | null; tenderedAmount: number | null; arithmeticError: boolean }
export interface TenderRow { code: string; description: string; unit: string; quantity: number; cells: TenderCell[]; lowest: string[] }
export interface TenderSummary { name: string; total: number; complete: boolean; notPriced: string[]; arithmeticErrors: string[]; extraItems: string[]; rank: number | null; overLowestPct: number | null }
export interface TenderComparison { rows: TenderRow[]; tenders: TenderSummary[]; basis: string }

/**
 * RFC 4180 records: fields separated by commas; a field in double quotes may
 * contain commas, line breaks and "" (an escaped quote). Each record carries
 * the line it starts on. A quote inside an unquoted field, text after a
 * closing quote, or an unclosed quote is refused (review T1, 2026-11-27: the
 * old split on every comma read an Excel `A1,"1,250.00"` as rate 1, amount 250).
 */
function csvRecords(name: string, text: string): Array<{ line: number; fields: string[] }> {
  const out: Array<{ line: number; fields: string[] }> = [];
  let fields: string[] = [], cur = '', quoted = false, inQuotes = false, afterQuote = false, line = 1, start = 1;
  const endField = () => { fields.push(quoted ? cur : cur.trim()); cur = ''; quoted = false; afterQuote = false; };
  const endRecord = () => { endField(); out.push({ line: start, fields }); fields = []; };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; afterQuote = true; }
      } else { if (ch === '\n') line++; cur += ch; }
      continue;
    }
    if (ch === ',') { endField(); continue; }
    if (ch === '\r' && text[i + 1] === '\n') continue;
    if (ch === '\n' || ch === '\r') { endRecord(); line++; start = line; continue; }
    if (afterQuote) { if (ch === ' ' || ch === '\t') continue; throw new TenderError(`${name}, row ${start}: text after a closing quote`); }
    if (ch === '"') {
      if (cur.trim() !== '') throw new TenderError(`${name}, row ${start}: a quote inside an unquoted field (quote the whole field)`);
      cur = ''; quoted = true; inQuotes = true; continue;
    }
    cur += ch;
  }
  if (inQuotes) throw new TenderError(`${name}, row ${start}: a quoted field is not closed`);
  if (cur !== '' || fields.length || quoted) endRecord();
  // Blank lines and # comment lines are not records.
  return out.filter((r) => !(r.fields.length === 1 && r.fields[0] === '') && !(r.fields[0] ?? '').startsWith('#'));
}

/** A plain decimal number ≥ 0: digits with an optional decimal point. Thousands separators are refused, never guessed. */
function plainNumber(at: string, what: string, s: string): number {
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s) || s.includes(',')) throw new TenderError(`${at}: the ${what} "${s}" has a thousands separator or a comma: write it as a plain number (e.g. 1250.00), so it cannot be misread`);
  if (!/^\d+(\.\d+)?$/.test(s)) throw new TenderError(`${at}: the ${what} must be a number ≥ 0 (got "${s}")`);
  return Number(s);
}

/** One tenderer's CSV: header with `code` and `rate` (and optionally `amount`). */
export function parseTenderCsv(name: string, text: string): Tender {
  const n = name.trim();
  if (!n) throw new TenderError('Give the tenderer a name');
  const recs = csvRecords(n, text);
  if (recs.length < 2) throw new TenderError(`${n}: the CSV needs a header (code,rate[,amount]) and at least one priced item`);
  const head = recs[0].fields.map((h) => h.trim().toLowerCase());
  const ci = head.indexOf('code'), ri = head.indexOf('rate'), ai = head.indexOf('amount');
  if (ci < 0 || ri < 0) throw new TenderError(`${n}: the header must name "code" and "rate" columns`);
  const rates = new Map<string, TenderRate>();
  for (const { line, fields: v } of recs.slice(1)) {
    const at = `${n}, row ${line}`;
    if (v.length !== head.length) throw new TenderError(`${at}: ${v.length} field(s), the header has ${head.length} — check for an unquoted comma or a missing value`);
    const code = (v[ci] ?? '').trim();
    if (!code) throw new TenderError(`${at}: no item code`);
    if (rates.has(code)) throw new TenderError(`${at}: item ${code} is priced twice`);
    const rate = plainNumber(at, `rate for ${code}`, (v[ri] ?? '').trim());
    const rawA = ai >= 0 ? (v[ai] ?? '').trim() : '';
    const a = rawA !== '' ? plainNumber(at, `amount for ${code}`, rawA) : undefined;
    rates.set(code, { rate, ...(a !== undefined ? { amount: a } : {}) });
  }
  return { name: n, rates };
}

export function compareTenders(bill: BillLine[], tenders: Tender[]): TenderComparison {
  if (!bill.length) throw new TenderError('The bill has no items to compare');
  if (tenders.length < 2) throw new TenderError('Add at least two tenders to compare');
  const names = new Set<string>();
  for (const t of tenders) { if (names.has(t.name)) throw new TenderError(`Two tenders are named "${t.name}"`); names.add(t.name); }
  const codes = new Set(bill.map((l) => l.code));
  const rows: TenderRow[] = bill.map((l) => {
    const cells = tenders.map((t): TenderCell => {
      const r = t.rates.get(l.code);
      if (!r) return { rate: null, amount: null, tenderedAmount: null, arithmeticError: false };
      const amount = roundMoney(l.quantity * r.rate);
      const tendered = r.amount ?? null;
      return { rate: r.rate, amount, tenderedAmount: tendered, arithmeticError: tendered !== null && Math.abs(tendered - amount) > 0.01 };
    });
    const priced = cells.map((c, i) => ({ c, i })).filter((x) => x.c.amount !== null);
    const min = priced.length ? Math.min(...priced.map((x) => x.c.amount!)) : null;
    return { code: l.code, description: l.description, unit: l.unit, quantity: l.quantity, cells, lowest: min === null ? [] : priced.filter((x) => x.c.amount === min).map((x) => tenders[x.i].name) };
  });
  const summaries: TenderSummary[] = tenders.map((t, i) => ({
    name: t.name,
    total: roundMoney(rows.reduce((a, r) => a + (r.cells[i].amount ?? 0), 0)),
    notPriced: rows.filter((r) => r.cells[i].rate === null).map((r) => r.code),
    arithmeticErrors: rows.filter((r) => r.cells[i].arithmeticError).map((r) => r.code),
    extraItems: [...t.rates.keys()].filter((c) => !codes.has(c)),
    complete: false, rank: null, overLowestPct: null,
  }));
  for (const s of summaries) s.complete = s.notPriced.length === 0;
  const ranked = summaries.filter((s) => s.complete).sort((a, b) => a.total - b.total);
  const low = ranked[0]?.total;
  ranked.forEach((s, k) => { s.rank = k + 1; s.overLowestPct = low ? Math.round(((s.total - low) / low) * 10000) / 100 : 0; });
  return {
    rows, tenders: summaries,
    basis: 'Amount = ROUND(bill quantity × tendered rate, 2); a tendered amount differing by more than 0.01 is an arithmetic error (the corrected amount is used and both are shown). Totals are of the measured items compared, before preliminaries, contingency, overheads & profit and VAT. Only complete tenders are ranked. Rates are the tenderers’, not EmersonEIMS prices.',
  };
}
