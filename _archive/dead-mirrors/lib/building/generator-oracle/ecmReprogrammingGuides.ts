'use client';

/**
 * ECM/ECU REPROGRAMMING GUIDES - INDEPENDENT REFERENCE
 *
 * COPYRIGHT-SAFE APPROACH:
 * ========================
 * - ECM/ECU model names are used freely for IDENTIFICATION PURPOSES ONLY
 * - All procedures are INDEPENDENTLY DEVELOPED - NOT copied from OEM manuals
 * - Guidance is based on general industry knowledge, J1939/CAN standards, and
 *   field technician experience
 *
 * IMPORTANT DISCLAIMER:
 * =====================
 * This is an INDEPENDENT reference tool. All reprogramming procedures, diagnostic
 * guidance, and parameter information are independently developed. They are NOT
 * copied from any manufacturer's official documentation.
 *
 * ECM/ECU model names such as Caterpillar ADEM, Cummins CM, Volvo Penta EMS,
 * Perkins, John Deere PowerTech, and MTU ADEC are used for IDENTIFICATION
 * PURPOSES ONLY.
 *
 * Generator Oracle is NOT affiliated with, endorsed by, or licensed by any
 * equipment manufacturer including Caterpillar, Cummins, Volvo, Perkins,
 * John Deere, MTU, or others.
 *
 * Procedures may differ from official manufacturer service procedures. Always
 * verify CRITICAL procedures against official documentation for warranty-covered
 * repairs.
 *
 * All brand names and trademarks are property of their respective owners.
 */

// ==================== TYPES ====================

export interface ReprogrammingGuide {
  id: string;
  ecmName: string;
  manufacturer: string;
  models: string[];
  overview: string;
  prerequisites: {
    tools: ToolRequirement[];
    software: SoftwareRequirement[];
    parts: string[];
    conditions: string[];
  };
  connectionProcedure: ConnectionStep[];
  reprogrammingProcedure: ReprogrammingStep[];
  parameterConfiguration: ParameterGuide[];
  j1939Setup: J1939Configuration;
  troubleshooting: TroubleshootingItem[];
  safetyWarnings: string[];
  commonMistakes: string[];
  verificationChecklist: string[];
}

export interface ToolRequirement {
  name: string;
  description: string;
  alternatives?: string[];
  essential: boolean;
}

export interface SoftwareRequirement {
  name: string;
  version: string;
  source: string;
  licenseRequired: boolean;
  alternatives?: string[];
}

export interface ConnectionStep {
  step: number;
  action: string;
  details: string;
  diagram?: string;
  pinout?: { pin: string; function: string; wire: string }[];
  voltage?: string;
  warnings?: string[];
}

export interface ReprogrammingStep {
  step: number;
  phase: 'preparation' | 'connection' | 'backup' | 'programming' | 'configuration' | 'verification';
  action: string;
  details: string;
  screenPath?: string;
  expectedResult: string;
  timeEstimate: string;
  criticalNotes: string[];
  recoveryAction?: string;
}

export interface ParameterGuide {
  category: string;
  parameters: {
    name: string;
    description: string;
    path: string;
    defaultValue: string;
    range: string;
    unit: string;
    affectsWhat?: string;
    howToSet?: string;
  }[];
}

export interface J1939Configuration {
  protocol?: string;
  baudRate: number;
  sourceAddress: string | number;
  transmitPGNs?: { pgn: string; name: string; rate: string; description: string }[];
  receivePGNs?: { pgn: string; name: string; description: string }[];
  supportedPGNs?: number[];
  terminationResistor?: {
    required: boolean;
    value: string;
    location: string;
  };
  wiringDiagram?: string;
}

export interface TroubleshootingItem {
  problem: string;
  possibleCauses?: string[];
  causes?: string[];
  solutions: string[];
}

// ==================== CATERPILLAR ECM GUIDES ====================

export const CAT_ADEM_A4_GUIDE: ReprogrammingGuide = {
  id: 'cat-adem-a4',
  ecmName: 'Caterpillar ADEM A4',
  manufacturer: 'Caterpillar',
  models: ['ADEM A4', 'ADEM III', '3500 Series ECM'],
  overview: 'This guide covers engine control module reprogramming for large diesel engines using J1939 communication. The procedures described are based on general industry practice for updating ECM firmware and calibration. Note: This is independent guidance - always verify against official documentation for your specific equipment. Brand names used for identification only.',

  prerequisites: {
    tools: [
      {
        name: 'CAT Communication Adapter III (CA3)',
        description: '9-pin diagnostic adapter for connecting laptop to ECM data link',
        alternatives: ['Nexiq USB-Link 2', 'DG Technologies DPA5'],
        essential: true
      },
      {
        name: 'Laptop Computer',
        description: 'Windows 10/11, minimum 8GB RAM, USB port',
        essential: true
      },
      {
        name: 'Battery Charger',
        description: '40A charger to maintain voltage during programming',
        essential: true
      },
      {
        name: 'Digital Multimeter',
        description: 'For verifying voltages before programming',
        essential: true
      }
    ],
    software: [
      {
        name: 'CAT Electronic Technician (ET)',
        version: '2023A or later',
        source: 'Caterpillar dealer or SIS Web subscription',
        licenseRequired: true,
        alternatives: []
      },
      {
        name: 'Flash Files (.fls)',
        version: 'Per engine serial number',
        source: 'CAT SIS Web - download using engine serial',
        licenseRequired: true
      }
    ],
    parts: [
      'ECM connector seal kit (if connector damaged)',
      'J1939 termination resistor 120Ω (if missing)'
    ],
    conditions: [
      'Engine at rest (not running)',
      'Battery voltage 24-28V DC',
      'All accessories OFF',
      'Ambient temperature 0-40°C'
    ]
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate ECM Data Link Connector',
      details: 'The ECM data link connector is typically a 9-pin Deutsch connector located near the ECM or in the engine junction box. Look for a yellow 9-pin connector labeled "SERVICE" or "DIAGNOSTIC".',
      pinout: [
        { pin: 'A', function: 'J1939 CAN_H', wire: 'Yellow' },
        { pin: 'B', function: 'J1939 CAN_L', wire: 'Green' },
        { pin: 'C', function: 'Ground', wire: 'Black' },
        { pin: 'D', function: 'CAT Data Link +', wire: 'Yellow/Black' },
        { pin: 'E', function: 'CAT Data Link -', wire: 'Green/Black' },
        { pin: 'F', function: '+Battery', wire: 'Red' },
        { pin: 'G', function: 'Not Used', wire: '-' },
        { pin: 'H', function: 'Ground', wire: 'Black' },
        { pin: 'J', function: 'Key Switch Signal', wire: 'Purple' }
      ],
      warnings: ['Do not probe pins with power applied - can damage ECM']
    },
    {
      step: 2,
      action: 'Verify Connector Power',
      details: 'Before connecting adapter, verify power is present at connector.',
      voltage: 'Pin F to Pin C should read 24-28V DC with key ON',
      warnings: ['If no voltage, check ECM power fuse and relay']
    },
    {
      step: 3,
      action: 'Connect Communication Adapter',
      details: 'Connect CA3 adapter to service connector. Ensure connection is firm and sealed. Connect USB cable from CA3 to laptop.',
      warnings: ['Do not force connector - pins can bend', 'Ensure weather seal is intact']
    },
    {
      step: 4,
      action: 'Connect Battery Charger',
      details: 'Connect 40A battery charger to maintain voltage during flash programming. Programming can take 15-30 minutes and draws significant current.',
      voltage: 'Maintain 24-28V throughout programming',
      warnings: ['LOW VOLTAGE DURING PROGRAMMING WILL BRICK ECM']
    }
  ],

  reprogrammingProcedure: [
    {
      step: 1,
      phase: 'preparation',
      action: 'Launch CAT Electronic Technician',
      details: 'Start CAT ET software on laptop. Select communication adapter (CA3 or compatible).',
      screenPath: 'Start Menu > Caterpillar > Electronic Technician',
      expectedResult: 'ET opens with adapter selection screen',
      timeEstimate: '1 minute',
      criticalNotes: ['Ensure no other diagnostic software is running', 'Close all unnecessary programs']
    },
    {
      step: 2,
      phase: 'connection',
      action: 'Connect to ECM',
      details: 'Turn key switch to ON position. In ET, click "Connect" button. ET will search for ECMs on the data link.',
      screenPath: 'ET Main Screen > Connect',
      expectedResult: 'ECM detected and connected. ECM information displayed.',
      timeEstimate: '30 seconds',
      criticalNotes: ['If connection fails, verify adapter lights are active', 'Check data link wiring if "No ECM Detected"'],
      recoveryAction: 'Power cycle ECM (turn key OFF for 30 seconds, then ON)'
    },
    {
      step: 3,
      phase: 'backup',
      action: 'Read and Save Current Configuration',
      details: 'CRITICAL: Before any programming, save the current ECM configuration.',
      screenPath: 'Service > Flash Programming > Read ECM > Save to File',
      expectedResult: '.fls configuration file saved to laptop',
      timeEstimate: '2-3 minutes',
      criticalNotes: [
        'Name file with engine serial number and date',
        'Save to both laptop and USB drive',
        'This is your ONLY recovery option if programming fails'
      ]
    },
    {
      step: 4,
      phase: 'backup',
      action: 'Record Current Fault Codes',
      details: 'Go to Diagnostics > Active Codes and Diagnostics > Logged Events. Screenshot or record all codes.',
      screenPath: 'Diagnostics > Active Codes',
      expectedResult: 'Fault codes documented for reference',
      timeEstimate: '2 minutes',
      criticalNotes: ['Some codes may clear after reflash', 'Historical codes help diagnose recurring issues']
    },
    {
      step: 5,
      phase: 'programming',
      action: 'Download Correct Flash File',
      details: 'Open CAT SIS Web. Enter engine serial number. Navigate to "Software" section. Download flash file (.fls) that matches your ECM hardware level.',
      screenPath: 'SIS Web > Serial Number Search > Software',
      expectedResult: 'Correct flash file downloaded to laptop',
      timeEstimate: '5-10 minutes',
      criticalNotes: [
        'VERIFY engine serial number - wrong flash file can damage ECM',
        'Match ECM suffix (hardware level) exactly',
        'Download both flash file AND calibration file if separate'
      ]
    },
    {
      step: 6,
      phase: 'programming',
      action: 'Verify Battery Voltage',
      details: 'Before starting flash, check battery voltage is above 24V.',
      expectedResult: '24-28V DC on battery',
      timeEstimate: '30 seconds',
      criticalNotes: [
        'If voltage drops below 22V during flash, ECM will be damaged',
        'Battery charger should be ON and charging'
      ]
    },
    {
      step: 7,
      phase: 'programming',
      action: 'Start ECM Flash Programming',
      details: 'In ET, go to Service > Flash Programming > Flash ECM. Select downloaded flash file. Click Start Programming.',
      screenPath: 'Service > Flash Programming > Flash ECM',
      expectedResult: 'Programming begins. Progress bar shows percentage.',
      timeEstimate: '15-25 minutes',
      criticalNotes: [
        'DO NOT turn off key',
        'DO NOT disconnect adapter',
        'DO NOT disconnect battery charger',
        'DO NOT interrupt in any way',
        'ECM may restart multiple times - this is normal'
      ],
      recoveryAction: 'If interrupted, ECM may need bench reprogramming or replacement'
    },
    {
      step: 8,
      phase: 'programming',
      action: 'Wait for Programming Complete',
      details: 'Watch progress bar. Do not touch anything until "Flash Programming Complete" message appears.',
      expectedResult: 'Green "Programming Complete" message',
      timeEstimate: '15-25 minutes',
      criticalNotes: [
        'ECM will restart automatically',
        'Wait for ECM to fully initialize (all lights cycle)'
      ]
    },
    {
      step: 9,
      phase: 'configuration',
      action: 'Restore Engine Configuration',
      details: 'After flash, some customer parameters may need to be reset. Go to Configuration menu.',
      screenPath: 'Service > Configuration',
      expectedResult: 'Configuration parameters accessible',
      timeEstimate: '10-15 minutes',
      criticalNotes: [
        'Verify engine serial number is correct',
        'Set rated speed (1500 or 1800 RPM)',
        'Set rated power',
        'Configure protection setpoints'
      ]
    },
    {
      step: 10,
      phase: 'configuration',
      action: 'Enter Injector Trim Codes',
      details: 'Each injector has a unique trim code printed on its body. Enter these codes in the correct cylinder order.',
      screenPath: 'Service > Calibrations > Injector Trim',
      expectedResult: 'All injector trim codes entered',
      timeEstimate: '5-10 minutes',
      criticalNotes: [
        'Codes are typically 4-8 characters',
        'Enter in FIRING ORDER (not physical order)',
        'Wrong codes cause rough running and smoke'
      ]
    },
    {
      step: 11,
      phase: 'verification',
      action: 'Clear Fault Codes',
      details: 'Clear any fault codes that appeared during programming.',
      screenPath: 'Diagnostics > Clear Codes',
      expectedResult: 'No active fault codes',
      timeEstimate: '2 minutes',
      criticalNotes: ['Some codes may return if actual problem exists']
    },
    {
      step: 12,
      phase: 'verification',
      action: 'Start Engine and Verify',
      details: 'Start engine and run for 5 minutes at idle. Then run at rated speed/load.',
      expectedResult: 'Engine runs smoothly, all parameters normal',
      timeEstimate: '10-15 minutes',
      criticalNotes: [
        'Monitor coolant temp, oil pressure, RPM',
        'Check for new fault codes',
        'Listen for abnormal sounds'
      ]
    }
  ],

  parameterConfiguration: [
    {
      category: 'Engine Rating',
      parameters: [
        {
          name: 'Rated Speed',
          description: 'Governed engine speed for power generation',
          path: 'Configuration > Engine > Rated Speed',
          defaultValue: '1500 RPM (50Hz) or 1800 RPM (60Hz)',
          range: '1500-1800 RPM',
          unit: 'RPM',
          affectsWhat: 'Generator frequency, governor response',
          howToSet: 'Select from dropdown. For 50Hz generators use 1500, for 60Hz use 1800.'
        },
        {
          name: 'Rated Power',
          description: 'Maximum continuous power rating',
          path: 'Configuration > Engine > Rated Power',
          defaultValue: 'Per engine nameplate',
          range: '70-110% of base rating',
          unit: 'kW',
          affectsWhat: 'Fuel limits, smoke limits, protection',
          howToSet: 'Enter value from generator nameplate. Do not exceed engine capability.'
        }
      ]
    },
    {
      category: 'Protection Settings',
      parameters: [
        {
          name: 'High Coolant Temperature Shutdown',
          description: 'Temperature at which ECM will shutdown engine',
          path: 'Configuration > Protection > High Coolant Temp Shutdown',
          defaultValue: '107°C',
          range: '100-115°C',
          unit: '°C',
          affectsWhat: 'Engine protection from overheating',
          howToSet: 'Set appropriate to ambient conditions. Higher altitudes may need lower setting.'
        },
        {
          name: 'Low Oil Pressure Shutdown',
          description: 'Oil pressure below which ECM will shutdown engine',
          path: 'Configuration > Protection > Low Oil Pressure Shutdown',
          defaultValue: '69 kPa (10 PSI)',
          range: '55-100 kPa',
          unit: 'kPa',
          affectsWhat: 'Engine protection from bearing damage',
          howToSet: 'Set based on oil viscosity and operating temperature. Thicker oil = higher pressure.'
        }
      ]
    },
    {
      category: 'Communication Settings',
      parameters: [
        {
          name: 'J1939 Source Address',
          description: 'ECM address on J1939 CAN bus',
          path: 'Configuration > Data Link > J1939 Source Address',
          defaultValue: '0',
          range: '0-253',
          unit: 'Decimal address',
          affectsWhat: 'Communication with controller and displays',
          howToSet: 'Primary engine ECM should be 0. Do not conflict with other devices.'
        }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'SAE J1939-71',
    baudRate: 250000,
    sourceAddress: '0x00 (Engine #1)',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine speed, torque, driver demand' },
      { pgn: '65262', name: 'ET1', rate: '1000ms', description: 'Coolant temperature' },
      { pgn: '65263', name: 'EFL/P1', rate: '500ms', description: 'Fuel rate, oil pressure' },
      { pgn: '65270', name: 'IC1', rate: '1000ms', description: 'Intake manifold conditions' },
      { pgn: '65271', name: 'VEP1', rate: '1000ms', description: 'Vehicle electrical power' },
      { pgn: '65226', name: 'DM1', rate: 'On event', description: 'Active diagnostic messages' }
    ],
    receivePGNs: [
      { pgn: '0', name: 'TSC1', description: 'Torque/Speed Control command' },
      { pgn: '61443', name: 'EEC2', description: 'Accelerator pedal position' }
    ],
    terminationResistor: {
      required: true,
      value: '120Ω between CAN_H and CAN_L',
      location: 'At each end of CAN bus (typically ECM and controller)'
    },
    wiringDiagram: `
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                    J1939 CAN BUS WIRING                           ║
    ╠═══════════════════════════════════════════════════════════════════╣
    ║                                                                   ║
    ║  ECM                          CONTROLLER                          ║
    ║  ┌──────┐                     ┌──────────┐                        ║
    ║  │      │ CAN_H (Yellow) ─────│          │                        ║
    ║  │ ECM  │ CAN_L (Green) ──────│Controller│                        ║
    ║  │      │ GND (Black) ────────│          │                        ║
    ║  └──────┘                     └──────────┘                        ║
    ║     │                              │                              ║
    ║   120Ω                           120Ω                             ║
    ║   ├───┤                          ├───┤                            ║
    ║   CAN_H to CAN_L                 CAN_H to CAN_L                   ║
    ║                                                                   ║
    ║  Wire Specifications:                                             ║
    ║  • Use twisted pair cable (CAN_H + CAN_L twisted together)        ║
    ║  • 18-22 AWG wire gauge                                           ║
    ║  • Maximum bus length: 40 meters at 250kbps                       ║
    ║  • Shield connected to ground at ONE end only                     ║
    ╚═══════════════════════════════════════════════════════════════════╝
    `
  },

  troubleshooting: [
    {
      problem: 'Cannot connect to ECM - "No ECM Detected"',
      possibleCauses: [
        'Adapter not properly connected',
        'Key switch not in ON position',
        'ECM power supply problem',
        'Data link wiring open/shorted',
        'Wrong adapter selected in ET'
      ],
      solutions: [
        'Verify adapter USB cable connected to laptop',
        'Check adapter lights (should have power and activity)',
        'Turn key to ON, verify dash lights illuminate',
        'Measure voltage at diagnostic connector Pin F to Pin C (should be 24-28V)',
        'Check for blown fuse in ECM power circuit',
        'Test data link continuity from connector to ECM'
      ]
    },
    {
      problem: 'Programming fails at X%',
      possibleCauses: [
        'Low battery voltage',
        'Loose connection',
        'Wrong flash file for ECM',
        'Corrupted flash file download',
        'ECM hardware fault'
      ],
      solutions: [
        'Check battery voltage - must stay above 22V throughout',
        'Ensure charger is connected and charging',
        'Verify all connections are tight',
        'Re-download flash file from SIS',
        'Verify flash file matches ECM suffix number',
        'Try programming again - sometimes first attempt fails'
      ]
    },
    {
      problem: 'ECM will not start after programming',
      possibleCauses: [
        'Programming interrupted - ECM corrupted',
        'Injector trim codes not entered',
        'Wrong calibration for engine',
        'Engine configuration parameters reset'
      ],
      solutions: [
        'If ECM unresponsive: May need bench reprogramming (send to dealer)',
        'Reconnect ET and check for error codes',
        'Verify engine serial number in ECM matches physical engine',
        'Enter injector trim codes',
        'Set rated speed and power settings',
        'Clear codes and retry start'
      ]
    },
    {
      problem: 'Engine runs rough after programming',
      possibleCauses: [
        'Injector trim codes incorrect',
        'Wrong calibration file',
        'Sensor calibrations lost'
      ],
      solutions: [
        'Verify each injector trim code matches label on injector',
        'Enter codes in FIRING ORDER not physical order',
        'Re-calibrate sensors if equipped (boost sensor, etc.)',
        'Run injector cutout test to identify misfiring cylinder'
      ]
    }
  ],

  safetyWarnings: [
    'NEVER disconnect power during flash programming - will corrupt ECM',
    'Always connect battery charger before programming',
    'Verify engine is not running before connecting to ECM',
    'Keep fire extinguisher nearby when working on fuel system',
    'Disconnect battery before working on ECM wiring',
    'Allow ECM to cool before handling (can reach 80°C)',
    'Flash programming puts ECM in a vulnerable state - ensure stable power'
  ],

  commonMistakes: [
    'Using wrong flash file (always verify engine serial number)',
    'Not backing up ECM before programming (no recovery possible)',
    'Not entering injector trim codes (causes rough running)',
    'Programming with low battery (corrupts ECM)',
    'Disconnecting adapter before programming complete',
    'Not clearing codes after programming (leaves false faults)',
    'Entering injector codes in wrong order'
  ],

  verificationChecklist: [
    'ECM communicates normally with ET',
    'Engine serial number correct in ECM',
    'Rated speed set correctly (1500/1800 RPM)',
    'Rated power matches nameplate',
    'Injector trim codes all entered',
    'No active fault codes',
    'Engine starts and runs at idle',
    'Engine runs at rated speed under load',
    'All temperatures and pressures normal',
    'Controller receives all J1939 data',
    'Document new firmware version in service records'
  ]
};

// ==================== CUMMINS ECM GUIDES ====================

export const CUMMINS_CM2350_GUIDE: ReprogrammingGuide = {
  id: 'cummins-cm2350',
  ecmName: 'Cummins CM2350',
  manufacturer: 'Cummins',
  models: ['CM2350', 'CM2250', 'CM2150', 'CM850'],
  overview: 'The CM2350 ECM controls Cummins QSK and QSX series engines. Programming and calibration is done using Cummins INSITE software. This ECM uses a modular calibration approach where engine data files are separate from the software.',

  prerequisites: {
    tools: [
      {
        name: 'Cummins Inline 7 Adapter',
        description: 'OBD-II style adapter with multiple protocol support',
        alternatives: ['Inline 6', 'Nexiq USB-Link 2 with Cummins license'],
        essential: true
      },
      {
        name: 'Laptop Computer',
        description: 'Windows 10/11, minimum 8GB RAM, SSD recommended',
        essential: true
      },
      {
        name: 'Battery Charger',
        description: '40A or higher for 24V systems',
        essential: true
      }
    ],
    software: [
      {
        name: 'Cummins INSITE',
        version: '8.9 or later',
        source: 'Cummins dealer or QSOL subscription',
        licenseRequired: true,
        alternatives: []
      },
      {
        name: 'Calibration Files',
        version: 'Per engine CPL',
        source: 'QuickServe Online (QSOL)',
        licenseRequired: true
      }
    ],
    parts: ['ECM gasket kit (if removing ECM)', 'Connector pins (if corroded)'],
    conditions: [
      'Engine stopped',
      'Battery voltage 24-28V',
      'Key ON, engine OFF'
    ]
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate Datalink Connector',
      details: 'Cummins engines have a 3-pin datalink connector (older) or 9-pin Deutsch connector (newer). Generator applications typically use the 9-pin connector near the ECM.',
      pinout: [
        { pin: 'A', function: 'J1939/CAN High', wire: 'Yellow' },
        { pin: 'B', function: 'J1939/CAN Low', wire: 'Green' },
        { pin: 'C', function: 'Ground', wire: 'Black' },
        { pin: 'D', function: 'J1708 Data (+)', wire: 'Orange' },
        { pin: 'E', function: 'J1708 Data (-)', wire: 'Green/White' },
        { pin: 'F', function: 'Battery +', wire: 'Red' },
        { pin: 'G', function: 'Not Used', wire: '-' },
        { pin: 'H', function: 'Ground', wire: 'Black' },
        { pin: 'J', function: 'Key Switch', wire: 'Purple' }
      ]
    },
    {
      step: 2,
      action: 'Connect Inline 7 Adapter',
      details: 'Connect Inline 7 to engine datalink connector. Connect USB cable to laptop. Adapter lights should illuminate.',
      warnings: ['Green light = Power', 'Yellow light = Communication activity']
    },
    {
      step: 3,
      action: 'Verify Connection',
      details: 'Turn key to ON. All adapter lights should be active. If not, check power supply.',
      warnings: ['No lights = Check fuse or power at connector']
    }
  ],

  reprogrammingProcedure: [
    {
      step: 1,
      phase: 'preparation',
      action: 'Launch INSITE',
      details: 'Start Cummins INSITE software. Ensure Inline 7 drivers are installed.',
      screenPath: 'Start > Cummins > INSITE Pro',
      expectedResult: 'INSITE opens to main screen',
      timeEstimate: '1 minute',
      criticalNotes: ['Run as Administrator if connection issues occur']
    },
    {
      step: 2,
      phase: 'connection',
      action: 'Connect to ECM',
      details: 'Click "Connect" in INSITE. Select Inline 7 adapter. INSITE will scan for ECM.',
      screenPath: 'Main > Connect > Inline 7',
      expectedResult: 'ECM detected. Engine data displayed.',
      timeEstimate: '30 seconds',
      criticalNotes: ['If multiple ECMs found, select engine ECM (address 0)']
    },
    {
      step: 3,
      phase: 'backup',
      action: 'Read ECM Data',
      details: 'Record current calibration version, engine serial number, and configuration.',
      screenPath: 'ECM > ECM Summary',
      expectedResult: 'All ECM data recorded',
      timeEstimate: '2 minutes',
      criticalNotes: [
        'Screenshot ECM Summary page',
        'Record: Calibration Revision, CPL, Engine Serial',
        'Save fault code history'
      ]
    },
    {
      step: 4,
      phase: 'programming',
      action: 'Download Calibration from QSOL',
      details: 'Using engine serial number, download correct calibration from QuickServe Online.',
      screenPath: 'QSOL > Enter Serial > Downloads > Calibrations',
      expectedResult: 'Calibration file downloaded',
      timeEstimate: '5-10 minutes',
      criticalNotes: [
        'Match engine serial EXACTLY',
        'Download includes software and calibration',
        'Note any feature codes required'
      ]
    },
    {
      step: 5,
      phase: 'programming',
      action: 'Program ECM',
      details: 'In INSITE, go to ECM > Calibration > Download Calibration. Select downloaded file.',
      screenPath: 'ECM > Calibration > Download Calibration',
      expectedResult: 'Programming begins, progress bar shows',
      timeEstimate: '20-35 minutes',
      criticalNotes: [
        'DO NOT interrupt process',
        'Battery voltage must stay above 22V',
        'ECM may restart several times'
      ],
      recoveryAction: 'If failed, INSITE may offer recovery option. If not, ECM needs bench programming.'
    },
    {
      step: 6,
      phase: 'configuration',
      action: 'Set Engine Features',
      details: 'After programming, configure customer parameters.',
      screenPath: 'ECM > Features and Parameters',
      expectedResult: 'All features configured',
      timeEstimate: '10 minutes',
      criticalNotes: [
        'Set rated speed (1500/1800)',
        'Set idle speed',
        'Configure shutdown setpoints',
        'Set J1939 source address'
      ]
    },
    {
      step: 7,
      phase: 'verification',
      action: 'Clear Codes and Test',
      details: 'Clear all fault codes. Start engine and run.',
      screenPath: 'Diagnostics > Clear All Faults',
      expectedResult: 'Engine runs, no fault codes',
      timeEstimate: '10 minutes',
      criticalNotes: ['Monitor parameters during run', 'Check controller receives data']
    }
  ],

  parameterConfiguration: [
    {
      category: 'Speed Settings',
      parameters: [
        {
          name: 'Low Idle Speed',
          description: 'Minimum engine speed at idle',
          path: 'Features > Speed Parameters > Low Idle Speed',
          defaultValue: '700 RPM',
          range: '500-900 RPM',
          unit: 'RPM',
          affectsWhat: 'Minimum engine speed, fuel consumption at idle',
          howToSet: 'Enter value directly. Lower = less fuel, but may be rough.'
        },
        {
          name: 'High Idle Speed',
          description: 'Maximum no-load speed',
          path: 'Features > Speed Parameters > High Idle Speed',
          defaultValue: '1560 RPM (50Hz) / 1880 RPM (60Hz)',
          range: 'Rated +5%',
          unit: 'RPM',
          affectsWhat: 'Generator no-load frequency',
          howToSet: 'Set to rated speed + governor droop compensation.'
        }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'SAE J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine RPM and Torque' },
      { pgn: '65262', name: 'ET1', rate: '1s', description: 'Engine Temperature' },
      { pgn: '65263', name: 'EFL/P1', rate: '500ms', description: 'Engine Fluid Level/Pressure' }
    ],
    receivePGNs: [
      { pgn: '0', name: 'TSC1', description: 'Torque Speed Control' }
    ],
    terminationResistor: {
      required: true,
      value: '120Ω',
      location: 'Both ends of CAN bus'
    },
    wiringDiagram: `
    Standard J1939 wiring with 120Ω termination at each end.
    CAN_H: Yellow wire
    CAN_L: Green wire
    Shield: Connect to ground at ONE end only
    `
  },

  troubleshooting: [
    {
      problem: 'INSITE cannot connect to ECM',
      possibleCauses: ['Wrong adapter', 'Adapter not powered', 'ECM not powered'],
      solutions: ['Check Inline 7 lights', 'Verify key is ON', 'Check ECM fuse']
    },
    {
      problem: 'Calibration download fails',
      possibleCauses: ['Low voltage', 'Wrong file', 'Corrupted download'],
      solutions: ['Check battery', 'Re-download from QSOL', 'Try again']
    }
  ],

  safetyWarnings: [
    'Maintain battery voltage above 24V during programming',
    'Do not disconnect during calibration download',
    'Verify engine serial number before downloading calibration'
  ],

  commonMistakes: [
    'Downloading calibration for wrong engine serial',
    'Not setting features after programming',
    'Programming without battery charger connected'
  ],

  verificationChecklist: [
    'ECM communicates with INSITE',
    'New calibration version displayed',
    'Rated speed set correctly',
    'No active fault codes',
    'Engine starts and runs',
    'Controller receives J1939 data'
  ]
};

// ==================== VOLVO PENTA EMS GUIDE ====================

export const VOLVO_PENTA_EMS2_GUIDE: ReprogrammingGuide = {
  id: 'volvo-ems2',
  ecmName: 'Volvo Penta EMS 2',
  manufacturer: 'Volvo Penta',
  models: ['EMS 2', 'EDC7', 'D11', 'D13', 'D16', 'TAD series'],
  overview: 'Volvo Penta EMS 2 (Engine Management System) controls D-series marine and industrial diesel engines. Programming requires VODIA diagnostic software with proper licensing. This guide covers firmware updates and parameter configuration for generator applications.',

  prerequisites: {
    tools: [
      { name: 'VODIA Diagnostic Adapter', description: '88890300 adapter or compatible J1939 interface', alternatives: ['88890020 older adapter', 'Nexiq USB-Link with Volvo license'], essential: true },
      { name: 'Laptop Computer', description: 'Windows 10/11, 8GB RAM minimum, USB 2.0/3.0', essential: true },
      { name: 'Battery Charger', description: '40A minimum for 24V systems', essential: true },
      { name: 'Multimeter', description: 'For voltage verification', essential: true }
    ],
    software: [
      { name: 'VODIA5/VODIA6', version: 'Latest version', source: 'Volvo Penta dealer portal', licenseRequired: true },
      { name: 'Parameter Files', version: 'Per engine serial', source: 'VODIA online database', licenseRequired: true }
    ],
    parts: ['Connector sealing kit', 'J1939 termination resistor if needed'],
    conditions: ['Engine stopped', 'Battery 24-28V', 'Key ON', 'Coolant temp < 40°C']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate Diagnostic Connector',
      details: 'The diagnostic connector is typically a 14-pin Deutsch connector located near the EMS unit or in the wiring junction box.',
      pinout: [
        { pin: '1', function: 'J1939 CAN High', wire: 'Yellow' },
        { pin: '2', function: 'J1939 CAN Low', wire: 'Green' },
        { pin: '3', function: 'Ground', wire: 'Black' },
        { pin: '4', function: 'Battery +24V', wire: 'Red' },
        { pin: '5', function: 'ISO 9141 K-Line', wire: 'White' }
      ]
    },
    {
      step: 2,
      action: 'Connect VODIA Adapter',
      details: 'Connect adapter to diagnostic port. LED should illuminate indicating power. Connect USB to laptop.',
      voltage: 'Verify 24V at connector before connecting adapter'
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Launch VODIA', details: 'Start VODIA software, select adapter, verify license is active', screenPath: 'Start > VODIA5 > Connect', expectedResult: 'VODIA opens with adapter detected', timeEstimate: '2 minutes', criticalNotes: ['Ensure internet connection for license verification'] },
    { step: 2, phase: 'connection', action: 'Connect to EMS', details: 'Turn key ON, click Connect in VODIA. Select engine type if prompted.', expectedResult: 'EMS detected, engine data displayed', timeEstimate: '1 minute', criticalNotes: ['Multiple ECMs may appear - select Engine'] },
    { step: 3, phase: 'backup', action: 'Read Current Configuration', details: 'Go to Read ECU > Save to file. Name with serial and date.', expectedResult: 'Configuration saved to laptop', timeEstimate: '3 minutes', criticalNotes: ['CRITICAL: Always backup before programming'] },
    { step: 4, phase: 'programming', action: 'Download Update', details: 'VODIA will check for available updates for your engine serial.', expectedResult: 'Update package downloaded', timeEstimate: '5-10 minutes', criticalNotes: ['Verify serial number matches engine'] },
    { step: 5, phase: 'programming', action: 'Flash ECM', details: 'Select Programming > Download to ECM. Battery charger MUST be connected.', expectedResult: 'Programming begins with progress bar', timeEstimate: '15-25 minutes', criticalNotes: ['DO NOT INTERRUPT', 'Battery voltage must stay above 22V', 'ECM will restart multiple times'] },
    { step: 6, phase: 'configuration', action: 'Configure Parameters', details: 'Set rated speed, power limits, protection setpoints', expectedResult: 'Parameters saved to ECM', timeEstimate: '10 minutes', criticalNotes: ['Verify settings match application requirements'] },
    { step: 7, phase: 'verification', action: 'Test Run', details: 'Clear codes, start engine, run at idle then rated speed', expectedResult: 'Engine runs normally, no fault codes', timeEstimate: '15 minutes', criticalNotes: ['Monitor all parameters during test'] }
  ],

  parameterConfiguration: [
    {
      category: 'Engine Speed',
      parameters: [
        { name: 'Rated Speed', description: 'Generator synchronous speed', path: 'Parameters > Speed > Rated Speed', defaultValue: '1500 RPM (50Hz)', range: '1500-1800 RPM', unit: 'RPM', affectsWhat: 'Generator frequency', howToSet: 'Select 1500 for 50Hz or 1800 for 60Hz generators' },
        { name: 'Idle Speed', description: 'Engine idle speed', path: 'Parameters > Speed > Idle Speed', defaultValue: '700 RPM', range: '600-900 RPM', unit: 'RPM', affectsWhat: 'Fuel consumption at idle', howToSet: 'Set based on engine model recommendations' }
      ]
    },
    {
      category: 'Protection',
      parameters: [
        { name: 'High Coolant Temp Shutdown', description: 'Shutdown temperature', path: 'Parameters > Protection > High Temp', defaultValue: '105°C', range: '95-110°C', unit: '°C', affectsWhat: 'Overheating protection', howToSet: 'Set based on radiator capacity and ambient conditions' },
        { name: 'Low Oil Pressure Shutdown', description: 'Minimum oil pressure', path: 'Parameters > Protection > Low Oil', defaultValue: '100 kPa', range: '70-150 kPa', unit: 'kPa', affectsWhat: 'Engine bearing protection', howToSet: 'Factory default usually appropriate' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'SAE J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine speed, torque' },
      { pgn: '65262', name: 'ET1', rate: '1s', description: 'Engine temperatures' },
      { pgn: '65263', name: 'EFL/P1', rate: '500ms', description: 'Fluid levels and pressures' },
      { pgn: '65226', name: 'DM1', rate: 'On event', description: 'Diagnostic messages' }
    ],
    receivePGNs: [
      { pgn: '0', name: 'TSC1', description: 'Torque/Speed Control' }
    ],
    terminationResistor: { required: true, value: '120Ω', location: 'At each end of CAN bus' },
    wiringDiagram: 'Standard J1939: Yellow=CAN_H, Green=CAN_L, 120Ω termination at both ends'
  },

  troubleshooting: [
    { problem: 'VODIA cannot find ECM', possibleCauses: ['Adapter not connected', 'Wrong adapter selected', 'ECM not powered'], solutions: ['Check adapter LED', 'Verify key is ON', 'Check ECM fuse'] },
    { problem: 'Programming fails', possibleCauses: ['Low voltage', 'Wrong file', 'Connection lost'], solutions: ['Check battery charger', 'Verify serial number', 'Retry programming'] }
  ],

  safetyWarnings: ['Never interrupt programming', 'Maintain battery voltage above 22V', 'Ensure engine cannot start during ECM access'],
  commonMistakes: ['Programming without battery charger', 'Using wrong parameter file', 'Not backing up before programming'],
  verificationChecklist: ['ECM communicates', 'New firmware version shown', 'Rated speed correct', 'No active faults', 'Engine starts and runs', 'J1939 data received by controller']
};

// ==================== PERKINS ECM GUIDE ====================

export const PERKINS_ECM_GUIDE: ReprogrammingGuide = {
  id: 'perkins-ecm',
  ecmName: 'Perkins EST-37/EST-39',
  manufacturer: 'Perkins',
  models: ['1100 Series', '1200 Series', '1500 Series', '2000 Series', '2500 Series', '4000 Series'],
  overview: 'Perkins engines use Electronic Service Tool (EST) for diagnostics and programming. EST-37 covers Tier 3 engines while EST-39 covers Tier 4. Programming requires proper licensing and connectivity through Perkins adapter.',

  prerequisites: {
    tools: [
      { name: 'Perkins Diagnostic Adapter', description: 'EST adapter or compatible RP1210 interface', alternatives: ['Nexiq USB-Link 2', 'DPA5'], essential: true },
      { name: 'Laptop', description: 'Windows 10/11, 8GB RAM', essential: true },
      { name: 'Battery Charger', description: '40A for 24V systems', essential: true }
    ],
    software: [
      { name: 'EST (Electronic Service Tool)', version: '2023A or later', source: 'Perkins SPI2 subscription', licenseRequired: true },
      { name: 'Flash Files', version: 'Per engine serial', source: 'Perkins SPI2', licenseRequired: true }
    ],
    parts: ['Connector kit if damaged'],
    conditions: ['Engine stopped', 'Battery 24-28V', 'Key ON']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate Diagnostic Port',
      details: 'Perkins diagnostic connector is typically a 9-pin Deutsch near the ECM',
      pinout: [
        { pin: 'A', function: 'J1939 CAN High', wire: 'Yellow' },
        { pin: 'B', function: 'J1939 CAN Low', wire: 'Green' },
        { pin: 'C', function: 'Ground', wire: 'Black' },
        { pin: 'F', function: 'Battery +', wire: 'Red' }
      ]
    },
    {
      step: 2,
      action: 'Connect Adapter',
      details: 'Connect adapter to port, USB to laptop. Verify adapter lights.',
      warnings: ['Check for moisture in connector before connecting']
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Launch EST', details: 'Start Perkins EST, verify adapter connection', expectedResult: 'EST opens ready to connect', timeEstimate: '1 minute', criticalNotes: ['Run as administrator if issues'] },
    { step: 2, phase: 'connection', action: 'Connect to ECM', details: 'Turn key ON, click Connect', expectedResult: 'ECM detected with engine info', timeEstimate: '30 seconds', criticalNotes: ['Verify engine serial matches'] },
    { step: 3, phase: 'backup', action: 'Backup ECM', details: 'Tools > Backup ECM Configuration', expectedResult: 'Backup file saved', timeEstimate: '2 minutes', criticalNotes: ['ALWAYS backup before any changes'] },
    { step: 4, phase: 'programming', action: 'Download Flash', details: 'Access SPI2 through EST, enter serial, download flash package', expectedResult: 'Flash file ready', timeEstimate: '10 minutes', criticalNotes: ['Verify engine serial exactly'] },
    { step: 5, phase: 'programming', action: 'Program ECM', details: 'Service > Flash Programming > Select File', expectedResult: 'Programming complete', timeEstimate: '20-30 minutes', criticalNotes: ['DO NOT INTERRUPT', 'Battery charger must be connected'] },
    { step: 6, phase: 'configuration', action: 'Set Parameters', details: 'Configure rated speed, protection limits', expectedResult: 'Parameters saved', timeEstimate: '10 minutes', criticalNotes: ['Match to generator requirements'] },
    { step: 7, phase: 'verification', action: 'Test', details: 'Clear codes, start engine, verify operation', expectedResult: 'Engine runs normally', timeEstimate: '15 minutes', criticalNotes: ['Monitor all parameters'] }
  ],

  parameterConfiguration: [
    {
      category: 'Speed Settings',
      parameters: [
        { name: 'Rated Speed', description: 'Generator speed', path: 'Configuration > Speed', defaultValue: '1500/1800 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Generator frequency', howToSet: 'Select based on grid frequency' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'SAE J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine speed/torque' },
      { pgn: '65262', name: 'ET1', rate: '1s', description: 'Temperatures' }
    ],
    receivePGNs: [{ pgn: '0', name: 'TSC1', description: 'Torque control' }],
    terminationResistor: { required: true, value: '120Ω', location: 'Both ends' },
    wiringDiagram: 'J1939 standard wiring with 120Ω termination'
  },

  troubleshooting: [
    { problem: 'Cannot connect', possibleCauses: ['Adapter issue', 'ECM not powered'], solutions: ['Check adapter', 'Verify key ON'] }
  ],

  safetyWarnings: ['Maintain 24V during programming', 'Do not disconnect during flash'],
  commonMistakes: ['Wrong flash file', 'No backup', 'Low battery'],
  verificationChecklist: ['ECM connects', 'New version shown', 'No faults', 'Engine runs']
};

// ==================== JOHN DEERE POWERTECH GUIDE ====================

export const JOHN_DEERE_POWERTECH_GUIDE: ReprogrammingGuide = {
  id: 'john-deere-powertech',
  ecmName: 'John Deere PowerTech ECU',
  manufacturer: 'John Deere',
  models: ['PowerTech E', 'PowerTech M', 'PowerTech Plus', '4045', '6068', '6090', '4.5L', '6.8L', '9.0L'],
  overview: 'John Deere PowerTech series engines use Service ADVISOR for diagnostics and programming. This covers the ECU calibration and parameter settings for generator applications.',

  prerequisites: {
    tools: [
      { name: 'John Deere Service ADVISOR Adapter', description: 'EDL v3 adapter', alternatives: ['Compatible RP1210 adapter'], essential: true },
      { name: 'Laptop', description: 'Windows 10, 8GB RAM', essential: true },
      { name: 'Battery Charger', description: '40A for 24V systems', essential: true }
    ],
    software: [
      { name: 'Service ADVISOR', version: '5.3 or later', source: 'John Deere dealer subscription', licenseRequired: true },
      { name: 'PayLoad Files', version: 'Per engine serial', source: 'John Deere DTF', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Engine stopped', 'Battery charged', 'Key ON']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate Diagnostic Connector',
      details: 'Located near ECU, typically 9-pin Deutsch',
      pinout: [
        { pin: 'A', function: 'CAN High', wire: 'Yellow' },
        { pin: 'B', function: 'CAN Low', wire: 'Green' },
        { pin: 'C', function: 'Ground', wire: 'Black' },
        { pin: 'F', function: 'Power', wire: 'Red' }
      ]
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Start Service ADVISOR', details: 'Launch software, verify EDL connection', expectedResult: 'Software ready', timeEstimate: '2 min', criticalNotes: [] },
    { step: 2, phase: 'connection', action: 'Connect to ECU', details: 'Key ON, connect', expectedResult: 'ECU found', timeEstimate: '1 min', criticalNotes: [] },
    { step: 3, phase: 'backup', action: 'Backup', details: 'Save current configuration', expectedResult: 'Backup saved', timeEstimate: '3 min', criticalNotes: ['Always backup'] },
    { step: 4, phase: 'programming', action: 'Download PayLoad', details: 'Get calibration file from DTF', expectedResult: 'File ready', timeEstimate: '10 min', criticalNotes: ['Verify serial'] },
    { step: 5, phase: 'programming', action: 'Program ECU', details: 'Flash new calibration', expectedResult: 'Programming complete', timeEstimate: '20 min', criticalNotes: ['Do not interrupt'] },
    { step: 6, phase: 'verification', action: 'Test', details: 'Run engine', expectedResult: 'Normal operation', timeEstimate: '10 min', criticalNotes: [] }
  ],

  parameterConfiguration: [
    {
      category: 'Engine',
      parameters: [
        { name: 'Rated Speed', description: 'Target speed', path: 'Parameters > Speed', defaultValue: '1500 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Frequency', howToSet: 'Select based on application' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine data' }
    ],
    receivePGNs: [],
    terminationResistor: { required: true, value: '120Ω', location: 'Both ends' },
    wiringDiagram: 'Standard J1939'
  },

  troubleshooting: [
    { problem: 'No communication', possibleCauses: ['Adapter issue'], solutions: ['Check connections'] }
  ],

  safetyWarnings: ['Maintain power during programming'],
  commonMistakes: ['Wrong PayLoad file'],
  verificationChecklist: ['ECU connects', 'Engine runs']
};

// ==================== MTU ADEC GUIDE ====================

export const MTU_ADEC_GUIDE: ReprogrammingGuide = {
  id: 'mtu-adec',
  ecmName: 'MTU ADEC (Advanced Diesel Engine Control)',
  manufacturer: 'MTU',
  models: ['ADEC', 'MDEC', 'Series 2000', 'Series 4000', '8V', '12V', '16V', '20V'],
  overview: 'MTU ADEC systems control large diesel engines for power generation. Programming uses MTU Diesel Diagnostic System (DDS) or ECOS. These are sophisticated systems requiring proper training and licensing.',

  prerequisites: {
    tools: [
      { name: 'MTU Diagnostic Interface (MDI)', description: 'Official MTU adapter', alternatives: ['RP1210 compatible with MTU protocol'], essential: true },
      { name: 'Laptop', description: 'Windows, min 16GB RAM for large engines', essential: true },
      { name: 'Battery Charger', description: 'Heavy duty for 24V systems', essential: true }
    ],
    software: [
      { name: 'MTU DDS (Diesel Diagnostic System)', version: 'Current version', source: 'MTU ValueCare subscription', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Engine stopped', 'Full battery charge', 'Key ON']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Locate ECM Connection',
      details: 'MTU uses proprietary connectors near the ADEC unit',
      pinout: [
        { pin: '1', function: 'CAN High', wire: 'Yellow' },
        { pin: '2', function: 'CAN Low', wire: 'Green' },
        { pin: '3', function: 'Ground', wire: 'Black' },
        { pin: '4', function: 'Power', wire: 'Red' }
      ]
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Launch DDS', details: 'Start diagnostic software', expectedResult: 'Ready', timeEstimate: '2 min', criticalNotes: ['Requires active license'] },
    { step: 2, phase: 'connection', action: 'Connect', details: 'Connect to ADEC', expectedResult: 'ADEC found', timeEstimate: '1 min', criticalNotes: [] },
    { step: 3, phase: 'backup', action: 'Backup', details: 'Save configuration', expectedResult: 'Backup complete', timeEstimate: '5 min', criticalNotes: ['Essential step'] },
    { step: 4, phase: 'programming', action: 'Program', details: 'Flash new firmware', expectedResult: 'Complete', timeEstimate: '30-45 min', criticalNotes: ['Large engines take longer', 'Do not interrupt'] },
    { step: 5, phase: 'verification', action: 'Verify', details: 'Run engine', expectedResult: 'Normal operation', timeEstimate: '20 min', criticalNotes: [] }
  ],

  parameterConfiguration: [
    {
      category: 'Engine',
      parameters: [
        { name: 'Rated Speed', description: 'Sync speed', path: 'Engine > Speed', defaultValue: '1500 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Output frequency', howToSet: 'Configure for grid' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine parameters' },
      { pgn: '65262', name: 'ET1', rate: '1s', description: 'Temperatures' }
    ],
    receivePGNs: [],
    terminationResistor: { required: true, value: '120Ω', location: 'Ends of bus' },
    wiringDiagram: 'J1939 standard'
  },

  troubleshooting: [
    { problem: 'Communication failure', possibleCauses: ['License expired', 'Adapter issue'], solutions: ['Check license', 'Verify connections'] }
  ],

  safetyWarnings: ['Large engines - follow all safety procedures', 'Maintain power supply'],
  commonMistakes: ['Insufficient backup power for long programming'],
  verificationChecklist: ['ADEC responds', 'New firmware verified', 'All parameters set', 'Engine runs smoothly']
};

// ==================== DETROIT DIESEL GUIDE ====================

export const DETROIT_DIESEL_GUIDE: ReprogrammingGuide = {
  id: 'detroit-ddec',
  ecmName: 'Detroit Diesel DDEC (Detroit Diesel Electronic Control)',
  manufacturer: 'Detroit Diesel',
  models: ['DDEC III', 'DDEC IV', 'DDEC V', 'DDEC VI', 'Series 60', 'DD13', 'DD15', 'DD16'],
  overview: 'Detroit Diesel DDEC systems have evolved from DDEC III through DDEC VI. Programming is done through Detroit Diesel Diagnostic Link (DDDL) software. Generator applications typically use Series 60 or newer DD engines.',

  prerequisites: {
    tools: [
      { name: 'Nexiq USB-Link 2', description: 'RP1210 adapter with Detroit protocol', alternatives: ['Detroit specific adapter'], essential: true },
      { name: 'Laptop', description: 'Windows 10, 8GB RAM', essential: true },
      { name: 'Battery Charger', description: '40A', essential: true }
    ],
    software: [
      { name: 'DDDL (Detroit Diesel Diagnostic Link)', version: '8.x or later', source: 'Daimler dealer subscription', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Engine off', 'Battery charged', 'Key ON']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Find Diagnostic Port',
      details: '6-pin or 9-pin Deutsch connector',
      pinout: [
        { pin: 'A', function: 'J1939 CAN_H', wire: 'Yellow' },
        { pin: 'B', function: 'J1939 CAN_L', wire: 'Green' },
        { pin: 'C', function: 'Ground', wire: 'Black' },
        { pin: 'D', function: 'J1708 +', wire: 'Orange' },
        { pin: 'E', function: 'J1708 -', wire: 'Green/White' },
        { pin: 'F', function: 'Battery +', wire: 'Red' }
      ]
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Start DDDL', details: 'Launch Detroit software', expectedResult: 'Ready', timeEstimate: '2 min', criticalNotes: [] },
    { step: 2, phase: 'connection', action: 'Connect', details: 'Key ON, connect to DDEC', expectedResult: 'DDEC found', timeEstimate: '1 min', criticalNotes: [] },
    { step: 3, phase: 'backup', action: 'Read ECM', details: 'Backup current configuration', expectedResult: 'Saved', timeEstimate: '3 min', criticalNotes: ['Always backup'] },
    { step: 4, phase: 'programming', action: 'Flash ECM', details: 'Download new calibration', expectedResult: 'Complete', timeEstimate: '20 min', criticalNotes: ['Do not interrupt'] },
    { step: 5, phase: 'verification', action: 'Test Run', details: 'Start and run engine', expectedResult: 'Normal', timeEstimate: '10 min', criticalNotes: [] }
  ],

  parameterConfiguration: [
    {
      category: 'Speed',
      parameters: [
        { name: 'Rated Speed', description: 'Generator speed', path: 'Parameters > Speed', defaultValue: '1500 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Frequency', howToSet: 'Set for grid' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine data' }
    ],
    receivePGNs: [],
    terminationResistor: { required: true, value: '120Ω', location: 'Both ends' },
    wiringDiagram: 'J1939 standard wiring'
  },

  troubleshooting: [
    { problem: 'No connection', possibleCauses: ['Protocol mismatch', 'Adapter'], solutions: ['Check J1939/J1708 settings'] }
  ],

  safetyWarnings: ['Maintain power during flash'],
  commonMistakes: ['Using J1708 when J1939 needed'],
  verificationChecklist: ['DDEC responds', 'Firmware updated', 'Engine runs']
};

// ==================== SCANIA EMS GUIDE ====================

export const SCANIA_EMS_GUIDE: ReprogrammingGuide = {
  id: 'scania-ems',
  ecmName: 'Scania EMS (Engine Management System)',
  manufacturer: 'Scania',
  models: ['EMS S6', 'EMS S7', 'EMS S8', 'DC09', 'DC13', 'DC16', '9-liter', '13-liter', '16-liter'],
  overview: 'Scania industrial engines use EMS for engine control. Diagnostics and programming are done through SDP3 (Scania Diagnos & Programmer 3) software.',

  prerequisites: {
    tools: [
      { name: 'Scania VCI3', description: 'Vehicle Communication Interface', alternatives: [], essential: true },
      { name: 'Laptop', description: 'Windows 10, 8GB RAM', essential: true },
      { name: 'Battery Charger', description: '40A', essential: true }
    ],
    software: [
      { name: 'SDP3', version: 'Current version', source: 'Scania dealer subscription', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Engine stopped', 'Key ON', 'Battery charged']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Connect VCI3',
      details: 'Connect to 16-pin OBD connector or engine harness connector',
      pinout: [
        { pin: '6', function: 'CAN High', wire: 'Yellow' },
        { pin: '14', function: 'CAN Low', wire: 'Green' },
        { pin: '4-5', function: 'Ground', wire: 'Black' },
        { pin: '16', function: 'Battery +', wire: 'Red' }
      ]
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Start SDP3', details: 'Launch Scania software', expectedResult: 'Ready', timeEstimate: '2 min', criticalNotes: [] },
    { step: 2, phase: 'connection', action: 'Connect', details: 'Connect to EMS', expectedResult: 'EMS found', timeEstimate: '1 min', criticalNotes: [] },
    { step: 3, phase: 'backup', action: 'Backup', details: 'Save configuration', expectedResult: 'Saved', timeEstimate: '3 min', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Program', details: 'Flash new software', expectedResult: 'Complete', timeEstimate: '25 min', criticalNotes: ['Maintain power'] },
    { step: 5, phase: 'verification', action: 'Test', details: 'Run engine', expectedResult: 'Normal', timeEstimate: '10 min', criticalNotes: [] }
  ],

  parameterConfiguration: [
    {
      category: 'Engine',
      parameters: [
        { name: 'Rated Speed', description: 'Sync speed', path: 'Configuration > Speed', defaultValue: '1500 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Generator frequency', howToSet: 'Set based on grid' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine speed/torque' }
    ],
    receivePGNs: [],
    terminationResistor: { required: true, value: '120Ω', location: 'Both ends' },
    wiringDiagram: 'J1939 standard'
  },

  troubleshooting: [
    { problem: 'VCI3 not found', possibleCauses: ['Driver issue'], solutions: ['Reinstall VCI3 drivers'] }
  ],

  safetyWarnings: ['Follow Scania safety procedures'],
  commonMistakes: ['Incorrect software version'],
  verificationChecklist: ['EMS connected', 'Programming complete', 'Engine operational']
};

// ==================== DEUTZ EMR GUIDE ====================

export const DEUTZ_EMR_GUIDE: ReprogrammingGuide = {
  id: 'deutz-emr',
  ecmName: 'Deutz EMR (Electronic Engine Management)',
  manufacturer: 'Deutz',
  models: ['EMR2', 'EMR3', 'EMR4', 'TCD 2.9', 'TCD 3.6', 'TCD 4.1', 'TCD 6.1', 'TCD 7.8', 'TCD 12.0', 'TCD 16.0'],
  overview: 'Deutz EMR systems manage fuel injection timing and quantity for optimal performance. SerDia (Service Diagnostic) software is used for programming and diagnostics.',

  prerequisites: {
    tools: [
      { name: 'Deutz Interface', description: 'USB diagnostic interface', alternatives: ['Compatible J1939 adapter'], essential: true },
      { name: 'Laptop', description: 'Windows 10', essential: true },
      { name: 'Battery Charger', description: '40A', essential: true }
    ],
    software: [
      { name: 'SerDia', version: 'Current version', source: 'Deutz service portal', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Engine stopped', 'Key ON']
  },

  connectionProcedure: [
    {
      step: 1,
      action: 'Connect Interface',
      details: 'Connect to diagnostic port on engine',
      pinout: [
        { pin: '1', function: 'CAN High', wire: 'Yellow' },
        { pin: '2', function: 'CAN Low', wire: 'Green' },
        { pin: '3', function: 'Ground', wire: 'Black' }
      ]
    }
  ],

  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Start SerDia', details: 'Launch software', expectedResult: 'Ready', timeEstimate: '1 min', criticalNotes: [] },
    { step: 2, phase: 'connection', action: 'Connect', details: 'Connect to EMR', expectedResult: 'Connected', timeEstimate: '1 min', criticalNotes: [] },
    { step: 3, phase: 'backup', action: 'Backup', details: 'Save current settings', expectedResult: 'Saved', timeEstimate: '2 min', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Program', details: 'Flash calibration', expectedResult: 'Complete', timeEstimate: '15 min', criticalNotes: [] },
    { step: 5, phase: 'verification', action: 'Test', details: 'Run engine', expectedResult: 'Normal', timeEstimate: '10 min', criticalNotes: [] }
  ],

  parameterConfiguration: [
    {
      category: 'Engine',
      parameters: [
        { name: 'Rated Speed', description: 'Operating speed', path: 'Engine > Speed', defaultValue: '1500 RPM', range: '1500-1800', unit: 'RPM', affectsWhat: 'Output', howToSet: 'Configure' }
      ]
    }
  ],

  j1939Setup: {
    protocol: 'J1939',
    baudRate: 250000,
    sourceAddress: '0x00',
    transmitPGNs: [
      { pgn: '61444', name: 'EEC1', rate: '10ms', description: 'Engine data' }
    ],
    receivePGNs: [],
    terminationResistor: { required: true, value: '120Ω', location: 'Both ends' },
    wiringDiagram: 'Standard J1939'
  },

  troubleshooting: [
    { problem: 'No communication', possibleCauses: ['Interface issue'], solutions: ['Check connections'] }
  ],

  safetyWarnings: ['Maintain power during programming'],
  commonMistakes: ['Wrong calibration file'],
  verificationChecklist: ['EMR responds', 'Engine runs']
};

// ==================== YANMAR ECM GUIDE ====================
export const YANMAR_ECM_GUIDE: ReprogrammingGuide = {
  id: 'yanmar-ecu',
  ecmName: 'Yanmar ECU / EMS',
  manufacturer: 'Yanmar',
  models: ['TNV Series', '4TNV88', '4TNV94', '4TNV98', '4TNV106', '3TNV76', '3TNV82', '3TNV84', '3TNV88', 'BY Series', '4BY', '6BY', '4LHA', '6LY'],
  overview: 'Yanmar electronic control systems for diesel engines. Uses proprietary YDT (Yanmar Diagnostic Tool) or compatible J1939 interfaces for programming and diagnostics.',
  prerequisites: {
    tools: [
      { name: 'Yanmar Diagnostic Tool (YDT)', description: 'Official Yanmar diagnostic interface', alternatives: ['DPA5 with Yanmar license', 'Jaltest'], essential: true },
      { name: '9-Pin Deutsch Connector', description: 'J1939 diagnostic connector', essential: true },
      { name: 'Laptop with YDT Software', description: 'Windows PC with diagnostic software', essential: true },
      { name: 'Battery Charger', description: 'Maintain 24V during programming', essential: true }
    ],
    software: [
      { name: 'Yanmar Diagnostic Tool Software', version: 'Latest', source: 'Yanmar Dealer', licenseRequired: true, alternatives: ['Jaltest Marine/Industrial'] }
    ],
    parts: ['Backup fuse kit'],
    conditions: ['Engine at operating temperature', 'Battery fully charged (>25V)', 'All accessories off']
  },
  connectionProcedure: [
    { step: 1, action: 'Locate 9-pin diagnostic connector', details: 'Usually near ECU or in engine compartment', pinout: [
      { pin: 'A', function: 'CAN-H (J1939)', wire: 'Yellow' },
      { pin: 'B', function: 'CAN-L (J1939)', wire: 'Green' },
      { pin: 'C', function: 'Ground', wire: 'Black' },
      { pin: 'J', function: '+12V/24V Power', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect YDT interface', details: 'Plug diagnostic tool into 9-pin connector' },
    { step: 3, action: 'Turn ignition ON', details: 'Do not start engine for initial connection' },
    { step: 4, action: 'Launch YDT software', details: 'Wait for ECU detection (10-30 seconds)' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Connect battery charger', details: 'Ensure stable 24V supply throughout process', expectedResult: 'Voltage stable at 25-28V', timeEstimate: '2 minutes', criticalNotes: ['Power interruption will corrupt ECU'] },
    { step: 2, phase: 'backup', action: 'Read and save current ECU data', details: 'YDT > ECU > Read All Data > Save to file', expectedResult: 'Complete backup file saved', timeEstimate: '5 minutes', criticalNotes: ['Store backup in safe location'] },
    { step: 3, phase: 'programming', action: 'Select programming function', details: 'Navigate to ECU Reprogramming menu', expectedResult: 'Programming mode active', timeEstimate: '2 minutes', criticalNotes: ['Do not disconnect during this phase'] },
    { step: 4, phase: 'programming', action: 'Upload new calibration', details: 'Select appropriate calibration file for engine model', expectedResult: 'Programming progress 100%', timeEstimate: '10-20 minutes', criticalNotes: ['Must use correct calibration for engine model'] },
    { step: 5, phase: 'verification', action: 'Verify programming', details: 'Read back ECU data and compare', expectedResult: 'Calibration matches uploaded file', timeEstimate: '5 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Engine Protection', parameters: [
      { name: 'High Coolant Temp Shutdown', description: 'Temperature at which engine shuts down', path: 'Protection > Coolant > Shutdown Temp', defaultValue: '105°C', range: '95-115°C', unit: '°C' },
      { name: 'Low Oil Pressure Shutdown', description: 'Oil pressure shutdown threshold', path: 'Protection > Oil > Low Pressure', defaultValue: '0.8 bar', range: '0.5-1.5 bar', unit: 'bar' },
      { name: 'Overspeed Shutdown', description: 'RPM limit for overspeed protection', path: 'Protection > Speed > Overspeed', defaultValue: '2800 RPM', range: '2200-3200 RPM', unit: 'RPM' }
    ]},
    { category: 'Governor', parameters: [
      { name: 'Rated Speed', description: 'Target operating speed', path: 'Governor > Rated Speed', defaultValue: '1500/1800 RPM', range: '1400-2000 RPM', unit: 'RPM' },
      { name: 'Idle Speed', description: 'Engine idle speed', path: 'Governor > Idle', defaultValue: '700 RPM', range: '600-900 RPM', unit: 'RPM' },
      { name: 'Droop', description: 'Speed droop percentage', path: 'Governor > Droop', defaultValue: '4%', range: '0-10%', unit: '%' }
    ]}
  ],
  j1939Setup: {
    sourceAddress: 0,
    baudRate: 250000,
    supportedPGNs: [61444, 65262, 65263, 65270, 65271]
  },
  troubleshooting: [
    { problem: 'YDT cannot detect ECU', causes: ['Wrong baud rate', 'CAN wiring fault', 'ECU not powered'], solutions: ['Check 9-pin connector wiring', 'Verify battery voltage', 'Check CAN termination'] },
    { problem: 'Programming fails at XX%', causes: ['Power interruption', 'Wrong calibration file', 'ECU hardware fault'], solutions: ['Check battery charger', 'Verify calibration matches engine', 'Try again with stable power'] }
  ],
  safetyWarnings: ['Never disconnect power during programming', 'Use correct calibration file only', 'Backup before any changes'],
  commonMistakes: ['Using calibration for wrong engine model', 'Insufficient battery voltage', 'Not saving backup first'],
  verificationChecklist: ['ECU communicates normally', 'No active fault codes', 'Engine starts and runs', 'All sensors reading correctly']
};

// ==================== DOOSAN ECM GUIDE ====================
export const DOOSAN_ECM_GUIDE: ReprogrammingGuide = {
  id: 'doosan-ecu',
  ecmName: 'Doosan ECU / D-ECON',
  manufacturer: 'Doosan',
  models: ['DL06', 'DL08', 'DV11', 'DV15', 'DP086', 'DP126', 'DP158', 'DP180', 'DP222', 'DX Series', 'G2 Engine', 'G3 Engine'],
  overview: 'Doosan D-ECON electronic control system. Common in Doosan/Daewoo generators and industrial equipment. Uses DoosanCONNECT or compatible diagnostic tools.',
  prerequisites: {
    tools: [
      { name: 'DoosanCONNECT Diagnostic Tool', description: 'Official Doosan diagnostic interface', alternatives: ['Texa', 'Jaltest'], essential: true },
      { name: 'CAN Interface Cable', description: 'J1939/CAN diagnostic cable', essential: true },
      { name: 'Laptop PC', description: 'Windows computer for diagnostics', essential: true }
    ],
    software: [
      { name: 'DoosanCONNECT Software', version: '2.x or higher', source: 'Doosan Dealer Portal', licenseRequired: true }
    ],
    parts: ['ECU fuse kit', 'Diagnostic connector if damaged'],
    conditions: ['Battery voltage 24V minimum', 'Engine coolant below 40°C for cold tests']
  },
  connectionProcedure: [
    { step: 1, action: 'Locate diagnostic port', details: 'Typically 9-pin Deutsch connector near ECU or on engine harness', pinout: [
      { pin: 'A', function: 'CAN High', wire: 'Yellow' },
      { pin: 'B', function: 'CAN Low', wire: 'Green' },
      { pin: 'C', function: 'Chassis Ground', wire: 'Black' },
      { pin: 'F', function: 'J1708 Data+', wire: 'White' },
      { pin: 'G', function: 'J1708 Data-', wire: 'Blue' },
      { pin: 'J', function: '+24V Battery', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect diagnostic interface', details: 'Plug CAN adapter into diagnostic port' },
    { step: 3, action: 'Key ON, Engine OFF', details: 'Turn ignition to ON position without starting' },
    { step: 4, action: 'Launch DoosanCONNECT', details: 'Auto-detect should find ECU within 30 seconds' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Verify battery condition', details: 'Battery must be >24V and fully charged', expectedResult: 'Voltage reads 24-28V DC', timeEstimate: '2 minutes', criticalNotes: ['Connect battery charger for safety'] },
    { step: 2, phase: 'backup', action: 'Save current configuration', details: 'ECU > Read Configuration > Export to file', expectedResult: 'Configuration file saved', timeEstimate: '3 minutes', criticalNotes: ['Essential for recovery if needed'] },
    { step: 3, phase: 'backup', action: 'Record fault code history', details: 'Save active and historical fault codes', expectedResult: 'Fault history documented', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Enter programming mode', details: 'Service > ECU Programming > Enable', expectedResult: 'ECU in programming mode', timeEstimate: '1 minute', criticalNotes: ['Do not turn off key during programming'] },
    { step: 5, phase: 'programming', action: 'Flash new calibration', details: 'Select and upload calibration file', expectedResult: 'Programming complete 100%', timeEstimate: '15-25 minutes', criticalNotes: ['Must complete without interruption'] },
    { step: 6, phase: 'verification', action: 'Verify and test', details: 'Cycle key, verify no faults, test start engine', expectedResult: 'Engine runs normally', timeEstimate: '10 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Speed Control', parameters: [
      { name: 'Rated Speed', description: 'Nominal operating speed', path: 'Governor > Rated Speed', defaultValue: '1500 RPM', range: '1400-1800 RPM', unit: 'RPM' },
      { name: 'Low Idle', description: 'Idle speed setting', path: 'Governor > Low Idle', defaultValue: '700 RPM', range: '600-900 RPM', unit: 'RPM' },
      { name: 'High Idle', description: 'Maximum no-load speed', path: 'Governor > High Idle', defaultValue: '1550 RPM', range: '1500-1600 RPM', unit: 'RPM' }
    ]},
    { category: 'Protection Settings', parameters: [
      { name: 'High Water Temp', description: 'Coolant over-temperature shutdown', path: 'Protection > Coolant Temp', defaultValue: '103°C', range: '95-110°C', unit: '°C' },
      { name: 'Low Oil Pressure', description: 'Oil pressure shutdown point', path: 'Protection > Oil Pressure', defaultValue: '1.0 bar', range: '0.5-2.0 bar', unit: 'bar' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 250000, supportedPGNs: [61444, 61443, 65262, 65263, 65226] },
  troubleshooting: [
    { problem: 'No communication with ECU', causes: ['CAN wiring fault', 'ECU not powered', 'Wrong baud rate'], solutions: ['Check all connector pins', 'Verify 24V at ECU', 'Try 250k and 500k baud'] },
    { problem: 'Engine derate after programming', causes: ['Wrong calibration', 'Sensor not calibrated'], solutions: ['Verify calibration file', 'Recalibrate sensors', 'Check for active faults'] }
  ],
  safetyWarnings: ['Maintain stable 24V during all programming', 'Never interrupt flash process', 'Always backup before changes'],
  commonMistakes: ['Using wrong engine family calibration', 'Interrupting programming', 'Not cycling ignition after programming'],
  verificationChecklist: ['ECU responds to diagnostic tool', 'No active fault codes', 'Engine starts and idles normally', 'All protection systems functional']
};

// ==================== MAN ECM GUIDE ====================
export const MAN_ECM_GUIDE: ReprogrammingGuide = {
  id: 'man-edc',
  ecmName: 'MAN EDC / Common Rail',
  manufacturer: 'MAN',
  models: ['D0836', 'D2066', 'D2676', 'D2868', 'E0836', 'E2876', 'E3262', 'E3268', 'D26', 'D08', 'D15', 'MAN Marine'],
  overview: 'MAN Electronic Diesel Control (EDC) systems for industrial and marine generators. Uses MAN-cats diagnostic system or compatible J1939 tools.',
  prerequisites: {
    tools: [
      { name: 'MAN-cats II/III Diagnostic Tool', description: 'Official MAN diagnostic system', alternatives: ['Jaltest', 'Texa'], essential: true },
      { name: '16-Pin OBD Adapter', description: 'For newer MAN engines', essential: false },
      { name: '9-Pin Deutsch', description: 'For older/industrial applications', essential: true }
    ],
    software: [
      { name: 'MAN-cats', version: 'II or III', source: 'MAN Dealer', licenseRequired: true }
    ],
    parts: ['ECU connector pins if damaged'],
    conditions: ['Battery 24V fully charged', 'All loads disconnected']
  },
  connectionProcedure: [
    { step: 1, action: 'Identify diagnostic connector type', details: '9-pin Deutsch for industrial, 16-pin OBD for newer', pinout: [
      { pin: 'CAN-H', function: 'J1939 High', wire: 'Yellow' },
      { pin: 'CAN-L', function: 'J1939 Low', wire: 'Green' },
      { pin: 'GND', function: 'Signal Ground', wire: 'Brown' },
      { pin: '+24V', function: 'Power', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect MAN-cats interface', details: 'Use appropriate adapter for connector type' },
    { step: 3, action: 'Power on system', details: 'Key ON, verify MAN-cats detects EDC' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Connect battery support', details: 'Ensure 24V maintained throughout', expectedResult: 'Stable voltage display', timeEstimate: '2 minutes', criticalNotes: ['Critical: power loss = ECU damage'] },
    { step: 2, phase: 'backup', action: 'Read current EDC parameters', details: 'MAN-cats > EDC > Read All Parameters', expectedResult: 'Full backup saved', timeEstimate: '5 minutes', criticalNotes: ['Save to multiple locations'] },
    { step: 3, phase: 'programming', action: 'Select programming function', details: 'Service > EDC Programming', expectedResult: 'Programming menu displayed', timeEstimate: '1 minute', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Upload calibration/firmware', details: 'Select correct file for engine variant', expectedResult: 'Programming 100% complete', timeEstimate: '20-30 minutes', criticalNotes: ['Do not interrupt', 'Verify file matches engine'] },
    { step: 5, phase: 'configuration', action: 'Configure application parameters', details: 'Set governor mode, protection limits, etc.', expectedResult: 'Parameters accepted', timeEstimate: '10 minutes', criticalNotes: [] },
    { step: 6, phase: 'verification', action: 'Test engine operation', details: 'Start engine, verify all functions', expectedResult: 'Normal operation confirmed', timeEstimate: '15 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Governor', parameters: [
      { name: 'Operating Mode', description: 'Isochronous or droop', path: 'Governor > Mode', defaultValue: 'Isochronous', range: 'Iso/Droop/VSpeed', unit: '' },
      { name: 'Rated Speed', description: 'Target speed at rated load', path: 'Governor > Rated', defaultValue: '1500 RPM', range: '1400-2100 RPM', unit: 'RPM' }
    ]},
    { category: 'Protection', parameters: [
      { name: 'Coolant Temp Limit', description: 'High temperature shutdown', path: 'Limits > Coolant', defaultValue: '105°C', range: '95-115°C', unit: '°C' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 250000, supportedPGNs: [61444, 65262, 65263, 65226, 65270] },
  troubleshooting: [
    { problem: 'MAN-cats no connection', causes: ['Wrong interface', 'CAN fault', 'EDC not powered'], solutions: ['Verify adapter type', 'Check CAN wiring', 'Check 24V supply'] }
  ],
  safetyWarnings: ['Never interrupt flash programming', 'Verify calibration file before upload', 'Keep fire extinguisher nearby'],
  commonMistakes: ['Wrong engine variant calibration', 'Insufficient battery capacity'],
  verificationChecklist: ['EDC responds', 'No fault codes', 'Engine runs at rated speed', 'All protections active']
};

// ==================== IVECO/FPT ECM GUIDE ====================
export const IVECO_FPT_GUIDE: ReprogrammingGuide = {
  id: 'iveco-fpt-edc',
  ecmName: 'Iveco/FPT EDC17',
  manufacturer: 'Iveco/FPT',
  models: ['NEF Series', 'N45', 'N67', 'Cursor 8', 'Cursor 10', 'Cursor 13', 'F4GE', 'F4HE', 'F5C', 'Vector Series'],
  overview: 'FPT Industrial (Iveco) engines use Bosch EDC17 or Continental ECUs. Common in SDMO, Kohler, and other generator brands.',
  prerequisites: {
    tools: [
      { name: 'Iveco E.A.S.Y. Diagnostic', description: 'Official Iveco/FPT diagnostic tool', alternatives: ['Texa', 'Jaltest', 'Autocom'], essential: true },
      { name: '16-Pin OBD-II Connector', description: 'Standard OBD port for newer engines', essential: true },
      { name: '12/24V Power Supply', description: 'Stable power during programming', essential: true }
    ],
    software: [
      { name: 'E.A.S.Y.', version: 'Current', source: 'Iveco Dealer', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Battery charged', 'Key ON Engine OFF']
  },
  connectionProcedure: [
    { step: 1, action: 'Locate OBD-II port', details: 'Usually under dashboard or on engine harness', pinout: [
      { pin: '6', function: 'CAN-H', wire: 'Yellow' },
      { pin: '14', function: 'CAN-L', wire: 'Green' },
      { pin: '4/5', function: 'Ground', wire: 'Black' },
      { pin: '16', function: '+12/24V', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect E.A.S.Y. interface', details: 'Plug into OBD port' },
    { step: 3, action: 'Launch software and connect', details: 'Auto-detect ECU type' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Verify stable power', details: 'Connect battery charger', expectedResult: 'Voltage stable', timeEstimate: '2 minutes', criticalNotes: ['Power loss during flash = bricked ECU'] },
    { step: 2, phase: 'backup', action: 'Read ECU identification', details: 'Record all ECU data', expectedResult: 'ECU ID saved', timeEstimate: '3 minutes', criticalNotes: [] },
    { step: 3, phase: 'programming', action: 'Select ECU programming', details: 'Service Functions > ECU Programming', expectedResult: 'Programming mode active', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Flash calibration', details: 'Upload correct calibration for application', expectedResult: 'Flash successful', timeEstimate: '15-30 minutes', criticalNotes: ['Do not interrupt'] },
    { step: 5, phase: 'verification', action: 'Verify and test', details: 'Clear codes, test run engine', expectedResult: 'Normal operation', timeEstimate: '10 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Engine Settings', parameters: [
      { name: 'Rated Speed', description: 'Operating speed', path: 'Engine > Speed', defaultValue: '1500 RPM', range: '1400-2100 RPM', unit: 'RPM' },
      { name: 'Idle Speed', description: 'Low idle RPM', path: 'Engine > Idle', defaultValue: '700 RPM', range: '600-900 RPM', unit: 'RPM' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 250000, supportedPGNs: [61444, 65262, 65263] },
  troubleshooting: [
    { problem: 'No ECU communication', causes: ['Wrong protocol', 'Wiring fault'], solutions: ['Try CAN and K-Line', 'Check OBD pins'] }
  ],
  safetyWarnings: ['Maintain power throughout programming'],
  commonMistakes: ['Wrong application calibration'],
  verificationChecklist: ['ECU communicates', 'No faults', 'Engine runs correctly']
};

// ==================== LISTER PETTER GUIDE ====================
export const LISTER_PETTER_GUIDE: ReprogrammingGuide = {
  id: 'lister-petter',
  ecmName: 'Lister Petter Alpha/TR Series',
  manufacturer: 'Lister Petter',
  models: ['Alpha Series', 'TR1', 'TR2', 'TR3', 'LPW2', 'LPW3', 'LPW4', 'LPWS2', 'LPWS3', 'LPWS4', 'LPWT4', 'GW Series'],
  overview: 'Lister Petter engines (now part of Kohler/SDMO) range from mechanical to electronic injection. Newer models use electronic governors and fuel systems.',
  prerequisites: {
    tools: [
      { name: 'Lister Petter Diagnostic Kit', description: 'For electronic models', alternatives: ['Generic J1939 tool'], essential: true },
      { name: 'Mechanical Governor Tools', description: 'For older mechanical models', essential: false },
      { name: 'Multimeter', description: 'For sensor testing', essential: true }
    ],
    software: [
      { name: 'LP Electronic Diagnostic Software', version: 'Current', source: 'Lister Petter/Kohler Dealer', licenseRequired: true }
    ],
    parts: ['Governor seals if adjusting mechanical', 'Sensor connectors'],
    conditions: ['Engine cold for governor adjustment', 'Battery charged for electronic']
  },
  connectionProcedure: [
    { step: 1, action: 'Identify engine type', details: 'Mechanical (pre-2005) or Electronic (2005+)', pinout: [
      { pin: 'A', function: 'CAN-H (Electronic only)', wire: 'Yellow' },
      { pin: 'B', function: 'CAN-L (Electronic only)', wire: 'Green' },
      { pin: 'C', function: 'Ground', wire: 'Black' }
    ]},
    { step: 2, action: 'Connect appropriate interface', details: 'Use LP diagnostic tool for electronic, manual for mechanical' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Identify system type', details: 'Mechanical or electronic fuel control', expectedResult: 'System type confirmed', timeEstimate: '2 minutes', criticalNotes: ['Different procedures for each'] },
    { step: 2, phase: 'connection', action: 'Connect diagnostic tool', details: 'For electronic systems only', expectedResult: 'ECU detected', timeEstimate: '3 minutes', criticalNotes: [] },
    { step: 3, phase: 'configuration', action: 'Adjust parameters', details: 'Set speed, protection limits as needed', expectedResult: 'Parameters saved', timeEstimate: '10 minutes', criticalNotes: [] },
    { step: 4, phase: 'verification', action: 'Test engine operation', details: 'Run engine and verify settings', expectedResult: 'Correct operation', timeEstimate: '15 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Speed Control', parameters: [
      { name: 'Rated Speed', description: 'Operating speed', path: 'Governor > Speed', defaultValue: '1500 RPM', range: '1400-3600 RPM', unit: 'RPM' },
      { name: 'Idle Speed', description: 'Low idle', path: 'Governor > Idle', defaultValue: '800 RPM', range: '700-1000 RPM', unit: 'RPM' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 250000, supportedPGNs: [61444, 65262] },
  troubleshooting: [
    { problem: 'Speed hunting', causes: ['Governor linkage loose', 'Air in fuel'], solutions: ['Check linkage', 'Bleed fuel system'] }
  ],
  safetyWarnings: ['Mechanical governor adjustment requires training', 'High pressure fuel system - use caution'],
  commonMistakes: ['Over-adjusting mechanical governor', 'Not bleeding air from fuel system'],
  verificationChecklist: ['Stable speed under load', 'No fuel leaks', 'Temperature normal']
};

// ==================== HONDA GENERATOR ECU GUIDE ====================
export const HONDA_ECU_GUIDE: ReprogrammingGuide = {
  id: 'honda-gx-igx',
  ecmName: 'Honda GX/iGX ECU',
  manufacturer: 'Honda',
  models: ['GX120', 'GX160', 'GX200', 'GX240', 'GX270', 'GX340', 'GX390', 'GX630', 'GX690', 'iGX440', 'iGX700', 'iGX800', 'GXV Series'],
  overview: 'Honda engine electronic controls. iGX series features electronic governor and STR (Self-Tuning Regulator). GX series is mostly mechanical with electronic ignition.',
  prerequisites: {
    tools: [
      { name: 'Honda Diagnostic System (HDS)', description: 'For iGX electronic engines', alternatives: ['Generic OBD if equipped'], essential: true },
      { name: 'Tachometer', description: 'For speed adjustment verification', essential: true },
      { name: 'Multimeter', description: 'For sensor testing', essential: true }
    ],
    software: [
      { name: 'Honda iGX Diagnostic Software', version: 'Current', source: 'Honda Power Equipment Dealer', licenseRequired: true }
    ],
    parts: ['Spark plug', 'Air filter'],
    conditions: ['Engine at operating temperature for adjustments']
  },
  connectionProcedure: [
    { step: 1, action: 'Identify engine series', details: 'iGX = electronic governor, GX = mechanical', pinout: [
      { pin: 'Data', function: 'Serial communication', wire: 'Green' },
      { pin: 'Ground', function: 'Signal ground', wire: 'Black' },
      { pin: 'Power', function: '+12V', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect HDS for iGX', details: 'Locate 3-pin diagnostic connector near ECU' },
    { step: 3, action: 'For GX mechanical', details: 'Use manual adjustment procedures' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Check battery/power supply', details: 'Ensure stable 12V', expectedResult: '12V confirmed', timeEstimate: '1 minute', criticalNotes: [] },
    { step: 2, phase: 'connection', action: 'Connect HDS (iGX only)', details: 'Plug into diagnostic port', expectedResult: 'ECU detected', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 3, phase: 'configuration', action: 'Adjust governor settings', details: 'Set target speed and STR parameters', expectedResult: 'Parameters saved', timeEstimate: '5 minutes', criticalNotes: ['iGX only - GX requires mechanical adjustment'] },
    { step: 4, phase: 'verification', action: 'Test under load', details: 'Apply load and verify speed stability', expectedResult: 'Speed holds within 3%', timeEstimate: '10 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Governor (iGX)', parameters: [
      { name: 'Target Speed', description: 'Desired operating speed', path: 'STR > Target', defaultValue: '3600 RPM', range: '1800-3800 RPM', unit: 'RPM' },
      { name: 'STR Mode', description: 'Self-Tuning Regulator mode', path: 'STR > Mode', defaultValue: 'Auto', range: 'Auto/Manual', unit: '' }
    ]},
    { category: 'GX Mechanical', parameters: [
      { name: 'Governor Arm', description: 'Adjust linkage for speed', path: 'Physical adjustment', defaultValue: 'Factory set', range: 'N/A', unit: '' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 9600, supportedPGNs: [] },
  troubleshooting: [
    { problem: 'Speed surging', causes: ['Dirty carburetor', 'Governor spring worn', 'Air leak'], solutions: ['Clean carburetor', 'Replace governor spring', 'Check intake gaskets'] },
    { problem: 'iGX STR fault', causes: ['Sensor failure', 'ECU fault'], solutions: ['Check sensors', 'Reset ECU', 'Replace if needed'] }
  ],
  safetyWarnings: ['Gasoline engine - no smoking, ensure ventilation', 'Hot exhaust - burn hazard', 'Rotating parts - keep clear'],
  commonMistakes: ['Over-adjusting mechanical governor', 'Not cleaning carburetor when troubleshooting', 'Ignoring air filter condition'],
  verificationChecklist: ['Smooth idle', 'Stable speed under load', 'No exhaust smoke', 'Oil level correct']
};

// ==================== WEICHAI ECU GUIDE ====================
export const WEICHAI_ECU_GUIDE: ReprogrammingGuide = {
  id: 'weichai-ecu',
  ecmName: 'Weichai ECU / WECM',
  manufacturer: 'Weichai',
  models: ['WP2.3', 'WP3.9', 'WP4.1', 'WP6', 'WP7', 'WP10', 'WP12', 'WP13', 'WD615', 'WD618', 'WD10', 'WD12', 'Baudouin 4M', 'Baudouin 6M'],
  overview: 'Weichai Power engines with electronic control. Includes Baudouin marine/genset engines (owned by Weichai). Uses Weichai diagnostic tools or compatible J1939 interfaces.',
  prerequisites: {
    tools: [
      { name: 'Weichai Diagnostic Tool', description: 'Official Weichai ECU interface', alternatives: ['J1939 generic tool', 'Jaltest'], essential: true },
      { name: '9-Pin J1939 Connector', description: 'Standard heavy-duty diagnostic port', essential: true },
      { name: 'Battery Charger', description: '24V support during programming', essential: true }
    ],
    software: [
      { name: 'Weichai Diagnostic Software', version: 'Current', source: 'Weichai Dealer', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Battery 24V charged', 'All loads disconnected']
  },
  connectionProcedure: [
    { step: 1, action: 'Locate 9-pin diagnostic port', details: 'Usually on engine harness or control panel', pinout: [
      { pin: 'A', function: 'CAN-H (J1939)', wire: 'Yellow' },
      { pin: 'B', function: 'CAN-L (J1939)', wire: 'Green' },
      { pin: 'C', function: 'Ground', wire: 'Black' },
      { pin: 'J', function: '+24V', wire: 'Red' }
    ]},
    { step: 2, action: 'Connect diagnostic tool', details: 'Plug adapter into port' },
    { step: 3, action: 'Key ON', details: 'Power ECU without starting engine' },
    { step: 4, action: 'Launch software', details: 'Auto-detect ECU' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'preparation', action: 'Connect battery charger', details: 'Ensure stable 24V', expectedResult: 'Voltage 25-28V', timeEstimate: '2 minutes', criticalNotes: ['Critical for flash success'] },
    { step: 2, phase: 'backup', action: 'Read current calibration', details: 'Save all ECU data to file', expectedResult: 'Backup complete', timeEstimate: '5 minutes', criticalNotes: ['Essential for recovery'] },
    { step: 3, phase: 'programming', action: 'Select programming mode', details: 'ECU Service > Reprogramming', expectedResult: 'Program mode active', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 4, phase: 'programming', action: 'Upload calibration file', details: 'Select file matching engine model', expectedResult: 'Flash complete', timeEstimate: '15-25 minutes', criticalNotes: ['Do not interrupt'] },
    { step: 5, phase: 'verification', action: 'Verify and test', details: 'Read back data, start engine', expectedResult: 'Normal operation', timeEstimate: '10 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Speed Control', parameters: [
      { name: 'Rated Speed', description: 'Target operating speed', path: 'Governor > Rated', defaultValue: '1500 RPM', range: '1400-2100 RPM', unit: 'RPM' },
      { name: 'Idle Speed', description: 'Low idle setting', path: 'Governor > Idle', defaultValue: '700 RPM', range: '600-900 RPM', unit: 'RPM' },
      { name: 'Governor Mode', description: 'Isochronous or Droop', path: 'Governor > Mode', defaultValue: 'Isochronous', range: 'Iso/Droop', unit: '' }
    ]},
    { category: 'Protection', parameters: [
      { name: 'High Coolant Temp', description: 'Shutdown temperature', path: 'Protection > Coolant', defaultValue: '103°C', range: '95-110°C', unit: '°C' },
      { name: 'Low Oil Pressure', description: 'Shutdown pressure', path: 'Protection > Oil', defaultValue: '1.0 bar', range: '0.5-2.0 bar', unit: 'bar' }
    ]}
  ],
  j1939Setup: { sourceAddress: 0, baudRate: 250000, supportedPGNs: [61444, 61443, 65262, 65263, 65226, 65270] },
  troubleshooting: [
    { problem: 'ECU no communication', causes: ['CAN wiring fault', 'ECU not powered', 'Wrong tool'], solutions: ['Check CAN H/L wiring', 'Verify 24V supply', 'Use compatible tool'] },
    { problem: 'Engine derate', causes: ['Active fault code', 'Sensor failure'], solutions: ['Read and address fault codes', 'Check sensors'] }
  ],
  safetyWarnings: ['Maintain 24V throughout programming', 'Use correct calibration file', 'Keep backup of original data'],
  commonMistakes: ['Wrong engine model calibration', 'Power interruption during flash', 'Not saving backup first'],
  verificationChecklist: ['ECU communicates', 'No fault codes', 'Engine starts normally', 'Speed regulation correct']
};

// ==================== SDMO/KOHLER CONTROLLER GUIDE ====================
export const SDMO_KOHLER_GUIDE: ReprogrammingGuide = {
  id: 'sdmo-kohler-apm',
  ecmName: 'SDMO APM/Kohler Decision-Maker',
  manufacturer: 'SDMO/Kohler',
  models: ['APM303', 'APM403', 'APM802', 'Decision-Maker 340', 'Decision-Maker 550', 'Decision-Maker 3500', 'IntelliGen', 'MP Series'],
  overview: 'SDMO (now Kohler-SDMO) generator controllers. These are generator controllers (not engine ECMs) - engine ECMs depend on engine brand (typically John Deere, Mitsubishi, Volvo, or Doosan).',
  prerequisites: {
    tools: [
      { name: 'SDMO PC Software', description: 'Configuration software for APM controllers', alternatives: ['Kohler OnCue'], essential: true },
      { name: 'RS232/USB Cable', description: 'For APM controller connection', essential: true },
      { name: 'Ethernet Cable', description: 'For newer controllers with Ethernet', essential: false }
    ],
    software: [
      { name: 'SDMO APM Software', version: 'Current', source: 'SDMO/Kohler Dealer', licenseRequired: false },
      { name: 'Kohler OnCue Plus', version: 'Current', source: 'Kohler', licenseRequired: true }
    ],
    parts: [],
    conditions: ['Generator powered', 'Engine not running for configuration']
  },
  connectionProcedure: [
    { step: 1, action: 'Identify controller model', details: 'APM for SDMO, Decision-Maker for Kohler', pinout: [
      { pin: 'RS232 TX', function: 'Serial transmit', wire: 'Per manual' },
      { pin: 'RS232 RX', function: 'Serial receive', wire: 'Per manual' },
      { pin: 'GND', function: 'Signal ground', wire: 'Black' }
    ]},
    { step: 2, action: 'Connect PC cable', details: 'RS232 or USB depending on controller version' },
    { step: 3, action: 'Launch configuration software', details: 'SDMO PC or Kohler OnCue' }
  ],
  reprogrammingProcedure: [
    { step: 1, phase: 'connection', action: 'Connect to controller', details: 'Use serial or Ethernet connection', expectedResult: 'Controller detected', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 2, phase: 'backup', action: 'Download current configuration', details: 'Save all parameters to file', expectedResult: 'Configuration backed up', timeEstimate: '3 minutes', criticalNotes: ['Always backup before changes'] },
    { step: 3, phase: 'configuration', action: 'Modify parameters', details: 'Change settings as needed', expectedResult: 'Parameters modified', timeEstimate: '10-30 minutes', criticalNotes: ['Understand each parameter before changing'] },
    { step: 4, phase: 'programming', action: 'Upload configuration', details: 'Send new parameters to controller', expectedResult: 'Upload successful', timeEstimate: '2 minutes', criticalNotes: [] },
    { step: 5, phase: 'verification', action: 'Test all functions', details: 'Verify alarms, start/stop, protections', expectedResult: 'All functions working', timeEstimate: '15 minutes', criticalNotes: [] }
  ],
  parameterConfiguration: [
    { category: 'Engine', parameters: [
      { name: 'Crank Time', description: 'Maximum cranking duration', path: 'Engine > Crank', defaultValue: '10 sec', range: '5-30 sec', unit: 'seconds' },
      { name: 'Crank Rest', description: 'Rest between crank attempts', path: 'Engine > Rest', defaultValue: '10 sec', range: '5-30 sec', unit: 'seconds' },
      { name: 'Max Crank Attempts', description: 'Attempts before fail-to-start', path: 'Engine > Attempts', defaultValue: '3', range: '1-5', unit: '' }
    ]},
    { category: 'Protection', parameters: [
      { name: 'High Coolant Temp', description: 'Shutdown temperature', path: 'Alarms > Coolant', defaultValue: '98°C', range: '85-105°C', unit: '°C' },
      { name: 'Low Oil Pressure', description: 'Shutdown pressure', path: 'Alarms > Oil', defaultValue: '1.4 bar', range: '0.8-2.0 bar', unit: 'bar' },
      { name: 'Overspeed', description: 'Overspeed shutdown', path: 'Alarms > Speed', defaultValue: '1650 RPM', range: '1550-1800 RPM', unit: 'RPM' }
    ]},
    { category: 'Generator', parameters: [
      { name: 'Nominal Voltage', description: 'Rated output voltage', path: 'Generator > Voltage', defaultValue: '400V', range: '380-480V', unit: 'V' },
      { name: 'Nominal Frequency', description: 'Rated frequency', path: 'Generator > Freq', defaultValue: '50 Hz', range: '50/60 Hz', unit: 'Hz' }
    ]}
  ],
  j1939Setup: { sourceAddress: 128, baudRate: 250000, supportedPGNs: [61444, 65262, 65263, 65226] },
  troubleshooting: [
    { problem: 'Cannot connect to controller', causes: ['Wrong COM port', 'Cable fault', 'Baud rate mismatch'], solutions: ['Check COM port setting', 'Try different cable', 'Match baud rate'] },
    { problem: 'Configuration upload fails', causes: ['Parameter out of range', 'Communication interrupted'], solutions: ['Check parameter values', 'Retry upload'] }
  ],
  safetyWarnings: ['Test all safety shutdowns after configuration changes', 'Document all changes made'],
  commonMistakes: ['Not backing up original configuration', 'Setting protection limits too high/low', 'Not testing after changes'],
  verificationChecklist: ['Controller communicates', 'All alarms respond correctly', 'Engine starts/stops properly', 'Transfer functions work (if ATS)']
};

// ==================== ALL ECM GUIDES ====================

export const ALL_ECM_REPROGRAMMING_GUIDES: ReprogrammingGuide[] = [
  // Major Diesel Engine ECMs
  CAT_ADEM_A4_GUIDE,
  CUMMINS_CM2350_GUIDE,
  VOLVO_PENTA_EMS2_GUIDE,
  PERKINS_ECM_GUIDE,
  JOHN_DEERE_POWERTECH_GUIDE,
  MTU_ADEC_GUIDE,
  DETROIT_DIESEL_GUIDE,
  SCANIA_EMS_GUIDE,
  DEUTZ_EMR_GUIDE,
  // Additional Manufacturers
  YANMAR_ECM_GUIDE,
  DOOSAN_ECM_GUIDE,
  MAN_ECM_GUIDE,
  IVECO_FPT_GUIDE,
  LISTER_PETTER_GUIDE,
  HONDA_ECU_GUIDE,
  WEICHAI_ECU_GUIDE,
  SDMO_KOHLER_GUIDE
];

// ==================== HELPER FUNCTIONS ====================

export function getReprogrammingGuide(ecmId: string): ReprogrammingGuide | null {
  return ALL_ECM_REPROGRAMMING_GUIDES.find(g => g.id === ecmId) || null;
}

export function getGuidesByManufacturer(manufacturer: string): ReprogrammingGuide[] {
  return ALL_ECM_REPROGRAMMING_GUIDES.filter(g =>
    g.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

export function searchGuides(query: string): ReprogrammingGuide[] {
  const lower = query.toLowerCase();
  return ALL_ECM_REPROGRAMMING_GUIDES.filter(g =>
    g.ecmName.toLowerCase().includes(lower) ||
    g.manufacturer.toLowerCase().includes(lower) ||
    g.models.some(m => m.toLowerCase().includes(lower))
  );
}

export function getAllManufacturers(): string[] {
  return [...new Set(ALL_ECM_REPROGRAMMING_GUIDES.map(g => g.manufacturer))];
}
