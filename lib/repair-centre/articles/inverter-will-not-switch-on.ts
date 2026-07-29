import type { RepairArticle } from '../types';

export const inverterWillNotSwitchOn: RepairArticle = {
  slug: 'inverter-will-not-switch-on',
  hub: 'inverters',
  header: {
    title: 'Inverter Will Not Switch On — Diagnosis and Repair',
    equipmentCategory: 'Off-grid, hybrid and grid-tied inverters — DC input and auxiliary supply',
    appliesTo: 'Off-grid, hybrid, grid-tied and inverter-charger units, low- and high-frequency, single- and three-phase',
    difficulty: 'advanced',
    diagnosisComplexity: 'Low to moderate. Most units that appear dead are not faulty inside — they are not receiving usable DC.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Battery DC input per system design; AC output 240 V 50 Hz nominal',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Separate "no display" from "no output" before anything else, because they are different faults. A unit with a dead display is usually not receiving usable DC, and the great majority of these are resolved outside the inverter: an open DC fuse or breaker, a corroded or loose battery terminal, or a battery that has fallen below the unit\'s low-voltage lockout and will not allow a start. Measure DC at the inverter terminals rather than at the battery, because a high-resistance joint or an undersized cable shows correct voltage at the battery and collapses at the inverter the instant load is applied. If DC is present, correct and steady at the terminals and the unit is still completely dead, the fault has moved inside — normally the auxiliary supply that powers the control electronics, or the pre-charge circuit that must bring the DC bus up before the main contactor closes.',

  symptoms: {
    display: [
      'No display, no backlight and no indicators at all',
      'Display flickers briefly on connection then dies',
      'Low battery or under-voltage indication before shutdown',
      'Display alive but no output and no ability to start',
    ],
    indicators: [
      'No LED activity of any kind',
      'Power LED on but no output',
      'Fault LED latched on with no display text',
    ],
    sounds: [
      'No relay click and no fan movement on power-up, which suggests the control supply never came alive',
      'A single click then silence, which suggests the unit tried to start and dropped out',
      'Repeated clicking, which usually indicates the DC supply collapsing under the inrush of starting',
      'A loud crack or bang at connection, which means stop immediately and inspect',
    ],
    smells: [
      'Burnt or acrid smell from the enclosure — do not attempt to power it up again',
      'Fishy or hot-plastic smell, often associated with failed capacitors or overheated windings',
    ],
    behaviour: [
      'Dead after a power event, lightning or a nearby surge',
      'Dead after the batteries were allowed to discharge deeply',
      'Dead after reverse-polarity connection, which usually causes immediate and severe damage',
      'Works when connected directly to a charged battery but not in the installation, which points at cabling or protection',
      'Starts and immediately shuts down, which is a different fault from being dead — see the guide on switching off under load',
    ],
    visible: [
      'DC fuse and DC breaker condition',
      'Battery terminal corrosion, tightness and cable condition',
      'Any discolouration, bulging or damage visible through the ventilation slots',
      'Evidence of water ingress, dust build-up or insect nesting inside the enclosure',
      'Scorch marks around the DC input terminals',
    ],
  },

  whatItMeans: {
    plain:
      'The inverter is not turning on at all. Usually that means it is not getting the battery power it needs — a blown fuse, a loose or corroded connection, or batteries that are too flat for it to start. Less often, something inside has failed. The checks below establish which, in order, without taking anything apart unnecessarily.',
    technical:
      'An inverter derives its control electronics supply from the DC input, normally through a small auxiliary switched-mode supply that must come up before anything else can operate. If DC is absent, too low, or collapses under the initial demand, that auxiliary supply never establishes and the unit presents as completely dead. Most units also implement a low-voltage lockout that refuses to start below a configured threshold, which is protective rather than faulty and is frequently mistaken for failure after a deep discharge. On units with a substantial DC bus capacitance there is also a pre-charge arrangement — typically a resistor bypassed by a contactor or relay once the bus has risen, which limits inrush at connection. A failed pre-charge element causes either a dead unit or a heavy arc and blown fuse at every connection attempt. Because state of charge and terminal voltage are related but not equivalent, and because voltage measured at rest says little about a battery\'s ability to deliver current, a battery can read plausibly at the terminals and still be incapable of starting the unit.',
  },

  causes: {
    mostLikely: [
      'DC fuse open or DC breaker tripped',
      'Battery voltage below the unit\'s low-voltage lockout after a deep discharge',
      'Loose, corroded or high-resistance battery terminal connection',
      'Battery at end of life — holds a resting voltage but collapses under the starting demand',
    ],
    possible: [
      'Undersized or excessively long DC cabling causing voltage collapse at start',
      'Isolator or battery-disconnect switch open or faulty',
      'BMS on a lithium battery inhibiting discharge and cutting the supply',
      'Remote on/off input, control link or enable jumper missing or open',
    ],
    lessCommon: [
      'Auxiliary supply stage inside the unit failed',
      'Pre-charge resistor or its bypass contactor failed',
      'Reverse-polarity damage from an earlier connection error',
      'Surge or lightning damage to the input stage',
      'Control board failure',
    ],
    modelSpecific: [
      'Low-voltage lockout and restart thresholds are configurable on many units and differ between models — read them from the equipment rather than assuming',
      'Some units will not start from a battery below the lockout even with correct AC input present, and require the battery to be charged externally first',
      'Lithium installations start under BMS control, and the BMS may inhibit for reasons the inverter reports only as absent DC',
      'Some models require a remote enable link fitted before they will start at all',
    ],
    environmental: [
      'Water ingress, condensation or high humidity causing tracking or corrosion',
      'Dust accumulation inside the enclosure',
      'Insect or rodent nesting, which is a common cause of sudden failure in rural installations',
      'Lightning exposure on long DC or AC runs',
    ],
    installation: [
      'DC cabling sized on steady-state current alone without regard to inrush and voltage drop',
      'Protective device rated incorrectly for the unit',
      'Battery bank undersized for the inverter, so it cannot sustain the starting demand',
      'Poor terminations — the single most common installation defect on DC systems',
    ],
    maintenance: [
      'Battery terminals never inspected or re-torqued',
      'Battery capacity never tested, so end of life arrives as a surprise',
      'Enclosure never opened for cleaning in a dusty environment',
    ],
    componentLevel: [
      'Auxiliary switched-mode supply failed',
      'DC input fuse internal to the unit open',
      'Pre-charge resistor open circuit',
      'Input stage damaged by reverse polarity or surge',
    ],
  },

  safety: {
    isolation: [
      'A battery bank cannot be switched off. It is live whenever connected and can deliver very high fault current.',
      'Open the DC isolator and remove the DC fuse before working on the unit, then prove dead at the point of work',
      'Isolate the AC input and output as well — an inverter-charger has more than one live source',
      'Confirm the DC bus has discharged before opening the enclosure',
    ],
    lockoutTagout: [
      'Lock and tag the DC isolator, the AC input and any generator or solar source feeding the unit',
      'On solar-connected units the array is live in daylight and cannot be switched off at source — isolate at the array switch and treat the DC as live regardless',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Eye protection at all times near batteries and DC connections',
      'Insulated tools rated for the DC system voltage',
      'Acid-resistant gloves for lead-acid battery work',
      'Remove watches, rings and metal bracelets before any DC work',
    ],
    storedEnergy: [
      'DC bus capacitors retain a dangerous charge after disconnection — observe the manufacturer\'s discharge period and verify with a meter rather than trusting a time',
      'The battery bank remains live at all times',
      'A solar array remains live in any daylight',
    ],
    specificHazards: [
      'A dropped tool across battery terminals will weld instantly and can rupture the battery. Insulated tools are not optional here.',
      'DC arcs do not self-extinguish the way AC arcs do, which makes a DC short far more dangerous than the voltage suggests',
      'Never reconnect a unit that has a burnt smell or visible internal damage — repeat energising turns a repairable board into scrap and can start a fire',
      'Reverse polarity on connection typically causes instantaneous, severe damage; verify polarity before every connection',
    ],
    stopAndCallProfessional: [
      'There is a burnt smell, visible internal damage or evidence of arcing',
      'The unit was connected in reverse polarity',
      'Work requires opening the enclosure and you cannot verify the DC bus has discharged',
      'The installation involves a lithium battery whose BMS behaviour you cannot interrogate',
      'The DC system voltage or fault energy is beyond your competence to work on safely',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter rated for the DC system voltage', why: 'DC at the inverter terminals — the measurement that decides whether the fault is inside the unit at all' },
    { tool: 'DC clamp meter', why: 'Whether current flows on a start attempt, which distinguishes an open circuit from a collapsing supply' },
    { tool: 'Battery load tester or impedance analyser', why: 'A battery that reads correctly at rest can still be unable to start the unit; resting voltage alone will mislead you' },
    { tool: 'Insulated torque wrench and spanners', why: 'DC terminations must be torqued to specification; a loose joint is the most common cause here' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Locating a high-resistance joint, which shows as heat before it fails completely' },
    { tool: 'Inspection light and mirror', why: 'Internal inspection through ventilation openings before any decision to open the unit' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell, visible damage or evidence of arcing?', yes: 'Stop. Do not re-energise. Escalate for workshop inspection.', no: 'Continue' },
    { question: 'Was the unit ever connected in reverse polarity?', yes: 'Assume internal damage and refer for inspection rather than repeated start attempts', no: 'Continue' },
    { question: 'Is the DC fuse intact and the DC breaker closed?', yes: 'Continue', no: 'That explains it. Establish WHY it opened before replacing or resetting it.' },
    { question: 'Is DC voltage present at the INVERTER terminals, not just at the battery?', yes: 'Continue', no: 'The fault is in the DC path — isolator, cabling, terminations or BMS — not inside the inverter' },
    { question: 'Is that voltage above the unit\'s configured low-voltage lockout?', yes: 'Continue', no: 'The unit is refusing to start protectively. Charge the battery externally and re-test.' },
    { question: 'Does the terminal voltage hold steady on a start attempt?', yes: 'Continue', no: 'Voltage collapsing under demand means battery capacity, cabling or terminations — not the inverter' },
    { question: 'Is any remote enable link, control input or BMS permission present and healthy?', yes: 'Continue', no: 'Restore the enable path; many units are simply being told not to start' },
    { question: 'With good DC proven at the terminals, is the unit still completely dead?', yes: 'The fault is now genuinely internal — auxiliary supply or pre-charge. Refer for workshop diagnosis.', no: 'Fault resolved externally; complete validation and record the cause' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Inspect before energising anything',
      inspect: 'Enclosure, ventilation openings, DC terminals and cabling for damage, heat, corrosion or ingress',
      where: 'Externally, and internally through the ventilation openings',
      instrument: 'Inspection light',
      expected: 'No discolouration, no burnt smell, terminals clean and tight',
      ifAbnormal: 'Any burnt smell or visible damage ends the field diagnosis. Repeated attempts to power up a damaged board destroy components that were still serviceable.',
      next: 'Step 2',
      warning: 'Do not attempt repeated power-ups to "see if it works". That is how a repairable fault becomes an unrepairable one.',
    },
    {
      step: 2,
      title: 'Check the DC protective devices',
      inspect: 'DC fuse continuity and DC breaker position, including any fuse internal to the unit',
      where: 'DC isolator, fuse holder and battery disconnect',
      instrument: 'Multimeter on continuity, with the circuit isolated',
      expected: 'Fuse intact, breaker closed',
      ifAbnormal: 'An open device fully explains a dead unit. Establish the cause — a fuse that blew for a reason will blow again, and repeatedly replacing it can mask a short.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure DC at the inverter terminals',
      inspect: 'DC voltage measured at the inverter\'s own input terminals',
      where: 'Inverter DC input terminals — not the battery, not a nearby busbar',
      instrument: 'True-RMS multimeter',
      expected: 'System DC voltage present and stable',
      ifAbnormal: 'No voltage here with voltage at the battery isolates the fault to the DC path: isolator, cabling, terminations or a BMS that has opened.',
      next: 'Step 4',
      warning: 'Measuring at the battery instead of the inverter is the classic error. A high-resistance joint reads perfectly until current is drawn.',
    },
    {
      step: 4,
      title: 'Compare against the low-voltage lockout',
      inspect: 'Measured DC against the unit\'s configured lockout and restart thresholds',
      where: 'Inverter terminals, and the unit\'s configuration where accessible',
      instrument: 'Multimeter and the unit\'s documentation',
      expected: 'Terminal voltage comfortably above the configured lockout',
      ifAbnormal: 'A unit refusing to start below lockout is behaving correctly. Charge the battery from another source and re-test before suspecting the inverter.',
      next: 'Step 5',
      verify: 'The lockout and restart thresholds for this specific model and its configured battery type — these are configurable and must be read from the equipment, never assumed.',
    },
    {
      step: 5,
      title: 'Watch the terminal voltage during a start attempt',
      inspect: 'Whether DC at the terminals holds up or collapses when the unit tries to start',
      where: 'Inverter DC terminals, while attempting to start',
      instrument: 'Multimeter, ideally with a DC clamp on the cable simultaneously',
      expected: 'Voltage sags slightly and recovers',
      ifAbnormal: 'A sharp collapse indicates the battery cannot deliver the demand, or the cabling and terminations are dropping it. This is the single most informative measurement in the whole procedure.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Assess the battery properly',
      inspect: 'Battery condition under load rather than at rest',
      where: 'At the battery bank',
      instrument: 'Battery load tester or impedance analyser',
      expected: 'Battery capable of supporting the starting demand',
      ifAbnormal: 'Resting voltage is a poor indicator. An aged battery presents a normal terminal voltage and collapses immediately under real current.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Check terminations and cabling under load',
      inspect: 'Voltage drop along the DC path and temperature at every joint',
      where: 'Battery terminals, isolator, fuse holder, inverter terminals',
      instrument: 'Multimeter and thermal camera or infrared thermometer',
      expected: 'Minimal drop across joints, all connections cool',
      ifAbnormal: 'Heat at a joint under load identifies a high-resistance connection. Re-torque to specification rather than tightening by feel.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Confirm the enable path and BMS permission',
      inspect: 'Remote on/off input, enable link, and any BMS discharge permission',
      where: 'Control terminals and the battery BMS interface',
      instrument: 'Multimeter, BMS interface where available',
      expected: 'Enable path complete and the BMS permitting discharge',
      ifAbnormal: 'A missing enable link or an inhibiting BMS produces a unit that is entirely healthy and simply will not start. Check this before opening anything.',
      next: 'Step 9',
    },
    {
      step: 9,
      title: 'Only now conclude the fault is internal',
      inspect: 'Whether the unit remains dead with proven-good DC at its terminals and a complete enable path',
      where: 'At the unit',
      instrument: 'Observation, with all external causes eliminated',
      expected: 'External causes eliminated before the enclosure is opened',
      ifAbnormal: 'A unit that is still dead with good DC and a valid enable is an internal fault — commonly the auxiliary supply or pre-charge circuit. Refer for workshop diagnosis rather than opening it in the field.',
      next: 'Refer for workshop inspection with your measurements recorded',
      warning: 'DC bus capacitors hold a dangerous charge. Do not open the enclosure without verifying discharge with a meter.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'DC path integrity',
      steps: [
        'Clean corroded terminals and re-torque every DC joint to the specified value',
        'Replace damaged, undersized or overheated DC cabling',
        'Replace corroded fuse holders and isolators rather than cleaning them repeatedly',
      ],
      note: 'This resolves a large share of dead-inverter callouts and requires no work inside the unit.',
    },
    {
      level: 'component-replacement',
      title: 'Batteries and protection',
      steps: [
        'Replace a battery bank that cannot support the starting demand, as a complete matched set',
        'Replace failed fuses with the correct type and rating only, after establishing why the original opened',
        'Replace a faulty DC isolator or battery disconnect',
      ],
    },
    {
      level: 'configuration',
      title: 'Settings and enable path',
      steps: [
        'Confirm the battery type and voltage thresholds match the bank actually installed',
        'Restore any missing remote enable link',
        'Where a lithium BMS communicates with the inverter, confirm the protocol setting matches the battery',
      ],
    },
    {
      level: 'board-level',
      title: 'Internal supply stages',
      steps: [
        'Auxiliary supply and pre-charge faults are workshop work, on a discharged and proven-dead bus',
        'Do not substitute components of a different rating to "get it going"',
      ],
      note: 'Board-level work belongs in a workshop with a current-limited supply, not on site.',
    },
    {
      level: 'manufacturer-level',
      title: 'Beyond board repair',
      steps: [
        'Refer surge, lightning and reverse-polarity damage for full assessment — damage is rarely confined to one component',
        'Provide the measured DC values and the event history, which shortens the repair considerably',
      ],
    },
  ],

  validation: [
    'Confirm the unit starts and holds a stable output with no alarm',
    'Measure DC at the inverter terminals under load and confirm it holds up',
    'Thermally survey every DC joint under load after the work',
    'Confirm the battery recharges and holds afterwards',
    'Test under a representative load rather than no load — many faults only appear under demand',
    'Record the measured DC voltages, torque values and the cause identified, in the maintenance record',
  ],

  whenNotToRepair: [
    'Carbonised or tracked PCB substrate, where the board material itself has been damaged',
    'Reverse-polarity or lightning damage extending across multiple stages',
    'Repeated power-stage failure after a previous repair, which indicates an unresolved root cause',
    'Obsolete units where control boards and firmware are unobtainable',
    'Where the repair cost approaches the replacement value of the unit',
  ],

  prevention: [
    'Torque DC terminations to specification and re-check them at every service visit',
    'Size DC cabling for voltage drop and inrush, not steady-state current alone',
    'Fit and maintain appropriate surge protection, particularly on long DC and AC runs',
    'Test battery capacity annually rather than relying on terminal voltage',
    'Keep the enclosure sealed and clean; insect and rodent ingress is a leading cause of sudden failure in rural installations',
    'Avoid deep discharges, which shorten battery life and lead directly to lockout events',
    'Verify polarity before every connection, without exception',
  ],

  relatedSlugs: ['inverter-mosfet-failure-diagnosis', 'inverter-not-charging-batteries', 'inverter-switches-off-under-load', 'motherboard-power-rail-diagnosis', 'solar-inverter-dc-bus-fault'],

  faq: [
    {
      q: 'The batteries show the right voltage. Why won\'t the inverter start?',
      a: 'Voltage at rest and the ability to deliver current are different things. An aged battery holds a normal terminal reading and collapses the moment the inverter draws its starting current, so the unit never establishes its control supply. Watch the terminal voltage during a start attempt — that measurement settles it in seconds.',
    },
    {
      q: 'Is a dead display the same as no output?',
      a: 'No, and treating them as the same wastes time. No display usually means the unit has no usable DC and its control electronics never came alive. A live display with no output means the unit is running and has either shut down protectively or failed in the output stage — a different diagnosis entirely.',
    },
    {
      q: 'The inverter was connected backwards for a moment. Is it damaged?',
      a: 'Assume so. Reverse polarity typically causes immediate and severe damage, and it is rarely confined to one component. Do not keep attempting to start it — refer it for inspection, because repeated energising turns partially damaged boards into scrap.',
    },
    {
      q: 'It works on a bench battery but not in the installation. What does that tell me?',
      a: 'That the inverter is healthy and the installation is not. The fault is in the DC path — an open protective device, a high-resistance joint, undersized cable, a faulty isolator, or a BMS that is inhibiting discharge. That is good news, and it means the enclosure should stay closed.',
    },
  ],

  references: [
    'IEC 62109-1 and IEC 62109-2 — safety of power converters for use in photovoltaic power systems',
    'IEC 62477-1 — safety requirements for power electronic converter systems',
    'IEC 60364 — low-voltage electrical installations, including conductor sizing and protection',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The inverter and battery manufacturer\'s documentation for the specific units, which gives the low-voltage lockout thresholds, torque figures and protection ratings referred to throughout',
  ],
};
