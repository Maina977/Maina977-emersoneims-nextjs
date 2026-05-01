/**
 * COMPREHENSIVE KENYA LOCATION DATA
 * All 47 Counties, 290 Constituencies, and Generated Villages
 * For SEO page generation targeting ~127,000+ location-service combinations
 */

export interface Village {
  name: string;
  slug: string;
}

export interface Constituency {
  name: string;
  slug: string;
  villages: Village[];
}

export interface County {
  name: string;
  slug: string;
  code: string;
  region: string;
  population: number;
  constituencies: Constituency[];
}

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Village name patterns for different regions
const VILLAGE_PATTERNS: Record<string, string[]> = {
  Central: ['Estate', 'Village', 'Centre', 'Junction', 'Trading Centre', 'Market', 'Township'],
  Coast: ['Estate', 'Village', 'Town', 'Beach', 'Centre', 'Township', 'Market'],
  Eastern: ['Village', 'Centre', 'Market', 'Township', 'Trading Centre', 'Location'],
  Nyanza: ['Village', 'Centre', 'Market', 'Township', 'Trading Centre', 'Estate'],
  'Rift Valley': ['Estate', 'Village', 'Centre', 'Township', 'Market', 'Trading Centre'],
  Western: ['Village', 'Centre', 'Market', 'Township', 'Trading Centre', 'Estate'],
  'North Eastern': ['Village', 'Town', 'Centre', 'Township', 'Market'],
};

// Generate villages for a constituency based on common patterns
function generateVillages(constituencyName: string, region: string): Village[] {
  const patterns = VILLAGE_PATTERNS[region] || VILLAGE_PATTERNS.Central;
  const baseNames = [
    'Central', 'North', 'South', 'East', 'West', 'Upper', 'Lower',
    'New', 'Old', 'Main', 'Pioneer', 'Unity', 'Progress', 'Modern'
  ];

  const villages: Village[] = [];
  const constituencySlug = generateSlug(constituencyName);

  // Generate 15-25 villages per constituency
  const numVillages = 15 + Math.floor(Math.random() * 10);

  // Add constituency-named villages
  villages.push({ name: `${constituencyName} Central`, slug: `${constituencySlug}-central` });
  villages.push({ name: `${constituencyName} Township`, slug: `${constituencySlug}-township` });
  villages.push({ name: `${constituencyName} Market`, slug: `${constituencySlug}-market` });

  // Generate pattern-based villages
  for (let i = 0; i < numVillages - 3; i++) {
    const baseName = baseNames[i % baseNames.length];
    const pattern = patterns[i % patterns.length];
    const villageName = `${baseName} ${constituencyName} ${pattern}`;
    villages.push({
      name: villageName,
      slug: generateSlug(villageName)
    });
  }

  return villages;
}

// All 47 Kenya Counties with Constituencies and Generated Villages
export const KENYA_LOCATIONS: County[] = [
  // ===== CENTRAL REGION =====
  {
    name: 'Nairobi',
    slug: 'nairobi',
    code: '047',
    region: 'Central',
    population: 4397073,
    constituencies: [
      {
        name: 'Westlands',
        slug: 'westlands',
        villages: [
          { name: 'Parklands', slug: 'parklands' },
          { name: 'Highridge', slug: 'highridge' },
          { name: 'Lavington', slug: 'lavington' },
          { name: 'Kilimani', slug: 'kilimani' },
          { name: 'Kileleshwa', slug: 'kileleshwa' },
          { name: 'Mountain View', slug: 'mountain-view' },
          { name: 'Kangemi', slug: 'kangemi' },
          { name: 'Kitisuru', slug: 'kitisuru' },
          { name: 'Loresho', slug: 'loresho' },
          { name: 'Spring Valley', slug: 'spring-valley' },
          { name: 'Lower Kabete', slug: 'lower-kabete' },
          { name: 'Karura', slug: 'karura' },
          { name: 'Peponi', slug: 'peponi' },
          { name: 'Kyuna', slug: 'kyuna' },
          { name: 'Muthangari', slug: 'muthangari' },
        ]
      },
      {
        name: 'Dagoretti North',
        slug: 'dagoretti-north',
        villages: [
          { name: 'Kilimani', slug: 'kilimani-dagoretti' },
          { name: 'Kawangware', slug: 'kawangware' },
          { name: 'Gatina', slug: 'gatina' },
          { name: 'Kileleshwa', slug: 'kileleshwa-dagoretti' },
          { name: 'Kabiro', slug: 'kabiro' },
          { name: 'Uthiru', slug: 'uthiru' },
          { name: 'Waithaka', slug: 'waithaka' },
          { name: 'Ruthimitu', slug: 'ruthimitu' },
          { name: 'Riruta', slug: 'riruta' },
          { name: 'Ngando', slug: 'ngando' },
          { name: 'Lenana', slug: 'lenana' },
          { name: 'Woodley', slug: 'woodley' },
          { name: 'Adams Arcade', slug: 'adams-arcade' },
          { name: 'Junction', slug: 'junction-dagoretti' },
          { name: 'Hurlingham', slug: 'hurlingham' },
        ]
      },
      {
        name: 'Dagoretti South',
        slug: 'dagoretti-south',
        villages: [
          { name: 'Mutuini', slug: 'mutuini' },
          { name: 'Ngando', slug: 'ngando-south' },
          { name: 'Riruta', slug: 'riruta-south' },
          { name: 'Uthiru', slug: 'uthiru-south' },
          { name: 'Waithaka', slug: 'waithaka-south' },
          { name: 'Karen', slug: 'karen' },
          { name: 'Langata', slug: 'langata-dagoretti' },
          { name: 'Otiende', slug: 'otiende' },
          { name: 'Golf Course', slug: 'golf-course' },
          { name: 'NHC', slug: 'nhc' },
          { name: 'Silanga', slug: 'silanga' },
          { name: 'Satellite', slug: 'satellite' },
          { name: 'Kware', slug: 'kware' },
          { name: 'Githurai', slug: 'githurai-dagoretti' },
          { name: 'Kabete', slug: 'kabete-south' },
        ]
      },
      {
        name: 'Langata',
        slug: 'langata',
        villages: [
          { name: 'Karen', slug: 'karen-langata' },
          { name: 'Nairobi West', slug: 'nairobi-west' },
          { name: 'South C', slug: 'south-c' },
          { name: 'Nyayo Highrise', slug: 'nyayo-highrise' },
          { name: 'Onyonka', slug: 'onyonka' },
          { name: 'Mugumoini', slug: 'mugumoini' },
          { name: 'Madaraka', slug: 'madaraka' },
          { name: 'Hardy', slug: 'hardy' },
          { name: 'Langata South', slug: 'langata-south' },
          { name: 'Bomas', slug: 'bomas' },
          { name: 'Otiende', slug: 'otiende-langata' },
          { name: 'Uhuru Gardens', slug: 'uhuru-gardens' },
          { name: 'Kuwinda', slug: 'kuwinda' },
          { name: 'Corner Baridi', slug: 'corner-baridi' },
          { name: 'Nairobi Dam', slug: 'nairobi-dam' },
        ]
      },
      {
        name: 'Kibra',
        slug: 'kibra',
        villages: [
          { name: 'Kibera', slug: 'kibera' },
          { name: 'Sarangombe', slug: 'sarangombe' },
          { name: 'Woodley', slug: 'woodley-kibra' },
          { name: 'Lindi', slug: 'lindi' },
          { name: 'Makina', slug: 'makina' },
          { name: 'Laini Saba', slug: 'laini-saba' },
          { name: 'Gatwekera', slug: 'gatwekera' },
          { name: 'Kianda', slug: 'kianda' },
          { name: 'Soweto East', slug: 'soweto-east' },
          { name: 'Soweto West', slug: 'soweto-west' },
          { name: 'Olympic', slug: 'olympic' },
          { name: 'Silanga', slug: 'silanga-kibra' },
          { name: 'Mashimoni', slug: 'mashimoni' },
          { name: 'Kambi Muru', slug: 'kambi-muru' },
          { name: 'Ayany', slug: 'ayany' },
        ]
      },
      {
        name: 'Roysambu',
        slug: 'roysambu',
        villages: [
          { name: 'Githurai 44', slug: 'githurai-44' },
          { name: 'Zimmerman', slug: 'zimmerman' },
          { name: 'Roysambu', slug: 'roysambu-village' },
          { name: 'Kahawa West', slug: 'kahawa-west' },
          { name: 'Kahawa Sukari', slug: 'kahawa-sukari' },
          { name: 'Marurui', slug: 'marurui' },
          { name: 'Kasarani', slug: 'kasarani-roysambu' },
          { name: 'Garden Estate', slug: 'garden-estate' },
          { name: 'Mirema', slug: 'mirema' },
          { name: 'Safari Park', slug: 'safari-park' },
          { name: 'Kamiti', slug: 'kamiti' },
          { name: 'Ruaraka', slug: 'ruaraka-roysambu' },
          { name: 'Babadogo', slug: 'babadogo' },
          { name: 'Lucky Summer', slug: 'lucky-summer' },
          { name: 'Sunton', slug: 'sunton' },
        ]
      },
      {
        name: 'Kasarani',
        slug: 'kasarani',
        villages: [
          { name: 'Kasarani', slug: 'kasarani-village' },
          { name: 'Mwiki', slug: 'mwiki' },
          { name: 'Githurai', slug: 'githurai-kasarani' },
          { name: 'Claycity', slug: 'claycity' },
          { name: 'Ruiru', slug: 'ruiru-kasarani' },
          { name: 'Hunters', slug: 'hunters' },
          { name: 'Korogocho', slug: 'korogocho' },
          { name: 'Kariobangi North', slug: 'kariobangi-north' },
          { name: 'Dandora', slug: 'dandora-kasarani' },
          { name: 'Njiru', slug: 'njiru-kasarani' },
          { name: 'Utawala', slug: 'utawala-kasarani' },
          { name: 'Kamulu', slug: 'kamulu-kasarani' },
          { name: 'Seasons', slug: 'seasons' },
          { name: 'Sports View', slug: 'sports-view' },
          { name: 'Thome', slug: 'thome' },
        ]
      },
      {
        name: 'Ruaraka',
        slug: 'ruaraka',
        villages: [
          { name: 'Babadogo', slug: 'babadogo-ruaraka' },
          { name: 'Utalii', slug: 'utalii' },
          { name: 'Mathare North', slug: 'mathare-north' },
          { name: 'Lucky Summer', slug: 'lucky-summer-ruaraka' },
          { name: 'Korogocho', slug: 'korogocho-ruaraka' },
          { name: 'Kariobangi', slug: 'kariobangi' },
          { name: 'Baba Dogo', slug: 'baba-dogo' },
          { name: 'Ngumba', slug: 'ngumba' },
          { name: 'GSU', slug: 'gsu' },
          { name: 'Thome', slug: 'thome-ruaraka' },
          { name: 'Huruma', slug: 'huruma-ruaraka' },
          { name: 'Muthaiga', slug: 'muthaiga-ruaraka' },
          { name: 'Ngara', slug: 'ngara-ruaraka' },
          { name: 'Pangani', slug: 'pangani-ruaraka' },
          { name: 'Eastleigh', slug: 'eastleigh-ruaraka' },
        ]
      },
      {
        name: 'Embakasi South',
        slug: 'embakasi-south',
        villages: [
          { name: 'Imara Daima', slug: 'imara-daima' },
          { name: 'Kwa Njenga', slug: 'kwa-njenga' },
          { name: 'Kwa Reuben', slug: 'kwa-reuben' },
          { name: 'Pipeline', slug: 'pipeline' },
          { name: 'Kware', slug: 'kware-embakasi' },
          { name: 'South B', slug: 'south-b' },
          { name: 'Mukuru Kwa Njenga', slug: 'mukuru-kwa-njenga' },
          { name: 'Mukuru Kwa Reuben', slug: 'mukuru-kwa-reuben' },
          { name: 'Viwandani', slug: 'viwandani' },
          { name: 'Industrial Area', slug: 'industrial-area-south' },
          { name: 'City Cabanas', slug: 'city-cabanas' },
          { name: 'Mariakani', slug: 'mariakani-embakasi' },
          { name: 'Nyayo Estate', slug: 'nyayo-estate' },
          { name: 'Fedha', slug: 'fedha' },
          { name: 'Akiba', slug: 'akiba' },
        ]
      },
      {
        name: 'Embakasi North',
        slug: 'embakasi-north',
        villages: [
          { name: 'Kariobangi South', slug: 'kariobangi-south' },
          { name: 'Dandora Area I', slug: 'dandora-area-i' },
          { name: 'Dandora Area II', slug: 'dandora-area-ii' },
          { name: 'Dandora Area III', slug: 'dandora-area-iii' },
          { name: 'Dandora Area IV', slug: 'dandora-area-iv' },
          { name: 'Kiwanja', slug: 'kiwanja' },
          { name: 'Chokaa', slug: 'chokaa' },
          { name: 'Komarock', slug: 'komarock' },
          { name: 'Kayole', slug: 'kayole' },
          { name: 'Saika', slug: 'saika' },
          { name: 'Mathare', slug: 'mathare-embakasi' },
          { name: 'Huruma', slug: 'huruma-embakasi' },
          { name: 'Mwengenye', slug: 'mwengenye' },
          { name: 'Buruburu', slug: 'buruburu' },
          { name: 'Greenspan', slug: 'greenspan' },
        ]
      },
      {
        name: 'Embakasi Central',
        slug: 'embakasi-central',
        villages: [
          { name: 'Kayole North', slug: 'kayole-north' },
          { name: 'Kayole South', slug: 'kayole-south' },
          { name: 'Kayole Central', slug: 'kayole-central' },
          { name: 'Komarock', slug: 'komarock-central' },
          { name: 'Matopeni', slug: 'matopeni' },
          { name: 'Spring Valley', slug: 'spring-valley-embakasi' },
          { name: 'Mihango', slug: 'mihango' },
          { name: 'Utawala', slug: 'utawala' },
          { name: 'Ruai', slug: 'ruai-central' },
          { name: 'Njiru', slug: 'njiru-central' },
          { name: 'Soweto', slug: 'soweto-embakasi' },
          { name: 'Tena', slug: 'tena' },
          { name: 'Umoja I', slug: 'umoja-i' },
          { name: 'Umoja II', slug: 'umoja-ii' },
          { name: 'Umoja III', slug: 'umoja-iii' },
        ]
      },
      {
        name: 'Embakasi East',
        slug: 'embakasi-east',
        villages: [
          { name: 'Upper Savannah', slug: 'upper-savannah' },
          { name: 'Lower Savannah', slug: 'lower-savannah' },
          { name: 'Embakasi', slug: 'embakasi' },
          { name: 'Utawala', slug: 'utawala-east' },
          { name: 'Mihang\'o', slug: 'mihango-east' },
          { name: 'Ruai', slug: 'ruai' },
          { name: 'Njiru', slug: 'njiru' },
          { name: 'Kamulu', slug: 'kamulu' },
          { name: 'Joska', slug: 'joska' },
          { name: 'Malaa', slug: 'malaa' },
          { name: 'Koma Rock', slug: 'koma-rock' },
          { name: 'Donholm', slug: 'donholm' },
          { name: 'Green Park', slug: 'green-park' },
          { name: 'Tassia', slug: 'tassia' },
          { name: 'Embakasi Village', slug: 'embakasi-village' },
        ]
      },
      {
        name: 'Embakasi West',
        slug: 'embakasi-west',
        villages: [
          { name: 'Umoja I', slug: 'umoja-i-west' },
          { name: 'Umoja II', slug: 'umoja-ii-west' },
          { name: 'Mowlem', slug: 'mowlem' },
          { name: 'Kariobangi South', slug: 'kariobangi-south-west' },
          { name: 'Maringo', slug: 'maringo' },
          { name: 'Hamza', slug: 'hamza' },
          { name: 'Tena Estate', slug: 'tena-estate' },
          { name: 'Mukuru Nyayo', slug: 'mukuru-nyayo' },
          { name: 'Landi Mawe', slug: 'landi-mawe' },
          { name: 'Viwandani', slug: 'viwandani-west' },
          { name: 'Industrial Area', slug: 'industrial-area' },
          { name: 'Enterprise Road', slug: 'enterprise-road' },
          { name: 'Likoni Road', slug: 'likoni-road' },
          { name: 'Jogoo Road', slug: 'jogoo-road' },
          { name: 'Lusaka', slug: 'lusaka' },
        ]
      },
      {
        name: 'Makadara',
        slug: 'makadara',
        villages: [
          { name: 'Maringo', slug: 'maringo-makadara' },
          { name: 'Hamza', slug: 'hamza-makadara' },
          { name: 'Viwandani', slug: 'viwandani-makadara' },
          { name: 'Harambee', slug: 'harambee' },
          { name: 'Makongeni', slug: 'makongeni' },
          { name: 'Pumwani', slug: 'pumwani' },
          { name: 'Eastleigh South', slug: 'eastleigh-south' },
          { name: 'Buruburu', slug: 'buruburu-makadara' },
          { name: 'Jericho', slug: 'jericho' },
          { name: 'Kaloleni', slug: 'kaloleni-makadara' },
          { name: 'Mbotela', slug: 'mbotela' },
          { name: 'Bahati', slug: 'bahati-makadara' },
          { name: 'Shauri Moyo', slug: 'shauri-moyo' },
          { name: 'Ofafa Jericho', slug: 'ofafa-jericho' },
          { name: 'Jerusalem', slug: 'jerusalem' },
        ]
      },
      {
        name: 'Kamukunji',
        slug: 'kamukunji',
        villages: [
          { name: 'Pumwani', slug: 'pumwani-kamukunji' },
          { name: 'Eastleigh North', slug: 'eastleigh-north' },
          { name: 'Eastleigh South', slug: 'eastleigh-south-kamukunji' },
          { name: 'Airbase', slug: 'airbase' },
          { name: 'California', slug: 'california' },
          { name: 'Majengo', slug: 'majengo' },
          { name: 'Bondeni', slug: 'bondeni' },
          { name: 'Biafra', slug: 'biafra' },
          { name: 'Uhuru', slug: 'uhuru' },
          { name: 'Shauri Moyo', slug: 'shauri-moyo-kamukunji' },
          { name: 'Gikomba', slug: 'gikomba' },
          { name: 'Kariokor', slug: 'kariokor' },
          { name: 'Mbui Maitu', slug: 'mbui-maitu' },
          { name: 'Section One', slug: 'section-one' },
          { name: 'Section Two', slug: 'section-two' },
        ]
      },
      {
        name: 'Starehe',
        slug: 'starehe',
        villages: [
          { name: 'Nairobi Central', slug: 'nairobi-central' },
          { name: 'Ngara East', slug: 'ngara-east' },
          { name: 'Ngara West', slug: 'ngara-west' },
          { name: 'Pangani', slug: 'pangani' },
          { name: 'Ziwani', slug: 'ziwani' },
          { name: 'Kariokor', slug: 'kariokor-starehe' },
          { name: 'Huruma', slug: 'huruma' },
          { name: 'Mathare', slug: 'mathare' },
          { name: 'Mabatini', slug: 'mabatini' },
          { name: 'Landmawe', slug: 'landmawe' },
          { name: 'Nairobi South', slug: 'nairobi-south' },
          { name: 'Hospital', slug: 'hospital' },
          { name: 'University', slug: 'university' },
          { name: 'CBD', slug: 'cbd' },
          { name: 'Railway', slug: 'railway' },
        ]
      },
      {
        name: 'Mathare',
        slug: 'mathare',
        villages: [
          { name: 'Hospital', slug: 'hospital-mathare' },
          { name: 'Mabatini', slug: 'mabatini-mathare' },
          { name: 'Huruma', slug: 'huruma-mathare' },
          { name: 'Ngei', slug: 'ngei' },
          { name: 'Mlango Kubwa', slug: 'mlango-kubwa' },
          { name: 'Kiamaiko', slug: 'kiamaiko' },
          { name: 'Mathare 4A', slug: 'mathare-4a' },
          { name: 'Mathare 4B', slug: 'mathare-4b' },
          { name: 'Mathare North', slug: 'mathare-north-mathare' },
          { name: 'Kosovo', slug: 'kosovo' },
          { name: 'Bondeni', slug: 'bondeni-mathare' },
          { name: 'Village 2', slug: 'village-2' },
          { name: 'Village 3', slug: 'village-3' },
          { name: 'Gitathuru', slug: 'gitathuru' },
          { name: 'Kiboro', slug: 'kiboro' },
        ]
      },
    ]
  },
  {
    name: 'Kiambu',
    slug: 'kiambu',
    code: '022',
    region: 'Central',
    population: 2417735,
    constituencies: [
      {
        name: 'Gatundu South',
        slug: 'gatundu-south',
        villages: [
          { name: 'Kiganjo', slug: 'kiganjo' },
          { name: 'Kiamwangi', slug: 'kiamwangi' },
          { name: 'Ndarugu', slug: 'ndarugu' },
          { name: 'Ngenda', slug: 'ngenda' },
          { name: 'Gatundu Township', slug: 'gatundu-township' },
          { name: 'Mangu', slug: 'mangu' },
          { name: 'Kiria-ini', slug: 'kiria-ini' },
          { name: 'Ichaweri', slug: 'ichaweri' },
          { name: 'Kiganjo', slug: 'kiganjo-gs' },
          { name: 'Ngorongo', slug: 'ngorongo' },
          { name: 'Karai', slug: 'karai' },
          { name: 'Gakoe', slug: 'gakoe' },
          { name: 'Nembu', slug: 'nembu' },
          { name: 'Githunguri', slug: 'githunguri-gs' },
          { name: 'Kirwara', slug: 'kirwara' },
        ]
      },
      {
        name: 'Gatundu North',
        slug: 'gatundu-north',
        villages: [
          { name: 'Gituamba', slug: 'gituamba' },
          { name: 'Nyanduma', slug: 'nyanduma' },
          { name: 'Chania', slug: 'chania' },
          { name: 'Mang\'u', slug: 'mangu-north' },
          { name: 'Karemenu', slug: 'karemenu' },
          { name: 'Gathanga', slug: 'gathanga' },
          { name: 'Kiawambogo', slug: 'kiawambogo' },
          { name: 'Kamwangi', slug: 'kamwangi' },
          { name: 'Gatukuyu', slug: 'gatukuyu' },
          { name: 'Kairi', slug: 'kairi' },
          { name: 'Gikindu', slug: 'gikindu' },
          { name: 'Mutomo', slug: 'mutomo' },
          { name: 'Gakuo', slug: 'gakuo' },
          { name: 'Kieni', slug: 'kieni-gn' },
          { name: 'Gitwe', slug: 'gitwe' },
        ]
      },
      {
        name: 'Juja',
        slug: 'juja',
        villages: [
          { name: 'Juja Township', slug: 'juja-township' },
          { name: 'Juja Farm', slug: 'juja-farm' },
          { name: 'Witeithie', slug: 'witeithie' },
          { name: 'Kalimoni', slug: 'kalimoni' },
          { name: 'Komo', slug: 'komo' },
          { name: 'Murera', slug: 'murera' },
          { name: 'Theta', slug: 'theta' },
          { name: 'Membley', slug: 'membley' },
          { name: 'Claycity', slug: 'claycity-juja' },
          { name: 'Gachororo', slug: 'gachororo' },
          { name: 'Kware', slug: 'kware-juja' },
          { name: 'Toll Station', slug: 'toll-station' },
          { name: 'KU', slug: 'ku' },
          { name: 'Weiteithie', slug: 'weiteithie' },
          { name: 'Gatuanyaga', slug: 'gatuanyaga' },
        ]
      },
      {
        name: 'Thika Town',
        slug: 'thika-town',
        villages: [
          { name: 'Thika Township', slug: 'thika-township' },
          { name: 'Makongeni', slug: 'makongeni-thika' },
          { name: 'Kiganjo', slug: 'kiganjo-thika' },
          { name: 'Hospital', slug: 'hospital-thika' },
          { name: 'Jamhuri', slug: 'jamhuri' },
          { name: 'Kamenu', slug: 'kamenu' },
          { name: 'Gatuanyaga', slug: 'gatuanyaga-thika' },
          { name: 'Ngoingwa', slug: 'ngoingwa' },
          { name: 'Kiambu Road', slug: 'kiambu-road' },
          { name: 'Section 9', slug: 'section-9' },
          { name: 'Landless', slug: 'landless' },
          { name: 'Biashara', slug: 'biashara' },
          { name: 'Kiandutu', slug: 'kiandutu' },
          { name: 'Garissa Road', slug: 'garissa-road' },
          { name: 'Blue Post', slug: 'blue-post' },
        ]
      },
      {
        name: 'Ruiru',
        slug: 'ruiru',
        villages: [
          { name: 'Ruiru Township', slug: 'ruiru-township' },
          { name: 'Biashara', slug: 'biashara-ruiru' },
          { name: 'Gitothua', slug: 'gitothua' },
          { name: 'Mwihoko', slug: 'mwihoko' },
          { name: 'Gatongora', slug: 'gatongora' },
          { name: 'Mwiki', slug: 'mwiki-ruiru' },
          { name: 'Kimbo', slug: 'kimbo' },
          { name: 'Kahawa Sukari', slug: 'kahawa-sukari-ruiru' },
          { name: 'Kahawa Wendani', slug: 'kahawa-wendani' },
          { name: 'Membley', slug: 'membley-ruiru' },
          { name: 'Tatu City', slug: 'tatu-city' },
          { name: 'Murera', slug: 'murera-ruiru' },
          { name: 'Bypass', slug: 'bypass' },
          { name: 'Matangi', slug: 'matangi' },
          { name: 'Kiunyu', slug: 'kiunyu' },
        ]
      },
      {
        name: 'Githunguri',
        slug: 'githunguri',
        villages: [
          { name: 'Githunguri Township', slug: 'githunguri-township' },
          { name: 'Githiga', slug: 'githiga' },
          { name: 'Ikinu', slug: 'ikinu' },
          { name: 'Ngewa', slug: 'ngewa' },
          { name: 'Kamburu', slug: 'kamburu' },
          { name: 'Miguta', slug: 'miguta' },
          { name: 'Gathanga', slug: 'gathanga-gi' },
          { name: 'Gitiha', slug: 'gitiha' },
          { name: 'Ngorongo', slug: 'ngorongo-gi' },
          { name: 'Kiganjo', slug: 'kiganjo-gi' },
          { name: 'Ndarugu', slug: 'ndarugu-gi' },
          { name: 'Ting\'ang\'a', slug: 'tinganga' },
          { name: 'Ikinu Market', slug: 'ikinu-market' },
          { name: 'Gakoe', slug: 'gakoe-gi' },
          { name: 'Magomano', slug: 'magomano' },
        ]
      },
      {
        name: 'Kiambu',
        slug: 'kiambu-town',
        villages: [
          { name: 'Kiambu Township', slug: 'kiambu-township' },
          { name: 'Ndumberi', slug: 'ndumberi' },
          { name: 'Riabai', slug: 'riabai' },
          { name: 'Township', slug: 'township-kiambu' },
          { name: 'Ting\'ang\'a', slug: 'tinganga-kiambu' },
          { name: 'Karuri', slug: 'karuri' },
          { name: 'Cianda', slug: 'cianda' },
          { name: 'Banana', slug: 'banana' },
          { name: 'Muchatha', slug: 'muchatha' },
          { name: 'Kihara', slug: 'kihara' },
          { name: 'Ngegu', slug: 'ngegu' },
          { name: 'Ndenderu', slug: 'ndenderu' },
          { name: 'Thindigua', slug: 'thindigua' },
          { name: 'Ruaka', slug: 'ruaka' },
          { name: 'Two Rivers', slug: 'two-rivers' },
        ]
      },
      {
        name: 'Kiambaa',
        slug: 'kiambaa',
        villages: [
          { name: 'Cianda', slug: 'cianda-ka' },
          { name: 'Ndenderu', slug: 'ndenderu-ka' },
          { name: 'Muchatha', slug: 'muchatha-ka' },
          { name: 'Kihara', slug: 'kihara-ka' },
          { name: 'Banana', slug: 'banana-ka' },
          { name: 'Ruaka', slug: 'ruaka-ka' },
          { name: 'Karuri', slug: 'karuri-ka' },
          { name: 'Kanunga', slug: 'kanunga' },
          { name: 'Gitaru', slug: 'gitaru' },
          { name: 'Lusigetti', slug: 'lusigetti' },
          { name: 'Kinoo', slug: 'kinoo' },
          { name: 'Muguga', slug: 'muguga' },
          { name: 'Sigona', slug: 'sigona' },
          { name: 'Kabete', slug: 'kabete' },
          { name: 'Wangige', slug: 'wangige' },
        ]
      },
      {
        name: 'Kabete',
        slug: 'kabete',
        villages: [
          { name: 'Gitaru', slug: 'gitaru-kb' },
          { name: 'Muguga', slug: 'muguga-kb' },
          { name: 'Nyadhuna', slug: 'nyadhuna' },
          { name: 'Kabete', slug: 'kabete-kb' },
          { name: 'Uthiru', slug: 'uthiru-kb' },
          { name: 'Kinoo', slug: 'kinoo-kb' },
          { name: 'Kamburu', slug: 'kamburu-kb' },
          { name: 'Wangige', slug: 'wangige-kb' },
          { name: 'Nyathuna', slug: 'nyathuna' },
          { name: 'Kerwa', slug: 'kerwa' },
          { name: 'Kangemi', slug: 'kangemi-kb' },
          { name: 'Mountain View', slug: 'mountain-view-kb' },
          { name: 'Spring Valley', slug: 'spring-valley-kb' },
          { name: 'Rironi', slug: 'rironi' },
          { name: 'Kikuyu', slug: 'kikuyu-kb' },
        ]
      },
      {
        name: 'Kikuyu',
        slug: 'kikuyu',
        villages: [
          { name: 'Kikuyu Township', slug: 'kikuyu-township' },
          { name: 'Karai', slug: 'karai-kk' },
          { name: 'Nachu', slug: 'nachu' },
          { name: 'Sigona', slug: 'sigona-kk' },
          { name: 'Kinoo', slug: 'kinoo-kk' },
          { name: 'Muguga', slug: 'muguga-kk' },
          { name: 'Zambezi', slug: 'zambezi' },
          { name: 'Gitaru', slug: 'gitaru-kk' },
          { name: 'Kerwa', slug: 'kerwa-kk' },
          { name: 'Rironi', slug: 'rironi-kk' },
          { name: 'Thogoto', slug: 'thogoto' },
          { name: 'Gikambura', slug: 'gikambura' },
          { name: 'Nderi', slug: 'nderi' },
          { name: 'Kidfarmaco', slug: 'kidfarmaco' },
          { name: 'Dagoretti Corner', slug: 'dagoretti-corner' },
        ]
      },
      {
        name: 'Limuru',
        slug: 'limuru',
        villages: [
          { name: 'Limuru Township', slug: 'limuru-township' },
          { name: 'Ndeiya', slug: 'ndeiya' },
          { name: 'Bibirioni', slug: 'bibirioni' },
          { name: 'Ngecha', slug: 'ngecha' },
          { name: 'Rironi', slug: 'rironi-lm' },
          { name: 'Tigoni', slug: 'tigoni' },
          { name: 'Ngarariga', slug: 'ngarariga' },
          { name: 'Kamirithu', slug: 'kamirithu' },
          { name: 'Thigio', slug: 'thigio' },
          { name: 'Banana Hill', slug: 'banana-hill-lm' },
          { name: 'Kentmere', slug: 'kentmere' },
          { name: 'Nazareth', slug: 'nazareth' },
          { name: 'Kiambu Road', slug: 'kiambu-road-lm' },
          { name: 'Loreto', slug: 'loreto' },
          { name: 'Ruaka', slug: 'ruaka-lm' },
        ]
      },
      {
        name: 'Lari',
        slug: 'lari',
        villages: [
          { name: 'Lari Township', slug: 'lari-township' },
          { name: 'Kijabe', slug: 'kijabe' },
          { name: 'Kamburu', slug: 'kamburu-lr' },
          { name: 'Kinale', slug: 'kinale' },
          { name: 'Nyanduma', slug: 'nyanduma-lr' },
          { name: 'Kereita', slug: 'kereita' },
          { name: 'Kagwe', slug: 'kagwe' },
          { name: 'Gatamaiyu', slug: 'gatamaiyu' },
          { name: 'Escarpment', slug: 'escarpment' },
          { name: 'Mai Mahiu', slug: 'mai-mahiu' },
          { name: 'Kamandura', slug: 'kamandura' },
          { name: 'Mutarakwa', slug: 'mutarakwa' },
          { name: 'Gathanga', slug: 'gathanga-lr' },
          { name: 'Gichuru', slug: 'gichuru' },
          { name: 'Githirioni', slug: 'githirioni' },
        ]
      },
    ]
  },
  {
    name: 'Muranga',
    slug: 'muranga',
    code: '021',
    region: 'Central',
    population: 1056640,
    constituencies: [
      {
        name: 'Kangema',
        slug: 'kangema',
        villages: generateVillages('Kangema', 'Central')
      },
      {
        name: 'Mathioya',
        slug: 'mathioya',
        villages: generateVillages('Mathioya', 'Central')
      },
      {
        name: 'Kiharu',
        slug: 'kiharu',
        villages: generateVillages('Kiharu', 'Central')
      },
      {
        name: 'Kigumo',
        slug: 'kigumo',
        villages: generateVillages('Kigumo', 'Central')
      },
      {
        name: 'Maragwa',
        slug: 'maragwa',
        villages: generateVillages('Maragwa', 'Central')
      },
      {
        name: 'Kandara',
        slug: 'kandara',
        villages: generateVillages('Kandara', 'Central')
      },
      {
        name: 'Gatanga',
        slug: 'gatanga',
        villages: generateVillages('Gatanga', 'Central')
      },
    ]
  },
  {
    name: 'Nyeri',
    slug: 'nyeri',
    code: '036',
    region: 'Central',
    population: 759164,
    constituencies: [
      {
        name: 'Tetu',
        slug: 'tetu',
        villages: generateVillages('Tetu', 'Central')
      },
      {
        name: 'Kieni',
        slug: 'kieni',
        villages: generateVillages('Kieni', 'Central')
      },
      {
        name: 'Mathira',
        slug: 'mathira',
        villages: generateVillages('Mathira', 'Central')
      },
      {
        name: 'Othaya',
        slug: 'othaya',
        villages: generateVillages('Othaya', 'Central')
      },
      {
        name: 'Mukurweini',
        slug: 'mukurweini',
        villages: generateVillages('Mukurweini', 'Central')
      },
      {
        name: 'Nyeri Town',
        slug: 'nyeri-town',
        villages: generateVillages('Nyeri Town', 'Central')
      },
    ]
  },
  {
    name: 'Kirinyaga',
    slug: 'kirinyaga',
    code: '020',
    region: 'Central',
    population: 610411,
    constituencies: [
      {
        name: 'Mwea',
        slug: 'mwea',
        villages: generateVillages('Mwea', 'Central')
      },
      {
        name: 'Gichugu',
        slug: 'gichugu',
        villages: generateVillages('Gichugu', 'Central')
      },
      {
        name: 'Ndia',
        slug: 'ndia',
        villages: generateVillages('Ndia', 'Central')
      },
      {
        name: 'Kirinyaga Central',
        slug: 'kirinyaga-central',
        villages: generateVillages('Kirinyaga Central', 'Central')
      },
    ]
  },
  {
    name: 'Nyandarua',
    slug: 'nyandarua',
    code: '019',
    region: 'Central',
    population: 638289,
    constituencies: [
      {
        name: 'Kinangop',
        slug: 'kinangop',
        villages: generateVillages('Kinangop', 'Central')
      },
      {
        name: 'Kipipiri',
        slug: 'kipipiri',
        villages: generateVillages('Kipipiri', 'Central')
      },
      {
        name: 'Ol Kalou',
        slug: 'ol-kalou',
        villages: generateVillages('Ol Kalou', 'Central')
      },
      {
        name: 'Ol Jorok',
        slug: 'ol-jorok',
        villages: generateVillages('Ol Jorok', 'Central')
      },
      {
        name: 'Ndaragwa',
        slug: 'ndaragwa',
        villages: generateVillages('Ndaragwa', 'Central')
      },
    ]
  },

  // ===== COAST REGION =====
  {
    name: 'Mombasa',
    slug: 'mombasa',
    code: '001',
    region: 'Coast',
    population: 1208333,
    constituencies: [
      {
        name: 'Changamwe',
        slug: 'changamwe',
        villages: [
          { name: 'Changamwe', slug: 'changamwe-village' },
          { name: 'Port Reitz', slug: 'port-reitz' },
          { name: 'Kipevu', slug: 'kipevu' },
          { name: 'Airport', slug: 'airport-msa' },
          { name: 'Miritini', slug: 'miritini' },
          { name: 'Chaani', slug: 'chaani' },
          { name: 'Mikindani', slug: 'mikindani' },
          { name: 'Jomvu Kuu', slug: 'jomvu-kuu' },
          { name: 'Magongo', slug: 'magongo' },
          { name: 'Industrial Area', slug: 'industrial-area-msa' },
          { name: 'Shimanzi', slug: 'shimanzi' },
          { name: 'Mbaraki', slug: 'mbaraki' },
          { name: 'Ganjoni', slug: 'ganjoni' },
          { name: 'Tudor', slug: 'tudor' },
          { name: 'Makupa', slug: 'makupa' },
        ]
      },
      {
        name: 'Jomvu',
        slug: 'jomvu',
        villages: [
          { name: 'Jomvu', slug: 'jomvu-village' },
          { name: 'Miritini', slug: 'miritini-jomvu' },
          { name: 'Mikindani', slug: 'mikindani-jomvu' },
          { name: 'Magongo', slug: 'magongo-jomvu' },
          { name: 'Mishomoroni', slug: 'mishomoroni' },
          { name: 'Majengo', slug: 'majengo-msa' },
          { name: 'Bangladesh', slug: 'bangladesh' },
          { name: 'Kibarani', slug: 'kibarani' },
          { name: 'Kwa Shee', slug: 'kwa-shee' },
          { name: 'Morocco', slug: 'morocco' },
          { name: 'VOK', slug: 'vok' },
          { name: 'Mwembe Tayari', slug: 'mwembe-tayari' },
          { name: 'Tudor', slug: 'tudor-jomvu' },
          { name: 'Changamwe', slug: 'changamwe-jomvu' },
          { name: 'Kiziwi', slug: 'kiziwi' },
        ]
      },
      {
        name: 'Kisauni',
        slug: 'kisauni',
        villages: [
          { name: 'Kisauni', slug: 'kisauni-village' },
          { name: 'Kongowea', slug: 'kongowea' },
          { name: 'Bamburi', slug: 'bamburi' },
          { name: 'Mkomani', slug: 'mkomani' },
          { name: 'Shanzu', slug: 'shanzu' },
          { name: 'Mtopanga', slug: 'mtopanga' },
          { name: 'Magogoni', slug: 'magogoni' },
          { name: 'Junda', slug: 'junda' },
          { name: 'Mjambere', slug: 'mjambere' },
          { name: 'Bombolulu', slug: 'bombolulu' },
          { name: 'Utange', slug: 'utange' },
          { name: 'Kadzandani', slug: 'kadzandani' },
          { name: 'Mishomoroni', slug: 'mishomoroni-kisauni' },
          { name: 'Maweni', slug: 'maweni' },
          { name: 'Kenya Re', slug: 'kenya-re' },
        ]
      },
      {
        name: 'Nyali',
        slug: 'nyali',
        villages: [
          { name: 'Nyali', slug: 'nyali-village' },
          { name: 'Frere Town', slug: 'frere-town' },
          { name: 'Ziwa la Ng\'ombe', slug: 'ziwa-la-ngombe' },
          { name: 'Mkomani', slug: 'mkomani-nyali' },
          { name: 'Kongowea', slug: 'kongowea-nyali' },
          { name: 'Kizingo', slug: 'kizingo' },
          { name: 'Greenwood', slug: 'greenwood' },
          { name: 'Links Road', slug: 'links-road' },
          { name: 'Reef Hotel', slug: 'reef-hotel' },
          { name: 'Bamburi Beach', slug: 'bamburi-beach' },
          { name: 'Voyager', slug: 'voyager' },
          { name: 'Mtwapa', slug: 'mtwapa' },
          { name: 'English Point', slug: 'english-point' },
          { name: 'Ratna', slug: 'ratna' },
          { name: 'Kenyatta Beach', slug: 'kenyatta-beach' },
        ]
      },
      {
        name: 'Likoni',
        slug: 'likoni',
        villages: [
          { name: 'Likoni', slug: 'likoni-village' },
          { name: 'Mtongwe', slug: 'mtongwe' },
          { name: 'Shika Adabu', slug: 'shika-adabu' },
          { name: 'Bofu', slug: 'bofu' },
          { name: 'Timbwani', slug: 'timbwani' },
          { name: 'Mrima', slug: 'mrima' },
          { name: 'Kwa Bulo', slug: 'kwa-bulo' },
          { name: 'Mwandimu', slug: 'mwandimu' },
          { name: 'Mshomoroni', slug: 'mshomoroni' },
          { name: 'Ferry', slug: 'ferry' },
          { name: 'Shelley Beach', slug: 'shelley-beach' },
          { name: 'Diani', slug: 'diani-likoni' },
          { name: 'KPA', slug: 'kpa' },
          { name: 'BuruBuru', slug: 'buruburu-likoni' },
          { name: 'Vyemani', slug: 'vyemani' },
        ]
      },
      {
        name: 'Mvita',
        slug: 'mvita',
        villages: [
          { name: 'Old Town', slug: 'old-town' },
          { name: 'Mji wa Kale', slug: 'mji-wa-kale' },
          { name: 'Tononoka', slug: 'tononoka' },
          { name: 'Tudor', slug: 'tudor-mvita' },
          { name: 'Majengo', slug: 'majengo-mvita' },
          { name: 'Bondeni', slug: 'bondeni-msa' },
          { name: 'Ganjoni', slug: 'ganjoni-mvita' },
          { name: 'Makadara', slug: 'makadara-msa' },
          { name: 'Railway', slug: 'railway-msa' },
          { name: 'Shimanzi', slug: 'shimanzi-mvita' },
          { name: 'Makupa', slug: 'makupa-mvita' },
          { name: 'CBD', slug: 'cbd-msa' },
          { name: 'Fort Jesus', slug: 'fort-jesus' },
          { name: 'Lighthouse', slug: 'lighthouse' },
          { name: 'Mbaraki', slug: 'mbaraki-mvita' },
        ]
      },
    ]
  },
  {
    name: 'Kilifi',
    slug: 'kilifi',
    code: '003',
    region: 'Coast',
    population: 1453787,
    constituencies: [
      {
        name: 'Kilifi North',
        slug: 'kilifi-north',
        villages: generateVillages('Kilifi North', 'Coast')
      },
      {
        name: 'Kilifi South',
        slug: 'kilifi-south',
        villages: generateVillages('Kilifi South', 'Coast')
      },
      {
        name: 'Kaloleni',
        slug: 'kaloleni',
        villages: generateVillages('Kaloleni', 'Coast')
      },
      {
        name: 'Rabai',
        slug: 'rabai',
        villages: generateVillages('Rabai', 'Coast')
      },
      {
        name: 'Ganze',
        slug: 'ganze',
        villages: generateVillages('Ganze', 'Coast')
      },
      {
        name: 'Malindi',
        slug: 'malindi',
        villages: generateVillages('Malindi', 'Coast')
      },
      {
        name: 'Magarini',
        slug: 'magarini',
        villages: generateVillages('Magarini', 'Coast')
      },
    ]
  },
  {
    name: 'Kwale',
    slug: 'kwale',
    code: '002',
    region: 'Coast',
    population: 866820,
    constituencies: [
      {
        name: 'Msambweni',
        slug: 'msambweni',
        villages: generateVillages('Msambweni', 'Coast')
      },
      {
        name: 'Lunga Lunga',
        slug: 'lunga-lunga',
        villages: generateVillages('Lunga Lunga', 'Coast')
      },
      {
        name: 'Matuga',
        slug: 'matuga',
        villages: generateVillages('Matuga', 'Coast')
      },
      {
        name: 'Kinango',
        slug: 'kinango',
        villages: generateVillages('Kinango', 'Coast')
      },
    ]
  },
  {
    name: 'Taita Taveta',
    slug: 'taita-taveta',
    code: '006',
    region: 'Coast',
    population: 340671,
    constituencies: [
      {
        name: 'Taveta',
        slug: 'taveta',
        villages: generateVillages('Taveta', 'Coast')
      },
      {
        name: 'Wundanyi',
        slug: 'wundanyi',
        villages: generateVillages('Wundanyi', 'Coast')
      },
      {
        name: 'Mwatate',
        slug: 'mwatate',
        villages: generateVillages('Mwatate', 'Coast')
      },
      {
        name: 'Voi',
        slug: 'voi',
        villages: generateVillages('Voi', 'Coast')
      },
    ]
  },
  {
    name: 'Tana River',
    slug: 'tana-river',
    code: '004',
    region: 'Coast',
    population: 315943,
    constituencies: [
      {
        name: 'Garsen',
        slug: 'garsen',
        villages: generateVillages('Garsen', 'Coast')
      },
      {
        name: 'Galole',
        slug: 'galole',
        villages: generateVillages('Galole', 'Coast')
      },
      {
        name: 'Bura',
        slug: 'bura',
        villages: generateVillages('Bura', 'Coast')
      },
    ]
  },
  {
    name: 'Lamu',
    slug: 'lamu',
    code: '005',
    region: 'Coast',
    population: 143920,
    constituencies: [
      {
        name: 'Lamu East',
        slug: 'lamu-east',
        villages: generateVillages('Lamu East', 'Coast')
      },
      {
        name: 'Lamu West',
        slug: 'lamu-west',
        villages: generateVillages('Lamu West', 'Coast')
      },
    ]
  },

  // ===== EASTERN REGION =====
  {
    name: 'Machakos',
    slug: 'machakos',
    code: '016',
    region: 'Eastern',
    population: 1421932,
    constituencies: [
      {
        name: 'Masinga',
        slug: 'masinga',
        villages: generateVillages('Masinga', 'Eastern')
      },
      {
        name: 'Yatta',
        slug: 'yatta',
        villages: generateVillages('Yatta', 'Eastern')
      },
      {
        name: 'Kangundo',
        slug: 'kangundo',
        villages: generateVillages('Kangundo', 'Eastern')
      },
      {
        name: 'Matungulu',
        slug: 'matungulu',
        villages: generateVillages('Matungulu', 'Eastern')
      },
      {
        name: 'Kathiani',
        slug: 'kathiani',
        villages: generateVillages('Kathiani', 'Eastern')
      },
      {
        name: 'Mavoko',
        slug: 'mavoko',
        villages: generateVillages('Mavoko', 'Eastern')
      },
      {
        name: 'Machakos Town',
        slug: 'machakos-town',
        villages: generateVillages('Machakos Town', 'Eastern')
      },
      {
        name: 'Mwala',
        slug: 'mwala',
        villages: generateVillages('Mwala', 'Eastern')
      },
    ]
  },
  {
    name: 'Makueni',
    slug: 'makueni',
    code: '017',
    region: 'Eastern',
    population: 987653,
    constituencies: [
      {
        name: 'Makueni',
        slug: 'makueni-const',
        villages: generateVillages('Makueni', 'Eastern')
      },
      {
        name: 'Kilome',
        slug: 'kilome',
        villages: generateVillages('Kilome', 'Eastern')
      },
      {
        name: 'Kaiti',
        slug: 'kaiti',
        villages: generateVillages('Kaiti', 'Eastern')
      },
      {
        name: 'Kibwezi West',
        slug: 'kibwezi-west',
        villages: generateVillages('Kibwezi West', 'Eastern')
      },
      {
        name: 'Kibwezi East',
        slug: 'kibwezi-east',
        villages: generateVillages('Kibwezi East', 'Eastern')
      },
      {
        name: 'Mbooni',
        slug: 'mbooni',
        villages: generateVillages('Mbooni', 'Eastern')
      },
    ]
  },
  {
    name: 'Kitui',
    slug: 'kitui',
    code: '015',
    region: 'Eastern',
    population: 1136187,
    constituencies: [
      {
        name: 'Mwingi North',
        slug: 'mwingi-north',
        villages: generateVillages('Mwingi North', 'Eastern')
      },
      {
        name: 'Mwingi West',
        slug: 'mwingi-west',
        villages: generateVillages('Mwingi West', 'Eastern')
      },
      {
        name: 'Mwingi Central',
        slug: 'mwingi-central',
        villages: generateVillages('Mwingi Central', 'Eastern')
      },
      {
        name: 'Kitui West',
        slug: 'kitui-west',
        villages: generateVillages('Kitui West', 'Eastern')
      },
      {
        name: 'Kitui Rural',
        slug: 'kitui-rural',
        villages: generateVillages('Kitui Rural', 'Eastern')
      },
      {
        name: 'Kitui Central',
        slug: 'kitui-central',
        villages: generateVillages('Kitui Central', 'Eastern')
      },
      {
        name: 'Kitui East',
        slug: 'kitui-east',
        villages: generateVillages('Kitui East', 'Eastern')
      },
      {
        name: 'Kitui South',
        slug: 'kitui-south',
        villages: generateVillages('Kitui South', 'Eastern')
      },
    ]
  },
  {
    name: 'Embu',
    slug: 'embu',
    code: '014',
    region: 'Eastern',
    population: 608599,
    constituencies: [
      {
        name: 'Manyatta',
        slug: 'manyatta',
        villages: generateVillages('Manyatta', 'Eastern')
      },
      {
        name: 'Runyenjes',
        slug: 'runyenjes',
        villages: generateVillages('Runyenjes', 'Eastern')
      },
      {
        name: 'Mbeere South',
        slug: 'mbeere-south',
        villages: generateVillages('Mbeere South', 'Eastern')
      },
      {
        name: 'Mbeere North',
        slug: 'mbeere-north',
        villages: generateVillages('Mbeere North', 'Eastern')
      },
    ]
  },
  {
    name: 'Tharaka Nithi',
    slug: 'tharaka-nithi',
    code: '013',
    region: 'Eastern',
    population: 393177,
    constituencies: [
      {
        name: 'Maara',
        slug: 'maara',
        villages: generateVillages('Maara', 'Eastern')
      },
      {
        name: 'Chuka Igambang\'ombe',
        slug: 'chuka-igambangombe',
        villages: generateVillages('Chuka Igambang\'ombe', 'Eastern')
      },
      {
        name: 'Tharaka',
        slug: 'tharaka',
        villages: generateVillages('Tharaka', 'Eastern')
      },
    ]
  },
  {
    name: 'Meru',
    slug: 'meru',
    code: '012',
    region: 'Eastern',
    population: 1545714,
    constituencies: [
      {
        name: 'Igembe South',
        slug: 'igembe-south',
        villages: generateVillages('Igembe South', 'Eastern')
      },
      {
        name: 'Igembe Central',
        slug: 'igembe-central',
        villages: generateVillages('Igembe Central', 'Eastern')
      },
      {
        name: 'Igembe North',
        slug: 'igembe-north',
        villages: generateVillages('Igembe North', 'Eastern')
      },
      {
        name: 'Tigania West',
        slug: 'tigania-west',
        villages: generateVillages('Tigania West', 'Eastern')
      },
      {
        name: 'Tigania East',
        slug: 'tigania-east',
        villages: generateVillages('Tigania East', 'Eastern')
      },
      {
        name: 'North Imenti',
        slug: 'north-imenti',
        villages: generateVillages('North Imenti', 'Eastern')
      },
      {
        name: 'Buuri',
        slug: 'buuri',
        villages: generateVillages('Buuri', 'Eastern')
      },
      {
        name: 'Central Imenti',
        slug: 'central-imenti',
        villages: generateVillages('Central Imenti', 'Eastern')
      },
      {
        name: 'South Imenti',
        slug: 'south-imenti',
        villages: generateVillages('South Imenti', 'Eastern')
      },
    ]
  },
  {
    name: 'Isiolo',
    slug: 'isiolo',
    code: '011',
    region: 'Eastern',
    population: 268002,
    constituencies: [
      {
        name: 'Isiolo North',
        slug: 'isiolo-north',
        villages: generateVillages('Isiolo North', 'Eastern')
      },
      {
        name: 'Isiolo South',
        slug: 'isiolo-south',
        villages: generateVillages('Isiolo South', 'Eastern')
      },
    ]
  },

  // ===== NYANZA REGION =====
  {
    name: 'Kisumu',
    slug: 'kisumu',
    code: '042',
    region: 'Nyanza',
    population: 1155574,
    constituencies: [
      {
        name: 'Kisumu East',
        slug: 'kisumu-east',
        villages: generateVillages('Kisumu East', 'Nyanza')
      },
      {
        name: 'Kisumu West',
        slug: 'kisumu-west',
        villages: generateVillages('Kisumu West', 'Nyanza')
      },
      {
        name: 'Kisumu Central',
        slug: 'kisumu-central',
        villages: generateVillages('Kisumu Central', 'Nyanza')
      },
      {
        name: 'Seme',
        slug: 'seme',
        villages: generateVillages('Seme', 'Nyanza')
      },
      {
        name: 'Nyando',
        slug: 'nyando',
        villages: generateVillages('Nyando', 'Nyanza')
      },
      {
        name: 'Muhoroni',
        slug: 'muhoroni',
        villages: generateVillages('Muhoroni', 'Nyanza')
      },
      {
        name: 'Nyakach',
        slug: 'nyakach',
        villages: generateVillages('Nyakach', 'Nyanza')
      },
    ]
  },
  {
    name: 'Siaya',
    slug: 'siaya',
    code: '041',
    region: 'Nyanza',
    population: 993183,
    constituencies: [
      {
        name: 'Ugenya',
        slug: 'ugenya',
        villages: generateVillages('Ugenya', 'Nyanza')
      },
      {
        name: 'Ugunja',
        slug: 'ugunja',
        villages: generateVillages('Ugunja', 'Nyanza')
      },
      {
        name: 'Alego Usonga',
        slug: 'alego-usonga',
        villages: generateVillages('Alego Usonga', 'Nyanza')
      },
      {
        name: 'Gem',
        slug: 'gem',
        villages: generateVillages('Gem', 'Nyanza')
      },
      {
        name: 'Bondo',
        slug: 'bondo',
        villages: generateVillages('Bondo', 'Nyanza')
      },
      {
        name: 'Rarieda',
        slug: 'rarieda',
        villages: generateVillages('Rarieda', 'Nyanza')
      },
    ]
  },
  {
    name: 'Homa Bay',
    slug: 'homa-bay',
    code: '043',
    region: 'Nyanza',
    population: 1131950,
    constituencies: [
      {
        name: 'Kasipul',
        slug: 'kasipul',
        villages: generateVillages('Kasipul', 'Nyanza')
      },
      {
        name: 'Kabondo Kasipul',
        slug: 'kabondo-kasipul',
        villages: generateVillages('Kabondo Kasipul', 'Nyanza')
      },
      {
        name: 'Karachuonyo',
        slug: 'karachuonyo',
        villages: generateVillages('Karachuonyo', 'Nyanza')
      },
      {
        name: 'Rangwe',
        slug: 'rangwe',
        villages: generateVillages('Rangwe', 'Nyanza')
      },
      {
        name: 'Homa Bay Town',
        slug: 'homa-bay-town',
        villages: generateVillages('Homa Bay Town', 'Nyanza')
      },
      {
        name: 'Ndhiwa',
        slug: 'ndhiwa',
        villages: generateVillages('Ndhiwa', 'Nyanza')
      },
      {
        name: 'Suba North',
        slug: 'suba-north',
        villages: generateVillages('Suba North', 'Nyanza')
      },
      {
        name: 'Suba South',
        slug: 'suba-south',
        villages: generateVillages('Suba South', 'Nyanza')
      },
    ]
  },
  {
    name: 'Kisii',
    slug: 'kisii',
    code: '045',
    region: 'Nyanza',
    population: 1266860,
    constituencies: [
      {
        name: 'Bonchari',
        slug: 'bonchari',
        villages: generateVillages('Bonchari', 'Nyanza')
      },
      {
        name: 'South Mugirango',
        slug: 'south-mugirango',
        villages: generateVillages('South Mugirango', 'Nyanza')
      },
      {
        name: 'Bomachoge Borabu',
        slug: 'bomachoge-borabu',
        villages: generateVillages('Bomachoge Borabu', 'Nyanza')
      },
      {
        name: 'Bobasi',
        slug: 'bobasi',
        villages: generateVillages('Bobasi', 'Nyanza')
      },
      {
        name: 'Bomachoge Chache',
        slug: 'bomachoge-chache',
        villages: generateVillages('Bomachoge Chache', 'Nyanza')
      },
      {
        name: 'Nyaribari Masaba',
        slug: 'nyaribari-masaba',
        villages: generateVillages('Nyaribari Masaba', 'Nyanza')
      },
      {
        name: 'Nyaribari Chache',
        slug: 'nyaribari-chache',
        villages: generateVillages('Nyaribari Chache', 'Nyanza')
      },
      {
        name: 'Kitutu Chache North',
        slug: 'kitutu-chache-north',
        villages: generateVillages('Kitutu Chache North', 'Nyanza')
      },
      {
        name: 'Kitutu Chache South',
        slug: 'kitutu-chache-south',
        villages: generateVillages('Kitutu Chache South', 'Nyanza')
      },
    ]
  },
  {
    name: 'Nyamira',
    slug: 'nyamira',
    code: '046',
    region: 'Nyanza',
    population: 605576,
    constituencies: [
      {
        name: 'Kitutu Masaba',
        slug: 'kitutu-masaba',
        villages: generateVillages('Kitutu Masaba', 'Nyanza')
      },
      {
        name: 'West Mugirango',
        slug: 'west-mugirango',
        villages: generateVillages('West Mugirango', 'Nyanza')
      },
      {
        name: 'North Mugirango',
        slug: 'north-mugirango',
        villages: generateVillages('North Mugirango', 'Nyanza')
      },
      {
        name: 'Borabu',
        slug: 'borabu',
        villages: generateVillages('Borabu', 'Nyanza')
      },
    ]
  },
  {
    name: 'Migori',
    slug: 'migori',
    code: '044',
    region: 'Nyanza',
    population: 1116436,
    constituencies: [
      {
        name: 'Rongo',
        slug: 'rongo',
        villages: generateVillages('Rongo', 'Nyanza')
      },
      {
        name: 'Awendo',
        slug: 'awendo',
        villages: generateVillages('Awendo', 'Nyanza')
      },
      {
        name: 'Suna East',
        slug: 'suna-east',
        villages: generateVillages('Suna East', 'Nyanza')
      },
      {
        name: 'Suna West',
        slug: 'suna-west',
        villages: generateVillages('Suna West', 'Nyanza')
      },
      {
        name: 'Uriri',
        slug: 'uriri',
        villages: generateVillages('Uriri', 'Nyanza')
      },
      {
        name: 'Nyatike',
        slug: 'nyatike',
        villages: generateVillages('Nyatike', 'Nyanza')
      },
      {
        name: 'Kuria West',
        slug: 'kuria-west',
        villages: generateVillages('Kuria West', 'Nyanza')
      },
      {
        name: 'Kuria East',
        slug: 'kuria-east',
        villages: generateVillages('Kuria East', 'Nyanza')
      },
    ]
  },

  // ===== RIFT VALLEY REGION =====
  {
    name: 'Nakuru',
    slug: 'nakuru',
    code: '032',
    region: 'Rift Valley',
    population: 2162202,
    constituencies: [
      {
        name: 'Molo',
        slug: 'molo',
        villages: generateVillages('Molo', 'Rift Valley')
      },
      {
        name: 'Njoro',
        slug: 'njoro',
        villages: generateVillages('Njoro', 'Rift Valley')
      },
      {
        name: 'Naivasha',
        slug: 'naivasha',
        villages: generateVillages('Naivasha', 'Rift Valley')
      },
      {
        name: 'Gilgil',
        slug: 'gilgil',
        villages: generateVillages('Gilgil', 'Rift Valley')
      },
      {
        name: 'Kuresoi South',
        slug: 'kuresoi-south',
        villages: generateVillages('Kuresoi South', 'Rift Valley')
      },
      {
        name: 'Kuresoi North',
        slug: 'kuresoi-north',
        villages: generateVillages('Kuresoi North', 'Rift Valley')
      },
      {
        name: 'Subukia',
        slug: 'subukia',
        villages: generateVillages('Subukia', 'Rift Valley')
      },
      {
        name: 'Rongai',
        slug: 'rongai',
        villages: generateVillages('Rongai', 'Rift Valley')
      },
      {
        name: 'Bahati',
        slug: 'bahati',
        villages: generateVillages('Bahati', 'Rift Valley')
      },
      {
        name: 'Nakuru Town West',
        slug: 'nakuru-town-west',
        villages: generateVillages('Nakuru Town West', 'Rift Valley')
      },
      {
        name: 'Nakuru Town East',
        slug: 'nakuru-town-east',
        villages: generateVillages('Nakuru Town East', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Narok',
    slug: 'narok',
    code: '033',
    region: 'Rift Valley',
    population: 1157873,
    constituencies: [
      {
        name: 'Kilgoris',
        slug: 'kilgoris',
        villages: generateVillages('Kilgoris', 'Rift Valley')
      },
      {
        name: 'Emurua Dikirr',
        slug: 'emurua-dikirr',
        villages: generateVillages('Emurua Dikirr', 'Rift Valley')
      },
      {
        name: 'Narok North',
        slug: 'narok-north',
        villages: generateVillages('Narok North', 'Rift Valley')
      },
      {
        name: 'Narok East',
        slug: 'narok-east',
        villages: generateVillages('Narok East', 'Rift Valley')
      },
      {
        name: 'Narok South',
        slug: 'narok-south',
        villages: generateVillages('Narok South', 'Rift Valley')
      },
      {
        name: 'Narok West',
        slug: 'narok-west',
        villages: generateVillages('Narok West', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Kajiado',
    slug: 'kajiado',
    code: '034',
    region: 'Rift Valley',
    population: 1117840,
    constituencies: [
      {
        name: 'Kajiado North',
        slug: 'kajiado-north',
        villages: generateVillages('Kajiado North', 'Rift Valley')
      },
      {
        name: 'Kajiado Central',
        slug: 'kajiado-central',
        villages: generateVillages('Kajiado Central', 'Rift Valley')
      },
      {
        name: 'Kajiado East',
        slug: 'kajiado-east',
        villages: generateVillages('Kajiado East', 'Rift Valley')
      },
      {
        name: 'Kajiado West',
        slug: 'kajiado-west',
        villages: generateVillages('Kajiado West', 'Rift Valley')
      },
      {
        name: 'Kajiado South',
        slug: 'kajiado-south',
        villages: generateVillages('Kajiado South', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Kericho',
    slug: 'kericho',
    code: '035',
    region: 'Rift Valley',
    population: 901777,
    constituencies: [
      {
        name: 'Kipkelion East',
        slug: 'kipkelion-east',
        villages: generateVillages('Kipkelion East', 'Rift Valley')
      },
      {
        name: 'Kipkelion West',
        slug: 'kipkelion-west',
        villages: generateVillages('Kipkelion West', 'Rift Valley')
      },
      {
        name: 'Ainamoi',
        slug: 'ainamoi',
        villages: generateVillages('Ainamoi', 'Rift Valley')
      },
      {
        name: 'Bureti',
        slug: 'bureti',
        villages: generateVillages('Bureti', 'Rift Valley')
      },
      {
        name: 'Belgut',
        slug: 'belgut',
        villages: generateVillages('Belgut', 'Rift Valley')
      },
      {
        name: 'Sigowet Soin',
        slug: 'sigowet-soin',
        villages: generateVillages('Sigowet Soin', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Bomet',
    slug: 'bomet',
    code: '037',
    region: 'Rift Valley',
    population: 875689,
    constituencies: [
      {
        name: 'Sotik',
        slug: 'sotik',
        villages: generateVillages('Sotik', 'Rift Valley')
      },
      {
        name: 'Chepalungu',
        slug: 'chepalungu',
        villages: generateVillages('Chepalungu', 'Rift Valley')
      },
      {
        name: 'Bomet East',
        slug: 'bomet-east',
        villages: generateVillages('Bomet East', 'Rift Valley')
      },
      {
        name: 'Bomet Central',
        slug: 'bomet-central',
        villages: generateVillages('Bomet Central', 'Rift Valley')
      },
      {
        name: 'Konoin',
        slug: 'konoin',
        villages: generateVillages('Konoin', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Uasin Gishu',
    slug: 'uasin-gishu',
    code: '027',
    region: 'Rift Valley',
    population: 1163186,
    constituencies: [
      {
        name: 'Soy',
        slug: 'soy',
        villages: generateVillages('Soy', 'Rift Valley')
      },
      {
        name: 'Turbo',
        slug: 'turbo',
        villages: generateVillages('Turbo', 'Rift Valley')
      },
      {
        name: 'Moiben',
        slug: 'moiben',
        villages: generateVillages('Moiben', 'Rift Valley')
      },
      {
        name: 'Ainabkoi',
        slug: 'ainabkoi',
        villages: generateVillages('Ainabkoi', 'Rift Valley')
      },
      {
        name: 'Kapseret',
        slug: 'kapseret',
        villages: generateVillages('Kapseret', 'Rift Valley')
      },
      {
        name: 'Kesses',
        slug: 'kesses',
        villages: generateVillages('Kesses', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Elgeyo Marakwet',
    slug: 'elgeyo-marakwet',
    code: '028',
    region: 'Rift Valley',
    population: 454480,
    constituencies: [
      {
        name: 'Marakwet East',
        slug: 'marakwet-east',
        villages: generateVillages('Marakwet East', 'Rift Valley')
      },
      {
        name: 'Marakwet West',
        slug: 'marakwet-west',
        villages: generateVillages('Marakwet West', 'Rift Valley')
      },
      {
        name: 'Keiyo North',
        slug: 'keiyo-north',
        villages: generateVillages('Keiyo North', 'Rift Valley')
      },
      {
        name: 'Keiyo South',
        slug: 'keiyo-south',
        villages: generateVillages('Keiyo South', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Nandi',
    slug: 'nandi',
    code: '029',
    region: 'Rift Valley',
    population: 885711,
    constituencies: [
      {
        name: 'Tinderet',
        slug: 'tinderet',
        villages: generateVillages('Tinderet', 'Rift Valley')
      },
      {
        name: 'Aldai',
        slug: 'aldai',
        villages: generateVillages('Aldai', 'Rift Valley')
      },
      {
        name: 'Nandi Hills',
        slug: 'nandi-hills',
        villages: generateVillages('Nandi Hills', 'Rift Valley')
      },
      {
        name: 'Chesumei',
        slug: 'chesumei',
        villages: generateVillages('Chesumei', 'Rift Valley')
      },
      {
        name: 'Emgwen',
        slug: 'emgwen',
        villages: generateVillages('Emgwen', 'Rift Valley')
      },
      {
        name: 'Mosop',
        slug: 'mosop',
        villages: generateVillages('Mosop', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Baringo',
    slug: 'baringo',
    code: '030',
    region: 'Rift Valley',
    population: 666763,
    constituencies: [
      {
        name: 'Tiaty',
        slug: 'tiaty',
        villages: generateVillages('Tiaty', 'Rift Valley')
      },
      {
        name: 'Baringo North',
        slug: 'baringo-north',
        villages: generateVillages('Baringo North', 'Rift Valley')
      },
      {
        name: 'Baringo Central',
        slug: 'baringo-central',
        villages: generateVillages('Baringo Central', 'Rift Valley')
      },
      {
        name: 'Baringo South',
        slug: 'baringo-south',
        villages: generateVillages('Baringo South', 'Rift Valley')
      },
      {
        name: 'Mogotio',
        slug: 'mogotio',
        villages: generateVillages('Mogotio', 'Rift Valley')
      },
      {
        name: 'Eldama Ravine',
        slug: 'eldama-ravine',
        villages: generateVillages('Eldama Ravine', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Laikipia',
    slug: 'laikipia',
    code: '031',
    region: 'Rift Valley',
    population: 518560,
    constituencies: [
      {
        name: 'Laikipia West',
        slug: 'laikipia-west',
        villages: generateVillages('Laikipia West', 'Rift Valley')
      },
      {
        name: 'Laikipia East',
        slug: 'laikipia-east',
        villages: generateVillages('Laikipia East', 'Rift Valley')
      },
      {
        name: 'Laikipia North',
        slug: 'laikipia-north',
        villages: generateVillages('Laikipia North', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Samburu',
    slug: 'samburu',
    code: '025',
    region: 'Rift Valley',
    population: 310327,
    constituencies: [
      {
        name: 'Samburu West',
        slug: 'samburu-west',
        villages: generateVillages('Samburu West', 'Rift Valley')
      },
      {
        name: 'Samburu North',
        slug: 'samburu-north',
        villages: generateVillages('Samburu North', 'Rift Valley')
      },
      {
        name: 'Samburu East',
        slug: 'samburu-east',
        villages: generateVillages('Samburu East', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Trans Nzoia',
    slug: 'trans-nzoia',
    code: '026',
    region: 'Rift Valley',
    population: 990341,
    constituencies: [
      {
        name: 'Kwanza',
        slug: 'kwanza',
        villages: generateVillages('Kwanza', 'Rift Valley')
      },
      {
        name: 'Endebess',
        slug: 'endebess',
        villages: generateVillages('Endebess', 'Rift Valley')
      },
      {
        name: 'Saboti',
        slug: 'saboti',
        villages: generateVillages('Saboti', 'Rift Valley')
      },
      {
        name: 'Kiminini',
        slug: 'kiminini',
        villages: generateVillages('Kiminini', 'Rift Valley')
      },
      {
        name: 'Cherangany',
        slug: 'cherangany',
        villages: generateVillages('Cherangany', 'Rift Valley')
      },
    ]
  },
  {
    name: 'Turkana',
    slug: 'turkana',
    code: '023',
    region: 'Rift Valley',
    population: 926976,
    constituencies: [
      {
        name: 'Turkana North',
        slug: 'turkana-north',
        villages: generateVillages('Turkana North', 'Rift Valley')
      },
      {
        name: 'Turkana West',
        slug: 'turkana-west',
        villages: generateVillages('Turkana West', 'Rift Valley')
      },
      {
        name: 'Turkana Central',
        slug: 'turkana-central',
        villages: generateVillages('Turkana Central', 'Rift Valley')
      },
      {
        name: 'Loima',
        slug: 'loima',
        villages: generateVillages('Loima', 'Rift Valley')
      },
      {
        name: 'Turkana South',
        slug: 'turkana-south',
        villages: generateVillages('Turkana South', 'Rift Valley')
      },
      {
        name: 'Turkana East',
        slug: 'turkana-east',
        villages: generateVillages('Turkana East', 'Rift Valley')
      },
    ]
  },
  {
    name: 'West Pokot',
    slug: 'west-pokot',
    code: '024',
    region: 'Rift Valley',
    population: 621241,
    constituencies: [
      {
        name: 'Kacheliba',
        slug: 'kacheliba',
        villages: generateVillages('Kacheliba', 'Rift Valley')
      },
      {
        name: 'Kapenguria',
        slug: 'kapenguria',
        villages: generateVillages('Kapenguria', 'Rift Valley')
      },
      {
        name: 'Sigor',
        slug: 'sigor',
        villages: generateVillages('Sigor', 'Rift Valley')
      },
      {
        name: 'Pokot South',
        slug: 'pokot-south',
        villages: generateVillages('Pokot South', 'Rift Valley')
      },
    ]
  },

  // ===== WESTERN REGION =====
  {
    name: 'Kakamega',
    slug: 'kakamega',
    code: '037',
    region: 'Western',
    population: 1867579,
    constituencies: [
      {
        name: 'Lugari',
        slug: 'lugari',
        villages: generateVillages('Lugari', 'Western')
      },
      {
        name: 'Likuyani',
        slug: 'likuyani',
        villages: generateVillages('Likuyani', 'Western')
      },
      {
        name: 'Malava',
        slug: 'malava',
        villages: generateVillages('Malava', 'Western')
      },
      {
        name: 'Lurambi',
        slug: 'lurambi',
        villages: generateVillages('Lurambi', 'Western')
      },
      {
        name: 'Navakholo',
        slug: 'navakholo',
        villages: generateVillages('Navakholo', 'Western')
      },
      {
        name: 'Mumias West',
        slug: 'mumias-west',
        villages: generateVillages('Mumias West', 'Western')
      },
      {
        name: 'Mumias East',
        slug: 'mumias-east',
        villages: generateVillages('Mumias East', 'Western')
      },
      {
        name: 'Matungu',
        slug: 'matungu',
        villages: generateVillages('Matungu', 'Western')
      },
      {
        name: 'Butere',
        slug: 'butere',
        villages: generateVillages('Butere', 'Western')
      },
      {
        name: 'Khwisero',
        slug: 'khwisero',
        villages: generateVillages('Khwisero', 'Western')
      },
      {
        name: 'Shinyalu',
        slug: 'shinyalu',
        villages: generateVillages('Shinyalu', 'Western')
      },
      {
        name: 'Ikolomani',
        slug: 'ikolomani',
        villages: generateVillages('Ikolomani', 'Western')
      },
    ]
  },
  {
    name: 'Bungoma',
    slug: 'bungoma',
    code: '039',
    region: 'Western',
    population: 1670570,
    constituencies: [
      {
        name: 'Mt Elgon',
        slug: 'mt-elgon',
        villages: generateVillages('Mt Elgon', 'Western')
      },
      {
        name: 'Sirisia',
        slug: 'sirisia',
        villages: generateVillages('Sirisia', 'Western')
      },
      {
        name: 'Kabuchai',
        slug: 'kabuchai',
        villages: generateVillages('Kabuchai', 'Western')
      },
      {
        name: 'Bumula',
        slug: 'bumula',
        villages: generateVillages('Bumula', 'Western')
      },
      {
        name: 'Kanduyi',
        slug: 'kanduyi',
        villages: generateVillages('Kanduyi', 'Western')
      },
      {
        name: 'Webuye East',
        slug: 'webuye-east',
        villages: generateVillages('Webuye East', 'Western')
      },
      {
        name: 'Webuye West',
        slug: 'webuye-west',
        villages: generateVillages('Webuye West', 'Western')
      },
      {
        name: 'Kimilili',
        slug: 'kimilili',
        villages: generateVillages('Kimilili', 'Western')
      },
      {
        name: 'Tongaren',
        slug: 'tongaren',
        villages: generateVillages('Tongaren', 'Western')
      },
    ]
  },
  {
    name: 'Busia',
    slug: 'busia',
    code: '040',
    region: 'Western',
    population: 893681,
    constituencies: [
      {
        name: 'Teso North',
        slug: 'teso-north',
        villages: generateVillages('Teso North', 'Western')
      },
      {
        name: 'Teso South',
        slug: 'teso-south',
        villages: generateVillages('Teso South', 'Western')
      },
      {
        name: 'Nambale',
        slug: 'nambale',
        villages: generateVillages('Nambale', 'Western')
      },
      {
        name: 'Matayos',
        slug: 'matayos',
        villages: generateVillages('Matayos', 'Western')
      },
      {
        name: 'Butula',
        slug: 'butula',
        villages: generateVillages('Butula', 'Western')
      },
      {
        name: 'Funyula',
        slug: 'funyula',
        villages: generateVillages('Funyula', 'Western')
      },
      {
        name: 'Budalangi',
        slug: 'budalangi',
        villages: generateVillages('Budalangi', 'Western')
      },
    ]
  },
  {
    name: 'Vihiga',
    slug: 'vihiga',
    code: '038',
    region: 'Western',
    population: 590013,
    constituencies: [
      {
        name: 'Vihiga',
        slug: 'vihiga-const',
        villages: generateVillages('Vihiga', 'Western')
      },
      {
        name: 'Sabatia',
        slug: 'sabatia',
        villages: generateVillages('Sabatia', 'Western')
      },
      {
        name: 'Hamisi',
        slug: 'hamisi',
        villages: generateVillages('Hamisi', 'Western')
      },
      {
        name: 'Luanda',
        slug: 'luanda',
        villages: generateVillages('Luanda', 'Western')
      },
      {
        name: 'Emuhaya',
        slug: 'emuhaya',
        villages: generateVillages('Emuhaya', 'Western')
      },
    ]
  },

  // ===== NORTH EASTERN REGION =====
  {
    name: 'Garissa',
    slug: 'garissa',
    code: '007',
    region: 'North Eastern',
    population: 841353,
    constituencies: [
      {
        name: 'Garissa Township',
        slug: 'garissa-township',
        villages: generateVillages('Garissa Township', 'North Eastern')
      },
      {
        name: 'Balambala',
        slug: 'balambala',
        villages: generateVillages('Balambala', 'North Eastern')
      },
      {
        name: 'Lagdera',
        slug: 'lagdera',
        villages: generateVillages('Lagdera', 'North Eastern')
      },
      {
        name: 'Dadaab',
        slug: 'dadaab',
        villages: generateVillages('Dadaab', 'North Eastern')
      },
      {
        name: 'Fafi',
        slug: 'fafi',
        villages: generateVillages('Fafi', 'North Eastern')
      },
      {
        name: 'Ijara',
        slug: 'ijara',
        villages: generateVillages('Ijara', 'North Eastern')
      },
    ]
  },
  {
    name: 'Wajir',
    slug: 'wajir',
    code: '008',
    region: 'North Eastern',
    population: 781263,
    constituencies: [
      {
        name: 'Wajir North',
        slug: 'wajir-north',
        villages: generateVillages('Wajir North', 'North Eastern')
      },
      {
        name: 'Wajir East',
        slug: 'wajir-east',
        villages: generateVillages('Wajir East', 'North Eastern')
      },
      {
        name: 'Tarbaj',
        slug: 'tarbaj',
        villages: generateVillages('Tarbaj', 'North Eastern')
      },
      {
        name: 'Wajir West',
        slug: 'wajir-west',
        villages: generateVillages('Wajir West', 'North Eastern')
      },
      {
        name: 'Eldas',
        slug: 'eldas',
        villages: generateVillages('Eldas', 'North Eastern')
      },
      {
        name: 'Wajir South',
        slug: 'wajir-south',
        villages: generateVillages('Wajir South', 'North Eastern')
      },
    ]
  },
  {
    name: 'Mandera',
    slug: 'mandera',
    code: '009',
    region: 'North Eastern',
    population: 1025756,
    constituencies: [
      {
        name: 'Mandera West',
        slug: 'mandera-west',
        villages: generateVillages('Mandera West', 'North Eastern')
      },
      {
        name: 'Banissa',
        slug: 'banissa',
        villages: generateVillages('Banissa', 'North Eastern')
      },
      {
        name: 'Mandera North',
        slug: 'mandera-north',
        villages: generateVillages('Mandera North', 'North Eastern')
      },
      {
        name: 'Mandera South',
        slug: 'mandera-south',
        villages: generateVillages('Mandera South', 'North Eastern')
      },
      {
        name: 'Mandera East',
        slug: 'mandera-east',
        villages: generateVillages('Mandera East', 'North Eastern')
      },
      {
        name: 'Lafey',
        slug: 'lafey',
        villages: generateVillages('Lafey', 'North Eastern')
      },
    ]
  },
  {
    name: 'Marsabit',
    slug: 'marsabit',
    code: '010',
    region: 'North Eastern',
    population: 459785,
    constituencies: [
      {
        name: 'Moyale',
        slug: 'moyale',
        villages: generateVillages('Moyale', 'North Eastern')
      },
      {
        name: 'North Horr',
        slug: 'north-horr',
        villages: generateVillages('North Horr', 'North Eastern')
      },
      {
        name: 'Saku',
        slug: 'saku',
        villages: generateVillages('Saku', 'North Eastern')
      },
      {
        name: 'Laisamis',
        slug: 'laisamis',
        villages: generateVillages('Laisamis', 'North Eastern')
      },
    ]
  },
];

// ===== UTILITY FUNCTIONS =====

/**
 * Find a county by slug
 */
export function getCountyBySlug(slug: string): County | undefined {
  return KENYA_LOCATIONS.find(county => county.slug === slug);
}

/**
 * Find a constituency by slug within a county
 */
export function getConstituencyBySlug(
  countySlug: string,
  constituencySlug: string
): Constituency | undefined {
  const county = getCountyBySlug(countySlug);
  return county?.constituencies.find(c => c.slug === constituencySlug);
}

/**
 * Find a village by slug within a constituency
 */
export function getVillageBySlug(
  countySlug: string,
  constituencySlug: string,
  villageSlug: string
): Village | undefined {
  const constituency = getConstituencyBySlug(countySlug, constituencySlug);
  return constituency?.villages.find(v => v.slug === villageSlug);
}

/**
 * Get all counties
 */
export function getAllCounties(): County[] {
  return KENYA_LOCATIONS;
}

/**
 * Get counties by region
 */
export function getCountiesByRegion(region: string): County[] {
  return KENYA_LOCATIONS.filter(county => county.region === region);
}

/**
 * Get all constituencies for a county
 */
export function getConstituencies(countySlug: string): Constituency[] {
  const county = getCountyBySlug(countySlug);
  return county?.constituencies || [];
}

/**
 * Get all villages for a constituency
 */
export function getVillages(countySlug: string, constituencySlug: string): Village[] {
  const constituency = getConstituencyBySlug(countySlug, constituencySlug);
  return constituency?.villages || [];
}

/**
 * Get total count of all locations
 */
export function getLocationStats() {
  let totalConstituencies = 0;
  let totalVillages = 0;

  for (const county of KENYA_LOCATIONS) {
    totalConstituencies += county.constituencies.length;
    for (const constituency of county.constituencies) {
      totalVillages += constituency.villages.length;
    }
  }

  return {
    counties: KENYA_LOCATIONS.length,
    constituencies: totalConstituencies,
    villages: totalVillages,
    total: KENYA_LOCATIONS.length + totalConstituencies + totalVillages
  };
}

/**
 * Get breadcrumb data for a location
 */
export function getLocationBreadcrumb(
  countySlug: string,
  constituencySlug?: string,
  villageSlug?: string
) {
  const county = getCountyBySlug(countySlug);
  if (!county) return [];

  const breadcrumbs = [
    { name: 'Kenya', slug: 'kenya', url: '/kenya' },
    { name: county.name, slug: county.slug, url: `/kenya/${county.slug}` }
  ];

  if (constituencySlug) {
    const constituency = getConstituencyBySlug(countySlug, constituencySlug);
    if (constituency) {
      breadcrumbs.push({
        name: constituency.name,
        slug: constituency.slug,
        url: `/kenya/${county.slug}/${constituency.slug}`
      });

      if (villageSlug) {
        const village = getVillageBySlug(countySlug, constituencySlug, villageSlug);
        if (village) {
          breadcrumbs.push({
            name: village.name,
            slug: village.slug,
            url: `/kenya/${county.slug}/${constituency.slug}/${village.slug}`
          });
        }
      }
    }
  }

  return breadcrumbs;
}

/**
 * Format location name for display
 */
export function formatLocationName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
