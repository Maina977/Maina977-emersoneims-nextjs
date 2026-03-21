/**
 * Generator Oracle - Interactive Troubleshooting System
 *
 * Comprehensive diagnostic flowcharts for real-world generator issues.
 * Includes ECM/Controller, Engine Performance, and Electrical troubleshooting.
 *
 * COPYRIGHT-SAFE APPROACH:
 * ========================
 * - All procedures are INDEPENDENTLY DEVELOPED
 * - Based on general industry knowledge and field experience
 * - Brand names used for IDENTIFICATION PURPOSES ONLY
 *
 * DISCLAIMER:
 * ===========
 * This is an INDEPENDENT reference tool. All diagnostic procedures are
 * independently developed and may differ from official manufacturer guidance.
 * Generator Oracle is not affiliated with any equipment manufacturer.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TroubleshootingCategory =
  | 'ecm-controller'
  | 'engine-performance'
  | 'electrical'
  | 'fuel-system'
  | 'cooling'
  | 'starting'
  | 'load-management';

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface TechnicianQuestion {
  id: string;
  question: string;
  questionType: 'yes-no' | 'multiple-choice' | 'numeric' | 'text';
  options?: { value: string; label: string; nextStepId: string }[];
  yesNextStepId?: string;
  noNextStepId?: string;
  helpText?: string;
  warningText?: string;
}

export interface DiagnosticStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  details: string[];
  tools: string[];
  safetyWarnings?: string[];
  expectedResult: string;
  timeEstimate: string;
  media?: { type: 'image' | 'video' | 'diagram'; url: string; caption: string }[];
  technicianQuestion?: TechnicianQuestion;
  ifSuccess: string; // Next step ID or 'RESOLVED'
  ifFailure: string; // Next step ID or escalation
  troubleTips?: string[];
}

export interface PossibleCauseRanked {
  cause: string;
  probability: 'very-high' | 'high' | 'medium' | 'low';
  probabilityPercent: number;
  explanation: string;
  verificationMethod: string;
  partNumbers?: { description: string; commonParts: string[] }[];
  estimatedCost?: { labor: string; parts: string };
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  partNumbers?: { description: string; commonParts: string[] }[];
  tools: string[];
  timeEstimate: string;
  skillLevel: DifficultyLevel;
  verificationSteps: string[];
}

export interface EscalationPath {
  condition: string;
  recommendation: string;
  contactType: 'dealer' | 'specialist' | 'manufacturer' | 'remote-support';
  urgency: UrgencyLevel;
  informationToProvide: string[];
}

export interface RelatedIssue {
  issueId: string;
  relationship: 'often-occurs-with' | 'may-cause' | 'caused-by' | 'similar-symptoms';
  description: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  keywords: string[]; // For SEO and search
  category: TroubleshootingCategory;
  subcategory: string;
  description: string;
  urgency: UrgencyLevel;
  difficulty: DifficultyLevel;
  estimatedTime: string;

  // Initial assessment
  initialQuestions: TechnicianQuestion[];

  // Diagnostic flow
  diagnosticSteps: DiagnosticStep[];

  // Causes and solutions
  possibleCauses: PossibleCauseRanked[];
  solutions: Solution[];

  // Required resources
  requiredTools: { name: string; essential: boolean; alternatives?: string[] }[];
  requiredEquipment: string[];

  // Follow-up
  followUpQuestions: { question: string; ifYes: string; ifNo: string }[];
  checkpoints: { afterStep: number; question: string; stuckAction: string }[];

  // Escalation and related
  escalationPath: EscalationPath;
  relatedIssues: RelatedIssue[];

  // Progress tracking
  progressMilestones: { milestone: string; completionPercent: number }[];

  // Additional info
  commonMistakes: string[];
  preventiveMeasures: string[];
  technicalNotes?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM/CONTROLLER TROUBLESHOOTING SCENARIOS
// ═══════════════════════════════════════════════════════════════════════════════

export const ECM_CONTROLLER_SCENARIOS: TroubleshootingScenario[] = [
  // Scenario 1: ECM Not Communicating with Controller
  {
    id: 'ecm-no-communication',
    title: 'ECM Not Communicating with Controller',
    keywords: ['ECM', 'no communication', 'J1939', 'CAN bus', 'controller not reading ECM', 'no data link'],
    category: 'ecm-controller',
    subcategory: 'communication',
    description: 'The generator controller is not receiving data from the engine ECM. No engine parameters displayed, or showing dashes/zeros for RPM, oil pressure, coolant temp.',
    urgency: 'high',
    difficulty: 'intermediate',
    estimatedTime: '30-60 minutes',

    initialQuestions: [
      {
        id: 'iq-1',
        question: 'Is this a new installation or did it stop working on an existing system?',
        questionType: 'multiple-choice',
        options: [
          { value: 'new', label: 'New installation - never worked', nextStepId: 'step-new-install' },
          { value: 'existing', label: 'Was working before - stopped suddenly', nextStepId: 'step-sudden-fail' },
          { value: 'intermittent', label: 'Works sometimes, fails sometimes', nextStepId: 'step-intermittent' }
        ],
        helpText: 'This helps determine if the issue is configuration or hardware related'
      },
      {
        id: 'iq-2',
        question: 'Are there any fault codes displayed on the controller?',
        questionType: 'yes-no',
        yesNextStepId: 'step-check-codes',
        noNextStepId: 'step-check-power',
        helpText: 'Look for J1939 timeout, CAN error, or communication fault codes'
      },
      {
        id: 'iq-3',
        question: 'Does the engine start and run?',
        questionType: 'yes-no',
        yesNextStepId: 'step-engine-runs',
        noNextStepId: 'step-engine-no-start',
        helpText: 'If the engine runs but controller shows no data, ECM is likely functioning'
      }
    ],

    diagnosticSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Check CAN Bus Termination Resistance',
        instruction: 'Measure the resistance between CAN_H and CAN_L with all power OFF',
        details: [
          'Turn off all power to the system',
          'Locate the CAN bus connector (typically 9-pin Deutsch)',
          'Identify CAN_H (usually pin A or yellow wire) and CAN_L (usually pin B or green wire)',
          'Set multimeter to resistance (ohms)',
          'Measure between CAN_H and CAN_L'
        ],
        tools: ['Digital multimeter', 'Wiring diagram'],
        safetyWarnings: ['Ensure all power is OFF before measuring'],
        expectedResult: 'Should read approximately 60Ω (two 120Ω terminators in parallel)',
        timeEstimate: '5 minutes',
        technicianQuestion: {
          id: 'tq-1',
          question: 'What resistance did you measure?',
          questionType: 'multiple-choice',
          options: [
            { value: '60', label: '55-65Ω (correct)', nextStepId: 'step-2' },
            { value: '120', label: '115-125Ω (one terminator missing)', nextStepId: 'step-add-terminator' },
            { value: 'high', label: '>200Ω or OL (open circuit)', nextStepId: 'step-check-wiring' },
            { value: 'low', label: '<40Ω (possible short)', nextStepId: 'step-find-short' }
          ]
        },
        ifSuccess: 'step-2',
        ifFailure: 'step-check-wiring',
        troubleTips: [
          'If reading OL, check for broken wires',
          'If reading very low, check for CAN_H to CAN_L short'
        ]
      },
      {
        id: 'step-add-terminator',
        stepNumber: 2,
        title: 'Add Missing Termination Resistor',
        instruction: 'Install a 120Ω termination resistor at the end of the CAN bus',
        details: [
          'CAN bus requires exactly two 120Ω terminators - one at each end',
          'If reading 120Ω, one terminator is missing',
          'Locate the end of the CAN bus furthest from existing terminator',
          'Install 120Ω 1/4W resistor between CAN_H and CAN_L',
          'Or use a purpose-built termination plug'
        ],
        tools: ['120Ω resistor (1/4W minimum)', 'Soldering iron or terminal crimper'],
        expectedResult: 'Resistance now measures 60Ω',
        timeEstimate: '15 minutes',
        ifSuccess: 'step-2',
        ifFailure: 'step-check-wiring'
      },
      {
        id: 'step-2',
        stepNumber: 3,
        title: 'Verify ECM Power Supply',
        instruction: 'Check that the ECM has proper power and ground',
        details: [
          'Turn key switch to ON (do not start)',
          'Locate ECM power connector',
          'Measure voltage at ECM power input pins',
          'Should be battery voltage (24V or 12V system)',
          'Check ground circuit - should be less than 0.5V drop'
        ],
        tools: ['Digital multimeter', 'ECM pinout diagram'],
        safetyWarnings: ['Do not probe pins with ECM powered - use back-probing'],
        expectedResult: '24V (or 12V) at power pins, <0.5V at ground',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-2',
          question: 'Is ECM power supply correct?',
          questionType: 'yes-no',
          yesNextStepId: 'step-3',
          noNextStepId: 'step-fix-power'
        },
        ifSuccess: 'step-3',
        ifFailure: 'step-fix-power'
      },
      {
        id: 'step-fix-power',
        stepNumber: 4,
        title: 'Repair ECM Power Circuit',
        instruction: 'Trace and repair the ECM power supply issue',
        details: [
          'Check ECM power fuse - typically 10-15A',
          'Check ECM power relay if equipped',
          'Trace power wire from battery to ECM',
          'Check for corroded connections',
          'Verify key switch signal reaching ECM'
        ],
        tools: ['Multimeter', 'Wiring diagram', 'Fuse tester'],
        expectedResult: 'ECM receives proper power when key is ON',
        timeEstimate: '20 minutes',
        ifSuccess: 'step-3',
        ifFailure: 'escalate'
      },
      {
        id: 'step-3',
        stepNumber: 5,
        title: 'Check CAN Bus Signal with Oscilloscope',
        instruction: 'Verify CAN bus signals are present and correct',
        details: [
          'Connect oscilloscope to CAN_H and CAN_L',
          'Turn key ON, observe waveform',
          'CAN_H should swing between 2.5V and 3.5V',
          'CAN_L should swing between 2.5V and 1.5V',
          'Look for clean, regular square waves'
        ],
        tools: ['Oscilloscope', 'CAN bus adapter or direct probes'],
        expectedResult: 'Clean square waves at 250kbps (J1939 standard)',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-3',
          question: 'Do you see proper CAN signals?',
          questionType: 'multiple-choice',
          options: [
            { value: 'good', label: 'Yes, clean square waves', nextStepId: 'step-4' },
            { value: 'noisy', label: 'Noisy or distorted signals', nextStepId: 'step-check-interference' },
            { value: 'none', label: 'No signals at all', nextStepId: 'step-ecm-output' },
            { value: 'no-scope', label: 'No oscilloscope available', nextStepId: 'step-3-alt' }
          ]
        },
        ifSuccess: 'step-4',
        ifFailure: 'step-ecm-output'
      },
      {
        id: 'step-3-alt',
        stepNumber: 6,
        title: 'Alternative: Check CAN Activity with Multimeter',
        instruction: 'Without oscilloscope, check for CAN bus activity using AC voltage',
        details: [
          'Set multimeter to AC voltage',
          'Measure between CAN_H and CAN_L with key ON',
          'Active CAN bus shows 0.5-2V AC',
          'No activity shows near 0V AC',
          'This is a rough check - oscilloscope preferred'
        ],
        tools: ['Digital multimeter with AC capability'],
        expectedResult: '0.5-2V AC indicates CAN activity',
        timeEstimate: '5 minutes',
        ifSuccess: 'step-4',
        ifFailure: 'step-ecm-output'
      },
      {
        id: 'step-4',
        stepNumber: 7,
        title: 'Verify J1939 Address Configuration',
        instruction: 'Check that ECM and Controller are using correct J1939 addresses',
        details: [
          'Engine ECM typically uses source address 0 (engine #1)',
          'Generator controller typically uses address 128 or higher',
          'Check controller J1939 settings menu',
          'Verify "Engine Address" or "ECM Address" setting matches actual ECM',
          'Common ECM addresses: 0 (engine), 3 (transmission), 17 (instrument cluster)'
        ],
        tools: ['Controller manual', 'ECM documentation'],
        expectedResult: 'Controller configured to listen to correct ECM address',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-4',
          question: 'Is the J1939 address configuration correct?',
          questionType: 'yes-no',
          yesNextStepId: 'step-5',
          noNextStepId: 'step-fix-address'
        },
        ifSuccess: 'step-5',
        ifFailure: 'step-fix-address'
      },
      {
        id: 'step-5',
        stepNumber: 8,
        title: 'Test with Known Good Components',
        instruction: 'If available, swap controller or ECM to isolate the fault',
        details: [
          'If you have a spare controller, connect it temporarily',
          'If spare ECM available, this is more involved swap',
          'Use a CAN bus analyzer tool if available',
          'Check if other J1939 devices on bus are communicating',
          'This helps isolate whether fault is ECM, controller, or wiring'
        ],
        tools: ['Spare controller (if available)', 'CAN bus analyzer (optional)'],
        expectedResult: 'Identify whether ECM, controller, or wiring is at fault',
        timeEstimate: '30 minutes',
        ifSuccess: 'RESOLVED',
        ifFailure: 'escalate'
      }
    ],

    possibleCauses: [
      {
        cause: 'Missing or incorrect CAN bus termination',
        probability: 'very-high',
        probabilityPercent: 35,
        explanation: 'J1939 requires exactly two 120Ω terminators. Missing termination causes signal reflections and communication errors.',
        verificationMethod: 'Measure 60Ω between CAN_H and CAN_L with power off',
        partNumbers: [{ description: '120Ω termination resistor', commonParts: ['Generic 120Ω 1/4W', 'J1939 termination plug'] }],
        estimatedCost: { labor: '15 minutes', parts: '$5-20' }
      },
      {
        cause: 'CAN_H and CAN_L wires swapped',
        probability: 'high',
        probabilityPercent: 25,
        explanation: 'If CAN_H and CAN_L are reversed at any connection point, communication fails completely.',
        verificationMethod: 'Trace wiring and verify polarity at all connectors',
        estimatedCost: { labor: '30 minutes', parts: '$0' }
      },
      {
        cause: 'ECM power supply fault',
        probability: 'high',
        probabilityPercent: 20,
        explanation: 'ECM needs stable power to operate. Low voltage or poor ground causes intermittent or no communication.',
        verificationMethod: 'Measure ECM supply voltage and ground',
        estimatedCost: { labor: '30 minutes', parts: '$0-50 (fuse/relay)' }
      },
      {
        cause: 'Damaged CAN bus wiring',
        probability: 'medium',
        probabilityPercent: 10,
        explanation: 'Chafed, cut, or corroded CAN wires cause communication failures.',
        verificationMethod: 'Visual inspection and continuity test of CAN wiring',
        estimatedCost: { labor: '1-2 hours', parts: '$20-100' }
      },
      {
        cause: 'Wrong J1939 address configuration',
        probability: 'medium',
        probabilityPercent: 5,
        explanation: 'Controller must be configured to listen to the correct ECM source address.',
        verificationMethod: 'Check controller J1939 settings against ECM documentation',
        estimatedCost: { labor: '15 minutes', parts: '$0' }
      },
      {
        cause: 'ECM internal failure',
        probability: 'low',
        probabilityPercent: 5,
        explanation: 'ECM CAN transceiver or processor failure. Less common but possible.',
        verificationMethod: 'Test with known good ECM or CAN analyzer',
        partNumbers: [{ description: 'Replacement ECM', commonParts: ['Per engine model'] }],
        estimatedCost: { labor: '2-4 hours', parts: '$1500-5000' }
      }
    ],

    solutions: [
      {
        id: 'sol-1',
        title: 'Install CAN Bus Termination',
        description: 'Add missing 120Ω termination resistor to CAN bus',
        steps: [
          'Turn off all power',
          'Locate end of CAN bus (furthest point from existing terminator)',
          'Install 120Ω resistor between CAN_H and CAN_L',
          'Use heat shrink or terminal block for secure connection',
          'Power on and test communication'
        ],
        partNumbers: [{ description: 'Termination resistor', commonParts: ['120Ω 1/4W resistor', 'Deutsch termination plug 120Ω'] }],
        tools: ['Soldering iron or crimper', 'Heat shrink'],
        timeEstimate: '15-30 minutes',
        skillLevel: 'basic',
        verificationSteps: ['Measure 60Ω between CAN_H and CAN_L', 'Controller shows ECM data']
      },
      {
        id: 'sol-2',
        title: 'Repair CAN Bus Wiring',
        description: 'Trace and repair damaged CAN bus wiring',
        steps: [
          'Obtain wiring diagram for the system',
          'Visually inspect entire CAN bus run',
          'Check for chafing, cuts, corrosion',
          'Test continuity of CAN_H and CAN_L end to end',
          'Repair any damaged sections with proper shielded twisted pair',
          'Verify proper CAN_H/CAN_L polarity at all connections'
        ],
        tools: ['Multimeter', 'Wire strippers', 'Crimpers', 'Heat shrink'],
        timeEstimate: '1-2 hours',
        skillLevel: 'intermediate',
        verificationSteps: ['Continuity test passes', 'Termination resistance correct', 'Communication restored']
      }
    ],

    requiredTools: [
      { name: 'Digital multimeter', essential: true },
      { name: 'Oscilloscope', essential: false, alternatives: ['CAN bus analyzer', 'Diagnostic laptop'] },
      { name: 'Wiring diagrams', essential: true },
      { name: 'J1939 pinout reference', essential: true }
    ],
    requiredEquipment: ['Access to ECM and controller connectors', 'Battery charger (to maintain voltage)'],

    followUpQuestions: [
      { question: 'Is the controller now showing ECM data?', ifYes: 'Issue resolved. Monitor for intermittent problems.', ifNo: 'Continue to next diagnostic step or escalate.' },
      { question: 'Are all engine parameters displaying correctly?', ifYes: 'Verify readings match actual conditions.', ifNo: 'Check individual sensor inputs to ECM.' }
    ],

    checkpoints: [
      { afterStep: 2, question: 'Are you still stuck on termination issues?', stuckAction: 'Try disconnecting all devices except ECM and controller, test with minimal bus.' },
      { afterStep: 5, question: 'Have you verified CAN signals but still no communication?', stuckAction: 'Check J1939 baud rate - should be 250kbps. Some older systems use 500kbps.' }
    ],

    escalationPath: {
      condition: 'Unable to establish communication after completing all steps',
      recommendation: 'Contact ECM manufacturer technical support or authorized dealer',
      contactType: 'dealer',
      urgency: 'high',
      informationToProvide: [
        'ECM model and serial number',
        'Controller model and firmware version',
        'CAN bus termination resistance measured',
        'Voltage readings at ECM',
        'Any fault codes displayed',
        'Wiring diagram of installation'
      ]
    },

    relatedIssues: [
      { issueId: 'ecm-reprogramming', relationship: 'may-cause', description: 'After ECM reprogramming, J1939 settings may need reconfiguration' },
      { issueId: 'controller-wrong-readings', relationship: 'often-occurs-with', description: 'Intermittent communication causes erratic readings' }
    ],

    progressMilestones: [
      { milestone: 'Termination verified', completionPercent: 25 },
      { milestone: 'ECM power confirmed', completionPercent: 50 },
      { milestone: 'CAN signals verified', completionPercent: 75 },
      { milestone: 'Communication established', completionPercent: 100 }
    ],

    commonMistakes: [
      'Forgetting to install termination resistors',
      'Swapping CAN_H and CAN_L at one connector',
      'Using wrong baud rate (J1939 is always 250kbps)',
      'Not verifying ECM power before checking CAN bus',
      'Running CAN wires parallel to high-current cables'
    ],

    preventiveMeasures: [
      'Always verify termination when adding J1939 devices',
      'Use shielded twisted pair for CAN wiring',
      'Keep CAN wires away from alternator and starter cables',
      'Document J1939 addresses for all devices in system',
      'Perform communication test after any wiring changes'
    ]
  },

  // Scenario 2: ECM Needs Reprogramming
  {
    id: 'ecm-reprogramming',
    title: 'ECM Needs Reprogramming',
    keywords: ['ECM reprogramming', 'flash ECM', 'update firmware', 'calibration', 'ECM software', 'reflash'],
    category: 'ecm-controller',
    subcategory: 'programming',
    description: 'ECM requires firmware update, calibration change, or parameter reconfiguration. May be needed after ECM replacement, engine modification, or to fix known software issues.',
    urgency: 'medium',
    difficulty: 'advanced',
    estimatedTime: '1-2 hours',

    initialQuestions: [
      {
        id: 'iq-1',
        question: 'Why does the ECM need reprogramming?',
        questionType: 'multiple-choice',
        options: [
          { value: 'new-ecm', label: 'New/replacement ECM installed', nextStepId: 'step-new-ecm' },
          { value: 'update', label: 'Firmware update required', nextStepId: 'step-update' },
          { value: 'config', label: 'Parameter/calibration change', nextStepId: 'step-config' },
          { value: 'fault', label: 'ECM fault code indicates reprogramming needed', nextStepId: 'step-fault' }
        ]
      },
      {
        id: 'iq-2',
        question: 'Do you have the required software and adapter?',
        questionType: 'yes-no',
        yesNextStepId: 'step-verify-tools',
        noNextStepId: 'step-get-tools',
        helpText: 'ECM programming requires manufacturer-specific software and communication adapter'
      },
      {
        id: 'iq-3',
        question: 'What is the ECM manufacturer?',
        questionType: 'multiple-choice',
        options: [
          { value: 'cat', label: 'Caterpillar (ADEM)', nextStepId: 'step-cat' },
          { value: 'cummins', label: 'Cummins (CM series)', nextStepId: 'step-cummins' },
          { value: 'volvo', label: 'Volvo Penta (EMS)', nextStepId: 'step-volvo' },
          { value: 'perkins', label: 'Perkins', nextStepId: 'step-perkins' },
          { value: 'mtu', label: 'MTU (ADEC)', nextStepId: 'step-mtu' },
          { value: 'deere', label: 'John Deere (PowerTech)', nextStepId: 'step-deere' },
          { value: 'other', label: 'Other/Unknown', nextStepId: 'step-identify' }
        ]
      }
    ],

    diagnosticSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Gather Required Information',
        instruction: 'Collect all necessary information before starting programming',
        details: [
          'Record engine serial number (on engine dataplate)',
          'Record ECM part number (on ECM label)',
          'Record current software version (if accessible)',
          'Note any current fault codes',
          'Photograph injector trim codes if visible'
        ],
        tools: ['Flashlight', 'Camera/phone'],
        expectedResult: 'All engine and ECM identification recorded',
        timeEstimate: '10 minutes',
        ifSuccess: 'step-2',
        ifFailure: 'step-2'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Verify Prerequisites',
        instruction: 'Ensure all requirements are met before programming',
        details: [
          'Battery fully charged (>24V for 24V system)',
          'Connect battery charger to maintain voltage',
          'All accessories OFF',
          'Engine at rest, key ON',
          'Laptop fully charged or connected to power',
          'Adequate ventilation (no engine running during flash)'
        ],
        tools: ['Battery charger', 'Multimeter'],
        safetyWarnings: [
          'LOW VOLTAGE DURING PROGRAMMING CAN PERMANENTLY DAMAGE ECM',
          'Do not disconnect battery during programming',
          'Do not turn key off during programming'
        ],
        expectedResult: 'All prerequisites verified',
        timeEstimate: '5 minutes',
        technicianQuestion: {
          id: 'tq-1',
          question: 'Is battery voltage stable above 24V with charger connected?',
          questionType: 'yes-no',
          yesNextStepId: 'step-3',
          noNextStepId: 'step-charge-battery'
        },
        ifSuccess: 'step-3',
        ifFailure: 'step-charge-battery'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Connect Diagnostic Adapter',
        instruction: 'Connect communication adapter between laptop and ECM',
        details: [
          'Locate diagnostic connector (usually 9-pin Deutsch near ECM)',
          'Connect adapter to diagnostic port',
          'Connect USB cable from adapter to laptop',
          'Verify adapter power LED illuminates',
          'Install adapter drivers if not already installed'
        ],
        tools: ['Communication adapter (CA3, Inline, etc.)', 'USB cable', 'Laptop'],
        expectedResult: 'Adapter connected and recognized by computer',
        timeEstimate: '5 minutes',
        ifSuccess: 'step-4',
        ifFailure: 'step-adapter-troubleshoot'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Launch Programming Software and Connect',
        instruction: 'Open manufacturer software and establish ECM connection',
        details: [
          'Launch ECM software (CAT ET, INSITE, VODIA, etc.)',
          'Select correct communication adapter',
          'Select correct protocol (typically J1939)',
          'Click Connect or equivalent',
          'Wait for ECM detection'
        ],
        tools: ['Manufacturer diagnostic software'],
        expectedResult: 'Software connected to ECM, ECM information displayed',
        timeEstimate: '2 minutes',
        technicianQuestion: {
          id: 'tq-2',
          question: 'Did the software successfully connect to the ECM?',
          questionType: 'yes-no',
          yesNextStepId: 'step-5',
          noNextStepId: 'step-connection-troubleshoot'
        },
        ifSuccess: 'step-5',
        ifFailure: 'step-connection-troubleshoot'
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'Backup Current ECM Configuration',
        instruction: 'CRITICAL: Save current ECM data before making any changes',
        details: [
          'Navigate to flash programming or service menu',
          'Select Read ECM or Download Configuration',
          'Save file with descriptive name (serial_date.ecm)',
          'Save to BOTH laptop and USB drive',
          'Verify file saved successfully',
          'This is your ONLY recovery option if programming fails'
        ],
        tools: ['USB flash drive'],
        safetyWarnings: ['ALWAYS backup before programming - no exceptions'],
        expectedResult: 'ECM configuration file saved',
        timeEstimate: '5 minutes',
        ifSuccess: 'step-6',
        ifFailure: 'step-6'
      },
      {
        id: 'step-6',
        stepNumber: 6,
        title: 'Download Correct Flash File',
        instruction: 'Obtain the correct firmware/calibration file for your engine',
        details: [
          'Access manufacturer software subscription (SIS, QuickServe, etc.)',
          'Enter engine serial number',
          'Navigate to Software/Flash Files section',
          'Verify file matches ECM suffix/hardware level',
          'Download flash file to laptop',
          'Note any special instructions or prerequisites'
        ],
        tools: ['Internet access', 'Software subscription'],
        expectedResult: 'Correct flash file downloaded',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-3',
          question: 'Have you verified the flash file matches your ECM hardware level?',
          questionType: 'yes-no',
          yesNextStepId: 'step-7',
          noNextStepId: 'step-verify-flash',
          warningText: 'Wrong flash file can permanently damage ECM'
        },
        ifSuccess: 'step-7',
        ifFailure: 'step-verify-flash'
      },
      {
        id: 'step-7',
        stepNumber: 7,
        title: 'Perform ECM Flash Programming',
        instruction: 'Flash the new firmware to the ECM',
        details: [
          'Navigate to Service > Flash Programming > Flash ECM',
          'Select the downloaded flash file',
          'Verify battery voltage one more time (>24V)',
          'Click Start Programming',
          'DO NOT touch keyboard, mouse, adapter, or vehicle during flash',
          'Wait for completion (typically 15-30 minutes)',
          'ECM may restart multiple times - this is normal'
        ],
        tools: [],
        safetyWarnings: [
          'DO NOT interrupt programming for any reason',
          'DO NOT turn key off',
          'DO NOT disconnect adapter or battery',
          'Interrupted flash = bricked ECM'
        ],
        expectedResult: 'Programming Complete message displayed',
        timeEstimate: '15-30 minutes',
        ifSuccess: 'step-8',
        ifFailure: 'step-flash-failed'
      },
      {
        id: 'step-8',
        stepNumber: 8,
        title: 'Enter Customer Parameters',
        instruction: 'Restore or enter customer-specific settings',
        details: [
          'Navigate to Configuration menu',
          'Verify/set engine serial number',
          'Set rated speed (1500 or 1800 RPM)',
          'Set rated power',
          'Configure protection setpoints',
          'Enter injector trim codes if required',
          'Set J1939 source address if different from default'
        ],
        tools: ['Injector trim codes (from injector labels)'],
        expectedResult: 'All customer parameters configured',
        timeEstimate: '15 minutes',
        ifSuccess: 'step-9',
        ifFailure: 'step-9'
      },
      {
        id: 'step-9',
        stepNumber: 9,
        title: 'Clear Fault Codes and Verify',
        instruction: 'Clear any programming-related faults and verify configuration',
        details: [
          'Navigate to Diagnostics > Active Codes',
          'Clear any codes that appeared during programming',
          'Verify no active fault codes remain',
          'Check that all readings appear reasonable',
          'Verify J1939 communication with controller'
        ],
        tools: [],
        expectedResult: 'No active fault codes, configuration verified',
        timeEstimate: '5 minutes',
        ifSuccess: 'step-10',
        ifFailure: 'step-9'
      },
      {
        id: 'step-10',
        stepNumber: 10,
        title: 'Test Engine Operation',
        instruction: 'Start engine and verify correct operation',
        details: [
          'Disconnect diagnostic adapter',
          'Start engine and allow to idle',
          'Monitor oil pressure, coolant temp, RPM',
          'Listen for abnormal sounds',
          'Run at rated speed for 5 minutes',
          'Apply load and verify performance',
          'Check for any new fault codes'
        ],
        tools: ['Load bank (optional)'],
        expectedResult: 'Engine runs smoothly, all parameters normal',
        timeEstimate: '15 minutes',
        ifSuccess: 'RESOLVED',
        ifFailure: 'step-troubleshoot-operation'
      }
    ],

    possibleCauses: [
      {
        cause: 'New ECM requires initial programming',
        probability: 'very-high',
        probabilityPercent: 40,
        explanation: 'New replacement ECMs are shipped blank or with default calibration. They must be programmed with engine-specific calibration.',
        verificationMethod: 'Check if ECM was recently replaced',
        estimatedCost: { labor: '1-2 hours', parts: '$0 (software subscription)' }
      },
      {
        cause: 'Firmware update to fix known issue',
        probability: 'high',
        probabilityPercent: 25,
        explanation: 'Manufacturer released software update to address performance issue, fault code, or compatibility.',
        verificationMethod: 'Check technical bulletins for your engine serial',
        estimatedCost: { labor: '1 hour', parts: '$0' }
      },
      {
        cause: 'Calibration change for modified engine',
        probability: 'medium',
        probabilityPercent: 20,
        explanation: 'Engine modifications (injectors, turbo, fuel system) require matching calibration update.',
        verificationMethod: 'Review what modifications were made',
        estimatedCost: { labor: '1-2 hours', parts: '$0' }
      },
      {
        cause: 'Corrupted ECM software',
        probability: 'low',
        probabilityPercent: 10,
        explanation: 'Previous incomplete flash, voltage spike, or ECM fault corrupted software.',
        verificationMethod: 'ECM shows software corruption or invalid calibration fault',
        estimatedCost: { labor: '1-2 hours', parts: '$0' }
      },
      {
        cause: 'Wrong calibration installed',
        probability: 'low',
        probabilityPercent: 5,
        explanation: 'Previous programmer installed wrong calibration file.',
        verificationMethod: 'Compare installed calibration to engine serial requirements',
        estimatedCost: { labor: '1 hour', parts: '$0' }
      }
    ],

    solutions: [
      {
        id: 'sol-1',
        title: 'Standard ECM Reflash Procedure',
        description: 'Complete ECM programming with correct calibration',
        steps: [
          'Verify battery voltage and connect charger',
          'Connect diagnostic adapter',
          'Backup current configuration',
          'Download correct flash file using engine serial',
          'Perform flash programming',
          'Enter customer parameters',
          'Clear codes and test'
        ],
        tools: ['Diagnostic adapter', 'Manufacturer software', 'Battery charger'],
        timeEstimate: '1-2 hours',
        skillLevel: 'advanced',
        verificationSteps: ['No active fault codes', 'Engine starts and runs normally', 'Parameters match requirements']
      }
    ],

    requiredTools: [
      { name: 'Manufacturer diagnostic adapter', essential: true, alternatives: ['Third-party J1939 adapter (limited function)'] },
      { name: 'Manufacturer diagnostic software', essential: true },
      { name: 'Software subscription (SIS, QuickServe, etc.)', essential: true },
      { name: 'Laptop with Windows', essential: true },
      { name: 'Battery charger (40A minimum)', essential: true }
    ],
    requiredEquipment: ['Stable power supply', 'Engine dataplate information', 'Injector trim codes'],

    followUpQuestions: [
      { question: 'Does the engine start and run normally after programming?', ifYes: 'Programming successful. Document calibration version.', ifNo: 'Check fault codes and parameter settings.' },
      { question: 'Are all fault codes cleared?', ifYes: 'Continue with operational testing.', ifNo: 'Address remaining fault codes before returning to service.' }
    ],

    checkpoints: [
      { afterStep: 5, question: 'Did you successfully backup the current configuration?', stuckAction: 'If backup fails, do not proceed. Troubleshoot connection first.' },
      { afterStep: 7, question: 'Did the flash programming complete without errors?', stuckAction: 'If flash failed, try again. If ECM not responding, may need bench recovery.' }
    ],

    escalationPath: {
      condition: 'ECM not responding after flash attempt, or unable to complete programming',
      recommendation: 'Contact ECM manufacturer for bench reprogramming or replacement evaluation',
      contactType: 'manufacturer',
      urgency: 'high',
      informationToProvide: [
        'ECM part number and serial number',
        'Engine serial number',
        'What flash file was attempted',
        'At what point programming failed',
        'Any error messages displayed',
        'Current ECM response (any LEDs, communication?)'
      ]
    },

    relatedIssues: [
      { issueId: 'new-ecm-not-working', relationship: 'often-occurs-with', description: 'New ECM requires programming before operation' },
      { issueId: 'ecm-no-communication', relationship: 'may-cause', description: 'Failed programming can cause communication loss' }
    ],

    progressMilestones: [
      { milestone: 'Prerequisites verified', completionPercent: 10 },
      { milestone: 'Connected to ECM', completionPercent: 25 },
      { milestone: 'Backup completed', completionPercent: 40 },
      { milestone: 'Flash file downloaded', completionPercent: 55 },
      { milestone: 'Programming complete', completionPercent: 80 },
      { milestone: 'Parameters configured', completionPercent: 90 },
      { milestone: 'Engine tested', completionPercent: 100 }
    ],

    commonMistakes: [
      'Not maintaining battery voltage during flash',
      'Using wrong flash file for ECM hardware level',
      'Not backing up before programming',
      'Interrupting flash process',
      'Forgetting to enter injector trim codes',
      'Not clearing fault codes after programming'
    ],

    preventiveMeasures: [
      'Always use battery charger during programming',
      'Verify flash file matches ECM suffix before starting',
      'Keep backup of all ECM configurations',
      'Document injector trim codes before removing injectors',
      'Maintain software subscription for updates'
    ],

    technicalNotes: [
      'J1939 standard baud rate is 250kbps',
      'Most ECMs use 24V nominal, minimum 18V for operation',
      'Flash programming typically takes 15-30 minutes',
      'Some ECMs require specific sequence to enter programming mode'
    ]
  },

  // Scenario 3: New ECM Not Working After Replacement
  {
    id: 'new-ecm-not-working',
    title: 'New ECM Not Working After Replacement',
    keywords: ['new ECM', 'ECM replacement', 'ECM not working', 'engine wont start new ECM', 'replaced ECM'],
    category: 'ecm-controller',
    subcategory: 'replacement',
    description: 'A new or replacement ECM has been installed but the engine will not start or run properly. Common after ECM replacement.',
    urgency: 'high',
    difficulty: 'advanced',
    estimatedTime: '1-3 hours',

    initialQuestions: [
      {
        id: 'iq-1',
        question: 'Is the replacement ECM new or used?',
        questionType: 'multiple-choice',
        options: [
          { value: 'new-oem', label: 'New from OEM/dealer', nextStepId: 'step-new-oem' },
          { value: 'new-aftermarket', label: 'New aftermarket/reman', nextStepId: 'step-aftermarket' },
          { value: 'used', label: 'Used from another engine', nextStepId: 'step-used' }
        ],
        helpText: 'This determines programming requirements'
      },
      {
        id: 'iq-2',
        question: 'Was the ECM programmed before installation?',
        questionType: 'multiple-choice',
        options: [
          { value: 'yes', label: 'Yes, programmed for this engine', nextStepId: 'step-verify-program' },
          { value: 'no', label: 'No, installed as received', nextStepId: 'step-needs-programming' },
          { value: 'unknown', label: 'Unknown', nextStepId: 'step-check-programming' }
        ]
      },
      {
        id: 'iq-3',
        question: 'What happens when you try to start?',
        questionType: 'multiple-choice',
        options: [
          { value: 'no-crank', label: 'No crank at all', nextStepId: 'step-no-crank' },
          { value: 'crank-no-start', label: 'Cranks but won\'t start', nextStepId: 'step-crank-no-start' },
          { value: 'starts-dies', label: 'Starts then dies', nextStepId: 'step-starts-dies' },
          { value: 'runs-rough', label: 'Runs but poorly', nextStepId: 'step-runs-rough' },
          { value: 'fault-codes', label: 'Fault codes immediately', nextStepId: 'step-fault-codes' }
        ]
      }
    ],

    diagnosticSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Verify ECM Compatibility',
        instruction: 'Confirm the replacement ECM is correct for this engine',
        details: [
          'Compare ECM part number to original',
          'Check ECM suffix - must match or be compatible',
          'Verify ECM is for correct engine model and rating',
          'Check if ECM is for same emissions level (Tier 2, 3, 4, etc.)',
          'Some ECMs have revision levels that affect compatibility'
        ],
        tools: ['Original ECM documentation', 'Parts catalog'],
        expectedResult: 'ECM part number and suffix confirmed compatible',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-1',
          question: 'Does the replacement ECM part number match or exceed the original?',
          questionType: 'yes-no',
          yesNextStepId: 'step-2',
          noNextStepId: 'step-wrong-ecm'
        },
        ifSuccess: 'step-2',
        ifFailure: 'step-wrong-ecm'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Check ECM Power and Ground',
        instruction: 'Verify ECM has proper electrical supply',
        details: [
          'Measure battery voltage - should be 24-28V',
          'Measure voltage at ECM power connector',
          'Check ECM power fuse',
          'Verify ground connections are clean and tight',
          'Check for voltage drop on ground circuit (<0.5V)'
        ],
        tools: ['Digital multimeter', 'Wiring diagram'],
        expectedResult: 'ECM receives proper voltage, ground is good',
        timeEstimate: '10 minutes',
        ifSuccess: 'step-3',
        ifFailure: 'step-fix-power'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Connect Diagnostic Tool',
        instruction: 'Attempt to communicate with the new ECM',
        details: [
          'Connect diagnostic adapter to service port',
          'Launch manufacturer diagnostic software',
          'Attempt to connect to ECM',
          'Note any error messages'
        ],
        tools: ['Diagnostic adapter', 'Laptop with software'],
        expectedResult: 'Software connects to ECM and reads ECM info',
        timeEstimate: '5 minutes',
        technicianQuestion: {
          id: 'tq-2',
          question: 'Can the diagnostic software connect to the ECM?',
          questionType: 'yes-no',
          yesNextStepId: 'step-4',
          noNextStepId: 'step-no-connect'
        },
        ifSuccess: 'step-4',
        ifFailure: 'step-no-connect'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Check ECM Programming Status',
        instruction: 'Verify ECM has correct calibration installed',
        details: [
          'Check installed software/calibration version',
          'Compare to required calibration for this engine',
          'Check if ECM shows "blank" or "default calibration"',
          'Verify engine serial number is programmed',
          'Check rated speed and power settings'
        ],
        tools: ['Diagnostic software'],
        expectedResult: 'ECM has correct calibration, serial number matches',
        timeEstimate: '10 minutes',
        technicianQuestion: {
          id: 'tq-3',
          question: 'Is the ECM programmed with correct calibration?',
          questionType: 'multiple-choice',
          options: [
            { value: 'correct', label: 'Yes, correct calibration', nextStepId: 'step-5' },
            { value: 'blank', label: 'ECM is blank/unprogrammed', nextStepId: 'step-program-ecm' },
            { value: 'wrong', label: 'Wrong calibration installed', nextStepId: 'step-reprogram' },
            { value: 'unknown', label: 'Cannot determine', nextStepId: 'step-verify-cal' }
          ]
        },
        ifSuccess: 'step-5',
        ifFailure: 'step-program-ecm'
      },
      {
        id: 'step-program-ecm',
        stepNumber: 5,
        title: 'Program ECM with Correct Calibration',
        instruction: 'Flash ECM with engine-specific calibration',
        details: [
          'Connect battery charger - maintain voltage above 24V',
          'Download correct flash file using ENGINE serial number',
          'Verify flash file matches ECM hardware suffix',
          'Perform flash programming per manufacturer procedure',
          'Wait for completion without interruption'
        ],
        tools: ['Diagnostic software', 'Flash file', 'Battery charger'],
        safetyWarnings: ['Do not interrupt programming', 'Maintain battery voltage'],
        expectedResult: 'ECM programmed successfully',
        timeEstimate: '30-45 minutes',
        ifSuccess: 'step-5',
        ifFailure: 'step-program-failed'
      },
      {
        id: 'step-5',
        stepNumber: 6,
        title: 'Enter Injector Trim Codes',
        instruction: 'Program injector calibration codes into ECM',
        details: [
          'Each injector has unique trim code on its body',
          'Codes are typically 4-8 alphanumeric characters',
          'Navigate to injector trim in diagnostic software',
          'Enter codes in FIRING ORDER (not physical order)',
          'Firing order varies by engine - consult manual'
        ],
        tools: ['Flashlight', 'Mirror (to see injector codes)'],
        expectedResult: 'All injector trim codes entered correctly',
        timeEstimate: '15 minutes',
        technicianQuestion: {
          id: 'tq-4',
          question: 'Have you entered all injector trim codes?',
          questionType: 'yes-no',
          yesNextStepId: 'step-6',
          noNextStepId: 'step-5-help'
        },
        ifSuccess: 'step-6',
        ifFailure: 'step-5-help',
        troubleTips: [
          'If codes are worn/unreadable, may need to remove injector to read',
          'Some systems allow "average" trim if code unavailable',
          'Wrong trim codes cause rough running and smoke'
        ]
      },
      {
        id: 'step-6',
        stepNumber: 7,
        title: 'Configure Engine Parameters',
        instruction: 'Set engine-specific parameters',
        details: [
          'Set rated speed: 1500 RPM (50Hz) or 1800 RPM (60Hz)',
          'Set rated power per engine dataplate',
          'Configure governor type (isochronous for generator)',
          'Set protection parameters (coolant temp, oil pressure, etc.)',
          'Configure J1939 source address if needed'
        ],
        tools: ['Engine dataplate', 'Installation specifications'],
        expectedResult: 'All parameters set correctly',
        timeEstimate: '15 minutes',
        ifSuccess: 'step-7',
        ifFailure: 'step-7'
      },
      {
        id: 'step-7',
        stepNumber: 8,
        title: 'Clear Fault Codes',
        instruction: 'Clear any codes from programming process',
        details: [
          'Navigate to Diagnostics > Active Codes',
          'Review all active codes',
          'Clear codes that resulted from programming',
          'Note any codes that cannot be cleared (active fault)',
          'Address any remaining active faults'
        ],
        tools: ['Diagnostic software'],
        expectedResult: 'No active fault codes',
        timeEstimate: '5 minutes',
        ifSuccess: 'step-8',
        ifFailure: 'step-address-codes'
      },
      {
        id: 'step-8',
        stepNumber: 9,
        title: 'Attempt Engine Start',
        instruction: 'Start engine and verify operation',
        details: [
          'Disconnect diagnostic adapter',
          'Ensure fuel valve is open',
          'Prime fuel system if needed (after ECM swap)',
          'Attempt start',
          'If no start, check for new fault codes',
          'Allow engine to warm up at idle if started'
        ],
        tools: [],
        expectedResult: 'Engine starts and runs',
        timeEstimate: '5 minutes',
        technicianQuestion: {
          id: 'tq-5',
          question: 'Did the engine start?',
          questionType: 'yes-no',
          yesNextStepId: 'step-9',
          noNextStepId: 'step-no-start-diag'
        },
        ifSuccess: 'step-9',
        ifFailure: 'step-no-start-diag'
      },
      {
        id: 'step-9',
        stepNumber: 10,
        title: 'Verify Engine Operation',
        instruction: 'Confirm engine operates correctly',
        details: [
          'Run engine at idle for 5 minutes',
          'Monitor oil pressure (should be 2.5-5 bar)',
          'Monitor coolant temperature (should rise to 80-90°C)',
          'Increase to rated speed',
          'Apply load if possible',
          'Check for smoke, abnormal sounds',
          'Reconnect diagnostic tool and verify no new codes'
        ],
        tools: ['Load bank (if available)'],
        expectedResult: 'Engine runs normally at all conditions',
        timeEstimate: '15 minutes',
        ifSuccess: 'RESOLVED',
        ifFailure: 'step-operation-fault'
      }
    ],

    possibleCauses: [
      {
        cause: 'ECM not programmed / blank ECM',
        probability: 'very-high',
        probabilityPercent: 50,
        explanation: 'New ECMs are shipped blank or with default calibration. They require engine-specific programming before use.',
        verificationMethod: 'Connect diagnostic tool - will show blank or default calibration',
        estimatedCost: { labor: '1-2 hours', parts: '$0' }
      },
      {
        cause: 'Injector trim codes not entered',
        probability: 'high',
        probabilityPercent: 20,
        explanation: 'Without injector trim codes, engine runs rough or may not start.',
        verificationMethod: 'Check injector trim section in diagnostic software',
        estimatedCost: { labor: '15-30 minutes', parts: '$0' }
      },
      {
        cause: 'Wrong ECM installed',
        probability: 'medium',
        probabilityPercent: 15,
        explanation: 'ECM is for different engine model or wrong hardware level.',
        verificationMethod: 'Compare part numbers - must match suffix',
        estimatedCost: { labor: 'Return and exchange', parts: 'Exchange cost' }
      },
      {
        cause: 'Wiring not connected properly',
        probability: 'medium',
        probabilityPercent: 10,
        explanation: 'A connector not fully seated or pin pushed out during installation.',
        verificationMethod: 'Visual inspection of all ECM connectors',
        estimatedCost: { labor: '30 minutes', parts: '$0' }
      },
      {
        cause: 'ECM security/theft deterrent active',
        probability: 'low',
        probabilityPercent: 5,
        explanation: 'Some ECMs have security features that must be configured.',
        verificationMethod: 'Check for security-related fault codes',
        estimatedCost: { labor: '30 minutes', parts: '$0' }
      }
    ],

    solutions: [
      {
        id: 'sol-1',
        title: 'Complete ECM Initialization',
        description: 'Full programming and configuration of new ECM',
        steps: [
          'Verify correct ECM part number',
          'Connect diagnostic tool',
          'Flash ECM with correct calibration',
          'Enter engine serial number',
          'Enter injector trim codes',
          'Set rated speed and power',
          'Configure protection parameters',
          'Clear codes and test'
        ],
        tools: ['Diagnostic adapter', 'Manufacturer software', 'Flash files', 'Battery charger'],
        timeEstimate: '1-2 hours',
        skillLevel: 'advanced',
        verificationSteps: ['Engine starts', 'No active fault codes', 'All parameters correct']
      }
    ],

    requiredTools: [
      { name: 'OEM diagnostic adapter', essential: true },
      { name: 'OEM diagnostic software', essential: true },
      { name: 'Flash file for engine', essential: true },
      { name: 'Battery charger', essential: true },
      { name: 'Digital multimeter', essential: true }
    ],
    requiredEquipment: ['Engine serial number', 'Injector trim codes', 'Engine dataplate'],

    followUpQuestions: [
      { question: 'Does engine start and run smoothly?', ifYes: 'ECM initialization complete.', ifNo: 'Check fault codes and trim codes.' },
      { question: 'Are all parameters reading correctly?', ifYes: 'Verify J1939 communication.', ifNo: 'Re-enter configuration parameters.' }
    ],

    checkpoints: [
      { afterStep: 3, question: 'Can you communicate with ECM?', stuckAction: 'Check ECM power supply and data link wiring.' },
      { afterStep: 5, question: 'Is programming complete?', stuckAction: 'Verify correct flash file. Check battery voltage was maintained.' }
    ],

    escalationPath: {
      condition: 'ECM will not program or engine will not run after programming',
      recommendation: 'Contact OEM dealer for ECM exchange or bench programming',
      contactType: 'dealer',
      urgency: 'high',
      informationToProvide: [
        'ECM part number attempted',
        'Engine serial number',
        'Flash file version used',
        'Error messages received',
        'Fault codes displayed'
      ]
    },

    relatedIssues: [
      { issueId: 'ecm-reprogramming', relationship: 'often-occurs-with', description: 'New ECM always requires programming' },
      { issueId: 'ecm-no-communication', relationship: 'may-cause', description: 'Unprogrammed ECM may not respond on J1939' }
    ],

    progressMilestones: [
      { milestone: 'ECM compatibility verified', completionPercent: 15 },
      { milestone: 'Communication established', completionPercent: 30 },
      { milestone: 'ECM programmed', completionPercent: 60 },
      { milestone: 'Trim codes entered', completionPercent: 75 },
      { milestone: 'Parameters configured', completionPercent: 85 },
      { milestone: 'Engine running', completionPercent: 100 }
    ],

    commonMistakes: [
      'Installing ECM without programming first',
      'Using flash file for wrong engine serial',
      'Forgetting injector trim codes',
      'Not verifying ECM part number suffix compatibility',
      'Low battery voltage during programming'
    ],

    preventiveMeasures: [
      'Have ECM programmed before installation if possible',
      'Document all injector trim codes before removing injectors',
      'Verify part number compatibility before ordering',
      'Keep backup of original ECM configuration'
    ]
  },

  // Scenario 4: Controller Showing Wrong Readings
  {
    id: 'controller-wrong-readings',
    title: 'Controller Showing Wrong Readings',
    keywords: ['wrong readings', 'incorrect display', 'wrong RPM', 'wrong voltage', 'calibration error', 'sensor error'],
    category: 'ecm-controller',
    subcategory: 'display',
    description: 'Controller display shows incorrect values for RPM, voltage, frequency, temperature, pressure, or other parameters. Readings do not match actual conditions.',
    urgency: 'medium',
    difficulty: 'intermediate',
    estimatedTime: '30-90 minutes',

    initialQuestions: [
      {
        id: 'iq-1',
        question: 'Which readings are incorrect?',
        questionType: 'multiple-choice',
        options: [
          { value: 'rpm', label: 'RPM / Frequency', nextStepId: 'step-rpm' },
          { value: 'voltage', label: 'Voltage / Current', nextStepId: 'step-voltage' },
          { value: 'temp', label: 'Temperature (coolant/oil)', nextStepId: 'step-temp' },
          { value: 'pressure', label: 'Pressure (oil/fuel)', nextStepId: 'step-pressure' },
          { value: 'multiple', label: 'Multiple readings wrong', nextStepId: 'step-multiple' },
          { value: 'all', label: 'All readings zero or dashes', nextStepId: 'step-no-data' }
        ]
      },
      {
        id: 'iq-2',
        question: 'How do you know the readings are wrong?',
        questionType: 'multiple-choice',
        options: [
          { value: 'external', label: 'Compared to external meter', nextStepId: 'step-verify' },
          { value: 'obvious', label: 'Obviously incorrect (e.g., coolant -40°C)', nextStepId: 'step-obvious' },
          { value: 'changed', label: 'Was correct, now wrong', nextStepId: 'step-changed' },
          { value: 'suspect', label: 'Just seems wrong', nextStepId: 'step-verify' }
        ]
      },
      {
        id: 'iq-3',
        question: 'Was any work done recently?',
        questionType: 'multiple-choice',
        options: [
          { value: 'none', label: 'No recent work', nextStepId: 'step-1' },
          { value: 'sensor', label: 'Sensor replaced', nextStepId: 'step-sensor-work' },
          { value: 'controller', label: 'Controller replaced/reset', nextStepId: 'step-config' },
          { value: 'wiring', label: 'Wiring work done', nextStepId: 'step-wiring' },
          { value: 'ecm', label: 'ECM work done', nextStepId: 'step-ecm-work' }
        ]
      }
    ],

    diagnosticSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Verify with External Measurement',
        instruction: 'Confirm readings are actually wrong using calibrated external instruments',
        details: [
          'Use calibrated multimeter for voltage',
          'Use clamp meter for current',
          'Use infrared thermometer for temperature',
          'Use mechanical gauge for pressure',
          'Use tachometer or frequency counter for speed'
        ],
        tools: ['Digital multimeter', 'Clamp meter', 'IR thermometer', 'Tachometer'],
        expectedResult: 'Difference between display and actual value quantified',
        timeEstimate: '15 minutes',
        technicianQuestion: {
          id: 'tq-1',
          question: 'What is the difference between displayed and actual values?',
          questionType: 'multiple-choice',
          options: [
            { value: 'small', label: 'Small difference (<5%)', nextStepId: 'step-calibration' },
            { value: 'large', label: 'Large difference (>20%)', nextStepId: 'step-sensor' },
            { value: 'fixed', label: 'Fixed offset (always +/-X)', nextStepId: 'step-offset' },
            { value: 'random', label: 'Random/fluctuating errors', nextStepId: 'step-noise' },
            { value: 'zero', label: 'Always reads zero', nextStepId: 'step-no-signal' }
          ]
        },
        ifSuccess: 'step-2',
        ifFailure: 'step-2'
      },
      {
        id: 'step-calibration',
        stepNumber: 2,
        title: 'Check Controller Calibration Settings',
        instruction: 'Verify sensor calibration and scaling parameters',
        details: [
          'Access controller configuration menu',
          'Check sensor type settings (match actual sensor)',
          'Check scaling factors (CT ratio, PT ratio, etc.)',
          'Check offset values',
          'Compare to installation documentation'
        ],
        tools: ['Controller manual', 'Installation specifications'],
        expectedResult: 'Calibration settings match actual hardware',
        timeEstimate: '15 minutes',
        technicianQuestion: {
          id: 'tq-2',
          question: 'Are calibration settings correct?',
          questionType: 'yes-no',
          yesNextStepId: 'step-sensor',
          noNextStepId: 'step-fix-calibration'
        },
        ifSuccess: 'step-sensor',
        ifFailure: 'step-fix-calibration'
      },
      {
        id: 'step-fix-calibration',
        stepNumber: 3,
        title: 'Correct Calibration Settings',
        instruction: 'Enter correct calibration values',
        details: [
          'CT Ratio: Match current transformer ratio (e.g., 400:5)',
          'PT Ratio: Match potential transformer ratio if used',
          'Sensor Type: Match actual sensor (PT100, NTC, 4-20mA, etc.)',
          'Scaling: Verify min/max range matches sensor',
          'Save settings and test'
        ],
        tools: ['Sensor specifications', 'Controller configuration software'],
        expectedResult: 'Readings now match actual values',
        timeEstimate: '15 minutes',
        ifSuccess: 'RESOLVED',
        ifFailure: 'step-sensor'
      },
      {
        id: 'step-sensor',
        stepNumber: 4,
        title: 'Check Sensor and Wiring',
        instruction: 'Verify sensor is functioning and wired correctly',
        details: [
          'Locate the sensor for incorrect reading',
          'Check wiring connections at sensor and controller',
          'Measure sensor output directly',
          'Compare to expected output for current condition',
          'Check for correct polarity on analog sensors'
        ],
        tools: ['Multimeter', 'Wiring diagram', 'Sensor specifications'],
        expectedResult: 'Sensor output matches expected value',
        timeEstimate: '20 minutes',
        technicianQuestion: {
          id: 'tq-3',
          question: 'Is the sensor output correct?',
          questionType: 'multiple-choice',
          options: [
            { value: 'correct', label: 'Sensor output is correct', nextStepId: 'step-input' },
            { value: 'wrong', label: 'Sensor output is wrong', nextStepId: 'step-replace-sensor' },
            { value: 'wiring', label: 'Wiring problem found', nextStepId: 'step-repair-wiring' },
            { value: 'no-signal', label: 'No signal from sensor', nextStepId: 'step-sensor-failed' }
          ]
        },
        ifSuccess: 'step-input',
        ifFailure: 'step-replace-sensor'
      },
      {
        id: 'step-input',
        stepNumber: 5,
        title: 'Verify Controller Input',
        instruction: 'Check that controller is receiving correct signal',
        details: [
          'Measure signal at controller input terminals',
          'Compare to sensor output (should match)',
          'Check for interference or noise',
          'Verify shielding is properly grounded',
          'Check input configuration matches signal type'
        ],
        tools: ['Multimeter', 'Controller pinout'],
        expectedResult: 'Signal at controller matches sensor output',
        timeEstimate: '15 minutes',
        ifSuccess: 'step-controller-fault',
        ifFailure: 'step-repair-wiring'
      },
      {
        id: 'step-controller-fault',
        stepNumber: 6,
        title: 'Check for Controller Input Fault',
        instruction: 'The controller input circuit may be faulty',
        details: [
          'Check for moisture or corrosion on controller',
          'Look for fault codes related to inputs',
          'Try different input (if configurable)',
          'Compare to spare controller if available',
          'May indicate controller failure'
        ],
        tools: ['Spare controller (if available)'],
        expectedResult: 'Controller input fault identified',
        timeEstimate: '15 minutes',
        ifSuccess: 'step-replace-controller',
        ifFailure: 'escalate'
      },
      {
        id: 'step-replace-sensor',
        stepNumber: 7,
        title: 'Replace Faulty Sensor',
        instruction: 'Install new sensor and verify operation',
        details: [
          'Order correct replacement sensor',
          'Remove faulty sensor',
          'Install new sensor with correct torque',
          'Connect wiring properly',
          'Verify reading is now correct'
        ],
        tools: ['Wrenches', 'Thread sealant (if applicable)'],
        expectedResult: 'New sensor provides correct reading',
        timeEstimate: '30 minutes',
        ifSuccess: 'RESOLVED',
        ifFailure: 'step-calibration'
      }
    ],

    possibleCauses: [
      {
        cause: 'Incorrect calibration/configuration',
        probability: 'very-high',
        probabilityPercent: 40,
        explanation: 'Controller settings do not match installed sensors (CT ratio, sensor type, scaling).',
        verificationMethod: 'Compare controller settings to actual hardware specifications',
        estimatedCost: { labor: '15-30 minutes', parts: '$0' }
      },
      {
        cause: 'Sensor failure',
        probability: 'high',
        probabilityPercent: 25,
        explanation: 'Temperature, pressure, or speed sensor has failed or drifted out of calibration.',
        verificationMethod: 'Measure sensor output directly and compare to expected',
        partNumbers: [{ description: 'Replacement sensor', commonParts: ['Per application'] }],
        estimatedCost: { labor: '30 minutes', parts: '$50-300' }
      },
      {
        cause: 'Wiring fault',
        probability: 'high',
        probabilityPercent: 20,
        explanation: 'Broken wire, corroded connection, or wrong polarity in sensor circuit.',
        verificationMethod: 'Continuity test of sensor wiring',
        estimatedCost: { labor: '30-60 minutes', parts: '$0-50' }
      },
      {
        cause: 'CT/PT ratio mismatch',
        probability: 'medium',
        probabilityPercent: 10,
        explanation: 'Current or potential transformer ratio in controller does not match actual CT/PT.',
        verificationMethod: 'Compare CT/PT labels to controller settings',
        estimatedCost: { labor: '15 minutes', parts: '$0' }
      },
      {
        cause: 'Controller input failure',
        probability: 'low',
        probabilityPercent: 5,
        explanation: 'Controller analog input circuit has failed.',
        verificationMethod: 'Input reads wrong even with correct signal applied',
        partNumbers: [{ description: 'Replacement controller', commonParts: ['Per model'] }],
        estimatedCost: { labor: '1 hour', parts: '$500-2000' }
      }
    ],

    solutions: [
      {
        id: 'sol-1',
        title: 'Correct Calibration Settings',
        description: 'Enter correct sensor and scaling parameters',
        steps: [
          'Access controller configuration',
          'Verify sensor type matches hardware',
          'Enter correct CT/PT ratios',
          'Set appropriate scaling factors',
          'Test with known reference'
        ],
        tools: ['Controller configuration software', 'Installation documentation'],
        timeEstimate: '15-30 minutes',
        skillLevel: 'intermediate',
        verificationSteps: ['Display matches external measurement', 'All phases read correctly']
      },
      {
        id: 'sol-2',
        title: 'Replace Faulty Sensor',
        description: 'Remove and replace defective sensor',
        steps: [
          'Identify correct replacement part',
          'Shut down and isolate system',
          'Remove old sensor',
          'Install new sensor properly',
          'Verify correct reading'
        ],
        partNumbers: [{ description: 'Sensor', commonParts: ['Application specific'] }],
        tools: ['Wrenches', 'Thread sealant', 'Multimeter'],
        timeEstimate: '30-60 minutes',
        skillLevel: 'basic',
        verificationSteps: ['Sensor output correct', 'Display reading correct']
      }
    ],

    requiredTools: [
      { name: 'Digital multimeter', essential: true },
      { name: 'Clamp meter', essential: false },
      { name: 'IR thermometer', essential: false },
      { name: 'Controller configuration software', essential: true }
    ],
    requiredEquipment: ['Sensor specifications', 'Installation documentation'],

    followUpQuestions: [
      { question: 'Do all readings now match external measurements?', ifYes: 'Issue resolved.', ifNo: 'Check remaining sensors.' },
      { question: 'Do readings change appropriately with conditions?', ifYes: 'Calibration correct.', ifNo: 'Check sensor response.' }
    ],

    checkpoints: [
      { afterStep: 2, question: 'Did calibration correction fix the problem?', stuckAction: 'Proceed to sensor testing.' },
      { afterStep: 4, question: 'Is the sensor working correctly?', stuckAction: 'Check wiring continuity and polarity.' }
    ],

    escalationPath: {
      condition: 'Cannot correct readings despite correct sensor and calibration',
      recommendation: 'Contact controller manufacturer for input diagnostics',
      contactType: 'manufacturer',
      urgency: 'medium',
      informationToProvide: [
        'Controller model and firmware',
        'Sensor type and specifications',
        'Signal measured at input',
        'Display reading',
        'Configuration settings'
      ]
    },

    relatedIssues: [
      { issueId: 'ecm-no-communication', relationship: 'may-cause', description: 'Lost J1939 data shows as zeros or dashes' },
      { issueId: 'voltage-fluctuating', relationship: 'often-occurs-with', description: 'Incorrect voltage reading may indicate real problem' }
    ],

    progressMilestones: [
      { milestone: 'Error quantified', completionPercent: 20 },
      { milestone: 'Calibration checked', completionPercent: 40 },
      { milestone: 'Sensor tested', completionPercent: 60 },
      { milestone: 'Fault identified', completionPercent: 80 },
      { milestone: 'Reading corrected', completionPercent: 100 }
    ],

    commonMistakes: [
      'Changing calibration without measuring actual values first',
      'Assuming sensor is bad without testing',
      'Not checking CT/PT ratio after installation',
      'Ignoring ground/shield connections',
      'Not verifying fix with external measurement'
    ],

    preventiveMeasures: [
      'Document CT/PT ratios and sensor types during installation',
      'Verify readings against external measurement after commissioning',
      'Include sensor calibration in maintenance schedule',
      'Use quality sensors appropriate for environment'
    ]
  }
];

// Continue in next part due to size - Engine Performance Scenarios
