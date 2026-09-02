import type { RepairArticle } from '../types';

export const solarSystemUnderperforming: RepairArticle = {
  slug: 'solar-system-underperforming',
  hub: 'solar',
  header: {
    title: 'Solar System Producing Less Than Expected — Diagnosis',
    equipmentCategory: 'Solar PV systems — array, strings and yield',
    appliesTo: 'Grid-tied, hybrid and off-grid PV systems, roof and ground mounted, single- and three-phase',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Moderate. The hard part is establishing what output SHOULD be right now, because without that "low output" is an opinion rather than a measurement.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'PV array DC per string design; AC output 240 V / 415 V 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Establish the expected output for the conditions before calling anything a fault, because most "underperforming" systems are being judged against the nameplate rather than against what the array can actually produce at that moment. Module ratings are stated at a standard test condition that a real roof almost never sees: output rises with irradiance and falls as cell temperature rises, so a hot afternoon legitimately produces less than a cool bright morning, and a system can be working perfectly while disappointing its owner. Measure irradiance and cell temperature alongside output, or compare against a known-good reference day, and only then judge. Once you have a real baseline, work from the cheapest and commonest causes outward: soiling, which in dusty Kenyan conditions is continuous and substantial; shading that did not exist at commissioning, from vegetation growth or a new structure; then a string that is down entirely, which shows immediately if you compare string currents against each other. Inverter and settings issues, export limitation from high grid voltage, and genuine module degradation come after those, because they are less common and more expensive to chase.',

  symptoms: {
    display: [
      'Daily or monthly yield below expectation on the monitoring portal',
      'One MPPT input producing markedly less than an identical neighbour',
      'Inverter output flat-topping through the middle of the day',
      'String current or voltage reported low on one input',
      'No fault indication at all, which is common and does not mean the system is healthy',
    ],
    indicators: [
      'Inverter running normally with no alarm while yield is down',
      'Monitoring showing a step change on a particular date, which usually points at an event rather than gradual decline',
      'Battery not reaching full on a hybrid system',
    ],
    sounds: [
      'Normal inverter operation, since underperformance is usually silent',
      'Arcing or crackling at a DC connection — an immediate stop-work finding',
      'Inverter fan running constantly, which may indicate thermal derating',
    ],
    smells: [
      'Burnt smell at a combiner, connector or isolator, indicating arcing',
      'Hot plastic smell around DC connectors, often the first sign of a failing joint',
    ],
    behaviour: [
      'Output fell suddenly on a specific date, suggesting a string loss, fuse or connector rather than degradation',
      'Output has declined gradually over months, which suggests soiling or degradation',
      'Output good in the morning and poor by midday, which is often temperature derating rather than a fault',
      'Output poor in the middle of the day but fine early and late, which suggests clipping or export limitation',
      'Performance dropped after nearby building work or tree growth',
      'Hybrid system charging poorly despite good sun, which may be charge-priority settings rather than the array',
      'System has never met expectations since commissioning, which points at design or expectation rather than a developing fault',
    ],
    visible: [
      'Module soiling — dust, bird droppings, cement dust, agricultural residue',
      'Shading from vegetation, structures, antennas, flues or newly built walls',
      'String fuse and DC isolator condition',
      'DC connector condition, especially mated pairs of different brands',
      'Module condition — cracking, delamination, discoloured cells, snail trails',
      'Cable routing, abrasion and rodent damage under the array',
      'Inverter ventilation and mounting location, particularly direct sun on the enclosure',
    ],
  },

  whatItMeans: {
    plain:
      'The system is producing less electricity than someone expected. Sometimes that is a fault — dirty panels, shade, a string that has stopped working. Quite often it is not a fault at all, because panels are rated under laboratory conditions that a real roof never sees, and hot panels produce less than cool ones. The first job is working out what the system should be making right now, so you know whether there is anything to fix.',
    technical:
      'PV module ratings are declared at standard test conditions, and real output is governed principally by plane-of-array irradiance and by cell temperature. Current scales closely with irradiance, while voltage carries a negative temperature coefficient, so power falls as cell temperature rises, which is why peak production commonly occurs on a cool bright morning rather than at the hottest part of the afternoon, and why an installation can be entirely healthy while disappointing an owner comparing it against nameplate. Meaningful diagnosis therefore requires a reference: irradiance and cell temperature measured alongside output, or a comparison against a known-good day at similar conditions. Within the array, strings of identical configuration should produce closely comparable current under the same irradiance, so comparison between strings localises a fault far faster than any absolute figure. Partial shading behaves non-linearly: because cells are in series, a shaded cell limits its whole substring until a bypass diode conducts, so a small shadow can remove a disproportionate share of a string\'s output, and a failed bypass diode makes that loss permanent. Soiling reduces irradiance reaching the cells directly and is a continuous, significant loss in dusty environments rather than an occasional one. On the AC side, output can be limited by the inverter reaching its rated power — clipping, which may be correct design behaviour on an intentionally oversized array — or by grid voltage rising to the point where the inverter must reduce export to stay within its protection settings, a condition that presents as underperformance while originating entirely outside the PV system.',
  },

  causes: {
    mostLikely: [
      'Soiling — dust, bird droppings and agricultural or cement dust, a continuous and substantial loss in Kenyan conditions',
      'Shading that did not exist at commissioning, from vegetation growth or new structures',
      'A string down entirely — blown string fuse, open connector or isolator',
      'Expectation measured against nameplate rather than against achievable output for the conditions',
    ],
    possible: [
      'High cell temperature reducing output, which is normal physics rather than a fault',
      'Grid voltage high, forcing the inverter to limit export',
      'Mismatched or degraded DC connectors raising resistance',
      'Charge-priority or settings issue on a hybrid system',
      'Inverter clipping because the array is oversized relative to the inverter',
    ],
    lessCommon: [
      'Failed bypass diodes making shading losses permanent',
      'Module degradation, cracking or delamination',
      'MPPT tracking poorly or a failed MPPT input',
      'Undersized DC or AC cabling causing losses',
      'Inverter derating from high ambient temperature or direct sun on the enclosure',
      'Monitoring reporting incorrectly while the system is actually fine',
    ],
    modelSpecific: [
      'Module temperature coefficients and rated output come from the module data sheet — do not apply a general percentage',
      'Inverter rated power, MPPT window and clipping behaviour are model-specific',
      'Grid protection settings that limit export are set by local requirements and the model',
      'Hybrid charge-priority options differ substantially between manufacturers',
      'Monitoring platforms differ in whether they report AC output, DC yield or an estimate',
    ],
    environmental: [
      'Dust, which is the dominant continuous loss in much of Kenya',
      'High ambient and cell temperatures reducing output',
      'Seasonal irradiance and sun-path variation',
      'Vegetation growth, which changes shading over years',
      'Bird activity and nesting under modules',
      'Harmattan-type haze or smoke reducing irradiance for extended periods',
    ],
    installation: [
      'Array orientation or tilt compromised by roof constraints',
      'Modules mounted with insufficient ventilation behind them, raising cell temperature',
      'Inverter mounted in direct sun or an unventilated space',
      'Mixed connector brands mated together',
      'Cable sizing that ignores voltage drop over long runs',
      'System sized against optimistic assumptions, so it was never going to meet expectations',
    ],
    maintenance: [
      'Array never cleaned in a dusty environment',
      'Vegetation never cut back',
      'String currents never compared, so a dead string goes unnoticed for months',
      'No commissioning baseline recorded, so decline cannot be quantified',
      'Monitoring alerts ignored or never configured',
    ],
    componentLevel: [
      'String fuse open',
      'DC connector failed or high resistance',
      'Bypass diode failed',
      'Module degraded or cracked',
      'MPPT input failed',
    ],
  },

  safety: {
    isolation: [
      'A PV array is live in ANY daylight and cannot be switched off at source. Treat array conductors as live at all times.',
      'Open the DC and AC isolators and prove dead at the point of work',
      'Opening a DC isolator disconnects the array from the inverter — it does not de-energise the array',
      'Where a battery is present, isolate it separately as a third independent source',
    ],
    lockoutTagout: [
      'Lock and tag the AC isolator, DC isolator and any string isolators',
      'Lock and tag the battery isolator on hybrid systems',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection and insulated gloves rated for the array voltage',
      'Insulated tools rated for the DC system voltage',
      'Fall protection for any work at height on a roof array — statistically the greater hazard on this work',
      'Sun protection and hydration; this work is done in full sun by definition',
    ],
    storedEnergy: [
      'The array remains a live source throughout any work in daylight',
      'Inverter DC bus capacitors retain charge after disconnection — verify with a meter',
      'Any connected battery remains live at all times',
    ],
    specificHazards: [
      'DC arcs do not self-extinguish. NEVER break a DC connection under load — open the isolator first, and never unplug a connector that may be carrying current.',
      'Roof work is the dominant injury risk on solar maintenance. Fall protection is not optional, and cleaning a wet or steep roof array is a specific hazard.',
      'Cleaning modules with cold water in the middle of a hot day risks thermal shock to the glass — clean early or late.',
      'Never walk on modules. Micro-cracks caused by foot traffic reduce output permanently and are invisible at the time.',
      'A damaged module or cable can make array frames and mounting rails live — treat metalwork as suspect until proven otherwise',
    ],
    stopAndCallProfessional: [
      'There is evidence of arcing, burning or heat damage at any DC connection',
      'Array metalwork shows voltage to earth',
      'Roof access cannot be made safe',
      'An insulation or earth fault is indicated',
      'The finding is that the system was undersized or mis-designed, which is an engineering review rather than a repair',
    ],
  },

  tools: [
    { tool: 'Irradiance meter', why: 'Without it, "low output" cannot be distinguished from "correct output for the conditions" — the single most important tool here' },
    { tool: 'Cell temperature probe or thermal camera', why: 'Output falls as cell temperature rises; judging performance without it is guesswork' },
    { tool: 'DC clamp meter', why: 'String current comparison, which localises a dead or weak string in minutes' },
    { tool: 'True-RMS multimeter rated for the full array voltage', why: 'String open-circuit voltage; a meter rated only for mains is not adequate' },
    { tool: 'Thermal camera', why: 'Hot cells, failed bypass diodes and hot DC connections' },
    { tool: 'Power quality analyser with logging', why: 'Grid voltage through a production day, where export limitation is suspected' },
    { tool: 'Module and inverter data sheets', why: 'Rated output, temperature coefficients and MPPT window must be read, never assumed' },
    { tool: 'Commissioning records and monitoring history', why: 'Decline can only be quantified against a baseline' },
  ],

  decisionTree: [
    { question: 'Is there evidence of arcing, burning or heat at a DC connection?', yes: 'Stop. Isolate and investigate — this is a fire risk.', no: 'Continue' },
    { question: 'Has expected output for the CURRENT conditions been established?', yes: 'Continue', no: 'Do this first. Nameplate is not the benchmark, and without a reference there is nothing to diagnose.' },
    { question: 'Did output fall suddenly on a date, or decline gradually?', yes: 'Sudden points at a string, fuse or connector; gradual points at soiling or degradation', no: 'Check monitoring history to establish which' },
    { question: 'Are the modules soiled?', yes: 'Clean them and re-measure before going further — this is the commonest and cheapest cause', no: 'Continue' },
    { question: 'Is anything shading the array that was not there at commissioning?', yes: 'Vegetation or a new structure — a small shadow removes a disproportionate share of a string', no: 'Continue' },
    { question: 'Do all strings produce comparable current under the same irradiance?', yes: 'The array is balanced — look at the inverter, settings and AC side', no: 'The odd string is the fault — trace fuse, connector, isolator or modules' },
    { question: 'Is the inverter clipping, or is grid voltage forcing it to limit export?', yes: 'The limit is on the AC side or by design, not an array fault', no: 'Continue' },
    { question: 'Is output still below a properly established expectation?', yes: 'Investigate module degradation, bypass diodes and MPPT performance', no: 'System is performing correctly — report that plainly' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish what output SHOULD be right now',
      inspect: 'Irradiance, cell temperature and the module and inverter ratings',
      where: 'At the array, in the plane of the modules',
      instrument: 'Irradiance meter, temperature probe, data sheets',
      expected: 'A defensible expectation for the current conditions',
      ifAbnormal: 'This step is what separates diagnosis from opinion. Comparing against nameplate is the commonest error in solar troubleshooting, and it generates callouts to systems that are working correctly.',
      next: 'Step 2',
      verify: 'Module rated output and temperature coefficients from the data sheet, and inverter rated power — never a general rule of thumb.',
    },
    {
      step: 2,
      title: 'Read the monitoring history for the shape of the decline',
      inspect: 'Whether output fell on a specific date or declined gradually',
      where: 'Monitoring portal or inverter log',
      instrument: 'Monitoring platform',
      expected: 'A clear pattern in time',
      ifAbnormal: 'A step change on a date points at an event — a fuse, connector or string loss. A gradual decline points at soiling or degradation. This single observation halves the search.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Inspect for soiling and shading',
      inspect: 'Module surfaces, and anything casting shade at any time of day',
      where: 'At the array, across the whole installation',
      instrument: 'Visual inspection, ideally at more than one time of day',
      expected: 'Clean modules, no shading that was absent at commissioning',
      ifAbnormal: 'Soiling in dusty conditions is continuous and substantial rather than cosmetic. Shading behaves non-linearly — a small shadow can remove a disproportionate share of a string because cells are in series.',
      next: 'Step 4',
      warning: 'Do not walk on modules. Foot traffic causes micro-cracks that permanently reduce output and are invisible at the time.',
    },
    {
      step: 4,
      title: 'Compare string currents against each other',
      inspect: 'Current from each string under the same irradiance, at the same moment',
      where: 'At each string conductor in the combiner',
      instrument: 'DC clamp meter, with irradiance recorded',
      expected: 'Strings of identical configuration producing closely comparable current',
      ifAbnormal: 'Comparison between strings is far more informative than any absolute figure and needs no reference data. A string reading zero or markedly low localises the fault immediately.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Check string protection and connectors on any odd string',
      inspect: 'String fuse, isolator and every DC connector on the affected string',
      where: 'Combiner box and along the string',
      instrument: 'Multimeter, thermal camera',
      expected: 'Fuse intact, connectors sound, no heat',
      ifAbnormal: 'Mismatched connector brands mated together are a recognised cause of high-resistance joints and arcing. Any heat or burning ends the diagnosis and becomes a safety matter.',
      next: 'Step 6',
      warning: 'Never unplug a DC connector that may be carrying current — open the isolator first.',
    },
    {
      step: 6,
      title: 'Thermally survey the array',
      inspect: 'Cell and module temperature distribution, and DC connection temperatures',
      where: 'Across the array, in good irradiance',
      instrument: 'Thermal camera',
      expected: 'Even temperature across modules; no hot spots or hot joints',
      ifAbnormal: 'Hot cells indicate cracking, mismatch or a failed bypass diode. A whole substring at a different temperature indicates a bypass diode conducting, which makes shading losses permanent if the diode has failed.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check the AC side for export limitation and clipping',
      inspect: 'Grid voltage through a production day, and whether inverter output is flat-topping at its rated power',
      where: 'Inverter AC terminals and the output profile',
      instrument: 'Power quality analyser with logging',
      expected: 'Grid voltage within the range permitting full export; output following irradiance rather than flat-topping',
      ifAbnormal: 'High grid voltage forces the inverter to reduce export, presenting as underperformance with the array entirely healthy. Flat-topping at rated power is clipping, which may be intentional design rather than a fault.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Check settings and, on hybrids, charge priority',
      inspect: 'Array configuration entered in the inverter, MPPT operation, and charge-priority settings',
      where: 'Inverter configuration',
      instrument: 'Service interface',
      expected: 'Configuration matching the installed array and the intended operation',
      ifAbnormal: 'On hybrid systems a charge-priority or export setting frequently explains apparent underperformance, and the array is doing exactly what it was told to do.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Only then consider module degradation',
      inspect: 'Module condition, age, and measured output against the data sheet allowing for conditions',
      where: 'At the modules',
      instrument: 'Multimeter, thermal camera, data sheets',
      expected: 'Output consistent with age and conditions',
      ifAbnormal: 'Degradation is real but slow, and it is the most expensive conclusion. Reach it only after soiling, shading, string faults, AC limitation and settings are eliminated.',
      next: 'Report findings against the established expectation, not against nameplate',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Cleaning and access — usually the biggest single gain',
      steps: [
        'Clean modules using water and a soft brush; avoid abrasives and harsh chemicals',
        'Clean early morning or late afternoon to avoid thermal shock to hot glass',
        'Cut back vegetation causing shading and plan for regrowth',
        'Replace mismatched or poorly crimped DC connectors with matched pairs of a single type',
        'Clear bird nesting from beneath modules and fit deterrents where it recurs',
      ],
      note: 'In dusty conditions, cleaning frequently recovers more output than any component replacement.',
    },
    {
      level: 'component-replacement',
      title: 'String and module components',
      steps: [
        'Replace open string fuses after establishing why they operated',
        'Replace failed isolators and degraded connectors rather than repeatedly cleaning them',
        'Replace modules with failed bypass diodes, cracking or delamination',
      ],
    },
    {
      level: 'configuration',
      title: 'Settings and design',
      steps: [
        'Correct the array configuration entered in the inverter',
        'Review hybrid charge-priority and export settings against the intended operation',
        'Review grid protection settings against local requirements before changing anything',
      ],
    },
    {
      level: 'mechanical',
      title: 'Thermal and mounting',
      steps: [
        'Restore ventilation behind modules where mounting has restricted it',
        'Relocate or shade an inverter mounted in direct sun, which derates it',
        'Correct cable routing that exposes cable to abrasion, UV or rodents',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Design and warranty',
      steps: [
        'Refer suspected module degradation within warranty for manufacturer assessment',
        'Refer systems that have never met expectation for a design review rather than repeated fault-finding',
        'Provide the measured output with recorded irradiance and cell temperature — without those the claim cannot be assessed',
      ],
    },
  ],

  validation: [
    'Re-measure output with irradiance and cell temperature recorded, and compare against the established expectation',
    'Compare string currents after the work and confirm they are balanced',
    'Confirm the affected string has returned to comparable output',
    'Thermal-survey the array and DC connections after the work',
    'Confirm monitoring is reporting correctly and alerts are configured',
    'Record irradiance, cell temperature, string currents and output as a new baseline',
    'Where the finding was that the system is performing correctly, report that plainly with the measurements that show it',
  ],

  whenNotToRepair: [
    'Where the system is performing correctly for the conditions and the issue is expectation — say so rather than replacing parts',
    'Systems undersized or mis-designed at the outset, which need an engineering review not a repair',
    'Modules with widespread degradation where replacement of the array section is more economical than piecemeal work',
    'Arrays with unavoidable shading that cannot be removed, where relocation or reconfiguration is the real answer',
    'Where roof access cannot be made safe',
  ],

  prevention: [
    'Clean modules on a schedule matched to the site — in dusty conditions this is the single highest-return maintenance action',
    'Record irradiance, cell temperature, string currents and output at commissioning so later comparison is meaningful',
    'Compare string currents at every service visit; a dead string is otherwise invisible for months',
    'Cut vegetation back before it shades the array, and account for growth',
    'Configure monitoring alerts and actually respond to them',
    'Inspect DC connectors and combiners for heat and ingress at every visit',
    'Set expectations at handover against achievable output for the site, not against nameplate — most "underperformance" complaints start here',
  ],

  relatedSlugs: ['solar-string-fault-diagnosis', 'solar-module-degradation-bypass-diodes', 'safe-isolation-and-proving-dead', 'solar-charge-controller-not-charging', 'solar-inverter-dc-bus-fault'],

  faq: [
    {
      q: 'Our panels are rated 10 kW but we never see 10 kW. Is something wrong?',
      a: 'Probably not. Module ratings are declared at a standard test condition that a real roof almost never experiences, and output falls as cell temperature rises, so a hot afternoon legitimately produces less than a cool bright morning. Before diagnosing anything, measure irradiance and cell temperature and work out what the array should be producing at that moment. A great many "underperformance" callouts are systems working exactly as they should.',
    },
    {
      q: 'A tree only shades one corner. Surely that cannot matter much?',
      a: 'It can matter far more than the shaded area suggests. Cells are wired in series, so a shaded cell limits the current of its whole substring until a bypass diode conducts. A small shadow can therefore remove a disproportionate share of a string\'s output, and if a bypass diode has failed the loss becomes permanent. Shading is worth removing even when it looks trivial.',
    },
    {
      q: 'How much does dirt really cost us?',
      a: 'In dusty conditions, more than most owners expect, and it is a continuous loss rather than an occasional one — soiling reduces the light reaching the cells directly. Cleaning frequently recovers more output than any component replacement. Clean with water and a soft brush, early or late in the day, because cold water on hot glass risks thermal shock. And never walk on the modules.',
    },
    {
      q: 'Output is fine in the morning but drops off at midday. What is that?',
      a: 'Two common possibilities, and they are distinguishable. If the output curve flat-tops at the inverter\'s rated power, that is clipping — often intentional where the array is deliberately oversized. If it sags instead, look at grid voltage: when it rises the inverter must reduce export to stay within its protection settings, which looks like underperformance while the array is entirely healthy. Log grid voltage through a production day to tell them apart.',
    },
  ],

  references: [
    'IEC 61215 — terrestrial photovoltaic modules: design qualification and type approval',
    'IEC 62446-1 — grid-connected PV systems: documentation, commissioning tests and inspection',
    'IEC 61724 — photovoltaic system performance monitoring',
    'IEC 60364-7-712 — low-voltage installations: photovoltaic power supply systems',
    'The module and inverter manufacturers\' data sheets for the specific equipment — the only valid source for rated output, temperature coefficients, MPPT window and rated power referred to throughout',
  ],
};
