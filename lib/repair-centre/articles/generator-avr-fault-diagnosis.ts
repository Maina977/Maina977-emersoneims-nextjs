import type { RepairArticle } from '../types';

export const generatorAvrFaultDiagnosis: RepairArticle = {
  slug: 'generator-avr-fault-diagnosis',
  hub: 'generators',
  header: {
    title: 'AVR Fault Diagnosis — Before You Replace the Regulator',
    equipmentCategory: 'Generating set alternators — excitation and voltage regulation',
    appliesTo: 'Brushless self-excited and PMG-excited alternators on diesel generating sets, single- and three-phase',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate. The AVR is the most frequently replaced component in the excitation chain and the least frequently at fault.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Set output 240 V / 415 V 50 Hz nominal; excitation from main output or a separate PMG',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'The AVR is the component most often replaced and least often responsible. Before condemning it, check three things that account for the majority of apparent AVR failures. First, the sensing fuses and sensing leads: an AVR that cannot see the output voltage behaves exactly like a failed regulator, and a blown sensing fuse costs almost nothing to check. Second, engine speed — every AVR includes an under-frequency protection that deliberately reduces excitation when speed falls below a set threshold, so a set running slow produces low voltage because the regulator is working correctly, and turning the voltage adjustment up to compensate causes dangerous over-excitation once normal speed returns. Third, the rest of the excitation chain, because the AVR is only one link: residual magnetism, exciter field and armature, and the rotating rectifier all sit between the regulator and the output. The definitive separation is to excite the machine independently by the manufacturer\'s documented procedure — if it then produces controlled voltage, the alternator is sound and the fault is in the regulator or its sensing; if it does not, the AVR was never the problem.',

  symptoms: {
    display: [
      'No voltage output with the engine running normally',
      'Output voltage low and not responding to the voltage adjustment',
      'Output voltage high, sometimes rising until protection operates',
      'Voltage unstable, hunting or drifting',
      'Under-frequency or excitation alarm on the controller',
    ],
    indicators: [
      'AVR fault or excitation indicator on regulators that provide one',
      'Excitation trip on the controller',
      'Voltmeter showing only residual voltage — a small output that will not build',
    ],
    sounds: [
      'Engine speed noticeably low or surging, which changes the diagnosis entirely',
      'Alternator noise change under load, which may indicate a rotating rectifier problem',
      'Load equipment behaving erratically as voltage wanders',
    ],
    smells: [
      'Burnt varnish or insulation smell from the alternator, indicating winding overheating',
      'Burnt smell from the AVR itself or its enclosure',
      'Any burnt smell means stop and investigate before further running',
    ],
    behaviour: [
      'Voltage low and frequency also low — this is a speed problem, not a regulation problem',
      'Voltage low while frequency is correct — now regulation is genuinely implicated',
      'Voltage builds then collapses under load, which suggests excitation capacity or a rotating rectifier fault',
      'Voltage rises uncontrolled, which is a serious condition requiring immediate shutdown',
      'Fault appeared after a load rejection, overload, or after the set was run in an unusual configuration',
      'A replacement AVR failed quickly, which almost always means the real fault was elsewhere',
    ],
    visible: [
      'Sensing fuse condition — check this first',
      'AVR condition: burnt components, swollen capacitors, corrosion, moisture',
      'Sensing and excitation lead terminations',
      'Rotating rectifier diodes and surge suppressor condition where accessible',
      'Evidence of winding overheating or insulation discolouration',
      'Voltage adjustment potentiometer position, and whether it has been tampered with',
    ],
  },

  whatItMeans: {
    plain:
      'The Automatic Voltage Regulator keeps the generator output steady by adjusting how strongly the alternator is magnetised. When output voltage is wrong, the regulator gets the blame — but it can only regulate what it can measure and what the rest of the excitation system lets it control. Very often the regulator is doing exactly the right thing in response to a problem somewhere else, most commonly a blown sensing fuse or an engine running slow.',
    technical:
      'In a brushless machine the AVR controls current into the stationary exciter field. That produces a rotating field in the exciter armature, whose output is rectified by the rotating rectifier assembly turning with the shaft, and the resulting DC feeds the main rotor field, which induces voltage in the main stator. The regulator senses output voltage and adjusts exciter field current to hold the setpoint. Two consequences follow. First, the AVR depends entirely on its sensing input: if sensing is lost through a blown fuse or an open lead, the regulator sees near-zero output and drives excitation to maximum, or shuts down, depending on design — either way behaving like a failure while functioning correctly. Second, every element downstream of the regulator can produce symptoms indistinguishable from regulator failure, and a failed rotating rectifier diode is the classic case: the machine produces reduced and often unstable output that collapses under load. AVRs also implement an under-frequency or volts-per-hertz characteristic which reduces the voltage setpoint proportionally below a threshold speed, protecting the machine from over-fluxing at low frequency. A set running below rated speed therefore produces low voltage as designed. Raising the voltage adjustment to correct that is a serious error, because at restored rated speed the machine is then over-excited, and sustained over-excitation overheats the windings.',
  },

  causes: {
    mostLikely: [
      'Sensing fuse blown or sensing lead open — the single most common cause of apparent AVR failure',
      'Engine speed low, so the AVR is correctly reducing voltage through under-frequency protection',
      'Loss of residual magnetism, so the machine cannot begin to build voltage',
      'Loose or corroded excitation or sensing terminations',
    ],
    possible: [
      'Rotating rectifier diode failed, giving low or unstable output that collapses under load',
      'Voltage adjustment misadjusted or tampered with',
      'Exciter field winding open or shorted',
      'AVR itself failed',
    ],
    lessCommon: [
      'Main rotor field winding fault',
      'Stator winding fault',
      'Surge suppressor on the rotating rectifier failed, taking diodes with it',
      'Controller or protection settings causing an excitation trip that is not an AVR fault at all',
      'Incorrect AVR fitted or configured for a different machine',
    ],
    modelSpecific: [
      'AVR type, terminal designations, sensing arrangement and adjustment functions differ by manufacturer and model — take them from the alternator and AVR documentation for the machine in front of you',
      'Self-excited machines derive excitation from the main output; PMG-excited machines have an independent permanent magnet generator, and the diagnosis differs fundamentally between them',
      'Field flashing procedures are machine-specific and must never be applied to a PMG machine as a first step',
      'Under-frequency threshold and slope are configurable on many AVRs',
      'Stability and damping adjustments differ; adjusting them without understanding the machine can create instability',
    ],
    environmental: [
      'Moisture and condensation in the alternator or AVR enclosure',
      'Dust ingress causing tracking across the AVR or terminals',
      'High ambient temperature reducing AVR and winding life',
      'Vibration loosening terminations over time',
    ],
    installation: [
      'AVR mounted where it is exposed to vibration or heat beyond its rating',
      'Sensing leads routed alongside power cables, picking up interference',
      'Incorrect AVR fitted during an earlier repair',
      'Load with a very poor power factor or high harmonic content beyond the machine design',
    ],
    maintenance: [
      'Sensing fuses never inspected',
      'Terminations never re-torqued',
      'Insulation resistance never tested, so a developing winding fault is unnoticed',
      'Voltage and frequency never recorded at service, so gradual drift is invisible',
    ],
    componentLevel: [
      'Sensing fuse open',
      'Rotating rectifier diode failed open or short',
      'Surge suppressor failed',
      'Exciter field winding fault',
      'AVR output stage failed',
    ],
  },

  safety: {
    isolation: [
      'A running generator produces lethal voltage at the alternator terminals and inside the terminal box',
      'Stop the set and prevent automatic restart before working in the terminal box or on the AVR',
      'Isolate the output breaker and prove dead at the point of work',
      'Isolate and lock the starting battery — a set in auto can start without warning',
    ],
    lockoutTagout: [
      'Lock the control selector in stop, and tag it',
      'Disconnect and tag the starting battery',
      'Lock and tag the output breaker',
      'Tag any changeover control so auto operation is not restored while work proceeds',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy at the alternator terminals',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Hearing protection while the set is running',
    ],
    storedEnergy: [
      'Excitation circuits are inductive and can produce a substantial voltage when interrupted',
      'The starting battery remains live',
      'Rotating parts continue turning after shutdown',
    ],
    specificHazards: [
      'NEVER open-circuit a current transformer secondary while the machine is running and carrying load. A CT with an open secondary develops a dangerously high voltage across the break and can be lethal. Short CT secondaries before disturbing any connection in that circuit.',
      'Some diagnostic procedures require the set to be running with the terminal box open, which is live working — it must only be done by someone competent to do so, with the correct protection, or not at all',
      'Field flashing applies a source to the excitation circuit and must follow the manufacturer\'s documented procedure; never field-flash a PMG machine as a first step',
      'Uncontrolled over-voltage can damage connected equipment and injure people — shut down immediately rather than investigating a rising voltage while it runs',
      'Rotating rectifier inspection requires access to rotating parts; the set must be stopped and locked off',
    ],
    stopAndCallProfessional: [
      'Output voltage is rising uncontrolled',
      'There is a burnt insulation smell from the alternator',
      'Diagnosis requires live working in the terminal box beyond your competence',
      'A winding fault is suspected',
      'A replacement AVR has already failed, indicating an unresolved fault elsewhere',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the system voltage', why: 'Output, sensing and excitation measurements; a non-RMS meter misreads distorted waveforms' },
    { tool: 'Frequency meter or a multimeter that reads frequency reliably', why: 'Establishing whether the fault is speed or regulation — the first fork in the diagnosis' },
    { tool: 'Clamp meter', why: 'Excitation current, and load current when assessing behaviour under load' },
    { tool: 'Insulation resistance tester', why: 'Testing exciter and main windings where a winding fault is suspected' },
    { tool: 'Diode test capability on the multimeter', why: 'Checking rotating rectifier diodes, a common cause misattributed to the AVR' },
    { tool: 'Alternator and AVR documentation for the specific machine', why: 'Terminal designations, sensing arrangement and field-flashing procedure must be read, never assumed' },
    { tool: 'Insulated tools and arc-rated protection', why: 'Work in and around an alternator terminal box' },
  ],

  decisionTree: [
    { question: 'Is output voltage rising uncontrolled?', yes: 'Shut down immediately. Do not investigate while running.', no: 'Continue' },
    { question: 'Is there a burnt insulation smell from the alternator?', yes: 'Stop and escalate — suspect a winding fault', no: 'Continue' },
    { question: 'Are voltage AND frequency both low together?', yes: 'This is an engine speed problem. Correct speed first — the AVR is behaving correctly.', no: 'Continue' },
    { question: 'Are the sensing fuses intact and the sensing leads continuous?', yes: 'Continue', no: 'That explains it. An AVR that cannot sense output behaves exactly like a failed one.' },
    { question: 'Does the machine produce any residual voltage at all?', yes: 'Continue', no: 'Residual magnetism may be lost — field-flash by the manufacturer procedure, and never on a PMG machine as a first step' },
    { question: 'Do the rotating rectifier diodes test healthy?', yes: 'Continue', no: 'A failed diode produces low, unstable output that collapses under load, and is routinely blamed on the AVR' },
    { question: 'With independent excitation applied per the manufacturer procedure, does the machine produce controlled voltage?', yes: 'The alternator is sound — the fault is the AVR or its sensing', no: 'The alternator itself is at fault; the AVR was never the problem' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Measure voltage and frequency together',
      inspect: 'Output voltage and frequency at the same instant',
      where: 'Alternator output terminals or the control panel instruments',
      instrument: 'True-RMS multimeter with frequency capability',
      expected: 'Both at nominal',
      ifAbnormal: 'Both low together is an engine speed problem and the AVR is correctly reducing voltage through its under-frequency protection. Voltage low with correct frequency puts regulation genuinely in question. This single comparison redirects most of these jobs.',
      next: 'Step 2',
      warning: 'Never raise the voltage adjustment to compensate for low speed. At restored speed the machine is then over-excited and the windings overheat.',
    },
    {
      step: 2,
      title: 'Check the sensing fuses and leads',
      inspect: 'Sensing fuse continuity and the integrity of sensing leads to the AVR',
      where: 'AVR sensing circuit, set stopped and isolated',
      instrument: 'Multimeter on continuity',
      expected: 'Fuses intact, leads continuous and terminations tight',
      ifAbnormal: 'This is the most common cause of apparent AVR failure and the cheapest to check. Establish why a fuse blew rather than simply replacing it.',
      next: 'Step 3',
      verify: 'Which fuses are the sensing fuses on this specific machine — designations differ between manufacturers.',
    },
    {
      step: 3,
      title: 'Inspect the AVR and its environment',
      inspect: 'AVR for burnt components, swollen capacitors, moisture, dust tracking and secure terminations',
      where: 'At the AVR, set stopped and isolated',
      instrument: 'Inspection light and magnification',
      expected: 'Clean, dry, undamaged, all terminations tight',
      ifAbnormal: 'Moisture and dust tracking cause erratic regulation that comes and goes with weather. Note the voltage adjustment position before touching it.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Establish whether residual voltage is present',
      inspect: 'Whether the machine produces any small output at all when run',
      where: 'Output terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Some residual voltage present, from which the machine can build',
      ifAbnormal: 'No residual at all suggests lost residual magnetism. Field-flash strictly by the manufacturer\'s documented procedure for this machine.',
      next: 'Step 5',
      warning: 'Never field-flash a PMG-excited machine as a first step — the diagnosis for those machines is fundamentally different.',
    },
    {
      step: 5,
      title: 'Test the rotating rectifier',
      inspect: 'Each diode in the rotating rectifier assembly, and the surge suppressor',
      where: 'On the rotating assembly, set stopped and locked off',
      instrument: 'Multimeter on diode test',
      expected: 'Each diode conducting in one direction only, all consistent with each other',
      ifAbnormal: 'A failed diode gives reduced and often unstable output that collapses under load — symptoms routinely attributed to the AVR. Comparative testing across the diodes is valid without any absolute figure.',
      next: 'Step 6',
      warning: 'The set must be stopped and locked off; this work is on rotating parts.',
    },
    {
      step: 6,
      title: 'Test the exciter and main windings',
      inspect: 'Winding continuity and insulation resistance',
      where: 'Exciter field, exciter armature and main windings as accessible',
      instrument: 'Multimeter and insulation resistance tester',
      expected: 'Continuity as expected and insulation resistance healthy',
      ifAbnormal: 'A winding fault changes the job from regulator replacement to alternator repair. Take acceptance values from the machine documentation rather than a general figure.',
      next: 'Step 7',
      verify: 'Winding resistance and insulation acceptance values for this specific alternator, from the manufacturer data.',
    },
    {
      step: 7,
      title: 'Separate the AVR from the alternator by independent excitation',
      inspect: 'Whether the machine produces controlled output when excited independently of the AVR',
      where: 'Per the manufacturer\'s documented separate-excitation procedure',
      instrument: 'As specified by the manufacturer for this machine',
      expected: 'Controlled voltage produced, proving the alternator sound',
      ifAbnormal: 'This is the definitive separation. Voltage produced means the alternator is healthy and the fault is the AVR or its sensing; no voltage means the alternator is at fault and replacing the AVR would have achieved nothing.',
      next: 'Step 8',
      warning: 'Follow the manufacturer procedure exactly. Improvised excitation can damage windings and is dangerous.',
    },
    {
      step: 8,
      title: 'Only now replace the AVR — and confirm the cause',
      inspect: 'Correct AVR type and configuration for the machine, and the reason the original failed',
      where: 'At the AVR',
      instrument: 'Machine documentation',
      expected: 'Correct part, correctly configured, with the original failure explained',
      ifAbnormal: 'A replacement AVR that fails quickly means the real fault was never found. Do not fit a second one without investigating further.',
      next: 'Proceed to validation under load',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Sensing and terminations',
      steps: [
        'Replace blown sensing fuses with the correct type and rating, having established why they operated',
        'Repair or replace open or damaged sensing leads and re-route them away from power cables',
        'Clean and re-torque all excitation and sensing terminations',
        'Dry out and protect the AVR enclosure where moisture ingress is evident',
      ],
      note: 'This resolves a large proportion of jobs booked as AVR failures.',
    },
    {
      level: 'configuration',
      title: 'Speed and adjustment',
      steps: [
        'Correct engine speed to rated before making any voltage adjustment',
        'Set voltage to nominal at rated speed, using the adjustment as designed rather than to mask another fault',
        'Verify stability settings are appropriate to the machine before altering them',
      ],
      note: 'Setting voltage correct at low speed guarantees over-excitation at rated speed. Speed first, always.',
    },
    {
      level: 'component-replacement',
      title: 'Excitation chain components',
      steps: [
        'Replace failed rotating rectifier diodes as a complete set, together with the surge suppressor',
        'Replace the AVR only with the correct type for the machine, correctly configured',
        'Do not fit a substitute AVR of a different type without confirming compatibility with the excitation system',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Alternator repair',
      steps: [
        'Refer exciter and main winding faults for specialist alternator repair or rewind',
        'Provide the measurements, insulation test results and the separate-excitation result',
      ],
    },
  ],

  validation: [
    'Confirm rated speed and frequency before assessing voltage',
    'Confirm output voltage at nominal, balanced across phases, at no load',
    'Apply load progressively and confirm voltage holds within limits through load steps',
    'Confirm voltage recovery after a load step is prompt and without hunting',
    'Measure excitation current under load and confirm it is stable',
    'Thermally check the alternator and AVR after a sustained run',
    'Confirm no burnt smell or abnormal noise develops under sustained load',
    'Record voltage, frequency, load and excitation readings in the maintenance record',
  ],

  whenNotToRepair: [
    'Alternator windings with failed insulation, where rewind or replacement is the correct route',
    'Repeated AVR failure after replacement, which indicates an unresolved fault in the excitation chain or the load',
    'Obsolete alternators where AVRs and rotating rectifier components are unobtainable',
    'Machines that have been run over-excited long enough to damage insulation',
    'Where a substitute AVR of unknown compatibility is the only option — the risk of over-excitation is not worth it',
  ],

  prevention: [
    'Inspect sensing fuses at every service — they are trivial to check and a leading cause',
    'Record voltage, frequency and excitation current at each service so drift is visible',
    'Test insulation resistance periodically to catch a developing winding fault early',
    'Keep the terminal box and AVR enclosure sealed against moisture and dust',
    'Re-torque excitation and sensing terminations at service intervals',
    'Correct engine speed problems promptly, since running below rated speed stresses the whole excitation system',
    'Record the voltage adjustment position at commissioning so tampering is detectable',
  ],

  relatedSlugs: ['generator-produces-no-voltage-output', 'generator-unstable-voltage'],

  faq: [
    {
      q: 'The output voltage is low. Can I just turn the AVR adjustment up?',
      a: 'Not until you have checked frequency. If frequency is also low the engine is running slow, and the AVR is reducing voltage deliberately through its under-frequency protection. Turning the adjustment up masks that, and when the speed is restored the machine is over-excited — which overheats the windings. Fix the speed first, then set voltage at rated speed.',
    },
    {
      q: 'I fitted a new AVR and it failed within days. Why?',
      a: 'Because the AVR was almost certainly not the original fault. The commonest reasons are a fault elsewhere in the excitation chain — a failed rotating rectifier diode is the classic — or a sensing problem, or a machine being run at incorrect speed. Fitting a second AVR without finding the underlying cause usually destroys that one too.',
    },
    {
      q: 'How do I know whether it is the AVR or the alternator?',
      a: 'Excite the machine independently of the AVR using the manufacturer\'s documented procedure for that alternator. If it then produces controlled voltage, the alternator and its excitation chain are sound and the fault is the regulator or its sensing. If it does not, the alternator is at fault and the AVR was never the problem. That test settles the question definitively.',
    },
    {
      q: 'Is it safe to work in the terminal box while the set is running?',
      a: 'It is live working and carries real risk, including arc flash. Some diagnostic steps genuinely require the machine to be running, and those must be done only by someone competent with the correct protection — or not at all. One rule is absolute: never open-circuit a current transformer secondary while the machine is carrying load, because the voltage that develops across the break can be lethal.',
    },
  ],

  references: [
    'IEC 60034-1 — rotating electrical machines: rating and performance',
    'ISO 8528-1 and ISO 8528-5 — generating sets: application, ratings and performance, including voltage regulation classes',
    'IEEE 115 — test procedures for synchronous machines',
    'The alternator and AVR manufacturer\'s documentation for the specific machine, which is the only valid source for terminal designations, winding values, field-flashing and separate-excitation procedures referred to throughout',
  ],
};
