/**
 * KENYA HYDROGEOLOGICAL PROVINCE PRIORS
 * ─────────────────────────────────────
 * County-level ground-truth priors compiled from published hydrogeology:
 * BGS Africa Groundwater Atlas (Kenya), MacDonald et al. (2012) quantitative
 * groundwater maps, WRA drilling-completion statistics as summarised in
 * public literature. These are the numbers a Kenyan hydrogeologist carries in
 * their head — typical drilled depth, expected yield band, historical success
 * rate and geogenic water-quality risks per aquifer province.
 *
 * WHY THIS CLOSES THE ACCURACY GAP: the global satellite/pedotransfer models
 * know nothing about Kenya's drilling history. A local prior anchored to the
 * actual aquifer province is the strongest desktop evidence available short
 * of field geophysics, and it enters the Bayesian ensemble as its own source
 * (reliability 0.65 — below field data, above pure image inference).
 *
 * Provinces follow the standard Kenya scheme:
 *  BASEMENT   – Precambrian crystalline (weathered/fractured saprolite aquifer)
 *  VOLCANIC   – Tertiary/Quaternary volcanics (fracture/contact aquifers, Rift)
 *  COASTAL    – Coastal sedimentary basin (sands/limestones)
 *  SEDIMENT_NE– NE sedimentary basins (Merti etc., deep confined)
 *  ALLUVIAL   – Major alluvial/lacustrine deposits (Turkana, lake margins)
 */

export interface KenyaHydroPrior {
  province: 'BASEMENT' | 'VOLCANIC' | 'COASTAL' | 'SEDIMENT_NE' | 'ALLUVIAL';
  typicalDepthM: [number, number];   // common completed-borehole depth band
  typicalYieldM3h: [number, number]; // common tested-yield band
  successRate: number;               // historical productive-borehole fraction
  fluorideRisk: 'LOW' | 'MODERATE' | 'HIGH';
  salinityRisk: 'LOW' | 'MODERATE' | 'HIGH';
  note: string;
}

const P: Record<KenyaHydroPrior['province'], Omit<KenyaHydroPrior, 'province'>> = {
  BASEMENT: {
    typicalDepthM: [40, 100], typicalYieldM3h: [0.5, 3], successRate: 0.70,
    fluorideRisk: 'MODERATE', salinityRisk: 'LOW',
    note: 'Weathered/fractured basement — yield highly siting-dependent; target saprolite base + fracture zones.',
  },
  VOLCANIC: {
    typicalDepthM: [80, 250], typicalYieldM3h: [1, 10], successRate: 0.80,
    fluorideRisk: 'HIGH', salinityRisk: 'MODERATE',
    note: 'Rift/volcanic pile — deeper targets, better yields, but geogenic fluoride frequently exceeds WHO 1.5 mg/L.',
  },
  COASTAL: {
    typicalDepthM: [20, 80], typicalYieldM3h: [2, 10], successRate: 0.85,
    fluorideRisk: 'LOW', salinityRisk: 'HIGH',
    note: 'Coastal sands/limestones — shallow productive aquifers; saline intrusion risk near shore; corrosion-aware design.',
  },
  SEDIMENT_NE: {
    typicalDepthM: [80, 250], typicalYieldM3h: [2, 15], successRate: 0.75,
    fluorideRisk: 'MODERATE', salinityRisk: 'HIGH',
    note: 'NE sedimentary basins (incl. Merti aquifer) — deep confined targets; salinity variable, test before equipping.',
  },
  ALLUVIAL: {
    typicalDepthM: [20, 60], typicalYieldM3h: [1, 8], successRate: 0.75,
    fluorideRisk: 'HIGH', salinityRisk: 'MODERATE',
    note: 'Alluvial/lacustrine — shallow strikes possible; lateral variability high; lake-margin fluoride/salinity risk.',
  },
};

/** county-name (lowercase, apostrophes stripped) → province */
const COUNTY_PROVINCE: Record<string, KenyaHydroPrior['province']> = {
  // Basement (central-east, western, Nyanza, southeast)
  muranga: 'BASEMENT', kirinyaga: 'VOLCANIC', embu: 'BASEMENT', 'tharaka-nithi': 'BASEMENT',
  machakos: 'BASEMENT', makueni: 'BASEMENT', kitui: 'BASEMENT', 'taita-taveta': 'BASEMENT',
  kakamega: 'BASEMENT', vihiga: 'BASEMENT', bungoma: 'BASEMENT', busia: 'BASEMENT',
  siaya: 'BASEMENT', kisumu: 'BASEMENT', 'homa-bay': 'BASEMENT', migori: 'BASEMENT',
  kisii: 'BASEMENT', nyamira: 'BASEMENT', 'trans-nzoia': 'BASEMENT', 'west-pokot': 'BASEMENT',
  // Volcanic (Rift + central highlands + slopes of Mt Kenya/Aberdares)
  nairobi: 'VOLCANIC', kiambu: 'VOLCANIC', nyeri: 'VOLCANIC', nyandarua: 'VOLCANIC',
  nakuru: 'VOLCANIC', kericho: 'VOLCANIC', bomet: 'VOLCANIC', narok: 'VOLCANIC',
  kajiado: 'VOLCANIC', 'uasin-gishu': 'VOLCANIC', nandi: 'VOLCANIC',
  'elgeyo-marakwet': 'VOLCANIC', baringo: 'VOLCANIC', laikipia: 'VOLCANIC',
  meru: 'VOLCANIC', samburu: 'BASEMENT',
  // Coastal sedimentary
  mombasa: 'COASTAL', kilifi: 'COASTAL', kwale: 'COASTAL', lamu: 'COASTAL', 'tana-river': 'SEDIMENT_NE',
  // NE sedimentary
  garissa: 'SEDIMENT_NE', wajir: 'SEDIMENT_NE', mandera: 'SEDIMENT_NE',
  isiolo: 'SEDIMENT_NE', marsabit: 'VOLCANIC',
  // Alluvial / lacustrine
  turkana: 'ALLUVIAL',
};

const norm = (s: string) => s.toLowerCase().replace(/['`´’]/g, '').replace(/\s+county\s*$/i, '').trim().replace(/\s+/g, '-');

/** Look up the hydrogeological prior for a Kenyan county (name or slug). */
export function getKenyaHydroPrior(county?: string, countryCode?: string): (KenyaHydroPrior & { county: string }) | null {
  if (!county) return null;
  if (countryCode && countryCode.toUpperCase() !== 'KE') return null;
  const key = norm(county);
  const province = COUNTY_PROVINCE[key];
  if (!province) return null;
  return { county, province, ...P[province] };
}
