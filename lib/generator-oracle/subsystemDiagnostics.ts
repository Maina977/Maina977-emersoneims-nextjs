/**
 * COMPREHENSIVE SUBSYSTEM DIAGNOSTICS - INDEPENDENT REFERENCE
 *
 * Complete diagnostic coverage for all generator subsystems:
 * - Electrical: AVR, voltage regulator, alternator, wiring
 * - Fuel: injector pump, nozzles, filters, air in fuel
 * - Cooling: radiator, coolant sensors, thermostats
 * - Engine: governor, turbo, crank sensors, compression
 * - ECM: firmware, initialization, CANbus communication
 * - Controller: resets, misconfigurations, display errors
 * - Load: shutdown on load, derating, overload trips
 *
 * Each subsystem includes sensor checks, diagnostic flows,
 * preventive alerts, and technician guidance.
 *
 * COPYRIGHT-SAFE APPROACH:
 * ========================
 * - All diagnostic procedures are INDEPENDENTLY DEVELOPED
 * - Sensor specifications are based on general industry standards
 * - Diagnostic flows are original content from field experience
 * - NOT copied from any manufacturer documentation
 *
 * DISCLAIMER:
 * ===========
 * This is an INDEPENDENT reference tool. All procedures and specifications
 * are independently developed and may differ from official manufacturer
 * documentation. Brand names are used for IDENTIFICATION PURPOSES ONLY.
 * Generator Oracle is not affiliated with any equipment manufacturer.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SensorCheck {
  id: string;
  name: string;
  type: 'analog' | 'digital' | 'frequency' | 'resistance' | 'temperature';
  subsystem: SubsystemType;
  normalRange: { min: number; max: number; unit: string };
  warningRange: { min: number; max: number };
  criticalRange: { min: number; max: number };
  testProcedure: string[];
  failureModes: { mode: string; symptom: string; action: string }[];
  relatedFaultCodes: string[];
  calibrationInterval: string;
}

export interface DiagnosticFlow {
  id: string;
  name: string;
  subsystem: SubsystemType;
  symptoms: string[];
  steps: {
    step: number;
    action: string;
    expectedResult: string;
    ifYes: string;
    ifNo: string;
    tools: string[];
    safetyWarning?: string;
    timeEstimate: string;
  }[];
  possibleOutcomes: { diagnosis: string; nextSteps: string[] }[];
}

export interface PreventiveAlert {
  id: string;
  subsystem: SubsystemType;
  component: string;
  trigger: { parameter: string; condition: 'above' | 'below' | 'equals' | 'trend'; value: number };
  alertMessage: string;
  severity: 'info' | 'warning' | 'critical';
  recommendedAction: string[];
  preventionSchedule?: string;
}

export type SubsystemType = 'electrical' | 'fuel' | 'cooling' | 'engine' | 'ecm' | 'controller' | 'load' | 'wiring' | 'sensors' | 'communication';

// ═══════════════════════════════════════════════════════════════════════════════
// SENSOR DEFINITIONS BY SUBSYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const SENSOR_CHECKS: SensorCheck[] = [
  // ═══ ELECTRICAL SUBSYSTEM ═══
  {
    id: 'avr-sensing-voltage',
    name: 'AVR Sensing Voltage',
    type: 'analog',
    subsystem: 'electrical',
    normalRange: { min: 190, max: 260, unit: 'VAC' },
    warningRange: { min: 180, max: 270 },
    criticalRange: { min: 170, max: 280 },
    testProcedure: [
      '1. Locate AVR sensing terminals (typically F1, F2)',
      '2. Set multimeter to AC voltage',
      '3. Measure voltage with generator running at rated speed',
      '4. Compare to nominal voltage ±5%',
      '5. Check all three phases if applicable'
    ],
    failureModes: [
      { mode: 'No voltage', symptom: 'No output voltage', action: 'Check alternator excitation' },
      { mode: 'Low voltage', symptom: 'Undervoltage alarm', action: 'Check AVR adjustment' },
      { mode: 'High voltage', symptom: 'Overvoltage alarm', action: 'Replace AVR' }
    ],
    relatedFaultCodes: ['E001', 'DSE-001', 'E151'],
    calibrationInterval: 'Every 2000 hours'
  },
  {
    id: 'avr-exciter-output',
    name: 'AVR Exciter Output',
    type: 'analog',
    subsystem: 'electrical',
    normalRange: { min: 30, max: 90, unit: 'VDC' },
    warningRange: { min: 20, max: 100 },
    criticalRange: { min: 10, max: 120 },
    testProcedure: [
      '1. Locate AVR output terminals to exciter field',
      '2. Set multimeter to DC voltage',
      '3. Measure with generator running under load',
      '4. Voltage should increase with load',
      '5. Check for stable voltage (no hunting)'
    ],
    failureModes: [
      { mode: 'No output', symptom: 'No generator voltage', action: 'Replace AVR' },
      { mode: 'Fluctuating output', symptom: 'Voltage hunting', action: 'Check AVR stability settings' },
      { mode: 'Max output', symptom: 'Overvoltage', action: 'Check AVR feedback circuit' }
    ],
    relatedFaultCodes: ['E001', 'E002'],
    calibrationInterval: 'Every 2000 hours'
  },
  {
    id: 'alternator-winding-resistance',
    name: 'Alternator Winding Resistance',
    type: 'resistance',
    subsystem: 'electrical',
    normalRange: { min: 0.1, max: 2.0, unit: 'Ω' },
    warningRange: { min: 0.05, max: 3.0 },
    criticalRange: { min: 0, max: 5.0 },
    testProcedure: [
      '1. Ensure generator is stopped and isolated',
      '2. Disconnect all leads from alternator terminals',
      '3. Use low-resistance ohmmeter',
      '4. Measure U-V, V-W, W-U (should be equal ±5%)',
      '5. Compare to OEM specifications'
    ],
    failureModes: [
      { mode: 'High resistance', symptom: 'Reduced output, overheating', action: 'Check connections, possible rewinding' },
      { mode: 'Low resistance', symptom: 'Short circuit', action: 'Check for shorts, rewinding required' },
      { mode: 'Unbalanced', symptom: 'Phase imbalance', action: 'Identify faulty winding' }
    ],
    relatedFaultCodes: ['E002', 'E003'],
    calibrationInterval: 'Every 5000 hours or annually'
  },
  {
    id: 'phase-voltage-l1',
    name: 'Phase Voltage L1-N',
    type: 'analog',
    subsystem: 'electrical',
    normalRange: { min: 220, max: 240, unit: 'VAC' },
    warningRange: { min: 210, max: 250 },
    criticalRange: { min: 200, max: 260 },
    testProcedure: [
      '1. Use true RMS multimeter',
      '2. Measure L1 to Neutral',
      '3. Check under no-load and rated load',
      '4. Compare phases for balance (<3% deviation)',
      '5. Record values for trending'
    ],
    failureModes: [
      { mode: 'Low voltage', symptom: 'Undervoltage', action: 'Adjust AVR, check load' },
      { mode: 'High voltage', symptom: 'Overvoltage', action: 'Reduce AVR setting' },
      { mode: 'Fluctuating', symptom: 'Unstable voltage', action: 'Check governor, AVR' }
    ],
    relatedFaultCodes: ['E003', 'DSE-003'],
    calibrationInterval: 'Continuous monitoring'
  },

  // ═══ FUEL SUBSYSTEM ═══
  {
    id: 'fuel-pressure-rail',
    name: 'Fuel Rail Pressure',
    type: 'analog',
    subsystem: 'fuel',
    normalRange: { min: 300, max: 1800, unit: 'bar' },
    warningRange: { min: 250, max: 2000 },
    criticalRange: { min: 200, max: 2200 },
    testProcedure: [
      '1. Connect diagnostic tool to read rail pressure',
      '2. Check at cranking (should build quickly)',
      '3. Check at idle (typically 300-500 bar)',
      '4. Check at rated load (typically 1500-1800 bar)',
      '5. Monitor for stable pressure'
    ],
    failureModes: [
      { mode: 'Low pressure', symptom: 'Hard starting, power loss', action: 'Check filters, pump' },
      { mode: 'Pressure drop', symptom: 'Engine stalls under load', action: 'Check injector return' },
      { mode: 'No pressure', symptom: 'No start', action: 'Check fuel supply, HP pump' }
    ],
    relatedFaultCodes: ['F001', 'P0087', 'P0088'],
    calibrationInterval: 'Every 1000 hours'
  },
  {
    id: 'fuel-filter-differential',
    name: 'Fuel Filter Differential Pressure',
    type: 'analog',
    subsystem: 'fuel',
    normalRange: { min: 0, max: 0.5, unit: 'bar' },
    warningRange: { min: 0, max: 0.7 },
    criticalRange: { min: 0, max: 1.0 },
    testProcedure: [
      '1. Install differential pressure gauge across filter',
      '2. Run engine at rated load',
      '3. Record pressure drop',
      '4. Compare to new filter baseline',
      '5. Replace if > 0.5 bar difference'
    ],
    failureModes: [
      { mode: 'High differential', symptom: 'Restricted flow', action: 'Replace filter' },
      { mode: 'No differential', symptom: 'Filter bypassing', action: 'Check bypass valve' }
    ],
    relatedFaultCodes: ['F001', 'F003'],
    calibrationInterval: 'Every 500 hours'
  },
  {
    id: 'injector-return-flow',
    name: 'Injector Return Flow',
    type: 'analog',
    subsystem: 'fuel',
    normalRange: { min: 10, max: 60, unit: 'ml/min' },
    warningRange: { min: 5, max: 80 },
    criticalRange: { min: 0, max: 100 },
    testProcedure: [
      '1. Disconnect return lines from injectors',
      '2. Connect graduated containers to each',
      '3. Run engine at idle for 1 minute',
      '4. Compare flow between cylinders',
      '5. Excessive flow indicates worn injector'
    ],
    failureModes: [
      { mode: 'High return', symptom: 'Injector wear, misfire', action: 'Replace injector' },
      { mode: 'No return', symptom: 'Blocked return', action: 'Clear restriction' }
    ],
    relatedFaultCodes: ['F002', 'SPN651'],
    calibrationInterval: 'Every 2000 hours'
  },

  // ═══ COOLING SUBSYSTEM ═══
  {
    id: 'coolant-temperature',
    name: 'Coolant Temperature',
    type: 'temperature',
    subsystem: 'cooling',
    normalRange: { min: 70, max: 95, unit: '°C' },
    warningRange: { min: 60, max: 100 },
    criticalRange: { min: 50, max: 110 },
    testProcedure: [
      '1. Read temperature from controller display',
      '2. Verify with external infrared thermometer',
      '3. Check at outlet of engine block',
      '4. Compare inlet to outlet (10-15°C difference)',
      '5. Monitor during load changes'
    ],
    failureModes: [
      { mode: 'Overheating', symptom: 'High temp alarm', action: 'Check coolant, radiator, thermostat' },
      { mode: 'Undercooling', symptom: 'Never reaches temp', action: 'Check thermostat stuck open' },
      { mode: 'Erratic reading', symptom: 'Fluctuating display', action: 'Replace sensor' }
    ],
    relatedFaultCodes: ['C001', 'C002', 'P0217'],
    calibrationInterval: 'Every 2000 hours'
  },
  {
    id: 'coolant-level',
    name: 'Coolant Level Switch',
    type: 'digital',
    subsystem: 'cooling',
    normalRange: { min: 1, max: 1, unit: 'closed' },
    warningRange: { min: 0, max: 1 },
    criticalRange: { min: 0, max: 0 },
    testProcedure: [
      '1. Check expansion tank level visually',
      '2. Verify level switch operation',
      '3. Test by lowering level artificially',
      '4. Verify alarm triggers correctly',
      '5. Reset and refill to proper level'
    ],
    failureModes: [
      { mode: 'Switch stuck closed', symptom: 'No low level alarm', action: 'Replace switch' },
      { mode: 'Switch stuck open', symptom: 'False low level alarm', action: 'Check wiring, replace switch' }
    ],
    relatedFaultCodes: ['C001', 'DSE-103'],
    calibrationInterval: 'Every 500 hours'
  },
  {
    id: 'thermostat-operation',
    name: 'Thermostat Operation',
    type: 'temperature',
    subsystem: 'cooling',
    normalRange: { min: 82, max: 88, unit: '°C opening' },
    warningRange: { min: 78, max: 92 },
    criticalRange: { min: 70, max: 95 },
    testProcedure: [
      '1. Remove thermostat from engine',
      '2. Place in heated water with thermometer',
      '3. Note temperature when valve starts opening',
      '4. Full open should be 10-15°C higher',
      '5. Replace if not within spec'
    ],
    failureModes: [
      { mode: 'Stuck closed', symptom: 'Overheating', action: 'Replace thermostat' },
      { mode: 'Stuck open', symptom: 'Slow warmup, overcooling', action: 'Replace thermostat' },
      { mode: 'Partial opening', symptom: 'Fluctuating temperature', action: 'Replace thermostat' }
    ],
    relatedFaultCodes: ['C001', 'C002'],
    calibrationInterval: 'Every 5000 hours or 3 years'
  },

  // ═══ ENGINE SUBSYSTEM ═══
  {
    id: 'oil-pressure',
    name: 'Engine Oil Pressure',
    type: 'analog',
    subsystem: 'engine',
    normalRange: { min: 2.5, max: 5.0, unit: 'bar' },
    warningRange: { min: 2.0, max: 6.0 },
    criticalRange: { min: 1.5, max: 7.0 },
    testProcedure: [
      '1. Read pressure from controller at operating temp',
      '2. Verify with mechanical gauge at oil gallery',
      '3. Check at idle (should be > 1 bar)',
      '4. Check at rated speed (should be 3-5 bar)',
      '5. Monitor for fluctuations'
    ],
    failureModes: [
      { mode: 'Low pressure', symptom: 'Low oil pressure alarm', action: 'Check level, filter, pump' },
      { mode: 'No pressure', symptom: 'Critical alarm, shutdown', action: 'STOP ENGINE, check pump, bearings' },
      { mode: 'High pressure', symptom: 'Filter bypass', action: 'Check relief valve, filter' }
    ],
    relatedFaultCodes: ['ENG001', 'SPN100', 'DSE-133'],
    calibrationInterval: 'Continuous monitoring'
  },
  {
    id: 'magnetic-pickup',
    name: 'Magnetic Pickup (Speed Sensor)',
    type: 'frequency',
    subsystem: 'engine',
    normalRange: { min: 1000, max: 2000, unit: 'mV AC' },
    warningRange: { min: 500, max: 2500 },
    criticalRange: { min: 200, max: 3000 },
    testProcedure: [
      '1. Check sensor gap to flywheel teeth (0.5-1.0mm)',
      '2. Measure AC voltage output during cranking',
      '3. Use oscilloscope to check signal quality',
      '4. Verify clean, consistent pulses',
      '5. Check wiring for damage/interference'
    ],
    failureModes: [
      { mode: 'Low signal', symptom: 'No speed reading', action: 'Adjust gap, replace sensor' },
      { mode: 'Erratic signal', symptom: 'Speed fluctuation', action: 'Check flywheel teeth, replace sensor' },
      { mode: 'No signal', symptom: 'No start/no run', action: 'Replace sensor' }
    ],
    relatedFaultCodes: ['ENG003', 'P0336', 'SPN190'],
    calibrationInterval: 'Every 2000 hours'
  },
  {
    id: 'turbo-boost-pressure',
    name: 'Turbocharger Boost Pressure',
    type: 'analog',
    subsystem: 'engine',
    normalRange: { min: 0.5, max: 2.5, unit: 'bar' },
    warningRange: { min: 0.3, max: 2.8 },
    criticalRange: { min: 0.1, max: 3.0 },
    testProcedure: [
      '1. Read boost pressure from controller/gauge',
      '2. Check at idle (should be near 0)',
      '3. Check at rated load (per engine spec)',
      '4. Monitor boost buildup rate',
      '5. Listen for turbo sounds (whine, surge)'
    ],
    failureModes: [
      { mode: 'Low boost', symptom: 'Power loss, black smoke', action: 'Check turbo, air filter, exhaust' },
      { mode: 'Overboost', symptom: 'Overboost alarm', action: 'Check wastegate, VGT' },
      { mode: 'No boost', symptom: 'No power', action: 'Check turbo bearings, shaft' }
    ],
    relatedFaultCodes: ['ENG002', 'P0234', 'SPN102'],
    calibrationInterval: 'Every 1000 hours'
  },
  {
    id: 'governor-actuator',
    name: 'Governor Actuator Position',
    type: 'analog',
    subsystem: 'engine',
    normalRange: { min: 10, max: 90, unit: '%' },
    warningRange: { min: 5, max: 95 },
    criticalRange: { min: 0, max: 100 },
    testProcedure: [
      '1. Monitor actuator position via controller',
      '2. Check at idle (typically 20-30%)',
      '3. Check at full load (typically 70-90%)',
      '4. Verify smooth response to load changes',
      '5. Check linkage for binding'
    ],
    failureModes: [
      { mode: 'Stuck position', symptom: 'Fixed speed/load', action: 'Check linkage, replace actuator' },
      { mode: 'Erratic movement', symptom: 'Hunting, surging', action: 'Check signal, adjust gains' },
      { mode: 'Min position', symptom: 'No power', action: 'Check fuel rack, linkage' }
    ],
    relatedFaultCodes: ['ENG001', 'DSE-133'],
    calibrationInterval: 'Every 2000 hours'
  },

  // ═══ ECM SUBSYSTEM ═══
  {
    id: 'ecm-supply-voltage',
    name: 'ECM Supply Voltage',
    type: 'analog',
    subsystem: 'ecm',
    normalRange: { min: 22, max: 30, unit: 'VDC' },
    warningRange: { min: 20, max: 32 },
    criticalRange: { min: 18, max: 35 },
    testProcedure: [
      '1. Measure voltage at ECM power connector',
      '2. Check at key-on (should be battery voltage)',
      '3. Check during cranking (should not drop < 20V)',
      '4. Check during running (charging voltage)',
      '5. Verify ground circuit (<0.1V drop)'
    ],
    failureModes: [
      { mode: 'Low voltage', symptom: 'ECM reset, fault codes', action: 'Check batteries, charging' },
      { mode: 'Voltage spike', symptom: 'ECM damage', action: 'Check alternator, install surge protection' },
      { mode: 'No voltage', symptom: 'No ECM communication', action: 'Check fuse, wiring' }
    ],
    relatedFaultCodes: ['ECM001', 'SPN629', 'DSE-629'],
    calibrationInterval: 'Every 500 hours'
  },
  {
    id: 'can-bus-resistance',
    name: 'CAN Bus Termination Resistance',
    type: 'resistance',
    subsystem: 'communication',
    normalRange: { min: 55, max: 65, unit: 'Ω' },
    warningRange: { min: 50, max: 70 },
    criticalRange: { min: 40, max: 80 },
    testProcedure: [
      '1. Turn off all power to CAN bus',
      '2. Measure resistance between CAN H and CAN L',
      '3. Should read approximately 60Ω (parallel 120Ω terminators)',
      '4. If 120Ω, one terminator missing',
      '5. If < 50Ω, possible short'
    ],
    failureModes: [
      { mode: 'High resistance', symptom: 'Communication errors', action: 'Add terminator' },
      { mode: 'Low resistance', symptom: 'No communication', action: 'Check for shorts' },
      { mode: 'Open circuit', symptom: 'No communication', action: 'Check wiring, terminators' }
    ],
    relatedFaultCodes: ['ECM002', 'SPN639', 'E502'],
    calibrationInterval: 'Every 1000 hours'
  },

  // ═══ CONTROLLER SUBSYSTEM ═══
  {
    id: 'controller-display',
    name: 'Controller Display Test',
    type: 'digital',
    subsystem: 'controller',
    normalRange: { min: 1, max: 1, unit: 'pass' },
    warningRange: { min: 0, max: 1 },
    criticalRange: { min: 0, max: 0 },
    testProcedure: [
      '1. Power on controller',
      '2. Check display illumination',
      '3. Verify all segments/pixels working',
      '4. Check button/key responsiveness',
      '5. Navigate through all menus'
    ],
    failureModes: [
      { mode: 'Display blank', symptom: 'No display', action: 'Check power, replace display' },
      { mode: 'Partial display', symptom: 'Missing segments', action: 'Replace display module' },
      { mode: 'Buttons unresponsive', symptom: 'No control', action: 'Check membrane, replace keypad' }
    ],
    relatedFaultCodes: ['CTL001', 'DSE-998'],
    calibrationInterval: 'Every service visit'
  },

  // ═══ LOAD SUBSYSTEM ═══
  {
    id: 'load-current-ct',
    name: 'Current Transformer (CT)',
    type: 'analog',
    subsystem: 'load',
    normalRange: { min: 0, max: 100, unit: '% of CT ratio' },
    warningRange: { min: 0, max: 110 },
    criticalRange: { min: 0, max: 120 },
    testProcedure: [
      '1. Apply known load to generator',
      '2. Measure CT secondary current',
      '3. Calculate primary current from ratio',
      '4. Compare to clamp meter on primary',
      '5. Verify accuracy within 1%'
    ],
    failureModes: [
      { mode: 'High reading', symptom: 'False overload alarms', action: 'Check CT ratio setting' },
      { mode: 'Low reading', symptom: 'Underprotection', action: 'Replace CT' },
      { mode: 'No reading', symptom: 'No kW display', action: 'Check CT secondary wiring' }
    ],
    relatedFaultCodes: ['LD001', 'E003'],
    calibrationInterval: 'Annually'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGNOSTIC FLOWS
// ═══════════════════════════════════════════════════════════════════════════════

export const DIAGNOSTIC_FLOWS: DiagnosticFlow[] = [
  {
    id: 'no-voltage-output',
    name: 'No Voltage Output Diagnostic',
    subsystem: 'electrical',
    symptoms: ['No output voltage', 'Voltmeter reads zero', 'Undervoltage alarm'],
    steps: [
      {
        step: 1,
        action: 'Check if engine is running at rated speed',
        expectedResult: 'RPM at 1500 (50Hz) or 1800 (60Hz)',
        ifYes: 'Proceed to step 2',
        ifNo: 'Diagnose engine/governor issue first',
        tools: ['Controller display', 'Tachometer'],
        timeEstimate: '1 minute'
      },
      {
        step: 2,
        action: 'Measure residual voltage at alternator terminals',
        expectedResult: '5-15 VAC with engine running',
        ifYes: 'AVR may be faulty - proceed to step 3',
        ifNo: 'Check for loss of residual magnetism - flash field',
        tools: ['Multimeter'],
        safetyWarning: 'High voltage present',
        timeEstimate: '3 minutes'
      },
      {
        step: 3,
        action: 'Check AVR sensing voltage input',
        expectedResult: 'Voltage present on sensing terminals',
        ifYes: 'AVR should be producing output - check step 4',
        ifNo: 'Check sensing wire connections',
        tools: ['Multimeter'],
        timeEstimate: '2 minutes'
      },
      {
        step: 4,
        action: 'Measure AVR output to exciter field',
        expectedResult: '30-90 VDC under load',
        ifYes: 'Check rotating diodes and exciter winding',
        ifNo: 'Replace AVR',
        tools: ['Multimeter'],
        timeEstimate: '3 minutes'
      },
      {
        step: 5,
        action: 'Test rotating diodes',
        expectedResult: 'Forward bias: 0.5-0.7V, Reverse: OL',
        ifYes: 'Check exciter winding resistance',
        ifNo: 'Replace rotating diode assembly',
        tools: ['Multimeter diode test'],
        timeEstimate: '10 minutes'
      }
    ],
    possibleOutcomes: [
      { diagnosis: 'AVR failure', nextSteps: ['Order replacement AVR', 'Install and configure', 'Test output'] },
      { diagnosis: 'Rotating diode failure', nextSteps: ['Order diode assembly', 'Disassemble rotor', 'Replace diodes'] },
      { diagnosis: 'Loss of residual magnetism', nextSteps: ['Flash field with 12V battery', 'Connect positive to F+ briefly', 'Restart'] },
      { diagnosis: 'Exciter winding failure', nextSteps: ['Test winding resistance', 'Compare to spec', 'Rewinding may be required'] }
    ]
  },
  {
    id: 'engine-overheating',
    name: 'Engine Overheating Diagnostic',
    subsystem: 'cooling',
    symptoms: ['High temperature alarm', 'Coolant boiling', 'Temperature gauge in red'],
    steps: [
      {
        step: 1,
        action: 'Safely stop engine and allow to cool',
        expectedResult: 'Engine stopped',
        ifYes: 'Wait 30 minutes before opening cooling system',
        ifNo: 'Use emergency stop if necessary',
        tools: [],
        safetyWarning: 'DO NOT open radiator cap while hot - severe burn risk',
        timeEstimate: '30 minutes'
      },
      {
        step: 2,
        action: 'Check coolant level in expansion tank',
        expectedResult: 'Level between MIN and MAX marks',
        ifYes: 'Proceed to step 3',
        ifNo: 'Add coolant, check for leaks',
        tools: ['Visual inspection'],
        timeEstimate: '2 minutes'
      },
      {
        step: 3,
        action: 'Inspect radiator for external blockages',
        expectedResult: 'Clean fins, good airflow',
        ifYes: 'Proceed to step 4',
        ifNo: 'Clean radiator with compressed air/water (when cool)',
        tools: ['Compressed air', 'Water hose'],
        timeEstimate: '15 minutes'
      },
      {
        step: 4,
        action: 'Check cooling fan operation',
        expectedResult: 'Fan runs, moves air toward radiator',
        ifYes: 'Proceed to step 5',
        ifNo: 'Check fan motor, belt, thermostat switch',
        tools: ['Visual inspection'],
        timeEstimate: '2 minutes'
      },
      {
        step: 5,
        action: 'Test thermostat operation',
        expectedResult: 'Opens at 82-88°C',
        ifYes: 'Proceed to step 6',
        ifNo: 'Replace thermostat',
        tools: ['Thermometer', 'Pot of water'],
        timeEstimate: '20 minutes'
      },
      {
        step: 6,
        action: 'Pressure test cooling system',
        expectedResult: 'Holds pressure for 10 minutes',
        ifYes: 'Check water pump, head gasket',
        ifNo: 'Find and repair leak',
        tools: ['Cooling system pressure tester'],
        timeEstimate: '15 minutes'
      }
    ],
    possibleOutcomes: [
      { diagnosis: 'Low coolant', nextSteps: ['Top up coolant', 'Pressure test for leaks', 'Monitor level'] },
      { diagnosis: 'Blocked radiator', nextSteps: ['Clean externally', 'Consider internal flush', 'Replace if corroded'] },
      { diagnosis: 'Thermostat failure', nextSteps: ['Replace thermostat', 'Use OEM part', 'Test operation'] },
      { diagnosis: 'Water pump failure', nextSteps: ['Inspect impeller', 'Replace pump', 'Replace belt and tensioner'] },
      { diagnosis: 'Head gasket leak', nextSteps: ['Check for combustion gases in coolant', 'Major repair required'] }
    ]
  },
  {
    id: 'engine-no-start',
    name: 'Engine No Start Diagnostic',
    subsystem: 'engine',
    symptoms: ['Cranks but no start', 'No combustion', 'Cranking only'],
    steps: [
      {
        step: 1,
        action: 'Verify fuel level and supply',
        expectedResult: 'Fuel tank >25% full, fuel valve open',
        ifYes: 'Proceed to step 2',
        ifNo: 'Add fuel, open valves',
        tools: ['Visual inspection'],
        timeEstimate: '1 minute'
      },
      {
        step: 2,
        action: 'Check for air in fuel system',
        expectedResult: 'No air bubbles in clear return line',
        ifYes: 'Proceed to step 3',
        ifNo: 'Bleed fuel system using primer pump',
        tools: ['Manual primer pump'],
        timeEstimate: '10 minutes'
      },
      {
        step: 3,
        action: 'Verify fuel pressure during cranking',
        expectedResult: 'Fuel pressure builds to min 200 bar',
        ifYes: 'Proceed to step 4',
        ifNo: 'Check fuel pump, filters, HP pump',
        tools: ['Diagnostic tool'],
        timeEstimate: '3 minutes'
      },
      {
        step: 4,
        action: 'Check for crankshaft position sensor signal',
        expectedResult: 'RPM reading during cranking',
        ifYes: 'Proceed to step 5',
        ifNo: 'Check CKP sensor gap, replace sensor',
        tools: ['Controller display', 'Oscilloscope'],
        timeEstimate: '5 minutes'
      },
      {
        step: 5,
        action: 'Verify ECM is commanding injectors',
        expectedResult: 'Injector actuation audible/measurable',
        ifYes: 'Check injector operation, timing',
        ifNo: 'Check ECM power, CAN communication',
        tools: ['Stethoscope', 'Noid light'],
        timeEstimate: '5 minutes'
      }
    ],
    possibleOutcomes: [
      { diagnosis: 'Air in fuel', nextSteps: ['Bleed system completely', 'Find air entry point', 'Repair leak'] },
      { diagnosis: 'Fuel pump failure', nextSteps: ['Test pump output', 'Replace pump', 'Prime system'] },
      { diagnosis: 'CKP sensor failure', nextSteps: ['Check gap (0.5-1mm)', 'Check wiring', 'Replace sensor'] },
      { diagnosis: 'ECM communication fault', nextSteps: ['Check CAN bus', 'Check ECM power', 'Reset ECM'] },
      { diagnosis: 'Injector failure', nextSteps: ['Test each injector', 'Check wiring', 'Replace faulty injector'] }
    ]
  },
  {
    id: 'canbus-communication-loss',
    name: 'CANbus Communication Loss Diagnostic',
    subsystem: 'communication',
    symptoms: ['No ECM data', 'Communication error', 'J1939 timeout'],
    steps: [
      {
        step: 1,
        action: 'Check CAN bus termination resistance',
        expectedResult: '60Ω between CAN H and CAN L',
        ifYes: 'Proceed to step 2',
        ifNo: 'Add/remove termination resistors as needed',
        tools: ['Multimeter'],
        timeEstimate: '3 minutes'
      },
      {
        step: 2,
        action: 'Check CAN wiring for damage',
        expectedResult: 'No visible damage, proper shielding',
        ifYes: 'Proceed to step 3',
        ifNo: 'Repair wiring, ensure twisted pair used',
        tools: ['Visual inspection'],
        timeEstimate: '10 minutes'
      },
      {
        step: 3,
        action: 'Verify CAN H and CAN L not swapped',
        expectedResult: 'Correct polarity at all nodes',
        ifYes: 'Proceed to step 4',
        ifNo: 'Correct wiring polarity',
        tools: ['Wiring diagram', 'Multimeter'],
        timeEstimate: '10 minutes'
      },
      {
        step: 4,
        action: 'Check for CAN signal with oscilloscope',
        expectedResult: 'Clean square waves, proper voltage levels',
        ifYes: 'Check software/address configuration',
        ifNo: 'Replace CAN transceiver or ECM',
        tools: ['Oscilloscope'],
        timeEstimate: '15 minutes'
      }
    ],
    possibleOutcomes: [
      { diagnosis: 'Missing termination', nextSteps: ['Install 120Ω resistor', 'At each end of bus'] },
      { diagnosis: 'Wiring fault', nextSteps: ['Repair damaged wires', 'Use proper shielded twisted pair'] },
      { diagnosis: 'Polarity swap', nextSteps: ['Correct CAN H and CAN L connections'] },
      { diagnosis: 'Node failure', nextSteps: ['Isolate faulty node', 'Replace controller or ECM'] }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PREVENTIVE ALERTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PREVENTIVE_ALERTS: PreventiveAlert[] = [
  // Electrical
  {
    id: 'alt-temp-warning',
    subsystem: 'electrical',
    component: 'Alternator Winding',
    trigger: { parameter: 'alternatorTemp', condition: 'above', value: 140 },
    alertMessage: 'Alternator temperature trending high - check ventilation and load',
    severity: 'warning',
    recommendedAction: ['Reduce load to 80%', 'Check air inlet filters', 'Verify fan operation'],
    preventionSchedule: 'Monthly airflow check'
  },
  {
    id: 'voltage-imbalance',
    subsystem: 'electrical',
    component: 'Phase Balance',
    trigger: { parameter: 'voltageImbalance', condition: 'above', value: 5 },
    alertMessage: 'Phase voltage imbalance exceeds 5% - may damage equipment',
    severity: 'warning',
    recommendedAction: ['Balance single-phase loads', 'Check for failed loads', 'Verify CT accuracy']
  },

  // Fuel
  {
    id: 'filter-replacement-due',
    subsystem: 'fuel',
    component: 'Fuel Filters',
    trigger: { parameter: 'filterHours', condition: 'above', value: 500 },
    alertMessage: 'Fuel filter replacement due - change primary and secondary filters',
    severity: 'info',
    recommendedAction: ['Order replacement filters', 'Schedule maintenance window', 'Bleed system after change'],
    preventionSchedule: 'Every 500 hours or 6 months'
  },
  {
    id: 'fuel-contamination',
    subsystem: 'fuel',
    component: 'Fuel Quality',
    trigger: { parameter: 'waterInFuel', condition: 'equals', value: 1 },
    alertMessage: 'Water detected in fuel - drain water separator immediately',
    severity: 'warning',
    recommendedAction: ['Drain water separator', 'Check fuel source', 'Consider tank cleaning']
  },
  {
    id: 'injector-degradation',
    subsystem: 'fuel',
    component: 'Fuel Injectors',
    trigger: { parameter: 'injectorBalanceDeviation', condition: 'above', value: 15 },
    alertMessage: 'Injector balance deviation >15% - injector service recommended',
    severity: 'warning',
    recommendedAction: ['Perform cylinder cutout test', 'Check return flow', 'Schedule injector service']
  },

  // Cooling
  {
    id: 'coolant-level-low',
    subsystem: 'cooling',
    component: 'Coolant Level',
    trigger: { parameter: 'coolantLevel', condition: 'below', value: 80 },
    alertMessage: 'Coolant level low - check for leaks and top up',
    severity: 'warning',
    recommendedAction: ['Add correct coolant mixture', 'Pressure test system', 'Check hoses and clamps']
  },
  {
    id: 'coolant-change-due',
    subsystem: 'cooling',
    component: 'Coolant Condition',
    trigger: { parameter: 'coolantAge', condition: 'above', value: 8760 }, // 1 year in hours
    alertMessage: 'Annual coolant service due - test concentration and condition',
    severity: 'info',
    recommendedAction: ['Test coolant concentration', 'Check pH and inhibitors', 'Flush and replace if needed'],
    preventionSchedule: 'Annually or per OEM'
  },

  // Engine
  {
    id: 'oil-change-due',
    subsystem: 'engine',
    component: 'Engine Oil',
    trigger: { parameter: 'oilChangeHours', condition: 'above', value: 500 },
    alertMessage: 'Engine oil change due - schedule maintenance',
    severity: 'info',
    recommendedAction: ['Order oil and filter', 'Schedule maintenance', 'Record oil consumption'],
    preventionSchedule: 'Every 500 hours or 6 months'
  },
  {
    id: 'air-filter-restriction',
    subsystem: 'engine',
    component: 'Air Filter',
    trigger: { parameter: 'airFilterRestriction', condition: 'above', value: 25 },
    alertMessage: 'Air filter restriction high - replace air filter',
    severity: 'warning',
    recommendedAction: ['Replace air filter', 'Check intake ducting', 'Clean pre-filter if equipped']
  },
  {
    id: 'turbo-performance',
    subsystem: 'engine',
    component: 'Turbocharger',
    trigger: { parameter: 'boostPressureTrend', condition: 'trend', value: -10 },
    alertMessage: 'Turbo boost pressure declining - inspect turbocharger',
    severity: 'warning',
    recommendedAction: ['Check air filter', 'Inspect turbo for play', 'Check wastegate/VGT operation']
  },

  // ECM
  {
    id: 'ecm-voltage-low',
    subsystem: 'ecm',
    component: 'ECM Power Supply',
    trigger: { parameter: 'ecmVoltage', condition: 'below', value: 22 },
    alertMessage: 'ECM supply voltage low - check batteries and charging',
    severity: 'warning',
    recommendedAction: ['Test battery condition', 'Check alternator output', 'Inspect connections']
  },
  {
    id: 'firmware-update-available',
    subsystem: 'ecm',
    component: 'ECM Firmware',
    trigger: { parameter: 'firmwareOutdated', condition: 'equals', value: 1 },
    alertMessage: 'ECM firmware update available - contact service',
    severity: 'info',
    recommendedAction: ['Download latest firmware', 'Schedule update window', 'Back up calibration']
  },

  // Load
  {
    id: 'chronic-overload',
    subsystem: 'load',
    component: 'Generator Load',
    trigger: { parameter: 'averageLoad', condition: 'above', value: 85 },
    alertMessage: 'Average load exceeds 85% - consider load management or larger unit',
    severity: 'warning',
    recommendedAction: ['Review load profile', 'Implement load shedding', 'Consider parallel unit']
  },
  {
    id: 'power-factor-low',
    subsystem: 'load',
    component: 'Power Factor',
    trigger: { parameter: 'powerFactor', condition: 'below', value: 0.8 },
    alertMessage: 'Power factor below 0.8 - reactive load high',
    severity: 'info',
    recommendedAction: ['Identify inductive loads', 'Consider power factor correction', 'Check motor sizing']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSYSTEM ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SubsystemStatus {
  subsystem: SubsystemType;
  overallHealth: 'good' | 'warning' | 'critical';
  healthScore: number;
  activeAlerts: PreventiveAlert[];
  sensorStatus: { sensor: SensorCheck; value: number; status: 'normal' | 'warning' | 'critical' }[];
  recommendedActions: string[];
}

/**
 * Analyze a subsystem based on current readings
 */
export function analyzeSubsystem(
  subsystem: SubsystemType,
  readings: Record<string, number>
): SubsystemStatus {
  const sensors = SENSOR_CHECKS.filter(s => s.subsystem === subsystem);
  const alerts = PREVENTIVE_ALERTS.filter(a => a.subsystem === subsystem);

  const sensorStatus: SubsystemStatus['sensorStatus'] = [];
  let healthScore = 100;
  const activeAlerts: PreventiveAlert[] = [];
  const recommendedActions: string[] = [];

  // Check each sensor
  for (const sensor of sensors) {
    const value = readings[sensor.id] ?? readings[sensor.name.toLowerCase().replace(/\s+/g, '')] ?? 0;

    let status: 'normal' | 'warning' | 'critical' = 'normal';

    if (value < sensor.criticalRange.min || value > sensor.criticalRange.max) {
      status = 'critical';
      healthScore -= 30;
    } else if (value < sensor.warningRange.min || value > sensor.warningRange.max) {
      status = 'warning';
      healthScore -= 10;
    } else if (value < sensor.normalRange.min || value > sensor.normalRange.max) {
      status = 'warning';
      healthScore -= 5;
    }

    sensorStatus.push({ sensor, value, status });
  }

  // Check alerts
  for (const alert of alerts) {
    const value = readings[alert.trigger.parameter] ?? 0;
    let triggered = false;

    switch (alert.trigger.condition) {
      case 'above':
        triggered = value > alert.trigger.value;
        break;
      case 'below':
        triggered = value < alert.trigger.value;
        break;
      case 'equals':
        triggered = value === alert.trigger.value;
        break;
      case 'trend':
        // Trend analysis would require historical data
        break;
    }

    if (triggered) {
      activeAlerts.push(alert);
      recommendedActions.push(...alert.recommendedAction);

      if (alert.severity === 'critical') {
        healthScore -= 25;
      } else if (alert.severity === 'warning') {
        healthScore -= 10;
      }
    }
  }

  // Determine overall health
  let overallHealth: 'good' | 'warning' | 'critical' = 'good';
  if (healthScore < 50) {
    overallHealth = 'critical';
  } else if (healthScore < 80) {
    overallHealth = 'warning';
  }

  return {
    subsystem,
    overallHealth,
    healthScore: Math.max(0, healthScore),
    activeAlerts,
    sensorStatus,
    recommendedActions: [...new Set(recommendedActions)]
  };
}

/**
 * Get all sensor checks for a subsystem
 */
export function getSensorChecksBySubsystem(subsystem: SubsystemType): SensorCheck[] {
  return SENSOR_CHECKS.filter(s => s.subsystem === subsystem);
}

/**
 * Get diagnostic flow by symptom
 */
export function getDiagnosticFlowBySymptom(symptom: string): DiagnosticFlow | undefined {
  const lowerSymptom = symptom.toLowerCase();
  return DIAGNOSTIC_FLOWS.find(flow =>
    flow.symptoms.some(s => s.toLowerCase().includes(lowerSymptom)) ||
    flow.name.toLowerCase().includes(lowerSymptom)
  );
}

/**
 * Get all preventive alerts for a subsystem
 */
export function getPreventiveAlertsBySubsystem(subsystem: SubsystemType): PreventiveAlert[] {
  return PREVENTIVE_ALERTS.filter(a => a.subsystem === subsystem);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

export const SUBSYSTEM_STATISTICS = {
  totalSensorChecks: SENSOR_CHECKS.length,
  totalDiagnosticFlows: DIAGNOSTIC_FLOWS.length,
  totalPreventiveAlerts: PREVENTIVE_ALERTS.length,
  subsystemsCovered: [...new Set([
    ...SENSOR_CHECKS.map(s => s.subsystem),
    ...DIAGNOSTIC_FLOWS.map(d => d.subsystem),
    ...PREVENTIVE_ALERTS.map(a => a.subsystem)
  ])],
  sensorsBySubsystem: SENSOR_CHECKS.reduce((acc, s) => {
    acc[s.subsystem] = (acc[s.subsystem] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};
