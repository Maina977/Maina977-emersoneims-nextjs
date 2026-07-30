import type { RepairArticle } from '../types';

export const atsContactorInterlockFaults: RepairArticle = {
  slug: 'ats-contactor-interlock-faults',
  hub: 'ats-changeover',
  header: {
    title: 'ATS Contactor, Motor Operator and Interlock Faults — When the Switch Itself Fails',
    equipmentCategory: 'Automatic transfer switch',
    appliesTo:
      'Contactor-based, motorised breaker and motor-operated changeover switches, single and three phase, with mechanical and electrical interlocking',
    difficulty: 'advanced',
    diagnosisComplexity:
      'Moderate — the control side is easy to test, but distinguishing a genuine mechanical fault from an interlock doing its job correctly is where diagnosis goes wrong',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Mains and generator 415 V three-phase 50 Hz nominal; control supply per panel design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'When an ATS receives a valid transfer command and the switching device does not move, the fault is in one of three places: the control signal never reached the operator, the operator itself has failed mechanically or electrically, or an interlock is deliberately preventing the movement. Test them in that order, and treat the third possibility seriously — an interlock refusing to allow a transfer is usually working correctly and telling you the other source is still connected, or that a position signal disagrees with reality. Never defeat an interlock to make a transfer happen. A changeover that closes both sources together back-feeds the utility network and can kill a lineworker. Prove the command with a meter at the operator coil, prove the operator by exercising it under controlled conditions with both sources isolated, and prove the interlock chain contact by contact rather than assuming it is at fault because it is in the way.',

  symptoms: {
    display: [
      'Controller reporting transfer failure or transfer timeout',
      'Controller showing a valid source available but the switch position unchanged',
      'Position feedback disagreeing with the commanded position',
      'Fail-to-transfer alarm after the generator has run up correctly',
    ],
    indicators: [
      'Source-available indication correct on both sides while the switch stays put',
      'Contactor coil energised indication present with no movement',
      'Interlock or lockout indication asserted, where the panel provides one',
    ],
    sounds: [
      'Contactor buzzing or humming without pulling in fully',
      'Repeated chattering as the contactor tries and fails to latch',
      'Motor operator running and stalling, or running without the mechanism moving',
      'A single click with no movement, indicating the operator started and something blocked it',
      'Silence at the switch despite a confirmed command',
    ],
    smells: [
      'Burnt coil varnish smell from a contactor or motor operator',
      'Hot phenolic or ozone smell from arcing at main contacts',
    ],
    behaviour: [
      'Transfers to generator but will not return to mains, or the reverse',
      'Transfers correctly on test but fails during a real outage — usually a load or voltage-dependent problem',
      'Works when operated manually but not automatically',
      'Intermittent failure that clears when the panel is opened, indicating a thermal or connection fault',
      'Transfer became slow before it stopped working entirely',
    ],
    visible: [
      'Contactor main contacts pitted, welded or badly eroded',
      'Contactor coil discoloured or with visible burn marks',
      'Motor operator charging mechanism jammed, or its spring not charged',
      'Mechanical interlock bar bent, seized or obstructed',
      'Auxiliary contact block loose or damaged',
      'Burnt or discoloured control terminals',
      'Manual operating handle showing damage from being forced',
      'Foreign objects, dust build-up or rodent damage in the mechanism',
    ],
  },

  whatItMeans: {
    plain:
      'A changeover switch has to physically move to connect the load to either the mains or the generator, and never to both at once. That movement is made by a contactor or a motorised mechanism. If it does not happen there are only three possibilities: the instruction never arrived, the mechanism could not move, or something is deliberately stopping it because allowing the movement would be dangerous. The last one matters most — the safety interlocks exist so the two supplies can never be joined, and forcing past them can send generator power back into the utility network where someone may be working on the line.',
    technical:
      'A transfer sequence requires a valid command, a functioning operator and permissive interlocks. The control side is a straightforward series chain — controller output, any permissive contacts, the operator coil or motor circuit — and each element can be proved with a meter. The operator side depends on type: a contactor pair relies on coil pull-in against mechanical load and on the condition of the main contacts; a motorised breaker or motor-operated switch relies on a charging mechanism and a stored-energy release, so a stalled charge motor or an uncharged spring prevents operation even with a valid command. Interlocking exists in two forms that must both be respected: mechanical interlocking physically prevents both devices closing, and electrical interlocking uses auxiliary contacts of each device in the other coil circuit. A failed auxiliary contact therefore prevents transfer while the mechanism itself is perfectly serviceable — which is the case most often misdiagnosed, because the symptom is identical to a dead operator and the instinct is to bypass the contact that appears to be obstructing.',
  },

  causes: {
    mostLikely: [
      'Auxiliary contact failed or misadjusted, breaking the electrical interlock permissive and preventing the opposite device from closing',
      'Contactor coil failed open, or its supply lost through a control fuse or loose terminal',
      'Main contacts welded closed on one source, so the mechanical interlock correctly refuses to allow the other to close',
      'Motor operator charge motor failed, or the stored-energy spring not charging',
    ],
    possible: [
      'Control fuse operated, removing the coil supply to one side only',
      'Loose or burnt control terminal, giving an intermittent fault that comes and goes with temperature',
      'Mechanical interlock bar bent or obstructed after a forced manual operation',
      'Contactor mechanically stiff from dust, corrosion or lack of exercise',
      'Controller output relay failed, so the command never leaves the controller',
      'Control transformer or DC supply failing under the load of the operator',
    ],
    lessCommon: [
      'Switch operated manually and left in a position the controller cannot recover from',
      'Coil of the wrong voltage fitted at a previous repair',
      'Motor operator limit switch out of adjustment, stopping the mechanism part-way',
      'Panel wiring modified without records, defeating or altering the interlock chain',
      'Contactor mechanically damaged by repeated transfer under fault conditions',
    ],
    modelSpecific: [
      'Interlock arrangement, auxiliary contact configuration and operating sequence differ between contactor-based, motorised breaker and motor-operated switch designs — take the schematic for the actual panel rather than assuming',
      'Transfer, dwell and neutral-position timings are configurable and vary by controller',
      'Some designs use a deliberate open transition with a neutral dwell, so a pause between positions is correct behaviour rather than a fault',
      'Coil voltage and control supply arrangement are panel-specific',
    ],
    environmental: [
      'Dust and dirt in the mechanism at quarry, agricultural, cement and unsealed sites',
      'Humidity and condensation corroding contacts and auxiliary blocks',
      'Rodent damage to control wiring and mechanism, common in plant rooms and outdoor kiosks',
      'High ambient temperature in unventilated changeover panels stressing coils',
      'Corrosive or coastal atmospheres degrading contacts and linkages',
    ],
    installation: [
      'Interlock never verified at commissioning, so a wiring error has been latent since installation',
      'Auxiliary contacts wired to the wrong device or the wrong contact type',
      'Control supply undersized so it dips when the operator draws current',
      'Panel not sealed against the environment it is installed in',
      'Manual operating access left unsecured, allowing untrained operation',
    ],
    maintenance: [
      'Switch never exercised, so the mechanism stiffens and contacts oxidise between operations',
      'Contact condition never inspected, so erosion progresses to welding',
      'Interlock function never tested — it is assumed to work because it has never been needed',
      'Manual handle forced when the mechanism resisted, bending the interlock',
      'Control terminals never re-torqued, so a joint loosens through thermal cycling',
    ],
    componentLevel: [
      'Contactor coil failure',
      'Main contact erosion or welding',
      'Auxiliary contact failure',
      'Charge motor or stored-energy mechanism failure',
      'Limit switch failure or misadjustment',
      'Control relay failure in the controller',
    ],
  },

  safety: {
    isolation: [
      'A changeover panel has TWO independent sources. Isolating one leaves the other live, and this is the fundamental hazard of all ATS work.',
      'Isolate and lock both the mains supply and the generator supply, and disable the generator auto-start, before opening the panel.',
      'Prove dead on every conductor you intend to touch, on both sides of the switch and on the load side.',
      'Remember the load side can be energised from either source, and from a second generator or inverter where one exists.',
    ],
    lockoutTagout: [
      'Lock the mains isolator, lock the generator output isolator, and disable and lock the generator auto-start — all three.',
      'Tag with your name and date, and brief anyone on site that the changeover is out of service.',
      'On multi-person work each person applies their own lock.',
      'Agree the outage with whoever owns the load before starting; a changeover panel serves everything downstream.',
    ],
    ppe: [
      'Arc-rated clothing and face protection appropriate to the prospective fault level at the panel — changeover panels sit close to the supply and fault levels are high',
      'Insulated gloves and tools rated above the system voltage',
      'Eye protection during any mechanical work on the operator',
      'Keep hands clear of the mechanism whenever the operator may move',
    ],
    storedEnergy: [
      'Motorised breakers and motor-operated switches hold a charged spring capable of operating the mechanism at speed. Discharge it per the manufacturer procedure before working on the mechanism.',
      'A charged mechanism can close the switch even with the control supply removed.',
      'Capacitors in the control supply may hold charge after isolation.',
      'The generator may auto-start unless it is specifically disabled and locked — the control supply being off is not sufficient.',
    ],
    specificHazards: [
      'NEVER defeat, bypass or remove an interlock to force a transfer. Closing both sources together back-feeds the utility network and can kill someone working on the line, as well as destroying the generator when the mains returns.',
      'A welded main contact means one source is still connected even though the switch indicates otherwise — the interlock refusing to operate is correct behaviour and a warning.',
      'Manual operation of a changeover under load is hazardous and, on many designs, not permitted; check the manufacturer instruction before touching the handle.',
      'Testing a transfer drops the load. Confirm this is acceptable before initiating one.',
      'A generator that starts while you are in the panel makes the panel live from the second source.',
    ],
    stopAndCallProfessional: [
      'You find evidence that an interlock has been bypassed, strapped out or removed — do not energise until it is restored and verified.',
      'Main contacts are welded; the switch cannot be trusted and the fault that welded them must be found.',
      'The panel serves a life-safety load and the outage has not been authorised.',
      'You cannot obtain the panel schematic and therefore cannot verify the interlock chain.',
      'Arc-flash risk at the panel exceeds your assessed protection.',
      'The changeover is part of a parallel or synchronised arrangement, which is a different discipline entirely.',
    ],
  },

  tools: [
    { tool: 'Multimeter, CAT III or CAT IV as the location demands, with a proving unit', why: 'Control circuit tracing and proving dead, at a location with a high prospective fault level' },
    { tool: 'The panel schematic and control diagram', why: 'The interlock chain cannot be verified without it, and assuming its arrangement is how interlocks get bypassed' },
    { tool: 'Continuity tester', why: 'Auxiliary contact and interlock chain verification with the panel isolated' },
    { tool: 'Insulated tools rated for the system voltage', why: 'Working in a panel with two independent sources' },
    { tool: 'Torque screwdriver', why: 'Control and power terminations must be torqued to the manufacturer figure' },
    { tool: 'Thermal camera', why: 'Finds high-resistance joints and overheating contacts under load before they fail' },
    { tool: 'Contact resistance tester where available', why: 'Quantifies main contact condition rather than judging erosion by eye' },
    { tool: 'Manufacturer manual for the switching device', why: 'Spring discharge procedure, permitted manual operation and adjustment limits are device-specific' },
  ],

  decisionTree: [
    {
      question: 'Is a valid transfer command present at the operator coil or motor circuit?',
      yes: 'The command arrived — the fault is the operator or an interlock',
      no: 'The fault is upstream: controller output, control supply, fuse, wiring or a permissive contact',
    },
    {
      question: 'Are the main contacts of the opposite device confirmed OPEN?',
      yes: 'The interlock should permit the transfer',
      no: 'A welded or partially closed contact means the interlock is correctly refusing. Find and fix that first.',
    },
    {
      question: 'Does the interlock chain show continuity when it should?',
      yes: 'Interlocks are permitting — the fault is the operator itself',
      no: 'An auxiliary contact has failed or is misadjusted. Repair it; never strap it out.',
    },
    {
      question: 'Does the operator move when commanded with both sources safely isolated?',
      yes: 'The mechanism is serviceable — look again at the control and interlock chain under live conditions',
      no: 'The operator has failed mechanically or electrically',
    },
    {
      question: 'On a motorised design, is the mechanism charged?',
      yes: 'Stored energy is available — the release or the control is at fault',
      no: 'The charge motor or charging mechanism has failed',
    },
    {
      question: 'Was any interlock found bypassed, strapped or removed?',
      yes: 'Stop. Restore and verify it before the panel is energised or handed back.',
      no: 'Complete the repair and prove the interlock function before returning to service',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish what the controller believes and what is actually true',
      inspect: 'Controller source-available indications, commanded position, and the physical switch position',
      where: 'Controller display and the switch itself',
      instrument: 'Observation, plus a meter to confirm what is actually energised',
      expected: 'Controller indication agreeing with the physical position of the switch',
      ifAbnormal:
        'Disagreement between commanded position, indicated position and physical position is the single most useful finding — it usually points straight at a position feedback or auxiliary contact fault',
      next: 'Do not proceed on the controller display alone; confirm the physical position by looking at the device',
      warning:
        'A controller showing a source disconnected does not mean it is disconnected. A welded contact indicates open and is closed.',
    },
    {
      step: 2,
      title: 'Isolate both sources properly before opening anything',
      inspect: 'That mains, generator and auto-start are all isolated and locked',
      where: 'Mains isolator, generator output isolator, generator control',
      instrument: 'Meter with a proving unit',
      expected: 'All sources proved dead, auto-start disabled and locked',
      ifAbnormal:
        'Any source still live means the panel is not safe to work in. The two-source nature of a changeover panel is the hazard that catches people out.',
      next: 'Prove dead on both source sides and on the load side',
      warning:
        'Disabling the generator control supply is not the same as disabling auto-start. Lock the generator out physically.',
    },
    {
      step: 3,
      title: 'Trace the command to the operator',
      inspect: 'Continuity and voltage through the control chain from controller output to operator coil',
      where: 'Controller output terminals, control fuses, permissive contacts, coil terminals',
      instrument: 'Multimeter, working from the schematic',
      expected: 'The command reaching the coil when it should, with each element in the chain passing it',
      ifAbnormal:
        'A break in the chain localises the fault: a failed controller output, an operated fuse, a loose terminal, or a permissive contact that is open',
      next: 'Where a permissive contact is open, determine WHY before doing anything about it — that is the interlock',
      verify: 'The control chain must be traced against the panel schematic, not assumed',
    },
    {
      step: 4,
      title: 'Verify the interlock chain deliberately',
      inspect: 'Every auxiliary contact used in the interlock, and the mechanical interlock condition',
      where: 'Auxiliary contact blocks on both devices, and the mechanical interlock linkage',
      instrument: 'Continuity tester with the panel isolated, and visual inspection of the linkage',
      expected:
        'Auxiliary contacts changing state correctly with device position, and the mechanical interlock free and undamaged',
      ifAbnormal:
        'A failed auxiliary contact prevents transfer while the mechanism is perfectly serviceable — this is the most commonly misdiagnosed fault on an ATS',
      next: 'Confirm the mechanical interlock moves freely and has not been bent by a forced manual operation',
      warning:
        'If an interlock is preventing transfer because the other device is still closed, the interlock is RIGHT. Find why that device has not opened.',
    },
    {
      step: 5,
      title: 'Inspect the main contacts',
      inspect: 'Condition of the main contacts on both devices',
      where: 'The switching devices, isolated and proved dead, with the mechanism spring discharged',
      instrument: 'Visual, and contact resistance measurement where available',
      expected: 'Contacts intact, with erosion within the manufacturer limits and no welding',
      ifAbnormal:
        'Welded contacts mean one source cannot disconnect — a serious condition. Heavy erosion means the device is near end of life and its interruption capability is compromised.',
      next: 'Establish what welded the contacts; repeated transfer under fault conditions is a common cause',
      verify: 'Acceptable contact erosion limits are stated by the device manufacturer',
      warning:
        'Discharge the stored-energy mechanism per the manufacturer procedure before putting hands anywhere near the contacts.',
    },
    {
      step: 6,
      title: 'Exercise the operator under controlled conditions',
      inspect: 'Whether the operator moves the mechanism fully and cleanly when commanded',
      where: 'The switching device, with both power sources isolated',
      instrument: 'Control supply only, per the manufacturer procedure',
      expected: 'Full, positive movement to each position without stalling or hesitation',
      ifAbnormal:
        'A contactor that buzzes without pulling in indicates a coil, supply or mechanical loading problem. A motor operator that runs without moving the mechanism indicates a mechanical failure. A mechanism that moves part-way indicates a limit switch or obstruction.',
      next: 'Operate several times — an intermittent mechanical fault will not show on a single operation',
      warning:
        'Keep hands clear. The mechanism moves fast and with force, and a stored-energy release is not gradual.',
    },
    {
      step: 7,
      title: 'Check the control supply under load',
      inspect: 'Control supply voltage while the operator is drawing current',
      where: 'At the coil or motor terminals during operation',
      instrument: 'Multimeter, measuring during the operation rather than at rest',
      expected: 'Control voltage remaining within the device tolerance throughout the operation',
      ifAbnormal:
        'A control supply that dips when the operator draws current gives a device that works on test and fails in service — a classic intermittent',
      next: 'Check the control transformer rating, battery condition, and terminal tightness',
      verify: 'Coil operating voltage range is stated by the device manufacturer',
    },
    {
      step: 8,
      title: 'Prove the full transfer sequence and the interlock before handing back',
      inspect: 'A complete transfer and return under controlled conditions, and a deliberate interlock test',
      where: 'The whole changeover',
      instrument: 'The panel, with the outage agreed',
      expected:
        'Clean transfer to generator on simulated mains loss, correct dwell, clean return on mains restoration, and an interlock that positively prevents both devices closing together',
      ifAbnormal:
        'Any hesitation, chatter or timing anomaly indicates the fault is not fully resolved',
      next: 'Record the transfer and return times, and record that the interlock was proved',
      warning:
        'Testing drops the load. Agree it first. And never conclude a repair without proving the interlock — that is the one function that protects lives beyond the site.',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Contacts, terminations and mechanism',
      steps: [
        'Re-torque all control and power terminations to the manufacturer figure.',
        'Replace terminal blocks showing heat discolouration rather than re-tightening them.',
        'Clean dust and debris from the mechanism, and check the linkage moves freely through its full travel.',
        'Clean and inspect auxiliary contact blocks; replace rather than clean where contacts are pitted.',
        'Lubricate the mechanism only where and with what the manufacturer specifies — the wrong lubricant attracts dust and stiffens the mechanism.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Coils, contacts and operators',
      steps: [
        'Replace coils with the correct voltage and type for the panel; a coil of the wrong voltage will work on test and fail in service or burn out.',
        'Replace main contacts where erosion exceeds the manufacturer limit, or replace the device where contacts are not serviceable separately.',
        'Replace welded devices entirely — a welded contact indicates the device has been through a fault it was not able to interrupt.',
        'Replace failed auxiliary contact blocks with the correct type; contact function and configuration must match the schematic.',
        'Replace a failed charge motor or stored-energy mechanism per the manufacturer procedure.',
      ],
      note:
        'Where main contacts have welded, the cause must be found. A device that welded once under a downstream fault will do it again if the protection coordination is wrong.',
    },
    {
      level: 'wiring',
      title: 'Restoring interlocks that have been compromised',
      steps: [
        'Where an interlock has been strapped out, bypassed or rewired, restore it exactly to the schematic.',
        'Where the schematic itself is wrong or missing, do not guess — the interlock arrangement must be established properly before the panel is energised.',
        'Verify both the electrical interlock, contact by contact, and the mechanical interlock, by attempting to close both devices with the panel safely isolated.',
        'Record that the interlock has been verified, with the date.',
      ],
      note:
        'A bypassed interlock is the most dangerous condition on this list. It endangers utility lineworkers, not just site staff, and it will not announce itself until a transfer goes wrong.',
    },
    {
      level: 'configuration',
      title: 'Control supply and timings',
      steps: [
        'Correct a control supply that dips under operator load — this is often a transformer sizing or terminal tightness issue.',
        'Verify transfer, dwell and return timings against the site requirement and record them.',
        'Confirm that a deliberate neutral dwell in the design is understood as correct behaviour rather than being adjusted out as a fault.',
        'Check generator auto-start and load-acceptance settings alongside the changeover; the two must work together.',
      ],
    },
  ],

  validation: [
    'Clean transfer to generator on simulated mains loss, with the recorded time',
    'Clean return to mains on restoration, with the recorded dwell and time',
    'Interlock proved to positively prevent both devices closing together — tested, not assumed',
    'Auxiliary contacts confirmed to change state correctly with device position',
    'Control supply remaining within tolerance throughout the operation',
    'No contact chatter, hesitation or stalling across several operations',
    'Main contact condition recorded, with erosion within manufacturer limits',
    'Terminations torqued and recorded',
  ],

  whenNotToRepair: [
    'Devices with welded main contacts — replace, and investigate the fault that welded them',
    'Mechanisms with a bent or damaged mechanical interlock, where correct interlock function cannot be guaranteed',
    'Panels where the interlock arrangement cannot be established from any schematic or by inspection',
    'Switching devices at or beyond their rated number of operations',
    'Any panel where an interlock has been bypassed and the reason cannot be established — the whole scheme needs review, not a repair',
    'Changeover equipment serving life-safety loads where the device condition is uncertain',
  ],

  prevention: [
    'Exercise the changeover on a scheduled interval under load — a switch that never operates seizes and its contacts oxidise',
    'Test the interlock function during scheduled maintenance rather than assuming it works',
    'Inspect and record main contact condition at each service, so erosion is tracked rather than discovered',
    'Re-torque control and power terminations periodically',
    'Keep the panel sealed against dust and moisture appropriate to its location',
    'Record transfer and return times at each test; a lengthening transfer time is an early warning',
    'Keep the panel schematic in the panel, current and legible, so nobody has to guess at the interlock chain',
    'Never leave a strap or temporary link in a changeover panel — remove it before the job is closed',
  ],

  relatedSlugs: [
    'ats-not-changing-over',
    'ats-will-not-return-to-mains',
    'generator-starts-in-manual-not-auto',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'The generator is running and the controller says transfer, but the switch does not move. Where do I start?',
      a: 'Prove whether the command actually reaches the operator coil. If it does, the fault is the operator or an interlock. If it does not, work back through the control chain — fuse, terminal, permissive contact, controller output. That single measurement splits the problem in half.',
    },
    {
      q: 'An interlock is stopping the transfer. Can I bypass it to get the site back on?',
      a: 'No, never. The interlock exists to make it impossible for both supplies to be connected at once. Bypassing it can back-feed the utility network and kill someone working on the line, and it will usually destroy the generator when the mains returns. If an interlock is blocking a transfer, it is almost always telling you the other device has not opened — find out why.',
    },
    {
      q: 'Why would a perfectly good contactor refuse to close?',
      a: 'Most often because an auxiliary contact in the electrical interlock has failed. The mechanism is fine, the coil is fine, but the permissive contact in the coil circuit is open, so the coil is never energised. It is the most commonly misdiagnosed ATS fault, because the symptom looks identical to a dead operator.',
    },
    {
      q: 'The switch works when I test it but fails during a real power cut. Why?',
      a: 'Usually the control supply. During a real outage the conditions differ — the control transformer may be fed differently, or a battery is carrying the load, and the voltage dips when the operator draws current. Measure the control voltage during the operation, not at rest.',
    },
    {
      q: 'What does a welded contact mean?',
      a: 'That the device has carried more current than it could interrupt, usually during a downstream fault. It means one source physically cannot disconnect, so the interlock will correctly refuse any transfer. Replace the device, and check the protection coordination, because whatever welded it can do so again.',
    },
    {
      q: 'Can I operate the changeover by hand to restore supply?',
      a: 'Only if the manufacturer permits manual operation under load for that device, and only with a full understanding of the interlock state. Many designs do not permit it, and forcing the handle bends the mechanical interlock — which then becomes the next fault, and a safety-critical one.',
    },
  ],

  references: [
    'Panel schematic and control diagram for the specific changeover installation',
    'Switching device manufacturer manual — contact erosion limits, coil voltage range, stored-energy discharge procedure and permitted manual operation',
    'ATS controller manual — transfer, dwell and return timing configuration and fault code meanings',
    'IEC 60947-6-1 — low-voltage switchgear and controlgear: multiple function equipment, transfer switching equipment',
    'IEC 60947-4-1 — contactors and motor-starters',
    'Site commissioning records, including the original interlock verification',
    'KS IEC standards as adopted by KEBS, and Energy and Petroleum Regulatory Authority requirements applying to installations in Kenya',
  ],
};
