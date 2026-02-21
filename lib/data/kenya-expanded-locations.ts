/**
 * EXPANDED KENYA LOCATIONS - ESTATES, TOWNS & VILLAGES
 * Generates ~33,000 additional location entries for comprehensive SEO coverage
 * - 15,000 estates (residential, commercial, mixed, industrial)
 * - 8,000 towns
 * - 10,000 villages (expanded from existing)
 */

import { generateSlug } from './kenya-locations';

export interface Estate {
  name: string;
  slug: string;
  type: 'residential' | 'commercial' | 'mixed' | 'industrial';
  countySlug: string;
}

export interface Town {
  name: string;
  slug: string;
  countySlug: string;
  population?: number;
}

export interface ExpandedVillage {
  name: string;
  slug: string;
  countySlug: string;
  constituencySlug: string;
}

// Estate name prefixes by region
const ESTATE_PREFIXES: Record<string, string[]> = {
  Central: ['Green', 'Garden', 'Park', 'View', 'Hill', 'Valley', 'Spring', 'Sunset', 'Sunrise', 'Royal', 'Golden', 'Silver', 'Crystal', 'Diamond', 'Pearl'],
  Coast: ['Ocean', 'Beach', 'Palm', 'Coral', 'Marina', 'Seafront', 'Sunset', 'Coastal', 'Bay', 'Harbor', 'Island', 'Reef', 'Lagoon', 'Seaside', 'Shore'],
  Eastern: ['Savanna', 'Acacia', 'Rock', 'Plains', 'River', 'Valley', 'Hill', 'Mountain', 'Prairie', 'Meadow', 'Farm', 'Ranch', 'Orchard', 'Field', 'Grove'],
  Nyanza: ['Lake', 'Waterfront', 'Fisherman', 'Sunset', 'Bay', 'Harbor', 'Riverside', 'Shore', 'Beach', 'Peninsula', 'Island', 'Creek', 'Stream', 'Falls', 'Rapids'],
  'Rift Valley': ['Highland', 'Valley', 'Cliff', 'Ridge', 'Peak', 'Summit', 'Plateau', 'Escarpment', 'Gorge', 'Canyon', 'Crater', 'Terrace', 'Mesa', 'Bluff', 'Knoll'],
  Western: ['Forest', 'Green', 'Farm', 'Meadow', 'Valley', 'Hill', 'River', 'Stream', 'Grove', 'Woodland', 'Orchard', 'Garden', 'Field', 'Prairie', 'Pasture'],
  'North Eastern': ['Desert', 'Oasis', 'Sand', 'Dune', 'Plains', 'Savanna', 'Rock', 'Mountain', 'Valley', 'River', 'Well', 'Spring', 'Mesa', 'Butte', 'Canyon'],
};

// Estate name suffixes
const ESTATE_SUFFIXES = [
  'Estate', 'Gardens', 'Park', 'Heights', 'Court', 'Place', 'View', 'Terrace', 'Villa', 'Residences',
  'Apartments', 'Courts', 'Close', 'Lane', 'Drive', 'Avenue', 'Way', 'Crescent', 'Grove', 'Meadows',
  'Square', 'Towers', 'Complex', 'Phase', 'Extension', 'Block', 'Section', 'Zone', 'Quarter', 'Enclave'
];

// Town name bases - common Kenyan town patterns
const TOWN_BASES = [
  // Swahili/Bantu based
  'Kijiji', 'Mji', 'Mtaa', 'Kata', 'Jimbo', 'Tarafa', 'Wilaya', 'Mkoa',
  // Common town suffixes
  'Centre', 'Town', 'Township', 'Market', 'Trading Centre', 'Junction', 'Stage', 'Point',
  // Geographic features
  'Bridge', 'Falls', 'Springs', 'Valley', 'Hill', 'River', 'Lake', 'Plains', 'Forest', 'Mountain'
];

// Kenya county data for generation
const COUNTY_DATA: Array<{
  slug: string;
  name: string;
  region: string;
  population: number;
  estateCount: number;
  townCount: number;
  villageCount: number;
}> = [
  { slug: 'nairobi', name: 'Nairobi', region: 'Central', population: 4397073, estateCount: 2500, townCount: 300, villageCount: 500 },
  { slug: 'mombasa', name: 'Mombasa', region: 'Coast', population: 1208333, estateCount: 1200, townCount: 200, villageCount: 300 },
  { slug: 'kisumu', name: 'Kisumu', region: 'Nyanza', population: 1155574, estateCount: 800, townCount: 180, villageCount: 280 },
  { slug: 'nakuru', name: 'Nakuru', region: 'Rift Valley', population: 2162202, estateCount: 900, townCount: 250, villageCount: 350 },
  { slug: 'kiambu', name: 'Kiambu', region: 'Central', population: 2417735, estateCount: 1500, townCount: 300, villageCount: 400 },
  { slug: 'machakos', name: 'Machakos', region: 'Eastern', population: 1421932, estateCount: 700, townCount: 200, villageCount: 300 },
  { slug: 'kajiado', name: 'Kajiado', region: 'Rift Valley', population: 1117840, estateCount: 600, townCount: 150, villageCount: 250 },
  { slug: 'uasin-gishu', name: 'Uasin Gishu', region: 'Rift Valley', population: 1163186, estateCount: 700, townCount: 180, villageCount: 280 },
  { slug: 'meru', name: 'Meru', region: 'Eastern', population: 1545714, estateCount: 500, townCount: 200, villageCount: 350 },
  { slug: 'nyeri', name: 'Nyeri', region: 'Central', population: 759164, estateCount: 400, townCount: 150, villageCount: 280 },
  { slug: 'kakamega', name: 'Kakamega', region: 'Western', population: 1867579, estateCount: 400, townCount: 200, villageCount: 350 },
  { slug: 'kilifi', name: 'Kilifi', region: 'Coast', population: 1453787, estateCount: 400, townCount: 180, villageCount: 300 },
  { slug: 'bungoma', name: 'Bungoma', region: 'Western', population: 1670570, estateCount: 350, townCount: 180, villageCount: 320 },
  { slug: 'kisii', name: 'Kisii', region: 'Nyanza', population: 1266860, estateCount: 350, townCount: 170, villageCount: 300 },
  { slug: 'murang-a', name: "Murang'a", region: 'Central', population: 1056640, estateCount: 300, townCount: 150, villageCount: 280 },
  { slug: 'trans-nzoia', name: 'Trans Nzoia', region: 'Rift Valley', population: 990341, estateCount: 300, townCount: 140, villageCount: 250 },
  { slug: 'nyandarua', name: 'Nyandarua', region: 'Central', population: 638289, estateCount: 200, townCount: 120, villageCount: 220 },
  { slug: 'kwale', name: 'Kwale', region: 'Coast', population: 866820, estateCount: 250, townCount: 130, villageCount: 240 },
  { slug: 'kirinyaga', name: 'Kirinyaga', region: 'Central', population: 610411, estateCount: 200, townCount: 110, villageCount: 200 },
  { slug: 'embu', name: 'Embu', region: 'Eastern', population: 608599, estateCount: 200, townCount: 100, villageCount: 200 },
  { slug: 'kitui', name: 'Kitui', region: 'Eastern', population: 1136187, estateCount: 250, townCount: 180, villageCount: 300 },
  { slug: 'makueni', name: 'Makueni', region: 'Eastern', population: 987653, estateCount: 200, townCount: 150, villageCount: 280 },
  { slug: 'nandi', name: 'Nandi', region: 'Rift Valley', population: 885711, estateCount: 200, townCount: 140, villageCount: 250 },
  { slug: 'narok', name: 'Narok', region: 'Rift Valley', population: 1157873, estateCount: 200, townCount: 130, villageCount: 220 },
  { slug: 'kericho', name: 'Kericho', region: 'Rift Valley', population: 901777, estateCount: 250, townCount: 130, villageCount: 230 },
  { slug: 'bomet', name: 'Bomet', region: 'Rift Valley', population: 875689, estateCount: 180, townCount: 120, villageCount: 220 },
  { slug: 'siaya', name: 'Siaya', region: 'Nyanza', population: 993183, estateCount: 200, townCount: 140, villageCount: 260 },
  { slug: 'migori', name: 'Migori', region: 'Nyanza', population: 1116436, estateCount: 200, townCount: 150, villageCount: 280 },
  { slug: 'homa-bay', name: 'Homa Bay', region: 'Nyanza', population: 1131950, estateCount: 180, townCount: 140, villageCount: 260 },
  { slug: 'nyamira', name: 'Nyamira', region: 'Nyanza', population: 605576, estateCount: 150, townCount: 100, villageCount: 200 },
  { slug: 'vihiga', name: 'Vihiga', region: 'Western', population: 590013, estateCount: 150, townCount: 100, villageCount: 200 },
  { slug: 'busia', name: 'Busia', region: 'Western', population: 893681, estateCount: 180, townCount: 130, villageCount: 240 },
  { slug: 'baringo', name: 'Baringo', region: 'Rift Valley', population: 666763, estateCount: 150, townCount: 110, villageCount: 200 },
  { slug: 'laikipia', name: 'Laikipia', region: 'Rift Valley', population: 518560, estateCount: 150, townCount: 100, villageCount: 180 },
  { slug: 'elgeyo-marakwet', name: 'Elgeyo Marakwet', region: 'Rift Valley', population: 454480, estateCount: 120, townCount: 90, villageCount: 170 },
  { slug: 'west-pokot', name: 'West Pokot', region: 'Rift Valley', population: 621241, estateCount: 100, townCount: 80, villageCount: 160 },
  { slug: 'samburu', name: 'Samburu', region: 'Rift Valley', population: 310327, estateCount: 80, townCount: 60, villageCount: 120 },
  { slug: 'turkana', name: 'Turkana', region: 'Rift Valley', population: 926976, estateCount: 100, townCount: 80, villageCount: 150 },
  { slug: 'tharaka-nithi', name: 'Tharaka Nithi', region: 'Eastern', population: 393177, estateCount: 100, townCount: 80, villageCount: 150 },
  { slug: 'isiolo', name: 'Isiolo', region: 'Eastern', population: 268002, estateCount: 80, townCount: 60, villageCount: 120 },
  { slug: 'marsabit', name: 'Marsabit', region: 'Eastern', population: 459785, estateCount: 60, townCount: 50, villageCount: 100 },
  { slug: 'garissa', name: 'Garissa', region: 'North Eastern', population: 841353, estateCount: 100, townCount: 70, villageCount: 140 },
  { slug: 'wajir', name: 'Wajir', region: 'North Eastern', population: 781263, estateCount: 80, townCount: 60, villageCount: 120 },
  { slug: 'mandera', name: 'Mandera', region: 'North Eastern', population: 867457, estateCount: 80, townCount: 60, villageCount: 120 },
  { slug: 'tana-river', name: 'Tana River', region: 'Coast', population: 315943, estateCount: 60, townCount: 50, villageCount: 100 },
  { slug: 'lamu', name: 'Lamu', region: 'Coast', population: 143920, estateCount: 60, townCount: 40, villageCount: 80 },
  { slug: 'taita-taveta', name: 'Taita Taveta', region: 'Coast', population: 340671, estateCount: 100, townCount: 70, villageCount: 140 },
];

// Seeded random number generator for consistency
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Generate estates for a county
 */
function generateEstatesForCounty(
  countySlug: string,
  countyName: string,
  region: string,
  count: number
): Estate[] {
  const estates: Estate[] = [];
  const prefixes = ESTATE_PREFIXES[region] || ESTATE_PREFIXES.Central;
  const random = seededRandom(countySlug.length * 1000);
  const types: Estate['type'][] = ['residential', 'commercial', 'mixed', 'industrial'];

  // Common estate names for major counties
  const commonEstateNames = [
    `${countyName} Heights`, `${countyName} Gardens`, `${countyName} Park`,
    `${countyName} View`, `${countyName} Court`, `${countyName} Plaza`,
    `${countyName} Estate`, `${countyName} Residences`, `${countyName} Towers`,
  ];

  // Add common estates first
  commonEstateNames.forEach((name, i) => {
    if (estates.length < count) {
      estates.push({
        name,
        slug: generateSlug(name),
        type: types[i % types.length],
        countySlug,
      });
    }
  });

  // Generate remaining estates
  for (let i = estates.length; i < count; i++) {
    const prefix = prefixes[Math.floor(random() * prefixes.length)];
    const suffix = ESTATE_SUFFIXES[Math.floor(random() * ESTATE_SUFFIXES.length)];
    const phase = random() > 0.7 ? ` Phase ${Math.floor(random() * 5) + 1}` : '';
    const name = `${prefix} ${suffix}${phase}`;

    estates.push({
      name,
      slug: generateSlug(`${countySlug}-${name}`),
      type: types[Math.floor(random() * types.length)],
      countySlug,
    });
  }

  return estates;
}

/**
 * Generate towns for a county
 */
function generateTownsForCounty(
  countySlug: string,
  countyName: string,
  count: number
): Town[] {
  const towns: Town[] = [];
  const random = seededRandom(countySlug.length * 2000);

  // Common town patterns
  const townPatterns = [
    `${countyName} Town`, `${countyName} Central`, `${countyName} Junction`,
    `${countyName} Market`, `${countyName} Trading Centre`,
  ];

  // Add pattern-based towns
  townPatterns.forEach((name) => {
    if (towns.length < count) {
      towns.push({
        name,
        slug: generateSlug(name),
        countySlug,
        population: Math.floor(random() * 50000) + 5000,
      });
    }
  });

  // Generate direction-based towns
  const directions = ['North', 'South', 'East', 'West', 'Upper', 'Lower', 'Central', 'New', 'Old'];
  directions.forEach((dir) => {
    if (towns.length < count) {
      const name = `${dir} ${countyName}`;
      towns.push({
        name,
        slug: generateSlug(name),
        countySlug,
        population: Math.floor(random() * 30000) + 3000,
      });
    }
  });

  // Generate feature-based towns
  const features = TOWN_BASES;
  for (let i = towns.length; i < count; i++) {
    const feature = features[Math.floor(random() * features.length)];
    const name = `${countyName} ${feature}`;
    towns.push({
      name,
      slug: generateSlug(`${countySlug}-${name}-${i}`),
      countySlug,
      population: Math.floor(random() * 20000) + 2000,
    });
  }

  return towns;
}

/**
 * Generate expanded villages for a county
 */
function generateVillagesForCounty(
  countySlug: string,
  countyName: string,
  region: string,
  count: number
): ExpandedVillage[] {
  const villages: ExpandedVillage[] = [];
  const random = seededRandom(countySlug.length * 3000);

  const villageSuffixes = ['Village', 'Centre', 'Market', 'Location', 'Sub-Location', 'Ward', 'Area', 'Zone'];
  const directional = ['North', 'South', 'East', 'West', 'Upper', 'Lower', 'Inner', 'Outer', 'Central', 'New', 'Old'];

  for (let i = 0; i < count; i++) {
    const suffix = villageSuffixes[Math.floor(random() * villageSuffixes.length)];
    const direction = directional[Math.floor(random() * directional.length)];
    const name = `${direction} ${countyName} ${suffix}`;

    villages.push({
      name,
      slug: generateSlug(`${countySlug}-village-${i}`),
      countySlug,
      constituencySlug: `${countySlug}-constituency`,
    });
  }

  return villages;
}

// Generate all estates
let _cachedEstates: Estate[] | null = null;
export function getAllEstates(): Estate[] {
  if (_cachedEstates) return _cachedEstates;

  const allEstates: Estate[] = [];
  for (const county of COUNTY_DATA) {
    allEstates.push(...generateEstatesForCounty(
      county.slug,
      county.name,
      county.region,
      county.estateCount
    ));
  }
  _cachedEstates = allEstates;
  return allEstates;
}

// Generate all towns
let _cachedTowns: Town[] | null = null;
export function getAllTowns(): Town[] {
  if (_cachedTowns) return _cachedTowns;

  const allTowns: Town[] = [];
  for (const county of COUNTY_DATA) {
    allTowns.push(...generateTownsForCounty(
      county.slug,
      county.name,
      county.townCount
    ));
  }
  _cachedTowns = allTowns;
  return allTowns;
}

// Generate expanded villages
let _cachedVillages: ExpandedVillage[] | null = null;
export function getAllExpandedVillages(): ExpandedVillage[] {
  if (_cachedVillages) return _cachedVillages;

  const allVillages: ExpandedVillage[] = [];
  for (const county of COUNTY_DATA) {
    allVillages.push(...generateVillagesForCounty(
      county.slug,
      county.name,
      county.region,
      county.villageCount
    ));
  }
  _cachedVillages = allVillages;
  return allVillages;
}

/**
 * Get estates by county
 */
export function getEstatesByCounty(countySlug: string): Estate[] {
  return getAllEstates().filter(e => e.countySlug === countySlug);
}

/**
 * Get towns by county
 */
export function getTownsByCounty(countySlug: string): Town[] {
  return getAllTowns().filter(t => t.countySlug === countySlug);
}

/**
 * Get estate by slug
 */
export function getEstateBySlug(slug: string): Estate | undefined {
  return getAllEstates().find(e => e.slug === slug);
}

/**
 * Get town by slug
 */
export function getTownBySlug(slug: string): Town | undefined {
  return getAllTowns().find(t => t.slug === slug);
}

/**
 * Get total expanded location stats
 */
export function getExpandedLocationStats(): {
  estates: number;
  towns: number;
  villages: number;
  total: number;
} {
  return {
    estates: getAllEstates().length,
    towns: getAllTowns().length,
    villages: getAllExpandedVillages().length,
    total: getAllEstates().length + getAllTowns().length + getAllExpandedVillages().length,
  };
}

/**
 * Get all location slugs for sitemap generation
 */
export function getAllExpandedLocationSlugs(): string[] {
  const slugs: string[] = [];

  getAllEstates().forEach(e => slugs.push(e.slug));
  getAllTowns().forEach(t => slugs.push(t.slug));
  getAllExpandedVillages().forEach(v => slugs.push(v.slug));

  return slugs;
}

/**
 * Search locations by name
 */
export function searchExpandedLocations(query: string, limit = 20): Array<Estate | Town | ExpandedVillage> {
  const lowerQuery = query.toLowerCase();
  const results: Array<Estate | Town | ExpandedVillage> = [];

  // Search estates
  for (const estate of getAllEstates()) {
    if (estate.name.toLowerCase().includes(lowerQuery)) {
      results.push(estate);
      if (results.length >= limit) return results;
    }
  }

  // Search towns
  for (const town of getAllTowns()) {
    if (town.name.toLowerCase().includes(lowerQuery)) {
      results.push(town);
      if (results.length >= limit) return results;
    }
  }

  // Search villages
  for (const village of getAllExpandedVillages()) {
    if (village.name.toLowerCase().includes(lowerQuery)) {
      results.push(village);
      if (results.length >= limit) return results;
    }
  }

  return results;
}
