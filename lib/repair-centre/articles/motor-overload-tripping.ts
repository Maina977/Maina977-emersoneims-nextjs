import type { RepairArticle } from '../types';

export const motorOverloadTripping: RepairArticle = {
  slug: 'motor-overload-tripping',
  hub: 'motors',
  header: {
    title: 'Motor Overload Keeps Tripping — Diagnosis',
    equipmentCategory: 'Three-phase motors — protection, load and starting',
    appliesTo: 'Three-phase motors on direct-on-line, star-delta and soft-start control, with thermal or electronic overload protection',
    difficulty: 'intermediate',
    diagnosisComplexity: 'Low to moderate. The protection is usually right, and the work is finding what it is protecting against.',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-29',
    lastReviewed: '2026-07-29',
    electricalSystem: 'Three-phase 415 V 50 Hz nominal; motor rating per nameplate',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'Assume the overload is telling the truth until you have measured otherwise, because the common failure here is defeating a protection that was doing its job. Measure running current on all three phases and compare against the nameplate. Current above nameplate means a real overload, and the cause is the driven machine, the supply or the motor itself. Balanced current within nameplate while the relay still trips points at the relay setting, a faulty relay, or a starting problem rather than a running one. Imbalanced current with balanced supply voltage indicts the motor. The timing tells you as much as the magnitude: tripping during starting usually means the start is taking too long for the protection, from a heavy load, low voltage or a star-delta transition set wrong, whereas tripping after a period of normal running points at a load that increases as the machine warms, a cooling problem, or supply imbalance. Whatever you find, do not raise the setting to stop the nuisance. An overload set above the motor rating protects nothing, and the winding damage that follows is silent until the motor fails.',

  symptoms: {
    display: [
      'Overload relay tripped, requiring manual reset',
      'Drive or soft-start reporting motor overload or thermal fault',
      'Motor protection relay indicating thermal image or overload',
      'Trip occurring at a repeatable point in the process cycle',
    ],
    indicators: [
      'Overload relay flag in the tripped position',
      'Setting dial visibly above the motor nameplate current',
      'Phase-failure relay operated alongside the overload',
    ],
    sounds: [
      'Motor labouring or slowing under load before the trip',
      'Loud hum with slow rotation, which suggests single-phasing or a stalled start',
      'Bearing noise from the motor or driven machine, indicating rising friction',
      'Driven machine sounding different from normal, which often identifies the cause immediately',
    ],
    smells: [
      'Burnt varnish smell from the motor, which means the winding has already been overheated',
      'Hot bearing or grease smell',
      'Burnt smell at the starter, indicating contact or terminal problems',
    ],
    behaviour: [
      'Trips during starting rather than running, which is a different fault',
      'Trips after a period of normal running, suggesting heat or a load that rises when warm',
      'Trips more readily on hot afternoons',
      'Started tripping after the driven machine was serviced or modified',
      'Trips at the same point in a process cycle each time',
      'Resets and runs normally for a while, which encourages resetting rather than diagnosing',
      'Trips only in one direction of rotation on reversible drives',
    ],
    visible: [
      'Overload setting compared against the motor nameplate full-load current',
      'Motor cooling fan, cowl and fins for obstruction',
      'Driven machine for blockage, wear or a changed duty',
      'Belt tension and coupling alignment',
      'Starter contacts for pitting and heat discolouration',
      'Terminal box connections and the star or delta link arrangement',
      'Cable size against the run length',
    ],
  },

  whatItMeans: {
    plain:
      'The overload is a protection device that disconnects the motor when it draws more current than it should for long enough to overheat the windings. When it keeps tripping, the usual reason is that something really is drawing too much current. Turning the setting up makes the tripping stop and removes the protection, which is how motors get burnt out.',
    technical:
      'A thermal overload models the heating of the winding rather than measuring it directly, so it responds to both magnitude and duration of current. That inverse characteristic is why a motor can start against a high inrush without tripping while a modest sustained overload will operate the relay after a period. Starting behaviour therefore matters: if the start is prolonged by a heavy load, low supply voltage or an incorrect star-delta transition, the accumulated heating during acceleration can trip the relay even though the running current would be acceptable. Under running conditions, current above nameplate indicates real mechanical load, a supply problem or a motor fault. Supply voltage imbalance is disproportionately damaging because a small voltage imbalance produces a much larger current imbalance, so a supply that looks acceptable on a voltmeter can drive one winding well beyond its rating. Single-phasing is the extreme case, where the remaining phases carry the load at greatly increased current. Ambient temperature and cooling matter because the relay protects a thermal model that assumes the motor can shed heat; an obstructed cowl, a failed fan or an enclosure above the design ambient means the winding runs hotter than the current alone suggests, and the correct response is restoring cooling rather than desensitising the protection.',
  },

  causes: {
    mostLikely: [
      'Driven machine has become harder to turn — bearings, blockage, wear or a changed duty',
      'Overload set incorrectly for the nameplate, in either direction',
      'Supply voltage imbalance or sustained under-voltage raising current',
      'Cooling obstructed — blocked cowl, clogged fins or a failed fan',
    ],
    possible: [
      'Starting time too long for the protection, from load inertia or low voltage',
      'Star-delta transition timing set wrongly',
      'Motor bearings failing, raising friction and current',
      'Ambient temperature above the design assumption',
      'Undersized or excessively long supply cable causing voltage drop',
    ],
    lessCommon: [
      'Single-phasing from a blown fuse or failed contactor pole',
      'Motor winding fault drawing imbalanced current',
      'Faulty or aged overload relay tripping below its setting',
      'Incorrect star or delta connection in the terminal box',
      'Motor undersized for the duty from the outset',
    ],
    modelSpecific: [
      'Full-load current, service factor, duty rating and permitted starts per hour come from the motor nameplate and manufacturer data',
      'Overload relay classes differ in how long they permit a start; a class suited to a fan is not necessarily suited to a high-inertia load',
      'Star-delta transition timing is application-specific',
      'Electronic protection relays offer settings a thermal relay does not, and they must be configured to the motor rather than left at defaults',
    ],
    environmental: [
      'High ambient temperature reducing thermal margin',
      'Dust and fibre clogging cooling fins, a leading cause in industrial and agricultural settings',
      'Enclosed spaces without the specified ventilation',
      'Altitude reducing cooling air density',
    ],
    installation: [
      'Overload not set to the nameplate at commissioning',
      'Cable sizing that ignores voltage drop over the run',
      'Motor sized without margin for the real duty and starting frequency',
      'Protection class unsuited to the load inertia',
      'No phase-failure protection on a critical drive',
    ],
    maintenance: [
      'Running current never measured against nameplate at service visits',
      'Cooling fins never cleaned',
      'Bearings never greased, or over-greased',
      'Driven machine condition never assessed as part of motor troubleshooting',
      'Relay habitually reset without investigation',
    ],
    componentLevel: [
      'Overload relay faulty or aged',
      'Contactor pole failed, causing single-phasing',
      'Motor bearings worn',
      'Motor winding fault',
      'Terminal or cable connection high resistance',
    ],
  },

  safety: {
    isolation: [
      'Isolate at the starter, lock off and prove dead before working on the motor or driven machine',
      'Confirm the driven machine cannot move — some loads can back-drive the motor',
      'Where a drive is fitted, its DC bus capacitors remain charged after isolation',
      'Confirm no remote or process control can start the motor',
    ],
    lockoutTagout: [
      'Lock and tag the starter isolator',
      'Tag any process control system that can command a start',
      'Physically restrain the driven machine where it can rotate under process conditions',
      'Keep the only key with the person doing the work',
    ],
    ppe: [
      'Arc-rated protection appropriate to the prospective fault energy at the starter',
      'Insulated tools rated for the system voltage',
      'Eye protection',
      'Hearing protection near running machinery',
    ],
    storedEnergy: [
      'Drive DC bus capacitors hold a lethal charge after isolation',
      'Power-factor correction capacitors retain charge',
      'Rotating machinery coasts down and may be back-driven by its load',
      'A recently run motor is hot enough to cause contact burns',
    ],
    specificHazards: [
      'DO NOT RAISE THE OVERLOAD SETTING TO STOP NUISANCE TRIPPING. A relay set above the motor rating protects nothing, and the winding damage that follows is invisible until the motor fails. This is the single most damaging shortcut available on this fault.',
      'Never bypass or link out an overload to keep a process running. It is the only thing standing between a mechanical problem and a burnt motor, and often a fire.',
      'Measuring running current means working at a live starter — treat it as live working with the corresponding protection.',
      'Never reach into a coupling, belt or fan area without the drive locked off and the machine restrained',
      'Repeated resetting of a tripping motor heats the winding cumulatively; each reset does more damage than the last',
    ],
    stopAndCallProfessional: [
      'The motor smells of burnt varnish',
      'Current is imbalanced with balanced supply voltage, which indicates a winding fault',
      'The proposed action is to raise the setting or bypass the protection',
      'The driven machine cannot be safely isolated or restrained',
      'The motor is in a hazardous area',
    ],
  },

  tools: [
    { tool: 'True-RMS clamp meter', why: 'Running current on all three phases against nameplate — the measurement the whole diagnosis rests on' },
    { tool: 'True-RMS multimeter', why: 'Supply voltage on all three phases under load, and balance between them' },
    { tool: 'Clamp meter with inrush or recording capability', why: 'Starting current and how long the start actually takes, which a spot reading cannot show' },
    { tool: 'Infrared thermometer or thermal camera', why: 'Motor frame, bearing housings and starter terminations' },
    { tool: 'Vibration meter', why: 'Bearing condition and alignment on the motor and driven machine' },
    { tool: 'Insulation resistance tester', why: 'Where a winding fault is suspected from current imbalance' },
    { tool: 'Motor nameplate and overload relay data', why: 'The setting must match the nameplate, and the relay class must suit the load' },
  ],

  decisionTree: [
    { question: 'Does the motor smell of burnt varnish?', yes: 'The winding has already been overheated. Stop and assess the motor.', no: 'Continue' },
    { question: 'Is the overload set to the motor nameplate current?', yes: 'Continue', no: 'Correct it. Set above nameplate it protects nothing; set below it causes nuisance trips.' },
    { question: 'Does it trip during STARTING or during RUNNING?', yes: 'Starting points at start duration, load inertia, voltage or transition timing', no: 'Running points at load, supply, cooling or the motor' },
    { question: 'Is running current above nameplate?', yes: 'A real overload — investigate the driven machine, supply and motor', no: 'Continue' },
    { question: 'Are the three phase currents balanced?', yes: 'Continue', no: 'Imbalanced current with balanced voltage indicts the motor winding' },
    { question: 'Are all three supply voltages present and balanced under load?', yes: 'Continue', no: 'Supply imbalance or phase loss — a small voltage imbalance causes a much larger current imbalance' },
    { question: 'Does the shaft turn freely with the drive isolated and the machine restrained?', yes: 'Continue to cooling and relay', no: 'The driven machine or motor bearings are the load — this is mechanical' },
    { question: 'Is cooling clear and ambient within the design?', yes: 'Suspect the relay itself', no: 'Restore cooling — the winding runs hotter than the current alone suggests' },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Check the overload setting against the nameplate',
      inspect: 'Relay setting compared with motor full-load current',
      where: 'At the starter and the motor nameplate',
      instrument: 'Visual record',
      expected: 'Setting matching the nameplate for the connection in use',
      ifAbnormal: 'A setting above nameplate provides no protection at all and is a common finding where nuisance trips have been managed rather than diagnosed. A setting below nameplate causes the trips.',
      next: 'Step 2',
      warning: 'If the setting has been raised previously, assume the winding may already have been overheated.',
    },
    {
      step: 2,
      title: 'Establish whether it trips starting or running',
      inspect: 'When in the cycle the trip occurs, and whether it is repeatable',
      where: 'Observed over several attempts',
      instrument: 'Observation and the process history',
      expected: 'A clear pattern',
      ifAbnormal: 'Starting trips point at start duration, inertia, supply voltage or star-delta transition timing. Running trips point at load, supply, cooling or the motor. These are different investigations.',
      next: 'Step 3',
    },
    {
      step: 3,
      title: 'Measure running current on all three phases',
      inspect: 'Current per phase against nameplate full-load current',
      where: 'On each supply conductor at the starter',
      instrument: 'True-RMS clamp meter',
      expected: 'Balanced currents at or below nameplate for the actual load',
      ifAbnormal: 'Above nameplate is a real overload. Imbalanced currents with balanced supply voltage indict the motor rather than the supply. This measurement directs everything that follows.',
      next: 'Step 4',
      warning: 'This is live working at the starter. Use appropriate protection.',
    },
    {
      step: 4,
      title: 'Measure supply voltage on all three phases under load',
      inspect: 'Voltage per phase and balance between them, while running',
      where: 'At the starter terminals',
      instrument: 'True-RMS multimeter',
      expected: 'Balanced voltages at nominal',
      ifAbnormal: 'A small voltage imbalance produces a disproportionately large current imbalance, so a supply that looks acceptable can still drive one winding beyond its rating. Sustained under-voltage raises current for the same mechanical load.',
      next: 'Step 5',
    },
    {
      step: 5,
      title: 'Assess the driven machine',
      inspect: 'Whether the machine turns freely, and whether its duty has changed',
      where: 'At the driven machine, drive isolated and restrained',
      instrument: 'By hand where practical, plus vibration measurement',
      expected: 'Free rotation, duty unchanged',
      ifAbnormal: 'A machine that has become stiff through bearing wear, blockage or a process change raises the torque demand, and the motor draws the current the overload is correctly reporting. Where trips began after the machine was serviced, that is the strongest clue available.',
      next: 'Step 6',
      warning: 'Lock off and restrain the machine before turning it by hand.',
    },
    {
      step: 6,
      title: 'Check cooling and ambient',
      inspect: 'Cooling fan operation, cowl and fin obstruction, enclosure ventilation and ambient temperature',
      where: 'At the motor and its surroundings',
      instrument: 'Thermal camera, thermometer',
      expected: 'Clear cooling path, ambient within the motor design',
      ifAbnormal: 'The relay protects a thermal model that assumes the motor can shed heat. Obstructed cooling means the winding runs hotter than the current suggests, and the fix is restoring cooling rather than desensitising the relay.',
      next: 'Step 7',
    },
    {
      step: 7,
      title: 'Measure starting current and duration where starting trips occur',
      inspect: 'Inrush magnitude and how long the motor takes to reach speed',
      where: 'At the starter, during a start',
      instrument: 'Clamp meter with inrush or recording capability',
      expected: 'Start completing within the time the protection class permits',
      ifAbnormal: 'A prolonged start accumulates heating in the thermal model even where running current would be acceptable. Causes are load inertia, low supply voltage, or star-delta transition timing set wrongly.',
      next: 'Step 8',
      verify: 'The overload relay class and permitted start duration, and the motor permitted starts per hour.',
    },
    {
      step: 8,
      title: 'Only now suspect the relay itself',
      inspect: 'Whether the relay trips with current proven within rating and cooling proven clear',
      where: 'At the starter',
      instrument: 'All prior measurements',
      expected: 'Everything else eliminated first',
      ifAbnormal: 'An aged or faulty relay can trip below its setting. This is the least common cause and should be concluded last, not assumed first.',
      next: 'Replace the relay, or address the identified load, supply or cooling cause',
    },
  ],

  repair: [
    {
      level: 'configuration',
      title: 'Protection settings',
      steps: [
        'Set the overload to the motor nameplate current for the connection in use',
        'Select a relay class appropriate to the load inertia and start duration',
        'Correct star-delta transition timing where prolonged starts are the cause',
        'Fit phase-failure protection where none exists on a critical drive',
      ],
      note: 'Correcting the setting means setting it right, not setting it higher.',
    },
    {
      level: 'mechanical',
      title: 'The driven machine and motor mechanics',
      steps: [
        'Free or repair a driven machine that has become stiff',
        'Replace worn motor or machine bearings',
        'Correct alignment and belt tension, which raise load when wrong',
        'Restore the duty where a process change has increased the demand',
      ],
      note: 'Where the load has genuinely increased, the answer is the load or a correctly sized motor, not a higher setting.',
    },
    {
      level: 'cleaning-and-connections',
      title: 'Cooling and terminations',
      steps: [
        'Clean cooling fins and cowl, and replace a failed or reversed fan',
        'Restore enclosure ventilation',
        'Re-torque starter and motor terminations, and verify the star or delta links',
        'Replace pitted contactor contacts',
      ],
    },
    {
      level: 'component-replacement',
      title: 'Supply and protection components',
      steps: [
        'Replace a failed contactor pole causing single-phasing',
        'Replace an aged or faulty overload relay',
        'Correct undersized supply cabling causing voltage drop',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Motor faults',
      steps: [
        'Refer winding faults indicated by current imbalance for specialist assessment',
        'Provide the measured phase currents, supply voltages and the overload setting',
      ],
    },
  ],

  validation: [
    'Confirm running current on all three phases is within nameplate and balanced',
    'Confirm supply voltage is balanced under load',
    'Confirm the overload is set to the nameplate and record the setting',
    'Confirm the start completes within the protection class duration',
    'Thermal-check the motor frame and starter terminations after a sustained run',
    'Run through a full process cycle, since trips are often tied to a particular point in it',
    'Record nameplate, setting, phase currents and voltages, and the cause identified',
  ],

  whenNotToRepair: [
    'Where the load has genuinely outgrown the motor — that is a sizing decision, not a repair',
    'Motors whose windings have already been overheated by repeated resetting or a raised setting',
    'Installations where the only way to stop the tripping is to defeat the protection',
    'Driven machines requiring overhaul rather than the motor',
    'Where the enclosure or ambient cannot be brought within the motor design',
  ],

  prevention: [
    'Set the overload to nameplate at commissioning and record it, so a later change is detectable',
    'Measure running current against nameplate at every service visit — a rising trend precedes the trips',
    'Clean cooling fins and cowls on a schedule suited to the environment',
    'Investigate the driven machine as part of any motor complaint, not only the motor',
    'Fit phase-failure protection on drives that matter',
    'Check alignment and belt tension after any work on the coupling',
    'Treat repeated resetting as a fault in itself — each reset heats the winding further and hides the cause',
  ],

  relatedSlugs: ['three-phase-motor-failure-diagnosis'],

  faq: [
    {
      q: 'Can we just turn the overload up so it stops tripping?',
      a: 'No, and this is the most damaging shortcut available on this fault. An overload set above the motor nameplate protects nothing — the relay will no longer operate before the winding overheats, and the damage is invisible until the motor fails. If it is tripping, something is drawing current it should not be. Find that instead.',
    },
    {
      q: 'It only trips when starting, never when running. What does that mean?',
      a: 'That the running load is probably fine and the START is taking too long for the protection. A thermal overload responds to current and duration together, so a prolonged acceleration accumulates enough heating to trip even when running current is acceptable. Look at load inertia, supply voltage during the start, star-delta transition timing, and whether the relay class suits the load.',
    },
    {
      q: 'Voltage looks fine on all three phases. Can supply still be the cause?',
      a: 'Yes, and this catches people out. A small voltage imbalance produces a disproportionately larger current imbalance, so a supply that looks acceptable on a voltmeter can still push one winding well past its rating. Measure the CURRENTS on all three phases as well — if they are imbalanced while voltages are balanced, the motor is implicated instead.',
    },
    {
      q: 'It started tripping after the pump was serviced. Coincidence?',
      a: 'Almost certainly not, and that history is the strongest clue you have. If the driven machine came back stiffer — bearings, seals over-tightened, an impeller clearance changed, something reassembled wrongly — the torque demand rises and the motor draws more current. The overload is reporting the load accurately. Check the machine before the motor.',
    },
  ],

  references: [
    'IEC 60034-1 — rotating electrical machines: rating and performance',
    'IEC 60947-4-1 — low-voltage switchgear and controlgear: contactors and motor-starters, including overload relay classes',
    'IEC 60204-1 — safety of machinery: electrical equipment of machines',
    'The motor nameplate and manufacturer data, and the overload relay documentation, which are the only valid sources for full-load current, service factor, permitted starts per hour and relay class referred to throughout',
  ],
};
