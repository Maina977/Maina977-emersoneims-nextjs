import type { RepairArticle } from '../types';

export const inverterSwitchesOffUnderLoad: RepairArticle = {
  slug: 'inverter-switches-off-under-load',
  hub: 'inverters',
  header: {
    title: 'Inverter Switches Off When Load Is Connected — Diagnosis and Repair',
    equipmentCategory: 'Off-grid, hybrid and inverter-charger systems',
    appliesTo: 'Low- and high-frequency off-grid inverters, hybrid inverters and inverter-chargers on 12 V, 24 V and 48 V battery systems',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Straightforward if measured correctly. Nearly all cases are resolved by watching battery voltage at the terminals during the moment of load application.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'EmersonEIMS Engineering — pending named reviewer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: '12 V / 24 V / 48 V DC battery side; 240 V 50 Hz AC output',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'An inverter that shuts down the moment load is applied is almost always reporting a battery-side problem rather than an inverter fault. When load is applied, current rises sharply, and any resistance between the battery and the inverter converts that current into a voltage drop. If the voltage at the inverter terminals falls below its low-voltage cut-out, it disconnects to protect the battery — and it does so correctly. The single most informative measurement is battery voltage taken at the inverter terminals, watched at the instant of load application, not before it and not after recovery. A battery that reads healthy at rest and collapses under load is the most common finding by a wide margin, followed by loose or undersized DC cabling, then genuine overload, then surge current from a motor. A failed output stage is possible but should be concluded last, not first.',

  symptoms: {
    display: [
      'Low battery, under-voltage or battery-protect indication at the moment of shutdown',
      'Overload or over-current indication where the load genuinely exceeds capability',
      'Over-temperature indication where the unit shuts down after running rather than instantly',
      'No fault indication at all, which points to the protection acting faster than the display updates',
    ],
    indicators: [
      'Output present with no load and disappearing the moment load is applied',
      'Audible relay or contactor click as the output disconnects',
      'Battery indication showing full at rest, which misleads if it is only ever read at rest',
      'Cooling fan running hard before shutdown on a thermal trip',
    ],
    sounds: [
      'A click at the moment of shutdown as the output relay drops out',
      'A brief buzz or growl from the transformer on a low-frequency unit as it attempts to supply surge current',
      'Fan running at full speed before shutdown, which points at thermal rather than battery',
    ],
    smells: [
      'Hot electronics smell, which warrants immediate isolation and inspection',
      'Acid smell at the battery bank, indicating over-charging or a failing cell',
      'Any burnt smell means stop and inspect before further testing',
    ],
    behaviour: [
      'Runs small loads indefinitely but trips on a larger one',
      'Trips only on motor loads such as a pump, fridge or compressor, which points at surge current',
      'Worked correctly until recently, which points at battery ageing or a connection that has loosened',
      'Trips sooner as the battery bank ages or as ambient temperature rises',
      'Recovers immediately and runs again with no load, confirming the inverter itself is functional',
    ],
    visible: [
      'DC cable size relative to the inverter rating and the run length',
      'Discolouration, heat damage or corrosion at DC terminals and lugs',
      'Battery terminal condition and tightness',
      'Ventilation obstruction around the inverter',
      'Battery case swelling, leakage or heat',
    ],
  },

  whatItMeans: {
    plain:
      'The inverter is switching off on purpose to protect the battery. When you connect a load, it draws a large current from the battery. If the battery is weak, or the cables are too small or loose, the voltage drops far enough that the inverter decides the battery is nearly flat and disconnects. The inverter is usually working correctly and telling you about a problem somewhere else.',
    technical:
      'Power drawn on the AC side is supplied from the DC side at a much higher current, inversely proportional to the battery voltage — which is why a 12 V system suffers this fault far more readily than a 48 V system for the same output. The instantaneous terminal voltage seen by the inverter is the battery open-circuit voltage less the product of that current and the total series resistance: battery internal resistance plus cable resistance plus every joint in the DC path. Battery internal resistance rises substantially with age, sulphation and low temperature, so an ageing bank can hold a normal resting voltage yet collapse under current. Cable and joint resistance contribute the same way, which is why an undersized or loose connection produces symptoms indistinguishable from a failing battery until they are measured separately. Motor loads add a further transient: direct-on-line starting draws several times running current for a brief period, and an inverter must supply that surge from the same DC path. The correct diagnostic sequence therefore isolates the voltage drop and attributes it — to the battery, to the cabling, or to a genuine capability limit — before any consideration of the power stage.',
  },

  causes: {
    mostLikely: [
      'Battery bank aged or sulphated, holding resting voltage but collapsing under current',
      'DC cabling undersized for the inverter rating or the cable run length',
      'Loose, corroded or poorly crimped DC terminations creating resistance exactly where current is highest',
      'Genuine overload — connected load exceeding the continuous rating of the unit',
    ],
    possible: [
      'Motor surge current exceeding the inverter surge capability, even though running load is within rating',
      'Low-voltage cut-out set higher than appropriate for the battery chemistry in use',
      'One weak cell or one failed block dragging down an otherwise healthy bank',
      'Battery temperature low, raising internal resistance markedly',
    ],
    lessCommon: [
      'Thermal shutdown where ventilation is obstructed or ambient is high, presenting as a load-related trip because load generates the heat',
      'Battery management system disconnecting on its own protection rather than the inverter tripping',
      'Parallel battery strings with mismatched age or capacity, so one string does the work',
      'Output stage or gate-driver degradation limiting deliverable current',
    ],
    modelSpecific: [
      'Low-voltage cut-out and restart thresholds are configurable on most units and must be set for the battery chemistry actually installed — lithium and lead-acid require different settings',
      'Surge rating and its permitted duration vary widely between low-frequency and high-frequency designs; a low-frequency transformer-based unit generally sustains motor surge better',
      'Some hybrid units apply a separate discharge limit through the BMS communication link, which overrides the inverter setting entirely',
    ],
    environmental: [
      'Low battery temperature raising internal resistance and reducing available capacity',
      'High ambient temperature reducing the inverter thermal headroom',
      'Dust obstructing the cooling path',
      'Corrosive or humid coastal environment degrading terminations',
    ],
    installation: [
      'DC cable run far longer than necessary, adding avoidable resistance',
      'Cable sized on continuous current without allowance for surge',
      'Battery bank undersized for the load profile rather than for the energy total',
      'Multiple joints, isolators or shunts in the DC path each adding resistance',
      'Battery and inverter separated by a distance the system was never designed for',
    ],
    maintenance: [
      'Terminals never re-torqued or inspected since installation',
      'Battery capacity never tested, only voltage checked',
      'Bank never equalised or maintained per the chemistry requirements',
      'Ventilation filters never cleaned',
    ],
    componentLevel: [
      'DC bus capacitors degraded, reducing ability to support transients',
      'Output stage devices degraded, limiting current capability',
      'Current sense circuit drifted, causing premature over-current detection',
      'Cooling fan failed, causing thermal shutdown under load',
    ],
  },

  safety: {
    isolation: [
      'Isolate the AC output and the DC supply before working on terminations',
      'Open the battery isolator and confirm the DC side is dead at the point of work',
      'Treat the AC output as live until proven dead — an inverter can restart automatically',
    ],
    lockoutTagout: [
      'Lock off the battery isolator and tag it',
      'Where a changeover or mains input exists, prove dead on that source too',
      'Confirm no automatic restart or remote start can occur while work is in progress',
    ],
    ppe: [
      'Eye protection at all times near a battery bank',
      'Insulated tools for all DC work — a dropped spanner across battery terminals will weld and can cause an explosion',
      'Remove watches, rings and metal bracelets before working on the DC side',
      'Acid-resistant gloves for flooded lead-acid banks',
    ],
    storedEnergy: [
      'A battery bank cannot be switched off. It is live whenever it is connected, and it can deliver thousands of amps into a short.',
      'DC bus capacitors inside the inverter retain charge after disconnection. Observe the manufacturer\'s discharge time before opening the enclosure.',
      'Lead-acid banks vent hydrogen; ventilate before working and eliminate ignition sources',
      'Lithium banks can enter thermal runaway if damaged — never work on a swollen or physically damaged module',
    ],
    specificHazards: [
      'DC arcs do not self-extinguish the way AC arcs do, which makes a DC short far more dangerous than the voltage suggests',
      'Never break a DC connection under load — open the isolator first',
      'Battery acid causes burns; know where the eyewash is before starting',
      'Working inside the inverter enclosure requires the capacitor discharge period to have elapsed and to be verified',
    ],
    stopAndCallProfessional: [
      'Any battery shows swelling, leakage, heat or physical damage',
      'There is a burnt smell or visible damage inside the inverter enclosure',
      'The work requires opening the inverter enclosure and you cannot verify capacitor discharge',
      'The DC system voltage or bank size is beyond your competence to work on safely',
      'The installation shows signs of heat damage at the DC terminations',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter', why: 'Battery voltage at the inverter terminals, measured at the instant of load application — the decisive measurement' },
    { tool: 'DC clamp meter', why: 'Actual DC current drawn during load application; an AC-only clamp reads nothing useful here' },
    { tool: 'Battery load tester or capacity tester', why: 'Voltage alone neither condemns nor clears a battery; capacity does' },
    { tool: 'Battery internal resistance meter', why: 'Identifying the weak block in a bank without discharging the whole thing' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Finding a hot termination under load — the visual signature of a resistive joint' },
    { tool: 'Torque wrench with insulated drive', why: 'Terminals must be torqued to specification; both under- and over-tightening cause resistance' },
    { tool: 'Clamp meter with inrush function', why: 'Capturing motor starting surge where the trip is motor-related' },
    { tool: 'Insulated spanners and screwdrivers', why: 'All DC work near a battery bank' },
  ],

  decisionTree: [
    { question: 'Does the inverter run normally with no load connected?', yes: 'The inverter is functional. The fault is in the DC supply path or in the load.', no: 'This is a different fault — diagnose no-output rather than shutdown-under-load' },
    { question: 'What does battery voltage at the INVERTER terminals do at the instant of load application?', yes: 'Holds up — the battery path is adequate; investigate genuine overload, surge and thermal', no: 'Collapses — attribute the drop between battery internal resistance and cable/joint resistance' },
    { question: 'Measured at the BATTERY terminals at the same instant, does voltage also collapse?', yes: 'The battery is the limitation — test capacity and internal resistance per block', no: 'The battery is healthy; the drop is in the cabling and joints between battery and inverter' },
    { question: 'Is any DC termination noticeably warm under load?', yes: 'That joint is the resistance. Re-make it properly and re-measure.', no: 'Continue' },
    { question: 'Is the DC cable sized for the inverter rating AND the run length?', yes: 'Continue', no: 'Upsize the cable or shorten the run; this is a design fault, not a component fault' },
    { question: 'Does it trip only on motor loads?', yes: 'Surge current is exceeding capability — consider soft start, a larger inverter, or a low-frequency design', no: 'Continue' },
    { question: 'Is the connected load within the continuous rating of the unit?', yes: 'Continue to thermal and settings', no: 'This is genuine overload; reduce load or uprate the inverter' },
    { question: 'Does it run for a while and then trip, with the fan running hard?', yes: 'Thermal — check ventilation, ambient and the cooling fan', no: 'Check the low-voltage cut-out setting against the battery chemistry, then consider the power stage' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Confirm the inverter works unloaded',
      inspect: 'AC output voltage and stability with no load connected',
      where: 'At the inverter output terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Nominal output voltage, stable',
      ifAbnormal: 'If there is no stable output unloaded, this is a different fault and the shutdown-under-load path does not apply.',
      next: 'Step 2',
      warning: 'Treat the output as live. The inverter may restart automatically after a trip.',
    },
    {
      step: 2,
      title: 'Watch battery voltage at the inverter terminals during load application',
      inspect: 'DC voltage at the instant the load is switched on',
      where: 'Directly at the inverter DC input terminals, not at the battery and not at a distribution point',
      instrument: 'True-RMS multimeter, ideally with min/max capture',
      expected: 'Voltage dips modestly and recovers, staying comfortably above the low-voltage cut-out',
      ifAbnormal: 'A collapse to or below the cut-out is the fault, and it explains the shutdown completely. This single measurement resolves the majority of cases.',
      next: 'Step 3',
      verify: 'The low-voltage cut-out and restart thresholds for the specific unit and the configured battery chemistry.',
    },
    {
      step: 3,
      title: 'Repeat the measurement at the battery terminals to attribute the drop',
      inspect: 'DC voltage at the battery posts at the same instant',
      where: 'Directly on the battery terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Comparison with Step 2 identifies where the voltage is being lost',
      ifAbnormal: 'Both collapse together means the battery is the limitation. Battery holds while the inverter terminals collapse means the loss is in the cable and joints — a cheaper and more certain fix.',
      next: 'Step 4 for a cabling loss, Step 6 for a battery limitation',
    },
    {
      step: 4,
      title: 'Measure voltage drop across each joint under load',
      inspect: 'Voltage drop across every termination, isolator, fuse and shunt in the DC path',
      where: 'Meter probes either side of each connection, under load',
      instrument: 'True-RMS multimeter',
      expected: 'Only a small drop across each joint',
      ifAbnormal: 'A significant drop across one joint locates the fault exactly. This is the most precise and least expensive diagnostic step available here.',
      next: 'Step 5',
      warning: 'Do not break any DC connection while under load. Open the isolator first.',
    },
    {
      step: 5,
      title: 'Thermal-check the DC path under load',
      inspect: 'Temperature of terminations, lugs, isolator and fuse holders',
      where: 'Across the whole DC path while load is applied',
      instrument: 'Infrared thermometer or thermal camera',
      expected: 'All terminations at or near ambient',
      ifAbnormal: 'A warm joint is a resistive joint. Heat and voltage drop are two views of the same fault, and the thermal check often finds it faster.',
      next: 'Re-make the joint properly, then re-test from Step 2',
    },
    {
      step: 6,
      title: 'Test the battery properly rather than by voltage',
      inspect: 'Capacity and internal resistance, per block where the bank is made of several',
      where: 'At each battery or block in the bank',
      instrument: 'Battery load tester or capacity tester, and an internal resistance meter',
      expected: 'Capacity above the replacement threshold and internal resistance consistent across blocks',
      ifAbnormal: 'One high-resistance block limits the entire bank. Resting voltage will not reveal it, which is why banks are so often wrongly cleared.',
      next: 'Step 7',
      verify: 'The acceptable internal resistance and capacity thresholds for the specific battery type and chemistry.',
    },
    {
      step: 7,
      title: 'Measure the actual load and any starting surge',
      inspect: 'Steady-state load and the inrush at switch-on',
      where: 'On the AC output, and on the DC input with a DC clamp',
      instrument: 'Clamp meter with inrush capture, plus a DC clamp meter',
      expected: 'Steady load within the continuous rating and surge within the unit surge capability and duration',
      ifAbnormal: 'A motor load can be within continuous rating yet exceed surge capability. This trips the inverter without the installation being overloaded in any steady-state sense.',
      next: 'Step 8',
      verify: 'The continuous and surge ratings of the specific unit, and the duration for which the surge rating applies.',
    },
    {
      step: 8,
      title: 'Check the thermal path where the trip follows a period of running',
      inspect: 'Ventilation clearance, intake obstruction, fan operation and ambient temperature',
      where: 'Around and inside the inverter enclosure',
      instrument: 'Infrared thermometer and visual inspection',
      expected: 'Clear airflow, fan running under load, ambient within the unit specification',
      ifAbnormal: 'A thermal trip presents as load-related because load generates the heat, but the fix is ventilation or the fan, not the battery.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Verify the protection settings match the battery actually installed',
      inspect: 'Low-voltage cut-out, restart threshold and any BMS-imposed discharge limit',
      where: 'Inverter configuration and the BMS where communication is present',
      instrument: 'Unit display or configuration software',
      expected: 'Settings appropriate to the chemistry and bank installed',
      ifAbnormal: 'A cut-out set for one chemistry applied to another causes premature shutdown. Where a BMS communicates a discharge limit, that limit overrides the inverter setting entirely.',
      next: 'Only after all the above, consider the power stage',
      warning: 'Do not lower a low-voltage cut-out simply to stop the tripping. That transfers the damage to the battery bank.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Terminations',
      steps: [
        'Clean, re-make and torque every DC termination to the specified value',
        'Replace poorly crimped or corroded lugs rather than re-tightening them',
        'Apply appropriate protection to terminals in humid or coastal environments',
      ],
      note: 'This group resolves a large share of these faults at negligible cost, and is the first thing to do rather than the last.',
    },
    {
      level: 'wiring',
      title: 'DC cabling',
      steps: [
        'Upsize DC cable to suit the inverter rating and the actual run length, not just the continuous current',
        'Shorten the run where the battery has been located further from the inverter than necessary',
        'Remove unnecessary joints, and replace undersized isolators or fuse holders in the DC path',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Battery bank',
      steps: [
        'Replace blocks that fail capacity or internal resistance testing',
        'Replace a lead-acid bank as a complete matched set rather than individual blocks',
        'Correct charging settings that caused the degradation, or the replacement will follow the original',
      ],
      note: 'Mixing new and old lead-acid blocks drags the new ones down to the condition of the old.',
    },
    {
      level: 'configuration',
      title: 'Settings and load management',
      steps: [
        'Set the low-voltage cut-out and restart thresholds for the chemistry actually installed',
        'Verify any BMS-communicated discharge limit is consistent with the inverter configuration',
        'Apply soft starting to motor loads, or stagger their starting, where surge is the limitation',
      ],
    },
    {
      level: 'mechanical',
      title: 'Cooling',
      steps: [
        'Restore ventilation clearance and clean intake filters',
        'Replace a failed cooling fan',
        'Relocate or shade a unit mounted in an unsuitable thermal environment',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Power stage',
      steps: [
        'Refer suspected output-stage or DC bus capacitor degradation to a properly equipped repair facility',
        'Provide the measured data gathered above, which shortens the repair considerably',
      ],
      note: 'Conclude a power-stage fault only after the DC path, the battery, the load and the settings have all been measured and eliminated.',
    },
  ],

  validation: [
    'Apply the full intended load and confirm the inverter carries it without tripping',
    'Watch battery voltage at the inverter terminals during load application and confirm it stays well above the cut-out',
    'Start the largest motor load and confirm the surge is ridden through',
    'Thermal-check all DC terminations under load and confirm they remain at or near ambient',
    'Run at full load long enough for temperatures to stabilise and confirm no thermal trip',
    'Confirm the low-voltage cut-out and restart thresholds are correct for the installed chemistry',
    'Record the measured voltage drop, load current and terminal temperatures as a baseline for the next visit',
  ],

  whenNotToRepair: [
    'Carbonised or tracked PCB substrate inside the inverter, where the board material itself is compromised',
    'Repeated power-stage failure where the underlying cause — surge, overload or thermal — has not been corrected',
    'A battery bank at end of life where replacement is the actual fix and the inverter was never faulty',
    'Obsolete units where the output-stage devices or control board are no longer obtainable',
    'Where the repair cost approaches the cost of a correctly sized replacement — an undersized inverter repeatedly repaired is a design problem, not a repair problem',
  ],

  prevention: [
    'Size DC cabling for the inverter rating and the run length, with allowance for surge rather than continuous current alone',
    'Re-torque and thermal-check DC terminations at every service visit',
    'Capacity-test the battery bank annually rather than relying on resting voltage',
    'Set and record the low-voltage cut-out for the installed chemistry at commissioning',
    'Apply soft starting to significant motor loads at design stage rather than after the complaint',
    'Keep the inverter within its ventilation and ambient specification',
    'Size the bank for the load profile and surge demand, not only for the daily energy total',
  ],

  relatedSlugs: [],

  faq: [
    {
      q: 'The battery reads full. How can it be the battery?',
      a: 'Resting voltage measures state of charge, not the ability to deliver current. An aged or sulphated battery has high internal resistance, so it holds a normal voltage at rest and collapses the moment current is drawn. This is the single most common misdiagnosis on this fault. Test capacity and internal resistance, not voltage.',
    },
    {
      q: 'Can I just lower the low-voltage cut-out so it stops tripping?',
      a: 'No. The cut-out exists to prevent the battery being discharged below the point where it is damaged. Lowering it does not fix the voltage drop, it simply moves the damage from an inconvenient shutdown to a destroyed battery bank.',
    },
    {
      q: 'It only trips when the borehole pump starts. Is the inverter too small?',
      a: 'Possibly, but not necessarily. Direct-on-line motor starting draws several times running current briefly, so a motor well within the continuous rating can still exceed the surge capability. Options are a soft starter, a low-frequency inverter design which generally sustains surge better, or a larger unit. Measure the actual inrush before deciding.',
    },
    {
      q: 'Why measure at the inverter terminals rather than at the battery?',
      a: 'Because the inverter acts on the voltage it sees, not the voltage the battery produces. Measuring at both points at the same instant is what separates a failing battery from a cabling or connection problem, and those two have completely different and differently priced solutions.',
    },
  ],

  references: [
    'IEC 62109-1 and 62109-2 — safety of power converters for use in photovoltaic power systems',
    'IEC 62040-1 — UPS general and safety requirements, where the unit is an inverter-charger with UPS function',
    'IEEE 1188 — recommended practice for maintenance, testing and replacement of VRLA batteries',
    'The inverter and battery manufacturer\'s documentation for the specific units, which gives the surge rating, its duration, the cut-out thresholds and the terminal torque figures',
  ],
};
