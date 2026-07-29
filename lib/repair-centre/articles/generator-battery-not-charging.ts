import type { RepairArticle } from '../types';

export const generatorBatteryNotCharging: RepairArticle = {
  slug: 'generator-battery-not-charging',
  hub: 'generators',
  header: {
    title: 'Generator Starting Battery Not Charging — Diagnosis and Repair',
    equipmentCategory: 'Generating set starting system — charging alternator and mains charger',
    appliesTo: 'Diesel generating sets with electric starting, standby and prime, with engine-driven charging alternator and separate mains battery charger',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. The key is establishing which charging source is supposed to be doing the work, because standby sets rely on a different one from running sets.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Starting system DC per set design; charger supply 240 V 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Decide which charging source should be maintaining this battery before you test anything, because a standby set and a running set depend on entirely different equipment. A set that runs continuously is charged by its engine-driven charging alternator. A standby set that starts monthly for a short test is charged almost entirely by its mains battery charger, because a brief run replaces far less than starting consumed — so on standby installations the charger, not the engine, is the real source, and a failed charger is the most common cause of a flat starting battery. Having established which source applies, the test is direct: measure battery voltage with that source active and confirm it rises above the resting value, then measure the current actually flowing into the battery. Correct voltage with no current into a discharged battery indicts the battery rather than the charger. No rise at all indicts the source, its supply or its wiring. Two further causes account for most of the remainder — a battery simply at end of life, and a parasitic drain discharging it between runs faster than the charger replaces it.',

  symptoms: {
    display: [
      'Battery low, charge failure or charge alternator alarm on the controller',
      'Battery voltage displayed below the expected float value',
      'Fail to start after a period of standing',
      'Charger fault indication on the charger itself',
    ],
    indicators: [
      'Charger indicator absent or in alarm',
      'Charge alternator warning lamp lit while the engine runs',
      'Controller showing declining battery voltage between runs',
    ],
    sounds: [
      'Belt squeal on start, indicating slip that will also stop the charging alternator working',
      'Cranking noticeably slow, which is the practical consequence',
      'Charger transformer humming loudly or not at all',
    ],
    smells: [
      'Acid or sulphurous smell at the battery, which indicates over-charging rather than under-charging',
      'Hot electronics smell from the charger',
      'Burnt insulation smell along charging cables, indicating a high-resistance joint',
    ],
    behaviour: [
      'Battery flat after the set has stood for weeks, which points at the charger or a parasitic drain',
      'Battery good immediately after a long run but flat again within days',
      'Battery warm and losing water, which indicates over-charging and is a different fault from not charging',
      'Set starts fine when run frequently and fails after a quiet period',
      'Replacement battery flattened just as quickly, which means the cause was never the battery',
    ],
    visible: [
      'Charger supply breaker or fuse condition',
      'Battery terminal corrosion and clamp tightness',
      'Charging alternator belt condition and tension',
      'Charging cable and earth strap condition',
      'Battery electrolyte level where accessible, and installation date',
      'Any aftermarket equipment added to the battery — a frequent source of parasitic drain',
    ],
  },

  whatItMeans: {
    plain:
      'The starting battery is not being kept topped up, so eventually the set will not start. On a standby set the mains-powered battery charger does almost all of that work, because a short monthly test run does not put back what starting took out. On a set that runs continuously, the engine-driven charging alternator does it. Working out which one applies is the first and most important step.',
    technical:
      'A generating set normally has two independent charging paths. The engine-driven charging alternator replenishes the battery while the engine runs, regulated to a float voltage suited to the battery chemistry. Separately, a mains-powered battery charger maintains the battery while the set is stopped, which on a standby installation is almost all the time. The relative importance of the two is determined entirely by duty: starting draws a very large current for a short period, and a brief unloaded test run does not return an equivalent charge, so a standby set whose mains charger has failed will discharge progressively over successive tests until it fails to start — with the engine and its charging alternator entirely healthy throughout. Charging behaviour follows the same constant-voltage principle as any battery charger: the source holds a float voltage and supplies whatever current the battery draws at that voltage, which falls as the battery approaches full. Low current therefore only indicates a fault when the battery is genuinely discharged, and a healthy full battery legitimately draws almost nothing. Two further mechanisms commonly defeat an otherwise working system: a parasitic drain from controllers, telemetry, block heaters or aftermarket equipment that exceeds what the charger replaces, and simple battery ageing, where rising internal resistance means the battery neither accepts charge properly nor delivers cranking current, while still presenting a plausible resting voltage.',
  },

  causes: {
    mostLikely: [
      'Mains battery charger failed, or its supply breaker or fuse open — the leading cause on standby sets',
      'Battery at end of life and no longer accepting charge',
      'Corroded or loose battery terminals and charging connections',
      'Charging alternator belt slipping, glazed or broken',
    ],
    possible: [
      'Charging alternator or its regulator failed',
      'Parasitic drain exceeding what the charger replaces between runs',
      'Charger output fuse open',
      'Charger set for the wrong battery type, so it never reaches a proper float voltage',
    ],
    lessCommon: [
      'Charging cable or earth strap corroded internally beneath intact insulation',
      'Battery isolator introducing resistance in the charging path',
      'Charger temperature compensation sensor failed, causing chronic under-charging',
      'Controller charge-sensing circuit faulty, so an alarm is raised on a healthy system',
    ],
    modelSpecific: [
      'Correct float and boost voltages are chemistry-specific and configurable on many chargers — take them from the battery documentation, not from a general figure',
      'Charging alternator regulation and warning-lamp circuits differ between machines',
      'Belt type and tension specification differ',
      'Some controllers monitor charging and raise alarms with their own thresholds, which are configurable',
    ],
    environmental: [
      'High ambient temperature shortening battery life substantially',
      'Cold reducing charge acceptance',
      'Dust, humidity and coastal salt air accelerating terminal corrosion',
      'Sets standing unused for long periods, which is the normal condition for standby plant',
    ],
    installation: [
      'No mains battery charger fitted on a standby set that runs rarely',
      'Charger supply taken from a circuit that is switched off when the building is unoccupied',
      'Battery mounted where engine heat shortens its life',
      'Aftermarket equipment connected directly to the battery without regard to standing drain',
    ],
    maintenance: [
      'Charger operation never verified at service visits',
      'Battery capacity never tested, only voltage checked',
      'Installation dates never recorded',
      'Terminals never cleaned or re-torqued',
      'Test runs too short to be useful, and load never applied',
    ],
    componentLevel: [
      'Charger power stage failed',
      'Charger output fuse open',
      'Charging alternator or regulator failed',
      'Battery cells failed',
      'Charging cable or earth strap corroded internally',
    ],
  },

  safety: {
    isolation: [
      'The starting battery is live at all times and cannot be switched off',
      'Isolate the charger supply before working on the charger, and prove dead',
      'Prevent the set from starting before working near the engine or on charging components',
      'Isolate and lock the generator control in stop',
    ],
    lockoutTagout: [
      'Lock the control selector in stop and tag it',
      'Lock and tag the charger mains supply',
      'Disconnect the battery negative first and reconnect it last',
      'Tag any changeover control so auto operation is not restored during the work',
    ],
    ppe: [
      'Eye protection at all times near batteries',
      'Acid-resistant gloves and apron for battery work',
      'Insulated tools — a spanner across a battery terminal will weld instantly',
      'Remove watches, rings and metal bracelets before battery work',
    ],
    storedEnergy: [
      'The battery remains live and can deliver very high fault current',
      'Charger internal capacitors retain charge after isolation',
      'Hot engine and exhaust surfaces remain dangerous after a run',
    ],
    specificHazards: [
      'Lead-acid batteries vent hydrogen while charging. Ventilate before working, eliminate ignition sources, and never create a spark at the battery.',
      'A dropped tool across battery terminals will weld and can rupture the battery',
      'The engine may start automatically — take the set out of auto AND lock the control before working near belts and the charging alternator',
      'Never disconnect a battery while the engine is running to "test the alternator". This can produce a damaging voltage transient and is not a valid test.',
      'A swollen, hot or leaking battery must not be disturbed — isolate the area and escalate',
    ],
    stopAndCallProfessional: [
      'Any battery is swollen, hot, leaking or damaged',
      'There is evidence of over-charging — the battery is hot or losing water rapidly',
      'There is a burnt smell from the charger or charging cables',
      'The correct charging voltages for the installed battery chemistry cannot be established',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter', why: 'Battery voltage with each charging source active — the measurement that identifies which source has failed' },
    { tool: 'DC clamp meter', why: 'Charging current into the battery, and parasitic drain with everything at rest' },
    { tool: 'Battery load tester or impedance analyser', why: 'Assessing the battery by capability rather than resting voltage' },
    { tool: 'Infrared thermometer or thermal camera', why: 'High-resistance joints in the charging path, and detecting an over-charging battery' },
    { tool: 'Insulated torque wrench and spanners', why: 'Battery and charging terminations are torque-specified and the circuit is always live' },
    { tool: 'Belt tension gauge', why: 'Charging alternator belt tension is specified; slip stops charging without breaking the belt' },
    { tool: 'Hydrometer or refractometer for flooded batteries', why: 'Assessing individual cells where the battery type allows' },
  ],

  decisionTree: [
    { question: 'Is the battery swollen, hot or leaking?', yes: 'Stop. Isolate the area and escalate.', no: 'Continue' },
    { question: 'Is this a standby set that runs briefly, or a set that runs continuously?', yes: 'Standby: the MAINS CHARGER is the real source — test it first', no: 'Continuous running: the charging alternator is the real source' },
    { question: 'Is the charger supply present and its protection intact?', yes: 'Continue', no: 'That explains it — and check whether the supply circuit is switched off when the building is unoccupied' },
    { question: 'With the charger on, does battery voltage rise above its resting value?', yes: 'Continue', no: 'The charger, its supply or its wiring has failed' },
    { question: 'Is current actually flowing into a genuinely discharged battery?', yes: 'Charging is occurring — the concern is capacity or drain, not the source', no: 'A discharged battery drawing nothing at correct voltage cannot accept charge' },
    { question: 'Does the battery pass a capacity test?', yes: 'Continue', no: 'Battery at end of life — replacement is the fix' },
    { question: 'Is there a parasitic drain with everything at rest?', yes: 'Identify and address it — it may exceed what the charger replaces', no: 'Continue' },
    { question: 'On a running set: does voltage rise with the engine running?', yes: 'Charging alternator working — investigate connections and battery', no: 'Belt, alternator or regulator fault' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the duty and therefore which source matters',
      inspect: 'How often the set runs, for how long, and whether a mains charger is fitted',
      where: 'Site records and the installation itself',
      instrument: 'Observation and the run-hours record',
      expected: 'A clear answer as to which charging source is responsible',
      ifAbnormal: 'A standby set running briefly each month is charged by its mains charger, not by the engine. Testing the charging alternator on such a set answers the wrong question.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Inspect the battery and connections',
      inspect: 'Physical condition, installation date, terminal corrosion and clamp tightness',
      where: 'At the battery and along the charging path',
      instrument: 'Inspection light, infrared thermometer',
      expected: 'No swelling or heat; terminals clean and tight; date recorded',
      ifAbnormal: 'A hot battery indicates over-charging, which is the opposite fault and needs different action. Installation dates frequently answer the question outright.',
      next: 'Step 3',
      warning: 'Do not disturb a swollen, hot or leaking battery.',
    },
    {
      step: 3,
      title: 'Measure resting voltage, then with the charger on',
      inspect: 'Battery voltage at rest, then with the mains charger energised',
      where: 'At the battery terminals',
      instrument: 'True-RMS multimeter',
      expected: 'A clear rise above resting value when the charger is on',
      ifAbnormal: 'No rise means the charger, its supply or its wiring. Check whether the charger supply circuit is switched off when the building is unoccupied — a surprisingly common installation defect.',
      next: 'Step 4',
      verify: 'The correct float voltage for the installed battery chemistry, from the battery documentation — not from a general figure.',
    },
    {
      step: 4,
      title: 'Measure charging current and interpret against state of charge',
      inspect: 'Actual DC current flowing into the battery',
      where: 'On the charging cable, using a DC clamp',
      instrument: 'DC clamp meter',
      expected: 'Meaningful current into a discharged battery, tapering as it fills',
      ifAbnormal: 'Low current alone is not a fault — a full battery draws almost nothing. Low current into a genuinely discharged battery indicts the battery.',
      next: 'Step 5',
      warning: 'Use a DC clamp; an AC-only clamp reads nothing useful here.',
    },
    {
      step: 5,
      title: 'Test the battery by capability, not by voltage',
      inspect: 'Battery performance under load, and its age',
      where: 'At the battery',
      instrument: 'Battery load tester or impedance analyser',
      expected: 'Battery capable of accepting charge and delivering cranking current',
      ifAbnormal: 'A battery at end of life reads plausibly at rest, accepts little charge and collapses under load. Where a replacement battery flattened just as fast, the cause was never the battery.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Measure parasitic drain with everything at rest',
      inspect: 'Standing current drawn from the battery with the set stopped and the charger off',
      where: 'On the battery negative lead',
      instrument: 'DC clamp meter',
      expected: 'A small standing current consistent with the controller and telemetry fitted',
      ifAbnormal: 'Compare the drain against what the charger delivers over the standing period. Aftermarket equipment connected directly to the battery is a frequent and easily missed cause.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check the engine-driven charging path',
      inspect: 'Belt condition and tension, and whether voltage rises with the engine running',
      where: 'At the charging alternator and the battery',
      instrument: 'Belt tension gauge, multimeter',
      expected: 'Voltage rising above resting value with the engine running',
      ifAbnormal: 'A glazed or slipping belt stops charging without breaking, so a visually intact belt proves nothing. On a standby set this path matters far less than the charger.',
      next: 'Step 8',
      warning: 'Never disconnect the battery with the engine running to test the alternator. It is not a valid test and can cause damage.',
    },
    {
      step: 8,
      title: 'Measure voltage drop along the charging path',
      inspect: 'Drop across each connection while charging current flows',
      where: 'Charger output to battery, and alternator to battery, including earth returns',
      instrument: 'Multimeter and thermal camera',
      expected: 'Negligible drop and cool joints',
      ifAbnormal: 'A high-resistance joint makes the charger see a voltage the battery never receives, so it terminates charging early while appearing to work correctly.',
      next: 'Repair the identified fault and validate',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Charging path integrity',
      steps: [
        'Clean and re-torque battery terminals and every charging connection to specification',
        'Clean and remake earth returns back to bare metal',
        'Replace charging cables and earth straps corroded internally beneath intact insulation',
        'Protect remade connections against corrosion',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Charging equipment and battery',
      steps: [
        'Replace or repair a failed mains battery charger — on a standby set this is the primary source',
        'Replace charger output fuses after establishing why they opened',
        'Replace slipping or glazed belts and tension to specification',
        'Replace a failed charging alternator or regulator',
        'Replace a battery that fails a capacity test, and record the installation date on it',
      ],
    },
    {
      level: 'configuration',
      title: 'Charger settings and supply arrangement',
      steps: [
        'Set the charger for the battery chemistry actually installed',
        'Verify temperature compensation where fitted, and that its sensor represents the battery',
        'Ensure the charger supply is on a circuit that is not switched off when the site is unoccupied',
        'Review the test-run regime so it is long enough to be useful',
      ],
      note: 'A charger fed from a circuit that is turned off out of hours is a common and entirely avoidable installation defect.',
    },
    {
      level: 'wiring',
      title: 'Parasitic drain',
      steps: [
        'Identify and address loads drawing from the battery between runs',
        'Feed aftermarket equipment through a properly considered supply rather than directly from the starting battery',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond field repair',
      steps: [
        'Refer charger power-stage faults and charging alternator internal faults',
        'Provide the measured voltages, currents and standing drain',
      ],
    },
  ],

  validation: [
    'Confirm battery voltage rises appropriately with the charger energised',
    'Confirm charging current flows into a discharged battery and tapers as it fills',
    'Confirm voltage rises with the engine running where the charging alternator is relevant',
    'Measure and record standing drain after the work',
    'Measure voltage drop along the charging path under charging current',
    'Confirm the battery holds charge over a standing period rather than only immediately after the repair',
    'Confirm the set cranks briskly after standing, which is the real test of success',
    'Record battery installation date, capacity test result and all measurements',
  ],

  whenNotToRepair: [
    'Batteries at end of life — replacement is the fix, and further charger investigation is wasted effort',
    'Any battery showing swelling, leakage or heat damage',
    'Obsolete chargers where replacement is more economical than repair',
    'Installations with no mains charger on a standby set, where the answer is to fit one rather than to keep replacing batteries',
    'Where the battery environment is too hot to give reasonable life, which needs correcting first',
  ],

  prevention: [
    'Verify the mains charger is actually working at every service visit — on a standby set it is the real charging source and its failure is silent',
    'Test battery capacity annually rather than checking voltage only',
    'Record battery installation dates and plan replacement at end of design life',
    'Clean and re-torque battery and earth connections at every service',
    'Measure standing drain at commissioning and record it, so later additions are detectable',
    'Ensure the charger supply cannot be switched off when the site is unoccupied',
    'Make test runs long enough and under load, so they are a genuine exercise rather than a formality',
    'Keep the battery out of direct engine heat where the installation allows',
  ],

  relatedSlugs: ['starter-motor-clicks-but-will-not-crank', 'generator-cranks-but-will-not-start'],

  faq: [
    {
      q: 'The engine runs fine, so why is the battery flat?',
      a: 'Because on a standby set the engine barely charges it. Starting draws a very large current for a few seconds, and a short unloaded monthly test run does not put back an equivalent charge. The mains battery charger does that work, so a failed charger flattens the battery progressively over successive tests while the engine and its charging alternator remain perfectly healthy.',
    },
    {
      q: 'We fitted a new battery and it went flat just as fast. What did we miss?',
      a: 'The cause was never the battery. Look at three things: whether the mains charger is actually working and its supply is not switched off out of hours, whether there is a parasitic drain from controllers, telemetry or aftermarket equipment exceeding what the charger replaces, and whether a high-resistance joint in the charging path is causing the charger to terminate early.',
    },
    {
      q: 'Can I test the charging alternator by disconnecting the battery while it runs?',
      a: 'No. That was never a valid test and it can produce a damaging voltage transient across the electrical system, including the set controller. Measure battery voltage with the engine running and compare it against the resting value, and measure current with a DC clamp — both are safe and give a better answer.',
    },
    {
      q: 'The battery is warm and needs topping up often. Is the charger not working?',
      a: 'That is the opposite fault. Heat and water loss indicate over-charging, usually from a charger set for the wrong battery type, a float voltage set too high, or a failed temperature compensation sensor. Over-charging destroys a battery as effectively as under-charging, and it needs correcting rather than tolerating.',
    },
  ],

  references: [
    'ISO 8528 — reciprocating internal combustion engine driven alternating current generating sets',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'IEEE 1188 — recommended practice for maintenance, testing and replacement of VRLA batteries',
    'The set, charger and battery manufacturers\' documentation for the specific equipment, which is the only valid source for float and boost voltages, belt tension and connection torque values referred to throughout',
  ],
};
