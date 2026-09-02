import type { RepairArticle } from '../types';

export const driveMotorCableScreeningEarthLeakage: RepairArticle = {
  slug: 'drive-motor-cable-screening-earth-leakage',
  hub: 'industrial-electronics',
  header: {
    title: 'Motor Cable, Screening and Earth Leakage — Nuisance Trips That Are Not Faults',
    equipmentCategory: 'Variable frequency drive installation',
    appliesTo:
      'Variable frequency drive installations of any size, screened and unscreened motor cable, with residual current or earth-leakage protection upstream',
    difficulty: 'advanced',
    diagnosisComplexity:
      'Frequently misdiagnosed — the leakage is usually real, normal for a drive, and caused by the installation rather than by an insulation fault',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'Drive supply 415 V three-phase 50 Hz nominal; PWM output at the drive switching frequency',
    safetyClass: 'live-electrical',
  },

  directAnswer:
    'A drive installation that trips its upstream earth-leakage protection is usually not suffering an insulation fault. A drive output is a fast-switching waveform, and every motor cable has capacitance between its conductors and earth, so current flows to earth continuously as a normal consequence of physics. The longer the cable, the higher the switching frequency, and the poorer the screen termination, the larger that current. Diagnose it by separating capacitive leakage from a genuine insulation fault: measure insulation resistance with the drive disconnected, and if the insulation is sound, the leakage is capacitive and the answer lies in the installation. The three things that matter most are screen termination at both ends by a full 360-degree connection rather than a pigtail, cable length within the manufacturer limit for the switching frequency in use, and protection selected as a type suitable for the DC and high-frequency components a drive produces. Never solve this by removing the earth-leakage protection or by disconnecting the screen.',

  symptoms: {
    display: [
      'Drive reporting earth fault or ground fault at start, or during acceleration',
      'Upstream RCD or earth-leakage relay tripping when the drive starts',
      'Drive reporting output phase-to-earth fault with the motor known to be sound',
      'Trips occurring only above a certain speed or load',
    ],
    indicators: [
      'RCD tripping repeatably at drive start and never during steady running',
      'Trips increasing after a cable was extended or a motor relocated',
      'Trips beginning after the switching frequency was raised',
    ],
    sounds: [
      'Audible discharge or crackling at a cable gland or termination, which indicates a real problem needing immediate isolation',
      'Bearing noise developing on the motor, which can accompany poor screening through shaft currents',
    ],
    smells: ['Ozone or hot insulation smell at a termination, indicating discharge activity'],
    behaviour: [
      'Trips at start-up but runs indefinitely once started',
      'Trips worse in wet weather, which points at genuine insulation deterioration rather than capacitance',
      'Problem appeared after an installation change — longer cable, new motor, additional drive on the same protection',
      'Multiple drives on one protective device trip it although each is fine alone',
      'Motor bearings failing prematurely with fluted races, which is the same root cause showing elsewhere',
    ],
    visible: [
      'Screen terminated as a pigtail — a twisted tail of braid to an earth terminal — rather than a 360-degree gland',
      'Screen cut back and left unterminated at one end, or at both',
      'Unscreened cable used on a drive output',
      'Motor cable run in the same trunking as control and signal cables',
      'EMC gland absent, or a standard gland used where an EMC gland is required',
      'Earth conductor undersized for the installation',
      'Fluting visible on a removed motor bearing race',
    ],
  },

  whatItMeans: {
    plain:
      'A drive does not send smooth power to the motor; it sends very rapid pulses. Any cable acts a little like a capacitor between its wires and earth, and rapid pulses push a small current through that capacitance to earth all the time. This is normal and unavoidable. Earth-leakage protection is designed to detect current going to earth, so it sees this and can trip even though nothing is broken. The fix is to keep that current small and contained — by terminating the cable screen properly, keeping the cable short enough, and choosing protection designed for drives — not by removing the protection.',
    technical:
      'A PWM drive output has fast voltage transitions, and the capacitance between motor cable conductors and the screen or earth presents a low impedance to those transitions. The resulting current returns to the drive through whatever path exists. Where the screen is properly terminated at both ends with a 360-degree connection, that return path is short, contained within the cable, and largely invisible to upstream protection. Where the screen is pigtailed, unterminated, or absent, the current returns through the installation earth and through structural paths, which is what upstream residual current protection detects — and which also drives shaft currents that erode motor bearings into a characteristic fluted pattern. The current scales with cable capacitance, and therefore with cable length, and with the rate of voltage change, and therefore with switching frequency. Crucially, this leakage contains DC and high-frequency components, which is why protective devices must be of a type rated to detect and withstand them; a device intended only for sinusoidal residual current may fail to operate correctly on a drive circuit, which is a safety issue as well as a nuisance one.',
  },

  causes: {
    mostLikely: [
      'Screen terminated as a pigtail instead of a 360-degree gland connection — the single most common installation defect on drive circuits',
      'Motor cable longer than the drive manufacturer permits for the switching frequency in use',
      'Unscreened cable used on a drive output where screened cable is required',
      'Protective device of a type not suitable for the DC and high-frequency leakage a drive produces',
    ],
    possible: [
      'Several drives sharing one upstream protective device, so their individual leakage currents sum',
      'Switching frequency raised, increasing leakage proportionally',
      'Screen terminated at one end only, leaving no contained return path',
      'Genuine insulation deterioration in the motor or cable, which must be excluded rather than assumed absent',
      'Output filter or dV/dt filter specified in the design but never fitted',
    ],
    lessCommon: [
      'Moisture in a motor terminal box or cable gland producing real leakage that varies with weather',
      'Damaged cable where the screen contacts a conductor',
      'Motor winding insulation degraded by drive-related voltage stress on a motor not rated for inverter duty',
      'Earthing arrangement of the installation inadequate, so leakage returns through unintended paths',
      'Protective device drifted or damaged, tripping below its rating',
    ],
    modelSpecific: [
      'Maximum permitted motor cable length is specific to the drive model and varies with switching frequency and with whether screened cable and output filters are used — take it from the manufacturer data',
      'Some drives publish typical leakage current figures for given cable lengths, which is the correct basis for selecting protection',
      'Drive EMC category and the installation practice required to achieve it are stated by the manufacturer',
      'Whether an output filter is required or merely recommended depends on the drive, the cable length and the motor',
    ],
    environmental: [
      'Humidity and wet-season condensation producing genuine leakage that adds to the capacitive component',
      'Dust and contamination on terminations creating tracking paths',
      'Long cable runs common on borehole, irrigation and quarry installations, where the motor is far from the panel',
      'Corrosive or coastal atmospheres degrading screen terminations over time',
    ],
    installation: [
      'EMC glands not specified or not fitted',
      'Screen cut back at the gland and pigtailed to a terminal — mechanically convenient, electrically ineffective',
      'Motor cable routed alongside control and signal cables, coupling noise into them as well as raising leakage concerns',
      'Cable length increased during installation without checking the drive limit',
      'Protective device selected on current rating alone without regard to type',
      'Output filter specified in design but omitted on site to save cost',
      'Earthing and bonding of the panel, motor and structure not carried out to a proper star or mesh arrangement',
    ],
    maintenance: [
      'Terminations disturbed during maintenance and reinstated as pigtails',
      'Motor replaced with one not rated for inverter duty',
      'Cable extended during a relocation without reassessing length limits',
      'Switching frequency changed without considering leakage or cable length',
      'Trips "solved" by replacing the protective device with a higher rating, or by removing it — both are unacceptable',
    ],
    componentLevel: [
      'Screen termination degradation at gland or terminal',
      'Motor winding insulation deterioration',
      'Cable insulation damage',
      'Protective device failure or drift',
      'Absent or failed output filter',
    ],
  },

  safety: {
    isolation: [
      'Isolate the drive supply, lock it and prove dead before any work on cabling or terminations.',
      'Observe the DC-link discharge time in full and prove the bus dead at the manufacturer test points.',
      'Disconnect the drive completely before any insulation resistance test — the test voltage destroys drive output stages.',
      'Confirm the motor cannot be turned by the driven load, which would generate voltage back into the circuit.',
    ],
    lockoutTagout: [
      'Lock and tag the drive supply isolator.',
      'Disable and lock any automatic or remote start.',
      'Where several drives share a supply, ensure the isolation covers the circuit you are working on and tag the others as still live.',
    ],
    ppe: [
      'Insulated gloves and tools rated above the supply and DC bus voltage',
      'Eye protection, and arc-rated clothing where a termination shows discharge damage',
      'Appropriate protection during insulation testing, which applies a high voltage to the cable',
    ],
    storedEnergy: [
      'DC-link capacitors hold a lethal charge after isolation; the manufacturer discharge time is mandatory.',
      'A long motor cable holds significant capacitance and retains charge after an insulation test — discharge through the instrument and confirm before handling.',
      'Motor cable capacitance can also retain charge after the drive is switched off.',
    ],
    specificHazards: [
      'Never remove or bypass earth-leakage protection to stop nuisance tripping. It is a life-safety device, and drive leakage does not make it unnecessary — it makes correct device selection essential.',
      'Never disconnect a cable screen to reduce leakage. The screen is containing the return current; removing it pushes that current through the installation and into motor bearings.',
      'A protective device of the wrong type may fail to operate on a real fault while still nuisance-tripping on leakage — the dangerous combination.',
      'Discharge activity at a termination, indicated by crackling or ozone, is a real fault requiring immediate isolation.',
    ],
    stopAndCallProfessional: [
      'Insulation resistance is genuinely low — that is an insulation fault requiring repair, not a leakage discussion.',
      'The installation requires protective device reselection or an output filter — that is a design decision.',
      'You cannot establish the drive maximum cable length or the required protection type from the manufacturer data.',
      'The installation serves life-safety or process-safety equipment.',
      'Anyone has previously removed or bypassed the earth-leakage protection — that must be corrected before anything is energised.',
    ],
  },

  tools: [
    { tool: 'Insulation resistance tester', why: 'The measurement that separates a genuine insulation fault from normal capacitive leakage — the single most important test here' },
    { tool: 'True-RMS clamp meter with a leakage current range', why: 'Measures actual earth leakage; a standard clamp meter lacks the resolution and will not read it usefully' },
    { tool: 'Earth-leakage tester or RCD tester', why: 'Confirms the protective device operates at its rated current and within its rated time' },
    { tool: 'Drive manufacturer manual', why: 'Maximum cable length, typical leakage figures and required protection type are model-specific' },
    { tool: 'EMC glands of the correct size for the cable', why: 'A 360-degree termination cannot be made without the right gland; this is the commonest missing item' },
    { tool: 'Multimeter and proving unit', why: 'Proving dead before work' },
    { tool: 'Thermal camera', why: 'Finds terminations running hot from poor contact, which often accompany poor screening' },
  ],

  decisionTree: [
    {
      question: 'With the drive fully disconnected, is motor and cable insulation resistance high and stable?',
      yes: 'There is no insulation fault — the leakage is capacitive and the answer is in the installation',
      no: 'This is a genuine insulation fault. Repair it before considering anything else.',
    },
    {
      question: 'Is the cable screen terminated with a 360-degree connection at BOTH ends?',
      yes: 'Screening is correct — look at cable length and device type',
      no: 'This is almost certainly the cause. A pigtail is not a screen termination.',
    },
    {
      question: 'Is the motor cable within the drive manufacturer maximum length for the switching frequency in use?',
      yes: 'Length is acceptable',
      no: 'Reduce switching frequency, fit an output filter, or shorten the run',
    },
    {
      question: 'Is the protective device of a type rated for the DC and high-frequency components a drive produces?',
      yes: 'Device selection is correct',
      no: 'Replace it with a suitable type. Never remove it, and never simply raise its rating.',
    },
    {
      question: 'Do several drives share one protective device?',
      yes: 'Their leakage currents sum — split the protection or reassess the arrangement',
      no: 'Continue',
    },
    {
      question: 'Are the motor bearings showing fluted races?',
      yes: 'The same root cause is destroying the motor — fix the screening and fit shaft grounding or an insulated bearing',
      no: 'Address the leakage trips',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Characterise when the trip happens',
      inspect: 'Whether trips occur at start, during acceleration, at a particular speed, or during steady running',
      where: 'The drive fault log and the protective device',
      instrument: 'Observation and the drive log',
      expected: 'A repeatable pattern',
      ifAbnormal:
        'Trips at start and never during running strongly indicate capacitive leakage. Trips that vary with weather indicate genuine insulation deterioration. Trips that began after an installation change point at what changed.',
      next: 'Establish what changed recently — cable length, motor, switching frequency, additional drives',
      verify: 'Fault code meanings are drive-specific; take them from the manual',
    },
    {
      step: 2,
      title: 'Exclude a genuine insulation fault first',
      inspect: 'Insulation resistance of the motor and motor cable together, conductor to earth',
      where: 'At the drive output terminals, with the drive fully disconnected',
      instrument: 'Insulation resistance tester at the voltage the motor manufacturer specifies',
      expected: 'A high, stable reading consistent with the motor manufacturer minimum for a machine in service',
      ifAbnormal:
        'A low or falling reading is a real insulation fault. Stop here and repair it — nothing else in this guide applies until it is resolved.',
      next: 'Where insulation is sound, everything that follows concerns capacitive leakage and installation practice',
      warning:
        'Disconnect the drive completely before applying test voltage. Insulation testers destroy drive output stages. Discharge the cable afterwards.',
    },
    {
      step: 3,
      title: 'Measure the actual leakage current',
      inspect: 'Leakage current with the drive running under normal conditions',
      where: 'Around all supply conductors together at the drive input, and separately around the motor cable',
      instrument: 'True-RMS leakage clamp meter',
      expected:
        'A leakage current consistent with the drive manufacturer typical figure for the cable length and switching frequency in use',
      ifAbnormal:
        'Leakage well above the manufacturer typical figure indicates poor screening or excessive cable length rather than an insulation fault',
      next: 'Compare against the trip rating of the protective device — the relationship explains the trips',
      verify:
        'Typical leakage figures for cable length and switching frequency are published by the drive manufacturer',
      warning: 'Clamp around all conductors of the circuit together. Clamping one conductor reads load current, not leakage.',
    },
    {
      step: 4,
      title: 'Inspect the screen termination at both ends',
      inspect: 'How the cable screen is terminated at the drive and at the motor',
      where: 'Drive output gland and motor terminal box',
      instrument: 'Visual, with the installation isolated',
      expected:
        'A full 360-degree connection through an EMC gland at both ends, with the screen unbroken along the run',
      ifAbnormal:
        'A pigtail — braid twisted into a tail and taken to an earth terminal — is the most common defect on drive installations. It looks earthed and is electrically ineffective at the frequencies that matter.',
      next:
        'Check both ends. A screen terminated correctly at one end only does not provide a contained return path.',
      warning:
        'Do not resolve leakage by disconnecting the screen. That pushes the return current through the installation and through motor bearings.',
    },
    {
      step: 5,
      title: 'Check cable length and type against the drive limits',
      inspect: 'Actual installed motor cable length, cable type, and the switching frequency configured',
      where: 'The installation and the drive parameters',
      instrument: 'Cable records or measurement, and the drive manufacturer data',
      expected:
        'Screened cable of a type suitable for drive output, within the manufacturer maximum length for the switching frequency in use',
      ifAbnormal:
        'Cable longer than the limit, or unscreened cable on a drive output, produces leakage that no protective device selection will make acceptable',
      next: 'Where length cannot be reduced, an output filter is the engineering answer',
      verify:
        'Maximum length varies with switching frequency and with whether an output filter is fitted — read the specific table for the drive',
    },
    {
      step: 6,
      title: 'Verify the protective device type and test it',
      inspect: 'Type and rating of the upstream earth-leakage device, and whether it operates correctly',
      where: 'The distribution board feeding the drive',
      instrument: 'RCD or earth-leakage tester',
      expected:
        'A device of a type rated for the DC and high-frequency leakage components a drive produces, operating within its rated current and time',
      ifAbnormal:
        'A device of an unsuitable type may nuisance-trip on drive leakage AND fail to operate correctly on a real earth fault — the dangerous combination',
      next: 'Replace with a suitable type. Never remove the protection, and never simply fit a higher rating to stop the trips.',
      verify:
        'The required device type for drive circuits is stated by the drive manufacturer and by the applicable wiring regulations',
    },
    {
      step: 7,
      title: 'Check whether multiple drives share one device',
      inspect: 'How many drives sit behind the tripping protective device',
      where: 'The distribution arrangement',
      instrument: 'The panel schedule and single-line diagram',
      expected: 'Protection arranged so that summed leakage from multiple drives does not approach the trip threshold',
      ifAbnormal:
        'Individual drives each within limits can sum to exceed the device rating — a common cause where drives have been added over time',
      next: 'Split the protection, or reassess the distribution arrangement',
    },
    {
      step: 8,
      title: 'Check the motor bearings for the same root cause',
      inspect: 'Bearing condition, and any removed bearing races',
      where: 'The motor',
      instrument: 'Visual inspection of removed bearings; vibration and noise assessment in service',
      expected: 'No fluting, and no premature bearing failure history',
      ifAbnormal:
        'Fluted races confirm shaft current, which comes from the same poor screening and earthing that causes the leakage trips. Fixing one fixes both.',
      next:
        'Where fluting is present, fit shaft grounding or the specified insulated bearing in addition to correcting the screening',
    },
  ],

  repair: [
    {
      level: 'wiring',
      title: 'Screen termination — the fix that resolves most of these',
      steps: [
        'Fit EMC glands of the correct size at both the drive and the motor, giving a full 360-degree contact with the screen.',
        'Remove pigtail terminations entirely. A twisted tail of braid to an earth terminal is not a screen termination at the frequencies involved.',
        'Keep the screen continuous along the whole run. Where a junction is unavoidable, maintain screen continuity through it with a proper enclosure.',
        'Ensure the motor terminal box provides a proper earth and screen landing point; where it does not, fit an adaptor plate that does.',
        'Bond the drive, panel, motor and structure to a proper earthing arrangement rather than relying on the cable earth alone.',
      ],
      note:
        'Pigtailed screens are the single most common defect on drive installations, and correcting them resolves the majority of leakage nuisance trips without any other change.',
    },
    {
      level: 'wiring',
      title: 'Cable selection and routing',
      steps: [
        'Use screened cable of a type intended for drive output, not general-purpose armoured cable pressed into service.',
        'Keep the run within the drive manufacturer maximum for the switching frequency in use.',
        'Route motor cable separately from control and signal cables, and cross at right angles where crossing is unavoidable.',
        'Keep the phase conductors and their earth close together to minimise loop area.',
        'Where a long run is unavoidable, fit an output filter as the engineering solution rather than accepting the leakage.',
      ],
    },
    {
      level: 'configuration',
      title: 'Settings and protection selection',
      steps: [
        'Return the switching frequency to the drive default where it has been raised, since leakage scales with it.',
        'Select an earth-leakage protective device of a type rated for the DC and high-frequency components a drive produces.',
        'Arrange protection so that several drives do not sum their leakage into one device.',
        'Where the drive provides an internal EMC filter that can be disconnected for use on an IT system, confirm its state matches the earthing system in use.',
        'Record the switching frequency, cable length and protection type in the site file so the next change is assessed.',
      ],
      note:
        'Never remove earth-leakage protection or raise its rating to stop nuisance trips. The device is a life-safety measure and the leakage is a symptom of the installation.',
    },
    {
      level: 'component-replacement',
      title: 'Filters, shaft grounding and motor selection',
      steps: [
        'Fit the output or dV/dt filter where the drive manufacturer requires one for the cable length in use.',
        'Fit shaft grounding or the specified insulated bearing where fluting has been found.',
        'Replace motors that are not rated for inverter duty with motors that are, where drive-related insulation stress is evident.',
        'Replace protective devices of unsuitable type, and test the replacement after fitting.',
      ],
    },
  ],

  validation: [
    'Insulation resistance of motor and cable high and stable, confirming no genuine insulation fault',
    'Measured leakage current consistent with the drive manufacturer typical figure for the installed cable length and switching frequency',
    'Screen terminated with a 360-degree connection at both ends, verified visually',
    'Cable length and type within the drive manufacturer limits, recorded',
    'Protective device of a suitable type, tested and operating within its rated current and time',
    'No trips across repeated starts and a full duty cycle',
    'Motor bearing condition monitored where shaft current was implicated',
  ],

  whenNotToRepair: [
    'Genuine insulation failure in the motor — that is a motor repair or replacement, not an installation correction',
    'Cable with damaged insulation along its length rather than at one point',
    'Installations where the required cable length cannot be achieved and no output filter can be accommodated — that needs design review',
    'Any installation where earth-leakage protection has been removed or bypassed; correct that before anything else, and do not energise until it is restored',
    'Motors not rated for inverter duty showing insulation damage — replacing the bearing or the cable will not address the cause',
  ],

  prevention: [
    'Specify EMC glands and 360-degree screen terminations at design stage, and inspect them at commissioning',
    'Record motor cable length, cable type, switching frequency and protective device type in the site file',
    'Check cable length against the drive limit before any motor relocation or cable extension',
    'Select earth-leakage protection by type as well as rating whenever a drive circuit is designed or modified',
    'Avoid grouping multiple drives behind a single earth-leakage device',
    'Fit shaft grounding or insulated bearings on inverter-fed motors as standard where the application warrants it, rather than after the first bearing failure',
    'Inspect screen terminations after any maintenance that disturbed them — they are frequently reinstated as pigtails',
  ],

  relatedSlugs: [
    'vfd-drive-fault-diagnosis',
    'drive-thermal-derating-and-cooling',
    'motor-bearing-failure-diagnosis',
    'safe-isolation-and-proving-dead',
  ],

  faq: [
    {
      q: 'The RCD trips every time the drive starts. Is the motor faulty?',
      a: 'Probably not. Measure insulation resistance with the drive disconnected — if it is high, the motor and cable are sound and you are seeing normal capacitive leakage. The answer is then in the screen termination, the cable length and the type of protective device, not in the motor.',
    },
    {
      q: 'Can I just fit a higher-rated RCD to stop the tripping?',
      a: 'No. That reduces the protection given to people while leaving the underlying installation defect in place. And if the device is the wrong type for drive leakage, a higher rating does not make it correct — it may still fail to operate on a genuine earth fault.',
    },
    {
      q: 'What is wrong with a pigtail screen termination?',
      a: 'At the frequencies a drive produces, a short twisted tail of braid presents a high impedance, so it does not provide the return path the screen is meant to give. It looks properly earthed and does very little. A 360-degree connection through an EMC gland is what actually works, and correcting this alone resolves most of these trips.',
    },
    {
      q: 'Would disconnecting the screen stop the leakage current?',
      a: 'It would stop the protective device seeing it in that path, which is not the same thing. The current still flows — through the installation earth, through structural steel and through the motor bearings, where it erodes the races. Never disconnect a screen to solve a leakage trip.',
    },
    {
      q: 'Why does a longer motor cable make it worse?',
      a: 'Because leakage is driven by the capacitance between the cable conductors and earth, and that capacitance grows with length. That is why drive manufacturers publish a maximum cable length, and why the limit gets shorter as switching frequency rises.',
    },
    {
      q: 'The motor bearings keep failing and the RCD keeps tripping. Are they connected?',
      a: 'Almost certainly, yes. Both come from drive-generated current finding a return path through the installation rather than through a properly terminated screen. Correcting the screening addresses both, and where fluting has already occurred the motor also needs shaft grounding or an insulated bearing.',
    },
  ],

  references: [
    'Drive manufacturer manual — maximum motor cable length by switching frequency, typical leakage current figures, EMC installation requirements and required protective device type',
    'Drive manufacturer EMC installation guidance, including screen termination and earthing arrangements',
    'Cable manufacturer data for the screened cable installed, including capacitance per unit length where published',
    'Motor manufacturer data on inverter duty suitability and bearing insulation or shaft grounding requirements',
    'IEC 61800-3 — adjustable speed electrical power drive systems: EMC requirements and specific test methods',
    'IEC 60364 series and the applicable national wiring regulations for residual current device selection and application',
    'KS IEC standards as adopted by KEBS, and Energy and Petroleum Regulatory Authority requirements applying to installations in Kenya',
  ],
};
