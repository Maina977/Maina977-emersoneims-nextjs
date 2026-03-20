/**
 * DISTRIBUTION BOARDS - Technical Documentation
 * Complete reference for electrical distribution systems
 */

import type {
  Schematic,
  WiringDiagram,
  TroubleshootingTree,
  RepairProcedure,
  Part,
  MaintenanceSchedule
} from '../technicalBible';

// ==================== SCHEMATICS ====================

export const DISTRIBUTION_BOARD_SCHEMATICS: Schematic[] = [
  {
    id: 'db-3phase-main',
    serviceId: 'controls',
    name: '3-Phase Main Distribution Board',
    description: 'Complete layout of a 3-phase distribution board with main incomer and outgoing circuits',
    category: 'Power Distribution',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1000, height: 800 },
    layers: [
      { id: 'busbars', name: 'Busbars', color: '#EF4444', visible: true },
      { id: 'protection', name: 'Protection Devices', color: '#3B82F6', visible: true },
      { id: 'metering', name: 'Metering', color: '#10B981', visible: true },
      { id: 'earth', name: 'Earth System', color: '#84CC16', visible: true },
    ],
    components: [
      {
        id: 'main-incomer',
        name: 'Main Incomer MCCB',
        type: 'component',
        x: 450, y: 50, width: 100, height: 80,
        properties: { rating: '400A', breaking: '50kA', poles: '4P' },
        connectedTo: ['l1-busbar', 'l2-busbar', 'l3-busbar', 'n-busbar'],
        layer: 'protection',
        details: '4-pole MCCB with thermal-magnetic protection and shunt trip',
        partNumber: 'NSX400N',
        specifications: {
          'Current Rating': '400A',
          'Breaking Capacity': '50kA at 400V',
          'Poles': '4P (3P+N)',
          'Trip Unit': 'Micrologic 2.2',
          'Mounting': 'Fixed or Withdrawable'
        }
      },
      {
        id: 'l1-busbar',
        name: 'L1 Busbar (Brown)',
        type: 'component',
        x: 100, y: 150, width: 800, height: 20,
        properties: { material: 'Copper', size: '60x10mm', current: '630A' },
        connectedTo: ['main-incomer', 'outgoing-mcbs'],
        layer: 'busbars',
        details: 'Phase L1 busbar - BROWN color coding per IEC',
        specifications: { 'Cross Section': '600mm²', 'Material': 'Electrolytic Copper', 'Current': '630A at 35°C' }
      },
      {
        id: 'l2-busbar',
        name: 'L2 Busbar (Black)',
        type: 'component',
        x: 100, y: 200, width: 800, height: 20,
        properties: { material: 'Copper', size: '60x10mm', current: '630A' },
        connectedTo: ['main-incomer', 'outgoing-mcbs'],
        layer: 'busbars',
        details: 'Phase L2 busbar - BLACK color coding per IEC',
        specifications: { 'Cross Section': '600mm²', 'Material': 'Electrolytic Copper', 'Current': '630A at 35°C' }
      },
      {
        id: 'l3-busbar',
        name: 'L3 Busbar (Grey)',
        type: 'component',
        x: 100, y: 250, width: 800, height: 20,
        properties: { material: 'Copper', size: '60x10mm', current: '630A' },
        connectedTo: ['main-incomer', 'outgoing-mcbs'],
        layer: 'busbars',
        details: 'Phase L3 busbar - GREY color coding per IEC',
        specifications: { 'Cross Section': '600mm²', 'Material': 'Electrolytic Copper', 'Current': '630A at 35°C' }
      },
      {
        id: 'n-busbar',
        name: 'Neutral Busbar (Blue)',
        type: 'component',
        x: 100, y: 300, width: 800, height: 20,
        properties: { material: 'Copper', size: '60x10mm', current: '630A' },
        connectedTo: ['main-incomer', 'outgoing-neutrals'],
        layer: 'busbars',
        details: 'Neutral busbar - BLUE color coding per IEC',
        specifications: { 'Cross Section': '600mm²', 'Material': 'Electrolytic Copper' }
      },
      {
        id: 'earth-bar',
        name: 'Earth Bar (Green-Yellow)',
        type: 'component',
        x: 100, y: 350, width: 800, height: 15,
        properties: { material: 'Copper', size: '40x5mm' },
        connectedTo: ['main-earth', 'equipment-earths'],
        layer: 'earth',
        details: 'Main earth bar - GREEN-YELLOW color coding per IEC',
        specifications: { 'Cross Section': '200mm² min', 'Bonding': 'All metalwork' }
      }
    ],
    notes: [
      'All busbars must be insulated or have IP2X finger protection',
      'Minimum clearances per IEC 61439',
      'Earth bar must be bonded to enclosure',
      'Neutral-earth link only at source of supply'
    ],
    relatedDiagrams: ['db-metering', 'db-protection-coordination'],
    lastUpdated: '2026-03-01'
  }
];

// ==================== WIRING DIAGRAMS ====================

export const DISTRIBUTION_BOARD_WIRING: WiringDiagram[] = [
  {
    id: 'db-main-wiring',
    serviceId: 'controls',
    name: 'Main Distribution Board Internal Wiring',
    description: 'Complete internal wiring of a 3-phase distribution board',
    category: 'Power Distribution',
    wires: [
      {
        id: 'w1',
        from: 'Incomer L1',
        to: 'L1 Busbar',
        color: '#8B4513',
        colorName: 'Brown',
        gauge: '70mm²',
        type: 'Single Core PVC/PVC',
        function: 'Phase L1 Feed',
        maxCurrent: '170A',
        voltage: '400V'
      },
      {
        id: 'w2',
        from: 'Incomer L2',
        to: 'L2 Busbar',
        color: '#000000',
        colorName: 'Black',
        gauge: '70mm²',
        type: 'Single Core PVC/PVC',
        function: 'Phase L2 Feed',
        maxCurrent: '170A',
        voltage: '400V'
      },
      {
        id: 'w3',
        from: 'Incomer L3',
        to: 'L3 Busbar',
        color: '#808080',
        colorName: 'Grey',
        gauge: '70mm²',
        type: 'Single Core PVC/PVC',
        function: 'Phase L3 Feed',
        maxCurrent: '170A',
        voltage: '400V'
      },
      {
        id: 'w4',
        from: 'Incomer N',
        to: 'Neutral Bar',
        color: '#0000FF',
        colorName: 'Blue',
        gauge: '70mm²',
        type: 'Single Core PVC/PVC',
        function: 'Neutral Feed',
        maxCurrent: '170A',
        voltage: '0V'
      },
      {
        id: 'w5',
        from: 'Incomer PE',
        to: 'Earth Bar',
        color: '#9ACD32',
        colorName: 'Green-Yellow',
        gauge: '35mm²',
        type: 'Single Core PVC',
        function: 'Protective Earth',
        maxCurrent: 'Fault only',
        voltage: '0V'
      }
    ],
    terminals: [
      { id: 't1', name: 'Main Incomer L1', x: 100, y: 50, type: 'Lug' },
      { id: 't2', name: 'Main Incomer L2', x: 150, y: 50, type: 'Lug' },
      { id: 't3', name: 'Main Incomer L3', x: 200, y: 50, type: 'Lug' },
      { id: 't4', name: 'Main Incomer N', x: 250, y: 50, type: 'Lug' },
      { id: 't5', name: 'Main Incomer PE', x: 300, y: 50, type: 'Lug' }
    ],
    annotations: [
      { x: 500, y: 100, text: 'Torque all connections to manufacturer spec' },
      { x: 500, y: 400, text: 'Maintain phase sequence L1-L2-L3' }
    ],
    safetyNotes: [
      'DANGER: 400V AC - Fatal if touched. Always isolate and prove dead.',
      'Use approved insulated tools rated for 1000V AC',
      'Wear appropriate PPE including arc flash protection for >400A systems',
      'Lock out tag out (LOTO) all incoming supplies',
      'Test for dead with approved voltage indicator before touching'
    ],
    testPoints: [
      { id: 'tp1', name: 'L1-L2 Voltage', expectedValue: '400V ±5%', procedure: 'Measure with CAT III meter' },
      { id: 'tp2', name: 'L2-L3 Voltage', expectedValue: '400V ±5%', procedure: 'Measure with CAT III meter' },
      { id: 'tp3', name: 'L3-L1 Voltage', expectedValue: '400V ±5%', procedure: 'Measure with CAT III meter' },
      { id: 'tp4', name: 'L1-N Voltage', expectedValue: '230V ±5%', procedure: 'Measure with CAT III meter' },
      { id: 'tp5', name: 'Insulation L1-E', expectedValue: '>1MΩ at 500V', procedure: 'Megger test with load disconnected' }
    ]
  },
  {
    id: 'db-mcb-wiring',
    serviceId: 'controls',
    name: 'MCB Outgoing Circuit Wiring',
    description: 'Wiring from busbar to MCB outgoing circuits',
    category: 'Power Distribution',
    wires: [
      {
        id: 'mcb-l',
        from: 'L1/L2/L3 Busbar',
        to: 'MCB Input',
        color: '#8B4513',
        colorName: 'Brown/Black/Grey',
        gauge: 'Per circuit rating',
        type: 'Busbar or Cable',
        function: 'Phase to MCB',
        maxCurrent: 'MCB rating',
        voltage: '230/400V'
      },
      {
        id: 'mcb-out',
        from: 'MCB Output',
        to: 'Circuit Cable',
        color: '#8B4513',
        colorName: 'Brown/Black/Grey',
        gauge: 'Per load',
        type: 'Per installation method',
        function: 'Protected circuit feed',
        maxCurrent: 'MCB rating',
        voltage: '230/400V'
      }
    ],
    terminals: [],
    annotations: [
      { x: 200, y: 150, text: 'MCB rating must not exceed cable current capacity' }
    ],
    safetyNotes: [
      'Ensure discrimination with upstream protection',
      'Cable size must be coordinated with MCB rating'
    ],
    testPoints: [
      { id: 'zs-test', name: 'Earth Fault Loop Impedance', expectedValue: 'Zs allows disconnection in 0.4s', procedure: 'Loop tester at furthest point' }
    ]
  }
];

// ==================== TROUBLESHOOTING ====================

export const DISTRIBUTION_BOARD_TROUBLESHOOTING: TroubleshootingTree[] = [
  {
    id: 'db-mcb-tripping',
    serviceId: 'controls',
    name: 'MCB Keeps Tripping',
    description: 'Circuit breaker trips repeatedly',
    category: 'Protection',
    severity: 'warning',
    initialSymptom: 'MCB trips when switched on or after short time',
    estimatedTime: '15-60 minutes',
    nodes: [
      { id: 'start', question: 'Does MCB trip immediately when switched on?', yesNode: 'immediate', noNode: 'delayed' },
      { id: 'immediate', question: 'Does it trip with all loads disconnected?', yesNode: 'cable-fault', noNode: 'load-fault' },
      { id: 'cable-fault', solution: 'Cable insulation failure. Megger test circuit - should read >1MΩ. Replace damaged cable.', severity: 'critical', tools: ['Insulation tester (Megger)', 'Cable tracer'] },
      { id: 'load-fault', question: 'Does it trip with one particular load?', yesNode: 'faulty-load', noNode: 'overload' },
      { id: 'faulty-load', solution: 'Faulty equipment causing short circuit. Isolate and repair/replace faulty item.', severity: 'warning', tools: ['Multimeter'] },
      { id: 'overload', solution: 'Circuit overloaded. Calculate total load and compare to MCB rating. Reduce load or upgrade circuit.', severity: 'info', tools: ['Clamp meter'] },
      { id: 'delayed', question: 'Does it trip under high load conditions?', yesNode: 'thermal-overload', noNode: 'nuisance-trip' },
      { id: 'thermal-overload', solution: 'Thermal overload. Load exceeds MCB rating. Measure current with clamp meter. Reduce load or upgrade MCB/cable.', severity: 'warning', tools: ['Clamp meter'], timeEstimate: '30 min' },
      { id: 'nuisance-trip', solution: 'Check for loose connections causing arcing. Retorque all terminals. If MCB is old, replace.', severity: 'info', tools: ['Torque screwdriver', 'Thermal camera'] }
    ]
  },
  {
    id: 'db-earth-fault',
    serviceId: 'controls',
    name: 'Earth Fault Alarm/Trip',
    description: 'RCD or earth fault relay operating',
    category: 'Protection',
    severity: 'critical',
    initialSymptom: 'Earth fault indicated or RCD tripping',
    estimatedTime: '30-90 minutes',
    nodes: [
      { id: 'start', question: 'Is the fault on a single circuit or whole board?', yesNode: 'single-circuit', noNode: 'whole-board' },
      { id: 'single-circuit', question: 'Does fault clear when load is disconnected?', yesNode: 'load-earth-fault', noNode: 'cable-earth-fault' },
      { id: 'load-earth-fault', solution: 'Earth fault in connected equipment. Megger test the equipment. Check for water ingress, damaged insulation, or neutral-earth fault.', severity: 'critical', tools: ['Insulation tester', 'Earth fault loop tester'] },
      { id: 'cable-earth-fault', solution: 'Earth fault in fixed wiring. Megger test circuit with all loads disconnected. Check for cable damage, especially at junction boxes.', severity: 'critical', tools: ['Insulation tester', 'Cable tracer'] },
      { id: 'whole-board', question: 'Is the incoming supply earth OK?', yesNode: 'internal-fault', noNode: 'supply-fault' },
      { id: 'supply-fault', solution: 'Problem with incoming earth. Check main earth connection, electrode (if TT), or report to supply authority.', severity: 'critical', tools: ['Earth electrode tester'] },
      { id: 'internal-fault', solution: 'Multiple circuits affected. Check for water ingress to board, damaged busbars, or incorrect neutral-earth bonding. Only one N-E bond allowed at source.', severity: 'critical', tools: ['Insulation tester', 'Visual inspection'] }
    ]
  }
];

// ==================== REPAIR PROCEDURES ====================

export const DISTRIBUTION_BOARD_REPAIRS: RepairProcedure[] = [
  {
    id: 'db-mcb-replacement',
    serviceId: 'controls',
    name: 'MCB/MCCB Replacement',
    description: 'Replace faulty miniature or molded case circuit breaker',
    category: 'Protection Devices',
    difficulty: 'medium',
    estimatedTime: '30-60 minutes',
    safetyWarnings: [
      'DANGER: 400V AC - Fatal if touched',
      'Always isolate upstream supply before working',
      'Prove dead with approved voltage indicator',
      'Use insulated tools rated for 1000V'
    ],
    requiredTools: [
      'Insulated screwdrivers (flat and Phillips)',
      'Voltage indicator (GS38 compliant)',
      'Torque screwdriver',
      'Insulation tester',
      'Labels and markers'
    ],
    requiredParts: [
      { partNumber: 'Per type', description: 'Replacement MCB/MCCB same rating', quantity: 1 }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Isolate Supply',
        instruction: 'Turn off and lock out the main incomer supplying this board',
        warning: 'Ensure all sources are isolated including any generator or UPS feeds',
        duration: '5 min'
      },
      {
        stepNumber: 2,
        title: 'Prove Dead',
        instruction: 'Test voltage indicator on known live source. Test all phases and neutral at the breaker to be replaced. Test indicator again.',
        warning: 'Follow GS38 proving sequence',
        duration: '5 min'
      },
      {
        stepNumber: 3,
        title: 'Label Wires',
        instruction: 'Label all wires connected to the breaker before disconnecting',
        tip: 'Take photos for reference',
        duration: '5 min'
      },
      {
        stepNumber: 4,
        title: 'Disconnect Wires',
        instruction: 'Loosen terminals and remove all wires from the breaker',
        warning: 'Note any special connections like auxiliary contacts',
        duration: '5 min'
      },
      {
        stepNumber: 5,
        title: 'Remove Breaker',
        instruction: 'Release mounting clips or screws and remove the faulty breaker',
        tip: 'DIN rail mounted breakers release with screwdriver in slot',
        duration: '5 min'
      },
      {
        stepNumber: 6,
        title: 'Install New Breaker',
        instruction: 'Install new breaker in same position. Verify rating matches.',
        warning: 'Never install a higher rated breaker without checking cable capacity',
        duration: '5 min'
      },
      {
        stepNumber: 7,
        title: 'Reconnect Wires',
        instruction: 'Connect all wires to correct terminals per labels',
        tip: 'Feed from top (line), load from bottom for most breakers',
        duration: '10 min'
      },
      {
        stepNumber: 8,
        title: 'Torque Connections',
        instruction: 'Torque all terminals to manufacturer specification',
        tip: 'Typical: 2-3Nm for MCB, 8-15Nm for MCCB',
        duration: '5 min'
      },
      {
        stepNumber: 9,
        title: 'Insulation Test',
        instruction: 'With new breaker OFF, megger test the circuit',
        tip: 'Should read >1MΩ at 500V DC',
        duration: '5 min'
      },
      {
        stepNumber: 10,
        title: 'Re-energize',
        instruction: 'Remove locks, close main incomer, test new breaker operation',
        warning: 'Stand to the side when closing in case of fault',
        duration: '5 min'
      }
    ],
    verificationSteps: [
      'Breaker operates manually (ON/OFF/TRIP)',
      'Voltage present at load side when ON',
      'No heating after 30 minutes under load',
      'Circuit functions correctly'
    ],
    commonMistakes: [
      'Installing breaker with wrong rating',
      'Not torquing connections - causes heating',
      'Reversing line and load connections',
      'Not testing circuit after replacement'
    ]
  }
];

// ==================== PARTS CATALOG ====================

export const DISTRIBUTION_BOARD_PARTS: Part[] = [
  {
    partNumber: 'IC60N-C32',
    name: 'MCB 32A Type C 1P',
    description: 'Schneider Acti9 iC60N single pole MCB',
    category: 'Protection',
    brand: 'Schneider Electric',
    specifications: {
      'Current Rating': '32A',
      'Curve': 'C',
      'Poles': '1P',
      'Breaking': '6kA',
      'Standard': 'IEC 60898'
    },
    compatibility: ['All standard DIN rail boards'],
    priceRange: { min: 800, max: 1200, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    alternatives: ['ABB S201-C32', 'Hager MC132']
  },
  {
    partNumber: 'IC60N-C63',
    name: 'MCB 63A Type C 3P',
    description: 'Schneider Acti9 iC60N three pole MCB',
    category: 'Protection',
    brand: 'Schneider Electric',
    specifications: {
      'Current Rating': '63A',
      'Curve': 'C',
      'Poles': '3P',
      'Breaking': '6kA',
      'Standard': 'IEC 60898'
    },
    compatibility: ['All standard DIN rail boards'],
    priceRange: { min: 4500, max: 6000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day'
  },
  {
    partNumber: 'NSX100F',
    name: 'MCCB 100A 3P',
    description: 'Schneider Compact NSX 100A MCCB',
    category: 'Protection',
    brand: 'Schneider Electric',
    specifications: {
      'Current Rating': '100A',
      'Poles': '3P',
      'Breaking': '36kA at 400V',
      'Trip Unit': 'TM-D thermal-magnetic'
    },
    compatibility: ['Schneider Prisma, Okken panels'],
    priceRange: { min: 25000, max: 35000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 days'
  },
  {
    partNumber: 'A9F74463',
    name: 'RCD 63A 30mA 4P',
    description: 'Schneider Acti9 iID 4-pole RCCB',
    category: 'Protection',
    brand: 'Schneider Electric',
    specifications: {
      'Current Rating': '63A',
      'Sensitivity': '30mA',
      'Poles': '4P',
      'Type': 'AC',
      'Breaking': '10kA'
    },
    compatibility: ['All standard DIN rail boards'],
    priceRange: { min: 8000, max: 12000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day'
  }
];

// ==================== MAINTENANCE ====================

export const DISTRIBUTION_BOARD_MAINTENANCE: MaintenanceSchedule[] = [
  {
    id: 'db-monthly',
    serviceId: 'controls',
    name: 'Distribution Board Monthly Inspection',
    description: 'Visual inspection and basic checks',
    frequency: 'monthly',
    estimatedDuration: '30 minutes',
    requiredTools: ['Thermal camera or thermometer', 'Visual inspection'],
    tasks: [
      {
        id: 't1',
        name: 'Visual Inspection',
        description: 'Check for signs of overheating, damage, or deterioration',
        procedure: ['Open panel door', 'Inspect all components', 'Check for discoloration', 'Check for burning smell'],
        acceptanceCriteria: 'No visible damage or overheating',
        category: 'preventive',
        priority: 'high'
      },
      {
        id: 't2',
        name: 'Thermal Scan',
        description: 'Check for hot spots indicating loose connections',
        procedure: ['Use thermal camera under load', 'Compare temperatures', 'Flag any >20°C above ambient'],
        acceptanceCriteria: 'No hot spots >20°C above ambient',
        category: 'predictive',
        priority: 'high'
      }
    ]
  },
  {
    id: 'db-annual',
    serviceId: 'controls',
    name: 'Distribution Board Annual Service',
    description: 'Comprehensive inspection, testing, and maintenance',
    frequency: 'annually',
    estimatedDuration: '4 hours',
    requiredTools: ['Insulation tester', 'Loop tester', 'Torque tools', 'Thermal camera'],
    tasks: [
      {
        id: 'annual-1',
        name: 'Full Visual Inspection',
        description: 'Detailed inspection of all components',
        procedure: ['Isolate supply', 'Remove all covers', 'Inspect busbars', 'Check all connections'],
        acceptanceCriteria: 'No damage, corrosion, or deterioration',
        category: 'preventive',
        priority: 'high'
      },
      {
        id: 'annual-2',
        name: 'Retorque Connections',
        description: 'Check and retorque all electrical connections',
        procedure: ['Mark connections', 'Loosen and retorque to spec', 'Use calibrated torque tool'],
        acceptanceCriteria: 'All connections torqued to specification',
        category: 'preventive',
        priority: 'high'
      },
      {
        id: 'annual-3',
        name: 'Insulation Testing',
        description: 'Megger test all circuits',
        procedure: ['Disconnect loads', 'Test each circuit at 500V DC', 'Record results'],
        acceptanceCriteria: '>1MΩ for all circuits',
        category: 'preventive',
        priority: 'high'
      },
      {
        id: 'annual-4',
        name: 'RCD Testing',
        description: 'Test all RCD/RCCB operation',
        procedure: ['Use RCD tester', 'Test at rated sensitivity', 'Test trip button'],
        acceptanceCriteria: 'Trip time <300ms at rated current',
        category: 'preventive',
        priority: 'critical'
      }
    ]
  }
];

export default {
  schematics: DISTRIBUTION_BOARD_SCHEMATICS,
  wiringDiagrams: DISTRIBUTION_BOARD_WIRING,
  troubleshooting: DISTRIBUTION_BOARD_TROUBLESHOOTING,
  repairs: DISTRIBUTION_BOARD_REPAIRS,
  parts: DISTRIBUTION_BOARD_PARTS,
  maintenance: DISTRIBUTION_BOARD_MAINTENANCE
};
