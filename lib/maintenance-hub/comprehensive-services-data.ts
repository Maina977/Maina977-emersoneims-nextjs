/**
 * WORLD'S MOST COMPREHENSIVE MAINTENANCE SERVICES DATA
 * Complete detailed information for all maintenance services
 *
 * Each service includes:
 * - 5+ paragraph comprehensive descriptions
 * - Detailed sub-services with benefits
 * - Complete troubleshooting guides
 * - Safety procedures
 * - Tools and equipment lists
 * - Industry applications
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ComprehensiveService {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  tagline: string;
  statistics: {
    projectsCompleted: string;
    clientsSatisfied: string;
    yearsExperience: string;
    expertTechnicians: string;
  };
  overview: {
    introduction: string;
    importance: string;
    ourApproach: string;
    expertise: string;
    commitment: string;
  };
  technicalCapabilities: {
    title: string;
    description: string;
    capabilities: string[];
  };
  subServices: ComprehensiveSubService[];
  commonProblems: ComprehensiveProblem[];
  safetyGuidelines: ComprehensiveSafetyGuideline[];
  toolsAndEquipment: ComprehensiveTool[];
  industryApplications: IndustryApplication[];
  maintenanceSchedule: MaintenanceTask[];
  qualityStandards: string[];
  certifications: string[];
  warranty: {
    standard: string;
    extended: string;
    conditions: string[];
  };
  pricingTiers: PricingTier[];
  faqs: FAQ[];
}

export interface ComprehensiveSubService {
  name: string;
  icon: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  process: string[];
  duration: string;
  priceRange: string;
}

export interface ComprehensiveProblem {
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  symptoms: string[];
  causes: string[];
  diagnosis: string;
  solution: string;
  detailedProcedure: string[];
  prevention: string[];
  estimatedTime: string;
  estimatedCost: string;
  requiredTools: string[];
  warningNote?: string;
}

export interface ComprehensiveSafetyGuideline {
  title: string;
  icon: string;
  priority: 'Critical' | 'High' | 'Medium';
  overview: string;
  detailedGuidance: string;
  procedures: string[];
  ppe: string[];
  emergencyProcedures: string[];
  commonViolations: string[];
}

export interface ComprehensiveTool {
  name: string;
  category: string;
  purpose: string;
  specifications: string;
  importance: 'Essential' | 'Recommended' | 'Optional';
  priceRange: string;
}

export interface IndustryApplication {
  industry: string;
  icon: string;
  description: string;
  specificNeeds: string[];
  caseStudy?: string;
}

export interface MaintenanceTask {
  frequency: string;
  tasks: string[];
  responsible: string;
  notes: string;
}

export interface PricingTier {
  name: string;
  priceRange: string;
  includes: string[];
  turnaround: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATOR SERVICES - COMPREHENSIVE DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const GENERATOR_SERVICE: ComprehensiveService = {
  id: 'generator',
  name: 'Generator Services',
  icon: '⚡',
  iconBg: 'from-blue-500 to-indigo-600',
  tagline: 'Complete Generator Maintenance, Repair & Installation Solutions',
  statistics: {
    projectsCompleted: '15,000+',
    clientsSatisfied: '5,000+',
    yearsExperience: '20+',
    expertTechnicians: '50+'
  },
  overview: {
    introduction: `Generators are the lifeline of modern businesses and residences in Kenya, providing essential backup power during the frequent utility outages that can disrupt operations and daily life. Our comprehensive generator services cover every aspect of generator ownership - from initial consultation and proper sizing, through professional installation, ongoing preventive maintenance, emergency repairs, and eventual replacement. With over two decades of experience serving Kenya's diverse power needs, we understand that each generator application is unique and requires tailored solutions.

Our team of factory-trained technicians brings expertise across all major generator brands including Cummins, Caterpillar, Perkins, FG Wilson, SDMO, Kohler, Generac, and many others. Whether you operate a small 5kVA residential standby unit or a large 2000kVA industrial powerhouse, our technicians have the knowledge, tools, and parts access to keep your generator running reliably. We maintain strategic partnerships with original equipment manufacturers, ensuring access to genuine parts and the latest technical information.`,

    importance: `The importance of reliable generator service cannot be overstated in Kenya's challenging power environment. A generator that fails to start during a power outage can result in massive financial losses - spoiled inventory in cold storage, lost production in manufacturing, disrupted medical procedures in healthcare facilities, or frustrated guests in hospitality. The cost of proper generator maintenance is minimal compared to the cost of a single failure event.

Beyond reliability, proper generator service affects safety, fuel efficiency, environmental compliance, and equipment longevity. A poorly maintained generator can produce dangerous carbon monoxide levels, consume excessive fuel, emit pollutants beyond regulatory limits, and fail prematurely. Our service programs address all these aspects, providing comprehensive care that protects your investment and ensures dependable backup power whenever you need it.`,

    ourApproach: `Our approach to generator service begins with understanding your specific needs and operating environment. We conduct thorough site assessments to evaluate load requirements, fuel access, ventilation, noise considerations, and regulatory requirements. This information guides our recommendations for equipment selection, installation design, and maintenance scheduling.

We believe in proactive maintenance rather than reactive repair. Our preventive maintenance programs are designed to identify and address potential problems before they cause failures. Each service visit includes comprehensive inspections, testing, and documentation that creates a complete service history for your generator. This systematic approach minimizes unexpected breakdowns and maximizes generator lifespan.`,

    expertise: `Our technical expertise spans all aspects of generator technology - diesel engines, gas engines, alternators, automatic transfer switches, control systems, and associated accessories. We maintain in-house training programs that keep our technicians current with evolving technology, including the increasingly sophisticated electronic control systems that manage modern generators.

Our diagnostic capabilities include advanced tools such as exhaust gas analyzers, load banks for performance testing, insulation testers, vibration analyzers, and oil analysis services. These tools enable accurate diagnosis of developing problems and verification of repair effectiveness. Our Generator Oracle system provides instant access to fault codes and troubleshooting procedures for thousands of generator models.`,

    commitment: `Our commitment to service excellence is reflected in our response times, quality standards, and customer satisfaction ratings. We maintain 24/7 emergency response capability with stocked service vehicles that can address most common problems on the first visit. Our quality management system ensures consistent service delivery and continuous improvement.

We stand behind our work with comprehensive warranties on parts and labor. Our goal is not just to fix generators, but to build long-term partnerships with clients who value reliable backup power. Many of our customers have trusted us with their generator service for decades, and their continued loyalty is the best testament to our service quality.`
  },
  technicalCapabilities: {
    title: 'Technical Capabilities',
    description: 'Our generator service capabilities span the full range of equipment sizes, brands, and applications.',
    capabilities: [
      'Diesel generator service: 5kVA to 3000kVA, all major manufacturers',
      'Gas generator service: Natural gas and propane powered units',
      'Automatic Transfer Switch (ATS) installation and service',
      'Paralleling switchgear for multiple generator systems',
      'Remote monitoring system installation and support',
      'Load bank testing for verification of full-load capability',
      'Engine overhaul and rebuilding services',
      'Alternator rewinding and repair',
      'Control system upgrades and retrofits',
      'Fuel system cleaning and polishing',
      'Exhaust system modifications and upgrades',
      'Sound attenuation and enclosure work',
      'Emissions compliance modifications',
      'Rental generator provision during major repairs'
    ]
  },
  subServices: [
    {
      name: 'Generator Installation',
      icon: '🔧',
      description: 'Complete professional installation of new generators with all associated equipment.',
      detailedDescription: `Professional generator installation involves much more than simply placing a generator and connecting wires. A proper installation begins with careful site preparation including foundations, fuel supply provisions, exhaust routing, and ventilation design. Our installation process ensures your generator will operate safely, efficiently, and reliably for its intended lifespan.

We handle all aspects of installation including civil works coordination, electrical connections to your distribution system, automatic transfer switch installation, fuel tank placement and piping, exhaust system installation, and control system configuration. Our installations comply with all relevant Kenya Power requirements, local regulations, and manufacturer specifications.

After physical installation, we perform comprehensive commissioning including control system programming, protection relay settings, load testing, and customer training. You receive complete documentation including as-built drawings, test certificates, and operation manuals. Our installations are backed by a 12-month workmanship warranty.`,
      benefits: [
        'Turnkey project management',
        'Compliance with all regulations',
        'Proper sizing for your load',
        'Integration with existing systems',
        'Complete documentation package',
        'Staff training included',
        '12-month installation warranty'
      ],
      process: [
        'Site survey and load analysis',
        'System design and quotation',
        'Equipment procurement',
        'Site preparation and civil works',
        'Generator placement and securing',
        'Electrical and fuel connections',
        'ATS installation and programming',
        'Testing and commissioning',
        'Documentation and handover',
        'Staff training'
      ],
      duration: '3-14 days depending on complexity',
      priceRange: 'KES 50,000 - 1,500,000'
    },
    {
      name: 'Preventive Maintenance',
      icon: '🛡️',
      description: 'Scheduled maintenance programs to ensure reliable operation and long equipment life.',
      detailedDescription: `Preventive maintenance is the foundation of generator reliability. Our maintenance programs are designed around manufacturer recommendations and our extensive experience with generators in Kenya's operating conditions. Regular maintenance identifies developing problems before they cause failures, ensuring your generator is ready when you need it.

Our standard maintenance visits include comprehensive inspections, fluid checks and changes, filter replacements, battery service, control system checks, and operational testing. We adjust service intervals based on your operating hours, environment, and criticality. High-use and critical applications receive more frequent attention.

Every maintenance visit is documented in detail, creating a complete service history that aids troubleshooting, supports warranty claims, and demonstrates due diligence for compliance purposes. Our technicians provide recommendations for any needed repairs or upgrades identified during maintenance.`,
      benefits: [
        'Maximum reliability',
        'Extended equipment life',
        'Optimized fuel efficiency',
        'Early problem detection',
        'Complete service records',
        'Priority emergency response',
        'Budget predictability'
      ],
      process: [
        'Arrival and safety setup',
        'Visual inspection of all systems',
        'Fluid level checks and sampling',
        'Filter inspection and replacement',
        'Battery testing and service',
        'Belt and hose inspection',
        'Control system testing',
        'Operational run test',
        'Documentation and report',
        'Recommendations review'
      ],
      duration: '2-4 hours per visit',
      priceRange: 'KES 8,000 - 45,000 per visit'
    },
    {
      name: 'Emergency Repair',
      icon: '🚨',
      description: '24/7 emergency response for generator breakdowns when backup power is critical.',
      detailedDescription: `Generator emergencies don't wait for convenient times - they often occur during utility outages when backup power is needed most. Our emergency repair service provides rapid response around the clock to get your generator running as quickly as possible.

Our service vehicles carry common spare parts and diagnostic equipment, enabling many repairs to be completed on the first visit. For more complex problems requiring parts not in stock, we provide temporary solutions where possible and expedite parts procurement.

Emergency service includes rapid fault diagnosis, immediate repair where feasible, clear communication about status and timeline, and follow-up to ensure lasting repair. We prioritize based on criticality - hospitals, data centers, and other critical facilities receive priority response.`,
      benefits: [
        '24/7 availability',
        '2-4 hour response time',
        'Stocked service vehicles',
        'Experienced emergency technicians',
        'Temporary solutions when needed',
        'Critical facility priority'
      ],
      process: [
        'Emergency call received',
        'Initial phone troubleshooting',
        'Technician dispatch',
        'Arrival and assessment',
        'Diagnosis and repair plan',
        'Immediate repair if possible',
        'Parts ordering if needed',
        'Follow-up repair completion',
        'System verification',
        'Documentation'
      ],
      duration: 'Same-day response, repair time varies',
      priceRange: 'KES 15,000 - 150,000'
    },
    {
      name: 'Load Bank Testing',
      icon: '📊',
      description: 'Full-load testing to verify generator capability and identify hidden problems.',
      detailedDescription: `Many generator problems only appear under load, and a generator that has only been tested at no-load or light-load may fail when asked to carry full load during an outage. Load bank testing applies a controlled resistive load to verify the generator can produce its rated output and identify any problems that only manifest under load.

Load bank testing is particularly important for standby generators that rarely run at significant load. Without regular full-load operation, carbon buildup can occur in the engine, injectors can clog, and cooling system problems may go undetected. Annual load bank testing exercises all systems and verifies readiness.

Our load bank testing includes monitoring of all key parameters including voltage, frequency, power output, fuel consumption, exhaust temperature, coolant temperature, and oil pressure. We provide a detailed test report documenting all measurements and any issues identified.`,
      benefits: [
        'Verify rated capacity',
        'Identify hidden problems',
        'Exercise all systems',
        'Burn off carbon deposits',
        'Detailed test report',
        'Compliance documentation'
      ],
      process: [
        'Connect load bank equipment',
        'Instrument setup',
        'Gradual load application (25/50/75/100%)',
        'Parameter monitoring',
        'Full load sustained run',
        'Gradual load reduction',
        'Cool-down period',
        'Data analysis',
        'Report preparation'
      ],
      duration: '3-6 hours',
      priceRange: 'KES 25,000 - 75,000'
    },
    {
      name: 'ATS Service',
      icon: '🔄',
      description: 'Installation, maintenance, and repair of Automatic Transfer Switches.',
      detailedDescription: `The Automatic Transfer Switch (ATS) is the critical link between your generator and your electrical system. It monitors utility power, starts the generator when utility fails, transfers the load to the generator, and reverses the process when utility returns. ATS failure means your generator cannot supply power even if it's running perfectly.

Our ATS services cover all types of transfer switches from simple residential units to sophisticated paralleling switchgear. We install new ATS equipment, maintain existing installations, and repair failed units. Our technicians understand both the mechanical transfer mechanism and the electronic control systems.

Regular ATS maintenance ensures reliable transfer when needed. We test the complete transfer sequence, inspect contacts for wear, verify timing settings, and test safety interlocks. For older mechanical ATS units, we can provide control system upgrades that improve reliability and add features like remote monitoring.`,
      benefits: [
        'Reliable automatic transfer',
        'All ATS types serviced',
        'Contact inspection and maintenance',
        'Control system testing',
        'Safety interlock verification',
        'Upgrade options available'
      ],
      process: [
        'Visual inspection',
        'Contact condition assessment',
        'Control system testing',
        'Transfer timing verification',
        'Safety interlock testing',
        'Utility sensing verification',
        'Generator start signal testing',
        'Manual transfer testing',
        'Documentation'
      ],
      duration: '2-4 hours',
      priceRange: 'KES 12,000 - 65,000'
    },
    {
      name: 'Engine Overhaul',
      icon: '⚙️',
      description: 'Complete engine rebuilding to restore like-new performance.',
      detailedDescription: `After many years or thousands of hours of operation, generator engines eventually wear to the point where performance degrades and reliability declines. Engine overhaul restores the engine to like-new condition, extending generator service life by many more years at a fraction of replacement cost.

Our engine overhaul services range from top-end work (head gasket, valve job) to complete rebuilds (pistons, liners, bearings, and all seals). We use OEM or OEM-equivalent parts and follow manufacturer rebuild procedures. Overhauled engines are tested and broken-in before return to service.

We can perform overhauls in our workshop or in-place at your site depending on the engine size and application. Either way, you receive a fully rebuilt engine with documented specifications and warranty coverage.`,
      benefits: [
        'Restored performance',
        'Extended equipment life',
        'Lower cost than replacement',
        'OEM-quality parts',
        'Workshop or on-site service',
        'Warranty coverage'
      ],
      process: [
        'Pre-overhaul assessment',
        'Engine removal if needed',
        'Disassembly and inspection',
        'Parts ordering',
        'Machine work as needed',
        'Reassembly with new parts',
        'Run-in and testing',
        'Installation and commissioning',
        'Documentation'
      ],
      duration: '5-15 days',
      priceRange: 'KES 150,000 - 1,500,000'
    },
    {
      name: 'Fuel System Service',
      icon: '⛽',
      description: 'Fuel tank cleaning, fuel polishing, and injection system service.',
      detailedDescription: `Fuel quality is critical for diesel generator reliability. Over time, diesel fuel degrades, absorbs water, and supports biological growth that can clog filters and damage injection systems. Fuel system service maintains fuel quality and ensures reliable fuel delivery.

Fuel tank cleaning removes water, sediment, and biological growth from storage tanks. Fuel polishing filters and treats fuel to remove contaminants. Injection system service includes injector cleaning, testing, and calibration to ensure proper fuel delivery and combustion.

We recommend annual fuel quality testing and tank inspection for all generators. High-use generators may need more frequent attention. Poor fuel quality is one of the leading causes of generator starting and running problems.`,
      benefits: [
        'Clean fuel supply',
        'Reliable starting',
        'Reduced filter costs',
        'Protected injection system',
        'Improved combustion',
        'Lower emissions'
      ],
      process: [
        'Fuel sampling and testing',
        'Tank inspection',
        'Water and sediment removal',
        'Fuel polishing',
        'Tank treatment',
        'Filter replacement',
        'Injector service',
        'System testing'
      ],
      duration: '4-8 hours',
      priceRange: 'KES 15,000 - 85,000'
    },
    {
      name: 'Control System Service',
      icon: '🖥️',
      description: 'Programming, calibration, and repair of generator control systems.',
      detailedDescription: `Modern generators rely on sophisticated electronic control systems for starting, speed regulation, voltage regulation, protection, and monitoring. These systems require proper configuration and periodic maintenance to function correctly.

Our control system services include initial programming and configuration, parameter adjustment, firmware updates, fault diagnosis, and component replacement. We work with all major control system manufacturers including Deep Sea Electronics, ComAp, Woodward, and OEM-specific systems.

For older generators with outdated or failing control systems, we can provide complete control system upgrades that add modern features like remote monitoring, automatic exercising, and improved protection while maintaining compatibility with existing generator components.`,
      benefits: [
        'Proper system configuration',
        'All major brands supported',
        'Firmware updates',
        'Remote monitoring setup',
        'Upgrade options',
        'Complete documentation'
      ],
      process: [
        'System assessment',
        'Parameter review',
        'Adjustment as needed',
        'Protection testing',
        'Firmware update if available',
        'Remote access setup',
        'Documentation'
      ],
      duration: '2-6 hours',
      priceRange: 'KES 8,000 - 95,000'
    }
  ],
  commonProblems: [
    {
      title: 'Generator Fails to Start',
      severity: 'Critical',
      symptoms: [
        'No cranking when start signal given',
        'Cranks but does not fire',
        'Fires intermittently but will not run',
        'Starts but immediately stops',
        'Error code displayed on controller'
      ],
      causes: [
        'Dead or weak batteries',
        'No fuel or contaminated fuel',
        'Air in fuel system',
        'Failed glow plugs (diesel)',
        'Faulty starter motor',
        'Control system fault',
        'Safety shutdown activated'
      ],
      diagnosis: `Start diagnosis by checking the obvious - battery voltage and fuel level. A battery should show at least 12.4V (24.8V for 24V systems) and crank the engine briskly. If cranking is slow or absent, charge or replace batteries.

If batteries are good but no cranking occurs, check for control system faults or safety lockouts. Review the controller display for fault codes. Common lockouts include low oil pressure, high temperature, overcrank, and emergency stop.

If the engine cranks but doesn't start, fuel delivery is the most common culprit. Check for fuel at the injection pump by cracking a fitting. If no fuel flows, the problem is upstream - empty tank, closed valve, clogged filter, or failed lift pump. If fuel is present, glow plug operation (diesel) or spark (gas) is suspect.`,
      solution: 'The solution depends on the identified cause. Battery issues require charging or replacement. Fuel issues require bleeding air, replacing filters, or repairing supply problems. Control issues require fault clearing and possibly component replacement.',
      detailedProcedure: [
        'Check battery voltage with multimeter - minimum 12.4V (24.8V for 24V)',
        'Verify fuel level in tank and day tank if equipped',
        'Check controller display for fault codes',
        'If no fault codes, check emergency stop status',
        'If batteries are weak, charge or jump start and test',
        'If no fuel, trace supply from tank forward',
        'Bleed air from fuel system if fuel was depleted',
        'Test glow plug operation - should draw current for 15-30 seconds',
        'Check starter operation - should spin engine 150-300 RPM',
        'If all basics check out, deeper diagnosis required'
      ],
      prevention: [
        'Monthly exercise run under load',
        'Regular battery testing and maintenance',
        'Keep fuel tank at least half full',
        'Replace fuel filters on schedule',
        'Annual comprehensive service'
      ],
      estimatedTime: '30 minutes - 4 hours',
      estimatedCost: 'KES 2,000 - 50,000',
      requiredTools: ['Multimeter', 'Fuel pressure gauge', 'Bleeding kit', 'Battery tester'],
      warningNote: 'Never bypass safety systems to force a start. The safety is protecting something.'
    },
    {
      title: 'Generator Shuts Down Under Load',
      severity: 'High',
      symptoms: [
        'Generator stops suddenly while running',
        'Load transfer fails',
        'Shutdown alarm sounds',
        'Hot engine or low oil indication',
        'Overload indication'
      ],
      causes: [
        'Overloading beyond rated capacity',
        'Overheating - cooling system problem',
        'Low oil pressure',
        'Fuel starvation',
        'Governor or speed control fault',
        'Voltage regulator failure',
        'Protection relay trip'
      ],
      diagnosis: `When a generator shuts down under load, the first step is to identify which protection triggered the shutdown. Most controllers log the cause - check the fault history. Common protective shutdowns include overcurrent/overload, high temperature, low oil pressure, over/under voltage, and over/under frequency.

If the shutdown was overload-related, compare the actual load to generator rating. Transient loads like motor starting can momentarily exceed steady-state capacity. If loading is within rating, the problem may be fuel restriction, turbo failure, or engine derating due to altitude or temperature.

High temperature shutdowns indicate cooling system problems - check coolant level, radiator condition, belt, water pump, and thermostat. Low oil pressure requires immediate attention - do not restart until cause is determined.`,
      solution: 'Address the specific cause of shutdown. Reduce load if overloaded. Repair cooling system if overheating. Investigate low oil pressure before any restart attempt.',
      detailedProcedure: [
        'Check controller for shutdown reason',
        'If overload: Measure actual load vs rating',
        'If high temperature: Check coolant level, fan, radiator',
        'If low oil pressure: DO NOT restart - investigate cause',
        'If fuel related: Check supply, filters, air in system',
        'Reset fault only after addressing cause',
        'Test at partial load first',
        'Monitor parameters closely during load test',
        'If shutdown repeats, more investigation needed'
      ],
      prevention: [
        'Proper load management',
        'Regular cooling system maintenance',
        'Oil level checks',
        'Fuel quality maintenance',
        'Load bank testing to verify capacity'
      ],
      estimatedTime: '1 - 6 hours',
      estimatedCost: 'KES 5,000 - 85,000',
      requiredTools: ['Clamp meter', 'Temperature gun', 'Pressure gauges', 'Fuel testing equipment']
    },
    {
      title: 'Excessive Smoke',
      severity: 'Medium',
      symptoms: [
        'Black smoke from exhaust',
        'White or gray smoke',
        'Blue smoke',
        'Smoke at startup that clears',
        'Continuous smoking under load'
      ],
      causes: [
        'Black smoke: Incomplete combustion, overload, restricted air',
        'White smoke: Water in combustion, low temperature, timing',
        'Blue smoke: Oil burning in cylinders',
        'Air filter restriction',
        'Injector problems',
        'Turbocharger failure',
        'Engine wear'
      ],
      diagnosis: `Smoke color provides important diagnostic information. Black smoke indicates incomplete combustion - fuel is present but not burning completely. This is often caused by air restriction (clogged filter), overloading, or faulty injectors. Check air filter first, then loading.

White or gray smoke indicates either water entering combustion (head gasket, cracked head) or unburned fuel (cold operation, timing). White smoke at startup that clears quickly is often normal. Continuous white smoke warrants investigation.

Blue smoke indicates oil burning in the cylinders. This can come from worn piston rings, valve seals, or turbo seals. Some blue smoke at startup that clears is tolerable; continuous blue smoke indicates significant oil consumption.`,
      solution: 'Address the specific cause based on smoke color. Black smoke usually requires air or fuel system service. White smoke may indicate cooling system problems. Blue smoke indicates internal engine wear.',
      detailedProcedure: [
        'Observe smoke color and when it occurs',
        'For black smoke: Check air filter first, then loading',
        'Check injectors for proper spray pattern',
        'Verify turbocharger boost pressure',
        'For white smoke: Check coolant level trend',
        'Test for combustion gases in coolant',
        'For blue smoke: Check oil consumption rate',
        'Compression test may be needed',
        'Consider professional diagnosis for persistent smoke'
      ],
      prevention: [
        'Regular air filter replacement',
        'Proper loading - avoid extended light load',
        'Coolant system maintenance',
        'Oil analysis to track consumption',
        'Regular injector service'
      ],
      estimatedTime: '2 - 8 hours',
      estimatedCost: 'KES 5,000 - 150,000',
      requiredTools: ['Smoke opacity meter', 'Compression tester', 'Injector tester', 'Boost gauge']
    },
    {
      title: 'Battery Won\'t Charge',
      severity: 'High',
      symptoms: [
        'Low battery alarm',
        'Batteries fail to crank engine',
        'Battery voltage low on controller',
        'Charger fault indicated',
        'Batteries getting hot during charge'
      ],
      causes: [
        'Failed battery charger',
        'Batteries beyond service life',
        'Loose or corroded connections',
        'Parasitic drain when off',
        'Alternator not charging during run',
        'Incorrect charger settings'
      ],
      diagnosis: `Start by measuring battery voltage - healthy batteries should show 12.6-12.8V per 12V battery when fully charged. Measure charger output - it should be 13.5-14.5V for float charging. If charger output is correct but batteries don't charge, the batteries may be failed.

Load test batteries to verify capacity. A battery can show correct voltage but fail under load. Most batteries fail gradually, losing capacity until they can no longer crank the engine reliably.

Check all connections from charger to batteries to starter. Loose or corroded connections cause voltage drop and poor charging. Clean and tighten all connections as part of diagnosis.`,
      solution: 'Repair or replace charger if faulty. Replace batteries if aged or failed. Clean and secure all connections.',
      detailedProcedure: [
        'Measure battery voltage',
        'Measure charger output voltage',
        'Check connections for tightness and corrosion',
        'Load test batteries',
        'Check for parasitic drains',
        'Verify charger settings',
        'If charger is faulty, repair or replace',
        'If batteries are weak, replace set',
        'Clean and protect connections',
        'Verify charging and cranking after repairs'
      ],
      prevention: [
        'Monthly battery voltage checks',
        'Keep terminals clean and protected',
        'Replace batteries every 3-4 years proactively',
        'Verify charger operation during maintenance',
        'Test cranking during monthly exercise'
      ],
      estimatedTime: '1 - 3 hours',
      estimatedCost: 'KES 5,000 - 65,000',
      requiredTools: ['Multimeter', 'Battery load tester', 'Wire brush', 'Terminal protector']
    }
  ],
  safetyGuidelines: [
    {
      title: 'Electrical Safety',
      icon: '⚡',
      priority: 'Critical',
      overview: 'Generators produce lethal voltages that demand respect. Proper electrical safety procedures prevent electrocution and arc flash injuries.',
      detailedGuidance: `Generators typically produce 240V or 415V depending on configuration - voltages that can easily cause fatal electrocution. The electrical hazards are present not only at the generator output but also at the automatic transfer switch, distribution equipment, and any connected circuits. Always assume electrical components are energized unless you have personally verified they are de-energized and applied lockout/tagout.

Arc flash is a serious hazard when working on generator electrical systems. An arc flash can produce temperatures exceeding 20,000°C and explosive pressure waves. The risk is highest when working on live equipment or when energizing equipment after maintenance. Use appropriate PPE including arc-rated clothing when working where arc flash hazard exists.

Backfeed is a life-threatening hazard that occurs when a generator energizes supposedly de-energized utility lines. This can kill utility workers and others who assume lines are dead. Automatic transfer switches normally prevent backfeed, but manual connections or failed interlocks can create backfeed conditions. Always verify ATS operation and interlock integrity.`,
      procedures: [
        'De-energize equipment before working on electrical components',
        'Use lockout/tagout procedures on all power sources',
        'Verify zero energy state with testing',
        'Maintain safe approach distances to energized equipment',
        'Use insulated tools and PPE',
        'Never bypass electrical safety interlocks',
        'Verify ATS interlock operation before energizing',
        'Ground portable generators properly',
        'Know location of emergency shutoffs'
      ],
      ppe: [
        'Insulated gloves rated for voltage present',
        'Safety glasses with side shields',
        'Arc-rated clothing when arc flash hazard exists',
        'Non-conductive footwear',
        'Face shield for close work on energized equipment'
      ],
      emergencyProcedures: [
        'For electrical shock: Do NOT touch victim directly - use insulated object to separate from source',
        'Call emergency services immediately',
        'Begin CPR if victim is unresponsive',
        'For arc flash burns: Cool burns with clean water, cover with sterile dressing',
        'Report all electrical incidents regardless of injury'
      ],
      commonViolations: [
        'Working on energized equipment without proper protection',
        'Inadequate lockout/tagout',
        'Assuming equipment is de-energized without testing',
        'Bypassing safety interlocks',
        'Using improperly connected portable generators'
      ]
    },
    {
      title: 'Carbon Monoxide Safety',
      icon: '💨',
      priority: 'Critical',
      overview: 'Generators produce deadly carbon monoxide gas. Proper ventilation and CO detection prevent fatal poisoning.',
      detailedGuidance: `Carbon monoxide (CO) is a colorless, odorless gas produced by incomplete combustion in generator engines. CO poisoning can occur quickly in enclosed or poorly ventilated spaces, causing unconsciousness and death before victims realize what is happening. More people die from generator CO poisoning each year than from electrocution.

Generator exhaust contains approximately 9% CO - far above the 0.4% level that can be fatal with just a few breaths. Symptoms of CO poisoning include headache, dizziness, nausea, confusion, and unconsciousness. These symptoms can be mistaken for flu or exhaustion, leading victims to stay in the contaminated area.

Generators must be operated outdoors or in purpose-built enclosures with adequate ventilation. Indoor operation is only acceptable with proper exhaust piping to outdoors. Even outdoors, generators should be positioned so exhaust cannot enter buildings through windows, doors, or vents.`,
      procedures: [
        'Never operate generator indoors or in enclosed spaces',
        'Position generator at least 20 feet from buildings',
        'Direct exhaust away from any openings',
        'Install CO detectors in areas near generators',
        'Inspect exhaust systems for leaks regularly',
        'Ensure generator room ventilation meets requirements',
        'Never ignore CO alarm activations',
        'Train all personnel on CO dangers'
      ],
      ppe: [
        'CO monitor when working in enclosed areas',
        'Self-contained breathing apparatus for rescue'
      ],
      emergencyProcedures: [
        'If CO alarm sounds: Evacuate area immediately',
        'Do not re-enter until CO has cleared',
        'Open windows and doors to ventilate',
        'If someone is unconscious: Remove to fresh air, call emergency services',
        'Provide oxygen if available',
        'Begin CPR if needed'
      ],
      commonViolations: [
        'Operating generators indoors',
        'Inadequate ventilation in generator rooms',
        'Missing or disabled CO detectors',
        'Generator positioned too close to buildings',
        'Exhaust leaks not repaired'
      ]
    },
    {
      title: 'Fuel Safety',
      icon: '🔥',
      priority: 'High',
      overview: 'Generator fuel presents fire and explosion hazards that require careful handling and storage.',
      detailedGuidance: `Diesel fuel, while less volatile than gasoline, still presents significant fire hazards - especially around hot generator components. Fuel vapor concentrations can reach flammable levels during refueling or in areas of fuel spillage. A single spark from static discharge, electrical fault, or tool contact can ignite fuel vapors.

Fuel storage must comply with local regulations for quantity, containment, and separation from buildings and ignition sources. Large generators often have integral fuel tanks plus separate day tanks or bulk storage that require periodic inspection and maintenance.

Fuel handling requires care to prevent spills and contamination. Use approved containers for transport. Ground containers during transfer to prevent static discharge. Clean up any spills immediately. Diesel fuel soaked into absorbent materials like rags or insulation becomes a fire hazard.`,
      procedures: [
        'Never refuel a hot or running generator',
        'Use only approved fuel containers',
        'Ground containers during fuel transfer',
        'Maintain 20-foot separation from ignition sources during refueling',
        'Clean up spills immediately',
        'Store fuel in approved, labeled containers',
        'Inspect fuel systems for leaks regularly',
        'Keep fire extinguisher accessible'
      ],
      ppe: [
        'Chemical-resistant gloves',
        'Safety glasses',
        'Fire-resistant clothing when refueling'
      ],
      emergencyProcedures: [
        'For fuel fire: Use dry chemical or foam extinguisher - never water',
        'Evacuate area and call fire services for large fires',
        'For skin contact: Wash with soap and water',
        'For eye contact: Flush with water for 15 minutes',
        'For ingestion: Do not induce vomiting, seek medical attention'
      ],
      commonViolations: [
        'Refueling while generator is running',
        'Storing fuel in unapproved containers',
        'Ignoring fuel leaks',
        'Smoking near fuel handling areas',
        'Improper disposal of fuel-soaked materials'
      ]
    },
    {
      title: 'Mechanical Safety',
      icon: '⚙️',
      priority: 'High',
      overview: 'Generators contain rotating machinery and hot surfaces that can cause severe injury.',
      detailedGuidance: `The rotating components of a generator - engine flywheel, cooling fan, alternator rotor, and drive belts - can catch clothing, hair, tools, or body parts and cause severe injury including amputation. These hazards are often partially enclosed but accessible during maintenance.

Hot surfaces on generators include the exhaust manifold, turbocharger, and engine block. Surface temperatures can exceed 300°C - enough to cause severe burns on contact. Hot surfaces remain dangerous for extended periods after shutdown.

Pressure hazards exist in the cooling system, fuel system, and engine crankcase. Opening pressurized systems can result in scalding coolant spray, fuel spray, or crankcase gases. Always relieve pressure and allow cooling before opening systems.`,
      procedures: [
        'Never work on running generators except approved operations',
        'Keep guards in place over rotating components',
        'Tie back loose hair and clothing',
        'Remove jewelry when working near machinery',
        'Allow hot surfaces to cool before touching',
        'Relieve pressure before opening systems',
        'Use proper lifting equipment for heavy components',
        'Maintain adequate lighting in work areas'
      ],
      ppe: [
        'Close-fitting clothing',
        'Safety glasses',
        'Gloves for appropriate tasks',
        'Steel-toed boots',
        'Hearing protection around running generators'
      ],
      emergencyProcedures: [
        'For caught in machinery: DO NOT attempt to reverse - call for help',
        'For burns: Cool with running water, cover with sterile dressing',
        'For scalding spray: Remove contaminated clothing, cool skin',
        'Seek medical attention for any significant injury'
      ],
      commonViolations: [
        'Working on running generators unnecessarily',
        'Removing guards',
        'Loose clothing near rotating parts',
        'Rushing work on hot components',
        'Inadequate lifting procedures'
      ]
    }
  ],
  toolsAndEquipment: [
    {
      name: 'Digital Multimeter',
      category: 'Electrical Testing',
      purpose: 'Measure voltage, current, resistance, and continuity',
      specifications: 'True RMS, CAT III 600V rating minimum',
      importance: 'Essential',
      priceRange: 'KES 3,500 - 35,000'
    },
    {
      name: 'Clamp Meter',
      category: 'Electrical Testing',
      purpose: 'Measure AC/DC current without breaking the circuit',
      specifications: '400A AC/DC, True RMS',
      importance: 'Essential',
      priceRange: 'KES 5,000 - 45,000'
    },
    {
      name: 'Insulation Tester (Megger)',
      category: 'Electrical Testing',
      purpose: 'Test insulation resistance of windings and cables',
      specifications: '500V/1000V test voltage, digital display',
      importance: 'Essential',
      priceRange: 'KES 15,000 - 85,000'
    },
    {
      name: 'Battery Tester',
      category: 'Electrical Testing',
      purpose: 'Test battery condition and capacity',
      specifications: 'Load testing capability, 100A minimum',
      importance: 'Essential',
      priceRange: 'KES 8,000 - 45,000'
    },
    {
      name: 'Mechanical Oil Pressure Gauge',
      category: 'Engine Testing',
      purpose: 'Verify oil pressure independent of sensors',
      specifications: '0-100 PSI, hose and fittings kit',
      importance: 'Essential',
      priceRange: 'KES 3,500 - 15,000'
    },
    {
      name: 'Fuel Pressure Gauge',
      category: 'Engine Testing',
      purpose: 'Test fuel system pressure and flow',
      specifications: '0-100 PSI, appropriate fittings',
      importance: 'Recommended',
      priceRange: 'KES 4,500 - 25,000'
    },
    {
      name: 'Compression Tester',
      category: 'Engine Testing',
      purpose: 'Measure cylinder compression pressure',
      specifications: '0-300 PSI, diesel adapters',
      importance: 'Recommended',
      priceRange: 'KES 5,500 - 28,000'
    },
    {
      name: 'Infrared Thermometer',
      category: 'Diagnostic Tools',
      purpose: 'Non-contact temperature measurement',
      specifications: '-50 to 600°C range',
      importance: 'Essential',
      priceRange: 'KES 2,500 - 15,000'
    },
    {
      name: 'Tachometer',
      category: 'Diagnostic Tools',
      purpose: 'Measure engine and alternator speed',
      specifications: 'Contact and non-contact, RPM display',
      importance: 'Essential',
      priceRange: 'KES 3,500 - 25,000'
    },
    {
      name: 'Load Bank',
      category: 'Testing Equipment',
      purpose: 'Apply known load for capacity testing',
      specifications: 'Resistive, matched to generator capacity',
      importance: 'Recommended',
      priceRange: 'KES 150,000 - 2,500,000'
    },
    {
      name: 'Wrench Set',
      category: 'Hand Tools',
      purpose: 'Mechanical fastener work',
      specifications: 'Metric and SAE, combination and socket',
      importance: 'Essential',
      priceRange: 'KES 8,500 - 65,000'
    },
    {
      name: 'Torque Wrench',
      category: 'Hand Tools',
      purpose: 'Tighten fasteners to specification',
      specifications: 'Multiple ranges, calibrated',
      importance: 'Essential',
      priceRange: 'KES 5,500 - 45,000'
    }
  ],
  industryApplications: [
    {
      industry: 'Healthcare',
      icon: '🏥',
      description: 'Hospitals and clinics rely on generators for life-critical backup power.',
      specificNeeds: [
        'Instant transfer capability for operating rooms',
        'Extended runtime for life support equipment',
        'Multiple generator redundancy',
        'Strict maintenance compliance',
        'Emergency response priority'
      ],
      caseStudy: 'Nairobi Hospital - We maintain their 3-generator, 2000kVA paralleling system that provides backup for 500 beds including ICU and operating theaters. Our 24/7 emergency response and monthly maintenance have achieved 99.99% availability over 5 years.'
    },
    {
      industry: 'Manufacturing',
      icon: '🏭',
      description: 'Factories depend on reliable power for continuous production.',
      specificNeeds: [
        'High-capacity systems for large loads',
        'Motor starting capability',
        'Minimal production disruption',
        'Cost-effective maintenance programs',
        'Rapid breakdown response'
      ],
      caseStudy: 'Kenya Plastics Ltd - We installed and maintain three 500kVA generators with automatic paralleling. The system handles their injection molding machines and has reduced power-related downtime by 95%.'
    },
    {
      industry: 'Hospitality',
      icon: '🏨',
      description: 'Hotels and resorts need seamless backup for guest comfort.',
      specificNeeds: [
        'Silent operation for guest comfort',
        'Aesthetic integration',
        'Kitchen and cold storage priority',
        'Fast transfer for lighting',
        'Reliable operation in remote locations'
      ],
      caseStudy: 'Safari Lodge Holdings - We provide generator services to 12 lodges across Kenya, including remote Maasai Mara locations. Our preventive maintenance and parts stocking ensure reliable power even in the most challenging environments.'
    },
    {
      industry: 'Data Centers',
      icon: '💾',
      description: 'IT facilities demand the highest reliability for critical data.',
      specificNeeds: [
        'Redundant N+1 or 2N configurations',
        'UPS integration',
        'Continuous availability',
        'Advanced monitoring',
        'Regular load testing'
      ],
      caseStudy: 'TechHub Kenya - Their 100-rack data center is backed by our maintained 2x500kVA generator system with automatic failover. We conduct monthly load tests and maintain 99.999% generator availability.'
    },
    {
      industry: 'Telecommunications',
      icon: '📡',
      description: 'Cell towers and exchanges require 24/7 power for network uptime.',
      specificNeeds: [
        'Remote site capability',
        'Fuel management services',
        'Extended runtime',
        'Remote monitoring',
        'Network-wide support'
      ]
    },
    {
      industry: 'Agriculture',
      icon: '🌾',
      description: 'Farms and processing facilities need power for irrigation and storage.',
      specificNeeds: [
        'Rural service capability',
        'Irrigation pump starting',
        'Cold storage backup',
        'Seasonal loading patterns',
        'Cost sensitivity'
      ]
    }
  ],
  maintenanceSchedule: [
    {
      frequency: 'Daily (During Operation)',
      tasks: [
        'Check fuel level',
        'Check coolant level',
        'Check oil level',
        'Observe for leaks',
        'Note any unusual sounds or smells'
      ],
      responsible: 'Site personnel',
      notes: 'Quick visual inspection during operation'
    },
    {
      frequency: 'Weekly',
      tasks: [
        'Exercise generator under load (30+ minutes)',
        'Check battery voltage',
        'Verify fuel quality (water separator)',
        'Test transfer sequence',
        'Record operating hours'
      ],
      responsible: 'Site personnel',
      notes: 'Critical for standby generators'
    },
    {
      frequency: 'Monthly',
      tasks: [
        'Comprehensive visual inspection',
        'Check all fluid levels',
        'Inspect belts and hoses',
        'Test batteries under load',
        'Check coolant condition',
        'Review event logs'
      ],
      responsible: 'Service technician',
      notes: 'Can be done by trained staff or service provider'
    },
    {
      frequency: 'Quarterly',
      tasks: [
        'Change oil and filters',
        'Check fuel filters',
        'Inspect air filter',
        'Clean radiator external',
        'Verify all connections tight',
        'Test control functions'
      ],
      responsible: 'Service technician',
      notes: 'Adjust based on operating hours'
    },
    {
      frequency: 'Annually',
      tasks: [
        'Full service with all filters',
        'Load bank test',
        'Insulation resistance test',
        'Coolant analysis/change',
        'Comprehensive electrical check',
        'Safety system verification'
      ],
      responsible: 'Qualified service technician',
      notes: 'Comprehensive assessment of all systems'
    },
    {
      frequency: 'Every 2000 Hours / 2 Years',
      tasks: [
        'Valve adjustment',
        'Injector service',
        'Water pump inspection',
        'Thermostat test',
        'Turbocharger inspection',
        'Major service items'
      ],
      responsible: 'Qualified service technician',
      notes: 'Based on hours or time, whichever comes first'
    }
  ],
  qualityStandards: [
    'ISO 9001:2015 Quality Management',
    'Kenya Bureau of Standards certified',
    'OEM-specified procedures',
    'Documented service history',
    'Calibrated test equipment',
    'Traceable parts sourcing',
    'Continuing technician training',
    'Customer satisfaction monitoring'
  ],
  certifications: [
    'Authorized service provider for major brands',
    'Energy Regulatory Commission licensed',
    'NEMA environmental compliance',
    'Occupational Safety certified',
    'Insurance and bonding'
  ],
  warranty: {
    standard: '90 days on parts and labor for repairs',
    extended: '12 months on installations and major repairs',
    conditions: [
      'Warranty requires use of genuine or OEM-equivalent parts',
      'Does not cover damage from misuse or neglect',
      'Requires proof of purchase',
      'Does not cover consumables',
      'Requires maintenance according to schedule'
    ]
  },
  pricingTiers: [
    {
      name: 'Emergency Callout',
      priceRange: 'KES 15,000 - 25,000 base + parts',
      includes: [
        '24/7 availability',
        '2-4 hour response',
        'Diagnosis and repair',
        'Parts at standard pricing',
        'Emergency stabilization'
      ],
      turnaround: 'Same day response'
    },
    {
      name: 'Standard Service',
      priceRange: 'KES 8,000 - 45,000',
      includes: [
        'Scheduled maintenance visit',
        'Comprehensive inspection',
        'Fluid services',
        'Filter replacement',
        'Performance testing',
        'Detailed report'
      ],
      turnaround: '1-3 business days scheduling'
    },
    {
      name: 'Annual Service Contract',
      priceRange: 'KES 85,000 - 350,000/year',
      includes: [
        'Quarterly preventive maintenance',
        'Priority emergency response',
        '10% parts discount',
        'Annual load bank test',
        'Remote monitoring setup',
        '24/7 phone support'
      ],
      turnaround: 'Scheduled visits + priority emergency'
    }
  ],
  faqs: [
    {
      question: 'How often should my generator be serviced?',
      answer: 'For standby generators, we recommend at minimum quarterly service visits plus annual comprehensive service. High-use generators may need monthly service. The key factors are operating hours, environment, and criticality. We can recommend a service schedule tailored to your specific situation.'
    },
    {
      question: 'How long will my generator last?',
      answer: 'With proper maintenance, a quality generator can last 20-30 years or 15,000+ operating hours. The engine will eventually need overhaul, but this restores performance for many more years. Many of our customers are still operating generators we installed 15+ years ago.'
    },
    {
      question: 'What size generator do I need?',
      answer: 'Generator sizing depends on your load requirements including motor starting loads, desired growth margin, and reliability requirements. We perform load analysis and recommend appropriate sizing. Undersizing causes overload problems; oversizing wastes fuel and causes wet stacking.'
    },
    {
      question: 'How much fuel does a generator use?',
      answer: 'Fuel consumption depends on generator size and load. A rough estimate for diesel generators is 0.25 liters per kWh at full load. A 100kVA generator at 80% load might use about 15-18 liters per hour. We can provide specific consumption data for any generator.'
    },
    {
      question: 'Can you service any brand of generator?',
      answer: 'Yes, we service all major generator brands including Cummins, Caterpillar, Perkins, FG Wilson, SDMO, Kohler, Generac, and many others. Our technicians are trained on multiple platforms and we have access to parts for all common brands.'
    },
    {
      question: 'What causes generators to fail?',
      answer: 'The most common failure causes are battery issues (dead or weak batteries), fuel problems (contamination or stale fuel), and cooling system failures. Regular maintenance addresses all these. Electrical failures and control issues also occur but are less common with proper care.'
    },
    {
      question: 'How quickly can you respond to emergencies?',
      answer: 'We maintain 24/7 emergency response capability with typical response times of 2-4 hours in Nairobi and surrounding areas. Remote locations may take longer. Critical facilities with service contracts receive priority response.'
    }
  ]
};

// Export all comprehensive services
export const COMPREHENSIVE_SERVICES: ComprehensiveService[] = [
  GENERATOR_SERVICE,
  // Additional services would be added here with same structure
];

// Helper functions
export function getServiceById(id: string): ComprehensiveService | undefined {
  return COMPREHENSIVE_SERVICES.find(s => s.id === id);
}

export function getAllPricingTiers(): PricingTier[] {
  return COMPREHENSIVE_SERVICES.flatMap(s => s.pricingTiers);
}

export function searchFAQs(query: string): FAQ[] {
  const searchTerm = query.toLowerCase();
  const results: FAQ[] = [];
  for (const service of COMPREHENSIVE_SERVICES) {
    for (const faq of service.faqs) {
      if (faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm)) {
        results.push(faq);
      }
    }
  }
  return results;
}
