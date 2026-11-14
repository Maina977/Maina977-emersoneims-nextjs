/**
 * BOQ export to Excel with live formulas (P1-D). The workbook recomputes the
 * same totals as buildBoq: amounts are =quantity*rate, subtotals are SUMs,
 * and the adjustments use the same bases. Each formula also stores the value
 * computed by the engine, so a reader that does not recalculate sees it too.
 */
import ExcelJS from 'exceljs';
import type { Adjustments, Boq } from './boq';

export async function boqToXlsx(boq: Boq, adj: Adjustments, project: string): Promise<Buffer> {
  if (boq.grandTotal === null) throw new Error(`The bill is incomplete (${boq.unpricedItems.length} item(s) need a rate${boq.errors.length ? `; ${boq.errors.length} error(s)` : ''}); it cannot be exported as a priced BOQ`);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Building Suite Pro';
  const ws = wb.addWorksheet('BOQ');
  ws.columns = [{ width: 10 }, { width: 50 }, { width: 8 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 50 }];
  ws.addRow([`${project} · revision ${boq.revision}`]).font = { bold: true };
  ws.addRow(['Code', 'Description', 'Unit', 'Quantity', 'Rate (KES)', 'Amount (KES)', 'Rate source / quantity source']).font = { bold: true };
  const subtotalCells: string[] = [];
  for (const s of boq.sections) {
    ws.addRow([s.section]).font = { bold: true, italic: true };
    const first = ws.rowCount + 1;
    for (const l of boq.lines.filter((x) => x.section === s.section)) {
      const row = ws.addRow([l.code, l.description, l.unit, l.quantity, l.rate, null, `${l.rateNote} · ${l.quantitySource}`]);
      row.getCell(6).value = { formula: `ROUND(D${row.number}*E${row.number},2)`, result: l.amount ?? 0 };
    }
    const last = ws.rowCount;
    const sub = ws.addRow([null, `Subtotal: ${s.section}`]);
    sub.getCell(6).value = { formula: `SUM(F${first}:F${last})`, result: s.subtotal ?? 0 };
    sub.font = { bold: true };
    subtotalCells.push(`F${sub.number}`);
  }
  const add = (label: string, formula: string, result: number) => { const row = ws.addRow([null, label]); row.getCell(6).value = { formula, result }; row.font = { bold: true }; return `F${row.number}`; };
  ws.addRow([]);
  const mw = add('Measured works', subtotalCells.join('+'), boq.measuredWorks!);
  const pre = adj.preliminaries.kind === 'percent'
    ? add(`Preliminaries ${adj.preliminaries.pct} %`, `ROUND(${mw}*${adj.preliminaries.pct}/100,2)`, boq.preliminaries!)
    : add('Preliminaries (itemised)', adj.preliminaries.items.map((i) => i.amount).join('+') || '0', boq.preliminaries!);
  const con = add(`Contingency ${adj.contingencyPct} %`, `ROUND((${mw}+${pre})*${adj.contingencyPct}/100,2)`, boq.contingency!);
  const ohp = add(`Overheads & profit ${adj.overheadsProfitPct} %`, `ROUND((${mw}+${pre}+${con})*${adj.overheadsProfitPct}/100,2)`, boq.overheadsProfit!);
  const sbv = add('Subtotal before VAT', `ROUND(${mw}+${pre}+${con}+${ohp},2)`, boq.subtotalBeforeVat!);
  const vat = add(`VAT ${adj.vat.pct} % (from ${adj.vat.effectiveFrom})`, `ROUND(${sbv}*${adj.vat.pct}/100,2)`, boq.vat!);
  add('TOTAL', `ROUND(${sbv}+${vat},2)`, boq.grandTotal);
  ws.addRow([]);
  for (const b of boq.basis) ws.addRow([null, b]);
  ws.addRow([null, boq.version]);
  for (let i = 1; i <= ws.rowCount; i++) { ws.getRow(i).getCell(4).numFmt = '#,##0.000'; ws.getRow(i).getCell(5).numFmt = '#,##0.00'; ws.getRow(i).getCell(6).numFmt = '#,##0.00'; }
  return Buffer.from(await wb.xlsx.writeBuffer());
}
