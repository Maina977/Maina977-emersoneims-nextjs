/**
 * Generator Oracle - Reset Pathways Database
 * Detailed reset procedures for each controller brand and model
 */

export interface ResetProcedure {
  id: string;
  brand: string;
  model: string;
  alarmCategory: string;
  method: 'keypad' | 'software' | 'manual' | 'automatic';
  difficulty: 'easy' | 'moderate' | 'advanced';
  requiresTools: string[];
  preconditions: string[];
  steps: {
    step: number;
    instruction: string;
    keySequence?: string[];
    menuNavigation?: string[];
    timing?: string;
    warning?: string;
    expectedResult: string;
  }[];
  troubleshooting: {
    issue: string;
    solution: string;
  }[];
  successIndicators: string[];
  notes?: string;
}

// ==================== DSE RESET PROCEDURES ====================

export const DSE_RESET_PROCEDURES: ResetProcedure[] = [
  {
    id: 'dse-standard-keypad-reset',
    brand: 'DeepSea Electronics',
    model: 'All Models',
    alarmCategory: 'Warning Alarms',
    method: 'keypad',
    difficulty: 'easy',
    requiresTools: [],
    preconditions: [
      'Engine must be stopped',
      'Fault condition must be resolved',
      'No active shutdown conditions'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Press STOP button to ensure engine is stopped',
        keySequence: ['STOP'],
        expectedResult: 'Engine stops, STOP LED illuminates'
      },
      {
        step: 2,
        instruction: 'Wait for engine to come to complete stop',
        timing: '5-10 seconds',
        expectedResult: 'Engine RPM reads 0'
      },
      {
        step: 3,
        instruction: 'Press and hold RESET button',
        keySequence: ['RESET (hold)'],
        timing: '3 seconds',
        expectedResult: 'Alarm LED stops flashing'
      },
      {
        step: 4,
        instruction: 'Release RESET button',
        expectedResult: 'Controller returns to standby mode'
      },
      {
        step: 5,
        instruction: 'Select desired operating mode',
        keySequence: ['AUTO or MANUAL'],
        expectedResult: 'Selected mode LED illuminates'
      }
    ],
    troubleshooting: [
      {
        issue: 'Alarm does not clear after reset',
        solution: 'Check if fault condition is still present. Some alarms require the underlying fault to be fixed first.'
      },
      {
        issue: 'Reset button has no effect',
        solution: 'Check for active shutdown or lockout. May require software reset or multiple reset cycles.'
      }
    ],
    successIndicators: [
      'No alarm LEDs flashing',
      'Controller displays normal standby screen',
      'Event log shows alarm reset timestamp'
    ]
  },
  {
    id: 'dse-shutdown-reset',
    brand: 'DeepSea Electronics',
    model: 'DSE 7320, DSE 7510, DSE 7560, DSE 8610, DSE 8660',
    alarmCategory: 'Shutdown Alarms',
    method: 'keypad',
    difficulty: 'moderate',
    requiresTools: [],
    preconditions: [
      'Engine must be stopped',
      'Shutdown fault must be investigated and resolved',
      'DO NOT reset without investigating cause'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Document the shutdown alarm code and timestamp',
        expectedResult: 'Alarm details recorded for diagnosis'
      },
      {
        step: 2,
        instruction: 'Investigate and resolve the shutdown cause',
        warning: 'Resetting without fixing the issue may cause equipment damage',
        expectedResult: 'Root cause identified and corrected'
      },
      {
        step: 3,
        instruction: 'Press STOP button if engine is still running',
        keySequence: ['STOP'],
        expectedResult: 'Engine stops'
      },
      {
        step: 4,
        instruction: 'Press and hold RESET button for 5 seconds',
        keySequence: ['RESET (hold 5s)'],
        timing: '5 seconds',
        expectedResult: 'Shutdown alarm clears'
      },
      {
        step: 5,
        instruction: 'If alarm persists, perform power cycle reset',
        warning: 'Only if normal reset fails',
        expectedResult: 'Controller restarts'
      },
      {
        step: 6,
        instruction: 'Verify alarm has cleared',
        expectedResult: 'No active alarms displayed'
      }
    ],
    troubleshooting: [
      {
        issue: 'Shutdown alarm will not clear',
        solution: 'Some shutdowns require investigation before reset is allowed. Check DSE documentation for specific alarm.'
      },
      {
        issue: 'Alarm returns immediately after reset',
        solution: 'Fault condition is still present. Do not continue attempting reset - fix the underlying issue.'
      }
    ],
    successIndicators: [
      'Shutdown alarm cleared from active alarms',
      'Event log updated with reset',
      'System ready for restart'
    ],
    notes: 'Certain critical shutdowns may be configured to require password or software reset only'
  },
  {
    id: 'dse-lockout-reset',
    brand: 'DeepSea Electronics',
    model: 'All Models',
    alarmCategory: 'Lockout Conditions',
    method: 'software',
    difficulty: 'advanced',
    requiresTools: ['Laptop PC', 'DSE Configuration Suite', 'USB cable'],
    preconditions: [
      'DSE Configuration Suite installed',
      'USB communication cable available',
      'Lockout cause must be identified and resolved'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Connect laptop to controller via USB',
        expectedResult: 'USB connected indicator shows'
      },
      {
        step: 2,
        instruction: 'Launch DSE Configuration Suite',
        expectedResult: 'Software opens'
      },
      {
        step: 3,
        instruction: 'Click Connect and select appropriate COM port',
        menuNavigation: ['File', 'Connect'],
        expectedResult: 'Connected to DSE controller'
      },
      {
        step: 4,
        instruction: 'Navigate to Alarms page',
        menuNavigation: ['Monitor', 'Alarms'],
        expectedResult: 'Active alarms displayed'
      },
      {
        step: 5,
        instruction: 'Select lockout alarm and click Reset',
        expectedResult: 'Confirmation dialog appears'
      },
      {
        step: 6,
        instruction: 'Confirm reset action',
        warning: 'Ensure you have investigated and resolved the lockout cause',
        expectedResult: 'Lockout clears'
      },
      {
        step: 7,
        instruction: 'Disconnect and test operation',
        expectedResult: 'Controller operates normally'
      }
    ],
    troubleshooting: [
      {
        issue: 'Cannot connect to controller',
        solution: 'Check USB drivers installed, verify COM port selection, try different USB port'
      },
      {
        issue: 'Reset option greyed out',
        solution: 'May require configuration access level password'
      }
    ],
    successIndicators: [
      'Lockout cleared in software',
      'Controller keypad shows no lockout',
      'Successful test start'
    ]
  }
];

// ==================== COMAP RESET PROCEDURES ====================

export const COMAP_RESET_PROCEDURES: ResetProcedure[] = [
  {
    id: 'comap-intelilite-reset',
    brand: 'ComAp',
    model: 'InteliLite IL-NT AMF25',
    alarmCategory: 'All Alarms',
    method: 'keypad',
    difficulty: 'easy',
    requiresTools: [],
    preconditions: [
      'Engine stopped',
      'Alarm condition resolved'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Press STOP/RESET button',
        keySequence: ['STOP/RESET'],
        expectedResult: 'Engine stops if running'
      },
      {
        step: 2,
        instruction: 'Wait for engine to stop completely',
        timing: '5 seconds',
        expectedResult: 'Engine at rest'
      },
      {
        step: 3,
        instruction: 'Press FAULT RESET button',
        keySequence: ['FAULT RESET'],
        expectedResult: 'Alarm indication clears'
      },
      {
        step: 4,
        instruction: 'Select AUTO mode',
        keySequence: ['AUTO'],
        expectedResult: 'Ready for automatic operation'
      }
    ],
    troubleshooting: [
      {
        issue: 'Alarm does not clear',
        solution: 'Check if sensor input is still in alarm condition. Fault must be resolved first.'
      }
    ],
    successIndicators: [
      'No fault LEDs active',
      'Display shows ready state'
    ]
  },
  {
    id: 'comap-inteli-software-reset',
    brand: 'ComAp',
    model: 'InteliGen, InteliSys',
    alarmCategory: 'All Alarms',
    method: 'software',
    difficulty: 'moderate',
    requiresTools: ['Laptop', 'InteliConfig software', 'Communication cable'],
    preconditions: [
      'InteliConfig software installed',
      'Communication established'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Connect to controller via InteliConfig',
        expectedResult: 'Online connection established'
      },
      {
        step: 2,
        instruction: 'Go to Alarms/Events page',
        menuNavigation: ['View', 'Alarms'],
        expectedResult: 'Current alarms displayed'
      },
      {
        step: 3,
        instruction: 'Select alarm to reset',
        expectedResult: 'Alarm highlighted'
      },
      {
        step: 4,
        instruction: 'Click Reset Alarm button',
        expectedResult: 'Alarm clears if conditions met'
      }
    ],
    troubleshooting: [
      {
        issue: 'Cannot establish connection',
        solution: 'Verify communication settings match controller configuration'
      }
    ],
    successIndicators: [
      'Alarm removed from active list',
      'Event logged with reset time'
    ]
  }
];

// ==================== WOODWARD RESET PROCEDURES ====================

export const WOODWARD_RESET_PROCEDURES: ResetProcedure[] = [
  {
    id: 'woodward-easygen-reset',
    brand: 'Woodward',
    model: 'EasyGen 3000, EasyGen 3500',
    alarmCategory: 'All Alarms',
    method: 'keypad',
    difficulty: 'easy',
    requiresTools: [],
    preconditions: [
      'Generator offline',
      'Engine stopped',
      'Fault condition corrected'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Press STOP button to stop engine',
        keySequence: ['STOP'],
        expectedResult: 'Engine stops'
      },
      {
        step: 2,
        instruction: 'Press ESC button to exit alarm view',
        keySequence: ['ESC'],
        expectedResult: 'Returns to main screen'
      },
      {
        step: 3,
        instruction: 'Press and hold ACK button',
        keySequence: ['ACK (hold)'],
        timing: '2 seconds',
        expectedResult: 'Alarm acknowledged and cleared'
      },
      {
        step: 4,
        instruction: 'Navigate to Alarms menu to verify',
        menuNavigation: ['Menu', 'Alarms', 'Active'],
        expectedResult: 'No active alarms'
      }
    ],
    troubleshooting: [
      {
        issue: 'ACK button does not clear alarm',
        solution: 'Some alarms are latched and require underlying condition to be fixed. Check alarm type in manual.'
      }
    ],
    successIndicators: [
      'Alarm LED off',
      'No active alarms in menu',
      'Generator ready indicator'
    ]
  },
  {
    id: 'woodward-ls5-reset',
    brand: 'Woodward',
    model: 'LS-5 Load Share',
    alarmCategory: 'Load Share Faults',
    method: 'software',
    difficulty: 'advanced',
    requiresTools: ['Laptop', 'ToolKit software', 'Service tool'],
    preconditions: [
      'All generators in group offline',
      'ToolKit software connected',
      'Fault investigated'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Connect ToolKit to LS-5 module',
        expectedResult: 'Communication established'
      },
      {
        step: 2,
        instruction: 'Navigate to Diagnostics page',
        menuNavigation: ['Diagnostics', 'Faults'],
        expectedResult: 'Active faults displayed'
      },
      {
        step: 3,
        instruction: 'Review fault details',
        expectedResult: 'Fault information available'
      },
      {
        step: 4,
        instruction: 'Click Clear Faults button',
        expectedResult: 'Faults cleared'
      },
      {
        step: 5,
        instruction: 'Verify load share parameters',
        expectedResult: 'Settings correct'
      }
    ],
    troubleshooting: [
      {
        issue: 'Fault returns during load share operation',
        solution: 'Check generator droop settings and speed bias adjustments'
      }
    ],
    successIndicators: [
      'No active faults',
      'Load share ready',
      'Sync indicators normal'
    ]
  }
];

// ==================== SMARTGEN RESET PROCEDURES ====================

export const SMARTGEN_RESET_PROCEDURES: ResetProcedure[] = [
  {
    id: 'smartgen-hgm-reset',
    brand: 'SmartGen',
    model: 'HGM6100, HGM420, HGM5310',
    alarmCategory: 'All Alarms',
    method: 'keypad',
    difficulty: 'easy',
    requiresTools: [],
    preconditions: [
      'Engine stopped',
      'Fault condition resolved'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Press STOP to ensure engine is off',
        keySequence: ['STOP'],
        expectedResult: 'Engine stops'
      },
      {
        step: 2,
        instruction: 'Press MUTE to silence alarm',
        keySequence: ['MUTE'],
        expectedResult: 'Audible alarm stops'
      },
      {
        step: 3,
        instruction: 'Press RESET button',
        keySequence: ['RESET'],
        expectedResult: 'Fault indicator clears'
      },
      {
        step: 4,
        instruction: 'Press AUTO to resume automatic operation',
        keySequence: ['AUTO'],
        expectedResult: 'AUTO mode active'
      }
    ],
    troubleshooting: [
      {
        issue: 'Reset has no effect',
        solution: 'Hold RESET for 3 seconds for latched faults'
      }
    ],
    successIndicators: [
      'Fault LED off',
      'Display shows normal',
      'Ready for start'
    ]
  },
  {
    id: 'smartgen-hgm9500-reset',
    brand: 'SmartGen',
    model: 'HGM9500',
    alarmCategory: 'Multi-Unit Faults',
    method: 'software',
    difficulty: 'advanced',
    requiresTools: ['Laptop', 'SG72 software', 'RS485 adapter'],
    preconditions: [
      'All units in group stopped',
      'Master unit accessible',
      'Communication established'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Connect to master unit via SG72',
        expectedResult: 'Software shows online'
      },
      {
        step: 2,
        instruction: 'Navigate to Fault History',
        menuNavigation: ['Monitor', 'Fault History'],
        expectedResult: 'Fault list displayed'
      },
      {
        step: 3,
        instruction: 'Select fault and click Reset',
        expectedResult: 'Confirmation prompt'
      },
      {
        step: 4,
        instruction: 'Confirm reset for all units if needed',
        expectedResult: 'Faults cleared'
      },
      {
        step: 5,
        instruction: 'Verify group status',
        expectedResult: 'All units ready'
      }
    ],
    troubleshooting: [
      {
        issue: 'Cannot reset slave units',
        solution: 'Reset from master unit or connect directly to slave'
      }
    ],
    successIndicators: [
      'All units show ready',
      'No active faults',
      'Group sync available'
    ]
  }
];

// ==================== POWERWIZARD RESET PROCEDURES ====================

export const POWERWIZARD_RESET_PROCEDURES: ResetProcedure[] = [
  {
    id: 'powerwizard-panel-reset',
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 1.0, 2.0',
    alarmCategory: 'All Alarms',
    method: 'keypad',
    difficulty: 'easy',
    requiresTools: [],
    preconditions: [
      'Engine stopped',
      'Fault code resolved'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Press STOP to stop engine',
        keySequence: ['STOP'],
        expectedResult: 'Engine stops'
      },
      {
        step: 2,
        instruction: 'Wait for display to show OFF status',
        timing: '10 seconds',
        expectedResult: 'Display shows OFF'
      },
      {
        step: 3,
        instruction: 'Press ALARM ACK/RESET',
        keySequence: ['ALARM ACK/RESET'],
        expectedResult: 'Alarm acknowledged'
      },
      {
        step: 4,
        instruction: 'Press ALARM ACK/RESET again to reset',
        keySequence: ['ALARM ACK/RESET'],
        expectedResult: 'Alarm clears'
      }
    ],
    troubleshooting: [
      {
        issue: 'Alarm flashes but does not clear',
        solution: 'Fault condition still active. Use CAT ET to diagnose.'
      }
    ],
    successIndicators: [
      'No alarm indicator',
      'Ready to start',
      'Green status light'
    ]
  },
  {
    id: 'powerwizard-cat-et-reset',
    brand: 'CAT PowerWizard',
    model: 'PowerWizard 2.0, 4.1',
    alarmCategory: 'Diagnostic Codes',
    method: 'software',
    difficulty: 'advanced',
    requiresTools: ['Laptop', 'CAT Electronic Technician (ET)', 'CAT Comm Adapter'],
    preconditions: [
      'CAT ET software licensed and installed',
      'Comm Adapter III connected',
      'Engine stopped'
    ],
    steps: [
      {
        step: 1,
        instruction: 'Connect Comm Adapter to generator J1939 port',
        expectedResult: 'Adapter lights indicate connection'
      },
      {
        step: 2,
        instruction: 'Launch CAT Electronic Technician',
        expectedResult: 'Software opens'
      },
      {
        step: 3,
        instruction: 'Select the PowerWizard ECM',
        expectedResult: 'Controller connected'
      },
      {
        step: 4,
        instruction: 'Navigate to Diagnostics > Active Codes',
        menuNavigation: ['Diagnostics', 'Active Codes'],
        expectedResult: 'Active fault codes displayed'
      },
      {
        step: 5,
        instruction: 'Select code and click Clear',
        expectedResult: 'Code cleared or moved to logged'
      },
      {
        step: 6,
        instruction: 'Review logged codes for history',
        menuNavigation: ['Diagnostics', 'Logged Codes'],
        expectedResult: 'Complete code history visible'
      }
    ],
    troubleshooting: [
      {
        issue: 'Cannot connect to controller',
        solution: 'Verify Comm Adapter drivers, check J1939 data link wiring'
      },
      {
        issue: 'Code will not clear',
        solution: 'Some codes require the monitored condition to return to normal before clearing'
      }
    ],
    successIndicators: [
      'No active diagnostic codes',
      'Event logged in ET',
      'Generator ready for operation'
    ]
  }
];

// ==================== EXPORT ALL PROCEDURES ====================

export const ALL_RESET_PROCEDURES: ResetProcedure[] = [
  ...DSE_RESET_PROCEDURES,
  ...COMAP_RESET_PROCEDURES,
  ...WOODWARD_RESET_PROCEDURES,
  ...SMARTGEN_RESET_PROCEDURES,
  ...POWERWIZARD_RESET_PROCEDURES,
];

// Get procedures by brand
export function getResetProceduresByBrand(brand: string): ResetProcedure[] {
  return ALL_RESET_PROCEDURES.filter(p =>
    p.brand.toLowerCase().includes(brand.toLowerCase())
  );
}

// Get procedures by model
export function getResetProceduresByModel(model: string): ResetProcedure[] {
  return ALL_RESET_PROCEDURES.filter(p =>
    p.model.toLowerCase().includes(model.toLowerCase()) ||
    p.model === 'All Models'
  );
}

// Get procedure by ID
export function getResetProcedureById(id: string): ResetProcedure | undefined {
  return ALL_RESET_PROCEDURES.find(p => p.id === id);
}
