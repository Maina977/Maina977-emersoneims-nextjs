/**
 * INDEPENDENT REFERENCE DATABASE - Volvo Penta Engine Diagnostics
 * Community-sourced troubleshooting guide using industry-standard J1939 MID/PID/FMI format
 *
 * DISCLAIMER: This is an independent reference guide created for educational and
 * troubleshooting purposes. All brand names, model numbers, and trademarks mentioned
 * are the property of their respective owners. This database is NOT affiliated with,
 * endorsed by, or officially associated with Volvo Penta, AB Volvo, or any other
 * manufacturer. All fault descriptions are independently compiled interpretations
 * based on public J1939 standards, intended to assist technicians in the field.
 * For official documentation, always refer to the manufacturer's service manuals.
 *
 * Volvo®, Volvo Penta®, VODIA®, TAD®, and TWD® are registered trademarks of AB Volvo.
 * J1939 is a standard developed by SAE International.
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

// VODIA Models - 17 engine types
const VODIA_MODELS = [
  'VODIA5', 'VODIA6', 'D5', 'D7', 'D11', 'D13', 'D16',
  'TAD530', 'TAD730', 'TAD1140', 'TAD1150', 'TAD1640', 'TAD1650',
  'TWD740', 'TWD1030', 'TWD1210', 'TWD1620'
];

// Helper function to create fault codes
function createVODIACode(
  mid: number,
  pid: number,
  fmi: number,
  title: string,
  category: string,
  subcategory: string,
  severity: 'info' | 'warning' | 'critical' | 'shutdown',
  description: string,
  symptoms: string[],
  causes: { likelihood: 'high' | 'medium' | 'low'; cause: string; verification: string }[],
  solutions: string[],
  resetMethod: string,
  applicableModels: string[] = VODIA_MODELS
): Partial<ControllerFaultCode>[] {
  const codeString = `MID${mid}-PID${pid}-FMI${fmi}`;
  return applicableModels.map(model => ({
    id: `VODIA-${model.replace(/\s+/g, '')}-${codeString}`,
    code: codeString,
    brand: 'Volvo Penta VODIA',
    model,
    firmwareVersions: ['All versions'],
    category,
    subcategory,
    severity,
    alarmType: severity === 'shutdown' ? 'shutdown' : severity === 'critical' ? 'trip' : 'warning',
    title,
    description: `${model}: ${description}`,
    symptoms,
    possibleCauses: causes,
    diagnosticSteps: [
      { step: 1, action: 'Connect VODIA diagnostic tool via J1939 port', expectedResult: 'Communication established' },
      { step: 2, action: 'Read active and stored fault codes', expectedResult: 'Full fault history retrieved' },
      { step: 3, action: 'Check related sensor waveforms in VODIA', expectedResult: 'Live data stream active' },
      { step: 4, action: 'Perform actuator tests if applicable', expectedResult: 'Component responds correctly' },
    ],
    resetPathways: [{
      method: 'software',
      applicableFirmware: ['All'],
      requiresCondition: severity === 'shutdown' ? ['engine_stopped', 'fault_investigated'] : ['fault_cleared'],
      steps: [
        { stepNumber: 1, action: 'Open VODIA software on laptop', keySequence: ['VODIA Connect'], expectedResponse: 'ECU detected' },
        { stepNumber: 2, action: 'Navigate to Fault Codes menu', keySequence: ['Diagnostics', 'Fault Codes'], expectedResponse: 'Fault list displayed' },
        { stepNumber: 3, action: 'Select fault and click Clear', keySequence: ['Clear Selected'], expectedResponse: 'Fault cleared confirmation' },
        { stepNumber: 4, action: 'Verify fault does not return', keySequence: ['Monitor'], expectedResponse: 'No active faults' }
      ],
      successIndicator: 'No active faults in VODIA'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : severity === 'critical' ? 'moderate' : 'easy',
      timeEstimate: severity === 'shutdown' ? '2-6 hours' : '30-90 minutes',
      procedureSteps: solutions,
      tools: ['VODIA5/6 Diagnostic Tool', 'Multimeter', 'Laptop with VODIA software', 'J1939 cable'],
      parts: [],
      estimatedCost: { min: 0, max: severity === 'shutdown' ? 1000 : 300, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? [
      'Engine shutdown occurred - do not attempt restart until fault investigated',
      'High pressure fuel system - follow proper safety procedures',
      'Allow engine to cool before working on cooling system'
    ] : ['Follow standard safety procedures', 'Use proper PPE when working on engine'],
    preventiveMeasures: ['Regular maintenance per manufacturer schedule', 'Use quality parts and fluids', 'Monitor via diagnostic tool periodically'],
    verified: false, // independently written guide, not checked line-by-line against the OEM manual (2026-10-20)
    lastUpdated: '2024-01-15'
  }));
}


// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL DETAILED CODES (High-value detailed entries)
// ═══════════════════════════════════════════════════════════════════════════════

const MANUAL_VODIA_CODES: Partial<ControllerFaultCode>[] = [
  // Critical Oil Pressure Codes
  ...createVODIACode(128, 100, 1, 'Engine Oil Pressure Low - Shutdown', 'Engine Protection', 'Lubrication', 'shutdown',
    'Engine oil pressure has dropped below minimum safe operating threshold. ECU has initiated protective shutdown to prevent bearing damage and catastrophic engine failure.',
    ['Engine shutdown automatically', 'Low oil pressure warning lamp', 'Alarm horn sounding', 'Oil pressure gauge reading low or zero'],
    [
      { likelihood: 'high', cause: 'Low engine oil level', verification: 'Check dipstick - add oil if low' },
      { likelihood: 'high', cause: 'Oil pressure sensor failure', verification: 'Measure actual pressure with mechanical gauge at gallery' },
      { likelihood: 'medium', cause: 'Oil pump failure or excessive wear', verification: 'Check oil pump pressure output at gallery port' },
      { likelihood: 'medium', cause: 'Clogged oil filter', verification: 'Replace oil filter and verify flow restored' },
      { likelihood: 'low', cause: 'Excessive bearing clearance', verification: 'Check main and rod bearing clearances with plastigauge' },
    ],
    ['Check engine oil level and top up with correct grade', 'Verify oil pressure with mechanical gauge at gallery', 'Replace oil pressure sensor if reading differs from mechanical', 'Replace oil filter', 'If problem persists, inspect oil pump and bearings'],
    'VODIA software clear after fault corrected - DO NOT CLEAR WITHOUT INVESTIGATION'),

  // Coolant Temperature Codes
  ...createVODIACode(128, 110, 0, 'Engine Coolant Temperature High - Shutdown', 'Engine Protection', 'Cooling System', 'shutdown',
    'Engine coolant temperature has exceeded maximum safe limit. Immediate shutdown initiated to prevent thermal damage to pistons, cylinder liners, and head gasket.',
    ['Engine shutdown', 'High temperature warning active', 'Steam may be visible from overflow', 'Coolant may be boiling in surge tank'],
    [
      { likelihood: 'high', cause: 'Low coolant level', verification: 'Check coolant level in surge tank when engine cold' },
      { likelihood: 'high', cause: 'Thermostat stuck closed', verification: 'Feel both radiator hoses - inlet should be hot first' },
      { likelihood: 'medium', cause: 'Water pump impeller failure', verification: 'Check for coolant flow at surge tank with engine running' },
      { likelihood: 'medium', cause: 'Radiator blocked externally', verification: 'Check radiator fins for debris, bugs, dirt' },
      { likelihood: 'medium', cause: 'Cooling fan inoperative', verification: 'Check fan clutch engagement or electric fan operation' },
      { likelihood: 'low', cause: 'Head gasket failure', verification: 'Check for combustion gases in coolant with test kit' },
    ],
    ['Allow engine to cool completely before opening system', 'Check and refill coolant level to correct mark', 'Verify thermostat opens at correct temperature (test in hot water)', 'Clean radiator externally', 'Check water pump and fan operation', 'Pressure test cooling system for leaks'],
    'VODIA software clear after temperature normalizes and cause identified'),

  // Fuel Rail Pressure Codes
  ...createVODIACode(128, 157, 1, 'Fuel Rail Pressure Low - Derate', 'Fuel System', 'High Pressure', 'critical',
    'Fuel rail pressure is below minimum required for proper injection. ECU has reduced engine power to protect high pressure pump and injectors.',
    ['Reduced engine power', 'Engine runs rough under load', 'Black smoke possible', 'Power derate lamp illuminated'],
    [
      { likelihood: 'high', cause: 'Clogged fuel filters (primary or secondary)', verification: 'Check fuel filter restriction with vacuum gauge' },
      { likelihood: 'high', cause: 'Air in fuel system', verification: 'Check for air bubbles in clear fuel lines or bleed system' },
      { likelihood: 'medium', cause: 'Fuel supply pump weak or failing', verification: 'Check supply pump pressure (should be 400-600 kPa)' },
      { likelihood: 'medium', cause: 'Fuel line restriction or collapse', verification: 'Inspect fuel lines for kinks, collapse, or blockage' },
      { likelihood: 'low', cause: 'High pressure pump internal leak', verification: 'Check HP pump output with VODIA rail pressure test' },
    ],
    ['Replace both primary and secondary fuel filters', 'Bleed air from fuel system completely', 'Check fuel supply pump pressure at filter housing', 'Inspect all fuel lines for damage', 'Test high pressure pump with VODIA'],
    'Auto clear when rail pressure reaches normal range'),
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT COMBINED DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

/*
 * Only the hand-written entries are published (2026-10-18 tool audit).
 * generateExtendedVODIACodes() multiplied invented PID names by every FMI and
 * every engine model — 51,527 rows flagged `verified: true` — and several of
 * its PID meanings were wrong against SAE J1587 (PID 105 is intake manifold
 * temperature, not oil level; PID 174 is fuel temperature; PID 102 is boost
 * pressure). A wrong meaning marked verified is worse than no entry, so the
 * generator was deleted (see git history before 2026-10-18). Rebuild it only
 * from the real SAE J1587 PID table.
 */
export const VODIA_FAULT_CODES: Partial<ControllerFaultCode>[] = [...MANUAL_VODIA_CODES];

// Export getter function for use in the main fault code index
export function getVODIAFaultCodes(): ControllerFaultCode[] {
  return VODIA_FAULT_CODES as ControllerFaultCode[];
}

// Statistics
export function getVODIAStats() {
  return {
    totalCodes: VODIA_FAULT_CODES.length,
    models: VODIA_MODELS.length,
    categories: [...new Set(VODIA_FAULT_CODES.map(c => c.category))],
  };
}

export default VODIA_FAULT_CODES;
