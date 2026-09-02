import type { RepairArticle } from '../types';

export const pcbRepairOrReplaceDecision: RepairArticle = {
  slug: 'pcb-repair-or-replace-decision',
  hub: 'pcb-motherboards',
  header: {
    title: 'Repair or Replace — Deciding Honestly on a Failed Control Board',
    equipmentCategory: 'Industrial control PCB',
    appliesTo:
      'Control and power boards from generator controllers, inverters, UPS units, drives, pump panels and industrial equipment',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'The technical diagnosis is the easy part; the honest judgement about consequence, availability and confidence is what this decision turns on',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Applies across control and power electronics regardless of system voltage',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Repair a board when the failure is understood, the cause is correctable, the parts are obtainable, and a failure of the repair is merely inconvenient. Replace it when any one of those is missing. The decision is not primarily about cost — it is about consequence and confidence. A board repaired without knowing why it failed will fail again, and on equipment that matters, an unpredictable board is worse than a dead one because it is trusted. The four questions that decide it are: do I know the root cause; can I correct it; can I verify the repair properly; and what happens if it fails again next month? Replace outright on safety-critical protection equipment, on boards with unidentified intermittent faults, where corrosion has reached inner layers, and where a programmed device has failed with no programmed replacement available. Repair readily where the fault is a single identified component, the cause is understood, the equipment is non-critical, and a replacement board is unobtainable or absurdly priced — which, on older plant in Kenya, it very often is.',

  symptoms: {
    display: [
      'Equipment dead, erratic, or reporting faults that do not match the plant state',
      'Fault returning after a previous board repair — the strongest single argument for replacement',
      'Intermittent behaviour that cannot be reproduced on demand',
    ],
    indicators: [
      'Repeated call-outs to the same equipment for the same symptom',
      'Board previously repaired, indicated by rework marks or added wire links',
    ],
    sounds: ['Relays cycling repeatedly, indicating a board that resets rather than runs'],
    smells: ['Burnt smell indicating a component has failed, which usually means a cause worth understanding'],
    behaviour: [
      'Fault appears and clears without intervention',
      'Equipment works after a repair then fails again within weeks',
      'Behaviour changes with temperature, humidity or vibration',
      'Board works on the bench but fails in the equipment',
    ],
    visible: [
      'Evidence of previous repair — reflowed joints, replaced components, added links',
      'Multiple failed components rather than one, which usually indicates a cause not yet found',
      'Corrosion entering vias on a multi-layer board',
      'Lifted or missing pads, or track damage across several areas',
      'Obsolete or unmarked custom devices with no available equivalent',
    ],
  },

  whatItMeans: {
    plain:
      'Once a board has failed you have two choices, and the cheapest option today is not always the right one. Repairing makes sense when you know exactly what broke and why, you can get the parts, and you can test the result properly. Replacing makes sense when any of that is missing — because a board that has been patched without understanding the cause will usually fail again, and if that happens on equipment people are relying on, the second failure costs far more than the board ever did.',
    technical:
      'The decision is a risk assessment rather than a cost calculation. Repair confidence depends on four independent conditions: root cause identified, root cause correctable, replacement parts obtainable with matching specification, and the repair verifiable under representative conditions including temperature and load. Failure of any one condition means the residual failure probability is unquantified. That residual probability is then weighted by consequence — a controller on a standby generator serving a hospital carries a very different weight from one on a workshop compressor. The common error is to treat a successful bench test as proof, when the bench does not reproduce the supply disturbance, thermal cycling, vibration or humidity that caused the original failure. The second common error is repairing the visible casualty without finding what killed it, which is why boards return with the same fault.',
  },

  causes: {
    mostLikely: [
      'Board fails again because the root cause was never identified — the repair addressed the casualty, not the killer',
      'Replacement board unobtainable for obsolete equipment, forcing a repair decision regardless of preference',
      'Replacement board priced at a level that makes repair the only realistic option for the owner',
      'Repair attempted on a board whose fault is intermittent and was never actually localised',
    ],
    possible: [
      'Programmed device failed with no programmed replacement available',
      'Board revision differences making a nominally correct replacement incompatible',
      'Configuration lost with the old board because it was never recorded',
      'Repair carried out competently but the equipment environment destroys the board again',
    ],
    lessCommon: [
      'Counterfeit or out-of-specification replacement components causing early failure of the repair',
      'A replacement board that fails on arrival because the original cause is still present in the installation',
      'Warranty voided by a repair attempt that would otherwise have been covered',
    ],
    modelSpecific: [
      'Board revision compatibility differs by manufacturer, and a later revision is not always a drop-in replacement',
      'Some manufacturers supply exchange units, which changes the economics entirely — establish this before deciding',
      'Configuration and calibration data may be board-specific and must be recorded before removal',
      'Some equipment pairs boards to serial numbers or licences, so a physical replacement alone will not work',
    ],
    environmental: [
      'Installations with recurring supply disturbances, where any board will have a shortened life until that is addressed',
      'High-vibration mountings that fracture joints regardless of repair quality',
      'Dusty or humid environments that will contaminate a replacement as readily as the original',
      'High ambient temperature shortening the life of electrolytics on any board fitted',
    ],
    installation: [
      'Poor enclosure protection guaranteeing repeat contamination',
      'Control supply that dips during load transitions, stressing every board fitted',
      'Absent or failed surge protection at a site with frequent lightning',
      'Board mounted where it experiences conditions it was not designed for',
    ],
    maintenance: [
      'No record of previous repairs, so a repeat failure is not recognised as a repeat',
      'Configuration never documented, so a replacement cannot be commissioned correctly',
      'No spares strategy on equipment where downtime is expensive',
    ],
    componentLevel: [
      'Single identified component failure — the strongest case for repair',
      'Multiple failed components — usually indicates an upstream cause still present',
      'Failed programmed or custom device — usually decides for replacement',
      'Substrate damage from corrosion or heat — usually decides for replacement',
    ],
  },

  safety: {
    isolation: [
      'Isolate, lock off and prove dead before removing any board, regardless of which way the decision goes.',
      'Observe DC-link discharge times in full on inverters, drives and UPS equipment.',
      'Treat the enclosure as live until proved otherwise.',
    ],
    lockoutTagout: [
      'Lock and tag the supply isolator, and disable any auto-start.',
      'On UPS equipment isolate and lock both mains and battery.',
      'Where the equipment serves a critical load, agree the outage in writing before starting.',
    ],
    ppe: [
      'ESD wrist strap and mat for all board handling',
      'Eye protection and insulated tools where any part of the enclosure remains energised',
      'Appropriate protection where the board is contaminated',
    ],
    storedEnergy: [
      'Bulk and DC-link capacitors hold a lethal charge after isolation.',
      'Battery-backed circuits remain energised with the equipment off.',
    ],
    specificHazards: [
      'A repaired board returned to safety-critical protection duty is a safety decision, not a commercial one. If a protection function may not operate correctly, the equipment is not protected.',
      'A board that works intermittently gives false confidence, which on standby plant means the failure is discovered during the emergency it was bought for.',
      'Configuration transferred incorrectly to a replacement board can leave protection settings wrong while everything appears normal.',
    ],
    stopAndCallProfessional: [
      'The board performs a safety or protection function — repair is not appropriate.',
      'The equipment is under warranty.',
      'You cannot establish the root cause and the equipment matters.',
      'Configuration or calibration data cannot be recovered or verified.',
      'The decision affects life-safety systems, medical equipment, or plant with process-safety implications.',
    ],
  },

  tools: [
    { tool: 'The full diagnostic record from the fault investigation', why: 'The decision depends on whether root cause was actually established — an impression is not a record' },
    { tool: 'Equipment manufacturer parts and revision information', why: 'Establishes whether a replacement exists, at what price, and whether revisions are compatible' },
    { tool: 'Site criticality assessment for the equipment', why: 'Consequence of a repeat failure is the dominant factor and it is a property of the installation, not the board' },
    { tool: 'Configuration record for the equipment', why: 'A replacement board is only useful if it can be commissioned to the same settings' },
    { tool: 'Component availability check for the specific parts required', why: 'A repair plan that depends on an unobtainable part is not a plan' },
    { tool: 'Environmental assessment of the installation', why: 'If the cause is environmental, both repair and replacement fail until it is corrected' },
  ],

  decisionTree: [
    {
      question: 'Does the board perform a safety or protection function?',
      yes: 'Replace. A protection function that may not operate is not protection.',
      no: 'Continue',
    },
    {
      question: 'Has the root cause been identified with confidence?',
      yes: 'Continue',
      no: 'Replace, and correct the installation — repairing an unexplained failure produces an unexplained repeat',
    },
    {
      question: 'Can the root cause be corrected — supply, environment, mounting, protection?',
      yes: 'Continue',
      no: 'Neither repair nor replacement will last. Fix the installation first or accept a recurring cost.',
    },
    {
      question: 'Are the required parts obtainable with matching specification?',
      yes: 'Continue',
      no: 'Replace the board, or source an exchange unit from the manufacturer',
    },
    {
      question: 'Can the repair be verified under representative conditions — temperature, load, supply?',
      yes: 'Continue',
      no: 'Replace. A bench test that does not reproduce the failure conditions proves very little.',
    },
    {
      question: 'If the repair failed again next month, would the consequence be acceptable?',
      yes: 'Repair is a reasonable decision',
      no: 'Replace, or repair and hold the repaired board as the spare rather than trusting it in service',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish whether root cause was actually found',
      inspect: 'The diagnostic record — what failed, and what made it fail',
      where: 'Your own findings from the fault investigation',
      instrument: 'Honest review of the evidence',
      expected:
        'A specific, evidenced cause: a supply event, a contamination path, a thermal or vibration condition, an upstream failure',
      ifAbnormal:
        'If the record says only which component failed but not why, root cause has not been established and the decision moves toward replacement',
      next: 'Multiple failed components almost always mean an upstream cause that is still present',
      warning:
        'Repairing the casualty without finding the killer is the single most common reason boards come back.',
    },
    {
      step: 2,
      title: 'Assess consequence honestly',
      inspect: 'What this equipment does, and what a repeat failure would mean',
      where: 'The installation and its role on site',
      instrument: 'Discussion with the owner, not assumption',
      expected: 'A clear statement of criticality agreed with whoever carries the consequence',
      ifAbnormal:
        'Standby plant is a particular trap — it appears low-criticality because it sits idle, but it is bought precisely for the moment when failure is least acceptable',
      next: 'This factor should dominate the decision, ahead of cost',
      verify:
        'Confirm whether the equipment serves life-safety, medical, process-safety or revenue-critical duty',
    },
    {
      step: 3,
      title: 'Check parts and board availability before planning either route',
      inspect: 'Availability of the specific components required, and of a replacement board',
      where: 'Manufacturer, authorised distribution and reputable component supply',
      instrument: 'Actual availability check, not assumption',
      expected: 'A definite answer on both routes, with lead times and prices',
      ifAbnormal:
        'On older plant a replacement board is frequently unavailable or priced beyond the equipment value, which legitimately forces repair',
      next: 'Ask specifically about a manufacturer exchange unit — it often changes the economics entirely',
      warning:
        'Beware components sourced from unverified channels. A counterfeit or out-of-specification part turns a good repair into an early repeat failure.',
    },
    {
      step: 4,
      title: 'Confirm you can verify a repair properly',
      inspect: 'Whether the failure conditions can be reproduced for testing',
      where: 'Bench and installation',
      instrument: 'The test equipment and load available to you',
      expected:
        'A test that exercises the board across the conditions in which it failed — temperature, load, supply behaviour',
      ifAbnormal:
        'A repair verified only on a bench at room temperature, on equipment that failed intermittently in a hot enclosure, has not really been verified',
      next: 'Where verification is not possible, the residual risk is unquantified and replacement is the safer decision',
    },
    {
      step: 5,
      title: 'Record configuration before removing anything',
      inspect: 'All settings, calibration values, licences and any board-specific data',
      where: 'The equipment, before the board comes out',
      instrument: 'Configuration software, photographs of settings screens, and a written record',
      expected: 'A complete record that would allow a replacement board to be commissioned identically',
      ifAbnormal:
        'Settings that exist only on the failed board are a strong argument for repair, or for recovering the data before it is lost',
      next: 'Do this regardless of which route you take — it is the step most often skipped and most often regretted',
      warning:
        'Some equipment pairs boards to serial numbers or licences. Establish this before ordering a replacement.',
    },
    {
      step: 6,
      title: 'Assess whether the installation will destroy the next board too',
      inspect: 'Supply quality, enclosure protection, ambient temperature, vibration and surge protection',
      where: 'The installation',
      instrument: 'The environmental findings from the fault investigation',
      expected: 'An installation that will not repeat the failure',
      ifAbnormal:
        'Where the cause is environmental, both a repair and a new board will fail. Correcting the installation is part of the job, not a separate recommendation.',
      next: 'Price the installation correction alongside the board decision so the owner sees the true position',
    },
    {
      step: 7,
      title: 'Consider repairing and holding as a spare',
      inspect: 'Whether a repaired board has value even if it is not trusted in service',
      where: 'The spares strategy for the equipment',
      instrument: 'Judgement',
      expected:
        'On critical plant with unobtainable boards, fitting a new or exchange board and keeping the repaired one as an emergency spare is often the best outcome available',
      ifAbnormal:
        'This resolves the common conflict where a repair is technically viable but the consequence of failure is unacceptable',
      next: 'Label the repaired board with what was done and what remains uncertain about it',
    },
    {
      step: 8,
      title: 'Record the decision and its reasoning',
      inspect: 'What was decided, on what evidence, and what remains uncertain',
      where: 'The equipment record',
      instrument: 'Written record',
      expected:
        'A record the next engineer can use — including whether this board has been repaired before',
      ifAbnormal:
        'Without a record, a second failure is not recognised as a repeat, and the same wrong decision is made again',
      next: 'Mark repaired boards physically, so the history travels with the board',
    },
  ],

  repair: [
    {
      level: 'board-level',
      title: 'When repair is the right decision',
      steps: [
        'Root cause identified and evidenced, not assumed.',
        'Single identified component failure, or a small number of failures with a common explained cause.',
        'Correct-specification parts obtainable from a reputable source.',
        'Equipment non-critical, or the repaired board destined to be a spare rather than the primary.',
        'Replacement board unobtainable or priced beyond the equipment value — a very common position on older plant.',
        'Verification possible under conditions representative of the failure.',
      ],
      note:
        'A well-executed repair on an understood fault is a legitimate engineering outcome, not a compromise. The condition is that it is understood.',
    },
    {
      level: 'board-replacement',
      title: 'When replacement is the right decision',
      steps: [
        'The board performs a safety or protection function.',
        'Root cause could not be established.',
        'The fault is intermittent and was never localised.',
        'Corrosion has reached inner layers of a multi-layer board.',
        'A programmed or custom device has failed with no programmed replacement available.',
        'The equipment is under warranty.',
        'Repair cost, including diagnosis time, approaches a replacement that carries a warranty.',
      ],
    },
    {
      level: 'configuration',
      title: 'Doing the replacement properly',
      steps: [
        'Confirm the replacement board revision is compatible with the equipment.',
        'Record and verify configuration against the site record after fitting — not from memory.',
        'Verify protection settings specifically, because these are the ones that appear correct while being wrong.',
        'Correct the installation cause before or during the replacement, not as a follow-up visit that never happens.',
        'Test through a full operating cycle, including any protection function, before handing back.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Exchange units and manufacturer support',
      steps: [
        'Ask specifically whether an exchange unit is available — it frequently changes the decision.',
        'Establish warranty status before any repair attempt.',
        'Where the equipment is obsolete, ask the manufacturer about a supported upgrade path rather than chasing an unobtainable board.',
        'Retain the failed board until the replacement is proven in service.',
      ],
    },
  ],

  validation: [
    'Root cause documented, with the evidence behind it',
    'Installation cause corrected and recorded, where one existed',
    'Equipment tested through a full operating cycle in its working position',
    'Any protection function specifically verified, not assumed from general operation',
    'Configuration verified against the site record',
    'Decision, reasoning and any residual uncertainty recorded on the equipment file',
    'Repaired boards physically marked with what was done',
  ],

  whenNotToRepair: [
    'Safety and protection functions — replace',
    'Unidentified intermittent faults — replace',
    'Corrosion into inner layers on multi-layer boards — replace',
    'Failed programmed or custom devices with no programmed replacement — replace',
    'Equipment under warranty — do not open it',
    'Repeat failure of a previously repaired board where the cause is still unknown — replace and investigate the installation',
    'Any situation where you would not be comfortable explaining the decision after a failure',
  ],

  prevention: [
    'Record configuration at commissioning and after every change, so a board replacement is never blocked by lost settings',
    'Keep a spares strategy for equipment where downtime costs more than the spare',
    'Log every board repair and replacement against the equipment, so repeats are recognised as repeats',
    'Correct supply quality, enclosure protection and surge protection rather than treating board failures as bad luck',
    'Establish exchange-unit availability before you need it, not during a breakdown',
    'Mark repaired boards physically so their history is not lost',
    'Review board failures across the site periodically — a pattern across several units points at an installation or environment issue rather than component quality',
  ],

  relatedSlugs: [
    'pcb-short-circuit-diagnosis',
    'motherboard-power-rail-diagnosis',
    'pcb-reset-supervisor-clock-faults',
    'pcb-cleaning-track-repair-contamination',
  ],

  faq: [
    {
      q: 'Is repairing a board always cheaper than replacing it?',
      a: 'On the invoice, often yes. Across the life of the equipment, frequently not. A repair that fails again brings a second call-out, a second outage and a loss of confidence in the equipment. Judge it on consequence and confidence, not on the price of the part.',
    },
    {
      q: 'The board works fine after the repair. Why would I replace it?',
      a: 'Because "works on the bench today" is not the same as "will work in a hot enclosure in six months". If the root cause was never found, or the repair cannot be tested under the conditions that caused the failure, the risk is real even though the board is currently working.',
    },
    {
      q: 'The replacement board costs more than the generator is worth. What now?',
      a: 'That is a legitimate reason to repair, and it is a common position on older plant here. Do it with eyes open: establish the root cause, correct the installation, verify as thoroughly as you can, and tell the owner honestly what remains uncertain.',
    },
    {
      q: 'Why replace a board on a standby generator that hardly ever runs?',
      a: 'Because standby plant is bought for the one moment when it must work. A board that fails unpredictably is discovered during the outage it was meant to cover. Low running hours make a board look low-criticality; the duty makes it the opposite.',
    },
    {
      q: 'Can I fit a board from a similar unit?',
      a: 'Only if the revision is confirmed compatible. Board revisions are not always interchangeable, and some equipment pairs boards to serial numbers or licences. Check before ordering, and verify configuration afterwards rather than assuming it carried across.',
    },
    {
      q: 'What is the single most common reason repaired boards come back?',
      a: 'The cause was never found. The component that failed was replaced, but whatever destroyed it — a supply disturbance, contamination, heat, vibration — is still there. That is why root cause is the first question in this decision and not an afterthought.',
    },
  ],

  references: [
    'Equipment manufacturer parts list, board revision information and exchange-unit availability',
    'Site criticality assessment and agreed outage requirements for the equipment',
    'Equipment configuration and calibration records',
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies',
    'IPC-A-610 — acceptability of electronic assemblies',
    'Site maintenance history for the equipment, including any previous board work',
  ],
};
