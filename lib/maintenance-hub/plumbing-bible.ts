/**
 * PLUMBING BIBLE — water services, pressure systems and drainage.
 *
 * WHY THIS FILE EXISTS
 * /maintenance-hub listed "Plumbing Bible" as one of eleven maintenance guides
 * and linked it to /maintenance-hub/plumbing. The other ten resolve. This one
 * returned 404 from the day it was listed: the card was written, the page never
 * was. Google crawled the dead URL on 2026-07-31 and it appears in the
 * "Excluded by noindex" coverage export. A visitor clicking it got nothing.
 *
 * WHAT IS IN HERE, AND WHAT IS DELIBERATELY NOT
 * The content is plumbing engineering: diagnosis sequences, pressure and flow
 * figures, pipe materials and their working limits. It is the same kind of
 * reference the borehole, electrical and HVAC bibles carry.
 *
 * NO KENYAN CODE CLAUSE IS CITED BY NUMBER. The hub card promised "Kenya
 * building codes", and a plausible-looking clause reference is worse than none
 * — a reader may act on it. Where a statutory requirement matters, this says so
 * and says to confirm against the current standard with the local water service
 * provider or a licensed plumber, which is the truthful instruction.
 *
 * NO CLAIM THAT EMERSONEIMS INSTALLS DOMESTIC PLUMBING. The owner listed the
 * services on 2026-09-21: generators, maintenance, spares, solar, parts, motor
 * rewinding, incinerator controllers, boreholes and pumps. Plumbing was not
 * among them. Boreholes, pumps and pressure systems are, and those are the
 * places this guide routes a reader with a real job. The rest is reference.
 *
 * NO COUNT IS ASSERTED. The card claimed "150+ problem solutions". There are
 * seven repair procedures here. The card has been corrected to match rather
 * than the page padded to meet it — check-code-counts exists on this site
 * because hardcoded totals drift from the data behind them.
 */

export interface PlumbingRepairStep {
  step: number;
  title: string;
  description: string;
  details: string;
  caution?: string;
}

export interface PlumbingRepairManual {
  id: string;
  title: string;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  tools: string[];
  safetyWarnings: string[];
  steps: PlumbingRepairStep[];
  verification: string[];
  callAProfessional?: string;
}

export const PLUMBING_REPAIR_MANUALS: PlumbingRepairManual[] = [
  {
    id: 'rm-plb-001',
    title: 'Low Water Pressure — Finding Where It Is Lost',
    category: 'Supply & Pressure',
    difficulty: 'Intermediate',
    timeRequired: '1-3 hours',
    tools: ['Pressure gauge with hose adaptor', 'Bucket and stopwatch', 'Adjustable spanner', 'Torch'],
    safetyWarnings: [
      'Isolate and drain before opening any joint — mains pressure will spray',
      'A pressure vessel stores energy even with the pump off; release it before work',
      'Do not exceed the working pressure marked on the pipe when testing',
    ],
    steps: [
      {
        step: 1,
        title: 'Measure, do not estimate',
        description: 'Fit a gauge at the nearest point to the supply',
        details:
          'Static pressure is read with everything closed. Running pressure is read with one tap fully open. A large gap between the two points at a restriction rather than a supply problem.',
      },
      {
        step: 2,
        title: 'Measure the actual flow',
        description: 'Time a bucket fill at a fully open tap',
        details:
          'A 20 litre bucket filling in 60 seconds is 20 l/min. Compare against what the fixture needs. Pressure and flow are different problems and are fixed differently.',
      },
      {
        step: 3,
        title: 'Establish whether it is the whole property or one outlet',
        description: 'Test at several fixtures',
        details:
          'One bad outlet is an aerator, a service valve or a flexible hose. Every outlet poor points upstream to the main, the storage, the pump or the meter.',
      },
      {
        step: 4,
        title: 'Check the simple restrictions first',
        description: 'Aerators, isolating valves, flexible connectors',
        details:
          'Unscrew and clean aerators. Confirm every isolating valve is fully open, including the one at the meter. Collapsed flexible hoses restrict flow with no visible fault.',
      },
      {
        step: 5,
        title: 'Check storage and the float valve',
        description: 'Where supply is intermittent and tanks are used',
        details:
          'A tank that is not filling gives falling pressure through the day. Check the float valve, the inlet strainer and whether the tank is high enough — head is roughly 0.1 bar per metre of height.',
        caution: 'A tank that overflows continuously is a failed float valve and wastes billed water',
      },
      {
        step: 6,
        title: 'Check the booster set',
        description: 'Pump, pressure switch and vessel',
        details:
          'A waterlogged pressure vessel makes the pump cycle rapidly and the pressure surge and drop. Check the air charge with the system drained. Confirm cut-in and cut-out against the switch settings.',
        caution: 'Rapid cycling destroys pump motors and pressure switches quickly',
      },
      {
        step: 7,
        title: 'Look for a hidden leak',
        description: 'If nothing upstream explains the loss',
        details:
          'Close every outlet, note the meter, wait an hour. Movement with everything closed is a leak. See the concealed leak procedure.',
      },
    ],
    verification: [
      'Static and running pressure measured and recorded',
      'Flow rate measured in litres per minute, not judged by eye',
      'Pressure restored at every fixture, not only the one complained about',
      'Pump cycling normally rather than hunting',
    ],
    callAProfessional:
      'Pressure that is low at the meter itself is the water service provider’s side, not yours. Report it rather than re-piping the property.',
  },
  {
    id: 'rm-plb-002',
    title: 'Concealed Leak — Locating Before Breaking Anything',
    category: 'Leaks',
    difficulty: 'Advanced',
    timeRequired: '2-6 hours',
    tools: ['Water meter access', 'Pressure gauge', 'Moisture meter', 'Isolating valves', 'Torch'],
    safetyWarnings: [
      'Water and electricity together: isolate circuits in any wet area before investigating',
      'Do not cut into a wall or slab before the leak is localised — the damage is often worse than the leak',
      'Long-standing leaks undermine foundations and soften plaster; assess structure before standing on it',
    ],
    steps: [
      {
        step: 1,
        title: 'Confirm a leak exists',
        description: 'Meter test with everything closed',
        details:
          'Close all outlets and appliances. Record the meter. Leave one hour. Any movement is loss. Photograph both readings — a recorded figure settles an argument with a landlord or an insurer.',
      },
      {
        step: 2,
        title: 'Split the system',
        description: 'Isolate section by section',
        details:
          'Close the isolating valve to one branch at a time and repeat the meter test. The branch where movement stops contains the leak. This is the step that saves the wall.',
      },
      {
        step: 3,
        title: 'Separate supply from drainage',
        description: 'They present the same way and are fixed differently',
        details:
          'A supply leak shows on the meter. A drainage leak does not — it only appears when something is discharged. Run one fixture at a time and watch.',
      },
      {
        step: 4,
        title: 'Read the evidence',
        description: 'Damp patterns, staining, sound',
        details:
          'Damp rising in a wall is usually below the leak, not at it. Warm patches on a floor point at a hot line. A hiss with everything closed is pressurised loss.',
      },
      {
        step: 5,
        title: 'Open the smallest possible access',
        description: 'Only once the branch is known',
        details:
          'Expose at the most likely joint first — changes of direction, fittings and penetrations fail far more often than a straight run of pipe.',
        caution: 'Never cut blind into a slab; buried services may run alongside',
      },
      {
        step: 6,
        title: 'Repair to the material, not with whatever is to hand',
        description: 'Matched fittings and correct jointing',
        details:
          'PPR is fusion welded, PVC is solvent cemented, PEX is crimped or push-fit, galvanised steel is threaded. Mixing methods or metals creates the next leak.',
        caution: 'Copper joined directly to galvanised steel corrodes galvanically; use a dielectric fitting',
      },
      {
        step: 7,
        title: 'Pressure test before closing up',
        description: 'Prove the repair while it is still visible',
        details:
          'Re-pressurise and hold. Repeat the one-hour meter test. Only then make good the wall or floor.',
      },
    ],
    verification: [
      'Meter static over one hour with all outlets closed',
      'Repair pressure-tested before being concealed',
      'Fitting matched to pipe material',
      'Cause recorded, not just the leak stopped',
    ],
  },
  {
    id: 'rm-plb-003',
    title: 'Water Hammer and Pipe Noise',
    category: 'Supply & Pressure',
    difficulty: 'Intermediate',
    timeRequired: '1-3 hours',
    tools: ['Pressure gauge', 'Pipe clips', 'Arrestor or air chamber', 'Spanners'],
    safetyWarnings: [
      'Repeated hammer fractures joints and fittings over time — it is a real fault, not a nuisance',
      'Drain and isolate before fitting an arrestor',
    ],
    steps: [
      {
        step: 1,
        title: 'Identify when it happens',
        description: 'On closing, on opening, or continuously',
        details:
          'A bang when a tap or solenoid closes is classic hammer. Noise while water runs is velocity or a loose pipe. Noise on opening is usually air.',
      },
      {
        step: 2,
        title: 'Check the pressure',
        description: 'High static pressure makes hammer worse',
        details:
          'Where mains pressure is high, a pressure reducing valve set to a sensible working figure removes the energy behind the shock.',
      },
      {
        step: 3,
        title: 'Find the fast-closing valve',
        description: 'Washing machines, dishwashers, solenoids',
        details:
          'Appliance solenoids close in milliseconds, which is what generates the shock. The arrestor belongs close to that valve, not at the far end of the run.',
      },
      {
        step: 4,
        title: 'Check pipe support',
        description: 'Unclipped pipe amplifies everything',
        details:
          'Clip pipework at sensible intervals and wherever it changes direction. A pipe drumming against a joist sounds like a plumbing fault and is a carpentry one.',
      },
      {
        step: 5,
        title: 'Fit or recharge an arrestor',
        description: 'Air chambers waterlog and stop working',
        details:
          'A traditional air chamber fills with water over time and must be drained to restore the cushion. A diaphragm arrestor does not, which is why it is preferred.',
      },
    ],
    verification: [
      'No audible shock when the identified appliance closes',
      'Working pressure within the range the fittings are rated for',
      'Pipework clipped and not in contact with structure',
    ],
  },
  {
    id: 'rm-plb-004',
    title: 'Blocked Drain — Clearing Without Damaging the Pipe',
    category: 'Drainage',
    difficulty: 'Intermediate',
    timeRequired: '1-4 hours',
    tools: ['Drain rods or auger', 'Plunger', 'Gloves and eye protection', 'Bucket', 'Torch'],
    safetyWarnings: [
      'Foul water carries pathogens; use gloves and eye protection and wash thoroughly',
      'Never mix drain chemicals — some combinations release chlorine gas',
      'Caustic drain cleaner splashes back when it meets a standing blockage',
      'A confined chamber can hold gas; never enter one without trained support',
    ],
    steps: [
      {
        step: 1,
        title: 'Establish how much of the system is affected',
        description: 'One fixture or all of them',
        details:
          'A single slow fixture is a trap or branch. Several at once, or the lowest fixture backing up first, means the main run or the soil stack.',
      },
      {
        step: 2,
        title: 'Check the vent before rodding',
        description: 'Slow drainage with gurgling is often a vent fault',
        details:
          'A blocked stack vent makes traps siphon and drainage gurgle. Clearing the blockage will not fix it and the symptom returns.',
      },
      {
        step: 3,
        title: 'Start at the nearest access',
        description: 'Trap, rodding eye or chamber',
        details:
          'Open the trap over a bucket first. Most kitchen blockages are within reach of a hand and a bucket, with no rods and no chemicals.',
      },
      {
        step: 4,
        title: 'Rod towards the blockage, not through it',
        description: 'Turn rods clockwise only',
        details:
          'Reversing direction unscrews the rods and leaves a section in the drain, which turns a blockage into an excavation.',
        caution: 'Never force rods into a pipe you cannot identify',
      },
      {
        step: 5,
        title: 'Flush and confirm',
        description: 'Full-bore flow, not a trickle',
        details:
          'Run a full basin or bath of water. A blockage that has been bored through rather than cleared will pass a trickle and fail on volume.',
      },
      {
        step: 6,
        title: 'Deal with the cause',
        description: 'Grease, roots, bedding failure or falls',
        details:
          'Repeat blockages at the same point are structural: a collapsed section, a root ingress or insufficient fall. Rodding it monthly is not a repair.',
      },
    ],
    verification: [
      'Full-bore flow at every affected fixture',
      'No gurgling from other traps when one fixture discharges',
      'Cause identified where the blockage is a repeat',
    ],
    callAProfessional:
      'Repeat blockages in the same run want a drain camera survey before anything is dug up. Guessing where to excavate is what makes the bill large.',
  },
  {
    id: 'rm-plb-005',
    title: 'Booster Pump and Pressure Vessel Faults',
    category: 'Pumps & Pressure Systems',
    difficulty: 'Advanced',
    timeRequired: '2-4 hours',
    tools: ['Pressure gauge', 'Tyre pressure gauge', 'Multimeter', 'Spanners', 'Clamp meter'],
    safetyWarnings: [
      'Isolate electrically and prove dead before opening any pump terminal box',
      'Drain the system before checking vessel air charge, or the reading is meaningless and the vessel is dangerous',
      'A pump running dry destroys its seal within minutes',
    ],
    steps: [
      {
        step: 1,
        title: 'Observe the cycling pattern',
        description: 'The pattern names the fault',
        details:
          'Rapid on-off cycling is almost always a waterlogged vessel. Running continuously without reaching cut-out is a leak, a worn impeller or a suction problem. Not starting at all is electrical or the switch.',
      },
      {
        step: 2,
        title: 'Check the vessel pre-charge',
        description: 'System drained, then read the schrader valve',
        details:
          'Pre-charge is set slightly below pump cut-in. Water coming out of the schrader valve means the diaphragm has failed and the vessel must be replaced, not recharged.',
        caution: 'Never check pre-charge with the system pressurised',
      },
      {
        step: 3,
        title: 'Verify the pressure switch settings',
        description: 'Cut-in and cut-out against the gauge',
        details:
          'Compare what the switch is set to against what the gauge actually does. A switch with burnt or pitted contacts reads correctly and acts late.',
      },
      {
        step: 4,
        title: 'Check the suction side',
        description: 'Most pump faults are upstream of the pump',
        details:
          'Check the foot valve, the strainer and for air ingress on the suction line. A pump cannot pull what it is not being given, and cavitation sounds like gravel in the casing.',
        caution: 'Cavitation destroys an impeller quickly; stop the pump and find the cause',
      },
      {
        step: 5,
        title: 'Measure the motor electrically',
        description: 'Running current against nameplate',
        details:
          'Current well above nameplate means a mechanical drag or a failing winding. Current well below, with the pump running, usually means it is not moving water.',
      },
      {
        step: 6,
        title: 'Check dry-run protection',
        description: 'Confirm it works before relying on it',
        details:
          'Where supply is intermittent, dry-run protection is the difference between an empty tank and a replacement pump. Test it rather than assuming it.',
      },
    ],
    verification: [
      'Vessel pre-charge correct with the system drained',
      'Pump reaching cut-out and stopping cleanly',
      'Running current within nameplate',
      'Dry-run protection proven by test',
    ],
    callAProfessional:
      'Borehole and pressure-system pump work is a service EmersonEIMS performs. See the borehole and pumps guides.',
  },
  {
    id: 'rm-plb-006',
    title: 'Storage Tank, Float Valve and Overflow',
    category: 'Storage',
    difficulty: 'Basic',
    timeRequired: '1-2 hours',
    tools: ['Adjustable spanner', 'Replacement float valve or washer', 'Ladder', 'Cleaning materials'],
    safetyWarnings: [
      'Working at height at a tank platform: secure the ladder and do not work alone',
      'A full tank is extremely heavy; never work under an unsupported or corroded stand',
      'Tanks serving drinking water must not be cleaned with any residual chemical',
    ],
    steps: [
      {
        step: 1,
        title: 'Watch a fill cycle',
        description: 'The failure shows itself',
        details:
          'Overflow running means the valve is not shutting. A tank that never fills means it is not opening, the inlet is restricted, or supply is arriving only briefly.',
      },
      {
        step: 2,
        title: 'Service or replace the float valve',
        description: 'Washer, seat and arm',
        details:
          'Most valves fail at the washer or seat. A float that has taken on water sits low and holds the valve open — it will feel heavy in the hand.',
      },
      {
        step: 3,
        title: 'Set the level properly',
        description: 'Below the overflow, not at it',
        details:
          'Set shut-off with usable clearance beneath the overflow so a small overshoot does not discharge. An overflow that runs is billed water leaving the property.',
      },
      {
        step: 4,
        title: 'Check the overflow itself',
        description: 'It is the last defence',
        details:
          'The overflow must be at least as large as the inlet and must discharge visibly. An overflow piped somewhere nobody looks hides the very fault it exists to reveal.',
      },
      {
        step: 5,
        title: 'Inspect and clean the tank',
        description: 'Sediment, light and cover',
        details:
          'Sediment reaches the outlet as the level drops. A tank passing light grows algae. The cover and insect screen are part of the water quality, not an accessory.',
      },
    ],
    verification: [
      'Valve shuts fully with clearance below the overflow',
      'Overflow clear and discharging where it can be seen',
      'Cover and screen intact',
      'Tank stand sound and carrying the load',
    ],
  },
  {
    id: 'rm-plb-007',
    title: 'Water Heater — No Hot Water or Insufficient Hot Water',
    category: 'Hot Water',
    difficulty: 'Intermediate',
    timeRequired: '1-3 hours',
    tools: ['Multimeter', 'Thermometer', 'Spanners', 'Element spanner', 'Hose for draining'],
    safetyWarnings: [
      'Isolate electrically and prove dead at the element before touching it',
      'Never energise an element that is not submerged — it fails immediately',
      'Scalding risk: stored water may be far hotter than the outlet suggests',
      'Never disable or plug a temperature and pressure relief valve. It is the only thing between a stored cylinder and a rupture.',
    ],
    steps: [
      {
        step: 1,
        title: 'Separate no hot water from not enough',
        description: 'Different faults entirely',
        details:
          'None at all is supply, element or thermostat. Some, then cold, is capacity, a failed lower element on a twin-element cylinder, or crossed flow mixing hot with cold.',
      },
      {
        step: 2,
        title: 'Confirm power is arriving',
        description: 'At the appliance, not at the board',
        details:
          'Check the isolator, the breaker and any thermal cut-out. Many cylinders have a manual reset cut-out that trips and is never looked at.',
      },
      {
        step: 3,
        title: 'Test the element and thermostat',
        description: 'Resistance and continuity, power off',
        details:
          'An open-circuit element reads infinite resistance. An element shorting to the body will trip an RCD every time and is a shock hazard.',
        caution: 'An element that trips the RCD must be replaced, never re-energised',
      },
      {
        step: 4,
        title: 'Check the relief valve',
        description: 'Discharging or seized',
        details:
          'A relief valve that weeps continuously is either failed or telling you the pressure is too high. A seized one is far more dangerous than a dripping one.',
        caution: 'If the relief valve discharges regularly, find out why before replacing it',
      },
      {
        step: 5,
        title: 'Look for scale and sediment',
        description: 'Where water is hard',
        details:
          'Scale insulates the element, so it runs hotter and fails earlier, and sediment reduces usable volume. Draining periodically extends element life.',
      },
      {
        step: 6,
        title: 'Verify the delivered temperature',
        description: 'Measure at the outlet',
        details:
          'Stored temperature and delivered temperature differ. Where a blending valve is fitted, check it before condemning the cylinder.',
      },
    ],
    verification: [
      'Element and thermostat proven electrically',
      'Relief valve free and discharging to a safe visible point',
      'Delivered temperature measured at the outlet',
      'No RCD tripping under load',
    ],
    callAProfessional:
      'Electrical work on a water heater is licensed work. If the element has been shorting to the body, have the earthing and the RCD checked as well as the element.',
  },
];

/**
 * Pipe materials and where each belongs. Working limits are the manufacturers'
 * general figures for the class of material; the printed rating on the pipe in
 * front of you governs, and that is what a specification must be written from.
 */
export const PLUMBING_MATERIALS = [
  {
    material: 'PPR (polypropylene random copolymer)',
    jointing: 'Heat fusion welding',
    typicalUse: 'Hot and cold supply within buildings',
    notes:
      'Fusion welded joints are as strong as the pipe. Needs correct tool temperature and timing; a cold joint looks identical to a good one and fails later.',
  },
  {
    material: 'uPVC',
    jointing: 'Solvent cement',
    typicalUse: 'Cold supply, drainage, waste',
    notes:
      'Not for hot water. Degrades under prolonged UV, so exposed runs need protection or a UV-stabilised grade.',
  },
  {
    material: 'PEX',
    jointing: 'Crimp, clamp or push-fit',
    typicalUse: 'Hot and cold supply, underfloor circuits',
    notes:
      'Flexible, tolerant of freezing, fewer joints on a run. Fittings must match the pipe standard — mixing systems is a common cause of failure.',
  },
  {
    material: 'Galvanised steel',
    jointing: 'Threaded',
    typicalUse: 'Older installations, exposed or mechanically exposed runs',
    notes:
      'Corrodes internally over time, narrowing the bore and reducing flow. Low pressure in an old building is often the pipe itself rather than the supply.',
  },
  {
    material: 'Copper',
    jointing: 'Soldered, brazed or compression',
    typicalUse: 'Hot and cold supply, plant rooms',
    notes:
      'Do not join directly to galvanised steel; the galvanic couple corrodes the steel. Use a dielectric union.',
  },
  {
    material: 'HDPE',
    jointing: 'Butt fusion or electrofusion',
    typicalUse: 'Buried mains, borehole rising mains',
    notes:
      'Long lengths with few joints, which is why it suits buried and borehole work. Fusion joints require trained operators and the right equipment.',
  },
];

export const PLUMBING_MAINTENANCE_SCHEDULE = {
  monthly: [
    'Check for visible leaks at exposed pipework, valves and under sinks',
    'Test the water heater relief valve is free and discharging to a safe point',
    'Confirm the storage tank shuts off with clearance below the overflow',
    'Clear tap aerators and shower heads of scale and grit',
  ],
  quarterly: [
    'Meter test with all outlets closed to detect a silent leak early',
    'Check booster pump cycling and pressure vessel behaviour',
    'Inspect and clear gully gratings and rodding eyes',
    'Check drain falls where blockages have recurred',
  ],
  annually: [
    'Drain sediment from the water heater cylinder',
    'Check pressure vessel pre-charge with the system drained',
    'Clean and inspect the storage tank, cover and insect screen',
    'Inspect the tank stand and supports for corrosion and load',
    'Check and record static and running pressure to compare year on year',
  ],
};

/**
 * Regulatory note. Deliberately general: see the header of this file for why no
 * clause number is cited.
 */
export const PLUMBING_COMPLIANCE_NOTE =
  'Water supply, backflow prevention and drainage connections are regulated work in Kenya. Requirements differ by county and by water service provider, and connections to a public main are the provider’s to approve. Confirm the current requirement with your water service provider and use a licensed plumber for any work on the incoming main, on backflow prevention or on a new drainage connection.';

export const PLUMBING_BIBLE_DATA = {
  /*
   * Counted from the array rather than typed. The hub card previously asserted
   * "150+ problem solutions" for a page that did not exist; a number written by
   * hand beside a list is the exact drift check-code-counts guards against.
   */
  get repairProcedures() {
    return PLUMBING_REPAIR_MANUALS.length;
  },
  get materials() {
    return PLUMBING_MATERIALS.length;
  },
  categories: [...new Set(PLUMBING_REPAIR_MANUALS.map((m) => m.category))],
};
