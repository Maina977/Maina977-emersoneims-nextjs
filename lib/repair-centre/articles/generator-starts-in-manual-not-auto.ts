import type { RepairArticle } from '../types';

export const generatorStartsInManualNotAuto: RepairArticle = {
  slug: 'generator-starts-in-manual-not-auto',
  hub: 'controllers',
  header: {
    title: 'Generator Starts in Manual But Not in Auto',
    equipmentCategory: 'Generating set controllers — auto-start logic and mains sensing',
    appliesTo: 'Generating sets with automatic mains-failure controllers including DeepSea, ComAp, SmartGen, PowerWizard, Datakom and Woodward',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low. Starting in manual proves the engine, fuel and starting system are sound, which eliminates most of the set and leaves the auto-start decision path.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'Mains sensing 240 V / 415 V 50 Hz nominal; controller supply from the starting battery',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'That the set starts in manual is the most useful fact you have, because it proves the engine, fuel, battery and starting circuit are all sound. Everything that remains is the decision path the controller follows in auto, and it has only a few links. The controller must be in auto and not inhibited. It must SEE the mains as failed, which depends on its mains-sensing supply rather than on whether the building actually has power. Its start timers must expire. And its start output must reach the starting circuit. Check the mains sensing early, because the commonest cause by far is that the controller never saw a mains failure at all: a blown sensing fuse, an open sensing lead, or sensing taken from a supply that did not fail. The second most common is simply the mode selector left in manual or off after earlier work or testing. Where the controller does declare mains failure and still does nothing, the timers are the next place to look, since a long start delay looks exactly like a fault to anyone watching for a few seconds.',

  symptoms: {
    display: [
      'Controller in auto with no mains-failure indication despite the supply being off',
      'Mains-failure indicated but no start attempt following',
      'Start delay timer counting with no crank following',
      'Inhibit, remote stop or lockout indication active',
      'Controller display blank, which is a supply problem rather than an auto-start fault',
    ],
    indicators: [
      'Mode selector found in manual, test or off rather than auto',
      'Auto indication absent on the controller',
      'Control fuse or MCB open',
      'Remote start input showing inactive when it should be calling',
    ],
    sounds: [
      'Complete silence at the moment the set should start',
      'A click from the start relay with no cranking, which points at the starting circuit rather than the logic',
      'The set cranking normally in manual, which confirms the starting system is sound',
    ],
    smells: [
      'Burnt smell in the control panel, which means investigate before further testing',
      'Hot insulation smell around control wiring',
    ],
    behaviour: [
      'Starts perfectly on the manual button every time',
      'Did not start during a genuine outage but starts on the test function',
      'Started correctly until electrical work was carried out upstream',
      'Starts in auto only sometimes, which points at marginal sensing or a loose connection',
      'Starts after a long delay, which is usually a timer rather than a fault',
      'Was left in manual after the last service or test',
    ],
    visible: [
      'Mode selector position',
      'Control fuses, MCBs and the controller supply',
      'Mains-sensing fuses and where the sensing is actually connected',
      'Remote start, inhibit and emergency stop inputs',
      'Control wiring for damage, corrosion or disturbed terminations',
      'Evidence of recent work in the panel or upstream',
    ],
  },

  whatItMeans: {
    plain:
      'The engine is fine — starting it by hand proves that. What is not working is the chain of decisions the controller makes on its own: noticing the mains has failed, waiting out its delay, and then telling the engine to start. Most of the time the controller either was not in auto, or never saw the mains fail because its sensing supply was not the one that went off.',
    technical:
      'An automatic mains-failure controller starts the set when its mains-sensing inputs fall outside configured acceptance criteria for longer than a configured failure delay, provided it is in automatic mode, not inhibited, and no lockout is active. Each link is independently capable of preventing a start while everything else is healthy. Mains sensing is the most commonly misunderstood: the controller does not know whether the building has power, only what appears at its sensing terminals, so sensing taken from a circuit that did not fail, or lost through a blown sensing fuse or an open lead, leaves the controller correctly concluding the mains is present. On three-phase sensing, loss of a single phase or reversed rotation after upstream work can also produce a state the controller does not interpret as a straightforward failure. Timers then govern the sequence, with a failure delay to ride through brief disturbances and a start delay before cranking, and these are deliberately long enough on many installations to look like inaction. Beyond the decision, the start command must physically reach the starting circuit, so a controller output relay, a wiring fault or an interposing relay can break the chain after the logic has done its job correctly. Because manual starting typically bypasses much of this path and drives the starting circuit more directly, a set that starts in manual and not in auto has already eliminated the engine, fuel system, battery and starter, which is why this fault is more tractable than it first appears.',
  },

  causes: {
    mostLikely: [
      'Mode selector left in manual, test or off after earlier work',
      'Mains-sensing fuse blown or sensing lead open, so the controller never sees a failure',
      'Sensing taken from a supply that did not fail during the outage',
      'Start or failure timer still running, so the start is delayed rather than absent',
    ],
    possible: [
      'Remote stop, inhibit or lockout input active',
      'Emergency stop not fully reset',
      'Controller supply weak, typically from a tired starting battery, so it resets during the attempt',
      'Mains acceptance thresholds configured so the actual condition is not treated as a failure',
      'Phase rotation reversed after upstream electrical work',
    ],
    lessCommon: [
      'Controller start output relay failed',
      'Interposing relay or start circuit wiring fault between controller and starter',
      'Configuration changed and not re-verified',
      'Controller fault',
      'Building management or remote signal holding the set inhibited',
    ],
    modelSpecific: [
      'Mains acceptance thresholds and every timer are configurable and model-specific — read them from the controller rather than assuming',
      'Which fuses are the mains-sensing fuses differs between manufacturers and panels',
      'Some controllers require a remote start signal in addition to sensing mains failure',
      'Inhibit and lockout behaviour differs; what "off" actually prevents varies by controller',
      'Manual start may bypass different parts of the circuit on different designs, which affects what a successful manual start proves',
    ],
    environmental: [
      'Moisture and condensation in the panel causing tracking on control circuits',
      'Dust and corrosion on terminals',
      'Vibration loosening control terminations',
      'Insect ingress into panels, a genuine and frequent cause of odd control behaviour',
    ],
    installation: [
      'Mains sensing connected downstream of a breaker that does not represent the supply being monitored',
      'Sensing not fused or fused without labelling',
      'Control wiring routed alongside power cables',
      'Timers set at commissioning defaults rather than to the site requirement',
      'No documented test procedure, so auto operation is never properly proven',
    ],
    maintenance: [
      'Auto operation never tested by simulating a genuine mains failure',
      'Mode selector not returned to auto after testing or service',
      'Configuration never recorded, so changes are undetectable',
      'Sensing fuses never inspected',
      'Starting battery condition unknown, so controller supply dips go unnoticed',
    ],
    componentLevel: [
      'Mains-sensing fuse open',
      'Controller start output relay failed',
      'Interposing relay failed',
      'Control wiring open or corroded',
      'Starting battery weak, causing controller reset during cranking',
    ],
  },

  safety: {
    isolation: [
      'The set will start without warning during this work — that is the function being tested',
      'Take the control out of auto and lock it before working on the engine or in the panel',
      'Isolate and lock the starting battery for work on control wiring',
      'The panel may carry mains-derived supplies as well as battery; prove dead at the point of work',
    ],
    lockoutTagout: [
      'Lock the control selector and tag it',
      'Disconnect and tag the starting battery when working on control circuits',
      'Tag the changeover control so auto operation is not restored while work is in progress',
      'Warn everyone on site before any test that starts the set',
    ],
    ppe: [
      'Arc-rated protection appropriate to the panel where live work is unavoidable',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Hearing protection when the set runs',
    ],
    storedEnergy: [
      'The starting battery is live at all times',
      'Mains-derived control supplies may remain live when the set is stopped',
      'Exhaust and turbocharger surfaces stay hot after a run',
      'Rotating parts continue turning after shutdown',
    ],
    specificHazards: [
      'This fault is diagnosed by making the set start automatically. Anyone near the engine must know a test is about to happen, and must be clear of belts, fan and coupling before it does.',
      'Never leave the control out of auto at the end of the work. A standby set left in manual will not start during a real outage, which is the failure this article exists to prevent.',
      'Simulating a mains failure removes supply from the load — confirm with the site before doing it.',
      'Never bypass an emergency stop or inhibit to force a start; establish why it is active.',
      'Never open-circuit a current transformer secondary while the set carries load',
    ],
    stopAndCallProfessional: [
      'There is a burnt smell or visible damage in the control panel',
      'The proposed action is to bypass an inhibit, lockout or emergency stop',
      'Configuration changes are needed and no record of the original settings exists',
      'The load cannot lose supply for a test and no alternative arrangement exists',
      'Controller failure is suspected and no replacement configuration is available',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter', why: 'Mains-sensing voltage at the CONTROLLER terminals, control supply, and continuity of start wiring' },
    { tool: 'Controller documentation and configuration access', why: 'Thresholds, timers and input states must be read from the unit rather than assumed' },
    { tool: 'Phase rotation tester', why: 'Reversed rotation after upstream work can prevent a correct mains assessment on three-phase sensing' },
    { tool: 'Proving unit and voltage indicator', why: 'Proving dead before work in a panel fed from two sources' },
    { tool: 'Insulated tools', why: 'Control panel work with mains-derived supplies present' },
    { tool: 'A means of simulating mains failure safely', why: 'Auto operation is only proven by a genuine simulated failure, not by the test button' },
  ],

  decisionTree: [
    { question: 'Does the set start reliably in manual?', yes: 'Engine, fuel, battery and starter are proven — the fault is in the auto path', no: 'This is a different fault; diagnose starting and fuel first' },
    { question: 'Is the mode selector actually in AUTO?', yes: 'Continue', no: 'That is the fault. It is the single commonest cause after service or testing.' },
    { question: 'Is any inhibit, remote stop, lockout or emergency stop active?', yes: 'Establish why before doing anything else — do not bypass it', no: 'Continue' },
    { question: 'Is the controller supply healthy and its fuses intact?', yes: 'Continue', no: 'The controller cannot act without its own supply' },
    { question: 'During the outage, did the controller DECLARE mains failure?', yes: 'Sensing is working — move to timers and the start output', no: 'The controller never saw a failure — this is the commonest real fault' },
    { question: 'Are the mains-sensing fuses intact and the sensing leads continuous?', yes: 'Continue', no: 'That explains it. Establish why the fuse operated rather than just replacing it.' },
    { question: 'Is the sensing connected to the supply that actually fails?', yes: 'Continue', no: 'Sensing from a circuit that stayed live means the controller correctly saw mains present' },
    { question: 'Are the failure and start timers simply still running?', yes: 'Not a fault — confirm the settings suit the site', no: 'Check the start output reaches the starting circuit' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Confirm what manual starting has already proven',
      inspect: 'That the set starts and runs normally on manual',
      where: 'At the control panel',
      instrument: 'Observation',
      expected: 'Reliable manual start',
      ifAbnormal: 'A reliable manual start eliminates the engine, fuel system, starting battery and starter motor in one step. Everything remaining is the auto decision path, which is a much smaller search.',
      next: 'Step 2',
      warning: 'Warn anyone near the engine before starting it.',
    },
    {
      step: 2,
      title: 'Check the mode selector and read the controller',
      inspect: 'Selector position, active alarms, inhibits and the event log',
      where: 'At the controller',
      instrument: 'Controller display or service software',
      expected: 'Auto selected, no inhibit or lockout active',
      ifAbnormal: 'A selector left in manual after service or testing is the commonest cause of a standby set failing to start during a real outage. The log will also show whether the controller ever attempted anything.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Check inhibits, remote stop and emergency stop',
      inspect: 'Every input that can prevent an automatic start',
      where: 'Controller inputs and the panel',
      instrument: 'Controller display and multimeter',
      expected: 'No inhibit active',
      ifAbnormal: 'Establish why an inhibit is active rather than clearing it. On sites with building management systems the inhibit may be commanded remotely and reappear after you leave.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Verify the controller supply',
      inspect: 'Controller supply voltage and its protection, including behaviour during cranking',
      where: 'At the controller supply terminals',
      instrument: 'Multimeter, ideally recording',
      expected: 'Stable supply throughout',
      ifAbnormal: 'A weak starting battery can let the controller reset mid-sequence, which presents as an aborted or absent start with no clear alarm.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Measure mains sensing at the controller terminals',
      inspect: 'Sensing voltage on each phase at the controller, and where the sensing is actually connected',
      where: 'Controller mains-sensing terminals',
      instrument: 'True-RMS multimeter, phase rotation tester',
      expected: 'Sensing representing the supply that is supposed to be monitored',
      ifAbnormal: 'This is the crux. The controller knows only what appears at its sensing terminals. Sensing taken from a circuit that did not fail, or lost through a blown fuse, leaves it correctly concluding the mains is healthy while the building sits in darkness.',
      next: 'Step 6',
      verify: 'Which fuses are the mains-sensing fuses on this specific panel, and which supply the sensing is connected to.',
    },
    {
      step: 6,
      title: 'Simulate a genuine mains failure and watch the sequence',
      inspect: 'Whether the controller declares failure, times out and commands a start',
      where: 'At the controller, with the mains supply genuinely removed',
      instrument: 'Observation of the controller display through the sequence',
      expected: 'Failure declared, timers run, start commanded',
      ifAbnormal: 'The test button is not equivalent. It often bypasses the sensing path, which is precisely the part that fails. A set that passes on test and fails in a real outage almost always has a sensing problem.',
      next: 'Step 7',
      warning: 'Removing the mains drops the load. Confirm with the site before doing this.',
    },
    {
      step: 7,
      title: 'Read the timer settings before calling it a fault',
      inspect: 'Failure delay, start delay and any hold-off timers',
      where: 'Controller configuration',
      instrument: 'Service software or display',
      expected: 'Timers appropriate to the installation',
      ifAbnormal: 'A long start delay looks exactly like a dead controller to anyone watching for a few seconds. Confirm the intended values before adjusting anything, and record any change.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Confirm the start command reaches the starting circuit',
      inspect: 'Controller start output, any interposing relay, and the wiring to the starter circuit',
      where: 'Controller output terminals through to the start relay',
      instrument: 'Multimeter',
      expected: 'Command present at the output and arriving at the starting circuit',
      ifAbnormal: 'This separates a logic problem from a wiring problem. Command present with no crank indicts the output relay, interposing relay or wiring; no command indicts sensing, configuration or the controller.',
      next: 'Correct the cause, then prove auto operation by simulated failure',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Mode, inputs and timers',
      steps: [
        'Return the selector to auto and make that a documented step at the end of every intervention',
        'Clear the underlying cause of any inhibit rather than the inhibit itself',
        'Verify mains acceptance thresholds against the supply the site actually has',
        'Verify timers against the intended operation and record any change with its reason',
      ],
      note: 'A large proportion of these callouts end here, with no part replaced.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Sensing and control wiring',
      steps: [
        'Replace blown mains-sensing fuses after establishing why they operated',
        'Repair open or corroded sensing leads and control wiring',
        'Re-route control wiring away from power cables where interference is suspected',
        'Clear moisture and insect ingress and seal panel entries',
      ],
    },
    {
      level: 'wiring',
      title: 'Sensing connection point',
      steps: [
        'Move mains sensing to a point that genuinely represents the supply being monitored',
        'Correct phase rotation after upstream work',
        'Label sensing fuses clearly so the next person finds them quickly',
      ],
      note: 'Sensing connected downstream of something that does not fail is a design defect, not a settings issue.',
    },
    {
      level: 'component-replacement',
      title: 'Control components',
      steps: [
        'Replace a failed controller start output relay or interposing relay',
        'Replace a weak starting battery causing controller resets',
        'Replace a failed controller and restore its configuration from a record',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Controller faults',
      steps: [
        'Refer suspected controller and firmware faults',
        'Provide the sensing measurements, configuration and observed sequence',
      ],
    },
  ],

  validation: [
    'Prove auto operation by simulating a genuine mains failure, not by the test button',
    'Confirm the full sequence: failure declared, timers run, crank, run, transfer, restore, return and cooldown',
    'Time each stage against the configured timers',
    'Confirm the selector is left in AUTO and record that it was',
    'Confirm mains sensing is connected to the supply actually being monitored',
    'Record the controller configuration after any change',
    'Repeat the test after the set has stood, since marginal faults reappear from cold',
  ],

  whenNotToRepair: [
    'Where mains sensing is connected to an unrepresentative supply — that is a wiring correction, not a repair',
    'Obsolete controllers where replacements and configuration tools are unobtainable',
    'Where the only way to obtain an auto start is to bypass an inhibit or emergency stop',
    'Installations with no documented configuration, where a controller replacement could not be commissioned correctly',
  ],

  prevention: [
    'Make returning the selector to AUTO a documented final step of every visit — this alone prevents a large share of failures to start',
    'Test auto operation by simulated mains failure at every service, not with the test button',
    'Record the full controller configuration so unintended changes are detectable',
    'Label mains-sensing fuses clearly',
    'Inspect sensing fuses and control terminations at each service',
    'Keep the starting battery healthy; controller resets from a weak battery mimic logic faults',
    'Verify phase rotation and sensing integrity after any upstream electrical work',
  ],

  relatedSlugs: ['ats-not-changing-over', 'ats-will-not-return-to-mains', 'controller-alarm-interpretation', 'generator-cranks-but-will-not-start'],

  faq: [
    {
      q: 'It starts on the test button but not during a real power cut. Why?',
      a: 'Because the test function usually bypasses the mains-sensing path, and sensing is exactly what has failed. The controller only knows what appears at its sensing terminals — if those are fed from a circuit that stayed live, or the sensing fuse has blown, it correctly concludes the mains is fine. Always prove auto operation by simulating a genuine failure, never by the test button.',
    },
    {
      q: 'What does starting in manual actually prove?',
      a: 'A great deal, and it is why this fault is more tractable than it looks. It proves the engine, fuel system, starting battery and starter motor are all sound. Everything left is the controller\'s decision path: is it in auto, does it see mains failure, have its timers expired, and does its start command reach the starting circuit. That is a short list.',
    },
    {
      q: 'Nothing happened for a while so we assumed it was dead. Could it have been working?',
      a: 'Quite possibly. Failure and start delays are deliberately configured to ride through brief disturbances, and on many installations they are long enough that nothing appears to happen for an uncomfortable stretch. Read the configured timers before treating inaction as a fault, and watch the controller display rather than the engine.',
    },
    {
      q: 'The set was left in manual after a service. Is that really that common?',
      a: 'It is one of the commonest reasons a standby set fails to start during an outage, and it is entirely preventable. Make returning the selector to auto a documented step at the end of every visit, and check it as part of any callout before investigating anything more complicated.',
    },
  ],

  references: [
    'ISO 8528-4 — generating sets: controlgear and switchgear',
    'ISO 8528-1 — generating sets: application, ratings and performance',
    'IEC 60947-6-1 — transfer switching equipment, where the controller works with an ATS',
    'The controller manufacturer\'s documentation for the exact model and firmware, which is the only valid source for acceptance thresholds, timer functions, inhibit behaviour and input configuration referred to throughout',
  ],
};
