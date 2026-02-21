/**
 * GENERATOR BRANDS SEO DATA
 * 17 major generator brands with SEO metadata for brand-specific pages
 * Generates pages like "Cummins Generators in Nairobi"
 */

export interface GeneratorBrand {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo?: string;
  description: string;
  country: string;
  founded?: number;
  keywords: string[];
  metaTemplate: {
    title: string;
    description: string;
    h1: string;
  };
  powerRange: string;
  applications: string[];
  features: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const GENERATOR_BRANDS: GeneratorBrand[] = [
  {
    id: 'cummins',
    slug: 'cummins',
    name: 'Cummins',
    shortName: 'Cummins',
    description: 'World-leading power solutions provider known for reliable diesel engines and generators',
    country: 'USA',
    founded: 1919,
    keywords: ['cummins generators', 'cummins generator', 'cummins genset', 'cummins power', 'cummins diesel generator', 'cummins kenya', 'cummins dealer', 'cummins parts'],
    metaTemplate: {
      title: 'Cummins Generators in {location} | Authorized Cummins Dealer Kenya',
      description: 'Cummins generators in {location}. Authorized dealer for Cummins diesel generators. Sales, installation, service & genuine parts. Call +254768860665',
      h1: 'Cummins Generators in {location}'
    },
    powerRange: '7.5kVA - 3500kVA',
    applications: ['Industrial', 'Commercial', 'Data Centers', 'Hospitals', 'Mining'],
    features: [
      'World-class reliability',
      'Fuel efficient engines',
      'Low emissions technology',
      'Remote monitoring capable',
      'Extensive service network',
      'Genuine parts availability'
    ],
    faqs: [
      {
        question: 'Where can I buy Cummins generators in {location}?',
        answer: 'Emerson EIMS is an authorized Cummins dealer in {location}. We supply new Cummins generators from 7.5kVA to 3500kVA with warranty and support.'
      },
      {
        question: 'How much do Cummins generators cost in {location}?',
        answer: 'Cummins generator prices in {location} vary by capacity. Contact us for competitive quotes on new and certified pre-owned Cummins generators.'
      },
      {
        question: 'Do you service Cummins generators in {location}?',
        answer: 'Yes, our Cummins-trained technicians provide maintenance, repairs, and genuine parts for all Cummins generators in {location}.'
      }
    ]
  },
  {
    id: 'perkins',
    slug: 'perkins',
    name: 'Perkins',
    shortName: 'Perkins',
    description: 'British engine manufacturer renowned for reliable and efficient diesel engines',
    country: 'UK',
    founded: 1932,
    keywords: ['perkins generators', 'perkins generator', 'perkins engine', 'perkins genset', 'perkins diesel', 'perkins kenya', 'perkins dealer', 'perkins parts'],
    metaTemplate: {
      title: 'Perkins Generators in {location} | Perkins Generator Supplier Kenya',
      description: 'Perkins generators in {location}. Quality Perkins diesel generators. Sales, service & spare parts. Trusted UK brand. Call +254768860665',
      h1: 'Perkins Generators in {location}'
    },
    powerRange: '6kVA - 2500kVA',
    applications: ['Commercial', 'Industrial', 'Agriculture', 'Telecom', 'Construction'],
    features: [
      'Proven UK engineering',
      'Compact design',
      'Easy maintenance',
      'Wide parts availability',
      'Fuel efficiency',
      'Low operating costs'
    ],
    faqs: [
      {
        question: 'Are Perkins generators reliable in {location}?',
        answer: 'Yes, Perkins generators are renowned for reliability and durability. They are one of the most trusted generator brands in {location} and worldwide.'
      },
      {
        question: 'Where can I get Perkins parts in {location}?',
        answer: 'We stock genuine Perkins spare parts in {location}. Filters, belts, injectors, and all service parts available with fast delivery.'
      },
      {
        question: 'Do you repair Perkins generators in {location}?',
        answer: 'Yes, our technicians are trained to service and repair all Perkins generator models in {location}.'
      }
    ]
  },
  {
    id: 'sdmo',
    slug: 'sdmo',
    name: 'SDMO',
    shortName: 'SDMO',
    description: 'French manufacturer of high-quality generating sets and power solutions',
    country: 'France',
    founded: 1966,
    keywords: ['sdmo generators', 'sdmo generator', 'sdmo genset', 'sdmo power', 'sdmo kenya', 'sdmo dealer', 'kohler sdmo', 'sdmo parts'],
    metaTemplate: {
      title: 'SDMO Generators in {location} | SDMO Generator Dealer Kenya',
      description: 'SDMO generators in {location}. Premium French generators. Residential to industrial power solutions. Sales & service. Call +254768860665',
      h1: 'SDMO Generators in {location}'
    },
    powerRange: '3kVA - 3300kVA',
    applications: ['Residential', 'Commercial', 'Industrial', 'Rental', 'Marine'],
    features: [
      'French engineering quality',
      'Wide product range',
      'Silent versions available',
      'Compact footprint',
      'Advanced controllers',
      'Kohler engines option'
    ],
    faqs: [
      {
        question: 'What makes SDMO generators special in {location}?',
        answer: 'SDMO offers premium French-engineered generators with excellent build quality, reliability, and comprehensive power solutions for all applications.'
      },
      {
        question: 'Do you supply SDMO residential generators in {location}?',
        answer: 'Yes, we supply SDMO home generators from 3kVA in {location}. Silent operation ideal for residential areas.'
      },
      {
        question: 'Where can I service SDMO generators in {location}?',
        answer: 'We provide complete SDMO generator service including maintenance, repairs, and genuine parts in {location}.'
      }
    ]
  },
  {
    id: 'volvo-penta',
    slug: 'volvo-penta',
    name: 'Volvo Penta',
    shortName: 'Volvo Penta',
    description: 'Swedish manufacturer of marine and industrial engines and complete power systems',
    country: 'Sweden',
    founded: 1907,
    keywords: ['volvo penta generators', 'volvo penta generator', 'volvo penta engine', 'volvo penta genset', 'volvo penta kenya', 'volvo penta dealer', 'volvo penta parts'],
    metaTemplate: {
      title: 'Volvo Penta Generators in {location} | Volvo Penta Dealer Kenya',
      description: 'Volvo Penta generators in {location}. Premium Swedish generators for industrial & marine applications. Sales, service & parts. Call +254768860665',
      h1: 'Volvo Penta Generators in {location}'
    },
    powerRange: '85kVA - 700kVA',
    applications: ['Industrial', 'Marine', 'Mining', 'Construction', 'Data Centers'],
    features: [
      'Swedish premium quality',
      'Excellent fuel economy',
      'Low emissions',
      'Long service intervals',
      'Global support network',
      'Proven reliability'
    ],
    faqs: [
      {
        question: 'Why choose Volvo Penta generators in {location}?',
        answer: 'Volvo Penta offers premium Swedish engineering with excellent fuel efficiency, low emissions, and outstanding reliability for demanding applications.'
      },
      {
        question: 'Do you supply Volvo Penta industrial generators in {location}?',
        answer: 'Yes, we supply Volvo Penta industrial generators from 85kVA to 700kVA in {location} with full warranty and support.'
      },
      {
        question: 'Where can I get Volvo Penta parts in {location}?',
        answer: 'We stock genuine Volvo Penta parts and provide authorized service for all Volvo Penta generators in {location}.'
      }
    ]
  },
  {
    id: 'volvo',
    slug: 'volvo',
    name: 'Volvo',
    shortName: 'Volvo',
    description: 'Global Swedish manufacturer known for quality vehicles and industrial engines',
    country: 'Sweden',
    founded: 1927,
    keywords: ['volvo generators', 'volvo generator', 'volvo engine', 'volvo genset', 'volvo kenya', 'volvo power', 'volvo diesel generator'],
    metaTemplate: {
      title: 'Volvo Generators in {location} | Volvo Generator Supplier Kenya',
      description: 'Volvo generators in {location}. Swedish quality diesel generators. Industrial & commercial power solutions. Sales & service. Call +254768860665',
      h1: 'Volvo Generators in {location}'
    },
    powerRange: '100kVA - 800kVA',
    applications: ['Industrial', 'Commercial', 'Construction', 'Mining', 'Agriculture'],
    features: [
      'Swedish engineering',
      'Proven durability',
      'Low fuel consumption',
      'Minimal maintenance',
      'Clean emissions',
      'Long engine life'
    ],
    faqs: [
      {
        question: 'Are Volvo generators available in {location}?',
        answer: 'Yes, we supply Volvo-powered generators in {location}. Known for Swedish quality and exceptional durability.'
      },
      {
        question: 'How reliable are Volvo generators in {location}?',
        answer: 'Volvo generators are highly reliable with excellent fuel efficiency and long service life. Ideal for industrial applications.'
      },
      {
        question: 'Do you service Volvo generators in {location}?',
        answer: 'Yes, we provide complete service support for Volvo generators including maintenance, repairs, and parts in {location}.'
      }
    ]
  },
  {
    id: 'honda',
    slug: 'honda',
    name: 'Honda',
    shortName: 'Honda',
    description: 'Japanese manufacturer famous for reliable small engines and portable generators',
    country: 'Japan',
    founded: 1946,
    keywords: ['honda generators', 'honda generator', 'honda portable generator', 'honda genset', 'honda kenya', 'honda dealer', 'honda inverter generator', 'honda eu series'],
    metaTemplate: {
      title: 'Honda Generators in {location} | Honda Generator Dealer Kenya',
      description: 'Honda generators in {location}. Reliable portable & inverter generators. Genuine Honda products. Sales & service. Call +254768860665',
      h1: 'Honda Generators in {location}'
    },
    powerRange: '1kVA - 10kVA',
    applications: ['Residential', 'Portable', 'Camping', 'Events', 'Small Business'],
    features: [
      'Japanese reliability',
      'Inverter technology',
      'Ultra-quiet operation',
      'Fuel efficient',
      'Lightweight portable',
      'Easy starting'
    ],
    faqs: [
      {
        question: 'Where can I buy Honda generators in {location}?',
        answer: 'We supply genuine Honda generators in {location}. Portable and inverter models available with full Honda warranty.'
      },
      {
        question: 'How quiet are Honda generators?',
        answer: 'Honda inverter generators are among the quietest available. The EU series operates at just 50-60 dB - quieter than normal conversation.'
      },
      {
        question: 'Are Honda generator parts available in {location}?',
        answer: 'Yes, we stock genuine Honda generator parts in {location}. Fast service and support for all Honda models.'
      }
    ]
  },
  {
    id: 'lister-petter',
    slug: 'lister-petter',
    name: 'Lister Petter',
    shortName: 'Lister Petter',
    description: 'British manufacturer of robust diesel engines for demanding environments',
    country: 'UK',
    founded: 1867,
    keywords: ['lister petter generators', 'lister petter generator', 'lister petter engine', 'lister petter genset', 'lister petter kenya', 'lister petter parts', 'lister diesel'],
    metaTemplate: {
      title: 'Lister Petter Generators in {location} | Lister Petter Dealer Kenya',
      description: 'Lister Petter generators in {location}. Robust British diesel generators. Ideal for harsh conditions. Sales, service & parts. Call +254768860665',
      h1: 'Lister Petter Generators in {location}'
    },
    powerRange: '5kVA - 25kVA',
    applications: ['Rural', 'Agriculture', 'Remote Sites', 'Telecom', 'Water Pumping'],
    features: [
      'British engineering heritage',
      'Air & water cooled options',
      'Simple maintenance',
      'Long service life',
      'Robust construction',
      'Multi-fuel capable'
    ],
    faqs: [
      {
        question: 'Are Lister Petter generators good for rural areas in {location}?',
        answer: 'Yes, Lister Petter generators are designed for harsh conditions and remote areas. Simple to maintain and very reliable.'
      },
      {
        question: 'Do you have Lister Petter parts in {location}?',
        answer: 'Yes, we stock Lister Petter parts and provide service support throughout {location}.'
      },
      {
        question: 'What sizes of Lister Petter generators are available?',
        answer: 'We supply Lister Petter generators from 5kVA to 25kVA in {location}. Ideal for small to medium applications.'
      }
    ]
  },
  {
    id: 'doosan',
    slug: 'doosan',
    name: 'Doosan',
    shortName: 'Doosan',
    description: 'South Korean manufacturer of quality industrial engines and power equipment',
    country: 'South Korea',
    founded: 1896,
    keywords: ['doosan generators', 'doosan generator', 'doosan engine', 'doosan genset', 'doosan kenya', 'doosan dealer', 'doosan power', 'doosan infracore'],
    metaTemplate: {
      title: 'Doosan Generators in {location} | Doosan Generator Supplier Kenya',
      description: 'Doosan generators in {location}. Quality Korean diesel generators. Industrial power solutions. Sales & service available. Call +254768860665',
      h1: 'Doosan Generators in {location}'
    },
    powerRange: '60kVA - 700kVA',
    applications: ['Industrial', 'Construction', 'Mining', 'Commercial', 'Marine'],
    features: [
      'Korean quality',
      'Competitive pricing',
      'Reliable performance',
      'Low emissions',
      'Easy maintenance',
      'Growing parts network'
    ],
    faqs: [
      {
        question: 'Are Doosan generators reliable in {location}?',
        answer: 'Yes, Doosan generators offer excellent reliability with Korean engineering quality at competitive prices.'
      },
      {
        question: 'Where can I get Doosan generator service in {location}?',
        answer: 'We provide Doosan generator sales, service, and parts throughout {location}.'
      },
      {
        question: 'What capacity Doosan generators are available?',
        answer: 'We supply Doosan generators from 60kVA to 700kVA in {location} for industrial and commercial applications.'
      }
    ]
  },
  {
    id: 'caterpillar',
    slug: 'caterpillar',
    name: 'Caterpillar',
    shortName: 'CAT',
    description: 'American heavy equipment manufacturer and world leader in power generation',
    country: 'USA',
    founded: 1925,
    keywords: ['caterpillar generators', 'cat generators', 'caterpillar generator', 'cat genset', 'caterpillar kenya', 'cat dealer', 'cat power', 'caterpillar parts'],
    metaTemplate: {
      title: 'Caterpillar Generators in {location} | CAT Generator Dealer Kenya',
      description: 'Caterpillar (CAT) generators in {location}. World-class diesel generators. Industrial & commercial power. Sales, service & parts. Call +254768860665',
      h1: 'Caterpillar Generators in {location}'
    },
    powerRange: '10kVA - 17500kVA',
    applications: ['Industrial', 'Mining', 'Data Centers', 'Hospitals', 'Oil & Gas', 'Power Plants'],
    features: [
      'World-leading brand',
      'Unmatched reliability',
      'Complete power systems',
      'Global service network',
      'Advanced technology',
      'Wide capacity range'
    ],
    faqs: [
      {
        question: 'Why choose Caterpillar generators in {location}?',
        answer: 'Caterpillar offers the widest range and most reliable generators in the world. Industry standard for critical power applications.'
      },
      {
        question: 'Do you supply CAT generators in {location}?',
        answer: 'Yes, we supply and service Caterpillar generators in {location}. From small commercial to large industrial power plants.'
      },
      {
        question: 'Are CAT generator parts available in {location}?',
        answer: 'Yes, genuine Caterpillar parts are available through our service network in {location}.'
      }
    ]
  },
  {
    id: 'iveco',
    slug: 'iveco',
    name: 'Iveco',
    shortName: 'Iveco',
    description: 'Italian manufacturer of commercial vehicles and industrial engines',
    country: 'Italy',
    founded: 1975,
    keywords: ['iveco generators', 'iveco generator', 'iveco engine', 'iveco genset', 'iveco kenya', 'fpt iveco', 'iveco motors'],
    metaTemplate: {
      title: 'Iveco Generators in {location} | Iveco Generator Supplier Kenya',
      description: 'Iveco generators in {location}. Italian quality diesel generators. FPT Iveco engines. Sales & service available. Call +254768860665',
      h1: 'Iveco Generators in {location}'
    },
    powerRange: '30kVA - 500kVA',
    applications: ['Commercial', 'Industrial', 'Telecom', 'Healthcare', 'Hotels'],
    features: [
      'Italian engineering',
      'FPT engines',
      'Efficient performance',
      'Compact design',
      'Low noise levels',
      'Quality build'
    ],
    faqs: [
      {
        question: 'Are Iveco generators available in {location}?',
        answer: 'Yes, we supply Iveco-powered generators in {location}. Italian quality with competitive pricing.'
      },
      {
        question: 'What is FPT Iveco?',
        answer: 'FPT (Fiat Powertrain Technologies) is the engine division of Iveco, producing high-quality industrial diesel engines.'
      },
      {
        question: 'Do you service Iveco generators in {location}?',
        answer: 'Yes, we provide complete service and parts support for Iveco generators in {location}.'
      }
    ]
  },
  {
    id: 'man',
    slug: 'man',
    name: 'MAN',
    shortName: 'MAN',
    description: 'German manufacturer of commercial vehicles and industrial diesel engines',
    country: 'Germany',
    founded: 1758,
    keywords: ['man generators', 'man generator', 'man engine', 'man genset', 'man kenya', 'man diesel', 'man power'],
    metaTemplate: {
      title: 'MAN Generators in {location} | MAN Generator Dealer Kenya',
      description: 'MAN generators in {location}. Premium German diesel generators. Industrial & commercial power solutions. Sales & service. Call +254768860665',
      h1: 'MAN Generators in {location}'
    },
    powerRange: '100kVA - 3000kVA',
    applications: ['Industrial', 'Power Plants', 'Marine', 'Mining', 'Commercial'],
    features: [
      'German precision',
      'Heavy-duty design',
      'Excellent reliability',
      'Low fuel consumption',
      'Long service life',
      'Global support'
    ],
    faqs: [
      {
        question: 'Why choose MAN generators in {location}?',
        answer: 'MAN offers German engineering excellence with heavy-duty generators built for demanding industrial applications.'
      },
      {
        question: 'What capacity MAN generators are available?',
        answer: 'We supply MAN generators from 100kVA to 3000kVA in {location} for industrial and power plant applications.'
      },
      {
        question: 'Do you service MAN engines in {location}?',
        answer: 'Yes, we provide MAN generator service and genuine parts throughout {location}.'
      }
    ]
  },
  {
    id: 'gesan',
    slug: 'gesan',
    name: 'Gesan',
    shortName: 'Gesan',
    description: 'Spanish manufacturer of quality generating sets for global markets',
    country: 'Spain',
    founded: 1987,
    keywords: ['gesan generators', 'gesan generator', 'gesan genset', 'gesan kenya', 'gesan power', 'gesan dealer'],
    metaTemplate: {
      title: 'Gesan Generators in {location} | Gesan Generator Supplier Kenya',
      description: 'Gesan generators in {location}. Quality Spanish generators. Residential to industrial power. Sales & service available. Call +254768860665',
      h1: 'Gesan Generators in {location}'
    },
    powerRange: '5kVA - 2500kVA',
    applications: ['Residential', 'Commercial', 'Industrial', 'Rental', 'Telecom'],
    features: [
      'Spanish quality',
      'Wide product range',
      'Silent versions',
      'Competitive pricing',
      'Reliable performance',
      'Multiple engine options'
    ],
    faqs: [
      {
        question: 'Are Gesan generators reliable in {location}?',
        answer: 'Yes, Gesan offers reliable Spanish-built generators with multiple engine options at competitive prices.'
      },
      {
        question: 'Do you have Gesan silent generators?',
        answer: 'Yes, Gesan offers silent canopy generators ideal for noise-sensitive areas in {location}.'
      },
      {
        question: 'Where can I service Gesan generators in {location}?',
        answer: 'We provide Gesan generator service and support throughout {location}.'
      }
    ]
  },
  {
    id: 'himoinsa',
    slug: 'himoinsa',
    name: 'Himoinsa',
    shortName: 'Himoinsa',
    description: 'Spanish manufacturer specializing in power generation and lighting towers',
    country: 'Spain',
    founded: 1982,
    keywords: ['himoinsa generators', 'himoinsa generator', 'himoinsa genset', 'himoinsa kenya', 'himoinsa dealer', 'himoinsa power', 'himoinsa lighting tower'],
    metaTemplate: {
      title: 'Himoinsa Generators in {location} | Himoinsa Dealer Kenya',
      description: 'Himoinsa generators in {location}. Premium Spanish generators & lighting towers. Sales, rental & service. Call +254768860665',
      h1: 'Himoinsa Generators in {location}'
    },
    powerRange: '3kVA - 3000kVA',
    applications: ['Rental', 'Construction', 'Events', 'Industrial', 'Mining', 'Telecom'],
    features: [
      'Spanish engineering',
      'Rental-ready design',
      'Lighting towers',
      'Hybrid systems',
      'Silent versions',
      'Heavy-duty build'
    ],
    faqs: [
      {
        question: 'Does Himoinsa make rental generators?',
        answer: 'Yes, Himoinsa specializes in rental-ready generators and lighting towers, perfect for events and construction in {location}.'
      },
      {
        question: 'Are Himoinsa generators available in {location}?',
        answer: 'Yes, we supply and service Himoinsa generators and lighting towers throughout {location}.'
      },
      {
        question: 'What makes Himoinsa different?',
        answer: 'Himoinsa offers complete power solutions including generators, lighting towers, and hybrid systems with Spanish quality.'
      }
    ]
  },
  {
    id: 'weichai',
    slug: 'weichai',
    name: 'Weichai',
    shortName: 'Weichai',
    description: 'Chinese manufacturer of diesel engines and power generation equipment',
    country: 'China',
    founded: 1946,
    keywords: ['weichai generators', 'weichai generator', 'weichai engine', 'weichai genset', 'weichai kenya', 'weichai dealer', 'weichai power'],
    metaTemplate: {
      title: 'Weichai Generators in {location} | Weichai Generator Supplier Kenya',
      description: 'Weichai generators in {location}. Reliable Chinese diesel generators. Competitive prices. Sales & service available. Call +254768860665',
      h1: 'Weichai Generators in {location}'
    },
    powerRange: '20kVA - 2000kVA',
    applications: ['Industrial', 'Commercial', 'Construction', 'Marine', 'Agriculture'],
    features: [
      'Competitive pricing',
      'Reliable performance',
      'Wide capacity range',
      'Growing parts network',
      'Improving technology',
      'Value for money'
    ],
    faqs: [
      {
        question: 'Are Weichai generators reliable in {location}?',
        answer: 'Weichai has improved significantly and offers reliable generators at competitive prices. Good value for budget-conscious buyers.'
      },
      {
        question: 'Do you supply Weichai parts in {location}?',
        answer: 'Yes, we stock Weichai generator parts and provide service support in {location}.'
      },
      {
        question: 'What capacity Weichai generators are available?',
        answer: 'We supply Weichai generators from 20kVA to 2000kVA in {location}.'
      }
    ]
  },
  {
    id: 'john-deere',
    slug: 'john-deere',
    name: 'John Deere',
    shortName: 'John Deere',
    description: 'American manufacturer known for agricultural equipment and quality diesel engines',
    country: 'USA',
    founded: 1837,
    keywords: ['john deere generators', 'john deere generator', 'john deere engine', 'john deere genset', 'john deere kenya', 'john deere power'],
    metaTemplate: {
      title: 'John Deere Generators in {location} | John Deere Dealer Kenya',
      description: 'John Deere generators in {location}. Premium American diesel generators. Agricultural & industrial power. Sales & service. Call +254768860665',
      h1: 'John Deere Generators in {location}'
    },
    powerRange: '20kVA - 500kVA',
    applications: ['Agriculture', 'Industrial', 'Commercial', 'Construction', 'Rural'],
    features: [
      'American quality',
      'Agricultural heritage',
      'Reliable engines',
      'Easy maintenance',
      'Global parts network',
      'Proven durability'
    ],
    faqs: [
      {
        question: 'Are John Deere generators good for farms in {location}?',
        answer: 'Yes, John Deere generators are excellent for agricultural applications. Reliable American engines with easy maintenance.'
      },
      {
        question: 'Do you supply John Deere generators in {location}?',
        answer: 'Yes, we supply John Deere-powered generators for agricultural and industrial use in {location}.'
      },
      {
        question: 'Where can I get John Deere parts in {location}?',
        answer: 'We provide John Deere generator parts and service support throughout {location}.'
      }
    ]
  },
  {
    id: 'olympian',
    slug: 'olympian',
    name: 'Olympian',
    shortName: 'Olympian',
    description: 'Part of Caterpillar, offering reliable generator sets for commercial applications',
    country: 'USA',
    founded: 1973,
    keywords: ['olympian generators', 'olympian generator', 'olympian genset', 'olympian kenya', 'olympian cat', 'caterpillar olympian'],
    metaTemplate: {
      title: 'Olympian Generators in {location} | Olympian Generator Dealer Kenya',
      description: 'Olympian generators in {location}. Caterpillar quality at competitive prices. Commercial & industrial power. Sales & service. Call +254768860665',
      h1: 'Olympian Generators in {location}'
    },
    powerRange: '9kVA - 750kVA',
    applications: ['Commercial', 'Industrial', 'Healthcare', 'Hotels', 'Retail'],
    features: [
      'Caterpillar backed',
      'Competitive pricing',
      'Reliable performance',
      'Multiple engine options',
      'Good parts availability',
      'Professional support'
    ],
    faqs: [
      {
        question: 'Is Olympian part of Caterpillar?',
        answer: 'Yes, Olympian is a Caterpillar brand offering quality generators at more accessible price points.'
      },
      {
        question: 'Are Olympian generators reliable in {location}?',
        answer: 'Yes, Olympian generators offer Caterpillar reliability with competitive pricing. Great for commercial applications.'
      },
      {
        question: 'Do you service Olympian generators in {location}?',
        answer: 'Yes, we provide complete Olympian generator service and parts throughout {location}.'
      }
    ]
  },
  {
    id: 'leyland',
    slug: 'leyland',
    name: 'Leyland',
    shortName: 'Leyland',
    description: 'British manufacturer with heritage in commercial vehicles and engines',
    country: 'UK',
    founded: 1896,
    keywords: ['leyland generators', 'leyland generator', 'leyland engine', 'leyland genset', 'leyland kenya', 'leyland diesel', 'ashok leyland generator'],
    metaTemplate: {
      title: 'Leyland Generators in {location} | Leyland Generator Supplier Kenya',
      description: 'Leyland generators in {location}. British heritage diesel generators. Commercial & industrial power. Sales & service. Call +254768860665',
      h1: 'Leyland Generators in {location}'
    },
    powerRange: '15kVA - 500kVA',
    applications: ['Commercial', 'Industrial', 'Agriculture', 'Construction', 'Backup Power'],
    features: [
      'British heritage',
      'Proven reliability',
      'Value pricing',
      'Easy maintenance',
      'Wide parts availability',
      'Robust design'
    ],
    faqs: [
      {
        question: 'Are Leyland generators available in {location}?',
        answer: 'Yes, we supply Leyland generators in {location}. British heritage with proven reliability and competitive pricing.'
      },
      {
        question: 'How reliable are Leyland generators?',
        answer: 'Leyland generators offer good reliability with easy maintenance and readily available parts in {location}.'
      },
      {
        question: 'Do you have Leyland parts in {location}?',
        answer: 'Yes, we stock Leyland generator parts and provide service support throughout {location}.'
      }
    ]
  }
];

/**
 * Get brand by slug
 */
export function getBrandBySlug(slug: string): GeneratorBrand | undefined {
  return GENERATOR_BRANDS.find(brand => brand.slug === slug);
}

/**
 * Get all brand slugs
 */
export function getAllBrandSlugs(): string[] {
  return GENERATOR_BRANDS.map(brand => brand.slug);
}

/**
 * Generate meta title for brand + location
 */
export function generateBrandTitle(brand: GeneratorBrand, locationName: string): string {
  return brand.metaTemplate.title.replace(/{location}/g, locationName);
}

/**
 * Generate meta description for brand + location
 */
export function generateBrandDescription(brand: GeneratorBrand, locationName: string): string {
  return brand.metaTemplate.description.replace(/{location}/g, locationName);
}

/**
 * Generate H1 for brand + location
 */
export function generateBrandH1(brand: GeneratorBrand, locationName: string): string {
  return brand.metaTemplate.h1.replace(/{location}/g, locationName);
}

/**
 * Generate keywords for brand + location
 */
export function generateBrandKeywords(brand: GeneratorBrand, locationName: string): string[] {
  const keywords: string[] = [];

  for (const keyword of brand.keywords) {
    keywords.push(`${keyword} ${locationName}`);
    keywords.push(`${keyword} in ${locationName}`);
    keywords.push(`${locationName} ${keyword}`);
  }

  keywords.push(`${brand.name} ${locationName}`);
  keywords.push(`buy ${brand.name} generator ${locationName}`);
  keywords.push(`${brand.name} dealer ${locationName}`);

  return keywords;
}

/**
 * Generate FAQ items with location substitution
 */
export function generateBrandFAQs(
  brand: GeneratorBrand,
  locationName: string
): Array<{ question: string; answer: string }> {
  return brand.faqs.map(faq => ({
    question: faq.question.replace(/{location}/g, locationName),
    answer: faq.answer.replace(/{location}/g, locationName)
  }));
}

/**
 * Get total brand page potential
 */
export function getBrandPagePotential(): {
  brands: number;
  counties: number;
  totalPages: number;
} {
  const brands = GENERATOR_BRANDS.length;
  const counties = 47;

  return {
    brands,
    counties,
    totalPages: brands * counties + brands // brand pages + brand-location pages
  };
}
