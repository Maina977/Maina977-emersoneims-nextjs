import type { RepairArticle } from '../types';

export const inverterIgbtTestingAndFailure: RepairArticle = {
  slug: 'inverter-igbt-testing-and-failure',
  hub: 'inverters',
  header: {
    title: 'IGBT Testing and Failure Symptoms — Inverter and Drive Power Stages',
    equipmentCategory: 'Inverter and drive power stages — component-level electronics',
    appliesTo: 'Discrete IGBTs and IGBT modules in inverters, UPS power stages and variable-speed drives. Method is general; every device parameter must come from the manufacturer data for the specific part.',
    difficulty: 'specialist',
    diagnosisComplexity: 'High. Module construction hides internal parallel dies, so a partially degraded module can pass a casual check and fail under load.',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho — review pending',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'DC bus per design; board-level work only with the bus proven discharged',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Test an IGBT in two distinct parts, because they fail in two distinct ways. First the gate: with the device isolated and the bus proven discharged, the gate should be electrically isolated from the emitter. A gate that reads short to the emitter is a failed device, and it is the failure mode most often missed because the collector-emitter path can still look plausible. Second the main terminals: in diode mode a healthy device reads open from collector to emitter in the blocking direction, while the freewheeling diode that most power IGBTs carry co-packaged conducts from emitter to collector. A device reading short in both directions has failed. The essential difference from a discrete MOSFET is that an IGBT module contains several dies in parallel inside one package, so a module with one degraded die can pass a static check and then fail under load — which is why a module that has been through a fault is replaced rather than passed. As with any switching device, confirm the pinout and every parameter from the manufacturer data for that exact part; and always test the gate-drive circuit before fitting a replacement, because a failed IGBT usually destroys its driver.',

  symptoms: {
    display: [
      'Output-stage, hardware or desaturation fault indication',
      'Short-circuit or overcurrent trip immediately on start',
      'No output with the control electronics otherwise alive',
      'Fault that latches and cannot be reset',
    ],
    indicators: [
      'Fault LED latched with no recoverable reset',
      'DC bus fuse blown, often repeatedly',
      'Drive or inverter tripping the upstream protection on every start attempt',
    ],
    sounds: [
      'A loud bang at the moment of failure — IGBT modules can fail energetically',
      'A brief buzz then immediate trip',
      'Silence where the desaturation protection has acted before damage occurred',
    ],
    smells: [
      'Sharp burnt-electronics smell',
      'Burnt substrate smell where the board beneath the module has been heated',
    ],
    behaviour: [
      'Failed during a short circuit, heavy load step or motor stall',
      'Failed after running with a blocked filter, failed fan or degraded thermal interface',
      'Failed again shortly after a previous repair, which points at the gate drive or an unresolved cause',
      'Intermittent trips under load before the final failure, which is the classic sign of a degrading module',
      'Trips only under load and tests fine on the bench — the signature of a partially degraded module',
    ],
    visible: [
      'Cracked, bulged or blown module housing',
      'Discoloured or carbonised PCB beneath the module',
      'Damaged or open gate resistors',
      'Degraded thermal interface, or mounting bolts not torqued correctly',
      'Bulged DC bus capacitors',
      'Discoloured busbars or terminal hardware indicating a loose high-current joint',
    ],
  },

  whatItMeans: {
    plain:
      'An IGBT is a high-power electronic switch. When one fails it usually goes short circuit, which is why the equipment trips instantly or blows its fuse. Testing needs two separate checks — one on the control terminal and one on the main terminals — because either can fail on its own. Modules also contain several switches inside one package, so a partly damaged module can pass a bench test and still fail in service.',
    technical:
      'An IGBT combines a MOS gate structure with a bipolar output, giving the drive characteristics of a MOSFET with the conduction behaviour of a bipolar device at higher voltages. The gate is capacitive and isolated, so it must read as isolated from the emitter; a gate-emitter short indicates gate oxide failure and condemns the device even where the main terminals appear serviceable. Most power IGBTs are supplied with a freewheeling diode co-packaged across collector and emitter, which is why diode-mode testing shows conduction in the emitter-to-collector direction on a healthy device and must not be mistaken for a fault. Power modules contain multiple dies in parallel to achieve their current rating, and degradation of a subset of those dies — commonly through thermal cycling that fatigues the die-attach and bond wires — produces a device that measures acceptably in a static check and fails under load as the surviving dies are overstressed. Because the switching cell relies on desaturation detection and controlled turn-off to survive a short circuit, a fault in the gate drive removes that protection and destroys the device on the next event. Correspondingly, a failed IGBT normally destroys its gate resistor and driver output, so the drive must be tested and repaired before any replacement device is fitted.',
  },

  causes: {
    mostLikely: [
      'Output short circuit or severe overload',
      'Thermal cycling fatigue — the dominant wear-out mechanism in modules that have been in service for years',
      'Cooling failure: blocked airflow, failed fan, or degraded thermal interface',
      'Gate-drive fault removing desaturation protection or causing shoot-through',
    ],
    possible: [
      'DC bus over-voltage',
      'Degraded bus capacitors raising ripple and switching stress',
      'Loose module mounting or high-current terminal joints creating local heating',
      'Repeated motor stalls or inrush beyond the design',
    ],
    lessCommon: [
      'Surge or lightning damage',
      'Counterfeit or incorrectly specified module fitted during an earlier repair',
      'Control-board fault producing incorrect switching timing or dead-time',
      'Manufacturing defect',
    ],
    modelSpecific: [
      'Module type, internal topology, pinout and ratings are design-specific — confirm every one from the manufacturer data for the exact part',
      'Gate-drive arrangements differ; many designs use a negative off-bias which must be reproduced correctly on repair',
      'Mounting torque and the sequence in which module bolts are tightened are specified by the manufacturer and materially affect thermal performance',
      'Desaturation protection thresholds and behaviour vary by driver design',
    ],
    environmental: [
      'High ambient temperature and inadequate ventilation',
      'Dust on heatsinks and filters',
      'Humidity and salt air causing corrosion and tracking',
      'Load profiles with frequent large thermal swings, which drive cycling fatigue',
    ],
    installation: [
      'Unit installed without the specified airflow or clearance',
      'Continuous operation near rating',
      'Inadequate surge protection',
      'High-current joints never torqued to specification at commissioning',
    ],
    maintenance: [
      'Filters and heatsinks never cleaned',
      'Fan failure unnoticed',
      'Module mounting torque never re-checked',
      'Earlier repair that replaced the module but not the gate drive',
    ],
    componentLevel: [
      'Gate-emitter short — gate oxide failure',
      'Collector-emitter short',
      'Co-packaged freewheeling diode failed',
      'Gate resistor open or drifted',
      'Gate driver output stage destroyed',
      'Bond-wire lift or die-attach fatigue inside a module',
    ],
  },

  safety: {
    isolation: [
      'Isolate every source — DC, AC input and output, and any solar array — before board work',
      'Remove the DC fuse and open the isolator; a battery bank cannot be switched off',
      'Prove dead at the module terminals immediately before starting',
    ],
    lockoutTagout: [
      'Lock and tag all sources',
      'Confirm the driven equipment cannot be started remotely while work is in progress',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection — IGBT modules can fail energetically and eject fragments',
      'Insulated tools rated for the bus voltage',
      'ESD wrist strap and mat for all handling',
      'Appropriate protection for soldering and rework',
    ],
    storedEnergy: [
      'DC bus capacitors retain a lethal charge after disconnection. Measure and confirm discharge before touching anything — a stated waiting time is not proof.',
      'Discharge by the manufacturer\'s specified means; shorting a large bus capacitor is dangerous and damaging',
      'Re-check the bus before each work session',
    ],
    specificHazards: [
      'NEVER power up a stage with a known shorted device. Use a current-limited supply for first power-up, without exception.',
      'IGBT gates are static-sensitive. Keep gate and emitter shorted together during handling and storage; an ESD-damaged gate produces a device that fails days later in service.',
      'A module that has been through a short-circuit event may be internally degraded even if it tests acceptably — under load it can fail violently',
      'Carbonised board substrate remains conductive and will cause repeat failure',
    ],
    stopAndCallProfessional: [
      'The module housing is cracked or has ruptured',
      'PCB substrate is carbonised or multilayer damage is present',
      'You cannot verify the DC bus has discharged',
      'You do not have a current-limited supply for first power-up',
      'Manufacturer data for the exact module is unavailable — mounting torque and pinout must not be guessed',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter with diode-test function', why: 'Gate isolation and collector-emitter checks — the two primary tests' },
    { tool: 'Current-limited bench power supply', why: 'First power-up after repair; it reveals a remaining fault as rising current instead of destroying the new module' },
    { tool: 'Insulation resistance tester', why: 'Confirming isolation between the power terminals and the module baseplate where the design requires it' },
    { tool: 'Oscilloscope', why: 'Verifying gate-drive waveform, including off-bias and dead-time, before applying load' },
    { tool: 'ESR meter', why: 'Assessing DC bus capacitors, whose degradation stresses the switches' },
    { tool: 'Calibrated torque wrench', why: 'Module mounting and high-current joints are torque-specified; incorrect torque causes thermal failure' },
    { tool: 'Thermal camera', why: 'Detecting uneven heating across a module under controlled load, which reveals poor current sharing' },
    { tool: 'ESD wrist strap and mat', why: 'Gate oxide is easily destroyed by static, producing delayed field failures' },
    { tool: 'Manufacturer data sheet and mounting instructions for the exact module', why: 'Pinout, ratings, torque values and sequence must be confirmed, never assumed' },
  ],

  decisionTree: [
    { question: 'Has the DC bus been measured and proven discharged?', yes: 'Continue', no: 'Stop. Do not touch the board until the bus is proven dead with a meter.' },
    { question: 'Is the module housing cracked, ruptured or the board carbonised?', yes: 'Replace the module and assess the board; repair is unlikely to be durable', no: 'Continue' },
    { question: 'Is the gate isolated from the emitter?', yes: 'Continue', no: 'Gate oxide has failed. The device is condemned regardless of how the main terminals read.' },
    { question: 'In diode mode, does the device block collector to emitter and conduct emitter to collector?', yes: 'Static behaviour is plausible — continue', no: 'A short in both directions is a failed device' },
    { question: 'Has this device been through a short-circuit or overcurrent event?', yes: 'Replace it. Internal dies may be degraded in a way static testing cannot reveal.', no: 'Continue' },
    { question: 'Do the gate resistors and driver outputs test healthy against the other channels?', yes: 'Continue', no: 'The drive was damaged with the device — repair it or the replacement fails on power-up' },
    { question: 'Has the reason for failure been established, and the thermal path restored?', yes: 'Proceed to current-limited power-up', no: 'Do not power up; an unresolved cause will destroy the repair' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Isolate and prove the DC bus is discharged',
      inspect: 'Bus voltage at the capacitors',
      where: 'Across the DC bus',
      instrument: 'True-RMS multimeter',
      expected: 'Safe, near-zero potential that stays there',
      ifAbnormal: 'Discharge by the manufacturer\'s specified means and re-measure. A stated waiting time is not evidence.',
      next: 'Step 2',
      warning: 'This step is mandatory and cannot be substituted by elapsed time.',
    },
    {
      step: 2,
      title: 'Inspect and photograph before disturbing anything',
      inspect: 'Module housing, board substrate, gate resistors, busbars, terminal hardware, thermal interface and mounting',
      where: 'Power stage and surroundings',
      instrument: 'Magnification and good lighting',
      expected: 'A documented picture of damage extent before removal',
      ifAbnormal: 'Discoloured busbars or terminal hardware indicate a loose high-current joint, which is a cause rather than a consequence and must be corrected.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Test gate-to-emitter isolation first',
      inspect: 'Whether the gate is electrically isolated from the emitter',
      where: 'Gate and emitter terminals',
      instrument: 'Multimeter',
      expected: 'Isolation — no short',
      ifAbnormal: 'A gate-emitter short means gate oxide failure and condemns the device even when the collector-emitter path looks acceptable. This is the check most often skipped.',
      next: 'Step 4',
      verify: 'The terminal identification for the exact part and package from the manufacturer data sheet before probing.',
      warning: 'Keep gate and emitter shorted together whenever handling or storing a device.',
    },
    {
      step: 4,
      title: 'Diode-mode test the main terminals',
      inspect: 'Collector-emitter behaviour in both polarities',
      where: 'Collector and emitter terminals',
      instrument: 'Multimeter on diode test',
      expected: 'Blocking collector to emitter; conduction emitter to collector through the co-packaged freewheeling diode',
      ifAbnormal: 'Conduction in the emitter-to-collector direction is normal and must not be mistaken for a fault. A short in both directions is a failed device.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Compare all switching positions against each other',
      inspect: 'Relative readings across every switch position in the bridge',
      where: 'Across the power stage',
      instrument: 'Multimeter on diode test',
      expected: 'All equivalent positions reading closely alike',
      ifAbnormal: 'Comparative testing is valid without any absolute reference: positions performing the same function should behave the same, and one that differs is suspect.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Treat a module that has seen a fault event as suspect regardless of readings',
      inspect: 'Service history — has this module been through a short circuit or overcurrent trip?',
      where: 'Event log and site history',
      instrument: 'Records and the equipment log',
      expected: 'A clear history of what the device has experienced',
      ifAbnormal: 'A module contains parallel dies. Degradation of some of them passes a static check and fails under load. A module that has been through a short-circuit event is replaced, not passed.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Test the gate-drive circuit before fitting anything',
      inspect: 'Gate resistors, gate-emitter protection components, driver output stages and isolation',
      where: 'Between driver and each device gate',
      instrument: 'Multimeter, with comparison against healthy channels',
      expected: 'Consistent across channels, no damage',
      ifAbnormal: 'A failed IGBT normally destroys its gate resistor and driver output. Fitting a new module into a damaged drive destroys it immediately — the most common cause of a second failure.',
      next: 'Step 8',
      verify: 'Gate resistor values and any negative off-bias arrangement from the board reference or manufacturer data — these are design-specific.',
    },
    {
      step: 8,
      title: 'Restore the thermal path correctly, then power up current-limited',
      inspect: 'Thermal interface, mounting torque and sequence; then gate waveform and temperature under controlled power',
      where: 'At the module and across the stage',
      instrument: 'Torque wrench, current-limited supply, oscilloscope, thermal camera',
      expected: 'Correct torque to the specified sequence; clean gate drive; no position heating disproportionately',
      ifAbnormal: 'Rising current on the limited supply means a fault remains — investigate rather than raising the limit. Uneven heating indicates poor current sharing.',
      next: 'Proceed to validation only after a clean current-limited power-up',
      verify: 'Mounting torque values and tightening sequence from the module manufacturer\'s mounting instructions — incorrect torque is a direct cause of thermal failure and must not be guessed.',
    },
  ],

  repair: [
    {
      level: 'component-replacement',
      title: 'Module and switching cell',
      steps: [
        'Replace modules that have been through a short-circuit event, even where static testing looks acceptable',
        'Replace gate resistors and damaged gate-drive components in the same operation',
        'Replace degraded DC bus capacitors identified by ESR testing',
        'Fit only the specified part; do not substitute on headline ratings alone',
      ],
      note: 'Static testing cannot see a partially degraded module. History matters as much as measurement here.',
    },
    {
      level: 'mechanical',
      title: 'Thermal path — as important as the electrical repair',
      steps: [
        'Apply thermal interface material as specified and torque mounting to the stated value and sequence',
        'Re-torque high-current terminal joints to specification',
        'Replace failed fans, clear blocked filters and airflow paths',
      ],
      note: 'Thermal cycling is the dominant wear-out mechanism for modules. A repair that does not restore the thermal path has a limited life.',
    },
    {
      level: 'board-level',
      title: 'Board repair',
      steps: [
        'Remove all carbonised material — it remains conductive',
        'Reconstruct damaged tracks to adequate current capacity',
        'Clean flux residue and restore conformal coating where the original had it',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond bench repair',
      steps: [
        'Refer multilayer damage, control-processor failure and unobtainable modules',
        'Provide measurements, photographs, event history and identified cause',
      ],
    },
  ],

  validation: [
    'Confirm gate isolation on every fitted device before power-up',
    'Confirm clean gate-drive waveform, including off-bias and dead-time, on every channel',
    'Bring the stage up on a current-limited supply and confirm expected current draw',
    'Confirm output waveform at no load before applying any load',
    'Apply load progressively while thermal-surveying the module and its joints',
    'Confirm even temperature distribution across switching positions — unevenness indicates poor sharing',
    'Confirm overload, short-circuit and desaturation protection respond correctly',
    'Run for an extended period under representative load before returning to service',
    'Record all readings, the parts fitted, torque values and the root cause identified',
  ],

  whenNotToRepair: [
    'Ruptured or cracked module housing with board damage beneath',
    'Carbonised substrate or multilayer board damage',
    'Repeated power-stage failure after competent repair, indicating an unresolved system cause',
    'Modules no longer obtainable except from unverified sources — counterfeit power semiconductors are common and fail early',
    'Missing or unobtainable firmware',
    'Repair cost approaching replacement value',
  ],

  prevention: [
    'Clean filters and heatsinks on a defined schedule',
    'Treat a failed cooling fan as an urgent fault',
    'Re-torque module mounting and high-current joints at service intervals',
    'Reduce unnecessary thermal cycling where the load profile allows, since cycling fatigue is the dominant wear-out mechanism',
    'Trend bus capacitor condition rather than waiting for failure',
    'Fit and maintain surge protection',
    'Investigate intermittent trips under load immediately — they are frequently the early warning of a degrading module',
  ],

  relatedSlugs: ['inverter-mosfet-failure-diagnosis', 'inverter-switches-off-under-load', 'pcb-short-circuit-diagnosis', 'vfd-drive-fault-diagnosis'],

  faq: [
    {
      q: 'My meter conducts one way across collector and emitter. Is the IGBT shorted?',
      a: 'Not necessarily — that is expected. Most power IGBTs carry a freewheeling diode co-packaged across collector and emitter, which conducts in the emitter-to-collector direction on a perfectly healthy device. A fault is indicated when it conducts in BOTH directions. Check gate-to-emitter isolation separately, because that can fail on its own.',
    },
    {
      q: 'The module tests fine on the bench but the unit trips under load. What is happening?',
      a: 'This is the classic signature of a partially degraded module. Modules contain several dies in parallel, and thermal cycling fatigues die-attach and bond wires. With some dies degraded, static testing looks acceptable while the survivors are overstressed under load. A module with this history should be replaced rather than passed.',
    },
    {
      q: 'What gate voltage should I apply to test it?',
      a: 'Take it from the manufacturer data sheet for that exact part — gate drive requirements, including any negative off-bias, are design-specific and there is no safe general figure. For field diagnosis you do not need to drive the gate at all: isolation testing plus diode-mode checks on the main terminals identify the great majority of failures.',
    },
    {
      q: 'Do I really need a torque wrench for the module bolts?',
      a: 'Yes. Mounting torque and the tightening sequence are specified by the module manufacturer and directly determine how well heat leaves the device. Under-torqued modules run hot and fail; over-torqued ones can be damaged mechanically. It is one of the few places where a specified figure genuinely must be followed rather than judged by feel.',
    },
  ],

  references: [
    'IEC 62477-1 — safety requirements for power electronic converter systems',
    'IEC 62109-1 and IEC 62109-2 — safety of power converters for photovoltaic systems',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies',
    'The module manufacturer\'s data sheet and mounting instructions for the exact part, which are the only valid source for pinout, ratings, gate-drive requirements and mounting torque referred to throughout',
  ],
};
