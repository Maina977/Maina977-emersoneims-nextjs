import type { RepairArticle } from '../types';

export const atsPositionIndicationAuxiliaryContacts: RepairArticle = {
  slug: 'ats-position-indication-auxiliary-contacts',
  hub: 'ats-changeover',
  header: {
    title: 'ATS Position Indication and Auxiliary Contacts — When the Panel Lies About Itself',
    equipmentCategory: 'Automatic transfer switch',
    appliesTo:
      'Contactor-based, motorised breaker and motor-operated changeover switches with auxiliary contact position feedback to a controller or BMS',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Simple to test and dangerous to ignore — the whole control scheme trusts these contacts, and a false position report is worse than no report at all',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Mains and generator 415 V three-phase 50 Hz nominal; control and signalling per panel design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'Everything an ATS controller does depends on knowing where the switch actually is, and it knows that only through auxiliary contacts. When one of those contacts fails, the controller acts on a false picture: it may refuse a valid transfer, command a transfer that is already made, report a fault that does not exist, or — most seriously — believe a source is disconnected when it is still connected. Diagnose it by comparing three things against each other: the physical position of the device, the state of its auxiliary contacts, and what the controller reports. Where all three agree the feedback is sound. Where they disagree, the physical position is the truth and everything else is suspect. Test auxiliary contacts by operating the device through its full travel with the panel isolated and watching each contact change state. Never trust a panel indication as proof that a source is disconnected — prove it with a meter before you touch anything.',

  symptoms: {
    display: [
      'Controller reporting a position that does not match the physical switch',
      'Transfer failure or transfer timeout despite the switch having actually moved',
      'Controller reporting both sources connected, or neither, when one clearly is',
      'Position fault, feedback fault or switch discrepancy alarm',
      'BMS or remote monitoring showing a state the site does not agree with',
    ],
    indicators: [
      'Panel position lamps disagreeing with the mechanical position indicator on the device',
      'Both position lamps lit, or neither, on a switch that is clearly in one position',
      'Indication that changes when the panel door is closed or the mechanism is nudged',
    ],
    sounds: [
      'Controller repeatedly re-issuing a transfer command that has already completed',
      'Contactor pulsing as the controller acts on contradictory feedback',
    ],
    smells: ['Usually none — this is an electrically quiet fault, which is part of why it goes unnoticed'],
    behaviour: [
      'Switch transfers correctly but the controller alarms anyway',
      'Controller refuses a transfer that the mechanism is perfectly capable of making',
      'Indication correct in one position and wrong in the other',
      'Fault appears only after the panel has been running for a while, indicating a thermal or loose-connection cause',
      'Remote monitoring and local indication disagreeing with each other',
      'Behaviour changed after maintenance in which the mechanism or auxiliary block was disturbed',
    ],
    visible: [
      'Auxiliary contact block loose on its mounting, or not fully engaged with the mechanism',
      'Operating lever or cam not making full travel to the contact block',
      'Contacts pitted, oxidised or discoloured',
      'Wiring to the auxiliary block loose, broken at the crimp, or chafed',
      'Auxiliary block wired to the wrong device or with normally-open and normally-closed contacts transposed',
      'Evidence of previous work — added links, cut wires, or a block replaced with a different type',
      'Corrosion or moisture in the auxiliary contact area',
    ],
  },

  whatItMeans: {
    plain:
      'A changeover controller cannot see the switch. It only knows where the switch is because small extra contacts, mounted on the switch and moving with it, tell it. If one of those small contacts stops working properly, the controller is being told the wrong thing — and it then makes decisions based on that. It might refuse to change over when it should, or think it has already changed over when it has not. The dangerous version is when the panel says a supply is disconnected and it is actually still live, which is why nobody should ever trust a lamp instead of a meter.',
    technical:
      'Auxiliary contacts are mechanically linked to the main switching mechanism and change state with device position, providing the controller with the only position feedback it has. The scheme typically uses paired contacts so that the controller can distinguish a valid position from an invalid one, and many controllers explicitly alarm on a discrepancy — both contacts indicating closed, or neither, is a defined fault state rather than a nuisance. Because the same auxiliary contacts also form the electrical interlock permissives, a single failed contact produces two symptoms at once: a false position report and a blocked transfer. This coupling explains why position faults and transfer failures so often appear together, and why an engineer chasing the transfer failure may bypass the very contact that is reporting the problem. The safety consequence is specific and severe: a contact that indicates open while the device is closed tells the controller, the BMS and the panel lamps that a source is disconnected when it is live.',
  },

  causes: {
    mostLikely: [
      'Auxiliary contact worn, pitted or oxidised so it no longer makes reliably at low signal current',
      'Auxiliary contact block loose on its mounting, so the operating cam no longer drives it fully',
      'Wiring to the auxiliary block broken at a crimp or loose in a terminal',
      'Contact block not fully seated after maintenance in which it was disturbed',
    ],
    possible: [
      'Operating lever or cam bent or worn, giving partial travel',
      'Auxiliary block of the wrong type fitted at a previous repair, with different contact configuration',
      'Normally-open and normally-closed contacts transposed during rewiring',
      'Controller input failed, so a healthy contact is not being read',
      'Moisture or contamination in the contact area causing intermittent or leaky indication',
    ],
    lessCommon: [
      'Auxiliary contacts rated for higher current used on a low-current signal circuit, where oxide films do not get broken down by the signal',
      'Mechanism worn so device position itself is indeterminate',
      'Interposing relay in the feedback path failed',
      'Controller configuration changed so it expects a different contact arrangement',
      'Long signal cable run picking up interference, on installations with remote monitoring',
    ],
    modelSpecific: [
      'Auxiliary contact configuration, quantity and whether the controller expects paired complementary feedback are panel and controller specific — take them from the schematic and controller manual',
      'Some controllers alarm on discrepancy and some do not, which changes how visible this fault is',
      'Contact ratings and minimum switching current are stated by the device manufacturer and matter on low-current signal circuits',
      'Whether auxiliary contacts also serve the interlock varies by design and determines the second symptom',
    ],
    environmental: [
      'Humidity and condensation oxidising contacts that carry only signal-level current',
      'Dust and dirt in the auxiliary contact area, particularly at unsealed sites',
      'Vibration loosening the contact block mounting over time',
      'Corrosive or coastal atmospheres degrading contact surfaces',
      'High ambient temperature in unventilated panels loosening terminations through thermal cycling',
    ],
    installation: [
      'Auxiliary contacts never verified at commissioning against actual device position',
      'Contacts wired to the wrong device, which works until the day a real transfer is needed',
      'Feedback wiring run alongside power cabling, picking up interference on long runs',
      'Contact block mounted without proper engagement with the operating mechanism',
      'Controller configured for a contact arrangement that does not match what was fitted',
    ],
    maintenance: [
      'Auxiliary blocks disturbed during other work and not reseated correctly',
      'Position indication never tested against physical position, so a fault is latent for years',
      'A discrepancy alarm silenced or disabled rather than investigated',
      'A failed contact strapped out to clear an alarm, which also defeats the interlock it forms part of',
      'Terminations never re-torqued',
    ],
    componentLevel: [
      'Auxiliary contact surface degradation',
      'Contact block mechanical wear or mounting failure',
      'Crimp or terminal failure in the feedback wiring',
      'Controller digital input failure',
      'Interposing relay failure',
    ],
  },

  safety: {
    isolation: [
      'A changeover panel has two independent sources. Isolate and lock BOTH, and disable and lock the generator auto-start, before opening it.',
      'Prove dead on every conductor you intend to touch, on both source sides and on the load side.',
      'NEVER use panel position indication as evidence that a source is disconnected. That indication is exactly what may be faulty.',
    ],
    lockoutTagout: [
      'Lock the mains isolator, lock the generator output isolator, and disable and lock the generator auto-start.',
      'Tag with your name and date, and inform site that the changeover is out of service.',
      'Agree the outage with whoever owns the load before starting.',
    ],
    ppe: [
      'Arc-rated clothing and face protection appropriate to the prospective fault level at the panel',
      'Insulated gloves and tools rated above the system voltage',
      'Eye protection during any work on the mechanism',
    ],
    storedEnergy: [
      'Motorised mechanisms hold a charged spring; discharge it per the manufacturer procedure before working near the mechanism or the auxiliary blocks.',
      'A charged mechanism can operate the device even with the control supply removed, moving the auxiliary contacts with it.',
      'The generator may auto-start unless specifically disabled and locked.',
    ],
    specificHazards: [
      'The central hazard of this fault is that the panel can tell you a source is disconnected when it is live. Prove dead with a meter, every time, regardless of what the lamps or the controller say.',
      'Auxiliary contacts frequently form part of the electrical interlock. Strapping one out to clear an indication fault also defeats the interlock, which can allow both sources to close together.',
      'Working near the mechanism while it can operate risks crush injury; the mechanism moves fast.',
      'A discrepancy alarm is a defined fault state, not a nuisance. Silencing it removes the only warning the scheme provides.',
    ],
    stopAndCallProfessional: [
      'You find an auxiliary contact strapped out or bypassed — the interlock may be defeated and must be restored and verified before energising.',
      'Position indication and physical position disagree and the reason cannot be established.',
      'The panel serves a life-safety load and the outage has not been authorised.',
      'You cannot obtain the panel schematic and controller configuration, and therefore cannot verify the expected contact arrangement.',
      'Arc-flash risk at the panel exceeds your assessed protection.',
    ],
  },

  tools: [
    { tool: 'Multimeter, CAT III or CAT IV as the location demands, with a proving unit', why: 'Proving dead, and confirming what is actually energised rather than what the panel says' },
    { tool: 'Continuity tester', why: 'Confirming each auxiliary contact changes state through the device travel, with the panel isolated' },
    { tool: 'The panel schematic and controller configuration', why: 'Establishes which contacts feed which input and what arrangement the controller expects' },
    { tool: 'Insulated tools rated for the system voltage', why: 'Working in a panel with two independent sources' },
    { tool: 'Torque screwdriver', why: 'Auxiliary and control terminations must be torqued; a loose signal terminal gives an intermittent that is very hard to find later' },
    { tool: 'Contact cleaner suitable for low-current contacts, where the manufacturer permits it', why: 'Oxide films on signal-level contacts are a common and easily reversible cause' },
    { tool: 'Manufacturer manual for the switching device and controller', why: 'Contact configuration, minimum switching current and discrepancy alarm behaviour are device-specific' },
  ],

  decisionTree: [
    {
      question: 'Does the physical device position match what the controller reports?',
      yes: 'Feedback is reading correctly in this position — check the other position too',
      no: 'The physical position is the truth. Trace the feedback path.',
    },
    {
      question: 'Do the auxiliary contacts change state correctly when the device is operated through its full travel?',
      yes: 'The contacts are sound — the fault is in the wiring or the controller input',
      no: 'The contact block, its mounting, or the operating cam is at fault',
    },
    {
      question: 'Is the contact block fully seated and properly engaged with the operating mechanism?',
      yes: 'Mounting is sound — inspect the contact surfaces',
      no: 'Reseat it correctly; a partially engaged block gives exactly this fault and is common after maintenance',
    },
    {
      question: 'Does the controller input read the contact state correctly at its own terminals?',
      yes: 'The controller is being told the truth — check its configuration',
      no: 'The fault is in the wiring between the contact and the controller',
    },
    {
      question: 'Do the auxiliary contacts also form part of the interlock?',
      yes: 'Expect a blocked transfer as a second symptom, and never strap the contact out',
      no: 'The fault affects indication only, but still must be corrected',
    },
    {
      question: 'Has any contact been strapped out or bypassed previously?',
      yes: 'Stop. Restore and verify the interlock before energising.',
      no: 'Complete the repair and prove indication in both positions',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Compare the three sources of truth',
      inspect: 'Physical device position, panel lamp indication, and controller reported position',
      where: 'The switching device, the panel front, and the controller display',
      instrument: 'Observation, plus a meter to confirm what is actually live',
      expected: 'All three agreeing, in both switch positions',
      ifAbnormal:
        'Any disagreement identifies the fault immediately. The physical position of the device is the truth; everything else is a report about it.',
      next: 'Confirm with a meter which source is actually feeding the load, rather than relying on any indication',
      warning:
        'Never accept panel indication as proof a source is disconnected. That indication is precisely what may be lying.',
    },
    {
      step: 2,
      title: 'Isolate both sources and prove dead',
      inspect: 'That mains, generator and auto-start are all isolated and locked',
      where: 'Both isolators and the generator control',
      instrument: 'Meter with a proving unit',
      expected: 'All sources proved dead at the panel',
      ifAbnormal: 'Any live source means the panel is not safe to work in',
      next: 'Discharge any stored-energy mechanism before working near the auxiliary blocks',
      warning:
        'Disabling the generator control supply is not the same as disabling auto-start. Lock the generator out physically.',
    },
    {
      step: 3,
      title: 'Operate the device through full travel and watch every contact',
      inspect: 'Each auxiliary contact as the device moves through its complete travel',
      where: 'The auxiliary contact blocks on both devices',
      instrument: 'Continuity tester, with the device operated manually per the manufacturer procedure',
      expected:
        'Every contact changing state cleanly and decisively at the correct point in the travel, and staying in that state',
      ifAbnormal:
        'A contact that does not change, changes late, or is intermittent has been found. A contact that changes only when the block is pressed indicates a mounting or engagement fault.',
      next: 'Test in both directions — a contact can work in one direction of travel and not the other',
      verify:
        'Expected contact configuration comes from the schematic and the device manufacturer data',
    },
    {
      step: 4,
      title: 'Check the block mounting and mechanical engagement',
      inspect: 'How the auxiliary block is mounted and how the operating cam or lever drives it',
      where: 'The contact block and its interface with the mechanism',
      instrument: 'Visual, and gentle manual check of engagement',
      expected: 'Block fully seated, securely mounted, and driven through its full stroke by the mechanism',
      ifAbnormal:
        'A block that has worked loose or was never fully seated after previous maintenance is a very common cause, and the fault is intermittent because engagement varies with vibration',
      next: 'Check whether the operating lever or cam is worn or bent, limiting travel',
      warning: 'Discharge the stored-energy mechanism before working near it.',
    },
    {
      step: 5,
      title: 'Trace the feedback wiring to the controller',
      inspect: 'Continuity and terminal condition from the auxiliary contact to the controller input',
      where: 'Auxiliary block terminals, intermediate terminals, controller input terminals',
      instrument: 'Continuity tester, working from the schematic',
      expected: 'Continuous, low-resistance path with all terminations tight and undamaged',
      ifAbnormal:
        'A broken crimp or a loose signal terminal produces an intermittent that is temperature- and vibration-dependent, and it is easily missed on a static test',
      next: 'Flex the wiring gently while testing to reveal an intermittent break at a crimp',
      verify: 'Confirm the contact is wired to the input the controller configuration expects',
    },
    {
      step: 6,
      title: 'Verify the controller reads it correctly',
      inspect: 'Controller input status against the actual contact state',
      where: 'Controller input terminals and its diagnostic display',
      instrument: 'Multimeter at the terminals, and the controller\'s own input status page',
      expected: 'Controller input status matching the physical contact state in both positions',
      ifAbnormal:
        'Correct state at the controller terminals but wrong on the display indicates a controller input failure or a configuration mismatch',
      next: 'Check the controller configuration against the schematic before condemning the hardware',
      verify:
        'Whether the controller expects paired complementary contacts, and how it treats a discrepancy, is in the controller manual',
    },
    {
      step: 7,
      title: 'Establish whether the same contacts serve the interlock',
      inspect: 'Whether the auxiliary contacts in question appear in the interlock permissive chain',
      where: 'The schematic',
      instrument: 'The panel schematic',
      expected: 'A clear understanding of which contacts do double duty',
      ifAbnormal:
        'Where a contact serves both indication and interlock, a single failure produces both a false position report and a blocked transfer — and strapping it out to clear the alarm defeats the interlock',
      next: 'This is the step that prevents a dangerous shortcut later in the job',
      warning:
        'Never strap out an auxiliary contact to clear an indication fault. It may be the contact that prevents both sources closing together.',
    },
    {
      step: 8,
      title: 'Prove indication in both positions before handing back',
      inspect: 'Full transfer and return, with indication verified at every stage',
      where: 'The whole changeover',
      instrument: 'The panel, with the outage agreed',
      expected:
        'Physical position, panel lamps and controller report agreeing in both positions and during the transition, with no discrepancy alarm',
      ifAbnormal:
        'Indication correct in one position and wrong in the other means only half the feedback has been repaired',
      next: 'Prove the interlock function as well, since the same contacts are usually involved',
      warning: 'Testing drops the load. Agree it first.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Contacts, mounting and terminations',
      steps: [
        'Reseat the auxiliary contact block correctly and secure its mounting.',
        'Where the manufacturer permits it, clean low-current contact surfaces with an appropriate contact cleaner — oxide films on signal-level contacts are common and easily reversed.',
        'Re-terminate any crimp or terminal showing damage, and torque all terminations to the manufacturer figure.',
        'Check that the operating cam or lever drives the block through its full stroke, and correct any wear or misalignment.',
        'Clean dust and contamination from the auxiliary contact area.',
      ],
      note:
        'A block that was never fully seated after previous maintenance is one of the most common causes here, and one of the easiest to miss because it works intermittently.',
    },
    {
      level: 'component-replacement',
      title: 'Replacing auxiliary contacts',
      steps: [
        'Replace with a block of the correct type and contact configuration for the schematic — a different configuration will appear to fit and behave incorrectly.',
        'Where contacts carry only signal-level current, ensure the type fitted is suitable for low-current switching; contacts rated only for higher currents can develop oxide films that the signal cannot break down.',
        'Replace worn operating levers or cams rather than adjusting around the wear.',
        'Verify contact operation through full travel after fitting, before reconnecting the wiring.',
      ],
    },
    {
      level: 'wiring',
      title: 'Correcting wiring and restoring interlocks',
      steps: [
        'Correct any contact wired to the wrong device or with normally-open and normally-closed transposed.',
        'Where a contact has been strapped out or bypassed, restore it exactly to the schematic and verify the interlock function.',
        'Route feedback wiring away from power cabling, particularly on long runs to remote monitoring.',
        'Record any correction made, since a wiring error present since commissioning may exist on sister panels too.',
      ],
      note:
        'A strapped-out auxiliary contact is not a cosmetic problem. If that contact forms part of the interlock, both sources can close together.',
    },
    {
      level: 'configuration',
      title: 'Controller configuration',
      steps: [
        'Verify the controller configuration matches the contact arrangement actually fitted.',
        'Ensure any discrepancy alarm is enabled — it is the only automatic warning the scheme has that its position feedback is wrong.',
        'Do not disable a discrepancy alarm to clear a nuisance; investigate what is causing it.',
        'Record the configuration after any change.',
      ],
    },
  ],

  validation: [
    'Physical position, panel indication and controller report agreeing in both switch positions',
    'Every auxiliary contact confirmed to change state cleanly through full device travel, in both directions',
    'Feedback wiring continuity confirmed with terminations torqued',
    'Controller input status matching physical contact state',
    'Discrepancy alarm enabled and confirmed functional',
    'Interlock function proved, where the same contacts serve it',
    'Full transfer and return completed with correct indication throughout',
  ],

  whenNotToRepair: [
    'Switching devices whose mechanism is worn to the point that position itself is indeterminate',
    'Auxiliary blocks unobtainable for obsolete devices where no correct-configuration replacement exists',
    'Panels where auxiliary contacts have been bypassed and the original interlock arrangement cannot be established',
    'Devices at or beyond their rated number of operations, where auxiliary wear reflects general end of life',
    'Any changeover serving a life-safety load where position feedback cannot be made reliable',
  ],

  prevention: [
    'Test position indication against physical position at every scheduled service — it is a two-minute check that catches a latent safety fault',
    'Verify auxiliary contact operation through full travel during maintenance, not just that the lamps light',
    'Re-torque auxiliary and control terminations periodically',
    'Never silence or disable a discrepancy alarm; investigate it',
    'Reseat and secure any auxiliary block disturbed during other work, and re-verify it before closing the panel',
    'Keep the panel sealed against dust and moisture appropriate to its location',
    'Keep the schematic in the panel, current and legible, so the contact arrangement never has to be guessed',
    'Remove every temporary strap before closing a job — check for them specifically before handing back',
  ],

  relatedSlugs: [
    'ats-not-changing-over',
    'ats-will-not-return-to-mains',
    'ats-contactor-interlock-faults',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'The switch has clearly transferred but the controller still says it has not. What is wrong?',
      a: 'An auxiliary contact is not reporting the new position. The mechanism is fine; the feedback is not. Operate the device through its full travel with the panel isolated and watch each contact change state — the one that does not is your fault.',
    },
    {
      q: 'Can I strap out the auxiliary contact to clear the alarm?',
      a: 'No. Those same contacts usually form part of the electrical interlock, so strapping one out can allow both sources to close together. Even where it only affects indication, you are removing the controller\'s only knowledge of where the switch is.',
    },
    {
      q: 'The panel says the mains is disconnected. Is it safe to work on?',
      a: 'Not on that basis. A failed auxiliary contact can indicate open while the device is closed, which is exactly the fault being diagnosed. Prove dead with a meter, every time, regardless of what the lamps or the controller display say.',
    },
    {
      q: 'Indication is right in one position and wrong in the other. Why?',
      a: 'Because a separate contact reports each position. One has failed and the other has not. It is also a common signature of a contact block that is not fully engaged with the operating cam, since partial travel operates some contacts and not others.',
    },
    {
      q: 'It works when I test it in the panel but fails in service. What causes that?',
      a: 'Usually a loose termination or a broken crimp in the feedback wiring, which makes contact when static and breaks with vibration or thermal expansion. Flex the wiring gently while testing continuity — that reveals what a static test misses.',
    },
    {
      q: 'The controller alarms on discrepancy. Should I just turn that alarm off?',
      a: 'No. A discrepancy alarm means the controller has received contradictory position information, which is a defined fault state. It is the only automatic warning you get that the panel does not know where its own switch is. Disabling it removes the warning and leaves the fault.',
    },
  ],

  references: [
    'Panel schematic and control diagram for the specific changeover installation',
    'ATS controller manual — expected auxiliary contact arrangement, input configuration and discrepancy alarm behaviour',
    'Switching device manufacturer manual — auxiliary contact configuration, ratings, minimum switching current and stored-energy discharge procedure',
    'IEC 60947-6-1 — low-voltage switchgear and controlgear: multiple function equipment, transfer switching equipment',
    'IEC 60947-5-1 — control circuit devices and switching elements',
    'Site commissioning records, including original position-indication verification',
  ],
};
