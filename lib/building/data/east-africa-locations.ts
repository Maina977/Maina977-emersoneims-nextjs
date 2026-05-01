/**
 * EAST AFRICA LOCATIONS SEO DATA
 * 9 countries with major cities for international SEO expansion
 * Generates pages like "Generators in Kampala, Uganda"
 */

export interface EastAfricaCity {
  name: string;
  slug: string;
  population?: number;
  isCapital?: boolean;
  region?: string;
}

export interface EastAfricaCountry {
  id: string;
  name: string;
  slug: string;
  code: string;
  capital: string;
  currency: string;
  language: string[];
  timezone: string;
  dialCode: string;
  description: string;
  cities: EastAfricaCity[];
  metaTemplate: {
    title: string;
    description: string;
    h1: string;
  };
  keywords: string[];
}

export const EAST_AFRICA_COUNTRIES: EastAfricaCountry[] = [
  {
    id: 'uganda',
    name: 'Uganda',
    slug: 'uganda',
    code: 'UG',
    capital: 'Kampala',
    currency: 'UGX',
    language: ['English', 'Swahili'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+256',
    description: 'Leading generator and power solutions provider in Uganda. Sales, installation, service, and spare parts for all generator brands.',
    cities: [
      { name: 'Kampala', slug: 'kampala', population: 1650000, isCapital: true },
      { name: 'Entebbe', slug: 'entebbe', population: 90000, region: 'Central' },
      { name: 'Jinja', slug: 'jinja', population: 76000, region: 'Eastern' },
      { name: 'Mbale', slug: 'mbale', population: 96000, region: 'Eastern' },
      { name: 'Mbarara', slug: 'mbarara', population: 195000, region: 'Western' },
      { name: 'Gulu', slug: 'gulu', population: 150000, region: 'Northern' },
      { name: 'Lira', slug: 'lira', population: 119000, region: 'Northern' },
      { name: 'Fort Portal', slug: 'fort-portal', population: 54000, region: 'Western' },
      { name: 'Masaka', slug: 'masaka', population: 103000, region: 'Central' },
      { name: 'Kasese', slug: 'kasese', population: 101000, region: 'Western' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Uganda | Generator Suppliers Uganda',
      description: 'Professional generator services in {city}, Uganda. Diesel generators, installation, repairs & maintenance. 24/7 support. Call for quote.',
      h1: 'Generators in {city}, Uganda'
    },
    keywords: ['generators uganda', 'generator kampala', 'power solutions uganda', 'diesel generators uganda', 'generator company uganda']
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    slug: 'tanzania',
    code: 'TZ',
    capital: 'Dodoma',
    currency: 'TZS',
    language: ['Swahili', 'English'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+255',
    description: 'Trusted generator supplier and power solutions provider in Tanzania. Serving Dar es Salaam, Arusha, Mwanza and all major cities.',
    cities: [
      { name: 'Dar es Salaam', slug: 'dar-es-salaam', population: 4365000, region: 'Coastal' },
      { name: 'Dodoma', slug: 'dodoma', population: 410956, isCapital: true, region: 'Central' },
      { name: 'Arusha', slug: 'arusha', population: 416442, region: 'Northern' },
      { name: 'Mwanza', slug: 'mwanza', population: 706453, region: 'Lake Zone' },
      { name: 'Moshi', slug: 'moshi', population: 184292, region: 'Kilimanjaro' },
      { name: 'Tanga', slug: 'tanga', population: 273332, region: 'Coastal' },
      { name: 'Morogoro', slug: 'morogoro', population: 315866, region: 'Eastern' },
      { name: 'Zanzibar City', slug: 'zanzibar', population: 223033, region: 'Zanzibar' },
      { name: 'Mbeya', slug: 'mbeya', population: 385279, region: 'Southern Highlands' },
      { name: 'Iringa', slug: 'iringa', population: 151345, region: 'Southern Highlands' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Tanzania | Generator Suppliers Tanzania',
      description: 'Professional generator services in {city}, Tanzania. Diesel generators, installation, repairs & maintenance. TANESCO backup power. Call for quote.',
      h1: 'Generators in {city}, Tanzania'
    },
    keywords: ['generators tanzania', 'generator dar es salaam', 'power solutions tanzania', 'diesel generators tanzania', 'generator company tanzania']
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    slug: 'rwanda',
    code: 'RW',
    capital: 'Kigali',
    currency: 'RWF',
    language: ['Kinyarwanda', 'English', 'French'],
    timezone: 'CAT (UTC+2)',
    dialCode: '+250',
    description: 'Reliable generator supplier in Rwanda. Serving Kigali and all provinces with quality generators, installation and maintenance services.',
    cities: [
      { name: 'Kigali', slug: 'kigali', population: 1132686, isCapital: true },
      { name: 'Butare', slug: 'butare', population: 89600, region: 'Southern' },
      { name: 'Gisenyi', slug: 'gisenyi', population: 83623, region: 'Western' },
      { name: 'Ruhengeri', slug: 'ruhengeri', population: 86685, region: 'Northern' },
      { name: 'Gitarama', slug: 'gitarama', population: 87613, region: 'Southern' },
      { name: 'Cyangugu', slug: 'cyangugu', population: 63883, region: 'Western' },
      { name: 'Byumba', slug: 'byumba', population: 70593, region: 'Northern' },
      { name: 'Nyanza', slug: 'nyanza', population: 51500, region: 'Southern' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Rwanda | Generator Suppliers Rwanda',
      description: 'Professional generator services in {city}, Rwanda. Diesel generators, installation, repairs & maintenance. Reliable backup power. Call for quote.',
      h1: 'Generators in {city}, Rwanda'
    },
    keywords: ['generators rwanda', 'generator kigali', 'power solutions rwanda', 'diesel generators rwanda', 'generator company rwanda']
  },
  {
    id: 'south-sudan',
    name: 'South Sudan',
    slug: 'south-sudan',
    code: 'SS',
    capital: 'Juba',
    currency: 'SSP',
    language: ['English', 'Arabic'],
    timezone: 'CAT (UTC+2)',
    dialCode: '+211',
    description: 'Generator supplier and power solutions provider in South Sudan. Essential backup power for businesses, NGOs, and government institutions.',
    cities: [
      { name: 'Juba', slug: 'juba', population: 525953, isCapital: true },
      { name: 'Wau', slug: 'wau', population: 151320, region: 'Western Bahr el Ghazal' },
      { name: 'Malakal', slug: 'malakal', population: 147450, region: 'Upper Nile' },
      { name: 'Bor', slug: 'bor', population: 26782, region: 'Jonglei' },
      { name: 'Yei', slug: 'yei', population: 260720, region: 'Central Equatoria' },
      { name: 'Torit', slug: 'torit', population: 20231, region: 'Eastern Equatoria' },
      { name: 'Rumbek', slug: 'rumbek', population: 17000, region: 'Lakes' },
      { name: 'Aweil', slug: 'aweil', population: 38745, region: 'Northern Bahr el Ghazal' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, South Sudan | Generator Suppliers South Sudan',
      description: 'Professional generator services in {city}, South Sudan. Reliable diesel generators for businesses and NGOs. Installation & maintenance.',
      h1: 'Generators in {city}, South Sudan'
    },
    keywords: ['generators south sudan', 'generator juba', 'power solutions south sudan', 'diesel generators south sudan', 'generator company juba']
  },
  {
    id: 'drc',
    name: 'DR Congo',
    slug: 'drc',
    code: 'CD',
    capital: 'Kinshasa',
    currency: 'CDF',
    language: ['French', 'Lingala', 'Swahili'],
    timezone: 'WAT/CAT (UTC+1/+2)',
    dialCode: '+243',
    description: 'Generator supplier serving the Democratic Republic of Congo. Industrial and commercial power solutions for mining, manufacturing and businesses.',
    cities: [
      { name: 'Kinshasa', slug: 'kinshasa', population: 14342000, isCapital: true },
      { name: 'Lubumbashi', slug: 'lubumbashi', population: 2015000, region: 'Katanga' },
      { name: 'Goma', slug: 'goma', population: 670000, region: 'North Kivu' },
      { name: 'Bukavu', slug: 'bukavu', population: 806940, region: 'South Kivu' },
      { name: 'Kisangani', slug: 'kisangani', population: 1602144, region: 'Tshopo' },
      { name: 'Mbuji-Mayi', slug: 'mbuji-mayi', population: 2007835, region: 'Kasai-Oriental' },
      { name: 'Kananga', slug: 'kananga', population: 1061181, region: 'Kasai-Central' },
      { name: 'Kolwezi', slug: 'kolwezi', population: 453147, region: 'Lualaba' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, DR Congo | Generator Suppliers DRC',
      description: 'Professional generator services in {city}, DR Congo. Industrial generators for mining and manufacturing. Installation & maintenance.',
      h1: 'Generators in {city}, DR Congo'
    },
    keywords: ['generators drc', 'generator kinshasa', 'generator lubumbashi', 'power solutions drc', 'mining generators congo']
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    slug: 'ethiopia',
    code: 'ET',
    capital: 'Addis Ababa',
    currency: 'ETB',
    language: ['Amharic', 'English'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+251',
    description: 'Generator supplier and power solutions provider in Ethiopia. Serving Addis Ababa and industrial zones with reliable backup power.',
    cities: [
      { name: 'Addis Ababa', slug: 'addis-ababa', population: 3352000, isCapital: true },
      { name: 'Dire Dawa', slug: 'dire-dawa', population: 440000, region: 'Eastern' },
      { name: 'Mekelle', slug: 'mekelle', population: 323700, region: 'Tigray' },
      { name: 'Gondar', slug: 'gondar', population: 323900, region: 'Amhara' },
      { name: 'Hawassa', slug: 'hawassa', population: 315267, region: 'SNNPR' },
      { name: 'Bahir Dar', slug: 'bahir-dar', population: 297794, region: 'Amhara' },
      { name: 'Adama', slug: 'adama', population: 324000, region: 'Oromia' },
      { name: 'Jimma', slug: 'jimma', population: 207573, region: 'Oromia' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Ethiopia | Generator Suppliers Ethiopia',
      description: 'Professional generator services in {city}, Ethiopia. Diesel generators for industrial parks and businesses. Installation & maintenance.',
      h1: 'Generators in {city}, Ethiopia'
    },
    keywords: ['generators ethiopia', 'generator addis ababa', 'power solutions ethiopia', 'diesel generators ethiopia', 'generator company ethiopia']
  },
  {
    id: 'djibouti',
    name: 'Djibouti',
    slug: 'djibouti',
    code: 'DJ',
    capital: 'Djibouti City',
    currency: 'DJF',
    language: ['French', 'Arabic'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+253',
    description: 'Generator supplier in Djibouti. Serving the port city and free trade zones with reliable power solutions.',
    cities: [
      { name: 'Djibouti City', slug: 'djibouti-city', population: 603900, isCapital: true },
      { name: 'Ali Sabieh', slug: 'ali-sabieh', population: 40000, region: 'Ali Sabieh' },
      { name: 'Tadjoura', slug: 'tadjoura', population: 22000, region: 'Tadjoura' },
      { name: 'Obock', slug: 'obock', population: 17000, region: 'Obock' },
      { name: 'Dikhil', slug: 'dikhil', population: 35000, region: 'Dikhil' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Djibouti | Generator Suppliers Djibouti',
      description: 'Professional generator services in {city}, Djibouti. Diesel generators for port facilities and businesses. Installation & maintenance.',
      h1: 'Generators in {city}, Djibouti'
    },
    keywords: ['generators djibouti', 'generator djibouti city', 'power solutions djibouti', 'port generators djibouti']
  },
  {
    id: 'eritrea',
    name: 'Eritrea',
    slug: 'eritrea',
    code: 'ER',
    capital: 'Asmara',
    currency: 'ERN',
    language: ['Tigrinya', 'Arabic', 'English'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+291',
    description: 'Generator supplier serving Eritrea. Backup power solutions for businesses and industries in Asmara and port cities.',
    cities: [
      { name: 'Asmara', slug: 'asmara', population: 963000, isCapital: true },
      { name: 'Massawa', slug: 'massawa', population: 53090, region: 'Northern Red Sea' },
      { name: 'Keren', slug: 'keren', population: 74800, region: 'Anseba' },
      { name: 'Assab', slug: 'assab', population: 28000, region: 'Southern Red Sea' },
      { name: 'Mendefera', slug: 'mendefera', population: 25000, region: 'Debub' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Eritrea | Generator Suppliers Eritrea',
      description: 'Professional generator services in {city}, Eritrea. Reliable diesel generators for businesses. Installation & maintenance available.',
      h1: 'Generators in {city}, Eritrea'
    },
    keywords: ['generators eritrea', 'generator asmara', 'power solutions eritrea', 'diesel generators eritrea']
  },
  {
    id: 'somaliland',
    name: 'Somaliland',
    slug: 'somaliland',
    code: 'SO',
    capital: 'Hargeisa',
    currency: 'SLS',
    language: ['Somali', 'Arabic', 'English'],
    timezone: 'EAT (UTC+3)',
    dialCode: '+252',
    description: 'Generator supplier serving Somaliland. Essential backup power for businesses, hotels, and industries in Hargeisa and Berbera.',
    cities: [
      { name: 'Hargeisa', slug: 'hargeisa', population: 1200000, isCapital: true },
      { name: 'Berbera', slug: 'berbera', population: 242344, region: 'Sahil' },
      { name: 'Burao', slug: 'burao', population: 400000, region: 'Togdheer' },
      { name: 'Borama', slug: 'borama', population: 215616, region: 'Awdal' },
      { name: 'Las Anod', slug: 'las-anod', population: 150000, region: 'Sool' },
      { name: 'Erigavo', slug: 'erigavo', population: 50000, region: 'Sanaag' },
    ],
    metaTemplate: {
      title: 'Generators in {city}, Somaliland | Generator Suppliers Somaliland',
      description: 'Professional generator services in {city}, Somaliland. Reliable diesel generators for businesses and hotels. Installation & maintenance.',
      h1: 'Generators in {city}, Somaliland'
    },
    keywords: ['generators somaliland', 'generator hargeisa', 'power solutions somaliland', 'diesel generators berbera']
  }
];

/**
 * Get country by slug
 */
export function getCountryBySlug(slug: string): EastAfricaCountry | undefined {
  return EAST_AFRICA_COUNTRIES.find(country => country.slug === slug);
}

/**
 * Get city by country and city slug
 */
export function getCityBySlug(countrySlug: string, citySlug: string): EastAfricaCity | undefined {
  const country = getCountryBySlug(countrySlug);
  if (!country) return undefined;
  return country.cities.find(city => city.slug === citySlug);
}

/**
 * Get all country slugs
 */
export function getAllCountrySlugs(): string[] {
  return EAST_AFRICA_COUNTRIES.map(country => country.slug);
}

/**
 * Get all city slugs for a country
 */
export function getCitySlugsForCountry(countrySlug: string): string[] {
  const country = getCountryBySlug(countrySlug);
  if (!country) return [];
  return country.cities.map(city => city.slug);
}

/**
 * Generate meta title for country + city
 */
export function generateCityTitle(country: EastAfricaCountry, city: EastAfricaCity): string {
  return country.metaTemplate.title.replace(/{city}/g, city.name);
}

/**
 * Generate meta description for country + city
 */
export function generateCityDescription(country: EastAfricaCountry, city: EastAfricaCity): string {
  return country.metaTemplate.description.replace(/{city}/g, city.name);
}

/**
 * Generate H1 for country + city
 */
export function generateCityH1(country: EastAfricaCountry, city: EastAfricaCity): string {
  return country.metaTemplate.h1.replace(/{city}/g, city.name);
}

/**
 * Generate keywords for country + city
 */
export function generateCityKeywords(country: EastAfricaCountry, city: EastAfricaCity): string[] {
  const keywords: string[] = [];

  keywords.push(`generators ${city.name.toLowerCase()}`);
  keywords.push(`generators in ${city.name}`);
  keywords.push(`generator company ${city.name}`);
  keywords.push(`diesel generators ${city.name}`);
  keywords.push(`power solutions ${city.name}`);
  keywords.push(`backup power ${city.name}`);
  keywords.push(`${city.name} generator supplier`);

  // Add country keywords
  for (const keyword of country.keywords) {
    keywords.push(keyword);
  }

  return keywords;
}

/**
 * Get total international page potential
 */
export function getInternationalPagePotential(): {
  countries: number;
  cities: number;
  totalPages: number;
} {
  const countries = EAST_AFRICA_COUNTRIES.length;
  let cities = 0;

  for (const country of EAST_AFRICA_COUNTRIES) {
    cities += country.cities.length;
  }

  return {
    countries,
    cities,
    totalPages: countries + cities // country pages + city pages
  };
}

/**
 * Get capital cities
 */
export function getCapitalCities(): Array<{ country: EastAfricaCountry; city: EastAfricaCity }> {
  const capitals: Array<{ country: EastAfricaCountry; city: EastAfricaCity }> = [];

  for (const country of EAST_AFRICA_COUNTRIES) {
    const capital = country.cities.find(city => city.isCapital);
    if (capital) {
      capitals.push({ country, city: capital });
    }
  }

  return capitals;
}
