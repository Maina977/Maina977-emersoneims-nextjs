import type { RepairArticle } from '../types';

export const solarModuleDegradationBypassDiodes: RepairArticle = {
  slug: 'solar-module-degradation-bypass-diodes',
  hub: 'solar',
  header: {
    title: 'Module Degradation and Bypass Diode Failure — Finding the Weak Panel',
    equipmentCategory: 'Solar PV modules',
    appliesTo:
      'Crystalline silicon modules in grid-tied, hybrid and off-grid arrays, roof and ground mounted, any age',
    difficulty: 'intermediate',
    diagnosisComplexity:
      'Moderate — the measurement is simple, but separating genuine module degradation from shading, soiling and string faults is where most diagnoses go wrong',
    competence: 'qualified-electrician',
    author: 'EmersonEIMS Engineering',
    technicalReviewer: 'Mr. Kararaho',
    published: '2026-07-30',
    lastReviewed: '2026-07-30',
    electricalSystem: 'PV DC module and string voltage per array design',
    safetyClass: 'multiple-hazard',
  },

  directAnswer:
    'A module that has genuinely degraded, or whose bypass diode has failed short, drags down the whole string it sits in — because in a series string every module carries the same current, and the weakest sets the ceiling. The signature is a string producing a voltage that is a clean step below its siblings rather than a fraction of a percent below. Each module typically contains bypass diodes covering sections of its cells, so a single failed-short diode removes a recognisable block of that module from the circuit and drops string voltage by a corresponding step. Diagnose by comparing sibling strings first to confirm the loss is real, then walking the suspect string module by module under open circuit, then thermal-scanning under load. Do not conclude degradation from a single low reading taken on a hazy afternoon, and do not replace modules while soiling or shading remains unaddressed.',

  symptoms: {
    display: [
      'One string consistently producing a voltage a clear step below its siblings, in the same conditions',
      'MPPT input tracking at a lower voltage than expected for the module count',
      'Yield loss that persists after cleaning and after shading has been ruled out',
      'Loss that is proportional across the whole day rather than confined to morning or evening',
    ],
    indicators: [
      'Inverter operating point sitting lower on one input than the design would suggest',
      'Monitoring showing one string permanently offset below its siblings rather than intermittently dropping out',
    ],
    sounds: ['None — module degradation is silent'],
    smells: [
      'Burnt smell at a module junction box in advanced cases where a diode has failed and overheated',
    ],
    behaviour: [
      'Loss is steady and repeatable, unlike shading which moves with the sun and unlike soiling which improves after rain',
      'Output does not recover after cleaning',
      'A module that has failed does not usually recover on its own; performance steps down and stays down',
    ],
    visible: [
      'Browning or yellowing of the encapsulant, visible as discolouration across cells',
      'Delamination — the laminate separating, often appearing as a milky or bubbled area',
      'Snail trails, the fine dark lines along cell microcracks that indicate mechanical damage',
      'Cracked or shattered glass, sometimes from hail, transport or roof traffic',
      'Discoloured or heat-damaged junction box on the module rear',
      'Corrosion at cell interconnect ribbons visible through the glass',
      'Hot spots visible on a thermal scan as a distinctly warmer cell or block of cells',
    ],
  },

  whatItMeans: {
    plain:
      'Panels wear out slowly, and a small number fail early. Because the panels in one chain are wired end to end, a weak panel limits everything behind it — like one narrow section in a pipe. Panels also contain small protective components called bypass diodes, whose job is to route current around a shaded section so one shadow does not stop the whole chain. When one of those fails, it can permanently cut out part of the panel. The task is to find out whether a panel is genuinely weak, or whether something simpler like dirt or shade is being blamed on the panel.',
    technical:
      'In a series string the current is common, so a module whose output current capability has fallen constrains the entire string, while string voltage falls by whatever the affected module fails to contribute. Bypass diodes are fitted across sub-groups of cells so that a shaded or faulty group can be bypassed, sacrificing that group\'s voltage rather than the whole string\'s current. A diode that has failed short permanently removes its cell group from the circuit, producing a discrete step down in module and string voltage roughly proportional to the fraction of the module bypassed. A diode failed open removes the protection instead, so under partial shading the affected cells are driven into reverse bias and dissipate power as heat — the mechanism behind hot spots and, eventually, physical damage. This distinction matters diagnostically: failed-short shows as a clean voltage step in normal conditions, while failed-open shows as excessive heating under partial shading with near-normal voltage when unshaded.',
  },

  causes: {
    mostLikely: [
      'Bypass diode failed short after repeated thermal cycling or a surge event, removing a cell group permanently',
      'Long-term encapsulant degradation on older modules, showing as browning and reduced output across the whole module',
      'Cell microcracks from mechanical stress — transport, installation loads, hail, or people walking on modules',
      'Hot spot damage caused by prolonged partial shading of a module whose bypass protection is not functioning',
    ],
    possible: [
      'Potential-induced degradation, where sustained system voltage stress against earth reduces module output, typically affecting modules at one end of a string more than the others',
      'Water ingress into the junction box, corroding the diode or interconnect',
      'Delamination admitting moisture to the cells and interconnect ribbons',
      'Interconnect ribbon fatigue fracture, reducing output before it eventually opens entirely',
    ],
    lessCommon: [
      'Manufacturing defect emerging in early life, usually within the workmanship warranty period',
      'Reverse-polarity connection during a past repair damaging the module',
      'Lightning-induced surge failing several diodes across an array at once',
      'Glass breakage without visible impact damage, from thermal stress or mounting strain',
    ],
    modelSpecific: [
      'The number of bypass diodes and how many cells each covers varies by module design, and determines the size of the voltage step a single failed diode produces — confirm from the module datasheet',
      'Module warranty terms, and the performance threshold below which a claim is valid, differ by manufacturer and by year of supply',
      'Some module families are more susceptible to potential-induced degradation than others; the datasheet or manufacturer bulletin will say',
    ],
    environmental: [
      'High ambient temperature and strong irradiance accelerate encapsulant ageing — relevant across much of Kenya, and particularly at low-altitude and arid sites',
      'Lightning activity, common in the Kenyan highlands and lake basin, failing diodes without any direct strike',
      'Persistent partial shading from vegetation growth, which causes hot spots rather than merely reducing yield',
      'Dust and abrasion in arid regions physically eroding the glass surface over years',
      'Humidity and wet-season condensation driving moisture into junction boxes with degraded seals',
    ],
    installation: [
      'Modules walked on during installation or subsequent roof work, causing cell microcracks not visible at the time',
      'Mounting clamps overtightened or positioned outside the manufacturer clamping zones, imposing frame stress',
      'Modules installed with inadequate ventilation behind them, raising operating temperature and accelerating ageing',
      'Array earthing arrangement that does not match the module manufacturer requirement, contributing to potential-induced degradation',
    ],
    maintenance: [
      'Vegetation allowed to grow into the array so partial shading becomes permanent',
      'Cleaning with abrasive materials or high-pressure water, damaging the glass or forcing water into seals',
      'No periodic thermal survey, so hot spots progress to permanent damage unseen',
      'Soiling left long enough to cause localised shading from bird droppings or leaf accumulation',
    ],
    componentLevel: [
      'Bypass diode failure, short or open',
      'Junction box terminal or potting failure',
      'Cell interconnect ribbon fracture or corrosion',
      'Encapsulant browning reducing light transmission to the cells',
    ],
  },

  safety: {
    isolation: [
      'Modules generate voltage whenever illuminated and cannot be switched off. Treat every module conductor as live.',
      'Isolate the string at the combiner before separating any module connector, and prove the isolator has opened.',
      'On hybrid and off-grid systems, isolate and lock the battery as well.',
    ],
    lockoutTagout: [
      'Lock and tag both AC and DC isolators, and the battery isolator where fitted.',
      'Where a string is left partially disconnected while you work through it, tag the open ends so nobody re-energises the string.',
    ],
    ppe: [
      'Gloves and eye protection rated for the array DC voltage',
      'Insulated tools rated above maximum system voltage',
      'Fall protection appropriate to the roof pitch and edge condition',
      'Heat-resistant gloves when handling modules in the middle of the day — module rear surfaces reach temperatures that cause contact burns',
      'Cut-resistant gloves and eye protection when handling any module with broken glass',
    ],
    storedEnergy: [
      'Inverter DC-link capacitors hold charge after isolation; observe the manufacturer discharge time.',
      'Battery systems remain energised regardless of array state.',
    ],
    specificHazards: [
      'Never break a DC connection under load. A sustained DC arc will not self-extinguish.',
      'A module with broken glass may have compromised insulation and can energise the mounting frame. Verify frame-to-earth before handling.',
      'A module with a failed-open bypass diode under partial shading can become hot enough to cause burns and, in severe cases, to damage the roof surface beneath.',
      'Damaged modules can expose sharp glass edges; a shattered laminate remains electrically live.',
      'Do not stand or kneel on modules at any time — it causes the microcracks that produce the next generation of faults.',
    ],
    stopAndCallProfessional: [
      'You find a module hot enough to be a burn or fire risk — isolate the string and stop.',
      'Glass is broken and the module is still generating; this needs controlled removal.',
      'The array frame or structure is live to earth.',
      'Modules are within warranty and you are considering removing them — check the claim procedure first, because unauthorised removal or testing can void the claim.',
      'You cannot safely access the array, or the roof cannot be made safe for the time the survey requires.',
      'You do not hold competence for DC work at the array voltage.',
    ],
  },

  tools: [
    { tool: 'Multimeter rated for array DC voltage, CAT III minimum', why: 'Per-module open-circuit voltage comparison, which is the primary measurement' },
    { tool: 'DC clamp meter', why: 'String current comparison without breaking the circuit' },
    { tool: 'Thermal camera', why: 'The only practical way to find hot spots and failed-open diodes; a failed diode is frequently visible thermally before it is visible electrically' },
    { tool: 'Irradiance meter or reference cell', why: 'Confirms conditions were comparable between measurements, without which module comparisons are unreliable' },
    { tool: 'Module datasheet for the exact modules fitted', why: 'Establishes bypass diode count and configuration, so a voltage step can be interpreted' },
    { tool: 'Correct connector unmating tool', why: 'Separating modules without it damages the latch and creates a string fault' },
    { tool: 'Camera and a marked array layout drawing', why: 'Degradation surveys are only useful if findings are recorded against identifiable module positions' },
  ],

  decisionTree: [
    {
      question: 'Has soiling been cleaned and shading ruled out first?',
      yes: 'Proceed — a module diagnosis is only meaningful once the simple causes are eliminated',
      no: 'Stop and address those first. Most suspected module failures are dirt or shade.',
    },
    {
      question: 'Is one string a clear step below its siblings under the same sun?',
      yes: 'Continue into that string',
      no: 'The loss is array-wide — work the underperformance guide instead',
    },
    {
      question: 'Does that string measure open-circuit voltage close to its siblings?',
      yes: 'No module is bypassed; look for current-limiting degradation and hot spots under load',
      no: 'A discrete voltage step suggests a failed-short bypass diode or bypassed cell group',
    },
    {
      question: 'Walking the string module by module, does one module read a clean step below the others?',
      yes: 'That module has a bypassed cell group — confirm thermally and treat as a module fault',
      no: 'Loss is spread across the string, which points to general ageing rather than one failure',
    },
    {
      question: 'Under load, does the thermal scan show a hot cell or block on any module?',
      yes: 'Hot spot present — determine whether shading is driving it or the bypass protection has failed open',
      no: 'No active hot spot; a failed-short diode or general degradation remains the likely cause',
    },
    {
      question: 'Are the modules still within their performance warranty period?',
      yes: 'Document thoroughly and pursue the claim before removing anything',
      no: 'Decide on replacement based on the yield being lost against the cost of replacement',
    },
  ],

  diagnosis: [
    {
      step: 1,
      title: 'Eliminate soiling and shading before suspecting modules',
      inspect: 'Module surfaces, and the shading pattern across the array at several times of day',
      where: 'The whole array',
      instrument: 'Visual survey, ideally photographed at morning, midday and afternoon',
      expected:
        'Clean modules and no new shading from vegetation, structures, aerials or newly installed plant',
      ifAbnormal:
        'Clean the array properly and cut back vegetation, then re-measure after a full clear day before going further',
      next: 'Only continue when the simple causes are genuinely excluded',
      warning:
        'Replacing modules while shading or soiling remains will not restore output, and the cost falls on the customer for nothing.',
    },
    {
      step: 2,
      title: 'Confirm the loss is real by comparing sibling strings',
      inspect: 'Open-circuit voltage and operating current of each string on the affected input',
      where: 'Combiner box',
      instrument: 'Multimeter and DC clamp meter',
      expected:
        'Sibling strings within a few percent of one another when measured close together in time under stable sun',
      ifAbnormal:
        'A discrete voltage step on one string points to a bypassed cell group. A current shortfall with normal voltage points to a current-limited module.',
      next: 'Record the irradiance at the time of measurement so the readings mean something later',
      verify:
        'Confirm the designed module count per string from the array documentation before interpreting any voltage step',
    },
    {
      step: 3,
      title: 'Walk the suspect string module by module',
      inspect: 'Open-circuit voltage of each module in the affected string',
      where: 'At each module in turn along the string',
      instrument: 'Multimeter rated for array voltage',
      expected:
        'Modules of the same type in the same conditions reading closely together. One module a clean step below the rest indicates a bypassed cell group.',
      ifAbnormal:
        'A module reading roughly zero is open or fully shorted. A module a clear fraction below its neighbours has lost a cell group.',
      next: 'Mark the position of any outlier on the array layout drawing, and photograph it',
      verify:
        'Take the bypass diode count and cell grouping from the module datasheet to convert a voltage step into the number of cell groups lost',
      warning:
        'Isolate the string before separating any connector, and work in a consistent direction so no module is missed.',
    },
    {
      step: 4,
      title: 'Thermal-scan the array under load',
      inspect: 'Module surface temperature distribution, front and rear where accessible',
      where: 'Whole array, with the system running and generating',
      instrument: 'Thermal camera',
      expected:
        'Even temperature across each module and consistency between modules of the same orientation',
      ifAbnormal:
        'A single hot cell indicates a hot spot. A uniformly warmer block within a module indicates a bypassed group carrying current through its diode. A hot junction box indicates diode failure.',
      next: 'Correlate every thermal finding with the electrical readings from the previous step',
      warning:
        'Scan under genuine load and reasonable irradiance. A scan on an overcast morning shows nothing useful.',
    },
    {
      step: 5,
      title: 'Distinguish failed-short from failed-open diodes',
      inspect:
        'Whether the loss is a permanent voltage step, or excessive heating that only appears under partial shading',
      where: 'The identified module',
      instrument: 'Multimeter and thermal camera together',
      expected:
        'Failed short: a persistent voltage step with the bypassed group running warm but not extreme. Failed open: near-normal voltage when unshaded, with severe local heating as soon as part of the module is shaded.',
      ifAbnormal:
        'Severe localised heating under partial shade is the dangerous case — the cells are in reverse bias with no protection',
      next: 'A failed-open diode with active hot-spotting should be taken out of service rather than monitored',
      verify:
        'The module datasheet states the diode arrangement; some designs allow junction box access for diode replacement and many do not',
      warning:
        'A module with a failed-open bypass diode under persistent shading is a fire risk, not merely a performance problem.',
    },
    {
      step: 6,
      title: 'Inspect the module physically',
      inspect: 'Glass, encapsulant, cell interconnects, frame, and junction box',
      where: 'The identified module, front and rear',
      instrument: 'Visual, with strong oblique light for microcracks and snail trails',
      expected: 'Clear encapsulant, intact glass, no delamination, sealed and undamaged junction box',
      ifAbnormal:
        'Browning, delamination, snail trails, corroded ribbons or a heat-damaged junction box all confirm module-level failure',
      next: 'Photograph everything found — this is the evidence a warranty claim will require',
      warning: 'Do not stand on modules during inspection. That is how the next set of microcracks is created.',
    },
    {
      step: 7,
      title: 'Assess the pattern across the array',
      inspect: 'Whether the affected modules cluster by string position, by roof area, or by age',
      where: 'The array layout drawing with survey findings marked',
      instrument: 'The record built through steps 3 to 6',
      expected: 'Isolated random failures in a healthy array',
      ifAbnormal:
        'Failures concentrated at one end of a string suggest potential-induced degradation. Failures clustered under a shading source suggest hot-spot damage. Failures spread evenly across an older array suggest general ageing.',
      next: 'The pattern determines whether this is a module replacement, a design correction, or an end-of-life question',
      verify:
        'Where potential-induced degradation is suspected, confirm the earthing arrangement required by the module manufacturer for this module family',
    },
    {
      step: 8,
      title: 'Quantify the loss before recommending replacement',
      inspect: 'Yield actually lost against the yield the array should produce for the conditions',
      where: 'Monitoring data across several comparable days',
      instrument: 'Monitoring platform and the array design documentation',
      expected: 'A defensible figure for the energy being lost, not an impression',
      ifAbnormal:
        'If the measured loss does not account for the shortfall, another cause remains and module replacement will disappoint',
      next: 'Present the loss, the replacement cost and any warranty position together so the decision is an informed one',
    },
  ],

  repair: [
    {
      level: 'cleaning-and-connections',
      title: 'Address the causes before the symptoms',
      steps: [
        'Clean the array properly using the module manufacturer method — never abrasive pads or high-pressure water.',
        'Cut back vegetation causing partial shading, and plan the cutting interval so it does not simply grow back into the array.',
        'Remove bird droppings and debris promptly; localised soiling causes hot spots, not just yield loss.',
        'Re-seal or replace junction boxes where moisture ingress has begun but no cell damage has yet occurred.',
      ],
      note:
        'A hot spot caused by shading will destroy a healthy module. Removing the shading is a repair, not housekeeping.',
    },
    {
      level: 'component-replacement',
      title: 'Module replacement',
      steps: [
        'Check the warranty position before removing anything — many manufacturers require their own inspection and can decline a claim on a module already removed.',
        'Replace with a module of matching electrical characteristics. A replacement of different current rating will limit the whole string.',
        'Where an exact match is unavailable, relocate modules so each string remains internally consistent rather than mixing types within one string.',
        'Isolate the string and prove dead before disconnecting the module.',
        'Observe the manufacturer clamping zones and torque when mounting the replacement.',
        'Test insulation resistance of the string after the change and before returning it to service.',
      ],
      note:
        'Matching matters more than brand. A string is limited by its weakest module, so a mismatched replacement transfers the loss rather than removing it.',
    },
    {
      level: 'configuration',
      title: 'Correcting design contributors',
      steps: [
        'Where potential-induced degradation is suspected, review the array earthing against the module manufacturer requirement and correct it — otherwise replacement modules degrade the same way.',
        'Where inadequate rear ventilation is raising module temperature, correct the mounting standoff.',
        'Where modules were mounted outside the permitted clamping zones, remount correctly during the same visit.',
        'Update the array layout drawing with replaced modules and their date, so the next survey has history.',
      ],
    },
    {
      level: 'manufacturer-level',
      title: 'Warranty and manufacturer involvement',
      steps: [
        'Document with photographs, thermal images, per-module readings and the recorded irradiance.',
        'Establish the module serial numbers and the supply date.',
        'Compare measured performance against the manufacturer performance warranty curve for the module age.',
        'Submit the claim before removal where the manufacturer requires it.',
      ],
      note:
        'Bypass diodes are inside a sealed junction box on most modern modules. Where the design does not provide for diode replacement, the module is the replaceable unit and opening it voids any remaining warranty.',
    },
  ],

  validation: [
    'Replaced module reading in line with its neighbours on open-circuit voltage under the same conditions',
    'String voltage and current back in line with sibling strings',
    'Thermal scan under load showing no hot spot on the repaired string',
    'Insulation resistance of the affected string consistent with the rest of the array',
    'Yield across several comparable days matching what the array should produce for those conditions',
    'Array layout drawing updated with the module positions replaced and the date',
  ],

  whenNotToRepair: [
    'Modules with broken glass — these are a replacement and an electrical safety matter, not a repair',
    'Sealed junction boxes where the manufacturer makes no provision for diode replacement; opening them voids warranty and rarely produces a durable result',
    'Widespread browning or delamination across an ageing array, where individual replacement chases a loss that is general rather than local',
    'Modules within performance warranty — pursue the claim rather than replacing at the customer\'s cost',
    'Arrays where potential-induced degradation is suspected but the earthing arrangement has not been corrected; replacements will degrade the same way',
    'Any array where the loss has not been quantified — replacement without a measured baseline cannot be shown to have worked',
  ],

  prevention: [
    'Thermal-survey the array annually under load, and keep the images so year-on-year comparison is possible',
    'Record per-string and, on first commissioning, per-module readings so degradation is measured against a real baseline rather than a datasheet',
    'Keep vegetation cut back on a planned interval rather than in response to yield loss',
    'Never walk on modules, and brief anyone doing roof work on that before they go up',
    'Clean using the manufacturer method and at an interval matched to the site — arid and dusty sites need it far more often',
    'Confirm the array earthing matches the module manufacturer requirement at commissioning, which is the practical defence against potential-induced degradation',
    'Note module serial numbers and supply dates at handover, because a warranty claim years later depends on records nobody keeps at the time',
  ],

  relatedSlugs: ['solar-system-underperforming', 'solar-string-fault-diagnosis', 'solar-inverter-dc-bus-fault'],

  faq: [
    {
      q: 'How much output should a solar module lose as it ages?',
      a: 'Manufacturers publish a performance warranty describing the output they guarantee at given ages, and that document is the reference for your specific modules. What matters diagnostically is not the absolute figure but whether a module has fallen out of line with its neighbours of the same age and exposure. A whole array declining gently together is ageing; one module stepping down is a fault.',
    },
    {
      q: 'Can a bypass diode be replaced instead of the module?',
      a: 'Sometimes, but on most modern modules the junction box is sealed and the manufacturer makes no provision for it. Opening a sealed box voids any remaining warranty and creates a moisture ingress path that usually causes the next failure. Where the module is within warranty, claim rather than open it.',
    },
    {
      q: 'What is the difference between a failed-short and a failed-open bypass diode?',
      a: 'Failed short permanently bypasses its cell group, so you lose that portion of the module output but the module stays safe. Failed open removes the protection, so if that section is shaded the cells are driven into reverse bias and heat up badly. Failed short is a performance problem; failed open is a fire risk.',
    },
    {
      q: 'Why does one bad module affect the whole string?',
      a: 'The modules are in series, so they all carry the same current. A module that cannot pass as much current limits every other module in that string, and the string output falls to what the weakest module allows. This is why a single failure produces a loss far larger than one module\'s share of the array.',
    },
    {
      q: 'Are snail trails a real fault or just cosmetic?',
      a: 'They are a visible marker of microcracks in the cells beneath. The trails themselves do not cause loss, but the cracks they indicate can reduce output and tend to worsen with thermal cycling. Treat them as a reason to measure that module and monitor it, not as a reason to replace it immediately.',
    },
    {
      q: 'Should I replace one module with whatever is available?',
      a: 'Only if its electrical characteristics match the others in that string, particularly its current rating. A mismatched replacement becomes the new limiting module and the string does not recover. If an exact match is unavailable, it is usually better to reorganise the array so each string is internally consistent.',
    },
    {
      q: 'The array is dirty and one string is low. Which do I fix first?',
      a: 'Clean first, always. Soiling and shading account for the large majority of suspected module failures, they cost far less to address, and any module measurement taken on a dirty array is unreliable. Measure again after a clear day before condemning anything.',
    },
  ],

  references: [
    'Module manufacturer datasheet — electrical characteristics, temperature coefficients, bypass diode configuration and clamping zones',
    'Module manufacturer performance warranty document and claim procedure for the modules fitted',
    'Array design documentation, string layout drawing and commissioning records',
    'IEC 61215 — crystalline silicon terrestrial photovoltaic module design qualification and type approval',
    'IEC 62446-1 — grid-connected PV system commissioning, documentation and verification testing',
    'IEC TS 62446-3 — outdoor infrared thermography of photovoltaic modules and plants',
    'KS IEC standards as adopted by KEBS, and Energy and Petroleum Regulatory Authority requirements applying to solar installations in Kenya',
  ],
};
