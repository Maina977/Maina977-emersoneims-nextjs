import type { RepairArticle } from '../types';

export const inverterNotChargingBatteries: RepairArticle = {
  slug: 'inverter-not-charging-batteries',
  hub: 'inverters',
  header: {
    title: 'Inverter Not Charging Batteries — Diagnosis and Repair',
    equipmentCategory: 'Inverter-chargers and hybrid inverters — charging stage',
    appliesTo: 'Inverter-chargers, hybrid and off-grid inverters charging from utility, generator or solar, with lead-acid or lithium banks',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. A large share of these are configuration rather than failure, and are resolved without opening the unit.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'AC input 240 V 50 Hz nominal; battery DC per system design',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Check the settings before you check the hardware. On hybrid and inverter-charger units the single most common cause is configuration rather than failure: a charge-source priority set to solar-only so the unit deliberately ignores utility and generator, a charge current limit left at or near zero, or a battery profile that does not match the bank installed. After settings, the diagnosis splits three ways. Either the unit is not accepting its AC input — measure at the inverter\'s own AC input terminals and check frequency as well as voltage, because a generator that wanders outside the acceptance window is rejected exactly as a UPS would reject it. Or the charger is delivering and the battery cannot accept charge, which an aged bank will do while still showing a plausible resting voltage. Or, least often, the charging stage itself has failed. Establish which of the three before ordering any part.',

  symptoms: {
    display: [
      'Battery state of charge static or falling while an AC source is present',
      'No charging indication despite utility or generator being available',
      'Charging indicated but current shown as zero or negligible',
      'AC input not accepted, input out of range, or utility-fail indication',
      'Battery fault or battery-type mismatch warning',
    ],
    indicators: [
      'Charger LED off while the AC input LED is lit',
      'Both AC and charge indications absent',
      'Fault indication specific to the charging stage',
    ],
    sounds: [
      'Transfer relay clicking repeatedly as the unit accepts then rejects the AC source',
      'Charger cooling fan never running, which suggests the stage is not operating at all',
      'Gassing or bubbling from flooded cells, which indicates over-charging rather than under-charging',
    ],
    smells: [
      'Acid or sulphurous smell at the battery bank, indicating over-charging or a failing cell',
      'Hot electronics smell from the enclosure, which warrants immediate investigation',
    ],
    behaviour: [
      'Charges from the generator but not from utility, or the reverse, which points at input acceptance rather than the charger',
      'Charges only in strong sun on a hybrid, which is usually the charge-source priority setting',
      'Charges to a point then stops well short of full, which suggests the battery or the profile rather than the charger',
      'Charged normally until a settings change, firmware update or battery replacement',
      'Battery warm during charging, which suggests over-charging or an internal battery fault',
    ],
    visible: [
      'AC input breaker and fuse condition',
      'Battery terminal corrosion, tightness and cable condition',
      'Battery age labels and installation dates',
      'Temperature sensor presence and where it is mounted',
      'Any discolouration or heat marking around the AC input terminals',
    ],
  },

  whatItMeans: {
    plain:
      'The inverter is not putting charge back into the batteries even though power is available. Often it has been told not to — by a setting that prefers solar, a charge limit turned down, or a battery type that does not match what is fitted. Sometimes it is refusing the incoming power because that supply is not good enough. Sometimes the batteries are simply too old to take a charge. The checks below separate those before anything is replaced.',
    technical:
      'The charging stage is a constant-voltage source with a current limit, operating to a profile selected for the battery chemistry: typically a bulk phase at the current limit, an absorption phase at a held voltage, and a float phase. The unit will only run that profile if it has accepted an AC source, which requires the input to satisfy configured voltage and frequency acceptance criteria — engine-driven supplies fail these far more often than utility, because frequency excursions during load steps push the input outside the window. Charge-source priority on hybrid units determines whether utility or generator may charge at all, and setting it to solar-only produces a unit that is functioning exactly as configured while appearing faulty. Because a constant-voltage charger supplies whatever current the bank draws at the held voltage, and that current falls as the bank approaches full, low charging current is only meaningful when interpreted against state of charge: a healthy full bank legitimately draws almost nothing, while a genuinely discharged bank drawing nothing indicates a battery that can no longer accept charge. Temperature compensation, where fitted, adjusts the held voltage against battery temperature; a failed sensor produces chronic over- or under-charging that presents as premature battery failure rather than as a charger alarm.',
  },

  causes: {
    mostLikely: [
      'Charge-source priority configured to solar-only, so utility and generator are deliberately ignored',
      'Charge current limit set at or near zero',
      'AC input not accepted — frequency or voltage outside the configured window, commonly on generator supply',
      'Battery bank at end of life and no longer able to accept charge',
    ],
    possible: [
      'Battery type or charge profile does not match the bank actually installed',
      'AC input breaker tripped or fuse open',
      'Loose or corroded battery terminals raising resistance in the charge path',
      'BMS on a lithium bank inhibiting charge for its own protective reasons',
    ],
    lessCommon: [
      'Temperature compensation sensor failed, causing chronic under- or over-charging',
      'Charging stage within the unit failed',
      'Firmware or configuration corrupted after an update',
      'Battery bank of mixed ages, where older blocks limit the whole string',
    ],
    modelSpecific: [
      'Charge-source priority, current limit and battery-profile options differ substantially between manufacturers and models — read them from the equipment',
      'Absorption and float voltages are chemistry-specific and configurable; take them from the battery documentation, never from a general figure',
      'Lithium banks charge under BMS control and the inverter may need a matching communication protocol selected',
      'Some units offer a wider input window or generator mode intended for engine-driven supplies',
      'Equalisation, where offered, must never be applied to a chemistry that does not permit it',
    ],
    environmental: [
      'Battery space running hot, which is the dominant factor in shortening battery life',
      'Very low temperature reducing charge acceptance',
      'Dust or humidity causing terminal corrosion',
      'Unstable utility supply repeatedly falling outside the acceptance window',
    ],
    installation: [
      'Battery bank sized for energy alone without regard to charge and discharge rates',
      'Undersized or long DC cabling causing voltage drop that misleads the charger',
      'Temperature sensor not fitted, or mounted where it does not represent the battery',
      'Generator undersized for the combined site and charging load',
    ],
    maintenance: [
      'Battery capacity never tested, only terminal voltage checked',
      'Installation dates never recorded, so bank age is unknown',
      'Terminals never re-torqued',
      'Bank replaced block by block over time, mixing ages within one string',
    ],
    componentLevel: [
      'Charging stage or its control failed',
      'Internal charger fuse open',
      'Temperature sensor open or short circuit',
      'Input relay or contactor failed, so the AC source is never connected through',
    ],
  },

  safety: {
    isolation: [
      'The battery bank cannot be switched off and is live whenever connected',
      'Isolate the AC input, the DC and any solar source before working on the unit, then prove dead at the point of work',
      'A solar array is live in any daylight and cannot be switched off at source',
      'Confirm the DC bus has discharged before opening the enclosure',
    ],
    lockoutTagout: [
      'Lock and tag the AC input, the DC isolator and the array isolator',
      'Confirm with the site that the load may be unprotected during the work',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection at all times near batteries',
      'Acid-resistant gloves and apron for lead-acid work',
      'Insulated tools rated for the DC system voltage',
      'Remove watches, rings and metal bracelets before battery work',
    ],
    storedEnergy: [
      'DC bus capacitors retain a dangerous charge after disconnection — verify with a meter rather than trusting a stated time',
      'The battery bank remains live at all times',
      'Lead-acid batteries vent hydrogen while charging; ventilate before working and remove ignition sources',
    ],
    specificHazards: [
      'A dropped tool across battery terminals will weld instantly and can rupture the battery',
      'DC arcs do not self-extinguish as AC arcs do',
      'Never work on a battery that is swollen, hot, leaking or damaged — isolate the area and escalate',
      'Never apply an equalisation or boost charge to a chemistry that does not permit it; this can destroy a bank and, with sealed batteries, cause venting or rupture',
    ],
    stopAndCallProfessional: [
      'Any battery is swollen, hot, leaking or physically damaged',
      'There is a burnt smell or visible damage inside the unit',
      'The installation uses a lithium bank whose BMS behaviour you cannot interrogate',
      'Work requires opening the enclosure and you cannot verify the DC bus has discharged',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter', why: 'AC input at the inverter terminals and DC at the battery — the two measurements that split the diagnosis' },
    { tool: 'Frequency-capable meter or power quality analyser', why: 'Generator frequency is a leading reason an AC input is rejected, and a voltage-only check misses it entirely' },
    { tool: 'DC clamp meter', why: 'Actual charge current into the bank, which distinguishes a charger fault from a battery that cannot accept charge' },
    { tool: 'Battery impedance analyser or capacity tester', why: 'Establishing whether the bank can still accept and hold charge; resting voltage will mislead you' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Battery and terminal temperature — heat is both a cause and a symptom' },
    { tool: 'Insulated torque wrench', why: 'Battery and DC terminations must be torqued to specification' },
    { tool: 'Access to the unit configuration interface', why: 'Charge-source priority, current limit and battery profile are read and corrected here, and settings resolve a large share of these faults' },
  ],

  decisionTree: [
    { question: 'Is any battery swollen, hot, leaking or damaged?', yes: 'Stop. Isolate the area and escalate.', no: 'Continue' },
    { question: 'Is the charge-source priority set to allow charging from the available source?', yes: 'Continue', no: 'The unit is behaving as configured. Correct the priority setting and re-test.' },
    { question: 'Is the charge current limit set to a usable value?', yes: 'Continue', no: 'A limit at or near zero produces exactly this symptom' },
    { question: 'Is AC present at the INVERTER input terminals, with frequency in the accepted window?', yes: 'Continue', no: 'The unit is rejecting or not receiving the source — this is an input problem, not a charger fault' },
    { question: 'Does the battery profile match the bank actually installed?', yes: 'Continue', no: 'Correct the profile; a mismatch causes chronic under- or over-charging' },
    { question: 'Is current flowing into the bank, and is the bank actually discharged?', yes: 'Charging is occurring — the concern is capacity or rate, not the charger', no: 'A discharged bank drawing no current at correct voltage cannot accept charge' },
    { question: 'Do all blocks show similar voltage and internal resistance?', yes: 'Continue', no: 'One degraded block limits the whole string' },
    { question: 'With settings correct, AC accepted and a proven-good bank, is charging still absent?', yes: 'The charging stage is genuinely faulty. Refer for workshop diagnosis.', no: 'Fault resolved — complete validation and record the cause' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Inspect the battery bank before anything else',
      inspect: 'Physical condition, installation dates, terminal condition and temperature',
      where: 'At the battery bank',
      instrument: 'Inspection light, infrared thermometer',
      expected: 'No swelling, leakage or heat; terminals clean and tight; dates recorded',
      ifAbnormal: 'A swollen or hot battery ends the diagnosis and becomes a safety matter. Installation dates alone frequently answer the question.',
      next: 'Step 2',
      warning: 'Do not disturb a swollen, leaking or damaged battery.',
    },
    {
      step: 2,
      title: 'Read the configuration before touching hardware',
      inspect: 'Charge-source priority, charge current limit, battery type and profile',
      where: 'Unit configuration interface',
      instrument: 'Display or service software',
      expected: 'Priority permits the available source; current limit usable; profile matches the bank',
      ifAbnormal: 'This resolves a large share of these callouts with no tools at all. A hybrid set to solar-only is functioning exactly as configured.',
      next: 'Step 3',
      verify: 'The correct absorption and float voltages for the chemistry installed — take these from the battery documentation, never from a general figure.',
    },
    {
      step: 3,
      title: 'Check AC input protection and presence',
      inspect: 'AC input breaker, fuse and voltage at the inverter input terminals',
      where: 'Inverter AC input terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Nominal AC present at the unit',
      ifAbnormal: 'No AC at the terminals moves the fault upstream. Measure at the unit, not at a nearby socket on another circuit.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Check input frequency, especially on generator supply',
      inspect: 'Input frequency and its stability through load changes',
      where: 'Inverter AC input terminals',
      instrument: 'Frequency-capable meter or analyser',
      expected: 'Frequency at nominal and steady',
      ifAbnormal: 'Frequency wandering on load steps causes the unit to reject the source. That is a generator governing problem, not a charger fault, and adjusting the inverter to accept it treats the symptom.',
      next: 'Step 5',
      verify: 'The configured input acceptance window for this model — it differs between units and must be read from the equipment.',
    },
    {
      step: 5,
      title: 'Measure charge current and interpret against state of charge',
      inspect: 'Actual DC current flowing into the bank',
      where: 'Battery cable, using a DC clamp',
      instrument: 'DC clamp meter',
      expected: 'Substantial current into a discharged bank, tapering as it approaches full',
      ifAbnormal: 'Low current alone is not a fault — a full bank legitimately draws almost nothing. Low current into a genuinely discharged bank is the finding that matters, and it indicts the battery.',
      next: 'Step 6',
      warning: 'Use a DC clamp. An AC-only clamp reads nothing useful here.',
    },
    {
      step: 6,
      title: 'Measure per-block voltage and internal resistance',
      inspect: 'Each block across the bank',
      where: 'At each block in turn',
      instrument: 'Multimeter and battery impedance analyser',
      expected: 'All blocks within a narrow band of each other',
      ifAbnormal: 'One block markedly different limits the whole string. Rising internal resistance appears well before terminal voltage reveals anything.',
      next: 'Step 7',
      verify: 'Acceptable internal resistance for the specific battery type — an absolute figure means little without the manufacturer reference or a commissioning baseline.',
    },
    {
      step: 7,
      title: 'Check temperature compensation and the DC path',
      inspect: 'Compensation sensor health and mounting; voltage drop and heat along the charge path',
      where: 'At the sensor and across every DC termination',
      instrument: 'Multimeter, thermal camera, torque wrench',
      expected: 'Sensor healthy and representative; joints cool and torqued to specification',
      ifAbnormal: 'A failed sensor causes chronic over- or under-charging. A high-resistance joint makes the charger see a voltage the battery never receives, so it terminates charging early.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Confirm BMS permission on lithium banks',
      inspect: 'Whether the BMS is permitting charge, and whether the communication protocol matches',
      where: 'BMS interface and inverter configuration',
      instrument: 'BMS software or display',
      expected: 'BMS permitting charge and communicating correctly with the inverter',
      ifAbnormal: 'A BMS may inhibit charging for temperature, cell imbalance or protection reasons the inverter reports only as a generic fault.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Only now conclude the charging stage has failed',
      inspect: 'Whether charging is absent with correct settings, an accepted AC input and a proven-good bank',
      where: 'At the unit',
      instrument: 'All prior measurements',
      expected: 'All external and configuration causes eliminated first',
      ifAbnormal: 'A unit that will not charge a proven-good bank from an accepted source has a genuine internal fault. Conclude this last, not first.',
      next: 'Refer for workshop diagnosis with measurements recorded',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Settings — check these first',
      steps: [
        'Set charge-source priority to permit the sources the site actually has',
        'Set a usable charge current limit appropriate to the bank capacity',
        'Select the battery type and profile that matches the bank installed',
        'Where a lithium BMS communicates with the inverter, select the matching protocol',
        'Enable and verify temperature compensation where fitted',
      ],
      note: 'A large share of these faults are resolved here, with no parts and no disassembly.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Charge path integrity',
      steps: [
        'Clean corroded terminals and re-torque every DC joint to specification',
        'Replace undersized or overheated DC cabling',
        'Mount the temperature sensor where it genuinely represents the battery',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Battery bank',
      steps: [
        'Replace a bank at end of life as a complete matched set',
        'Never mix new blocks with old — the old blocks drag the new ones down and the fault returns within months',
        'Record installation dates and take a commissioning impedance baseline',
        'Dispose of removed batteries through a licensed route',
      ],
    },
    {
      level: 'mechanical',
      title: 'Battery environment',
      steps: [
        'Improve ventilation or provide cooling where the battery space runs hot',
        'Fit temperature monitoring so the environment is visible rather than assumed',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Charging stage',
      steps: [
        'Refer charging stage and control faults to the manufacturer or a properly equipped facility',
        'Provide the measured voltages, currents and configuration, which shortens the repair considerably',
      ],
    },
  ],

  validation: [
    'Confirm the unit accepts the AC source and enters a charging phase',
    'Confirm charge current is present and tapers correctly as the bank approaches full',
    'Confirm the held voltage matches the profile for the chemistry installed',
    'Record per-block voltage and internal resistance as a new baseline',
    'Prove real autonomy with a timed discharge where capacity is in question',
    'Re-torque and thermally survey every DC joint under load after the work',
    'Record the settings changed, the measurements taken and the cause identified',
  ],

  whenNotToRepair: [
    'A bank at or beyond service life — replacement is the fix, and further charger investigation is wasted effort',
    'Any battery showing swelling, leakage or heat damage',
    'Banks partially replaced over time, producing a mixed-age set that will never perform',
    'Obsolete units where charging boards and firmware are unobtainable',
    'Where the battery environment cannot be brought within specification, since a new bank will simply repeat the failure',
  ],

  prevention: [
    'Record the commissioned configuration so an unintended settings change is detectable',
    'Test battery capacity annually rather than relying on terminal voltage',
    'Take an impedance baseline at commissioning and trend against it',
    'Keep the battery space ventilated or cooled; heat is the dominant life factor',
    'Re-torque DC terminations at every service visit',
    'Replace banks as complete matched sets, planned at end of design life rather than at failure',
    'Where a generator charges the bank, confirm its frequency stability under load rather than assuming it',
  ],

  relatedSlugs: ['inverter-switches-off-under-load', 'inverter-will-not-switch-on', 'solar-charge-controller-not-charging', 'ups-not-charging-batteries'],

  faq: [
    {
      q: 'It charges from solar but never from the generator. Is the charger faulty?',
      a: 'Usually not. Check two things first: the charge-source priority setting, which on many hybrids is set to solar-only and makes the unit ignore other sources by design; and the generator\'s frequency stability, because a set that wanders on load steps is rejected by the input acceptance criteria. Both are common and neither is a charger fault.',
    },
    {
      q: 'The charger shows almost no current. Does that mean it has failed?',
      a: 'Only if the bank is genuinely discharged. A constant-voltage charger supplies whatever current the bank draws at the held voltage, and that falls to almost nothing as the bank fills. Low current into a full bank is correct behaviour; low current into a flat bank means the battery can no longer accept charge.',
    },
    {
      q: 'Can I set a higher charge voltage to force more charge in?',
      a: 'No. The absorption and float voltages are properties of the chemistry, not preferences. Raising them over-charges the bank, drives water loss and heat, and with sealed batteries can cause venting or rupture. If the bank will not take charge at the correct voltage, the bank is the problem.',
    },
    {
      q: 'Why did charging stop working right after we replaced the batteries?',
      a: 'Almost always the battery profile. A new bank of a different chemistry or capacity needs the charge profile, current limit and, on lithium, the communication protocol reselected. The unit is charging to the old bank\'s rules, which the new bank either refuses or cannot use.',
    },
  ],

  references: [
    'IEC 62109-1 and IEC 62109-2 — safety of power converters for use in photovoltaic power systems',
    'IEC 62040-1 — UPS general and safety requirements, where the unit performs a UPS function',
    'IEEE 1188 — recommended practice for maintenance, testing and replacement of VRLA batteries',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The inverter and battery manufacturer\'s documentation for the specific units, which gives the charge profile voltages, acceptance windows and torque figures referred to throughout',
  ],
};
