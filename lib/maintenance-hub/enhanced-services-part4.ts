/**
 * Enhanced Maintenance Hub Services Data - Part 4
 * Welding & Fabrication, Solar Systems, Industrial Controls
 */

import { EnhancedServiceCategory } from './enhanced-services-data';

export const ENHANCED_SERVICES_PART4: EnhancedServiceCategory[] = [
  {
    id: 'welding',
    name: 'Welding & Fabrication',
    icon: '🔥',
    iconBg: 'from-red-500 to-rose-600',
    shortDescription: 'Professional welding and metal fabrication including steel structures, gates, grilles, repairs, and custom work.',
    fullDescription: {
      overview: `Metal fabrication and welding services form a critical part of construction, manufacturing, and maintenance activities across Kenya. From structural steel for buildings to security gates for homes, from industrial equipment repairs to custom fabrication projects, skilled welding is essential for creating strong, durable metal assemblies. Emerson EiMS provides comprehensive welding and fabrication services backed by certified welders and quality materials.

Our welding capabilities span all common processes including shielded metal arc welding (SMAW/stick), gas metal arc welding (GMAW/MIG), gas tungsten arc welding (GTAW/TIG), and oxy-fuel welding and cutting. Each process has specific applications, and our welders are certified in multiple processes to address any project requirement. We select the appropriate process based on material type, thickness, position, and quality requirements.

Fabrication services go beyond welding to include cutting, forming, machining, and assembly of metal components. Our workshop includes plasma and oxy-fuel cutting systems, hydraulic press brakes, and drilling equipment. We can fabricate from customer drawings or design custom solutions based on functional requirements. Quality control includes dimensional inspection and weld testing as appropriate.

Field welding services bring our expertise to customer sites for repairs, modifications, and installations that cannot be performed in our workshop. Our mobile welding units are equipped with generators, welding machines, and safety equipment for effective on-site work. We've performed field welding in factories, on construction sites, and at remote locations throughout Kenya.`,

      technicalDetails: `Weld quality depends on proper material selection, joint preparation, welding parameters, and welder technique. We use welding procedure specifications (WPS) that define all parameters for consistent, quality welds. Our welders are qualified to these procedures through testing that verifies they can produce sound welds consistently. This systematic approach ensures reliable welds on every project.

Material selection must match the application requirements for strength, corrosion resistance, and appearance. Mild steel is economical for most structural applications. Stainless steel provides corrosion resistance for food processing, chemical handling, and architectural applications. Aluminum requires special techniques but offers light weight and corrosion resistance. We stock common materials and can source specialty alloys for specific applications.

Joint design and preparation significantly affect weld quality. Proper joint design provides adequate access for welding and ensures the weld can carry required loads. Edge preparation including beveling, cleaning, and fit-up must be completed before welding. Tack welds hold components in position during welding. We take time for proper preparation because it directly affects final quality.

Post-weld treatments improve weld properties and appearance. Stress relief heat treatment reduces residual stresses in heavy weldments. Grinding and finishing provide smooth, attractive surfaces. Painting or galvanizing protects against corrosion. Non-destructive testing including visual inspection, dye penetrant, and ultrasonic testing verifies weld integrity for critical applications.`,

      serviceScope: `Structural steel fabrication and erection includes beams, columns, trusses, platforms, and stairs for buildings and industrial facilities. We work from engineer drawings or can provide design assistance for simpler structures. Our work meets Kenya Bureau of Standards requirements for structural steel. We coordinate with construction contractors for efficient project completion.

Security products including gates, grilles, doors, and fencing protect homes and businesses throughout Kenya. We design products that combine security function with attractive appearance. Options range from economical mild steel to premium stainless steel and aluminum. Installation services include mounting hardware, automation systems, and access control integration.

Industrial equipment repair saves significant cost compared to equipment replacement. We repair worn components, fabricate replacement parts, and modify equipment for changed requirements. Common repairs include hopper and chute lining, conveyor components, tanks and vessels, and structural repairs. Our understanding of industrial equipment means effective repairs that restore full function.

Custom fabrication creates products tailored to specific requirements. Whether you need a specialized tool, a one-of-a-kind fixture, or a production run of custom components, we can deliver. Our process includes design consultation, material selection, fabrication, finishing, and delivery.`,

      whyChooseUs: `Certified welders demonstrate verified skill through testing to international standards. Our welders hold certifications to AWS D1.1 (structural steel), AWS D1.2 (aluminum), and ASME Section IX (pressure vessels). Certification requires passing practical tests that verify ability to produce sound welds consistently. This investment in certification reflects our commitment to quality.

Quality materials from reputable suppliers ensure weld integrity. We use specified filler metals matched to base materials, shielding gases appropriate for the process and material, and base materials with proper mill certifications. Avoiding substandard materials that can produce defective welds is essential for reliability.

Complete services from design through installation provide single-source responsibility. We can develop designs, fabricate in our workshop, deliver to site, and install completed work. This integrated approach streamlines projects and provides clear accountability for results.

Warranty on workmanship demonstrates confidence in our work. We stand behind our welds and will repair any defects that occur under normal service conditions. This warranty reflects our quality systems that produce consistently good work.`,

      industryApplications: `Construction industry relies on structural steel fabrication for building frames, equipment supports, and architectural features. We've provided steelwork for commercial buildings, industrial facilities, and residential projects. Our ability to meet project schedules and quality requirements has made us a preferred fabricator for major contractors.

Manufacturing facilities require metal fabrication for equipment, material handling systems, guards, and enclosures. We understand the demands of manufacturing environments and provide products that withstand industrial use. Quick turnaround for repairs minimizes production downtime.

Agriculture sector uses fabricated metal products for equipment, storage facilities, and processing operations. We've built grain storage silos, animal handling equipment, and irrigation system components. Our rural service capability means we can support agricultural customers throughout Kenya.

Residential and commercial property owners invest in security products including gates, grilles, and fencing. We provide design consultation to balance security, aesthetics, and budget. Our products protect thousands of properties across Kenya.`
    },
    href: '/services#welding',
    color: 'from-red-600/20 to-rose-700/20',
    glowColor: 'shadow-red-500/20',
    features: ['Arc Welding', 'MIG/TIG Welding', 'Steel Structures', 'Gate Fabrication', 'Repairs', 'Custom Work', 'On-Site Welding', 'Certified Welders'],
    stats: { value: '100+', label: 'Projects Monthly' },
    subServices: [
      {
        name: 'Arc Welding (SMAW)',
        description: 'Shielded metal arc welding for general fabrication and repair applications.',
        benefits: ['Versatile process', 'Field capable', 'All positions', 'Economical']
      },
      {
        name: 'MIG Welding (GMAW)',
        description: 'Gas metal arc welding for high-productivity fabrication and thin materials.',
        benefits: ['High speed', 'Clean welds', 'Less spatter', 'Easy to learn']
      },
      {
        name: 'TIG Welding (GTAW)',
        description: 'Gas tungsten arc welding for precision work and exotic materials.',
        benefits: ['Precise control', 'Stainless steel', 'Aluminum', 'Beautiful welds']
      },
      {
        name: 'Structural Steel',
        description: 'Fabrication and erection of structural steel for buildings and industrial facilities.',
        benefits: ['KBS compliant', 'Shop drawings', 'Site erection', 'Testing available']
      },
      {
        name: 'Gate & Grille Fabrication',
        description: 'Custom security gates, grilles, doors, and fencing for properties.',
        benefits: ['Custom designs', 'Security focus', 'Installation included', 'Automation option']
      },
      {
        name: 'Tank Repairs',
        description: 'Repair of storage tanks including leak repair, lining, and structural reinforcement.',
        benefits: ['All tank types', 'Minimal downtime', 'Certified procedures', 'Testing included']
      },
      {
        name: 'Pipe Welding',
        description: 'Welding of piping systems for process, utilities, and structural applications.',
        benefits: ['All materials', 'Pressure rated', 'Certified welders', 'Testing available']
      },
      {
        name: 'Aluminum Welding',
        description: 'Specialized welding of aluminum for boats, vehicles, and architectural applications.',
        benefits: ['TIG process', 'Certified welders', 'Quality materials', 'Finishing options']
      }
    ],
    detailedProblems: [
      {
        issue: 'Cracked or Failed Welds',
        symptoms: ['Visible cracks in welds', 'Separation at weld joints', 'Rust staining at cracks', 'Structural movement'],
        detailedSolution: `Weld failures can range from minor cosmetic cracks to catastrophic structural failures. Understanding why welds crack is essential for effective repair and prevention of future failures. Cracks result from excessive stress, improper welding procedures, unsuitable materials, or defects introduced during welding. Proper repair addresses the root cause rather than simply covering the symptom.

Stress-related cracking occurs when welds are subjected to loads exceeding their capacity. Overloaded welds fail in the weakest location, which may be the weld metal, heat-affected zone, or base material adjacent to the weld. Analysis of the failure location provides clues about the failure mode. Repairs must address either the excessive load or provide additional weld capacity.

Hydrogen-induced cracking (cold cracking) occurs hours or days after welding when hydrogen trapped in the weld migrates to areas of high stress and causes cracking. This is most common in high-strength steels and can be prevented by using low-hydrogen electrodes, preheating, and proper interpass temperature control. Repairs require removal of all cracked material and re-welding with proper procedures.

Solidification cracking (hot cracking) occurs during cooling when the weld metal cannot accommodate shrinkage stresses. It's caused by high restraint, improper filler metal selection, or contamination. Prevention involves proper joint design, appropriate filler metal, and control of restraint through welding sequence.

Fatigue cracking develops gradually under repeated loading, typically at stress concentrations including weld toes and stops/starts. Fatigue cracks grow slowly at first, then accelerate until failure. Repair involves complete removal of cracked material and re-welding with attention to profile and smoothness to minimize stress concentration.

Corrosion-related cracking occurs when corrosive attack weakens the weld area and cracks develop under normal service stresses. Galvanic corrosion is common when dissimilar metals are joined. Crevice corrosion occurs in tight gaps at weld roots. Repair includes addressing the corrosion mechanism as well as repairing the crack.`,
        diagnosticSteps: [
          'Document crack location, orientation, and extent',
          'Determine when crack appeared - immediately after welding or in service',
          'Identify the material types and thicknesses involved',
          'Review original welding procedure if available',
          'Check for evidence of overload or impact',
          'Look for corrosion associated with the crack',
          'Use dye penetrant or magnetic particle testing to find full extent',
          'Analyze whether crack is in weld metal, HAZ, or base metal',
          'Consider fatigue if loading is cyclical',
          'Evaluate whether design change is needed'
        ],
        repairProcedure: [
          'Remove all cracked material - verify by dye penetrant',
          'Prepare groove for complete joint penetration',
          'Select appropriate filler metal for the application',
          'Preheat if required for material thickness and type',
          'Weld using qualified procedure with proper parameters',
          'Control interpass temperature',
          'Allow slow cooling if post-weld heat treatment not practical',
          'Inspect completed weld visually and by NDT',
          'Grind smooth if profile affects fatigue life',
          'Apply corrosion protection appropriate for environment'
        ],
        preventionTips: [
          'Use qualified welding procedures for all critical welds',
          'Select filler metals appropriate for base materials',
          'Control hydrogen through electrode storage and handling',
          'Preheat heavy sections to slow cooling rate',
          'Design joints to minimize restraint',
          'Maintain smooth weld profiles at stress points',
          'Apply appropriate corrosion protection',
          'Don\'t overload welded structures beyond design capacity'
        ],
        estimatedTime: '2-8 hours depending on extent',
        estimatedCost: 'KES 5,000 - 50,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Grinding equipment', 'Welding machine', 'Dye penetrant kit', 'Preheat torch', 'Temperature indicators']
      },
      {
        issue: 'Rusted Steel Structures',
        symptoms: ['Visible rust on surfaces', 'Pitting and scale', 'Section loss in severe cases', 'Paint failure'],
        detailedSolution: `Rust is the visible evidence of steel corrosion - an electrochemical reaction that converts iron to iron oxide, progressively destroying the steel structure. Left unchecked, rust causes structural weakening, aesthetic degradation, and eventually failure. Effective treatment requires removing existing rust, repairing any damage, and applying protection to prevent recurrence.

Surface rust is the early stage where corrosion affects only the outer surface, producing a thin layer of rust with no significant metal loss. Treatment involves removing the rust to reach sound metal, then applying protective coatings. If caught early, surface rust causes no structural concern.

Pitting corrosion creates localized deep attacks that can penetrate significantly into the steel thickness. Even when surface area appears limited, pits can reduce local section thickness enough to cause failure. Pitting must be assessed for depth, and sections with significant loss may require reinforcement or replacement rather than simple coating repair.

Section loss from advanced corrosion reduces load-carrying capacity of structural members. When corrosion has removed more than about 10% of original thickness, structural evaluation is needed to determine if the member is still adequate. Repairs may include welding reinforcing plates, sistering new members alongside corroded ones, or complete replacement.

Coating selection depends on the corrosive environment and desired service life. In mild environments, properly applied alkyd or acrylic paints provide economical protection. Aggressive environments require epoxy or polyurethane systems with appropriate primers. Galvanizing provides excellent protection and self-healing capability. We recommend coating systems matched to specific environments.

Surface preparation is the most important factor in coating performance. Poor preparation is the leading cause of premature coating failure. For best results, remove all rust, mill scale, and old coating by blast cleaning to Sa 2.5 or better. Where blast cleaning is not practical, power tool cleaning to St 3 is acceptable for less demanding applications.`,
        diagnosticSteps: [
          'Assess extent of rust and corrosion',
          'Measure remaining section thickness with ultrasonic gauge',
          'Identify cause of corrosion - exposure, drainage, galvanic',
          'Check for structural implications of section loss',
          'Evaluate existing coating system failure mode',
          'Determine environmental severity for coating selection',
          'Plan access for surface preparation and coating',
          'Consider whether repairs can be made in place or require removal',
          'Identify any welding repairs needed',
          'Specify appropriate coating system'
        ],
        repairProcedure: [
          'Set up containment for blast debris if required',
          'Blast clean to specified standard (Sa 2.5 recommended)',
          'Repair any section loss by welding before coating',
          'Apply primer within time limit specified for product',
          'Apply intermediate coats as specified',
          'Apply topcoat to achieve specified thickness',
          'Allow proper cure time between coats',
          'Inspect for holidays, pinholes, insufficient thickness',
          'Touch up any defects found',
          'Document coating system and application for maintenance'
        ],
        preventionTips: [
          'Design to minimize water traps and crevices',
          'Provide drainage for enclosed sections',
          'Apply coating system appropriate for environment',
          'Maintain coating by touching up damage promptly',
          'Schedule recoating before rust develops',
          'Consider galvanizing for aggressive environments',
          'Inspect regularly and address problems early'
        ],
        estimatedTime: '1-3 days',
        estimatedCost: 'KES 10,000 - 100,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Blast equipment or power tools', 'Thickness gauge', 'Spray equipment', 'Surface prep tools', 'Inspection equipment']
      }
    ],
    turnaroundTime: '1-7 days depending on scope',
    priceRange: 'KES 5,000 - 500,000',
    requiredTools: [
      { name: 'Welding Machine', purpose: 'Generate welding current for joining metals', importance: 'Essential' },
      { name: 'Angle Grinder', purpose: 'Cut, grind, and finish metal work', importance: 'Essential' },
      { name: 'Cutting Torch', purpose: 'Cut thick steel with oxy-fuel flame', importance: 'Essential' },
      { name: 'Measuring Tools', purpose: 'Ensure accurate dimensions and fit', importance: 'Essential' },
      { name: 'Welding Helmet', purpose: 'Protect eyes and face during welding', importance: 'Essential' },
      { name: 'Clamps and Fixtures', purpose: 'Hold work in position during welding', importance: 'Essential' },
      { name: 'Dye Penetrant Kit', purpose: 'Detect surface cracks in welds', importance: 'Recommended' },
      { name: 'Fillet Gauge', purpose: 'Measure weld size for quality verification', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'Welding Fume Safety',
        icon: '💨',
        importance: 'Critical',
        overview: 'Welding fumes contain hazardous metal particles and gases. Proper ventilation and respiratory protection prevent lung damage.',
        detailedExplanation: `Welding fumes are a complex mixture of metal oxides, gases, and particulates generated by the intense heat of the welding process. These fumes can cause immediate irritation and, with prolonged exposure, permanent lung damage and other serious health effects. The specific hazards depend on the base materials, filler metals, coatings, and welding process.

Metal fumes include oxides of iron, manganese, chromium, nickel, and other metals depending on what's being welded. Iron oxide fumes cause siderosis, a benign condition. Manganese fumes can cause neurological effects similar to Parkinson's disease. Hexavalent chromium from stainless steel welding is a known carcinogen. Nickel is a suspected carcinogen. These hazards require effective exposure control.

Gases generated during welding include ozone (from UV radiation acting on oxygen), nitrogen oxides (from atmospheric nitrogen), and carbon monoxide (from CO2 shielding gas or carbon in base metals). These gases can cause respiratory irritation and, in enclosed spaces, oxygen depletion. Some coatings release phosgene when welded - a highly toxic gas.

Ventilation is the primary control for welding fumes. Local exhaust ventilation (LEV) captures fumes at the source before they enter the welder's breathing zone. General ventilation dilutes fumes but is less effective than LEV. Natural ventilation is acceptable only for outdoor or large indoor spaces with good air movement.

Respiratory protection supplements ventilation when fume levels remain excessive. Disposable filtering facepieces (P100 or equivalent) provide basic protection. Powered air-purifying respirators (PAPRs) provide higher protection and greater comfort for extended welding. Supplied air respirators are needed for the most hazardous operations.`,
        procedures: [
          'Assess fume hazards before starting - what materials, what coatings',
          'Position LEV hood close to arc - within 12 inches when possible',
          'Keep head out of fume plume - position to side of work',
          'Ensure adequate general ventilation in work area',
          'Use respiratory protection when ventilation is inadequate',
          'Select respirator appropriate for hazards present',
          'Fit-test respirators to ensure proper seal',
          'Remove coatings before welding when possible',
          'Don\'t weld in confined spaces without specific controls',
          'Monitor exposure if high-hazard materials are involved'
        ],
        commonMistakes: [
          'Positioning LEV too far from arc to be effective',
          'Welding galvanized or coated materials without extra precautions',
          'Relying on general ventilation when LEV is needed',
          'Using respirator without proper fit testing',
          'Ignoring fume symptoms - irritation, metallic taste',
          'Welding in confined spaces without proper controls'
        ],
        emergencyProtocol: 'For fume inhalation symptoms: Move to fresh air immediately. Rest in comfortable position. Seek medical attention if symptoms persist or are severe. For metal fume fever (flu-like symptoms after zinc exposure): Rest, drink fluids, symptoms typically resolve in 24-48 hours. Seek medical attention if symptoms are severe.'
      },
      {
        title: 'Fire and Burn Prevention',
        icon: '🔥',
        importance: 'Critical',
        overview: 'Welding generates extreme heat, sparks, and molten metal that can ignite fires and cause severe burns.',
        detailedExplanation: `The welding arc reaches temperatures over 5000°C - hot enough to melt any metal and ignite any combustible material. Sparks and spatter can travel considerable distances and retain enough heat to ignite fires when they land on combustible materials. Burns to the welder and helpers are common when proper precautions are not taken.

Hot work permits are required in many facilities before welding begins. The permit process ensures that combustibles are removed or protected, fire watch is established, fire extinguishing equipment is available, and authority approves the work. Even without formal permits, the permit thought process should guide preparation for any welding.

Combustible materials in the welding area must be addressed before striking an arc. Remove combustibles within 35 feet (11 meters) when possible. Cover immovable combustibles with fire-resistant materials. Check the other side of walls and partitions - heat and sparks can pass through openings. Pay special attention to hidden combustibles such as insulation, adhesives, and sealing compounds.

Fire watch during and after welding detects and extinguishes any fires that develop. Fire watch should have appropriate extinguisher, full view of the work area, and no other duties during the watch period. Fire watch continues for at least 30 minutes after welding stops - many fires develop after work ends when smoldering materials finally ignite.

Burns to welders result from contact with hot metal, spatter penetrating clothing, and ultraviolet radiation from the arc. Proper PPE including flame-resistant clothing, welding gloves, safety glasses under the helmet, and covered skin prevents most burns. Never weld with exposed skin - even brief exposure to arc UV causes painful burns.`,
        procedures: [
          'Complete hot work permit process if required',
          'Remove combustibles from area - 35 foot radius',
          'Protect immovable combustibles with fire-resistant covers',
          'Check other side of walls, floors, and partitions',
          'Have appropriate fire extinguisher immediately available',
          'Establish fire watch with dedicated personnel',
          'Wear flame-resistant clothing and PPE',
          'Cover all exposed skin',
          'Keep welding helmet down - arc flash can occur unexpectedly',
          'Maintain fire watch for 30 minutes after welding stops'
        ],
        commonMistakes: [
          'Starting hot work without removing combustibles',
          'Relying on spatter falling "safely" - sparks travel far',
          'Welding near hidden combustibles - insulation, sealing compounds',
          'Ending fire watch too soon after welding',
          'Wearing synthetic clothing that melts on contact with sparks',
          'Welding with exposed skin - even "just for a moment"'
        ],
        emergencyProtocol: 'For fire: Alert others, call fire services if significant. Use extinguisher only if fire is small and you have clear escape route. Evacuate if fire cannot be quickly controlled. For burns: Cool immediately with running water for at least 10 minutes. Cover with clean dressing. Seek medical attention for any significant burn.'
      }
    ],
    certifications: ['AWS Certified Welders', 'Kenya Bureau of Standards Certified Workshop'],
    warranty: '12 months on structural work, 90 days on general fabrication'
  },
  {
    id: 'solar',
    name: 'Solar Systems',
    icon: '☀️',
    iconBg: 'from-yellow-500 to-amber-600',
    shortDescription: 'Complete solar energy solutions including system design, installation, maintenance, and repairs.',
    fullDescription: {
      overview: `Solar energy represents Kenya's most abundant renewable resource, with exceptional irradiance levels averaging over 5 kWh/m²/day across most of the country. As electricity costs rise and solar technology costs decline, solar power systems have become economically compelling for homes, businesses, and institutions. Emerson EiMS provides comprehensive solar services from system design through installation, commissioning, and long-term maintenance.

Our solar expertise covers all major system configurations including grid-tied systems that reduce electricity bills, off-grid systems that provide power independence, and hybrid systems that combine solar with utility power and battery backup. We design systems matched to customer requirements, considering energy usage patterns, available space, budget constraints, and reliability needs.

Quality components form the foundation of reliable solar systems. We partner with leading manufacturers including Jinko, Canadian Solar, JA Solar for panels; SMA, Fronius, Growatt, Victron for inverters; and BYD, Pylontech for lithium batteries. Our component selection balances performance, reliability, and cost to provide optimal value.

Professional installation ensures that quality components perform to their potential. Our installation teams follow manufacturer guidelines and industry best practices for mounting, wiring, and commissioning. We handle all aspects of installation including structural assessment, roof penetrations, DC and AC wiring, and utility interconnection where applicable.`,

      technicalDetails: `Solar photovoltaic systems convert sunlight directly to electricity using semiconductor materials. Modern crystalline silicon panels achieve efficiency exceeding 20%, meaning they convert over 20% of incident solar energy to electricity. Module power ratings now commonly exceed 500W for utility-scale panels and 400W for residential panels, requiring fewer modules for a given system size.

System sizing starts with energy consumption analysis. We review electricity bills or install monitoring to understand usage patterns. Daily energy consumption (kWh) determines how much solar generation is needed. Peak demand (kW) affects inverter sizing. Time-of-use patterns determine whether battery storage is beneficial.

Inverters convert DC power from panels to AC power used by equipment and the grid. String inverters collect power from multiple panels in series. Microinverters attach to individual panels, optimizing performance when shading is present. Hybrid inverters manage both solar input and battery storage. Inverter selection depends on system configuration and customer requirements.

Battery storage enables solar power use after sunset or during outages. Lithium iron phosphate (LiFePO4) batteries have largely replaced lead-acid for new installations due to longer cycle life, deeper discharge capability, and declining costs. Battery sizing considers desired backup duration, critical loads, and recharge time.`,

      serviceScope: `System design services develop solutions matched to customer needs. We perform site surveys to assess solar resource, available space, and installation conditions. Energy analysis identifies consumption patterns and potential savings. Financial analysis calculates payback period and return on investment. We present options and recommendations for informed decision-making.

Installation services deliver complete, turnkey solar systems. We handle all aspects including permits, equipment procurement, structural work, electrical installation, and utility coordination. Our installation teams are trained in safety and quality practices. We commission systems and provide user training before handover.

Maintenance services keep solar systems performing optimally. Solar systems require minimal maintenance but benefit from periodic inspection and cleaning. Our maintenance visits include panel cleaning, connection inspection, performance verification, and component testing. We identify and address small issues before they become major problems.

Repair services restore failed systems to operation. Common issues include inverter faults, damaged panels, wiring problems, and battery degradation. Our diagnostic approach identifies root causes. We maintain inventory of common spare parts and can source components for any major brand.`,

      whyChooseUs: `Technical expertise developed over years of solar installations enables us to design and install systems that perform reliably. We've encountered and solved problems across diverse installations, building knowledge that benefits every project. Our engineers stay current with evolving technology and best practices.

Quality components from established manufacturers provide the foundation for reliable systems. We avoid no-name components that might save initial cost but fail prematurely. Manufacturer warranties on components we install provide additional protection.

Professional installation ensures that quality components achieve their performance potential. Poor installation is the leading cause of solar system underperformance and failure. Our trained installers follow documented procedures and quality checklists.

After-sales support continues long after installation. We provide system monitoring, maintenance services, and responsive repair when needed. Our ongoing relationship ensures that your solar investment continues delivering value throughout its lifespan.`,

      industryApplications: `Residential solar reduces electricity bills and provides backup power for homes. We've installed systems from small 3kW setups for apartments to large 20kW systems for estates. Battery storage provides power during outages, which are increasingly important to Kenyan homeowners.

Commercial and industrial solar significantly reduces operating costs for businesses. Large roof areas provide ample space for substantial systems. Our commercial installations include factories, warehouses, shopping centers, and office buildings. Self-consumption maximizes value by avoiding high commercial electricity rates.

Agricultural solar powers irrigation pumps, processing equipment, and farm buildings. Solar pumping systems eliminate fuel costs and maintenance hassles of diesel pumps. Off-grid systems bring power to remote farm locations. Our agricultural experience includes flower farms, dairy operations, and small-holder farms.

Institutional solar serves schools, hospitals, hotels, and government facilities. These facilities often have significant energy consumption and suitable roof space. Institutions benefit from predictable energy costs and sustainability credentials.`
    },
    href: '/maintenance-hub/solar',
    color: 'from-yellow-600/20 to-amber-700/20',
    glowColor: 'shadow-yellow-500/20',
    features: ['System Design', 'Panel Installation', 'Inverter Service', 'Battery Systems', 'Monitoring', 'Grid-Tie', 'Off-Grid', 'Hybrid Systems'],
    stats: { value: '50+', label: 'MW Installed' },
    subServices: [
      {
        name: 'Solar System Design',
        description: 'Professional design services including site assessment, energy analysis, and system specification.',
        benefits: ['Optimized sizing', 'Maximum savings', 'Quality components', 'Financial analysis']
      },
      {
        name: 'Panel Installation',
        description: 'Professional mounting and wiring of solar panels on rooftops or ground mount systems.',
        benefits: ['Proper mounting', 'Weather sealing', 'Optimal orientation', 'Safety compliant']
      },
      {
        name: 'Inverter Installation',
        description: 'Installation and commissioning of string inverters, microinverters, and hybrid inverters.',
        benefits: ['All brands', 'Grid compliance', 'Monitoring setup', 'Warranty registration']
      },
      {
        name: 'Battery Bank Setup',
        description: 'Design and installation of battery storage systems for backup power and self-consumption.',
        benefits: ['Proper sizing', 'Safe installation', 'BMS configuration', 'Extended warranty']
      },
      {
        name: 'Grid-Tie Systems',
        description: 'Solar systems connected to utility grid for bill reduction and net metering.',
        benefits: ['Lower bills', 'No batteries needed', 'Grid as backup', 'Net metering']
      },
      {
        name: 'Solar Pump Systems',
        description: 'Solar-powered pumping systems for irrigation, borehole, and water supply.',
        benefits: ['No fuel costs', 'Low maintenance', 'Remote locations', 'Complete systems']
      },
      {
        name: 'Monitoring Setup',
        description: 'Installation of monitoring systems for real-time performance tracking.',
        benefits: ['Remote monitoring', 'Performance alerts', 'Data logging', 'Mobile access']
      },
      {
        name: 'Panel Cleaning',
        description: 'Professional cleaning service to maintain optimal solar panel performance.',
        benefits: ['Restore efficiency', 'Safe methods', 'Inspection included', 'Scheduled service']
      }
    ],
    detailedProblems: [
      {
        issue: 'Low Power Production',
        symptoms: ['Generation below expected', 'Lower than historical production', 'Bills not reduced as expected', 'Monitoring shows low output'],
        detailedSolution: `Solar systems that produce less power than expected frustrate owners and reduce the economic benefit of the investment. Many factors can reduce production, and systematic diagnosis identifies the actual cause so it can be properly addressed. Understanding expected production provides the baseline for evaluating actual performance.

Shading is the leading cause of solar underperformance. Even small shadows on panels can dramatically reduce output because shaded cells limit current flow through entire strings. Trees grow and buildings are constructed - shading that didn't exist at installation may develop over time. Evaluate shading throughout the day and across seasons, as sun angles change.

Soiling from dust, bird droppings, and debris accumulates on panels and reduces light transmission. In Kenya's dusty dry season, soiling losses can exceed 20% if panels are not cleaned. Visual inspection reveals obvious soiling. Cleaning typically restores lost production immediately.

Component failures including panel degradation, inverter faults, and wiring problems reduce production. Panel hot spots from cell defects appear as warm areas on thermal imaging. Inverter faults may be indicated on the display or monitoring system. Wiring problems including loose connections, rodent damage, and corrosion create resistance that reduces power output.

Incorrect installation can cause underperformance from the start. Panels oriented away from optimal direction or tilted inappropriately produce less than properly installed panels. Undersized wiring causes voltage drop losses. Improper string configuration reduces inverter efficiency. These issues require correction for optimal performance.

System monitoring provides data for performance analysis. Compare actual production to expected production based on irradiance data. Compare current production to historical production for the same period. Monitoring can often identify specific strings or inverters that are underperforming.`,
        diagnosticSteps: [
          'Review monitoring data to quantify underperformance',
          'Compare current production to historical baseline',
          'Check weather conditions - cloudy periods reduce production',
          'Inspect panels for shading throughout the day',
          'Visually inspect panels for soiling or damage',
          'Check inverter display and monitoring for faults',
          'Verify all circuits are producing - check combiner fuses',
          'Use thermal camera to identify hot spots on panels',
          'Measure string voltages and currents',
          'Compare to design specifications and expected values'
        ],
        repairProcedure: [
          'Clean panels if soiled - use appropriate methods',
          'Address shading if possible - trim trees, relocate panels',
          'Clear any faults indicated on inverter',
          'Replace blown fuses in combiner boxes',
          'Repair or replace damaged wiring',
          'Replace panels with hot spots or physical damage',
          'Adjust installation if orientation/tilt is incorrect',
          'Repair or replace failed inverter',
          'Verify repair by monitoring subsequent production',
          'Establish baseline for future comparison'
        ],
        preventionTips: [
          'Schedule regular panel cleaning - quarterly in dusty areas',
          'Monitor production regularly to catch problems early',
          'Maintain vegetation to prevent shading',
          'Inspect system annually for developing issues',
          'Keep monitoring system functioning',
          'Address small problems before they compound',
          'Understand expected production to recognize shortfalls'
        ],
        estimatedTime: '2-4 hours for diagnosis',
        estimatedCost: 'KES 5,000 - 50,000',
        difficultyLevel: 'Intermediate',
        toolsRequired: ['Solar irradiance meter', 'Multimeter', 'Clamp meter', 'Thermal camera', 'Monitoring system access']
      },
      {
        issue: 'Inverter Fault Codes',
        symptoms: ['Inverter stopped producing', 'Fault indication on display', 'Error messages in monitoring', 'Warning lights illuminated'],
        detailedSolution: `Inverters are the most likely component to experience faults in a solar system. Modern inverters include sophisticated protection and monitoring systems that detect problems and display fault codes to guide troubleshooting. Understanding common fault codes and their causes enables efficient diagnosis and repair.

Grid fault codes indicate problems with the utility power connection. Under-voltage, over-voltage, under-frequency, and over-frequency faults occur when grid parameters exceed inverter tolerance. These faults may reflect actual grid problems or may indicate measurement issues at the inverter. Verify grid parameters with a separate meter to determine if the grid or inverter is at fault.

DC input faults relate to the solar panel array. Ground faults occur when DC conductors contact ground, which is a safety hazard. Isolation faults indicate insulation breakdown in DC wiring or panels. Over-voltage faults occur when string voltage exceeds inverter maximum, typically on cold sunny mornings. These faults require inspection and repair of DC components.

Internal inverter faults indicate problems within the inverter itself. Overtemperature faults result from cooling problems - blocked vents, fan failures, or excessive ambient temperature. Communication faults affect monitoring but not power production. Hardware faults in power electronics or control circuits may require professional repair or inverter replacement.

Many faults can be cleared by resetting the inverter - turning off, waiting, and restarting. If the fault clears and doesn't recur, it may have been a transient condition. If the fault recurs immediately or repeatedly, the underlying cause must be identified and corrected.

Manufacturer technical support can assist with fault diagnosis. Document the fault code, circumstances, and any relevant measurements before contacting support. Many manufacturers provide detailed troubleshooting guides for their specific fault codes.`,
        diagnosticSteps: [
          'Record exact fault code and any additional information',
          'Check inverter display for fault history and conditions',
          'Verify grid voltage and frequency with external meter',
          'Check DC string voltages and compare to expected',
          'Inspect for visible damage or overheating',
          'Check cooling vents for blockage and fan operation',
          'Verify all connections are secure',
          'Check ground fault indicator lights',
          'Review monitoring data for patterns',
          'Consult manufacturer documentation for specific code'
        ],
        repairProcedure: [
          'Address underlying cause identified by fault code',
          'Clear grid faults after grid stabilizes',
          'Locate and repair ground faults in DC system',
          'Replace damaged cables or connectors',
          'Clean cooling vents and verify fan operation',
          'Reset inverter after clearing fault condition',
          'Update firmware if recommended by manufacturer',
          'Replace inverter if internal hardware failure',
          'Verify proper operation after repair',
          'Document fault and resolution for records'
        ],
        preventionTips: [
          'Monitor inverter status regularly',
          'Keep inverter location cool and ventilated',
          'Protect DC wiring from damage and moisture',
          'Size strings to avoid cold-weather over-voltage',
          'Keep firmware updated per manufacturer recommendations',
          'Schedule periodic professional inspection',
          'Address small issues before they become major faults'
        ],
        estimatedTime: '2-6 hours',
        estimatedCost: 'KES 8,000 - 80,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Multimeter', 'Insulation tester', 'Clamp meter', 'Manufacturer software', 'Thermal camera']
      }
    ],
    turnaroundTime: '1-7 days for installations, same day for diagnostics',
    priceRange: 'KES 10,000 - 5,000,000',
    requiredTools: [
      { name: 'Solar Irradiance Meter', purpose: 'Measure available solar resource', importance: 'Recommended' },
      { name: 'Multimeter', purpose: 'Measure voltage, current, continuity', importance: 'Essential' },
      { name: 'Clamp Meter', purpose: 'Measure DC and AC current without disconnection', importance: 'Essential' },
      { name: 'Insulation Tester', purpose: 'Verify wiring insulation integrity', importance: 'Essential' },
      { name: 'Thermal Camera', purpose: 'Identify hot spots and connection problems', importance: 'Recommended' },
      { name: 'Safety Harness', purpose: 'Fall protection for roof work', importance: 'Essential' },
      { name: 'MC4 Crimping Tool', purpose: 'Make reliable solar cable connections', importance: 'Essential' },
      { name: 'Torque Wrench', purpose: 'Proper tightening of mounting hardware', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'DC Electrical Safety',
        icon: '⚡',
        importance: 'Critical',
        overview: 'Solar panels produce DC voltage whenever light falls on them - they cannot be turned off. Special procedures are needed for safe work.',
        detailedExplanation: `Solar photovoltaic systems present unique electrical hazards because panels generate voltage whenever exposed to light. Unlike conventional electrical systems that can be de-energized by opening a switch, solar panels remain energized even when disconnected from the inverter. DC arc faults are particularly dangerous because DC arcs don't self-extinguish the way AC arcs do.

Voltage levels in solar arrays can easily exceed 400V DC, well above lethal levels. String voltages depend on the number of panels connected in series and ambient temperature - cold temperatures increase voltage. Even a single panel produces voltage high enough to cause painful shock. Always assume solar circuits are energized.

Working on energized DC systems requires specialized procedures. Covering panels with opaque material reduces voltage but doesn't eliminate it. Disconnecting at the inverter or combiner box still leaves wiring to the disconnect energized. The safest approach is to cover panels, disconnect at the array level, and verify absence of voltage before working.

DC arc faults present fire and burn hazards. When DC connections are made or broken under load, arcing can occur. The arc can sustain itself indefinitely unless the circuit is opened at another point. Loose connections create arcing that can ignite fires. Proper connectors, correct torque, and inspection prevent arc fault hazards.

Hot work including soldering and crimping on solar circuits requires that the circuit be de-energized. Even small currents flowing during connector assembly can cause arcing. Verify zero current before making or breaking connections.`,
        procedures: [
          'Treat all solar circuits as energized whenever panels are exposed to light',
          'Cover panels with opaque material before working on DC circuits',
          'Open DC disconnects at inverter and combiner before covering panels',
          'Verify absence of voltage with appropriate DC-rated tester',
          'Never work on energized DC circuits unless absolutely necessary',
          'Use DC-rated connectors and terminals - not AC components',
          'Apply proper torque to all connections',
          'Inspect connections for signs of arcing or overheating',
          'Use insulated tools and wear appropriate PPE',
          'Have someone nearby who can call for help if needed'
        ],
        commonMistakes: [
          'Assuming panels are "off" because inverter is disconnected',
          'Opening connectors under load, causing arcing',
          'Using AC-rated components on DC circuits',
          'Not verifying zero voltage before working',
          'Working alone on rooftop solar systems',
          'Underestimating DC voltage hazards'
        ],
        emergencyProtocol: 'For DC electrical shock: Don\'t touch victim if still in contact. Use insulated object to separate from circuit or cover panels to reduce voltage. Call emergency services. Begin CPR if not breathing. For DC arc flash: Cool burns with water. Cover with clean dressing. Seek immediate medical attention.'
      },
      {
        title: 'Working at Heights',
        icon: '🏗️',
        importance: 'Critical',
        overview: 'Most solar installations involve roof work where falls can cause serious injury or death. Proper fall protection is essential.',
        detailedExplanation: `Falls from heights are a leading cause of workplace fatalities, and solar installation involves extensive work on rooftops where fall hazards are ever-present. Even relatively low heights can cause fatal injuries if the worker lands incorrectly. Comprehensive fall protection is required for any work where falls of 2 meters or more are possible.

Roof conditions create additional hazards beyond fall distance. Fragile roofing materials including old corrugated iron, plastic skylights, and deteriorated materials can collapse under worker weight. Slippery surfaces from dew, rain, or dust increase fall risk. Roof edges and openings are particular hazards. Assessment of roof conditions should precede any work.

Fall protection systems include guardrails, safety nets, and personal fall arrest systems (harnesses). Guardrails prevent workers from reaching fall hazards. Safety nets catch workers who do fall. Personal fall arrest systems allow workers to reach fall hazards while protected by harness, lanyard, and anchor. Selection depends on the specific work and roof configuration.

Personal fall arrest systems require proper anchor points capable of supporting the loads imposed during fall arrest. Roof anchors must be engineered for the expected loads - typically 22 kN for personal fall arrest. Temporary anchors for solar work must be properly installed and inspected. Never anchor to non-rated building components.

Ladder safety is essential for access to rooftops. Ladders must be properly set up at the correct angle (75 degrees), secured at top and bottom, and extend at least 1 meter above the landing point. Only one person on a ladder at a time. Face the ladder when climbing. Maintain three points of contact.`,
        procedures: [
          'Assess roof conditions before beginning work',
          'Identify fragile materials and mark or avoid',
          'Set up appropriate fall protection before roof access',
          'Use proper ladder setup and secure at top',
          'Wear personal fall arrest equipment when required',
          'Anchor only to rated anchor points',
          'Inspect fall protection equipment before each use',
          'Maintain three points of contact when moving',
          'Don\'t work on wet or icy roofs',
          'Have rescue plan in case of fall into harness'
        ],
        commonMistakes: [
          'Working on roofs without fall protection',
          'Anchoring to non-rated building components',
          'Not inspecting fall protection equipment',
          'Working on wet or damaged roofing',
          'Improper ladder setup and use',
          'No rescue plan if fall arrest occurs'
        ],
        emergencyProtocol: 'For fall from height: Don\'t move victim - spinal injury possible. Call emergency services immediately. Control bleeding if present. Keep victim warm and calm while waiting for help. For suspension in harness: Victim must be rescued within 15 minutes to prevent suspension trauma. Have rescue plan before work begins.'
      }
    ],
    certifications: ['Solar Installation Certified', 'Electrical License', 'Working at Heights Certified'],
    warranty: '25 years on panels, 10 years on inverters, 5 years on installation'
  },
  {
    id: 'automation',
    name: 'Industrial Controls',
    icon: '🤖',
    iconBg: 'from-indigo-500 to-purple-600',
    shortDescription: 'PLC programming, SCADA systems, VFD installation, industrial automation, and process control solutions.',
    fullDescription: {
      overview: `Industrial automation transforms manufacturing and process operations by replacing manual control with precise, consistent machine control. From simple motor starters to complex integrated control systems, automation improves quality, increases productivity, enhances safety, and reduces operating costs. Emerson EiMS provides comprehensive industrial control services including design, programming, installation, and support.

Our automation expertise spans diverse technologies and applications. We program PLCs from major manufacturers including Siemens, Allen-Bradley, Mitsubishi, Schneider, and others. We design and implement SCADA systems for process monitoring and control. We install and configure variable frequency drives for motor control. We integrate diverse systems into cohesive control platforms.

Process understanding distinguishes our approach from pure controls contractors. We take time to understand the process being controlled - its objectives, constraints, and behaviors. This understanding enables control strategies that actually improve operations rather than simply automating existing manual practices. Often our best value comes from identifying process improvements alongside automation.

Training and documentation ensure that automation investments continue delivering value. We provide operator training on new systems. We create documentation including control narratives, I/O lists, and programming documentation. This knowledge transfer enables facility personnel to operate and maintain systems effectively.`,

      technicalDetails: `Programmable Logic Controllers (PLCs) form the foundation of most industrial automation systems. PLCs execute programmed logic to control equipment based on input conditions. Modern PLCs support multiple programming languages including ladder logic, function block, structured text, and sequential function chart. We select languages appropriate for the application and customer preferences.

Human-Machine Interfaces (HMIs) provide operator interaction with control systems. Touchscreen panels display process status and accept operator commands. SCADA software provides supervisory control, data acquisition, and historical trending from central workstations. We design interfaces that present relevant information clearly and enable efficient operation.

Variable Frequency Drives (VFDs) control motor speed for optimized process operation and energy efficiency. VFDs enable soft starting that reduces mechanical stress and electrical demand. Speed control matches motor output to actual requirements rather than running at full speed constantly. Proper VFD application requires understanding of both the drive and the driven load.

Communication networks connect control system components. Industrial Ethernet has largely replaced older fieldbus technologies for new installations. Protocol selection depends on equipment compatibility and performance requirements. Network design considers reliability, security, and maintainability.`,

      serviceScope: `Control system design develops automation solutions matched to customer requirements. We survey existing operations, identify automation opportunities, and propose solutions with clear benefits. Design deliverables include system architecture, I/O lists, control narratives, and panel layouts. We present options at various investment levels so customers can make informed decisions.

Programming services implement control logic in PLCs, HMIs, and SCADA systems. We follow structured programming practices that create maintainable, documented code. Programs are tested thoroughly before deployment. We support multiple PLC platforms and can work with existing installed systems.

Installation services deliver complete control systems ready for operation. Our technicians install panels, pull wire, terminate connections, and commission systems. We coordinate with electrical contractors and equipment suppliers for integrated project completion.

Support services maintain system performance after installation. We provide troubleshooting when problems occur. We implement modifications as process requirements change. Preventive maintenance prevents problems before they affect operations.`,

      whyChooseUs: `Multi-platform expertise means we can work with whatever equipment you have or select the best platform for your application. We're not tied to a single manufacturer, so recommendations are based on application requirements rather than vendor relationships.

Process understanding enables control solutions that actually improve operations. We've worked across diverse industries and seen what works and what doesn't. This experience guides practical solutions rather than theoretical ideals.

Quality programming practices create systems that are maintainable over time. Structured code, consistent naming, and thorough documentation mean that future modifications are straightforward. We build systems for the long term, not just for initial startup.

Local support means help is available when you need it. Remote support resolves many issues quickly. On-site service is available when remote support isn't sufficient. We're committed to keeping your systems running.`,

      industryApplications: `Manufacturing facilities benefit from automation that improves quality and consistency while reducing labor requirements. Assembly lines, packaging systems, and material handling all benefit from PLC control. We've automated processes across diverse manufacturing sectors.

Water and wastewater treatment requires precise control of pumps, valves, and treatment processes. SCADA systems provide remote monitoring and control of distributed facilities. We understand water industry requirements including redundancy and alarming.

Building automation controls HVAC, lighting, and other building systems for comfort and efficiency. Integration of diverse building systems onto common platforms enables centralized management. Energy monitoring identifies opportunities for efficiency improvement.

Food and beverage processing requires automation that meets hygiene and safety standards. Batch processing, filling lines, and packaging benefit from consistent automated control. We understand food safety requirements and implement appropriate controls.`
    },
    href: '/services#automation',
    color: 'from-indigo-600/20 to-purple-700/20',
    glowColor: 'shadow-indigo-500/20',
    features: ['PLC Programming', 'SCADA Systems', 'VFD Installation', 'HMI Design', 'Process Control', 'Remote Monitoring', 'System Integration', 'Training'],
    stats: { value: '50+', label: 'Automated Systems' },
    subServices: [
      {
        name: 'PLC Programming',
        description: 'Control logic development for all major PLC platforms including Siemens, Allen-Bradley, and Mitsubishi.',
        benefits: ['Multi-platform', 'Structured code', 'Documentation', 'Testing included']
      },
      {
        name: 'SCADA System Design',
        description: 'Supervisory control and data acquisition systems for process monitoring and control.',
        benefits: ['Remote monitoring', 'Historical data', 'Alarming', 'Reports']
      },
      {
        name: 'VFD Installation',
        description: 'Variable frequency drive installation and configuration for motor control applications.',
        benefits: ['Energy savings', 'Soft starting', 'Speed control', 'Protection features']
      },
      {
        name: 'HMI Panel Design',
        description: 'Design and programming of operator interface screens for equipment control.',
        benefits: ['Clear displays', 'Intuitive operation', 'Alarm management', 'Trending']
      },
      {
        name: 'Sensor Integration',
        description: 'Installation and integration of sensors for process measurement and control.',
        benefits: ['Proper selection', 'Correct installation', 'Calibration', 'Signal conditioning']
      },
      {
        name: 'Remote Monitoring',
        description: 'Implementation of remote access and monitoring for distributed equipment.',
        benefits: ['Secure access', 'Real-time data', 'Alerts', 'Reduced travel']
      },
      {
        name: 'Process Optimization',
        description: 'Analysis and improvement of existing process control for better performance.',
        benefits: ['Increased throughput', 'Better quality', 'Reduced waste', 'Energy savings']
      },
      {
        name: 'Safety System Design',
        description: 'Design and implementation of machine safety systems meeting applicable standards.',
        benefits: ['Risk reduction', 'Standards compliance', 'Documentation', 'Validation']
      }
    ],
    detailedProblems: [
      {
        issue: 'PLC Communication Failure',
        symptoms: ['HMI shows no connection', 'Remote monitoring unavailable', 'Intermittent communication errors', 'Slow response'],
        detailedSolution: `Communication failures between control system components disrupt operations and blind operators to process status. Modern control systems rely heavily on network communications, and failures can cascade through interconnected systems. Systematic diagnosis identifies whether the problem is physical (cabling, hardware), configuration (addresses, settings), or traffic-related (overload, interference).

Physical layer problems are the most common cause of communication failures. Cables can be damaged, connectors can corrode or loosen, and network switches can fail. Visual inspection often reveals obvious problems. Cable testing verifies continuity and proper termination. For Ethernet networks, link lights on switches and devices indicate whether physical connections are working.

Network addressing must be correct and unique for each device. IP address conflicts occur when two devices are accidentally assigned the same address. Subnet mask mismatches prevent communication between devices on different logical networks. Gateway settings must be correct for communication beyond the local network. Document and verify all network settings.

Traffic problems result from network overload or interference. Large data transfers, broadcast storms, or excessive polling can saturate network capacity. Industrial environments can introduce electrical noise that corrupts communications. Traffic analysis identifies network utilization and error rates. Segmentation and filtering reduce traffic problems.

Configuration issues in software affect communication even when the network is healthy. Communication driver settings must match device capabilities. Timeout values that are too short cause unnecessary errors. Incorrect device addresses in HMI or SCADA prevent connection to the intended device. Review all configuration settings against known-good documentation.

Equipment failures in network infrastructure require replacement. Switch ports can fail while others on the same switch work. Media converters for fiber connections are a common failure point. PLC communication modules can fail independently from the processor. Substituting known-good components helps isolate hardware failures.`,
        diagnosticSteps: [
          'Verify physical connections - cables, connectors, link lights',
          'Check for duplicate IP addresses on the network',
          'Verify device IP addresses and subnet masks',
          'Ping devices to verify basic connectivity',
          'Check PLC processor and communication module status',
          'Review HMI/SCADA driver configuration',
          'Check for network traffic problems or congestion',
          'Look for environmental factors - heat, EMI, moisture',
          'Review event logs on all involved devices',
          'Test with known-good cables and components if suspected'
        ],
        repairProcedure: [
          'Repair or replace damaged cables',
          'Correct any duplicate IP addresses',
          'Fix misconfigured network settings',
          'Replace failed network components',
          'Correct driver and communication settings',
          'Reduce network traffic if congested',
          'Shield cables from EMI sources if interference',
          'Update firmware if known communication bugs',
          'Document all changes made',
          'Verify communication is stable after repairs'
        ],
        preventionTips: [
          'Document all IP addresses and network settings',
          'Use managed switches for diagnostic capability',
          'Implement network monitoring for early detection',
          'Protect industrial networks from office traffic',
          'Use quality industrial Ethernet cables',
          'Maintain spare network components',
          'Test communication periodically'
        ],
        estimatedTime: '2-8 hours',
        estimatedCost: 'KES 10,000 - 50,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Laptop with diagnostic software', 'Network cable tester', 'Ethernet analyzer', 'Multimeter', 'Spare cables/components']
      },
      {
        issue: 'VFD Tripping on Fault',
        symptoms: ['Drive stops with fault code', 'Motor stops unexpectedly', 'Frequent nuisance trips', 'Fault codes in drive display'],
        detailedSolution: `Variable frequency drives include extensive protection features that trip the drive when problems are detected. While these protections prevent equipment damage, frequent tripping disrupts operations and indicates underlying problems that should be corrected. Understanding fault codes and their causes enables effective diagnosis and permanent solutions.

Overcurrent faults indicate that motor current exceeds drive capacity. This can result from mechanical overload on the driven equipment, motor problems, or drive issues. Check for mechanical binding, bearing problems, or process changes that increased load. Verify motor condition - shorts or grounds increase current. If motor and load are good, drive current sensors or power electronics may be faulty.

Overvoltage faults occur when DC bus voltage exceeds limits, typically during deceleration when motor regenerates energy back to the drive. Extending deceleration time allows motor to slow more gradually. Braking resistors dissipate regenerative energy when fast stops are needed. High utility voltage can also trigger overvoltage faults.

Ground faults indicate that motor winding or cabling has contact with ground. This is a safety hazard and can damage the drive. Disconnect motor cables and test insulation resistance to identify whether the fault is in motor or cabling. Repair insulation before re-energizing.

Thermal faults indicate overheating of drive, motor, or power electronics. Verify ambient temperature is within drive ratings. Check that cooling fans are operating and airflow is not blocked. Reduce drive load or install larger drive if operation exceeds thermal capacity. Motor thermal trips may indicate motor overload or cooling problems.

Communication faults affect drives with network connections. Loss of communication with the controlling PLC can trip the drive to a safe state. Check network connections and settings. Consider whether drive should continue operating on communication loss or trip safely.`,
        diagnosticSteps: [
          'Record exact fault code from drive display',
          'Check drive manual for fault code meaning',
          'Review fault history for patterns',
          'Check motor current during operation',
          'Verify motor insulation resistance',
          'Check for mechanical load problems',
          'Measure input voltage to drive',
          'Check drive cabinet temperature and cooling',
          'Verify parameter settings are appropriate',
          'Check network communication if applicable'
        ],
        repairProcedure: [
          'Address specific issue indicated by fault code',
          'Reduce load if overcurrent from overload',
          'Repair motor or cabling if ground fault',
          'Extend deceleration time if overvoltage during stop',
          'Add braking resistor if fast stops required',
          'Improve cooling if thermal faults',
          'Adjust parameters if settings inappropriate',
          'Replace drive if internal failure confirmed',
          'Clear fault and test operation',
          'Monitor for recurrence'
        ],
        preventionTips: [
          'Size drives with appropriate margin for application',
          'Maintain clean, cool drive environment',
          'Include motor protection in drive configuration',
          'Monitor drive operation and fault history',
          'Keep drives and firmware updated',
          'Train operators on proper operation',
          'Schedule preventive maintenance including fan and filter service'
        ],
        estimatedTime: '2-6 hours',
        estimatedCost: 'KES 8,000 - 60,000',
        difficultyLevel: 'Advanced',
        toolsRequired: ['Multimeter', 'Insulation tester', 'Clamp meter', 'Drive programming software', 'Thermal camera']
      }
    ],
    turnaroundTime: '1-14 days depending on project scope',
    priceRange: 'KES 20,000 - 2,000,000',
    requiredTools: [
      { name: 'Programming Laptop', purpose: 'Program and configure PLCs, HMIs, and drives', importance: 'Essential' },
      { name: 'PLC Software', purpose: 'Platform-specific programming environments', importance: 'Essential' },
      { name: 'Digital Multimeter', purpose: 'Electrical measurements and troubleshooting', importance: 'Essential' },
      { name: 'Oscilloscope', purpose: 'Analyze electrical signals and waveforms', importance: 'Recommended' },
      { name: 'Network Analyzer', purpose: 'Diagnose industrial network problems', importance: 'Recommended' },
      { name: 'Process Calibrator', purpose: 'Simulate and verify sensor signals', importance: 'Recommended' },
      { name: 'Hand Tools', purpose: 'Panel wiring and installation', importance: 'Essential' },
      { name: 'Labeling System', purpose: 'Professional wire and device labeling', importance: 'Recommended' }
    ],
    safetyGuidelines: [
      {
        title: 'Machine Safety',
        icon: '⚠️',
        importance: 'Critical',
        overview: 'Industrial machinery can cause serious injury. Control system work requires understanding machine hazards and safeguards.',
        detailedExplanation: `Industrial automation involves machinery that can cause severe injury or death through crushing, cutting, entanglement, or impact. Control systems govern machine motion, and errors in control logic can create hazardous machine behavior. Everyone working on control systems must understand machine hazards and the safeguards designed to protect workers.

Machine guarding prevents access to hazardous areas during operation. Guards may be fixed (bolted in place), interlocked (stops machine when opened), or presence-sensing (detects personnel in hazardous area). Control system work should never bypass or disable safeguards except under controlled conditions with proper alternative protection.

Lock-out tag-out (LOTO) procedures protect workers from unexpected machine motion during service. LOTO isolates all energy sources - not just electrical, but also pneumatic, hydraulic, gravity, and stored energy. Each worker applies personal lock. Control system work often requires machine access where LOTO is appropriate.

Safety-related control systems require special attention. Safety PLCs, safety relays, and safety-rated sensors implement critical protection functions. These systems must be designed, implemented, and maintained according to applicable safety standards. Modifications to safety systems require proper risk assessment and validation.

Testing and commissioning of automated equipment presents particular hazards. Unexpected motion can occur when first energizing new or modified systems. Initial testing should be performed with safeguards in place and limited personnel in the area. Step through sequences slowly, verifying each action before proceeding.`,
        procedures: [
          'Assess machine hazards before beginning work',
          'Implement LOTO when accessing hazardous areas',
          'Never bypass or disable safety devices except under controlled conditions',
          'Test programs in simulation before downloading to live machines',
          'Commission new programs with safeguards in place',
          'Step through sequences slowly during initial testing',
          'Verify safety system function after any modifications',
          'Document all changes to safety-related systems',
          'Train operators on any modified operation',
          'Maintain safeguards in proper working condition'
        ],
        commonMistakes: [
          'Bypassing safety interlocks "temporarily"',
          'Testing new programs without safeguards',
          'Not understanding machine motion before programming',
          'Modifying safety systems without proper process',
          'Standing in hazardous areas during commissioning',
          'Assuming program is correct without testing'
        ],
        emergencyProtocol: 'For machine injury: Don\'t attempt to reverse machinery. Press emergency stop if safe to reach. Call emergency services immediately. Control bleeding with direct pressure. Keep victim calm and still until help arrives.'
      }
    ],
    certifications: ['Siemens Certified Programmer', 'Allen-Bradley Trained', 'TUV Functional Safety'],
    warranty: '12 months on programming and installation work'
  }
];

export default ENHANCED_SERVICES_PART4;
