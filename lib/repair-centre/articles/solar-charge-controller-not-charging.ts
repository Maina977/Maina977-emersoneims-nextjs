import type { RepairArticle } from '../types';

export const solarChargeControllerNotCharging: RepairArticle = {
  slug: 'solar-charge-controller-not-charging',
  hub: 'solar',
  header: {
    title: 'Solar Charge Controller Not Charging the Battery',
    equipmentCategory: 'Solar charge controllers — PWM and MPPT',
    appliesTo: 'PWM and MPPT charge controllers in off-grid and hybrid systems, lead-acid and lithium banks',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. Most of these are settings, connection order or a battery that can no longer accept charge, rather than a failed controller.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'PV array DC per string design; battery DC per system design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Check three things before suspecting the controller, because between them they account for most of these callouts. First, the battery profile: a controller set for the wrong chemistry holds the wrong voltage, and on lithium it may be refused by the BMS entirely. Second, whether the array is actually delivering — measure open-circuit voltage at the controller input in good light, not at the panel, because a blown string fuse or an open connector reads perfectly at one end and nothing at the other. Third, the battery itself, since a bank at end of life accepts almost no current while showing a plausible resting voltage. One installation detail causes more controller failures than any fault: many controllers require the BATTERY to be connected first so they can detect system voltage, and connecting the array first can damage them. If the unit was commissioned in the wrong order, that history matters. Interpret charge current against state of charge rather than on its own, because a full battery legitimately draws almost nothing and that is not a fault.',

  symptoms: {
    display: [
      'Charge current shown as zero or negligible in good sun',
      'Battery voltage static or falling through the day',
      'Controller showing no PV input despite daylight',
      'Battery type or voltage mismatch warning',
      'Controller display blank, which is a supply problem rather than a charging fault',
    ],
    indicators: [
      'Charging indicator off while the PV indicator is lit, or the reverse',
      'Load output disconnected by low-voltage disconnect',
      'Fault indication specific to battery or PV input',
    ],
    sounds: [
      'Relay clicking repeatedly as the controller connects and disconnects',
      'Cooling fan never running on units that have one',
      'Gassing at flooded cells, which indicates over-charging rather than under-charging',
    ],
    smells: [
      'Acid smell at the bank, indicating over-charging or a failing cell',
      'Burnt smell at the controller or its terminals, which means stop before reconnecting anything',
      'Hot terminal smell, usually a loose or undersized connection',
    ],
    behaviour: [
      'Charged correctly until the batteries were replaced, which points at the profile rather than the controller',
      'Charges in strong sun only, suggesting an array or connection problem rather than a controller fault',
      'Battery reaches a voltage then charging stops well short of full',
      'Battery warm during charging, which is over-charging and a different fault',
      'Worked until an array string was added or changed',
      'Controller was connected to the array before the battery at installation, which can damage it',
    ],
    visible: [
      'Battery terminal corrosion, tightness and cable size',
      'PV input and battery fuses or breakers',
      'Controller terminal condition and any heat discolouration',
      'Battery age labels and installation dates',
      'Temperature sensor presence and where it is mounted',
      'Array condition, soiling and shading',
    ],
  },

  whatItMeans: {
    plain:
      'The controller sits between the panels and the battery and decides how much charge to pass. When nothing is going in, it is usually because the controller has been told the wrong battery type, the panels are not actually delivering, or the battery is too old to take a charge. A failed controller is possible but it is the least likely of the three.',
    technical:
      'A charge controller regulates array output into the battery to a voltage profile determined by the chemistry selected, typically bulk at available current, absorption at a held voltage, then float. Because it is a constant-voltage source once out of bulk, the current it passes is whatever the battery draws at the held voltage, so current falls as state of charge rises and low current is only meaningful when the bank is genuinely discharged. The distinction between PWM and MPPT matters for diagnosis: a PWM controller effectively connects the array to the battery, so array voltage is pulled close to battery voltage and the useful power is limited by array current at that voltage. An MPPT controller converts, tracking the array maximum power point and stepping voltage down, which is why an MPPT unit requires array voltage meaningfully above battery voltage before it can begin, and why a partly shaded or degraded string can leave an MPPT controller with insufficient input to start while the array still shows voltage. Temperature compensation, where fitted, adjusts the held voltage against battery temperature; a sensor that has failed or is mounted away from the bank produces chronic over- or under-charging that looks like a controller fault. Connection order at commissioning is a genuine hazard rather than a formality: many controllers derive their system-voltage detection and their own supply from the battery, so energising the PV input first can damage the unit.',
  },

  causes: {
    mostLikely: [
      'Battery profile set for the wrong chemistry or system voltage',
      'Array not delivering — blown string fuse, open connector, shading or soiling',
      'Battery bank at end of life, unable to accept charge',
      'Loose or corroded battery or PV terminations',
    ],
    possible: [
      'MPPT input voltage below what the controller needs to start',
      'Charge current limit configured low',
      'BMS on a lithium bank inhibiting charge',
      'Temperature compensation sensor failed or badly mounted',
      'Undersized cabling causing voltage drop the controller reads as a full battery',
    ],
    lessCommon: [
      'Controller damaged by being connected to the array before the battery',
      'Controller output stage failed',
      'Reverse polarity damage',
      'Lightning or surge damage',
      'Firmware or configuration corrupted after an update',
    ],
    modelSpecific: [
      'Absorption and float voltages are chemistry-specific and configurable — take them from the battery documentation, never from a general figure',
      'MPPT controllers need array voltage above battery voltage by a margin the manufacturer states; PWM units do not work that way',
      'Maximum PV input voltage differs by model and must not be exceeded, including in cold conditions',
      'Connection and disconnection order is specified by the manufacturer and varies',
      'Lithium support and BMS communication differ substantially between controllers',
    ],
    environmental: [
      'Dust and soiling reducing array output continuously in Kenyan conditions',
      'Shading from vegetation growth or new structures',
      'High battery temperature shortening life and affecting compensation',
      'Humidity and corrosion at terminals',
      'Cold mornings raising array open-circuit voltage, which matters against the controller maximum input',
    ],
    installation: [
      'Array voltage sized without checking the controller maximum input at low temperature',
      'Undersized battery cabling causing voltage drop',
      'Temperature sensor not fitted, or mounted where it does not represent the bank',
      'Controller commissioned in the wrong connection order',
      'Array sized beyond the controller current rating',
    ],
    maintenance: [
      'Battery capacity never tested, only voltage checked',
      'Array never cleaned',
      'Terminals never re-torqued',
      'Settings never recorded, so an unintended change is undetectable',
      'Installation dates never recorded, so bank age is unknown',
    ],
    componentLevel: [
      'Controller output stage failed',
      'PV or battery fuse open',
      'Temperature sensor open or short circuit',
      'Battery cells failed',
    ],
  },

  safety: {
    isolation: [
      'A PV array is live in any daylight and cannot be switched off at source',
      'A battery bank cannot be switched off and is live at all times',
      'Isolate the array and the battery separately, and prove dead at the point of work',
      'Follow the manufacturer disconnection order; on many controllers the battery is disconnected last',
    ],
    lockoutTagout: [
      'Lock and tag the array isolator and the battery isolator',
      'Where a load output is in use, warn the site that it will be lost',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection at all times near batteries',
      'Acid-resistant gloves for lead-acid work',
      'Insulated tools rated for the array and battery voltages',
      'Remove watches, rings and metal bracelets before battery work',
    ],
    storedEnergy: [
      'The battery remains live and can deliver very high fault current',
      'The array generates whenever there is light',
      'Controller capacitors may retain charge briefly after disconnection',
    ],
    specificHazards: [
      'CONNECTION ORDER MATTERS. Many controllers must have the BATTERY connected first so they can detect system voltage, and connecting the array first can destroy the unit. Check the manufacturer sequence before wiring or rewiring.',
      'DC arcs do not self-extinguish. Never break a PV or battery connection under load — open the isolator first.',
      'A dropped tool across battery terminals will weld instantly and can rupture the battery',
      'Lead-acid batteries vent hydrogen while charging; ventilate and remove ignition sources',
      'Never apply an equalisation charge to a chemistry that does not permit it',
    ],
    stopAndCallProfessional: [
      'Any battery is swollen, hot, leaking or damaged',
      'There is a burnt smell at the controller',
      'The array voltage may exceed the controller maximum input',
      'A lithium BMS is inhibiting charge for reasons you cannot interrogate',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter rated for the array voltage', why: 'Array open-circuit voltage at the CONTROLLER input, and battery voltage at its terminals' },
    { tool: 'DC clamp meter', why: 'Actual charge current into the bank, which separates a controller fault from a battery that cannot accept charge' },
    { tool: 'Battery load tester or impedance analyser', why: 'Assessing the bank by capability; resting voltage will mislead you' },
    { tool: 'Irradiance meter', why: 'Judging whether the array is delivering what the conditions allow, rather than what the nameplate says' },
    { tool: 'Infrared thermometer', why: 'Battery and terminal temperature; heat indicates over-charging or a poor joint' },
    { tool: 'Insulated torque wrench', why: 'Battery and PV terminations are torque-specified' },
    { tool: 'Controller configuration access and the battery documentation', why: 'Profile voltages must match the chemistry installed, and both must be read rather than assumed' },
  ],

  decisionTree: [
    { question: 'Is any battery swollen, hot or leaking?', yes: 'Stop. Isolate the area and escalate.', no: 'Continue' },
    { question: 'Does the battery profile match the chemistry actually installed?', yes: 'Continue', no: 'Correct it. A wrong profile is the commonest cause and needs no parts.' },
    { question: 'Is array voltage present at the CONTROLLER input in good light?', yes: 'Continue', no: 'The array or its wiring is the fault, not the controller' },
    { question: 'On MPPT: is array voltage above battery voltage by the margin the manufacturer requires?', yes: 'Continue', no: 'The controller cannot start; check string configuration, shading and soiling' },
    { question: 'Is current flowing into a genuinely discharged bank?', yes: 'Charging is occurring — the issue is capacity or rate', no: 'A discharged bank drawing nothing cannot accept charge' },
    { question: 'Does the bank pass a capacity test?', yes: 'Continue', no: 'End of life — replacement is the fix' },
    { question: 'Was the controller ever connected to the array before the battery?', yes: 'Suspect damage from commissioning order', no: 'Continue' },
    { question: 'With profile correct, array delivering and bank proven good, is charging still absent?', yes: 'Controller fault — refer or replace', no: 'Resolved; validate and record' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Inspect the bank and record its age',
      inspect: 'Physical condition, installation dates, terminal condition and temperature',
      where: 'At the battery bank',
      instrument: 'Inspection light, infrared thermometer',
      expected: 'No swelling or heat, terminals clean and tight, dates recorded',
      ifAbnormal: 'A hot battery means over-charging, which is the opposite fault. Installation dates frequently answer the question outright.',
      next: 'Step 2',
      warning: 'Do not disturb a swollen, hot or leaking battery.',
    },
    {
      step: 2,
      title: 'Read the configuration before touching hardware',
      inspect: 'Battery chemistry, system voltage, absorption and float settings, charge current limit',
      where: 'Controller configuration',
      instrument: 'Controller display or software',
      expected: 'Profile matching the bank actually installed',
      ifAbnormal: 'A profile left from a previous bank is extremely common after a battery replacement, and resolves the fault with no parts at all.',
      next: 'Step 3',
      verify: 'The correct absorption and float voltages for the installed chemistry, from the battery documentation.',
    },
    {
      step: 3,
      title: 'Measure array voltage at the controller input',
      inspect: 'Open-circuit voltage at the controller PV terminals, in good light',
      where: 'Controller PV input terminals, not at the array',
      instrument: 'Multimeter rated for the array voltage',
      expected: 'Array voltage present and consistent with the string configuration',
      ifAbnormal: 'A blown string fuse or open connector reads perfectly at the panel and nothing at the controller. Measuring at the wrong end is the classic error here.',
      next: 'Step 4',
      warning: 'Use a meter rated for the full array voltage.',
    },
    {
      step: 4,
      title: 'On MPPT units, check the input is high enough to start',
      inspect: 'Array voltage against battery voltage and the manufacturer start requirement',
      where: 'Controller input and battery terminals',
      instrument: 'Multimeter',
      expected: 'Array voltage above battery voltage by the required margin',
      ifAbnormal: 'An MPPT controller steps voltage down and needs headroom to work. A shaded, soiled or partly failed string can leave voltage present but insufficient to start, which looks like a dead controller.',
      next: 'Step 5',
      verify: 'The minimum start voltage and maximum input voltage for this controller model.',
    },
    {
      step: 5,
      title: 'Measure charge current and read it against state of charge',
      inspect: 'DC current into the bank',
      where: 'On the battery cable, using a DC clamp',
      instrument: 'DC clamp meter',
      expected: 'Meaningful current into a discharged bank, tapering as it fills',
      ifAbnormal: 'Low current into a full bank is correct behaviour. Low current into a genuinely discharged bank indicts the battery, not the controller.',
      next: 'Step 6',
      warning: 'Use a DC clamp; an AC clamp reads nothing useful here.',
    },
    {
      step: 6,
      title: 'Test the bank by capability',
      inspect: 'Battery performance under load, per-block voltage and internal resistance',
      where: 'At the bank',
      instrument: 'Load tester or impedance analyser',
      expected: 'Bank able to accept and hold charge',
      ifAbnormal: 'An aged bank shows a plausible resting voltage and accepts almost nothing. One weak block limits the whole string.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check the charge path and temperature sensing',
      inspect: 'Voltage drop along the battery cabling under charge, and the compensation sensor',
      where: 'Across each termination and at the sensor',
      instrument: 'Multimeter, thermal camera',
      expected: 'Negligible drop, sensor healthy and representative of the bank',
      ifAbnormal: 'Undersized or corroded cabling makes the controller see a voltage the battery never receives, so it terminates charging early while appearing to work correctly.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Only now suspect the controller',
      inspect: 'Whether charging is absent with correct settings, a delivering array and a proven bank',
      where: 'At the controller',
      instrument: 'All prior measurements',
      expected: 'External causes eliminated first',
      ifAbnormal: 'Establish whether it was ever connected array-first at commissioning, since that damages many units and explains an otherwise unexplained failure.',
      next: 'Replace or refer, and commission the replacement in the correct order',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Settings — check these first',
      steps: [
        'Select the battery chemistry and system voltage actually installed',
        'Set absorption and float voltages from the battery documentation',
        'Set a usable charge current limit for the bank capacity',
        'Enable and verify temperature compensation, with the sensor mounted at the bank',
        'On lithium, select the matching BMS communication protocol',
        'Record the full configuration afterwards',
      ],
      note: 'A profile left over from a previous battery bank is one of the most common causes and costs nothing to correct.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Charge path',
      steps: [
        'Clean and re-torque battery and PV terminations',
        'Replace undersized or corroded battery cabling',
        'Replace blown string fuses after establishing why they operated',
        'Clean the array and clear shading',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Battery and controller',
      steps: [
        'Replace a bank at end of life as a complete matched set, never mixing new blocks with old',
        'Replace a failed controller with one rated for the array current and voltage, including cold-condition open-circuit voltage',
        'Commission the replacement in the manufacturer connection order — battery first on most units',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond field repair',
      steps: [
        'Refer suspected internal controller faults and firmware issues',
        'Provide the measured array and battery voltages, charge current and configuration',
      ],
    },
  ],

  validation: [
    'Confirm charge current flows into a discharged bank and tapers correctly',
    'Confirm the held voltage matches the profile for the chemistry installed',
    'Confirm array voltage at the controller input under good conditions',
    'Measure voltage drop along the battery cabling under charge',
    'Confirm temperature compensation operates and the sensor reads correctly',
    'Record per-block voltage and internal resistance as a new baseline',
    'Confirm the bank reaches full over a normal solar day rather than only rising briefly',
    'Record the configuration, measurements and cause identified',
  ],

  whenNotToRepair: [
    'Banks at or beyond service life — replacement is the fix and further controller investigation is wasted',
    'Controllers damaged by reverse polarity or array-first commissioning, where internal damage is rarely confined',
    'Controllers undersized for the array current or voltage, which need replacing with a correctly rated unit',
    'Systems where array voltage can exceed the controller maximum input in cold conditions — that is a design correction',
    'Obsolete controllers where firmware and support are unobtainable',
  ],

  prevention: [
    'Record the commissioned configuration so an unintended change is detectable',
    'Always connect and disconnect in the manufacturer order — battery first on most controllers',
    'Size array voltage against the controller maximum input at the lowest expected cell temperature, not at midday',
    'Test battery capacity annually rather than checking voltage',
    'Clean the array on a schedule suited to the site',
    'Re-torque battery and PV terminations at every service visit',
    'Reselect the battery profile whenever the bank is replaced — this single step prevents a large share of these callouts',
  ],

  relatedSlugs: ['solar-system-underperforming', 'inverter-not-charging-batteries'],

  faq: [
    {
      q: 'We fitted new batteries and now it will not charge properly. What changed?',
      a: 'Almost certainly the profile. The controller is still charging to the old bank\'s rules — wrong chemistry, wrong absorption and float voltages, sometimes wrong system voltage. Reselect the battery type and set the voltages from the new battery\'s documentation. On lithium you may also need to select the BMS communication protocol.',
    },
    {
      q: 'The panels show voltage but the MPPT controller does nothing. Is it dead?',
      a: 'Not necessarily. An MPPT controller steps array voltage down to battery voltage, so it needs the array meaningfully above the battery before it can start. A shaded, soiled or partly failed string can leave voltage present but below the start threshold. Measure array voltage at the controller input and compare it against the battery voltage and the manufacturer start requirement before condemning the unit.',
    },
    {
      q: 'Does it really matter which order I connect things?',
      a: 'Yes, and it is one of the few installation details that destroys equipment outright. Many controllers detect system voltage and take their own supply from the battery, so connecting the array first can damage the unit permanently. Check the manufacturer sequence — on most controllers the battery goes on first and comes off last.',
    },
    {
      q: 'Charge current is almost zero. Has the controller failed?',
      a: 'Only if the bank is genuinely discharged. Once out of bulk, a controller holds a voltage and passes whatever current the battery draws at it, and that falls to almost nothing as the bank fills. Low current into a full bank is correct. Low current into a flat bank means the battery can no longer accept charge.',
    },
  ],

  references: [
    'IEC 62109-1 — safety of power converters for use in photovoltaic power systems',
    'IEC 62548 — photovoltaic arrays: design requirements',
    'IEC 60364-7-712 — low-voltage installations: photovoltaic power supply systems',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The controller and battery manufacturers\' documentation for the specific equipment, which is the only valid source for charge profile voltages, maximum PV input, MPPT start requirements and connection order referred to throughout',
  ],
};
