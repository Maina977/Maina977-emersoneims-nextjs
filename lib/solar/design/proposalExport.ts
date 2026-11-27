/**
 * Solar proposal exports (P1, 2026-11-20): Excel workbook and PDF.
 *
 * Both are rendered from the same Proposal object, so screen, Excel and PDF
 * cannot disagree. A DRAFT or REFUSED proposal is marked as such on every
 * page and sheet, with its reasons, and carries the revision hash. FOR ISSUE
 * is printed only when the proposal holds a verified approval.
 */
import ExcelJS from 'exceljs';
import { REQUEST_QUOTATION } from '../sizing';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Proposal } from './proposal';
import { APPROVAL_LOCKED_NOTICE } from './proposalApproval';
import { SLD_FONT, sldRows, TBS } from './sld';
import { shadingRows, SHADING_HEAD } from './shading';
export { shadingRows };

/**
 * jsPDF's built-in Helvetica covers only the WinAnsi character set. A character
 * outside it (≥, ≤, −, →, Greek letters...) corrupts the rest of that text run,
 * so PDF text is passed through this map first: the same words with ASCII
 * stand-ins (">=" for "≥"). Anything else outside WinAnsi becomes "?".
 */
const PDF_SUBST: Record<string, string> = { '≥': '>=', '≤': '<=', '−': '-', '→': '->', '÷': '/', '≈': '~', '≠': '!=', '√': 'sqrt', 'β': 'beta', 'γ': 'gamma', 'α': 'alpha', 'η': 'eta', 'ζ': 'zeta', 'θ': 'theta', 'φ': 'phi', 'Σ': 'sum', 'π': 'pi', 'ρ': 'rho', 'Δ': 'delta', 'δ': 'delta', 'μ': 'u', 'Ω': 'ohm', '₀': '0', '′': "'", '″': '"' };
const WINANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
export function pdfSafe(t: string): string {
  let out = '';
  for (const ch of String(t)) {
    const c = ch.codePointAt(0) as number;
    if (c < 0x80 || (c >= 0xa0 && c <= 0xff) || WINANSI_EXTRA.includes(ch)) out += ch;
    else out += PDF_SUBST[ch] ?? '?';
  }
  return out;
}
const safeRows = (rows: unknown[][]) => rows.map((r) => r.map((c) => pdfSafe(String(c))));

// REQ-19: an unquoted line says "Request a quotation" (lib/solar/sizing.ts), never a price.
const kes = (x: number | null) => (x === null ? REQUEST_QUOTATION : `KES ${Math.round(x).toLocaleString('en-KE')}`);
/** FOR ISSUE only with a verified approval; a FOR ISSUE status without one is shown as DRAFT. */
const issued = (p: Proposal) => p.status === 'FOR ISSUE' && p.approval !== null;
const banner = (p: Proposal) => (issued(p) ? 'FOR ISSUE' : `${p.status === 'FOR ISSUE' ? 'DRAFT' : p.status}: NOT FOR ISSUE`);
const approvalText = (p: Proposal) => (issued(p) && p.approval ? `Approved by ${p.approval.reviewerName} (${p.approval.registration}, reviewer ${p.approval.reviewerId}) on ${p.approval.approvedAt} for this revision` : APPROVAL_LOCKED_NOTICE);

export async function proposalToXlsx(p: Proposal): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Solar Genius Pro';
  const sum = wb.addWorksheet('Summary');
  sum.addRows([
    [`Solar proposal ${p.reference}`], [banner(p)], ['Revision (SHA-256 of the inputs)', p.revisionHash], ['Approval', approvalText(p)], [],
    ['Client', p.client.name], ['Site', p.client.siteAddress], ['Coordinates', `${p.client.lat}, ${p.client.lon}`],
    ['Mounting', p.site?.mounting ?? 'not entered'], ['Elevation (m)', p.site?.elevationM ?? 'not entered'], ['Usable area (m²)', p.site?.usableAreaM2 ?? 'not entered'], ['Site details source', p.site?.source ?? '—'], [],
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
  sum.getRow(2).font = { bold: true, color: { argb: issued(p) ? 'FF1B7F3A' : 'FFB00020' } };

  const chk = wb.addWorksheet('Design checks');
  chk.addRow(['Check', 'Verdict', 'Value', 'Limit', 'Unit', 'Margin %', 'Formula', 'Reference']);
  p.checks.forEach((c) => chk.addRow([c.title, c.verdict, c.value, c.limit, c.unit, c.marginPct, c.formula, c.reference]));

  const sch = wb.addWorksheet('Equipment & costs');
  sch.addRow(['Item', 'Model', 'Qty', 'Unit', 'Rate (KES)', 'Rate source', 'Rate date', 'Amount (KES)']);
  p.costing.lines.forEach((l) => sch.addRow([l.item, l.model, l.quantity, l.unit, l.rate?.valueKes ?? REQUEST_QUOTATION, l.rate?.source ?? '', l.rate?.date ?? '', l.amountKes ?? '']));
  sch.addRow([]); sch.addRow(['Capital cost', '', '', '', '', '', '', p.costing.capexKes ?? `No total: ${REQUEST_QUOTATION.toLowerCase()} for ${p.costing.unpriced.join(', ')}`]); // review A1 (REQ-19 wording)

  if (p.finance) {
    const cf = wb.addWorksheet('Cash flow');
    cf.addRow(['Year', 'Energy (kWh)', 'Savings (KES)', 'O&M (KES)', 'Net (KES)', 'Cumulative (KES)', 'Replacements (KES, quoted)']);
    p.finance.cashflows.forEach((c) => cf.addRow([c.year, c.energyKwh, c.savingsKes, c.omKes, c.netKes, c.cumulativeKes, c.replacementKes]));
    const se = wb.addWorksheet('Sensitivity');
    se.addRows([[p.finance.sensitivity.note], [], ['Variable', 'Change (%)', 'NPV (KES)', 'IRR (%)', 'Simple payback (years)']]);
    p.finance.sensitivity.rows.forEach((r) => se.addRow([r.variable, r.changePct, r.npvKes, r.irrPct ?? 'no unique IRR', r.simplePaybackYears ?? 'not within the lifetime']));
  }
  const sld = wb.addWorksheet('Single-line diagram');
  sld.addRows([[p.sld.title], [p.sld.legend], [`The drawing is in the PDF (last page) and on screen; it shows exactly these items.${p.sld.designValid ? '' : ' DESIGN CHECKS REFUSE THIS DESIGN: for review only.'}`], [], ['Component', 'Values (from the design) and items ' + TBS]]);
  sldRows(p.sld).forEach((r) => sld.addRow(r));
  sld.getColumn(1).width = 40; sld.getColumn(2).width = 140;

  if (p.shading) {
    const sh = wb.addWorksheet('Horizon shading');
    sh.addRows([['Horizon shading (beam blocked by the surveyed horizon)'], ['Horizon source', p.shading.horizon.source], ['Method', p.shading.method], ['Diffuse', p.shading.diffuseTreatment],
      ['Sky-view factor (horizontal)', p.shading.skyViewFactorHorizontal], ['Indicative diffuse loss, NOT applied (%)', p.shading.indicativeDiffuseLossPct ?? '—'],
      ['Annual energy unshaded / shaded (kWh)', `${p.shading.annual.unshadedAnnualKwh} / ${p.shading.annual.shadedAnnualKwh}`], [], SHADING_HEAD]);
    shadingRows(p.shading).forEach((r) => sh.addRow(r));
    sh.addRow([]); sh.addRow(['Horizon sectors (from °, to °, elevation °)']);
    p.shading.horizon.sectors.forEach((x) => sh.addRow(['', x.fromAzDeg, x.toAzDeg, x.elevationDeg]));
    sh.addRow(['Obstacles (name, height above array m, distance m, azimuth °, width m)']);
    p.shading.horizon.obstacles.forEach((o) => sh.addRow([o.name, o.heightAboveArrayM, o.distanceM, o.azimuthDeg, o.widthM]));
    sh.getColumn(1).width = 40; sh.getColumn(2).width = 30;
  }
  for (const ws of wb.worksheets) ws.getRow(ws === sum ? 1 : 1).font = { bold: true };
  return Buffer.from(await wb.xlsx.writeBuffer());
}

export function proposalToPdf(p: Proposal): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const mark = () => { doc.setFontSize(9); doc.setTextColor(issued(p) ? 27 : 176, issued(p) ? 127 : 0, issued(p) ? 58 : 32); doc.text(banner(p), 14, 8); doc.setTextColor(0, 0, 0); };
  mark();
  doc.setFontSize(16); doc.text(pdfSafe(`Solar proposal ${p.reference}`), 14, 18);
  doc.setFontSize(10); doc.text(pdfSafe(`${p.client.name} · ${p.client.siteAddress} (${p.client.lat}, ${p.client.lon})`), 14, 25);
  doc.setFontSize(8); doc.text(`Revision (SHA-256 of the inputs): ${p.revisionHash}`, 14, 30);
  doc.text(pdfSafe(approvalText(p)), 14, 34, { maxWidth: 182 });
  autoTable(doc, { startY: 40, head: [['System', '']], body: safeRows([
    ['Site', `${p.site ? [p.site.mounting ? `${p.site.mounting}-mounted` : 'mounting not entered', p.site.elevationM !== undefined ? `${p.site.elevationM} m elevation` : 'elevation not entered', p.site.usableAreaM2 !== undefined ? `${p.site.usableAreaM2} m² usable` : 'usable area not entered'].join(', ') + ` (${p.site.source})` : 'elevation, mounting and usable area not entered'}`],
    ['DC capacity', `${p.system.dcKwp} kWp (${p.system.modules} modules, ${p.system.strings} strings)`], ['AC capacity', `${p.system.acKw} kW`], ['Battery', p.system.batteryKwh === null ? 'none' : `${p.system.batteryKwh} kWh nominal`],
    ['Year-1 energy', `${p.energy.year1Kwh.toLocaleString('en-KE')} kWh (specific yield ${p.energy.specificYield} kWh/kWp, PR ${p.energy.performanceRatio})`], ['Used on site, year 1', p.energy.usefulYear1Kwh === null ? 'unknown' : `${p.energy.usefulYear1Kwh.toLocaleString('en-KE')} kWh`],
    ['Capital cost', kes(p.costing.capexKes)], ['NPV / IRR', p.finance ? `${kes(p.finance.npvKes)} / ${p.finance.irrPct ?? '—'} %` : '—'], ['Simple payback', p.finance?.simplePaybackYears != null ? `${p.finance.simplePaybackYears} years` : '—'], ['LCOE', p.finance ? `KES ${p.finance.lcoeKesPerKwh}/kWh` : '—'],
  ]), styles: { fontSize: 9 } });
  autoTable(doc, { head: [['Design check', 'Verdict', 'Value', 'Limit', 'Reference']], body: safeRows(p.checks.map((c) => [c.title, c.verdict, `${c.value} ${c.unit}`, `${c.limit} ${c.unit}`, c.reference])), styles: { fontSize: 8 } });
  autoTable(doc, { head: [['Item', 'Model', 'Qty', 'Rate', 'Source / date', 'Amount']], body: safeRows(p.costing.lines.map((l) => [l.item, l.model, `${l.quantity} ${l.unit}`, l.rate ? kes(l.rate.valueKes) : REQUEST_QUOTATION, l.rate ? `${l.rate.source}, ${l.rate.date}` : '', kes(l.amountKes)])), styles: { fontSize: 8 } });
  if (p.shading) {
    autoTable(doc, { head: [['Horizon shading', '']], body: safeRows([['Horizon source', p.shading.horizon.source], ['Method', p.shading.method], ['Diffuse', p.shading.diffuseTreatment], ['Sky-view factor (horizontal)', String(p.shading.skyViewFactorHorizontal)], ['Indicative diffuse loss (NOT applied)', p.shading.indicativeDiffuseLossPct === null ? '—' : `${p.shading.indicativeDiffuseLossPct} %`], ['Annual energy unshaded / shaded', `${p.shading.annual.unshadedAnnualKwh.toLocaleString('en-KE')} / ${p.shading.annual.shadedAnnualKwh.toLocaleString('en-KE')} kWh`]]), styles: { fontSize: 8 } });
    autoTable(doc, { head: safeRows([SHADING_HEAD]), body: safeRows(shadingRows(p.shading)), styles: { fontSize: 8 } });
  }
  if (p.finance) {
    autoTable(doc, { head: [['Sensitivity', 'Change', 'NPV', 'IRR', 'Payback']], body: safeRows(p.finance.sensitivity.rows.map((r) => [r.variable, `${r.changePct > 0 ? '+' : ''}${r.changePct} %`, kes(r.npvKes), r.irrPct === null ? 'no unique IRR' : `${r.irrPct} %`, r.simplePaybackYears === null ? 'not within the lifetime' : `${r.simplePaybackYears} years`])), foot: safeRows([[p.finance.sensitivity.note, '', '', '', '']]), styles: { fontSize: 8 } });
  }
  if (p.statusReasons.length) autoTable(doc, { head: [['Why this is not for issue']], body: safeRows(p.statusReasons.map((r) => [r])), styles: { fontSize: 8 } });
  autoTable(doc, { head: [['Disclosures']], body: safeRows(p.disclosures.map((d) => [d])), styles: { fontSize: 8 } });
  drawSldPage(doc, p);
  doc.setFontSize(7);
  const pages = doc.getNumberOfPages();
  for (let k = 1; k <= pages; k++) { doc.setPage(k); if (k > 1) mark(); doc.setFontSize(7); doc.text(pdfSafe(`${p.versions.join(' · ')}`) + ` · revision ${p.revisionHash.slice(0, 16)} · page ${k} of ${pages}`, 14, doc.internal.pageSize.getHeight() - 7); }
  return new Uint8Array(doc.output('arraybuffer'));
}

/** The single-line diagram on its own A4 landscape page, drawn from the same model as the screen SVG. */
function drawSldPage(doc: jsPDF, p: Proposal): void {
  const m = p.sld;
  doc.addPage('a4', 'landscape');
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
  const x0 = 10, y0 = 14;
  const k = Math.min((W - 20) / m.width, (H - 26) / m.height); // mm per drawing unit
  const pt = (u: number) => u * k * 2.8346; // drawing units → points
  const X = (u: number) => x0 + u * k, Y = (u: number) => y0 + u * k;
  doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0);
  doc.setFontSize(pt(16)); doc.setFont('helvetica', 'bold'); doc.text(pdfSafe(m.title), X(20), Y(28));
  doc.setFont('helvetica', 'normal'); doc.setFontSize(pt(SLD_FONT.line)); doc.text(pdfSafe(m.legend), X(20), Y(48));
  doc.setLineWidth(0.3);
  for (const w of m.wires) {
    doc.line(X(w.x1), Y(w.y1), X(w.x2), Y(w.y2));
    if (w.label) { doc.setFontSize(pt(8)); if (w.y1 === w.y2) doc.text(pdfSafe(w.label), X((w.x1 + w.x2) / 2), Y(w.y1 - 4), { align: 'center' }); else doc.text(pdfSafe(w.label), X(w.x1 + 4), Y((w.y1 + w.y2) / 2)); }
  }
  for (const b of m.boxes) {
    doc.setLineWidth(0.25);
    if (b.dashed) doc.setLineDashPattern([1.5, 1], 0);
    doc.rect(X(b.x), Y(b.y), b.w * k, b.h * k, 'S');
    if (b.dashed) doc.setLineDashPattern([], 0);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(pt(SLD_FONT.title)); doc.text(pdfSafe(b.title), X(b.x + 6), Y(b.y + 15));
    doc.setFont('helvetica', 'normal'); doc.setFontSize(pt(SLD_FONT.line));
    b.lines.forEach((l, j) => { if (l.includes(TBS)) doc.setTextColor(138, 75, 0); doc.text(pdfSafe(l), X(b.x + 6), Y(b.y + 30 + j * SLD_FONT.lineHeight)); doc.setTextColor(0, 0, 0); });
  }
}
