import type { RepairArticle } from '../types';

export const inverterMosfetFailureDiagnosis: RepairArticle = {
  slug: 'inverter-mosfet-failure-diagnosis',
  hub: 'inverters',
  header: {
    title: 'Inverter MOSFET Failure — Diagnosis and Board-Level Repair',
    equipmentCategory: 'Inverter power stage — component-level electronics',
    appliesTo: 'MOSFET output and boost stages in off-grid, hybrid and inverter-charger units. Method is general; every device value must come from the manufacturer data for the specific part.',
    difficulty: 'specialist',
    diagnosisComplexity: 'High. The failed device is usually easy to find; the reason it failed is not, and replacing it without finding that reason destroys the new one.',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'EmersonEIMS Engineering — pending named reviewer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Battery DC bus per system design; board-level work only with the bus proven discharged',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'A failed power MOSFET is normally straightforward to identify and dangerous to replace in isolation. Power MOSFETs overwhelmingly fail short between drain and source, so with the unit isolated and the DC bus proven discharged, a diode-mode check across drain and source will usually reveal a near-short where a healthy device reads as a diode in one direction and open in the other. The critical discipline is what follows. A shorted MOSFET has almost always taken its gate-drive circuit with it — commonly the gate resistor and the driver output stage — because the failure applies the bus to circuitry never intended to see it. Fitting a new MOSFET into a damaged gate drive destroys it within milliseconds of power-up, which is why the same board fails twice. Test the whole switching cell, replace every device in a parallel bank as a matched set, establish why the original failed, and bring the board up on a current-limited supply. Confirm the pinout and every device parameter from the manufacturer data for the exact part and package — never assume them from a similar-looking device.',

  symptoms: {
    display: [
      'No AC output with the unit otherwise apparently alive',
      'Overload or short-circuit fault latching immediately on start',
      'Output-stage or hardware fault indication',
      'Unit shutting down instantly on any attempt to produce output',
    ],
    indicators: [
      'Fault LED latched with no recoverable reset',
      'DC input fuse blown, often repeatedly',
      'Unit dead entirely where the failure also destroyed the auxiliary supply',
    ],
    sounds: [
      'A loud crack or bang at the moment of failure',
      'A brief buzz then silence on start-up',
      'Complete silence where protection has latched before switching begins',
    ],
    smells: [
      'Sharp burnt-electronics smell, often distinctly acrid',
      'Burnt phenolic or fibreglass smell, indicating the board substrate itself has been heated',
    ],
    behaviour: [
      'Failed during a heavy load step, motor start or short circuit on the output',
      'Failed after a period of running hot, or with a blocked filter or failed fan',
      'Failed shortly after a previous repair, which strongly indicates the gate drive was not repaired with it',
      'Blows the DC fuse immediately on every connection attempt',
      'Failed after a lightning or surge event',
    ],
    visible: [
      'Cratered, cracked or blown device packages',
      'Discoloured or carbonised PCB beneath or around the devices',
      'Lifted, vaporised or missing PCB tracks',
      'Discoloured or open gate resistors adjacent to the devices',
      'Heatsink compound dried out, or devices not properly clamped to the heatsink',
      'Bulged or vented electrolytic capacitors nearby',
    ],
  },

  whatItMeans: {
    plain:
      'One or more of the power switches that convert battery voltage into mains voltage has failed, usually by going short circuit. That is why the unit trips instantly or blows its fuse. Replacing just the burnt part is rarely enough — the circuit that drives it is normally damaged too, and a new part fitted into a damaged drive circuit fails immediately.',
    technical:
      'Power MOSFETs in an inverter output stage switch the DC bus into the transformer or filter at high frequency, under control of a gate-drive circuit that must present a well-defined voltage to the gate and remove the gate charge quickly. Because the gate is capacitive and isolated from the channel by a thin oxide, the device is unforgiving of both over-voltage on the gate and of slow switching, which forces it to dissipate energy in the linear region. The dominant failure mode is a drain-source short. When that occurs, the drain potential is presented back through the failed device to the gate node, so the gate resistor and the driver output stage are usually destroyed in the same event — which is why a MOSFET replaced in isolation fails again immediately. Devices are frequently operated in parallel banks to share current; a single failure changes the sharing for the survivors and stresses them, so the bank must be treated as a set. Root causes are typically thermal (blocked airflow, failed fan, degraded thermal interface, or clamping that never made proper contact), electrical (output overload or short circuit, bus over-voltage, shoot-through from a gate-drive fault), or environmental (surge or lightning). Establishing which of those applies is the difference between a repair that lasts and one that fails on the bench.',
  },

  causes: {
    mostLikely: [
      'Output overload or short circuit on the AC side',
      'Thermal failure — blocked airflow, failed cooling fan, or degraded thermal interface to the heatsink',
      'Gate-drive fault causing slow switching or shoot-through',
      'Consequential failure following an earlier fault that was not fully repaired',
    ],
    possible: [
      'DC bus over-voltage',
      'Motor or transformer inrush repeatedly exceeding the design',
      'Degraded DC bus capacitors raising ripple and stress on the switches',
      'Poor device mounting, so the package never made proper thermal contact',
    ],
    lessCommon: [
      'Lightning or surge damage',
      'Manufacturing or assembly defect in the original build',
      'Counterfeit or incorrectly specified replacement devices from a previous repair',
      'Control-board fault producing incorrect switching timing',
    ],
    modelSpecific: [
      'Device type, package, pinout and ratings differ by model — confirm every one from the manufacturer data for the exact part, never from a similar-looking device',
      'Parallel bank arrangements differ; the number of devices sharing current is design-specific',
      'Gate resistor values are design-specific and affect switching speed and stress — do not substitute by guess',
      'Some designs use isolated gate drivers, others bootstrap arrangements; the diagnosis of the drive differs accordingly',
    ],
    environmental: [
      'High ambient temperature and poor ventilation',
      'Dust accumulation on heatsinks and filters, which is the leading thermal cause in practice',
      'Humidity and salt air causing corrosion and tracking, particularly on the coast',
      'Insect or rodent ingress bridging conductors',
    ],
    installation: [
      'Unit installed in an enclosed space without the specified airflow',
      'Continuous operation near or above rating',
      'Load profile with repeated heavy inrush that the unit was never sized for',
      'Inadequate surge protection on long AC or DC runs',
    ],
    maintenance: [
      'Filters and heatsinks never cleaned',
      'Cooling fan failure not noticed until the power stage failed',
      'Thermal interface never inspected after a previous repair',
      'Earlier repair that replaced the switch but not the gate drive',
    ],
    componentLevel: [
      'MOSFET shorted drain to source',
      'Gate resistor open or drifted',
      'Gate driver output stage destroyed',
      'Gate-source protection component failed',
      'DC bus capacitors degraded, raising ripple current',
    ],
  },

  safety: {
    isolation: [
      'Isolate the DC, the AC input and output, and any solar source before any board work',
      'The battery bank cannot be switched off — remove the DC fuse and open the isolator',
      'A solar array is live in any daylight',
      'Prove dead at the board, immediately before starting work',
    ],
    lockoutTagout: [
      'Lock and tag every source: DC isolator, AC input, AC output and array isolator',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection — failed semiconductor packages can eject fragments, and capacitors can vent',
      'Insulated tools rated for the DC bus voltage',
      'ESD wrist strap and mat for all board handling',
      'Appropriate protection when soldering and using hot-air rework',
    ],
    storedEnergy: [
      'DC bus capacitors retain a lethal charge after disconnection. Measure the bus and confirm it has discharged before touching the board — never rely on a stated waiting time alone.',
      'Discharge through the manufacturer\'s specified means where one exists; discharging a large bus capacitor by shorting it can injure you and damage the board',
      'Re-check the bus after any period with the board disconnected, as some circuits can recover charge',
    ],
    specificHazards: [
      'NEVER apply full power to a board with a known shorted device. Doing so converts a repairable board into scrap and can cause an arc flash or fire. First power-up must always be through a current-limited supply.',
      'MOSFET gates are static-sensitive and can be destroyed by handling without ESD precautions, producing a device that fails in service days later',
      'Electrolytic capacitors that have been over-stressed can vent or burst',
      'A board that has been burnt may have carbonised substrate that remains conductive and will fail again even after component replacement',
    ],
    stopAndCallProfessional: [
      'The PCB substrate is carbonised, cratered or has lost tracks over an area',
      'The damage extends to the control board or a multilayer section',
      'You cannot verify the DC bus has discharged',
      'You do not have a current-limited supply for first power-up',
      'The manufacturer data for the exact devices is unavailable — do not proceed on assumption',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter with a diode-test function', why: 'Diode-mode checks across the switching devices, which is the primary identification method' },
    { tool: 'Current-limited bench power supply', why: 'The single most important tool here — it allows first power-up without destroying the new devices if a fault remains' },
    { tool: 'ESR meter', why: 'Assessing DC bus and supply capacitors, whose degradation is a frequent underlying cause' },
    { tool: 'Oscilloscope', why: 'Confirming the gate-drive waveform is present and clean before trusting a repaired stage under power' },
    { tool: 'Component tester or curve tracer', why: 'Comparative assessment of removed devices' },
    { tool: 'Thermal camera', why: 'Locating a hot device or joint during controlled power-up, before it fails' },
    { tool: 'Soldering station and hot-air rework station', why: 'Removing and fitting power devices without lifting pads or overheating the board' },
    { tool: 'ESD wrist strap and mat', why: 'MOSFET gates are static-sensitive; careless handling produces a delayed failure in service' },
    { tool: 'Manufacturer data sheet for the exact device and board reference', why: 'Pinout and every parameter must be confirmed, never assumed from a similar package' },
  ],

  decisionTree: [
    { question: 'Has the DC bus been measured and proven discharged?', yes: 'Continue', no: 'Stop. Do not touch the board until the bus is proven dead with a meter.' },
    { question: 'Is the PCB substrate carbonised, cratered or missing tracks over an area?', yes: 'Board repair is unlikely to be durable — assess for replacement', no: 'Continue' },
    { question: 'Do any devices read as a drain-source short in diode mode?', yes: 'Failed switch identified. Continue — do not stop here.', no: 'The switches may be intact; investigate gate drive, bus capacitors and control before condemning the stage' },
    { question: 'Do the gate resistors and gate-driver outputs test healthy?', yes: 'Continue', no: 'The drive was damaged with the switch. Repair the whole cell or the new device will fail on power-up.' },
    { question: 'Are all devices in the parallel bank being replaced as a matched set?', yes: 'Continue', no: 'Surviving devices have been stressed and current sharing will be uneven — replace the set' },
    { question: 'Has the reason for the original failure been established?', yes: 'Continue', no: 'Do not power up. A thermal or overload cause left unresolved will destroy the repair.' },
    { question: 'Is a current-limited supply available for first power-up?', yes: 'Proceed to controlled power-up and validation', no: 'Stop. First power-up at full power on a repaired stage risks destroying it and is unsafe.' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Isolate and prove the DC bus is discharged',
      inspect: 'DC bus voltage at the board',
      where: 'Across the DC bus capacitors',
      instrument: 'True-RMS multimeter',
      expected: 'Bus at a safe, near-zero potential and staying there',
      ifAbnormal: 'A charged bus is lethal. Discharge by the manufacturer\'s specified means and re-measure. Never assume a waiting period was sufficient.',
      next: 'Step 2',
      warning: 'This step is not optional and cannot be replaced by a stated discharge time.',
    },
    {
      step: 2,
      title: 'Inspect the board before testing anything',
      inspect: 'Device packages, board substrate, tracks, gate resistors, capacitors, heatsink mounting and thermal interface',
      where: 'Power stage and its immediate surroundings',
      instrument: 'Magnification and good lighting',
      expected: 'A clear picture of the extent of damage before any component is removed',
      ifAbnormal: 'Carbonised substrate or lost tracks over an area changes the decision from repair to replace. Photograph the board before disturbing it.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Diode-mode test every switching device',
      inspect: 'Drain-source behaviour of each device, in both polarities',
      where: 'At the device terminals, board de-energised',
      instrument: 'Multimeter on diode test',
      expected: 'A healthy device conducts as a diode in one direction and reads open in the other; a failed device typically reads near-short in both',
      ifAbnormal: 'A near-short in both directions identifies a failed device. Test every device, not just the visibly damaged one — undamaged-looking devices frequently fail with it.',
      next: 'Step 4',
      verify: 'The pinout for the exact part and package from the manufacturer data sheet before probing — assuming a pinout from a similar-looking device produces false conclusions.',
    },
    {
      step: 4,
      title: 'Compare devices in a parallel bank against each other',
      inspect: 'Relative readings across all devices sharing the same position',
      where: 'Across the parallel bank',
      instrument: 'Multimeter on diode test',
      expected: 'All devices in the bank reading closely alike',
      ifAbnormal: 'Comparative testing is valid and useful without any absolute reference figure: devices in the same position should behave the same, and one that differs is suspect.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Test the gate-drive circuit — the step most often skipped',
      inspect: 'Gate resistors, gate-source protection components and the driver output stage',
      where: 'Between the driver and each device gate',
      instrument: 'Multimeter, and comparison against the equivalent components on healthy channels',
      expected: 'Gate resistors intact and consistent between channels; no short from gate to source',
      ifAbnormal: 'A shorted switch normally destroys its gate resistor and driver output. Fitting a new device into a damaged drive destroys it on power-up. This is the single most common reason a board fails twice.',
      next: 'Step 6',
      verify: 'Gate resistor values from the board reference or manufacturer data — these are design-specific and affect switching stress; do not substitute by guess.',
    },
    {
      step: 6,
      title: 'Assess the DC bus capacitors',
      inspect: 'Capacitance and equivalent series resistance, plus physical condition',
      where: 'DC bus capacitors',
      instrument: 'ESR meter',
      expected: 'Consistent readings, no bulging or venting',
      ifAbnormal: 'Degraded bus capacitors raise ripple current and stress the switches. Leaving them in place is a common reason a repaired stage fails again later.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Establish why the device failed',
      inspect: 'Cooling fan operation, airflow path, filter condition, thermal interface, heatsink clamping, and the load history',
      where: 'Throughout the unit and at the installation',
      instrument: 'Inspection, thermal camera on the running system where safe',
      expected: 'A specific, identified cause — thermal, overload, drive fault or surge',
      ifAbnormal: 'A repair that does not address the cause fails again. If the cause cannot be established, say so plainly rather than assuming the failure was random.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Repair the whole switching cell, then power up current-limited',
      inspect: 'Gate-drive waveform and device temperature under controlled power',
      where: 'At the gate of each device, and across the stage',
      instrument: 'Current-limited bench supply, oscilloscope, thermal camera',
      expected: 'Clean gate drive on every channel and no device heating disproportionately',
      ifAbnormal: 'Rising current on the limited supply means a fault remains. Stop and investigate rather than raising the limit.',
      next: 'Proceed to full validation only after a clean current-limited power-up',
      warning: 'Never bring a repaired power stage up at full power first. The current-limited supply is what saves the repair when something has been missed.',
    },
  ],

  repair: [
    {
      level: 'component-replacement',
      title: 'The switching cell as a whole',
      steps: [
        'Replace all devices in a parallel bank as a matched set from the same batch, not only the failed one',
        'Replace gate resistors and any damaged gate-drive components in the same operation',
        'Replace degraded DC bus capacitors identified by ESR testing',
        'Use devices of the specified part number; do not substitute on the basis of a similar package or headline rating',
      ],
      note: 'Surviving devices in a bank have been stressed and will share current unevenly with new ones. Treating the bank as a set is not caution, it is the repair.',
    },
    {
      level: 'board-level',
      title: 'Board and track repair',
      steps: [
        'Remove all carbonised material; carbonised substrate remains conductive and will fail again',
        'Reconstruct lost tracks to an adequate current capacity',
        'Clean flux residue thoroughly and re-apply conformal coating where the original had it',
        'Inspect for lifted pads and repair properly rather than bridging with wire',
      ],
    },
    {
      level: 'mechanical',
      title: 'Thermal path and cooling',
      steps: [
        'Renew the thermal interface material and confirm correct clamping of every device to the heatsink',
        'Replace failed cooling fans and clear blocked airflow paths and filters',
        'Confirm the installation provides the specified ventilation',
      ],
      note: 'A perfect electrical repair in a unit that still cannot cool itself simply fails again.',
    },
    {
      level: 'manufacturer-level',
      title: 'When it leaves the bench',
      steps: [
        'Refer boards with multilayer damage, control-processor failure or unobtainable devices',
        'Provide the measurements, photographs and identified cause with the unit',
      ],
    },
  ],

  validation: [
    'Confirm clean, correct gate-drive waveform on every channel before any load is applied',
    'Bring the stage up on a current-limited supply and confirm current draw is as expected',
    'Confirm output waveform and voltage at no load',
    'Apply load progressively while monitoring device and heatsink temperature',
    'Thermal-survey the stage under sustained load — uneven device temperature indicates poor current sharing',
    'Confirm protection functions operate: overload and short-circuit response',
    'Run for an extended period under representative load before returning to service',
    'Document all readings, the devices fitted and the root cause identified',
  ],

  whenNotToRepair: [
    'Carbonised or cratered PCB substrate, where the board material itself is damaged',
    'Damage extending into multilayer sections or the control processor',
    'Repeated power-stage failure after a competent repair, which indicates an unresolved system-level cause',
    'Safety-critical or specified devices no longer obtainable, where only counterfeit or unverified parts are available',
    'Missing or unobtainable firmware',
    'Where the repair cost approaches the replacement value of the unit',
  ],

  prevention: [
    'Clean filters and heatsinks on a defined schedule — dust is the leading thermal cause in practice',
    'Monitor cooling fans and treat a failed fan as an urgent fault, not a cosmetic one',
    'Size the unit for the real load profile including inrush, not just steady-state demand',
    'Fit and maintain appropriate surge protection on long AC and DC runs',
    'Inspect the thermal interface after any repair that disturbs a device',
    'Trend DC bus capacitor condition at service intervals rather than waiting for failure',
    'Where a board has been repaired before, check the gate drive specifically — an incomplete earlier repair is a common cause',
  ],

  relatedSlugs: ['inverter-switches-off-under-load', 'inverter-will-not-switch-on'],

  faq: [
    {
      q: 'I replaced the blown MOSFET and it failed again immediately. Why?',
      a: 'Almost certainly because the gate-drive circuit was damaged in the original failure and was not repaired with it. When a MOSFET shorts, the bus is presented back to the gate node and typically destroys the gate resistor and the driver output. A new device fitted into that damaged drive fails within milliseconds. Test and repair the whole switching cell, then bring it up on a current-limited supply.',
    },
    {
      q: 'Can I replace just the one device that tested short?',
      a: 'Not in a parallel bank. The surviving devices carried the fault current and have been stressed, and mixing them with a new device gives uneven current sharing that leads to another failure. Replace the bank as a matched set from the same batch.',
    },
    {
      q: 'What resistance should I read across a healthy MOSFET?',
      a: 'There is no single figure to quote, and any article that gives you one for a device it has not identified is guessing. Use diode mode rather than resistance, and use comparison: devices in the same position on the same board should behave alike, and one that differs is suspect. For absolute parameters, take them from the manufacturer data sheet for that exact part and package.',
    },
    {
      q: 'Is it safe to just power it up and see what happens?',
      a: 'No. Powering a board with a shorted device converts a repairable board into scrap and risks arc flash or fire. First power-up must be through a current-limited supply, which reveals a remaining fault as rising current instead of destroying the repair.',
    },
  ],

  references: [
    'IEC 62109-1 and IEC 62109-2 — safety of power converters for use in photovoltaic power systems',
    'IEC 62477-1 — safety requirements for power electronic converter systems',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies, including track reconstruction',
    'The device manufacturer\'s data sheet for the exact part and package, which is the only valid source for pinout, ratings and parameters referred to throughout this guide',
  ],
};
