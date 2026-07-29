import type { RepairArticle } from '../types';

export const j1939SpnFmiExplained: RepairArticle = {
  slug: 'j1939-spn-fmi-explained',
  hub: 'fault-codes',
  header: {
    title: 'Reading J1939 Engine Fault Codes — What SPN and FMI Actually Tell You',
    equipmentCategory: 'Electronically controlled engines — diagnostic message structure',
    appliesTo: 'Generating sets and plant with electronically controlled engines reporting diagnostics over a J1939 CAN link to a controller or display',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. The code structure is systematic and readable once understood, which is exactly why it is so often over-read.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Engine ECM and controller CAN network; set output 240 V / 415 V 50 Hz nominal',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'A J1939 diagnostic message is compositional, and reading it as two separate pieces of information is what makes it useful. The SPN — Suspect Parameter Number — identifies WHICH parameter the engine control module is unhappy about. The FMI — Failure Mode Identifier — identifies HOW it is unhappy: whether the signal is above a normal range, below it, erratic, out of calibration, absent altogether, or whether the ECM has detected a mechanical condition rather than a signal problem. So SPN tells you where to look and FMI tells you what kind of fault to look for, and the two together frequently distinguish a genuine engine problem from a wiring or sensor problem before you touch anything. An occurrence count usually accompanies them, which tells you whether this is a one-off or a recurring condition. What the code does not tell you is the cause, because a sensor circuit fault and a real physical condition on the same parameter produce codes that differ only in their FMI. Look every code up in the engine manufacturer documentation for that exact engine — the standard defines the structure, not the complete meaning of every code on every engine, and manufacturers add their own.',

  symptoms: {
    display: [
      'A numeric code shown as SPN and FMI, sometimes with an occurrence count',
      'A single code presented by the controller without indicating it originated in the engine ECM',
      'Multiple codes appearing together, some of which are consequences of others',
      'Amber warning versus red stop indication accompanying the code',
      'A code that clears on power cycle and returns under running conditions',
    ],
    indicators: [
      'Malfunction or warning lamp on the engine or control panel',
      'Controller common alarm active with the specific code only on a sub-screen',
      'Communication or data-link fault indication, which is a different class of problem',
    ],
    sounds: [
      'Engine running differently in a way that corroborates or contradicts the code',
      'No audible change at all, which is common for sensor-circuit faults',
    ],
    smells: [
      'Any burnt smell alongside a code means investigate physically before clearing anything',
    ],
    behaviour: [
      'Code appears only when the engine is hot, or only under load, which is diagnostic in itself',
      'Code appears at every start and clears once running',
      'Code recurs immediately after being cleared, meaning the condition is still present',
      'Engine derating or shutting down in response to the code',
      'Code present with no observable symptom, which frequently indicates a sensor or wiring fault rather than an engine condition',
      'Several codes appearing within seconds, indicating a cascade from one root event',
    ],
    visible: [
      'The full code list with occurrence counts, not just the first entry',
      'Whether the code originated in the engine ECM or the generator controller',
      'Wiring and connector condition at the sensor named by the SPN',
      'Evidence of recent work, rodent damage or moisture ingress at the harness',
      'Engine and controller software versions',
    ],
  },

  whatItMeans: {
    plain:
      'Modern engines report faults as a pair of numbers. The first says which reading the engine computer is unhappy about — oil pressure, coolant temperature, a fuel parameter and so on. The second says what kind of problem it is: too high, too low, jumping about, or no signal at all. That pairing is useful because it often separates a genuine engine problem from a broken wire or a failed sensor before anyone opens anything.',
    technical:
      'SAE J1939 defines a diagnostic message structure used across electronically controlled engines. The Suspect Parameter Number identifies the parameter concerned, and the Failure Mode Identifier classifies the nature of the fault against that parameter — the FMI set distinguishes, among other things, signals reading above or below a valid operating range, signals above or below the range considered electrically plausible, intermittent or erratic data, a value out of calibration, a condition that exists mechanically, and a missing or invalid data link message. That distinction between electrically implausible and merely out of normal operating range is the diagnostically valuable part, because it separates a wiring or sensor circuit failure from a real physical condition on the same parameter. A short to earth on a sensor signal wire and a genuinely low reading of that parameter both raise a fault on the same SPN, and only the FMI tells them apart. Messages usually carry an occurrence count, distinguishing a single transient from a persistent condition, and a lamp status indicating the severity the ECM assigns. Critically, the standard specifies the framework rather than an exhaustive dictionary: manufacturers implement subsets, define proprietary parameters and attach their own thresholds and remedial guidance, so the same SPN and FMI pair does not necessarily carry identical meaning or identical urgency across different engines. Where a generating-set controller displays engine diagnostics, it is relaying a message that originated in the engine ECM, so the code belongs to the engine manufacturer\'s documentation and not to the controller manual — a distinction that wastes a great deal of time when it is missed.',
  },

  causes: {
    mostLikely: [
      'Sensor circuit fault — open, short to earth or short to supply on the signal wire',
      'Connector corrosion, backed-out pin or moisture ingress at the sensor',
      'A genuine engine condition correctly detected and correctly reported',
      'Consequential code following an earlier root event',
    ],
    possible: [
      'Sensor failed or drifted out of calibration',
      'Harness damage from chafing, heat or rodents',
      'Data link fault — wiring, termination or a device not communicating',
      'Code being read against the wrong documentation, so the meaning attributed is not the meaning intended',
    ],
    lessCommon: [
      'ECM fault',
      'Software or calibration issue after an update',
      'Proprietary manufacturer code being interpreted as a standard one',
      'Controller misreporting a relayed message',
    ],
    modelSpecific: [
      'The standard defines the STRUCTURE; manufacturers implement subsets and add proprietary parameters, so meaning must come from the engine manufacturer documentation for that exact engine',
      'Thresholds behind a code, and the severity assigned, differ between engines and calibrations',
      'Some manufacturers publish their own code numbering alongside or instead of SPN and FMI',
      'Derate and shutdown behaviour in response to a given code is calibration-specific',
      'Diagnostic tool access and clearing procedures are manufacturer-specific and may require authorisation',
    ],
    environmental: [
      'Moisture and condensation at connectors, a leading cause of sensor circuit faults',
      'Vibration loosening connectors and chafing harnesses',
      'Heat degrading insulation near the engine',
      'Rodent damage to harnesses on sets that stand unused',
      'Dust and corrosion on connector pins',
    ],
    installation: [
      'Harness routed against hot or moving parts',
      'Connectors not fully seated or seals omitted after previous work',
      'Data link wiring without correct termination',
      'Aftermarket equipment connected to the CAN network incorrectly',
    ],
    maintenance: [
      'Codes cleared habitually without investigation, so history is destroyed',
      'Occurrence counts never noted, so recurring faults look like new ones',
      'Harness and connector condition never inspected',
      'No record of which engine software or calibration is in service',
    ],
    componentLevel: [
      'Sensor failed',
      'Signal wire open, or shorted to earth or supply',
      'Connector pin corroded or backed out',
      'Data link wiring or termination fault',
      'ECM input failed',
    ],
  },

  safety: {
    isolation: [
      'Stop the set and prevent automatic restart before working on the engine or harness',
      'Lock the control in stop and isolate the starting battery before disconnecting connectors',
      'Isolate the set output breaker before working around the alternator',
      'Allow hot surfaces to cool before reaching into the engine bay',
    ],
    lockoutTagout: [
      'Lock the control selector in stop and tag it',
      'Disconnect and tag the starting battery',
      'Tag the changeover control so auto operation is not restored during the work',
    ],
    ppe: [
      'Eye protection and gloves',
      'Hearing protection while the set runs',
      'Heat-resistant gloves near a recently run engine',
      'Insulated tools for any work in the control panel',
    ],
    storedEnergy: [
      'The starting battery is live at all times',
      'Exhaust, manifold and turbocharger surfaces stay hot long after shutdown',
      'Common-rail fuel systems may retain very high pressure after shutdown',
      'The cooling system remains pressurised while hot',
    ],
    specificHazards: [
      'A code reporting a protective condition — low oil pressure, high coolant temperature, overspeed — must never be cleared and the engine restarted to see whether it recurs. If the condition is real, the next run destroys the engine.',
      'Never disconnect ECM connectors with the ignition or control supply live; do it with the battery isolated.',
      'Never loosen a high-pressure fuel fitting on a running engine — injection-pressure fuel penetrates skin and causes injuries requiring immediate surgery.',
      'The engine may start automatically during testing if the control is in auto',
      'Diagnostic tools can command engine functions; know what a command will do before sending it',
    ],
    stopAndCallProfessional: [
      'A protective shutdown code whose cause you cannot establish',
      'Codes requiring manufacturer diagnostic tools or authorisation to interrogate or clear',
      'Suspected ECM or calibration faults',
      'Any situation where the proposed action is to clear a protective code and run the engine',
      'Data link faults on a network you cannot map',
    ],
  },

  tools: [
    { tool: 'Engine manufacturer documentation for that exact engine and calibration', why: 'The standard defines structure, not complete meaning — codes must be looked up against the engine, not a generic list' },
    { tool: 'Manufacturer diagnostic tool or approved service software', why: 'Reading full fault detail, occurrence counts and freeze-frame data that a controller display may not show' },
    { tool: 'True-RMS digital multimeter', why: 'Testing the sensor circuit named by the SPN — continuity, shorts to earth and supply' },
    { tool: 'Breakout leads or test harness appropriate to the connector', why: 'Measuring at a connector without damaging pins, which is how connectors get ruined' },
    { tool: 'Independent gauge for the parameter concerned', why: 'Establishing whether the reported value is TRUE, which the code itself cannot tell you' },
    { tool: 'Controller documentation', why: 'Distinguishing a controller-generated alarm from a relayed engine ECM code' },
  ],

  decisionTree: [
    { question: 'Is the code a protective condition — oil pressure, coolant temperature, overspeed?', yes: 'Do NOT clear and restart to test it. Establish the physical condition first.', no: 'Continue' },
    { question: 'Did the code originate in the ENGINE ECM or the generator controller?', yes: 'Look it up in the matching documentation — engine codes are not in the controller manual', no: 'Establish the source before interpreting the number' },
    { question: 'Have you recorded the full code list and occurrence counts?', yes: 'Continue', no: 'Record before clearing anything — clearing destroys the history you need' },
    { question: 'Which SPN, which parameter is implicated?', yes: 'That tells you WHERE to look', no: 'Look it up against the engine documentation' },
    { question: 'What does the FMI say about the NATURE of the fault?', yes: 'Electrically implausible values point at wiring or sensor; out-of-range-but-plausible points at a real condition', no: 'This is the most valuable half of the code — do not skip it' },
    { question: 'Does an independent measurement agree with the reported value?', yes: 'The condition is real — diagnose the engine', no: 'Sensor or wiring — the engine may be entirely healthy' },
    { question: 'Is the sensor circuit sound — continuity, no short to earth or supply?', yes: 'Suspect the sensor or a genuine condition', no: 'The harness is the fault' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Record everything before clearing anything',
      inspect: 'Full code list, SPN and FMI for each, occurrence counts, lamp status and the order they appeared',
      where: 'Controller display or manufacturer diagnostic tool',
      instrument: 'Diagnostic tool, or photograph the display',
      expected: 'A complete record including occurrence counts',
      ifAbnormal: 'Clearing codes destroys the history, and occurrence counts are what distinguish a transient from a persistent fault. This is the cheapest step and the one most often skipped.',
      next: 'Step 2',
      warning: 'Never clear a protective shutdown code and restart to see whether it recurs.',
    },
    {
      step: 2,
      title: 'Establish where the code came from',
      inspect: 'Whether the code originated in the engine ECM or was generated by the generator controller',
      where: 'Controller display and its documentation',
      instrument: 'Controller and engine documentation',
      expected: 'A clear attribution',
      ifAbnormal: 'A generating-set controller relays engine ECM messages. Looking an engine code up in the controller manual wastes considerable time and can produce a confidently wrong interpretation.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Read the SPN, which parameter',
      inspect: 'The parameter the SPN identifies, against the engine manufacturer documentation',
      where: 'Engine documentation for that exact engine and calibration',
      instrument: 'Manufacturer documentation',
      expected: 'An unambiguous identification of the parameter',
      ifAbnormal: 'The standard defines the framework, not an exhaustive dictionary. Manufacturers implement subsets and add proprietary parameters, so a generic online list is not a safe substitute for the engine documentation.',
      next: 'Step 4',
      verify: 'The engine make, model and calibration, and that the documentation matches them.',
    },
    {
      step: 4,
      title: 'Read the FMI — the nature of the fault',
      inspect: 'What the FMI says about how the parameter is failing',
      where: 'Against the engine documentation',
      instrument: 'Manufacturer documentation',
      expected: 'A classification: implausible signal, out of operating range, erratic, missing, or a detected mechanical condition',
      ifAbnormal: 'This is the diagnostically valuable half. A signal that is electrically implausible points at wiring or the sensor; a value within electrical plausibility but outside the normal operating range points at a real physical condition. The same SPN with different FMIs is a different job.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Separate cause from consequence',
      inspect: 'Which code appeared first, and which followed within seconds',
      where: 'In the timestamped or ordered code list',
      instrument: 'Diagnostic tool',
      expected: 'One root event with later codes explained as consequences',
      ifAbnormal: 'A shutdown produces several codes from one event. Working on the last code displayed is a common and costly error.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Verify the reported value independently',
      inspect: 'The actual physical quantity, measured separately from the ECM',
      where: 'At the engine, with an independent gauge or meter',
      instrument: 'Independent pressure gauge, thermometer or multimeter',
      expected: 'Agreement, or a clear disagreement',
      ifAbnormal: 'Agreement means the condition is real and belongs to the engine. Disagreement means the measurement path is at fault and the engine may be perfectly healthy. The code cannot tell you which.',
      next: 'Step 7',
      warning: 'Where verification requires running after a protective shutdown, establish first that running will not cause damage.',
    },
    {
      step: 7,
      title: 'Test the sensor circuit named by the SPN',
      inspect: 'Continuity, shorts to earth and to supply, connector and pin condition',
      where: 'At the sensor and along its harness',
      instrument: 'Multimeter and appropriate breakout leads',
      expected: 'Sound circuit, clean and fully seated connectors',
      ifAbnormal: 'Corrosion, backed-out pins, chafed harness and rodent damage are leading causes of codes that look like engine faults. Use proper breakout leads — probing pins directly damages connectors and creates the next fault.',
      next: 'Step 8',
      verify: 'Sensor type and expected circuit behaviour for this engine, from the manufacturer data.',
    },
    {
      step: 8,
      title: 'Correct the cause, then clear and validate deliberately',
      inspect: 'That the identified cause is addressed before the code is cleared',
      where: 'At the corrected fault',
      instrument: 'Diagnostic tool and observation after a run',
      expected: 'Code does not return under the conditions that produced it',
      ifAbnormal: 'A code that returns means the condition persists. Record the code, the cause and the action so the next technician starts with information rather than a cleared list.',
      next: 'Refer ECM, calibration and unresolved protective codes to the engine manufacturer',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Harness and connectors — the commonest fix',
      steps: [
        'Clean corroded connector pins and reseat connectors fully with seals in place',
        'Repair chafed, heat-damaged or rodent-damaged harness sections properly rather than taping them',
        'Re-route harness away from hot and moving parts',
        'Correct data link wiring and termination faults',
      ],
      note: 'A large share of codes that appear to indict the engine are resolved here, on the wiring.',
    },
    {
      level: 'sensor-replacement',
      title: 'Sensors',
      steps: [
        'Replace a sensor proven faulty by independent measurement',
        'Fit the correct sensor for the engine and calibration',
        'Verify the reported value against an independent measurement after fitting',
      ],
    },
    {
      level: 'firmware',
      title: 'Software and calibration',
      steps: [
        'Refer calibration and software issues to the engine manufacturer',
        'Record the software and calibration version in service before and after any change',
      ],
      note: 'Do not improvise ECM programming. A partly programmed module may be unrecoverable.',
    },
    {
      level: 'manufacturer-level',
      title: 'Engine and ECM',
      steps: [
        'Refer genuine engine conditions and suspected ECM faults to a properly equipped facility',
        'Provide the full code list with occurrence counts, independent measurements and circuit test results',
      ],
    },
  ],

  validation: [
    'Confirm the code does not return under the conditions that originally produced it',
    'Confirm the reported value agrees with an independent measurement',
    'Confirm no new codes were introduced by the work',
    'Record the full code list after the repair as a new baseline',
    'Record the engine software and calibration version in service',
    'Record the SPN, FMI, occurrence count, cause identified and corrective action, so the next visit starts with information',
  ],

  whenNotToRepair: [
    'Where the correct engine documentation cannot be obtained — interpreting a code from a generic list is guesswork on a specific engine',
    'Protective shutdown codes whose physical cause cannot be established',
    'ECM faults requiring manufacturer tools and authorisation',
    'Where the only proposed action is to clear the code and continue running',
    'Engines whose calibration or software state cannot be established',
  ],

  prevention: [
    'Never clear codes routinely; record them first, because occurrence counts and order are diagnostic',
    'Inspect harness and connectors at service intervals, particularly on sets that stand unused where rodent damage occurs',
    'Keep the correct engine documentation with the set, including the calibration in service',
    'Record the software and calibration version so a change is detectable',
    'Review the code list at every service visit — recurring low-priority codes often precede a failure',
    'Seal and protect connectors properly after any work; moisture ingress is a leading cause',
    'Treat a code with no observable symptom as worth investigating rather than dismissing, since it frequently indicates a developing circuit fault',
  ],

  relatedSlugs: ['controller-alarm-interpretation'],

  faq: [
    {
      q: 'What is the difference between SPN and FMI?',
      a: 'SPN identifies WHICH parameter the engine control module is unhappy about — it tells you where to look. FMI identifies HOW it is unhappy: implausible signal, out of normal operating range, erratic, missing, or a detected mechanical condition. Reading only the SPN throws away the more useful half, because the same parameter with a different FMI is frequently a completely different job.',
    },
    {
      q: 'Can I look the code up online?',
      a: 'Use it as orientation, never as the answer. The standard defines the message structure rather than an exhaustive dictionary, and manufacturers implement subsets, add proprietary parameters and attach their own thresholds and severities. The same pair of numbers does not necessarily mean the same thing, or carry the same urgency, on a different engine. Look it up in the documentation for that exact engine and calibration.',
    },
    {
      q: 'The controller shows a code but its manual does not list it. Why?',
      a: 'Because it almost certainly originated in the engine ECM and the controller is only relaying it. Engine codes belong in the engine manufacturer\'s documentation, not the controller manual. Establishing which device generated a code before looking it up saves a great deal of wasted time.',
    },
    {
      q: 'There is a code but the engine seems to run fine. Can I clear it?',
      a: 'Record it first, then investigate rather than clear. A code with no observable symptom very often indicates a sensor or wiring fault — a chafed harness, a corroded pin, moisture in a connector, which is real, is developing, and is cheap to fix now. Clearing it without investigation destroys the occurrence count, which is exactly the information that would have told you whether it was a one-off or a pattern.',
    },
  ],

  references: [
    'SAE J1939 and its subordinate documents, which define the diagnostic message structure including Suspect Parameter Number and Failure Mode Identifier',
    'ISO 8528-4 — generating sets: controlgear and switchgear',
    'The engine manufacturer\'s documentation for the exact engine and calibration in service, which is the only valid source for the meaning, threshold and severity of any specific code',
    'The generating-set controller manufacturer\'s documentation, for distinguishing controller-generated alarms from relayed engine messages',
  ],
};
