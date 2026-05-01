/**
 * SMARTGEN CONTROLLER SCHEMATICS DATABASE
 *
 * Complete wiring diagrams for SmartGen HGM series controllers
 */

import { ControllerSchematic } from './index';

export const SMARTGEN_CONTROLLERS: ControllerSchematic[] = [
  {
    id: 'smartgen-hgm6120',
    manufacturer: 'SmartGen',
    model: 'HGM6120',
    fullName: 'SmartGen HGM6120 Automatic Mains Failure Controller',
    image: '/images/controllers/smartgen-hgm6120.jpg',
    description: 'Cost-effective automatic mains failure controller for single generator sets with comprehensive engine protection and intuitive operation.',
    applications: ['Standby generators', 'Residential', 'Small commercial', 'Telecom backup'],
    features: [
      'LCD display with backlight',
      'Automatic mains failure',
      'Engine protection functions',
      'Manual/Auto/Test modes',
      'Event logging',
      'USB configuration port',
      'RS485 communication',
      'Multiple language support'
    ],
    specifications: {
      supplyVoltage: '8-35V DC',
      operatingTemp: '-25°C to +70°C',
      displayType: 'LCD with LED indicators',
      communication: ['RS485', 'USB'],
      inputs: 6,
      outputs: 5,
      dimensions: '175mm x 135mm x 50mm',
      weight: '0.5kg'
    },
    terminals: [
      {
        id: 'hgm6120-b+',
        name: 'Battery Positive',
        type: 'power',
        pinNumber: '1',
        function: 'DC power supply positive',
        voltage: '8-35V DC',
        current: '150mA typical',
        connections: [
          { id: 'b+1', fromTerminal: '1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '2.5mm²', function: 'Power', voltage: '12/24V DC' }
        ]
      },
      {
        id: 'hgm6120-b-',
        name: 'Battery Negative',
        type: 'ground',
        pinNumber: '2',
        function: 'DC ground',
        voltage: '0V',
        connections: [
          { id: 'b-1', fromTerminal: '2', toComponent: 'Battery', toTerminal: '-', wireColor: 'Black', wireGauge: '2.5mm²', function: 'Ground' }
        ]
      },
      {
        id: 'hgm6120-start',
        name: 'Start Output',
        type: 'output',
        pinNumber: '3',
        function: 'Starter relay control',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'start1', fromTerminal: '3', toComponent: 'Starter Relay', toTerminal: 'Coil+', wireColor: 'Yellow', wireGauge: '1.5mm²', function: 'Crank' }
        ]
      },
      {
        id: 'hgm6120-fuel',
        name: 'Fuel Output',
        type: 'output',
        pinNumber: '4',
        function: 'Fuel solenoid control',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'fuel1', fromTerminal: '4', toComponent: 'Fuel Solenoid', toTerminal: 'Coil', wireColor: 'Orange', wireGauge: '1.5mm²', function: 'Run' }
        ]
      },
      {
        id: 'hgm6120-gcb',
        name: 'GCB Output',
        type: 'output',
        pinNumber: '5',
        function: 'Generator breaker control',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'gcb1', fromTerminal: '5', toComponent: 'GCB Relay', toTerminal: 'Coil', wireColor: 'Red', wireGauge: '1.5mm²', function: 'Breaker close' }
        ]
      },
      {
        id: 'hgm6120-mcb',
        name: 'MCB Output',
        type: 'output',
        pinNumber: '6',
        function: 'Mains breaker control',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'mcb1', fromTerminal: '6', toComponent: 'MCB Relay', toTerminal: 'Coil', wireColor: 'Blue', wireGauge: '1.5mm²', function: 'Breaker close' }
        ]
      },
      {
        id: 'hgm6120-mpu',
        name: 'MPU Speed Input',
        type: 'input',
        pinNumber: '7',
        function: 'Magnetic pickup for speed',
        connections: [
          { id: 'mpu1', fromTerminal: '7', toComponent: 'Magnetic Pickup', toTerminal: 'Signal', wireColor: 'White', wireGauge: '0.75mm²', function: 'Speed signal' }
        ]
      },
      {
        id: 'hgm6120-oilp',
        name: 'Oil Pressure Input',
        type: 'input',
        pinNumber: '8',
        function: 'Oil pressure sender',
        connections: [
          { id: 'oil1', fromTerminal: '8', toComponent: 'Oil Sender', toTerminal: 'S', wireColor: 'Pink', wireGauge: '0.75mm²', function: 'Oil pressure' }
        ]
      },
      {
        id: 'hgm6120-temp',
        name: 'Temperature Input',
        type: 'input',
        pinNumber: '9',
        function: 'Coolant temperature sender',
        connections: [
          { id: 'temp1', fromTerminal: '9', toComponent: 'Temp Sender', toTerminal: 'S', wireColor: 'Green', wireGauge: '0.75mm²', function: 'Temperature' }
        ]
      },
      {
        id: 'hgm6120-gen-l1',
        name: 'Generator L1',
        type: 'input',
        pinNumber: '10',
        function: 'Generator voltage phase 1',
        voltage: '0-300V AC',
        connections: [
          { id: 'gl1', fromTerminal: '10', toComponent: 'Generator', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Gen sensing' }
        ]
      },
      {
        id: 'hgm6120-mains-l1',
        name: 'Mains L1',
        type: 'input',
        pinNumber: '11',
        function: 'Mains voltage phase 1',
        voltage: '0-300V AC',
        connections: [
          { id: 'ml1', fromTerminal: '11', toComponent: 'Mains Supply', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Mains sensing' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/smartgen-hgm6120-wiring.svg',
      layers: [
        { id: 'power', name: 'DC Power', color: '#EF4444', visible: true },
        { id: 'outputs', name: 'Relay Outputs', color: '#F59E0B', visible: true },
        { id: 'sensors', name: 'Sensor Inputs', color: '#10B981', visible: true },
        { id: 'ac', name: 'AC Sensing', color: '#3B82F6', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 30, y: 60 }, to: { x: 100, y: 60 }, wireColor: 'red', label: 'B+', type: 'power' },
        { id: 'w2', from: { x: 30, y: 80 }, to: { x: 100, y: 80 }, wireColor: 'black', label: 'B-', type: 'ground' },
        { id: 'w3', from: { x: 200, y: 50 }, to: { x: 280, y: 50 }, wireColor: 'yellow', label: 'Start', type: 'signal' },
        { id: 'w4', from: { x: 200, y: 70 }, to: { x: 280, y: 70 }, wireColor: 'orange', label: 'Fuel', type: 'signal' },
        { id: 'w5', from: { x: 200, y: 90 }, to: { x: 280, y: 90 }, wireColor: 'red', label: 'GCB', type: 'signal' },
        { id: 'w6', from: { x: 200, y: 110 }, to: { x: 280, y: 110 }, wireColor: 'blue', label: 'MCB', type: 'signal' }
      ],
      components: [
        { id: 'battery', name: 'Battery', position: { x: 10, y: 50 }, size: { width: 30, height: 45 }, type: 'battery', terminals: ['+', '-'] },
        { id: 'controller', name: 'HGM6120', position: { x: 100, y: 30 }, size: { width: 100, height: 140 }, type: 'controller', terminals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] },
        { id: 'start-relay', name: 'Start Relay', position: { x: 280, y: 40 }, size: { width: 40, height: 25 }, type: 'relay', terminals: ['Coil', 'NO', 'COM'] },
        { id: 'fuel-sol', name: 'Fuel Sol', position: { x: 280, y: 70 }, size: { width: 40, height: 25 }, type: 'solenoid', terminals: ['Coil', 'GND'] }
      ]
    },
    faultCodes: ['SG-1001', 'SG-1002', 'SG-2001', 'SG-2002', 'SG-3001', 'SG-4001'],
    troubleshooting: [
      {
        symptom: 'Engine cranks but won\'t start',
        possibleCauses: [
          'Fuel solenoid not energizing',
          'Fuel supply issue',
          'Air in fuel system',
          'Speed signal not detected'
        ],
        diagnosticSteps: [
          'Check fuel output during crank',
          'Listen for fuel solenoid click',
          'Check fuel level and filters',
          'Verify MPU signal on display'
        ],
        solution: 'Repair fuel circuit, prime fuel system, or fix MPU',
        tools: ['Multimeter', 'Test light'],
        time: '30-120 minutes'
      },
      {
        symptom: 'Generator runs but load not transferred',
        possibleCauses: [
          'Generator voltage/frequency out of range',
          'GCB relay failure',
          'Breaker feedback issue',
          'Timer not expired'
        ],
        diagnosticSteps: [
          'Check generator voltage and frequency readings',
          'Verify GCB output energizes',
          'Check breaker position feedback',
          'Wait for transfer timer to expire'
        ],
        solution: 'Adjust gen parameters, repair GCB circuit, fix feedback',
        tools: ['Multimeter', 'PC software'],
        time: '30-90 minutes'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Mounting',
        description: 'Cut 170mm x 130mm aperture. Secure controller with clips.',
        warnings: ['Ensure panel is de-energized'],
        tips: ['Allow 30mm clearance behind']
      },
      {
        step: 2,
        title: 'DC Power',
        description: 'Connect terminal 1 to B+ through 5A fuse, terminal 2 to B-.',
        warnings: ['Observe polarity'],
        tips: ['Use crimp terminals']
      },
      {
        step: 3,
        title: 'Engine Outputs',
        description: 'Wire start relay to terminal 3, fuel solenoid to terminal 4.',
        warnings: ['Use relay for loads over 3A'],
        tips: ['Add flyback diodes']
      },
      {
        step: 4,
        title: 'Breaker Control',
        description: 'Connect GCB to terminal 5, MCB to terminal 6.',
        warnings: ['Verify breaker coil compatibility'],
        tips: ['Use interposing relay if needed']
      },
      {
        step: 5,
        title: 'Sensors',
        description: 'Wire MPU to terminal 7, oil pressure to terminal 8, temperature to terminal 9.',
        warnings: ['Use shielded cable for MPU'],
        tips: ['Configure sender types in software']
      },
      {
        step: 6,
        title: 'AC Sensing',
        description: 'Connect generator L1/N to terminals 10/12, mains L1/N to terminals 11/13.',
        warnings: ['High voltage - qualified electrician only'],
        tips: ['Install through MCB for isolation']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: ['Check display', 'Verify LED indicators', 'Inspect wiring', 'Check ventilation'],
        tools: ['Flashlight']
      },
      {
        task: 'Terminal Tightness',
        interval: '6 months',
        procedure: ['Check all terminals', 'Re-torque if loose', 'Check wire condition'],
        tools: ['Screwdriver']
      },
      {
        task: 'Functional Test',
        interval: 'Monthly',
        procedure: ['Test manual start', 'Simulate mains fail', 'Verify transfer', 'Test retransfer'],
        tools: ['Mains simulator']
      }
    ],
    repairGuide: [
      {
        issue: 'Display not working',
        difficulty: 'Easy',
        tools: ['Multimeter', 'Screwdriver'],
        parts: ['Display module'],
        steps: [
          'Check power supply voltage at terminals',
          'If voltage OK, disconnect and reconnect display ribbon',
          'If still no display, replace display module or controller'
        ],
        testProcedure: ['Verify all segments display', 'Check backlight'],
        safetyWarnings: ['Work with power off'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 8,000 - 25,000'
      }
    ],
    price: { min: 28000, max: 42000 },
    spareParts: [
      { partNumber: 'HGM6120-DISP', name: 'Display Module', price: { min: 8000, max: 12000 }, availability: 'In Stock' },
      { partNumber: 'HGM6120-KB', name: 'Keypad', price: { min: 4000, max: 6000 }, availability: 'In Stock' },
      { partNumber: 'HGM-CONN', name: 'Connector Set', price: { min: 2000, max: 3500 }, availability: 'In Stock' }
    ]
  },
  {
    id: 'smartgen-hgm9320',
    manufacturer: 'SmartGen',
    model: 'HGM9320',
    fullName: 'SmartGen HGM9320 AMF Controller with CAN',
    image: '/images/controllers/smartgen-hgm9320.jpg',
    description: 'Advanced AMF controller with J1939 CAN bus, color display, and comprehensive protection for electronic engines.',
    applications: ['Electronic engine gensets', 'Commercial standby', 'Industrial backup', 'Data centers'],
    features: [
      '4.3" TFT color display',
      'J1939 CAN bus communication',
      'Automatic synchronizing',
      'Comprehensive protection',
      'Event logging (500 events)',
      'Ethernet option',
      'SMS/GPRS monitoring',
      'Multiple generator parallel'
    ],
    specifications: {
      supplyVoltage: '8-35V DC',
      operatingTemp: '-30°C to +70°C',
      displayType: '4.3" TFT Color LCD',
      communication: ['CAN J1939', 'RS485', 'Ethernet', 'USB'],
      inputs: 12,
      outputs: 8,
      dimensions: '245mm x 185mm x 55mm',
      weight: '0.9kg'
    },
    terminals: [
      {
        id: 'hgm9320-pwr',
        name: 'Power Supply',
        type: 'power',
        pinNumber: 'A1/A2',
        function: 'DC power input',
        voltage: '8-35V DC',
        connections: [
          { id: 'pwr1', fromTerminal: 'A1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '4mm²', function: 'Power' }
        ]
      },
      {
        id: 'hgm9320-can-h',
        name: 'CAN High',
        type: 'communication',
        pinNumber: 'C1',
        function: 'J1939 CAN bus high',
        connections: [
          { id: 'canh', fromTerminal: 'C1', toComponent: 'ECM', toTerminal: 'CAN-H', wireColor: 'Yellow', wireGauge: '0.75mm²', function: 'CAN High' }
        ]
      },
      {
        id: 'hgm9320-can-l',
        name: 'CAN Low',
        type: 'communication',
        pinNumber: 'C2',
        function: 'J1939 CAN bus low',
        connections: [
          { id: 'canl', fromTerminal: 'C2', toComponent: 'ECM', toTerminal: 'CAN-L', wireColor: 'Green', wireGauge: '0.75mm²', function: 'CAN Low' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/smartgen-hgm9320-wiring.svg',
      layers: [
        { id: 'power', name: 'DC Power', color: '#EF4444', visible: true },
        { id: 'can', name: 'CAN Bus', color: '#8B5CF6', visible: true },
        { id: 'outputs', name: 'Outputs', color: '#F59E0B', visible: true },
        { id: 'sensing', name: 'AC Sensing', color: '#3B82F6', visible: true }
      ],
      connections: [],
      components: []
    },
    faultCodes: ['SG-1001', 'SG-1002', 'SG-2001', 'SG-2002', 'SG-3001', 'SG-4001', 'SG-5001'],
    troubleshooting: [
      {
        symptom: 'No CAN communication',
        possibleCauses: ['Wiring fault', 'Termination missing', 'Baud rate wrong', 'Address conflict'],
        diagnosticSteps: ['Check CAN wiring', 'Verify termination', 'Check baud rate (250k)', 'Verify ECM address'],
        solution: 'Correct wiring or configuration',
        tools: ['Multimeter', 'CAN analyzer'],
        time: '1-3 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Mounting',
        description: 'Cut aperture and mount controller.',
        warnings: ['De-energize panel'],
        tips: ['Use template']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Communication Check',
        interval: 'Monthly',
        procedure: ['Verify CAN status', 'Check all readings', 'Test alarms'],
        tools: ['None']
      }
    ],
    repairGuide: [],
    price: { min: 85000, max: 125000 },
    spareParts: [
      { partNumber: 'HGM9320-DISP', name: 'Display', price: { min: 28000, max: 38000 }, availability: 'In Stock' }
    ]
  }
];

export const getAllSmartGenControllers = () => SMARTGEN_CONTROLLERS;
export const getSmartGenControllerById = (id: string) => SMARTGEN_CONTROLLERS.find(c => c.id === id);
