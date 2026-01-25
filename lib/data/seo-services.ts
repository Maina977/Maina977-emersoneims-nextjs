/**
 * SEO SERVICES CONFIGURATION
 * Comprehensive service definitions for location-based SEO pages
 * Each service generates pages like "Solar Companies in [location]"
 *
 * SERVICES COVERED:
 * 1. Generator Services (10+ types)
 * 2. Solar Energy Solutions (15+ types)
 * 3. Motor Rewinding & Electrical (8+ types)
 * 4. UPS & Power Backup (3+ types)
 */

export interface SEOService {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  keywords: string[];
  description: string;
  icon: string;
  category: 'generators' | 'solar' | 'motors' | 'ups' | 'electrical';
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
  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERATOR SERVICES (Already established - keeping existing)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'generator-companies',
    slug: 'generator-companies',
    name: 'Generator Companies',
    shortName: 'Generator Companies',
    keywords: ['generator companies', 'generator dealers', 'generator suppliers', 'generator shop', 'generator store', 'genset suppliers', 'generator company near me'],
    description: 'Top rated generator companies and dealers',
    icon: 'Building2',
    category: 'generators',
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
    keywords: ['generators', 'diesel generators', 'power generators', 'gensets', 'backup generators', 'standby generators', 'industrial generators', 'generators for sale', 'buy generator'],
    description: 'Premium generators for sale',
    icon: 'Zap',
    category: 'generators',
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
    shortName: 'Generator Repairs',
    keywords: ['generator repairs', 'generator servicing', 'generator fix', 'genset repair', 'generator mechanic', 'generator technician', 'generator repair near me'],
    description: 'Professional generator repair services',
    icon: 'Wrench',
    category: 'generators',
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
    shortName: 'Generator Rental',
    keywords: ['generator lease', 'generator rental', 'generator hire', 'rent generator', 'generator for hire', 'temporary power', 'generator rental near me'],
    description: 'Flexible generator lease and rental options',
    icon: 'Calendar',
    category: 'generators',
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
    shortName: 'Generator Maintenance',
    keywords: ['generator maintenance', 'generator servicing', 'preventive maintenance', 'generator AMC', 'generator service contract', 'generator service near me'],
    description: 'Preventive maintenance and service plans',
    icon: 'Settings',
    category: 'generators',
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
    shortName: 'Generator Parts',
    keywords: ['generator spare parts', 'generator spares', 'generator parts', 'genset parts', 'generator filters', 'generator batteries', 'generator parts near me'],
    description: 'Genuine generator spare parts',
    icon: 'Package',
    category: 'generators',
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

  // ═══════════════════════════════════════════════════════════════════════════════
  // ☀️ SOLAR ENERGY SOLUTIONS - COMPLETE COVERAGE
  // ═══════════════════════════════════════════════════════════════════════════════

  {
    id: 'solar-companies',
    slug: 'solar-companies',
    name: 'Solar Companies',
    shortName: 'Solar Companies',
    keywords: [
      'solar companies', 'solar company', 'best solar company', 'solar energy company',
      'solar installation company', 'solar provider', 'solar dealer', 'solar supplier',
      'solar companies near me', 'top solar companies', 'solar energy solutions',
      'solar power company', 'solar system company', 'renewable energy company'
    ],
    description: 'Leading solar energy companies and installers',
    icon: 'Sun',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Companies in {location} | #1 Solar Energy Company Kenya',
      description: 'Best solar companies in {location}. Professional solar installation, panels, batteries & inverters. KPLC net metering experts. Call +254768860665',
      h1: 'Solar Companies in {location}'
    },
    features: [
      'Licensed solar installers',
      'Residential & commercial',
      'Grid-tied & off-grid systems',
      'KPLC net metering approval',
      '25-year panel warranty',
      'Free site assessment'
    ],
    faqs: [
      {
        question: 'What is the best solar company in {location}?',
        answer: 'Emerson EIMS is the leading solar company in {location}, offering complete solar solutions with professional installation and after-sales support.'
      },
      {
        question: 'Do solar companies in {location} offer financing?',
        answer: 'Yes, we partner with financial institutions to offer flexible payment plans and solar financing options in {location}.'
      },
      {
        question: 'How do I choose a solar company in {location}?',
        answer: 'Look for licensed installers, quality products, good warranties, and local after-sales support. Emerson EIMS ticks all boxes in {location}.'
      }
    ]
  },
  {
    id: 'solar-experts',
    slug: 'solar-experts',
    name: 'Solar Experts',
    shortName: 'Solar Experts',
    keywords: [
      'solar experts', 'solar specialist', 'solar consultant', 'solar advisor',
      'solar engineer', 'solar technician', 'solar professional', 'solar designer',
      'solar experts near me', 'certified solar installer', 'solar energy expert'
    ],
    description: 'Certified solar energy experts and consultants',
    icon: 'Users',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Experts in {location} | Certified Solar Consultants Kenya',
      description: 'Certified solar experts in {location}. Professional solar design, sizing & installation. Expert advice on solar systems. Call +254768860665',
      h1: 'Solar Experts in {location}'
    },
    features: [
      'Certified solar engineers',
      'Custom system design',
      'Load analysis & sizing',
      'ROI calculations',
      'Technical consultation',
      'Project management'
    ],
    faqs: [
      {
        question: 'How do I find solar experts in {location}?',
        answer: 'Emerson EIMS has certified solar experts serving {location}. We provide free consultations and professional solar system design.'
      },
      {
        question: 'What qualifications should solar experts have?',
        answer: 'Our solar experts are EPRA licensed, manufacturer certified, and have extensive experience in solar installations across Kenya.'
      },
      {
        question: 'Do your solar experts offer free consultations in {location}?',
        answer: 'Yes, we offer free site assessments and consultations in {location} to help you choose the right solar solution.'
      }
    ]
  },
  {
    id: 'solar-panels',
    slug: 'solar-panels',
    name: 'Solar Panels',
    shortName: 'Solar Panels',
    keywords: [
      'solar panels', 'solar panel', 'PV panels', 'photovoltaic panels', 'solar modules',
      'solar panels for sale', 'buy solar panels', 'solar panel price', 'solar panel cost',
      'monocrystalline panels', 'polycrystalline panels', 'solar panels near me',
      'cheap solar panels', 'best solar panels', 'solar panel installation'
    ],
    description: 'High-quality solar panels for homes and businesses',
    icon: 'LayoutGrid',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Panels in {location} | Best Solar Panels Kenya 2024',
      description: 'High-efficiency solar panels in {location}. Monocrystalline & polycrystalline. 25-year warranty. Best prices. Free delivery. Call +254768860665',
      h1: 'Solar Panels in {location}'
    },
    features: [
      'Tier 1 solar panels',
      'Monocrystalline (high efficiency)',
      'Polycrystalline (value)',
      '25-year performance warranty',
      'All sizes: 100W to 550W',
      'Free installation included'
    ],
    faqs: [
      {
        question: 'What is the price of solar panels in {location}?',
        answer: 'Solar panel prices in {location} range from KES 8,000-25,000 per panel depending on wattage and quality. Contact us for bulk pricing.'
      },
      {
        question: 'How many solar panels do I need for my home in {location}?',
        answer: 'A typical 3-bedroom home in {location} needs 8-12 panels (3-5kW system). We offer free assessments to determine your exact needs.'
      },
      {
        question: 'What type of solar panel is best for {location}?',
        answer: 'Monocrystalline panels are ideal for {location} due to higher efficiency in hot climates. We recommend Tier 1 brands like JA Solar, Longi, and Trina.'
      }
    ]
  },
  {
    id: 'solar-batteries',
    slug: 'solar-batteries',
    name: 'Solar Batteries',
    shortName: 'Solar Batteries',
    keywords: [
      'solar batteries', 'solar battery', 'solar storage', 'battery storage',
      'lithium solar battery', 'gel battery solar', 'solar battery price',
      'solar batteries for sale', 'home battery storage', 'solar power storage',
      'deep cycle battery', 'solar battery backup', 'solar batteries near me'
    ],
    description: 'Solar battery storage solutions for backup power',
    icon: 'Battery',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Batteries in {location} | Solar Battery Storage Kenya',
      description: 'Solar batteries in {location}. Lithium & gel batteries for solar systems. Long lifespan, warranty included. Best prices. Call +254768860665',
      h1: 'Solar Batteries in {location}'
    },
    features: [
      'Lithium-ion batteries',
      'Gel deep cycle batteries',
      'Lead-acid batteries',
      '5-10 year warranty',
      'BMS protection',
      'Expandable systems'
    ],
    faqs: [
      {
        question: 'What is the best solar battery for {location}?',
        answer: 'Lithium batteries (LiFePO4) are best for {location} - longer lifespan, deeper discharge, and better heat tolerance. We stock top brands.'
      },
      {
        question: 'How much do solar batteries cost in {location}?',
        answer: 'Solar battery prices in {location} range from KES 30,000 for gel batteries to KES 200,000+ for lithium. Cost depends on capacity.'
      },
      {
        question: 'How long do solar batteries last in {location}?',
        answer: 'Gel batteries last 3-5 years, while lithium batteries last 10-15 years in {location} with proper maintenance.'
      }
    ]
  },
  {
    id: 'solar-inverters',
    slug: 'solar-inverters',
    name: 'Solar Inverters',
    shortName: 'Solar Inverters',
    keywords: [
      'solar inverters', 'solar inverter', 'hybrid inverter', 'off-grid inverter',
      'grid-tie inverter', 'solar inverter price', 'inverter for solar',
      'MPPT inverter', 'solar power inverter', 'solar inverters near me',
      'best solar inverter', 'solar inverter installation'
    ],
    description: 'Solar inverters for grid-tie and off-grid systems',
    icon: 'Activity',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Inverters in {location} | Hybrid & Off-Grid Inverters',
      description: 'Solar inverters in {location}. Hybrid, off-grid & grid-tie inverters. Top brands: Growatt, Deye, Victron. Installation included. Call +254768860665',
      h1: 'Solar Inverters in {location}'
    },
    features: [
      'Hybrid inverters',
      'Off-grid inverters',
      'Grid-tie inverters',
      'MPPT technology',
      'WiFi monitoring',
      '5-10 year warranty'
    ],
    faqs: [
      {
        question: 'What size solar inverter do I need in {location}?',
        answer: 'Inverter size depends on your load. A typical home in {location} needs a 5-10kW inverter. We provide free sizing consultations.'
      },
      {
        question: 'What is the best solar inverter brand in {location}?',
        answer: 'We recommend Growatt, Deye, and Victron for {location}. These brands offer excellent efficiency and reliability in our climate.'
      },
      {
        question: 'Can I connect a solar inverter to KPLC in {location}?',
        answer: 'Yes, with a grid-tie or hybrid inverter and KPLC net metering approval. We handle the entire application process in {location}.'
      }
    ]
  },
  {
    id: 'solar-technicians',
    slug: 'solar-technicians',
    name: 'Solar Technicians',
    shortName: 'Solar Technicians',
    keywords: [
      'solar technicians', 'solar technician', 'solar installer', 'solar fitter',
      'solar electrician', 'solar panel installer', 'solar installation technician',
      'solar technicians near me', 'certified solar technician', 'solar service technician'
    ],
    description: 'Certified solar installation technicians',
    icon: 'HardHat',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Technicians in {location} | Certified Solar Installers',
      description: 'Certified solar technicians in {location}. Professional solar panel installation & repairs. Licensed electricians. Call +254768860665',
      h1: 'Solar Technicians in {location}'
    },
    features: [
      'Certified installers',
      'Licensed electricians',
      'Professional tools',
      'Safety compliant',
      'Quality workmanship',
      'After-sales support'
    ],
    faqs: [
      {
        question: 'How do I find certified solar technicians in {location}?',
        answer: 'Emerson EIMS employs certified solar technicians in {location}. All our installers are trained and licensed for solar installations.'
      },
      {
        question: 'What certifications should solar technicians have?',
        answer: 'Solar technicians should have ERC electrical license, manufacturer training, and safety certifications. Our team meets all requirements.'
      },
      {
        question: 'Do your solar technicians offer warranty on installation in {location}?',
        answer: 'Yes, we provide 2-year workmanship warranty on all solar installations in {location}.'
      }
    ]
  },
  {
    id: 'solar-farms',
    slug: 'solar-for-farms',
    name: 'Solar for Farms',
    shortName: 'Farm Solar',
    keywords: [
      'solar for farms', 'agricultural solar', 'farm solar panels', 'solar irrigation',
      'solar water pump', 'solar borehole pump', 'farm solar system', 'solar for agriculture',
      'solar powered farm', 'solar farm equipment', 'solar for poultry', 'solar for dairy'
    ],
    description: 'Solar power solutions for farms and agriculture',
    icon: 'Tractor',
    category: 'solar',
    metaTemplate: {
      title: 'Solar for Farms in {location} | Agricultural Solar Solutions',
      description: 'Solar for farms in {location}. Solar irrigation, water pumps, poultry & dairy farms. Reduce farming costs. Free assessment. Call +254768860665',
      h1: 'Solar for Farms in {location}'
    },
    features: [
      'Solar irrigation systems',
      'Solar water pumps',
      'Poultry farm solar',
      'Dairy farm solar',
      'Greenhouse lighting',
      'Cold storage power'
    ],
    faqs: [
      {
        question: 'How can solar help my farm in {location}?',
        answer: 'Solar can power irrigation, water pumps, cold storage, and farm buildings in {location}, reducing electricity costs by 80-100%.'
      },
      {
        question: 'What size solar system does a farm need in {location}?',
        answer: 'Farm solar systems in {location} range from 5kW for small farms to 100kW+ for large operations. We design based on your needs.'
      },
      {
        question: 'Can solar power my irrigation pumps in {location}?',
        answer: 'Yes, we specialize in solar irrigation and borehole pump systems for farms in {location}. These run directly on solar power.'
      }
    ]
  },
  {
    id: 'solar-hotels',
    slug: 'solar-for-hotels',
    name: 'Solar for Hotels',
    shortName: 'Hotel Solar',
    keywords: [
      'solar for hotels', 'hotel solar system', 'hospitality solar', 'resort solar',
      'solar hotel water heater', 'hotel solar panels', 'lodge solar power',
      'solar for lodges', 'hotel solar installation', 'tourist hotel solar'
    ],
    description: 'Solar solutions for hotels and hospitality',
    icon: 'Hotel',
    category: 'solar',
    metaTemplate: {
      title: 'Solar for Hotels in {location} | Hospitality Solar Solutions',
      description: 'Solar for hotels in {location}. Reduce hotel electricity bills by 70%. Solar water heating, power systems. Free site survey. Call +254768860665',
      h1: 'Solar for Hotels in {location}'
    },
    features: [
      'Large-scale installations',
      'Solar water heating',
      'Grid-tie systems',
      'Battery backup',
      'Pool heating',
      'Kitchen power'
    ],
    faqs: [
      {
        question: 'How much can hotels save with solar in {location}?',
        answer: 'Hotels in {location} can reduce electricity bills by 60-80% with solar. ROI typically achieved in 3-5 years.'
      },
      {
        question: 'Can solar power a large hotel in {location}?',
        answer: 'Yes, we design commercial solar systems from 20kW to 500kW+ for hotels in {location}. Systems are sized to your consumption.'
      },
      {
        question: 'Do you install solar water heaters for hotels in {location}?',
        answer: 'Yes, solar water heaters significantly reduce heating costs for hotels in {location}. We install commercial-grade systems.'
      }
    ]
  },
  {
    id: 'solar-hospitals',
    slug: 'solar-for-hospitals',
    name: 'Solar for Hospitals',
    shortName: 'Hospital Solar',
    keywords: [
      'solar for hospitals', 'hospital solar system', 'healthcare solar', 'clinic solar',
      'medical facility solar', 'hospital backup power', 'solar for clinics',
      'hospital solar installation', 'medical solar power', 'health center solar'
    ],
    description: 'Reliable solar power for healthcare facilities',
    icon: 'Heart',
    category: 'solar',
    metaTemplate: {
      title: 'Solar for Hospitals in {location} | Healthcare Solar Solutions',
      description: 'Solar for hospitals in {location}. Reliable power for medical equipment. Battery backup included. Zero downtime systems. Call +254768860665',
      h1: 'Solar for Hospitals in {location}'
    },
    features: [
      'Uninterrupted power',
      'Battery backup systems',
      'Medical equipment safe',
      'KPLC grid integration',
      'Remote monitoring',
      '24/7 support'
    ],
    faqs: [
      {
        question: 'Is solar reliable enough for hospitals in {location}?',
        answer: 'Yes, our hospital solar systems in {location} include battery backup for 100% uptime. Critical equipment is always powered.'
      },
      {
        question: 'Can solar power medical equipment in {location}?',
        answer: 'Yes, with proper inverter sizing and battery backup, solar can safely power all medical equipment in {location} hospitals.'
      },
      {
        question: 'What warranty do you offer for hospital solar in {location}?',
        answer: 'We offer extended warranties and priority support for healthcare facilities in {location}. 25-year panel warranty, 10-year inverter warranty.'
      }
    ]
  },
  {
    id: 'solar-industries',
    slug: 'solar-for-industries',
    name: 'Solar for Industries',
    shortName: 'Industrial Solar',
    keywords: [
      'solar for industries', 'industrial solar', 'factory solar', 'manufacturing solar',
      'commercial solar', 'industrial solar panels', 'warehouse solar', 'solar for factories',
      'industrial solar installation', 'large scale solar', 'business solar'
    ],
    description: 'Industrial-scale solar power solutions',
    icon: 'Factory',
    category: 'solar',
    metaTemplate: {
      title: 'Solar for Industries in {location} | Industrial Solar Kenya',
      description: 'Industrial solar in {location}. Large-scale solar for factories & warehouses. Cut electricity costs 70%. Net metering. Call +254768860665',
      h1: 'Solar for Industries in {location}'
    },
    features: [
      'Large-scale systems (50kW-1MW)',
      'Rooftop installations',
      'Ground-mount systems',
      'KPLC net metering',
      'Power factor correction',
      'Energy monitoring'
    ],
    faqs: [
      {
        question: 'How much can industries save with solar in {location}?',
        answer: 'Industries in {location} typically save 60-80% on electricity costs with solar. Large installations achieve ROI in 3-4 years.'
      },
      {
        question: 'Do you install ground-mount solar for factories in {location}?',
        answer: 'Yes, we design and install ground-mount solar farms for industries in {location} where roof space is limited.'
      },
      {
        question: 'Can solar power heavy machinery in {location}?',
        answer: 'Yes, with grid-tie systems and proper sizing, solar can significantly offset power for industrial machinery in {location}.'
      }
    ]
  },
  {
    id: 'solar-homes',
    slug: 'solar-for-homes',
    name: 'Solar for Homes',
    shortName: 'Home Solar',
    keywords: [
      'solar for homes', 'residential solar', 'home solar system', 'house solar panels',
      'solar for my house', 'home solar installation', 'domestic solar', 'solar for houses',
      'solar power for home', 'home solar panels', 'solar home system'
    ],
    description: 'Residential solar power systems for homes',
    icon: 'Home',
    category: 'solar',
    metaTemplate: {
      title: 'Solar for Homes in {location} | Residential Solar Kenya',
      description: 'Solar for homes in {location}. Complete home solar systems. Reduce bills by 90%. Battery backup included. Free quote. Call +254768860665',
      h1: 'Solar for Homes in {location}'
    },
    features: [
      'Complete home systems',
      '3kW to 15kW systems',
      'Battery backup',
      'KPLC net metering',
      'Smart monitoring app',
      'Financing available'
    ],
    faqs: [
      {
        question: 'How much does home solar cost in {location}?',
        answer: 'Home solar systems in {location} cost from KES 250,000 for a 3kW system to KES 800,000+ for larger systems. We offer financing.'
      },
      {
        question: 'Will solar power my whole house in {location}?',
        answer: 'Yes, with proper sizing. A 5-10kW system can power most homes in {location} including AC, fridges, and normal appliances.'
      },
      {
        question: 'Do I need batteries for home solar in {location}?',
        answer: 'For backup during outages, yes. For grid-tie only, batteries are optional. We recommend hybrid systems for {location} homes.'
      }
    ]
  },
  {
    id: 'solar-maintenance',
    slug: 'solar-maintenance',
    name: 'Solar Maintenance',
    shortName: 'Solar Maintenance',
    keywords: [
      'solar maintenance', 'solar panel cleaning', 'solar servicing', 'solar system maintenance',
      'solar panel maintenance', 'solar service', 'solar AMC', 'solar maintenance contract',
      'solar maintenance near me', 'solar care', 'PV maintenance'
    ],
    description: 'Professional solar system maintenance services',
    icon: 'Tool',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Maintenance in {location} | Solar Panel Cleaning & Service',
      description: 'Solar maintenance in {location}. Panel cleaning, inverter service, battery checks. Keep your solar efficient. AMC available. Call +254768860665',
      h1: 'Solar Maintenance in {location}'
    },
    features: [
      'Panel cleaning',
      'Inverter inspection',
      'Battery maintenance',
      'Connection checks',
      'Performance monitoring',
      'Annual service contracts'
    ],
    faqs: [
      {
        question: 'How often should solar panels be cleaned in {location}?',
        answer: 'Solar panels in {location} should be cleaned every 3-6 months, or more frequently in dusty areas, to maintain efficiency.'
      },
      {
        question: 'What is included in solar maintenance in {location}?',
        answer: 'Our maintenance includes panel cleaning, inverter checks, battery testing, wiring inspection, and performance report.'
      },
      {
        question: 'Do you offer solar AMC contracts in {location}?',
        answer: 'Yes, our Annual Maintenance Contracts in {location} include regular visits, priority support, and discounted repairs.'
      }
    ]
  },
  {
    id: 'solar-repairs',
    slug: 'solar-repairs',
    name: 'Solar Repairs',
    shortName: 'Solar Repairs',
    keywords: [
      'solar repairs', 'solar panel repair', 'solar system repair', 'solar inverter repair',
      'fix solar panels', 'solar repair service', 'solar troubleshooting', 'solar not working',
      'solar repairs near me', 'solar technician repair', 'solar system problems'
    ],
    description: 'Expert solar system repair services',
    icon: 'Wrench',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Repairs in {location} | Solar Panel & Inverter Repairs',
      description: 'Solar repairs in {location}. Inverter repairs, panel issues, battery problems. Fast response. All brands serviced. Call +254768860665',
      h1: 'Solar Repairs in {location}'
    },
    features: [
      'Inverter repairs',
      'Panel repairs',
      'Battery replacement',
      'Wiring repairs',
      'Controller fixes',
      'Emergency service'
    ],
    faqs: [
      {
        question: 'My solar system stopped working in {location}. What do I do?',
        answer: 'Call us immediately at +254768860665. Our technicians in {location} provide fast diagnosis and repair for all solar systems.'
      },
      {
        question: 'Do you repair all solar brands in {location}?',
        answer: 'Yes, our technicians are trained to repair all solar inverter and panel brands used in {location}.'
      },
      {
        question: 'How much do solar repairs cost in {location}?',
        answer: 'Repair costs in {location} depend on the issue. We provide free diagnosis and upfront quotes before any repairs.'
      }
    ]
  },
  {
    id: 'solar-spares',
    slug: 'solar-spares',
    name: 'Solar Spares',
    shortName: 'Solar Parts',
    keywords: [
      'solar spares', 'solar spare parts', 'solar parts', 'solar components',
      'solar accessories', 'solar cables', 'solar connectors', 'MC4 connectors',
      'solar mounting', 'solar brackets', 'solar spares near me', 'buy solar parts'
    ],
    description: 'Solar spare parts and components',
    icon: 'Package',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Spares in {location} | Solar Parts & Components Kenya',
      description: 'Solar spares in {location}. MC4 connectors, solar cables, mounting brackets, charge controllers. Fast delivery. Call +254768860665',
      h1: 'Solar Spares in {location}'
    },
    features: [
      'MC4 connectors',
      'Solar cables',
      'Mounting brackets',
      'Charge controllers',
      'Fuses & breakers',
      'Monitoring equipment'
    ],
    faqs: [
      {
        question: 'Where can I buy solar parts in {location}?',
        answer: 'Emerson EIMS stocks all solar spare parts in {location}. We offer fast delivery and competitive prices on components.'
      },
      {
        question: 'Do you sell MC4 connectors in {location}?',
        answer: 'Yes, we stock genuine MC4 connectors, extension cables, and Y-branches for solar installations in {location}.'
      },
      {
        question: 'Can I buy solar parts without installation in {location}?',
        answer: 'Yes, we sell solar components separately. Visit our store or order for delivery in {location}.'
      }
    ]
  },
  {
    id: 'solar-installation',
    slug: 'solar-installation',
    name: 'Solar Installation',
    shortName: 'Solar Installation',
    keywords: [
      'solar installation', 'solar panel installation', 'install solar panels', 'solar system installation',
      'solar installer', 'solar installation cost', 'solar installation company', 'solar installation near me',
      'professional solar installation', 'certified solar installation'
    ],
    description: 'Professional solar installation services',
    icon: 'Sun',
    category: 'solar',
    metaTemplate: {
      title: 'Solar Installation in {location} | Professional Solar Installers',
      description: 'Professional solar installation in {location}. Certified installers, quality products. Residential & commercial. Free quote. Call +254768860665',
      h1: 'Solar Installation in {location}'
    },
    features: [
      'Professional installation',
      'Quality products',
      'KPLC compliance',
      'Safety standards',
      'Warranty included',
      'After-sales support'
    ],
    faqs: [
      {
        question: 'How long does solar installation take in {location}?',
        answer: 'Residential solar installation in {location} takes 1-2 days. Commercial installations may take 1-2 weeks depending on size.'
      },
      {
        question: 'Is solar installation messy?',
        answer: 'No, our professional installers in {location} work cleanly and leave your property tidy after installation.'
      },
      {
        question: 'Do I need a permit for solar installation in {location}?',
        answer: 'For grid-tie systems, KPLC approval is required. We handle all paperwork and permits in {location}.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ⚡ MOTOR REWINDING & ELECTRICAL SERVICES
  // ═══════════════════════════════════════════════════════════════════════════════

  {
    id: 'motor-rewinding-companies',
    slug: 'motor-rewinding-companies',
    name: 'Motor Rewinding Companies',
    shortName: 'Motor Companies',
    keywords: [
      'motor rewinding companies', 'motor repair company', 'electric motor company',
      'motor rewinding near me', 'motor service company', 'motor rewinding shop',
      'industrial motor company', 'motor rewind company', 'motor workshop'
    ],
    description: 'Leading motor rewinding companies',
    icon: 'Building2',
    category: 'motors',
    metaTemplate: {
      title: 'Motor Rewinding Companies in {location} | Best Motor Repairs Kenya',
      description: 'Top motor rewinding companies in {location}. Expert electric motor repairs, pump motors, industrial motors. Fast turnaround. Call +254768860665',
      h1: 'Motor Rewinding Companies in {location}'
    },
    features: [
      'All motor types',
      'Industrial motors',
      'Pump motors',
      'Submersible motors',
      'Fast turnaround',
      'Quality guarantee'
    ],
    faqs: [
      {
        question: 'What is the best motor rewinding company in {location}?',
        answer: 'Emerson EIMS is the leading motor rewinding company in {location}, handling all types of electric motors with quality guarantee.'
      },
      {
        question: 'Do motor rewinding companies in {location} collect motors?',
        answer: 'Yes, we offer pickup and delivery service for motor rewinding in {location}. Contact us to arrange collection.'
      },
      {
        question: 'How do I choose a motor rewinding company in {location}?',
        answer: 'Look for experience, quality materials, fast turnaround, and warranty. Emerson EIMS meets all these criteria in {location}.'
      }
    ]
  },
  {
    id: 'motor-rewinding',
    slug: 'motor-rewinding',
    name: 'Motor Rewinding',
    shortName: 'Motor Rewinding',
    keywords: [
      'motor rewinding', 'rewind motor', 'motor coil winding', 'electric motor rewinding',
      'motor rewinding service', 'coil rewinding', 'armature rewinding', 'stator rewinding',
      'motor winding repair', 'motor rewinding near me'
    ],
    description: 'Professional motor rewinding services',
    icon: 'RotateCw',
    category: 'motors',
    metaTemplate: {
      title: 'Motor Rewinding in {location} | Electric Motor Rewind Kenya',
      description: 'Professional motor rewinding in {location}. All motor types, quality copper wire. Fast turnaround, warranty. Call +254768860665',
      h1: 'Motor Rewinding in {location}'
    },
    features: [
      'Quality copper wire',
      'Original specifications',
      'Varnish treatment',
      'Bearing replacement',
      'Balancing service',
      'Testing & commissioning'
    ],
    faqs: [
      {
        question: 'How long does motor rewinding take in {location}?',
        answer: 'Standard motor rewinding in {location} takes 3-5 days. Rush service available for critical motors at additional cost.'
      },
      {
        question: 'Is motor rewinding worth it?',
        answer: 'Yes, rewinding costs 40-60% of a new motor and restores original performance. Recommended for quality motors.'
      },
      {
        question: 'What size motors do you rewind in {location}?',
        answer: 'We rewind motors from 0.5HP to 500HP in {location}. Both single-phase and three-phase motors.'
      }
    ]
  },
  {
    id: 'motor-repairs',
    slug: 'motor-repairs',
    name: 'Motor Repairs',
    shortName: 'Motor Repairs',
    keywords: [
      'motor repairs', 'electric motor repair', 'motor repair service', 'fix motor',
      'motor not working', 'motor troubleshooting', 'motor mechanic', 'motor technician',
      'motor repair near me', 'motor repair shop'
    ],
    description: 'Electric motor repair services',
    icon: 'Wrench',
    category: 'motors',
    metaTemplate: {
      title: 'Motor Repairs in {location} | Electric Motor Repair Service',
      description: 'Motor repairs in {location}. Bearing replacement, shaft repair, rewinding. All motor types. Fast turnaround. Call +254768860665',
      h1: 'Motor Repairs in {location}'
    },
    features: [
      'Bearing replacement',
      'Shaft repairs',
      'End shield repair',
      'Fan replacement',
      'Capacitor replacement',
      'Full overhaul'
    ],
    faqs: [
      {
        question: 'What motor problems can you repair in {location}?',
        answer: 'We repair all motor issues in {location}: burnt windings, bad bearings, shaft damage, electrical faults, and more.'
      },
      {
        question: 'How much does motor repair cost in {location}?',
        answer: 'Repair costs in {location} depend on motor size and damage. We provide free assessment and quotes before repairs.'
      },
      {
        question: 'Do you repair pump motors in {location}?',
        answer: 'Yes, we specialize in pump motor repairs including submersible, centrifugal, and borehole pump motors in {location}.'
      }
    ]
  },
  {
    id: 'pump-motors',
    slug: 'pump-motors',
    name: 'Pump Motors',
    shortName: 'Pump Motors',
    keywords: [
      'pump motors', 'pump motor repair', 'water pump motor', 'submersible motor',
      'borehole pump motor', 'pump motor rewinding', 'centrifugal pump motor',
      'pump motor service', 'pump motor near me'
    ],
    description: 'Pump motor repairs and rewinding',
    icon: 'Droplet',
    category: 'motors',
    metaTemplate: {
      title: 'Pump Motors in {location} | Pump Motor Repairs & Rewinding',
      description: 'Pump motor services in {location}. Submersible, borehole, centrifugal pump motors. Repair & rewinding. Call +254768860665',
      h1: 'Pump Motors in {location}'
    },
    features: [
      'Submersible motors',
      'Borehole motors',
      'Centrifugal pumps',
      'Booster pump motors',
      'Solar pump motors',
      'Seal replacement'
    ],
    faqs: [
      {
        question: 'Can you repair submersible pump motors in {location}?',
        answer: 'Yes, we specialize in submersible and borehole pump motor repairs in {location}. Complete rewinding and seal replacement.'
      },
      {
        question: 'How long does pump motor repair take in {location}?',
        answer: 'Pump motor repairs in {location} take 3-7 days depending on the extent of damage and parts availability.'
      },
      {
        question: 'Do you sell new pump motors in {location}?',
        answer: 'Yes, we supply new pump motors from leading brands if repair is not economical. Available for delivery in {location}.'
      }
    ]
  },
  {
    id: 'industrial-motors',
    slug: 'industrial-motors',
    name: 'Industrial Motors',
    shortName: 'Industrial Motors',
    keywords: [
      'industrial motors', 'industrial motor repair', 'factory motor', 'heavy duty motor',
      'industrial motor rewinding', 'production motor', 'industrial electric motor',
      'industrial motor service', 'large motor repair'
    ],
    description: 'Industrial motor repair and rewinding',
    icon: 'Factory',
    category: 'motors',
    metaTemplate: {
      title: 'Industrial Motors in {location} | Heavy Duty Motor Repairs',
      description: 'Industrial motor services in {location}. Large motor rewinding, repairs, VFD installation. Factory motor specialists. Call +254768860665',
      h1: 'Industrial Motors in {location}'
    },
    features: [
      'Large motor rewinding',
      'High voltage motors',
      'Crane motors',
      'Conveyor motors',
      'Compressor motors',
      'VFD integration'
    ],
    faqs: [
      {
        question: 'What size industrial motors do you service in {location}?',
        answer: 'We service industrial motors up to 500HP in {location}. Includes high voltage and specialized industrial motors.'
      },
      {
        question: 'Can you repair motors on-site in {location}?',
        answer: 'Yes, for critical industrial motors, we offer on-site emergency repairs in {location} to minimize downtime.'
      },
      {
        question: 'Do you install VFDs on motors in {location}?',
        answer: 'Yes, we supply and install Variable Frequency Drives (VFDs) for industrial motors in {location}.'
      }
    ]
  },
  {
    id: 'motor-maintenance',
    slug: 'motor-maintenance',
    name: 'Motor Maintenance',
    shortName: 'Motor Maintenance',
    keywords: [
      'motor maintenance', 'electric motor maintenance', 'motor servicing', 'motor care',
      'motor inspection', 'preventive motor maintenance', 'motor service contract',
      'motor maintenance near me', 'motor checkup'
    ],
    description: 'Preventive motor maintenance services',
    icon: 'Settings',
    category: 'motors',
    metaTemplate: {
      title: 'Motor Maintenance in {location} | Preventive Motor Service',
      description: 'Motor maintenance in {location}. Preventive servicing, bearing checks, insulation testing. Extend motor life. Call +254768860665',
      h1: 'Motor Maintenance in {location}'
    },
    features: [
      'Bearing lubrication',
      'Insulation testing',
      'Vibration analysis',
      'Thermal imaging',
      'Alignment checks',
      'Performance reports'
    ],
    faqs: [
      {
        question: 'How often should motors be maintained in {location}?',
        answer: 'Industrial motors should be inspected quarterly and fully serviced annually. We offer maintenance contracts in {location}.'
      },
      {
        question: 'What is included in motor maintenance in {location}?',
        answer: 'Our maintenance includes cleaning, bearing checks, insulation testing, alignment verification, and performance assessment.'
      },
      {
        question: 'Do you offer motor maintenance contracts in {location}?',
        answer: 'Yes, our Annual Maintenance Contracts include scheduled visits and priority emergency response in {location}.'
      }
    ]
  },
  {
    id: 'motor-spares',
    slug: 'motor-spares',
    name: 'Motor Spares',
    shortName: 'Motor Parts',
    keywords: [
      'motor spares', 'motor spare parts', 'motor parts', 'motor bearings',
      'motor capacitors', 'motor fans', 'motor brushes', 'motor components',
      'electric motor parts', 'motor spares near me'
    ],
    description: 'Motor spare parts and components',
    icon: 'Package',
    category: 'motors',
    metaTemplate: {
      title: 'Motor Spares in {location} | Electric Motor Parts Kenya',
      description: 'Motor spares in {location}. Bearings, capacitors, fans, brushes. All motor brands. Fast delivery. Call +254768860665',
      h1: 'Motor Spares in {location}'
    },
    features: [
      'Bearings (all sizes)',
      'Capacitors',
      'Cooling fans',
      'Carbon brushes',
      'Terminal boxes',
      'End shields'
    ],
    faqs: [
      {
        question: 'Where can I buy motor bearings in {location}?',
        answer: 'Emerson EIMS stocks all motor bearings in {location}. SKF, NSK, FAG, and other quality brands available.'
      },
      {
        question: 'Do you stock motor capacitors in {location}?',
        answer: 'Yes, we stock start and run capacitors for all single-phase motors in {location}. Various ratings available.'
      },
      {
        question: 'Can you source special motor parts in {location}?',
        answer: 'Yes, we can source special or obsolete motor parts for customers in {location}. Contact us with your requirements.'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔋 UPS & POWER BACKUP
  // ═══════════════════════════════════════════════════════════════════════════════

  {
    id: 'ups-systems',
    slug: 'ups-systems',
    name: 'UPS Systems',
    shortName: 'UPS Systems',
    keywords: [
      'UPS systems', 'uninterruptible power supply', 'power backup', 'UPS installation',
      'online UPS', 'UPS batteries', 'UPS near me', 'buy UPS', 'UPS company',
      'office UPS', 'server UPS', 'data center UPS'
    ],
    description: 'UPS systems and power backup solutions',
    icon: 'Battery',
    category: 'ups',
    metaTemplate: {
      title: 'UPS Systems in {location} | Power Backup Solutions Kenya',
      description: 'UPS systems in {location}. Online, line-interactive UPS. Data center & office solutions. Installation & maintenance. Call +254768860665',
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
        question: 'What size UPS do I need in {location}?',
        answer: 'UPS size depends on your load. We offer free site assessments in {location} to recommend the right capacity.'
      },
      {
        question: 'What brands of UPS do you supply in {location}?',
        answer: 'We supply APC, Vertiv, Eaton, and other leading UPS brands in {location}. All backed by warranty and support.'
      },
      {
        question: 'Do you maintain UPS systems in {location}?',
        answer: 'Yes, we offer UPS maintenance contracts including battery testing, replacement, and preventive service in {location}.'
      }
    ]
  },
  {
    id: 'electrical-services',
    slug: 'electrical-services',
    name: 'Electrical Services',
    shortName: 'Electrical',
    keywords: [
      'electrical services', 'electrical installation', 'electrician', 'wiring',
      'electrical contractor', 'power installation', 'electrical near me',
      'industrial electrician', 'commercial electrician', 'electrical company'
    ],
    description: 'Professional electrical installation services',
    icon: 'Plug',
    category: 'electrical',
    metaTemplate: {
      title: 'Electrical Services in {location} | Licensed Electricians Kenya',
      description: 'Professional electrical services in {location}. Industrial & commercial installation. Licensed contractors. Call +254768860665',
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
        question: 'Are your electricians licensed in {location}?',
        answer: 'Yes, all our electricians are ERC licensed and trained for industrial and commercial work in {location}.'
      },
      {
        question: 'Do you handle KPLC installations in {location}?',
        answer: 'Yes, we assist with KPLC applications and complete internal wiring for new connections in {location}.'
      },
      {
        question: 'What electrical services do you offer in {location}?',
        answer: 'We offer complete electrical services including installation, maintenance, repairs, and upgrades in {location}.'
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
 * Get services by category
 */
export function getServicesByCategory(category: SEOService['category']): SEOService[] {
  return SEO_SERVICES.filter(service => service.category === category);
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

/**
 * Get total number of potential pages
 * Formula: Counties × Services = Base pages
 * Plus: Constituencies × Services (on-demand)
 * Plus: Villages × Services (on-demand)
 */
export function getTotalPagesPotential(): {
  services: number;
  counties: number;
  basePages: number;
  categories: Record<string, number>;
} {
  const services = SEO_SERVICES.length;
  const counties = 47; // Kenya has 47 counties
  const basePages = services * counties;

  const categories: Record<string, number> = {};
  for (const service of SEO_SERVICES) {
    categories[service.category] = (categories[service.category] || 0) + 1;
  }

  return {
    services,
    counties,
    basePages,
    categories
  };
}
