/**
 * Hub Quote/Audit Exporters
 * -------------------------
 * Pure functions that take an audit payload and produce a downloadable
 * file in the browser. jsPDF + ExcelJS are loaded via dynamic import so
 * they stay out of the initial Hub bundle (~250 KB combined).
 *
 * Per data policy: every output carries a clear "Indicative" / sample
 * banner. Nothing here invents prices — every number is a verbatim copy
 * of what the user sees on screen, with the source benchmark included
 * side-by-side so the recipient can audit our audit.
 */

import { CONTACT } from '@/lib/constants/contact';

// ────────────────────────────────────────────────────────────────────
// Public payload shape — kept narrow on purpose so any tool in the
// hub (Quote Audit, Verifier, future ones) can hand us the same shape.
// ────────────────────────────────────────────────────────────────────

export interface ExportLine {
  ref: string;
  description: string;
  scope: string;          // human-readable label (e.g. "Generator")
  qty: number;
  unit?: string;          // optional ("m", "ea", ...)
  unitPriceKes: number;
  catalogueKes?: number;  // benchmark, where known
}

export interface ExportFinding {
  ref: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  rule: string;
  detail: string;
  deltaPct?: number;
}

export interface ExportScopeRow {
  label: string;
  present: boolean;
  reason: string;          // why it matters when missing
  severity: 'danger' | 'warning' | 'info';
}

export interface ExportTier {
  tier: 'premium' | 'balanced' | 'budget';
  title: string;
  priceKes: number;
  highlights: string[];
  tradeoffs: string;
}

export interface ExportPayload {
  /** Document title — e.g. "Solar + UPS Quotation Audit". */
  title: string;
  /** Optional client / project name. */
  project?: string;
  /** Optional reference number; auto-generated if omitted. */
  reference?: string;
  /** Optional preparedFor recipient (company, contact). */
  preparedFor?: string;
  lines: ExportLine[];
  findings: ExportFinding[];
  scopeCoverage: ExportScopeRow[];
  tiers?: ExportTier[];
  /** Pre-calculated totals so the exporter never re-derives them. */
  totalKes: number;
  benchmarkKes: number;
}

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

const KES = (n: number) =>
  new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(Math.round(n));

const todayLabel = () =>
  new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date());

const refToken = () =>
  `EEIMS-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Defer revocation so Safari/Firefox finish the download stream.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

// ────────────────────────────────────────────────────────────────────
// PDF EXPORT
// ────────────────────────────────────────────────────────────────────

/**
 * Build a comprehensive multi-page PDF:
 *   1. Cover page (title + project + reference + date + contact)
 *   2. Executive summary KPIs (total / benchmark / variance / findings)
 *   3. Scope coverage matrix
 *   4. Findings table
 *   5. Line items table (full bill of quantities incl. accessories)
 *   6. Tier alternatives (premium / balanced / budget) — if provided
 *   7. Methodology + indicative-quote disclaimer
 */
export async function exportQuotePdf(payload: ExportPayload): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTableMod = await import('jspdf-autotable');
  // jspdf-autotable extends jsPDF's prototype as a side-effect of import.
  // We keep a typed handle for the function variant for clarity below.
  const autoTable = (autoTableMod as unknown as { default: typeof autoTableMod.default })
    .default ?? autoTableMod;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const reference = payload.reference ?? refToken();
  const overallDelta =
    payload.benchmarkKes > 0
      ? ((payload.totalKes - payload.benchmarkKes) / payload.benchmarkKes) * 100
      : 0;

  /* ── 1. Cover ───────────────────────────────────────────── */
  doc.setFillColor(11, 18, 32); // brand navy
  doc.rect(0, 0, pageWidth, 110, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('EmersonEIMS', margin, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Solar & UPS Intelligence Hub', margin, 68);
  doc.text(`${CONTACT.PRIMARY_PHONE_INTL}  ·  ${CONTACT.PRIMARY_EMAIL}`, margin, 84);

  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(payload.title, margin, 160);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let y = 190;
  if (payload.project) {
    doc.text(`Project: ${payload.project}`, margin, y); y += 16;
  }
  if (payload.preparedFor) {
    doc.text(`Prepared for: ${payload.preparedFor}`, margin, y); y += 16;
  }
  doc.text(`Reference: ${reference}`, margin, y); y += 16;
  doc.text(`Date: ${todayLabel()}`, margin, y); y += 16;

  // Indicative-quote banner
  doc.setFillColor(255, 247, 219);
  doc.setDrawColor(201, 166, 74);
  doc.roundedRect(margin, y + 12, pageWidth - margin * 2, 64, 6, 6, 'FD');
  doc.setTextColor(120, 80, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Indicative quotation — request a firm written quote', margin + 12, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    'Prices reference current Kenyan supplier RFQs and KEMSA / KPLC tariff bands. ' +
      'Final pricing is confirmed in writing on EmersonEIMS letterhead after a site survey.',
    margin + 12,
    y + 48,
    { maxWidth: pageWidth - margin * 2 - 24 },
  );

  /* ── 2. Executive summary ───────────────────────────────── */
  doc.addPage();
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Executive summary', margin, 60);

  autoTable(doc, {
    startY: 80,
    head: [['Metric', 'Value']],
    body: [
      ['Quotation total (KES)', KES(payload.totalKes)],
      ['Catalogue benchmark (KES)', KES(payload.benchmarkKes)],
      ['Overall variance', `${overallDelta > 0 ? '+' : ''}${overallDelta.toFixed(1)} %`],
      ['Open findings', String(payload.findings.length)],
      ['Lines audited (incl. accessories)', String(payload.lines.length)],
    ],
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [11, 18, 32], textColor: 255 },
    theme: 'grid',
    margin: { left: margin, right: margin },
  });

  /* ── 3. Scope coverage ──────────────────────────────────── */
  if (payload.scopeCoverage.length > 0) {
    autoTable(doc, {
      startY:
        ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable
          ?.finalY ?? 80) + 24,
      head: [['Scope', 'Covered?', 'If missing']],
      body: payload.scopeCoverage.map((s) => [
        s.label,
        s.present ? 'Yes' : 'No',
        s.present ? '—' : `${s.severity.toUpperCase()} · ${s.reason}`,
      ]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [11, 18, 32], textColor: 255 },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const txt = String(data.cell.raw);
          if (txt === 'No') data.cell.styles.textColor = [180, 30, 30];
          if (txt === 'Yes') data.cell.styles.textColor = [25, 130, 60];
        }
      },
      theme: 'striped',
      margin: { left: margin, right: margin },
    });
  }

  /* ── 4. Findings ────────────────────────────────────────── */
  if (payload.findings.length > 0) {
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Audit findings', margin, 60);

    autoTable(doc, {
      startY: 80,
      head: [['Severity', 'Ref', 'Rule', 'Detail', 'Δ %']],
      body: payload.findings.map((f) => [
        f.severity.toUpperCase(),
        f.ref,
        f.rule,
        f.detail,
        f.deltaPct != null ? `${f.deltaPct > 0 ? '+' : ''}${f.deltaPct.toFixed(1)}` : '—',
      ]),
      styles: { fontSize: 9, cellPadding: 5, valign: 'top' },
      headStyles: { fillColor: [11, 18, 32], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 70, font: 'courier' },
        4: { cellWidth: 50, halign: 'right' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          const sev = String(data.cell.raw).toLowerCase();
          if (sev === 'danger') data.cell.styles.textColor = [180, 30, 30];
          else if (sev === 'warning') data.cell.styles.textColor = [180, 110, 0];
          else if (sev === 'success') data.cell.styles.textColor = [25, 130, 60];
        }
      },
      margin: { left: margin, right: margin },
    });
  }

  /* ── 5. Line items (full BoQ incl. accessories) ─────────── */
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Bill of quantities (incl. accessories)', margin, 60);

  autoTable(doc, {
    startY: 80,
    head: [
      [
        'Ref',
        'Description',
        'Scope',
        'Qty',
        'Unit',
        'Unit price (KES)',
        'Benchmark (KES)',
        'Δ %',
        'Line total (KES)',
      ],
    ],
    body: payload.lines.map((l) => {
      const lineTotal = l.qty * l.unitPriceKes;
      const delta =
        l.catalogueKes != null
          ? ((l.unitPriceKes - l.catalogueKes) / l.catalogueKes) * 100
          : null;
      return [
        l.ref,
        l.description,
        l.scope,
        String(l.qty),
        l.unit ?? 'ea',
        KES(l.unitPriceKes),
        l.catalogueKes != null ? KES(l.catalogueKes) : '—',
        delta != null ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}` : '—',
        KES(lineTotal),
      ];
    }),
    foot: [
      [
        '',
        '',
        '',
        '',
        '',
        '',
        'TOTAL',
        '',
        KES(payload.totalKes),
      ],
    ],
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [11, 18, 32], textColor: 255 },
    footStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 60, font: 'courier' },
      3: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  /* ── 6. Tier alternatives ───────────────────────────────── */
  if (payload.tiers && payload.tiers.length > 0) {
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Alternative bills of quantities', margin, 60);

    autoTable(doc, {
      startY: 80,
      head: [['Tier', 'Headline price (KES)', 'Highlights', 'Trade-offs']],
      body: payload.tiers.map((t) => [
        t.title,
        KES(t.priceKes),
        t.highlights.map((h) => `• ${h}`).join('\n'),
        t.tradeoffs,
      ]),
      styles: { fontSize: 9, cellPadding: 6, valign: 'top' },
      headStyles: { fillColor: [11, 18, 32], textColor: 255 },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: margin, right: margin },
    });
  }

  /* ── 7. Methodology ─────────────────────────────────────── */
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Methodology & data provenance', margin, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const method = [
    '• Catalogue benchmarks reference current Kenyan supplier RFQs (2024–2026), KEMSA tender pricing where applicable, and KPLC commercial tariff bands.',
    '• Scope-coverage rules follow the EmersonEIMS engineering checklist for combined diesel-genset, PV and UPS installations (ATS, BMS, combiner, racking, wiring, switchgear, labour, warranty are all required).',
    '• Vague-line and misleading-claim checks flag phrasing such as “as per site”, “lump sum”, “genuine” or “lifetime” that need supporting evidence.',
    '• 10-year cost figures use diesel @ KES 195/L, KPLC commercial @ KES 28/kWh, 5 peak-equivalent sun hours, 80 % battery DoD, 92 % inverter efficiency, 85 % system derate. Update when local prices move.',
    '• Indicative quotation only — final pricing is confirmed in writing on EmersonEIMS letterhead after a site survey.',
  ];
  let my = 90;
  for (const line of method) {
    const split = doc.splitTextToSize(line, pageWidth - margin * 2);
    doc.text(split, margin, my);
    my += split.length * 14 + 6;
  }

  // Page footer with reference + page numbers
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${reference}  ·  ${todayLabel()}  ·  Page ${p} / ${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 18,
    );
  }

  doc.save(`${reference}-quotation-audit.pdf`);
}

// ────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ────────────────────────────────────────────────────────────────────

/**
 * Multi-sheet workbook:
 *   • Cover         (title, project, reference, date, contact, totals)
 *   • Bill of Qty   (every line incl. accessories, with formulae for line total)
 *   • Findings      (severity-coloured rows)
 *   • Scope         (covered / missing matrix)
 *   • Tiers         (premium / balanced / budget) — if provided
 *   • Methodology   (single column of provenance notes)
 */
export async function exportQuoteExcel(payload: ExportPayload): Promise<void> {
  const ExcelJS = (await import('exceljs')).default;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS Solar & UPS Hub';
  wb.created = new Date();

  const reference = payload.reference ?? refToken();
  const overallDelta =
    payload.benchmarkKes > 0
      ? ((payload.totalKes - payload.benchmarkKes) / payload.benchmarkKes) * 100
      : 0;

  /* ── Cover ──────────────────────────────────────────────── */
  const cover = wb.addWorksheet('Cover');
  cover.columns = [
    { width: 28 },
    { width: 60 },
  ];
  const coverRows: Array<[string, string]> = [
    ['EmersonEIMS', 'Solar & UPS Intelligence Hub'],
    ['Document', payload.title],
    ['Project', payload.project ?? '—'],
    ['Prepared for', payload.preparedFor ?? '—'],
    ['Reference', reference],
    ['Date', todayLabel()],
    ['Phone', CONTACT.PRIMARY_PHONE_INTL],
    ['Email', CONTACT.PRIMARY_EMAIL],
    ['', ''],
    ['Quotation total (KES)', KES(payload.totalKes)],
    ['Catalogue benchmark (KES)', KES(payload.benchmarkKes)],
    [
      'Overall variance',
      `${overallDelta > 0 ? '+' : ''}${overallDelta.toFixed(1)} %`,
    ],
    ['Lines audited (incl. accessories)', String(payload.lines.length)],
    ['Open findings', String(payload.findings.length)],
    ['', ''],
    [
      'Notice',
      'Indicative quotation — request a firm written quote on EmersonEIMS letterhead after a site survey.',
    ],
  ];
  coverRows.forEach((r, i) => {
    const row = cover.addRow(r);
    if (i === 0) {
      row.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0B1220' },
      };
    } else {
      row.getCell(1).font = { bold: true };
    }
  });
  cover.getRow(coverRows.length).getCell(2).alignment = { wrapText: true };

  /* ── Bill of quantities ────────────────────────────────── */
  const boq = wb.addWorksheet('Bill of Quantities');
  boq.columns = [
    { header: 'Ref',              key: 'ref',         width: 16 },
    { header: 'Description',      key: 'description', width: 50 },
    { header: 'Scope',            key: 'scope',       width: 18 },
    { header: 'Qty',              key: 'qty',         width: 8  },
    { header: 'Unit',             key: 'unit',        width: 8  },
    { header: 'Unit price (KES)', key: 'unitPrice',   width: 18 },
    { header: 'Benchmark (KES)',  key: 'benchmark',   width: 18 },
    { header: 'Delta %',          key: 'delta',       width: 10 },
    { header: 'Line total (KES)', key: 'lineTotal',   width: 20 },
  ];
  boq.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  boq.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B1220' },
  };

  payload.lines.forEach((l, i) => {
    const rowIdx = i + 2; // header is row 1
    const delta =
      l.catalogueKes != null
        ? ((l.unitPriceKes - l.catalogueKes) / l.catalogueKes) * 100
        : null;
    boq.addRow({
      ref: l.ref,
      description: l.description,
      scope: l.scope,
      qty: l.qty,
      unit: l.unit ?? 'ea',
      unitPrice: l.unitPriceKes,
      benchmark: l.catalogueKes ?? null,
      delta: delta,
      // formula keeps total live if a buyer edits qty / unit price in Excel
      lineTotal: { formula: `D${rowIdx}*F${rowIdx}` },
    });
  });

  // TOTAL row
  const totalRowIdx = payload.lines.length + 2;
  const totalRow = boq.addRow({
    ref: '',
    description: '',
    scope: '',
    qty: '',
    unit: '',
    unitPrice: '',
    benchmark: 'TOTAL',
    delta: '',
    lineTotal: {
      formula: `SUM(I2:I${totalRowIdx - 1})`,
    },
  });
  totalRow.font = { bold: true };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' },
  };

  // Number formats
  ['F', 'G', 'I'].forEach((col) => {
    boq.getColumn(col).numFmt = '#,##0';
  });
  boq.getColumn('H').numFmt = '+0.0;-0.0;0.0';

  /* ── Findings ──────────────────────────────────────────── */
  const findings = wb.addWorksheet('Findings');
  findings.columns = [
    { header: 'Severity', key: 'severity', width: 12 },
    { header: 'Ref',      key: 'ref',      width: 18 },
    { header: 'Rule',     key: 'rule',     width: 30 },
    { header: 'Detail',   key: 'detail',   width: 70 },
    { header: 'Delta %',  key: 'delta',    width: 10 },
  ];
  findings.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  findings.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B1220' },
  };

  for (const f of payload.findings) {
    const row = findings.addRow({
      severity: f.severity.toUpperCase(),
      ref: f.ref,
      rule: f.rule,
      detail: f.detail,
      delta: f.deltaPct ?? null,
    });
    const colour =
      f.severity === 'danger'  ? 'FFFFE3E3' :
      f.severity === 'warning' ? 'FFFFF3D6' :
      f.severity === 'success' ? 'FFE3F7E0' :
      'FFE9F2FF';
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colour } };
    row.alignment = { wrapText: true, vertical: 'top' };
  }
  findings.getColumn('E').numFmt = '+0.0;-0.0;0.0';

  /* ── Scope coverage ────────────────────────────────────── */
  const scope = wb.addWorksheet('Scope Coverage');
  scope.columns = [
    { header: 'Scope',          key: 'label',    width: 26 },
    { header: 'Covered?',       key: 'present',  width: 12 },
    { header: 'Severity',       key: 'severity', width: 12 },
    { header: 'If missing — why it matters', key: 'reason', width: 70 },
  ];
  scope.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  scope.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B1220' },
  };

  for (const s of payload.scopeCoverage) {
    const row = scope.addRow({
      label: s.label,
      present: s.present ? 'Yes' : 'No',
      severity: s.severity.toUpperCase(),
      reason: s.reason,
    });
    if (!s.present) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF3D6' },
      };
    }
    row.alignment = { wrapText: true, vertical: 'top' };
  }

  /* ── Tiers ─────────────────────────────────────────────── */
  if (payload.tiers && payload.tiers.length > 0) {
    const tiers = wb.addWorksheet('Tier Alternatives');
    tiers.columns = [
      { header: 'Tier',                key: 'title',      width: 18 },
      { header: 'Headline price (KES)', key: 'price',     width: 22 },
      { header: 'Highlights',          key: 'highlights', width: 60 },
      { header: 'Trade-offs',          key: 'tradeoffs',  width: 50 },
    ];
    tiers.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    tiers.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0B1220' },
    };
    for (const t of payload.tiers) {
      const row = tiers.addRow({
        title: t.title,
        price: t.priceKes,
        highlights: t.highlights.map((h) => `• ${h}`).join('\n'),
        tradeoffs: t.tradeoffs,
      });
      row.alignment = { wrapText: true, vertical: 'top' };
    }
    tiers.getColumn('B').numFmt = '#,##0';
  }

  /* ── Methodology ──────────────────────────────────────── */
  const method = wb.addWorksheet('Methodology');
  method.columns = [{ header: 'Provenance & assumptions', key: 'note', width: 110 }];
  method.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  method.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B1220' },
  };
  const notes = [
    'Catalogue benchmarks reference current Kenyan supplier RFQs (2024–2026), KEMSA tender pricing where applicable, and KPLC commercial tariff bands.',
    'Scope-coverage rules follow the EmersonEIMS engineering checklist for combined diesel-genset, PV and UPS installations.',
    'Vague-line and misleading-claim checks flag phrasing such as “as per site”, “lump sum”, “genuine” or “lifetime” that need supporting evidence.',
    '10-year cost figures use diesel @ KES 195/L, KPLC commercial @ KES 28/kWh, 5 peak-equivalent sun hours, 80 % battery DoD, 92 % inverter efficiency, 85 % system derate. Update when local prices move.',
    'Indicative quotation only — final pricing is confirmed in writing on EmersonEIMS letterhead after a site survey.',
  ];
  for (const n of notes) {
    const r = method.addRow({ note: n });
    r.alignment = { wrapText: true, vertical: 'top' };
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(blob, `${reference}-quotation-audit.xlsx`);
}
