/**
 * DATAKOM CONTROLLER SCHEMATICS DATABASE
 *
 * Complete wiring diagrams for Datakom D-series controllers
 */

import { ControllerSchematic } from './index';

export const DATAKOM_CONTROLLERS: ControllerSchematic[] = [
  {
    id: 'datakom-d500',
    manufacturer: 'Datakom',
    model: 'D-500',
    fullName: 'Datakom D-500 Generator Controller',
    image: '/images/controllers/datakom-d500.jpg',
    description: 'Multi-function generator controller with integrated PLC, automatic synchronizer, and comprehensive protection for single and parallel operation.',
    applications: ['Standby power', 'Prime power', 'Parallel operation', 'Peak shaving', 'Industrial'],
    features: [
      'Color TFT display with touchscreen',
      'Automatic synchronizing',
      'Load sharing via CAN',
      'Integrated PLC',
      '32 protection functions',
      'Multi-language support',
      'Ethernet connectivity',
      'SMS alarm capability'
    ],
    specifications: {
      supplyVoltage: '8-35V DC',
      operatingTemp: '-25°C to +70°C',
      displayType: '4.3" Color TFT Touchscreen',
      communication: ['CAN', 'RS485', 'RS232', 'Ethernet', 'USB', 'GSM'],
      inputs: 16,
      outputs: 10,
      dimensions: '245mm x 187mm x 62mm',
      weight: '1.0kg'
    },
    terminals: [
      {
        id: 'd500-pwr-pos',
        name: 'DC Supply +',
        type: 'power',
        pinNumber: 'J1-1',
        function: 'Battery positive',
        voltage: '8-35V DC',
        current: '400mA typical',
        connections: [
          { id: 'pwr1', fromTerminal: 'J1-1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '4mm²', function: 'Power supply', voltage: '24V DC' }
        ]
      },
      {
        id: 'd500-pwr-neg',
        name: 'DC Supply -',
        type: 'ground',
        pinNumber: 'J1-2',
        function: 'Battery negative',
        voltage: '0V',
        connections: [
          { id: 'gnd1', fromTerminal: 'J1-2', toComponent: 'Battery', toTerminal: '-', wireColor: 'Black', wireGauge: '4mm²', function: 'Ground' }
        ]
      },
      {
        id: 'd500-can1-h',
        name: 'CAN1 High',
        type: 'communication',
        pinNumber: 'J3-1',
        function: 'J1939 ECM CAN High',
        connections: [
          { id: 'canh1', fromTerminal: 'J3-1', toComponent: 'Engine ECM', toTerminal: 'CAN-H', wireColor: 'Yellow', wireGauge: '0.75mm²', function: 'ECM communication' }
        ]
      },
      {
        id: 'd500-can1-l',
        name: 'CAN1 Low',
        type: 'communication',
        pinNumber: 'J3-2',
        function: 'J1939 ECM CAN Low',
        connections: [
          { id: 'canl1', fromTerminal: 'J3-2', toComponent: 'Engine ECM', toTerminal: 'CAN-L', wireColor: 'Green', wireGauge: '0.75mm²', function: 'ECM communication' }
        ]
      },
      {
        id: 'd500-can2-h',
        name: 'CAN2 High',
        type: 'communication',
        pinNumber: 'J3-5',
        function: 'Unit-to-unit CAN High',
        connections: [
          { id: 'canh2', fromTerminal: 'J3-5', toComponent: 'Other D-500', toTerminal: 'CAN2-H', wireColor: 'Yellow/Black', wireGauge: '0.75mm²', function: 'Load sharing network' }
        ]
      },
      {
        id: 'd500-gen-ct1',
        name: 'Generator CT L1',
        type: 'input',
        pinNumber: 'J4-1',
        function: 'Generator current transformer L1',
        current: '5A nominal',
        connections: [
          { id: 'ct1', fromTerminal: 'J4-1', toComponent: 'CT L1', toTerminal: 'S1', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'Current sensing' }
        ]
      },
      {
        id: 'd500-gen-vt1',
        name: 'Generator VT L1',
        type: 'input',
        pinNumber: 'J5-1',
        function: 'Generator voltage sensing L1',
        voltage: '0-300V AC direct / 0-690V via PT',
        connections: [
          { id: 'vt1', fromTerminal: 'J5-1', toComponent: 'Generator', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Voltage sensing' }
        ]
      },
      {
        id: 'd500-mains-vt1',
        name: 'Mains VT L1',
        type: 'input',
        pinNumber: 'J6-1',
        function: 'Mains/Bus voltage sensing L1',
        voltage: '0-300V AC direct',
        connections: [
          { id: 'mvt1', fromTerminal: 'J6-1', toComponent: 'Mains Supply', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Mains sensing' }
        ]
      },
      {
        id: 'd500-start-out',
        name: 'Start Output',
        type: 'output',
        pinNumber: 'J7-1',
        function: 'Engine start relay',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'start1', fromTerminal: 'J7-1', toComponent: 'Start Relay', toTerminal: 'Coil', wireColor: 'Yellow', wireGauge: '1.5mm²', function: 'Cranking' }
        ]
      },
      {
        id: 'd500-fuel-out',
        name: 'Fuel Output',
        type: 'output',
        pinNumber: 'J7-3',
        function: 'Fuel solenoid control',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'fuel1', fromTerminal: 'J7-3', toComponent: 'Fuel Solenoid', toTerminal: 'Coil', wireColor: 'Orange', wireGauge: '1.5mm²', function: 'Run control' }
        ]
      },
      {
        id: 'd500-gcb-close',
        name: 'GCB Close',
        type: 'output',
        pinNumber: 'J8-1',
        function: 'Generator breaker close',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'gcb1', fromTerminal: 'J8-1', toComponent: 'GCB', toTerminal: 'Close Coil', wireColor: 'Red', wireGauge: '1.5mm²', function: 'Breaker close' }
        ]
      },
      {
        id: 'd500-gcb-trip',
        name: 'GCB Trip',
        type: 'output',
        pinNumber: 'J8-3',
        function: 'Generator breaker trip',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'gcb2', fromTerminal: 'J8-3', toComponent: 'GCB', toTerminal: 'Trip Coil', wireColor: 'Blue', wireGauge: '1.5mm²', function: 'Breaker trip' }
        ]
      },
      {
        id: 'd500-avr',
        name: 'AVR Trim Output',
        type: 'output',
        pinNumber: 'J9-1',
        function: 'Analog output for AVR voltage trim',
        voltage: '0-10V DC / 4-20mA',
        connections: [
          { id: 'avr1', fromTerminal: 'J9-1', toComponent: 'AVR', toTerminal: 'Trim+', wireColor: 'White', wireGauge: '0.75mm²', function: 'Voltage adjustment' }
        ]
      },
      {
        id: 'd500-gov',
        name: 'Governor Output',
        type: 'output',
        pinNumber: 'J9-3',
        function: 'Analog output for governor speed trim',
        voltage: '0-10V DC / 4-20mA',
        connections: [
          { id: 'gov1', fromTerminal: 'J9-3', toComponent: 'Governor', toTerminal: 'Speed Trim', wireColor: 'White/Blue', wireGauge: '0.75mm²', function: 'Speed adjustment' }
        ]
      },
      {
        id: 'd500-eth',
        name: 'Ethernet Port',
        type: 'communication',
        pinNumber: 'RJ45',
        function: 'Network connectivity',
        connections: [
          { id: 'eth1', fromTerminal: 'RJ45', toComponent: 'Network Switch', toTerminal: 'Port', wireColor: 'CAT5e', wireGauge: 'CAT5e', function: 'TCP/IP' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/datakom-d500-wiring.svg',
      layers: [
        { id: 'power', name: 'DC Power Supply', color: '#EF4444', visible: true },
        { id: 'can', name: 'CAN Bus Networks', color: '#8B5CF6', visible: true },
        { id: 'ct-vt', name: 'CT/VT Metering', color: '#3B82F6', visible: true },
        { id: 'breakers', name: 'Breaker Control', color: '#10B981', visible: true },
        { id: 'engine', name: 'Engine Control', color: '#F59E0B', visible: true },
        { id: 'analog', name: 'Analog Outputs', color: '#06B6D4', visible: true },
        { id: 'network', name: 'Network', color: '#EC4899', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 40, y: 100 }, to: { x: 140, y: 100 }, wireColor: 'red', label: 'DC+', type: 'power' },
        { id: 'w2', from: { x: 40, y: 120 }, to: { x: 140, y: 120 }, wireColor: 'black', label: 'DC-', type: 'ground' },
        { id: 'w3', from: { x: 260, y: 50 }, to: { x: 380, y: 50 }, wireColor: 'yellow', label: 'CAN1-H', type: 'communication' },
        { id: 'w4', from: { x: 260, y: 70 }, to: { x: 380, y: 70 }, wireColor: 'green', label: 'CAN1-L', type: 'communication' },
        { id: 'w5', from: { x: 260, y: 100 }, to: { x: 380, y: 100 }, wireColor: 'yellow', label: 'Start', type: 'signal' },
        { id: 'w6', from: { x: 260, y: 120 }, to: { x: 380, y: 120 }, wireColor: 'orange', label: 'Fuel', type: 'signal' },
        { id: 'w7', from: { x: 260, y: 160 }, to: { x: 380, y: 160 }, wireColor: 'red', label: 'GCB Close', type: 'signal' },
        { id: 'w8', from: { x: 260, y: 180 }, to: { x: 380, y: 180 }, wireColor: 'blue', label: 'GCB Trip', type: 'signal' },
        { id: 'w9', from: { x: 140, y: 250 }, to: { x: 40, y: 280 }, wireColor: 'blue', label: 'CT L1', type: 'signal' },
        { id: 'w10', from: { x: 140, y: 280 }, to: { x: 40, y: 330 }, wireColor: 'brown', label: 'VT L1', type: 'signal' }
      ],
      components: [
        { id: 'dc-supply', name: '24V DC', position: { x: 10, y: 90 }, size: { width: 40, height: 45 }, type: 'supply', terminals: ['+', '-'] },
        { id: 'controller', name: 'D-500', position: { x: 140, y: 30 }, size: { width: 120, height: 270 }, type: 'controller', terminals: ['J1', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'RJ45'] },
        { id: 'ecm', name: 'Engine ECM', position: { x: 380, y: 30 }, size: { width: 70, height: 70 }, type: 'ecm', terminals: ['CAN-H', 'CAN-L', 'Power'] },
        { id: 'start-relay', name: 'Start Relay', position: { x: 380, y: 110 }, size: { width: 50, height: 25 }, type: 'relay', terminals: ['Coil', 'NO', 'COM'] },
        { id: 'fuel-sol', name: 'Fuel Sol', position: { x: 380, y: 140 }, size: { width: 50, height: 25 }, type: 'solenoid', terminals: ['Coil', 'GND'] },
        { id: 'gcb', name: 'GCB', position: { x: 380, y: 180 }, size: { width: 60, height: 50 }, type: 'breaker', terminals: ['Close', 'Trip', 'Aux'] },
        { id: 'ct-cab', name: 'CT Cabinet', position: { x: 10, y: 270 }, size: { width: 50, height: 40 }, type: 'ct', terminals: ['L1-S1', 'L1-S2', 'L2-S1', 'L2-S2', 'L3-S1', 'L3-S2'] },
        { id: 'gen', name: 'Generator', position: { x: 10, y: 320 }, size: { width: 50, height: 40 }, type: 'generator', terminals: ['L1', 'L2', 'L3', 'N'] }
      ]
    },
    faultCodes: ['DK-1001', 'DK-1002', 'DK-2001', 'DK-2002', 'DK-2003', 'DK-3001', 'DK-3002', 'DK-4001', 'DK-4002', 'DK-5001'],
    troubleshooting: [
      {
        symptom: 'Synchronizing times out',
        possibleCauses: [
          'Voltage matching not achieved',
          'Frequency matching not achieved',
          'Phase angle slip too high',
          'AVR/Governor trim outputs not responding',
          'Sync window too narrow'
        ],
        diagnosticSteps: [
          'Monitor synchronizing screen during attempt',
          'Check voltage match indicator',
          'Check frequency match indicator',
          'Verify AVR trim output responds to commands',
          'Verify governor trim output responds',
          'Widen sync parameters temporarily for testing'
        ],
        solution: 'Tune AVR/governor response, adjust sync parameters, repair trim circuits',
        tools: ['PC with Rainbow+ software', 'Multimeter', 'Synchroscope'],
        time: '2-6 hours'
      },
      {
        symptom: 'Load sharing unstable',
        possibleCauses: [
          'CT polarity reversed',
          'Different droop settings between units',
          'CAN2 communication problems',
          'Governor gain too high',
          'Engine governor malfunction'
        ],
        diagnosticSteps: [
          'Verify CT polarity on all units (S1/S2)',
          'Compare droop % settings between units',
          'Check CAN2 network status',
          'Monitor individual load readings during parallel',
          'Reduce governor gain if hunting'
        ],
        solution: 'Correct CT polarity, equalize settings, repair network',
        tools: ['Rainbow+ software', 'Clamp meter', 'CAN analyzer'],
        time: '2-8 hours'
      },
      {
        symptom: 'No ECM data on CAN1',
        possibleCauses: [
          'CAN wiring fault',
          'Missing termination resistor',
          'Wrong baud rate',
          'ECM address not matching',
          'CAN transceiver failure'
        ],
        diagnosticSteps: [
          'Check CAN-H and CAN-L wiring',
          'Verify 120 ohm termination at both ends',
          'Measure bus resistance (should be ~60 ohms)',
          'Verify baud rate (typically 250kbps for J1939)',
          'Check ECM source address in configuration'
        ],
        solution: 'Repair wiring, add termination, configure correct address/baud rate',
        tools: ['Multimeter', 'CAN bus analyzer', 'Rainbow+ software'],
        time: '1-4 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Cutout',
        description: 'Cut 230mm x 170mm aperture in control panel door.',
        warnings: ['De-energize panel completely', 'Wear PPE when cutting'],
        tips: ['Use template from manual', 'File edges smooth']
      },
      {
        step: 2,
        title: 'Mount Controller',
        description: 'Insert from front of panel, secure with mounting clips from behind.',
        warnings: ['Support controller while fitting clips'],
        tips: ['Verify gasket is seated for IP65 rating']
      },
      {
        step: 3,
        title: 'DC Power Connection',
        description: 'Connect J1-1 to battery positive through 10A fuse, J1-2 to battery negative.',
        warnings: ['Observe correct polarity - reverse polarity damages unit'],
        tips: ['Install main isolator for service disconnection']
      },
      {
        step: 4,
        title: 'CAN1 Engine Bus',
        description: 'Connect ECM CAN-H to J3-1, CAN-L to J3-2 using twisted pair shielded cable.',
        warnings: ['Install 120 ohm termination at D-500 if last device', 'Max 40m total length'],
        tips: ['Use dedicated CAN cable', 'Ground shield at one point only']
      },
      {
        step: 5,
        title: 'CAN2 Load Sharing Bus',
        description: 'Connect to other D-500 units via J3-5 (H) and J3-6 (L) for parallel operation.',
        warnings: ['Terminate at first and last unit on bus'],
        tips: ['Separate cable from CAN1', 'Document unit addresses']
      },
      {
        step: 6,
        title: 'CT Installation',
        description: 'Connect generator CTs to J4 terminals. Match primary/secondary polarity.',
        warnings: ['NEVER open CT secondary with load on primary'],
        tips: ['Use shorting terminal blocks', 'Verify CT ratio in configuration']
      },
      {
        step: 7,
        title: 'VT/PT Installation',
        description: 'Wire generator voltage sensing to J5, mains/bus to J6.',
        warnings: ['High voltage - qualified electrician required'],
        tips: ['Install through fuse/MCB', 'Match phase sequence']
      },
      {
        step: 8,
        title: 'Engine Control Outputs',
        description: 'Wire start relay to J7-1, fuel solenoid to J7-3.',
        warnings: ['Use interposing relay if load exceeds 3A'],
        tips: ['Add suppression diodes', 'Test outputs individually']
      },
      {
        step: 9,
        title: 'Breaker Control',
        description: 'Wire GCB close to J8-1, trip to J8-3. Connect breaker feedback to inputs.',
        warnings: ['Match coil voltage to output', 'Test trip circuit integrity'],
        tips: ['Use relay if coil voltage differs', 'Verify auxiliary contacts']
      },
      {
        step: 10,
        title: 'Analog Outputs',
        description: 'Connect AVR trim to J9-1, governor trim to J9-3. Configure output type.',
        warnings: ['Match output type to actuator input'],
        tips: ['Start with minimal gain', 'Tune during commissioning']
      },
      {
        step: 11,
        title: 'Network Connection',
        description: 'Connect Ethernet cable to RJ45 port. Configure IP address via Rainbow+.',
        warnings: ['Use network security best practices'],
        tips: ['Use static IP for reliability', 'Document network settings']
      },
      {
        step: 12,
        title: 'Configuration',
        description: 'Use Rainbow+ software to configure all parameters.',
        warnings: ['Back up before making changes'],
        tips: ['Use application templates where available', 'Document all settings']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Display and Interface',
        interval: 'Weekly',
        procedure: ['Verify display clarity', 'Test touchscreen response', 'Check LED indicators', 'Review active alarms'],
        tools: ['None required']
      },
      {
        task: 'Metering Verification',
        interval: 'Monthly',
        procedure: ['Compare readings to external meters', 'Check all three phases', 'Verify power factor', 'Check energy totalization'],
        tools: ['Calibrated multimeter', 'Power analyzer']
      },
      {
        task: 'Communication Status',
        interval: 'Monthly',
        procedure: ['Verify CAN1 ECM status', 'Check CAN2 unit-to-unit status', 'Test Ethernet connectivity', 'Verify Modbus if used'],
        tools: ['Rainbow+ software', 'Network tools']
      },
      {
        task: 'Terminal Inspection',
        interval: 'Quarterly',
        procedure: ['Check terminal tightness', 'Inspect for corrosion', 'Verify cable condition', 'Check strain relief'],
        tools: ['Torque driver', 'Contact cleaner']
      },
      {
        task: 'Protection Testing',
        interval: 'Quarterly',
        procedure: ['Test emergency stop', 'Verify overspeed protection', 'Test reverse power protection', 'Test overcurrent protection'],
        tools: ['Test equipment', 'Injection set'],
        parts: ['None typically']
      },
      {
        task: 'Firmware Check',
        interval: 'Semi-annually',
        procedure: ['Check current firmware version', 'Review available updates', 'Plan update if needed', 'Back up configuration', 'Apply update'],
        tools: ['Rainbow+ software', 'USB drive']
      }
    ],
    repairGuide: [
      {
        issue: 'Touchscreen calibration drift',
        difficulty: 'Easy',
        tools: ['Stylus', 'Rainbow+ software'],
        parts: ['None'],
        steps: [
          'Access service menu',
          'Navigate to touchscreen calibration',
          'Follow on-screen calibration procedure',
          'Touch each target point precisely',
          'Save calibration',
          'Test touchscreen response'
        ],
        testProcedure: ['Touch all screen corners', 'Test menu navigation', 'Test virtual buttons'],
        safetyWarnings: ['Do not press too hard on screen'],
        estimatedTime: '15 minutes',
        estimatedCost: 'KES 0'
      },
      {
        issue: 'Analog output not responding',
        difficulty: 'Advanced',
        tools: ['Multimeter', 'Oscilloscope', 'Rainbow+ software'],
        parts: ['None if configuration issue'],
        steps: [
          'Verify output is configured correctly',
          'Check output type matches load (voltage/current)',
          'Use Rainbow+ to send test command',
          'Measure output with multimeter during test',
          'If no output, check internal fuse',
          'If fuse OK but no output, board level repair needed'
        ],
        testProcedure: ['Test across full range', 'Verify linearity', 'Test with actual load'],
        safetyWarnings: ['Analog output controls actuators - ensure safe state'],
        estimatedTime: '1-3 hours',
        estimatedCost: 'KES 0 - 120,000 (board replacement if failed)'
      },
      {
        issue: 'GSM modem not connecting',
        difficulty: 'Medium',
        tools: ['Antenna', 'SIM card tool', 'Rainbow+ software'],
        parts: ['SIM card', 'External antenna if needed'],
        steps: [
          'Verify SIM card is inserted correctly',
          'Check SIM has active data plan',
          'Verify APN settings match carrier',
          'Check antenna connection',
          'Try external antenna in poor signal areas',
          'Test GSM signal strength in Rainbow+',
          'Verify SMS center number is correct'
        ],
        testProcedure: ['Send test SMS', 'Verify data connection', 'Test remote monitoring'],
        safetyWarnings: ['Use correct SIM card type for slot'],
        estimatedTime: '30-90 minutes',
        estimatedCost: 'KES 1,000 - 5,000 (SIM/antenna)'
      }
    ],
    price: { min: 145000, max: 220000 },
    spareParts: [
      { partNumber: 'D500-DISP', name: 'Display Assembly', price: { min: 45000, max: 65000 }, availability: 'In Stock' },
      { partNumber: 'D500-MB', name: 'Main Board', price: { min: 85000, max: 120000 }, availability: 'Order' },
      { partNumber: 'D500-PSU', name: 'Power Supply Module', price: { min: 25000, max: 38000 }, availability: 'In Stock' },
      { partNumber: 'D500-GSM', name: 'GSM Modem Module', price: { min: 18000, max: 28000 }, availability: 'In Stock' },
      { partNumber: 'D500-ANT', name: 'GSM Antenna', price: { min: 3000, max: 5000 }, availability: 'In Stock' },
      { partNumber: 'D-CONN-SET', name: 'Connector Set', price: { min: 8000, max: 12000 }, availability: 'In Stock' },
      { partNumber: 'D500-BEZEL', name: 'Front Bezel/Gasket', price: { min: 8000, max: 12000 }, availability: 'In Stock' }
    ]
  }
];

export const getAllDatakomControllers = () => DATAKOM_CONTROLLERS;
export const getDatakomControllerById = (id: string) => DATAKOM_CONTROLLERS.find(c => c.id === id);
