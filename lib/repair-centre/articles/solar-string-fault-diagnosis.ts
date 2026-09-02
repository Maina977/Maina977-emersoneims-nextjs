import type { RepairArticle } from '../types';

export const solarStringFaultDiagnosis: RepairArticle = {
  slug: 'solar-string-fault-diagnosis',
  hub: 'solar',
  header: {
    title: 'Solar String Faults — Fuses, Connectors and the Dead String',
    equipmentCategory: 'Solar PV array',
    appliesTo:
      'Grid-tied, hybrid and off-grid PV arrays, roof and ground mounted, single and multiple MPPT inputs, with or without string combiner boxes',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Straightforward once the array is treated as a set of comparable strings; difficult if approached one module at a time',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem:
      'PV DC string voltage per array design; AC side 240 V / 415 V 50 Hz nominal',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A string that has stopped contributing is nearly always an open circuit rather than a failed module: a blown string fuse, a connector that has overheated or filled with water, or an isolator left open after maintenance. Diagnose it by comparison rather than by absolute values. On a clear day every string on the same MPPT input, at the same orientation and tilt, should show open-circuit voltage within a few percent of its neighbours and should carry a similar current. A string reading roughly zero volts is broken open somewhere in the loop. A string at close to full voltage but carrying no current is open beyond the measuring point, or its fuse has failed on one leg only. A string at a voltage that is a clean fraction of its neighbours has lost whole modules from the circuit. Locate the break by halving the string, and never break a DC connection under load.',

  symptoms: {
    display: [
      'Inverter reports one MPPT input producing less than the others under the same irradiance',
      'String current shown as zero, or markedly lower than sibling strings, on inverters that meter per string',
      'Insulation resistance or isolation fault raised at start-up on some inverters when a connector has admitted water',
      'Daily yield down by a fraction that corresponds closely to one string out of the total number of strings',
    ],
    indicators: [
      'String fuse indicator lamp lit, where the combiner box has them',
      'MPPT input showing a voltage but effectively no current',
      'Monitoring showing one input flat while the others follow the expected daily curve',
    ],
    sounds: [
      'Usually silent — a string fault does not announce itself',
      'Crackling or buzzing at a combiner or connector under load indicates arcing and is an emergency, not a diagnostic clue to explore at leisure',
    ],
    smells: [
      'Hot plastic or burnt phenolic smell at a combiner box or connector',
      'Ozone-like smell near an arcing joint',
    ],
    behaviour: [
      'System output steps down by a repeatable fraction rather than drifting gradually',
      'Loss appears suddenly, often after rain, wind or recent maintenance',
      'Output recovers if a connector is disturbed, then fails again — the signature of a high-resistance joint',
    ],
    visible: [
      'Discoloured, melted or distorted DC connector shells',
      'Water inside a connector or combiner enclosure, or staining below a gland',
      'Rodent damage to string cable, common on ground-mount and roof cable runs',
      'Mismatched connector brands mated together — a frequent and avoidable cause of overheating joints',
      'Cable ties failed by UV, letting string cable rest on the roof sheet or tray edge',
    ],
  },

  whatItMeans: {
    plain:
      'A solar array is not one big panel. It is several chains of panels wired end to end, and each chain is called a string. If one link in a chain breaks, the whole chain stops delivering, exactly like old Christmas lights. The remaining chains carry on, so the system still works — it just produces noticeably less. Finding the fault means working out which chain has stopped, then finding the broken link within it.',
    technical:
      'Modules in a string are in series, so string current is common to every module and string voltage is the sum of module voltages. An open circuit anywhere in the series loop takes the whole string out of the array, and the inverter simply sees one fewer contributor at that MPPT input. Because the strings on a given input are designed to be electrically similar, they form their own reference: sibling strings under the same irradiance and temperature are the correct comparison, and a deviation between them is far more diagnostically useful than any absolute figure measured against a datasheet on an unknown day. Open-circuit voltage falls only slightly with irradiance but moves appreciably with cell temperature, which is why voltage comparisons must be made between strings measured within a short window of each other, not against a morning reading taken hours earlier.',
  },

  causes: {
    mostLikely: [
      'Blown string fuse in the combiner box, most often following a lightning-induced surge or a reverse-current event',
      'DC connector failure — a poorly crimped or incorrectly mated connector that has developed resistance, heated and finally opened',
      'String isolator or DC switch left open, or partially operated, after maintenance or a fault call-out',
      'Water ingress into a connector or combiner gland causing corrosion of the contact',
    ],
    possible: [
      'Cable damage from rodents, roof traffic, or abrasion where a cable crosses a sharp tray edge',
      'Loose terminal in the combiner box or at the inverter input, backing off under thermal cycling',
      'Surge protection device that has operated and failed short, dragging a string down',
      'Module junction box terminal failure, where the internal joint rather than the cell string has opened',
    ],
    lessCommon: [
      'Genuinely open-circuit module, where an internal interconnect ribbon has fractured',
      'Reverse-polarity connection made during a repair, leaving the string opposing rather than contributing',
      'MPPT input failure on the inverter, which presents as a dead string but is an inverter fault',
    ],
    modelSpecific: [
      'Fuse rating and type are specific to the array design; confirm against the string design documentation before replacing anything',
      'Some inverters do not meter per string, so per-string diagnosis must be done with instruments rather than read from the display',
      'Maximum permitted strings in parallel per fuse group varies by design and determines whether string fusing is even required',
    ],
    environmental: [
      'Lightning activity — a common trigger in Kenyan highland and lake-basin sites, where induced surges take out fuses and SPDs without any direct strike',
      'Sustained wet-season humidity driving moisture into connectors that were never fully seated',
      'Thermal cycling between cold nights and high-irradiance days, which works marginal joints loose over time',
      'Dust and grit entering enclosures whose glands or lids were not properly closed after commissioning',
    ],
    installation: [
      'Mating connectors of different manufacture — mechanically they fit, electrically the contact geometry does not match and the joint runs hot',
      'Field-fitted connectors crimped with the wrong tool or without a crimp at all',
      'Cable runs unsupported or tied with non-UV-rated ties, so the cable eventually rests on a metal edge',
      'Combiner enclosure mounted without a drip loop, so water tracks down the cable into the gland',
    ],
    maintenance: [
      'Strings not restored correctly after panel cleaning or roof works',
      'Isolators operated under load, damaging contacts',
      'No periodic thermal check of combiner boxes, so a developing high-resistance joint is never seen before it opens',
    ],
    componentLevel: [
      'Fuse element fatigued by repeated surge events and finally failing at normal current',
      'Connector contact spring losing tension after repeated mating and unmating',
      'Corroded ferrule or terminal at the inverter DC input',
    ],
  },

  safety: {
    isolation: [
      'A PV array cannot be switched off. It produces voltage whenever there is light, and the DC side must be treated as live at all times.',
      'Isolate the AC side and open the DC isolator before opening any enclosure, then prove the state of every conductor you intend to touch.',
      'Where the array has string isolators, open them individually so a string is not left energised into a combiner you are working in.',
      'Covering modules to make them safe is unreliable at scale and gives a false sense of security — do not depend on it.',
    ],
    lockoutTagout: [
      'Lock the AC isolator and the DC isolator, and tag them with your name and the date.',
      'Where a hybrid or off-grid system has a battery, isolate and lock the battery side as well — the inverter can be energised from the battery with the array open.',
      'On a multi-person job, each person applies their own lock.',
    ],
    ppe: [
      'Gloves and eye protection rated for the DC voltage of the array',
      'Insulated tools rated above the maximum system voltage',
      'Roof work requires fall protection appropriate to the pitch and edge condition — most PV injuries are falls, not shocks',
      'Where arcing damage is suspected, arc-rated clothing and a face shield before opening the enclosure',
    ],
    storedEnergy: [
      'Inverter DC-link capacitors hold charge after isolation. Observe the manufacturer discharge time before touching internal terminals.',
      'Battery banks on hybrid and off-grid systems remain fully energised regardless of array state.',
      'Long DC string cables hold enough capacitance to give a startling discharge; treat conductors as live until proved otherwise.',
    ],
    specificHazards: [
      'Breaking a DC connection under load draws a sustained DC arc that does not self-extinguish as an AC arc does. Never unplug a connector while current is flowing — open the isolator first.',
      'A blown fuse may indicate a fault still present downstream. Replacing it without finding the cause can put the fault back on the system with you in front of it.',
      'Roof surfaces around arrays become extremely hot in the middle of the day and cause contact burns.',
      'Damaged insulation on a DC string can energise the mounting structure; verify structure-to-earth before handling the frame.',
    ],
    stopAndCallProfessional: [
      'You find evidence of arcing — melted connector shells, carbon tracking, or a burnt smell in a combiner. Stop, isolate, and have it investigated before re-energising.',
      'The array or its mounting structure is live to earth.',
      'You do not hold the competence to work on DC systems at the array voltage, which on commercial strings routinely exceeds anything encountered in domestic AC work.',
      'The fault recurs after a fuse replacement — that is a persistent fault, not a consumable at end of life.',
      'Work requires access you cannot make safe, including fragile roof sheets and unprotected edges.',
    ],
  },

  tools: [
    { tool: 'DC-capable clamp meter', why: 'Measures string current without breaking the circuit, which is the only safe way to check a live string' },
    { tool: 'Multimeter rated for the array DC voltage, CAT III minimum', why: 'Open-circuit voltage comparison between strings; a meter of insufficient category rating is a hazard on a PV array' },
    { tool: 'Irradiance meter, or a reference cell', why: 'Lets you confirm that conditions were comparable between two string measurements' },
    { tool: 'Thermal camera or infrared thermometer', why: 'Finds high-resistance joints in combiners and connectors before they fail open, and finds them without contact' },
    { tool: 'Insulation resistance tester suitable for PV', why: 'Confirms whether a string has an earth fault after water ingress, before it is returned to service' },
    { tool: 'Correct connector unmating tool for the connector family in use', why: 'Releasing a connector without the tool damages the latch and creates the next fault' },
    { tool: 'Proper crimp tool for the connector system being repaired', why: 'A field-made joint without the matching crimp tool is the single most common source of repeat failures' },
  ],

  decisionTree: [
    {
      question: 'Does one MPPT input or string show markedly lower output than its siblings under the same sun?',
      yes: 'Treat it as a string fault and continue',
      no: 'The loss is array-wide, not a string fault — work the underperformance guide instead',
    },
    {
      question: 'With the string isolated at the combiner, does it show open-circuit voltage close to its siblings?',
      yes: 'The series loop is intact — the fault is in the fuse, isolator, or the path onward to the inverter',
      no: 'The string itself is open or has lost modules — go to the halving procedure',
    },
    {
      question: 'Is the string voltage roughly zero rather than merely low?',
      yes: 'The loop is fully open — one break, to be located by halving',
      no: 'Voltage is a fraction of expected — whole modules are bypassed or shorted out of circuit',
    },
    {
      question: 'Does the string fuse show continuity?',
      yes: 'Fuse is intact — look at the isolator, terminals and onward cable',
      no: 'Fuse has operated — find out why before replacing it',
    },
    {
      question: 'Is there any sign of heat, melting or water at connectors and combiner terminals?',
      yes: 'Repair or replace the joint properly; do not re-mate a damaged connector',
      no: 'Continue tracing the open circuit through the string',
    },
    {
      question: 'After repair, does the string carry current comparable to its siblings?',
      yes: 'Restored — record the readings so the next comparison has a baseline',
      no: 'A second fault remains in the same string, or the module itself is at fault',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Establish that this is a string fault and not an array-wide loss',
      inspect: 'Per-input or per-string output on the inverter or monitoring platform, compared across inputs',
      where: 'Inverter display or monitoring portal',
      instrument: 'None — read the system first, measure second',
      expected:
        'Strings of the same design, orientation and tilt tracking together through the day. One input flat or stepped down while the others follow the normal curve indicates a string fault.',
      ifAbnormal:
        'If every input is down proportionally, the cause is shading, soiling, or an inverter limit rather than a string fault',
      next: 'Note which input is affected and by roughly what proportion before going to the array',
      verify:
        'Confirm from the array design documentation how many strings feed each MPPT input, and their orientation — strings on different roof faces are not comparable',
    },
    {
      step: 2,
      title: 'Inspect before you measure',
      inspect:
        'Combiner enclosure interior, string fuses and holders, isolators, connector shells at the array, and visible cable runs',
      where: 'Combiner box and the array end of the affected string',
      instrument: 'Visual, plus thermal camera if available with the system running',
      expected:
        'Dry enclosure, undamaged connector shells, cable supported clear of edges, no discolouration at any terminal',
      ifAbnormal:
        'Melting, discolouration or water found — that is very likely the fault, and it must be repaired rather than merely re-mated',
      next: 'If a thermal scan is possible under load, do it before isolating — a warm joint is only visible while current flows',
      warning:
        'Do not disturb connectors while the string is under load. Note what you see, then isolate before touching anything.',
    },
    {
      step: 3,
      title: 'Compare open-circuit voltage across sibling strings',
      inspect: 'Open-circuit voltage of the affected string against its siblings on the same input',
      where: 'Combiner box, strings isolated from the inverter',
      instrument: 'Multimeter rated for the array voltage, CAT III minimum',
      expected:
        'Sibling strings within a few percent of each other when measured within a short window under stable sun. A string near zero is open. A string at a clean fraction of the others has lost that proportion of its modules from the circuit.',
      ifAbnormal:
        'Near zero indicates a full open circuit. A fractional reading indicates modules bypassed or shorted out of the series loop.',
      next: 'Take all readings close together in time and note the irradiance, so the comparison is honest',
      verify:
        'Confirm the designed number of modules per string, so a fractional voltage can be converted into a number of missing modules',
      warning:
        'Open-circuit voltage on a cold, bright morning is the highest the array will produce. Confirm your meter category rating covers it.',
    },
    {
      step: 4,
      title: 'Compare string current under load',
      inspect: 'Operating current of each string with the system running normally',
      where: 'String conductors inside the combiner box',
      instrument: 'DC clamp meter',
      expected:
        'Sibling strings carrying similar current under the same irradiance. A string at full voltage but no current is open somewhere beyond your measuring point, or open on one leg only.',
      ifAbnormal:
        'Zero current with healthy voltage points at the fuse, isolator, or onward connection rather than the modules',
      next: 'Compare against the voltage findings from the previous step to place the fault before or after the combiner',
      warning: 'Clamp around one conductor only. Clamping both legs together reads zero and will mislead you.',
    },
    {
      step: 5,
      title: 'Check the string fuse and isolator',
      inspect: 'Fuse continuity and isolator contact continuity, with the string safely isolated',
      where: 'Combiner box',
      instrument: 'Multimeter on continuity, with the fuse removed from its holder',
      expected: 'Fuse showing continuity; isolator showing continuity when closed and open circuit when opened',
      ifAbnormal:
        'A failed fuse indicates a past surge or fault event. Establish why before replacing it. An isolator that does not make properly on all poles must be replaced, not adjusted.',
      next: 'If the fuse has failed, inspect the associated surge protection device — they commonly fail in the same event',
      verify:
        'Fuse rating, voltage rating and type must match the array design documentation. A fuse of the wrong type is a fire risk, not a repair.',
      warning:
        'Test the fuse out of circuit. A continuity reading taken in circuit can be completed through the rest of the array and read as healthy when it is not.',
    },
    {
      step: 6,
      title: 'Halve the string to locate an open circuit',
      inspect: 'Voltage at the midpoint of the string, then at the midpoint of whichever half is faulty',
      where: 'At module interconnections along the string',
      instrument: 'Multimeter rated for array voltage',
      expected:
        'The half containing the break shows no voltage build-up across it; the healthy half shows roughly half the string voltage. Repeat within the faulty half until the break sits between two adjacent modules.',
      ifAbnormal:
        'If both halves read healthy, the break is at an end termination or in the home run rather than within the string',
      next: 'Inspect the identified joint closely — this is where the connector or cable fault will be found',
      warning:
        'Open the string isolator before separating any connector. Breaking a live DC string draws a sustained arc.',
    },
    {
      step: 7,
      title: 'Test insulation resistance before returning to service',
      inspect: 'Insulation resistance of the repaired string, conductor to earth',
      where: 'At the combiner, string fully isolated from the inverter',
      instrument: 'Insulation resistance tester suitable for PV systems',
      expected:
        'A high, stable reading consistent with the other strings on the same array measured under the same conditions',
      ifAbnormal:
        'A low or falling reading indicates water ingress or damaged insulation still present — do not return the string to service',
      next: 'Where a connector admitted water, treat neighbouring connectors as suspect and inspect them too',
      verify:
        'Test voltage and the minimum acceptable value must be taken from the inverter and array documentation for this installation',
      warning:
        'Disconnect the string from the inverter before applying test voltage. Insulation testers damage inverter input stages.',
    },
    {
      step: 8,
      title: 'Confirm recovery by comparison, not by impression',
      inspect: 'Repaired string current and voltage against sibling strings under the same conditions',
      where: 'Combiner box and inverter monitoring',
      instrument: 'DC clamp meter and multimeter',
      expected: 'The repaired string within a few percent of its siblings on both voltage and current',
      ifAbnormal:
        'Still low — a second fault remains in the same string, or a module has degraded and needs the module-level guide',
      next: 'Record the readings, the date and the irradiance so the next person has a baseline to compare against',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Connector and termination repair',
      steps: [
        'Isolate and prove dead before separating any connector.',
        'Replace any connector showing heat damage, distortion or corrosion. Do not clean and re-mate a heat-damaged connector — the contact geometry is already lost.',
        'Fit connectors of the same manufacture and family on both halves of a mating pair. Cross-brand pairs are a recognised cause of overheating joints even though they mate mechanically.',
        'Use the crimp tool matched to the connector system. A crimp made with pliers or a generic tool will fail again.',
        'Re-torque combiner and inverter terminals to the manufacturer figure using a torque screwdriver.',
        'Restore cable support so no conductor rests on an edge, and use UV-rated ties.',
      ],
      note:
        'Most string faults are joints, not panels. A joint repaired properly stays repaired; a joint merely re-seated tends to return within a season.',
    },
    {
      level: 'component-replacement',
      title: 'Fuse and isolator replacement',
      steps: [
        'Establish why the fuse operated before fitting a new one.',
        'Fit only a fuse of the type, current rating and DC voltage rating specified in the array design. PV fuses are a specific class and a general-purpose fuse of the same current rating is not equivalent.',
        'Replace fuse holders that show heat discolouration — the holder contact is often the real fault.',
        'Replace, do not adjust, an isolator that fails to make cleanly on all poles.',
        'Inspect the surge protection device in the same enclosure; if it has operated, replace it as part of the same visit.',
      ],
    },
    {
      level: 'wiring',
      title: 'Cable repair and replacement',
      steps: [
        'Replace damaged string cable rather than repairing it in the middle of a run wherever the run length allows.',
        'Use PV-rated, double-insulated, UV-resistant cable of the same cross-section as the original.',
        'Where rodent damage caused the fault, address access as part of the repair or the fault recurs.',
        'Keep positive and negative of the same string close together to limit the induction loop area — this reduces surge stress that fails fuses.',
      ],
    },
    {
      level: 'configuration',
      title: 'Restoring the array to service',
      steps: [
        'Confirm polarity at the inverter input before closing the isolator.',
        'Close DC isolators before AC where the inverter manual specifies that order, and follow the manufacturer sequence rather than habit.',
        'Watch the first ramp-up and confirm the repaired input follows its siblings.',
        'Record baseline readings for the repaired string.',
      ],
    },
  ],

  validation: [
    'Repaired string open-circuit voltage within a few percent of its siblings, measured within the same short window',
    'Repaired string current comparable to siblings under the same irradiance',
    'Insulation resistance consistent with the other strings on the array',
    'No thermal anomaly at the repaired joint under load after the system has been running long enough to reach steady temperature',
    'Inverter reporting the affected input tracking normally across a full day',
    'Daily yield returned to the level expected for the conditions, not merely improved',
  ],

  whenNotToRepair: [
    'Evidence of arcing damage inside a combiner enclosure — the enclosure and its components should be replaced rather than patched',
    'Connectors of unknown or mixed manufacture throughout the array; piecemeal replacement will not stop repeat failures and the array needs a planned re-termination',
    'Cable insulation degraded along its length by UV rather than damaged at one point',
    'Repeated fuse failure on the same string after the cause has been addressed — this needs design review, not another fuse',
    'Modules themselves open-circuit internally, which is a module replacement and usually a warranty matter',
    'An array whose string design cannot be established from any documentation, where safe fusing and isolation cannot be confirmed',
  ],

  prevention: [
    'Thermal-scan combiner boxes and accessible connectors annually under load — a developing joint is visible long before it opens',
    'Record per-string voltage and current at commissioning and after any intervention, so future comparisons have a real baseline',
    'Standardise on one connector family across the array and keep the matching crimp and release tools on site',
    'Check enclosure glands, seals and drip loops before each wet season',
    'Verify surge protection status after significant lightning activity rather than waiting for a yield drop',
    'Never operate DC isolators under load — establish it as a site rule, because contact damage from one careless operation causes faults months later',
    'After any roof work, panel cleaning or vegetation cutting, confirm every string is back in service before leaving site',
  ],

  relatedSlugs: ['solar-system-underperforming', 'solar-inverter-dc-bus-fault', 'solar-charge-controller-not-charging'],

  faq: [
    {
      q: 'How do I know whether it is one string or the whole array?',
      a: 'Compare the strings against each other under the same sun. A single failed string produces a step down in output that corresponds closely to one string out of the total, and it appears suddenly. Array-wide losses from soiling or shading are proportional across all inputs and usually appear gradually or at particular times of day.',
    },
    {
      q: 'The string shows full voltage but produces nothing. What does that mean?',
      a: 'Voltage confirms the series loop is complete up to where you are measuring. No current means the circuit is not closed onward to the inverter — most often a blown fuse, an open isolator, or a failed connection between the combiner and the inverter input.',
    },
    {
      q: 'Can I just replace the blown fuse?',
      a: 'Not without establishing why it blew. A PV string fuse does not fail from age in normal service. It operates because of a surge, a reverse-current condition or a fault, and fitting a new one without finding the cause puts the same fault back on the system. It must also be the correct PV-rated type — a general-purpose fuse of the same current rating is not an equivalent part.',
    },
    {
      q: 'Is it safe to unplug a DC connector to test a string?',
      a: 'Only with the string isolated and no current flowing. DC arcs do not self-extinguish the way AC arcs do, so breaking a loaded DC connection sustains an arc that can cause serious burns and start a fire. Open the isolator first, every time.',
    },
    {
      q: 'Why do connectors fail when they look properly fitted?',
      a: 'The two most common reasons are connectors from different manufacturers mated together, and field-fitted connectors crimped without the matching tool. Both produce a joint that appears sound and latches correctly but makes poor contact, heats under load, and eventually opens. Neither is visible from the outside until damage has occurred.',
    },
    {
      q: 'Should I compare readings against the module datasheet?',
      a: 'The datasheet describes standard test conditions that your roof is not experiencing. Use it to sanity-check the order of magnitude, but diagnose by comparing strings with each other on the same array at the same moment. Sibling strings are the only reference that automatically accounts for the day, the temperature and the site.',
    },
  ],

  references: [
    'Array string design documentation and single-line diagram for the specific installation',
    'Inverter manufacturer installation manual — MPPT input limits, insulation test requirements and start-up sequence',
    'Module manufacturer datasheet — open-circuit voltage, short-circuit current and temperature coefficients for the modules fitted',
    'Connector manufacturer instructions and the matching crimp and release tooling',
    'IEC 62548 — photovoltaic array design requirements, including string protection and isolation',
    'IEC 62446-1 — grid-connected PV system commissioning, documentation and verification testing',
    'KS IEC standards as adopted by KEBS, and the Energy and Petroleum Regulatory Authority requirements applying to solar installations in Kenya',
  ],
};
