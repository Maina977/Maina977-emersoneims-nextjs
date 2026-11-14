/**
 * BOQ report as PDF (P1-D, 2026-11-14), from the same Boq object as the Excel
 * export: every figure printed here is the engine's value, so screen, Excel
 * and PDF totals are identical. Includes the quantity source (measurements),
 * the rate source and date for every line, the calculation basis and the
 * engine versions. An incomplete bill is refused.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Boq } from './boq';

const kes = (x: number | null) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export function boqToPdf(boq: Boq, meta: { project: string; preparedBy: string; date: string; drawings?: string[] }): Uint8Array {
  if (boq.grandTotal === null) throw new Error(`The bill is incomplete (${boq.unpricedItems.length} item(s) need a rate${boq.errors.length ? `; ${boq.errors.length} error(s)` : ''}); it cannot be issued as a priced BOQ`);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFontSize(14); doc.text(`Bill of Quantities: ${meta.project}`, 14, 16);
  doc.setFontSize(9);
  doc.text(`Revision ${boq.revision} · prepared by ${meta.preparedBy} · ${meta.date}`, 14, 22);
  if (meta.drawings?.length) doc.text(`Measured from: ${meta.drawings.join('; ')}`.slice(0, 180), 14, 27);
  let y = 32;
  for (const s of boq.sections) {
    const lines = boq.lines.filter((l) => l.section === s.section);
    autoTable(doc, {
      startY: y,
      head: [[s.section, 'Unit', 'Quantity', 'Rate (KES)', 'Amount (KES)']],
      body: [
        ...lines.map((l) => [`${l.code}  ${l.description}\n${l.quantitySource} · ${l.rateNote}`, l.unit, l.quantity.toLocaleString('en-KE', { maximumFractionDigits: 3 }), kes(l.rate), kes(l.amount)]),
        [{ content: `Subtotal: ${s.section}`, colSpan: 4, styles: { fontStyle: 'bold' } }, { content: kes(s.subtotal), styles: { fontStyle: 'bold' } }],
      ],
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: { 0: { cellWidth: 95 }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;
  }
  autoTable(doc, {
    startY: y,
    head: [['Summary', 'Amount (KES)']],
    body: [
      ['Measured works', kes(boq.measuredWorks)], ['Preliminaries', kes(boq.preliminaries)], ['Contingency', kes(boq.contingency)],
      ['Overheads & profit', kes(boq.overheadsProfit)], ['Subtotal before VAT', kes(boq.subtotalBeforeVat)], ['VAT', kes(boq.vat)],
      [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }, { content: kes(boq.grandTotal), styles: { fontStyle: 'bold' } }],
    ],
    styles: { fontSize: 9 }, columnStyles: { 1: { halign: 'right' } }, margin: { left: 14, right: 14 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  doc.setFontSize(7);
  for (const b of [...boq.basis, `${boq.version}. Quantities are measured from the drawings listed; rates are the dated sources shown per line. Not a professional certification until reviewed by a registered quantity surveyor.`]) {
    const wrapped = doc.splitTextToSize(b, 180) as string[];
    if (y + wrapped.length * 3.5 > 285) { doc.addPage(); y = 16; }
    doc.text(wrapped, 14, y); y += wrapped.length * 3.5;
  }
  return new Uint8Array(doc.output('arraybuffer'));
}
