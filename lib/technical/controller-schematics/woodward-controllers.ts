/**
 * WOODWARD CONTROLLER SCHEMATICS DATABASE
 *
 * Complete wiring diagrams for Woodward easYgen, GAC, and DSLC controllers
 */

import { ControllerSchematic } from './index';

export const WOODWARD_CONTROLLERS: ControllerSchematic[] = [
  {
    id: 'woodward-easygen-3200xt',
    manufacturer: 'Woodward',
    model: 'easYgen-3200XT',
    fullName: 'Woodward easYgen-3200XT Generator Control',
    image: '/images/controllers/woodward-easygen-3200xt.jpg',
    description: 'Advanced generator set controller for all prime mover applications. Combines generator protection, engine control, and power management in a single unit with comprehensive networking capabilities.',
    applications: ['Prime power', 'Standby power', 'Peak shaving', 'Paralleling', 'Island operation', 'Marine', 'Oil & gas'],
    features: [
      '7" TFT color touchscreen display',
      'Automatic synchronizing and load sharing',
      'Comprehensive protection (32+ functions)',
      'Multiple communication protocols',
      'PLC functionality built-in',
      'Up to 8 engine/generator sets',
      'Black start and island mode',
      'Fuel optimization',
      'Redundant power supply option'
    ],
    specifications: {
      supplyVoltage: '9-32V DC',
      operatingTemp: '-40°C to +70°C',
      displayType: '7" TFT Color Touchscreen',
      communication: ['Ethernet', 'CAN J1939', 'RS485 Modbus', 'RS232', 'Profibus DP', 'DNP3'],
      inputs: 32,
      outputs: 24,
      dimensions: '288mm x 216mm x 73mm',
      weight: '2.1kg'
    },
    terminals: [
      {
        id: 'eg3200-pwr-pos',
        name: 'DC Power +',
        type: 'power',
        pinNumber: 'X1-1',
        function: 'Main DC supply positive',
        voltage: '9-32V DC',
        current: '2A max',
        connections: [
          { id: 'pwr1', fromTerminal: 'X1-1', toComponent: 'Battery/DC Supply', toTerminal: '+', wireColor: 'Red', wireGauge: '4mm²', function: 'Power supply', voltage: '24V DC', current: '2A' }
        ]
      },
      {
        id: 'eg3200-pwr-neg',
        name: 'DC Power -',
        type: 'ground',
        pinNumber: 'X1-2',
        function: 'Main DC supply negative',
        voltage: '0V',
        connections: [
          { id: 'gnd1', fromTerminal: 'X1-2', toComponent: 'Battery/DC Supply', toTerminal: '-', wireColor: 'Black', wireGauge: '4mm²', function: 'Ground' }
        ]
      },
      {
        id: 'eg3200-can1-h',
        name: 'CAN1 High',
        type: 'communication',
        pinNumber: 'X3-1',
        function: 'J1939 CAN bus high',
        voltage: '2.5-3.5V differential',
        connections: [
          { id: 'can1h', fromTerminal: 'X3-1', toComponent: 'Engine ECM', toTerminal: 'CAN-H', wireColor: 'Yellow', wireGauge: '0.75mm²', function: 'CAN High signal' }
        ]
      },
      {
        id: 'eg3200-can1-l',
        name: 'CAN1 Low',
        type: 'communication',
        pinNumber: 'X3-2',
        function: 'J1939 CAN bus low',
        voltage: '1.5-2.5V differential',
        connections: [
          { id: 'can1l', fromTerminal: 'X3-2', toComponent: 'Engine ECM', toTerminal: 'CAN-L', wireColor: 'Green', wireGauge: '0.75mm²', function: 'CAN Low signal' }
        ]
      },
      {
        id: 'eg3200-can2-h',
        name: 'CAN2 High',
        type: 'communication',
        pinNumber: 'X3-5',
        function: 'Inter-controller CAN bus',
        voltage: '2.5-3.5V differential',
        connections: [
          { id: 'can2h', fromTerminal: 'X3-5', toComponent: 'Other easYgen', toTerminal: 'CAN2-H', wireColor: 'Yellow/Blue', wireGauge: '0.75mm²', function: 'Controller network' }
        ]
      },
      {
        id: 'eg3200-vt-l1',
        name: 'Generator VT L1',
        type: 'input',
        pinNumber: 'X5-1',
        function: 'Generator voltage sensing Phase 1',
        voltage: '0-480V AC',
        connections: [
          { id: 'vtl1', fromTerminal: 'X5-1', toComponent: 'Generator VT', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Voltage sensing' }
        ]
      },
      {
        id: 'eg3200-ct-l1',
        name: 'Generator CT L1',
        type: 'input',
        pinNumber: 'X6-1',
        function: 'Generator current sensing Phase 1',
        current: '1A or 5A nominal',
        connections: [
          { id: 'ctl1', fromTerminal: 'X6-1', toComponent: 'CT L1', toTerminal: 'S1', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'Current sensing' }
        ]
      },
      {
        id: 'eg3200-gcb-close',
        name: 'GCB Close Output',
        type: 'output',
        pinNumber: 'X7-1',
        function: 'Generator breaker close command',
        voltage: 'Battery voltage or 120VAC',
        current: '5A',
        connections: [
          { id: 'gcb1', fromTerminal: 'X7-1', toComponent: 'Generator CB', toTerminal: 'Close Coil', wireColor: 'Red', wireGauge: '2.5mm²', function: 'Breaker close' }
        ]
      },
      {
        id: 'eg3200-gcb-trip',
        name: 'GCB Trip Output',
        type: 'output',
        pinNumber: 'X7-3',
        function: 'Generator breaker trip command',
        voltage: 'Battery voltage or 120VAC',
        current: '5A',
        connections: [
          { id: 'gcb2', fromTerminal: 'X7-3', toComponent: 'Generator CB', toTerminal: 'Trip Coil', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'Breaker trip' }
        ]
      },
      {
        id: 'eg3200-start',
        name: 'Start Output',
        type: 'output',
        pinNumber: 'X8-1',
        function: 'Engine start relay output',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'start1', fromTerminal: 'X8-1', toComponent: 'Start Relay', toTerminal: 'Coil', wireColor: 'Yellow', wireGauge: '1.5mm²', function: 'Crank signal' }
        ]
      },
      {
        id: 'eg3200-fuel',
        name: 'Fuel/Run Output',
        type: 'output',
        pinNumber: 'X8-3',
        function: 'Fuel solenoid/run relay',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'fuel1', fromTerminal: 'X8-3', toComponent: 'Fuel Solenoid', toTerminal: 'Coil', wireColor: 'Orange', wireGauge: '1.5mm²', function: 'Run command' }
        ]
      },
      {
        id: 'eg3200-eth',
        name: 'Ethernet Port',
        type: 'communication',
        pinNumber: 'X4',
        function: 'Network connectivity',
        connections: [
          { id: 'eth1', fromTerminal: 'X4', toComponent: 'Network Switch', toTerminal: 'Port', wireColor: 'CAT6', wireGauge: 'CAT6', function: 'TCP/IP communication' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/woodward-easygen3200-wiring.svg',
      layers: [
        { id: 'dc-power', name: 'DC Power Supply', color: '#EF4444', visible: true },
        { id: 'can-bus', name: 'CAN Bus Networks', color: '#8B5CF6', visible: true },
        { id: 'ac-sensing', name: 'AC Voltage/Current Sensing', color: '#3B82F6', visible: true },
        { id: 'breaker-ctrl', name: 'Breaker Control', color: '#10B981', visible: true },
        { id: 'engine-ctrl', name: 'Engine Control', color: '#F59E0B', visible: true },
        { id: 'network', name: 'Ethernet/Network', color: '#EC4899', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 40, y: 80 }, to: { x: 140, y: 80 }, wireColor: 'red', label: 'DC+', type: 'power' },
        { id: 'w2', from: { x: 40, y: 100 }, to: { x: 140, y: 100 }, wireColor: 'black', label: 'DC-', type: 'ground' },
        { id: 'w3', from: { x: 260, y: 60 }, to: { x: 400, y: 60 }, wireColor: 'yellow', label: 'CAN1-H', type: 'communication' },
        { id: 'w4', from: { x: 260, y: 80 }, to: { x: 400, y: 80 }, wireColor: 'green', label: 'CAN1-L', type: 'communication' },
        { id: 'w5', from: { x: 260, y: 140 }, to: { x: 400, y: 140 }, wireColor: 'red', label: 'GCB Close', type: 'signal' },
        { id: 'w6', from: { x: 260, y: 160 }, to: { x: 400, y: 160 }, wireColor: 'blue', label: 'GCB Trip', type: 'signal' },
        { id: 'w7', from: { x: 260, y: 200 }, to: { x: 400, y: 200 }, wireColor: 'yellow', label: 'Start', type: 'signal' },
        { id: 'w8', from: { x: 260, y: 220 }, to: { x: 400, y: 220 }, wireColor: 'orange', label: 'Fuel', type: 'signal' },
        { id: 'w9', from: { x: 140, y: 280 }, to: { x: 40, y: 320 }, wireColor: 'brown', label: 'VT L1', type: 'signal' },
        { id: 'w10', from: { x: 140, y: 300 }, to: { x: 40, y: 360 }, wireColor: 'blue', label: 'CT L1', type: 'signal' }
      ],
      components: [
        { id: 'dc-supply', name: '24V DC Supply', position: { x: 10, y: 70 }, size: { width: 40, height: 50 }, type: 'supply', terminals: ['+', '-'] },
        { id: 'controller', name: 'easYgen-3200XT', position: { x: 140, y: 30 }, size: { width: 120, height: 290 }, type: 'controller', terminals: ['X1', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8'] },
        { id: 'ecm', name: 'Engine ECM', position: { x: 400, y: 40 }, size: { width: 80, height: 70 }, type: 'ecm', terminals: ['CAN-H', 'CAN-L', 'Power', 'GND'] },
        { id: 'gcb', name: 'Generator CB', position: { x: 400, y: 120 }, size: { width: 60, height: 60 }, type: 'breaker', terminals: ['Close', 'Trip', 'Aux'] },
        { id: 'start-relay', name: 'Start Relay', position: { x: 400, y: 190 }, size: { width: 50, height: 30 }, type: 'relay', terminals: ['Coil', 'NO', 'COM'] },
        { id: 'fuel-sol', name: 'Fuel Solenoid', position: { x: 400, y: 230 }, size: { width: 50, height: 30 }, type: 'solenoid', terminals: ['Coil', 'GND'] },
        { id: 'vt', name: 'VT Cabinet', position: { x: 10, y: 300 }, size: { width: 50, height: 50 }, type: 'vt', terminals: ['L1', 'L2', 'L3', 'N'] },
        { id: 'ct', name: 'CT Cabinet', position: { x: 10, y: 360 }, size: { width: 50, height: 50 }, type: 'ct', terminals: ['L1', 'L2', 'L3'] }
      ]
    },
    faultCodes: ['WW-1001', 'WW-1002', 'WW-2001', 'WW-2002', 'WW-3001', 'WW-3002', 'WW-4001', 'WW-4002', 'WW-5001', 'WW-5002'],
    troubleshooting: [
      {
        symptom: 'Governor not responding to speed commands',
        possibleCauses: [
          'Analog output configuration wrong',
          'Actuator wiring fault',
          'Actuator failure',
          'PID settings incorrect',
          'Speed feedback loss'
        ],
        diagnosticSteps: [
          'Verify analog output configured for governor',
          'Check output voltage at controller terminals during speed command',
          'Verify actuator power supply',
          'Check actuator position feedback if equipped',
          'Review PID settings in ToolKit software'
        ],
        solution: 'Correct configuration, repair wiring, or replace actuator',
        tools: ['Multimeter', 'ToolKit software', 'Actuator tester'],
        time: '1-4 hours'
      },
      {
        symptom: 'Multiple generators not load sharing equally',
        possibleCauses: [
          'CT polarity mismatch',
          'Droop settings different',
          'Governor response mismatch',
          'Network communication issues',
          'Cross-current compensation wrong'
        ],
        diagnosticSteps: [
          'Verify CT polarity on all units',
          'Compare droop settings between units',
          'Check CAN2 network integrity',
          'Monitor individual load readings',
          'Review cross-current compensation settings'
        ],
        solution: 'Match CT polarity, equalize settings, repair network',
        tools: ['ToolKit software', 'Clamp meter', 'CAN analyzer'],
        time: '2-8 hours'
      },
      {
        symptom: 'Synchronizing fails repeatedly',
        possibleCauses: [
          'Frequency window too narrow',
          'Voltage window too narrow',
          'Slip too high',
          'AVR not trimming',
          'Governor not trimming'
        ],
        diagnosticSteps: [
          'Monitor sync window parameters',
          'Check frequency trim output responds',
          'Check voltage trim output responds',
          'Verify synch check relay operation',
          'Test with wider windows temporarily'
        ],
        solution: 'Adjust windows, repair trim outputs, tune response',
        tools: ['ToolKit software', 'Oscilloscope', 'Synchroscope'],
        time: '2-6 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Preparation',
        description: 'Cut aperture 273mm x 201mm. Mount controller using provided clips.',
        warnings: ['De-energize panel before work', 'Allow 100mm clearance behind'],
        tips: ['Use template from manual', 'Verify gasket placement']
      },
      {
        step: 2,
        title: 'DC Power Supply',
        description: 'Connect 24VDC to X1-1 (+) and X1-2 (-) through 10A fuse.',
        warnings: ['Observe polarity', 'Use proper wire gauge for distance'],
        tips: ['Install isolation switch', 'Consider redundant supply for critical applications']
      },
      {
        step: 3,
        title: 'CAN1 Engine Bus',
        description: 'Connect engine ECM via X3-1 (CAN-H) and X3-2 (CAN-L). Use twisted pair shielded cable.',
        warnings: ['Install 120 ohm termination at each end', 'Maximum 40m bus length'],
        tips: ['Use Woodward recommended cable', 'Shield to ground at one point']
      },
      {
        step: 4,
        title: 'CAN2 Controller Network',
        description: 'Connect to other easYgen units via X3-5/X3-6 for load sharing.',
        warnings: ['Same termination requirements as CAN1'],
        tips: ['Use separate cable from CAN1', 'Document addresses']
      },
      {
        step: 5,
        title: 'Generator Metering',
        description: 'Connect VTs to X5, CTs to X6. Match ratios in configuration.',
        warnings: ['High voltage - qualified personnel only', 'Never open CT secondary'],
        tips: ['Use shielded cable for CTs', 'Verify phase rotation']
      },
      {
        step: 6,
        title: 'Breaker Control',
        description: 'Wire GCB close to X7-1, trip to X7-3. Connect breaker status to inputs.',
        warnings: ['Match coil voltage to output', 'Verify trip circuit integrity'],
        tips: ['Use interposing relay if needed', 'Test close/trip manually first']
      },
      {
        step: 7,
        title: 'Engine Control Outputs',
        description: 'Connect start relay to X8-1, fuel solenoid to X8-3.',
        warnings: ['Use relay for loads over 3A', 'Add suppression diodes'],
        tips: ['Test each output individually', 'Verify fuel solenoid fail-safe direction']
      },
      {
        step: 8,
        title: 'Network Setup',
        description: 'Connect Ethernet to X4. Configure IP address via ToolKit.',
        warnings: ['Secure network configuration', 'Use dedicated VLAN if possible'],
        tips: ['Document IP addressing', 'Test connectivity before commissioning']
      },
      {
        step: 9,
        title: 'Configuration and Commissioning',
        description: 'Use ToolKit Pro software to load application and configure all parameters.',
        warnings: ['Back up before making changes', 'Test all protections before service'],
        tips: ['Use application templates', 'Document all settings']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Display and Interface Check',
        interval: 'Weekly',
        procedure: ['Verify display clarity and touch response', 'Check LED indicators', 'Review active alarms', 'Verify communication status'],
        tools: ['None required']
      },
      {
        task: 'Metering Accuracy Verification',
        interval: 'Monthly',
        procedure: ['Compare displayed values to external instruments', 'Check all three phases', 'Verify power factor readings', 'Check energy totalization'],
        tools: ['Calibrated multimeter', 'Power analyzer']
      },
      {
        task: 'Communication Test',
        interval: 'Monthly',
        procedure: ['Verify CAN1 ECM communication', 'Test CAN2 unit-to-unit communication', 'Test Ethernet access', 'Verify Modbus responses'],
        tools: ['ToolKit Pro', 'Network analyzer']
      },
      {
        task: 'Terminal Inspection',
        interval: 'Quarterly',
        procedure: ['Check all terminal tightness', 'Inspect for corrosion', 'Verify cable condition', 'Check strain relief'],
        tools: ['Torque driver', 'Contact cleaner']
      },
      {
        task: 'Protection System Test',
        interval: 'Quarterly',
        procedure: ['Test emergency stop function', 'Verify overspeed protection', 'Test reverse power protection', 'Test differential protection if fitted'],
        tools: ['Test equipment', 'Injection set'],
        parts: ['None typically']
      },
      {
        task: 'Software Update Check',
        interval: 'Semi-annually',
        procedure: ['Check for firmware updates', 'Review release notes', 'Plan update window', 'Back up configuration', 'Apply update if warranted'],
        tools: ['ToolKit Pro', 'USB drive']
      }
    ],
    repairGuide: [
      {
        issue: 'Touchscreen not responding',
        difficulty: 'Medium',
        tools: ['Torx drivers', 'Isopropyl alcohol', 'Microfiber cloth', 'Anti-static strap'],
        parts: ['Screen assembly if required'],
        steps: [
          'Clean screen with microfiber cloth and isopropyl',
          'Allow to dry completely',
          'Test touch response',
          'If still failing, recalibrate touch in service menu',
          'If calibration fails, screen assembly may need replacement',
          'Contact Woodward service for screen replacement'
        ],
        testProcedure: ['Test all screen areas', 'Test swipe gestures', 'Test button presses'],
        safetyWarnings: ['Do not use abrasive cleaners', 'Do not press hard on screen'],
        estimatedTime: '30-60 minutes',
        estimatedCost: 'KES 0 - 85,000 (if screen replacement needed)'
      },
      {
        issue: 'Analog output stuck at zero',
        difficulty: 'Advanced',
        tools: ['Multimeter', 'Oscilloscope', 'ToolKit Pro software'],
        parts: ['None typically - configuration issue common'],
        steps: [
          'Verify output is configured correctly in ToolKit',
          'Check output range settings (0-10V, 4-20mA, etc.)',
          'Connect load resistor and measure voltage',
          'Test with test command from ToolKit',
          'If no output with test command, hardware issue',
          'Check PCB for damaged components around output stage',
          'Board level repair or replacement required'
        ],
        testProcedure: ['Test across full range', 'Test with actual load', 'Monitor for drift'],
        safetyWarnings: ['Analog outputs can affect running equipment', 'Isolate actuator before testing'],
        estimatedTime: '1-3 hours',
        estimatedCost: 'KES 0 - 150,000 (board replacement)'
      }
    ],
    price: { min: 350000, max: 550000 },
    spareParts: [
      { partNumber: 'EG3200-SCREEN', name: 'Touchscreen Assembly', price: { min: 75000, max: 95000 }, availability: 'Order' },
      { partNumber: 'EG3200-MB', name: 'Main CPU Board', price: { min: 180000, max: 250000 }, availability: 'Order' },
      { partNumber: 'EG3200-IO', name: 'I/O Board', price: { min: 95000, max: 140000 }, availability: 'Order' },
      { partNumber: 'EG3200-PSU', name: 'Power Supply Module', price: { min: 45000, max: 65000 }, availability: 'In Stock' },
      { partNumber: 'EG-CONN-SET', name: 'Connector Set', price: { min: 15000, max: 25000 }, availability: 'In Stock' },
      { partNumber: 'EG-GASKET', name: 'Front Gasket', price: { min: 5000, max: 8000 }, availability: 'In Stock' }
    ]
  }
];

// Export functions
export const getAllWoodwardControllers = () => WOODWARD_CONTROLLERS;
export const getWoodwardControllerById = (id: string) => WOODWARD_CONTROLLERS.find(c => c.id === id);
