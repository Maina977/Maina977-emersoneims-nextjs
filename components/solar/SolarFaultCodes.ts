/**
 * SOLAR BIBLE - Fault Codes and System Health Analysis
 * Comprehensive fault code database for solar system components
 *
 * @copyright 2026 EmersonEIMS - Solar Bible
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultCode {
  code: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  cause: string;
  causes: string[];            // Multiple possible causes
  solution: string;
  solutions: string[];         // Multiple possible solutions
  category: string;
  partsNeeded: string[];       // Parts that may be needed for repair
}

// Helper to create fault codes with default arrays
function fc(
  code: string,
  description: string,
  severity: 'info' | 'warning' | 'critical',
  cause: string,
  solution: string,
  category: string,
  extraCauses: string[] = [],
  extraSolutions: string[] = [],
  parts: string[] = []
): FaultCode {
  return {
    code,
    description,
    severity,
    cause,
    causes: [cause, ...extraCauses],
    solution,
    solutions: [solution, ...extraSolutions],
    category,
    partsNeeded: parts
  };
}

// Transform old format to new format at runtime
type PartialFaultCode = Omit<FaultCode, 'causes' | 'solutions' | 'partsNeeded'>;

function transformFaultCodes(codes: PartialFaultCode[]): FaultCode[] {
  return codes.map(c => ({
    ...c,
    causes: [c.cause],
    solutions: [c.solution],
    partsNeeded: []
  }));
}

export interface HealthMetrics {
  panelEfficiency: number;      // 0-100%
  batterySOH: number;           // State of Health 0-100%
  inverterEfficiency: number;   // 0-100%
  systemAge: number;            // years
  maintenanceScore?: number;    // Optional: overall maintenance score 0-100
}

export interface HealthReport {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  score: number;                // 0-100
  overallScore: number;         // Alias for score
  recommendations: string[];
  warnings: string[];
  maintenanceDue: boolean;
  estimatedLifeRemaining: number; // years
  issues: {
    component: string;
    issue: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  // Component health scores
  panelHealth: { score: number; status: string };
  batteryHealth: { score: number; status: string };
  inverterHealth: { score: number; status: string };
  // Predictive maintenance
  predictedFailures: {
    component: string;
    prediction: string;
    timeframe: string;
    probability: number;
  }[];
  maintenanceSchedule: {
    task: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER FAULT CODES BY BRAND
// ═══════════════════════════════════════════════════════════════════════════════

export const INVERTER_FAULT_CODES: Record<string, FaultCode[]> = {
  'Deye': [
    fc('F01', 'DC Over Voltage', 'critical', 'Input voltage exceeds maximum limit', 'Check panel configuration and reduce string voltage', 'DC Input', ['Too many panels in series', 'Cold weather effect'], ['Reconfigure string', 'Add string combiner'], ['String combiner box']),
    fc('F02', 'DC Under Voltage', 'warning', 'Input voltage below minimum threshold', 'Check panel connections and irradiance levels', 'DC Input', ['Low irradiance', 'Panel shading', 'Loose connections'], ['Clean panels', 'Check connections'], []),
    fc('F03', 'AC Over Voltage', 'critical', 'Grid voltage too high', 'Contact utility or check grid connection', 'AC Output', ['Grid instability', 'Transformer tap setting'], ['Wait for stabilization', 'Adjust transformer tap'], []),
    fc('F04', 'AC Under Voltage', 'warning', 'Grid voltage too low', 'Check grid connection and utility supply', 'AC Output', ['Long cable run', 'Overloaded circuit'], ['Use larger cables', 'Balance load'], ['Power cable']),
    fc('F05', 'Over Temperature', 'critical', 'Inverter internal temperature too high', 'Improve ventilation, clean dust, reduce load', 'Thermal', ['Blocked ventilation', 'High ambient', 'Fan failure'], ['Install in shade', 'Add ventilation'], ['Cooling fan']),
    fc('F06', 'Over Current', 'critical', 'Output current exceeds rated value', 'Reduce connected load or check for short circuit', 'AC Output', ['Overload', 'Short circuit'], ['Reduce load', 'Check wiring'], []),
    fc('F07', 'Communication Error', 'warning', 'Lost connection with monitoring system', 'Check WiFi/LAN connection and restart', 'Communication', ['WiFi issue', 'Router problem'], ['Restart router', 'Update firmware'], ['WiFi module']),
    fc('F08', 'Isolation Fault', 'critical', 'Ground fault detected in PV array', 'Check panel insulation and wiring', 'Safety', ['Water ingress', 'Cable damage'], ['Repair insulation', 'Replace cables'], ['MC4 connectors', 'Solar cable']),
    fc('F09', 'Battery Over Voltage', 'critical', 'Battery voltage too high', 'Check BMS settings and battery connections', 'Battery', ['BMS fault', 'Incorrect settings'], ['Reconfigure BMS', 'Check battery'], ['BMS module']),
    fc('F10', 'Battery Low Voltage', 'warning', 'Battery voltage below threshold', 'Check battery charge level and connections', 'Battery', ['Discharged battery', 'Cell failure'], ['Charge battery', 'Test cells'], []),
  ],
  'Growatt': transformFaultCodes([
    { code: 'E001', description: 'Grid Over Voltage', severity: 'critical', cause: 'Grid voltage above limit', solution: 'Wait for grid stabilization or contact utility', category: 'Grid' },
    { code: 'E002', description: 'Grid Under Voltage', severity: 'warning', cause: 'Grid voltage below limit', solution: 'Check grid connection quality', category: 'Grid' },
    { code: 'E003', description: 'Grid Over Frequency', severity: 'critical', cause: 'Grid frequency too high', solution: 'Wait for grid stabilization', category: 'Grid' },
    { code: 'E004', description: 'Grid Under Frequency', severity: 'warning', cause: 'Grid frequency too low', solution: 'Wait for grid stabilization', category: 'Grid' },
    { code: 'E005', description: 'PV Over Voltage', severity: 'critical', cause: 'PV input voltage too high', solution: 'Reconfigure PV string', category: 'PV' },
    { code: 'E006', description: 'Isolation Error', severity: 'critical', cause: 'Insulation resistance low', solution: 'Check PV cable insulation', category: 'Safety' },
    { code: 'E007', description: 'Temperature High', severity: 'warning', cause: 'Internal temperature elevated', solution: 'Improve cooling airflow', category: 'Thermal' },
    { code: 'E008', description: 'Fan Error', severity: 'warning', cause: 'Cooling fan malfunction', solution: 'Replace cooling fan', category: 'Hardware' },
    { code: 'E009', description: 'Communication Fail', severity: 'info', cause: 'WiFi connection lost', solution: 'Reconnect WiFi or check router', category: 'Communication' },
    { code: 'E010', description: 'Relay Check Fail', severity: 'critical', cause: 'Output relay malfunction', solution: 'Service required', category: 'Hardware' },
  ]),
  'Sunsynk': transformFaultCodes([
    { code: 'ERR01', description: 'Grid Lost', severity: 'info', cause: 'No grid detected', solution: 'Check grid connection or wait for restoration', category: 'Grid' },
    { code: 'ERR02', description: 'Battery Disconnect', severity: 'warning', cause: 'Battery communication lost', solution: 'Check battery cables and BMS', category: 'Battery' },
    { code: 'ERR03', description: 'Overload', severity: 'critical', cause: 'Load exceeds inverter capacity', solution: 'Reduce connected load', category: 'Load' },
    { code: 'ERR04', description: 'Short Circuit', severity: 'critical', cause: 'Output short circuit detected', solution: 'Check wiring and disconnect faulty loads', category: 'Safety' },
    { code: 'ERR05', description: 'MPPT Fault', severity: 'warning', cause: 'Maximum power point tracking error', solution: 'Check PV connections', category: 'PV' },
    { code: 'ERR06', description: 'BMS Communication', severity: 'warning', cause: 'Battery management communication error', solution: 'Check CAN/RS485 connection', category: 'Battery' },
    { code: 'ERR07', description: 'Ground Fault', severity: 'critical', cause: 'Earth leakage detected', solution: 'Check system grounding', category: 'Safety' },
    { code: 'ERR08', description: 'DC Bus High', severity: 'critical', cause: 'Internal DC bus overvoltage', solution: 'Reduce PV input', category: 'Internal' },
    { code: 'ERR09', description: 'Firmware Error', severity: 'warning', cause: 'Software malfunction', solution: 'Update firmware', category: 'Software' },
    { code: 'ERR10', description: 'EEPROM Error', severity: 'critical', cause: 'Memory read/write failure', solution: 'Service required', category: 'Hardware' },
  ]),
  'Voltronic': transformFaultCodes([
    { code: '01', description: 'Fan Locked', severity: 'warning', cause: 'Cooling fan not rotating', solution: 'Clear obstruction or replace fan', category: 'Hardware' },
    { code: '02', description: 'Over Temperature', severity: 'critical', cause: 'Internal temperature too high', solution: 'Improve ventilation', category: 'Thermal' },
    { code: '03', description: 'Battery Voltage High', severity: 'warning', cause: 'Battery voltage above setpoint', solution: 'Check charge settings', category: 'Battery' },
    { code: '04', description: 'Battery Voltage Low', severity: 'warning', cause: 'Battery voltage below setpoint', solution: 'Check battery condition', category: 'Battery' },
    { code: '05', description: 'Output Short', severity: 'critical', cause: 'Short circuit on output', solution: 'Check load wiring', category: 'Safety' },
    { code: '06', description: 'Output Voltage High', severity: 'critical', cause: 'Output voltage too high', solution: 'Check output settings', category: 'AC Output' },
    { code: '07', description: 'Overload Timeout', severity: 'critical', cause: 'Sustained overload condition', solution: 'Reduce load', category: 'Load' },
    { code: '08', description: 'Bus Voltage High', severity: 'critical', cause: 'DC bus overvoltage', solution: 'Check PV configuration', category: 'Internal' },
    { code: '09', description: 'Bus Soft Start Fail', severity: 'critical', cause: 'Startup sequence failed', solution: 'Restart inverter', category: 'Internal' },
    { code: '10', description: 'PV Input Over Voltage', severity: 'critical', cause: 'Solar panel voltage too high', solution: 'Reduce PV string voltage', category: 'PV' },
  ]),
  'SMA': transformFaultCodes([
    { code: 'Flt-0001', description: 'Earth Fault', severity: 'critical', cause: 'Ground current detected', solution: 'Check system grounding and insulation', category: 'Safety' },
    { code: 'Flt-0002', description: 'Grid Overvoltage', severity: 'critical', cause: 'Grid voltage too high', solution: 'Contact utility provider', category: 'Grid' },
    { code: 'Flt-0003', description: 'Grid Undervoltage', severity: 'warning', cause: 'Grid voltage too low', solution: 'Check grid connection', category: 'Grid' },
    { code: 'Flt-0004', description: 'Arc Fault', severity: 'critical', cause: 'Electrical arc detected', solution: 'Inspect all connections immediately', category: 'Safety' },
    { code: 'Flt-0005', description: 'Temperature Derating', severity: 'info', cause: 'Output reduced due to temperature', solution: 'Improve ventilation', category: 'Thermal' },
    { code: 'Flt-0006', description: 'Communication Error', severity: 'info', cause: 'Monitoring connection lost', solution: 'Check network settings', category: 'Communication' },
    { code: 'Flt-0007', description: 'Insulation Warning', severity: 'warning', cause: 'Low insulation resistance', solution: 'Check cable condition', category: 'Safety' },
    { code: 'Flt-0008', description: 'DC Overvoltage', severity: 'critical', cause: 'PV voltage exceeds limit', solution: 'Reconfigure PV array', category: 'PV' },
    { code: 'Flt-0009', description: 'Internal Error', severity: 'critical', cause: 'Internal component failure', solution: 'Contact SMA service', category: 'Hardware' },
    { code: 'Flt-0010', description: 'Overcurrent', severity: 'critical', cause: 'Output current too high', solution: 'Check for faults and reduce load', category: 'AC Output' },
  ]),
  'Huawei': transformFaultCodes([
    { code: 'ALM-001', description: 'PV String Abnormal', severity: 'warning', cause: 'String performance deviation', solution: 'Check panel connections', category: 'PV' },
    { code: 'ALM-002', description: 'Grid Abnormal', severity: 'warning', cause: 'Grid parameters out of range', solution: 'Monitor grid conditions', category: 'Grid' },
    { code: 'ALM-003', description: 'Device Abnormal', severity: 'critical', cause: 'Internal hardware issue', solution: 'Service required', category: 'Hardware' },
    { code: 'ALM-004', description: 'Meter Communication', severity: 'info', cause: 'Smart meter not responding', solution: 'Check meter wiring', category: 'Communication' },
    { code: 'ALM-005', description: 'AI Optimizer Offline', severity: 'warning', cause: 'Optimizer not communicating', solution: 'Check optimizer connections', category: 'Communication' },
    { code: 'ALM-006', description: 'DC Arc', severity: 'critical', cause: 'DC arc fault detected', solution: 'Inspect DC connections', category: 'Safety' },
    { code: 'ALM-007', description: 'Residual Current', severity: 'critical', cause: 'High residual current', solution: 'Check system grounding', category: 'Safety' },
    { code: 'ALM-008', description: 'High Temperature', severity: 'warning', cause: 'Operating temperature high', solution: 'Improve cooling', category: 'Thermal' },
    { code: 'ALM-009', description: 'Firmware Update', severity: 'info', cause: 'New firmware available', solution: 'Update via app', category: 'Software' },
    { code: 'ALM-010', description: 'Power Limitation', severity: 'info', cause: 'Output power limited', solution: 'Check grid export settings', category: 'Grid' },
  ]),
};

// ═══════════════════════════════════════════════════════════════════════════════
// BATTERY FAULT CODES BY BRAND
// ═══════════════════════════════════════════════════════════════════════════════

export const BATTERY_FAULT_CODES: Record<string, FaultCode[]> = {
  'Pylontech': transformFaultCodes([
    { code: 'P01', description: 'Cell Over Voltage', severity: 'critical', cause: 'Individual cell voltage too high', solution: 'Balance cells or reduce charging', category: 'Cell' },
    { code: 'P02', description: 'Cell Under Voltage', severity: 'warning', cause: 'Individual cell voltage too low', solution: 'Charge battery', category: 'Cell' },
    { code: 'P03', description: 'Over Temperature', severity: 'critical', cause: 'Battery temperature too high', solution: 'Improve ventilation, reduce load', category: 'Thermal' },
    { code: 'P04', description: 'Under Temperature', severity: 'warning', cause: 'Battery too cold for operation', solution: 'Warm environment or enable heating', category: 'Thermal' },
    { code: 'P05', description: 'Over Current Charge', severity: 'warning', cause: 'Charging current too high', solution: 'Reduce charge rate', category: 'Current' },
    { code: 'P06', description: 'Over Current Discharge', severity: 'warning', cause: 'Discharge current too high', solution: 'Reduce load', category: 'Current' },
    { code: 'P07', description: 'Communication Error', severity: 'warning', cause: 'BMS communication failed', solution: 'Check CAN/RS485 cables', category: 'Communication' },
    { code: 'P08', description: 'Cell Imbalance', severity: 'warning', cause: 'Cells are not balanced', solution: 'Run balancing cycle', category: 'Cell' },
    { code: 'P09', description: 'Pack Over Voltage', severity: 'critical', cause: 'Total pack voltage too high', solution: 'Stop charging immediately', category: 'Pack' },
    { code: 'P10', description: 'Pack Under Voltage', severity: 'critical', cause: 'Total pack voltage too low', solution: 'Charge battery', category: 'Pack' },
  ]),
  'BYD': transformFaultCodes([
    { code: 'BYD-01', description: 'HVS Communication', severity: 'warning', cause: 'Module communication lost', solution: 'Check module connections', category: 'Communication' },
    { code: 'BYD-02', description: 'Temperature Sensor', severity: 'warning', cause: 'Temperature sensor fault', solution: 'Service required', category: 'Sensor' },
    { code: 'BYD-03', description: 'Current Sensor', severity: 'critical', cause: 'Current measurement error', solution: 'Service required', category: 'Sensor' },
    { code: 'BYD-04', description: 'Voltage Difference', severity: 'warning', cause: 'Module voltage mismatch', solution: 'Balance modules', category: 'Cell' },
    { code: 'BYD-05', description: 'Precharge Fail', severity: 'critical', cause: 'Precharge circuit error', solution: 'Check contactor circuit', category: 'Hardware' },
    { code: 'BYD-06', description: 'Contactor Fault', severity: 'critical', cause: 'Main contactor malfunction', solution: 'Service required', category: 'Hardware' },
    { code: 'BYD-07', description: 'Insulation Low', severity: 'critical', cause: 'Insulation resistance low', solution: 'Check for moisture', category: 'Safety' },
    { code: 'BYD-08', description: 'SOC Calibration', severity: 'info', cause: 'State of charge needs calibration', solution: 'Perform full charge cycle', category: 'Software' },
    { code: 'BYD-09', description: 'Fan Failure', severity: 'warning', cause: 'Cooling fan not working', solution: 'Replace fan', category: 'Hardware' },
    { code: 'BYD-10', description: 'Emergency Stop', severity: 'critical', cause: 'E-stop activated', solution: 'Clear fault and restart', category: 'Safety' },
  ]),
  'Felicity': transformFaultCodes([
    { code: 'E01', description: 'Over Voltage Protection', severity: 'critical', cause: 'Battery voltage too high', solution: 'Stop charging', category: 'Voltage' },
    { code: 'E02', description: 'Under Voltage Protection', severity: 'critical', cause: 'Battery voltage too low', solution: 'Charge immediately', category: 'Voltage' },
    { code: 'E03', description: 'Over Temperature', severity: 'critical', cause: 'Temperature exceeded limit', solution: 'Cool down battery', category: 'Thermal' },
    { code: 'E04', description: 'Short Circuit', severity: 'critical', cause: 'Short circuit detected', solution: 'Check wiring', category: 'Safety' },
    { code: 'E05', description: 'Overcurrent', severity: 'warning', cause: 'Current exceeded limit', solution: 'Reduce load', category: 'Current' },
    { code: 'E06', description: 'BMS Fault', severity: 'critical', cause: 'BMS internal error', solution: 'Service required', category: 'Hardware' },
    { code: 'E07', description: 'Cell Fault', severity: 'warning', cause: 'Individual cell issue', solution: 'Service required', category: 'Cell' },
    { code: 'E08', description: 'Comm Lost', severity: 'warning', cause: 'Communication lost', solution: 'Check cables', category: 'Communication' },
  ]),
  'Trojan': transformFaultCodes([
    { code: 'T01', description: 'Low Electrolyte', severity: 'warning', cause: 'Electrolyte level low', solution: 'Add distilled water', category: 'Maintenance' },
    { code: 'T02', description: 'Sulfation', severity: 'warning', cause: 'Plate sulfation detected', solution: 'Perform equalization charge', category: 'Maintenance' },
    { code: 'T03', description: 'High Temperature', severity: 'warning', cause: 'Battery temperature elevated', solution: 'Improve ventilation', category: 'Thermal' },
    { code: 'T04', description: 'Low Specific Gravity', severity: 'warning', cause: 'Electrolyte specific gravity low', solution: 'Charge fully', category: 'Maintenance' },
    { code: 'T05', description: 'Cell Damage', severity: 'critical', cause: 'Physical cell damage', solution: 'Replace battery', category: 'Hardware' },
  ]),
};

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL FAULT CODES
// ═══════════════════════════════════════════════════════════════════════════════

export const PANEL_FAULT_CODES: FaultCode[] = transformFaultCodes([
  { code: 'PV-01', description: 'Hot Spot Detected', severity: 'warning', cause: 'Cell shading or defect', solution: 'Clean panel or check for damage', category: 'Cell' },
  { code: 'PV-02', description: 'Diode Failure', severity: 'warning', cause: 'Bypass diode failed', solution: 'Replace bypass diode', category: 'Hardware' },
  { code: 'PV-03', description: 'Connection Loose', severity: 'warning', cause: 'MC4 connector not secure', solution: 'Reseat or replace connector', category: 'Connection' },
  { code: 'PV-04', description: 'Ground Fault', severity: 'critical', cause: 'Insulation failure', solution: 'Inspect wiring and panel frame', category: 'Safety' },
  { code: 'PV-05', description: 'Micro-crack', severity: 'info', cause: 'Cell micro-cracking', solution: 'Monitor performance', category: 'Cell' },
  { code: 'PV-06', description: 'Delamination', severity: 'warning', cause: 'Encapsulant failure', solution: 'Replace panel', category: 'Physical' },
  { code: 'PV-07', description: 'Snail Trail', severity: 'info', cause: 'Silver paste oxidation', solution: 'Monitor, cosmetic only', category: 'Cell' },
  { code: 'PV-08', description: 'PID Effect', severity: 'critical', cause: 'Potential induced degradation', solution: 'Check grounding configuration', category: 'Electrical' },
  { code: 'PV-09', description: 'Junction Box Fail', severity: 'critical', cause: 'Junction box damage', solution: 'Replace junction box', category: 'Hardware' },
  { code: 'PV-10', description: 'Glass Breakage', severity: 'critical', cause: 'Physical damage to glass', solution: 'Replace panel', category: 'Physical' },
  { code: 'PV-11', description: 'Low Output', severity: 'warning', cause: 'Performance below expected', solution: 'Clean panels, check connections', category: 'Performance' },
  { code: 'PV-12', description: 'Shading Impact', severity: 'info', cause: 'Partial shading detected', solution: 'Clear obstructions', category: 'External' },
]);

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export function analyzeSystemHealth(metrics: HealthMetrics): HealthReport {
  const issues: HealthReport['issues'] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Calculate component scores
  const panelScore = metrics.panelEfficiency;
  const batteryScore = metrics.batterySOH;
  const inverterScore = metrics.inverterEfficiency;
  const ageDeduction = Math.min(metrics.systemAge * 2, 20); // Max 20 point deduction for age

  // Panel analysis
  if (metrics.panelEfficiency < 80) {
    issues.push({ component: 'Solar Panels', issue: 'Low panel efficiency detected', priority: 'high' });
    warnings.push('Panel efficiency below 80% - inspection recommended');
    recommendations.push('Clean panels and check for hot spots or damage');
  } else if (metrics.panelEfficiency < 90) {
    issues.push({ component: 'Solar Panels', issue: 'Panel efficiency declining', priority: 'medium' });
    recommendations.push('Schedule panel cleaning and visual inspection');
  }

  // Battery analysis
  if (metrics.batterySOH < 70) {
    issues.push({ component: 'Battery', issue: 'Battery state of health critical', priority: 'high' });
    warnings.push('Battery SOH below 70% - replacement recommended');
    recommendations.push('Plan for battery replacement within 6-12 months');
  } else if (metrics.batterySOH < 85) {
    issues.push({ component: 'Battery', issue: 'Battery health declining', priority: 'medium' });
    recommendations.push('Monitor battery performance and consider capacity testing');
  }

  // Inverter analysis
  if (metrics.inverterEfficiency < 90) {
    issues.push({ component: 'Inverter', issue: 'Inverter efficiency below optimal', priority: 'medium' });
    warnings.push('Inverter efficiency below 90% - service recommended');
    recommendations.push('Check inverter ventilation and filter cleaning');
  } else if (metrics.inverterEfficiency < 95) {
    recommendations.push('Schedule inverter maintenance');
  }

  // Age-based recommendations
  if (metrics.systemAge >= 10) {
    recommendations.push('System approaching end of warranty - consider comprehensive inspection');
    issues.push({ component: 'System', issue: 'System age over 10 years', priority: 'low' });
  } else if (metrics.systemAge >= 5) {
    recommendations.push('Mid-life system checkup recommended');
  }

  // Calculate overall score
  const componentAverage = (panelScore + batteryScore + inverterScore) / 3;
  const overallScore = Math.max(0, Math.min(100, componentAverage - ageDeduction));

  // Determine health status
  let overallHealth: HealthReport['overallHealth'];
  if (overallScore >= 90) overallHealth = 'excellent';
  else if (overallScore >= 75) overallHealth = 'good';
  else if (overallScore >= 60) overallHealth = 'fair';
  else if (overallScore >= 40) overallHealth = 'poor';
  else overallHealth = 'critical';

  // Estimate remaining life
  const baseLife = 25; // Base solar system life expectancy
  const healthFactor = overallScore / 100;
  const estimatedLifeRemaining = Math.max(0, (baseLife - metrics.systemAge) * healthFactor);

  // Maintenance check
  const maintenanceDue = metrics.systemAge > 0 && (
    metrics.panelEfficiency < 95 ||
    metrics.batterySOH < 90 ||
    metrics.inverterEfficiency < 95
  );

  // Generate predicted failures based on metrics
  const predictedFailures: HealthReport['predictedFailures'] = [];
  if (metrics.batterySOH < 80) {
    predictedFailures.push({
      component: 'Battery',
      prediction: 'Battery capacity degradation',
      timeframe: metrics.batterySOH < 70 ? '6-12 months' : '1-2 years',
      probability: metrics.batterySOH < 70 ? 85 : 60
    });
  }
  if (metrics.panelEfficiency < 85) {
    predictedFailures.push({
      component: 'Solar Panels',
      prediction: 'Performance degradation',
      timeframe: '1-3 years',
      probability: 70
    });
  }
  if (metrics.inverterEfficiency < 92) {
    predictedFailures.push({
      component: 'Inverter',
      prediction: 'Efficiency decline',
      timeframe: '2-4 years',
      probability: 55
    });
  }

  // Generate maintenance schedule
  const maintenanceSchedule: HealthReport['maintenanceSchedule'] = [];
  if (maintenanceDue) {
    maintenanceSchedule.push({
      task: 'General system inspection',
      due: 'Within 30 days',
      priority: 'medium'
    });
  }
  if (metrics.panelEfficiency < 95) {
    maintenanceSchedule.push({
      task: 'Panel cleaning and inspection',
      due: 'Within 14 days',
      priority: metrics.panelEfficiency < 85 ? 'high' : 'medium'
    });
  }
  if (metrics.batterySOH < 90) {
    maintenanceSchedule.push({
      task: 'Battery capacity test',
      due: 'Within 7 days',
      priority: metrics.batterySOH < 80 ? 'high' : 'medium'
    });
  }

  // Helper function to get status from score
  const getStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  return {
    overallHealth,
    score: Math.round(overallScore),
    overallScore: Math.round(overallScore),
    recommendations,
    warnings,
    maintenanceDue,
    estimatedLifeRemaining: Math.round(estimatedLifeRemaining * 10) / 10,
    issues,
    panelHealth: { score: Math.round(panelScore), status: getStatus(panelScore) },
    batteryHealth: { score: Math.round(batteryScore), status: getStatus(batteryScore) },
    inverterHealth: { score: Math.round(inverterScore), status: getStatus(inverterScore) },
    predictedFailures,
    maintenanceSchedule
  };
}
