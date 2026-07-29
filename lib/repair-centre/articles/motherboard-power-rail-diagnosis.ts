import type { RepairArticle } from '../types';

export const motherboardPowerRailDiagnosis: RepairArticle = {
  slug: 'motherboard-power-rail-diagnosis',
  hub: 'pcb-motherboards',
  header: {
    title: 'Industrial Motherboard Power-Rail Diagnosis — Dead Control Board',
    equipmentCategory: 'Industrial control motherboards — supply, sequencing and reset',
    appliesTo: 'Control motherboards in generator controllers, inverter and UPS control sections, drives and industrial control panels. Method is general; every rail voltage must come from the board reference or regulator data.',
    difficulty: 'specialist',
    diagnosisComplexity: 'High. A board with all rails present and a processor held in reset looks identical to a board with no supply at all.',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'EmersonEIMS Engineering — pending named reviewer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Board supply per design; all work with the board isolated and the bus proven discharged',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Work along the supply chain in order rather than jumping to the processor. Confirm the input reaching the board, then each regulator output in turn, because a board is only alive when every rail it depends on is present, correct and in the right order. Three findings account for most dead control boards. First, the input never arrives — an upstream fuse, connector or auxiliary supply, which is outside the board entirely. Second, one regulator is not producing its rail: establish whether the regulator has failed or whether something downstream is loading it down, by isolating the load and seeing whether the rail recovers, because replacing a regulator that was correctly refusing to feed a short achieves nothing. Third — and the one most often missed — every rail is present and correct but the board is still dead because the processor is being held in reset, either by a supervisor responding to a marginal rail, by a sequencing fault where rails came up in the wrong order, or by a watchdog. A board with good rails and no activity is a reset or clock problem, not a supply problem, and that distinction saves a great deal of wasted work. Take every expected rail voltage from the board reference or the regulator data sheet — never assume one.',

  symptoms: {
    display: [
      'Controller or panel completely dead with no display and no backlight',
      'Display backlight present but no content, which indicates supply is partly working',
      'Board powers momentarily then shuts down',
      'Repeated restart cycling, which is a strong indicator of a marginal rail or watchdog reset',
    ],
    indicators: [
      'No LED activity at all',
      'Power LED lit but no operation, which is the classic held-in-reset signature',
      'Communication indicators inactive while power indicators are lit',
    ],
    sounds: [
      'Squealing or ticking from an upstream switched-mode supply attempting to feed a fault',
      'Relay chattering as a marginal rail causes repeated reset',
      'Complete silence',
    ],
    smells: [
      'Burnt-electronics smell, indicating a failed component rather than a supply absence',
      'No smell at all, which is common and does not rule out a fault',
    ],
    behaviour: [
      'Dead after a supply disturbance, surge or lightning event',
      'Dead after water or condensation ingress',
      'Works when cold and fails when warm, or the reverse, which points at a marginal component rather than a hard failure',
      'Restarts repeatedly in a cycle rather than staying dead, which indicates reset or brown-out rather than a missing rail',
      'Failed immediately after a firmware update or configuration change',
    ],
    visible: [
      'Bulged, vented or leaking capacitors',
      'Discoloured regulators or components showing heat damage',
      'Corrosion, water staining or dendrite growth',
      'Damaged or corroded connectors and edge contacts',
      'Cracked components or fractured tracks, particularly where the board is subject to vibration',
      'Evidence of previous repair work',
    ],
  },

  whatItMeans: {
    plain:
      'The control board needs several different supply voltages to work, produced on the board itself from one incoming supply. If any one of them is missing or wrong, the board does nothing — and it looks exactly the same as a board with no power at all. It is also possible for every supply to be correct while the board still does nothing, because the processor is being deliberately held stopped. Working along the chain in order tells you which of those you have.',
    technical:
      'An industrial control motherboard derives multiple rails from a single input, typically through a combination of switching and linear regulators, each feeding a defined group of devices. Correct operation requires every rail to be present, within tolerance, and in many designs to appear in a specified sequence, since applying a rail to a device whose other supply is absent can forward-bias internal protection structures and cause latch-up or damage. Most designs include a supervisor or reset controller that holds the processor in reset until the rails are valid, and releases it only when they are. This produces the diagnostically important case of a board with entirely correct rails that does nothing at all, because the supervisor is asserting reset — from a rail that is marginal rather than absent, from a sequencing fault, from a brown-out condition, or from a watchdog repeatedly resetting a processor that is not executing. A rail that is low rather than absent must be attributed correctly: a failed regulator and a healthy regulator correctly current-limiting into a downstream short present the same symptom at the rail, and are distinguished by isolating the load rather than by measuring harder. Because rail voltages, sequencing requirements and supervisor thresholds are entirely design-specific, every expected value must come from the board reference or the regulator data sheet; there is no general set of correct voltages for industrial control boards.',
  },

  causes: {
    mostLikely: [
      'Input supply not reaching the board — upstream fuse, connector or auxiliary supply',
      'One regulator failed, so its rail is absent or low',
      'Downstream short loading a rail down, with the regulator behaving correctly',
      'Failed capacitor on a rail, causing instability or brown-out',
    ],
    possible: [
      'Supervisor or reset controller holding the processor in reset',
      'Power sequencing fault, where rails appear in the wrong order',
      'Connector or edge contact corrosion interrupting the input',
      'Crystal or clock circuit fault, so the processor has power but cannot execute',
    ],
    lessCommon: [
      'Processor or logic device failed',
      'Firmware corrupted or absent after a failed update',
      'Track or via fracture interrupting a rail',
      'Watchdog repeatedly resetting due to a software or configuration fault',
      'Multilayer plane fault',
    ],
    modelSpecific: [
      'Rail voltages, count and topology are entirely design-specific — take every value from the board reference or regulator data sheet',
      'Sequencing requirements differ; some boards tolerate any order and others do not',
      'Supervisor thresholds and reset behaviour are design-specific',
      'Some boards require an external enable or permissive before rails will come up at all',
      'Firmware recovery procedures, where they exist, are manufacturer-specific and must not be improvised',
    ],
    environmental: [
      'Water ingress, condensation and humidity',
      'Conductive or corrosive dust',
      'High ambient temperature shortening capacitor life, which is a leading cause of marginal rails',
      'Vibration causing track fracture and component cracking',
      'Insect ingress in equipment left standing',
    ],
    installation: [
      'Inadequate ingress protection for the environment',
      'No surge protection on incoming supplies',
      'Auxiliary supply undersized or shared with a noisy load',
      'Boards installed without ESD precautions',
    ],
    maintenance: [
      'Enclosure seals and filters never inspected',
      'Capacitor ageing never anticipated on equipment in long service',
      'Connectors never inspected or reseated',
      'Firmware and configuration not backed up before changes',
    ],
    componentLevel: [
      'Regulator failed',
      'Electrolytic capacitor degraded or failed',
      'Supervisor or reset device failed',
      'Crystal oscillator failed',
      'Processor or logic device failed',
    ],
  },

  safety: {
    isolation: [
      'Isolate every supply to the equipment before removing or working on a board',
      'Where the board sits within a power converter, prove the DC bus discharged before any work',
      'Batteries and solar sources cannot be switched off and must be isolated separately',
      'Prove dead at the board immediately before starting',
    ],
    lockoutTagout: [
      'Lock and tag every source feeding the equipment',
      'Where the board controls plant that can start, confirm that plant cannot be started while work is in progress',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'ESD wrist strap and mat for all handling, without exception',
      'Eye protection when injecting current or working with capacitors',
      'Appropriate protection and fume extraction for soldering and rework',
      'Insulated tools where adjacent circuits may remain live',
    ],
    storedEnergy: [
      'Supply and bus capacitors retain charge after disconnection — measure and confirm rather than relying on elapsed time',
      'Large capacitors can recover charge; re-check before each session',
      'Where the board is part of a converter, the main DC bus is the dominant hazard, not the board rails',
    ],
    specificHazards: [
      'Some measurements genuinely require the board powered. Powered probing carries real risk of slipping and shorting adjacent pins, which destroys working devices — use appropriate probes and take the time to do it properly.',
      'ESD damage produces devices that pass on the bench and fail weeks later in service',
      'Never inject a rail at full current to "see what happens" — use a current-limited supply',
      'A control board may command plant to start when it recovers; ensure driven equipment is safe before restoring operation',
      'Do not attempt firmware recovery by improvised means — a partly programmed device may be unrecoverable',
    ],
    stopAndCallProfessional: [
      'Firmware is corrupt or absent and no documented recovery procedure is available',
      'The fault is inside a multilayer board',
      'The board carries safety-critical protection functions that cannot be validated after repair',
      'No board reference is available and the board is dense or multilayer',
      'Processor or ASIC failure is established',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter', why: 'Rail voltages measured in sequence along the supply chain' },
    { tool: 'Oscilloscope', why: 'Seeing rail behaviour at power-up, reset assertion and clock activity — none of which a multimeter can show' },
    { tool: 'Current-limited bench power supply', why: 'Feeding a rail safely to establish whether it is shorted, and bringing the board up without damage' },
    { tool: 'ESR meter', why: 'Degraded capacitors are a leading cause of marginal rails and rarely look faulty' },
    { tool: 'Thermal camera', why: 'Finding an overloaded regulator or a shorted downstream device' },
    { tool: 'Freeze spray and a heat source', why: 'Provoking a temperature-dependent fault that only appears warm or cold' },
    { tool: 'Magnification and good lighting', why: 'Corrosion, cracked components and fractured tracks' },
    { tool: 'ESD wrist strap and mat', why: 'Mandatory for all board handling' },
    { tool: 'Board reference, schematic or regulator data sheets', why: 'The only valid source for which rails exist and what each should measure' },
  ],

  decisionTree: [
    { question: 'Has every supply been isolated and the bus proven discharged?', yes: 'Continue', no: 'Stop until the bus is proven dead with a meter.' },
    { question: 'Is there visible ingress, corrosion or contamination?', yes: 'Clean and dry thoroughly, then re-assess before removing components', no: 'Continue' },
    { question: 'Is the input supply actually arriving at the board connector?', yes: 'Continue', no: 'The fault is upstream — fuse, connector or auxiliary supply, not the board' },
    { question: 'Are all rails present and within tolerance per the board reference?', yes: 'A dead board with good rails is a RESET, CLOCK or firmware problem — not a supply problem', no: 'Continue' },
    { question: 'For a missing rail: does it recover when its downstream load is isolated?', yes: 'The regulator is healthy and something downstream is shorted — find that, do not replace the regulator', no: 'The regulator itself has failed' },
    { question: 'Is the processor being held in reset?', yes: 'Trace why — marginal rail, sequencing, brown-out or watchdog', no: 'Continue' },
    { question: 'Is the clock oscillating?', yes: 'Suspect firmware or the processor itself', no: 'Crystal or oscillator circuit fault — the processor cannot execute without it' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Isolate, discharge and inspect',
      inspect: 'Bus discharge, then board condition under magnification',
      where: 'At the bus, then across both sides of the board',
      instrument: 'Multimeter and magnification',
      expected: 'Bus proven dead; a documented picture of board condition',
      ifAbnormal: 'Bulged capacitors, corrosion and heat-discoloured regulators direct the whole investigation. Photograph before cleaning.',
      next: 'Step 2',
      warning: 'Do not rely on elapsed time for capacitor discharge — measure it.',
    },
    {
      step: 2,
      title: 'Confirm the input actually reaches the board',
      inspect: 'Supply at the board connector, on the board side of the connector',
      where: 'At the input connector pins',
      instrument: 'True-RMS multimeter',
      expected: 'Correct input supply present',
      ifAbnormal: 'Measure on the board side of the connector, not on the harness. Corroded or partially mated connectors and edge contacts read fine on one side and nothing on the other, and this is a frequent finding.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Identify the rails from the reference, then measure each in turn',
      inspect: 'Every rail the board generates, at a defined test point',
      where: 'At each regulator output',
      instrument: 'True-RMS multimeter',
      expected: 'Each rail at its documented value',
      ifAbnormal: 'Work along the chain in order rather than jumping to the processor. A single missing rail explains a completely dead board.',
      next: 'Step 4',
      verify: 'Which rails exist and what each should measure — from the board reference or regulator data sheet. There is no general set of correct voltages for control boards, and assuming one will mislead you.',
    },
    {
      step: 4,
      title: 'For a missing or low rail, distinguish regulator from load',
      inspect: 'Whether the rail recovers when its downstream load is isolated',
      where: 'At the regulator output, with the load progressively disconnected',
      instrument: 'Multimeter, current-limited supply',
      expected: 'A clear answer as to which side of the regulator the fault is on',
      ifAbnormal: 'A failed regulator and a healthy regulator correctly limiting into a downstream short look identical at the rail. Replacing a regulator that was doing its job correctly wastes the part and leaves the fault.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Assess the rail capacitors',
      inspect: 'Capacitance and equivalent series resistance on each rail',
      where: 'At the bulk and decoupling capacitors',
      instrument: 'ESR meter',
      expected: 'Consistent, healthy readings',
      ifAbnormal: 'Degraded capacitors produce marginal rails that cause brown-out resets and intermittent behaviour, and they frequently look perfectly normal. This is a leading cause on boards that have been in service for years in warm environments.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Observe rail behaviour at power-up',
      inspect: 'The order and timing in which rails appear, and whether any sags or oscillates',
      where: 'On each rail, at the moment of power-up',
      instrument: 'Oscilloscope',
      expected: 'Rails rising cleanly and in the documented order',
      ifAbnormal: 'A multimeter reading taken after the event cannot show a sequencing fault, a rail that sags momentarily, or a rail that oscillates. This step finds faults that static measurement cannot.',
      next: 'Step 7',
      warning: 'Powered probing risks slipping and shorting adjacent pins. Use proper probes and take the time to do it safely.',
    },
    {
      step: 7,
      title: 'Check whether the processor is held in reset',
      inspect: 'Reset line state, and whether it releases after the rails become valid',
      where: 'At the supervisor or reset device output',
      instrument: 'Oscilloscope',
      expected: 'Reset asserted at power-up then released cleanly',
      ifAbnormal: 'A board with correct rails and a permanently asserted reset is not a supply fault at all. Repeated reset pulses indicate a watchdog resetting a processor that is not executing, or a rail marginal enough to trip the supervisor.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Confirm the clock before condemning the processor',
      inspect: 'Whether the oscillator is running',
      where: 'At the crystal or oscillator circuit',
      instrument: 'Oscilloscope with an appropriate probe',
      expected: 'Clean oscillation at the design frequency',
      ifAbnormal: 'A processor with correct rails and released reset still does nothing without a clock. Confirm the clock before concluding the processor or firmware has failed — this order avoids condemning an expensive device that was never at fault.',
      next: 'Refer firmware and processor faults for manufacturer-level support',
      warning: 'Probing a crystal can stop it oscillating. Use an appropriate low-capacitance probe and interpret the result accordingly.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Connectors and contamination',
      steps: [
        'Clean and reseat connectors and edge contacts; clean corrosion back properly rather than only reseating',
        'Clean and fully dry boards affected by ingress before condemning components',
        'Repair fractured tracks, particularly on boards subject to vibration',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Supply components',
      steps: [
        'Replace degraded capacitors identified by ESR testing, not only visibly failed ones',
        'Replace failed regulators only after confirming the load is not the cause',
        'Replace a failed supervisor or oscillator with the correct part',
        'Re-measure the rail after each replacement rather than changing several parts blind',
      ],
    },
    {
      level: 'board-level',
      title: 'Board repair',
      steps: [
        'Remove carbonised material and reconstruct damaged tracks',
        'Repair lifted pads properly',
        'Clean flux residue and restore conformal coating where the original had it',
      ],
    },
    {
      level: 'firmware',
      title: 'Firmware and configuration',
      steps: [
        'Restore firmware only by the manufacturer\'s documented procedure',
        'Restore configuration from a backup where one exists, and record the configuration afterwards',
      ],
      note: 'Do not improvise firmware recovery. A partly programmed device may become unrecoverable.',
    },
    {
      level: 'board-replacement',
      title: 'When the board goes',
      steps: [
        'Replace where the processor has failed, firmware is unobtainable, or a multilayer fault exists',
        'Replace safety-critical boards that cannot be fully validated after repair',
      ],
    },
  ],

  validation: [
    'Confirm every rail is present, within tolerance and in the correct sequence at power-up',
    'Confirm reset asserts and releases cleanly, with no repeated resetting',
    'Confirm the clock is running',
    'Bring the board up current-limited and confirm expected current draw before returning it to the equipment',
    'Thermal-survey the board in operation; an unexpectedly warm device indicates a remaining fault',
    'Confirm the equipment functions correctly as a whole, including its outputs and protection functions',
    'Where the board controls plant, verify it commands that plant correctly and safely before returning to service',
    'Run for an extended period, including from cold, since marginal faults reappear on a cold start',
    'Document rails measured, components replaced and the root cause identified',
  ],

  whenNotToRepair: [
    'Processor or ASIC failure where firmware is unobtainable',
    'Corrupt firmware with no documented recovery route',
    'Multilayer internal faults',
    'Carbonised substrate',
    'Safety-critical control boards that cannot be validated after repair',
    'Severe corrosion across the assembly',
    'Where repair cost approaches board replacement value, particularly where a repaired board would carry unquantified risk',
  ],

  prevention: [
    'Maintain enclosure sealing and filters appropriate to the environment',
    'Control panel temperature — capacitor life is strongly temperature-dependent and warm panels age boards quickly',
    'Fit and maintain surge protection on incoming supplies',
    'Back up firmware and configuration before any change, and keep the backup where it can be found',
    'Handle and store boards with ESD precautions',
    'Inspect and reseat connectors at service intervals in high-vibration installations',
    'Treat intermittent resets and restart cycling as early warnings rather than nuisances — they usually indicate a rail already going marginal',
  ],

  relatedSlugs: ['pcb-short-circuit-diagnosis', 'inverter-will-not-switch-on'],

  faq: [
    {
      q: 'All the rails measure correctly but the board is still dead. What now?',
      a: 'Then it is not a supply problem, and continuing to measure rails will not help. Check whether the processor is being held in reset — by a supervisor responding to a marginal rail, a sequencing fault, or a watchdog. Then confirm the clock is oscillating, because a processor with good rails and a released reset still does nothing without one. Those two checks resolve most boards that are dead with healthy supplies.',
    },
    {
      q: 'What voltage should each rail be?',
      a: 'Whatever the board reference or the regulator data sheet says for that specific board. There is no general set of correct rail voltages for industrial control boards, and assuming a familiar value will send you looking for a fault that does not exist. Identify the regulators, look up their outputs, and measure against those.',
    },
    {
      q: 'A rail is low. Should I replace the regulator?',
      a: 'Not yet. A failed regulator and a perfectly healthy regulator current-limiting into a downstream short look identical at the rail. Isolate the downstream load and see whether the rail recovers. If it does, the regulator was doing its job and the fault is the short — replacing the regulator would have wasted the part and left the fault in place.',
    },
    {
      q: 'The board keeps restarting in a loop. Is that different from being dead?',
      a: 'Yes, and it is a useful clue. Cycling indicates the board is getting far enough to start and then being reset — typically a rail that is marginal rather than absent, a brown-out condition, or a watchdog resetting a processor that is not executing properly. Look at rail behaviour on an oscilloscope at power-up rather than with a multimeter afterwards, because the event you need to see lasts milliseconds.',
    },
  ],

  references: [
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies',
    'IPC-A-610 — acceptability of electronic assemblies',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
    'IEC 61131-2 — programmable controllers: equipment requirements and tests, where the board forms part of a control system',
    'The board manufacturer\'s reference or schematic and the relevant regulator data sheets, which are the only valid source for rail identification, expected voltages, sequencing and supervisor behaviour referred to throughout',
  ],
};
