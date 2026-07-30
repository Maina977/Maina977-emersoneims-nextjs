import type { RepairArticle } from '../types';

export const generatorAltitudeAmbientDerating: RepairArticle = {
  slug: 'generator-altitude-ambient-derating',
  hub: 'fuel-systems',
  header: {
    title: 'Altitude and Ambient Derating — Why a 100 kVA Set Is Not 100 kVA in Nairobi',
    equipmentCategory: 'Diesel generating set',
    appliesTo:
      'Diesel generating sets of any rating, naturally aspirated and turbocharged, at any site altitude and ambient temperature',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Not a fault at all in most cases — the difficulty is recognising that a set behaving exactly as physics requires is being reported as faulty',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Generator output 415 V three-phase 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A generating set is rated at reference conditions of altitude, ambient temperature and humidity, and it produces less than its nameplate wherever those conditions are worse. Air gets thinner with altitude and with heat, so less oxygen enters each cylinder, so less fuel can be burned, so less power is available. This is physics, not a fault. Much of Kenya sits well above the reference altitude used for standard ratings, and plant-room temperatures routinely exceed the reference ambient, so a set that will not deliver its nameplate output at a highland site is frequently behaving exactly as it should. Before diagnosing an engine fault, establish the site altitude and the actual air temperature at the engine intake, obtain the manufacturer derating factors for those conditions, and calculate what the set can actually produce. If the measured output matches the derated figure, the set is healthy and the problem is that it was specified against the nameplate rather than against the site.',

  symptoms: {
    display: [
      'Set unable to reach nameplate kVA or kW',
      'Frequency dipping on load application and recovering slowly',
      'Controller reporting overload at a load below the nameplate rating',
      'Exhaust temperature high for the load carried',
    ],
    indicators: [
      'Load acceptance poorer than expected, particularly on large motor starts',
      'Set running at a higher percentage of its rating than the site load would suggest',
      'Performance noticeably worse in the afternoon than in the early morning',
    ],
    sounds: [
      'Engine note laboured at loads it should handle comfortably',
      'Governor hunting on load application',
      'Turbocharger working harder than expected for the load',
    ],
    smells: ['Hot exhaust smell, and black smoke odour when the set is pushed toward nameplate'],
    behaviour: [
      'Set has never made nameplate output since it was installed — the strongest indicator that this is derating rather than deterioration',
      'Performance varies with time of day and with season',
      'Set performs adequately in cool weather and struggles in hot',
      'A set moved from a coastal site to a highland site now underperforms',
      'Black smoke as the set approaches nameplate load',
      'Site consultant or supplier reporting the set as faulty when it has never been derated on paper',
    ],
    visible: [
      'Nameplate rating stated at reference conditions that do not match the site',
      'No derating calculation in the commissioning documentation',
      'Plant room without adequate ventilation, raising intake air temperature well above outside ambient',
      'Radiator discharge recirculating back to the engine intake',
      'Site altitude and design ambient absent from the specification documents',
    ],
  },

  whatItMeans: {
    plain:
      'An engine makes power by burning fuel with the oxygen in the air it draws in. The higher you go, the thinner the air, so less oxygen goes in with each breath. Hot air is also thinner than cold air, for the same reason. So the same engine that makes its full rating at sea level on a cool day cannot make that much on a hot day two thousand metres up — there simply is not as much oxygen available. The manufacturer publishes figures telling you exactly how much to subtract. A set that cannot make its nameplate at a highland site is usually not broken; it was just never derated on paper.',
    technical:
      'Engine power output is limited by the mass of air available for combustion. Air density falls with altitude as barometric pressure falls, and falls with temperature at constant pressure, so both reduce the oxygen mass entering each cylinder per cycle. Manufacturers state ratings at defined reference conditions and publish derating factors for altitude and ambient temperature, usually as a percentage reduction beyond a threshold. Turbocharging partly compensates because the compressor raises intake density, which is why turbocharged sets typically tolerate altitude better than naturally aspirated ones before derating begins — but the compensation has limits, and beyond them the turbocharger is working harder for the same result, raising exhaust temperature and thermal load. The alternator has its own separate temperature derating, governed by its insulation class and the cooling air temperature, so the set rating is the lower of the derated engine and the derated alternator. Crucially, the ambient that matters is the air temperature at the engine intake, not the outside shade temperature — a poorly ventilated plant room can add substantially to it, compounding the altitude effect.',
  },

  causes: {
    mostLikely: [
      'Set specified against nameplate rating without applying altitude derating for the site',
      'Set specified without applying ambient temperature derating for the plant room, as opposed to outside shade temperature',
      'Plant room ventilation inadequate, so intake air temperature is well above outside ambient and the derating is worse than calculated',
      'Load grown since installation so the set is being asked for more than its derated capability',
    ],
    possible: [
      'Radiator discharge recirculating to the intake, raising intake air temperature substantially',
      'Set relocated from a lower or cooler site without re-derating',
      'Derating applied to the engine but not to the alternator, or the reverse',
      'Both altitude and ambient derating applicable but only one applied',
    ],
    lessCommon: [
      'Reference conditions on the nameplate misread — standby, prime and continuous ratings are different figures for the same set',
      'Set sized on kVA without regard to the power factor of the actual load',
      'Fuel of lower calorific value than the reference fuel',
      'Humidity contribution ignored where the manufacturer includes it',
    ],
    modelSpecific: [
      'Derating factors, the altitude and temperature thresholds at which they begin, and the reference conditions themselves are all manufacturer-specific — take them from the set manufacturer data for the exact model',
      'Naturally aspirated and turbocharged versions of the same engine derate differently',
      'The alternator derating depends on its insulation class and temperature rise class, which are on its own nameplate',
      'Standby, prime and continuous ratings differ, and derating is applied to whichever is relevant',
    ],
    environmental: [
      'Altitude — much of Kenya sits well above the reference altitude used for standard ratings, and Nairobi and the highlands are affected significantly',
      'High daytime ambient temperature, particularly in arid and low-altitude regions',
      'Plant room temperature exceeding outside ambient because of inadequate ventilation',
      'Seasonal variation producing a set that copes in one season and not the other',
      'Containerised sets in direct sun, where internal temperature far exceeds shade temperature',
    ],
    installation: [
      'No derating calculation carried out at specification stage',
      'Ventilation designed without reference to the manufacturer airflow requirement',
      'Radiator discharge and air intake positioned so hot air recirculates',
      'Set installed in a room with other heat-producing plant',
      'Site altitude and design ambient never recorded in the project documentation',
    ],
    maintenance: [
      'Load growth over years never reassessed against the derated capability',
      'Plant room ventilation degraded by blocked louvres, and the resulting derating never recognised',
      'Test runs carried out unloaded or lightly loaded, so the limitation is never discovered until a real outage',
      'Derating calculation never recorded, so each new engineer rediscovers the same non-fault',
    ],
    componentLevel: [
      'None — derating is a property of the site and the specification, not a component failure',
      'Where a genuine fault exists alongside derating, it compounds: a restricted air filter on a highland site removes what little margin remains',
    ],
  },

  safety: {
    isolation: [
      'Isolate the generator supply, disable and lock the auto-start, and isolate the starting battery before any engine work.',
      'Where the set feeds a changeover, isolate and lock that as well.',
      'Load testing requires the set running; agree the outage and confirm nobody is working downstream.',
    ],
    lockoutTagout: [
      'Disable and lock the auto-start and isolate the battery for any static work.',
      'Tag the set as under test when load testing.',
      'Agree the load test with whoever depends on the supply before starting.',
    ],
    ppe: [
      'Hearing protection whenever the set is running',
      'Heat-resistant gloves near exhaust and turbocharger surfaces',
      'Eye protection around the engine bay',
      'Close-fitting clothing near rotating machinery',
    ],
    storedEnergy: [
      'Cooling system is hot and pressurised; do not open it hot.',
      'Turbocharger and exhaust remain dangerously hot long after shutdown.',
      'Starting batteries carry very high short-circuit energy.',
      'Load banks dissipate substantial heat and their resistor elements stay hot after the test.',
    ],
    specificHazards: [
      'Loading a set beyond its derated capability to prove a point overheats it, damages the exhaust valves and turbocharger, and can destroy the engine. Establish the derated figure before testing, not after.',
      'A plant room with inadequate ventilation is a carbon monoxide risk to anyone inside while the set runs — the ventilation problem is a life-safety issue before it is a derating one.',
      'Load bank testing produces significant heat in the plant room, compounding the ambient problem during the test itself.',
      'A set running at its thermal limit gives little warning before damage occurs.',
    ],
    stopAndCallProfessional: [
      'The site load genuinely exceeds the derated capability — that is a sizing decision requiring engineering, not a repair.',
      'Plant room ventilation is inadequate for the set; correcting it is an installation matter.',
      'Exhaust temperature exceeds the manufacturer limit during testing — stop the test.',
      'You cannot obtain the manufacturer derating factors and reference conditions for the set.',
      'The set serves a life-safety load and its true capability has never been established.',
    ],
  },

  tools: [
    { tool: 'Set manufacturer derating data', why: 'Reference conditions and the altitude and temperature derating factors are the entire basis of this assessment' },
    { tool: 'Altimeter, GPS or a reliable site altitude figure', why: 'Derating begins from a stated altitude threshold, so the site figure must be real rather than assumed' },
    { tool: 'Thermometer or temperature logger at the engine intake', why: 'The ambient that matters is the air the engine actually breathes, not the outside shade temperature' },
    { tool: 'Load bank', why: 'Establishes true capability under controlled load, which the site load alone rarely does' },
    { tool: 'Power analyser or accurate metering', why: 'Measures real kW and kVA, and the power factor of the actual load' },
    { tool: 'Anemometer', why: 'Confirms plant room ventilation against the manufacturer airflow requirement' },
    { tool: 'Exhaust temperature measurement', why: 'The limit that must not be exceeded while establishing capability' },
    { tool: 'Alternator nameplate data', why: 'The alternator derates separately by insulation class, and the set rating is the lower of the two' },
  ],

  decisionTree: [
    {
      question: 'Has the set ever made its nameplate output at this site?',
      yes: 'Something has deteriorated — work the air and fuel diagnosis guides',
      no: 'Strong indication this is derating rather than a fault. Calculate before diagnosing.',
    },
    {
      question: 'Have altitude and ambient derating factors been obtained and applied?',
      yes: 'Compare measured output against the derated figure',
      no: 'Do that first. Diagnosing an engine against its nameplate at a highland site chases a fault that does not exist.',
    },
    {
      question: 'Does measured output match the derated figure?',
      yes: 'The set is healthy. The problem is the specification, not the machine.',
      no: 'A genuine fault exists on top of the derating — diagnose it normally',
    },
    {
      question: 'Is the air temperature at the engine intake close to outside ambient?',
      yes: 'Ventilation is adequate; the derating is what it is',
      no: 'Poor ventilation is adding avoidable derating. Correct it and recover capability.',
    },
    {
      question: 'Has the alternator been derated as well as the engine?',
      yes: 'Both accounted for — the set rating is the lower of the two',
      no: 'Check it; the alternator derates separately by insulation class and can be the limiting element',
    },
    {
      question: 'Does the site load exceed the correctly derated capability?',
      yes: 'This is a sizing problem requiring a larger set or load management, not a repair',
      no: 'Manage expectations against the true figure and record it',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the history before assuming a fault',
      inspect: 'Whether the set has ever delivered its nameplate output at this site',
      where: 'Commissioning records, load test records, site history',
      instrument: 'Records and questions',
      expected: 'A clear answer',
      ifAbnormal:
        'A set that has never made nameplate at this site has almost certainly never been derated on paper. A set that used to and no longer does has a genuine fault.',
      next: 'This single question separates a derating discussion from a fault diagnosis',
      warning:
        'Diagnosing an engine against its nameplate at a highland site leads to injector and turbocharger work on a healthy engine.',
    },
    {
      step: 2,
      title: 'Read the nameplate properly',
      inspect: 'Rating type, rating value and the reference conditions stated on it',
      where: 'Set and alternator nameplates',
      instrument: 'Visual and the manufacturer documentation',
      expected:
        'A clear statement of standby, prime or continuous rating and the reference altitude, ambient and humidity it applies at',
      ifAbnormal:
        'Standby, prime and continuous are different figures for the same machine, and comparing site output against the wrong one produces a phantom fault',
      next: 'Note the alternator insulation class and temperature rise class as well',
      verify: 'Reference conditions are manufacturer-specific and must be read, not assumed',
    },
    {
      step: 3,
      title: 'Establish the real site altitude',
      inspect: 'Actual altitude of the installation',
      where: 'The site',
      instrument: 'GPS, altimeter or a reliable survey figure',
      expected: 'A real figure rather than a regional assumption',
      ifAbnormal:
        'Many Kenyan sites sit well above the altitude at which derating begins, and the effect is significant rather than marginal',
      next: 'Obtain the manufacturer altitude derating factor for that altitude',
      verify: 'The altitude threshold at which derating begins, and the rate beyond it, are manufacturer figures',
    },
    {
      step: 4,
      title: 'Measure the air temperature the engine actually breathes',
      inspect: 'Air temperature at the engine intake with the set running under load, and outside ambient for comparison',
      where: 'At the engine air intake, and outside the building',
      instrument: 'Temperature logger left through the hottest part of the day',
      expected: 'Intake temperature close to outside ambient, with a modest rise',
      ifAbnormal:
        'A large rise means the plant room is adding derating that good ventilation would avoid — this is recoverable capability',
      next: 'Log across a full day; the worst case is what determines capability',
      warning:
        'Use the intake temperature, not the outside shade temperature. Specifying against shade temperature is a common and expensive error.',
    },
    {
      step: 5,
      title: 'Check for radiator discharge recirculation',
      inspect: 'Whether hot radiator discharge air can return to the engine intake',
      where: 'The plant room or enclosure airflow path',
      instrument: 'Thermal camera, smoke or airflow indicator, anemometer',
      expected: 'A clear one-way path: cool air in at the intake, hot air out and away',
      ifAbnormal:
        'Recirculation raises intake temperature dramatically and is one of the largest avoidable deratings on a badly arranged installation',
      next: 'Correcting recirculation often recovers more capability than any engine work would',
      verify: 'Required ventilation airflow is stated by the set manufacturer for the rating and ambient',
    },
    {
      step: 6,
      title: 'Calculate the true derated capability',
      inspect: 'Nameplate rating with altitude and ambient derating factors applied, for both engine and alternator',
      where: 'On paper, from the manufacturer data',
      instrument: 'Manufacturer derating tables',
      expected: 'A defensible figure for what this set can actually deliver at this site',
      ifAbnormal:
        'The set rating is the LOWER of the derated engine output and the derated alternator output — check both',
      next: 'This figure is what all subsequent measurement is compared against',
      verify:
        'Apply every applicable factor. Altitude and ambient compound; applying only one understates the derating.',
    },
    {
      step: 7,
      title: 'Load test against the derated figure, not the nameplate',
      inspect: 'Actual output, frequency stability, exhaust temperature and smoke under controlled load',
      where: 'The set with a load bank',
      instrument: 'Load bank, power analyser, exhaust temperature measurement',
      expected:
        'The set delivering its derated figure cleanly, holding frequency, with exhaust temperature within the manufacturer limit',
      ifAbnormal:
        'Output matching the derated figure means the set is healthy. Output below it means a genuine fault exists on top of the derating.',
      next: 'Where output is short of the derated figure, work the air restriction and fuel guides',
      warning:
        'Do not load beyond the derated capability to prove a point. It overheats the engine and damages exhaust valves and the turbocharger. Stop if exhaust temperature reaches the manufacturer limit.',
    },
    {
      step: 8,
      title: 'Compare the derated capability against the actual site load',
      inspect: 'Measured site load, including starting demands, against the derated capability',
      where: 'Site metering and the load schedule',
      instrument: 'Power analyser, and the load schedule',
      expected: 'Derated capability comfortably exceeding site demand including motor starting',
      ifAbnormal:
        'Where the load exceeds the derated capability, the answer is a larger set or load management — not an engine repair',
      next:
        'Record the derated figure prominently on the set and in the site file, so nobody rediscovers this as a fault',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Recovering avoidable derating',
      steps: [
        'Correct plant room ventilation to the set manufacturer airflow requirement — this is the largest recoverable factor on most installations.',
        'Eliminate radiator discharge recirculation by ducting the discharge away from the intake.',
        'Clear blocked louvres and inlet filter mats, and set a cleaning interval.',
        'Shade or ventilate containerised sets in direct sun.',
        'Relocate an air intake positioned in a hot area of the plant room.',
        'Where other heat-producing plant shares the room, address that heat load too.',
      ],
      note:
        'Altitude derating cannot be recovered — the site is where it is. Ambient derating caused by poor ventilation very often can be, and it is frequently the larger of the two.',
    },
    {
      level: 'configuration',
      title: 'Recording the true capability',
      steps: [
        'Record the derated capability on the set itself, alongside the nameplate.',
        'Record the site altitude, design ambient and the derating factors applied in the site file.',
        'Record the measured load test result against the derated figure.',
        'Brief site staff that the derated figure, not the nameplate, is the capability they have.',
        'Include the derating calculation in any future load-growth assessment.',
      ],
      note:
        'The absence of this record is why the same non-fault is investigated repeatedly at the same site, by each new engineer in turn.',
    },
    {
      level: 'mechanical',
      title: 'Where a genuine fault sits on top of the derating',
      steps: [
        'Work the air restriction diagnosis — on a derated site there is no margin, so a partly blocked filter that would be tolerable at sea level is not.',
        'Work the fuel and combustion diagnosis where output remains below the derated figure.',
        'Check exhaust back pressure, which compounds with altitude because both reduce the air available.',
        'Verify cooling system performance; a derated site is also a thermally harder site.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'When the set is genuinely too small',
      steps: [
        'Size a replacement against the derated capability required at this site, not against nameplate.',
        'Include motor starting and load-step requirements in the sizing, since these are also affected by derating.',
        'Consider load management or staged starting as an alternative to a larger set where practical.',
        'Where the existing set is retained, document clearly what it can and cannot support.',
      ],
    },
  ],

  validation: [
    'Site altitude and intake air temperature measured and recorded',
    'Manufacturer derating factors obtained and applied to both engine and alternator',
    'Derated capability calculated and recorded, as the lower of the two',
    'Load test result matching the derated figure, with frequency held and exhaust temperature within limit',
    'Plant room ventilation confirmed against the manufacturer airflow requirement',
    'No radiator discharge recirculation, confirmed',
    'Derated figure recorded on the set and in the site file',
    'Site load confirmed within the derated capability, including starting demand',
  ],

  whenNotToRepair: [
    'Nothing to repair where the set is performing to its correctly derated figure — that is a healthy machine and it must be reported as such',
    'Sites where the load genuinely exceeds derated capability; that is a sizing decision, not a repair',
    'Plant rooms where ventilation cannot be brought to requirement within the space available',
    'Sets whose manufacturer derating data cannot be obtained, since capability cannot then be established',
    'Any situation where loading beyond the derated figure is being proposed to meet demand — that destroys the engine',
  ],

  prevention: [
    'Apply altitude and ambient derating at specification stage, before the set is bought — it is far cheaper than discovering it afterwards',
    'Use the intake air temperature the set will actually see, not the outside shade temperature',
    'Design plant room ventilation to the manufacturer airflow requirement and verify it at commissioning',
    'Arrange radiator discharge so it cannot recirculate to the intake',
    'Record site altitude, design ambient, derating factors and derated capability in the commissioning documentation',
    'Reassess derated capability whenever site load grows',
    'Load test annually against the derated figure so capability is known before an outage rather than during one',
    'Mark the derated capability on the set so it is not repeatedly investigated as a fault',
  ],

  relatedSlugs: [
    'generator-air-restriction-turbocharger',
    'generator-excessive-smoke',
    'generator-overheating',
    'diesel-fuel-contamination',
  ],

  faq: [
    {
      q: 'My 100 kVA set will not make 100 kVA. Is it faulty?',
      a: 'Very possibly not. That rating applies at the manufacturer reference altitude and temperature, and most Kenyan sites are above the altitude at which derating begins. Get the manufacturer derating factors, calculate what the set can actually produce here, and compare the measurement against that. If they match, the set is healthy and it was specified against the wrong number.',
    },
    {
      q: 'How much output does altitude cost?',
      a: 'It depends on the engine, whether it is turbocharged, and the altitude, and the manufacturer publishes the figures for the specific model. What matters is that it is significant rather than marginal at highland sites, and that it compounds with temperature derating rather than replacing it.',
    },
    {
      q: 'Does turbocharging remove the altitude problem?',
      a: 'It reduces it, because the compressor raises intake density and partly compensates for the thinner air. It does not eliminate it. Beyond the manufacturer threshold a turbocharged set still derates, and it does so while the turbocharger works harder, which raises exhaust temperature and thermal load.',
    },
    {
      q: 'Which temperature should I use — the outside shade temperature?',
      a: 'No. Use the air temperature at the engine intake, measured under load at the worst time of day. A poorly ventilated plant room can add a great deal to outside ambient, and specifying against shade temperature is a common and expensive error.',
    },
    {
      q: 'Can I recover any of the lost output?',
      a: 'The altitude portion, no — the site is where it is. The temperature portion, often yes, and sometimes substantially. Correcting plant room ventilation and stopping radiator discharge recirculating into the intake can recover real capability, and it is usually cheaper than any alternative.',
    },
    {
      q: 'Can I just run the set a bit above its derated rating?',
      a: 'No. Beyond the derated figure there is not enough air to burn the fuel, so it overheats, smokes, and damages exhaust valves and the turbocharger. The derated figure is the capability, not a conservative suggestion.',
    },
  ],

  references: [
    'Generating set manufacturer rating data — reference conditions and derating factors for altitude and ambient temperature',
    'Engine manufacturer derating data for the specific engine, naturally aspirated or turbocharged as fitted',
    'Alternator nameplate and manufacturer data — insulation class, temperature rise class and temperature derating',
    'Generating set manufacturer installation manual — plant room ventilation airflow requirement',
    'ISO 8528-1 — reciprocating internal combustion engine driven alternating current generating sets: application, ratings and performance',
    'ISO 3046-1 — reciprocating internal combustion engines: performance, declarations of power and fuel consumption, and standard reference conditions',
    'Site commissioning records including altitude, design ambient and any original derating calculation',
  ],
};
