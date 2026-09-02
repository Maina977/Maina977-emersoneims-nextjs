import type { RepairArticle } from '../types';

export const upsBatteryReplacement: RepairArticle = {
  slug: 'ups-battery-replacement',
  hub: 'ups',
  header: {
    title: 'Replacing a UPS Battery String Safely',
    equipmentCategory: 'UPS battery systems — replacement and commissioning',
    appliesTo: 'VRLA and lithium battery strings in single- and three-phase UPS systems, cabinet and rack mounted',
    difficulty: 'advanced',
    diagnosisComplexity: 'Not a diagnosis. This is a planned operation where the risks are electrical, chemical and commercial, and where the load is unprotected throughout.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'DC string voltage per UPS design; UPS supply 240 V / 415 V 50 Hz nominal',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Plan this as an operation rather than a task, because the load has no battery protection from the moment the string is opened until the new one is charged, and that window is longer than most people expect. Establish first that the load can run unprotected, or arrange an alternative. Replace the string as a complete matched set from one batch: mixing new blocks with old is a false economy, because the old blocks drag the new ones down and the fault returns within months. A battery string cannot be switched off, so treat every block as live throughout, use insulated tools without exception, and break the string into sections before handling rather than working across the full string voltage. Before recommissioning, confirm the charger settings match the chemistry actually installed, which is the step most often missed after a change of battery type. Then record installation dates, a commissioning impedance baseline and a proven autonomy figure, because without those the next engineer inherits exactly the blind spot that led to this replacement.',

  symptoms: {
    display: [
      'Battery test failed, or replace battery indication',
      'Autonomy far below the design figure',
      'Event log showing repeated battery test failures over weeks or months',
      'Battery fault following a mains outage the string could not support',
    ],
    indicators: [
      'Battery indication not reaching full after extended mains operation',
      'UPS transferring to battery and returning almost immediately',
      'Battery circuit breaker open or fuse blown',
    ],
    sounds: [
      'Alarm accompanying a battery fault',
      'Cooling fans working harder where battery heat is raising cabinet temperature',
    ],
    smells: [
      'Acid or sulphurous smell at the cabinet, indicating over-charging, venting or a failing block',
      'Any burnt smell means stop and investigate before touching the string',
    ],
    behaviour: [
      'Autonomy shortening progressively over months, which is normal ageing reaching its end',
      'String well beyond its design life, frequently accelerated by a warm battery room',
      'A previous partial replacement, leaving mixed ages in one string',
      'Batteries warm to the touch, which indicates over-charging rather than under-charging',
      'Replacement string failing early, which usually means the environment or charging was never corrected',
    ],
    visible: [
      'Battery case swelling, distortion, leakage or terminal corrosion — any of these is a stop-work finding',
      'Installation date labels and block serial numbers',
      'Interconnect condition and evidence of heat at terminals',
      'Battery room or cabinet temperature and whether cooling is provided',
      'Charger settings and the battery type they are configured for',
    ],
  },

  whatItMeans: {
    plain:
      'The batteries have reached the end of their useful life and need replacing. The job itself is straightforward, but three things make it risky: the batteries are always live and cannot be switched off, the protected equipment has no backup while the work is done, and if the charger is set for the wrong battery type afterwards the new set will fail early too.',
    technical:
      'A UPS battery string is a series arrangement whose terminal voltage exists whenever the blocks are connected, so it cannot be de-energised, only sectioned. Replacement is therefore performed on a live DC source capable of very high fault current, which is why insulated tools and sectioning are procedural requirements rather than good practice. The commercial risk sits alongside the electrical one: from the moment the string is opened the UPS has no stored energy, so the load runs on rectifier and inverter with no ride-through, and any mains disturbance during the work drops it. Strings must be replaced as a complete matched set because series performance is limited by the weakest block, and mixing service ages guarantees the older blocks constrain the new ones and fail early. After installation the charging regime determines the life of the new string: float and boost voltages are chemistry-specific, temperature compensation adjusts them against battery temperature, and a charger left configured for a previous battery type will chronically over- or under-charge the replacement. Because VRLA life follows an Arrhenius relationship in which sustained operation above the design temperature roughly halves service life for every 8 to 10 °C of rise, an uncorrected warm battery room will consume the new string on the same timescale as the old one, which is why environment is treated here as part of the job rather than a separate recommendation.',
  },

  causes: {
    mostLikely: [
      'String at or beyond service life',
      'Battery room temperature well above the design assumption, having shortened life',
      'One or more blocks failed, limiting the whole string',
      'Previous partial replacement leaving mixed ages in one string',
    ],
    possible: [
      'Charger float voltage set for the wrong chemistry, causing chronic over- or under-charging',
      'Temperature compensation sensor failed or badly located',
      'Repeated deep discharges from frequent or extended outages',
      'Interconnect resistance raising local heating',
    ],
    lessCommon: [
      'Manufacturing defect in a block',
      'Charger fault over-charging the string',
      'Battery monitoring system misreporting, so a healthy string is replaced unnecessarily',
      'Physical damage during earlier work',
    ],
    modelSpecific: [
      'Float and boost voltages are chemistry-specific and must come from the battery documentation for the blocks actually fitted',
      'Lithium strings are managed by a BMS and the UPS may require a matching protocol selection',
      'Interconnect torque values are specified by the battery manufacturer',
      'Some UPS models inhibit charging above a defined battery temperature',
      'Battery test behaviour and what a test failure means differ between UPS models',
    ],
    environmental: [
      'Warm battery room, which is the dominant determinant of VRLA life',
      'Poor ventilation around the cabinet',
      'Dust and humidity causing terminal corrosion',
      'Very low temperature reducing available capacity',
    ],
    installation: [
      'Battery space with no dedicated cooling despite the design assuming it',
      'Undersized interconnects or long cable runs',
      'String sized for energy without regard to the discharge rate required',
      'Temperature sensor not fitted or not mounted at the battery',
    ],
    maintenance: [
      'Capacity never tested, only voltage checked',
      'Installation dates never recorded, so string age is unknown',
      'Interconnects never re-torqued',
      'No commissioning impedance baseline, so degradation could never be trended',
    ],
    componentLevel: [
      'Individual blocks failed, open or shorted',
      'Interconnect corroded or loose',
      'Battery fuse or circuit breaker degraded',
      'Temperature sensor failed',
    ],
  },

  safety: {
    isolation: [
      'A battery string cannot be switched off. It is live whenever connected and can deliver very high fault current.',
      'Open the battery circuit breaker or remove the battery fuse, then section the string before handling blocks',
      'Isolate the UPS input and confirm the load has an alternative supply or may be dropped',
      'Remember an online UPS supports load through several paths — isolating one does not make the unit safe',
      'Prove dead at the point of work, and treat every block as live regardless',
    ],
    lockoutTagout: [
      'Lock off and tag the battery isolator and the UPS input',
      'Confirm in writing with the site that the load will be unprotected for the duration',
      'Where a maintenance bypass carries the load, verify it is genuinely carrying it before proceeding',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection at all times near a battery installation',
      'Acid-resistant gloves and apron for VRLA work',
      'Insulated tools rated for the full string voltage',
      'Remove watches, rings, chains and metal bracelets before starting',
      'Arc-rated protection appropriate to the prospective fault energy of the string',
    ],
    storedEnergy: [
      'The full string voltage appears across the ends of a series string even though each block is low voltage',
      'The UPS DC bus and its capacitors remain charged after shutdown',
      'Removed batteries remain live and must be handled and stored as live items',
      'Lead-acid batteries vent hydrogen; ventilate before and during the work',
    ],
    specificHazards: [
      'A dropped tool across battery terminals welds instantly and can rupture the battery or cause it to explode. Insulated tools are not optional, and jewellery must be removed before you start rather than when you notice it.',
      'DC arcs do not self-extinguish as AC arcs do, which makes a DC short far more dangerous than the voltage suggests.',
      'SECTION the string before handling blocks so you are never working across the full string voltage.',
      'Never work on a battery that is swollen, hot, leaking or damaged — isolate the area and escalate.',
      'Lithium installations can enter thermal runaway if a damaged module is disturbed; do not attempt to move one.',
      'Battery acid causes serious burns; know where the eyewash is before opening the cabinet.',
    ],
    stopAndCallProfessional: [
      'Any battery is swollen, hot, leaking or physically damaged',
      'The load cannot be left unprotected and no bypass or alternative exists',
      'The string voltage or configuration is beyond your competence to work on safely',
      'A lithium module is damaged in any way',
      'The correct float and boost settings for the new blocks cannot be established',
    ],
  },

  tools: [
    { tool: 'Insulated tools rated for the full string voltage', why: 'Every part of this work is on a live DC source that cannot be switched off' },
    { tool: 'Insulated torque wrench', why: 'Interconnects are torque-specified; both loose and over-tight terminals cause failures' },
    { tool: 'True-RMS multimeter rated for the string voltage', why: 'Block and string voltage before, during and after the work' },
    { tool: 'Battery impedance analyser', why: 'Taking the commissioning baseline that makes future trending possible' },
    { tool: 'DC clamp meter', why: 'Confirming charge current into the new string' },
    { tool: 'Discharge test equipment or load bank', why: 'Proving real autonomy after installation rather than accepting a calculated figure' },
    { tool: 'Temperature logger', why: 'Establishing whether the environment that killed the old string has been corrected' },
    { tool: 'Battery and UPS documentation', why: 'Float and boost voltages, torque values and protocol settings must be read, never assumed' },
  ],

  decisionTree: [
    { question: 'Is any battery swollen, hot, leaking or damaged?', yes: 'Stop. Isolate the area and escalate — do not handle it.', no: 'Continue' },
    { question: 'Can the load run unprotected, or is an alternative arranged?', yes: 'Continue', no: 'Do not open the string. Arrange cover first — the load has no ride-through once you start.' },
    { question: 'Is the replacement a complete matched set from one batch?', yes: 'Continue', no: 'Do not mix new blocks with old — the old ones drag the new down and the fault returns' },
    { question: 'Has the string been sectioned before handling blocks?', yes: 'Continue', no: 'Section it. Working across full string voltage is avoidable and unnecessary.' },
    { question: 'Do the charger settings match the chemistry actually being installed?', yes: 'Continue', no: 'Correct them before recommissioning, or the new string ages prematurely' },
    { question: 'Has the environment that shortened the old string been addressed?', yes: 'Continue', no: 'A new string in the same warm room will fail on the same timescale' },
    { question: 'Have installation dates, an impedance baseline and proven autonomy been recorded?', yes: 'Job complete', no: 'Record them — without these the next engineer inherits the same blind spot' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Confirm the string genuinely needs replacing',
      inspect: 'Capacity or discharge test result, per-block voltage and impedance, installation dates',
      where: 'At the battery string',
      instrument: 'Impedance analyser, discharge test equipment',
      expected: 'Measured evidence that the string cannot deliver its autonomy',
      ifAbnormal: 'Voltage alone is not evidence. A string is replaced on measured capability or age, not on a single failed self-test, and occasionally a monitoring fault has condemned a healthy string.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Plan the outage window and confirm the load position',
      inspect: 'Whether the load can be unprotected, for how long, and what covers it if the mains disturbs',
      where: 'With the site, in writing',
      instrument: 'Agreement recorded before work begins',
      expected: 'An explicit decision, not an assumption',
      ifAbnormal: 'From the moment the string is opened the UPS has no ride-through. Any mains disturbance during the work drops the load. This is the commercial risk that gets overlooked because the electrical risk is more obvious.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Inspect before touching anything',
      inspect: 'Swelling, leakage, heat, terminal corrosion, cabinet condition and ventilation',
      where: 'At the cabinet',
      instrument: 'Inspection light, infrared thermometer',
      expected: 'No swelling, leakage or heat',
      ifAbnormal: 'A swollen, hot or leaking battery is a stop-work finding, not an obstacle to work around. Lithium modules that are damaged must not be disturbed at all.',
      next: 'Step 4',
      warning: 'Ventilate before opening a lead-acid cabinet; hydrogen accumulates and has no smell.',
    },
    {
      step: 4,
      title: 'Isolate, then section the string',
      inspect: 'Battery isolator open, fuse removed, string broken into sections',
      where: 'At the battery isolation device and the string',
      instrument: 'Insulated tools, multimeter',
      expected: 'Working sections at a voltage you are not exposed to across the full string',
      ifAbnormal: 'Sectioning is what turns a full-string-voltage job into a manageable one. Skipping it is a choice to work at a higher voltage than necessary.',
      next: 'Step 5',
      warning: 'Remove jewellery before starting, not when you notice it. A dropped tool across terminals welds instantly.',
    },
    {
      step: 5,
      title: 'Replace as a complete matched set',
      inspect: 'That every block is new, from one batch, and of the specified type',
      where: 'Throughout the string',
      instrument: 'Visual verification of type and batch',
      expected: 'A uniform string',
      ifAbnormal: 'Mixing new with old is a false economy that returns as a fault within months, because series performance is limited by the weakest block.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Torque interconnects to specification',
      inspect: 'Every interconnect, torqued rather than tightened by feel',
      where: 'Across the whole string',
      instrument: 'Insulated torque wrench',
      expected: 'All joints at the specified value',
      ifAbnormal: 'Both loose and over-tight terminals cause failures. Judgement is not an acceptable substitute here.',
      next: 'Step 7',
      verify: 'Interconnect torque values from the battery manufacturer documentation for the blocks fitted.',
    },
    {
      step: 7,
      title: 'Set the charger for the chemistry actually installed',
      inspect: 'Float and boost voltages, temperature compensation, and BMS protocol on lithium',
      where: 'UPS or charger configuration',
      instrument: 'Service interface and the battery documentation',
      expected: 'Settings matching the new blocks',
      ifAbnormal: 'This is the step most often missed after a change of battery type, and it determines how long the new string lasts. A charger left on the old profile will chronically over- or under-charge.',
      next: 'Step 8',
      verify: 'Float and boost voltages for the new blocks, from their documentation rather than a general figure.',
    },
    {
      step: 8,
      title: 'Address the environment before signing off',
      inspect: 'Battery room or cabinet temperature, logged rather than spot-checked',
      where: 'At the battery, over a period',
      instrument: 'Temperature logger',
      expected: 'Sustained temperature within the design assumption',
      ifAbnormal: 'Sustained operation above the design temperature roughly halves VRLA life for every 8 to 10 °C of rise. Leaving a warm room uncorrected consumes the new string on the same timescale as the old.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Record the baseline the next engineer will need',
      inspect: 'Installation dates, block serials, impedance baseline, charge current and proven autonomy',
      where: 'On the equipment and in the maintenance record',
      instrument: 'Impedance analyser, discharge test, written record',
      expected: 'A baseline that makes future trending possible',
      ifAbnormal: 'Without these, degradation cannot be trended and the next replacement will again be a surprise. This step is what breaks the cycle that produced this job.',
      next: 'Return to service and confirm normal operation',
    },
  ],

  repair: [
    {
      level: 'component-replacement',
      title: 'The string',
      steps: [
        'Replace as a complete matched set from a single batch',
        'Fit the specified block type, capacity and terminal arrangement',
        'Replace corroded interconnects rather than reusing them',
        'Dispose of removed batteries through a licensed route, handling them as live items',
      ],
    },
    {
      level: 'configuration',
      title: 'Charging regime',
      steps: [
        'Set float and boost voltages for the chemistry installed',
        'Verify temperature compensation and mount the sensor where it represents the battery',
        'Confirm charger current limit suits the new string capacity',
        'On lithium, select the matching BMS communication protocol',
      ],
      note: 'The charging regime, not the battery brand, decides how long the new string lasts.',
    },
    {
      level: 'mechanical',
      title: 'Environment',
      steps: [
        'Provide or restore cooling where the battery space runs warm',
        'Improve ventilation and remove heat sources near the cabinet',
        'Fit temperature monitoring so the environment is visible rather than assumed',
      ],
      note: 'Air-conditioning the battery space is almost always cheaper than the replacement cycle it prevents.',
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond the string',
      steps: [
        'Refer charger faults where the old string was damaged by over-charging',
        'Refer battery monitoring faults that produced a false condemnation',
      ],
    },
  ],

  validation: [
    'Confirm the charger presents the correct float voltage for the new chemistry',
    'Confirm charge current flows and tapers correctly as the string fills',
    'Record per-block voltage and impedance as the commissioning baseline',
    'Prove real autonomy with a timed discharge to a defined end voltage',
    'Thermal-check every interconnect under charge after the work',
    'Confirm temperature compensation operates and the sensor reads correctly',
    'Record installation dates and block serial numbers on the unit and in the maintenance record',
    'Log battery room temperature for a period afterwards to confirm the environment is genuinely in band',
  ],

  whenNotToRepair: [
    'Strings that have been partially replaced over time — replace the whole set rather than continuing the pattern',
    'Any battery showing swelling, leakage or heat damage, which is a disposal item not a repair',
    'Installations where the environment cannot be brought within specification, since a new string simply repeats the failure',
    'Obsolete UPS models where the battery format is no longer supported',
    'Where the UPS itself is at end of life and a new string would outlast the unit',
  ],

  prevention: [
    'Air-condition or ventilate the battery space; heat is the dominant life factor and the cheapest thing to control',
    'Test capacity annually rather than relying on voltage or the UPS internal test alone',
    'Take an impedance baseline at commissioning and trend against it so degradation is visible early',
    'Record installation dates on the batteries themselves and in the maintenance log',
    'Re-torque interconnects at every service visit',
    'Replace strings as complete matched sets, planned at end of design life rather than at failure',
    'Fit battery monitoring on installations where an outage is costly — continuous evidence beats an annual snapshot',
  ],

  relatedSlugs: ['ups-not-charging-batteries', 'ups-on-battery-with-mains-present'],

  faq: [
    {
      q: 'Can we replace just the failed blocks to save money?',
      a: 'On a lead-acid string this almost always costs more in the end. A series string performs to its weakest member, so new blocks placed alongside old ones are dragged down to their condition and the fault returns within months. Replace the whole set from one batch. If the string is young enough that a single block failing is genuinely unusual, find out why that block failed before fitting anything.',
    },
    {
      q: 'How long is the load unprotected during the work?',
      a: 'From the moment the string is opened until the new one has taken enough charge to be useful — which is longer than the physical swap. During that window the UPS has no ride-through at all, so any mains disturbance drops the load. Agree this with the site in writing before starting, and arrange cover if the load cannot take that risk.',
    },
    {
      q: 'Why did our last replacement string fail so quickly?',
      a: 'Two causes account for most early failures. The charger was left set for the previous battery type, so the new string was chronically over- or under-charged from day one. Or the battery room is warm, and nothing was done about it — VRLA life roughly halves for every 8 to 10 °C of sustained operation above about 25 °C, so a hot room consumes a five-year string in about two. Neither is the battery\'s fault.',
    },
    {
      q: 'Do we really need a torque wrench for battery terminals?',
      a: 'Yes. Both under- and over-tightening cause failures: a loose joint heats and eventually fails, an over-tight one damages the post or terminal. The manufacturer specifies a value because judgement by feel is unreliable across dozens of identical-looking connections, and this is one of the few places where the specified figure genuinely must be followed.',
    },
  ],

  references: [
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-3 — UPS performance and test requirements',
    'IEEE 1188 — recommended practice for maintenance, testing and replacement of VRLA batteries',
    'IEEE 1184 — guide for batteries for uninterruptible power supply systems',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The battery and UPS manufacturers\' documentation for the specific equipment, which is the only valid source for float and boost voltages, interconnect torque and protocol settings referred to throughout',
  ],
};
