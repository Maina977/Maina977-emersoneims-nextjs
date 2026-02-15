/**
 * Enhanced Maintenance Hub Services Data
 * Comprehensive, detailed content for all 9 service categories
 * Each service has 4+ paragraph descriptions, 5+ paragraph solutions, 5+ paragraph guidelines
 */

export interface DetailedProblem {
  issue: string;
  symptoms: string[];
  detailedSolution: string;
  diagnosticSteps: string[];
  repairProcedure: string[];
  preventionTips: string[];
  estimatedTime: string;
  estimatedCost: string;
  difficultyLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  toolsRequired: string[];
}

export interface DetailedGuideline {
  title: string;
  icon: string;
  importance: 'Critical' | 'High' | 'Medium';
  overview: string;
  detailedExplanation: string;
  procedures: string[];
  commonMistakes: string[];
  emergencyProtocol: string;
}

export interface EnhancedServiceCategory {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  shortDescription: string;
  fullDescription: {
    overview: string;
    technicalDetails: string;
    serviceScope: string;
    whyChooseUs: string;
    industryApplications: string;
  };
  href: string;
  color: string;
  glowColor: string;
  features: string[];
  stats: { value: string; label: string };
  subServices: {
    name: string;
    description: string;
    benefits: string[];
  }[];
  detailedProblems: DetailedProblem[];
  turnaroundTime: string;
  priceRange: string;
  requiredTools: {
    name: string;
    purpose: string;
    importance: 'Essential' | 'Recommended' | 'Optional';
  }[];
  safetyGuidelines: DetailedGuideline[];
  certifications: string[];
  warranty: string;
}

export const ENHANCED_SERVICE_CATEGORIES: EnhancedServiceCategory[] = [
  {
    id: 'generator',
    name: 'Generator Services',
    icon: '⚡',
    iconBg: 'from-blue-500 to-indigo-600',
    shortDescription: 'Complete generator solutions including installation, repair, maintenance, and genuine spare parts.',
    fullDescription: {
      overview: `Generator services form the backbone of reliable power infrastructure across Kenya and East Africa. Our comprehensive generator maintenance and repair services cover all aspects of diesel, petrol, and gas-powered generators ranging from small portable units of 2kVA to large industrial installations exceeding 2000kVA. With over 15 years of experience in the field, our certified technicians have handled thousands of generator installations, repairs, and maintenance contracts for hospitals, hotels, manufacturing plants, telecommunications towers, and residential complexes throughout the region.

Our generator service division maintains partnerships with all major generator manufacturers including Caterpillar, Cummins, Perkins, FG Wilson, SDMO, Kohler, and local assemblers. This enables us to access genuine spare parts, technical documentation, and manufacturer support for even the most complex repairs. We understand that generator downtime can cost businesses millions of shillings in lost productivity, spoiled inventory, and missed opportunities, which is why we maintain a rapid response team available 24 hours a day, 7 days a week.

The cornerstone of our generator services is the Generator Oracle diagnostic system, which provides access to over 230,000 fault codes across 9 major controller brands including DeepSea Electronics, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, and ENKO. This proprietary database allows our technicians to quickly identify and resolve issues that would otherwise require hours of manual troubleshooting or expensive factory support calls.

Beyond repairs, we offer comprehensive preventive maintenance programs designed to maximize generator lifespan and minimize unexpected failures. Our maintenance contracts include regular oil and filter changes, coolant system inspections, fuel system cleaning, battery testing, load bank testing, and complete electrical system inspections. Clients on our maintenance programs report 60% fewer emergency callouts and 40% longer intervals between major overhauls.`,

      technicalDetails: `Our technical capabilities span the entire spectrum of generator systems, from mechanical engine components to sophisticated electronic control systems. On the mechanical side, we handle engine overhauls including cylinder head reconditioning, crankshaft grinding, connecting rod rebuilding, turbocharger repair, and complete engine replacements. Our workshop is equipped with precision measurement tools, hydraulic presses, and specialized lifting equipment to handle engines weighing up to 5 tons.

The electrical systems of modern generators require specialized knowledge and equipment. We service and repair alternators from 10kVA to 3000kVA, including rewinding of stator and rotor windings, bearing replacement, exciter repair, and AVR (Automatic Voltage Regulator) calibration. Our technicians are trained in the programming and configuration of all major generator controllers, enabling us to optimize generator performance, configure protection parameters, and integrate generators with building management systems.

Fuel system expertise is critical for generator reliability. We provide complete fuel system services including injector testing and reconditioning, fuel pump calibration, fuel tank cleaning and treatment, and fuel polishing for generators that have been idle for extended periods. Our fuel quality testing service can identify water contamination, microbial growth, and fuel degradation before they cause engine damage.

Cooling system maintenance prevents the number one cause of generator failures - overheating. We offer radiator cleaning and repair, thermostat testing and replacement, water pump service, coolant flush and replacement, and cooling fan inspection. For generators in dusty environments, we install and maintain air filtration systems that dramatically extend service intervals.`,

      serviceScope: `Our generator services cover the complete lifecycle from initial consultation and system design through installation, commissioning, operation, maintenance, and eventual replacement or upgrade. For new installations, we provide site surveys, load calculations, fuel consumption estimates, acoustic treatment recommendations, and complete turnkey installation including civil works, fuel storage, exhaust systems, and electrical connections to the main distribution board.

We specialize in Automatic Transfer Switch (ATS) systems that ensure seamless power transfer between mains and generator supply. Our ATS installations range from simple mechanical changeover switches for residential applications to sophisticated digital transfer systems with load shedding, generator synchronization, and remote monitoring capabilities for commercial and industrial facilities.

Load bank testing is an essential service for generators that operate in standby mode for extended periods. Our mobile load banks can test generators up to 2000kVA at your site, verifying that the generator can handle its rated load and identifying issues that only appear under full load conditions. We provide detailed test reports documenting voltage stability, frequency regulation, temperature rise, and fuel consumption under various load conditions.

Remote monitoring systems allow facility managers to track generator status, receive automatic alerts, and access performance data from anywhere in the world. We install and configure monitoring solutions from leading providers, integrating them with existing building management systems or providing standalone mobile applications for real-time generator oversight.`,

      whyChooseUs: `Choosing Emerson EiMS for your generator services means partnering with a company that has built its reputation on technical excellence, rapid response, and customer satisfaction. Our 15-year track record includes maintaining generators for some of Kenya's most critical facilities - hospitals where power failures can cost lives, data centers where downtime costs millions per hour, and manufacturing plants where continuous power is essential for product quality.

Our investment in the Generator Oracle diagnostic system demonstrates our commitment to leveraging technology for faster, more accurate repairs. While competitors rely on trial-and-error troubleshooting or expensive manufacturer callouts, our technicians can identify fault codes, access detailed repair procedures, and order the correct parts before even arriving at your site. This results in faster repairs, lower costs, and less disruption to your operations.

We maintain the largest inventory of generator spare parts in Kenya, with over 1,560 items in stock at our Nairobi warehouse. This includes filters, belts, hoses, sensors, and controllers for all major brands, as well as hard-to-find components for older generator models. Our parts inventory is supported by relationships with international suppliers who can air-freight critical components within 48-72 hours when needed.

Every technician at Emerson EiMS undergoes rigorous training and certification. Our team includes Cummins-certified technicians, DeepSea-trained controller specialists, and electricians licensed by the Energy and Petroleum Regulatory Authority. We carry comprehensive insurance coverage and provide warranties on all parts and labor, giving you complete peace of mind.`,

      industryApplications: `Healthcare facilities represent one of our largest market segments, where generator reliability is literally a matter of life and death. We maintain standby generators for major hospitals including emergency backup systems that must start within 10 seconds of a power failure. Our hospital contracts include quarterly load testing, monthly inspections, and priority emergency response with guaranteed arrival times.

The hospitality industry depends on generators to maintain guest comfort and protect their reputation. Hotels and lodges, particularly in remote safari destinations, rely on our services to keep generators running quietly and efficiently. We specialize in acoustic enclosures and exhaust treatment systems that minimize noise and emissions, ensuring generators don't disturb guests or damage the environment.

Telecommunications infrastructure requires 99.999% uptime, making generator reliability critical. We maintain backup generators at cell tower sites, switching centers, and data centers throughout Kenya. Our remote monitoring capabilities are particularly valuable for telecom sites, allowing us to identify and respond to issues before they affect network availability.

Manufacturing and industrial facilities often have complex power requirements with multiple generators operating in parallel, load sharing systems, and integration with process control systems. Our industrial team has experience with generator installations from 50kVA single units to 10MVA paralleled systems, and we understand the critical importance of power quality for sensitive manufacturing processes.`
    },
    href: '/generator-oracle',
    color: 'from-blue-600/20 to-indigo-700/20',
    glowColor: 'shadow-blue-500/20',
    features: ['230,000+ Fault Codes', 'Controller Simulators', 'Wiring Diagrams', 'Offline Diagnostics', 'Load Bank Testing', 'Remote Monitoring', 'Preventive Maintenance', '24/7 Emergency Support'],
    stats: { value: '90K+', label: 'Fault Codes' },
    subServices: [
      {
        name: 'Generator Installation',
        description: 'Complete turnkey installation including site preparation, foundation construction, fuel system setup, exhaust installation, and electrical connections.',
        benefits: ['Professional site survey', 'Load calculation', 'Permit assistance', 'Commissioning included']
      },
      {
        name: 'Generator Repair',
        description: 'Expert repair services for all generator brands covering mechanical, electrical, and electronic faults.',
        benefits: ['230,000+ fault code database', 'Same-day service available', 'Genuine spare parts', 'Warranty on repairs']
      },
      {
        name: 'Preventive Maintenance',
        description: 'Scheduled maintenance programs to maximize reliability and extend generator lifespan.',
        benefits: ['Customized schedules', 'Detailed reports', 'Priority emergency response', 'Cost predictability']
      },
      {
        name: 'ATS Installation',
        description: 'Automatic Transfer Switch installation for seamless power changeover between mains and generator.',
        benefits: ['Various capacities', 'Digital or mechanical', 'Load shedding options', 'Integration support']
      },
      {
        name: 'Controller Programming',
        description: 'Configuration and programming of generator controllers for optimal performance and protection.',
        benefits: ['All 9 controller brands', 'Custom parameters', 'Remote access setup', 'Backup configuration']
      },
      {
        name: 'Load Bank Testing',
        description: 'On-site load testing to verify generator capacity and identify issues that only appear under load.',
        benefits: ['Mobile load banks to 2000kVA', 'Detailed test reports', 'Temperature monitoring', 'Fuel consumption data']
      },
      {
        name: 'Fuel System Service',
        description: 'Complete fuel system maintenance including tank cleaning, injector service, and fuel quality testing.',
        benefits: ['Fuel polishing', 'Tank treatment', 'Injector reconditioning', 'Contamination testing']
      },
      {
        name: 'Cooling System Service',
        description: 'Radiator repair, coolant flush, thermostat testing, and complete cooling system maintenance.',
        benefits: ['Radiator cleaning', 'Coolant analysis', 'Fan inspection', 'Hose replacement']
      }
    ],
    detailedProblems: [
      {
        issue: 'Generator Not Starting',
        symptoms: ['Starter motor not engaging', 'Engine cranks but won\'t fire', 'No response to start command', 'Control panel shows fault codes'],
        detailedSolution: `Generator starting failures represent one of the most common issues we encounter, and they can stem from multiple interconnected systems. Understanding the root cause requires systematic diagnosis of the battery system, fuel delivery, air intake, and control electronics. Our technicians follow a proven diagnostic protocol that identifies the failure point quickly and accurately, minimizing downtime and repair costs.

The battery system is the first checkpoint in any starting failure diagnosis. Generators require substantial cranking current, typically 500-2000 amps depending on engine size, to achieve the RPM necessary for fuel ignition. Battery voltage must remain above 10.5V during cranking for diesel engines and 9.5V for petrol engines. Our technicians use professional-grade battery analyzers that measure cold cranking amps (CCA), internal resistance, and state of charge. Weak batteries often show acceptable voltage at rest but collapse under the cranking load, making load testing essential.

Fuel system issues account for approximately 40% of starting failures. Diesel engines are particularly susceptible to fuel quality problems including water contamination, algae growth, and fuel degradation from extended storage. Our diagnostic process includes checking fuel level sensors (which can give false readings), testing fuel lift pump operation, verifying fuel solenoid activation, and checking for air in fuel lines. For generators that have been idle for extended periods, we recommend fuel polishing to remove contaminants before attempting to start.

The air intake system must provide clean, unrestricted airflow for proper combustion. Clogged air filters, collapsed intake hoses, or stuck intake valves can all prevent starting. We inspect air filter condition, measure intake vacuum, and verify that intake heaters (glow plugs for diesel, choke systems for petrol) are functioning correctly. In cold weather conditions, intake air pre-heating is essential for diesel engine starting.

Control system faults can prevent starting even when all mechanical systems are functional. Modern generators use sophisticated controllers that monitor numerous parameters before allowing the engine to start. Safety interlocks for low oil pressure, high temperature, overcrank protection, and emergency stop circuits must all be in the correct state. Our technicians use manufacturer diagnostic software to read fault codes, view real-time sensor data, and verify control logic operation.`,
        diagnosticSteps: [
          'Check battery voltage at rest (should be 12.6V or higher for 12V systems)',
          'Perform battery load test or CCA measurement',
          'Verify battery connections are clean and tight',
          'Check fuel level visually (don\'t trust gauge alone)',
          'Inspect fuel filter condition and water separator',
          'Test fuel solenoid operation with multimeter',
          'Check air filter restriction indicator',
          'Read control panel fault codes',
          'Verify all safety interlocks are satisfied',
          'Test cranking system operation (starter motor, solenoid, wiring)'
        ],
        repairProcedure: [
          'Address battery issues first - charge, replace, or clean connections as needed',
          'If fuel-related, drain water from separator, replace filters, bleed air from system',
          'Replace clogged air filters and inspect intake system',
          'Clear fault codes and reset safety interlocks',
          'Test start in manual mode to bypass automatic start sequence',
          'If starter issues, check starter motor brushes, solenoid contacts, and wiring',
          'Verify fuel injector spray pattern if engine cranks but won\'t fire',
          'Check compression if all other systems are verified'
        ],
        preventionTips: [
          'Run generator under load for 30 minutes weekly to keep systems exercised',
          'Test battery monthly with load tester, replace every 3-4 years',
          'Drain water separator weekly in humid environments',
          'Replace fuel filters every 500 hours or annually',
          'Use fuel stabilizer if generator will be idle for more than 30 days',
          'Keep battery terminals coated with anti-corrosion compound',
          'Maintain fuel tank at least 50% full to reduce condensation'
        ],
        estimatedTime: '1-4 hours depending on cause',
        estimatedCost: 'KES 3,000 - 25,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Digital multimeter', 'Battery load tester', 'Fuel pressure gauge', 'Diagnostic laptop', 'Hand tools']
      },
      {
        issue: 'Low Oil Pressure Alarm',
        symptoms: ['Oil pressure warning light', 'Low oil pressure fault code', 'Engine shutdown on starting', 'Unusual engine noise'],
        detailedSolution: `Low oil pressure alarms indicate a potentially serious condition that requires immediate attention to prevent catastrophic engine damage. Oil pressure is essential for lubricating bearings, pistons, and other moving parts; operating without adequate pressure can destroy an engine within minutes. However, low pressure alarms can also be caused by sensor faults, wiring issues, or control system problems, making accurate diagnosis essential before expensive repairs are undertaken.

The first and most obvious check is oil level. Modern generators can consume some oil during normal operation, and extended periods between oil changes can lead to levels dropping below the minimum required for proper pump pickup. Always check oil level with the engine off and on level ground, waiting at least 5 minutes after shutdown for oil to drain back to the sump. Oil level should be between the minimum and maximum marks on the dipstick; both overfilling and underfilling can cause pressure problems.

Oil viscosity and condition directly affect pressure readings. Oil that has degraded through heat cycling, fuel dilution, or contamination loses its ability to maintain pressure, particularly at operating temperature. We recommend oil analysis for generators with pressure concerns - laboratory testing can reveal excessive wear metals, fuel dilution, coolant contamination, and other issues not visible to the naked eye. Using the correct oil grade for your climate is essential; oil that is too thin for operating temperature will show low pressure when hot.

The oil pressure sensor and gauge should be verified before assuming mechanical problems. Sensors can fail, giving false low readings, and wiring can develop high resistance that reduces signal voltage. Our diagnostic process includes testing sensor resistance against temperature specifications, checking wiring continuity and insulation, and if necessary, installing a mechanical gauge to verify actual pressure. Many generators have been unnecessarily overhauled due to faulty sensors.

If sensor and oil condition are verified as good, internal engine issues must be investigated. The oil pump can wear, reducing flow capacity; the pressure relief valve can stick open; bearings can wear, increasing clearances that reduce pressure; or oil passages can become blocked with sludge or debris. These issues typically require engine disassembly for proper diagnosis and repair, and may indicate that a complete overhaul is more cost-effective than targeted repairs.`,
        diagnosticSteps: [
          'Check oil level immediately - shut down if critically low',
          'Inspect oil condition on dipstick - color, consistency, smell for fuel',
          'Check for visible leaks around engine, filters, and cooler',
          'Test oil pressure sensor resistance and compare to specifications',
          'Inspect sensor wiring for damage, corrosion, or loose connections',
          'Install mechanical pressure gauge to verify actual pressure',
          'Check oil filter condition and bypass valve operation',
          'Review maintenance records for oil change intervals and oil grade used',
          'Consider oil sample analysis for wear metal content',
          'If pressure genuinely low, investigate pump, relief valve, and bearings'
        ],
        repairProcedure: [
          'Top up oil to correct level if low, using specified grade',
          'Change oil and filter if condition is poor or overdue',
          'Replace faulty pressure sensor after verifying with mechanical gauge',
          'Repair or replace damaged wiring to sensor',
          'Clean or replace oil pickup screen if clogged',
          'Adjust or replace pressure relief valve if stuck open',
          'Replace oil pump if worn beyond specifications',
          'If bearing wear confirmed, plan for engine overhaul'
        ],
        preventionTips: [
          'Check oil level weekly and before each start',
          'Change oil and filter at manufacturer-specified intervals',
          'Use only the oil grade specified for your climate',
          'Never mix different oil brands or types',
          'Address small leaks promptly before they become large',
          'Consider oil analysis program for critical generators',
          'Keep oil storage containers clean and sealed'
        ],
        estimatedTime: '1-8 hours depending on cause',
        estimatedCost: 'KES 2,500 - 50,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Dipstick', 'Mechanical pressure gauge', 'Multimeter', 'Oil sample kit', 'Hand tools']
      },
      {
        issue: 'High Temperature Shutdown',
        symptoms: ['High coolant temperature alarm', 'Engine overheating', 'Steam or coolant loss', 'Reduced power output before shutdown'],
        detailedSolution: `High temperature shutdowns protect the engine from severe damage but indicate a cooling system problem that must be resolved before the generator can return to service. Diesel engines operate most efficiently at temperatures between 80-95°C, and the cooling system must maintain this range under full load in ambient temperatures that can exceed 35°C in Kenya. Overheating can warp cylinder heads, damage head gaskets, score cylinder walls, and ultimately seize the engine.

Coolant level is the starting point for any overheating diagnosis. The cooling system must be completely full with no air pockets for proper operation. Check the radiator (when cold) and the expansion tank; low levels indicate either consumption or leakage. Pressure test the system to identify external leaks from hoses, clamps, water pump seals, or the radiator itself. Internal leaks into the combustion chamber or oil system are more serious and indicated by white exhaust smoke, milky oil, or air bubbles in the coolant.

Airflow through the radiator is essential for heat rejection. Inspect the radiator fins for blockage by dust, insects, leaves, or debris - this is extremely common in Kenya's dusty conditions. The cooling fan must operate correctly; check belt tension, fan clutch operation (if equipped), or electric fan motor and relay function. For enclosed generators, verify that cooling air intake and exhaust paths are not blocked and that any external ventilation systems are operational.

The thermostat regulates coolant flow to maintain optimal operating temperature. A stuck-closed thermostat prevents coolant circulation and causes rapid overheating even at light loads. A stuck-open thermostat causes slow warmup and can affect fuel economy and emissions but rarely causes overheating. Test thermostats by removing and placing in hot water to verify opening temperature, or replace as a matter of course during overheating diagnosis given their low cost.

Coolant condition affects heat transfer efficiency. Old coolant loses its corrosion inhibitors and heat transfer capability, and can deposit scale inside the engine and radiator that acts as insulation. Coolant should be bright in color (green, orange, or pink depending on type) with no visible contamination, rust particles, or oil. Check coolant concentration with a refractometer - the ideal mix is typically 50% coolant to 50% clean water, providing freeze protection to -37°C and boiling protection to 129°C under pressure.`,
        diagnosticSteps: [
          'Allow engine to cool before opening cooling system',
          'Check coolant level in radiator and expansion tank',
          'Pressure test cooling system for leaks (external and internal)',
          'Inspect radiator fins for blockage - clean if necessary',
          'Verify cooling fan operation at temperature threshold',
          'Check fan belt tension and condition',
          'Test thermostat operation - remove and test in hot water',
          'Check coolant condition and concentration',
          'Verify water pump operation - check for play in shaft, weeping from seal',
          'Check for exhaust gases in coolant (combustion leak test)',
          'Verify temperature sensor accuracy with infrared thermometer'
        ],
        repairProcedure: [
          'Repair any external leaks - replace hoses, clamps, gaskets as needed',
          'Clean radiator fins thoroughly - use compressed air and approved cleaning solution',
          'Replace thermostat if operation is questionable',
          'Replace coolant if contaminated or overdue',
          'Replace water pump if shaft play or leakage is detected',
          'Replace fan belt if cracked, glazed, or loose',
          'Repair or replace fan clutch if not engaging properly',
          'If head gasket suspected, perform cylinder leak-down test',
          'Replace temperature sensor if readings don\'t match actual temperature'
        ],
        preventionTips: [
          'Clean radiator fins monthly in dusty environments',
          'Check coolant level weekly - top up only with correct mixture',
          'Replace coolant every 2 years or as specified by manufacturer',
          'Inspect belts and hoses at every service interval',
          'Never remove radiator cap when engine is hot',
          'Maintain proper ventilation around generator enclosure',
          'Don\'t overload generator - respect rated capacity limits',
          'Consider coolant analysis program for critical applications'
        ],
        estimatedTime: '2-8 hours depending on cause',
        estimatedCost: 'KES 5,000 - 45,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Cooling system pressure tester', 'Refractometer', 'Infrared thermometer', 'Combustion leak tester', 'Hand tools']
      },
      {
        issue: 'Voltage Fluctuation',
        symptoms: ['Lights flickering on generator power', 'Voltage reading unstable', 'Sensitive equipment shutting down', 'AVR fault codes'],
        detailedSolution: `Voltage fluctuation degrades power quality and can damage sensitive electronic equipment connected to the generator. Modern facilities increasingly depend on stable voltage for computers, medical equipment, variable frequency drives, and telecommunications systems, making voltage stability a critical generator performance parameter. Understanding the causes of voltage instability requires knowledge of both the alternator and the control systems that regulate its output.

The Automatic Voltage Regulator (AVR) is the primary component responsible for maintaining stable output voltage. The AVR senses generator output voltage and adjusts excitation current to the alternator field winding to compensate for load changes and speed variations. AVR faults can cause both high and low voltage conditions, hunting (oscillating voltage), or failure to build voltage at all. Our technicians use oscilloscopes and power analyzers to diagnose AVR performance, checking for proper sensing, response time, and stability under varying load conditions.

Engine speed stability directly affects generator frequency and influences voltage regulation. Generators must maintain speed within tight tolerances (typically ±0.5% for quality units) for proper voltage control. Speed instability can result from governor problems (mechanical or electronic), fuel system issues, engine mechanical problems, or improper governor settings. We verify speed stability using digital tachometers and adjust governors to achieve specified droop or isochronous characteristics.

Alternator problems can cause voltage instability independent of the AVR. Rotating diodes in brushless alternators can fail, causing uneven excitation and voltage ripple. Stator winding insulation breakdown can cause turn-to-turn shorts that affect voltage regulation. Bearing wear can allow the rotor to move off-center, causing variable air gap and unstable output. We perform comprehensive alternator testing including insulation resistance, winding resistance, and output waveform analysis to identify alternator issues.

Load characteristics significantly impact voltage stability. Highly reactive loads (motors, transformers) cause power factor issues that stress the AVR and can cause voltage dips during starting. Nonlinear loads (VFDs, rectifiers, computers) generate harmonic currents that distort the voltage waveform. We analyze load characteristics and recommend solutions such as power factor correction capacitors, harmonic filters, or generator sizing adjustments to achieve stable operation.`,
        diagnosticSteps: [
          'Measure voltage with calibrated true-RMS meter at generator output',
          'Check voltage at both no-load and various load levels',
          'Measure frequency stability - should be within ±0.5Hz of nominal',
          'Inspect AVR for physical damage, burnt components, loose connections',
          'Check AVR sensing wires and connections',
          'Verify AVR adjustment potentiometers are set correctly',
          'Test rotating diodes in brushless alternators',
          'Measure alternator winding resistance and insulation',
          'Analyze voltage waveform with oscilloscope for distortion',
          'Check engine governor response and stability',
          'Analyze load power factor and harmonic content'
        ],
        repairProcedure: [
          'Replace faulty AVR after verifying it is the cause',
          'Adjust AVR voltage setting and stability potentiometers',
          'Replace failed rotating diodes (accessible without alternator removal)',
          'Adjust or repair governor system for speed stability',
          'Replace fuel system components affecting speed stability',
          'Repair alternator if winding or bearing issues found',
          'Install power factor correction if load power factor is poor',
          'Install harmonic filter if load harmonics are excessive',
          'Verify proper grounding of all components'
        ],
        preventionTips: [
          'Match generator size to load requirements with appropriate margins',
          'Consider generator with electronic governor for sensitive loads',
          'Install surge protection on sensitive equipment',
          'Use soft starters for large motor loads',
          'Monitor voltage quality periodically with power analyzer',
          'Keep AVR and control connections clean and tight',
          'Include AVR inspection in regular maintenance',
          'Consider UPS for most sensitive loads regardless of generator quality'
        ],
        estimatedTime: '2-6 hours depending on cause',
        estimatedCost: 'KES 8,000 - 50,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['True-RMS multimeter', 'Power analyzer', 'Oscilloscope', 'Digital tachometer', 'Insulation tester', 'AVR tester']
      }
    ],
    turnaroundTime: 'Same day for diagnostics, 1-3 days for major repairs',
    priceRange: 'KES 3,000 - 500,000',
    requiredTools: [
      { name: 'Digital Multimeter', purpose: 'Measure voltage, current, resistance in electrical circuits', importance: 'Essential' },
      { name: 'Clamp Meter', purpose: 'Measure current without breaking circuits', importance: 'Essential' },
      { name: 'Diagnostic Laptop', purpose: 'Read fault codes and configure controllers', importance: 'Essential' },
      { name: 'Fuel Pressure Gauge', purpose: 'Test fuel system pressure and flow', importance: 'Essential' },
      { name: 'Compression Tester', purpose: 'Verify engine cylinder compression', importance: 'Recommended' },
      { name: 'Insulation Tester (Megger)', purpose: 'Test winding insulation resistance', importance: 'Essential' },
      { name: 'Load Bank', purpose: 'Apply controlled load for testing', importance: 'Recommended' },
      { name: 'Infrared Thermometer', purpose: 'Non-contact temperature measurement', importance: 'Recommended' },
      { name: 'Battery Analyzer', purpose: 'Test battery condition and capacity', importance: 'Essential' },
      { name: 'Oscilloscope', purpose: 'Analyze electrical waveforms', importance: 'Optional' }
    ],
    safetyGuidelines: [
      {
        title: 'Electrical Isolation',
        icon: '⚡',
        importance: 'Critical',
        overview: 'Generator electrical systems operate at potentially lethal voltages. Proper isolation procedures must be followed to prevent electrocution.',
        detailedExplanation: `Electrical safety is paramount when working on generators, which produce voltages ranging from 220V single-phase to 11,000V or higher for large industrial units. Electrocution can occur not only from direct contact with energized conductors but also from step potential near grounding faults, capacitive discharge from large cables, and induced voltages in adjacent conductors. Every technician must understand and rigorously follow electrical isolation procedures.

Before beginning any electrical work, the generator must be shut down and the main circuit breaker opened. However, this alone is not sufficient - residual energy can remain in capacitors, and the generator could be remotely started or automatically started by a transfer switch. The battery disconnect must be opened to prevent starting, and if the generator is connected to utility power through a transfer switch, that connection must also be isolated.

Lock-out tag-out (LOTO) procedures provide documented protection against unexpected energization. Each technician working on the equipment places their personal lock on the isolation points, and a tag documenting the work being performed. The equipment cannot be re-energized until all locks are removed. This system protects against miscommunication and ensures that technicians cannot be endangered by others who don't know work is in progress.

Even after proper isolation, residual voltage may be present in capacitors, particularly in AVR circuits and power factor correction equipment. Always test for voltage before touching any conductors, using a properly rated voltage tester that you have verified is working by testing on a known energized source. Large capacitors should be discharged through appropriate resistors before work begins.

Generators produce voltage whenever the engine is running, regardless of the position of circuit breakers. Never attempt to work on live generator circuits unless absolutely necessary and only with appropriate PPE and procedures for live work. If the generator must be running for diagnostic purposes, use insulated tools and maintain proper clearances from energized components.`,
        procedures: [
          'Shut down generator using normal stop procedure',
          'Open main circuit breaker and verify open position',
          'Open battery disconnect switch',
          'Isolate any ATS connections to utility power',
          'Apply personal lock and tag to all isolation points',
          'Verify zero energy using rated voltage tester',
          'Test voltage tester on known source before and after use',
          'Discharge any capacitors through appropriate resistors',
          'Ground phase conductors if working on high-voltage systems',
          'Maintain isolation until all work is complete and verified'
        ],
        commonMistakes: [
          'Assuming generator is safe because engine is off - battery and ATS can still energize',
          'Not verifying voltage tester is working before using it',
          'Failing to isolate all energy sources including battery and utility connection',
          'Not using personal LOTO - relying on others to maintain isolation',
          'Forgetting about capacitors that may retain charge',
          'Working on "safe" low-voltage circuits while high voltage nearby is energized'
        ],
        emergencyProtocol: 'If electrical contact occurs: Don\'t touch victim directly - use insulated object to separate them from source. Call emergency services immediately. Begin CPR if victim is not breathing. Treat any burns after victim is clear of electrical source.'
      },
      {
        title: 'Mechanical Safety',
        icon: '⚙️',
        importance: 'Critical',
        overview: 'Generator engines contain numerous moving parts that can cause severe injury. Proper procedures prevent contact with rotating equipment and hot surfaces.',
        detailedExplanation: `Generator engines and alternators contain rotating components operating at high speeds with tremendous kinetic energy. The cooling fan alone can sever fingers instantly, and contact with the flywheel, drive belts, or coupling can cause fatal injuries. Hot surfaces including exhaust manifolds, turbochargers, and cylinder heads can cause severe burns. Understanding and respecting these hazards is essential for every technician.

The cooling fan is one of the most dangerous components because it is often partially enclosed and not immediately visible. Never reach into the engine compartment without first verifying the engine is completely stopped and cannot be started. Even a brief bump of the starter can cause the fan to rotate enough to cause injury. The fan guard must always be in place during operation; if it must be removed for service, ensure the battery is disconnected.

Belt-driven components including the fan, water pump, and alternator present entanglement hazards. Loose clothing, jewelry, long hair, and even gloves can be caught by moving belts and pulled into the pulleys with devastating force. Remove all jewelry, tie back long hair, and wear close-fitting clothing when working near engines. If gloves are necessary for other hazards, choose tight-fitting gloves without loose cuffs.

Hot surfaces are present throughout the engine compartment during and after operation. The exhaust manifold can reach 500°C, and even "minor" components like valve covers can exceed 100°C. Allow adequate cooling time before working in the engine compartment - at least 30 minutes for most work, longer for exhaust system service. Be aware that some components retain heat much longer than others.

Pressure hazards exist in the cooling system, fuel system, and crankcase. Never remove the radiator cap from a hot engine - the pressurized coolant will flash to steam and cause severe burns. Fuel injection systems operate at extreme pressures that can penetrate skin and inject fuel into tissue, causing serious injury. Crankcase pressure can force hot oil out of filler caps or dipstick tubes if internal pressure is abnormal.`,
        procedures: [
          'Allow engine to cool for at least 30 minutes before service',
          'Disconnect battery before any work near rotating components',
          'Verify engine is completely stopped - no coasting rotation',
          'Remove jewelry, tie back hair, wear close-fitting clothing',
          'Never reach into engine compartment while engine is running',
          'Keep hands clear of belt-driven components even when stopped',
          'Release cooling system pressure slowly before removing cap',
          'Never work on fuel injection components with engine running',
          'Use appropriate tools - never hands - to move hot components',
          'Replace all guards and covers before returning to service'
        ],
        commonMistakes: [
          'Assuming engine won\'t start because key is removed - other start methods exist',
          'Underestimating how long components remain hot after shutdown',
          'Wearing loose clothing or gloves near rotating equipment',
          'Removing radiator cap before system has cooled and depressurized',
          'Reaching into engine compartment without full visual confirmation of stopped rotation',
          'Leaving guards off after maintenance "just for now"'
        ],
        emergencyProtocol: 'For burn injuries: Cool immediately with clean running water for at least 20 minutes. Don\'t apply ice, butter, or other substances. Cover with clean, non-fluffy dressing. For crush or entanglement injuries: Don\'t attempt to reverse machinery - call emergency services. Control bleeding with direct pressure while waiting for help.'
      },
      {
        title: 'Fuel Safety',
        icon: '⛽',
        importance: 'Critical',
        overview: 'Generator fuels are flammable and potentially explosive. Proper handling, storage, and spill response procedures are essential.',
        detailedExplanation: `Generator fuels - diesel, petrol, and natural gas - present fire and explosion hazards that require constant vigilance. While diesel is relatively safe compared to petrol (higher flash point, less volatile), it can still ignite and sustain fire once started. Petrol vapor is extremely flammable and can be ignited by sparks, hot surfaces, or static discharge at considerable distances from the liquid fuel. Natural gas can accumulate in enclosed spaces and create explosive atmospheres.

Diesel fuel has a flash point of approximately 52°C, meaning it will not form ignitable vapors below this temperature under normal conditions. However, fine mist or spray can ignite at lower temperatures, and once burning, diesel fires are intense and difficult to extinguish. Petrol has a flash point of -43°C, meaning it is always producing ignitable vapors at any temperature encountered in Kenya. A single spark can ignite petrol vapor, and the flame can travel back to the fuel source.

Fuel storage must comply with local regulations and best practices. Bulk fuel tanks should be located away from buildings, properly grounded, and equipped with overfill protection and spill containment. Day tanks near generators should have fire-rated construction and automatic shut-off valves. Portable fuel containers must be approved for fuel storage and never stored inside buildings where ignition sources are present.

Refueling is a high-risk activity that should only be performed when the generator is shut down and cooled. Fuel can splash onto hot exhaust components and ignite. Static electricity can accumulate during fuel transfer and discharge as a spark; proper grounding and bonding procedures prevent static ignition. Never overfill fuel tanks - fuel expands when heated and will overflow, creating fire hazards and environmental contamination.

Spill response must be immediate to prevent fire spread and environmental damage. Keep absorbent materials near fuel storage areas. Contain spills by placing absorbent around the perimeter, then work inward. Never wash fuel spills into drains or soil. Contaminated absorbent must be disposed of as hazardous waste. Report significant spills to appropriate environmental authorities.`,
        procedures: [
          'Shut down generator before refueling - never refuel while running',
          'Allow generator to cool for 15 minutes before refueling',
          'Ground and bond fuel transfer equipment to prevent static',
          'Use approved fuel containers and pumping equipment',
          'Never overfill tanks - leave expansion space',
          'Clean up any spills immediately with approved absorbents',
          'Store fuel away from ignition sources and direct sunlight',
          'Inspect fuel systems regularly for leaks',
          'Keep fire extinguisher rated for fuel fires readily accessible',
          'Post no-smoking signs in fuel storage and refueling areas'
        ],
        commonMistakes: [
          'Refueling while generator is running or still hot',
          'Using unapproved containers that can build static charge',
          'Ignoring small fuel leaks until they become large',
          'Storing fuel containers in generator enclosure with heat sources',
          'Not grounding/bonding during bulk fuel transfer',
          'Disposing of fuel-contaminated materials improperly'
        ],
        emergencyProtocol: 'For fuel fires: Alert others and evacuate the area. Only attempt to extinguish with appropriate extinguisher (Class B or ABC) if fire is small and you have clear escape route. Shut off fuel supply if safe to do so. Call fire services immediately for any fire that cannot be easily controlled. For fuel spills: Eliminate ignition sources, contain spill with absorbent, ventilate enclosed areas.'
      },
      {
        title: 'Exhaust and Ventilation',
        icon: '💨',
        importance: 'High',
        overview: 'Generator exhaust contains carbon monoxide and other toxic gases. Proper ventilation prevents poisoning in enclosed spaces.',
        detailedExplanation: `Generator exhaust contains carbon monoxide (CO), a colorless, odorless gas that is lethal at relatively low concentrations. CO binds to hemoglobin 200 times more readily than oxygen, preventing the blood from carrying oxygen to tissues. Symptoms of CO poisoning include headache, dizziness, weakness, and confusion, but victims often don't recognize the danger until they are unable to escape. Every year, people die from running generators in enclosed spaces.

CO concentrations in enclosed spaces can reach lethal levels within minutes of generator startup. A typical diesel generator produces enough CO to reach dangerous levels in a single-car garage in under 5 minutes. Even with doors or windows open, CO can accumulate to hazardous levels if ventilation is inadequate. Generators must never be operated indoors, in garages, in basements, or in any enclosed space where exhaust can accumulate.

Outdoor generator installations must be positioned to prevent exhaust from entering buildings through windows, doors, or ventilation intakes. Prevailing wind direction should be considered when positioning generators, and exhaust should be directed away from occupied areas. Exhaust pipes should extend above roof level when generators are close to buildings to allow exhaust to disperse before it can enter windows.

Enclosed generator rooms require mechanical ventilation systems designed to maintain safe air quality. Ventilation must provide sufficient air for combustion (approximately 0.5 cubic meters per minute per kW for diesel engines) plus cooling air and dilution air to maintain acceptable temperature and air quality. Ventilation systems should be interlocked with generator starting so that the generator cannot operate if ventilation fails.

CO detectors should be installed in generator rooms and adjacent spaces. Unlike smoke detectors, CO detectors are specifically sensitive to carbon monoxide and will alarm at concentrations well below those that cause symptoms in healthy adults. Test CO detectors monthly and replace batteries as specified by the manufacturer. Response to a CO alarm should be immediate evacuation followed by investigation with the generator off.`,
        procedures: [
          'Never operate generators indoors or in enclosed spaces',
          'Position outdoor generators with exhaust directed away from buildings',
          'Maintain minimum clearances from windows, doors, and vents',
          'Install mechanical ventilation in enclosed generator rooms',
          'Interlock ventilation with generator starting system',
          'Install CO detectors in generator rooms and adjacent spaces',
          'Test CO detectors monthly',
          'Inspect exhaust systems for leaks regularly',
          'Evacuate immediately if CO alarm sounds or symptoms develop',
          'Maintain exhaust system components in good condition'
        ],
        commonMistakes: [
          'Running portable generators in garages, even with doors open',
          'Positioning generators where wind can blow exhaust into buildings',
          'Ignoring exhaust leaks as "minor" issues',
          'Not installing CO detectors in generator rooms',
          'Assuming natural ventilation is adequate without calculations',
          'Continuing to work when experiencing headache or dizziness'
        ],
        emergencyProtocol: 'For suspected CO exposure: Evacuate the area immediately to fresh air. Account for all personnel - check for victims who may have collapsed. Call emergency services. If victim is unconscious, begin CPR if not breathing. Do not re-enter the area until cleared by emergency responders with CO monitoring equipment.'
      },
      {
        title: 'Personal Protective Equipment',
        icon: '🦺',
        importance: 'High',
        overview: 'Appropriate PPE protects against the various hazards encountered during generator service. Selection depends on specific work being performed.',
        detailedExplanation: `Personal Protective Equipment (PPE) is the last line of defense against workplace hazards after engineering controls and safe work procedures. For generator service, PPE requirements vary depending on the specific task - electrical work requires different protection than mechanical work or fuel handling. Understanding when and why each type of PPE is necessary ensures technicians are properly protected without being encumbered by unnecessary equipment.

Eye protection is required for most generator service activities. Safety glasses with side shields protect against flying debris during mechanical work, fuel splashes during fuel system service, and arc flash during electrical work. For tasks with arc flash risk (working on energized electrical systems), face shields with appropriate arc rating are required in addition to safety glasses. Prescription safety glasses are available for technicians who require vision correction.

Hand protection requirements vary by task. Leather gloves protect against cuts and abrasions during mechanical work but should not be worn near rotating equipment where they can be caught. Insulated gloves rated for the voltage being worked on are essential for electrical work - always inspect for damage before use and wear leather protectors over rubber insulating gloves to prevent punctures. Chemical-resistant gloves protect against fuel, coolant, and cleaning chemicals.

Hearing protection is necessary when working near operating generators. Most generators exceed 85 dB at 1 meter, the threshold for mandatory hearing protection in most workplace regulations. Earplugs or earmuffs should be worn during any extended work near running generators, and when operating tools that generate high noise levels. Be aware that hearing protection can make it harder to hear warning sounds, requiring extra vigilance.

Foot protection with steel or composite toes prevents crush injuries from dropped tools or components. Non-slip soles provide traction on oily surfaces common around generators. For electrical work, electrical hazard (EH) rated footwear provides additional protection against electrical shock through the feet.`,
        procedures: [
          'Assess hazards before beginning work to determine required PPE',
          'Inspect all PPE before use - damaged PPE should be replaced',
          'Wear safety glasses for all mechanical and electrical work',
          'Use face shield and arc-rated PPE for arc flash hazards',
          'Select appropriate gloves for the specific task',
          'Wear hearing protection near operating generators or loud tools',
          'Wear safety footwear with steel toes and non-slip soles',
          'Remove PPE that could create hazards (loose gloves near rotating parts)',
          'Store PPE properly to prevent damage and contamination',
          'Replace PPE according to manufacturer specifications'
        ],
        commonMistakes: [
          'Not wearing safety glasses because task seems "safe"',
          'Using damaged or incorrect gloves for the task',
          'Wearing loose-fitting gloves near rotating equipment',
          'Ignoring hearing protection for "brief" exposures',
          'Wearing non-rated equipment for arc flash work',
          'Using PPE as substitute for proper hazard controls'
        ],
        emergencyProtocol: 'PPE failures during work: Stop work immediately and assess for injury. Replace damaged PPE before resuming work. Report PPE failures to supervisor for investigation - may indicate need for different PPE or procedural changes. Document any injuries for workers\' compensation and incident investigation.'
      }
    ],
    certifications: ['EPRA Electrical Contractor License', 'Cummins Authorized Service Partner', 'CAT Certified', 'DeepSea Training Certified'],
    warranty: '90 days on parts and labor for all repairs, 12 months on new installations'
  },
  // Additional services will be added in subsequent parts
];

export default ENHANCED_SERVICE_CATEGORIES;
