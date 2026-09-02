import type { RepairArticle } from '../types';

export const turbochargerMechanicalCondition: RepairArticle = {
  slug: 'turbocharger-mechanical-condition',
  hub: 'engine-systems',
  header: {
    title: 'Turbocharger Mechanical Condition — Shaft Play, Oil and Reading the Failure',
    equipmentCategory: 'Diesel engine turbocharger',
    appliesTo:
      'Exhaust gas turbochargers on diesel generating sets, fixed geometry and variable geometry, water-cooled and air-cooled bearing housings',
    difficulty: 'advanced',
    diagnosisComplexity:
      'The assessment is quick; the discipline is refusing to fit a replacement until you know what destroyed the original',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Not applicable — mechanical system; generator output 415 V three-phase 50 Hz nominal',
    safetyClass: 'rotating-machinery',
  },

  directAnswer:
    'A turbocharger spins at very high speed on a thin film of pressurised oil, so it is almost never the origin of its own failure — it is the component that dies when something else goes wrong. The four things that kill it are oil starvation, oil contamination, foreign object ingestion, and heat, and each leaves a signature you can read on the failed unit. Assess condition by three checks: shaft radial and axial free play against the turbocharger manufacturer limits, wheel and housing inspection for contact or blade damage, and evidence of oil passing at either seal. Do not judge play by feel, because the limits are small and specific. And do not fit a replacement until the cause is established, because a turbocharger fitted into an engine with a restricted oil feed, a contaminated supply or debris still in the charge air system will fail again in short order — which is why so many sets are on their second or third unit.',

  symptoms: {
    display: [
      'Boost pressure below the manufacturer figure for the load',
      'Set unable to reach rated output',
      'Exhaust temperature elevated for the load carried',
      'Engine ECU reporting boost deviation or intake pressure faults on electronic engines',
    ],
    indicators: [
      'Oil consumption increased with no external leak found',
      'Blue smoke at start-up or on load change',
      'Load acceptance poor',
    ],
    sounds: [
      'Turbocharger whine changed in pitch or become uneven',
      'Rattling, grinding or a siren-like howl — all indicate contact and are stop-now sounds',
      'A hissing or whistling that varies with load, which usually means a leak rather than the unit itself',
      'Silence where whine was previously audible, which can mean the shaft has stopped turning freely',
    ],
    smells: [
      'Burnt oil smell at the turbocharger',
      'Exhaust smell in the plant room from a leaking turbine housing joint',
    ],
    behaviour: [
      'Blue smoke suggesting oil passing into the intake or exhaust',
      'Black smoke and low power suggesting insufficient boost',
      'Performance fell suddenly rather than gradually — the turbocharger signature, as against the gradual signature of a loading filter',
      'Set on its second or third turbocharger, which means the cause has never been found',
      'Failure shortly after an oil change, an engine repair, or a filter change carried out carelessly',
      'Failure after a period of hot shutdowns without a cool-down idle',
    ],
    visible: [
      'Compressor wheel blades chipped, bent, eroded or tipped',
      'Turbine wheel blades damaged or missing material',
      'Rub marks on the compressor or turbine housing where the wheel has contacted it',
      'Oil in the compressor housing or in the charge air pipework',
      'Oil in the turbine housing or exhaust outlet',
      'Shaft discoloured blue or straw-coloured from heat',
      'Bearing journal scoring visible through the oil ports',
      'Coked oil deposits in the bearing housing or oil drain',
      'Oil feed line kinked, crushed or restricted, or its banjo filter blocked',
      'Variable geometry mechanism seized or sticking, where fitted',
    ],
  },

  whatItMeans: {
    plain:
      'A turbocharger uses the engine exhaust to spin a wheel very fast, and that wheel drives another wheel that pushes more air into the engine. It spins so fast that it does not run on normal bearings — it floats on a film of oil under pressure. That means it depends completely on clean oil arriving at the right pressure. Take the oil away for even a moment, or send dirty oil, or let something hard get sucked in, and it destroys itself in seconds. So when a turbocharger fails, the important question is not what broke but what stopped it being looked after.',
    technical:
      'A turbocharger shaft is supported on floating journal bearings and a thrust bearing, all fed by pressurised engine oil which serves simultaneously as the load-carrying film and as the primary cooling medium for the bearing housing. Rotational speeds are high enough that momentary loss of oil supply causes metal-to-metal contact and rapid bearing destruction, and oil contamination causes progressive journal scoring that ends the same way. Because the shaft is supported on an oil film rather than rolling elements, some radial and axial movement is designed in, and the diagnostic question is whether that movement exceeds the manufacturer limit — a limit small enough that assessment by feel is unreliable. Failure of the bearings allows the wheels to contact their housings, which both destroys the unit and liberates debris into the intake and exhaust paths. The seals at each end are not conventional lip seals but piston-ring type devices relying on pressure differential, so a restriction in the oil drain, excessive crankcase pressure, or persistent low intake pressure from a blocked filter can cause oil to pass without any bearing fault at all — which is why oil in the compressor housing must be interpreted alongside the drain and breather condition rather than read directly as seal failure.',
  },

  causes: {
    mostLikely: [
      'Oil starvation — restricted or blocked feed line, delayed oil pressure on start-up, or shutdown from full load without a cool-down idle',
      'Oil contamination carrying abrasive particles into the bearings, from an overdue oil change or a failed filter',
      'Foreign object ingestion through the intake, usually because the air filter housing seal failed or a filter change let debris through',
      'Heat damage from repeated hot shutdowns, coking the oil in the bearing housing',
    ],
    possible: [
      'Restricted oil drain, or excessive crankcase pressure, causing oil to pass the seals with the bearings intact',
      'Blocked air filter creating high intake depression that draws oil past the compressor-side seal',
      'Exhaust back pressure raising turbine-side temperature and loading',
      'Variable geometry mechanism seized by soot or heat, where fitted',
      'Debris from a previous turbocharger failure left in the charge air system, destroying the replacement',
    ],
    lessCommon: [
      'Wrong oil specification or viscosity for the engine and duty',
      'Turbocharger not primed with oil on installation, so it ran dry on first start',
      'Overspeed from a boost control or fuel system fault',
      'Turbine housing cracked from thermal cycling',
      'Balance lost after an unbalanced repair or a wheel replaced incorrectly',
    ],
    modelSpecific: [
      'Radial and axial shaft free-play limits are turbocharger manufacturer figures for the specific unit and must be measured against them, not judged by feel',
      'Oil feed pressure and flow requirements are specified by the turbocharger manufacturer',
      'Priming procedure on installation and the required idle period before loading and before shutdown are manufacturer-specified',
      'Variable geometry actuator setting and its checking procedure are model-specific and must not be adjusted by trial',
      'Whether the bearing housing is water-cooled changes the shutdown discipline required',
    ],
    environmental: [
      'Dusty intake environments where any filtration failure immediately reaches the compressor',
      'High ambient temperature raising bearing housing temperature and oil temperature',
      'Sustained heavy load followed by immediate shutdown, common on sets used for emergency cover',
      'Long periods standing idle, allowing oil to drain from the bearing housing so the next start runs briefly dry',
      'Poor fuel quality raising exhaust temperature and soot loading, which affects variable geometry mechanisms particularly',
    ],
    installation: [
      'Oil feed line routed with a kink, or crushed during installation',
      'Oil drain line too small, too long, or routed with a rise that impedes drainage',
      'Turbocharger fitted without priming',
      'Air filtration inadequate or the housing seal poorly fitted',
      'Exhaust system imposing back pressure above the engine manufacturer limit',
      'No provision or instruction for a cool-down idle before shutdown',
    ],
    maintenance: [
      'Oil change interval or specification not observed — the single most common underlying cause',
      'Oil filter of the wrong specification, or a bypass opening because the filter is blocked',
      'Filter housing seal not checked at element changes, letting unfiltered air past',
      'Sets shut down straight from load without the cool-down idle',
      'Debris from a previous failure not cleared from the charge air system before fitting the replacement',
      'Oil feed banjo filter, where fitted, never cleaned or replaced',
    ],
    componentLevel: [
      'Journal and thrust bearing wear or seizure',
      'Compressor or turbine wheel damage',
      'Seal ring failure',
      'Shaft distortion or fracture',
      'Variable geometry mechanism seizure',
      'Turbine housing cracking',
    ],
  },

  safety: {
    isolation: [
      'Isolate the generator supply, disable and lock the auto-start, and isolate the starting battery before any work on the turbocharger.',
      'Allow the turbocharger to cool fully. It remains dangerously hot long after the engine has stopped and it continues to spin after shutdown.',
      'Where the set feeds a changeover, isolate and lock that as well.',
    ],
    lockoutTagout: [
      'Disable and lock the auto-start and disconnect the starting battery.',
      'Lock the generator output isolator and tag it.',
      'Tag the set as out of service so nobody attempts a test run with the intake or exhaust open.',
      'Agree the outage before starting.',
    ],
    ppe: [
      'Heat-resistant gloves — turbocharger and exhaust surfaces cause immediate serious burns and stay hot for a long time',
      'Eye protection at all times around the intake, exhaust and when inspecting wheels',
      'Hearing protection for any running assessment',
      'Nitrile gloves when handling hot oil, and for the coked deposits found in a failed bearing housing',
      'Respiratory protection when cleaning soot deposits',
    ],
    storedEnergy: [
      'The rotating assembly coasts for a considerable time after engine shutdown.',
      'The lubrication system is hot and under pressure while the engine runs, and hot after it stops.',
      'The cooling system is hot and pressurised on water-cooled bearing housings.',
      'Charge air pipework is pressurised while the engine runs.',
    ],
    specificHazards: [
      'Never place hands or tools near the intake of a running engine. A turbocharger compressor will draw in loose clothing, rags and fingers.',
      'A turbocharger with damaged blades can shed material at extremely high speed. Do not run an engine with a known wheel fault to demonstrate the symptom.',
      'Turbine housings and exhaust manifolds reach temperatures that ignite oil and cause instant serious burns.',
      'Running an engine with the intake ducting removed both risks ingestion and exposes the compressor wheel.',
      'A failed turbocharger can pass sufficient oil into the intake to cause a diesel engine to run away on its own lubricating oil — an uncontrollable overspeed that cannot be stopped by cutting fuel. Treat heavy oil passing as an emergency condition.',
    ],
    stopAndCallProfessional: [
      'Rattling, grinding or a siren-like howl from the turbocharger — stop the set immediately rather than running it to a convenient time.',
      'Any indication that the engine may be drawing on its own oil, which risks runaway.',
      'Shaft free play beyond the manufacturer limit, or wheel damage found.',
      'Debris found in the charge air system, since it may already have entered the cylinders.',
      'Turbocharger manufacturer free-play limits and priming procedure unavailable.',
      'Variable geometry actuator suspected — setting it is a specialist procedure, not a field adjustment.',
      'A set on its second or third turbocharger where the cause has not been established.',
    ],
  },

  tools: [
    { tool: 'Turbocharger manufacturer free-play limits', why: 'Radial and axial limits are small and specific; without the figures the assessment is guesswork' },
    { tool: 'Dial indicator with magnetic base', why: 'Measures axial and radial play objectively rather than by feel, which is the difference between an assessment and an opinion' },
    { tool: 'Bore scope', why: 'Inspects wheels, housings and the intake path without full dismantling' },
    { tool: 'Boost pressure gauge', why: 'Confirms whether the unit is delivering, against the engine manufacturer figure' },
    { tool: 'Oil pressure gauge and the engine oil pressure specification', why: 'Oil starvation is the leading cause; feed pressure must be verified rather than assumed' },
    { tool: 'Exhaust back pressure gauge', why: 'Back pressure loads the turbine side and raises its temperature, and is rarely checked' },
    { tool: 'Oil sample kit', why: 'Oil analysis identifies contamination and bearing material, which is direct evidence of the failure mode' },
    { tool: 'Good light and magnification', why: 'Blade tip damage and housing rub marks are the evidence that names the cause' },
  ],

  decisionTree: [
    {
      question: 'Is there rattling, grinding or a howl from the turbocharger?',
      yes: 'Stop the set now. Continued running spreads debris into the engine.',
      no: 'Continue with assessment',
    },
    {
      question: 'Is boost below the manufacturer figure?',
      yes: 'Check for boost leaks and exhaust back pressure BEFORE condemning the unit',
      no: 'The turbocharger is delivering; look elsewhere for the fault',
    },
    {
      question: 'Is shaft free play within the manufacturer radial and axial limits?',
      yes: 'Bearings are serviceable',
      no: 'The unit requires replacement or specialist overhaul',
    },
    {
      question: 'Are the wheels undamaged and free of housing contact marks?',
      yes: 'No mechanical damage',
      no: 'Establish how debris entered, or why contact occurred, before fitting anything',
    },
    {
      question: 'Is there oil in the compressor or turbine housing?',
      yes: 'Check the oil drain, crankcase pressure and intake restriction before assuming seal failure',
      no: 'Continue',
    },
    {
      question: 'Has the cause of failure been established?',
      yes: 'Correct it, then fit the replacement',
      no: 'Do not fit a replacement. It will fail the same way, and that is why sets end up on their third unit.',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Decide immediately whether the set may keep running',
      inspect: 'Noise character, and any sign of oil being drawn into the intake',
      where: 'At the turbocharger, with the set running',
      instrument: 'Ear and sounding rod, plus observation of the exhaust',
      expected: 'A smooth, even whine consistent with the set history',
      ifAbnormal:
        'Rattling, grinding or a howl means stop now. Heavy blue smoke with rising engine speed is a potential runaway and is an emergency.',
      next: 'If the set must be stopped, allow the correct cool-down where it is safe to do so',
      warning:
        'A diesel drawing on its own lubricating oil cannot be stopped by cutting fuel. Treat heavy oil passing as an emergency, not a diagnostic curiosity.',
    },
    {
      step: 2,
      title: 'Confirm the turbocharger is the fault before dismantling',
      inspect: 'Boost pressure, intake restriction and exhaust back pressure under load',
      where: 'At the manufacturer tapping points',
      instrument: 'Boost gauge, manometer, back pressure gauge',
      expected: 'All three within the engine manufacturer figures',
      ifAbnormal:
        'Low boost with a healthy unit is usually a leak downstream or exhaust back pressure starving the turbine. Both are far more common than turbocharger failure and far cheaper to fix.',
      next: 'Only proceed to mechanical assessment once leaks and restriction are excluded',
      verify: 'Boost, restriction and back pressure limits all come from the engine manufacturer data',
    },
    {
      step: 3,
      title: 'Verify oil supply before touching the unit',
      inspect: 'Engine oil pressure, oil condition, feed line condition and any banjo filter',
      where: 'Engine oil gallery and the turbocharger feed line',
      instrument: 'Oil pressure gauge, visual inspection, oil sample',
      expected:
        'Oil pressure within the engine manufacturer specification, oil clean and to specification, feed line clear and unrestricted',
      ifAbnormal:
        'A kinked or crushed feed line, a blocked banjo filter, low oil pressure or contaminated oil is the cause of the failure and must be corrected regardless of what the turbocharger assessment shows',
      next: 'Take an oil sample for analysis where a bearing failure is suspected; bearing material in the oil is direct evidence',
      warning:
        'This step is what stops the replacement failing too. Oil starvation and contamination are the leading causes and neither is visible on the turbocharger itself until it is too late.',
    },
    {
      step: 4,
      title: 'Measure shaft free play against the manufacturer limits',
      inspect: 'Radial play at the shaft, and axial end float',
      where: 'At the compressor wheel and shaft, with intake and exhaust ducting removed and the unit cool',
      instrument: 'Dial indicator with magnetic base',
      expected: 'Radial and axial play within the turbocharger manufacturer limits',
      ifAbnormal:
        'Play beyond limit means the bearings are worn and the unit is finished. Play within limit does not by itself clear the unit — inspect the wheels as well.',
      next: 'Record the measured values rather than a pass or fail impression',
      verify:
        'The limits are turbocharger manufacturer figures for the specific unit. They are small enough that judgement by feel is unreliable.',
      warning: 'Allow the unit to cool fully before handling. Turbine housings retain heat for a long time.',
    },
    {
      step: 5,
      title: 'Inspect both wheels and both housings',
      inspect: 'Compressor and turbine blades, and the housing bores for contact marks',
      where: 'Through the intake and exhaust openings, or with ducting removed',
      instrument: 'Good light, magnification, bore scope',
      expected: 'Blades intact and undamaged, housings unmarked',
      ifAbnormal:
        'Blade tip damage on the compressor means something hard entered through the intake. Rub marks on a housing mean the bearings allowed the wheel to move. Turbine blade damage means debris arrived from the engine side.',
      next:
        'The damage location tells you the direction the problem came from, and that is the most useful evidence you will get',
      warning: 'Do not rotate a damaged assembly by hand more than necessary; loose material can fall into the engine.',
    },
    {
      step: 6,
      title: 'Interpret oil in the housings correctly',
      inspect: 'Oil presence at compressor and turbine ends, and the condition of the drain and breather',
      where: 'Compressor housing, turbine housing, oil drain line, crankcase breather',
      instrument: 'Visual, and crankcase pressure measurement where available',
      expected: 'Housings dry, drain clear and correctly routed, crankcase pressure within specification',
      ifAbnormal:
        'Oil at either end does not automatically mean seal failure. A restricted drain, high crankcase pressure or high intake depression from a blocked filter will all push oil past intact seals.',
      next: 'Correct the drain, breather or filter before condemning the unit on oil evidence alone',
      verify: 'Crankcase pressure limits come from the engine manufacturer data',
    },
    {
      step: 7,
      title: 'Read the failure signature on the removed unit',
      inspect: 'Bearing journals, shaft colour, deposits in the bearing housing, and wheel damage pattern',
      where: 'The removed turbocharger, on the bench',
      instrument: 'Visual with magnification',
      expected: 'A clear indication of the failure mode',
      ifAbnormal:
        'Scored journals with clean oil ways suggest starvation. Scored journals with abrasive deposits suggest contamination. Blue or straw shaft discolouration suggests heat. Coked deposits suggest hot shutdowns. Compressor blade tip damage suggests ingestion.',
      next: 'Photograph the evidence — this is what justifies the corrective work to the customer',
      warning:
        'This step is the difference between one turbocharger and three. Nothing else in this guide matters as much.',
    },
    {
      step: 8,
      title: 'Clear the system and verify after replacement',
      inspect: 'Charge air system cleanliness, priming, idle discipline, and boost after fitting',
      where: 'Charge air pipework, cooler, and the new unit',
      instrument: 'Visual, bore scope, boost gauge',
      expected:
        'Charge air system free of debris from the previous failure, new unit primed per the manufacturer procedure, boost at the manufacturer figure under load',
      ifAbnormal:
        'Debris left in the cooler or pipework will destroy the new unit. This is the most common reason a replacement fails quickly.',
      next:
        'Observe the manufacturer idle period before loading and before shutdown, and record the work and the identified cause',
    },
  ],

  repair: [
    {
      level: 'mechanical',
      title: 'Correcting the cause — this comes first',
      steps: [
        'Clear or replace a restricted oil feed line, and clean or replace any banjo filter fitted.',
        'Correct oil drain restriction, sizing or routing so the housing drains freely.',
        'Correct crankcase breather restriction and confirm crankcase pressure is within specification.',
        'Restore oil change interval and specification; take an oil sample to confirm contamination has been resolved.',
        'Repair the air filter housing seal and correct filtration for the environment.',
        'Correct exhaust back pressure where it exceeds the engine manufacturer limit.',
        'Establish a cool-down idle discipline before shutdown, and brief operators on it.',
      ],
      note:
        'Every one of these is cheaper than a turbocharger. Skipping them is why sets arrive on their third unit with the same failure signature each time.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Clearing the system before fitting',
      steps: [
        'Remove and clean the charge air cooler thoroughly; debris settles in it and is released later.',
        'Inspect and clean all charge air pipework with a bore scope where access is limited.',
        'Inspect the intake path back to the filter housing for the entry point of any foreign object.',
        'Inspect the exhaust manifold for debris where turbine damage has occurred.',
        'Confirm nothing has passed into the cylinders; where it may have, a bore inspection is warranted before running.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Fitting the replacement',
      steps: [
        'Fit the correct part number for the engine and its rating; turbochargers are matched to the application.',
        'Prime the bearing housing with clean engine oil per the manufacturer procedure before the first start.',
        'Fit new gaskets and seals throughout, and torque all fixings to the manufacturer figures.',
        'Confirm the oil feed line is clear and correctly routed with no kinks, and that the drain falls continuously.',
        'Crank without firing where the manufacturer permits, to establish oil pressure before the unit spins under exhaust energy.',
        'Idle for the manufacturer-specified period before applying load.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Overhaul and variable geometry',
      steps: [
        'Turbocharger overhaul requires balancing of the rotating assembly and is a specialist workshop operation, not a field repair.',
        'Variable geometry actuator setting is a specialist procedure with specific equipment; do not adjust it by trial.',
        'Where a variable geometry mechanism is sooted or seized, establish whether fuel quality, light-load running or exhaust temperature is the cause.',
        'Retain the failed unit until the replacement has proven itself in service.',
      ],
    },
  ],

  validation: [
    'Shaft free play on the fitted unit within the manufacturer limits where accessible',
    'Boost pressure at the engine manufacturer figure under load',
    'Intake restriction and exhaust back pressure within the manufacturer limits',
    'Engine oil pressure within specification, and oil clean and to specification',
    'No oil in the charge air system after a period of running',
    'No abnormal noise across the load range',
    'Clean exhaust at rated load with normal exhaust temperature',
    'Identified failure cause and the corrective action recorded against the set',
  ],

  whenNotToRepair: [
    'Any turbocharger with wheel damage or free play beyond limits — replacement or specialist overhaul, never a field repair',
    'Units where the cause of failure has not been established; fitting a replacement is knowingly buying the next failure',
    'Sets where debris may have entered the cylinders, until the engine has been inspected',
    'Cracked turbine housings',
    'Variable geometry units with seized mechanisms, unless the underlying cause is being corrected',
    'Any engine where oil pressure is below the manufacturer specification — fix that first or the new unit is already condemned',
  ],

  prevention: [
    'Observe the oil change interval and specification without exception; the turbocharger depends on it more than any other component',
    'Check the oil feed line and any banjo filter at major services',
    'Verify the air filter housing seal at every element change — unfiltered air goes straight to the compressor',
    'Idle before shutdown for the manufacturer-specified period, particularly after running at load, and brief operators that this matters',
    'Idle after start-up before applying load, so oil pressure is established before the unit is driven hard',
    'Monitor boost, intake restriction and exhaust back pressure at services and record them',
    'Take periodic oil samples on sets where a turbocharger has already been lost once',
    'Exercise standby sets under real load rather than running them briefly off load, which promotes deposits and coking',
  ],

  relatedSlugs: [
    'generator-air-restriction-turbocharger',
    'diesel-engine-abnormal-noise',
    'generator-excessive-smoke',
    'generator-low-oil-pressure-shutdown',
  ],

  faq: [
    {
      q: 'The turbocharger has failed. Can I just fit a new one?',
      a: 'You can, and on many sets it fails again within months. A turbocharger is almost never the origin of its own failure — it dies because oil was starved or dirty, something was ingested, or it was heat-soaked by hot shutdowns. Read the failure signature on the old unit, correct what you find, and clear the charge air system of debris. That is the difference between one turbocharger and three.',
    },
    {
      q: 'How much shaft play is acceptable?',
      a: 'The turbocharger manufacturer publishes radial and axial limits for the specific unit, and they are small enough that judging by feel is unreliable. Measure with a dial indicator against those figures. There is no general rule that transfers between units.',
    },
    {
      q: 'There is oil in the compressor housing. Is the seal gone?',
      a: 'Not necessarily. The seals rely on pressure differential, so a restricted oil drain, high crankcase pressure, or a blocked air filter creating high intake depression will all push oil past perfectly good seals. Check the drain, the breather and the filter before condemning the unit — otherwise the replacement does exactly the same thing.',
    },
    {
      q: 'Why does shutting down straight from load damage a turbocharger?',
      a: 'Oil flow stops when the engine stops, but the turbine housing is still very hot. The oil remaining in the bearing housing cooks onto the surfaces, and those deposits restrict the oil ways for every subsequent start. That is why manufacturers specify an idle period before shutdown, and why it matters most on sets that have been running hard.',
    },
    {
      q: 'Boost is low. Is the turbocharger finished?',
      a: 'Usually not. A split boost hose or a loose clamp downstream loses boost with a perfectly healthy unit, and excessive exhaust back pressure starves the turbine of the energy that drives it. Both are far more common and far cheaper. Check them before assessing the turbocharger.',
    },
    {
      q: 'What is the danger with heavy blue smoke from a failed turbocharger?',
      a: 'If enough lubricating oil reaches the intake, a diesel can begin running on its own oil. That is a runaway, and it cannot be stopped by cutting the fuel supply because fuel is no longer what it is burning. Treat heavy oil passing as an emergency and shut the set down immediately by the means available.',
    },
  ],

  references: [
    'Turbocharger manufacturer service data — radial and axial shaft free-play limits, oil feed pressure and flow requirements, priming procedure and inspection criteria',
    'Engine manufacturer service data — expected boost pressure at load, maximum intake restriction, maximum exhaust back pressure, oil pressure specification and crankcase pressure limit',
    'Engine manufacturer lubrication specification — oil grade, specification and change interval',
    'Engine manufacturer start-up and shutdown procedure, including required idle periods before loading and before shutdown',
    'Oil analysis report where taken, for contamination and bearing material identification',
    'ISO 8528 series — reciprocating internal combustion engine driven alternating current generating sets',
  ],
};
