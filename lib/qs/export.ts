/**
 * BOQ export to Excel with live formulas (P1-D). The workbook recomputes the
 * same totals as buildBoq: amounts are =ROUND(quantity*rate,2), subtotals are
 * ROUND(SUM(),2), and the adjustments use the same bases. Each formula also
 * stores the value computed by the engine, so a reader that does not
 * recalculate sees it too. A built-up rate is a formula referring to its
 * block on the "Rate build-ups" sheet (resources, subtotals, net, O&P, rate).
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
import { DRAFT_NOTICE, PRELIMINARY_NOTICE, incompleteNotice, type Adjustments, type Boq } from './boq';
import { TIER_SHORT } from './rateBuildUp';

const money = (x: number) => Math.round(x * 100) / 100;

export async function boqToXlsx(boq: Boq, adj: Adjustments, project: string): Promise<Buffer> {
  const incomplete = incompleteNotice(boq);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Building Suite Pro';
  const ws = wb.addWorksheet('BOQ');
  ws.columns = [{ width: 10 }, { width: 50 }, { width: 8 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 60 }, { width: 50 }, { width: 40 }];
  // Rate build-ups (lib/qs/rateBuildUp) on their own sheet, with live formulas; the BOQ rate cell refers to the build-up's unit rate.
  const buildUpRateCell = writeBuildUps(wb, boq, project);
  ws.addRow([`${project} · revision ${boq.revision}`]).font = { bold: true };
  ws.addRow([DRAFT_NOTICE]).font = { bold: true, color: { argb: 'FFB45309' } };
  if (boq.priceStatus.notice) ws.addRow([boq.priceStatus.notice]).font = { bold: true, color: { argb: 'FFB45309' } };
  if (incomplete) {
    ws.addRow([incomplete]).font = { bold: true, color: { argb: 'FFB91C1C' } };
    for (const e of boq.errors) ws.addRow([null, `Error: ${e}`]);
  }
  ws.addRow(['Code', 'Description', 'Unit', 'Quantity', 'Rate (KES)', 'Amount (KES)', 'Quantity source (measurement or calculation trace)', 'Rate source', 'Price status']).font = { bold: true };
  const subtotalCells: string[] = [];
  for (const s of boq.sections) {
    ws.addRow([s.section]).font = { bold: true, italic: true };
    const first = ws.rowCount + 1;
    const lines = boq.lines.filter((x) => x.section === s.section);
    for (const l of lines) {
      const row = ws.addRow([l.code, l.description, l.unit, l.quantity, l.rate, null, l.quantitySource, l.rateNote, l.tierNote]);
      const bu = buildUpRateCell.get(l.code);
      if (bu && l.rate !== null) row.getCell(5).value = { formula: bu, result: l.rate };
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
  // Measured works by price status, always shown: indicative and verified money are never merged silently.
  ws.addRow([]);
  ws.addRow([null, 'Price status of the priced items (before adjustments)']).font = { bold: true };
  const ps = boq.priceStatus;
  ws.addRow([null, `Verified EmersonEIMS rates (${ps.verifiedItems.length} item(s))`, null, null, null, ps.verified]);
  ws.addRow([null, `Indicative market rates — preliminary budget only (${ps.indicativeItems.length} item(s))`, null, null, null, ps.indicative]);
  ws.addRow([null, `Unpriced — quotation required (${ps.unpricedItems.length} item(s)${ps.unpricedItems.length ? `: ${ps.unpricedItems.join(', ')}` : ''})`]);
  ws.addRow([null, ps.preliminary ? PRELIMINARY_NOTICE : 'All items at verified rates. Still a DRAFT: not certified.']).font = { bold: true };
  ws.addRow([null, boq.version]);
  ws.addRow([null, DRAFT_NOTICE]);
  for (let i = 1; i <= ws.rowCount; i++) { ws.getRow(i).getCell(4).numFmt = '#,##0.000'; ws.getRow(i).getCell(5).numFmt = '#,##0.00'; ws.getRow(i).getCell(6).numFmt = '#,##0.00'; }
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export const BUILDUP_SHEET = 'Rate build-ups';

/**
 * One block per item with a build-up: a row per resource (amount =
 * ROUND(qty × price × (1 + waste/100), 2)), material/labour/plant subtotals
 * (SUMIF), net, O&P and the unit rate. Returns item code → the unit-rate cell
 * reference, used by the BOQ rate cell. An incomplete build-up has no rate row.
 */
function writeBuildUps(wb: ExcelJS.Workbook, boq: Boq, project: string): Map<string, string> {
  const cells = new Map<string, string>();
  const lines = boq.lines.filter((l) => l.buildUp);
  if (!lines.length) return cells;
  const bs = wb.addWorksheet(BUILDUP_SHEET);
  bs.columns = [{ width: 10 }, { width: 10 }, { width: 44 }, { width: 8 }, { width: 14 }, { width: 14 }, { width: 9 }, { width: 16 }, { width: 50 }, { width: 12 }];
  bs.addRow([`${project} · revision ${boq.revision} · rate build-ups`]).font = { bold: true };
  bs.addRow([DRAFT_NOTICE]).font = { bold: true, color: { argb: 'FFB45309' } };
  bs.addRow([null, null, 'Material amount = quantity per BOQ unit × price × (1 + waste % / 100); labour and plant = hours × rate per hour; each rounded to 0.01. Unit rate = net + overheads & profit.']);
  bs.addRow(['Item', 'Kind', 'Description', 'Unit', 'Qty / BOQ unit', 'Price (KES)', 'Waste %', 'Amount (KES)', 'Price source', 'Price date', 'Price status']).font = { bold: true };
  for (const l of lines) {
    const b = l.buildUp!;
    bs.addRow([l.code, null, `${l.description}: build-up per ${l.unit}`]).font = { bold: true, italic: true };
    const first = bs.rowCount + 1;
    for (const r of b.lines) {
      const row = bs.addRow([null, r.kind, r.description, r.unit, r.quantity, r.price ?? 'price required', r.wastePct, null, r.source, r.date, r.tier ? TIER_SHORT[r.tier] : TIER_SHORT.unpriced]);
      row.getCell(8).value = r.amount === null ? 'price required' : { formula: `ROUND(E${row.number}*F${row.number}*(1+G${row.number}/100),2)`, result: r.amount };
    }
    const last = bs.rowCount;
    if (b.rate === null || b.net === null || b.ohp === null) {
      bs.addRow([null, null, `Build-up incomplete — rate required: ${[...b.errors, ...b.missing].join('; ')}`]).font = { bold: true, color: { argb: 'FFB91C1C' } };
      continue;
    }
    const sub = (label: string, kind: string, result: number) => { const row = bs.addRow([null, null, label]); row.getCell(8).value = { formula: `ROUND(SUMIF(B${first}:B${last},"${kind}",H${first}:H${last}),2)`, result }; };
    sub('Materials', 'material', b.materials); sub('Labour', 'labour', b.labour); sub('Plant', 'plant', b.plant);
    const net = bs.addRow([null, null, 'Net unit rate']); net.getCell(8).value = { formula: `ROUND(SUM(H${first}:H${last}),2)`, result: b.net };
    const ohp = bs.addRow([null, null, `Overheads & profit ${b.ohpPct} % (${b.ohpSource})`]); ohp.getCell(8).value = { formula: `ROUND(H${net.number}*${b.ohpPct}/100,2)`, result: b.ohp };
    const rate = bs.addRow([null, null, `Unit rate per ${l.unit} (to BOQ) — ${TIER_SHORT[b.tier!]}`]); rate.getCell(8).value = { formula: `ROUND(H${net.number}+H${ohp.number},2)`, result: b.rate };
    rate.font = { bold: true };
    cells.set(l.code, `'${BUILDUP_SHEET}'!H${rate.number}`);
  }
  bs.addRow([]);
  bs.addRow([null, null, DRAFT_NOTICE]);
  for (let i = 1; i <= bs.rowCount; i++) { bs.getRow(i).getCell(5).numFmt = '#,##0.000'; bs.getRow(i).getCell(6).numFmt = '#,##0.00'; bs.getRow(i).getCell(8).numFmt = '#,##0.00'; }
  return cells;
}
