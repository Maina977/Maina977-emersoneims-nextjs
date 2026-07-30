import type { RepairArticle } from '../types';

export const generatorLowOilPressureShutdown: RepairArticle = {
  slug: 'generator-low-oil-pressure-shutdown',
  hub: 'generators',
  header: {
    title: 'Generator Low Oil Pressure Shutdown — Diagnosis and Repair',
    equipmentCategory: 'Diesel generating set',
    appliesTo: 'All diesel generating sets with oil pressure protection — Cummins, Perkins, Caterpillar, Volvo Penta, Deutz, Doosan, FG Wilson, SDMO and others',
    faultCode: 'Commonly reported as SPN 100 with FMI 1 or 18 on J1939 engines',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Straightforward to confirm, potentially serious to resolve. The critical decision is made in one step: is the reading real?',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-29',
    electricalSystem: '12 V or 24 V DC control',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Low oil pressure is the one shutdown you must never override, defeat or "test by running it a bit longer". Below the pressure that maintains a hydrodynamic film, the bearing shells and journals are in metal-to-metal contact and damage accumulates in seconds, not minutes. The entire diagnosis turns on a single question answered early: is the pressure genuinely low, or is the measurement wrong? Fit a mechanical gauge to the main gallery and compare it against what the controller reports. If the mechanical gauge confirms low pressure, stop and treat it as a mechanical fault. If the mechanical gauge shows normal pressure, you are chasing a sender, its wiring or the controller input, and the engine was never at risk.',

  symptoms: {
    display: [
      'Low oil pressure shutdown latched on the controller',
      'On J1939 engines, an oil pressure parameter reported below its normal range',
      'Pressure reading that falls as the engine warms, which is characteristic of genuine low pressure rather than a sender fault',
      'Repeated shutdowns at the same point in the run',
    ],
    indicators: [
      'Shutdown lamp latched, requiring manual reset',
      'Gauge reading below normal for the speed and oil temperature',
      'Pressure normal at start then decaying — the classic signature of thinning oil over marginal clearances',
    ],
    sounds: [
      'Knocking or rumbling from the bottom end, which indicates damage is already occurring — stop immediately',
      'Tapping from the valve train, suggesting oil is not reaching the top end',
      'No unusual noise at all, which is common and does not clear the engine',
    ],
    smells: [
      'Diesel smell in the oil, indicating fuel dilution which destroys oil viscosity',
      'Burnt oil smell, suggesting overheating or oil breakdown',
    ],
    behaviour: [
      'Shuts down only when hot, which points at viscosity falling over worn clearances',
      'Shuts down on load application, when demand on the lubrication system peaks',
      'Shut down immediately after a service, which points at the filter, the oil grade or the quantity used',
      'Runs normally with a bypassed or disconnected switch — a dangerous state that must never be left in service',
    ],
    visible: [
      'Oil level and oil condition on the dipstick, checked stopped and level',
      'Oil above the maximum mark, which indicates dilution by fuel or coolant',
      'External leaks at the filter, cooler, seals or gallery plugs',
      'Metallic glitter in the oil, which is a stop-work finding',
    ],
  },

  whatItMeans: {
    plain:
      'The engine protected itself because the oil pressure fell below a safe level. Oil pressure is what keeps a film of oil between moving metal parts. Without it, those parts touch and damage begins very quickly. The first job is not to fix the engine — it is to find out whether the pressure is really low or the gauge is lying.',
    technical:
      'Journal bearings operate hydrodynamically: rotation drags oil into a converging wedge, generating a pressure film that separates the journal from the shell. Gallery pressure is the supply that sustains that film against leakage from the bearing clearances. Because leakage flow through a clearance rises sharply with clearance and falls with viscosity, gallery pressure is simultaneously a function of pump delivery, oil viscosity at temperature, and total bearing clearance. This is why genuine low pressure characteristically appears hot rather than cold, and why worn clearances present first as a hot-idle pressure fault. It also explains why fuel dilution is so destructive: it reduces viscosity, increasing leakage flow and lowering pressure while simultaneously weakening the film the pressure is meant to maintain. A low reading with normal mechanical pressure is a measurement fault — the sender, its wiring, or the controller input, and carries no mechanical risk, which is why the mechanical gauge check comes early and decides the entire direction of the work.',
  },

  causes: {
    mostLikely: [
      'Oil level low, the single most common and most easily eliminated cause',
      'Sender or its wiring faulty, so the pressure was never actually low',
      'Wrong oil grade for the ambient temperature, giving low viscosity when hot',
      'Oil diluted by fuel, which lowers viscosity and pressure together',
    ],
    possible: [
      'Oil filter incorrect, blocked, or with a failed anti-drain or bypass arrangement',
      'Pressure relief valve stuck open, capping pressure below normal',
      'Suction strainer partially blocked, starving the pump',
      'Oil cooler internally restricted',
    ],
    lessCommon: [
      'Worn main or big-end bearing clearances, presenting first as low pressure when hot',
      'Oil pump wear or a failing pump drive',
      'Gallery plug missing or a cracked gallery after previous work',
      'Camshaft or balancer bearing wear increasing total leakage',
    ],
    modelSpecific: [
      'The pressure specification differs substantially between engines and between idle and rated speed — always read it from the engine data for the specific model rather than comparing against another set',
      'Shutdown threshold and any low-pressure warning band are configured in the controller and must be checked against the commissioning record',
      'Some engines use a pressure switch rather than a sender, which changes the electrical test entirely',
    ],
    environmental: [
      'High ambient temperature raising oil temperature and lowering viscosity',
      'Very low ambient making the wrong grade too thick at start and masking a warm-running fault',
      'Sustained high load raising oil temperature beyond the design assumption',
    ],
    installation: [
      'Set installed out of level, so the dipstick reading and pickup submersion are both wrong',
      'Engine room ambient far above the design assumption, driving oil temperature up',
      'Remote oil cooler or filter installation adding restriction the engine was not designed for',
    ],
    maintenance: [
      'Oil and filter changes deferred beyond the hours interval',
      'Wrong grade used at the last service',
      'Oil topped up with a different grade, changing the blended viscosity',
      'Oil analysis never taken, so a rising wear trend was never seen',
    ],
    componentLevel: [
      'Pressure sender drifted out of calibration',
      'Sender wiring shorted to earth, producing a permanent low reading',
      'Controller analogue input failed — rare, and concluded only after the sender and wiring are proven',
    ],
  },

  safety: {
    isolation: [
      'Stop the engine immediately on a genuine low oil pressure indication and prevent it restarting',
      'Place the controller in OFF or STOP and isolate any automatic start command',
      'Isolate the battery before working on sender wiring',
    ],
    lockoutTagout: [
      'Lock off and tag the set — a low oil pressure fault is exactly the situation where someone else restarting the engine causes permanent damage',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection and gloves for oil handling',
      'Hot-surface protection — oil and the engine remain hot long after shutdown',
      'Absorbent material to contain spillage',
    ],
    storedEnergy: [
      'The lubrication system remains pressurised briefly after shutdown; allow it to settle before cracking any fitting',
      'Hot oil scalds — allow the engine to cool before opening the system',
    ],
    specificHazards: [
      'Running an engine with confirmed low oil pressure causes rapid, expensive and sometimes unrecoverable bearing damage. This is the fault where the temptation to "just run it briefly" is most costly.',
      'Never bypass, link out or disable an oil pressure shutdown to keep a set running',
      'Metallic glitter in the oil means the engine must not be run at all pending inspection',
      'Hot oil under pressure from a cracked fitting causes serious burns',
    ],
    stopAndCallProfessional: [
      'A mechanical gauge confirms genuinely low pressure',
      'There is any knocking or rumbling from the engine',
      'Metallic particles or glitter are visible in the oil',
      'Oil is above the maximum mark or smells of fuel',
      'The engine has been run for any period with a confirmed low pressure indication',
    ],
  },

  tools: [
    { tool: 'Mechanical oil pressure gauge with adaptor', why: 'The decisive instrument. It separates a mechanical fault from a measurement fault, and everything else follows from that result.' },
    { tool: 'Digital multimeter, true RMS', why: 'Sender resistance or output, and wiring continuity and shorts to earth' },
    { tool: 'Infrared or contact thermometer', why: 'Oil temperature at the moment the pressure is read — pressure without temperature is not comparable to a specification' },
    { tool: 'Oil sample kit', why: 'Wear metals, viscosity and fuel dilution; the cheapest way to see inside the engine' },
    { tool: 'Filter wrench', why: 'Filter removal and inspection of the element and its bypass arrangement' },
    { tool: 'Service tool', why: 'Reading the reported value and the shutdown history alongside the mechanical gauge' },
    { tool: 'Inspection light and mirror', why: 'External leak tracing at the cooler, seals and gallery plugs' },
  ],

  decisionTree: [
    { question: 'Is there knocking, rumbling, or metallic glitter in the oil?', yes: 'Stop. Do not run the engine. Refer for internal inspection.', no: 'Continue' },
    { question: 'Is the oil level correct, with the set stopped and level?', yes: 'Continue', no: 'Correct the level with the specified grade, then re-test before going further' },
    { question: 'Is the oil above maximum, milky, or does it smell of fuel?', yes: 'Investigate dilution — this is a separate and more serious fault than a pressure sender', no: 'Continue' },
    { question: 'Does a mechanical gauge on the gallery confirm the low reading?', yes: 'This is a real mechanical fault. Go to the supply-side checks and be prepared to stop.', no: 'The engine was never at risk. Diagnose the sender, wiring and controller input.' },
    { question: 'Is the correct oil grade in use for the ambient and the engine?', yes: 'Continue', no: 'Drain and refill with the specified grade, then re-measure hot' },
    { question: 'Is the filter correct, unblocked and its bypass intact?', yes: 'Continue', no: 'Replace and re-measure' },
    { question: 'Is the pressure relief valve free and seating correctly?', yes: 'Continue to pump and clearances', no: 'Free or replace it and re-measure' },
    { question: 'Is pressure low only when hot, and acceptable when cold?', yes: 'This pattern points at viscosity over worn clearances — refer for clearance assessment', no: 'Assess pump delivery and the suction path' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Stop, and check the obvious before anything else',
      inspect: 'Oil level, oil condition, and any external leak',
      where: 'Dipstick with the set stopped and standing level; visual sweep of the engine and under the set',
      instrument: 'Clean rag and an inspection light',
      expected: 'Level between the marks, oil of normal colour and smell, no external leak',
      ifAbnormal: 'A low level explains the fault and costs nothing to correct. Oil above maximum, milky, or smelling of diesel is a different and more serious finding.',
      next: 'Step 2',
      warning: 'If there is knocking, rumbling, or glitter in the oil, do not run the engine again pending inspection.',
    },
    {
      step: 2,
      title: 'Fit a mechanical gauge — this step decides everything',
      inspect: 'Actual gallery pressure compared against the controller reading',
      where: 'Main oil gallery test point',
      instrument: 'Mechanical oil pressure gauge with the correct adaptor',
      expected: 'Mechanical and reported readings agree',
      ifAbnormal: 'Disagreement means the engine was never at risk and you are chasing a measurement fault. Agreement means the protection was correct and this is mechanical.',
      next: 'If disproved go to Step 3. If confirmed go to Step 4.',
      warning: 'Run only long enough to take the reading, and stop immediately if pressure is genuinely low.',
      verify: 'The correct pressure at idle and at rated speed, and the temperature at which it applies, are engine-specific. Read them from the engine data.',
    },
    {
      step: 3,
      title: 'Diagnose the sender and its circuit where the reading is disproved',
      inspect: 'Sender output through its range, wiring continuity, and shorts to earth',
      where: 'At the sender connector and at the controller input',
      instrument: 'Digital multimeter',
      expected: 'Sender within specification, wiring continuous, no short to earth',
      ifAbnormal: 'A short to earth produces a permanent low reading. A drifted sender produces an intermittent one. Repair wiring before replacing the sender.',
      next: 'Replace what is proven faulty, then Step 9',
      verify: 'Whether the engine uses a sender or a simple pressure switch changes the test entirely — confirm which is fitted.',
    },
    {
      step: 4,
      title: 'Measure oil temperature alongside pressure',
      inspect: 'Oil temperature at the moment the pressure reading is taken',
      where: 'Sump or gallery',
      instrument: 'Infrared or contact thermometer',
      expected: 'Temperature within the normal operating band',
      ifAbnormal: 'Pressure quoted without temperature is not comparable to a specification. High oil temperature lowers viscosity and therefore pressure, and points at the oil cooler or at overload rather than at bearings.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Verify the oil grade and check for dilution',
      inspect: 'Grade in use against specification, and the oil for fuel or coolant dilution',
      where: 'Service records, the drum used at the last service, and a sample',
      instrument: 'Oil sample kit',
      expected: 'Correct grade for the ambient, no dilution, viscosity within limits',
      ifAbnormal: 'Fuel dilution lowers viscosity and pressure together and indicates a separate injection or combustion fault that must also be found.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Inspect the filter and its bypass arrangement',
      inspect: 'Filter part number, condition, and the anti-drain and bypass valves',
      where: 'Filter housing',
      instrument: 'Filter wrench and inspection light',
      expected: 'Correct filter, not collapsed, bypass intact',
      ifAbnormal: 'An incorrect filter can lack the correct bypass or anti-drain function, producing low or delayed pressure that looks like a pump fault.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check the pressure relief valve',
      inspect: 'Relief valve for a stuck-open condition, debris on the seat, and spring condition',
      where: 'Relief valve location per the engine layout',
      instrument: 'Basic hand tools and an inspection light',
      expected: 'Valve free, seat clean, spring intact',
      ifAbnormal: 'A relief valve held open by debris caps gallery pressure below normal and is a genuine, repairable cause that is often missed.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Assess the suction path, pump and clearances',
      inspect: 'Suction strainer condition, pump delivery, and the hot-versus-cold pressure pattern',
      where: 'Sump and pump, with pressure logged cold and hot',
      instrument: 'Mechanical gauge and workshop measuring equipment',
      expected: 'Clear strainer, pump delivering to specification, pressure holding when hot',
      ifAbnormal: 'Pressure acceptable cold but low hot is the characteristic signature of worn clearances. This is a workshop decision, not a field repair.',
      next: 'Refer for internal assessment with all readings recorded',
      verify: 'Bearing clearance limits are engine-specific and require the workshop manual figures.',
    },
    {
      step: 9,
      title: 'Confirm the protection setting before returning to service',
      inspect: 'Shutdown threshold and any warning band in the controller',
      where: 'Controller configuration',
      instrument: 'Service tool',
      expected: 'Settings match the commissioning record and the engine specification',
      ifAbnormal: 'A threshold that has been altered can produce nuisance shutdowns — or, far worse, fail to protect. Restore it rather than working around it.',
      next: 'Validation',
      warning: 'Never raise or disable an oil pressure protection threshold to stop a set tripping.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Level, grade and connections',
      steps: [
        'Correct the oil level with the specified grade — never mix grades to make up quantity',
        'Clean and re-terminate the sender connection and protect it against moisture',
      ],
    },
    {
      level: 'sensor-replacement',
      title: 'Sender and wiring',
      steps: [
        'Replace a sender proven wrong by a mechanical gauge',
        'Repair wiring shorted to earth before replacing components',
      ],
      note: 'Never replace a sender on suspicion alone. Prove it with a mechanical gauge first.',
    },
    {
      level: 'mechanical',
      title: 'Lubrication system',
      steps: [
        'Change oil and filter with the specified grade and correct part number',
        'Free or replace a relief valve that is not seating',
        'Clean the suction strainer',
        'Clean or replace a restricted oil cooler',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Pump and bearing clearances',
      steps: [
        'Refer pump replacement and bearing clearance assessment to a properly equipped workshop',
        'Take an oil sample for ferrography before dismantling — it informs the scope of work',
      ],
      note: 'An engine that has run with confirmed low pressure should be assessed internally rather than returned to service on a pressure reading alone.',
    },
    {
      level: 'configuration',
      title: 'Protection settings',
      steps: [
        'Restore shutdown and warning thresholds to the commissioned values',
        'Verify the shutdown operates by testing it deliberately under controlled conditions',
      ],
    },
  ],

  validation: [
    'Confirm oil pressure with a mechanical gauge at idle and at rated speed, at normal operating temperature',
    'Compare the controller reading against the mechanical gauge across the range and confirm they track',
    'Run under load and confirm pressure holds as oil temperature rises',
    'Check for leaks at every joint disturbed, hot and under pressure',
    'Take an oil sample as a new baseline where the engine has been opened or the cause was wear-related',
    'Prove the shutdown function still operates rather than assuming it does',
    'Record pressure at idle, at rated speed, and the oil temperature at which they were taken',
  ],

  whenNotToRepair: [
    'Confirmed low pressure hot on a high-hours engine, where clearance wear is general and a rebuild is the real decision',
    'Metallic debris in the oil indicating bearing material already lost',
    'Coolant in the oil, which is a separate and more serious failure',
    'An engine that has been run for a sustained period with a confirmed low pressure indication',
    'Where the assessed rebuild cost approaches the value of a replacement set correctly rated for the load',
  ],

  prevention: [
    'Change oil and filter on the hours interval rather than the calendar',
    'Use the grade specified for the site ambient, and never top up with a different grade',
    'Take an oil sample at every service and trend wear metals, viscosity and fuel dilution',
    'Investigate any downward trend in pressure before it becomes a shutdown',
    'Keep the engine room within its design ambient so oil temperature stays in band',
    'Record pressure at idle and rated speed at each service so the trend is visible',
    'Test the shutdown function periodically — a protection that has never been proven is an assumption',
  ],

  relatedSlugs: ['controller-alarm-interpretation', 'diesel-engine-abnormal-noise', 'generator-cranks-but-will-not-start', 'generator-overheating', 'generator-starts-then-stops'],

  faq: [
    {
      q: 'Can I raise the shutdown threshold to stop the nuisance trips?',
      a: 'No. If the pressure is genuinely low, raising the threshold removes the only thing preventing bearing destruction. If the pressure is not genuinely low, the sender or wiring is at fault and that is what needs fixing. Either way, changing the threshold treats the alarm rather than the engine.',
    },
    {
      q: 'Pressure is fine when cold and low when hot. What does that mean?',
      a: 'That pattern is characteristic. Oil viscosity falls as temperature rises, so leakage through bearing clearances increases and gallery pressure drops. An engine with worn clearances therefore shows the fault hot first. It is a genuine indication and warrants clearance assessment rather than another sender.',
    },
    {
      q: 'Why is fitting a mechanical gauge so important when the controller already shows a value?',
      a: 'Because the controller reading and the actual pressure are two different things, and the entire direction of the work depends on which one is wrong. Five minutes with a mechanical gauge either exonerates the engine completely or confirms a mechanical fault. No other single step separates the two possibilities so cleanly.',
    },
    {
      q: 'The oil level was low. Can I just top it up and return the set to service?',
      a: 'Top it up, yes, but find out where the oil went. Oil does not disappear. Investigate leaks and consumption, and check the oil is not diluted by fuel, which raises the level while lowering the viscosity and the pressure together.',
    },
  ],

  references: [
    'SAE J1939 — vehicle network for diesel ECU diagnostics; oil pressure is reported as SPN 100 with the failure mode identified by the FMI',
    'ISO 8528 — reciprocating internal combustion engine driven AC generating sets',
    'The engine manufacturer\'s service documentation for the specific model, which gives the pressure specification, the temperature it applies at, and the clearance limits',
  ],
};
