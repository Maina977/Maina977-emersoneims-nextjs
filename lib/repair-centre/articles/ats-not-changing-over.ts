import type { RepairArticle } from '../types';

export const atsNotChangingOver: RepairArticle = {
  slug: 'ats-not-changing-over',
  hub: 'ats-changeover',
  header: {
    title: 'ATS Not Changing Over — Automatic Transfer Switch Diagnosis',
    equipmentCategory: 'Automatic transfer switches and changeover panels',
    appliesTo: 'Contactor-based and motorised automatic transfer switches, single- and three-phase, controlling utility and generator supplies',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate. The switch is often healthy and simply has not been given permission to transfer.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Utility and generator supplies 240 V / 415 V 50 Hz nominal; control supply per panel design',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'Establish whether the switch has been told to transfer before assuming it cannot. An ATS transfers only when its control logic is satisfied that the incoming supply is unacceptable, that the alternative supply is acceptable, and that any configured timers have expired, so the most common finding is a switch in perfect working order that is correctly refusing to move. Check the mode selector first, because a panel left in manual or test after earlier work will never transfer automatically and this costs more callouts than any component fault. Then check the sensing supplies the controller uses to make its decision, remembering that it senses both sources independently and can reject the generator as readily as the utility. Then check the timers, since deliberate delays on failure, transfer, return and cooldown mean an ATS that appears not to be working is frequently just waiting. Only when the controller is confirmed to be commanding a transfer that does not happen should you investigate the switching mechanism itself, its coils, its motor operator or its mechanical interlock, and at that point the distinction to make is whether the command is reaching the mechanism or the mechanism is failing to act on it.',

  symptoms: {
    display: [
      'Mains failure indicated but no transfer to generator',
      'Generator running and available but load not transferred',
      'Transfer fault, changeover fault or position discrepancy alarm',
      'Both sources shown unavailable',
      'Controller showing a timer counting with no transfer following',
    ],
    indicators: [
      'Position indicators not matching the actual switch position',
      'Mode selector found in manual or test rather than auto',
      'Control supply healthy indicator absent',
      'Generator available indication absent despite the set running normally',
    ],
    sounds: [
      'Contactor chattering, indicating a marginal control supply or a sensing problem',
      'A single clunk with no change of position, suggesting a mechanical obstruction',
      'Motor operator running without completing travel',
      'Complete silence at the moment transfer should occur',
    ],
    smells: [
      'Burnt smell from contactor coils or contacts — stop and investigate before further operation',
      'Hot insulation smell at power terminations, indicating a loose or overloaded joint',
      'Ozone smell, which can accompany arcing within the enclosure',
    ],
    behaviour: [
      'Transfers on test but not on a genuine mains failure, which usually points at sensing rather than mechanism',
      'Transfers to generator but will not return to utility, or the reverse',
      'Worked until upstream electrical work was carried out, which frequently means phase rotation was reversed',
      'Transfers only after a long delay, which is normally a timer setting rather than a fault',
      'Intermittent transfer, which points at control supply, sensing or a loose connection rather than a failed component',
      'Generator starts on mains failure but the load never moves, which cleanly separates the start signal from the transfer function',
    ],
    visible: [
      'Mode selector position',
      'Control fuses and MCB condition',
      'Contactor or switch contact condition, including pitting and welding',
      'Mechanical interlock condition and free movement',
      'Control wiring for damage, corrosion or disturbed terminations',
      'Heat discolouration at power terminations',
      'Evidence of recent work in or near the panel',
    ],
  },

  whatItMeans: {
    plain:
      'The changeover panel is supposed to move the load from the mains to the generator automatically, and back again. When it does not, it is often because the panel has decided the conditions are not right — the wrong switch position, a supply it is not happy with, or a timer still running. Less often the switching mechanism itself has failed. Checking the decision before the mechanism saves most of the work.',
    technical:
      'An automatic transfer switch comprises a sensing and control section and a switching mechanism, and a failure to transfer can originate in either. The controller monitors both sources independently against configured acceptance criteria — typically under-voltage, over-voltage, phase loss and, on three-phase systems, phase rotation, and issues a transfer command only when the preferred source fails its criteria and the alternative satisfies them. Deliberate timers govern the sequence: a failure delay to ride through brief disturbances, a start delay, a transfer delay, a return delay to avoid transferring back to an unstable utility, and a cooldown period allowing the set to run unloaded before stopping. All of these produce behaviour that looks like a fault to an observer expecting instant action. The switching mechanism is either contactor-based, where coils hold the load on one source, or motorised, where a motor operator drives a mechanically interlocked switch between positions. A mechanical interlock exists specifically to make it impossible to connect both sources simultaneously, and it will physically prevent a transfer if the mechanism is not fully released from its current position, which presents as a switch that hums or attempts to move but does not complete. Auxiliary contacts report position back to the controller, so a failed auxiliary can cause a controller to believe the transfer has not occurred when it has, or to refuse a further command. Because the panel is fed from two independent sources, isolating one leaves the other live, which is the defining hazard of this work.',
  },

  causes: {
    mostLikely: [
      'Mode selector left in manual or test after earlier work',
      'Sensing supply to the controller lost — control fuse or MCB open',
      'Alternative source rejected by the controller for voltage, frequency, phase loss or rotation',
      'Timer still running, so the transfer is delayed rather than failed',
    ],
    possible: [
      'Phase rotation reversed after upstream electrical work',
      'Contactor coil failed or its control circuit open',
      'Auxiliary contact failed, so the controller has an incorrect view of position',
      'Loose or corroded control terminations',
      'Generator available signal not reaching the ATS',
    ],
    lessCommon: [
      'Mechanical interlock jammed or damaged',
      'Motor operator failed or its drive train damaged',
      'Contacts welded closed by a fault current, preventing release',
      'Controller failed or its configuration corrupted',
      'Control transformer failed',
    ],
    modelSpecific: [
      'Acceptance thresholds and every timer are configurable and model-specific — read them from the controller rather than assuming',
      'Contactor-based and motorised switches differ fundamentally in failure mode and in how they are safely operated manually',
      'Manual operation procedures differ; some require the load to be off, and improvising is dangerous',
      'Some controllers require a generator-available signal from the set controller before they will transfer at all',
      'Interlock arrangements differ between designs, mechanical on some and electrical on others',
    ],
    environmental: [
      'Dust and humidity causing tracking and corrosion on control circuits',
      'High enclosure temperature affecting coils and electronics',
      'Insect and rodent ingress into panels, a frequent and genuine cause',
      'Vibration loosening terminations over time',
    ],
    installation: [
      'Control wiring routed alongside power cables, picking up interference',
      'Sensing taken from a point that does not represent the supply the load sees',
      'Panel undersized for the load, so contacts degrade prematurely',
      'Phase rotation never verified after installation or alteration',
    ],
    maintenance: [
      'Transfer never exercised, so a failure is discovered only during a genuine outage',
      'Contacts never inspected for pitting or wear',
      'Control terminations never re-torqued',
      'Timer and threshold settings never recorded, so unintended changes are undetectable',
      'Mechanical interlock and manual operation never checked',
    ],
    componentLevel: [
      'Contactor coil open',
      'Auxiliary contact failed',
      'Control fuse open',
      'Motor operator failed',
      'Controller or its relay output failed',
    ],
  },

  safety: {
    isolation: [
      'An ATS panel is fed from TWO independent sources. Isolating the utility leaves the generator side live, and isolating the generator leaves the utility side live.',
      'Isolate both sources and prevent the generator from starting before working inside the panel',
      'Lock the generator control in stop and isolate its starting battery',
      'Prove dead on both incoming sides and on the load side at the point of work',
    ],
    lockoutTagout: [
      'Lock and tag the utility supply, the generator supply and the generator control',
      'Confirm the load may be without supply for the duration, or arrange an alternative',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy at the panel',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Ensure a safe working position — never work in a cramped posture inside a live panel',
    ],
    storedEnergy: [
      'Motorised operators may hold stored mechanical energy in springs; release it by the documented method before working on the mechanism',
      'Control circuits may remain live from a separate control supply after the main sources are isolated',
      'The generator starting battery remains live',
    ],
    specificHazards: [
      'The generator can start automatically at any moment while the panel is in auto. Before opening the panel, take it out of auto AND lock off the generator control — either alone is not enough.',
      'Never defeat the mechanical interlock. It exists to prevent connecting utility and generator together, which would back-feed the network and can be lethal to people working on it.',
      'Back-feed onto a supposedly dead utility supply endangers utility staff. Treat interlock integrity as a life-safety matter, not a convenience.',
      'Never open-circuit a current transformer secondary while load current flows',
      'Welded contacts may hold the load connected even when the controller indicates otherwise — verify position physically, not from the indicator',
    ],
    stopAndCallProfessional: [
      'The mechanical interlock is damaged, jammed or has been defeated',
      'Contacts are suspected welded',
      'There is a burnt smell or evidence of arcing inside the panel',
      'The load cannot lose supply and no alternative arrangement exists',
      'Manual operation of this switch type is not documented or not understood',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the system voltage', why: 'Source voltages measured at the ATS terminals, and control circuit continuity' },
    { tool: 'Phase rotation tester', why: 'Reversed rotation after upstream work is a classic cause and disqualifies a source instantly' },
    { tool: 'Clamp meter', why: 'Confirming which source is actually carrying the load' },
    { tool: 'Proving unit and voltage indicator', why: 'Proving dead on both sources before work — a two-source panel demands it' },
    { tool: 'Insulated torque wrench and hand tools', why: 'Power and control terminations are torque-specified' },
    { tool: 'Thermal camera', why: 'Loose power terminations and degraded contacts under load' },
    { tool: 'Controller documentation and access to its settings', why: 'Thresholds and timers must be read from the unit, not assumed' },
    { tool: 'Contact resistance meter where available', why: 'Assessing contact condition without dismantling' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell or evidence of arcing in the panel?', yes: 'Stop. Isolate both sources and escalate.', no: 'Continue' },
    { question: 'Is the mode selector in AUTO?', yes: 'Continue', no: 'That explains it. A panel left in manual or test after earlier work will never transfer automatically.' },
    { question: 'Is the control supply present and are control fuses intact?', yes: 'Continue', no: 'The controller cannot act without its own supply — restore it and establish why it was lost' },
    { question: 'Does the controller see the failed source as failed?', yes: 'Continue', no: 'A sensing problem — the controller has no reason to transfer' },
    { question: 'Does the controller see the alternative source as available and acceptable?', yes: 'Continue', no: 'Check that source: voltage, frequency, phase presence and rotation. The controller may be correctly rejecting it.' },
    { question: 'Are the configured timers simply still running?', yes: 'Not a fault — the delay is deliberate. Confirm the settings are appropriate.', no: 'Continue' },
    { question: 'Is the controller issuing a transfer command?', yes: 'The decision is correct — investigate the mechanism, coils or motor operator', no: 'The fault is in sensing, configuration or the controller, not the switch' },
    { question: 'Does the mechanism move freely when operated manually by the documented method?', yes: 'Suspect the coil, motor operator or its control circuit', no: 'Mechanical interlock or mechanism obstruction — do not force it' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Make the panel safe before opening it',
      inspect: 'Mode selector position, generator control state and both source isolations',
      where: 'At the ATS panel and the generator control',
      instrument: 'Visual inspection and proving unit',
      expected: 'Panel out of auto, generator locked off, both sources isolated and proven dead where work requires it',
      ifAbnormal: 'Taking the panel out of auto alone does not prevent the set starting. Lock the generator control as well.',
      next: 'Step 2',
      warning: 'This panel has two independent live sources. Isolating one leaves the other live.',
    },
    {
      step: 2,
      title: 'Check the mode selector and read the controller',
      inspect: 'Selector position, controller display, active alarms and event history',
      where: 'At the controller',
      instrument: 'Controller display or service interface',
      expected: 'Auto selected, and a clear statement of what the controller believes about each source',
      ifAbnormal: 'A selector left in manual is the single most common cause. The controller usually states plainly why it has not transferred, which is faster than measuring.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Verify the control supply',
      inspect: 'Control fuses, MCBs and the control supply itself',
      where: 'Control circuit within the panel',
      instrument: 'Multimeter',
      expected: 'Control supply present and protection intact',
      ifAbnormal: 'A controller without its own supply cannot command anything. Establish why a control fuse opened rather than simply replacing it.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Measure both sources at the ATS terminals',
      inspect: 'Voltage on every phase of both incoming supplies, and phase rotation',
      where: 'At the ATS incoming terminals',
      instrument: 'True-RMS multimeter and phase rotation tester',
      expected: 'Sources present as expected, with correct and matching rotation',
      ifAbnormal: 'A lost phase or reversed rotation causes the controller to reject a source that otherwise looks healthy. Reversed rotation after upstream work is a classic finding.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Compare what the controller senses against what you measure',
      inspect: 'Controller-reported source values against your own measurement at the same terminals',
      where: 'Controller display versus ATS terminals',
      instrument: 'Multimeter and controller display',
      expected: 'Agreement between the two',
      ifAbnormal: 'Disagreement isolates the fault to sensing — a blown sensing fuse, an open sensing lead or a failed input. The controller is then making a correct decision on wrong information.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Read the timer settings before concluding anything is broken',
      inspect: 'Failure, start, transfer, return and cooldown timers',
      where: 'Controller configuration',
      instrument: 'Controller display or service interface',
      expected: 'Timers set appropriately for the installation',
      ifAbnormal: 'A long return delay makes a healthy panel look stuck on generator. Confirm settings against the intended operation before adjusting them, and record any change.',
      next: 'Step 7',
      verify: 'The intended timer values for this installation — these are site decisions, not universal figures, and should be recorded in the panel documentation.',
    },
    {
      step: 7,
      title: 'Establish whether the transfer command is being issued and reaching the mechanism',
      inspect: 'Controller output and the corresponding coil or operator control circuit',
      where: 'At the controller output terminals and the coil or operator',
      instrument: 'Multimeter',
      expected: 'Command present at the controller output and arriving at the mechanism',
      ifAbnormal: 'This is the point that separates a decision problem from a mechanism problem. Command present but no movement indicts the coil, operator or mechanism; no command indicts sensing, configuration or the controller.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Assess the mechanism, interlock and contacts',
      inspect: 'Free movement, interlock condition, contact condition and auxiliary contacts',
      where: 'At the switching mechanism, both sources isolated and proven dead',
      instrument: 'Manual operation by the documented method, contact resistance meter',
      expected: 'Mechanism moving freely and completing travel; contacts in good condition',
      ifAbnormal: 'A mechanism that hums or partly moves is usually obstructed or not fully released from its current position. Welded contacts may hold the load connected regardless of what the indicator says — verify position physically.',
      next: 'Refer mechanism and controller failures for replacement or specialist repair',
      warning: 'Never force the mechanism and never defeat the mechanical interlock. It prevents paralleling utility and generator, which can back-feed the network.',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Mode, thresholds and timers — check first',
      steps: [
        'Return the mode selector to auto and confirm it is left there after any work',
        'Verify acceptance thresholds against the supplies the site actually has',
        'Verify timers against the intended operation, and record any change with its justification',
        'Confirm the generator-available signal is configured and arriving where the design requires it',
      ],
      note: 'A large share of these callouts end here, with no part replaced.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Control and power connections',
      steps: [
        'Re-torque power and control terminations to specification and re-survey thermally under load',
        'Clean corrosion from control terminals and replace damaged control wiring',
        'Clear insect and rodent ingress and seal entry points',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Switching and control components',
      steps: [
        'Replace failed contactor coils, auxiliary contacts and control fuses',
        'Replace contactors with pitted or welded contacts rather than dressing them',
        'Replace a failed motor operator',
        'Replace a failed controller and restore its configuration from a record',
      ],
    },
    {
      level: 'mechanical',
      title: 'Mechanism and interlock',
      steps: [
        'Free and correct a jammed mechanism only by the documented method',
        'Repair or replace a damaged mechanical interlock — never bypass it',
        'Confirm the mechanism completes travel in both directions after any work',
      ],
      note: 'Interlock integrity is a life-safety matter because of the back-feed risk. It is never an acceptable thing to defeat.',
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond field repair',
      steps: [
        'Refer switch assemblies with internal mechanical damage',
        'Provide the measured source values, controller reports and the observed behaviour',
      ],
    },
  ],

  validation: [
    'Confirm the mode selector is in auto and left there',
    'Simulate a mains failure by the documented method and confirm the full sequence: start, transfer, run, restore, return and cooldown',
    'Time each stage and confirm it matches the configured timers',
    'Confirm the load is genuinely carried by the expected source, by measurement rather than by indicator',
    'Verify phase rotation on both sources',
    'Thermally survey power terminations under load after the work',
    'Confirm the mechanical interlock operates correctly and has not been disturbed',
    'Record all settings, measurements and the test result in the panel documentation',
  ],

  whenNotToRepair: [
    'Switch assemblies with damaged mechanical interlocks, where safety cannot be assured by repair',
    'Contactors with welded or heavily eroded contacts, which should be replaced rather than dressed',
    'Panels undersized for the present load, where the answer is replacement rather than repair',
    'Obsolete controllers and switch assemblies that are unobtainable',
    'Any situation where restoring function would require defeating the interlock',
  ],

  prevention: [
    'Exercise the transfer on a defined schedule, including a genuine simulated failure rather than a test button alone',
    'Record all thresholds and timer settings so unintended changes are detectable',
    'Confirm the mode selector is returned to auto after every intervention — make it a documented step',
    'Inspect contacts and re-torque terminations at service intervals',
    'Verify phase rotation after any upstream electrical work',
    'Seal panels against insect and rodent ingress and inspect for it at each visit',
    'Verify the generator-available signal path as part of routine testing, not only the set itself',
    'Thermally survey the panel under load annually',
  ],

  relatedSlugs: ['generator-cranks-but-will-not-start', 'generator-starts-in-manual-not-auto', 'ups-bypass-fault'],

  faq: [
    {
      q: 'The generator starts on a mains failure but the load never transfers. What does that tell me?',
      a: 'It cleanly separates two functions. The start signal is working, so the controller has correctly detected the mains failure. The transfer is not, so the problem lies in the generator-available signal, the acceptance criteria applied to the generator supply, a timer still running, or the transfer command and mechanism. That single observation eliminates half the possible causes immediately.',
    },
    {
      q: 'It transfers on test but not on a real mains failure. Why?',
      a: 'A test usually forces the sequence directly, bypassing the sensing that a genuine failure relies on. So the mechanism is proven good and the fault is almost certainly in sensing — a blown sensing fuse, an open sensing lead, or thresholds set so the controller does not regard the real condition as a failure. Compare what the controller reports against your own measurement at the same terminals.',
    },
    {
      q: 'Can I bypass the interlock to get the load back on?',
      a: 'No. The mechanical interlock exists to make it impossible to connect the utility and the generator together. Defeating it can back-feed the utility network and electrocute people working on supposedly dead lines. If the switch cannot be operated safely by its documented manual method, the correct action is to leave it and escalate.',
    },
    {
      q: 'It takes ages to transfer back to mains. Is something wrong?',
      a: 'Usually not — that is the return delay doing its job. It exists so the system does not transfer back onto a utility supply that has returned but is still unstable, and a cooldown period then lets the set run unloaded before stopping. Check the configured timers before treating it as a fault, and confirm they match what the site actually wants.',
    },
  ],

  references: [
    'IEC 60947-6-1 — low-voltage switchgear and controlgear: transfer switching equipment',
    'IEC 60364 — low-voltage electrical installations, including provisions for safety services and supplies',
    'ISO 8528 — generating sets, including control and switchgear considerations',
    'The ATS and controller manufacturer\'s documentation for the specific equipment, which is the only valid source for acceptance thresholds, timer functions, manual operation procedure and interlock arrangements referred to throughout',
  ],
};
