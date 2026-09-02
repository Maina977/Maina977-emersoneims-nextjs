import type { RepairArticle } from '../types';

export const driveThermalDeratingAndCooling: RepairArticle = {
  slug: 'drive-thermal-derating-and-cooling',
  hub: 'industrial-electronics',
  header: {
    title: 'Drive Overheating and Thermal Derating — Why It Trips in the Afternoon',
    equipmentCategory: 'Variable frequency drive',
    appliesTo:
      'Variable frequency drives and soft starters in panel and wall mountings, driving pumps, fans, compressors and conveyors',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Straightforward to confirm, frequently misdiagnosed — a drive that trips on temperature is usually installed wrongly rather than failing',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Drive supply 415 V three-phase 50 Hz nominal; internal DC bus per drive rating',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'A drive that trips on over-temperature in the afternoon and runs happily in the morning is not failing — it is being asked to work above the conditions it was rated for. Every drive carries a continuous rating stated at a reference ambient temperature, a reference altitude and a reference switching frequency, and the manufacturer publishes derating curves for conditions beyond those. The three causes that account for most of these trips are an enclosure that cannot get rid of the heat, a switching frequency raised above the default without derating the drive, and a drive operating a motor at low speed where the motor\'s own fan no longer cools it. Diagnose it by comparing internal enclosure temperature against ambient and against the drive rating, not by replacing the drive. Confirm the cooling path is genuinely working — a blocked filter or a failed fan is the most common single cause and the cheapest to fix.',

  symptoms: {
    display: [
      'Over-temperature or heatsink temperature fault on the drive display',
      'Drive reporting derating active, or reducing output current automatically',
      'Trip codes appearing at a consistent time of day rather than randomly',
      'Ambient or internal temperature warning before the trip itself',
    ],
    indicators: [
      'Drive cooling fan not running, or running intermittently',
      'Enclosure internal temperature markedly above the room',
      'Trip frequency rising through the hot season',
    ],
    sounds: [
      'Drive fan noisy, rattling, or silent when it should be running',
      'Enclosure fan or filter fan not running',
      'Motor running noticeably hot with no change in duty',
    ],
    smells: ['Hot electronics or hot varnish smell inside the panel'],
    behaviour: [
      'Trips in the afternoon and runs fine in the morning — the clearest signature there is',
      'Trips return after a cool-down period and then recur',
      'Trips began after the switching frequency was raised to quieten the motor',
      'Trips began after the panel was relocated, additional equipment was added, or a door seal was fitted',
      'Drive derates and the process slows without ever tripping, which is often not noticed at all',
    ],
    visible: [
      'Blocked or collapsed enclosure filter',
      'Enclosure ventilation openings obstructed by stored items, cable trunking or a wall',
      'Drive fan blades clogged with dust or fibres',
      'Heatsink fins packed with dust, particularly in milling and agricultural environments',
      'Drives mounted too close together, or with insufficient clearance above and below',
      'Drive mounted in a sealed enclosure with no cooling provision at all',
      'Sun falling directly onto the enclosure for part of the day',
    ],
  },

  whatItMeans: {
    plain:
      'A drive turns some of the power passing through it into heat, and that heat has to get out. The manufacturer says how much work the drive can do continuously, but only under stated conditions — a certain room temperature, a certain height above sea level, and certain settings. Change any of those for the worse and the drive can no longer do as much work. It protects itself by reducing output or by tripping. So a drive tripping on temperature is usually telling you about its installation, not about itself.',
    technical:
      'Drive losses are dominated by conduction and switching losses in the output stage, and both end up as heat in the heatsink. The continuous current rating is stated at a reference ambient, altitude and switching frequency, and the manufacturer publishes derating curves for each. Raising switching frequency increases switching losses roughly in proportion, which is why quietening a motor by raising the carrier can push a correctly sized drive into thermal trouble with no change in mechanical load. Altitude reduces air density and therefore convective cooling, and also reduces dielectric strength, so both current and voltage derating may apply. Enclosure thermal performance is the other half: a drive dissipating into a sealed enclosure raises internal air temperature until the drive sees an ambient far above the room, and the drive rating is against the air it actually breathes, not the air in the room. Separately, a motor driven at low speed loses the cooling from its own shaft-mounted fan while still carrying current, so thermal problems can appear at the motor while the drive itself remains within rating.',
  },

  causes: {
    mostLikely: [
      'Enclosure cooling inadequate or failed — blocked filter, failed fan, or a sealed enclosure with no cooling provision',
      'Switching frequency raised above the default to quieten the motor, without applying the corresponding current derating',
      'Ambient temperature higher than the drive rating assumed, especially in an unventilated plant room in the afternoon',
      'Heatsink and drive fan clogged with dust or fibres, so the drive cannot move heat even with a good enclosure',
    ],
    possible: [
      'Drive undersized for the actual load, so it runs near its limit and any additional heat trips it',
      'Insufficient mounting clearance above, below or beside the drive',
      'Motor run continuously at low speed without forced ventilation, overheating the motor rather than the drive',
      'Sun load on the enclosure for part of the day',
      'Multiple drives in one enclosure with the total dissipation never calculated',
    ],
    lessCommon: [
      'Altitude derating not applied at a high-altitude site',
      'Drive fan failed while the enclosure fan still runs, masking the problem until load rises',
      'Temperature sensor or its wiring faulty, reporting a trip that is not real',
      'Thermal interface between the power module and heatsink degraded after a previous repair',
      'Harmonic or supply distortion raising losses beyond the design assumption',
    ],
    modelSpecific: [
      'Continuous rating, reference ambient, reference switching frequency and all derating curves are specific to the drive model — take them from the manufacturer data, never from a similar drive',
      'Some drives derate automatically and silently, so the process slows without any alarm; others trip. Know which yours does.',
      'Permitted mounting clearances and side-by-side mounting rules vary by model and by frame size',
      'Overload capability is stated as a magnitude for a duration and differs between drives; a drive sized on continuous current alone may not deliver the starting overload the load needs',
    ],
    environmental: [
      'High ambient temperature in unventilated plant rooms — a routine and often unmeasured problem',
      'Altitude derating applies across much of the Kenyan highlands and needs checking rather than assuming',
      'Dust and fibre ingress in milling, agricultural, cement and quarry environments',
      'Direct sun on outdoor or wall-mounted enclosures',
      'Seasonal temperature swings producing a fault that appears and disappears with the weather',
    ],
    installation: [
      'Enclosure sized for the components without any thermal calculation',
      'Ventilation openings obstructed by stored items, trunking or proximity to a wall',
      'Filters fitted without any cleaning regime',
      'Drives mounted closer together than the manufacturer permits',
      'Enclosure sealed to keep dust out with no alternative cooling provided — a very common and understandable mistake',
      'No forced ventilation on a motor required to run continuously at low speed',
    ],
    maintenance: [
      'Filters never cleaned or replaced',
      'Fans never checked, so a failed fan is discovered only when the drive trips',
      'Heatsinks never cleaned, particularly in dusty environments',
      'Switching frequency changed at commissioning and never recorded, so nobody knows the drive is derated',
      'Enclosure doors left open to keep things cool, which defeats filtration and admits the dust that causes the next problem',
    ],
    componentLevel: [
      'Drive cooling fan failure',
      'Enclosure fan or filter fan failure',
      'Thermal interface degradation between power module and heatsink',
      'Temperature sensor or wiring fault',
    ],
  },

  safety: {
    isolation: [
      'Isolate the drive supply, lock it and prove dead before opening the enclosure.',
      'Observe the DC-link discharge time in full — drive capacitors hold a lethal charge long after the display has gone out.',
      'Prove the DC bus dead at the manufacturer test points, not by waiting alone.',
      'On a drive fed from a generator or with an alternative supply, confirm all sources are isolated.',
    ],
    lockoutTagout: [
      'Lock and tag the drive supply isolator.',
      'Where the driven machine can be started remotely or automatically, disable and lock that control.',
      'Agree any process outage before starting.',
    ],
    ppe: [
      'Insulated gloves and tools rated above the DC bus voltage',
      'Eye protection, and arc-rated clothing where the fault suggests a power-stage failure',
      'Respiratory protection and eye protection when blowing out dust-laden heatsinks',
      'Heat-resistant gloves where the drive has been running — heatsinks reach temperatures that cause contact burns',
    ],
    storedEnergy: [
      'DC-link capacitors retain a lethal charge after isolation. The discharge time is stated by the manufacturer and is not a suggestion.',
      'A drive that has tripped and gone dark is not discharged.',
      'The motor can generate voltage back into the drive if the load turns it — confirm the driven machine is stationary and cannot be turned by process flow.',
    ],
    specificHazards: [
      'Cleaning a heatsink with compressed air disperses conductive dust through the whole enclosure and into adjacent equipment — extract rather than blow where possible.',
      'A drive that has been derating silently may be running components close to their limits; treat internal surfaces as hot.',
      'Running a drive with the enclosure door open to keep it cool changes the airflow path and can make cooling worse, as well as exposing live parts.',
      'Restoring a blocked filter suddenly increases airflow and can disturb accumulated dust into the drive.',
    ],
    stopAndCallProfessional: [
      'Evidence of a power-stage failure — burning, arcing damage, or a failed module.',
      'The drive trips on temperature with the cooling path proven clear and ambient within rating; that indicates an internal fault.',
      'You cannot establish the drive rating, derating curves or permitted clearances from the manufacturer data.',
      'Enclosure thermal design needs recalculating — that is an engineering task, not a maintenance adjustment.',
      'You are not competent to work at the drive supply voltage or with its stored energy.',
    ],
  },

  tools: [
    { tool: 'Thermal camera', why: 'Shows the actual temperature distribution across the drive, enclosure and motor, which no single-point reading can' },
    { tool: 'Temperature data logger', why: 'Captures the daily profile inside the enclosure — essential when the fault only appears in the afternoon' },
    { tool: 'Anemometer or airflow indicator', why: 'Confirms that cooling air is actually moving rather than that a fan is merely turning' },
    { tool: 'Clamp meter, true-RMS', why: 'Confirms the drive output current against its rating and against the derated figure' },
    { tool: 'Drive manufacturer manual and derating curves', why: 'Continuous rating, reference conditions and every derating factor are model-specific' },
    { tool: 'Insulated tools and a proving unit', why: 'Working safely around a drive with stored energy' },
    { tool: 'Vacuum extraction with appropriate filtration', why: 'Removing conductive dust from heatsinks without dispersing it into the enclosure' },
  ],

  decisionTree: [
    {
      question: 'Does the trip follow a daily pattern — afternoons, hot weather, or after prolonged running?',
      yes: 'This is a thermal capacity problem, not a random fault',
      no: 'Consider a sensor fault or an intermittent electrical cause instead',
    },
    {
      question: 'Is the cooling path clear — filter, enclosure fan, drive fan and heatsink?',
      yes: 'Cooling hardware is intact; look at conditions and settings',
      no: 'Restore the cooling path first. This is the most common cause and the cheapest fix.',
    },
    {
      question: 'Is the enclosure internal temperature within the drive rated ambient?',
      yes: 'Ambient is acceptable; look at settings and loading',
      no: 'The enclosure is the problem — the drive is rated against the air it breathes, not the room',
    },
    {
      question: 'Has the switching frequency been raised above the drive default?',
      yes: 'Apply the manufacturer derating, or lower it — raising the carrier without derating is a very common cause',
      no: 'Continue',
    },
    {
      question: 'Is the drive output current within the rating for the actual ambient, altitude and switching frequency?',
      yes: 'The drive is not overloaded; the fault is cooling or internal',
      no: 'The drive is undersized for these conditions — derate the application or fit a larger drive',
    },
    {
      question: 'Does the motor run at low speed for long periods?',
      yes: 'Check the motor temperature too — its own fan is not cooling it at low speed',
      no: 'Focus on the drive and enclosure',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Read the fault history before touching anything',
      inspect: 'The drive fault log — codes, times and any recorded temperature at trip',
      where: 'Drive display or configuration software',
      instrument: 'The drive itself',
      expected: 'A pattern: trips clustered at particular times of day, or after a particular running duration',
      ifAbnormal:
        'A clear daily pattern confirms a thermal capacity problem. Random trips with no pattern suggest a sensor or electrical fault instead.',
      next: 'Note whether the drive has been derating without tripping — many drives log this and nobody looks',
      verify: 'Fault code meanings are model-specific; take them from the manual rather than assuming',
    },
    {
      step: 2,
      title: 'Measure the air the drive actually breathes',
      inspect: 'Internal enclosure air temperature at the drive intake, and room ambient, at the worst time of day',
      where: 'At the drive air intake, and outside the enclosure',
      instrument: 'Temperature logger left in place for at least a full day',
      expected:
        'Internal temperature within the drive rated ambient, with a modest rise above room temperature',
      ifAbnormal:
        'A large rise between room and enclosure means the enclosure cannot reject the heat being put into it',
      next: 'Log across a full day rather than taking a spot reading — the fault is in the afternoon and so is the evidence',
      verify:
        'The drive rated ambient is in the manufacturer data, and it refers to the air at the drive, not to the room',
    },
    {
      step: 3,
      title: 'Prove the cooling path is actually working',
      inspect: 'Filter condition, enclosure fan operation, drive fan operation, heatsink cleanliness and clearances',
      where: 'Throughout the enclosure',
      instrument: 'Visual, anemometer or airflow indicator, thermal camera',
      expected:
        'Clean filter, fans running and moving air, heatsink fins clear, clearances as the manufacturer specifies',
      ifAbnormal:
        'A blocked filter or failed fan is the most common single cause. A fan that spins but moves no air because of a blocked path is just as bad and less obvious.',
      next: 'Check that ventilation openings are not obstructed outside the enclosure as well as inside',
      warning:
        'Isolate and prove the DC bus dead before reaching into the enclosure. A tripped drive is not a discharged drive.',
    },
    {
      step: 4,
      title: 'Thermal-scan the drive and enclosure under load',
      inspect: 'Temperature distribution across drive, enclosure and adjacent equipment',
      where: 'Whole enclosure, with the system running at normal duty',
      instrument: 'Thermal camera',
      expected: 'Even temperatures with no hot spots, and heat clearly moving to the exhaust path',
      ifAbnormal:
        'A hot drive with a cool exhaust means the air is not passing over the heatsink. Hot adjacent equipment means the enclosure is recirculating rather than exchanging.',
      next: 'Include the motor in the scan — thermal problems often appear there rather than at the drive',
      warning:
        'Scan with the enclosure in its normal configuration. Opening the door changes the airflow and invalidates the reading.',
    },
    {
      step: 5,
      title: 'Check the switching frequency setting against the derating',
      inspect: 'Configured switching frequency versus the drive default',
      where: 'Drive parameters',
      instrument: 'Drive display or configuration software, plus the manufacturer derating curve',
      expected:
        'Either the default frequency, or a raised frequency with the corresponding current derating applied to the sizing',
      ifAbnormal:
        'A raised carrier with no derating is a very common cause. Someone raised it to quieten the motor and the drive lost capacity it needed.',
      next: 'Either lower it, or confirm the drive is large enough for the derated rating at that frequency',
      verify:
        'The derating factor for switching frequency is a published curve for the specific drive — read it rather than estimating',
    },
    {
      step: 6,
      title: 'Compare actual output current against the derated rating',
      inspect: 'Drive output current under normal duty, against the rating for actual ambient, altitude and switching frequency',
      where: 'Drive output',
      instrument: 'True-RMS clamp meter, and the drive\'s own current reading',
      expected: 'Output current comfortably within the derated continuous rating, with headroom for the load\'s overload demand',
      ifAbnormal:
        'Running at or near the derated limit means any additional heat trips it — the drive is effectively undersized for these conditions',
      next: 'Consider whether the load has grown since installation, which is common and rarely recorded',
      verify:
        'Apply every applicable derating factor together — ambient, altitude and switching frequency compound',
    },
    {
      step: 7,
      title: 'Check the motor if it runs at low speed',
      inspect: 'Motor temperature during sustained low-speed operation',
      where: 'Motor frame and bearing housings',
      instrument: 'Thermal camera or infrared thermometer',
      expected: 'Motor temperature within its insulation class rating for the duty',
      ifAbnormal:
        'A motor running hot at low speed has lost the cooling from its own shaft fan while still carrying current — it needs forced ventilation, not a bigger drive',
      next: 'This is a separate problem from drive overheating and is frequently confused with it',
      verify: 'The motor duty rating for variable-speed operation is in the motor manufacturer data',
    },
    {
      step: 8,
      title: 'Verify the fix across a full daily cycle',
      inspect: 'Enclosure and drive temperature through the hottest part of the day, after the correction',
      where: 'At the drive intake and on the heatsink',
      instrument: 'Temperature logger left for several days',
      expected:
        'Internal temperature staying within the drive rating through the daily peak, with no derating recorded and no trips',
      ifAbnormal:
        'A fix that holds in the morning and fails in the afternoon has not been verified — the test must span the conditions that caused the fault',
      next: 'Record the peak internal temperature achieved as the new baseline',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Restoring the cooling path',
      steps: [
        'Clean or replace enclosure filters, and establish a cleaning interval matched to the environment.',
        'Clean heatsink fins using extraction rather than compressed air where possible, to avoid dispersing conductive dust through the enclosure.',
        'Replace failed drive and enclosure fans with the correct parts; a fan that spins slowly is as bad as one that has stopped.',
        'Clear obstructions from ventilation openings, inside and outside the enclosure.',
        'Restore the manufacturer mounting clearances if drives have been mounted too closely.',
      ],
      note:
        'A blocked filter or a failed fan is the most common cause of drive over-temperature and the cheapest thing on this list to put right.',
    },
    {
      level: 'configuration',
      title: 'Settings that cost you capacity',
      steps: [
        'Return the switching frequency to the drive default unless there is a specific reason for it to be higher.',
        'Where a higher frequency is genuinely needed, apply the manufacturer derating and confirm the drive is still adequately sized.',
        'Record any non-default switching frequency on the drive and in the site file, so the derating is not forgotten.',
        'Enable and configure any automatic derating or thermal warning the drive provides, so the condition is visible before it trips.',
        'Check that the drive is configured for the correct motor and load type, since incorrect settings raise losses.',
      ],
    },
    {
      level: 'mechanical',
      title: 'Enclosure and installation correction',
      steps: [
        'Calculate the total heat dissipated by everything in the enclosure and provide cooling to match — this is an engineering calculation, not a guess.',
        'Fit enclosure cooling appropriate to the environment: filtered ventilation where the air is clean enough, a heat exchanger or cooling unit where it is not.',
        'Shade or relocate enclosures exposed to direct sun.',
        'Provide forced ventilation for motors required to run continuously at low speed.',
        'Where the enclosure was sealed to exclude dust, provide a closed-loop cooling method rather than accepting the heat.',
      ],
      note:
        'Sealing an enclosure against dust without adding cooling is a very common and understandable mistake. The dust problem is solved and a thermal problem is created.',
    },
    {
      level: 'component-replacement',
      title: 'When the drive itself is at fault or inadequate',
      steps: [
        'Replace failed temperature sensors and their wiring where the trip is proven false.',
        'Where the drive is genuinely undersized for the conditions after all corrections, fit a larger drive rather than continuing to derate the process.',
        'Where a previous repair disturbed the thermal interface between power module and heatsink, that interface must be restored correctly.',
        'Confirm the replacement is rated for the actual ambient and altitude, not the reference conditions.',
      ],
    },
  ],

  validation: [
    'Enclosure internal temperature at the drive intake within the drive rated ambient through the daily peak',
    'All cooling fans running and moving air, confirmed rather than assumed',
    'Filters clean and on a recorded cleaning interval',
    'Drive output current within the rating derated for actual ambient, altitude and switching frequency',
    'No derating events or thermal warnings logged across several days of normal operation',
    'Motor temperature within rating during sustained low-speed running, where applicable',
    'Peak internal temperature recorded as the baseline for future comparison',
  ],

  whenNotToRepair: [
    'Power-stage failure with arcing or burning damage — that is a drive replacement, not a cooling correction',
    'A drive that trips on temperature with the cooling path proven clear and ambient within rating — that is an internal fault',
    'Drives so undersized for the load and conditions that derating would compromise the process',
    'Enclosures whose thermal design cannot be corrected within the space available — that needs engineering, not maintenance',
    'Obsolete drives where cooling fans and filters are no longer obtainable',
  ],

  prevention: [
    'Clean filters and heatsinks on an interval matched to the environment, not on failure',
    'Log enclosure internal temperature periodically, particularly through the hot season',
    'Record the switching frequency and any applied derating on the drive and in the site file',
    'Calculate enclosure heat load whenever equipment is added to an existing panel',
    'Check fans as a routine item, because a failed fan is silent until the drive trips',
    'Never seal an enclosure against dust without providing an alternative cooling method',
    'Fit forced ventilation to motors that will run continuously at low speed, at installation rather than after the failure',
    'Keep ventilation openings clear and brief site staff not to store items against enclosures',
  ],

  relatedSlugs: [
    'vfd-drive-fault-diagnosis',
    'motor-overload-tripping',
    'three-phase-motor-failure-diagnosis',
    'motor-bearing-failure-diagnosis',
  ],

  faq: [
    {
      q: 'Why does the drive only trip in the afternoon?',
      a: 'Because that is when the enclosure is hottest. The drive is rated against the temperature of the air it actually breathes, and by mid-afternoon the room is warm, the enclosure has been accumulating heat all day, and the sun may be on it. The morning gives it enough margin; the afternoon does not.',
    },
    {
      q: 'We raised the switching frequency to stop the motor whining and now it trips. Why?',
      a: 'Raising the switching frequency increases the drive\'s internal losses, so the manufacturer derates its continuous current accordingly. A drive that was correctly sized at the default frequency may be undersized at a higher one, with no change to the mechanical load at all. Either return to the default or check the derating curve and confirm the drive is still large enough.',
    },
    {
      q: 'Can I just open the panel door to keep it cool?',
      a: 'No. It exposes live parts, it defeats any filtration so dust gets in, and it often makes cooling worse by disrupting the designed airflow path. If the enclosure cannot reject the heat, the cooling needs correcting properly.',
    },
    {
      q: 'The drive is not tripping but the process has got slower. Is that related?',
      a: 'Very possibly. Many drives derate automatically before they trip, reducing output current silently. The process slows, nobody gets an alarm, and the underlying thermal problem goes unnoticed for months. Check the drive log for derating events.',
    },
    {
      q: 'The motor is overheating but the drive is fine. Is that the same problem?',
      a: 'No, and it is often confused with it. A motor driven at low speed loses the cooling from its own shaft-mounted fan while still carrying current. That needs forced ventilation on the motor, not a larger drive.',
    },
    {
      q: 'Does altitude really matter in Kenya?',
      a: 'Yes, across much of the highlands. Thinner air carries away less heat and also has lower dielectric strength, so manufacturers publish altitude derating for both current and, above certain heights, voltage. It is worth checking rather than assuming, because a drive correctly sized at sea level may not be correct at 2,000 metres.',
    },
  ],

  references: [
    'Drive manufacturer manual — continuous rating, reference ambient, reference switching frequency, and derating curves for ambient, altitude and switching frequency',
    'Drive manufacturer mounting and clearance requirements for the frame size fitted',
    'Motor manufacturer data for variable-speed duty and any forced-ventilation requirement',
    'Enclosure manufacturer thermal data and cooling unit selection guidance',
    'IEC 61800-2 — adjustable speed electrical power drive systems: general requirements and ratings',
    'IEC 60529 — degrees of protection provided by enclosures (IP code)',
    'Site panel schedule and any enclosure heat-load calculation from the original design',
  ],
};
