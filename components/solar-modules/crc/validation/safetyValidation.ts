// SAFETY VALIDATION
// Fire safety, electrical safety, structural safety, environmental safety

export interface SafetyCheck {
  id: string;
  name: string;
  category: 'fire' | 'electrical' | 'structural' | 'environmental';
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  message: string;
  recommendation: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface SafetyReport {
  overallStatus: 'safe' | 'caution' | 'unsafe';
  checks: SafetyCheck[];
  score: number; // 0-100
  summary: string;
  timestamp: Date;
}

class SafetyValidation {
  async validateFireSafety(config: {
    hasArcFaultProtection: boolean;
    hasSurgeProtection: boolean;
    cableType: string;
    clearanceInverter: number;
    clearanceBattery: number;
    hasSmokeDetector: boolean;
    hasFireExtinguisher: boolean;
  }): Promise<SafetyCheck[]> {
    const checks: SafetyCheck[] = [];
    
    // Arc fault protection
    checks.push({
      id: 'FIRE-001',
      name: 'Arc Fault Protection',
      category: 'fire',
      status: config.hasArcFaultProtection ? 'pass' : 'fail',
      message: config.hasArcFaultProtection ? 'AFCI installed' : 'No arc fault protection detected',
      recommendation: 'Install AFCI breaker on DC side',
      severity: 'critical'
    });
    
    // Surge protection
    checks.push({
      id: 'FIRE-002',
      name: 'Surge Protection',
      category: 'fire',
      status: config.hasSurgeProtection ? 'pass' : 'fail',
      message: config.hasSurgeProtection ? 'SPD installed' : 'No surge protection detected',
      recommendation: 'Install Type 1+2 SPD at AC and DC inputs',
      severity: 'major'
    });
    
    // Cable type
    let cableStatus: SafetyCheck['status'] = 'pass';
    let cableMessage = 'Cable type acceptable';
    if (!['LSZH', 'XLPE', 'FR'].includes(config.cableType)) {
      cableStatus = 'warning';
      cableMessage = `Cable type ${config.cableType} not fire-rated`;
    }
    checks.push({
      id: 'FIRE-003',
      name: 'Fire-Rated Cables',
      category: 'fire',
      status: cableStatus,
      message: cableMessage,
      recommendation: 'Use LSZH or XLPE cables for fire safety',
      severity: 'major'
    });
    
    // Clearance
    if (config.clearanceInverter < 1) {
      checks.push({
        id: 'FIRE-004',
        name: 'Inverter Clearance',
        category: 'fire',
        status: 'fail',
        message: `Insufficient clearance: ${config.clearanceInverter}m (need 1m)`,
        recommendation: 'Maintain 1m clearance around inverter',
        severity: 'critical'
      });
    }
    
    if (config.clearanceBattery < 0.5) {
      checks.push({
        id: 'FIRE-005',
        name: 'Battery Clearance',
        category: 'fire',
        status: 'fail',
        message: `Insufficient clearance: ${config.clearanceBattery}m (need 0.5m)`,
        recommendation: 'Maintain 0.5m clearance around battery',
        severity: 'major'
      });
    }
    
    // Smoke detector
    checks.push({
      id: 'FIRE-006',
      name: 'Smoke Detection',
      category: 'fire',
      status: config.hasSmokeDetector ? 'pass' : 'warning',
      message: config.hasSmokeDetector ? 'Smoke detector present' : 'No smoke detector near equipment',
      recommendation: 'Install smoke detector within 3m of inverter and battery',
      severity: 'minor'
    });
    
    // Fire extinguisher
    checks.push({
      id: 'FIRE-007',
      name: 'Fire Extinguisher',
      category: 'fire',
      status: config.hasFireExtinguisher ? 'pass' : 'warning',
      message: config.hasFireExtinguisher ? 'Fire extinguisher present' : 'No fire extinguisher nearby',
      recommendation: 'Keep Class C fire extinguisher accessible',
      severity: 'minor'
    });
    
    return checks;
  }
  
  async validateElectricalSafety(config: {
    voltage: number;
    current: number;
    cableGauge: number;
    breakerRating: number;
    hasGrounding: boolean;
    hasRCD: boolean;
    ambientTemp: number;
  }): Promise<SafetyCheck[]> {
    const checks: SafetyCheck[] = [];
    
    // Voltage check
    if (config.voltage > 1000) {
      checks.push({
        id: 'ELEC-001',
        name: 'DC Voltage Limit',
        category: 'electrical',
        status: 'fail',
        message: `Voltage ${config.voltage}V exceeds 1000V limit`,
        recommendation: 'Reduce panels per string or use higher voltage rated equipment',
        severity: 'critical'
      });
    } else {
      checks.push({
        id: 'ELEC-001',
        name: 'DC Voltage Limit',
        category: 'electrical',
        status: 'pass',
        message: `Voltage ${config.voltage}V within limit`,
        recommendation: '',
        severity: 'minor'
      });
    }
    
    // Cable ampacity
    const maxCurrentForGauge = this.getCableCapacity(config.cableGauge);
    if (config.current > maxCurrentForGauge * 0.8) {
      checks.push({
        id: 'ELEC-002',
        name: 'Cable Ampacity',
        category: 'electrical',
        status: 'warning',
        message: `Current ${config.current}A near ${maxCurrentForGauge}A cable limit`,
        recommendation: `Upgrade to ${config.cableGauge + 4}mm² cable`,
        severity: 'major'
      });
    }
    
    // Breaker sizing (125% rule)
    const requiredBreaker = Math.ceil(config.current * 1.25);
    if (config.breakerRating < requiredBreaker) {
      checks.push({
        id: 'ELEC-003',
        name: 'Breaker Sizing',
        category: 'electrical',
        status: 'fail',
        message: `Breaker ${config.breakerRating}A < required ${requiredBreaker}A`,
        recommendation: `Upgrade to ${requiredBreaker}A breaker`,
        severity: 'critical'
      });
    }
    
    // Grounding
    checks.push({
      id: 'ELEC-004',
      name: 'Proper Grounding',
      category: 'electrical',
      status: config.hasGrounding ? 'pass' : 'fail',
      message: config.hasGrounding ? 'Grounding present' : 'No grounding detected',
      recommendation: 'Install proper grounding system (<1 ohm)',
      severity: 'critical'
    });
    
    // RCD
    checks.push({
      id: 'ELEC-005',
      name: 'Residual Current Device',
      category: 'electrical',
      status: config.hasRCD ? 'pass' : 'fail',
      message: config.hasRCD ? 'RCD installed' : 'No RCD detected',
      recommendation: 'Install 30mA RCD on AC side',
      severity: 'critical'
    });
    
    // Temperature derating
    if (config.ambientTemp > 40) {
      checks.push({
        id: 'ELEC-006',
        name: 'Temperature Derating',
        category: 'electrical',
        status: 'warning',
        message: `High ambient temperature: ${config.ambientTemp}°C`,
        recommendation: `Apply ${this.getDeratingFactor(config.ambientTemp)}x derating factor`,
        severity: 'major'
      });
    }
    
    return checks;
  }
  
  async validateStructuralSafety(config: {
    roofLoad: number;
    maxRoofCapacity: number;
    windZone: number;
    seismicZone: number;
    mountingType: string;
  }): Promise<SafetyCheck[]> {
    const checks: SafetyCheck[] = [];
    
    // Load capacity
    if (config.roofLoad > config.maxRoofCapacity) {
      checks.push({
        id: