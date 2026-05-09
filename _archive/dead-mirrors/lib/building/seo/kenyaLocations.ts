/**
 * Kenya Location Database for Hyper-Local SEO
 *
 * Complete coverage of Kenya's administrative divisions:
 * - 47 Counties
 * - 290 Constituencies
 * - Major Towns & Trading Centers
 * - Popular Estates & Neighborhoods
 *
 * This enables SEO dominance for searches like:
 * - "generator company in Westlands"
 * - "solar installation Kilimani"
 * - "generator repair Mombasa Road"
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Location {
  slug: string;
  name: string;
  type: 'county' | 'constituency' | 'town' | 'estate' | 'area';
  parent?: string; // Parent location slug
  coordinates?: { lat: number; lng: number };
  population?: number;
  description?: string;
}

export interface County extends Location {
  type: 'county';
  capital: string;
  constituencies: string[];
  majorTowns: string[];
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  keywords: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES WE OFFER
// ═══════════════════════════════════════════════════════════════════════════════

export const SERVICES: Service[] = [
  {
    slug: 'generators',
    name: 'Generator Sales, Installation & Maintenance',
    shortName: 'Generators',
    description: 'Industrial and commercial diesel generators from Cummins, Perkins, FG Wilson, Caterpillar. Sales, installation, maintenance, and 24/7 emergency repair.',
    keywords: ['generator', 'diesel generator', 'generator repair', 'generator maintenance', 'generator installation', 'standby generator', 'backup power']
  },
  {
    slug: 'solar',
    name: 'Solar Power Systems',
    shortName: 'Solar',
    description: 'Complete solar energy solutions - residential, commercial, and industrial solar panel installation, battery storage, and hybrid systems.',
    keywords: ['solar', 'solar panels', 'solar installation', 'solar power', 'solar energy', 'solar system', 'photovoltaic']
  },
  {
    slug: 'ups',
    name: 'UPS & Power Backup Systems',
    shortName: 'UPS Systems',
    description: 'Uninterruptible Power Supply systems for offices, data centers, hospitals, and critical infrastructure.',
    keywords: ['UPS', 'power backup', 'uninterruptible power supply', 'battery backup', 'APC UPS', 'online UPS']
  },
  {
    slug: 'electrical',
    name: 'Electrical Services',
    shortName: 'Electrical',
    description: 'Complete electrical installations, wiring, panel upgrades, and industrial electrical services.',
    keywords: ['electrical', 'wiring', 'electrical installation', 'electrical repair', 'electrician', 'panel upgrade']
  },
  {
    slug: 'motors',
    name: 'Motor Rewinding & Repair',
    shortName: 'Motors',
    description: 'Electric motor rewinding, repair, and maintenance for industrial and commercial applications.',
    keywords: ['motor rewinding', 'electric motor', 'motor repair', 'industrial motor', 'pump motor']
  },
  {
    slug: 'borehole',
    name: 'Borehole & Water Pumps',
    shortName: 'Borehole',
    description: 'Borehole drilling, submersible pump installation, water pump repair and maintenance.',
    keywords: ['borehole', 'water pump', 'submersible pump', 'borehole drilling', 'pump installation']
  },
  {
    slug: 'ac',
    name: 'Air Conditioning & HVAC',
    shortName: 'AC/HVAC',
    description: 'Air conditioning installation, repair, and maintenance. Commercial and residential HVAC systems.',
    keywords: ['air conditioning', 'AC', 'HVAC', 'AC installation', 'AC repair', 'cooling system']
  },
  {
    slug: 'generator-diagnostics',
    name: 'Generator Diagnostics & Troubleshooting',
    shortName: 'Diagnostics',
    description: 'Advanced generator fault diagnosis, error code reading, ECM programming, and technical support.',
    keywords: ['generator diagnostics', 'fault codes', 'troubleshooting', 'generator repair', 'error codes']
  },
  {
    slug: 'spare-parts',
    name: 'Generator & Solar Spare Parts',
    shortName: 'Spare Parts',
    description: 'Genuine spare parts for generators, solar systems, and electrical equipment. Fast delivery.',
    keywords: ['spare parts', 'generator parts', 'Cummins parts', 'Perkins parts', 'solar parts']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// ALL 47 KENYA COUNTIES WITH CONSTITUENCIES & TOWNS
// ═══════════════════════════════════════════════════════════════════════════════

export const COUNTIES: County[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NAIROBI REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'nairobi',
    name: 'Nairobi',
    type: 'county',
    capital: 'Nairobi City',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    population: 4397073,
    constituencies: [
      'westlands', 'dagoretti-north', 'dagoretti-south', 'langata', 'kibra',
      'roysambu', 'kasarani', 'ruaraka', 'embakasi-south', 'embakasi-north',
      'embakasi-central', 'embakasi-east', 'embakasi-west', 'makadara',
      'kamukunji', 'starehe', 'mathare'
    ],
    majorTowns: [
      'westlands', 'kilimani', 'lavington', 'karen', 'langata', 'south-b', 'south-c',
      'buruburu', 'umoja', 'donholm', 'embakasi', 'industrial-area', 'cbd', 'parklands',
      'spring-valley', 'kileleshwa', 'hurlingham', 'upperhill', 'ngong-road',
      'gigiri', 'runda', 'muthaiga', 'kitisuru', 'loresho', 'mountain-view',
      'zimmerman', 'githurai', 'kahawa', 'ruiru', 'kasarani', 'roysambu',
      'thika-road', 'mombasa-road', 'ngara', 'eastleigh', 'mathare', 'kibera',
      'kawangware', 'kangemi', 'woodley', 'jamhuri', 'ngumo', 'nairobi-west'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COAST REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'mombasa',
    name: 'Mombasa',
    type: 'county',
    capital: 'Mombasa City',
    coordinates: { lat: -4.0435, lng: 39.6682 },
    population: 1208333,
    constituencies: ['changamwe', 'jomvu', 'kisauni', 'nyali', 'likoni', 'mvita'],
    majorTowns: [
      'mombasa-cbd', 'nyali', 'bamburi', 'kisauni', 'likoni', 'changamwe',
      'miritini', 'port-reitz', 'tudor', 'old-town', 'ganjoni', 'kizingo',
      'shimanzi', 'kongowea', 'mtwapa', 'shanzu', 'bombolulu', 'mikindani'
    ]
  },
  {
    slug: 'kilifi',
    name: 'Kilifi',
    type: 'county',
    capital: 'Kilifi',
    coordinates: { lat: -3.6305, lng: 39.8499 },
    population: 1453787,
    constituencies: ['kilifi-north', 'kilifi-south', 'kaloleni', 'rabai', 'ganze', 'malindi', 'magarini'],
    majorTowns: ['kilifi', 'malindi', 'watamu', 'mtwapa', 'mariakani', 'kaloleni', 'mazeras', 'vipingo', 'takaungu']
  },
  {
    slug: 'kwale',
    name: 'Kwale',
    type: 'county',
    capital: 'Kwale',
    coordinates: { lat: -4.1816, lng: 39.4522 },
    population: 866820,
    constituencies: ['msambweni', 'lunga-lunga', 'matuga', 'kinango'],
    majorTowns: ['kwale', 'diani', 'ukunda', 'msambweni', 'shimba-hills', 'kinango', 'lunga-lunga']
  },
  {
    slug: 'taita-taveta',
    name: 'Taita Taveta',
    type: 'county',
    capital: 'Voi',
    coordinates: { lat: -3.3943, lng: 38.5562 },
    population: 340671,
    constituencies: ['taveta', 'wundanyi', 'mwatate', 'voi'],
    majorTowns: ['voi', 'taveta', 'wundanyi', 'mwatate', 'maungu', 'tsavo']
  },
  {
    slug: 'lamu',
    name: 'Lamu',
    type: 'county',
    capital: 'Lamu',
    coordinates: { lat: -2.2686, lng: 40.9020 },
    population: 143920,
    constituencies: ['lamu-east', 'lamu-west'],
    majorTowns: ['lamu', 'mokowe', 'mpeketoni', 'witu', 'hindi', 'faza']
  },
  {
    slug: 'tana-river',
    name: 'Tana River',
    type: 'county',
    capital: 'Hola',
    coordinates: { lat: -1.5000, lng: 40.0300 },
    population: 315943,
    constituencies: ['garsen', 'galole', 'bura'],
    majorTowns: ['hola', 'garsen', 'bura', 'madogo', 'kipini']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CENTRAL REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'kiambu',
    name: 'Kiambu',
    type: 'county',
    capital: 'Kiambu',
    coordinates: { lat: -1.1714, lng: 36.8356 },
    population: 2417735,
    constituencies: [
      'gatundu-south', 'gatundu-north', 'juja', 'thika-town', 'ruiru',
      'githunguri', 'kiambu', 'kiambaa', 'kabete', 'kikuyu', 'limuru', 'lari'
    ],
    majorTowns: [
      'thika', 'ruiru', 'juja', 'kikuyu', 'limuru', 'kiambu', 'githunguri',
      'gatundu', 'karuri', 'ndenderu', 'banana', 'wangige', 'kabete', 'kinoo',
      'zambezi', 'membley', 'kahawa-sukari', 'kamiti', 'kenyatta-road'
    ]
  },
  {
    slug: 'nyeri',
    name: 'Nyeri',
    type: 'county',
    capital: 'Nyeri',
    coordinates: { lat: -0.4197, lng: 36.9553 },
    population: 759164,
    constituencies: ['tetu', 'kieni', 'mathira', 'othaya', 'mukurweini', 'nyeri-town'],
    majorTowns: ['nyeri', 'karatina', 'othaya', 'narumoru', 'mweiga', 'nanyuki', 'mukurweini']
  },
  {
    slug: 'muranga',
    name: "Murang'a",
    type: 'county',
    capital: "Murang'a",
    coordinates: { lat: -0.7839, lng: 37.0400 },
    population: 1056640,
    constituencies: ['kangema', 'mathioya', 'kiharu', 'kigumo', 'maragwa', 'kandara', 'gatanga'],
    majorTowns: ['muranga', 'kenol', 'makuyu', 'sagana', 'maragua', 'kangari', 'kangema']
  },
  {
    slug: 'kirinyaga',
    name: 'Kirinyaga',
    type: 'county',
    capital: 'Kutus',
    coordinates: { lat: -0.5000, lng: 37.3000 },
    population: 610411,
    constituencies: ['mwea', 'gichugu', 'ndia', 'kirinyaga-central'],
    majorTowns: ['kerugoya', 'kutus', 'wanguru', 'kagio', 'sagana', 'kianyaga']
  },
  {
    slug: 'nyandarua',
    name: 'Nyandarua',
    type: 'county',
    capital: 'Ol Kalou',
    coordinates: { lat: -0.2700, lng: 36.3800 },
    population: 638289,
    constituencies: ['kinangop', 'kipipiri', 'ol-kalou', 'ol-jorok', 'ndaragwa'],
    majorTowns: ['ol-kalou', 'engineer', 'njabini', 'south-kinangop', 'ndaragwa']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RIFT VALLEY REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'nakuru',
    name: 'Nakuru',
    type: 'county',
    capital: 'Nakuru',
    coordinates: { lat: -0.3031, lng: 36.0800 },
    population: 2162202,
    constituencies: [
      'molo', 'njoro', 'naivasha', 'gilgil', 'kuresoi-south', 'kuresoi-north',
      'subukia', 'rongai', 'bahati', 'nakuru-town-west', 'nakuru-town-east'
    ],
    majorTowns: [
      'nakuru', 'naivasha', 'gilgil', 'molo', 'njoro', 'rongai', 'bahati',
      'subukia', 'mai-mahiu', 'narok-junction', 'elementaita', 'salgaa'
    ]
  },
  {
    slug: 'uasin-gishu',
    name: 'Uasin Gishu',
    type: 'county',
    capital: 'Eldoret',
    coordinates: { lat: 0.5143, lng: 35.2698 },
    population: 1163186,
    constituencies: ['soy', 'turbo', 'moiben', 'ainabkoi', 'kapseret', 'kesses'],
    majorTowns: ['eldoret', 'burnt-forest', 'turbo', 'moi-bridge', 'ziwa', 'soy']
  },
  {
    slug: 'kericho',
    name: 'Kericho',
    type: 'county',
    capital: 'Kericho',
    coordinates: { lat: -0.3689, lng: 35.2863 },
    population: 901777,
    constituencies: ['ainamoi', 'bureti', 'belgut', 'kipkelion-east', 'kipkelion-west', 'sigowet-soin'],
    majorTowns: ['kericho', 'litein', 'londiani', 'kipkelion', 'sosiot', 'brooke']
  },
  {
    slug: 'bomet',
    name: 'Bomet',
    type: 'county',
    capital: 'Bomet',
    coordinates: { lat: -0.7819, lng: 35.3428 },
    population: 875689,
    constituencies: ['sotik', 'chepalungu', 'bomet-east', 'bomet-central', 'konoin'],
    majorTowns: ['bomet', 'sotik', 'longisa', 'mulot', 'silibwet', 'ndanai']
  },
  {
    slug: 'narok',
    name: 'Narok',
    type: 'county',
    capital: 'Narok',
    coordinates: { lat: -1.0833, lng: 35.8667 },
    population: 1157873,
    constituencies: ['kilgoris', 'emurua-dikirr', 'narok-north', 'narok-east', 'narok-south', 'narok-west'],
    majorTowns: ['narok', 'kilgoris', 'suswa', 'ewaso-nyiro', 'lolgorian', 'ololulunga']
  },
  {
    slug: 'kajiado',
    name: 'Kajiado',
    type: 'county',
    capital: 'Kajiado',
    coordinates: { lat: -1.8500, lng: 36.7833 },
    population: 1117840,
    constituencies: ['kajiado-north', 'kajiado-central', 'kajiado-east', 'kajiado-west', 'kajiado-south'],
    majorTowns: [
      'kajiado', 'ngong', 'ongata-rongai', 'kiserian', 'kitengela', 'athi-river',
      'namanga', 'loitokitok', 'kimana', 'oloitokitok', 'bissil', 'magadi'
    ]
  },
  {
    slug: 'baringo',
    name: 'Baringo',
    type: 'county',
    capital: 'Kabarnet',
    coordinates: { lat: 0.4919, lng: 35.7431 },
    population: 666763,
    constituencies: ['baringo-central', 'baringo-north', 'baringo-south', 'eldama-ravine', 'mogotio', 'tiaty'],
    majorTowns: ['kabarnet', 'eldama-ravine', 'marigat', 'mogotio', 'kabartonjo']
  },
  {
    slug: 'laikipia',
    name: 'Laikipia',
    type: 'county',
    capital: 'Nanyuki',
    coordinates: { lat: 0.0167, lng: 37.0667 },
    population: 518560,
    constituencies: ['laikipia-west', 'laikipia-east', 'laikipia-north'],
    majorTowns: ['nanyuki', 'nyahururu', 'rumuruti', 'doldol', 'kinamba']
  },
  {
    slug: 'trans-nzoia',
    name: 'Trans Nzoia',
    type: 'county',
    capital: 'Kitale',
    coordinates: { lat: 1.0167, lng: 35.0000 },
    population: 990341,
    constituencies: ['kwanza', 'endebess', 'saboti', 'kiminini', 'cherangany'],
    majorTowns: ['kitale', 'kiminini', 'saboti', 'endebess', 'kwanza']
  },
  {
    slug: 'nandi',
    name: 'Nandi',
    type: 'county',
    capital: 'Kapsabet',
    coordinates: { lat: 0.2000, lng: 35.1000 },
    population: 885711,
    constituencies: ['tinderet', 'aldai', 'nandi-hills', 'chesumei', 'emgwen', 'mosop'],
    majorTowns: ['kapsabet', 'nandi-hills', 'mosoriot', 'kobujoi', 'serem']
  },
  {
    slug: 'elgeyo-marakwet',
    name: 'Elgeyo Marakwet',
    type: 'county',
    capital: 'Iten',
    coordinates: { lat: 0.6667, lng: 35.5000 },
    population: 454480,
    constituencies: ['marakwet-east', 'marakwet-west', 'keiyo-north', 'keiyo-south'],
    majorTowns: ['iten', 'kapsowar', 'eldoret', 'tambach', 'chepkorio']
  },
  {
    slug: 'west-pokot',
    name: 'West Pokot',
    type: 'county',
    capital: 'Kapenguria',
    coordinates: { lat: 1.2389, lng: 35.1119 },
    population: 621241,
    constituencies: ['kapenguria', 'sigor', 'kacheliba', 'pokot-south'],
    majorTowns: ['kapenguria', 'makutano', 'chepareria', 'sigor', 'ortum']
  },
  {
    slug: 'turkana',
    name: 'Turkana',
    type: 'county',
    capital: 'Lodwar',
    coordinates: { lat: 3.1167, lng: 35.6000 },
    population: 926976,
    constituencies: ['turkana-north', 'turkana-west', 'turkana-central', 'loima', 'turkana-south', 'turkana-east'],
    majorTowns: ['lodwar', 'kakuma', 'lokichar', 'lokichoggio', 'kalokol', 'lokitaung']
  },
  {
    slug: 'samburu',
    name: 'Samburu',
    type: 'county',
    capital: 'Maralal',
    coordinates: { lat: 1.1000, lng: 36.7000 },
    population: 310327,
    constituencies: ['samburu-west', 'samburu-north', 'samburu-east'],
    majorTowns: ['maralal', 'baragoi', 'wamba', 'archer-post', 'suguta-marmar']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WESTERN REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'kakamega',
    name: 'Kakamega',
    type: 'county',
    capital: 'Kakamega',
    coordinates: { lat: 0.2833, lng: 34.7500 },
    population: 1867579,
    constituencies: [
      'lugari', 'likuyani', 'malava', 'lurambi', 'navakholo', 'mumias-west',
      'mumias-east', 'matungu', 'butere', 'khwisero', 'shinyalu', 'ikolomani'
    ],
    majorTowns: ['kakamega', 'mumias', 'butere', 'malava', 'lugari', 'navakholo']
  },
  {
    slug: 'bungoma',
    name: 'Bungoma',
    type: 'county',
    capital: 'Bungoma',
    coordinates: { lat: 0.5635, lng: 34.5606 },
    population: 1670570,
    constituencies: [
      'mount-elgon', 'sirisia', 'kabuchai', 'bumula', 'kanduyi',
      'webuye-east', 'webuye-west', 'kimilili', 'tongaren'
    ],
    majorTowns: ['bungoma', 'webuye', 'kimilili', 'chwele', 'malakisi', 'kanduyi']
  },
  {
    slug: 'busia',
    name: 'Busia',
    type: 'county',
    capital: 'Busia',
    coordinates: { lat: 0.4608, lng: 34.1108 },
    population: 893681,
    constituencies: ['teso-north', 'teso-south', 'nambale', 'matayos', 'butula', 'funyula', 'budalangi'],
    majorTowns: ['busia', 'malaba', 'nambale', 'port-victoria', 'funyula', 'butula']
  },
  {
    slug: 'vihiga',
    name: 'Vihiga',
    type: 'county',
    capital: 'Mbale',
    coordinates: { lat: 0.0833, lng: 34.7167 },
    population: 590013,
    constituencies: ['vihiga', 'sabatia', 'hamisi', 'luanda', 'emuhaya'],
    majorTowns: ['mbale', 'vihiga', 'luanda', 'chavakali', 'majengo', 'sabatia']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NYANZA REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'kisumu',
    name: 'Kisumu',
    type: 'county',
    capital: 'Kisumu',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    population: 1155574,
    constituencies: ['kisumu-east', 'kisumu-west', 'kisumu-central', 'seme', 'nyando', 'muhoroni', 'nyakach'],
    majorTowns: ['kisumu', 'ahero', 'muhoroni', 'maseno', 'kombewa', 'kondele', 'milimani']
  },
  {
    slug: 'kisii',
    name: 'Kisii',
    type: 'county',
    capital: 'Kisii',
    coordinates: { lat: -0.6817, lng: 34.7667 },
    population: 1266860,
    constituencies: [
      'bonchari', 'south-mugirango', 'bomachoge-borabu', 'bobasi',
      'bomachoge-chache', 'nyaribari-masaba', 'nyaribari-chache', 'kitutu-chache-north', 'kitutu-chache-south'
    ],
    majorTowns: ['kisii', 'ogembo', 'suneka', 'nyamache', 'keroka', 'marani']
  },
  {
    slug: 'nyamira',
    name: 'Nyamira',
    type: 'county',
    capital: 'Nyamira',
    coordinates: { lat: -0.5633, lng: 34.9358 },
    population: 605576,
    constituencies: ['kitutu-masaba', 'west-mugirango', 'north-mugirango', 'borabu'],
    majorTowns: ['nyamira', 'keroka', 'nyansiongo', 'manga', 'ekerenyo']
  },
  {
    slug: 'homa-bay',
    name: 'Homa Bay',
    type: 'county',
    capital: 'Homa Bay',
    coordinates: { lat: -0.5273, lng: 34.4571 },
    population: 1131950,
    constituencies: ['kasipul', 'kabondo-kasipul', 'karachuonyo', 'rangwe', 'homa-bay-town', 'ndhiwa', 'suba-north', 'suba-south'],
    majorTowns: ['homa-bay', 'oyugis', 'kendu-bay', 'mbita', 'ndhiwa', 'rangwe']
  },
  {
    slug: 'migori',
    name: 'Migori',
    type: 'county',
    capital: 'Migori',
    coordinates: { lat: -1.0634, lng: 34.4731 },
    population: 1116436,
    constituencies: ['rongo', 'awendo', 'suna-east', 'suna-west', 'uriri', 'nyatike', 'kuria-west', 'kuria-east'],
    majorTowns: ['migori', 'rongo', 'awendo', 'isebania', 'kehancha', 'muhuru']
  },
  {
    slug: 'siaya',
    name: 'Siaya',
    type: 'county',
    capital: 'Siaya',
    coordinates: { lat: 0.0607, lng: 34.2881 },
    population: 993183,
    constituencies: ['ugenya', 'ugunja', 'alego-usonga', 'gem', 'bondo', 'rarieda'],
    majorTowns: ['siaya', 'bondo', 'ugunja', 'ukwala', 'yala', 'usenge']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTERN REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'machakos',
    name: 'Machakos',
    type: 'county',
    capital: 'Machakos',
    coordinates: { lat: -1.5177, lng: 37.2634 },
    population: 1421932,
    constituencies: ['masinga', 'yatta', 'kangundo', 'matungulu', 'kathiani', 'mavoko', 'machakos-town', 'mwala'],
    majorTowns: ['machakos', 'athi-river', 'mlolongo', 'syokimau', 'kangundo', 'matuu', 'tala', 'wamunyu']
  },
  {
    slug: 'makueni',
    name: 'Makueni',
    type: 'county',
    capital: 'Wote',
    coordinates: { lat: -1.7833, lng: 37.6333 },
    population: 987653,
    constituencies: ['mbooni', 'kilome', 'kaiti', 'makueni', 'kibwezi-west', 'kibwezi-east'],
    majorTowns: ['wote', 'sultan-hamud', 'emali', 'kibwezi', 'makindu', 'mtito-andei']
  },
  {
    slug: 'kitui',
    name: 'Kitui',
    type: 'county',
    capital: 'Kitui',
    coordinates: { lat: -1.3667, lng: 38.0167 },
    population: 1136187,
    constituencies: ['mwingi-north', 'mwingi-west', 'mwingi-central', 'kitui-west', 'kitui-rural', 'kitui-central', 'kitui-east', 'kitui-south'],
    majorTowns: ['kitui', 'mwingi', 'mutomo', 'kyuso', 'migwani', 'nuu']
  },
  {
    slug: 'meru',
    name: 'Meru',
    type: 'county',
    capital: 'Meru',
    coordinates: { lat: 0.0500, lng: 37.6500 },
    population: 1545714,
    constituencies: ['igembe-south', 'igembe-central', 'igembe-north', 'tigania-west', 'tigania-east', 'north-imenti', 'buuri', 'central-imenti', 'south-imenti'],
    majorTowns: ['meru', 'nkubu', 'maua', 'timau', 'chuka', 'laare', 'kianjai']
  },
  {
    slug: 'tharaka-nithi',
    name: 'Tharaka Nithi',
    type: 'county',
    capital: 'Chuka',
    coordinates: { lat: -0.3333, lng: 37.6500 },
    population: 393177,
    constituencies: ['maara', 'chuka-igambangombe', 'tharaka'],
    majorTowns: ['chuka', 'chogoria', 'magutuni', 'kaanwa', 'marimanti']
  },
  {
    slug: 'embu',
    name: 'Embu',
    type: 'county',
    capital: 'Embu',
    coordinates: { lat: -0.5389, lng: 37.4583 },
    population: 608599,
    constituencies: ['manyatta', 'runyenjes', 'mbeere-south', 'mbeere-north'],
    majorTowns: ['embu', 'runyenjes', 'siakago', 'ishiara', 'kiritiri']
  },
  {
    slug: 'isiolo',
    name: 'Isiolo',
    type: 'county',
    capital: 'Isiolo',
    coordinates: { lat: 0.3500, lng: 37.5833 },
    population: 268002,
    constituencies: ['isiolo-north', 'isiolo-south'],
    majorTowns: ['isiolo', 'merti', 'garbatulla', 'kinna', 'modogashe']
  },
  {
    slug: 'marsabit',
    name: 'Marsabit',
    type: 'county',
    capital: 'Marsabit',
    coordinates: { lat: 2.3333, lng: 37.9833 },
    population: 459785,
    constituencies: ['moyale', 'north-horr', 'saku', 'laisamis'],
    majorTowns: ['marsabit', 'moyale', 'laisamis', 'north-horr', 'sololo']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NORTH EASTERN REGION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'garissa',
    name: 'Garissa',
    type: 'county',
    capital: 'Garissa',
    coordinates: { lat: -0.4536, lng: 39.6401 },
    population: 841353,
    constituencies: ['garissa-township', 'balambala', 'lagdera', 'dadaab', 'fafi', 'ijara'],
    majorTowns: ['garissa', 'dadaab', 'balambala', 'modogashe', 'masalani']
  },
  {
    slug: 'wajir',
    name: 'Wajir',
    type: 'county',
    capital: 'Wajir',
    coordinates: { lat: 1.7500, lng: 40.0667 },
    population: 781263,
    constituencies: ['wajir-north', 'wajir-east', 'tarbaj', 'wajir-west', 'eldas', 'wajir-south'],
    majorTowns: ['wajir', 'habaswein', 'griftu', 'bute', 'el-wak']
  },
  {
    slug: 'mandera',
    name: 'Mandera',
    type: 'county',
    capital: 'Mandera',
    coordinates: { lat: 3.9167, lng: 41.8667 },
    population: 867457,
    constituencies: ['mandera-west', 'banissa', 'mandera-north', 'mandera-south', 'mandera-east', 'lafey'],
    majorTowns: ['mandera', 'elwak', 'rhamu', 'takaba', 'banissa']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all locations as flat array for sitemap generation
 */
export function getAllLocations(): Location[] {
  const locations: Location[] = [];

  COUNTIES.forEach(county => {
    // Add county
    locations.push({
      slug: county.slug,
      name: county.name,
      type: 'county',
      coordinates: county.coordinates
    });

    // Add constituencies
    county.constituencies.forEach(constSlug => {
      locations.push({
        slug: constSlug,
        name: constSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: 'constituency',
        parent: county.slug
      });
    });

    // Add major towns
    county.majorTowns.forEach(townSlug => {
      locations.push({
        slug: townSlug,
        name: townSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: 'town',
        parent: county.slug
      });
    });
  });

  return locations;
}

/**
 * Get location by slug
 */
export function getLocationBySlug(slug: string): Location | undefined {
  return getAllLocations().find(loc => loc.slug === slug);
}

/**
 * Get county by slug
 */
export function getCountyBySlug(slug: string): County | undefined {
  return COUNTIES.find(c => c.slug === slug);
}

/**
 * Get all service-location combinations for sitemap
 */
export function getAllServiceLocationPaths(): { service: string; location: string }[] {
  const paths: { service: string; location: string }[] = [];
  const locations = getAllLocations();

  SERVICES.forEach(service => {
    locations.forEach(location => {
      paths.push({
        service: service.slug,
        location: location.slug
      });
    });
  });

  return paths;
}

/**
 * Generate SEO metadata for a service-location page
 */
export function generateLocationSEO(serviceSlug: string, locationSlug: string) {
  const service = SERVICES.find(s => s.slug === serviceSlug);
  const location = getLocationBySlug(locationSlug);
  const county = COUNTIES.find(c =>
    c.slug === locationSlug ||
    c.constituencies.includes(locationSlug) ||
    c.majorTowns.includes(locationSlug)
  );

  if (!service || !location) return null;

  const locationName = location.name;
  const countyName = county?.name || '';

  return {
    title: `${service.shortName} in ${locationName}${county && county.slug !== locationSlug ? `, ${countyName}` : ''} | EmersonEIMS`,
    description: `Professional ${service.name.toLowerCase()} in ${locationName}, Kenya. ${service.description} Serving ${locationName} and surrounding areas. Call +254768860665 for 24/7 service.`,
    keywords: service.keywords.map(kw => `${kw} ${locationName}`),
    h1: `${service.shortName} in ${locationName}`,
    breadcrumbs: [
      { name: 'Home', href: '/' },
      { name: service.shortName, href: `/${service.slug}` },
      ...(county && county.slug !== locationSlug ? [{ name: countyName, href: `/locations/${county.slug}` }] : []),
      { name: locationName, href: `/locations/${locationSlug}/${service.slug}` }
    ]
  };
}

// Total count for reference
export const TOTAL_LOCATIONS = getAllLocations().length;
export const TOTAL_SERVICE_PAGES = TOTAL_LOCATIONS * SERVICES.length;
