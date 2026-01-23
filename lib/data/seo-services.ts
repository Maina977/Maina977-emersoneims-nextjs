/**
 * SEO SERVICES CONFIGURATION
 * 15 Service definitions for location-based SEO pages
 * Each service generates pages like "Generator Companies in [location]"
 */

export interface SEOService {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  keywords: string[];
  description: string;
  icon: string;
  metaTemplate: {
    title: string;
    description: string;
    h1: string;
  };
  features: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const SEO_SERVICES: SEOService[] = [
  {
    id: 'generator-companies',
    slug: 'generator-companies',
    name: 'Generator Companies',
    shortName: 'Generator Companies',
    keywords: ['generator companies', 'generator dealers', 'generator suppliers', 'generator shop', 'generator store', 'genset suppliers'],
    description: 'Top rated generator companies and dealers',
    icon: 'Building2',
    metaTemplate: {
      title: 'Generator Companies in {location} | Best Generator Dealers Kenya',
      description: 'Find the best generator companies in {location}. Professional diesel generator suppliers, installation & maintenance. 24/7 service. Call +254768860665',
      h1: 'Generator Companies in {location}'
    },
    features: [
      'Certified generator dealers',
      'New and used generators',
      'Installation services',
      'Maintenance contracts',
      'Genuine spare parts',
      '24/7 emergency support'
    ],
    faqs: [
      {
        question: 'What brands of generators do you supply in {location}?',
        answer: 'We supply all major brands including Cummins, Perkins, Caterpillar, FG Wilson, John Deere, Volvo Penta, and more in {location}.'
      },
      {
        question: 'Do you offer installation services in {location}?',
        answer: 'Yes, we provide complete installation services including electrical connections, fuel systems, and commissioning in {location}.'
      },
      {
        question: 'What warranty do you offer on generators?',
        answer: 'We offer manufacturer warranties ranging from 1-3 years depending on the brand, plus extended warranty options.'
      }
    ]
  },
  {
    id: 'generators',
    slug: 'generators',
    name: 'Generators',
    shortName: 'Generators',
    keywords: ['generators', 'diesel generators', 'power generators', 'gensets', 'backup generators', 'standby generators', 'industrial generators'],
    description: 'Premium generators for sale',
    icon: 'Zap',
    metaTemplate: {
      title: 'Generators in {location} | Buy Diesel Generators Kenya',
      description: 'Premium generators in {location}. 10kVA to 2000kVA diesel generators. Cummins, Perkins, CAT. Installation & warranty. Call +254768860665',
      h1: 'Generators in {location}'
    },
    features: [
      '10kVA to 2000kVA range',
      'Silent and open type',
      'Automatic transfer switch',
      'Fuel efficient models',
      'Mobile generators',
      'Custom configurations'
    ],
    faqs: [
      {
        question: 'What size generator do I need in {location}?',
        answer: 'Generator size depends on your power needs. Contact us for a free site survey and load analysis in {location}.'
      },
      {
        question: 'Are your generators fuel efficient?',
        answer: 'Yes, all our generators feature modern fuel-efficient engines with low fuel consumption rates.'
      },
      {
        question: 'Do you have generators in stock in {location}?',
        answer: 'We maintain stock of popular generator sizes. For specific requirements, lead time is typically 2-4 weeks.'
      }
    ]
  },
  {
    id: 'generator-repairs',
    slug: 'generator-repairs',
    name: 'Generator Repairs',
    shortName: 'Repairs',
    keywords: ['generator repairs', 'generator servicing', 'generator fix', 'genset repair', 'generator mechanic', 'generator technician'],
    description: 'Professional generator repair services',
    icon: 'Wrench',
    metaTemplate: {
      title: 'Generator Repairs in {location} | 24/7 Emergency Service',
      description: 'Professional generator repairs in {location}. Expert technicians, fast response. All brands serviced. 24/7 emergency. Call +254768860665',
      h1: 'Generator Repairs in {location}'
    },
    features: [
      '24/7 emergency repairs',
      'All brands serviced',
      'On-site repairs',
      'Engine rebuilds',
      'Electrical repairs',
      'Controller repairs'
    ],
    faqs: [
      {
        question: 'How quickly can you respond to emergencies in {location}?',
        answer: 'We offer 24/7 emergency response with typical arrival within 2-4 hours in {location}.'
      },
      {
        question: 'Do you repair all generator brands?',
        answer: 'Yes, our technicians are trained to repair Cummins, Perkins, CAT, FG Wilson, and all other major brands.'
      },
      {
        question: 'What is included in a typical repair service?',
        answer: 'Diagnosis, repair, testing, and a detailed report. We use genuine parts and provide a repair warranty.'
      }
    ]
  },
  {
    id: 'generator-lease',
    slug: 'generator-lease',
    name: 'Generator Lease',
    shortName: 'Lease/Rental',
    keywords: ['generator lease', 'generator rental', 'generator hire', 'rent generator', 'generator for hire', 'temporary power'],
    description: 'Flexible generator lease and rental options',
    icon: 'Calendar',
    metaTemplate: {
      title: 'Generator Lease & Rental in {location} | Flexible Terms',
      description: 'Generator lease and rental services in {location}. Daily, weekly, monthly options. 10kVA to 1000kVA. Call +254768860665',
      h1: 'Generator Lease in {location}'
    },
    features: [
      'Daily, weekly, monthly terms',
      'Delivery and installation',
      'Fuel management',
      'Operator available',
      '24/7 support included',
      'No long-term commitment'
    ],
    faqs: [
      {
        question: 'What are your rental rates in {location}?',
        answer: 'Rental rates vary by generator size and duration. Contact us for a customized quote for your needs in {location}.'
      },
      {
        question: 'Is delivery included in the rental price?',
        answer: 'Delivery within {location} may be included depending on distance. We provide full logistics support.'
      },
      {
        question: 'Can I rent a generator for events?',
        answer: 'Yes, we specialize in event power solutions including weddings, concerts, and corporate events.'
      }
    ]
  },
  {
    id: 'generator-maintenance',
    slug: 'generator-maintenance',
    name: 'Generator Maintenance',
    shortName: 'Maintenance',
    keywords: ['generator maintenance', 'generator servicing', 'preventive maintenance', 'generator AMC', 'generator service contract'],
    description: 'Preventive maintenance and service plans',
    icon: 'Settings',
    metaTemplate: {
      title: 'Generator Maintenance in {location} | Preventive Service Plans',
      description: 'Professional generator maintenance in {location}. Scheduled servicing, oil changes, filter replacement. AMC contracts. Call +254768860665',
      h1: 'Generator Maintenance in {location}'
    },
    features: [
      'Scheduled maintenance plans',
      'Oil and filter changes',
      'Belt and hose inspection',
      'Battery testing',
      'Load bank testing',
      'Detailed service reports'
    ],
    faqs: [
      {
        question: 'How often should generators be serviced in {location}?',
        answer: 'We recommend servicing every 250-500 running hours or every 6 months, whichever comes first.'
      },
      {
        question: 'Do you offer Annual Maintenance Contracts?',
        answer: 'Yes, our AMC packages include scheduled visits, priority response, and discounted parts in {location}.'
      },
      {
        question: 'What is included in a maintenance visit?',
        answer: 'Oil change, filter replacement, belt inspection, battery check, coolant level, and operational testing.'
      }
    ]
  },
  {
    id: 'generator-spare-parts',
    slug: 'generator-spare-parts',
    name: 'Generator Spare Parts',
    shortName: 'Spare Parts',
    keywords: ['generator spare parts', 'generator spares', 'generator parts', 'genset parts', 'generator filters', 'generator batteries'],
    description: 'Genuine generator spare parts',
    icon: 'Package',
    metaTemplate: {
      title: 'Generator Spare Parts in {location} | Genuine Parts Kenya',
      description: 'Genuine generator spare parts in {location}. Filters, belts, batteries, injectors. Cummins, Perkins, CAT parts. Call +254768860665',
      h1: 'Generator Spare Parts in {location}'
    },
    features: [
      'Genuine OEM parts',
      'Filters (oil, fuel, air)',
      'Batteries and cables',
      'Belts and hoses',
      'Injectors and pumps',
      'Sensors and switches'
    ],
    faqs: [
      {
        question: 'Do you stock genuine parts in {location}?',
        answer: 'Yes, we maintain stock of genuine Cummins, Perkins, and other OEM parts. Non-stock items can be ordered.'
      },
      {
        question: 'How quickly can you deliver parts?',
        answer: 'Stock items ship same-day in {location}. Special orders typically arrive within 1-2 weeks.'
      },
      {
        question: 'Do you offer warranty on spare parts?',
        answer: 'Yes, all genuine parts come with manufacturer warranty. We also stock quality aftermarket alternatives.'
      }
    ]
  },
  {
    id: 'generator-overhauls',
    slug: 'generator-overhauls',
    name: 'Generator Overhauls',
    shortName: 'Overhauls',
    keywords: ['generator overhaul', 'engine overhaul', 'generator rebuild', 'major overhaul', 'engine rebuild', 'generator reconditioning'],
    description: 'Complete generator engine overhauls',
    icon: 'RefreshCw',
    metaTemplate: {
      title: 'Generator Engine Overhauls in {location} | Complete Rebuild',
      description: 'Professional generator engine overhauls in {location}. Complete rebuild services. Extend generator life. Call +254768860665',
      h1: 'Generator Overhauls in {location}'
    },
    features: [
      'Complete engine teardown',
      'Cylinder reboring',
      'Crankshaft grinding',
      'New bearings and seals',
      'Injector overhaul',
      'Turbocharger rebuild'
    ],
    faqs: [
      {
        question: 'When does a generator need an overhaul?',
        answer: 'Typically after 15,000-20,000 running hours, or when showing signs of low power, excessive smoke, or high oil consumption.'
      },
      {
        question: 'How long does an overhaul take?',
        answer: 'A complete overhaul typically takes 2-4 weeks depending on parts availability and generator size.'
      },
      {
        question: 'Is overhauling cheaper than buying new?',
        answer: 'Yes, overhauling is typically 40-60% cheaper than a new generator and extends life by another 15,000+ hours.'
      }
    ]
  },
  {
    id: 'diesel-generators',
    slug: 'diesel-generators',
    name: 'Diesel Generator Companies',
    shortName: 'Diesel Generators',
    keywords: ['diesel generator', 'diesel genset', 'diesel power', 'diesel backup', 'industrial diesel generator'],
    description: 'Industrial diesel generator solutions',
    icon: 'Fuel',
    metaTemplate: {
      title: 'Diesel Generator Companies in {location} | Industrial Generators',
      description: 'Leading diesel generator companies in {location}. Industrial & commercial generators. Installation & support. Call +254768860665',
      h1: 'Diesel Generator Companies in {location}'
    },
    features: [
      'Industrial grade generators',
      'High efficiency engines',
      'Low fuel consumption',
      'Extended run capability',
      'Heavy duty construction',
      'Multiple fuel options'
    ],
    faqs: [
      {
        question: 'Why choose diesel generators?',
        answer: 'Diesel generators offer superior fuel efficiency, longer lifespan, lower maintenance costs, and better performance under load.'
      },
      {
        question: 'What sizes are available?',
        answer: 'We supply diesel generators from 10kVA for small businesses to 2000kVA+ for industrial applications.'
      },
      {
        question: 'Are diesel generators noisy?',
        answer: 'Modern diesel generators feature soundproof canopies with noise levels as low as 65dB at 7 meters.'
      }
    ]
  },
  {
    id: 'generator-control',
    slug: 'generator-control',
    name: 'Generator Control',
    shortName: 'Controls',
    keywords: ['generator control', 'generator controller', 'DeepSea', 'PowerWizard', 'ComAp', 'ATS panel', 'AMF controller'],
    description: 'Generator control systems and programming',
    icon: 'Cpu',
    metaTemplate: {
      title: 'Generator Control Systems in {location} | DeepSea & PowerWizard',
      description: 'Generator control systems in {location}. DeepSea, PowerWizard controllers. Programming & repairs. Call +254768860665',
      h1: 'Generator Control in {location}'
    },
    features: [
      'DeepSea controllers',
      'PowerWizard systems',
      'ComAp modules',
      'ATS panels',
      'Remote monitoring',
      'Custom programming'
    ],
    faqs: [
      {
        question: 'Can you program generator controllers in {location}?',
        answer: 'Yes, we provide complete controller programming services for DeepSea, PowerWizard, ComAp, and other brands.'
      },
      {
        question: 'Do you repair faulty controllers?',
        answer: 'Yes, we diagnose and repair controller faults, or replace with new units if repair is not economical.'
      },
      {
        question: 'Can you upgrade my generator controller?',
        answer: 'Yes, we can upgrade older controllers to modern units with features like remote monitoring and SMS alerts.'
      }
    ]
  },
  {
    id: 'generator-troubleshooting',
    slug: 'generator-not-starting',
    name: 'Generator Not Starting',
    shortName: 'Troubleshooting',
    keywords: ['generator not starting', 'generator troubleshooting', 'generator problems', 'generator wont start', 'generator fault', 'generator error'],
    description: 'Emergency generator troubleshooting',
    icon: 'AlertTriangle',
    metaTemplate: {
      title: 'Generator Not Starting in {location}? | Emergency Repair Service',
      description: 'Generator not starting in {location}? 24/7 emergency troubleshooting. Expert diagnosis & fast repairs. Call +254768860665',
      h1: 'Generator Not Starting in {location}'
    },
    features: [
      '24/7 emergency response',
      'Expert fault diagnosis',
      'Error code reading',
      'Electrical testing',
      'Fuel system checks',
      'Battery testing'
    ],
    faqs: [
      {
        question: 'Why won\'t my generator start?',
        answer: 'Common causes include dead battery, fuel issues, faulty starter motor, control panel faults, or safety switch problems.'
      },
      {
        question: 'How quickly can you respond in {location}?',
        answer: 'We offer 24/7 emergency response with typical arrival within 2-4 hours in {location}.'
      },
      {
        question: 'How much does troubleshooting cost?',
        answer: 'We charge a diagnostic fee which is waived if you proceed with repairs. Contact us for current rates.'
      }
    ]
  },
  {
    id: 'diagnostics',
    slug: 'generator-diagnostics',
    name: 'Generator Diagnostics',
    shortName: 'Diagnostics',
    keywords: ['generator diagnostics', 'fault diagnosis', 'error codes', 'generator testing', 'load bank test', 'performance analysis'],
    description: 'Comprehensive generator diagnostics',
    icon: 'Search',
    metaTemplate: {
      title: 'Generator Diagnostics in {location} | Fault Code Analysis',
      description: 'Professional generator diagnostics in {location}. Fault code reading, performance analysis. All brands. Call +254768860665',
      h1: 'Generator Diagnostics in {location}'
    },
    features: [
      'Computerized diagnostics',
      'Error code analysis',
      'Load bank testing',
      'Fuel consumption test',
      'Emission testing',
      'Performance reports'
    ],
    faqs: [
      {
        question: 'What diagnostic equipment do you use?',
        answer: 'We use factory diagnostic tools for Cummins, Perkins, CAT, and universal diagnostic scanners for all brands.'
      },
      {
        question: 'What does a diagnostic service include?',
        answer: 'Complete system scan, error code reading, performance testing, visual inspection, and detailed report with recommendations.'
      },
      {
        question: 'Can you read fault codes remotely?',
        answer: 'For generators with remote monitoring, we can read codes remotely. On-site visits are needed for detailed diagnosis.'
      }
    ]
  },
  {
    id: 'solar',
    slug: 'solar-installation',
    name: 'Solar Installation',
    shortName: 'Solar',
    keywords: ['solar installation', 'solar panels', 'solar power', 'solar system', 'PV installation', 'net metering'],
    description: 'Professional solar installation services',
    icon: 'Sun',
    metaTemplate: {
      title: 'Solar Installation in {location} | Solar Panel Systems Kenya',
      description: 'Professional solar installation in {location}. Residential & commercial solar systems. KPLC net metering. Call +254768860665',
      h1: 'Solar Installation in {location}'
    },
    features: [
      'Grid-tied systems',
      'Off-grid solutions',
      'Hybrid systems',
      'Battery storage',
      'Net metering setup',
      'Commercial solar'
    ],
    faqs: [
      {
        question: 'How much does solar installation cost in {location}?',
        answer: 'Costs vary by system size. A typical home system ranges from KES 200,000-500,000. Commercial systems are priced per kW.'
      },
      {
        question: 'Do you help with KPLC net metering?',
        answer: 'Yes, we handle the complete net metering application and installation process with KPLC.'
      },
      {
        question: 'What warranty do you offer on solar systems?',
        answer: 'Panels come with 25-year warranty, inverters 5-10 years, and installation workmanship 2 years.'
      }
    ]
  },
  {
    id: 'ups',
    slug: 'ups-systems',
    name: 'UPS Systems',
    shortName: 'UPS',
    keywords: ['UPS systems', 'uninterruptible power', 'power backup', 'UPS installation', 'online UPS', 'UPS batteries'],
    description: 'UPS systems and power backup solutions',
    icon: 'Battery',
    metaTemplate: {
      title: 'UPS Systems in {location} | Power Backup Solutions Kenya',
      description: 'UPS systems and power backup solutions in {location}. Online, line-interactive UPS. Installation & maintenance. Call +254768860665',
      h1: 'UPS Systems in {location}'
    },
    features: [
      'Online UPS systems',
      'Line-interactive UPS',
      'Modular UPS',
      'Battery replacement',
      'UPS maintenance',
      'Data center solutions'
    ],
    faqs: [
      {
        question: 'What size UPS do I need?',
        answer: 'UPS sizing depends on your load. We offer free site surveys to recommend the right capacity for your needs in {location}.'
      },
      {
        question: 'How long will UPS backup last?',
        answer: 'Runtime depends on UPS capacity and load. We can design systems from 5 minutes to several hours of backup.'
      },
      {
        question: 'Do you maintain UPS systems?',
        answer: 'Yes, we offer UPS maintenance contracts including battery testing, replacement, and preventive service.'
      }
    ]
  },
  {
    id: 'electrical',
    slug: 'electrical-services',
    name: 'Electrical Services',
    shortName: 'Electrical',
    keywords: ['electrical services', 'electrical installation', 'electrician', 'wiring', 'electrical contractor', 'power installation'],
    description: 'Professional electrical installation services',
    icon: 'Plug',
    metaTemplate: {
      title: 'Electrical Services in {location} | Licensed Electricians Kenya',
      description: 'Professional electrical services in {location}. Industrial & commercial electrical installation. Licensed contractors. Call +254768860665',
      h1: 'Electrical Services in {location}'
    },
    features: [
      'Industrial wiring',
      'Commercial installation',
      'Power distribution',
      'Panel upgrades',
      'Earthing systems',
      'KPLC connections'
    ],
    faqs: [
      {
        question: 'Are your electricians licensed?',
        answer: 'Yes, all our electricians are ERC licensed and trained to handle industrial and commercial installations.'
      },
      {
        question: 'Do you handle KPLC meter installations?',
        answer: 'Yes, we assist with KPLC applications and complete the internal wiring for new connections.'
      },
      {
        question: 'Can you upgrade my electrical panel?',
        answer: 'Yes, we assess your current system and upgrade distribution boards and wiring to meet your power needs.'
      }
    ]
  },
  {
    id: 'motor-rewinding',
    slug: 'motor-rewinding',
    name: 'Motor Rewinding',
    shortName: 'Motors',
    keywords: ['motor rewinding', 'electric motor repair', 'motor services', 'motor coil', 'motor overhaul', 'pump motor repair'],
    description: 'Electric motor rewinding and repairs',
    icon: 'RotateCw',
    metaTemplate: {
      title: 'Motor Rewinding in {location} | Electric Motor Repairs Kenya',
      description: 'Professional motor rewinding in {location}. Electric motor repairs, balancing, VFD integration. Call +254768860665',
      h1: 'Motor Rewinding in {location}'
    },
    features: [
      'Motor rewinding',
      'Bearing replacement',
      'Shaft repairs',
      'Dynamic balancing',
      'VFD installation',
      'Pump motor repairs'
    ],
    faqs: [
      {
        question: 'What types of motors do you rewind?',
        answer: 'We rewind single phase, three phase, AC and DC motors, submersible pump motors, and specialized motors.'
      },
      {
        question: 'How long does motor rewinding take?',
        answer: 'Typical rewinding takes 3-5 days. Rush service available for critical equipment.'
      },
      {
        question: 'Is rewinding cheaper than buying a new motor?',
        answer: 'Yes, rewinding typically costs 40-60% of a new motor price while restoring original performance.'
      }
    ]
  }
];

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): SEOService | undefined {
  return SEO_SERVICES.find(service => service.slug === slug);
}

/**
 * Get service by ID
 */
export function getServiceById(id: string): SEOService | undefined {
  return SEO_SERVICES.find(service => service.id === id);
}

/**
 * Get all service slugs
 */
export function getAllServiceSlugs(): string[] {
  return SEO_SERVICES.map(service => service.slug);
}

/**
 * Generate meta title for location + service
 */
export function generateServiceTitle(service: SEOService, locationName: string): string {
  return service.metaTemplate.title.replace(/{location}/g, locationName);
}

/**
 * Generate meta description for location + service
 */
export function generateServiceDescription(service: SEOService, locationName: string): string {
  return service.metaTemplate.description.replace(/{location}/g, locationName);
}

/**
 * Generate H1 for location + service
 */
export function generateServiceH1(service: SEOService, locationName: string): string {
  return service.metaTemplate.h1.replace(/{location}/g, locationName);
}

/**
 * Generate keywords for location + service
 */
export function generateServiceKeywords(service: SEOService, locationName: string): string[] {
  const keywords: string[] = [];

  for (const keyword of service.keywords) {
    keywords.push(`${keyword} ${locationName}`);
    keywords.push(`${keyword} in ${locationName}`);
    keywords.push(`${locationName} ${keyword}`);
  }

  keywords.push(`${locationName} Kenya`);
  keywords.push(`${service.shortName} ${locationName}`);
  keywords.push(`best ${service.shortName.toLowerCase()} ${locationName}`);

  return keywords;
}

/**
 * Generate FAQ items with location substitution
 */
export function generateServiceFAQs(
  service: SEOService,
  locationName: string
): Array<{ question: string; answer: string }> {
  return service.faqs.map(faq => ({
    question: faq.question.replace(/{location}/g, locationName),
    answer: faq.answer.replace(/{location}/g, locationName)
  }));
}
