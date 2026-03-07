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
    affectsWhat: string;
    howToSet: string;
  }[];
}

export interface J1939Configuration {
  protocol: string;
  baudRate: number;
  sourceAddress: string;
  transmitPGNs: { pgn: string; name: string; rate: string; description: string }[];
  receivePGNs: { pgn: string; name: string; description: string }[];
  terminationResistor: {
    required: boolean;
    value: string;
    location: string;
  };
  wiringDiagram: string;
}

export interface TroubleshootingItem {
  problem: string;
  possibleCauses: string[];
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

// ==================== ALL ECM GUIDES ====================

export const ALL_ECM_REPROGRAMMING_GUIDES: ReprogrammingGuide[] = [
  CAT_ADEM_A4_GUIDE,
  CUMMINS_CM2350_GUIDE
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
