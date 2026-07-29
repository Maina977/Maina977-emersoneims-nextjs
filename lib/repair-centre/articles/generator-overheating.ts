import type { RepairArticle } from '../types';

export const generatorOverheating: RepairArticle = {
  slug: 'generator-overheating',
  hub: 'generators',
  header: {
    title: 'Generator Overheating and High Coolant Temperature Shutdown',
    equipmentCategory: 'Diesel generating sets — cooling system',
    appliesTo: 'Open and canopied diesel generating sets, single- and three-phase, standby and prime',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Moderate. The cause is usually airflow or coolant rather than the engine, and it is frequently visible before any instrument is used.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Awaiting independent named-engineer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Set output 240 V / 415 V 50 Hz nominal; cooling system per engine design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Work outwards from the air and the coolant before suspecting the engine. In practice the overwhelming majority of high-temperature shutdowns come down to heat not leaving the radiator: a core blocked externally with dust, chaff or oil mist, a canopy recirculating its own hot discharge air because a wall or another machine was placed too close after installation, a slipping or missing fan belt, or a failed viscous fan drive. Next comes coolant itself — level, concentration and whether the system is holding pressure, because a system that cannot hold pressure boils well below the temperature it was designed to reach. Only when air and coolant are proven should you move to thermostat, water pump, internal core fouling and finally head gasket. One critical safety point governs all of it: never open a hot pressurised cooling system. Wait until it has cooled, or you will be scalded by escaping coolant that flashes to steam the moment the cap is released.',

  symptoms: {
    display: [
      'High coolant temperature alarm followed by shutdown',
      'Coolant temperature climbing steadily under load and stabilising only when load is reduced',
      'Temperature reading implausibly high or low, which may indicate a sender fault rather than a real condition',
      'Repeated high-temperature shutdowns at the same point in a run',
    ],
    indicators: [
      'Temperature gauge in the red before shutdown',
      'Coolant level warning',
      'Charge-air or after-cooler temperature alarm on larger sets',
    ],
    sounds: [
      'Belt squeal on start or under load, indicating slip',
      'Fan noise absent or much reduced, which suggests a failed viscous drive',
      'Boiling or gurgling from the radiator or expansion tank after shutdown',
      'Combustion noise change, which may accompany a head gasket problem',
    ],
    smells: [
      'Sweet coolant smell, indicating a leak onto a hot surface',
      'Hot oil smell, which may indicate oil mist fouling the radiator core',
      'Exhaust smell inside the canopy, which points at recirculation or an exhaust leak',
    ],
    behaviour: [
      'Runs cool off-load and overheats only under load, which is the classic airflow or radiator capacity signature',
      'Overheats faster on hot afternoons, indicating the set is marginal for ambient conditions',
      'Began overheating after the set was enclosed, moved, or something was built near it',
      'Coolant loss with no visible external leak, which raises the possibility of an internal loss',
      'Overheats quickly from cold, which points more towards thermostat, pump or airflow blockage than gradual fouling',
    ],
    visible: [
      'Radiator core blocked with dust, chaff, seeds, insects or oil mist',
      'Coolant level in the expansion tank and radiator',
      'Fan belt condition and tension',
      'Fan blades damaged or missing',
      'Coolant leaks at hoses, clamps, water pump, core plugs and radiator seams',
      'Distance from the canopy discharge to walls, fences or other plant',
      'Radiator shroud missing or damaged, which lets air bypass the core',
      'Coolant colour and condition — oily, rusty or sludged coolant is a finding in itself',
    ],
  },

  whatItMeans: {
    plain:
      'The engine is producing more heat than the cooling system is getting rid of, so the protection shuts it down before damage occurs. That is the system working correctly. Usually the problem is that air cannot get through the radiator, or the coolant is low or wrong, rather than anything wrong with the engine itself.',
    technical:
      'An engine cooling system removes heat by circulating coolant through the block and head to a radiator, where a fan drives ambient air across the core. Heat rejection therefore depends on coolant flow, air mass flow, the temperature difference between coolant and ambient, and the cleanliness of the heat-transfer surfaces on both sides. The system is pressurised deliberately, because raising pressure raises the boiling point of the coolant and allows operation at temperatures that would otherwise cause local boiling at hot spots in the head; a cap or system that will not hold its rated pressure therefore permits boiling well below the design operating temperature, and produces overheating that no amount of radiator cleaning will resolve. Coolant concentration matters in both directions: too little inhibitor allows corrosion and scale that foul internal passages, while an excessive glycol proportion reduces specific heat capacity and actually worsens heat transfer. In canopied sets the dominant failure in service is recirculation — hot discharge air finding its way back to the intake because clearances assumed at design were lost when the installation was altered. Because heat rejection scales with the temperature difference to ambient, a set that is marginal will run acceptably on a cool morning and shut down on a hot afternoon at the same load, which is a capacity and installation issue rather than a fault.',
  },

  causes: {
    mostLikely: [
      'Radiator core externally blocked with dust, chaff, insects or oil mist',
      'Hot air recirculation in a canopy or plant room, usually after the installation was altered',
      'Coolant level low, or concentration incorrect',
      'Fan belt slipping, glazed, loose or broken',
    ],
    possible: [
      'Viscous fan drive or fan clutch failed, so the fan turns but moves little air',
      'Radiator cap or system not holding rated pressure',
      'Thermostat stuck closed or opening late',
      'Radiator shroud missing or damaged, letting air bypass the core',
      'Set operating above its rating, or ambient above the design assumption',
    ],
    lessCommon: [
      'Water pump impeller worn or failed',
      'Internal radiator or block passages fouled with scale and corrosion products',
      'Charge-air cooler blocked on turbocharged sets',
      'Head gasket failure putting combustion gas into the coolant',
      'Temperature sender or its wiring faulty, giving a false high reading',
    ],
    modelSpecific: [
      'Alarm and shutdown temperatures, thermostat rating and coolant specification are engine-specific — take them from the engine manufacturer\'s data',
      'Coolant type and inhibitor package differ by engine; mixing incompatible coolants causes gelling and blockage',
      'Belt tension is specified by the manufacturer and differs between belt types',
      'Some sets use a viscous or electronically controlled fan drive whose failure mode is reduced airflow rather than no airflow',
    ],
    environmental: [
      'High ambient temperature, which directly reduces heat rejection capacity',
      'Dusty environments, which is the leading cause of external core blockage in Kenya',
      'Agricultural sites with chaff, seed and plant debris',
      'Enclosed or poorly ventilated plant rooms',
      'Altitude, which reduces air density and therefore cooling and engine performance',
    ],
    installation: [
      'Canopy discharge too close to a wall, fence or other plant, causing recirculation',
      'Plant room ventilation openings undersized for the set',
      'Exhaust routed so its heat is drawn back into the intake',
      'Set sized without margin for local ambient conditions',
    ],
    maintenance: [
      'Radiator never cleaned externally',
      'Coolant never changed, so inhibitor is depleted and internal fouling has developed',
      'Belt tension never checked',
      'Pressure cap never tested — it is cheap and routinely overlooked',
      'Coolant topped up with plain water repeatedly, diluting the inhibitor',
    ],
    componentLevel: [
      'Thermostat failed',
      'Water pump failed or impeller eroded',
      'Viscous fan drive failed',
      'Radiator internally fouled or externally damaged',
      'Temperature sender or wiring faulty',
      'Head gasket failed',
    ],
  },

  safety: {
    isolation: [
      'Stop the set and prevent automatic restart before any work — a set in auto can start without warning',
      'Isolate the starting battery and lock off the control in the stopped position',
      'Isolate the set electrically at the output breaker before working around it',
      'Where a mains changeover exists, confirm the set cannot be called to start',
    ],
    lockoutTagout: [
      'Lock the control selector in stop or off, and tag it',
      'Disconnect and tag the starting battery',
      'Tag the changeover control so no one restores auto operation while work is in progress',
    ],
    ppe: [
      'Eye protection and gloves — coolant is hot and can be under pressure',
      'Heat-resistant gloves when working near a recently run engine',
      'Hearing protection when the set is running',
      'Long sleeves when working near rotating parts',
    ],
    storedEnergy: [
      'A hot cooling system is a pressure vessel and stays pressurised after shutdown',
      'The starting battery remains live',
      'Exhaust and turbocharger surfaces remain hot enough to cause serious burns long after shutdown',
    ],
    specificHazards: [
      'NEVER open a pressurised cooling system while hot. Releasing the cap drops the pressure, the superheated coolant flashes instantly to steam, and it will scald severely. Allow the system to cool before opening it — there is no safe technique for doing it hot.',
      'Rotating fan and belts — never check belt tension or reach into the fan area with the set able to start',
      'Hot exhaust, manifold and turbocharger surfaces cause immediate contact burns',
      'Coolant is toxic; do not leave it accessible to people or animals and dispose of it properly',
      'Running an overheating engine to "see how hot it gets" risks seizure, head damage or fire',
    ],
    stopAndCallProfessional: [
      'Coolant is being lost with no visible external leak',
      'There is oil in the coolant or coolant in the oil',
      'Combustion gas is suspected in the cooling system',
      'The set has been run hot to the point of power loss, knocking or seizure',
      'The correction requires altering the installation, ventilation or set sizing',
    ],
  },

  tools: [
    { tool: 'Infrared thermometer or thermal camera', why: 'Comparing temperature across the radiator core reveals blocked sections and internal fouling that look normal to the eye' },
    { tool: 'Cooling system pressure tester', why: 'Testing the cap and the system for their rated pressure — a cheap test that finds a commonly missed cause' },
    { tool: 'Coolant refractometer or hydrometer', why: 'Verifying concentration; both too weak and too strong are problems' },
    { tool: 'Combustion gas test kit for coolant', why: 'Detecting a head gasket failure without dismantling the engine' },
    { tool: 'Anemometer', why: 'Confirming airflow through the enclosure where recirculation is suspected' },
    { tool: 'Belt tension gauge', why: 'Tension is specified; judging it by thumb pressure is unreliable and slip causes overheating' },
    { tool: 'Digital multimeter', why: 'Checking the temperature sender and its wiring where a false reading is suspected' },
    { tool: 'Inspection light and mirror', why: 'Seeing the back face of the radiator core, where blockage usually accumulates unseen' },
  ],

  decisionTree: [
    { question: 'Is the engine still hot and the cooling system pressurised?', yes: 'Stop. Allow it to cool before opening anything.', no: 'Continue' },
    { question: 'Is there oil in the coolant, coolant in the oil, or unexplained coolant loss?', yes: 'Stop and escalate — this suggests an internal failure, not a cooling fault', no: 'Continue' },
    { question: 'Is the radiator core clear when viewed from BOTH faces?', yes: 'Continue', no: 'Clean the core properly and re-test before going further' },
    { question: 'Is the coolant at correct level and concentration?', yes: 'Continue', no: 'Correct it, and establish where the coolant went' },
    { question: 'Is the fan belt in good condition and correctly tensioned, and does the fan drive engage?', yes: 'Continue', no: 'Airflow is compromised — correct this first' },
    { question: 'Does the system hold its rated pressure, including the cap?', yes: 'Continue', no: 'A system that will not hold pressure boils below its design temperature — replace the cap or find the leak' },
    { question: 'Is hot discharge air recirculating back to the intake?', yes: 'An installation problem — no repair to the set will fix it', no: 'Continue' },
    { question: 'Does the set only overheat under load or in high ambient?', yes: 'Suspect capacity, sizing or internal fouling rather than a discrete failure', no: 'Investigate thermostat, water pump and sender' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Let it cool, then inspect both faces of the radiator',
      inspect: 'External blockage of the core, viewed from both the intake and discharge faces',
      where: 'At the radiator, with the set stopped, cool and locked off',
      instrument: 'Inspection light and mirror',
      expected: 'Light visible through the core across its whole area',
      ifAbnormal: 'Blockage usually accumulates on the face you cannot easily see. A core that looks clean from the front is frequently packed on the back.',
      next: 'Step 2',
      warning: 'Never open the cooling system while hot and pressurised. Wait for it to cool.',
    },
    {
      step: 2,
      title: 'Check coolant level, condition and concentration',
      inspect: 'Level, colour, contamination and inhibitor concentration',
      where: 'Radiator and expansion tank, system cool',
      instrument: 'Refractometer or hydrometer',
      expected: 'Correct level, clean coolant, concentration to the engine manufacturer\'s specification',
      ifAbnormal: 'Oily or rusty coolant is a finding in itself. Excessive glycol reduces heat transfer, so "more antifreeze" is not safer. Repeated topping up with plain water depletes the inhibitor.',
      next: 'Step 3',
      verify: 'The coolant specification and concentration for this engine — take it from the engine manufacturer\'s data, and never mix incompatible coolant types.',
    },
    {
      step: 3,
      title: 'Pressure-test the system and the cap',
      inspect: 'Whether the system and cap hold their rated pressure',
      where: 'At the filler, system cool',
      instrument: 'Cooling system pressure tester',
      expected: 'System and cap holding rated pressure',
      ifAbnormal: 'A system that cannot hold pressure boils well below its design temperature. This is a cheap, quick test that is routinely skipped and frequently the answer.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Check the fan, belt and drive',
      inspect: 'Belt condition and tension, fan blade condition, and whether a viscous drive engages',
      where: 'At the front of the engine, set stopped and locked off',
      instrument: 'Belt tension gauge, visual inspection',
      expected: 'Belt sound and correctly tensioned; fan intact; drive engaging when hot',
      ifAbnormal: 'A glazed or slipping belt moves far less air than it appears to. A failed viscous drive lets the fan turn without moving useful air, which is easy to miss because the fan is visibly spinning.',
      next: 'Step 5',
      warning: 'Never reach into the fan area unless the set is locked off and cannot start.',
      verify: 'Belt tension specification from the engine manufacturer — judging by thumb pressure is unreliable.',
    },
    {
      step: 5,
      title: 'Thermally survey the core under load',
      inspect: 'Temperature distribution across the radiator face while running under load',
      where: 'Across the whole core area',
      instrument: 'Thermal camera or infrared thermometer',
      expected: 'Reasonably even temperature gradient across the core',
      ifAbnormal: 'Cold patches indicate internal blockage in those tubes; uniformly small temperature drop across the core indicates inadequate airflow or coolant flow rather than fouling.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Check for recirculation and ventilation adequacy',
      inspect: 'Whether hot discharge air returns to the intake; clearances and ventilation openings',
      where: 'Around the canopy or in the plant room, set running',
      instrument: 'Anemometer, thermometer at intake and discharge',
      expected: 'Intake air close to ambient, discharge directed away with adequate clearance',
      ifAbnormal: 'Intake air significantly above ambient proves recirculation. This is an installation defect — often created after commissioning when a wall, fence or another machine was added — and no work on the set will correct it.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Verify the temperature reading is real',
      inspect: 'Sender output and wiring against an independent measurement',
      where: 'At the sender and with an infrared reading of the housing',
      instrument: 'Multimeter and infrared thermometer',
      expected: 'Displayed temperature agreeing with independent measurement',
      ifAbnormal: 'A faulty sender or chafed wiring produces shutdowns on a set that is not actually overheating. Confirm before dismantling any cooling components.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Then thermostat, pump, and finally internal causes',
      inspect: 'Thermostat operation, water pump condition, and evidence of combustion gas in the coolant',
      where: 'Thermostat housing, pump, and at the expansion tank',
      instrument: 'Thermometer, combustion gas test kit',
      expected: 'Thermostat opening as specified, pump circulating, no combustion gas present',
      ifAbnormal: 'Combustion gas in the coolant indicates head gasket failure and changes the job entirely. Test for it before condemning cooling components.',
      next: 'Refer internal engine faults for full assessment',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Airflow restoration — do this first',
      steps: [
        'Clean the radiator core thoroughly from the reverse direction to airflow, so debris is pushed out rather than deeper in',
        'Use low pressure and keep the nozzle square to the fins; high pressure at an angle bends fins and makes the blockage permanent',
        'Clear intake and discharge grilles and restore the radiator shroud if missing or damaged',
        'Correct terminations and clean the charge-air cooler on turbocharged sets',
      ],
      note: 'Cleaning from the wrong direction drives contamination into the core and is a common way of making the problem worse.',
    },
    {
      level: 'component-replacement',
      title: 'Cooling components',
      steps: [
        'Replace the pressure cap if it will not hold rated pressure — inexpensive and frequently the cause',
        'Replace slipping, glazed or cracked belts and tension to specification',
        'Replace a failed thermostat with the correct rating for the engine',
        'Replace a failed viscous fan drive or water pump',
        'Replace damaged hoses and clamps',
      ],
    },
    {
      level: 'mechanical',
      title: 'Installation and ventilation',
      steps: [
        'Restore clearances so discharge air cannot recirculate to the intake',
        'Enlarge or unblock plant-room ventilation openings',
        'Duct the discharge away where clearance cannot be achieved',
        'Re-route or re-lag exhaust where its heat is entering the intake',
      ],
      note: 'Where recirculation is the cause, this is the repair. Nothing done to the engine will substitute for it.',
    },
    {
      level: 'sensor-replacement',
      title: 'Sensing',
      steps: [
        'Replace a faulty temperature sender and repair chafed or corroded sender wiring',
        'Confirm the reading agrees with an independent measurement afterwards',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Internal faults',
      steps: [
        'Refer head gasket failure, internal coolant loss and suspected block or head damage for full assessment',
        'Provide the temperature records, pressure test results and gas test results',
      ],
    },
  ],

  validation: [
    'Run under representative load and confirm coolant temperature stabilises within the normal band',
    'Thermally survey the radiator core under load and confirm an even gradient',
    'Measure intake air temperature against ambient to confirm recirculation is resolved',
    'Confirm the system holds rated pressure after the work',
    'Confirm coolant level and concentration after the system has been run and topped up',
    'Verify the temperature reading agrees with an independent measurement',
    'Run for an extended period at the load and in the ambient conditions that previously caused shutdown, not on a cool morning at light load',
    'Record temperatures, ambient, load and all measurements in the maintenance record',
  ],

  whenNotToRepair: [
    'Radiator cores with widespread internal fouling or corrosion, where recoring or replacement is more economical than repeated cleaning',
    'Engines that have been run hot to the point of head or block damage',
    'Sets genuinely undersized for the site load and ambient, where the answer is sizing rather than repair',
    'Installations where required clearances cannot be achieved and ducting is not possible',
    'Obsolete engines where cooling components are unobtainable',
  ],

  prevention: [
    'Clean the radiator core externally on a schedule matched to the environment — monthly or more often in dusty and agricultural settings',
    'Change coolant at the engine manufacturer\'s interval; inhibitor depletion causes internal fouling long before anything is visible',
    'Never top up routinely with plain water, which dilutes the inhibitor',
    'Pressure-test the cap and system at every major service',
    'Check belt condition and tension at every service using a gauge',
    'Protect clearances around the set and treat any new wall, fence or plant nearby as a change requiring review',
    'Record coolant temperature under load at each service so a gradual rise is noticed before it becomes a shutdown',
    'Size sets with margin for local ambient temperature and altitude rather than to nominal ratings',
  ],

  relatedSlugs: ['generator-starts-then-stops', 'generator-low-oil-pressure-shutdown'],

  faq: [
    {
      q: 'Can I top up the coolant while the engine is hot?',
      a: 'Do not open the system while it is hot and pressurised. When the cap is released the pressure drops and the superheated coolant flashes to steam, which causes severe scalding. There is no safe technique for opening it hot — let it cool. If the set must run, the correct action is to stop it and wait, not to risk the injury.',
    },
    {
      q: 'The radiator looks clean but it still overheats. What am I missing?',
      a: 'Three things commonly. First, check the reverse face of the core — blockage accumulates where you cannot easily see it. Second, pressure-test the cap and system, because a system that will not hold pressure boils below its design temperature no matter how clean it is. Third, check for hot air recirculating back to the intake, which is an installation issue and very common in canopied sets after something was built nearby.',
    },
    {
      q: 'Should I add more antifreeze to help it run cooler?',
      a: 'No — that makes it worse. Glycol has a lower specific heat capacity than water, so an excessive concentration reduces the coolant\'s ability to carry heat away. Use the concentration specified by the engine manufacturer, which balances freeze and boil protection with corrosion inhibition and heat transfer.',
    },
    {
      q: 'It only overheats on hot afternoons under full load. Is it faulty?',
      a: 'Possibly not faulty, but marginal. Heat rejection depends on the temperature difference between the coolant and ambient air, so a set with little margin performs adequately on a cool morning and shuts down on a hot afternoon at the same load. Confirm the installation is not recirculating and the core is genuinely clean, then treat it as a sizing and ventilation question rather than a component fault.',
    },
  ],

  references: [
    'ISO 8528 — reciprocating internal combustion engine driven alternating current generating sets, including site condition derating',
    'ISO 3046 — reciprocating internal combustion engines: performance and declarations of power at stated reference conditions',
    'The engine manufacturer\'s service data for the specific engine, which is the only valid source for coolant specification and concentration, thermostat rating, belt tension, system pressure and alarm and shutdown temperatures referred to throughout',
  ],
};
