/**
 * workshopServices — data for /generators/workshop-services.
 *
 * Owner brief 2026-07-21. Content rules applied throughout:
 *   - No turnaround-time promises. Scope and timing follow inspection.
 *   - No certification, accreditation or dealership claims.
 *   - No noise-level figures for canopies (that needs acoustic design + test).
 *   - No claim that every damaged component can be economically repaired.
 *   - No claim of workshops or staff outside the Embakasi, Nairobi base.
 *   - Calibration/測試 equipment is described as "where available" rather than
 *     asserted, per the brief's instruction not to claim equipment we may not
 *     directly control.
 */

export type WorkshopService = {
  id: string;
  title: string;
  nav: string;
  division: 'components' | 'electrical' | 'fabrication' | 'machinery';
  intro: string;
  scope: string[];
  /** Customer-facing symptoms — how they know they need this. */
  symptoms?: string[];
  cta: string;
  /** Existing page to link to rather than duplicate. */
  relatedHref?: string;
  relatedLabel?: string;
  /** Honest limitation shown on the card. */
  caveat?: string;
};

export const DIVISIONS = [
  { id: 'components', title: 'Generator & Engine Component Repairs', blurb: 'Cooling, starting, charging, fuel and air systems — repaired at component level rather than replaced wholesale.' },
  { id: 'electrical', title: 'Electrical, UPS, Motor & Pump Repairs', blurb: 'Rotating electrical machines and backup power systems, diagnosed before any repair is quoted.' },
  { id: 'fabrication', title: 'Generator Fabrication & Fuel Systems', blurb: 'Canopies, exhausts, tanks, plinths and security — fabricated to the machine and the site, not to a standard drawing.' },
  { id: 'machinery', title: 'Industrial Machinery Fabrication', blurb: 'Processing machinery built to a defined duty, material and output rather than copied from a photograph.' },
] as const;

export const WORKSHOP_SERVICES: WorkshopService[] = [
  {
    id: 'cooling-systems',
    title: 'Radiator & Cooling System Repairs',
    nav: 'Cooling Systems',
    division: 'components',
    intro:
      'Overheating destroys engines faster than almost any other fault, and on standby sets it usually appears the first time the machine is asked to take real load. We inspect, pressure-test and repair generator and industrial-engine cooling systems rather than condemning a radiator on appearance.',
    scope: [
      'Pressure testing to locate leaks under working conditions',
      'Core cleaning, flushing and blockage assessment',
      'Tube, core and end-tank repair where the core is serviceable',
      'Radiator cap and thermostat testing',
      'Hose, clamp and fan-drive inspection',
      'Coolant condition and inhibitor assessment',
      'Cooling-system troubleshooting on running sets',
    ],
    symptoms: ['Coolant leakage', 'High-temperature shutdown under load', 'Blocked or fin-damaged core', 'Corroded or split end tanks', 'Contaminated coolant', 'Weak airflow through the radiator'],
    cta: 'Request Radiator Inspection',
  },
  {
    id: 'starters-alternators',
    title: 'Starter Motors & Charging Alternators',
    nav: 'Starters & Alternators',
    division: 'components',
    intro:
      'A set that will not crank, or one whose batteries are flat when it is finally needed, is usually a starting or charging fault rather than an engine fault. Both are repairable at component level.',
    scope: [
      'Starter solenoid testing and replacement',
      'Armature, commutator and brush servicing',
      'Bush, bearing and Bendix-drive inspection',
      'Charging alternator diagnosis — output, regulator and rectifier',
      'Diode and rectifier pack testing',
      'Bearing replacement and terminal repair',
      'No-load functional testing before return',
    ],
    symptoms: ['Engine will not crank', 'Slow or intermittent cranking', 'Batteries flat after standing', 'Charge warning during running', 'Grinding on engagement'],
    cta: 'Send Starter or Alternator Details',
  },
  {
    id: 'motor-rewinding',
    title: 'Alternator & Electric Motor Rewinding',
    nav: 'Motor Rewinding',
    division: 'electrical',
    intro:
      'Rewinding covers three distinct machines that are often confused: the engine charging alternator, the generator end that produces your output, and industrial electric motors. We assess which of these has actually failed before quoting, because the remedy and the cost differ sharply.',
    scope: [
      'Single-phase, three-phase, pump, compressor and fan motors',
      'Generator alternator stator and rotor windings',
      'Insulation resistance testing before and after work',
      'Rewinding where it is technically and economically sound',
      'Bearing, shaft and terminal repair',
      'Rotor inspection and balance assessment',
      'No-load and output testing after rewind',
    ],
    symptoms: ['No output voltage', 'Output collapses under load', 'Burning smell or discoloured windings', 'Motor trips its protection on start', 'Insulation failure after standing or flooding'],
    cta: 'Request Motor Repair',
    relatedHref: '/solutions/motor-rewinding',
    relatedLabel: 'View motor rewinding details',
  },
  {
    id: 'injectors',
    title: 'Injector Nozzle Testing & Repair',
    nav: 'Injectors & Fuel Pumps',
    division: 'components',
    intro:
      'Injector faults show as smoke, rough running and poor load acceptance, and they are frequently misdiagnosed as engine wear. Injectors are assessed on test rather than by symptom alone.',
    scope: [
      'Spray-pattern examination',
      'Opening-pressure assessment',
      'Leak-back assessment',
      'Nozzle cleaning and carbon removal',
      'Nozzle-tip replacement where appropriate',
      'Cylinder-to-cylinder comparison',
      'Injector calibration where the equipment is available',
    ],
    symptoms: ['Black smoke', 'Rough or uneven running', 'Hard starting', 'Knocking on one cylinder', 'High fuel consumption'],
    cta: 'Book Injector Testing',
    caveat: 'Some nozzles are beyond economic repair and replacement is the better outcome — we say so at inspection rather than after the work.',
  },
  {
    id: 'injection-pumps',
    title: 'Diesel Injection Pump Repairs',
    nav: 'Injection Pumps',
    division: 'components',
    intro:
      'Mechanical and electronic injection pumps meter and time fuel delivery. Faults here affect starting, power and consumption together, and pumps are normally reconditioned and calibrated rather than replaced outright.',
    scope: [
      'Inspection and fault diagnosis',
      'Governor and delivery assessment',
      'Seal and fuel-leak repair',
      'Reconditioning and calibration coordination',
      'Timing verification on refit',
      'Fuel supply and filtration check to prevent repeat failure',
    ],
    symptoms: ['Hard starting', 'Weak power output', 'Hunting or surging', 'Excessive diesel consumption', 'Fuel leakage', 'Poor acceleration under load'],
    cta: 'Request Injection-Pump Diagnosis',
  },
  {
    id: 'turbochargers',
    title: 'Turbocharger Inspection & Rebuild',
    nav: 'Turbochargers',
    division: 'components',
    intro:
      'Turbochargers spin at very high speed on a thin oil film, so nearly every failure traces back to oil supply, oil condition or ingested debris. We look for the cause as well as the damage — replacing a turbo without finding the cause usually destroys the replacement.',
    scope: [
      'Shaft play, bearing and seal inspection',
      'Compressor and turbine wheel assessment',
      'Housing inspection for cracking and contact',
      'Carbon deposit cleaning',
      'Oil feed and drain line investigation',
      'Boost-loss and oil-carryover investigation',
      'Rebuild or replacement recommendation with reasons',
      'Balancing and testing where the equipment is available',
    ],
    symptoms: ['Loss of power', 'Blue or black smoke', 'Whining or siren noise', 'Oil in the intake pipework'],
    cta: 'Send Turbocharger Details',
    caveat: 'Not every damaged turbocharger is economically repairable. Where a rebuild is not sound engineering we will recommend a replacement instead.',
  },
  {
    id: 'engine-overhauls',
    title: 'Complete Engine Overhauls',
    nav: 'Engine Overhauls',
    division: 'components',
    intro:
      'A full overhaul is a measured process, not a parts swap. The scope is set after dismantling and measurement, because what a worn engine actually needs is rarely what its symptoms first suggest.',
    scope: [
      'Initial diagnosis and compression assessment',
      'Dismantling and component measurement',
      'Cylinder head, valve and seat inspection',
      'Crankshaft, bearing and journal assessment',
      'Piston, ring and liner inspection',
      'Lubrication, cooling and fuel system assessment',
      'Gasket, seal and consumable replacement',
      'Reassembly to specified torques and clearances',
      'Static testing, controlled run-in and load testing where applicable',
    ],
    symptoms: ['Blue smoke and high oil consumption', 'Low compression', 'Knocking under load', 'Metal in the oil or filter', 'Heavy crankcase blow-by'],
    cta: 'Request Engine Overhaul Assessment',
    caveat: 'The exact scope and cost are confirmed only after dismantling and measurement. We quote the inspection first, then the work.',
  },
  {
    id: 'ups-repairs',
    title: 'UPS Repairs & Battery-System Diagnosis',
    nav: 'UPS Repairs',
    division: 'electrical',
    intro:
      'A UPS that has never been load-tested is an assumption, not a backup. We diagnose the unit and the battery bank together, because a healthy UPS with a tired battery bank still fails at the moment it is needed.',
    scope: [
      'Fault diagnosis and alarm investigation',
      'Battery bank testing and replacement assessment',
      'Charger and inverter fault diagnosis',
      'Bypass and transfer problems',
      'Cooling fan and thermal fault investigation',
      'Internal connection and termination inspection',
      'Runtime assessment against actual connected load',
      'Preventive maintenance scheduling',
    ],
    symptoms: ['UPS alarming or on permanent bypass', 'No runtime on mains failure', 'Batteries not holding charge', 'UPS overheating or fans noisy'],
    cta: 'Request UPS Diagnosis',
    relatedHref: '/hub/ups-lab',
    relatedLabel: 'Open the UPS Intelligence Lab',
    caveat: 'Repair viability and price can only be confirmed after diagnosis — some units and battery banks are past economic repair.',
  },
  {
    id: 'pump-repairs',
    title: 'Pump Repairs & Overhauls',
    nav: 'Pump Repairs',
    division: 'electrical',
    intro:
      'Borehole, booster and process pumps usually fail through seals, bearings or the driving motor rather than the pump body. Diagnosing which saves replacing a pump that is still serviceable.',
    scope: [
      'Borehole, surface, booster, centrifugal and drainage pumps',
      'Mechanical inspection and electrical testing',
      'Mechanical seal and bearing replacement',
      'Impeller and shaft inspection',
      'Motor rewinding where required',
      'Alignment assessment on coupled sets',
      'Control panel and protection diagnosis',
      'Performance testing after repair',
    ],
    symptoms: ['Reduced flow or pressure', 'Pump tripping on overload', 'Leaking at the seal', 'Noise or vibration', 'Motor overheating'],
    cta: 'Request Pump Inspection',
    relatedHref: '/solutions/borehole-pumps',
    relatedLabel: 'View borehole & pump services',
  },
  {
    id: 'canopies',
    title: 'Generator Canopy Fabrication',
    nav: 'Generator Canopies',
    division: 'fabrication',
    intro:
      'A canopy has to do three things at once: reduce noise, keep weather out, and still let the machine breathe. Getting the airflow wrong turns a noise solution into an overheating problem, so canopies are designed around the specific set.',
    scope: [
      'Generator dimensions and cooling-air requirement',
      'Radiator discharge and air-path design',
      'Exhaust routing and heat separation',
      'Access doors for service and refuelling',
      'Sheet thickness and structural frame',
      'Acoustic lining selection',
      'Protective finish for the installation environment',
    ],
    cta: 'Request Canopy Design & Quote',
    caveat: 'We do not quote a decibel figure without acoustic design and measurement. Noise reduction is described in terms of the design approach, not a guaranteed number.',
  },
  {
    id: 'exhaust-systems',
    title: 'Exhaust System Fabrication',
    nav: 'Exhaust Systems',
    division: 'fabrication',
    intro:
      'An exhaust system carries hot gas safely away from people and plant. Done poorly it becomes a carbon-monoxide hazard and a source of back pressure that costs the engine power.',
    scope: [
      'Exhaust piping, bends and supports',
      'Flexible connections to isolate engine movement',
      'Silencer selection and mounting',
      'Wall and roof penetrations',
      'Rain caps and safe discharge routing',
      'Thermal insulation and personnel guarding',
      'Back-pressure consideration in the routing design',
    ],
    cta: 'Request Exhaust-System Assessment',
    caveat: 'Exhaust routing must account for heat, fumes, back pressure, nearby occupants and combustible materials. We assess the plant room, not just the pipe run.',
  },
  {
    id: 'fuel-tanks',
    title: 'Diesel Fuel Storage Tanks',
    nav: 'Fuel Tanks',
    division: 'fabrication',
    intro:
      'Fuel storage determines how long a set runs unattended, and it is the part of an installation most often changed after commissioning. It is also where fire and environmental requirements apply most directly.',
    scope: [
      'Bulk, day and base tanks',
      'Bunded containment arrangements',
      'Tank supports and structural frames',
      'Fill, vent, suction and return connections',
      'Drain and inspection points',
      'Level indication provisions',
      'Protective coating for the installation environment',
    ],
    cta: 'Request Fuel-Tank Quotation',
    caveat: 'Capacity, material, structural support, containment and ventilation are assessed against the site before fabrication begins.',
  },
  {
    id: 'fuel-automation',
    title: 'Fuel-Tank Automation & Monitoring',
    nav: 'Fuel Automation',
    division: 'fabrication',
    intro:
      'Automating fuel transfer removes the two most common diesel problems on a standby installation: a day tank that runs dry, and a bulk tank nobody notices is empty until the set stops.',
    scope: [
      'Level monitoring with high and low alarms',
      'Automatic transfer from bulk to day tank',
      'Transfer pump start/stop control with manual override',
      'Overflow protection',
      'Bund or leak alarm where specified',
      'Consumption monitoring for the generator',
      'Control panel indication',
      'Remote alerts by GSM or network where available',
      'Event and alarm history',
    ],
    cta: 'Discuss Fuel Automation',
    relatedHref: '/solutions/diesel-automation',
    relatedLabel: 'View diesel automation',
    caveat: 'Only the monitoring functions specified and supplied for your project are provided — the list above is the available scope, not a standard package.',
  },
  {
    id: 'plinths',
    title: 'Generator Plinths & Foundations',
    nav: 'Generator Plinths',
    division: 'fabrication',
    intro:
      'The plinth carries the machine, controls its vibration and keeps it clear of water. It is designed from the actual generator weight and footprint and the actual ground conditions.',
    scope: [
      'Site measurement and ground assessment',
      'Generator weight and footprint confirmation',
      'Reinforced concrete base design and construction',
      'Anchoring and anti-vibration mounting provisions',
      'Drainage and water clearance',
      'Cable and conduit entry provisions',
      'Access clearance for service and refuelling',
    ],
    cta: 'Request Plinth Assessment',
    caveat: 'There is no universal plinth size. Every foundation is designed for the specific set and site — we will not quote one from a photograph.',
  },
  {
    id: 'security-cages',
    title: 'Generator Security Cages',
    nav: 'Security Cages',
    division: 'fabrication',
    intro:
      'Outdoor generators and their fuel systems are theft targets. A cage protects the asset without becoming a new problem — provided it does not choke the machine.',
    scope: [
      'Welded steel construction to suit the site',
      'Lockable access doors',
      'Ventilation allowance sized to the cooling requirement',
      'Maintenance and refuelling access',
      'Weather-resistant finish',
      'Anchoring and anti-tamper detailing',
      'Provision for fuel and electrical connections',
    ],
    cta: 'Request Security-Cage Quote',
    caveat: 'A cage must never obstruct radiator airflow, exhaust discharge or maintenance access — that is designed in, not worked around afterwards.',
  },
  {
    id: 'hammer-mills',
    title: 'Hammer Mill Fabrication & Repairs',
    nav: 'Hammer Mills',
    division: 'machinery',
    intro:
      'Hammer mills are specified from what they must process and what output is required. The same frame with the wrong screen, hammer or motor gives the wrong product at the wrong rate.',
    scope: [
      'Frame and grinding chamber fabrication',
      'Rotor assessment and hammer replacement',
      'Screen selection for the required output size',
      'Bearings, bearing housings and shaft repair',
      'Belt, pulley and drive arrangement',
      'Motor mounting and alignment',
      'Feed hopper and discharge arrangement',
      'Safety guarding',
    ],
    cta: 'Request Hammer Mill Assessment',
    caveat: 'Specification requires the material, target output size, expected capacity, available motor power, duty cycle and feeding method. We do not publish capacity figures that have not been established for your machine.',
  },
  {
    id: 'industrial-grinders',
    title: 'Industrial Grinder Fabrication',
    nav: 'Industrial Grinders',
    division: 'machinery',
    intro:
      'Size-reduction equipment is built to a defined duty. The material, the target particle size and the throughput determine the machine — not the other way round.',
    scope: [
      'Fabrication and repair for defined industrial applications',
      'Construction material selected for the process',
      'Drive and motor arrangement to the available supply',
      'Guarding and safety interlocks',
      'Feed and discharge design',
      'Installation and commissioning support',
    ],
    cta: 'Discuss Grinder Requirements',
    caveat: 'We do not fabricate or quote machinery from a photograph alone. Material, output size, throughput, operating hours and electrical supply are required first.',
  },
];

export const WORKSHOP_PROCESS = [
  { n: 1, title: 'Initial enquiry', body: 'You send photographs of the equipment and its nameplate, the brand, model and serial number where available, a description of the fault, your location and any previous repair history.' },
  { n: 2, title: 'Receipt or site assessment', body: 'The component is delivered to our workshop, collected where arrangements are available, sent through an agreed courier or transport provider, or assessed at your site where the work needs field attendance.' },
  { n: 3, title: 'Inspection and diagnosis', body: 'Technicians establish the probable cause of failure, the parts required, whether the item is repairable, any safety concerns, and whether replacement would be more economical than repair.' },
  { n: 4, title: 'Written quotation', body: 'You receive the repair scope and quotation in writing. Major work does not proceed until you have approved it.' },
  { n: 5, title: 'Repair, rebuild or fabrication', body: 'The approved work is carried out with the appropriate materials, procedures and quality checks for the component.' },
  { n: 6, title: 'Testing and handover', body: 'Functional, electrical, pressure or load testing as applicable, with a summary of the work done and the parts replaced, then collection or dispatch by the agreed route.' },
];

export const WORKSHOP_FAQS = [
  { q: 'Can I send a generator component from another county?', a: 'Yes. Components are regularly sent to us from across Kenya by courier, bus or matatu parcel service. Agree the route, packaging and cost with us before dispatch so the item arrives safely and we know to expect it.' },
  { q: 'Do you repair all generator brands?', a: 'We work across the common industrial diesel brands including Cummins, Perkins, Caterpillar, Volvo, Lister Petter, Iveco and others. Whether a specific component is repairable depends on its condition and parts availability, which we confirm at inspection.' },
  { q: 'Do you inspect equipment before giving a final repair price?', a: 'Yes. A meaningful price is only possible after inspection. We charge a site survey and diagnostic fee for the inspection, and the full fee is deducted from the contract when the work is awarded to us.' },
  { q: 'Can you collect equipment from our premises?', a: 'Collection can be arranged in some cases depending on the item, the location and the schedule. Ask when you enquire and we will tell you what is practical for your site rather than promising in advance.' },
  { q: 'Do you repair both charging alternators and generator alternators?', a: 'Yes, and they are different machines. The charging alternator keeps the starting batteries up; the generator end produces your output. We identify which has failed before quoting, because the work and the cost differ substantially.' },
  { q: 'Can you rewind an alternator or electric motor?', a: 'Rewinding is offered where it is technically sound and economically sensible. On some smaller machines a replacement costs less than a rewind, and we will say so.' },
  { q: 'Can every injector, pump or turbocharger be repaired?', a: 'No. Some components are beyond economic repair, and we tell you that at inspection rather than after starting work. Where replacement is the better outcome we recommend it.' },
  { q: 'Do repaired items receive testing before dispatch?', a: 'Yes, where the equipment and available test facilities allow — functional, electrical, pressure or no-load testing as applicable to the component. The testing done is stated in the handover summary.' },
  { q: 'Can you fabricate a canopy for an existing generator?', a: 'Yes. The canopy is designed around your machine, its cooling-air requirement and exhaust routing. We do not quote a guaranteed noise figure without acoustic design and measurement.' },
  { q: 'Can you automate an existing diesel fuel tank?', a: 'Yes. Level monitoring, alarms, automatic bulk-to-day transfer and consumption monitoring can be added to existing tanks. The functions supplied are specified per project.' },
  { q: 'Do you construct generator plinths at the customer site?', a: 'Yes. The plinth is designed from the actual generator weight and footprint and the ground conditions at your site. There is no universal size.' },
  { q: 'Can you design a hammer mill for a particular product?', a: 'Yes, provided you can tell us the material, the output size you need, the throughput expected, the motor power available and how the machine will be fed. Those determine the design.' },
  { q: 'Do you repair UPS systems and battery banks?', a: 'Yes. We diagnose the UPS and the battery bank together, since a serviceable UPS with an exhausted battery bank still fails when mains drops. Repair viability is confirmed after diagnosis.' },
  { q: 'Can repaired components be returned through a courier?', a: 'Yes. Return is by the route agreed with you — courier, bus or matatu parcel, or your own transporter. We confirm the channel and cost before dispatch and tell you when the item has gone.' },
  { q: 'What information should I send before requesting a quotation?', a: 'Photographs of the equipment and its nameplate, the brand and model, the serial number, a description of the symptoms, whether the machine still runs, your county and town, and any recent repair history.' },
];
