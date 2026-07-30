import type { RepairArticle } from '../types';

export const generatorUnstableVoltage: RepairArticle = {
  slug: 'generator-unstable-voltage',
  hub: 'generators',
  header: {
    title: 'Generator Voltage Unstable or Hunting — Diagnosis and Repair',
    equipmentCategory: 'Diesel generating set — voltage regulation and governing',
    appliesTo: 'Brushless and brushed synchronous alternators with electronic AVRs, on mechanically or electronically governed diesel sets',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate once the fault is correctly classified. The critical early step is separating a voltage problem from a speed problem, because they look identical on a voltmeter.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-29',
    electricalSystem: '240 V / 415 V 50 Hz output',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'Unstable output has two entirely different origins that present identically on a voltmeter, and the first job is to separate them. Watch voltage and frequency together. If both wander in step, the engine speed is unstable and this is a governing or fuelling problem — the AVR is faithfully following a machine whose speed is moving. If voltage wanders while frequency stays rock steady, the problem is in voltage regulation: the AVR, its sensing, or the excitation path. That single observation eliminates half the possible causes in seconds and stops the very common mistake of adjusting an AVR to compensate for a fuel restriction. Where instability appears only under load or only when a large load steps on, it is a response and stability problem rather than a component failure, and the answer is tuning and load management rather than replacement parts.',

  symptoms: {
    display: [
      'Voltage reading swinging above and below nominal rather than settling',
      'Frequency either wandering with the voltage, or holding steady while voltage moves — this distinction is the whole diagnosis',
      'Over-voltage or under-voltage protection operating intermittently',
      'Load-dependent instability that only appears above a certain load',
    ],
    indicators: [
      'Lighting on the load visibly flickering or pulsing',
      'Voltmeter needle or display oscillating at a regular rate',
      'AVR indicator activity where the AVR provides one',
      'Instability worsening as load increases, or appearing only during load changes',
    ],
    sounds: [
      'Engine note rising and falling in time with the voltage swing, which confirms a speed problem rather than a voltage one',
      'Engine note steady while voltage swings, which confirms a regulation problem',
      'Governor actuator audibly hunting',
      'Contactors or relays on the load chattering as voltage crosses their drop-out threshold',
    ],
    smells: [
      'Hot electronics smell around the AVR',
      'Overheated winding smell from the alternator, which warrants immediate shutdown',
    ],
    behaviour: [
      'Stable off-load and unstable under load, which points at response and stability rather than a failed component',
      'Unstable at all times including off-load, which points at sensing or a failing component',
      'Instability that began after an AVR replacement or a settings change',
      'Instability that appears only when a motor starts and settles afterwards, which is normal recovery rather than a fault if it settles quickly',
      'Worsening over weeks, which suggests brush wear, a deteriorating connection or a drifting component',
    ],
    visible: [
      'AVR condition and any sign of overheating',
      'Sensing wiring security and routing, particularly whether it runs alongside power cabling',
      'Brush length and slip ring condition on brushed machines',
      'Terminal connections for tightness and heat discolouration',
      'Governor linkage freedom and wear on mechanically governed sets',
    ],
  },

  whatItMeans: {
    plain:
      'The generator is producing power but the voltage will not hold steady. Either the engine speed is moving and the voltage is following it, or the engine is steady and the voltage control system is over- or under-correcting. Finding out which of those two it is takes one look at the frequency reading and immediately halves the problem.',
    technical:
      'Output voltage in a synchronous alternator depends on both the rotating field strength and the speed of rotation, so instability can originate in either the excitation control loop or the speed control loop. The two loops are independent but their symptoms overlap on a voltmeter, which is why frequency must be observed alongside voltage: frequency is proportional to speed and is unaffected by excitation, so it isolates the loops cleanly. Within the excitation loop, instability is characteristically a control-response problem — the AVR gain and stability settings determine how aggressively it corrects an error, and excessive gain produces sustained oscillation while insufficient gain produces sluggish recovery and voltage droop under load. Sensing quality matters equally: an AVR regulating on a noisy or intermittent sensing signal will chase the noise. Within the speed loop, hunting arises from governor gain, linkage wear or fuel delivery that cannot meet demand smoothly. Load characteristics contribute to both: motor starting draws heavy reactive current that depresses voltage transiently, and non-linear loads distort the waveform the AVR is trying to measure.',
  },

  causes: {
    mostLikely: [
      'AVR stability or gain settings incorrect, often after a replacement AVR was fitted without re-tuning',
      'Sensing wiring loose, damaged, or routed alongside power cabling and picking up interference',
      'Governor instability, with the voltage simply following an unstable engine speed',
      'Fuel supply restriction causing speed to hunt under load',
    ],
    possible: [
      'Brushes worn, sticking or with weak spring pressure on brushed machines, interrupting field current intermittently',
      'Load characteristics — large motor starting or a high proportion of non-linear load',
      'Loose connection in the excitation or sensing path creating an intermittent circuit',
      'AVR beginning to fail, with components drifting under temperature',
    ],
    lessCommon: [
      'One rotating rectifier diode failed, producing a periodic disturbance in the field',
      'Unbalanced loading across phases with single-phase sensing, so the AVR regulates on a phase that does not represent the machine',
      'Parallel operation with mismatched reactive droop settings, so machines fight each other',
      'Slip ring surface damage producing intermittent contact',
    ],
    modelSpecific: [
      'AVR stability adjustment method and the meaning of each trimmer differ between manufacturers and models — adjust only with the documentation for the AVR fitted',
      'Whether sensing is single-phase or three-phase changes behaviour markedly under unbalanced load',
      'Governor tuning parameters and their ranges are specific to the governor and engine',
      'Droop and cross-current compensation arrangements differ between machines intended for parallel operation',
    ],
    environmental: [
      'High ambient temperature causing AVR component drift',
      'Vibration loosening connections or affecting brush contact',
      'Moisture ingress causing intermittent sensing faults',
      'Dust on slip rings and brush gear',
    ],
    installation: [
      'Sensing cabling run in the same containment as power cabling, picking up interference',
      'Sensing taken from a point that does not represent the machine output',
      'Load with a high proportion of motor or rectifier content on a machine not specified for it',
      'Parallel installation commissioned without matching droop settings across sets',
    ],
    maintenance: [
      'Brushes never inspected or replaced on interval',
      'AVR settings changed without record, leaving no baseline to return to',
      'Connections never re-torqued or thermally checked',
      'Machine never load-tested, so instability only appears during a real outage',
    ],
    componentLevel: [
      'AVR internal component drift or failure',
      'Rotating rectifier diode partially failed',
      'Sensing transformer or resistor network fault within the AVR',
      'Speed sensing signal noisy, affecting an AVR with under-frequency roll-off',
    ],
  },

  safety: {
    isolation: [
      'Treat generator output terminals as lethal at all times',
      'Isolate and lock off before working in the terminal box or on the AVR',
      'Prove dead at the point of work, remembering back-feed from the load side or a parallel source is possible',
    ],
    lockoutTagout: [
      'Lock off the output breaker and the engine start circuit, and tag both',
      'On paralleled installations, prove dead on every possible source',
      'Retain the only key with the person working',
    ],
    ppe: [
      'Arc-rated clothing and face protection appropriate to the prospective fault energy for any live measurement',
      'Insulated tools rated for the system voltage',
      'Eye protection in the terminal box',
      'No watches, rings or metal bracelets',
    ],
    storedEnergy: [
      'The exciter field is inductive and produces a voltage spike if interrupted while energised',
      'AVR capacitors may retain charge — allow the manufacturer\'s discharge period',
      'Any parallel source can back-feed the machine',
    ],
    specificHazards: [
      'Tuning an AVR requires the set running with live terminals. Plan every adjustment and measurement before starting, and never improvise at a live terminal strip.',
      'NEVER open-circuit a current transformer secondary while primary current flows. Short the secondary before disconnecting.',
      'Unstable voltage can damage connected equipment — disconnect sensitive load before extended testing',
      'Over-voltage excursions during tuning can be severe; ensure protection is functional before adjusting',
    ],
    stopAndCallProfessional: [
      'You cannot make live measurements safely with rated instruments and appropriate PPE',
      'The machine is over-voltaging rather than merely wandering, which risks connected equipment',
      'Instability persists after sensing, brushes and governing have been eliminated',
      'The installation involves parallel operation and the interaction between machines is unclear',
      'There is any smell of overheated insulation',
    ],
  },

  tools: [
    { tool: 'Power quality meter or recorder', why: 'Observing voltage and frequency together over time — the measurement that classifies the fault' },
    { tool: 'True-RMS digital multimeter rated for the system', why: 'Sensing voltages, excitation output and phase-by-phase measurement' },
    { tool: 'Oscilloscope', why: 'Characterising the oscillation and identifying noise on the sensing signal' },
    { tool: 'Clamp meter', why: 'Load current per phase and balance assessment' },
    { tool: 'Tachometer', why: 'Independent speed measurement to confirm what frequency is reporting' },
    { tool: 'Load bank where available', why: 'Applying controlled, repeatable load steps rather than relying on site load' },
    { tool: 'Thermal camera or infrared thermometer', why: 'Finding a resistive connection in the sensing or excitation path' },
    { tool: 'Appropriate arc-rated PPE and insulated tools', why: 'Any measurement or adjustment at live terminals' },
  ],

  decisionTree: [
    { question: 'Do voltage and frequency wander together, in step?', yes: 'This is a SPEED problem. Work governing and fuel delivery; do not adjust the AVR.', no: 'Frequency steady with voltage moving is a REGULATION problem — continue' },
    { question: 'Is the instability present off-load as well as on load?', yes: 'Points at sensing, brushes or a failing component', no: 'Load-dependent instability points at stability tuning, load characteristics or capability' },
    { question: 'Did the instability begin after an AVR replacement or a settings change?', yes: 'Almost certainly tuning. Restore commissioned settings and re-tune methodically.', no: 'Continue' },
    { question: 'Is the sensing wiring secure, undamaged and routed away from power cabling?', yes: 'Continue', no: 'Correct the sensing circuit first — an AVR regulating on a noisy signal will chase the noise' },
    { question: 'On a brushed machine, are the brushes and slip rings in good condition?', yes: 'Continue', no: 'Replace brushes and service the rings; intermittent field current produces exactly this symptom' },
    { question: 'Is the load balanced across phases, and is sensing single- or three-phase?', yes: 'Continue', no: 'Unbalanced load with single-phase sensing makes the AVR regulate on an unrepresentative phase' },
    { question: 'Does the instability appear only when a large motor starts, and settle afterwards?', yes: 'This is transient recovery, not a fault, if it settles promptly — consider soft starting or step loading', no: 'Continue' },
    { question: 'Does careful AVR stability adjustment resolve it?', yes: 'Record the final settings as the new baseline', no: 'Test the rotating rectifier and consider AVR replacement' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Classify the fault: watch voltage and frequency together',
      inspect: 'Voltage and frequency simultaneously over a period, ideally recorded',
      where: 'At the generator output',
      instrument: 'Power quality meter or recorder',
      expected: 'A clear answer as to whether frequency moves with the voltage',
      ifAbnormal: 'Both moving together means speed instability and the AVR is innocent. Frequency steady with voltage moving means regulation. This single step eliminates half the possible causes.',
      next: 'Speed problem go to Step 2; regulation problem go to Step 3',
      warning: 'Live terminals. Use rated instruments and appropriate PPE.',
    },
    {
      step: 2,
      title: 'Where speed is unstable, work governing and fuel before touching the AVR',
      inspect: 'Governor linkage freedom, actuator response, fuel supply pressure and filter condition',
      where: 'Governor and fuel system',
      instrument: 'Service tool, low-pressure fuel gauge, visual inspection',
      expected: 'Free linkage, stable actuator response, supply pressure within specification',
      ifAbnormal: 'Fuel restriction causes speed to hunt, which drags voltage with it. Adjusting the AVR here treats a symptom and makes the machine harder to tune later.',
      next: 'Correct governing and fuel, then re-assess from Step 1',
      verify: 'Governor tuning parameters and their commissioned values for this engine and governor.',
    },
    {
      step: 3,
      title: 'Inspect and verify the sensing circuit',
      inspect: 'Sensing wiring security, damage, routing and the sensing voltage at the AVR',
      where: 'Terminal box and AVR terminals',
      instrument: 'True-RMS multimeter, visual inspection',
      expected: 'Secure wiring, sensing voltage consistent with machine output, routing separated from power cabling',
      ifAbnormal: 'A loose sensing connection or interference pickup makes the AVR chase a signal that is not real. This is a very common and entirely fixable cause.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Establish whether instability is load-dependent',
      inspect: 'Behaviour off-load, at part load and at higher load, applied in controlled steps',
      where: 'Output, with load applied progressively',
      instrument: 'Load bank if available, clamp meter, power quality meter',
      expected: 'A clear characterisation of when the instability appears',
      ifAbnormal: 'Instability only under load points at stability tuning or capability. Instability off-load as well points at sensing, brushes or a component fault.',
      next: 'Step 5',
      warning: 'Disconnect sensitive load before deliberately testing an unstable machine.',
    },
    {
      step: 5,
      title: 'On brushed machines, inspect brush gear and slip rings',
      inspect: 'Brush length, spring pressure, seating, and slip ring surface',
      where: 'Brush gear at the non-drive end, machine stopped and isolated',
      instrument: 'Inspection light, brush length measurement',
      expected: 'Adequate length, even wear, correct spring pressure, clean rings',
      ifAbnormal: 'Intermittent brush contact interrupts field current and produces oscillation that no amount of AVR tuning will cure.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Assess load balance and sensing arrangement together',
      inspect: 'Current on each phase, and whether AVR sensing is single- or three-phase',
      where: 'Output, and the AVR sensing configuration',
      instrument: 'Clamp meter and AVR documentation',
      expected: 'Reasonably balanced load, with sensing appropriate for the load profile',
      ifAbnormal: 'Heavy unbalance with single-phase sensing makes the AVR regulate on a phase unrepresentative of the machine, producing apparent instability on the others.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Characterise the oscillation before adjusting anything',
      inspect: 'The rate and shape of the voltage oscillation',
      where: 'Output, captured over time',
      instrument: 'Oscilloscope or power quality recorder',
      expected: 'A measurable oscillation frequency and amplitude, recorded before any change is made',
      ifAbnormal: 'A regular sustained oscillation suggests excessive gain. A slow drift suggests insufficient gain or a thermal effect. Recording it first is what makes tuning verifiable rather than guesswork.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Adjust AVR stability methodically, one parameter at a time',
      inspect: 'Response to each adjustment, recorded',
      where: 'AVR stability and gain adjustment per the AVR documentation',
      instrument: 'Small insulated adjustment tool, power quality meter, appropriate PPE',
      expected: 'Oscillation damping out with stable regulation across the load range',
      ifAbnormal: 'If no setting gives stable regulation, the problem is not tuning. Return the settings to the recorded baseline and investigate components.',
      next: 'Step 9',
      warning: 'Adjustment is made at a live AVR on a running machine. Plan each move, use an insulated tool, and change one parameter at a time.',
      verify: 'Which trimmer does what, and its permitted range, for the specific AVR fitted. Do not assume from another model.',
    },
    {
      step: 9,
      title: 'Test the rotating rectifier where tuning does not resolve it',
      inspect: 'Each diode in the rotating rectifier assembly',
      where: 'Rectifier assembly, machine stopped and secured against rotation',
      instrument: 'Multimeter on diode range',
      expected: 'Each diode conducting one way only',
      ifAbnormal: 'A partially failed diode disturbs the field periodically and produces instability that survives every tuning attempt.',
      next: 'Replace failed components, then validate',
      warning: 'Never inspect a rotating rectifier while the machine turns.',
    },
    {
      step: 10,
      title: 'On paralleled sets, check droop and compensation settings across machines',
      inspect: 'Reactive droop or cross-current compensation on every set in the scheme',
      where: 'Each AVR and controller in the installation',
      instrument: 'Service tool and power quality meter',
      expected: 'Matched settings across all machines',
      ifAbnormal: 'Mismatched reactive droop makes machines fight each other, and the instability appears on the bus rather than on any one machine.',
      next: 'Match the settings and re-test the scheme under load',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Connections and sensing',
      steps: [
        'Re-make and torque loose sensing and excitation connections',
        'Re-route sensing cabling away from power cabling and restore any screening',
        'Clean and protect terminals showing corrosion or heat discolouration',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Brush gear and rectifier',
      steps: [
        'Replace worn brushes as a set and service the slip rings',
        'Replace failed rotating rectifier diodes and the surge suppressor together',
      ],
    },
    {
      level: 'configuration',
      title: 'Tuning',
      steps: [
        'Restore AVR settings to the commissioned baseline before attempting to re-tune',
        'Adjust stability and gain one parameter at a time, recording each change and its effect',
        'Re-tune governing where speed instability was the origin',
        'Match reactive droop across all machines in a parallel scheme',
      ],
      note: 'Tuning without a recorded baseline is how a marginal machine becomes an untunable one. Record before you adjust.',
    },
    {
      level: 'mechanical',
      title: 'Governing and fuel',
      steps: [
        'Free or replace a binding governor linkage',
        'Correct fuel restriction causing speed hunting',
        'Replace a governor actuator that cannot respond smoothly',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'AVR and windings',
      steps: [
        'Replace the AVR once sensing, brushes, rectifier and governing are eliminated',
        'Refer suspected winding faults for professional assessment with insulation test results',
      ],
    },
  ],

  validation: [
    'Confirm voltage holds at setpoint off-load with no visible oscillation',
    'Apply load in steps and confirm regulation holds within limits at each step',
    'Record voltage recovery time after a load step and confirm it settles promptly without overshoot',
    'Start the largest motor load and confirm the transient dip recovers cleanly',
    'Measure voltage on all three phases and confirm balance',
    'Confirm frequency remains steady throughout, proving the speed loop is also stable',
    'Record the final AVR and governor settings as the new commissioned baseline',
    'Thermal-check sensing and excitation connections after a period at load',
  ],

  whenNotToRepair: [
    'Winding faults confirmed by insulation testing on an older machine where rewind approaches replacement cost',
    'Repeated rotating rectifier failure where the underlying cause has not been established',
    'Obsolete AVRs with no available replacement or equivalent',
    'A machine that has never been stable because it is fundamentally undersized or mismatched for the load profile — that is a sizing problem, not a repair',
    'Persistent instability in a parallel scheme that was never correctly commissioned, where re-commissioning the scheme is the actual work',
  ],

  prevention: [
    'Record AVR and governor settings at commissioning, so there is always a known-good baseline to return to',
    'Load-bank test annually and record regulation and recovery, so drift is visible',
    'Inspect brush gear on interval for brushed machines',
    'Keep sensing cabling separated from power cabling at installation',
    'Re-torque and thermal-check terminations at every service',
    'Apply soft starting to large motor loads at design stage rather than tuning around them later',
    'Match droop settings across paralleled machines and record them',
  ],

  relatedSlugs: ['generator-avr-fault-diagnosis', 'generator-produces-no-voltage-output', 'generator-starts-then-stops'],

  faq: [
    {
      q: 'The voltage is swinging. Should I adjust the AVR?',
      a: 'Not until you have looked at the frequency. If frequency is swinging with the voltage, the engine speed is unstable and the AVR is doing its job correctly by following it. Adjusting the AVR in that situation masks a fuel or governing fault and makes the machine harder to tune once the real fault is fixed.',
    },
    {
      q: 'It became unstable right after a new AVR was fitted. Is the new AVR faulty?',
      a: 'Usually not. A replacement AVR arrives with default settings that are rarely correct for the specific machine and load. It needs tuning to the machine. Start from the manufacturer\'s recommended starting point and adjust one parameter at a time, recording each change.',
    },
    {
      q: 'The voltage dips badly when the borehole pump starts. Is that a fault?',
      a: 'A transient dip on motor starting is normal and expected — the motor draws heavy current briefly. It is only a fault if the dip is excessive, if it does not recover promptly, or if it causes contactors to drop out. If recovery is slow, look at AVR response and at whether the set is adequately sized for the starting load.',
    },
    {
      q: 'Only one phase is unstable. What does that suggest?',
      a: 'Look at load balance and at how the AVR senses. With single-phase sensing and heavily unbalanced load, the AVR regulates on one phase and the others follow as best they can. Rebalancing the load, or moving to three-phase sensing where the machine supports it, addresses the cause rather than the symptom.',
    },
  ],

  references: [
    'IEC 60034-1 — rotating electrical machines, rating and performance',
    'IEC 60034-16 — excitation systems for synchronous machines',
    'ISO 8528-5 — generating sets, performance classes and load acceptance',
    'IEEE 519 — harmonic control, relevant where non-linear load distorts the waveform the AVR senses',
    'The AVR and governor manufacturer\'s documentation for the specific units, which defines each adjustment and its permitted range',
  ],
};
