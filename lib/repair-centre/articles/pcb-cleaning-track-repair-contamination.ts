import type { RepairArticle } from '../types';

export const pcbCleaningTrackRepairContamination: RepairArticle = {
  slug: 'pcb-cleaning-track-repair-contamination',
  hub: 'pcb-motherboards',
  header: {
    title: 'Board Cleaning, Track Repair and Contamination — Undoing Water and Dust Damage',
    equipmentCategory: 'Industrial control PCB',
    appliesTo:
      'Control boards from generator panels, inverters, UPS units, drives and industrial equipment exposed to water ingress, humidity, dust or battery electrolyte',
    difficulty: 'advanced',
    diagnosisComplexity:
      'The damage is usually visible; the difficulty is knowing what is salvageable and resisting the urge to power it up before it is genuinely dry',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'Low-voltage logic and control circuitry; boards may sit adjacent to mains and DC bus potentials in the equipment',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A contaminated board fails in two ways: leakage across high-impedance nodes causing erratic behaviour, and corrosion eating tracks and component leads until a connection opens. Both are recoverable if caught before the copper is gone, and neither is recoverable by drying alone — the residue that causes leakage stays behind when the water evaporates, which is why boards often work briefly after drying and then fail again. The sequence that works is: do not power it, photograph it, clean it properly with a solvent suited to the board, remove any component whose interior is contaminated because you cannot clean inside a relay or a connector, dry it fully, then inspect every track and repair the breaks before applying power. The judgement that matters most is when to stop: multi-layer boards with corrosion that has reached inner layers, boards with contamination under fine-pitch devices, and anything attacked by battery electrolyte are usually beyond economic recovery, and powering them proves nothing except that they fail.',

  symptoms: {
    display: [
      'Erratic display behaviour — flicker, corruption, or intermittent blanking',
      'Readings that drift or jump without a corresponding change in the measured quantity',
      'Inputs registering as active when nothing is connected to them',
      'Equipment reporting faults that make no sense against the physical state of the plant',
    ],
    indicators: [
      'Behaviour that changes with humidity, weather or time of day',
      'Faults that clear when the enclosure is opened and the board warms and dries slightly',
      'Intermittent alarms with no repeatable trigger',
    ],
    sounds: ['Relays chattering, or picking up when they should not, from leakage across a drive circuit'],
    smells: [
      'Musty or damp smell inside the enclosure',
      'Acrid smell where electrolyte has attacked the board',
      'Burnt smell where leakage has already caused a component to fail',
    ],
    behaviour: [
      'Fault appears after rain, washdown, or a change in season',
      'Equipment works when first powered and degrades over minutes as it warms and moisture migrates',
      'Fault worsens progressively over weeks, which is the corrosion signature rather than the leakage one',
      'Board previously dried out and returned to service, now failed again — the residue was never removed',
    ],
    visible: [
      'Water marks, tide lines or staining on the board surface',
      'Green or blue-green corrosion at component leads, vias and track edges',
      'White crystalline residue, typical of flux activated by moisture or of electrolyte',
      'Dust caked onto the board, particularly around fans and vents',
      'Tracks visibly thinned, discoloured or broken',
      'Corroded or discoloured connector pins and relay terminals',
      'Swollen or leaking electrolytic capacitors, which are both a cause and a consequence',
    ],
  },

  whatItMeans: {
    plain:
      'When water or damp dust gets onto a circuit board, two things happen. First, it creates unintended paths for electricity to leak between points that should be separate, which makes the equipment behave strangely and unpredictably. Second, it slowly eats away the thin copper tracks and component legs until a connection breaks completely. Drying the board does not fix the first problem, because the dirt that conducts is still there after the water has gone. That is why a board that seems fine after drying often fails again a few days later.',
    technical:
      'Contamination degrades a board through surface insulation resistance loss and through galvanic corrosion. Ionic residue combined with moisture forms a conductive film, and its effect is concentrated at high-impedance nodes — analogue sense inputs, reset and oscillator networks, and high-value feedback dividers — where even a small leakage current shifts the node significantly. This produces erratic, humidity-dependent behaviour rather than a hard failure. Corrosion is the slower mechanism: an electrolyte between dissimilar metals removes copper progressively from tracks, vias and leads until continuity is lost, and it continues after the board appears dry because the ionic residue remains hygroscopic. The two mechanisms explain the characteristic history of these faults — erratic behaviour first, hard failure later — and explain why removal of residue, not evaporation of water, is the actual repair.',
  },

  causes: {
    mostLikely: [
      'Water ingress through an unsealed or damaged enclosure, a failed gland, or a lid left off',
      'Condensation inside an enclosure that heats and cools daily, particularly outdoors',
      'Conductive dust accumulation in cement, quarry, milling and agricultural environments',
      'Battery electrolyte attack on boards mounted in or near battery compartments',
    ],
    possible: [
      'Washdown water directed at an enclosure not rated for it',
      'Roof or cable-entry leak dripping onto equipment over a long period',
      'Flux residue from previous repair work, never cleaned, becoming conductive with humidity',
      'Coolant, oil or fuel mist in engine rooms settling on boards and trapping dust',
    ],
    lessCommon: [
      'Cleaning with an unsuitable product that left conductive residue behind',
      'Board washed and returned to service before it was fully dry',
      'Salt-laden air at coastal installations accelerating corrosion',
      'Rodent urine, which is both conductive and highly corrosive',
    ],
    modelSpecific: [
      'Whether a board carries conformal coating, and which type, determines how it can be cleaned and how it must be recoated after repair',
      'Some boards carry components that must not be exposed to solvent or ultrasonic cleaning — check the equipment manufacturer guidance before choosing a method',
      'Board revision matters when replacing rather than repairing, as revisions are not always interchangeable',
    ],
    environmental: [
      'Humidity and wet-season condensation across much of Kenya, particularly in unheated outdoor enclosures',
      'Dust ingress at quarry, cement, agricultural and unsealed borehole sites',
      'Coastal salt air',
      'Engine-room environments combining heat, oil mist and vibration',
      'Enclosures that cool overnight and draw in moist air through breathers or unsealed entries',
    ],
    installation: [
      'Enclosure of insufficient ingress rating for the location',
      'Cable entries made from above without drip loops, so water tracks along the cable into the enclosure',
      'Glands not tightened or blanking plugs missing',
      'Enclosure mounted where washdown or roof drips reach it',
      'No breather or heater in an enclosure subject to daily temperature swings',
    ],
    maintenance: [
      'Enclosure opened in rain or left open overnight',
      'Doors not resealed, or seals perished and never replaced',
      'Dust never removed, so it accumulates until it becomes conductive with humidity',
      'Previous repair carried out without cleaning flux residue',
      'Board dried and returned to service without residue removal, guaranteeing a repeat',
    ],
    componentLevel: [
      'Track and via corrosion',
      'Component lead corrosion at the board interface',
      'Contamination inside relays, switches and connectors, which cannot be cleaned in place',
      'Electrolytic capacitor failure accelerated by moisture',
      'Connector pin corrosion causing intermittent contact',
    ],
  },

  safety: {
    isolation: [
      'Isolate the equipment supply, lock it and prove dead before removing any board.',
      'Treat a wet enclosure as a shock hazard until proved dead — water has made paths the design never intended.',
      'Observe DC-link discharge time in full on inverters, drives and UPS equipment.',
      'Where the enclosure is flooded, do not open live equipment at all — isolate upstream first.',
    ],
    lockoutTagout: [
      'Lock and tag the supply isolator.',
      'Disable and lock any auto-start that could energise the equipment.',
      'On UPS equipment, isolate and lock both mains and battery.',
    ],
    ppe: [
      'ESD wrist strap and mat for all board handling',
      'Nitrile gloves and eye protection when handling contaminated boards, particularly where electrolyte or rodent contamination is present',
      'Respiratory protection appropriate to the solvent in use, with adequate ventilation',
      'Acid-resistant gloves and eye protection where battery electrolyte is involved, and know where the eyewash is',
    ],
    storedEnergy: [
      'Bulk and DC-link capacitors hold a lethal charge after isolation; wait the manufacturer discharge time and prove dead.',
      'Battery-backed circuits stay energised with the equipment off.',
      'A wet board can hold charge in unexpected places through leakage paths.',
    ],
    specificHazards: [
      'Do not apply power to a wet or contaminated board to "see if it works". That converts a cleanable board into a scrapped one, and it is the single most common way these repairs are lost.',
      'Solvents are frequently flammable and produce vapour — ventilate, and keep away from any ignition source.',
      'Battery electrolyte is corrosive to skin and eyes and continues to attack the board until it is neutralised and removed.',
      'Rodent contamination is a biological hazard requiring gloves and appropriate hygiene.',
      'Compressed air used for drying disperses contaminated aerosol — use extraction and eye protection.',
    ],
    stopAndCallProfessional: [
      'The board has been immersed and is multi-layer — corrosion between inner layers cannot be seen or reliably repaired.',
      'Battery electrolyte has reached the board; the attack continues invisibly and the repair rarely holds.',
      'The equipment is safety-critical protection equipment.',
      'You do not have ESD-safe handling and a controlled drying method.',
      'The board is under warranty.',
      'You cannot identify a suitable solvent for the board and its components — the wrong product causes damage that is worse than the contamination.',
    ],
  },

  tools: [
    { tool: 'Illuminated magnification or a stereo microscope', why: 'Corrosion, thin tracks and residue under components are not visible to the unaided eye' },
    { tool: 'Board-safe cleaning solvent appropriate to the assembly', why: 'The wrong product attacks plastics, labels and conformal coating, and some leave conductive residue' },
    { tool: 'Soft anti-static brushes', why: 'Mechanical agitation is what actually removes residue; solvent alone does not' },
    { tool: 'Controlled drying — a low-temperature oven or a warm dry cabinet', why: 'A board that is merely surface-dry will still fail; controlled drying reaches moisture trapped under components' },
    { tool: 'Insulation resistance or high-resistance measurement capability', why: 'Objective confirmation that surface insulation has been restored, rather than a visual judgement' },
    { tool: 'Multimeter with fine probes', why: 'Track continuity testing along suspect runs' },
    { tool: 'Fine soldering iron, wire and repair materials', why: 'Track repair and lead replacement' },
    { tool: 'Conformal coating of the correct type', why: 'Recoating after repair, where the board was coated originally' },
    { tool: 'Current-limited bench supply', why: 'First power-up after cleaning must be current-limited, in case a leakage path remains' },
  ],

  decisionTree: [
    {
      question: 'Has the board been powered since it got wet?',
      yes: 'Expect additional damage — leakage under power drives corrosion and can destroy components',
      no: 'Good. Keep it that way until cleaning and drying are complete.',
    },
    {
      question: 'Is battery electrolyte involved?',
      yes: 'Recovery is unlikely to hold. Assess replacement before investing time.',
      no: 'Continue with the cleaning assessment',
    },
    {
      question: 'Is corrosion confined to the surface, with tracks still identifiable?',
      yes: 'Cleaning and track repair are viable',
      no: 'Corrosion into inner layers or through vias on a multi-layer board is not economically repairable',
    },
    {
      question: 'Is contamination present under fine-pitch devices or inside relays and connectors?',
      yes: 'Those components must come off and be replaced — you cannot clean inside them',
      no: 'Surface cleaning should reach everything',
    },
    {
      question: 'After cleaning and full drying, has surface insulation resistance been restored?',
      yes: 'Proceed to track inspection and repair',
      no: 'Residue remains. Clean again rather than powering it.',
    },
    {
      question: 'Has the reason the board got contaminated been corrected?',
      yes: 'Return to service',
      no: 'Fix the enclosure, gland or drip path first, or the repaired board simply follows the old one',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Do not apply power, and record the state',
      inspect: 'The board as found, both sides, and the enclosure it came from',
      where: 'On the bench and at the installation',
      instrument: 'Camera and illuminated magnification',
      expected: 'A complete photographic record before anything is disturbed',
      ifAbnormal:
        'Note tide lines, staining and the position of the board in the enclosure — these tell you where water entered and whether it will return',
      next: 'Photograph the enclosure too. The cause of the contamination is at the installation, not on the board.',
      warning:
        'Powering a contaminated board to "see what happens" is how a recoverable board becomes scrap. Leakage under power drives corrosion rapidly and can destroy components that were undamaged.',
    },
    {
      step: 2,
      title: 'Identify the contaminant',
      inspect: 'The nature of the residue and its distribution',
      where: 'Across the board, particularly low points and under components',
      instrument: 'Magnification, and the history of the installation',
      expected: 'A clear identification: clean water, dirty water, dust, oil mist, electrolyte or biological',
      ifAbnormal:
        'Electrolyte requires neutralisation before cleaning and rarely produces a durable repair. Rodent contamination is both conductive and aggressively corrosive.',
      next: 'The contaminant determines the cleaning method and whether recovery is worth attempting at all',
      warning:
        'Battery electrolyte continues attacking the board after it appears dry. Assess replacement before investing hours in cleaning.',
    },
    {
      step: 3,
      title: 'Assess corrosion depth before committing to a repair',
      inspect: 'Tracks, vias, pads and component leads under magnification',
      where: 'Both sides, and around every via in the affected area',
      instrument: 'Stereo microscope or high-power illuminated magnification',
      expected:
        'Corrosion confined to the surface, with tracks still continuous and pads intact',
      ifAbnormal:
        'Corrosion entering vias on a multi-layer board means it has reached inner layers that cannot be inspected or repaired. Lifted or missing pads mean substantial rework.',
      next: 'This is the point to decide repair or replace, before hours are spent',
      verify:
        'Establish whether the board is multi-layer from the equipment documentation; the answer changes the assessment entirely',
    },
    {
      step: 4,
      title: 'Remove components that cannot be cleaned internally',
      inspect: 'Relays, switches, connectors, trimmers and any sealed component in the contaminated area',
      where: 'The affected region of the board',
      instrument: 'Soldering and desoldering equipment',
      expected: 'Contaminated sealed components removed and set aside for replacement',
      ifAbnormal:
        'A relay or connector with contamination inside will fail later regardless of how well the board surface is cleaned',
      next: 'Replace these rather than attempting to clean them in place',
      warning:
        'Note orientation and position of everything removed, and photograph before removal. Reassembly from memory is where errors enter.',
    },
    {
      step: 5,
      title: 'Clean properly — solvent plus agitation',
      inspect: 'The whole board, especially under components and around high-impedance nodes',
      where: 'Both sides, working systematically rather than only where damage is visible',
      instrument: 'Board-safe solvent and soft anti-static brushes',
      expected: 'Residue physically removed, not merely wetted and redistributed',
      ifAbnormal:
        'Residue remaining under a component will keep the fault. Contamination migrates during cleaning if it is not lifted away.',
      next: 'Repeat until no residue is visible under magnification',
      verify:
        'Confirm the solvent is compatible with the board, its labels, its connectors and any conformal coating before use',
      warning:
        'Ventilate properly. Many board solvents are flammable and produce vapour that accumulates in a closed workshop.',
    },
    {
      step: 6,
      title: 'Dry fully, and prove it rather than assuming it',
      inspect: 'Moisture remaining in the assembly, particularly under components',
      where: 'The whole board',
      instrument: 'Low-temperature oven or warm dry cabinet, then insulation resistance measurement',
      expected:
        'Surface insulation resistance restored to a high, stable value across areas that were contaminated',
      ifAbnormal:
        'A low or drifting reading means residue or moisture remains. Clean and dry again — do not power it.',
      next: 'This measurement is the objective test that the cleaning actually worked',
      verify:
        'Use a drying temperature the board and its components tolerate; excessive heat damages plastics, electrolytics and labels',
      warning:
        'Surface-dry is not dry. Moisture trapped under a component re-emerges when the board warms in service, and the fault returns.',
    },
    {
      step: 7,
      title: 'Test and repair every track in the affected area',
      inspect: 'Continuity of each track through the contaminated region',
      where: 'End to end along each affected run, not just where damage is visible',
      instrument: 'Multimeter with fine probes, under magnification',
      expected: 'Full continuity on every track, and no unintended continuity between adjacent runs',
      ifAbnormal:
        'A track thinned by corrosion may still show continuity while being unable to carry its working current — treat visible thinning as a break',
      next: 'Repair breaks with appropriately rated wire, secured so it cannot move or chafe',
      warning:
        'Check for shorts between adjacent tracks as well as for opens. Corrosion products bridge as readily as they break.',
    },
    {
      step: 8,
      title: 'First power-up current-limited, then verify in the equipment',
      inspect: 'Current draw at first power-up, then full function in the equipment',
      where: 'Bench first, then the working installation',
      instrument: 'Current-limited bench supply, then the equipment itself',
      expected:
        'Current draw consistent with a healthy board, then correct operation across a full cycle',
      ifAbnormal:
        'Excessive current at first power-up means a leakage path or a damaged component remains — remove power immediately and re-investigate',
      next: 'Recoat with conformal coating where the board was originally coated, then return to service',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Cleaning method',
      steps: [
        'Use a solvent suited to the board and compatible with its components, labels and any conformal coating.',
        'Agitate with soft anti-static brushes — solvent without mechanical action does not remove ionic residue.',
        'Work systematically across the whole board rather than only where damage is visible; contamination spreads further than it shows.',
        'Where conformal coating is present and damaged, remove it locally in the affected area rather than attempting to clean through it.',
        'Dry in a low-temperature oven or dry cabinet, at a temperature the assembly tolerates.',
        'Confirm cleanliness by measuring surface insulation resistance, not by appearance.',
      ],
      note:
        'The residue is the fault, not the water. Evaporation removes the water and leaves the fault behind — which is why boards that were only dried fail again.',
    },
    {
      level: 'board-level',
      title: 'Track and pad repair',
      steps: [
        'Cut back a corroded track to clean copper at both ends of the break.',
        'Bridge with wire of adequate current rating, routed along the original path where practical.',
        'Secure repair wires so they cannot move, chafe or lift; an unsecured wire becomes the next fault.',
        'Where a pad has lifted or been consumed, rebuild it using an accepted rework method rather than relying on solder alone.',
        'Inspect every repair under magnification, and confirm continuity and absence of shorts to neighbours before proceeding.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Replacing what cannot be cleaned',
      steps: [
        'Replace relays, switches, connectors and trimmers that had contamination inside them.',
        'Replace electrolytic capacitors in the affected area — moisture accelerates their degradation and they are cheap relative to a return visit.',
        'Replace components with visibly corroded leads even if they still test correctly; the corrosion continues.',
        'Clean all flux residue after every replacement, because new residue reintroduces the original failure mechanism.',
      ],
    },
    {
      level: 'configuration',
      title: 'Fix the cause, not just the board',
      steps: [
        'Repair or replace enclosure seals, glands and blanking plugs.',
        'Form drip loops on cable entries so water cannot track along the cable into the enclosure.',
        'Fit an enclosure heater or breather where daily temperature swings cause condensation.',
        'Relocate or shield equipment exposed to washdown or roof drips.',
        'Establish a cleaning interval for dusty environments before dust becomes conductive.',
        'Recoat with conformal coating where the board was originally coated.',
      ],
      note:
        'Returning a cleaned board to the enclosure that contaminated it guarantees the repeat. The enclosure is part of the repair.',
    },
  ],

  validation: [
    'Surface insulation resistance restored and stable across previously contaminated areas',
    'Continuity confirmed on every track in the affected region, with no shorts to adjacent runs',
    'Current draw at first power-up consistent with a healthy board',
    'Equipment operating correctly through a full cycle in its working position',
    'Behaviour stable across a humid period, not only on the day of repair',
    'Conformal coating restored where it was originally present',
    'Enclosure ingress path identified and corrected, and recorded',
  ],

  whenNotToRepair: [
    'Multi-layer boards with corrosion into vias or inner layers — the damage cannot be inspected or reliably repaired',
    'Boards attacked by battery electrolyte, where the attack continues after apparent cleaning',
    'Contamination under fine-pitch or BGA devices that cannot be removed without reworking those parts',
    'Extensive track loss across multiple areas, where repair wires would outnumber original tracks',
    'Safety-critical protection equipment',
    'Boards where the cleaning and repair time approaches the cost of a replacement carrying a warranty',
    'Any board where the fault is intermittent after cleaning — trusting a control board that has not fully recovered is worse than replacing it',
  ],

  prevention: [
    'Specify enclosures with an ingress rating matched to the actual environment, not the intended one',
    'Form drip loops on every cable entry and keep glands and blanking plugs complete',
    'Replace perished door seals as routine, not on failure',
    'Fit enclosure heaters or breathers where daily temperature swings cause condensation',
    'Clean dust from enclosures on an interval matched to the site; conductive dust is a slow-motion failure',
    'Never open an enclosure in rain, and never leave one open overnight',
    'Clean flux residue after every repair, on every board, without exception',
    'Keep boards conformally coated where the manufacturer supplied them coated',
  ],

  relatedSlugs: [
    'pcb-short-circuit-diagnosis',
    'motherboard-power-rail-diagnosis',
    'pcb-reset-supervisor-clock-faults',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'The board got wet and I dried it, but it failed again. Why?',
      a: 'Because drying removes the water and leaves the residue. That residue is what conducts, and it draws moisture back out of the air. The repair is removal of the residue by cleaning with solvent and mechanical agitation, then proper drying — not evaporation.',
    },
    {
      q: 'Can I power it up just to see whether it still works?',
      a: 'No, and this is the most costly mistake with contaminated boards. Leakage paths under power drive corrosion rapidly and can destroy components that were undamaged. Clean, dry and prove the insulation first, then power up current-limited.',
    },
    {
      q: 'Is rice or a hairdryer good enough for drying?',
      a: 'No. Both address surface moisture only, and a hairdryer can drive moisture further under components or overheat them. Controlled low-temperature drying reaches trapped moisture, and an insulation resistance measurement is what proves it worked.',
    },
    {
      q: 'The corrosion looks light. Is the board saveable?',
      a: 'Often yes, if it is confined to the surface and the tracks are still identifiable. The question that decides it is whether corrosion has entered vias on a multi-layer board — inner-layer damage cannot be seen or repaired, and no amount of surface work addresses it.',
    },
    {
      q: 'Battery acid got on the board. Can it be cleaned?',
      a: 'Rarely with a durable result. Electrolyte penetrates and keeps attacking after the board appears clean, so these repairs tend to fail weeks later. Assess replacement before spending hours on recovery.',
    },
    {
      q: 'Do I need to recoat the board afterwards?',
      a: 'If it was supplied with conformal coating, yes. The coating was part of its environmental protection, and a board returned to a damp enclosure without it is far more vulnerable than it was originally.',
    },
  ],

  references: [
    'Equipment manufacturer service documentation and any stated cleaning restrictions for the assembly',
    'Solvent manufacturer compatibility data and safety data sheet',
    'IPC-A-610 — acceptability of electronic assemblies, including cleanliness criteria',
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies, for track and pad repair methods',
    'IPC-CH-65 — guidelines for cleaning printed boards and assemblies',
    'IEC 60529 — degrees of protection provided by enclosures (IP code), for specifying enclosure ingress rating',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
  ],
};
