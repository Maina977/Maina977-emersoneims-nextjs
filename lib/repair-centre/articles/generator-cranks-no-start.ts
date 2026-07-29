import type { RepairArticle } from '../types';

/**
 * Generator cranks but will not start.
 * Written from engineering principle. No manufacturer text is reproduced.
 */
export const generatorCranksNoStart: RepairArticle = {
  slug: 'generator-cranks-but-will-not-start',
  hub: 'generators',
  header: {
    title: 'Generator Cranks But Will Not Start — Diagnosis and Repair',
    equipmentCategory: 'Diesel generating set',
    appliesTo: 'Cummins, Perkins, Caterpillar, Volvo Penta, Deutz, Doosan, FG Wilson, SDMO and other electronic or mechanically governed diesel sets',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Moderate. Most cases resolve at the fuel or air stage; a minority require compression testing or ECU diagnostics.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Awaiting independent named-engineer sign-off',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: '12 V or 24 V DC starting; 240 V / 415 V 50 Hz output',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A diesel engine that turns over but does not fire is missing one of three things: fuel at the right pressure and timing, air in sufficient quantity, or compression high enough to raise the charge above the fuel\'s auto-ignition temperature. Cranking proves the starting circuit and the mechanical rotation are working, so the starter, battery and ring gear are already largely exonerated. Work in the order fuel, then air, then compression, because that is the order of both likelihood and cost. Confirm cranking speed first: an engine turning too slowly will not build enough heat of compression to fire even when fuel and air are perfect, and slow cranking is frequently misread as a fuel fault.',

  symptoms: {
    display: [
      'Controller reports a failure to start after the cranking period expires',
      'Overcrank, crank timeout or start-fail indication depending on the controller',
      'Engine speed shown during cranking but never rising to firing speed',
      'Fault codes may be present on electronically governed engines and should be read before anything is dismantled',
    ],
    indicators: [
      'Starting circuit clearly energised — the engine rotates',
      'Charge or battery indication may be normal, which is why the battery is often wrongly cleared',
      'Preheat indication may be absent on a cold engine, which is itself a clue',
    ],
    sounds: [
      'Even, continuous cranking with no attempt to fire',
      'Cranking that sounds laboured or slower than usual — investigate this before anything else',
      'Occasional irregular firing then dying back, which points to fuel starvation rather than no fuel at all',
    ],
    smells: [
      'No diesel smell at the exhaust after extended cranking suggests fuel is not reaching the cylinders',
      'Strong unburnt diesel smell suggests fuel is arriving but not igniting, which shifts suspicion to compression, timing or cold-start aid',
    ],
    behaviour: [
      'Starts readily when warm but not when cold, which points at the cold-start aid or at marginal compression',
      'Starts after repeated attempts, which usually means air in the fuel system',
      'Started normally until a recent service or fuel delivery, which points at what changed',
    ],
    visible: [
      'Fuel level and the state of the water separator',
      'Air filter restriction indicator',
      'Any fuel leak, loose union or perished flexible hose on the suction side',
      'Recently disturbed connectors or harness following other work',
    ],
  },

  whatItMeans: {
    plain:
      'The engine is turning over normally but is not firing. That means the starter, the batteries and the mechanical drive are doing their job, and the problem lies with what the engine needs in order to run: fuel, air, or enough compression to ignite that fuel. It is usually a fuel supply problem and usually inexpensive to correct.',
    technical:
      'A compression-ignition engine fires when the charge temperature at the end of compression exceeds the auto-ignition temperature of the injected fuel. Failure to fire therefore reduces to a shortfall in one of three variables: delivered fuel quantity and timing, trapped air mass, or effective compression ratio including its dependence on cranking speed and sealing. Because compression heating is a strong function of cranking speed, a set turning below its minimum cranking speed can fail to fire with an otherwise healthy fuel and air path. On electronically governed engines a further condition applies: the ECU must see a valid crankshaft position signal before it will command injection at all, so a position sensor fault presents identically to a fuel fault and must be excluded early.',
  },

  causes: {
    mostLikely: [
      'Air drawn into the fuel system on the suction side, commonly after a filter change, a fuel run-out or a disturbed union',
      'Fuel filter or water separator restricted to the point that supply pressure collapses under cranking demand',
      'Fuel supply valve closed, or the set drawing from a tank or compartment that is empty while another shows full',
      'Water or biological contamination in the fuel, which is very common on standby sets that stand for long periods',
    ],
    possible: [
      'Fuel lift or transfer pump not delivering its specified supply pressure',
      'Fuel shutoff or run solenoid not energising, so the engine cranks with the fuel path closed',
      'Cold-start aid inoperative on a cold engine — inlet air heater or glow plugs',
      'Cranking speed below the minimum the engine needs, usually from a tired battery or a high-resistance connection',
    ],
    lessCommon: [
      'Crankshaft or camshaft position sensor fault preventing the ECU from commanding injection',
      'High-pressure pump unable to build rail pressure',
      'Injector faults across several cylinders simultaneously',
      'Timing disturbed after recent mechanical work',
    ],
    modelSpecific: [
      'Start inhibits and interlocks differ between controllers and can silently prevent fuelling — confirm the specific inhibit logic for the controller fitted',
      'Some engines require a specific key-on dwell for rail pressurisation or preheat before cranking is productive',
      'Rail pressure thresholds for injection enable are engine-specific and must be read from the service data for that engine, not assumed',
    ],
    environmental: [
      'Low ambient temperature raising the compression heat required and thickening fuel',
      'Fuel waxing in cold conditions where the grade is unsuitable for the site',
      'High altitude reducing trapped air mass',
      'Dust ingress accelerating air filter restriction between services',
    ],
    installation: [
      'Fuel return routed into the suction side of a day tank, drawing hot or aerated fuel',
      'Suction lift beyond the pump capability, or an undersized suction line',
      'Battery cables undersized or too long, depressing cranking speed',
      'Air intake ducting restricted or a filter housing that does not seal',
    ],
    maintenance: [
      'Filters left beyond their hours interval',
      'Water separator never drained',
      'Fuel stored long enough to degrade, particularly on standby plant that runs rarely',
      'Batteries never capacity-tested, only voltage-checked',
    ],
    componentLevel: [
      'Fuel solenoid winding open or shorted',
      'Position sensor winding out of specification or its air gap incorrect',
      'Injector solenoid circuits open or shorted',
      'ECU output driver failure — rare, and only concluded after wiring and devices are proven',
    ],
  },

  safety: {
    isolation: [
      'Place the controller in the OFF or STOP position and prove the set cannot start automatically before working on it',
      'On automatic mains-failure installations, isolate the start command so a genuine mains failure cannot crank the engine while hands are on it',
      'Isolate the battery negative when working on starting or fuel-system electrics',
    ],
    lockoutTagout: [
      'Lock off the isolator and apply a tag naming the person working and the date',
      'Where a transfer switch is involved, prove both sources dead at the point of work — isolating one supply does not make an ATS safe',
      'Retain the only key with the person working on the set',
    ],
    ppe: [
      'Eye protection whenever the fuel system is opened',
      'Nitrile gloves for fuel handling',
      'Hearing protection if the set will be cranked with the canopy open',
      'No loose clothing, lanyards or wristwatches near the engine',
    ],
    storedEnergy: [
      'Common-rail systems hold extreme pressure after shutdown. Observe the manufacturer\'s stand-down period before opening any high-pressure union.',
      'Batteries remain live at all times and can deliver very high fault current — a dropped spanner across terminals will weld',
      'Charged starting-air receivers where fitted must be vented before work',
    ],
    specificHazards: [
      'High-pressure fuel injection penetrates skin and causes serious injury. Never search for a leak by hand and never crack a high-pressure union on a running or recently run engine.',
      'The engine may fire unexpectedly during testing — keep clear of the fan, belts and coupling',
      'Diesel on a hot exhaust is a fire risk; clean any spillage before cranking',
      'Extended cranking overheats the starter motor; observe the duty cycle and rest periods',
    ],
    stopAndCallProfessional: [
      'You do not have a safe way to prevent the set starting automatically',
      'The work requires opening the high-pressure fuel circuit',
      'Compression testing or injector removal is indicated',
      'The controller reports faults you cannot interpret with the documentation available',
      'There is any sign of fuel in the oil, coolant in the oil, or water in a cylinder',
    ],
  },

  tools: [
    { tool: 'Digital multimeter, true RMS', why: 'Supply voltage, solenoid resistance, sensor circuits and voltage-drop testing' },
    { tool: 'Clamp meter with DC range', why: 'Cranking current, and confirming the starter is drawing sensibly' },
    { tool: 'Low-pressure fuel gauge', why: 'Supply pressure at the inlet to the high-pressure pump — the measurement that separates supply-side from high-pressure faults' },
    { tool: 'Clear hose section', why: 'Fitted temporarily in the suction line to make air ingress visible rather than inferred' },
    { tool: 'Battery load tester or capacity tester', why: 'Voltage alone does not condemn or clear a battery' },
    { tool: 'Tachometer or controller live data', why: 'Confirming cranking speed against the engine minimum' },
    { tool: 'Service tool or fault-code reader', why: 'Reading active and stored codes and live data on electronically governed engines' },
    { tool: 'Compression test kit', why: 'Only where fuel and air have been eliminated' },
    { tool: 'Inspection light and mirror', why: 'Trigger wheel, connectors, leaks and chafed harness' },
  ],

  decisionTree: [
    { question: 'Is the engine cranking at or above its specified minimum cranking speed?', yes: 'Proceed to fuel checks', no: 'Resolve the starting circuit first — battery capacity, cable voltage drop, connections. Slow cranking alone can prevent firing.' },
    { question: 'Are there active or stored fault codes on the controller?', yes: 'Read and record them before dismantling anything; they may name the fault directly', no: 'Continue with the physical fuel path' },
    { question: 'Is there fuel in the tank being drawn from, with the supply valve open?', yes: 'Continue to filtration', no: 'Correct the supply and bleed the system' },
    { question: 'Does the water separator drain clean fuel with no water layer?', yes: 'Continue to supply pressure', no: 'Drain, replace filters, investigate tank condensation or contamination' },
    { question: 'Is supply pressure at the high-pressure pump inlet within the engine specification?', yes: 'Continue to air ingress', no: 'Work the lift pump, filters and suction restriction' },
    { question: 'Is the suction side free of air ingress on a clear-hose check?', yes: 'Continue to fuelling enable', no: 'Repair the leak, reseal unions, replace perished hose, then bleed' },
    { question: 'Does the fuel shutoff or run solenoid energise on the start command?', yes: 'Continue to position signal', no: 'Diagnose the solenoid supply, coil and linkage' },
    { question: 'Does the controller show a valid engine speed and position signal while cranking?', yes: 'Continue to air and compression', no: 'Diagnose the crankshaft and camshaft position sensors, air gap and trigger wheel' },
    { question: 'Is the air filter restriction within limit and the intake path clear?', yes: 'Proceed to compression assessment', no: 'Replace the element and correct the ingress source' },
    { question: 'Is compression within specification and even across cylinders?', yes: 'Refer for injection timing and high-pressure system assessment', no: 'Refer for mechanical assessment — this is a workshop decision, not a field repair' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Read the controller before touching anything',
      inspect: 'Active alarms, stored fault history, and live data during a cranking attempt',
      where: 'Controller display or a service tool connected to the diagnostic port',
      instrument: 'Service tool or fault-code reader',
      expected: 'Either a fault that names the problem directly, or a clean log that lets you proceed physically',
      ifAbnormal: 'A position sensor, rail pressure or fuelling-inhibit code shortens the whole diagnosis. Record everything before clearing.',
      next: 'Step 2',
      warning: 'Clearing codes before recording them destroys the evidence you are about to need.',
      verify: 'The meaning of any manufacturer-specific code must be confirmed against the service documentation for that controller and engine.',
    },
    {
      step: 2,
      title: 'Confirm cranking speed',
      inspect: 'Engine speed while cranking, and the battery voltage at the same moment',
      where: 'Controller live data for speed; meter across the battery terminals for voltage',
      instrument: 'Service tool or tachometer, plus a digital multimeter',
      expected: 'Speed at or above the engine\'s specified minimum cranking speed, with battery voltage holding well above the system minimum throughout',
      ifAbnormal: 'Slow cranking will prevent firing regardless of fuel and air. Treat it as the fault, not a symptom of one.',
      next: 'If speed is low go to Step 3. If speed is good go to Step 4.',
      verify: 'The minimum cranking speed and the acceptable voltage floor are engine-specific — confirm both from the engine data rather than assuming.',
    },
    {
      step: 3,
      title: 'Resolve slow cranking before anything else',
      inspect: 'Battery capacity, and voltage drop across every joint in the starting circuit while cranking',
      where: 'Across the battery, then across each connection in turn, then the earth return path',
      instrument: 'Digital multimeter and a battery load or capacity tester',
      expected: 'Battery holding capacity above its replacement threshold, and only a small voltage drop across each joint',
      ifAbnormal: 'A significant drop across one joint locates the fault precisely. Corroded or loose connections are the most common cause and cost nothing but time.',
      next: 'Re-test cranking speed, then Step 4',
      warning: 'Batteries vent hydrogen. No sparks or flames at the terminals, and disconnect the earth lead first.',
    },
    {
      step: 4,
      title: 'Prove fuel is present and reaching the engine',
      inspect: 'Tank level, which tank is selected, supply valve position, and the water separator contents',
      where: 'Tank, changeover valve if fitted, and the separator drain',
      instrument: 'Container for the drain sample',
      expected: 'Adequate fuel, correct tank selected, valve open, and clean fuel draining with no water layer or biological growth',
      ifAbnormal: 'Water or growth explains the fault and must be corrected at the tank, not just at the filter.',
      next: 'Step 5',
      warning: 'Contain the drain sample. Diesel on hot exhaust components is a fire risk.',
    },
    {
      step: 5,
      title: 'Measure supply pressure at the high-pressure pump inlet',
      inspect: 'Delivered supply pressure while cranking',
      where: 'The low-pressure gauge point at the inlet to the injection pump',
      instrument: 'Low-pressure fuel gauge',
      expected: 'Supply pressure within the engine specification and holding during cranking',
      ifAbnormal: 'Low supply pressure means the high-pressure pump cannot do its job. Work the filters, the lift pump and suction restriction before considering the injection equipment.',
      next: 'Step 6',
      verify: 'The required supply pressure is engine-specific. Read it from the engine data and do not accept a generic figure.',
    },
    {
      step: 6,
      title: 'Make air ingress visible rather than inferred',
      inspect: 'The suction side of the fuel system while cranking',
      where: 'A clear hose section fitted temporarily between the tank and the filter',
      instrument: 'Clear hose section',
      expected: 'A solid column of fuel with no bubbles',
      ifAbnormal: 'Bubbles confirm air ingress. Suspect loose unions, perished flexible hose, a leaking filter seal or a cracked pickup — the leak is often above the fuel level and will not weep when the engine is stopped.',
      next: 'Repair, bleed, retry. Then Step 7.',
      warning: 'Bleed the system by the manufacturer\'s method. Do not crack high-pressure unions to bleed a common-rail engine.',
    },
    {
      step: 7,
      title: 'Confirm the fuelling path is actually enabled',
      inspect: 'Fuel shutoff or run solenoid operation, and its linkage where mechanical',
      where: 'At the solenoid terminals and at the mechanism',
      instrument: 'Digital multimeter',
      expected: 'Full system voltage present at the coil on the start command, winding resistance within specification, and free mechanical travel',
      ifAbnormal: 'No voltage is a control-circuit fault; voltage present with no movement is a solenoid or linkage fault. An engine cranking with the fuel path closed behaves exactly like one with no fuel.',
      next: 'Step 8',
      verify: 'Solenoid coil resistance and whether the design is pull-and-hold are model-specific.',
    },
    {
      step: 8,
      title: 'Prove the position signal on electronically governed engines',
      inspect: 'Crankshaft and camshaft position signals during cranking',
      where: 'At the sensor connector, and on the controller live data',
      instrument: 'Digital multimeter for resistance; oscilloscope for signal quality',
      expected: 'Winding resistance within specification, correct air gap, and a clean consistent waveform while cranking',
      ifAbnormal: 'No valid position signal means the ECU will not command injection at all. Check the trigger wheel for damaged teeth and the sensor tip for ferrous debris before condemning the sensor.',
      next: 'Step 9',
      verify: 'Sensor resistance and air gap are engine-specific and must be confirmed from the engine data.',
    },
    {
      step: 9,
      title: 'Check the air path and the cold-start aid',
      inspect: 'Air filter restriction, intake ducting integrity, and cold-start aid operation if the engine is cold',
      where: 'Restriction indicator, ducting joints, and the heater or glow plug supply',
      instrument: 'Clamp meter for heater current; inspection light for the ducting',
      expected: 'Restriction within limit, sealed ducting, and the cold-start aid drawing its expected current when commanded',
      ifAbnormal: 'A dead cold-start aid explains a set that starts warm but not cold. A collapsed intake hose starves the engine at cranking speed.',
      next: 'Step 10',
    },
    {
      step: 10,
      title: 'Assess compression only once fuel and air are proven',
      inspect: 'Cranking compression on each cylinder',
      where: 'Through the injector or glow plug ports as the engine design allows',
      instrument: 'Diesel compression test kit rated for diesel pressures',
      expected: 'Pressure within the engine specification and, just as importantly, even across all cylinders',
      ifAbnormal: 'Low but even compression suggests general wear or a timing error. Low on one or two cylinders suggests valve or ring problems local to those cylinders.',
      next: 'Refer for mechanical assessment with the readings recorded',
      warning: 'Disable fuelling and the starting circuit appropriately before removing injectors or glow plugs, and take care not to drop anything into a cylinder.',
      verify: 'Diesel compression figures are engine-specific and are far higher than petrol figures. Use the value from the engine data, and a gauge rated for it.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Connections and contamination',
      steps: [
        'Clean and re-terminate corroded battery and earth connections, then protect them',
        'Drain the water separator and clean the sediment bowl',
        'Clean the sensor tip and trigger wheel of ferrous debris',
      ],
      note: 'This group resolves a large share of no-start calls at no parts cost.',
    },
    {
      level: 'wiring',
      title: 'Wiring and harness',
      steps: [
        'Repair chafed harness sections and restore proper routing and clamping',
        'Replace connectors that show corrosion or spread pins rather than cleaning them repeatedly',
        'Correct any earth path that shows measurable resistance',
      ],
    },
    {
      level: 'sensor-replacement',
      title: 'Sensors and solenoids',
      steps: [
        'Replace a position sensor that fails resistance or waveform testing',
        'Set the sensor air gap to the engine specification after fitting',
        'Replace a fuel shutoff solenoid that fails resistance testing',
      ],
    },
    {
      level: 'mechanical',
      title: 'Fuel supply mechanical',
      steps: [
        'Replace primary and secondary filters and bleed by the manufacturer\'s method',
        'Replace perished suction hose and reseal unions',
        'Replace a lift pump that cannot meet its supply pressure',
      ],
    },
    {
      level: 'configuration',
      title: 'Controller configuration',
      steps: [
        'Confirm the controller is in the correct operating mode and no interlock is inhibiting start',
        'Restore cranking and preheat timers to commissioned values',
      ],
      note: 'Record settings before changing them so the change is reversible.',
    },
    {
      level: 'manufacturer-level',
      title: 'Injection equipment and engine mechanical',
      steps: [
        'Refer high-pressure pump and injector work to properly equipped facilities',
        'Refer compression faults for mechanical assessment rather than attempting a field fix',
      ],
      note: 'Injector and pump work requires calibrated test equipment; a field guess here is expensive.',
    },
  ],

  validation: [
    'Start the set and confirm it fires promptly without extended cranking',
    'Allow it to reach normal operating temperature and confirm stable speed and voltage',
    'Apply load progressively and confirm it accepts load without smoke or speed droop',
    'Re-check for fuel leaks at every joint disturbed, under pressure and at temperature',
    'Confirm no active fault codes remain and clear the historic ones only after recording them',
    'Perform a second cold start after the set has stood, since a marginal fault often returns only when cold',
    'Record cranking time, supply pressure and any readings taken, so the next engineer has a baseline',
  ],

  whenNotToRepair: [
    'Compression low across all cylinders on a high-hours engine, where a rebuild is the real decision',
    'Coolant in the oil or fuel in the oil, indicating a fault well beyond a starting problem',
    'Repeated injection equipment failure caused by contaminated fuel that has not been addressed at the tank',
    'An engine whose parts support has ended and where injection components cannot be obtained',
    'Where cumulative repair cost approaches the value of a replacement set of the right rating for the load',
  ],

  prevention: [
    'Change fuel filters on the hours interval rather than the calendar',
    'Drain the water separator weekly on standby plant',
    'Keep tanks full during long shutdowns to limit condensation, and polish stored fuel where the set runs rarely',
    'Capacity-test batteries annually instead of relying on a voltage reading',
    'Run a monthly loaded exercise rather than a no-load run',
    'Keep starting-circuit connections clean, tight and protected',
    'Record cranking behaviour at each service so a slow decline is visible before it becomes a no-start',
  ],

  relatedSlugs: ['ats-not-changing-over', 'generator-battery-not-charging', 'generator-low-oil-pressure-shutdown', 'generator-starts-then-stops', 'starter-motor-clicks-but-will-not-crank'],

  faq: [
    {
      q: 'The engine cranks strongly, so can I rule out the battery?',
      a: 'Not entirely. Cranking that sounds strong can still be below the minimum speed the engine needs to build ignition heat, particularly when cold. Measure the speed against the engine specification rather than judging it by ear.',
    },
    {
      q: 'Should I use starting fluid to get it going?',
      a: 'No. Ether-based starting aids can cause serious engine damage, and on engines fitted with an inlet air heater they present a fire risk. They also mask the real fault. If the engine needs a starting aid to fire, diagnose why.',
    },
    {
      q: 'It starts after several attempts. Is that still a fault?',
      a: 'Yes. Repeated attempts before firing almost always means air is entering the fuel system on the suction side. It will worsen, and on a standby set it will fail on the day it matters.',
    },
    {
      q: 'Why check compression last when it is the classic cause?',
      a: 'Because it is not the classic cause on a set that was running recently. Fuel supply faults are far more common, much cheaper to correct, and can be eliminated in minutes. Compression testing is invasive, so it is the right last step rather than the first.',
    },
  ],

  references: [
    'SAE J1939 — vehicle network for diesel ECU diagnostics (SPN/FMI structure)',
    'ISO 8528 — reciprocating internal combustion engine driven AC generating sets',
    'ISO 3046 — reciprocating internal combustion engines, performance and derating',
    'The engine manufacturer\'s service documentation for the specific model, which takes precedence over any general guidance here',
  ],
};
