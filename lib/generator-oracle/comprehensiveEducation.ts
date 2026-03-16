/**
 * Generator Oracle - Comprehensive Educational Content System
 *
 * EMERSON EIMS PROPRIETARY CONTENT
 * All content is original, rephrased in our own technical language
 * Designed to integrate with 400,000+ fault code database
 * SEO optimized for Kenya and East Africa market
 *
 * Categories: ECM, Controllers, Engine, Electrical, Cooling, Fuel System,
 * Injector Nozzles, Injector Pump, Actuator, AVR, MPU, Sensors
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type EducationCategory =
  | 'ecm'
  | 'controller'
  | 'engine'
  | 'electrical'
  | 'cooling'
  | 'fuel_system'
  | 'injector_nozzle'
  | 'injector_pump'
  | 'actuator'
  | 'avr'
  | 'mpu'
  | 'sensors'
  | 'turbocharger'
  | 'exhaust'
  | 'lubrication'
  | 'starter_system'
  | 'alternator'
  | 'safety_systems'
  | 'parallel_operation'
  | 'load_management';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ContentType = 'theory' | 'diagnostic' | 'repair' | 'maintenance' | 'troubleshooting' | 'safety';

export interface EducationalContent {
  id: string;
  category: EducationCategory;
  subcategory: string;
  title: string;
  slug: string; // SEO URL slug
  keywords: string[]; // SEO keywords including Kenya-specific
  summary: string;
  content: ContentSection[];
  skillLevel: SkillLevel;
  contentType: ContentType;
  estimatedReadTime: number; // minutes
  relatedFaultCodes: string[]; // Links to fault code database
  relatedContent: string[]; // IDs of related educational content
  tools?: string[];
  safetyWarnings?: string[];
  proTips?: string[];
  commonMistakes?: string[];
  whenToCallProfessional?: string[];
  partsPageLink?: string; // Link to Emerson EIMS parts
  lastUpdated: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  steps?: string[];
  warnings?: string[];
  notes?: string[];
  imageAlt?: string; // For future image integration
}

export interface CategoryMeta {
  id: EducationCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  contentCount: number;
  seoTitle: string;
  seoDescription: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const EDUCATION_CATEGORIES: CategoryMeta[] = [
  {
    id: 'ecm',
    name: 'ECM (Engine Control Module)',
    description: 'Electronic brain of modern diesel engines - programming, diagnostics, and troubleshooting',
    icon: '🧠',
    color: '#6366F1',
    contentCount: 0,
    seoTitle: 'ECM Engine Control Module Guide Kenya | Generator Oracle',
    seoDescription: 'Complete ECM diagnostic and programming guide for diesel generators in Kenya. Learn fault code interpretation, parameter adjustment, and troubleshooting.'
  },
  {
    id: 'controller',
    name: 'Generator Controllers',
    description: 'DSE, ComAp, Cummins, Woodward, SmartGen controller operation and configuration',
    icon: '📟',
    color: '#8B5CF6',
    contentCount: 0,
    seoTitle: 'Generator Controller Guide Kenya | DSE ComAp Cummins',
    seoDescription: 'Master generator controller programming and diagnostics. Covers DSE, ComAp, Cummins PowerCommand, Woodward, SmartGen controllers.'
  },
  {
    id: 'engine',
    name: 'Diesel Engine Systems',
    description: 'Engine mechanical systems, compression, timing, and performance optimization',
    icon: '⚙️',
    color: '#EC4899',
    contentCount: 0,
    seoTitle: 'Diesel Generator Engine Repair Kenya | Maintenance Guide',
    seoDescription: 'Comprehensive diesel engine maintenance and repair guide for generators in Kenya. Covers Perkins, Cummins, CAT, Volvo engines.'
  },
  {
    id: 'electrical',
    name: 'Electrical Systems',
    description: 'Wiring, connections, circuit protection, and electrical troubleshooting',
    icon: '⚡',
    color: '#F59E0B',
    contentCount: 0,
    seoTitle: 'Generator Electrical System Guide Kenya | Wiring Diagnostics',
    seoDescription: 'Generator electrical system troubleshooting and repair. Learn wiring diagnostics, connection testing, and circuit protection in Kenya.'
  },
  {
    id: 'cooling',
    name: 'Cooling Systems',
    description: 'Radiator, water pump, thermostat, and coolant management',
    icon: '❄️',
    color: '#06B6D4',
    contentCount: 0,
    seoTitle: 'Generator Cooling System Kenya | Radiator Maintenance',
    seoDescription: 'Prevent generator overheating with proper cooling system maintenance. Radiator cleaning, thermostat testing, coolant management for Kenya climate.'
  },
  {
    id: 'fuel_system',
    name: 'Fuel System',
    description: 'Fuel delivery, filtration, priming, and contamination prevention',
    icon: '⛽',
    color: '#EF4444',
    contentCount: 0,
    seoTitle: 'Diesel Fuel System Guide Kenya | Generator Fuel Problems',
    seoDescription: 'Solve generator fuel system problems in Kenya. Learn fuel bleeding, filter replacement, contamination prevention, and fuel quality management.'
  },
  {
    id: 'injector_nozzle',
    name: 'Injector Nozzles',
    description: 'Fuel injector testing, cleaning, spray pattern analysis, and replacement',
    icon: '💉',
    color: '#10B981',
    contentCount: 0,
    seoTitle: 'Diesel Injector Nozzle Service Kenya | Testing & Cleaning',
    seoDescription: 'Professional injector nozzle diagnostics and service guide for Kenya. Learn spray pattern testing, cleaning procedures, and replacement timing.'
  },
  {
    id: 'injector_pump',
    name: 'Injection Pump',
    description: 'Mechanical and electronic injection pump operation, timing, and calibration',
    icon: '🔧',
    color: '#3B82F6',
    contentCount: 0,
    seoTitle: 'Diesel Injection Pump Guide Kenya | Timing & Calibration',
    seoDescription: 'Master injection pump diagnostics for generators in Kenya. Covers mechanical and electronic pumps, timing adjustment, and calibration.'
  },
  {
    id: 'actuator',
    name: 'Actuators & Governors',
    description: 'Electronic and mechanical speed control, fuel rack actuators, and governor systems',
    icon: '🎚️',
    color: '#8B5CF6',
    contentCount: 0,
    seoTitle: 'Generator Actuator Guide Kenya | Governor Troubleshooting',
    seoDescription: 'Generator actuator and governor diagnostics. Learn electronic actuator testing, mechanical governor adjustment, and speed control in Kenya.'
  },
  {
    id: 'avr',
    name: 'AVR (Voltage Regulator)',
    description: 'Automatic voltage regulation, excitation systems, and voltage stability',
    icon: '📊',
    color: '#F97316',
    contentCount: 0,
    seoTitle: 'Generator AVR Guide Kenya | Voltage Regulator Repair',
    seoDescription: 'AVR automatic voltage regulator troubleshooting guide for Kenya. Learn voltage stability, excitation testing, and AVR replacement.'
  },
  {
    id: 'mpu',
    name: 'MPU (Magnetic Pickup)',
    description: 'Speed sensing, signal generation, and MPU calibration',
    icon: '🧲',
    color: '#14B8A6',
    contentCount: 0,
    seoTitle: 'Generator MPU Sensor Guide Kenya | Speed Pickup Testing',
    seoDescription: 'MPU magnetic pickup sensor diagnostics for generators in Kenya. Learn air gap adjustment, signal testing, and troubleshooting.'
  },
  {
    id: 'sensors',
    name: 'Engine Sensors',
    description: 'Temperature, pressure, level sensors - testing, calibration, and replacement',
    icon: '📡',
    color: '#6366F1',
    contentCount: 0,
    seoTitle: 'Generator Sensor Guide Kenya | Temperature Pressure Testing',
    seoDescription: 'Complete sensor diagnostics guide for generators in Kenya. Covers temperature, pressure, level sensors - testing and replacement.'
  },
  {
    id: 'turbocharger',
    name: 'Turbocharger Systems',
    description: 'Turbo operation, boost control, wastegate adjustment, and failure prevention',
    icon: '🌀',
    color: '#EC4899',
    contentCount: 0,
    seoTitle: 'Generator Turbocharger Guide Kenya | Turbo Maintenance',
    seoDescription: 'Turbocharger maintenance and diagnostics for diesel generators in Kenya. Learn boost testing, wastegate adjustment, and turbo protection.'
  },
  {
    id: 'exhaust',
    name: 'Exhaust Systems',
    description: 'Exhaust analysis, backpressure testing, emissions, and system maintenance',
    icon: '💨',
    color: '#78716C',
    contentCount: 0,
    seoTitle: 'Generator Exhaust System Kenya | Emissions & Maintenance',
    seoDescription: 'Generator exhaust system maintenance and emissions guide for Kenya. Learn exhaust analysis, backpressure testing, and system repairs.'
  },
  {
    id: 'lubrication',
    name: 'Lubrication Systems',
    description: 'Oil system operation, pressure regulation, filtration, and oil analysis',
    icon: '🛢️',
    color: '#A3A3A3',
    contentCount: 0,
    seoTitle: 'Generator Oil System Guide Kenya | Lubrication Maintenance',
    seoDescription: 'Generator lubrication system maintenance for Kenya. Learn oil analysis, pressure testing, filtration, and proper oil selection.'
  },
  {
    id: 'starter_system',
    name: 'Starter Systems',
    description: 'Starter motor, solenoid, batteries, and charging system diagnostics',
    icon: '🔋',
    color: '#22C55E',
    contentCount: 0,
    seoTitle: 'Generator Starter System Kenya | Battery & Charging',
    seoDescription: 'Generator starting system diagnostics for Kenya. Covers starter motor testing, battery maintenance, and charging system troubleshooting.'
  },
  {
    id: 'alternator',
    name: 'Alternator Systems',
    description: 'Power generation, windings, bearings, and alternator maintenance',
    icon: '🔌',
    color: '#EAB308',
    contentCount: 0,
    seoTitle: 'Generator Alternator Guide Kenya | Winding & Bearing Service',
    seoDescription: 'Alternator maintenance and repair guide for generators in Kenya. Learn winding testing, bearing replacement, and output diagnostics.'
  },
  {
    id: 'safety_systems',
    name: 'Safety & Protection',
    description: 'Shutdown systems, alarms, interlocks, and safety device testing',
    icon: '🛡️',
    color: '#DC2626',
    contentCount: 0,
    seoTitle: 'Generator Safety Systems Kenya | Protection & Alarms',
    seoDescription: 'Generator safety system guide for Kenya. Learn protection relay testing, alarm configuration, and safety interlock verification.'
  },
  {
    id: 'parallel_operation',
    name: 'Parallel Operation',
    description: 'Synchronization, load sharing, droop settings, and parallel controls',
    icon: '⚡⚡',
    color: '#7C3AED',
    contentCount: 0,
    seoTitle: 'Generator Paralleling Guide Kenya | Synchronization',
    seoDescription: 'Master generator parallel operation in Kenya. Learn synchronization, load sharing, droop adjustment, and parallel control setup.'
  },
  {
    id: 'load_management',
    name: 'Load Management',
    description: 'Load calculation, power factor, load shedding, and demand management',
    icon: '📈',
    color: '#059669',
    contentCount: 0,
    seoTitle: 'Generator Load Management Kenya | Power Factor & Sizing',
    seoDescription: 'Generator load management guide for Kenya. Learn load calculation, power factor correction, load shedding, and proper generator sizing.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATIONAL CONTENT DATABASE
// Organized by category with original, rephrased content
// ═══════════════════════════════════════════════════════════════════════════════

export const EDUCATIONAL_CONTENT: EducationalContent[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ECM - ENGINE CONTROL MODULE (50+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ECM_001',
    category: 'ecm',
    subcategory: 'fundamentals',
    title: 'Understanding ECM Architecture in Diesel Generators',
    slug: 'ecm-architecture-diesel-generators-kenya',
    keywords: [
      'ECM diesel generator', 'engine control module Kenya', 'generator ECM repair Nairobi',
      'diesel ECM diagnostics', 'electronic engine control', 'generator brain box'
    ],
    summary: 'The Engine Control Module serves as the central processing unit for modern diesel generators, coordinating fuel delivery, timing, and protection systems through sophisticated electronic controls.',
    content: [
      {
        heading: 'What is an Engine Control Module?',
        paragraphs: [
          'The Engine Control Module (ECM) functions as the intelligent control center for diesel generator engines. This sophisticated electronic device continuously monitors engine parameters and adjusts fuel delivery, injection timing, and various actuators to optimize performance while protecting against damage.',
          'Modern diesel generators rely heavily on ECM technology to achieve precise fuel control, lower emissions, and improved fuel efficiency. The ECM receives input signals from numerous sensors throughout the engine, processes this data using internal algorithms, and sends output commands to actuators and injectors.',
          'Understanding ECM operation is essential for technicians working on contemporary generator systems. Unlike older mechanical injection systems, ECM-controlled engines require specialized diagnostic tools and systematic troubleshooting approaches.'
        ]
      },
      {
        heading: 'ECM Input Signals',
        paragraphs: [
          'The ECM receives continuous data streams from multiple sensors positioned throughout the engine. These input signals provide real-time information about engine operating conditions, allowing the ECM to make split-second adjustments.',
          'Primary input sensors include the crankshaft position sensor (measuring engine speed and position), camshaft position sensor (determining cylinder identification), coolant temperature sensor, oil pressure sensor, intake manifold pressure sensor, and throttle position sensor.',
          'Each sensor has specific voltage ranges and signal characteristics that the ECM interprets. When a sensor provides readings outside expected parameters, the ECM logs fault codes and may activate protection modes.'
        ],
        notes: [
          'Always verify sensor wiring before condemning a sensor',
          'ECM reference voltage is typically 5V DC for most sensors',
          'Ground circuits are equally important as signal wires'
        ]
      },
      {
        heading: 'ECM Output Controls',
        paragraphs: [
          'Based on processed input data, the ECM generates output signals to control engine operation. These outputs manage injector pulse width, injection timing, actuator positions, and auxiliary functions.',
          'Fuel injector control is the most critical ECM output. The ECM precisely controls when each injector fires (timing) and how long it remains open (duration). This determines fuel quantity and combustion characteristics.',
          'Additional ECM outputs may control the fuel rack position on mechanically governed engines, exhaust gas recirculation valves, variable geometry turbochargers, and intake air heaters for cold starting.'
        ]
      },
      {
        heading: 'ECM Communication Protocols',
        paragraphs: [
          'Modern ECMs communicate with diagnostic tools and other control modules using standardized protocols. The most common protocol in generator applications is SAE J1939, which uses CAN bus communication.',
          'J1939 protocol transmits data using Parameter Group Numbers (PGN) and Suspect Parameter Numbers (SPN). When troubleshooting, understanding these codes helps identify specific faults and affected systems.',
          'Some older systems may use proprietary protocols requiring manufacturer-specific diagnostic tools. Always verify communication protocol compatibility before attempting ECM diagnostics.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 12,
    relatedFaultCodes: ['ECM-001', 'ECM-002', 'ECM Power Supply', 'CAN Communication Error'],
    relatedContent: ['ECM_002', 'ECM_003', 'SENSORS_001'],
    tools: ['Diagnostic laptop', 'CAN bus analyzer', 'Multimeter', 'Oscilloscope'],
    safetyWarnings: [
      'Always disconnect battery before working on ECM wiring',
      'ECM components are sensitive to static discharge - use ESD protection',
      'Never probe ECM connector pins with test probes - use breakout boxes'
    ],
    proTips: [
      'Always record existing parameters before making changes',
      'Many ECM issues are actually wiring or connector problems',
      'Power supply quality directly affects ECM reliability'
    ],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_002',
    category: 'ecm',
    subcategory: 'diagnostics',
    title: 'ECM Fault Code Interpretation and Diagnosis',
    slug: 'ecm-fault-codes-diagnosis-kenya',
    keywords: [
      'ECM fault codes Kenya', 'generator error codes', 'diesel engine fault diagnosis',
      'SPN FMI codes', 'J1939 fault codes', 'ECM troubleshooting Nairobi'
    ],
    summary: 'Learn systematic approaches to reading, interpreting, and resolving ECM fault codes on diesel generators using professional diagnostic techniques.',
    content: [
      {
        heading: 'Understanding Fault Code Structure',
        paragraphs: [
          'ECM fault codes follow standardized formats that provide specific information about detected problems. Understanding this structure allows technicians to quickly identify fault locations and probable causes.',
          'J1939 fault codes consist of three components: SPN (Suspect Parameter Number) identifying the specific component or system, FMI (Failure Mode Identifier) describing the type of failure, and Occurrence Count tracking how many times the fault has been detected.',
          'For example, SPN 110 refers to Engine Coolant Temperature, while FMI 3 indicates "Voltage Above Normal." Combined, SPN 110 FMI 3 means the coolant temperature sensor circuit has voltage higher than expected, likely indicating an open circuit or sensor failure.'
        ]
      },
      {
        heading: 'Common FMI Definitions',
        paragraphs: [
          'FMI 0-2 relate to data validity issues. FMI 0 indicates data valid but above normal operational range. FMI 1 means data valid but below normal range. FMI 2 shows erratic or intermittent data.',
          'FMI 3-4 address voltage problems. FMI 3 indicates voltage above normal or shorted high. FMI 4 means voltage below normal or shorted low. These typically point to wiring issues.',
          'FMI 5-7 cover circuit issues. FMI 5 indicates current below normal (open circuit). FMI 6 means current above normal. FMI 7 indicates mechanical system not responding correctly.',
          'FMI 11-14 relate to specific failure modes. FMI 11 indicates root cause not identifiable. FMI 12 means bad intelligent device or component. FMI 13 shows out of calibration. FMI 14 indicates special instructions required.'
        ],
        steps: [
          'Read all active and stored fault codes using appropriate diagnostic tool',
          'Record fault codes with freeze frame data if available',
          'Identify the SPN to determine affected component or system',
          'Identify the FMI to understand the type of failure',
          'Check occurrence count to understand intermittent vs continuous faults',
          'Follow systematic troubleshooting based on SPN/FMI combination'
        ]
      },
      {
        heading: 'Diagnostic Approach for Common Faults',
        paragraphs: [
          'Voltage-related faults (FMI 3 and FMI 4) typically indicate wiring problems. Begin by inspecting connectors for corrosion, damaged pins, or poor crimps. Check wire harness routing for chafing or damage. Verify ground circuits are clean and tight.',
          'Open circuit faults (FMI 5) often result from broken wires, corroded connectors, or failed sensors. Use continuity testing to isolate the break location. Check connector terminals for backed-out pins.',
          'Out of range faults (FMI 0 and FMI 1) may indicate actual operating conditions outside normal limits rather than sensor failures. Verify actual engine conditions before condemning sensors. For example, an oil pressure low fault may indicate genuine low oil pressure rather than sensor failure.'
        ],
        warnings: [
          'Never clear fault codes without recording them first',
          'Some faults require engine operation to detect - road test may be necessary',
          'Multiple faults may have a single root cause - address related faults together'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 15,
    relatedFaultCodes: ['All ECM fault codes'],
    relatedContent: ['ECM_001', 'ECM_003', 'SENSORS_001'],
    tools: ['OEM diagnostic software', 'Multimeter', 'Breakout box', 'Wiring diagrams'],
    proTips: [
      'Keep a fault code reference chart for common SPNs on your phone',
      'Freeze frame data shows conditions at the moment of fault detection',
      'Intermittent faults often require wiggle testing during diagnosis'
    ],
    commonMistakes: [
      'Replacing sensors without verifying wiring integrity',
      'Clearing codes before thorough diagnosis',
      'Ignoring stored codes when only active codes are present'
    ],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'ECM_003',
    category: 'ecm',
    subcategory: 'programming',
    title: 'ECM Parameter Adjustment and Configuration',
    slug: 'ecm-programming-configuration-kenya',
    keywords: [
      'ECM programming Kenya', 'generator ECM configuration', 'engine parameter adjustment',
      'ECM calibration Nairobi', 'diesel generator programming'
    ],
    summary: 'Professional guide to ECM parameter configuration, covering speed settings, protection limits, and operating modes for diesel generators.',
    content: [
      {
        heading: 'ECM Parameter Categories',
        paragraphs: [
          'ECM parameters are organized into categories based on their function and security level. Understanding these categories helps technicians know which parameters can be safely adjusted and which require special authorization.',
          'Operating parameters control basic engine functions like rated speed, idle speed, and governor response. These are commonly adjusted during commissioning and can be modified with standard service tools.',
          'Protection parameters define shutdown limits for temperature, pressure, and speed. These critical safety settings should only be modified by qualified personnel with full understanding of consequences.',
          'Customer parameters allow end-user customization within safe limits. System parameters affect core engine operation and typically require factory-level access for modification.'
        ]
      },
      {
        heading: 'Common Parameter Adjustments',
        paragraphs: [
          'Rated Speed Setting determines generator output frequency. For 50Hz operation common in Kenya, rated speed is typically 1500 RPM for 4-pole alternators. Ensure speed exactly matches frequency requirements before connecting loads.',
          'Idle Speed affects warm-up operation and no-load fuel consumption. Standard diesel idle ranges from 650-750 RPM depending on engine size and application requirements.',
          'Governor Gain controls how aggressively the engine responds to load changes. Higher gain provides faster response but may cause instability. Lower gain gives smoother operation but slower response to load steps.',
          'Droop Setting is critical for parallel operation. Droop causes slight speed reduction as load increases, enabling multiple generators to share load proportionally. Typical droop settings range from 3-5%.'
        ],
        steps: [
          'Connect diagnostic tool and establish communication with ECM',
          'Read and record all existing parameter values before changes',
          'Navigate to appropriate parameter category',
          'Enter new parameter value',
          'Save changes to ECM memory',
          'Verify parameter change took effect',
          'Test engine operation under actual load conditions',
          'Document all changes made for future reference'
        ]
      },
      {
        heading: 'Protection Limit Configuration',
        paragraphs: [
          'High Temperature Shutdown protects against engine damage from overheating. Standard diesel shutdown temperature is typically 102-108°C. Consider ambient conditions when setting this limit - Kenya\'s climate may require adjustment.',
          'Low Oil Pressure Shutdown prevents bearing damage. Shutdown limits vary by engine model but typically range from 0.5-1.0 bar at idle and 2.5-4.0 bar at rated speed.',
          'Overspeed Protection prevents mechanical damage from excessive RPM. Overspeed shutdown is typically set 10-15% above rated speed. This protection should never be disabled.',
          'Warning thresholds should activate before shutdown limits, giving operators time to take corrective action. Typical warning-to-shutdown differential is 5-10% of the parameter range.'
        ],
        warnings: [
          'Improper protection settings can cause engine damage or safety hazards',
          'Always verify parameter units before entering values',
          'Document original settings before making any changes'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Parameter Out of Range', 'Configuration Error', 'Calibration Required'],
    relatedContent: ['ECM_001', 'ECM_002', 'CONTROLLER_001'],
    tools: ['OEM diagnostic software', 'Parameter backup device', 'Laptop computer'],
    safetyWarnings: [
      'Incorrect parameter settings can cause engine damage',
      'Always backup existing parameters before changes',
      'Some parameters require engine restart to take effect'
    ],
    whenToCallProfessional: [
      'System parameter modification required',
      'Protection limits need reconfiguration',
      'ECM replacement or re-flashing needed',
      'Warranty considerations apply'
    ],
    partsPageLink: '/parts/ecm-controllers',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTROLLER SYSTEMS (50+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'CTRL_001',
    category: 'controller',
    subcategory: 'dse',
    title: 'DSE Controller Operation and Configuration',
    slug: 'dse-controller-guide-kenya',
    keywords: [
      'DSE controller Kenya', 'Deep Sea Electronics', 'DSE 7320 programming',
      'DSE generator controller', 'DSE fault codes Nairobi', 'DSE configuration'
    ],
    summary: 'Complete operational guide for DSE (Deep Sea Electronics) generator controllers covering setup, configuration, and troubleshooting.',
    content: [
      {
        heading: 'DSE Controller Overview',
        paragraphs: [
          'Deep Sea Electronics controllers are among the most widely used generator control systems in Kenya and East Africa. These robust controllers provide comprehensive engine management, alternator monitoring, and automatic transfer functionality.',
          'DSE controllers range from basic manual start panels (DSE 4520) to advanced auto-mains failure controllers (DSE 7320, 7420) and paralleling systems (DSE 8610). Understanding the specific model capabilities helps technicians configure systems correctly.',
          'All DSE controllers share common design philosophy with similar button layouts, display formats, and configuration software. Once familiar with one DSE model, transitioning to others is straightforward.'
        ]
      },
      {
        heading: 'Front Panel Operation',
        paragraphs: [
          'DSE controllers feature intuitive front panel interfaces with LCD displays showing engine parameters, status indicators, and alarm conditions. Navigation uses arrow buttons to scroll through display pages.',
          'The Mode button cycles between operating modes: Stop (engine locked out), Manual (operator-controlled), Auto (automatic operation based on mains failure or schedule), and Test (engine runs regardless of mains status).',
          'Status LEDs indicate operating conditions at a glance. Green LEDs show normal status, yellow indicates warnings, and red indicates faults or shutdown conditions. LED combinations communicate specific system states.'
        ],
        steps: [
          'Press any button to wake display from sleep mode',
          'Use arrow buttons to scroll through instrumentation pages',
          'Press Mode button repeatedly to cycle through operating modes',
          'Press Start button in Manual mode to initiate engine cranking',
          'Press Stop button to shut down engine',
          'Press Mute/Reset to silence alarms or clear shutdown conditions'
        ]
      },
      {
        heading: 'Configuration Software',
        paragraphs: [
          'DSE Configuration Suite software provides full access to controller settings through PC connection. The software interface organizes parameters into logical categories with search functionality.',
          'USB connection is standard on modern DSE controllers. Older models may require RS232 or RS485 adapters. Ensure correct drivers are installed before attempting connection.',
          'Software versions must match controller firmware for full functionality. Using mismatched versions may limit access to certain parameters or cause communication errors.'
        ],
        notes: [
          'Download latest DSE software from official DSE website',
          'Default password for protected parameters is typically blank or "1"',
          'Parameter files can be saved and transferred between controllers'
        ]
      },
      {
        heading: 'Common DSE Fault Codes',
        paragraphs: [
          'DSE controllers display fault descriptions in plain text on the LCD screen, making diagnosis straightforward. The fault message describes the condition detected.',
          'Emergency Stop indicates the external emergency stop circuit is open. Check emergency stop buttons and related wiring. This alarm requires manual reset.',
          'Low Oil Pressure warns of insufficient oil pressure. Verify oil level, check oil pressure sender, and inspect related wiring. May indicate genuine low pressure or sensor circuit fault.',
          'High Engine Temperature indicates cooling system issues. Check coolant level, radiator condition, thermostat operation, and temperature sender circuit.',
          'Fail to Start occurs when the engine does not reach running speed within the configured crank time. Check fuel supply, battery condition, starter circuit, and cranking parameters.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Emergency Stop', 'Low Oil Pressure', 'High Temperature', 'Fail to Start', 'Over Speed', 'Under Speed'],
    relatedContent: ['CTRL_002', 'ECM_001', 'SENSORS_001'],
    tools: ['DSE Configuration Suite', 'USB cable', 'Multimeter'],
    proTips: [
      'Save configuration backup before making changes',
      'Use "Compare" function to identify differences between configurations',
      'Event log provides valuable diagnostic history'
    ],
    partsPageLink: '/parts/controllers',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_002',
    category: 'controller',
    subcategory: 'comap',
    title: 'ComAp Controller Programming and Diagnostics',
    slug: 'comap-controller-guide-kenya',
    keywords: [
      'ComAp controller Kenya', 'InteliGen programming', 'InteliLite configuration',
      'ComAp fault codes', 'InteliConfig software', 'ComAp generator controller'
    ],
    summary: 'Professional guide to ComAp InteliGen and InteliLite controller operation, programming, and fault diagnosis.',
    content: [
      {
        heading: 'ComAp Controller Family',
        paragraphs: [
          'ComAp manufactures advanced generator controllers popular in industrial and commercial applications throughout Kenya. The InteliGen and InteliLite series offer comprehensive control functionality with extensive customization options.',
          'InteliLite controllers provide essential auto-mains failure and engine protection functions for smaller applications. InteliGen controllers add advanced features including paralleling, load management, and sophisticated logic programming.',
          'All ComAp controllers use InteliConfig software for configuration and InteliMonitor for remote monitoring. Understanding both applications is essential for professional service work.'
        ]
      },
      {
        heading: 'InteliConfig Software Navigation',
        paragraphs: [
          'InteliConfig organizes parameters into functional groups with tree-view navigation. The software supports online editing (while connected) and offline editing (preparing configurations for later upload).',
          'Parameter groups include Engine Settings, Generator Settings, Protections, Inputs/Outputs, and Communication. Each group contains subgroups for detailed organization.',
          'The software includes powerful search functionality to locate specific parameters. Enter partial parameter names or descriptions to filter the parameter list.',
          'Archive function saves complete configuration snapshots. Always create archives before modifications and after successful commissioning for reference.'
        ],
        steps: [
          'Launch InteliConfig software',
          'Select appropriate controller model',
          'Connect via USB, RS232, or Ethernet',
          'Read current configuration from controller',
          'Navigate to required parameter section',
          'Modify parameters as needed',
          'Write configuration to controller',
          'Save archive file for documentation'
        ]
      },
      {
        heading: 'Setpoint Groups and Protection Curves',
        paragraphs: [
          'ComAp controllers use Setpoint Groups to organize protection values. Multiple setpoint groups allow different protection behaviors for various operating modes.',
          'Each protection can be assigned to a setpoint group and configured with specific delay times and actions. Actions include Warning (alarm only), Soft Load Shedding, Shutdown, or Emergency Stop.',
          'Temperature and pressure protections often use curves rather than single setpoints. Curves allow protection levels to vary based on engine speed or load, providing appropriate protection at all operating conditions.'
        ]
      },
      {
        heading: 'PLC Editor Programming',
        paragraphs: [
          'Advanced ComAp controllers include integrated PLC functionality for custom logic programming. The PLC editor uses ladder logic similar to industrial PLCs.',
          'PLC programming allows creation of custom interlocks, automated sequences, and special protection logic. Common applications include fuel tank changeover, multiple alternator operation, and custom alarm conditions.',
          'PLC programs execute continuously alongside standard controller functions. Careful design is required to avoid conflicts between PLC logic and built-in controller functions.'
        ],
        warnings: [
          'PLC programming errors can affect generator operation safety',
          'Test PLC logic thoroughly before deploying on operational systems',
          'Document all custom PLC programming for future maintenance'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 22,
    relatedFaultCodes: ['Emergency Stop', 'Mains Fail', 'Generator Protection', 'Engine Protection'],
    relatedContent: ['CTRL_001', 'CTRL_003', 'ECM_001'],
    tools: ['InteliConfig software', 'InteliMonitor', 'USB/RS232 cable', 'Ethernet cable'],
    proTips: [
      'Use Setpoint Groups to create distinct protection profiles',
      'Binary input debounce settings prevent false alarms from contact bounce',
      'History log provides comprehensive event timeline'
    ],
    partsPageLink: '/parts/controllers',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_003',
    category: 'controller',
    subcategory: 'cummins',
    title: 'Cummins PowerCommand Controller Operation',
    slug: 'cummins-powercommand-controller-kenya',
    keywords: [
      'Cummins PowerCommand Kenya', 'PCC controller', 'Cummins generator controller',
      'PowerCommand diagnostics', 'Cummins fault codes Nairobi'
    ],
    summary: 'Comprehensive guide to Cummins PowerCommand controller operation, diagnostics, and configuration for diesel generators.',
    content: [
      {
        heading: 'PowerCommand System Architecture',
        paragraphs: [
          'Cummins PowerCommand controllers integrate engine control with power generation management. The system consists of the PowerCommand Control (PCC) panel and engine ECM communicating via J1939 CAN bus.',
          'PowerCommand controllers provide automatic paralleling, load management, and comprehensive protection without requiring separate governor and AVR controllers. The integrated design simplifies installation and troubleshooting.',
          'Different PowerCommand models serve various applications from standby power (PCC 1300/2100) to prime power and paralleling (PCC 3200/3300). Model selection depends on application requirements.'
        ]
      },
      {
        heading: 'InPower Service Tool',
        paragraphs: [
          'InPower is the primary diagnostic and configuration tool for Cummins PowerCommand systems. The software provides access to engine and controller parameters, fault history, and real-time monitoring.',
          'InPower requires proper licensing for full functionality. Service license enables parameter modification and ECM programming. Diagnostic license provides read-only access for troubleshooting.',
          'Connection to PowerCommand systems uses the service port located on the controller front panel. The connection uses standard USB or RS232 depending on controller model.'
        ]
      },
      {
        heading: 'Fault Code System',
        paragraphs: [
          'PowerCommand systems display faults using alphanumeric codes on the controller display. Fault messages include abbreviated descriptions to aid identification.',
          'Faults are categorized by severity and source. Engine faults originate from the ECM while generator faults originate from the PCC. Understanding fault source helps direct diagnostic efforts.',
          'The fault log stores recent fault history with timestamps and snapshot data. Review fault history patterns to identify intermittent problems or recurring conditions.'
        ],
        steps: [
          'Note fault code displayed on controller',
          'Connect InPower service tool',
          'Read active and stored fault codes',
          'Review fault details and freeze frame data',
          'Check related parameters and sensor values',
          'Perform targeted diagnostic based on fault type',
          'Repair root cause before clearing faults'
        ]
      },
      {
        heading: 'Paralleling Configuration',
        paragraphs: [
          'PowerCommand controllers with paralleling capability require careful configuration of load sharing and synchronization parameters. Incorrect settings cause hunting, reverse power trips, or unequal load sharing.',
          'Droop configuration determines how generators share load. All paralleled units must have matching droop settings for proper load division. Standard droop is 5% for frequency and 4% for voltage.',
          'Synchronization settings control how the generator approaches the bus for closing. Check window settings define acceptable voltage and frequency match before sync is allowed.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Engine Fault', 'Generator Fault', 'Communication Fault', 'Sync Fault'],
    relatedContent: ['CTRL_001', 'ECM_001', 'PARALLEL_001'],
    tools: ['InPower Service Tool', 'Cummins QuickServe', 'USB adapter', 'Multimeter'],
    safetyWarnings: [
      'Paralleling configuration errors can cause equipment damage',
      'Always verify synchronization before closing parallel breaker',
      'Test protection functions after any configuration changes'
    ],
    partsPageLink: '/parts/controllers',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AVR - AUTOMATIC VOLTAGE REGULATOR (40+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'AVR_001',
    category: 'avr',
    subcategory: 'fundamentals',
    title: 'Understanding AVR Operation in Generators',
    slug: 'avr-automatic-voltage-regulator-kenya',
    keywords: [
      'AVR generator Kenya', 'automatic voltage regulator', 'generator voltage control',
      'AVR repair Nairobi', 'excitation system', 'voltage regulation'
    ],
    summary: 'The Automatic Voltage Regulator maintains stable generator output voltage by controlling excitation current to the alternator field windings.',
    content: [
      {
        heading: 'AVR Function and Purpose',
        paragraphs: [
          'The Automatic Voltage Regulator (AVR) is an essential component that maintains stable output voltage regardless of load changes. Without proper voltage regulation, electrical equipment connected to the generator could be damaged by voltage fluctuations.',
          'The AVR achieves voltage stability by controlling the excitation current flowing through the alternator field windings. Increasing excitation strengthens the magnetic field, increasing output voltage. Decreasing excitation reduces voltage.',
          'Modern AVRs are electronic devices that sense the generator output voltage, compare it to a reference, and adjust excitation accordingly. This closed-loop control happens continuously, providing rapid response to load changes.'
        ]
      },
      {
        heading: 'Excitation System Types',
        paragraphs: [
          'Self-excited systems derive excitation power from the generator output itself. The AVR takes power from the generator windings and supplies controlled DC current to the field. This is the most common system on smaller generators.',
          'PMG (Permanent Magnet Generator) excited systems use a separate permanent magnet alternator mounted on the main shaft. The PMG provides consistent excitation power independent of generator output, enabling better performance during motor starting.',
          'Separately excited systems use an external DC power source for excitation. This provides maximum control flexibility but requires additional power supply equipment.'
        ]
      },
      {
        heading: 'AVR Components and Connections',
        paragraphs: [
          'Standard AVR connections include voltage sensing inputs, excitation output terminals, and power supply connections. Understanding these connections is essential for correct installation and troubleshooting.',
          'Voltage sensing typically connects to the generator output terminals to measure actual voltage. Some AVRs use three-phase sensing for better accuracy, while others use single-phase sensing.',
          'Excitation output connects to the exciter field winding through slip rings or rotating rectifier depending on alternator design. This DC current creates the magnetic field for power generation.',
          'Additional connections may include current transformers for reactive droop (used in parallel operation), stability adjustment inputs, and remote voltage adjust terminals.'
        ],
        notes: [
          'Always verify AVR compatibility with alternator specifications',
          'Voltage sensing connections must match generator voltage level',
          'Excitation output current rating must exceed field winding requirements'
        ]
      },
      {
        heading: 'Voltage Adjustment',
        paragraphs: [
          'AVRs include a voltage adjustment potentiometer allowing output voltage to be set within a specified range, typically +/- 5% of nominal. This allows fine-tuning for specific site requirements.',
          'Adjustment should be made with the generator running at rated speed under representative load conditions. Voltage may vary slightly between no-load and full-load depending on AVR characteristics.',
          'After adjustment, verify voltage across all phases to ensure balance. Phase voltage imbalance can indicate alternator problems rather than AVR issues.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 15,
    relatedFaultCodes: ['Under Voltage', 'Over Voltage', 'Excitation Fault', 'AVR Fault'],
    relatedContent: ['AVR_002', 'AVR_003', 'ALTERNATOR_001'],
    tools: ['Multimeter', 'Clamp meter', 'Oscilloscope'],
    safetyWarnings: [
      'AVR circuits carry dangerous voltages when generator is running',
      'Never adjust AVR with covers removed',
      'Discharge capacitors before handling AVR'
    ],
    proTips: [
      'Record original potentiometer positions before adjustment',
      'Stability adjustment affects voltage response to load changes',
      'Voltage droop setting is critical for parallel operation'
    ],
    partsPageLink: '/parts/avr-regulators',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'AVR_002',
    category: 'avr',
    subcategory: 'troubleshooting',
    title: 'AVR Troubleshooting: No Voltage Output',
    slug: 'avr-no-voltage-troubleshooting-kenya',
    keywords: [
      'generator no voltage Kenya', 'AVR failure diagnosis', 'no output voltage',
      'generator excitation problem', 'alternator not producing power Nairobi'
    ],
    summary: 'Systematic diagnostic procedure for generators producing no voltage output, covering AVR, excitation circuit, and residual magnetism issues.',
    content: [
      {
        heading: 'No Voltage Symptom Analysis',
        paragraphs: [
          'A generator running at correct speed but producing no voltage indicates a problem in the excitation system. This could involve the AVR, excitation wiring, alternator windings, or loss of residual magnetism.',
          'Before focusing on the AVR, verify the engine is running at correct speed. Frequency and voltage are linked - incorrect speed will affect voltage output. Check speed with a calibrated tachometer.',
          'Also verify the generator was previously working. A new installation may have wiring errors, while a previously functional unit likely has component or connection failures.'
        ]
      },
      {
        heading: 'Diagnostic Procedure',
        paragraphs: [
          'Begin diagnosis with the AVR. Check that the AVR is receiving sensing voltage and power supply. Measure voltage at the AVR input terminals while the generator runs.',
          'If the AVR has power and sensing voltage but produces no excitation output, the AVR may be faulty. To confirm, temporarily substitute a known-good AVR or apply manual excitation.',
          'Manual excitation test: Briefly apply 12V DC directly to the field winding terminals (observing correct polarity). If the generator produces voltage with manual excitation but not with AVR, the AVR is faulty.'
        ],
        steps: [
          'Verify engine speed is at rated RPM',
          'Check AVR power supply voltage',
          'Check AVR sensing voltage',
          'Measure AVR output voltage to field',
          'If no AVR output, test AVR with substitution or manual excitation',
          'If AVR output is present, check wiring to field',
          'Check slip rings and brushes condition',
          'Check rotating rectifier diodes (if applicable)'
        ]
      },
      {
        heading: 'Loss of Residual Magnetism',
        paragraphs: [
          'Self-excited generators require residual magnetism in the rotor to begin the excitation process. If this residual magnetism is lost, the generator will not produce voltage even with a good AVR.',
          'Residual magnetism can be lost during extended storage, after maintenance that demagnetizes the rotor, or due to incorrect load disconnection procedures.',
          'To restore residual magnetism (field flashing), briefly apply 12V DC to the field winding while the generator runs. This re-establishes the magnetic field needed to start self-excitation.',
          'After field flashing, voltage should build up rapidly. If voltage does not establish after flashing, other problems exist in the excitation circuit.'
        ],
        warnings: [
          'Field flashing is brief - only apply DC for 2-3 seconds',
          'Observe correct polarity when flashing field',
          'Some generators require specific flashing procedures - check manual'
        ]
      },
      {
        heading: 'Excitation Circuit Checks',
        paragraphs: [
          'If AVR output is present but voltage does not build, check the excitation path from AVR to field winding. This includes wiring, slip rings, brushes, and rotating rectifier (on brushless units).',
          'On brushed machines, inspect carbon brushes for wear and proper spring pressure. Check slip ring surface condition - should be smooth and clean. Measure brush-to-slip ring contact resistance.',
          'On brushless machines with rotating rectifiers, the diode bridge may have failed open, preventing excitation current flow. Testing requires alternator disassembly and individual diode checking.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 18,
    relatedFaultCodes: ['No Voltage', 'Under Voltage', 'Excitation Fault'],
    relatedContent: ['AVR_001', 'AVR_003', 'ALTERNATOR_001'],
    tools: ['Multimeter', 'Clamp meter', '12V battery for flashing', 'Insulation tester'],
    safetyWarnings: [
      'Generator produces dangerous voltages when running',
      'Ensure proper isolation before internal checks',
      'Capacitors in AVR can retain charge after shutdown'
    ],
    commonMistakes: [
      'Replacing AVR without checking wiring first',
      'Reversing polarity during field flashing',
      'Not checking brush condition on brushed alternators'
    ],
    whenToCallProfessional: [
      'Alternator disassembly required for internal checks',
      'Winding resistance tests indicate possible failure',
      'Repeated AVR failures indicate underlying problems'
    ],
    partsPageLink: '/parts/avr-regulators',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MPU - MAGNETIC PICKUP UNIT (25+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'MPU_001',
    category: 'mpu',
    subcategory: 'fundamentals',
    title: 'Magnetic Pickup Unit Operation and Testing',
    slug: 'mpu-speed-sensor-guide-kenya',
    keywords: [
      'MPU sensor Kenya', 'magnetic pickup generator', 'speed sensor diesel',
      'MPU testing Nairobi', 'flywheel speed sensor', 'generator RPM sensor'
    ],
    summary: 'Understanding magnetic pickup unit (MPU) operation, signal characteristics, and proper testing procedures for diesel generator speed sensing.',
    content: [
      {
        heading: 'MPU Function and Operation',
        paragraphs: [
          'The Magnetic Pickup Unit (MPU) is a critical speed sensing device that detects engine RPM by reading pulses from the flywheel ring gear or a dedicated toothed wheel. The signal enables the controller and governor to monitor and control engine speed.',
          'MPUs operate using electromagnetic induction. As ferrous metal teeth pass the sensor tip, they disturb the magnetic field created by a permanent magnet inside the sensor. This disturbance induces an AC voltage in the sensor coil.',
          'The frequency of the AC signal is directly proportional to engine speed. The controller counts pulses over time to calculate RPM. More teeth passing per second means higher engine speed.'
        ]
      },
      {
        heading: 'Signal Characteristics',
        paragraphs: [
          'MPU output is a sinusoidal AC voltage that varies with engine speed. At cranking speeds (150-300 RPM), signal amplitude may be only 0.5-1.5V AC. At rated speed (1500-1800 RPM), amplitude typically reaches 5-50V AC.',
          'Signal amplitude depends on air gap, sensor quality, and tooth profile. Proper air gap setting is critical for reliable speed sensing at all operating conditions.',
          'The controller requires minimum signal amplitude to reliably detect pulses. Typical minimum is 1-3V AC peak-to-peak. Inadequate signal causes erratic speed readings or fail-to-start conditions.'
        ],
        notes: [
          'MPU signal increases with speed - weak signal at crank may be normal',
          'Air gap affects signal strength - smaller gap gives stronger signal',
          'Sensor resistance affects signal generation - check against specifications'
        ]
      },
      {
        heading: 'Air Gap Adjustment',
        paragraphs: [
          'MPU air gap is the distance between the sensor tip and the flywheel teeth. Proper gap setting balances signal strength against physical clearance for safe operation.',
          'Typical air gap specification is 0.5-1.0mm (0.020-0.040 inches). Exact specification varies by manufacturer - always verify from engine documentation.',
          'To set air gap: Thread the MPU into the mounting hole until it contacts a tooth, then back out the specified distance (typically 1/2 to 1 turn). Secure with locknut while maintaining gap setting.',
          'After adjustment, verify gap using feeler gauge between sensor tip and tooth peak. Gap should be consistent as engine is rotated through multiple teeth.'
        ],
        steps: [
          'Remove any debris from sensor tip and mounting threads',
          'Thread sensor into mounting until it lightly contacts a tooth',
          'Back out sensor by specified amount (check manual)',
          'Apply thread locker to sensor threads',
          'Tighten locknut while holding sensor position',
          'Verify gap with feeler gauge',
          'Rotate engine manually to check gap consistency'
        ]
      },
      {
        heading: 'MPU Testing Procedures',
        paragraphs: [
          'Basic MPU testing includes resistance measurement and signal verification. These tests determine if the sensor is functioning correctly or requires replacement.',
          'Resistance test: Measure resistance across MPU terminals with sensor disconnected and engine stopped. Typical resistance ranges from 150-1500 ohms depending on sensor design. Compare measurement to specifications.',
          'Signal test: With MPU connected and engine cranking, measure AC voltage across sensor terminals. Signal should be present and increase with speed. No signal during cranking indicates sensor or wiring fault.'
        ],
        warnings: [
          'Inadequate air gap may cause sensor contact with teeth',
          'Excessive air gap may cause weak signal at low speed',
          'Always verify gap after any MPU adjustment or replacement'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['No Speed Signal', 'Speed Sensor Fault', 'Over Speed', 'Under Speed', 'Fail to Start'],
    relatedContent: ['MPU_002', 'ECM_001', 'ACTUATOR_001'],
    tools: ['Multimeter', 'Oscilloscope', 'Feeler gauge', 'Thread locker'],
    proTips: [
      'A weak MPU signal at cranking may cause fail-to-start even though fuel system is working',
      'Some controllers have MPU signal voltage adjustment parameters',
      'Shield MPU wiring from electrical noise sources'
    ],
    partsPageLink: '/parts/sensors',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORS - TEMPERATURE, PRESSURE, LEVEL (60+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'SENS_001',
    category: 'sensors',
    subcategory: 'temperature',
    title: 'Engine Temperature Sensors: Types and Testing',
    slug: 'engine-temperature-sensors-kenya',
    keywords: [
      'temperature sensor generator Kenya', 'coolant temperature sensor', 'oil temperature',
      'engine temp sender', 'NTC thermistor testing', 'generator temperature Nairobi'
    ],
    summary: 'Complete guide to engine temperature sensors covering operating principles, testing procedures, and common failure modes.',
    content: [
      {
        heading: 'Temperature Sensor Types',
        paragraphs: [
          'Generator engines use various temperature sensors to monitor coolant, oil, intake air, and exhaust temperatures. Understanding each sensor type helps technicians diagnose temperature-related faults effectively.',
          'NTC (Negative Temperature Coefficient) thermistors are the most common type. Resistance decreases as temperature increases. These sensors are simple, reliable, and inexpensive.',
          'Platinum RTD (Resistance Temperature Detector) sensors offer higher accuracy for critical measurements. Resistance increases linearly with temperature. Common in industrial applications requiring precise temperature monitoring.',
          'Thermocouple sensors generate voltage proportional to temperature difference. Used for high-temperature measurement like exhaust gas temperature. Require special instrumentation.'
        ]
      },
      {
        heading: 'NTC Thermistor Testing',
        paragraphs: [
          'Most engine temperature sensors are NTC thermistors that can be tested using resistance measurement at known temperatures. Resistance values should match manufacturer specifications.',
          'At room temperature (25°C), typical coolant temperature sensors measure approximately 2000-3000 ohms. At operating temperature (90°C), resistance drops to approximately 200-300 ohms.',
          'To verify sensor accuracy, compare measured resistance to published resistance/temperature chart. Deviation more than 10% indicates sensor degradation or failure.',
          'In-circuit testing can be performed by measuring voltage at the controller input. The controller applies reference voltage (typically 5V) through a pull-up resistor. Sensor resistance changes create voltage changes that the controller interprets.'
        ],
        steps: [
          'Disconnect sensor electrical connector',
          'Measure resistance across sensor terminals',
          'Compare to specification for ambient temperature',
          'Heat sensor (if accessible) and verify resistance decreases',
          'Cool sensor and verify resistance increases',
          'Check for open circuit (infinite resistance)',
          'Check for short circuit (zero resistance)',
          'Test wiring continuity from sensor to controller'
        ]
      },
      {
        heading: 'Common Temperature Sensor Locations',
        paragraphs: [
          'Coolant temperature sensors typically mount in the thermostat housing, cylinder head, or engine block where they contact circulating coolant. Location ensures accurate measurement of engine cooling.',
          'Oil temperature sensors mount in the oil pan, oil cooler, or oil filter housing. Oil temperature monitoring helps detect cooling system problems and ensures proper lubrication.',
          'Intake air temperature sensors mount in the intake manifold or air cleaner housing. The ECM uses intake temperature for fuel calculation corrections.',
          'Exhaust temperature sensors mount in exhaust manifolds or turbocharger inlet. These high-temperature sensors monitor combustion and turbo protection.'
        ],
        notes: [
          'Always use appropriate thread sealant when installing temperature sensors',
          'Over-torquing can damage sensor elements',
          'Ensure sensor tip contacts fluid being measured'
        ]
      },
      {
        heading: 'Temperature Sensor Failures',
        paragraphs: [
          'Open circuit failures cause controller to see maximum resistance, typically interpreted as very low temperature. This may cause false "Cold Engine" indications or disable temperature protection.',
          'Short circuit failures cause controller to see zero resistance, interpreted as extremely high temperature. This triggers immediate high temperature shutdown even when engine is cold.',
          'Drift failures cause inaccurate readings without complete failure. The sensor reports incorrect temperature, potentially causing protection activation at wrong points or masking actual overheating.',
          'Connector corrosion is a common cause of erratic temperature readings. Contamination increases contact resistance, causing readings to vary unpredictably.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 16,
    relatedFaultCodes: ['High Temperature', 'Low Temperature', 'Temp Sensor Open', 'Temp Sensor Short'],
    relatedContent: ['SENS_002', 'SENS_003', 'COOLING_001'],
    tools: ['Multimeter', 'Temperature reference chart', 'Infrared thermometer', 'Heat gun for testing'],
    proTips: [
      'Compare sensor reading to actual temperature using IR thermometer',
      'Multiple sensors reading wrong may indicate ground problem',
      'Some sensors share common ground - check ground circuit first'
    ],
    partsPageLink: '/parts/sensors',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'SENS_002',
    category: 'sensors',
    subcategory: 'pressure',
    title: 'Oil Pressure Sensors and Switches',
    slug: 'oil-pressure-sensor-testing-kenya',
    keywords: [
      'oil pressure sensor Kenya', 'low oil pressure alarm', 'oil pressure switch testing',
      'generator oil pressure Nairobi', 'engine protection sensors'
    ],
    summary: 'Guide to oil pressure sensing systems including variable resistance senders, pressure switches, and testing procedures.',
    content: [
      {
        heading: 'Oil Pressure Sensing Systems',
        paragraphs: [
          'Oil pressure monitoring is critical for engine protection. Low oil pressure can cause rapid bearing damage and engine failure. Generators use various sensing methods depending on system requirements.',
          'Variable resistance senders provide continuous pressure indication. A diaphragm moves a wiper across a resistive element, changing resistance proportional to pressure. This allows display of actual pressure values.',
          'Pressure switches provide simple on/off indication at a preset pressure threshold. A diaphragm pushes against a spring-loaded contact, opening or closing as pressure changes. Used primarily for low-pressure warning and shutdown.',
          'Electronic pressure transducers output voltage or current signals proportional to pressure. These provide highest accuracy and fastest response for modern electronic controls.'
        ]
      },
      {
        heading: 'Variable Sender Testing',
        paragraphs: [
          'Variable resistance senders can be tested using resistance measurement at atmospheric pressure (zero gauge pressure). The resistance should match specification for zero pressure.',
          'Full-scale testing requires applying known pressure and measuring resistance change. Without pressure source, compare resistance change when sensor is connected to running engine.',
          'Typical variable sender specifications: 10-180 ohms or 240-33 ohms depending on design. The resistance curve (linear vs non-linear) varies by manufacturer.',
          'If sender shows correct resistance range but display reads incorrectly, the problem may be in wiring, ground circuit, or display instrument rather than the sensor.'
        ]
      },
      {
        heading: 'Pressure Switch Testing',
        paragraphs: [
          'Oil pressure switches contain contacts that change state at a specific pressure. Testing confirms the contacts function correctly and change state at the rated pressure.',
          'Basic continuity test: With no pressure applied, measure continuity across switch terminals. Most low-oil-pressure switches are normally closed, opening when adequate pressure is present.',
          'Operational test: With engine running, verify switch output changes state. Low pressure switches should open after engine starts and oil pressure builds. High pressure switches activate when pressure exceeds threshold.',
          'Calibration verification requires applying precise known pressure and noting switch actuation point. Switch operation should be within tolerance of rated setpoint.'
        ],
        steps: [
          'Identify switch type (normally open or normally closed)',
          'Test continuity with no pressure applied',
          'Compare to expected state',
          'Start engine and monitor switch state change',
          'Verify switch state matches pressure indication',
          'If possible, apply known pressure to verify trip point'
        ]
      },
      {
        heading: 'Installation Considerations',
        paragraphs: [
          'Oil pressure sensors must mount in locations with direct access to pressurized oil gallery. Typical locations include the oil filter housing, main oil gallery plugs, or dedicated sensor ports.',
          'Thread sealant should be compatible with oil and rated for operating temperature. PTFE tape is commonly used but check manufacturer recommendations.',
          'Wiring should be protected from heat and vibration. Route wiring away from exhaust components and secure against engine vibration.'
        ],
        warnings: [
          'Low oil pressure shutdown protects against engine damage - do not bypass',
          'Verify actual oil pressure before condemning sensors',
          'Multiple low pressure alarms may indicate genuine lubrication problem'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Oil Pressure', 'Oil Pressure Sensor Fault', 'Oil Pressure High'],
    relatedContent: ['SENS_001', 'LUBRICATION_001', 'ENGINE_001'],
    tools: ['Multimeter', 'Pressure gauge', 'Pressure calibrator', 'Thread sealant'],
    commonMistakes: [
      'Replacing sensor when problem is low oil level',
      'Using wrong thread sealant causing contamination',
      'Not verifying actual pressure with mechanical gauge'
    ],
    partsPageLink: '/parts/sensors',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUATOR SYSTEMS (30+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ACT_001',
    category: 'actuator',
    subcategory: 'electronic',
    title: 'Electronic Governor Actuators: Operation and Diagnostics',
    slug: 'electronic-actuator-governor-kenya',
    keywords: [
      'generator actuator Kenya', 'electronic governor', 'fuel actuator diesel',
      'speed control actuator', 'GAC actuator Nairobi', 'Woodward actuator'
    ],
    summary: 'Understanding electronic actuator operation for diesel generator speed control, including testing and troubleshooting procedures.',
    content: [
      {
        heading: 'Electronic Actuator Fundamentals',
        paragraphs: [
          'Electronic actuators convert electrical control signals into mechanical fuel rack movement, enabling precise speed control of diesel engines. These devices replace traditional mechanical governors on modern generators.',
          'The actuator receives position commands from an electronic governor controller or ECM. Based on this signal, an internal motor moves an output shaft connected to the engine fuel control mechanism.',
          'Typical actuators use either rotary or linear movement. Rotary actuators pivot an output arm through an arc. Linear actuators push/pull a shaft in straight-line motion. Selection depends on fuel system design.'
        ]
      },
      {
        heading: 'Actuator Control Signals',
        paragraphs: [
          'PWM (Pulse Width Modulation) control is most common. The duty cycle of a square wave signal determines actuator position. 0% duty cycle typically commands minimum fuel, 100% commands maximum fuel.',
          'Current control actuators respond to varying DC current levels. Typical ranges are 20-180mA or similar. Current level is proportional to commanded position.',
          'Position feedback allows closed-loop control. Many actuators include internal position sensors that report actual shaft position back to the controller. This enables precise positioning regardless of load variations.'
        ]
      },
      {
        heading: 'Actuator Testing Procedures',
        paragraphs: [
          'Mechanical verification: With engine stopped and actuator disconnected, manually move the output shaft through its full range. Movement should be smooth without binding or excessive friction.',
          'Electrical testing: Measure actuator coil resistance with multimeter. Compare to manufacturer specification. Typical values range from 3-30 ohms depending on design. Significantly different resistance indicates internal fault.',
          'Operational testing: With actuator connected and controller powered, observe actuator response to control commands. Actuator should smoothly move through its range as commanded position changes.',
          'Stall torque testing: Apply load to output shaft and verify actuator can develop rated torque. Insufficient torque may indicate worn motor or weak drive electronics.'
        ],
        steps: [
          'Verify actuator wiring connections and condition',
          'Measure coil resistance and compare to specification',
          'Check for mechanical binding or damage',
          'Apply power and verify movement',
          'If controller accessible, command position changes',
          'Verify position feedback signal if equipped',
          'Check linkage adjustment and free movement'
        ]
      },
      {
        heading: 'Linkage Adjustment',
        paragraphs: [
          'Proper linkage adjustment is essential for correct speed control. The linkage connects the actuator output to the engine fuel control mechanism and must allow full range of movement without binding.',
          'Minimum fuel stop must be set so engine can shut down completely. Actuator at minimum position should allow fuel rack to reach shutoff position.',
          'Maximum fuel stop must be set so engine cannot overfuel. Actuator at maximum position should not exceed fuel rack limit. Overfueling can damage engine.',
          'Actuator travel should be centered in its operating range during normal operation. This provides equal authority for both increasing and decreasing fuel.'
        ],
        warnings: [
          'Incorrect linkage adjustment can cause engine overspeed',
          'Ensure actuator can move freely through full range',
          'Verify governor calibration after any linkage changes'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Actuator Fault', 'Governor Fault', 'Speed Control Error', 'Over Speed', 'Under Speed'],
    relatedContent: ['ACT_002', 'MPU_001', 'CTRL_001'],
    tools: ['Multimeter', 'Oscilloscope', 'Actuator test bench', 'Governor calibration tool'],
    proTips: [
      'Many actuator problems are actually linkage or adjustment issues',
      'Position feedback signals can be monitored to verify operation',
      'Some actuators have internal diagnostics accessible via controller software'
    ],
    partsPageLink: '/parts/actuators-governors',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FUEL SYSTEM (50+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'FUEL_001',
    category: 'fuel_system',
    subcategory: 'fundamentals',
    title: 'Diesel Fuel System Components and Flow',
    slug: 'diesel-fuel-system-guide-kenya',
    keywords: [
      'diesel fuel system Kenya', 'generator fuel system', 'fuel delivery diesel',
      'fuel transfer pump', 'fuel filter generator', 'diesel fuel flow Nairobi'
    ],
    summary: 'Understanding diesel fuel system components, flow path, and operating principles for generator applications.',
    content: [
      {
        heading: 'Fuel System Overview',
        paragraphs: [
          'The diesel fuel system delivers precisely metered quantities of clean fuel to the engine combustion chambers at high pressure and correct timing. System reliability directly affects generator dependability.',
          'Fuel system components include storage tank, transfer pump, filtration system, injection pump, injection lines, and injector nozzles. Each component must function correctly for proper engine operation.',
          'Fuel quality in Kenya requires particular attention. Contamination with water, dirt, or microbial growth causes fuel system damage and engine problems. Proper fuel management practices are essential.'
        ]
      },
      {
        heading: 'Low Pressure Fuel Circuit',
        paragraphs: [
          'The low pressure circuit moves fuel from the tank to the injection pump inlet. This includes the fuel tank, pickup tube, primary filter, transfer pump, secondary filter, and supply lines.',
          'Transfer pumps may be mechanical (driven by the engine) or electric (for priming and continuous operation). Electric pumps provide flow before engine starts, aiding cranking.',
          'Fuel filtration removes water and particles before fuel reaches high-pressure components. Primary filters often include water separators. Secondary filters provide finer filtration.',
          'Air in the fuel system is a common problem in Kenya. Air can enter through loose connections, cracked lines, or empty tanks. Air must be bled from the system before engine will start.'
        ]
      },
      {
        heading: 'High Pressure Fuel Circuit',
        paragraphs: [
          'The high pressure circuit consists of the injection pump, high pressure lines, and injector nozzles. This circuit creates and delivers the extremely high pressures needed for diesel injection.',
          'Traditional injection pumps are mechanically driven, precisely timed devices that create high pressure fuel pulses. Pumps may be in-line (one element per cylinder) or rotary (single pumping element).',
          'Common rail systems use a high-pressure pump to maintain constant pressure in a common rail. Electronic injectors open on command to deliver fuel. This provides more precise control than mechanical systems.',
          'Injection pressure varies by system type. Mechanical systems typically operate at 150-300 bar. Common rail systems may exceed 2000 bar. These extreme pressures require careful maintenance.'
        ],
        warnings: [
          'High pressure diesel injection can penetrate skin causing severe injury',
          'Never attempt to check for leaks by feeling for spray',
          'Depressurize system before loosening any high pressure connections'
        ]
      },
      {
        heading: 'Return Fuel Circuit',
        paragraphs: [
          'Excess fuel from injectors and injection pump returns to the tank through the return circuit. This fuel carries heat from the injection system, helping cool components.',
          'Return fuel flow should be minimal compared to supply flow. Excessive return flow indicates worn injectors or injection pump allowing excessive leakage.',
          'Return fuel temperature should not be excessive. High return fuel temperature indicates cooling problems or excessive internal leakage generating heat.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Fuel System Fault', 'Low Fuel Pressure', 'Fuel Filter Restricted', 'Air in Fuel'],
    relatedContent: ['FUEL_002', 'FUEL_003', 'INJ_001'],
    tools: ['Fuel pressure gauge', 'Fuel flow meter', 'Clear hose for air detection'],
    safetyWarnings: [
      'High pressure fuel injection is extremely dangerous',
      'Use appropriate safety glasses and gloves when working with fuel',
      'Fire hazard - have extinguisher available'
    ],
    proTips: [
      'Clear fuel hose at lift pump outlet reveals air bubbles quickly',
      'Warm fuel flows more easily than cold - affects filter pressure drop',
      'Kenya fuel quality varies - quality suppliers matter'
    ],
    partsPageLink: '/parts/fuel-system',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INJECTOR NOZZLE (30+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'INJ_001',
    category: 'injector_nozzle',
    subcategory: 'fundamentals',
    title: 'Diesel Injector Nozzle Operation and Service',
    slug: 'diesel-injector-nozzle-service-kenya',
    keywords: [
      'diesel injector Kenya', 'nozzle testing', 'injector spray pattern',
      'injector cleaning Nairobi', 'diesel nozzle repair', 'generator injectors'
    ],
    summary: 'Complete guide to diesel injector nozzle operation, testing, and service for generator applications.',
    content: [
      {
        heading: 'Injector Nozzle Function',
        paragraphs: [
          'The injector nozzle atomizes high-pressure fuel into a fine mist sprayed directly into the combustion chamber. Proper atomization is essential for complete combustion, power output, and fuel efficiency.',
          'Nozzles consist of two main components: the nozzle body and the needle valve. High pressure fuel pushes the needle off its seat, opening the spray holes. Spring pressure and fuel pressure drop close the needle.',
          'Different nozzle types suit various engine designs. Pintle nozzles have a single spray hole with pin extension. Hole-type nozzles have multiple spray holes arranged for combustion chamber geometry.'
        ]
      },
      {
        heading: 'Spray Pattern and Testing',
        paragraphs: [
          'Spray pattern significantly affects combustion quality. The pattern should atomize fuel into fine droplets and distribute it correctly within the combustion chamber.',
          'Testing requires a nozzle test bench capable of generating high pressure. The tester allows observation of spray pattern and measurement of opening pressure.',
          'Good spray pattern shows fine mist with even distribution across all spray holes. Pattern should be symmetrical without dribbles, streams, or dead areas.',
          'Poor spray patterns indicate nozzle wear or damage. Asymmetric pattern, coarse droplets, dribbling, or incorrect angle require nozzle service or replacement.'
        ],
        steps: [
          'Install injector in test bench',
          'Purge air from test system',
          'Slowly build pressure observing spray pattern',
          'Note opening pressure on gauge',
          'Observe spray pattern and atomization quality',
          'Check for dribbling after needle closes',
          'Verify all spray holes are functioning',
          'Compare results to manufacturer specifications'
        ]
      },
      {
        heading: 'Opening Pressure Adjustment',
        paragraphs: [
          'Opening pressure (pop pressure) is the fuel pressure required to lift the needle and begin injection. This pressure is set by shim thickness or adjusting screw depending on nozzle design.',
          'Correct opening pressure ensures proper atomization and injection timing. Pressure too low causes poor atomization. Pressure too high may affect injection timing and quantity.',
          'Typical opening pressures range from 175-275 bar depending on engine design. Always verify specification for specific engine model.',
          'To adjust: Disassemble nozzle holder, add or remove shims to change spring preload. Increasing shim thickness raises opening pressure. Decreasing thickness lowers pressure.'
        ]
      },
      {
        heading: 'Injector Service and Cleaning',
        paragraphs: [
          'Injector nozzles require periodic service to maintain performance. Service interval depends on fuel quality and operating conditions.',
          'Cleaning involves ultrasonic bath and reverse-flow flushing to remove deposits from spray holes. Mechanical cleaning can damage precision surfaces.',
          'After cleaning, test opening pressure and spray pattern. Nozzles failing to meet specifications require reconditioning or replacement.',
          'When installing nozzles, always use new copper sealing washers. Ensure correct nozzle protrusion into combustion chamber per engine specification.'
        ],
        warnings: [
          'Never test injectors by directing spray toward skin',
          'Injection pressure can cause fatal injuries',
          'Use proper PPE including face shield'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Injector Fault', 'Misfire', 'Black Smoke', 'Poor Performance'],
    relatedContent: ['INJ_002', 'FUEL_001', 'ENGINE_001'],
    tools: ['Nozzle test bench', 'Ultrasonic cleaner', 'Shim kit', 'Torque wrench'],
    proTips: [
      'Test nozzles before and after cleaning to verify improvement',
      'Keep spray hole cleaning tools immaculately clean',
      'Match nozzle spray angle to combustion chamber design'
    ],
    partsPageLink: '/parts/injectors',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INJECTION PUMP (35+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'PUMP_001',
    category: 'injector_pump',
    subcategory: 'rotary',
    title: 'Rotary Injection Pump Operation and Diagnostics',
    slug: 'rotary-injection-pump-guide-kenya',
    keywords: [
      'injection pump Kenya', 'diesel pump repair', 'rotary pump diagnostics',
      'Bosch VE pump', 'Stanadyne pump Nairobi', 'generator injection pump'
    ],
    summary: 'Understanding rotary (distributor-type) injection pump operation, common problems, and diagnostic procedures.',
    content: [
      {
        heading: 'Rotary Pump Design',
        paragraphs: [
          'Rotary injection pumps use a single pumping element to supply all cylinders in sequence. A rotating distributor head delivers high-pressure fuel pulses to each injector line at the correct time.',
          'These compact pumps are common on smaller diesel generators. Major manufacturers include Bosch (VE pump), Stanadyne (DB/DS pumps), and Zexel (VRZ pump).',
          'Key components include the drive shaft, transfer pump, rotor, distributor head, cam ring, and governor mechanism. Understanding each component helps diagnose problems effectively.'
        ]
      },
      {
        heading: 'Timing and Delivery',
        paragraphs: [
          'Injection timing is controlled by the relationship between pump rotation and engine crankshaft position. Static timing is set during installation. Dynamic timing may be adjusted by internal advance mechanisms.',
          'Fuel delivery is controlled by the governor mechanism responding to speed and load demands. The governor moves the control sleeve or metering valve to vary the quantity of fuel pumped per injection.',
          'Advance mechanisms automatically adjust timing based on engine speed or load. Centrifugal advance changes timing with speed. Load-sensitive advance adjusts for load changes. Both mechanisms may be present.'
        ]
      },
      {
        heading: 'Common Rotary Pump Problems',
        paragraphs: [
          'Wear in the rotor and distributor head causes internal leakage, reducing maximum pressure capability. Symptoms include hard starting, smoke at high load, and power loss.',
          'Transfer pump vane wear reduces supply pressure to the pumping element. Symptoms include inconsistent starting and fuel starvation at high demand.',
          'Governor problems cause speed control issues. Worn governor linkages cause hunting or inability to reach rated speed. Failed governor springs cause improper speed regulation.',
          'Timing advance mechanism wear or seizure affects injection timing accuracy. Symptoms vary by affected mechanism but often include smoke, poor performance, or hard starting.'
        ],
        steps: [
          'Check transfer pump pressure with gauge',
          'Verify timing using timing marks or electronic tool',
          'Check governor response to speed changes',
          'Listen for abnormal pump noises',
          'Check for external fuel leaks',
          'Verify advance mechanism operation',
          'Compare fuel delivery between cylinders'
        ]
      },
      {
        heading: 'Field Testing Procedures',
        paragraphs: [
          'Transfer pump pressure test: Install gauge at pump inlet. Pressure should meet specification (typically 0.5-2 bar) across speed range. Low pressure indicates worn transfer pump.',
          'Injection timing can be verified using spill timing method or electronic timing tools. Compare actual timing to specification and adjust as needed.',
          'Delivery comparison testing loosens injection lines one at a time while running, noting speed drop for each cylinder. Equal drops indicate equal delivery. Unequal drops point to delivery imbalance.',
          'Governor testing involves operating through speed range while monitoring actual speed. Speed should be stable and controllable across range. Hunting or instability indicates governor problems.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'diagnostic',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Injection Pump Fault', 'Low Fuel Pressure', 'Timing Error', 'Governor Fault'],
    relatedContent: ['PUMP_002', 'INJ_001', 'FUEL_001'],
    tools: ['Injection pump test bench', 'Timing tools', 'Pressure gauge', 'Flow meter'],
    whenToCallProfessional: [
      'Internal pump repairs requiring disassembly',
      'Pump calibration beyond field adjustment',
      'Governor recalibration',
      'Timing advance service'
    ],
    partsPageLink: '/parts/injection-pumps',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLING SYSTEM (40+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'COOL_001',
    category: 'cooling',
    subcategory: 'fundamentals',
    title: 'Generator Cooling System Operation in Kenya Climate',
    slug: 'generator-cooling-system-kenya',
    keywords: [
      'generator cooling Kenya', 'radiator maintenance', 'diesel cooling system',
      'overheating prevention Nairobi', 'coolant Kenya', 'generator temperature'
    ],
    summary: 'Understanding diesel generator cooling systems and maintenance requirements for reliable operation in Kenya\'s climate.',
    content: [
      {
        heading: 'Cooling System Importance',
        paragraphs: [
          'The cooling system maintains engine temperature within safe operating range despite varying ambient conditions and load demands. In Kenya\'s warm climate, cooling system reliability is especially critical.',
          'Diesel engines convert only about 35-40% of fuel energy into useful work. The remainder becomes heat that must be removed to prevent damage. The cooling system handles approximately 30% of fuel energy.',
          'Overheating causes rapid and expensive damage including head gasket failure, warped cylinder head, seized pistons, and damaged bearings. Proper cooling system maintenance prevents these costly failures.'
        ]
      },
      {
        heading: 'Cooling System Components',
        paragraphs: [
          'The water pump circulates coolant through the engine and radiator. It is driven by the engine through a belt or gear drive. Pump failure causes immediate overheating.',
          'The thermostat controls coolant flow to maintain optimal operating temperature. It remains closed when engine is cold, routing coolant through the engine only. As temperature rises, it opens to allow radiator cooling.',
          'The radiator transfers heat from coolant to air. Ambient air (pulled by fan) flows through radiator fins, cooling the internal tubes carrying hot coolant.',
          'The cooling fan pulls air through the radiator. It may be belt-driven (continuous operation), clutch-driven (speed varies with temperature), or electric (controlled by temperature switch or controller).'
        ]
      },
      {
        heading: 'Kenya Climate Considerations',
        paragraphs: [
          'Kenya\'s warm ambient temperatures reduce the temperature differential available for cooling. Radiators must be properly sized for local conditions rather than temperate climate specifications.',
          'Dust and debris are significant issues across Kenya. Radiator fins clog with dust, reducing airflow and cooling capacity. Regular cleaning is essential - often more frequently than manufacturer schedules designed for cleaner environments.',
          'Altitude affects cooling at Kenya\'s highland locations. Lower air density reduces cooling effectiveness. Generators at higher elevations may require larger radiators or different fan configurations.',
          'Coastal humidity (Mombasa area) creates different challenges. Corrosion risk increases with humid, salt-laden air. Corrosion protection becomes more important than in upcountry locations.'
        ]
      },
      {
        heading: 'Coolant Selection and Maintenance',
        paragraphs: [
          'Proper coolant mixture provides freeze protection, boil-over protection, and corrosion inhibitors. In Kenya, freeze protection is unnecessary but corrosion protection remains essential.',
          'Use quality coolant meeting engine manufacturer specifications. Mixing different coolant types can cause chemical reactions that damage the cooling system.',
          'Coolant strength should be tested periodically. Over time, corrosion inhibitors deplete even if coolant appears clean. Most manufacturers recommend coolant replacement every 2-3 years.',
          'Clean water is essential when mixing coolant. Hard water or contaminated water introduces minerals that can cause deposits and corrosion. Distilled or deionized water is preferred.'
        ],
        notes: [
          'Never mix different coolant types or colors',
          'Test coolant inhibitor levels annually',
          'Maintain 40-50% coolant concentration even in Kenya'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 15,
    relatedFaultCodes: ['High Temperature', 'Low Coolant', 'Cooling Fan Fault', 'Thermostat Fault'],
    relatedContent: ['COOL_002', 'COOL_003', 'SENS_001'],
    tools: ['Coolant tester', 'Pressure tester', 'Infrared thermometer'],
    proTips: [
      'Clean radiator with low-pressure water from inside out',
      'Check coolant level when engine is cold',
      'Inspect belt tension at each service'
    ],
    partsPageLink: '/parts/cooling-system',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGINE MECHANICAL (50+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ENG_001',
    category: 'engine',
    subcategory: 'compression',
    title: 'Diesel Engine Compression Testing and Analysis',
    slug: 'diesel-compression-testing-kenya',
    keywords: [
      'diesel compression test Kenya', 'engine compression', 'generator engine diagnostics',
      'cylinder compression Nairobi', 'low compression diesel', 'engine wear diagnosis'
    ],
    summary: 'Guide to performing and interpreting diesel engine compression tests for generator applications.',
    content: [
      {
        heading: 'Why Compression Testing Matters',
        paragraphs: [
          'Compression testing reveals the mechanical condition of engine cylinders. Adequate compression is essential for diesel ignition - unlike petrol engines, diesel relies on compression heat rather than spark plugs.',
          'Low compression prevents diesel fuel from igniting properly. Symptoms include hard starting (especially cold), excessive smoke, power loss, and increased fuel consumption.',
          'Compression testing should be part of routine diagnostics for any engine performance complaint. It quickly identifies whether problems are mechanical or fuel/injection related.'
        ]
      },
      {
        heading: 'Testing Procedure',
        paragraphs: [
          'Remove all injectors to enable free cranking and equal conditions for all cylinders. Cover injector openings to prevent debris entry.',
          'Disable fuel system to prevent injection during cranking. On electronic systems, remove fuel pump fuse. On mechanical systems, close fuel shutoff or disconnect stop solenoid.',
          'Install compression gauge adapter in first cylinder injector hole. Ensure tight seal for accurate readings.',
          'Crank engine with starter motor for several compression strokes (typically 6-8). Note maximum reading on gauge. Repeat for each cylinder.',
          'Battery condition affects cranking speed, which affects compression readings. Ensure fully charged battery and consistent cranking for comparable readings.'
        ],
        steps: [
          'Warm engine to operating temperature if possible',
          'Remove all injectors and glow plugs',
          'Disable fuel system',
          'Install compression gauge adapter in cylinder 1',
          'Crank engine for 6-8 compression strokes',
          'Record maximum gauge reading',
          'Release gauge and repeat for each cylinder',
          'Compare readings between cylinders and to specification'
        ]
      },
      {
        heading: 'Interpreting Results',
        paragraphs: [
          'Typical diesel compression ranges from 275-400 psi (19-28 bar) depending on engine design. Always compare to manufacturer specification for the specific engine.',
          'Variation between cylinders is as important as absolute values. Difference greater than 10% between highest and lowest cylinder indicates problem with low cylinder.',
          'Uniformly low compression suggests overall engine wear. Components wearing evenly over time include rings, cylinder walls, and valve seats.',
          'Single cylinder low compression points to specific problem with that cylinder - stuck ring, burned valve, or damaged head gasket between cylinders.'
        ]
      },
      {
        heading: 'Wet Test for Diagnosis',
        paragraphs: [
          'The wet test helps identify whether low compression is due to ring/cylinder wear or valve problems.',
          'Add small amount of oil (about 15ml) through injector hole on low-reading cylinder. Oil temporarily seals ring-to-cylinder clearance.',
          'Retest compression. If reading increases significantly, rings or cylinder wear is the problem. Oil sealing the gaps allows better compression.',
          'If reading does not improve with oil, valves are the likely problem. Oil cannot seal valve faces, so valve leakage continues regardless of oil addition.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 15,
    relatedFaultCodes: ['Low Compression', 'Hard Start', 'Engine Misfire', 'Low Power'],
    relatedContent: ['ENG_002', 'ENG_003', 'INJ_001'],
    tools: ['Compression tester', 'Injector removal tools', 'Cranking motor', 'Oil squirt can'],
    proTips: [
      'Test with engine warm for most accurate results',
      'Record readings for trending over time',
      'Compare wet test results for ring vs valve diagnosis'
    ],
    partsPageLink: '/parts/engine-components',
    lastUpdated: '2024-03-15'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL SYSTEMS (45+ entries)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ELEC_001',
    category: 'electrical',
    subcategory: 'wiring',
    title: 'Generator Wiring Diagnostics and Repair',
    slug: 'generator-wiring-diagnostics-kenya',
    keywords: [
      'generator wiring Kenya', 'electrical diagnostics', 'wiring repair generator',
      'electrical fault finding Nairobi', 'generator electrical problems'
    ],
    summary: 'Systematic approach to diagnosing and repairing electrical wiring faults in generator systems.',
    content: [
      {
        heading: 'Wiring System Overview',
        paragraphs: [
          'Generator electrical systems include starting circuits, control circuits, sensing circuits, protection circuits, and output circuits. Each has specific requirements and common failure modes.',
          'Wiring problems account for a significant percentage of generator faults. Systematic diagnostic approach identifies problems efficiently rather than random part replacement.',
          'Understanding circuit types helps predict likely fault locations. High-current circuits (starting) fail differently than low-current sensing circuits.'
        ]
      },
      {
        heading: 'Visual Inspection',
        paragraphs: [
          'Begin diagnosis with thorough visual inspection. Many wiring problems are visible - burned wires, corroded terminals, chafed insulation, or loose connections.',
          'Follow wire harnesses looking for damage from heat, vibration, or physical contact. Check areas near exhaust components, moving parts, and sharp edges.',
          'Examine connectors for corrosion, moisture intrusion, pushed-out terminals, or heat damage. Green or white deposits indicate corrosion. Melted plastic indicates overheating.',
          'Check ground connections carefully. Grounds corrode faster than other connections because they attach to chassis or engine materials that may corrode.'
        ]
      },
      {
        heading: 'Voltage Drop Testing',
        paragraphs: [
          'Voltage drop testing identifies high-resistance connections that may appear visually acceptable. This technique is superior to resistance testing for finding intermittent problems.',
          'With circuit operating, measure voltage across each connection and wire segment. Good connections show near-zero voltage drop. High drop indicates resistance in that section.',
          'Typical acceptable voltage drops: Battery cables less than 0.2V, control wiring less than 0.1V, ground circuits less than 0.1V. Higher drops indicate problems.',
          'Compare similar circuits to identify abnormal drops. If one circuit shows higher drop than parallel circuits, investigate that circuit for problems.'
        ],
        steps: [
          'Set multimeter to DC volts',
          'Connect negative lead to circuit ground',
          'Activate circuit so current flows',
          'Touch positive lead to various points along circuit',
          'Note voltage at each point',
          'Calculate drop between adjacent points',
          'Identify any sections with excessive drop',
          'Repair or replace high-resistance sections'
        ]
      },
      {
        heading: 'Common Wiring Failures',
        paragraphs: [
          'Connector corrosion is extremely common in Kenya conditions. Humidity and dust combine to create corrosive conditions. Sealed connectors resist better than open types.',
          'Vibration causes wire fatigue where wires enter connectors or pass through grommets. Broken strands increase resistance even before complete failure.',
          'Heat damage occurs near exhaust components or from overloaded wires. Heat-damaged insulation becomes brittle and cracks, allowing shorts or grounds.',
          'Rodent damage affects stored generators. Rodents chew wire insulation causing shorts and opens. Inspect carefully when recommissioning stored equipment.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Wiring Fault', 'Ground Fault', 'Short Circuit', 'Open Circuit'],
    relatedContent: ['ELEC_002', 'ELEC_003', 'CTRL_001'],
    tools: ['Multimeter', 'Test light', 'Wire strippers', 'Crimping tools', 'Heat shrink'],
    proTips: [
      'Document wiring before disconnecting anything',
      'Label wires during disassembly',
      'Use marine-grade connectors in humid areas'
    ],
    partsPageLink: '/parts/electrical',
    lastUpdated: '2024-03-15'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT MANAGEMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get content by category
 */
export function getContentByCategory(category: EducationCategory): EducationalContent[] {
  return EDUCATIONAL_CONTENT.filter(c => c.category === category);
}

/**
 * Get content by skill level
 */
export function getContentBySkillLevel(level: SkillLevel): EducationalContent[] {
  return EDUCATIONAL_CONTENT.filter(c => c.skillLevel === level);
}

/**
 * Search content by keyword
 */
export function searchEducationalContent(query: string): EducationalContent[] {
  const lowerQuery = query.toLowerCase();
  return EDUCATIONAL_CONTENT.filter(content =>
    content.keywords.some(kw => kw.toLowerCase().includes(lowerQuery)) ||
    content.title.toLowerCase().includes(lowerQuery) ||
    content.summary.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get content by slug for SEO pages
 */
export function getContentBySlug(slug: string): EducationalContent | undefined {
  return EDUCATIONAL_CONTENT.find(c => c.slug === slug);
}

/**
 * Get related content
 */
export function getRelatedContent(contentId: string): EducationalContent[] {
  const content = EDUCATIONAL_CONTENT.find(c => c.id === contentId);
  if (!content) return [];

  return EDUCATIONAL_CONTENT.filter(c =>
    content.relatedContent.includes(c.id)
  );
}

/**
 * Get content linked to specific fault code
 */
export function getContentByFaultCode(faultCode: string): EducationalContent[] {
  return EDUCATIONAL_CONTENT.filter(c =>
    c.relatedFaultCodes.some(fc =>
      fc.toLowerCase().includes(faultCode.toLowerCase())
    )
  );
}

/**
 * Get all slugs for static page generation
 */
export function getAllContentSlugs(): string[] {
  return EDUCATIONAL_CONTENT.map(c => c.slug);
}

/**
 * Get category metadata
 */
export function getCategoryMeta(categoryId: EducationCategory): CategoryMeta | undefined {
  return EDUCATION_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Update category content counts
 */
export function updateCategoryCounts(): void {
  for (const category of EDUCATION_CATEGORIES) {
    category.contentCount = EDUCATIONAL_CONTENT.filter(c => c.category === category.id).length;
  }
}

/**
 * Get total content count
 */
export function getTotalContentCount(): number {
  return EDUCATIONAL_CONTENT.length;
}

// Initialize category counts
updateCategoryCounts();
