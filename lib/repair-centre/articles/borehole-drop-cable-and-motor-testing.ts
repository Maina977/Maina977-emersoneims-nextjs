import type { RepairArticle } from '../types';

export const boreholeDropCableAndMotorTesting: RepairArticle = {
  slug: 'borehole-drop-cable-and-motor-testing',
  hub: 'pumps',
  header: {
    title: 'Borehole Drop Cable, Splice and Motor Testing — Before You Pull the Pump',
    equipmentCategory: 'Submersible borehole pump',
    appliesTo:
      'Three-phase and single-phase submersible borehole pumps, direct-on-line, soft-start and inverter-fed, with rising main and drop cable of any length',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Moderate — the tests are simple, but the value is in doing them from the surface in the right order, because pulling a pump to find out is expensive and often unnecessary',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Motor supply 415 V three-phase or 240 V single-phase, 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'When a borehole pump stops, the question is whether the fault is in the motor, the drop cable, or the splice between them — and all three can be tested from the surface before anyone hires a rig. Do the electrical tests in order: winding resistance between phases, insulation resistance to earth, and continuity. Balanced phase resistances with high insulation resistance means the motor and cable are electrically sound, and the fault is in the control gear, the supply or the hydraulics. Balanced resistances with collapsed insulation resistance means water has reached a conductor — most often at the splice, which is the weakest point in the whole installation. Unbalanced or open phase resistance means a broken conductor or a failed winding. Because the cable and motor are in series and both under water, a surface test alone cannot always separate them; the test that does is repeating the measurement at the splice once the pump is raised far enough to reach it. Never test insulation resistance with the drive or soft starter connected, and never treat a borehole installation as dead until you have proved it.',

  symptoms: {
    display: [
      'Overload relay or motor protection tripped, and re-tripping immediately on reset',
      'Earth leakage or residual current device tripping when the pump is called',
      'Drive reporting earth fault, output phase loss or overcurrent at start',
      'Motor protection showing phase imbalance',
    ],
    indicators: [
      'Contactor pulling in and dropping out immediately',
      'No run indication despite a valid call from the level control',
      'Protection healthy but no water delivered, which points away from the electrical side',
    ],
    sounds: [
      'Contactor chattering rather than latching',
      'Humming from the motor without rotation, indicating single-phasing or a locked rotor',
      'Complete silence at the wellhead when the pump is called',
    ],
    smells: ['Burnt smell at the starter or control panel, indicating contactor or terminal failure'],
    behaviour: [
      'Pump ran normally until a storm, then never restarted — a common lightning-related pattern',
      'Pump runs briefly then trips, repeatably',
      'Pump worked after a recent installation or repair and failed within weeks, which points at the splice',
      'Intermittent operation that worsens in wet weather',
    ],
    visible: [
      'Water in the wellhead terminal box or control panel',
      'Corroded, discoloured or burnt terminals at the starter',
      'Drop cable insulation damaged where it passes over the wellhead or a casing edge',
      'Splice that is taped rather than properly sealed — a splice made with insulating tape will fail',
      'Cable not secured to the rising main, so it has chafed against the casing',
      'Evidence of lightning damage at the panel or surge protection that has operated',
    ],
  },

  whatItMeans: {
    plain:
      'A borehole pump sits at the bottom of the well with its motor, and a long cable runs down to it. That cable is joined to the motor lead with a waterproof splice. Any of the three — motor, cable or splice — can fail, and from the surface they all look the same because they are wired end to end. The point of testing properly is to find out which one has failed, and whether the fault is even down the hole at all, before spending money pulling the pump out.',
    technical:
      'The motor winding, the motor lead, the splice and the drop cable form a single series circuit measured from the surface. Two measurements characterise it. Winding resistance between phase pairs should be closely balanced, because a three-phase submersible motor is wound symmetrically; the drop cable adds its own resistance equally to each phase, so imbalance indicates a fault rather than cable length. Insulation resistance from each conductor to earth characterises the integrity of the water barrier along the whole path, and it collapses when water reaches copper anywhere — winding, splice or cable damage. The two together separate most faults: balanced resistance with low insulation is a water ingress fault; imbalanced or infinite resistance is a conductor or winding fault; both normal exports the problem to the surface equipment or the hydraulics. Because the measurement is of the whole series path, distinguishing a cable or splice fault from a motor fault requires re-testing at the splice once it is accessible, which is why the pump is raised in stages rather than pulled straight out.',
  },

  causes: {
    mostLikely: [
      'Splice failure allowing water into the joint — the single most common electrical failure in a borehole installation, and almost always a workmanship issue',
      'Drop cable damaged where it passes the wellhead, a casing joint, or a sharp edge during installation',
      'Motor winding failure from prolonged single-phasing, dry running or repeated rapid starting',
      'Lightning-induced surge damaging the winding or cable insulation, common in the Kenyan highlands and lake basin',
    ],
    possible: [
      'Cable chafed against the casing because it was not secured to the rising main at proper intervals',
      'Contactor or overload failure at the surface, presenting as a pump fault',
      'Undersized drop cable causing voltage drop and sustained motor overheating over months',
      'Motor failure from running against a closed valve or with the borehole drawn down',
    ],
    lessCommon: [
      'Corrosion of conductors in aggressive borehole water over long service',
      'Wrong motor or cable specification fitted at a previous repair',
      'Rodent or physical damage to the cable above ground before it enters the well',
      'Control transformer or supply fault presenting as a motor fault',
    ],
    modelSpecific: [
      'Winding resistance values and acceptable imbalance are specific to the motor make, model and rating — take them from the manufacturer data, never from a similar pump',
      'Minimum acceptable insulation resistance and the test voltage to use are specified by the motor manufacturer, and a submersible in service is judged differently from a new one',
      'Some submersible motors are oil-filled and some water-filled, which affects both testing and any refill or repair decision',
      'Soft starters and inverters must be disconnected before insulation testing, and the manufacturer will state how',
    ],
    environmental: [
      'Lightning activity — a leading cause of sudden borehole pump failure in much of Kenya, often with no visible damage at the wellhead',
      'Aggressive or high-conductivity groundwater accelerating corrosion at any imperfect seal',
      'Sand-laden water abrading the pump and increasing motor load over time',
      'Falling water table causing intermittent dry running, which overheats the motor',
      'Flooding of the wellhead or control panel during heavy rain',
    ],
    installation: [
      'Splice made with tape or an unsuitable kit instead of a proper submersible splice',
      'Cable not secured to the rising main at the recommended intervals, allowing movement and chafe',
      'Drop cable undersized for the length of run and the motor rating, causing sustained voltage drop',
      'No surge protection fitted at the panel in a lightning-prone location',
      'Wellhead terminal box not sealed against ingress',
      'Pump set at a depth that allows dry running when the water level falls seasonally',
    ],
    maintenance: [
      'No periodic insulation resistance testing, so a deteriorating splice is only found when it fails completely',
      'No record of winding resistance or insulation resistance at commissioning, so later readings have nothing to be compared against',
      'Overload relay set incorrectly or bypassed after nuisance trips',
      'Dry-run protection disabled because it was tripping, rather than because the cause was fixed',
    ],
    componentLevel: [
      'Splice seal failure',
      'Winding insulation breakdown',
      'Cable insulation damage',
      'Contactor contact erosion or coil failure',
      'Overload relay drift or failure',
    ],
  },

  safety: {
    isolation: [
      'Isolate the pump supply at the panel, lock it and prove dead before disconnecting any conductor.',
      'Where an inverter or soft starter is fitted, isolate upstream and observe the DC-link discharge time before touching output terminals.',
      'Disconnect the motor circuit from all surface equipment before insulation testing — the test voltage will destroy drive and starter electronics.',
      'Treat a long drop cable as capable of holding charge after an insulation test; discharge it before handling.',
    ],
    lockoutTagout: [
      'Lock and tag the pump isolator and any automatic control that could call the pump — a level control will start a pump without warning.',
      'Disable the automatic start at the control before working, not just the manual selector.',
      'Where a genset supplies the borehole, lock that out too, and consider its auto-start.',
      'Each person applies their own lock.',
    ],
    ppe: [
      'Insulated gloves and tools rated for the supply voltage',
      'Eye protection during insulation testing and cable work',
      'Gloves and eye protection when handling a pump raised from the well — borehole water and the pump surface are both contaminated',
      'Hard hat and appropriate footwear whenever a rig or lifting equipment is on site',
      'Fall protection and a barrier around an open wellhead — an uncovered borehole is a serious fall hazard',
    ],
    storedEnergy: [
      'Insulation testers charge cable capacitance to a high voltage. A long drop cable holds a substantial and dangerous charge — always discharge through the instrument and confirm before handling.',
      'Inverter DC-link capacitors retain charge after isolation.',
      'A rising main full of water carries considerable weight, and pressure can remain in the delivery pipework — depressurise before breaking any joint.',
      'The pump and rising main under lifting equipment represent stored mechanical energy; never work under a suspended load.',
    ],
    specificHazards: [
      'An open borehole is a fall hazard and must be barriered and covered whenever unattended.',
      'Lifting a pump and rising main requires equipment rated for the full wet weight; a failure drops the assembly down the hole and can injure anyone at the wellhead.',
      'Insulation test voltage is lethal and is present on the cable while testing; ensure nobody is at the far end.',
      'Contaminated water from the borehole is a biological hazard, particularly on a well used for drinking supply.',
      'On a lightning-damaged installation, assume surge protection may have failed and the panel may be unsafe.',
    ],
    stopAndCallProfessional: [
      'You do not have equipment rated to lift the pump, rising main and water column safely.',
      'The borehole is a drinking-water supply and the fault requires anything to be introduced into the well — contamination control matters more than speed.',
      'The panel shows evidence of a lightning strike or arcing damage.',
      'Insulation resistance collapses and you cannot isolate the motor circuit fully from the drive or starter.',
      'Motor rewinding is being considered — submersible motors are sealed, and rewinding is a specialist workshop job.',
      'You are not competent to work on the supply voltage present, or to work at an open wellhead safely.',
    ],
  },

  tools: [
    { tool: 'Insulation resistance tester with selectable test voltage', why: 'The primary test for water ingress anywhere in the motor, splice or cable' },
    { tool: 'Low-resistance ohmmeter or a good multimeter on a low range', why: 'Winding and cable resistance balance between phases, which separates conductor faults from insulation faults' },
    { tool: 'Multimeter, CAT III minimum, with a proving unit', why: 'Supply voltage and proving dead' },
    { tool: 'Clamp meter with a low-current range', why: 'Running current balance across phases once the pump is restarted' },
    { tool: 'Motor and cable manufacturer data for the installed equipment', why: 'Expected winding resistance and minimum insulation resistance are equipment-specific and must not be assumed' },
    { tool: 'Submersible splice kit of the correct type and size', why: 'A splice is the most common failure point and must be remade with a proper kit, never tape' },
    { tool: 'Cable ties or clamps rated for borehole service', why: 'Securing the drop cable to the rising main at proper intervals prevents the next chafe fault' },
    { tool: 'Water level meter (dipper)', why: 'Establishes standing and pumping level, so a hydraulic cause is not mistaken for an electrical one' },
  ],

  decisionTree: [
    {
      question: 'Is supply present and correct at the outgoing side of the starter, on all phases?',
      yes: 'The supply and control gear are delivering — test the motor circuit',
      no: 'The fault is at the surface. Work the panel, not the borehole.',
    },
    {
      question: 'With the motor circuit disconnected from all surface equipment, are the phase-to-phase resistances balanced?',
      yes: 'Conductors and winding are continuous and symmetrical',
      no: 'An imbalanced or open reading means a broken conductor, a failed splice leg, or a winding fault',
    },
    {
      question: 'Is insulation resistance to earth high and stable on every conductor?',
      yes: 'The water barrier is intact — the fault is not in the motor, splice or cable',
      no: 'Water has reached copper somewhere in the path; the splice is the most likely location',
    },
    {
      question: 'Are both tests normal?',
      yes: 'The fault is at the surface or in the hydraulics — check control gear, protection settings, water level and the rising main',
      no: 'The fault is down the hole; plan a lift',
    },
    {
      question: 'With the pump raised far enough to reach the splice, do the tests improve when measured at the motor side?',
      yes: 'The fault is in the drop cable or the splice — the motor is serviceable',
      no: 'The fault is in the motor itself',
    },
    {
      question: 'Was the splice made with a proper submersible kit?',
      yes: 'Investigate cable damage and lightning as causes',
      no: 'The splice is the fault. Remake it correctly — this is the most common failure in the whole installation.',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Confirm the fault is electrical before doing anything else',
      inspect: 'Whether the pump runs at all, and whether it delivers water when it does',
      where: 'Control panel and delivery',
      instrument: 'Observation, plus a water level dipper where the well permits',
      expected:
        'A clear separation: the pump does not run (electrical or control), or it runs and delivers nothing (hydraulic or water level)',
      ifAbnormal:
        'A pump that runs normally but delivers no water is not a cable or motor fault — work the no-delivery guide instead',
      next: 'Only continue here if the pump will not run or trips its protection',
      verify:
        'Establish the standing and pumping water level if you can, so a falling water table is not mistaken for an equipment fault',
    },
    {
      step: 2,
      title: 'Test the supply and the control gear first',
      inspect: 'Incoming supply, control voltage, contactor operation and overload relay condition and setting',
      where: 'Control panel',
      instrument: 'Multimeter with a proving unit',
      expected:
        'Balanced supply on all phases, contactor pulling in cleanly and holding, overload set to the motor full-load current from the nameplate',
      ifAbnormal:
        'Missing phase, chattering contactor, burnt terminals or an incorrectly set overload are surface faults and cost nothing to fix compared with a lift',
      next: 'Resolve any surface fault fully before condemning anything down the hole',
      warning:
        'Prove your meter before and after. Isolate and lock off before touching terminals.',
    },
    {
      step: 3,
      title: 'Disconnect the motor circuit from all surface equipment',
      inspect: 'That the drop cable conductors are free of the starter, drive, soft starter and any protection',
      where: 'Outgoing terminals at the panel',
      instrument: 'Visual and multimeter',
      expected: 'The motor circuit fully isolated as a standalone circuit ready for testing',
      ifAbnormal:
        'Any remaining connection to a drive or electronic starter must be removed before insulation testing',
      next: 'Label the conductors as you disconnect them so they go back correctly',
      warning:
        'Insulation test voltage destroys drive and soft-starter electronics. This step is not optional.',
    },
    {
      step: 4,
      title: 'Measure winding and cable resistance between phases',
      inspect: 'Resistance across each phase pair of the disconnected motor circuit',
      where: 'At the disconnected drop cable conductors',
      instrument: 'Low-resistance ohmmeter, or a multimeter on its lowest range',
      expected:
        'The three phase-pair readings closely balanced with each other, and consistent with the motor manufacturer figure plus the resistance of the drop cable run',
      ifAbnormal:
        'One reading markedly different indicates a fault on that phase. An open reading indicates a broken conductor, a failed splice leg or an open winding.',
      next: 'Record all three readings — the balance between them matters more than any single value',
      verify:
        'Expected winding resistance and permissible imbalance come from the motor manufacturer data for this exact model; cable resistance depends on the conductor size and the length of the run',
      warning:
        'On a single-phase motor the start and run windings are deliberately different — do not read imbalance as a fault without knowing the winding arrangement.',
    },
    {
      step: 5,
      title: 'Measure insulation resistance to earth',
      inspect: 'Insulation resistance from each conductor to earth, and between conductors',
      where: 'At the disconnected drop cable conductors',
      instrument: 'Insulation resistance tester at the voltage the motor manufacturer specifies',
      expected:
        'A high, stable reading on every conductor, consistent with the manufacturer minimum for a motor in service',
      ifAbnormal:
        'A low or falling reading means water has reached a conductor. A reading that starts acceptable and falls during the test indicates moisture rather than a hard fault.',
      next: 'This measurement, together with the resistance balance, tells you whether to lift',
      verify:
        'Test voltage and the acceptable minimum are specified by the motor manufacturer, and the figure for a motor in service differs from the figure for a new one',
      warning:
        'Ensure nobody is at the wellhead or in contact with the cable during the test. Discharge the cable through the instrument afterwards — a long drop cable holds a dangerous charge.',
    },
    {
      step: 6,
      title: 'Interpret the two tests together before deciding to lift',
      inspect: 'The combination of resistance balance and insulation resistance',
      where: 'Your test record',
      instrument: 'Judgement against the manufacturer figures',
      expected: 'A clear conclusion rather than a guess',
      ifAbnormal:
        'Balanced resistance with low insulation means water ingress, most likely at the splice. Imbalanced or open resistance means a conductor or winding fault. Both readings normal means the fault is at the surface or hydraulic and lifting the pump would be wasted money.',
      next: 'Only mobilise lifting equipment when the tests point down the hole',
      verify:
        'Compare against commissioning records if they exist; where they do not, start keeping them from this visit',
    },
    {
      step: 7,
      title: 'Re-test at the splice once the pump is raised',
      inspect: 'Resistance and insulation resistance measured on the motor side of the splice, with the splice opened',
      where: 'At the splice, once the pump has been raised far enough to reach it',
      instrument: 'The same instruments as at the surface',
      expected:
        'Readings that separate the motor from the cable — this is the test that a surface measurement cannot do',
      ifAbnormal:
        'Good readings at the motor with poor readings from the surface confirms a cable or splice fault, and the motor is serviceable. Poor readings at the motor confirm motor failure.',
      next: 'Inspect the opened splice — its condition usually tells you exactly what happened',
      warning:
        'Never work under a suspended pump and rising main. Support the load properly before approaching the splice.',
    },
    {
      step: 8,
      title: 'Verify after repair, under real running conditions',
      inspect: 'Running current on all three phases, and insulation resistance before restoring the supply',
      where: 'Control panel, with the pump reinstalled',
      instrument: 'Clamp meter and insulation resistance tester',
      expected:
        'Insulation resistance restored to a high stable value; running current balanced across phases and at or below the nameplate full-load current',
      ifAbnormal:
        'Current above nameplate or imbalanced indicates a remaining fault or a hydraulic problem such as sand loading',
      next: 'Record insulation resistance, winding resistance and running current as the new baseline for this installation',
    },
  ],

  repair: [
    {
      level: 'wiring',
      title: 'Splice repair — do it properly or not at all',
      steps: [
        'Remake the splice with a proper submersible splice kit of the correct size for the conductors. Insulating tape, self-amalgamating tape alone, or a domestic connector will fail — it is a question of when, not whether.',
        'Clean and prepare the conductors exactly as the kit instructions require; a contaminated joint defeats the seal.',
        'Stagger the joints of the individual cores so the finished splice is not bulky at one point.',
        'Follow the kit cure or set time in full before lowering the pump. Rushing this is the reason many remade splices fail.',
        'Test insulation resistance across the finished splice before the pump goes back down the hole.',
      ],
      note:
        'The splice is the most common electrical failure point in a borehole installation, and nearly every failure is a workmanship failure rather than a material one.',
    },
    {
      level: 'wiring',
      title: 'Drop cable repair and replacement',
      steps: [
        'Replace damaged drop cable rather than splicing mid-run wherever the length allows — every additional joint is another failure point.',
        'Use submersible-rated cable of the correct size for the motor rating and the length of run, allowing for voltage drop.',
        'Secure the cable to the rising main at the intervals the pump manufacturer specifies, using clamps or ties suitable for the water.',
        'Protect the cable where it passes the wellhead and any casing edge.',
        'Seal the wellhead terminal box properly against ingress.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Motor replacement or workshop repair',
      steps: [
        'Confirm the motor is at fault by testing at the splice, not by assumption from a surface reading.',
        'Submersible motors are sealed units; rewinding is a specialist workshop operation and not a field repair.',
        'Match the replacement to the original rating, and confirm the pump end is serviceable before fitting a new motor to a worn wet end.',
        'Establish why the motor failed — dry running, single-phasing, sand or surge — and address it, or the replacement follows the same path.',
      ],
    },
    {
      level: 'configuration',
      title: 'Protection and prevention at the panel',
      steps: [
        'Set the overload relay to the motor nameplate full-load current, and record the setting.',
        'Fit or verify dry-run protection, and set it to the actual pumping conditions rather than disabling it after nuisance trips.',
        'Fit surge protection at the panel where lightning is a known risk, and check its status after storm activity.',
        'Verify phase-failure and phase-imbalance protection is present and functional on three-phase installations — single-phasing destroys submersible motors quickly.',
        'Confirm the starting arrangement is appropriate; repeated rapid starting overheats a submersible motor that relies on water flow for cooling.',
      ],
    },
  ],

  validation: [
    'Insulation resistance to earth high and stable on every conductor, meeting the motor manufacturer figure',
    'Phase-to-phase resistances balanced and consistent with the motor and cable',
    'Running current balanced across phases and at or below nameplate full-load current',
    'Pump delivering the expected flow at the expected pressure',
    'Overload relay set to nameplate and recorded',
    'Dry-run and phase protection proven functional',
    'Insulation resistance, winding resistance, running current and water level recorded as the baseline for next time',
  ],

  whenNotToRepair: [
    'A splice that has been remade repeatedly on the same installation — investigate the cable and the installation practice instead',
    'Drop cable with insulation degraded along its length rather than damaged at one point',
    'Submersible motor with collapsed insulation — that is a workshop repair or replacement, never a field fix',
    'A pump end worn by sand to the point where flow is well down even with a healthy motor',
    'Any installation where the borehole itself has failed — a falling water table is not an equipment fault and no repair will address it',
    'Installations where the drop cable is undersized for the run; replacing like for like guarantees the same overheating',
  ],

  prevention: [
    'Record insulation resistance and winding resistance at commissioning and at every service visit, so deterioration is visible as a trend',
    'Test insulation resistance annually — a splice usually degrades measurably before it fails completely',
    'Use a proper submersible splice kit every time, and allow the full cure time',
    'Secure the drop cable to the rising main at the specified intervals',
    'Size drop cable for the length of run, not just the motor rating',
    'Fit and maintain surge protection where lightning is a risk, and check it after storms',
    'Keep dry-run protection enabled and correctly set; disabling it after nuisance trips is how motors are destroyed',
    'Monitor water level seasonally so the pump setting remains below the drawdown level through the dry season',
  ],

  relatedSlugs: [
    'borehole-pump-no-water-delivery',
    'pump-runs-continuously',
    'three-phase-motor-failure-diagnosis',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'Can I tell whether the motor or the cable has failed without pulling the pump?',
      a: 'Often you can narrow it down but not always confirm it. Balanced resistance with collapsed insulation points strongly at the splice or cable, because a winding failure usually disturbs the resistance balance too. The test that separates them definitively is repeating the measurement at the splice once the pump is raised far enough to reach it, which is why pumps are raised in stages.',
    },
    {
      q: 'What is the most common failure in a borehole installation?',
      a: 'The splice. It is the one joint that sits underwater for years, and it fails when it was made with tape, made with the wrong kit, or not given its full cure time before the pump went back down. Almost every splice failure traces back to how it was made rather than to the materials.',
    },
    {
      q: 'Why must I disconnect the drive before insulation testing?',
      a: 'An insulation tester applies a high DC voltage that destroys the semiconductors in an inverter or soft starter. The motor circuit must be a standalone circuit before the test voltage is applied, every time.',
    },
    {
      q: 'The readings are fine but the pump still will not run. What now?',
      a: 'Then the fault is not in the motor, cable or splice, and lifting the pump would waste money. Look at the supply, the contactor, the overload setting, the level control and the protection relays — and check the water level, because a pump that cannot draw water will trip on dry-run protection with a perfectly healthy motor.',
    },
    {
      q: 'The pump failed after a storm. Is that a coincidence?',
      a: 'Usually not. Lightning-induced surges are a leading cause of sudden borehole pump failure, and they often leave no visible damage at the wellhead. Check the surge protection at the panel — if it has operated, that tells you what happened, and if none is fitted, that is worth correcting as part of the repair.',
    },
    {
      q: 'Can a submersible motor be rewound?',
      a: 'It is a specialist workshop operation, not a field repair — the motor is a sealed unit and resealing it correctly is the difficult part. Whether it is worth doing depends on the motor size and age against the cost of a replacement, and on whether the pump end is still serviceable.',
    },
  ],

  references: [
    'Pump and motor manufacturer manual — winding resistance, permissible imbalance, insulation test voltage and minimum acceptable insulation resistance',
    'Drop cable manufacturer data — conductor sizing for the run length and motor rating, and submersible rating',
    'Submersible splice kit instructions, including preparation and cure time',
    'Borehole completion record — depth, casing, screen positions and pump setting depth',
    'Commissioning records for the installation: insulation resistance, winding resistance and running current',
    'IEC 60034-1 — rotating electrical machines: rating and performance',
    'Water Resources Authority borehole records and abstraction conditions where applicable in Kenya',
  ],
};
