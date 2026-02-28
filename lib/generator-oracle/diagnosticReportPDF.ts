/**
 * GENERATOR ORACLE DIAGNOSTIC REPORT PDF
 * Professional PDF report generation for diagnostic results
 *
 * Uses browser print-to-PDF for maximum compatibility
 *
 * @copyright 2026 Generator Oracle
 */

import type { AIAnalysisResult } from './ai-diagnostic-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DiagnosticReport {
  reportId: string;
  generatedAt: string;
  technician?: {
    name: string;
    phone?: string;
    email?: string;
    signature?: string; // Base64 image
  };
  customer?: {
    name: string;
    phone?: string;
    email?: string;
    company?: string;
    signature?: string; // Base64 image
  };
  siteLocation?: {
    address: string;
    coordinates?: [number, number];
    notes?: string;
  };
  equipment: {
    type: string;
    brand: string;
    model: string;
    serialNumber?: string;
    engineHours?: number;
    kvaRating?: number;
    lastServiceDate?: string;
    controllerType?: string;
  };
  diagnosis: AIAnalysisResult;
  photos?: string[]; // Base64 images
  partsQuoted?: Array<{
    name: string;
    partNumber?: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
  }>;
  laborEstimate?: {
    hours: number;
    ratePerHour: number;
    total: number;
  };
  totalEstimateKES?: number;
  notes?: string;
  warranty?: string;
}

export interface ReportOptions {
  includePhotos?: boolean;
  includeSignatures?: boolean;
  includePricing?: boolean;
  includeDetailedAnalysis?: boolean;
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORT ID GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate unique report ID
 */
export function generateReportId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RPT-${dateStr}-${random}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTML REPORT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate HTML report for printing/PDF
 */
export function generateReportHTML(
  report: DiagnosticReport,
  options: ReportOptions = {}
): string {
  const {
    includePhotos = true,
    includeSignatures = true,
    includePricing = true,
    includeDetailedAnalysis = true,
    companyName = 'Generator Oracle',
    companyAddress = 'Nairobi, Kenya',
    companyPhone = '+254 768 860 665',
  } = options;

  const healthColor = getHealthColor(report.diagnosis.overallHealth);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnostic Report - ${report.reportId}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1e293b;
      background: white;
      padding: 20px;
    }

    .report {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    .logo-section h1 {
      font-size: 24px;
      color: #6366f1;
      margin-bottom: 4px;
    }

    .logo-section p {
      color: #64748b;
      font-size: 11px;
    }

    .report-info {
      text-align: right;
    }

    .report-id {
      font-size: 14px;
      font-weight: bold;
      color: #1e293b;
    }

    .report-date {
      font-size: 11px;
      color: #64748b;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1e293b;
      padding: 8px 12px;
      background: #f1f5f9;
      border-left: 4px solid #6366f1;
      margin-bottom: 12px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-card {
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .info-card h4 {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px dashed #e2e8f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #64748b;
    }

    .info-value {
      font-weight: 500;
      color: #1e293b;
    }

    .health-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      text-transform: uppercase;
      color: white;
      background: ${healthColor};
    }

    .health-score {
      font-size: 32px;
      font-weight: bold;
      color: ${healthColor};
    }

    .summary-box {
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .summary-critical {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .summary-warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }

    .summary-good {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }

    .issue-card {
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .issue-critical {
      background: #fef2f2;
      border-color: #ef4444;
    }

    .issue-warning {
      background: #fffbeb;
      border-color: #f59e0b;
    }

    .issue-title {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .issue-reading {
      font-family: monospace;
      font-size: 14px;
      color: #6366f1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }

    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f1f5f9;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
    }

    .text-right {
      text-align: right;
    }

    .total-row {
      font-weight: bold;
      background: #f8fafc;
    }

    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .signature-box {
      text-align: center;
    }

    .signature-box img {
      max-height: 60px;
      margin-bottom: 8px;
    }

    .signature-line {
      border-bottom: 1px solid #1e293b;
      margin-bottom: 8px;
      min-height: 60px;
    }

    .signature-label {
      font-size: 11px;
      color: #64748b;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .photo-grid img {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #64748b;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="report">
    <div class="no-print actions">
      <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
      <button class="btn btn-secondary" onclick="window.close()">Close</button>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <h1>${companyName}</h1>
        <p>${companyAddress}</p>
        <p>${companyPhone}</p>
      </div>
      <div class="report-info">
        <div class="report-id">${report.reportId}</div>
        <div class="report-date">${formatDate(report.generatedAt)}</div>
      </div>
    </div>

    <!-- Equipment & Customer Info -->
    <div class="section">
      <div class="section-title">Equipment & Customer Information</div>
      <div class="grid-2">
        <div class="info-card">
          <h4>Equipment Details</h4>
          <div class="info-row">
            <span class="info-label">Type:</span>
            <span class="info-value">${report.equipment.type}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Brand:</span>
            <span class="info-value">${report.equipment.brand}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Model:</span>
            <span class="info-value">${report.equipment.model}</span>
          </div>
          ${report.equipment.serialNumber ? `
          <div class="info-row">
            <span class="info-label">Serial No:</span>
            <span class="info-value">${report.equipment.serialNumber}</span>
          </div>` : ''}
          ${report.equipment.engineHours ? `
          <div class="info-row">
            <span class="info-label">Engine Hours:</span>
            <span class="info-value">${report.equipment.engineHours.toLocaleString()}</span>
          </div>` : ''}
          ${report.equipment.controllerType ? `
          <div class="info-row">
            <span class="info-label">Controller:</span>
            <span class="info-value">${report.equipment.controllerType}</span>
          </div>` : ''}
        </div>
        <div class="info-card">
          <h4>Customer</h4>
          ${report.customer ? `
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${report.customer.name}</span>
          </div>
          ${report.customer.company ? `
          <div class="info-row">
            <span class="info-label">Company:</span>
            <span class="info-value">${report.customer.company}</span>
          </div>` : ''}
          ${report.customer.phone ? `
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${report.customer.phone}</span>
          </div>` : ''}` : '<p style="color: #64748b;">Customer info not provided</p>'}

          ${report.siteLocation ? `
          <h4 style="margin-top: 12px;">Site Location</h4>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span class="info-value">${report.siteLocation.address}</span>
          </div>` : ''}
        </div>
      </div>
    </div>

    <!-- Diagnosis Summary -->
    <div class="section">
      <div class="section-title">Diagnostic Summary</div>
      <div class="grid-2">
        <div style="text-align: center; padding: 20px;">
          <div class="health-score">${report.diagnosis.healthScore}</div>
          <div style="margin-top: 8px;">
            <span class="health-badge">${report.diagnosis.overallHealth}</span>
          </div>
        </div>
        <div>
          <div class="summary-box ${report.diagnosis.criticalCount > 0 ? 'summary-critical' : report.diagnosis.warningCount > 0 ? 'summary-warning' : 'summary-good'}">
            <p style="font-weight: bold; margin-bottom: 8px;">${report.diagnosis.primaryDiagnosis.title}</p>
            <p>${report.diagnosis.executiveSummary}</p>
          </div>
          <div style="display: flex; gap: 20px;">
            <div><strong style="color: #ef4444;">${report.diagnosis.criticalCount}</strong> Critical</div>
            <div><strong style="color: #f59e0b;">${report.diagnosis.warningCount}</strong> Warnings</div>
            <div><strong style="color: #22c55e;">${report.diagnosis.normalCount}</strong> Normal</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues Found -->
    ${report.diagnosis.detailedAnalysis.length > 0 ? `
    <div class="section">
      <div class="section-title">Issues Found</div>
      ${report.diagnosis.detailedAnalysis.map(analysis => `
        <div class="issue-card ${analysis.issue.status === 'critical' || analysis.issue.status === 'emergency' ? 'issue-critical' : 'issue-warning'}">
          <div class="issue-title">${analysis.issue.title}</div>
          <div class="issue-reading">${analysis.issue.parameter}: ${analysis.issue.value} ${analysis.issue.unit}</div>
          <p style="margin-top: 8px;">${analysis.issue.description}</p>
          ${includeDetailedAnalysis ? `
          <div style="margin-top: 12px;">
            <strong>Most Likely Cause:</strong> ${analysis.rootCauses[0]?.cause || 'Unknown'}
            (${analysis.rootCauses[0]?.probability || 0}% probability)
          </div>
          <div style="margin-top: 8px;">
            <strong>Recommended Action:</strong> ${analysis.immediateActions[0] || 'Investigate further'}
          </div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Immediate Actions -->
    ${report.diagnosis.immediateActions.length > 0 ? `
    <div class="section">
      <div class="section-title">Recommended Actions</div>
      <ol style="padding-left: 20px;">
        ${report.diagnosis.immediateActions.map(action => `<li style="margin-bottom: 8px;">${action}</li>`).join('')}
      </ol>
    </div>` : ''}

    <!-- Parts Quote -->
    ${includePricing && report.partsQuoted && report.partsQuoted.length > 0 ? `
    <div class="section page-break">
      <div class="section-title">Parts Quotation</div>
      <table>
        <thead>
          <tr>
            <th>Part</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price (KES)</th>
            <th class="text-right">Total (KES)</th>
          </tr>
        </thead>
        <tbody>
          ${report.partsQuoted.map(part => `
          <tr>
            <td>${part.name}</td>
            <td class="text-right">${part.quantity}</td>
            <td class="text-right">${part.unitPrice.toLocaleString()}</td>
            <td class="text-right">${(part.totalPrice ?? part.quantity * part.unitPrice).toLocaleString()}</td>
          </tr>`).join('')}
          ${report.laborEstimate ? `
          <tr>
            <td>Labor (${report.laborEstimate.hours} hours @ KES ${report.laborEstimate.ratePerHour.toLocaleString()}/hr)</td>
            <td></td>
            <td></td>
            <td class="text-right">${report.laborEstimate.total.toLocaleString()}</td>
          </tr>` : ''}
          <tr class="total-row">
            <td colspan="3">TOTAL ESTIMATE</td>
            <td class="text-right">KES ${report.totalEstimateKES?.toLocaleString() || '0'}</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size: 10px; color: #64748b;">* Prices are estimates and may vary based on availability and market conditions.</p>
    </div>` : ''}

    <!-- Photos -->
    ${includePhotos && report.photos && report.photos.length > 0 ? `
    <div class="section">
      <div class="section-title">Site Photos</div>
      <div class="photo-grid">
        ${report.photos.map(photo => `<img src="${photo}" alt="Site photo">`).join('')}
      </div>
    </div>` : ''}

    <!-- Notes -->
    ${report.notes ? `
    <div class="section">
      <div class="section-title">Additional Notes</div>
      <p>${report.notes}</p>
    </div>` : ''}

    <!-- Signatures -->
    ${includeSignatures ? `
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line">
          ${report.technician?.signature ? `<img src="${report.technician.signature}" alt="Technician signature">` : ''}
        </div>
        <div class="signature-label">
          <strong>Technician:</strong> ${report.technician?.name || '_________________'}<br>
          Date: ${new Date().toLocaleDateString()}
        </div>
      </div>
      <div class="signature-box">
        <div class="signature-line">
          ${report.customer?.signature ? `<img src="${report.customer.signature}" alt="Customer signature">` : ''}
        </div>
        <div class="signature-label">
          <strong>Customer:</strong> ${report.customer?.name || '_________________'}<br>
          Date: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>Report generated by ${companyName} - Generator Oracle Diagnostic System</p>
      <p>Report ID: ${report.reportId} | Generated: ${formatDate(report.generatedAt)}</p>
      ${report.warranty ? `<p>Warranty: ${report.warranty}</p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Open print-friendly report in new window
 */
export function printReport(
  report: DiagnosticReport,
  options: ReportOptions = {}
): Window | null {
  const html = generateReportHTML(report, options);

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }

  return printWindow;
}

/**
 * Generate PDF using browser print (returns blob for download)
 */
export async function generatePDFBlob(
  report: DiagnosticReport,
  options: ReportOptions = {}
): Promise<Blob | null> {
  // Create hidden iframe for PDF generation
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.width = '800px';
  iframe.style.height = '1px';
  document.body.appendChild(iframe);

  try {
    const html = generateReportHTML(report, options);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) throw new Error('Cannot access iframe document');

    doc.open();
    doc.write(html);
    doc.close();

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use print API to get PDF - this opens print dialog
    // For true programmatic PDF, a library like jsPDF would be needed
    iframe.contentWindow?.print();

    return null; // Browser handles PDF via print dialog
  } finally {
    document.body.removeChild(iframe);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get color for health status
 */
function getHealthColor(health: string): string {
  const colors: Record<string, string> = {
    excellent: '#22c55e',
    good: '#84cc16',
    fair: '#f59e0b',
    poor: '#f97316',
    critical: '#ef4444',
  };
  return colors[health] || '#64748b';
}

/**
 * Create empty report template
 */
export function createEmptyReport(diagnosis: AIAnalysisResult): DiagnosticReport {
  return {
    reportId: generateReportId(),
    generatedAt: new Date().toISOString(),
    equipment: {
      type: 'Diesel Generator',
      brand: '',
      model: '',
    },
    diagnosis,
  };
}
