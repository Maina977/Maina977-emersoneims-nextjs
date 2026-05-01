// QUALITY ASSURANCE VALIDATION
// Ensures design quality, component quality, and installation quality

export interface QualityCheck {
  id: string;
  name: string;
  category: 'design' | 'components' | 'installation' | 'documentation';
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  score: number; // 0-100
  message: string;
  recommendation: string;
  details: string[];
}

export interface QualityReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: QualityCheck[];
  summary: string;
  recommendations: string[];
  timestamp: Date;
}

class QualityAssurance {
  async validateDesignQuality(design: {
    systemKw: number;
    panelCount: number;
    inverterKw: number;
    batteryKwh: number;
    shadingLoss: number;
    voltageDrop: number;
    stringVoltage: number;
    maxSystemVoltage: number;
  }): Promise<QualityCheck[]> {
    const checks: QualityCheck[] = [];
    
    // Inverter sizing (should be 80-100% of DC size)
    const inverterRatio = design.inverterKw / design.systemKw;
    let inverterStatus: QualityCheck['status'] = 'pass';
    let inverterScore = 100;
    let inverterMessage = 'Inverter sizing optimal';
    
    if (inverterRatio < 0.8) {
      inverterStatus = 'warning';
      inverterScore = 70;
      inverterMessage = `Inverter undersized: ${(inverterRatio * 100).toFixed(0)}% of DC capacity`;
    } else if (inverterRatio > 1.2) {
      inverterStatus = 'warning';
      inverterScore = 80;
      inverterMessage = `Inverter oversized: ${(inverterRatio * 100).toFixed(0)}% of DC capacity`;
    }
    
    checks.push({
      id: 'QA-DES-001',
      name: 'Inverter Sizing',
      category: 'design',
      status: inverterStatus,
      score: inverterScore,
      message: inverterMessage,
      recommendation: 'Inverter should be 80-120% of DC array size',
      details: [`DC Array: ${design.systemKw}kW`, `Inverter: ${design.inverterKw}kW`, `Ratio: ${(inverterRatio * 100).toFixed(0)}%`]
    });
    
    // Battery sizing
    const batteryRatio = design.batteryKwh / (design.systemKw * 2);
    let batteryStatus: QualityCheck['status'] = 'pass';
    let batteryScore = 100;
    let batteryMessage = 'Battery sizing appropriate';
    
    if (batteryRatio < 0.5) {
      batteryStatus = 'warning';
      batteryScore = 60;
      batteryMessage = 'Battery may be undersized for backup requirements';
    } else if (batteryRatio > 2) {
      batteryStatus = 'warning';
      batteryScore = 75;
      batteryMessage = 'Battery may be oversized for typical usage';
    }
    
    checks.push({
      id: 'QA-DES-002',
      name: 'Battery Sizing',
      category: 'design',
      status: batteryStatus,
      score: batteryScore,
      message: batteryMessage,
      recommendation: 'Battery should provide 4-8 hours of backup for critical loads',
      details: [`System Size: ${design.systemKw}kW`, `Battery: ${design.batteryKwh}kWh`, `Backup Hours: ${(design.batteryKwh / (design.systemKw * 0.7)).toFixed(1)}h`]
    });
    
    // Shading loss
    let shadingStatus: QualityCheck['status'] = 'pass';
    let shadingScore = 100;
    let shadingMessage = 'Shading loss acceptable';
    
    if (design.shadingLoss > 15) {
      shadingStatus = 'fail';
      shadingScore = 40;
      shadingMessage = `High shading loss: ${design.shadingLoss}%`;
    } else if (design.shadingLoss > 10) {
      shadingStatus = 'warning';
      shadingScore = 70;
      shadingMessage = `Moderate shading loss: ${design.shadingLoss}%`;
    }
    
    checks.push({
      id: 'QA-DES-003',
      name: 'Shading Analysis',
      category: 'design',
      status: shadingStatus,
      score: shadingScore,
      message: shadingMessage,
      recommendation: 'Consider panel relocation or tree trimming to reduce shading',
      details: [`Annual Shading Loss: ${design.shadingLoss}%`, `Optimal Target: <10%`]
    });
    
    // Voltage drop
    let voltageStatus: QualityCheck['status'] = 'pass';
    let voltageScore = 100;
    let voltageMessage = 'Voltage drop within limits';
    
    if (design.voltageDrop > 3) {
      voltageStatus = 'fail';
      voltageScore = 50;
      voltageMessage = `Voltage drop exceeds 3%: ${design.voltageDrop}%`;
    } else if (design.voltageDrop > 2) {
      voltageStatus = 'warning';
      voltageScore = 80;
      voltageMessage = `Voltage drop near limit: ${design.voltageDrop}%`;
    }
    
    checks.push({
      id: 'QA-DES-004',
      name: 'Voltage Drop',
      category: 'design',
      status: voltageStatus,
      score: voltageScore,
      message: voltageMessage,
      recommendation: 'Reduce cable length or increase cable gauge',
      details: [`Voltage Drop: ${design.voltageDrop}%`, `Limit: 3%`]
    });
    
    // String voltage
    let stringStatus: QualityCheck['status'] = 'pass';
    let stringScore = 100;
    let stringMessage = 'String voltage within limits';
    
    if (design.stringVoltage > design.maxSystemVoltage * 0.9) {
      stringStatus = 'warning';
      stringScore = 75;
      stringMessage = `String voltage ${design.stringVoltage}V near ${design.maxSystemVoltage}V limit`;
    }
    
    checks.push({
      id: 'QA-DES-005',
      name: 'String Configuration',
      category: 'design',
      status: stringStatus,
      score: stringScore,
      message: stringMessage,
      recommendation: 'Ensure string voltage stays below inverter maximum',
      details: [`String Voltage: ${design.stringVoltage}V`, `Max: ${design.maxSystemVoltage}V`]
    });
    
    return checks;
  }
  
  async validateComponentQuality(components: {
    panels: Array<{ brand: string; wattage: number; efficiency: number; warranty: number }>;
    inverter: { brand: string; efficiency: number; warranty: number };
    battery: { brand: string; cycleLife: number; warranty: number };
  }): Promise<QualityCheck[]> {
    const checks: QualityCheck[] = [];
    
    // Panel quality
    const panelTier = this.getPanelTier(components.panels[0]?.brand);
    let panelScore = 100;
    let panelStatus: QualityCheck['status'] = 'pass';
    let panelMessage = 'Tier-1 panels selected';
    
    if (panelTier === 'tier2') {
      panelStatus = 'warning';
      panelScore = 70;
      panelMessage = 'Tier-2 panels selected - acceptable for budget projects';
    } else if (panelTier === 'tier3') {
      panelStatus = 'fail';
      panelScore = 40;
      panelMessage = 'Tier-3 panels - quality concerns';
    }
    
    checks.push({
      id: 'QA-COM-001',
      name: 'Panel Quality',
      category: 'components',
      status: panelStatus,
      score: panelScore,
      message: panelMessage,
      recommendation: 'Use Tier-1 panels for best reliability and warranty',
      details: [`Brand: ${components.panels[0]?.brand}`, `Efficiency: ${components.panels[0]?.efficiency}%`, `Warranty: ${components.panels[0]?.warranty} years`]
    });
    
    // Panel efficiency
    let efficiencyStatus: QualityCheck['status'] = 'pass';
    let efficiencyScore = 100;
    let efficiencyMessage = 'Panel efficiency good';
    
    if (components.panels[0]?.efficiency < 19) {
      efficiencyStatus = 'warning';
      efficiencyScore = 65;
      efficiencyMessage = `Low panel efficiency: ${components.panels[0]?.efficiency}%`;
    }
    
    checks.push({
      id: 'QA-COM-002',
      name: 'Panel Efficiency',
      category: 'components',
      status: efficiencyStatus,
      score: efficiencyScore,
      message: efficiencyMessage,
      recommendation: 'Consider higher efficiency panels for limited roof space',
      details: [`Efficiency: ${components.panels[0]?.efficiency}%`, `Target: >19%`]
    });
    
    // Inverter quality
    const inverterTier = this.getInverterTier(components.inverter.brand);
    let inverterStatus: QualityCheck['status'] = 'pass';
    let inverterScore = 100;
    let inverterMessage = 'Quality inverter selected';
    
    if (inverterTier === 'tier2') {
      inverterStatus = 'warning';
      inverterScore = 75;
      inverterMessage = 'Mid-tier inverter - acceptable';
    } else if (inverterTier === 'tier3') {
      inverterStatus = 'fail';
      inverterScore = 45;
      inverterMessage = 'Budget inverter - reliability concerns';
    }
    
    checks.push({
      id: 'QA-COM-003',
      name: 'Inverter Quality',
      category: 'components',
      status: inverterStatus,
      score: inverterScore,
      message: inverterMessage,
      recommendation: 'Select from top brands: SMA, Fronius, SolarEdge, Deye',
      details: [`Brand: ${components.inverter.brand}`, `Efficiency: ${components.inverter.efficiency}%`, `Warranty: ${components.inverter.warranty} years`]
    });
    
    // Battery quality
    let batteryStatus: QualityCheck['status'] = 'pass';
    let batteryScore = 100;
    let batteryMessage = 'Quality battery selected';
    
    if (components.battery.cycleLife < 4000) {
      batteryStatus = 'warning';
      batteryScore = 70;
      batteryMessage = `Battery cycle life ${components.battery.cycleLife} cycles - below premium`;
    }
    
    checks.push({
      id: 'QA-COM-004',
      name: 'Battery Quality',
      category: 'components',
      status: batteryStatus,
      score: batteryScore,
      message: batteryMessage,
      recommendation: 'Select LFP batteries with >6000 cycle life for best value',
      details: [`Brand: ${components.battery.brand}`, `Cycle Life: ${components.battery.cycleLife} cycles`, `Warranty: ${components.battery.warranty} years`]
    });
    
    return checks;
  }
  
  async generateQualityReport(design: any, components: any): Promise<QualityReport> {
    const designChecks = await this.validateDesignQuality(design);
    const componentChecks = await this.validateComponentQuality(components);
    
    const allChecks = [...designChecks, ...componentChecks];
    const totalScore = allChecks.reduce((sum, check) => sum + check.score, 0) / allChecks.length;
    
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 80) grade = 'B';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';
    else grade = 'F';
    
    const failedChecks = allChecks.filter(c => c.status === 'fail');
    const warningChecks = allChecks.filter(c => c.status === 'warning');
    
    const recommendations: string[] = [];
    for (const check of failedChecks) {
      recommendations.push(check.recommendation);
    }
    for (const check of warningChecks.slice(0, 3)) {
      recommendations.push(check.recommendation);
    }
    
    let summary = '';
    if (grade === 'A') summary = 'Excellent quality design. All parameters optimal.';
    else if (grade === 'B') summary = 'Good quality with minor improvements possible.';
    else if (grade === 'C') summary = 'Adequate quality. Several improvements recommended.';
    else if (grade === 'D') summary = 'Poor quality. Significant improvements needed.';
    else summary = 'Unacceptable quality. Redesign required.';
    
    return {
      overallScore: Math.round(totalScore),
      grade,
      checks: allChecks,
      summary,
      recommendations,
      timestamp: new Date()
    };
  }
  
  private getPanelTier(brand: string): 'tier1' | 'tier2' | 'tier3' {
    const tier1 = ['JA Solar', 'Longi', 'Trina', 'Canadian Solar', 'Jinko', 'Hanwha'];
    const tier2 = ['REC', 'Q Cells', 'Axitec', 'Hyundai'];
    
    if (tier1.includes(brand)) return 'tier1';
    if (tier2.includes(brand)) return 'tier2';
    return 'tier3';
  }
  
  private getInverterTier(brand: string): 'tier1' | 'tier2' | 'tier3' {
    const tier1 = ['SMA', 'Fronius', 'SolarEdge', 'Huawei'];
    const tier2 = ['Deye', 'Growatt', 'Solis', 'Goodwe'];
    
    if (tier1.includes(brand)) return 'tier1';
    if (tier2.includes(brand)) return 'tier2';
    return 'tier3';
  }
}

export const qualityAssurance = new QualityAssurance();