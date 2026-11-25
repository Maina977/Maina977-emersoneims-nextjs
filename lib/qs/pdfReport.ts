/**
 * BOQ report as PDF (P1-D, 2026-11-14), from the same Boq object as the Excel
 * export: every figure printed here is the engine's value, so screen, Excel
 * and PDF totals are identical. Includes the quantity source (measurements or
 * the trade calculation trace), the rate source and date for every line, the
 * calculation basis and the engine versions, and every rate build-up
 * (materials, labour, plant, O&P) behind a built-up rate.
 *
 * Every report is a DRAFT, not certified: no reviewer is authenticated here,
 * so the name in "prepared by" never certifies anything. An incomplete bill is
 * printed as INCOMPLETE: unpriced lines say "rate required", a section with
 * unpriced lines shows a "priced items only" subtotal, and there is no total.
 */
import { jsPDF } from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import { DRAFT_NOTICE, PRELIMINARY_NOTICE, incompleteNotice, type Boq } from './boq';
import { TIER_SHORT } from './rateBuildUp';

const money = (x: number) => Math.round(x * 100) / 100;
const kes = (x: number | null) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

// The standard PDF fonts cover Latin-1 plus these WinAnsi characters; anything
// else (e.g. U+2212 minus, Σ, ≥) is printed as a wrong glyph, so it is spelled out.
const WIN_ANSI_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
const SPELL: Record<string, string> = { '−': '-', 'Σ': 'sum', '≥': '>=', '≤': '<=', '≈': '~', '→': '->', '✓': 'ok', '⌀': 'dia.' };
export function pdfSafe(s: string): string {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    out += c < 256 || WIN_ANSI_EXTRA.has(ch) ? ch : SPELL[ch] ?? '?';
  }
  return out;
}

export function boqToPdf(boq: Boq, meta: { project: string; preparedBy: string; date: string; drawings?: string[] }): Uint8Array {
  const incomplete = incompleteNotice(boq);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const T = (s: string, x: number, y: number) => doc.text(pdfSafe(s), x, y);
  doc.setFontSize(14); T(`DRAFT Bill of Quantities: ${meta.project}`, 14, 16);
  doc.setFontSize(9);
  T(`Revision ${boq.revision} · prepared by ${meta.preparedBy} · ${meta.date}`, 14, 22);
  doc.setTextColor(180, 83, 9); T(DRAFT_NOTICE, 14, 27);
  let y = 32;
  if (boq.priceStatus.notice) {
    const wrapped = doc.splitTextToSize(pdfSafe(boq.priceStatus.notice), 180) as string[];
    doc.text(wrapped, 14, y); y += wrapped.length * 4 + 1;
  }
  doc.setTextColor(0, 0, 0);
  if (incomplete) {
    doc.setTextColor(185, 28, 28);
    for (const t of [incomplete, ...boq.errors.map((e) => `Error: ${e}`)]) {
      const wrapped = doc.splitTextToSize(pdfSafe(t), 180) as string[];
      doc.text(wrapped, 14, y); y += wrapped.length * 4;
    }
    doc.setTextColor(0, 0, 0); y += 1;
  }
  if (meta.drawings?.length) { T(`Measured from: ${meta.drawings.join('; ')}`.slice(0, 180), 14, y); y += 5; }
  for (const s of boq.sections) {
    const lines = boq.lines.filter((l) => l.section === s.section);
    const priced = money(lines.reduce((a, l) => a + (l.amount ?? 0), 0));
    autoTable(doc, {
      startY: y,
      head: [[pdfSafe(s.section), 'Unit', 'Quantity', 'Rate (KES)', 'Amount (KES)']],
      body: [
        ...lines.map((l) => [pdfSafe(`${l.code}  ${l.description}\nQuantity: ${l.quantitySource}\nRate: ${l.rateNote}\nPrice status: ${l.tierNote}`), pdfSafe(l.unit), l.quantity.toLocaleString('en-KE', { maximumFractionDigits: 3 }), kes(l.rate), l.amount === null ? 'rate required' : kes(l.amount)]),
        s.unpriced
          ? [{ content: pdfSafe(`Subtotal: ${s.section} (priced items only — INCOMPLETE, ${s.unpriced} unpriced)`), colSpan: 4, styles: { fontStyle: 'bold' } }, { content: kes(priced), styles: { fontStyle: 'bold' } }]
          : [{ content: pdfSafe(`Subtotal: ${s.section}`), colSpan: 4, styles: { fontStyle: 'bold' } }, { content: kes(s.subtotal), styles: { fontStyle: 'bold' } }],
      ],
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: { 0: { cellWidth: 95 }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  }
  // Rate build-ups: the basis of every built-up rate, line by line, with the same figures as the engine and the Excel sheet.
  for (const l of boq.lines.filter((x) => x.buildUp)) {
    const b = l.buildUp!;
    const num = (x: number | null, d = 2) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: d, maximumFractionDigits: d }));
    const totals = b.rate === null
      ? [[{ content: pdfSafe(`Build-up incomplete — rate required: ${[...b.errors, ...b.missing].join('; ')}`), colSpan: 5, styles: { fontStyle: 'bold' as const, textColor: [185, 28, 28] as [number, number, number] } }]]
      : [
        ...([['Materials', b.materials], ['Labour', b.labour], ['Plant', b.plant], ['Net unit rate', b.net], [`Overheads & profit ${b.ohpPct} % (${b.ohpSource})`, b.ohp]] as Array<[string, number | null]>)
          .map(([t, v]) => [{ content: pdfSafe(t), colSpan: 4 }, num(v)]),
        [{ content: pdfSafe(`Unit rate per ${l.unit} (to the BOQ) — ${TIER_SHORT[b.tier!]}`), colSpan: 4, styles: { fontStyle: 'bold' as const } }, { content: num(b.rate), styles: { fontStyle: 'bold' as const } }],
      ];
    autoTable(doc, {
      startY: y,
      head: [[pdfSafe(`Rate build-up ${l.code}: ${l.description} (per ${l.unit})`), 'Qty / unit', 'Price (KES)', 'Waste %', 'Amount (KES)']],
      body: [
        ...b.lines.map((r) => [pdfSafe(`${r.kind}: ${r.description} (${r.unit})\nPrice: ${r.source || '—'}, ${r.date || '—'}\nStatus: ${r.tier ? TIER_SHORT[r.tier] : TIER_SHORT.unpriced}`), num(r.quantity, 3), r.price === null ? 'price required' : num(r.price), String(r.wastePct), r.amount === null ? 'price required' : num(r.amount)]),
        ...totals,
      ],
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: { 0: { cellWidth: 95 }, 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  }
  autoTable(doc, {
    startY: y,
    head: [['Summary', 'Amount (KES)']],
    body: [...((incomplete
      ? [
        ['Priced items only (INCOMPLETE — not a bill total)', kes(boq.pricedSubtotal)],
        [{ content: 'TOTAL: not available until every item is priced and every error is resolved', styles: { fontStyle: 'bold' as const } }, { content: '—', styles: { fontStyle: 'bold' as const } }],
      ]
      : [
        ['Measured works', kes(boq.measuredWorks)], ['Preliminaries', kes(boq.preliminaries)], ['Contingency', kes(boq.contingency)],
        ['Overheads & profit', kes(boq.overheadsProfit)], ['Subtotal before VAT', kes(boq.subtotalBeforeVat)], ['VAT', kes(boq.vat)],
        [{ content: 'TOTAL', styles: { fontStyle: 'bold' as const } }, { content: kes(boq.grandTotal), styles: { fontStyle: 'bold' as const } }],
      ]) as RowInput[]),
      // Price status, always shown: verified and indicative money are reported separately, never merged silently.
      [pdfSafe(`Priced at verified EmersonEIMS rates (${boq.priceStatus.verifiedItems.length} item(s), before adjustments)`), kes(boq.priceStatus.verified)],
      [pdfSafe(`Priced at indicative market rates, preliminary budget only (${boq.priceStatus.indicativeItems.length} item(s), before adjustments)`), kes(boq.priceStatus.indicative)],
      [pdfSafe(`Unpriced, quotation required: ${boq.priceStatus.unpricedItems.length} item(s)${boq.priceStatus.unpricedItems.length ? ` (${boq.priceStatus.unpricedItems.join(', ')})` : ''}`), '—'],
      [{ content: pdfSafe(boq.priceStatus.preliminary ? PRELIMINARY_NOTICE : 'All items at verified rates. Still a DRAFT: not certified.'), colSpan: 2, styles: { fontStyle: 'bold' as const } }],
    ],
    styles: { fontSize: 9 }, columnStyles: { 1: { halign: 'right' } }, margin: { left: 14, right: 14 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  doc.setFontSize(7);
  const notes = [
    ...(incomplete ? [] : boq.basis),
    `${boq.version}. Quantities are measured from the drawings listed or calculated by the trace shown per line; rates are the dated sources shown per line. ${DRAFT_NOTICE} Not a professional certification until reviewed by a registered quantity surveyor.`,
  ];
  for (const b of notes) {
    const wrapped = doc.splitTextToSize(pdfSafe(b), 180) as string[];
    if (y + wrapped.length * 3.5 > 285) { doc.addPage(); y = 16; }
    doc.text(wrapped, 14, y); y += wrapped.length * 3.5;
  }
  return new Uint8Array(doc.output('arraybuffer'));
}
