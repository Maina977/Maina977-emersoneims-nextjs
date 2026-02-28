/**
 * INDEPENDENT REFERENCE DATABASE - PowerWizard-Compatible Controllers
 * Community-sourced troubleshooting guide using industry-standard J1939 SPN-FMI format
 *
 * DISCLAIMER: This is an independent reference guide created for educational and
 * troubleshooting purposes. All brand names, model numbers, and trademarks mentioned
 * are the property of their respective owners. This database is NOT affiliated with,
 * endorsed by, or officially associated with Caterpillar Inc. or any other manufacturer.
 * All fault descriptions are independently compiled interpretations based on public
 * J1939 standards, intended to assist technicians in the field. For official
 * documentation, always refer to the manufacturer's service manuals.
 *
 * CAT®, Caterpillar®, and PowerWizard® are registered trademarks of Caterpillar Inc.
 * J1939 is a standard developed by SAE International.
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

const POWERWIZARD_MODELS = [
  'PowerWizard 1.0',
  'PowerWizard 2.0',
  'PowerWizard 4.1'
];

// FMI (Failure Mode Identifier) descriptions per J1939
const FMI_DESCRIPTIONS: Record<number, string> = {
  0: 'Data Valid But Above Normal Operational Range - Most Severe Level',
  1: 'Data Valid But Below Normal Operational Range - Most Severe Level',
  2: 'Data Erratic, Intermittent Or Incorrect',
  3: 'Voltage Above Normal Or Shorted To High Source',
  4: 'Voltage Below Normal Or Shorted To Low Source',
  5: 'Current Below Normal Or Open Circuit',
  6: 'Current Above Normal Or Grounded Circuit',
  7: 'Mechanical System Not Responding Or Out Of Adjustment',
  8: 'Abnormal Frequency Or Pulse Width Or Period',
  9: 'Abnormal Update Rate',
  10: 'Abnormal Rate Of Change',
  11: 'Root Cause Not Known',
  12: 'Bad Intelligent Device Or Component',
  13: 'Out Of Calibration',
  14: 'Special Instructions',
  15: 'Data Valid But Above Normal Operating Range - Least Severe',
  16: 'Data Valid But Above Normal Operating Range - Moderately Severe',
  17: 'Data Valid But Below Normal Operating Range - Least Severe',
  18: 'Data Valid But Below Normal Operating Range - Moderately Severe',
  19: 'Received Network Data In Error',
  31: 'Condition Exists'
};

function createPowerWizardCode(
  spn: number,
  fmi: number,
  title: string,
  category: string,
  subcategory: string,
  severity: 'info' | 'warning' | 'critical' | 'shutdown',
  description: string,
  symptoms: string[],
  causes: { likelihood: 'high' | 'medium' | 'low'; cause: string; verification: string }[],
  solutions: string[],
  applicableModels: string[] = POWERWIZARD_MODELS
): Partial<ControllerFaultCode>[] {
  const code = `SPN${spn}-FMI${fmi}`;
  const fmiDesc = FMI_DESCRIPTIONS[fmi] || 'Unknown Failure Mode';

  return applicableModels.map(model => ({
    id: `PW-${model.replace(/\s+/g, '')}-${code}`,
    code,
    brand: 'CAT PowerWizard',
    model,
    firmwareVersions: ['All versions'],
    category,
    subcategory,
    severity,
    alarmType: severity === 'shutdown' ? 'shutdown' : severity === 'critical' ? 'trip' : 'warning',
    title: `${title} - ${fmiDesc.split(' - ')[0]}`,
    description: `${model}: ${description} (FMI ${fmi}: ${fmiDesc})`,
    symptoms,
    possibleCauses: causes,
    diagnosticSteps: [
      { step: 1, action: 'Connect CAT Electronic Technician (ET) software', expectedResult: 'Communication established', tools: ['Laptop', 'CAT Comm Adapter'] },
      { step: 2, action: 'Navigate to Diagnostic Codes', expectedResult: 'Active codes listed' },
      { step: 3, action: `Select SPN ${spn} FMI ${fmi} for details`, expectedResult: 'Full fault information' },
      { step: 4, action: 'Check associated parameters in status screens', expectedResult: 'Root cause indicators' }
    ],
    resetPathways: [{
      method: 'software',
      applicableFirmware: ['All'],
      requiresCondition: ['CAT_ET_connected', 'fault_resolved'],
      steps: [
        { stepNumber: 1, action: 'Connect CAT ET via Comm Adapter III', expectedResponse: 'Connection confirmed' },
        { stepNumber: 2, action: 'Go to Diagnostics > Active Codes', menuPath: ['Diagnostics', 'Active Codes'], expectedResponse: 'Code list shown' },
        { stepNumber: 3, action: 'Select code and click Clear', expectedResponse: 'Code clears if resolved' }
      ],
      successIndicator: 'Code moves to logged or clears'
    }, {
      method: 'keypad',
      applicableFirmware: ['All'],
      requiresCondition: ['engine_stopped', 'fault_resolved'],
      steps: [
        { stepNumber: 1, action: 'Press STOP button', keySequence: ['STOP'], expectedResponse: 'Engine stops' },
        { stepNumber: 2, action: 'Press ALARM ACK/RESET once', keySequence: ['ALARM ACK/RESET'], expectedResponse: 'Alarm acknowledged' },
        { stepNumber: 3, action: 'Press ALARM ACK/RESET again', keySequence: ['ALARM ACK/RESET'], expectedResponse: 'Alarm reset if resolved' }
      ],
      successIndicator: 'Alarm LED off'
    }],
    solutions: [{
      difficulty: severity === 'shutdown' ? 'advanced' : severity === 'critical' ? 'moderate' : 'easy',
      timeEstimate: severity === 'shutdown' ? '2-4 hours' : '30-90 minutes',
      procedureSteps: solutions,
      tools: ['CAT Electronic Technician', 'CAT Comm Adapter III', 'Multimeter', 'Hand tools'],
      parts: [],
      estimatedCost: { min: 0, max: severity === 'shutdown' ? 600 : 300, currency: 'USD' }
    }],
    safetyWarnings: severity === 'shutdown' ? ['Diagnose with CAT ET before restart', 'Check for mechanical damage'] : [],
    preventiveMeasures: ['Regular CAT dealer maintenance', 'Keep ET software updated'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const POWERWIZARD_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== ENGINE OIL PRESSURE (SPN 100) ====================
  ...createPowerWizardCode(100, 1, 'Engine Oil Pressure', 'Engine', 'Oil Pressure', 'shutdown',
    'Engine oil pressure has fallen below the critical low limit. This severe condition triggered immediate engine shutdown to protect bearings and internal components from damage.',
    ['Engine stopped immediately', 'Oil pressure was critically low', 'Shutdown indicator active'],
    [
      { likelihood: 'high', cause: 'Engine oil level severely low or empty', verification: 'Check dipstick immediately' },
      { likelihood: 'high', cause: 'Oil pressure sensor circuit failure', verification: 'Verify with mechanical gauge' },
      { likelihood: 'medium', cause: 'Oil pump mechanical failure', verification: 'Check pump operation' },
      { likelihood: 'low', cause: 'Severe internal engine wear', verification: 'Check for metallic debris' }
    ],
    ['Do NOT attempt restart until cause determined', 'Check oil level - add if needed', 'Verify actual pressure with mechanical gauge', 'Inspect for oil leaks', 'Check for engine damage before starting']
  ),

  ...createPowerWizardCode(100, 3, 'Engine Oil Pressure Sensor', 'Engine', 'Oil Pressure', 'warning',
    'The oil pressure sensor circuit is showing voltage above normal range indicating a short to power supply or sensor failure.',
    ['Oil pressure reading at maximum or invalid', 'Sensor circuit fault', 'May show false high reading'],
    [
      { likelihood: 'high', cause: 'Sensor wiring shorted to voltage source', verification: 'Check harness for damage' },
      { likelihood: 'medium', cause: 'Oil pressure sensor internal failure', verification: 'Measure sensor resistance' },
      { likelihood: 'low', cause: 'ECM connector corrosion', verification: 'Inspect ECM connections' }
    ],
    ['Inspect sensor wiring for shorts', 'Check sensor connector', 'Measure sensor resistance per spec', 'Replace sensor if faulty']
  ),

  ...createPowerWizardCode(100, 4, 'Engine Oil Pressure Sensor', 'Engine', 'Oil Pressure', 'warning',
    'The oil pressure sensor circuit is showing voltage below normal range indicating open circuit or short to ground.',
    ['Oil pressure reading zero or invalid', 'Sensor circuit open', 'Protection may default active'],
    [
      { likelihood: 'high', cause: 'Sensor wiring disconnected or broken', verification: 'Check wiring continuity' },
      { likelihood: 'high', cause: 'Sensor connector fault', verification: 'Inspect connector' },
      { likelihood: 'medium', cause: 'Sensor failed open', verification: 'Test sensor' }
    ],
    ['Check sensor wiring and connector', 'Test wiring continuity', 'Replace sensor if defective']
  ),

  ...createPowerWizardCode(100, 17, 'Engine Oil Pressure Low', 'Engine', 'Oil Pressure', 'warning',
    'Engine oil pressure is below the normal operating range warning threshold. While not critical, this requires prompt attention.',
    ['Oil pressure gauge reads low', 'Warning indicator active', 'Engine continues operating'],
    [
      { likelihood: 'high', cause: 'Oil level below optimal', verification: 'Check dipstick' },
      { likelihood: 'medium', cause: 'Oil viscosity wrong for temperature', verification: 'Verify oil grade' },
      { likelihood: 'medium', cause: 'Oil filter restriction', verification: 'Check filter age' }
    ],
    ['Check and top up oil level', 'Verify correct oil grade', 'Consider filter change']
  ),

  // ==================== COOLANT TEMPERATURE (SPN 110) ====================
  ...createPowerWizardCode(110, 0, 'Engine Coolant Temperature', 'Engine', 'Coolant', 'shutdown',
    'Engine coolant temperature has exceeded the maximum safe operating limit. Engine shutdown to prevent thermal damage.',
    ['Engine stopped on high temperature', 'Temperature was critically high', 'Risk of engine damage'],
    [
      { likelihood: 'high', cause: 'Severe coolant loss through leak', verification: 'Check for leaks and level' },
      { likelihood: 'high', cause: 'Cooling system component failure', verification: 'Check fan, belt, thermostat' },
      { likelihood: 'medium', cause: 'Radiator severely blocked', verification: 'Inspect radiator core' },
      { likelihood: 'low', cause: 'Head gasket failure', verification: 'Check for coolant/oil mixing' }
    ],
    ['Allow complete cool down before investigation', 'Do NOT remove radiator cap hot', 'Check entire cooling system', 'Repair any faults found', 'Check for engine damage']
  ),

  ...createPowerWizardCode(110, 3, 'Coolant Temperature Sensor', 'Engine', 'Coolant', 'warning',
    'The coolant temperature sensor circuit shows voltage above normal indicating short to power or sensor failure.',
    ['Temperature reading at maximum or invalid', 'May show false high temperature'],
    [
      { likelihood: 'high', cause: 'Sensor wiring shorted high', verification: 'Check harness' },
      { likelihood: 'medium', cause: 'Sensor failed', verification: 'Test sensor' }
    ],
    ['Check sensor wiring', 'Test sensor', 'Replace if faulty']
  ),

  ...createPowerWizardCode(110, 4, 'Coolant Temperature Sensor', 'Engine', 'Coolant', 'warning',
    'The coolant temperature sensor circuit shows voltage below normal indicating open circuit or ground short.',
    ['Temperature reading minimum or invalid', 'Sensor circuit open'],
    [
      { likelihood: 'high', cause: 'Sensor disconnected', verification: 'Check connector' },
      { likelihood: 'medium', cause: 'Wiring broken', verification: 'Check continuity' }
    ],
    ['Check sensor connection', 'Test wiring', 'Replace sensor']
  ),

  ...createPowerWizardCode(110, 15, 'Engine Coolant Temperature High', 'Engine', 'Coolant', 'warning',
    'Coolant temperature above normal operating range but below critical shutdown threshold.',
    ['Temperature above normal', 'Warning active', 'Cooling stressed'],
    [
      { likelihood: 'high', cause: 'Coolant level low', verification: 'Check expansion tank' },
      { likelihood: 'high', cause: 'Radiator airflow restricted', verification: 'Check radiator' },
      { likelihood: 'medium', cause: 'Cooling fan issue', verification: 'Check fan operation' }
    ],
    ['Check coolant level', 'Clean radiator', 'Verify fan works']
  ),

  // ==================== ENGINE SPEED (SPN 190) ====================
  ...createPowerWizardCode(190, 0, 'Engine Speed', 'Engine', 'Speed', 'shutdown',
    'Engine speed exceeded the maximum safe RPM limit triggering immediate protective shutdown.',
    ['Engine stopped on overspeed', 'Speed was above limit', 'Mechanical stress possible'],
    [
      { likelihood: 'high', cause: 'Governor or actuator failure', verification: 'Check governor system' },
      { likelihood: 'medium', cause: 'Electronic speed control fault', verification: 'Check ECM control' },
      { likelihood: 'medium', cause: 'Sudden load rejection', verification: 'Review load events' }
    ],
    ['Check governor thoroughly', 'Test actuator response', 'Verify speed control', 'Test at no load first']
  ),

  ...createPowerWizardCode(190, 2, 'Engine Speed Sensor', 'Engine', 'Speed', 'warning',
    'Engine speed sensor providing erratic, intermittent or incorrect signals.',
    ['Speed reading erratic', 'Possible control instability', 'Frequency measurement affected'],
    [
      { likelihood: 'high', cause: 'Sensor air gap incorrect', verification: 'Check and adjust gap' },
      { likelihood: 'high', cause: 'Intermittent connection', verification: 'Check wiring/connectors' },
      { likelihood: 'medium', cause: 'Sensor failing', verification: 'Test sensor output' }
    ],
    ['Adjust sensor air gap to spec', 'Check wiring connections', 'Replace sensor if bad signal']
  ),

  ...createPowerWizardCode(190, 8, 'Engine Speed Sensor', 'Engine', 'Speed', 'warning',
    'Abnormal frequency or signal from the engine speed sensor.',
    ['Speed signal abnormal', 'Control may be affected'],
    [
      { likelihood: 'high', cause: 'Sensor gap too wide', verification: 'Check gap' },
      { likelihood: 'medium', cause: 'Ring gear damage', verification: 'Inspect ring gear teeth' }
    ],
    ['Adjust gap', 'Check ring gear', 'Replace sensor']
  ),

  // ==================== FUEL PRESSURE (SPN 94) ====================
  ...createPowerWizardCode(94, 1, 'Fuel Pressure', 'Engine', 'Fuel', 'warning',
    'Fuel supply pressure is below the minimum required level for proper engine operation.',
    ['Fuel pressure low', 'Engine may run rough', 'Power may be reduced'],
    [
      { likelihood: 'high', cause: 'Fuel filter restriction', verification: 'Check filter condition' },
      { likelihood: 'high', cause: 'Fuel supply issue', verification: 'Check tank and supply line' },
      { likelihood: 'medium', cause: 'Transfer pump wear', verification: 'Test pump output' }
    ],
    ['Replace fuel filters', 'Check fuel supply', 'Verify tank has fuel', 'Check for air leaks']
  ),

  ...createPowerWizardCode(94, 3, 'Fuel Pressure Sensor', 'Engine', 'Fuel', 'warning',
    'Fuel pressure sensor circuit voltage above normal.',
    ['Pressure reading high or invalid'],
    [
      { likelihood: 'high', cause: 'Wiring shorted', verification: 'Check harness' }
    ],
    ['Check wiring', 'Replace sensor']
  ),

  ...createPowerWizardCode(94, 4, 'Fuel Pressure Sensor', 'Engine', 'Fuel', 'warning',
    'Fuel pressure sensor circuit voltage below normal.',
    ['Pressure reading low or invalid'],
    [
      { likelihood: 'high', cause: 'Wiring open', verification: 'Check connections' }
    ],
    ['Check connections', 'Test wiring']
  ),

  // ==================== FUEL LEVEL (SPN 96) ====================
  ...createPowerWizardCode(96, 1, 'Fuel Level', 'Engine', 'Fuel', 'warning',
    'Fuel tank level is below the low level warning threshold.',
    ['Fuel level low', 'Warning indicator', 'Refuel needed'],
    [
      { likelihood: 'high', cause: 'Fuel consumed normally', verification: 'Check runtime' },
      { likelihood: 'low', cause: 'Fuel leak', verification: 'Inspect for leaks' }
    ],
    ['Refuel tank with clean diesel']
  ),

  ...createPowerWizardCode(96, 17, 'Fuel Level Low', 'Engine', 'Fuel', 'warning',
    'Fuel level below normal operating range. Refueling recommended.',
    ['Fuel getting low', 'Plan for refueling'],
    [
      { likelihood: 'high', cause: 'Normal consumption', verification: 'Expected' }
    ],
    ['Refuel soon']
  ),

  ...createPowerWizardCode(96, 18, 'Fuel Level Very Low', 'Engine', 'Fuel', 'critical',
    'Fuel level critically low. Risk of running out and damaging fuel system.',
    ['Fuel nearly empty', 'Shutdown risk'],
    [
      { likelihood: 'high', cause: 'Fuel depleted', verification: 'Tank nearly empty' }
    ],
    ['Refuel immediately', 'Bleed air if ran dry']
  ),

  // ==================== BATTERY VOLTAGE (SPN 168) ====================
  ...createPowerWizardCode(168, 0, 'Battery Voltage', 'Engine', 'Battery', 'warning',
    'Battery voltage exceeds the maximum charging limit.',
    ['Voltage too high', 'Overcharging', 'Battery damage risk'],
    [
      { likelihood: 'high', cause: 'Charger output too high', verification: 'Measure charger' },
      { likelihood: 'medium', cause: 'Alternator regulator failed', verification: 'Check alternator' }
    ],
    ['Adjust or replace charger', 'Check alternator']
  ),

  ...createPowerWizardCode(168, 1, 'Battery Voltage', 'Engine', 'Battery', 'warning',
    'Battery voltage below minimum acceptable level.',
    ['Voltage low', 'Starting affected', 'Controller may be unreliable'],
    [
      { likelihood: 'high', cause: 'Battery discharged', verification: 'Check voltage' },
      { likelihood: 'high', cause: 'Charger not working', verification: 'Check charger' },
      { likelihood: 'medium', cause: 'Battery failed', verification: 'Load test' }
    ],
    ['Charge or replace battery', 'Check charger function']
  ),

  ...createPowerWizardCode(168, 3, 'Battery Voltage Sensor', 'Engine', 'Battery', 'warning',
    'Battery voltage sensing circuit shows high voltage.',
    ['Reading may be invalid'],
    [
      { likelihood: 'medium', cause: 'Sensing circuit fault', verification: 'Check circuit' }
    ],
    ['Check sensing wiring']
  ),

  ...createPowerWizardCode(168, 4, 'Battery Voltage Sensor', 'Engine', 'Battery', 'warning',
    'Battery voltage sensing circuit shows low voltage.',
    ['Reading invalid or zero'],
    [
      { likelihood: 'high', cause: 'Sensing disconnected', verification: 'Check connection' }
    ],
    ['Check sensing circuit']
  ),

  // ==================== GENERATOR VOLTAGE (SPN 520-522) ====================
  ...createPowerWizardCode(520, 0, 'Generator Voltage', 'Electrical', 'Voltage', 'shutdown',
    'Generator output voltage exceeded critical high limit. Load disconnected for protection.',
    ['Generator tripped', 'Voltage was too high', 'Equipment protection activated'],
    [
      { likelihood: 'high', cause: 'AVR failure or runaway', verification: 'Check AVR' },
      { likelihood: 'medium', cause: 'Speed surge', verification: 'Check governor' }
    ],
    ['Check AVR operation', 'Replace if faulty', 'Check speed stability']
  ),

  ...createPowerWizardCode(520, 1, 'Generator Voltage', 'Electrical', 'Voltage', 'shutdown',
    'Generator output voltage collapsed below critical minimum.',
    ['Generator tripped', 'Voltage was very low'],
    [
      { likelihood: 'high', cause: 'Severe overload', verification: 'Check load' },
      { likelihood: 'high', cause: 'Excitation failure', verification: 'Check field' }
    ],
    ['Remove excessive load', 'Check excitation system']
  ),

  ...createPowerWizardCode(520, 15, 'Generator Voltage High', 'Electrical', 'Voltage', 'warning',
    'Generator voltage above normal but below shutdown level.',
    ['Voltage somewhat high', 'AVR adjustment needed'],
    [
      { likelihood: 'high', cause: 'AVR set high', verification: 'Check setting' }
    ],
    ['Adjust AVR voltage']
  ),

  ...createPowerWizardCode(520, 17, 'Generator Voltage Low', 'Electrical', 'Voltage', 'warning',
    'Generator voltage below normal but above critical.',
    ['Voltage somewhat low', 'Check load and AVR'],
    [
      { likelihood: 'high', cause: 'Overloaded', verification: 'Check kW' },
      { likelihood: 'medium', cause: 'AVR low', verification: 'Check AVR' }
    ],
    ['Reduce load', 'Adjust AVR']
  ),

  ...createPowerWizardCode(521, 0, 'Generator Current', 'Electrical', 'Current', 'shutdown',
    'Generator current massively exceeded rating. Short circuit protection activated.',
    ['Generator tripped', 'Severe overcurrent'],
    [
      { likelihood: 'high', cause: 'Short circuit', verification: 'Check load circuits' }
    ],
    ['Find and repair short', 'Test insulation']
  ),

  ...createPowerWizardCode(521, 15, 'Generator Current High', 'Electrical', 'Current', 'warning',
    'Generator current above rated value but below trip.',
    ['Current high', 'Overload condition'],
    [
      { likelihood: 'high', cause: 'Load exceeds rating', verification: 'Check total load' }
    ],
    ['Reduce load']
  ),

  ...createPowerWizardCode(522, 0, 'Generator Frequency', 'Electrical', 'Frequency', 'shutdown',
    'Generator frequency exceeded maximum safe limit.',
    ['Tripped on high frequency'],
    [
      { likelihood: 'high', cause: 'Governor failure', verification: 'Check governor' }
    ],
    ['Check governor', 'Test actuator']
  ),

  ...createPowerWizardCode(522, 1, 'Generator Frequency', 'Electrical', 'Frequency', 'warning',
    'Generator frequency below minimum operating threshold.',
    ['Frequency low', 'Engine laboring'],
    [
      { likelihood: 'high', cause: 'Overload', verification: 'Check kW' },
      { likelihood: 'high', cause: 'Fuel issue', verification: 'Check fuel' }
    ],
    ['Reduce load', 'Check fuel system']
  ),

  // ==================== STARTING SYSTEM (SPN 636, 637, 1075) ====================
  ...createPowerWizardCode(636, 7, 'Engine Cranking', 'Engine', 'Starting', 'shutdown',
    'Engine failed to crank. Starter motor did not turn engine.',
    ['No cranking', 'Starter didn\'t engage'],
    [
      { likelihood: 'high', cause: 'Battery dead', verification: 'Check voltage' },
      { likelihood: 'high', cause: 'Starter connections', verification: 'Check cables' },
      { likelihood: 'medium', cause: 'Starter failed', verification: 'Test starter' }
    ],
    ['Check battery', 'Clean connections', 'Test starter']
  ),

  ...createPowerWizardCode(637, 7, 'Engine Start', 'Engine', 'Starting', 'shutdown',
    'Engine failed to start within allowed time and attempts.',
    ['Cranked but didn\'t start', 'Start lockout active'],
    [
      { likelihood: 'high', cause: 'No fuel delivery', verification: 'Check fuel to engine' },
      { likelihood: 'high', cause: 'Fuel solenoid issue', verification: 'Test solenoid' },
      { likelihood: 'medium', cause: 'Air in fuel', verification: 'Bleed system' }
    ],
    ['Check fuel system', 'Test solenoid', 'Bleed air']
  ),

  ...createPowerWizardCode(1075, 31, 'Emergency Stop', 'Engine', 'Emergency', 'shutdown',
    'Emergency stop circuit activated stopping the engine.',
    ['Engine stopped', 'E-stop active'],
    [
      { likelihood: 'high', cause: 'E-stop pressed', verification: 'Check buttons' }
    ],
    ['Release e-stop', 'Reset alarm']
  ),

  // ==================== COMMUNICATION (SPN 639) ====================
  ...createPowerWizardCode(639, 9, 'J1939 Data Link', 'Control', 'Communication', 'warning',
    'Abnormal update rate on J1939 CAN communication bus.',
    ['Communication erratic', 'Data may be stale'],
    [
      { likelihood: 'high', cause: 'CAN bus fault', verification: 'Check cables' },
      { likelihood: 'medium', cause: 'Termination issue', verification: 'Check 120 ohm' }
    ],
    ['Check CAN wiring', 'Verify termination']
  ),

  ...createPowerWizardCode(639, 19, 'J1939 Data Link', 'Control', 'Communication', 'warning',
    'Network data received in error on J1939 bus.',
    ['Communication errors', 'Data may be corrupt'],
    [
      { likelihood: 'high', cause: 'Bus noise or interference', verification: 'Check shielding' },
      { likelihood: 'medium', cause: 'Bad connection', verification: 'Check connectors' }
    ],
    ['Check connections', 'Verify shielding']
  ),

  // ==================== REVERSE POWER (SPN 523) ====================
  ...createPowerWizardCode(523, 1, 'Generator Power', 'Electrical', 'Power', 'shutdown',
    'Reverse power detected - generator motoring. Engine not producing power.',
    ['Generator disconnected', 'Was consuming power'],
    [
      { likelihood: 'high', cause: 'Engine not producing', verification: 'Check engine' }
    ],
    ['Verify engine runs correctly']
  ),

  ...createPowerWizardCode(523, 17, 'Generator Power Low', 'Electrical', 'Power', 'warning',
    'Generator power output below expected level.',
    ['Power output low'],
    [
      { likelihood: 'medium', cause: 'Load reduced', verification: 'Check load' }
    ],
    ['Verify load']
  ),

  // ==================== PROTECTION ALARMS ====================
  ...createPowerWizardCode(3510, 0, 'Engine Overspeed', 'Engine', 'Speed', 'shutdown',
    'Engine overspeed protection activated.',
    ['Shutdown on overspeed'],
    [
      { likelihood: 'high', cause: 'Governor fault', verification: 'Check governor' }
    ],
    ['Check governor', 'Test at no load']
  ),

  ...createPowerWizardCode(3511, 0, 'Low Oil Pressure Shutdown', 'Engine', 'Oil Pressure', 'shutdown',
    'Low oil pressure protection shutdown activated.',
    ['Stopped on low oil pressure'],
    [
      { likelihood: 'high', cause: 'Oil issue', verification: 'Check level' }
    ],
    ['Check oil', 'Find cause']
  ),

  ...createPowerWizardCode(3512, 0, 'High Coolant Temp Shutdown', 'Engine', 'Coolant', 'shutdown',
    'High coolant temperature protection shutdown activated.',
    ['Stopped on high temperature'],
    [
      { likelihood: 'high', cause: 'Cooling issue', verification: 'Check system' }
    ],
    ['Check cooling system']
  ),
];

export function getPowerWizardFaultCodes(): ControllerFaultCode[] {
  return POWERWIZARD_FAULT_CODES as ControllerFaultCode[];
}
