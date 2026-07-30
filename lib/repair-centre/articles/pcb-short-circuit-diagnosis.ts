import type { RepairArticle } from '../types';

export const pcbShortCircuitDiagnosis: RepairArticle = {
  slug: 'pcb-short-circuit-diagnosis',
  hub: 'pcb-motherboards',
  header: {
    title: 'PCB Short-Circuit Diagnosis — Locating a Shorted Rail',
    equipmentCategory: 'Industrial control and power electronics — component-level board repair',
    appliesTo: 'Control boards, power-supply boards, driver boards and control panels in generators, inverters, UPS systems and industrial plant. Method is general; all board-specific values must come from the manufacturer reference.',
    difficulty: 'specialist',
    diagnosisComplexity: 'High. Finding that a rail is shorted takes minutes; finding which of fifty components is doing it is the actual work.',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'Board supply per design; all work with the board isolated and the bus proven discharged',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Find the shorted rail first, then localise the component, and never do either by applying full power. Start with the board isolated and the bus proven discharged, and measure from each supply rail to ground looking for the one that reads dramatically lower than the others — a short does not need an absolute reference figure to identify, because a healthy board has a characteristic spread across its rails and the faulty one stands out against its neighbours or against an identical known-good board. Once the rail is identified, the reliable way to localise the fault is current-limited power injection: feed that rail alone from a bench supply with the current limit set low, so the short dissipates the injected power as heat without damaging anything, then find the hot component with a thermal camera or by touch on a cold board. This is the technique that converts an hour of random component removal into a two-minute diagnosis. Semiconductors and tantalum capacitors are the usual offenders because both commonly fail short. Resist the temptation to cut tracks or lift parts speculatively; work by measurement and isolation, and keep a record of what has been removed so the board can be restored if you are wrong.',

  symptoms: {
    display: [
      'Equipment completely dead with no display and no indicators',
      'Supply fuse blowing immediately on every attempt to energise',
      'Protection tripping the moment the board is powered',
      'Board powers briefly then shuts down',
    ],
    indicators: [
      'No indicator activity at all on the board',
      'Power LED absent while upstream supply is confirmed present',
      'Upstream supply collapsing when the board is connected and recovering when it is removed',
    ],
    sounds: [
      'A crack or bang at the moment of failure',
      'Buzzing or squealing from an upstream switched-mode supply attempting to feed a short',
      'Complete silence where protection has acted correctly',
    ],
    smells: [
      'Sharp burnt-electronics smell',
      'Burnt substrate smell, indicating the board material itself has been heated',
      'A distinctive acrid smell often associated with failed tantalum capacitors',
    ],
    behaviour: [
      'Failed after a surge, lightning event or supply disturbance',
      'Failed after water or condensation ingress',
      'Failed immediately after a previous repair, which suggests the earlier work or an unresolved cause',
      'Blows the fuse instantly rather than after a delay, which indicates a hard short rather than an overload',
      'Upstream supply recovers as soon as this board is disconnected, confirming the board is the load at fault',
    ],
    visible: [
      'Cratered, cracked or discoloured components',
      'Carbonised or discoloured board substrate',
      'Lifted, vaporised or missing tracks',
      'Bulged, vented or leaking electrolytic capacitors',
      'Corrosion, water staining or dendrite growth between conductors',
      'Solder splashes, swarf or foreign conductive debris bridging conductors',
      'Evidence of previous repair work — reworked joints, added wires, wrong components',
    ],
  },

  whatItMeans: {
    plain:
      'Somewhere on the board a supply is connected to ground when it should not be, so as soon as power is applied the current has a direct path and either blows the fuse or shuts the supply down. The board is not dead because it lost power; it is dead because something is holding one of its supplies down. The job is to find which component, without destroying the board in the process.',
    technical:
      'A control board typically derives several supply rails from a single input through regulators, and distributes each rail across the assembly to the devices that need it. A short on any rail presents the upstream source with a low-impedance load, so a fused supply opens, a switched-mode supply enters protection or hiccup mode, and a linear supply overheats. Identifying which rail is affected is straightforward by comparison: rails have characteristic impedances to ground determined by the decoupling and the devices connected, and a shorted rail departs sharply from both its neighbours and from the same rail on an identical board. Localising the component is the difficult part, because a single rail may be decoupled at dozens of points and any one of them can be the fault. Current-limited injection exploits the physics directly: power delivered into a short is dissipated at the short, so limiting the current to a safe value and feeding the rail causes the offending component to warm measurably while everything else stays cold. Semiconductors — regulators, driver devices, protection diodes and transistors — fail short as a dominant mode, and tantalum capacitors are notorious for failing short, often spectacularly. Where a board has suffered water ingress the fault may not be a component at all but electrochemical migration between conductors, which is why cleaning and drying before condemning parts is sound practice rather than optimism.',
  },

  causes: {
    mostLikely: [
      'Semiconductor failed short — regulator, driver, transistor or protection device',
      'Tantalum or electrolytic capacitor failed short',
      'Conductive contamination bridging conductors — water, corrosion, swarf or solder splash',
      'Consequential damage following an upstream power-stage failure',
    ],
    possible: [
      'Surge or lightning damage to protection components',
      'Reverse polarity applied to the board',
      'Damaged track or via shorting to an adjacent conductor or plane',
      'Component fitted incorrectly during a previous repair',
    ],
    lessCommon: [
      'Internal short within a multilayer board between planes',
      'Connector damage bridging pins',
      'Failed processor or ASIC pulling a rail down',
      'Cracked component under mechanical stress',
    ],
    modelSpecific: [
      'Rail voltages, regulator types and board topology are design-specific — take every value from the board reference or the regulator data sheet, never assume',
      'Some boards implement power sequencing where rails must come up in order; a fault in one can hold others down',
      'Protection and crowbar circuits may deliberately short a rail on an over-voltage condition, which is correct behaviour rather than a component failure',
      'Multilayer boards make track tracing impractical without the manufacturer reference',
    ],
    environmental: [
      'Water ingress, condensation or high humidity',
      'Coastal salt air driving corrosion and electrochemical migration',
      'Conductive dust in industrial environments',
      'Insect ingress, which is a genuine and frequent cause in equipment left standing',
      'Vibration causing component cracking or track fracture',
    ],
    installation: [
      'Equipment installed without adequate ingress protection for its environment',
      'Inadequate surge protection on incoming supplies',
      'Cabinet ventilation drawing in contaminated air',
      'Boards handled without ESD precautions during installation',
    ],
    maintenance: [
      'Enclosure seals never inspected',
      'Cabinet filters never changed, allowing conductive dust',
      'Previous repairs performed without proper cleaning, leaving flux residue',
      'Boards stored or transported without ESD protection',
    ],
    componentLevel: [
      'Voltage regulator failed short',
      'Tantalum capacitor failed short',
      'Protection diode or transient suppressor failed short after absorbing a surge',
      'Driver device or transistor failed short',
      'Processor or logic device failed with a shorted input',
    ],
  },

  safety: {
    isolation: [
      'Isolate every supply to the equipment before removing or working on a board',
      'Where the board sits in a power converter, the DC bus must be measured and proven discharged',
      'Batteries and solar arrays cannot be switched off and must be isolated separately',
      'Prove dead at the board immediately before starting work',
    ],
    lockoutTagout: [
      'Lock and tag every source feeding the equipment',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection — failed components and capacitors can eject material, and tantalum capacitors can fail energetically',
      'ESD wrist strap and mat for all board handling, without exception',
      'Appropriate protection for soldering and hot-air rework, including fume extraction',
      'Insulated tools where any adjacent circuit may remain live',
    ],
    storedEnergy: [
      'Bus and supply capacitors retain charge after disconnection — measure and confirm discharge rather than relying on elapsed time',
      'Large capacitors can recover charge after being discharged; re-check before each work session',
      'Discharge through the manufacturer\'s specified means where one exists',
    ],
    specificHazards: [
      'NEVER apply full power to a board with a known short. It destroys evidence, damages further components and can start a fire. Current-limited injection is the correct method and the whole basis of this procedure.',
      'Tantalum capacitors can fail violently and eject burning material — keep eye protection on and do not lean over the board while injecting current',
      'ESD damage produces components that survive the bench and fail weeks later in service, which is worse than an obvious failure',
      'Carbonised board substrate remains conductive; a board that has burnt may fail again even after every component is replaced',
      'Freeze spray and solvents used in fault-finding can be harmful — ventilate and follow the product safety data',
    ],
    stopAndCallProfessional: [
      'The substrate is carbonised or tracks are missing over an area',
      'The fault is inside a multilayer board between internal planes',
      'You do not have a current-limited supply — do not proceed without one',
      'The board carries safety-critical protection functions that cannot be validated after repair',
      'No board reference or schematic is available and the board is dense or multilayer',
    ],
  },

  tools: [
    { tool: 'Current-limited bench power supply with adjustable limit', why: 'The central tool of this procedure — it localises the short by heat without destroying anything' },
    { tool: 'Thermal camera, or freeze spray on a cold board', why: 'Seeing which component warms under injected current; this is what makes the method fast' },
    { tool: 'True-RMS multimeter with good low-range resolution', why: 'Comparing rail impedance to ground across rails and against a known-good board' },
    { tool: 'Milliohm meter or low-resistance capable meter', why: 'Distinguishing a hard short from a low-impedance but healthy rail' },
    { tool: 'ESR meter', why: 'Assessing capacitors, which are among the most common shorted components' },
    { tool: 'Magnification and good lighting', why: 'Finding solder bridges, cracked components, corrosion and dendrite growth' },
    { tool: 'Soldering and hot-air rework station', why: 'Removing suspect components without lifting pads' },
    { tool: 'Isopropyl alcohol and cleaning equipment', why: 'Contamination is a cause, not only a cosmetic matter — cleaning before condemning parts is sound practice' },
    { tool: 'ESD wrist strap and mat', why: 'Mandatory for all board handling' },
    { tool: 'Board reference or schematic where obtainable', why: 'Rail identification and expected values must come from the reference, not assumption' },
  ],

  decisionTree: [
    { question: 'Has every supply been isolated and the bus proven discharged?', yes: 'Continue', no: 'Stop. Do not touch the board until the bus is proven dead with a meter.' },
    { question: 'Is the substrate carbonised or are tracks missing over an area?', yes: 'Repair is unlikely to be durable — assess for board replacement', no: 'Continue' },
    { question: 'Is there visible contamination, corrosion or a solder bridge?', yes: 'Clean and dry thoroughly, then re-measure before removing any component', no: 'Continue' },
    { question: 'Does one supply rail read dramatically lower to ground than the others?', yes: 'That rail carries the short — continue', no: 'The fault may not be a short; reconsider the diagnosis before removing parts' },
    { question: 'Is a current-limited supply available?', yes: 'Inject the affected rail at a low limit and find the heat', no: 'Stop. Do not fault-find a short at full power.' },
    { question: 'Does one component warm under injected current?', yes: 'Remove it and re-measure the rail — that is the candidate', no: 'Raise the limit slightly within safe bounds, or isolate sections progressively' },
    { question: 'Does the rail recover after removing that component?', yes: 'Fault localised — establish WHY it failed before refitting', no: 'Continue isolating; more than one component may be shorted' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Isolate, discharge and prove dead',
      inspect: 'Bus and supply capacitor voltages',
      where: 'Across the bus and main supply capacitors',
      instrument: 'True-RMS multimeter',
      expected: 'Safe, near-zero potential that stays there',
      ifAbnormal: 'Discharge by the specified means and re-measure. Do not substitute an elapsed time for a measurement.',
      next: 'Step 2',
      warning: 'This step is mandatory. Capacitors can also recover charge — re-check before each session.',
    },
    {
      step: 2,
      title: 'Inspect and photograph under magnification',
      inspect: 'Component condition, substrate, tracks, corrosion, contamination and evidence of previous repair',
      where: 'Both sides of the board',
      instrument: 'Magnification and good lighting',
      expected: 'A documented picture before anything is disturbed',
      ifAbnormal: 'Water staining, dendrite growth, swarf and solder splash are causes in their own right. Photograph before cleaning, because cleaning destroys evidence of what happened.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Clean and dry before condemning components',
      inspect: 'Whether the fault persists after thorough cleaning',
      where: 'Whole board, both sides',
      instrument: 'Isopropyl alcohol, appropriate cleaning equipment, controlled drying',
      expected: 'Contamination removed and the board fully dry',
      ifAbnormal: 'Where ingress has occurred the fault is frequently conduction between conductors rather than a failed part. Cleaning first avoids removing healthy components.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Identify which rail is shorted, by comparison',
      inspect: 'Impedance from each supply rail to ground',
      where: 'At convenient test points on each rail',
      instrument: 'Multimeter with good low-range resolution',
      expected: 'A characteristic spread across rails, with one departing sharply',
      ifAbnormal: 'You do not need an absolute reference to identify a short. Compare rails against each other, and against the same rail on an identical known-good board where one is available.',
      next: 'Step 5',
      verify: 'Which rails exist on this board and their nominal voltages, from the board reference or the regulator data sheets — never assume them.',
    },
    {
      step: 5,
      title: 'Inject the affected rail from a current-limited supply',
      inspect: 'Where the injected power is being dissipated',
      where: 'Feed the affected rail directly, board otherwise unpowered',
      instrument: 'Current-limited bench supply, set to a low limit',
      expected: 'The supply goes into current limit, confirming the short',
      ifAbnormal: 'Start with a low limit and raise it only gradually within safe bounds. The aim is to warm the offending component, not to stress the board.',
      next: 'Step 6',
      warning: 'Never do this at full power or with an unlimited supply. Keep eye protection on and do not lean over the board.',
    },
    {
      step: 6,
      title: 'Find the heat',
      inspect: 'Which component warms while everything else stays cold',
      where: 'Across the whole rail distribution',
      instrument: 'Thermal camera, or freeze spray on a cold board watching where frost clears first',
      expected: 'A single component warming distinctly',
      ifAbnormal: 'This is the step that replaces an hour of speculative removal with a two-minute answer. If nothing warms, the short may be a track or plane fault rather than a component.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Remove the candidate and re-measure',
      inspect: 'Whether rail impedance recovers with the suspect component removed',
      where: 'At the same rail test point',
      instrument: 'Multimeter',
      expected: 'Rail impedance returning to a value comparable with its neighbours',
      ifAbnormal: 'If the rail is still shorted, more than one component has failed — this is common after a surge. Continue isolating rather than assuming the first find was the only one.',
      next: 'Step 8',
      warning: 'Keep a written record of every component removed so the board can be restored if the diagnosis proves wrong.',
    },
    {
      step: 8,
      title: 'Establish why it failed before refitting anything',
      inspect: 'Upstream cause — surge, over-voltage, ingress, a failed power stage or an earlier repair',
      where: 'Across the board and its supply',
      instrument: 'Inspection and the equipment history',
      expected: 'A specific identified cause',
      ifAbnormal: 'A component that failed short usually had a reason. Refitting without finding it produces a board that fails again, often immediately.',
      next: 'Repair, then bring the board up current-limited before returning it to the equipment',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Contamination and mechanical faults',
      steps: [
        'Clean thoroughly and dry fully where ingress or corrosion is present',
        'Remove solder bridges, swarf and foreign conductive debris',
        'Repair damaged tracks to adequate current capacity',
        'Restore conformal coating where the original had it',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Failed components',
      steps: [
        'Replace shorted components with the correct part — do not substitute on physical similarity',
        'Where a surge caused the failure, check protection components as well as the obvious casualty',
        'Replace tantalum capacitors with correctly rated parts; under-rating them is a common cause of repeat failure',
        'Re-check the rail after each replacement rather than replacing several parts blind',
      ],
    },
    {
      level: 'board-level',
      title: 'Substrate and tracks',
      steps: [
        'Remove all carbonised material — it remains conductive and will cause repeat failure',
        'Reconstruct lost tracks properly rather than bridging with wire where current capacity matters',
        'Repair lifted pads correctly',
      ],
    },
    {
      level: 'board-replacement',
      title: 'When the board goes rather than the component',
      steps: [
        'Replace boards with multilayer internal faults, carbonised substrate or processor failure',
        'Replace where safety-critical functions cannot be validated after repair',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond bench repair',
      steps: [
        'Refer boards requiring firmware, calibration or proprietary configuration after repair',
        'Provide the measurements, photographs and identified root cause',
      ],
    },
  ],

  validation: [
    'Confirm every rail measures comparably to a known-good board or to its neighbours',
    'Bring the board up on a current-limited supply and confirm current draw is as expected',
    'Confirm each rail reaches its correct voltage, taken from the board reference',
    'Confirm the board operates correctly with load applied progressively',
    'Thermal-survey the board under operation — an unexpectedly warm component indicates a remaining problem',
    'Run for an extended period before returning the equipment to service',
    'Confirm the equipment functions correctly as a whole, not only that the board powers up',
    'Document the components replaced, the measurements and the root cause identified',
  ],

  whenNotToRepair: [
    'Carbonised substrate, which remains conductive and causes repeat failure',
    'Faults internal to a multilayer board between planes',
    'Processor or ASIC failure where firmware is unobtainable',
    'Repeated failure after competent repair, indicating an unresolved system cause',
    'Safety-critical protection boards that cannot be properly validated after repair',
    'Severe corrosion across the assembly, where cleaning cannot restore reliability',
    'Where the repair cost approaches board replacement value',
  ],

  prevention: [
    'Maintain enclosure sealing and ingress protection appropriate to the environment',
    'Fit and maintain surge protection on incoming supplies',
    'Change cabinet filters and control conductive dust',
    'Handle and store boards with ESD precautions at all times',
    'Clean flux residue thoroughly after any repair',
    'Investigate the cause of a board failure rather than only replacing the board, since the cause usually remains',
    'Keep equipment enclosures closed; insect ingress is a real and frequent cause in plant left standing',
  ],

  relatedSlugs: ['inverter-igbt-testing-and-failure', 'inverter-mosfet-failure-diagnosis', 'motherboard-power-rail-diagnosis', 'three-phase-motor-failure-diagnosis'],

  faq: [
    {
      q: 'What resistance indicates a short on a supply rail?',
      a: 'There is no universal figure, and any guide quoting one for a board it has not identified is guessing — rails legitimately differ by orders of magnitude depending on decoupling and the devices connected. Use comparison instead: measure every rail on the board and look for the one that departs sharply from its neighbours, or compare against the same rail on an identical known-good board. That identifies a short reliably without any absolute reference.',
    },
    {
      q: 'Why not just power it up and look for smoke?',
      a: 'Because it destroys the board and the evidence, and it can start a fire. Powering a shorted board at full current damages components that were still serviceable and often burns the substrate, which turns a repairable board into scrap. Current-limited injection finds the same fault in minutes with no damage at all.',
    },
    {
      q: 'I found and replaced the shorted part but the rail is still down. What now?',
      a: 'More than one component has failed — common after a surge, where several devices on the same rail are damaged together. Continue the same process: inject, find the heat, remove, re-measure. Also check that what you removed was a cause rather than a casualty, and keep a written record of everything taken off so the board can be restored.',
    },
    {
      q: 'The board got wet. Is it worth attempting?',
      a: 'Often yes, and cleaning should come before condemning any component. Water ingress frequently causes conduction between conductors rather than an actual component failure, and thorough cleaning and full drying can restore the board. Photograph first, clean properly, dry completely, then re-measure — you may find nothing needs replacing.',
    },
  ],

  references: [
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies',
    'IPC-A-610 — acceptability of electronic assemblies',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
    'IEC 62477-1 — safety requirements for power electronic converter systems',
    'The board manufacturer\'s reference or schematic and the relevant component data sheets, which are the only valid source for rail identification, expected voltages and component values referred to throughout',
  ],
};
