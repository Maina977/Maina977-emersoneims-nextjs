import type { RepairArticle } from '../types';

export const driveCapacitorAgeingAndStorage: RepairArticle = {
  slug: 'drive-capacitor-ageing-and-storage',
  hub: 'industrial-electronics',
  header: {
    title: 'DC Bus Capacitor Ageing and Reforming — Drives That Sat Too Long',
    equipmentCategory: 'Variable frequency drive',
    appliesTo:
      'Variable frequency drives, soft starters, inverters and UPS units using electrolytic DC-link capacitors, in service or held as spares',
    difficulty: 'advanced',
    diagnosisComplexity:
      'The ageing itself is gradual and easy to miss; the damage happens in the seconds after a long-stored drive is energised without preparation',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Drive supply 415 V three-phase 50 Hz nominal; DC bus per drive rating',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'Electrolytic DC-link capacitors age in service and degrade further when stored without voltage, because the oxide layer that forms their dielectric slowly dissolves when it is not maintained by an applied voltage. A drive that has sat unpowered for a long period can therefore fail on the first energisation, sometimes violently, even though it was working when it was put away. The symptoms of ageing in service are a rising DC bus ripple, over-voltage or under-voltage trips that were not there before, a bulging or vented capacitor can, and a drive that becomes intolerant of supply disturbances it used to ride through. The action for a stored drive is reforming — applying voltage gradually through a current-limited source so the oxide layer rebuilds before full energisation. The storage interval beyond which reforming is required, and the reforming procedure itself, are specific to the manufacturer and must be taken from their documentation. The most important discipline is simply not to switch on a long-stored drive to see whether it still works.',

  symptoms: {
    display: [
      'DC bus over-voltage or under-voltage trips that were not previously occurring',
      'Drive tripping on supply disturbances it used to tolerate',
      'DC bus voltage reading unstable or with visible ripple where the drive reports it',
      'Precharge or soft-charge fault at power-up',
    ],
    indicators: [
      'Drive taking longer to charge at power-up than it used to',
      'Fault frequency increasing gradually over months rather than appearing suddenly',
    ],
    sounds: [
      'Mains-frequency hum from the drive that was not previously present',
      'A loud report at energisation, which indicates a capacitor has failed — isolate immediately',
    ],
    smells: [
      'Sharp, fishy or acrid smell from a vented electrolytic capacitor',
      'Burnt smell after energising a long-stored drive',
    ],
    behaviour: [
      'Drive stored for a long period and failed on first energisation',
      'Performance degrading gradually across a season rather than failing outright',
      'Drive becoming sensitive to supply dips that other equipment on the same board rides through',
      'Trips clustering around times of poor supply quality',
    ],
    visible: [
      'Capacitor can bulging at the top, with the safety score deformed',
      'Vent opened, with dried electrolyte residue around it',
      'Electrolyte leakage onto the board beneath the capacitor',
      'Discolouration of the sleeve or the board around the capacitor',
      'Corrosion at the capacitor terminals',
      'Date codes indicating capacitors well beyond their expected service life',
    ],
  },

  whatItMeans: {
    plain:
      'A drive stores energy in large capacitors, and those capacitors rely on an extremely thin chemical layer inside them to work. That layer is maintained by having voltage applied. If the drive sits switched off for a long time — in a store, or as a spare, or on a plant that stopped running — the layer slowly breaks down. Switch such a drive straight on and a large current can flow where it should not, which can destroy the capacitor and sometimes make it burst. The layer can usually be rebuilt by applying voltage gently and gradually first, which is called reforming.',
    technical:
      'An aluminium electrolytic capacitor uses an anodised oxide film as its dielectric, formed and maintained electrochemically by the applied voltage. Without applied voltage the film gradually dissolves into the electrolyte, and leakage current on re-energisation rises accordingly. Applying full voltage abruptly to a capacitor with a degraded film drives a large reforming current through it, causing rapid internal heating, gas generation and potentially vent operation or rupture. Reforming applies voltage progressively through a current-limiting source, allowing the film to rebuild at a controlled rate. Separately, in normal service the capacitor ages by electrolyte loss through the seal, a process strongly accelerated by temperature; the consequences are falling capacitance and rising equivalent series resistance, which show as increased DC bus ripple, reduced ride-through of supply dips, and additional self-heating that accelerates the process further. Both mechanisms end at the same place, and both are predictable rather than random.',
  },

  causes: {
    mostLikely: [
      'Drive or spare stored unpowered beyond the manufacturer reforming interval, then energised without preparation',
      'Normal end-of-life electrolyte loss in a drive that has run for many years',
      'Service life shortened by high ambient temperature, which is the dominant accelerating factor',
      'Cooling deficiency raising internal temperature and ageing the capacitors prematurely',
    ],
    possible: [
      'Plant shut down for an extended period with drives left unpowered and then restarted en masse',
      'Supply quality problems imposing repeated ripple current stress',
      'Precharge circuit failure, subjecting capacitors to repeated inrush',
      'Cooling fan failure raising internal temperature over a long period',
    ],
    lessCommon: [
      'Counterfeit or out-of-specification replacement capacitors fitted at a previous repair',
      'Capacitors of the correct value but inadequate ripple current rating',
      'Mechanical damage to the capacitor or its terminals during previous work',
      'Manufacturing defect in a specific batch',
    ],
    modelSpecific: [
      'The storage interval beyond which reforming is required is stated by the drive manufacturer and varies widely — take it from their documentation',
      'The reforming procedure, including voltage steps and durations, is manufacturer-specific and must be followed rather than improvised',
      'Expected capacitor service life is stated by the manufacturer at a reference temperature, and the actual life depends heavily on the temperature the drive has experienced',
      'Some drives include capacitor condition monitoring or a service-life estimate in their diagnostics; check whether yours does',
    ],
    environmental: [
      'High ambient temperature, which shortens electrolytic capacitor life more than any other factor',
      'Unventilated plant rooms and enclosures running hot for years',
      'Humidity and corrosive atmospheres attacking terminals and seals',
      'Sites with poor supply quality imposing continuous additional ripple stress',
      'Seasonal or project plant that stands idle for months at a time',
    ],
    installation: [
      'Drive installed in an enclosure that runs hot, aging capacitors from the day of commissioning',
      'Poor supply quality never addressed',
      'Drives specified without regard to the ambient they would actually experience',
      'Spares stored in a hot store rather than a cool dry one',
    ],
    maintenance: [
      'Spares held for years without any reforming programme',
      'No record of drive age or capacitor replacement, so end of life is never anticipated',
      'Cooling faults left unresolved, quietly shortening capacitor life',
      'A long-stored drive energised directly to test it, which is how most of these failures happen',
      'Standby plant with drives never exercised',
    ],
    componentLevel: [
      'Oxide film degradation from storage without applied voltage',
      'Electrolyte loss through the seal from thermal ageing',
      'Rising equivalent series resistance causing additional self-heating',
      'Vent operation or rupture on abrupt energisation',
      'Precharge resistor or contactor failure exposing capacitors to inrush',
    ],
  },

  safety: {
    isolation: [
      'Isolate the drive supply, lock it and prove dead before opening anything.',
      'Observe the manufacturer DC-link discharge time in full, then prove the bus dead at the designated test points. This is the highest-risk stored energy in most industrial panels.',
      'Never assume a drive that has been off for days is discharged — a failed bleed resistor leaves the bus charged indefinitely.',
      'Discharge only through an appropriate resistive method if the bus is found charged; never short it with a tool.',
    ],
    lockoutTagout: [
      'Lock and tag the drive supply isolator.',
      'Disable and lock any remote or automatic start.',
      'Where several drives share a supply, tag the ones remaining live.',
    ],
    ppe: [
      'Insulated gloves and tools rated above the DC bus voltage',
      'Eye protection and a face shield when energising a drive whose capacitor condition is unknown — a rupturing capacitor ejects material with force',
      'Arc-rated clothing where capacitor failure is suspected',
      'Nitrile gloves when handling capacitors that have vented; the electrolyte is an irritant',
    ],
    storedEnergy: [
      'DC-link capacitors hold a lethal charge. This is the single most dangerous aspect of drive work and the discharge time is not negotiable.',
      'A drive with a failed bleed resistor can remain charged for an extended and unpredictable period.',
      'Always prove the bus dead at the test points, with a meter you have proved before and after.',
      'A stored spare drive can hold residual charge from its last energisation.',
    ],
    specificHazards: [
      'An aged electrolytic capacitor energised abruptly can vent or rupture, ejecting hot electrolyte and casing material. Stand clear and use eye and face protection when energising a drive of unknown storage history.',
      'Never energise a long-stored drive simply to see whether it works. That is the action that causes most of these failures.',
      'Vented electrolyte is an irritant to skin, eyes and airways, and contaminates the board beneath.',
      'A drive that has failed on energisation may have damaged its rectifier or output stage as well; do not re-energise to confirm.',
    ],
    stopAndCallProfessional: [
      'A capacitor has vented or ruptured — isolate, do not re-energise, and have the drive assessed.',
      'You cannot obtain the manufacturer reforming procedure for a long-stored drive.',
      'You do not have a current-limited source suitable for reforming.',
      'The DC bus is found charged after the full discharge time, indicating a failed bleed path.',
      'The drive is under warranty.',
      'You are not trained on the stored-energy hazards of drive equipment.',
    ],
  },

  tools: [
    { tool: 'Insulated tools and a meter proved before and after use', why: 'Proving the DC bus dead is the first and most important step of every job on a drive' },
    { tool: 'Variable current-limited source suitable for reforming', why: 'Reforming requires voltage applied progressively with the current limited; without it, do not attempt the procedure' },
    { tool: 'Oscilloscope', why: 'DC bus ripple is the practical indicator of capacitor condition in service, and a multimeter cannot show it' },
    { tool: 'ESR meter', why: 'Rising equivalent series resistance is the earliest measurable sign of electrolyte loss' },
    { tool: 'Capacitance meter suitable for the values involved', why: 'Falling capacitance confirms ageing where a capacitor can be measured out of circuit' },
    { tool: 'Thermal camera', why: 'Finds capacitors running hot, which both indicates and accelerates ageing' },
    { tool: 'Manufacturer documentation for the drive', why: 'Storage interval, reforming procedure and expected service life are all model-specific' },
    { tool: 'Eye and face protection', why: 'Energising a drive of unknown capacitor condition carries a genuine rupture risk' },
  ],

  decisionTree: [
    {
      question: 'Has the drive been stored or unpowered beyond the manufacturer stated interval?',
      yes: 'Do not energise it. Reform first, following the manufacturer procedure.',
      no: 'Continue with in-service assessment',
    },
    {
      question: 'Is there any visible bulging, venting, leakage or discolouration at a capacitor?',
      yes: 'The capacitor has failed. Replace it, and establish why — usually temperature.',
      no: 'Continue with measurement',
    },
    {
      question: 'Is DC bus ripple higher than it should be for the load?',
      yes: 'Capacitor degradation is likely — measure further and plan replacement',
      no: 'Capacitors are probably serviceable; look elsewhere for the fault',
    },
    {
      question: 'Is the drive tripping on supply disturbances it used to ride through?',
      yes: 'Loss of capacitance has reduced its ride-through — a classic ageing signature',
      no: 'Continue',
    },
    {
      question: 'Is the drive within its expected capacitor service life for the temperature it has actually experienced?',
      yes: 'Investigate other causes before condemning capacitors',
      no: 'Plan capacitor replacement or drive replacement as a scheduled activity rather than waiting for failure',
    },
    {
      question: 'Is the enclosure running hot?',
      yes: 'Correct the cooling first, or replacement capacitors will age just as fast',
      no: 'Proceed with replacement planning',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the drive history before energising anything',
      inspect: 'How long the drive has been unpowered, and under what storage conditions',
      where: 'Site records, store records, or the plant history',
      instrument: 'Records and questions',
      expected: 'A known period, comfortably within the manufacturer storage interval',
      ifAbnormal:
        'An unknown or long storage period means the drive must be reformed before energisation, not tested by switching it on',
      next: 'Where records do not exist, treat the storage period as long and reform',
      verify:
        'The interval beyond which reforming is required is stated by the drive manufacturer and varies widely between makes',
      warning:
        'Energising a long-stored drive to see whether it works is the single most common cause of these failures, and it can be violent.',
    },
    {
      step: 2,
      title: 'Inspect the capacitors visually, isolated and proved dead',
      inspect: 'Capacitor cans, vents, terminals and the board beneath',
      where: 'Inside the drive',
      instrument: 'Visual, with good light',
      expected: 'Flat can tops, intact vents, no residue, no discolouration on the board',
      ifAbnormal:
        'A bulging top means the vent has begun to operate. Residue around the vent means it has operated. Either way the capacitor is finished.',
      next: 'Note the date codes — they establish the age against the manufacturer expected life',
      warning:
        'Prove the DC bus dead at the manufacturer test points before reaching in. Do not rely on elapsed time alone; a failed bleed resistor leaves the bus charged.',
    },
    {
      step: 3,
      title: 'Measure DC bus ripple under load',
      inspect: 'Ripple on the DC bus with the drive running at representative load',
      where: 'At the DC bus measurement points the manufacturer designates',
      instrument: 'Oscilloscope with an appropriately rated probe',
      expected: 'Ripple low and consistent with the load, and consistent with earlier records if any exist',
      ifAbnormal:
        'Ripple substantially higher than expected for the load indicates lost capacitance or risen equivalent series resistance',
      next: 'Compare against a sister drive on the same duty where one exists — comparison is more reliable than an absolute figure',
      warning:
        'Measuring a live DC bus is hazardous. Use a probe rated for the voltage and follow the manufacturer measurement points; do not improvise a connection.',
    },
    {
      step: 4,
      title: 'Assess ride-through behaviour',
      inspect: 'Whether the drive trips on supply dips that it previously tolerated, or that sister drives tolerate',
      where: 'The drive fault log and the site supply history',
      instrument: 'Drive fault log, and power quality records where they exist',
      expected: 'Ride-through consistent with the drive specification and with its own history',
      ifAbnormal:
        'A drive that has become intolerant of dips has lost stored energy capability — a direct consequence of falling capacitance',
      next: 'This is often the first operational symptom noticed, and it is frequently blamed on the supply rather than the drive',
    },
    {
      step: 5,
      title: 'Assess the thermal history',
      inspect: 'Enclosure and drive operating temperature, and cooling condition',
      where: 'The installation',
      instrument: 'Thermal camera and temperature logger',
      expected: 'Operating temperature within the drive rating',
      ifAbnormal:
        'A drive that has run hot for years has capacitors well short of their rated life, and replacements will age just as quickly unless the cooling is corrected',
      next: 'Correct cooling as part of any capacitor replacement, not afterwards',
      verify: 'Expected capacitor life is quoted at a reference temperature in the manufacturer data',
    },
    {
      step: 6,
      title: 'Reform a long-stored drive before energising it',
      inspect: 'Progressive application of voltage with current limited, per the manufacturer procedure',
      where: 'Bench or a controlled area, with the drive isolated from the installation',
      instrument: 'Variable current-limited source',
      expected:
        'Leakage current falling progressively as the oxide film rebuilds, following the manufacturer voltage steps and durations',
      ifAbnormal:
        'Leakage that does not fall, or a capacitor that heats during reforming, means the capacitor is beyond recovery',
      next: 'Only energise normally once reforming is complete per the procedure',
      verify:
        'The reforming procedure is manufacturer-specific. Do not improvise voltage steps or durations.',
      warning:
        'Eye and face protection during reforming and first energisation. Stand clear. A capacitor that fails during this process can rupture.',
    },
    {
      step: 7,
      title: 'Check the precharge circuit',
      inspect: 'Precharge resistors and contactor or relay operation at power-up',
      where: 'The drive input stage',
      instrument: 'Visual, resistance measurement with the drive isolated and proved dead',
      expected: 'Precharge resistors intact and within specification, precharge contactor operating and then bypassing correctly',
      ifAbnormal:
        'A failed precharge circuit exposes the capacitors to full inrush on every power-up, which ages them rapidly and can destroy them outright',
      next: 'Repair the precharge circuit before returning the drive to service, or the capacitors fail again',
    },
    {
      step: 8,
      title: 'Verify after replacement under real conditions',
      inspect: 'DC bus ripple, charge time at power-up, ride-through and capacitor temperature under load',
      where: 'The drive in its working position',
      instrument: 'Oscilloscope and thermal camera',
      expected:
        'Ripple low, charge time normal, ride-through restored, and capacitors running at a temperature consistent with a corrected enclosure',
      ifAbnormal:
        'Capacitors running hot after replacement means the cooling problem was not corrected and the new parts are already ageing prematurely',
      next: 'Record the replacement date and the measured baseline so the next end of life is anticipated',
    },
  ],

  repair: [
    {
      level: 'component-replacement',
      title: 'Capacitor replacement',
      steps: [
        'Replace with capacitors matching capacitance, voltage rating, ripple current rating, temperature rating and physical size. Ripple current rating is the specification most often overlooked and the one that decides service life.',
        'Replace all DC-link capacitors as a set, not individually — mixing aged and new capacitors in a bank leaves the new ones carrying uneven stress.',
        'Observe polarity absolutely. A reversed electrolytic capacitor will fail violently on energisation.',
        'Source from reputable supply. Counterfeit capacitors are common, look identical, and fail early.',
        'Reform new capacitors if they have themselves been in storage for an extended period.',
        'Clean any electrolyte residue from the board thoroughly, since it is corrosive and conductive.',
      ],
      note:
        'Fitting the correct value with an inadequate ripple current rating produces a repair that fails within a fraction of the expected life.',
    },
    {
      level: 'configuration',
      title: 'Reforming stored drives and spares',
      steps: [
        'Establish the manufacturer storage interval for every drive model held as a spare.',
        'Reform on a schedule rather than waiting until a spare is needed in an emergency.',
        'Follow the manufacturer voltage steps and durations exactly; an improvised procedure is not reforming.',
        'Record the reforming date on the drive and in the store record.',
        'Where a plant is shut down for an extended period, energise the drives periodically rather than leaving them all unpowered.',
      ],
      note:
        'A spare drive that has never been reformed is not a spare. It is an unknown, and its condition is discovered during the breakdown it was bought for.',
    },
    {
      level: 'mechanical',
      title: 'Correcting the cause — temperature',
      steps: [
        'Correct enclosure cooling before or during capacitor replacement, since temperature is the dominant factor in capacitor life.',
        'Clean or replace filters and fans, and clear heatsinks.',
        'Reassess enclosure heat load where equipment has been added since installation.',
        'Where ambient cannot be reduced, factor the reduced capacitor life into the maintenance plan rather than being surprised by it.',
      ],
    },
    {
      level: 'board-level',
      title: 'Precharge circuit repair',
      steps: [
        'Replace failed precharge resistors with parts of correct value and power rating.',
        'Replace a precharge contactor or relay that fails to bypass, since the resistors will otherwise overheat.',
        'Establish why the precharge circuit failed — repeated rapid power cycling is a common cause and is an operational fix rather than a component one.',
      ],
    },
  ],

  validation: [
    'DC bus ripple low and consistent with the load, recorded as a new baseline',
    'Normal charge time at power-up',
    'Ride-through restored on supply dips that previously caused trips',
    'Capacitor temperature under load consistent with a corrected enclosure',
    'No bulging, venting or leakage after a period of normal running',
    'Reforming date recorded for stored spares, and replacement date recorded for the drive',
    'Cooling correction verified across a full daily temperature cycle',
  ],

  whenNotToRepair: [
    'Capacitors that have vented or ruptured, where electrolyte has reached the board and the surrounding circuitry',
    'Drives where the rectifier or output stage was damaged in the same failure',
    'Obsolete drives where correct-specification capacitors are unobtainable — a substitute of inadequate ripple rating is not a repair',
    'Drives at or beyond their overall expected service life, where capacitor replacement extends only one of several ageing subsystems',
    'Any drive where the enclosure temperature cannot be corrected, since replacements will age just as fast',
    'Safety-critical applications where a rebuilt drive of uncertain remaining life is not acceptable',
  ],

  prevention: [
    'Keep a reforming schedule for every stored spare drive, based on each manufacturer stated interval',
    'Record drive installation dates and capacitor replacement dates so end of life is planned rather than discovered',
    'Control enclosure temperature — it is the single largest factor in how long the capacitors last',
    'Energise drives periodically on plant that stands idle for extended periods',
    'Monitor DC bus ripple during scheduled maintenance on critical drives, and trend it',
    'Address supply quality problems rather than accepting the continuous stress they impose',
    'Store spare drives in a cool, dry place, not in a hot store or container',
    'Never energise a long-stored drive to test it — reform it first',
  ],

  relatedSlugs: [
    'vfd-drive-fault-diagnosis',
    'drive-thermal-derating-and-cooling',
    'solar-inverter-dc-bus-fault',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'We have a spare drive that has been on the shelf for years. Can I just fit it?',
      a: 'No. Energising it directly is how spare drives are destroyed, sometimes violently. The capacitors need reforming first — voltage applied progressively through a current-limited source, following the manufacturer procedure. A spare that has never been reformed is an unknown rather than a spare.',
    },
    {
      q: 'Why do capacitors degrade when the drive is switched off?',
      a: 'Their dielectric is an extremely thin oxide film that is maintained electrochemically by the applied voltage. With no voltage, the film slowly dissolves. Apply full voltage abruptly afterwards and a large current flows to rebuild it all at once, which overheats the capacitor and can rupture it.',
    },
    {
      q: 'How long do drive capacitors last?',
      a: 'The manufacturer states an expected life at a reference temperature, and the actual life depends heavily on how hot the drive has run. A drive in a hot enclosure reaches end of life far sooner than the headline figure. Go by installation date, operating temperature and measured ripple rather than by the number alone.',
    },
    {
      q: 'The drive now trips on supply dips it used to ride through. Is that the capacitors?',
      a: 'Very likely. Ride-through depends on the energy stored in the DC-link capacitors, so as capacitance falls the drive loses its ability to bridge a dip. It is often the first symptom noticed, and it is frequently blamed on the supply rather than on the drive.',
    },
    {
      q: 'Can I replace just the one bulging capacitor?',
      a: 'Replace the bank as a set. The others have experienced the same temperature and hours, and a new capacitor alongside aged ones carries uneven stress. Fitting one and leaving the rest usually means another visit shortly afterwards.',
    },
    {
      q: 'Is capacitance the only specification that matters on a replacement?',
      a: 'No, and ripple current rating is the one most often overlooked. A capacitor of correct capacitance and voltage but inadequate ripple current rating will run hot and fail in a fraction of the expected life. Match capacitance, voltage, ripple current, temperature rating and physical size.',
    },
  ],

  references: [
    'Drive manufacturer manual — storage interval before reforming is required, the reforming procedure, DC-link discharge time and designated measurement points',
    'Drive manufacturer expected capacitor service life at the stated reference temperature',
    'Capacitor manufacturer datasheet — capacitance, voltage, ripple current rating, temperature rating and expected life',
    'Site records of drive installation dates, capacitor replacements and store reforming schedule',
    'IEC 61800-2 — adjustable speed electrical power drive systems: general requirements and ratings',
    'IEC 60384 series — fixed capacitors for use in electronic equipment',
  ],
};
