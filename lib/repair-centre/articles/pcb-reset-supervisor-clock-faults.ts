import type { RepairArticle } from '../types';

export const pcbResetSupervisorClockFaults: RepairArticle = {
  slug: 'pcb-reset-supervisor-clock-faults',
  hub: 'pcb-motherboards',
  header: {
    title: 'Board Powers Up But Does Nothing — Reset, Supervisor and Clock Faults',
    equipmentCategory: 'Industrial control PCB',
    appliesTo:
      'Microcontroller and microprocessor control boards in generator controllers, inverters, UPS units, drives and industrial panels',
    difficulty: 'advanced',
    diagnosisComplexity:
      'Moderate once the sequence is understood — a processor needs power, a clock and a released reset, and only three things can be missing',
    competence: 'specialist-engineer',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'Low-voltage logic rails derived from the equipment supply; the board may sit adjacent to mains and DC bus potentials',
    safetyClass: 'stored-energy',
  },

  directAnswer:
    'A board whose rails are all present but which shows no sign of life has failed one of three preconditions: stable power, a running clock, or a released reset. Check them in that order, because each depends on the one before. Power is proven by comparing every rail against its neighbours and against the same board type where you have one. A clock is proven by observing activity at the oscillator — a crystal that is not oscillating produces a dead board with perfect rails, and it is a common failure that looks catastrophic and is not. Reset is proven by observing whether the reset line releases and stays released after power-up; a supervisor holding reset asserted, or oscillating it, produces exactly the same dead-board symptom. The most useful discipline here is comparison: against the same rail elsewhere on the board, against a known-good board, or against the board\'s own behaviour before and after a change. Absolute values belong to the manufacturer\'s data for that exact part, not to memory.',

  symptoms: {
    display: [
      'Display completely blank although the backlight is lit',
      'Display initialises briefly then goes blank and stays blank',
      'No response to any key press or input',
      'Communication port silent — no response to a poll that should always be answered',
    ],
    indicators: [
      'Power LED lit but no activity LED, on boards that provide one',
      'Status LED steady rather than blinking, where a blink pattern is the normal healthy indication',
      'Watchdog or fault LED asserted immediately after power-up',
    ],
    sounds: [
      'Relays not picking up at all during what should be the start-up sequence',
      'Repeated relay clicking at a regular interval, which indicates the board is resetting in a loop',
    ],
    smells: [
      'Burnt or acrid smell indicating a component has failed — investigate that before chasing logic faults',
    ],
    behaviour: [
      'Board consumes current but shows no functional activity',
      'Board cycles repeatedly, indicated by an LED or relay pattern that repeats on a fixed period',
      'Worked until a supply event, then never came back',
      'Fault appeared after a repair, a cleaning, or a firmware operation',
      'Board works when cold and fails as it warms, or the reverse — the classic marginal-component signature',
    ],
    visible: [
      'Corrosion or residue near the oscillator or supervisor devices',
      'Cracked crystal package, or a crystal with a damaged solder joint',
      'Swollen or leaking electrolytic capacitors on a logic rail',
      'Solder joint fractures around heavy or heat-cycled components',
      'Track damage or contamination bridging adjacent pins',
      'Evidence of previous repair work — reflowed joints, added wire links, replaced parts',
    ],
  },

  whatItMeans: {
    plain:
      'A control board has a small computer on it, and that computer needs three things before it will do anything at all: a steady power supply, a heartbeat to time its steps, and a starting signal telling it to begin. If any one of those is missing the board sits there apparently powered but completely inactive. The good news is that it is only three things, so the fault can be narrowed down quickly without needing to understand everything the board does.',
    technical:
      'A microcontroller requires its supply rails within tolerance, a running oscillator, and its reset input released before it will execute. A supervisor device holds reset asserted until the rails are stable, and re-asserts it if a rail dips or if a watchdog is not serviced. The three failure signatures are distinguishable. A rail out of tolerance holds the supervisor asserted, so reset stays low and the board never starts. A dead oscillator leaves the processor with no time base, so it never executes even with reset released — rails read perfectly and nothing happens. A supervisor or watchdog fault produces either a permanently asserted reset or a periodic reset, and the periodic case shows as a repeating pattern of relays or LEDs at a fixed interval. Because the three are sequential dependencies, testing them in order avoids chasing a symptom that is actually downstream of a simpler cause.',
  },

  causes: {
    mostLikely: [
      'A logic rail out of tolerance or unstable, holding the supervisor in reset',
      'Failed or degraded electrolytic capacitor on a logic rail, causing ripple that the supervisor sees as an unstable rail',
      'Crystal or oscillator failure, most often from a fractured solder joint or a cracked package after mechanical shock',
      'Supervisor or reset device failed, holding reset asserted',
    ],
    possible: [
      'Watchdog resetting the board because firmware is not running far enough to service it — a symptom of another fault rather than the fault itself',
      'Contamination or corrosion bridging pins near the oscillator or reset network',
      'Reset network component failure — the passive parts around the supervisor',
      'Brown-out on a rail under load, present only when downstream circuitry draws current',
    ],
    lessCommon: [
      'Processor itself failed, which is far less common than the supporting circuitry around it',
      'Firmware corrupted so the board resets before reaching a functional state',
      'Configuration memory failed, leaving the board unable to complete initialisation',
      'A downstream short pulling a rail down only after the supervisor has released, producing a reset loop',
    ],
    modelSpecific: [
      'Rail voltages, reset polarity, oscillator frequency and expected start-up sequence are all specific to the board and its devices — take every absolute value from the manufacturer data for the exact part',
      'Some designs deliberately hold reset until an external enable is present, so an asserted reset is not always a fault',
      'Blink codes and LED patterns are design-specific and are often documented; the pattern may name the fault directly',
    ],
    environmental: [
      'Condensation and humidity causing leakage across high-impedance reset and oscillator nodes',
      'Conductive dust in industrial environments bridging fine-pitch pins',
      'Thermal cycling fracturing solder joints, particularly on crystals and larger components',
      'Vibration cracking crystal packages and joints on boards mounted in generator and pump panels',
      'Supply surges from lightning or switching damaging the supervisor or the rail regulators',
    ],
    installation: [
      'Board supply taken from a source that dips during load transitions, causing repeated brown-out resets',
      'Poor earthing or bonding allowing noise onto reference nodes',
      'Board mounted where it experiences vibration it was not designed for',
      'Enclosure not sealed, admitting the dust or moisture that causes leakage faults',
    ],
    maintenance: [
      'Cleaning with an unsuitable solvent leaving conductive residue',
      'Washing a board without drying it fully, so leakage paths remain across high-impedance nodes',
      'Previous repair work that reflowed joints without addressing why they failed',
      'Handling without ESD precautions, causing latent damage that appears later',
    ],
    componentLevel: [
      'Electrolytic capacitor degradation on logic rails',
      'Crystal or oscillator module failure',
      'Supervisor or reset IC failure',
      'Regulator failure or instability',
      'Solder joint fracture at the crystal or supervisor',
    ],
  },

  safety: {
    isolation: [
      'Isolate the equipment supply, lock it and prove dead before removing or handling any board.',
      'A control board frequently sits in an enclosure alongside mains and DC bus potentials — treat the whole enclosure as live until proved otherwise.',
      'Where the board is in an inverter, UPS or drive, observe the DC-link discharge time in full before opening the enclosure.',
    ],
    lockoutTagout: [
      'Lock and tag the supply isolator.',
      'Where a generator can auto-start, disable and lock the auto-start before working in the panel.',
      'On UPS equipment, isolate and lock both the mains and the battery.',
    ],
    ppe: [
      'ESD wrist strap and mat whenever a board is handled — a board damaged by static may work now and fail later, which is worse than failing immediately',
      'Eye protection when working with solvents or when a component may have failed violently',
      'Insulated tools where any part of the enclosure remains energised',
    ],
    storedEnergy: [
      'DC-link and bulk capacitors hold a lethal charge after isolation. Wait the manufacturer discharge time and prove dead at the designated points.',
      'Even on a low-voltage board, bulk capacitors can hold enough energy to damage components and cause burns.',
      'Battery-backed circuits remain energised with the equipment off; a coin cell or backup capacitor keeps parts of the board alive.',
    ],
    specificHazards: [
      'Powering a board on the bench requires a supply that is current-limited; without it, a short turns a repairable board into a scrapped one.',
      'Probing a live board risks slipping and shorting adjacent pins — a very common way to convert a small fault into a large one.',
      'Solvents used for cleaning may be flammable and produce vapour; ventilate and keep away from ignition sources.',
      'Hot air and soldering work produces fumes requiring extraction.',
    ],
    stopAndCallProfessional: [
      'You do not have ESD-safe handling — the damage you cause will not be visible and will surface later.',
      'The equipment is under warranty; opening it will void the claim.',
      'Board-level work is required on safety-critical protection equipment, where a repair that appears to work is not an acceptable outcome.',
      'You find evidence of a component that failed violently — establish why before energising anything.',
      'The board carries mains potential in its working position and you are not competent at that voltage.',
      'The equipment is a UPS or drive and you have not been trained on its stored-energy hazards.',
    ],
  },

  tools: [
    { tool: 'Oscilloscope', why: 'The only reliable way to see whether an oscillator is running and whether reset releases — a multimeter cannot show either' },
    { tool: 'Multimeter', why: 'Rail comparison and continuity, as the first pass before the scope' },
    { tool: 'Current-limited bench supply', why: 'Powering a suspect board without turning a small fault into a destroyed board' },
    { tool: 'ESD wrist strap and mat', why: 'Handling damage is invisible and shows up as a field failure weeks later' },
    { tool: 'Thermal camera or freeze spray', why: 'Finds components that fail with temperature — the marginal faults that come and go' },
    { tool: 'Illuminated magnification', why: 'Solder fractures at crystals and fine-pitch parts are not visible to the unaided eye' },
    { tool: 'A known-good board of the same type where available', why: 'Comparison is the most powerful technique available at board level, and removes the need for absolute references' },
    { tool: 'Manufacturer documentation for the devices fitted', why: 'Every absolute value — rail tolerance, reset polarity, oscillator frequency — belongs to the part datasheet, not to memory' },
  ],

  decisionTree: [
    {
      question: 'Is there any sign of a component having failed — burnt, cracked, swollen, or a smell?',
      yes: 'Investigate that first. A logic fault chased on a board with a failed component wastes the whole session.',
      no: 'Proceed with the power, clock, reset sequence',
    },
    {
      question: 'Are all logic rails present and stable, compared against each other and against a known-good board?',
      yes: 'Power precondition satisfied — go to the clock',
      no: 'Fix the rail first; everything downstream depends on it',
    },
    {
      question: 'Is the oscillator running?',
      yes: 'Clock precondition satisfied — go to reset',
      no: 'A dead oscillator gives exactly this symptom with perfect rails. Check the crystal and its joints.',
    },
    {
      question: 'Does the reset line release after power-up and stay released?',
      yes: 'All three preconditions are met — the fault is beyond start-up',
      no: 'Reset held asserted means the supervisor is unhappy; reset pulsing means a reset loop',
    },
    {
      question: 'Is reset pulsing at a regular interval rather than held?',
      yes: 'A watchdog is resetting the board — firmware is not reaching a functional state, or a rail dips under load',
      no: 'Reset held asserted points at the supervisor, its network, or a rail still out of tolerance',
    },
    {
      question: 'Does the board behave differently when warmed or cooled?',
      yes: 'A marginal component — localise it with freeze spray or controlled warming',
      no: 'Continue with the static fault path',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Inspect before powering anything',
      inspect: 'The whole board under magnification, both sides',
      where: 'On the bench, board removed, ESD precautions in place',
      instrument: 'Illuminated magnification',
      expected:
        'Clean board, intact solder joints, no swollen or leaking capacitors, no corrosion, no contamination bridging pins',
      ifAbnormal:
        'Visible component failure, corrosion or track damage found here changes the whole diagnosis and must be addressed first',
      next: 'Photograph the board before any work, both sides, so the original state is recorded',
      warning:
        'Handle only with ESD precautions. Damage from static is invisible and produces a field failure later, which is far worse than an immediate one.',
    },
    {
      step: 2,
      title: 'Compare every logic rail',
      inspect: 'Each supply rail on the board, measured at a decoupling capacitor close to the load',
      where: 'At decoupling capacitors near the processor and supporting devices',
      instrument: 'Multimeter first, then oscilloscope for ripple and stability',
      expected:
        'Every rail steady and within the tolerance stated in the datasheet for the devices it feeds, with ripple low and no dips',
      ifAbnormal:
        'A rail low, absent or unstable will hold the supervisor asserted. A rail with excessive ripple indicates a degraded bulk or decoupling capacitor.',
      next: 'Resolve any rail problem before looking at the clock or reset — both depend on it',
      verify:
        'Rail values and tolerances come from the datasheets of the devices fitted to this board. Do not work from remembered figures.',
      warning:
        'Measure at the load, not at the regulator output. A rail can be correct at its source and collapsed at the processor through a broken track or a failed decoupling path.',
    },
    {
      step: 3,
      title: 'Confirm the oscillator is running',
      inspect: 'Activity at the crystal or oscillator pins',
      where: 'At the oscillator, using the lowest-capacitance probing available',
      instrument: 'Oscilloscope with an appropriate probe',
      expected:
        'A clean, continuous oscillation at the frequency marked on the crystal or stated in the design documentation',
      ifAbnormal:
        'No oscillation means the processor has no time base and will never execute, regardless of how good the rails look. This is a common fault that presents as a completely dead board.',
      next: 'Where there is no oscillation, inspect the crystal joints closely and check the associated passive components',
      verify: 'Expected frequency is marked on the crystal package or given in the design documentation',
      warning:
        'A standard probe loads an oscillator and can stop it. If the oscillation stops when you probe, that is a probing artefact rather than a fault — use a low-capacitance probe or observe a buffered output instead.',
    },
    {
      step: 4,
      title: 'Observe the reset line through power-up',
      inspect: 'Reset behaviour from the moment power is applied',
      where: 'At the processor reset pin',
      instrument: 'Oscilloscope, triggered on power-up',
      expected:
        'Reset asserted while the rails come up, then released cleanly once they are stable, and staying released',
      ifAbnormal:
        'Held asserted indicates the supervisor is unhappy with a rail, or the supervisor itself has failed. Pulsing at a regular interval indicates a watchdog resetting the board repeatedly.',
      next: 'Note the polarity of the reset signal for this design before interpreting it — active low and active high both exist',
      verify:
        'Reset polarity and the supervisor threshold are stated in the supervisor device datasheet',
    },
    {
      step: 5,
      title: 'Separate a reset loop from a held reset',
      inspect: 'Whether the reset repeats on a fixed period, and whether rails dip in sympathy',
      where: 'Reset pin and the main logic rail, observed together',
      instrument: 'Oscilloscope, two channels',
      expected: 'A clear relationship, or the absence of one',
      ifAbnormal:
        'Rail dipping in step with the reset means a downstream load is pulling it down once the board starts. Reset repeating with rails steady means a watchdog timing out because firmware is not running.',
      next:
        'A rail that dips only under load points at a downstream short — work the short-circuit guide for that rail',
      warning: 'Do not defeat a watchdog to make a board appear to run. It is reporting a real condition.',
    },
    {
      step: 6,
      title: 'Test for temperature-dependent behaviour',
      inspect: 'Whether the fault changes with component temperature',
      where: 'Across the board, concentrating on the oscillator, supervisor and rail components',
      instrument: 'Freeze spray and controlled warm air, with a thermal camera where available',
      expected: 'Behaviour unchanged by moderate temperature variation on a healthy board',
      ifAbnormal:
        'A board that starts when a component is cooled, or fails when it is warmed, has localised that component precisely',
      next: 'This technique finds marginal parts that every static test passes',
      warning:
        'Apply freeze spray in short bursts to one component at a time. Flooding the board causes condensation and creates new leakage faults.',
    },
    {
      step: 7,
      title: 'Compare against a known-good board',
      inspect: 'The same measurements on a working board of the same type',
      where: 'Corresponding test points on both boards',
      instrument: 'The same instruments, same settings',
      expected: 'The faulty board differing from the good one at exactly one stage of the sequence',
      ifAbnormal:
        'The point of divergence between the two boards is the fault, and this is the most reliable technique available at board level',
      next: 'Where no known-good board exists, compare identical circuits within the same board where the design repeats them',
    },
    {
      step: 8,
      title: 'Verify the repair under real conditions, not on the bench alone',
      inspect: 'Full start-up, normal operation, and behaviour across a temperature range',
      where: 'In the equipment, in its working position',
      instrument: 'The equipment\'s own indications, plus the scope where access allows',
      expected:
        'Clean start every time from cold and from warm, correct operation, and no watchdog activity in normal running',
      ifAbnormal:
        'A board that starts reliably on the bench and intermittently in the equipment usually has a supply or environmental cause that the bench does not reproduce',
      next: 'Run it through several power cycles from different temperatures before declaring it repaired',
    },
  ],

  repair: [
    {
      level: 'board-level',
      title: 'Solder joint and mechanical repair',
      steps: [
        'Reflow fractured joints with the correct alloy and appropriate flux, at a temperature suited to the board.',
        'Where a joint has fractured through thermal cycling, establish why — a component under mechanical strain will fracture again.',
        'Support components that are inadequately restrained if the board is in a vibrating installation.',
        'Inspect the repaired joint under magnification; a joint that looks acceptable to the eye may be cold.',
      ],
      note:
        'Reflowing a joint without understanding why it failed is a temporary repair. Vibration and thermal cycling do not stop because the joint was remade.',
    },
    {
      level: 'component-replacement',
      title: 'Replacing oscillator, supervisor and rail components',
      steps: [
        'Replace with the exact part specified, matching frequency, load capacitance, tolerance and package for crystals and oscillators.',
        'Replace electrolytic capacitors on logic rails with parts of correct value, voltage rating, temperature rating and ripple current capability.',
        'Match the supervisor threshold and reset polarity exactly — a supervisor with a different threshold changes the board\'s behaviour in ways that appear intermittent.',
        'Clean flux residue thoroughly after replacement; residue across a high-impedance reset or oscillator node causes the next fault.',
        'Test with a current-limited supply before returning to the equipment.',
      ],
    },
    {
      level: 'cleaning-and-connections',
      title: 'Contamination removal around high-impedance nodes',
      steps: [
        'Clean with a solvent appropriate to the board and its components, following the board manufacturer guidance where available.',
        'Pay particular attention around the oscillator, reset network and any high-impedance sense nodes — these are where leakage matters most.',
        'Dry completely before powering. A board that is merely damp will behave erratically and mislead the entire diagnosis.',
        'Address the reason contamination reached the board — an unsealed enclosure will refill it.',
      ],
    },
    {
      level: 'board-replacement',
      title: 'When the board is replaced rather than repaired',
      steps: [
        'Record the configuration and any site-specific settings before removing the old board, because they are rarely documented anywhere else.',
        'Confirm the replacement is the correct revision for the equipment — board revisions are not always interchangeable.',
        'Transfer or re-enter configuration and verify it against the site record.',
        'Establish and correct the environmental cause before fitting the replacement, or it follows the old board.',
      ],
    },
  ],

  validation: [
    'All logic rails stable and within tolerance at the load, with low ripple',
    'Oscillator running cleanly and continuously',
    'Reset releasing on power-up and remaining released through normal operation',
    'No watchdog activity during normal running',
    'Board starting reliably across repeated power cycles from both cold and warm',
    'Equipment functions verified in its working position, not only on the bench',
    'Configuration verified against the site record after any board replacement',
  ],

  whenNotToRepair: [
    'Safety-critical protection equipment, where a board repair that appears to work is not an acceptable outcome',
    'Boards with extensive corrosion or track damage across multiple areas',
    'Boards where the processor or a programmed device has failed and no programmed replacement is available',
    'Equipment under warranty',
    'Boards where the fault is intermittent and cannot be reproduced or localised — an unpredictable control board is worse than a failed one, because it is trusted',
    'Any board where the repair cost, including the diagnosis time, approaches a replacement that carries a warranty',
  ],

  prevention: [
    'Keep enclosures sealed and correctly rated for the environment; contamination is the origin of many logic faults',
    'Provide the control supply from a source that does not dip during load transitions',
    'Handle boards only with ESD precautions, including during installation and inspection',
    'Record configuration settings at commissioning and after every change, so a board replacement does not lose them',
    'Address vibration at source where boards are mounted in generator and pump panels',
    'Fit and maintain surge protection where supply disturbances are common',
    'Keep spares of critical control boards for equipment where downtime matters more than the cost of the spare',
  ],

  relatedSlugs: [
    'pcb-short-circuit-diagnosis',
    'motherboard-power-rail-diagnosis',
    'safe-isolation-and-proving-dead',
    'test-instruments-and-measurement-errors',
  ],

  faq: [
    {
      q: 'All the voltages are correct but the board does nothing. What now?',
      a: 'Check the clock next. A crystal that is not oscillating gives exactly that symptom — perfect rails and a completely inert board. It is a common failure, often just a fractured solder joint at the crystal, and it looks far more serious than it is.',
    },
    {
      q: 'The relays click at a steady interval. What does that mean?',
      a: 'The board is resetting in a loop. Either a watchdog is timing out because the firmware never reaches a functional state, or a rail dips once the board starts drawing current and the supervisor re-asserts reset. Watch the reset line and the main rail together on a scope and the two cases are easy to tell apart.',
    },
    {
      q: 'Can I disable the watchdog to get the board running?',
      a: 'No. The watchdog is reporting a real condition — something is preventing normal execution. Defeating it produces equipment that appears to run while the underlying fault is still present, which on control equipment is worse than a board that plainly does not work.',
    },
    {
      q: 'Why does the oscillator stop when I probe it?',
      a: 'A standard scope probe adds capacitance that can stop a marginal oscillator. That is a measurement artefact, not necessarily a fault. Use a low-capacitance probe, or observe a buffered clock output elsewhere on the board instead.',
    },
    {
      q: 'The board works when I spray it with freeze spray. Is that useful?',
      a: 'Very. It means a specific component is marginal and temperature-dependent, and by applying the spray to one component at a time you can localise it precisely. That is a fault no static measurement will find.',
    },
    {
      q: 'Why do you not give the voltages and frequencies to look for?',
      a: 'Because they belong to the specific devices on your board, and a figure remembered from another design is how boards get destroyed. Take rail tolerances from the device datasheets and the oscillator frequency from the crystal marking. Diagnose by comparison — rail against rail, board against known-good board — which is valid without any absolute reference at all.',
    },
  ],

  references: [
    'Datasheets for the processor, supervisor, regulator and oscillator fitted to the board',
    'Equipment manufacturer service documentation, including any documented LED blink codes',
    'Board revision and configuration records for the installation',
    'IPC-A-610 — acceptability of electronic assemblies, for solder joint and cleanliness criteria',
    'IPC-7711/7721 — rework, modification and repair of electronic assemblies',
    'IEC 61340-5-1 — protection of electronic devices from electrostatic phenomena',
  ],
};
