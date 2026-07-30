import type { RepairArticle } from '../types';

export const generatorStartsThenStops: RepairArticle = {
  slug: 'generator-starts-then-stops',
  hub: 'generators',
  header: {
    title: 'Generator Starts Then Stops — Diagnosis and Repair',
    equipmentCategory: 'Diesel generating set',
    appliesTo: 'Cummins, Perkins, Caterpillar, Volvo Penta, Deutz, Doosan, FG Wilson, SDMO and other electronically or mechanically governed diesel sets',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Moderate. The timing of the stop is the single most useful clue and narrows the field before any tool is picked up.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-29',
    electricalSystem: '12 V or 24 V DC control; 240 V / 415 V 50 Hz output',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'An engine that fires and then dies is being stopped by one of two things: it is running out of something it needs, or a protection is shutting it down deliberately. Time the stop before touching anything, because the interval separates the causes almost by itself. A stop within two to three seconds of firing usually means the run signal never latched or the fuel path closed again. A stop after ten to sixty seconds usually means fuel starvation — the engine consumes what was in the filter and pipework faster than the supply can replace it. A stop only when load is applied is a load-acceptance problem, not a starting problem. And a stop with an alarm on the controller is not a mystery at all: read the alarm first, because the controller is telling you what it protected against.',

  symptoms: {
    display: [
      'A protective shutdown alarm — oil pressure, coolant temperature, overspeed, underspeed, emergency stop or a generic shutdown',
      'No alarm at all, which is itself diagnostic: an unalarmed stop points at fuel or at the run circuit rather than at protection',
      'Stored fault history showing the same shutdown repeating, which distinguishes a developing fault from a one-off',
    ],
    indicators: [
      'Run indication dropping out at the moment of the stop',
      'Charge or battery indication behaving normally, which rules out little on its own',
      'Alarm lamp latching, requiring a manual reset before the set will crank again',
    ],
    sounds: [
      'Clean firing then a smooth wind-down, typical of the fuel being cut',
      'Rough running, hunting or surging before the stop, which points at fuel starvation or governing',
      'A sudden stop with no wind-down, which suggests something mechanical or a hard protective trip',
    ],
    smells: [
      'Unburnt diesel after the stop, consistent with the engine firing but being starved',
      'Hot or burning smell, which shifts suspicion to cooling or to an electrical fault and warrants immediate investigation',
    ],
    behaviour: [
      'Stops at roughly the same interval every time — a repeatable interval is a strong clue and should be timed',
      'Runs indefinitely off-load but stops as soon as load is applied',
      'Runs longer after the fuel system is bled, then stops sooner again as air re-accumulates',
      'Started and ran normally until a recent service, fuel delivery or controller change',
    ],
    visible: [
      'Water separator contents and filter condition',
      'Fuel level and which tank is actually being drawn from',
      'Coolant level and any external leak',
      'Oil level and condition',
      'Recently disturbed connectors or harness following other work',
    ],
  },

  whatItMeans: {
    plain:
      'The engine proves it can start, so compression, starting and basic fuelling are working. Something then takes that away or deliberately shuts the engine down. The most useful thing you can do before opening anything is time how long it runs and note whether the controller shows an alarm.',
    technical:
      'A start-then-stop event separates cleanly into an involuntary stop and a commanded stop. An involuntary stop means the combustion process lost a necessary input, overwhelmingly fuel delivery: the engine initially runs on fuel already present in the filter housing and high-pressure circuit, so a supply-side restriction or air ingress produces a characteristic run time before the reserve is consumed. A commanded stop means a protective function operated and de-energised the fuel path, which on modern sets is logged. The distinction matters because the two require opposite approaches — one is chased through the fuel system, the other is read from the controller and then traced to the parameter that breached its limit. Load-dependent stops form a third class: the engine is stable at no load but cannot meet the fuelling or air demand of an applied load, and presents as a stop on underspeed, underfrequency or a protective derate rather than as a fuel fault.',
  },

  causes: {
    mostLikely: [
      'Air entering the fuel system on the suction side, so the engine runs on the fuel already in the circuit and then starves',
      'Restricted fuel filters or a blocked water separator limiting supply below demand',
      'Genuine protective shutdown on low oil pressure or high coolant temperature, correctly reported and correctly acted upon',
      'Fuel shutoff or run solenoid dropping out because the run signal never latched',
    ],
    possible: [
      'Lift or transfer pump failing to sustain supply pressure once running demand rises',
      'Low fuel level, or drawing from a tank compartment that empties quickly',
      'Speed sensor signal dropping out once the engine is running, so the controller sees a loss of speed and stops',
      'Overspeed or underspeed trip caused by governing instability rather than a real speed excursion',
    ],
    lessCommon: [
      'Rail pressure collapsing under running demand on common-rail engines',
      'Emergency stop circuit intermittently opening under vibration',
      'Controller configuration change altering a protection threshold or a timer',
      'Charge alternator failure so severe the control supply collapses shortly after the starter disengages',
    ],
    modelSpecific: [
      'Safety-on delay differs between controllers — protections are inhibited for a period after start, so a fault present from the beginning may only trip once that period expires, producing a very repeatable run time',
      'Some controllers require a specific speed or frequency threshold to latch the run condition; failing to reach it produces a stop that looks like a fuel fault',
      'Protection thresholds and shutdown behaviour must be read from the configuration for the controller fitted, not assumed from another installation',
    ],
    environmental: [
      'Fuel waxing in cold conditions restricting flow after a few minutes of running',
      'High ambient temperature driving a coolant temperature shutdown that only appears under load',
      'Dust loading the air filter to the point that the engine cannot sustain running airflow',
    ],
    installation: [
      'Fuel return discharging next to the suction pickup, so the engine progressively draws aerated fuel',
      'Suction lift or line length beyond the pump capability, adequate at start and marginal when running',
      'Radiator discharge recirculating to the intake, producing a temperature shutdown only after several minutes',
      'Undersized control wiring so the run circuit drops out when other loads energise',
    ],
    maintenance: [
      'Filters left beyond their interval',
      'Water separator never drained, so accumulated water is drawn once the level in the bowl is disturbed by running',
      'Cooling system never pressure-tested, so a slow leak becomes a shutdown under load',
      'Protection settings never verified after a controller replacement',
    ],
    componentLevel: [
      'Fuel solenoid coil breaking down when warm, so it holds initially and drops out as it heats',
      'Speed or position sensor with a marginal air gap that works at cranking speed but not at running speed',
      'Oil pressure or coolant temperature sender drifting and reporting a false breach',
      'Controller output stage failing to hold the run relay',
    ],
  },

  safety: {
    isolation: [
      'Place the controller in OFF or STOP and prove the set cannot start automatically before working on it',
      'On automatic mains-failure installations, isolate the start command so a real outage cannot crank the engine while hands are on it',
      'Isolate the battery negative before working on control or fuel-system electrics',
    ],
    lockoutTagout: [
      'Lock off the isolator and tag it with the name of the person working and the date',
      'Prove dead on both sources where a transfer switch is involved',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection whenever the fuel or cooling system is opened',
      'Gloves suitable for fuel and for hot surfaces',
      'Hearing protection if the set will be run with the canopy open',
      'No loose clothing or lanyards near the engine',
    ],
    storedEnergy: [
      'Common-rail systems hold extreme pressure after shutdown — observe the stand-down period before opening any high-pressure union',
      'The cooling system is pressurised and hot after running; never open a hot pressure cap',
      'Batteries remain live and can deliver very high fault current',
    ],
    specificHazards: [
      'This fault requires repeated starting, so the engine will run without warning while you are near it — keep clear of the fan, belts and coupling',
      'A high-pressure fuel leak penetrates skin; never search for one by hand',
      'Repeated cranking overheats the starter — respect the duty cycle and rest periods',
      'Diesel spillage on a hot exhaust is a fire risk',
    ],
    stopAndCallProfessional: [
      'The controller reports a shutdown you cannot interpret with the documentation available',
      'Oil pressure is confirmed low by an independent mechanical gauge',
      'There is coolant in the oil, oil in the coolant, or water in a cylinder',
      'The set is stopping on overspeed — this must be investigated before any further running',
      'The work requires opening the high-pressure fuel circuit',
    ],
  },

  tools: [
    { tool: 'Stopwatch or phone timer', why: 'Timing the run before the stop — the cheapest and most informative instrument for this fault' },
    { tool: 'Service tool or fault-code reader', why: 'Reading the shutdown history and live data through the run and the stop' },
    { tool: 'Digital multimeter, true RMS', why: 'Run circuit, solenoid supply, sender circuits and control voltage stability' },
    { tool: 'Mechanical oil pressure gauge', why: 'Proving or disproving an oil pressure shutdown independently of the sender' },
    { tool: 'Low-pressure fuel gauge', why: 'Supply pressure while running, which is where starvation shows up' },
    { tool: 'Clear hose section', why: 'Making air ingress visible in the suction line rather than inferring it' },
    { tool: 'Infrared thermometer', why: 'Checking real coolant and oil temperature against the reported value' },
    { tool: 'Clamp meter', why: 'Measuring applied load where the stop is load-dependent' },
    { tool: 'Cooling system pressure tester', why: 'Confirming a suspected leak behind a temperature shutdown' },
  ],

  decisionTree: [
    { question: 'Does the controller show an alarm at the moment of the stop?', yes: 'Read and record it. The alarm names the protection that operated — go to that parameter and prove it independently.', no: 'Treat as an involuntary stop and work the fuel path and run circuit' },
    { question: 'Is the run time repeatable to within a second or two?', yes: 'A very repeatable interval suggests a timer or a safety-on delay expiring, or a fixed fuel reserve being consumed', no: 'A variable interval suggests intermittent contact or progressive air ingress' },
    { question: 'Does it stop within two or three seconds of firing?', yes: 'Investigate the run latch and the fuel solenoid holding circuit', no: 'Continue' },
    { question: 'Does it run indefinitely off-load and stop only on load application?', yes: 'This is load acceptance — work fuel supply under demand, air restriction and governing', no: 'Continue' },
    { question: 'Does bleeding the fuel system extend the run time?', yes: 'Air is entering on the suction side. Find the leak; it is often above the fuel level and will not weep when stopped.', no: 'Continue' },
    { question: 'Does an independent gauge confirm the reported oil pressure or temperature?', yes: 'The protection was correct — diagnose the underlying mechanical cause', no: 'Suspect the sender, its wiring or the controller input' },
    { question: 'Is supply pressure maintained at the injection pump inlet while running?', yes: 'Move to speed signal and control circuit', no: 'Work filters, lift pump and suction restriction' },
    { question: 'Is the speed signal stable throughout the run and at the moment of the stop?', yes: 'Investigate the control supply and the run relay', no: 'Diagnose the speed sensor, air gap and trigger wheel' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Time the run and read the controller before touching anything',
      inspect: 'How long the engine runs, and whether an alarm is present at the stop',
      where: 'Controller display and stored fault history',
      instrument: 'Stopwatch and service tool',
      expected: 'A recorded run time and either a named shutdown alarm or a clean log',
      ifAbnormal: 'A named alarm converts this from a search into a targeted investigation. An unalarmed stop points at fuel or the run circuit.',
      next: 'Step 2',
      warning: 'Record the fault history before clearing it. Clearing first destroys the evidence.',
      verify: 'The safety-on delay for the controller fitted — protections are inhibited for a period after start, and a very repeatable run time often corresponds exactly to that period expiring.',
    },
    {
      step: 2,
      title: 'Watch live data through a complete start-to-stop cycle',
      inspect: 'Speed, oil pressure, coolant temperature and battery voltage logged continuously through the run',
      where: 'Service tool connected while the set runs',
      instrument: 'Service tool with live data logging',
      expected: 'All parameters stable and within limits until the moment of the stop',
      ifAbnormal: 'The parameter that moves first is the fault. A value that collapses at the instant of the stop is usually a symptom of the stop rather than its cause — the order matters.',
      next: 'Step 3 for an alarmed stop, Step 5 for an unalarmed stop',
    },
    {
      step: 3,
      title: 'Prove an alarmed shutdown independently before accepting it',
      inspect: 'The parameter the controller says it protected against',
      where: 'At the engine, with an instrument independent of the sender',
      instrument: 'Mechanical oil pressure gauge, or infrared thermometer for temperature',
      expected: 'Independent reading agrees with the controller',
      ifAbnormal: 'Disagreement indicts the sender, its wiring or the controller input. Agreement means the protection was right and the mechanical cause must be found.',
      next: 'If confirmed, diagnose that system. If disproved, Step 4.',
      warning: 'If low oil pressure is independently confirmed, stop. Do not continue running to gather more evidence.',
    },
    {
      step: 4,
      title: 'Test the sender and its circuit where the reading is disproved',
      inspect: 'Sender resistance or output through its range, and the wiring to the controller',
      where: 'At the sender connector and at the controller input',
      instrument: 'Digital multimeter',
      expected: 'Sender within specification and wiring continuous with no short to earth or supply',
      ifAbnormal: 'A drifting sender produces a false shutdown that looks exactly like a real fault. Repair wiring before replacing components.',
      next: 'Step 9',
      verify: 'Sender resistance values and the expected characteristic are engine-specific and must be read from the service data.',
    },
    {
      step: 5,
      title: 'Measure fuel supply pressure while running, not just at rest',
      inspect: 'Supply pressure at the inlet to the injection pump throughout the run',
      where: 'Low-pressure gauge point at the pump inlet',
      instrument: 'Low-pressure fuel gauge',
      expected: 'Pressure within specification and holding steady until the stop',
      ifAbnormal: 'Pressure decaying through the run is the signature of a restriction or a failing lift pump. This is the most common cause of a stop after ten to sixty seconds.',
      next: 'Step 6',
      verify: 'The required supply pressure is engine-specific — read it from the engine data rather than accepting a generic figure.',
    },
    {
      step: 6,
      title: 'Make air ingress visible',
      inspect: 'The suction line while the engine runs',
      where: 'Clear hose section fitted temporarily between tank and filter',
      instrument: 'Clear hose section',
      expected: 'A solid column of fuel with no bubbles for the whole run',
      ifAbnormal: 'Bubbles confirm air ingress. The leak is frequently above the fuel level, so it draws air while running and does not weep when stopped, which is why it is so often missed.',
      next: 'Repair, bleed, re-run and re-time. Then Step 7.',
      warning: 'Bleed by the manufacturer\'s method. Do not crack high-pressure unions on a common-rail engine to bleed it.',
    },
    {
      step: 7,
      title: 'Check the run latch and the fuel solenoid holding circuit',
      inspect: 'Voltage at the fuel shutoff or run solenoid throughout the run, and the run relay',
      where: 'At the solenoid terminals and at the relay',
      instrument: 'Digital multimeter',
      expected: 'Voltage present and stable for the whole run, dropping only when the stop is commanded',
      ifAbnormal: 'Voltage disappearing before the engine dies means the control circuit stopped it. A solenoid that holds cold and drops when warm indicates a breaking-down coil.',
      next: 'Step 8',
      verify: 'Whether the solenoid is a pull-and-hold design, and the expected holding voltage, are model-specific.',
    },
    {
      step: 8,
      title: 'Verify the speed signal remains valid at running speed',
      inspect: 'Speed signal stability through the run and at the instant of the stop',
      where: 'At the sensor and on the controller live data',
      instrument: 'Oscilloscope, or service tool live data',
      expected: 'A clean, consistent signal at running speed with no dropouts',
      ifAbnormal: 'A sensor with a marginal air gap can work at cranking speed and fail at running speed. Loss of speed signal makes the controller stop the engine.',
      next: 'Step 9',
      verify: 'Sensor air gap and resistance are engine-specific.',
    },
    {
      step: 9,
      title: 'Where the stop is load-dependent, characterise it under real load',
      inspect: 'Speed, frequency, supply pressure, boost and exhaust temperature as load is applied in steps',
      where: 'Controller live data with a clamp meter on the output',
      instrument: 'Clamp meter, service tool, load bank if available',
      expected: 'The set accepts load in steps and holds speed and frequency within limits',
      ifAbnormal: 'The step at which it fails identifies the limit. Frequency sagging points at the engine; a protective derate points at the fault causing the derate.',
      next: 'Address the identified limitation',
      warning: 'Disconnect sensitive load before deliberately loading a set that is known to stop under load.',
    },
    {
      step: 10,
      title: 'Confirm the control supply is stable once the alternator takes over',
      inspect: 'Control voltage through start, run and the moment the charge alternator picks up',
      where: 'At the controller supply terminals',
      instrument: 'Digital multimeter, oscilloscope if the drop is brief',
      expected: 'Stable supply within the controller specification throughout',
      ifAbnormal: 'A collapse of control voltage will stop the engine and often logs nothing useful. Charging faults are a common hidden cause of unexplained stops.',
      next: 'Repair the charging or supply fault',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Connections and contamination',
      steps: [
        'Drain the water separator and clean the bowl',
        'Clean and re-terminate corroded control and battery connections',
        'Clean the speed sensor tip of ferrous debris and reset the air gap to specification',
      ],
    },
    {
      level: 'mechanical',
      title: 'Fuel supply',
      steps: [
        'Replace primary and secondary filters and bleed by the manufacturer\'s method',
        'Repair suction-side air ingress — replace perished hose, reseal unions, renew filter seals',
        'Replace a lift pump that cannot sustain supply pressure under running demand',
        'Correct a day-tank return that discharges next to the suction pickup',
      ],
    },
    {
      level: 'sensor-replacement',
      title: 'Senders and sensors',
      steps: [
        'Replace an oil pressure or temperature sender proven wrong by an independent instrument',
        'Replace a speed sensor that drops out at running speed',
        'Replace a fuel solenoid whose coil breaks down when warm',
      ],
    },
    {
      level: 'wiring',
      title: 'Control circuit',
      steps: [
        'Repair intermittent run-circuit wiring and emergency stop loop faults',
        'Correct undersized or high-resistance control wiring causing voltage collapse',
        'Repair the charging circuit where control supply is unstable',
      ],
    },
    {
      level: 'configuration',
      title: 'Controller configuration',
      steps: [
        'Compare protection thresholds and timers against the commissioning record and restore them',
        'Verify the safety-on delay is appropriate rather than masking a real fault',
      ],
      note: 'Record settings before changing them, and never widen a protection threshold to stop a set tripping.',
    },
    {
      level: 'manufacturer-level',
      title: 'Engine mechanical and injection equipment',
      steps: [
        'Refer confirmed low oil pressure for mechanical assessment',
        'Refer rail pressure and injector faults to properly equipped facilities',
        'Investigate overheating as a cooling and installation problem before an engine problem',
      ],
    },
  ],

  validation: [
    'Run the set for a period comfortably longer than the original failure interval, and time it',
    'Bring it to full operating temperature and confirm oil pressure and coolant temperature stabilise within limits',
    'Apply load in steps and confirm it holds speed, frequency and voltage at each step',
    'Confirm supply pressure holds throughout a loaded run rather than only at start',
    'Re-check every fuel joint disturbed, under pressure and at temperature',
    'Confirm no active alarms and record the historic ones before clearing',
    'Repeat after the set has stood and cooled, since a marginal fault often returns only from cold',
    'Record run time, pressures and temperatures so the next engineer has a baseline',
  ],

  whenNotToRepair: [
    'Confirmed low oil pressure on a high-hours engine, where the real decision is a rebuild rather than a sender',
    'Coolant in the oil or oil in the coolant',
    'Repeated injection equipment failure where fuel contamination has not been corrected at the tank',
    'An engine whose parts support has ended and where injection or control components cannot be obtained',
    'Where cumulative repair cost approaches the value of a replacement set correctly sized for the load',
  ],

  prevention: [
    'Change fuel filters on the hours interval and drain the water separator weekly',
    'Run a monthly loaded exercise rather than a no-load run, so faults appear during a test and not during an outage',
    'Pressure-test the cooling system annually',
    'Capacity-test batteries and verify the charging system at every service',
    'Record protection settings at commissioning so drift is detectable',
    'Log run time and key parameters at each test, so a shortening run time is caught as a trend',
  ],

  relatedSlugs: ['controller-alarm-interpretation', 'diesel-fuel-contamination', 'generator-cranks-but-will-not-start', 'generator-excessive-smoke', 'generator-low-oil-pressure-shutdown', 'generator-overheating', 'generator-produces-no-voltage-output', 'generator-unstable-voltage', 'starter-motor-clicks-but-will-not-crank'],

  faq: [
    {
      q: 'It runs for about thirty seconds every time. Does the consistency mean anything?',
      a: 'Yes, and it is one of the most useful clues available. A highly repeatable interval usually means either a fixed quantity of fuel is being consumed before starvation, or a timer has expired — commonly the safety-on delay, after which protections become active and an existing fault finally trips. Time it accurately and check the delay setting.',
    },
    {
      q: 'There is no alarm at all. Does that rule out a protection trip?',
      a: 'Largely, yes, and that is valuable. An unalarmed stop points at fuel starvation or at the run circuit losing its hold. Check the fuel solenoid holding voltage and the control supply before dismantling the fuel system.',
    },
    {
      q: 'It runs fine with no load but stops the moment load is applied. Is that the same fault?',
      a: 'No, it is a different class of problem. The engine is stable at no load but cannot meet the fuelling or air demand of the applied load. Work fuel supply under demand, air restriction, and governing response, and check whether a protective derate is active.',
    },
    {
      q: 'Bleeding it makes it run longer. Is the job finished?',
      a: 'No. Bleeding removed the symptom, not the cause. Air is entering on the suction side and will re-accumulate. The leak is often above the fuel level so it draws air while running without weeping when stopped, which is exactly why it gets missed.',
    },
  ],

  references: [
    'ISO 8528 — reciprocating internal combustion engine driven AC generating sets',
    'ISO 8528-5 — generating sets, performance classes and load-acceptance requirements',
    'SAE J1939 — vehicle network for diesel ECU diagnostics',
    'The engine and controller manufacturer\'s documentation for the specific model, which takes precedence over any general guidance here',
  ],
};
