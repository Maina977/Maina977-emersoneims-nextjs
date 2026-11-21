/**
 * BOQ export to Excel with live formulas (P1-D). The workbook recomputes the
 * same totals as buildBoq: amounts are =ROUND(quantity*rate,2), subtotals are
 * ROUND(SUM(),2), and the adjustments use the same bases. Each formula also
 * stores the value computed by the engine, so a reader that does not
 * recalculate sees it too.
 *
 * Every export is a DRAFT: nothing in the workbook says it is approved,
 * certified or issued for tender, because no reviewer is authenticated here.
 *
 * An incomplete bill (a line without a rate, or an error) can still be
 * exported so the work is not lost, but it is marked INCOMPLETE: an unpriced
 * line shows "rate required" with no rate and no amount, a section with
 * unpriced lines shows a "priced items only" subtotal, and there are no
 * adjustments and no TOTAL, only the priced items labelled "not a bill total".
 */
import ExcelJS from 'exceljs';
import { DRAFT_NOTICE, incompleteNotice, type Adjustments, type Boq } from './boq';

const money = (x: number) => Math.round(x * 100) / 100;

export async function boqToXlsx(boq: Boq, adj: Adjustments, project: string): Promise<Buffer> {
  const incomplete = incompleteNotice(boq);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Building Suite Pro';
  const ws = wb.addWorksheet('BOQ');
  ws.columns = [{ width: 10 }, { width: 50 }, { width: 8 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 60 }, { width: 50 }];
  ws.addRow([`${project} · revision ${boq.revision}`]).font = { bold: true };
  ws.addRow([DRAFT_NOTICE]).font = { bold: true, color: { argb: 'FFB45309' } };
  if (incomplete) {
    ws.addRow([incomplete]).font = { bold: true, color: { argb: 'FFB91C1C' } };
    for (const e of boq.errors) ws.addRow([null, `Error: ${e}`]);
  }
  ws.addRow(['Code', 'Description', 'Unit', 'Quantity', 'Rate (KES)', 'Amount (KES)', 'Quantity source (measurement or calculation trace)', 'Rate source']).font = { bold: true };
  const subtotalCells: string[] = [];
  for (const s of boq.sections) {
    ws.addRow([s.section]).font = { bold: true, italic: true };
    const first = ws.rowCount + 1;
    const lines = boq.lines.filter((x) => x.section === s.section);
    for (const l of lines) {
      const row = ws.addRow([l.code, l.description, l.unit, l.quantity, l.rate, null, l.quantitySource, l.rateNote]);
      // An unpriced line has no rate and no amount: the cell says so, and SUM() skips text.
      row.getCell(6).value = l.amount === null ? 'rate required' : { formula: `ROUND(D${row.number}*E${row.number},2)`, result: l.amount };
    }
    const last = ws.rowCount;
    const priced = money(lines.reduce((a, l) => a + (l.amount ?? 0), 0));
    const sub = ws.addRow([null, s.unpriced ? `Subtotal: ${s.section} (priced items only — INCOMPLETE, ${s.unpriced} unpriced)` : `Subtotal: ${s.section}`]);
    sub.getCell(6).value = { formula: `ROUND(SUM(F${first}:F${last}),2)`, result: s.subtotal ?? priced };
    sub.font = { bold: true };
    subtotalCells.push(`F${sub.number}`);
  }
  const add = (label: string, formula: string, result: number) => { const row = ws.addRow([null, label]); row.getCell(6).value = { formula, result }; row.font = { bold: true }; return `F${row.number}`; };
  ws.addRow([]);
  if (incomplete) {
    add('Priced items only (INCOMPLETE — not a bill total)', `ROUND(${subtotalCells.join('+') || '0'},2)`, boq.pricedSubtotal);
    const t = ws.addRow([null, 'TOTAL: not available until every item is priced and every error is resolved']);
    t.font = { bold: true };
  } else {
    const mw = add('Measured works', `ROUND(${subtotalCells.join('+')},2)`, boq.measuredWorks!);
    const pre = adj.preliminaries.kind === 'percent'
      ? add(`Preliminaries ${adj.preliminaries.pct} %`, `ROUND(${mw}*${adj.preliminaries.pct}/100,2)`, boq.preliminaries!)
      : add('Preliminaries (itemised)', `ROUND(${adj.preliminaries.items.map((i) => `(${i.amount})`).join('+') || '0'},2)`, boq.preliminaries!);
    const con = add(`Contingency ${adj.contingencyPct} %`, `ROUND((${mw}+${pre})*${adj.contingencyPct}/100,2)`, boq.contingency!);
    const ohp = add(`Overheads & profit ${adj.overheadsProfitPct} %`, `ROUND((${mw}+${pre}+${con})*${adj.overheadsProfitPct}/100,2)`, boq.overheadsProfit!);
    const sbv = add('Subtotal before VAT', `ROUND(${mw}+${pre}+${con}+${ohp},2)`, boq.subtotalBeforeVat!);
    const vat = add(`VAT ${adj.vat.pct} % (from ${adj.vat.effectiveFrom})`, `ROUND(${sbv}*${adj.vat.pct}/100,2)`, boq.vat!);
    add('TOTAL', `ROUND(${sbv}+${vat},2)`, boq.grandTotal!);
    ws.addRow([]);
    for (const b of boq.basis) ws.addRow([null, b]);
  }
  ws.addRow([null, boq.version]);
  ws.addRow([null, DRAFT_NOTICE]);
  for (let i = 1; i <= ws.rowCount; i++) { ws.getRow(i).getCell(4).numFmt = '#,##0.000'; ws.getRow(i).getCell(5).numFmt = '#,##0.00'; ws.getRow(i).getCell(6).numFmt = '#,##0.00'; }
  return Buffer.from(await wb.xlsx.writeBuffer());
}
