import type { RepairArticle } from '../types';

export const insulationTestingProtectingElectronics: RepairArticle = {
  slug: 'insulation-testing-protecting-electronics',
  hub: 'testing-tools',
  header: {
    title: 'Insulation Testing Without Destroying the Electronics',
    equipmentCategory: 'Test instruments and method',
    appliesTo:
      'Insulation resistance testing on motors, generators, cables, switchgear and installations containing drives, controllers, UPS equipment and electronic protection',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'The test is easy to perform and easy to perform destructively — most of the skill is in what you disconnect first and how you interpret what you get',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'Applies across LV installations, 240 V single-phase and 415 V three-phase 50 Hz nominal, and to equipment DC systems',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'An insulation resistance tester deliberately applies a high DC voltage, and that voltage destroys the semiconductors in drives, soft starters, inverters, controllers, electronic protection and surge protection devices. The rule is simple and absolute: everything electronic comes out of the circuit before the test voltage goes on, and surge protection is disconnected because it is designed to conduct at exactly the voltage you are about to apply. Beyond safety, the value of the test lies in interpretation rather than in a single number. A reading that is high and steady is healthy; a reading that starts acceptable and falls while you watch indicates moisture rather than a hard fault; and a reading compared against the same circuit measured last year tells you far more than any absolute figure compared against a remembered minimum. Always discharge the circuit through the instrument afterwards, because a long cable stores a genuinely dangerous charge.',

  symptoms: {
    display: [
      'Insulation reading far lower than expected on a circuit that appears to work',
      'Reading that falls steadily during the test rather than settling',
      'Reading that differs greatly between phases on a three-phase circuit',
      'Reading that varies with weather or time of day',
    ],
    indicators: [
      'Residual current device tripping on a circuit whose insulation tests as sound',
      'Equipment failing immediately after an insulation test was carried out — the signature of a test done without disconnection',
    ],
    sounds: ['Audible discharge or crackling at a termination during testing, which means stop immediately'],
    smells: ['Burnt smell after a test, indicating something electronic was still connected'],
    behaviour: [
      'Drive, controller or protection relay dead immediately after a routine insulation test',
      'Reading acceptable when the equipment is dry and poor after rain',
      'Reading improving as a motor warms and worsening as it cools',
      'Different engineers obtaining different readings on the same circuit, usually because they disconnected different things',
    ],
    visible: [
      'Surge protection devices still connected during testing',
      'Drives, soft starters or controllers still in circuit',
      'Electronic protection relays, meters and monitoring still wired in',
      'Moisture, contamination or salt deposits at terminations',
      'Damaged cable insulation at a gland, edge or bend',
      'Test leads damaged or of insufficient category rating for the location',
    ],
  },

  whatItMeans: {
    plain:
      'An insulation tester checks whether electricity can leak where it should not, by pushing a high voltage between the conductors and earth and measuring how much gets through. That high voltage is fine for cables and motor windings, which is what the test is for. It is not fine for anything with electronics in it — drives, controllers, protection relays, surge protectors — because they are not built to withstand it and it kills them instantly. So the first part of the job is deciding what has to be taken out of circuit, and that is the part people get wrong.',
    technical:
      'Insulation resistance testing applies a stabilised DC voltage between conductors and earth, and measures the resulting leakage current to derive resistance. Solid insulation in good condition presents a very high resistance, and the measurement is sensitive to moisture, contamination and physical damage. The test voltage is chosen relative to the working voltage of the circuit and is specified by the applicable standard and by the equipment manufacturer; applying a higher voltage than the equipment is rated for is itself destructive. Semiconductor devices, electronic protection, metering and surge protection all present a breakdown or conduction path far below typical test voltages, so they must be isolated from the circuit rather than merely switched off — a switched-off drive is still connected. Interpretation depends on more than the final value: a reading that decays during the test indicates absorption current dominated by moisture, whereas a steady reading indicates a stable dielectric, and comparison against the same circuit measured previously, or against sibling phases measured at the same time, is more diagnostically reliable than comparison against any generic minimum. Temperature also matters, because insulation resistance falls as temperature rises, so readings taken at different temperatures are not directly comparable.',
  },

  causes: {
    mostLikely: [
      'Test carried out without disconnecting drives, soft starters or controllers, destroying them',
      'Surge protection devices left connected, which conduct at the test voltage and give a falsely low reading as well as being damaged',
      'Moisture or contamination at terminations giving a low reading with no insulation fault present',
      'Genuine insulation deterioration in cable or windings from age, heat, water ingress or mechanical damage',
    ],
    possible: [
      'Test voltage higher than the equipment rating, damaging otherwise sound insulation',
      'Reading taken at a different temperature from the comparison reading, making the two incomparable',
      'Test leads damaged or of inadequate category rating, giving unreliable readings or presenting a hazard',
      'Circuit not fully isolated, so the reading includes parallel paths through other equipment',
      'Neutral-to-earth bond left in place, producing a low reading that reflects the bond rather than a fault',
    ],
    lessCommon: [
      'Instrument out of calibration or with flat batteries, giving readings that are confidently wrong',
      'Capacitive charging on a long cable misread as a fault before the reading settles',
      'Insulation genuinely damaged by a previous over-voltage test',
      'Reading affected by an unexpected parallel circuit through an interconnected control system',
    ],
    modelSpecific: [
      'The test voltage to use and the minimum acceptable resistance are specified by the equipment manufacturer and by the applicable standard — both differ between a new machine and one in service',
      'Motor and generator manufacturers state their own test voltages and acceptance criteria, and these take precedence for that machine',
      'Drive and controller manuals state explicitly what must be disconnected before testing, and often how',
      'Some equipment must not be insulation tested at all; the manufacturer will say so',
    ],
    environmental: [
      'Humidity and condensation lowering readings without any insulation defect',
      'Wet-season conditions producing readings that recover in dry weather',
      'Dust and salt contamination at terminations creating surface leakage paths',
      'Temperature differences between test occasions making comparison unreliable',
      'Coastal salt air degrading terminations over time',
    ],
    installation: [
      'Electronic equipment wired without any means of convenient isolation for testing',
      'Surge protection installed without a disconnect provision, so it is either damaged or left in circuit',
      'Terminations made without adequate ingress protection',
      'Cables installed with damage at glands and edges that only shows as a low reading later',
    ],
    maintenance: [
      'No baseline reading taken at commissioning, so later readings have nothing meaningful to compare against',
      'Readings not recorded, so trends are invisible',
      'Temperature not recorded alongside the reading, making comparison unsound',
      'The same circuit tested by different people disconnecting different things, producing inconsistent results',
      'Instrument never calibrated',
    ],
    componentLevel: [
      'Winding insulation degradation',
      'Cable insulation damage or ageing',
      'Termination contamination',
      'Surge protection device end of life',
    ],
  },

  safety: {
    isolation: [
      'Isolate the circuit, lock it and prove dead before connecting the instrument. The test is performed on a dead circuit, always.',
      'Disconnect all electronic equipment from the circuit rather than merely switching it off — a switched-off drive remains connected.',
      'Disconnect surge protection devices; they are designed to conduct at the voltage you are about to apply.',
      'Where the circuit includes a generator or an alternative supply, isolate that too.',
    ],
    lockoutTagout: [
      'Lock and tag every source feeding the circuit under test.',
      'Ensure nobody can access the far end of the circuit while test voltage is applied — a long cable run means the other end may be out of sight.',
      'Post a warning at the remote end where the circuit crosses areas others can reach.',
    ],
    ppe: [
      'Insulated gloves rated above the test voltage',
      'Eye protection',
      'Test leads and probes of the correct category rating for the location, in good condition',
      'Appropriate arc-rated clothing where the test point is within switchgear',
    ],
    storedEnergy: [
      'The instrument charges the circuit capacitance to the test voltage. A long cable stores a genuinely dangerous charge and must be discharged through the instrument before handling.',
      'Confirm discharge has occurred rather than assuming — most instruments indicate it, and the reading falling to zero is the confirmation.',
      'Motor windings and cables both retain charge after testing.',
      'Where the circuit includes capacitors, they may retain charge for a long period.',
    ],
    specificHazards: [
      'The test voltage is lethal and is present on the conductors throughout the test, including at the far end of a long cable where nobody can see you working.',
      'Applying test voltage with electronics connected destroys them instantly and silently; the damage is not always immediately apparent, which makes it worse.',
      'Testing a circuit that is not fully isolated can back-feed test voltage into an installation.',
      'Damaged test leads present a direct shock hazard at test voltage.',
      'Never touch conductors after a test until discharge is confirmed.',
    ],
    stopAndCallProfessional: [
      'You cannot establish what must be disconnected, or cannot disconnect it safely.',
      'The equipment manufacturer states that insulation testing must not be performed.',
      'You do not have an instrument of the correct test voltage and category rating.',
      'The circuit cannot be fully isolated from all sources.',
      'Readings indicate a fault on a circuit serving life-safety or medical equipment.',
      'Any circuit at a voltage or location beyond your competence and authorisation.',
    ],
  },

  tools: [
    { tool: 'Insulation resistance tester with selectable test voltage', why: 'The test voltage must match the circuit and the equipment, not whatever the instrument defaults to' },
    { tool: 'Proving unit and a multimeter', why: 'Proving dead before connecting the instrument — the test is performed on a dead circuit' },
    { tool: 'Test leads of the correct category rating, in good condition', why: 'Damaged leads at test voltage are a direct shock hazard and give unreliable readings' },
    { tool: 'Thermometer', why: 'Insulation resistance varies with temperature, so a reading without a temperature is not comparable with anything' },
    { tool: 'Equipment manufacturer data', why: 'Test voltage, acceptance criteria and what must be disconnected are all equipment-specific' },
    { tool: 'Record sheet', why: 'The trend across services is more diagnostically useful than any single reading' },
    { tool: 'Labels and temporary markers', why: 'Everything disconnected must go back exactly as it was; an unlabelled disconnection is the next fault' },
  ],

  decisionTree: [
    {
      question: 'Is the circuit fully isolated from every source and proved dead?',
      yes: 'Proceed to disconnection of electronics',
      no: 'Stop. The test is performed on a dead circuit only.',
    },
    {
      question: 'Has every drive, soft starter, controller, meter and electronic protection been DISCONNECTED, not just switched off?',
      yes: 'Continue',
      no: 'Disconnect them. Switched off is still connected, and the test voltage will destroy them.',
    },
    {
      question: 'Has surge protection been disconnected?',
      yes: 'Continue',
      no: 'Disconnect it. It conducts at the test voltage, so it will be damaged and it will give you a falsely low reading.',
    },
    {
      question: 'Is the test voltage correct for the circuit and the equipment?',
      yes: 'Proceed with the test',
      no: 'Too high damages sound insulation; too low gives a reading that means little. Take it from the standard and the manufacturer.',
    },
    {
      question: 'Is the reading high and steady, or does it fall while you watch?',
      yes: 'A steady high reading indicates a stable dielectric',
      no: 'A falling reading indicates moisture rather than a hard fault — dry it and retest before condemning anything',
    },
    {
      question: 'Has the circuit been discharged through the instrument and discharge confirmed?',
      yes: 'Safe to disconnect and reinstate',
      no: 'Discharge it. A long cable holds a dangerous charge after testing.',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish what is on the circuit before touching anything',
      inspect: 'Every item of equipment connected to the circuit under test',
      where: 'The circuit, from the schematic and by inspection',
      instrument: 'The schematic and your eyes',
      expected: 'A complete list of what must be disconnected',
      ifAbnormal:
        'Anything with electronics — drives, soft starters, controllers, meters, protection relays, monitoring, surge protection — must come out of circuit',
      next: 'Where the schematic is missing or wrong, inspect physically rather than assuming',
      warning:
        'This step is the whole job. The most expensive insulation test is the one performed with a drive still connected.',
    },
    {
      step: 2,
      title: 'Isolate, lock off and prove dead',
      inspect: 'That every source feeding the circuit is isolated and locked',
      where: 'All supply points',
      instrument: 'Multimeter with a proving unit',
      expected: 'Circuit proved dead at every conductor',
      ifAbnormal: 'Any live source means the test must not proceed',
      next: 'Consider alternative supplies — generators, UPS, inverters and interconnected control systems',
      warning: 'Prove the meter before and after. A dead meter and a dead circuit look identical.',
    },
    {
      step: 3,
      title: 'Disconnect the electronics and label everything',
      inspect: 'Physical disconnection of every electronic item, and surge protection',
      where: 'At the terminals',
      instrument: 'Hand tools and labels',
      expected: 'A circuit consisting only of cable, windings, and passive components',
      ifAbnormal:
        'Switching a drive off does not disconnect it. Removing a fuse may not disconnect all conductors. Physical disconnection is what the test requires.',
      next: 'Label every disconnection as you make it — reinstating from memory is where errors enter',
      verify: 'Drive and controller manuals state explicitly what must be disconnected and how',
    },
    {
      step: 4,
      title: 'Select the correct test voltage',
      inspect: 'The test voltage appropriate to the circuit and to the equipment',
      where: 'Instrument setting',
      instrument: 'The applicable standard and the equipment manufacturer data',
      expected: 'A voltage appropriate to the circuit working voltage and permitted by the equipment manufacturer',
      ifAbnormal:
        'Too high damages sound insulation and is itself a destructive act. Too low gives a reading that does not stress the insulation meaningfully.',
      next: 'Where machine and cable are tested together, the lower of the permitted voltages governs',
      verify:
        'Motor and generator manufacturers state their own test voltages and acceptance criteria, and those take precedence for that machine',
    },
    {
      step: 5,
      title: 'Test, and watch the reading rather than just recording it',
      inspect: 'Insulation resistance conductor to earth, and between conductors, over the test duration',
      where: 'At the disconnected circuit',
      instrument: 'Insulation resistance tester',
      expected: 'A high reading that rises or holds steady as the test proceeds',
      ifAbnormal:
        'A reading that falls steadily during the test indicates moisture. A reading that is low and stable indicates a hard fault. These are different problems with different remedies.',
      next: 'Record the temperature at the time of test alongside the reading',
      warning:
        'Ensure nobody is in contact with the circuit at any point, including the far end which may be out of sight.',
    },
    {
      step: 6,
      title: 'Discharge and confirm',
      inspect: 'That the circuit has discharged through the instrument',
      where: 'At the test connection',
      instrument: 'The instrument discharge function and its indication',
      expected: 'Voltage falling to zero and the instrument confirming discharge',
      ifAbnormal: 'A long cable holds a substantial charge; do not handle conductors until discharge is confirmed',
      next: 'Where capacitors are present in the circuit, allow additional time',
      warning: 'This step causes injuries when skipped, on long cable runs particularly.',
    },
    {
      step: 7,
      title: 'Interpret by comparison, not against a remembered number',
      inspect: 'The reading against sibling circuits, against the same circuit previously, and against the manufacturer criterion',
      where: 'Your record sheet',
      instrument: 'Judgement, informed by the records',
      expected: 'A defensible conclusion rather than a pass or fail impression',
      ifAbnormal:
        'A reading well below its siblings measured the same day is a strong signal. A reading below a generic minimum but consistent with its own history and temperature may be perfectly normal for that machine.',
      next:
        'Where moisture is suspected, dry the equipment properly and retest before condemning any insulation',
      verify:
        'Acceptance criteria come from the applicable standard and the equipment manufacturer, and differ between new and in-service equipment',
    },
    {
      step: 8,
      title: 'Reinstate exactly, and verify the installation works',
      inspect: 'Every disconnection restored, torqued and verified against the labels and the schematic',
      where: 'Every terminal disturbed',
      instrument: 'Labels, schematic and a torque screwdriver',
      expected: 'Everything back as found, surge protection restored, all terminations torqued',
      ifAbnormal:
        'A conductor left off, or reconnected to the wrong terminal, is the classic aftermath of a testing visit',
      next: 'Energise and confirm normal operation before leaving; record the readings and the temperature',
      warning:
        'Surge protection must be reconnected. Leaving it disconnected removes the protection the installation was designed with.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Where the low reading is contamination rather than damage',
      steps: [
        'Clean and dry terminations, terminal boxes and insulators showing moisture, dust or salt deposits.',
        'Dry motor and generator windings using the manufacturer approved method, and retest as drying proceeds — a rising reading confirms moisture was the cause.',
        'Address the ingress path: seals, glands, drip loops and enclosure integrity, or the moisture returns.',
        'Retest after drying and record both readings, since the improvement is itself the diagnosis.',
      ],
      note:
        'A falling reading during the test is the moisture signature. Drying is a repair; replacing sound windings because of a wet-weather reading is not.',
    },
    {
      level: 'wiring',
      title: 'Where the insulation is genuinely damaged',
      steps: [
        'Locate the fault by sectionalising the circuit and retesting each section rather than replacing on suspicion.',
        'Replace damaged cable sections rather than repairing mid-run where the length allows.',
        'Correct the mechanical cause — an edge, a gland, a bend radius — or the replacement fails in the same place.',
        'Retest after repair and record the result.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Instruments, leads and surge protection',
      steps: [
        'Replace damaged test leads immediately; at test voltage they are a direct hazard.',
        'Keep instruments calibrated and check batteries before a testing visit — a flat instrument gives confidently wrong readings.',
        'Replace surge protection devices found at end of life while they are disconnected for testing.',
        'Reconnect surge protection before leaving, without exception.',
      ],
    },
    {
      level: 'configuration',
      title: 'Making future testing safe and repeatable',
      steps: [
        'Provide convenient isolation points for electronic equipment so future testing does not require improvised disconnection.',
        'Fit surge protection with a disconnect provision.',
        'Record a baseline reading at commissioning, with temperature, so later readings are comparable.',
        'Standardise which items are disconnected and record it, so different engineers obtain comparable results.',
      ],
    },
  ],

  validation: [
    'Insulation resistance high and stable, meeting the manufacturer and standard criteria for equipment in service',
    'Reading recorded together with the temperature at the time of test',
    'Reading compared against sibling circuits and against the previous record',
    'Circuit discharged through the instrument and discharge confirmed',
    'Every disconnection reinstated per the labels and schematic, and torqued',
    'Surge protection reconnected and confirmed',
    'Installation energised and confirmed operating normally before leaving site',
  ],

  whenNotToRepair: [
    'Equipment the manufacturer states must not be insulation tested — the instruction is there for a reason',
    'Windings with insulation degraded along their length rather than at one point, where rewinding is the answer',
    'Cable with generalised ageing rather than localised damage',
    'Any circuit that cannot be fully isolated from all sources',
    'Situations where the required disconnection cannot be made safely or cannot be reliably reinstated',
  ],

  prevention: [
    'Record a baseline insulation reading with temperature at commissioning, and at every service thereafter',
    'Always record the temperature — a reading without one cannot be compared with anything',
    'Standardise and record what gets disconnected, so results are comparable between visits and between engineers',
    'Provide isolation points for electronic equipment at design stage so testing does not require improvisation',
    'Fit surge protection with a means of disconnection',
    'Keep instruments calibrated and leads in good condition',
    'Test before wet-season conditions and after, so weather-related variation is understood rather than alarming',
    'Never leave surge protection disconnected after testing — build it into the job sheet as a closing check',
  ],

  relatedSlugs: [
    'test-instruments-and-measurement-errors',
    'safe-isolation-and-proving-dead',
    'three-phase-motor-failure-diagnosis',
    'borehole-drop-cable-and-motor-testing',
  ],

  faq: [
    {
      q: 'Do I really have to disconnect the drive? It is switched off.',
      a: 'Yes. Switched off is not disconnected — the semiconductors are still across the circuit and the test voltage will destroy them instantly. The damage is often silent, so the equipment appears fine until it is called on. Physical disconnection is what the test requires.',
    },
    {
      q: 'Why must surge protection be disconnected?',
      a: 'Because it is designed to conduct at a voltage in the same region as your test voltage. Leaving it in circuit both damages the device and gives you a falsely low reading, so you can end up condemning perfectly sound insulation. Disconnect it for the test and reconnect it before you leave.',
    },
    {
      q: 'The reading falls while I watch. Is the insulation failing?',
      a: 'Usually it means moisture rather than a hard fault. A wet dielectric shows a reading that decays during the test, whereas genuine damage tends to give a low but stable reading. Dry the equipment properly and retest — a rising reading confirms moisture was the cause, and that is a repair rather than a replacement.',
    },
    {
      q: 'What minimum reading should I accept?',
      a: 'Take it from the applicable standard and the equipment manufacturer, and note that the figure for equipment in service differs from the figure for new equipment. More useful in practice is comparison — against the sibling phases measured the same day, and against the same circuit measured previously at a known temperature. A trend beats an absolute every time.',
    },
    {
      q: 'Does temperature matter?',
      a: 'Considerably. Insulation resistance falls as temperature rises, so a reading taken on a hot machine is not comparable with one taken cold. Always record the temperature alongside the reading, otherwise the number cannot be compared with anything later.',
    },
    {
      q: 'Is it safe to touch the cable straight after the test?',
      a: 'No. The instrument has charged the cable capacitance to the test voltage, and on a long run that is a genuinely dangerous stored charge. Discharge through the instrument and confirm the discharge before handling anything.',
    },
  ],

  references: [
    'Equipment manufacturer data — permitted test voltage, acceptance criteria, and what must be disconnected before testing',
    'Motor and generator manufacturer insulation testing instructions and acceptance criteria for machines in service',
    'Drive, soft starter and controller manuals — explicit disconnection requirements before insulation testing',
    'IEEE 43 — recommended practice for testing insulation resistance of electric machinery',
    'IEC 60364-6 — low-voltage electrical installations: verification',
    'Instrument manufacturer instructions and current calibration certificate',
    'Site records of previous insulation readings with the temperature at which they were taken',
  ],
};
