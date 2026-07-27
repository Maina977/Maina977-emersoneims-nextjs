import type { RepairArticle } from '../types';

export const upsNotChargingBatteries: RepairArticle = {
  slug: 'ups-not-charging-batteries',
  hub: 'ups',
  header: {
    title: 'UPS Not Charging Batteries — Diagnosis and Repair',
    equipmentCategory: 'Uninterruptible power supply — charger and battery system',
    appliesTo: 'Offline, line-interactive and online double-conversion UPS systems, single- and three-phase, with VRLA or lithium battery strings',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate. The common outcome is that the charger is working correctly and the battery can no longer accept charge, which is the opposite of the reported fault.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'EmersonEIMS Engineering — pending named reviewer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Mains input 240 V / 415 V 50 Hz; DC bus voltage per UPS design',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'A UPS reporting that it is not charging is more often reporting a battery that can no longer accept charge than a charger that has failed. Establish which before ordering anything. Measure the DC voltage the charger presents at the battery terminals and the current actually flowing into the string. A charger holding correct float voltage with negligible current into a string that is genuinely discharged means the battery is the problem. Correct float voltage with normal current means charging is happening and the alarm is about capacity or a battery test result rather than the charger. No voltage at all, or voltage well away from the float setpoint, points at the charger, its supply or a protective device. The most common finding across standby installations is a battery string aged well beyond its service life, frequently accelerated by a battery room running warmer than the design assumption — every 8 to 10 °C of sustained temperature rise above about 25 °C roughly halves VRLA life.',

  symptoms: {
    display: [
      'Battery fault, replace battery, or charger fault indication',
      'Battery test failed, which is a different message from a charging fault and points at capacity',
      'Runtime estimate far below the design autonomy',
      'DC bus or battery voltage displayed below the expected float value',
      'Event log showing repeated battery test failures over weeks or months',
    ],
    indicators: [
      'Battery indication not reaching full even after an extended period on mains',
      'UPS transferring to battery and returning almost immediately during a brief outage',
      'Charger indication absent where the UPS provides one',
      'Battery circuit breaker or fuse open',
    ],
    sounds: [
      'Audible alarm accompanying the battery fault indication',
      'Cooling fans running harder than normal, which may indicate a thermal issue affecting the charger',
      'Gassing or bubbling from flooded cells, indicating over-charging rather than under-charging',
    ],
    smells: [
      'Acid or sulphurous smell at the battery cabinet, indicating over-charging, a failing cell or venting',
      'Hot electronics smell from the UPS, which warrants immediate investigation',
      'Any burnt smell means stop and inspect before further testing',
    ],
    behaviour: [
      'Autonomy progressively shortening over months, which is normal ageing reaching its end point',
      'Sudden loss of charging after a mains disturbance or a lightning event',
      'Charging normally at first then stopping, which points at a temperature-related or protection-related cut-back',
      'Battery indication normal but the UPS fails the moment mains is lost, which is a capacity problem masquerading as a charging problem',
      'Batteries warm to the touch, which suggests over-charging or internal failure rather than under-charging',
    ],
    visible: [
      'Battery case swelling, distortion, leakage or terminal corrosion — any of these is a stop-work finding',
      'Battery installation date labels, which frequently reveal the answer immediately',
      'Battery circuit breaker or fuse condition',
      'Battery room temperature and whether any cooling is provided',
      'Interconnect tightness and any heat discolouration at terminals',
    ],
  },

  whatItMeans: {
    plain:
      'The UPS is telling you the batteries are not being charged, or are not holding charge. That can mean the charger has failed, or that the batteries have reached the end of their life and can no longer take a charge. The second is far more common. Batteries do not last forever, and heat shortens their life dramatically.',
    technical:
      'A UPS charger is a constant-voltage source with current limit. It presents a float voltage and supplies whatever current the string draws at that voltage, which falls as the string approaches full charge. This behaviour means a healthy, fully charged string legitimately draws almost no current, so low current alone does not indicate a fault — it must be interpreted against the state of charge. A battery near end of life exhibits rising internal resistance and reduced active material, so it accepts less current, reaches float voltage prematurely, and delivers far less capacity than its rating despite appearing charged. Temperature is the dominant life factor: VRLA life follows an Arrhenius relationship in which sustained operation above the design temperature roughly halves service life for every 8 to 10 °C of rise, so a battery room without dedicated cooling routinely converts a five-year string into a two-year one. Temperature compensation in the charger, where fitted, adjusts float voltage against temperature to avoid over-charging when warm and under-charging when cold; a failed compensation sensor therefore causes chronic over- or under-charging that presents as premature failure rather than as a charger alarm.',
  },

  causes: {
    mostLikely: [
      'Battery string at or beyond end of service life, no longer able to accept or hold charge',
      'Battery room temperature well above the design assumption, having shortened life dramatically',
      'One weak or failed block in a series string, limiting the whole string',
      'Battery circuit breaker open or battery fuse blown, so the charger cannot see the string at all',
    ],
    possible: [
      'Charger float voltage set incorrectly for the chemistry installed',
      'Temperature compensation sensor failed, causing chronic over- or under-charging',
      'Loose or corroded interconnects raising resistance in the string',
      'Charger current limit set very low, so charging is happening but far too slowly',
    ],
    lessCommon: [
      'Charger stage failure within the UPS',
      'Input supply problem preventing the charger operating while the UPS still supports load through another path',
      'Battery monitoring system reporting a fault that inhibits charging',
      'Mismatched blocks after a partial replacement, where new and old are mixed in one string',
    ],
    modelSpecific: [
      'Float and boost voltage setpoints differ by chemistry and by manufacturer and must be taken from the battery and UPS documentation for the units installed',
      'Lithium strings are charged under BMS control and the BMS can inhibit charging for reasons the UPS reports only as a generic fault',
      'Battery test behaviour, its frequency and what a test failure actually means differ between UPS models',
      'Some UPS models inhibit charging above a defined battery temperature as a protective measure',
    ],
    environmental: [
      'Battery room or cabinet running warm, which is the single largest determinant of VRLA life',
      'Poor ventilation around the battery cabinet',
      'Very low temperature reducing charge acceptance and available capacity',
      'Dust or humidity causing terminal corrosion and tracking',
    ],
    installation: [
      'Batteries installed in a space with no dedicated cooling despite the design assuming it',
      'Undersized battery interconnects or long cable runs adding resistance',
      'Battery string sized for energy alone without regard to the discharge rate required',
      'Temperature sensor not fitted or not mounted where it represents the battery',
    ],
    maintenance: [
      'Battery capacity never tested, only voltage checked',
      'Installation dates never recorded, so string age is unknown',
      'Interconnects never re-torqued',
      'Battery replaced block by block over time, mixing ages within one string',
    ],
    componentLevel: [
      'Charger power stage or its control failed',
      'Temperature compensation sensor open or short circuit',
      'Battery monitoring hardware failed, reporting a false condition',
      'Individual block internally failed, open or short',
    ],
  },

  safety: {
    isolation: [
      'A battery string cannot be switched off. It is live whenever it is connected and can deliver very high fault current.',
      'Open the battery circuit breaker or remove the battery fuse before working on the string, and prove dead at the point of work',
      'Isolate the UPS input and confirm the load has an alternative supply or can be safely dropped before removing the UPS from service',
      'Remember an online UPS supports load through several paths — isolating one does not make the unit safe',
    ],
    lockoutTagout: [
      'Lock off the battery isolator and the UPS input, and tag both',
      'Confirm with the site that the protected load may lose UPS protection before starting, since the load is unprotected during the work',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection at all times near a battery installation',
      'Acid-resistant gloves and apron for flooded or VRLA work',
      'Insulated tools rated for the DC bus voltage',
      'Remove watches, rings and metal bracelets before any battery work',
      'Arc-rated protection appropriate to the prospective fault energy of the string',
    ],
    storedEnergy: [
      'The DC bus and the battery string remain at dangerous voltage after the UPS is switched off',
      'UPS internal capacitors retain charge — observe the manufacturer\'s discharge period before opening the enclosure',
      'A series string of blocks presents the full string voltage across its ends even where each block is low voltage',
      'Lead-acid batteries vent hydrogen; ventilate before working and eliminate ignition sources',
    ],
    specificHazards: [
      'A dropped tool across battery terminals will weld instantly and can cause the battery to rupture or explode. Insulated tools are not optional here.',
      'DC arcs do not self-extinguish as AC arcs do, which makes a DC short more dangerous than the voltage suggests',
      'Never work on a battery that is swollen, leaking, hot or physically damaged — isolate the area and escalate',
      'Lithium installations can enter thermal runaway if a damaged module is disturbed',
      'Battery acid causes serious burns; know the location of the eyewash before starting',
    ],
    stopAndCallProfessional: [
      'Any battery is swollen, hot, leaking or physically damaged',
      'There is a burnt smell or visible damage inside the UPS',
      'The work requires opening the UPS enclosure and you cannot verify capacitor discharge',
      'The load cannot be left unprotected for the duration of the work and no bypass arrangement exists',
      'The string voltage or configuration is beyond your competence to work on safely',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter rated for the DC bus voltage', why: 'Float voltage at the string, and per-block voltage to find the weak one' },
    { tool: 'DC clamp meter', why: 'Actual charging current into the string — the measurement that distinguishes charger fault from battery fault' },
    { tool: 'Battery impedance or internal resistance analyser', why: 'Finding a degraded block without discharging the whole string, and trending against the commissioning baseline' },
    { tool: 'Battery capacity or discharge test equipment', why: 'The only way to establish real autonomy; a calculated figure is a claim, a timed discharge is a measurement' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Battery and interconnect temperature — heat is both a cause and a symptom here' },
    { tool: 'Temperature and humidity logger', why: 'Establishing the real battery room environment over time rather than at the moment of the visit' },
    { tool: 'Insulated torque wrench', why: 'Interconnects must be torqued to specification; both loose and over-tight terminals cause problems' },
    { tool: 'Insulated spanners and screwdrivers', why: 'All work on a live battery string' },
  ],

  decisionTree: [
    { question: 'Is any battery swollen, hot, leaking or damaged?', yes: 'Stop. Isolate the area and escalate. Do not proceed with testing.', no: 'Continue' },
    { question: 'Is the battery circuit breaker closed and the fuse intact?', yes: 'Continue', no: 'The charger cannot see the string at all. Establish why it opened before simply closing it.' },
    { question: 'Is the charger presenting a DC voltage at the string terminals?', yes: 'Continue', no: 'Charger, its supply or a protective device — investigate the charger side' },
    { question: 'Is that voltage at the correct float setpoint for the chemistry installed?', yes: 'Continue', no: 'Correct the setting; wrong float voltage causes chronic over- or under-charging' },
    { question: 'Is current flowing into the string, and is the string actually discharged?', yes: 'Charging is occurring — the alarm concerns capacity or a test result, not the charger', no: 'A discharged string drawing no current at correct float voltage means the battery cannot accept charge' },
    { question: 'Do all blocks show similar voltage and internal resistance?', yes: 'Continue to capacity testing', no: 'One degraded block limits the string — identify and address it' },
    { question: 'Does a timed discharge test deliver the design autonomy?', yes: 'The battery is serviceable; investigate the alarm logic and settings', no: 'The string is at end of life regardless of what the voltage reading suggests' },
    { question: 'Is the battery room within its design temperature?', yes: 'Continue', no: 'Heat is shortening life dramatically — this must be fixed or the replacement string will follow the original' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Inspect before measuring',
      inspect: 'Battery physical condition, installation dates, interconnect condition and room temperature',
      where: 'Battery cabinet or room',
      instrument: 'Inspection light, infrared thermometer',
      expected: 'No swelling, leakage or heat; dates recorded; terminals clean and tight',
      ifAbnormal: 'A swollen or hot battery ends the diagnosis immediately and becomes a safety matter. Installation dates alone frequently answer the question.',
      next: 'Step 2',
      warning: 'Do not disturb a swollen, leaking or damaged battery. Isolate the area and escalate.',
    },
    {
      step: 2,
      title: 'Confirm the charger can actually see the string',
      inspect: 'Battery circuit breaker and fuse condition',
      where: 'Battery isolation device',
      instrument: 'Multimeter on continuity, with the string isolated',
      expected: 'Breaker closed, fuse intact',
      ifAbnormal: 'An open protective device explains the fault entirely. Establish why it opened rather than simply replacing or closing it.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure charger output voltage at the string terminals',
      inspect: 'DC voltage the charger presents, measured at the battery, not at the UPS',
      where: 'Battery string terminals',
      instrument: 'True-RMS multimeter, insulated leads',
      expected: 'Voltage at or close to the float setpoint for the installed chemistry',
      ifAbnormal: 'No voltage points at the charger, its supply or a protective device. Voltage well away from setpoint points at a configuration or compensation fault.',
      next: 'Step 4',
      verify: 'The correct float and boost setpoints for the specific battery chemistry and the UPS model — these differ between lead-acid and lithium and must not be assumed.',
    },
    {
      step: 4,
      title: 'Measure charging current and interpret it against state of charge',
      inspect: 'Actual DC current flowing into the string',
      where: 'Battery cable, using a DC clamp',
      instrument: 'DC clamp meter',
      expected: 'Substantial current into a discharged string, tapering to very little as it approaches full charge',
      ifAbnormal: 'Low current alone is not a fault — a full string legitimately draws almost nothing. Low current into a genuinely discharged string is the finding that matters, and it indicts the battery.',
      next: 'Step 5',
      warning: 'Use a DC clamp. An AC-only clamp will read nothing useful here.',
    },
    {
      step: 5,
      title: 'Measure each block individually to find the weak one',
      inspect: 'Per-block voltage across the whole string',
      where: 'Each block in turn',
      instrument: 'True-RMS multimeter with insulated leads',
      expected: 'All blocks within a narrow band of each other',
      ifAbnormal: 'One block markedly different from the rest limits the entire string. A series string performs to its weakest member regardless of how healthy the others are.',
      next: 'Step 6',
      warning: 'Work methodically with insulated tools. The full string voltage exists across the ends even where each block is low voltage.',
    },
    {
      step: 6,
      title: 'Measure internal resistance and compare against baseline',
      inspect: 'Internal resistance or impedance of each block',
      where: 'Each block',
      instrument: 'Battery impedance analyser',
      expected: 'Consistent readings across blocks, and comparable to the commissioning baseline where one exists',
      ifAbnormal: 'Rising internal resistance is the earliest reliable indicator of a failing block, and it appears long before voltage reveals anything.',
      next: 'Step 7',
      verify: 'The acceptable internal resistance for the specific battery type — an absolute figure means little without the manufacturer reference or a commissioning baseline.',
    },
    {
      step: 7,
      title: 'Establish the real environment the batteries live in',
      inspect: 'Battery room or cabinet temperature, logged over time rather than spot-checked',
      where: 'At the battery, not at the room thermostat',
      instrument: 'Temperature logger',
      expected: 'Sustained temperature within the design assumption',
      ifAbnormal: 'Sustained operation above the design temperature roughly halves VRLA life for every 8 to 10 °C of rise. A warm room converts a five-year string into a two-year one, and the customer experiences that as "the UPS failed".',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Check temperature compensation where fitted',
      inspect: 'Compensation sensor presence, mounting position and function',
      where: 'At the sensor and in the UPS configuration',
      instrument: 'Multimeter and UPS configuration display',
      expected: 'Sensor healthy, mounted where it represents the battery, and compensation enabled and configured correctly',
      ifAbnormal: 'A failed compensation sensor causes chronic over-charging when warm or under-charging when cold, and presents as premature battery failure rather than as a charger alarm.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Prove real autonomy with a timed discharge',
      inspect: 'Actual runtime under a known load to a defined end voltage',
      where: 'Controlled discharge with the load protected or transferred',
      instrument: 'Discharge test equipment or load bank, with timing',
      expected: 'Runtime meeting the design autonomy at the measured load',
      ifAbnormal: 'This is the measurement that settles the argument. A string that will not deliver its autonomy is at end of life whatever its voltage reads.',
      next: 'Decide replacement or repair based on measured evidence',
      warning: 'The protected load has no UPS protection during a discharge test. Schedule it deliberately, and have the generator available.',
    },
    {
      step: 10,
      title: 'Only now consider the charger stage itself',
      inspect: 'Charger output under a known load, and the UPS event history',
      where: 'Charger output and UPS logs',
      instrument: 'Multimeter, DC clamp, service interface',
      expected: 'Charger delivering its rated current at the correct voltage into a string that can accept it',
      ifAbnormal: 'A charger that cannot hold voltage or deliver current into a proven-good string is genuinely faulty. Conclude this last, not first.',
      next: 'Refer charger repair to the manufacturer or a properly equipped facility',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Terminations and environment',
      steps: [
        'Clean corroded terminals and re-torque every interconnect to the specified value',
        'Restore ventilation around the battery cabinet',
        'Replace damaged or undersized interconnects',
      ],
      note: 'Both loose and over-tight terminals cause problems — use a torque wrench, not judgement.',
    },
    {
      level: 'component-replacement',
      title: 'Battery string',
      steps: [
        'Replace the string as a complete matched set where it has reached end of life',
        'Never mix new blocks with old in the same string — the old blocks drag the new ones down and the problem returns within months',
        'Record installation dates and take a commissioning impedance baseline for every new string',
        'Dispose of removed batteries through a licensed route',
      ],
    },
    {
      level: 'configuration',
      title: 'Charger settings',
      steps: [
        'Set float and boost voltages for the chemistry actually installed',
        'Verify and enable temperature compensation, and confirm the sensor is mounted where it represents the battery',
        'Confirm charger current limit is appropriate for the string capacity',
        'Where a lithium BMS communicates with the UPS, confirm the protocol setting matches the battery installed',
      ],
    },
    {
      level: 'mechanical',
      title: 'Battery environment',
      steps: [
        'Provide dedicated cooling for the battery space where temperature is driving the failures',
        'Improve ventilation and remove heat sources near the cabinet',
        'Fit temperature monitoring so the environment is visible rather than assumed',
      ],
      note: 'Air-conditioning the battery space is almost always cheaper than the replacement cycle it prevents.',
    },
    {
      level: 'manufacturer-level',
      title: 'Charger stage',
      steps: [
        'Refer charger power stage or control faults to the manufacturer or a properly equipped facility',
        'Provide the measured voltages, currents and event history, which shortens the repair considerably',
      ],
    },
  ],

  validation: [
    'Confirm the charger presents the correct float voltage for the installed chemistry',
    'Confirm current flows into the string and tapers correctly as it approaches full charge',
    'Measure and record per-block voltage and internal resistance as a new baseline',
    'Prove real autonomy with a timed discharge to a defined end voltage',
    'Confirm temperature compensation operates and the sensor reads correctly',
    'Re-torque and thermal-check every interconnect after the work',
    'Record battery installation dates and serial numbers on the unit and in the maintenance record',
    'Log battery room temperature for a week after the work to confirm the environment is genuinely in band',
  ],

  whenNotToRepair: [
    'A string at or beyond service life — replacement is the fix, and repeated investigation of the charger is wasted effort',
    'Any battery showing swelling, leakage or heat damage',
    'Strings that have been partially replaced over time, producing a mixed-age set that will never perform',
    'Obsolete UPS models where charger components are unobtainable and battery format is no longer supported',
    'Where the environment cannot be brought within specification — a new string in a hot room simply repeats the failure',
  ],

  prevention: [
    'Air-condition or ventilate the battery space; heat is the dominant life factor and the cheapest thing to control',
    'Test capacity annually rather than relying on voltage or on the UPS internal test alone',
    'Take an impedance baseline at commissioning and trend against it, so degradation is visible before failure',
    'Record installation dates on the batteries themselves and in the maintenance log',
    'Re-torque interconnects at every service visit',
    'Replace strings as complete matched sets and plan replacement at end of design life rather than at failure',
    'Fit battery monitoring on any installation where an outage would be costly — continuous evidence beats an annual snapshot',
  ],

  relatedSlugs: ['ups-on-battery-with-mains-present'],

  faq: [
    {
      q: 'The batteries show the right voltage. How can they be flat?',
      a: 'Voltage indicates state of charge, not capacity. An aged battery holds a normal terminal voltage and then collapses within seconds under real load, because the active material and the ability to sustain current are gone. Only a capacity or discharge test reveals it, which is exactly why voltage-only checking lets strings fail on the day they are needed.',
    },
    {
      q: 'Can I replace just the one bad block?',
      a: 'On a lead-acid string this is usually a false economy. A new block placed alongside old ones is dragged down to their condition, and the fault returns within months. Replace the string as a complete matched set, and if the string is young enough that one block failing is genuinely unusual, find out why that block failed.',
    },
    {
      q: 'Why do our UPS batteries only last two years when they are rated for five?',
      a: 'Almost always temperature. VRLA life roughly halves for every 8 to 10 °C of sustained operation above about 25 °C, so a battery room running warm converts a five-year string into a two-year one. Cooling the battery space is normally far cheaper than the replacement cycle it prevents.',
    },
    {
      q: 'The UPS says charging is fine but it fails immediately during an outage. Is that a charging fault?',
      a: 'No, and this distinction matters. Charging and capacity are different things. The charger can be doing its job perfectly while the string has almost no capacity left. The runtime figure a UPS displays is usually calculated rather than measured, so prove autonomy with a timed discharge.',
    },
  ],

  references: [
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-3 — UPS performance and test requirements',
    'IEEE 1188 — recommended practice for maintenance, testing and replacement of VRLA batteries',
    'IEEE 1184 — guide for batteries for uninterruptible power supply systems',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The UPS and battery manufacturer\'s documentation for the specific units, which gives float and boost setpoints, torque figures and acceptable impedance values',
  ],
};
