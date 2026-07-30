import type { RepairArticle } from '../types';

export const inverterOverheatingDiagnosis: RepairArticle = {
  slug: 'inverter-overheating-diagnosis',
  hub: 'inverters',
  header: {
    title: 'Inverter Overheating — Derating, Shutdowns and the Cabinet Nobody Ventilated',
    equipmentCategory: 'Inverter',
    appliesTo:
      'Off-grid, hybrid and grid-tied inverters, wall and rack mounted, in cabinets, plant rooms and containerised installations',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Easy to confirm and easy to misattribute — an inverter shutting down on temperature is usually installed wrongly or loaded beyond its continuous rating rather than failing',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'AC output 240 V single-phase or 415 V three-phase 50 Hz nominal; DC battery or PV input per system design',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'An inverter that shuts down in the afternoon and runs all morning is not usually failing — it is being asked to work above the conditions it was rated for, or it cannot get rid of the heat it makes. Every inverter has a continuous output rating stated at a reference ambient temperature, and a separate, higher surge rating for short periods. Loading it continuously at its surge figure, or installing it in a sealed cabinet, produces exactly this symptom. Diagnose it by comparing the air temperature at the inverter intake against the manufacturer rated ambient, confirming the cooling path is genuinely clear, and measuring the actual continuous load against the continuous rating rather than the headline number on the box. Most of these faults are a blocked filter, a failed fan, a cabinet with no ventilation, or a load that has grown since installation. Genuine inverter failure is the least likely of the five and should be concluded last.',

  symptoms: {
    display: [
      'Over-temperature fault or heatsink temperature alarm',
      'Inverter reporting derating active, or reducing output power automatically',
      'Shutdowns clustered at a particular time of day rather than random',
      'Temperature warning shown before the shutdown itself',
    ],
    indicators: [
      'Cooling fan not running, or running only intermittently',
      'Cabinet internal temperature markedly above the room',
      'Shutdown frequency rising through the hot season',
      'Inverter hot to the touch on its casing where it previously was not',
    ],
    sounds: [
      'Fan noisy, rattling, or silent when it should be running',
      'Fan running continuously at full speed where it previously cycled',
      'Transformer hum louder than usual under load',
    ],
    smells: [
      'Hot electronics or hot varnish smell from the inverter or cabinet',
      'Burnt smell, which indicates a component has already failed — isolate rather than continue',
    ],
    behaviour: [
      'Runs all morning and shuts down in the afternoon — the clearest signature there is',
      'Recovers after a cool-down period and then repeats',
      'Shutdowns began after additional load was connected',
      'Shutdowns began after the inverter was moved into a cabinet or the cabinet was sealed',
      'Output power quietly reduced without any shutdown, so the symptom is a slow system rather than an alarm',
      'Worse in hot weather, better in cool',
    ],
    visible: [
      'Cabinet or enclosure with no ventilation openings at all',
      'Ventilation openings blocked by stored items, cabling or proximity to a wall',
      'Filter mats clogged with dust',
      'Fan blades and heatsink fins packed with dust or fibres',
      'Insufficient clearance above, below or beside the unit',
      'Several inverters or batteries in one cabinet with no heat calculation',
      'Direct sun falling on the enclosure or on the wall behind the inverter',
      'Discoloured casing or heat marking around vents',
    ],
  },

  whatItMeans: {
    plain:
      'An inverter turns battery or solar power into mains-type power, and some of the energy passing through it becomes heat. That heat has to escape. The manufacturer states how much power the unit can supply continuously, but only if it can breathe and only up to a stated room temperature. Put it in a sealed cupboard, let the filter block, or ask it for more than its continuous figure, and it protects itself — first by quietly reducing output, then by shutting down. So an inverter shutting down on temperature is usually reporting on its installation rather than on itself.',
    technical:
      'Inverter losses arise from conduction and switching in the output stage, magnetics and, on transformer-based designs, core and copper losses, and all appear as heat at the heatsink and internal components. The continuous power rating is declared at a reference ambient temperature, with derating applied beyond it, while the surge or peak rating applies only for a stated short duration and is not a continuous capability. Where the unit is enclosed, its effective ambient is the air inside the enclosure rather than the room, so a cabinet without adequate ventilation raises the ambient the inverter experiences and reduces its capability accordingly. Protection is usually staged: the unit derates output as internal temperature rises and only shuts down when derating is insufficient, which means a thermally marginal installation frequently presents as reduced system performance long before any alarm appears. Separately, battery systems in the same enclosure both add heat and are themselves temperature-sensitive, so an unventilated cabinet shortens battery life at the same time as it derates the inverter.',
  },

  causes: {
    mostLikely: [
      'Enclosure or cabinet with inadequate ventilation, so the inverter is breathing its own exhaust',
      'Cooling fan failed, or filter and heatsink blocked with dust',
      'Continuous load above the continuous rating — the unit sized on its surge figure rather than its continuous one',
      'Ambient temperature higher than the manufacturer rated ambient, particularly in an unventilated room in the afternoon',
    ],
    possible: [
      'Insufficient mounting clearance around the unit',
      'Load grown since installation without the inverter being reassessed',
      'Direct sun on the enclosure or the wall behind the unit',
      'Batteries in the same cabinet adding heat that was never included in any calculation',
      'High surge loads repeated frequently — motor starts, compressors, pumps — keeping the unit near its thermal limit',
    ],
    lessCommon: [
      'Temperature sensor or its wiring faulty, reporting a shutdown that is not real',
      'Thermal interface between a power device and heatsink degraded after a previous repair',
      'Altitude derating not applied at a highland site',
      'Cooling fan running in reverse after an incorrect replacement',
      'Internal component degradation raising losses beyond design',
    ],
    modelSpecific: [
      'Continuous rating, surge rating and its permitted duration, rated ambient and all derating curves are manufacturer figures for the specific model',
      'Permitted mounting clearances and whether the unit may be enclosed at all are model-specific',
      'Some inverters derate silently and some shut down; know which yours does before concluding the unit is healthy because nothing alarmed',
      'Whether the unit is rated for the enclosure type in use is stated by the manufacturer',
    ],
    environmental: [
      'High ambient temperature in unventilated rooms and containerised installations',
      'Direct sun on outdoor or wall-mounted enclosures',
      'Dust ingress in agricultural, quarry and unsealed-road environments',
      'Altitude derating, applicable across much of the Kenyan highlands and worth checking rather than assuming',
      'Seasonal variation producing a fault that appears in the hot season and disappears afterwards',
    ],
    installation: [
      'Inverter installed in a cabinet chosen for appearance or security with no thermal calculation',
      'Cabinet sealed against dust or rain with no alternative cooling provided',
      'Batteries and inverter in one enclosure without accounting for the combined heat',
      'Mounting clearances not observed',
      'Unit mounted on a wall that receives direct sun on its other face',
      'Sized on the surge rating rather than the continuous rating',
    ],
    maintenance: [
      'Filters never cleaned, in environments where they load quickly',
      'Fans never checked, so a failed fan is discovered only at shutdown',
      'Heatsinks never cleaned',
      'Load growth never reassessed against the inverter continuous rating',
      'Cabinet doors left open to keep it cool, which defeats filtration and admits the dust that causes the next problem',
    ],
    componentLevel: [
      'Cooling fan failure or degradation',
      'Filter blockage',
      'Heatsink fouling',
      'Temperature sensor or wiring fault',
      'Thermal interface degradation',
    ],
  },

  safety: {
    isolation: [
      'An inverter has at least two energy sources — the AC side and the DC battery or PV side. Isolating one leaves the other live.',
      'Isolate and lock the AC supply, the battery, and any PV input before opening the unit or its enclosure.',
      'PV arrays cannot be switched off and produce voltage whenever illuminated.',
      'Observe the manufacturer DC-link discharge time and prove the bus dead before touching internal conductors.',
    ],
    lockoutTagout: [
      'Lock and tag the AC isolator, the battery isolator and the PV isolator.',
      'Where the inverter supports a critical load, agree the outage before starting.',
      'Each person working applies their own lock.',
    ],
    ppe: [
      'Insulated gloves and tools rated above the DC bus and battery voltage',
      'Eye protection, and arc-rated clothing where a power-stage failure is suspected',
      'Heat-resistant gloves — heatsinks and casings reach temperatures that cause contact burns',
      'Respiratory and eye protection when cleaning dust-laden heatsinks and filters',
    ],
    storedEnergy: [
      'DC-link capacitors hold a lethal charge after all supplies are removed; the manufacturer discharge time is mandatory.',
      'Battery banks remain fully energised regardless of inverter state and carry very high short-circuit energy.',
      'A PV array remains live in daylight.',
      'A unit that has shut down on temperature is hot, not safe — it is neither cool nor discharged.',
    ],
    specificHazards: [
      'Cleaning heatsinks with compressed air disperses conductive dust through the enclosure and onto adjacent equipment; extract rather than blow where possible.',
      'Running an inverter with its cabinet door open to keep it cool exposes live parts and usually disrupts the designed airflow.',
      'Removing a fan guard on a running unit risks injury and admits foreign objects to the airflow path.',
      'Batteries in the same enclosure produce hydrogen while charging; do not introduce ignition sources into a poorly ventilated cabinet.',
    ],
    stopAndCallProfessional: [
      'Burning smell, discolouration or any evidence of a power-stage failure — isolate and stop.',
      'The unit shuts down on temperature with the cooling path proven clear and ambient within rating; that indicates an internal fault.',
      'Enclosure thermal design needs recalculating — that is an engineering task rather than a maintenance adjustment.',
      'Batteries in the enclosure are swollen, leaking or hot.',
      'The inverter supports a life-safety or medical load.',
      'You are not competent to work with the stored energy present in the DC link and battery.',
    ],
  },

  tools: [
    { tool: 'Thermal camera', why: 'Shows the actual temperature distribution across unit, enclosure and batteries, which no single-point reading can' },
    { tool: 'Temperature data logger', why: 'Captures the daily profile inside the enclosure — essential when the fault only appears in the afternoon' },
    { tool: 'True-RMS clamp meter and power meter', why: 'Measures the ACTUAL continuous load against the continuous rating, which is the figure that matters' },
    { tool: 'Anemometer or airflow indicator', why: 'Confirms cooling air is moving, not merely that a fan is turning' },
    { tool: 'Manufacturer manual and derating data', why: 'Continuous rating, surge rating and duration, rated ambient and clearances are all model-specific' },
    { tool: 'Insulated tools and a proving unit', why: 'Working safely around DC link and battery energy' },
  ],

  decisionTree: [
    {
      question: 'Do shutdowns follow a daily or seasonal pattern?',
      yes: 'This is a thermal capacity problem, not a random fault',
      no: 'Consider a sensor fault or an unrelated electrical cause',
    },
    {
      question: 'Is the cooling path clear — fan running, filter clean, heatsink clear, clearances observed?',
      yes: 'Cooling hardware is intact; look at ambient and loading',
      no: 'Restore the cooling path first. This is the most common cause and the cheapest fix.',
    },
    {
      question: 'Is the air temperature at the inverter intake within the manufacturer rated ambient?',
      yes: 'Ambient is acceptable; look at loading',
      no: 'The enclosure is the problem — the inverter is rated against the air it breathes, not the room',
    },
    {
      question: 'Is the CONTINUOUS load within the CONTINUOUS rating, not the surge rating?',
      yes: 'Loading is acceptable',
      no: 'The unit is undersized for the actual duty. Surge ratings are for seconds, not for running.',
    },
    {
      question: 'Are batteries sharing the enclosure?',
      yes: 'Include their heat in the calculation, and check their temperature too — heat shortens their life as well',
      no: 'Continue',
    },
    {
      question: 'Does it still shut down with cooling clear, ambient in range and load within continuous rating?',
      yes: 'That points at an internal fault or a faulty temperature sensor',
      no: 'Correct what was found and verify across a full daily cycle',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Read the fault history for a pattern',
      inspect: 'Fault log, shutdown times and any recorded temperature',
      where: 'Inverter display or monitoring platform',
      instrument: 'The unit itself',
      expected: 'A pattern — shutdowns clustered by time of day, season, or after a particular load',
      ifAbnormal:
        'A clear daily pattern confirms thermal capacity. Random shutdowns with no pattern suggest a sensor or electrical cause.',
      next: 'Check specifically whether the unit has been derating without shutting down; many log this and nobody looks',
      verify: 'Fault code meanings are model-specific',
    },
    {
      step: 2,
      title: 'Measure the air the inverter actually breathes',
      inspect: 'Air temperature at the inverter intake and the room ambient, across a full day',
      where: 'At the unit intake, and outside the enclosure',
      instrument: 'Temperature logger left in place for at least a full day',
      expected: 'Intake temperature within the manufacturer rated ambient, with a modest rise above the room',
      ifAbnormal:
        'A large rise between room and enclosure means the enclosure cannot reject the heat put into it',
      next: 'Log across a full day — the fault is in the afternoon and so is the evidence',
      verify: 'The rated ambient is a manufacturer figure and refers to the air at the unit',
    },
    {
      step: 3,
      title: 'Prove the cooling path is working',
      inspect: 'Fan operation, filter condition, heatsink cleanliness, clearances and ventilation openings',
      where: 'The unit and its enclosure',
      instrument: 'Visual, anemometer, thermal camera',
      expected: 'Fan running and moving air, filter clean, heatsink clear, clearances as specified, openings unobstructed',
      ifAbnormal:
        'A failed fan or blocked filter is the most common single cause. A fan that spins but moves no air because the path is blocked is just as bad and less obvious.',
      next: 'Check obstructions outside the enclosure as well as inside — stored items against a cabinet are common',
      warning: 'Isolate all sources and observe the DC-link discharge time before reaching inside.',
    },
    {
      step: 4,
      title: 'Measure the continuous load against the continuous rating',
      inspect: 'Actual sustained output power under normal duty, and the peak surge demands',
      where: 'Inverter output',
      instrument: 'True-RMS power meter, logged over a representative period',
      expected:
        'Continuous load comfortably within the continuous rating, with surge demands within the surge rating and its permitted duration',
      ifAbnormal:
        'A unit sized on its surge figure will overheat in normal service. The surge rating is for seconds, not for running.',
      next: 'Check whether load has grown since installation — this is common and rarely recorded',
      verify:
        'Continuous rating, surge rating and permitted surge duration are distinct manufacturer figures; confirm which the unit was sized against',
    },
    {
      step: 5,
      title: 'Thermal-scan the unit, enclosure and batteries under load',
      inspect: 'Temperature distribution across the whole installation',
      where: 'The enclosure, in its normal configuration',
      instrument: 'Thermal camera',
      expected: 'Even temperatures, heat clearly leaving via the exhaust path, batteries within their temperature range',
      ifAbnormal:
        'A hot unit with a cool exhaust means air is not passing over the heatsink. Hot batteries mean the same enclosure problem is shortening their life too.',
      next: 'Scan with the door closed as it normally runs; opening it changes the airflow and invalidates the result',
    },
    {
      step: 6,
      title: 'Check clearances and enclosure arrangement against the manual',
      inspect: 'Mounting clearances, whether the unit may be enclosed at all, and total enclosure heat load',
      where: 'The installation',
      instrument: 'Manufacturer installation manual and a tape measure',
      expected: 'Clearances as specified, enclosure type permitted, total dissipation matched by the cooling provided',
      ifAbnormal:
        'A sealed cabinet with no cooling provision is a common and understandable mistake — the dust problem is solved and a thermal problem is created',
      next: 'Where batteries share the enclosure, their heat must be in the calculation',
      verify: 'Permitted clearances and enclosure requirements are manufacturer figures',
    },
    {
      step: 7,
      title: 'Verify the temperature reading itself where everything else checks out',
      inspect: 'Reported internal temperature against measured surface and intake temperature',
      where: 'The unit',
      instrument: 'Thermal camera compared against the unit reported figure',
      expected: 'Reported temperature broadly consistent with what the camera shows',
      ifAbnormal:
        'A unit reporting high temperature while running genuinely cool has a sensor or wiring fault, which is a real but uncommon cause',
      next: 'Conclude an internal fault only after cooling, ambient and loading have all been cleared',
    },
    {
      step: 8,
      title: 'Verify the fix across a full daily cycle',
      inspect: 'Intake temperature, output power and any derating events after the correction',
      where: 'The installation',
      instrument: 'Temperature logger and the unit fault log, over several days',
      expected: 'Temperature within rating through the daily peak, no derating events, no shutdowns',
      ifAbnormal:
        'A fix that holds in the morning and fails in the afternoon has not been verified — the test must span the conditions that caused the fault',
      next: 'Record the peak intake temperature achieved as the baseline',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Restoring the cooling path',
      steps: [
        'Clean or replace filter mats and set a cleaning interval matched to the environment.',
        'Clean heatsink fins and fan blades using extraction rather than compressed air where possible.',
        'Replace failed or degraded fans with the correct part, and confirm airflow direction after fitting.',
        'Clear obstructions from ventilation openings inside and outside the enclosure.',
        'Restore the manufacturer mounting clearances where the unit has been installed too tightly.',
      ],
      note: 'A blocked filter or a failed fan accounts for most of these faults and is the cheapest thing on this list.',
    },
    {
      level: 'mechanical',
      title: 'Enclosure and installation correction',
      steps: [
        'Calculate the total heat dissipated by everything in the enclosure, including batteries, and provide cooling to match.',
        'Provide filtered ventilation where the air is clean enough, or a closed-loop cooling method where it is not.',
        'Shade or relocate enclosures exposed to direct sun.',
        'Where the cabinet was sealed against dust, add cooling rather than accepting the heat.',
        'Separate batteries from the inverter enclosure where the combined heat cannot be managed.',
      ],
    },
    {
      level: 'configuration',
      title: 'Load and sizing',
      steps: [
        'Establish the actual continuous load by logging, not by adding up nameplates.',
        'Compare it against the continuous rating derated for the actual ambient and altitude.',
        'Where the load exceeds the continuous rating, either shed load, stage large starts, or fit a larger inverter.',
        'Record the continuous rating and the measured load in the site file so future load growth is assessed.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'When the unit is at fault',
      steps: [
        'Replace faulty temperature sensors and wiring where a false shutdown is proven.',
        'Where a previous repair disturbed the thermal interface between a power device and the heatsink, that interface must be restored correctly.',
        'Replace the unit where it is genuinely undersized for the duty after all corrections, rather than continuing to derate the installation.',
      ],
    },
  ],

  validation: [
    'Intake air temperature within the manufacturer rated ambient through the daily peak',
    'Cooling fan running and moving air, confirmed rather than assumed',
    'Filters clean and on a recorded cleaning interval',
    'Measured continuous load within the continuous rating derated for actual ambient and altitude',
    'No derating events or temperature warnings logged across several days',
    'Battery temperature within range where batteries share the enclosure',
    'Peak intake temperature recorded as the baseline',
  ],

  whenNotToRepair: [
    'Power-stage failure with burning or discolouration — replacement, not a cooling correction',
    'Units that shut down with cooling clear, ambient in range and load within continuous rating',
    'Inverters so undersized for the load that derating would compromise the installation',
    'Enclosures whose thermal design cannot be corrected within the space available',
    'Installations where batteries in the enclosure are already heat-damaged',
  ],

  prevention: [
    'Size on the CONTINUOUS rating and treat the surge figure as what it is — a short-duration capability',
    'Apply ambient and altitude derating at specification stage rather than discovering it later',
    'Never seal an enclosure against dust without providing an alternative cooling method',
    'Clean filters and heatsinks on an interval matched to the environment',
    'Check fans as a routine item; a failed fan is silent until the unit shuts down',
    'Log enclosure temperature periodically, particularly through the hot season',
    'Reassess the inverter against the load whenever load is added',
    'Account for battery heat where batteries and inverter share an enclosure, and remember heat shortens battery life as well',
  ],

  relatedSlugs: [
    'inverter-switches-off-under-load',
    'inverter-will-not-switch-on',
    'solar-inverter-dc-bus-fault',
    'drive-thermal-derating-and-cooling',
  ],

  faq: [
    {
      q: 'The inverter works all morning and trips in the afternoon. Why?',
      a: 'Because that is when the enclosure is hottest. It is rated against the temperature of the air it actually breathes, and by mid-afternoon the room is warm, the cabinet has been accumulating heat all day, and the sun may be on it. The morning gives it margin; the afternoon does not.',
    },
    {
      q: 'It is rated 5 kW and my load is 4 kW. Why is it overheating?',
      a: 'Check which 5 kW. Many inverters quote a surge or peak figure prominently and a lower continuous figure in the specification. The surge rating applies for seconds. If the unit was sized against it, a sustained load below the headline number can still be above the continuous rating.',
    },
    {
      q: 'Can I leave the cabinet door open to keep it cool?',
      a: 'No. It exposes live parts, defeats any filtration so dust gets in, and often makes cooling worse by disrupting the designed airflow. If the enclosure cannot reject the heat, the cooling needs correcting properly.',
    },
    {
      q: 'The system seems slower but nothing has alarmed. Is that related?',
      a: 'Quite possibly. Many inverters derate output as they heat up and only shut down if derating is not enough. The system quietly delivers less, nobody gets an alarm, and the thermal problem goes unnoticed for months. Check the log for derating events.',
    },
    {
      q: 'The batteries are in the same cabinet. Does that matter?',
      a: 'Yes, in both directions. The batteries add heat that raises the inverter ambient, and the resulting temperature shortens battery life significantly. An unventilated cabinet holding both is quietly costing you the inverter capability and the battery lifespan at the same time.',
    },
    {
      q: 'Does altitude affect an inverter?',
      a: 'It can. Thinner air carries away less heat, and manufacturers commonly publish altitude derating for that reason. It is worth checking against the manufacturer data rather than assuming, particularly at highland sites.',
    },
  ],

  references: [
    'Inverter manufacturer manual — continuous output rating, surge rating and permitted duration, rated ambient temperature, and derating curves for ambient and altitude',
    'Inverter manufacturer installation requirements — mounting clearances and whether enclosure is permitted',
    'Battery manufacturer data — operating temperature range and the effect of temperature on service life',
    'Enclosure manufacturer thermal data and cooling selection guidance',
    'IEC 62109 series — safety of power converters for use in photovoltaic power systems',
    'IEC 62040 series — uninterruptible power systems, where the installation is a UPS-type inverter',
    'Site commissioning records including the original load assessment',
  ],
};
