import type { RepairArticle } from '../types';

export const solarInverterDcBusFault: RepairArticle = {
  slug: 'solar-inverter-dc-bus-fault',
  hub: 'inverters',
  header: {
    title: 'Solar Inverter DC Bus Fault — Over-Voltage, Under-Voltage and Isolation',
    equipmentCategory: 'Solar inverters — PV input and DC bus',
    appliesTo: 'Grid-tied, hybrid and off-grid solar inverters with MPPT PV inputs, single- and three-phase',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate. Many of these are design or configuration issues that only appear under particular conditions, so a spot check on a mild afternoon can find nothing wrong.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Awaiting independent named-engineer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'PV array DC per string design; AC output 240 V / 415 V 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Establish first which fault you actually have, because DC bus over-voltage, under-voltage and isolation faults have almost nothing in common. Over-voltage is usually a string-design problem rather than a component failure: open-circuit voltage rises as cell temperature falls, so a string that is comfortably within the inverter\'s maximum on a hot afternoon can exceed it on a cold clear morning, and the fault appears at dawn and disappears by mid-morning. Verify the string length against the module\'s temperature coefficient of open-circuit voltage and the lowest cell temperature the site will actually see — both taken from the module data sheet and site conditions, never assumed. Under-voltage points instead at the array not delivering: shading, soiling, a blown string fuse, an open connector, degraded modules, or a string configuration that sits below the MPPT operating window. An isolation or residual-current fault is a third and separate matter, indicating leakage between the array and earth, and it is a safety finding that must be traced rather than reset. Timing is the most useful diagnostic clue you have: note exactly when the fault occurs, because that alone usually separates the three.',

  symptoms: {
    display: [
      'DC bus over-voltage, PV over-voltage or input over-voltage fault',
      'DC bus under-voltage or input under-voltage fault',
      'Insulation resistance, isolation or riso fault',
      'Residual current or ground-fault indication',
      'MPPT fault, or one MPPT input reporting while others are healthy',
    ],
    indicators: [
      'Fault LED with the unit refusing to start or export',
      'Repeated start and stop cycling through the morning',
      'One string input showing markedly different values from its neighbours',
    ],
    sounds: [
      'Relay clicking as the unit repeatedly attempts to connect and disconnect',
      'A crack or arcing noise at a DC connector, which is an immediate stop-work finding',
    ],
    smells: [
      'Burnt smell at a DC connector, isolator or combiner box, which indicates arcing and must be investigated before any reset',
      'Hot plastic smell around connectors, often the first sign of a failing DC connection',
    ],
    behaviour: [
      'Fault occurs on cold clear mornings and clears as the day warms — the classic over-voltage signature',
      'Fault appears only in bright conditions at peak output',
      'Fault began after modules or strings were added, restrung or replaced',
      'Isolation fault appears after rain or in high humidity and clears when dry — a strong indicator of water ingress',
      'Under-voltage appearing progressively over months, which suggests soiling or degradation rather than a fault',
      'One MPPT input producing far less than an identical neighbouring string',
    ],
    visible: [
      'String fuse and DC isolator condition',
      'DC connector condition — mismatched or poorly crimped connectors are a leading cause of arcing and isolation faults',
      'Cable damage, rodent damage or insulation degradation, especially where cable rests on roof surfaces',
      'Water ingress in combiner boxes, junction boxes and connectors',
      'Module condition — cracking, delamination, hot spots, soiling and shading',
      'Shading from vegetation or new structures that did not exist at commissioning',
    ],
  },

  whatItMeans: {
    plain:
      'The inverter is unhappy with the DC coming from the solar panels: either too much voltage, too little, or a leak to earth. Too much voltage is usually because the strings are too long for cold conditions, since panel voltage rises as they get colder. Too little means the array is not delivering what it should. A leak to earth is a safety issue and must be found, not reset away.',
    technical:
      'A solar inverter operates between two distinct DC limits: an absolute maximum input voltage that must never be exceeded under any condition, and a narrower MPPT operating window within which it can track the array\'s maximum power point. Module open-circuit voltage has a negative temperature coefficient, so array voltage is highest at the lowest cell temperature in full irradiance — typically a cold, clear morning — and string length must be verified against the lowest cell temperature the site will experience, using the coefficient from the module data sheet. A string designed against midday conditions can therefore exceed the absolute maximum at dawn, producing a fault that appears and disappears daily and is frequently misdiagnosed as an inverter defect. Under-voltage conditions arise when array output falls below the MPPT window through shading, soiling, module degradation, an open string or a blown string fuse. Separately, transformerless inverters continuously monitor insulation resistance between the array and earth before and during connection, because there is no galvanic isolation between the DC and AC sides; a low insulation reading indicates leakage, commonly from water ingress at connectors or junction boxes, damaged cable insulation, or a degraded module. On the AC side, a high grid voltage can prevent the inverter exporting at full power, which raises the DC bus and can present as a bus over-voltage that originates entirely outside the array.',
  },

  causes: {
    mostLikely: [
      'String too long for the lowest expected cell temperature, exceeding maximum input voltage in cold conditions',
      'Shading, soiling or vegetation growth reducing array output below the MPPT window',
      'Water ingress at a DC connector, junction box or combiner causing an isolation fault',
      'Blown string fuse or open DC connection removing part of the array',
    ],
    possible: [
      'Mismatched or poorly crimped DC connectors, a leading cause of both arcing and isolation faults',
      'Damaged cable insulation, frequently from rodent damage or abrasion where cable rests on a roof',
      'Grid over-voltage preventing full export and raising the DC bus',
      'Module degradation or a failed bypass diode within a module',
    ],
    lessCommon: [
      'DC bus capacitors degraded',
      'Pre-charge circuit failure',
      'MPPT stage or its measurement circuit failed',
      'Incorrect array configuration entered in the inverter settings after commissioning',
    ],
    modelSpecific: [
      'Maximum input voltage and MPPT operating window are model-specific — take both from the inverter data sheet and never assume them',
      'Insulation resistance thresholds and how the inverter responds differ between models',
      'Transformerless designs monitor isolation continuously; transformer-isolated designs behave differently',
      'Multi-MPPT units differ in whether strings on separate inputs may be of unequal length',
      'Grid protection settings, which determine the response to high grid voltage, are set by the local requirements and the model',
    ],
    environmental: [
      'Low overnight and early-morning temperatures at altitude, which raise open-circuit voltage — relevant across much of upland Kenya',
      'Dust and soiling, which is a major and continuous factor in dry and dusty environments',
      'Humidity, rain and coastal salt air driving water ingress and corrosion',
      'Vegetation growth creating shading that did not exist at commissioning',
      'Rodent and bird activity damaging cabling beneath arrays',
    ],
    installation: [
      'String length calculated against average or midday conditions rather than the lowest expected cell temperature',
      'Mixed connector brands mated together, which do not reliably seal and are a known cause of arcing',
      'Poorly crimped connectors',
      'Cable routed without protection against abrasion, UV or rodent damage',
      'Array configuration in the inverter settings not matching what was actually installed',
    ],
    maintenance: [
      'Array never cleaned in a dusty environment',
      'Vegetation never cut back',
      'Connectors and combiner boxes never inspected for ingress',
      'String currents and voltages never measured and compared between strings',
    ],
    componentLevel: [
      'DC bus capacitors degraded',
      'Pre-charge resistor open',
      'MPPT input stage or its voltage measurement failed',
      'Insulation monitoring circuit failed',
    ],
  },

  safety: {
    isolation: [
      'A PV array is live in any daylight and CANNOT be switched off at source. Treat array conductors as live at all times.',
      'Open the DC isolator and the AC isolator, then prove dead at the point of work',
      'Opening a DC isolator does not de-energise the array — it only disconnects it from the inverter',
      'Confirm the DC bus capacitors have discharged before opening the enclosure',
    ],
    lockoutTagout: [
      'Lock and tag the AC isolator, the DC isolator and any string isolators',
      'Where a battery is present, isolate that separately — it is a third independent source',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection and insulated gloves rated for the array voltage',
      'Insulated tools rated for the DC system voltage',
      'Arc-rated clothing appropriate to the prospective energy',
      'Fall protection for any work at height on a roof array',
    ],
    storedEnergy: [
      'DC bus capacitors retain a dangerous charge after disconnection — verify with a meter rather than trusting a stated time',
      'The array remains a live source throughout the work',
      'Any connected battery remains live at all times',
    ],
    specificHazards: [
      'Array DC voltage is frequently well above what is safe to touch, and unlike an AC supply it cannot be switched off. This is the defining hazard of PV work.',
      'DC arcs do not self-extinguish. Never break a DC connection under load — open the isolator first, and never disconnect a plug carrying current.',
      'An isolation fault means there is already leakage to earth somewhere; treat all array metalwork as potentially live until proven otherwise',
      'Do not repeatedly reset an isolation fault to keep a system running. It is a safety protection responding to a real condition.',
      'Roof work introduces fall risk that is often the greater hazard on these jobs',
    ],
    stopAndCallProfessional: [
      'There is evidence of arcing, burning or heat damage at any DC connection',
      'An isolation fault cannot be traced, or array metalwork shows any voltage to earth',
      'Work requires access to a roof array without proper fall protection',
      'You cannot verify the DC bus has discharged',
      'The array configuration needs redesign rather than repair',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the full array DC voltage', why: 'String open-circuit voltage and bus measurements — the meter must be rated for the array, not just for mains' },
    { tool: 'Insulation resistance tester suitable for PV', why: 'Tracing an isolation fault to a string, cable or module — the only way to locate leakage properly' },
    { tool: 'DC clamp meter', why: 'String current comparison, which identifies an underperforming or open string quickly' },
    { tool: 'Irradiance meter and cell temperature probe', why: 'String measurements are meaningless without the conditions they were taken in; this is what makes comparison valid' },
    { tool: 'Thermal camera', why: 'Locating hot cells, failed bypass diodes and hot DC connections' },
    { tool: 'Module and inverter data sheets', why: 'Temperature coefficient of open-circuit voltage, maximum input voltage and MPPT window — every one of these must be read, never assumed' },
    { tool: 'Data logger or the inverter\'s own event log', why: 'Intermittent faults tied to time of day cannot be diagnosed from a single site visit' },
  ],

  decisionTree: [
    { question: 'Is there any sign of arcing, burning or heat at a DC connection?', yes: 'Stop. Isolate and investigate before any reset — this is a fire risk.', no: 'Continue' },
    { question: 'Which fault is it — over-voltage, under-voltage, or isolation?', yes: 'Identify it precisely from the display and log before proceeding; they have different causes', no: 'Read the event log; the fault type determines everything that follows' },
    { question: 'For over-voltage: does the fault occur on cold clear mornings and clear as the day warms?', yes: 'String length against low-temperature open-circuit voltage — a design issue, not a failure', no: 'Continue' },
    { question: 'For over-voltage: is the grid voltage high, limiting export?', yes: 'The bus is rising because the inverter cannot export — the cause is on the AC side', no: 'Continue' },
    { question: 'For under-voltage: do all strings produce comparable voltage and current in the same conditions?', yes: 'Array is balanced — check the MPPT window and settings', no: 'The odd string is the fault — trace shading, soiling, an open connection or a blown fuse' },
    { question: 'For isolation: does the fault correlate with rain or humidity?', yes: 'Water ingress at a connector, junction box or damaged cable is the strong probability', no: 'Test insulation string by string to localise the leakage' },
    { question: 'Has the fault been localised to a string, cable or module?', yes: 'Repair the specific defect and re-test insulation before returning to service', no: 'Do not reset repeatedly to keep the system running — escalate' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Read the event log and establish exactly when the fault occurs',
      inspect: 'Fault type, time of day and weather conditions at each occurrence',
      where: 'Inverter display, event log or monitoring portal',
      instrument: 'Service interface or monitoring platform',
      expected: 'A clear pattern in time and conditions',
      ifAbnormal: 'Timing is the most valuable clue available. Cold mornings indicate over-voltage from string design; wet weather indicates isolation; bright peak conditions indicate export limitation or thermal issues.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Inspect the DC side before measuring',
      inspect: 'Connectors, combiner boxes, isolators, cable routing, and evidence of water ingress or rodent damage',
      where: 'Along the whole DC path from array to inverter',
      instrument: 'Inspection light, thermal camera',
      expected: 'Dry, undamaged, correctly mated connectors of matching type',
      ifAbnormal: 'Mismatched connector brands mated together, poor crimps and water ingress are leading causes of both isolation faults and arcing. Any heat or burning ends the diagnosis and becomes a safety matter.',
      next: 'Step 3',
      warning: 'Never disconnect a DC plug that may be carrying current. Open the isolator first.',
    },
    {
      step: 3,
      title: 'Measure string open-circuit voltage with conditions recorded',
      inspect: 'Open-circuit voltage of each string, together with cell temperature and irradiance at the time',
      where: 'At the string terminals, isolated from the inverter',
      instrument: 'Multimeter rated for the array voltage, irradiance meter, temperature probe',
      expected: 'Strings of equal length reading closely alike for the conditions',
      ifAbnormal: 'A string reading low has lost modules or has an open connection. Measurements without recorded conditions cannot be compared meaningfully.',
      next: 'Step 4',
      warning: 'Use a meter rated for the full array voltage. A meter rated only for mains is not adequate here.',
    },
    {
      step: 4,
      title: 'Verify string design against the lowest expected cell temperature',
      inspect: 'Calculated open-circuit voltage at the coldest condition the site will see, against the inverter maximum input',
      where: 'Desk check using the module and inverter data sheets',
      instrument: 'Module temperature coefficient of open-circuit voltage and site temperature data',
      expected: 'Worst-case cold open-circuit voltage comfortably below the inverter\'s absolute maximum input',
      ifAbnormal: 'This is the calculation that explains most morning over-voltage faults. If the string is too long, the fix is restringing — no amount of inverter repair will change it.',
      next: 'Step 5',
      verify: 'The module\'s temperature coefficient of open-circuit voltage and the inverter\'s maximum input voltage — both from the respective data sheets, and the lowest expected cell temperature from site conditions. Do not use a general rule of thumb for this calculation.',
    },
    {
      step: 5,
      title: 'Compare string currents under matched conditions',
      inspect: 'Current from each string with the system operating',
      where: 'At each string conductor',
      instrument: 'DC clamp meter, with irradiance recorded',
      expected: 'Strings of identical configuration producing closely comparable current',
      ifAbnormal: 'A low string indicates shading, soiling, module degradation, a failed bypass diode or a partially open connection. Comparison between strings is far more informative than any absolute figure.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Test insulation resistance where an isolation fault is indicated',
      inspect: 'Insulation resistance between array conductors and earth, string by string',
      where: 'At the array, progressively isolating sections to localise',
      instrument: 'Insulation resistance tester suitable for PV',
      expected: 'High insulation resistance on every string',
      ifAbnormal: 'A low reading localises the leakage. Testing string by string, and then section by section, narrows it to a cable, connector, junction box or module without dismantling the whole array.',
      next: 'Step 7',
      warning: 'An isolation fault means leakage to earth already exists. Treat array metalwork as potentially live until proven otherwise.',
    },
    {
      step: 7,
      title: 'Check the AC side for export limitation',
      inspect: 'Grid voltage at the inverter terminals during peak production',
      where: 'Inverter AC terminals',
      instrument: 'True-RMS multimeter or power quality analyser with logging',
      expected: 'Grid voltage within the range that permits full export',
      ifAbnormal: 'High grid voltage prevents the inverter exporting fully, which raises the DC bus. The cause is then entirely on the AC side — cable sizing, transformer tap or network conditions — and no DC work will fix it.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Only now assess the inverter DC stage itself',
      inspect: 'Bus capacitors, pre-charge circuit and MPPT input measurement',
      where: 'Within the inverter, isolated and with the bus proven discharged',
      instrument: 'ESR meter, multimeter',
      expected: 'Healthy capacitors and measurement agreeing with an external meter',
      ifAbnormal: 'If the inverter reports a voltage materially different from an external measurement at the same terminals, the measurement circuit is suspect. Conclude this last.',
      next: 'Refer internal faults for workshop diagnosis',
      warning: 'Verify the DC bus has discharged before opening the enclosure. The array remains live regardless.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Array and DC path',
      steps: [
        'Replace mismatched or poorly crimped DC connectors with correctly mated pairs of a single type',
        'Seal or replace junction boxes and combiners showing water ingress',
        'Repair or replace damaged cable and route it clear of abrasion and rodent access',
        'Clean soiled modules and cut back vegetation causing shading',
      ],
      note: 'Mating connectors of different brands is a widespread practice and a recognised cause of arcing and isolation faults. Use matched pairs.',
    },
    {
      level: 'configuration',
      title: 'Design and settings',
      steps: [
        'Restring the array where string length exceeds the maximum input at the lowest expected cell temperature',
        'Correct the array configuration entered in the inverter settings to match what is installed',
        'Review grid protection settings against the applicable local requirements before changing anything',
      ],
      note: 'Over-voltage from string design is corrected by restringing, not by repair.',
    },
    {
      level: 'component-replacement',
      title: 'Array components',
      steps: [
        'Replace failed string fuses after establishing why they operated',
        'Replace modules with failed bypass diodes, cracking or delamination',
        'Replace degraded isolators and connectors rather than repeatedly cleaning them',
      ],
    },
    {
      level: 'board-level',
      title: 'Inverter DC stage',
      steps: [
        'Replace degraded DC bus capacitors identified by ESR testing',
        'Repair pre-charge circuit faults on a discharged and proven-dead bus',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond field repair',
      steps: [
        'Refer MPPT stage, measurement circuit and insulation monitoring faults',
        'Provide string measurements with recorded conditions, insulation test results and the event log',
      ],
    },
  ],

  validation: [
    'Confirm the fault does not recur under the conditions that produced it — for a morning over-voltage fault, that means verifying on a cold clear morning, not on the afternoon of the repair',
    'Re-test insulation resistance across the whole array after any DC-side work',
    'Compare string voltages and currents against each other with conditions recorded',
    'Confirm the inverter starts, tracks and exports normally through a full day',
    'Thermal-survey DC connections under load after the work',
    'Confirm the array configuration in the inverter settings matches what is installed',
    'Record the string calculation, measured values and conditions in the maintenance record',
  ],

  whenNotToRepair: [
    'Where the array string design exceeds the inverter maximum input — this requires restringing or a different inverter, not repair',
    'Modules with cell cracking, delamination or backsheet failure, which are replacement items',
    'Widespread connector degradation across an array, where piecemeal replacement will not hold',
    'Obsolete inverters where MPPT or control boards are unobtainable',
    'Where an isolation fault cannot be localised and the array wiring is inaccessible or undocumented',
  ],

  prevention: [
    'Calculate string length against the lowest expected cell temperature at commissioning, and record that calculation',
    'Use matched DC connectors of a single type throughout, correctly crimped with the proper tool',
    'Clean modules on a schedule suited to the site — soiling losses in dusty environments are continuous and significant',
    'Cut back vegetation before it shades the array',
    'Inspect combiner boxes and connectors for ingress at every service visit',
    'Test insulation resistance periodically rather than waiting for a fault',
    'Record string voltages and currents with conditions at commissioning, so later comparison is meaningful',
    'Protect DC cabling against UV, abrasion and rodent damage at installation',
  ],

  relatedSlugs: ['inverter-switches-off-under-load', 'inverter-will-not-switch-on', 'solar-system-underperforming'],

  faq: [
    {
      q: 'Why does the over-voltage fault only happen early on cold mornings?',
      a: 'Because module open-circuit voltage rises as cell temperature falls. A string sized against warm midday conditions can exceed the inverter\'s absolute maximum input at dawn on a cold clear day, then fall back within limits as the array warms. It is a string-design issue, and the fix is restringing — check the calculation against the module\'s temperature coefficient and the lowest cell temperature the site actually sees.',
    },
    {
      q: 'Can I just reset the isolation fault so the system keeps running?',
      a: 'No. An isolation fault means current is leaking between the array and earth, and the protection is doing its job. Repeatedly resetting it leaves a real electrical hazard live on a system that cannot be switched off in daylight. Trace it — string by string insulation testing localises it quickly, and it is usually water ingress at a connector or junction box.',
    },
    {
      q: 'The inverter reports DC over-voltage but the array is within spec. What else causes it?',
      a: 'Check the AC side. If grid voltage is high, the inverter cannot export at full power, and the DC bus rises as a result. The fault reads as a DC problem while the cause is entirely on the AC side — cable sizing, a transformer tap or network conditions. Log grid voltage through a peak production day before touching the array.',
    },
    {
      q: 'Is it a problem to mix DC connector brands if they physically fit?',
      a: 'Yes. Connectors from different manufacturers may mate mechanically without forming a reliable sealed electrical joint, and the resulting high-resistance or poorly sealed connection is a recognised cause of arcing, heat damage and isolation faults. Use matched pairs of a single type, correctly crimped with the proper tool.',
    },
  ],

  references: [
    'IEC 62109-1 and IEC 62109-2 — safety of power converters for use in photovoltaic power systems',
    'IEC 62446-1 — grid-connected PV systems: documentation, commissioning tests and inspection',
    'IEC 61730 — photovoltaic module safety qualification',
    'IEC 60364-7-712 — low-voltage installations: requirements for photovoltaic power supply systems',
    'The module and inverter manufacturers\' data sheets for the specific equipment, which are the only valid source for the temperature coefficient, maximum input voltage and MPPT window referred to throughout',
  ],
};
