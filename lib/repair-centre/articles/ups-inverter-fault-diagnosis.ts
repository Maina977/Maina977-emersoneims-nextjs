import type { RepairArticle } from '../types';

export const upsInverterFaultDiagnosis: RepairArticle = {
  slug: 'ups-inverter-fault-diagnosis',
  hub: 'ups',
  header: {
    title: 'UPS Inverter Fault — Diagnosis and Repair',
    equipmentCategory: 'Online double-conversion UPS — inverter stage',
    appliesTo: 'Online double-conversion UPS systems, single- and three-phase, including modular and parallel installations',
    difficulty: 'advanced',
    diagnosisComplexity: 'Moderate. The important early distinction is whether the inverter failed or was overwhelmed, because those lead to entirely different repairs.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Output 240 V / 415 V 50 Hz nominal; DC bus per UPS design',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Establish whether the inverter failed or was simply overwhelmed, because the two look identical on the display and lead to completely different work. An inverter fault that follows a load event — a motor start, a downstream short circuit, a laser printer, or load added since commissioning — is usually the protection acting correctly against an overload, and the repair is on the load side, not inside the UPS. Read the event log first, because it normally states whether the trip was overload, over-temperature, DC bus or a hardware fault, and that single reading directs everything after it. Measure the actual load against the unit rating rather than accepting what the site believes is connected, since load creep over years is the most common underlying cause. Check the cooling path as well, because a UPS that cannot reject heat trips on the inverter stage while every electrical parameter is normal. Only when the load is proven to be within rating, the DC bus healthy and the cooling path clear should the inverter stage itself be suspected, and at that point the work is a workshop matter on a proven-discharged bus, not a field repair.',

  symptoms: {
    display: [
      'Inverter fault, inverter failure or output stage fault',
      'Overload indication, with or without a subsequent transfer',
      'Over-temperature warning or shutdown',
      'DC bus fault accompanying the inverter alarm',
      'Load transferred to bypass, which is the protective response and leaves the load unprotected',
    ],
    indicators: [
      'Inverter path indicator dark on the mimic display while bypass carries the load',
      'Fault latched and not resettable',
      'Fans running at maximum, or not running at all',
    ],
    sounds: [
      'A bang or crack at the moment of failure',
      'Fans running continuously at full speed, indicating a thermal problem',
      'No fan noise at all, which is itself a likely cause',
      'Transfer relays operating as the unit moves the load to bypass',
    ],
    smells: [
      'Burnt-electronics smell from the inverter section — do not attempt a restart',
      'Hot insulation smell at output terminations',
      'Dusty or hot smell indicating restricted airflow',
    ],
    behaviour: [
      'Tripped at the moment a large load started, which points at overload rather than failure',
      'Trips repeatedly at the same time of day, which usually reflects a load pattern',
      'Trips after running for a period, which points at thermal rather than electrical causes',
      'Went to bypass and will not return to inverter',
      'Failed immediately on start, which suggests a hardware fault rather than an overload',
      'Load has grown since commissioning without the UPS being reassessed',
    ],
    visible: [
      'Air filters blocked, and fans stopped or obstructed',
      'Dust accumulation on heatsinks',
      'Discoloured or damaged components visible in the inverter section',
      'Heat discolouration at output terminations',
      'Additional load equipment connected since the unit was commissioned',
      'Ambient conditions in the room — temperature and ventilation',
    ],
  },

  whatItMeans: {
    plain:
      'The inverter is the part of the UPS that actually produces the clean output your equipment runs on. When it faults, the UPS normally moves the load to bypass so the equipment keeps running, but with no protection. Often the inverter has not broken at all: it has been asked to supply more than it can, or it has got too hot, and it has shut down to protect itself.',
    technical:
      'In an online double-conversion topology the inverter continuously synthesises the output from the DC bus, so it carries the full load at all times and its protection responds to overload, short circuit, over-temperature and DC bus excursions. Overload protection is typically time-dependent, permitting a short excursion above rating and tripping progressively faster as the overload increases, which is why a brief motor start can trip a unit that runs happily at a steady load close to the same figure. Crest factor matters as much as apparent power: a load drawing its current in short high peaks stresses the inverter more than its RMS figure suggests, which is why banks of switched-mode supplies can trouble a unit that appears comfortably rated. Thermal protection is equally significant because inverter losses appear as heat that must be rejected; blocked filters, failed fans or a room warmer than the design assumption cause trips with every electrical parameter entirely normal. The DC bus feeds the inverter, so bus faults present as inverter faults, and a battery that cannot support the bus during a transfer produces the same symptom. Genuine inverter hardware failure — the power devices and their gate drive — is the least common of these and the only one requiring internal work, which is why it should be concluded last rather than assumed first.',
  },

  causes: {
    mostLikely: [
      'Overload, frequently transient at the start of a motor or other inrush load',
      'Load grown beyond the unit rating since commissioning',
      'Thermal trip from blocked filters, failed fans or high room temperature',
      'Downstream short circuit or fault on the output',
    ],
    possible: [
      'Load with a high crest factor stressing the inverter beyond what its RMS figure suggests',
      'DC bus problem presenting as an inverter fault',
      'Battery unable to support the bus during a transfer',
      'Output termination loose or high resistance',
    ],
    lessCommon: [
      'Inverter power device or gate-drive failure',
      'Control board fault',
      'DC bus capacitors degraded',
      'Synchronisation or control fault preventing return from bypass',
      'Firmware or configuration issue after an update',
    ],
    modelSpecific: [
      'Overload withstand characteristics and trip timing are model-specific — read them from the unit documentation rather than assuming',
      'Crest factor capability differs between models and materially affects what load a unit can actually support',
      'Ambient temperature rating and derating above it are model-specific',
      'Parallel and modular systems distribute load between modules, and a module fault behaves differently from a single-unit fault',
      'Reset behaviour after an inverter trip differs; some units require a deliberate reset and others retry automatically',
    ],
    environmental: [
      'Room temperature above the design assumption, which is extremely common in unventilated plant rooms',
      'Dust loading filters and heatsinks',
      'Poor ventilation or recirculation of the unit\'s own discharge air',
      'Humidity and corrosive atmospheres',
    ],
    installation: [
      'Unit installed without the specified clearance or ventilation',
      'Room cooling sized without accounting for UPS losses',
      'Output cabling undersized, causing voltage drop under load',
      'Load profile never characterised, so inrush and crest factor were never considered',
    ],
    maintenance: [
      'Filters never changed and heatsinks never cleaned',
      'Fan failure not noticed, since the unit continues working until it overheats',
      'Actual load never measured against rating at service visits',
      'Event logs never reviewed, so repeated overload events go unnoticed until a failure',
      'Battery condition unknown, so bus support during transfer is unproven',
    ],
    componentLevel: [
      'Inverter power device failed',
      'Gate-drive circuit failed',
      'Cooling fan failed',
      'DC bus capacitors degraded',
      'Output filter component failed',
    ],
  },

  safety: {
    isolation: [
      'A UPS has multiple independent sources — rectifier input, bypass input, battery and inverter output. Isolating one does not make it safe.',
      'Isolate every source and prove dead at the point of work',
      'The battery string cannot be switched off; open its isolator and remove its fuse',
      'Confirm the DC bus has discharged before opening the enclosure',
    ],
    lockoutTagout: [
      'Lock and tag the rectifier input, bypass input, battery isolator and maintenance bypass',
      'Confirm with the site that the load may lose protection, or arrange an alternative',
      'Where the maintenance bypass carries the load, verify it is genuinely carrying it before isolating the unit',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy',
      'Insulated tools rated for the DC bus voltage',
      'Eye protection',
      'ESD precautions for any board handling',
    ],
    storedEnergy: [
      'The DC bus and battery string remain at dangerous voltage after shutdown',
      'Verify capacitor discharge with a meter rather than relying on a stated period',
      'Re-check the bus before each work session, as some circuits recover charge',
    ],
    specificHazards: [
      'BACKFEED: a UPS can energise terminals that appear isolated. Prove dead at the point of work immediately before starting, never on the basis of upstream isolation alone.',
      'The load is on bypass and unprotected while this fault persists — every further step should be planned with that in mind',
      'Do not repeatedly reset an inverter fault to keep the unit online. If the cause is an overload or a thermal problem, resetting simply repeats the event and can cause real damage.',
      'Never open-circuit a current transformer secondary while load current flows',
      'A unit with a burnt smell must not be restarted',
    ],
    stopAndCallProfessional: [
      'There is a burnt smell or visible damage in the inverter section',
      'The fault requires opening the enclosure and you cannot verify bus discharge',
      'The load cannot lose protection and no alternative exists',
      'Power device or gate-drive failure is established',
      'The unit is part of a parallel or modular system whose behaviour you are not familiar with',
    ],
  },

  tools: [
    { tool: 'True-RMS multimeter', why: 'Output and DC bus measurements; a non-RMS meter misreads the distorted waveforms typical of these loads' },
    { tool: 'Power quality analyser with logging', why: 'Actual load, crest factor and inrush over time — a spot reading cannot show the event that caused the trip' },
    { tool: 'Clamp meter, true-RMS', why: 'Real load current against the unit rating' },
    { tool: 'Thermal camera', why: 'Heatsinks, output terminations and airflow path — thermal causes are common and easy to confirm' },
    { tool: 'Temperature logger', why: 'Room temperature over time, rather than at the moment of the visit' },
    { tool: 'Anemometer', why: 'Confirming airflow where fan or ventilation problems are suspected' },
    { tool: 'UPS service interface and event log', why: 'The log usually states the trip reason directly, which redirects the whole investigation' },
  ],

  decisionTree: [
    { question: 'Is there a burnt smell or visible damage in the inverter section?', yes: 'Stop. Do not restart. Escalate.', no: 'Continue' },
    { question: 'Does the event log state the trip reason?', yes: 'Follow it — overload, thermal, DC bus and hardware lead to different work', no: 'Log the load and conditions until the event recurs' },
    { question: 'Did the trip coincide with a load event such as a motor start?', yes: 'Overload is the likely cause — the repair is on the load side', no: 'Continue' },
    { question: 'Is the measured load within the unit rating, allowing for inrush and crest factor?', yes: 'Continue', no: 'The unit is being asked to do more than it can. Reduce load or reassess the rating.' },
    { question: 'Are filters clear, fans running and room temperature within specification?', yes: 'Continue', no: 'A thermal cause — every electrical parameter can be normal while the unit still trips' },
    { question: 'Is the DC bus healthy and the battery able to support it?', yes: 'Continue', no: 'A bus or battery problem presents as an inverter fault' },
    { question: 'With load, cooling and bus all proven good, does the fault persist?', yes: 'Genuine inverter hardware fault — refer for workshop diagnosis', no: 'Cause identified externally; validate and record' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Recognise the load is unprotected and plan accordingly',
      inspect: 'Whether the load is on bypass and what happens if bypass is also lost',
      where: 'UPS mimic display',
      instrument: 'UPS display',
      expected: 'A conscious decision about the load before work begins',
      ifAbnormal: 'With the inverter faulted, the load is running on bypass with no protection. Arrange an alternative before investigating where the load is critical.',
      next: 'Step 2',
    },
    {
      step: 2,
      title: 'Read the event log before touching anything',
      inspect: 'Trip reason, time and whether it has recurred',
      where: 'UPS service interface',
      instrument: 'Service interface',
      expected: 'A specific reason — overload, over-temperature, DC bus or hardware',
      ifAbnormal: 'Repeated overload events over weeks change the diagnosis entirely: the unit is under-rated for its load, not faulty. This step redirects most of these jobs.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure the actual load against the rating',
      inspect: 'Real load current and apparent power on every phase',
      where: 'At the UPS output',
      instrument: 'True-RMS clamp meter or analyser',
      expected: 'Load comfortably within the unit rating',
      ifAbnormal: 'Do not accept the site\'s belief about what is connected. Load creep over years is the most common underlying cause, and equipment is frequently added without anyone reassessing the UPS.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Log inrush and crest factor rather than steady state',
      inspect: 'Peak demand at load starts, and the crest factor of the connected load',
      where: 'At the UPS output, logged over a representative period',
      instrument: 'Power quality analyser with logging',
      expected: 'Peaks and crest factor within the unit capability',
      ifAbnormal: 'A steady-state reading well within rating can coexist with peaks that trip the unit. Crest factor matters as much as apparent power, and banks of switched-mode supplies can trouble a nominally comfortable unit.',
      next: 'Step 5',
      verify: 'The unit\'s overload withstand characteristic and crest factor capability, from its documentation — these are model-specific.',
    },
    {
      step: 5,
      title: 'Check the cooling path thoroughly',
      inspect: 'Filters, fans, heatsinks, clearances and room temperature',
      where: 'Throughout the unit and the room',
      instrument: 'Thermal camera, anemometer, temperature logger',
      expected: 'Filters clear, all fans running, room within the unit specification',
      ifAbnormal: 'A UPS that cannot reject heat trips the inverter stage while every electrical parameter is normal. A single failed fan is easy to miss because the unit keeps working until it overheats.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Assess the DC bus and battery support',
      inspect: 'Bus voltage and stability, and whether the battery can support the bus during a transfer',
      where: 'At the DC bus and battery',
      instrument: 'True-RMS multimeter, DC clamp',
      expected: 'Bus stable and battery capable of supporting it',
      ifAbnormal: 'A bus problem presents as an inverter fault. A battery that collapses during a transfer produces the same alarm as a failed inverter and is far more common.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Inspect and thermally survey output terminations',
      inspect: 'Termination tightness and temperature under load',
      where: 'At the UPS output terminals and distribution',
      instrument: 'Thermal camera, insulated torque wrench',
      expected: 'All connections cool and torqued to specification',
      ifAbnormal: 'A high-resistance output joint causes voltage drop and heating that can trip the unit and is trivially fixed once found.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Only now conclude an inverter hardware fault',
      inspect: 'Whether the fault persists with load, cooling and bus all proven',
      where: 'At the unit',
      instrument: 'All prior measurements',
      expected: 'External causes eliminated before the enclosure is opened',
      ifAbnormal: 'A genuine inverter hardware fault is the least common of these causes and the only one requiring internal work. Refer for workshop diagnosis with all measurements recorded.',
      next: 'Refer to the manufacturer or a properly equipped facility',
      warning: 'Verify the DC bus has discharged before any internal work. Never restart a unit with a burnt smell.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Cooling and terminations',
      steps: [
        'Replace or clean air filters and clear obstructed airflow paths',
        'Clean heatsinks',
        'Re-torque output terminations to specification and re-survey thermally under load',
        'Restore clearances around the unit',
      ],
      note: 'Thermal causes are common, cheap to fix, and frequently misdiagnosed as inverter failure.',
    },
    {
      level: 'component-replacement',
      title: 'Cooling and bus components',
      steps: [
        'Replace failed cooling fans promptly — a failed fan is an urgent fault, not a cosmetic one',
        'Replace degraded DC bus capacitors identified by testing',
        'Replace a battery string that cannot support the bus during transfer',
      ],
    },
    {
      level: 'configuration',
      title: 'Load and installation',
      steps: [
        'Reduce or redistribute load where measurement shows the unit is over its rating',
        'Reassess the UPS rating against the load the site now actually has, including inrush and crest factor',
        'Improve room ventilation or cooling where temperature exceeds the unit specification',
        'Move high-inrush loads off the UPS where they do not require protection',
      ],
      note: 'Where the load has outgrown the unit, no repair will resolve it. That is a sizing conversation.',
    },
    {
      level: 'manufacturer-level',
      title: 'Inverter stage',
      steps: [
        'Refer inverter power device, gate-drive and control faults to the manufacturer or a properly equipped facility',
        'Provide the event log, measured load, crest factor, thermal survey and bus measurements',
      ],
    },
  ],

  validation: [
    'Confirm the unit returns to inverter operation and carries the load',
    'Measure load against rating and record it, including peaks over a representative period',
    'Confirm all fans run and filters are clear',
    'Log room temperature over a period rather than spot-checking it',
    'Thermally survey the unit and output terminations under load after the work',
    'Confirm the battery can support the bus, by a controlled transfer test at a planned time',
    'Review the event log after a settling period to confirm the trips have stopped rather than become less frequent',
    'Record all measurements and any load or installation changes made',
  ],

  whenNotToRepair: [
    'Where the load has outgrown the unit — this is a sizing problem, not a repair',
    'Obsolete units where inverter modules and control boards are unobtainable',
    'Repeated inverter failure after competent repair, indicating an unresolved load or thermal cause',
    'Where the room cannot be brought within the unit\'s ambient specification',
    'Where repair cost approaches replacement value, particularly on a unit already at end of design life',
  ],

  prevention: [
    'Measure actual load against rating at every service visit — load creep is the most common underlying cause',
    'Change filters and clean heatsinks on a defined schedule',
    'Treat a failed fan as an urgent fault',
    'Monitor and control room temperature; UPS losses are a heat source the room cooling must account for',
    'Review event logs at each visit; repeated overload events are an early warning',
    'Characterise inrush and crest factor when adding equipment, not only steady-state load',
    'Keep battery capacity proven, since bus support during transfer depends on it',
    'Reassess UPS sizing whenever the protected load changes materially',
  ],

  relatedSlugs: ['ups-bypass-fault', 'ups-on-battery-with-mains-present'],

  faq: [
    {
      q: 'The UPS says inverter fault. Does that mean it needs a new inverter?',
      a: 'Usually not. The inverter protects itself against overload, over-temperature and DC bus problems, and it reports all of them as an inverter fault. Genuine hardware failure is the least common cause. Read the event log, measure the real load against the rating, and check the cooling path before anyone opens the enclosure.',
    },
    {
      q: 'It trips when a particular machine starts but runs fine otherwise. Why?',
      a: 'Overload protection is time-dependent, so a brief inrush can trip a unit that carries a similar steady load without difficulty. Motor starts, and loads with a high crest factor, stress the inverter far more than their RMS figures suggest. The fix is usually on the load side — move the offending load off the UPS, or reassess the rating.',
    },
    {
      q: 'Can I just keep resetting it to stay online?',
      a: 'No. If the cause is overload or overheating, each reset repeats the same event and can cause real damage to the inverter stage. It also leaves the load on bypass and unprotected in the meantime. Find the cause — the log usually states it plainly.',
    },
    {
      q: 'Everything electrical measures normal but it still trips. What am I missing?',
      a: 'Almost certainly heat. A UPS that cannot reject its losses trips the inverter stage with every electrical parameter perfectly normal. Check filters, confirm every fan is actually turning, look at clearances, and log room temperature over a period rather than reading it once. A single failed fan is easy to miss because the unit keeps working until it overheats.',
    },
  ],

  references: [
    'IEC 62040-1 — UPS general and safety requirements',
    'IEC 62040-3 — UPS performance and test requirements, including overload and output characteristics',
    'IEC 62477-1 — safety requirements for power electronic converter systems',
    'The UPS manufacturer\'s documentation for the specific unit, which is the only valid source for overload withstand characteristics, crest factor capability and ambient temperature rating referred to throughout',
  ],
};
