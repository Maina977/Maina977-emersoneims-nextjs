/**
 * COMPREHENSIVE SERVICES DATA - EMERSON EIMS
 *
 * All 10+ services with conversion-focused content
 * Each service includes: benefits, pricing, FAQs, target customers, CTAs
 *
 * Contact: +254768860665 | WhatsApp: +254768860665
 */

import { CONTACT, getWhatsAppUrl, getTelUrl } from '@/lib/constants/contact';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ServiceBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServicePricing {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceTestimonial {
  name: string;
  company: string;
  location: string;
  quote: string;
  rating: number;
}

export interface RelatedService {
  slug: string;
  name: string;
  description: string;
}

export interface Service {
  // Core Info
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;

  // Visual
  icon: string;
  heroImage: string;
  images: string[];

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Content
  benefits: ServiceBenefit[];
  features: string[];
  targetCustomers: string[];
  useCases: string[];

  // Pricing
  priceRange: string;
  startingPrice: string;
  pricingTiers: ServicePricing[];

  // FAQs
  faqs: ServiceFAQ[];

  // Social Proof
  testimonials: ServiceTestimonial[];
  stats: { label: string; value: string }[];

  // Trust Signals
  warranties: string[];
  certifications: string[];

  // Related
  relatedServices: string[];

  // CTAs
  primaryCTA: string;
  secondaryCTA: string;

  // Category
  category: 'power' | 'renewable' | 'electrical' | 'hvac' | 'water' | 'waste' | 'fabrication';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT INFO (for easy reference in templates)
// ═══════════════════════════════════════════════════════════════════════════════

export const BUSINESS_CONTACT = {
  phone: CONTACT.PRIMARY_PHONE,
  phoneIntl: CONTACT.PRIMARY_PHONE_INTL,
  phoneDisplay: '+254 768 860 665',
  whatsapp: CONTACT.PRIMARY_WHATSAPP,
  whatsappUrl: getWhatsAppUrl(CONTACT.PRIMARY_WHATSAPP, 'Hello, I am interested in your services'),
  email: CONTACT.PRIMARY_EMAIL,
  address: CONTACT.ADDRESS.full,
  hours: CONTACT.HOURS,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ALL SERVICES DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_SERVICES: Service[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CUMMINS GENERATORS (3-YEAR WARRANTY)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cummins-generators',
    slug: 'cummins-generators',
    name: 'Cummins Generators',
    shortName: 'Cummins Generators',
    tagline: 'Premium Power with Industry-Leading 3-Year Warranty',
    description: 'Authorized Cummins generator dealer in Kenya. Sales, installation, and maintenance of 10kVA to 2000kVA diesel generators with comprehensive 3-YEAR WARRANTY.',
    longDescription: `EmersonEIMS is Kenya's premier authorized Cummins generator dealer. We provide complete power solutions including sales, professional installation, and ongoing maintenance support for businesses across East Africa.

Our Cummins generators range from compact 10kVA units perfect for small businesses and homes, to massive 2000kVA industrial powerhouses for factories, hospitals, and data centers. Every generator comes with our UNMATCHED 3-YEAR WARRANTY - the best in the industry.

Why Cummins? Cummins engines are renowned worldwide for their reliability, fuel efficiency, and longevity. With proper maintenance, a Cummins generator can provide decades of dependable service. Our certified technicians are factory-trained to ensure your generator performs at peak efficiency.`,

    icon: '⚡',
    heroImage: '/images/GEN%202-1920x1080.png',
    images: [
      '/images/GEN%202-1920x1080.png',
      '/images/cummins-engine.png',
      '/images/generator-installation.png'
    ],

    metaTitle: 'Cummins Generators Kenya | 3-Year Warranty | 10kVA-2000kVA | EmersonEIMS',
    metaDescription: 'Authorized Cummins generator dealer in Kenya. 10kVA to 2000kVA diesel generators with 3-YEAR WARRANTY. Professional installation, maintenance. Call +254768860665',
    keywords: [
      'Cummins generators Kenya',
      'Cummins generator dealer Kenya',
      'buy Cummins generator Nairobi',
      'Cummins 500kVA generator price Kenya',
      'industrial generators Kenya',
      'diesel generators for sale Kenya',
      'backup power solutions Kenya',
      'Cummins authorized dealer'
    ],

    benefits: [
      {
        title: '3-YEAR WARRANTY',
        description: 'Industry-leading warranty coverage on all Cummins generators. Complete peace of mind for your investment.',
        icon: '🛡️'
      },
      {
        title: 'Fuel Efficiency',
        description: 'Cummins engines deliver exceptional fuel economy - up to 15% better than competitors at full load.',
        icon: '⛽'
      },
      {
        title: 'Reliable Performance',
        description: 'Proven track record with millions of Cummins generators operating worldwide in critical applications.',
        icon: '✅'
      },
      {
        title: '24/7 Support',
        description: 'Round-the-clock technical support and emergency service response across Kenya.',
        icon: '📞'
      },
      {
        title: 'Genuine Parts',
        description: 'Access to genuine Cummins spare parts with fast delivery and competitive pricing.',
        icon: '🔧'
      }
    ],

    features: [
      'Electronic governor for stable frequency',
      'Low fuel consumption technology',
      'Sound attenuated canopy options',
      'Automatic Transfer Switch (ATS) included',
      'Remote monitoring capabilities',
      'Deep Sea Electronics controllers',
      'Heavy-duty alternators',
      'Extended fuel tank options',
      'Parallel operation capability',
      'EPA/CARB emission compliant'
    ],

    targetCustomers: [
      'Manufacturing facilities',
      'Hospitals and healthcare centers',
      'Data centers and IT companies',
      'Hotels and hospitality',
      'Shopping malls',
      'Banks and financial institutions',
      'Residential estates',
      'Mining operations',
      'Telecom towers',
      'Government institutions'
    ],

    useCases: [
      'Primary power for off-grid locations',
      'Backup power during outages',
      'Peak shaving to reduce electricity costs',
      'Construction site power',
      'Event and temporary power',
      'Critical facility backup'
    ],

    priceRange: 'KES 350,000 - KES 25,000,000',
    startingPrice: 'From KES 350,000',
    pricingTiers: [
      {
        name: 'Small Business',
        price: 'KES 350,000 - 800,000',
        description: '10kVA - 30kVA generators',
        features: [
          'Perfect for small offices & shops',
          'Single-phase or three-phase options',
          '3-Year Warranty included',
          'Professional installation',
          'Basic ATS included'
        ]
      },
      {
        name: 'Medium Enterprise',
        price: 'KES 800,000 - 3,500,000',
        description: '50kVA - 200kVA generators',
        features: [
          'Ideal for factories & hotels',
          'Sound attenuated canopy',
          '3-Year Warranty included',
          'Automatic Transfer Switch',
          'Remote monitoring option',
          'Extended fuel tank'
        ],
        popular: true
      },
      {
        name: 'Industrial/Critical',
        price: 'KES 3,500,000 - 25,000,000',
        description: '250kVA - 2000kVA generators',
        features: [
          'For hospitals, data centers, large industries',
          'Premium sound attenuation',
          '3-Year Warranty included',
          'Fully automatic operation',
          'Remote monitoring & control',
          'Parallel operation ready',
          'Extended service contract options'
        ]
      }
    ],

    faqs: [
      {
        question: 'Why should I choose Cummins generators over other brands?',
        answer: 'Cummins is the world leader in diesel engine technology with over 100 years of experience. Their generators offer superior fuel efficiency (up to 15% better), longer engine life (20,000+ hours), and the best parts availability in Kenya. Plus, we back every Cummins generator with an industry-leading 3-YEAR WARRANTY.'
      },
      {
        question: 'What size Cummins generator do I need?',
        answer: 'Generator sizing depends on your total load and startup requirements. As a guide: Small office (10-20kVA), Medium business (30-100kVA), Hotel/Factory (150-500kVA), Hospital/Data Center (500-2000kVA). We provide FREE site surveys to calculate your exact requirements.'
      },
      {
        question: 'What is included in the 3-Year Warranty?',
        answer: 'Our 3-Year Warranty covers all manufacturing defects in the engine, alternator, control panel, and canopy. It includes parts and labor for covered repairs. Terms and conditions apply - contact us for full details.'
      },
      {
        question: 'How long does generator installation take?',
        answer: 'Standard installation takes 1-3 days depending on the generator size and site preparation. This includes positioning, fuel connection, electrical wiring, ATS installation, and commissioning with load testing.'
      },
      {
        question: 'Do you offer generator financing?',
        answer: 'Yes! We partner with leading banks to offer flexible financing options. Pay up to 24 months with competitive interest rates. Contact us for financing options tailored to your needs.'
      },
      {
        question: 'What maintenance is required for Cummins generators?',
        answer: 'We recommend service every 250 running hours or 6 months, whichever comes first. Maintenance includes oil/filter change, fuel system check, coolant check, battery test, and overall inspection. We offer Annual Maintenance Contracts (AMC) for hassle-free maintenance.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Warranty', value: '3 Years' },
      { label: 'Emergency Response', value: 'Available 24/7' },
      { label: 'Service Coverage', value: 'Nationwide Kenya' },
      { label: 'Consultation', value: 'Free' }
    ],

    warranties: [
      '3-Year Comprehensive Warranty',
      'Engine warranty by Cummins',
      'Alternator warranty',
      'Parts availability guarantee'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['generator-repairs', 'ats-changeover', 'ups-systems', 'distribution-boards'],

    primaryCTA: 'Get FREE Quote',
    secondaryCTA: 'Download Brochure',

    category: 'power'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. GENERATOR REPAIRS & MAINTENANCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'generator-repairs',
    slug: 'generator-repairs',
    name: 'Generator Repairs & Maintenance',
    shortName: 'Generator Repairs',
    tagline: '24/7 Emergency Repairs | All Brands Serviced',
    description: 'Professional generator repair and maintenance services in Kenya. 24/7 emergency response, scheduled maintenance contracts, and annual servicing packages for all generator brands.',
    longDescription: `Don't let generator problems disrupt your business. EmersonEIMS provides fast, professional generator repair services across Kenya with 24/7 emergency response.

Our factory-trained technicians service ALL generator brands including Cummins, Perkins, Caterpillar, FG Wilson, SDMO, John Deere, Volvo Penta, and more. From minor adjustments to complete engine overhauls, we have the expertise and genuine parts to get your generator running reliably.

EMERGENCY REPAIRS: Power out? Our emergency team is on standby 24/7 with fully-equipped service vehicles ready to respond anywhere in Kenya within hours.

MAINTENANCE CONTRACTS: Prevention is better than cure. Our Annual Maintenance Contracts (AMC) ensure your generator receives regular professional servicing, reducing breakdowns and extending equipment life.`,

    icon: '🔧',
    heroImage: '/images/generator-repair.png',
    images: [
      '/images/generator-repair.png',
      '/images/maintenance-team.png',
      '/images/spare-parts.png'
    ],

    metaTitle: 'Generator Repair Kenya | 24/7 Emergency Service | All Brands | EmersonEIMS',
    metaDescription: 'Professional generator repair services in Kenya. 24/7 emergency response, all brands serviced. Cummins, Perkins, CAT experts. Annual maintenance contracts. Call +254768860665',
    keywords: [
      'generator repair Kenya',
      'generator service Kenya',
      'generator maintenance Nairobi',
      '24/7 generator repair',
      'emergency generator repair Kenya',
      'Cummins generator repair',
      'Perkins generator repair',
      'CAT generator repair',
      'generator AMC Kenya'
    ],

    benefits: [
      {
        title: '24/7 Emergency Response',
        description: 'Round-the-clock emergency repair service. We respond within 2-4 hours across major cities.',
        icon: '🚨'
      },
      {
        title: 'All Brands Serviced',
        description: 'Expert repair for Cummins, Perkins, Caterpillar, FG Wilson, SDMO, and all other brands.',
        icon: '🔩'
      },
      {
        title: 'Genuine Parts',
        description: 'We use only genuine OEM parts for repairs, ensuring reliability and warranty compliance.',
        icon: '✅'
      },
      {
        title: 'Certified Technicians',
        description: 'Factory-trained technicians with extensive experience on all generator types.',
        icon: '👨‍🔧'
      },
      {
        title: 'Transparent Pricing',
        description: 'Clear quotations with no hidden costs. We explain every repair before proceeding.',
        icon: '💰'
      }
    ],

    features: [
      'On-site and workshop repairs',
      'Engine diagnostics and troubleshooting',
      'Controller programming and repair',
      'Alternator testing and rewinding',
      'Fuel system overhaul',
      'Cooling system service',
      'Electrical fault finding',
      'Load bank testing',
      'Emission system repairs',
      'Complete engine overhaul'
    ],

    targetCustomers: [
      'Industrial facilities',
      'Commercial buildings',
      'Hospitals and clinics',
      'Hotels and restaurants',
      'Banks and financial institutions',
      'Telecommunications',
      'Residential customers',
      'Government offices',
      'Schools and universities',
      'Religious institutions'
    ],

    useCases: [
      'Generator won\'t start',
      'Low power output',
      'Excessive fuel consumption',
      'Oil leaks',
      'Overheating issues',
      'Strange noises',
      'Smoke emission',
      'Controller errors',
      'Automatic transfer switch failures',
      'Scheduled preventive maintenance'
    ],

    priceRange: 'KES 5,000 - KES 500,000+',
    startingPrice: 'From KES 5,000',
    pricingTiers: [
      {
        name: 'Basic Service',
        price: 'KES 5,000 - 15,000',
        description: 'Minor repairs and routine service',
        features: [
          'Oil and filter change',
          'Basic diagnostics',
          'Belt and hose inspection',
          'Battery check',
          'Test run and report'
        ]
      },
      {
        name: 'Major Service',
        price: 'KES 25,000 - 80,000',
        description: 'Comprehensive service and repairs',
        features: [
          'All fluids and filters replaced',
          'Fuel system service',
          'Cooling system service',
          'Electrical system check',
          'Controller diagnostics',
          'Load bank test'
        ],
        popular: true
      },
      {
        name: 'Engine Overhaul',
        price: 'KES 150,000 - 500,000+',
        description: 'Complete engine rebuild',
        features: [
          'Full engine teardown',
          'Piston and ring replacement',
          'Bearing replacement',
          'Cylinder head rebuild',
          'Injector reconditioning',
          'Turbo rebuild if needed',
          '6-month warranty on work'
        ]
      },
      {
        name: 'Annual Maintenance Contract',
        price: 'From KES 120,000/year',
        description: 'Comprehensive annual coverage',
        features: [
          '4 scheduled service visits',
          'Priority emergency response',
          'Discounted parts pricing',
          '24/7 phone support',
          'Detailed service records',
          'Performance reports'
        ]
      }
    ],

    faqs: [
      {
        question: 'How quickly can you respond to emergency generator repairs?',
        answer: 'We maintain 24/7 emergency response capability. In Nairobi and major cities, we typically arrive within 2-4 hours. For remote locations, same-day response is usually possible.'
      },
      {
        question: 'Do you repair all generator brands?',
        answer: 'Yes, our technicians are trained to repair all major brands including Cummins, Perkins, Caterpillar, FG Wilson, SDMO, John Deere, Volvo Penta, Deutz, and more.'
      },
      {
        question: 'What is included in an Annual Maintenance Contract (AMC)?',
        answer: 'Our AMC includes 4 scheduled service visits per year, oil and filter changes, comprehensive inspections, priority emergency response, discounted parts, 24/7 phone support, and detailed service records.'
      },
      {
        question: 'Do you provide warranty on repair work?',
        answer: 'Yes, all our repair work carries a warranty. Minor repairs have a 30-day warranty, major repairs 90 days, and engine overhauls have a 6-month warranty. Genuine parts carry manufacturer warranty.'
      },
      {
        question: 'Can you repair generator controllers (DeepSea, ComAp)?',
        answer: 'Absolutely. We have specialized equipment for diagnosing and programming DeepSea, ComAp, Cummins PowerCommand, CAT, and other controllers. We can replace faulty modules and update firmware.'
      },
      {
        question: 'Do you offer on-site repairs or do I need to bring the generator to you?',
        answer: 'We offer both options. Most repairs can be done on-site. For major overhauls or specialized repairs, we can transport your generator to our workshop and provide a temporary replacement if needed.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Emergency Response', value: '24/7' },
      { label: 'Service Coverage', value: 'Nationwide' },
      { label: 'AMC Available', value: 'Yes' },
      { label: 'Diagnosis', value: 'On-Site' }
    ],

    warranties: [
      'Repair work warranty',
      'Genuine parts guarantee',
      'Quality workmanship assurance'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['cummins-generators', 'ats-changeover', 'distribution-boards', 'ups-systems'],

    primaryCTA: 'Request Service',
    secondaryCTA: 'Get AMC Quote',

    category: 'power'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AUTOMATIC TRANSFER SWITCHES (ATS) & CHANGEOVERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ats-changeover',
    slug: 'ats-changeover',
    name: 'Automatic Transfer Switches & Changeovers',
    shortName: 'ATS & Changeovers',
    tagline: 'Seamless Power Transfer | Zero Downtime',
    description: 'Professional installation of automatic and manual changeover switches in Kenya. Seamless power transfer between mains and generator. All capacities from 40A to 4000A.',
    longDescription: `Never manually switch between mains and generator again. Our Automatic Transfer Switch (ATS) systems provide seamless, hands-free power transfer that protects your equipment and ensures uninterrupted power supply.

EmersonEIMS supplies and installs changeover systems for all applications - from small residential units to large industrial complexes. We work with leading brands including ABB, Schneider Electric, Socomec, and trusted local manufacturers.

AUTOMATIC CHANGEOVER (ATS): Senses mains failure automatically, starts the generator, and transfers load without human intervention. Reverses automatically when mains returns.

MANUAL CHANGEOVER: Cost-effective solution for applications where brief manual intervention is acceptable. Safe, properly interlocked to prevent back-feeding.`,

    icon: '🔌',
    heroImage: '/images/solar%20changeover%20control.png',
    images: [
      '/images/solar%20changeover%20control.png',
      '/images/ats-panel.png',
      '/images/changeover-installation.png'
    ],

    metaTitle: 'Automatic Transfer Switch Kenya | ATS Installation | Changeover Switches | EmersonEIMS',
    metaDescription: 'Automatic Transfer Switch (ATS) installation in Kenya. Seamless generator changeover. Manual & automatic options. 40A-4000A. Professional installation. Call +254768860665',
    keywords: [
      'automatic transfer switch Kenya',
      'ATS Kenya',
      'changeover switch Kenya',
      'generator changeover Nairobi',
      'automatic changeover switch',
      'manual changeover switch',
      'power transfer switch Kenya',
      'ABB ATS Kenya',
      'Schneider changeover Kenya'
    ],

    benefits: [
      {
        title: 'Zero Downtime',
        description: 'Automatic transfer in under 10 seconds. Your operations continue without interruption.',
        icon: '⚡'
      },
      {
        title: 'Equipment Protection',
        description: 'Proper voltage and frequency sensing prevents damage to sensitive equipment.',
        icon: '🛡️'
      },
      {
        title: 'Hands-Free Operation',
        description: 'No manual intervention needed. Works automatically 24/7, even when no one is present.',
        icon: '🤖'
      },
      {
        title: 'KPLC Compliant',
        description: 'All installations meet Kenya Power regulations for backup power systems.',
        icon: '✅'
      },
      {
        title: 'Professional Installation',
        description: 'Certified electricians ensure safe, code-compliant installation with proper interlocking.',
        icon: '👨‍🔧'
      }
    ],

    features: [
      'Voltage and frequency monitoring',
      'Adjustable time delays',
      'Under/over voltage protection',
      'Generator start signal interface',
      'Manual override capability',
      'LED status indicators',
      'Test mode for maintenance',
      'Mechanical interlocking',
      'Fire-resistant enclosures',
      'Optional remote monitoring'
    ],

    targetCustomers: [
      'Hospitals and clinics',
      'Data centers',
      'Banks and financial institutions',
      'Manufacturing plants',
      'Hotels and restaurants',
      'Office buildings',
      'Residential homes',
      'Shopping centers',
      'Schools and universities',
      'Telecommunications'
    ],

    useCases: [
      'New generator installations',
      'Upgrading manual to automatic',
      'Adding generator backup to buildings',
      'Solar-grid-generator hybrid systems',
      'Critical facility backup systems',
      'Temporary power setups'
    ],

    priceRange: 'KES 15,000 - KES 1,500,000',
    startingPrice: 'From KES 15,000',
    pricingTiers: [
      {
        name: 'Manual Changeover',
        price: 'KES 15,000 - 45,000',
        description: 'Cost-effective manual switching',
        features: [
          '40A to 400A options',
          'Mechanical interlocking',
          'Clear position indicators',
          'Professional installation',
          'KPLC compliant'
        ]
      },
      {
        name: 'Standard ATS',
        price: 'KES 65,000 - 250,000',
        description: 'Automatic transfer for most applications',
        features: [
          '63A to 630A ratings',
          'Automatic mains sensing',
          'Generator start signal',
          'Adjustable time delays',
          'Manual override option',
          'Status indicators'
        ],
        popular: true
      },
      {
        name: 'Premium ATS',
        price: 'KES 300,000 - 1,500,000',
        description: 'Advanced systems for critical loads',
        features: [
          '800A to 4000A ratings',
          'Advanced voltage/frequency monitoring',
          'Soft transfer capability',
          'Remote monitoring',
          'Programmable logic',
          'Redundant systems available'
        ]
      }
    ],

    faqs: [
      {
        question: 'What is the difference between manual and automatic changeover?',
        answer: 'Manual changeover requires someone to physically switch between mains and generator power - typically takes 1-5 minutes. Automatic changeover (ATS) does this automatically within 5-10 seconds without any human intervention.'
      },
      {
        question: 'How long does ATS installation take?',
        answer: 'Standard ATS installation takes 4-8 hours for residential/small commercial. Large industrial installations may take 1-2 days. We schedule installations to minimize disruption to your operations.'
      },
      {
        question: 'Can you upgrade my manual changeover to automatic?',
        answer: 'Yes, we frequently upgrade manual systems to automatic. We assess your current setup and recommend the most cost-effective upgrade path. The existing enclosure can sometimes be reused.'
      },
      {
        question: 'Is ATS installation required by Kenya Power?',
        answer: 'Yes, KPLC requires a properly installed changeover switch for any backup generator connection. This prevents back-feeding into the grid which is dangerous for utility workers.'
      },
      {
        question: 'What brands of ATS do you install?',
        answer: 'We work with premium brands including ABB, Schneider Electric, Socomec, and Eaton. We also install quality local options for budget-conscious clients without compromising safety.'
      },
      {
        question: 'Do I need a neutral changeover?',
        answer: 'Typically yes, for safety and proper grounding. We always install 4-pole changeovers (3 phase + neutral) for three-phase systems. This is required for KPLC compliance.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Transfer Time', value: '< 10 Sec' },
      { label: 'Warranty', value: '2 Years' },
      { label: 'Installation', value: 'Professional' },
      { label: 'Service', value: 'Nationwide' }
    ],

    warranties: [
      '2-Year product warranty',
      '1-Year installation warranty',
      'Brand manufacturer warranty'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['cummins-generators', 'generator-repairs', 'distribution-boards', 'electrical-services'],

    primaryCTA: 'Get Installation Quote',
    secondaryCTA: 'Compare Options',

    category: 'electrical'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. DISTRIBUTION BOARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'distribution-boards',
    slug: 'distribution-boards',
    name: 'Distribution Boards & Panels',
    shortName: 'Distribution Boards',
    tagline: 'Custom Designed | Professionally Fabricated | KEBS Certified',
    description: 'Design, fabrication, and installation of electrical distribution boards in Kenya. Main distribution boards, sub-boards, motor control centers, and custom panels.',
    longDescription: `EmersonEIMS specializes in the design, fabrication, and installation of electrical distribution boards and control panels for commercial and industrial applications across Kenya.

Our in-house fabrication facility produces high-quality panels that meet international standards. From simple residential distribution boards to complex industrial motor control centers, we deliver solutions tailored to your specific requirements.

SERVICES INCLUDE:
- Custom panel design and engineering
- Fabrication using quality components (ABB, Schneider, Hager, Legrand)
- Professional installation and commissioning
- Existing panel upgrades and modifications
- Panel maintenance and repairs`,

    icon: '⚡',
    heroImage: '/images/distribution-board.png',
    images: [
      '/images/distribution-board.png',
      '/images/mcc-panel.png',
      '/images/panel-fabrication.png'
    ],

    metaTitle: 'Distribution Boards Kenya | Panel Fabrication | MCC | EmersonEIMS',
    metaDescription: 'Distribution board design, fabrication & installation in Kenya. Main DB, sub-boards, motor control centers. KEBS certified. Quality components. Call +254768860665',
    keywords: [
      'distribution board Kenya',
      'electrical panel Kenya',
      'MCC panel Kenya',
      'motor control center Kenya',
      'panel fabrication Nairobi',
      'main distribution board',
      'sub distribution board',
      'electrical panel installation Kenya'
    ],

    benefits: [
      {
        title: 'Custom Design',
        description: 'Panels designed specifically for your load requirements and site conditions.',
        icon: '📐'
      },
      {
        title: 'Quality Components',
        description: 'We use premium brands - ABB, Schneider, Hager, Legrand for reliability.',
        icon: '✅'
      },
      {
        title: 'In-House Fabrication',
        description: 'Our workshop produces consistent, high-quality panels with fast turnaround.',
        icon: '🏭'
      },
      {
        title: 'KEBS Certified',
        description: 'All panels meet Kenya Bureau of Standards requirements.',
        icon: '📋'
      },
      {
        title: 'Complete Service',
        description: 'From design through installation to commissioning - one provider.',
        icon: '🔧'
      }
    ],

    features: [
      'Sheet metal enclosures (powder coated)',
      'IP54/IP65 rating options',
      'Type-tested assemblies',
      'Proper busbar sizing',
      'Cable management solutions',
      'Clear circuit labeling',
      'Documentation and drawings',
      'Compliance certificates',
      'Future expansion provision',
      'Surge protection integration'
    ],

    targetCustomers: [
      'Commercial buildings',
      'Industrial facilities',
      'Residential developers',
      'Hospitals',
      'Hotels',
      'Data centers',
      'Manufacturing plants',
      'Educational institutions',
      'Retail chains',
      'Infrastructure projects'
    ],

    useCases: [
      'New building construction',
      'Factory setup and expansion',
      'Panel upgrades and modernization',
      'Generator changeover panels',
      'Motor control systems',
      'Process control panels',
      'Lighting control panels',
      'Metering panels'
    ],

    priceRange: 'KES 25,000 - KES 2,000,000+',
    startingPrice: 'From KES 25,000',
    pricingTiers: [
      {
        name: 'Residential Boards',
        price: 'KES 25,000 - 80,000',
        description: 'Home distribution boards',
        features: [
          '4 to 24 ways',
          'Quality MCBs and RCCBOs',
          'Proper busbar sizing',
          'Clear labeling',
          'Professional installation'
        ]
      },
      {
        name: 'Commercial Boards',
        price: 'KES 100,000 - 500,000',
        description: 'Office and retail panels',
        features: [
          'Main and sub distribution',
          'MCCB protection',
          'Metering provision',
          'Surge protection',
          'Floor-standing or wall-mount',
          'IP54 rating'
        ],
        popular: true
      },
      {
        name: 'Industrial MCC',
        price: 'KES 500,000 - 2,000,000+',
        description: 'Motor control centers',
        features: [
          'Custom engineered',
          'Type-tested design',
          'VFD integration',
          'PLC control ready',
          'Remote monitoring',
          'Form 4 segregation',
          'Full documentation'
        ]
      }
    ],

    faqs: [
      {
        question: 'How long does panel fabrication take?',
        answer: 'Standard distribution boards take 1-2 weeks. Complex MCC panels may take 3-6 weeks depending on design complexity and component availability. Rush orders can be accommodated.'
      },
      {
        question: 'What components do you use?',
        answer: 'We primarily use ABB, Schneider Electric, Hager, and Legrand components. For budget-sensitive projects, we can recommend quality alternatives while maintaining safety standards.'
      },
      {
        question: 'Do you provide engineering drawings?',
        answer: 'Yes, all panels come with complete documentation including single line diagrams, schematic drawings, wiring diagrams, and component schedules.'
      },
      {
        question: 'Can you upgrade our existing distribution board?',
        answer: 'Absolutely. We frequently upgrade outdated panels to meet current standards, add capacity, or incorporate new protection devices. We assess your current setup and recommend the best approach.'
      },
      {
        question: 'Are your panels KPLC approved?',
        answer: 'Yes, our panels meet KPLC requirements for metering and connection. We can coordinate the KPLC inspection process for new installations.'
      },
      {
        question: 'Do you offer panel maintenance services?',
        answer: 'Yes, we provide regular maintenance including thermal imaging, connection tightening, cleaning, and component testing. This prevents failures and extends panel life.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Lead Time', value: '1-6 Weeks' },
      { label: 'Warranty', value: '2 Years' },
      { label: 'Custom Design', value: 'Available' },
      { label: 'Installation', value: 'Included' }
    ],

    warranties: [
      '2-Year fabrication warranty',
      'Component manufacturer warranties',
      'Installation workmanship guarantee'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['ats-changeover', 'electrical-services', 'cummins-generators', 'ups-systems'],

    primaryCTA: 'Request Custom Quote',
    secondaryCTA: 'View Portfolio',

    category: 'electrical'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SOLAR ENERGY SOLUTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'solar-energy',
    slug: 'solar-energy',
    name: 'Solar Energy Solutions',
    shortName: 'Solar Energy',
    tagline: 'Cut Electricity Bills by 80% | Free Site Assessment',
    description: 'Complete solar energy solutions in Kenya. Residential, commercial, and industrial solar installation. Hybrid systems, battery storage, and net metering. Free site assessment.',
    longDescription: `Harness Kenya's abundant sunshine to power your home or business. EmersonEIMS provides complete solar energy solutions - from small residential systems to large commercial installations.

With Kenya's high electricity costs and unreliable grid, solar power makes excellent economic sense. Our solar systems can reduce your electricity bills by up to 80%, provide energy independence, and contribute to a cleaner environment.

WE OFFER:
- Grid-tied solar systems (reduce your KPLC bill)
- Off-grid solar systems (complete energy independence)
- Hybrid solar-generator systems
- Battery storage solutions (Lithium & Lead-acid)
- Solar water heating
- Solar pumping systems

FREE SITE ASSESSMENT: Our solar experts will analyze your energy consumption, roof space, and requirements to design the optimal system for your needs.`,

    icon: '☀️',
    heroImage: '/images/solar%20power%20farms.png',
    images: [
      '/images/solar%20power%20farms.png',
      '/images/residential-solar.png',
      '/images/solar-panels.png'
    ],

    metaTitle: 'Solar Installation Kenya | Solar Panels | Solar Companies Nairobi | EmersonEIMS',
    metaDescription: 'Solar installation in Kenya. Residential & commercial solar panels. Grid-tied, off-grid, hybrid systems. Free site assessment. Cut bills by 80%. Call +254768860665',
    keywords: [
      'solar installation Kenya',
      'solar panels Kenya',
      'solar companies Kenya',
      'solar companies Nairobi',
      'solar system price Kenya',
      'residential solar Kenya',
      'commercial solar Kenya',
      'solar battery Kenya',
      'solar inverter Kenya'
    ],

    benefits: [
      {
        title: 'Cut Bills by 80%',
        description: 'Dramatically reduce your electricity costs with solar power. Typical payback period of 3-5 years.',
        icon: '💰'
      },
      {
        title: 'Energy Independence',
        description: 'Reduce dependence on unreliable grid power. Generate your own clean electricity.',
        icon: '⚡'
      },
      {
        title: '25-Year Panel Warranty',
        description: 'Premium solar panels with long-term performance warranty for peace of mind.',
        icon: '🛡️'
      },
      {
        title: 'Free Site Assessment',
        description: 'Our experts analyze your needs and design the optimal system at no cost.',
        icon: '📋'
      },
      {
        title: 'Net Metering Ready',
        description: 'Sell excess power back to KPLC and further reduce your bills.',
        icon: '🔄'
      }
    ],

    features: [
      'Tier 1 solar panels (Jinko, JA Solar, Canadian Solar)',
      'Quality inverters (SMA, Fronius, Growatt, Victron)',
      'Lithium battery storage (Pylontech, BYD)',
      'Professional mounting systems',
      'Monitoring apps for real-time tracking',
      'KPLC net metering support',
      'Hybrid system integration',
      'Extended warranties available',
      'Financing options',
      'Maintenance packages'
    ],

    targetCustomers: [
      'Homeowners',
      'Residential estates',
      'Commercial buildings',
      'Industrial facilities',
      'Hotels and lodges',
      'Schools and universities',
      'Hospitals',
      'Agricultural operations',
      'Remote facilities',
      'Telecom towers'
    ],

    useCases: [
      'Reducing electricity bills',
      'Backup power during outages',
      'Off-grid power for remote areas',
      'Net metering income',
      'Green business certification',
      'Electric vehicle charging',
      'Agricultural irrigation'
    ],

    priceRange: 'KES 120,000 - KES 15,000,000+',
    startingPrice: 'From KES 120,000',
    pricingTiers: [
      {
        name: 'Home Starter',
        price: 'KES 120,000 - 350,000',
        description: '1.5kW - 3kW residential system',
        features: [
          'Lights, TV, fridge, small appliances',
          '4-8 solar panels',
          'Grid-tied or hybrid option',
          'Battery backup available',
          '25-year panel warranty'
        ]
      },
      {
        name: 'Home Premium',
        price: 'KES 400,000 - 1,200,000',
        description: '5kW - 10kW residential system',
        features: [
          'Full home power including AC',
          '12-25 solar panels',
          'Lithium battery storage',
          'Smart monitoring app',
          'Net metering ready'
        ],
        popular: true
      },
      {
        name: 'Commercial',
        price: 'KES 1,500,000 - 15,000,000+',
        description: '20kW - 500kW+ systems',
        features: [
          'Large-scale installations',
          'Professional project management',
          'Custom engineering',
          'Net metering implementation',
          'O&M contracts available',
          'Financing options'
        ]
      }
    ],

    faqs: [
      {
        question: 'How much can I save with solar in Kenya?',
        answer: 'Most clients save 50-80% on their electricity bills. A typical home system pays for itself in 3-5 years, then provides nearly free electricity for 20+ more years.'
      },
      {
        question: 'What size solar system do I need?',
        answer: 'This depends on your electricity consumption and goals. Bring us your recent KPLC bills, and we\'ll design a system that meets your needs. Our site assessment is FREE.'
      },
      {
        question: 'Do solar panels work during cloudy days?',
        answer: 'Yes, solar panels still generate electricity on cloudy days - typically 10-25% of their rated output. Kenya\'s generally sunny climate means excellent year-round production.'
      },
      {
        question: 'What is net metering in Kenya?',
        answer: 'Net metering allows you to export excess solar power to KPLC and receive credit on your bill. This maximizes your savings and can even earn you money if your system produces more than you use.'
      },
      {
        question: 'How long do solar panels last?',
        answer: 'Quality solar panels last 25-30+ years with minimal degradation. Most manufacturers guarantee at least 80% output after 25 years. Inverters typically last 10-15 years.'
      },
      {
        question: 'Do you offer financing for solar systems?',
        answer: 'Yes, we partner with banks and asset financiers to offer flexible payment options. Pay over 12-48 months while your solar system saves you money from day one.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Panel Warranty', value: '25 Years' },
      { label: 'Inverter Warranty', value: '10 Years' },
      { label: 'Site Assessment', value: 'Free' },
      { label: 'Financing', value: 'Available' }
    ],

    warranties: [
      '25-Year panel performance warranty',
      '10-Year inverter warranty',
      '5-Year installation warranty',
      'Battery warranties (5-10 years)'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['cummins-generators', 'ups-systems', 'borehole-pumps', 'ats-changeover'],

    primaryCTA: 'Get FREE Assessment',
    secondaryCTA: 'Calculate Savings',

    category: 'renewable'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. MOTOR REWINDING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'motor-rewinding',
    slug: 'motor-rewinding',
    name: 'Motor Rewinding & Repair',
    shortName: 'Motor Rewinding',
    tagline: 'All Motor Types | Fast Turnaround | Quality Testing',
    description: 'Professional electric motor rewinding and repair services in Kenya. All motor sizes from 0.5HP to 500HP. Single-phase, three-phase, and DC motors. Quality testing guaranteed.',
    longDescription: `Don't replace your motor - rewind it! EmersonEIMS provides professional motor rewinding and repair services that restore your motor to original performance at a fraction of replacement cost.

Our motor workshop handles all types of electric motors:
- Single-phase induction motors
- Three-phase induction motors
- DC motors
- Submersible pump motors
- Compressor motors
- Generator alternators
- Specialty motors

QUALITY ASSURANCE: Every rewound motor undergoes comprehensive testing including insulation resistance, winding resistance, no-load current test, and vibration analysis before delivery.`,

    icon: '⚙️',
    heroImage: '/images/motor-rewinding.png',
    images: [
      '/images/motor-rewinding.png',
      '/images/motor-workshop.png',
      '/images/motor-testing.png'
    ],

    metaTitle: 'Motor Rewinding Kenya | Electric Motor Repair Nairobi | EmersonEIMS',
    metaDescription: 'Professional motor rewinding in Kenya. All motor sizes 0.5HP-500HP. Single-phase, three-phase, DC motors. Fast turnaround. Quality testing. Call +254768860665',
    keywords: [
      'motor rewinding Kenya',
      'motor rewinding Nairobi',
      'electric motor repair Kenya',
      'three phase motor rewinding',
      'single phase motor repair',
      'pump motor rewinding',
      'motor winding Kenya',
      'motor repair near me'
    ],

    benefits: [
      {
        title: 'Cost Effective',
        description: 'Rewinding costs 30-50% of a new motor price while restoring original performance.',
        icon: '💰'
      },
      {
        title: 'Fast Turnaround',
        description: 'Standard motors completed in 2-5 days. Emergency service available.',
        icon: '⏱️'
      },
      {
        title: 'All Motor Types',
        description: 'We handle any motor from small single-phase to large industrial three-phase.',
        icon: '🔧'
      },
      {
        title: 'Quality Testing',
        description: 'Comprehensive testing ensures your motor performs like new.',
        icon: '✅'
      },
      {
        title: 'Warranty Included',
        description: '6-month warranty on all rewinding work.',
        icon: '🛡️'
      }
    ],

    features: [
      'Computer-aided winding design',
      'Class F and H insulation materials',
      'Vacuum Pressure Impregnation (VPI)',
      'Dynamic balancing',
      'Bearing replacement',
      'Shaft repair and machining',
      'Insulation resistance testing',
      'No-load and load testing',
      'Vibration analysis',
      'Thermal imaging'
    ],

    targetCustomers: [
      'Manufacturing plants',
      'Water companies',
      'Agricultural operations',
      'Construction companies',
      'Mining operations',
      'Food processing',
      'Hotels and commercial buildings',
      'Hospitals',
      'Pump service companies',
      'General industry'
    ],

    useCases: [
      'Burned out windings',
      'Insulation breakdown',
      'Bearing failure',
      'Shaft wear',
      'Low insulation resistance',
      'Overheating motors',
      'Poor performance',
      'Preventive reconditioning'
    ],

    priceRange: 'KES 3,000 - KES 300,000+',
    startingPrice: 'From KES 3,000',
    pricingTiers: [
      {
        name: 'Small Motors',
        price: 'KES 3,000 - 15,000',
        description: '0.5HP - 5HP motors',
        features: [
          'Single-phase or three-phase',
          'Quality rewinding',
          'New bearings if needed',
          'Testing included',
          '6-month warranty'
        ]
      },
      {
        name: 'Medium Motors',
        price: 'KES 15,000 - 60,000',
        description: '7.5HP - 50HP motors',
        features: [
          'Industrial quality materials',
          'VPI treatment',
          'Bearing replacement',
          'Full testing protocol',
          '6-month warranty'
        ],
        popular: true
      },
      {
        name: 'Large Motors',
        price: 'KES 60,000 - 300,000+',
        description: '75HP - 500HP motors',
        features: [
          'Class H insulation',
          'VPI treatment',
          'Dynamic balancing',
          'Comprehensive testing',
          'Vibration analysis',
          'Full documentation'
        ]
      }
    ],

    faqs: [
      {
        question: 'How long does motor rewinding take?',
        answer: 'Small motors (up to 10HP): 2-3 days. Medium motors (15-50HP): 3-5 days. Large motors (75HP+): 5-10 days. Emergency service available for faster turnaround.'
      },
      {
        question: 'Is rewinding as good as a new motor?',
        answer: 'When done properly, rewinding restores motor efficiency to original specifications. We use quality materials and follow best practices to ensure optimal performance.'
      },
      {
        question: 'What causes motor winding failure?',
        answer: 'Common causes include: overheating (often from overload), voltage problems, moisture ingress, age/wear, contamination, and mechanical issues affecting windings.'
      },
      {
        question: 'Do you repair submersible pump motors?',
        answer: 'Yes, we specialize in submersible motor rewinding. These require special techniques and sealing to prevent water ingress. We test all submersible motors for seal integrity.'
      },
      {
        question: 'Can you upgrade motor insulation class?',
        answer: 'Yes, we can upgrade from Class B to Class F or H insulation for higher temperature tolerance. This is recommended for motors in hot environments or with frequent starts.'
      },
      {
        question: 'Do you provide pickup and delivery?',
        answer: 'Yes, we offer motor pickup and delivery within Nairobi and surrounding areas. For upcountry clients, we can arrange courier service.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Max Motor Size', value: '500HP' },
      { label: 'Warranty', value: '6 Months' },
      { label: 'Pickup Service', value: 'Available' },
      { label: 'Turnaround', value: '3-7 Days' }
    ],

    warranties: [
      '6-Month rewinding warranty',
      'New bearings warranty',
      'Workmanship guarantee'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['borehole-pumps', 'generator-repairs', 'electrical-services', 'ac-installation'],

    primaryCTA: 'Get Repair Quote',
    secondaryCTA: 'Request Pickup',

    category: 'electrical'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. AC INSTALLATION & REPAIR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ac-installation',
    slug: 'ac-installation',
    name: 'AC Installation & Repair',
    shortName: 'AC Services',
    tagline: 'Beat the Heat | Professional HVAC Solutions',
    description: 'Professional air conditioning installation, repair, and maintenance in Kenya. Split AC, cassette, ducted systems, and VRF. All major brands serviced.',
    longDescription: `Stay cool with professional air conditioning services from EmersonEIMS. We install, repair, and maintain all types of AC systems for homes, offices, and commercial buildings.

OUR AC SERVICES:
- New AC installation (split, cassette, ducted, VRF)
- AC repair and troubleshooting
- Regular maintenance and servicing
- Gas top-up and leak repair
- AC replacement and upgrades
- Commercial HVAC solutions

We work with all major brands including Daikin, LG, Samsung, Mitsubishi, Carrier, and Midea. Our technicians are factory-trained and use proper equipment for quality installations.`,

    icon: '❄️',
    heroImage: '/images/ac-installation.png',
    images: [
      '/images/ac-installation.png',
      '/images/ac-service.png',
      '/images/commercial-hvac.png'
    ],

    metaTitle: 'AC Installation Kenya | Air Conditioning Repair Nairobi | EmersonEIMS',
    metaDescription: 'AC installation & repair in Kenya. Split AC, cassette, ducted systems. All brands serviced. Professional installation, maintenance contracts. Call +254768860665',
    keywords: [
      'AC installation Kenya',
      'air conditioning Kenya',
      'AC repair Nairobi',
      'split AC installation',
      'AC service Kenya',
      'HVAC Kenya',
      'AC maintenance Kenya',
      'commercial AC Kenya'
    ],

    benefits: [
      {
        title: 'Expert Installation',
        description: 'Proper installation ensures efficiency, longevity, and warranty validity.',
        icon: '👨‍🔧'
      },
      {
        title: 'All Brands Serviced',
        description: 'We work with Daikin, LG, Samsung, Mitsubishi, Carrier, Midea, and more.',
        icon: '🔧'
      },
      {
        title: 'Fast Response',
        description: 'Same-day service available for repairs in Nairobi area.',
        icon: '⚡'
      },
      {
        title: 'Energy Efficiency',
        description: 'We recommend and install inverter ACs for lower running costs.',
        icon: '💰'
      },
      {
        title: 'Maintenance Plans',
        description: 'Regular servicing extends AC life and maintains efficiency.',
        icon: '📋'
      }
    ],

    features: [
      'Split AC systems',
      'Cassette units',
      'Ducted systems',
      'VRF/VRV systems',
      'Window units',
      'Portable AC',
      'Cold room systems',
      'Chiller systems',
      'Air handling units',
      'Fresh air systems'
    ],

    targetCustomers: [
      'Homeowners',
      'Offices and businesses',
      'Hotels',
      'Restaurants',
      'Retail stores',
      'Hospitals and clinics',
      'Schools',
      'Data centers',
      'Industrial facilities',
      'Religious institutions'
    ],

    useCases: [
      'New AC installation',
      'AC not cooling',
      'AC making noise',
      'Water leaking from AC',
      'AC gas refill',
      'Regular maintenance',
      'AC replacement',
      'Commercial HVAC projects'
    ],

    priceRange: 'KES 3,500 - KES 500,000+',
    startingPrice: 'From KES 3,500',
    pricingTiers: [
      {
        name: 'AC Service',
        price: 'KES 3,500 - 8,000',
        description: 'Regular maintenance',
        features: [
          'Filter cleaning',
          'Coil cleaning',
          'Gas pressure check',
          'Drainage check',
          'Performance test'
        ]
      },
      {
        name: 'AC Installation',
        price: 'KES 8,000 - 25,000',
        description: 'Per unit installation',
        features: [
          'Professional mounting',
          'Copper piping (standard length)',
          'Proper drainage setup',
          'Electrical connection',
          'Test and commission'
        ],
        popular: true
      },
      {
        name: 'AC Repair',
        price: 'KES 5,000 - 35,000',
        description: 'Fault diagnosis and repair',
        features: [
          'Diagnosis fee waived if repaired',
          'Genuine spare parts',
          'Gas refill if needed',
          'Component replacement',
          'Warranty on repairs'
        ]
      },
      {
        name: 'Commercial HVAC',
        price: 'Custom Quote',
        description: 'Large-scale projects',
        features: [
          'System design',
          'Equipment supply',
          'Professional installation',
          'Commissioning',
          'Maintenance contracts'
        ]
      }
    ],

    faqs: [
      {
        question: 'How often should AC be serviced?',
        answer: 'We recommend servicing every 3-4 months for optimal performance. At minimum, service twice a year. Regular maintenance extends AC life and keeps electricity consumption low.'
      },
      {
        question: 'Why is my AC not cooling properly?',
        answer: 'Common causes include: dirty filters, low gas, dirty coils, faulty compressor, or incorrect sizing. Our technicians can diagnose and fix the issue quickly.'
      },
      {
        question: 'How long does AC installation take?',
        answer: 'Standard split AC installation takes 2-4 hours. Multiple units or complex installations may take a full day. We work efficiently to minimize disruption.'
      },
      {
        question: 'Should I choose inverter or non-inverter AC?',
        answer: 'Inverter ACs cost more initially but save 30-50% on electricity. For frequently used ACs, inverter models pay back the extra cost within 2-3 years. We recommend inverter for most applications.'
      },
      {
        question: 'What size AC do I need for my room?',
        answer: 'General guide: 9000 BTU for up to 15 sqm, 12000 BTU for 15-20 sqm, 18000 BTU for 20-30 sqm, 24000 BTU for 30-40 sqm. Factors like sun exposure and occupancy also matter.'
      },
      {
        question: 'Do you offer AC maintenance contracts?',
        answer: 'Yes, our maintenance contracts include 3-4 service visits per year, priority response, and discounted repairs. This keeps your AC running efficiently and catches problems early.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Response Time', value: 'Same Day' },
      { label: 'All Major Brands', value: 'Serviced' },
      { label: 'Installation', value: 'Professional' },
      { label: 'Maintenance Plans', value: 'Available' }
    ],

    warranties: [
      'Installation workmanship warranty',
      'Repair warranty',
      'Parts warranty'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['electrical-services', 'distribution-boards', 'motor-rewinding'],

    primaryCTA: 'Book Service',
    secondaryCTA: 'Get Installation Quote',

    category: 'hvac'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. UPS SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ups-systems',
    slug: 'ups-systems',
    name: 'UPS Systems',
    shortName: 'UPS Systems',
    tagline: 'Protect Critical Equipment | Zero Downtime',
    description: 'UPS systems sales, installation, and maintenance in Kenya. Line-interactive, online, and modular UPS. Battery replacement. All capacities from 600VA to 500kVA.',
    longDescription: `Protect your critical equipment from power problems with Uninterruptible Power Supply (UPS) systems from EmersonEIMS.

Power fluctuations, surges, and outages can damage sensitive equipment and cause data loss. A quality UPS provides:
- Clean, conditioned power to equipment
- Battery backup during outages
- Protection against surges and spikes
- Time to safely shutdown or switch to generator

WE PROVIDE:
- UPS sales and installation
- UPS repair and maintenance
- Battery replacement
- UPS monitoring solutions
- Capacity upgrades`,

    icon: '🔋',
    heroImage: '/images/ups-system.png',
    images: [
      '/images/ups-system.png',
      '/images/ups-installation.png',
      '/images/ups-batteries.png'
    ],

    metaTitle: 'UPS Systems Kenya | UPS Installation Nairobi | Battery Backup | EmersonEIMS',
    metaDescription: 'UPS systems in Kenya. Sales, installation, maintenance. APC, Eaton, Vertiv. 600VA to 500kVA. Battery replacement. Protect critical equipment. Call +254768860665',
    keywords: [
      'UPS Kenya',
      'UPS systems Nairobi',
      'APC UPS Kenya',
      'Eaton UPS Kenya',
      'UPS installation Kenya',
      'UPS battery replacement',
      'online UPS Kenya',
      'data center UPS Kenya'
    ],

    benefits: [
      {
        title: 'Equipment Protection',
        description: 'Shield sensitive electronics from power surges, spikes, and fluctuations.',
        icon: '🛡️'
      },
      {
        title: 'Zero Downtime',
        description: 'Seamless switch to battery during outages - no interruption to operations.',
        icon: '⚡'
      },
      {
        title: 'Data Safety',
        description: 'Protect against data loss and corruption from unexpected shutdowns.',
        icon: '💾'
      },
      {
        title: 'Leading Brands',
        description: 'We supply APC, Eaton, Vertiv (Emerson), Riello, and other quality brands.',
        icon: '✅'
      },
      {
        title: 'Complete Service',
        description: 'From sizing and installation to maintenance and battery replacement.',
        icon: '🔧'
      }
    ],

    features: [
      'Line-interactive UPS',
      'Online double-conversion UPS',
      'Modular scalable UPS',
      'Lithium-ion battery options',
      'Remote monitoring',
      'SNMP network cards',
      'Extended battery cabinets',
      'Automatic bypass',
      'Power management software',
      'Maintenance bypass'
    ],

    targetCustomers: [
      'Data centers',
      'IT companies',
      'Banks and financial institutions',
      'Hospitals',
      'Telecommunications',
      'Manufacturing',
      'Office buildings',
      'Retail (POS systems)',
      'Schools and universities',
      'Government offices'
    ],

    useCases: [
      'Server and network protection',
      'Computer workstation backup',
      'Medical equipment protection',
      'POS system backup',
      'Telecom equipment',
      'Industrial control systems',
      'Security systems',
      'Emergency lighting'
    ],

    priceRange: 'KES 8,000 - KES 5,000,000+',
    startingPrice: 'From KES 8,000',
    pricingTiers: [
      {
        name: 'Desktop UPS',
        price: 'KES 8,000 - 35,000',
        description: '600VA - 3kVA',
        features: [
          'Single computer or small workstation',
          'Line-interactive technology',
          'AVR included',
          '5-15 minutes backup',
          '2-year warranty'
        ]
      },
      {
        name: 'Office/Server UPS',
        price: 'KES 50,000 - 350,000',
        description: '3kVA - 20kVA',
        features: [
          'Server rooms and network equipment',
          'Online double-conversion',
          'Extended runtime options',
          'Network management',
          'Hot-swappable batteries'
        ],
        popular: true
      },
      {
        name: 'Data Center UPS',
        price: 'KES 500,000 - 5,000,000+',
        description: '30kVA - 500kVA',
        features: [
          'Critical facility grade',
          'Modular scalable design',
          'N+1 redundancy options',
          'Remote monitoring',
          'Professional installation',
          'Maintenance contracts'
        ]
      }
    ],

    faqs: [
      {
        question: 'How do I size a UPS for my needs?',
        answer: 'Add up the wattage of all equipment to be protected, then add 20-30% headroom. For example, if your equipment totals 2000W, choose at least a 2500W (3kVA) UPS. We offer free sizing assessments.'
      },
      {
        question: 'What is the difference between line-interactive and online UPS?',
        answer: 'Line-interactive UPS provides basic protection and is suitable for less critical loads. Online double-conversion UPS provides the highest protection with zero transfer time - essential for servers and sensitive equipment.'
      },
      {
        question: 'How long do UPS batteries last?',
        answer: 'Typical UPS batteries last 3-5 years depending on usage and environmental conditions. We recommend proactive replacement before failure. We offer battery testing and replacement services.'
      },
      {
        question: 'Can you replace batteries in my existing UPS?',
        answer: 'Yes, we replace batteries in all major UPS brands. We use quality replacement batteries and test the UPS after installation. Battery replacement typically takes 1-2 hours.'
      },
      {
        question: 'Do you offer UPS maintenance contracts?',
        answer: 'Yes, our UPS maintenance contracts include regular inspections, battery testing, firmware updates, and priority response for issues. This extends equipment life and ensures reliability.'
      },
      {
        question: 'What brands of UPS do you supply?',
        answer: 'We supply APC (Schneider), Eaton, Vertiv (formerly Emerson), Riello, and other quality brands. We can recommend the best option based on your requirements and budget.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Capacity Range', value: '600VA-500kVA' },
      { label: 'Warranty', value: '2-5 Years' },
      { label: 'Battery Service', value: 'Available' },
      { label: 'Installation', value: 'Professional' }
    ],

    warranties: [
      'Manufacturer warranty (2-5 years)',
      'Installation warranty',
      'Battery warranty'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['distribution-boards', 'cummins-generators', 'ats-changeover', 'electrical-services'],

    primaryCTA: 'Get UPS Quote',
    secondaryCTA: 'Battery Replacement',

    category: 'power'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. BOREHOLE PUMPS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'borehole-pumps',
    slug: 'borehole-pumps',
    name: 'Borehole Pump Services',
    shortName: 'Borehole Pumps',
    tagline: 'Reliable Water Supply | Solar Pump Options',
    description: 'Borehole pump installation, repair, and maintenance in Kenya. Submersible pumps, solar-powered pumps. Pump replacement and borehole rehabilitation.',
    longDescription: `Ensure reliable water supply with professional borehole pump services from EmersonEIMS. We install, repair, and maintain all types of borehole pumping systems.

OUR BOREHOLE SERVICES:
- Submersible pump installation
- Pump replacement and upgrades
- Solar-powered pump systems
- Pump motor rewinding
- Control panel installation
- Borehole rehabilitation
- Water yield testing

We work with leading pump brands including Grundfos, Pedrollo, DAB, Calpeda, and Franklin. Our technicians understand the unique challenges of borehole systems and deliver reliable solutions.`,

    icon: '💧',
    heroImage: '/images/borehole-pump.png',
    images: [
      '/images/borehole-pump.png',
      '/images/solar-pump.png',
      '/images/pump-installation.png'
    ],

    metaTitle: 'Borehole Pump Kenya | Pump Installation & Repair Nairobi | EmersonEIMS',
    metaDescription: 'Borehole pump services in Kenya. Submersible pump installation, repair, solar pumps. Grundfos, Pedrollo, DAB. Professional service. Call +254768860665',
    keywords: [
      'borehole pump Kenya',
      'submersible pump Kenya',
      'borehole pump installation Nairobi',
      'solar borehole pump Kenya',
      'borehole pump repair',
      'Grundfos pump Kenya',
      'borehole rehabilitation Kenya',
      'water pump Kenya'
    ],

    benefits: [
      {
        title: 'Expert Installation',
        description: 'Proper pump sizing and installation for optimal water delivery and long pump life.',
        icon: '👨‍🔧'
      },
      {
        title: 'Solar Pump Options',
        description: 'Reduce running costs with solar-powered borehole pumps - zero electricity bills.',
        icon: '☀️'
      },
      {
        title: 'Quality Pumps',
        description: 'We supply Grundfos, Pedrollo, DAB, Franklin - pumps designed for longevity.',
        icon: '✅'
      },
      {
        title: 'Fast Repairs',
        description: 'Quick response to pump failures - we understand water supply is critical.',
        icon: '⚡'
      },
      {
        title: 'Complete Solutions',
        description: 'From pump to tank to distribution - we handle the entire water system.',
        icon: '🔧'
      }
    ],

    features: [
      'Submersible pump installation',
      'Surface pump systems',
      'Solar pump systems',
      'Pump motor rewinding',
      'Control panel setup',
      'Pressure tank systems',
      'Level sensor installation',
      'VFD for variable flow',
      'Borehole cleaning',
      'Yield testing'
    ],

    targetCustomers: [
      'Residential homes',
      'Residential estates',
      'Farms and agricultural operations',
      'Hotels and lodges',
      'Schools and institutions',
      'Commercial buildings',
      'Industrial facilities',
      'Water companies',
      'Remote camps',
      'Churches and community centers'
    ],

    useCases: [
      'New borehole commissioning',
      'Pump replacement',
      'Pump not working',
      'Low water pressure',
      'Solar pump installation',
      'Borehole rehabilitation',
      'Control system upgrade',
      'Energy cost reduction'
    ],

    priceRange: 'KES 35,000 - KES 1,500,000+',
    startingPrice: 'From KES 35,000',
    pricingTiers: [
      {
        name: 'Pump Repair',
        price: 'KES 15,000 - 50,000',
        description: 'Repair existing pump',
        features: [
          'Pump pull-out and inspection',
          'Motor rewinding if needed',
          'Bearing replacement',
          'Seal replacement',
          'Test and reinstall'
        ]
      },
      {
        name: 'New Pump Installation',
        price: 'KES 85,000 - 350,000',
        description: 'New electric pump system',
        features: [
          'Quality submersible pump',
          'Rising main pipes',
          'Control panel',
          'Pressure switch setup',
          'Professional installation',
          '1-year warranty'
        ],
        popular: true
      },
      {
        name: 'Solar Pump System',
        price: 'KES 250,000 - 1,500,000+',
        description: 'Complete solar pumping',
        features: [
          'Solar panels',
          'Solar pump controller',
          'Quality submersible pump',
          'Complete installation',
          'No electricity costs',
          'Low maintenance'
        ]
      }
    ],

    faqs: [
      {
        question: 'How deep can a submersible pump work?',
        answer: 'Submersible pumps can work at depths of 300+ meters depending on the pump model. We select pumps based on your borehole depth, water level, and required flow rate.'
      },
      {
        question: 'What causes borehole pumps to fail?',
        answer: 'Common causes include: running dry (no water), sand/silt in water, power fluctuations, age/wear, and inadequate pump sizing. Proper installation and protection minimizes failures.'
      },
      {
        question: 'Are solar borehole pumps reliable?',
        answer: 'Yes, modern solar pumps are very reliable and can pump significant volumes. They work during daylight hours, pumping water to a storage tank for 24/7 availability. Running costs are essentially zero.'
      },
      {
        question: 'How do I know if my pump needs replacement?',
        answer: 'Signs include: reduced water output, increased power consumption, frequent tripping, running but no water, strange noises from wellhead. We can test your pump to diagnose the issue.'
      },
      {
        question: 'Can you rehabilitate a low-yield borehole?',
        answer: 'Often yes. Boreholes can become clogged with scale or silt over time. We offer borehole cleaning and rehabilitation services that can restore water yield in many cases.'
      },
      {
        question: 'What pump brands do you recommend?',
        answer: 'We primarily install Grundfos, Pedrollo, DAB, and Franklin pumps. These European brands offer excellent reliability and have good parts availability in Kenya.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Max Depth', value: '300m' },
      { label: 'Warranty', value: '1-2 Years' },
      { label: 'Solar Option', value: 'Available' },
      { label: 'Site Survey', value: 'Free' }
    ],

    warranties: [
      'Pump manufacturer warranty',
      'Installation warranty',
      'Motor rewinding warranty'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['solar-energy', 'motor-rewinding', 'distribution-boards', 'electrical-services'],

    primaryCTA: 'Request Site Visit',
    secondaryCTA: 'Solar Pump Quote',

    category: 'water'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. HOSPITAL INCINERATORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hospital-incinerators',
    slug: 'hospital-incinerators',
    name: 'Hospital Incinerators',
    shortName: 'Incinerators',
    tagline: 'Safe Medical Waste Disposal | NEMA Compliant',
    description: 'Hospital and medical waste incinerator installation and maintenance in Kenya. NEMA compliant systems. Safe disposal of infectious and hazardous waste.',
    longDescription: `Ensure safe, compliant disposal of medical waste with professional incinerator solutions from EmersonEIMS. We design, install, and maintain incinerator systems that meet Kenya's environmental regulations.

Medical waste requires specialized handling and destruction to prevent disease spread and environmental contamination. Our incinerators provide complete destruction of:
- Infectious waste
- Sharps (needles, blades)
- Pathological waste
- Pharmaceutical waste
- Cytotoxic waste

WE PROVIDE:
- Incinerator supply and installation
- Commissioning and training
- Regular maintenance
- Emission compliance support
- Capacity upgrades`,

    icon: '🔥',
    heroImage: '/images/incinerator.png',
    images: [
      '/images/incinerator.png',
      '/images/medical-waste.png',
      '/images/incinerator-installation.png'
    ],

    metaTitle: 'Hospital Incinerators Kenya | Medical Waste Incinerator | NEMA Compliant | EmersonEIMS',
    metaDescription: 'Hospital incinerators in Kenya. Medical waste disposal systems. NEMA compliant. Installation, maintenance, compliance support. Professional service. Call +254768860665',
    keywords: [
      'hospital incinerator Kenya',
      'medical waste incinerator Kenya',
      'incinerator installation Kenya',
      'NEMA compliant incinerator',
      'healthcare waste disposal Kenya',
      'infectious waste incinerator',
      'incinerator maintenance Kenya'
    ],

    benefits: [
      {
        title: 'NEMA Compliant',
        description: 'Systems designed to meet Kenya environmental regulations and emission standards.',
        icon: '📋'
      },
      {
        title: 'Complete Destruction',
        description: 'High-temperature combustion ensures complete destruction of pathogens and waste.',
        icon: '🔥'
      },
      {
        title: 'Staff Safety',
        description: 'Proper waste disposal protects healthcare workers and the community.',
        icon: '🛡️'
      },
      {
        title: 'Reliable Operation',
        description: 'Quality construction and professional maintenance ensure dependable service.',
        icon: '✅'
      },
      {
        title: 'Compliance Support',
        description: 'We help with NEMA licensing, monitoring, and reporting requirements.',
        icon: '📝'
      }
    ],

    features: [
      'Dual-chamber design for complete combustion',
      'High-temperature primary and secondary chambers',
      'Automatic fuel burner system',
      'Temperature monitoring and control',
      'Emission control systems',
      'Ash removal system',
      'Waste loading systems',
      'Safety interlocks',
      'Digital control panel',
      'Maintenance access points'
    ],

    targetCustomers: [
      'Hospitals',
      'Clinics and health centers',
      'Laboratories',
      'Veterinary facilities',
      'Pharmaceutical companies',
      'Research institutions',
      'Mortuaries',
      'Quarantine facilities',
      'Blood banks',
      'Dental clinics'
    ],

    useCases: [
      'Infectious waste destruction',
      'Sharps disposal',
      'Pharmaceutical waste disposal',
      'Pathological waste disposal',
      'Expired medicine destruction',
      'Confidential document destruction',
      'Animal carcass disposal'
    ],

    priceRange: 'KES 800,000 - KES 8,000,000+',
    startingPrice: 'From KES 800,000',
    pricingTiers: [
      {
        name: 'Small Capacity',
        price: 'KES 800,000 - 1,500,000',
        description: '20-50 kg/hour',
        features: [
          'Clinics and small hospitals',
          'Dual-chamber design',
          'Diesel/gas burner',
          'Temperature control',
          'Installation included'
        ]
      },
      {
        name: 'Medium Capacity',
        price: 'KES 1,500,000 - 3,500,000',
        description: '50-100 kg/hour',
        features: [
          'Medium hospitals',
          'Enhanced emission control',
          'Automatic operation',
          'Digital monitoring',
          'NEMA compliance support'
        ],
        popular: true
      },
      {
        name: 'Large Capacity',
        price: 'KES 3,500,000 - 8,000,000+',
        description: '100-300+ kg/hour',
        features: [
          'Large hospitals, waste management',
          'Advanced emission treatment',
          'Continuous monitoring',
          'Remote diagnostics',
          'Full compliance package'
        ]
      }
    ],

    faqs: [
      {
        question: 'What NEMA requirements apply to medical incinerators?',
        answer: 'NEMA requires environmental impact assessment, proper siting, emission controls, temperature monitoring, and regular reporting. Our systems are designed for compliance and we assist with the licensing process.'
      },
      {
        question: 'What temperature do medical incinerators operate at?',
        answer: 'Primary chamber operates at 800-900°C, secondary chamber at 1000-1200°C. These temperatures ensure complete destruction of pathogens and organic matter.'
      },
      {
        question: 'How much waste can an incinerator process?',
        answer: 'Capacity ranges from 20 kg/hour for small units to 300+ kg/hour for large systems. We size the incinerator based on your waste generation rate and operating schedule.'
      },
      {
        question: 'What maintenance is required?',
        answer: 'Regular maintenance includes: burner service, refractory inspection, control calibration, ash removal system service, and emission system checks. We offer maintenance contracts for hassle-free operation.'
      },
      {
        question: 'How do you handle incinerator emissions?',
        answer: 'Modern incinerators include emission control systems such as afterburners, scrubbers, and filters. We design systems to meet NEMA emission limits for particulates, CO, and other pollutants.'
      },
      {
        question: 'Do you provide operator training?',
        answer: 'Yes, comprehensive operator training is included with every installation. We train staff on safe operation, waste loading, temperature monitoring, and basic maintenance.'
      }
    ],

    // Real customer testimonials will be added here
    testimonials: [],

    stats: [
      { label: 'Capacity Range', value: '20-300 kg/hr' },
      { label: 'Operating Temp', value: '800-1200°C' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'Training', value: 'Included' }
    ],

    warranties: [
      '1-Year manufacturer warranty',
      'Installation warranty',
      'Refractory warranty'
    ],

    // Certifications will be added when officially obtained
    certifications: [],

    relatedServices: ['generator-repairs', 'distribution-boards', 'electrical-services'],

    primaryCTA: 'Request Consultation',
    secondaryCTA: 'Compliance Assessment',

    category: 'waste'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getServiceBySlug(slug: string): Service | undefined {
  return ALL_SERVICES.find(service => service.slug === slug);
}

export function getServiceById(id: string): Service | undefined {
  return ALL_SERVICES.find(service => service.id === id);
}

export function getServicesByCategory(category: Service['category']): Service[] {
  return ALL_SERVICES.filter(service => service.category === category);
}

export function getRelatedServices(serviceSlug: string): Service[] {
  const service = getServiceBySlug(serviceSlug);
  if (!service) return [];
  return service.relatedServices
    .map(slug => getServiceBySlug(slug))
    .filter((s): s is Service => s !== undefined);
}

export function getAllServiceSlugs(): string[] {
  return ALL_SERVICES.map(service => service.slug);
}

// Categories for navigation
export const SERVICE_CATEGORIES = [
  { id: 'power', name: 'Power Generation', icon: '⚡' },
  { id: 'renewable', name: 'Renewable Energy', icon: '☀️' },
  { id: 'electrical', name: 'Electrical Services', icon: '🔌' },
  { id: 'hvac', name: 'HVAC', icon: '❄️' },
  { id: 'water', name: 'Water Systems', icon: '💧' },
  { id: 'waste', name: 'Waste Management', icon: '🔥' },
] as const;

// Trust badges for display - only verifiable claims
export const TRUST_BADGES = [
  { title: '3-Year Warranty', description: 'Generator warranty available', icon: '🛡️' },
  { title: '24/7 Support', description: 'Round-the-clock emergency service', icon: '📞' },
  { title: 'Nationwide Service', description: 'Serving all of Kenya', icon: '🇰🇪' },
  { title: 'Free Consultation', description: 'No obligation site assessment', icon: '💬' },
];
