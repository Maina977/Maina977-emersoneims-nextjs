import type { RepairArticle } from '../types';

export const atsWillNotReturnToMains: RepairArticle = {
  slug: 'ats-will-not-return-to-mains',
  hub: 'ats-changeover',
  header: {
    title: 'Generator Will Not Transfer Back to Mains',
    equipmentCategory: 'Automatic transfer switches — return sequence and cooldown',
    appliesTo: 'Contactor-based and motorised automatic transfer switches on utility and generator supplies, single- and three-phase',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low. Most of these are a return timer doing its job, and the rest divide cleanly between mains sensing and the mechanism.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Utility and generator supplies 240 V / 415 V 50 Hz nominal; control supply per panel design',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'Check the return timer before assuming anything is broken, because on most installations it is deliberately long and a set still running twenty minutes after the lights come back is usually correct behaviour rather than a fault. The return delay exists so the system does not transfer back onto a utility supply that has returned but is still unstable, and a cooldown period then lets the set run unloaded before stopping. If the timers have genuinely expired and the load is still on the generator, the question becomes whether the controller accepts the returned mains as healthy. It judges that on its own sensing terminals, so a blown sensing fuse, a lost phase or reversed rotation after upstream work will leave it correctly refusing to return to a supply it cannot verify. Only when the controller is commanding a return that does not happen should the mechanism be suspected, and at that point the distinction is whether the command reaches the switch or the switch cannot act on it. Running on generator is expensive but not dangerous, so there is no reason to force a transfer before understanding why it has not occurred.',

  symptoms: {
    display: [
      'Mains restored indication with the load still on generator',
      'Return or retransfer timer counting with no transfer following',
      'Controller showing mains not accepted despite utility being present',
      'Cooldown running after transfer, which is normal',
      'Position discrepancy alarm between commanded and actual state',
    ],
    indicators: [
      'Generator contactor still energised with utility available',
      'Mains available indicator absent on the controller',
      'Mode selector found in manual or test',
      'Control fuse or MCB open',
    ],
    sounds: [
      'Set continuing to run long after the utility returned',
      'Contactor chattering, which suggests marginal sensing or a weak control supply',
      'A clunk with no change of position, indicating a mechanical obstruction',
      'Motor operator running without completing travel',
    ],
    smells: [
      'Burnt smell from contactor coils or contacts',
      'Hot insulation smell at power terminations',
    ],
    behaviour: [
      'Returns eventually but only after a long delay, which is the timer rather than a fault',
      'Never returns until someone intervenes manually',
      'Returned normally until upstream electrical work was carried out',
      'Transfers to generator promptly but will not come back, which separates the two directions cleanly',
      'Returns on some occasions and not others, pointing at marginal sensing rather than a failed component',
      'Set runs on indefinitely, raising fuel cost and running hours',
    ],
    visible: [
      'Return delay and cooldown timer settings',
      'Mode selector position',
      'Mains-sensing fuses and where sensing is connected',
      'Contactor or switch contact condition, including signs of welding',
      'Mechanical interlock condition and free movement',
      'Evidence of recent upstream electrical work',
    ],
  },

  whatItMeans: {
    plain:
      'The utility has come back but the load is still being fed by the generator. Usually the panel is simply waiting out a deliberate delay so it does not switch back onto a supply that has returned but is still unsettled. If the delay has passed, either the panel does not accept the returned supply as good enough, or it is trying to switch and the mechanism will not move.',
    technical:
      'Return to the preferred source is governed by the same three-part logic as the outbound transfer, in reverse. The controller must judge the utility acceptable against its configured criteria, a return delay must expire, and the switching mechanism must execute the command. The return delay is normally set longer than the failure delay by design, because a supply that has just been restored is more likely to fail again, and transferring the load back prematurely risks a second interruption. A cooldown period usually follows the transfer, allowing the set to run unloaded and dissipate heat before stopping, so continued running after the load has moved is expected rather than faulty. Acceptance is judged at the controller sensing terminals, which is why the controller can refuse a utility supply the building is otherwise using: a blown sensing fuse, an open sensing lead, a lost phase or reversed rotation after upstream work all leave it unable to verify the source. On the mechanism side, motorised operators and contactor arrangements can fail to release from the generator position, and a mechanical interlock will physically prevent the return if the mechanism has not fully cleared. Contacts welded closed by an earlier fault current are a specific and dangerous case, because the controller may indicate a completed transfer while the load remains connected to the previous source.',
  },

  causes: {
    mostLikely: [
      'Return delay or cooldown timer still running — normal behaviour mistaken for a fault',
      'Mains-sensing fuse blown or sensing lead open, so the controller cannot verify the returned supply',
      'Mode selector left in manual or test',
      'Utility supply present but outside the acceptance criteria — voltage, frequency or a lost phase',
    ],
    possible: [
      'Phase rotation reversed after upstream electrical work',
      'Return timer configured far longer than the site expects',
      'Control supply weak or its fuse open',
      'Contactor coil or its control circuit failed on the mains side',
      'Auxiliary contact failed, so the controller has an incorrect view of position',
    ],
    lessCommon: [
      'Mechanical interlock jammed, preventing release from the generator position',
      'Motor operator failed part-way through travel',
      'Contacts welded closed on the generator side',
      'Controller configuration corrupted or changed',
      'Building management system inhibiting the return',
    ],
    modelSpecific: [
      'Return delay and cooldown durations are configurable and differ widely between installations — read them from the controller',
      'Acceptance thresholds for the returned supply are model-specific',
      'Some controllers require the utility to be stable for the full delay and restart the timer on any dip',
      'Interlock arrangements differ; mechanical on some designs, electrical on others',
      'Manual return procedures differ and must not be improvised',
    ],
    environmental: [
      'Unstable utility supply repeatedly restarting the return timer',
      'Moisture and dust causing tracking on control circuits',
      'Vibration loosening control terminations',
      'Insect ingress into the panel',
    ],
    installation: [
      'Sensing connected to a point that does not represent the utility being monitored',
      'Return timer left at a commissioning default unsuited to the site',
      'Control wiring routed alongside power cables',
      'No documented test of the return sequence, so it is never proven',
    ],
    maintenance: [
      'Return sequence never tested, only the outbound transfer',
      'Timer settings never recorded, so changes are undetectable',
      'Contacts never inspected for wear or welding',
      'Mode selector not returned to auto after intervention',
    ],
    componentLevel: [
      'Mains-sensing fuse open',
      'Mains contactor coil failed',
      'Auxiliary contact failed',
      'Motor operator failed',
      'Contacts welded on the generator side',
    ],
  },

  safety: {
    isolation: [
      'The panel is fed from TWO independent live sources; isolating the utility leaves the generator side live and the reverse',
      'Isolate both sources and prevent the generator starting before working inside the panel',
      'Lock the generator control in stop and isolate its starting battery',
      'Prove dead on both incoming sides and the load side at the point of work',
    ],
    lockoutTagout: [
      'Lock and tag the utility supply, the generator supply and the generator control',
      'Confirm the load may lose supply for the duration, or arrange an alternative',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy at the panel',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Hearing protection while the set runs',
    ],
    storedEnergy: [
      'Motorised operators may hold stored spring energy; release it by the documented method',
      'Control circuits may remain live from a separate supply after the main sources are isolated',
      'The generator starting battery remains live',
      'The set may be running throughout the investigation',
    ],
    specificHazards: [
      'NEVER defeat the mechanical interlock to force a return. It exists to prevent utility and generator being connected together, which back-feeds the network and can kill someone working on supposedly dead lines.',
      'Welded contacts can hold the load on the previous source while the controller indicates a completed transfer — verify position physically rather than from the indicator.',
      'The generator can start or stop automatically during the work unless its control is locked off.',
      'Never open-circuit a current transformer secondary while load current flows.',
      'Running on generator is expensive, not dangerous. There is no reason to rush a forced transfer before the cause is understood.',
    ],
    stopAndCallProfessional: [
      'The mechanical interlock is damaged, jammed or has been defeated',
      'Contacts are suspected welded',
      'There is a burnt smell or evidence of arcing in the panel',
      'The load cannot lose supply and no alternative exists',
      'Manual operation of this switch type is not documented or not understood',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the system voltage', why: 'Utility voltage measured at the ATS sensing terminals, and control circuit checks' },
    { tool: 'Phase rotation tester', why: 'Reversed rotation after upstream work disqualifies the returned supply instantly' },
    { tool: 'Clamp meter', why: 'Confirming which source is actually carrying the load, independent of the indicators' },
    { tool: 'Controller documentation and settings access', why: 'Return delay, cooldown and acceptance thresholds must be read rather than assumed' },
    { tool: 'Proving unit and voltage indicator', why: 'Proving dead in a panel fed from two sources' },
    { tool: 'Thermal camera', why: 'Power terminations and contact condition under load' },
    { tool: 'Stopwatch or timing record', why: 'Establishing whether the delay observed matches the configured timer' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell or evidence of arcing in the panel?', yes: 'Stop. Isolate both sources and escalate.', no: 'Continue' },
    { question: 'Have the return delay and cooldown timers actually expired?', yes: 'Continue', no: 'Not a fault. The panel is waiting by design — confirm the settings suit the site.' },
    { question: 'Is the mode selector in AUTO?', yes: 'Continue', no: 'That explains it, and it is a common finding after earlier work' },
    { question: 'Is utility present at the ATS SENSING terminals, all phases, correct rotation?', yes: 'Continue', no: 'The controller cannot verify the supply — sensing fuse, lost phase or rotation' },
    { question: 'Does the controller report the utility as available?', yes: 'The decision is correct — investigate the mechanism', no: 'Sensing or acceptance thresholds, not the switch' },
    { question: 'Is a return command being issued at the controller output?', yes: 'Command present but no movement indicts the coil, operator or mechanism', no: 'The fault is in sensing, configuration or the controller' },
    { question: 'Does the mechanism move freely by the documented manual method?', yes: 'Suspect the coil, operator or its control circuit', no: 'Interlock or obstruction — do not force it' },
    { question: 'Is the load physically confirmed to be on the source the indicator claims?', yes: 'Proceed', no: 'Suspect welded contacts — this is a safety matter, not an indication fault' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Read the timers before treating anything as a fault',
      inspect: 'Return delay and cooldown settings, and how long the utility has actually been back',
      where: 'Controller configuration and display',
      instrument: 'Controller interface, timing record',
      expected: 'Behaviour consistent with the configured delays',
      ifAbnormal: 'A return delay is deliberately long, and a set still running well after the lights come back is usually correct. Establishing this first prevents a great deal of unnecessary investigation.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Check the mode selector and read the controller',
      inspect: 'Selector position, active alarms and what the controller reports about the utility',
      where: 'At the controller',
      instrument: 'Display or service interface',
      expected: 'Auto selected; a clear statement about the utility source',
      ifAbnormal: 'The controller usually says plainly whether it regards the utility as available, which is faster than measuring and points immediately at sensing or mechanism.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure the utility at the ATS sensing terminals',
      inspect: 'Voltage on every phase, and phase rotation, at the ATS rather than a nearby board',
      where: 'ATS utility input and sensing terminals',
      instrument: 'True-RMS multimeter and phase rotation tester',
      expected: 'All phases present, balanced, correct rotation',
      ifAbnormal: 'A lost phase or reversed rotation leaves the controller correctly refusing a supply the rest of the building is using. Reversed rotation after upstream work is a classic finding here.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Compare what the controller senses against your measurement',
      inspect: 'Controller-reported utility values against your own readings at the same terminals',
      where: 'Controller display versus ATS terminals',
      instrument: 'Multimeter and controller display',
      expected: 'Agreement',
      ifAbnormal: 'Disagreement isolates the fault to sensing — a blown sensing fuse or open lead. The controller is then making a correct decision on wrong information.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Establish whether a return command is being issued',
      inspect: 'Controller output and the corresponding coil or operator circuit',
      where: 'Controller output terminals through to the mechanism',
      instrument: 'Multimeter',
      expected: 'Command present and arriving at the mechanism',
      ifAbnormal: 'This separates a decision problem from a mechanism problem, and it is the step that stops people replacing switches that were never commanded to move.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Assess the mechanism and interlock',
      inspect: 'Free movement, interlock condition, contact condition and auxiliary contacts',
      where: 'At the switching mechanism, both sources isolated and proven dead',
      instrument: 'Manual operation by the documented method',
      expected: 'Mechanism moving freely and completing travel in both directions',
      ifAbnormal: 'A mechanism that hums or partly moves is usually obstructed or not fully released from the generator position. Never force it and never defeat the interlock.',
      next: 'Step 7',
      warning: 'Isolate both sources and lock the generator control before touching the mechanism.',
    },
    {
      step: 7,
      title: 'Verify the load position physically, not from the indicator',
      inspect: 'Which source is actually carrying the load',
      where: 'On the load conductors',
      instrument: 'Clamp meter',
      expected: 'Load on the source the controller indicates',
      ifAbnormal: 'Welded contacts can hold the load on the previous source while the controller indicates a completed transfer. That is a safety matter and must be resolved before the panel is returned to service.',
      next: 'Correct the identified cause and prove the full sequence',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Timers and mode',
      steps: [
        'Set return delay and cooldown to values that suit the site rather than commissioning defaults',
        'Return the mode selector to auto and make that a documented final step',
        'Verify acceptance thresholds against the supply the site actually has',
        'Record all settings after any change',
      ],
      note: 'A large share of these callouts end here, having found the panel behaving exactly as configured.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Sensing and control',
      steps: [
        'Replace blown mains-sensing fuses after establishing why they operated',
        'Repair open or corroded sensing leads and control wiring',
        'Re-torque power and control terminations and survey thermally under load',
        'Clear moisture and insect ingress and seal panel entries',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Switching components',
      steps: [
        'Replace failed contactor coils and auxiliary contacts',
        'Replace contactors with pitted or welded contacts rather than dressing them',
        'Replace a failed motor operator',
      ],
    },
    {
      level: 'mechanical',
      title: 'Mechanism and interlock',
      steps: [
        'Free or correct a jammed mechanism only by the documented method',
        'Repair or replace a damaged mechanical interlock — never bypass it',
        'Confirm travel completes in both directions after any work',
      ],
      note: 'Interlock integrity is a life-safety matter because of the back-feed risk.',
    },
    {
      level: 'wiring',
      title: 'Sensing connection point',
      steps: [
        'Correct phase rotation at its source after upstream work',
        'Move sensing to a point that genuinely represents the utility being monitored',
        'Label sensing fuses so the next person finds them quickly',
      ],
    },
  ],

  validation: [
    'Simulate a mains failure and prove the FULL sequence including the return, not just the outbound transfer',
    'Time the return delay and cooldown against the configured values',
    'Confirm the load is carried by the expected source, verified by measurement rather than indicator',
    'Verify phase rotation on both sources',
    'Confirm the mode selector is left in auto and record that it was',
    'Thermally survey power terminations under load after the work',
    'Confirm the mechanical interlock operates correctly and has not been disturbed',
    'Record all settings, measurements and the test result in the panel documentation',
  ],

  whenNotToRepair: [
    'Switch assemblies with damaged mechanical interlocks, where safety cannot be assured by repair',
    'Contactors with welded or heavily eroded contacts, which are replacement items',
    'Panels undersized for the present load',
    'Obsolete controllers and switch assemblies that are unobtainable',
    'Any situation where restoring function would require defeating the interlock',
  ],

  prevention: [
    'Test the RETURN sequence at every service, not only the transfer to generator — the return is the half that goes untested for years',
    'Record return delay and cooldown settings so unintended changes are detectable',
    'Return the selector to auto as a documented step at the end of every intervention',
    'Verify phase rotation after any upstream electrical work',
    'Inspect contacts for wear and welding at service intervals',
    'Seal panels against moisture and insect ingress',
    'Confirm load position by measurement periodically rather than trusting indicators',
  ],

  relatedSlugs: ['ats-not-changing-over', 'generator-starts-in-manual-not-auto'],

  faq: [
    {
      q: 'The power came back ten minutes ago and the generator is still running. Is it broken?',
      a: 'Almost certainly not. The return delay exists so the system does not transfer back onto a supply that has just returned and may fail again, and a cooldown then lets the set run unloaded before stopping. On many installations that adds up to a considerable wait. Check the configured timers before treating it as a fault, and confirm they match what the site actually wants.',
    },
    {
      q: 'It transfers to the generator fine but never comes back. Why one direction and not the other?',
      a: 'Because the two directions use different information. Transferring out depends on detecting that the utility has FAILED; returning depends on verifying that it is healthy again. If the mains-sensing fuse has blown or a phase is lost, the controller can still see a failure but can no longer confirm a good supply, so it correctly refuses to return. Measure the utility at the ATS sensing terminals, not at a nearby board.',
    },
    {
      q: 'Can we just force it across manually to save fuel?',
      a: 'Only by the documented manual method for that switch, and only after understanding why it has not returned. Running on generator is expensive but not dangerous, so there is no need to rush. What you must never do is defeat the mechanical interlock — it prevents utility and generator being connected together, which back-feeds the network and can kill someone working on supposedly dead lines.',
    },
    {
      q: 'The controller says it transferred back, but the generator is still loaded. What is happening?',
      a: 'Verify the load position with a clamp meter rather than trusting the indicator. Contacts welded closed by an earlier fault current can hold the load on the generator while the controller believes the transfer completed. That is a safety issue as well as an operational one, and the panel should not be returned to service until it is resolved.',
    },
  ],

  references: [
    'IEC 60947-6-1 — low-voltage switchgear and controlgear: transfer switching equipment',
    'IEC 60364 — low-voltage electrical installations, including provisions for safety services and supplies',
    'ISO 8528 — generating sets, including control and switchgear considerations',
    'The ATS and controller manufacturer\'s documentation for the specific equipment, which is the only valid source for return delay and cooldown functions, acceptance thresholds, manual operation procedure and interlock arrangements referred to throughout',
  ],
};
