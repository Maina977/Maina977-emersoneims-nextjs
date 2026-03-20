/**
 * ATS/CHANGEOVER SYSTEMS - Technical Documentation
 * Complete reference for Automatic Transfer Switch systems
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

export const ATS_SCHEMATICS: Schematic[] = [
  {
    id: 'ats-system-overview',
    serviceId: 'controls',
    name: 'ATS System Overview',
    description: 'Complete automatic transfer switch system layout',
    category: 'System Overview',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 1200, height: 800 },
    layers: [
      { id: 'power', name: 'Power Circuit', color: '#EF4444', visible: true },
      { id: 'control', name: 'Control Circuit', color: '#3B82F6', visible: true },
      { id: 'monitoring', name: 'Monitoring', color: '#10B981', visible: true },
    ],
    components: [
      {
        id: 'mains-supply',
        name: 'Mains Supply',
        type: 'component',
        x: 50, y: 200, width: 100, height: 100,
        properties: { voltage: '400V 3-phase', source: 'KPLC Grid' },
        connectedTo: ['mains-mcb', 'voltage-monitor'],
        layer: 'power',
        details: 'Main utility supply. Monitor for voltage and frequency.',
        specifications: {
          'Nominal Voltage': '400V L-L, 230V L-N',
          'Frequency': '50Hz',
          'Tolerance': '±10% voltage, ±2% frequency'
        }
      },
      {
        id: 'mains-mcb',
        name: 'Mains MCCB',
        type: 'component',
        x: 200, y: 200, width: 80, height: 80,
        properties: { rating: '400A', poles: '4P' },
        connectedTo: ['mains-supply', 'ats-mains-input'],
        layer: 'power',
        details: 'Main utility circuit breaker with undervoltage release.',
        partNumber: 'MCCB-400A-4P',
        specifications: {
          'Rating': '400A',
          'Poles': '4 (3P+N)',
          'Breaking': '36kA',
          'Release': 'Thermal-magnetic + UVR'
        }
      },
      {
        id: 'generator-supply',
        name: 'Generator Supply',
        type: 'component',
        x: 50, y: 450, width: 100, height: 100,
        properties: { voltage: '400V 3-phase', source: 'Diesel Generator' },
        connectedTo: ['gen-mcb', 'gen-voltage-monitor'],
        layer: 'power',
        details: 'Standby generator output.',
        specifications: {
          'Nominal Voltage': '400V L-L, 230V L-N',
          'Frequency': '50Hz',
          'Tolerance': '±5% voltage, ±0.5% frequency'
        }
      },
      {
        id: 'gen-mcb',
        name: 'Generator MCCB',
        type: 'component',
        x: 200, y: 450, width: 80, height: 80,
        properties: { rating: '400A', poles: '4P' },
        connectedTo: ['generator-supply', 'ats-gen-input'],
        layer: 'power',
        details: 'Generator circuit breaker with shunt trip.',
        partNumber: 'MCCB-400A-4P-ST',
        specifications: {
          'Rating': '400A',
          'Poles': '4 (3P+N)',
          'Breaking': '36kA',
          'Trip': 'Thermal-magnetic + Shunt trip'
        }
      },
      {
        id: 'ats-switch',
        name: 'Transfer Switch',
        type: 'component',
        x: 400, y: 300, width: 150, height: 200,
        properties: { rating: '400A', type: 'Motorized' },
        connectedTo: ['mains-mcb', 'gen-mcb', 'load-output'],
        layer: 'power',
        details: 'Motorized transfer switch with mechanical interlock.',
        partNumber: 'ATS-400A-4P',
        specifications: {
          'Rating': '400A',
          'Poles': '4 (3P+N)',
          'Mechanism': 'Motor operated',
          'Transfer Time': '< 100ms',
          'Interlock': 'Mechanical + Electrical'
        }
      },
      {
        id: 'ats-controller',
        name: 'ATS Controller',
        type: 'component',
        x: 600, y: 350, width: 120, height: 80,
        properties: { model: 'DSE334', voltage: '24V DC' },
        connectedTo: ['ats-switch', 'gen-controller', 'monitoring'],
        layer: 'control',
        details: 'Automatic transfer switch controller.',
        partNumber: 'DSE334',
        specifications: {
          'Voltage Sensing': '3-phase',
          'Setpoints': 'Programmable',
          'Communication': 'RS485, CAN',
          'Display': 'LED indicators',
          'Timers': 'Adjustable 0-300s'
        }
      },
      {
        id: 'load-output',
        name: 'Load Output',
        type: 'component',
        x: 700, y: 300, width: 100, height: 150,
        properties: { rating: '400A', distribution: 'To DB' },
        connectedTo: ['ats-switch', 'distribution-board'],
        layer: 'power',
        details: 'Output to load distribution board.',
        specifications: {
          'Configuration': '3P+N',
          'Cables': '4 x 185mm² per phase',
          'To': 'Main Distribution Board'
        }
      }
    ],
    notes: [
      'ATS must have mechanical interlock to prevent paralleling',
      'Never bypass interlock - fire and equipment damage risk',
      'Transfer time typically 3-10 seconds total',
      'Test ATS operation monthly'
    ],
    relatedDiagrams: ['ats-control-logic', 'ats-wiring-detail'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ats-control-logic',
    serviceId: 'controls',
    name: 'ATS Control Logic Diagram',
    description: 'Transfer sequence and control logic',
    category: 'Control System',
    difficulty: 'advanced',
    viewBox: { x: 0, y: 0, width: 1000, height: 700 },
    layers: [
      { id: 'sequence', name: 'Sequence Logic', color: '#8B5CF6', visible: true },
      { id: 'timers', name: 'Timers', color: '#F59E0B', visible: true },
    ],
    components: [
      {
        id: 'mains-monitor',
        name: 'Mains Voltage Monitor',
        type: 'component',
        x: 100, y: 100, width: 120, height: 60,
        properties: { function: 'V, F, Phase sequence' },
        connectedTo: ['mains-fail-timer'],
        layer: 'sequence',
        details: 'Monitors mains voltage, frequency, and phase sequence.',
        specifications: {
          'Undervoltage': '< 340V (adjustable)',
          'Overvoltage': '> 460V (adjustable)',
          'Underfrequency': '< 47Hz',
          'Phase sequence': 'L1-L2-L3'
        }
      },
      {
        id: 'mains-fail-timer',
        name: 'Mains Fail Timer',
        type: 'component',
        x: 300, y: 100, width: 100, height: 50,
        properties: { range: '0-30s', default: '5s' },
        connectedTo: ['gen-start-signal'],
        layer: 'timers',
        details: 'Delay before starting generator to filter transients.',
        specifications: {
          'Range': '0-30 seconds',
          'Default': '5 seconds',
          'Purpose': 'Filter short interruptions'
        }
      },
      {
        id: 'gen-start-signal',
        name: 'Generator Start Signal',
        type: 'component',
        x: 500, y: 100, width: 120, height: 50,
        properties: { output: 'Relay contact' },
        connectedTo: ['gen-crank-timer', 'gen-controller'],
        layer: 'sequence',
        details: 'Signal to generator controller to initiate start.'
      },
      {
        id: 'gen-warmup-timer',
        name: 'Generator Warmup Timer',
        type: 'component',
        x: 300, y: 200, width: 100, height: 50,
        properties: { range: '0-600s', default: '30s' },
        connectedTo: ['transfer-to-gen'],
        layer: 'timers',
        details: 'Warmup time before accepting generator load.',
        specifications: {
          'Range': '0-600 seconds',
          'Default': '30 seconds',
          'Purpose': 'Engine warmup before load'
        }
      },
      {
        id: 'transfer-to-gen',
        name: 'Transfer to Generator',
        type: 'component',
        x: 500, y: 200, width: 120, height: 50,
        properties: { sequence: 'Open mains → Close gen' },
        connectedTo: ['ats-motor-gen'],
        layer: 'sequence',
        details: 'Transfer sequence to generator power.'
      },
      {
        id: 'mains-return-timer',
        name: 'Mains Return Timer',
        type: 'component',
        x: 300, y: 350, width: 100, height: 50,
        properties: { range: '0-1800s', default: '300s' },
        connectedTo: ['transfer-to-mains'],
        layer: 'timers',
        details: 'Stabilization time before returning to mains.',
        specifications: {
          'Range': '0-1800 seconds (30 min)',
          'Default': '300 seconds (5 min)',
          'Purpose': 'Ensure mains stable'
        }
      },
      {
        id: 'transfer-to-mains',
        name: 'Transfer to Mains',
        type: 'component',
        x: 500, y: 350, width: 120, height: 50,
        properties: { sequence: 'Open gen → Close mains' },
        connectedTo: ['ats-motor-mains'],
        layer: 'sequence',
        details: 'Transfer sequence back to mains power.'
      },
      {
        id: 'gen-cooldown-timer',
        name: 'Generator Cooldown Timer',
        type: 'component',
        x: 300, y: 450, width: 100, height: 50,
        properties: { range: '0-600s', default: '180s' },
        connectedTo: ['gen-stop-signal'],
        layer: 'timers',
        details: 'Cooldown time after returning to mains.',
        specifications: {
          'Range': '0-600 seconds',
          'Default': '180 seconds (3 min)',
          'Purpose': 'Engine cooldown before stop'
        }
      },
      {
        id: 'gen-stop-signal',
        name: 'Generator Stop Signal',
        type: 'component',
        x: 500, y: 450, width: 120, height: 50,
        properties: { output: 'Remove run signal' },
        connectedTo: ['gen-controller'],
        layer: 'sequence',
        details: 'Signal to stop generator after cooldown.'
      }
    ],
    notes: [
      'All timers adjustable via controller',
      'Transfer only when source is healthy',
      'Mechanical interlock prevents simultaneous closure',
      'Test mode available for manual operation'
    ],
    relatedDiagrams: ['ats-system-overview', 'ats-wiring-detail'],
    lastUpdated: '2024-03-15'
  }
];

// ==================== WIRING DIAGRAMS ====================

export const ATS_WIRING_DIAGRAMS: WiringDiagram[] = [
  {
    id: 'ats-control-wiring',
    serviceId: 'controls',
    name: 'ATS Controller Wiring',
    description: 'Control circuit wiring for ATS controller',
    category: 'Control Wiring',
    wires: [
      {
        id: 'w-mains-sense-l1',
        from: 'mains-l1',
        to: 'controller-ms1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Mains voltage sensing L1',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-mains-sense-l2',
        from: 'mains-l2',
        to: 'controller-ms2',
        color: 'BK',
        colorName: 'Black',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Mains voltage sensing L2',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-mains-sense-l3',
        from: 'mains-l3',
        to: 'controller-ms3',
        color: 'GY',
        colorName: 'Grey',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Mains voltage sensing L3',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-sense-l1',
        from: 'gen-l1',
        to: 'controller-gs1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Generator voltage sensing L1',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-sense-l2',
        from: 'gen-l2',
        to: 'controller-gs2',
        color: 'BK',
        colorName: 'Black',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Generator voltage sensing L2',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-sense-l3',
        from: 'gen-l3',
        to: 'controller-gs3',
        color: 'GY',
        colorName: 'Grey',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Generator voltage sensing L3',
        maxCurrent: '100mA',
        voltage: '230V AC'
      },
      {
        id: 'w-to-mains-coil',
        from: 'controller-m1',
        to: 'ats-mains-coil',
        color: 'RD',
        colorName: 'Red',
        gauge: '2.5mm²',
        type: 'Stranded',
        function: 'Transfer to mains command',
        maxCurrent: '5A',
        voltage: '24V DC'
      },
      {
        id: 'w-to-gen-coil',
        from: 'controller-g1',
        to: 'ats-gen-coil',
        color: 'BU',
        colorName: 'Blue',
        gauge: '2.5mm²',
        type: 'Stranded',
        function: 'Transfer to generator command',
        maxCurrent: '5A',
        voltage: '24V DC'
      },
      {
        id: 'w-mains-pos-fb',
        from: 'ats-mains-aux',
        to: 'controller-mfb',
        color: 'YE',
        colorName: 'Yellow',
        gauge: '1.0mm²',
        type: 'Stranded',
        function: 'Mains position feedback',
        maxCurrent: '100mA',
        voltage: '24V DC'
      },
      {
        id: 'w-gen-pos-fb',
        from: 'ats-gen-aux',
        to: 'controller-gfb',
        color: 'OG',
        colorName: 'Orange',
        gauge: '1.0mm²',
        type: 'Stranded',
        function: 'Generator position feedback',
        maxCurrent: '100mA',
        voltage: '24V DC'
      },
      {
        id: 'w-gen-start',
        from: 'controller-start',
        to: 'gen-controller-start',
        color: 'VT',
        colorName: 'Violet',
        gauge: '1.5mm²',
        type: 'Stranded',
        function: 'Generator start command',
        maxCurrent: '2A',
        voltage: '24V DC'
      },
      {
        id: 'w-gen-run-fb',
        from: 'gen-controller-run',
        to: 'controller-runfb',
        color: 'WH',
        colorName: 'White',
        gauge: '1.0mm²',
        type: 'Stranded',
        function: 'Generator running feedback',
        maxCurrent: '100mA',
        voltage: '24V DC'
      }
    ],
    terminals: [
      { id: 'controller-ms1', name: 'Mains Sense L1', x: 200, y: 50, type: 'screw-M3' },
      { id: 'controller-ms2', name: 'Mains Sense L2', x: 200, y: 80, type: 'screw-M3' },
      { id: 'controller-ms3', name: 'Mains Sense L3', x: 200, y: 110, type: 'screw-M3' },
      { id: 'controller-gs1', name: 'Gen Sense L1', x: 200, y: 160, type: 'screw-M3' },
      { id: 'controller-gs2', name: 'Gen Sense L2', x: 200, y: 190, type: 'screw-M3' },
      { id: 'controller-gs3', name: 'Gen Sense L3', x: 200, y: 220, type: 'screw-M3' },
      { id: 'controller-m1', name: 'To Mains Output', x: 200, y: 280, type: 'screw-M4' },
      { id: 'controller-g1', name: 'To Gen Output', x: 200, y: 310, type: 'screw-M4' }
    ],
    annotations: [
      { x: 100, y: 30, text: 'Fuse all sensing inputs: 2A' },
      { x: 250, y: 280, text: 'Use relay for motor coils if >5A' },
      { x: 100, y: 350, text: 'Neutral must be switched for TN-S systems' }
    ],
    safetyNotes: [
      'Isolate all sources before working on ATS',
      'Sensing circuits carry mains voltage',
      'Verify mechanical interlock operation',
      'Never bypass electrical interlock',
      'Test transfer in both directions before commissioning'
    ],
    testPoints: [
      { id: 'tp1', name: 'Mains sensing', expectedValue: '400V ±10%', procedure: 'Measure L-L at sensing terminals' },
      { id: 'tp2', name: 'Generator sensing', expectedValue: '400V ±5%', procedure: 'Measure L-L at sensing terminals' },
      { id: 'tp3', name: 'Position feedback', expectedValue: '24V when in position', procedure: 'Check aux contacts' },
      { id: 'tp4', name: 'Interlock', expectedValue: 'Open circuit', procedure: 'Verify both MCBs cannot close simultaneously' }
    ]
  },
  {
    id: 'ats-power-wiring',
    serviceId: 'controls',
    name: 'ATS Power Circuit Wiring',
    description: 'Main power wiring for transfer switch',
    category: 'Power Wiring',
    wires: [
      {
        id: 'w-mains-l1',
        from: 'mains-mcb-l1',
        to: 'ats-mains-l1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Mains L1 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-mains-l2',
        from: 'mains-mcb-l2',
        to: 'ats-mains-l2',
        color: 'BK',
        colorName: 'Black',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Mains L2 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-mains-l3',
        from: 'mains-mcb-l3',
        to: 'ats-mains-l3',
        color: 'GY',
        colorName: 'Grey',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Mains L3 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-mains-n',
        from: 'mains-mcb-n',
        to: 'ats-mains-n',
        color: 'BU',
        colorName: 'Blue',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Mains Neutral to ATS',
        maxCurrent: '200A',
        voltage: '0V (Neutral)'
      },
      {
        id: 'w-gen-l1',
        from: 'gen-mcb-l1',
        to: 'ats-gen-l1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Generator L1 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-l2',
        from: 'gen-mcb-l2',
        to: 'ats-gen-l2',
        color: 'BK',
        colorName: 'Black',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Generator L2 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-l3',
        from: 'gen-mcb-l3',
        to: 'ats-gen-l3',
        color: 'GY',
        colorName: 'Grey',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'Generator L3 to ATS',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-gen-n',
        from: 'gen-mcb-n',
        to: 'ats-gen-n',
        color: 'BU',
        colorName: 'Blue',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Generator Neutral to ATS',
        maxCurrent: '200A',
        voltage: '0V (Neutral)'
      },
      {
        id: 'w-load-l1',
        from: 'ats-load-l1',
        to: 'db-incomer-l1',
        color: 'BN',
        colorName: 'Brown',
        gauge: '185mm²',
        type: 'Single core XLPE',
        function: 'ATS L1 to Load',
        maxCurrent: '400A',
        voltage: '230V AC'
      },
      {
        id: 'w-pe',
        from: 'ats-pe',
        to: 'earth-bar',
        color: 'GNYE',
        colorName: 'Green/Yellow',
        gauge: '95mm²',
        type: 'Single core XLPE',
        function: 'Protective Earth',
        maxCurrent: 'Fault current',
        voltage: 'Earth'
      }
    ],
    terminals: [
      { id: 'ats-mains-l1', name: 'ATS Mains L1', x: 300, y: 100, type: 'lug-M12' },
      { id: 'ats-mains-l2', name: 'ATS Mains L2', x: 300, y: 150, type: 'lug-M12' },
      { id: 'ats-mains-l3', name: 'ATS Mains L3', x: 300, y: 200, type: 'lug-M12' },
      { id: 'ats-mains-n', name: 'ATS Mains N', x: 300, y: 250, type: 'lug-M10' },
      { id: 'ats-gen-l1', name: 'ATS Gen L1', x: 300, y: 350, type: 'lug-M12' },
      { id: 'ats-gen-l2', name: 'ATS Gen L2', x: 300, y: 400, type: 'lug-M12' },
      { id: 'ats-gen-l3', name: 'ATS Gen L3', x: 300, y: 450, type: 'lug-M12' }
    ],
    annotations: [
      { x: 150, y: 80, text: 'Torque M12 lugs to 60Nm' },
      { x: 350, y: 300, text: 'Maintain phase sequence Mains = Gen' },
      { x: 150, y: 500, text: 'Minimum bend radius: 8x diameter' }
    ],
    safetyNotes: [
      'LETHAL VOLTAGES - 400V 3-phase',
      'Isolate BOTH sources before working',
      'Verify zero voltage with rated tester',
      'Lock out ALL upstream breakers',
      'Use properly rated crimped lugs',
      'Phase sequence must match between sources'
    ],
    testPoints: [
      { id: 'tp1', name: 'Phase rotation', expectedValue: 'L1-L2-L3 clockwise', procedure: 'Use phase rotation meter' },
      { id: 'tp2', name: 'Voltage balance', expectedValue: 'Within 2%', procedure: 'Measure all L-L voltages' },
      { id: 'tp3', name: 'Earth continuity', expectedValue: '<0.5 ohm', procedure: 'Test with earth loop tester' },
      { id: 'tp4', name: 'Insulation', expectedValue: '>1M ohm', procedure: 'Megger test at 500V' }
    ]
  }
];

// ==================== TROUBLESHOOTING ====================

export const ATS_TROUBLESHOOTING: TroubleshootingTree[] = [
  {
    id: 'ats-no-transfer',
    serviceId: 'controls',
    name: 'ATS Does Not Transfer',
    symptom: 'ATS fails to transfer to generator when mains fails',
    startNode: 'nt-1',
    nodes: [
      {
        id: 'nt-1',
        question: 'Is the ATS controller powered and displaying?',
        yesNode: 'nt-2',
        noNode: 'nt-power'
      },
      {
        id: 'nt-power',
        solution: 'ATS controller has no power. Check: Controller supply fuse, Supply wiring, Battery backup if equipped. Controller needs continuous power to operate.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'nt-2',
        question: 'Does controller detect mains failure (LED or display)?',
        yesNode: 'nt-3',
        noNode: 'nt-sensing'
      },
      {
        id: 'nt-sensing',
        solution: 'Controller not detecting mains failure. Check: Mains sensing fuses, Sensing wire connections, Voltage setpoints (may be set too low), Phase sequence. Adjust undervoltage setpoint typically to 340V.',
        severity: 'warning',
        tools: ['Multimeter', 'Controller manual'],
        timeEstimate: '1 hour'
      },
      {
        id: 'nt-3',
        question: 'Does controller issue generator start command?',
        yesNode: 'nt-4',
        noNode: 'nt-timers'
      },
      {
        id: 'nt-timers',
        solution: 'Controller not sending start command. Check: Mains fail delay timer (may be too long), Controller in AUTO mode, No fault conditions blocking operation, Manual override not engaged.',
        severity: 'warning',
        tools: ['Controller manual'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'nt-4',
        question: 'Does generator start and run?',
        yesNode: 'nt-5',
        noNode: 'nt-genstart'
      },
      {
        id: 'nt-genstart',
        solution: 'Generator not starting from ATS command. Check: Start signal wiring to generator controller, Generator in AUTO mode, Generator not in fault, Start circuit fuses. Refer to generator troubleshooting.',
        severity: 'warning',
        tools: ['Multimeter'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'nt-5',
        question: 'Does controller detect generator voltage healthy?',
        yesNode: 'nt-6',
        noNode: 'nt-gensense'
      },
      {
        id: 'nt-gensense',
        solution: 'Controller not detecting generator voltage. Check: Generator sensing fuses, Sensing wire connections, Generator output voltage (should be 400V), Frequency (should be 50Hz), Generator voltage/frequency setpoints in controller.',
        severity: 'warning',
        tools: ['Multimeter'],
        timeEstimate: '1 hour'
      },
      {
        id: 'nt-6',
        question: 'Does the ATS motor operate?',
        yesNode: 'nt-mechanical',
        noNode: 'nt-motor'
      },
      {
        id: 'nt-motor',
        solution: 'ATS transfer motor not operating. Check: Motor coil voltage (24V typically), Motor coil resistance, Transfer relay contacts, Interlock circuit complete, Motor mechanism not jammed.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: '1-2 hours',
        partsList: ['Transfer motor', 'Coil', 'Relay contacts']
      },
      {
        id: 'nt-mechanical',
        solution: 'Motor operates but transfer incomplete. Check: Mechanical linkage, Limit switches, Physical obstruction, Main contacts condition. May require ATS service or replacement.',
        severity: 'critical',
        tools: ['Inspection'],
        timeEstimate: '2-4 hours'
      }
    ],
    relatedFaultCodes: ['E01', 'E05', 'E07', 'E12']
  },
  {
    id: 'ats-no-return',
    serviceId: 'controls',
    name: 'ATS Does Not Return to Mains',
    symptom: 'ATS stays on generator after mains returns',
    startNode: 'nr-1',
    nodes: [
      {
        id: 'nr-1',
        question: 'Does controller detect mains has returned?',
        yesNode: 'nr-2',
        noNode: 'nr-mainsense'
      },
      {
        id: 'nr-mainsense',
        solution: 'Controller not detecting mains return. Check: Mains voltage present at sensing terminals, Sensing fuses OK, Mains voltage and frequency within setpoints, Phase sequence correct.',
        severity: 'warning',
        tools: ['Multimeter'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'nr-2',
        question: 'Has mains return delay timer expired?',
        yesNode: 'nr-3',
        noNode: 'nr-timer'
      },
      {
        id: 'nr-timer',
        solution: 'Mains return delay timer still running. Default is 5 minutes. If mains unstable, timer resets. Verify mains stable for full timer duration. Adjust timer if appropriate.',
        severity: 'info',
        tools: ['Controller manual'],
        timeEstimate: '5-10 minutes'
      },
      {
        id: 'nr-3',
        question: 'Is transfer command issued to mains contactor?',
        yesNode: 'nr-4',
        noNode: 'nr-command'
      },
      {
        id: 'nr-command',
        solution: 'Controller not issuing return command. Check: Controller in AUTO mode, No fault conditions, Manual lock on generator not set, Return inhibit not active.',
        severity: 'warning',
        tools: ['Controller manual'],
        timeEstimate: '30 minutes'
      },
      {
        id: 'nr-4',
        question: 'Does ATS transfer mechanism operate?',
        yesNode: 'nr-mechanical',
        noNode: 'nr-mech'
      },
      {
        id: 'nr-mech',
        solution: 'Transfer mechanism not operating. Same troubleshooting as transfer to generator. Check motor, coil, interlock, linkage.',
        severity: 'critical',
        tools: ['Multimeter'],
        timeEstimate: '1-2 hours'
      },
      {
        id: 'nr-mechanical',
        solution: 'Transfer mechanism issues. Check for mechanical binding, contact wear, limit switch adjustment.',
        severity: 'warning',
        tools: ['Inspection'],
        timeEstimate: '1-2 hours'
      }
    ],
    relatedFaultCodes: ['E02', 'E06', 'E08']
  }
];

// ==================== REPAIRS ====================

export const ATS_REPAIRS: RepairProcedure[] = [
  {
    id: 'ats-contact-cleaning',
    serviceId: 'controls',
    name: 'ATS Main Contact Cleaning',
    symptom: 'High resistance, heating, or voltage drop across ATS',
    description: 'Clean and inspect main power contacts',
    difficulty: 'advanced',
    timeEstimate: '2-4 hours',
    tools: [
      'Contact cleaner spray',
      'Fine file or contact burnishing tool',
      'Torque wrench',
      'Multimeter with milliohm range',
      'Infrared thermometer',
      'PPE (insulated gloves, face shield)'
    ],
    parts: [
      { partNumber: 'CONTACT-SET', name: 'Replacement contact set if worn', quantity: 1 }
    ],
    safetyWarnings: [
      'ISOLATE ALL POWER SOURCES',
      'Lock out mains AND generator',
      'Verify zero voltage',
      'Stored energy in mechanism - secure before work',
      'Contacts may have arc residue - wear gloves'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Isolate mains supply at main breaker. Isolate generator at generator breaker. Apply lockout to both.',
        warning: 'Both sources must be isolated',
        checkPoint: 'Lockouts applied to both sources'
      },
      {
        stepNumber: 2,
        instruction: 'Verify zero voltage at ATS input terminals using rated voltage tester.',
        warning: 'Test all phases and neutral to earth',
        checkPoint: 'Zero voltage confirmed all terminals'
      },
      {
        stepNumber: 3,
        instruction: 'Remove ATS front cover to access main contacts. Note contact positions.',
        tip: 'Take photos before disassembly'
      },
      {
        stepNumber: 4,
        instruction: 'Inspect contacts for pitting, erosion, or discoloration. Measure contact resistance.',
        checkPoint: 'Contact resistance < 100 micro-ohms'
      },
      {
        stepNumber: 5,
        instruction: 'If lightly pitted, clean with fine file or burnishing tool. Always file in direction of contact motion.',
        warning: 'Do not file silver contacts - will damage plating',
        tip: 'Remove minimum material'
      },
      {
        stepNumber: 6,
        instruction: 'Clean contacts with approved contact cleaner spray. Allow to dry completely.',
        tip: 'Use cleaner rated for electrical contacts'
      },
      {
        stepNumber: 7,
        instruction: 'Check contact pressure springs. Replace if weak or damaged.',
        checkPoint: 'Springs provide firm pressure'
      },
      {
        stepNumber: 8,
        instruction: 'Verify contact alignment - should meet squarely across full surface.',
        tip: 'Misalignment causes hot spots'
      },
      {
        stepNumber: 9,
        instruction: 'Check all connection terminals. Clean and retorque to specification.',
        torqueSpec: 'Per manufacturer - typically 20-40Nm'
      },
      {
        stepNumber: 10,
        instruction: 'Manually operate transfer mechanism several times. Verify smooth operation.',
        checkPoint: 'Smooth operation, no binding'
      },
      {
        stepNumber: 11,
        instruction: 'Replace covers. Remove lockouts. Restore power.',
        checkPoint: 'All covers replaced'
      },
      {
        stepNumber: 12,
        instruction: 'Test transfer operation. Use IR thermometer to check contact temperature under load.',
        checkPoint: 'Contacts <40°C above ambient under load'
      }
    ],
    testProcedure: 'Measure contact resistance (<100 micro-ohms). Test under load - check for heating. Monitor with IR camera if available.',
    linkedFaultCodes: ['E15', 'E16']
  },
  {
    id: 'ats-controller-replacement',
    serviceId: 'controls',
    name: 'ATS Controller Replacement',
    symptom: 'Controller fault, no display, erratic operation',
    description: 'Replace ATS controller unit',
    difficulty: 'moderate',
    timeEstimate: '2-3 hours',
    tools: [
      'Screwdrivers (Phillips, flat)',
      'Wire labels',
      'Multimeter',
      'Camera for photos',
      'Controller manual'
    ],
    parts: [
      { partNumber: 'DSE334', name: 'ATS Controller', quantity: 1 }
    ],
    safetyWarnings: [
      'Sensing circuits carry mains voltage',
      'Isolate sensing inputs before work',
      'Verify correct controller model',
      'Backup settings before removal if possible'
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'If possible, read and record all controller settings using software or manual navigation.',
        tip: 'Settings will need to be reprogrammed'
      },
      {
        stepNumber: 2,
        instruction: 'Isolate mains and generator sensing circuits by removing fuses.',
        warning: 'Sensing circuits carry mains voltage',
        checkPoint: 'Sensing fuses removed'
      },
      {
        stepNumber: 3,
        instruction: 'Photograph all wiring connections to controller.',
        tip: 'Multiple angles for reference'
      },
      {
        stepNumber: 4,
        instruction: 'Label all wires with terminal designations.',
        checkPoint: 'All wires labeled'
      },
      {
        stepNumber: 5,
        instruction: 'Disconnect all wires from controller terminals.',
        tip: 'Work systematically from one side to other'
      },
      {
        stepNumber: 6,
        instruction: 'Remove controller mounting screws. Remove controller.',
        checkPoint: 'Old controller removed'
      },
      {
        stepNumber: 7,
        instruction: 'Compare old and new controllers - verify same model and firmware.',
        checkPoint: 'Correct replacement model'
      },
      {
        stepNumber: 8,
        instruction: 'Mount new controller in same position.',
        checkPoint: 'Secure mounting'
      },
      {
        stepNumber: 9,
        instruction: 'Reconnect all wires per labels and photos. Double-check each connection.',
        warning: 'Incorrect wiring can damage controller',
        checkPoint: 'All wires connected correctly'
      },
      {
        stepNumber: 10,
        instruction: 'Reinstall sensing fuses.',
        checkPoint: 'Fuses installed'
      },
      {
        stepNumber: 11,
        instruction: 'Power up controller. Verify display and basic function.',
        checkPoint: 'Controller powers up normally'
      },
      {
        stepNumber: 12,
        instruction: 'Program all settings: voltage setpoints, timers, operating mode.',
        tip: 'Use recorded settings from step 1'
      },
      {
        stepNumber: 13,
        instruction: 'Test complete transfer sequence in both directions.',
        checkPoint: 'Transfer to gen and back to mains successful'
      }
    ],
    testProcedure: 'Simulate mains failure - verify complete sequence. Test return to mains. Verify all indications correct.',
    linkedFaultCodes: ['E01', 'E99']
  }
];

// ==================== PARTS ====================

export const ATS_PARTS: Part[] = [
  {
    id: 'ats-dse334',
    partNumber: 'DSE334',
    name: 'ATS Controller',
    description: 'Deep Sea Electronics automatic transfer switch controller',
    category: 'Controllers',
    serviceIds: ['controls'],
    price: { min: 25000, max: 45000, currency: 'KES' },
    availability: 'order',
    leadTime: '5-10 days',
    specifications: {
      'Voltage Sensing': '3-phase 110-277V AC',
      'Control Supply': '8-35V DC',
      'Outputs': '4 relay outputs',
      'Communication': 'RS485, CAN',
      'Display': 'LED indicators'
    },
    compatibleModels: ['All motorized ATS 100-3200A']
  },
  {
    id: 'ats-motorized-400a',
    partNumber: 'ATS-400A-4P',
    name: 'Motorized Transfer Switch 400A',
    description: '4-pole motorized automatic transfer switch',
    category: 'Transfer Switches',
    serviceIds: ['controls'],
    price: { min: 180000, max: 350000, currency: 'KES' },
    availability: 'order',
    leadTime: '14-21 days',
    specifications: {
      'Rating': '400A',
      'Poles': '4 (3P+N)',
      'Voltage': '400V AC',
      'Motor': '24V DC',
      'Transfer Time': '<100ms',
      'Interlock': 'Mechanical + Electrical'
    },
    compatibleModels: ['200kVA generators and above']
  },
  {
    id: 'ats-contactor-set',
    partNumber: 'CONTACT-SET-400',
    name: 'ATS Contact Set 400A',
    description: 'Replacement main contact set for 400A ATS',
    category: 'Spare Parts',
    serviceIds: ['controls'],
    price: { min: 35000, max: 65000, currency: 'KES' },
    availability: 'special-order',
    leadTime: '14-28 days',
    specifications: {
      'Rating': '400A',
      'Material': 'Silver alloy',
      'Contacts': 'Fixed + Moving set'
    },
    compatibleModels: ['ATS-400A-4P']
  }
];

// ==================== MAINTENANCE ====================

export const ATS_MAINTENANCE: MaintenanceSchedule = {
  serviceId: 'controls',
  tasks: [
    {
      id: 'ats-monthly-test',
      name: 'Monthly Transfer Test',
      description: 'Test complete transfer sequence',
      interval: 'Monthly',
      procedure: [
        'Notify affected users of test',
        'Initiate test transfer to generator',
        'Verify smooth transfer',
        'Run on generator 15 minutes',
        'Initiate return to mains',
        'Verify smooth return',
        'Document results'
      ],
      tools: ['Test switch or controller'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'critical'
    },
    {
      id: 'ats-quarterly-inspection',
      name: 'Quarterly Visual Inspection',
      description: 'Inspect ATS components',
      interval: 'Quarterly',
      procedure: [
        'Check for signs of overheating',
        'Inspect visible contacts through window',
        'Check all indicator lights',
        'Verify settings on controller',
        'Check ventilation clear',
        'Listen for unusual noises during test'
      ],
      tools: ['Flashlight', 'IR thermometer'],
      estimatedTime: '30 minutes',
      category: 'preventive',
      priority: 'high'
    },
    {
      id: 'ats-annual-service',
      name: 'Annual Comprehensive Service',
      description: 'Complete ATS service and testing',
      interval: 'Annually',
      procedure: [
        'Isolate all power sources',
        'Clean and inspect contacts',
        'Check and tighten all connections',
        'Verify interlock operation',
        'Test all protection functions',
        'Calibrate voltage/frequency settings',
        'Load test if possible',
        'Thermal scan under load'
      ],
      tools: ['Full tool set', 'IR camera', 'Milliohm meter'],
      estimatedTime: '4-6 hours',
      category: 'preventive',
      priority: 'critical'
    }
  ]
};

export default {
  schematics: ATS_SCHEMATICS,
  wiringDiagrams: ATS_WIRING_DIAGRAMS,
  troubleshooting: ATS_TROUBLESHOOTING,
  repairs: ATS_REPAIRS,
  parts: ATS_PARTS,
  maintenance: ATS_MAINTENANCE
};
