import type { RepairArticle } from '../types';

export const controllerCommunicationFaults: RepairArticle = {
  slug: 'controller-communication-faults',
  hub: 'controllers',
  header: {
    title: 'Controller Communication Faults — CAN, RS485 and the Screen Nobody Terminated',
    equipmentCategory: 'Generator controller',
    appliesTo:
      'Generator controllers communicating over CAN (J1939), RS485 (Modbus) and DSENet-type expansion links, single sets and multi-set installations',
    difficulty: 'advanced',
    diagnosisComplexity:
      'Systematic rather than difficult — a communication link has few failure modes, and nearly all of them are wiring, termination or configuration rather than hardware',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'Controller supply per panel design; communication at signal level alongside 415 V three-phase 50 Hz power circuits',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'A controller that has lost communication with an engine ECU, an expansion module or a remote system has failed at one of five things, and they are worth checking in order: the physical wiring, the termination resistors, the screen and its earthing, the configuration at both ends, and only then the hardware. The overwhelming majority are the first three. A CAN or RS485 link is a bus that requires the correct cable, terminated at each end and only at each end, with the screen earthed at one point only — and it fails when someone adds a device by spurring off the middle, fits a third terminator, earths the screen at both ends, or runs the link in the same trunking as motor cables. Diagnose it with the link powered down: measure resistance across the bus, which tells you immediately how many terminators are present, then confirm the screen is earthed once, then check that both ends agree on speed and addressing. A controller reporting a communication fault is far more often reporting on the installation than on itself.',

  symptoms: {
    display: [
      'Controller reporting ECU communication failure, CAN fail or link loss',
      'Engine parameters shown as dashes, zeros or last-known values rather than live data',
      'Expansion module inputs and outputs not responding',
      'Remote monitoring or BMS showing the set offline while the panel itself is fine',
      'Controller reporting a fault that the engine ECU does not corroborate',
    ],
    indicators: [
      'Communication LED off, or flashing an error pattern where the controller provides one',
      'Intermittent link, with data returning and dropping',
      'Fault appearing only when the set is running, which points at electrical interference',
    ],
    sounds: ['None — this is an electrically quiet fault, which is part of why it is misattributed'],
    smells: ['None, unless a terminal has overheated'],
    behaviour: [
      'Link lost after a device was added to the network — the classic third-terminator or spur fault',
      'Link works with the set stopped and fails once it runs, indicating interference from the power circuits',
      'Link intermittent in wet weather, indicating moisture at a termination',
      'Fault appeared after maintenance in which panel wiring was disturbed',
      'One device on a multi-device bus unreachable while the others are fine, pointing at that device or its spur',
      'Whole bus down, pointing at termination, a break, or a supply fault',
    ],
    visible: [
      'Communication cable that is not the specified type — general control cable used instead of 120 ohm twisted screened',
      'Screen earthed at both ends, or not earthed at all, or pigtailed to a terminal',
      'A device connected by a long spur from the middle of the bus rather than in line',
      'Termination resistor missing, or a third one fitted where a device was added',
      'Communication cable run in the same trunking as motor or drive cables',
      'Terminals loose, corroded or with broken crimps',
      'Cable damaged at a gland, hinge or door loom',
      'Rodent damage to control wiring',
    ],
  },

  whatItMeans: {
    plain:
      'Modern generator controllers talk to the engine and to other equipment over a small two-wire network. That network is a single line that all devices sit along, and it has strict rules: the right sort of cable, a resistor at each far end and nowhere else, and the screening wire earthed at one point only. Break any of those rules — usually by adding a device in the wrong place, or by fitting an extra resistor, or by running the cable next to power cables — and the messages get corrupted and the controller reports it has lost contact. Nearly always the fault is in how the wiring was done, not in the controller.',
    technical:
      'CAN and RS485 are differential multi-drop buses. Signal integrity depends on the line being a controlled-impedance transmission path terminated in its characteristic impedance at each physical end, so the correct cable is specified, terminators are fitted at the two extremes only, and devices connect in line rather than by long spurs. Fitting a third terminator lowers the parallel bus resistance and reduces differential amplitude; omitting one produces reflections. Both corrupt frames, and the resulting symptom is identical from the controller display — a communication failure that says nothing about which of the two occurred. Measuring bus resistance with the link powered down distinguishes them directly, because the terminators appear in parallel and the reading is therefore a direct count of how many are present. Screening provides the return path for common-mode interference and must be earthed at a single point; earthing at both ends creates a circulating path through the installation earth, and leaving it unearthed provides no return at all. Because a generating set panel contains power circuits switching heavy currents, and often a drive, routing the bus alongside those circuits couples interference directly into a signal-level differential pair — which is why a link that works with the set stopped and fails once it runs is nearly always a routing or screening defect rather than a hardware one.',
  },

  causes: {
    mostLikely: [
      'Termination resistors wrong in number — one missing, or a third fitted when a device was added',
      'Screen earthed at both ends, or pigtailed rather than terminated properly, or not earthed at all',
      'Wrong cable type — general control cable instead of the specified 120 ohm twisted screened pair',
      'A device connected by a long spur from the middle of the bus rather than in line',
    ],
    possible: [
      'Communication cable routed alongside motor, drive or power cabling, coupling interference into the bus',
      'Loose terminal or broken crimp giving an intermittent link',
      'Baud rate, addressing or protocol mismatch between the two ends after a firmware change or a replacement device',
      'Cable damaged at a door hinge loom, gland or panel edge',
      'Bus length beyond the limit for the speed in use',
    ],
    lessCommon: [
      'Engine ECU not powered or in a state where it does not transmit',
      'Controller communication port failed',
      'Firmware version mismatch between controller and expansion module',
      'Duplicate addresses on the bus after a device replacement',
      'Ground potential difference between panels on a long link, requiring galvanic isolation',
      'Rodent damage inside the panel',
    ],
    modelSpecific: [
      'Whether the termination resistor is built into the controller and switch-selectable, or must be fitted externally, is model-specific and is a common source of an accidental third terminator',
      'Baud rate, addressing scheme and supported protocol are set by the controller and the connected device and must match',
      'Maximum bus length for a given speed is specified by the standard and by the manufacturer',
      'Cable specification is stated by the controller manufacturer, and some name a specific part number',
      'Fault code meanings for communication failures are controller-specific',
    ],
    environmental: [
      'Humidity and condensation causing intermittent contact at terminals',
      'Dust and contamination in panels at unsealed sites',
      'Vibration in generating set panels loosening terminations over time',
      'Temperature cycling working crimps and terminals loose',
      'Electrical noise from switching, drives and contactors within the same panel',
    ],
    installation: [
      'Bus wired as a star or with long spurs rather than as a line',
      'Terminators fitted by habit at every device rather than at the two ends',
      'Screen terminated as a pigtail, which is ineffective at the frequencies involved',
      'Communication and power cables sharing trunking or conduit',
      'Cable specification substituted on site for whatever was available',
      'No provision for the screen earthing arrangement to be identified later',
    ],
    maintenance: [
      'Devices added to the bus without reassessing termination',
      'Terminations disturbed during other work and reinstated incorrectly',
      'Firmware updated at one end only, creating a protocol mismatch',
      'A replacement device fitted with default addressing that collides with an existing one',
      'No record of the bus topology, so each engineer rediscovers it',
    ],
    componentLevel: [
      'Termination resistor missing, incorrect or failed',
      'Cable conductor or screen damage',
      'Terminal or crimp failure',
      'Controller or module communication transceiver failure',
    ],
  },

  safety: {
    isolation: [
      'A generator panel has multiple sources — mains, generator and control supply. Isolate and lock all of them before working.',
      'Disable and lock the generator auto-start; a set that starts while you are working in the panel makes it live from the second source.',
      'Where a drive is present, observe its DC-link discharge time.',
      'Prove dead before touching any conductor, including where the work is only on signal-level wiring.',
    ],
    lockoutTagout: [
      'Lock and tag the mains isolator, the generator output isolator and the control supply.',
      'Disable and lock the auto-start physically, not merely at the panel selector.',
      'Agree the outage before starting, since a changeover panel serves everything downstream.',
    ],
    ppe: [
      'Arc-rated clothing and face protection appropriate to the prospective fault level at the panel',
      'Insulated gloves and tools rated above the system voltage',
      'Eye protection when working in the panel',
    ],
    storedEnergy: [
      'Drive and inverter DC-link capacitors hold a lethal charge after isolation.',
      'Starting batteries remain energised and carry very high short-circuit energy.',
      'Control supply capacitors may retain charge.',
    ],
    specificHazards: [
      'Communication wiring sits at signal level inside a panel carrying full fault current. The wiring being harmless does not make the panel safe.',
      'Working on a live panel to trace an intermittent is where people are injured — isolate and use the measurements that work dead.',
      'A set that auto-starts during work energises the panel and can move a changeover mechanism.',
      'Disconnecting a bus while the system is running can put a controller into an unexpected state on a set carrying load.',
    ],
    stopAndCallProfessional: [
      'The installation requires galvanic isolation or a repeater, which is a design change rather than a repair.',
      'The bus topology cannot be established and no schematic exists.',
      'The panel serves a life-safety load and the outage has not been authorised.',
      'Arc-flash risk at the panel exceeds your assessed protection.',
      'Firmware changes are required — these can render a controller unusable if interrupted.',
      'The fault is in a parallel or synchronised multi-set installation, which is a different discipline.',
    ],
  },

  tools: [
    { tool: 'Multimeter with a good resistance range', why: 'Bus resistance measured dead is a direct count of how many terminators are on the line — the single most useful measurement here' },
    { tool: 'The panel schematic and bus topology drawing', why: 'Without knowing where the two physical ends are, termination cannot be assessed' },
    { tool: 'Oscilloscope', why: 'Shows signal quality, reflections and interference where the resistance and configuration checks come back clean' },
    { tool: 'Controller and connected-device manuals', why: 'Termination arrangement, baud rate, addressing, cable specification and fault codes are all device-specific' },
    { tool: 'Continuity tester', why: 'Conductor and screen continuity along the run, and confirming the screen is earthed at exactly one point' },
    { tool: 'Correct specification communication cable and connectors', why: 'Substituting general control cable is a leading cause and cannot be corrected by anything else' },
    { tool: 'Proving unit and insulated tools', why: 'The panel is hazardous regardless of the signal levels being worked on' },
  ],

  decisionTree: [
    {
      question: 'Is the whole bus down, or only one device?',
      yes: 'Whole bus down points at termination, a break, or the supply',
      no: 'One device unreachable points at that device, its spur, or its addressing',
    },
    {
      question: 'With the link powered down, does bus resistance indicate exactly two terminators?',
      yes: 'Termination is correct — continue',
      no: 'Too few means reflections, too many means reduced signal amplitude. Both corrupt data identically.',
    },
    {
      question: 'Is the screen earthed at exactly one point?',
      yes: 'Screening arrangement is correct',
      no: 'Both ends creates a circulating path; neither end provides no return. Correct it to a single point.',
    },
    {
      question: 'Is every device connected in line rather than by a long spur?',
      yes: 'Topology is correct',
      no: 'Rewire as a line. A star or long spurs will not work reliably regardless of anything else.',
    },
    {
      question: 'Does the link work with the set stopped and fail when it runs?',
      yes: 'Interference — check cable routing away from power circuits, and the screen termination',
      no: 'Continue',
    },
    {
      question: 'Do both ends agree on baud rate, protocol and addressing?',
      yes: 'Configuration is correct; suspect hardware last',
      no: 'Correct the mismatch — this is common after a firmware update or a device replacement',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish the scope and what changed',
      inspect: 'Whether the whole bus or one device is affected, and what was done immediately before the fault appeared',
      where: 'Controller display and the site history',
      instrument: 'The controller fault log and questions',
      expected: 'A clear scope and, usually, a recent change',
      ifAbnormal:
        'A fault that appeared after a device was added is almost always termination or topology. A fault after maintenance is almost always a disturbed termination.',
      next: 'Note whether the fault is constant or intermittent, and whether it correlates with the set running',
      verify: 'Communication fault code meanings are controller-specific',
    },
    {
      step: 2,
      title: 'Isolate the panel properly before working',
      inspect: 'That mains, generator, control supply and auto-start are all isolated and locked',
      where: 'All supply points and the generator control',
      instrument: 'Multimeter with a proving unit',
      expected: 'Panel proved dead and incapable of auto-starting',
      ifAbnormal: 'Any live source or enabled auto-start means the work must not proceed',
      next: 'Observe drive DC-link discharge time where a drive shares the panel',
      warning:
        'Signal-level work does not make a generating set panel safe. It carries full fault current and can auto-start.',
    },
    {
      step: 3,
      title: 'Measure bus resistance — the single most valuable check',
      inspect: 'Resistance across the two signal conductors with the bus completely powered down',
      where: 'At any convenient point on the bus',
      instrument: 'Multimeter on resistance',
      expected:
        'A reading consistent with exactly two terminators in parallel across the line, per the bus specification',
      ifAbnormal:
        'A reading roughly double the expected value indicates only one terminator. A reading well below it indicates a third has been fitted — the classic result of adding a device and terminating it out of habit.',
      next: 'This one measurement resolves a large proportion of these faults in under a minute',
      verify:
        'The expected terminator value and the resulting bus resistance come from the bus standard and the controller manual',
      warning:
        'Measure with the bus powered down. A resistance measurement on a live bus is meaningless and may disturb it.',
    },
    {
      step: 4,
      title: 'Confirm the topology is a line, not a star',
      inspect: 'How each device is connected — in line along the bus, or spurred from it',
      where: 'The physical wiring, traced through the panel and between panels',
      instrument: 'Visual tracing against the schematic',
      expected: 'A single line with devices in line and terminators at the two physical extremes',
      ifAbnormal:
        'Long spurs and star topologies cause reflections that no amount of termination adjustment will fix, and they frequently work at first and fail as devices are added',
      next: 'Identify the two true physical ends, because that is where terminators belong',
      verify: 'Maximum spur length, where any is permitted at all, is specified by the bus standard',
    },
    {
      step: 5,
      title: 'Check the screen and its earthing',
      inspect: 'Screen continuity along the run, and how many points it is earthed at',
      where: 'Every termination point along the bus',
      instrument: 'Continuity tester, with the panel isolated',
      expected: 'Screen continuous along the run and earthed at exactly one point',
      ifAbnormal:
        'Earthed at both ends creates a circulating current path through the installation earth. Not earthed at all provides no return for common-mode interference. A pigtail is ineffective at these frequencies.',
      next: 'Where panels are far apart and a ground potential difference exists, galvanic isolation may be required',
      warning:
        'Do not resolve a noise problem by disconnecting the screen. That removes the mechanism that was protecting the link.',
    },
    {
      step: 6,
      title: 'Check the cable itself and its routing',
      inspect: 'Cable type against specification, and its route relative to power and drive cabling',
      where: 'Along the whole run, including inside trunking and door looms',
      instrument: 'Visual inspection and the controller manual specification',
      expected:
        'The specified twisted screened pair of correct impedance, routed away from power circuits and crossing them at right angles where crossing is unavoidable',
      ifAbnormal:
        'General control cable substituted for the specified type is a leading cause. Communication cable sharing trunking with motor or drive cables couples interference directly into the pair.',
      next: 'Inspect door hinge looms and glands, where flexing breaks conductors and screens',
      verify: 'Cable specification is stated by the controller manufacturer, sometimes as a specific part number',
    },
    {
      step: 7,
      title: 'Verify configuration agreement at both ends',
      inspect: 'Baud rate, protocol, addressing and firmware versions at each device',
      where: 'Controller and each connected device',
      instrument: 'Device displays and configuration software',
      expected: 'Both ends agreeing on speed, protocol and unique addressing',
      ifAbnormal:
        'A mismatch after a firmware update or a device replacement is common, and duplicate addresses after fitting a replacement at default settings are equally common',
      next: 'Where firmware versions differ across the bus, check the manufacturer compatibility statement',
      warning:
        'Do not interrupt a firmware update. An interrupted update can leave a controller unusable and is not always recoverable on site.',
    },
    {
      step: 8,
      title: 'Observe the signal where everything else checks out',
      inspect: 'Differential signal quality on the bus with the system running',
      where: 'At the bus, with the set running under load',
      instrument: 'Oscilloscope',
      expected: 'Clean differential transitions with adequate amplitude and no significant reflections or noise',
      ifAbnormal:
        'Reduced amplitude suggests excess termination. Ringing suggests missing termination or a spur. Noise correlated with the set running confirms an interference and routing problem.',
      next: 'Only conclude a hardware fault once wiring, termination, screening and configuration are all proven correct',
    },
  ],

  repair: [
    {
      level: 'wiring',
      title: 'Termination, topology and screening',
      steps: [
        'Fit terminators at the two physical ends of the bus, and remove any others — including built-in terminators switched on at intermediate devices, which are the usual hidden third.',
        'Rewire spurs and star arrangements so devices sit in line along a single bus.',
        'Terminate the screen properly and earth it at exactly one point along the run.',
        'Replace pigtail screen terminations with a proper connection at the earthing point.',
        'Reroute communication cable away from power and drive cabling; cross at right angles where crossing is unavoidable.',
        'Replace substituted cable with the specified twisted screened pair of correct impedance.',
      ],
      note:
        'Termination and topology account for most of these faults. Bus resistance measured dead identifies the termination error in under a minute and is the first thing to do.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Terminations and mechanical integrity',
      steps: [
        'Re-terminate loose or damaged crimps, and torque terminals to the manufacturer figure.',
        'Replace cable damaged at hinges, glands and panel edges rather than repairing it in place.',
        'Clean and dry terminals showing moisture or corrosion, and address the ingress path.',
        'Support cable so it cannot flex at a termination.',
      ],
    },
    {
      level: 'configuration',
      title: 'Speed, protocol and addressing',
      steps: [
        'Set baud rate and protocol to match at both ends, and record the settings.',
        'Assign unique addresses and record them, particularly after fitting a replacement device at default settings.',
        'Check firmware compatibility across the bus against the manufacturer statement before updating anything.',
        'Update firmware only with a stable supply and never interrupt the process.',
        'Record the final configuration in the site file so the next replacement does not repeat the collision.',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Hardware, concluded last',
      steps: [
        'Replace a failed communication transceiver or module only after wiring, termination, screening and configuration are all proven correct.',
        'Where panels are far apart and a ground potential difference exists, fit galvanic isolation or a repeater as the design requires.',
        'Confirm the replacement device firmware is compatible with the rest of the bus before commissioning it.',
        'Record the bus topology drawing as part of the work, so the next engineer does not start blind.',
      ],
    },
  ],

  validation: [
    'Bus resistance measured dead, consistent with exactly two terminators',
    'Screen continuous and earthed at exactly one point, verified',
    'All devices connected in line, with the topology recorded',
    'Cable of the specified type, routed clear of power and drive circuits',
    'Baud rate, protocol and addressing agreeing at every device and recorded',
    'Link stable with the set running under load, not merely with the set stopped',
    'No communication faults logged across a full operating cycle',
    'Bus topology drawing produced or updated and left with the panel',
  ],

  whenNotToRepair: [
    'Installations requiring galvanic isolation or a repeater — that is a design change and should be engineered rather than improvised',
    'Buses whose topology cannot be established and where no schematic exists, until the wiring has been surveyed properly',
    'Controllers with a failed communication port, which are a replacement',
    'Firmware incompatibility across devices that the manufacturer does not support',
    'Parallel or synchronised multi-set installations, which require a specialist',
  ],

  prevention: [
    'Record the bus topology, terminator positions, screen earthing point and device addressing, and keep the drawing in the panel',
    'Reassess termination every time a device is added — this is the single most common way a working bus is broken',
    'Use the specified cable, and keep a note of the part number so substitution does not happen at the next repair',
    'Route communication cable away from power and drive circuits at installation, when it costs nothing',
    'Earth the screen at one point and mark that point clearly so the next person does not add a second',
    'Check firmware compatibility before updating any device on a shared bus',
    'Verify the link with the set running under load, not just at rest — interference faults only appear under load',
    'Torque and inspect communication terminations at scheduled maintenance, since vibration works them loose',
  ],

  relatedSlugs: [
    'controller-alarm-interpretation',
    'j1939-spn-fmi-explained',
    'generator-starts-in-manual-not-auto',
    'drive-motor-cable-screening-earth-leakage',
  ],

  faq: [
    {
      q: 'The controller says CAN failure. Is the controller faulty?',
      a: 'Very unlikely. Communication faults are overwhelmingly wiring, termination or configuration. Measure bus resistance with the link powered down — that single reading tells you how many terminators are on the line, and a wrong count is the most common cause by a wide margin.',
    },
    {
      q: 'How does measuring resistance tell me about terminators?',
      a: 'The terminators sit in parallel across the two signal conductors, so the resistance you measure with the bus dead is a direct indication of how many are fitted. Roughly double the expected value means only one is present; well below it means a third has been added, usually by someone terminating a new device out of habit.',
    },
    {
      q: 'We added a module and the whole bus stopped working. Why?',
      a: 'Almost certainly because the new device was terminated as well, giving three terminators, or because it was connected by a spur from the middle rather than in line. Both are easy to do and both corrupt the whole bus rather than just the new device.',
    },
    {
      q: 'The link works until the generator starts, then drops. What is that?',
      a: 'Interference. Once the set runs, power circuits in the panel are switching heavy currents, and if the communication cable shares trunking with them or the screen is not properly earthed at one point, that noise couples into the signal pair. It is a routing and screening problem, not a controller problem.',
    },
    {
      q: 'Should I earth the screen at both ends to be safe?',
      a: 'No. Earthing at both ends creates a circulating current path through the installation earth, which makes the interference worse rather than better. The screen is earthed at exactly one point along the run, and that point should be marked so nobody adds a second later.',
    },
    {
      q: 'Can I use ordinary control cable for a short run?',
      a: 'It may appear to work and then fail intermittently, usually once the set is running or once another device is added. These buses depend on a controlled-impedance twisted screened pair, and substituting general control cable is one of the leading causes of faults that nobody can explain afterwards.',
    },
  ],

  references: [
    'Controller manufacturer manual — communication port specification, cable requirement, termination arrangement, baud rate and addressing, and fault code meanings',
    'Engine ECU manufacturer documentation for the J1939 link, including supported parameters',
    'Expansion module and remote display manuals for the specific devices on the bus',
    'ISO 11898 series — road vehicles: controller area network (CAN), for the physical layer requirements applied by J1939',
    'SAE J1939 — serial control and communications heavy duty vehicle network',
    'TIA/EIA-485 — electrical characteristics of generators and receivers for use in balanced digital multipoint systems',
    'Panel schematic and bus topology drawing for the installation',
  ],
};
