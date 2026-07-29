import type { RepairArticle } from '../types';

export const dieselFuelContamination: RepairArticle = {
  slug: 'diesel-fuel-contamination',
  hub: 'fuel-systems',
  header: {
    title: 'Diesel Fuel Contamination — Water, Dirt and Microbial Growth',
    equipmentCategory: 'Diesel fuel systems — storage, filtration and injection protection',
    appliesTo: 'Standby and prime generating sets with bulk or day tanks, mechanical and common-rail injection',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to diagnose, expensive to ignore. The fuel is easy to sample; the damage it does to injection equipment is not easy to undo.',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-27',
    lastReviewed: '2026-07-27',
    electricalSystem: 'Set output 240 V / 415 V 50 Hz nominal; fuel system per engine design',
    safetyClass: 'fuel-and-fire',
  },

  directAnswer:
    'Draw a sample from the bottom of the tank before anything else, because that is where the evidence is. Water is denser than diesel and settles, so a bottom sample shows free water, sludge and microbial growth long before anything reaches the engine. Clear bright fuel at the top of a tank proves nothing. Standby installations are the worst affected precisely because they sit still: fuel that is rarely turned over gives water time to separate, and the interface between water and diesel is where microbial colonies grow into the black slime that blocks filters. The consequences fall on the most expensive parts of the engine, since modern injection equipment depends on the fuel itself for lubrication and clearances are extremely fine, so water and abrasives cause wear that is not recoverable by cleaning. Treat repeated filter blockage as a tank problem rather than a filter problem — replacing filters more often manages the symptom while the source keeps producing it.',

  symptoms: {
    display: [
      'Low fuel pressure or fuel filter restriction alarm where monitored',
      'Engine derating or shutdown under load',
      'Fail to start after a period of standing',
      'Water in fuel warning where a sensor is fitted',
    ],
    indicators: [
      'Water separator bowl showing water or debris',
      'Filter restriction indicator in the red',
      'Fuel gauge inconsistent with actual consumption, which can indicate water volume in the tank',
    ],
    sounds: [
      'Engine hunting or surging under load, indicating restricted supply',
      'Rough running or misfire, which can follow water passing through injection',
      'Injection pump noise change',
      'Engine stopping cleanly under load as if fuel were switched off',
    ],
    smells: [
      'Sour, sulphurous or rotten smell from the tank, which is characteristic of microbial contamination',
      'Fuel smelling stale or varnished after long storage',
      'Any fuel smell around the set indicates a leak and is a fire risk',
    ],
    behaviour: [
      'Filters blocking far sooner than the service interval',
      'Runs on the day tank but fails when drawing from bulk storage',
      'Fails under load but idles acceptably, which points at restricted supply',
      'Problems appearing after a fuel delivery',
      'Problems appearing after a long standing period, which is the classic standby pattern',
      'Injectors failing repeatedly on the same set, indicating the fuel rather than the injectors',
    ],
    visible: [
      'Water and sludge in the water separator bowl',
      'Black or brown slime on filter elements, which indicates microbial growth',
      'Rust or scale inside the tank and on the tank floor',
      'Fuel colour and clarity in a clean glass jar',
      'Tank breather and filler cap condition, which is how water gets in',
      'Water level in a bottom sample after settling',
    ],
  },

  whatItMeans: {
    plain:
      'Diesel picks up water and dirt in storage, and where water sits against fuel, microbes grow and produce a black slime. All three block filters and damage injection equipment. Because the water sinks, the fuel can look perfectly clean at the top of the tank while the problem sits underneath. Testing means taking a sample from the bottom.',
    technical:
      'Fuel contamination arrives by three routes and each behaves differently. Water enters through condensation in partly filled tanks, through breathers and filler caps, and occasionally in the delivery itself, and because it is denser than diesel it settles to the tank floor where it is invisible from a top sample. Particulate contamination comes from rust and scale in steel tanks, from airborne dust drawn in through breathers, and from delivery. Microbial contamination is the consequence of the first: colonies live at the water-fuel interface and in the water layer, producing biomass that appears as dark slime on filter elements and acids that accelerate tank corrosion. Standby installations concentrate all three risks because low turnover gives water time to separate and colonies time to establish, which is why a set that runs briefly each month is more exposed than one running continuously. The damage falls disproportionately on injection equipment because modern systems rely on the fuel for lubrication of very fine clearances, so water displaces that lubrication and abrasive particles cause wear directly. Filtration protects the engine but does not solve the problem: filters capture what the tank keeps producing, so a shortening filter life is a measurement of tank condition rather than a filter fault. Water separators handle free water but not water in solution, and a separator that is never drained simply returns its contents to the system.',
  },

  causes: {
    mostLikely: [
      'Condensation in a partly filled tank, which is the dominant water source on standby installations',
      'Water separator never drained',
      'Microbial growth at the water-fuel interface after long storage',
      'Rust and scale from an ageing steel tank',
    ],
    possible: [
      'Water or debris in the delivered fuel',
      'Damaged or missing tank breather filter allowing moist dusty air in',
      'Filler cap seal failed, admitting rainwater',
      'Tank never cleaned since installation',
      'Fuel stored well beyond a sensible period without treatment or turnover',
    ],
    lessCommon: [
      'Cross-contamination from a shared or previously used tank',
      'Incorrect fuel specification for the engine',
      'Fuel line corrosion introducing debris downstream of filtration',
      'Return line arrangement stirring settled water back into suspension',
    ],
    modelSpecific: [
      'Permissible fuel specification and cleanliness requirements are engine-specific — take them from the engine manufacturer data',
      'Common-rail systems are markedly less tolerant of water and particulates than older mechanical injection',
      'Filter micron ratings and change intervals are engine-specific and must not be substituted by appearance',
      'Some engines require a specific water separator arrangement, and its absence invalidates the protection assumed in the design',
    ],
    environmental: [
      'Humidity and large day-night temperature swings driving condensation',
      'Dust ingress through breathers, which is a continuous factor in Kenya',
      'Warm storage temperatures favouring microbial growth',
      'Coastal humidity accelerating both water accumulation and tank corrosion',
      'Long standing periods between runs on standby plant',
    ],
    installation: [
      'Tank with no drain point at the lowest position, so water cannot be removed',
      'No water separator, or one fitted without a means of draining it',
      'Fill point exposed to rain',
      'Tank sized far larger than consumption, guaranteeing long residence time',
      'Suction take-off at the very bottom, drawing settled water directly',
    ],
    maintenance: [
      'Water separator never drained on a schedule',
      'Fuel never sampled or tested despite long storage',
      'Tank never cleaned or polished',
      'Filters changed on time but the cause never investigated',
      'Tank left part-full between runs rather than kept topped up',
    ],
    componentLevel: [
      'Filters blocked',
      'Water separator element failed or bowl full',
      'Injectors worn by abrasives or damaged by water',
      'Injection pump worn',
      'Lift pump strainer blocked',
    ],
  },

  safety: {
    isolation: [
      'Stop the set and prevent automatic restart before opening any part of the fuel system',
      'Lock the control in stop and isolate the starting battery',
      'Allow the engine to cool before working near exhaust or turbocharger surfaces',
      'Relieve fuel system pressure by the manufacturer method before opening a fitting',
    ],
    lockoutTagout: [
      'Lock the control selector in stop and tag it',
      'Disconnect and tag the starting battery',
      'Tag the changeover control so auto operation is not restored during the work',
    ],
    ppe: [
      'Nitrile gloves — diesel is a skin irritant and repeated exposure causes dermatitis',
      'Eye protection when draining, sampling or opening fuel components',
      'Respiratory protection where tank cleaning produces vapour in a confined space',
      'Non-sparking tools where required by the installation',
    ],
    storedEnergy: [
      'Common-rail systems retain very high fuel pressure after shutdown',
      'Elevated tanks hold a static head that does not disappear when the engine stops',
      'Exhaust and turbocharger surfaces stay hot long after a run',
      'The starting battery remains live',
    ],
    specificHazards: [
      'NEVER loosen a fitting on a high-pressure fuel system with the engine running. Fuel at injection pressure penetrates skin and causes injuries requiring immediate surgical attention, and they are routinely underestimated at the time because the entry wound looks trivial.',
      'Diesel is a fire risk. Eliminate ignition sources, have appropriate extinguishing means present, and contain spillage rather than washing it away.',
      'Tank entry is CONFINED SPACE work with vapour and oxygen-deficiency hazards. It requires trained personnel, gas testing and a permit system — it is not a task to improvise.',
      'Microbially contaminated fuel and tank sludge are a biological hazard as well as a chemical one; avoid skin contact and wash thoroughly.',
      'Contain and dispose of drained water, sludge and used filters through a licensed route — do not let them reach ground or drains.',
    ],
    stopAndCallProfessional: [
      'Tank entry or internal cleaning is required',
      'A high-pressure fuel system needs opening beyond routine filter service',
      'Injection equipment damage is suspected',
      'Fuel is leaking and cannot be contained',
      'Microbial contamination is extensive enough to need treatment and tank cleaning',
    ],
  },

  tools: [
    { tool: 'Bottom-sampling equipment or a tank sampling thief', why: 'Water and sludge settle, so a bottom sample is the only meaningful one — a top sample can look perfect over a serious problem' },
    { tool: 'Clean clear glass sample jars', why: 'Allowing a sample to settle and be assessed visually costs almost nothing and answers most of the question' },
    { tool: 'Water-finding paste or a water detection kit', why: 'Confirming and measuring the depth of free water in the tank' },
    { tool: 'Fuel filter restriction gauge or manometer', why: 'Measuring restriction rather than judging a filter by appearance' },
    { tool: 'Microbial test kit', why: 'Confirming biological contamination rather than inferring it from slime' },
    { tool: 'Fuel sampling containers for laboratory analysis', why: 'Where the fuel condition is disputed or the contamination source needs identifying' },
    { tool: 'Spill containment and disposal provision', why: 'Drained water, sludge and used filters are controlled waste' },
  ],

  decisionTree: [
    { question: 'Is fuel leaking anywhere?', yes: 'Stop and contain it before any diagnosis — this is a fire risk', no: 'Continue' },
    { question: 'Has a BOTTOM sample been drawn from the tank?', yes: 'Continue', no: 'Draw one. A top sample proves nothing, because water and sludge settle.' },
    { question: 'Is there free water in the sample after settling?', yes: 'Water is present — establish how it is getting in as well as removing it', no: 'Continue' },
    { question: 'Is there dark slime on filter elements or at the fuel-water interface?', yes: 'Microbial contamination — filtration alone will not resolve it', no: 'Continue' },
    { question: 'Are filters blocking far sooner than the service interval?', yes: 'That is a measurement of tank condition, not a filter fault', no: 'Continue' },
    { question: 'Is the water separator drained on a schedule?', yes: 'Continue', no: 'An undrained separator returns its contents to the system' },
    { question: 'Is the tank kept reasonably full between runs?', yes: 'Continue', no: 'A part-full tank condenses water every night — this is the dominant source on standby sets' },
    { question: 'Is injection equipment already affected?', yes: 'Refer for assessment — abrasive and water damage is not recoverable by cleaning', no: 'Address the tank and filtration' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Draw a bottom sample before anything else',
      inspect: 'Fuel drawn from the lowest point of the tank, allowed to settle in a clear jar',
      where: 'Tank drain or by sampling thief to the tank floor',
      instrument: 'Sampling equipment and clean glass jars',
      expected: 'Clear bright fuel with no water layer, sludge or slime',
      ifAbnormal: 'Water settles, so this is where the evidence lives. Clear fuel at the top of a tank tells you nothing about what is underneath, and a great many contamination problems are missed because only the top was ever looked at.',
      next: 'Step 2',
      warning: 'Contain the sample and any spillage; diesel is a fire risk and controlled waste.',
    },
    {
      step: 2,
      title: 'Measure the water depth rather than estimating it',
      inspect: 'Depth of free water on the tank floor',
      where: 'Through the tank access or dip point',
      instrument: 'Water-finding paste on a dip stick, or a detection kit',
      expected: 'No measurable free water',
      ifAbnormal: 'Knowing the depth turns an opinion into a quantity, which matters when deciding between draining, polishing and full tank cleaning.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Inspect filter elements and the separator bowl',
      inspect: 'Filter media condition and what the water separator has collected',
      where: 'At the filters and separator',
      instrument: 'Visual inspection, filter cut open where useful',
      expected: 'Clean media, dry separator bowl',
      ifAbnormal: 'Dark slime on the media indicates microbial growth rather than ordinary dirt, and it means the tank is producing biomass continuously. Water in an undrained separator has been recirculating.',
      next: 'Step 4',
    },
    {
      step: 4,
      title: 'Measure filter restriction and compare against the interval',
      inspect: 'Restriction across the filters, and how long the current elements have been in service',
      where: 'At the fuel filters',
      instrument: 'Restriction gauge or manometer, plus service records',
      expected: 'Restriction within limits for the elapsed interval',
      ifAbnormal: 'Filters blocking well before their interval is a measurement of tank condition. Changing them more often manages the symptom while the tank keeps producing the cause.',
      next: 'Step 5',
      verify: 'The filter specification and permissible restriction for this engine, from the manufacturer data.',
    },
    {
      step: 5,
      title: 'Confirm microbial contamination rather than assuming it',
      inspect: 'Presence of biological growth in the fuel and at the interface',
      where: 'Sample from the tank bottom and interface',
      instrument: 'Microbial test kit',
      expected: 'Negative or negligible',
      ifAbnormal: 'Confirming matters because the treatment differs. Microbial contamination needs biocide treatment and tank cleaning; particulate contamination needs filtration and tank cleaning; water needs the ingress route closed.',
      next: 'Step 6',
    },
    {
      step: 6,
      title: 'Find how water is getting in',
      inspect: 'Breather filter, filler cap seal, tank fill point exposure, and tank fill practice',
      where: 'At the tank',
      instrument: 'Visual inspection',
      expected: 'Sealed breather with a filter, sound cap seal, protected fill point',
      ifAbnormal: 'Removing water without closing the ingress route means doing it again. On standby sets the dominant source is condensation in a part-full tank, which is a filling practice question rather than a component fault.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Assess whether injection equipment has already suffered',
      inspect: 'Engine behaviour under load, injector condition and injection system history',
      where: 'At the engine and in the service history',
      instrument: 'Load test, injector assessment where indicated',
      expected: 'Normal performance under load',
      ifAbnormal: 'Modern injection relies on the fuel for lubrication of very fine clearances, so water and abrasives cause wear that cleaning cannot reverse. Repeated injector failure on one set indicts the fuel rather than the injectors.',
      next: 'Step 8',
    },
    {
      step: 8,
      title: 'Decide between draining, polishing and cleaning',
      inspect: 'Extent of water, sludge and biological growth against tank condition',
      where: 'Overall assessment',
      instrument: 'All prior findings',
      expected: 'A proportionate decision rather than a default',
      ifAbnormal: 'Draining handles free water. Polishing handles suspended particulate and some water. Neither removes established sludge and biofilm adhering to tank walls, which needs cleaning — and tank entry is confined space work.',
      next: 'Execute the chosen remedy and re-sample afterwards',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Fuel and tank condition',
      steps: [
        'Drain free water from the tank low point and from the water separator',
        'Fuel polishing where suspended contamination is the issue',
        'Full tank cleaning where sludge and biofilm are established — as confined space work by trained personnel',
        'Replace fuel filters and the water separator element after any tank work, not before',
      ],
      note: 'Changing filters before cleaning the tank simply loads the new elements with the same contamination.',
    },
    {
      level: 'component-replacement',
      title: 'Ingress routes and filtration',
      steps: [
        'Fit or replace a breather with an appropriate filter',
        'Replace a failed filler cap seal',
        'Fit a water separator where none exists, with a means of draining it',
        'Replace corroded fuel lines introducing debris downstream of filtration',
      ],
    },
    {
      level: 'configuration',
      title: 'Storage and filling practice',
      steps: [
        'Keep tanks reasonably full between runs to limit the air volume that condenses water',
        'Establish a drain schedule for the water separator and tank low point',
        'Treat stored fuel where turnover is low, following the product guidance',
        'Review tank sizing where residence time is far longer than the fuel can tolerate',
      ],
      note: 'On standby installations this level does more for reliability than any component change.',
    },
    {
      level: 'manufacturer-level',
      title: 'Injection equipment',
      steps: [
        'Refer suspected injector and injection pump damage for assessment',
        'Provide the fuel sample findings, filter condition and service history',
      ],
    },
  ],

  validation: [
    'Draw a fresh bottom sample after the work and confirm it is clear and bright',
    'Confirm no measurable free water remains',
    'Measure filter restriction after a period of running and compare against the previous rate of blockage',
    'Confirm the water separator stays dry between scheduled drains',
    'Run under load and confirm no hunting, derating or shutdown',
    'Re-test microbially where treatment was applied',
    'Record water depth found, treatment applied and filter restriction as a baseline',
  ],

  whenNotToRepair: [
    'Tanks corroded to the point where cleaning cannot restore them',
    'Fuel too degraded to be worth polishing, where disposal and replacement is the economical route',
    'Injection equipment already damaged by abrasives or water, which is not recoverable by cleaning',
    'Installations where the tank has no low-point drain and cannot be modified',
    'Where tank entry is required and cannot be carried out safely',
  ],

  prevention: [
    'Keep tanks reasonably full between runs — this is the single most effective measure against condensation on standby plant',
    'Drain the water separator and tank low point on a defined schedule, not when a problem appears',
    'Fit and maintain a breather filter; unfiltered breathing draws in moist dusty air continuously',
    'Sample fuel from the BOTTOM periodically, especially where turnover is low',
    'Treat stored fuel where it sits for long periods',
    'Track filter restriction and change intervals — a shortening interval is an early warning of tank condition',
    'Exercise standby sets meaningfully so fuel is turned over rather than left standing',
  ],

  relatedSlugs: ['generator-excessive-smoke', 'generator-starts-then-stops'],

  faq: [
    {
      q: 'The fuel looks clean in the sight glass. Can it still be contaminated?',
      a: 'Easily, and this is the commonest reason contamination is missed. Water is denser than diesel and settles to the tank floor, taking sludge and microbial growth with it, so the fuel above can be perfectly clear and bright while the problem sits underneath. Draw a sample from the BOTTOM of the tank and let it settle in a clean glass jar — that is the sample that tells you something.',
    },
    {
      q: 'We change the filters more often and it runs fine. Is that a solution?',
      a: 'It is symptom management, and the shortening interval is itself the diagnostic. Filters capture what the tank keeps producing, so a filter blocking well before its interval is telling you about tank condition rather than filter quality. Meanwhile the contamination that gets through is wearing injection equipment, which is the expensive part.',
    },
    {
      q: 'Why do our standby sets have worse fuel than the ones that run all day?',
      a: 'Because standing still is what causes it. Low turnover gives water time to separate out, and the interface between that water and the fuel is exactly where microbial colonies establish. A part-full tank also condenses fresh water every night as temperatures swing. Keeping tanks reasonably full, draining the separator on schedule and exercising the set meaningfully addresses all three.',
    },
    {
      q: 'Can we just add a biocide and carry on?',
      a: 'Biocide kills the organisms but does not remove the biomass, and dead colonies still block filters — sometimes worse immediately after treatment as material is released. It also does nothing about the water that allowed growth in the first place. Treatment belongs alongside removing the water, cleaning the tank and closing the ingress route, not instead of them.',
    },
  ],

  references: [
    'ISO 8217 and the applicable national diesel fuel specification — verify the current requirements, as fuel standards are periodically revised',
    'ISO 4406 — method for coding the level of contamination by solid particles, as applied to fuel cleanliness',
    'ISO 8528 — reciprocating internal combustion engine driven alternating current generating sets',
    'Confined space entry legislation and guidance applicable in Kenya, where tank entry is contemplated — verify current requirements directly',
    'The engine manufacturer\'s data for the specific engine, which is the only valid source for permissible fuel specification, filter ratings, restriction limits and service intervals referred to throughout',
  ],
};
