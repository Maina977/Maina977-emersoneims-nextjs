/**
 * GENERATOR ERROR CODE DATABASE
 * The most comprehensive generator error code database in the world
 * 13,500+ error codes across all major brands
 * Updated: January 2026
 *
 * Sources:
 * - Primary database: 9,509 codes (comprehensiveErrorCodes.json)
 * - WordPress Plugin database: 3,996 codes (wordpressFaultCodes.ts)
 * - Manual additions: Additional brand-specific codes
 *
 * Total: 13,505+ comprehensive error codes
 */

import comprehensiveErrorCodes from '@/app/data/diagnostic/comprehensiveErrorCodes.json';
import { WORDPRESS_FAULT_CODES, type WordPressFaultCode } from './wordpressFaultCodes';

export interface ErrorCode {
  code: string;
  brand: string;
  category: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  diagnosticSteps: {
    step: number;
    action: string;
    expectedResult: string;
    tools?: string[];
  }[];
  solutions: {
    difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
    timeEstimate: string;
    solution: string;
    tools: string[];
    parts?: string[];
    cost?: string;
  }[];
  preventiveMeasures: string[];
  relatedCodes: string[];
  videoGuide?: string;
  safetyWarnings: string[];
  whenToCallExpert: string;
}

export interface PredictiveMaintenance {
  component: string;
  currentHealth: number; // 0-100
  predictedFailure: string; // date or "N/A"
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Comprehensive error code database
export const GENERATOR_ERROR_CODES: ErrorCode[] = [
  // ===== CUMMINS ERROR CODES =====
  {
    code: '111',
    brand: 'Cummins',
    category: 'Engine Control Module',
    severity: 'warning',
    title: 'ECM Hardware Failure - Internal',
    description: 'The Electronic Control Module (ECM) has detected an internal hardware malfunction. This may affect engine performance and monitoring capabilities.',
    symptoms: [
      'Check engine light illuminated',
      'Erratic engine behavior',
      'Loss of diagnostic communication',
      'Engine may run in limp mode',
      'Intermittent power fluctuations'
    ],
    causes: [
      'ECM internal circuit failure',
      'Voltage spike or electrical surge',
      'Water ingress into ECM',
      'Excessive vibration causing loose connections',
      'Manufacturing defect',
      'Age-related component degradation'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check ECM power supply voltage',
        expectedResult: '24V DC ± 2V (or 12V for 12V systems)',
        tools: ['Digital Multimeter', 'ECM Wiring Diagram']
      },
      {
        step: 2,
        action: 'Inspect ECM connector for corrosion or damage',
        expectedResult: 'Clean, dry pins with no bent or broken contacts',
        tools: ['Flashlight', 'Connector Cleaning Spray', 'Magnifying Glass']
      },
      {
        step: 3,
        action: 'Check for water intrusion in ECM housing',
        expectedResult: 'No moisture or water damage visible',
        tools: ['Flashlight', 'Moisture Meter']
      },
      {
        step: 4,
        action: 'Perform ECM self-test using diagnostic tool',
        expectedResult: 'Self-test should pass all internal checks',
        tools: ['Cummins INSITE Software', 'Diagnostic Adapter']
      },
      {
        step: 5,
        action: 'Check ground connections',
        expectedResult: 'Ground resistance < 0.5 ohms',
        tools: ['Digital Multimeter', 'Wire Brush']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        solution: 'Clear fault code and monitor. If code returns, proceed to next solution.',
        tools: ['Diagnostic Scanner', 'Cummins INSITE'],
        cost: '$0 - Just labor'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Clean and reseat all ECM connectors. Apply dielectric grease to prevent future corrosion.',
        tools: ['Contact Cleaner', 'Dielectric Grease', 'Torque Wrench'],
        parts: ['Connector Seals (if damaged)'],
        cost: '$20-50'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Update ECM firmware to latest version. Some internal faults are resolved with software updates.',
        tools: ['Cummins INSITE Software', 'Laptop', 'Diagnostic Adapter'],
        cost: '$100-200 (software license)'
      },
      {
        difficulty: 'expert',
        timeEstimate: '4-8 hours',
        solution: 'Replace ECM unit. Requires reprogramming with engine-specific calibration files.',
        tools: ['Cummins INSITE', 'New ECM', 'Calibration Files'],
        parts: ['ECM Unit', 'Gaskets', 'Mounting Hardware'],
        cost: '$1,500-3,500'
      }
    ],
    preventiveMeasures: [
      'Install surge protector on generator power supply',
      'Ensure proper ventilation around ECM',
      'Regular inspection of ECM mounting and connections',
      'Keep ECM area clean and dry',
      'Use quality fuel and maintain fuel system'
    ],
    relatedCodes: ['115', '122', '131', '141', '151'],
    safetyWarnings: [
      'Always disconnect battery before working on ECM',
      'Handle ECM with ESD protection',
      'Do not operate generator with suspected ECM failure'
    ],
    whenToCallExpert: 'If ECM replacement is needed, or if you lack diagnostic software access'
  },
  {
    code: '115',
    brand: 'Cummins',
    category: 'Engine Speed/Position',
    severity: 'critical',
    title: 'Engine Speed Sensor Circuit - No Signal',
    description: 'The ECM is not receiving a signal from the engine speed sensor (crankshaft position sensor). Engine will not start or will shut down.',
    symptoms: [
      'Engine cranks but will not start',
      'Engine stalls suddenly',
      'No RPM reading on display',
      'Check engine light on',
      'No fuel injection occurring'
    ],
    causes: [
      'Damaged or failed speed sensor',
      'Wiring harness damage or open circuit',
      'Sensor air gap too large',
      'Damaged tone wheel/reluctor ring',
      'ECM failure (rare)',
      'Corroded connector pins'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check sensor connector for damage and corrosion',
        expectedResult: 'Clean, undamaged connector with secure fit',
        tools: ['Flashlight', 'Connector Inspection Mirror']
      },
      {
        step: 2,
        action: 'Measure sensor resistance',
        expectedResult: '200-900 ohms (varies by sensor type)',
        tools: ['Digital Multimeter']
      },
      {
        step: 3,
        action: 'Check sensor air gap',
        expectedResult: '0.5-1.5mm (check service manual)',
        tools: ['Feeler Gauge Set']
      },
      {
        step: 4,
        action: 'Inspect tone wheel for damage',
        expectedResult: 'No missing teeth, cracks, or debris',
        tools: ['Inspection Mirror', 'Flashlight']
      },
      {
        step: 5,
        action: 'Check wiring continuity from sensor to ECM',
        expectedResult: '< 5 ohms resistance through entire harness',
        tools: ['Digital Multimeter', 'Wiring Diagram']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '10-20 minutes',
        solution: 'Clean sensor tip and connector. Metallic debris on sensor can cause signal issues.',
        tools: ['Clean Cloth', 'Contact Cleaner'],
        cost: '$0-10'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30-60 minutes',
        solution: 'Adjust sensor air gap to specification. Loosen mounting bolt, set gap with feeler gauge, retighten.',
        tools: ['Feeler Gauge', 'Socket Set', 'Torque Wrench'],
        cost: '$0 - Just labor'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace engine speed sensor. Direct replacement, ensure correct part number.',
        tools: ['Socket Set', 'Torque Wrench'],
        parts: ['Speed Sensor', 'O-ring (if applicable)'],
        cost: '$80-250'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Repair or replace wiring harness section. Splice in new wire or replace entire harness.',
        tools: ['Wire Strippers', 'Crimping Tool', 'Heat Shrink', 'Soldering Iron'],
        parts: ['Wiring', 'Connectors', 'Heat Shrink Tubing'],
        cost: '$50-300'
      }
    ],
    preventiveMeasures: [
      'Regular inspection of sensor and connections',
      'Keep engine compartment clean',
      'Check for oil leaks near sensor',
      'Protect wiring from heat and vibration',
      'Use genuine replacement parts'
    ],
    relatedCodes: ['111', '122', '141', '143', '144'],
    safetyWarnings: [
      'Engine may start unexpectedly when fault clears',
      'Ensure engine is at rest before inspection',
      'Use lock-out/tag-out procedures'
    ],
    whenToCallExpert: 'If tone wheel damage is found, or internal engine work is required'
  },
  {
    code: '234',
    brand: 'Cummins',
    category: 'Engine Protection',
    severity: 'emergency',
    title: 'Engine Overspeed - Severe',
    description: 'Engine speed has exceeded maximum safe operating limit. This is a critical safety fault that requires immediate shutdown.',
    symptoms: [
      'Engine running excessively fast',
      'Loud engine noise',
      'Emergency shutdown activated',
      'Alarm/horn sounding',
      'Vibration may be excessive'
    ],
    causes: [
      'Governor/actuator failure',
      'Fuel system malfunction',
      'Speed sensor signal error',
      'ECM calibration error',
      'Mechanical governor failure',
      'Load suddenly disconnected'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'DO NOT RESTART - Inspect for visible damage first',
        expectedResult: 'Check for broken parts, fluid leaks, smoke',
        tools: ['Flashlight', 'PPE']
      },
      {
        step: 2,
        action: 'Check governor linkage and actuator',
        expectedResult: 'Linkage intact, actuator moves freely',
        tools: ['Visual Inspection', 'Hand Tools']
      },
      {
        step: 3,
        action: 'Verify speed sensor operation',
        expectedResult: 'Correct resistance, clean connection',
        tools: ['Digital Multimeter']
      },
      {
        step: 4,
        action: 'Check for internal engine damage (compression test)',
        expectedResult: 'All cylinders within 10% of each other',
        tools: ['Compression Tester', 'Socket Set']
      }
    ],
    solutions: [
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Inspect and adjust governor linkage. Reset governor to factory specifications.',
        tools: ['Socket Set', 'Screwdrivers', 'Governor Adjustment Tools'],
        cost: '$50-100'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Replace electronic governor actuator. Calibrate using diagnostic software.',
        tools: ['Socket Set', 'Diagnostic Software', 'Torque Wrench'],
        parts: ['Governor Actuator'],
        cost: '$300-800'
      },
      {
        difficulty: 'expert',
        timeEstimate: '8-24 hours',
        solution: 'Complete engine inspection and rebuild if damage found. Internal damage from overspeed can be severe.',
        tools: ['Full Engine Tool Set', 'Measuring Equipment'],
        parts: ['Varies based on damage'],
        cost: '$2,000-15,000+'
      }
    ],
    preventiveMeasures: [
      'Regular governor testing and calibration',
      'Never disconnect load with engine at high speed',
      'Install overspeed protection relay',
      'Regular oil changes to protect governor',
      'Test emergency shutdown monthly'
    ],
    relatedCodes: ['111', '115', '235', '241', '553'],
    safetyWarnings: [
      'DO NOT RESTART until cause is identified',
      'Overspeed can cause catastrophic engine failure',
      'Check for thrown parts before approaching',
      'May have internal damage not immediately visible'
    ],
    whenToCallExpert: 'Always - overspeed events require professional inspection'
  },
  // ===== CATERPILLAR ERROR CODES =====
  {
    code: 'E360',
    brand: 'Caterpillar',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Voltage Regulator Fault',
    description: 'The Automatic Voltage Regulator (AVR) is not maintaining proper output voltage. Generator output is unstable or incorrect.',
    symptoms: [
      'Voltage fluctuations on output',
      'Lights flickering',
      'Sensitive equipment tripping',
      'No output voltage',
      'Voltage too high or too low'
    ],
    causes: [
      'AVR component failure',
      'Sensing circuit fault',
      'Excitation system problem',
      'Brush wear on exciter',
      'Capacitor failure',
      'Wiring fault in voltage sensing'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure generator output voltage',
        expectedResult: 'Should be within ±5% of rated voltage',
        tools: ['True RMS Multimeter', 'Clamp Meter']
      },
      {
        step: 2,
        action: 'Check AVR sensing inputs',
        expectedResult: 'Sensing voltage matches actual output',
        tools: ['Digital Multimeter', 'AVR Manual']
      },
      {
        step: 3,
        action: 'Inspect brushes and slip rings',
        expectedResult: 'Brushes >50% length, slip rings clean and smooth',
        tools: ['Flashlight', 'Feeler Gauge']
      },
      {
        step: 4,
        action: 'Test AVR output to field',
        expectedResult: 'DC voltage increasing with load',
        tools: ['Digital Multimeter', 'Oscilloscope (optional)']
      },
      {
        step: 5,
        action: 'Check for residual magnetism',
        expectedResult: 'Small voltage output when spinning without excitation',
        tools: ['Multimeter']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        solution: 'Adjust AVR voltage potentiometer. Most AVRs have a voltage adjustment screw.',
        tools: ['Small Screwdriver', 'Multimeter'],
        cost: '$0'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Flash field to restore residual magnetism. Connect 12V DC briefly to field winding.',
        tools: ['12V Battery', 'Jumper Wires', 'Multimeter'],
        cost: '$0-20'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace brushes and clean slip rings. Use fine sandpaper on slip rings.',
        tools: ['Sandpaper (400 grit)', 'Brush Holder Tools'],
        parts: ['Brush Set'],
        cost: '$30-100'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Replace AVR unit. Match exact part number or compatible replacement.',
        tools: ['Screwdrivers', 'Wire Crimpers'],
        parts: ['AVR Unit'],
        cost: '$150-500'
      }
    ],
    preventiveMeasures: [
      'Annual brush inspection',
      'Keep AVR clean and cool',
      'Check connections quarterly',
      'Run generator under load monthly',
      'Protect from voltage spikes'
    ],
    relatedCodes: ['E361', 'E362', 'E370', 'E371'],
    safetyWarnings: [
      'High voltage present - use extreme caution',
      'Disconnect all loads before testing',
      'Do not touch rotating parts',
      'Allow generator to cool before internal inspection'
    ],
    whenToCallExpert: 'If internal alternator work is needed, or specialized equipment required'
  },
  {
    code: 'E362',
    brand: 'Caterpillar',
    category: 'Generator Protection',
    severity: 'emergency',
    title: 'Generator Over Voltage',
    description: 'Output voltage has exceeded maximum safe limit. This can damage connected equipment and indicates a serious voltage regulation problem.',
    symptoms: [
      'Connected equipment damaged',
      'Lights excessively bright',
      'Voltage reading above nominal +10%',
      'Generator shutdown',
      'Burning smell possible'
    ],
    causes: [
      'AVR failure (stuck at max output)',
      'Voltage sensing wire disconnected',
      'Incorrect AVR settings',
      'Speed governor malfunction (too fast)',
      'Load rejection surge'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Verify engine speed is correct',
        expectedResult: '1500 RPM (50Hz) or 1800 RPM (60Hz)',
        tools: ['Tachometer']
      },
      {
        step: 2,
        action: 'Check AVR sensing wire connections',
        expectedResult: 'Securely connected, no broken wires',
        tools: ['Visual Inspection', 'Multimeter']
      },
      {
        step: 3,
        action: 'Test AVR in manual mode (if available)',
        expectedResult: 'Voltage controllable via manual adjustment',
        tools: ['AVR Manual', 'Multimeter']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15 minutes',
        solution: 'Check and reconnect voltage sensing wires. Broken sensing = AVR goes to maximum.',
        tools: ['Screwdriver', 'Multimeter'],
        cost: '$0'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30 minutes',
        solution: 'Adjust engine governor to correct speed. Verify frequency output.',
        tools: ['Tachometer', 'Governor Adjustment Tools'],
        cost: '$0'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-3 hours',
        solution: 'Replace AVR with quality unit. Install surge protection on output.',
        tools: ['Hand Tools', 'Multimeter'],
        parts: ['AVR', 'Surge Protector (optional)'],
        cost: '$200-600'
      }
    ],
    preventiveMeasures: [
      'Install over-voltage protection relay',
      'Regular AVR inspection and testing',
      'Use surge protectors on sensitive loads',
      'Verify speed/frequency weekly',
      'Never disconnect large loads suddenly'
    ],
    relatedCodes: ['E360', 'E361', 'E363'],
    safetyWarnings: [
      'DANGEROUS HIGH VOLTAGE - immediate shutdown required',
      'Do not reconnect loads until fixed',
      'Inspect all connected equipment for damage',
      'Check for burned wiring'
    ],
    whenToCallExpert: 'Immediately - over voltage can cause fires and equipment damage'
  },
  // ===== PERKINS ERROR CODES =====
  {
    code: 'SPN-100',
    brand: 'Perkins',
    category: 'Fuel System',
    severity: 'critical',
    title: 'Oil Pressure Low - Severe',
    description: 'Engine oil pressure has dropped below critical minimum. Continued operation will cause severe engine damage.',
    symptoms: [
      'Oil pressure warning light/alarm',
      'Low oil pressure on gauge',
      'Engine knocking sounds',
      'Engine may shut down automatically',
      'Increased engine temperature'
    ],
    causes: [
      'Low oil level',
      'Oil pump failure',
      'Clogged oil filter',
      'Oil pressure sensor fault',
      'Worn main bearings',
      'Oil cooler blockage',
      'Wrong oil viscosity'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check oil level on dipstick',
        expectedResult: 'Between MIN and MAX marks',
        tools: ['Clean Rag']
      },
      {
        step: 2,
        action: 'Install mechanical oil pressure gauge',
        expectedResult: '>20 PSI at idle, >40 PSI at rated speed',
        tools: ['Mechanical Oil Pressure Gauge', 'Adapter Fittings']
      },
      {
        step: 3,
        action: 'Check oil filter condition',
        expectedResult: 'No excessive contamination, filter not collapsed',
        tools: ['Oil Filter Wrench', 'Drain Pan']
      },
      {
        step: 4,
        action: 'Test oil pressure sensor',
        expectedResult: 'Correct resistance per temperature',
        tools: ['Digital Multimeter', 'Sensor Chart']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '10 minutes',
        solution: 'Add correct grade oil to proper level. Use 15W-40 for most diesel generators.',
        tools: ['Funnel', 'Oil Container'],
        parts: ['Engine Oil (15W-40)'],
        cost: '$30-60'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30-45 minutes',
        solution: 'Replace oil filter and perform oil change. Use genuine or quality filters.',
        tools: ['Oil Filter Wrench', 'Drain Pan', 'Funnel'],
        parts: ['Oil Filter', 'Engine Oil', 'Drain Plug Washer'],
        cost: '$80-150'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1 hour',
        solution: 'Replace oil pressure sensor. Clean threads and use thread sealant.',
        tools: ['Wrench Set', 'Thread Sealant'],
        parts: ['Oil Pressure Sensor'],
        cost: '$30-80'
      },
      {
        difficulty: 'expert',
        timeEstimate: '8-16 hours',
        solution: 'Oil pump or bearing replacement. Requires engine disassembly.',
        tools: ['Engine Rebuild Tools', 'Torque Wrench', 'Plastigage'],
        parts: ['Oil Pump', 'Bearings', 'Gaskets'],
        cost: '$500-2,500'
      }
    ],
    preventiveMeasures: [
      'Check oil level daily',
      'Change oil per manufacturer schedule',
      'Use correct oil grade',
      'Replace filter at every oil change',
      'Monitor for oil leaks'
    ],
    relatedCodes: ['SPN-101', 'SPN-102', 'SPN-110'],
    safetyWarnings: [
      'STOP ENGINE IMMEDIATELY if oil pressure drops',
      'Running with low pressure causes catastrophic damage',
      'Hot oil can cause severe burns',
      'Allow engine to cool before checking'
    ],
    whenToCallExpert: 'If mechanical pressure is low with adequate oil level'
  },
  // ===== FG WILSON ERROR CODES =====
  {
    code: 'FGW-001',
    brand: 'FG Wilson',
    category: 'Control Panel',
    severity: 'warning',
    title: 'Battery Charger Failure',
    description: 'The built-in battery charger is not functioning correctly. Batteries may discharge over time, preventing generator start.',
    symptoms: [
      'Battery voltage dropping over time',
      'Charger failure indicator lit',
      'Generator slow to crank',
      'Generator fails to start after extended shutdown'
    ],
    causes: [
      'Charger fuse blown',
      'Charger module failure',
      'Loose wiring connections',
      'Battery terminal corrosion',
      'AC supply to charger absent'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check charger output voltage',
        expectedResult: '27.2-28.4V DC for 24V system (float charge)',
        tools: ['Digital Multimeter']
      },
      {
        step: 2,
        action: 'Verify AC supply to charger',
        expectedResult: '230V AC (or as rated)',
        tools: ['Multimeter', 'Voltage Tester']
      },
      {
        step: 3,
        action: 'Check charger fuse',
        expectedResult: 'Continuity present',
        tools: ['Multimeter', 'Fuse Puller']
      },
      {
        step: 4,
        action: 'Inspect battery connections',
        expectedResult: 'Clean, tight terminals',
        tools: ['Wire Brush', 'Wrenches']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15 minutes',
        solution: 'Replace charger fuse with correct rating.',
        tools: ['Fuse Puller'],
        parts: ['Fuse (correct rating)'],
        cost: '$5-15'
      },
      {
        difficulty: 'easy',
        timeEstimate: '30 minutes',
        solution: 'Clean and tighten all battery connections. Apply terminal protector.',
        tools: ['Wire Brush', 'Wrench Set', 'Terminal Protector Spray'],
        cost: '$10-20'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace battery charger module.',
        tools: ['Screwdriver Set', 'Wire Crimpers'],
        parts: ['Battery Charger Module'],
        cost: '$150-400'
      }
    ],
    preventiveMeasures: [
      'Monthly battery voltage check',
      'Keep terminals clean',
      'Check electrolyte levels (if applicable)',
      'Test charger output quarterly',
      'Replace batteries every 3-5 years'
    ],
    relatedCodes: ['FGW-002', 'FGW-010', 'FGW-011'],
    safetyWarnings: [
      'Battery acid is corrosive',
      'Batteries can emit explosive gases',
      'Use insulated tools around batteries',
      'Remove jewelry before working on electrical systems'
    ],
    whenToCallExpert: 'If charger module replacement needed and not comfortable with electrical work'
  },
  // ===== KOHLER ERROR CODES =====
  {
    code: 'K-25',
    brand: 'Kohler',
    category: 'Cooling System',
    severity: 'critical',
    title: 'High Coolant Temperature',
    description: 'Engine coolant temperature has exceeded maximum safe operating limit. Engine will derate or shut down to prevent damage.',
    symptoms: [
      'High temperature warning/alarm',
      'Engine power reduced (derate)',
      'Engine shutdown',
      'Coolant may be boiling',
      'Steam from overflow'
    ],
    causes: [
      'Low coolant level',
      'Radiator blocked/dirty',
      'Fan belt broken or slipping',
      'Thermostat stuck closed',
      'Water pump failure',
      'Head gasket failure',
      'Overloaded generator'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check coolant level (when cool)',
        expectedResult: 'At or near MAX mark',
        tools: ['Flashlight', 'PPE - wait for engine to cool']
      },
      {
        step: 2,
        action: 'Inspect radiator for blockage',
        expectedResult: 'Fins clean and unobstructed',
        tools: ['Flashlight', 'Compressed Air']
      },
      {
        step: 3,
        action: 'Check fan belt tension and condition',
        expectedResult: '10-15mm deflection, no cracks or glazing',
        tools: ['Belt Tension Gauge']
      },
      {
        step: 4,
        action: 'Test thermostat operation',
        expectedResult: 'Opens at specified temperature (82-88°C typical)',
        tools: ['Thermometer', 'Container', 'Heat Source']
      },
      {
        step: 5,
        action: 'Check for combustion gases in coolant',
        expectedResult: 'No bubbles or color change in test fluid',
        tools: ['Combustion Leak Tester']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15 minutes',
        solution: 'Top up coolant to correct level. Use 50/50 antifreeze mix.',
        tools: ['Funnel'],
        parts: ['Coolant/Antifreeze'],
        cost: '$20-40'
      },
      {
        difficulty: 'easy',
        timeEstimate: '30-60 minutes',
        solution: 'Clean radiator fins with compressed air and water. Work from inside out.',
        tools: ['Compressed Air', 'Garden Hose', 'Fin Comb'],
        cost: '$0-20'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30-45 minutes',
        solution: 'Replace fan belt. Check all pulleys for alignment and damage.',
        tools: ['Socket Set', 'Belt Tension Gauge'],
        parts: ['Fan Belt'],
        cost: '$20-60'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace thermostat. Always replace gasket as well.',
        tools: ['Socket Set', 'Scraper', 'RTV Sealant'],
        parts: ['Thermostat', 'Gasket'],
        cost: '$30-80'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Replace water pump. Drain cooling system first.',
        tools: ['Socket Set', 'Pulley Puller', 'Gasket Scraper'],
        parts: ['Water Pump', 'Gasket', 'Coolant'],
        cost: '$150-400'
      }
    ],
    preventiveMeasures: [
      'Check coolant level weekly',
      'Clean radiator monthly',
      'Replace coolant every 2 years',
      'Inspect belts and hoses quarterly',
      'Do not exceed generator rated load'
    ],
    relatedCodes: ['K-24', 'K-26', 'K-30', 'K-31'],
    safetyWarnings: [
      'NEVER open radiator cap when hot',
      'Hot coolant can cause severe burns',
      'Allow engine to cool before checking',
      'Coolant is toxic - dispose properly'
    ],
    whenToCallExpert: 'If head gasket failure suspected, or unable to diagnose cause'
  },
  // ===== VOLVO PENTA ERROR CODES =====
  {
    code: 'VP-MID128-SID21',
    brand: 'Volvo Penta',
    category: 'Engine Management',
    severity: 'critical',
    title: 'Fuel Injection Timing Error',
    description: 'The fuel injection timing is out of specification. This affects performance, emissions, and can cause engine damage.',
    symptoms: [
      'Rough engine running',
      'Black or white smoke',
      'Loss of power',
      'Hard starting',
      'Increased fuel consumption',
      'Engine knocking'
    ],
    causes: [
      'Timing sensor failure',
      'Timing belt/chain jumped',
      'ECU calibration error',
      'Damaged injection pump',
      'Worn timing components'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Read timing values with diagnostic software',
        expectedResult: 'Within manufacturer specification',
        tools: ['Volvo VODIA Diagnostic Software', 'Laptop']
      },
      {
        step: 2,
        action: 'Check timing marks alignment',
        expectedResult: 'All marks aligned at TDC',
        tools: ['Timing Light', 'TDC Tools']
      },
      {
        step: 3,
        action: 'Inspect timing belt/chain for damage or stretch',
        expectedResult: 'No visible wear, correct tension',
        tools: ['Flashlight', 'Belt Tension Gauge']
      }
    ],
    solutions: [
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Recalibrate injection timing using diagnostic software.',
        tools: ['Volvo VODIA', 'Laptop'],
        cost: '$100-200 (software access)'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '4-8 hours',
        solution: 'Replace timing belt and set to correct marks.',
        tools: ['Timing Tool Kit', 'Torque Wrench'],
        parts: ['Timing Belt Kit', 'Tensioner', 'Idler Pulleys'],
        cost: '$300-600'
      },
      {
        difficulty: 'expert',
        timeEstimate: '8-16 hours',
        solution: 'Injection pump replacement and timing.',
        tools: ['Specialized Tools', 'Diagnostic Software'],
        parts: ['Injection Pump'],
        cost: '$1,500-4,000'
      }
    ],
    preventiveMeasures: [
      'Replace timing belt at recommended intervals',
      'Use quality diesel fuel',
      'Regular fuel filter changes',
      'Annual timing check',
      'Keep engine clean'
    ],
    relatedCodes: ['VP-MID128-SID22', 'VP-MID128-SID23'],
    safetyWarnings: [
      'Incorrect timing can damage pistons and valves',
      'Do not attempt timing work without proper tools',
      'Engine damage can result from improper adjustment'
    ],
    whenToCallExpert: 'Unless you have specific timing tools and experience'
  },
  // ===== MTU ERROR CODES =====
  {
    code: 'MTU-0115',
    brand: 'MTU',
    category: 'Engine Speed',
    severity: 'critical',
    title: 'Crankshaft Speed Sensor - Signal Lost',
    description: 'No valid signal from crankshaft position sensor. Engine will not start or will shut down immediately.',
    symptoms: [
      'Engine does not start',
      'Engine stalls immediately',
      'No tachometer reading',
      'Check engine light'
    ],
    causes: [
      'Sensor failure',
      'Wiring damage',
      'Connector corrosion',
      'Air gap incorrect',
      'Tone wheel damage'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure sensor resistance',
        expectedResult: '500-1500 ohms (check manual)',
        tools: ['Digital Multimeter']
      },
      {
        step: 2,
        action: 'Check sensor air gap',
        expectedResult: '0.5-1.0mm',
        tools: ['Feeler Gauge']
      },
      {
        step: 3,
        action: 'Inspect wiring and connectors',
        expectedResult: 'No damage, good connections',
        tools: ['Multimeter', 'Visual Inspection']
      }
    ],
    solutions: [
      {
        difficulty: 'moderate',
        timeEstimate: '1 hour',
        solution: 'Replace crankshaft position sensor.',
        tools: ['Socket Set'],
        parts: ['Crankshaft Position Sensor'],
        cost: '$100-300'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30 minutes',
        solution: 'Adjust sensor air gap to specification.',
        tools: ['Feeler Gauge', 'Socket Set'],
        cost: '$0'
      }
    ],
    preventiveMeasures: [
      'Regular inspection of sensors',
      'Keep engine compartment clean',
      'Check connections during service'
    ],
    relatedCodes: ['MTU-0116', 'MTU-0117'],
    safetyWarnings: [
      'Engine may start unexpectedly',
      'Use proper lockout procedures'
    ],
    whenToCallExpert: 'If unable to diagnose or sensor replacement fails'
  },
  // ===== GENERIC/UNIVERSAL CODES =====
  {
    code: 'GEN-001',
    brand: 'Universal',
    category: 'Starting System',
    severity: 'warning',
    title: 'Generator Fails to Crank',
    description: 'The starter motor does not engage or turn when start command is given. Generator cannot be started.',
    symptoms: [
      'No sound when start button pressed',
      'Clicking sound only',
      'Slow cranking',
      'Starter engages but engine doesn\'t turn'
    ],
    causes: [
      'Dead or weak batteries',
      'Loose or corroded battery connections',
      'Failed starter motor',
      'Faulty starter solenoid',
      'Broken start circuit wiring',
      'Failed start relay',
      'Safety interlock activated'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Measure battery voltage',
        expectedResult: '>12.4V for 12V system, >24.8V for 24V system',
        tools: ['Digital Multimeter']
      },
      {
        step: 2,
        action: 'Load test batteries',
        expectedResult: 'Voltage stays above 9.6V under load',
        tools: ['Battery Load Tester']
      },
      {
        step: 3,
        action: 'Check battery cable connections',
        expectedResult: 'Clean, tight, no corrosion',
        tools: ['Wrench Set', 'Wire Brush']
      },
      {
        step: 4,
        action: 'Test starter solenoid with direct power',
        expectedResult: 'Starter engages when 12V/24V applied to solenoid',
        tools: ['Jumper Wire', 'Safety Glasses']
      },
      {
        step: 5,
        action: 'Check safety interlocks',
        expectedResult: 'All safety switches in correct position',
        tools: ['Multimeter', 'Wiring Diagram']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15 minutes',
        solution: 'Charge or jump-start batteries. Clean terminals.',
        tools: ['Battery Charger', 'Wire Brush', 'Wrench'],
        cost: '$0-30'
      },
      {
        difficulty: 'easy',
        timeEstimate: '30 minutes',
        solution: 'Replace battery cables if corroded or damaged.',
        tools: ['Wrench Set', 'Crimping Tool'],
        parts: ['Battery Cables'],
        cost: '$30-100'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace batteries. Use correct CCA rating for generator.',
        tools: ['Wrench Set', 'Battery Carrier'],
        parts: ['Batteries'],
        cost: '$150-400'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Replace starter motor.',
        tools: ['Socket Set', 'Pry Bar'],
        parts: ['Starter Motor'],
        cost: '$200-600'
      }
    ],
    preventiveMeasures: [
      'Monthly battery inspection',
      'Keep terminals clean and protected',
      'Test batteries annually',
      'Run generator monthly minimum',
      'Replace batteries every 3-5 years'
    ],
    relatedCodes: ['GEN-002', 'GEN-003', 'GEN-010'],
    safetyWarnings: [
      'Batteries contain acid',
      'Risk of sparks and explosion',
      'Remove jewelry when working on batteries',
      'Keep fire away from battery area'
    ],
    whenToCallExpert: 'If starter motor replacement is needed and uncomfortable with the work'
  },
  {
    code: 'GEN-002',
    brand: 'Universal',
    category: 'Starting System',
    severity: 'warning',
    title: 'Engine Cranks But Fails to Start',
    description: 'The starter motor turns the engine, but the engine does not start and run on its own.',
    symptoms: [
      'Engine turns over normally',
      'No exhaust smoke',
      'No firing',
      'Engine may fire briefly then die'
    ],
    causes: [
      'No fuel reaching injectors',
      'Air in fuel system',
      'Fuel filter blocked',
      'Fuel solenoid not energizing',
      'Glow plugs not working (cold weather)',
      'Injection pump failure',
      'Low compression'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check fuel level and valve position',
        expectedResult: 'Adequate fuel, valve open',
        tools: ['Visual Inspection']
      },
      {
        step: 2,
        action: 'Bleed fuel system at filter and injectors',
        expectedResult: 'Fuel flows freely with no air bubbles',
        tools: ['Bleed Screw Wrench', 'Container']
      },
      {
        step: 3,
        action: 'Check fuel solenoid operation',
        expectedResult: 'Click heard when key turned on, 12V at solenoid',
        tools: ['Multimeter']
      },
      {
        step: 4,
        action: 'Test glow plug circuit (if equipped)',
        expectedResult: 'Glow plugs draw current, get hot',
        tools: ['Clamp Ammeter', 'Multimeter']
      },
      {
        step: 5,
        action: 'Perform compression test',
        expectedResult: '>300 PSI, within 10% between cylinders',
        tools: ['Compression Tester']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        solution: 'Bleed air from fuel system. Loosen injector lines, crank until fuel appears.',
        tools: ['Wrenches', 'Rags'],
        cost: '$0'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30-45 minutes',
        solution: 'Replace fuel filter. Pre-fill new filter with clean diesel.',
        tools: ['Filter Wrench', 'Drain Pan'],
        parts: ['Fuel Filter'],
        cost: '$20-60'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace fuel solenoid. Test new solenoid before installation.',
        tools: ['Wrench Set'],
        parts: ['Fuel Solenoid'],
        cost: '$50-150'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-3 hours',
        solution: 'Replace glow plugs. Check each plug with ohmmeter.',
        tools: ['Glow Plug Socket', 'Torque Wrench'],
        parts: ['Glow Plugs'],
        cost: '$50-200'
      }
    ],
    preventiveMeasures: [
      'Replace fuel filter per schedule',
      'Keep fuel tank above 1/4 full',
      'Use quality diesel fuel',
      'Test glow plugs annually',
      'Drain water separator regularly'
    ],
    relatedCodes: ['GEN-001', 'GEN-003', 'GEN-020'],
    safetyWarnings: [
      'Diesel fuel is flammable',
      'Clean spills immediately',
      'Avoid breathing fuel vapors',
      'No smoking near fuel system'
    ],
    whenToCallExpert: 'If low compression found, or injection pump suspected'
  },
  {
    code: 'GEN-050',
    brand: 'Universal',
    category: 'Output/Load',
    severity: 'critical',
    title: 'No Output Voltage',
    description: 'The generator is running but producing no electrical output. All connected loads have no power.',
    symptoms: [
      'Generator runs normally',
      'No voltage at output terminals',
      'Voltmeter shows 0V',
      'All loads dead'
    ],
    causes: [
      'AVR failure',
      'Loss of residual magnetism',
      'Open circuit breaker',
      'Rotor or stator failure',
      'Brush failure',
      'Excitation circuit open'
    ],
    diagnosticSteps: [
      {
        step: 1,
        action: 'Check main circuit breaker position',
        expectedResult: 'Circuit breaker ON/closed',
        tools: ['Visual Inspection']
      },
      {
        step: 2,
        action: 'Measure voltage at generator terminals (before breaker)',
        expectedResult: 'Should show rated voltage if alternator working',
        tools: ['Digital Multimeter']
      },
      {
        step: 3,
        action: 'Check excitation voltage from AVR',
        expectedResult: '5-10V DC at field terminals',
        tools: ['Multimeter']
      },
      {
        step: 4,
        action: 'Inspect brushes and slip rings',
        expectedResult: 'Good brush length, clean slip rings',
        tools: ['Flashlight', 'Brush Inspection']
      },
      {
        step: 5,
        action: 'Test for residual magnetism (spin without AVR)',
        expectedResult: 'Small voltage (2-5V) should appear',
        tools: ['Multimeter']
      }
    ],
    solutions: [
      {
        difficulty: 'easy',
        timeEstimate: '5 minutes',
        solution: 'Reset circuit breaker. If it trips again, investigate overload.',
        tools: ['None'],
        cost: '$0'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '30 minutes',
        solution: 'Flash field with 12V battery to restore residual magnetism.',
        tools: ['12V Battery', 'Jumper Wires'],
        cost: '$0'
      },
      {
        difficulty: 'moderate',
        timeEstimate: '1-2 hours',
        solution: 'Replace brushes. Match size and material.',
        tools: ['Screwdrivers', 'Soldering Iron'],
        parts: ['Brush Set'],
        cost: '$30-100'
      },
      {
        difficulty: 'advanced',
        timeEstimate: '2-4 hours',
        solution: 'Replace AVR. Match part number or compatible replacement.',
        tools: ['Screwdrivers', 'Wire Crimpers'],
        parts: ['AVR'],
        cost: '$150-500'
      }
    ],
    preventiveMeasures: [
      'Run generator under load monthly',
      'Annual brush inspection',
      'Keep AVR connections clean',
      'Protect from moisture',
      'Do not overload generator'
    ],
    relatedCodes: ['GEN-051', 'GEN-052', 'GEN-060'],
    safetyWarnings: [
      'HIGH VOLTAGE - use extreme caution',
      'Disconnect loads before testing',
      'Do not touch rotating parts',
      'Use insulated tools only'
    ],
    whenToCallExpert: 'If rotor or stator failure suspected'
  }
];

// =====================================================
// COMBINED ERROR CODE DATABASE - 13,500+ CODES
// =====================================================

// Convert comprehensive error codes from JSON
function convertComprehensiveCode(code: any): ErrorCode {
  return {
    code: code.code || code.errorCode || '',
    brand: code.brand || code.manufacturer || 'Universal',
    category: code.category || code.system || 'General',
    severity: (code.severity || 'warning') as ErrorCode['severity'],
    title: code.title || code.name || code.description?.substring(0, 50) || 'Unknown Error',
    description: code.description || code.details || '',
    symptoms: code.symptoms || code.indicators || [],
    causes: code.causes || code.possibleCauses || [],
    diagnosticSteps: (code.diagnosticSteps || code.troubleshooting || []).map((step: any, idx: number) => ({
      step: step.step || idx + 1,
      action: step.action || step.instruction || step,
      expectedResult: step.expectedResult || step.expected || 'Check result',
      tools: step.tools || []
    })),
    solutions: (code.solutions || code.fixes || []).map((sol: any) => ({
      difficulty: (sol.difficulty || 'moderate') as 'easy' | 'moderate' | 'advanced' | 'expert',
      timeEstimate: sol.timeEstimate || sol.time || '1-2 hours',
      solution: sol.solution || sol.description || sol,
      tools: sol.tools || [],
      parts: sol.parts || [],
      cost: sol.cost || 'Varies'
    })),
    preventiveMeasures: code.preventiveMeasures || code.prevention || [],
    relatedCodes: code.relatedCodes || [],
    safetyWarnings: code.safetyWarnings || code.warnings || [],
    whenToCallExpert: code.whenToCallExpert || code.expertAdvice || 'If issue persists after basic troubleshooting'
  };
}

// Convert WordPress fault codes to standard format
function convertWordPressCode(wpCode: WordPressFaultCode): ErrorCode {
  return {
    code: wpCode.code,
    brand: wpCode.brand,
    category: wpCode.category,
    severity: wpCode.severity === 'critical' ? 'critical' : wpCode.severity === 'warning' ? 'warning' : 'info',
    title: wpCode.title,
    description: wpCode.description,
    symptoms: wpCode.symptoms || [],
    causes: wpCode.causes || [],
    diagnosticSteps: (wpCode.diagnosticSteps || []).map((step, idx) => ({
      step: step.step || idx + 1,
      action: step.action,
      expectedResult: step.expectedResult,
      tools: step.tools || []
    })),
    solutions: (wpCode.solutions || []).map(sol => ({
      difficulty: sol.difficulty,
      timeEstimate: sol.timeEstimate,
      solution: sol.solution,
      tools: sol.tools || [],
      parts: sol.parts || [],
      cost: sol.cost || 'Varies'
    })),
    preventiveMeasures: wpCode.preventiveMeasures || [],
    relatedCodes: wpCode.relatedCodes || [],
    safetyWarnings: wpCode.safetyWarnings || [],
    whenToCallExpert: wpCode.whenToCallExpert || 'If issue persists'
  };
}

// Combine all error code sources into one comprehensive database
const comprehensiveCodes: ErrorCode[] = (comprehensiveErrorCodes as any[]).map(convertComprehensiveCode);
const wordPressCodes: ErrorCode[] = WORDPRESS_FAULT_CODES.map(convertWordPressCode);

// Create unified error code database - deduplicate by code+brand
const codeMap = new Map<string, ErrorCode>();

// Add base codes first
GENERATOR_ERROR_CODES.forEach(code => {
  const key = `${code.brand}-${code.code}`.toLowerCase();
  codeMap.set(key, code);
});

// Add comprehensive codes
comprehensiveCodes.forEach(code => {
  const key = `${code.brand}-${code.code}`.toLowerCase();
  if (!codeMap.has(key)) {
    codeMap.set(key, code);
  }
});

// Add WordPress codes
wordPressCodes.forEach(code => {
  const key = `${code.brand}-${code.code}`.toLowerCase();
  if (!codeMap.has(key)) {
    codeMap.set(key, code);
  }
});

// Export the complete unified database
export const ALL_ERROR_CODES: ErrorCode[] = Array.from(codeMap.values());

// Total count for display
export const TOTAL_ERROR_CODES = ALL_ERROR_CODES.length;

// =====================================================
// SEARCH FUNCTIONS - Search through ALL 13,500+ codes
// =====================================================

// Search function for error codes - searches ALL databases
// Made robust against null/undefined values to prevent runtime errors
export function searchErrorCodes(query: string): ErrorCode[] {
  if (!query) return [];

  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return [];

  return ALL_ERROR_CODES.filter(code => {
    try {
      // Safely check each field with null guards
      const codeMatch = code.code?.toLowerCase()?.includes(lowerQuery) ?? false;
      const titleMatch = code.title?.toLowerCase()?.includes(lowerQuery) ?? false;
      const descMatch = code.description?.toLowerCase()?.includes(lowerQuery) ?? false;
      const brandMatch = code.brand?.toLowerCase()?.includes(lowerQuery) ?? false;
      const categoryMatch = code.category?.toLowerCase()?.includes(lowerQuery) ?? false;
      const symptomMatch = code.symptoms?.some(s => s?.toLowerCase()?.includes(lowerQuery)) ?? false;
      const causeMatch = code.causes?.some(c => c?.toLowerCase()?.includes(lowerQuery)) ?? false;

      return codeMatch || titleMatch || descMatch || brandMatch || categoryMatch || symptomMatch || causeMatch;
    } catch (error) {
      // If any field causes an error, skip this code but don't crash
      console.warn('Error searching code:', code?.code, error);
      return false;
    }
  });
}

// Get codes by brand - searches ALL databases
export function getCodesByBrand(brand: string): ErrorCode[] {
  if (brand.toLowerCase() === 'all') {
    return ALL_ERROR_CODES;
  }
  return ALL_ERROR_CODES.filter(code =>
    code.brand.toLowerCase() === brand.toLowerCase()
  );
}

// Get codes by severity - searches ALL databases
export function getCodesBySeverity(severity: ErrorCode['severity']): ErrorCode[] {
  return ALL_ERROR_CODES.filter(code => code.severity === severity);
}

// Get code by exact code and brand
export function getExactCode(codeString: string, brand?: string): ErrorCode | undefined {
  const lowerCode = codeString.toLowerCase();
  return ALL_ERROR_CODES.find(code => {
    const codeMatch = code.code.toLowerCase() === lowerCode;
    if (brand) {
      return codeMatch && code.brand.toLowerCase() === brand.toLowerCase();
    }
    return codeMatch;
  });
}

// Get all unique brands
export function getAllBrands(): string[] {
  const brands = new Set(ALL_ERROR_CODES.map(code => code.brand));
  return Array.from(brands).sort();
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set(ALL_ERROR_CODES.map(code => code.category));
  return Array.from(categories).sort();
}

// Predictive maintenance calculator
export function calculatePredictiveMaintenance(
  runHours: number,
  lastServiceHours: number,
  lastServiceDate: Date,
  loadFactor: number // 0-1
): PredictiveMaintenance[] {
  const hoursSinceService = runHours - lastServiceHours;
  const daysSinceService = Math.floor((Date.now() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const predictions: PredictiveMaintenance[] = [
    {
      component: 'Engine Oil',
      currentHealth: Math.max(0, 100 - (hoursSinceService / 250 * 100)),
      predictedFailure: hoursSinceService > 200 ? 'Immediate service recommended' : `In ${250 - hoursSinceService} hours`,
      recommendations: hoursSinceService > 200 
        ? ['Change oil immediately', 'Replace oil filter', 'Check for contamination']
        : ['Continue monitoring', 'Plan service at 250 hours'],
      priority: hoursSinceService > 200 ? 'high' : hoursSinceService > 150 ? 'medium' : 'low'
    },
    {
      component: 'Fuel Filter',
      currentHealth: Math.max(0, 100 - (hoursSinceService / 500 * 100)),
      predictedFailure: hoursSinceService > 400 ? 'Service soon' : `In ${500 - hoursSinceService} hours`,
      recommendations: hoursSinceService > 400 
        ? ['Replace fuel filter', 'Drain water separator', 'Check fuel quality']
        : ['Monitor fuel quality', 'Check water separator weekly'],
      priority: hoursSinceService > 400 ? 'high' : hoursSinceService > 300 ? 'medium' : 'low'
    },
    {
      component: 'Air Filter',
      currentHealth: Math.max(0, 100 - (hoursSinceService / 500 * 100 * (loadFactor + 0.5))),
      predictedFailure: 'Check condition visually',
      recommendations: ['Inspect air filter', 'Clean or replace if dirty', 'Check intake ducting'],
      priority: loadFactor > 0.7 ? 'medium' : 'low'
    },
    {
      component: 'Coolant System',
      currentHealth: Math.max(0, 100 - (daysSinceService / 730 * 100)),
      predictedFailure: daysSinceService > 600 ? 'Service recommended' : `In ${730 - daysSinceService} days`,
      recommendations: daysSinceService > 600 
        ? ['Flush cooling system', 'Replace coolant', 'Inspect hoses and clamps']
        : ['Check coolant level weekly', 'Test antifreeze concentration'],
      priority: daysSinceService > 600 ? 'high' : daysSinceService > 400 ? 'medium' : 'low'
    },
    {
      component: 'Battery System',
      currentHealth: Math.max(0, 100 - (daysSinceService / 1095 * 100)),
      predictedFailure: daysSinceService > 900 ? 'Monitor closely' : 'Healthy',
      recommendations: ['Test battery voltage monthly', 'Clean terminals', 'Check electrolyte levels'],
      priority: daysSinceService > 900 ? 'medium' : 'low'
    },
    {
      component: 'Belts & Hoses',
      currentHealth: Math.max(0, 100 - (hoursSinceService / 2000 * 100)),
      predictedFailure: hoursSinceService > 1500 ? 'Inspection required' : 'Healthy',
      recommendations: hoursSinceService > 1500 
        ? ['Replace belts preventively', 'Inspect all hoses', 'Check for cracks and wear']
        : ['Visual inspection quarterly'],
      priority: hoursSinceService > 1500 ? 'medium' : 'low'
    }
  ];
  
  return predictions;
}

// Tool database
export const DIAGNOSTIC_TOOLS = {
  basic: [
    { name: 'Digital Multimeter', purpose: 'Voltage, current, resistance testing', price: '$30-150' },
    { name: 'Socket Set (Metric & Imperial)', purpose: 'General mechanical work', price: '$50-200' },
    { name: 'Torque Wrench', purpose: 'Precise bolt tightening', price: '$40-150' },
    { name: 'Flashlight', purpose: 'Inspection in dark areas', price: '$15-50' },
    { name: 'Wire Brush', purpose: 'Cleaning terminals and connections', price: '$5-15' },
    { name: 'Contact Cleaner', purpose: 'Electrical connector cleaning', price: '$10-20' }
  ],
  intermediate: [
    { name: 'Clamp Ammeter', purpose: 'Current measurement without circuit break', price: '$50-200' },
    { name: 'Compression Tester', purpose: 'Engine health check', price: '$30-100' },
    { name: 'Battery Load Tester', purpose: 'Battery condition testing', price: '$40-150' },
    { name: 'Timing Light', purpose: 'Injection/ignition timing check', price: '$40-100' },
    { name: 'Infrared Thermometer', purpose: 'Temperature measurement', price: '$20-80' },
    { name: 'Oil Pressure Gauge', purpose: 'Mechanical oil pressure testing', price: '$30-80' }
  ],
  advanced: [
    { name: 'Diagnostic Scanner', purpose: 'Reading and clearing fault codes', price: '$200-2000' },
    { name: 'Oscilloscope', purpose: 'Waveform analysis', price: '$300-1500' },
    { name: 'Power Quality Analyzer', purpose: 'Voltage, frequency, harmonics analysis', price: '$500-3000' },
    { name: 'Insulation Tester (Megger)', purpose: 'Winding insulation testing', price: '$200-800' },
    { name: 'Fuel Injection Tester', purpose: 'Injector testing and cleaning', price: '$200-600' }
  ],
  specialized: [
    { name: 'Cummins INSITE', purpose: 'Cummins engine diagnostics', price: '$2000+/year' },
    { name: 'CAT ET (Electronic Technician)', purpose: 'Caterpillar diagnostics', price: '$2500+/year' },
    { name: 'Volvo VODIA', purpose: 'Volvo Penta diagnostics', price: '$1500+/year' },
    { name: 'Perkins EST', purpose: 'Perkins engine diagnostics', price: '$1500+/year' }
  ]
};

// All supported brands
export const SUPPORTED_BRANDS = [
  'Cummins',
  'Caterpillar',
  'Perkins',
  'FG Wilson',
  'Kohler',
  'Volvo Penta',
  'MTU',
  'John Deere',
  'Yanmar',
  'Doosan',
  'Generac',
  'Aksa/VOLTKA',
  'Universal'
];
