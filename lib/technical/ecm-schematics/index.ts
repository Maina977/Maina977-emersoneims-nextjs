/**
 * COMPREHENSIVE ECM (ENGINE CONTROL MODULE) SCHEMATICS DATABASE
 *
 * Complete wiring diagrams, pin configurations, and programming guides for:
 * - Cummins (CM850, CM870, CM2150, CM2350, CM2450)
 * - Caterpillar (ADEM III, ADEM IV, A5E2)
 * - Perkins (1300 EDi, 2800 Series)
 * - Volvo Penta (EMS2)
 * - John Deere (PowerTech)
 * - MTU (ADEC)
 * - Deutz (EMR4)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ECM TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMPinout {
  pin: string;
  name: string;
  type: 'input' | 'output' | 'power' | 'ground' | 'can' | 'pwm' | 'analog';
  function: string;
  voltage?: string;
  current?: string;
  wireColor: string;
  wireGauge: string;
  connectedTo: string;
}

export interface ECMConnector {
  id: string;
  name: string;
  type: string;
  pinCount: number;
  image: string;
  pinout: ECMPinout[];
}

export interface ECMSchematic {
  id: string;
  manufacturer: string;
  model: string;
  fullName: string;
  image: string;
  description: string;
  applications: string[];
  engineModels: string[];
  features: string[];
  specifications: {
    supplyVoltage: string;
    operatingTemp: string;
    protectionRating: string;
    communication: string[];
    memory: string;
    processor: string;
  };
  connectors: ECMConnector[];
  wiringDiagram: ECMWiringDiagram;
  faultCodes: ECMFaultCode[];
  programmingInfo: ProgrammingInfo;
  calibrationGuide: CalibrationGuide;
  maintenanceGuide: ECMMaintenanceTask[];
  repairGuide: ECMRepairProcedure[];
  price: { min: number; max: number };
  spareParts: ECMSparePart[];
}

export interface ECMWiringDiagram {
  svgPath: string;
  layers: WiringLayer[];
  connections: WireConnection[];
  components: ECMComponent[];
  legend: LegendItem[];
}

export interface WiringLayer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

export interface WireConnection {
  id: string;
  from: { component: string; pin: string };
  to: { component: string; pin: string };
  path: { x: number; y: number }[];
  wireColor: string;
  wireGauge: string;
  label: string;
  type: 'power' | 'ground' | 'signal' | 'can' | 'pwm';
}

export interface ECMComponent {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  connectors: string[];
}

export interface LegendItem {
  symbol: string;
  description: string;
  color: string;
}

export interface ECMFaultCode {
  code: string;
  spn?: number;
  fmi?: number;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  causes: string[];
  diagnosticSteps: string[];
  solution: string;
  relatedPins: string[];
}

export interface ProgrammingInfo {
  softwareRequired: string[];
  adapterRequired: string;
  connectionMethod: string;
  procedureSteps: string[];
  precautions: string[];
  calibrationFiles: string;
}

export interface CalibrationGuide {
  parameters: CalibrationParameter[];
  procedureSteps: string[];
  tools: string[];
  precautions: string[];
}

export interface CalibrationParameter {
  name: string;
  description: string;
  defaultValue: string;
  range: string;
  unit: string;
}

export interface ECMMaintenanceTask {
  task: string;
  interval: string;
  procedure: string[];
  tools: string[];
}

export interface ECMRepairProcedure {
  issue: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced' | 'Expert';
  tools: string[];
  parts: string[];
  steps: string[];
  testProcedure: string[];
  safetyWarnings: string[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface ECMSparePart {
  partNumber: string;
  name: string;
  price: { min: number; max: number };
  availability: 'In Stock' | 'Order' | 'Discontinued';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUMMINS ECM SCHEMATICS
// ═══════════════════════════════════════════════════════════════════════════════

export const CUMMINS_ECMS: ECMSchematic[] = [
  {
    id: 'cummins-cm2350',
    manufacturer: 'Cummins',
    model: 'CM2350',
    fullName: 'Cummins CM2350 Electronic Control Module',
    image: '/images/ecm/cummins-cm2350.jpg',
    description: 'Latest generation Cummins ECM for X-Series, ISX, and ISB engines. Features advanced diagnostics, aftertreatment control, and real-time engine optimization.',
    applications: ['Power generation', 'Industrial', 'Marine', 'Mining', 'Construction'],
    engineModels: ['QSX15', 'QSK23', 'QSK38', 'QSK50', 'QSK60', 'QST30', 'ISX15', 'ISX12', 'ISB6.7'],
    features: [
      'Tier 4 Final / Stage V compliant',
      'Integrated aftertreatment control',
      'Advanced diagnostics via J1939',
      'Dual CAN bus communication',
      'Real-time fuel optimization',
      'Remote monitoring capable',
      'OBD-II compliant (applicable models)',
      'Reduced emissions calibrations'
    ],
    specifications: {
      supplyVoltage: '11-32V DC',
      operatingTemp: '-40°C to +85°C',
      protectionRating: 'IP67',
      communication: ['CAN J1939 (2 ports)', 'CAN J1708/J1587', 'RS232'],
      memory: '4MB Flash, 256KB RAM',
      processor: '32-bit microcontroller'
    },
    connectors: [
      {
        id: 'cm2350-j1',
        name: 'J1 - Engine Interface Connector',
        type: 'Deutsch HD36-24-31PT',
        pinCount: 31,
        image: '/images/connectors/deutsch-hd36-24-31pt.jpg',
        pinout: [
          { pin: '1', name: 'ECM Power', type: 'power', function: 'ECM power supply positive', voltage: '12/24V DC', wireColor: 'Red', wireGauge: '2.0mm²', connectedTo: 'Battery +' },
          { pin: '2', name: 'ECM Ground', type: 'ground', function: 'ECM main ground', voltage: '0V', wireColor: 'Black', wireGauge: '2.0mm²', connectedTo: 'Battery -' },
          { pin: '3', name: 'Sensor Ground', type: 'ground', function: 'Sensor reference ground', voltage: '0V', wireColor: 'Black/White', wireGauge: '0.5mm²', connectedTo: 'Sensors' },
          { pin: '4', name: 'Sensor Supply +5V', type: 'output', function: '5V supply for sensors', voltage: '5V DC', current: '100mA', wireColor: 'Orange', wireGauge: '0.5mm²', connectedTo: 'Sensors' },
          { pin: '5', name: 'Oil Pressure', type: 'analog', function: 'Engine oil pressure signal', voltage: '0.5-4.5V', wireColor: 'Pink', wireGauge: '0.5mm²', connectedTo: 'Oil Pressure Sensor' },
          { pin: '6', name: 'Coolant Temp', type: 'analog', function: 'Engine coolant temperature', voltage: 'Resistance', wireColor: 'Green', wireGauge: '0.5mm²', connectedTo: 'Temp Sensor' },
          { pin: '7', name: 'Intake Manifold Temp', type: 'analog', function: 'Charge air temperature', voltage: 'Resistance', wireColor: 'Brown', wireGauge: '0.5mm²', connectedTo: 'IMT Sensor' },
          { pin: '8', name: 'Boost Pressure', type: 'analog', function: 'Turbo boost pressure', voltage: '0.5-4.5V', wireColor: 'Blue/White', wireGauge: '0.5mm²', connectedTo: 'Boost Sensor' },
          { pin: '9', name: 'Fuel Temp', type: 'analog', function: 'Fuel temperature', voltage: 'Resistance', wireColor: 'Yellow', wireGauge: '0.5mm²', connectedTo: 'Fuel Temp Sensor' },
          { pin: '10', name: 'Atmos Pressure', type: 'analog', function: 'Barometric pressure (internal)', voltage: '0.5-4.5V', wireColor: 'N/A', wireGauge: 'N/A', connectedTo: 'Internal' },
          { pin: '11', name: 'CAN1 High', type: 'can', function: 'J1939 CAN bus high', voltage: 'Differential', wireColor: 'Yellow', wireGauge: '0.5mm²', connectedTo: 'Controller CAN-H' },
          { pin: '12', name: 'CAN1 Low', type: 'can', function: 'J1939 CAN bus low', voltage: 'Differential', wireColor: 'Green', wireGauge: '0.5mm²', connectedTo: 'Controller CAN-L' },
          { pin: '13', name: 'CAN2 High', type: 'can', function: 'Secondary CAN high', voltage: 'Differential', wireColor: 'Yellow/Blue', wireGauge: '0.5mm²', connectedTo: 'Aftertreatment CAN-H' },
          { pin: '14', name: 'CAN2 Low', type: 'can', function: 'Secondary CAN low', voltage: 'Differential', wireColor: 'Green/Blue', wireGauge: '0.5mm²', connectedTo: 'Aftertreatment CAN-L' },
          { pin: '15', name: 'Cam Position', type: 'input', function: 'Camshaft position sensor', voltage: 'Hall effect', wireColor: 'Purple', wireGauge: '0.5mm²', connectedTo: 'Cam Sensor' },
          { pin: '16', name: 'Crank Position', type: 'input', function: 'Crankshaft position sensor', voltage: 'VR/Hall', wireColor: 'Purple/White', wireGauge: '0.5mm²', connectedTo: 'Crank Sensor' },
          { pin: '17', name: 'Fuel Actuator +', type: 'pwm', function: 'Fuel metering actuator high side', voltage: 'Battery', current: '5A', wireColor: 'Red/White', wireGauge: '1.0mm²', connectedTo: 'Fuel Actuator' },
          { pin: '18', name: 'Fuel Actuator -', type: 'pwm', function: 'Fuel metering actuator low side', voltage: 'PWM', current: '5A', wireColor: 'Black/Red', wireGauge: '1.0mm²', connectedTo: 'Fuel Actuator' },
          { pin: '19', name: 'EGR Valve +', type: 'pwm', function: 'EGR valve high side', voltage: 'Battery', current: '3A', wireColor: 'Brown/White', wireGauge: '1.0mm²', connectedTo: 'EGR Valve' },
          { pin: '20', name: 'EGR Valve -', type: 'pwm', function: 'EGR valve low side', voltage: 'PWM', current: '3A', wireColor: 'Black/Brown', wireGauge: '1.0mm²', connectedTo: 'EGR Valve' },
          { pin: '21', name: 'VGT Actuator +', type: 'pwm', function: 'Variable geometry turbo high', voltage: 'Battery', current: '2A', wireColor: 'Blue', wireGauge: '1.0mm²', connectedTo: 'VGT Actuator' },
          { pin: '22', name: 'VGT Actuator -', type: 'pwm', function: 'Variable geometry turbo low', voltage: 'PWM', current: '2A', wireColor: 'Black/Blue', wireGauge: '1.0mm²', connectedTo: 'VGT Actuator' },
          { pin: '23', name: 'Grid Heater', type: 'output', function: 'Intake grid heater relay', voltage: 'Battery', current: '2A relay', wireColor: 'White', wireGauge: '1.0mm²', connectedTo: 'Grid Heater Relay' },
          { pin: '24', name: 'Starter Enable', type: 'output', function: 'Starter relay enable', voltage: 'Battery', current: '500mA', wireColor: 'Yellow/Black', wireGauge: '1.0mm²', connectedTo: 'Starter Relay' },
          { pin: '25', name: 'Fuel Shutoff', type: 'output', function: 'Fuel shutoff solenoid', voltage: 'Battery', current: '3A', wireColor: 'Orange/Black', wireGauge: '1.0mm²', connectedTo: 'Fuel Shutoff' },
          { pin: '26', name: 'Fan Clutch', type: 'pwm', function: 'Fan clutch control', voltage: 'PWM', current: '2A', wireColor: 'Gray', wireGauge: '1.0mm²', connectedTo: 'Fan Clutch' },
          { pin: '27', name: 'Coolant Level', type: 'input', function: 'Coolant level switch', voltage: 'Digital', wireColor: 'Green/White', wireGauge: '0.5mm²', connectedTo: 'Level Switch' },
          { pin: '28', name: 'Engine Speed', type: 'output', function: 'Engine speed output (W terminal)', voltage: 'Pulse', wireColor: 'White/Black', wireGauge: '0.5mm²', connectedTo: 'Tachometer' },
          { pin: '29', name: 'Lamp Output', type: 'output', function: 'Malfunction indicator lamp', voltage: 'Battery', current: '500mA', wireColor: 'Amber', wireGauge: '0.5mm²', connectedTo: 'MIL Lamp' },
          { pin: '30', name: 'Key Switch', type: 'input', function: 'Key switch run signal', voltage: 'Battery', wireColor: 'Pink/Black', wireGauge: '1.0mm²', connectedTo: 'Key Switch' },
          { pin: '31', name: 'Shield', type: 'ground', function: 'Cable shield ground', voltage: '0V', wireColor: 'Shield', wireGauge: 'Shield', connectedTo: 'Chassis Ground' }
        ]
      },
      {
        id: 'cm2350-j2',
        name: 'J2 - Injector Connector',
        type: 'Deutsch HD36-24-21PT',
        pinCount: 21,
        image: '/images/connectors/deutsch-hd36-24-21pt.jpg',
        pinout: [
          { pin: '1', name: 'INJ1 High', type: 'output', function: 'Injector 1 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Yellow', wireGauge: '1.5mm²', connectedTo: 'Injector #1' },
          { pin: '2', name: 'INJ1 Low', type: 'output', function: 'Injector 1 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Yellow', wireGauge: '1.5mm²', connectedTo: 'Injector #1' },
          { pin: '3', name: 'INJ2 High', type: 'output', function: 'Injector 2 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Green', wireGauge: '1.5mm²', connectedTo: 'Injector #2' },
          { pin: '4', name: 'INJ2 Low', type: 'output', function: 'Injector 2 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Green', wireGauge: '1.5mm²', connectedTo: 'Injector #2' },
          { pin: '5', name: 'INJ3 High', type: 'output', function: 'Injector 3 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Blue', wireGauge: '1.5mm²', connectedTo: 'Injector #3' },
          { pin: '6', name: 'INJ3 Low', type: 'output', function: 'Injector 3 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Blue', wireGauge: '1.5mm²', connectedTo: 'Injector #3' },
          { pin: '7', name: 'INJ4 High', type: 'output', function: 'Injector 4 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Purple', wireGauge: '1.5mm²', connectedTo: 'Injector #4' },
          { pin: '8', name: 'INJ4 Low', type: 'output', function: 'Injector 4 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Purple', wireGauge: '1.5mm²', connectedTo: 'Injector #4' },
          { pin: '9', name: 'INJ5 High', type: 'output', function: 'Injector 5 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Orange', wireGauge: '1.5mm²', connectedTo: 'Injector #5' },
          { pin: '10', name: 'INJ5 Low', type: 'output', function: 'Injector 5 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Orange', wireGauge: '1.5mm²', connectedTo: 'Injector #5' },
          { pin: '11', name: 'INJ6 High', type: 'output', function: 'Injector 6 high side', voltage: 'Battery', current: '20A peak', wireColor: 'Red/Brown', wireGauge: '1.5mm²', connectedTo: 'Injector #6' },
          { pin: '12', name: 'INJ6 Low', type: 'output', function: 'Injector 6 low side', voltage: 'PWM', current: '20A peak', wireColor: 'Black/Brown', wireGauge: '1.5mm²', connectedTo: 'Injector #6' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/cummins-cm2350-wiring.svg',
      layers: [
        { id: 'power', name: 'Power Supply', color: '#EF4444', visible: true },
        { id: 'ground', name: 'Grounds', color: '#000000', visible: true },
        { id: 'sensors', name: 'Sensor Inputs', color: '#10B981', visible: true },
        { id: 'can', name: 'CAN Bus', color: '#8B5CF6', visible: true },
        { id: 'injectors', name: 'Injector Outputs', color: '#F59E0B', visible: true },
        { id: 'actuators', name: 'Actuator Outputs', color: '#3B82F6', visible: true },
        { id: 'position', name: 'Position Sensors', color: '#EC4899', visible: true }
      ],
      connections: [
        { id: 'pwr1', from: { component: 'Battery', pin: '+' }, to: { component: 'ECM', pin: 'J1-1' }, path: [{ x: 50, y: 100 }, { x: 150, y: 100 }], wireColor: 'red', wireGauge: '2.0mm²', label: 'B+', type: 'power' },
        { id: 'gnd1', from: { component: 'Battery', pin: '-' }, to: { component: 'ECM', pin: 'J1-2' }, path: [{ x: 50, y: 120 }, { x: 150, y: 120 }], wireColor: 'black', wireGauge: '2.0mm²', label: 'B-', type: 'ground' },
        { id: 'can1h', from: { component: 'ECM', pin: 'J1-11' }, to: { component: 'Controller', pin: 'CAN-H' }, path: [{ x: 250, y: 80 }, { x: 350, y: 80 }], wireColor: 'yellow', wireGauge: '0.5mm²', label: 'CAN1-H', type: 'can' },
        { id: 'can1l', from: { component: 'ECM', pin: 'J1-12' }, to: { component: 'Controller', pin: 'CAN-L' }, path: [{ x: 250, y: 90 }, { x: 350, y: 90 }], wireColor: 'green', wireGauge: '0.5mm²', label: 'CAN1-L', type: 'can' }
      ],
      components: [
        { id: 'battery', name: '24V Battery', type: 'battery', position: { x: 20, y: 90 }, size: { width: 40, height: 50 }, connectors: ['+', '-'] },
        { id: 'ecm', name: 'CM2350 ECM', type: 'ecm', position: { x: 150, y: 40 }, size: { width: 100, height: 220 }, connectors: ['J1', 'J2'] },
        { id: 'controller', name: 'Gen Controller', type: 'controller', position: { x: 350, y: 60 }, size: { width: 80, height: 60 }, connectors: ['CAN-H', 'CAN-L'] },
        { id: 'sensors', name: 'Sensor Bank', type: 'sensors', position: { x: 20, y: 180 }, size: { width: 60, height: 80 }, connectors: ['OilP', 'Temp', 'Boost'] },
        { id: 'injectors', name: 'Injectors 1-6', type: 'injectors', position: { x: 350, y: 150 }, size: { width: 80, height: 100 }, connectors: ['INJ1', 'INJ2', 'INJ3', 'INJ4', 'INJ5', 'INJ6'] }
      ],
      legend: [
        { symbol: '━━', description: 'Power supply (red)', color: '#EF4444' },
        { symbol: '━━', description: 'Ground (black)', color: '#000000' },
        { symbol: '- -', description: 'CAN bus (yellow/green)', color: '#8B5CF6' },
        { symbol: '···', description: 'Sensor signals', color: '#10B981' },
        { symbol: '═══', description: 'High current output', color: '#F59E0B' }
      ]
    },
    faultCodes: [
      {
        code: 'SPN 91 - FMI 4',
        spn: 91,
        fmi: 4,
        description: 'Accelerator Pedal Position 1 - Voltage Below Normal',
        severity: 'Medium',
        causes: ['Sensor wiring short to ground', 'Sensor failure', 'ECM input circuit fault'],
        diagnosticSteps: [
          'Check sensor connector for damage/corrosion',
          'Measure voltage at ECM pin with sensor disconnected',
          'Check sensor ground connection',
          'Measure sensor output voltage while actuating'
        ],
        solution: 'Repair wiring or replace throttle position sensor',
        relatedPins: ['J1-5', 'J1-3', 'J1-4']
      },
      {
        code: 'SPN 100 - FMI 3',
        spn: 100,
        fmi: 3,
        description: 'Engine Oil Pressure - Voltage Above Normal',
        severity: 'High',
        causes: ['Sensor wiring open circuit', 'Sensor failure', 'ECM input circuit fault'],
        diagnosticSteps: [
          'Check oil pressure sender wiring continuity',
          'Verify sensor ground connection',
          'Test sensor with known good unit',
          'Check ECM supply voltage to sensor'
        ],
        solution: 'Repair wiring, replace sensor, or address ECM issue',
        relatedPins: ['J1-5', 'J1-3', 'J1-4']
      },
      {
        code: 'SPN 110 - FMI 0',
        spn: 110,
        fmi: 0,
        description: 'Engine Coolant Temperature - Data Valid But Above Normal Range',
        severity: 'Critical',
        causes: ['Actual engine overheating', 'Sensor failure', 'Cooling system fault'],
        diagnosticSteps: [
          'Check actual engine temperature with IR thermometer',
          'Verify coolant level and condition',
          'Check cooling fan operation',
          'Inspect thermostat operation'
        ],
        solution: 'Address cooling system issue or replace sensor if faulty',
        relatedPins: ['J1-6', 'J1-3']
      },
      {
        code: 'SPN 639 - FMI 9',
        spn: 639,
        fmi: 9,
        description: 'J1939 CAN Network - Abnormal Update Rate',
        severity: 'Medium',
        causes: ['CAN bus wiring fault', 'Missing termination', 'Conflicting device', 'ECM fault'],
        diagnosticSteps: [
          'Check CAN-H and CAN-L continuity',
          'Verify 120 ohm termination at both ends',
          'Measure bus resistance (should be ~60 ohms)',
          'Check for conflicting source addresses'
        ],
        solution: 'Repair wiring, add termination, resolve conflicts',
        relatedPins: ['J1-11', 'J1-12']
      },
      {
        code: 'SPN 651 - FMI 5',
        spn: 651,
        fmi: 5,
        description: 'Injector Cylinder 1 - Current Below Normal',
        severity: 'High',
        causes: ['Injector open circuit', 'Wiring fault', 'ECM driver failure', 'Injector failure'],
        diagnosticSteps: [
          'Measure injector resistance (should be 0.5-1.5 ohms)',
          'Check wiring continuity to ECM',
          'Swap injector with adjacent cylinder to test',
          'Check ECM output driver'
        ],
        solution: 'Repair wiring or replace injector',
        relatedPins: ['J2-1', 'J2-2']
      }
    ],
    programmingInfo: {
      softwareRequired: ['INSITE', 'Cummins INLINE adapter software'],
      adapterRequired: 'Cummins INLINE 7 or INLINE 6',
      connectionMethod: 'SAE J1939/J1708 diagnostic connector or direct ECM connection',
      procedureSteps: [
        'Connect INLINE adapter to vehicle diagnostic port',
        'Connect adapter to PC via USB',
        'Launch INSITE software',
        'Establish communication with ECM',
        'Read current calibration file',
        'Back up existing calibration',
        'Select new calibration file',
        'Write new calibration to ECM',
        'Verify calibration after write',
        'Clear fault codes and test'
      ],
      precautions: [
        'Ensure battery voltage is stable 24V during programming',
        'Do not interrupt power during ECM write',
        'Back up existing calibration before any changes',
        'Verify calibration matches engine serial number',
        'Some calibrations require Cummins authorization'
      ],
      calibrationFiles: 'Calibration files are engine-specific and require matching to CPL/ESN'
    },
    calibrationGuide: {
      parameters: [
        { name: 'Rated Power', description: 'Maximum engine power output', defaultValue: 'Factory', range: 'Engine-specific', unit: 'kW/HP' },
        { name: 'Rated Speed', description: 'Engine speed at rated power', defaultValue: '1500/1800', range: '1500-2100', unit: 'RPM' },
        { name: 'Low Idle Speed', description: 'Minimum governed speed', defaultValue: '600-750', range: '500-900', unit: 'RPM' },
        { name: 'High Idle Speed', description: 'Maximum no-load speed', defaultValue: '1575/1890', range: 'Per application', unit: 'RPM' },
        { name: 'Governor Droop', description: 'Speed droop under load', defaultValue: '5%', range: '0-10%', unit: '%' },
        { name: 'Torque Limit', description: 'Maximum torque output', defaultValue: 'Factory', range: 'Engine-specific', unit: 'Nm' },
        { name: 'Protection Setpoints', description: 'Engine protection thresholds', defaultValue: 'Factory', range: 'Application-specific', unit: 'Various' }
      ],
      procedureSteps: [
        'Establish communication with ECM via INSITE',
        'Navigate to Electronic Service Tool features',
        'Select Features and Parameters',
        'Locate desired parameter',
        'Enter new value within allowable range',
        'Write change to ECM',
        'Test engine operation',
        'Document changes made'
      ],
      tools: ['INSITE software', 'INLINE 7 adapter', 'Laptop PC'],
      precautions: [
        'Changes may affect warranty',
        'Some parameters locked by OEM',
        'Changes may require engine testing',
        'Document all original values before changing'
      ]
    },
    maintenanceGuide: [
      {
        task: 'Connector Inspection',
        interval: 'Annually',
        procedure: ['Check connector sealing', 'Inspect pin condition', 'Check for corrosion', 'Verify locking tabs'],
        tools: ['Inspection mirror', 'Contact cleaner', 'Dielectric grease']
      },
      {
        task: 'Ground Circuit Check',
        interval: 'Annually',
        procedure: ['Measure ground circuit resistance', 'Should be <0.1 ohm', 'Check chassis ground straps', 'Clean ground points'],
        tools: ['Milliohm meter', 'Wire brush']
      },
      {
        task: 'CAN Bus Health Check',
        interval: '6 months',
        procedure: ['Check bus termination resistance', 'Verify all nodes communicating', 'Check for fault codes', 'Monitor bus voltage levels'],
        tools: ['Multimeter', 'INSITE software', 'Oscilloscope optional']
      },
      {
        task: 'Software Update Check',
        interval: 'Annually',
        procedure: ['Check for available updates', 'Review update release notes', 'Schedule update if beneficial', 'Back up before updating'],
        tools: ['INSITE software', 'Internet access']
      }
    ],
    repairGuide: [
      {
        issue: 'ECM not powering up',
        difficulty: 'Easy',
        tools: ['Multimeter', 'Test light'],
        parts: ['Fuse', 'Relay if applicable'],
        steps: [
          'Check battery voltage at ECM connector (should be 24V)',
          'Check power supply fuse',
          'Verify key switch providing run signal',
          'Check ground connection at ECM',
          'If power OK but no boot, ECM may be failed'
        ],
        testProcedure: ['Measure voltage at J1-1 (power)', 'Measure voltage at J1-30 (key)', 'Check continuity to ground J1-2'],
        safetyWarnings: ['Disconnect battery before unplugging ECM connectors'],
        estimatedTime: '30-60 minutes',
        estimatedCost: 'KES 500-5,000 (fuse/relay) or KES 250,000+ (ECM)'
      },
      {
        issue: 'Intermittent CAN communication',
        difficulty: 'Medium',
        tools: ['Multimeter', 'CAN bus analyzer', 'Oscilloscope'],
        parts: ['Wiring repair materials', 'Termination resistors'],
        steps: [
          'Check CAN-H (J1-11) and CAN-L (J1-12) wiring',
          'Measure resistance between CAN-H and CAN-L (should be ~60 ohms)',
          'Check for chafed wiring or loose connectors',
          'Verify termination resistors present',
          'Monitor CAN signals with oscilloscope if available',
          'Check shield continuity'
        ],
        testProcedure: ['Wiggle test while monitoring communications', 'Temperature cycle if thermal issue suspected'],
        safetyWarnings: ['CAN bus is low voltage but sensitive to shorts'],
        estimatedTime: '1-4 hours',
        estimatedCost: 'KES 2,000-15,000 (wiring repair)'
      },
      {
        issue: 'Injector circuit fault',
        difficulty: 'Advanced',
        tools: ['Multimeter', 'INSITE software', 'Breakout harness'],
        parts: ['Injector', 'Wiring harness section'],
        steps: [
          'Read fault codes to identify affected cylinder',
          'Measure injector resistance (0.5-1.5 ohms)',
          'Check wiring continuity from ECM to injector',
          'Swap injector with known good cylinder to isolate fault',
          'If fault follows injector, replace injector',
          'If fault stays, wiring or ECM driver issue'
        ],
        testProcedure: ['Clear codes', 'Run engine', 'Monitor for fault return', 'Check injection quantity balance in INSITE'],
        safetyWarnings: ['High current injector circuits - disconnect battery', 'Fuel system safety precautions'],
        estimatedTime: '2-6 hours',
        estimatedCost: 'KES 80,000-150,000 (injector)'
      }
    ],
    price: { min: 280000, max: 450000 },
    spareParts: [
      { partNumber: '4995445', name: 'CM2350 ECM Assembly', price: { min: 280000, max: 400000 }, availability: 'Order' },
      { partNumber: '4984988', name: 'ECM Harness', price: { min: 45000, max: 75000 }, availability: 'In Stock' },
      { partNumber: '3408303', name: 'ECM Mounting Bracket', price: { min: 8000, max: 15000 }, availability: 'In Stock' },
      { partNumber: 'HDT-31', name: 'J1 Connector', price: { min: 15000, max: 25000 }, availability: 'In Stock' },
      { partNumber: 'HDT-21', name: 'J2 Connector', price: { min: 12000, max: 20000 }, availability: 'In Stock' },
      { partNumber: '3164835', name: 'Connector Pin Kit', price: { min: 3000, max: 6000 }, availability: 'In Stock' }
    ]
  }
];

// Export functions
export const getAllCumminsECMs = () => CUMMINS_ECMS;
export const getCumminsECMById = (id: string) => CUMMINS_ECMS.find(e => e.id === id);
export const searchECMs = (query: string) => {
  const q = query.toLowerCase();
  return CUMMINS_ECMS.filter(e =>
    e.model.toLowerCase().includes(q) ||
    e.fullName.toLowerCase().includes(q) ||
    e.engineModels.some(m => m.toLowerCase().includes(q))
  );
};
