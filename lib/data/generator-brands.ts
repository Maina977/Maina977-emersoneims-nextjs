/**
 * GENERATOR BRANDS SEO DATA
 * 17 major generator brands with SEO metadata for brand-specific pages
 * Generates pages like "Cummins Generators in Nairobi"
 *
 * ─────────────────────────────────────────────────────────────────────────
 * STOCK AND SUPPLY CLAIMS ARE OWNER-CONFIRMED (2026-09-20). DO NOT STRIP.
 * ─────────────────────────────────────────────────────────────────────────
 * Thirty-six of the FAQ answers below state that we stock, supply or service
 * a brand's parts. An audit that day raised all of them, because the parts
 * catalogue behind getEngineIndex() holds engines for three brands only —
 * Cummins, Perkins and Caterpillar — and says nothing about the other
 * fourteen. The owner confirmed the claims are genuine: the catalogue records
 * what has been catalogued, not the limit of what is stocked or sourced.
 *
 * So the absence of a brand from the parts catalogue is NOT evidence against
 * a claim here, and must not be treated as evidence in a future audit. This
 * site has already lost a true figure that way once — the 523+ projects count
 * was deleted as "fabricated" on the strength of a missing record and had to
 * be restored on the owner's word the same day. The same reasoning applied
 * here would delete revenue-bearing claims about fourteen brands.
 *
 * To change one of these, get the owner to say so. Not an audit, not a
 * catalogue lookup.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHAT WE SELL vs WHAT WE SERVICE (owner, 2026-09-21).
 * ─────────────────────────────────────────────────────────────────────────
 * The generators EmersonEIMS sells are VOLTKA, our own brand, powered by
 * Cummins engines, from KES 500,000. For every other make on this list we do
 * maintenance, repairs and parts — not sales.
 *
 * Eleven answers in this file said we supply that brand of generator: SDMO,
 * Volvo Penta, Volvo, Caterpillar, Iveco, Himoinsa, Weichai, John Deere and
 * Leyland among them. Some of that wording was introduced by the 2026-09-20
 * audit itself while replacing quality claims, which is worth recording: an
 * audit that does not know the business can tidy a sentence into a different
 * untrue statement. All eleven now describe service, repair and parts.
 *
 * This does NOT contradict the stock note above. That one is about parts,
 * which the owner confirmed we stock or source across brands. This is about
 * whole generators, which we sell in one brand only. The site already said so
 * in one place before anyone asked: "VOLTKA generators, with servicing and
 * genuine parts for Perkins, Caterpillar, FG Wilson, SDMO and 20+ other
 * brands."
 *
 * The Cummins entry is the one exception and is deliberately worded: the
 * Cummins-powered sets we supply are VOLTKA, and Cummins-branded sets already
 * on a customer site get service and parts like any other make.
 *
 * WHAT THE SAME AUDIT DID CHANGE, and why it was different: the quality
 * claims. Answers asserting that a third-party manufacturer is "renowned for
 * reliability", has "improved significantly", offers "German engineering
 * excellence" or builds "the most reliable generators in the world" were
 * replaced with facts this file can support — country of manufacture, year
 * established, published power range, and for the three brands with a parts
 * catalogue, the engine families in it. Those were ratings of other people's
 * products with nothing behind them, which is a different thing from a
 * statement about our own business that the owner can confirm.
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
      // This template expands across every location page, so the wording here
      // ships hundreds of times. It previously claimed "Authorized Cummins
      // Dealer", which we are not. Supply, service and parts are all true.
      title: 'Cummins Generators in {location} | Supply, Service & Parts',
      description: 'Cummins generators in {location}. Supply, installation, servicing and genuine spare parts, with a mobile workshop covering all 47 counties. Call +254768860665',
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
        // This answer renders BOTH as visible body copy and inside FAQPage
        // schema, so a false claim here is asserted to Google as structured
        // data. It previously opened "EmersonEIMS is an authorized Cummins
        // dealer in {location}" — we are not authorised. Supply, warranty and
        // support are all real and are what a buyer is actually asking about.
        answer: 'EmersonEIMS supplies new Cummins-powered generators in {location} under our own VOLTKA brand, from KES 500,000. For Cummins sets already on site we do maintenance, repairs and genuine parts — we hold a catalogue across eleven Cummins engine families.'
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
    keywords: ['perkins generators', 'perkins generator', 'perkins engine', 'perkins genset', 'perkins diesel', 'perkins kenya', 'perkins repair', 'perkins parts'],
    metaTemplate: {
      title: 'Perkins Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Perkins generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "renowned for reliability ... one of the most trusted brands".
        // Replaced with what we can show: the engine families we actually hold
        // parts for, which is also what a buyer with a running set needs.
        answer: 'Perkins has built diesel engines in the UK since 1932, powering sets from 6kVA to 2500kVA. We hold a parts catalogue across ten Perkins engine families, including the 1104C, 1106C, 3054C, 403C and 404C.'
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
    keywords: ['sdmo generators', 'sdmo generator', 'sdmo genset', 'sdmo power', 'sdmo kenya', 'sdmo repair', 'kohler sdmo', 'sdmo parts'],
    metaTemplate: {
      title: 'SDMO Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'SDMO generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "premium ... excellent build quality, reliability". Unevidenced.
        answer: 'SDMO has built generating sets in France since 1966, with a range from 3kVA to 3300kVA — small standby units through to power-plant scale.'
      },
      {
        question: 'Do you service SDMO residential generators in {location}?',
        answer: 'We maintain, repair and supply parts for SDMO generators in {location}, including the silent canopy sets. The generators we sell are our own VOLTKA brand, Cummins-powered.'
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
    keywords: ['volvo penta generators', 'volvo penta generator', 'volvo penta engine', 'volvo penta genset', 'volvo penta kenya', 'volvo penta repair', 'volvo penta parts'],
    metaTemplate: {
      title: 'Volvo Penta Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Volvo Penta generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "premium ... excellent fuel efficiency ... outstanding
        // reliability". No fuel or emissions figures exist here to support it.
        answer: 'Volvo Penta is the industrial and marine engine arm of Volvo, Swedish-built since 1907. The generator sets it powers run 85kVA to 700kVA.'
      },
      {
        question: 'Do you service Volvo Penta industrial generators in {location}?',
        answer: 'We maintain, repair and supply parts for Volvo Penta industrial sets in {location}, across the 85kVA to 700kVA band they cover. The generators we sell are our own VOLTKA brand, Cummins-powered.'
      },
      {
        question: 'Where can I get Volvo Penta parts in {location}?',
        answer: 'We stock genuine Volvo Penta parts and service all Volvo Penta generators in {location}.'
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
      title: 'Volvo Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Volvo generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Supply claim kept; "Swedish quality and exceptional durability" went.
        answer: 'We service and repair Volvo-powered generators in {location} and supply parts for them. Volvo builds its engines in Sweden and the sets run 100kVA to 800kVA. The generators we sell are our own VOLTKA brand.'
      },
      {
        question: 'How reliable are Volvo generators in {location}?',
        // Was: "highly reliable with excellent fuel efficiency and long service
        // life" — three unevidenced performance claims in one sentence.
        answer: 'Volvo has built diesel engines in Sweden since 1927. The generator sets it powers run 100kVA to 800kVA, which is the industrial and standby band rather than the portable one.'
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
    keywords: ['honda generators', 'honda generator', 'honda portable generator', 'honda genset', 'honda kenya', 'honda repair', 'honda inverter generator', 'honda eu series'],
    metaTemplate: {
      title: 'Honda Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Honda generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        question: 'Do you repair Honda generators in {location}?',
        answer: 'We service and repair Honda portable and inverter generators in {location} and supply parts for them. The generators we sell are our own VOLTKA brand, Cummins-powered.'
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
      title: 'Lister Petter Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Lister Petter generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // "Designed for harsh conditions and remote areas" is a real design
        // brief and stays. "Very reliable" was a rating and went.
        answer: 'Lister Petter has built engines in the UK since 1867, designed for remote and off-grid duty in the 5kVA to 25kVA band, using air-cooled and simple mechanical designs that can be serviced far from a workshop.'
      },
      {
        question: 'Do you have Lister Petter parts in {location}?',
        answer: 'Yes, we stock Lister Petter parts and provide service support throughout {location}.'
      },
      {
        question: 'What sizes of Lister Petter generators are available?',
        answer: 'We service and repair Lister Petter generators in {location}, across the 5kVA to 25kVA band they cover, and supply parts for them.'
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
    keywords: ['doosan generators', 'doosan generator', 'doosan engine', 'doosan genset', 'doosan kenya', 'doosan repair', 'doosan power', 'doosan infracore'],
    metaTemplate: {
      title: 'Doosan Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Doosan generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "excellent reliability with Korean engineering quality at
        // competitive prices" — adjectives, no figures.
        answer: 'Doosan traces to 1896 and builds its engines in South Korea. The generator range runs 60kVA to 700kVA, aimed at industrial and commercial standby.'
      },
      {
        question: 'Where can I get Doosan generator service in {location}?',
        answer: 'We provide Doosan generator sales, service, and parts throughout {location}.'
      },
      {
        question: 'What capacity Doosan generators are available?',
        answer: 'We service and repair Doosan generators in {location}, across the 60kVA to 700kVA band, and supply parts for them.'
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
    keywords: ['caterpillar generators', 'cat generators', 'caterpillar generator', 'cat genset', 'caterpillar kenya', 'cat repair', 'cat power', 'caterpillar parts'],
    metaTemplate: {
      title: 'Caterpillar Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Caterpillar generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "the widest range and most reliable generators in the world".
        // A superlative about a third party with nothing behind it, and a
        // reliability ranking nobody here can evidence. The range figure is
        // checkable against powerRange in this file, so it stays and the
        // ranking goes.
        answer: 'Caterpillar has built engines in the USA since 1925 and its generator range runs 10kVA to 17,500kVA. We maintain and repair Caterpillar sets and hold a parts catalogue for the C6.6 and C7.1 engine families.'
      },
      {
        question: 'Do you service CAT generators in {location}?',
        answer: 'We service, maintain and repair Caterpillar generators in {location}, from small commercial sets to large industrial plant, and supply parts for them. We do not sell Caterpillar-branded generators — the sets we sell are our own VOLTKA brand.'
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
      title: 'Iveco Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Iveco generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Supply claim kept; "Italian quality with competitive pricing" went.
        // The FPT answer below already carries the substantive fact.
        answer: 'We service and repair Iveco-powered generators in {location} and supply parts for them. Iveco builds in Italy and its sets cover 30kVA to 500kVA.'
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
      title: 'MAN Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'MAN generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "German engineering excellence". Replaced with the figures that
        // actually tell a buyer whether MAN is in scope for their load.
        answer: 'MAN has built engines in Germany since 1758. The generator sets it powers start at 100kVA and reach 3000kVA, which puts it in the industrial and power-plant band rather than small standby.'
      },
      {
        question: 'What capacity MAN generators are available?',
        answer: 'We service and repair MAN generators in {location}, from 100kVA to 3000kVA, and supply parts for them.'
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
    keywords: ['gesan generators', 'gesan generator', 'gesan genset', 'gesan kenya', 'gesan power', 'gesan repair'],
    metaTemplate: {
      title: 'Gesan Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Gesan generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "reliable ... at competitive prices". Kept the two checkable
        // facts: where it is built and the band it covers.
        answer: 'Gesan has built generating sets in Spain since 1987, across a 5kVA to 2500kVA range and on several different engine makes depending on the model.'
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
    keywords: ['himoinsa generators', 'himoinsa generator', 'himoinsa genset', 'himoinsa kenya', 'himoinsa repair', 'himoinsa power', 'himoinsa lighting tower'],
    metaTemplate: {
      title: 'Himoinsa Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Himoinsa generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        answer: 'We service, maintain and repair Himoinsa generators and lighting towers throughout {location}, and supply parts for them.'
      },
      {
        question: 'What makes Himoinsa different?',
        // Was: "... with Spanish quality." The product lines are factual; the
        // quality flourish at the end was not.
        answer: 'Himoinsa has built generating sets in Spain since 1982, and its range covers generators from 3kVA to 3000kVA alongside lighting towers and hybrid units.'
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
    keywords: ['weichai generators', 'weichai generator', 'weichai engine', 'weichai genset', 'weichai kenya', 'weichai repair', 'weichai power'],
    metaTemplate: {
      title: 'Weichai Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Weichai generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "has improved significantly ... good value for budget-conscious
        // buyers". Both are opinions about a manufacturer we cannot source.
        answer: 'Weichai has built diesel engines in China since 1946 and is one of the largest engine makers by volume. We service and repair Weichai sets across the 20kVA to 2000kVA range and supply parts for them.'
      },
      {
        question: 'Do you supply Weichai parts in {location}?',
        answer: 'Yes, we stock Weichai generator parts and provide service support in {location}.'
      },
      {
        question: 'What capacity Weichai generators are available?',
        answer: 'We service and repair Weichai generators in {location}, across the 20kVA to 2000kVA range, and supply parts for them.'
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
      title: 'John Deere Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'John Deere generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "excellent for agricultural applications. Reliable American
        // engines with easy maintenance." Kept the agricultural association,
        // which is real, and dropped the ratings.
        answer: 'John Deere has built engines in the USA since 1837 and is long established in agriculture. The generator sets it powers run 20kVA to 500kVA, which covers most farm and light industrial loads.'
      },
      {
        question: 'Do you service John Deere generators in {location}?',
        answer: 'We service and repair John Deere-powered generators for agricultural and industrial use in {location}, and supply parts for them.'
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
      title: 'Olympian Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Olympian generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Was: "Caterpillar reliability with competitive pricing. Great for
        // commercial applications." The Caterpillar ownership is factual and
        // is stated in the answer above; inheriting a reliability rating from
        // it is not.
        answer: 'Olympian sets are built under Caterpillar ownership and run 9kVA to 750kVA, positioned below the Caterpillar-branded range rather than alongside it.'
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
      title: 'Leyland Generator Repair & Spare Parts in {location} | EmersonEIMS',
      description: 'Leyland generator repair, maintenance and genuine spare parts in {location}. Mobile workshop covering all 47 counties. The generators we sell are our own VOLTKA brand, Cummins-powered. Call +254768860665',
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
        // Supply claim kept verbatim — owner-confirmed 2026-09-20, see the
        // STOCK AND SUPPLY note at the head of this file. Only the trailing
        // "proven reliability and competitive pricing" was replaced.
        answer: 'We service, maintain and repair Leyland generators in {location} and supply parts for them. The Leyland engine lineage runs back to 1896 in the UK, and the sets cover 15kVA to 500kVA.'
      },
      {
        question: 'How reliable are Leyland generators?',
        // Parts availability kept — owner-confirmed. "Good reliability" went:
        // it is a rating of a third party with nothing behind it.
        answer: 'Leyland sets use a straightforward mechanical design that most diesel fitters can work on, and we hold parts for them in {location}.'
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
