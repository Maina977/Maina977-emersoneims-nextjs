/**
 * COMAP CONTROLLER SCHEMATICS DATABASE
 *
 * Complete wiring diagrams for ComAp InteliGen, InteliLite, and InteliMains series
 */

import { ControllerSchematic } from './index';

export const COMAP_CONTROLLERS: ControllerSchematic[] = [
  {
    id: 'comap-intelilite-amf25',
    manufacturer: 'ComAp',
    model: 'InteliLite AMF25',
    fullName: 'InteliLite AMF25 Automatic Mains Failure Controller',
    image: '/images/controllers/comap-amf25.jpg',
    description: 'Compact all-in-one controller for single standby generating sets with mains failure protection and comprehensive engine protection.',
    applications: ['Standby generators', 'Small commercial', 'Residential backup', 'Telecom sites'],
    features: [
      'Integrated automatic mains failure',
      'Binary and analog inputs',
      'Comprehensive engine protection',
      'True RMS voltage measurement',
      'Event history logging',
      'USB configuration',
      'Plug & Play installation',
      'Optional GPRS/Ethernet module'
    ],
    specifications: {
      supplyVoltage: '8-36V DC',
      operatingTemp: '-30°C to +70°C',
      displayType: 'Graphic LCD with backlight',
      communication: ['RS232', 'RS485', 'USB'],
      inputs: 6,
      outputs: 5,
      dimensions: '172mm x 134mm x 64mm',
      weight: '0.6kg'
    },
    terminals: [
      {
        id: 'amf25-j1-1',
        name: 'Power Supply +',
        type: 'power',
        pinNumber: 'J1-1',
        function: 'DC power input positive',
        voltage: '8-36V DC',
        current: '300mA typical',
        connections: [
          { id: 'pwr1', fromTerminal: 'J1-1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '2.5mm²', function: 'Power supply', voltage: '12/24V DC' }
        ]
      },
      {
        id: 'amf25-j1-2',
        name: 'Power Supply -',
        type: 'ground',
        pinNumber: 'J1-2',
        function: 'DC power ground',
        voltage: '0V',
        connections: [
          { id: 'gnd1', fromTerminal: 'J1-2', toComponent: 'Battery', toTerminal: '-', wireColor: 'Black', wireGauge: '2.5mm²', function: 'Ground' }
        ]
      },
      {
        id: 'amf25-j2-1',
        name: 'Start Relay Output',
        type: 'output',
        pinNumber: 'J2-1',
        function: 'Starter motor relay control',
        voltage: 'Battery voltage',
        current: '5A max',
        connections: [
          { id: 'start1', fromTerminal: 'J2-1', toComponent: 'Starter Relay', toTerminal: 'Coil+', wireColor: 'Yellow', wireGauge: '1.5mm²', function: 'Start signal' }
        ]
      },
      {
        id: 'amf25-j2-2',
        name: 'Fuel Relay Output',
        type: 'output',
        pinNumber: 'J2-2',
        function: 'Fuel/Run solenoid control',
        voltage: 'Battery voltage',
        current: '5A max',
        connections: [
          { id: 'fuel1', fromTerminal: 'J2-2', toComponent: 'Fuel Solenoid', toTerminal: 'Coil', wireColor: 'Orange', wireGauge: '1.5mm²', function: 'Run relay' }
        ]
      },
      {
        id: 'amf25-j3-1',
        name: 'Oil Pressure Input',
        type: 'input',
        pinNumber: 'J3-1',
        function: 'Oil pressure sender or switch',
        connections: [
          { id: 'oil1', fromTerminal: 'J3-1', toComponent: 'Oil Pressure Sender', toTerminal: 'S', wireColor: 'Pink', wireGauge: '0.75mm²', function: 'Oil pressure' }
        ]
      },
      {
        id: 'amf25-j3-2',
        name: 'Temperature Input',
        type: 'input',
        pinNumber: 'J3-2',
        function: 'Coolant temperature sender',
        connections: [
          { id: 'temp1', fromTerminal: 'J3-2', toComponent: 'Temp Sender', toTerminal: 'S', wireColor: 'Brown', wireGauge: '0.75mm²', function: 'Temperature' }
        ]
      },
      {
        id: 'amf25-j4-1',
        name: 'Magnetic Pickup +',
        type: 'input',
        pinNumber: 'J4-1',
        function: 'Speed sensor positive',
        connections: [
          { id: 'mpu1', fromTerminal: 'J4-1', toComponent: 'MPU', toTerminal: '+', wireColor: 'White/Blue', wireGauge: '0.75mm²', function: 'Speed signal+' }
        ]
      },
      {
        id: 'amf25-j4-2',
        name: 'Magnetic Pickup -',
        type: 'input',
        pinNumber: 'J4-2',
        function: 'Speed sensor negative',
        connections: [
          { id: 'mpu2', fromTerminal: 'J4-2', toComponent: 'MPU', toTerminal: '-', wireColor: 'White', wireGauge: '0.75mm²', function: 'Speed signal-' }
        ]
      },
      {
        id: 'amf25-j5-1',
        name: 'Mains L1',
        type: 'input',
        pinNumber: 'J5-1',
        function: 'Mains voltage phase 1',
        voltage: '0-300V AC',
        connections: [
          { id: 'ml1', fromTerminal: 'J5-1', toComponent: 'Mains Supply', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Mains L1 sensing' }
        ]
      },
      {
        id: 'amf25-j6-1',
        name: 'Generator L1',
        type: 'input',
        pinNumber: 'J6-1',
        function: 'Generator voltage phase 1',
        voltage: '0-300V AC',
        connections: [
          { id: 'gl1', fromTerminal: 'J6-1', toComponent: 'Generator Output', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Gen L1 sensing' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/comap-amf25-wiring.svg',
      layers: [
        { id: 'power', name: 'DC Power', color: '#EF4444', visible: true },
        { id: 'ac-mains', name: 'Mains AC', color: '#3B82F6', visible: true },
        { id: 'ac-gen', name: 'Generator AC', color: '#10B981', visible: true },
        { id: 'sensors', name: 'Sensors', color: '#F59E0B', visible: true },
        { id: 'outputs', name: 'Outputs', color: '#8B5CF6', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 40, y: 100 }, to: { x: 120, y: 100 }, wireColor: 'red', label: 'B+', type: 'power' },
        { id: 'w2', from: { x: 40, y: 120 }, to: { x: 120, y: 120 }, wireColor: 'black', label: 'B-', type: 'ground' },
        { id: 'w3', from: { x: 220, y: 80 }, to: { x: 320, y: 80 }, wireColor: 'yellow', label: 'Start', type: 'signal' },
        { id: 'w4', from: { x: 220, y: 100 }, to: { x: 320, y: 100 }, wireColor: 'orange', label: 'Fuel', type: 'signal' },
        { id: 'w5', from: { x: 120, y: 200 }, to: { x: 40, y: 250 }, wireColor: 'brown', label: 'Mains L1', type: 'power' },
        { id: 'w6', from: { x: 220, y: 200 }, to: { x: 320, y: 250 }, wireColor: 'brown', label: 'Gen L1', type: 'power' }
      ],
      components: [
        { id: 'battery', name: '12/24V Battery', position: { x: 10, y: 90 }, size: { width: 35, height: 45 }, type: 'battery', terminals: ['+', '-'] },
        { id: 'controller', name: 'AMF25', position: { x: 120, y: 60 }, size: { width: 100, height: 160 }, type: 'controller', terminals: ['J1-1', 'J1-2', 'J2-1', 'J2-2', 'J5-1', 'J6-1'] },
        { id: 'starter-relay', name: 'Starter Relay', position: { x: 320, y: 70 }, size: { width: 40, height: 30 }, type: 'relay', terminals: ['Coil+', 'Coil-', 'NO', 'COM'] },
        { id: 'fuel-sol', name: 'Fuel Solenoid', position: { x: 320, y: 110 }, size: { width: 40, height: 30 }, type: 'solenoid', terminals: ['Coil', 'GND'] },
        { id: 'mains', name: 'Mains Supply', position: { x: 10, y: 240 }, size: { width: 40, height: 40 }, type: 'supply', terminals: ['L1', 'L2', 'L3', 'N'] },
        { id: 'genset', name: 'Generator', position: { x: 320, y: 240 }, size: { width: 60, height: 40 }, type: 'generator', terminals: ['L1', 'L2', 'L3', 'N'] }
      ]
    },
    faultCodes: ['COM-1101', 'COM-1102', 'COM-2001', 'COM-2002', 'COM-3001', 'COM-3002', 'COM-4001'],
    troubleshooting: [
      {
        symptom: 'Display shows "SD card error"',
        possibleCauses: [
          'SD card not inserted properly',
          'SD card corrupted',
          'SD card slot failure'
        ],
        diagnosticSteps: [
          'Remove and reinsert SD card',
          'Try formatting SD card in PC (FAT32)',
          'Test with known good SD card',
          'Check for bent pins in slot'
        ],
        solution: 'Replace SD card or format existing card',
        tools: ['PC with card reader', 'Replacement SD card'],
        time: '15-30 minutes'
      },
      {
        symptom: 'No mains voltage reading',
        possibleCauses: [
          'Mains supply disconnected',
          'Voltage sensing fuse blown',
          'Wiring fault',
          'Input circuit failure'
        ],
        diagnosticSteps: [
          'Verify mains is actually present with multimeter',
          'Check voltage sensing fuse',
          'Verify wiring continuity to controller',
          'Test voltage at controller terminals'
        ],
        solution: 'Replace fuse, repair wiring, or service controller',
        tools: ['Multimeter', 'Fuse tester'],
        time: '30-60 minutes'
      },
      {
        symptom: 'Engine starts but immediately shuts down',
        possibleCauses: [
          'Oil pressure not reaching threshold',
          'Oil pressure sender/wiring fault',
          'Oil pressure delay time too short',
          'Actual low oil pressure'
        ],
        diagnosticSteps: [
          'Check actual oil pressure with mechanical gauge',
          'Verify sender wiring and ground',
          'Check oil pressure alarm setpoint',
          'Increase oil pressure delay time temporarily to test'
        ],
        solution: 'Adjust settings, repair sender circuit, or address actual oil issue',
        tools: ['Mechanical oil pressure gauge', 'Multimeter', 'InteliConfig software'],
        time: '30-120 minutes'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Cutout',
        description: 'Create 157mm x 120mm cutout in control panel. Allow minimum 50mm clearance behind controller.',
        warnings: ['De-energize panel before cutting', 'Wear eye protection'],
        tips: ['Use provided template', 'File edges smooth']
      },
      {
        step: 2,
        title: 'Mount Controller',
        description: 'Insert from front, secure with mounting clips from behind.',
        warnings: ['Do not overtighten'],
        tips: ['Verify rubber gasket is in place for IP65']
      },
      {
        step: 3,
        title: 'DC Power Wiring',
        description: 'Connect J1-1 to battery positive through 5A fuse, J1-2 to battery negative.',
        warnings: ['Observe correct polarity', 'Use adequately rated fuse'],
        tips: ['Use ferrules on wire ends']
      },
      {
        step: 4,
        title: 'Engine Interface Wiring',
        description: 'Connect oil pressure to J3-1, temperature to J3-2, MPU to J4-1/J4-2.',
        warnings: ['Use shielded cable for MPU'],
        tips: ['Configure sender type in InteliConfig software']
      },
      {
        step: 5,
        title: 'AC Voltage Sensing',
        description: 'Wire mains phase voltages to J5, generator voltages to J6.',
        warnings: ['High voltage - qualified electrician required', 'Install through MCB'],
        tips: ['Match phase rotation between mains and gen']
      },
      {
        step: 6,
        title: 'Output Connections',
        description: 'Connect start relay to J2-1, fuel solenoid to J2-2.',
        warnings: ['Use relay for loads over 5A'],
        tips: ['Add flyback diode across inductive loads']
      },
      {
        step: 7,
        title: 'Configuration',
        description: 'Connect USB, use InteliConfig software to set engine parameters.',
        warnings: ['Back up configuration before changes'],
        tips: ['Start with supplied template for engine type']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: ['Check display clarity', 'Inspect for physical damage', 'Verify LED indicators', 'Check cable glands'],
        tools: ['Flashlight', 'Inspection mirror']
      },
      {
        task: 'Terminal Check',
        interval: '6 months',
        procedure: ['Power down system', 'Check all terminal tightness', 'Inspect wire insulation', 'Check for corrosion'],
        tools: ['Screwdriver', 'Contact cleaner']
      },
      {
        task: 'Functional Test',
        interval: 'Monthly',
        procedure: ['Test manual start', 'Test auto start on mains fail', 'Verify alarms function', 'Check remote start if fitted'],
        tools: ['Mains simulation switch']
      },
      {
        task: 'Configuration Backup',
        interval: 'Annually',
        procedure: ['Connect InteliConfig software', 'Download current configuration', 'Store backup securely', 'Document any changes'],
        tools: ['PC with InteliConfig', 'USB cable']
      }
    ],
    repairGuide: [
      {
        issue: 'Keypad buttons not responding',
        difficulty: 'Easy',
        tools: ['Isopropyl alcohol', 'Cotton swabs', 'Compressed air'],
        parts: ['None typically required'],
        steps: [
          'Power down controller',
          'Clean around buttons with compressed air',
          'Clean button surfaces with isopropyl alcohol',
          'Allow to dry completely',
          'Power up and test',
          'If still failing, membrane may need replacement'
        ],
        testProcedure: ['Test each button', 'Verify menu navigation works'],
        safetyWarnings: ['Ensure controller is powered off', 'Allow alcohol to evaporate before powering on'],
        estimatedTime: '15-30 minutes',
        estimatedCost: 'KES 0-500'
      },
      {
        issue: 'USB port not detected',
        difficulty: 'Medium',
        tools: ['Different USB cable', 'Different PC', 'Contact cleaner'],
        parts: ['USB cable'],
        steps: [
          'Try different USB cable (known good)',
          'Test on different PC',
          'Check driver installation on PC',
          'Inspect USB port for damage or debris',
          'Clean port with compressed air',
          'If port damaged, controller repair required'
        ],
        testProcedure: ['Verify device appears in Device Manager', 'Connect InteliConfig successfully'],
        safetyWarnings: ['Do not force USB connector'],
        estimatedTime: '30-60 minutes',
        estimatedCost: 'KES 500-2,000 (cable)'
      }
    ],
    price: { min: 55000, max: 85000 },
    spareParts: [
      { partNumber: 'IL-AMF25-DISP', name: 'Display Module', price: { min: 18000, max: 28000 }, availability: 'Order' },
      { partNumber: 'IL-AMF25-KEYPAD', name: 'Keypad/Membrane', price: { min: 8000, max: 12000 }, availability: 'In Stock' },
      { partNumber: 'IL-AMF25-PWR', name: 'Power Board', price: { min: 22000, max: 32000 }, availability: 'Order' },
      { partNumber: 'IL-CONN-SET', name: 'Connector Set', price: { min: 5000, max: 8000 }, availability: 'In Stock' }
    ]
  },
  {
    id: 'comap-inteligen-200',
    manufacturer: 'ComAp',
    model: 'InteliGen 200',
    fullName: 'InteliGen 200 Generator Controller',
    image: '/images/controllers/comap-ig200.jpg',
    description: 'Advanced generator controller for single and multiple genset applications with comprehensive protection, automatic synchronizing, and load sharing capabilities.',
    applications: ['Power plants', 'Industrial facilities', 'Data centers', 'Marine', 'Oil & gas'],
    features: [
      'Automatic synchronizing to mains or bus',
      'Load sharing (kW, kVAr)',
      'Comprehensive engine and alternator protection',
      'High-resolution TFT color display',
      'Multiple communication protocols',
      'Load shedding and load management',
      'Black start capability',
      'Island and parallel modes'
    ],
    specifications: {
      supplyVoltage: '8-36V DC',
      operatingTemp: '-40°C to +70°C',
      displayType: '4.3" TFT Color LCD',
      communication: ['Ethernet', 'RS232', 'RS485', 'CAN', 'USB', 'Modbus TCP'],
      inputs: 16,
      outputs: 12,
      dimensions: '245mm x 185mm x 68mm',
      weight: '1.2kg'
    },
    terminals: [
      {
        id: 'ig200-pwr',
        name: 'Power Supply',
        type: 'power',
        pinNumber: 'K1',
        function: 'DC power input',
        voltage: '8-36V DC',
        current: '500mA typical',
        connections: [
          { id: 'k1', fromTerminal: 'K1-1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '4mm²', function: 'Power supply' }
        ]
      },
      {
        id: 'ig200-can1',
        name: 'CAN1 Bus',
        type: 'communication',
        pinNumber: 'K8',
        function: 'ECM communication via J1939',
        connections: [
          { id: 'can1h', fromTerminal: 'K8-1', toComponent: 'ECM', toTerminal: 'CAN-H', wireColor: 'Yellow', wireGauge: '0.75mm²', function: 'CAN High' },
          { id: 'can1l', fromTerminal: 'K8-2', toComponent: 'ECM', toTerminal: 'CAN-L', wireColor: 'Green', wireGauge: '0.75mm²', function: 'CAN Low' }
        ]
      },
      {
        id: 'ig200-ct',
        name: 'CT Inputs',
        type: 'input',
        pinNumber: 'K3',
        function: 'Current transformers for power metering',
        current: '5A/1A nominal',
        connections: [
          { id: 'ct1', fromTerminal: 'K3-1', toComponent: 'CT L1', toTerminal: 'S1', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'L1 current' },
          { id: 'ct2', fromTerminal: 'K3-3', toComponent: 'CT L2', toTerminal: 'S1', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'L2 current' },
          { id: 'ct3', fromTerminal: 'K3-5', toComponent: 'CT L3', toTerminal: 'S1', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'L3 current' }
        ]
      },
      {
        id: 'ig200-sync',
        name: 'Synchroscope Output',
        type: 'output',
        pinNumber: 'K5-5',
        function: 'Analog output for external synchroscope',
        voltage: '0-10V DC',
        connections: [
          { id: 'sync1', fromTerminal: 'K5-5', toComponent: 'Synchroscope', toTerminal: '+', wireColor: 'White', wireGauge: '0.75mm²', function: 'Sync signal' }
        ]
      },
      {
        id: 'ig200-gcb',
        name: 'Generator Breaker Control',
        type: 'output',
        pinNumber: 'K6-1',
        function: 'Close/trip generator circuit breaker',
        voltage: 'Battery voltage',
        current: '3A',
        connections: [
          { id: 'gcb1', fromTerminal: 'K6-1', toComponent: 'GCB', toTerminal: 'Close Coil', wireColor: 'Red', wireGauge: '1.5mm²', function: 'Breaker close' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/comap-ig200-wiring.svg',
      layers: [
        { id: 'power', name: 'DC Power', color: '#EF4444', visible: true },
        { id: 'can', name: 'CAN Bus', color: '#8B5CF6', visible: true },
        { id: 'metering', name: 'CT/PT Metering', color: '#3B82F6', visible: true },
        { id: 'control', name: 'Breaker Control', color: '#10B981', visible: true },
        { id: 'network', name: 'Ethernet', color: '#EC4899', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 50, y: 150 }, to: { x: 130, y: 150 }, wireColor: 'red', label: '24VDC+', type: 'power' },
        { id: 'w2', from: { x: 50, y: 170 }, to: { x: 130, y: 170 }, wireColor: 'black', label: '0V', type: 'ground' },
        { id: 'w3', from: { x: 230, y: 50 }, to: { x: 350, y: 50 }, wireColor: 'yellow', label: 'CAN-H', type: 'communication' },
        { id: 'w4', from: { x: 230, y: 70 }, to: { x: 350, y: 70 }, wireColor: 'green', label: 'CAN-L', type: 'communication' },
        { id: 'w5', from: { x: 130, y: 250 }, to: { x: 50, y: 300 }, wireColor: 'blue', label: 'CT L1-S1', type: 'signal' },
        { id: 'w6', from: { x: 230, y: 200 }, to: { x: 350, y: 200 }, wireColor: 'red', label: 'GCB Close', type: 'signal' }
      ],
      components: [
        { id: 'battery', name: '24V DC Supply', position: { x: 20, y: 140 }, size: { width: 40, height: 50 }, type: 'supply', terminals: ['+', '-'] },
        { id: 'controller', name: 'IG200', position: { x: 130, y: 30 }, size: { width: 100, height: 240 }, type: 'controller', terminals: ['K1', 'K3', 'K5', 'K6', 'K8'] },
        { id: 'ecm', name: 'Engine ECM', position: { x: 350, y: 30 }, size: { width: 80, height: 80 }, type: 'ecm', terminals: ['CAN-H', 'CAN-L'] },
        { id: 'gcb', name: 'Generator CB', position: { x: 350, y: 180 }, size: { width: 60, height: 60 }, type: 'breaker', terminals: ['Close', 'Trip', 'Aux'] },
        { id: 'cts', name: 'CT Cabinet', position: { x: 20, y: 280 }, size: { width: 60, height: 60 }, type: 'ct', terminals: ['L1-S1', 'L1-S2', 'L2-S1', 'L2-S2', 'L3-S1', 'L3-S2'] }
      ]
    },
    faultCodes: ['IG-1001', 'IG-1002', 'IG-2001', 'IG-2002', 'IG-3001', 'IG-3002', 'IG-4001', 'IG-4002', 'IG-5001'],
    troubleshooting: [
      {
        symptom: 'Load sharing unstable between generators',
        possibleCauses: [
          'Incorrect CT polarity',
          'CT ratio mismatch',
          'Governor gain too high',
          'CAN communication delay',
          'Different droop settings'
        ],
        diagnosticSteps: [
          'Verify CT polarity matches (S1/S2 orientation)',
          'Check CT ratios match actual installed CTs',
          'Compare droop settings between all units',
          'Monitor CAN bus for errors or delays',
          'Reduce governor gain if hunting observed'
        ],
        solution: 'Correct CT wiring, match settings, tune gains',
        tools: ['InteliConfig software', 'Clamp meter', 'CAN analyzer'],
        time: '2-6 hours'
      },
      {
        symptom: 'Synchronizing failure - breaker won\'t close',
        possibleCauses: [
          'Voltage difference too high',
          'Frequency difference too high',
          'Phase angle window too narrow',
          'AVR not responding',
          'Governor not responding'
        ],
        diagnosticSteps: [
          'Check sync window parameters',
          'Monitor voltage matching on display',
          'Monitor frequency matching on display',
          'Verify AVR voltage trim input working',
          'Verify governor speed trim input working',
          'Check sync relay output with test light'
        ],
        solution: 'Adjust sync parameters, repair AVR/governor inputs, or check breaker',
        tools: ['Multimeter', 'Test light', 'Synchroscope'],
        time: '1-4 hours'
      },
      {
        symptom: 'CAN communication lost with ECM',
        possibleCauses: [
          'Incorrect baud rate',
          'Termination resistor missing',
          'CAN wiring swapped (H/L)',
          'Ground loop issue',
          'ECM source address conflict'
        ],
        diagnosticSteps: [
          'Verify CAN baud rate matches ECM (typically 250k for J1939)',
          'Check 120 ohm termination at both ends',
          'Measure bus impedance (should be 60 ohms)',
          'Verify CAN-H and CAN-L not swapped',
          'Check for multiple ECMs with same address'
        ],
        solution: 'Correct wiring, add termination, configure addresses',
        tools: ['Multimeter', 'CAN bus analyzer', 'Oscilloscope'],
        time: '1-4 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Preparation',
        description: 'Cut aperture 230mm x 170mm in panel door. Ensure enclosure meets IP rating requirements.',
        warnings: ['De-energize before cutting', 'Wear appropriate PPE'],
        tips: ['Use template from manual', 'Allow 100mm depth behind']
      },
      {
        step: 2,
        title: 'Install Controller',
        description: 'Insert controller from front, secure with four mounting brackets.',
        warnings: ['Support controller during installation'],
        tips: ['Check gasket seating for IP65']
      },
      {
        step: 3,
        title: 'DC Power Supply',
        description: 'Connect 24VDC to K1 terminals through appropriate fusing.',
        warnings: ['Reverse polarity will damage unit', 'Use proper gauge wire for length'],
        tips: ['Install isolator for service']
      },
      {
        step: 4,
        title: 'CAN Bus Installation',
        description: 'Connect CAN-H, CAN-L, and CAN-GND to K8 using twisted pair shielded cable.',
        warnings: ['Install 120 ohm termination at last device', 'Max 40m bus length'],
        tips: ['Use dedicated CAN cable', 'Ground shield at one point only']
      },
      {
        step: 5,
        title: 'CT/PT Installation',
        description: 'Connect current transformers to K3, voltage transformers/direct sensing to K2.',
        warnings: ['Never open CT secondary when primary is energized', 'Verify CT polarity'],
        tips: ['Match CT ratio to application', 'Use shielded cable for CTs']
      },
      {
        step: 6,
        title: 'Breaker Control Wiring',
        description: 'Wire GCB close to K6-1, trip to K6-2, GCB closed status to binary input.',
        warnings: ['Verify breaker coil voltage matches output'],
        tips: ['Use interposing relay if required', 'Add status indication']
      },
      {
        step: 7,
        title: 'Network Connection',
        description: 'Connect Ethernet cable to RJ45 port. Configure IP address.',
        warnings: ['Ensure network security'],
        tips: ['Use static IP for critical systems', 'Document IP address']
      },
      {
        step: 8,
        title: 'Configuration',
        description: 'Use InteliConfig software to configure all parameters.',
        warnings: ['Back up before making changes'],
        tips: ['Use application-specific templates']
      }
    ],
    maintenanceGuide: [
      {
        task: 'System Health Check',
        interval: 'Weekly',
        procedure: ['Verify display and indicators', 'Check for active alarms', 'Review event log', 'Verify communication status'],
        tools: ['None required']
      },
      {
        task: 'Metering Verification',
        interval: 'Monthly',
        procedure: ['Compare readings to external meters', 'Check CT/PT connections', 'Verify power factor readings', 'Check energy accumulation'],
        tools: ['Calibrated multimeter', 'Clamp meter']
      },
      {
        task: 'Communication Test',
        interval: 'Monthly',
        procedure: ['Verify CAN bus status', 'Test Ethernet access', 'Check Modbus responses', 'Test SNMP if configured'],
        tools: ['PC with InteliConfig', 'Network analyzer']
      },
      {
        task: 'Protection Test',
        interval: 'Quarterly',
        procedure: ['Test emergency stop', 'Simulate fault conditions', 'Verify breaker trip times', 'Test differential protection if fitted'],
        tools: ['Test set', 'Injection equipment'],
        parts: ['None typically']
      },
      {
        task: 'Full System Test',
        interval: 'Annually',
        procedure: ['Test full startup sequence', 'Test synchronizing', 'Test load sharing between units', 'Test black start if applicable'],
        tools: ['Load bank', 'Recording instruments']
      }
    ],
    repairGuide: [
      {
        issue: 'TFT display showing artifacts',
        difficulty: 'Medium',
        tools: ['Torx drivers', 'Anti-static strap', 'Lens cleaner'],
        parts: ['IG200 Display Assembly'],
        steps: [
          'Back up configuration',
          'Power down and isolate',
          'Remove front bezel screws',
          'Disconnect display cable',
          'Remove display assembly',
          'Install new display',
          'Reconnect cable carefully',
          'Reassemble bezel',
          'Power on and verify'
        ],
        testProcedure: ['Verify all screen areas', 'Check touch function', 'Test all screens'],
        safetyWarnings: ['ESD sensitive', 'Handle LCD carefully'],
        estimatedTime: '1-2 hours',
        estimatedCost: 'KES 45,000 - 65,000'
      },
      {
        issue: 'Binary output not switching',
        difficulty: 'Advanced',
        tools: ['Multimeter', 'Oscilloscope', 'Soldering station'],
        parts: ['Output transistor/relay'],
        steps: [
          'Identify failed output',
          'Verify it is not a configuration issue',
          'Test output with multimeter during active state',
          'If no output, internal component failure',
          'Open controller (voids warranty)',
          'Locate output driver on PCB',
          'Replace failed component',
          'Test thoroughly before reconnecting load'
        ],
        testProcedure: ['Test output with resistive load', 'Test under actual load', 'Monitor for overheating'],
        safetyWarnings: ['May void warranty', 'Requires electronics expertise'],
        estimatedTime: '2-4 hours',
        estimatedCost: 'KES 5,000 - 15,000 (component level)'
      }
    ],
    price: { min: 180000, max: 280000 },
    spareParts: [
      { partNumber: 'IG200-DISP', name: 'Display Assembly', price: { min: 45000, max: 65000 }, availability: 'In Stock' },
      { partNumber: 'IG200-MB', name: 'Main Board', price: { min: 95000, max: 140000 }, availability: 'Order' },
      { partNumber: 'IG200-PSU', name: 'Power Supply', price: { min: 28000, max: 42000 }, availability: 'In Stock' },
      { partNumber: 'IG200-BEZEL', name: 'Front Bezel', price: { min: 15000, max: 25000 }, availability: 'In Stock' },
      { partNumber: 'IG-CONN-KIT', name: 'Connector Kit', price: { min: 12000, max: 18000 }, availability: 'In Stock' }
    ]
  }
];

// Export ComAp controllers
export const getAllComApControllers = () => COMAP_CONTROLLERS;
export const getComApControllerById = (id: string) => COMAP_CONTROLLERS.find(c => c.id === id);
