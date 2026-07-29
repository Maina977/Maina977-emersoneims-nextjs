import type { RepairArticle } from '../types';

export const upsOnBatteryWithMainsPresent: RepairArticle = {
  slug: 'ups-on-battery-with-mains-present',
  hub: 'ups',
  header: {
    title: 'UPS Running on Battery While Mains Is Present — Diagnosis and Repair',
    equipmentCategory: 'Uninterruptible power supply — input, transfer and rectifier',
    appliesTo: 'Offline, line-interactive and online double-conversion UPS systems, single- and three-phase, on mains or generator supply',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate, but time-critical. The UPS is consuming a finite reserve while you diagnose, so the first job is to establish how long you have.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Mains or generator input 240 V / 415 V 50 Hz nominal; input acceptance window is configurable per unit',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Treat this as urgent before you treat it as a fault. A UPS on battery is running down a finite reserve, so the first question is not why but how long you have, and whether the load can be moved or shed before it runs out. Once that is settled, the diagnosis is a single fork: either the supply genuinely is not reaching the UPS input, or it is reaching it and the UPS is rejecting it. Measure at the UPS input terminals, not at a nearby socket, because a tripped input breaker, an open fuse or a lost phase upstream of the unit looks identical to a healthy supply everywhere else in the room. If voltage is present at the terminals and the UPS still refuses to transfer, the supply is failing the unit\'s acceptance criteria — frequency, voltage, phase rotation or neutral reference. On sites with standby generation this is overwhelmingly the answer, and it is the single most common cause of critical-power loss: the generator starts, the UPS judges its output unacceptable, stays on battery, and the load is lost some time later with the generator still running.',

  symptoms: {
    display: [
      'On battery, battery operation, or utility fail indication while incoming supply appears normal',
      'Input or rectifier fault indication',
      'Input voltage or frequency shown out of tolerance',
      'Runtime counting down while mains is apparently available',
      'Repeated transfer events in the log — the UPS accepting and rejecting the supply in cycles',
    ],
    indicators: [
      'Input LED off or in alarm while output remains healthy',
      'Bypass unavailable indication, which often accompanies an unacceptable input',
      'Input breaker or fuse open',
      'Generator running while the UPS still shows battery operation',
    ],
    sounds: [
      'Continuous audible alarm for battery operation',
      'Transfer relays clicking repeatedly as the unit accepts then rejects the supply',
      'Cooling fans running at increased speed',
    ],
    smells: [
      'Burnt smell at the input section or from the enclosure — stop and investigate before any further testing',
      'Hot insulation smell around input terminations, which points at a loose or overloaded connection',
    ],
    behaviour: [
      'Went to battery when the generator started and never came back — the classic generator-interaction failure',
      'Transfers to battery at the same time each day, which points at a supply-quality pattern rather than a UPS fault',
      'Accepts mains but rejects generator, which narrows the problem to supply quality rather than the UPS input stage',
      'Cycles between mains and battery repeatedly, which is worse for the battery than staying on either',
      'Runs happily on battery until the reserve is exhausted, then drops the load with the supply still present',
    ],
    visible: [
      'Input breaker, fuse and upstream protection condition',
      'Whether a generator is running and what its own panel reports for voltage and frequency',
      'Input terminations for heat discolouration or looseness',
      'Phase indication where a three-phase input is used',
      'Any recent changes to the installation, which frequently explain a sudden onset',
    ],
  },

  whatItMeans: {
    plain:
      'The UPS is doing its job. It has decided the incoming power is not good enough to pass to your equipment, so it is running from batteries instead. That is protective, not broken. The danger is that batteries do not last, so unless the supply is fixed or the load is moved, the UPS will eventually run out and the equipment will go down anyway.',
    technical:
      'A UPS continuously assesses its input against configured acceptance criteria before it will draw from it or transfer to bypass. Those criteria typically cover voltage magnitude, frequency, rate of frequency change and, on three-phase units, phase rotation and phase presence; the windows are configurable and differ by model, so the correct values must come from the unit\'s documentation rather than from assumption. Failing any one criterion causes the unit to remain on, or transfer to, battery. On an online double-conversion topology the rectifier draws from the input while the inverter feeds the load continuously, so an unacceptable input means the DC bus is supported by the battery instead of the rectifier — the load never notices until the reserve is gone. Generator supplies fail these criteria far more often than utility supplies because engine-driven sets exhibit frequency excursions during load steps, and because a UPS presents a non-linear load with poor displacement to the alternator. Where the set is sized only on kW without regard to the UPS load characteristic, the resulting voltage and frequency disturbance can keep the input permanently outside the acceptance window, producing the failure mode where a running generator and a fully functional UPS still lose the load.',
  },

  causes: {
    mostLikely: [
      'Generator output outside the UPS input acceptance window — frequency instability during and after load steps',
      'Input circuit breaker tripped or input fuse open, so no supply reaches the unit',
      'Upstream protection operated — a distribution breaker or RCD feeding the UPS',
      'Lost phase on a three-phase input, which leaves apparently normal voltage on the remaining phases',
    ],
    possible: [
      'Input acceptance window configured too narrowly for the site\'s real supply quality',
      'Generator undersized or poorly matched to the UPS load characteristic',
      'Loose or high-resistance input termination causing voltage collapse under load',
      'Phase rotation reversed after works upstream, which a three-phase unit will reject outright',
    ],
    lessCommon: [
      'Neutral fault or a missing neutral reference, common where a generator neutral is not bonded as the UPS expects',
      'Rectifier or input stage failure within the UPS',
      'Input sensing or measurement circuit reporting incorrectly',
      'Firmware or configuration change applied without the supply being re-verified',
    ],
    modelSpecific: [
      'Acceptance windows for voltage and frequency are configurable and differ by manufacturer and model — read them from the unit, never assume a figure',
      'Many units offer a wider "generator mode" or relaxed frequency window intended exactly for engine-driven supplies',
      'Some units require a solidly earthed neutral reference and will reject a floating supply',
      'Walk-in or ramped rectifier loading, where fitted, is often disabled by default and is what prevents the UPS overwhelming a generator on transfer',
      'Three-phase units differ in whether they tolerate phase imbalance or reject it',
    ],
    environmental: [
      'Poor utility supply quality with frequent sags, swells or frequency deviation',
      'Shared supply with large motor loads causing repeated voltage dips on starting',
      'High ambient temperature affecting the UPS input stage',
    ],
    installation: [
      'Generator sized on running kW alone without accounting for the UPS load characteristic and step loads',
      'Undersized input cabling causing voltage drop under load',
      'Neutral and earthing arrangement on the generator not matched to what the UPS requires',
      'Transfer switch timing that presents the supply before the generator has stabilised',
    ],
    maintenance: [
      'Input acceptance settings never reviewed against the actual supply the site has',
      'Generator never load-tested with the UPS as the real load',
      'Input terminations never re-torqued or thermally surveyed',
      'Event logs never reviewed, so a pattern of repeated transfers goes unnoticed until it fails',
    ],
    componentLevel: [
      'Input fuse open',
      'Rectifier stage or its control failed',
      'Input contactor or transfer relay failed',
      'Input voltage or frequency sensing circuit failed',
    ],
  },

  safety: {
    isolation: [
      'A UPS can backfeed its input terminals from the battery or the inverter. Isolating upstream does NOT guarantee the input terminals are dead.',
      'Follow the manufacturer\'s shutdown sequence, open the input isolator AND the battery isolator, then prove dead at the point of work',
      'Confirm the protected load has an alternative supply or can be dropped before removing the UPS from service',
      'Treat the output as live until proven otherwise — the inverter may still be running',
    ],
    lockoutTagout: [
      'Lock and tag the input isolator, the battery isolator and any maintenance bypass',
      'Warn the site explicitly that the load is unprotected during the work',
      'Where a maintenance bypass is used, confirm it is carrying the load before isolating the unit',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection and arc-rated clothing appropriate to the prospective fault energy at the input',
      'Insulated tools rated for the system voltage',
      'Acid-resistant gloves for any battery work',
      'Remove watches, rings and metal bracelets',
    ],
    storedEnergy: [
      'The DC bus and the battery string remain at dangerous voltage after the unit is switched off',
      'Observe the manufacturer\'s capacitor discharge period before opening the enclosure, and verify rather than trust it',
      'The battery string cannot be switched off and is live whenever connected',
    ],
    specificHazards: [
      'BACKFEED is the defining hazard of this fault. A UPS can energise its own input terminals, so an upstream isolation point that appears dead can become live. This has killed people working on supposedly isolated supplies — always prove dead at the point of work, immediately before starting.',
      'Working on a live input to diagnose an acceptance problem means working on energised equipment; if it cannot be done safely, do not do it',
      'A generator may start automatically at any time during the work unless it is locked out',
      'DC arcs at the battery do not self-extinguish as AC arcs do',
    ],
    stopAndCallProfessional: [
      'There is a burnt smell, visible damage or heat at the input section',
      'The work requires opening the UPS enclosure and you cannot verify capacitor discharge',
      'The protected load cannot be left unprotected and no maintenance bypass exists',
      'The battery reserve is nearly exhausted — at that point the priority is a controlled shutdown, not diagnosis',
      'Three-phase supply work, phase rotation correction or generator earthing changes beyond your competence',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter rated for the system voltage', why: 'Input voltage measured at the UPS terminals — the measurement that splits the diagnosis in two' },
    { tool: 'Frequency meter or a multimeter that reads frequency reliably', why: 'Generator frequency is the most common acceptance failure and a voltage-only check will miss it entirely' },
    { tool: 'Power quality analyser with logging', why: 'Intermittent rejection cannot be diagnosed with a spot reading; only a log shows what the UPS actually saw at the moment it transferred' },
    { tool: 'Phase rotation tester', why: 'A reversed rotation after upstream works will be rejected outright on three-phase units' },
    { tool: 'Clamp meter (AC, true-RMS)', why: 'Input current, and confirming load is where you think it is' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Loose or high-resistance input terminations show as heat before they fail' },
    { tool: 'Insulated torque wrench and hand tools', why: 'Input terminations must be torqued to specification' },
    { tool: 'Access to the UPS service interface and event log', why: 'The log states why the unit rejected the supply, which is usually faster than inferring it' },
  ],

  decisionTree: [
    { question: 'How much battery reserve remains, and can the load be moved or shed?', yes: 'Secure the load first, then diagnose', no: 'Plan a controlled shutdown now — do not spend the remaining reserve on diagnosis' },
    { question: 'Is there a burnt smell or visible damage at the input?', yes: 'Stop. Isolate and escalate.', no: 'Continue' },
    { question: 'Is the input breaker closed and the input fuse intact?', yes: 'Continue', no: 'That explains it. Establish WHY it operated before closing or replacing it.' },
    { question: 'Is voltage present at the UPS input terminals — all phases?', yes: 'The supply is arriving; the UPS is rejecting it. Continue.', no: 'The problem is upstream of the UPS, not in it. Work back towards the source.' },
    { question: 'Is the site running on a generator?', yes: 'Check frequency and stability first — this is the most likely answer', no: 'Continue' },
    { question: 'Is frequency within the unit\'s configured acceptance window?', yes: 'Continue', no: 'Governing or load-matching problem on the generator, not a UPS fault' },
    { question: 'On three-phase: is rotation correct and are all phases present?', yes: 'Continue', no: 'Correct rotation or restore the lost phase' },
    { question: 'Does the event log say why the supply was rejected?', yes: 'Follow that reason — it is the unit telling you its own criteria', no: 'Log the supply with an analyser until a transfer occurs' },
    { question: 'Are the acceptance settings appropriate for this site\'s real supply?', yes: 'Investigate the input stage itself', no: 'Widen deliberately and within manufacturer limits — never so far that poor power reaches the load' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the time you actually have',
      inspect: 'Remaining runtime, connected load, and whether the load can be moved or shed',
      where: 'UPS display and the site\'s load schedule',
      instrument: 'UPS display, clamp meter',
      expected: 'A known reserve and a decision made about the load before diagnosis begins',
      ifAbnormal: 'If the reserve is nearly gone, stop diagnosing and perform a controlled shutdown. An orderly shutdown is recoverable; an exhausted battery dropping a live load is not.',
      next: 'Step 2',
      warning: 'Displayed runtime is usually calculated, not measured, and an aged battery will fall far short of it. Treat it as optimistic.',
    },
    {
      step: 2,
      title: 'Read the event log before touching anything',
      inspect: 'Why the unit rejected the supply, and whether this has happened repeatedly',
      where: 'UPS display or service interface',
      instrument: 'Service interface',
      expected: 'A specific reason — input frequency, input voltage, phase rotation, phase loss',
      ifAbnormal: 'A pattern of repeated transfers over days or weeks changes the diagnosis entirely: it points at marginal supply quality rather than a sudden failure.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Check input protection',
      inspect: 'Input breaker, input fuse and the upstream protective device feeding the UPS',
      where: 'UPS input and the feeding distribution board',
      instrument: 'Visual inspection, multimeter',
      expected: 'All closed and intact',
      ifAbnormal: 'An open device fully explains the symptom. Establish why it operated — resetting it without knowing is how the same fault returns under load.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Measure voltage at the UPS input terminals',
      inspect: 'Voltage on every incoming phase and to neutral, measured at the unit itself',
      where: 'UPS input terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Nominal voltage present and balanced across phases',
      ifAbnormal: 'No voltage means the problem is upstream, not in the UPS. A missing phase with the others healthy is easy to overlook and will keep a three-phase unit on battery indefinitely.',
      next: 'Step 5',
      warning: 'Measure at the terminals, not at a nearby socket. A socket on a different circuit proves nothing about what the UPS is being offered.',
    },
    {
      step: 5,
      title: 'Measure frequency, especially on generator supply',
      inspect: 'Input frequency and how steady it is, particularly through load changes',
      where: 'UPS input terminals',
      instrument: 'Frequency-capable meter or power quality analyser',
      expected: 'Frequency at nominal and stable',
      ifAbnormal: 'Frequency that wanders or dips on load steps is the most common reason a UPS refuses a generator. This is a governing or load-matching problem on the set, not a UPS fault, and adjusting the UPS to accept it treats the symptom.',
      next: 'Step 6',
      verify: 'The unit\'s configured acceptance window for frequency — this differs by model and must be read from the equipment, not assumed.',
    },
    {
      step: 6,
      title: 'Check phase rotation and phase balance on three-phase inputs',
      inspect: 'Rotation direction and voltage balance between phases',
      where: 'UPS input terminals',
      instrument: 'Phase rotation tester, multimeter',
      expected: 'Correct rotation and phases reasonably balanced',
      ifAbnormal: 'Reversed rotation is rejected outright and is a classic consequence of upstream works or a generator connection made in haste.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check the neutral and earthing arrangement',
      inspect: 'Neutral continuity and neutral-to-earth reference, especially on generator supply',
      where: 'UPS input and the supply source',
      instrument: 'Multimeter',
      expected: 'A solid neutral and the earthing arrangement the unit expects',
      ifAbnormal: 'A floating or lost neutral can cause rejection while phase voltages look normal. Generator neutral bonding is frequently different from the utility arrangement and is a common oversight on retrofits.',
      next: 'Step 8',
      warning: 'Do not modify earthing or neutral bonding arrangements without understanding the whole installation. Getting this wrong creates a shock hazard rather than fixing a UPS.',
    },
    {
      step: 8,
      title: 'Inspect and thermally survey the input terminations',
      inspect: 'Tightness, discolouration and temperature at every input termination',
      where: 'UPS input terminals and the feeding board',
      instrument: 'Thermal camera or infrared thermometer, insulated torque wrench',
      expected: 'Terminations tight, cool and undiscoloured',
      ifAbnormal: 'A high-resistance joint causes voltage to collapse under load while measuring normally at no load, producing rejection that appears intermittent and inexplicable.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Log the supply if the fault is intermittent',
      inspect: 'Voltage, frequency and events over time, correlated with the UPS transfer log',
      where: 'At the UPS input',
      instrument: 'Power quality analyser with logging',
      expected: 'A record showing what the supply did at the moment of each transfer',
      ifAbnormal: 'This is the only honest way to diagnose intermittent rejection. A spot reading taken while the supply happens to be good proves nothing at all.',
      next: 'Step 10',
    },
    {
      step: 10,
      title: 'Only now review the settings and the input stage',
      inspect: 'Configured acceptance windows against the site\'s measured supply, then the rectifier and input sensing',
      where: 'UPS configuration and input stage',
      instrument: 'Service interface, multimeter',
      expected: 'Settings appropriate to the real supply, and an input stage that responds correctly to a supply proven good',
      ifAbnormal: 'If the supply is measurably good and within the configured window and the unit still rejects it, the input sensing or rectifier is at fault. Conclude this last, because it is the least common answer.',
      next: 'Refer input-stage repair to the manufacturer or a properly equipped facility',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Terminations and supply integrity',
      steps: [
        'Re-torque every input termination to the specified value and re-survey thermally under load',
        'Replace damaged, undersized or overheated input conductors',
        'Restore a lost phase or neutral at its source rather than at the UPS',
      ],
      note: 'A high-resistance joint is the classic cause of rejection that appears intermittent and defies spot measurement.',
    },
    {
      level: 'configuration',
      title: 'Input acceptance and generator behaviour',
      steps: [
        'Compare configured acceptance windows against the supply the site actually has, measured rather than assumed',
        'Where the unit provides a generator or wide-input mode intended for engine-driven supplies, enable it deliberately and within manufacturer limits',
        'Enable rectifier walk-in or ramped loading where available, so the UPS does not overwhelm the generator on transfer',
        'Re-verify after any firmware or configuration change',
      ],
      note: 'Widening the window is legitimate engineering when the supply is genuinely acceptable but marginal. Widening it so far that poor power reaches protected equipment defeats the purpose of the UPS.',
    },
    {
      level: 'mechanical',
      title: 'Generator side',
      steps: [
        'Correct governing so frequency holds through load steps',
        'Review generator sizing against the UPS load characteristic, not running kW alone',
        'Review transfer switch timing so the supply is presented only once the set has stabilised',
        'Correct phase rotation and neutral bonding to match what the UPS requires',
      ],
      note: 'This is the fix that actually prevents the failure. Most "UPS rejected the generator" events are generator problems.',
    },
    {
      level: 'component-replacement',
      title: 'Input components',
      steps: [
        'Replace failed input fuses, and establish the cause before re-energising',
        'Replace a failed input contactor or transfer relay',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Rectifier and sensing',
      steps: [
        'Refer rectifier stage, input sensing and control faults to the manufacturer or a properly equipped facility',
        'Supply the measured input voltages, frequencies, logs and analyser records — this shortens the repair considerably',
      ],
    },
  ],

  validation: [
    'Confirm the UPS accepts the supply and returns to normal operation, with the input indication healthy',
    'Confirm the battery recharges afterwards — a deep discharge must be followed through, not assumed',
    'Prove the fix under the condition that caused it: if the generator was the trigger, run the set on real load and confirm the UPS holds',
    'Measure and record input voltage, frequency and phase rotation as commissioned values',
    'Re-torque and thermally survey input terminations under load after the work',
    'Review the event log after a settling period to confirm the transfers have genuinely stopped rather than become less frequent',
    'Record any acceptance-window change, with the measured justification for it, in the maintenance record',
  ],

  whenNotToRepair: [
    'Where the real fault is an undersized or badly governed generator — replacing UPS parts will not fix a supply problem',
    'Obsolete units where input-stage components are unobtainable',
    'Where the only way to make the UPS accept the supply is to widen its windows so far that unacceptable power would reach protected equipment',
    'Where the installation\'s earthing and neutral arrangement needs redesign — that is a design task, not a repair',
  ],

  prevention: [
    'Load-test the generator with the UPS as the real load, not with a resistive bank alone — a resistive test will not reproduce the interaction that causes this failure',
    'Record commissioned input voltage, frequency and rotation so later drift is visible rather than inferred',
    'Review UPS event logs at every service visit; repeated transfers are the early warning of this failure',
    'Size standby generation against the UPS load characteristic and step loads, not running kW alone',
    'Enable rectifier walk-in where the unit supports it',
    'Thermally survey input terminations annually under load',
    'Keep autonomy honest with real capacity testing, because this fault consumes whatever reserve genuinely exists — see the battery charging guide',
  ],

  relatedSlugs: ['ups-bypass-fault', 'ups-inverter-fault-diagnosis', 'ups-not-charging-batteries'],

  faq: [
    {
      q: 'The generator is running perfectly. Why won\'t the UPS accept it?',
      a: 'Because "running perfectly" and "meeting the UPS acceptance criteria" are different tests. A set can carry lighting and sockets happily while its frequency dips on load steps beyond what the UPS will tolerate, and a UPS presents a non-linear load that stresses an alternator more than its kW rating suggests. Measure frequency through a load step rather than at steady state — that is where the answer usually is.',
    },
    {
      q: 'Can I just widen the input window so it stops going to battery?',
      a: 'Sometimes, and legitimately, if measurement shows the supply is genuinely acceptable but sits just outside a conservatively configured window. But widening it to silence an alarm means passing power to protected equipment that the UPS judged unfit, which defeats the reason the UPS is there. Measure first, change deliberately, stay within manufacturer limits, and record why.',
    },
    {
      q: 'Is running on battery with mains present actually dangerous?',
      a: 'It is time-limited, which amounts to the same thing. The load is protected only until the reserve runs out, and the UPS gives no more warning at that point than it does now. Treat it as an active incident: establish remaining runtime and secure the load first, diagnose second.',
    },
    {
      q: 'Why does it keep switching back and forth between mains and battery?',
      a: 'The supply is sitting right at the edge of the acceptance window, so the unit accepts it, re-evaluates, rejects it, and repeats. This cycling is harder on the battery than simply staying on either source, and it is a strong indicator of a marginal supply rather than a failed UPS. Log the input until a transfer occurs — a spot reading taken during a good moment will show nothing wrong.',
    },
  ],

  references: [
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-3 — UPS performance and test requirements, including input characteristics',
    'ISO 8528 — reciprocating internal combustion engine driven generating sets, including performance classes for frequency and voltage behaviour',
    'IEC 60364 — low-voltage electrical installations, for earthing and neutral arrangements',
    'The UPS manufacturer\'s documentation for the specific unit, which defines the input acceptance windows, generator mode and walk-in behaviour referred to throughout',
  ],
};
