import type { RepairArticle } from '../types';

export const upsBypassFault: RepairArticle = {
  slug: 'ups-bypass-fault',
  hub: 'ups',
  header: {
    title: 'Online UPS Bypass Fault — Diagnosis and Repair',
    equipmentCategory: 'Online double-conversion UPS — static bypass and transfer',
    appliesTo: 'Online double-conversion UPS systems with static bypass, single- and three-phase, including modular and parallel installations',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate, but the consequence is severe: a bypass fault removes the protection that catches an inverter failure.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Bypass supply 240 V / 415 V 50 Hz nominal; DC bus per UPS design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Treat a bypass fault as urgent even though the load is still running, because the bypass is the safety net that catches an inverter failure or an overload — without it the next fault drops the load. Diagnosis turns on one question: is the bypass supply itself unacceptable, or is the transfer path unable to use it? Measure the bypass supply at the UPS bypass input, checking frequency and phase rotation as well as voltage, because a bypass source outside the acceptance window is rejected exactly as a rectifier input would be. The second and less obvious cause is synchronisation. For a break-free transfer the inverter must remain synchronised with the bypass source, so if the bypass frequency wanders — most commonly when the site is running on a generator — the UPS cannot hold sync and will declare bypass unavailable while both supplies individually look healthy. Only when supply and synchronisation are proven should the static switch itself be suspected. Note also that a maintenance bypass and a static bypass are different things with different failure modes; establish which one the alarm concerns before investigating.',

  symptoms: {
    display: [
      'Bypass unavailable, bypass fault or bypass out of tolerance',
      'Loss of synchronisation, or inverter not synchronised with bypass',
      'Static switch fault',
      'Bypass frequency or phase rotation error',
      'Load on inverter with bypass unavailable — the condition that matters most',
    ],
    indicators: [
      'Bypass path indicator dark on the mimic display while the inverter path is healthy',
      'Alarm active with the load still supplied normally',
      'Bypass input breaker open',
    ],
    sounds: [
      'Audible alarm with no change in load behaviour',
      'Static switch or contactor operating repeatedly as the unit attempts and abandons synchronisation',
      'Cooling fans running harder, which may accompany a static switch problem',
    ],
    smells: [
      'Burnt smell from the bypass section or static switch assembly — stop and investigate before any transfer attempt',
      'Hot insulation smell around bypass terminations, indicating a loose or overloaded joint',
    ],
    behaviour: [
      'Bypass unavailable only while the site runs on generator, which is a synchronisation problem rather than a UPS fault',
      'Bypass alarm appearing and clearing through the day as supply quality varies',
      'Bypass lost after upstream electrical work, which frequently means phase rotation was reversed',
      'Load transferred to bypass and would not transfer back',
      'Unit refuses to transfer for a planned maintenance operation',
    ],
    visible: [
      'Bypass input breaker and fuse condition',
      'Maintenance bypass switch position — it is often found in the wrong position after earlier work',
      'Bypass terminations for heat discolouration or looseness',
      'Phase rotation indication where provided',
      'Evidence of recent upstream changes to the installation',
    ],
  },

  whatItMeans: {
    plain:
      'The UPS has a second path that can feed the load directly from the incoming supply, used when the UPS is overloaded, has an internal fault, or needs maintenance. A bypass fault means that path is not available. The load is usually still running normally, which is why this gets ignored — but if anything then goes wrong with the main path, there is nothing to catch it.',
    technical:
      'An online double-conversion UPS supplies the load continuously through rectifier and inverter, with a static bypass providing an alternative path directly from the bypass supply. The static switch can transfer the load between inverter and bypass, and for that transfer to occur without a break in supply the inverter output must be synchronised in frequency and phase with the bypass source. The UPS therefore tracks the bypass source continuously and only permits transfer while synchronised and while the bypass supply satisfies its acceptance criteria for voltage, frequency and, on three-phase units, phase rotation. Two independent conditions can therefore remove bypass availability: an unacceptable bypass supply, or a supply that is acceptable but which the inverter cannot lock to. The second is common on generator-backed sites, because engine-driven sets exhibit frequency excursions during load steps that exceed the rate the inverter is permitted to follow — the UPS then reports bypass unavailable while both the inverter and the generator are individually healthy. Because the bypass path is the protection of last resort, its loss does not interrupt the load but removes the response to any subsequent inverter fault, overload or short circuit, which is why it is an urgent condition despite being invisible to users. The maintenance bypass is a separate, manually operated path used to isolate the UPS entirely for service; it is mechanically interlocked in most designs and its failure modes are unrelated to the static bypass.',
  },

  causes: {
    mostLikely: [
      'Bypass supply outside the acceptance window — commonly frequency, on generator supply',
      'Inverter unable to synchronise with a wandering bypass frequency',
      'Bypass input breaker open or fuse blown',
      'Phase rotation reversed after upstream electrical work',
    ],
    possible: [
      'Maintenance bypass switch left in the wrong position after earlier work',
      'Bypass acceptance window configured too narrowly for the site supply',
      'Loose or high-resistance bypass termination',
      'Lost phase on a three-phase bypass supply',
    ],
    lessCommon: [
      'Static switch device failure',
      'Synchronisation or phase-locked control circuit failure',
      'Bypass sensing circuit failure',
      'Control or logic board fault reporting a condition that does not exist',
      'Interlock or auxiliary contact failure on the bypass path',
    ],
    modelSpecific: [
      'Bypass acceptance windows for voltage, frequency and slew rate are configurable and model-specific — read them from the unit',
      'Some units offer a wider bypass window or generator mode intended for engine-driven supplies',
      'Transfer behaviour, and whether an unsynchronised transfer is permitted at all, differs by model',
      'Maintenance bypass interlocking arrangements differ; some are mechanical, some electrical',
      'Parallel and modular systems have additional synchronisation requirements between modules',
    ],
    environmental: [
      'Generator supply with frequency instability',
      'Weak or unstable utility supply',
      'High ambient temperature affecting the static switch assembly',
      'Dust or humidity causing tracking on bypass circuitry',
    ],
    installation: [
      'Bypass supply taken from a source with poorer quality than the rectifier input',
      'Generator sized without regard to the UPS load characteristic',
      'Bypass cabling undersized, causing voltage drop under transferred load',
      'Phase rotation not verified after installation or alteration',
    ],
    maintenance: [
      'Bypass path never exercised, so a failure is discovered only when it is needed',
      'Bypass acceptance settings never reviewed against the real site supply',
      'Bypass terminations never re-torqued or thermally surveyed',
      'Maintenance bypass operation never practised, so it is performed incorrectly under pressure',
    ],
    componentLevel: [
      'Static switch device failed',
      'Bypass fuse open',
      'Synchronisation control circuit failed',
      'Bypass voltage or frequency sensing failed',
      'Auxiliary contact or interlock failed',
    ],
  },

  safety: {
    isolation: [
      'A UPS has multiple independent sources — rectifier input, bypass input, battery and inverter output. Isolating one does not make the unit safe.',
      'The bypass input can be live even when the rectifier input is isolated, because it is frequently a separate feed',
      'Isolate every source and prove dead at the point of work',
      'Confirm the DC bus has discharged before opening the enclosure',
    ],
    lockoutTagout: [
      'Lock and tag the rectifier input, the bypass input, the battery isolator and the maintenance bypass',
      'Confirm explicitly with the site that the load may lose protection during the work',
      'Where the maintenance bypass is used to carry the load, verify it is actually carrying it before isolating the UPS',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy at the bypass input',
      'Insulated tools rated for the system voltage',
      'Eye protection',
    ],
    storedEnergy: [
      'The DC bus and battery string remain at dangerous voltage after shutdown',
      'Observe and verify the manufacturer\'s capacitor discharge period rather than trusting elapsed time',
      'The battery string cannot be switched off',
    ],
    specificHazards: [
      'BACKFEED: a UPS can energise terminals that appear isolated. Always prove dead at the point of work immediately before starting, never on the basis of an upstream isolation alone.',
      'Operating the maintenance bypass incorrectly can drop the load instantly. Know the correct sequence for the specific unit before touching it, and never improvise the order.',
      'An unsynchronised transfer can subject the load to a break or a phase step. Do not force a transfer to clear an alarm.',
      'Never open-circuit a current transformer secondary while the machine carries load',
      'Working on a live bypass supply is live working and must be treated as such',
    ],
    stopAndCallProfessional: [
      'There is a burnt smell or visible damage in the bypass or static switch section',
      'The maintenance bypass sequence for this unit is not documented or not understood',
      'The load cannot lose protection and no alternative arrangement exists',
      'Static switch or synchronisation control failure is suspected',
      'The unit is part of a parallel or modular system whose transfer logic you are not familiar with',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the system voltage', why: 'Bypass supply voltage measured at the UPS bypass input, not at a nearby board' },
    { tool: 'Frequency meter or power quality analyser with logging', why: 'Bypass frequency and its stability — the leading cause, and one a spot reading will miss' },
    { tool: 'Phase rotation tester', why: 'Reversed rotation after upstream works is a classic and instantly disqualifies the bypass' },
    { tool: 'Clamp meter', why: 'Confirming load path and current during and after transfer' },
    { tool: 'Thermal camera', why: 'Bypass terminations and static switch assembly under load' },
    { tool: 'Insulated torque wrench', why: 'Bypass terminations must be torqued to specification' },
    { tool: 'UPS service interface and event log', why: 'The log usually states precisely why bypass was declared unavailable, which is faster than inferring it' },
    { tool: 'Unit documentation for the maintenance bypass sequence', why: 'The correct order is unit-specific and an error drops the load' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell or visible damage in the bypass section?', yes: 'Stop. Do not attempt a transfer. Escalate.', no: 'Continue' },
    { question: 'Does the alarm concern the STATIC bypass or the MAINTENANCE bypass?', yes: 'Identify which before proceeding — they are different paths with different failure modes', no: 'Read the event log to establish which' },
    { question: 'Is the maintenance bypass switch in its correct normal position?', yes: 'Continue', no: 'That explains it — it is frequently left wrong after earlier work' },
    { question: 'Is the bypass input breaker closed and fuse intact?', yes: 'Continue', no: 'Establish why it opened before restoring it' },
    { question: 'Is bypass supply present at the UPS bypass input, all phases, correct rotation?', yes: 'Continue', no: 'The problem is the supply or its rotation, not the UPS' },
    { question: 'Is bypass frequency within the acceptance window and stable?', yes: 'Continue', no: 'Frequency instability — usually generator governing. The UPS is behaving correctly.' },
    { question: 'Is the site running on a generator when the fault appears?', yes: 'Synchronisation with a wandering source is the likely cause; address the set, not the UPS', no: 'Continue' },
    { question: 'With a proven-good, stable, correctly rotated bypass supply, is bypass still unavailable?', yes: 'Static switch or synchronisation control — refer for specialist diagnosis', no: 'Resolved; validate and record' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the risk before diagnosing',
      inspect: 'Whether the load is currently protected, and what happens if the inverter path fails now',
      where: 'UPS mimic display and site load schedule',
      instrument: 'UPS display',
      expected: 'A conscious decision about the load before work begins',
      ifAbnormal: 'A bypass fault leaves the load with no fallback. Where the load is critical, arrange an alternative before investigating rather than after.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Read the event log',
      inspect: 'The stated reason bypass was declared unavailable, and whether it recurs',
      where: 'UPS service interface',
      instrument: 'Service interface',
      expected: 'A specific reason — frequency, voltage, rotation, sync loss or static switch',
      ifAbnormal: 'A pattern tied to generator running hours points immediately at synchronisation rather than a component fault.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Confirm which bypass path is involved and check switch positions',
      inspect: 'Static bypass versus maintenance bypass, and the maintenance bypass switch position',
      where: 'At the UPS and its maintenance bypass panel',
      instrument: 'Visual inspection against the unit documentation',
      expected: 'Maintenance bypass in its correct normal position, interlocks intact',
      ifAbnormal: 'A maintenance bypass left in the wrong position after earlier work is a common and immediately explanatory finding.',
      next: 'Step 4',
      warning: 'Do not operate the maintenance bypass to test it without knowing the correct sequence for this unit — an error drops the load.',
    },
    {
      step: 4,
      title: 'Measure the bypass supply at the UPS bypass input',
      inspect: 'Voltage on every phase at the bypass input terminals',
      where: 'UPS bypass input terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Nominal voltage, balanced, all phases present',
      ifAbnormal: 'A lost phase is easy to miss and disqualifies the bypass entirely. Measure at the UPS, not at a nearby distribution board.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Check bypass frequency and stability',
      inspect: 'Frequency and how much it moves, especially through load changes',
      where: 'Bypass input terminals',
      instrument: 'Frequency meter or logging analyser',
      expected: 'Frequency at nominal and steady enough for the inverter to track',
      ifAbnormal: 'This is the leading cause. A generator whose frequency wanders on load steps prevents synchronisation, and the UPS correctly declares bypass unavailable while both supplies look individually healthy.',
      next: 'Step 6',
      verify: 'The configured bypass acceptance window and permitted slew rate for this model — these are model-specific and must be read from the unit.',
    },
    {
      step: 6,
      title: 'Verify phase rotation',
      inspect: 'Rotation of the bypass supply against the unit requirement',
      where: 'Bypass input terminals',
      instrument: 'Phase rotation tester',
      expected: 'Correct rotation',
      ifAbnormal: 'Reversed rotation disqualifies bypass outright and is a classic consequence of upstream electrical work or a generator connection made in haste.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Inspect and thermally survey the bypass path',
      inspect: 'Terminations, static switch assembly and busbars under load',
      where: 'Bypass path through the unit',
      instrument: 'Thermal camera, insulated torque wrench',
      expected: 'All connections cool and correctly torqued',
      ifAbnormal: 'A high-resistance joint causes voltage collapse when the bypass is loaded, producing a fault that only appears at the moment it matters.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Only then suspect the static switch or synchronisation control',
      inspect: 'Static switch condition and the unit\'s reported synchronisation state with a proven-good supply',
      where: 'Within the unit',
      instrument: 'Service interface, with all supply causes eliminated',
      expected: 'A supply proven acceptable and stable, with the unit still refusing bypass',
      ifAbnormal: 'Only at this point is an internal fault the likely answer. Refer for specialist diagnosis with the supply measurements recorded.',
      next: 'Refer to the manufacturer or a properly equipped specialist',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Bypass path integrity',
      steps: [
        'Re-torque bypass terminations to specification and re-survey thermally under load',
        'Replace overheated or damaged bypass conductors',
        'Restore a lost phase at its source rather than at the UPS',
      ],
    },
    {
      level: 'configuration',
      title: 'Acceptance and synchronisation settings',
      steps: [
        'Compare the configured bypass window against the supply the site actually has, measured over time',
        'Where the unit provides a generator or wide-bypass mode, enable it deliberately and within manufacturer limits',
        'Correct phase rotation at the source',
        'Re-verify after any firmware or configuration change',
      ],
      note: 'Widening the window is legitimate where measurement shows the supply is genuinely acceptable but marginal. Widening it to silence an alarm defeats the purpose of the bypass.',
    },
    {
      level: 'mechanical',
      title: 'Generator side',
      steps: [
        'Correct governing so frequency holds through load steps and the inverter can track it',
        'Review generator sizing against the UPS load characteristic',
        'Review transfer switch timing so the supply is presented only once the set has stabilised',
      ],
      note: 'Where the fault only appears on generator, this is the repair.',
    },
    {
      level: 'component-replacement',
      title: 'Bypass components',
      steps: [
        'Replace open bypass fuses after establishing why they operated',
        'Replace failed interlocks and auxiliary contacts',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Static switch and control',
      steps: [
        'Refer static switch and synchronisation control faults to the manufacturer or a properly equipped specialist',
        'Provide the measured bypass voltages, frequencies, rotation and the event log',
      ],
    },
  ],

  validation: [
    'Confirm the unit reports bypass available and synchronised',
    'Confirm bypass supply voltage, frequency and rotation measured at the UPS input',
    'Where the site has a generator, verify bypass remains available with the set running under real load — not only on utility',
    'Exercise a transfer to bypass and back, at a planned time, following the documented sequence',
    'Thermally survey the bypass path under transferred load',
    'Confirm the maintenance bypass is returned to its correct normal position and interlocks are intact',
    'Review the event log after a settling period to confirm the alarms have stopped rather than become less frequent',
    'Record all measurements and any settings changed, with the justification',
  ],

  whenNotToRepair: [
    'Where the real fault is generator governing or sizing — no UPS work will resolve it',
    'Obsolete units where static switch assemblies and control boards are unobtainable',
    'Where the only way to restore bypass availability is to widen the window so far that unacceptable power could reach the load',
    'Where the bypass supply arrangement requires redesign rather than repair',
  ],

  prevention: [
    'Exercise the bypass path at planned intervals — a path never tested is discovered failed at the worst moment',
    'Practise the maintenance bypass sequence with the documentation before it is needed under pressure',
    'Verify bypass availability with the site running on generator, not only on utility',
    'Record commissioned bypass voltage, frequency and rotation so later drift is detectable',
    'Review UPS event logs at every service visit; intermittent bypass alarms are an early warning',
    'Verify phase rotation after any upstream electrical work as a matter of routine',
    'Thermally survey bypass terminations annually under load',
  ],

  relatedSlugs: ['ats-not-changing-over', 'safe-isolation-and-proving-dead', 'ups-inverter-fault-diagnosis', 'ups-not-charging-batteries', 'ups-on-battery-with-mains-present'],

  faq: [
    {
      q: 'The load is running fine. Why does a bypass fault matter?',
      a: 'Because the bypass is what catches the next problem. With bypass unavailable, an inverter fault, an overload or a downstream short circuit has nowhere to transfer the load to, and it drops. The load running normally today is exactly why this alarm gets ignored until the day it costs an outage.',
    },
    {
      q: 'Bypass is unavailable only when we are on the generator. Is the UPS faulty?',
      a: 'Almost certainly not. For a break-free transfer the inverter must stay synchronised with the bypass source, and a generator whose frequency moves during load steps cannot be tracked within the permitted limits. The UPS is protecting the load by refusing an unsynchronised transfer. The fix is on the generator — governing and sizing — not in the UPS.',
    },
    {
      q: 'Can I just widen the bypass acceptance window to clear the alarm?',
      a: 'Only if measurement shows the supply is genuinely acceptable and merely sits outside a conservatively set window. Widening it so that genuinely poor power could be passed straight to the load removes the reason the bypass has criteria at all. Measure first, change deliberately within manufacturer limits, and record why.',
    },
    {
      q: 'Is the maintenance bypass the same as the static bypass?',
      a: 'No, and confusing them wastes time. The static bypass is an automatic electronic path the UPS uses to transfer the load in a fault or overload. The maintenance bypass is a manually operated path, usually mechanically interlocked, used to isolate the UPS completely for service. They fail in different ways, and the maintenance bypass being left in the wrong position after earlier work is a common cause of a bypass alarm.',
    },
  ],

  references: [
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-3 — UPS performance and test requirements, including transfer and bypass behaviour',
    'ISO 8528 — generating sets, including performance classes for frequency behaviour relevant to synchronisation',
    'The UPS manufacturer\'s documentation for the specific unit, which defines the bypass acceptance windows, synchronisation limits and the maintenance bypass operating sequence referred to throughout',
  ],
};
