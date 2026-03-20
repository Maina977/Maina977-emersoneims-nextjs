/**
 * UPS SYSTEMS & BOREHOLE PUMPS - Technical Documentation
 * Combined file for UPS and water pumping systems
 */

import type {
  Schematic,
  WiringDiagram,
  TroubleshootingTree,
  RepairProcedure,
  Part,
  MaintenanceSchedule
} from '../technicalBible';

// ═══════════════════════════════════════════════════════════════
// UPS SYSTEMS
// ═══════════════════════════════════════════════════════════════

export const UPS_SCHEMATICS: Schematic[] = [
  {
    id: 'ups-online-block',
    serviceId: 'ac-ups',
    name: 'Online UPS Block Diagram',
    description: 'Double conversion online UPS system architecture',
    category: 'UPS Architecture',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1200, height: 600 },
    layers: [
      { id: 'power', name: 'Power Path', color: '#EF4444', visible: true },
      { id: 'bypass', name: 'Bypass Path', color: '#F59E0B', visible: true },
      { id: 'battery', name: 'Battery System', color: '#10B981', visible: true },
    ],
    components: [
      {
        id: 'rectifier',
        name: 'Rectifier/Charger',
        type: 'component',
        x: 200, y: 200, width: 120, height: 100,
        properties: { type: 'IGBT PWM', efficiency: '96%' },
        connectedTo: ['dc-bus', 'input'],
        layer: 'power',
        details: 'Converts AC to DC, charges batteries',
        specifications: {
          'Input': 'AC 380-415V 3-phase',
          'Output': 'DC Bus 540V nominal',
          'PF': '>0.99 with active correction',
          'THDi': '<3%'
        }
      },
      {
        id: 'dc-bus',
        name: 'DC Bus',
        type: 'component',
        x: 400, y: 200, width: 100, height: 100,
        properties: { voltage: '540V DC', capacitor: 'Yes' },
        connectedTo: ['rectifier', 'inverter', 'battery'],
        layer: 'power',
        details: 'DC link between rectifier and inverter',
        specifications: { 'Nominal Voltage': '540V DC', 'Capacitors': 'Electrolytic bank' }
      },
      {
        id: 'inverter',
        name: 'Inverter',
        type: 'component',
        x: 600, y: 200, width: 120, height: 100,
        properties: { type: 'IGBT PWM', frequency: '50Hz' },
        connectedTo: ['dc-bus', 'output'],
        layer: 'power',
        details: 'Converts DC to clean AC output',
        specifications: {
          'Input': 'DC Bus 540V',
          'Output': 'AC 400V 3-phase',
          'Frequency': '50Hz ±0.1%',
          'THDv': '<2% linear load',
          'Efficiency': '97%'
        }
      },
      {
        id: 'static-bypass',
        name: 'Static Bypass',
        type: 'component',
        x: 600, y: 50, width: 120, height: 60,
        properties: { type: 'SCR', transfer: '<4ms' },
        connectedTo: ['input', 'output'],
        layer: 'bypass',
        details: 'Fast transfer to mains on overload or fault',
        specifications: { 'Transfer Time': '<4ms', 'Type': 'SCR (thyristor)' }
      },
      {
        id: 'battery-bank',
        name: 'Battery Bank',
        type: 'component',
        x: 400, y: 400, width: 200, height: 80,
        properties: { type: 'VRLA', voltage: '±192V', ah: 'Per runtime' },
        connectedTo: ['dc-bus'],
        layer: 'battery',
        details: 'Sealed lead-acid or lithium battery bank',
        specifications: {
          'Type': 'VRLA AGM or Lithium',
          'String': '32 × 12V in series',
          'Runtime': 'Based on Ah rating',
          'Recharge': '90% in 4 hours'
        }
      }
    ],
    notes: [
      'Online UPS provides zero transfer time - load always on inverter',
      'Double conversion: AC→DC→AC provides isolation from mains',
      'Battery runtime depends on load and Ah capacity'
    ],
    relatedDiagrams: ['ups-battery-wiring', 'ups-bypass-detail'],
    lastUpdated: '2026-03-01'
  }
];

export const UPS_WIRING: WiringDiagram[] = [
  {
    id: 'ups-3phase-install',
    serviceId: 'ac-ups',
    name: '3-Phase UPS Installation Wiring',
    description: 'Complete wiring for 3-phase online UPS installation',
    category: 'UPS Installation',
    wires: [
      {
        id: 'ups-in-l1',
        from: 'Main DB',
        to: 'UPS Input L1',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: 'Per UPS kVA',
        type: 'XLPE/SWA',
        function: 'Input Phase L1',
        maxCurrent: 'UPS rating × 1.25',
        voltage: '400V'
      },
      {
        id: 'ups-in-l2',
        from: 'Main DB',
        to: 'UPS Input L2',
        color: '#000000',
        colorName: 'Black',
        gauge: 'Per UPS kVA',
        type: 'XLPE/SWA',
        function: 'Input Phase L2',
        maxCurrent: 'UPS rating × 1.25',
        voltage: '400V'
      },
      {
        id: 'ups-in-l3',
        from: 'Main DB',
        to: 'UPS Input L3',
        color: '#808080',
        colorName: 'Grey',
        gauge: 'Per UPS kVA',
        function: 'Input Phase L3',
        maxCurrent: 'UPS rating × 1.25',
        voltage: '400V',
        type: 'XLPE/SWA'
      },
      {
        id: 'ups-in-n',
        from: 'Main DB',
        to: 'UPS Input N',
        color: '#0000FF',
        colorName: 'Blue',
        gauge: 'Same as phase',
        type: 'XLPE/SWA',
        function: 'Input Neutral',
        maxCurrent: 'As phase',
        voltage: '0V'
      },
      {
        id: 'ups-out-l1',
        from: 'UPS Output L1',
        to: 'Critical Load DB',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: 'Per load',
        type: 'XLPE/SWA',
        function: 'Output Phase L1',
        maxCurrent: 'UPS rating',
        voltage: '400V'
      },
      {
        id: 'ups-batt-pos',
        from: 'UPS Battery +',
        to: 'Battery String +',
        color: '#FF0000',
        colorName: 'Red',
        gauge: 'Per runtime calc',
        type: 'Flexible welding cable',
        function: 'Battery Positive',
        maxCurrent: 'UPS DC current',
        voltage: '+192V DC typical'
      },
      {
        id: 'ups-batt-neg',
        from: 'UPS Battery -',
        to: 'Battery String -',
        color: '#000000',
        colorName: 'Black',
        gauge: 'Per runtime calc',
        type: 'Flexible welding cable',
        function: 'Battery Negative',
        maxCurrent: 'UPS DC current',
        voltage: '-192V DC typical'
      }
    ],
    terminals: [
      { id: 'ups-in', name: 'UPS Input Terminal', x: 100, y: 100, type: 'Busbar' },
      { id: 'ups-out', name: 'UPS Output Terminal', x: 700, y: 100, type: 'Busbar' },
      { id: 'batt-term', name: 'Battery Terminal', x: 400, y: 400, type: 'Lug' }
    ],
    annotations: [
      { x: 400, y: 50, text: 'Use maintenance bypass for safe UPS maintenance' },
      { x: 400, y: 480, text: 'Battery cables must be fused at battery end' }
    ],
    safetyNotes: [
      'DANGER: UPS output is LIVE even when mains is OFF',
      'DANGER: Battery bank can deliver lethal current',
      'Always use maintenance bypass before internal work',
      'Battery acid is corrosive - wear PPE',
      'High DC voltage across battery string'
    ],
    testPoints: [
      { id: 'mains-v', name: 'Input Voltage', expectedValue: '400V ±10%', procedure: 'Measure at UPS input' },
      { id: 'output-v', name: 'Output Voltage', expectedValue: '400V ±1%', procedure: 'Measure at UPS output' },
      { id: 'batt-v', name: 'Battery Voltage', expectedValue: 'Per string config', procedure: 'Measure total string voltage' },
      { id: 'load-pct', name: 'Load Percentage', expectedValue: '<80% for efficiency', procedure: 'Read from UPS display' }
    ]
  },
  {
    id: 'ups-battery-string',
    serviceId: 'ac-ups',
    name: 'UPS Battery String Wiring',
    description: 'Series connection of batteries for UPS',
    category: 'Battery Systems',
    wires: [
      {
        id: 'batt-series',
        from: 'Battery 1 +',
        to: 'Battery 2 -',
        color: '#FF0000',
        colorName: 'Red (+) / Black (-)',
        gauge: 'Per discharge current',
        type: 'Flexible battery cable',
        function: 'Series interconnection',
        maxCurrent: 'UPS DC current',
        voltage: '12V per connection'
      }
    ],
    terminals: [],
    annotations: [
      { x: 200, y: 50, text: 'Connect batteries in series: + to - to + to -' },
      { x: 200, y: 100, text: '32 × 12V batteries = 384V string' },
      { x: 200, y: 150, text: 'For ±192V: Two 16-battery strings with center tap to UPS' }
    ],
    safetyNotes: [
      'Total string voltage can exceed 400V DC - lethal',
      'Fuse battery string at battery end',
      'Use insulated tools only',
      'Never short circuit battery terminals'
    ],
    testPoints: [
      { id: 'cell-v', name: 'Individual Battery Voltage', expectedValue: '12.6-13.2V (float)', procedure: 'Measure each battery' },
      { id: 'string-v', name: 'Total String Voltage', expectedValue: 'n × 13.6V (float)', procedure: 'Measure end to end' }
    ]
  }
];

export const UPS_TROUBLESHOOTING: TroubleshootingTree[] = [
  {
    id: 'ups-on-bypass',
    serviceId: 'ac-ups',
    name: 'UPS Running on Bypass',
    description: 'UPS has transferred to bypass and not returning to inverter',
    category: 'UPS Operation',
    severity: 'warning',
    initialSymptom: 'UPS display shows "On Bypass" - load unprotected',
    estimatedTime: '15-45 minutes',
    nodes: [
      { id: 'start', question: 'Is there an alarm/fault code displayed?', yesNode: 'check-alarm', noNode: 'no-alarm' },
      { id: 'check-alarm', solution: 'Note the alarm code and refer to manufacturer manual. Common codes: overload, over temperature, inverter fault, DC bus fault.', severity: 'warning', tools: ['UPS manual'] },
      { id: 'no-alarm', question: 'Is the load within UPS capacity (<80% recommended)?', yesNode: 'load-ok', noNode: 'overloaded' },
      { id: 'overloaded', solution: 'UPS transferred due to overload. Reduce load or upgrade UPS. Check for sudden load increases like motor starts.', severity: 'warning', tools: ['Clamp meter'] },
      { id: 'load-ok', question: 'Is the UPS room temperature within spec (<25°C)?', yesNode: 'temp-ok', noNext: 'overtemp' },
      { id: 'overtemp', solution: 'UPS de-rated due to high temperature. Improve room cooling. Check UPS fans are running. Clean dust from heatsinks.', severity: 'warning', tools: ['Thermometer'] },
      { id: 'temp-ok', question: 'Try to manually return to inverter - does it succeed?', yesNode: 'intermittent', noNode: 'inverter-fault' },
      { id: 'intermittent', solution: 'Possible intermittent fault. Monitor closely, check event logs for pattern. May be input voltage excursions.', severity: 'info' },
      { id: 'inverter-fault', solution: 'Inverter fault preventing return to online mode. Check for blown fuses, failed IGBTs. Contact manufacturer support.', severity: 'critical', tools: ['Multimeter'], timeEstimate: 'Specialist required' }
    ]
  },
  {
    id: 'ups-battery-fail',
    serviceId: 'ac-ups',
    name: 'UPS Battery Fault',
    description: 'Battery alarm or short runtime',
    category: 'Battery',
    severity: 'critical',
    initialSymptom: 'Battery fault alarm or very short backup time',
    estimatedTime: '30-60 minutes',
    nodes: [
      { id: 'start', question: 'How old are the batteries?', yesNode: 'check-age', noNode: 'check-age' },
      { id: 'check-age', question: 'Are batteries >3-4 years old?', yesNode: 'end-of-life', noNode: 'not-age' },
      { id: 'end-of-life', solution: 'Batteries likely at end of life. VRLA batteries last 3-5 years. Replace entire battery set.', severity: 'critical', partsList: ['Battery set'], timeEstimate: '2-4 hours' },
      { id: 'not-age', question: 'Measure individual battery voltages - any significantly low (<11V)?', yesNode: 'weak-battery', noNode: 'all-ok' },
      { id: 'weak-battery', solution: 'One or more weak batteries pulling down the string. Replace failed batteries. Consider replacing all if multiple failures.', severity: 'critical', tools: ['Multimeter'], partsList: ['Replacement batteries'] },
      { id: 'all-ok', question: 'Check battery connections - any loose or corroded?', yesNode: 'connection-fault', noNode: 'charger-check' },
      { id: 'connection-fault', solution: 'Clean and tighten all battery connections. Apply corrosion inhibitor. Check battery cable crimps.', severity: 'warning', tools: ['Torque wrench', 'Wire brush'] },
      { id: 'charger-check', solution: 'Check charger output voltage at battery terminals. Should be 2.25-2.30V per cell (float). If incorrect, rectifier/charger fault.', severity: 'critical', tools: ['Multimeter'] }
    ]
  }
];

export const UPS_REPAIRS: RepairProcedure[] = [
  {
    id: 'ups-battery-replacement',
    serviceId: 'ac-ups',
    name: 'UPS Battery Replacement',
    description: 'Replace complete battery set in UPS',
    category: 'Battery',
    difficulty: 'medium',
    estimatedTime: '2-4 hours',
    safetyWarnings: [
      'High DC voltage across battery string - treat as live',
      'Batteries can deliver thousands of amps on short circuit',
      'Battery acid is corrosive - wear PPE',
      'Batteries are heavy - use proper lifting technique',
      'Do NOT wear rings or metal jewelry'
    ],
    requiredTools: [
      'Insulated tools',
      'Torque wrench',
      'Battery lifting strap',
      'PPE (goggles, gloves, apron)',
      'Multimeter',
      'Battery cable crimper'
    ],
    requiredParts: [
      { partNumber: 'Per UPS spec', description: 'VRLA batteries (quantity per UPS)', quantity: 1 }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Preparation',
        instruction: 'Transfer UPS to maintenance bypass. Verify load is on bypass.',
        warning: 'Load must be on bypass before disconnecting batteries',
        duration: '5 min'
      },
      {
        stepNumber: 2,
        title: 'Open Battery Breaker',
        instruction: 'Open battery circuit breaker or fuse to isolate batteries from UPS',
        warning: 'Batteries still have full voltage even when disconnected from UPS',
        duration: '2 min'
      },
      {
        stepNumber: 3,
        title: 'Disconnect Battery Cables',
        instruction: 'Disconnect main battery cables from UPS battery terminals',
        tip: 'Disconnect negative first, then positive',
        duration: '10 min'
      },
      {
        stepNumber: 4,
        title: 'Remove Old Batteries',
        instruction: 'Remove battery interconnections and lift out batteries one at a time',
        warning: 'Batteries are heavy (25-30kg each). Use proper lifting.',
        tip: 'Keep batteries upright to prevent acid leakage',
        duration: '60 min'
      },
      {
        stepNumber: 5,
        title: 'Clean Battery Compartment',
        instruction: 'Clean any corrosion or debris from battery rack',
        tip: 'Neutralize acid residue with baking soda solution',
        duration: '15 min'
      },
      {
        stepNumber: 6,
        title: 'Install New Batteries',
        instruction: 'Place new batteries in rack. Observe correct polarity.',
        warning: 'All batteries must be same type, brand, age, and Ah rating',
        duration: '45 min'
      },
      {
        stepNumber: 7,
        title: 'Connect Interconnections',
        instruction: 'Connect battery interconnection cables in series',
        tip: 'Torque to specification (typically 8-10 Nm)',
        duration: '30 min'
      },
      {
        stepNumber: 8,
        title: 'Verify String Voltage',
        instruction: 'Measure total string voltage before connecting to UPS',
        tip: 'Should be n × 12.6V for new VRLA batteries',
        duration: '10 min'
      },
      {
        stepNumber: 9,
        title: 'Connect to UPS',
        instruction: 'Connect battery cables to UPS. Positive first, then negative.',
        warning: 'Expect small spark when connecting - normal',
        duration: '10 min'
      },
      {
        stepNumber: 10,
        title: 'Close Battery Breaker',
        instruction: 'Close battery circuit breaker/fuse',
        tip: 'UPS should begin charging batteries',
        duration: '2 min'
      },
      {
        stepNumber: 11,
        title: 'Test and Commission',
        instruction: 'Return UPS to online mode. Run battery test if available.',
        tip: 'Monitor battery charging for first few hours',
        duration: '30 min'
      }
    ],
    verificationSteps: [
      'UPS running normally on inverter',
      'Battery charging (check charge current)',
      'No battery alarms',
      'Battery test passes',
      'All batteries at equal voltage after 24hr charge'
    ],
    commonMistakes: [
      'Mixing old and new batteries',
      'Incorrect polarity on interconnections',
      'Not torquing connections properly',
      'Forgetting to close battery breaker',
      'Not allowing initial charge before testing'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// BOREHOLE PUMPS
// ═══════════════════════════════════════════════════════════════

export const BOREHOLE_SCHEMATICS: Schematic[] = [
  {
    id: 'borehole-system',
    serviceId: 'pumps',
    name: 'Borehole Pump System Overview',
    description: 'Complete borehole water pumping system schematic',
    category: 'Water Systems',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 800, height: 1000 },
    layers: [
      { id: 'electrical', name: 'Electrical', color: '#3B82F6', visible: true },
      { id: 'mechanical', name: 'Mechanical', color: '#6B7280', visible: true },
      { id: 'water', name: 'Water Flow', color: '#06B6D4', visible: true },
    ],
    components: [
      {
        id: 'submersible-pump',
        name: 'Submersible Pump',
        type: 'component',
        x: 350, y: 700, width: 100, height: 200,
        properties: { type: 'Multi-stage centrifugal', head: '100-300m' },
        connectedTo: ['pump-motor', 'rising-main'],
        layer: 'mechanical',
        details: 'Stainless steel multi-stage pump',
        specifications: {
          'Type': 'Multi-stage centrifugal',
          'Material': 'SS 304/316',
          'Stages': '10-30 per head requirement',
          'Efficiency': '65-75%'
        }
      },
      {
        id: 'pump-motor',
        name: 'Submersible Motor',
        type: 'component',
        x: 350, y: 900, width: 100, height: 80,
        properties: { type: '3-phase', cooling: 'Water cooled' },
        connectedTo: ['submersible-pump', 'drop-cable'],
        layer: 'electrical',
        details: 'Water-cooled submersible motor',
        specifications: {
          'Type': 'Squirrel cage induction',
          'Voltage': '380-415V 3-phase',
          'Cooling': 'Water flow past motor',
          'Insulation': 'Class F submersible',
          'Protection': 'Thermal + moisture sensors'
        }
      },
      {
        id: 'control-panel',
        name: 'Pump Control Panel',
        type: 'component',
        x: 100, y: 100, width: 150, height: 120,
        properties: { protection: 'Overload, dry run, phase failure' },
        connectedTo: ['drop-cable', 'level-sensors', 'pressure-sensor'],
        layer: 'electrical',
        details: 'Complete pump protection and control',
        specifications: {
          'Starter': 'DOL/Soft Start/VFD',
          'Protection': 'Overload relay, phase failure, dry run',
          'Control': 'Float switch/pressure switch/transducer',
          'Enclosure': 'IP65 outdoor'
        }
      },
      {
        id: 'storage-tank',
        name: 'Storage Tank',
        type: 'component',
        x: 550, y: 200, width: 150, height: 200,
        properties: { capacity: '10,000-50,000L', material: 'Plastic/Steel' },
        connectedTo: ['rising-main', 'distribution'],
        layer: 'water',
        details: 'Elevated or ground level storage tank'
      },
      {
        id: 'rising-main',
        name: 'Rising Main',
        type: 'component',
        x: 380, y: 300, width: 40, height: 400,
        properties: { material: 'HDPE/GI', size: '50-150mm' },
        connectedTo: ['submersible-pump', 'storage-tank'],
        layer: 'water',
        details: 'Vertical pipe from pump to surface'
      }
    ],
    notes: [
      'Pump must be installed below dynamic water level',
      'Rising main must be rated for system pressure',
      'Control panel should have dry run protection'
    ],
    relatedDiagrams: ['borehole-wiring', 'level-control-circuit'],
    lastUpdated: '2026-03-01'
  }
];

export const BOREHOLE_WIRING: WiringDiagram[] = [
  {
    id: 'borehole-pump-wiring',
    serviceId: 'pumps',
    name: 'Submersible Pump Wiring',
    description: 'Complete wiring from panel to submersible pump',
    category: 'Water Systems',
    wires: [
      {
        id: 'pump-u',
        from: 'Panel T1',
        to: 'Motor U',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: 'Per motor FLC + voltage drop',
        type: 'Submersible flat cable',
        function: 'Phase U to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'pump-v',
        from: 'Panel T2',
        to: 'Motor V',
        color: '#000000',
        colorName: 'Black',
        gauge: 'Per motor FLC + voltage drop',
        type: 'Submersible flat cable',
        function: 'Phase V to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'pump-w',
        from: 'Panel T3',
        to: 'Motor W',
        color: '#808080',
        colorName: 'Grey',
        gauge: 'Per motor FLC + voltage drop',
        type: 'Submersible flat cable',
        function: 'Phase W to motor',
        maxCurrent: 'Motor FLC',
        voltage: '400V'
      },
      {
        id: 'pump-earth',
        from: 'Panel PE',
        to: 'Motor PE',
        color: '#9ACD32',
        colorName: 'Green-Yellow',
        gauge: 'Per regulations',
        type: 'Part of drop cable',
        function: 'Protective earth',
        maxCurrent: 'Fault current',
        voltage: '0V'
      },
      {
        id: 'level-high',
        from: 'Tank High Level',
        to: 'Panel HL',
        color: '#FF0000',
        colorName: 'Red',
        gauge: '1.5mm²',
        type: 'Control cable',
        function: 'High level stop signal',
        maxCurrent: '1A',
        voltage: '230V'
      },
      {
        id: 'level-low',
        from: 'Borehole Low Level',
        to: 'Panel LL',
        color: '#FFFF00',
        colorName: 'Yellow',
        gauge: '1.5mm²',
        type: 'Submersible sensor cable',
        function: 'Low level stop (dry run protect)',
        maxCurrent: '1A',
        voltage: '230V'
      }
    ],
    terminals: [
      { id: 'jb', name: 'Wellhead Junction Box', x: 400, y: 200, type: 'IP68 junction box' }
    ],
    annotations: [
      { x: 200, y: 50, text: 'Cable size must account for voltage drop at depth' },
      { x: 200, y: 100, text: 'Max 5% voltage drop at motor terminals' },
      { x: 200, y: 500, text: 'Splice at wellhead with waterproof junction box' }
    ],
    safetyNotes: [
      'Test motor insulation (>20MΩ) before lowering into borehole',
      'Pump can start automatically - isolate before any work',
      'High pressure in rising main - relieve before disconnecting',
      'Ensure safety rope is attached to pump'
    ],
    testPoints: [
      { id: 'motor-ir', name: 'Motor Insulation', expectedValue: '>20MΩ at 500V', procedure: 'Megger before installation' },
      { id: 'voltage-drop', name: 'Voltage at Motor', expectedValue: '>380V (95% of supply)', procedure: 'Measure during run' },
      { id: 'current', name: 'Running Current', expectedValue: '≤Nameplate FLC', procedure: 'Clamp meter at panel' }
    ]
  }
];

export const BOREHOLE_TROUBLESHOOTING: TroubleshootingTree[] = [
  {
    id: 'pump-no-water',
    serviceId: 'pumps',
    name: 'Pump Running But No Water',
    description: 'Motor runs but no water delivered',
    category: 'Pump Operation',
    severity: 'critical',
    initialSymptom: 'Pump motor runs but no water at outlet',
    estimatedTime: '30-120 minutes',
    nodes: [
      { id: 'start', question: 'Is the motor drawing normal current?', yesNode: 'current-ok', noNode: 'current-low' },
      { id: 'current-low', solution: 'Low current suggests pump running dry or impeller damage. Check water level in borehole. If level OK, pump may need replacement.', severity: 'critical', tools: ['Clamp meter', 'Water level meter'] },
      { id: 'current-ok', question: 'Has the borehole yield been tested recently?', yesNode: 'yield-known', noNode: 'check-yield' },
      { id: 'check-yield', solution: 'Borehole may have low yield. Conduct yield test. Pump may be exceeding sustainable yield causing drawdown below pump.', severity: 'warning', tools: ['Water level meter', 'Flow meter'] },
      { id: 'yield-known', question: 'Is there an obstruction or leak in rising main?', yesNode: 'pipe-problem', noNode: 'no-pipe-problem' },
      { id: 'pipe-problem', solution: 'Check for pipe disconnection, leak, or blockage. May need to pull pump to inspect. Check wellhead for water return.', severity: 'critical', tools: ['Visual inspection'], timeEstimate: '2-4 hours if pump pull required' },
      { id: 'no-pipe-problem', question: 'Check non-return valve at wellhead - is it functioning?', yesNode: 'nrv-ok', noNode: 'nrv-fault' },
      { id: 'nrv-fault', solution: 'Non-return valve stuck open or removed. Water draining back when pump stops. Replace NRV.', severity: 'warning', partsList: ['Non-return valve'] },
      { id: 'nrv-ok', solution: 'Pump internal fault - worn impellers, shaft coupling failure. Pull pump for inspection and repair.', severity: 'critical', timeEstimate: '4-8 hours' }
    ]
  },
  {
    id: 'pump-trips-overload',
    serviceId: 'pumps',
    name: 'Pump Tripping on Overload',
    description: 'Overload relay tripping repeatedly',
    category: 'Protection',
    severity: 'warning',
    initialSymptom: 'Pump stops on overload, can be reset but trips again',
    estimatedTime: '20-60 minutes',
    nodes: [
      { id: 'start', question: 'Measure motor current - is it above nameplate FLC?', yesNode: 'overcurrent', noNode: 'current-normal' },
      { id: 'overcurrent', question: 'Is voltage at motor terminals correct (>380V)?', yesNode: 'voltage-ok', noNode: 'low-voltage' },
      { id: 'low-voltage', solution: 'Low voltage causes high current. Check supply voltage, cable size, connections. Voltage drop must be <5%.', severity: 'warning', tools: ['Multimeter'] },
      { id: 'voltage-ok', solution: 'Mechanical overload - pump may be sand-locked, impeller damaged, or bearing seized. Pull pump for inspection.', severity: 'critical', timeEstimate: '4-8 hours' },
      { id: 'current-normal', question: 'Is the overload relay set correctly to motor FLC?', yesNode: 'setting-ok', noNode: 'adjust-overload' },
      { id: 'adjust-overload', solution: 'Adjust overload relay to match motor nameplate FLC. Allow 10% margin for starting.', severity: 'info', tools: ['Screwdriver'] },
      { id: 'setting-ok', solution: 'Overload relay may be faulty. Replace relay. Or ambient temperature too high causing nuisance trips.', severity: 'warning', partsList: ['Overload relay'] }
    ]
  }
];

export const BOREHOLE_PARTS: Part[] = [
  {
    partNumber: 'SP30-5',
    name: 'Grundfos SP30-5 Submersible Pump',
    description: '5.5kW submersible pump for 4" borehole',
    category: 'Pumps',
    brand: 'Grundfos',
    specifications: {
      'Flow': '30 m³/h',
      'Head': '50m (5 stages)',
      'Power': '5.5kW',
      'Motor': 'MS4000',
      'Borehole': '4" minimum'
    },
    compatibility: ['4" and larger boreholes'],
    priceRange: { min: 150000, max: 200000, currency: 'KES' },
    availability: 'order',
    leadTime: '1-2 weeks'
  },
  {
    partNumber: 'FLAT-CABLE-4G6',
    name: 'Submersible Flat Cable 4G6mm²',
    description: '4-core 6mm² submersible drop cable',
    category: 'Cable',
    brand: 'Various',
    specifications: {
      'Cores': '4',
      'Size': '6mm²',
      'Rating': '32A at 90°C',
      'Type': 'Submersible flat'
    },
    compatibility: ['Up to 7.5kW pumps'],
    priceRange: { min: 800, max: 1200, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    notes: 'Price per meter'
  },
  {
    partNumber: 'MS4000-5.5',
    name: 'Grundfos MS4000 5.5kW Motor',
    description: 'Submersible motor for Grundfos SP pumps',
    category: 'Motors',
    brand: 'Grundfos',
    specifications: {
      'Power': '5.5kW',
      'Voltage': '380-415V 3-phase',
      'Cooling': 'Water flow',
      'Diameter': '4"'
    },
    compatibility: ['Grundfos SP30 series'],
    priceRange: { min: 80000, max: 120000, currency: 'KES' },
    availability: 'order',
    leadTime: '1-2 weeks'
  }
];

export const UPS_PARTS: Part[] = [
  {
    partNumber: 'CSB-GPL12750',
    name: 'CSB GPL12750 UPS Battery',
    description: '12V 75Ah VRLA battery for UPS',
    category: 'Batteries',
    brand: 'CSB',
    specifications: {
      'Voltage': '12V',
      'Capacity': '75Ah at C10',
      'Type': 'VRLA AGM',
      'Life': '10 year design',
      'Dimensions': '350×166×174mm'
    },
    compatibility: ['Most UPS systems'],
    priceRange: { min: 25000, max: 35000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day'
  },
  {
    partNumber: 'GNB-SPRINTER',
    name: 'GNB Sprinter UPS Battery',
    description: 'High rate discharge battery for UPS',
    category: 'Batteries',
    brand: 'GNB/Exide',
    specifications: {
      'Type': 'VRLA high rate',
      'Voltage': '12V',
      'Capacity': '100Ah',
      'Warranty': '2 years'
    },
    compatibility: ['Large UPS systems'],
    priceRange: { min: 40000, max: 55000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 days'
  }
];

export default {
  upsSchematics: UPS_SCHEMATICS,
  upsWiring: UPS_WIRING,
  upsTroubleshooting: UPS_TROUBLESHOOTING,
  upsRepairs: UPS_REPAIRS,
  upsParts: UPS_PARTS,
  boreholeSchematics: BOREHOLE_SCHEMATICS,
  boreholeWiring: BOREHOLE_WIRING,
  boreholeTroubleshooting: BOREHOLE_TROUBLESHOOTING,
  boreholeParts: BOREHOLE_PARTS
};
