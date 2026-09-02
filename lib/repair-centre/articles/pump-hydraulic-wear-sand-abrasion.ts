import type { RepairArticle } from '../types';

export const pumpHydraulicWearSandAbrasion: RepairArticle = {
  slug: 'pump-hydraulic-wear-sand-abrasion',
  hub: 'pumps',
  header: {
    title: 'Hydraulic Wear and Sand Abrasion — Why the Borehole Output Keeps Falling',
    equipmentCategory: 'Submersible borehole pump',
    appliesTo:
      'Multistage submersible borehole pumps, and surface centrifugal pumps handling abrasive-laden water, in agricultural, municipal and industrial supply',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'The measurement is simple; the difficulty is separating a worn pump from a failing borehole, because both reduce delivery and only one is fixed by pulling the pump',
    competence: 'technician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Motor supply 415 V three-phase or 240 V single-phase, 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A borehole pump whose output has fallen gradually over months is either worn or being starved, and those two causes lead to completely different work. Wear is progressive internal erosion — sand passing through the stages erodes impellers and wear rings, so the clearances open, water recirculates internally instead of being lifted, and delivery falls while current often falls with it. Starvation is the borehole itself no longer yielding what it did, and no amount of pump work will fix it. Separate them before mobilising a rig: measure delivered flow and pressure, measure standing and pumping water level, and compare current against the historical figure. A worn pump draws less current than it used to because it is doing less work; a pump straining against a blockage or a seized bearing draws more. Sand is nearly always the underlying cause, and replacing a worn pump without addressing why sand is entering guarantees the replacement wears the same way.',

  symptoms: {
    display: [
      'Delivered flow below the design figure at the same head',
      'Pressure at the wellhead lower than it used to be for the same duty',
      'Running current below the historical figure for the same conditions',
      'Longer run times to fill the same tank',
    ],
    indicators: [
      'Pump running for extended periods where it used to cycle',
      'Pressure switch taking longer to satisfy, or never satisfying',
      'Level control calling almost continuously',
    ],
    sounds: [
      'A gritty or rumbling note from the rising main, indicating sand passing through',
      'Cavitation noise like gravel in the pump, indicating the pump is being starved',
      'Change in note as the water level draws down during a run',
    ],
    smells: ['Usually none — this is a mechanical and hydraulic fault'],
    behaviour: [
      'Output falling gradually over months rather than suddenly — the wear signature',
      'Output falling suddenly — points at a blockage, a burst rising main or a non-return valve failure instead',
      'Performance worse in the dry season and better after rains, which points at the borehole rather than the pump',
      'Pump delivers well at the start of a run and falls away as the level draws down',
      'Sand accumulating in tanks, filters or at the wellhead',
      'Second pump in a few years, with the same symptom developing again',
    ],
    visible: [
      'Sand or silt accumulating in the storage tank, strainers or filters',
      'Sand deposits at the wellhead or in the delivery line',
      'Impellers eroded, with thinned or grooved vanes, on a recovered pump',
      'Wear rings and bowls scored, with clearances visibly opened',
      'Pump casing and stages polished or grooved along the flow path',
      'Shaft or coupling wear at the stages',
      'Rising main internally scoured, or thinned at bends',
      'Borehole screen damaged or the gravel pack disturbed, where records or a camera survey show it',
    ],
  },

  whatItMeans: {
    plain:
      'A borehole pump lifts water by spinning impellers inside close-fitting housings. The small gaps between the moving and fixed parts are what stop water slipping backwards instead of being pushed up. Sand in the water acts like grinding paste and slowly wears those parts, so the gaps open up. Once they do, more and more water simply circulates inside the pump instead of going up the pipe, and delivery falls even though the motor is turning perfectly. It also means the pump is working less hard, so it draws less electricity — which is a useful clue that separates wear from a blockage.',
    technical:
      'A multistage centrifugal pump develops head across successive impeller and diffuser stages, and its efficiency depends on maintaining designed running clearances at wear rings and stage interfaces. Abrasive particles in the pumped fluid erode those surfaces progressively, opening the clearances and allowing internal recirculation from the high-pressure side of each stage back to the low-pressure side. The consequence is a downward shift of the pump curve: less head developed for the same speed, therefore less flow delivered against the system resistance. Because the hydraulic work being done falls, absorbed shaft power falls with it, so motor current typically decreases as wear progresses — the opposite of the increase seen with mechanical binding or a partially blocked discharge. This current signature is diagnostically valuable and cheap to obtain. Separately, a falling water table or a reduced borehole yield produces a similar delivery reduction by a different mechanism, and the distinguishing measurement is drawdown: a healthy pump in a failing borehole shows a pumping level that falls steeply during operation, while a worn pump in a healthy borehole shows normal drawdown with reduced output.',
  },

  causes: {
    mostLikely: [
      'Sand and silt in the pumped water eroding impellers, wear rings and stage clearances over time',
      'Borehole yield reduced or water table fallen, so the pump is starved rather than worn',
      'Pump set too close to the borehole bottom, drawing sediment continuously',
      'Borehole screen or gravel pack failure allowing formation material into the well',
    ],
    possible: [
      'Non-return valve failed, allowing the column to drain back between runs',
      'Rising main leaking or corroded through, losing water before it reaches the surface',
      'Pump run against a partly closed valve or a blocked strainer, accelerating internal wear',
      'Pump oversized for the borehole yield, so it draws the level down and pulls in sediment',
      'Cavitation from insufficient submergence, eroding impeller inlets',
    ],
    lessCommon: [
      'Wrong pump specification for the water quality — a standard pump in abrasive water',
      'Impeller detached or loose on the shaft',
      'Motor running at reduced speed, on inverter-fed installations',
      'Chemical scaling narrowing passages rather than abrasion widening clearances',
      'Reverse rotation on a three-phase pump after a phase change, which reduces output without obvious noise',
    ],
    modelSpecific: [
      'The pump duty point, its design flow and head, and the acceptable wear limits are pump manufacturer figures for the specific model and stage count',
      'Whether the pump is available in an abrasion-resistant construction is model-specific and matters where sand is unavoidable',
      'Minimum submergence and minimum flow requirements are stated by the pump manufacturer',
      'Acceptable sand content for the pump as supplied is a manufacturer figure and is often far lower than site conditions',
    ],
    environmental: [
      'Sand-bearing aquifers, common across much of Kenya and a leading cause of shortened pump life',
      'Seasonal water table variation, with dry-season drawdown exposing the pump to more sediment',
      'Boreholes drilled into unconsolidated formations without adequate screen and gravel pack design',
      'Prolonged drought reducing yield so the pump runs closer to its minimum submergence',
      'High silt loading after heavy rains recharging the aquifer',
    ],
    installation: [
      'Pump set too deep, in the sediment zone at the bottom of the borehole',
      'Pump selected on flow alone without regard to borehole yield, so it over-pumps the well',
      'Screen slot size or gravel pack not matched to the formation, admitting sand from the start',
      'Borehole never properly developed after drilling, so fines were never removed',
      'No sand separator or sediment provision where the water quality demanded one',
    ],
    maintenance: [
      'Flow and pressure never recorded, so gradual decline is invisible until it becomes a complaint',
      'Water level never measured, so a falling table is mistaken for a failing pump',
      'Running current never trended, losing the cheapest available diagnostic signal',
      'Sand accumulation in tanks noticed but never traced back to its cause',
      'Pump replaced repeatedly without the borehole ever being surveyed',
    ],
    componentLevel: [
      'Impeller vane erosion',
      'Wear ring and stage clearance loss',
      'Diffuser and bowl scouring',
      'Shaft and bearing wear from abrasive ingress',
      'Non-return valve seat erosion',
      'Rising main internal scour',
    ],
  },

  safety: {
    isolation: [
      'Isolate the pump supply at the panel, lock it and prove dead before any work.',
      'Disable and lock any automatic level or pressure control — it will start the pump without warning.',
      'Where a generator supplies the borehole, isolate and lock it and consider its auto-start.',
      'Depressurise the delivery pipework before breaking any joint.',
    ],
    lockoutTagout: [
      'Lock and tag the pump isolator and the automatic control.',
      'Where lifting equipment is on site, agree and record the lift plan before starting.',
      'Barrier and cover the wellhead whenever it is open and unattended.',
    ],
    ppe: [
      'Hard hat, gloves and appropriate footwear whenever a rig or lifting equipment is on site',
      'Eye protection when working on pipework under any residual pressure',
      'Gloves when handling a recovered pump — borehole water and pump surfaces are contaminated',
      'Fall protection and a barrier around an open wellhead',
    ],
    storedEnergy: [
      'The rising main full of water carries very substantial weight; lifting equipment must be rated for the full wet weight.',
      'Delivery pipework and pressure vessels hold pressure after the pump stops.',
      'Inverter DC-link capacitors hold charge where a drive is fitted.',
      'A suspended pump and rising main is stored mechanical energy — never work beneath it.',
    ],
    specificHazards: [
      'An open borehole is a serious fall hazard and must be barriered and covered whenever unattended.',
      'Dropping a pump and rising main down the hole can injure anyone at the wellhead and may render the borehole unusable.',
      'Borehole water is a biological hazard, particularly on a drinking-water supply; contamination control matters more than speed.',
      'Running a pump dry to test it destroys the pump and, on some designs, the motor within minutes.',
      'Pressure vessels and air-charged tanks store considerable energy and must be depressurised properly.',
    ],
    stopAndCallProfessional: [
      'You do not have lifting equipment rated for the full wet weight of pump, rising main and water column.',
      'The borehole serves drinking water and anything is to be introduced into the well.',
      'Borehole yield appears to have failed — that requires a hydrogeological assessment, not a pump replacement.',
      'The borehole requires a camera survey, redevelopment or rehabilitation.',
      'Sand content is high enough that a standard pump cannot survive — that is a design decision.',
      'Any situation where the well construction records are unavailable and the pump setting depth cannot be established safely.',
    ],
  },

  tools: [
    { tool: 'Flow meter, or a calibrated container and stopwatch', why: 'Delivered flow is the primary measurement; an impression of "less water" is not a diagnosis' },
    { tool: 'Pressure gauge at the wellhead', why: 'Flow and pressure together locate the pump on its curve; either alone is ambiguous' },
    { tool: 'Water level meter (dipper)', why: 'Standing and pumping level separate a worn pump from a failing borehole — the single most important distinction here' },
    { tool: 'Clamp meter, true-RMS', why: 'Running current trend distinguishes wear (current falls) from binding or blockage (current rises)' },
    { tool: 'Imhoff cone or sand content test equipment', why: 'Quantifies sand in the delivered water rather than judging it by the deposit in a tank' },
    { tool: 'Borehole camera survey, where available', why: 'Shows screen condition, sediment level and casing integrity without guesswork' },
    { tool: 'Pump manufacturer curve and duty data', why: 'The measured flow and head mean nothing without the curve they are being compared against' },
    { tool: 'Borehole completion record', why: 'Depth, screen positions, gravel pack and original yield — the reference for everything measured' },
  ],

  decisionTree: [
    {
      question: 'Did output fall gradually over months, or suddenly?',
      yes: 'Gradual decline is consistent with wear or a declining borehole — continue',
      no: 'A sudden fall points at a blockage, a burst rising main, a failed non-return valve or an electrical fault',
    },
    {
      question: 'Does the pumping water level fall steeply during a run and recover slowly afterwards?',
      yes: 'The borehole is the limitation, not the pump. Pulling the pump will not help.',
      no: 'The borehole is yielding; continue assessing the pump',
    },
    {
      question: 'Has running current fallen compared with the historical figure?',
      yes: 'Consistent with internal wear — the pump is doing less hydraulic work',
      no: 'Current risen suggests binding, a blockage or a mechanical fault instead',
    },
    {
      question: 'Is there measurable sand in the delivered water?',
      yes: 'Abrasion is the cause. Address the sand source or the replacement wears the same way.',
      no: 'Look at scaling, valve failure or rising main condition',
    },
    {
      question: 'Do measured flow and head place the pump well below its published curve?',
      yes: 'The pump is worn and requires replacement or overhaul',
      no: 'The pump is performing; the limitation is elsewhere in the system',
    },
    {
      question: 'Is the pump set at a depth that draws from the sediment zone?',
      yes: 'Reset it higher within the water column as part of the work',
      no: 'Investigate screen and gravel pack condition as the sand source',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Measure what is actually being delivered',
      inspect: 'Flow and pressure at the wellhead under normal running',
      where: 'Delivery line at the wellhead',
      instrument: 'Flow meter or calibrated container and stopwatch, plus a pressure gauge',
      expected: 'Flow and pressure consistent with the pump duty point and the original commissioning record',
      ifAbnormal:
        'Both figures are needed. Flow alone cannot distinguish a worn pump from a system restriction, because a restriction reduces flow while raising pressure.',
      next: 'Compare against the commissioning record if one exists; where it does not, start the record now',
      verify: 'The design duty point comes from the pump manufacturer curve for the specific model and stage count',
    },
    {
      step: 2,
      title: 'Measure standing and pumping water level',
      inspect: 'Water level before starting, and during a sustained run',
      where: 'The borehole, via the dip tube where fitted',
      instrument: 'Water level meter',
      expected:
        'Pumping level stabilising at a depth consistent with the borehole yield and the original test pumping record',
      ifAbnormal:
        'A level that falls steeply and continues falling means the borehole cannot supply what the pump is trying to take. That is not a pump fault and no pump work will resolve it.',
      next: 'Note the recovery rate after stopping — slow recovery confirms a yield problem',
      warning:
        'This single measurement prevents the most expensive error in borehole work: pulling a perfectly good pump out of a failing well.',
    },
    {
      step: 3,
      title: 'Compare running current against the history',
      inspect: 'Running current on all phases under normal duty',
      where: 'Control panel',
      instrument: 'True-RMS clamp meter',
      expected: 'Balanced current, consistent with the motor nameplate and the historical figure for this installation',
      ifAbnormal:
        'Current lower than historical is consistent with internal wear — the pump is doing less work. Current higher suggests binding, a partly blocked discharge, or a mechanical fault. This is the cheapest diagnostic signal available.',
      next: 'Check phase balance at the same time; imbalance is an electrical fault requiring the drop cable guide',
      verify: 'Motor full-load current is on the motor nameplate',
    },
    {
      step: 4,
      title: 'Quantify the sand in the water',
      inspect: 'Sand content in the delivered water, sampled during a run',
      where: 'At the wellhead delivery',
      instrument: 'Imhoff cone or a sand content test, sampled after the pump has been running',
      expected: 'Sand content within the pump manufacturer acceptable figure for the pump as supplied',
      ifAbnormal:
        'Measurable sand is the underlying cause of the wear, and it will destroy a replacement pump exactly as it destroyed this one',
      next:
        'Sample during a run rather than at start-up, and note whether content rises as the level draws down',
      verify:
        'The acceptable sand content for the pump is a manufacturer figure and is frequently far lower than site conditions',
    },
    {
      step: 5,
      title: 'Check the system before blaming the pump',
      inspect: 'Non-return valve, rising main integrity, valve positions and any strainer',
      where: 'Wellhead, delivery line and control valves',
      instrument: 'Visual, pressure testing where practical',
      expected: 'Non-return valve holding, rising main sound, valves fully open, strainers clear',
      ifAbnormal:
        'A failed non-return valve lets the column drain back between runs. A holed rising main loses water before it surfaces. Both mimic a worn pump and neither requires the pump to be replaced.',
      next: 'A pressure test of the rising main will reveal a leak that no amount of pump assessment would',
    },
    {
      step: 6,
      title: 'Establish where the pump sits and what the borehole looks like',
      inspect: 'Pump setting depth against the borehole completion record, and sediment level in the well',
      where: 'Borehole records, and a camera survey where available',
      instrument: 'Completion record, dipper, borehole camera',
      expected: 'Pump set within the water column, well clear of the sediment at the bottom',
      ifAbnormal:
        'A pump set too close to the bottom draws sediment continuously. Sediment that has risen since drilling reduces the available column and brings the pump into the abrasive zone.',
      next: 'A camera survey also shows screen condition and casing integrity, which identifies the sand entry point',
      verify: 'Original depth, screen positions and gravel pack come from the borehole completion record',
    },
    {
      step: 7,
      title: 'Assess the recovered pump against its curve',
      inspect: 'Impellers, wear rings, bowls and stage clearances on the pump once raised',
      where: 'On the surface, after recovery',
      instrument: 'Visual inspection with good light, and measurement against manufacturer wear limits',
      expected: 'A clear picture of wear extent and its distribution through the stages',
      ifAbnormal:
        'Vane erosion, scored wear rings and opened clearances confirm abrasion. Wear concentrated in the lower stages indicates sediment drawn from the bottom of the well.',
      next: 'Photograph the wear — it is the evidence that justifies addressing the sand source rather than simply refitting',
      warning: 'Never work beneath a suspended pump and rising main.',
    },
    {
      step: 8,
      title: 'Verify after the work, and start the record',
      inspect: 'Flow, pressure, running current, pumping level and sand content after replacement',
      where: 'The complete installation',
      instrument: 'The same instruments used in diagnosis',
      expected:
        'Flow and pressure at the duty point, current consistent with nameplate, pumping level stable, sand content reduced',
      ifAbnormal:
        'Sand content unchanged means the source has not been addressed and the new pump is already wearing',
      next:
        'Record every figure with the date as the baseline, so the next decline is measured rather than argued about',
    },
  ],

  repair: [
    {
      level: 'component-replacement',
      title: 'Pump replacement or overhaul',
      steps: [
        'Replace or overhaul against the manufacturer wear limits rather than by appearance.',
        'Where sand is unavoidable, specify an abrasion-resistant construction rather than a standard pump.',
        'Match the replacement to the borehole yield, not to the desired flow — an oversized pump over-pumps the well and draws in sediment.',
        'Renew the non-return valve at the same time; its seat erodes in the same water.',
        'Inspect and, where necessary, replace rising main sections that are internally scoured or thinned.',
      ],
      note:
        'Fitting an identical pump into an unchanged well is buying the same failure again on a known schedule.',
    },
    {
      level: 'mechanical',
      title: 'Addressing the sand at source',
      steps: [
        'Reset the pump higher in the water column, clear of the sediment zone, where depth allows.',
        'Have the borehole surveyed and, where indicated, redeveloped to remove accumulated fines.',
        'Where the screen or gravel pack is the entry point, borehole rehabilitation is the correct answer — not a different pump.',
        'Consider a sand separator where the water quality genuinely demands it and the well cannot be corrected.',
        'Where over-pumping is drawing sediment, reduce the duty to match the sustainable yield.',
      ],
      note:
        'Sand is the cause in most of these cases. Every hour spent on the well is worth more than an hour spent on the pump.',
    },
    {
      level: 'configuration',
      title: 'Protection and control',
      steps: [
        'Fit and correctly set dry-run protection, and never disable it after nuisance trips — investigate the cause instead.',
        'Set the overload relay to the motor nameplate full-load current and record it.',
        'Where the borehole yield is marginal, use level control with a rest period rather than continuous running.',
        'Confirm rotation direction on three-phase installations after any electrical work; reverse rotation quietly halves output.',
      ],
    },
    {
      level: 'cleaning-and-connections',
      title: 'System restoration',
      steps: [
        'Flush the delivery system and clear tanks and strainers of accumulated sand.',
        'Clean or replace blocked strainers and filters.',
        'Confirm all valves are fully open and that no throttling valve has been left partly closed.',
      ],
    },
  ],

  validation: [
    'Delivered flow and pressure at the pump duty point, measured and recorded',
    'Pumping water level stable during a sustained run, with normal recovery afterwards',
    'Running current balanced and consistent with the motor nameplate',
    'Sand content in the delivered water measured and within the pump manufacturer acceptable figure',
    'Non-return valve holding, confirmed by the column not draining between runs',
    'Dry-run protection functional and correctly set',
    'All figures recorded with the date as the baseline for the next comparison',
  ],

  whenNotToRepair: [
    'A failing borehole — declining yield is a hydrogeological matter and no pump work addresses it',
    'Boreholes where the screen or gravel pack has failed; that requires rehabilitation, not a new pump',
    'Pumps worn beyond the manufacturer overhaul limits, where replacement is more economic',
    'Installations where sand content far exceeds what any standard pump tolerates, until the well is corrected or the specification changed',
    'Any installation where the borehole completion record is unavailable and setting depth cannot be established safely',
    'Rising mains corroded along their length rather than at one point',
  ],

  prevention: [
    'Record flow, pressure, running current and pumping level at commissioning and at every service — gradual decline is invisible without a baseline',
    'Measure sand content periodically rather than waiting for deposits to appear in a tank',
    'Set the pump within the water column clear of the sediment zone, and re-check the setting as the well ages',
    'Size the pump to the sustainable borehole yield rather than to the desired flow',
    'Keep dry-run protection enabled and correctly set',
    'Have the borehole surveyed periodically on installations where sand is known to be present',
    'Specify abrasion-resistant construction from the outset where the aquifer is known to carry sand',
    'Monitor the water table seasonally so a dry-season decline is anticipated rather than diagnosed as a fault',
  ],

  relatedSlugs: [
    'borehole-pump-no-water-delivery',
    'borehole-drop-cable-and-motor-testing',
    'pump-runs-continuously',
    'three-phase-motor-failure-diagnosis',
  ],

  faq: [
    {
      q: 'The pump delivers less than it used to. Is it worn out?',
      a: 'Possibly, but measure the water level before assuming it. A borehole whose yield has fallen produces exactly the same complaint, and pulling a healthy pump out of a failing well is the most expensive mistake in this work. If the pumping level falls steeply during a run and recovers slowly, the well is the limitation.',
    },
    {
      q: 'Why does a worn pump draw LESS current?',
      a: 'Because it is doing less hydraulic work. As internal clearances open, water recirculates inside the pump instead of being lifted, so the load on the motor falls. That is a useful signature — current rising instead usually means binding, a blockage or a mechanical fault, which is a different problem entirely.',
    },
    {
      q: 'There is sand in the tank. Is that normal?',
      a: 'No. Measurable sand means abrasive material is passing through the pump continuously, and it is eroding the impellers and clearances every hour it runs. It is the underlying cause of most gradual output decline in boreholes, and it will destroy a replacement pump on the same schedule unless the source is addressed.',
    },
    {
      q: 'Can I just fit the same pump again?',
      a: 'You can, and if the sand source is unchanged it will wear exactly the same way. The useful work is at the well: reset the pump clear of the sediment zone, have the borehole surveyed and redeveloped if needed, and match the pump duty to the sustainable yield rather than to the flow you would like.',
    },
    {
      q: 'Output is fine at the start of a run and falls away. What does that mean?',
      a: 'That points at the borehole rather than the pump. The well delivers initially from stored water in the column, then the level draws down to what the formation can actually supply. A worn pump gives a consistently reduced output rather than one that fades during the run.',
    },
    {
      q: 'The pump was replaced last year and output is falling again. Why?',
      a: 'Because the cause was never addressed. Two pumps with the same wear pattern in the same well is not bad luck — it is sand, an over-pumped borehole, or a pump set into the sediment zone. Survey the well before buying a third pump.',
    },
  ],

  references: [
    'Pump manufacturer performance curve and duty data for the specific model and stage count',
    'Pump manufacturer acceptable sand content and wear limits for overhaul',
    'Borehole completion record — depth, screen positions, gravel pack, original test pumping yield and drawdown',
    'Commissioning records — flow, pressure, running current and pumping level at handover',
    'Motor nameplate data for full-load current',
    'Water Resources Authority borehole records and abstraction conditions where applicable in Kenya',
    'ISO 9906 — rotodynamic pumps: hydraulic performance acceptance tests',
  ],
};
