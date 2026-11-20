/**
 * Solar proposal exports (P1, 2026-11-20): Excel workbook and PDF.
 *
 * Both are rendered from the same Proposal object, so screen, Excel and PDF
 * cannot disagree. A DRAFT or REFUSED proposal is marked as such on every
 * page and sheet, with its reasons.
 */
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Proposal } from './proposal';

const kes = (x: number | null) => (x === null ? 'rate required' : `KES ${Math.round(x).toLocaleString('en-KE')}`);
const banner = (p: Proposal) => (p.status === 'FOR ISSUE' ? 'FOR ISSUE' : `${p.status}: NOT FOR ISSUE`);

export async function proposalToXlsx(p: Proposal): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Solar Genius Pro';
  const sum = wb.addWorksheet('Summary');
  sum.addRows([
    [`Solar proposal ${p.reference}`], [banner(p)], [],
    ['Client', p.client.name], ['Site', p.client.siteAddress], ['Coordinates', `${p.client.lat}, ${p.client.lon}`], [],
    ['DC capacity (kWp)', p.system.dcKwp], ['AC capacity (kW)', p.system.acKw], ['Modules', p.system.modules], ['Strings', p.system.strings], ['Battery (kWh nominal)', p.system.batteryKwh ?? '—'], [],
    ['Year-1 energy (kWh)', p.energy.year1Kwh], ['Used on site, year 1 (kWh)', p.energy.usefulYear1Kwh ?? 'unknown'], ['Exported, year 1 (kWh)', p.energy.exportYear1Kwh], ['Clipped (kWh)', p.energy.clippedKwh], ['Specific yield (kWh/kWp)', p.energy.specificYield], ['Performance ratio', p.energy.performanceRatio], ['Energy source', p.energy.source], [],
    ['Capital cost', kes(p.costing.capexKes)],
    ['NPV', p.finance ? kes(p.finance.npvKes) : '—'], ['IRR (%)', p.finance?.irrPct ?? '—'], ['Simple payback (years)', p.finance?.simplePaybackYears ?? '—'], ['LCOE (KES/kWh)', p.finance?.lcoeKesPerKwh ?? '—'], [],
    ['Status reasons'], ...p.statusReasons.map((r) => ['', r]), [],
    ['Disclosures'], ...p.disclosures.map((d) => ['', d]), [],
    ['Versions', p.versions.join('; ')],
  ]);
  sum.getColumn(1).width = 30; sum.getColumn(2).width = 90;
  sum.getRow(1).font = { bold: true, size: 14 };
  sum.getRow(2).font = { bold: true, color: { argb: p.status === 'FOR ISSUE' ? 'FF1B7F3A' : 'FFB00020' } };

  const chk = wb.addWorksheet('Design checks');
  chk.addRow(['Check', 'Verdict', 'Value', 'Limit', 'Unit', 'Margin %', 'Formula', 'Reference']);
  p.checks.forEach((c) => chk.addRow([c.title, c.verdict, c.value, c.limit, c.unit, c.marginPct, c.formula, c.reference]));

  const sch = wb.addWorksheet('Equipment & costs');
  sch.addRow(['Item', 'Model', 'Qty', 'Unit', 'Rate (KES)', 'Rate source', 'Rate date', 'Amount (KES)']);
  p.costing.lines.forEach((l) => sch.addRow([l.item, l.model, l.quantity, l.unit, l.rate?.valueKes ?? 'rate required', l.rate?.source ?? '', l.rate?.date ?? '', l.amountKes ?? '']));
  sch.addRow([]); sch.addRow(['Capital cost', '', '', '', '', '', '', p.costing.capexKes ?? 'incomplete']);

  if (p.finance) {
    const cf = wb.addWorksheet('Cash flow');
    cf.addRow(['Year', 'Energy (kWh)', 'Savings (KES)', 'O&M (KES)', 'Net (KES)', 'Cumulative (KES)']);
    p.finance.cashflows.forEach((c) => cf.addRow([c.year, c.energyKwh, c.savingsKes, c.omKes, c.netKes, c.cumulativeKes]));
  }
  for (const ws of wb.worksheets) ws.getRow(ws === sum ? 1 : 1).font = { bold: true };
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export function proposalToPdf(p: Proposal): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const mark = () => { doc.setFontSize(9); doc.setTextColor(p.status === 'FOR ISSUE' ? 27 : 176, p.status === 'FOR ISSUE' ? 127 : 0, p.status === 'FOR ISSUE' ? 58 : 32); doc.text(banner(p), 14, 8); doc.setTextColor(0, 0, 0); };
  mark();
  doc.setFontSize(16); doc.text(`Solar proposal ${p.reference}`, 14, 18);
  doc.setFontSize(10); doc.text(`${p.client.name} · ${p.client.siteAddress} (${p.client.lat}, ${p.client.lon})`, 14, 25);
  autoTable(doc, { startY: 30, head: [['System', '']], body: [
    ['DC capacity', `${p.system.dcKwp} kWp (${p.system.modules} modules, ${p.system.strings} strings)`], ['AC capacity', `${p.system.acKw} kW`], ['Battery', p.system.batteryKwh === null ? 'none' : `${p.system.batteryKwh} kWh nominal`],
    ['Year-1 energy', `${p.energy.year1Kwh.toLocaleString('en-KE')} kWh (specific yield ${p.energy.specificYield} kWh/kWp, PR ${p.energy.performanceRatio})`], ['Used on site, year 1', p.energy.usefulYear1Kwh === null ? 'unknown' : `${p.energy.usefulYear1Kwh.toLocaleString('en-KE')} kWh`],
    ['Capital cost', kes(p.costing.capexKes)], ['NPV / IRR', p.finance ? `${kes(p.finance.npvKes)} / ${p.finance.irrPct ?? '—'} %` : '—'], ['Simple payback', p.finance?.simplePaybackYears != null ? `${p.finance.simplePaybackYears} years` : '—'], ['LCOE', p.finance ? `KES ${p.finance.lcoeKesPerKwh}/kWh` : '—'],
  ], styles: { fontSize: 9 } });
  autoTable(doc, { head: [['Design check', 'Verdict', 'Value', 'Limit', 'Reference']], body: p.checks.map((c) => [c.title, c.verdict, `${c.value} ${c.unit}`, `${c.limit} ${c.unit}`, c.reference]), styles: { fontSize: 8 } });
  autoTable(doc, { head: [['Item', 'Model', 'Qty', 'Rate', 'Source / date', 'Amount']], body: p.costing.lines.map((l) => [l.item, l.model, `${l.quantity} ${l.unit}`, l.rate ? kes(l.rate.valueKes) : 'rate required', l.rate ? `${l.rate.source}, ${l.rate.date}` : '', kes(l.amountKes)]), styles: { fontSize: 8 } });
  if (p.statusReasons.length) autoTable(doc, { head: [['Why this is not for issue']], body: p.statusReasons.map((r) => [r]), styles: { fontSize: 8 } });
  autoTable(doc, { head: [['Disclosures']], body: p.disclosures.map((d) => [d]), styles: { fontSize: 8 } });
  doc.setFontSize(7);
  const pages = doc.getNumberOfPages();
  for (let k = 1; k <= pages; k++) { doc.setPage(k); if (k > 1) mark(); doc.setFontSize(7); doc.text(`${p.versions.join(' · ')} · page ${k} of ${pages}`, 14, 290); }
  return new Uint8Array(doc.output('arraybuffer'));
}
