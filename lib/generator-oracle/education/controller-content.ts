/**
 * Generator Controller Educational Content
 * DSE, ComAp, Cummins, Woodward, SmartGen controllers
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const CONTROLLER_CONTENT: EducationalContent[] = [
  {
    id: 'CTRL_001',
    category: 'controller',
    subcategory: 'dse',
    title: 'DSE Controller Complete Operation Guide',
    slug: 'dse-controller-operation-guide-kenya',
    keywords: ['DSE controller Kenya', 'Deep Sea Electronics', 'DSE 7320', 'DSE configuration Nairobi'],
    summary: 'Complete operational guide for DSE generator controllers covering setup, configuration, fault diagnosis, and advanced features.',
    content: [
      {
        heading: 'DSE Controller Overview',
        paragraphs: [
          'Deep Sea Electronics controllers are among the most widely used generator control systems in Kenya and East Africa. These robust controllers provide comprehensive engine management, alternator monitoring, and automatic transfer functionality.',
          'DSE controllers range from basic manual start panels (DSE 4520) to advanced auto-mains failure controllers (DSE 7320, 7420) and paralleling systems (DSE 8610).',
          'All DSE controllers share common design philosophy with similar button layouts, display formats, and configuration software.'
        ]
      },
      {
        heading: 'Front Panel Navigation',
        paragraphs: [
          'The LCD display shows engine parameters, generator data, and alarm conditions. Arrow buttons scroll through display pages.',
          'Mode button cycles between Stop, Manual, Auto, and Test modes. Each mode has specific behaviors for engine control.',
          'Status LEDs provide quick visual indication of operating conditions. Green indicates normal, yellow indicates warning, red indicates fault.'
        ]
      },
      {
        heading: 'Configuration Software',
        paragraphs: [
          'DSE Configuration Suite software provides full access to controller settings through PC connection. Parameters are organized into logical categories.',
          'USB connection is standard on modern DSE controllers. Ensure correct drivers are installed before connection.',
          'Always save configuration backup before making changes. Configuration files can be transferred between identical controllers.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Emergency Stop', 'Low Oil Pressure', 'High Temperature', 'Fail to Start'],
    relatedContent: ['CTRL_002', 'CTRL_003'],
    tools: ['DSE Configuration Suite', 'USB cable', 'Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_002',
    category: 'controller',
    subcategory: 'dse',
    title: 'DSE 7320 Auto Mains Failure Configuration',
    slug: 'dse-7320-amf-configuration-kenya',
    keywords: ['DSE 7320 Kenya', 'AMF controller', 'auto transfer', 'mains failure configuration'],
    summary: 'Step-by-step guide to configuring DSE 7320 for automatic mains failure and transfer switch operation.',
    content: [
      {
        heading: 'AMF System Overview',
        paragraphs: [
          'The Auto Mains Failure system monitors utility power and automatically starts the generator when mains fails. When mains returns, the system transfers load back and stops the generator.',
          'DSE 7320 provides comprehensive AMF functionality including adjustable timers, voltage thresholds, and transfer sequencing.',
          'Understanding the complete transfer sequence is essential for proper configuration and troubleshooting.'
        ]
      },
      {
        heading: 'Mains Monitoring Configuration',
        paragraphs: [
          'Mains voltage sensing connects to utility supply through potential transformer or direct connection depending on voltage level.',
          'Under-voltage and over-voltage setpoints define acceptable mains voltage range. Settings outside this range trigger mains fail condition.',
          'Under-frequency and over-frequency setpoints protect against poor mains quality. Kenya standard frequency is 50Hz.'
        ]
      },
      {
        heading: 'Timer Configuration',
        paragraphs: [
          'Mains fail delay prevents nuisance starts from brief mains disturbances. Typical settings are 3-10 seconds.',
          'Engine start delay allows brief utility restoration before committing to generator start.',
          'Transfer delays ensure generator is stable before load transfer and mains is stable before return transfer.',
          'Cooling run time allows generator operation after load removal for proper cool-down.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Mains Fail', 'Under Voltage', 'Over Voltage', 'Transfer Fail'],
    relatedContent: ['CTRL_001', 'CTRL_005'],
    tools: ['DSE Configuration Suite', 'Voltmeter', 'Clamp meter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_003',
    category: 'controller',
    subcategory: 'comap',
    title: 'ComAp InteliGen Controller Programming',
    slug: 'comap-inteligen-programming-kenya',
    keywords: ['ComAp controller Kenya', 'InteliGen programming', 'InteliConfig', 'ComAp fault codes'],
    summary: 'Professional guide to ComAp InteliGen controller operation, programming, and advanced configuration.',
    content: [
      {
        heading: 'ComAp Controller Family',
        paragraphs: [
          'ComAp manufactures advanced generator controllers popular in industrial and commercial applications throughout Kenya.',
          'InteliLite controllers provide essential auto-mains failure and engine protection. InteliGen controllers add paralleling, load management, and sophisticated logic.',
          'All ComAp controllers use InteliConfig software for configuration and InteliMonitor for remote monitoring.'
        ]
      },
      {
        heading: 'InteliConfig Software Navigation',
        paragraphs: [
          'InteliConfig organizes parameters into functional groups with tree-view navigation. The software supports online and offline editing.',
          'Parameter groups include Engine Settings, Generator Settings, Protections, Inputs/Outputs, and Communication.',
          'Archive function saves complete configuration snapshots. Always create archives before modifications.'
        ]
      },
      {
        heading: 'Setpoint Groups',
        paragraphs: [
          'ComAp controllers use Setpoint Groups to organize protection values. Multiple setpoint groups allow different protection for various operating modes.',
          'Each protection can be assigned to a setpoint group with specific delay times and actions.',
          'Temperature and pressure protections often use curves rather than single setpoints for speed or load-dependent protection.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 22,
    relatedFaultCodes: ['Emergency Stop', 'Mains Fail', 'Generator Protection', 'Engine Protection'],
    relatedContent: ['CTRL_001', 'CTRL_004'],
    tools: ['InteliConfig software', 'InteliMonitor', 'USB/RS232 cable'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_004',
    category: 'controller',
    subcategory: 'comap',
    title: 'ComAp PLC Editor Custom Logic Programming',
    slug: 'comap-plc-editor-programming-kenya',
    keywords: ['ComAp PLC Kenya', 'ladder logic', 'custom logic programming', 'InteliGen PLC'],
    summary: 'Creating custom automation logic using ComAp PLC Editor for specialized generator applications.',
    content: [
      {
        heading: 'PLC Editor Overview',
        paragraphs: [
          'Advanced ComAp controllers include integrated PLC functionality for custom logic programming. The PLC editor uses ladder logic similar to industrial PLCs.',
          'PLC programming allows creation of custom interlocks, automated sequences, and special protection logic.',
          'Common applications include fuel tank changeover, multiple alternator operation, and custom alarm conditions.'
        ]
      },
      {
        heading: 'Programming Elements',
        paragraphs: [
          'Contacts represent inputs - physical inputs, internal flags, and system status. Normally open and normally closed contacts available.',
          'Coils represent outputs - physical outputs, internal flags, and system commands.',
          'Timers and counters enable time-based logic and event counting. Multiple timer types available including on-delay, off-delay, and pulse.'
        ]
      },
      {
        heading: 'Programming Best Practices',
        paragraphs: [
          'Document all custom logic thoroughly. Future technicians must understand the programming to maintain the system.',
          'Test logic carefully before deployment. PLC errors can cause unexpected generator behavior.',
          'Consider interaction between PLC logic and built-in controller functions. Avoid conflicts that could cause unsafe operation.'
        ]
      }
    ],
    skillLevel: 'expert',
    contentType: 'theory',
    estimatedReadTime: 25,
    relatedFaultCodes: ['PLC Error', 'Logic Fault', 'Custom Alarm'],
    relatedContent: ['CTRL_003', 'CTRL_001'],
    tools: ['InteliConfig PLC Editor', 'Test equipment'],
    safetyWarnings: ['Test all custom logic thoroughly', 'Document all programming'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_005',
    category: 'controller',
    subcategory: 'cummins',
    title: 'Cummins PowerCommand Controller Operation',
    slug: 'cummins-powercommand-operation-kenya',
    keywords: ['Cummins PowerCommand Kenya', 'PCC controller', 'Cummins generator controller'],
    summary: 'Comprehensive guide to Cummins PowerCommand controller operation and diagnostics.',
    content: [
      {
        heading: 'PowerCommand Architecture',
        paragraphs: [
          'Cummins PowerCommand controllers integrate engine control with power generation management. The system consists of the PCC panel and engine ECM communicating via J1939.',
          'PowerCommand provides automatic paralleling, load management, and comprehensive protection without separate governor and AVR controllers.',
          'Different PowerCommand models serve various applications from standby power to prime power and paralleling.'
        ]
      },
      {
        heading: 'InPower Service Tool',
        paragraphs: [
          'InPower is the primary diagnostic and configuration tool for Cummins PowerCommand systems.',
          'InPower requires proper licensing for full functionality. Service license enables parameter modification.',
          'Connection uses the service port on the controller front panel via USB or RS232.'
        ]
      },
      {
        heading: 'Fault Code System',
        paragraphs: [
          'PowerCommand displays faults using alphanumeric codes with abbreviated descriptions.',
          'Faults are categorized by severity and source - engine faults from ECM, generator faults from PCC.',
          'Fault log stores recent history with timestamps for pattern analysis.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'troubleshooting',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Engine Fault', 'Generator Fault', 'Communication Fault'],
    relatedContent: ['CTRL_001', 'ECM_001'],
    tools: ['InPower Service Tool', 'Cummins QuickServe'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_006',
    category: 'controller',
    subcategory: 'smartgen',
    title: 'SmartGen Controller Setup and Configuration',
    slug: 'smartgen-controller-setup-kenya',
    keywords: ['SmartGen controller Kenya', 'HGM series', 'SmartGen configuration', 'budget controller'],
    summary: 'Setup and configuration guide for SmartGen HGM series generator controllers.',
    content: [
      {
        heading: 'SmartGen Controller Overview',
        paragraphs: [
          'SmartGen controllers offer cost-effective generator control solutions popular in Kenya for budget-conscious applications.',
          'The HGM series includes models for single generator control (HGM6120) through complex paralleling systems (HGM9510).',
          'While less feature-rich than premium brands, SmartGen provides reliable basic functionality.'
        ]
      },
      {
        heading: 'Software Configuration',
        paragraphs: [
          'SmartGen PC software connects via USB or RS485 for configuration and monitoring.',
          'Parameter organization differs from DSE and ComAp but covers similar functionality.',
          'Firmware updates may be available to add features or fix bugs.'
        ]
      },
      {
        heading: 'Common Setup Tasks',
        paragraphs: [
          'Configure generator voltage and frequency for Kenya 415V, 50Hz standards.',
          'Set engine protection parameters matching engine specifications.',
          'Configure transfer timings for automatic operation.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 15,
    relatedFaultCodes: ['Mains Fail', 'Gen Fault', 'Engine Alarm'],
    relatedContent: ['CTRL_001', 'CTRL_007'],
    tools: ['SmartGen PC software', 'USB cable'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_007',
    category: 'controller',
    subcategory: 'woodward',
    title: 'Woodward easYgen Controller Configuration',
    slug: 'woodward-easygen-configuration-kenya',
    keywords: ['Woodward controller Kenya', 'easYgen', 'Woodward configuration', 'industrial controller'],
    summary: 'Configuration and operation guide for Woodward easYgen series generator controllers.',
    content: [
      {
        heading: 'easYgen Controller Family',
        paragraphs: [
          'Woodward easYgen controllers provide premium generator control for industrial and utility applications.',
          'The easYgen range includes single generator controllers through complex multi-unit paralleling systems.',
          'Known for robust design and comprehensive functionality in demanding applications.'
        ]
      },
      {
        heading: 'ToolKit Software',
        paragraphs: [
          'Woodward ToolKit software provides configuration, monitoring, and diagnostic capabilities.',
          'The software includes graphical application building for custom control strategies.',
          'Comprehensive event logging supports detailed analysis and troubleshooting.'
        ]
      },
      {
        heading: 'Advanced Features',
        paragraphs: [
          'Complex paralleling algorithms support utility interconnection and islanding.',
          'Load sharing capabilities enable precise kW and kVAR distribution.',
          'Communication options include Modbus, PROFIBUS, and Ethernet protocols.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['System Fault', 'Protection Trip', 'Communication Error'],
    relatedContent: ['CTRL_001', 'PARALLEL_001'],
    tools: ['Woodward ToolKit', 'Serial/Ethernet adapter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_008',
    category: 'controller',
    subcategory: 'diagnostics',
    title: 'Controller Fault Code Interpretation Guide',
    slug: 'controller-fault-code-interpretation-kenya',
    keywords: ['controller fault codes Kenya', 'generator alarm diagnosis', 'controller troubleshooting'],
    summary: 'Universal guide to interpreting and resolving common generator controller fault codes.',
    content: [
      {
        heading: 'Common Controller Faults',
        paragraphs: [
          'Emergency Stop indicates the external emergency stop circuit is open. Check emergency stop buttons and wiring.',
          'Fail to Start occurs when engine does not reach running speed within configured crank time. Check fuel, battery, and starting system.',
          'Low Oil Pressure warns of insufficient oil pressure. Verify oil level and check pressure sender.'
        ]
      },
      {
        heading: 'Protection System Faults',
        paragraphs: [
          'High Temperature indicates cooling system issues. Check coolant level, radiator condition, and temperature sensor.',
          'Over Current means generator load exceeds capacity. Reduce load or check for faults.',
          'Under/Over Voltage indicates AVR or alternator problems. Check AVR settings and excitation.'
        ]
      },
      {
        heading: 'Communication Faults',
        paragraphs: [
          'CAN Error indicates communication failure between controller and ECM. Check wiring and termination.',
          'Sensor Fail indicates sensor signal out of expected range. Check sensor and wiring.',
          'Configuration Error means parameters are invalid or corrupted. Reload configuration from backup.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 16,
    relatedFaultCodes: ['All controller faults'],
    relatedContent: ['CTRL_001', 'ECM_002'],
    tools: ['Controller software', 'Multimeter'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_009',
    category: 'controller',
    subcategory: 'io',
    title: 'Controller Input/Output Configuration',
    slug: 'controller-io-configuration-kenya',
    keywords: ['controller inputs Kenya', 'controller outputs', 'I/O configuration', 'sensor wiring'],
    summary: 'Configuring controller inputs and outputs for sensors, switches, and external devices.',
    content: [
      {
        heading: 'Input Types',
        paragraphs: [
          'Digital inputs sense switch states - open or closed. Used for emergency stops, pressure switches, level switches.',
          'Analog inputs measure variable signals - voltage or current proportional to measured parameters.',
          'Configurable inputs can be set for different sensor types - resistive, voltage, or current.'
        ]
      },
      {
        heading: 'Output Types',
        paragraphs: [
          'Relay outputs provide switch contacts for external loads - fuel solenoid, starter, alarms.',
          'Analog outputs provide variable signals - 0-10V or 4-20mA for governor, AVR control.',
          'PWM outputs provide pulse-width modulated signals for proportional control.'
        ]
      },
      {
        heading: 'Configuration Process',
        paragraphs: [
          'Map physical I/O to logical functions in controller software.',
          'Configure sensor scaling - input signal range to engineering units.',
          'Set output behaviors - normally energized/de-energized, latching, pulsed.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Input Fault', 'Output Fault', 'Sensor Error'],
    relatedContent: ['CTRL_001', 'SENS_001'],
    tools: ['Controller software', 'Multimeter', 'Test signals'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_010',
    category: 'controller',
    subcategory: 'communication',
    title: 'Controller Remote Monitoring and Communication',
    slug: 'controller-remote-monitoring-kenya',
    keywords: ['remote monitoring Kenya', 'generator SCADA', 'Modbus communication', 'generator telemetry'],
    summary: 'Setting up remote monitoring and communication for generator controllers.',
    content: [
      {
        heading: 'Communication Protocols',
        paragraphs: [
          'Modbus RTU over RS485 is widely supported for local communication and SCADA integration.',
          'Modbus TCP enables Ethernet-based communication for network integration.',
          'Proprietary protocols may provide enhanced functionality with matched monitoring systems.'
        ]
      },
      {
        heading: 'Remote Monitoring Options',
        paragraphs: [
          'Cloud-based monitoring services provide web and mobile access to generator status.',
          'SMS alert systems notify operators of alarms via text message.',
          'SCADA integration connects generators to building or facility management systems.'
        ]
      },
      {
        heading: 'Configuration Steps',
        paragraphs: [
          'Enable communication interface in controller settings.',
          'Configure communication parameters - baud rate, address, protocol.',
          'Map data points for monitoring - which parameters to expose.',
          'Test communication with monitoring system.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 16,
    relatedFaultCodes: ['Communication Error', 'Remote Fault'],
    relatedContent: ['CTRL_001', 'CTRL_008'],
    tools: ['Communication adapter', 'Modbus testing software'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_011',
    category: 'controller',
    subcategory: 'synchronization',
    title: 'Controller Synchronization for Parallel Operation',
    slug: 'controller-synchronization-parallel-kenya',
    keywords: ['generator synchronization Kenya', 'parallel operation', 'sync check', 'breaker control'],
    summary: 'Configuring controller synchronization for safe generator paralleling.',
    content: [
      {
        heading: 'Synchronization Fundamentals',
        paragraphs: [
          'Synchronization matches generator output to bus or mains voltage, frequency, and phase before breaker closing.',
          'Three conditions must match: voltage magnitude, frequency, and phase angle.',
          'Closing breaker without synchronization causes severe mechanical shock and possible damage.'
        ]
      },
      {
        heading: 'Sync Check Settings',
        paragraphs: [
          'Voltage match window - typically +/- 5-10% of nominal voltage.',
          'Frequency match window - typically +/- 0.2-0.5 Hz.',
          'Phase angle window - typically +/- 5-15 degrees.',
          'Check time - how long conditions must be met before closing.'
        ]
      },
      {
        heading: 'Synchronization Modes',
        paragraphs: [
          'Dead bus closing allows connection to de-energized bus without synchronization.',
          'Live bus sync requires matching running generator to energized bus.',
          'First-on closing starts first generator without sync check, subsequent units sync to running unit.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Sync Fail', 'Phase Mismatch', 'Frequency Mismatch'],
    relatedContent: ['CTRL_005', 'PARALLEL_001'],
    tools: ['Synchroscope', 'Phase rotation meter', 'Controller software'],
    safetyWarnings: ['Never bypass synchronization protection', 'Test sync function before live operation'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_012',
    category: 'controller',
    subcategory: 'load_sharing',
    title: 'Controller Load Sharing Configuration',
    slug: 'controller-load-sharing-kenya',
    keywords: ['load sharing Kenya', 'kW sharing', 'droop control', 'parallel load balance'],
    summary: 'Configuring controller load sharing for balanced parallel generator operation.',
    content: [
      {
        heading: 'Load Sharing Principles',
        paragraphs: [
          'Load sharing divides total load among paralleled generators proportionally to their ratings.',
          'Real power (kW) sharing is achieved through speed droop or isochronous load sharing.',
          'Reactive power (kVAR) sharing is achieved through voltage droop or VAR sharing controls.'
        ]
      },
      {
        heading: 'Droop Operation',
        paragraphs: [
          'Speed droop causes slight frequency reduction as load increases. All paralleled units follow same droop curve.',
          'Typical droop setting is 3-5%. 4% droop means frequency drops 4% from no-load to full-load.',
          'Voltage droop similarly reduces voltage as reactive load increases for VAR sharing.'
        ]
      },
      {
        heading: 'Isochronous Load Sharing',
        paragraphs: [
          'Isochronous operation maintains constant frequency regardless of load.',
          'Requires communication between controllers for active load balancing.',
          'Provides better frequency regulation than droop but requires more sophisticated controls.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'theory',
    estimatedReadTime: 20,
    relatedFaultCodes: ['Load Unbalance', 'Reverse Power', 'kW Sharing Fault'],
    relatedContent: ['CTRL_011', 'PARALLEL_001'],
    tools: ['Power analyzer', 'Controller software'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_013',
    category: 'controller',
    subcategory: 'maintenance',
    title: 'Controller Preventive Maintenance Procedures',
    slug: 'controller-preventive-maintenance-kenya',
    keywords: ['controller maintenance Kenya', 'generator controller service', 'preventive maintenance'],
    summary: 'Regular maintenance tasks for generator controllers to ensure reliable operation.',
    content: [
      {
        heading: 'Inspection Tasks',
        paragraphs: [
          'Visually inspect controller for signs of overheating, moisture, or physical damage.',
          'Check all connections for tightness and corrosion. Loose connections cause intermittent faults.',
          'Verify display readability and button function.'
        ]
      },
      {
        heading: 'Functional Testing',
        paragraphs: [
          'Test all alarm and shutdown functions using simulation or actual conditions.',
          'Verify automatic transfer operation through mains failure simulation.',
          'Check remote monitoring communication if equipped.'
        ]
      },
      {
        heading: 'Software Maintenance',
        paragraphs: [
          'Backup controller configuration regularly.',
          'Check for firmware updates that may add features or fix issues.',
          'Review event log for recurring issues or patterns.'
        ]
      }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['All preventable faults'],
    relatedContent: ['CTRL_001', 'CTRL_008'],
    tools: ['Controller software', 'Cleaning supplies'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_014',
    category: 'controller',
    subcategory: 'replacement',
    title: 'Controller Replacement and Migration',
    slug: 'controller-replacement-migration-kenya',
    keywords: ['controller replacement Kenya', 'controller upgrade', 'migration', 'panel retrofit'],
    summary: 'Procedures for replacing failed controllers or upgrading to newer models.',
    content: [
      {
        heading: 'Replacement Planning',
        paragraphs: [
          'Document all existing settings before removing old controller.',
          'Verify replacement controller matches required functionality and I/O count.',
          'Plan for any wiring changes required by different terminal layouts.'
        ]
      },
      {
        heading: 'Installation Process',
        paragraphs: [
          'De-energize all power supplies before controller removal.',
          'Label all wires before disconnecting from old controller.',
          'Mount new controller and connect wiring per documentation.',
          'Power up and configure basic parameters before starting engine.'
        ]
      },
      {
        heading: 'Commissioning',
        paragraphs: [
          'Configure all parameters matching original settings or new requirements.',
          'Test all I/O functions with engine stopped.',
          'Start engine and verify sensor readings and control functions.',
          'Test all protection and automatic functions.'
        ]
      }
    ],
    skillLevel: 'advanced',
    contentType: 'repair',
    estimatedReadTime: 18,
    relatedFaultCodes: ['Configuration Error', 'I/O Fault'],
    relatedContent: ['CTRL_001', 'CTRL_009'],
    tools: ['Controller software', 'Wire markers', 'Multimeter'],
    partsPageLink: '/parts/controllers',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'CTRL_015',
    category: 'controller',
    subcategory: 'datakom',
    title: 'Datakom Controller Operation and Setup',
    slug: 'datakom-controller-setup-kenya',
    keywords: ['Datakom controller Kenya', 'DKG series', 'Datakom configuration', 'generator controller'],
    summary: 'Setup and operation guide for Datakom DKG series generator controllers.',
    content: [
      {
        heading: 'Datakom Controller Range',
        paragraphs: [
          'Datakom manufactures generator controllers popular in budget and mid-range applications across Kenya.',
          'DKG series includes models from basic manual start to AMF and paralleling configurations.',
          'Controllers offer good value with adequate functionality for most applications.'
        ]
      },
      {
        heading: 'Software Configuration',
        paragraphs: [
          'Datakom Rainbow software provides PC-based configuration and monitoring.',
          'Front panel programming is available for basic parameters without PC connection.',
          'Configuration can be copied between units for identical setups.'
        ]
      },
      {
        heading: 'Typical Applications',
        paragraphs: [
          'DKG-207 provides basic manual/auto start control.',
          'DKG-307 adds comprehensive AMF functionality.',
          'DKG-507 enables multiple generator paralleling.'
        ]
      }
    ],
    skillLevel: 'intermediate',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Mains Fail', 'Gen Fault', 'Protection'],
    relatedContent: ['CTRL_001', 'CTRL_006'],
    tools: ['Datakom Rainbow software', 'USB cable'],
    lastUpdated: '2024-03-15'
  }
];

export const CONTROLLER_CONTENT_COUNT = CONTROLLER_CONTENT.length;
