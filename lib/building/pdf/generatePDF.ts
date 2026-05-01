/**
 * PDF Generation Utility for Emerson EIMS
 * Generates downloadable PDF reports for calculator results, quotes, and service reports
 */

export interface GeneratorQuote {
  customerName?: string;
  date: string;
  calculatorType: 'generator' | 'solar' | 'ups' | 'fuel' | 'battery';
  inputs: Record<string, string | number>;
  results: {
    recommendation: string;
    sizing?: string;
    estimatedCost?: string;
    paybackPeriod?: string;
    specifications?: string[];
    notes?: string[];
  };
}

export interface ServiceReport {
  serviceId: string;
  date: string;
  customerName: string;
  location: string;
  equipmentType: string;
  equipmentDetails: string;
  serviceType: string;
  technician?: string;
  findings: string[];
  actionsPerformed: string[];
  partsUsed?: { item: string; quantity: number }[];
  recommendations?: string[];
  nextServiceDate?: string;
}

/**
 * Generate a PDF quote/report using browser's print functionality
 * This creates a printable HTML document that can be saved as PDF
 */
export function generateQuotePDF(quote: GeneratorQuote): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emerson EIMS - ${quote.calculatorType.toUpperCase()} Calculator Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      color: #1a1a2e; 
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
    .logo span { color: #f97316; }
    .meta { text-align: right; color: #666; font-size: 14px; }
    h1 { color: #1e40af; margin-bottom: 20px; font-size: 24px; }
    h2 { color: #2563eb; margin: 25px 0 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    .section { margin-bottom: 25px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; color: #374151; }
    .highlight-box {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
    }
    .highlight-box h3 { font-size: 14px; opacity: 0.9; margin-bottom: 8px; text-transform: uppercase; }
    .highlight-box .value { font-size: 28px; font-weight: bold; }
    .specs { background: #f9fafb; padding: 20px; border-radius: 8px; }
    .specs ul { list-style: none; }
    .specs li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .specs li:last-child { border-bottom: none; }
    .specs li::before { content: "✓ "; color: #22c55e; font-weight: bold; }
    .notes { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
    .notes p { margin: 5px 0; font-size: 14px; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .contact-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
    }
    .contact-item { text-align: center; }
    .contact-item .label { font-size: 12px; color: #666; }
    .contact-item .value { font-weight: 600; color: #1e40af; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Emerson<span>EIMS</span></div>
    <div class="meta">
      <div>Report Generated: ${quote.date}</div>
      ${quote.customerName ? `<div>Prepared for: ${quote.customerName}</div>` : ''}
      <div>Reference: ${Date.now().toString(36).toUpperCase()}</div>
    </div>
  </div>

  <h1>${getCalculatorTitle(quote.calculatorType)} Report</h1>

  <div class="section">
    <h2>📊 Input Parameters</h2>
    <table>
      <thead>
        <tr><th>Parameter</th><th>Value</th></tr>
      </thead>
      <tbody>
        ${Object.entries(quote.inputs).map(([key, value]) => `
          <tr><td>${formatLabel(key)}</td><td><strong>${value}</strong></td></tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="highlight-box">
    <h3>Recommended Solution</h3>
    <div class="value">${quote.results.recommendation}</div>
    ${quote.results.sizing ? `<div style="margin-top: 10px; opacity: 0.9;">Size: ${quote.results.sizing}</div>` : ''}
  </div>

  ${quote.results.estimatedCost ? `
  <div class="section">
    <h2>💰 Cost Estimate</h2>
    <table>
      <tr>
        <td>Estimated Investment</td>
        <td><strong style="font-size: 20px; color: #2563eb;">${quote.results.estimatedCost}</strong></td>
      </tr>
      ${quote.results.paybackPeriod ? `
      <tr>
        <td>Expected Payback Period</td>
        <td><strong>${quote.results.paybackPeriod}</strong></td>
      </tr>
      ` : ''}
    </table>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">
      * Prices are estimates and may vary. Contact us for accurate quotation.
    </p>
  </div>
  ` : ''}

  ${quote.results.specifications && quote.results.specifications.length > 0 ? `
  <div class="section">
    <h2>📋 Recommended Specifications</h2>
    <div class="specs">
      <ul>
        ${quote.results.specifications.map(spec => `<li>${spec}</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  ${quote.results.notes && quote.results.notes.length > 0 ? `
  <div class="section">
    <h2>📝 Important Notes</h2>
    <div class="notes">
      ${quote.results.notes.map(note => `<p>• ${note}</p>`).join('')}
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2>📞 Get Your Custom Quote</h2>
    <div class="contact-info">
      <div class="contact-item">
        <div class="label">Phone</div>
        <div class="value">+254768860665</div>
      </div>
      <div class="contact-item">
        <div class="label">Email</div>
        <div class="value">info@emersoneims.com</div>
      </div>
      <div class="contact-item">
        <div class="label">WhatsApp</div>
        <div class="value">+254768860665</div>
      </div>
    </div>
    <p style="text-align: center; color: #666; font-size: 14px;">
      Present this report for a <strong>5% discount</strong> on your first order!
    </p>
  </div>

  <div class="footer">
    <p><strong>Emerson Electrical & Industrial Maintenance Services (EIMS)</strong></p>
    <p>Nairobi, Kenya | www.emersoneims.com</p>
    <p style="margin-top: 10px;">This report is for estimation purposes only. Actual requirements may vary based on site assessment.</p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="
      background: #2563eb;
      color: white;
      border: none;
      padding: 15px 40px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    ">
      📄 Download as PDF
    </button>
    <p style="margin-top: 10px; color: #666; font-size: 14px;">
      Click the button above, then choose "Save as PDF" in the print dialog
    </p>
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generate a service report PDF
 */
export function generateServiceReportPDF(report: ServiceReport): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emerson EIMS - Service Report ${report.serviceId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      color: #1a1a2e; 
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
    .logo span { color: #f97316; }
    .badge {
      background: #22c55e;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
    }
    h1 { color: #1e40af; margin-bottom: 5px; font-size: 24px; }
    h2 { color: #2563eb; margin: 25px 0 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    .service-id { color: #666; font-size: 14px; margin-bottom: 20px; }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .detail-item .label { font-size: 12px; color: #666; text-transform: uppercase; }
    .detail-item .value { font-weight: 600; color: #1e40af; }
    ul { list-style: none; margin: 10px 0; }
    ul li { padding: 10px; background: #f9fafb; margin: 5px 0; border-radius: 6px; border-left: 3px solid #2563eb; }
    .findings li { border-left-color: #f59e0b; }
    .actions li { border-left-color: #22c55e; }
    .recommendations li { border-left-color: #3b82f6; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; font-weight: 600; color: #374151; }
    .next-service {
      background: #dbeafe;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
    }
    .next-service .date { font-size: 24px; font-weight: bold; color: #1e40af; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .signature-line {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 40px;
    }
    .signature-box {
      border-top: 1px solid #1a1a2e;
      padding-top: 10px;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Emerson<span>EIMS</span></div>
    <div class="badge">SERVICE REPORT</div>
  </div>

  <h1>Service Report</h1>
  <div class="service-id">Reference: ${report.serviceId} | Date: ${report.date}</div>

  <div class="details-grid">
    <div class="detail-item">
      <div class="label">Customer</div>
      <div class="value">${report.customerName}</div>
    </div>
    <div class="detail-item">
      <div class="label">Location</div>
      <div class="value">${report.location}</div>
    </div>
    <div class="detail-item">
      <div class="label">Equipment Type</div>
      <div class="value">${report.equipmentType}</div>
    </div>
    <div class="detail-item">
      <div class="label">Equipment Details</div>
      <div class="value">${report.equipmentDetails}</div>
    </div>
    <div class="detail-item">
      <div class="label">Service Type</div>
      <div class="value">${report.serviceType}</div>
    </div>
    ${report.technician ? `
    <div class="detail-item">
      <div class="label">Technician</div>
      <div class="value">${report.technician}</div>
    </div>
    ` : ''}
  </div>

  <h2>🔍 Findings</h2>
  <ul class="findings">
    ${report.findings.map(f => `<li>${f}</li>`).join('')}
  </ul>

  <h2>✅ Actions Performed</h2>
  <ul class="actions">
    ${report.actionsPerformed.map(a => `<li>${a}</li>`).join('')}
  </ul>

  ${report.partsUsed && report.partsUsed.length > 0 ? `
  <h2>🔧 Parts Used</h2>
  <table>
    <thead>
      <tr><th>Item</th><th>Quantity</th></tr>
    </thead>
    <tbody>
      ${report.partsUsed.map(p => `<tr><td>${p.item}</td><td>${p.quantity}</td></tr>`).join('')}
    </tbody>
  </table>
  ` : ''}

  ${report.recommendations && report.recommendations.length > 0 ? `
  <h2>📋 Recommendations</h2>
  <ul class="recommendations">
    ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
  </ul>
  ` : ''}

  ${report.nextServiceDate ? `
  <div class="next-service">
    <div style="font-size: 14px; color: #666;">Next Scheduled Service</div>
    <div class="date">${report.nextServiceDate}</div>
  </div>
  ` : ''}

  <div class="signature-line">
    <div class="signature-box">
      <div>Customer Signature</div>
    </div>
    <div class="signature-box">
      <div>Technician Signature</div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Emerson Electrical & Industrial Maintenance Services (EIMS)</strong></p>
    <p>Phone: +254768860665 | Email: info@emersoneims.com</p>
    <p>www.emersoneims.com</p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="
      background: #2563eb;
      color: white;
      border: none;
      padding: 15px 40px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    ">
      📄 Download as PDF
    </button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Helper functions
function getCalculatorTitle(type: string): string {
  const titles: Record<string, string> = {
    generator: '⚡ Generator Sizing',
    solar: '☀️ Solar System',
    ups: '🔋 UPS Sizing',
    fuel: '⛽ Fuel Consumption',
    battery: '🔋 Battery Backup'
  };
  return titles[type] || 'Calculator';
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
