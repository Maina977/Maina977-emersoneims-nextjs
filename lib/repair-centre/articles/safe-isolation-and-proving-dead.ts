import type { RepairArticle } from '../types';

export const safeIsolationAndProvingDead: RepairArticle = {
  slug: 'safe-isolation-and-proving-dead',
  hub: 'safety',
  header: {
    title: 'Safe Isolation and Proving Dead — Power Equipment',
    equipmentCategory: 'Electrical safety — isolation, lockout and stored energy',
    appliesTo: 'Generating sets, UPS systems, inverters, solar installations, drives, motors and control panels',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Not a diagnosis. This is the procedure every other guide in the Repair Centre depends on, and the one most often shortened under time pressure.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho — review pending',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'All systems — AC 240 V / 415 V 50 Hz, DC battery and bus systems, PV arrays',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Proving dead is a three-part test, and skipping the third part is what kills people. Prove your voltage indicator works on a known live source, use it to test the conductors you are about to work on, then prove the indicator still works on the known source afterwards — because an indicator that failed silently between the first and second steps will show a live circuit as dead. The second discipline is completeness: power equipment routinely has more than one source, and isolating the obvious one proves nothing. A UPS can backfeed its own input. A generating set in auto can start without warning. A PV array is live in any daylight and cannot be switched off at source. Batteries cannot be switched off at all. DC bus capacitors hold a lethal charge after everything upstream is open. So the procedure is: identify every source, isolate each one, secure each isolation with your own lock, prove dead at the actual point of work, and only then start. Prove dead where you will put your hands, not at the isolator — an isolation that is correct at the board can still leave the conductor you are touching live through a path you have not identified.',

  symptoms: {
    display: [
      'Not applicable — this guide covers procedure rather than a fault',
      'Where equipment shows no display, never assume that means it is dead',
      'A dark drive display does not indicate a discharged DC bus',
      'A stopped generating set in auto mode is armed to start, not safe',
    ],
    indicators: [
      'Indicator lamps are not a proving method and must never be relied on',
      'A voltage indicator that shows nothing may be faulty rather than reading zero',
      'Absence of noise does not indicate absence of energy',
    ],
    sounds: [
      'Silence from a generating set means it has not started YET, not that it cannot',
      'A UPS running silently on bypass still has live paths throughout',
      'Contactors operating during work indicate an automatic control you have not locked out',
    ],
    smells: [
      'Any burnt smell before or during work means stop and reassess before energising anything',
      'Hydrogen from charging batteries has no smell — do not rely on smell to detect it',
    ],
    behaviour: [
      'Equipment that restarts automatically after a power interruption',
      'Systems under remote or process control that can be started by someone elsewhere',
      'Generating sets on automatic mains-failure control',
      'Pumps under pressure-switch or level control that start without human action',
      'Solar systems that re-energise at first light regardless of any switch position',
    ],
    visible: [
      'Every isolator, breaker and fuse feeding the equipment',
      'Whether each isolation is physically locked, not merely switched',
      'Warning notices and tags in place',
      'Battery isolators and links',
      'PV array isolators and whether daylight is present',
      'Capacitors, accumulators, springs and suspended loads that store energy',
    ],
  },

  whatItMeans: {
    plain:
      'Before working on any electrical equipment you must be certain it cannot become live. Switching something off is not enough: someone can switch it back on, a machine can start itself, and some sources — batteries, solar panels, charged capacitors — cannot be switched off at all. Safe isolation means finding every source, locking each one off yourself, and then testing at the exact place you will be working to confirm it really is dead.',
    technical:
      'Safe isolation is a defined sequence: identify the circuit and every source that can energise it, isolate each source, secure each isolation against reinstatement, verify the equipment is dead at the point of work, and post warning of the work in progress. The verification step uses a proving unit or a known live source to establish that the voltage indicator functions before the test and still functions after it, because a voltage indicator that fails between those points gives a false negative that is indistinguishable from a genuinely dead circuit. Power conversion equipment complicates the identification step, because it contains sources that are neither upstream nor obvious. An uninterruptible power supply can energise its own input terminals through its inverter or bypass, so an upstream isolation that appears dead can become live. A generating set under automatic mains-failure control is armed rather than off, and will start on a supply event with no human involvement. A photovoltaic array generates whenever there is light and has no off state; isolators disconnect it from the inverter but do not de-energise the array conductors. Battery systems are permanently live and can deliver very high fault current, and DC link capacitors in drives, inverters and UPS systems retain a lethal charge after every upstream source is open — for these, elapsed time is not evidence and discharge must be verified by measurement. Beyond electrical energy, stored mechanical energy in springs and motorised operators, pressure in cooling and hydraulic systems, suspended loads, and residual heat in exhausts and braking resistors all require positive control before work begins.',
  },

  causes: {
    mostLikely: [
      'A second source not identified — the single commonest failure of isolation on power equipment',
      'Isolation switched but not locked, so someone reinstates it',
      'Proving dead at the isolator rather than at the point of work',
      'Voltage indicator not proved after the test',
    ],
    possible: [
      'Automatic control not locked out — generating set in auto, pressure switch, process system',
      'DC bus capacitors assumed discharged on elapsed time rather than measured',
      'Solar array treated as isolated because a switch was opened',
      'Battery isolator opened but the battery link left in place',
    ],
    lessCommon: [
      'Backfeed through an interconnected system or a shared neutral',
      'Control supply from a separate source remaining live in an otherwise isolated panel',
      'Locking device that can be defeated, or a shared key',
      'Test instrument of the wrong category for the system being tested',
    ],
    modelSpecific: [
      'DC bus discharge times are stated by the manufacturer and differ between products — treat them as a minimum to wait, never as proof',
      'UPS isolation sequences are unit-specific and getting the order wrong can drop the load or leave paths live',
      'Maintenance bypass arrangements differ; some are mechanically interlocked and some are not',
      'Generating set control systems differ in what "off" actually inhibits',
    ],
    environmental: [
      'Daylight, which makes any PV array a live source regardless of switch positions',
      'Confined or cramped working positions that discourage proper testing',
      'Poor lighting, making labels and indicator readings unreliable',
      'Wet conditions, which change the risk entirely',
    ],
    installation: [
      'Isolators unlabelled or mislabelled, so the wrong one is opened',
      'No provision for locking isolators off',
      'Circuits fed from more than one board without cross-referenced warning labels',
      'No means of proving dead provided at the point of work',
    ],
    maintenance: [
      'Isolation procedure not documented for the specific installation',
      'Voltage indicators and proving units never checked or calibrated',
      'Single-line diagrams absent or out of date, so sources cannot be identified reliably',
      'Working practices eroded by time pressure until steps are habitually skipped',
    ],
    componentLevel: [
      'Voltage indicator failed, giving a false dead reading',
      'Isolator failing to break all poles',
      'Locking device ineffective',
      'Capacitor discharge circuit failed, so the bus does not discharge as designed',
    ],
  },

  safety: {
    isolation: [
      'Identify EVERY source before opening anything — mains, generator, UPS, battery, PV array, control supplies and any interconnection',
      'Isolate each source individually',
      'Secure each isolation with a lock to which you hold the only key',
      'Prove dead at the point of work, not at the isolator',
      'Post warning notices so others know work is in progress',
    ],
    lockoutTagout: [
      'Use a personal lock, and keep the only key on your person for the duration',
      'Where several people work on the same equipment, each fits their own lock to a multi-lock hasp',
      'Tag every isolation with who applied it and when',
      'Lock out the automatic control as well as the supply — a generating set taken out of auto but not locked can still be put back',
      'Never remove another person\'s lock',
    ],
    ppe: [
      'Arc-rated clothing appropriate to the prospective incident energy at the point of work',
      'Insulated tools rated for the system voltage, in good condition',
      'Eye protection',
      'Insulating gloves where the task requires them',
      'Remove watches, rings, chains and metal bracelets before any electrical work',
    ],
    storedEnergy: [
      'DC bus capacitors in drives, inverters and UPS systems retain a lethal charge — verify discharge by measurement, never by elapsed time',
      'Batteries cannot be switched off and are live at all times',
      'PV arrays generate in any daylight and have no off state',
      'Power-factor correction capacitors retain charge after disconnection',
      'Springs in motorised switch operators, pressure in cooling and hydraulic systems, and suspended loads all store energy that must be positively released or restrained',
      'Exhausts, turbochargers and braking resistors stay dangerously hot long after shutdown',
    ],
    specificHazards: [
      'PROVE THE PROVER. Test your indicator on a known live source before the test AND after it. An indicator that fails between those points shows a live circuit as dead, and that is precisely how people are electrocuted on circuits they believed were isolated.',
      'BACKFEED: a UPS can energise its own input terminals. An upstream isolation that reads dead can become live. Prove dead at the point of work immediately before starting, every time.',
      'AUTOMATIC START: a generating set in auto is armed, not off. So is a pump on a pressure switch. Lock out the control, not just the supply.',
      'A PV array cannot be switched off. Opening the DC isolator disconnects it from the inverter and leaves the array conductors live.',
      'Never use a non-contact voltage detector as the sole means of proving dead. It is an indicator, not a proving instrument.',
      'Never open-circuit a current transformer secondary while primary current flows — short the secondary first',
    ],
    stopAndCallProfessional: [
      'You cannot identify every source with confidence',
      'The installation provides no means of locking off',
      'You do not have a proving unit or a known live source to prove your indicator',
      'The work requires live working and you are not competent and equipped for it',
      'Documentation is absent and the system is interconnected in ways you cannot establish',
      'Anything about the situation is pressing you to shorten the procedure',
    ],
  },

  tools: [
    { tool: 'Two-pole voltage indicator of the correct category for the system', why: 'The instrument for proving dead; a multimeter is not the preferred tool and a non-contact detector is not acceptable alone' },
    { tool: 'Proving unit, or an identified known live source', why: 'Proving the indicator works BEFORE and AFTER the test — the step that makes the result trustworthy' },
    { tool: 'Personal padlocks and multi-lock hasp', why: 'Securing each isolation so it cannot be reinstated while you work' },
    { tool: 'Warning tags and notices', why: 'Telling others what is isolated, by whom and why' },
    { tool: 'True-RMS multimeter rated for the DC bus voltage', why: 'Verifying capacitor discharge in drives, inverters and UPS systems' },
    { tool: 'Insulated tools rated for the system voltage', why: 'All work on or near energy sources that cannot be removed, such as batteries' },
    { tool: 'Single-line diagram and equipment documentation', why: 'Identifying every source; you cannot isolate what you have not found' },
  ],

  decisionTree: [
    { question: 'Have you identified EVERY source that can energise this equipment?', yes: 'Continue', no: 'Stop. Consult the documentation. Unidentified sources are the commonest isolation failure.' },
    { question: 'Does this equipment contain a UPS, inverter or drive?', yes: 'Assume backfeed is possible and that the DC bus holds charge', no: 'Continue' },
    { question: 'Is there a generating set, pump or plant under automatic control?', yes: 'Lock out the CONTROL as well as the supply — auto means armed, not off', no: 'Continue' },
    { question: 'Is there a PV array, and is it daylight?', yes: 'The array is live and cannot be switched off. Treat its conductors as live throughout.', no: 'Continue' },
    { question: 'Is every isolation secured with your own lock?', yes: 'Continue', no: 'Switching off is not isolating. Fit your lock and keep the key.' },
    { question: 'Have you proved your voltage indicator on a known live source?', yes: 'Continue', no: 'Do it now — an unproved indicator makes the whole test worthless' },
    { question: 'Have you tested at the ACTUAL point of work?', yes: 'Continue', no: 'Testing at the isolator does not prove the conductor in front of you is dead' },
    { question: 'Have you re-proved the indicator AFTER testing?', yes: 'Proceed with the work', no: 'Not yet proven dead. This is the step that kills people when skipped.' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Identify every source',
      inspect: 'All supplies to the equipment: mains, generator, UPS, battery, PV array, control supplies, interconnections',
      where: 'Using the single-line diagram, labels and physical tracing',
      instrument: 'Documentation and inspection',
      expected: 'A complete list of sources, written down rather than held in memory',
      ifAbnormal: 'If documentation is absent or the system is interconnected in ways you cannot establish, stop. You cannot isolate what you have not found, and this is where isolation most often fails.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Isolate each source',
      inspect: 'Each isolator, breaker or link operated to the open position',
      where: 'At each identified source',
      instrument: 'Correct operation of the isolating device',
      expected: 'Every source open, including control supplies',
      ifAbnormal: 'A control supply from a separate source will remain live in an otherwise isolated panel and is easy to overlook.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Secure every isolation with your own lock',
      inspect: 'Each isolation physically locked, tagged, and the key on your person',
      where: 'At each isolating device',
      instrument: 'Personal padlock, hasp, tags',
      expected: 'Nothing can be reinstated without your key',
      ifAbnormal: 'Switching off is not isolating. Where several people work on the same equipment, each fits their own lock to a multi-lock hasp — never rely on someone else\'s.',
      next: 'Step 4',
      warning: 'Lock the automatic control as well as the supply. A generating set taken out of auto but not locked can be put back by anyone.',
    },
    {
      step: 4,
      title: 'Prove the voltage indicator on a known live source',
      inspect: 'That the indicator responds correctly before you rely on it',
      where: 'Proving unit or an identified live source',
      instrument: 'Proving unit',
      expected: 'Indicator responds as designed',
      ifAbnormal: 'An indicator that does not respond here is faulty. Using it would produce a dead reading on a live circuit.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Test at the actual point of work',
      inspect: 'All conductors, and each conductor to earth, at the place you will put your hands',
      where: 'The exact point of work, not the isolator',
      instrument: 'Two-pole voltage indicator',
      expected: 'No voltage present on any combination tested',
      ifAbnormal: 'Any reading means the circuit is not isolated. Stop and re-identify the sources — you have missed one.',
      next: 'Step 6',
      warning: 'An isolation correct at the board can still leave the conductor in front of you live through a path you have not identified. Test where you work.',
    },
    {
      step: 6,
      title: 'Prove the indicator AGAIN on the known live source',
      inspect: 'That the indicator still functions after the test',
      where: 'Proving unit or the same known live source',
      instrument: 'Proving unit',
      expected: 'Indicator still responds as designed',
      ifAbnormal: 'If it now fails, your dead reading proved nothing. Obtain a working indicator and repeat the whole test. This step is the difference between believing a circuit is dead and knowing it.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Verify stored energy is released or controlled',
      inspect: 'DC bus voltage, capacitors, springs, pressure, suspended loads and hot surfaces',
      where: 'At each stored-energy source',
      instrument: 'Multimeter for electrical; physical restraint and pressure relief for the rest',
      expected: 'Bus measured and confirmed discharged; mechanical energy released or restrained',
      ifAbnormal: 'Manufacturer discharge times are a minimum to wait, not evidence. Measure. Capacitors can also recover charge, so re-check before each work session.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Post warning and begin work',
      inspect: 'Notices in place, work area controlled, permanently live sources understood by everyone present',
      where: 'At the isolations and the work area',
      instrument: 'Warning notices',
      expected: 'Everyone on site knows what is isolated and why',
      ifAbnormal: 'Where a source cannot be removed — batteries, a PV array in daylight — make sure every person working knows it is live and is working accordingly.',
      next: 'On completion, remove locks in reverse order and re-energise deliberately',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Making isolation possible',
      steps: [
        'Label every isolator clearly and correctly, and cross-reference circuits fed from more than one board',
        'Provide lockable isolators where none exist',
        'Maintain an accurate single-line diagram — sources cannot be identified reliably without one',
        'Document the isolation sequence for complex equipment such as UPS systems, where order matters',
      ],
      note: 'Most isolation failures trace back to an installation that made correct isolation difficult.',
    },
    {
      level: 'component-replacement',
      title: 'Test equipment',
      steps: [
        'Replace voltage indicators that fail a proving check rather than continuing to use them',
        'Use instruments of the correct category for the system being tested',
        'Inspect leads and probes before every use, and replace damaged ones',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Competence and regulation',
      steps: [
        'Electrical work in Kenya is subject to occupational safety and health legislation and to the requirements of the national energy regulator, including licensing and competence requirements',
        'Verify the current requirements with the regulator rather than relying on any summary, including this one, as they are periodically revised',
        'Where the work requires a permit-to-work system, follow it — it exists because informal arrangements have failed before',
      ],
      note: 'This guide sets out engineering practice. It does not state legal requirements, which must be confirmed from the current regulations.',
    },
  ],

  validation: [
    'Confirm every identified source is isolated and locked before work begins',
    'Confirm the voltage indicator was proved before AND after the dead test',
    'Confirm the test was carried out at the point of work',
    'Confirm stored energy was measured or positively released, not assumed',
    'On completion, confirm tools and materials are removed and covers refitted before re-energising',
    'Remove locks in a controlled order, with everyone clear of the equipment',
    'Re-energise deliberately and confirm correct operation',
    'Record the isolation, the work and the re-energisation',
  ],

  whenNotToRepair: [
    'Where every source cannot be identified with confidence — the work should not start',
    'Where no means of locking off exists and cannot be improvised safely',
    'Where a proving unit or known live source is unavailable',
    'Where live working would be required and you are not competent and equipped for it',
    'Where anything about the situation is pressing you to shorten the procedure — that pressure is the hazard',
  ],

  prevention: [
    'Treat proving the prover as non-negotiable; it is the step that turns a reading into evidence',
    'Keep single-line diagrams current, because they are the only reliable way to identify every source',
    'Label isolators properly and cross-reference multi-source circuits',
    'Carry your own locks and keep the only key',
    'Check voltage indicators and proving units regularly',
    'Build the isolation sequence into the job plan rather than improvising it on site',
    'Never let time pressure shorten the procedure — every step exists because its absence has injured someone',
    'Make it normal for anyone to stop work when the isolation is not proven',
  ],

  relatedSlugs: ['solar-system-underperforming', 'test-instruments-and-measurement-errors', 'ups-bypass-fault', 'vfd-drive-fault-diagnosis'],

  faq: [
    {
      q: 'Why prove the tester twice? Surely once is enough.',
      a: 'Because a voltage indicator can fail between the two tests, and a failed indicator gives exactly the same reading as a dead circuit — nothing. Proving it works before the test, and again after, is what distinguishes "the circuit is dead" from "my instrument stopped working". Skipping the second check is a recognised cause of electrocution on circuits people believed were isolated.',
    },
    {
      q: 'I switched off the main breaker. Is that not isolation?',
      a: 'No, for two reasons. Switching off is not securing — anyone can switch it back on, so it must be locked with your own lock and your own key. And on power equipment there is usually more than one source: a UPS can backfeed its input, a generating set in auto can start itself, a PV array is live in daylight, and batteries and DC bus capacitors cannot be switched off at all. Isolating the obvious source proves nothing about the rest.',
    },
    {
      q: 'The drive display is off, so the DC bus must be discharged?',
      a: 'No. The display losing power tells you nothing about the bus capacitors, which retain a lethal charge afterwards. The manufacturer\'s stated waiting time is a minimum to wait, not evidence that the wait was sufficient — measure the bus with a meter rated for it, and re-check before each work session, because some circuits recover charge.',
    },
    {
      q: 'Can I use a non-contact voltage pen to prove dead?',
      a: 'Not as the sole means. Those devices are indicators, not proving instruments — they can miss a live conductor behind screening or insulation, and they cannot be proved on a known source in the same way. Use a two-pole voltage indicator of the correct category, proved before and after on a proving unit.',
    },
  ],

  references: [
    'IEC 60364 — low-voltage electrical installations, including provisions for isolation and switching',
    'IEC 60204-1 — safety of machinery: electrical equipment of machines, including isolation and stored energy',
    'IEC 61010 — safety requirements for electrical equipment for measurement, control and laboratory use, which defines measurement categories for test instruments',
    'IEC 62040-1 — UPS safety requirements, relevant to backfeed and multiple sources',
    'Kenya\'s occupational safety and health legislation and the requirements of the national energy regulator, which govern competence and licensing for electrical work — verify the current requirements directly, as they are periodically revised',
  ],
};
