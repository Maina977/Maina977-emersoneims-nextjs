/**
 * SOLAR ENERGY SYSTEMS - Technical Documentation
 * Complete reference for solar PV installations
 */


// ==================== SCHEMATICS ====================

export const SOLAR_SCHEMATICS = [
  {
    id: 'solar-offgrid-system',
    serviceId: 'solar-systems',
    name: 'Off-Grid Solar System Overview',
    description: 'Complete off-grid solar system with battery storage',
    category: 'System Overview',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1200, height: 800 },
    layers: [
      { id: 'dc', name: 'DC Circuit', color: '#EF4444', visible: true },
      { id: 'ac', name: 'AC Circuit', color: '#3B82F6', visible: true },
      { id: 'earth', name: 'Earthing', color: '#22C55E', visible: true },
    ],
    components: [
      {
        id: 'pv-array',
        name: 'Solar PV Array',
        type: 'component',
        x: 50, y: 150, width: 150, height: 200,
        properties: { power: '5kWp', config: '2 strings x 5 panels' },
        connectedTo: ['dc-isolator', 'surge-protector'],
        layer: 'dc',
        details: '10 x 500W monocrystalline panels in 2 parallel strings of 5.',
        specifications: {
          'Panel Model': 'JA Solar 500W Mono PERC',
          'Total Power': '5000Wp',
          'Voc (string)': '225V (5 x 45V)',
          'Vmp (string)': '185V (5 x 37V)',
          'Isc (array)': '27.4A (2 x 13.7A)',
          'Imp (array)': '27A (2 x 13.5A)'
        }
      },
      {
        id: 'dc-isolator',
        name: 'DC Isolator',
        type: 'component',
        x: 250, y: 200, width: 60, height: 80,
        properties: { rating: '32A 600V DC', poles: '2P' },
        connectedTo: ['pv-array', 'mppt-input'],
        layer: 'dc',
        details: 'DC rated isolator switch for array isolation.',
        partNumber: 'DC-ISO-32A-600V',
        specifications: {
          'Rating': '32A at 600V DC',
          'Poles': '2',
          'Category': 'DC-PV2',
          'IP Rating': 'IP66'
        }
      },
      {
        id: 'surge-protector',
        name: 'DC Surge Protector',
        type: 'component',
        x: 250, y: 320, width: 60, height: 60,
        properties: { type: 'Type 2', voltage: '600V DC' },
        connectedTo: ['pv-array', 'earth-bar'],
        layer: 'dc',
        details: 'Type 2 SPD for DC side lightning protection.',
        partNumber: 'SPD-DC-600V-T2',
        specifications: {
          'Type': 'Type 2 (Class II)',
          'Uc': '600V DC',
          'In': '20kA',
          'Imax': '40kA'
        }
      },
      {
        id: 'mppt-controller',
        name: 'MPPT Charge Controller',
        type: 'component',
        x: 400, y: 200, width: 100, height: 120,
        properties: { rating: '100A', voltage: '48V' },
        connectedTo: ['dc-isolator', 'battery-bank', 'inverter'],
        layer: 'dc',
        details: 'Maximum Power Point Tracking charge controller.',
        partNumber: 'MPPT-100A-48V',
        specifications: {
          'Max PV Input': '5000W',
          'Max PV Voltage': '250V',
          'Max Charge Current': '100A',
          'Battery Voltage': '48V',
          'Efficiency': '>98%',
          'MPPT Range': '50-200V'
        }
      },
      {
        id: 'battery-bank',
        name: 'Battery Bank',
        type: 'component',
        x: 400, y: 400, width: 150, height: 120,
        properties: { capacity: '20kWh', type: 'LiFePO4' },
        connectedTo: ['mppt-controller', 'inverter', 'bms'],
        layer: 'dc',
        details: '48V 400Ah Lithium Iron Phosphate battery bank.',
        specifications: {
          'Configuration': '16S (51.2V nominal)',
          'Capacity': '400Ah / 20.48kWh',
          'Chemistry': 'LiFePO4',
          'Cycle Life': '>6000 cycles at 80% DOD',
          'BMS': 'Integrated 100A'
        }
      },
      {
        id: 'inverter',
        name: 'Off-Grid Inverter',
        type: 'component',
        x: 600, y: 250, width: 100, height: 150,
        properties: { rating: '5kW', output: '230V AC' },
        connectedTo: ['mppt-controller', 'battery-bank', 'ac-loads'],
        layer: 'ac',
        details: '48V to 230V pure sine wave inverter.',
        partNumber: 'INV-5KW-48V',
        specifications: {
          'Continuous Power': '5000W',
          'Surge Power': '10000W (5s)',
          'Input Voltage': '40-60V DC',
          'Output': '230V AC 50Hz',
          'Waveform': 'Pure sine wave',
          'Efficiency': '>93%',
          'Transfer Time': '<10ms'
        }
      },
      {
        id: 'ac-distribution',
        name: 'AC Distribution Board',
        type: 'component',
        x: 800, y: 250, width: 100, height: 150,
        properties: { ways: '12', main: '63A' },
        connectedTo: ['inverter', 'ac-loads'],
        layer: 'ac',
        details: 'Load distribution board with RCD protection.',
        specifications: {
          'Main Switch': '63A 2P',
          'RCD': '63A 30mA',
          'MCBs': '12 ways',
          'Surge': 'Type 2 AC SPD'
        }
      },
      {
        id: 'earth-system',
        name: 'Earthing System',
        type: 'component',
        x: 500, y: 550, width: 200, height: 60,
        properties: { type: 'TT', resistance: '<10Ω' },
        connectedTo: ['array-frames', 'inverter', 'db-earth'],
        layer: 'earth',
        details: 'Complete earthing system for safety.',
        specifications: {
          'Earth Electrode': 'Copper clad steel 2.4m',
          'Earth Wire': '16mm² bare copper',
          'Resistance': '<10Ω (measured)',
          'Bonding': 'All metal parts'
        }
      }
    ],
    notes: [
      'DC voltage can exceed 450V in open circuit - treat as lethal',
      'Always isolate DC before AC when working on system',
      'Panel output continues in daylight even with inverter off',
      'Verify earth resistance annually'
    ],
    relatedDiagrams: ['solar-string-wiring', 'solar-battery-connections'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'solar-hybrid-system',
    serviceId: 'solar-systems',
    name: 'Hybrid Solar System with Grid',
    description: 'Grid-tied solar system with battery backup',
    category: 'System Overview',
    difficulty: 'advanced',
    viewBox: { x: 0, y: 0, width: 1400, height: 900 },
    layers: [
      { id: 'pv-dc', name: 'PV DC', color: '#F59E0B', visible: true },
      { id: 'battery-dc', name: 'Battery DC', color: '#EF4444', visible: true },
      { id: 'ac', name: 'AC Circuit', color: '#3B82F6', visible: true },
      { id: 'grid', name: 'Grid', color: '#10B981', visible: true },
    ],
    components: [
      {
        id: 'pv-array-hybrid',
        name: 'Solar PV Array',
        type: 'component',
        x: 50, y: 150, width: 150, height: 200,
        properties: { power: '10kWp', config: '2 MPPT inputs' },
        connectedTo: ['dc-combiner', 'hybrid-inverter'],
        layer: 'pv-dc',
        details: '20 x 500W panels across 2 MPPT inputs.',
        specifications: {
          'Total Power': '10kWp',
          'MPPT 1': '10 panels, Voc 450V, Imp 13.5A',
          'MPPT 2': '10 panels, Voc 450V, Imp 13.5A',
          'Panel Type': 'Mono PERC 500W'
        }
      },
      {
        id: 'hybrid-inverter',
        name: 'Hybrid Inverter',
        type: 'component',
        x: 400, y: 200, width: 150, height: 200,
        properties: { rating: '10kW', type: 'Hybrid' },
        connectedTo: ['pv-array-hybrid', 'battery-bank', 'grid-connection', 'loads'],
        layer: 'ac',
        details: 'All-in-one hybrid inverter with MPPT, charger, and grid-tie.',
        partNumber: 'HYBRID-10KW',
        specifications: {
          'PV Input': '2 MPPT, 500V max, 14A each',
          'Battery': '48V, 100A charge/discharge',
          'Grid': '230V 50Hz, 45A max',
          'Output': '10kW continuous',
          'Modes': 'Grid-tie, Off-grid, Hybrid, UPS'
        }
      },
      {
        id: 'battery-bank-hybrid',
        name: 'Battery Bank',
        type: 'component',
        x: 400, y: 500, width: 150, height: 120,
        properties: { capacity: '30kWh', type: 'LiFePO4' },
        connectedTo: ['hybrid-inverter', 'bms'],
        layer: 'battery-dc',
        details: '48V 600Ah LiFePO4 battery bank.',
        specifications: {
          'Capacity': '30.72kWh',
          'Voltage': '48V nominal (51.2V)',
          'Configuration': '6 x 5.12kWh modules',
          'BMS': 'Distributed per module',
          'Cycles': '>6000 at 80% DOD'
        }
      },
      {
        id: 'grid-connection',
        name: 'Grid Connection',
        type: 'component',
        x: 700, y: 100, width: 100, height: 80,
        properties: { supply: 'KPLC 3-phase', meter: 'Bidirectional' },
        connectedTo: ['hybrid-inverter', 'grid-meter', 'main-switch'],
        layer: 'grid',
        details: 'Grid connection with export capability.',
        specifications: {
          'Supply': '400V 3-phase',
          'Meter': 'Bidirectional net meter',
          'Export': 'Up to 10kW',
          'Protection': 'Anti-islanding'
        }
      },
      {
        id: 'essential-loads',
        name: 'Essential Loads DB',
        type: 'component',
        x: 700, y: 300, width: 100, height: 100,
        properties: { backed: 'Yes', rating: '32A' },
        connectedTo: ['hybrid-inverter'],
        layer: 'ac',
        details: 'Critical loads backed up by battery.',
        specifications: {
          'Load Type': 'Essential/Critical',
          'Backup': 'Continues on battery',
          'Transfer': '<10ms UPS mode'
        }
      },
      {
        id: 'non-essential-loads',
        name: 'Non-Essential Loads',
        type: 'component',
        x: 700, y: 450, width: 100, height: 100,
        properties: { backed: 'No', rating: '63A' },
        connectedTo: ['grid-connection'],
        layer: 'ac',
        details: 'Heavy loads not on battery backup.',
        specifications: {
          'Load Type': 'Non-essential',
          'Backup': 'Grid only',
          'Examples': 'Geyser, pool pump, AC'
        }
      }
    ],
    notes: [
      'Anti-islanding protection is mandatory for grid-tie',
      'Net metering requires utility approval in Kenya',
      'Essential loads limited by battery inverter capacity',
      'Monitor grid export to avoid penalties'
    ],
    relatedDiagrams: ['hybrid-inverter-wiring', 'grid-connection-detail'],
    lastUpdated: '2024-03-15'
  }
];

// ==================== WIRING DIAGRAMS ====================

export const SOLAR_WIRING_DIAGRAMS = [
  {
    id: 'solar-string-wiring',
    serviceId: 'solar-systems',
    name: 'Solar Panel String Wiring',
    description: 'Series connection of solar panels in string configuration',
    category: 'DC Wiring',
    wires: [
      {
        id: 'w-panel-series',
        from: 'panel-1-neg',
        to: 'panel-2-pos',
        color: 'BK',
        colorName: 'Black',
        gauge: '6mm²',
        type: 'Solar cable (H1Z2Z2-K)',
        function: 'Panel interconnect (series)',
        maxCurrent: '15A',
        voltage: '45V DC per connection'
      },
      {
        id: 'w-string-pos',
        from: 'string-end-pos',
        to: 'combiner-pos',
        color: 'RD',
        colorName: 'Red',
        gauge: '6mm²',
        type: 'Solar cable (H1Z2Z2-K)',
        function: 'String positive to combiner',
        maxCurrent: '15A',
        voltage: '225V DC (Voc)'
      },
      {
        id: 'w-string-neg',
        from: 'string-end-neg',
        to: 'combiner-neg',
        color: 'BK',
        colorName: 'Black',
        gauge: '6mm²',
        type: 'Solar cable (H1Z2Z2-K)',
        function: 'String negative to combiner',
        maxCurrent: '15A',
        voltage: '0V DC reference'
      },
      {
        id: 'w-main-pos',
        from: 'combiner-out-pos',
        to: 'inverter-dc-pos',
        color: 'RD',
        colorName: 'Red',
        gauge: '10mm²',
        type: 'Solar cable (H1Z2Z2-K)',
        function: 'Main DC positive',
        maxCurrent: '30A',
        voltage: '225V DC (Voc)'
      },
      {
        id: 'w-main-neg',
        from: 'combiner-out-neg',
        to: 'inverter-dc-neg',
        color: 'BK',
        colorName: 'Black',
        gauge: '10mm²',
        type: 'Solar cable (H1Z2Z2-K)',
        function: 'Main DC negative',
        maxCurrent: '30A',
        voltage: '0V DC reference'
      },
      {
        id: 'w-frame-earth',
        from: 'panel-frame',
        to: 'earth-bar',
        color: 'GNYE',
        colorName: 'Green/Yellow',
        gauge: '6mm²',
        type: 'Bare or insulated copper',
        function: 'Frame earthing',
        maxCurrent: 'Fault current',
        voltage: 'Earth'
      }
    ],
    terminals: [
      { id: 'panel-1-pos', name: 'Panel 1 Positive (MC4)', x: 100, y: 50, type: 'MC4-male' },
      { id: 'panel-1-neg', name: 'Panel 1 Negative (MC4)', x: 100, y: 100, type: 'MC4-female' },
      { id: 'combiner-pos', name: 'Combiner + Input', x: 300, y: 75, type: 'terminal-6mm' },
      { id: 'combiner-neg', name: 'Combiner - Input', x: 300, y: 125, type: 'terminal-6mm' },
      { id: 'inverter-dc-pos', name: 'Inverter DC+', x: 500, y: 100, type: 'terminal-10mm' },
      { id: 'inverter-dc-neg', name: 'Inverter DC-', x: 500, y: 150, type: 'terminal-10mm' }
    ],
    annotations: [
      { x: 100, y: 150, text: 'Use genuine MC4 connectors - no mixing brands' },
      { x: 300, y: 175, text: 'String fuses: 15A per string' },
      { x: 500, y: 200, text: 'DC isolator between combiner and inverter' }
    ],
    safetyNotes: [
      'DC voltage can be LETHAL - 225V+ in full sun',
      'Cannot turn off solar panels - cover to reduce voltage',
      'Use DC rated switches and fuses only',
      'Verify polarity before connecting strings',
      'MC4 connections must be crimped, not soldered',
      'All frame metalwork must be earthed'
    ],
    testPoints: [
      { id: 'tp1', name: 'String Voc', expectedValue: '210-240V DC', procedure: 'Measure at string ends, full sun, no load' },
      { id: 'tp2', name: 'String Isc', expectedValue: '12-15A', procedure: 'Measure with DC clamp, string shorted briefly' },
      { id: 'tp3', name: 'Polarity', expectedValue: 'Positive to Positive', procedure: 'Verify all connections before combining' },
      { id: 'tp4', name: 'Earth continuity', expectedValue: '<1Ω', procedure: 'Frame to earth bar continuity' }
    ]
  },
  {
    id: 'solar-battery-wiring',
    serviceId: 'solar-systems',
    name: '48V Battery Bank Wiring',
    description: 'LiFePO4 battery bank connection for 48V system',
    category: 'DC Wiring',
    wires: [
      {
        id: 'w-bat-parallel-pos',
        from: 'battery-1-pos',
        to: 'bus-bar-pos',
        color: 'RD',
        colorName: 'Red',
        gauge: '35mm²',
        type: 'Flexible battery cable',
        function: 'Battery to bus bar positive',
        maxCurrent: '100A per battery',
        voltage: '51.2V DC'
      },
      {
        id: 'w-bat-parallel-neg',
        from: 'battery-1-neg',
        to: 'bus-bar-neg',
        color: 'BK',
        colorName: 'Black',
        gauge: '35mm²',
        type: 'Flexible battery cable',
        function: 'Battery to bus bar negative',
        maxCurrent: '100A per battery',
        voltage: '0V DC'
      },
      {
        id: 'w-inverter-bat-pos',
        from: 'bus-bar-pos',
        to: 'inverter-bat-pos',
        color: 'RD',
        colorName: 'Red',
        gauge: '50mm²',
        type: 'Flexible battery cable',
        function: 'Bus bar to inverter positive',
        maxCurrent: '200A',
        voltage: '51.2V DC'
      },
      {
        id: 'w-inverter-bat-neg',
        from: 'bus-bar-neg',
        to: 'inverter-bat-neg',
        color: 'BK',
        colorName: 'Black',
        gauge: '50mm²',
        type: 'Flexible battery cable',
        function: 'Bus bar to inverter negative',
        maxCurrent: '200A',
        voltage: '0V DC'
      },
      {
        id: 'w-bms-comm',
        from: 'battery-bms',
        to: 'inverter-bms',
        color: 'Varies',
        colorName: 'Per protocol',
        gauge: '0.5mm²',
        type: 'Shielded data cable',
        function: 'BMS communication (CAN/RS485)',
        maxCurrent: '100mA',
        voltage: '5V signal'
      }
    ],
    terminals: [
      { id: 'battery-1-pos', name: 'Battery 1 Positive', x: 100, y: 100, type: 'M8-stud' },
      { id: 'battery-1-neg', name: 'Battery 1 Negative', x: 100, y: 150, type: 'M8-stud' },
      { id: 'bus-bar-pos', name: 'Positive Bus Bar', x: 250, y: 100, type: 'bus-bar' },
      { id: 'bus-bar-neg', name: 'Negative Bus Bar', x: 250, y: 150, type: 'bus-bar' },
      { id: 'inverter-bat-pos', name: 'Inverter Battery +', x: 400, y: 100, type: 'M10-stud' },
      { id: 'inverter-bat-neg', name: 'Inverter Battery -', x: 400, y: 150, type: 'M10-stud' }
    ],
    annotations: [
      { x: 175, y: 75, text: 'All parallel cables same length ±5%' },
      { x: 250, y: 200, text: 'DC fuse or breaker required: 250A' },
      { x: 400, y: 200, text: 'Connect BMS communication BEFORE power' }
    ],
    safetyNotes: [
      'LiFePO4 batteries can deliver very high currents',
      'Short circuit can cause fire and explosion',
      'Use insulated tools only',
      'Install DC fuse/breaker between battery and inverter',
      'Never disconnect under load',
      'BMS must be communicating before charging'
    ],
    testPoints: [
      { id: 'tp1', name: 'Battery voltage', expectedValue: '51-54V', procedure: 'Measure at battery terminals' },
      { id: 'tp2', name: 'SOC', expectedValue: 'Per BMS', procedure: 'Read from BMS display or app' },
      { id: 'tp3', name: 'Cell balance', expectedValue: '<50mV diff', procedure: 'Check via BMS' },
      { id: 'tp4', name: 'Bus bar voltage', expectedValue: 'Same as battery', procedure: 'Verify connections' }
    ]
  },
  {
    id: 'solar-inverter-ac-wiring',
    serviceId: 'solar-systems',
    name: 'Solar Inverter AC Output Wiring',
    description: 'AC output connections from inverter to distribution board',
    category: 'AC Wiring',
    wires: [
      {
        id: 'w-ac-live',
        from: 'inverter-ac-l',
        to: 'db-main-l',
        color: 'BN',
        colorName: 'Brown',
        gauge: '10mm²',
        type: 'XLPE insulated',
        function: 'AC Live',
        maxCurrent: '45A',
        voltage: '230V AC'
      },
      {
        id: 'w-ac-neutral',
        from: 'inverter-ac-n',
        to: 'db-main-n',
        color: 'BU',
        colorName: 'Blue',
        gauge: '10mm²',
        type: 'XLPE insulated',
        function: 'AC Neutral',
        maxCurrent: '45A',
        voltage: '0V (Neutral)'
      },
      {
        id: 'w-ac-earth',
        from: 'inverter-ac-pe',
        to: 'db-earth',
        color: 'GNYE',
        colorName: 'Green/Yellow',
        gauge: '10mm²',
        type: 'XLPE insulated',
        function: 'Protective Earth',
        maxCurrent: 'Fault current',
        voltage: 'Earth'
      }
    ],
    terminals: [
      { id: 'inverter-ac-l', name: 'Inverter AC Live', x: 100, y: 100, type: 'terminal-10mm' },
      { id: 'inverter-ac-n', name: 'Inverter AC Neutral', x: 100, y: 140, type: 'terminal-10mm' },
      { id: 'inverter-ac-pe', name: 'Inverter AC Earth', x: 100, y: 180, type: 'terminal-10mm' },
      { id: 'db-main-l', name: 'DB Main Live', x: 300, y: 100, type: 'terminal-10mm' },
      { id: 'db-main-n', name: 'DB Neutral Bar', x: 300, y: 140, type: 'bus-bar' },
      { id: 'db-earth', name: 'DB Earth Bar', x: 300, y: 180, type: 'bus-bar' }
    ],
    annotations: [
      { x: 200, y: 80, text: 'RCD protection mandatory: 30mA Type A' },
      { x: 100, y: 220, text: 'AC isolator between inverter and DB' }
    ],
    safetyNotes: [
      '230V AC - LETHAL VOLTAGE',
      'Isolate inverter DC AND AC before work',
      'RCD protection is mandatory',
      'Verify neutral-earth bond at single point only',
      'Test earth loop impedance after installation'
    ],
    testPoints: [
      { id: 'tp1', name: 'Output voltage', expectedValue: '230V ±5%', procedure: 'Measure L-N' },
      { id: 'tp2', name: 'Frequency', expectedValue: '50Hz ±0.5Hz', procedure: 'Measure with frequency meter' },
      { id: 'tp3', name: 'Earth loop', expectedValue: '<1Ω', procedure: 'Earth loop tester' },
      { id: 'tp4', name: 'RCD test', expectedValue: 'Trips <30ms', procedure: 'RCD tester at 30mA' }
    ]
  }
];

// ==================== TROUBLESHOOTING ====================

export const SOLAR_TROUBLESHOOTING = [
  {
    id: 'solar-no-output',
    serviceId: 'solar-systems',
    name: 'Solar System No Output',
    symptom: 'Inverter not producing power or showing low production',
    startNode: 'no-1',
    nodes: [
      {
        id: 'no-1',
        question: 'Is the inverter powered on and displaying?',
        yesNode: 'no-2',
        noNode: 'no-power'
      },
      {
        id: 'no-power',
        question: 'Is there DC voltage from the solar panels?',
        yesNode: 'no-inverter-fault',
        noNode: 'no-panel-check'
      },
      {
        id: 'no-panel-check',
        solution: 'No DC voltage from panels. Check: Is it daylight with sun on panels? Are panels shaded? Is DC isolator closed? Are MC4 connectors properly clicked? Check individual string voltages at combiner box.',
        severity: 'warning',
        tools: ['Multimeter', 'Ladder for roof access'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'no-inverter-fault',
        solution: 'DC present but inverter not starting. Check: Inverter fault codes, DC voltage within inverter input range, Internal fuses, Communication with batteries (if hybrid). May need inverter reset or replacement.',
        severity: 'critical',
        tools: ['Multimeter', 'Inverter manual'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'no-2',
        question: 'Is the inverter showing fault code or warning?',
        yesNode: 'no-fault-code',
        noNode: 'no-3'
      },
      {
        id: 'no-fault-code',
        solution: 'Check fault code in inverter manual. Common faults: Grid fault (check grid connection), Isolation fault (check DC wiring insulation), Over-temperature (check ventilation), Battery fault (check BMS).',
        severity: 'warning',
        tools: ['Inverter manual', 'Multimeter'],
        timeEstimate: '1-4 hours depending on fault'
      },
      {
        id: 'no-3',
        question: 'Is the inverter showing solar input power?',
        yesNode: 'no-4',
        noNode: 'no-dc-issue'
      },
      {
        id: 'no-dc-issue',
        solution: 'Inverter on but no solar input. Check: DC isolator position, String fuses in combiner, Panel voltage at inverter terminals, MPPT configuration. May have loose connection or blown fuse.',
        severity: 'warning',
        tools: ['Multimeter', 'Clamp meter'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'no-4',
        question: 'Is the output AC voltage correct (230V)?',
        yesNode: 'no-5',
        noNode: 'no-ac-issue'
      },
      {
        id: 'no-ac-issue',
        solution: 'Inverter producing DC but AC output wrong. Check: AC breaker position, Grid connection (for grid-tie), Internal AC fuse, Transfer relay (for hybrid). Inverter may need service.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'no-5',
        solution: 'System appears to be working. If production seems low, check: Panel soiling/shading, Weather conditions, Time of day, Panel degradation, System monitoring for historical comparison.',
        severity: 'info',
        tools: ['System monitoring'],
        timeEstimate: '30 minutes'
      }
    ],
    relatedFaultCodes: ['E01', 'E05', 'E13', 'E25']
  },
  {
    id: 'solar-battery-not-charging',
    serviceId: 'solar-systems',
    name: 'Battery Not Charging',
    symptom: 'Solar system running but batteries not charging',
    startNode: 'bc-1',
    nodes: [
      {
        id: 'bc-1',
        question: 'Is there solar power available (daytime, panels working)?',
        yesNode: 'bc-2',
        noNode: 'bc-nosolar'
      },
      {
        id: 'bc-nosolar',
        solution: 'No solar input available. Batteries can only charge when solar panels are producing or grid is connected (if hybrid). Check solar production first.',
        severity: 'info',
        tools: [],
        timeEstimate: '5 minutes'
      },
      {
        id: 'bc-2',
        question: 'Is the battery voltage reading correctly on inverter?',
        yesNode: 'bc-3',
        noNode: 'bc-connection'
      },
      {
        id: 'bc-connection',
        solution: 'Inverter not reading battery voltage. Check: Battery DC connections, Battery fuse/breaker, BMS communication cable, Battery main switch. Verify voltage at inverter terminals.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: '1 hour'
      },
      {
        id: 'bc-3',
        question: 'Is the battery showing full or nearly full SOC?',
        yesNode: 'bc-full',
        noNode: 'bc-4'
      },
      {
        id: 'bc-full',
        solution: 'Battery is already full. No charging needed - this is normal. System will charge when battery SOC drops. Check battery settings if you want different charge behavior.',
        severity: 'info',
        tools: [],
        timeEstimate: '5 minutes'
      },
      {
        id: 'bc-4',
        question: 'Is the BMS allowing charging (no BMS fault)?',
        yesNode: 'bc-5',
        noNode: 'bc-bms'
      },
      {
        id: 'bc-bms',
        solution: 'BMS blocking charge. Common reasons: Over-temperature, Under-temperature (too cold), Cell imbalance, Communication fault. Check BMS status via app or display. May need to let battery temperature normalize.',
        severity: 'warning',
        tools: ['BMS app/display'],
        timeEstimate: '30 minutes - hours'
      },
      {
        id: 'bc-5',
        question: 'Is the inverter charge current setting correct?',
        yesNode: 'bc-other',
        noNode: 'bc-settings'
      },
      {
        id: 'bc-settings',
        solution: 'Check inverter settings: Charge current limit (may be set too low), Battery type setting, Charge voltage settings, Time-of-use settings (may block daytime charging). Adjust settings as needed.',
        severity: 'warning',
        tools: ['Inverter manual'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'bc-other',
        solution: 'If all above checks pass, consider: Insufficient solar production for current loads + charging, Inverter fault requiring service, Battery degradation reducing capacity.',
        severity: 'warning',
        tools: ['System monitoring', 'Professional diagnosis'],
        timeEstimate: '2-4 hours'
      }
    ],
    relatedFaultCodes: ['E10', 'E11', 'E15', 'E20']
  }
];

// ==================== REPAIRS ====================

export const SOLAR_REPAIRS = [
  {
    id: 'solar-panel-cleaning',
    serviceId: 'solar-systems',
    name: 'Solar Panel Cleaning',
    symptom: 'Reduced output, visible soiling on panels',
    description: 'Safe cleaning procedure for solar panels',
    difficulty: 'easy',
    timeEstimate: '1-2 hours (depending on array size)',
    tools: [
      'Soft brush or sponge',
      'Bucket',
      'Garden hose with spray nozzle',
      'Squeegee',
      'Safety harness (for roof work)',
      'Ladder'
    ],
    parts: [],
    safetyWarnings: [
      'Work on roof safely - use harness',
      'Clean in early morning or evening when panels cool',
      'Never walk on panels',
      'Panels can be slippery when wet',
      'Do not use abrasive materials',
      'Avoid high-pressure washers'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Schedule cleaning for early morning or late afternoon when panels are cool.',
        warning: 'Hot panels can crack when cold water applied',
        tip: 'Sunrise is ideal - panels cool and dew helps loosen dirt'
      },
      {
        stepNumber: 2,
        instruction: 'Turn off inverter AC and DC isolators for safety during roof work.',
        checkPoint: 'Inverter off, isolators open'
      },
      {
        stepNumber: 3,
        instruction: 'Set up safe roof access - ladder secured, safety harness on if required by height.',
        warning: 'Falls from height cause serious injury',
        checkPoint: 'Safe access established'
      },
      {
        stepNumber: 4,
        instruction: 'Rinse panels with clean water from hose to remove loose dirt and dust.',
        tip: 'Use soft spray, not jet'
      },
      {
        stepNumber: 5,
        instruction: 'For stubborn dirt, use soft brush or sponge with clean water only. No detergents.',
        warning: 'Detergents can leave residue and damage anti-reflective coating',
        tip: 'Work from top to bottom'
      },
      {
        stepNumber: 6,
        instruction: 'Rinse thoroughly with clean water.',
        checkPoint: 'No soap residue'
      },
      {
        stepNumber: 7,
        instruction: 'Optional: Use squeegee to remove water and prevent water spots.',
        tip: 'Not essential if using clean water'
      },
      {
        stepNumber: 8,
        instruction: 'Visually inspect panels for damage while on roof - cracks, hot spots (discoloration), loose cables.',
        checkPoint: 'Panels inspected, no damage noted'
      },
      {
        stepNumber: 9,
        instruction: 'Allow panels to dry. Turn on DC isolator, then AC isolator. Verify inverter starts.',
        checkPoint: 'System back online, producing power'
      },
      {
        stepNumber: 10,
        instruction: 'Compare production to similar day before cleaning to verify improvement.',
        tip: 'Typical improvement 5-25% depending on soiling'
      }
    ],
    testProcedure: 'Compare energy production with similar weather day before cleaning. Should see 5-25% improvement if panels were significantly soiled.',
    linkedFaultCodes: []
  },
  {
    id: 'solar-mc4-connector-replacement',
    serviceId: 'solar-systems',
    name: 'MC4 Connector Replacement',
    symptom: 'Burnt connector, intermittent connection, hot spot',
    description: 'Replace damaged MC4 connector on solar panel cable',
    difficulty: 'moderate',
    timeEstimate: '30-60 minutes per connector',
    tools: [
      'MC4 crimping tool',
      'MC4 spanner/wrench',
      'Wire strippers',
      'Multimeter',
      'Heat gun (optional for heat shrink)'
    ],
    parts: [
      { partNumber: 'MC4-MALE', name: 'MC4 Male Connector', quantity: 1 },
      { partNumber: 'MC4-FEMALE', name: 'MC4 Female Connector', quantity: 1 }
    ],
    safetyWarnings: [
      'Panels produce voltage in daylight - cannot be turned off',
      'Cover panel to reduce voltage before working',
      'Work on one connector at a time',
      'DC voltage can be lethal',
      'Use DC-rated work practices'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Identify the damaged connector. Turn off inverter and DC isolator.',
        warning: 'Panel still produces voltage - cover with opaque material if possible',
        checkPoint: 'System isolated'
      },
      {
        stepNumber: 2,
        instruction: 'Disconnect the damaged MC4 connector using MC4 spanner tool.',
        tip: 'Insert prongs and push back locking tabs while pulling apart'
      },
      {
        stepNumber: 3,
        instruction: 'Cut cable behind damaged connector, leaving enough length for new connector.',
        checkPoint: 'Cable cut cleanly'
      },
      {
        stepNumber: 4,
        instruction: 'Strip cable insulation: 8mm of outer insulation, 6mm of inner conductor insulation.',
        warning: 'Do not nick copper strands',
        tip: 'Use proper solar cable strippers'
      },
      {
        stepNumber: 5,
        instruction: 'Slide cable gland and gland nut onto cable BEFORE crimping.',
        warning: 'Common mistake - must be done before crimp',
        checkPoint: 'Gland and nut on cable'
      },
      {
        stepNumber: 6,
        instruction: 'Insert stripped conductor into crimp terminal until visible in inspection window.',
        checkPoint: 'Conductor visible in crimp terminal window'
      },
      {
        stepNumber: 7,
        instruction: 'Crimp using proper MC4 crimping tool - one firm crimp.',
        warning: 'Poor crimp causes high resistance and fire risk',
        checkPoint: 'Crimp secure, cannot pull out'
      },
      {
        stepNumber: 8,
        instruction: 'Insert crimped terminal into connector body until it clicks.',
        checkPoint: 'Terminal clicked into place'
      },
      {
        stepNumber: 9,
        instruction: 'Screw gland nut onto connector body and tighten firmly.',
        tip: 'Should be watertight but not over-tightened'
      },
      {
        stepNumber: 10,
        instruction: 'Connect to mating connector. Should click firmly into place.',
        checkPoint: 'Connector clicked and locked'
      },
      {
        stepNumber: 11,
        instruction: 'Turn on DC isolator. Check voltage at inverter. Turn on inverter.',
        checkPoint: 'System producing power normally'
      }
    ],
    testProcedure: 'Measure voltage at repaired connection - should match other strings. Monitor connection temperature with IR thermometer under load - should not exceed ambient + 20°C.',
    linkedFaultCodes: ['E03', 'E04']
  }
];

// ==================== PARTS ====================

export const SOLAR_PARTS = [
  {
    id: 'solar-panel-500w',
    partNumber: 'JA-500W-MONO',
    name: 'Solar Panel 500W Mono PERC',
    description: '500W monocrystalline solar panel with PERC technology',
    category: 'Solar Panels',
    serviceIds: ['solar-systems'],
    price: { min: 18000, max: 25000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-3 days',
    specifications: {
      'Power': '500W (±3%)',
      'Voc': '45.2V',
      'Vmp': '37.4V',
      'Isc': '13.74A',
      'Imp': '13.37A',
      'Efficiency': '21.3%',
      'Dimensions': '2094 x 1134 x 35mm',
      'Weight': '26.5kg',
      'Warranty': '12 years product, 25 years performance'
    },
    compatibleModels: ['All grid-tie and off-grid systems']
  },
  {
    id: 'mppt-100a',
    partNumber: 'MPPT-100A-48V',
    name: 'MPPT Charge Controller 100A',
    description: 'Maximum Power Point Tracking charge controller 100A 48V',
    category: 'Charge Controllers',
    serviceIds: ['solar-systems'],
    price: { min: 45000, max: 75000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-5 days',
    specifications: {
      'Max PV Input': '5200W',
      'Max PV Voltage': '250V',
      'Max Charge Current': '100A',
      'Battery Voltage': '12/24/36/48V auto',
      'Efficiency': '>98%',
      'Display': 'LCD with Bluetooth'
    },
    compatibleModels: ['48V battery systems up to 5kW']
  },
  {
    id: 'hybrid-inverter-5kw',
    partNumber: 'HYBRID-5KW-48V',
    name: 'Hybrid Inverter 5kW',
    description: '5kW hybrid inverter with MPPT and battery charger',
    category: 'Inverters',
    serviceIds: ['solar-systems'],
    price: { min: 85000, max: 150000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '3-7 days',
    specifications: {
      'Rated Power': '5000W',
      'Surge': '10000W',
      'PV Input': '500V max, 100A MPPT',
      'Battery': '48V, 100A charge',
      'AC Output': '230V 50Hz pure sine',
      'Efficiency': '>93%',
      'Transfer': '<10ms'
    },
    compatibleModels: ['48V LiFePO4 and lead-acid systems']
  },
  {
    id: 'lifepo4-battery-5kwh',
    partNumber: 'LIFEPO4-48V-100AH',
    name: 'LiFePO4 Battery 48V 100Ah',
    description: '48V 100Ah Lithium Iron Phosphate battery with BMS',
    category: 'Batteries',
    serviceIds: ['solar-systems'],
    price: { min: 120000, max: 200000, currency: 'KES' },
    availability: 'order',
    leadTime: '7-14 days',
    specifications: {
      'Capacity': '5.12kWh',
      'Voltage': '51.2V nominal',
      'Chemistry': 'LiFePO4',
      'Cycles': '>6000 at 80% DOD',
      'BMS': 'Built-in 100A',
      'Communication': 'CAN, RS485',
      'Weight': '52kg'
    },
    compatibleModels: ['All 48V hybrid inverters with CAN/RS485']
  },
  {
    id: 'mc4-connector-pair',
    partNumber: 'MC4-PAIR',
    name: 'MC4 Connector Pair',
    description: 'Male and female MC4 solar connector set',
    category: 'Connectors',
    serviceIds: ['solar-systems'],
    price: { min: 150, max: 300, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1 day',
    specifications: {
      'Current': '30A',
      'Voltage': '1000V DC',
      'Wire Size': '4-6mm²',
      'IP Rating': 'IP67',
      'Material': 'PPO housing, tin-plated copper'
    },
    compatibleModels: ['All solar panels with MC4']
  },
  {
    id: 'dc-isolator-32a',
    partNumber: 'DC-ISO-32A',
    name: 'DC Isolator 32A 600V',
    description: 'DC rated isolator switch for solar PV',
    category: 'Switchgear',
    serviceIds: ['solar-systems'],
    price: { min: 2500, max: 5000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '1-3 days',
    specifications: {
      'Rating': '32A at 600V DC',
      'Poles': '2',
      'DC Category': 'DC-PV2',
      'IP Rating': 'IP66',
      'Mounting': 'DIN rail or surface'
    },
    compatibleModels: ['Solar strings up to 8kW']
  }
];

// ==================== MAINTENANCE ====================

export const SOLAR_MAINTENANCE= {
  serviceId: 'solar-systems',
  tasks: [
    {
      id: 'solar-daily-monitor',
      name: 'Daily Production Check',
      description: 'Monitor system production via app or display',
      interval: 'Daily',
      procedure: [
        'Check daily energy production',
        'Compare to expected for weather',
        'Note any fault indicators',
        'Check battery SOC (if applicable)'
      ],
      tools: ['Monitoring app or display'],
      estimatedTime: '2 minutes',
      category: 'preventive',
      priority: 'medium'
    },
    {
      id: 'solar-monthly-visual',
      name: 'Monthly Visual Inspection',
      description: 'Visual check of all system components',
      interval: 'Monthly',
      procedure: [
        'Check panels for visible damage or soiling',
        'Inspect visible wiring for damage',
        'Check inverter for error lights',
        'Verify mounting is secure',
        'Check for vegetation growth/shading'
      ],
      tools: ['Binoculars (for roof inspection)'],
      estimatedTime: '15 minutes',
      category: 'preventive',
      priority: 'medium'
    },
    {
      id: 'solar-quarterly-cleaning',
      name: 'Quarterly Panel Cleaning',
      description: 'Clean solar panels',
      interval: 'Quarterly',
      procedure: [
        'Clean panels with water and soft brush',
        'Check for hot spots or damage while cleaning',
        'Clear any debris from around array',
        'Check drainage paths clear'
      ],
      tools: ['Soft brush', 'Water hose', 'Safety equipment'],
      estimatedTime: '1-2 hours',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'solar-annual-inspection',
      name: 'Annual Professional Inspection',
      description: 'Comprehensive system inspection',
      interval: 'Annually',
      procedure: [
        'Thermal imaging of panels and connections',
        'Test string voltages and currents',
        'Check all electrical connections',
        'Test earth continuity and resistance',
        'Verify inverter operation and settings',
        'Check battery health (if applicable)',
        'Document system performance',
        'Clean and service as needed'
      ],
      tools: ['IR camera', 'Multimeter', 'Clamp meter', 'Earth tester'],
      estimatedTime: '2-4 hours',
      category: 'preventive',
      priority: 'critical'
    },
    {
      id: 'solar-battery-monthly',
      name: 'Monthly Battery Check',
      description: 'Check battery system health',
      interval: 'Monthly',
      procedure: [
        'Check battery voltage and SOC',
        'Review charge/discharge cycles',
        'Check BMS for any alarms',
        'Verify cell balance (via BMS)',
        'Check battery temperature'
      ],
      tools: ['BMS app or display'],
      estimatedTime: '10 minutes',
      category: 'preventive',
      priority: 'high'
    }
  ]
};

export default {
  schematics: SOLAR_SCHEMATICS,
  wiringDiagrams: SOLAR_WIRING_DIAGRAMS,
  troubleshooting: SOLAR_TROUBLESHOOTING,
  repairs: SOLAR_REPAIRS,
  parts: SOLAR_PARTS,
  maintenance: SOLAR_MAINTENANCE
};
