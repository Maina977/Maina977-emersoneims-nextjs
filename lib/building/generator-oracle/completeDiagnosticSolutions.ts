'use client';

/**
 * Complete Diagnostic Solutions Library - INDEPENDENT REFERENCE
 *
 * COPYRIGHT-SAFE APPROACH:
 * ========================
 * - Fault code NUMBERS are used freely (industry-standard identifiers)
 * - All DESCRIPTIONS are INDEPENDENTLY WRITTEN - NOT copied from OEM manuals
 * - Diagnostic procedures are original content based on general industry principles
 * - Repair guidance is independently developed from field technician experience
 *
 * IMPORTANT DISCLAIMER:
 * =====================
 * Generator Oracle is an INDEPENDENT diagnostic reference tool. All fault code
 * interpretations, diagnostic procedures, and repair guidance are INDEPENDENTLY
 * DEVELOPED based on general diesel generator diagnostic principles and field experience.
 *
 * Content is NOT copied from any manufacturer's official documentation. All descriptions
 * are original interpretations that may differ from official manufacturer guidance.
 *
 * Brand names and model references (including controller brands like DSE, ComAp,
 * Woodward, SmartGen, and ECM brands like Caterpillar, Cummins, Volvo Penta) are
 * used for IDENTIFICATION PURPOSES ONLY.
 *
 * Generator Oracle is NOT affiliated with, endorsed by, or licensed by any equipment
 * manufacturer including but not limited to engine, controller, or ECM manufacturers.
 *
 * For warranty service or official documentation, consult manufacturer-authorized
 * service centers. USE OF THIS TOOL IS AT YOUR OWN RISK.
 */

// ==================== TYPES ====================

export interface DiagnosticInput {
  faultCode?: string;
  voltage?: number;
  rpm?: number;
  load?: number;
  fuelPressure?: number;
  coolantTemp?: number;
  oilPressure?: number;
  frequency?: number;
  symptoms?: string[];
  controllerBrand?: string;
  ecmType?: string;
  engineBrand?: string;
}

export interface CompleteSolution {
  id: string;
  title: string;
  category: 'ecm' | 'controller' | 'fuel' | 'electrical' | 'cooling' | 'mechanical' | 'load' | 'communication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  toolsRequired: string[];
  partsRequired: string[];
  safetyWarnings: string[];
  likelyCauses: Array<{
    cause: string;
    probability: number;
    explanation: string;
  }>;
  diagnosticSteps: Array<{
    step: number;
    action: string;
    details: string;
    expectedResult: string;
    measurements?: {
      parameter: string;
      normalRange: string;
      unit: string;
      howToMeasure: string;
    };
    ifPassed: string;
    ifFailed: string;
    images?: string[];
  }>;
  repairProcedure: Array<{
    step: number;
    action: string;
    details: string;
    tips: string[];
    warnings?: string[];
  }>;
  verificationSteps: string[];
  preventiveAdvice: string[];
  relatedFaultCodes: string[];
}

export interface ECMReprogrammingGuide {
  ecmModel: string;
  manufacturer: string;
  compatibleControllers: string[];
  firmwareVersions: Array<{
    version: string;
    releaseDate: string;
    features: string[];
    bugFixes: string[];
    compatibility: string[];
  }>;
  reprogrammingProcedure: Array<{
    step: number;
    action: string;
    details: string;
    criticalNotes: string[];
  }>;
  parameterSettings: Array<{
    parameter: string;
    description: string;
    defaultValue: string;
    adjustmentRange: string;
    adjustmentProcedure: string;
  }>;
  communicationSetup: {
    protocol: string;
    baudRate: number;
    canAddresses: { tx: string; rx: string };
    terminationRequired: boolean;
    wiringDiagram: string;
  };
}

// ==================== COMPLETE DIAGNOSTIC SOLUTIONS ====================

export const COMPLETE_SOLUTIONS: Record<string, CompleteSolution> = {
  // ==================== ECM COMMUNICATION FAILURES ====================
  'ECM_NO_COMMUNICATION': {
    id: 'ECM_NO_COMMUNICATION',
    title: 'ECM Not Communicating with Controller',
    category: 'communication',
    severity: 'critical',
    estimatedTime: '1-3 hours',
    toolsRequired: [
      'Digital Multimeter (DMM)',
      'CAN bus analyzer or oscilloscope',
      '120Ω termination resistor',
      'Wire strippers and crimping tool',
      'Torque wrench (for connector bolts)'
    ],
    partsRequired: [
      'CAN bus termination resistor (120Ω 1/4W)',
      'Replacement CAN High/Low wires if damaged',
      'ECM connector pins (if corroded)',
      'Dielectric grease'
    ],
    safetyWarnings: [
      'Disconnect battery before working on wiring',
      'Allow ECM to cool before touching (can reach 80°C)',
      'Do not connect/disconnect ECM while powered'
    ],
    likelyCauses: [
      {
        cause: 'CAN bus termination missing or incorrect',
        probability: 35,
        explanation: 'J1939 CAN bus requires exactly TWO 120Ω termination resistors - one at each end of the bus. Missing or incorrect termination causes signal reflection and communication failure.'
      },
      {
        cause: 'CAN High/Low wires swapped or broken',
        probability: 25,
        explanation: 'CAN_H (Yellow) and CAN_L (Green) must not be swapped. A break in either wire stops all communication.'
      },
      {
        cause: 'ECM firmware incompatible with controller',
        probability: 20,
        explanation: 'ECM firmware version must match controller communication protocol. Older ECMs may not support newer controller message formats.'
      },
      {
        cause: 'ECM J1939 address conflict',
        probability: 10,
        explanation: 'Each device on J1939 bus must have unique address. Default ECM address is typically 0x00. Conflicts cause bus arbitration failures.'
      },
      {
        cause: 'ECM internal failure',
        probability: 10,
        explanation: 'ECM CAN transceiver chip failure. Requires ECM replacement if other causes ruled out.'
      }
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure CAN bus termination resistance',
        details: 'With ignition OFF and all ECUs disconnected, measure resistance between CAN_H and CAN_L at the controller connector.',
        expectedResult: '60Ω (two 120Ω resistors in parallel)',
        measurements: {
          parameter: 'CAN Bus Termination',
          normalRange: '55-65',
          unit: 'Ohms',
          howToMeasure: 'Set DMM to Ohms. Connect red probe to CAN_H (pin varies by connector, typically yellow wire), black probe to CAN_L (typically green wire). Read resistance.'
        },
        ifPassed: 'Termination correct. Proceed to Step 2.',
        ifFailed: 'If reading >120Ω: One termination resistor missing. If reading 120Ω: Both resistors on same end or one missing. If reading <50Ω: Short circuit in bus wiring.'
      },
      {
        step: 2,
        action: 'Check CAN bus voltage levels',
        details: 'With ignition ON and engine OFF, measure CAN_H and CAN_L voltages relative to ground.',
        expectedResult: 'CAN_H: 2.5-3.5V, CAN_L: 1.5-2.5V (idle state)',
        measurements: {
          parameter: 'CAN Idle Voltage',
          normalRange: 'CAN_H: 2.5-3.5V, CAN_L: 1.5-2.5V',
          unit: 'Volts DC',
          howToMeasure: 'Set DMM to DC Volts. Measure CAN_H to ground and CAN_L to ground separately. Both should show approximately 2.5V at idle (recessive state).'
        },
        ifPassed: 'CAN transceiver functioning. Proceed to Step 3.',
        ifFailed: 'If both 0V: No power to ECM or CAN transceiver dead. If CAN_H stuck at 5V or CAN_L stuck at 0V: Transceiver shorted, replace ECM.'
      },
      {
        step: 3,
        action: 'Verify ECM power supply',
        details: 'Check ECM has correct power and ground. ECM typically requires battery voltage (12V or 24V system) and clean ground.',
        expectedResult: 'Power: System voltage ±10%, Ground: <0.5V drop',
        measurements: {
          parameter: 'ECM Power Supply',
          normalRange: '12V system: 11-14V, 24V system: 22-28V',
          unit: 'Volts DC',
          howToMeasure: 'Measure between ECM power input pin and ECM ground pin. Should read battery voltage. Then measure ECM ground pin to battery negative - should be <0.5V.'
        },
        ifPassed: 'Power supply OK. Proceed to Step 4.',
        ifFailed: 'Check fuses, relays, and wiring. Repair power supply before continuing.'
      },
      {
        step: 4,
        action: 'Check for CAN bus traffic',
        details: 'Using oscilloscope or CAN analyzer, verify ECM is transmitting messages on the bus.',
        expectedResult: 'See J1939 messages with source address matching ECM',
        measurements: {
          parameter: 'CAN Bus Activity',
          normalRange: 'Messages every 10-100ms',
          unit: 'Waveform',
          howToMeasure: 'Connect oscilloscope to CAN_H. Set timebase to 100μs/div. You should see square wave pulses between 2V and 4V when ECM is transmitting.'
        },
        ifPassed: 'ECM transmitting. Problem is controller reception or configuration. Proceed to Step 5.',
        ifFailed: 'ECM not transmitting. Check ECM firmware, J1939 address settings, or ECM internal failure.'
      },
      {
        step: 5,
        action: 'Verify J1939 address configuration',
        details: 'Check ECM J1939 source address matches what controller expects. Standard engine ECM address is 0x00.',
        expectedResult: 'ECM address configured and not conflicting',
        measurements: {
          parameter: 'J1939 Source Address',
          normalRange: '0x00 for primary ECM',
          unit: 'Hex address',
          howToMeasure: 'Access ECM configuration via service port (RS232 or USB). Navigate to J1939 settings and verify source address.'
        },
        ifPassed: 'Address correct. Check controller CAN settings.',
        ifFailed: 'Reconfigure ECM address. See ECM Reprogramming Procedure.'
      }
    ],
    repairProcedure: [
      {
        step: 1,
        action: 'Install correct CAN bus termination',
        details: 'Install 120Ω termination resistors at each physical end of the CAN bus. For typical generator: one at controller, one at furthest ECM.',
        tips: [
          'Use 120Ω ±1% metal film resistors for accuracy',
          'Some controllers have built-in termination - check manual',
          'Resistor should be between CAN_H and CAN_L',
          'Can use DT04-2P connector with resistor for clean installation'
        ],
        warnings: ['Never install more than 2 termination resistors on a single CAN bus segment']
      },
      {
        step: 2,
        action: 'Repair CAN wiring if damaged',
        details: 'CAN_H and CAN_L must be twisted pair for noise immunity. Use proper automotive CAN cable.',
        tips: [
          'CAN cable should have ~40 twists per meter',
          'Keep CAN wiring away from high-current wires (starter, alternator)',
          'Use shielded cable if electrical noise is present',
          'Maximum bus length for 250kbps is 100m'
        ]
      },
      {
        step: 3,
        action: 'Configure ECM J1939 settings',
        details: 'Access ECM configuration and set correct J1939 parameters.',
        tips: [
          'Source Address: 0x00 for primary engine ECM',
          'Baud Rate: 250kbps for J1939 (standard)',
          'Enable transmission of: EEC1 (RPM/Load), ET1 (Temps), LFE (Fuel), etc.',
          'Set correct engine parameters (cylinders, displacement)'
        ]
      },
      {
        step: 4,
        action: 'Configure controller CAN reception',
        details: 'Set controller to receive J1939 messages from ECM address.',
        tips: [
          'Enter controller configuration mode (varies by brand)',
          'Set CAN source address to match ECM (typically 0x00)',
          'Enable J1939 protocol',
          'Configure message timeout (typically 500ms)'
        ]
      }
    ],
    verificationSteps: [
      'Turn ignition ON, verify controller shows engine data (RPM, coolant temp, oil pressure)',
      'Start engine, verify RPM reading matches tachometer',
      'Apply load, verify load percentage reading updates',
      'Check controller for any communication fault codes',
      'Monitor for 10 minutes to ensure stable communication'
    ],
    preventiveAdvice: [
      'Document CAN bus configuration for future reference',
      'Label CAN wires clearly (H/L)',
      'Check CAN termination during every major service',
      'Keep firmware compatibility matrix updated',
      'Install surge protection on CAN bus in lightning-prone areas'
    ],
    relatedFaultCodes: ['421039', 'J1939-21', 'CAN_COMM_LOST', 'ECU_NO_RESPONSE', 'SPN-639']
  },

  // ==================== NO FUEL INJECTION ====================
  'NO_FUEL_INJECTION': {
    id: 'NO_FUEL_INJECTION',
    title: 'Engine Cranks But No Fuel Injection',
    category: 'fuel',
    severity: 'critical',
    estimatedTime: '2-4 hours',
    toolsRequired: [
      'Digital Multimeter (DMM)',
      'Noid light set (injector pulse tester)',
      'Fuel pressure gauge (0-100 PSI)',
      'Injector resistance tester',
      'Breakout box for ECM connector',
      'Oscilloscope (optional for waveform analysis)'
    ],
    partsRequired: [
      'Injector seals/O-rings',
      'Injector connector seals',
      'Fuel filter (if clogged)',
      'Replacement injector(s) if faulty'
    ],
    safetyWarnings: [
      'Diesel fuel is flammable - no open flames',
      'Relieve fuel system pressure before disconnecting lines',
      'Wear safety glasses - fuel injection pressure can exceed 2000 PSI',
      'Do not crank engine with injector lines disconnected'
    ],
    likelyCauses: [
      {
        cause: 'ECM not receiving crank signal',
        probability: 30,
        explanation: 'ECM needs crankshaft position signal to time injection. Without it, ECM will not command injector pulses.'
      },
      {
        cause: 'ECM injector driver failure',
        probability: 20,
        explanation: 'ECM internal transistors that switch injector coils can fail from overcurrent or heat damage.'
      },
      {
        cause: 'Injector wiring open/shorted',
        probability: 20,
        explanation: 'Break in injector power or signal wires prevents injector activation.'
      },
      {
        cause: 'Injector coil failure',
        probability: 15,
        explanation: 'Injector solenoid coil open or shorted. Common after overheating or age.'
      },
      {
        cause: 'Fuel system air lock',
        probability: 10,
        explanation: 'Air in fuel lines prevents fuel delivery despite pump running.'
      },
      {
        cause: 'ECM in limp mode',
        probability: 5,
        explanation: 'ECM has detected critical fault and disabled injection for protection.'
      }
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Verify ECM is receiving crank/cam signals',
        details: 'Check for crankshaft and camshaft position sensor signals at ECM connector while cranking.',
        expectedResult: 'Pulsing voltage (0.5-5V AC) during cranking',
        measurements: {
          parameter: 'Crank Position Sensor',
          normalRange: '0.5-5V AC while cranking',
          unit: 'Volts AC',
          howToMeasure: 'Set DMM to AC Volts. Backprobe ECM crank sensor input pins. Crank engine and observe voltage. Should see pulsing signal.'
        },
        ifPassed: 'ECM receiving position signal. Proceed to Step 2.',
        ifFailed: 'Check crank sensor, cam sensor, and wiring. See CRANK_SENSOR_FAILURE procedure.'
      },
      {
        step: 2,
        action: 'Check for injector pulse signal from ECM',
        details: 'Connect noid light to injector connector. Crank engine and observe light.',
        expectedResult: 'Noid light blinks during cranking',
        measurements: {
          parameter: 'Injector Pulse',
          normalRange: 'Blinks every engine revolution',
          unit: 'Visual',
          howToMeasure: 'Disconnect injector connector. Insert noid light pins. Crank engine. Light should blink indicating ECM is commanding injection.'
        },
        ifPassed: 'ECM commanding injection. Problem is injector or fuel supply. Proceed to Step 4.',
        ifFailed: 'ECM not commanding injection. Proceed to Step 3.'
      },
      {
        step: 3,
        action: 'Check ECM injector driver output',
        details: 'Using breakout box, measure voltage on injector output pins while cranking.',
        expectedResult: 'Battery voltage when OFF, pulsing to ground when ON',
        measurements: {
          parameter: 'ECM Injector Driver',
          normalRange: 'Pulses from battery voltage to 0V',
          unit: 'Volts DC',
          howToMeasure: 'Connect breakout box to ECM harness. Measure injector output pin to ground. Should see battery voltage dropping to 0V during injection pulse.'
        },
        ifPassed: 'ECM driver working. Problem is wiring to injector.',
        ifFailed: 'ECM injector driver failed OR ECM in protection mode. Check for fault codes.'
      },
      {
        step: 4,
        action: 'Measure injector coil resistance',
        details: 'Disconnect each injector and measure coil resistance.',
        expectedResult: 'Depends on injector type (see table below)',
        measurements: {
          parameter: 'Injector Coil Resistance',
          normalRange: 'Low-Z: 2-4Ω, High-Z: 12-16Ω',
          unit: 'Ohms',
          howToMeasure: 'Disconnect injector connector. Set DMM to Ohms. Measure across injector terminals. Compare to specification.'
        },
        ifPassed: 'Injector coils OK. Check fuel supply.',
        ifFailed: 'If open (infinite): Coil burned. If shorted (<1Ω): Coil shorted. Replace injector.'
      },
      {
        step: 5,
        action: 'Check fuel supply pressure',
        details: 'Install fuel pressure gauge at fuel rail test port. Crank engine.',
        expectedResult: 'Pressure builds to specification during cranking',
        measurements: {
          parameter: 'Fuel Rail Pressure',
          normalRange: 'Mechanical: 45-60 PSI, Common Rail: 5000-30000 PSI',
          unit: 'PSI',
          howToMeasure: 'Connect fuel pressure gauge to test port on fuel rail. Crank engine for 5 seconds. Note pressure buildup.'
        },
        ifPassed: 'Fuel supply OK. Problem is injector mechanical failure.',
        ifFailed: 'Check lift pump, high-pressure pump, fuel filter, and bleed air from system.'
      },
      {
        step: 6,
        action: 'Bleed fuel system',
        details: 'Remove air from fuel system by bleeding at each injector.',
        expectedResult: 'Solid fuel (no bubbles) at each bleed point',
        measurements: {
          parameter: 'Fuel Bleed',
          normalRange: 'Clear fuel, no air bubbles',
          unit: 'Visual',
          howToMeasure: 'Loosen injector line fitting. Crank engine until fuel flows without bubbles. Tighten fitting. Repeat for each cylinder.'
        },
        ifPassed: 'Fuel system bled. Attempt start.',
        ifFailed: 'Continuous air indicates fuel line leak or lift pump failure.'
      }
    ],
    repairProcedure: [
      {
        step: 1,
        action: 'Replace faulty crank/cam sensors',
        details: 'If sensors failed diagnostic, replace with OEM-spec sensors.',
        tips: [
          'Match sensor gap to specification (typically 0.5-1.5mm)',
          'Use thread sealant if sensor goes into oil galley',
          'Torque to spec - overtightening can crack sensor',
          'Clear fault codes after replacement'
        ]
      },
      {
        step: 2,
        action: 'Repair injector wiring',
        details: 'If wiring damaged, repair using proper automotive techniques.',
        tips: [
          'Use heat-shrink solder connectors for reliable repair',
          'Maintain proper wire gauge (typically 16-18 AWG)',
          'Route wires away from exhaust heat',
          'Use split loom for protection'
        ]
      },
      {
        step: 3,
        action: 'Replace faulty injectors',
        details: 'Remove and replace injectors that failed resistance or flow test.',
        tips: [
          'Always replace injector seals/O-rings',
          'Clean injector bore before installing new injector',
          'Torque injector hold-down bolts to spec',
          'Prime fuel system before starting',
          'For common-rail: Follow high-pressure line torque sequence'
        ],
        warnings: [
          'Common-rail lines must be replaced if loosened more than 5 times',
          'Never reuse high-pressure seals'
        ]
      },
      {
        step: 4,
        action: 'Bleed fuel system completely',
        details: 'Remove all air from low and high pressure fuel systems.',
        tips: [
          'Start at filter, then lift pump, then injection pump, then rails, then injectors',
          'Use hand primer pump if equipped',
          'Electric lift pump may need cycling (key on/off)',
          'Crank in short bursts (10 sec on, 30 sec off) to avoid starter damage'
        ]
      }
    ],
    verificationSteps: [
      'Crank engine - should start within 5-10 seconds',
      'Idle smoothly with no misfires',
      'No visible smoke (white = coolant, black = rich, blue = oil)',
      'Check for fuel leaks at all connections',
      'Verify no fault codes present',
      'Load test to 75% and verify stable operation'
    ],
    preventiveAdvice: [
      'Change fuel filters at recommended intervals',
      'Use quality fuel from reputable suppliers',
      'Install water separator and drain regularly',
      'Keep fuel tank above 1/4 to prevent condensation',
      'Replace injectors at manufacturer recommended hours',
      'Test injector balance annually on high-hour units'
    ],
    relatedFaultCodes: ['SPN-651', 'SPN-652', 'P0201-P0208', 'INJ_CIRCUIT_OPEN', 'CRANK_NO_SIGNAL']
  },

  // ==================== GENERATOR NOT TAKING FULL LOAD ====================
  'NOT_TAKING_FULL_LOAD': {
    id: 'NOT_TAKING_FULL_LOAD',
    title: 'Generator Not Taking Full Load / Derating',
    category: 'load',
    severity: 'high',
    estimatedTime: '2-4 hours',
    toolsRequired: [
      'Digital Multimeter (DMM)',
      'Clamp-on ammeter (AC/DC)',
      'Fuel pressure gauge',
      'Intake manifold vacuum/boost gauge',
      'Pyrometer (exhaust temp)',
      'Smoke machine or boost leak tester'
    ],
    partsRequired: [
      'Air filter',
      'Fuel filter',
      'Turbo boost hoses (if leaking)',
      'Injector nozzles (if worn)',
      'Wastegate actuator (if faulty)'
    ],
    safetyWarnings: [
      'Exhaust temperatures can exceed 600°C - use caution',
      'Turbo housing extremely hot after running',
      'Do not overload generator - can cause damage',
      'Ensure proper ventilation when load testing'
    ],
    likelyCauses: [
      {
        cause: 'Restricted air intake / clogged air filter',
        probability: 25,
        explanation: 'Diesel engines need approximately 100 CFM of air per 100 HP. Restricted airflow directly limits power output.'
      },
      {
        cause: 'Fuel delivery insufficient',
        probability: 25,
        explanation: 'Clogged fuel filter, weak lift pump, or restricted fuel lines prevent adequate fuel delivery at high loads.'
      },
      {
        cause: 'Turbocharger underperforming',
        probability: 20,
        explanation: 'Worn turbo bearings, damaged compressor wheel, or wastegate issues reduce boost and limit power.'
      },
      {
        cause: 'Injector nozzles worn/clogged',
        probability: 15,
        explanation: 'Worn nozzles have poor spray pattern and reduced flow capacity, limiting fuel delivery.'
      },
      {
        cause: 'Engine timing incorrect',
        probability: 10,
        explanation: 'Retarded injection timing reduces power and increases fuel consumption.'
      },
      {
        cause: 'High exhaust backpressure',
        probability: 5,
        explanation: 'Clogged DPF, collapsed exhaust pipe, or restricted muffler limits exhaust flow.'
      }
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check air filter restriction',
        details: 'Inspect air filter visually and measure intake restriction.',
        expectedResult: 'Clean filter, restriction <25" H2O',
        measurements: {
          parameter: 'Intake Restriction',
          normalRange: '<15" H2O clean, <25" H2O service limit',
          unit: 'Inches H2O',
          howToMeasure: 'Connect vacuum gauge to intake manifold (downstream of filter). Run engine at rated speed/load. Read restriction.'
        },
        ifPassed: 'Air intake OK. Proceed to Step 2.',
        ifFailed: 'Replace air filter. Check for collapsed intake hoses or blocked intake screen.'
      },
      {
        step: 2,
        action: 'Measure turbo boost pressure',
        details: 'Connect boost gauge to intake manifold and measure boost at rated load.',
        expectedResult: 'Boost pressure per manufacturer spec (typically 15-30 PSI)',
        measurements: {
          parameter: 'Turbo Boost Pressure',
          normalRange: '15-30 PSI at rated load (varies by engine)',
          unit: 'PSI',
          howToMeasure: 'Install boost gauge on intake manifold. Run engine at rated load. Note maximum boost pressure.'
        },
        ifPassed: 'Turbo producing adequate boost. Proceed to Step 3.',
        ifFailed: 'If low boost: Check for boost leaks, turbo bearing wear, or wastegate issues. Proceed to Step 2A.'
      },
      {
        step: 3,
        action: 'Check boost system for leaks',
        details: 'Pressurize intake system and listen/feel for leaks.',
        expectedResult: 'No audible leaks, holds pressure',
        measurements: {
          parameter: 'Boost System Integrity',
          normalRange: 'Holds 15 PSI for 30 seconds',
          unit: 'PSI',
          howToMeasure: 'Seal intake and exhaust. Pressurize intake to 15 PSI using shop air and regulator. Listen for leaks at intercooler, hoses, and manifold.'
        },
        ifPassed: 'No boost leaks. Proceed to Step 4.',
        ifFailed: 'Locate and repair boost leaks. Common locations: intercooler hose clamps, intake manifold gaskets, turbo outlet connection.'
      },
      {
        step: 4,
        action: 'Check fuel supply pressure',
        details: 'Measure fuel pressure at the injection pump inlet under full load.',
        expectedResult: 'Transfer pump pressure maintained at rated load',
        measurements: {
          parameter: 'Fuel Transfer Pressure',
          normalRange: '4-8 PSI at pump inlet',
          unit: 'PSI',
          howToMeasure: 'Install fuel pressure gauge at injection pump inlet. Run engine at rated load. Pressure should not drop below 4 PSI.'
        },
        ifPassed: 'Fuel supply adequate. Proceed to Step 5.',
        ifFailed: 'Replace fuel filter. Check lift pump, fuel lines for restriction, and tank vent.'
      },
      {
        step: 5,
        action: 'Check injection pump timing',
        details: 'Verify injection timing is set correctly per engine specification.',
        expectedResult: 'Static timing per spec (typically 8-12° BTDC)',
        measurements: {
          parameter: 'Injection Timing',
          normalRange: '8-12° BTDC (varies by engine)',
          unit: 'Degrees',
          howToMeasure: 'For mechanical pump: Bar engine to TDC. Remove timing inspection cover. Check pump timing marks align. For electronic: Check ECM timing parameter.'
        },
        ifPassed: 'Timing correct. Proceed to Step 6.',
        ifFailed: 'Adjust injection pump timing per manufacturer procedure.'
      },
      {
        step: 6,
        action: 'Test injector nozzles',
        details: 'Remove injectors and test spray pattern, opening pressure, and return flow.',
        expectedResult: 'Even spray pattern, correct opening pressure, minimal return flow',
        measurements: {
          parameter: 'Injector Pop Pressure',
          normalRange: '2500-4000 PSI (varies by injector)',
          unit: 'PSI',
          howToMeasure: 'Mount injector on pop tester. Pump slowly and note pressure at which injector opens. Compare to specification.'
        },
        ifPassed: 'Injectors within spec. Check for other causes.',
        ifFailed: 'Replace or rebuild injectors that fail spray pattern or pressure test.'
      },
      {
        step: 7,
        action: 'Check exhaust backpressure',
        details: 'Measure exhaust pressure upstream of any after-treatment devices.',
        expectedResult: '<3" Hg at rated load',
        measurements: {
          parameter: 'Exhaust Backpressure',
          normalRange: '<3" Hg (75mm Hg)',
          unit: 'Inches Hg',
          howToMeasure: 'Install pressure gauge at turbo outlet flange or exhaust manifold test port. Run engine at rated load. Note backpressure.'
        },
        ifPassed: 'Exhaust unrestricted.',
        ifFailed: 'Check for collapsed exhaust pipe, clogged muffler, or DPF requiring regeneration.'
      }
    ],
    repairProcedure: [
      {
        step: 1,
        action: 'Replace air filter and clean housing',
        details: 'Install new air filter. Clean air filter housing of debris.',
        tips: [
          'Use OEM or equivalent quality filter',
          'Check filter housing seal for damage',
          'Inspect ducting for holes or loose connections',
          'Reset air filter restriction indicator if equipped'
        ]
      },
      {
        step: 2,
        action: 'Repair boost leaks',
        details: 'Replace damaged hoses, clamps, and gaskets in boost system.',
        tips: [
          'Use silicone hoses rated for boost pressure and temperature',
          'Use T-bolt clamps instead of worm-gear clamps for reliability',
          'Apply high-temp sealant to intake manifold gaskets',
          'Check intercooler for internal leaks by pressurizing'
        ]
      },
      {
        step: 3,
        action: 'Replace fuel filter and bleed system',
        details: 'Install new fuel filter(s). Bleed air from fuel system.',
        tips: [
          'Use OEM or quality aftermarket filters',
          'Replace primary (water separator) and secondary filters',
          'Prime system with hand pump before cranking',
          'Check for air leaks on suction side of fuel system'
        ]
      },
      {
        step: 4,
        action: 'Overhaul or replace injector nozzles',
        details: 'Remove, clean, test, and recondition or replace injector nozzles.',
        tips: [
          'Replace all nozzles as a set for balanced power',
          'Always replace nozzle sealing washers',
          'Clean nozzle seats in cylinder head before installation',
          'Torque injectors to specification'
        ],
        warnings: ['Do not handle nozzle tips with bare fingers - oils cause carbon buildup']
      },
      {
        step: 5,
        action: 'Adjust injection pump timing',
        details: 'Set injection timing to manufacturer specification.',
        tips: [
          'Use timing pin or lock for accurate setting',
          'Check for gear backlash after adjustment',
          'Verify timing marks align on front gear train',
          'Re-check timing after running engine'
        ]
      },
      {
        step: 6,
        action: 'Service turbocharger',
        details: 'Clean compressor wheel, check bearings, verify wastegate operation.',
        tips: [
          'Check compressor wheel for damage and buildup',
          'Verify shaft axial and radial play within spec',
          'Test wastegate actuator with pressure gauge',
          'Clean oil drain line to prevent coking'
        ]
      }
    ],
    verificationSteps: [
      'Start engine and warm to operating temperature',
      'Apply load in 25% increments up to 100% rated load',
      'Verify engine maintains rated speed (1500/1800 RPM) at full load',
      'Check that exhaust smoke is light gray, not black',
      'Verify boost pressure reaches specification',
      'Monitor exhaust temperature - should not exceed manufacturer limit',
      'Run at rated load for 2 hours to confirm stable operation'
    ],
    preventiveAdvice: [
      'Replace air filter every 500 hours or annually',
      'Replace fuel filters every 250-500 hours',
      'Check turbo boost pressure during every service',
      'Test injector nozzles every 4000-8000 hours',
      'Monitor fuel consumption - increase indicates problems',
      'Load test generator annually at full rated load',
      'Keep cooling system in good condition - high temps derate engine'
    ],
    relatedFaultCodes: ['DERATE_ACTIVE', 'LOW_POWER', 'SPN-102', 'SPN-132', 'BOOST_LOW', 'FUEL_PRESS_LOW']
  },

  // ==================== ECM FIRMWARE MISMATCH ====================
  'ECM_FIRMWARE_MISMATCH': {
    id: 'ECM_FIRMWARE_MISMATCH',
    title: 'ECM Firmware Incompatible with Controller',
    category: 'ecm',
    severity: 'high',
    estimatedTime: '1-2 hours',
    toolsRequired: [
      'Laptop with ECM service software',
      'ECM communication adapter (USB/Serial)',
      'Controller programming cable',
      'Firmware files (obtained from manufacturer)'
    ],
    partsRequired: [
      'Updated ECM firmware file',
      'Controller software license (if required)'
    ],
    safetyWarnings: [
      'Do not interrupt power during ECM reprogramming',
      'Connect battery charger during programming to prevent low voltage',
      'Back up existing ECM configuration before changes',
      'Verify firmware file matches ECM hardware version'
    ],
    likelyCauses: [
      {
        cause: 'ECM replaced with different firmware version',
        probability: 40,
        explanation: 'Replacement ECM may have older or newer firmware than original, causing protocol mismatch with controller.'
      },
      {
        cause: 'Controller updated without ECM update',
        probability: 30,
        explanation: 'Controller software update changed J1939 message requirements not supported by current ECM firmware.'
      },
      {
        cause: 'ECM from different engine model installed',
        probability: 20,
        explanation: 'ECM intended for different engine variant may have different communication parameters.'
      },
      {
        cause: 'J1939 protocol version mismatch',
        probability: 10,
        explanation: 'Older ECMs may use J1939-71 messaging while newer controllers expect J1939-73.'
      }
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Read ECM firmware version',
        details: 'Connect to ECM and read current firmware version and calibration file.',
        expectedResult: 'Firmware version and calibration ID displayed',
        measurements: {
          parameter: 'ECM Firmware Version',
          normalRange: 'As specified for engine model',
          unit: 'Version string',
          howToMeasure: 'Connect laptop to ECM service port. Open ECM service software. Navigate to ECM Information. Read firmware version.'
        },
        ifPassed: 'Record firmware version. Proceed to Step 2.',
        ifFailed: 'If cannot communicate: Check ECM power, ground, and communication adapter.'
      },
      {
        step: 2,
        action: 'Read controller expected ECM version',
        details: 'Check controller configuration for expected ECM protocol and parameters.',
        expectedResult: 'Controller settings for CAN/J1939 protocol',
        measurements: {
          parameter: 'Controller J1939 Settings',
          normalRange: 'Address: 0x00, Protocol: J1939, Baud: 250k',
          unit: 'Configuration',
          howToMeasure: 'Enter controller configuration mode. Navigate to CAN/J1939 settings. Note expected ECM address and protocol version.'
        },
        ifPassed: 'Record settings. Compare with ECM settings.',
        ifFailed: 'Refer to controller manual for J1939 configuration location.'
      },
      {
        step: 3,
        action: 'Compare ECM and controller compatibility',
        details: 'Cross-reference ECM firmware version with controller compatibility list.',
        expectedResult: 'ECM firmware version in controller compatibility list',
        measurements: {
          parameter: 'Compatibility',
          normalRange: 'ECM firmware listed as compatible',
          unit: 'Boolean',
          howToMeasure: 'Refer to controller manufacturer compatibility chart. Verify ECM manufacturer, model, and firmware version are listed as supported.'
        },
        ifPassed: 'Firmware compatible. Issue may be configuration. Check J1939 parameters.',
        ifFailed: 'Firmware mismatch confirmed. Update ECM or controller firmware to compatible versions.'
      },
      {
        step: 4,
        action: 'Check J1939 message parameters',
        details: 'Verify ECM is configured to transmit required J1939 messages.',
        expectedResult: 'ECM transmitting all controller-required PGNs',
        measurements: {
          parameter: 'J1939 PGN Configuration',
          normalRange: 'EEC1, EEC2, ET1, LFE, IC1 enabled',
          unit: 'PGN list',
          howToMeasure: 'In ECM service software, navigate to J1939 transmit configuration. Verify required PGNs are enabled with correct rates.'
        },
        ifPassed: 'Message configuration correct.',
        ifFailed: 'Enable missing PGNs in ECM configuration.'
      }
    ],
    repairProcedure: [
      {
        step: 1,
        action: 'Back up current ECM configuration',
        details: 'Save current ECM parameters and calibration before making changes.',
        tips: [
          'Save configuration to PC and USB drive',
          'Document current firmware version',
          'Export parameter file if software supports',
          'Record customer-specific settings'
        ],
        warnings: ['Never skip backup - you may need to restore if update fails']
      },
      {
        step: 2,
        action: 'Obtain correct firmware file',
        details: 'Download or obtain firmware file matching controller requirements.',
        tips: [
          'Contact engine manufacturer technical support',
          'Verify firmware matches ECM hardware part number',
          'Check for any technical service bulletins',
          'Ensure firmware file is not corrupted (verify checksum)'
        ]
      },
      {
        step: 3,
        action: 'Prepare for ECM reprogramming',
        details: 'Set up proper conditions for safe ECM flash programming.',
        tips: [
          'Connect battery charger - maintain 13.5-14.5V during programming',
          'Disable all loads (A/C, heaters, etc.)',
          'Ensure laptop has sufficient battery or is plugged in',
          'Close all other programs on laptop',
          'Disable laptop sleep/hibernate during programming'
        ],
        warnings: ['Power loss during programming will brick ECM - it will require bench reprogramming or replacement']
      },
      {
        step: 4,
        action: 'Flash new ECM firmware',
        details: 'Execute ECM firmware update using service software.',
        tips: [
          'Follow on-screen prompts exactly',
          'Do not disconnect cables or turn off power',
          'Programming typically takes 5-15 minutes',
          'Some ECMs may restart multiple times during process',
          'Wait for "Programming Complete" message'
        ]
      },
      {
        step: 5,
        action: 'Restore configuration and calibrate',
        details: 'Load saved parameters and perform any required calibrations.',
        tips: [
          'Restore customer-specific parameters from backup',
          'Verify engine displacement and cylinder count settings',
          'Run injector calibration if required by firmware notes',
          'Set correct fuel type and altitude compensation',
          'Configure J1939 source address and PGN enables'
        ]
      },
      {
        step: 6,
        action: 'Configure controller for updated ECM',
        details: 'Update controller settings if required for new ECM firmware.',
        tips: [
          'Match CAN source address to ECM address',
          'Set correct engine parameters in controller',
          'Enable/disable controller features as needed',
          'Save controller configuration'
        ]
      }
    ],
    verificationSteps: [
      'Turn key to run position - verify no ECM fault codes',
      'Verify controller displays engine data (RPM, temp, pressure)',
      'Start engine - verify smooth cranking and starting',
      'Run engine to operating temperature',
      'Verify all controller readings match actual values',
      'Load test engine - verify stable operation',
      'Check for any fault codes after load test',
      'Document new firmware versions for maintenance records'
    ],
    preventiveAdvice: [
      'Maintain firmware compatibility matrix for fleet',
      'Update ECM and controller together when possible',
      'Test new firmware on non-critical unit first',
      'Keep backup of all ECM configuration files',
      'Document all firmware changes in service records',
      'Subscribe to manufacturer technical bulletins'
    ],
    relatedFaultCodes: ['J1939_MISMATCH', 'ECU_PROTOCOL_ERROR', 'CAN_VERSION_ERR', 'SPN-639-FMI-9']
  },

  // ==================== COOLANT OVERTEMPERATURE ====================
  'COOLANT_OVERTEMPERATURE': {
    id: 'COOLANT_OVERTEMPERATURE',
    title: 'Engine Overheating / High Coolant Temperature',
    category: 'cooling',
    severity: 'critical',
    estimatedTime: '1-4 hours',
    toolsRequired: [
      'Infrared thermometer',
      'Cooling system pressure tester',
      'Refractometer (coolant concentration)',
      'Digital Multimeter',
      'Combustion gas leak tester'
    ],
    partsRequired: [
      'Thermostat',
      'Coolant hoses (if damaged)',
      'Water pump (if faulty)',
      'Radiator cap',
      'Coolant'
    ],
    safetyWarnings: [
      'Never open cooling system when hot - risk of severe burns',
      'Allow engine to cool before removing radiator cap',
      'Coolant is toxic - handle with care and dispose properly',
      'Running engine without coolant causes immediate damage'
    ],
    likelyCauses: [
      {
        cause: 'Low coolant level',
        probability: 25,
        explanation: 'Insufficient coolant reduces heat transfer capacity. Check for leaks.'
      },
      {
        cause: 'Thermostat stuck closed',
        probability: 25,
        explanation: 'Stuck thermostat prevents coolant flow to radiator, causing rapid overheating.'
      },
      {
        cause: 'Water pump failure',
        probability: 20,
        explanation: 'Failed pump impeller or bearing prevents coolant circulation.'
      },
      {
        cause: 'Radiator blocked or restricted',
        probability: 15,
        explanation: 'External debris (dirt, leaves) or internal scale restricts airflow/flow.'
      },
      {
        cause: 'Fan or fan clutch failure',
        probability: 10,
        explanation: 'Failed fan reduces airflow through radiator, especially at low speed/idle.'
      },
      {
        cause: 'Head gasket failure',
        probability: 5,
        explanation: 'Combustion gases entering cooling system cause overheating and pressure buildup.'
      }
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check coolant level',
        details: 'With engine COLD, check coolant level in radiator and overflow tank.',
        expectedResult: 'Radiator full to top of filler neck, overflow at COLD mark',
        measurements: {
          parameter: 'Coolant Level',
          normalRange: 'Radiator full, overflow at COLD mark',
          unit: 'Visual',
          howToMeasure: 'Remove radiator cap (engine cold only). Coolant should be visible at filler neck. Check overflow tank level.'
        },
        ifPassed: 'Level OK. Proceed to Step 2.',
        ifFailed: 'Add coolant. If low, check for leaks - proceed to Step 6.'
      },
      {
        step: 2,
        action: 'Test thermostat operation',
        details: 'Monitor temperature differential across thermostat housing while engine warms.',
        expectedResult: 'Both hoses should be similar temperature once thermostat opens',
        measurements: {
          parameter: 'Thermostat Operation',
          normalRange: 'Opens at 82-88°C (180-190°F)',
          unit: '°C',
          howToMeasure: 'Start cold engine. Use IR thermometer on upper radiator hose. Temperature should stay low then suddenly rise to engine temp when thermostat opens.'
        },
        ifPassed: 'Thermostat operating. Proceed to Step 3.',
        ifFailed: 'If upper hose stays cool while engine overheats: Thermostat stuck closed. Replace.'
      },
      {
        step: 3,
        action: 'Check water pump operation',
        details: 'Verify water pump is circulating coolant.',
        expectedResult: 'Strong coolant flow visible in radiator',
        measurements: {
          parameter: 'Water Pump Flow',
          normalRange: 'Visible flow/swirl in radiator filler',
          unit: 'Visual',
          howToMeasure: 'With engine running and radiator cap removed (warm engine, use caution), observe coolant movement in radiator. Should see strong flow.'
        },
        ifPassed: 'Pump circulating. Proceed to Step 4.',
        ifFailed: 'No flow indicates pump impeller failure or broken belt. Replace pump.'
      },
      {
        step: 4,
        action: 'Check radiator condition',
        details: 'Inspect radiator fins for blockage and core for internal restriction.',
        expectedResult: '>80% of fin area clear, no internal blockage',
        measurements: {
          parameter: 'Radiator Condition',
          normalRange: 'Clean fins, no cold spots on core',
          unit: 'Visual/Thermal',
          howToMeasure: 'Inspect fins visually. Use IR thermometer across radiator face while running - should be uniform temp. Cold spots indicate blocked passages.'
        },
        ifPassed: 'Radiator clear. Proceed to Step 5.',
        ifFailed: 'Clean external fins with air/water. If internal blockage, flush or replace radiator.'
      },
      {
        step: 5,
        action: 'Check fan operation',
        details: 'Verify cooling fan engages at correct temperature.',
        expectedResult: 'Fan engages before coolant reaches shutdown temp',
        measurements: {
          parameter: 'Fan Engagement',
          normalRange: 'Electric: 95-100°C, Clutch: 85-90°C',
          unit: '°C',
          howToMeasure: 'Run engine at idle and monitor fan. Electric fan should cycle on/off. Clutch fan should increase speed as engine warms.'
        },
        ifPassed: 'Fan operating. Proceed to Step 6.',
        ifFailed: 'Check fan relay/fuse (electric) or clutch engagement (mechanical). Repair/replace.'
      },
      {
        step: 6,
        action: 'Pressure test cooling system',
        details: 'Pressurize system to rated cap pressure and check for leaks.',
        expectedResult: 'System holds pressure for 10+ minutes',
        measurements: {
          parameter: 'System Pressure',
          normalRange: 'Holds cap rating (typically 7-15 PSI) for 10 min',
          unit: 'PSI',
          howToMeasure: 'Attach pressure tester to radiator filler. Pump to cap rated pressure. Monitor for pressure drop and inspect for leaks.'
        },
        ifPassed: 'No external leaks.',
        ifFailed: 'Locate and repair leak. Check hoses, water pump seal, radiator tanks, heater core.'
      },
      {
        step: 7,
        action: 'Test for combustion gas leak',
        details: 'Check for head gasket failure allowing combustion gases into cooling system.',
        expectedResult: 'No color change in combustion leak fluid',
        measurements: {
          parameter: 'Combustion Leak Test',
          normalRange: 'Test fluid stays blue',
          unit: 'Color',
          howToMeasure: 'With engine running, use combustion leak tester at radiator filler. Draw air from coolant expansion space through test fluid. Blue = OK, Yellow = combustion gases present.'
        },
        ifPassed: 'Head gasket OK.',
        ifFailed: 'Combustion gas detected. Head gasket failure - major repair required.'
      }
    ],
    repairProcedure: [
      {
        step: 1,
        action: 'Replace thermostat',
        details: 'Drain coolant below thermostat. Remove housing. Replace thermostat with OEM-spec unit.',
        tips: [
          'Note thermostat orientation - jiggle pin/bleed hole position',
          'Replace housing gasket or use RTV sealant',
          'Torque housing bolts evenly to prevent warping',
          'Refill and bleed cooling system'
        ]
      },
      {
        step: 2,
        action: 'Replace water pump',
        details: 'Drain cooling system. Remove belts and pump mounting bolts. Install new pump.',
        tips: [
          'Replace all gaskets/O-rings',
          'Check for coolant contamination of bearings',
          'Install new drive belt',
          'Torque bolts in proper sequence',
          'Pre-fill pump with coolant before installing'
        ]
      },
      {
        step: 3,
        action: 'Clean or replace radiator',
        details: 'Flush radiator or replace if severely blocked.',
        tips: [
          'Reverse flush with water to remove debris',
          'Use radiator cleaning solution for internal deposits',
          'Straighten bent fins with fin comb',
          'Check for soft/swollen spots indicating internal failure',
          'Replace tanks/gaskets if plastic is cracked'
        ]
      },
      {
        step: 4,
        action: 'Repair cooling fan system',
        details: 'Replace fan relay, fuse, clutch, or motor as needed.',
        tips: [
          'Check fan blade condition - cracked blades cause vibration',
          'Verify fan shroud is intact - directs airflow',
          'Test clutch by spinning when cold (should spin freely) and hot (should resist)',
          'Check electric fan amp draw - compare to specification'
        ]
      },
      {
        step: 5,
        action: 'Repair coolant leaks',
        details: 'Replace damaged hoses, clamps, gaskets, or components.',
        tips: [
          'Use silicone coolant hoses for extended life',
          'Replace spring clamps with worm-gear clamps',
          'Apply sealant to threaded fittings',
          'Pressure test after repair'
        ]
      },
      {
        step: 6,
        action: 'Service cooling system',
        details: 'Flush system and refill with correct coolant mixture.',
        tips: [
          'Use 50/50 coolant/water mix for -34°F protection',
          'Check coolant with refractometer - not test strips',
          'Bleed air from system at highest point',
          'Check for air pockets after running'
        ]
      }
    ],
    verificationSteps: [
      'Fill cooling system and bleed air',
      'Run engine to operating temperature',
      'Verify thermostat opens (upper hose gets hot)',
      'Verify fan engages at proper temperature',
      'Load test at 50-75% for 30 minutes',
      'Verify temperature stabilizes below 95°C',
      'Check for leaks under pressure',
      'Verify no fault codes present'
    ],
    preventiveAdvice: [
      'Check coolant level weekly',
      'Test coolant protection annually with refractometer',
      'Flush and replace coolant every 2 years or 2000 hours',
      'Clean radiator fins regularly - monthly in dusty environments',
      'Replace drive belts at manufacturer intervals',
      'Inspect hoses for soft spots and cracking annually'
    ],
    relatedFaultCodes: ['SPN-110-FMI-0', 'SPN-110-FMI-16', 'COOLANT_HIGH', 'ENGINE_OVERHEAT', 'SHUTDOWN_HIGH_TEMP']
  }
};

// ==================== ECM REPROGRAMMING GUIDES ====================

export const ECM_REPROGRAMMING_GUIDES: Record<string, ECMReprogrammingGuide> = {
  'CAT_A5E2': {
    ecmModel: 'A5E2',
    manufacturer: 'Caterpillar',
    compatibleControllers: ['DSE 8610', 'DSE 7320', 'ComAp InteliGen 500', 'Woodward easYgen-3000'],
    firmwareVersions: [
      {
        version: '3.0.2',
        releaseDate: '2024-06-15',
        features: ['Enhanced J1939 messaging', 'Improved cold start'],
        bugFixes: ['Fixed CAN timeout issue', 'Corrected fuel temp compensation'],
        compatibility: ['DSE 86xx series', 'ComAp IG-NT series']
      },
      {
        version: '2.8.1',
        releaseDate: '2023-11-20',
        features: ['Standard J1939 messaging'],
        bugFixes: [],
        compatibility: ['DSE 73xx series', 'Older ComAp models']
      }
    ],
    reprogrammingProcedure: [
      {
        step: 1,
        action: 'Connect CAT Electronic Technician (ET) software',
        details: 'Use CAT communication adapter connected to ECM diagnostic port (Deutsch 9-pin).',
        criticalNotes: [
          'Use genuine CAT adapter or compatible J1939/CAN adapter',
          'Ensure ET software license is current',
          'Battery voltage must be 12-14V or 24-28V depending on system'
        ]
      },
      {
        step: 2,
        action: 'Read and save current ECM configuration',
        details: 'In ET, go to Service > Flash Programming > Read ECM. Save .fls file.',
        criticalNotes: [
          'Name file with engine serial number and date',
          'Save to PC and USB backup',
          'Record current fault codes before proceeding'
        ]
      },
      {
        step: 3,
        action: 'Obtain flash file from CAT SIS',
        details: 'Download correct flash file from SIS based on engine serial number.',
        criticalNotes: [
          'Match engine arrangement number exactly',
          'Verify flash file date is newer than current',
          'Download both .fls and .cal files if separate'
        ]
      },
      {
        step: 4,
        action: 'Flash ECM with new firmware',
        details: 'In ET, go to Service > Flash Programming > Flash ECM. Select downloaded file.',
        criticalNotes: [
          'Connect battery charger to maintain voltage',
          'Do not interrupt process - takes 10-20 minutes',
          'ECM will restart multiple times',
          'Wait for "Flash Complete" message'
        ]
      },
      {
        step: 5,
        action: 'Configure ECM parameters',
        details: 'Set engine parameters, J1939 configuration, and customer settings.',
        criticalNotes: [
          'Set correct engine serial number',
          'Configure rated speed and power',
          'Set J1939 source address (typically 0x00)',
          'Enable required PGN transmissions'
        ]
      },
      {
        step: 6,
        action: 'Perform injector trim calibration',
        details: 'Enter injector trim codes from each injector label.',
        criticalNotes: [
          'Each injector has unique trim code',
          'Enter codes in firing order',
          'Incorrect codes cause rough running and smoke',
          'Codes are on injector body label'
        ]
      }
    ],
    parameterSettings: [
      {
        parameter: 'Engine Rating',
        description: 'Rated power output in kW or HP',
        defaultValue: 'Per nameplate',
        adjustmentRange: '70-100% of max rating',
        adjustmentProcedure: 'ET > Configuration > Engine Rating. Select rating from list or enter custom value within allowed range.'
      },
      {
        parameter: 'Rated Speed',
        description: 'Governed engine speed for power generation',
        defaultValue: '1500 or 1800 RPM',
        adjustmentRange: '1500 or 1800 RPM (50/60 Hz)',
        adjustmentProcedure: 'ET > Configuration > Speed/Timing. Set rated speed. This changes governor targets.'
      },
      {
        parameter: 'J1939 Source Address',
        description: 'ECM address on CAN bus',
        defaultValue: '0x00',
        adjustmentRange: '0x00-0xFD',
        adjustmentProcedure: 'ET > Configuration > Data Link. Set J1939 Source Address. Typically 0x00 for primary ECM.'
      },
      {
        parameter: 'Coolant Temp Shutdown',
        description: 'Temperature at which ECM commands shutdown',
        defaultValue: '107°C',
        adjustmentRange: '100-115°C',
        adjustmentProcedure: 'ET > Configuration > Protection. Set coolant temperature shutdown setpoint.'
      },
      {
        parameter: 'Low Oil Pressure Shutdown',
        description: 'Oil pressure at which ECM commands shutdown',
        defaultValue: '69 kPa (10 PSI)',
        adjustmentRange: '55-100 kPa',
        adjustmentProcedure: 'ET > Configuration > Protection. Set oil pressure shutdown setpoint. Consider engine oil viscosity.'
      }
    ],
    communicationSetup: {
      protocol: 'J1939',
      baudRate: 250000,
      canAddresses: { tx: '0x18FEF000', rx: '0x18FEF0xx' },
      terminationRequired: true,
      wiringDiagram: `
        ECM Connector (Deutsch HD10-9-1939P):
        Pin 1: CAN_H (J1939+) - Yellow
        Pin 2: CAN_L (J1939-) - Green
        Pin 3: Ground (Shield)
        Pin 7: +12V/24V Power
        Pin 9: Ground

        Termination: 120Ω resistor between Pin 1 and Pin 2 at ECM end if ECM is at end of bus.
      `
    }
  },

  'CUMMINS_CM2350': {
    ecmModel: 'CM2350',
    manufacturer: 'Cummins',
    compatibleControllers: ['DSE 8610', 'DSE 7320', 'ComAp InteliGen 200', 'PowerCommand'],
    firmwareVersions: [
      {
        version: '4.2.0',
        releaseDate: '2024-08-10',
        features: ['Tier 4 Final emissions', 'Enhanced diagnostics'],
        bugFixes: ['DPF regeneration timing', 'SCR efficiency improvement'],
        compatibility: ['All current controllers']
      }
    ],
    reprogrammingProcedure: [
      {
        step: 1,
        action: 'Connect Cummins INSITE software',
        details: 'Use Cummins Inline 7 adapter connected to ECM datalink connector.',
        criticalNotes: [
          'INSITE license must include ECM programming feature',
          'Inline 7 must have current firmware',
          'Key must be ON, engine OFF'
        ]
      },
      {
        step: 2,
        action: 'Read ECM information',
        details: 'Connect and read ECM identification, calibration, and fault codes.',
        criticalNotes: [
          'Document current calibration version',
          'Save fault codes for reference',
          'Note any customer passwords'
        ]
      },
      {
        step: 3,
        action: 'Download calibration from QuickServe Online',
        details: 'Using engine serial number, download correct calibration file.',
        criticalNotes: [
          'Match exact engine serial number',
          'Download includes all required files',
          'Some calibrations require feature codes'
        ]
      },
      {
        step: 4,
        action: 'Program ECM',
        details: 'Use INSITE > ECM Programming > Write to ECM.',
        criticalNotes: [
          'Process takes 15-30 minutes',
          'Do not disconnect or interrupt',
          'Battery voltage must stay above 11V (12V system) or 22V (24V system)'
        ]
      },
      {
        step: 5,
        action: 'Configure features and parameters',
        details: 'Set customer-specific features and protection parameters.',
        criticalNotes: [
          'Set idle speed, rated speed',
          'Configure shutdown setpoints',
          'Set J1939 parameters for controller compatibility'
        ]
      }
    ],
    parameterSettings: [
      {
        parameter: 'Rated Power',
        description: 'Engine power rating',
        defaultValue: 'Per CPL/engine rating',
        adjustmentRange: 'Within engine family ratings',
        adjustmentProcedure: 'INSITE > Features and Parameters > Engine Rating. Select from available ratings.'
      },
      {
        parameter: 'Low Idle Speed',
        description: 'Minimum governed speed',
        defaultValue: '700-800 RPM',
        adjustmentRange: '600-900 RPM',
        adjustmentProcedure: 'INSITE > Features and Parameters > Speed. Set low idle speed.'
      },
      {
        parameter: 'High Idle Speed',
        description: 'Maximum no-load speed',
        defaultValue: '1560/1880 RPM (50/60 Hz)',
        adjustmentRange: '±5% of rated',
        adjustmentProcedure: 'INSITE > Features and Parameters > Speed. Set high idle speed.'
      }
    ],
    communicationSetup: {
      protocol: 'J1939',
      baudRate: 250000,
      canAddresses: { tx: '0x18FEF000', rx: '0x18FEF0xx' },
      terminationRequired: true,
      wiringDiagram: `
        CM2350 OEM Connector:
        J1939 Datalink:
        Pin A: CAN_H (J1939+)
        Pin B: CAN_L (J1939-)
        Pin C: Shield/Ground

        Service Tool Connector:
        Use Cummins 9-pin diagnostic connector.
      `
    }
  }
};

// ==================== DIAGNOSTIC INTERPRETATION ENGINE ====================

export function interpretDiagnosticInput(input: DiagnosticInput): {
  analysis: {
    likelyCauses: Array<{ cause: string; probability: number; explanation: string }>;
    recommendedSolutions: string[];
    diagnosticFlow: CompleteSolution | null;
    immediateActions: string[];
    warningLevel: 'info' | 'warning' | 'critical' | 'emergency';
  };
} {
  const analysis = {
    likelyCauses: [] as Array<{ cause: string; probability: number; explanation: string }>,
    recommendedSolutions: [] as string[],
    diagnosticFlow: null as CompleteSolution | null,
    immediateActions: [] as string[],
    warningLevel: 'info' as 'info' | 'warning' | 'critical' | 'emergency'
  };

  // Analyze based on RPM
  if (input.rpm !== undefined) {
    if (input.rpm === 0 && input.voltage && input.voltage > 20) {
      // Engine not running but has power
      analysis.likelyCauses.push({
        cause: 'Engine cranks but does not start',
        probability: 80,
        explanation: 'Battery voltage present but engine at 0 RPM indicates cranking without starting. Check fuel delivery, air intake, and engine timing.'
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['NO_FUEL_INJECTION'];
      analysis.warningLevel = 'critical';
      analysis.immediateActions.push('Check fuel level and fuel shutoff valve position');
      analysis.immediateActions.push('Verify air intake is not blocked');
      analysis.immediateActions.push('Listen for fuel pump operation when key is turned ON');
    }
  }

  // Analyze based on load
  if (input.load !== undefined && input.rpm !== undefined && input.rpm > 0) {
    if (input.load > 0 && input.rpm < 1450) {
      // Engine under load but speed dropping
      analysis.likelyCauses.push({
        cause: 'Engine unable to maintain speed under load',
        probability: 75,
        explanation: 'Speed droop beyond normal indicates insufficient fuel delivery or restricted air intake.'
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['NOT_TAKING_FULL_LOAD'];
      analysis.warningLevel = 'warning';
      analysis.recommendedSolutions.push('Check air filter restriction');
      analysis.recommendedSolutions.push('Verify turbo boost pressure');
      analysis.recommendedSolutions.push('Test fuel transfer pump pressure');
    }
  }

  // Analyze based on coolant temperature
  if (input.coolantTemp !== undefined) {
    if (input.coolantTemp > 100) {
      analysis.likelyCauses.push({
        cause: 'Engine overheating',
        probability: 90,
        explanation: `Coolant temperature of ${input.coolantTemp}°C exceeds safe operating limit. Immediate action required.`
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['COOLANT_OVERTEMPERATURE'];
      analysis.warningLevel = 'emergency';
      analysis.immediateActions.push('REDUCE LOAD IMMEDIATELY');
      analysis.immediateActions.push('Check coolant level');
      analysis.immediateActions.push('Verify cooling fan operation');
      analysis.immediateActions.push('If temperature continues rising, SHUT DOWN engine');
    } else if (input.coolantTemp > 95) {
      analysis.warningLevel = 'warning';
      analysis.recommendedSolutions.push('Monitor temperature closely');
      analysis.recommendedSolutions.push('Check for cooling system issues');
    }
  }

  // Analyze based on fault code
  if (input.faultCode) {
    const code = input.faultCode.toUpperCase();

    // ECM communication faults
    if (code.includes('421039') || code.includes('J1939') || code.includes('CAN') || code.includes('ECU')) {
      analysis.likelyCauses.push({
        cause: 'ECM communication failure',
        probability: 85,
        explanation: 'Fault code indicates loss of communication between controller and ECM. Check CAN bus wiring and termination.'
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['ECM_NO_COMMUNICATION'];
      analysis.warningLevel = 'critical';
      analysis.immediateActions.push('Check CAN bus wiring connections');
      analysis.immediateActions.push('Verify ECM has power');
    }

    // Injector faults
    if (code.includes('INJ') || code.includes('651') || code.includes('652') || code.includes('P020')) {
      analysis.likelyCauses.push({
        cause: 'Injector circuit fault',
        probability: 80,
        explanation: 'Fault indicates problem with injector electrical circuit or ECM driver.'
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['NO_FUEL_INJECTION'];
      analysis.warningLevel = 'critical';
    }

    // Temperature faults
    if (code.includes('110') || code.includes('TEMP') || code.includes('OVERHEAT')) {
      analysis.likelyCauses.push({
        cause: 'High engine temperature',
        probability: 85,
        explanation: 'Fault indicates coolant temperature has exceeded warning or shutdown threshold.'
      });
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['COOLANT_OVERTEMPERATURE'];
      analysis.warningLevel = 'critical';
    }
  }

  // Analyze symptom combinations
  if (input.symptoms && input.symptoms.length > 0) {
    const symptoms = input.symptoms.map(s => s.toLowerCase());

    if (symptoms.some(s => s.includes('no data') || s.includes('no communication') || s.includes('no ecm'))) {
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['ECM_NO_COMMUNICATION'];
      analysis.warningLevel = 'critical';
    }

    if (symptoms.some(s => s.includes('no start') || s.includes('cranks') || s.includes('no injection'))) {
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['NO_FUEL_INJECTION'];
      analysis.warningLevel = 'critical';
    }

    if (symptoms.some(s => s.includes('low power') || s.includes('derate') || s.includes('won\'t take load'))) {
      analysis.diagnosticFlow = COMPLETE_SOLUTIONS['NOT_TAKING_FULL_LOAD'];
      analysis.warningLevel = 'warning';
    }
  }

  return { analysis };
}

// ==================== SOLUTION LOOKUP FUNCTIONS ====================

export function getSolutionById(id: string): CompleteSolution | null {
  return COMPLETE_SOLUTIONS[id] || null;
}

export function getSolutionsByCategory(category: CompleteSolution['category']): CompleteSolution[] {
  return Object.values(COMPLETE_SOLUTIONS).filter(s => s.category === category);
}

export function searchSolutions(query: string): CompleteSolution[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(COMPLETE_SOLUTIONS).filter(s =>
    s.title.toLowerCase().includes(lowerQuery) ||
    s.likelyCauses.some(c => c.cause.toLowerCase().includes(lowerQuery)) ||
    s.relatedFaultCodes.some(c => c.toLowerCase().includes(lowerQuery))
  );
}

export function getECMReprogrammingGuide(ecmModel: string): ECMReprogrammingGuide | null {
  return ECM_REPROGRAMMING_GUIDES[ecmModel] || null;
}

export function getAllECMGuides(): ECMReprogrammingGuide[] {
  return Object.values(ECM_REPROGRAMMING_GUIDES);
}
