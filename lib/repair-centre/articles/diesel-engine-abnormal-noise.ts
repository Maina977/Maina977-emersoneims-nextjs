import type { RepairArticle } from '../types';

export const dieselEngineAbnormalNoise: RepairArticle = {
  slug: 'diesel-engine-abnormal-noise',
  hub: 'engine-systems',
  header: {
    title: 'Diesel Engine Abnormal Noise — Which Sounds Mean Stop Now',
    equipmentCategory: 'Diesel engines — mechanical condition and bearing failure',
    appliesTo: 'Diesel engines in generating sets and plant, naturally aspirated and turbocharged',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate to interpret, but the urgent decision is simple: some noises mean stop immediately, and continuing to run is what turns a repair into a replacement.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Set output 240 V / 415 V 50 Hz nominal; engine mechanical per design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'The first decision is not what the noise is but whether to keep running, and getting that wrong is far more expensive than any misdiagnosis. A deep, heavy knock that rises with load and speed — particularly one that appeared suddenly — should be treated as a bearing or bottom-end problem and the set stopped immediately, because a failing bearing that is allowed to run destroys the crankshaft and frequently the block, turning a repairable engine into scrap. The same applies to any metallic noise accompanied by falling oil pressure. Beyond that, the useful distinctions are these: injector or combustion knock is sharper and more rhythmic, changes with fuelling and often with temperature, and typically indicates injection timing or an injector rather than mechanical damage. Valve-train noise is a lighter, faster tapping tied to camshaft speed and usually related to clearances. Turbocharger noise is a whine or siren rather than a knock, and a change in its pitch or the appearance of a rattle warrants stopping before debris passes downstream. Note when the noise appears — cold or hot, on load or off, at what speed, because the pattern narrows it considerably before anything is dismantled.',

  symptoms: {
    display: [
      'Low oil pressure warning or shutdown accompanying the noise, which makes the decision urgent',
      'No indication at all, which is common and does not mean the noise is benign',
      'Exhaust temperature or load readings that corroborate a combustion-related noise',
    ],
    indicators: [
      'Oil pressure gauge reading lower than its normal running value',
      'Metallic particles visible in the oil or on the filter when cut open',
      'Coolant or fuel contamination of the oil, indicated by level rising',
    ],
    sounds: [
      'Deep heavy knock rising with load and speed — treat as bottom-end and stop',
      'Sharper rhythmic knock changing with fuelling — more consistent with injection or combustion',
      'Light rapid tapping at camshaft speed — valve train and clearances',
      'Whine or siren from the turbocharger, or a rattle from it',
      'Rhythmic slap that is worse cold and improves warm — often piston-related',
      'Squeal from belts, distinct from any internal noise',
      'Noise that disappears when one cylinder is isolated, which localises it',
    ],
    smells: [
      'Burnt oil smell accompanying a knock, which suggests overheating of a bearing',
      'Fuel smell in the oil, indicating dilution which destroys oil film strength',
      'Any burnt smell means stop and investigate rather than continue',
    ],
    behaviour: [
      'Noise appeared suddenly, which is far more concerning than one that developed slowly',
      'Noise present from cold and improving as the engine warms',
      'Noise absent cold and appearing when hot, which points at clearances opening or oil thinning',
      'Noise rising markedly with load, which is characteristic of bearing problems',
      'Noise following an oil pressure event, an overheat, or running low on oil',
      'Noise after a service, suggesting incorrect clearances, wrong oil or a fitting error',
      'Loss of power accompanying the noise',
    ],
    visible: [
      'Oil level, condition, and whether it is contaminated with fuel or coolant',
      'Oil filter contents when cut open — metallic particles are decisive',
      'Oil pressure reading against its normal running value',
      'Turbocharger shaft play and oil traces at either end',
      'Belt and pulley condition, to eliminate external noise sources',
      'Any recent maintenance work on the engine',
    ],
  },

  whatItMeans: {
    plain:
      'Engines make characteristic noises, and a new one means something has changed. The important judgement is not identifying it precisely but deciding whether it is safe to keep running. A deep knock that gets worse with load usually means a bearing is failing, and every further minute of running makes the repair bigger and more expensive. Lighter, sharper noises are often fuel or valve related and less urgent, but they still need investigating rather than living with.',
    technical:
      'Mechanical noise in a diesel engine originates from clearances, combustion and rotating components, and the useful diagnostic dimensions are pitch, rhythm, and how the noise responds to load, speed and temperature. Bottom-end knock arises when bearing clearance grows enough for the journal to be driven against the shell under firing load, so it is deep, load-dependent, and worsens as the clearance and consequent oil-film failure progress. It is the most urgent because a failing bearing rapidly scores the journal and can, once the shell material has gone, damage the crankshaft and block beyond economic repair, which is why running on is what determines whether the engine is repairable. Combustion or injector knock is produced by an abnormal rate of pressure rise, from injection timing, an injector delivering poorly or fuel of the wrong characteristic, and it is therefore sharper, tied to fuelling and often temperature-dependent. Valve-train noise occurs at camshaft speed, so it is faster and lighter, and generally reflects clearances or wear rather than imminent failure. Turbocharger noise is aerodynamic rather than impulsive; a change in pitch, or a rattle, indicates bearing wear or contact and warrants shutdown before debris is carried into the engine. Two contextual findings raise the urgency of any noise: falling oil pressure, because it indicates the lubrication that protects every bearing is compromised, and oil contaminated by fuel or coolant, because both destroy the load-carrying capacity of the oil film and will cause bearing failure regardless of the original noise.',
  },

  causes: {
    mostLikely: [
      'Main or big-end bearing wear or failure — deep knock, load-dependent, urgent',
      'Injection timing incorrect or an injector delivering poorly — sharper combustion knock',
      'Valve clearances out of specification — light rapid tapping',
      'Turbocharger bearing wear — change in whine, or a rattle',
    ],
    possible: [
      'Piston slap from cylinder wear, typically worse cold',
      'Oil diluted by fuel, or contaminated by coolant, destroying oil film strength',
      'Incorrect oil grade for the engine or ambient conditions',
      'Low oil level or oil pressure',
      'Loose or failing belt, pulley or accessory drive',
    ],
    lessCommon: [
      'Small-end or gudgeon pin wear',
      'Timing gear or chain wear',
      'Broken piston ring or damaged piston',
      'Foreign object in a cylinder',
      'Flywheel, coupling or damper fault, which can mimic engine noise',
    ],
    modelSpecific: [
      'Valve clearances, injection timing and oil specification are engine-specific — take them from the manufacturer data',
      'Normal running oil pressure differs between engines and with temperature and speed; compare against the engine data and its own history',
      'Some engines are characteristically noisier than others, so a baseline for that engine matters more than a general expectation',
      'Turbocharger shaft play limits are stated by the manufacturer',
    ],
    environmental: [
      'High ambient temperature thinning the oil and reducing film strength',
      'Dust ingress accelerating wear where air filtration has been neglected',
      'Cold starts, which are when oil film is weakest and most wear occurs',
      'Long standing periods allowing oil to drain from bearing surfaces',
    ],
    installation: [
      'Misalignment between engine and alternator imposing loads the bearings were not designed for',
      'Coupling or damper incorrectly fitted',
      'Set operating above rating, raising bearing loads',
      'Poor foundation or mounting allowing resonance that is mistaken for engine noise',
    ],
    maintenance: [
      'Oil and filter changes extended beyond the interval',
      'Wrong oil grade used',
      'Valve clearances never checked',
      'Oil analysis never carried out, so wear metals go unnoticed until failure',
      'Oil pressure never recorded at service, so a downward trend is invisible',
      'Engine run low on oil at some point in its history',
    ],
    componentLevel: [
      'Main or big-end bearing shells worn or failed',
      'Injector faulty',
      'Valve clearance out of specification',
      'Turbocharger bearings worn',
      'Piston, ring or liner wear',
    ],
  },

  safety: {
    isolation: [
      'Stop the set and prevent automatic restart before any inspection',
      'Lock the control in stop and isolate the starting battery',
      'Isolate the set output breaker before working around it',
      'Allow the engine to cool before touching exhaust, manifold or turbocharger',
    ],
    lockoutTagout: [
      'Lock the control selector in stop and tag it',
      'Disconnect and tag the starting battery',
      'Tag the changeover control so auto operation is not restored during the work',
    ],
    ppe: [
      'Hearing protection whenever the set runs, and note that listening to a noisy engine is exactly when people neglect it',
      'Eye protection and gloves',
      'Heat-resistant gloves near a recently run engine',
      'Close-fitting clothing near rotating parts',
    ],
    storedEnergy: [
      'Rotating parts continue turning after shutdown',
      'Exhaust, manifold and turbocharger surfaces remain hot long after stopping',
      'The cooling system stays pressurised while hot',
      'The starting battery is live at all times',
      'Common-rail fuel systems may retain very high pressure after shutdown',
    ],
    specificHazards: [
      'CONTINUING TO RUN AN ENGINE WITH A BOTTOM-END KNOCK IS THE MOST EXPENSIVE DECISION AVAILABLE. A failing bearing scores the journal within minutes and can damage the crankshaft and block beyond economic repair. Stop first, diagnose second.',
      'Diagnosing by ear requires the engine running, which means working near rotating parts, hot surfaces and exhaust. Plan the position before starting, and never lean over a running engine.',
      'Never run a set in an enclosed or poorly ventilated space while listening to it — exhaust exposure is a real risk during exactly this kind of extended observation.',
      'Never use a screwdriver as a stethoscope near belts, fan or coupling; use a proper listening device and keep clear of rotating parts.',
      'Never loosen a high-pressure fuel fitting on a running engine to isolate a cylinder — injection-pressure fuel penetrates skin and requires immediate surgical attention.',
    ],
    stopAndCallProfessional: [
      'A deep knock that rises with load, especially if it appeared suddenly',
      'Any metallic noise accompanied by falling oil pressure',
      'Metallic particles found in the oil or filter',
      'Oil contaminated with coolant or fuel',
      'Suspected turbocharger bearing failure, before debris passes downstream',
      'Any situation where the proposed action is to keep running and monitor it',
    ],
  },

  tools: [
    { tool: 'Mechanic\'s stethoscope or electronic listening device', why: 'Localising noise to a region of the engine safely, without improvising near rotating parts' },
    { tool: 'Oil pressure gauge, independent of the engine instrument', why: 'Confirming actual oil pressure, because falling pressure alongside a noise changes the urgency entirely' },
    { tool: 'Oil filter cutter and inspection light', why: 'Metallic particles in the filter are among the most decisive findings available, and cost almost nothing to look for' },
    { tool: 'Oil sampling kit for laboratory analysis', why: 'Wear metals identify which components are wearing before failure occurs' },
    { tool: 'Feeler gauges', why: 'Valve clearances, where valve-train noise is indicated' },
    { tool: 'Dial indicator', why: 'Turbocharger shaft play against the manufacturer limit' },
    { tool: 'Engine manufacturer service data', why: 'Valve clearances, injection timing, oil specification, normal oil pressure and shaft play limits must be read, never assumed' },
  ],

  decisionTree: [
    { question: 'Is oil pressure falling, or is there any metallic noise?', yes: 'STOP the engine now. Do not continue to diagnose while running.', no: 'Continue' },
    { question: 'Is the noise a deep knock that rises with load, and did it appear suddenly?', yes: 'Treat as bottom-end. Stop and escalate — running on determines whether it stays repairable.', no: 'Continue' },
    { question: 'Are there metallic particles in the oil or filter?', yes: 'Stop. This is decisive evidence of component wear in progress.', no: 'Continue' },
    { question: 'Is the oil contaminated with fuel or coolant?', yes: 'Stop. Oil film strength is compromised and bearing failure will follow regardless of the original noise.', no: 'Continue' },
    { question: 'Does the noise change with fuelling, and is it sharper and rhythmic?', yes: 'More consistent with injection or combustion than mechanical damage', no: 'Continue' },
    { question: 'Is it a light rapid tapping at camshaft speed?', yes: 'Valve train — check clearances against the manufacturer specification', no: 'Continue' },
    { question: 'Is it a whine or rattle from the turbocharger?', yes: 'Stop before debris passes downstream, and check shaft play', no: 'Continue' },
    { question: 'Is it worse cold and improving warm?', yes: 'Often piston-related, but confirm rather than assume', no: 'Localise with a stethoscope before dismantling anything' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Decide whether to keep running — before anything else',
      inspect: 'Oil pressure, the character of the noise, and whether it rises with load',
      where: 'At the control panel and the engine',
      instrument: 'Observation and the oil pressure reading',
      expected: 'A conscious decision, made immediately',
      ifAbnormal: 'A deep load-dependent knock, or any noise with falling oil pressure, means stop now. This decision costs nothing and determines whether the engine remains repairable.',
      next: 'Step 2',
      warning: 'Continuing to run a knocking engine to gather more information is the most expensive diagnostic step available.',
    },
    {
      step: 2,
      title: 'Check oil level, condition and contamination',
      inspect: 'Level, colour, smell, and whether fuel or coolant is present',
      where: 'At the dipstick and filler',
      instrument: 'Visual and olfactory inspection',
      expected: 'Correct level, oil of normal appearance',
      ifAbnormal: 'A rising level suggests fuel dilution or coolant entry, both of which destroy oil film strength and cause bearing failure regardless of the original noise. Low level explains a great deal on its own.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Cut the oil filter open and inspect it',
      inspect: 'Metallic particles trapped in the filter medium',
      where: 'The oil filter, removed',
      instrument: 'Filter cutter, inspection light, magnet',
      expected: 'No significant metallic content',
      ifAbnormal: 'This is among the most decisive findings available and takes minutes. Metallic particles mean components are wearing now, and the engine should not be run pending a proper assessment.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Measure oil pressure independently',
      inspect: 'Actual oil pressure at normal running temperature, compared against the engine data and its own history',
      where: 'At a gallery test point',
      instrument: 'Independent oil pressure gauge',
      expected: 'Pressure consistent with the engine specification for that temperature and speed',
      ifAbnormal: 'A low reading alongside a knock strongly supports bearing clearance. Compare against the engine data rather than a remembered figure, since normal pressure varies substantially between engines.',
      next: 'Step 5',
      verify: 'Normal running oil pressure for this engine at temperature and speed, from the manufacturer data.',
    },
    {
      step: 5,
      title: 'Characterise the noise properly',
      inspect: 'Pitch, rhythm, and response to load, speed and temperature',
      where: 'With the engine running, from a safe position',
      instrument: 'Mechanic\'s stethoscope or electronic listening device',
      expected: 'A description precise enough to distinguish the categories',
      ifAbnormal: 'Deep and load-dependent points at the bottom end. Sharper and fuelling-dependent points at combustion. Light and fast at camshaft speed points at the valve train. Aerodynamic points at the turbo.',
      next: 'Step 6',
      warning: 'Use a proper listening device. Improvising with a screwdriver near belts, fan or coupling is how people are injured during exactly this task.',
    },
    {
      step: 6,
      title: 'Localise the noise to a region or cylinder',
      inspect: 'Where on the engine the noise is loudest, and whether it changes when a cylinder\'s contribution is altered',
      where: 'Across the block, head and turbocharger',
      instrument: 'Stethoscope; cylinder cut-out via the manufacturer\'s approved method only',
      expected: 'Noise localised to a region',
      ifAbnormal: 'Combustion-related noise usually changes when that cylinder stops firing; mechanical noise usually does not. Use the manufacturer\'s approved method for cutting out a cylinder.',
      next: 'Step 7',
      warning: 'Never loosen a high-pressure fuel fitting on a running engine to isolate a cylinder.',
    },
    {
      step: 7,
      title: 'Check valve clearances and turbocharger play where indicated',
      inspect: 'Valve clearances against specification; turbo shaft radial and axial play against the limit',
      where: 'At the valve gear and the turbocharger',
      instrument: 'Feeler gauges, dial indicator',
      expected: 'Both within manufacturer limits',
      ifAbnormal: 'These are the two accessible mechanical checks that resolve a meaningful share of noise complaints without dismantling the engine.',
      next: 'Step 8',
      verify: 'Valve clearance specification and turbocharger shaft play limits for this engine.',
    },
    {
      step: 8,
      title: 'Sample the oil for laboratory analysis',
      inspect: 'Wear metals, contamination and oil condition',
      where: 'A representative sample taken correctly',
      instrument: 'Oil sampling kit and laboratory analysis',
      expected: 'Wear metals consistent with normal service',
      ifAbnormal: 'Analysis identifies which components are wearing and often confirms or excludes a bearing problem before any dismantling, which is worth the delay where the decision is expensive.',
      next: 'Refer confirmed bottom-end, piston or injection faults to a properly equipped facility',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Clearances and timing',
      steps: [
        'Set valve clearances to the manufacturer specification',
        'Correct injection timing where combustion knock is confirmed',
      ],
    },
    {
      level: 'cleaning-and-connections',
      title: 'Lubrication and contamination',
      steps: [
        'Correct oil level and change to the specified grade where the wrong oil is in use',
        'Establish and correct the source of fuel or coolant contamination before refilling',
        'Restore the oil and filter change interval, and shorten it where the environment demands',
      ],
      note: 'Contaminated oil causes bearing failure regardless of what the original noise was. Address it before anything else.',
    },
    {
      level: 'component-replacement',
      title: 'Accessible mechanical items',
      steps: [
        'Replace faulty injectors',
        'Replace a turbocharger with shaft play beyond the limit, and establish why it failed',
        'Replace belts, pulleys and dampers producing external noise',
      ],
    },
    {
      level: 'mechanical',
      title: 'Alignment and mounting',
      steps: [
        'Correct engine-to-alternator alignment, which imposes bearing loads when wrong',
        'Correct coupling and damper fitting',
        'Address mounting or foundation resonance mistaken for engine noise',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Bottom end and internals',
      steps: [
        'Refer bearing, crankshaft, piston and liner work to a properly equipped facility',
        'Provide the oil analysis, filter inspection findings, oil pressure readings and noise description',
      ],
      note: 'Where bottom-end damage is suspected, the engine should not be run pending assessment.',
    },
  ],

  validation: [
    'Confirm the noise is absent across the speed and load range that produced it, not just at idle',
    'Measure and record oil pressure at temperature after the work',
    'Inspect the oil filter again after a run-in period',
    'Take a follow-up oil sample and compare wear metals against the pre-repair result',
    'Confirm no metallic content is appearing in the oil',
    'Run under sustained representative load before returning the set to service',
    'Record the noise description, all readings and the cause identified',
  ],

  whenNotToRepair: [
    'Engines run on after a bottom-end knock, where crankshaft and block damage may make repair uneconomic',
    'Engines with widespread wear where overhaul cost approaches replacement',
    'Where oil analysis shows advanced wear across multiple components',
    'Engines whose history includes running low on oil or a severe overheat, where damage is likely broader than the presenting noise',
    'Where the underlying cause — misalignment, overload, contamination — cannot be corrected',
  ],

  prevention: [
    'Treat a new engine noise as urgent rather than something to monitor; the cheapest moment to act is the first time it is heard',
    'Record oil pressure at every service so a downward trend is visible before a noise appears',
    'Use oil analysis on sets that matter — it identifies wear before it becomes audible',
    'Cut and inspect the oil filter at each change; it costs minutes and finds problems early',
    'Change oil and filters on the interval the environment demands, using the specified grade',
    'Check valve clearances at the manufacturer interval',
    'Correct engine-to-alternator alignment properly after any work that disturbs it',
    'Never run a set low on oil, and investigate any oil loss rather than topping up indefinitely',
  ],

  relatedSlugs: ['generator-low-oil-pressure-shutdown', 'generator-excessive-smoke'],

  faq: [
    {
      q: 'The engine has a knock but still runs. Can we finish the shift?',
      a: 'If it is a deep knock that rises with load, no, and this is the single most expensive judgement in the whole guide. A failing bearing scores the journal within minutes, and once the shell material has gone it damages the crankshaft and often the block, turning a repairable engine into scrap. Stopping now may cost you a shift; running on can cost you the engine.',
    },
    {
      q: 'How do I tell a bearing knock from injector knock?',
      a: 'By pitch and by what changes it. Bearing knock is deeper, heavier and rises with LOAD. Injector or combustion knock is sharper and more rhythmic, changes with FUELLING, and is often temperature-dependent. Combustion noise usually alters when that cylinder stops firing; mechanical noise usually does not. If oil pressure is also falling, treat it as mechanical and stop.',
    },
    {
      q: 'Is cutting the oil filter open really worth it?',
      a: 'It is one of the most decisive checks available and takes minutes. Metallic particles trapped in the medium mean components are wearing right now, which converts an ambiguous noise into a clear decision not to run. Do it at every oil change as well, not only when investigating a fault — it finds problems long before they become audible.',
    },
    {
      q: 'The noise is only there when cold and goes once warm. Is that acceptable?',
      a: 'It is less urgent than a load-dependent knock, and is often piston-related as clearances close up with expansion, but it should still be identified rather than lived with, because it indicates wear that will progress. Confirm oil pressure is normal and there is no metallic content in the filter, then investigate properly rather than accepting it as a characteristic of the engine.',
    },
  ],

  references: [
    'ISO 8528 — reciprocating internal combustion engine driven alternating current generating sets',
    'ISO 3046 — reciprocating internal combustion engines: performance',
    'ISO 4406 — hydraulic fluid power: method for coding the level of contamination by solid particles, as applied to oil cleanliness assessment',
    'The engine manufacturer\'s service data for the specific engine, which is the only valid source for valve clearances, injection timing, oil specification, normal oil pressure and turbocharger shaft play limits referred to throughout',
  ],
};
