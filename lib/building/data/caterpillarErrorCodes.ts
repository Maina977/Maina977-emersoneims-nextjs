/**
 * CATERPILLAR GENERATOR ERROR CODES DATABASE
 * Comprehensive fault codes for CAT diesel engines
 * Includes 3500, C-Series, and electronic controls
 * Updated: January 2026
 */

export interface CaterpillarErrorCode {
  code: string;
  spn?: number;
  fmi?: number;
  brand: 'Caterpillar';
  model?: string;
  category: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  solution: string;
  parts?: string[];
  tools?: string[];
  estimatedTime?: string;
  estimatedCost?: string;
}

export const CATERPILLAR_ERROR_CODES: CaterpillarErrorCode[] = [
  // ===== ENGINE CONTROL CODES E100-E199 =====
  {
    code: 'E100',
    brand: 'Caterpillar',
    model: 'All ADEM',
    category: 'ECM',
    severity: 'warning',
    title: 'ECM Internal Fault',
    description: 'Engine Control Module detected internal hardware or software fault.',
    symptoms: ['Check engine light', 'Diagnostic fault active', 'Possible derate'],
    causes: ['ECM failure', 'Power supply issue', 'Software corruption'],
    solution: 'Check ECM power supply. Clear codes. If persistent, ECM may need replacement.',
    parts: ['ECM module'],
    tools: ['CAT ET', 'Multimeter'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$100-$3000'
  },
  {
    code: 'E110',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Coolant Temperature',
    severity: 'critical',
    title: 'High Engine Coolant Temperature',
    description: 'Engine coolant temperature has exceeded the warning level.',
    symptoms: ['Temperature gauge high', 'Warning alarm', 'Power derate', 'Possible shutdown'],
    causes: ['Low coolant', 'Failed thermostat', 'Blocked radiator', 'Fan failure', 'Water pump issue'],
    solution: 'Reduce load immediately. Check coolant level. Inspect cooling system components.',
    parts: ['Coolant', 'Thermostat', 'Water pump', 'Fan belt'],
    tools: ['IR thermometer', 'Pressure tester'],
    estimatedTime: '1-6 hours',
    estimatedCost: '$50-$2000'
  },
  {
    code: 'E115',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Engine Speed',
    severity: 'critical',
    title: 'Engine Overspeed',
    description: 'Engine RPM exceeded maximum safe operating speed.',
    symptoms: ['High engine noise', 'Emergency shutdown', 'Overspeed alarm'],
    causes: ['Governor failure', 'Fuel system runaway', 'Load rejection'],
    solution: 'DO NOT RESTART. Inspect governor and fuel system. Professional inspection required.',
    parts: ['Governor', 'Fuel system components'],
    tools: ['CAT ET', 'Tachometer'],
    estimatedTime: '4-12 hours',
    estimatedCost: '$500-$5000'
  },
  {
    code: 'E120',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Oil Pressure',
    severity: 'emergency',
    title: 'Low Engine Oil Pressure',
    description: 'CRITICAL: Engine oil pressure below minimum safe operating level.',
    symptoms: ['Oil pressure warning', 'Engine knock', 'Shutdown'],
    causes: ['Low oil level', 'Oil pump failure', 'Blocked filter', 'Bearing wear'],
    solution: 'STOP ENGINE IMMEDIATELY. Check oil level. Inspect for leaks.',
    parts: ['Engine oil', 'Oil filter', 'Oil pump'],
    tools: ['Oil pressure gauge'],
    estimatedTime: '1-8+ hours',
    estimatedCost: '$50-$10000'
  },
  {
    code: 'E172',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Intake Air',
    severity: 'warning',
    title: 'High Intake Manifold Air Temperature',
    description: 'Intake manifold air temperature above normal operating range.',
    symptoms: ['Reduced power', 'High exhaust temps', 'Smoke'],
    causes: ['Faulty aftercooler', 'High ambient temp', 'Restricted airflow'],
    solution: 'Check aftercooler operation. Inspect air intake system.',
    parts: ['Aftercooler', 'Air filter'],
    tools: ['IR thermometer'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$100-$2000'
  },
  {
    code: 'E190',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Engine Speed',
    severity: 'critical',
    title: 'Engine Speed Sensor Signal Lost',
    description: 'ECM not receiving engine speed signal from pickup sensor.',
    symptoms: ['No start', 'Stalling', 'No RPM display'],
    causes: ['Failed sensor', 'Wiring damage', 'Gap too large'],
    solution: 'Check sensor and wiring. Adjust sensor gap. Replace if needed.',
    parts: ['Speed sensor'],
    tools: ['Multimeter', 'Feeler gauge'],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: '$50-$300'
  },
  // ===== FUEL SYSTEM CODES E200-E299 =====
  {
    code: 'E231',
    brand: 'Caterpillar',
    model: 'HEUI/Common Rail',
    category: 'Fuel Pressure',
    severity: 'critical',
    title: 'Low Fuel Rail Pressure',
    description: 'Fuel injection pressure below minimum required for proper operation.',
    symptoms: ['Low power', 'Hard starting', 'White smoke', 'Stalling'],
    causes: ['Fuel supply restriction', 'Failed pump', 'Air in system', 'Leaking injectors'],
    solution: 'Check fuel supply. Replace filters. Test high pressure pump.',
    parts: ['Fuel filters', 'High pressure pump', 'Injectors'],
    tools: ['Fuel pressure gauge', 'CAT ET'],
    estimatedTime: '1-6 hours',
    estimatedCost: '$100-$3000'
  },
  {
    code: 'E262',
    brand: 'Caterpillar',
    model: 'HEUI',
    category: 'Fuel System',
    severity: 'critical',
    title: 'HEUI Pump Pressure Problem',
    description: 'Hydraulic Electronic Unit Injector pump pressure abnormal.',
    symptoms: ['Low power', 'Rough running', 'Injector issues'],
    causes: ['Pump wear', 'Low engine oil', 'Internal pump failure'],
    solution: 'Check engine oil level. Test HEUI pump pressure. Replace if needed.',
    parts: ['HEUI pump', 'Engine oil'],
    tools: ['CAT ET', 'Pressure gauge'],
    estimatedTime: '2-8 hours',
    estimatedCost: '$500-$4000'
  },
  // ===== GENERATOR OUTPUT CODES E300-E399 =====
  {
    code: 'E360',
    brand: 'Caterpillar',
    model: 'Generator',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Voltage Regulator Fault',
    description: 'AVR not maintaining proper output voltage.',
    symptoms: ['Voltage fluctuations', 'Lights flickering', 'Equipment trips'],
    causes: ['AVR failure', 'Sensing circuit fault', 'Brush wear'],
    solution: 'Check AVR settings. Inspect brushes and slip rings. Replace AVR if faulty.',
    parts: ['AVR', 'Brushes'],
    tools: ['Multimeter', 'Oscilloscope'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$100-$1000'
  },
  {
    code: 'E361',
    brand: 'Caterpillar',
    model: 'Generator',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Under Voltage',
    description: 'Generator output voltage below minimum required.',
    symptoms: ['Low voltage', 'Motors struggling', 'Equipment not starting'],
    causes: ['AVR issue', 'Loss of excitation', 'Overload', 'Engine speed low'],
    solution: 'Check load level. Verify engine speed. Test excitation system.',
    parts: ['AVR', 'Excitation components'],
    tools: ['Multimeter'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$50-$800'
  },
  {
    code: 'E362',
    brand: 'Caterpillar',
    model: 'Generator',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Over Voltage',
    description: 'Generator output voltage exceeds safe limits.',
    symptoms: ['High voltage', 'Equipment damage risk', 'Tripping breakers'],
    causes: ['AVR malfunction', 'Speed too high', 'Sensing circuit fault'],
    solution: 'Check engine speed. Verify AVR settings. Replace AVR if needed.',
    parts: ['AVR'],
    tools: ['Multimeter', 'Tachometer'],
    estimatedTime: '1-3 hours',
    estimatedCost: '$100-$800'
  },
  {
    code: 'E363',
    brand: 'Caterpillar',
    model: 'Generator',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Over Frequency',
    description: 'Generator output frequency above safe limits.',
    symptoms: ['High frequency', 'Motors overspeeding', 'Equipment issues'],
    causes: ['Engine overspeed', 'Governor issue'],
    solution: 'Check engine speed. Adjust governor. Verify frequency settings.',
    parts: ['Governor'],
    tools: ['Frequency meter', 'Tachometer'],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: '$50-$500'
  },
  {
    code: 'E364',
    brand: 'Caterpillar',
    model: 'Generator',
    category: 'Generator Control',
    severity: 'critical',
    title: 'Generator Under Frequency',
    description: 'Generator output frequency below minimum required.',
    symptoms: ['Low frequency', 'Motors running slow', 'Equipment malfunction'],
    causes: ['Engine underspeed', 'Overload', 'Fuel issue'],
    solution: 'Reduce load. Check fuel system. Verify governor settings.',
    parts: ['Fuel system', 'Governor'],
    tools: ['Frequency meter'],
    estimatedTime: '30 min - 3 hours',
    estimatedCost: '$50-$800'
  },
  // ===== AFTERTREATMENT CODES E400-E499 =====
  {
    code: 'E438',
    brand: 'Caterpillar',
    model: 'Tier 4',
    category: 'Aftertreatment',
    severity: 'warning',
    title: 'DPF Regeneration Needed',
    description: 'Diesel Particulate Filter requires regeneration.',
    symptoms: ['DPF light on', 'Regen request', 'Possible derate'],
    causes: ['Normal soot accumulation', 'Short cycle operation', 'Failed previous regen'],
    solution: 'Perform parked regeneration. If unsuccessful, may need forced regen or cleaning.',
    parts: ['DPF cleaning'],
    tools: ['CAT ET'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$200-$2000'
  },
  {
    code: 'E439',
    brand: 'Caterpillar',
    model: 'Tier 4',
    category: 'Aftertreatment',
    severity: 'warning',
    title: 'DEF Level Low',
    description: 'Diesel Exhaust Fluid tank level low.',
    symptoms: ['DEF warning', 'Level gauge low', 'Derate warning'],
    causes: ['Normal consumption', 'DEF leak'],
    solution: 'Refill DEF tank with approved fluid.',
    parts: ['DEF fluid'],
    tools: ['None'],
    estimatedTime: '10-20 min',
    estimatedCost: '$15-$50'
  },
  // ===== COMMUNICATION CODES E500-E599 =====
  {
    code: 'E527',
    brand: 'Caterpillar',
    model: 'All ADEM',
    category: 'Communication',
    severity: 'warning',
    title: 'CAN Datalink Fault',
    description: 'Communication error on CAN network.',
    symptoms: ['Gauge issues', 'Communication errors', 'Intermittent faults'],
    causes: ['Wiring fault', 'Terminating resistor', 'Module failure'],
    solution: 'Check CAN bus wiring. Verify terminating resistors. Test modules.',
    parts: ['CAN cable', 'Terminating resistors'],
    tools: ['CAT ET', 'Multimeter'],
    estimatedTime: '1-4 hours',
    estimatedCost: '$50-$400'
  },
  {
    code: 'E539',
    brand: 'Caterpillar',
    model: 'All Electronic',
    category: 'Electrical',
    severity: 'warning',
    title: 'Low Battery Voltage',
    description: 'Battery voltage below minimum required for proper ECM operation.',
    symptoms: ['Hard starting', 'Gauge issues', 'ECM resets'],
    causes: ['Weak batteries', 'Alternator issue', 'Parasitic draw'],
    solution: 'Load test batteries. Check charging system. Inspect connections.',
    parts: ['Batteries', 'Alternator'],
    tools: ['Load tester', 'Multimeter'],
    estimatedTime: '30 min - 2 hours',
    estimatedCost: '$100-$500'
  }
];

// Export count
export const CATERPILLAR_CODE_COUNT = CATERPILLAR_ERROR_CODES.length;
