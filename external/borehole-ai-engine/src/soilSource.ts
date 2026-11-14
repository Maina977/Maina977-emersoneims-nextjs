/**
 * Soil data source for AquaScan (P0-C, 2026-11-14).
 *
 * The ISRIC SoilGrids REST API is disabled in the analysis path. ISRIC's own
 * documentation (read 13 Nov 2026) says the service is "temporarily paused",
 * is a beta with no uptime guarantee, and has a fair-use limit of 5 calls per
 * minute, and recommends WCS or WebDAV for anything beyond one-off queries.
 * Results depended on whether it happened to answer (Kitale: 70 m vs 61 m in
 * two runs of the same inputs), so the same site gave contradictory reports.
 *
 * Until a versioned Kenya soil extract is hosted (see
 * AQUASCAN-SOIL-DATA-ARCHITECTURE.md), soil is reported as INSUFFICIENT
 * EVIDENCE every time: no live call, no default values, no regional averages.
 * Identical inputs then give identical outputs.
 */
export const SOILGRIDS_REST_ENABLED = false;

export const SOIL_SOURCE_VERSION = 'soil-source 2026-11-14 (SoilGrids REST disabled; Kenya extract pending)';

export const SOIL_INSUFFICIENT_EVIDENCE =
  'INSUFFICIENT EVIDENCE: no soil data. The ISRIC SoilGrids REST service is paused by ISRIC, and the versioned Kenya soil dataset is not yet in place. Soil is confirmed only by drilling or a site soil test.';
