import type { RepairArticle } from '../types';

export const motorBearingFailureDiagnosis: RepairArticle = {
  slug: 'motor-bearing-failure-diagnosis',
  hub: 'motors',
  header: {
    title: 'Motor Bearing Failure — Noise, Heat and Knowing When to Stop',
    equipmentCategory: 'Three-phase induction motor',
    appliesTo:
      'Three-phase squirrel-cage induction motors, foot and flange mounted, direct-on-line and drive-fed, driving pumps, fans, compressors and conveyors',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Straightforward to detect, harder to attribute — the bearing is usually the victim of something else, and replacing it without finding the cause buys only months',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Motor supply 415 V three-phase 50 Hz nominal, or drive output where inverter-fed',
    safetyClass: 'rotating-machinery',
  },

  directAnswer:
    'A failing bearing announces itself before it seizes: a rising noise that changes with speed, a bearing housing running hotter than the opposite end, and vibration that grows over weeks. Diagnose it by comparison — drive end against non-drive end, and this motor against its own history — rather than against an absolute figure. The important judgement is not whether the bearing is failing but why. Bearings very rarely wear out on their own; they are killed by misalignment, belt over-tension, contamination, over-greasing, or shaft currents from an inverter drive. Replace the bearing without correcting the cause and the replacement fails the same way. Stop the machine immediately if you hear grinding or knocking under load, if the housing is too hot to touch briefly, or if the shaft has developed radial play, because the next stage is rotor-to-stator contact and that turns a bearing job into a rewind.',

  symptoms: {
    display: [
      'Drive reporting rising current or intermittent overload on an inverter-fed motor',
      'Overload relay tripping more often than it used to, with no change in process load',
      'Condition-monitoring trend showing vibration rising over successive readings',
    ],
    indicators: [
      'Motor running warmer overall, with one end distinctly hotter than the other',
      'Current drawn slightly higher than the historical figure for the same duty',
    ],
    sounds: [
      'Rumbling or growling that rises and falls with speed',
      'Rhythmic clicking or ticking that repeats per revolution',
      'Grinding — a late-stage sound indicating the rolling elements or races are already damaged',
      'Squealing, often from a dry bearing or one starved of grease',
      'Knocking under load, which indicates significant clearance and is a stop-now sound',
    ],
    smells: [
      'Hot grease smell from the bearing housing',
      'Burnt varnish smell, which means the winding is now being affected and the situation has escalated',
    ],
    behaviour: [
      'Noise and vibration worsening progressively rather than appearing suddenly',
      'Motor harder to turn by hand than its condition should suggest, with the machine isolated',
      'Vibration changing when the coupling is disconnected, which separates motor faults from driven-machine faults',
      'Bearing that was replaced recently already noisy again — the classic sign that the real cause was never addressed',
    ],
    visible: [
      'Grease leaking from the bearing housing or thrown around the end shield',
      'Grease discoloured dark or carbonised, indicating overheating',
      'Shaft with visible radial play when levered gently, with the machine isolated',
      'Fretting or discolouration on the shaft at the bearing seat',
      'Belt drive running with visible misalignment or excessive tension',
      'Coupling showing uneven wear or elastomer degradation',
      'Fluting or washboard marking on a removed bearing race — the signature of shaft current damage on inverter-fed motors',
    ],
  },

  whatItMeans: {
    plain:
      'The bearings are what let the motor shaft spin freely. They wear, and as they wear they get noisy, hot and loose. If they are left long enough they seize or allow the shaft to move sideways far enough that the spinning part touches the fixed part inside the motor — and at that point the repair changes from a cheap bearing to an expensive rewind. Bearings rarely just wear out on their own, though. Something usually causes it: the motor pulling against a misaligned load, a belt done up too tight, dirt or water getting in, too much grease, or electrical currents passing through the bearing on drive-fed motors.',
    technical:
      'A rolling-element bearing fails through a progression: initial surface damage, spalling of the race, increasing clearance, then loss of shaft location. Each stage produces a characteristic signature — early damage shows in high-frequency vibration and a rising noise floor long before it is audible as a fault; late damage shows as gross vibration, heat and measurable radial play. Because heat generation depends on load and lubrication state, the drive-end and non-drive-end housings of a healthy motor track closely, and a divergence between them is a more reliable indicator than any absolute temperature. Root cause matters more than the failure itself: radial preload from belt over-tension concentrates on the drive-end bearing; angular misalignment loads both bearings cyclically; contamination produces rapid abrasive wear; over-greasing raises churning losses and temperature; and on inverter-fed motors, common-mode voltage can drive current through the bearing, eroding the races into the fluting pattern that is unmistakable once seen.',
  },

  causes: {
    mostLikely: [
      'Misalignment between motor and driven machine, either angular or parallel, loading the bearings cyclically',
      'Belt drive over-tensioned, imposing sustained radial load well beyond design on the drive-end bearing',
      'Lubrication fault — too little, too much, the wrong grease, or two incompatible greases mixed',
      'Contamination ingress, particularly water and abrasive dust in pump houses, quarries and agricultural sites',
    ],
    possible: [
      'Bearing at genuine end of life on a motor with long running hours',
      'Shaft current damage on inverter-fed motors without an insulated bearing, shaft grounding ring or output filter',
      'Coupling wear transmitting shock loads into the motor',
      'Excessive vibration transmitted from the driven machine — an unbalanced fan or a cavitating pump',
    ],
    lessCommon: [
      'Incorrect bearing fitted at a previous repair — wrong clearance class, wrong type, or a sealed bearing where a regreasable one was specified',
      'Bearing fitted by hammering rather than heating, damaging the races on installation',
      'Soft foot, where the motor is drawn down onto an uneven base and the frame is distorted',
      'Rotor imbalance following a previous repair',
      'Shaft or housing worn beyond tolerance so the bearing turns in its seat',
    ],
    modelSpecific: [
      'Bearing sizes, clearance class and grease type are specific to the motor — take them from the nameplate and manufacturer data, never from a similar-looking machine',
      'Regreasing interval and quantity are specified by the manufacturer and vary widely with frame size and speed',
      'Some motors are fitted with an insulated non-drive-end bearing specifically for inverter duty; a standard bearing fitted in its place will fail by fluting',
    ],
    environmental: [
      'Dust and abrasive ingress at quarry, cement, agricultural and unsealed borehole sites',
      'Water ingress from washdown, rain on outdoor installations, or condensation in motors that stand idle',
      'High ambient temperature reducing grease life',
      'Vibration from adjacent plant transmitted through a shared base',
      'Motors standing idle for long periods, allowing false brinelling where vibration marks stationary bearings',
    ],
    installation: [
      'Alignment never carried out properly, or carried out cold and never rechecked at operating temperature',
      'Soft foot not corrected during installation',
      'Belt tension set by feel rather than by the manufacturer method',
      'Motor and driven machine mounted on a base that is not rigid enough',
      'Inverter-fed motor installed without the shaft grounding or bearing insulation the drive application requires',
    ],
    maintenance: [
      'Over-greasing — a very common and well-intentioned fault that raises temperature and pushes grease into the winding',
      'Regreasing without purging old grease, so incompatible or degraded grease accumulates',
      'No vibration or temperature trending, so a developing fault is only found when it is audible',
      'Alignment not rechecked after any work that disturbed the motor or driven machine',
    ],
    componentLevel: [
      'Race spalling from fatigue or contamination',
      'Cage failure allowing rolling elements to bunch',
      'Grease degradation and carbonisation from heat',
      'Fluting of races from shaft current',
      'Corrosion pitting from water ingress',
    ],
  },

  safety: {
    isolation: [
      'Isolate the motor supply, lock it and prove dead before touching any coupling, belt or shaft.',
      'On inverter-fed motors, isolate upstream of the drive and observe the drive DC-link discharge time before working on drive terminals.',
      'Confirm the driven machine cannot rotate the motor — a pump under head or a fan in a duct with airflow will turn the shaft and generate voltage.',
    ],
    lockoutTagout: [
      'Lock and tag the motor isolator, and the drive supply where fitted.',
      'Where the driven machine can be turned by process flow, isolate and lock that too — close and lock valves or fit a damper lock.',
      'Each person working applies their own lock.',
    ],
    ppe: [
      'Eye protection when working near belts, couplings and bearing extraction',
      'Hearing protection in a plant room where the machine will be run for diagnosis',
      'Heat-resistant gloves when touching bearing housings on a machine that has been running',
      'Close-fitting clothing and no loose sleeves, jewellery or lanyards near any rotating machine',
    ],
    storedEnergy: [
      'Inverter DC-link capacitors hold charge after isolation — observe the manufacturer discharge time.',
      'Belt tensioners and spring-loaded slide rails release energy when slackened.',
      'A large fan or flywheel coasts for a long time after supply removal; wait for it to stop rather than braking it by hand.',
      'Pumps and pipework may hold pressure; depressurise before disturbing a coupling.',
    ],
    specificHazards: [
      'Diagnosis often requires the machine running with guards in place. Never remove a guard to observe a running coupling or belt.',
      'A bearing at late-stage failure can seize without warning, and on a belt drive that throws the belt.',
      'Bearing extraction with a puller stores considerable energy; a slipping puller becomes a projectile.',
      'Bearings heated for fitting are hot enough to cause serious burns and must be handled with proper gloves and an induction heater, never a naked flame.',
      'On motors that have been running, the housing and shaft can cause contact burns.',
    ],
    stopAndCallProfessional: [
      'Grinding or knocking under load — stop the machine now rather than continuing to run it to a convenient time.',
      'Bearing housing too hot to keep a hand near briefly.',
      'Measurable radial play at the shaft, which means rotor-to-stator contact is close.',
      'Burnt varnish smell, indicating the winding is now involved.',
      'Fluting found on a removed bearing from an inverter-fed motor — the installation needs an engineering fix, not another bearing.',
      'Any motor on a critical duty where an unplanned failure has consequences beyond the motor itself.',
    ],
  },

  tools: [
    { tool: 'Infrared thermometer or thermal camera', why: 'Compares drive-end against non-drive-end housing temperature, which is the single most useful field measurement' },
    { tool: 'Vibration pen or analyser', why: 'Detects and trends bearing deterioration long before it is audible' },
    { tool: 'Mechanic\'s stethoscope or sounding rod', why: 'Locates which bearing is making the noise, which the ear alone cannot do reliably' },
    { tool: 'Dial indicator and magnetic base', why: 'Measures shaft radial play and runout objectively rather than by feel' },
    { tool: 'Laser or dial alignment kit', why: 'Alignment is the most common root cause and cannot be judged by eye' },
    { tool: 'Belt tension gauge', why: 'Over-tension is the second most common root cause, and setting it by feel is how it happens' },
    { tool: 'Bearing induction heater and puller set', why: 'Correct fitting and removal without damaging races or shaft — hammering a bearing on ruins it before it turns' },
    { tool: 'Feeler gauges and precision shims', why: 'Correcting soft foot and setting alignment' },
    { tool: 'Grease gun with the correct grease and a means of measuring quantity', why: 'Over-greasing causes as many failures as under-greasing' },
  ],

  decisionTree: [
    {
      question: 'Is there grinding, knocking, or a housing too hot to touch briefly?',
      yes: 'Stop the machine now. This is late-stage failure and continued running risks the rotor and stator.',
      no: 'Continue diagnosis with the machine available for controlled running',
    },
    {
      question: 'Does the noise change with speed, and does it persist with the coupling disconnected?',
      yes: 'The fault is in the motor itself',
      no: 'The source is the driven machine or the coupling — diagnose there rather than in the motor',
    },
    {
      question: 'Is one bearing housing significantly hotter than the other?',
      yes: 'That end is the suspect bearing',
      no: 'Both ends hot suggests overload, over-greasing or ventilation restriction rather than a single bearing',
    },
    {
      question: 'Is there measurable radial play at the shaft with the machine isolated?',
      yes: 'The bearing has lost its ability to locate the shaft — replace, and do not return it to service first',
      no: 'Earlier-stage deterioration; plan the replacement rather than running to failure',
    },
    {
      question: 'Has alignment, belt tension and soft foot been checked and corrected?',
      yes: 'Proceed with replacement',
      no: 'Do that first. A bearing fitted into an uncorrected installation fails again.',
    },
    {
      question: 'Is the motor inverter-fed, and does the removed bearing show fluting?',
      yes: 'Shaft current is the cause — fit the specified insulated bearing or shaft grounding, or it recurs',
      no: 'Address the mechanical or lubrication cause identified',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Listen and decide whether to stop the machine',
      inspect: 'The character of the noise with the machine running under normal load',
      where: 'At the machine, guards in place',
      instrument: 'Ear first, then a stethoscope or sounding rod at each bearing housing',
      expected:
        'A steady running note. Rumbling or clicking indicates deterioration; grinding or knocking indicates late-stage damage.',
      ifAbnormal:
        'Grinding or knocking under load means stop now. Continued running risks the shaft moving enough for rotor-to-stator contact.',
      next: 'If the sound permits continued running, proceed to temperature comparison',
      warning:
        'Never remove a guard to listen or look at a running coupling. Use a sounding rod on the housing.',
    },
    {
      step: 2,
      title: 'Compare bearing housing temperatures',
      inspect: 'Drive-end and non-drive-end housing temperature after the machine has reached steady state',
      where: 'Both bearing housings, at the same point on each',
      instrument: 'Infrared thermometer or thermal camera',
      expected:
        'Both ends running at similar temperature, warm but stable, and consistent with previous readings for this machine',
      ifAbnormal:
        'A clear divergence between ends identifies the failing bearing. Both ends hot points instead at overload, over-greasing or blocked ventilation.',
      next: 'Record the readings — the trend across visits is more valuable than any single figure',
      verify:
        'The maximum permissible bearing temperature for this motor is in the manufacturer data; do not apply a figure from another machine',
    },
    {
      step: 3,
      title: 'Measure vibration and trend it',
      inspect: 'Vibration at each bearing housing in the standard directions',
      where: 'Drive end and non-drive end, horizontal, vertical and axial',
      instrument: 'Vibration pen or analyser',
      expected:
        'Readings consistent with the machine\'s own history and similar between ends',
      ifAbnormal:
        'A rising trend is more meaningful than a single reading. High axial vibration points to misalignment; high radial at one end points to that bearing or to belt loading.',
      next: 'Compare with previous readings if the site keeps them; if not, start the record now',
      verify:
        'Vibration acceptance limits depend on machine class and mounting — use the applicable standard rather than a remembered number',
    },
    {
      step: 4,
      title: 'Separate the motor from the driven machine',
      inspect: 'Whether noise and vibration persist with the motor uncoupled and run alone',
      where: 'At the coupling or belt drive',
      instrument: 'Ear, stethoscope and vibration meter, with the machine isolated for the disconnection',
      expected: 'A healthy uncoupled motor runs quietly and smoothly',
      ifAbnormal:
        'Noise persisting uncoupled confirms a motor bearing. Noise disappearing means the fault is in the driven machine, the coupling or the belt drive.',
      next: 'This step prevents the most common wasted repair — replacing motor bearings for a driven-machine fault',
      warning:
        'Isolate and lock off before disconnecting a coupling. Refit guards before running the motor uncoupled, and ensure the key is secured or removed.',
    },
    {
      step: 5,
      title: 'Check shaft play and turn the shaft by hand',
      inspect: 'Radial and axial shaft movement, and the feel of rotation',
      where: 'At the shaft extension, machine isolated and locked off',
      instrument: 'Dial indicator on a magnetic base; hand for feel',
      expected:
        'Smooth rotation with no roughness, and radial movement within the manufacturer tolerance for the bearing fitted',
      ifAbnormal:
        'Roughness, notchiness or catching indicates race damage. Measurable radial play means the bearing has lost shaft location.',
      next: 'A shaft that has lost location must not be returned to service pending convenience',
      verify:
        'Permissible clearance depends on the bearing type and clearance class specified for this motor',
    },
    {
      step: 6,
      title: 'Find the root cause before ordering the bearing',
      inspect: 'Alignment, belt tension, soft foot, coupling condition and lubrication history',
      where: 'Motor feet, base, coupling or belt drive',
      instrument: 'Alignment kit, belt tension gauge, feeler gauges and straight edge',
      expected:
        'Alignment within the coupling manufacturer tolerance, belt tension per the drive manufacturer method, all four feet seating without shimming strain',
      ifAbnormal:
        'Misalignment, over-tension or soft foot found here is the actual fault. The bearing was the symptom.',
      next: 'Correct these as part of the same job, not as a follow-up that never happens',
      warning:
        'Alignment checked cold changes as the machine reaches operating temperature. Where the duty warrants it, allow for thermal growth.',
    },
    {
      step: 7,
      title: 'Inspect the removed bearing and read the failure',
      inspect: 'Races, rolling elements, cage and grease condition of the bearing you took out',
      where: 'On the bench, after removal',
      instrument: 'Visual, with good light and magnification',
      expected: 'The failure pattern tells you the cause, and it is the best evidence you will get',
      ifAbnormal:
        'Even fluting across a race means shaft current. Localised spalling in one zone means concentrated radial load, typically belt over-tension. Abrasive scoring means contamination. Dark carbonised grease means overheating. Brinelling marks at rolling-element spacing mean impact or long idle vibration.',
      next: 'Photograph the failure and record what it indicates — this is what stops the repeat',
      verify:
        'Confirm the replacement bearing designation and clearance class from the motor manufacturer data, including whether an insulated bearing is specified',
    },
    {
      step: 8,
      title: 'Verify after repair under real load',
      inspect: 'Noise, temperature and vibration after the machine has run long enough to stabilise',
      where: 'Both bearing housings, under normal duty',
      instrument: 'Thermometer, vibration meter and stethoscope',
      expected:
        'Both ends similar and stable, vibration low, and no rise across the first hours of running',
      ifAbnormal:
        'A new bearing running hot usually means over-greasing, a fitting fault, or an uncorrected alignment problem',
      next: 'Record the baseline readings so the next comparison has a reference',
    },
  ],

  repair: [
    {
      level: 'mechanical',
      title: 'Bearing replacement done properly',
      steps: [
        'Isolate, lock off and prove dead before any mechanical work.',
        'Remove the bearing with a puller that bears on the inner race, never on the outer race or the cage.',
        'Inspect the shaft seat and housing bore for wear, fretting or ovality. A bearing fitted into a worn seat will turn and fail quickly.',
        'Fit the correct bearing designation and clearance class from the manufacturer data — not the nearest equivalent on the shelf.',
        'Heat the bearing with an induction heater to the temperature the bearing manufacturer specifies. Never hammer a bearing on, and never heat with a flame.',
        'Fit new seals or shields, and replace bearing caps and circlips rather than reusing distorted ones.',
        'Charge with the specified grease, in the specified quantity. More is not better.',
      ],
      note:
        'Most premature bearing failures are fitting failures. A bearing hammered onto a shaft is damaged before the machine is switched on.',
    },
    {
      level: 'mechanical',
      title: 'Correcting the root cause',
      steps: [
        'Correct soft foot before attempting alignment — alignment on a distorted frame will not hold.',
        'Align to the coupling manufacturer tolerance, and allow for thermal growth where the duty warrants it.',
        'Set belt tension using the drive manufacturer method and a gauge, not by feel.',
        'Replace worn couplings and elastomers rather than reusing them.',
        'Address contamination at source: fit or repair seals, correct washdown practice, and improve enclosure where the environment demands it.',
      ],
    },
    {
      level: 'configuration',
      title: 'Inverter-fed motors — stopping shaft current',
      steps: [
        'Where fluting is found, fit the insulated bearing or shaft grounding arrangement the motor and drive application require.',
        'Check that motor cable screening is terminated correctly at both ends — poor screening termination contributes directly to shaft current.',
        'Review drive switching frequency and output filtering against the manufacturer recommendation for the cable length in use.',
        'Record that the motor is inverter-fed on the machine, so the next person fits the correct bearing.',
      ],
      note:
        'A standard bearing fitted to an inverter-fed motor that needs an insulated one will flute again within months. This is a design fix, not a maintenance fix.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Lubrication practice',
      steps: [
        'Use only the grease specified for the motor. Mixing incompatible greases can destroy the lubricating film entirely.',
        'Regrease at the manufacturer interval and quantity, with the machine running where the manufacturer specifies it.',
        'Purge old grease through the relief where one is fitted; if it is blocked, clear it or old grease is forced into the winding.',
        'Keep grease guns, nipples and the surrounding area clean — contamination introduced during greasing is a common cause of the next failure.',
      ],
    },
  ],

  validation: [
    'Both bearing housings running at similar, stable temperature under normal load',
    'Vibration low and not rising across the first hours of running',
    'No abnormal noise at either bearing with a stethoscope',
    'Alignment recorded within the coupling manufacturer tolerance',
    'Belt tension recorded as set by gauge to the drive manufacturer figure',
    'Motor current consistent with the historical figure for the same duty',
    'Baseline temperature and vibration readings recorded for future comparison',
  ],

  whenNotToRepair: [
    'Rotor-to-stator contact has already occurred — that is a rewind and possibly a new motor, not a bearing job',
    'Shaft or housing worn beyond the tolerance for a bearing seat, unless shaft repair is economic for the machine',
    'Winding insulation already affected by bearing overheating',
    'Small motors where a replacement costs little more than bearings and labour',
    'Motors that have suffered repeat bearing failures where the installation cause cannot be corrected — that is a design problem needing engineering, not another repair',
    'Any motor where a rewind assessment is warranted anyway on age and condition',
  ],

  prevention: [
    'Trend bearing temperature and vibration on a schedule; a developing fault appears in the trend months before it is audible',
    'Align properly at installation and recheck after any work that disturbs the motor or driven machine',
    'Set belt tension with a gauge and recheck after the initial running-in period',
    'Regrease to the manufacturer interval and quantity — resist the instinct that more grease is better',
    'Keep one grease type per machine and label it, so the next person cannot mix incompatible products',
    'Protect motors from washdown and dust with correct enclosure and seals for the environment',
    'Turn the shaft on motors that stand idle for extended periods, to avoid false brinelling',
    'Mark inverter-fed motors clearly, so the correct insulated bearing is fitted every time',
  ],

  relatedSlugs: [
    'three-phase-motor-failure-diagnosis',
    'motor-overload-tripping',
    'vfd-drive-fault-diagnosis',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'How long can I keep running a noisy motor?',
      a: 'It depends on the noise. A rumble that has been stable for weeks gives you time to plan a shutdown. Grinding or knocking under load does not — stop it. Once the bearing stops locating the shaft properly, the rotor can touch the stator, and that turns a cheap bearing change into a rewind or a replacement motor.',
    },
    {
      q: 'Why did the new bearing fail so quickly?',
      a: 'Almost always because the cause was never corrected, or because of how it was fitted. Misalignment, belt over-tension and soft foot all destroy a new bearing as fast as they destroyed the old one. And a bearing driven on with a hammer is damaged before the motor first turns.',
    },
    {
      q: 'Can I put in more grease to quieten a noisy bearing?',
      a: 'No, and it usually makes things worse. Over-greasing raises churning losses and temperature, and can force grease past the seals into the winding. If the bearing is already noisy, the damage is mechanical and grease will not reverse it.',
    },
    {
      q: 'How hot should a motor bearing run?',
      a: 'The manufacturer states a maximum for that motor and that is the reference. In the field the more useful test is comparison — the two ends of a healthy motor track closely, and its own history is the best baseline. A divergence between ends tells you more than any absolute number.',
    },
    {
      q: 'What are the marks on the bearing race that look like a washboard?',
      a: 'That is fluting, caused by electrical current passing through the bearing. It is characteristic of inverter-fed motors without the correct insulated bearing or shaft grounding. Fitting another standard bearing will produce the same damage again; the installation itself needs correcting.',
    },
    {
      q: 'The noise stops when I disconnect the coupling. Is the motor fine?',
      a: 'Yes, the motor bearings are not the source. The fault is in the driven machine, the coupling or the belt drive. That test is worth doing early, because it prevents the common and expensive mistake of replacing motor bearings for a pump or fan problem.',
    },
  ],

  references: [
    'Motor manufacturer maintenance manual — bearing designations, clearance class, grease type, quantity and regreasing interval',
    'Bearing manufacturer fitting instructions, including permitted heating temperature and mounting method',
    'Coupling manufacturer alignment tolerances for the coupling fitted',
    'Belt drive manufacturer tensioning method and figures',
    'ISO 10816 / ISO 20816 — mechanical vibration evaluation by measurement on non-rotating parts',
    'IEC 60034-1 — rotating electrical machines: rating and performance',
    'Site maintenance records: alignment reports, vibration trends and previous bearing replacements',
  ],
};
