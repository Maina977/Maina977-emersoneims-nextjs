/**
 * Volvo Penta VODIA Fault Codes
 * Comprehensive database for Volvo Penta marine and industrial engines
 * Compatible with VODIA5, VODIA6 diagnostic systems
 * Covers D5, D7, D11, D13, D16, TAD, TWD series engines
 */

import { ControllerFaultCode } from '../controllerFaultCodes';

// VODIA uses SAE J1939 MID/PID/FMI coding system
// MID 128 = Engine Controller
// MID 140 = Instrument Cluster
// MID 183 = Engine Retarder
// MID 206 = EMS (Engine Management System)

const VODIA_MODELS = [
  'VODIA5', 'VODIA6', 'D5', 'D7', 'D11', 'D13', 'D16',
  'TAD530', 'TAD730', 'TAD1140', 'TAD1150', 'TAD1640', 'TAD1650',
  'TWD740', 'TWD1030', 'TWD1210', 'TWD1620'
];

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
    preventiveMeasures: ['Regular maintenance per Volvo Penta schedule', 'Use genuine Volvo Penta parts', 'Monitor via VODIA periodically'],
    verified: true,
    lastUpdated: '2024-01-15'
  }));
}

export const VODIA_FAULT_CODES: Partial<ControllerFaultCode>[] = [
  // ==================== ENGINE FAULTS (MID 128) ====================

  // Oil Pressure Faults
  ...createVODIACode(128, 100, 1, 'Engine Oil Pressure Low - Shutdown', 'Engine Protection', 'Lubrication', 'shutdown',
    'Engine oil pressure has dropped below minimum safe operating threshold. ECU has initiated protective shutdown to prevent engine damage.',
    ['Engine shutdown automatically', 'Low oil pressure warning lamp', 'Alarm horn sounding', 'Oil pressure gauge reading low'],
    [
      { likelihood: 'high', cause: 'Low engine oil level', verification: 'Check dipstick - add oil if low' },
      { likelihood: 'high', cause: 'Oil pressure sensor failure', verification: 'Measure actual pressure with mechanical gauge' },
      { likelihood: 'medium', cause: 'Oil pump failure or wear', verification: 'Check oil pump pressure at gallery' },
      { likelihood: 'medium', cause: 'Clogged oil filter', verification: 'Replace oil filter and check flow' },
      { likelihood: 'low', cause: 'Excessive bearing clearance', verification: 'Check main and rod bearing clearances' }
    ],
    ['Check engine oil level and top up if required', 'Verify oil pressure with mechanical gauge', 'Replace oil pressure sensor if faulty', 'Replace oil filter', 'Check oil pump condition if problem persists'],
    'VODIA software clear after fault corrected'),

  ...createVODIACode(128, 100, 3, 'Engine Oil Pressure Sensor Open Circuit', 'Sensors', 'Oil System', 'warning',
    'The engine oil pressure sensor circuit shows an open condition. No signal is being received from the sensor.',
    ['Oil pressure gauge not reading', 'Warning lamp flashing', 'Fault code stored', 'May default to limp mode'],
    [
      { likelihood: 'high', cause: 'Sensor connector disconnected', verification: 'Inspect connector at sensor' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check continuity from ECU to sensor' },
      { likelihood: 'medium', cause: 'Faulty oil pressure sensor', verification: 'Measure sensor resistance' },
      { likelihood: 'low', cause: 'ECU input circuit damage', verification: 'Check ECU connector pins' }
    ],
    ['Inspect sensor connector and reconnect if loose', 'Check wiring from sensor to ECU', 'Replace oil pressure sensor if faulty', 'Repair harness if wiring damage found'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 100, 4, 'Engine Oil Pressure Sensor Short Circuit', 'Sensors', 'Oil System', 'warning',
    'The engine oil pressure sensor circuit shows a short to ground or voltage. Signal is out of expected range.',
    ['Oil pressure reading stuck high or low', 'Warning lamp illuminated', 'Fault logged in ECU'],
    [
      { likelihood: 'high', cause: 'Damaged wiring touching ground', verification: 'Inspect harness for chafing' },
      { likelihood: 'high', cause: 'Internal sensor short', verification: 'Disconnect sensor and check resistance' },
      { likelihood: 'medium', cause: 'Water intrusion in connector', verification: 'Inspect connector for corrosion or moisture' }
    ],
    ['Inspect wiring for damage or chafing', 'Check connector for corrosion', 'Replace sensor if internal short confirmed', 'Repair harness as needed'],
    'VODIA software clear'),

  // Coolant Temperature Faults
  ...createVODIACode(128, 110, 0, 'Engine Coolant Temperature High - Shutdown', 'Engine Protection', 'Cooling System', 'shutdown',
    'Engine coolant temperature has exceeded maximum safe limit. Immediate shutdown initiated to prevent thermal damage.',
    ['Engine shutdown', 'High temperature warning active', 'Steam may be visible', 'Coolant may be boiling'],
    [
      { likelihood: 'high', cause: 'Low coolant level', verification: 'Check coolant level when engine cool' },
      { likelihood: 'high', cause: 'Thermostat stuck closed', verification: 'Check thermostat operation' },
      { likelihood: 'medium', cause: 'Water pump failure', verification: 'Check pump impeller and belt' },
      { likelihood: 'medium', cause: 'Radiator blocked', verification: 'Check airflow and clean if needed' },
      { likelihood: 'medium', cause: 'Cooling fan inoperative', verification: 'Check fan clutch or electric fan' },
      { likelihood: 'low', cause: 'Head gasket failure', verification: 'Check for combustion gases in coolant' }
    ],
    ['Allow engine to cool before opening system', 'Check and refill coolant level', 'Verify thermostat opens at correct temperature', 'Clean radiator fins', 'Check water pump and fan operation', 'Pressure test cooling system'],
    'VODIA software clear after temperature normalizes'),

  ...createVODIACode(128, 110, 3, 'Coolant Temperature Sensor Open Circuit', 'Sensors', 'Cooling System', 'warning',
    'No signal being received from the coolant temperature sensor. ECU cannot monitor engine temperature.',
    ['Temperature gauge not reading', 'Fan may run constantly', 'Cold start enrichment may be affected'],
    [
      { likelihood: 'high', cause: 'Sensor connector disconnected', verification: 'Check connector at sensor' },
      { likelihood: 'high', cause: 'Broken wire to sensor', verification: 'Test continuity to ECU' },
      { likelihood: 'medium', cause: 'Faulty temperature sensor', verification: 'Measure sensor resistance vs temp chart' }
    ],
    ['Inspect and reconnect sensor connector', 'Check wiring harness continuity', 'Replace coolant temperature sensor'],
    'VODIA software clear'),

  // Fuel System Faults
  ...createVODIACode(128, 94, 1, 'Fuel Pressure Low - Derate', 'Engine Protection', 'Fuel System', 'critical',
    'Fuel rail pressure is below minimum required for proper engine operation. ECU has reduced engine power to protect fuel system.',
    ['Reduced engine power', 'Engine runs rough', 'Black smoke possible', 'Power derate lamp on'],
    [
      { likelihood: 'high', cause: 'Clogged fuel filters', verification: 'Check fuel filter condition' },
      { likelihood: 'high', cause: 'Air in fuel system', verification: 'Check for air bubbles in fuel' },
      { likelihood: 'medium', cause: 'Fuel supply pump weak', verification: 'Check supply pump pressure' },
      { likelihood: 'medium', cause: 'Fuel line restriction', verification: 'Inspect fuel lines for kinks or blockage' },
      { likelihood: 'low', cause: 'High pressure pump failure', verification: 'Check HP pump output' }
    ],
    ['Replace fuel filters', 'Bleed air from fuel system', 'Check fuel supply pump pressure', 'Inspect fuel lines', 'Test high pressure pump'],
    'Auto clear when pressure normalizes'),

  ...createVODIACode(128, 94, 0, 'Fuel Pressure High - Derate', 'Engine Protection', 'Fuel System', 'critical',
    'Fuel rail pressure exceeds maximum safe limit. ECU has reduced power and may limit injection duration.',
    ['Reduced power', 'Check engine lamp on', 'Possible injector issues'],
    [
      { likelihood: 'high', cause: 'Pressure relief valve stuck', verification: 'Check relief valve operation' },
      { likelihood: 'high', cause: 'Fuel return line blocked', verification: 'Check fuel return flow' },
      { likelihood: 'medium', cause: 'Pressure regulator fault', verification: 'Test pressure regulator' },
      { likelihood: 'low', cause: 'ECU calibration issue', verification: 'Check software version' }
    ],
    ['Check fuel return line for blockage', 'Test pressure relief valve', 'Inspect pressure regulator', 'Update ECU calibration if needed'],
    'VODIA software clear'),

  ...createVODIACode(128, 157, 3, 'Fuel Rail Pressure Sensor Open', 'Sensors', 'Fuel System', 'critical',
    'No signal from fuel rail pressure sensor. ECU cannot control fuel pressure accurately.',
    ['Engine may not start', 'Erratic idle if running', 'Power limited'],
    [
      { likelihood: 'high', cause: 'Sensor connector issue', verification: 'Check connector at sensor' },
      { likelihood: 'high', cause: 'Wiring fault', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Sensor failure', verification: 'Replace and test sensor' }
    ],
    ['Inspect and secure sensor connector', 'Test wiring continuity', 'Replace fuel rail pressure sensor'],
    'VODIA software clear'),

  // Intake System Faults
  ...createVODIACode(128, 105, 0, 'Intake Manifold Temperature High', 'Engine Protection', 'Air System', 'warning',
    'Intake air temperature is above optimal range. This may indicate intercooler or turbo issues.',
    ['Reduced power possible', 'Higher exhaust temperatures', 'Engine working harder'],
    [
      { likelihood: 'high', cause: 'Intercooler blocked', verification: 'Inspect intercooler fins' },
      { likelihood: 'high', cause: 'Charge air hose leak', verification: 'Check all turbo pipes' },
      { likelihood: 'medium', cause: 'High ambient temperature', verification: 'Check operating environment' },
      { likelihood: 'low', cause: 'Turbocharger issue', verification: 'Check turbo for shaft play' }
    ],
    ['Clean intercooler externally', 'Check charge air piping for leaks', 'Ensure adequate ventilation', 'Inspect turbocharger'],
    'Auto clear when temperature normalizes'),

  ...createVODIACode(128, 102, 0, 'Boost Pressure High', 'Engine Protection', 'Turbo System', 'critical',
    'Turbocharger boost pressure exceeds maximum limit. Over-boost protection activated.',
    ['Engine derate active', 'Possible turbo whistle or surge', 'High EGT'],
    [
      { likelihood: 'high', cause: 'Wastegate stuck closed', verification: 'Check wastegate actuator' },
      { likelihood: 'high', cause: 'Wastegate actuator failure', verification: 'Test actuator with vacuum' },
      { likelihood: 'medium', cause: 'Boost control solenoid stuck', verification: 'Check solenoid operation' },
      { likelihood: 'low', cause: 'ECU calibration issue', verification: 'Verify calibration' }
    ],
    ['Check wastegate operation', 'Test wastegate actuator', 'Inspect boost control solenoid', 'Verify ECU calibration'],
    'VODIA software clear'),

  ...createVODIACode(128, 102, 1, 'Boost Pressure Low', 'Engine Protection', 'Turbo System', 'warning',
    'Turbocharger is not producing expected boost pressure. Engine power will be reduced.',
    ['Lack of power', 'Slow acceleration', 'Black smoke under load'],
    [
      { likelihood: 'high', cause: 'Boost leak in piping', verification: 'Smoke test charge air system' },
      { likelihood: 'high', cause: 'Turbo wear or damage', verification: 'Check turbo shaft play' },
      { likelihood: 'medium', cause: 'Wastegate stuck open', verification: 'Check wastegate position' },
      { likelihood: 'medium', cause: 'Dirty air filter', verification: 'Inspect air filter' },
      { likelihood: 'low', cause: 'Exhaust restriction', verification: 'Check exhaust backpressure' }
    ],
    ['Check all turbo piping for leaks', 'Inspect turbocharger condition', 'Check wastegate function', 'Replace air filter', 'Check exhaust system'],
    'Auto clear when boost normalizes'),

  // Exhaust System Faults
  ...createVODIACode(128, 173, 0, 'Exhaust Gas Temperature High', 'Engine Protection', 'Exhaust System', 'critical',
    'Exhaust gas temperature has exceeded safe limits. Engine power reduced to protect turbo and exhaust components.',
    ['Power derate active', 'Turbo could be glowing', 'Risk of component damage'],
    [
      { likelihood: 'high', cause: 'Engine overloaded', verification: 'Check load conditions' },
      { likelihood: 'high', cause: 'Dirty air filter restricting airflow', verification: 'Check air filter' },
      { likelihood: 'medium', cause: 'Fuel system overfueling', verification: 'Check injection timing and quantity' },
      { likelihood: 'medium', cause: 'Cooling system issue', verification: 'Check cooling system operation' },
      { likelihood: 'low', cause: 'Injector fault', verification: 'Test injectors' }
    ],
    ['Reduce engine load', 'Replace air filter', 'Check fuel system calibration', 'Verify cooling system operation', 'Test injectors'],
    'Auto clear when EGT normalizes'),

  // Electrical System Faults
  ...createVODIACode(128, 168, 1, 'Battery Voltage Low', 'Electrical', 'Charging System', 'warning',
    'System voltage has dropped below normal operating range. May affect ECU and sensor performance.',
    ['Dim lights', 'Slow cranking', 'ECU may reset', 'Sensor readings erratic'],
    [
      { likelihood: 'high', cause: 'Battery weak or discharged', verification: 'Load test battery' },
      { likelihood: 'high', cause: 'Alternator not charging', verification: 'Check alternator output' },
      { likelihood: 'medium', cause: 'Loose or corroded battery connections', verification: 'Inspect battery terminals' },
      { likelihood: 'medium', cause: 'Belt slipping', verification: 'Check alternator belt tension' }
    ],
    ['Check and charge battery', 'Test alternator output', 'Clean and tighten battery connections', 'Adjust or replace alternator belt'],
    'Auto clear when voltage normalizes'),

  ...createVODIACode(128, 168, 0, 'Battery Voltage High', 'Electrical', 'Charging System', 'warning',
    'System voltage exceeds normal range. May indicate overcharging condition.',
    ['Lights very bright', 'Battery may be hot', 'ECU may show errors'],
    [
      { likelihood: 'high', cause: 'Voltage regulator failure', verification: 'Test regulator output' },
      { likelihood: 'medium', cause: 'Loose ground connection', verification: 'Check all grounds' },
      { likelihood: 'low', cause: 'Wrong battery type', verification: 'Verify battery specification' }
    ],
    ['Check alternator voltage regulator', 'Inspect all ground connections', 'Verify correct battery installed'],
    'Auto clear when voltage normalizes'),

  // Injector Faults
  ...createVODIACode(128, 651, 5, 'Injector 1 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 1 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance (should be 0.3-0.5 ohms)', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 652, 5, 'Injector 2 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 2 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 653, 5, 'Injector 3 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 3 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 654, 5, 'Injector 4 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 4 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 655, 5, 'Injector 5 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 5 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  ...createVODIACode(128, 656, 5, 'Injector 6 Open Circuit', 'Fuel System', 'Injectors', 'critical',
    'No electrical continuity detected on Injector 6 circuit. Cylinder will not receive fuel.',
    ['Engine misfiring', 'Rough idle', 'Loss of power', 'Excessive smoke'],
    [
      { likelihood: 'high', cause: 'Injector connector disconnected', verification: 'Check connector at injector' },
      { likelihood: 'high', cause: 'Broken wire in harness', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Injector solenoid failure', verification: 'Measure injector resistance' }
    ],
    ['Inspect and reconnect injector connector', 'Check wiring harness', 'Test injector resistance', 'Replace injector if faulty'],
    'VODIA software clear after repair'),

  // Speed Sensor Faults
  ...createVODIACode(128, 190, 3, 'Engine Speed Sensor Open Circuit', 'Sensors', 'Speed/Position', 'critical',
    'No signal from primary engine speed (crankshaft) sensor. Engine may not start or will stall.',
    ['Engine cranks but won\'t start', 'Engine stalls intermittently', 'Tachometer not reading'],
    [
      { likelihood: 'high', cause: 'Sensor connector disconnected', verification: 'Check connector at sensor' },
      { likelihood: 'high', cause: 'Sensor gap too large', verification: 'Check sensor to tone wheel gap' },
      { likelihood: 'medium', cause: 'Broken wire', verification: 'Check harness continuity' },
      { likelihood: 'medium', cause: 'Sensor failure', verification: 'Test sensor resistance and output' }
    ],
    ['Inspect sensor connector', 'Check sensor mounting and gap (0.5-1.5mm)', 'Test wiring continuity', 'Replace crankshaft sensor'],
    'Auto clear when signal restored'),

  ...createVODIACode(128, 191, 3, 'Camshaft Position Sensor Open Circuit', 'Sensors', 'Speed/Position', 'warning',
    'No signal from camshaft position sensor. ECU using backup strategy but timing may be affected.',
    ['Hard starting', 'Reduced power possible', 'Fault lamp on'],
    [
      { likelihood: 'high', cause: 'Sensor connector issue', verification: 'Check connector' },
      { likelihood: 'medium', cause: 'Sensor failure', verification: 'Test sensor' },
      { likelihood: 'low', cause: 'Timing gear damage', verification: 'Check timing components' }
    ],
    ['Check sensor connector', 'Test sensor output with scope', 'Replace camshaft sensor', 'Check timing gear condition'],
    'VODIA software clear'),

  // Communication Faults
  ...createVODIACode(128, 639, 9, 'J1939 CAN Bus Error', 'Communications', 'Network', 'warning',
    'Communication fault detected on J1939 CAN network. Some modules may not communicate properly.',
    ['Warning lamps on multiple displays', 'Intermittent gauge readings', 'Some functions not responding'],
    [
      { likelihood: 'high', cause: 'CAN bus termination incorrect', verification: 'Check termination resistors' },
      { likelihood: 'high', cause: 'Damaged CAN wiring', verification: 'Inspect CAN High and Low wires' },
      { likelihood: 'medium', cause: 'Faulty CAN connector', verification: 'Check all J1939 connectors' },
      { likelihood: 'low', cause: 'Module failure', verification: 'Isolate modules one by one' }
    ],
    ['Check CAN bus termination (should read 60 ohms)', 'Inspect CAN wiring for damage', 'Check all connectors', 'Isolate faulty module'],
    'VODIA software clear'),

  // Additional Critical Faults
  ...createVODIACode(128, 111, 1, 'Coolant Level Low', 'Engine Protection', 'Cooling System', 'warning',
    'Coolant level sensor indicates low coolant in system. Risk of overheating if not addressed.',
    ['Low coolant warning light', 'Temperature may rise', 'Possible coolant leak visible'],
    [
      { likelihood: 'high', cause: 'Coolant leak external', verification: 'Inspect for visible leaks' },
      { likelihood: 'medium', cause: 'Level sensor fault', verification: 'Check sensor operation' },
      { likelihood: 'low', cause: 'Internal leak (head gasket)', verification: 'Check oil for coolant' }
    ],
    ['Top up coolant level', 'Check for external leaks', 'Pressure test cooling system', 'Test coolant level sensor'],
    'Auto clear when level restored'),

  ...createVODIACode(128, 111, 3, 'Coolant Level Sensor Open', 'Sensors', 'Cooling System', 'warning',
    'No signal from coolant level sensor. Cannot monitor coolant level.',
    ['Level gauge not reading', 'Warning may be active'],
    [
      { likelihood: 'high', cause: 'Sensor connector issue', verification: 'Check connector' },
      { likelihood: 'medium', cause: 'Sensor failure', verification: 'Test sensor' }
    ],
    ['Check sensor connector', 'Test sensor operation', 'Replace coolant level sensor'],
    'VODIA software clear'),

  ...createVODIACode(128, 97, 1, 'Water in Fuel Detected', 'Engine Protection', 'Fuel System', 'warning',
    'Water contamination detected in fuel system. Risk of injector and pump damage.',
    ['Water in fuel lamp on', 'Rough running possible', 'May hear injector knock'],
    [
      { likelihood: 'high', cause: 'Contaminated fuel', verification: 'Drain water separator' },
      { likelihood: 'medium', cause: 'Water separator sensor fault', verification: 'Check sensor' },
      { likelihood: 'low', cause: 'Fuel tank contamination', verification: 'Sample fuel from tank' }
    ],
    ['Drain water separator immediately', 'Replace fuel filter', 'If persistent, drain and clean fuel tank', 'Check fuel source quality'],
    'Auto clear when water drained'),

  ...createVODIACode(128, 101, 0, 'Crankcase Pressure High', 'Engine Protection', 'Engine Mechanical', 'warning',
    'Excessive crankcase pressure detected. May indicate blow-by or ventilation issue.',
    ['Oil fumes from breather', 'Oil leaks at seals', 'Reduced engine performance'],
    [
      { likelihood: 'high', cause: 'Crankcase breather blocked', verification: 'Check breather system' },
      { likelihood: 'high', cause: 'CCV filter clogged', verification: 'Inspect CCV filter' },
      { likelihood: 'medium', cause: 'Piston ring wear', verification: 'Check compression' },
      { likelihood: 'low', cause: 'Turbo seal leak', verification: 'Check turbo for oil' }
    ],
    ['Clean or replace crankcase breather', 'Replace CCV filter', 'Check compression if breather OK', 'Inspect turbo seals'],
    'Auto clear when pressure normalizes'),

  // Aftertreatment Faults (for engines with SCR/DPF)
  ...createVODIACode(128, 3031, 1, 'DEF Level Low', 'Aftertreatment', 'SCR System', 'warning',
    'Diesel Exhaust Fluid (AdBlue) level is low. Refill required to maintain emissions compliance.',
    ['DEF warning lamp', 'May show countdown to derate', 'AdBlue level gauge low'],
    [
      { likelihood: 'high', cause: 'DEF tank needs refilling', verification: 'Check DEF level' },
      { likelihood: 'medium', cause: 'DEF level sensor fault', verification: 'Test sensor' }
    ],
    ['Refill DEF tank with certified AdBlue', 'Only use ISO 22241 compliant DEF', 'Check for leaks in DEF system'],
    'Auto clear when refilled'),

  ...createVODIACode(128, 3226, 0, 'DPF Soot Level High', 'Aftertreatment', 'DPF System', 'warning',
    'Diesel Particulate Filter soot loading is high. Regeneration required.',
    ['DPF lamp on', 'Power may be reduced', 'Active regen may be needed'],
    [
      { likelihood: 'high', cause: 'Excessive idle time preventing regen', verification: 'Check duty cycle' },
      { likelihood: 'medium', cause: 'Failed regen attempts', verification: 'Check regen history in VODIA' },
      { likelihood: 'low', cause: 'DPF damage', verification: 'Inspect DPF condition' }
    ],
    ['Perform stationary regeneration via VODIA', 'Allow passive regen under load', 'Check regen inhibit conditions', 'Inspect DPF if regens failing'],
    'Auto clear after successful regeneration'),

  // Start System Faults
  ...createVODIACode(128, 676, 3, 'Starter Motor Control Open Circuit', 'Electrical', 'Start System', 'critical',
    'No signal to starter motor relay. Engine cannot be cranked.',
    ['Engine does not crank', 'No click from starter', 'Start command not reaching starter'],
    [
      { likelihood: 'high', cause: 'Starter relay failure', verification: 'Test relay operation' },
      { likelihood: 'high', cause: 'Wiring fault to starter', verification: 'Check starter circuit' },
      { likelihood: 'medium', cause: 'ECU output failure', verification: 'Check ECU starter output' }
    ],
    ['Test starter relay', 'Check all start circuit wiring', 'Verify ECU starter output', 'Replace faulty components'],
    'VODIA software clear'),

  ...createVODIACode(128, 677, 0, 'Glow Plug Circuit Fault', 'Electrical', 'Pre-heat System', 'warning',
    'Fault in glow plug circuit detected. Cold starting may be difficult.',
    ['Glow plug lamp not illuminating', 'Hard cold starts', 'White smoke on cold start'],
    [
      { likelihood: 'high', cause: 'Glow plug failure', verification: 'Test individual glow plugs' },
      { likelihood: 'medium', cause: 'Glow plug relay fault', verification: 'Test relay' },
      { likelihood: 'medium', cause: 'Timer/controller fault', verification: 'Check glow control module' }
    ],
    ['Test each glow plug resistance (0.2-0.5 ohms)', 'Replace failed glow plugs', 'Test glow plug relay', 'Check glow plug controller'],
    'VODIA software clear after repair'),

  // Governor/Speed Control Faults
  ...createVODIACode(128, 91, 0, 'Accelerator Pedal Position High', 'Control System', 'Throttle', 'warning',
    'Accelerator position signal stuck high. ECU may enter limp mode.',
    ['Engine runs at elevated idle', 'Limp mode active', 'Cannot control speed normally'],
    [
      { likelihood: 'high', cause: 'Throttle pedal return spring broken', verification: 'Check pedal mechanism' },
      { likelihood: 'high', cause: 'APP sensor fault', verification: 'Check sensor readings in VODIA' },
      { likelihood: 'medium', cause: 'Wiring short to voltage', verification: 'Check wiring harness' }
    ],
    ['Check throttle pedal mechanism', 'Test APP sensor with VODIA', 'Check wiring for shorts', 'Replace APP sensor'],
    'VODIA software clear'),

  ...createVODIACode(128, 91, 1, 'Accelerator Pedal Position Low', 'Control System', 'Throttle', 'warning',
    'Accelerator position signal stuck low. Engine will only idle.',
    ['Cannot accelerate engine', 'Stuck at idle', 'No throttle response'],
    [
      { likelihood: 'high', cause: 'Throttle cable disconnected', verification: 'Check throttle linkage' },
      { likelihood: 'high', cause: 'APP sensor fault', verification: 'Check sensor output in VODIA' },
      { likelihood: 'medium', cause: 'Wiring open circuit', verification: 'Test wiring continuity' }
    ],
    ['Check throttle cable/linkage', 'Test APP sensor', 'Check wiring continuity', 'Replace APP sensor'],
    'Auto clear when signal restored'),

  // EGR System Faults
  ...createVODIACode(128, 411, 0, 'EGR Valve Position High', 'Emissions', 'EGR System', 'warning',
    'EGR valve stuck open or position too high. May affect engine performance and emissions.',
    ['Poor idle quality', 'Black smoke', 'Loss of power at low load'],
    [
      { likelihood: 'high', cause: 'EGR valve stuck with carbon', verification: 'Inspect EGR valve' },
      { likelihood: 'medium', cause: 'EGR position sensor fault', verification: 'Test sensor' },
      { likelihood: 'medium', cause: 'EGR actuator fault', verification: 'Test actuator' }
    ],
    ['Clean EGR valve and port', 'Test EGR position sensor', 'Test actuator operation', 'Replace EGR valve if stuck'],
    'VODIA software clear'),

  ...createVODIACode(128, 411, 1, 'EGR Valve Position Low', 'Emissions', 'EGR System', 'warning',
    'EGR valve stuck closed or position too low. Higher NOx emissions possible.',
    ['Check engine lamp', 'Higher NOx in emissions test'],
    [
      { likelihood: 'high', cause: 'EGR valve stuck', verification: 'Check valve operation' },
      { likelihood: 'medium', cause: 'Vacuum/electric actuator fault', verification: 'Test actuator' },
      { likelihood: 'low', cause: 'ECU output fault', verification: 'Check ECU EGR control' }
    ],
    ['Check EGR valve mechanical operation', 'Test actuator signal', 'Clean or replace EGR valve'],
    'VODIA software clear'),
];

// Export getter function for use in the main fault code index
export function getVODIAFaultCodes(): ControllerFaultCode[] {
  return VODIA_FAULT_CODES as ControllerFaultCode[];
}

export default VODIA_FAULT_CODES;
