import type { RepairArticle } from '../types';

export const pumpRunsContinuously: RepairArticle = {
  slug: 'pump-runs-continuously',
  hub: 'pumps',
  header: {
    title: 'Pump Runs Continuously and Will Not Shut Off',
    equipmentCategory: 'Water pump systems — pressure control, tanks and leakage',
    appliesTo: 'Borehole, booster and transfer pumps under pressure-switch, level or variable-speed control',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low. The system either cannot reach cut-out pressure or is being told not to stop, and one gauge reading separates the two.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'Single-phase 240 V or three-phase 415 V 50 Hz nominal; pump rating per nameplate',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Watch the pressure gauge while the pump runs, because that single observation splits the fault immediately. If pressure rises and holds at or above the cut-out setting while the pump keeps running, the pump is doing its job and the control is not stopping it, so the fault is the pressure switch, its tube or its wiring. If pressure will not reach cut-out, the pump cannot achieve the setting against the demand, and the causes are a leak somewhere in the system, a tap or valve left open, worn pump hydraulics, or a cut-out set higher than the pump can deliver. On a borehole the most common version of the second case is drawdown: the water level falls below what the pump needs and delivery collapses, so pressure never builds. A continuously running pump is not a nuisance to be tolerated. It wastes energy, and on a submersible it removes the cooling flow the motor depends on, so a pump left running against no delivery destroys itself.',

  symptoms: {
    display: [
      'Pressure gauge reading below the cut-out setting while the pump runs',
      'Pressure at or above cut-out with the pump still running',
      'Pressure oscillating rapidly, indicating short cycling rather than continuous running',
      'Controller or variable-speed drive showing continuous demand',
      'Dry-run protection tripping after a period of running',
    ],
    indicators: [
      'Pump contactor permanently energised',
      'Pressure switch contacts visibly closed with pressure present',
      'Run-hours meter climbing far faster than the duty should produce',
    ],
    sounds: [
      'Pump running without interruption, including overnight when there is no draw',
      'Water audibly running somewhere in the system when all outlets are closed',
      'Cavitation noise, suggesting the pump is starved',
      'Rapid contactor chatter, which is short cycling and a different fault',
    ],
    smells: [
      'Hot motor smell on a surface pump, which follows continuous running',
      'Burnt smell at the starter or pressure switch contacts',
      'Damp or musty smell near buried pipework, which can indicate an underground leak',
    ],
    behaviour: [
      'Runs continuously only at certain times, which usually means a genuine draw somewhere',
      'Ran normally until a tap, float valve or fitting was worked on',
      'Pressure builds then falls back quickly when the pump stops, which points at a leak or a waterlogged tank',
      'Pressure never reaches cut-out at all, pointing at pump capability or drawdown',
      'Started after the cut-out setting was adjusted upward',
      'Runs continuously and delivers little, which on a submersible is urgent',
    ],
    visible: [
      'Pressure gauge reading against the switch settings',
      'Pressure switch condition, and whether its sensing tube or port is blocked',
      'Pressure vessel — whether it is waterlogged and has lost its air charge',
      'Visible leaks at fittings, valves, float valves and tanks',
      'Ground softness or unexplained wet patches over buried pipework',
      'Overflow running at a storage tank, which is a leak by another name',
      'Non-return valve condition',
    ],
  },

  whatItMeans: {
    plain:
      'The pump keeps running because either it cannot build enough pressure to satisfy the switch, or it has built the pressure and nothing is telling it to stop. Watching the gauge while it runs tells you which. Continuous running is not harmless: it wastes power and, on a borehole pump, removes the water flow that cools the motor.',
    technical:
      'A pressure-controlled system stops the pump when system pressure reaches the cut-out setting and restarts it at cut-in. Continuous running therefore has two distinct origins. In the first, pressure reaches or exceeds cut-out and the pump still runs, which isolates the fault to the control path: a pressure switch whose contacts have welded or whose diaphragm has failed, a blocked sensing port or tube so the switch never sees system pressure, or a wiring fault holding the contactor in. In the second, pressure never reaches cut-out, meaning the pump cannot achieve the setting against the demand present. That demand may be legitimate draw, or leakage, which behaves identically from the pump\'s perspective — a running tap, a passing float valve, a leaking underground main and a tank overflowing all present as continuous consumption. Alternatively the pump may no longer be capable: eroded impellers and wear rings reduce developed head while drawing near-normal current, and on a borehole a falling pumping level starves the intake so delivery collapses regardless of pump condition. A waterlogged pressure vessel does not cause continuous running but does cause rapid cycling, and the two are frequently confused. The urgency differs by pump type: a surface pump running against a closed head overheats the pumped water and the mechanical seal, while a submersible depends on flow past the motor for cooling, so running with no delivery destroys it quickly.',
  },

  causes: {
    mostLikely: [
      'Leak in the system — a passing float valve, running overflow, faulty fitting or underground main',
      'Outlet, tap or valve left open somewhere on the system',
      'Cut-out pressure set higher than the pump can deliver',
      'Pressure switch failed, contacts welded, or sensing port blocked',
    ],
    possible: [
      'Borehole drawdown, so delivery collapses and pressure never builds',
      'Worn pump impellers and wear rings reducing developed head',
      'Non-return valve passing, allowing the system to drain back',
      'Blocked strainer or filter starving the pump',
      'Pressure vessel waterlogged, though this normally causes cycling rather than continuous running',
    ],
    lessCommon: [
      'Wiring fault or contactor with welded contacts holding the pump on',
      'Control set to manual or hand rather than auto',
      'Variable-speed drive configured for continuous operation',
      'Gauge reading incorrectly, so the system is actually satisfied',
      'Pump running in reverse rotation on a three-phase installation, giving reduced head',
    ],
    modelSpecific: [
      'Cut-in and cut-out settings and their differential are adjustable and specific to the installation — take them from the system design rather than assuming',
      'Pressure vessel pre-charge is set relative to cut-in pressure and is manufacturer-specified',
      'Pump duty point comes from the curve for that specific pump; do not assume it can reach any chosen setting',
      'Variable-speed pump controllers behave differently from pressure switches and are configured rather than set mechanically',
    ],
    environmental: [
      'Seasonal water table fall reducing borehole yield',
      'Ground movement damaging buried pipework',
      'Rodent or root damage to exposed pipe runs',
      'Freezing or thermal movement stressing fittings, less common but real at altitude',
    ],
    installation: [
      'Cut-out set beyond the pump curve at the required flow',
      'Pump undersized for the system head and demand',
      'No isolation valves, making leak location difficult',
      'Float valves fitted without overflow warning, so a passing valve goes unnoticed',
      'Long pipe runs with no means of sectional isolation for testing',
    ],
    maintenance: [
      'Pressure switch settings never verified against the gauge',
      'Pressure vessel pre-charge never checked',
      'Run hours never monitored, so a change in duty goes unnoticed',
      'Float valves and overflows never inspected',
      'Water levels never recorded on borehole systems',
    ],
    componentLevel: [
      'Pressure switch diaphragm or contacts failed',
      'Sensing tube or port blocked',
      'Non-return valve passing',
      'Pump impellers and wear rings eroded',
      'Contactor contacts welded',
    ],
  },

  safety: {
    isolation: [
      'Isolate the pump at its starter, lock off and prove dead before electrical work',
      'Confirm automatic control — pressure switch, level probe or building system — cannot restart it',
      'Relieve system pressure before opening any fitting',
      'Where a variable-speed drive is fitted, its DC bus remains charged after isolation',
    ],
    lockoutTagout: [
      'Lock and tag the pump starter',
      'Tag the pressure switch or level control specifically, since that is what restarts the pump unexpectedly',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection when working on pressurised pipework',
      'Insulated tools for electrical work',
      'Gloves and safety footwear for pipework handling',
      'Fall protection where working over an open borehole or tank',
    ],
    storedEnergy: [
      'Pipework and pressure vessels stay pressurised after the pump stops and must be relieved before opening',
      'A pressure vessel holds compressed air as well as water and can discharge violently',
      'Drive DC bus capacitors retain a lethal charge',
      'Elevated storage tanks hold a static head that does not disappear when the pump stops',
    ],
    specificHazards: [
      'A SUBMERSIBLE PUMP RUNNING WITHOUT DELIVERY IS DESTROYING ITSELF. The motor is cooled by water flowing past it, so continuous running against no flow overheats it within minutes. Stop it before diagnosing.',
      'Never open a fitting on a pressurised system — relieve pressure first and confirm at the gauge.',
      'An open borehole or tank is a fall hazard and must be covered or guarded whenever not being worked on.',
      'Water and electricity share the wellhead and plant room; a damaged cable can make pipework live.',
      'A surface pump running against a closed head heats the pumped water and can scald when a fitting is opened.',
    ],
    stopAndCallProfessional: [
      'A submersible pump has been running without delivery for an extended period',
      'There is any indication that pipework or casing is electrically live',
      'An underground leak is suspected and cannot be located without excavation',
      'Borehole yield decline is suspected, which needs hydrogeological assessment',
      'The pressure vessel is corroded or its condition is doubtful',
    ],
  },

  tools: [
    { tool: 'Pressure gauge, ideally independent of the installed one', why: 'The whole diagnosis turns on whether pressure reaches cut-out, so a suspect gauge must be cross-checked' },
    { tool: 'True-RMS clamp meter', why: 'Running current against nameplate; a worn pump draws less while delivering less' },
    { tool: 'Dip meter', why: 'Pumping water level on borehole systems, where drawdown prevents pressure building' },
    { tool: 'Flow meter or a timed volumetric measurement', why: 'Establishing actual consumption, which identifies leakage as continuous draw' },
    { tool: 'Tyre-type pressure gauge for the vessel pre-charge', why: 'Checking pressure vessel charge with the system depressurised' },
    { tool: 'Multimeter', why: 'Pressure switch contact state and control wiring' },
    { tool: 'System schematic and the pump curve', why: 'Judging whether the cut-out setting is achievable at the required flow' },
  ],

  decisionTree: [
    { question: 'Is this a submersible pump running with little or no delivery?', yes: 'STOP it now — it is destroying itself through loss of cooling flow', no: 'Continue' },
    { question: 'Watching the gauge: does pressure REACH the cut-out setting?', yes: 'The control is at fault — pressure switch, sensing port or wiring', no: 'The system cannot reach the setting — continue' },
    { question: 'Is every outlet, tap and valve on the system closed?', yes: 'Continue', no: 'That is the demand. Close it and re-test.' },
    { question: 'Is any float valve passing, or any overflow running?', yes: 'That is a leak by another name and looks identical to genuine draw', no: 'Continue' },
    { question: 'With everything closed, does pressure hold when the pump is stopped?', yes: 'No leak — the pump or its setting is the issue', no: 'A leak is present; isolate section by section to locate it' },
    { question: 'On a borehole: is the pumping level above the intake?', yes: 'Continue', no: 'Drawdown is starving the pump — a yield problem, not a pressure fault' },
    { question: 'Is the cut-out setting achievable on the pump curve at the required flow?', yes: 'Suspect hydraulic wear', no: 'The setting is beyond the pump — lower it or change the pump' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Stop a submersible running without delivery',
      inspect: 'Whether the pump is submersible and whether it is delivering',
      where: 'At the outlet and the wellhead',
      instrument: 'Observation',
      expected: 'A decision taken before any further diagnosis',
      ifAbnormal: 'A submersible depends on flow past the motor for cooling. Running against no delivery destroys it within minutes, so this comes before everything else.',
      next: 'Step 2',
      warning: 'Do not leave it running while you investigate.',
    },
    {
      step: 2,
      title: 'Watch the gauge while the pump runs',
      inspect: 'Whether system pressure reaches the cut-out setting',
      where: 'At the system pressure gauge',
      instrument: 'Installed gauge, cross-checked with an independent one if suspect',
      expected: 'A clear answer: reaches cut-out, or does not',
      ifAbnormal: 'This single observation splits the fault. Reaching cut-out and still running means the control path. Never reaching it means demand, leakage or pump capability.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'If pressure reaches cut-out: test the control path',
      inspect: 'Pressure switch contacts, sensing port and tube, and control wiring',
      where: 'At the pressure switch and starter',
      instrument: 'Multimeter, with the system isolated for wiring checks',
      expected: 'Contacts opening at the set pressure',
      ifAbnormal: 'A blocked sensing port means the switch never sees system pressure, so it never opens. Welded contacts or a wiring fault hold the contactor in regardless of the switch.',
      next: 'Step 8',
    },
    {
      step: 4,
      title: 'If pressure will not build: close everything and re-test',
      inspect: 'Every outlet, tap, valve and appliance on the system',
      where: 'Throughout the installation',
      instrument: 'Systematic inspection',
      expected: 'Pressure building once genuine draw is removed',
      ifAbnormal: 'An outlet left open is a common and immediately explanatory finding, and costs nothing to check before any component is suspected.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Hunt for leakage, including the kinds that look like use',
      inspect: 'Float valves passing, overflows running, visible leaks, and wet ground over buried pipework',
      where: 'Tanks, fittings, valves and along pipe runs',
      instrument: 'Inspection; sectional isolation where valves permit',
      expected: 'No consumption with all outlets closed',
      ifAbnormal: 'A passing float valve or a running overflow presents to the pump exactly as a genuine draw does. Isolating section by section localises an underground leak without excavation.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Test whether the system holds pressure with the pump stopped',
      inspect: 'Pressure decay after the pump is stopped and all outlets closed',
      where: 'At the gauge',
      instrument: 'Pressure gauge and a clock',
      expected: 'Pressure holding steady',
      ifAbnormal: 'Falling pressure with everything closed proves leakage or a passing non-return valve. Rapid loss points at the non-return valve or a substantial leak.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'On boreholes: measure the pumping water level',
      inspect: 'Water level while the pump runs, against the intake depth',
      where: 'Down the borehole via the dip tube',
      instrument: 'Dip meter',
      expected: 'Pumping level comfortably above the intake',
      ifAbnormal: 'Drawdown below the intake starves the pump, so pressure never builds regardless of pump condition. That is a yield and duty problem, and dry-run protection is essential on such an installation.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Compare the cut-out setting against the pump curve, and check current',
      inspect: 'Whether the setting is achievable at the required flow, and running current against nameplate',
      where: 'System settings, pump curve, and at the starter',
      instrument: 'Pump curve, clamp meter',
      expected: 'Setting within the pump capability; current consistent with the duty',
      ifAbnormal: 'A cut-out set beyond what the pump can deliver produces permanent running by design. Current below nameplate alongside poor delivery is consistent with eroded hydraulics rather than ruling a fault out.',
      next: 'Correct the identified cause and validate',
      verify: 'The pump duty point from its curve, and the intended cut-in and cut-out settings from the system design.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Leakage and demand',
      steps: [
        'Repair leaking fittings, valves and pipework',
        'Replace or adjust passing float valves and stop running overflows',
        'Clear blocked strainers and filters',
        'Clear a blocked pressure switch sensing port or tube',
      ],
      note: 'Leakage is the commonest cause and the cheapest to fix once located.',
    },
    {
      level: 'component-replacement',
      title: 'Control and valves',
      steps: [
        'Replace a failed pressure switch rather than adjusting around it',
        'Replace a passing non-return valve',
        'Replace welded contactor contacts',
        'Recharge or replace a pressure vessel that has lost its air charge',
      ],
    },
    {
      level: 'configuration',
      title: 'Settings and protection',
      steps: [
        'Set cut-in and cut-out to values the pump can actually achieve at the required flow',
        'Fit dry-run or low-water protection on any borehole installation without it',
        'Configure variable-speed controllers to the intended duty rather than continuous operation',
      ],
      note: 'Where the setting exceeds the pump curve, lowering it is the fix. Raising the pump to meet an arbitrary setting is not.',
    },
    {
      level: 'mechanical',
      title: 'Pump condition',
      steps: [
        'Replace worn impellers and wear rings, or the pump, where hydraulic wear is confirmed',
        'Correct reverse rotation on three-phase installations',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Borehole and system design',
      steps: [
        'Refer suspected yield decline for hydrogeological assessment',
        'Refer systems where demand genuinely exceeds pump capability for redesign',
        'Provide water level records, pressure readings and flow measurements',
      ],
    },
  ],

  validation: [
    'Confirm the pump reaches cut-out and stops',
    'Confirm it restarts at cut-in and cycles normally rather than short cycling',
    'Confirm pressure holds with the pump stopped and all outlets closed',
    'Measure running current against nameplate and record it',
    'On boreholes, confirm the pumping level stabilises above the intake',
    'Confirm dry-run protection operates by testing it',
    'Monitor run hours over a period to confirm the duty has returned to normal',
    'Record settings, pressures, water levels and the cause identified',
  ],

  whenNotToRepair: [
    'Where demand genuinely exceeds pump capability — that is a sizing question, not a repair',
    'Boreholes whose yield can no longer sustain the duty',
    'Corroded pressure vessels, which are a pressure hazard and should be replaced',
    'Extensively leaking buried pipework, where sectional replacement is more economical than repeated repairs',
    'Pumps with widespread hydraulic wear where replacement costs less than rebuilding',
  ],

  prevention: [
    'Fit dry-run protection on every borehole pump — continuous running without delivery is what destroys them',
    'Monitor run hours; a rising trend reveals leakage long before anyone notices water loss',
    'Inspect float valves and overflows at every service visit, since a passing valve is silent and continuous',
    'Check pressure vessel pre-charge at service, with the system depressurised',
    'Record cut-in and cut-out settings so an unintended adjustment is detectable',
    'Fit sectional isolation valves on long runs so leaks can be located without excavation',
    'Record borehole water levels so yield decline is visible before it causes failures',
  ],

  relatedSlugs: ['borehole-pump-no-water-delivery'],

  faq: [
    {
      q: 'The pump never stops. Is the pressure switch faulty?',
      a: 'Watch the gauge before deciding. If pressure reaches the cut-out setting and the pump still runs, then yes — the switch, its sensing port or the wiring is at fault. If pressure never gets there, the switch is behaving correctly and the problem is that the system cannot reach the setting: a leak, an open outlet, worn hydraulics, or a cut-out set beyond what the pump can deliver.',
    },
    {
      q: 'We cannot find any leak, but the pump runs constantly. Where else should we look?',
      a: 'At the things that leak without looking like leaks. A float valve passing into a storage tank, or an overflow quietly running, presents to the pump exactly as a genuine draw does and is easy to walk past. Also check whether pressure holds when the pump is stopped with everything closed — if it falls, there is consumption or a passing non-return valve somewhere, and sectional isolation will localise it.',
    },
    {
      q: 'Is continuous running actually harmful, or just wasteful?',
      a: 'Harmful, and on a borehole urgently so. A submersible motor is cooled by water flowing past it, so a pump running with little or no delivery overheats within minutes and destroys itself. A surface pump running against a closed head heats the pumped water and damages the mechanical seal. It is not a condition to tolerate while you get round to it.',
    },
    {
      q: 'Someone raised the cut-out pressure and now it never stops. Why?',
      a: 'Because the setting is probably now beyond what the pump can deliver at that flow. A pump has a curve, and above its capability at the required flow the pressure simply never arrives, so the switch never opens. Check the setting against the pump curve and bring it back to something achievable — the fix is the setting, not the pump.',
    },
  ],

  references: [
    'ISO 9906 — rotodynamic pumps: hydraulic performance acceptance tests',
    'IEC 60034-1 — rotating electrical machines: rating and performance',
    'EN 12845 and local water regulations where the system serves fire or potable duty — verify current requirements directly',
    'The pump manufacturer\'s curve and nameplate, and the pressure vessel and switch documentation, which are the only valid sources for duty point, pre-charge and switch settings referred to throughout',
  ],
};
