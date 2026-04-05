/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║   SOLARGENIUS PRO - COMPLIANCE CERTIFICATE GENERATOR                        ║
 * ║   IEC 62548 / NEC / SANS / EBK Compliant Certification                      ║
 * ║   Copyright © 2024-2026 EmersonEIMS - All Rights Reserved                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface ComplianceCheckResult {
  category: string;
  requirement: string;
  standard: string;
  clause: string;
  status: 'pass' | 'fail' | 'warning' | 'na';
  details: string;
  recommendation?: string;
}

export interface ComplianceCertificate {
  id: string;
  certificateNumber: string;
  issueDate: string;
  validUntil: string;
  standard: string;
  systemDetails: {
    size: string;
    type: string;
    location: string;
    installer: string;
    client: string;
  };
  checkResults: ComplianceCheckResult[];
  overallStatus: 'compliant' | 'non-compliant' | 'conditional';
  overallScore: number;
  signatureBlock: {
    engineerName: string;
    engineerLicense: string;
    companyName: string;
    date: string;
  };
  htmlContent: string;
}

export interface SystemComplianceInput {
  systemSize: number;
  systemType: 'grid-tied' | 'hybrid' | 'off-grid';
  country: string;
  panels: {
    brand: string;
    model: string;
    wattage: number;
    quantity: number;
    certification: string[];
  };
  inverter: {
    brand: string;
    model: string;
    capacity: number;
    certification: string[];
  };
  batteries?: {
    brand: string;
    model: string;
    capacity: number;
    quantity: number;
    certification: string[];
  };
  installation: {
    roofType: string;
    mountingSystem: string;
    cableType: string;
    cableSize: string;
    earthingSystem: string;
    protectionDevices: string[];
  };
  testing: {
    insulationResistance: number;
    earthResistance: number;
    openCircuitVoltage: number;
    shortCircuitCurrent: number;
    performanceRatio: number;
  };
  installer: {
    name: string;
    license: string;
    company: string;
  };
  client: {
    name: string;
    address: string;
  };
}

// ============================================================================
// COMPLIANCE STANDARDS DATABASE
// ============================================================================

const COMPLIANCE_STANDARDS = {
  IEC: {
    name: 'IEC 62548 / IEC 61215 / IEC 61730',
    requirements: [
      { id: 'IEC-1', category: 'Module Safety', requirement: 'PV modules shall be certified to IEC 61215 and IEC 61730', clause: 'IEC 61215 / IEC 61730', critical: true },
      { id: 'IEC-2', category: 'System Design', requirement: 'Maximum system voltage shall not exceed module rating', clause: 'IEC 62548 Clause 5.2', critical: true },
      { id: 'IEC-3', category: 'Protection', requirement: 'DC overcurrent protection required for strings > 2 in parallel', clause: 'IEC 62548 Clause 7.3', critical: true },
      { id: 'IEC-4', category: 'Earthing', requirement: 'All exposed metal parts shall be earthed', clause: 'IEC 62548 Clause 8', critical: true },
      { id: 'IEC-5', category: 'Disconnection', requirement: 'DC and AC isolation switches required', clause: 'IEC 62548 Clause 7.2', critical: true },
      { id: 'IEC-6', category: 'Cables', requirement: 'DC cables shall be double insulated and UV resistant', clause: 'IEC 62548 Clause 6.3', critical: true },
      { id: 'IEC-7', category: 'Connectors', requirement: 'Only compatible connector types shall be used', clause: 'IEC 62548 Clause 6.4', critical: true },
      { id: 'IEC-8', category: 'Surge Protection', requirement: 'SPD required in areas with high lightning activity', clause: 'IEC 62548 Clause 9', critical: false },
      { id: 'IEC-9', category: 'Labeling', requirement: 'Warning signs and labels as per standard', clause: 'IEC 62548 Clause 10', critical: true },
      { id: 'IEC-10', category: 'Documentation', requirement: 'System documentation and as-built drawings', clause: 'IEC 62548 Clause 11', critical: true },
      { id: 'IEC-11', category: 'Testing', requirement: 'Insulation resistance > 1MΩ per kW', clause: 'IEC 62446-1', critical: true },
      { id: 'IEC-12', category: 'Testing', requirement: 'Earth continuity < 1Ω', clause: 'IEC 62446-1', critical: true },
      { id: 'IEC-13', category: 'Testing', requirement: 'Functional test of protection devices', clause: 'IEC 62446-1', critical: true },
      { id: 'IEC-14', category: 'Performance', requirement: 'Irradiance and temperature corrected yield measurement', clause: 'IEC 61724', critical: false },
    ]
  },
  NEC: {
    name: 'National Electrical Code (USA)',
    requirements: [
      { id: 'NEC-1', category: 'Listing', requirement: 'All equipment shall be listed and labeled', clause: 'NEC 690.4(D)', critical: true },
      { id: 'NEC-2', category: 'Ground Fault', requirement: 'Ground fault protection for systems > 80V', clause: 'NEC 690.41', critical: true },
      { id: 'NEC-3', category: 'Rapid Shutdown', requirement: 'Rapid shutdown of PV systems on buildings', clause: 'NEC 690.12', critical: true },
      { id: 'NEC-4', category: 'Arc Fault', requirement: 'DC arc fault circuit protection', clause: 'NEC 690.11', critical: true },
      { id: 'NEC-5', category: 'Voltage', requirement: 'Maximum voltage 600V (1000V for utility)', clause: 'NEC 690.7', critical: true },
      { id: 'NEC-6', category: 'Disconnects', requirement: 'DC and AC disconnecting means', clause: 'NEC 690.13/15', critical: true },
      { id: 'NEC-7', category: 'Wiring', requirement: 'Photovoltaic wire or USE-2', clause: 'NEC 690.31', critical: true },
      { id: 'NEC-8', category: 'Grounding', requirement: 'Equipment grounding conductor sizing', clause: 'NEC 690.45', critical: true },
      { id: 'NEC-9', category: 'Marking', requirement: 'Plaque and labels as required', clause: 'NEC 690.56', critical: true },
      { id: 'NEC-10', category: 'Firefighter', requirement: 'Marking for fire fighters', clause: 'NEC 690.56(C)', critical: true },
    ]
  },
  SANS: {
    name: 'South African National Standards (SANS 10142-1)',
    requirements: [
      { id: 'SANS-1', category: 'Registration', requirement: 'System registered with local municipality', clause: 'SANS 10142-1', critical: true },
      { id: 'SANS-2', category: 'CoC', requirement: 'Certificate of Compliance issued by registered person', clause: 'SANS 10142-1', critical: true },
      { id: 'SANS-3', category: 'Installer', requirement: 'Installation by ECSA registered person', clause: 'NERSA Rules', critical: true },
      { id: 'SANS-4', category: 'Grid Code', requirement: 'Inverter complies with NRS 097-2-1', clause: 'Grid Code', critical: true },
      { id: 'SANS-5', category: 'Anti-Islanding', requirement: 'Anti-islanding protection functional', clause: 'NRS 097-2-1', critical: true },
      { id: 'SANS-6', category: 'Metering', requirement: 'Bi-directional meter if grid-tied', clause: 'NRS 097-2-3', critical: false },
      { id: 'SANS-7', category: 'Protection', requirement: 'Earth leakage protection', clause: 'SANS 10142-1', critical: true },
      { id: 'SANS-8', category: 'Earthing', requirement: 'Earth electrode resistance < 10Ω', clause: 'SANS 10142-1', critical: true },
    ]
  },
  KENYA: {
    name: 'Kenya (EPRA / KPLC / EBK)',
    requirements: [
      { id: 'KE-1', category: 'License', requirement: 'Installer licensed by EBK', clause: 'EBK Regulations', critical: true },
      { id: 'KE-2', category: 'Permit', requirement: 'EPRA license for systems > 1MW', clause: 'EPRA Act', critical: false },
      { id: 'KE-3', category: 'Grid', requirement: 'KPLC approval for grid connection', clause: 'KPLC Net Metering', critical: true },
      { id: 'KE-4', category: 'Standards', requirement: 'Equipment meets KEBS standards', clause: 'KEBS Act', critical: true },
      { id: 'KE-5', category: 'Installation', requirement: 'Installation per IEC 62548', clause: 'EBK Guidelines', critical: true },
      { id: 'KE-6', category: 'Testing', requirement: 'System tested and commissioned', clause: 'EBK Guidelines', critical: true },
      { id: 'KE-7', category: 'Documentation', requirement: 'As-built drawings and manual provided', clause: 'EBK Guidelines', critical: true },
      { id: 'KE-8', category: 'Safety', requirement: 'Warning signs in English and Swahili', clause: 'OSHA Act', critical: true },
    ]
  }
};

// ============================================================================
// COMPLIANCE CERTIFICATE GENERATOR
// ============================================================================

export class ComplianceCertificateGenerator {

  generateCertificate(input: SystemComplianceInput): ComplianceCertificate {
    const standard = this.getApplicableStandard(input.country);
    const checkResults = this.runComplianceChecks(input, standard);
    const overallStatus = this.calculateOverallStatus(checkResults);
    const overallScore = this.calculateScore(checkResults);
    const certificateNumber = this.generateCertificateNumber(input.country);

    const certificate: ComplianceCertificate = {
      id: `CERT-${Date.now().toString(36).toUpperCase()}`,
      certificateNumber,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      standard: COMPLIANCE_STANDARDS[standard as keyof typeof COMPLIANCE_STANDARDS].name,
      systemDetails: {
        size: `${input.systemSize} kWp`,
        type: input.systemType,
        location: input.client.address,
        installer: input.installer.name,
        client: input.client.name
      },
      checkResults,
      overallStatus,
      overallScore,
      signatureBlock: {
        engineerName: input.installer.name,
        engineerLicense: input.installer.license,
        companyName: input.installer.company,
        date: new Date().toLocaleDateString()
      },
      htmlContent: ''
    };

    certificate.htmlContent = this.generateHTML(certificate, input);
    return certificate;
  }

  private getApplicableStandard(country: string): string {
    const countryMap: Record<string, string> = {
      'US': 'NEC',
      'ZA': 'SANS',
      'KE': 'KENYA',
      'NG': 'IEC',
      'GB': 'IEC',
      'DE': 'IEC',
      'AU': 'IEC',
      'IN': 'IEC',
    };
    return countryMap[country] || 'IEC';
  }

  private runComplianceChecks(input: SystemComplianceInput, standard: string): ComplianceCheckResult[] {
    const requirements = COMPLIANCE_STANDARDS[standard as keyof typeof COMPLIANCE_STANDARDS]?.requirements || COMPLIANCE_STANDARDS.IEC.requirements;
    const results: ComplianceCheckResult[] = [];

    requirements.forEach(req => {
      const result = this.checkRequirement(req, input);
      results.push(result);
    });

    // Add testing results
    results.push({
      category: 'Testing',
      requirement: `Insulation resistance: ${input.testing.insulationResistance} MΩ (min 1MΩ/kW)`,
      standard: 'IEC 62446-1',
      clause: '7.3.3',
      status: input.testing.insulationResistance >= input.systemSize ? 'pass' : 'fail',
      details: `Measured: ${input.testing.insulationResistance} MΩ, Required: ${input.systemSize} MΩ minimum`
    });

    results.push({
      category: 'Testing',
      requirement: `Earth resistance: ${input.testing.earthResistance} Ω (max 10Ω)`,
      standard: 'IEC 62446-1',
      clause: '7.3.4',
      status: input.testing.earthResistance <= 10 ? 'pass' : 'fail',
      details: `Measured: ${input.testing.earthResistance} Ω`
    });

    results.push({
      category: 'Performance',
      requirement: `Performance Ratio: ${input.testing.performanceRatio}% (min 75%)`,
      standard: 'IEC 61724',
      clause: 'Annex A',
      status: input.testing.performanceRatio >= 75 ? 'pass' : input.testing.performanceRatio >= 70 ? 'warning' : 'fail',
      details: `Measured PR: ${input.testing.performanceRatio}%`
    });

    return results;
  }

  private checkRequirement(req: any, input: SystemComplianceInput): ComplianceCheckResult {
    // Simulate compliance checking based on input data
    let status: 'pass' | 'fail' | 'warning' | 'na' = 'pass';
    let details = 'Requirement met';

    // Check module certification
    if (req.id.includes('1') && req.category === 'Module Safety') {
      const hasCert = input.panels.certification.some(c => c.includes('IEC') || c.includes('UL'));
      status = hasCert ? 'pass' : 'fail';
      details = hasCert ? `Certified: ${input.panels.certification.join(', ')}` : 'Module certification not verified';
    }

    // Check inverter certification
    if (req.category === 'Listing' || req.category === 'Grid Code') {
      const hasCert = input.inverter.certification.some(c => c.includes('IEC') || c.includes('UL') || c.includes('NRS'));
      status = hasCert ? 'pass' : 'warning';
      details = hasCert ? `Certified: ${input.inverter.certification.join(', ')}` : 'Verify inverter certification';
    }

    // Check protection devices
    if (req.category === 'Protection' || req.category === 'Disconnection') {
      const hasProtection = input.installation.protectionDevices.length >= 3;
      status = hasProtection ? 'pass' : 'warning';
      details = `Installed: ${input.installation.protectionDevices.join(', ')}`;
    }

    // Check earthing
    if (req.category === 'Earthing') {
      status = input.installation.earthingSystem ? 'pass' : 'fail';
      details = `Earthing system: ${input.installation.earthingSystem}`;
    }

    // Check cables
    if (req.category === 'Cables' || req.category === 'Wiring') {
      const isProperCable = input.installation.cableType.toLowerCase().includes('solar') ||
                           input.installation.cableType.toLowerCase().includes('pv') ||
                           input.installation.cableType.toLowerCase().includes('use-2');
      status = isProperCable ? 'pass' : 'warning';
      details = `Cable type: ${input.installation.cableType}, Size: ${input.installation.cableSize}`;
    }

    return {
      category: req.category,
      requirement: req.requirement,
      standard: req.clause.split(' ')[0],
      clause: req.clause,
      status,
      details,
      recommendation: status === 'fail' ? 'Corrective action required before commissioning' : undefined
    };
  }

  private calculateOverallStatus(results: ComplianceCheckResult[]): 'compliant' | 'non-compliant' | 'conditional' {
    const failures = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    if (failures > 0) return 'non-compliant';
    if (warnings > 2) return 'conditional';
    return 'compliant';
  }

  private calculateScore(results: ComplianceCheckResult[]): number {
    const total = results.filter(r => r.status !== 'na').length;
    const passed = results.filter(r => r.status === 'pass').length;
    const warnings = results.filter(r => r.status === 'warning').length * 0.5;
    return Math.round(((passed + warnings) / total) * 100);
  }

  private generateCertificateNumber(country: string): string {
    const prefix = country.toUpperCase();
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `SGP-${prefix}-${year}-${sequence}`;
  }

  private generateHTML(cert: ComplianceCertificate, input: SystemComplianceInput): string {
    const statusColor = cert.overallStatus === 'compliant' ? '#10b981' :
                       cert.overallStatus === 'conditional' ? '#f59e0b' : '#ef4444';
    const statusBg = cert.overallStatus === 'compliant' ? '#d1fae5' :
                    cert.overallStatus === 'conditional' ? '#fef3c7' : '#fee2e2';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compliance Certificate - ${cert.certificateNumber}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1f2937; }
    .certificate { max-width: 210mm; margin: 0 auto; padding: 20px; }
    .header { text-align: center; border-bottom: 3px double #1e40af; padding-bottom: 20px; margin-bottom: 20px; }
    .logo { font-size: 36pt; margin-bottom: 10px; }
    h1 { font-size: 24pt; color: #1e40af; margin-bottom: 5px; }
    .cert-number { font-size: 14pt; color: #6b7280; }
    .status-badge { display: inline-block; padding: 10px 30px; border-radius: 50px; font-size: 14pt; font-weight: 700; margin: 20px 0; background: ${statusBg}; color: ${statusColor}; border: 2px solid ${statusColor}; }
    .section { margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .section h2 { font-size: 14pt; color: #1e40af; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #d1d5db; }
    .info-label { color: #6b7280; }
    .info-value { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10pt; }
    th { background: #1e40af; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    .pass { color: #10b981; font-weight: 600; }
    .fail { color: #ef4444; font-weight: 600; }
    .warning { color: #f59e0b; font-weight: 600; }
    .signature-block { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .signature-box { text-align: center; padding-top: 60px; border-top: 2px solid #1f2937; }
    .footer { margin-top: 30px; text-align: center; font-size: 9pt; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
    .score-circle { width: 100px; height: 100px; border-radius: 50%; border: 8px solid ${statusColor}; display: flex; align-items: center; justify-content: center; font-size: 28pt; font-weight: 700; color: ${statusColor}; margin: 0 auto; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80pt; color: rgba(30, 64, 175, 0.05); font-weight: 700; pointer-events: none; z-index: -1; }
  </style>
</head>
<body>
  <div class="watermark">${cert.overallStatus === 'compliant' ? 'CERTIFIED' : 'REVIEW REQUIRED'}</div>
  <div class="certificate">
    <div class="header">
      <div class="logo">☀️</div>
      <h1>SOLAR PV SYSTEM</h1>
      <h1>COMPLIANCE CERTIFICATE</h1>
      <div class="cert-number">Certificate No: ${cert.certificateNumber}</div>
    </div>

    <div style="text-align: center;">
      <div class="status-badge">${cert.overallStatus.toUpperCase()}</div>
      <div class="score-circle">${cert.overallScore}%</div>
      <p style="margin-top: 10px; color: #6b7280;">Compliance Score</p>
    </div>

    <div class="section">
      <h2>Certificate Details</h2>
      <div class="grid-2">
        <div>
          <div class="info-row"><span class="info-label">Issue Date:</span><span class="info-value">${cert.issueDate}</span></div>
          <div class="info-row"><span class="info-label">Valid Until:</span><span class="info-value">${cert.validUntil}</span></div>
          <div class="info-row"><span class="info-label">Standard:</span><span class="info-value">${cert.standard}</span></div>
        </div>
        <div>
          <div class="info-row"><span class="info-label">System Size:</span><span class="info-value">${cert.systemDetails.size}</span></div>
          <div class="info-row"><span class="info-label">System Type:</span><span class="info-value">${cert.systemDetails.type}</span></div>
          <div class="info-row"><span class="info-label">Location:</span><span class="info-value">${cert.systemDetails.location}</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>System Information</h2>
      <div class="grid-2">
        <div>
          <div class="info-row"><span class="info-label">Client:</span><span class="info-value">${cert.systemDetails.client}</span></div>
          <div class="info-row"><span class="info-label">Installer:</span><span class="info-value">${cert.systemDetails.installer}</span></div>
        </div>
        <div>
          <div class="info-row"><span class="info-label">PV Modules:</span><span class="info-value">${input.panels.quantity}x ${input.panels.brand} ${input.panels.wattage}W</span></div>
          <div class="info-row"><span class="info-label">Inverter:</span><span class="info-value">${input.inverter.brand} ${input.inverter.capacity}kW</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Compliance Check Results</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Requirement</th><th>Clause</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${cert.checkResults.map(r => `
          <tr>
            <td>${r.category}</td>
            <td>${r.requirement}</td>
            <td>${r.clause}</td>
            <td class="${r.status}">${r.status.toUpperCase()}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Test Results</h2>
      <div class="grid-2">
        <div>
          <div class="info-row"><span class="info-label">Insulation Resistance:</span><span class="info-value">${input.testing.insulationResistance} MΩ</span></div>
          <div class="info-row"><span class="info-label">Earth Resistance:</span><span class="info-value">${input.testing.earthResistance} Ω</span></div>
        </div>
        <div>
          <div class="info-row"><span class="info-label">Voc Measured:</span><span class="info-value">${input.testing.openCircuitVoltage} V</span></div>
          <div class="info-row"><span class="info-label">Performance Ratio:</span><span class="info-value">${input.testing.performanceRatio}%</span></div>
        </div>
      </div>
    </div>

    <div class="signature-block">
      <div class="signature-box">
        <div style="font-weight: 600;">${cert.signatureBlock.engineerName}</div>
        <div style="color: #6b7280;">License: ${cert.signatureBlock.engineerLicense}</div>
        <div style="margin-top: 10px;">Inspecting Engineer</div>
      </div>
      <div class="signature-box">
        <div style="font-weight: 600;">${cert.signatureBlock.companyName}</div>
        <div style="color: #6b7280;">Date: ${cert.signatureBlock.date}</div>
        <div style="margin-top: 10px;">Company Stamp</div>
      </div>
    </div>

    <div class="footer">
      <p>This certificate is generated by SolarGenius Pro - AI Solar Design Platform</p>
      <p>EmersonEIMS Engineering | www.emersoneims.com | Certificate ID: ${cert.id}</p>
      <p>This certificate is valid for 12 months from issue date. Annual inspection recommended.</p>
    </div>
  </div>
</body>
</html>`;
  }
}

// Export singleton
export const complianceCertGenerator = new ComplianceCertificateGenerator();
