import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { equipment, core } from '../services/api';
import { BATTERY_KES_PER_KWH } from '@/lib/solar/sizing'; // one battery price for every tool (2026-10-19)

// Self-quote checker.
// Paste any quotation BOM. We parse rows, identify the equipment in the
// real library (panels/inverters/batteries), compare price-per-unit (or
// per-kW / per-kWh) against the library's reference price band, and
// flag every overpriced / underpriced line. No fabricated benchmarks.

const Container = styled.div`
  background: #0A0E27;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h2`
  color: #00D9FF;
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2.2rem);
`;
const Sub = styled.p`
  color: rgba(230, 241, 255, 0.55);
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
`;
const Card = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;
const Label = styled.label`
  display: block;
  color: rgba(0, 217, 255, 0.85);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-bottom: 6px;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 0.75rem;
  background: rgba(10, 14, 39, 0.85);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 8px;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;
const Button = styled.button<{ disabled?: boolean }>`
  margin-top: 0.6rem;
  padding: 0.7rem 1.1rem;
  background: ${(p) =>
    p.disabled
      ? 'rgba(0, 217, 255, 0.25)'
      : 'linear-gradient(135deg, #00D9FF, #0099CC)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
`;
const Spinner = styled.span`
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: -2px;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const Banner = styled.div<{ $kind: 'info' | 'error' | 'ok' | 'warn' }>`
  margin-top: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${(p) => p.$kind === 'error' ? 'rgba(255, 77, 109, 0.5)' : p.$kind === 'ok' ? 'rgba(0, 255, 136, 0.5)' : p.$kind === 'warn' ? 'rgba(255, 184, 0, 0.5)' : 'rgba(0, 217, 255, 0.5)'};
  background: ${(p) => p.$kind === 'error' ? 'rgba(255, 77, 109, 0.12)' : p.$kind === 'ok' ? 'rgba(0, 255, 136, 0.10)' : p.$kind === 'warn' ? 'rgba(255, 184, 0, 0.10)' : 'rgba(0, 217, 255, 0.10)'};
  color: ${(p) => p.$kind === 'error' ? '#FF4D6D' : p.$kind === 'ok' ? '#00FF88' : p.$kind === 'warn' ? '#FFB800' : '#00D9FF'};
`;
const Table = styled.div`
  display: grid;
  grid-template-columns: 2.4fr 1.4fr 0.7fr 1fr 1fr 1fr 1fr;
  gap: 0;
  font-size: 0.82rem;
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Th = styled.div`
  padding: 0.6rem 0.7rem;
  background: rgba(0, 217, 255, 0.12);
  color: #00D9FF;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  @media (max-width: 900px) { display: none; }
`;
const Td = styled.div<{ $verdict?: string }>`
  padding: 0.55rem 0.7rem;
  background: rgba(10, 14, 39, 0.55);
  border-top: 1px solid rgba(0, 217, 255, 0.08);
  color: white;
  word-break: break-word;
`;
const Badge = styled.span<{ $tone: 'ok' | 'warn' | 'bad' | 'unknown' }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  background: ${(p) => p.$tone === 'ok' ? 'rgba(0, 255, 136, 0.18)' : p.$tone === 'warn' ? 'rgba(255, 184, 0, 0.18)' : p.$tone === 'bad' ? 'rgba(255, 77, 109, 0.18)' : 'rgba(150, 150, 150, 0.18)'};
  color: ${(p) => p.$tone === 'ok' ? '#00FF88' : p.$tone === 'warn' ? '#FFB800' : p.$tone === 'bad' ? '#FF4D6D' : '#aaa'};
  border: 1px solid ${(p) => p.$tone === 'ok' ? 'rgba(0, 255, 136, 0.4)' : p.$tone === 'warn' ? 'rgba(255, 184, 0, 0.4)' : p.$tone === 'bad' ? 'rgba(255, 77, 109, 0.4)' : 'rgba(150, 150, 150, 0.3)'};
`;

// ------------------------------------------------------------------
// Library shape we reduce the real /api/equipment responses into.
// ------------------------------------------------------------------
interface LibItem {
  category: 'panel' | 'inverter' | 'battery';
  manufacturer: string;
  model: string;
  ratingW?: number;          // panel watt
  ratingKw?: number;         // inverter kW
  ratingKwh?: number;        // battery kWh
  gridTie?: boolean;         // inverter: grid-tie/string (cheaper per kW) vs hybrid/off-grid
  refPriceKes: number;       // KSh per unit
  datasheetUrl?: string;
}

interface ParsedLine {
  raw: string;
  description: string;
  qty: number;
  unitPriceKes: number | null;
}

interface VerdictRow {
  line: ParsedLine;
  match: LibItem | null;
  /** What the price was compared with. */
  basis: string | null;
  perUnitMarket: number | null;
  perUnitYou: number | null;
  deltaPct: number | null;
  tone: 'ok' | 'warn' | 'bad' | 'unknown';
  message: string;
}

// Reference prices are mid-2026 Kenyan RULES OF THUMB, not datasheet prices
// (the library holds no prices), and the SAME rates as the sizing calculator
// (lib/solar/sizing.ts): panels KES 21.5/W; grid-tie inverters KES 20,000/kW to
// 10 kW then 15,000/kW; hybrid/off-grid KES 35,000/kW to 10 kW then 28,000/kW;
// batteries at the site-wide rate per usable kWh.
const PANEL_KES_PER_W = 21.5;
function inverterRefKes(kw: number, gridTie = false, offGrid = false): number {
  // Off-grid-only inverters sell for about KES 15-20k/kW in Kenya (2026-10-25
  // audit: a 3.5 kVA off-grid unit at 65k was called "well below typical").
  const [a, b] = gridTie ? [20000, 15000] : offGrid ? [20000, 15000] : [35000, 28000];
  return Math.round(a * Math.min(kw, 10) + b * Math.max(0, kw - 10));
}

/** What a quote line says it is: category and rating, read from its text. */
interface Rated { kind: 'panel' | 'inverter' | 'battery' | null; w?: number; kw?: number; kwh?: number; gridTie?: boolean; offGrid?: boolean }
export function readRating(desc: string): Rated {
  const s = desc.toLowerCase();
  const kwhM = s.match(/(\d+(?:\.\d+)?)\s*kwh\b/);
  // "48V 100Ah" (either order) is 4.8 kWh.
  const vAh = s.match(/(\d+(?:\.\d+)?)\s*v\b[^\d]*?(\d+(?:\.\d+)?)\s*ah\b/) || s.match(/(\d+(?:\.\d+)?)\s*ah\b[^\d]*?(\d+(?:\.\d+)?)\s*v\b/);
  const kwhFromAh = vAh ? (Number(vAh[1]) * Number(vAh[2])) / 1000 : null;
  const kwh = kwhM ? Number(kwhM[1]) : kwhFromAh;
  // kVA on an inverter is read as kW (inverter power factor ~1).
  // "10KTL3-X" / "SG10KTL" (transformerless) and "SUN-5K-SG03" are inverter ratings too.
  const kw = s.match(/(\d+(?:\.\d+)?)\s*k(?:w|va)\b(?!h)/) || s.match(/(\d+(?:\.\d+)?)ktl/) || s.match(/\b(\d+(?:\.\d+)?)k\b/);
  const w = s.match(/(\d{2,4})\s*(?:w|wp|watts?)\b/);
  let kind: Rated['kind'] = null;
  if (/\bbatter|\blithium|\blifepo|\bbatt\b/.test(s) || kwh) kind = 'battery';
  else if (/\binverter|\bhybrid\b|\boff[- ]?grid\b|\bkva\b/.test(s)) kind = 'inverter';
  else if (/\bpanel|\bmodule|\bpv\b/.test(s) || (w && !kw)) kind = 'panel';
  const out: Rated = { kind };
  if (kind === 'battery' && kwh) out.kwh = Math.round(kwh * 100) / 100;
  if (kind === 'inverter') {
    if (kw) out.kw = Number(kw[1]);
    out.gridTie = /grid[- ]?tie|on[- ]?grid|string\b/.test(s) && !/hybrid|off[- ]?grid/.test(s);
    out.offGrid = /off[- ]?grid/.test(s) && !/hybrid/.test(s);
  }
  if (kind === 'panel' && w) out.w = Number(w[1]);
  return out;
}
function ruleRefKes(r: Rated): { kes: number; label: string } | null {
  if (r.kind === 'panel' && r.w) return { kes: Math.round(r.w * PANEL_KES_PER_W), label: `rule of thumb for a ${r.w} W panel` };
  if (r.kind === 'inverter' && r.kw) return { kes: inverterRefKes(r.kw, !!r.gridTie, !!r.offGrid), label: `rule of thumb for a ${r.kw} kW ${r.gridTie ? 'grid-tie' : r.offGrid ? 'off-grid' : 'hybrid'} inverter` };
  if (r.kind === 'battery' && r.kwh) return { kes: Math.round(r.kwh * BATTERY_KES_PER_KWH), label: `rule of thumb for ${r.kwh} kWh of battery` };
  return null;
}
const num = (...v: any[]) => { for (const x of v) { const n = Number(x); if (n > 0) return n; } return 0; };

function reducePanels(arr: any[]): LibItem[] {
  return (arr || []).map((p) => {
    const w = num(p.pStcW, p.ratingW, p.wattage, p.power);
    return {
      category: 'panel' as const,
      manufacturer: p.manufacturer || p.make || '',
      model: p.model || '',
      ratingW: w || undefined,
      refPriceKes: num(p.priceKes, p.priceKES, p.unitPriceKes) || Math.round(w * PANEL_KES_PER_W),
      datasheetUrl: p.datasheetUrl
    };
  }).filter((i) => i.refPriceKes > 0);
}
function reduceInverters(arr: any[]): LibItem[] {
  return (arr || []).map((p) => {
    const kw = num(p.acRatedKw, p.ratingKw, p.kw, p.power);
    return {
      category: 'inverter' as const,
      manufacturer: p.manufacturer || p.make || '',
      model: p.model || '',
      ratingKw: kw || undefined,
      gridTie: /grid-tie|commercial|micro/i.test(String(p.type ?? '')) && !/hybrid|off-grid/i.test(String(p.type ?? '')),
      refPriceKes: num(p.priceKes, p.priceKES) || inverterRefKes(kw, /grid-tie|commercial|micro/i.test(String(p.type ?? '')) && !/hybrid|off-grid/i.test(String(p.type ?? ''))),
      datasheetUrl: p.datasheetUrl
    };
  }).filter((i) => i.refPriceKes > 0);
}
function reduceBatteries(arr: any[]): LibItem[] {
  return (arr || []).map((p) => {
    const kwh = num(p.nominalKwh, p.ratingKwh, p.kwh, p.capacityKwh, p.usableKwh);
    return {
      category: 'battery' as const,
      manufacturer: p.manufacturer || p.make || '',
      model: p.model || '',
      ratingKwh: kwh || undefined,
      refPriceKes: num(p.priceKes, p.priceKES) || Math.round(kwh * BATTERY_KES_PER_KWH),
      datasheetUrl: p.datasheetUrl
    };
  }).filter((i) => i.refPriceKes > 0);
}

// Very tolerant line parser. Examples it accepts:
//   "Jinko 580W panels x 52 @ 12500"
//   "Sungrow SG5K-D inverter, 1, 145000"
//   "BYD HVS 10.2kWh battery 1 350000"
/** Subtotal, VAT, totals, discounts and payment terms: not items to price. */
export function isSummaryLine(l: string): boolean {
  // "16% VAT 20,000" starts with the rate (2026-10-27 audit: listed as an item).
  return /^\s*(\d+(?:\.\d+)?\s*%\s*)?(sub\s*-?\s*total|grand\s*total|total|vat|tax|discount|balance|deposit|amount\s+due|less\b|pay(ment)?\b|valid|terms|quotation\b|quote\s*(no|number|#)|invoice|proforma|pro-forma|date\b|customer|client|to:|from:|ref\b|note)\b/i.test(l);
}

/** Subtotal, VAT and total amounts the quote states, for checking its arithmetic. */
export interface QuoteTotals { subtotal: number | null; vat: number | null; total: number | null }
export function parseTotals(input: string): QuoteTotals {
  const out: QuoteTotals = { subtotal: null, vat: null, total: null };
  for (const raw of input.split(/\r?\n/)) {
    const l = raw.trim();
    // Rates ("16%") are not amounts; the last number left is ("VAT 16% 123,000").
    const amounts = l.replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/\d+(?:\.\d+)?\s*%/g, ' ').match(/\d+(?:\.\d+)?/g);
    if (!amounts) continue;
    const amount = Number(amounts[amounts.length - 1]);
    if (/^\s*sub\s*-?\s*total\b/i.test(l)) out.subtotal = amount;
    else if (/^\s*(\d+(?:\.\d+)?\s*%\s*)?(vat|tax)\b/i.test(l)) out.vat = amount;
    else if (/^\s*(grand\s*)?total\b/i.test(l)) out.total = amount;
  }
  return out;
}
export const KENYA_VAT = 0.16;

/** Mounting, cabling, protection and labour: priced as a whole, not per line. */
const BOS_WORDS = /\b(cable|wire|wiring|conduit|trunking|mount|mounting|rail|bracket|clamp|structure|install|installation|labou?r|commission|breaker|mcb|mccb|isolator|switch|fuse|spd|surge|earth|earthing|lightning|combiner|db\b|distribution|connector|mc4|accessor)/i;
/**
 * Balance of system (mounting, cabling, protection, installation) at the
 * calculator's rates (lib/solar/sizing.ts): its PV rate less the panels, plus
 * its 12% installation factor on the equipment. A rule of thumb for the whole
 * job, so it is checked once, not line by line.
 */
export function bosReferenceKes(arrayKwp: number, equipmentKes: number): number {
  const bands: [number, number][] = [[10, 70_000], [50, 60_000], [Infinity, 52_000]];
  let pv = 0, from = 0;
  for (const [upTo, rate] of bands) {
    if (arrayKwp <= from) break;
    pv += (Math.min(arrayKwp, upTo) - from) * rate;
    from = upTo;
  }
  return Math.round(pv - arrayKwp * 1000 * PANEL_KES_PER_W + equipmentKes * 0.12);
}

/** Words that make a line a quotation item even without a recognised rating. */
const ITEM_WORDS = /\b(panel|module|inverter|battery|batt|cable|wire|wiring|conduit|trunking|mount|mounting|rail|bracket|clamp|structure|install|installation|labou?r|commission|breaker|mcb|mccb|isolator|switch|fuse|spd|surge|earth|earthing|lightning|charge|controller|mppt|combiner|meter|db\b|distribution|kit|connector|mc4|transport|delivery|survey|design|pump|tank|accessor)/i;

export function parseLines(input: string): ParsedLine[] {
  // Header rows ("Item, Qty, Unit price, Total") and lines without a number are not items.
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .filter((l) => /\d/.test(l) && !/^(item|description|product|no\.?)\b[^\d]*(qty|quantity|price|amount|total)/i.test(l))
    .filter((l) => !isSummaryLine(l));
  return lines.map((raw) => {
    // Thousands separators out ("12,500" → "12500"), currency words out.
    const clean = raw.replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/\b(ksh|kes|sh)\.?/gi, ' ');
    let qty = 1;
    let unitPriceKes: number | null = null;
    // 1) Explicit markers win: "x 24", "× 24", "qty 24", "@ 13920".
    const qm = clean.match(/(?:\b[x×]|qty|quantity)\s*:?\s*(\d+)(?![\d.]*\s*(?:k?w|kwh|ah|v)\b)/i);
    const pm = clean.match(/@\s*(\d+(?:\.\d+)?)/);
    if (qm) qty = Number(qm[1]);
    if (pm) unitPriceKes = Number(pm[1]);
    if (unitPriceKes == null) {
      // 2) Otherwise only STANDALONE numbers count: "580W", "10.2kWh" and
      //    model names like "JAM72D40-580" are ratings or names, not amounts.
      // Spaces, commas (CSV), semicolons, pipes and tabs all separate columns.
      const nums = clean.split(/[\s,;|\t]+/).filter((tok) => /^\d+(?:\.\d+)?$/.test(tok)).map(Number);
      if (nums.length >= 3) {
        // "... qty unit total": the last three, when qty × unit ≈ total.
        const [q, u, tot] = nums.slice(-3);
        const [q2, u2] = nums.slice(-2);
        if (Number.isInteger(q) && q > 0 && Math.abs(q * u - tot) / tot < 0.02) { qty = qm ? qty : q; unitPriceKes = u; }
        // "... rating qty unit" ("Panel 550 W 10 12500"): the last two are the
        // quantity and the unit price (2026-10-27 audit: read as qty 1 at 12,500
        // only by luck, and as KES 550 when the price came first).
        else if (!qm && Number.isInteger(q2) && q2 > 0 && q2 < 1000 && u2 > q2) { qty = q2; unitPriceKes = u2; }
        else unitPriceKes = Math.max(...nums);
      } else if (nums.length === 2) {
        const [n1, n2] = nums;
        if (!qm && Number.isInteger(n1) && n1 > 0 && n1 < 1000 && n2 > n1) { qty = n1; unitPriceKes = n2; }
        else unitPriceKes = Math.max(n1, n2);
      } else if (nums.length === 1) {
        unitPriceKes = nums[0];
      }
    }
    const itemish = ITEM_WORDS.test(clean) || readRating(clean).kind !== null || /\b(ksh|kes)\b|@|\bx\s*\d|\bqty\b/i.test(raw);
    if (!itemish) unitPriceKes = null;
    // Description = the line without the quantity and price markers.
    const description = raw.replace(/(?:\b[x×]|@)\s*[\d,]+(?:\.\d+)?/g, '').trim();
    return { raw, description, qty, unitPriceKes };
  });
}

function findMatch(line: ParsedLine, lib: LibItem[]): LibItem | null {
  const hay = line.description.toLowerCase();
  const r = readRating(line.description);
  let best: LibItem | null = null;
  let bestScore = 0;
  for (const item of lib) {
    if (r.kind && item.category !== r.kind) continue;
    // The rating must agree within ±10% when both are known (2026-10-20: a
    // "Deye 5kW" line was priced as the library's Deye 12 kW).
    const lineRating = r.kind === 'panel' ? r.w : r.kind === 'inverter' ? r.kw : r.kind === 'battery' ? r.kwh : undefined;
    const itemRating = item.category === 'panel' ? item.ratingW : item.category === 'inverter' ? item.ratingKw : item.ratingKwh;
    if (lineRating && itemRating && Math.abs(lineRating / itemRating - 1) > 0.1) continue;
    let score = 0;
    if (item.model && item.model.length >= 4 && hay.includes(item.model.toLowerCase())) score += 4;
    if (score && item.manufacturer && hay.includes(item.manufacturer.toLowerCase())) score += 3;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  return bestScore >= 4 ? best : null;
}

function evaluate(line: ParsedLine, match: LibItem | null): VerdictRow {
  // No library match: price by the line's own rating, or say it was not checked.
  const rule = match ? null : ruleRefKes(readRating(line.description));
  const basis = match ? `${match.manufacturer} ${match.model}` : rule ? rule.label : null;
  if ((!match && !rule) || line.unitPriceKes == null) {
    return {
      line, match, basis,
      perUnitMarket: match ? match.refPriceKes : rule ? rule.kes : null,
      perUnitYou: line.unitPriceKes,
      deltaPct: null,
      tone: 'unknown',
      message: line.unitPriceKes == null ? 'No price detected' : 'Not checked — no reference for this item (for example cabling, mounting or labour)'
    };
  }
  const market = match ? match.refPriceKes : rule!.kes;
  const you = line.unitPriceKes;
  const delta = ((you - market) / market) * 100;
  const [hiWarn, hiBad, loWarn] = match ? [10, 25, -25] : [15, 35, -25];
  let tone: VerdictRow['tone'] = 'ok';
  let msg = match ? 'Within ±10% of the reference' : 'Within the typical range';
  if (delta > hiBad) { tone = 'bad'; msg = `Overpriced by ${delta.toFixed(0)}% — challenge supplier`; }
  else if (delta > hiWarn) { tone = 'warn'; msg = `Slightly high (+${delta.toFixed(0)}%)`; }
  else if (delta < loWarn) { tone = 'warn'; msg = `Well below the typical price (${delta.toFixed(0)}%) — confirm brand, model and warranty`; }
  // "Good price" for a line 38% under the reference read as an endorsement
  // (2026-10-27 audit); a low price is only a difference to explain.
  else if (delta < -10) { tone = 'ok'; msg = `Below the typical price (${delta.toFixed(0)}%) — confirm brand, model and warranty`; }
  return { line, match, basis, perUnitMarket: market, perUnitYou: you, deltaPct: delta, tone, message: msg };
}

const SAMPLE = `JA Solar JAM72D40-580 580W panel x 10 @ 12500
Deye 5kW hybrid inverter x 1 @ 165000
Pylontech US5000 4.8kWh battery x 2 @ 180000
DC isolators + cabling x 1 @ 45000
Mounting (aluminium rails) x 1 @ 60000
Installation + commissioning x 1 @ 80000`;

export default function QuoteCheckerPage() {
  const [text, setText] = useState('');
  const [lib, setLib] = useState<LibItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(true);
  const [libErr, setLibErr] = useState<string | null>(null);

  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState<VerdictRow[] | null>(null);
  const [totals, setTotals] = useState<QuoteTotals | null>(null);
  const [marketProvenance, setMarketProvenance] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoadingLib(true);
      setLibErr(null);
      try {
        const [pR, iR, bR] = await Promise.all([
          equipment.panels().catch(() => ({ data: [] })),
          equipment.inverters().catch(() => ({ data: [] })),
          equipment.batteries().catch(() => ({ data: [] }))
        ]);
        const merged: LibItem[] = [
          ...reducePanels((pR as any)?.data || []),
          ...reduceInverters((iR as any)?.data || []),
          ...reduceBatteries((bR as any)?.data || [])
        ];
        setLib(merged);
        // No live market-price feed exists (the call 404'd on every load; 2026-10-19).
        {
          setMarketProvenance(`Reference prices are mid-2026 Kenyan rules of thumb applied to each item's rating from the equipment library: panels KES ${PANEL_KES_PER_W}/W, hybrid and off-grid inverters KES 35,000/kW up to 10 kW and KES 28,000/kW above (grid-tie KES 20,000 and 15,000), batteries KES ${BATTERY_KES_PER_KWH.toLocaleString()}/kWh. All references are before VAT, like quote item lines; the quote's VAT, subtotal and total are checked separately and payment terms are ignored. Use them to spot outliers, not as a supplier price list.`);
        }
      } catch (e: any) {
        setLibErr(e?.message || 'Could not load equipment library');
      } finally {
        setLoadingLib(false);
      }
    })();
  }, []);

  const summary = useMemo(() => {
    if (!rows) return null;
    const total = rows.reduce((s, r) => s + (r.line.unitPriceKes || 0) * r.line.qty, 0);
    // Compare only the lines we could check. Counting an unchecked line at its
    // own price made "Difference +KSh 0" look like a verified fair quote.
    const checked = rows.filter((r) => r.tone !== 'unknown' && r.perUnitMarket != null);
    const checkedTotal = checked.reduce((s, r) => s + (r.line.unitPriceKes || 0) * r.line.qty, 0);
    const market = checked.reduce((s, r) => s + (r.perUnitMarket as number) * r.line.qty, 0);
    const overpriced = rows.filter((r) => r.tone === 'bad').length;
    const warn = rows.filter((r) => r.tone === 'warn').length;
    // Balance of system as a whole: lines with no reference of their own that
    // are mounting, cabling, protection or labour, against the calculator's
    // allowance for the quoted array.
    const bosRows = rows.filter((r) => r.tone === 'unknown' && r.line.unitPriceKes != null && BOS_WORDS.test(r.line.description));
    const bosQuoted = bosRows.reduce((s, r) => s + (r.line.unitPriceKes || 0) * r.line.qty, 0);
    const arrayKwp = rows.reduce((s, r) => {
      const rt = readRating(r.line.description);
      return rt.kind === 'panel' && rt.w ? s + (rt.w * r.line.qty) / 1000 : s;
    }, 0);
    const bosRef = arrayKwp > 0 && bosRows.length ? bosReferenceKes(arrayKwp, market) : null;
    const bosDeltaPct = bosRef ? ((bosQuoted - bosRef) / bosRef) * 100 : null;
    const unknown = rows.filter((r) => r.tone === 'unknown' && !bosRows.includes(r)).length;
    return { total, checkedCount: checked.length, checkedTotal, market, delta: checkedTotal - market, overpriced, warn, unknown,
      bosQuoted, bosRef, bosDeltaPct, bosCount: bosRows.length, arrayKwp: Math.round(arrayKwp * 100) / 100 };
  }, [rows]);

  function runCheck() {
    if (!text.trim()) return;
    setRunning(true);
    try {
      const lines = parseLines(text);
      const verdicts = lines.map((l) => evaluate(l, findMatch(l, lib)));
      setRows(verdicts);
      setTotals(parseTotals(text));
    } finally {
      setRunning(false);
    }
  }

  return (
    <Container>
      <Title>🔍 Self-Quote Checker</Title>
      <Sub>
        Paste any solar quotation. Each panel, inverter and battery line is compared with
        a mid-2026 Kenyan price rule for its rating (or a library model of the same rating)
        and flagged when it is more than 10–25% off. Use it to spot outliers before signing.
      </Sub>

      <Card>
        <Label>Paste quotation BOM (one line per item; spaces, commas or tabs between columns)</Label>
        <TextArea aria-label="Quotation lines, one item per line" value={text} placeholder={'Example quote:\n' + SAMPLE} onChange={(e) => setText(e.target.value)} />
        <button type="button" onClick={() => setText(SAMPLE)} style={{ background: 'none', border: 'none', color: '#00D9FF', textDecoration: 'underline', cursor: 'pointer', padding: '4px 0', marginRight: 12 }}>Load the example quote</button>
        <Button onClick={runCheck} disabled={loadingLib || running || !text.trim()}>
          {running ? <><Spinner /> Checking…</> : '✓ Check this quote'}
        </Button>
        {loadingLib && <Banner $kind="info"><Spinner /> Loading reference equipment library…</Banner>}
        {libErr && <Banner $kind="error">⚠ {libErr}</Banner>}
        {!loadingLib && !libErr && (
          <Banner $kind="info">
            ℹ Library loaded: {lib.filter((l) => l.category === 'panel').length} panels,
            {' '}{lib.filter((l) => l.category === 'inverter').length} inverters,
            {' '}{lib.filter((l) => l.category === 'battery').length} batteries.
          </Banner>
        )}
      </Card>

      {rows && (
        <>
          <Card>
            <Table>
              <Th>Line</Th><Th>Matched</Th><Th>Qty</Th>
              <Th>Your unit price</Th><Th>Reference</Th>
              <Th>Δ</Th><Th>Verdict</Th>
              {rows.map((r, i) => (
                <React.Fragment key={i}>
                  <Td>{r.line.description}</Td>
                  <Td>{r.basis ?? '—'}</Td>
                  <Td>{r.line.qty}</Td>
                  <Td>{r.line.unitPriceKes != null ? 'KSh ' + Math.round(r.line.unitPriceKes).toLocaleString() : '—'}</Td>
                  <Td>{r.perUnitMarket != null ? 'KSh ' + Math.round(r.perUnitMarket).toLocaleString() : '—'}</Td>
                  <Td>{r.deltaPct != null ? (r.deltaPct >= 0 ? '+' : '') + r.deltaPct.toFixed(0) + '%' : '—'}</Td>
                  <Td><Badge $tone={r.tone}>{r.message}</Badge></Td>
                </React.Fragment>
              ))}
            </Table>
          </Card>

          {summary && (
            <Card>
              <h3 style={{ color: '#00D9FF', marginTop: 0 }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem' }}>
                <div><Label>Quote total (item lines, excl. VAT lines)</Label><div style={{ color: '#00D9FF', fontSize: '1.2rem', fontWeight: 800 }}>KSh {Math.round(summary.total).toLocaleString()}</div></div>
                <div><Label>Checked lines: quoted vs reference</Label><div style={{ color: '#00FF88', fontSize: '1.2rem', fontWeight: 800 }}>{summary.checkedCount ? `KSh ${Math.round(summary.checkedTotal).toLocaleString()} vs ${Math.round(summary.market).toLocaleString()}` : '—'}</div></div>
                <div><Label>Difference (checked lines)</Label><div style={{ color: summary.delta > 0 ? '#FF4D6D' : '#00FF88', fontSize: '1.2rem', fontWeight: 800 }}>{summary.checkedCount ? `${summary.delta >= 0 ? '+' : ''}KSh ${Math.round(summary.delta).toLocaleString()}` : 'Nothing checked'}</div></div>
                <div><Label>Overpriced lines</Label><div style={{ color: '#FF4D6D', fontSize: '1.2rem', fontWeight: 800 }}>{summary.overpriced}</div></div>
                <div><Label>Warnings</Label><div style={{ color: '#FFB800', fontSize: '1.2rem', fontWeight: 800 }}>{summary.warn}</div></div>
                <div><Label>Unmatched</Label><div style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 800 }}>{summary.unknown}</div></div>
              </div>
              {summary.overpriced > 0 && (
                <Banner $kind="error">⚠ {summary.overpriced} line(s) significantly above market. Renegotiate or get an alternative quote.</Banner>
              )}
              {summary.checkedCount === 0 && (
                <Banner $kind="info">No items were recognised for checking. Paste one item per line with a quantity and a price, for example "580W panel x 10 @ 12,500".</Banner>
              )}
              {summary.checkedCount > 0 && summary.overpriced === 0 && summary.warn === 0 && summary.unknown === 0 && (
                <Banner $kind="ok">✓ Every line was checked and is within the reference range.</Banner>
              )}
              {summary.unknown > 0 && (
                <Banner $kind="info">{summary.unknown} line(s) could not be checked (no price, or no reference for that item). The verdict covers the other lines only.</Banner>
              )}
              {summary.bosCount > 0 && (summary.bosRef != null && summary.bosDeltaPct != null ? (
                <Banner $kind={summary.bosDeltaPct > 35 ? 'error' : summary.bosDeltaPct < -35 ? 'warn' : 'ok'}>
                  Mounting, cabling, protection and installation ({summary.bosCount} line{summary.bosCount > 1 ? 's' : ''}): KSh {Math.round(summary.bosQuoted).toLocaleString()} vs about KSh {summary.bosRef.toLocaleString()} for a {summary.arrayKwp} kWp array at the calculator&apos;s rates ({summary.bosDeltaPct >= 0 ? '+' : ''}{summary.bosDeltaPct.toFixed(0)}%).
                  {' '}{summary.bosDeltaPct > 35 ? 'High: ask the supplier to itemise it.' : summary.bosDeltaPct < -35 ? 'Low: check that mounting, protection and labour are all included.' : 'Within the typical range for the job as a whole.'}
                  {' '}Checked as one total, since site conditions move individual lines.
                </Banner>
              ) : (
                <Banner $kind="info">{summary.bosCount} mounting, cabling or installation line(s) were not checked: no panel line with a wattage, so the array size is unknown.</Banner>
              ))}
              {totals && (totals.subtotal != null || totals.vat != null || totals.total != null) && (() => {
                const notes: string[] = [];
                let bad = false;
                const sub = totals.subtotal ?? summary.total;
                if (totals.subtotal != null && Math.abs(totals.subtotal - summary.total) > Math.max(1, summary.total * 0.005)) {
                  bad = true;
                  notes.push(`The quote's subtotal (KSh ${Math.round(totals.subtotal).toLocaleString()}) does not equal its item lines (KSh ${Math.round(summary.total).toLocaleString()}).`);
                }
                if (totals.vat != null) {
                  const expected = sub * KENYA_VAT;
                  if (Math.abs(totals.vat - expected) > Math.max(1, expected * 0.01)) {
                    bad = true;
                    notes.push(`VAT is KSh ${Math.round(totals.vat).toLocaleString()}; 16% of KSh ${Math.round(sub).toLocaleString()} is KSh ${Math.round(expected).toLocaleString()}. Ask the supplier which lines VAT was charged on.`);
                  }
                }
                if (totals.total != null) {
                  const expected = sub + (totals.vat ?? 0);
                  if (Math.abs(totals.total - expected) > Math.max(1, expected * 0.005)) {
                    bad = true;
                    notes.push(`The total (KSh ${Math.round(totals.total).toLocaleString()}) does not equal the subtotal${totals.vat != null ? ' plus VAT' : ''} (KSh ${Math.round(expected).toLocaleString()}).`);
                  }
                }
                return <Banner $kind={bad ? 'warn' : 'ok'}>{bad ? notes.join(' ') : "The quote's subtotal, VAT and total agree with its item lines."}</Banner>;
              })()}
              <Banner $kind="info">{marketProvenance}</Banner>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
