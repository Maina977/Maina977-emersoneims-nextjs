import type { RepairArticle } from '../types';

export const upsWillNotPowerOn: RepairArticle = {
  slug: 'ups-will-not-power-on',
  hub: 'ups',
  header: {
    title: 'UPS Will Not Power On — Dead Front Panel Diagnosis',
    equipmentCategory: 'UPS system',
    appliesTo:
      'Offline, line-interactive and online double-conversion UPS, single-phase and three-phase, tower and rack, with internal or external battery cabinets',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Moderate — the fault is usually upstream of the UPS or in the battery start circuit, but the stored energy inside makes a careless approach dangerous',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'Mains 240 V single-phase or 415 V three-phase, 50 Hz nominal; internal DC bus and battery string voltage per UPS design',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'A UPS with a completely dead front panel is far more often a supply or battery-start problem than a failed UPS. Work outward before you work inward. Confirm the UPS is actually being fed — an upstream breaker, a failed input fuse or a switched socket accounts for a large share of these calls. Then confirm the battery circuit, because most UPS designs need battery voltage present to start their own control supply, and a deeply discharged or open battery string leaves the unit unable to wake even with good mains. Only when supply and battery are both proven should you look at the internal control supply. Do not open the enclosure until you have isolated, waited out the manufacturer discharge time and proved the DC bus dead — the capacitors in a UPS hold a lethal charge long after everything looks off.',

  symptoms: {
    display: [
      'No display, no backlight and no LEDs at all',
      'Display briefly illuminates then goes dark again',
      'Audible alarm sounds once at power-up then silence',
      'Front panel responds to the power button but the unit never transfers to output',
    ],
    indicators: [
      'No input LED even with mains confirmed present at the socket or terminals',
      'Battery LED flashing without the unit starting, on designs that indicate this',
      'Output receptacles or terminals dead in every mode',
    ],
    sounds: [
      'Silence, including no fan, which distinguishes a dead unit from one that has started and faulted',
      'A relay click at the moment of button press followed by nothing',
      'Fan starting briefly then stopping, which suggests the unit begins its start sequence and aborts',
    ],
    smells: [
      'Burnt or acrid smell indicating a failed component, most often at the input stage',
      'Sulphurous or rotten-egg smell from the battery compartment, which indicates a battery fault and is a stop-work condition',
    ],
    behaviour: [
      'Completely unresponsive to the power button',
      'Will not start on mains, will not start on battery, will not cold-start',
      'Worked normally until a mains event, then never came back',
      'Unit was left switched off with batteries connected for a long period and will now not wake',
    ],
    visible: [
      'Blown input fuse, where the design makes one accessible',
      'Tripped upstream breaker at the distribution board',
      'Swollen, leaking or corroded batteries in the internal compartment or external cabinet',
      'Discoloured or heat-damaged input terminal block',
      'Loose or disconnected battery connector, common after a battery replacement',
      'Evidence of water ingress or heavy dust in the enclosure vents',
    ],
  },

  whatItMeans: {
    plain:
      'A UPS needs power to run its own electronics before it can protect anything else. It normally takes that from the mains, and if the mains is missing it takes it from the batteries. If both of those are unavailable — no incoming supply, and batteries flat or disconnected — the unit has nothing to run itself on and stays completely dead. So a dead UPS usually means the supply to it is missing or the batteries are gone, not that the UPS itself has broken.',
    technical:
      'The control electronics in a UPS are fed from an auxiliary supply derived either from the mains input or from the battery string, depending on design and state. Most units require a minimum battery voltage to initiate a cold start, and many will not start at all on battery below a defined threshold, deliberately, to prevent deep discharge damage. A dead panel therefore has three broad causes: no input supply reaching the unit, a battery circuit that is open or below the start threshold, or a failure in the auxiliary supply itself. The first two are external to the power electronics and account for the majority of cases. The third is an internal repair. Establishing which of the three applies is almost entirely a matter of measurement at the input terminals and across the battery string, both of which can be done without opening the power section.',
  },

  causes: {
    mostLikely: [
      'No mains reaching the UPS — upstream breaker tripped, isolator open, plug not seated, or a switched socket turned off',
      'Battery string deeply discharged below the cold-start threshold after a long outage or prolonged storage',
      'Battery disconnected or its connector not fully seated, very common immediately after a battery replacement',
      'Input fuse operated, where the design provides an accessible one',
    ],
    possible: [
      'Battery string open circuit through a failed cell, a corroded inter-cell link, or an operated battery-circuit breaker',
      'Battery circuit breaker in an external cabinet left open after maintenance',
      'Input terminal connection loose or burnt, interrupting supply at the unit itself',
      'Failed auxiliary or standby power supply on the control board',
    ],
    lessCommon: [
      'Power button or its harness failed, so the unit never receives the start command',
      'Control board failure preventing the start sequence completing',
      'Charger or rectifier stage failed in a way that also removes the auxiliary supply',
      'Firmware or control lockout state requiring a manufacturer procedure to clear',
    ],
    modelSpecific: [
      'The cold-start procedure differs by manufacturer and model, and some units cannot cold-start on battery at all by design — check the manual before concluding the unit is faulty',
      'The minimum battery voltage required to start is design-specific and must be taken from the documentation',
      'Some three-phase units require all input phases present, and will appear dead on loss of a single phase',
      'Certain designs latch out after a defined number of consecutive faults and require a documented reset',
    ],
    environmental: [
      'Prolonged grid outage discharging the batteries beyond recovery — a routine cause in areas with extended outages',
      'High ambient temperature in an unventilated comms room shortening battery life so the string fails earlier than expected',
      'Dust accumulation causing tracking or blocking ventilation',
      'Humidity and condensation corroding battery terminals and inter-cell links',
      'Lightning-induced surge damaging the input stage',
    ],
    installation: [
      'UPS fed from a socket circuit that is switched or shared with equipment that trips it',
      'Battery cabinet commissioned with the battery breaker left open',
      'Undersized or loose input terminations overheating and eventually opening',
      'Unit installed with insufficient clearance so it has been running hot for its whole life',
    ],
    maintenance: [
      'Batteries never load-tested or replaced on interval, so the string fails without warning',
      'UPS left switched off with batteries connected for months, allowing them to self-discharge below recovery',
      'Battery replacement carried out without verifying the string voltage and polarity before restoring',
      'No record of battery installation date, so end of life is never anticipated',
    ],
    componentLevel: [
      'Failed auxiliary supply components on the control board',
      'Input rectifier or inrush limiting circuit failure',
      'Failed battery-circuit contactor or its drive',
      'Open fuse internal to the battery string',
    ],
  },

  safety: {
    isolation: [
      'A UPS has at least two independent energy sources — the mains input and the battery string. Isolating one does not make the unit safe.',
      'Open and lock the upstream supply, then open the battery circuit breaker or disconnect the battery string, then wait the manufacturer discharge time before opening anything.',
      'Prove dead at the DC bus test points where the manufacturer provides them, not by assumption.',
      'On units with a maintenance bypass, understand its state before working — a bypass can keep the output terminals live with the UPS itself apparently dead.',
    ],
    lockoutTagout: [
      'Lock the upstream supply breaker and tag it.',
      'Lock or physically disconnect and tag the battery circuit.',
      'Where the load is critical, agree the outage in writing before starting — an unexpected drop of a comms room or theatre is a serious incident in itself.',
      'On multi-person work, each person applies their own lock.',
    ],
    ppe: [
      'Insulated gloves and tools rated above the DC bus voltage',
      'Eye protection, particularly when working near batteries',
      'Arc-rated clothing where the fault suggests an internal failure at the input stage',
      'Acid-resistant gloves and eye protection when handling flooded batteries; know where the eyewash is before you start',
    ],
    storedEnergy: [
      'DC-link capacitors retain a dangerous charge after all supplies are removed. Observe the manufacturer discharge time in full — it is typically several minutes and is not optional.',
      'The battery string remains at full voltage regardless of UPS state, and a large string carries enormous short-circuit energy.',
      'Never bridge battery terminals with an uninsulated tool. A dropped spanner across a string will vaporise and cause serious burns.',
      'Remove watches, rings and metal wristbands before working in a battery cabinet.',
    ],
    specificHazards: [
      'The output of a UPS can be live even when the front panel is dead, if a maintenance bypass is closed.',
      'Batteries produce hydrogen while charging; do not introduce an ignition source into a poorly ventilated battery room.',
      'A swollen or leaking battery is a chemical hazard and must not be handled without appropriate protection.',
      'Three-phase UPS input terminals may remain live from an upstream source that your isolation did not cover; prove every conductor.',
    ],
    stopAndCallProfessional: [
      'You smell burning, or find heat damage inside the enclosure — isolate and stop.',
      'Batteries are swollen, leaking or hot. This is a chemical and fire hazard, not an electrical fault to work through.',
      'You cannot establish the state of a maintenance bypass and therefore cannot confirm the output is dead.',
      'The UPS supports a critical load and the outage has not been authorised.',
      'The fault is inside the power section and you are not trained on that unit — UPS internals carry lethal stored energy and manufacturer-specific interlocks.',
      'The unit has latched out repeatedly; a latching fault indicates a real internal problem, not a nuisance to be reset away.',
    ],
  },

  tools: [
    { tool: 'Multimeter, CAT III minimum', why: 'Input voltage, battery string voltage and continuity — the three measurements that resolve most of these faults' },
    { tool: 'Proving unit', why: 'Confirms the meter worked before and after the dead test, which is the whole basis of proving dead' },
    { tool: 'Insulated tools rated above the DC bus and battery voltage', why: 'Battery and DC bus work with uninsulated tools risks a short with very high available energy' },
    { tool: 'Clamp meter with DC range', why: 'Confirms whether any charging current is flowing to the battery string' },
    { tool: 'Battery impedance or conductance tester', why: 'Identifies a failed cell in a string that measures acceptably overall' },
    { tool: 'The manufacturer manual for the specific model', why: 'Cold-start procedure, minimum start voltage and discharge time are all model-specific and must not be guessed' },
    { tool: 'Torque screwdriver', why: 'Battery and input terminals must be torqued to the manufacturer figure; loose terminals cause the next failure' },
  ],

  decisionTree: [
    {
      question: 'Is mains voltage present at the UPS input terminals, measured rather than assumed?',
      yes: 'Supply is proven — move to the battery circuit',
      no: 'The fault is upstream. Trace the breaker, isolator, plug or socket before touching the UPS.',
    },
    {
      question: 'Is the battery string connected, its breaker closed, and its voltage above the manufacturer minimum start threshold?',
      yes: 'Battery circuit is viable — the fault is likely internal',
      no: 'Restore or recharge the battery circuit first; most units cannot start without it',
    },
    {
      question: 'Does the unit respond at all — a click, a brief display, a fan twitch?',
      yes: 'The start sequence is beginning and aborting; the auxiliary supply is at least partly alive',
      no: 'Nothing is reaching the control electronics at all',
    },
    {
      question: 'Has the documented cold-start procedure for this exact model been carried out correctly?',
      yes: 'Continue to internal diagnosis',
      no: 'Do that first — a large share of "dead" units are simply not being started the way that model requires',
    },
    {
      question: 'Is there any smell of burning, heat damage or a swollen battery?',
      yes: 'Stop. Isolate and escalate — this is not a fault to work through',
      no: 'Proceed to controlled internal inspection with the unit fully isolated and proved dead',
    },
    {
      question: 'With supply and battery both proven good, does the unit still refuse to start?',
      yes: 'Internal auxiliary supply or control board fault — manufacturer-level repair',
      no: 'Identify what changed, correct it properly, and record it',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish what the load is doing before you touch anything',
      inspect: 'Whether the connected load is running, and from what',
      where: 'The load side and any maintenance bypass',
      instrument: 'Visual, plus multimeter at the output where safe to access',
      expected:
        'Either the load is dead with the UPS, or it is running through a bypass. Knowing which changes everything about how you proceed.',
      ifAbnormal:
        'If the load is live while the UPS panel is dead, a bypass is closed and the output terminals are energised',
      next: 'Agree the outage with whoever owns the load before proceeding',
      warning:
        'Never assume the output is dead because the front panel is dead. A closed maintenance bypass keeps it live.',
    },
    {
      step: 2,
      title: 'Prove mains supply at the UPS input',
      inspect: 'Voltage at the input terminals or plug, on all phases where three-phase',
      where: 'UPS input terminals, or the supplying socket',
      instrument: 'Multimeter, CAT III minimum, with a proving unit',
      expected:
        'Nominal supply present and stable — 240 V single-phase or 415 V between phases, 50 Hz, per the installation',
      ifAbnormal:
        'No supply means the fault is upstream: breaker, isolator, plug, socket or the circuit itself. A missing phase on a three-phase unit will present as a completely dead UPS.',
      next: 'If supply is absent, resolve it and retry before any further UPS work',
      verify:
        'Confirm from the manual whether this model requires all phases present to start',
      warning:
        'Prove your meter on a known live source before and after the measurement. A dead meter reads the same as a dead supply.',
    },
    {
      step: 3,
      title: 'Check the input fuse and terminations',
      inspect: 'Accessible input fuse continuity, and the condition of input terminations',
      where: 'Input fuse holder and terminal block',
      instrument: 'Multimeter on continuity, with the supply isolated and proved dead',
      expected: 'Fuse showing continuity; terminations tight, undiscoloured and correctly torqued',
      ifAbnormal:
        'A blown input fuse indicates a past fault event — establish why before replacing. Discoloured terminals indicate a loose joint that has been running hot.',
      next: 'Re-torque terminations to the manufacturer figure and replace any damaged terminal block',
      warning:
        'Isolate before testing the fuse. Test it out of circuit — an in-circuit continuity reading can complete through the unit and mislead you.',
    },
    {
      step: 4,
      title: 'Measure the battery string',
      inspect: 'Battery string terminal voltage, breaker position and connector seating',
      where: 'Battery compartment or external battery cabinet',
      instrument: 'Multimeter on DC volts',
      expected:
        'String voltage at or above the manufacturer minimum start threshold, with the battery breaker closed and connectors fully seated',
      ifAbnormal:
        'A string well below nominal is deeply discharged. A string reading near zero with the breaker closed is open circuit — a failed cell, an operated internal fuse, or a corroded link.',
      next:
        'Where the string is merely discharged, the unit may recover once mains is restored and it charges; where it is open, find the break',
      verify:
        'Take the nominal string voltage and the minimum start voltage from the manual for this model — never assume from the battery count alone',
      warning:
        'Do not bridge battery terminals with tools. Remove watches and rings before reaching into a battery cabinet.',
    },
    {
      step: 5,
      title: 'Measure individual blocks where the string is suspect',
      inspect: 'Terminal voltage of each battery block, and inter-block link condition',
      where: 'Along the battery string',
      instrument: 'Multimeter, and a battery impedance or conductance tester where available',
      expected: 'Blocks reading closely together, with clean, tight, corrosion-free links',
      ifAbnormal:
        'One block markedly below the others has failed and takes the string with it. Corroded or warm links indicate high resistance joints.',
      next:
        'A failed block means the string is replaced as a set — mixing new and aged blocks shortens the life of the new ones',
      warning:
        'A swollen, leaking or hot battery is a stop-work condition. Do not continue testing it.',
    },
    {
      step: 6,
      title: 'Carry out the documented cold-start procedure',
      inspect: 'Unit response to the manufacturer cold-start sequence for this exact model',
      where: 'Front panel',
      instrument: 'The manufacturer manual',
      expected: 'The unit starts, or gives a defined indication of why it will not',
      ifAbnormal:
        'No response at all after a correctly performed cold start, with battery voltage confirmed adequate, points at the auxiliary supply',
      next: 'Record exactly what the unit did, because that behaviour is the most useful information for the next stage',
      verify:
        'Some models cannot cold-start on battery at all. Confirm before concluding the unit is faulty.',
    },
    {
      step: 7,
      title: 'Inspect internally, fully isolated and proved dead',
      inspect: 'Input stage, control board, fans and general condition',
      where: 'Inside the enclosure',
      instrument: 'Visual, after isolation and the full manufacturer discharge time',
      expected: 'No heat damage, no water ingress, no swollen capacitors, connectors seated',
      ifAbnormal:
        'Heat damage or component failure at the input stage or on the control board is a manufacturer-level repair on most units',
      next: 'Photograph what is found before disturbing anything',
      warning:
        'DC-link capacitors hold a lethal charge after everything is switched off. Wait the full discharge time and prove the bus dead at the manufacturer test points before touching any internal conductor.',
    },
    {
      step: 8,
      title: 'Confirm the repair under real conditions',
      inspect: 'Start-up, transfer to battery, and return to mains',
      where: 'Front panel and output',
      instrument: 'Multimeter and the unit\'s own indications',
      expected:
        'Clean start, output within specification, correct transfer on simulated mains loss, correct return, and charging current flowing to the battery afterwards',
      ifAbnormal:
        'Starting but failing to transfer indicates a separate fault — work the relevant guide rather than declaring this one closed',
      next: 'Record battery installation date, string voltage and the date of this work on the unit',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Supply and termination work',
      steps: [
        'Restore the upstream supply and identify why it was lost — a tripped breaker has a reason.',
        'Re-terminate and torque input connections to the manufacturer figure.',
        'Replace terminal blocks showing heat discolouration rather than re-tightening them.',
        'Clean battery terminals and inter-block links, and apply the manufacturer-recommended protection where specified.',
        'Confirm the UPS is fed from a dedicated, unswitched circuit of adequate rating.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Battery string replacement',
      steps: [
        'Replace the string as a complete set. Mixing new blocks with aged ones drags the new ones down to the condition of the old.',
        'Match voltage, capacity and type to the original specification.',
        'Observe polarity at every link, and verify total string voltage before reconnecting to the UPS.',
        'Torque every terminal to the manufacturer figure — a loose battery link is a fire risk under fault current.',
        'Record the installation date on the batteries and in the site log, so the next end-of-life is anticipated rather than discovered.',
        'Dispose of the old batteries through a licensed handler.',
      ],
      note:
        'Battery failure is the single most common reason a UPS will not start. It is also the most predictable, and the easiest to prevent with a replacement interval.',
    },
    {
      level: 'configuration',
      title: 'Restoring to service',
      steps: [
        'Close the battery breaker before applying mains, or follow the manufacturer sequence where it differs.',
        'Allow the unit to charge before testing autonomy — a transfer test on an uncharged string proves nothing and can damage it.',
        'Confirm the bypass is returned to its normal operating position.',
        'Test transfer and return under a controlled, agreed outage.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Internal faults',
      steps: [
        'Auxiliary supply and control board faults are manufacturer-level repairs on most UPS designs.',
        'Establish warranty status before opening the power section.',
        'Where the unit is beyond economic repair, size the replacement against the load measured now rather than the load it was bought for.',
        'Retain the fault findings — a replacement decision is easier to justify with measurements behind it.',
      ],
    },
  ],

  validation: [
    'Unit starts cleanly on mains and holds the load',
    'Output voltage and frequency within the specification for the model',
    'Correct transfer to battery on simulated mains loss and correct return afterwards',
    'Charging current flowing to the battery string after return to mains',
    'Battery string voltage recovering as expected during charge',
    'No alarms latched after a full operating cycle',
    'Battery installation date and this visit recorded on the unit and in the site log',
  ],

  whenNotToRepair: [
    'Batteries swollen, leaking or hot — replacement and safe disposal, not repair',
    'Water ingress into the power section',
    'Failed power stage on a unit beyond its supported life, where parts are no longer available',
    'A unit whose repair cost approaches replacement, particularly where the load has grown beyond its rating',
    'Any unit where the internal fault cannot be identified with confidence and the load is critical — a UPS that fails unpredictably is worse than no UPS, because it is trusted',
    'Units latching out repeatedly after a nominal repair; that is an unresolved internal fault',
  ],

  prevention: [
    'Replace batteries on a planned interval based on their installation date and the room temperature, not on failure',
    'Test autonomy under real load at least annually — a string can show correct voltage and still have almost no capacity',
    'Keep the UPS room ventilated and within the temperature range the battery manufacturer specifies; heat is the dominant factor in battery life',
    'Never leave a UPS switched off with batteries connected for extended periods',
    'Feed the UPS from a dedicated unswitched circuit',
    'Log battery installation dates, test results and any alarm events so degradation is visible before it becomes an outage',
    'Verify the maintenance bypass operates correctly during planned maintenance, not during an emergency',
  ],

  relatedSlugs: [
    'ups-not-charging-batteries',
    'ups-battery-replacement',
    'ups-inverter-fault-diagnosis',
    'ups-bypass-fault',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'My UPS is completely dead. Is it broken?',
      a: 'Usually not. The most common causes are no supply reaching it and a battery string that has gone flat or open. Both are outside the UPS itself. Measure the input voltage and the battery string voltage before concluding anything about the unit.',
    },
    {
      q: 'The mains is on but the UPS will not start. Why?',
      a: 'Many UPS designs require battery voltage above a minimum threshold before they will start, even with good mains, to protect the batteries from deep discharge. A string that has been flat for a long time can leave the unit unable to wake. Check the string voltage against the figure in the manual for your model.',
    },
    {
      q: 'Can I just replace one bad battery in the string?',
      a: 'No. A new block in an aged string is dragged down to the condition of the old ones and the whole string fails again shortly afterwards. Replace as a complete matched set.',
    },
    {
      q: 'Is the output safe to touch if the UPS panel is dead?',
      a: 'Not necessarily. If a maintenance bypass is closed, the output remains live from the mains with the UPS itself completely dead. Always establish the bypass state and prove the output dead before working on it.',
    },
    {
      q: 'How long do I need to wait after switching off before opening it?',
      a: 'The manufacturer discharge time for that model, in full. The DC-link capacitors hold a lethal charge and the wait is not a formality. Where test points are provided, prove the bus dead rather than relying on the clock alone.',
    },
    {
      q: 'How often should UPS batteries be replaced?',
      a: 'The manufacturer states a design life, but actual life depends heavily on temperature — a hot comms room can halve it. Go by installation date and annual capacity testing rather than waiting for failure, because the failure usually appears during the outage you bought the UPS for.',
    },
  ],

  references: [
    'UPS manufacturer installation and operation manual for the specific model — cold-start procedure, minimum start voltage and capacitor discharge time',
    'Battery manufacturer datasheet — nominal voltage, design life, temperature derating and torque figures',
    'IEEE 1188 — maintenance, testing and replacement practices for valve-regulated lead-acid batteries in stationary applications',
    'IEC 62040 series — uninterruptible power systems: general and safety requirements, and performance classification',
    'Site electrical single-line diagram and the UPS commissioning record',
    'KS IEC standards as adopted by KEBS, and Energy and Petroleum Regulatory Authority requirements applying to installations in Kenya',
  ],
};
