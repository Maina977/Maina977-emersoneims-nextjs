import type { RepairArticle } from '../types';

export const generatorAirRestrictionTurbocharger: RepairArticle = {
  slug: 'generator-air-restriction-turbocharger',
  hub: 'fuel-systems',
  header: {
    title: 'Air Restriction and Turbocharger Faults — When the Engine Cannot Breathe',
    equipmentCategory: 'Diesel generating set',
    appliesTo:
      'Turbocharged and naturally aspirated diesel generating sets, with and without charge air cooling, indoor and containerised installations',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Straightforward once air is treated as a system from filter to manifold; frequently misdiagnosed as a fuel problem because the symptoms are identical',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Generator output 415 V three-phase 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A diesel engine that smokes black, will not take load, and runs hotter than it should is usually short of air rather than over-fuelled. The two are indistinguishable from the exhaust alone, which is why air is tested before fuel is touched. Work the air path as a system: the room or enclosure must supply enough air in the first place, the filter must not be restricting it, the turbocharger must be delivering boost, the charge air cooler must not be leaking or blocked, and the exhaust must not be creating back pressure that prevents the engine breathing out. Measure restriction at the filter with the engine under load rather than judging the element by eye — a filter can look serviceable and still be strangling the engine. Check turbocharger shaft free play by hand before condemning it, and inspect the compressor and turbine wheels for damage. Most of these faults are maintenance items found at the filter or the enclosure, not turbocharger failures.',

  symptoms: {
    display: [
      'Controller showing the set unable to reach or hold rated load',
      'Exhaust temperature high for the load being carried, where instrumented',
      'Boost pressure low against the expected figure on sets with boost monitoring',
      'Engine ECU reporting air filter restriction, boost deviation or intake pressure faults on electronic engines',
    ],
    indicators: [
      'Air filter restriction indicator showing in the red or latched',
      'Load acceptance poor — the set takes load slowly or trips on underfrequency when load is applied',
      'Coolant temperature running higher than historically at the same load',
    ],
    sounds: [
      'Turbocharger whine changed in pitch, or absent where it was previously audible',
      'Whistling or hissing from a leaking boost hose or joint',
      'Rattling or grinding from the turbocharger, which is a stop-now sound',
      'Engine note laboured under load in a way it was not previously',
      'Air rushing at the enclosure — a sign the ventilation is struggling',
    ],
    smells: [
      'Heavy exhaust smell in the plant room, indicating exhaust leakage or inadequate ventilation',
      'Burnt oil smell where a turbocharger is passing oil',
    ],
    behaviour: [
      'Black smoke under load that clears at light load',
      'Set will not accept its rated load although it runs cleanly unloaded',
      'Performance degrading gradually over months — the filter signature',
      'Performance dropped suddenly — the turbocharger, hose or leak signature',
      'Runs correctly with the enclosure doors open and poorly with them closed, which points squarely at ventilation',
      'Worse in the afternoon or in hot weather',
    ],
    visible: [
      'Air filter element visibly loaded, collapsed, or wet with oil or water',
      'Restriction indicator latched in the red',
      'Boost hoses soft, split, or with clamps loose or missing',
      'Oil in the compressor housing or the charge air pipework',
      'Compressor or turbine wheel blades chipped, bent or eroded',
      'Charge air cooler fins blocked with dust or damaged',
      'Enclosure air inlet louvres blocked, or the inlet filter mat clogged',
      'Exhaust silencer or pipework internally collapsed, or a rain cap seized shut',
      'Soot deposits around exhaust joints indicating leakage',
    ],
  },

  whatItMeans: {
    plain:
      'A diesel engine burns fuel with air, and it needs a lot of air. If anything gets in the way of that air — a dirty filter, a room that cannot supply enough, a turbocharger that has stopped pushing, a blocked exhaust that stops it breathing out — the engine cannot burn the fuel it is being given. The unburnt fuel leaves as black smoke, the engine gets hot, and it cannot produce full power. It looks exactly like a fuel fault, which is why so many injector jobs are done on engines that simply could not breathe.',
    technical:
      'Combustion requires air in proportion to the fuel delivered, and a governor delivering fuel to hold frequency under load will over-fuel relative to available air whenever the air path is restricted. The result is incomplete combustion, black smoke, elevated exhaust temperature and an inability to develop rated power. The air path is a system with several independent restriction points: enclosure ventilation supplying the room, the intake filter, the turbocharger compressor, the charge air cooler, and the exhaust path, where back pressure impedes scavenging just as effectively as intake restriction impedes filling. Turbocharger output depends on exhaust energy, so an exhaust restriction and a boost deficiency are linked, and a low-boost symptom does not by itself identify the turbocharger as the fault. Because intake restriction and over-fuelling produce identical exhaust symptoms, restriction must be measured under load rather than inferred, and the measurement is taken between the filter and the engine where the depression actually develops.',
  },

  causes: {
    mostLikely: [
      'Air filter element loaded beyond its service limit, restricting intake flow',
      'Enclosure or plant room ventilation inadequate or obstructed, so the engine is recirculating its own hot exhaust air',
      'Boost leak — a split hose, a loose clamp or a failed joint downstream of the turbocharger',
      'Charge air cooler blocked externally with dust, or its fins damaged',
    ],
    possible: [
      'Turbocharger bearing wear allowing the wheel to contact the housing, or shaft seizure',
      'Exhaust back pressure from a collapsed silencer, a blocked rain cap, or an undersized or over-long exhaust run',
      'Compressor or turbine wheel damaged by foreign object ingestion',
      'Filter housing seal failed, allowing unfiltered air past the element and abrading the compressor over time',
      'Wastegate or variable geometry mechanism seized, on engines fitted with them',
    ],
    lessCommon: [
      'Wrong filter element fitted — physically similar but of different flow capacity',
      'Intake pipework collapsed internally',
      'Turbocharger oil supply restricted, leading to bearing failure',
      'Charge air cooler leaking internally on water-cooled designs',
      'Exhaust and intake too close together on the enclosure so exhaust is drawn back into the intake',
    ],
    modelSpecific: [
      'Maximum permissible intake restriction and exhaust back pressure are stated by the engine manufacturer and must be taken from their data — these are the two figures the whole diagnosis turns on',
      'Expected boost pressure at a given load is engine-specific and meaningless without the manufacturer figure',
      'Filter service intervals and restriction indicator set points vary by manufacturer',
      'Turbocharger shaft free-play limits are specified by the turbocharger manufacturer, not by feel',
      'Enclosure ventilation requirement is stated by the set manufacturer as an airflow figure for the rating and ambient',
    ],
    environmental: [
      'Dust loading at quarry, cement, agricultural and unsealed-road sites, which shortens filter life dramatically',
      'High ambient temperature reducing air density and therefore the mass of air available',
      'Altitude reducing air density, relevant across much of the Kenyan highlands',
      'Enclosed plant rooms without adequate ventilation, particularly where a set was installed into an existing room',
      'Vegetation, dust or debris blocking enclosure louvres',
      'Rain or wind-driven dust entering an unprotected intake',
    ],
    installation: [
      'Ventilation openings sized without reference to the set manufacturer airflow requirement',
      'Exhaust discharging where it can be drawn back into the air intake',
      'Exhaust run longer, smaller or with more bends than the manufacturer permits, creating back pressure from day one',
      'Intake located in a dusty or hot position',
      'Enclosure louvres fitted with fine mesh that blocks quickly',
      'Charge air pipework routed with unsupported spans that work joints loose',
    ],
    maintenance: [
      'Filter elements cleaned and reused rather than replaced, damaging the media',
      'Filters changed on time rather than on measured restriction, or not changed at all at dusty sites',
      'Restriction indicator ignored or never reset after a change',
      'Enclosure louvres and cooler fins never cleaned',
      'Boost hoses and clamps never inspected',
      'Exhaust condition never assessed, so a collapsing silencer goes unnoticed for years',
    ],
    componentLevel: [
      'Filter media loading or collapse',
      'Turbocharger bearing wear or seizure',
      'Compressor or turbine wheel damage',
      'Boost hose or joint failure',
      'Charge air cooler blockage or damage',
      'Silencer internal collapse',
    ],
  },

  safety: {
    isolation: [
      'Isolate the generator supply, disable and lock the auto-start, and isolate the starting battery before working on the engine.',
      'A set that can auto-start will do so while your hands are in the engine bay. Locking the control panel alone is not sufficient.',
      'Where the set feeds a changeover, isolate and lock that as well.',
    ],
    lockoutTagout: [
      'Disable and lock the auto-start, and isolate the battery.',
      'Lock the generator output isolator and tag it.',
      'Agree the outage with whoever depends on the set before starting.',
      'Tag the set as out of service so nobody attempts a test run.',
    ],
    ppe: [
      'Hearing protection whenever the set is running — plant rooms exceed safe noise levels immediately',
      'Eye protection when working around the intake, and when blowing out coolers',
      'Heat-resistant gloves near the turbocharger and exhaust; these surfaces cause immediate serious burns',
      'Respiratory protection when cleaning dust-laden filters and coolers',
      'Close-fitting clothing with no loose sleeves near belts, fans and couplings',
    ],
    storedEnergy: [
      'Turbochargers coast for a considerable time after shutdown and remain extremely hot for much longer.',
      'The cooling system is pressurised and hot; do not open a hot system.',
      'Charge air pipework can be pressurised while the engine runs.',
      'Starting batteries store very high short-circuit energy.',
    ],
    specificHazards: [
      'Exhaust and turbocharger surfaces reach temperatures that cause instant serious burns and remain dangerous long after shutdown.',
      'Never place hands near the intake of a running engine. The suction is capable of drawing in loose clothing, rags or fingers.',
      'A running engine in an under-ventilated room produces carbon monoxide. Inadequate ventilation is a life-safety issue before it is a performance one.',
      'A turbocharger with a damaged wheel can shed material at very high speed.',
      'Diagnosing under load means the set is running and the plant room is hot, noisy and full of rotating machinery.',
    ],
    stopAndCallProfessional: [
      'Rattling or grinding from the turbocharger — stop the set rather than running it to a convenient time.',
      'Exhaust leaking into an occupied or poorly ventilated space; that is a carbon monoxide risk requiring immediate action.',
      'Enclosure ventilation found inadequate for the set rating — that is an installation correction, not a maintenance task.',
      'Turbocharger shaft free play beyond the manufacturer limit, or wheel damage found.',
      'Any engine where the manufacturer restriction and back-pressure limits cannot be obtained.',
      'Exhaust back pressure requiring the exhaust system to be redesigned.',
    ],
  },

  tools: [
    { tool: 'Manometer or intake restriction gauge', why: 'Measures intake restriction under load — the measurement that separates an air fault from a fuel fault, and it cannot be judged by eye' },
    { tool: 'Exhaust back pressure gauge', why: 'Back pressure restricts breathing as effectively as a blocked filter and is almost never checked' },
    { tool: 'Boost pressure gauge', why: 'Confirms whether the turbocharger is actually delivering, against the manufacturer figure' },
    { tool: 'Thermal camera or infrared thermometer', why: 'Finds exhaust leaks, a blocked charge air cooler, and abnormal exhaust temperature distribution' },
    { tool: 'Anemometer', why: 'Confirms enclosure ventilation airflow against the set manufacturer requirement' },
    { tool: 'Load bank or a means of applying real load', why: 'Air faults appear under load; an unloaded set will run cleanly and tell you nothing' },
    { tool: 'Engine manufacturer data', why: 'Maximum intake restriction, maximum exhaust back pressure and expected boost are engine-specific and are the figures the whole diagnosis rests on' },
    { tool: 'Turbocharger manufacturer free-play limits', why: 'Shaft play must be judged against a specification, not by feel' },
  ],

  decisionTree: [
    {
      question: 'Does the set run cleanly unloaded and smoke black under load?',
      yes: 'Classic air-versus-fuel symptom — test the air path before touching fuel',
      no: 'Smoke at all loads suggests a different cause; work the smoke diagnosis guide',
    },
    {
      question: 'Does it run better with the enclosure doors open?',
      yes: 'The enclosure ventilation is the fault. Everything else is secondary.',
      no: 'Continue through the air path',
    },
    {
      question: 'Is intake restriction under load within the engine manufacturer limit?',
      yes: 'The filter and intake are not restricting',
      no: 'Replace the filter element and re-measure. Do not clean and reuse it.',
    },
    {
      question: 'Is exhaust back pressure within the manufacturer limit?',
      yes: 'The exhaust is not restricting',
      no: 'A collapsed silencer, blocked rain cap or over-long run is choking the engine',
    },
    {
      question: 'Is boost pressure at the expected figure for the load?',
      yes: 'The turbocharger is delivering — look at the charge air cooler and for leaks',
      no: 'Check for boost leaks first, then examine the turbocharger itself',
    },
    {
      question: 'Is turbocharger shaft free play within the manufacturer limit, with wheels undamaged?',
      yes: 'The turbocharger is serviceable',
      no: 'The turbocharger needs replacement or specialist overhaul — and find out what damaged it',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish whether the fault appears only under load',
      inspect: 'Smoke, load acceptance and exhaust temperature at no load and at increasing load',
      where: 'At the set, with a means of applying real load',
      instrument: 'Load bank or the site load, plus observation',
      expected:
        'A set short of air runs acceptably unloaded and deteriorates progressively as load is applied',
      ifAbnormal:
        'Symptoms present at all loads point away from air restriction toward fuel, injection or mechanical condition',
      next: 'Do not diagnose an air fault on an unloaded set — it will run cleanly and tell you nothing',
      warning:
        'Hearing protection before the set runs. Confirm the outage is agreed before loading or unloading the site.',
    },
    {
      step: 2,
      title: 'Check the enclosure or plant room ventilation first',
      inspect: 'Air inlet and outlet paths, louvre condition, inlet filter mats, and whether exhaust can be drawn back to the intake',
      where: 'The enclosure or plant room',
      instrument: 'Visual, plus anemometer against the manufacturer airflow requirement',
      expected:
        'Free, unobstructed inlet and outlet paths delivering the airflow the set manufacturer specifies for the rating and ambient',
      ifAbnormal:
        'A set that runs better with the doors open has an enclosure problem, and no amount of engine work will fix it',
      next: 'Check for exhaust recirculation — hot exhaust drawn into the intake starves and overheats the engine simultaneously',
      warning:
        'Inadequate ventilation on a running engine is a carbon monoxide risk to anyone in the space, before it is a performance problem.',
    },
    {
      step: 3,
      title: 'Measure intake restriction under load',
      inspect: 'Depression between the air filter and the engine, at rated load',
      where: 'At the manufacturer designated tapping point downstream of the filter',
      instrument: 'Manometer or intake restriction gauge',
      expected: 'Restriction within the engine manufacturer maximum for a serviceable filter',
      ifAbnormal:
        'Restriction above the limit means the filter is strangling the engine, regardless of how the element looks',
      next: 'Replace the element and re-measure to confirm the restriction has cleared',
      verify:
        'The maximum permissible intake restriction is an engine manufacturer figure and is the basis of this whole test',
      warning:
        'A filter element can look perfectly serviceable and still be beyond its restriction limit. Never judge it by eye.',
    },
    {
      step: 4,
      title: 'Measure exhaust back pressure',
      inspect: 'Back pressure in the exhaust under load',
      where: 'At the manufacturer designated tapping point in the exhaust',
      instrument: 'Exhaust back pressure gauge',
      expected: 'Back pressure within the engine manufacturer maximum',
      ifAbnormal:
        'Excessive back pressure chokes the engine as effectively as a blocked filter, and also reduces turbocharger output because it removes exhaust energy',
      next:
        'Investigate the silencer for internal collapse, the rain cap for seizure, and the run for excessive length or bends',
      verify: 'Maximum permissible back pressure is an engine manufacturer figure',
      warning: 'Exhaust components are extremely hot. Allow proper cooling before fitting a gauge.',
    },
    {
      step: 5,
      title: 'Measure boost and hunt for leaks',
      inspect: 'Boost pressure under load, and the integrity of all charge air pipework',
      where: 'Boost tapping point, and along every hose, clamp and joint',
      instrument: 'Boost gauge, plus visual and audible inspection with the set running',
      expected: 'Boost at the manufacturer figure for the load, with no audible leaks',
      ifAbnormal:
        'Low boost with a healthy turbocharger almost always means a leak downstream — a split hose or a loose clamp. Listen for hissing and look for clean streaks where pressurised air escapes.',
      next: 'Check the charge air cooler externally for blockage and internally for leakage',
      verify: 'Expected boost pressure at a given load is engine-specific',
      warning:
        'Keep clear of belts, fans and the intake while the set is running. Do not put hands near a pressurised joint to find a leak.',
    },
    {
      step: 6,
      title: 'Inspect the charge air cooler',
      inspect: 'External fin condition and internal integrity',
      where: 'The charge air cooler',
      instrument: 'Visual, thermal camera, and pressure test where the design allows',
      expected: 'Fins clean and undamaged, cooler holding pressure, temperature drop across it as expected',
      ifAbnormal:
        'External blockage raises charge air temperature and reduces density. Internal leakage loses boost directly and, on water-cooled designs, can pass coolant into the engine.',
      next: 'Clean fins carefully; they are easily damaged and a bent fin block is permanent',
      warning: 'Do not use high-pressure water on cooler fins — it flattens them and makes the blockage worse.',
    },
    {
      step: 7,
      title: 'Assess the turbocharger itself',
      inspect: 'Shaft radial and axial free play, wheel condition, and evidence of oil passing',
      where: 'The turbocharger, with the set shut down and cool and the intake and exhaust connections removed',
      instrument: 'Hand assessment against the manufacturer free-play limits, plus visual inspection with good light',
      expected:
        'Free play within the turbocharger manufacturer limits, wheels undamaged, no contact marks on the housings, no oil in the compressor housing',
      ifAbnormal:
        'Play beyond the limit, blade damage, or rub marks on the housing mean the turbocharger is finished. Oil in the compressor housing indicates seal failure.',
      next:
        'Establish what caused it. Foreign object damage means something got past the filter or the filter housing seal failed; bearing failure often means an oil supply problem that will destroy the replacement too.',
      verify: 'Free-play limits are turbocharger manufacturer figures and must not be judged by feel',
      warning:
        'Allow the turbocharger to cool fully. It remains dangerously hot long after shutdown and it coasts after the engine stops.',
    },
    {
      step: 8,
      title: 'Verify under load after the repair',
      inspect: 'Restriction, back pressure, boost, smoke and load acceptance at rated load',
      where: 'The set under real or simulated load',
      instrument: 'The full set of gauges used in diagnosis',
      expected:
        'All figures within manufacturer limits, clean exhaust at rated load, full load accepted and held, exhaust temperature normal',
      ifAbnormal:
        'Improvement without full recovery means a second restriction remains somewhere in the air path',
      next: 'Record every measured figure as the baseline so the next comparison has a reference',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Filters, coolers and the air path',
      steps: [
        'Replace air filter elements; do not clean and reuse them, because cleaning damages the media and the element no longer filters properly.',
        'Fit the correct element — physically similar elements can have very different flow capacity.',
        'Check and replace the filter housing seal; a leaking housing passes unfiltered air straight to the turbocharger and abrades the compressor.',
        'Reset the restriction indicator after every element change.',
        'Clean charge air cooler and radiator fins gently, from the clean side outward, without high-pressure water.',
        'Clean enclosure louvres and inlet filter mats, and establish an interval matched to the site dust level.',
      ],
      note:
        'Filter changes at dusty Kenyan sites frequently need to be far more frequent than the hours-based interval suggests. Measure restriction and let that set the interval.',
    },
    {
      level: 'mechanical',
      title: 'Boost pipework and exhaust',
      steps: [
        'Replace split, soft or perished boost hoses rather than patching them.',
        'Renew clamps and torque them to the manufacturer figure; over-tightening cuts the hose and creates the next leak.',
        'Support charge air pipework so joints are not worked loose by vibration.',
        'Replace a collapsed silencer, and free or replace a seized rain cap.',
        'Where the exhaust run itself causes excessive back pressure, it must be redesigned rather than patched.',
        'Seal exhaust leaks properly — an exhaust leak inside an enclosure both starves and overheats the engine.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Turbocharger replacement',
      steps: [
        'Establish the cause of failure before fitting a replacement, or the new unit follows the old one.',
        'Where foreign object damage is found, determine how the object entered — a failed filter housing seal or a filter change carried out carelessly are the usual answers.',
        'Where bearing failure is found, check the oil supply line for restriction and the oil condition and change interval.',
        'Prime the replacement with clean oil per the manufacturer instruction before starting.',
        'Clear the charge air pipework and cooler of debris from the failed unit; fragments left in the system destroy the replacement.',
        'Allow the correct idle period after start-up before loading.',
      ],
      note:
        'A turbocharger is usually the casualty, not the culprit. Fitting a new one without finding what killed the old one is a repeat visit.',
    },
    {
      level: 'configuration',
      title: 'Installation corrections',
      steps: [
        'Correct enclosure ventilation to the set manufacturer airflow requirement — this is a design calculation, not a judgement.',
        'Relocate the exhaust discharge where it cannot be drawn back into the air intake.',
        'Relocate an intake positioned in a dusty or hot location.',
        'Where fine mesh has been fitted over louvres and blocks quickly, replace it with a correctly specified filter arrangement.',
      ],
    },
  ],

  validation: [
    'Intake restriction under load within the engine manufacturer maximum, measured and recorded',
    'Exhaust back pressure within the manufacturer maximum, measured and recorded',
    'Boost pressure at the manufacturer figure for the load',
    'Clean exhaust at rated load, with no black smoke',
    'Full rated load accepted and held, with normal load acceptance',
    'Exhaust temperature normal for the load',
    'Enclosure ventilation airflow confirmed against the manufacturer requirement',
    'All figures recorded as the baseline for future comparison',
  ],

  whenNotToRepair: [
    'Turbocharger with wheel damage or shaft play beyond limits — replacement or specialist overhaul, never a field repair',
    'Exhaust systems whose back pressure results from the run design rather than a blockage; that needs redesign',
    'Enclosures whose ventilation cannot be brought to the manufacturer requirement within the space available',
    'Charge air coolers with internal leakage on water-cooled designs, where coolant can reach the engine',
    'Engines where foreign object damage has passed through into the cylinders',
    'Any set where the manufacturer restriction and back-pressure limits cannot be obtained, since the diagnosis has no reference',
  ],

  prevention: [
    'Set the filter change interval from measured restriction rather than from hours alone, particularly at dusty sites',
    'Record intake restriction and exhaust back pressure at each service so trends are visible',
    'Check and reset the restriction indicator at every filter change',
    'Inspect boost hoses and clamps at every service — a hose costs almost nothing and a boost leak looks like a turbocharger failure',
    'Clean enclosure louvres, filter mats and cooler fins on an interval matched to the site',
    'Verify the filter housing seal at every element change; a leaking housing quietly destroys turbochargers',
    'Confirm enclosure ventilation at commissioning against the manufacturer airflow figure, and re-check if the room changes',
    'Run the set under real load periodically — an air fault will never show on an unloaded weekly test run',
  ],

  relatedSlugs: [
    'generator-excessive-smoke',
    'diesel-fuel-contamination',
    'generator-overheating',
    'generator-starts-then-stops',
  ],

  faq: [
    {
      q: 'The set smokes black under load. Is it the injectors?',
      a: 'Possibly, but check the air first. Black smoke means fuel is not burning completely, and that happens just as readily when the engine is short of air as when it is over-fuelled. The symptoms are identical from the exhaust. Measuring intake restriction and back pressure takes far less time than an injector job and rules out the cheaper cause first.',
    },
    {
      q: 'The air filter looks clean. Can I skip changing it?',
      a: 'No. Restriction is what matters, not appearance, and an element can look perfectly serviceable while being well beyond its restriction limit. Measure it under load against the engine manufacturer figure — that is the only reliable test.',
    },
    {
      q: 'Why does the set run better with the enclosure doors open?',
      a: 'Because the enclosure cannot supply enough air, so with the doors closed the engine is partly recirculating its own hot exhaust air. That is a ventilation fault, and no amount of engine work will fix it. It is also a carbon monoxide risk in an occupied space.',
    },
    {
      q: 'Boost is low. Does that mean the turbocharger has failed?',
      a: 'Not necessarily, and it usually does not. Check for boost leaks first — a split hose or loose clamp downstream of the turbocharger loses boost with a perfectly healthy unit. Also check exhaust back pressure, because the turbocharger is driven by exhaust energy and a blocked exhaust starves it.',
    },
    {
      q: 'Can exhaust back pressure really cause black smoke?',
      a: 'Yes. An engine has to breathe out as well as in. A collapsed silencer or a seized rain cap restricts scavenging, reduces the air available for the next cycle, and also reduces turbocharger output. It is rarely checked and it is a genuine cause.',
    },
    {
      q: 'We fitted a new turbocharger and it failed again. Why?',
      a: 'Because the cause was not found. The usual answers are debris left in the charge air pipework from the first failure, a restricted oil supply that destroys the bearings, or a leaking filter housing seal passing unfiltered air. The turbocharger is almost always the casualty rather than the culprit.',
    },
  ],

  references: [
    'Engine manufacturer service data — maximum permissible intake restriction, maximum exhaust back pressure, and expected boost pressure at load',
    'Generating set manufacturer installation manual — enclosure ventilation airflow requirement for the rating and ambient',
    'Turbocharger manufacturer data — shaft radial and axial free-play limits and inspection criteria',
    'Air filter manufacturer specification for the correct element and its restriction limit',
    'ISO 8528 series — reciprocating internal combustion engine driven alternating current generating sets',
    'Site commissioning records including original restriction, back pressure and ventilation measurements',
  ],
};
