/**
 * COMPREHENSIVE SEO SYSTEM
 * Dominate search results in Kenya (47 counties, 400 constituencies, 8000 villages)
 * and all East African countries
 */

// Kenya Geographic Data - All 47 Counties
export const KENYA_COUNTIES = [
  // Central Region
  { name: 'Nairobi', code: '047', region: 'Central', population: 4397073, constituencies: ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'] },
  { name: 'Kiambu', code: '022', region: 'Central', population: 2417735, constituencies: ['Gatundu South', 'Gatundu North', 'Juja', 'Thika Town', 'Ruiru', 'Githunguri', 'Kiambu', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari'] },
  { name: 'Murang\'a', code: '021', region: 'Central', population: 1056640, constituencies: ['Kangema', 'Mathioya', 'Kiharu', 'Kigumo', 'Maragwa', 'Kandara', 'Gatanga'] },
  { name: 'Nyeri', code: '036', region: 'Central', population: 759164, constituencies: ['Tetu', 'Kieni', 'Mathira', 'Othaya', 'Mukurweini', 'Nyeri Town'] },
  { name: 'Kirinyaga', code: '020', region: 'Central', population: 610411, constituencies: ['Mwea', 'Gichugu', 'Ndia', 'Kirinyaga Central'] },
  { name: 'Nyandarua', code: '019', region: 'Central', population: 638289, constituencies: ['Kinangop', 'Kipipiri', 'Ol Kalou', 'Ol Jorok', 'Ndaragwa'] },
  
  // Coast Region
  { name: 'Mombasa', code: '001', region: 'Coast', population: 1208333, constituencies: ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'] },
  { name: 'Kilifi', code: '003', region: 'Coast', population: 1453787, constituencies: ['Kilifi North', 'Kilifi South', 'Kaloleni', 'Rabai', 'Ganze', 'Malindi', 'Magarini'] },
  { name: 'Kwale', code: '002', region: 'Coast', population: 866820, constituencies: ['Msambweni', 'Lunga Lunga', 'Matuga', 'Kinango'] },
  { name: 'Taita Taveta', code: '006', region: 'Coast', population: 340671, constituencies: ['Taveta', 'Wundanyi', 'Mwatate', 'Voi'] },
  { name: 'Tana River', code: '004', region: 'Coast', population: 315943, constituencies: ['Garsen', 'Galole', 'Bura'] },
  { name: 'Lamu', code: '005', region: 'Coast', population: 143920, constituencies: ['Lamu East', 'Lamu West'] },
  
  // Eastern Region
  { name: 'Machakos', code: '016', region: 'Eastern', population: 1421932, constituencies: ['Masinga', 'Yatta', 'Kangundo', 'Matungulu', 'Kathiani', 'Mavoko', 'Machakos Town', 'Mwala'] },
  { name: 'Makueni', code: '017', region: 'Eastern', population: 987653, constituencies: ['Makueni', 'Kilome', 'Kaiti', 'Kibwezi West', 'Kibwezi East', 'Mbooni'] },
  { name: 'Kitui', code: '015', region: 'Eastern', population: 1136187, constituencies: ['Mwingi North', 'Mwingi West', 'Mwingi Central', 'Kitui West', 'Kitui Rural', 'Kitui Central', 'Kitui East', 'Kitui South'] },
  { name: 'Embu', code: '014', region: 'Eastern', population: 608599, constituencies: ['Manyatta', 'Runyenjes', 'Mbeere South', 'Mbeere North'] },
  { name: 'Tharaka Nithi', code: '013', region: 'Eastern', population: 393177, constituencies: ['Maara', 'Chuka/Igambang\'ombe', 'Tharaka'] },
  { name: 'Meru', code: '012', region: 'Eastern', population: 1545714, constituencies: ['Igembe South', 'Igembe Central', 'Igembe North', 'Tigania West', 'Tigania East', 'North Imenti', 'Buuri', 'Central Imenti', 'South Imenti'] },
  { name: 'Isiolo', code: '011', region: 'Eastern', population: 268002, constituencies: ['Isiolo North', 'Isiolo South'] },
  
  // Nyanza Region
  { name: 'Kisumu', code: '042', region: 'Nyanza', population: 1155574, constituencies: ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'] },
  { name: 'Siaya', code: '041', region: 'Nyanza', population: 993183, constituencies: ['Ugenya', 'Ugunja', 'Alego Usonga', 'Gem', 'Bondo', 'Rarieda'] },
  { name: 'Homa Bay', code: '043', region: 'Nyanza', population: 1131950, constituencies: ['Kasipul', 'Kabondo Kasipul', 'Karachuonyo', 'Rangwe', 'Homa Bay Town', 'Ndhiwa', 'Suba North', 'Suba South'] },
  { name: 'Kisii', code: '045', region: 'Nyanza', population: 1266860, constituencies: ['Bonchari', 'South Mugirango', 'Bomachoge Borabu', 'Bobasi', 'Bomachoge Chache', 'Nyaribari Masaba', 'Nyaribari Chache', 'Kitutu Chache North', 'Kitutu Chache South'] },
  { name: 'Nyamira', code: '046', region: 'Nyanza', population: 605576, constituencies: ['Kitutu Masaba', 'West Mugirango', 'North Mugirango', 'Borabu'] },
  { name: 'Migori', code: '044', region: 'Nyanza', population: 1116436, constituencies: ['Rongo', 'Awendo', 'Suna East', 'Suna West', 'Uriri', 'Nyatike', 'Kuria West', 'Kuria East'] },
  
  // Rift Valley Region
  { name: 'Nakuru', code: '032', region: 'Rift Valley', population: 2162202, constituencies: ['Molo', 'Njoro', 'Naivasha', 'Gilgil', 'Kuresoi South', 'Kuresoi North', 'Subukia', 'Rongai', 'Bahati', 'Nakuru Town West', 'Nakuru Town East'] },
  { name: 'Narok', code: '033', region: 'Rift Valley', population: 1157873, constituencies: ['Kilgoris', 'Emurua Dikirr', 'Narok North', 'Narok East', 'Narok South', 'Narok West'] },
  { name: 'Kajiado', code: '034', region: 'Rift Valley', population: 1117840, constituencies: ['Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'] },
  { name: 'Kericho', code: '035', region: 'Rift Valley', population: 901777, constituencies: ['Kipkelion East', 'Kipkelion West', 'Ainamoi', 'Bureti', 'Belgut', 'Sigowet/Soin'] },
  { name: 'Bomet', code: '037', region: 'Rift Valley', population: 875689, constituencies: ['Sotik', 'Chepalungu', 'Bomet East', 'Bomet Central', 'Konoin'] },
  { name: 'Uasin Gishu', code: '027', region: 'Rift Valley', population: 1163186, constituencies: ['Soy', 'Turbo', 'Moiben', 'Ainabkoi', 'Kapseret', 'Kesses'] },
  { name: 'Elgeyo Marakwet', code: '028', region: 'Rift Valley', population: 454480, constituencies: ['Marakwet East', 'Marakwet West', 'Keiyo North', 'Keiyo South'] },
  { name: 'Nandi', code: '029', region: 'Rift Valley', population: 885711, constituencies: ['Tinderet', 'Aldai', 'Nandi Hills', 'Chesumei', 'Emgwen', 'Mosop'] },
  { name: 'Baringo', code: '030', region: 'Rift Valley', population: 666763, constituencies: ['Tiaty', 'Baringo North', 'Baringo Central', 'Baringo South', 'Mogotio', 'Eldama Ravine'] },
  { name: 'Laikipia', code: '031', region: 'Rift Valley', population: 518560, constituencies: ['Laikipia West', 'Laikipia East', 'Laikipia North'] },
  { name: 'Samburu', code: '025', region: 'Rift Valley', population: 310327, constituencies: ['Samburu West', 'Samburu North', 'Samburu East'] },
  { name: 'Trans Nzoia', code: '026', region: 'Rift Valley', population: 990341, constituencies: ['Kwanza', 'Endebess', 'Saboti', 'Kiminini', 'Cherangany'] },
  { name: 'Turkana', code: '023', region: 'Rift Valley', population: 926976, constituencies: ['Turkana North', 'Turkana West', 'Turkana Central', 'Loima', 'Turkana South', 'Turkana East'] },
  { name: 'West Pokot', code: '024', region: 'Rift Valley', population: 621241, constituencies: ['Kacheliba', 'Kapenguria', 'Sigor', 'Pokot South'] },
  
  // Western Region
  { name: 'Kakamega', code: '037', region: 'Western', population: 1867579, constituencies: ['Lugari', 'Likuyani', 'Malava', 'Lurambi', 'Navakholo', 'Mumias West', 'Mumias East', 'Matungu', 'Butere', 'Khwisero', 'Shinyalu', 'Ikolomani'] },
  { name: 'Bungoma', code: '039', region: 'Western', population: 1670570, constituencies: ['Mt. Elgon', 'Sirisia', 'Kabuchai', 'Bumula', 'Kanduyi', 'Webuye East', 'Webuye West', 'Kimilili', 'Tongaren'] },
  { name: 'Busia', code: '040', region: 'Western', population: 893681, constituencies: ['Teso North', 'Teso South', 'Nambale', 'Matayos', 'Butula', 'Funyula', 'Budalangi'] },
  { name: 'Vihiga', code: '038', region: 'Western', population: 590013, constituencies: ['Vihiga', 'Sabatia', 'Hamisi', 'Luanda', 'Emuhaya'] },
  
  // North Eastern Region
  { name: 'Garissa', code: '007', region: 'North Eastern', population: 841353, constituencies: ['Garissa Township', 'Balambala', 'Lagdera', 'Dadaab', 'Fafi', 'Ijara'] },
  { name: 'Wajir', code: '008', region: 'North Eastern', population: 781263, constituencies: ['Wajir North', 'Wajir East', 'Tarbaj', 'Wajir West', 'Eldas', 'Wajir South'] },
  { name: 'Mandera', code: '009', region: 'North Eastern', population: 1025756, constituencies: ['Mandera West', 'Banissa', 'Mandera North', 'Mandera South', 'Mandera East', 'Lafey'] },
  { name: 'Marsabit', code: '010', region: 'North Eastern', population: 459785, constituencies: ['Moyale', 'North Horr', 'Saku', 'Laisamis'] }
];

// East African Countries
export const EAST_AFRICAN_COUNTRIES = [
  { name: 'Kenya', code: 'KE', population: 54000000, capital: 'Nairobi', currency: 'KES' },
  { name: 'Tanzania', code: 'TZ', population: 61000000, capital: 'Dodoma', currency: 'TZS' },
  { name: 'Uganda', code: 'UG', population: 47000000, capital: 'Kampala', currency: 'UGX' },
  { name: 'Rwanda', code: 'RW', population: 13000000, capital: 'Kigali', currency: 'RWF' },
  { name: 'Burundi', code: 'BI', population: 12000000, capital: 'Gitega', currency: 'BIF' },
  { name: 'South Sudan', code: 'SS', population: 11000000, capital: 'Juba', currency: 'SSP' },
  { name: 'Ethiopia', code: 'ET', population: 120000000, capital: 'Addis Ababa', currency: 'ETB' },
  { name: 'Somalia', code: 'SO', population: 16000000, capital: 'Mogadishu', currency: 'SOS' }
];

// Service Categories for SEO
export const SERVICE_CATEGORIES = [
  {
    id: 'generators',
    name: 'Generator Services',
    keywords: ['generator', 'genset', 'power generator', 'diesel generator', 'standby power', 'backup generator', 'silent generator', 'industrial generator', 'commercial generator', 'residential generator', 'generator installation', 'generator maintenance', 'generator repair', 'generator hire', 'generator rental', 'generator sales'],
    services: ['Installation', 'Maintenance', 'Repair', 'Hire', 'Sales', 'Servicing', 'Parts'],
    brands: ['Cummins', 'Perkins', 'Caterpillar', 'FG Wilson', 'John Deere', 'Volvo Penta', 'Doosan', 'MTU', 'Yanmar', 'Kohler', 'Generac']
  },
  {
    id: 'solar',
    name: 'Solar Energy Solutions',
    keywords: ['solar', 'solar panels', 'solar power', 'solar system', 'solar installation', 'solar energy', 'photovoltaic', 'PV system', 'solar inverter', 'solar battery', 'off-grid solar', 'grid-tied solar', 'hybrid solar', 'solar water heater', 'solar pump'],
    services: ['Installation', 'Maintenance', 'Repair', 'Design', 'Consultation', 'Battery Replacement'],
    brands: ['SunPower', 'Canadian Solar', 'Jinko Solar', 'Trina Solar', 'JA Solar', 'LONGi Solar']
  },
  {
    id: 'ups',
    name: 'UPS Systems',
    keywords: ['ups', 'uninterruptible power supply', 'battery backup', 'power backup', 'ups installation', 'ups maintenance', 'ups battery', 'online ups', 'offline ups', 'line interactive ups', 'industrial ups', 'data center ups'],
    services: ['Installation', 'Maintenance', 'Battery Replacement', 'Repair', 'Testing'],
    brands: ['APC', 'Eaton', 'Schneider Electric', 'Emerson', 'Vertiv', 'Riello']
  },
  {
    id: 'ac',
    name: 'Air Conditioning',
    keywords: ['ac', 'air conditioning', 'hvac', 'cooling', 'air conditioner', 'split ac', 'central ac', 'ducted ac', 'ac installation', 'ac repair', 'ac maintenance', 'ac servicing', 'chiller', 'vrv', 'vrf'],
    services: ['Installation', 'Repair', 'Maintenance', 'Servicing', 'Gas Refilling'],
    brands: ['Daikin', 'Mitsubishi', 'LG', 'Samsung', 'Carrier', 'Toshiba', 'Panasonic']
  },
  {
    id: 'controls',
    name: 'Generator Controls',
    keywords: ['generator controller', 'deepsea', 'powerwizard', 'control panel', 'automatic controller', 'manual controller', 'ats', 'amf', 'synchronization', 'load sharing', 'plc', 'scada'],
    services: ['Installation', 'Programming', 'Repair', 'Upgrade', 'Commissioning'],
    brands: ['DeepSea Electronics', 'ComAp', 'Smartgen', 'Datakom', 'SICES', 'Woodward']
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    keywords: ['electrician', 'electrical wiring', 'rewiring', 'electrical installation', 'distribution board', 'mdb', 'panel board', 'cable installation', 'earthing', 'lightning protection', 'power factor correction', 'energy audit'],
    services: ['Wiring', 'Rewiring', 'Installation', 'Repair', 'Maintenance', 'Testing', 'Certification'],
    specializations: ['Industrial', 'Commercial', 'Residential', 'Three Phase', 'Single Phase']
  },
  {
    id: 'motor',
    name: 'Motor Services',
    keywords: ['motor rewinding', 'electric motor', 'motor repair', 'motor maintenance', 'single phase motor', 'three phase motor', 'ac motor', 'dc motor', 'induction motor', 'motor installation', 'motor testing'],
    services: ['Rewinding', 'Repair', 'Maintenance', 'Installation', 'Testing', 'Balancing'],
    types: ['Single Phase', 'Three Phase', 'AC Motors', 'DC Motors', 'Submersible']
  },
  {
    id: 'pumps',
    name: 'Water Pump Services',
    keywords: ['water pump', 'borehole pump', 'submersible pump', 'centrifugal pump', 'pump installation', 'pump repair', 'pump maintenance', 'pressure pump', 'booster pump', 'irrigation pump'],
    services: ['Installation', 'Repair', 'Maintenance', 'Testing', 'Replacement'],
    types: ['Submersible', 'Centrifugal', 'Booster', 'Pressure', 'Irrigation']
  },
  {
    id: 'fabrication',
    name: 'Fabrication Services',
    keywords: ['fabrication', 'generator canopy', 'exhaust system', 'mdb fabrication', 'steel fabrication', 'metal work', 'welding', 'custom fabrication'],
    services: ['Canopy Fabrication', 'MDB Fabrication', 'Exhaust Systems', 'Custom Work'],
    materials: ['Steel', 'Aluminum', 'Stainless Steel']
  },
  {
    id: 'automation',
    name: 'Automation & Controls',
    keywords: ['automation', 'plc', 'scada', 'control system', 'building automation', 'industrial automation', 'smart controls', 'remote monitoring', 'iot'],
    services: ['Design', 'Installation', 'Programming', 'Commissioning', 'Support'],
    systems: ['PLC', 'SCADA', 'BMS', 'Remote Monitoring']
  }
];

// SEO Keywords Database
export const SEO_KEYWORDS = {
  primary: [
    'generator installation kenya',
    'solar installation kenya',
    'generator repair kenya',
    'generator maintenance kenya',
    'ups installation kenya',
    'generator hire kenya',
    'solar power kenya',
    'backup power kenya',
    'diesel generator kenya',
    'generator sales kenya'
  ],
  secondary: [
    'best generator company kenya',
    'generator suppliers nairobi',
    'solar company nairobi',
    'generator maintenance service',
    'emergency power backup',
    '24/7 generator service',
    'industrial generator kenya',
    'commercial generator kenya',
    'generator spare parts kenya',
    'generator controller kenya'
  ],
  local: [
    'generator [COUNTY]',
    'solar installation [COUNTY]',
    'generator service [COUNTY]',
    'generator repair [COUNTY]',
    'ups installation [COUNTY]',
    'electrician [COUNTY]',
    'generator company [COUNTY]',
    'solar power [COUNTY]'
  ],
  branded: [
    'cummins generator kenya',
    'perkins generator kenya',
    'caterpillar generator kenya',
    'fg wilson generator kenya',
    'deepsea controller kenya',
    'powerwizard controller kenya',
    'john deere generator kenya',
    'volvo penta generator kenya'
  ],
  long_tail: [
    'where to buy generator in nairobi',
    'generator installation company near me',
    'best generator maintenance service kenya',
    'affordable solar installation kenya',
    'emergency generator repair nairobi',
    'generator spare parts suppliers kenya',
    '24 hour generator service kenya',
    'industrial generator installation kenya',
    'commercial generator maintenance kenya',
    'residential solar installation kenya'
  ]
};

// Generate Location-Specific Keywords
export function generateLocationKeywords(location: string, service: string): string[] {
  return [
    `${service} ${location}`,
    `${service} in ${location}`,
    `${service} ${location} kenya`,
    `best ${service} ${location}`,
    `${service} company ${location}`,
    `${service} service ${location}`,
    `${service} near ${location}`,
    `${service} installation ${location}`,
    `${service} repair ${location}`,
    `${service} maintenance ${location}`,
    `affordable ${service} ${location}`,
    `professional ${service} ${location}`,
    `reliable ${service} ${location}`,
    `24/7 ${service} ${location}`,
    `emergency ${service} ${location}`
  ];
}

// Generate Rich Metadata
export function generateMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  location?: string;
  service?: string;
  canonical?: string;
}) {
  const { title, description, keywords = [], location, service, canonical } = config;
  
  const fullTitle = location 
    ? `${title} in ${location} | Emerson EiMS Kenya`
    : `${title} | Emerson EiMS - Power & Energy Solutions Kenya`;

  const fullDescription = location
    ? `${description} Professional ${service || 'power solutions'} in ${location}, Kenya. 24/7 service, certified engineers, all major brands. Call +254 768 860 655`
    : `${description} Leading power and energy solutions provider in Kenya. Generators, Solar, UPS, Electrical Services across all 47 counties. Call +254 768 860 655`;

  const allKeywords = [
    ...keywords,
    'Emerson EiMS',
    'Kenya power solutions',
    'East Africa energy',
    location ? `${location} kenya` : 'kenya'
  ].join(', ');

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: 'website',
      locale: 'en_KE',
      url: canonical || 'https://www.emersoneims.com',
      siteName: 'Emerson EiMS',
      images: [{
        url: 'https://www.emersoneims.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Emerson EiMS - Power & Energy Solutions Kenya'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      site: '@emersoneims',
      creator: '@emersoneims',
      images: ['https://www.emersoneims.com/twitter-image.jpg']
    },
    alternates: {
      canonical: canonical || 'https://www.emersoneims.com'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Structured Data Generator (Schema.org)
export function generateStructuredData(type: 'Organization' | 'LocalBusiness' | 'Service' | 'Product', data: any): any {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type
  };

  if (type === 'Organization') {
    return {
      ...baseSchema,
      name: 'Emerson EiMS',
      alternateName: 'Emerson Energy & Infrastructure Management Solutions',
      url: 'https://www.emersoneims.com',
      logo: 'https://www.emersoneims.com/logo.png',
      description: 'Leading power and energy solutions provider in Kenya and East Africa',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'P.O. Box 387-00521, Old North Airport Road',
        addressLocality: 'Nairobi',
        addressRegion: 'Nairobi County',
        postalCode: '00521',
        addressCountry: 'KE'
      },
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+254-768-860-655',
        contactType: 'customer service',
        areaServed: ['KE', 'TZ', 'UG', 'RW'],
        availableLanguage: ['en', 'sw']
      }],
      sameAs: [
        'https://www.facebook.com/emersoneims',
        'https://twitter.com/emersoneims',
        'https://www.linkedin.com/company/emersoneims'
      ],
      ...data
    };
  }

  if (type === 'LocalBusiness') {
    return {
      ...baseSchema,
      ...generateStructuredData('Organization', {}),
      '@type': 'LocalBusiness',
      priceRange: 'KES 50,000 - KES 10,000,000',
      openingHours: 'Mo-Su 00:00-24:00',
      telephone: '+254768860655',
      email: 'info@emersoneims.com',
      hasMap: 'https://goo.gl/maps/xxx',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.2921,
        longitude: 36.8219
      },
      areaServed: KENYA_COUNTIES.map(c => ({
        '@type': 'City',
        name: c.name,
        addressCountry: 'KE'
      })),
      ...data
    };
  }

  return { ...baseSchema, ...data };
}
