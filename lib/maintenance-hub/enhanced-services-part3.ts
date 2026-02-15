/**
 * Enhanced Maintenance Hub Services Data - Part 3
 * UPS Power, AC & Refrigeration, Electrical Services
 */

import { EnhancedServiceCategory } from './enhanced-services-data';

export const ENHANCED_SERVICES_PART3: EnhancedServiceCategory[] = [
  {
    id: 'ups-power',
    name: 'UPS & Power Backup',
    icon: '🔋',
    iconBg: 'from-purple-500 to-violet-600',
    shortDescription: 'UPS systems, inverters, and power backup solutions for all brands including APC, Eaton, Schneider, and Vertiv.',
    fullDescription: {
      overview: `Uninterruptible Power Supply (UPS) systems are the critical link that protects sensitive equipment from power disturbances and provides backup power during outages. In Kenya's challenging power environment, where voltage fluctuations, momentary outages, and extended blackouts are common, properly maintained UPS systems are essential for protecting valuable equipment and maintaining business continuity. Emerson EiMS provides comprehensive UPS services covering all major brands and technologies.

Our UPS expertise spans the full range of power protection solutions from small desktop units protecting individual computers to large data center installations supporting megawatts of critical load. We understand that UPS requirements vary dramatically across applications - a medical facility needs different protection than a manufacturing plant or a telecommunications site. Our engineers assess each application's specific requirements and recommend solutions that provide appropriate protection without unnecessary expense.

Battery systems are the heart of any UPS, and battery maintenance is the most critical factor in UPS reliability. We have invested in professional battery testing equipment that accurately assesses battery condition and predicts remaining service life. Our battery replacement services use premium batteries from reputable manufacturers, properly sized for the UPS and application. Proper battery disposal ensures environmental compliance and prevents liability.

Beyond hardware services, we provide UPS monitoring and management solutions that give facility managers visibility into power protection status. Remote monitoring can alert personnel to developing problems before they cause failures. Detailed power quality logging helps identify facility power issues that stress UPS systems and reduce their effectiveness.`,

      technicalDetails: `UPS technologies include offline/standby, line-interactive, and online double-conversion designs, each with distinct characteristics suited to different applications. Offline UPS provides basic protection at lowest cost but has transfer time during which sensitive equipment may be affected. Line-interactive UPS adds voltage regulation while maintaining reasonable efficiency. Online double-conversion provides the highest level of protection with zero transfer time and complete isolation from utility power disturbances.

Battery technologies have evolved significantly, and understanding these technologies is essential for proper UPS maintenance. Traditional valve-regulated lead-acid (VRLA) batteries remain the most common UPS battery type, available in AGM (absorbed glass mat) and gel configurations. Lithium-ion batteries are increasingly used in modern UPS designs, offering longer life, smaller footprint, and faster recharge, but requiring different management and safety considerations.

Power electronics in UPS systems include rectifiers that convert AC to DC for battery charging, inverters that convert DC back to AC for load supply, and static switches that transfer between utility and inverter sources. These components use power semiconductors (IGBTs, SCRs, diodes) that can fail from age, heat stress, or power surges. Understanding power electronics enables accurate diagnosis and repair of UPS failures.

UPS sizing requires careful analysis of connected load including real power (watts), apparent power (VA), and power factor. Inrush current from motor starting or transformer energization must be considered. Future load growth should be accommodated. Runtime requirements determine battery capacity. We use manufacturer sizing tools and our experience to recommend properly sized solutions.`,

      serviceScope: `Installation services include site survey, electrical infrastructure assessment, equipment delivery and positioning, electrical connections, battery installation, commissioning, and user training. We coordinate with electrical contractors for modifications to facility power systems when required. Proper installation is critical for UPS reliability - incorrect wiring, inadequate ventilation, or improper grounding can cause premature failure.

Preventive maintenance programs extend UPS life and ensure readiness when backup power is needed. Our maintenance visits include visual inspection, cleaning, connection tightening, battery testing, functional testing, and firmware updates. We provide detailed reports documenting system condition and any recommended actions. Maintenance intervals depend on equipment type and criticality, typically quarterly or semi-annually.

Emergency repair services respond to UPS failures that threaten critical operations. Our technicians are equipped to diagnose and repair common failures on-site, and we maintain inventory of frequently needed parts. For complex repairs requiring workshop service, we can provide temporary replacement UPS to maintain protection while repairs are completed.

Battery replacement is the most common UPS service requirement. Batteries typically last 3-5 years depending on quality, temperature, and charging practices. We offer battery testing services that identify batteries approaching end of life, allowing planned replacement before failure. Our battery replacement services include removal of old batteries, installation of new batteries, functional testing, and proper disposal of replaced batteries.`,

      whyChooseUs: `Our multi-brand expertise means we can service whatever UPS equipment you have installed, without the limitations of single-brand service providers. We maintain training and documentation for APC, Eaton, Schneider Electric, Vertiv (Emerson/Liebert), Riello, and numerous other brands. This breadth of knowledge also allows us to recommend the best solution when new equipment is needed, without brand bias.

Battery testing capability sets us apart from service providers who simply recommend replacement based on age. Our conductance testers identify weak cells within battery strings, allowing targeted replacement that optimizes cost while maintaining reliability. We can often extend battery life by replacing only failed cells rather than entire strings.

Proper battery disposal demonstrates environmental responsibility and protects our customers from liability. Lead-acid batteries are classified as hazardous waste and must be handled according to environmental regulations. We work with licensed recyclers to ensure proper disposal and provide documentation for customer records.

Emergency response capability means we're available when you need us most. UPS failures often occur during power events when systems are under stress - exactly when backup power is most critical. Our 24/7 emergency line connects you with technicians who can provide immediate guidance and dispatch repair personnel.`,

      industryApplications: `Data centers represent the highest criticality UPS application, where even momentary power interruption can crash servers, corrupt data, and disrupt business operations. We provide complete data center power services including UPS maintenance, battery management, PDU service, and generator integration. Our monitoring solutions provide the visibility data center operators need.

Healthcare facilities depend on UPS protection for life-critical equipment including monitors, ventilators, and imaging systems. Medical UPS requirements include special attention to grounding, isolation, and electromagnetic compatibility. We understand healthcare regulatory requirements and provide documentation for Joint Commission and other accreditation surveys.

Financial institutions require UPS protection for trading systems, ATMs, and branch operations where downtime directly impacts revenue and customer service. We provide rapid response service for financial customers and can install temporary protection while repairs are completed.

Telecommunications infrastructure requires high-availability power protection for cell sites, switching centers, and internet exchange points. Our telecom UPS services include both facility UPS systems and specialized telecom power plants with -48VDC and other telecom power standards.`
    },
    href: '/services#ups',
    color: 'from-purple-600/20 to-violet-700/20',
    glowColor: 'shadow-purple-500/20',
    features: ['All UPS Brands', 'Battery Replacement', 'Load Testing', 'Preventive Maintenance', '24/7 Support', 'Remote Monitoring', 'Battery Disposal', 'Emergency Repair'],
    stats: { value: '1,000+', label: 'UPS Serviced' },
    subServices: [
      {
        name: 'UPS Installation',
        description: 'Professional installation including site survey, electrical preparation, equipment setup, and commissioning.',
        benefits: ['Proper sizing', 'Correct installation', 'User training', 'Warranty registration']
      },
      {
        name: 'Battery Bank Replacement',
        description: 'Complete battery replacement service with premium batteries, proper disposal, and functional testing.',
        benefits: ['Quality batteries', 'Proper disposal', 'Testing included', 'Extended warranty']
      },
      {
        name: 'Load Bank Testing',
        description: 'Controlled load testing to verify UPS capacity and battery runtime under actual load conditions.',
        benefits: ['Verify capacity', 'Test batteries', 'Identify issues', 'Documentation']
      },
      {
        name: 'Preventive Maintenance',
        description: 'Scheduled maintenance visits including inspection, testing, cleaning, and firmware updates.',
        benefits: ['Extended life', 'Prevent failures', 'Detailed reports', 'Priority response']
      },
      {
        name: 'Emergency Repair',
        description: '24/7 emergency response for UPS failures threatening critical operations.',
        benefits: ['Rapid response', 'Experienced technicians', 'Parts inventory', 'Temporary equipment']
      },
      {
        name: 'Capacity Upgrade',
        description: 'Upgrade existing UPS systems to handle increased load or provide longer runtime.',
        benefits: ['Avoid replacement', 'Modular expansion', 'Battery additions', 'Future-proof']
      },
      {
        name: 'Remote Monitoring Setup',
        description: 'Installation and configuration of network monitoring cards and management software.',
        benefits: ['Real-time alerts', 'Performance data', 'Event logging', 'Remote management']
      },
      {
        name: 'Power Audit',
        description: 'Comprehensive assessment of facility power quality and protection requirements.',
        benefits: ['Identify issues', 'Right-size protection', 'Reduce costs', 'Improve reliability']
      }
    ],
    detailedProblems: [
      {
        issue: 'UPS Not Holding Load',
        symptoms: ['Immediate shutdown on utility failure', 'Short runtime on battery', 'Battery low alarms', 'Frequent battery replacement warnings'],
        detailedSolution: `UPS failure to support load during utility outages defeats the entire purpose of the equipment and leaves critical systems unprotected. This problem is almost always battery-related, but systematic diagnosis ensures that the actual cause is identified and properly addressed. Simply replacing batteries without understanding why they failed may result in premature failure of replacement batteries.

Battery aging is the most common cause of reduced UPS runtime. Lead-acid batteries have finite life determined by the number of discharge cycles, depth of discharge, and operating temperature. Even with perfect conditions, VRLA batteries typically last 3-5 years before capacity degrades below acceptable levels. Battery age should be the first consideration when investigating runtime problems.

Battery testing using conductance or impedance methods identifies weak cells within battery strings. A single weak cell can dramatically reduce string capacity because cells are series-connected. Our testing identifies specific batteries needing replacement, potentially saving significant cost compared to replacing entire strings. However, when multiple batteries in a string test weak, complete string replacement is recommended for reliability.

Elevated temperature dramatically shortens battery life. For every 10°C above 25°C, battery life is approximately halved. Batteries in UPS units located in hot environments, or in UPS units with failed cooling fans, may fail in as little as one year. If temperature is contributing to battery failures, addressing the cooling issue must accompany battery replacement.

Charger problems can damage batteries or leave them inadequately charged. Verify charger output voltage and current during normal operation. Overcharging causes electrolyte loss and plate damage; undercharging causes sulfation and reduced capacity. If charger is malfunctioning, repair is needed before installing new batteries.

Load may have increased beyond original UPS sizing. As facilities add equipment, UPS load can exceed design capacity, reducing runtime. Measure actual load and compare to UPS capacity. If overloaded, either reduce load by moving non-critical equipment to non-UPS circuits, or upgrade to larger UPS.`,
        diagnosticSteps: [
          'Check battery age - replace if over 4 years typically',
          'Test individual battery conductance/impedance',
          'Verify charger output voltage matches battery requirements',
          'Measure UPS load percentage',
          'Check for elevated temperature in UPS location',
          'Test actual runtime with controlled load',
          'Review UPS event log for relevant alarms',
          'Inspect batteries for physical damage or swelling',
          'Verify battery connections are clean and tight',
          'Check for failed cooling fans in UPS'
        ],
        repairProcedure: [
          'Replace batteries that test below threshold',
          'Replace entire string if multiple failures',
          'Repair or replace faulty charger',
          'Address temperature issues in UPS location',
          'Add cooling if needed',
          'Verify connections after battery replacement',
          'Perform functional test with load',
          'Update runtime expectations based on actual load',
          'Document new battery installation date',
          'Establish testing schedule for new batteries'
        ],
        preventionTips: [
          'Test batteries quarterly using conductance/impedance methods',
          'Monitor UPS room temperature',
          'Replace batteries proactively at 4 years',
          'Don\'t exceed UPS rated load',
          'Ensure adequate cooling for UPS',
          'Address any charging anomalies promptly',
          'Keep battery terminals clean and tight'
        ],
        estimatedTime: '2-6 hours',
        estimatedCost: 'KES 15,000 - 150,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Battery conductance tester', 'Multimeter', 'Load bank', 'Infrared thermometer', 'Insulated tools']
      },
      {
        issue: 'Constant Beeping/Alarm',
        symptoms: ['Audible alarm from UPS', 'Alarm LED indicators lit', 'Alarm messages on display', 'Notification emails from monitoring'],
        detailedSolution: `UPS alarms indicate conditions requiring attention, ranging from minor issues to critical failures. Understanding alarm meanings and appropriate responses prevents both unnecessary service calls for minor alarms and dangerous delays in responding to serious conditions. Most UPS models provide multiple alarm types with distinct sounds and indicators.

Battery alarms are the most common, indicating low battery, battery fault, or battery replacement needed. Low battery during utility outage means batteries are discharging and UPS will shut down when depleted - reduce load or restore utility power. Battery fault indicates failed battery testing - schedule battery testing service. Replace battery warning means UPS has detected battery degradation requiring replacement.

Overload alarms indicate that connected load exceeds UPS capacity. Sustained overload can damage the UPS and will result in reduced runtime and possibly inability to support load during utility failure. Identify and remove non-critical loads from UPS circuits. If all connected loads are critical, UPS upgrade is needed.

Utility power alarms indicate problems with incoming power including high/low voltage, frequency deviation, and waveform distortion. While the UPS is protecting connected equipment from these issues, persistent power quality problems stress the UPS and reduce its effectiveness. Consider installing dedicated power conditioning upstream of the UPS.

Temperature alarms indicate overheating due to failed cooling, blocked ventilation, or excessive ambient temperature. Overheating damages batteries and electronics. Immediately reduce load if possible and improve ventilation. If alarm persists, UPS may need repair to cooling system.

Communication alarms indicate loss of monitoring connectivity. While not affecting UPS protection function, loss of monitoring means problems may not be noticed until they become critical. Restore communication links and investigate monitoring system.`,
        diagnosticSteps: [
          'Identify specific alarm from display or indicators',
          'Check UPS manual for alarm meaning',
          'Review event log for alarm history and sequence',
          'Measure relevant parameters - voltage, load, temperature',
          'Check for obvious issues - loose connections, blocked vents',
          'Verify utility power quality',
          'Test batteries if battery alarm',
          'Check communication connections if comm alarm',
          'Reduce load if overload alarm',
          'Improve ventilation if temperature alarm'
        ],
        repairProcedure: [
          'Clear alarm after addressing root cause',
          'Replace batteries if battery alarm persists',
          'Reduce load or upgrade UPS for overload',
          'Address power quality issues upstream',
          'Repair or replace cooling fans for temperature',
          'Restore communication links',
          'Update UPS firmware if available',
          'Adjust alarm thresholds if nuisance alarms',
          'Document resolution for future reference',
          'Establish monitoring to catch future alarms quickly'
        ],
        preventionTips: [
          'Configure alarm notifications to reach responsible personnel',
          'Don\'t ignore or silence alarms without investigating',
          'Maintain UPS within rated load and environmental specs',
          'Address power quality issues at facility level',
          'Include UPS in preventive maintenance program',
          'Keep spare batteries for quick replacement',
          'Train facility staff on basic alarm response'
        ],
        estimatedTime: '1-4 hours',
        estimatedCost: 'KES 3,000 - 30,000',
        difficultyLevel: 'Basic',
        toolsRequired: ['Multimeter', 'UPS manual', 'Laptop for monitoring software', 'Basic hand tools']
      }
    ],
    turnaroundTime: 'Same day for battery replacement, 1-3 days for repairs',
    priceRange: 'KES 5,000 - 500,000',
    requiredTools: [
      { name: 'Battery Conductance Tester', purpose: 'Accurately assess battery health and remaining life', importance: 'Essential' },
      { name: 'Load Bank', purpose: 'Apply controlled load for testing UPS capacity and runtime', importance: 'Essential' },
      { name: 'Digital Multimeter', purpose: 'Measure voltage, current, and continuity', importance: 'Essential' },
      { name: 'Thermal Camera', purpose: 'Identify hot spots indicating problems', importance: 'Recommended' },
      { name: 'Power Analyzer', purpose: 'Detailed analysis of power quality and UPS performance', importance: 'Recommended' },
      { name: 'Insulated Tools', purpose: 'Work safely on battery connections', importance: 'Essential' },
      { name: 'Laptop with Software', purpose: 'Access UPS configuration and event logs', importance: 'Essential' },
      { name: 'Battery Lifting Equipment', purpose: 'Safely handle heavy battery modules', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'Battery Safety',
        icon: '🔋',
        importance: 'Critical',
        overview: 'UPS batteries store significant energy and contain hazardous materials. Proper handling prevents shock, burns, and chemical exposure.',
        detailedExplanation: `Lead-acid batteries used in most UPS systems present multiple hazards that require respect and proper handling procedures. The electrical hazard from battery strings can be lethal - a typical 192V battery string can deliver thousands of amps through a short circuit, causing severe burns and potentially fatal electrocution. Chemical hazards from sulfuric acid electrolyte can cause severe burns to skin and eyes. Hydrogen gas produced during charging is explosive in sufficient concentration.

Battery short circuits occur when a conductive object bridges the positive and negative terminals of a battery or battery string. The resulting current flow can melt tools, ignite fires, and cause severe arc flash burns. Always use insulated tools when working on batteries. Remove watches, rings, and other jewelry that could contact terminals. Work on only one connection at a time, keeping the other terminal covered.

String voltage in large UPS systems can exceed 400VDC, well above lethal levels. Even a single 12V battery can deliver enough current to cause burns. When working on battery strings, treat all components as energized until verified. Use insulated gloves and tools rated for the voltage involved. Never assume a battery is "dead" based on age or condition.

Hydrogen gas is produced during battery charging, particularly when batteries are overcharged or near end of life. In enclosed UPS rooms with poor ventilation, hydrogen can accumulate to explosive concentrations. Ensure adequate ventilation in UPS rooms. Avoid creating sparks or flames near batteries. If hydrogen is suspected, ventilate the area before working.

Chemical hazards from battery electrolyte require appropriate PPE. Safety glasses protect eyes from splashes during handling. Gloves prevent skin contact with acid. If electrolyte contacts skin or eyes, flush immediately with large amounts of water for at least 15 minutes and seek medical attention.`,
        procedures: [
          'Wear safety glasses and gloves when handling batteries',
          'Use only insulated tools rated for battery voltage',
          'Remove all jewelry before battery work',
          'Work on one terminal at a time, keeping other covered',
          'Never place tools or conductive objects on batteries',
          'Ensure adequate ventilation before battery work',
          'Verify UPS is in bypass before battery work if possible',
          'Lift batteries properly - they are heavy',
          'Have neutralizing agent (baking soda) available',
          'Know location of eyewash station and first aid'
        ],
        commonMistakes: [
          'Using non-insulated tools on battery terminals',
          'Wearing jewelry that can contact terminals',
          'Placing tools on top of batteries',
          'Working in poorly ventilated battery rooms',
          'Underestimating battery weight for lifting',
          'Not wearing eye protection during battery work'
        ],
        emergencyProtocol: 'For acid exposure: Flush with water for 15+ minutes. Remove contaminated clothing. Seek medical attention. For electrical shock/burn: Remove victim from source using insulated object. Call emergency services. Treat burns with cool water. For fire: Use Class C or ABC extinguisher. Evacuate if fire cannot be quickly controlled.'
      },
      {
        title: 'Electrical Safety',
        icon: '⚡',
        importance: 'Critical',
        overview: 'UPS systems contain multiple voltage sources including utility input, battery DC, and inverter output. Proper isolation is essential.',
        detailedExplanation: `UPS systems are unique electrical equipment because they intentionally maintain power to connected loads even when utility power is removed. This means that normal isolation procedures may leave hazardous voltage present on UPS output terminals and within the equipment. Understanding UPS architecture is essential for safe service.

Double-conversion online UPS systems continuously power loads from the inverter, with utility power only charging batteries. The inverter produces hazardous AC voltage whenever the UPS is operating, regardless of utility connection. Placing the UPS in static bypass still leaves utility voltage present at the output. Complete isolation requires disconnecting both utility input and battery strings.

Stored energy in UPS power electronics includes large capacitors that can retain charge after disconnection. Capacitors in the DC bus can hold hundreds of volts for minutes after the UPS is turned off. Follow manufacturer procedures for verifying zero energy before working inside UPS cabinets. Some UPS models include capacitor discharge circuits that operate when the unit is properly shut down.

Multiple sources can energize UPS circuits. Utility input, generator input (if equipped), and batteries all provide power that appears at UPS terminals. External bypass switches can also energize UPS output independent of the UPS itself. Before beginning work, identify and isolate all possible energy sources.

High-frequency components in modern UPS designs can create shock hazards that are not detected by standard voltage testers. Switching transients and high-frequency components can couple to supposedly isolated circuits. Use appropriate test equipment and maintain clearances even from circuits that appear to be de-energized.`,
        procedures: [
          'Review UPS architecture before planning work',
          'Identify all energy sources - utility, generator, battery',
          'Place UPS in bypass if working on inverter section',
          'Disconnect and lock out all input sources',
          'Disconnect battery strings using proper procedures',
          'Wait for capacitor discharge per manufacturer specs',
          'Verify zero energy with appropriate tester',
          'Ground conductors before working on them',
          'Maintain clearances from potentially energized parts',
          'Re-verify isolation after any work interruption'
        ],
        commonMistakes: [
          'Assuming UPS output is dead when utility is off',
          'Forgetting about battery as an energy source',
          'Not waiting for capacitor discharge',
          'Using inadequate test equipment for DC circuits',
          'Working inside UPS without isolating batteries',
          'Not considering external bypass as energy source'
        ],
        emergencyProtocol: 'For electrical contact: Don\'t touch victim if still in contact with source. De-energize or use insulated object to separate. Call emergency services. Begin CPR if not breathing. For arc flash: Cool burns with water, cover with clean dressing. Seek immediate medical attention for any significant electrical injury.'
      }
    ],
    certifications: ['APC Certified Partner', 'Eaton Service Partner', 'Schneider Electric Qualified'],
    warranty: '90 days on repairs, manufacturer warranty on batteries'
  },
  {
    id: 'ac-refrigeration',
    name: 'AC & Refrigeration',
    icon: '❄️',
    iconBg: 'from-sky-500 to-cyan-600',
    shortDescription: 'Air conditioning and refrigeration services including installation, gas refill, repairs for all brands.',
    fullDescription: {
      overview: `Climate control and refrigeration systems are essential for comfort, productivity, and product preservation across Kenya's diverse applications. From residential air conditioners providing relief from Nairobi's heat to industrial cold rooms preserving agricultural products for export, these systems require specialized expertise for installation, maintenance, and repair. Emerson EiMS provides comprehensive HVAC and refrigeration services backed by certified technicians and quality parts.

Our air conditioning services cover the full spectrum from window units and split systems for homes and offices to VRF systems for commercial buildings and chilled water plants for large facilities. We work with all major brands including Daikin, Carrier, LG, Samsung, Mitsubishi, and others. Our technicians are trained in the specific requirements of each brand and maintain access to genuine spare parts and technical support.

Refrigeration services address commercial and industrial applications where temperature control is critical for product quality and safety. We service display coolers, walk-in cold rooms, blast freezers, and industrial process cooling systems. Our refrigeration technicians understand the specific requirements of food safety, pharmaceutical storage, and industrial processes that depend on precise temperature control.

Environmental responsibility is built into our service approach. We use proper refrigerant handling procedures that prevent atmospheric release of substances that damage the ozone layer and contribute to climate change. Our technicians are certified in refrigerant recovery and recycling. We stay current with evolving refrigerant regulations and help customers plan transitions to newer, more environmentally friendly refrigerants.`,

      technicalDetails: `Refrigeration cycles operate on the principle of heat transfer through phase changes of refrigerant. Understanding this cycle - compression, condensation, expansion, and evaporation - is fundamental to diagnosing and repairing any refrigeration or air conditioning system. Our technicians can trace the complete cycle, identify where problems occur, and implement proper repairs.

Refrigerants have evolved significantly due to environmental regulations. R-22 (HCFC) is being phased out due to ozone depletion potential, replaced by R-410A, R-32, and other alternatives. Each refrigerant has different properties requiring specific equipment, procedures, and safety precautions. We maintain equipment for handling multiple refrigerant types and advise customers on refrigerant transitions.

Inverter technology has transformed air conditioning efficiency by allowing compressor speed to vary with cooling demand. Inverter systems require different diagnostic approaches than fixed-speed units, including analysis of electronic drive components and communication between indoor and outdoor units. Our technicians are trained in inverter system diagnosis and repair.

VRF (Variable Refrigerant Flow) systems connect multiple indoor units to shared outdoor units, providing zoned comfort control for commercial buildings. VRF systems are more complex than traditional split systems, with sophisticated controls, refrigerant management, and fault diagnosis. We provide complete VRF services including installation, commissioning, maintenance, and repair.`,

      serviceScope: `Installation services ensure that new systems are properly sized, correctly installed, and optimally commissioned. We perform load calculations to determine required capacity, recommend appropriate equipment, and handle complete installation including electrical connections, drainage, and controls. Proper installation is critical for efficiency, reliability, and warranty coverage.

Maintenance programs keep systems operating efficiently and prevent costly breakdowns. Regular maintenance includes filter cleaning or replacement, coil cleaning, refrigerant charge verification, electrical inspection, and control testing. Maintenance frequency depends on usage and environment - dusty locations or continuous operation require more frequent service.

Repair services diagnose and fix problems ranging from minor issues like sensor failures to major repairs like compressor replacement. Our diagnostic approach identifies root causes rather than just symptoms, preventing recurring problems. We stock common parts for popular equipment and can source specialty parts when needed.

Gas refilling services address refrigerant loss that causes reduced cooling capacity. However, simply adding refrigerant without finding and fixing leaks is wasteful and ineffective. Our approach includes leak detection, repair, evacuation, and proper charging to manufacturer specifications.`,

      whyChooseUs: `Our certified technicians have completed training programs from major manufacturers and hold refrigerant handling certifications required by environmental regulations. This expertise means faster, more accurate diagnosis and repairs that address root causes rather than symptoms.

Quality parts are essential for reliable repairs. We use genuine or OEM-equivalent parts from reputable suppliers, avoiding the cheap counterfeit parts that are unfortunately common in the Kenyan market. Quality parts cost more initially but provide better performance and longer life.

Environmental compliance protects both the environment and our customers from regulatory penalties. We use proper refrigerant recovery equipment, maintain accurate records, and dispose of refrigerants through licensed channels. Our practices exceed minimum regulatory requirements.

Emergency service is available for critical refrigeration applications where temperature excursions can destroy valuable products. We understand the urgency when a cold room fails during the night and respond accordingly.`,

      industryApplications: `Commercial buildings including offices, retail spaces, and hotels depend on air conditioning for occupant comfort and productivity. We provide maintenance contracts that include regular service visits and priority emergency response. Our building system expertise extends to central plants, air handling units, and building automation integration.

Food service and retail refrigeration requires reliable temperature maintenance for food safety. We service display cases, walk-in coolers, and kitchen refrigeration for restaurants, supermarkets, and food processing facilities. Our technicians understand HACCP requirements and food safety regulations.

Cold chain logistics maintains product temperature from production through distribution to end customer. We service refrigerated warehouses, cold rooms, and transport refrigeration. Temperature monitoring and documentation support compliance with food safety and pharmaceutical regulations.

Industrial process cooling supports manufacturing operations that generate heat or require temperature-controlled environments. Applications include plastic molding, printing, data centers, and clean rooms. We design and maintain cooling systems matched to specific process requirements.`
    },
    href: '/services#ac',
    color: 'from-sky-600/20 to-cyan-700/20',
    glowColor: 'shadow-sky-500/20',
    features: ['All AC Brands', 'Gas Refilling', 'Leak Detection', 'VRF Systems', 'Cold Room Service', 'Preventive Maintenance', 'Emergency Repair', 'Installation'],
    stats: { value: '300+', label: 'Units Monthly' },
    subServices: [
      {
        name: 'AC Installation',
        description: 'Professional installation of split systems, multi-splits, and VRF systems with proper sizing and commissioning.',
        benefits: ['Load calculation', 'Quality installation', 'Warranty coverage', 'User training']
      },
      {
        name: 'Gas Recharge',
        description: 'Refrigerant recovery, leak repair, evacuation, and proper charging for all refrigerant types.',
        benefits: ['Leak detection first', 'Proper procedures', 'Correct charge', 'Environmental compliance']
      },
      {
        name: 'Compressor Replacement',
        description: 'Diagnosis and replacement of failed compressors with compatible units.',
        benefits: ['Proper diagnosis', 'Quality compressors', 'System flush', 'Warranty included']
      },
      {
        name: 'Duct Cleaning',
        description: 'Cleaning of ducted system components to improve air quality and efficiency.',
        benefits: ['Better air quality', 'Improved efficiency', 'Reduced allergens', 'Extended life']
      },
      {
        name: 'VRF System Service',
        description: 'Specialized service for Variable Refrigerant Flow systems including commissioning and troubleshooting.',
        benefits: ['Brand-certified', 'Complete diagnosis', 'Control optimization', 'Training available']
      },
      {
        name: 'Cold Room Service',
        description: 'Maintenance and repair of walk-in coolers, freezers, and cold storage facilities.',
        benefits: ['Temperature critical', 'Food safety focus', 'Emergency response', 'Monitoring options']
      },
      {
        name: 'Chiller Service',
        description: 'Service for air-cooled and water-cooled chillers including compressor and controls.',
        benefits: ['All chiller types', 'Efficiency optimization', 'Controls expertise', 'Retrofit options']
      },
      {
        name: 'Preventive Maintenance',
        description: 'Scheduled maintenance programs to maximize efficiency and prevent breakdowns.',
        benefits: ['Extended equipment life', 'Energy savings', 'Fewer breakdowns', 'Priority service']
      }
    ],
    detailedProblems: [
      {
        issue: 'AC Not Cooling',
        symptoms: ['Warm air from vents', 'Unit running but no temperature drop', 'Ice formation on pipes', 'High electricity bills'],
        detailedSolution: `Air conditioning that fails to provide adequate cooling frustrates occupants and can indicate problems ranging from simple maintenance issues to major component failures. Systematic diagnosis identifies the actual cause, preventing unnecessary repairs and ensuring that the real problem is addressed. Understanding the refrigeration cycle guides efficient troubleshooting.

Low refrigerant charge is a common cause of poor cooling, but it's important to understand that refrigerant doesn't "wear out" - if the system is low, there's a leak somewhere. Simply adding refrigerant without finding and fixing the leak is wasteful and provides only temporary improvement. Our approach includes leak detection using electronic detectors and UV dye, repair of identified leaks, proper evacuation, and charging to manufacturer specifications.

Airflow problems reduce heat transfer at the evaporator coil, limiting cooling capacity. Dirty air filters are the most common cause and are easily remedied by cleaning or replacement. Dirty evaporator coils reduce heat transfer and can cause ice formation. Blower problems including failed motors, worn belts, or incorrect speed settings also reduce airflow. We inspect the complete air path from return to supply.

Condenser problems reduce the system's ability to reject heat to outdoors. Dirty condenser coils are common, especially in dusty environments, and cleaning often restores normal operation. Failed condenser fan motors prevent airflow across the coil. High ambient temperature during extreme heat can push condensing pressure above the system's capacity.

Compressor problems are more serious and expensive to repair. Compressors can fail mechanically (internal wear, broken valves) or electrically (motor winding failure). Diagnosis includes checking electrical values (current draw, winding resistance, insulation) and refrigerant pressures. Compressor replacement is warranted when diagnosis confirms internal failure.

Control problems can prevent proper operation even when all mechanical components are functional. Thermostats may be miscalibrated or located in poor locations. Control boards can fail, preventing proper sequencing. Sensors may read incorrectly, causing improper operation. We check all control components as part of comprehensive diagnosis.`,
        diagnosticSteps: [
          'Check thermostat setting and operation',
          'Inspect and clean/replace air filter',
          'Measure supply and return air temperatures',
          'Check for ice formation indicating low charge or airflow',
          'Measure refrigerant pressures (suction and discharge)',
          'Inspect evaporator and condenser coils',
          'Verify condenser fan operation',
          'Check compressor electrical values',
          'Verify blower operation and speed',
          'Check for refrigerant leaks if charge is low'
        ],
        repairProcedure: [
          'Clean or replace dirty filters',
          'Clean evaporator and condenser coils',
          'Repair any refrigerant leaks found',
          'Recover, evacuate, and recharge refrigerant',
          'Replace failed electrical components',
          'Replace compressor if diagnosed as failed',
          'Adjust controls for proper operation',
          'Verify repair by measuring temperatures and pressures',
          'Document refrigerant quantities per regulations',
          'Advise customer on maintenance to prevent recurrence'
        ],
        preventionTips: [
          'Clean or replace filters monthly',
          'Schedule professional maintenance annually',
          'Keep condenser coils clean and unobstructed',
          'Address small problems before they become large',
          'Don\'t oversize AC - properly sized units cool better',
          'Consider shade or covers to reduce condenser heat load',
          'Operate at reasonable temperature setpoints'
        ],
        estimatedTime: '1-4 hours',
        estimatedCost: 'KES 5,000 - 45,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Manifold gauge set', 'Electronic leak detector', 'Thermometer', 'Clamp meter', 'Vacuum pump']
      },
      {
        issue: 'Water Leaking from Unit',
        symptoms: ['Water dripping from indoor unit', 'Water stains on ceiling or walls', 'Musty odor', 'Unit shutting down on float switch'],
        detailedSolution: `Water leakage from air conditioning units is a common problem that can cause significant property damage if not promptly addressed. The water originates as condensation formed when warm humid air passes over the cold evaporator coil - this is normal and expected. The problem occurs when this condensate doesn't drain properly and overflows from the drain pan.

Drain line blockage is the most common cause of condensate overflow. Algae, mold, and debris accumulate in drain lines over time, eventually blocking flow completely. The blockage may be in the drain pan, the drain line itself, or at the discharge point. We clear blockages using compressed air, wet/dry vacuum, or chemical treatments depending on location and severity.

Drain line installation problems cause chronic drainage issues. Improper slope prevents gravity flow. Trapped sections accumulate water and debris. Lines that are too small or have too many fittings restrict flow. We evaluate drain line routing and recommend modifications when needed.

Drain pan issues include cracked pans, corroded pans in older units, and overflow due to tilted installation. The primary drain pan under the evaporator coil should be level or slightly sloped toward the drain. Some units have secondary drain pans that should remain dry under normal operation - water in the secondary pan indicates primary drainage problems.

Condensate pump failures affect units where gravity drainage isn't possible. Pump failures can be mechanical (pump motor) or electrical (float switch, control). Some pumps include alarm contacts that shut down the AC when the pump fails. We repair or replace failed pumps and verify proper operation.

Ice melting can cause sudden large water releases that overwhelm drainage capacity. If an AC unit has been running with restricted airflow or low refrigerant, ice accumulates on the evaporator. When the unit is turned off or the ice is thawed during service, a large volume of water is released quickly. This is not a drainage problem but rather an indicator of the underlying issue that caused the ice.`,
        diagnosticSteps: [
          'Identify source of water - indoor unit, drain line, or other',
          'Check drain pan for standing water or cracks',
          'Verify drain line slope and routing',
          'Check for blockage in drain line',
          'Test condensate pump if equipped',
          'Verify float switch operation',
          'Check for ice on evaporator that may be melting',
          'Inspect drain line discharge point',
          'Check secondary drain pan if accessible',
          'Look for signs of chronic water damage'
        ],
        repairProcedure: [
          'Clear drain line blockage using appropriate method',
          'Clean drain pan and treat with algaecide',
          'Repair or replace cracked drain pan',
          'Correct drain line slope and routing issues',
          'Replace failed condensate pump',
          'Install or repair float switch safety',
          'Address ice formation if present (separate issue)',
          'Test drainage by pouring water into pan',
          'Install drain line clean-out if not present',
          'Recommend maintenance to prevent recurrence'
        ],
        preventionTips: [
          'Include drain line cleaning in regular maintenance',
          'Use algaecide tablets in drain pan',
          'Install drain pan float switch for protection',
          'Check drain line discharge point is clear',
          'Clean or replace filters to prevent ice formation',
          'Don\'t ignore occasional drips - they indicate developing problems',
          'Consider drain line clean-out for easier maintenance'
        ],
        estimatedTime: '1-2 hours',
        estimatedCost: 'KES 2,000 - 12,000',
        difficultyLevel: 'Basic',
        toolsRequired: ['Wet/dry vacuum', 'Compressed air', 'Drain line brush', 'Algaecide tablets', 'Float switch tester']
      }
    ],
    turnaroundTime: 'Same day service for most issues',
    priceRange: 'KES 3,000 - 150,000',
    requiredTools: [
      { name: 'Manifold Gauge Set', purpose: 'Measure refrigerant pressures for diagnosis and charging', importance: 'Essential' },
      { name: 'Vacuum Pump', purpose: 'Evacuate systems before charging', importance: 'Essential' },
      { name: 'Electronic Leak Detector', purpose: 'Locate refrigerant leaks', importance: 'Essential' },
      { name: 'Recovery Machine', purpose: 'Recover refrigerant before opening system', importance: 'Essential' },
      { name: 'Digital Scale', purpose: 'Accurate refrigerant charging', importance: 'Essential' },
      { name: 'Thermometer', purpose: 'Measure air and surface temperatures', importance: 'Essential' },
      { name: 'Clamp Meter', purpose: 'Measure motor and compressor current', importance: 'Essential' },
      { name: 'Nitrogen Kit', purpose: 'Pressure testing and leak detection', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'Refrigerant Safety',
        icon: '❄️',
        importance: 'Critical',
        overview: 'Refrigerants can cause frostbite, asphyxiation, and environmental damage. Proper handling protects technicians and environment.',
        detailedExplanation: `Refrigerants present several hazards that require understanding and respect. Liquid refrigerant released to atmosphere rapidly evaporates, absorbing heat and causing severe frostbite on contact with skin or eyes. In enclosed spaces, refrigerant vapor can displace oxygen and cause asphyxiation without warning - many refrigerants are odorless. Certain refrigerants decompose into toxic products when exposed to flame or very high temperatures.

Pressure hazards exist in all refrigeration work. System pressures can exceed 400 psi, and refrigerant cylinders contain pressurized liquid that expands dramatically if released. Never heat refrigerant cylinders to increase pressure. Never fill cylinders beyond rated capacity. Always connect hoses securely before opening valves.

Environmental regulations restrict refrigerant release and require proper handling, recovery, and disposal. In Kenya, F-gas regulations are being implemented following international protocols. Technicians must be certified for refrigerant handling. Records of refrigerant quantities used must be maintained. Intentional venting of refrigerant is prohibited.

Oxygen displacement in enclosed spaces is a serious risk when working with refrigerants. Refrigerant leaks in machine rooms, cold rooms, or other confined spaces can create oxygen-deficient atmospheres. The danger is insidious because most refrigerants are odorless and the victim may not realize the atmosphere is dangerous until they collapse. Always ensure adequate ventilation when refrigerant release is possible.

High-temperature decomposition of certain refrigerants produces toxic gases including phosgene, hydrogen fluoride, and hydrogen chloride. This can occur when refrigerant contacts open flames, brazing operations, or heating elements. Never use open flame leak detection. Ensure good ventilation during brazing operations. Evacuate refrigerant before any hot work on the system.`,
        procedures: [
          'Wear safety glasses and gloves when handling refrigerant',
          'Work in well-ventilated areas',
          'Never heat refrigerant cylinders',
          'Use recovery equipment - never vent refrigerant',
          'Keep cylinders secured and valves closed when not in use',
          'Monitor for refrigerant leaks in confined spaces',
          'Never use open flames for leak detection',
          'Evacuate refrigerant before brazing',
          'Maintain certification and handle refrigerant legally',
          'Know emergency procedures for refrigerant exposure'
        ],
        commonMistakes: [
          'Venting "small amounts" of refrigerant',
          'Working in confined spaces without ventilation',
          'Using open flame for leak detection',
          'Brazing with refrigerant in system',
          'Not wearing eye protection during charging',
          'Overfilling refrigerant cylinders'
        ],
        emergencyProtocol: 'For frostbite: Don\'t rub affected area. Warm gradually with body heat or lukewarm water. Seek medical attention. For asphyxiation: Move victim to fresh air. Call emergency services. Begin CPR if not breathing. For eye contact: Flush with water for 15+ minutes. Seek immediate medical attention.'
      }
    ],
    certifications: ['F-Gas Certified', 'Daikin Proshop Partner', 'Carrier Certified Technicians'],
    warranty: '90 days on repairs, manufacturer warranty on parts'
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: '💡',
    iconBg: 'from-amber-500 to-orange-600',
    shortDescription: 'Complete electrical services including wiring, panel installation, earthing systems, and power factor correction.',
    fullDescription: {
      overview: `Electrical systems are the foundation of modern facilities, powering everything from lights and computers to heavy industrial machinery. Safe, reliable electrical installations require expertise in design, installation, and maintenance. Emerson EiMS provides comprehensive electrical services from residential wiring to industrial installations, backed by licensed electricians and compliance with Kenya Bureau of Standards requirements.

Our electrical team includes EPRA-licensed electricians qualified for work at all voltage levels. We understand Kenyan wiring regulations and ensure all work meets or exceeds code requirements. Our installations pass inspection the first time, avoiding delays and rework that plague unqualified installers.

Industrial electrical expertise sets us apart from residential-focused electricians. We design and install motor control centers, power factor correction systems, variable frequency drives, and process control wiring. Our experience with industrial equipment means we understand the requirements for reliable operation in demanding environments.

Electrical safety is paramount in all our work. Poor electrical installation causes fires, electrocution, and equipment damage. We use proper materials, follow proven techniques, and test all work before energization. Our commitment to safety protects our customers and their facilities.`,

      technicalDetails: `Electrical system design starts with load analysis to determine the total connected load, demand factors, and future growth allowance. Wire sizing considers continuous and non-continuous loads, voltage drop over long runs, and ambient temperature derating. Protection coordination ensures that faults are cleared by the nearest protective device without affecting upstream equipment.

Power quality issues including voltage sags, harmonics, and power factor problems affect sensitive equipment and increase energy costs. We diagnose power quality issues using professional-grade analyzers and implement solutions including harmonic filters, power factor correction capacitors, and voltage regulators. Improved power quality reduces equipment failures and energy consumption.

Grounding and bonding systems protect people from electric shock and equipment from voltage surges. We design and install grounding systems that meet NEC/IEC requirements, including ground grids, ground rods, and bonding connections. Proper grounding is essential for safety and for proper operation of protective devices.

Motor control systems range from simple across-the-line starters to sophisticated variable frequency drives with process integration. We design motor control panels, install VFDs, and configure drives for optimal performance. Our motor control expertise extends to coordination with mechanical systems for pumps, fans, conveyors, and other industrial equipment.`,

      serviceScope: `New construction electrical involves complete installation from service entrance through distribution to final circuits. We work with architects and mechanical engineers to coordinate electrical requirements during design. Our installations include conduit systems, wire pulling, panel installation, device installation, and final connections. We provide testing and commissioning to verify proper operation.

Electrical maintenance keeps systems safe and reliable. Thermal imaging identifies hot connections before they fail. Insulation testing verifies cable integrity. Protective device testing confirms that breakers will trip when needed. We offer maintenance contracts that include regular inspections and priority emergency response.

Electrical repairs address problems ranging from simple outlet replacement to major panel repairs. We diagnose causes of trips and failures rather than simply resetting breakers. Circuit tracing locates breaks and shorts in hidden wiring. Our repair work restores full function while meeting code requirements.

Electrical upgrades increase capacity, improve safety, or add capability. Panel upgrades provide additional circuits for expanded loads. Service upgrades from single-phase to three-phase support industrial equipment. Surge protection installation protects sensitive equipment from voltage spikes.`,

      whyChooseUs: `EPRA licensing demonstrates our commitment to legal compliance and professional standards. Licensed electricians have demonstrated knowledge through examination and maintain their qualifications through continuing education. Working with licensed electricians protects our customers from liability and ensures quality work.

Industrial experience means we understand the unique requirements of commercial and industrial facilities. We've installed systems in factories, warehouses, hospitals, and data centers. This experience translates to practical solutions that work in demanding real-world conditions.

Testing and verification ensures that every installation functions correctly and safely. We use professional test equipment including insulation testers, earth testers, and power analyzers. All work is tested before being placed in service, and we provide test documentation for customer records.

Safety culture permeates everything we do. Our electricians follow safe work practices, use appropriate PPE, and maintain awareness of electrical hazards. We've maintained an excellent safety record because we take safety seriously.`,

      industryApplications: `Commercial buildings require reliable electrical systems for lighting, HVAC, elevators, and tenant loads. We design and install complete building electrical systems including emergency power, fire alarm, and security system integration. Our maintenance programs keep commercial properties safe and operational.

Industrial facilities present the most demanding electrical environments with large motors, high fault currents, and complex control requirements. We install motor control centers, power distribution, and process wiring. Our industrial experience ensures installations that perform reliably in harsh conditions.

Healthcare facilities require electrical systems that meet stringent codes for patient safety. Isolated power systems, emergency power, and equipment grounding follow specific healthcare requirements. We understand Joint Commission requirements and provide documentation for accreditation.

Data centers demand extremely reliable power with tight tolerances on power quality. We install UPS systems, PDUs, and redundant power distribution. Our data center experience includes design assistance for new facilities and upgrades for existing installations.`
    },
    href: '/services#electrical',
    color: 'from-amber-600/20 to-orange-700/20',
    glowColor: 'shadow-amber-500/20',
    features: ['Industrial Wiring', 'Panel Installation', 'Earthing Systems', 'Power Factor', 'Safety Audits', 'Motor Controls', 'Emergency Repairs', 'Thermal Imaging'],
    stats: { value: '150+', label: 'Projects Yearly' },
    subServices: [
      {
        name: 'House Wiring',
        description: 'Complete residential electrical installation meeting Kenya Bureau of Standards requirements.',
        benefits: ['Code compliant', 'Quality materials', 'Safety focus', 'Inspection ready']
      },
      {
        name: 'Industrial Wiring',
        description: 'Heavy-duty electrical installation for factories, warehouses, and industrial facilities.',
        benefits: ['Industrial expertise', 'Motor circuits', 'Proper sizing', 'Future-ready']
      },
      {
        name: 'Distribution Board Installation',
        description: 'Installation and upgrade of electrical distribution panels.',
        benefits: ['Proper sizing', 'Quality components', 'Labeling included', 'Room for expansion']
      },
      {
        name: 'Earthing & Lightning Protection',
        description: 'Ground system installation and lightning protection for buildings and equipment.',
        benefits: ['Safety compliance', 'Equipment protection', 'Testing included', 'Documentation']
      },
      {
        name: 'Power Factor Correction',
        description: 'Capacitor bank installation to improve power factor and reduce electricity costs.',
        benefits: ['Lower bills', 'Reduced penalties', 'Improved capacity', 'Monitoring option']
      },
      {
        name: 'Cable Jointing',
        description: 'Professional jointing of power cables including medium voltage.',
        benefits: ['Certified jointers', 'Quality materials', 'Testing included', 'Warranty']
      },
      {
        name: 'Electrical Safety Audit',
        description: 'Comprehensive inspection and testing of electrical systems.',
        benefits: ['Identify hazards', 'Prioritize repairs', 'Insurance compliance', 'Detailed report']
      },
      {
        name: 'Emergency Repairs',
        description: '24/7 emergency response for electrical failures.',
        benefits: ['Rapid response', 'Experienced technicians', 'Temporary solutions', 'Permanent repairs']
      }
    ],
    detailedProblems: [
      {
        issue: 'Frequent Circuit Breaker Trips',
        symptoms: ['Breakers trip repeatedly', 'Same circuit always trips', 'Trips under normal load', 'Multiple circuits trip together'],
        detailedSolution: `Circuit breakers that trip frequently indicate a problem that needs investigation - they're protecting the circuit from a condition that could cause damage or fire. Simply resetting the breaker without investigating the cause ignores a potentially dangerous situation. Understanding why breakers trip guides proper diagnosis and repair.

Overload occurs when the total current demand on a circuit exceeds the breaker rating. This might indicate too many devices on the circuit, or a single device drawing more current than expected. Measure the actual current using a clamp meter and compare to breaker rating. If overloaded, either reduce load or install additional circuits. Never replace a breaker with a larger size without verifying that wiring can handle increased current.

Short circuits occur when hot and neutral conductors contact each other, creating a low-resistance path that draws massive current. The breaker trips immediately, usually with a significant spark or pop. Short circuits can result from damaged wiring, failed equipment, or improper connections. Isolate sections of the circuit to locate the fault, then repair or replace the damaged component.

Ground faults occur when hot conductor contacts ground, either through equipment chassis or through contact with grounded surfaces. Ground faults can trip standard breakers but are better detected by ground fault circuit interrupters (GFCIs). If a GFCI trips, the fault may be small but still dangerous - investigate rather than simply resetting.

Arc faults occur when damaged or loose connections create arcing that can ignite surrounding materials. Arc faults may not draw enough current to trip standard breakers. Arc fault circuit interrupters (AFCIs) detect the characteristic signature of arcing and trip to prevent fires. AFCI trips should always be investigated, not just reset.

Breaker failure can cause trips even without actual circuit problems. Breakers can become sensitive with age, tripping at currents below their rating. Heat damage from previous overloads can weaken breaker mechanisms. Test suspected breakers or replace them with known-good units for comparison.`,
        diagnosticSteps: [
          'Note which breaker trips and under what conditions',
          'Measure load current with clamp meter',
          'Compare measured current to breaker rating',
          'Check for signs of overheating at breaker or connections',
          'Test breaker with increasing load to verify trip point',
          'Disconnect loads and test circuit empty',
          'Reconnect loads one at a time to identify problem',
          'Inspect visible wiring for damage',
          'Use insulation tester on circuits with suspected shorts',
          'Check for water damage or contamination'
        ],
        repairProcedure: [
          'Reduce load if circuit is overloaded',
          'Install additional circuits if more capacity needed',
          'Repair damaged wiring causing shorts',
          'Replace failed equipment causing faults',
          'Tighten loose connections causing arcing',
          'Replace damaged or contaminated devices',
          'Replace breaker if testing shows it is faulty',
          'Verify repair by testing under load',
          'Document findings and repairs',
          'Recommend improvements if underlying issues exist'
        ],
        preventionTips: [
          'Don\'t overload circuits - know circuit capacity',
          'Use surge protectors for sensitive equipment',
          'Have professional inspect older wiring',
          'Replace damaged cords and outlets promptly',
          'Keep electrical panels accessible and clean',
          'Label circuits for easy identification',
          'Consider AFCI breakers for added protection'
        ],
        estimatedTime: '2-4 hours',
        estimatedCost: 'KES 5,000 - 35,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Clamp meter', 'Multimeter', 'Insulation tester', 'Circuit tracer', 'Thermal camera']
      }
    ],
    turnaroundTime: '1-5 days depending on scope',
    priceRange: 'KES 5,000 - 500,000',
    requiredTools: [
      { name: 'Insulation Tester (Megger)', purpose: 'Test cable and winding insulation resistance', importance: 'Essential' },
      { name: 'Earth Tester', purpose: 'Measure grounding system resistance', importance: 'Essential' },
      { name: 'Phase Rotation Meter', purpose: 'Verify correct phase sequence', importance: 'Essential' },
      { name: 'Power Analyzer', purpose: 'Measure power quality and energy consumption', importance: 'Recommended' },
      { name: 'Thermal Camera', purpose: 'Identify hot connections before failure', importance: 'Recommended' },
      { name: 'Cable Fault Locator', purpose: 'Find breaks and shorts in buried cables', importance: 'Recommended' },
      { name: 'Digital Multimeter', purpose: 'General electrical measurements', importance: 'Essential' },
      { name: 'Clamp Meter', purpose: 'Measure current without disconnection', importance: 'Essential' }
    ],
    safetyGuidelines: [
      {
        title: 'Electrical Isolation',
        icon: '⚡',
        importance: 'Critical',
        overview: 'De-energize circuits before work and verify absence of voltage. Lock-out tag-out prevents accidental energization.',
        detailedExplanation: `Electrical work is inherently dangerous because electricity is invisible and lethal. Even low voltages can kill under certain conditions, and standard commercial and industrial voltages are always potentially fatal. The only safe approach is to completely de-energize circuits before working on them and to verify the absence of voltage before touching any conductor.

Lock-out tag-out (LOTO) procedures provide documented control over energy isolation. Each worker applies their personal lock to isolation devices, preventing re-energization while they are working. Tags document who is working and when work began. The system ensures that equipment cannot be energized until all workers have completed their tasks and removed their locks.

Verification of de-energized state must be performed before any work begins. Never trust labels, positions, or indicators - always test for voltage with a properly functioning tester. Test the tester on a known live source before and after testing the work area to verify the tester is operating correctly. "Test before you touch" should be automatic behavior.

Multiple energy sources can energize circuits unexpectedly. Generators, solar systems, UPS systems, and feedback from motor loads can all create hazardous voltage even when the main supply is disconnected. Identify all possible energy sources and isolate each one. Consider stored energy in capacitors that can discharge through workers.

Work on energized circuits should only be performed when absolutely necessary and when de-energization would create greater hazards. Live work requires specific procedures, specialized PPE including arc-rated clothing, and risk assessment documentation. Most routine work does not justify the risk of live work.`,
        procedures: [
          'Identify all energy sources that could energize the work area',
          'Notify affected personnel that systems will be de-energized',
          'Open disconnects and circuit breakers',
          'Apply personal lock and tag to each isolation point',
          'Test voltage tester on known live source',
          'Verify absence of voltage on all conductors',
          'Test voltage tester again to verify it still works',
          'Ground conductors if working on high-energy systems',
          'Work only on verified de-energized circuits',
          'Remove locks only when work is complete and safe to re-energize'
        ],
        commonMistakes: [
          'Trusting labels or indicators instead of testing',
          'Using someone else\'s lock-out instead of personal lock',
          'Not testing voltage tester before and after',
          'Forgetting about backup power sources',
          'Leaving circuits energized "because it\'s just a small job"',
          'Working alone on hazardous electrical systems'
        ],
        emergencyProtocol: 'For electrical shock: Don\'t touch victim - de-energize or use insulated object to separate. Call emergency services. Begin CPR if not breathing. For arc flash: Cool burns with water, cover with sterile dressing. Seek immediate medical attention for any electrical injury, even if victim feels fine.'
      }
    ],
    certifications: ['EPRA Electrical Contractor License Class A', 'Kenya Bureau of Standards Certified'],
    warranty: '12 months on workmanship, manufacturer warranty on materials'
  }
];

export default ENHANCED_SERVICES_PART3;
