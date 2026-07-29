import type { RepairArticle } from '../types';

export const starterMotorClicksButWillNotCrank: RepairArticle = {
  slug: 'starter-motor-clicks-but-will-not-crank',
  hub: 'generators',
  header: {
    title: 'Starter Motor Clicks But Will Not Crank — Diagnosis and Repair',
    equipmentCategory: 'Generating set starting system — battery, cabling, solenoid and starter',
    appliesTo: 'Diesel generating sets with electric starting, single- and three-phase, standby and prime',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low. One measurement — voltage drop while cranking — resolves the great majority of these.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Starting system DC per set design; set output 240 V / 415 V 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A click without cranking means the solenoid is receiving enough current to operate but the motor is not receiving enough to turn the engine, so the fault is almost always in the ability to deliver high current, not in the control circuit. Distinguish the sound first: a single solid click is the solenoid pulling in and holding while the motor fails to turn, whereas rapid repeated clicking is the solenoid pulling in, collapsing the supply, dropping out and repeating, which points strongly at battery capacity or a high-resistance connection. The measurement that settles it is voltage drop taken while cranking, not at rest, because a battery and its cabling look perfect until current is drawn. Measure across the battery terminals, then across each joint in turn — battery post to clamp, main cable to starter, and critically the earth return through the engine and chassis, which is the connection most often overlooked and one of the most common causes. Only when the supply is proven able to deliver current under load should the starter or solenoid itself be suspected, and only then is it worth considering a seized or hydraulically locked engine.',

  symptoms: {
    display: [
      'Fail to start alarm after the configured crank attempts',
      'Low battery voltage or charge alternator alarm on the controller',
      'Crank fault or overcrank indication',
    ],
    indicators: [
      'Control panel dimming noticeably at each crank attempt',
      'Battery charger indication absent or in alarm',
      'No crank indication at all despite the click',
    ],
    sounds: [
      'One solid click and nothing further — solenoid engaged, motor not turning',
      'Rapid repeated clicking or chattering — supply collapsing under load',
      'A clunk followed by a grinding noise, which indicates pinion or ring gear engagement problems',
      'Motor spinning freely without engaging, which is a different fault from a click',
    ],
    smells: [
      'Hot cable or burnt insulation smell, indicating a high-resistance joint carrying heavy current',
      'Acid smell at the battery, indicating over-charging or a failing cell',
      'Burnt smell from the starter itself',
    ],
    behaviour: [
      'Cranks normally when a jump start or slave battery is connected, which points squarely at the battery or its cabling',
      'Worse when cold or after standing, which suggests marginal battery capacity',
      'Improves briefly after the terminals are disturbed or cleaned, which indicates a poor connection rather than a cured fault',
      'Was fine until the set stood unused for a period',
      'Fails only on the first attempt of the day and cranks afterwards',
    ],
    visible: [
      'Battery terminal corrosion, and clamps that are loose or have been over-tightened onto damaged posts',
      'Battery age label and electrolyte level where accessible',
      'Main starter cable and earth strap condition, including chafing and corrosion under the insulation',
      'Earth return path — engine to chassis and chassis to battery — often corroded or painted over',
      'Heat discolouration at any high-current joint',
      'Starter mounting security and evidence of oil contamination',
    ],
  },

  whatItMeans: {
    plain:
      'The click is the solenoid working. What is missing is the very large current the motor needs to actually turn the engine. That current is usually being lost in a flat or worn battery, a corroded connection, or a poor earth return — not in the starter itself. Testing while cranking, rather than with everything at rest, is what shows where it is being lost.',
    technical:
      'A starter motor draws a very high current for a short period, and the starting circuit is therefore intolerant of small resistances that are irrelevant elsewhere. The solenoid performs two functions: it engages the pinion with the ring gear, and it closes heavy contacts connecting the battery to the motor. It requires comparatively little current to operate, so it will click reliably from a battery or a circuit that cannot supply the motor at all, which is precisely why a click without cranking indicates a current-delivery problem rather than a control problem. Because power lost in a joint is proportional to its resistance and to the square of the current, a joint of negligible resistance at rest becomes a significant voltage drop at cranking current, which is why measurements taken at rest are misleading and only a drop measured while cranking is diagnostic. The earth return is a frequent culprit and a frequent oversight, since it commonly runs through the engine block, mounting feet and chassis, any of which may be corroded, painted or relying on a degraded strap. Battery condition must be assessed by its ability to deliver current rather than by terminal voltage, because an aged battery holds a plausible resting voltage and collapses immediately under load. Only when the supply is proven can internal starter faults — worn brushes, a failed solenoid contact set, or a faulty pinion drive — be reasonably suspected, and mechanical causes such as a seized or hydraulically locked engine considered.',
  },

  causes: {
    mostLikely: [
      'Battery discharged or at end of life, unable to deliver cranking current',
      'Corroded, loose or damaged battery terminal connections',
      'Poor earth return — engine to chassis or chassis to battery',
      'High-resistance or corroded main starter cable',
    ],
    possible: [
      'Battery not being charged between runs, so it is always partly discharged',
      'Solenoid contacts burnt or pitted',
      'Starter motor brushes worn',
      'Undersized or damaged starting cables',
    ],
    lessCommon: [
      'Starter motor internal fault — open winding or shorted armature',
      'Pinion or ring gear damage preventing engagement',
      'Engine seized, or hydraulically locked by coolant or fuel in a cylinder',
      'Controller crank output fault, though this normally prevents the click entirely',
    ],
    modelSpecific: [
      'Starting system voltage differs between sets; confirm before connecting any slave supply',
      'Some sets use two batteries in series and others in parallel — an incorrect assumption here can damage equipment',
      'Cable sizes and torque values for starting connections are specified by the manufacturer',
      'Crank attempt count and rest interval are configurable on most controllers',
    ],
    environmental: [
      'Cold conditions reducing battery capacity and thickening oil',
      'High ambient temperature shortening battery life',
      'Dust, humidity and coastal salt air accelerating terminal corrosion',
      'Sets standing unused for long periods between runs',
    ],
    installation: [
      'Starting cables undersized or excessively long',
      'Earth return relying on a painted or corroded mounting rather than a dedicated strap',
      'Battery mounted where it is exposed to engine heat',
      'No battery charger fitted on a standby set that runs rarely',
    ],
    maintenance: [
      'Battery capacity never tested, only voltage checked',
      'Terminals never cleaned or re-torqued',
      'Battery charger operation never verified',
      'Set never exercised under load, so the battery is never properly recharged',
      'Installation dates never recorded, so battery age is unknown',
    ],
    componentLevel: [
      'Battery cells failed',
      'Solenoid contact set burnt',
      'Starter brushes worn or springs weak',
      'Armature or field winding fault',
      'Earth strap corroded internally beneath intact insulation',
    ],
  },

  safety: {
    isolation: [
      'The engine can start without warning during this work. Prevent starting before working near the engine.',
      'Lock the control selector in stop and disconnect the starting battery when working on the starter or its cabling',
      'Isolate the set output breaker before working around the set',
      'Confirm any automatic changeover cannot call the set to start',
    ],
    lockoutTagout: [
      'Lock the control in stop or off, and tag it',
      'Disconnect and tag the battery negative first, and reconnect it last',
      'Tag the changeover control so auto operation is not restored during the work',
    ],
    ppe: [
      'Eye protection at all times near batteries',
      'Acid-resistant gloves for battery work',
      'Insulated tools — a spanner across a battery terminal and chassis will weld',
      'Remove watches, rings and metal bracelets before starting battery work',
    ],
    storedEnergy: [
      'The starting battery is live at all times and cannot be switched off',
      'It can deliver extremely high fault current — far more than the starter draws',
      'Hot exhaust and turbocharger surfaces remain dangerous long after a run',
    ],
    specificHazards: [
      'Lead-acid batteries vent hydrogen. Never create a spark near a battery — ventilate first, and make the final connection away from the battery when using a slave supply.',
      'A dropped tool across a battery terminal will weld instantly and can cause the battery to rupture. Insulated tools are not optional.',
      'Rotating parts: the engine may turn during a crank test. Keep hands, tools and clothing clear of belts, fan and coupling.',
      'Never bridge or bypass the solenoid to force cranking unless you fully understand the consequence — the engine can start with the pinion engaged and the set unattended.',
      'Battery acid causes serious burns; know where the eyewash is before starting',
    ],
    stopAndCallProfessional: [
      'The engine is suspected seized or hydraulically locked — do not keep attempting to crank it',
      'Any battery is swollen, hot, leaking or damaged',
      'There is a burnt smell from cabling or the starter under load',
      'Ring gear or pinion damage is suspected',
      'The correct starting-system voltage or battery configuration cannot be established',
    ],
  },

  tools: [
    { tool: 'True-RMS digital multimeter', why: 'Voltage drop measured WHILE cranking — the single measurement that resolves most of these' },
    { tool: 'DC clamp meter capable of high current', why: 'Confirming whether the starter is drawing current at all, and how much' },
    { tool: 'Battery load tester or impedance analyser', why: 'Assessing the battery by its ability to deliver current; resting voltage will mislead you' },
    { tool: 'Infrared thermometer or thermal camera', why: 'A high-resistance joint gets hot under cranking current and can be found immediately after an attempt' },
    { tool: 'Insulated torque wrench and spanners', why: 'Starting connections are torque-specified, and all work is on a live battery circuit' },
    { tool: 'Wire brush and terminal cleaning tools', why: 'Corrosion removal at posts, clamps and earth points' },
    { tool: 'Hydrometer or refractometer for flooded batteries', why: 'Assessing individual cells where the battery type allows' },
  ],

  decisionTree: [
    { question: 'Is any battery swollen, hot, leaking or damaged?', yes: 'Stop. Isolate the area and escalate.', no: 'Continue' },
    { question: 'Is it a single solid click, or rapid repeated clicking?', yes: 'Rapid clicking points strongly at battery capacity or a high-resistance joint', no: 'A single solid click means the solenoid held — continue' },
    { question: 'Does it crank normally from a slave battery or jump start?', yes: 'The fault is the battery or its connections, not the starter', no: 'Continue — the fault is downstream of the supply' },
    { question: 'Measured WHILE cranking, does battery voltage hold up?', yes: 'Continue', no: 'The battery cannot deliver cranking current — test capacity, not voltage' },
    { question: 'Is the voltage drop across each joint negligible while cranking?', yes: 'Continue', no: 'That joint is the fault. Check the earth return especially — it is the most commonly missed.' },
    { question: 'Is the starter drawing heavy current but not turning?', yes: 'Suspect the starter internally, or a mechanically seized engine', no: 'Suspect solenoid contacts or an open circuit in the motor' },
    { question: 'Can the engine be turned over by hand or by barring, where the manufacturer permits it?', yes: 'The engine is free — the fault is electrical', no: 'Stop. Do not keep cranking a seized or hydraulically locked engine.' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Listen, and inspect before measuring',
      inspect: 'The character of the click, and the visible condition of battery, terminals, cables and earth straps',
      where: 'At the battery, starter and earth points',
      instrument: 'Inspection light',
      expected: 'Clean, tight, undamaged connections',
      ifAbnormal: 'Rapid clicking indicates supply collapse. Corrosion under intact insulation is common and invisible until the cable is flexed or the strap removed.',
      next: 'Step 2',
      warning: 'Prevent the set from starting before working near the engine.',
    },
    {
      step: 2,
      title: 'Measure battery voltage at rest, then discard it as evidence',
      inspect: 'Resting terminal voltage, recorded for reference only',
      where: 'Battery terminals',
      instrument: 'True-RMS multimeter',
      expected: 'A plausible resting voltage, which proves very little',
      ifAbnormal: 'A low resting voltage confirms discharge, but a normal one proves nothing at all. This is why the next step matters more than this one.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure battery voltage WHILE cranking',
      inspect: 'How far terminal voltage falls during a crank attempt',
      where: 'Directly at the battery posts, not the clamps',
      instrument: 'True-RMS multimeter, with a second person cranking',
      expected: 'Voltage sags and holds at a usable level',
      ifAbnormal: 'A severe collapse means the battery cannot deliver cranking current, regardless of what it read at rest. This is the measurement that resolves most of these jobs.',
      next: 'Step 4',
      verify: 'The acceptable minimum cranking voltage for this starting system from the manufacturer data — do not apply a general figure across different systems.',
    },
    {
      step: 4,
      title: 'Measure voltage drop across every joint while cranking',
      inspect: 'Drop from post to clamp, clamp to cable, cable to starter, and the full earth return',
      where: 'Across each connection in turn, during a crank attempt',
      instrument: 'True-RMS multimeter',
      expected: 'Negligible drop across every joint',
      ifAbnormal: 'Any joint showing meaningful drop under cranking current is the fault. Test the earth return specifically — engine to chassis and chassis to battery, because it is the most frequently overlooked and among the most common causes.',
      next: 'Step 5',
      warning: 'Keep leads and hands clear of belts, fan and coupling while the engine is being cranked.',
    },
    {
      step: 5,
      title: 'Thermal-check the circuit immediately after an attempt',
      inspect: 'Temperature of terminals, cables and straps directly after cranking',
      where: 'Along the whole starting circuit',
      instrument: 'Infrared thermometer or thermal camera',
      expected: 'All joints cool',
      ifAbnormal: 'A joint that is warm after a few seconds of cranking is dissipating power that should have reached the starter. This finds faults that voltage measurement can miss on an intermittent connection.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Confirm the battery by capacity, not by voltage',
      inspect: 'Battery condition under load, and installation date',
      where: 'At the battery',
      instrument: 'Battery load tester or impedance analyser',
      expected: 'Battery capable of delivering cranking current',
      ifAbnormal: 'An aged battery presents normal terminal voltage and collapses under load. Where the set runs rarely, also establish whether the battery is actually being charged between runs.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Measure starter current draw',
      inspect: 'Whether the starter draws current, and roughly how much, during an attempt',
      where: 'On the main starter cable',
      instrument: 'High-current DC clamp meter',
      expected: 'Substantial current drawn with the engine turning',
      ifAbnormal: 'Heavy current with no rotation suggests an internal starter fault or a mechanically obstructed engine. Little or no current with a solid click suggests burnt solenoid contacts or an open motor circuit.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Establish that the engine is free before condemning the starter',
      inspect: 'Whether the engine can be turned by the manufacturer\'s permitted method',
      where: 'At the engine',
      instrument: 'As specified by the engine manufacturer',
      expected: 'Engine turns freely',
      ifAbnormal: 'An engine that will not turn may be seized or hydraulically locked by coolant or fuel in a cylinder. Continuing to crank it can bend a connecting rod. Stop and escalate.',
      next: 'Refer mechanical obstruction for engine assessment; otherwise proceed to starter overhaul or replacement',
      warning: 'Never keep cranking an engine that will not turn. The damage from hydraulic lock is done in the attempt.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'The starting circuit — do this first',
      steps: [
        'Clean battery posts and clamps properly and re-torque to specification',
        'Clean and remake every earth connection, taking paint and corrosion back to bare metal',
        'Replace earth straps that are corroded internally, even where the insulation looks intact',
        'Replace corroded or undersized main starter cables',
        'Protect remade connections against corrosion after assembly',
      ],
      note: 'This resolves the majority of these callouts without replacing a single major component.',
    },
    {
      level: 'component-replacement',
      title: 'Battery and starter components',
      steps: [
        'Replace a battery that fails a capacity test, and record the installation date on it',
        'Replace burnt solenoid contact sets where the design permits, or the solenoid complete',
        'Replace worn brushes where the starter is designed to be serviced',
        'Replace the starter where internal winding faults are found',
      ],
    },
    {
      level: 'mechanical',
      title: 'Engagement and mounting',
      steps: [
        'Inspect the pinion and ring gear for damaged teeth and correct engagement',
        'Correct starter mounting alignment and security',
        'Replace a damaged ring gear rather than accepting intermittent engagement',
      ],
    },
    {
      level: 'configuration',
      title: 'Charging regime',
      steps: [
        'Verify the battery charger operates and holds the battery between runs',
        'Confirm the set exercise regime is long enough to genuinely recharge what starting consumed',
      ],
      note: 'A standby set that runs briefly on test may never replace the charge that starting used, so the charger is the real source and must be working.',
    },
    {
      level: 'manufacturer-level',
      title: 'Engine faults',
      steps: [
        'Refer suspected seizure or hydraulic lock for engine assessment before any further cranking',
        'Provide the measured cranking voltages, drops and current draw',
      ],
    },
  ],

  validation: [
    'Confirm the set cranks briskly and starts from cold',
    'Measure and record battery voltage while cranking after the repair',
    'Measure and record voltage drop across each joint while cranking',
    'Thermal-check the starting circuit immediately after a start',
    'Confirm the battery charger is holding the battery between runs',
    'Repeat a start after the set has stood, since a marginal fault reappears on a cold first attempt',
    'Record battery installation date, capacity test result and all measurements',
  ],

  whenNotToRepair: [
    'Starters with damaged armatures or field windings where exchange is more economical than repair',
    'Batteries at end of life — replacement is the fix',
    'Ring gear damage extending around a significant arc, which requires flywheel work rather than repeated pinion replacement',
    'Engines suspected of seizure or internal damage, which need assessment rather than a starting-system repair',
    'Obsolete sets where starters and solenoids are unobtainable',
  ],

  prevention: [
    'Test battery capacity annually rather than checking voltage only',
    'Record battery installation dates and plan replacement at end of design life',
    'Clean and re-torque battery and earth connections at every service',
    'Verify the battery charger is working at every visit — on a standby set it, not the engine, is the real charging source',
    'Exercise standby sets under load for long enough to genuinely recharge the battery',
    'Protect terminals and earth points against corrosion, particularly in coastal and dusty environments',
    'Record cranking voltage at each service so gradual deterioration is visible before a failure to start',
  ],

  relatedSlugs: ['generator-battery-not-charging', 'generator-cranks-but-will-not-start', 'generator-starts-then-stops'],

  faq: [
    {
      q: 'The battery reads correctly. How can it be the battery?',
      a: 'Because voltage at rest and the ability to deliver hundreds of amps are different properties. An aged battery holds a perfectly normal terminal voltage and collapses the instant the starter is engaged. Measure while cranking, and test capacity rather than voltage — that distinction resolves most of these faults in minutes.',
    },
    {
      q: 'What is the difference between one click and rapid clicking?',
      a: 'A single solid click means the solenoid pulled in and held, but the motor did not turn, so current is reaching the solenoid but not adequately reaching the motor. Rapid clicking means the solenoid pulls in, the supply collapses under the load, it drops out, and the cycle repeats. Rapid clicking points hard at battery capacity or a high-resistance connection.',
    },
    {
      q: 'It cranks fine from a jump start, so should I just replace the battery?',
      a: 'Test first. Cranking well from a slave supply proves the fault is in the battery or its connections, but a corroded earth return or a poor main cable produces exactly the same behaviour and replacing the battery will not fix it. Measure voltage drop across each joint while cranking before buying anything.',
    },
    {
      q: 'Our standby set keeps flattening its battery. Why?',
      a: 'Usually because nothing is recharging it. A set that runs briefly on test consumes far more in starting than a short run replaces, so the battery charger — not the engine — is the real charging source. Verify the charger is actually working, and make the exercise run long enough to be useful.',
    },
  ],

  references: [
    'ISO 8528 — reciprocating internal combustion engine driven alternating current generating sets',
    'EN 50272-2 — safety requirements for secondary batteries and battery installations',
    'The engine and set manufacturer\'s service data for the specific machine, which is the only valid source for starting-system voltage, cable sizes, connection torque values and acceptable cranking voltage referred to throughout',
  ],
};
