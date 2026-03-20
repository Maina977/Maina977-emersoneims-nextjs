/**
 * Technical Bible - Comprehensive Technical Documentation Library
 * Complete reference for all 10 services with schematics, wiring, and guides
 */

// ==================== TYPES ====================

export type ServiceCategory =
  | 'solar-systems'
  | 'diesel-generators'
  | 'controls'
  | 'ac-ups'
  | 'automation'
  | 'pumps'
  | 'incinerators'
  | 'motors-rewinding'
  | 'fabrication'
  | 'diagnostics-hub';

export interface TechnicalService {
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  schematicCount: number;
  wiringDiagramCount: number;
  troubleshootingGuides: number;
  repairProcedures: number;
}

export interface SchematicComponent {
  id: string;
  name: string;
  type: 'component' | 'connection' | 'terminal' | 'junction';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  properties: Record<string, string>;
  connectedTo: string[];
  layer: string;
  details: string;
  partNumber?: string;
  specifications?: Record<string, string>;
}

export interface Schematic {
  id: string;
  serviceId: ServiceCategory;
  name: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  components: SchematicComponent[];
  viewBox: { x: number; y: number; width: number; height: number };
  layers: { id: string; name: string; color: string; visible: boolean }[];
  notes: string[];
  relatedDiagrams: string[];
  lastUpdated: string;
}

// Wire colors per IEC 60446 / IEC 60445 standards
export interface WireSpec {
  id: string;
  from: string;
  to: string;
  color: string; // IEC color code
  colorName: string;
  gauge: string; // AWG or mm2
  type: string;
  function: string;
  maxCurrent: string;
  voltage: string;
}

export interface WiringDiagram {
  id: string;
  serviceId: ServiceCategory;
  name: string;
  description: string;
  category: string;
  wires: WireSpec[];
  terminals: { id: string; name: string; x: number; y: number; type: string }[];
  annotations: { x: number; y: number; text: string }[];
  safetyNotes: string[];
  testPoints: { id: string; name: string; expectedValue: string; procedure: string }[];
}

export interface TroubleshootingNode {
  id: string;
  question?: string; // Optional for leaf/solution nodes
  yesNode?: string;
  noNode?: string;
  solution?: string;
  severity?: 'info' | 'warning' | 'critical';
  tools?: string[];
  timeEstimate?: string;
  partsList?: string[];
}

export interface TroubleshootingTree {
  id: string;
  serviceId: ServiceCategory;
  name: string;
  symptom: string;
  startNode: string;
  nodes: TroubleshootingNode[];
  relatedFaultCodes: string[];
}

export interface RepairStep {
  stepNumber: number;
  instruction: string;
  image?: string;
  warning?: string;
  tip?: string;
  torqueSpec?: string;
  checkPoint?: string;
}

export interface RepairProcedure {
  id: string;
  serviceId: ServiceCategory;
  name: string;
  symptom: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
  timeEstimate: string;
  tools: string[];
  parts: { partNumber: string; name: string; quantity: number }[];
  safetyWarnings: string[];
  steps: RepairStep[];
  testProcedure: string;
  linkedFaultCodes: string[];
}

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  serviceIds: ServiceCategory[];
  price: { min: number; max: number; currency: string };
  availability: 'in-stock' | 'order' | 'special-order';
  leadTime: string;
  specifications: Record<string, string>;
  compatibleModels: string[];
  replacementInterval?: string;
  image?: string;
}

export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  interval: string; // e.g., "500 hours", "monthly", "annually"
  intervalHours?: number;
  procedure: string[];
  tools: string[];
  parts?: string[];
  estimatedTime: string;
  category: 'preventive' | 'predictive' | 'corrective';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface MaintenanceSchedule {
  serviceId: ServiceCategory;
  tasks: MaintenanceTask[];
}

// ServiceDocumentation - Unified structure for comprehensive service docs
export interface ServiceDocumentation {
  id: string;
  name: string;
  description: string;
  icon: string;
  schematics: {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl?: string;
    components: { id: string; name: string; description: string; position: { x: number; y: number } }[];
    annotations: { id: string; text: string; position: { x: number; y: number }; color?: string }[];
  }[];
  wiringDiagrams: {
    id: string;
    name: string;
    description: string;
    systemType: string;
    wires: {
      id: string;
      from: string;
      to: string;
      color: string;
      gauge: string;
      function: string;
      notes?: string;
    }[];
    safetyNotes: string[];
    tools?: string[];
  }[];
  troubleshootingGuides: {
    id: string;
    title: string;
    symptoms: string[];
    possibleCauses: string[];
    diagnosticSteps: {
      step: number;
      action: string;
      expectedResult: string;
      ifFails: string;
    }[];
    solutions: string[];
  }[];
  repairProcedures: {
    id: string;
    title: string;
    difficulty: string;
    estimatedTime: string;
    requiredTools: string[];
    requiredParts: string[];
    steps: {
      stepNumber: number;
      title: string;
      instruction: string;
      warnings?: string[];
      tips?: string[];
    }[];
    qualityChecks: string[];
  }[];
  partsReference: {
    id: string;
    name: string;
    category: string;
    variants: {
      partNumber: string;
      description: string;
      specifications: string;
      compatibleModels: string[];
      price?: number;
    }[];
    imageUrl?: string;
    supplier?: string;
    leadTime?: string;
  }[];
  maintenanceSchedules: {
    id: string;
    name: string;
    equipmentType: string;
    tasks: {
      task: string;
      interval: string;
      procedure: string;
      criticalLevel: 'low' | 'medium' | 'high';
    }[];
    notes?: string;
  }[];
}

// ==================== IEC WIRE COLOR STANDARDS ====================

export const IEC_WIRE_COLORS: Record<string, { hex: string; name: string; function: string }> = {
  'BN': { hex: '#8B4513', name: 'Brown', function: 'L1 / Live Phase 1' },
  'BK': { hex: '#1a1a1a', name: 'Black', function: 'L2 / Live Phase 2' },
  'GY': { hex: '#808080', name: 'Grey', function: 'L3 / Live Phase 3' },
  'BU': { hex: '#0066CC', name: 'Blue', function: 'Neutral (N)' },
  'GNYE': { hex: '#228B22', name: 'Green/Yellow', function: 'Protective Earth (PE)' },
  'RD': { hex: '#DC2626', name: 'Red', function: 'Control Circuit +' },
  'WH': { hex: '#F5F5F5', name: 'White', function: 'Control Circuit Common' },
  'OG': { hex: '#F97316', name: 'Orange', function: 'Control Circuit' },
  'YE': { hex: '#EAB308', name: 'Yellow', function: 'Control Circuit' },
  'VT': { hex: '#8B5CF6', name: 'Violet', function: 'Control Circuit' },
  'PK': { hex: '#EC4899', name: 'Pink', function: 'Control Circuit' },
  'RDWH': { hex: '#DC2626', name: 'Red/White', function: '+24V DC' },
  'BUWH': { hex: '#0066CC', name: 'Blue/White', function: '0V DC Reference' },
};

// ==================== SERVICES DATA ====================

export const TECHNICAL_SERVICES: TechnicalService[] = [
  {
    id: 'solar-systems',
    name: 'Solar Systems',
    icon: 'sun',
    description: 'Complete solar PV system documentation including panels, inverters, batteries, and charge controllers',
    color: '#F59E0B',
    schematicCount: 24,
    wiringDiagramCount: 18,
    troubleshootingGuides: 32,
    repairProcedures: 28,
  },
  {
    id: 'diesel-generators',
    name: 'Diesel Generators',
    icon: 'zap',
    description: 'Comprehensive generator documentation covering engine, electrical, control, and fuel systems',
    color: '#EF4444',
    schematicCount: 45,
    wiringDiagramCount: 36,
    troubleshootingGuides: 58,
    repairProcedures: 42,
  },
  {
    id: 'controls',
    name: 'Control Systems',
    icon: 'sliders',
    description: 'Generator controllers, ATS panels, synchronization systems, and automation controllers',
    color: '#3B82F6',
    schematicCount: 32,
    wiringDiagramCount: 28,
    troubleshootingGuides: 44,
    repairProcedures: 35,
  },
  {
    id: 'ac-ups',
    name: 'AC & UPS',
    icon: 'thermometer',
    description: 'Air conditioning systems and uninterruptible power supplies',
    color: '#06B6D4',
    schematicCount: 20,
    wiringDiagramCount: 16,
    troubleshootingGuides: 26,
    repairProcedures: 22,
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: 'cpu',
    description: 'PLC systems, SCADA, industrial automation, and smart control systems',
    color: '#8B5CF6',
    schematicCount: 28,
    wiringDiagramCount: 24,
    troubleshootingGuides: 36,
    repairProcedures: 30,
  },
  {
    id: 'pumps',
    name: 'Pumps & Water',
    icon: 'droplet',
    description: 'Water pumping systems, borehole pumps, and irrigation systems',
    color: '#0EA5E9',
    schematicCount: 18,
    wiringDiagramCount: 14,
    troubleshootingGuides: 24,
    repairProcedures: 20,
  },
  {
    id: 'incinerators',
    name: 'Incinerators',
    icon: 'flame',
    description: 'Waste incineration systems including combustion chambers and emission controls',
    color: '#F97316',
    schematicCount: 12,
    wiringDiagramCount: 10,
    troubleshootingGuides: 16,
    repairProcedures: 14,
  },
  {
    id: 'motors-rewinding',
    name: 'Motors & Rewinding',
    icon: 'settings',
    description: 'Electric motor repair, rewinding procedures, and testing protocols',
    color: '#10B981',
    schematicCount: 22,
    wiringDiagramCount: 18,
    troubleshootingGuides: 30,
    repairProcedures: 26,
  },
  {
    id: 'fabrication',
    name: 'Fabrication',
    icon: 'tool',
    description: 'Welding systems, metal fabrication equipment, and workshop machinery',
    color: '#64748B',
    schematicCount: 14,
    wiringDiagramCount: 12,
    troubleshootingGuides: 18,
    repairProcedures: 16,
  },
  {
    id: 'diagnostics-hub',
    name: 'Diagnostics Hub',
    icon: 'activity',
    description: 'Diagnostic equipment, testing tools, and measurement systems',
    color: '#EC4899',
    schematicCount: 16,
    wiringDiagramCount: 14,
    troubleshootingGuides: 22,
    repairProcedures: 18,
  },
];

// ==================== SAMPLE SCHEMATICS ====================

export const SAMPLE_SCHEMATICS: Schematic[] = [
  {
    id: 'gen-starter-circuit',
    serviceId: 'diesel-generators',
    name: 'Generator Starting Circuit',
    description: 'Complete starting circuit including battery, starter motor, solenoid, and control logic',
    category: 'Electrical',
    difficulty: 'intermediate',
    viewBox: { x: 0, y: 0, width: 800, height: 600 },
    layers: [
      { id: 'power', name: 'Power Circuit', color: '#EF4444', visible: true },
      { id: 'control', name: 'Control Circuit', color: '#3B82F6', visible: true },
      { id: 'ground', name: 'Ground/Earth', color: '#22C55E', visible: true },
      { id: 'sensors', name: 'Sensors', color: '#F59E0B', visible: true },
    ],
    components: [
      {
        id: 'battery',
        name: 'Battery Bank',
        type: 'component',
        x: 100,
        y: 300,
        width: 60,
        height: 80,
        properties: { voltage: '24V', capacity: '200Ah', type: 'Lead-Acid' },
        connectedTo: ['main-fuse', 'ground-point'],
        layer: 'power',
        details: 'Main starting battery bank. Ensure terminals are clean and tight.',
        partNumber: 'BAT-24V-200AH',
        specifications: { 'Cold Cranking Amps': '1200A', 'Reserve Capacity': '400 min' },
      },
      {
        id: 'main-fuse',
        name: 'Main Fuse',
        type: 'component',
        x: 200,
        y: 280,
        width: 40,
        height: 20,
        properties: { rating: '200A', type: 'ANL' },
        connectedTo: ['battery', 'starter-relay'],
        layer: 'power',
        details: 'Main battery protection fuse. Replace with same rating only.',
        partNumber: 'FUSE-ANL-200',
      },
      {
        id: 'starter-relay',
        name: 'Starter Relay',
        type: 'component',
        x: 300,
        y: 260,
        width: 50,
        height: 40,
        properties: { coilVoltage: '24V', contactRating: '150A' },
        connectedTo: ['main-fuse', 'starter-motor', 'controller'],
        layer: 'power',
        details: 'Main starter relay. Coil controlled by generator controller.',
        partNumber: 'REL-STR-24V',
      },
      {
        id: 'starter-motor',
        name: 'Starter Motor',
        type: 'component',
        x: 450,
        y: 250,
        width: 80,
        height: 60,
        properties: { power: '5.5kW', voltage: '24V', teeth: '10' },
        connectedTo: ['starter-relay', 'ground-point'],
        layer: 'power',
        details: 'Gear reduction starter motor. Check pinion engagement regularly.',
        partNumber: 'SM-24V-5K5',
        specifications: { 'Rotation': 'CW from drive end', 'Mounting': 'SAE#3' },
      },
      {
        id: 'controller',
        name: 'Generator Controller',
        type: 'component',
        x: 300,
        y: 150,
        width: 100,
        height: 60,
        properties: { model: 'DSE7320', voltage: '8-35V DC' },
        connectedTo: ['starter-relay', 'oil-sensor', 'temp-sensor', 'mpu'],
        layer: 'control',
        details: 'Main generator controller. Manages starting sequence and protection.',
        partNumber: 'DSE-7320',
      },
    ],
    notes: [
      'Always disconnect battery negative before working on starting circuit',
      'Check battery voltage before troubleshooting - minimum 24V for proper operation',
      'Starter motor should disengage within 0.5 seconds of engine starting',
    ],
    relatedDiagrams: ['gen-charging-circuit', 'gen-control-wiring'],
    lastUpdated: '2024-03-15',
  },
  {
    id: 'solar-grid-tie',
    serviceId: 'solar-systems',
    name: 'Grid-Tie Solar Inverter System',
    description: 'Complete grid-tie solar system with string inverter and monitoring',
    category: 'System Overview',
    difficulty: 'advanced',
    viewBox: { x: 0, y: 0, width: 1000, height: 700 },
    layers: [
      { id: 'dc', name: 'DC Circuit', color: '#EF4444', visible: true },
      { id: 'ac', name: 'AC Circuit', color: '#3B82F6', visible: true },
      { id: 'ground', name: 'Ground/Earth', color: '#22C55E', visible: true },
      { id: 'monitoring', name: 'Monitoring', color: '#8B5CF6', visible: true },
    ],
    components: [
      {
        id: 'pv-array',
        name: 'PV Array',
        type: 'component',
        x: 100,
        y: 200,
        width: 120,
        height: 200,
        properties: { power: '10kWp', voc: '450V', isc: '28A' },
        connectedTo: ['dc-disconnect', 'surge-protector'],
        layer: 'dc',
        details: 'Solar panel array. 20 x 500W panels in 2 strings of 10.',
        specifications: { 'Vmp': '380V', 'Imp': '26.3A', 'Panels': '20 x 500W' },
      },
    ],
    notes: [
      'DC voltage can reach 600V+ in open circuit conditions',
      'Always measure DC voltage before touching any connections',
      'Inverter must be isolated from both DC and AC before service',
    ],
    relatedDiagrams: ['solar-battery-hybrid', 'solar-string-detail'],
    lastUpdated: '2024-03-10',
  },
];

// ==================== SAMPLE WIRING DIAGRAMS ====================

export const SAMPLE_WIRING_DIAGRAMS: WiringDiagram[] = [
  {
    id: 'gen-ats-wiring',
    serviceId: 'controls',
    name: 'ATS Control Wiring',
    description: 'Automatic Transfer Switch control circuit wiring',
    category: 'Control Wiring',
    wires: [
      {
        id: 'w1',
        from: 'controller-pin1',
        to: 'ats-coil-a',
        color: 'RD',
        colorName: 'Red',
        gauge: '1.5mm2',
        type: 'Stranded',
        function: 'ATS to Mains Command',
        maxCurrent: '2A',
        voltage: '24V DC',
      },
      {
        id: 'w2',
        from: 'controller-pin2',
        to: 'ats-coil-b',
        color: 'BU',
        colorName: 'Blue',
        gauge: '1.5mm2',
        type: 'Stranded',
        function: 'ATS to Generator Command',
        maxCurrent: '2A',
        voltage: '24V DC',
      },
      {
        id: 'w3',
        from: 'ats-aux-1',
        to: 'controller-pin5',
        color: 'YE',
        colorName: 'Yellow',
        gauge: '1.0mm2',
        type: 'Stranded',
        function: 'Mains Position Feedback',
        maxCurrent: '0.5A',
        voltage: '24V DC',
      },
      {
        id: 'w4',
        from: 'ats-aux-2',
        to: 'controller-pin6',
        color: 'OG',
        colorName: 'Orange',
        gauge: '1.0mm2',
        type: 'Stranded',
        function: 'Generator Position Feedback',
        maxCurrent: '0.5A',
        voltage: '24V DC',
      },
      {
        id: 'w5',
        from: 'controller-gnd',
        to: 'ats-common',
        color: 'BUWH',
        colorName: 'Blue/White',
        gauge: '1.5mm2',
        type: 'Stranded',
        function: '0V DC Common',
        maxCurrent: '5A',
        voltage: '0V',
      },
    ],
    terminals: [
      { id: 'controller-pin1', name: 'Controller Pin 1', x: 100, y: 100, type: 'output' },
      { id: 'controller-pin2', name: 'Controller Pin 2', x: 100, y: 130, type: 'output' },
      { id: 'controller-pin5', name: 'Controller Pin 5', x: 100, y: 200, type: 'input' },
      { id: 'controller-pin6', name: 'Controller Pin 6', x: 100, y: 230, type: 'input' },
      { id: 'controller-gnd', name: 'Controller GND', x: 100, y: 280, type: 'ground' },
      { id: 'ats-coil-a', name: 'ATS Coil A', x: 400, y: 100, type: 'input' },
      { id: 'ats-coil-b', name: 'ATS Coil B', x: 400, y: 130, type: 'input' },
      { id: 'ats-aux-1', name: 'ATS Aux 1', x: 400, y: 200, type: 'output' },
      { id: 'ats-aux-2', name: 'ATS Aux 2', x: 400, y: 230, type: 'output' },
      { id: 'ats-common', name: 'ATS Common', x: 400, y: 280, type: 'ground' },
    ],
    annotations: [
      { x: 250, y: 80, text: 'Control cables should be shielded' },
      { x: 250, y: 300, text: 'Ground shield at controller end only' },
    ],
    safetyNotes: [
      'Isolate both mains and generator before working on ATS',
      'Verify ATS position mechanically before assuming safe',
      'Control circuits may remain live when main power is off',
    ],
    testPoints: [
      {
        id: 'tp1',
        name: 'ATS Command Voltage',
        expectedValue: '24V DC when active',
        procedure: 'Measure between Pin 1/2 and GND during transfer',
      },
      {
        id: 'tp2',
        name: 'Position Feedback',
        expectedValue: '24V when in position, 0V when not',
        procedure: 'Measure Pin 5/6 to GND after transfer complete',
      },
    ],
  },
];

// ==================== TROUBLESHOOTING TREES ====================

export const TROUBLESHOOTING_TREES: TroubleshootingTree[] = [
  {
    id: 'gen-no-start',
    serviceId: 'diesel-generators',
    name: 'Generator Won\'t Start',
    symptom: 'Generator cranks but does not start, or does not crank at all',
    startNode: 'check-battery',
    relatedFaultCodes: ['DSE-4261', 'DSE-4271', 'DSE-1621'],
    nodes: [
      {
        id: 'check-battery',
        question: 'Is battery voltage above 24V (or 12V for 12V systems)?',
        yesNode: 'check-estop',
        noNode: 'solution-battery',
        tools: ['Multimeter'],
        timeEstimate: '2 minutes',
      },
      {
        id: 'solution-battery',
        question: '',
        solution: 'Charge or replace battery. Check charger operation. Test battery under load.',
        severity: 'warning',
        partsList: ['Battery', 'Battery charger'],
        timeEstimate: '30-60 minutes',
      },
      {
        id: 'check-estop',
        question: 'Is the emergency stop released and reset?',
        yesNode: 'check-fuel',
        noNode: 'solution-estop',
        timeEstimate: '1 minute',
      },
      {
        id: 'solution-estop',
        question: '',
        solution: 'Release emergency stop button. Twist clockwise or pull out to release. Check for multiple E-stops on panel and remote locations.',
        severity: 'info',
        timeEstimate: '2 minutes',
      },
      {
        id: 'check-fuel',
        question: 'Is there fuel in the tank and is fuel reaching the injection pump?',
        yesNode: 'check-crank',
        noNode: 'solution-fuel',
        tools: ['Visual inspection', 'Fuel pressure gauge'],
        timeEstimate: '5 minutes',
      },
      {
        id: 'solution-fuel',
        question: '',
        solution: 'Refill fuel tank. Bleed fuel system. Check fuel filters for blockage. Verify fuel solenoid operation.',
        severity: 'warning',
        tools: ['Fuel pressure gauge', 'Filter wrench'],
        partsList: ['Fuel filter', 'Fuel'],
        timeEstimate: '15-45 minutes',
      },
      {
        id: 'check-crank',
        question: 'Does the engine crank when start is pressed?',
        yesNode: 'check-compression',
        noNode: 'check-starter',
        timeEstimate: '1 minute',
      },
      {
        id: 'check-starter',
        question: 'Do you hear the starter solenoid click when pressing start?',
        yesNode: 'solution-starter-motor',
        noNode: 'solution-control',
        timeEstimate: '1 minute',
      },
      {
        id: 'solution-starter-motor',
        question: '',
        solution: 'Starter motor failure. Check starter motor cables for tightness. Test starter motor by direct battery connection (jumpering). Replace starter if faulty.',
        severity: 'warning',
        tools: ['Multimeter', 'Jump cables'],
        partsList: ['Starter motor'],
        timeEstimate: '30-90 minutes',
      },
      {
        id: 'solution-control',
        question: '',
        solution: 'Control circuit issue. Check controller fault codes. Verify start signal from controller. Check wiring from controller to starter relay.',
        severity: 'critical',
        tools: ['Multimeter', 'Controller manual'],
        timeEstimate: '30-120 minutes',
      },
      {
        id: 'check-compression',
        question: 'Is the engine cranking at normal speed (not slow)?',
        yesNode: 'check-air',
        noNode: 'solution-compression',
        timeEstimate: '1 minute',
      },
      {
        id: 'solution-compression',
        question: '',
        solution: 'Possible low compression or internal engine issue. Perform compression test. Check valve clearances. Inspect for seized components.',
        severity: 'critical',
        tools: ['Compression tester', 'Feeler gauges'],
        timeEstimate: '60-180 minutes',
      },
      {
        id: 'check-air',
        question: 'Is the air filter clean and air intake unrestricted?',
        yesNode: 'solution-specialist',
        noNode: 'solution-air',
        tools: ['Visual inspection', 'Restriction gauge'],
        timeEstimate: '5 minutes',
      },
      {
        id: 'solution-air',
        question: '',
        solution: 'Replace air filter. Check intake ducting for blockages or collapsed hoses.',
        severity: 'info',
        partsList: ['Air filter'],
        timeEstimate: '10-20 minutes',
      },
      {
        id: 'solution-specialist',
        question: '',
        solution: 'Issue requires specialist diagnosis. Possible fuel injection timing, injector failure, or ECU issue. Contact authorized service center.',
        severity: 'critical',
        timeEstimate: 'Contact specialist',
      },
    ],
  },
  {
    id: 'solar-low-output',
    serviceId: 'solar-systems',
    name: 'Solar System Low Output',
    symptom: 'Solar system producing less power than expected',
    startNode: 'check-weather',
    relatedFaultCodes: [],
    nodes: [
      {
        id: 'check-weather',
        question: 'Is it a clear, sunny day with no shading on panels?',
        yesNode: 'check-panels',
        noNode: 'solution-weather',
        timeEstimate: '1 minute',
      },
      {
        id: 'solution-weather',
        question: '',
        solution: 'Weather conditions affecting output. Check for temporary shading (trees, new construction). Clean panels if dusty. Wait for better conditions to evaluate.',
        severity: 'info',
        timeEstimate: '30 minutes',
      },
      {
        id: 'check-panels',
        question: 'Are all panels clean and free from damage or hot spots?',
        yesNode: 'check-voltage',
        noNode: 'solution-panels',
        tools: ['IR thermometer', 'Visual inspection'],
        timeEstimate: '15 minutes',
      },
      {
        id: 'solution-panels',
        question: '',
        solution: 'Clean panels with soft brush and water. Inspect for cracks, discoloration, or burn marks. Replace damaged panels.',
        severity: 'warning',
        partsList: ['Replacement panel if damaged'],
        timeEstimate: '30-120 minutes',
      },
      {
        id: 'check-voltage',
        question: 'Is the DC string voltage within expected range (check nameplate Vmp x number of panels)?',
        yesNode: 'check-inverter',
        noNode: 'solution-string',
        tools: ['Multimeter (DC)'],
        timeEstimate: '10 minutes',
      },
      {
        id: 'solution-string',
        question: '',
        solution: 'String voltage issue. Check individual panel voltages to identify failed panel. Check string fuses. Verify MC4 connections are secure.',
        severity: 'warning',
        tools: ['Multimeter', 'MC4 disconnect tool'],
        timeEstimate: '30-60 minutes',
      },
      {
        id: 'check-inverter',
        question: 'Is the inverter showing any error codes or warning lights?',
        yesNode: 'solution-inverter-error',
        noNode: 'check-grid',
        timeEstimate: '2 minutes',
      },
      {
        id: 'solution-inverter-error',
        question: '',
        solution: 'Refer to inverter error code in manual. Common issues: ground fault, grid voltage out of range, over temperature. Reset inverter after addressing root cause.',
        severity: 'warning',
        tools: ['Inverter manual'],
        timeEstimate: '15-60 minutes',
      },
      {
        id: 'check-grid',
        question: 'Is grid voltage and frequency within acceptable range?',
        yesNode: 'solution-specialist-solar',
        noNode: 'solution-grid',
        tools: ['Power quality meter'],
        timeEstimate: '5 minutes',
      },
      {
        id: 'solution-grid',
        question: '',
        solution: 'Grid conditions causing inverter derating or shutdown. May need to adjust inverter grid parameters. Contact utility if persistent.',
        severity: 'info',
        timeEstimate: 'Contact utility',
      },
      {
        id: 'solution-specialist-solar',
        question: '',
        solution: 'Issue requires detailed system analysis. Check MPPT tracking, review monitoring data, verify system design matches installation.',
        severity: 'warning',
        timeEstimate: 'Contact specialist',
      },
    ],
  },
];

// ==================== SAMPLE REPAIR PROCEDURES ====================

export const REPAIR_PROCEDURES: RepairProcedure[] = [
  {
    id: 'gen-fuel-filter-change',
    serviceId: 'diesel-generators',
    name: 'Fuel Filter Replacement',
    symptom: 'Power loss under load, hard starting, fuel starvation',
    description: 'Procedure for replacing primary and secondary fuel filters on diesel generators',
    difficulty: 'easy',
    timeEstimate: '30-45 minutes',
    tools: [
      'Filter wrench or strap wrench',
      'Drain pan',
      'Clean rags',
      'New filter seals/O-rings',
      'Priming pump (if manual)',
      'Safety glasses',
    ],
    parts: [
      { partNumber: 'FF-3890017', name: 'Primary Fuel Filter', quantity: 1 },
      { partNumber: 'FF-3890018', name: 'Secondary Fuel Filter', quantity: 1 },
      { partNumber: 'ORG-FF-001', name: 'Filter O-Ring Set', quantity: 1 },
    ],
    safetyWarnings: [
      'Shut down generator and allow to cool before starting',
      'No smoking or open flames near fuel system',
      'Have fire extinguisher readily available',
      'Dispose of old fuel and filters properly',
      'Wear safety glasses when bleeding fuel system',
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Shut down the generator and turn off the fuel supply valve if equipped.',
        warning: 'Ensure engine is completely stopped before proceeding',
      },
      {
        stepNumber: 2,
        instruction: 'Place drain pan under the filter housings to catch any spilled fuel.',
        tip: 'Have absorbent rags ready for any drips',
      },
      {
        stepNumber: 3,
        instruction: 'Locate the primary (water separator) and secondary (fine) fuel filters. Note their positions.',
        checkPoint: 'Photograph filter arrangement for reference if needed',
      },
      {
        stepNumber: 4,
        instruction: 'Using filter wrench, loosen the primary fuel filter by turning counter-clockwise.',
        warning: 'Support the filter as it loosens to prevent fuel spillage',
      },
      {
        stepNumber: 5,
        instruction: 'Remove the old filter. Drain any remaining fuel into the pan. Inspect the filter for contamination.',
        checkPoint: 'Note any water, debris, or unusual discoloration in old filter',
      },
      {
        stepNumber: 6,
        instruction: 'Clean the filter head sealing surface with a clean rag. Remove any old O-ring material.',
        tip: 'A light coating of clean diesel on the new O-ring helps sealing',
      },
      {
        stepNumber: 7,
        instruction: 'Fill the new filter with clean diesel fuel before installation (if possible for your filter type).',
        tip: 'Pre-filling reduces air in system and speeds priming',
      },
      {
        stepNumber: 8,
        instruction: 'Install the new filter. Hand-tighten, then tighten an additional 1/2 to 3/4 turn with filter wrench.',
        torqueSpec: 'Do not over-tighten - filter should seal with gasket compression only',
      },
      {
        stepNumber: 9,
        instruction: 'Repeat steps 4-8 for the secondary fuel filter.',
      },
      {
        stepNumber: 10,
        instruction: 'Open fuel supply valve. Use priming pump to bleed air from system until solid fuel flows.',
        checkPoint: 'No air bubbles should be visible at bleed point',
      },
      {
        stepNumber: 11,
        instruction: 'Start the generator and let it run for several minutes. Check for leaks around filters.',
        checkPoint: 'Monitor for any fuel seepage around filter seals',
      },
      {
        stepNumber: 12,
        instruction: 'Apply load and verify normal power output with no surging or hunting.',
        checkPoint: 'Generator should carry full load smoothly',
      },
    ],
    testProcedure: 'Run generator at full rated load for 15 minutes. Monitor for any power fluctuations, fuel leaks, or unusual sounds.',
    linkedFaultCodes: ['DSE-1631', 'DSE-1632', 'CUM-291'],
  },
];

// ==================== SAMPLE PARTS CATALOG ====================

export const PARTS_CATALOG: Part[] = [
  {
    id: 'fuel-filter-primary',
    partNumber: 'FF-3890017',
    name: 'Primary Fuel Filter / Water Separator',
    description: 'Primary fuel filtration with water separation. First line of defense for fuel system.',
    category: 'Filters',
    serviceIds: ['diesel-generators'],
    price: { min: 2500, max: 5500, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    specifications: {
      'Micron Rating': '30 micron',
      'Water Separator': 'Yes',
      'Thread Size': '1-14 UNS',
      'Height': '150mm',
      'Efficiency': '98% @ 30 micron',
    },
    compatibleModels: ['Cummins 4BT', 'Cummins 6BT', 'Cummins QSB', 'Perkins 1000 Series'],
    replacementInterval: '500-1000 hours',
  },
  {
    id: 'fuel-filter-secondary',
    partNumber: 'FF-3890018',
    name: 'Secondary Fuel Filter (Fine)',
    description: 'Fine filtration protecting injectors from micro-contamination.',
    category: 'Filters',
    serviceIds: ['diesel-generators'],
    price: { min: 3500, max: 8000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    specifications: {
      'Micron Rating': '5 micron',
      'Thread Size': '3/4-16 UNF',
      'Height': '120mm',
      'Efficiency': '98.7% @ 5 micron',
    },
    compatibleModels: ['Cummins 4BT', 'Cummins 6BT', 'Cummins QSB', 'Perkins 1000 Series'],
    replacementInterval: '500-1000 hours',
  },
  {
    id: 'solar-panel-550w',
    partNumber: 'SP-MONO-550',
    name: 'Monocrystalline Solar Panel 550W',
    description: 'High-efficiency monocrystalline solar panel for grid-tie and off-grid systems.',
    category: 'Solar Panels',
    serviceIds: ['solar-systems'],
    price: { min: 18000, max: 28000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: '3-5 business days',
    specifications: {
      'Power': '550W',
      'Voc': '49.8V',
      'Isc': '14.02A',
      'Vmp': '41.7V',
      'Imp': '13.19A',
      'Efficiency': '21.3%',
      'Dimensions': '2278 x 1134 x 35mm',
      'Weight': '28.6kg',
      'Cells': '144 half-cut',
    },
    compatibleModels: ['All string inverters', 'MPPT charge controllers'],
    image: '/images/solar-panel-550w.jpg',
  },
];

// ==================== MAINTENANCE SCHEDULES ====================

export const MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [
  {
    serviceId: 'diesel-generators',
    tasks: [
      {
        id: 'daily-check',
        name: 'Daily Inspection',
        description: 'Visual inspection and operational check',
        interval: 'Daily',
        intervalHours: 8,
        procedure: [
          'Check oil level - add if below MIN mark',
          'Check coolant level in overflow tank',
          'Check fuel level',
          'Inspect for leaks (oil, fuel, coolant)',
          'Check battery terminals for corrosion',
          'Test start the generator if not in use',
          'Record engine hours',
        ],
        tools: ['Visual inspection', 'Clean rag'],
        estimatedTime: '10-15 minutes',
        category: 'preventive',
        priority: 'medium',
      },
      {
        id: 'oil-change',
        name: 'Engine Oil and Filter Change',
        description: 'Replace engine oil and oil filter',
        interval: '250 hours',
        intervalHours: 250,
        procedure: [
          'Warm engine to operating temperature',
          'Shut down and place drain pan',
          'Remove drain plug and drain oil completely',
          'Remove and replace oil filter',
          'Install drain plug with new washer',
          'Fill with correct grade and quantity of oil',
          'Start engine and check for leaks',
          'Verify oil pressure and level',
        ],
        tools: [
          'Drain pan',
          'Filter wrench',
          'Torque wrench',
          '17mm socket for drain plug',
        ],
        parts: ['Engine oil (quantity per manual)', 'Oil filter', 'Drain plug washer'],
        estimatedTime: '30-45 minutes',
        category: 'preventive',
        priority: 'high',
      },
      {
        id: 'fuel-filter',
        name: 'Fuel Filter Replacement',
        description: 'Replace primary and secondary fuel filters',
        interval: '500 hours',
        intervalHours: 500,
        procedure: [
          'Shut down generator',
          'Close fuel supply valve',
          'Place drain pan under filters',
          'Replace primary filter (water separator)',
          'Replace secondary filter (fine filter)',
          'Bleed fuel system',
          'Check for leaks',
        ],
        tools: ['Filter wrench', 'Drain pan', 'Clean rags'],
        parts: ['Primary fuel filter', 'Secondary fuel filter'],
        estimatedTime: '30-45 minutes',
        category: 'preventive',
        priority: 'high',
      },
      {
        id: 'air-filter',
        name: 'Air Filter Inspection/Replacement',
        description: 'Inspect and clean or replace air filter element',
        interval: '500 hours',
        intervalHours: 500,
        procedure: [
          'Remove air filter housing cover',
          'Carefully remove filter element',
          'Inspect element for damage or excessive dirt',
          'Clean housing interior',
          'Install new or cleaned element',
          'Ensure proper seal',
          'Replace housing cover',
        ],
        tools: ['Screwdriver', 'Clean rag', 'Compressed air (for cleaning)'],
        parts: ['Air filter element (if replacing)'],
        estimatedTime: '15-20 minutes',
        category: 'preventive',
        priority: 'medium',
      },
      {
        id: 'coolant-system',
        name: 'Coolant System Service',
        description: 'Check coolant condition and SCA level, flush if needed',
        interval: '2000 hours or annually',
        intervalHours: 2000,
        procedure: [
          'Check coolant level and condition',
          'Test coolant protection level with refractometer',
          'Test SCA/DCA level with test strips',
          'Add coolant conditioner if low',
          'Check hoses for cracks or swelling',
          'Check radiator for blockages',
          'Pressure test system if needed',
        ],
        tools: [
          'Coolant refractometer',
          'SCA test strips',
          'Pressure tester',
        ],
        parts: ['Coolant conditioner', 'Coolant (if adding)'],
        estimatedTime: '30-60 minutes',
        category: 'preventive',
        priority: 'medium',
      },
      {
        id: 'valve-adjustment',
        name: 'Valve Clearance Check/Adjustment',
        description: 'Check and adjust valve lash to specification',
        interval: '4000 hours',
        intervalHours: 4000,
        procedure: [
          'Remove valve cover',
          'Rotate engine to TDC on cylinder 1',
          'Check inlet and exhaust valve clearances',
          'Adjust if outside specification',
          'Rotate to next firing order position',
          'Repeat for all cylinders',
          'Install new valve cover gasket',
          'Torque valve cover bolts',
        ],
        tools: [
          'Feeler gauges',
          'Valve adjustment tools',
          'Torque wrench',
          'Socket set',
        ],
        parts: ['Valve cover gasket'],
        estimatedTime: '2-4 hours',
        category: 'preventive',
        priority: 'high',
      },
    ],
  },
  {
    serviceId: 'solar-systems',
    tasks: [
      {
        id: 'panel-cleaning',
        name: 'Solar Panel Cleaning',
        description: 'Clean solar panels to maintain optimal output',
        interval: 'Monthly or as needed',
        intervalHours: 720,
        procedure: [
          'Inspect panels for visible soiling',
          'Clean early morning or evening when panels are cool',
          'Use soft brush and clean water',
          'Avoid harsh chemicals or abrasive materials',
          'Rinse thoroughly',
          'Inspect for damage while cleaning',
        ],
        tools: ['Soft brush', 'Hose with clean water', 'Squeegee'],
        estimatedTime: '30-60 minutes per 10 panels',
        category: 'preventive',
        priority: 'medium',
      },
      {
        id: 'connection-check',
        name: 'Electrical Connection Inspection',
        description: 'Check all electrical connections for tightness and corrosion',
        interval: '6 months',
        intervalHours: 4320,
        procedure: [
          'Shut down system and isolate',
          'Inspect MC4 connectors for damage',
          'Check combiner box connections',
          'Verify inverter terminal connections',
          'Check grounding connections',
          'Look for signs of arcing or heating',
          'Re-torque connections if needed',
        ],
        tools: ['Insulated screwdrivers', 'Torque wrench', 'IR thermometer'],
        estimatedTime: '1-2 hours',
        category: 'preventive',
        priority: 'high',
      },
      {
        id: 'inverter-check',
        name: 'Inverter Inspection',
        description: 'Check inverter operation and clean if needed',
        interval: '6 months',
        intervalHours: 4320,
        procedure: [
          'Check inverter display for errors',
          'Record inverter readings',
          'Clean air vents and filters',
          'Check for unusual sounds',
          'Verify fan operation',
          'Check cable entries for seal',
        ],
        tools: ['Soft brush', 'Vacuum cleaner'],
        estimatedTime: '30 minutes per inverter',
        category: 'preventive',
        priority: 'medium',
      },
      {
        id: 'battery-maintenance',
        name: 'Battery System Maintenance (if applicable)',
        description: 'Check battery health and connections',
        interval: 'Monthly',
        intervalHours: 720,
        procedure: [
          'Check battery voltage',
          'Inspect terminals for corrosion',
          'Check electrolyte level (flooded batteries)',
          'Clean terminals if needed',
          'Verify battery temperature',
          'Check charge/discharge cycles',
        ],
        tools: ['Multimeter', 'Hydrometer (flooded)', 'Terminal brush'],
        parts: ['Distilled water (flooded)', 'Terminal protector'],
        estimatedTime: '30-60 minutes',
        category: 'preventive',
        priority: 'high',
      },
    ],
  },
];

// ==================== SEARCH FUNCTIONS ====================

export function searchAllContent(query: string): {
  schematics: Schematic[];
  wiringDiagrams: WiringDiagram[];
  troubleshooting: TroubleshootingTree[];
  repairs: RepairProcedure[];
  parts: Part[];
} {
  const lowerQuery = query.toLowerCase();

  return {
    schematics: SAMPLE_SCHEMATICS.filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.components.some(c => c.name.toLowerCase().includes(lowerQuery))
    ),
    wiringDiagrams: SAMPLE_WIRING_DIAGRAMS.filter(w =>
      w.name.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.wires.some(wire => wire.function.toLowerCase().includes(lowerQuery))
    ),
    troubleshooting: TROUBLESHOOTING_TREES.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.symptom.toLowerCase().includes(lowerQuery) ||
      t.nodes.some(n => n.question?.toLowerCase().includes(lowerQuery) || n.solution?.toLowerCase().includes(lowerQuery))
    ),
    repairs: REPAIR_PROCEDURES.filter(r =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.symptom.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery)
    ),
    parts: PARTS_CATALOG.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.partNumber.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    ),
  };
}

export function getServiceById(id: ServiceCategory): TechnicalService | undefined {
  return TECHNICAL_SERVICES.find(s => s.id === id);
}

export function getSchematicsByService(serviceId: ServiceCategory): Schematic[] {
  return SAMPLE_SCHEMATICS.filter(s => s.serviceId === serviceId);
}

export function getWiringDiagramsByService(serviceId: ServiceCategory): WiringDiagram[] {
  return SAMPLE_WIRING_DIAGRAMS.filter(w => w.serviceId === serviceId);
}

export function getTroubleshootingByService(serviceId: ServiceCategory): TroubleshootingTree[] {
  return TROUBLESHOOTING_TREES.filter(t => t.serviceId === serviceId);
}

export function getRepairsByService(serviceId: ServiceCategory): RepairProcedure[] {
  return REPAIR_PROCEDURES.filter(r => r.serviceId === serviceId);
}

export function getPartsByService(serviceId: ServiceCategory): Part[] {
  return PARTS_CATALOG.filter(p => p.serviceIds.includes(serviceId));
}

export function getMaintenanceByService(serviceId: ServiceCategory): MaintenanceSchedule | undefined {
  return MAINTENANCE_SCHEDULES.find(m => m.serviceId === serviceId);
}
