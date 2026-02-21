/**
 * TARGET SECTORS SEO DATA
 * 25 sectors with SEO metadata for sector-specific pages
 * Generates pages like "Generator Solutions for Hospitals in Nairobi"
 */

export interface TargetSector {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: 'educational' | 'healthcare' | 'financial' | 'commercial' | 'institutional' | 'industrial' | 'residential' | 'religious' | 'tourism';
  icon: string;
  description: string;
  keywords: string[];
  metaTemplate: {
    title: string;
    description: string;
    h1: string;
  };
  powerNeeds: string[];
  challenges: string[];
  solutions: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const TARGET_SECTORS: TargetSector[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // EDUCATIONAL INSTITUTIONS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'schools',
    slug: 'schools',
    name: 'Schools',
    shortName: 'Schools',
    category: 'educational',
    icon: 'GraduationCap',
    description: 'Reliable power solutions for primary and secondary schools ensuring uninterrupted learning',
    keywords: ['generators for schools', 'school backup power', 'school generator installation', 'educational institution power', 'school electricity backup'],
    metaTemplate: {
      title: 'Generators for Schools in {location} | School Power Solutions Kenya',
      description: 'Reliable generators for schools in {location}. Ensure uninterrupted learning with backup power. Installation & maintenance. Call +254768860665',
      h1: 'Generators for Schools in {location}'
    },
    powerNeeds: ['Computer labs', 'Science laboratories', 'Lighting', 'Water pumps', 'Kitchen equipment'],
    challenges: ['Budget constraints', 'Power outages during exams', 'Equipment protection', 'Student safety'],
    solutions: ['Silent generators', 'Automatic transfer switches', 'Scheduled maintenance', 'Solar hybrid systems'],
    faqs: [
      { question: 'What size generator does a school need in {location}?', answer: 'Most schools in {location} need 20-100kVA depending on size. We assess your specific needs and recommend the right capacity.' },
      { question: 'Can generators power computer labs?', answer: 'Yes, we install generators with clean power output suitable for computers, projectors, and sensitive equipment.' },
      { question: 'Do you offer payment plans for schools?', answer: 'Yes, we offer flexible payment options and financing for educational institutions in {location}.' }
    ]
  },
  {
    id: 'private-schools',
    slug: 'private-schools',
    name: 'Private Schools',
    shortName: 'Private Schools',
    category: 'educational',
    icon: 'School',
    description: 'Premium power solutions for private schools requiring reliable 24/7 electricity',
    keywords: ['private school generators', 'boarding school backup power', 'premium school power solutions', 'private institution generators'],
    metaTemplate: {
      title: 'Generators for Private Schools in {location} | Premium School Power',
      description: 'Premium generators for private schools in {location}. 24/7 reliable power for boarding facilities. Quiet operation. Call +254768860665',
      h1: 'Generators for Private Schools in {location}'
    },
    powerNeeds: ['Boarding facilities', 'Swimming pools', 'Sports facilities', 'ICT centers', 'Laboratories'],
    challenges: ['24/7 power needs', 'Noise restrictions', 'Large campuses', 'Multiple buildings'],
    solutions: ['Silent canopy generators', 'Centralized power systems', 'Remote monitoring', 'Preventive maintenance'],
    faqs: [
      { question: 'What generators are best for boarding schools in {location}?', answer: 'Boarding schools need reliable 24/7 power. We recommend Cummins or Perkins generators with automatic changeover systems.' },
      { question: 'How quiet are your generators?', answer: 'Our soundproof generators operate at 65-70dB, suitable for school environments without disturbing classes.' },
      { question: 'Can you power an entire school campus?', answer: 'Yes, we design and install centralized or distributed power systems for large school campuses in {location}.' }
    ]
  },
  {
    id: 'private-colleges',
    slug: 'private-colleges',
    name: 'Private Colleges',
    shortName: 'Private Colleges',
    category: 'educational',
    icon: 'Building',
    description: 'Comprehensive power solutions for private colleges and technical institutions',
    keywords: ['college generators', 'technical college power', 'private college backup power', 'tertiary institution generators'],
    metaTemplate: {
      title: 'Generators for Private Colleges in {location} | College Power Solutions',
      description: 'Reliable generators for private colleges in {location}. Power for workshops, labs, and hostels. Professional installation. Call +254768860665',
      h1: 'Generators for Private Colleges in {location}'
    },
    powerNeeds: ['Workshops', 'Technical labs', 'Student hostels', 'Administration', 'Libraries'],
    challenges: ['High power demand', 'Multiple facilities', 'Technical equipment', 'Extended hours'],
    solutions: ['Industrial generators', 'Load management', 'Solar integration', 'Smart monitoring'],
    faqs: [
      { question: 'What power capacity do colleges need in {location}?', answer: 'Colleges typically need 100-500kVA depending on facilities. We conduct detailed load analysis for accurate sizing.' },
      { question: 'Can generators power welding workshops?', answer: 'Yes, we supply generators suitable for workshops with high starting current requirements.' },
      { question: 'Do you offer maintenance contracts?', answer: 'Yes, our AMC contracts ensure your college has reliable power throughout the academic year.' }
    ]
  },
  {
    id: 'private-universities',
    slug: 'private-universities',
    name: 'Private Universities',
    shortName: 'Private Universities',
    category: 'educational',
    icon: 'University',
    description: 'Enterprise-grade power infrastructure for private universities',
    keywords: ['university generators', 'campus power solutions', 'private university power', 'university backup systems'],
    metaTemplate: {
      title: 'Generators for Private Universities in {location} | Campus Power Systems',
      description: 'Enterprise power solutions for universities in {location}. Campus-wide backup power. Data centers, labs, hostels. Call +254768860665',
      h1: 'Generators for Private Universities in {location}'
    },
    powerNeeds: ['Data centers', 'Research facilities', 'Multiple campuses', 'Student housing', 'Medical schools'],
    challenges: ['Critical research equipment', 'Large campuses', 'High availability needs', 'Energy efficiency'],
    solutions: ['Paralleled generator systems', 'UPS integration', 'Solar hybrid systems', 'Energy management'],
    faqs: [
      { question: 'How do you handle university-scale power needs?', answer: 'We design comprehensive power systems with multiple synchronized generators, automatic failover, and central monitoring.' },
      { question: 'Can you integrate with existing university infrastructure?', answer: 'Yes, we work with existing electrical systems and can integrate new generators with minimal disruption.' },
      { question: 'What about data center power in {location}?', answer: 'We provide N+1 redundant power solutions for university data centers with UPS and generator backup.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // HEALTHCARE
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'hospitals',
    slug: 'hospitals',
    name: 'Hospitals',
    shortName: 'Hospitals',
    category: 'healthcare',
    icon: 'Hospital',
    description: 'Critical power solutions for hospitals requiring 100% uptime',
    keywords: ['hospital generators', 'medical facility power', 'hospital backup power', 'healthcare generators', 'ICU power backup'],
    metaTemplate: {
      title: 'Generators for Hospitals in {location} | Hospital Power Solutions Kenya',
      description: 'Critical power solutions for hospitals in {location}. 100% uptime for ICU, theatres, and medical equipment. 24/7 support. Call +254768860665',
      h1: 'Generators for Hospitals in {location}'
    },
    powerNeeds: ['ICU units', 'Operating theatres', 'Medical equipment', 'Ventilators', 'Blood banks'],
    challenges: ['Zero downtime requirement', 'Critical equipment', 'Life safety', 'Regulatory compliance'],
    solutions: ['Redundant power systems', 'Instant transfer', 'Medical-grade power', '24/7 emergency response'],
    faqs: [
      { question: 'How quickly does backup power activate in hospitals?', answer: 'Our hospital systems provide power transfer within 10 seconds, with critical circuits on UPS for instant backup.' },
      { question: 'Are your generators medical facility compliant?', answer: 'Yes, we install generators that meet international healthcare standards for power quality and reliability.' },
      { question: 'Do you provide 24/7 hospital support in {location}?', answer: 'Yes, hospitals receive priority 24/7 emergency support with response times under 2 hours.' }
    ]
  },
  {
    id: 'private-hospitals',
    slug: 'private-hospitals',
    name: 'Private Hospitals',
    shortName: 'Private Hospitals',
    category: 'healthcare',
    icon: 'HeartPulse',
    description: 'Premium power infrastructure for private hospitals and specialist clinics',
    keywords: ['private hospital generators', 'clinic power solutions', 'specialist hospital power', 'medical center generators'],
    metaTemplate: {
      title: 'Generators for Private Hospitals in {location} | Medical Power Solutions',
      description: 'Premium power solutions for private hospitals in {location}. Specialist clinics, imaging centers. Zero downtime systems. Call +254768860665',
      h1: 'Generators for Private Hospitals in {location}'
    },
    powerNeeds: ['MRI machines', 'CT scanners', 'Radiology', 'Pharmacy cold storage', 'Patient monitoring'],
    challenges: ['Sensitive imaging equipment', 'Power quality requirements', 'Clean power needs', 'Expansion planning'],
    solutions: ['Clean power generators', 'Online UPS systems', 'Power conditioning', 'Scalable systems'],
    faqs: [
      { question: 'Can generators power MRI machines in {location}?', answer: 'Yes, we install generators with clean, stable power suitable for sensitive imaging equipment like MRI and CT scanners.' },
      { question: 'What about power for pharmacy cold chains?', answer: 'We ensure continuous power for pharmacy refrigeration with automatic backup and temperature monitoring.' },
      { question: 'How do you handle hospital expansions?', answer: 'We design scalable systems that can grow with your hospital, including modular generator solutions.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FINANCIAL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'banks',
    slug: 'banks',
    name: 'Banks',
    shortName: 'Banks',
    category: 'financial',
    icon: 'Landmark',
    description: 'Secure power solutions for banks and financial institutions',
    keywords: ['bank generators', 'financial institution power', 'ATM backup power', 'bank branch generators', 'data center power'],
    metaTemplate: {
      title: 'Generators for Banks in {location} | Financial Institution Power',
      description: 'Secure power solutions for banks in {location}. ATMs, branches, data centers. Reliable backup power. 24/7 support. Call +254768860665',
      h1: 'Generators for Banks in {location}'
    },
    powerNeeds: ['ATM networks', 'Branch operations', 'Data centers', 'Security systems', 'Communication'],
    challenges: ['Transaction continuity', 'Data security', 'Multi-site requirements', 'Regulatory compliance'],
    solutions: ['Instant transfer systems', 'Remote monitoring', 'Centralized management', 'Secure installations'],
    faqs: [
      { question: 'How do you ensure ATM uptime in {location}?', answer: 'We install generators with instant transfer switches ensuring ATMs remain operational during power outages.' },
      { question: 'Can you power multiple bank branches?', answer: 'Yes, we provide solutions for single branches to entire bank networks with centralized monitoring.' },
      { question: 'What about bank data center power?', answer: 'We design redundant power systems for bank data centers with multiple backup levels.' }
    ]
  },
  {
    id: 'private-offices',
    slug: 'private-offices',
    name: 'Private Offices',
    shortName: 'Private Offices',
    category: 'financial',
    icon: 'Briefcase',
    description: 'Professional power solutions for office buildings and business centers',
    keywords: ['office generators', 'business center power', 'corporate office backup', 'office building generators'],
    metaTemplate: {
      title: 'Generators for Private Offices in {location} | Office Power Solutions',
      description: 'Reliable power for private offices in {location}. Keep business running during outages. Silent generators. Call +254768860665',
      h1: 'Generators for Private Offices in {location}'
    },
    powerNeeds: ['Computers', 'Servers', 'HVAC', 'Lighting', 'Communication systems'],
    challenges: ['Business continuity', 'Noise restrictions', 'Space constraints', 'Tenant requirements'],
    solutions: ['Silent generators', 'Compact designs', 'Rooftop installation', 'Shared power systems'],
    faqs: [
      { question: 'What size generator for a typical office in {location}?', answer: 'Small offices need 15-30kVA, medium offices 50-100kVA. We assess your specific power requirements.' },
      { question: 'Can generators be installed on office rooftops?', answer: 'Yes, we install rooftop generators with proper soundproofing and vibration isolation.' },
      { question: 'How quiet are office generators?', answer: 'Our office generators operate at 65dB or less, suitable for commercial environments.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMMERCIAL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'supermarkets',
    slug: 'supermarkets',
    name: 'Supermarkets',
    shortName: 'Supermarkets',
    category: 'commercial',
    icon: 'ShoppingCart',
    description: 'Reliable power solutions for supermarkets and retail chains',
    keywords: ['supermarket generators', 'retail power solutions', 'cold storage backup', 'grocery store generators'],
    metaTemplate: {
      title: 'Generators for Supermarkets in {location} | Retail Power Solutions',
      description: 'Reliable generators for supermarkets in {location}. Protect cold storage, keep checkouts running. Fast installation. Call +254768860665',
      h1: 'Generators for Supermarkets in {location}'
    },
    powerNeeds: ['Refrigeration', 'Freezers', 'POS systems', 'Lighting', 'HVAC'],
    challenges: ['Cold chain protection', 'High power demand', 'Business continuity', 'Multiple locations'],
    solutions: ['Automatic backup', 'Priority circuits', 'Remote monitoring', 'Chain-wide solutions'],
    faqs: [
      { question: 'How do you protect cold storage during outages?', answer: 'Our generators with automatic transfer switches ensure refrigeration continues within seconds of a power outage.' },
      { question: 'What capacity for a large supermarket in {location}?', answer: 'Large supermarkets typically need 150-300kVA. We conduct load analysis for accurate sizing.' },
      { question: 'Can you support multiple store locations?', answer: 'Yes, we provide standardized solutions for retail chains with centralized monitoring capabilities.' }
    ]
  },
  {
    id: 'hotels',
    slug: 'hotels',
    name: 'Hotels',
    shortName: 'Hotels',
    category: 'commercial',
    icon: 'Hotel',
    description: 'Premium power solutions for hotels and hospitality industry',
    keywords: ['hotel generators', 'hospitality power solutions', 'resort generators', 'hotel backup power'],
    metaTemplate: {
      title: 'Generators for Hotels in {location} | Hospitality Power Solutions',
      description: 'Premium generators for hotels in {location}. Keep guests comfortable 24/7. Silent operation, reliable power. Call +254768860665',
      h1: 'Generators for Hotels in {location}'
    },
    powerNeeds: ['Guest rooms', 'Restaurants', 'Kitchens', 'Laundry', 'Pool systems', 'Elevators'],
    challenges: ['Guest comfort', 'Noise sensitivity', '24/7 operation', 'Peak demand management'],
    solutions: ['Silent generators', 'Load management', 'Scheduled testing', 'Solar integration'],
    faqs: [
      { question: 'How quiet are hotel generators?', answer: 'We install soundproof generators at 65dB or less, ensuring guest comfort even when backup power is running.' },
      { question: 'Can generators power hotel elevators in {location}?', answer: 'Yes, we size generators to handle elevator starting currents and prioritize critical loads.' },
      { question: 'What about hotel kitchen equipment?', answer: 'We ensure adequate power for all kitchen equipment including large ovens and refrigeration.' }
    ]
  },
  {
    id: 'tourist-hotels',
    slug: 'tourist-hotels',
    name: 'Tourist Hotels',
    shortName: 'Tourist Hotels',
    category: 'commercial',
    icon: 'Palmtree',
    description: 'Reliable power for tourist lodges, resorts, and safari camps',
    keywords: ['lodge generators', 'safari camp power', 'resort generators', 'tourist hotel power', 'eco-lodge power'],
    metaTemplate: {
      title: 'Generators for Tourist Hotels in {location} | Lodge & Resort Power',
      description: 'Reliable power for tourist hotels in {location}. Safari lodges, beach resorts. Silent, eco-friendly options. Call +254768860665',
      h1: 'Generators for Tourist Hotels in {location}'
    },
    powerNeeds: ['Guest cottages', 'Central facilities', 'Water treatment', 'Safari vehicles', 'Communication'],
    challenges: ['Remote locations', 'Environmental sensitivity', 'Fuel logistics', 'Wildlife consideration'],
    solutions: ['Hybrid solar-generator', 'Silent operation', 'Fuel-efficient systems', 'Remote monitoring'],
    faqs: [
      { question: 'Do you serve remote safari lodges in {location}?', answer: 'Yes, we specialize in remote installations including safari camps with solar-generator hybrid systems.' },
      { question: 'What about eco-friendly options?', answer: 'We offer hybrid systems with solar priority, reducing fuel consumption and environmental impact.' },
      { question: 'How do you handle fuel delivery to remote areas?', answer: 'We design fuel-efficient systems and can coordinate with fuel suppliers for remote locations.' }
    ]
  },
  {
    id: 'restaurants',
    slug: 'restaurants',
    name: 'Restaurants',
    shortName: 'Restaurants',
    category: 'commercial',
    icon: 'UtensilsCrossed',
    description: 'Power solutions for restaurants and food service establishments',
    keywords: ['restaurant generators', 'food service power', 'kitchen backup power', 'restaurant backup generator'],
    metaTemplate: {
      title: 'Generators for Restaurants in {location} | Food Service Power',
      description: 'Reliable generators for restaurants in {location}. Keep kitchens running, protect cold storage. Fast installation. Call +254768860665',
      h1: 'Generators for Restaurants in {location}'
    },
    powerNeeds: ['Kitchen equipment', 'Refrigeration', 'HVAC', 'POS systems', 'Lighting'],
    challenges: ['Food safety', 'Customer experience', 'Space constraints', 'Noise in dining areas'],
    solutions: ['Compact generators', 'Fast transfer', 'Remote installation', 'Priority circuits'],
    faqs: [
      { question: 'What size generator for a restaurant in {location}?', answer: 'Small restaurants need 20-40kVA, large restaurants 50-100kVA depending on kitchen equipment.' },
      { question: 'How quickly does backup power activate?', answer: 'Our automatic systems activate within 10 seconds, protecting refrigeration and keeping kitchens operational.' },
      { question: 'Can generators be installed away from the dining area?', answer: 'Yes, we can install generators remotely with proper cabling to minimize noise impact.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // INSTITUTIONAL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'ngos',
    slug: 'ngos',
    name: 'NGOs',
    shortName: 'NGOs',
    category: 'institutional',
    icon: 'Heart',
    description: 'Reliable power solutions for non-governmental organizations',
    keywords: ['NGO generators', 'humanitarian power', 'charity organization power', 'non-profit generators'],
    metaTemplate: {
      title: 'Generators for NGOs in {location} | Non-Profit Power Solutions',
      description: 'Reliable generators for NGOs in {location}. Field offices, refugee camps, humanitarian operations. Call +254768860665',
      h1: 'Generators for NGOs in {location}'
    },
    powerNeeds: ['Field offices', 'Communication', 'Medical facilities', 'Storage facilities', 'Staff accommodation'],
    challenges: ['Budget constraints', 'Remote locations', 'Rapid deployment', 'Varied requirements'],
    solutions: ['Cost-effective options', 'Mobile generators', 'Quick installation', 'Flexible financing'],
    faqs: [
      { question: 'Do you offer special pricing for NGOs in {location}?', answer: 'Yes, we offer competitive pricing and flexible payment terms for registered non-profit organizations.' },
      { question: 'Can you deploy generators to remote field locations?', answer: 'Yes, we have experience deploying power solutions to remote humanitarian sites.' },
      { question: 'What about temporary installations?', answer: 'We offer both permanent and temporary generator solutions with rental options available.' }
    ]
  },
  {
    id: 'ngo-offices',
    slug: 'ngo-offices',
    name: 'NGO Offices',
    shortName: 'NGO Offices',
    category: 'institutional',
    icon: 'Building2',
    description: 'Power solutions for NGO headquarters and regional offices',
    keywords: ['NGO office generators', 'international organization power', 'regional office backup', 'country office generators'],
    metaTemplate: {
      title: 'Generators for NGO Offices in {location} | Office Power Solutions',
      description: 'Reliable power for NGO offices in {location}. Keep operations running during outages. Professional installation. Call +254768860665',
      h1: 'Generators for NGO Offices in {location}'
    },
    powerNeeds: ['Office equipment', 'Servers', 'Communication', 'Security systems', 'Meeting rooms'],
    challenges: ['Operational continuity', 'Data protection', 'Budget management', 'Staff safety'],
    solutions: ['Reliable backup', 'UPS integration', 'Cost optimization', 'Maintenance contracts'],
    faqs: [
      { question: 'What size generator for an NGO office in {location}?', answer: 'Typical NGO offices need 20-50kVA. We assess your specific requirements for accurate sizing.' },
      { question: 'Can you integrate with existing office UPS?', answer: 'Yes, we design systems that work seamlessly with existing UPS for comprehensive power protection.' },
      { question: 'Do you offer maintenance contracts for NGOs?', answer: 'Yes, we offer flexible maintenance agreements tailored to NGO operational and budget requirements.' }
    ]
  },
  {
    id: 'embassies',
    slug: 'embassies',
    name: 'Embassies',
    shortName: 'Embassies',
    category: 'institutional',
    icon: 'Flag',
    description: 'Secure power solutions for embassies and diplomatic missions',
    keywords: ['embassy generators', 'diplomatic mission power', 'consulate generators', 'embassy backup power'],
    metaTemplate: {
      title: 'Generators for Embassies in {location} | Diplomatic Power Solutions',
      description: 'Secure power solutions for embassies in {location}. Critical communication systems, security. 24/7 support available. Call +254768860665',
      h1: 'Generators for Embassies in {location}'
    },
    powerNeeds: ['Communication systems', 'Security systems', 'Server rooms', 'Residences', 'Visa processing'],
    challenges: ['Security requirements', 'Diplomatic protocols', '24/7 availability', 'Multi-building campuses'],
    solutions: ['High-security installations', 'Redundant systems', 'Priority support', 'Confidential service'],
    faqs: [
      { question: 'Do you have security clearance for embassy work?', answer: 'We work with embassies following all required security protocols and can coordinate with security teams.' },
      { question: 'What about redundant power systems?', answer: 'We design N+1 redundant systems ensuring continuous power for critical diplomatic operations.' },
      { question: 'Is 24/7 support available for embassies in {location}?', answer: 'Yes, embassies receive priority 24/7 emergency support with rapid response times.' }
    ]
  },
  {
    id: 'consulates',
    slug: 'consulates',
    name: 'Consulates',
    shortName: 'Consulates',
    category: 'institutional',
    icon: 'Building',
    description: 'Reliable power for consulates and visa processing centers',
    keywords: ['consulate generators', 'visa office power', 'diplomatic office generators', 'consulate backup power'],
    metaTemplate: {
      title: 'Generators for Consulates in {location} | Consular Power Solutions',
      description: 'Reliable power for consulates in {location}. Visa processing, communication systems. Professional service. Call +254768860665',
      h1: 'Generators for Consulates in {location}'
    },
    powerNeeds: ['Visa processing', 'Biometric systems', 'Communication', 'Security', 'Public areas'],
    challenges: ['Public-facing operations', 'Data security', 'Service continuity', 'Queue management'],
    solutions: ['Instant backup', 'Clean power', 'Professional service', 'Maintenance contracts'],
    faqs: [
      { question: 'Can generators support biometric visa systems?', answer: 'Yes, we provide clean, stable power suitable for sensitive biometric and IT equipment.' },
      { question: 'What about power during public hours?', answer: 'Our automatic systems ensure seamless power transition without interrupting public services.' },
      { question: 'Do you serve multiple consulates in {location}?', answer: 'Yes, we can provide standardized solutions across multiple consular offices.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // INDUSTRIAL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'industries',
    slug: 'industries',
    name: 'Industries',
    shortName: 'Industries',
    category: 'industrial',
    icon: 'Factory',
    description: 'Heavy-duty power solutions for manufacturing and industrial facilities',
    keywords: ['industrial generators', 'factory generators', 'manufacturing power', 'industrial backup power'],
    metaTemplate: {
      title: 'Generators for Industries in {location} | Industrial Power Solutions',
      description: 'Heavy-duty generators for industries in {location}. Manufacturing, factories, warehouses. 10kVA to 2500kVA. Call +254768860665',
      h1: 'Generators for Industries in {location}'
    },
    powerNeeds: ['Production lines', 'Heavy machinery', 'Compressors', 'HVAC', 'Warehousing'],
    challenges: ['High power demand', 'Starting currents', 'Production continuity', 'Power quality'],
    solutions: ['Industrial generators', 'Power factor correction', 'Load management', 'Parallel systems'],
    faqs: [
      { question: 'What capacity for industrial applications in {location}?', answer: 'Industrial needs vary from 100kVA to 2500kVA+. We conduct detailed load analysis for proper sizing.' },
      { question: 'Can generators handle motor starting currents?', answer: 'Yes, we size generators to handle high inrush currents from motors and compressors.' },
      { question: 'What about continuous industrial operation?', answer: 'We supply prime-rated generators designed for continuous industrial operation.' }
    ]
  },
  {
    id: 'quarries',
    slug: 'quarries',
    name: 'Quarries',
    shortName: 'Quarries',
    category: 'industrial',
    icon: 'Mountain',
    description: 'Rugged power solutions for quarries and mining operations',
    keywords: ['quarry generators', 'mining generators', 'crusher power', 'quarry backup power'],
    metaTemplate: {
      title: 'Generators for Quarries in {location} | Mining Power Solutions',
      description: 'Rugged generators for quarries in {location}. Power for crushers, conveyors, processing. Heavy-duty solutions. Call +254768860665',
      h1: 'Generators for Quarries in {location}'
    },
    powerNeeds: ['Crushers', 'Conveyors', 'Screening plants', 'Water pumps', 'Site offices'],
    challenges: ['Harsh environment', 'High starting loads', 'Dust and debris', 'Remote locations'],
    solutions: ['Rugged designs', 'Heavy-duty generators', 'Enhanced filtration', 'Mobile solutions'],
    faqs: [
      { question: 'Can generators power stone crushers in {location}?', answer: 'Yes, we supply generators specifically sized for crusher starting and running requirements.' },
      { question: 'How do you protect generators from dust?', answer: 'We install enhanced air filtration and sealed enclosures suitable for dusty quarry environments.' },
      { question: 'What about remote quarry sites?', answer: 'We deploy generators to remote sites with fuel-efficient designs to minimize logistics.' }
    ]
  },
  {
    id: 'flower-farms',
    slug: 'flower-farms',
    name: 'Flower Farms',
    shortName: 'Flower Farms',
    category: 'industrial',
    icon: 'Flower2',
    description: 'Reliable power for flower farms and horticultural operations',
    keywords: ['flower farm generators', 'greenhouse power', 'horticulture generators', 'farm cold storage power'],
    metaTemplate: {
      title: 'Generators for Flower Farms in {location} | Agricultural Power',
      description: 'Reliable generators for flower farms in {location}. Cold storage, irrigation, greenhouses. Protect your harvest. Call +254768860665',
      h1: 'Generators for Flower Farms in {location}'
    },
    powerNeeds: ['Cold rooms', 'Pack houses', 'Irrigation', 'Greenhouses', 'Grading equipment'],
    challenges: ['Product protection', '24/7 cold chain', 'Irrigation timing', 'Harvest schedules'],
    solutions: ['Automatic backup', 'Priority cold storage', 'Irrigation integration', 'Reliable systems'],
    faqs: [
      { question: 'How do you protect flower cold rooms during outages?', answer: 'Our automatic transfer systems ensure cold rooms remain powered within seconds of a power failure.' },
      { question: 'Can generators power irrigation systems?', answer: 'Yes, we size generators to handle irrigation pump requirements for uninterrupted watering schedules.' },
      { question: 'What about pack house operations?', answer: 'We provide reliable power for grading, packing, and pre-cooling operations.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'apartments',
    slug: 'apartments',
    name: 'Apartments',
    shortName: 'Apartments',
    category: 'residential',
    icon: 'Building2',
    description: 'Power solutions for apartment complexes and residential buildings',
    keywords: ['apartment generators', 'residential building power', 'condo generators', 'apartment backup power'],
    metaTemplate: {
      title: 'Generators for Apartments in {location} | Residential Power',
      description: 'Reliable generators for apartments in {location}. Lifts, water pumps, common areas. Silent operation. Call +254768860665',
      h1: 'Generators for Apartments in {location}'
    },
    powerNeeds: ['Elevators', 'Water pumps', 'Common areas', 'Security systems', 'Parking'],
    challenges: ['Noise restrictions', 'Space limitations', 'Multiple stakeholders', 'Cost sharing'],
    solutions: ['Silent generators', 'Rooftop installation', 'Shared systems', 'Management support'],
    faqs: [
      { question: 'What size generator for an apartment building in {location}?', answer: 'Depends on building size and amenities. Small buildings need 50-100kVA, larger ones 150-300kVA.' },
      { question: 'Can generators power building elevators?', answer: 'Yes, we size generators to handle elevator motor starting requirements safely.' },
      { question: 'How quiet are apartment generators?', answer: 'We install soundproof generators at 65dB or less, compliant with residential noise regulations.' }
    ]
  },
  {
    id: 'real-estates',
    slug: 'real-estates',
    name: 'Real Estates',
    shortName: 'Real Estates',
    category: 'residential',
    icon: 'Home',
    description: 'Power infrastructure for real estate developments and gated communities',
    keywords: ['real estate generators', 'gated community power', 'estate generators', 'residential estate power'],
    metaTemplate: {
      title: 'Generators for Real Estates in {location} | Estate Power Solutions',
      description: 'Reliable power for real estates in {location}. Gated communities, residential developments. Common area backup. Call +254768860665',
      h1: 'Generators for Real Estates in {location}'
    },
    powerNeeds: ['Street lighting', 'Security gates', 'Water supply', 'Clubhouse', 'Common facilities'],
    challenges: ['Estate-wide coverage', 'Noise control', 'Aesthetic requirements', 'Resident satisfaction'],
    solutions: ['Centralized systems', 'Silent operation', 'Concealed installation', 'Remote monitoring'],
    faqs: [
      { question: 'Can one generator power an entire estate in {location}?', answer: 'For smaller estates, yes. Larger estates may need distributed or centralized high-capacity systems.' },
      { question: 'What about aesthetic considerations?', answer: 'We offer concealed installation options and soundproof enclosures that blend with estate design.' },
      { question: 'How do you handle estate management coordination?', answer: 'We work directly with estate management committees and property managers.' }
    ]
  },
  {
    id: 'homes',
    slug: 'homes',
    name: 'Homes',
    shortName: 'Homes',
    category: 'residential',
    icon: 'House',
    description: 'Home backup power solutions for residential properties',
    keywords: ['home generators', 'residential generators', 'house backup power', 'home standby generator'],
    metaTemplate: {
      title: 'Generators for Homes in {location} | Home Backup Power',
      description: 'Home generators in {location}. Keep your family comfortable during outages. Automatic backup, quiet operation. Call +254768860665',
      h1: 'Generators for Homes in {location}'
    },
    powerNeeds: ['Lighting', 'Refrigeration', 'Water heater', 'Security', 'Home office'],
    challenges: ['Family comfort', 'Noise sensitivity', 'Fuel storage', 'Automatic operation'],
    solutions: ['Quiet generators', 'Automatic start', 'Compact designs', 'Solar hybrid'],
    faqs: [
      { question: 'What size generator for a typical home in {location}?', answer: 'Most homes need 10-25kVA depending on air conditioning and appliances. We assess your needs.' },
      { question: 'Will the generator start automatically?', answer: 'Yes, we install automatic transfer switches so backup power activates without any action needed.' },
      { question: 'Are home generators noisy?', answer: 'We offer quiet generators at 60-65dB, suitable for residential neighborhoods.' }
    ]
  },
  {
    id: 'farms',
    slug: 'farms',
    name: 'Farms',
    shortName: 'Farms',
    category: 'residential',
    icon: 'Tractor',
    description: 'Agricultural power solutions for farms and ranches',
    keywords: ['farm generators', 'agricultural power', 'dairy farm generators', 'poultry farm power'],
    metaTemplate: {
      title: 'Generators for Farms in {location} | Agricultural Power Solutions',
      description: 'Reliable generators for farms in {location}. Dairy, poultry, crop farming. Irrigation, cold storage, processing. Call +254768860665',
      h1: 'Generators for Farms in {location}'
    },
    powerNeeds: ['Irrigation pumps', 'Milking machines', 'Cold storage', 'Processing', 'Farm buildings'],
    challenges: ['Remote locations', 'Variable loads', 'Equipment protection', 'Fuel logistics'],
    solutions: ['Rugged generators', 'Solar hybrid', 'Automatic backup', 'Mobile options'],
    faqs: [
      { question: 'Can generators power irrigation in {location}?', answer: 'Yes, we size generators for irrigation pump requirements including borehole and surface pumps.' },
      { question: 'What about dairy farm milking equipment?', answer: 'We ensure reliable power for milking machines and milk cooling tanks to protect your dairy operation.' },
      { question: 'Do you serve remote farm locations?', answer: 'Yes, we deploy and service generators at remote agricultural sites throughout {location}.' }
    ]
  },
  {
    id: 'ranches',
    slug: 'ranches',
    name: 'Ranches',
    shortName: 'Ranches',
    category: 'residential',
    icon: 'Fence',
    description: 'Power solutions for ranches and livestock operations',
    keywords: ['ranch generators', 'livestock farm power', 'ranch backup power', 'cattle ranch generators'],
    metaTemplate: {
      title: 'Generators for Ranches in {location} | Ranch Power Solutions',
      description: 'Reliable power for ranches in {location}. Water pumping, fencing, processing facilities. Remote site experts. Call +254768860665',
      h1: 'Generators for Ranches in {location}'
    },
    powerNeeds: ['Water pumping', 'Electric fencing', 'Processing facilities', 'Cold storage', 'Staff quarters'],
    challenges: ['Large areas', 'Remote locations', 'Variable demands', 'Equipment durability'],
    solutions: ['Mobile generators', 'Solar borehole pumps', 'Rugged equipment', 'Fuel-efficient systems'],
    faqs: [
      { question: 'Can generators power ranch water systems in {location}?', answer: 'Yes, we provide generators for borehole pumps, water storage, and distribution systems.' },
      { question: 'What about electric fencing?', answer: 'We can integrate generator backup for electric fence energizers to maintain livestock security.' },
      { question: 'Do you handle very remote ranch locations?', answer: 'Yes, we specialize in remote installations with fuel-efficient designs to reduce logistics needs.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RELIGIOUS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'churches',
    slug: 'churches',
    name: 'Churches',
    shortName: 'Churches',
    category: 'religious',
    icon: 'Church',
    description: 'Power solutions for churches and religious institutions',
    keywords: ['church generators', 'religious institution power', 'worship center generators', 'church backup power'],
    metaTemplate: {
      title: 'Generators for Churches in {location} | Religious Institution Power',
      description: 'Reliable generators for churches in {location}. Keep services running during outages. Sound systems, lighting. Call +254768860665',
      h1: 'Generators for Churches in {location}'
    },
    powerNeeds: ['Sound systems', 'Lighting', 'Projectors', 'HVAC', 'Recording equipment'],
    challenges: ['Service continuity', 'Sound quality', 'Budget management', 'Large gatherings'],
    solutions: ['Clean power', 'Silent operation', 'Flexible financing', 'Automatic backup'],
    faqs: [
      { question: 'Will generators affect sound system quality?', answer: 'No, we install generators with clean power output suitable for professional sound and recording equipment.' },
      { question: 'What size for a large church in {location}?', answer: 'Large churches with PA systems and AC typically need 50-150kVA. We assess your specific needs.' },
      { question: 'Do you offer financing for churches?', answer: 'Yes, we offer flexible payment options suitable for religious organization budgets.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TOURISM
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'masai-mara',
    slug: 'masai-mara',
    name: 'Masai Mara',
    shortName: 'Masai Mara',
    category: 'tourism',
    icon: 'Tent',
    description: 'Power solutions for Masai Mara lodges and safari camps',
    keywords: ['masai mara generators', 'safari lodge power', 'mara camp generators', 'wildlife lodge power'],
    metaTemplate: {
      title: 'Generators for Masai Mara Lodges | Safari Camp Power Solutions',
      description: 'Reliable power for Masai Mara lodges and camps. Solar-generator hybrid, silent operation. Wildlife-friendly systems. Call +254768860665',
      h1: 'Generators for Masai Mara Lodges'
    },
    powerNeeds: ['Guest tents', 'Main lodge', 'Kitchen', 'Water treatment', 'Communication'],
    challenges: ['Wildlife consideration', 'Environmental sensitivity', 'Remote location', 'Guest experience'],
    solutions: ['Hybrid solar systems', 'Silent generators', 'Eco-friendly options', 'Remote monitoring'],
    faqs: [
      { question: 'How quiet are generators for Mara camps?', answer: 'We use ultra-quiet generators at 60dB or less, minimizing wildlife disturbance and maintaining guest experience.' },
      { question: 'What about solar-generator hybrid systems?', answer: 'We specialize in hybrid systems that prioritize solar, using generators only when needed for eco-friendly operation.' },
      { question: 'Can you service generators in the Mara?', answer: 'Yes, we provide regular maintenance and emergency support for Masai Mara installations.' }
    ]
  },
  {
    id: 'tourist-destinations',
    slug: 'tourist-destinations',
    name: 'Tourist Destinations',
    shortName: 'Tourist Sites',
    category: 'tourism',
    icon: 'MapPin',
    description: 'Power solutions for tourist attractions and destination facilities',
    keywords: ['tourist destination power', 'attraction generators', 'visitor center power', 'tourist facility generators'],
    metaTemplate: {
      title: 'Generators for Tourist Destinations in {location} | Attraction Power',
      description: 'Reliable power for tourist destinations in {location}. Visitor centers, attractions, facilities. Professional service. Call +254768860665',
      h1: 'Generators for Tourist Destinations in {location}'
    },
    powerNeeds: ['Visitor centers', 'Exhibits', 'Gift shops', 'Restaurants', 'Security'],
    challenges: ['Visitor experience', 'Operational hours', 'Peak seasons', 'Environmental impact'],
    solutions: ['Reliable backup', 'Silent operation', 'Scalable systems', 'Green options'],
    faqs: [
      { question: 'How do you ensure visitor experience during outages?', answer: 'Our automatic systems provide seamless power transition, keeping attractions and facilities running smoothly.' },
      { question: 'What about seasonal demand variations?', answer: 'We design systems that can handle peak season demands while remaining efficient during quieter periods.' },
      { question: 'Are eco-friendly options available?', answer: 'Yes, we offer solar-hybrid systems and fuel-efficient generators for environmentally-conscious destinations.' }
    ]
  }
];

/**
 * Get sector by slug
 */
export function getSectorBySlug(slug: string): TargetSector | undefined {
  return TARGET_SECTORS.find(sector => sector.slug === slug);
}

/**
 * Get all sector slugs
 */
export function getAllSectorSlugs(): string[] {
  return TARGET_SECTORS.map(sector => sector.slug);
}

/**
 * Get sectors by category
 */
export function getSectorsByCategory(category: TargetSector['category']): TargetSector[] {
  return TARGET_SECTORS.filter(sector => sector.category === category);
}

/**
 * Generate meta title for sector + location
 */
export function generateSectorTitle(sector: TargetSector, locationName: string): string {
  return sector.metaTemplate.title.replace(/{location}/g, locationName);
}

/**
 * Generate meta description for sector + location
 */
export function generateSectorDescription(sector: TargetSector, locationName: string): string {
  return sector.metaTemplate.description.replace(/{location}/g, locationName);
}

/**
 * Generate H1 for sector + location
 */
export function generateSectorH1(sector: TargetSector, locationName: string): string {
  return sector.metaTemplate.h1.replace(/{location}/g, locationName);
}

/**
 * Generate keywords for sector + location
 */
export function generateSectorKeywords(sector: TargetSector, locationName: string): string[] {
  const keywords: string[] = [];

  for (const keyword of sector.keywords) {
    keywords.push(`${keyword} ${locationName}`);
    keywords.push(`${keyword} in ${locationName}`);
  }

  keywords.push(`${sector.name.toLowerCase()} generator ${locationName}`);
  keywords.push(`${locationName} ${sector.name.toLowerCase()} power`);

  return keywords;
}

/**
 * Generate FAQ items with location substitution
 */
export function generateSectorFAQs(
  sector: TargetSector,
  locationName: string
): Array<{ question: string; answer: string }> {
  return sector.faqs.map(faq => ({
    question: faq.question.replace(/{location}/g, locationName),
    answer: faq.answer.replace(/{location}/g, locationName)
  }));
}

/**
 * Get sector categories
 */
export function getSectorCategories(): string[] {
  const categories = new Set<string>();
  for (const sector of TARGET_SECTORS) {
    categories.add(sector.category);
  }
  return Array.from(categories);
}

/**
 * Get total sector page potential
 */
export function getSectorPagePotential(): {
  sectors: number;
  counties: number;
  totalPages: number;
} {
  const sectors = TARGET_SECTORS.length;
  const counties = 47;

  return {
    sectors,
    counties,
    totalPages: sectors * counties + sectors // sector-location + sector landing
  };
}
