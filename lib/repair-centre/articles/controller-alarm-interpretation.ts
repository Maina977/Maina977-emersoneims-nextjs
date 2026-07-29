import type { RepairArticle } from '../types';

export const controllerAlarmInterpretation: RepairArticle = {
  slug: 'controller-alarm-interpretation',
  hub: 'controllers',
  header: {
    title: 'Reading a Generator Controller Alarm Correctly — Why a Fault Code Is Not a Diagnosis',
    equipmentCategory: 'Generator controllers — alarm interpretation and reset',
    appliesTo: 'DeepSea, ComAp, SmartGen, PowerWizard, Woodward, Datakom, Lovato and similar generating-set controllers. Method is general; every code meaning must come from the manual for that exact controller and firmware.',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. The controller tells you what it measured, not what failed — and confusing those two is the most common error in the field.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho — review pending',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Set output 240 V / 415 V 50 Hz nominal; controller supply from the starting battery',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'A controller alarm reports what the controller measured, or failed to measure — not what broke. That distinction decides whether you fix the fault or replace a healthy part. A low oil pressure shutdown means the controller saw a low signal on its oil pressure input; the engine may indeed have low oil pressure, or the sender may have failed, or its wiring may have chafed to earth, and the alarm looks identical in all three cases. So the correct reading of any alarm is: what did this input actually measure, is that measurement true, and if it is true what caused it. Three further habits matter. Read the alarm that came FIRST, because a shutdown cascades and the last alarm on the display is often a consequence rather than the cause. Distinguish a warning from a shutdown, since they indicate very different urgency. And never simply reset and restart to see whether it recurs, because on a protective shutdown that means running an engine the controller has already judged unsafe. Every code number, its meaning and its reset path must come from the manual for that exact controller and firmware version — the same number means different things on different makes.',

  symptoms: {
    display: [
      'A numbered fault or alarm code with a short text description',
      'Multiple alarms listed together, with no obvious indication of which came first',
      'Warning indications that do not stop the set, alongside shutdowns that do',
      'Alarm that cannot be reset, or that clears and immediately returns',
      'Blank or unresponsive display, which is a controller supply problem rather than an alarm',
    ],
    indicators: [
      'Common alarm lamp lit with the specific cause only visible on the display',
      'Mode indication showing the set locked out rather than in auto',
      'Communication indicator inactive where remote monitoring is fitted',
    ],
    sounds: [
      'Audible alarm accompanying the indication',
      'The engine stopping abruptly, which indicates a shutdown rather than a warning',
      'The set continuing to run with an alarm active, which indicates a warning',
    ],
    smells: [
      'Any burnt smell from the panel means stop and investigate before resetting anything',
      'Hot insulation smell around the controller or its harness',
    ],
    behaviour: [
      'Alarm appears only on starting, only under load, or only when hot — the pattern narrows the cause considerably',
      'Alarm recurs immediately after reset, which means the condition is still present',
      'Alarm cleared by reset and did not return, which does not prove it was spurious',
      'Several alarms appeared together within seconds, indicating a cascade from one root event',
      'Alarm began after maintenance, rewiring or a firmware or configuration change',
      'Set will not start and the controller gives no indication at all, which is a supply or controller fault',
    ],
    visible: [
      'The full alarm list and its order, not just the topmost entry',
      'Sender and harness condition at the input the alarm refers to',
      'Controller supply fuse and battery condition',
      'Evidence of recent work in the panel',
      'Corrosion, moisture or insect ingress in the controller enclosure',
    ],
  },

  whatItMeans: {
    plain:
      'The controller watches the engine and alternator through sensors, and raises an alarm when a reading goes outside what it has been told to accept. The alarm tells you which reading was wrong. It does not tell you why it was wrong — the sensor itself, or its wiring, can produce exactly the same alarm as a genuine engine problem. Working out which of those you have is the actual job.',
    technical:
      'A generating-set controller is a measurement and protection device. It samples analogue inputs from senders, digital inputs from switches, and electrical quantities from voltage and current transformers, compares each against configured thresholds and time delays, and raises a warning or executes a shutdown when a condition persists beyond its delay. Every alarm therefore describes the state of a measurement path, which comprises the physical quantity, the sender, the wiring, the controller input and the configured threshold. A fault anywhere along that path produces the same alarm, which is why an alarm identifies the input rather than the failure. Protective shutdowns are additionally subject to inhibits and arming logic — oil pressure protection, for instance, is normally inhibited during cranking and armed only after the engine reaches running speed — so an alarm appearing at an unexpected point in the sequence often reflects timing or configuration rather than a physical fault. Because a shutdown removes excitation, stops fuelling and drops load essentially simultaneously, one root event commonly produces several alarms within a second or two; the alarm log preserves the order, and the first entry is normally the cause while later entries are consequences. Code numbering is entirely manufacturer-specific and frequently changes between firmware versions of the same controller, so a number carries no meaning without the manual for that exact unit. On engines with an electronic control module the controller may additionally display fault information passed from the engine ECM over a data link, in which case the code belongs to the engine manufacturer rather than to the controller, and must be looked up in the engine documentation.',
  },

  causes: {
    mostLikely: [
      'A genuine condition on the engine or alternator, correctly detected',
      'Sender failed, drifted or disconnected, so the measurement path is faulty rather than the engine',
      'Wiring fault — chafed, corroded or broken sender wiring, or a poor earth',
      'Configured threshold or time delay inappropriate for the installation',
    ],
    possible: [
      'Consequential alarm following an earlier root event',
      'Controller supply unstable, typically from a weak starting battery, producing spurious alarms',
      'Protection armed or inhibited incorrectly for the point in the start sequence',
      'Configuration changed and not re-verified',
    ],
    lessCommon: [
      'Controller input or the controller itself failed',
      'Firmware fault or corrupted configuration',
      'Interference on sender wiring routed alongside power cables',
      'Engine ECM fault passed through to the controller display and mistaken for a controller fault',
    ],
    modelSpecific: [
      'Code numbering is manufacturer-specific and can change between firmware versions of the same controller — a number is meaningless without the correct manual',
      'The same descriptive text can mean different things on different makes',
      'Reset paths differ: some alarms clear at the panel, some require the fault condition to clear first, some require a mode change or a specific key sequence',
      'Arming and inhibit logic for protective shutdowns differs by controller and by configuration',
      'Where an engine ECM is fitted, some displayed codes originate from the engine and must be looked up in the engine documentation, not the controller manual',
    ],
    environmental: [
      'Moisture and condensation in the panel causing tracking on inputs',
      'Dust and corrosion on terminals',
      'Vibration loosening sender and harness connections',
      'Insect ingress into the panel, a genuine and frequent cause of odd input behaviour',
      'High panel temperature affecting the controller',
    ],
    installation: [
      'Sender wiring routed alongside power cabling, picking up interference',
      'Poor earthing of the sender return path',
      'Thresholds left at factory defaults that do not suit the engine or the duty',
      'Controller supply shared with heavy loads, so it dips during cranking',
    ],
    maintenance: [
      'Alarm log never reviewed, so recurring warnings are unnoticed until a shutdown',
      'Configuration never recorded, so unintended changes cannot be detected',
      'Senders and harnesses never inspected',
      'Alarms habitually reset without investigation, which trains everyone to ignore them',
    ],
    componentLevel: [
      'Sender failed or drifted',
      'Harness open, shorted or chafed to earth',
      'Controller input failed',
      'Controller supply fuse or battery weak',
    ],
  },

  safety: {
    isolation: [
      'The set can start automatically at any time while in auto. Take it out of auto and lock it before working on the engine or in the panel.',
      'Isolate and lock the starting battery for work on controller wiring',
      'Isolate the set output breaker before working around the alternator terminals',
      'Prove dead at the point of work — the panel may carry mains-derived supplies as well as battery',
    ],
    lockoutTagout: [
      'Lock the control selector in stop or off, and tag it',
      'Disconnect and tag the starting battery',
      'Tag any changeover control so auto operation is not restored while work is in progress',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the panel where live work is unavoidable',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Hearing protection while the set runs',
    ],
    storedEnergy: [
      'The starting battery is live at all times',
      'Panel supplies derived from the mains may remain live when the set is stopped',
      'Hot exhaust and turbocharger surfaces remain dangerous after a run',
    ],
    specificHazards: [
      'NEVER reset a protective shutdown and restart simply to see whether it recurs. A shutdown means the controller judged continued running unsafe; repeating the event can destroy an engine that was still repairable — a low oil pressure shutdown in particular.',
      'Overriding or disabling a protection to keep a set running removes the only thing standing between a fault and a destroyed engine. Do not do it to get through a shift.',
      'The set may crank and start without warning during testing; keep clear of belts, fan and coupling',
      'Never open-circuit a current transformer secondary while the set carries load',
      'Working in a live panel to trace an input is live working and must be treated as such',
    ],
    stopAndCallProfessional: [
      'The alarm is a protective shutdown whose cause you cannot establish',
      'There is a burnt smell or visible damage in the panel',
      'The proposed fix involves disabling or bypassing a protection',
      'Configuration changes are required and no record of the original configuration exists',
      'Engine ECM faults that require manufacturer diagnostic tools',
    ],
  },

  tools: [
    { tool: 'The manual for that exact controller AND firmware version', why: 'Code numbering is manufacturer-specific and changes between versions; without it a number carries no reliable meaning' },
    { tool: 'True-RMS digital multimeter', why: 'Measuring what the sender actually produces, and comparing it against what the controller reports' },
    { tool: 'Controller service software or configuration access', why: 'Reading thresholds, delays and the alarm log in order' },
    { tool: 'Independent gauge for the quantity in question — pressure, temperature', why: 'The only way to establish whether the measurement is TRUE rather than merely present' },
    { tool: 'Insulation and continuity test capability', why: 'Tracing chafed or corroded sender wiring, a leading cause of false alarms' },
    { tool: 'Engine manufacturer documentation where an ECM is fitted', why: 'ECM-originated codes belong to the engine, not the controller' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell or visible damage in the panel?', yes: 'Stop. Do not reset. Investigate first.', no: 'Continue' },
    { question: 'Is this a WARNING or a SHUTDOWN?', yes: 'Establish which — they carry very different urgency and different reset behaviour', no: 'Read the alarm text and the manual for this controller' },
    { question: 'Which alarm came FIRST in the log?', yes: 'Work on that one — later entries are usually consequences of it', no: 'Retrieve the log before resetting, because resetting may clear the order' },
    { question: 'Does the code come from the controller or from the engine ECM?', yes: 'Look it up in the correct document — controller manual or engine manual, not the other', no: 'Establish the source before interpreting the number' },
    { question: 'Is the measurement the alarm refers to actually TRUE?', yes: 'A genuine condition — diagnose the engine or alternator fault', no: 'Sender, wiring or threshold — the engine may be perfectly healthy' },
    { question: 'Is the sender wiring sound and correctly earthed?', yes: 'Continue', no: 'A chafed or corroded sender circuit produces a convincing false alarm' },
    { question: 'Are the configured threshold and delay appropriate for this installation?', yes: 'Continue', no: 'Factory defaults frequently do not suit a specific engine or duty' },
    { question: 'Has the cause been established?', yes: 'Correct it, then reset and validate under the condition that triggered it', no: 'Do NOT reset and restart to see what happens' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Capture the alarm log before resetting anything',
      inspect: 'The full list of active and logged alarms, with their order and timestamps',
      where: 'Controller display or service software',
      instrument: 'Service interface, or photograph the display',
      expected: 'A complete record including which alarm came first',
      ifAbnormal: 'Resetting can clear the order and destroy the most useful evidence you have. Photograph or download the log first, every time.',
      next: 'Step 2',
      warning: 'Do not reset before recording. The sequence is frequently the answer.',
    },
    {
      step: 2,
      title: 'Separate cause from consequence',
      inspect: 'Which alarm occurred first, and which followed within seconds',
      where: 'In the timestamped log',
      instrument: 'Service interface',
      expected: 'One root event with later entries explained as its consequences',
      ifAbnormal: 'A shutdown drops excitation, fuelling and load almost simultaneously, so several alarms follow one root event. Chasing the last alarm on the display is a common and costly error.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Look the code up in the correct document',
      inspect: 'The code meaning for this exact controller model and firmware version',
      where: 'Manufacturer manual for that controller, or the engine manual for ECM-sourced codes',
      instrument: 'Correct documentation',
      expected: 'An unambiguous meaning for the code in front of you',
      ifAbnormal: 'The same number means different things on different makes and can change between firmware versions. If you cannot obtain the right manual, say so rather than assuming a meaning from a similar controller.',
      next: 'Step 4',
      verify: 'The controller make, model and firmware version, and whether the code originated in the controller or was passed through from an engine ECM.',
    },
    {
      step: 4,
      title: 'Establish whether the measurement is true',
      inspect: 'The actual physical quantity, measured independently of the controller',
      where: 'At the engine or alternator, using a separate gauge or meter',
      instrument: 'Independent pressure gauge, thermometer or multimeter',
      expected: 'Agreement between the independent measurement and what the controller reports',
      ifAbnormal: 'This is the pivotal step. Disagreement means the measurement path is at fault and the engine may be entirely healthy. Agreement means the condition is real and must be diagnosed on the engine.',
      next: 'Step 5',
      warning: 'Where checking requires the set to run after a protective shutdown, do not simply restart it. Establish first that running will not cause damage.',
    },
    {
      step: 5,
      title: 'Test the sender and its wiring',
      inspect: 'Sender output against its specification, and harness continuity, insulation and earth integrity',
      where: 'At the sender and along its harness to the controller',
      instrument: 'Multimeter, insulation tester',
      expected: 'Sender output plausible for the measured condition; harness sound',
      ifAbnormal: 'Chafed wiring shorting to earth and corroded connections are leading causes of convincing false alarms. Check the earth return specifically, not only the signal wire.',
      next: 'Step 6',
      verify: 'The sender type and its output characteristic for this engine — these differ, and a sender of the wrong type reads plausibly but incorrectly.',
    },
    {
      step: 6,
      title: 'Check the configured threshold, delay and arming logic',
      inspect: 'Threshold value, time delay, and when the protection is armed in the start sequence',
      where: 'Controller configuration',
      instrument: 'Service software',
      expected: 'Settings appropriate to the engine and duty',
      ifAbnormal: 'An alarm at an unexpected point in the sequence often reflects arming or inhibit logic rather than a physical fault. Factory defaults do not always suit a specific installation.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Verify the controller supply',
      inspect: 'Controller supply voltage, especially during cranking',
      where: 'At the controller supply terminals',
      instrument: 'Multimeter, ideally recording',
      expected: 'Stable supply through the whole start sequence',
      ifAbnormal: 'A weak starting battery causing the supply to dip during cranking produces spurious alarms that appear to come from unrelated inputs. This is commonly misdiagnosed as a controller fault.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Correct the cause, then reset and validate deliberately',
      inspect: 'That the identified cause has been addressed before any restart',
      where: 'At the corrected fault',
      instrument: 'Observation and the alarm log after restart',
      expected: 'Alarm does not recur under the condition that originally triggered it',
      ifAbnormal: 'An alarm that returns means the condition is still present. Record the configuration and the cause in the maintenance record so the next person is not starting from nothing.',
      next: 'Validate under the condition that produced the alarm, not at idle',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Measurement path integrity',
      steps: [
        'Repair or replace chafed, corroded or broken sender wiring',
        'Clean and remake sender earth returns properly',
        'Re-route sender wiring away from power cabling where interference is suspected',
        'Clear moisture and insect ingress from the panel and seal entry points',
      ],
      note: 'A large share of alarms attributed to engine faults are resolved here, on the wiring.',
    },
    {
      level: 'sensor-replacement',
      title: 'Senders',
      steps: [
        'Replace a sender proven faulty by independent measurement',
        'Fit the correct sender type for the engine — a wrong type reads plausibly but incorrectly',
        'Verify the reading against an independent gauge after fitting',
      ],
    },
    {
      level: 'configuration',
      title: 'Thresholds and arming',
      steps: [
        'Adjust thresholds and delays only where measurement shows the setting is inappropriate, and record the change with its justification',
        'Never disable a protection to keep a set running',
        'Record the full configuration after any change so the next person can detect drift',
      ],
      note: 'Widening a protection threshold to silence an alarm removes the protection. That is a decision with consequences, not a settings tweak.',
    },
    {
      level: 'component-replacement',
      title: 'Controller and supply',
      steps: [
        'Replace a weak starting battery causing supply dips during cranking',
        'Replace a failed controller only after the measurement path and supply are proven',
        'Restore configuration from a record after replacement, and verify it',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Engine ECM and firmware',
      steps: [
        'Refer engine ECM faults requiring manufacturer diagnostic tools',
        'Refer firmware faults and corrupted configuration to the controller manufacturer',
      ],
    },
  ],

  validation: [
    'Confirm the alarm does not recur under the condition that originally produced it, not merely at idle',
    'Confirm the controller reading agrees with an independent measurement of the same quantity',
    'Confirm protections are all still enabled and correctly configured after the work',
    'Run the full start sequence and confirm no spurious alarms during cranking',
    'Review the alarm log after a settling period to confirm warnings have stopped rather than become less frequent',
    'Record the controller make, model, firmware version and full configuration',
    'Record the cause identified and the corrective action, so the next technician is not starting from nothing',
  ],

  whenNotToRepair: [
    'Where the correct manual for the controller and firmware cannot be obtained — interpreting a code by assumption is worse than admitting the gap',
    'Obsolete controllers where replacement units and configuration tools are unobtainable',
    'Where the only way to keep the set running would be to disable a protection',
    'Engine ECM faults requiring manufacturer tools and authorisation',
    'Where repeated alarms indicate an engine fault that needs assessment rather than controller work',
  ],

  prevention: [
    'Review the alarm log at every service visit — recurring warnings precede most shutdowns',
    'Record the full controller configuration at commissioning and after every change, so drift is detectable',
    'Inspect sender wiring and earths at service intervals, particularly on sets subject to vibration',
    'Keep the panel sealed against moisture, dust and insects',
    'Keep the starting battery healthy; controller supply dips cause alarms that look like unrelated faults',
    'Keep the correct controller manual with the set, including the firmware version in service',
    'Never normalise resetting alarms without investigation — it is how a real fault gets ignored until it becomes a failure',
  ],

  relatedSlugs: ['generator-cranks-but-will-not-start', 'generator-low-oil-pressure-shutdown', 'generator-starts-then-stops', 'j1939-spn-fmi-explained'],

  faq: [
    {
      q: 'The controller says low oil pressure. Does the engine have low oil pressure?',
      a: 'It means the controller measured a low signal on its oil pressure input. That happens when the engine genuinely has low oil pressure, when the sender has failed, and when the sender wiring has chafed to earth — and the alarm is identical in all three cases. Measure the actual pressure with an independent gauge before touching the engine. What you must not do is reset and restart to see whether it recurs, because if the pressure really is low you will destroy the engine.',
    },
    {
      q: 'Several alarms came up at once. Which one do I work on?',
      a: 'The first one in the log. A shutdown removes excitation, fuelling and load almost simultaneously, so one root event typically generates several alarms within seconds. The last alarm on the display is usually a consequence. Capture the timestamped log before resetting, because resetting can destroy the order — which is often the most useful evidence you have.',
    },
    {
      q: 'Can I look up the code online?',
      a: 'Only with care. Code numbering is manufacturer-specific and frequently changes between firmware versions of the same controller, so the same number legitimately means different things on different makes and versions. Use the manual for that exact controller and firmware. And check whether the code originated in the controller at all — on engines with an ECM, some displayed codes come from the engine and must be looked up in the engine documentation.',
    },
    {
      q: 'The alarm cleared on reset and has not come back. Is it fixed?',
      a: 'No — it is unexplained, which is not the same thing. Intermittent faults are usually wiring, connections or a marginal sender, and they return at the least convenient moment. Record it, inspect the measurement path for that input, and check the log at the next visit. An alarm that clears without explanation is information, not resolution.',
    },
  ],

  references: [
    'ISO 8528-4 — generating sets: controlgear and switchgear',
    'ISO 8528-1 — generating sets: application, ratings and performance',
    'SAE J1939 — where the controller displays engine data and diagnostic information received from an engine ECM over a CAN data link',
    'The controller manufacturer\'s manual for the exact model AND firmware version in service, which is the only valid source for code meanings, thresholds and reset paths referred to throughout',
    'The engine manufacturer\'s documentation for any fault information originating in the engine ECM',
  ],
};
